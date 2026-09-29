// SQLite path normalization (contract pinned by tests/db-path.test.ts).
//
// The Prisma CLI resolves relative `file:` URLs against prisma/schema.prisma;
// the runtime must follow the SAME rule so `next dev`, `next build` and the
// standalone server all land on <repo>/db/custom.db regardless of the
// process working directory.
//
// Anchor order:
//  1. Next standalone output — `server.js` runs `process.chdir()` into
//     .next/standalone, whose traced prisma/schema.prisma copy would
//     otherwise capture the CWD rule. Recognize that folder and return the
//     real repo two levels up.
//  2. This module's own repo root (validated by the source file existing
//     on disk — the standalone bundle rewrites import.meta.url into a
//     virtual path that must be ignored).
//  3. process.cwd() as a last resort.

import { existsSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

function basename(p: string): string {
  return p.split(/[\\/]/).filter(Boolean).pop() ?? "";
}

function repoRootFromModule(): string | null {
  try {
    const here = dirname(fileURLToPath(import.meta.url)); // <repo>/src/lib
    const root = resolve(here, "..", "..");
    if (existsSync(join(root, "prisma", "schema.prisma"))) return root;
  } catch {
    // import.meta.url unavailable (unusual runtime) — fall through.
  }
  return null;
}

function repoRootFromStandaloneCwd(): string | null {
  try {
    const cwd = process.cwd();
    if (!cwd.includes(".next")) return null;
    // <repo>/.next/standalone -> <repo>
    const root = resolve(cwd, "..", "..");
    if (existsSync(join(root, "prisma", "schema.prisma"))) return root;
  } catch {
    // ignore
  }
  return null;
}

export function resolveDatabaseUrl(rawUrl: string): string {
  if (!rawUrl.startsWith("file:")) return rawUrl; // postgres etc. — pass through
  const ref = rawUrl.slice("file:".length);
  if (!ref || ref.startsWith("/")) return rawUrl; // absolute or in-memory

  const anchors: Array<() => string | null> = [
    repoRootFromStandaloneCwd,
    repoRootFromModule,
    () => process.cwd(),
  ];

  for (const anchor of anchors) {
    const root = anchor();
    if (!root) continue;
    const candidate = join(root, "prisma", ref); // mirror the CLI rule
    if (existsSync(candidate) || existsSync(dirname(candidate))) {
      return `file:${candidate}`;
    }
  }
  return rawUrl;
}

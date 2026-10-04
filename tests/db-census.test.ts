import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-53 pins (S53-P2, N-53b): the census seam. A raw
// `new PrismaClient()` run from the repo root opens the SANDBOX-ROOT
// mirror db — not the repo's — under BOTH node (the relative `file:` URL
// resolves against the process CWD, not the schema dir) and bun (which
// additionally absolutizes the .env value against the .env location).
// Session-53 proved it live: the orchestrator's own intake census read
// the mirror (it carries the s51 zombie server's probe event), briefly
// misread it as repo-db residue, and only `PRAGMA database_list` exposed
// the engine's true file — the repo db was pristine all along. The
// systemic closure: DB censuses go through the app's own client
// (`src/lib/db` — the SAME singleton the running server uses,
// re-anchored by runtimeDatabaseUrl) and PRINT the resolved path, so a
// count is always bound to a named file.
// scripts/census.ts is that census, wired as `bun run db:census`.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const census = () => stripComments(read("scripts/census.ts") ?? "");
const pkg = () => JSON.parse(read("package.json") ?? "{}") as {
  scripts?: Record<string, string>;
};

describe("session-53: the census seam (S53-P2, N-53b)", () => {
  it("scripts/census.ts exists and counts through the app's db singleton — never a raw PrismaClient", () => {
    const src = census();
    expect(src.length).toBeGreaterThan(0);
    // The whole point of the seam: the census uses the SAME client the
    // app uses (src/lib/db re-anchors through runtimeDatabaseUrl), so it
    // can never be misdirected at a mirror db by ambient env.
    expect(src).toMatch(/from "\.\.\/src\/lib\/db"/);
    expect(src).not.toMatch(/new PrismaClient/);
  });

  it("prints the resolved database URL — a count without its path is not evidence", () => {
    const src = census();
    expect(src).toMatch(/runtimeDatabaseUrl/);
    // The URL is surfaced to the operator (console.log), not just used
    // internally.
    expect(src).toMatch(/console\.(log|info)/);
  });

  it("carries the seed-contract expectations and fails on drift (the N-53a guard)", () => {
    const src = census();
    // The prisma/seed.ts row counts (15 contacts / 24 leads / 10
    // accounts / 23 activities / 12 events + 4 users) + a non-zero exit
    // on mismatch — the probe-residue check the s51/s52 batteries
    // believed they had.
    expect(src).toMatch(/contacts:\s*15/);
    expect(src).toMatch(/leads:\s*24/);
    expect(src).toMatch(/accounts:\s*10/);
    expect(src).toMatch(/activities:\s*23/);
    expect(src).toMatch(/events:\s*12/);
    expect(src).toMatch(/users:\s*4/);
    expect(src).toMatch(/process\.exit\(1\)/);
  });

  it("the db:census package script is wired", () => {
    expect(pkg().scripts?.["db:census"]).toBe("bun scripts/census.ts");
  });
});

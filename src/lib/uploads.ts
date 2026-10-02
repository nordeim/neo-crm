import { existsSync, mkdirSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

// Session-30 (S30-P1): the uploads seam's path + vocabulary helpers.
//
// The reference's four UploadFile call sites (bundle index-DZ-xbrIm.js)
// funnel through the base44 files CDN; our self-hosted mirror stores the
// bytes under <repo>/uploads/ — gitignored like db/ — and serves them
// from /api/uploads/<name>. The repo-root resolution mirrors
// src/lib/db-path.ts (the validated-anchor pattern) so next dev, next
// build and the standalone server all land on the same folder regardless
// of the process working directory.

export const UPLOADS_DIR_NAME = "uploads";

/**
 * The 5MB ceiling the reference's own profile hint advertises
 * ("JPG, PNG or GIF. Max 5MB.").
 */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Stored names are `<32-hex>.<ext>` — the GET route accepts exactly this
 * charset (no separators, no traversal surface).
 */
export const UPLOAD_NAME_RE = /^[0-9a-f]{32}\.(jpg|png|webp|gif)$/;

/** Content types for the extensions the POST route writes. */
export const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

/** The extension written for each accepted MIME type. */
export const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function validatedRoot(candidate: string): string | null {
  return existsSync(join(candidate, "prisma", "schema.prisma")) ? candidate : null;
}

function repoRoot(): string {
  try {
    // Anchor 1: this module's own repo root (<repo>/src/lib -> <repo>).
    const here = dirname(fileURLToPath(import.meta.url));
    const root = validatedRoot(resolve(here, "..", ".."));
    if (root) return root;
  } catch {
    // import.meta.url unavailable — fall through.
  }
  // Anchor 2: the standalone server's chdir'd CWD
  // (<repo>/.next/standalone -> <repo>).
  const cwd = process.cwd();
  if (cwd.includes(".next")) {
    const root = validatedRoot(resolve(cwd, "..", ".."));
    if (root) return root;
  }
  return cwd;
}

/**
 * Absolute path of the uploads directory, created on demand (first
 * upload) — the same contract as db-path's urlForRoot.
 */
export function uploadsDir(): string {
  const dir = join(repoRoot(), UPLOADS_DIR_NAME);
  mkdirSync(dir, { recursive: true });
  return dir;
}

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-30 pins (S30-P1): the UPLOAD SEAM — our self-hosted mirror of
// the reference's base44 UploadFile integration. The reference's four
// call sites (bundle index-DZ-xbrIm.js, two live-exercised) all funnel
// through `rt.integrations.Core.UploadFile({file})` → `{file_url}`; our
// clone serves the same contract from its own API: POST /api/upload
// (multipart, the image-type check the reference enforces client-side,
// the 5MB ceiling its own hint advertises) + GET /api/uploads/<name>
// (public — the reference's file_urls are public CDN links). The stored
// files live under <repo>/uploads/ — gitignored like db/.
//
// The decisive contracts:
// - POST: session-guarded, multipart formData, the file must exist, be
//   an image (type.startsWith("image/") — the reference's own check,
//   server-enforced), and ≤ 5MB; written as <32-hex>.<ext>; returns
//   {file_url: "/api/uploads/<name>"}.
// - GET: serves the bytes with the stored content-type, 404 unknown.
// - uploads/ is gitignored (like db/).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const postRoute = () => stripComments(read("src/app/api/upload/route.ts") ?? "");
const getRoute = () =>
  stripComments(read("src/app/api/uploads/[name]/route.ts") ?? "");
const uploadsLib = () => stripComments(read("src/lib/uploads.ts") ?? "");
const gitignore = () => read(".gitignore") ?? "";

describe("session-30: the upload POST route exists and is guarded", () => {
  it("src/app/api/upload/route.ts exists", () => {
    expect(read("src/app/api/upload/route.ts")).not.toBeNull();
  });

  it("requires a session (the reference's files API is app-scoped)", () => {
    const src = postRoute();
    expect(src).toMatch(/requireSession\(\)/);
  });

  it("parses multipart formData", () => {
    const src = postRoute();
    expect(src).toMatch(/formData\(\)/);
    expect(src).toMatch(/get\("file"\)/);
  });

  it("rejects non-images with the reference's own check, server-enforced", () => {
    const src = postRoute();
    expect(src).toMatch(/startsWith\("image\/"\)/);
  });

  it("enforces the 5MB ceiling the reference's own hint advertises", () => {
    expect(uploadsLib()).toMatch(/5\s*\*\s*1024\s*\*\s*1024/);
    expect(postRoute()).toMatch(/MAX_UPLOAD_BYTES/);
  });

  it("stores under the repo's uploads/ directory with a random name + original extension", () => {
    const src = postRoute();
    expect(src).toMatch(/uploads/);
    expect(src).toMatch(/randomUUID|crypto\.randomBytes|nanoid/);
  });

  it("returns { file_url } — the reference's UploadFile contract", () => {
    const src = postRoute();
    expect(src).toMatch(/file_url/);
    expect(src).toMatch(/\/api\/uploads\//);
  });
});

describe("session-30: the uploads GET route serves the bytes", () => {
  it("src/app/api/uploads/[name]/route.ts exists", () => {
    expect(read("src/app/api/uploads/[name]/route.ts")).not.toBeNull();
  });

  it("serves with the stored content-type (the jpg/png/webp/gif map)", () => {
    expect(uploadsLib()).toMatch(/image\/jpeg|image\/png/);
    expect(getRoute()).toMatch(/Content-Type/);
    expect(getRoute()).toMatch(/CONTENT_TYPES/);
  });

  it("404s unknown names (no traversal — the name charset is pinned)", () => {
    const src = getRoute();
    expect(src).toMatch(/404|NotFound|notFound/);
  });
});

describe("session-30: the uploads directory is gitignored like db/", () => {
  // Session-35: the pin was RE-ANCHORED. The original `^uploads/$` form
  // encoded the DEFECT — an unanchored gitignore segment matches the same
  // directory name at ANY depth, so it silently ignored
  // src/app/api/uploads/ too, and the GET route above was never committed
  // (authored session-30, lost on every fresh clone; the long-lived
  // sandbox kept it alive as an untracked file while the repo shipped
  // broken). The anchored `/uploads/` ignores ONLY the repo-root runtime
  // folder.
  it(".gitignore carries the ANCHORED /uploads/ entry (never the unanchored form)", () => {
    expect(gitignore()).toMatch(/^\/uploads\/$/m);
    expect(gitignore()).not.toMatch(/^uploads\/$/m);
  });
});

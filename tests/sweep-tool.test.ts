// Session-92 pins (S92-P5): the sweep tool — the s91 screenshot-diff
// sweep promoted into the repo as a ONE-COMMAND regression (the s91
// session's first-listed suggested next: "the screenshot-diff sweep is
// now a one-command regression — scripts/zero-data.ts + the
// capture/diff scripts, worth promoting into the repo as a tool").
//
// The contract: `bun run sweep` boots (or reuses) the dev server on
// :3000, drives OUR app to the zero-data state (the reference's own
// standing state — its workspace has been empty for 13 censuses), logs
// into BOTH apps, captures the 9 pages per app at 1440x900, pairwise
// pixel-diffs them (per-channel tolerance 12 — the s91 value), prints
// the % table, and restores the seed. ZERO new dependencies: the
// capture rides the existing @playwright/test chromium; the pixel diff
// decodes both PNGs in a browser canvas (getImageData) and runs the
// PURE diffPixels seam — the same function these pins exercise in
// node. The standing explained diffs (settings ~4.7% picklist-data,
// contacts ~0.5% lucide-noise, dashboard ~0.3% chart-artifact) are
// REPORTED, not failed — the tool is a drift REPORT; pass --max-diff
// to gate a threshold in CI-style use.

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

const sweep = () => import("../scripts/sweep");

describe("session-92 (S92-P5): the sweep tool — the one-command regression", () => {
  it("exports the 9-page sweep list (the s91 sweep set, route paths verbatim)", async () => {
    const { PAGES } = await sweep();
    expect(PAGES).toEqual([
      { name: "dashboard", path: "/" },
      { name: "accounts", path: "/accounts" },
      { name: "contacts", path: "/contacts" },
      { name: "leads", path: "/leads" },
      { name: "calendar", path: "/calendar" },
      { name: "activities", path: "/activities" },
      { name: "reports", path: "/reports" },
      { name: "settings", path: "/settings" },
      { name: "profile", path: "/Profile" },
    ]);
  });

  it("the per-channel tolerance is 12 (the s91 value — anti-aliasing-safe)", async () => {
    const { TOLERANCE } = await sweep();
    expect(TOLERANCE).toBe(12);
  });

  it("diffPixels: identical images diff 0.00%", async () => {
    const { diffPixels } = await sweep();
    const px = new Uint8ClampedArray(4 * 4 * 4).fill(128);
    const r = diffPixels(px, px.slice(), 12, 4, 4);
    expect(r.diffPx).toBe(0);
    expect(r.pct).toBe(0);
  });

  it("diffPixels: a 2-pixel shift counts exactly those pixels (tolerance-aware)", async () => {
    const { diffPixels } = await sweep();
    const a = new Uint8ClampedArray(4 * 4 * 4).fill(100);
    const b = a.slice();
    b[0] = 200; // pixel 0, channel 0 — 100 over tolerance
    b[16 + 1] = 200; // pixel 4, channel 1
    b[8] = 108; // pixel 2, channel 0 — 8 under tolerance: NOT a diff
    const r = diffPixels(a, b, 12, 4, 4);
    expect(r.diffPx).toBe(2);
    expect(r.total).toBe(16);
    expect(r.pct).toBeCloseTo(12.5, 6);
  });

  it("diffPixels: size mismatch throws (a count without its geometry is not evidence)", async () => {
    const { diffPixels } = await sweep();
    const a = new Uint8ClampedArray(16);
    const b = new Uint8ClampedArray(64);
    expect(() => diffPixels(a, b, 12, 4, 4)).toThrow(/size/);
  });

  it("package.json gains the `sweep` alias (bun run sweep — the one command)", () => {
    const pkg = JSON.parse(read("package.json")) as { scripts: Record<string, string> };
    expect(pkg.scripts.sweep).toBe("bun scripts/sweep.ts");
  });

  it("the tool drives OUR app through scripts/zero-data.ts (the s91 tool reused, not duplicated)", () => {
    const src = read("scripts/sweep.ts");
    expect(src).toContain("zero-data.ts");
    expect(src).toContain("db:seed");
  });

  it("the pixel diff runs in a browser canvas (getImageData — zero new dependencies, the deps census intact)", () => {
    const src = read("scripts/sweep.ts");
    expect(src).toContain("getImageData");
    // the PNG decode rides the browser (canvas), never a node decoder
    expect(src).not.toMatch(/require\(["']pngjs|from ["']pngjs|pixelmatch/);
  });

  // Session-93 (F-A): the fresh-clone typecheck contract. Next.js 16's
  // next/types/global.d.ts augments NodeJS.ProcessEnv with a REQUIRED
  // readonly NODE_ENV ('development' | 'production' | 'test') in every
  // program that imports next/server — a widened index-signature record
  // cannot satisfy that required member, so spawnSync's env option
  // rejects it and `tsc --noEmit` fails from a FRESH CLONE (the s92
  // gate's tsc-0 was masked by its sandbox's incremental build state).
  // The env object must keep its inferred NodeJS.ProcessEnv type.
  it("the child-process env keeps the inferred NodeJS.ProcessEnv type (the fresh-clone tsc gate — F-A)", () => {
    const src = read("scripts/sweep.ts");
    // the FIXED construction: the spread inferred as ProcessEnv, no cast
    expect(src).toContain("const zEnv = { ...process.env };");
    // the cast that broke the fresh-clone gate must stay retired — the
    // widened record loses the required NODE_ENV member under the
    // Next 16 ProcessEnv augmentation
    expect(src).not.toMatch(/as Record<string, string \| undefined>/);
  });

  // Session-94 (S94-P0): the phone-width sweep mode — the s93
  // suggested next ("extend the sweep tool with a --width 390
  // phone-width page-sweep mode — the rotation method productized").
  // The dialog (s92), popover/menu (s93) and tabs (s94) families were
  // walked MANUALLY at TRUE 390x844 across three sessions; the sweep
  // now runs the same 9-page zero-data pairwise diff at ANY viewport:
  // `bun run sweep -- --width 390 --height 844`.
  it("parses --width/--height (defaults 1440x900) and feeds the capture viewport", () => {
    const src = read("scripts/sweep.ts");
    expect(src).toContain('"--width"');
    expect(src).toContain('"--height"');
    // the capture context rides the parsed values — the hardcoded
    // 1440x900 viewport is retired
    expect(src).toContain("viewport: { width: WIDTH, height: HEIGHT }");
    expect(src).not.toContain("viewport: { width: 1440, height: 900 }");
  });

  it("the shots dir is viewport-tagged (a phone run never collides with the desktop shots)", () => {
    const src = read("scripts/sweep.ts");
    // w${WIDTH}x${HEIGHT} — the template literal in the dir construction
    expect(src).toContain("w${WIDTH}x${HEIGHT}");
  });

  it("the per-page content-wait is width-agnostic (main paints at every width — nav links are display:none below md on BOTH apps, so the old nav-a wait would burn its 15s timeout on every page at 390)", () => {
    const src = read("scripts/sweep.ts");
    // prettier wraps `page` and `.locator("main")` across lines — assert
    // the member-form needle (the s93 wrap-repair class)
    expect(src).toContain('.locator("main")');
    // the width-blind selector is retired
    expect(src).not.toContain("nav a, header a");
  });
});

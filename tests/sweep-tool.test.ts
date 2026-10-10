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
  it("exports the 10-page sweep list (the s91 sweep set + the s96 login addition, route paths verbatim)", async () => {
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
      // Session-96 (S96-P0): the login card joins the standing sweep — the
      // reference serves the login card to AUTHENTICATED visitors too
      // (the S23-P2 finding) and ours mirrors it, so the post-login
      // capture works on both apps. The auth surface is now pixel-swept
      // (the form-family walk found the v4 space-y genus living there
      // precisely because /login was never swept).
      { name: "login", path: "/login" },
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

  // Session-95 (S95-P0): the --pages filter — the s94 suggested next
  // ("extend the sweep with a --pages filter for targeted rotation
  // runs"). `bun run sweep -- --pages leads,settings` restricts BOTH
  // the capture and the diff loops to the named pages; a pure seam
  // (parsePagesArg) sits beside PAGES/TOLERANCE/diffPixels so these
  // pins exercise REAL behavior, not strings.
  it("parsePagesArg picks the named subset in PAGES order (request order does not matter)", async () => {
    const { PAGES, parsePagesArg } = await sweep();
    // given out of order — the result is still the PAGES order
    const picked = parsePagesArg(["--pages", "settings,leads"], PAGES);
    expect(picked).toEqual([
      { name: "leads", path: "/leads" },
      { name: "settings", path: "/settings" },
    ]);
  });

  it("parsePagesArg without the flag returns the full list (the default sweep is unchanged)", async () => {
    const { PAGES, parsePagesArg } = await sweep();
    expect(parsePagesArg([], PAGES)).toEqual(PAGES);
    // a lone --pages with a value absent from argv is also the full run
    expect(parsePagesArg(["--width", "390"], PAGES)).toEqual(PAGES);
  });

  it("parsePagesArg fails fast on an unknown name, listing the valid names (a typo must not silently sweep everything)", async () => {
    const { PAGES, parsePagesArg } = await sweep();
    expect(() => parsePagesArg(["--pages", "leads,typo"], PAGES)).toThrow(
      /typo[\s\S]*dashboard|dashboard[\s\S]*typo/,
    );
  });

  it("the sweep wires the seam: main() rides the FILTERED list for BOTH capture and diff, and the header documents --pages", () => {
    const src = read("scripts/sweep.ts");
    // the seam is exported and consumed with the real argv
    expect(src).toContain("parsePagesArg(process.argv, PAGES)");
    // the run rides the filtered variable in BOTH loops
    expect(src).toContain("for (const p of pages) {");
    // the full-list export no longer drives the loops directly
    expect(src).not.toContain("for (const p of PAGES) {");
    // the header documents the flag (the run instructions)
    expect(src).toContain("--pages");
  });

  // Session-96 (S96-P2): the --fail-on-drift mode — the s95 suggested
  // next #2 ("add a --fail-on-drift exit-code mode to the sweep for CI
  // gating — the natural extension of --max-diff"). The global --max-diff
  // gate must sit ABOVE the worst standing genus (settings ~7.5% at phone
  // width), so it can never see a 0.00% page drifting to 5%. The drift
  // gate judges each page against ITS OWN standing baseline + margin.
  it("standingBaseline: the desktop table (the s91–s96 standing genera, generous to run noise)", async () => {
    const { standingBaseline } = await sweep();
    const b = standingBaseline(1440);
    expect(b.settings).toBeGreaterThanOrEqual(4.7);
    expect(b.settings).toBeLessThanOrEqual(5.2);
    expect(b.dashboard).toBeGreaterThanOrEqual(0.3);
    expect(b.contacts).toBeGreaterThanOrEqual(0.4);
    // every PAGES name has a desktop baseline (a new page must join the
    // table deliberately — the fail-fast doctrine)
    const { PAGES } = await sweep();
    for (const p of PAGES) expect(b[p.name]).toBeDefined();
  });

  it("standingBaseline: the phone table covers BOTH walked phone widths (390x844 + 375x812, split at the md breakpoint)", async () => {
    const { standingBaseline } = await sweep();
    const b390 = standingBaseline(390);
    const b375 = standingBaseline(375);
    // the mobile-nav-superset floor (~0.5% at 390, ~0.55% at 375) + the
    // settings picklist genus (7.34/7.52 measured)
    expect(b390.settings).toBeGreaterThanOrEqual(7.3);
    expect(b375.settings).toBeGreaterThanOrEqual(7.5);
    for (const name of ["dashboard", "leads", "reports", "login"])
      expect(b390[name]).toBeGreaterThanOrEqual(0.5);
    // desktop above the md breakpoint
    const { standingBaseline: sb } = await sweep();
    expect(sb(768)).not.toEqual(b390);
    expect(sb(767)).toEqual(b390);
  });

  it("driftVerdict fails a page above ITS OWN baseline+margin and names it (a 0.00% page drifting to 5% fails where a global --max-diff 8 passes)", async () => {
    const { driftVerdict } = await sweep();
    const baselines = { leads: 0.05, settings: 4.9 };
    const v = driftVerdict(
      [
        ["leads", 5.0],
        ["settings", 4.9],
      ],
      baselines,
      0.5,
    );
    expect(v.ok).toBe(false);
    expect(v.failures).toHaveLength(1);
    expect(v.failures[0].page).toBe("leads");
    expect(v.failures[0].pct).toBe(5.0);
    expect(v.failures[0].allowed).toBeCloseTo(0.55, 6);
  });

  it("driftVerdict passes at-baseline rows and treats a missing baseline as 0 (a page must join the table deliberately)", async () => {
    const { driftVerdict } = await sweep();
    expect(
      driftVerdict(
        [
          ["leads", 0.0],
          ["settings", 4.73],
        ],
        { leads: 0.05, settings: 4.9 },
        0.5,
      ).ok,
    ).toBe(true);
    // unknown page: baseline 0 — a drift above the margin fails
    const v = driftVerdict([["brandnew", 0.6]], { leads: 0.05 }, 0.5);
    expect(v.ok).toBe(false);
    expect(v.failures[0].page).toBe("brandnew");
  });

  it("the sweep wires the drift gate: the flag + the margin parse + the exit-1 path after the seed restore, and the header documents it", () => {
    const src = read("scripts/sweep.ts");
    expect(src).toContain('--fail-on-drift');
    expect(src).toContain("--drift-margin");
    // the default margin
    expect(src).toContain(": 0.5");
    // the verdict rides the measured rows + the width-class baselines
    expect(src).toContain("driftVerdict(rows, standingBaseline(WIDTH), driftMargin)");
    // the gate fails AFTER the seed restore (the --max-diff ordering)
    expect(src).toMatch(/db:seed[\s\S]*?driftVerdict/);
  });
});

describe("session-97 (S97-P0): the TABLET baseline class — the md/lg banding", () => {
  it("standingBaseline: the 3-way split — <768 phone, <1024 tablet, else desktop (the md/lg breakpoints)", async () => {
    const { standingBaseline } = await sweep();
    const phone = standingBaseline(390);
    const tablet = standingBaseline(768);
    const desktop = standingBaseline(1440);
    // the boundaries
    expect(standingBaseline(767)).toEqual(phone);
    expect(standingBaseline(768)).toEqual(tablet);
    expect(standingBaseline(1023)).toEqual(tablet);
    expect(standingBaseline(1024)).toEqual(desktop);
    // three DISTINCT classes
    expect(tablet).not.toEqual(phone);
    expect(tablet).not.toEqual(desktop);
  });

  it("standingBaseline: the tablet table carries the maiden 768x1024 genera (accounts overflow · settings picklist · login logo)", async () => {
    const { standingBaseline } = await sweep();
    const b = standingBaseline(768);
    // the maiden run measured accounts 0.72 (the s95 overflow genus at
    // the md boundary — the reference's bare flex-1 poke-out vs our
    // min-w-0 in-box scroll), settings 5.19 (the picklist genus at the
    // tablet share), login 0.44 (the logo genus at the tablet share)
    expect(b.accounts).toBeGreaterThanOrEqual(0.7);
    expect(b.accounts).toBeLessThanOrEqual(0.9);
    expect(b.settings).toBeGreaterThanOrEqual(5.0);
    expect(b.settings).toBeLessThanOrEqual(5.7);
    expect(b.login).toBeGreaterThanOrEqual(0.4);
    expect(b.login).toBeLessThanOrEqual(0.7);
    // every PAGES name has a tablet baseline (the fail-fast doctrine)
    const { PAGES } = await sweep();
    for (const p of PAGES) expect(b[p.name]).toBeDefined();
  });

  it("driftVerdict: the tablet accounts row passes ITS OWN class where the desktop baseline would fail it (why the class exists)", async () => {
    const { driftVerdict, standingBaseline } = await sweep();
    // the measured maiden row: accounts 0.72 at 768x1024
    const rows = [["accounts", 0.72]] as Array<[string, number]>;
    expect(driftVerdict(rows, standingBaseline(768), 0.5).ok).toBe(true);
    // judged against the DESKTOP table (accounts 0.1) it would FAIL —
    // the 0.72 overflow genus is tablet-specific, not drift
    expect(driftVerdict(rows, standingBaseline(1440), 0.5).ok).toBe(false);
  });
});

describe("session-97 (S97-P1): the numeric-arg fail-fast (B-97a2)", () => {
  it("parseNumberArg: absent flag returns the fallback (the default run is unchanged)", async () => {
    const { parseNumberArg } = await sweep();
    expect(parseNumberArg([], "--drift-margin", 0.5)).toBe(0.5);
    expect(parseNumberArg(["--pages", "leads"], "--width", 1440)).toBe(1440);
  });

  it("parseNumberArg: a present, valid value returns it", async () => {
    const { parseNumberArg } = await sweep();
    expect(parseNumberArg(["--drift-margin", "1.5"], "--drift-margin", 0.5)).toBe(1.5);
    expect(parseNumberArg(["--width", "390"], "--width", 1440)).toBe(390);
  });

  it("parseNumberArg: a MISSING value fails fast (NaN must never silently disarm the gate)", async () => {
    const { parseNumberArg } = await sweep();
    // --drift-margin as the LAST token — Number(undefined) = NaN, and
    // `pct > NaN` is always false: the gate would pass everything
    expect(() => parseNumberArg(["--fail-on-drift", "--drift-margin"], "--drift-margin", 0.5)).toThrow(
      /--drift-margin/,
    );
  });

  it("parseNumberArg: a NON-NUMERIC value fails fast listing the expected form", async () => {
    const { parseNumberArg } = await sweep();
    expect(() => parseNumberArg(["--drift-margin", "zero"], "--drift-margin", 0.5)).toThrow(
      /--drift-margin[\s\S]*number/,
    );
    expect(() => parseNumberArg(["--width", "wide"], "--width", 1440)).toThrow(
      /--width[\s\S]*number/,
    );
  });

  it("the sweep wires the seam: ALL FOUR numeric flags route through parseNumberArg (the --pages typo doctrine extended)", () => {
    const src = read("scripts/sweep.ts");
    expect(src).toContain('parseNumberArg(process.argv, "--drift-margin", 0.5)');
    expect(src).toContain('parseNumberArg(process.argv, "--max-diff", null)');
    expect(src).toContain('parseNumberArg(process.argv, "--width", 1440)');
    expect(src).toContain('parseNumberArg(process.argv, "--height", 900)');
  });

  it("the stale 9-page comments are gone (the ten-page sweep, N-97a1)", () => {
    const src = read("scripts/sweep.ts");
    expect(src).not.toMatch(/the (full |same )?9-page sweep/);
    // the corrected phrasing present
    expect(src).toMatch(/ten-page|10-page/);
  });
});

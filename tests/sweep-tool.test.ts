// Session-92 pins (S92-P5): the sweep tool — the s91 screenshot-diff
// sweep promoted into the repo as a ONE-COMMAND regression (the s91
// session's first-listed suggested next: "the screenshot-diff sweep is
// now a one-command regression — scripts/zero-data.ts + the
// capture/diff scripts, worth promoting into the repo as a tool").
//
// The contract: `bun run sweep` boots (or reuses) the dev server on
// :3000, drives OUR app to the zero-data state (the reference's own
// standing state — its workspace has been empty for 13 censuses), logs
// into BOTH apps, captures the ten pages per app at 1440x900, pairwise
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
  // now runs the same ten-page zero-data pairwise diff at ANY viewport:
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
  it("standingBaseline: the 4-way split — <768 phone, <1024 tablet, <1280 landscape, else desktop (the md/lg/xl breakpoints; the s99 re-anchor: 1024 is NOT desktop — the maiden landscape run carries its own genera)", async () => {
    const { standingBaseline } = await sweep();
    const phone = standingBaseline(390);
    const tablet = standingBaseline(768);
    const landscape = standingBaseline(1024);
    const desktop = standingBaseline(1440);
    // the boundaries
    expect(standingBaseline(767)).toEqual(phone);
    expect(standingBaseline(768)).toEqual(tablet);
    expect(standingBaseline(1023)).toEqual(tablet);
    expect(standingBaseline(1024)).toEqual(landscape);
    expect(standingBaseline(1279)).toEqual(landscape);
    expect(standingBaseline(1280)).toEqual(desktop);
    // four DISTINCT classes
    expect(tablet).not.toEqual(phone);
    expect(landscape).not.toEqual(phone);
    expect(landscape).not.toEqual(tablet);
    expect(landscape).not.toEqual(desktop);
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

describe("session-99 (S99-P0): the LANDSCAPE baseline class — the lg/xl banding", () => {
  it("standingBaseline: the landscape table carries the maiden 1024x768 genera (the accounts overflow genus at its lg share · settings picklist · login logo)", async () => {
    const { standingBaseline } = await sweep();
    const b = standingBaseline(1024);
    // the maiden run measured accounts 2.43 (F-99c1 — the overflow genus
    // at the lg band: the reference's bare flex-1 content FLOORS at its
    // table's min-content 535, SQUEEZES its own w-80 rail 320->183, and
    // pokes main +6px past the viewport; ours the min-w-0 in-box scroll
    // + the full 320 rail — the documented consistent pattern), settings
    // 4.74 (the picklist genus at the landscape share), login 0.44 (the
    // logo genus), dashboard 0.47 (the chart artifact at its lg share)
    expect(b.accounts).toBeGreaterThanOrEqual(2.3);
    expect(b.accounts).toBeLessThanOrEqual(2.7);
    expect(b.settings).toBeGreaterThanOrEqual(4.5);
    expect(b.settings).toBeLessThanOrEqual(5.2);
    expect(b.login).toBeGreaterThanOrEqual(0.4);
    expect(b.login).toBeLessThanOrEqual(0.7);
    expect(b.dashboard).toBeGreaterThanOrEqual(0.4);
    expect(b.dashboard).toBeLessThanOrEqual(0.8);
    // every PAGES name has a landscape baseline (the fail-fast doctrine)
    const { PAGES } = await sweep();
    for (const p of PAGES) expect(b[p.name]).toBeDefined();
  });

  it("driftVerdict: the landscape accounts row passes ITS OWN class where the desktop baseline would fail it (the 2.43 genus is lg-band-specific, not drift)", async () => {
    const { driftVerdict, standingBaseline } = await sweep();
    // the measured maiden row: accounts 2.43 at 1024x768
    const rows = [["accounts", 2.43]] as Array<[string, number]>;
    expect(driftVerdict(rows, standingBaseline(1024), 0.5).ok).toBe(true);
    // judged against the DESKTOP table (accounts 0.1) it would FAIL —
    // and against the TABLET table (accounts 0.8) too
    expect(driftVerdict(rows, standingBaseline(1440), 0.5).ok).toBe(false);
    expect(driftVerdict(rows, standingBaseline(768), 0.5).ok).toBe(false);
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

  it("the sweep wires the seam: ALL FIVE numeric flags route through parseNumberArg (the --pages typo doctrine extended; s100: the fifth flag --cluster-gap)", () => {
    const src = read("scripts/sweep.ts");
    expect(src).toContain('parseNumberArg(process.argv, "--drift-margin", 0.5)');
    expect(src).toContain('parseNumberArg(process.argv, "--max-diff", null)');
    expect(src).toContain('parseNumberArg(process.argv, "--width", 1440)');
    expect(src).toContain('parseNumberArg(process.argv, "--height", 900)');
    expect(src).toContain('parseNumberArg(process.argv, "--cluster-gap", 16)');
  });

  it("the stale nine-page comments are gone from sweep.ts (N-97a1 — succeeded by the s98 WIDENED guard below)", () => {
    // s98 (F-98a1): this s97 guard read only sweep.ts with a pattern
    // that missed the bare-count form — the session-98 describe below
    // replaces it with the two-file widened guard. This local pin keeps
    // the sweep.ts half.
    const src = read("scripts/sweep.ts");
    expect(src).not.toMatch(new RegExp("the (full |same )?9" + "-page sweep"));
    // the corrected phrasing present
    expect(src).toMatch(/ten-page|10-page/);
  });
});

describe("session-98 (F-98a1/B-98a1/N-98a1): the sweep docs + the per-class print", () => {
  it("the stale nine-page phrasing is gone from BOTH the tool and this suite (the WIDENED F-98a1 guard)", () => {
    // F-98a1: the s97 guard read only scripts/sweep.ts with a pattern
    // that missed the bare-count form — and the stale phrasing survived
    // in BOTH this file's header and the phone-mode comment. The guard
    // now reads both files. The pattern is string-concatenated so this
    // pin cannot match its own guard text.
    const stale = new RegExp("\\b9" + "-page\\b|the 9\\s+pages");
    const sweepSrc = read("scripts/sweep.ts");
    const self = readFileSync(path.resolve(import.meta.dirname, "sweep-tool.test.ts"), "utf8");
    expect(sweepSrc, "scripts/sweep.ts").not.toMatch(stale);
    expect(self, "sweep-tool.test.ts").not.toMatch(stale);
    expect(sweepSrc).toMatch(/ten pages|ten-page/);
  });

  it("the STANDING_BASELINES doc comment describes the 4-way class split (the B-98a1 pin re-anchored at s99 — no more three-way wording)", () => {
    const src = read("scripts/sweep.ts");
    const at = src.indexOf("export const STANDING_BASELINES");
    expect(at).toBeGreaterThan(-1);
    const doc = src.slice(Math.max(0, at - 1100), at);
    expect(doc).toMatch(/tablet/);
    expect(doc).toMatch(/1024/);
    expect(doc).toMatch(/landscape/);
    expect(doc).toMatch(/1280/);
    expect(doc).not.toMatch(/desktop otherwise/);
  });

  it("standingExplained(width): the per-class genera line (N-98a1 — the desktop trio no longer prints on phone runs; s99: the fourth class)", async () => {
    const { standingExplained } = await sweep();
    const desktop = standingExplained(1440);
    const phone = standingExplained(390);
    const tablet = standingExplained(768);
    const landscape = standingExplained(1024);
    // the desktop line keeps the standing trio
    expect(desktop).toMatch(/picklist/);
    expect(desktop).toMatch(/lucide/);
    // the phone line carries the mobile-nav floor + the phone settings share
    expect(phone).toMatch(/mobile-nav|floor/);
    expect(phone).toMatch(/7\.3/);
    expect(phone).not.toMatch(/~4\.7/);
    // the tablet line carries the accounts overflow genus + its shares
    expect(tablet).toMatch(/overflow/);
    expect(tablet).toMatch(/5\.2/);
    expect(tablet).not.toMatch(/~4\.7/);
    // the landscape line carries the lg-band overflow genus (the rail
    // squeeze decode) + its shares
    expect(landscape).toMatch(/overflow/);
    expect(landscape).toMatch(/rail/);
    expect(landscape).toMatch(/2\.4/);
    expect(landscape).not.toEqual(desktop);
    // the class boundaries mirror standingBaseline
    expect(standingExplained(767)).toEqual(phone);
    expect(standingExplained(768)).toEqual(tablet);
    expect(standingExplained(1024)).toEqual(landscape);
    expect(standingExplained(1280)).toEqual(desktop);
  });

  it("the print wires the seam (the runtime call, not a hardcoded string)", () => {
    const src = read("scripts/sweep.ts");
    expect(src).toMatch(/standingExplained\(WIDTH\)/);
    // the old unconditional desktop line is gone
    expect(src).not.toMatch(/standing explained: settings ~4\.7% picklist-data · contacts ~0\.5% lucide superset/);
  });
});

// Session-100 pins (S100-P0/P1): the diff-clustering decode promoted
// into the tool (the twice-suggested #1 — the s98 suggested next #2,
// re-suggested at s99). Every genus hunt since s95 decoded its deltas
// with one-off bucket-diff probes; clusterDiff + --clusters makes that
// decode a one-flag feature. The seam is PURE (the same contract as
// diffPixels: identical tolerance semantics, size-mismatch throw) and
// the CLI wiring rides the parseNumberArg fail-fast family.
describe("session-100 (S100-P0/P1): the diff-clustering decode", () => {
  // two same-size buffers; paint() diverges a block of b from the base
  // fill by a channel delta far above the tolerance
  const mk = (w: number, h: number) => new Uint8ClampedArray(w * h * 4).fill(100);
  const paint = (b: Uint8ClampedArray, w: number, x0: number, y0: number, x1: number, y1: number) => {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const o = (y * w + x) * 4;
        b[o] = 220;
        b[o + 1] = 220;
        b[o + 2] = 220;
        b[o + 3] = 255;
      }
    }
  };

  it("clusterDiff: decodes two synthetic clusters into two buckets with exact geometry + shares (the F-99c1-style decode, one call)", async () => {
    const { clusterDiff } = await sweep();
    const w = 100;
    const h = 100;
    const a = mk(w, h);
    const b = mk(w, h);
    paint(b, w, 10, 10, 19, 19); // 10x10 = 100px
    paint(b, w, 60, 50, 79, 69); // 20x20 = 400px
    const r = clusterDiff(a, b, 12, w, h, 16);
    expect(r.diffPx).toBe(500);
    expect(r.total).toBe(10000);
    expect(r.pct).toBeCloseTo(5, 10);
    expect(r.buckets).toHaveLength(2);
    // sorted DESC — the bigger genus first
    const [big, small] = r.buckets;
    expect(big.px).toBe(400);
    expect(big.x0).toBe(60);
    expect(big.y0).toBe(50);
    expect(big.x1).toBe(79);
    expect(big.y1).toBe(69);
    expect(big.diffShare).toBeCloseTo(80, 10);
    expect(big.frameShare).toBeCloseTo(4, 10);
    expect(small.px).toBe(100);
    expect(small.x0).toBe(10);
    expect(small.y0).toBe(10);
    expect(small.x1).toBe(19);
    expect(small.y1).toBe(19);
    expect(small.diffShare).toBeCloseTo(20, 10);
    expect(small.frameShare).toBeCloseTo(1, 10);
  });

  it("clusterDiff: clusters closer than the gap MERGE (the anti-aliasing-noise absorption — the one-off probes' whole point)", async () => {
    const { clusterDiff } = await sweep();
    const w = 100;
    const h = 100;
    const a = mk(w, h);
    const b = mk(w, h);
    paint(b, w, 10, 40, 19, 49); // ends x=19
    paint(b, w, 28, 40, 37, 49); // starts x=28 — 9px apart, inside gap 16
    const r = clusterDiff(a, b, 12, w, h, 16);
    expect(r.buckets).toHaveLength(1);
    expect(r.buckets[0].px).toBe(200);
    expect(r.buckets[0].x0).toBe(10);
    expect(r.buckets[0].x1).toBe(37);
  });

  it("clusterDiff: clusters farther than the gap stay apart (the rail band vs the content band)", async () => {
    const { clusterDiff } = await sweep();
    const w = 100;
    const h = 100;
    const a = mk(w, h);
    const b = mk(w, h);
    paint(b, w, 10, 40, 19, 49); // cells 0-1
    paint(b, w, 60, 40, 69, 49); // cells 3-4 — 41px apart, outside gap 16
    const r = clusterDiff(a, b, 12, w, h, 16);
    expect(r.buckets).toHaveLength(2);
    expect(r.buckets.map((x) => x.px)).toEqual([100, 100]);
  });

  it("clusterDiff: an identical pair yields zero buckets (and no share division by zero)", async () => {
    const { clusterDiff } = await sweep();
    const w = 8;
    const h = 8;
    const a = mk(w, h);
    const r = clusterDiff(a, a.slice(), 12, w, h, 16);
    expect(r.diffPx).toBe(0);
    expect(r.pct).toBe(0);
    expect(r.buckets).toEqual([]);
  });

  it("clusterDiff: buckets sort by pixel count DESC regardless of construction order (the biggest genus first, always)", async () => {
    const { clusterDiff } = await sweep();
    const w = 120;
    const h = 120;
    const a = mk(w, h);
    const b = mk(w, h);
    paint(b, w, 5, 5, 14, 14); // 100px painted FIRST (cells (0,0))
    paint(b, w, 40, 5, 99, 59); // 3300px painted second (cells x2-6, y0-3)
    paint(b, w, 5, 80, 24, 99); // 400px painted third (cells x0-1, y5-6)
    const r = clusterDiff(a, b, 12, w, h, 16);
    expect(r.buckets).toHaveLength(3);
    expect(r.buckets.map((x) => x.px)).toEqual([3300, 400, 100]);
  });

  it("clusterDiff: size mismatch throws (the diffPixels parity — a count without its geometry is not evidence)", async () => {
    const { clusterDiff } = await sweep();
    const a = mk(4, 4);
    const b = mk(5, 4);
    expect(() => clusterDiff(a, b, 12, 4, 4, 16)).toThrow(/size mismatch/);
  });

  it("clusterDiff: a non-positive gap fails fast (the B-97a2 NaN doctrine — the cell math divides by it)", async () => {
    const { clusterDiff } = await sweep();
    const w = 4;
    const h = 4;
    const a = mk(w, h);
    const b = mk(w, h);
    paint(b, w, 0, 0, 1, 1);
    expect(() => clusterDiff(a, b, 12, w, h, 0)).toThrow(/gap/);
    expect(() => clusterDiff(a, b, 12, w, h, -4)).toThrow(/gap/);
  });

  it("the sweep wires the seam: the --clusters flag + the parseNumberArg-routed --cluster-gap + the browser-side inline decode + the header documents the diff-clustering decode", () => {
    const src = read("scripts/sweep.ts");
    // the exported seam
    expect(src).toContain("export function clusterDiff(");
    // the flag (boolean) + the gap (the FIFTH numeric flag, fail-fast)
    expect(src).toContain('process.argv.includes("--clusters")');
    expect(src).toContain('parseNumberArg(process.argv, "--cluster-gap", 16)');
    // the browser evaluate carries the inline twin (the no-bundling
    // doctrine — the same cross-reference comment diffPixels carries)
    expect(src).toContain("the inline twin of clusterDiff");
    // the report prints the bucket table
    expect(src).toContain("[sweep] clusters (gap");
    // the header documents it (the usage block)
    expect(src).toMatch(/--clusters/);
    expect(src).toMatch(/diff-clustering decode/);
  });
});

describe("session-101 (F-101a1/S101-P0): the clusterDiff edge-wrap fix", () => {
  // two same-size buffers; paint() diverges a block of b from the base
  // fill by a channel delta far above the tolerance (the s100 helpers)
  const mk = (w: number, h: number) => new Uint8ClampedArray(w * h * 4).fill(100);
  const paint = (b: Uint8ClampedArray, w: number, x0: number, y0: number, x1: number, y1: number) => {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const o = (y * w + x) * 4;
        b[o] = 220;
        b[o + 1] = 220;
        b[o + 2] = 220;
        b[o + 3] = 255;
      }
    }
  };

  it("clusterDiff: blocks at OPPOSITE horizontal edges of one row band stay TWO buckets (F-101a1 — the union-find neighbor lookup must never wrap columns)", async () => {
    const { clusterDiff } = await sweep();
    const w = 160;
    const h = 40;
    const a = mk(w, h);
    const b = mk(w, h);
    // two 16x16 blocks, 129px apart, both spanning cell-rows 0-1:
    // block 1 in grid column 0 (the LEFT frame edge), block 2 in
    // grid column 9 (the RIGHT frame edge; cw = 10 at gap 16). The
    // unguarded neighbor lookup at cx=0, dx=-1 computes
    // nk = (cy+dy)*cw - 1 — which ALIASES to column 9 (the last
    // column) of row cy+dy: block 2's territory. Any adjacent-row
    // probe wraps; the audit's live proof merged exactly this
    // geometry into one [x 0..159] bucket.
    paint(b, w, 0, 8, 15, 23); // x 0..15 — grid column 0, rows 0-1
    paint(b, w, 144, 8, 159, 23); // x 144..159 — grid column 9, rows 0-1
    const r = clusterDiff(a, b, 12, w, h, 16);
    expect(r.diffPx).toBe(512);
    // RED pre-fix: ONE merged bucket [x 0..159] via the wrap
    expect(r.buckets).toHaveLength(2);
    expect(r.buckets.map((x) => x.px)).toEqual([256, 256]);
    expect(r.buckets[0].x0).toBe(0);
    expect(r.buckets[0].x1).toBe(15);
    expect(r.buckets[1].x0).toBe(144);
    expect(r.buckets[1].x1).toBe(159);
    // both blocks share the row band — the y geometry is intact
    expect(r.buckets[0].y0).toBe(8);
    expect(r.buckets[0].y1).toBe(23);
    expect(r.buckets[1].y0).toBe(8);
    expect(r.buckets[1].y1).toBe(23);
  });

  it("the sweep wires the fix in BOTH copies: the node seam + the browser inline twin carry the column-bounds guard (the no-bundling doctrine)", () => {
    const src = read("scripts/sweep.ts");
    // the guard — present TWICE (the node seam's neighbor loop + the
    // browser twin's neighbor loop; identical text, both sites)
    const guard = "if (cx + dx < 0 || cx + dx >= cw) continue;";
    expect(src.split(guard).length - 1).toBe(2);
    // the doctrine comment at the seam (why the guard exists)
    expect(src).toContain("never wrap");
  });
});

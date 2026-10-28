// Session-92 pins (S92-P5): the sweep tool — the s91 screenshot-diff
// sweep promoted into the repo as a ONE-COMMAND regression (the s91
// session's first-listed suggested next: "the screenshot-diff sweep is
// now a one-command regression — scripts/zero-data.ts + the
// capture/diff scripts, worth promoting into the repo as a tool").
//
// The contract: `bun run sweep` boots (or reuses) the dev server on
// :3000, drives OUR app to the zero-data state (the reference's own
// standing state — its workspace has been empty for 13 censuses), logs
// into BOTH apps, captures the PAGES list per app at 1440x900, pairwise
// pixel-diffs them (per-channel tolerance 12 — the s91 value), prints
// the % table, and restores the seed. ZERO new dependencies: the
// capture rides the existing @playwright/test chromium; the pixel diff
// decodes both PNGs in a browser canvas (getImageData) and runs the
// PURE diffPixels seam — the same function these pins exercise in
// node. The standing explained diffs (settings ~4.7% picklist-data,
// contacts ~0.5% lucide-noise, dashboard ~0.3% chart-artifact) are
// REPORTED, not failed — the tool is a drift REPORT; pass --max-diff
// to gate a threshold in CI-style use.

import { readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

const sweep = () => import("../scripts/sweep");

describe("session-92 (S92-P5): the sweep tool — the one-command regression", () => {
  it("exports the 14-page sweep list (the s91 set + the s96 login + the s142 landing/route-move + the s144 marketing pair + the s197 not-found)", async () => {
    const { PAGES } = await sweep();
    expect(PAGES).toEqual([
      // Session-142 (D-142a6): the dashboard re-anchored to /dashboard
      // (the root became the PUBLIC landing) + the landing entry.
      { name: "dashboard", path: "/dashboard" },
      { name: "landing", path: "/" },
      // Session-144 (D-144a2): the marketing pair joins the standing
      // sweep — the reference serves /about + /contact publicly
      // (walk34/F-144c1) and ours now mirrors it; the sweep captures
      // BOTH apps logged-in (the same app chrome + the real-user
      // topbar on both sides — the s142 landing precedent).
      { name: "about", path: "/about" },
      { name: "contact", path: "/contact" },
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
      // Session-197 (D-197a1): the 404 joins the sweep — the sweep-state's
      // own coverage audit's genuine find (the only two-app-renderable
      // surface with zero drift-gate coverage; the bare 404 carries NO
      // main, so the capture-wait rides the h1 "404" instead).
      { name: "not-found", path: "/no-such-sweep-route", waitFor: "heading-404" },
    ]);
  });

  it("the not-found entry carries the heading-404 capture override — the bare 404 renders with NO main, so the sweep's shell-wait would soft-fall a full 15s burn per capture (D-197a1)", async () => {
    const { PAGES } = await sweep();
    const nf = PAGES.find((p) => p.name === "not-found");
    expect(nf).toBeDefined();
    expect(nf?.path).toBe("/no-such-sweep-route");
    expect(nf?.waitFor).toBe("heading-404");
    // every other page waits on the shell's main — the default face
    for (const p of PAGES) {
      if (p.name !== "not-found") expect(p.waitFor).toBeUndefined();
    }
  });

  it("standingBaseline: the not-found surface rides the 0.1 family floor at ALL FOUR bands (the D-197a1 maiden measured 0.01/0.04/0.01/0.01 — byte-identical two-app after the badge-close, no genus)", async () => {
    const { standingBaseline } = await sweep();
    expect(standingBaseline(1440)["not-found"]).toBe(0.1);
    expect(standingBaseline(390)["not-found"]).toBe(0.1);
    expect(standingBaseline(768)["not-found"]).toBe(0.1);
    expect(standingBaseline(1024)["not-found"]).toBe(0.1);
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
  // now runs the same PAGES zero-data pairwise diff at ANY viewport:
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
  it("standingBaseline: the desktop table (the s91–s96 standing genera, generous to run noise; s146: the dashboard + contacts entries re-anchored down — the retired genera; s147: the parity-event families re-anchored)", async () => {
    const { standingBaseline } = await sweep();
    const b = standingBaseline(1440);
    // s147: the picklist data genus at its new shape (2.65 measured)
    expect(b.settings).toBeGreaterThanOrEqual(2.4);
    expect(b.settings).toBeLessThanOrEqual(3.6);
    // the s146 re-derivation: the chart-artifact + lucide-attribution
    // genera retired — the entries re-anchored to 0.15/0.1 (the s91-era
    // >= 0.3 / >= 0.4 floors encoded the stale slack)
    expect(b.dashboard).toBeGreaterThanOrEqual(0.1);
    expect(b.contacts).toBeGreaterThanOrEqual(0.05);
    // every PAGES name has a desktop baseline (a new page must join the
    // table deliberately — the fail-fast doctrine)
    const { PAGES } = await sweep();
    for (const p of PAGES) expect(b[p.name]).toBeDefined();
  });

  it("standingBaseline: the phone table covers BOTH walked phone widths (390x844 + 375x812, split at the md breakpoint)", async () => {
    const { standingBaseline } = await sweep();
    const b390 = standingBaseline(390);
    const b375 = standingBaseline(375);
    // s147: the floor genus RETIRED (the reference's own hamburger) —
    // the floor entries dropped to 0.1-0.25; the settings picklist
    // genus at its new shape (3.63/3.8 measured)
    expect(b390.settings).toBeGreaterThanOrEqual(3.4);
    expect(b375.settings).toBeGreaterThanOrEqual(3.5);
    // the login logo genus stays above the floor (the constant-absolute
    // pixels — 0.78 measured at 390)
    expect(b390.login).toBeGreaterThanOrEqual(0.7);
    // the collapsed floor family sits at/below 0.25 (the tightest band)
    for (const name of ["dashboard", "leads", "reports", "calendar"])
      expect(b390[name]).toBeLessThanOrEqual(0.3);
    // desktop above the md breakpoint
    const { standingBaseline: sb } = await sweep();
    expect(sb(768)).not.toEqual(b390);
    expect(sb(767)).toEqual(b390);
  });

  it("standingBaseline: the phone login entry rides the CLASS CEILING — the 320x568 floor walk (s103 maiden: the logo genus is constant-ABSOLUTE ~2,500px, so its SHARE peaks at the smallest frame — 1.39% at 320 vs 0.75% at 390; one entry covers all four walked widths 390/375/414/320, the share-based cost the class banding makes for the one constant-absolute genus)", async () => {
    const { standingBaseline } = await sweep();
    // the s103 maiden measurement at the class floor
    expect(standingBaseline(320).login).toBeGreaterThanOrEqual(1.39);
    // ONE table for the whole <768 band — the floor entry IS the 390 entry
    expect(standingBaseline(320).login).toBe(standingBaseline(390).login);
    expect(standingBaseline(320).login).toBe(standingBaseline(375).login);
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
    // s148 (the F-147c3 mirror): accounts 0.14 measured — the chips
    // share RETIRED with the mirror; the residue is the md-boundary
    // overflow sliver. settings 3.92 (the picklist genus at its new
    // shape), login 0.46 (the logo genus at the tablet share)
    expect(b.accounts).toBeGreaterThanOrEqual(0.1);
    expect(b.accounts).toBeLessThanOrEqual(0.3);
    expect(b.settings).toBeGreaterThanOrEqual(3.7);
    expect(b.settings).toBeLessThanOrEqual(4.7);
    expect(b.login).toBeGreaterThanOrEqual(0.4);
    expect(b.login).toBeLessThanOrEqual(0.7);
    // every PAGES name has a tablet baseline (the fail-fast doctrine)
    const { PAGES } = await sweep();
    for (const p of PAGES) expect(b[p.name]).toBeDefined();
  });

  it("driftVerdict: the tablet settings row passes ITS OWN class where the desktop table is tighter (why the class exists — s148 re-derived: the picklist genus carries different shares per class)", async () => {
    const { driftVerdict, standingBaseline } = await sweep();
    // the measured s148 row: settings 3.92 at 768x1024 (the picklist
    // data genus at the tablet share — 4.2 baseline)
    const rows = [["settings", 3.92]] as Array<[string, number]>;
    expect(driftVerdict(rows, standingBaseline(768), 0.5).ok).toBe(true);
    // judged against the DESKTOP table (settings 2.9 + 0.5) it FAILS —
    // the genus's share is class-specific, not drift
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
    // s148 (the F-147c3 mirror): accounts 1.67 measured — the chips
    // share RETIRED; the residual is the PURE s95 overflow genus.
    // settings 1.91 (the picklist genus at its new shape), dashboard
    // 0.07 (the family floor)
    expect(b.accounts).toBeGreaterThanOrEqual(1.5);
    expect(b.accounts).toBeLessThanOrEqual(2.1);
    expect(b.settings).toBeGreaterThanOrEqual(1.7);
    expect(b.settings).toBeLessThanOrEqual(2.7);
    expect(b.login).toBeGreaterThanOrEqual(0.4);
    expect(b.login).toBeLessThanOrEqual(0.7);
    expect(b.dashboard).toBeGreaterThanOrEqual(0.05);
    expect(b.dashboard).toBeLessThanOrEqual(0.15);
    // every PAGES name has a landscape baseline (the fail-fast doctrine)
    const { PAGES } = await sweep();
    for (const p of PAGES) expect(b[p.name]).toBeDefined();
  });

  it("driftVerdict: the landscape accounts row passes ITS OWN class where the desktop/tablet tables would fail it (s148 re-derived: the 1.67 row — the PURE s95 overflow genus, the chips share retired with the mirror)", async () => {
    const { driftVerdict, standingBaseline } = await sweep();
    // the measured s148 row: accounts 1.67 at 1024x768 (the pure
    // overflow genus — 1.9 baseline)
    const rows = [["accounts", 1.67]] as Array<[string, number]>;
    expect(driftVerdict(rows, standingBaseline(1024), 0.5).ok).toBe(true);
    // judged against the DESKTOP table (accounts 0.1) it would FAIL —
    // and against the TABLET table (accounts 0.2) too
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
    // Session-197 (D-197a2): the corrected-phrasing live face moves with
    // the header cure — the count-anchored form is retired in BOTH files
    // (the s98 WIDENED guard's negatives carry the ten-forms); the
    // NAME-anchored PAGES form is the corrected phrasing now.
    expect(src).toMatch(/the PAGES list|the full PAGES sweep/);
  });
});

describe("session-98 (F-98a1/B-98a1/N-98a1): the sweep docs + the per-class print", () => {
  it("the stale nine-page phrasing is gone from BOTH the tool and this suite (the WIDENED F-98a1 guard)", () => {
    // F-98a1: the s97 guard read only scripts/sweep.ts with a pattern
    // that missed the bare-count form — and the stale phrasing survived
    // in BOTH this file's header and the phone-mode comment. The guard
    // now reads both files. The pattern is string-concatenated so this
    // pin cannot match its own guard text.
    // Session-197 (D-197a2): the header's count-anchored phrasings are
    // RETIRED — a count comment goes stale every time a page joins (the
    // s98 live face itself went stale at s142/s144: three additions
    // shipped with the old count intact); the header now rides the
    // NAME-anchored PAGES form, which never goes stale. The negatives
    // grow by the retired ten-forms (the s192 doctrine: the OLD live
    // form joins the negatives; the live census pin's own count form is
    // never a negative), the live face moves to the count-proof form.
    const stale = new RegExp("\\b(?:9|ten)" + "-page\\b|the (?:9|ten)\\s+pages");
    const sweepSrc = read("scripts/sweep.ts");
    const self = readFileSync(path.resolve(import.meta.dirname, "sweep-tool.test.ts"), "utf8");
    expect(sweepSrc, "scripts/sweep.ts").not.toMatch(stale);
    expect(self, "sweep-tool.test.ts").not.toMatch(stale);
    expect(sweepSrc).toMatch(/the PAGES list|the full PAGES sweep/);
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

  it("standingExplained(width): the per-class genera line (N-98a1 — the desktop trio no longer prints on phone runs; s99: the fourth class; s146: the re-derivation — the contacts + dashboard desktop genera RETIRED, the phone landing share re-anchored)", async () => {
    const { standingExplained } = await sweep();
    const desktop = standingExplained(1440);
    const phone = standingExplained(390);
    const tablet = standingExplained(768);
    const landscape = standingExplained(1024);
    // s148 (the F-147c3 mirror): the desktop line carries the MIRRORED
    // family + the picklist genus; the s142 invisible-CTA decode is
    // RETIRED (the reference fixed it upstream at s147)
    expect(desktop).toMatch(/MIRRORED/);
    expect(desktop).toMatch(/picklist/);
    expect(desktop).not.toMatch(/brand-token/);
    expect(desktop).not.toMatch(/lucide superset/);
    expect(desktop).not.toMatch(/chart artifact/);
    // the phone line: the mirrored family + the two standing genera
    expect(phone).toMatch(/MIRRORED/);
    expect(phone).toMatch(/3\.6/);
    // the tablet line carries the mirrored family + the settings share
    expect(tablet).toMatch(/MIRRORED/);
    expect(tablet).toMatch(/3\.9/);
    // the landscape line carries the PURE overflow genus (the chips
    // share retired with the mirror)
    expect(landscape).toMatch(/overflow/);
    expect(landscape).toMatch(/PURE s95/);
    expect(landscape).toMatch(/1\.7/);
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

// Session-146 (the 146-c rotation — the drift-sweep baselines
// re-derivation): the quarterly re-anchor. The maiden uniform
// re-measurement of all 4 viewport classes × 13 pages found ZERO upward
// drift — every genus byte-stable (tablet landing 15.34 EXACT · landscape
// landing 10.77 EXACT · tablet accounts 0.72 EXACT · landscape accounts
// 2.43 EXACT · the settings picklist 4.73/7.34/5.19/4.74 · the login logo
// genus 0.28/0.78/0.46/0.46 · the phone floor family 0.51-0.56) — but
// three entries carried stale slack: the phone landing genus share
// (the s142 maiden's PRIOR-sandbox 8.5 vs the current-sandbox 5.32,
// byte-stable ×3 runs, the cluster decode the SAME brand-token genus —
// the CTA band 4.30% + the badge 0.76% + the logo 0.22%) and the two
// retired s91-era desktop genera (the contacts "lucide superset" —
// a DOM-level N-89c6 attribute never the pixel diff, 0.00 since s142;
// the dashboard "2px chart-baseline artifact" — 0.03 since s142). This
// pin freezes the re-anchored values (L-146c1: a baseline is a snapshot
// of its sandbox — the quarterly re-derivation is the tripwire's
// calibration).
describe("session-146: the re-anchored standing baselines (the quarterly re-derivation)", () => {
  it("the three re-anchored entries: phone.landing 6.0 · desktop.dashboard 0.15 · desktop.contacts 0.1 (the F-146c1 tightening — the dead slack retired)", async () => {
    const { standingBaseline } = await sweep();
    const phone = standingBaseline(390);
    const desktop = standingBaseline(1440);
    // s146's re-anchors, superseded at s147 (the parity event) and at
    // s148 (the MIRROR): the phone landing genus collapsed at s147 and
    // the desktop family entries collapsed at s148 — every F-147c3
    // carrier now rides the family floor
    expect(phone.landing).toBe(0.1);
    // the desktop dashboard: 0.4 → 0.15 (s146) → 0.1 (s148 — the
    // mirrored KPI delta chips + middle select + More... ghost)
    expect(desktop.dashboard).toBe(0.1);
    // the desktop contacts: 0.1 → 3.0 (s147) → 0.1 (s148 — the "+0"
    // chip mirrored)
    expect(desktop.contacts).toBe(0.1);
  });

  it("the byte-stable genera stay untouched (s147 re-anchored: the parity event moved the landing/settings families + collapsed the phone floor — the s147 describe below)", async () => {
    const { standingBaseline } = await sweep();
    const desktop = standingBaseline(1440);
    const phone = standingBaseline(390);
    const tablet = standingBaseline(768);
    const landscape = standingBaseline(1024);
    // the s148 re-anchors (the F-147c3 MIRROR — the landing mock morph
    // mirrored: the genus collapsed at every class)
    expect(tablet.landing).toBe(0.1);
    expect(landscape.landing).toBe(0.1);
    expect(desktop.landing).toBe(0.1);
    // the settings picklist genus family at its new shape (the s148
    // dead-slack tightening)
    expect(desktop.settings).toBe(2.9);
    expect(phone.settings).toBe(3.8);
    expect(tablet.settings).toBe(4.2);
    expect(landscape.settings).toBe(2.1);
    // the login logo genus family (the TRUE byte-stable genus)
    expect(desktop.login).toBe(0.3);
    expect(phone.login).toBe(1.4);
    // the phone floor family COLLAPSED (the reference's own hamburger)
    expect(phone.about).toBe(0.1);
    expect(phone.contact).toBe(0.1);
  });

  it("the sweep source documents the re-derivation (the L-146c2 mechanism-named comments)", () => {
    const src = read("scripts/sweep.ts");
    // the re-derivation markers at the re-anchored entries (s146's
    // markers superseded by the s148 mirror comments; the L-146c2
    // mechanism-named-comment doctrine holds)
    expect(src).toMatch(/session-146 \(F-146c1, the baselines re-derivation\): RE-ANCHORED/);
    expect(src).toMatch(/session-148 \(the F-147c3 mirror\): re-anchored/);
    // the retired s91 genera no longer ride the runtime print's desktop
    // line; the s147 print retired the s142 invisible-CTA decode with it
    expect(src).not.toMatch(/contacts ~0\.5% lucide superset · dashboard ~0\.3% chart artifact/);
    expect(src).not.toMatch(/landing ~9\.6% the s142 brand-token genus/);
  });
});

describe("session-147: the parity-event baseline re-derivation (probe:ref #119 — the mobile-nav fix + the desktop interiors)", () => {
  it("the F-147c3 desktop-interior family COLLAPSED at s148: accounts 0.1 · contacts 0.1 · activities 0.1 at every class (the mirror retired the whole family)", async () => {
    const { standingBaseline } = await sweep();
    const desktop = standingBaseline(1440);
    // the measured 0.00/0.00/0.01 post-mirror; every family carrier
    // rides the floor
    expect(desktop.accounts).toBe(0.1);
    expect(desktop.contacts).toBe(0.1);
    expect(desktop.activities).toBe(0.1);
    // the family at the other classes — all collapsed
    const phone = standingBaseline(390);
    expect(phone.contacts).toBe(0.1);
    expect(phone.accounts).toBe(0.1);
    const tablet = standingBaseline(768);
    expect(tablet.contacts).toBe(0.1);
    expect(tablet.activities).toBe(0.1);
    const landscape = standingBaseline(1024);
    expect(landscape.activities).toBe(0.1);
    expect(landscape.accounts).toBe(1.9);
  });

  it("the COLLAPSED genera: the phone landing 0.1 (the reference's CTAs now VISIBLE — the s142 brand-token genus fixed upstream) + the phone floor family retired (the reference's own hamburger)", async () => {
    const { standingBaseline } = await sweep();
    const phone = standingBaseline(390);
    // the phone landing: 6.0 → 0.1 (measured 0.01 — the CTA visibility
    // collapsed the genus; the tightest tripwire in the table at 0.6)
    expect(phone.landing).toBe(0.1);
    // the floor family: 0.75-0.95 → 0.1-0.25 (the s93 genus retired —
    // the reference's topbar now matches ours byte-for-byte; s148: the
    // F-147c3 chips family collapsed the 0.2 entries to the floor)
    expect(phone.dashboard).toBe(0.1);
    expect(phone.leads).toBe(0.1);
    expect(phone.calendar).toBe(0.1);
    expect(phone.activities).toBe(0.1);
    expect(phone.reports).toBe(0.25);
    expect(phone.profile).toBe(0.1);
  });

  it("the sweep source documents the parity-event re-derivation + the s148 mirror (the mechanism-named comments)", () => {
    const src = read("scripts/sweep.ts");
    expect(src).toMatch(/session-147: the phone landing genus COLLAPSED/);
    // the s148 mirror markers replaced the s147 family comments
    expect(src).toMatch(/session-148 \(the F-147c3 mirror\)/);
    expect(src).toMatch(/the F-147c3 MIRROR\): the desktop-interior family is/);
    // the runtime print's class lines carry the MIRRORED wording
    expect(src).toMatch(/MIRRORED \(s148/);
    // the s142 invisible-CTA decode retired from the desktop print
    expect(src).not.toMatch(/landing ~9\.6% the s142 brand-token genus/);
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

// ---------------------------------------------------------------------------
// Session-123 (F-123a1, D-123a0): the dev-server spawn's platform-env guard
// ---------------------------------------------------------------------------

describe("session-123: the dev-server spawn guards the platform DATABASE_URL override (F-123a1)", () => {
  it("the sweep's `bun run dev` spawn deletes DATABASE_URL from the child env (the Session-93 F-A rule, extended to the boot site)", () => {
    const src = read("scripts/sweep.ts");
    // The platform shell exports a STALE absolute DATABASE_URL (the
    // relocated-workspace path); an absolute URL matches neither
    // bun-absolutization signature, so the db-path seam treats it as an
    // intentional override and every db route 500s (login included).
    // Live-reproduced 123-c: the sweep died at OUR login until
    // `env -u DATABASE_URL`. The boot site now self-guards — the same
    // `delete env.DATABASE_URL` the zero-data spawn has carried since
    // session-93.
    expect(src).toMatch(
      /delete devEnv\.DATABASE_URL;[\s\S]*?spawned = spawn\("bun", \["run", "dev"\],[\s\S]*?env: devEnv/,
    );
  });

  it("the drawer battery's `bun run dev` spawn carries the same guard (the battery's runbook env -u is now the script's own)", () => {
    const src = read("scripts/drawer-battery-390.ts");
    expect(src).toMatch(
      /delete devEnv\.DATABASE_URL;[\s\S]*?spawned = spawn\("bun", \["run", "dev"\],[\s\S]*?env: devEnv/,
    );
  });

  it("session-150 (walk40): the settings phone share is the LIVE-EDITED-INTRADAY picklist-data genus — the ref-vs-ref adjudication idiom documented on the phone line (a settings-class trip is FIRST adjudicated by the ref-vs-ref re-capture before any defect claim)", async () => {
    const { standingExplained } = await sweep();
    const phone = standingExplained(390);
    // the LIVE-INTRADAY note (walk40: ref-vs-ref drifted 2.65% within
    // ~40 min — the owner edits the reference's picklists during the
    // day; the ours-vs-ref share wobbled 3.63 → 6.08 across the same
    // window)
    expect(phone).toMatch(/LIVE-EDITED INTRADAY/);
    expect(phone).toMatch(/ref-vs-ref/);
    // the share + the genus attribution stay (3.6 measured at the
    // s150 gate run — within the 3.8 baseline)
    expect(phone).toMatch(/3\.6/);
    expect(phone).toMatch(/picklist-data genus/);
  });

  it("session-150 (walk40): the STANDING_BASELINES phone settings comment carries the ref-vs-ref adjudication idiom (the tripwire stays TIGHT — the s146 doctrine; the wobble is absorbed by the decode protocol, not the margin)", () => {
    const src = read("scripts/sweep.ts");
    const at = src.indexOf("phone: {");
    expect(at).toBeGreaterThan(-1);
    const phoneTable = src.slice(at, src.indexOf("tablet: {", at));
    const settingsAt = phoneTable.indexOf("settings:");
    expect(settingsAt).toBeGreaterThan(-1);
    const entry = phoneTable.slice(settingsAt, settingsAt + 700);
    // the comment block above the settings entry documents the
    // intraday wobble + the adjudication order
    const doc = phoneTable.slice(Math.max(0, settingsAt - 900), settingsAt);
    expect(doc).toMatch(/LIVE-EDITED INTRADAY/);
    expect(doc).toMatch(/ref-vs-ref/);
    // the value itself unchanged — 3.8 (the s148 re-anchor; the wobble
    // documented, the margin NOT widened)
    expect(entry).toMatch(/settings:\s*3\.8,/);
  });
});

// ---------------------------------------------------------------------------
// Session-162 (the 162-c rotation): the sweep LOGIN CONSOLIDATION — the
// cross-process storageState file. The s160/s161 doctrine's third
// application: the four SEPARATE-PROCESS sweep invocations each logged
// in fresh (one our-login per invocation, FOUR per gate:full chain —
// this round's own 162-b audit burned the four live). A per-invocation
// pre-flight cannot cure a per-PROCESS seam; the cure is a shared state
// FILE (scripts/.sweep-auth-state.json — the combined pair state, two
// origins one jar) written once and reused by every subsequent
// invocation while fresh. The our-login count drops 4 -> 1 per chain.
// ---------------------------------------------------------------------------

describe("session-162: the sweep LOGIN CONSOLIDATION (the cross-process storageState file)", () => {
  it("the STATE MODULE exists — scripts/sweep-state.ts: the file path (a dotfile in scripts/, never committed), the 15-min TTL (the login-window semantics — reuse within one gate chain, never across rounds), and the three seam functions (load · save · preflightPairState)", () => {
    const src = read("scripts/sweep-state.ts");
    expect(src).toMatch(/SWEEP_STATE_FILE\s*=\s*path\.join\([^)]*\.sweep-auth-state\.json/);
    // the TTL: 15 minutes — the login-window semantics
    expect(src).toMatch(/SWEEP_STATE_TTL_MS\s*=\s*15\s*\*\s*60\s*\*\s*1000/);
    expect(src).toMatch(/export function loadSweepState/);
    expect(src).toMatch(/export function saveSweepState/);
    expect(src).toMatch(/export async function preflightPairState/);
  });

  it("the ONE-LOGIN-PER-CHAIN contract: the sweep main's capture path is LOGIN-FREE — the two in-loop logins (`await login(refPage…)` + `await login(ourPage…)`) are RETIRED; the preflightPairState call stands in their place and the single capture context carries the combined `storageState` (both pages ride the one jar — the s160 proven form)", () => {
    const src = read("scripts/sweep.ts");
    const mainBody = src.slice(src.indexOf("async function main()"));
    // the capture phase: NO login call inside main (the logins live in
    // the state module's fall-back pair only)
    expect(mainBody).not.toMatch(/await login\(refPage/);
    expect(mainBody).not.toMatch(/await login\(ourPage/);
    // the pre-flight call site + the state-fed capture context
    expect(mainBody).toMatch(/preflightPairState\(browser\)/);
    expect(mainBody).toMatch(/newContext\(\{ viewport: \{ width: WIDTH, height: HEIGHT \}, storageState: pairState \}\)/);
  });

  it("the SELF-HEAL guard (validation-by-use — L-162c2): a fresh cached file is PROBED before reuse — one throwaway context with the state, an authenticated check per app (the /dashboard probe, the redirect-to-/login detection), BOTH must pass; any miss falls back to the fresh login pair and REWRITES the file (the failure modes — rotated AUTH_SECRET · the cookie TTL · the ref platform session loss · a corrupt file — all surface as the same redirect, one guard covers them all)", () => {
    const src = read("scripts/sweep-state.ts");
    // the probe: the authenticated check helper + the reuse branch
    expect(src).toMatch(/async function ctxAuthenticated/);
    // the redirect detection: a pathname/endsWith comparison against
    // "/login" (either polarity — the shared login() helper's own
    // waitForURL idiom inverted)
    expect(src).toMatch(/pathname !== "\/login"|pathname === "\/login"|endsWith\("\/login"\)/);
    // the fall-back: the login pair (the census's preflightLoginPair
    // construction — ONE context, ref then ours, storageState()) + the
    // rewrite
    expect(src).toMatch(/await login\(page, REF_URL\)/);
    expect(src).toMatch(/await login\(page, OUR_URL\)/);
    expect(src).toMatch(/saveSweepState\(state\)/);
  });

  it("the 429-DIAGNOSTIC (the s159/s160/s161 contract): the pre-flight login-pair failure logs the budget hint to STDERR (console.error — the dev-server restart / wait-it-out doctrine, L-158c3/L-160c1) then RETHROWS (fail-fast, never a silent fall-back)", () => {
    const src = read("scripts/sweep-state.ts");
    expect(src).toMatch(/10-per-IP\/15-min/);
    expect(src).toMatch(/L-158c3/);
    expect(src).toMatch(/console\.error\([\s\S]*?10-per-IP\/15-min/);
    expect(src).toMatch(/throw e/);
  });

  it("the SECURITY pin (L-162c3 — session material on disk follows the database-binary discipline): .gitignore covers the state file path — live auth state NEVER enters the tree", () => {
    const gi = read(".gitignore");
    expect(gi).toMatch(/\.sweep-auth-state\.json/);
  });

  it("the ATOMIC + PRIVATE write: saveSweepState lands through a tmp-file rename with 0600 perms (the db-binary discipline — the file is live session material)", () => {
    const src = read("scripts/sweep-state.ts");
    expect(src).toMatch(/chmodSync\([^)]*0o600/);
    expect(src).toMatch(/renameSync/);
  });

  it("the FRESHNESS pure seam (node-testable): loadSweepState loads a fresh file, rejects a STALE one (mtime past the 15-min TTL), rejects a CORRUPT one, and returns null on a MISS", async () => {
    const { loadSweepState, saveSweepState, SWEEP_STATE_TTL_MS } = await import("../scripts/sweep-state");
    const tmp = path.join(root, "scripts", ".scratch-state-test.json");
    const state = { cookies: [], origins: [] };
    // fresh: saved now, loaded immediately
    saveSweepState(state, tmp);
    expect(loadSweepState(tmp)).toEqual(state);
    // stale: the mtime pushed past the TTL -> null (rejected)
    const stale = new Date(Date.now() - SWEEP_STATE_TTL_MS - 1000);
    utimesSync(tmp, stale, stale);
    expect(loadSweepState(tmp)).toBeNull();
    // corrupt: a garbage JSON body -> null (never a throw)
    writeFileSync(tmp, "{not json", "utf8");
    expect(loadSweepState(tmp)).toBeNull();
    // miss: no file at all -> null
    rmSync(tmp, { force: true });
    expect(loadSweepState(tmp)).toBeNull();
  });

  it("the SEED's ID-STABILITY contract (the PASS-1 live decode — the root cause of the first self-heal): prisma/seed.ts's users block is UPSERT-BY-EMAIL, NEVER deleteMany — a re-seed preserves the users' ids, so the cross-process state file's cookie uid survives every sweep's end-of-run db:seed restore (the rotation orphaned the cookie uid on EVERY invocation: the sweep restored the seed at its end, the next sweep's probe found the uid deleted, the self-heal re-logged-in — the consolidation saved nothing). The documented 'idempotent in place' claim is now true in the strong sense: the same users keep their ids", () => {
    const src = read("prisma/seed.ts");
    // the wipe is GONE from the users block (the domain tables keep theirs)
    expect(src).not.toMatch(/db\.user\.deleteMany\(\)/);
    // the four users land through upsert keyed on the email (the unique)
    expect(src.match(/db\.user\.upsert\(/g)?.length).toBe(4);
    expect(src).toMatch(/where:\s*\{\s*email:\s*"sepnetflix2023@outlook\.com"\s*\}/);
    // the update path resets the seeded fields (a re-seed restores the
    // demo state on the SAME rows — password, name, avatar, role, the
    // verification fields cleared)
    expect(src).toMatch(/update:\s*\{[\s\S]*?passwordHash/);
    expect(src).toMatch(/verificationExpiresAt:\s*null/);
  });

  it("the HEADER DOCTRINE (L-160c1/c2 + the 162-c layer): the sweep header documents the cross-process consolidation — the count-not-arrival decode, the stateless-cookie license, and the file/TTL/probe guard trio", () => {
    const src = read("scripts/sweep.ts");
    expect(src).toMatch(/162-c/);
    expect(src).toMatch(/cross-process/i);
    expect(src).toMatch(/sweep-state/);
    expect(src).toMatch(/L-160c1/);
  });
});

// Session-92 (S92-P5): the ZERO-DATA SCREENSHOT-DIFF SWEEP — the s91
// session's strong-sweep methodology promoted into the repo as a
// ONE-COMMAND regression (the s91 first-listed suggested next).
//
// What it does (bun run sweep):
//   1. boots (or reuses) the dev server on :3000
//   2. drives OUR app to the ZERO-DATA state — the reference's own
//      standing state (its workspace has been empty for 13 censuses) —
//      via scripts/zero-data.ts (the s91 tool, reused not duplicated;
//      users + the Setting singleton stay functional)
//   3. logs into BOTH apps, captures the ten pages per app at the given
//      viewport (default 1440x900; the reference's Base44 badge closed,
//      content-waits per page)
//   4. pairwise pixel-diffs each page (per-channel tolerance 12, the
//      s91 value) — the PNGs decode in a browser canvas (getImageData);
//      the PURE diffPixels seam is the same function the unit pins
//      exercise in node. ZERO new dependencies.
//   5. prints the % table + restores the seed (bun run db:seed)
//
// The standing EXPLAINED diffs (do not treat as drift):
//   settings ~4.7%  the picklist-DATA genus (the reference's picklists
//                    wiped with its workspace, ours seeded)
//   contacts ~0.5%  the lucide aria-hidden superset + noise
//   dashboard ~0.3% a 2px zero-area chart-baseline artifact
// Every other page ran 0.00-0.01% at the s91/s92 ships. The tool is a
// drift REPORT (exit 0 with the table); pass --max-diff <pct> (the
// space-separated form — the one the parser reads) to gate
// a threshold CI-style (exit 1 when any page exceeds it).
//
// The PHONE-WIDTH standing table (session-94 maiden run, 390x844 —
// the first phone sweep): a uniform ~0.5% floor on EVERY page (the
// mobile-nav superset topbar genus — ours renders [hamburger LEFT] +
// [account RIGHT], the reference [account LEFT] alone; the displaced
// account glyphs + the hamburger ≈ 1600 px ≈ 0.49% of the 390x844
// frame) · settings ~7.3% (the same picklist genus, a LARGER share of
// the narrower frame) · reports ~0.7% (the floor + chart noise). The
// desktop table above still governs the default run.
//
// Run: bun run sweep   (or: bun scripts/sweep.ts)
//   Phone-width mode (session-94, the s93 suggested next — the 390px
//   rotation method productized): bun run sweep -- --width 390
//   --height 844. The shots land in a viewport-tagged subfolder
//   (sweep-shots/w390x844/) so a phone run never collides with the
//   desktop shots; the diff table is computed fresh per run either way.
//   Targeted runs (session-95, the s94 suggested next): add
//   --pages leads,settings to sweep a comma-separated SUBSET of the
//   ten pages (both the captures and the diffs); unknown names fail
//   fast listing the valid names.
//   Threshold gate: --max-diff <pct> (space-separated — the parsed
//   form; exit 1 when any page exceeds it).
//   Per-page drift gate (session-96, the s95 suggested next #2):
//   --fail-on-drift exits 1 when any page exceeds ITS OWN standing
//   baseline + margin (default 0.5pct; override --drift-margin <pct>) —
//   a 0.00% page drifting to 5% fails here where a global --max-diff 8
//   (which must sit above the settings genus) never could.
//   The diff-clustering decode (session-100, the twice-suggested
//   promotion — the s98 suggested next #2, re-suggested at s99): add
//   --clusters to decode each page's diff into BUCKETS — clustered
//   regions of differing pixels (a coarse-grid union-find, cell =
//   --cluster-gap px [default 16]; clusters closer than ~gap px merge)
//   each reported with its bbox, pixel count, share of the page's
//   diff, and share of the frame (top 5 per page, biggest first).
//   The genus hunts ran this decode as one-off probes since s95 (the
//   F-99c1 rail-band decode); now it is one flag. Pure decode output —
//   the gate semantics are unchanged.
//   The baseline classes (session-99, the 4-way md/lg/xl banding —
//   the s97 3-way grown by the maiden landscape run):
//   < 768 the PHONE table (both walked widths 390x844 + 375x812) ·
//   < 1024 the TABLET table (the maiden 768x1024 run — the accounts
//   0.72% overflow genus, the reference's bare flex-1 poke-out vs our
//   min-w-0 in-box scroll) · < 1280 the LANDSCAPE table (the maiden
//   1024x768 run — the same overflow genus at its lg-band share: the
//   reference's bare flex-1 content FLOORS at its table's min-content,
//   SQUEEZES its own w-80 rail 320->183, and pokes main +6px; ours
//   the min-w-0 in-box scroll + the full 320 rail) · else DESKTOP. A
//   width in an un-walked band is judged by its class table; run a
//   maiden sweep before trusting a new band.
//   Numeric flags fail fast (session-97, B-97a2): a missing or
//   non-numeric --width/--height/--max-diff/--drift-margin value
//   throws listing the expected form — NaN must never silently disarm
//   a gate. The `gate:full` package script chains the standing gate +
//   all four drift sweeps.
// Env:  OUR_URL (default http://localhost:3000)
//       REF_URL (default https://neo-crm-8ab2c17c.base44.app)
//       REF_EMAIL / REF_PASSWORD (the documented demo login defaults)
//       HEADLESS=0 to watch the captures

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

export const PAGES = [
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
  // reference serves the login card to AUTHENTICATED visitors too (the
  // S23-P2 finding) and ours mirrors it, so the post-login capture works
  // on BOTH apps. The auth surface is now pixel-swept: the form-family
  // walk found the v4 space-y genus living there precisely because
  // /login was never swept.
  { name: "login", path: "/login" },
] as const;

export type PageEntry = (typeof PAGES)[number];

/** Session-95 (S95-P0): the --pages filter — `bun run sweep --
 *  --pages leads,settings` restricts the run to the named pages for
 *  targeted rotation runs (the s94 suggested next #3). PURE by design:
 *  it sits beside PAGES/TOLERANCE/diffPixels so the unit pins exercise
 *  real behavior. The result keeps the PAGES order (the capture and the
 *  diff loops share one deterministic sequence); an unknown name fails
 *  FAST listing the valid names — a typo must never silently sweep
 *  everything (or nothing). */
export function parsePagesArg(argv: string[], all: readonly PageEntry[]): PageEntry[] {
  const idx = argv.indexOf("--pages");
  if (idx < 0 || idx + 1 >= argv.length) return [...all];
  const wanted = argv[idx + 1].split(",").map((s) => s.trim()).filter(Boolean);
  if (wanted.length === 0) return [...all];
  const valid = new Set<string>(all.map((p) => p.name));
  const unknown = wanted.filter((w) => !valid.has(w));
  if (unknown.length > 0) {
    throw new Error(
      `--pages: unknown page name(s) ${unknown.map((u) => JSON.stringify(u)).join(", ")} — ` +
        `valid names: ${all.map((p) => p.name).join(", ")}`,
    );
  }
  const wantedSet = new Set(wanted);
  return all.filter((p) => wantedSet.has(p.name));
}

/** Session-97 (S97-P1, the 97-a audit's B-97a2): the numeric-arg
 * fail-fast. `Number(argv[idx + 1])` on a missing or non-numeric value
 * yields NaN — and `pct > NaN` is always false, so a typo'd
 * `--drift-margin` would SILENTLY DISARM the gate (the same shape as
 * --max-diff/--width/--height). This seam returns the fallback when the
 * flag is absent and THROWS listing the expected form when the value is
 * missing or non-numeric — the --pages typo doctrine extended to the
 * numeric family. PURE by design: pinned in tests/sweep-tool.test.ts. */
export function parseNumberArg(
  argv: string[],
  flag: string,
  fallback: number | null,
): number | null {
  const idx = argv.indexOf(flag);
  if (idx < 0) return fallback;
  const raw = idx + 1 < argv.length ? argv[idx + 1] : undefined;
  const value = Number(raw);
  if (raw === undefined || !Number.isFinite(value)) {
    throw new Error(
      `${flag}: expected a number, got ${raw === undefined ? "nothing" : JSON.stringify(raw)} ` +
        `(e.g. ${flag} ${fallback ?? 1})`,
    );
  }
  return value;
}

/** The per-channel anti-aliasing tolerance (the s91 value). */
export const TOLERANCE = 12;

/** Session-96 (S96-P2): the per-page STANDING baselines — the documented
 * explained-diff genera by viewport class (the session-97 3-way md/lg
 * banding grown 4-WAY at session-99: phone = width < 768, the md
 * breakpoint — BOTH walked phone widths 390x844 and 375x812 ride the
 * phone table · tablet = width < 1024, the lg breakpoint — the maiden
 * 768x1024 run's table, the accounts overflow genus at the md boundary
 * · landscape = width < 1280, the xl breakpoint — the maiden 1024x768
 * run's table, the same overflow genus at its lg-band share (the
 * reference's bare flex-1 floors at its table's min-content, squeezes
 * its own w-80 rail, and pokes main; ours the min-w-0 consistent
 * pattern) · else DESKTOP). The values sit just
 * above the measured standing tables (the s91–s99 runs) so the default
 * margin (0.5pct) absorbs run-to-run noise while any NEW drift — a
 * 0.00% page moving to 5%, invisible to a global --max-diff 8 gate —
 * fails. PURE by design: pinned in tests/sweep-tool.test.ts beside
 * PAGES/TOLERANCE/diffPixels/parsePagesArg. */
export const STANDING_BASELINES = {
  desktop: {
    dashboard: 0.4,
    accounts: 0.1,
    contacts: 0.6,
    leads: 0.1,
    calendar: 0.1,
    activities: 0.1,
    reports: 0.1,
    settings: 4.9,
    profile: 0.1,
    // the maiden 10-page run measured 0.27% — the CSS brand-mark logo
    // genus (the reference hotlinks a screenshot; ours draws the
    // white-circle/blue-dot shape — the s7 note)
    login: 0.3,
  },
  phone: {
    dashboard: 0.75,
    accounts: 0.75,
    contacts: 0.75,
    leads: 0.75,
    calendar: 0.8,
    activities: 0.75,
    reports: 0.95,
    settings: 7.7,
    profile: 0.75,
    // the maiden phone run measured 0.75% — the same logo genus at a
    // larger share of the narrower frame
    login: 0.8,
  },
  // Session-97 (S97-P0): the TABLET class — the md..lg band (768 <= w <
  // 1024) walked by the maiden 768x1024 run. The desktop layout family
  // is active (the sidebar shows from md) but the narrower frame gives
  // the standing genera different shares. accounts carries the s95
  // overflow genus at the md boundary: the reference's table rides the
  // bare flex-1 container and POKES OUT (main h-scroll), ours scrolls
  // in-box (min-w-0) — the th distribution differs downstream; ours the
  // consistent pattern, documented STANDING since the phone walk.
  tablet: {
    dashboard: 0.1,
    accounts: 0.8,
    contacts: 0.1,
    leads: 0.1,
    calendar: 0.1,
    activities: 0.1,
    reports: 0.1,
    settings: 5.5,
    profile: 0.1,
    // the maiden tablet run measured 0.44% — the logo genus at the
    // tablet share
    login: 0.5,
  },
  // Session-99 (S99-P0): the LANDSCAPE class — the lg..xl band
  // (1024 <= w < 1280) walked by the maiden 1024x768 run. The desktop
  // layout family is active (the w-80 filter rail joins at lg) but
  // the reference's accounts row is BROKEN at this band: its bare
  // flex-1 content FLOORS at the table's min-content (535), which
  // SQUEEZES its own w-80 rail from 320 to 183 (flex-shrink absorbs
  // the shortfall — its filter dropdowns visibly compress) and still
  // overflows the row, poking main +6px past the viewport (scrollW 774
  // vs clientW 768). Ours keeps content flex-1 min-w-0 (360, the table
  // scrolling IN-BOX inside the card's overflow-x-auto) + the rail at
  // its designed full 320 — the s95 consistent pattern, the same
  // doctrine the phone/md walks documented. The 2.43% share is the
  // genus at its lg-band maximum (the squeeze shrinks as width grows
  // toward 1280; 1440 rides the desktop table).
  landscape: {
    dashboard: 0.6,
    accounts: 2.6,
    contacts: 0.1,
    leads: 0.1,
    calendar: 0.1,
    activities: 0.1,
    reports: 0.1,
    settings: 4.9,
    profile: 0.1,
    // the maiden landscape run measured 0.44% — the logo genus at
    // the landscape share
    login: 0.5,
  },
} as const;

export type BaselineTable = Record<string, number>;

/** The baseline table for a viewport width — the 4-way md/lg/xl banding
 * (Session-99): < 768 the phone class (BOTH walked widths 390x844 +
 * 375x812), < 1024 the tablet class (the maiden 768x1024 run),
 * < 1280 the landscape class (the maiden 1024x768 run — the accounts
 * overflow genus at its lg-band share), else desktop. */
export function standingBaseline(width: number): BaselineTable {
  if (width < 768) return { ...STANDING_BASELINES.phone };
  if (width < 1024) return { ...STANDING_BASELINES.tablet };
  if (width < 1280) return { ...STANDING_BASELINES.landscape };
  return { ...STANDING_BASELINES.desktop };
}

/** PURE (Session-98, N-98a1): the class-appropriate "standing explained"
 * genera line — the desktop trio used to print on EVERY run regardless
 * of viewport class, describing shares that only exist at 1440 (the
 * phone settings genus is ~7.3, not ~4.7; the tablet surface carries
 * the accounts overflow genus). Mirrors the standingBaseline banding. */
export function standingExplained(width: number): string {
  if (width < 768) {
    return (
      "[sweep] standing explained (phone): the ~0.5% mobile-nav floor on every page (our superset topbar) " +
      "· settings ~7.3% picklist-data · reports ~0.7% floor + chart noise · login ~0.75% logo genus"
    );
  }
  if (width < 1024) {
    return (
      "[sweep] standing explained (tablet): accounts ~0.7% the s95 overflow genus at the md boundary " +
      "· settings ~5.2% picklist-data · login ~0.44% logo genus"
    );
  }
  if (width < 1280) {
    return (
      "[sweep] standing explained (landscape): accounts ~2.4% the overflow genus at the lg band (the reference's bare flex-1 floors at its table min-content, squeezes its own w-80 rail 320->183, pokes main +6px — ours the min-w-0 in-box rail-full consistent pattern) " +
      "· settings ~4.7% picklist-data · login ~0.44% logo genus"
    );
  }
  return (
    "[sweep] standing explained (desktop): settings ~4.7% picklist-data · contacts ~0.5% lucide superset · dashboard ~0.3% chart artifact"
  );
}

export interface DriftFailure {
  page: string;
  pct: number;
  baseline: number;
  allowed: number;
}

export interface DriftVerdict {
  ok: boolean;
  failures: DriftFailure[];
}

/** PURE: fails when any page exceeds ITS OWN standing baseline + margin.
 * A page missing from the table is judged at baseline 0 — a new page
 * must join the table deliberately (the fail-fast doctrine, the
 * --pages typo lesson). */
export function driftVerdict(
  rows: Array<[string, number]>,
  baselines: BaselineTable,
  marginPct: number,
): DriftVerdict {
  const failures: DriftFailure[] = [];
  for (const [page, pct] of rows) {
    const baseline = baselines[page] ?? 0;
    const allowed = baseline + marginPct;
    if (pct > allowed) failures.push({ page, pct, baseline, allowed });
  }
  return { ok: failures.length === 0, failures };
}

export interface DiffResult {
  diffPx: number;
  total: number;
  pct: number;
}

/** The PURE pixel-diff seam — identical on node (the unit pins) and in
 *  the browser (the sweep): counts a pixel as differing when ANY
 *  channel diverges by more than `tol`. Throws on size mismatch — a
 *  count without its geometry is not evidence. */
export function diffPixels(
  a: Uint8ClampedArray,
  b: Uint8ClampedArray,
  tol: number,
  w: number,
  h: number,
): DiffResult {
  const total = w * h;
  if (a.length !== total * 4 || b.length !== total * 4) {
    throw new Error(
      `size mismatch: expected ${total * 4} samples per image (w=${w} h=${h}), got a=${a.length} b=${b.length}`,
    );
  }
  let diffPx = 0;
  for (let i = 0; i < total; i++) {
    const o = i * 4;
    if (
      Math.abs(a[o] - b[o]) > tol ||
      Math.abs(a[o + 1] - b[o + 1]) > tol ||
      Math.abs(a[o + 2] - b[o + 2]) > tol ||
      Math.abs(a[o + 3] - b[o + 3]) > tol
    ) {
      diffPx++;
    }
  }
  return { diffPx, total, pct: (100 * diffPx) / total };
}

/** Session-100 (S100-P0): one clustered region of the pixel diff —
 *  the decode the genus hunts ran as one-off probes since s95 (the
 *  F-99c1 "rail band vs content band", the s94 "displaced account
 *  glyphs + hamburger ≈ 1600px"), now a first-class tool output. */
export interface DiffBucket {
  /** the bbox of the bucket's DIFF PIXELS (inclusive pixel coords) */
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** the bucket's differing-pixel count */
  px: number;
  /** 100 * px / the page's total diff — which genus dominates */
  diffShare: number;
  /** 100 * px / the frame — the same unit as the % table */
  frameShare: number;
}

/** clusterDiff's return: the diffPixels result + the buckets. */
export interface ClusterResult extends DiffResult {
  buckets: DiffBucket[];
}

/** Session-100 (S100-P0): the diff-clustering decode — PURE, beside
 *  diffPixels with the IDENTICAL tolerance semantics (a pixel differs
 *  when ANY channel diverges by more than `tol`). Clusters the diff
 *  pixels by a coarse-grid union-find: the frame divides into `gap`-px
 *  cells, a cell is MARKED when it contains a diff pixel, and
 *  8-adjacent marked cells merge — so clusters separated by less than
 *  ~`gap` px merge (the anti-aliasing-noise absorption the one-off
 *  probes tuned by hand; grid alignment makes the exact merge boundary
 *  data-dependent, which is fine for a decode). Each bucket carries
 *  its diff-pixel bbox + count + its share of the page's diff + its
 *  share of the frame, sorted by px DESC (the biggest genus first).
 *  Throws on size mismatch (the diffPixels parity) and on a
 *  non-positive gap (the B-97a2 doctrine — the cell math divides by
 *  it). An identical pair yields zero buckets. */
export function clusterDiff(
  a: Uint8ClampedArray,
  b: Uint8ClampedArray,
  tol: number,
  w: number,
  h: number,
  gap: number,
): ClusterResult {
  const total = w * h;
  if (a.length !== total * 4 || b.length !== total * 4) {
    throw new Error(
      `size mismatch: expected ${total * 4} samples per image (w=${w} h=${h}), got a=${a.length} b=${b.length}`,
    );
  }
  if (!Number.isFinite(gap) || gap < 1) {
    throw new Error(
      `clusterDiff: gap must be a finite number >= 1 (the cell math divides by it — the B-97a2 NaN doctrine), got ${gap}`,
    );
  }
  // pass 1: mark cells + track each cell's diff-pixel bounds/count
  const cw = Math.ceil(w / gap);
  const cells = new Map<number, { px: number; x0: number; y0: number; x1: number; y1: number }>();
  let diffPx = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      if (
        Math.abs(a[o] - b[o]) > tol ||
        Math.abs(a[o + 1] - b[o + 1]) > tol ||
        Math.abs(a[o + 2] - b[o + 2]) > tol ||
        Math.abs(a[o + 3] - b[o + 3]) > tol
      ) {
        diffPx++;
        const key = Math.floor(y / gap) * cw + Math.floor(x / gap);
        const c = cells.get(key);
        if (c) {
          c.px++;
          if (x < c.x0) c.x0 = x;
          if (x > c.x1) c.x1 = x;
          if (y < c.y0) c.y0 = y;
          if (y > c.y1) c.y1 = y;
        } else {
          cells.set(key, { px: 1, x0: x, y0: y, x1: x, y1: y });
        }
      }
    }
  }
  // pass 2: union-find over the marked cells (8-adjacency; the
  // connected partition is iteration-order-independent)
  const parent = new Map<number, number>();
  const find = (k: number): number => {
    let r = k;
    while (parent.get(r) !== r) r = parent.get(r)!;
    let c = k;
    while (parent.get(c) !== c) {
      const next = parent.get(c)!;
      parent.set(c, r);
      c = next;
    }
    return r;
  };
  const union = (x: number, y: number) => {
    const rx = find(x);
    const ry = find(y);
    if (rx !== ry) parent.set(rx, ry);
  };
  for (const key of cells.keys()) parent.set(key, key);
  for (const key of cells.keys()) {
    const cy = Math.floor(key / cw);
    const cx = key - cy * cw;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        // F-101a1 (s101): the neighbor column must never wrap —
        // cx=0 with dx=-1 aliases to the LAST column of the adjacent
        // row (and cx=cw-1 with dx=+1 to the first of the next),
        // falsely merging edge cells up to ~w-gap px apart. Vertical
        // out-of-range keys cannot collide with a marked cell (the
        // key space is bounded), so the horizontal guard is complete.
        if (cx + dx < 0 || cx + dx >= cw) continue;
        const nk = (cy + dy) * cw + (cx + dx);
        if (cells.has(nk)) union(key, nk);
      }
    }
  }
  // pass 3: aggregate each root into one bucket (exact pixel bounds)
  const agg = new Map<number, DiffBucket>();
  for (const [key, c] of cells) {
    const r = find(key);
    const b = agg.get(r);
    if (b) {
      b.px += c.px;
      if (c.x0 < b.x0) b.x0 = c.x0;
      if (c.y0 < b.y0) b.y0 = c.y0;
      if (c.x1 > b.x1) b.x1 = c.x1;
      if (c.y1 > b.y1) b.y1 = c.y1;
    } else {
      agg.set(r, { x0: c.x0, y0: c.y0, x1: c.x1, y1: c.y1, px: c.px, diffShare: 0, frameShare: 0 });
    }
  }
  const buckets = [...agg.values()]
    .map((b) => ({
      ...b,
      diffShare: (100 * b.px) / diffPx,
      frameShare: (100 * b.px) / total,
    }))
    .sort((p, q) => q.px - p.px);
  return { diffPx, total, pct: (100 * diffPx) / total, buckets };
}

const REPO = path.resolve(import.meta.dirname, "..");
const OUR_URL = process.env.OUR_URL ?? "http://localhost:3000";
const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app";
const REF_EMAIL = process.env.REF_EMAIL ?? "sepnetflix2023@outlook.com";
const REF_PASSWORD = process.env.REF_PASSWORD ?? "$Abcd1234";
const SHOTS = path.join(REPO, "scripts", "sweep-shots");

const log = (s: string) => console.log(`[sweep] ${s}`);

/** Wait for a URL to answer 200 (the dev-server boot wait). */
async function waitOnUrl(url: string, ms: number): Promise<boolean> {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url, { redirect: "follow" });
      if (r.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function login(page: import("@playwright/test").Page, base: string) {
  await page.goto(`${base}/login`, { waitUntil: "networkidle" });
  // hydration settle: filling during hydration gets cleared by the
  // re-render before submit (the observed 400 "email and password are
  // required" race on our app)
  await page.waitForTimeout(1200);
  await page.fill('input[type="email"]', REF_EMAIL);
  await page.fill('input[type="password"]', REF_PASSWORD);
  await Promise.all([
    page.waitForURL((u) => !u.pathname.endsWith("/login"), { timeout: 30000 }),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(1500);
}

/** Close the reference's Base44 badge (it overlays the bottom-right). */
async function closeBadge(page: import("@playwright/test").Page) {
  await page
    .locator('button[aria-label*="close badge" i]')
    .click({ timeout: 2000 })
    .catch(() => undefined);
}

async function captureAll(
  page: import("@playwright/test").Page,
  base: string,
  dir: string,
  pages: readonly PageEntry[],
) {
  mkdirSync(dir, { recursive: true });
  for (const p of pages) {
    await page.goto(`${base}${p.path}`, { waitUntil: "domcontentloaded" });
    // content-wait: the shell's main column must paint before the
    // capture. Width-AGNOSTIC by design (session-94): the nav links
    // are display:none below md on BOTH apps, so a nav-a visible-wait
    // burns its full 15s timeout on every page at phone width. main
    // paints at every width; the 2500ms settle below covers the
    // shell's data fetch.
    await page
      .locator("main")
      .first()
      .waitFor({ state: "visible", timeout: 15000 })
      .catch(() => undefined);
    await page.waitForTimeout(2500);
    await closeBadge(page);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(dir, `${p.name}.png`) });
    log(`captured ${dir}/${p.name}.png`);
  }
}

/** Decode a PNG in the browser + run the diff seam on its pixels.
 *  Session-100 (S100-P1): pass a clusterGap to ALSO decode the diff
 *  into buckets — the inline twin of clusterDiff (the no-bundling
 *  doctrine — the same cross-reference diffPixels carries; the pure
 *  seam is what the unit pins exercise in node). */
async function diffPair(
  page: import("@playwright/test").Page,
  refPng: Buffer,
  ourPng: Buffer,
  clusterGap: number | null = null,
): Promise<ClusterResult> {
  const a = `data:image/png;base64,${refPng.toString("base64")}`;
  const b = `data:image/png;base64,${ourPng.toString("base64")}`;
  return page.evaluate(
    async ({ a, b, tol, gap }) => {
      const load = (src: string) =>
        new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = () => rej(new Error("png decode failed"));
          img.src = src;
        });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      if (ia.width !== ib.width || ia.height !== ib.height) {
        throw new Error(`size mismatch: ${ia.width}x${ia.height} vs ${ib.width}x${ib.height}`);
      }
      const w = ia.width;
      const h = ia.height;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      const px = (img: HTMLImageElement) => {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, w, h).data;
      };
      const da = px(ia);
      const db = px(ib);
      // the same seam as node — inlined for the browser (no bundling)
      const total = w * h;
      let diffPx = 0;
      for (let i = 0; i < total; i++) {
        const o = i * 4;
        if (
          Math.abs(da[o] - db[o]) > tol ||
          Math.abs(da[o + 1] - db[o + 1]) > tol ||
          Math.abs(da[o + 2] - db[o + 2]) > tol ||
          Math.abs(da[o + 3] - db[o + 3]) > tol
        ) {
          diffPx++;
        }
      }
      // the inline twin of clusterDiff — the same coarse-grid
      // union-find decode (see the PURE seam above; gap === null skips
      // the decode entirely, returning the plain diffPixels result)
      if (gap === null) {
        return { diffPx, total, pct: (100 * diffPx) / total, buckets: [] };
      }
      const cw = Math.ceil(w / gap);
      const cells = new Map();
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const o = (y * w + x) * 4;
          if (
            Math.abs(da[o] - db[o]) > tol ||
            Math.abs(da[o + 1] - db[o + 1]) > tol ||
            Math.abs(da[o + 2] - db[o + 2]) > tol ||
            Math.abs(da[o + 3] - db[o + 3]) > tol
          ) {
            const key = Math.floor(y / gap) * cw + Math.floor(x / gap);
            const c = cells.get(key);
            if (c) {
              c.px++;
              if (x < c.x0) c.x0 = x;
              if (x > c.x1) c.x1 = x;
              if (y < c.y0) c.y0 = y;
              if (y > c.y1) c.y1 = y;
            } else {
              cells.set(key, { px: 1, x0: x, y0: y, x1: x, y1: y });
            }
          }
        }
      }
      const parent = new Map();
      const find = (k) => {
        let r = k;
        while (parent.get(r) !== r) r = parent.get(r);
        let c = k;
        while (parent.get(c) !== c) {
          const next = parent.get(c);
          parent.set(c, r);
          c = next;
        }
        return r;
      };
      const union = (x, y) => {
        const rx = find(x);
        const ry = find(y);
        if (rx !== ry) parent.set(rx, ry);
      };
      for (const key of cells.keys()) parent.set(key, key);
      for (const key of cells.keys()) {
        const cy = Math.floor(key / cw);
        const cx = key - cy * cw;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            // F-101a1 (s101): the neighbor column must never wrap —
            // the inline twin carries the SAME guard the PURE seam
            // carries (the no-bundling doctrine; see the node seam
            // above for the decode)
            if (cx + dx < 0 || cx + dx >= cw) continue;
            const nk = (cy + dy) * cw + (cx + dx);
            if (cells.has(nk)) union(key, nk);
          }
        }
      }
      const agg = new Map();
      for (const [key, c] of cells) {
        const r = find(key);
        const b = agg.get(r);
        if (b) {
          b.px += c.px;
          if (c.x0 < b.x0) b.x0 = c.x0;
          if (c.y0 < b.y0) b.y0 = c.y0;
          if (c.x1 > b.x1) b.x1 = c.x1;
          if (c.y1 > b.y1) b.y1 = c.y1;
        } else {
          agg.set(r, { x0: c.x0, y0: c.y0, x1: c.x1, y1: c.y1, px: c.px, diffShare: 0, frameShare: 0 });
        }
      }
      const buckets = [...agg.values()]
        .map((b) => ({
          ...b,
          diffShare: (100 * b.px) / diffPx,
          frameShare: (100 * b.px) / total,
        }))
        .sort((p, q) => q.px - p.px);
      return { diffPx, total, pct: (100 * diffPx) / total, buckets };
    },
    { a, b, tol: TOLERANCE, gap: clusterGap },
  );
}

async function main() {
  // Session-97 (S97-P1): ALL numeric flags route through parseNumberArg —
  // a missing/non-numeric value fails fast instead of arming NaN
  // (B-97a2: `pct > NaN` is always false; the gate would pass everything)
  const maxDiff = parseNumberArg(process.argv, "--max-diff", null);

  // Session-96 (S96-P2): the per-page drift gate — `--fail-on-drift`
  // exits 1 when any page exceeds ITS OWN standing baseline + margin
  // (default 0.5pct; override `--drift-margin <pct>`). Unlike the global
  // --max-diff threshold (which must sit above the worst standing genus
  // and so cannot see a 0.00% page drifting to 5%), the drift gate
  // judges each page against its own documented genus.
  const failOnDrift = process.argv.includes("--fail-on-drift");
  const driftMargin = parseNumberArg(process.argv, "--drift-margin", 0.5) as number;

  // Session-100 (S100-P1): the diff-clustering decode — `--clusters`
  // decodes each page's diff into BUCKETS (clustered regions of
  // differing pixels, the coarse-grid union-find the genus hunts ran
  // as one-off probes since s95 — now one flag). `--cluster-gap <px>`
  // (default 16) tunes the merge distance: clusters closer than ~gap
  // px merge. Pure decode/report output — the gate semantics are
  // UNCHANGED (the drift-gate output byte-identical with or without
  // --clusters).
  const clusters = process.argv.includes("--clusters");
  const clusterGap = parseNumberArg(process.argv, "--cluster-gap", 16) as number;

  // Session-95 (S95-P0): the --pages filter — restricts BOTH the capture
  // and the diff loops to the named pages for targeted rotation runs
  // (`bun run sweep -- --pages leads,settings`). The default (no flag) is
  // the full ten-page sweep, unchanged; unknown names fail fast.
  const pages = parsePagesArg(process.argv, PAGES);

  // Session-94 (S94-P0): the phone-width mode — `bun run sweep --
  // --width 390 --height 844` runs the same ten-page zero-data diff at
  // phone width (the s93 suggested next: the 390px rotation method
  // productized — the dialog/popover/tabs families were walked
  // manually at TRUE 390x844 for three sessions before this). The
  // viewport feeds BOTH the capture context and the shots dir (a
  // w390x844 run must never collide with the desktop shots).
  const WIDTH = parseNumberArg(process.argv, "--width", 1440) as number;
  const HEIGHT = parseNumberArg(process.argv, "--height", 900) as number;
  const shots = path.join(SHOTS, `w${WIDTH}x${HEIGHT}`);

  // 1. the dev server: reuse :3000 or boot one
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    log(`reusing the dev server on ${OUR_URL}`);
  } else {
    log("booting the dev server (bun run dev)…");
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) {
      console.error("[sweep] the dev server never came up on :3000");
      process.exit(1);
    }
    log("dev server up");
  }

  try {
    // 2. the zero-data state on OUR side (users + settings kept).
    //    The platform DATABASE_URL override hazard: UNSET the variable
    //    (env -u), never set it empty — Prisma rejects an empty URL.
    log("zeroing our domain data (scripts/zero-data.ts)…");
    // Session-93 (F-A): NO cast here. Next 16's next/types/global.d.ts
    // (pulled into every program importing next/server) augments
    // NodeJS.ProcessEnv with a REQUIRED readonly NODE_ENV — a widened
    // Record<string, string | undefined> cannot satisfy that member and
    // spawnSync's env option rejects it, failing `tsc --noEmit` on a
    // FRESH CLONE. The spread's inferred ProcessEnv type is the correct
    // env; `delete` stays legal (DATABASE_URL rides the Dict<string>
    // index signature, not a declared required member).
    const zEnv = { ...process.env };
    delete zEnv.DATABASE_URL;
    const z = spawnSync("bun", ["scripts/zero-data.ts"], {
      cwd: REPO,
      env: zEnv,
      stdio: "inherit",
    });
    if (z.status !== 0) throw new Error("zero-data.ts failed");

    // 3-4. capture both sides + diff
    const browser = await chromium.launch({ headless: process.env.HEADLESS === "0" ? false : true });
    const ctx = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT } });
    const refPage = await ctx.newPage();
    log(`logging into the reference ${REF_URL}…`);
    await login(refPage, REF_URL);
    await captureAll(refPage, REF_URL, path.join(shots, "ref"), pages);

    const ourPage = await ctx.newPage();
    log(`logging into ours ${OUR_URL}…`);
    await login(ourPage, OUR_URL);
    await captureAll(ourPage, OUR_URL, path.join(shots, "ours"), pages);

    const diffPage = await ctx.newPage();
    await diffPage.goto("about:blank");
    log(`pairwise pixel diff (viewport ${WIDTH}x${HEIGHT}, tolerance ${TOLERANCE}${clusters ? `, cluster gap ${clusterGap}px` : ""})…`);
    const rows: Array<[string, number]> = [];
    const bucketRows: Array<[string, DiffBucket[]]> = [];
    for (const p of pages) {
      const refPng = readFileSync(path.join(shots, "ref", `${p.name}.png`));
      const ourPng = readFileSync(path.join(shots, "ours", `${p.name}.png`));
      const r = await diffPair(diffPage, refPng, ourPng, clusters ? clusterGap : null);
      rows.push([p.name, r.pct]);
      bucketRows.push([p.name, r.buckets]);
    }
    await browser.close();

    // 5. the report
    console.log(`\n[sweep] === the zero-data diff report (${WIDTH}x${HEIGHT}) ===`);
    let worst = 0;
    for (const [name, pct] of rows) {
      worst = Math.max(worst, pct);
      console.log(`  ${name.padEnd(12)} ${pct.toFixed(2)}%`);
    }
    console.log(standingExplained(WIDTH));

    // Session-100 (S100-P1): the bucket table — the diff-clustering
    // decode (top 5 per page, biggest genus first). The decode answers
    // WHERE a diff lives (the rail band vs the content band) before any
    // DOM probe is written.
    if (clusters) {
      console.log(`[sweep] clusters (gap ${clusterGap}px) — the diff-bucket decode (top 5 per page):`);
      for (const [name, buckets] of bucketRows) {
        if (buckets.length === 0) {
          console.log(`  ${name.padEnd(12)} no diff pixels`);
          continue;
        }
        console.log(`  ${name.padEnd(12)} ${buckets.length} bucket${buckets.length === 1 ? "" : "s"}`);
        for (let i = 0; i < Math.min(buckets.length, 5); i++) {
          const b = buckets[i];
          console.log(
            `    ${i + 1}. [x ${b.x0}..${b.x1}, y ${b.y0}..${b.y1}] ${b.px}px (${b.diffShare.toFixed(1)}% of diff, ${b.frameShare.toFixed(2)}% of frame)`,
          );
        }
        if (buckets.length > 5) console.log(`    … +${buckets.length - 5} more`);
      }
    }

    // the seed restore (always — even when gated)
    log("restoring the seed (bun run db:seed)…");
    const s = spawnSync("bun", ["run", "db:seed"], { cwd: REPO, env: zEnv, stdio: "inherit" });
    if (s.status !== 0) throw new Error("db:seed failed — run it manually");
    log("seed restored (verify: bun run db:census)");

    if (maxDiff !== null && worst > maxDiff) {
      console.error(`[sweep] GATE FAIL: worst ${worst.toFixed(2)}% > --max-diff ${maxDiff}`);
      process.exit(1);
    }

    // Session-96 (S96-P2): the per-page drift gate — AFTER the seed
    // restore (the --max-diff ordering: the workspace is never left
    // zeroed because a gate tripped).
    if (failOnDrift) {
      const verdict = driftVerdict(rows, standingBaseline(WIDTH), driftMargin);
      if (!verdict.ok) {
        for (const f of verdict.failures) {
          console.error(
            `[sweep] DRIFT: ${f.page} ${f.pct.toFixed(2)}% > baseline ${f.baseline} + margin ${driftMargin} (allowed ${f.allowed.toFixed(2)}%)`,
          );
        }
        console.error(`[sweep] DRIFT GATE FAIL: ${verdict.failures.length} page(s) above their standing baselines`);
        process.exit(1);
      }
      log(`drift gate clean (margin ${driftMargin}pct over the standing baselines)`);
    }
    log("done");
  } finally {
    if (spawned?.pid) {
      try {
        process.kill(-spawned.pid, "SIGTERM");
      } catch {
        /* already gone */
      }
    }
  }
}

// run only when executed directly (bun scripts/sweep.ts / bun run sweep),
// never on the vitest import (the unit pins)
if (process.argv[1] && process.argv[1].endsWith("sweep.ts")) {
  main().catch((e) => {
    console.error("[sweep]", e);
    process.exit(1);
  });
}

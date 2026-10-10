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
//   3. logs into BOTH apps, captures the 9 pages per app at the given
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

/** The per-channel anti-aliasing tolerance (the s91 value). */
export const TOLERANCE = 12;

/** Session-96 (S96-P2): the per-page STANDING baselines — the documented
 * explained-diff genera by viewport class (phone = width < 768, the md
 * breakpoint — BOTH walked phone widths 390x844 and 375x812 ride the
 * phone table; desktop otherwise). The values sit just above the
 * measured standing tables (the s91–s96 runs) so the default margin
 * (0.5pct) absorbs run-to-run noise while any NEW drift — a 0.00% page
 * moving to 5%, invisible to a global --max-diff 8 gate — fails.
 * PURE by design: pinned in tests/sweep-tool.test.ts beside
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
} as const;

export type BaselineTable = Record<string, number>;

/** The baseline table for a viewport width (the md breakpoint split). */
export function standingBaseline(width: number): BaselineTable {
  return width < 768 ? { ...STANDING_BASELINES.phone } : { ...STANDING_BASELINES.desktop };
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

/** Decode a PNG in the browser + run the diff seam on its pixels. */
async function diffPair(
  page: import("@playwright/test").Page,
  refPng: Buffer,
  ourPng: Buffer,
): Promise<DiffResult> {
  const a = `data:image/png;base64,${refPng.toString("base64")}`;
  const b = `data:image/png;base64,${ourPng.toString("base64")}`;
  return page.evaluate(
    async ({ a, b, tol }) => {
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
      return { diffPx, total, pct: (100 * diffPx) / total };
    },
    { a, b, tol: TOLERANCE },
  );
}

async function main() {
  const maxDiffIdx = process.argv.indexOf("--max-diff");
  const maxDiff = maxDiffIdx >= 0 ? Number(process.argv[maxDiffIdx + 1]) : null;

  // Session-96 (S96-P2): the per-page drift gate — `--fail-on-drift`
  // exits 1 when any page exceeds ITS OWN standing baseline + margin
  // (default 0.5pct; override `--drift-margin <pct>`). Unlike the global
  // --max-diff threshold (which must sit above the worst standing genus
  // and so cannot see a 0.00% page drifting to 5%), the drift gate
  // judges each page against its own documented genus.
  const failOnDrift = process.argv.includes("--fail-on-drift");
  const driftMarginIdx = process.argv.indexOf("--drift-margin");
  const driftMargin = driftMarginIdx >= 0 ? Number(process.argv[driftMarginIdx + 1]) : 0.5;

  // Session-95 (S95-P0): the --pages filter — restricts BOTH the capture
  // and the diff loops to the named pages for targeted rotation runs
  // (`bun run sweep -- --pages leads,settings`). The default (no flag) is
  // the full 9-page sweep, unchanged; unknown names fail fast.
  const pages = parsePagesArg(process.argv, PAGES);

  // Session-94 (S94-P0): the phone-width mode — `bun run sweep --
  // --width 390 --height 844` runs the same 9-page zero-data diff at
  // phone width (the s93 suggested next: the 390px rotation method
  // productized — the dialog/popover/tabs families were walked
  // manually at TRUE 390x844 for three sessions before this). The
  // viewport feeds BOTH the capture context and the shots dir (a
  // w390x844 run must never collide with the desktop shots).
  const widthIdx = process.argv.indexOf("--width");
  const WIDTH = widthIdx >= 0 ? Number(process.argv[widthIdx + 1]) : 1440;
  const heightIdx = process.argv.indexOf("--height");
  const HEIGHT = heightIdx >= 0 ? Number(process.argv[heightIdx + 1]) : 900;
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
    log(`pairwise pixel diff (viewport ${WIDTH}x${HEIGHT}, tolerance ${TOLERANCE})…`);
    const rows: Array<[string, number]> = [];
    for (const p of pages) {
      const refPng = readFileSync(path.join(shots, "ref", `${p.name}.png`));
      const ourPng = readFileSync(path.join(shots, "ours", `${p.name}.png`));
      const r = await diffPair(diffPage, refPng, ourPng);
      rows.push([p.name, r.pct]);
    }
    await browser.close();

    // 5. the report
    console.log(`\n[sweep] === the zero-data diff report (${WIDTH}x${HEIGHT}) ===`);
    let worst = 0;
    for (const [name, pct] of rows) {
      worst = Math.max(worst, pct);
      console.log(`  ${name.padEnd(12)} ${pct.toFixed(2)}%`);
    }
    console.log(
      "[sweep] standing explained: settings ~4.7% picklist-data · contacts ~0.5% lucide superset · dashboard ~0.3% chart artifact",
    );

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

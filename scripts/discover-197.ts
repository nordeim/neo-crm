// Session-197 (discovery): the s412 close's OTHER named candidate —
// THE SWEEP-STATE'S OWN COVERAGE AUDIT — adjudicated BEFORE the plan,
// with the s120-era interactive-table staleness candidate adjudicated
// in the same pass (the session_414 close named both).
//
//   1. LEG-1 THE STANDING DATA-GATED RE-CHECKS (the discover-184..196
//      legs condensed one pass) — probe:ref STABLE this session
//      (46bc2d9c — the demo data still ZERO) means every
//      data-dependent arm is expected KILLED again.
//   2. LEG-2a THE SWEEP-STATE COVERAGE AUDIT: the app's RENDERABLE
//      route inventory vs. the standing drift-gate inventories (the
//      sweep PAGES 13 · the interior census 12 + the public leg 1) —
//      every uncovered surface probed LIVE on both apps: the 404
//      (auth + anon contexts), /signup + /reset-password (the
//      ours-only supersets), and THE MAIDEN MEASUREMENT — the 404
//      pair captured at the sweep's own four viewport bands and
//      pixel-diffed at the sweep's own tolerance, the standing share
//      the D-197a1 baselines would carry.
//   3. LEG-2b THE s120-ERA INTERACTIVE-TABLE CANDIDATE: adjudicated
//      by source-stability + standing-gate evidence (the leads
//      family source-frozen since s113, 84 sessions; the /leads sweep
//      baselines at the 0.1 floor at all four bands; the s113
//      menu/popover re-walk + the s56 popover walk + the s193a1
//      outline-color decode already covering the family's only
//      computed-style change vector since s120).
//   4. LEG-3 THE CONDITIONAL GATES: probe:ref STABLE at 46bc2d9c
//      kills the fresh-bundle candidate; the registry's latest
//      recharts fetched live kills the 4.0 gate.
//
// Run: bun scripts/discover-197.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  authenticated legs + the maiden captures ride the sweep-state
//  storageState pair, the s162 doctrine.)
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

import { preflightPairState } from "./sweep-state";
import { waitOnUrl } from "./sweep";

const REPO = (() => {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const root = resolve(here, "..");
    if (existsSync(join(root, "package.json"))) return root;
  } catch {
    /* fall through to the cwd */
  }
  return process.cwd();
})();
const OUR_URL = "http://localhost:3000";
const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app";
const SHOTS = join(REPO, "scripts", "sweep-shots", "discover-197");

/** Leg 1a — the standing Edit-family re-check (condensed): the three
 * entity pages' rows + rowMenus, one pass per app. */
async function censusRows(page: import("@playwright/test").Page, url: string, label: string): Promise<void> {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2200);
  const census = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("main table tbody tr")).filter(
      (tr) => (tr.textContent ?? "").trim().length > 0,
    );
    const rowMenuButtons = Array.from(document.querySelectorAll('main button[aria-haspopup="true"], main button[aria-haspopup="menu"]'));
    return {
      rows: rows.length,
      emptyState: (document.querySelector("main .text-center, main [class*='py-10']")?.textContent ?? "").trim().slice(0, 60),
      rowMenuButtons: rowMenuButtons.length,
    };
  });
  console.log(`  [${url.replace(/^https?:\/\/[^/]+/, "")} ${label}] rows=${census.rows} rowMenus=${census.rowMenuButtons} empty="${census.emptyState}"`);
}

/** Leg 1b — the topbar-search dropdown re-check (the s32 dead-stub
 * doctrine: populated=0 expected on both). */
async function probeTopbarSearch(page: import("@playwright/test").Page, base: string, label: string): Promise<void> {
  await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(1500);
  const input = page.locator('input[placeholder*="Search"], input[type="search"]').first();
  if (!(await input.count())) {
    console.log(`  [topbar ${label}] search input NOT FOUND`);
    return;
  }
  await input.fill("zzz-no-such-entity");
  await page.waitForTimeout(800);
  const populated = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[role="option"], [cmdk-item], [data-radix-popper-content] a, [class*="Command"] [role="button"]'));
    return items.filter((el) => (el.textContent ?? "").trim().length > 0).length;
  });
  console.log(`  [topbar ${label}] dropdown populated=${populated} (expected 0 — the s32 dead-stub doctrine)`);
}

/** Leg 1c — the dashboard follow-up-rows checkbox arms (data-gated). */
async function probeDashboardCheckboxes(page: import("@playwright/test").Page, base: string, label: string): Promise<void> {
  await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(1500);
  const n = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("main table, main ul"));
    const withCheckboxes = cards.filter(
      (c) => c.querySelectorAll('input[type="checkbox"]').length > 0,
    ).length;
    const rows = Array.from(document.querySelectorAll("main table tbody tr, main ul li")).filter(
      (r) => (r.textContent ?? "").trim().length > 0,
    ).length;
    return { withCheckboxes, rows };
  });
  console.log(`  [dashboard ${label}] follow-up rows=${n.rows} tablesWithCheckboxes=${n.withCheckboxes}`);
}

/** Leg 1d — the activities Completed-tab row actions (data-gated). */
async function probeActivitiesCompleted(page: import("@playwright/test").Page, base: string, label: string): Promise<void> {
  await page.goto(`${base}/activities`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(1200);
  const tabs = page.getByRole("tab", { name: /completed/i });
  if (await tabs.count()) {
    await tabs.first().click();
    await page.waitForTimeout(900);
  }
  const n = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main table tbody tr")).filter(
      (tr) => (tr.textContent ?? "").trim().length > 0,
    ).length,
  );
  console.log(`  [activities ${label}] completed rows=${n} rowActionMenus=${await page.evaluate(() => document.querySelectorAll('main button[aria-haspopup="true"]').length)}`);
}

/** LEG-2a — the uncovered-surface posture probe (auth context, the
 * sweep capture state): where does each app send a logged-in visitor
 * for the surfaces the drift-gate inventories do NOT carry? */
async function probeSurface(page: import("@playwright/test").Page, base: string, label: string, path: string): Promise<void> {
  const resp = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" }).catch(() => null);
  await page.waitForTimeout(2000);
  const finalUrl = page.url();
  const h1 = await page.locator("h1").first().textContent().catch(() => "(none)");
  const hasMain = await page.locator("main").count();
  const badge = await page.locator('button[aria-label*="close badge" i]').count();
  console.log(
    `  [surface ${path} ${label}] http=${resp?.status() ?? "n/a"} final=${finalUrl.replace(base, "")} h1="${(h1 ?? "").trim().slice(0, 32)}" main=${hasMain > 0} badge=${badge > 0}`,
  );
}

/** LEG-2a — the 404 anon-posture re-check (fresh context, no
 * storageState): the s194 D-194a5 decode standing — OURS renders the
 * designed 404 AT the unknown URL with the true 404 for anon and
 * authenticated alike; the REF's auth-first guard redirects anon
 * unknown-routes to the wall. */
async function probeAnon404(browser: import("@playwright/test").Browser, base: string, label: string): Promise<void> {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const resp = await page.goto(`${base}/anon-no-such-route-197`, { waitUntil: "domcontentloaded" }).catch(() => null);
  await page.waitForTimeout(2000);
  const finalUrl = page.url();
  const h1 = await page.locator("h1").first().textContent().catch(() => "(none)");
  console.log(`  [anon-404 ${label}] http=${resp?.status() ?? "n/a"} final=${finalUrl.replace(base, "")} h1="${(h1 ?? "").trim().slice(0, 32)}"`);
  await ctx.close();
}

/** LEG-2a — THE MAIDEN MEASUREMENT: the 404 pair captured at the
 * sweep's own four viewport bands (desktop 1440x900 · phone 390x844 ·
 * tablet 768x1024 · landscape 1024x768), the REF badge closed, the
 * h1-404 wait (the 404 carries NO main — the sweep's main wait would
 * burn its full 15s timeout per capture), then pixel-diffed at the
 * sweep's own tolerance (12) — the standing share the D-197a1
 * baselines would carry per band. */
async function capture404(
  page: import("@playwright/test").Page,
  base: string,
  dir: string,
  width: number,
  height: number,
): Promise<string> {
  await page.setViewportSize({ width, height });
  await page.goto(`${base}/no-such-sweep-route-197`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "404", exact: true }).waitFor({ state: "visible", timeout: 15000 });
  await page.waitForTimeout(2500);
  await page
    .locator('button[aria-label*="close badge" i]')
    .click({ timeout: 2000 })
    .catch(() => undefined);
  await page.waitForTimeout(300);
  const file = join(dir, `not-found.png`);
  await page.screenshot({ path: file });
  return file;
}

async function diffPngs(
  page: import("@playwright/test").Page,
  refPng: Buffer,
  ourPng: Buffer,
): Promise<{ diffPx: number; total: number; pct: number }> {
  const a = `data:image/png;base64,${refPng.toString("base64")}`;
  const b = `data:image/png;base64,${ourPng.toString("base64")}`;
  return page.evaluate(async ({ a, b, tol }) => {
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
    return { diffPx, total, pct: (diffPx / total) * 100 };
  }, { a, b, tol: 12 });
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-197] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    // LEG-1 — the authenticated standing re-checks (the s162 guarded form)
    const state = await preflightPairState(browser);
    console.log("[discover-197] pair state: ready (the s162 guarded form)");
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n########## LEG-1 STANDING RE-CHECKS ${label} ##########`);
      for (const p of ["/contacts", "/leads", "/accounts"]) {
        await censusRows(page, `${base}${p}`, label).catch((e) => console.log(`  [${p} ${label}] ERROR: ${e}`));
      }
      await probeTopbarSearch(page, base, label).catch((e) => console.log(`  [topbar ${label}] ERROR: ${e}`));
      await probeDashboardCheckboxes(page, base, label).catch((e) => console.log(`  [dashboard ${label}] ERROR: ${e}`));
      await probeActivitiesCompleted(page, base, label).catch((e) => console.log(`  [activities ${label}] ERROR: ${e}`));

      console.log(`\n########## LEG-2a UNCOVERED SURFACES (auth context) ${label} ##########`);
      await probeSurface(page, base, label, "/no-such-sweep-route-197").catch((e) => console.log(`  [404 ${label}] ERROR: ${e}`));
      await probeSurface(page, base, label, "/signup").catch((e) => console.log(`  [signup ${label}] ERROR: ${e}`));
      await probeSurface(page, base, label, "/reset-password").catch((e) => console.log(`  [reset ${label}] ERROR: ${e}`));
      await ctx.close();
    }

    console.log("\n########## LEG-2a THE SWEEP-STATE COVERAGE INVENTORY (static) ##########");
    console.log("  [inventory] sweep PAGES (13): dashboard landing about contact accounts contacts leads calendar activities reports settings profile login");
    console.log("  [inventory] census INTERIOR_PAGES (12): the 9 app pages + about + contact + login");
    console.log("  [inventory] census PUBLIC_PAGES (1): landing");
    console.log("  [inventory] app renderable routes NOT in any inventory: /signup · /reset-password (OURS-ONLY supersets — the REF has no such routes) · THE 404 (two-app renderable, e2e+a11y-pinned since s194/s195, ZERO drift-gate coverage)");

    console.log("\n########## LEG-2a THE MAIDEN MEASUREMENT (the 404 pair at the four bands) ##########");
    const bands: Array<[string, number, number]> = [
      ["desktop", 1440, 900],
      ["phone", 390, 844],
      ["tablet", 768, 1024],
      ["landscape", 1024, 768],
    ];
    for (const [band, width, height] of bands) {
      const ctx = await browser.newContext({ viewport: { width, height }, storageState: state });
      const page = await ctx.newPage();
      const refDir = join(SHOTS, band, "ref");
      const ourDir = join(SHOTS, band, "ours");
      mkdirSync(refDir, { recursive: true });
      mkdirSync(ourDir, { recursive: true });
      const refPng = readFileSync(await capture404(page, REF_URL, refDir, width, height));
      const ourPng = readFileSync(await capture404(page, OUR_URL, ourDir, width, height));
      const diff = await diffPngs(page, refPng, ourPng);
      console.log(
        `  [maiden ${band} ${width}x${height}] diffPx=${diff.diffPx}/${diff.total} share=${diff.pct.toFixed(2)}%`,
      );
      await ctx.close();
    }

    console.log("\n########## LEG-2a ANON 404 POSTURE (the s194 D-194a5 decode standing) ##########");
    await probeAnon404(browser, OUR_URL, "OURS").catch((e) => console.log(`  [anon-404 OURS] ERROR: ${e}`));
    await probeAnon404(browser, REF_URL, "REF ").catch((e) => console.log(`  [anon-404 REF ] ERROR: ${e}`));

    console.log("\n########## LEG-2b THE s120-ERA INTERACTIVE-TABLE CANDIDATE (evidence adjudication) ##########");
    console.log("  [leg-2b] the leads family source: src/app/(app)/leads/ untouched since s113 (2026-10-12, 84 sessions — git log evidence)");
    console.log("  [leg-2b] the deps: recharts 3.10.1 + lucide 0.525.0 + tailwind 4.3 — all unchanged since before s120 (the s196 re-walk's own version census)");
    console.log("  [leg-2b] the standing gates: the /leads sweep baselines at the 0.1 floor at all four bands (drift-gated closed pixels) · the s113 menu/popover re-walk (the Filters popover + the row menus) · the s56 popover walk · the s193a1 outline-color decode (the family's only computed-style change vector since s120)");
    console.log("  [leg-2b] verdict: KILLED as the round material — the family is source-frozen + dep-frozen; the s120-era faces' only change vector since (the base-layer outline-color rule) is decoded + drift-gated; a re-walk re-derives the s196 drawer verdict (STABLE — zero new deltas)");

    console.log("\n########## LEG-3 THE CONDITIONAL GATES ##########");
    console.log("  [leg-3] probe:ref STABLE at 46bc2d9c (verified this session before the discovery) — the fresh-bundle candidate KILLED");
    try {
      const r = await fetch("https://registry.npmjs.org/recharts/latest");
      const pkg = (await r.json()) as { version: string };
      console.log(`  [leg-3] the registry's latest recharts: ${pkg.version} — the 4.0 gate ${pkg.version.startsWith("4") ? "LIVE" : "KILLED"}`);
    } catch {
      console.log("  [leg-3] the registry fetch failed (offline?) — the pre-verified 3.10.1 standing");
    }
  } finally {
    await browser.close().catch(() => undefined);
    if (spawned?.pid) {
      try {
        process.kill(-spawned.pid, "SIGTERM");
      } catch {
        /* already gone */
      }
    }
  }
}

main().catch((e) => {
  console.error("[discover-197]", e);
  process.exit(1);
});

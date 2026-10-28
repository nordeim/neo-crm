// Session-196 (discovery): the s412 close's named next-rotation candidates,
// adjudicated BEFORE the plan:
//
//   1. THE STANDING RE-CHECKS (LEG-1, the discover-184..195 legs condensed
//      one pass) — the Edit-family rows + rowMenus + the topbar-search
//      dropdown + the dashboard follow-up checkboxes + the activities
//      Completed-tab. probe:ref STABLE this session (46bc2d9c — the demo
//      data still ZERO) means every data-dependent arm is expected KILLED
//      again; the legs are the standing one-probe re-check.
//   2. THE RE-WALK STALENESS LADDER (LEG-2, the s412 close's own naming:
//      "the walk50 drawer at 45+ sessions stale, the s144-era marketing
//      exteriors, or the sweep-state's own coverage audit") — adjudicated
//      by probe, not assumption:
//      LEG-2a the drawer-open INTERIOR: what the standing legs already pin
//      (the 10-check e2e battery · the a11y two-gate · the drift sweeps ·
//      the s147 Radix re-derivation) vs what only the s177 walk50
//      element-ledger ever verified — 19 sessions of product-code changes
//      since (the s193a1 base-layer outline-color rule touched every
//      outline face in the tree).
//      LEG-2b the s144-era marketing exteriors: the posture REVERSED at
//      s147 (the reference now login-walls its marketing pages) — probe
//      the CURRENT guest wall faces on both apps (the from_url round-trip
//      form) + the landing funnel's terminal hops, the s147-pinned
//      contract re-verified 49 sessions later.
//   3. THE CONDITIONAL GATES (LEG-3, the registry check): probe:ref
//      STABLE at 46bc2d9c kills the fresh-bundle candidate; the
//      registry's latest recharts verified live kills the 4.0 gate.
//
// Run: bun scripts/discover-196.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  authenticated legs ride the sweep-state storageState pair, the
//  s162 doctrine.)
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

import { preflightPairState } from "./sweep-state";

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

/** Leg 2b — the s144-era marketing exteriors posture probe (ANON, fresh
 * contexts — no storageState): the s147 login-wall form re-verified on
 * both apps: the guest /About + /Contact + the capital aliases land at
 * the wall with the from_url round-trip. */
async function probeGuestWall(page: import("@playwright/test").Page, base: string, label: string, path: string): Promise<void> {
  const resp = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" }).catch(() => null);
  await page.waitForTimeout(2500);
  const finalUrl = page.url();
  const h1 = await page.locator("h1").first().textContent().catch(() => "(none)");
  const hasCard = await page.locator("text=Welcome to NEO CRM").count().catch(() => 0);
  console.log(
    `  [wall ${path} ${label}] http=${resp?.status() ?? "n/a"} final=${finalUrl.replace(base, "")} h1="${(h1 ?? "").trim().slice(0, 40)}" wallCard=${hasCard > 0}`,
  );
}

/** Leg 2b — the landing funnel's terminal hops (ANON): the footer links
 * ride to the wall on both apps (the s144 funnel's s147 retirement). */
async function probeLandingFunnel(page: import("@playwright/test").Page, base: string, label: string): Promise<void> {
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1800);
  const anchors = await page.evaluate(() =>
    Array.from(document.querySelectorAll('footer a, a[href*="/About"], a[href*="/about"], a[href*="/Contact"], a[href*="/contact"]'))
      .map((a) => ({ href: a.getAttribute("href") ?? "", text: (a.textContent ?? "").trim().slice(0, 24) }))
      .filter((a) => /about|contact/i.test(a.href))
      .slice(0, 6),
  );
  console.log(`  [funnel ${label}] landing marketing anchors: ${JSON.stringify(anchors)}`);
  for (const a of anchors.slice(0, 2)) {
    await page.goto(`${base}${a.href.startsWith("/") ? a.href : new URL(a.href, base).pathname}`, { waitUntil: "domcontentloaded" }).catch(() => null);
    await page.waitForTimeout(1800);
    const finalUrl = page.url();
    const h1 = await page.locator("h1").first().textContent().catch(() => "(none)");
    console.log(`  [funnel-ride ${a.text} ${label}] final=${finalUrl.replace(base, "")} h1="${(h1 ?? "").trim().slice(0, 40)}"`);
  }
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-196] reusing the dev server on :3000");
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
    console.log("[discover-196] pair state: ready (the s162 guarded form)");
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
      await ctx.close();
    }

    // LEG-2b — the s144-era marketing exteriors: the CURRENT guest wall
    // posture on both apps (fresh anon contexts, no storageState)
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      console.log(`\n########## LEG-2b GUEST MARKETING EXTERIORS ${label} ##########`);
      for (const p of ["/about", "/About", "/contact", "/Contact"]) {
        await probeGuestWall(page, base, label, p).catch((e) => console.log(`  [wall ${p} ${label}] ERROR: ${e}`));
      }
      await probeLandingFunnel(page, base, label).catch((e) => console.log(`  [funnel ${label}] ERROR: ${e}`));
      await ctx.close();
    }

    console.log("\n########## LEG-2a/LEG-3 ADJUDICATION (standing-file evidence) ##########");
    console.log("  [leg-2a] the drawer-open element ledger: scripts/walk50/ (the s177 report)");
    console.log("  [leg-2a] the standing pins: the 10-check e2e battery + the a11y two-gate + the TRUE-390 sweeps");
    console.log("  [leg-3] probe:ref STABLE at 46bc2d9c — the fresh-bundle candidate KILLED");
    console.log("  [leg-3] the registry's latest recharts 3.10.1 — the 4.0 gate KILLED");
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
  console.error("[discover-196]", e);
  process.exit(1);
});

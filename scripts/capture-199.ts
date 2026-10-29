// Session-199 captures: the round's save-report pair (ours + the
// reference at the desktop axis — the two-app-openable registered
// surface, walk63's own surface) + the dev-server set of the five
// newly-registered dialog-open states (the Edit Lead · the Edit
// Account · the Import Contacts · the Account Insights · the
// Save Custom Report View — the round's own battery growth, each
// captured at its registered open state) + the mobile drawer-open
// face (the operator's standing mobile-nav ask) + the dashboard.
// Numbered past the s198 621-628 (the 629 series).
//
// Run: bun scripts/capture-199.ts
// (boots or reuses the dev server on :3000; the reference rides the
//  sweep-state storageState pair — ONE reference login, the s162
//  doctrine.)
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
const OUT = join(REPO, "docs", "screenshots");

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

/** the badge-close helper (the s149 platform pill, the REF only) */
async function closeBadge(page: import("@playwright/test").Page) {
  await page
    .locator('button[aria-label*="close badge" i]')
    .click({ timeout: 2000 })
    .catch(() => undefined);
  await page.waitForTimeout(300);
}

/** the Save Custom Report View dialog open face (the round's pair
 *  surface — the Saved Reports (N) trigger, walk63's own walk). */
async function captureSaveReport(
  page: import("@playwright/test").Page,
  base: string,
  file: string,
  label: string,
) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}/reports`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2500); // the recharts settle
  await closeBadge(page);
  await page.getByRole("button", { name: /Saved Reports \(\d+\)/ }).click();
  await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, file) });
  console.log(`[capture-199] ${file} — the ${label} Save-Report dialog OPEN at 1280x800`);
}

/** the row-⋮-menu edit-dialog open face (the Edit Lead + Edit Account
 *  walks — the registration form's own path). */
async function captureRowMenuEdit(
  page: import("@playwright/test").Page,
  base: string,
  route: string,
  file: string,
  label: string,
) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(1800);
  await page.locator("table tbody button[aria-haspopup='menu']").first().click();
  await page.waitForTimeout(600);
  await page.getByRole("menuitem", { name: /^edit/i }).first().click();
  await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, file) });
  console.log(`[capture-199] ${file} — the ${label} dialog OPEN at 1280x800`);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[capture-199] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[capture-199] pair state: ready");

    // 629-630 — the round's pair: the Save Custom Report View dialog
    // OPEN, ours + the reference (the two-app-openable surface)
    for (const [n, label, base] of [
      ["629", "ours", OUR_URL],
      ["630", "ref", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
      const page = await ctx.newPage();
      await captureSaveReport(page, base, `${n}-s199-save-report-${label}.png`, label);
      await ctx.close();
    }

    // 631-634 — the dev-server set: the other four newly-registered
    // dialog-open states (ours, the seeded tree)
    const oursCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
    const ours = await oursCtx.newPage();

    // 631 — the Edit Lead dialog OPEN (the Mke config)
    await captureRowMenuEdit(ours, OUR_URL, "/leads", "631-s199-edit-lead-open.png", "Edit Lead (Mke)");

    // 632 — the Edit Account dialog OPEN (the wce config)
    await captureRowMenuEdit(ours, OUR_URL, "/accounts", "632-s199-edit-account-open.png", "Edit Account (wce)");

    // 633 — the Import Contacts dialog OPEN (the s26 surface)
    await ours.goto(`${OUR_URL}/contacts`, { waitUntil: "domcontentloaded" });
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(1500);
    await ours.getByRole("button", { name: "Import" }).click();
    await ours.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await ours.waitForTimeout(600);
    await ours.screenshot({ path: join(OUT, "633-s199-import-contacts-open.png") });
    console.log("[capture-199] 633 — the Import Contacts dialog OPEN at 1280x800");

    // 634 — the Account Insights dialog OPEN (the Ece, the row click)
    await ours.goto(`${OUR_URL}/accounts`, { waitUntil: "domcontentloaded" });
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(1800);
    await ours.locator("table tbody tr").first().click();
    await ours.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await ours.waitForTimeout(600);
    await ours.screenshot({ path: join(OUT, "634-s199-account-insights-open.png") });
    console.log("[capture-199] 634 — the Account Insights dialog OPEN at 1280x800");

    // 635 — the mobile drawer-open face (the operator's standing ask)
    const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const phone = await phoneCtx.newPage();
    await phone.goto(`${OUR_URL}/Dashboard`, { waitUntil: "domcontentloaded" });
    await phone.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await phone.waitForTimeout(2000);
    await phone.locator('button[aria-label="Open navigation"]').click();
    await phone.waitForTimeout(900); // the 500ms slide-in + settle
    await phone.screenshot({ path: join(OUT, "635-s199-dev-drawer-open-390.png") });
    console.log("[capture-199] 635 — the dev-server drawer-open face at 390");
    await phoneCtx.close();

    // 636 — the dashboard (the dev-server set member)
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(1500);
    await ours.screenshot({ path: join(OUT, "636-s199-dev-dashboard.png") });
    console.log("[capture-199] 636 — the dev-server dashboard face");
    await oursCtx.close();
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
  console.error("[capture-199]", e);
  process.exit(1);
});

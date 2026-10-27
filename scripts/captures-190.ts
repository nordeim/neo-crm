// Session-190 (WP-6): the captures 511-522 — THE REPORTS
// SAVE-CUSTOM-VIEW DIALOG OPEN FACES' own evidence faces: the dialog
// OPEN ours+ref at the desktop axis (the byte-equal 672x420 wide
// shell — the D-190a1-cured checkbox grid inside), the phone-axis
// pair (the w-full 390x476 shell), + the standard dev-server page
// set for the operator's record (dashboard, leads, calendar,
// contacts, accounts, activities, reports, settings — the seeded
// state, the full-page renders).
import { spawn } from "node:child_process";
import { chromium, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { preflightPairState } from "./sweep-state";

const REPO = (() => {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const root = resolve(here, "..");
    if (existsSync(join(root, "package.json"))) return root;
  } catch {
    /* fall through */
  }
  return process.cwd();
})();
const BASE = "http://localhost:3000";
const REF = "https://neo-crm-8ab2c17c.base44.app";
const OUT = "docs/screenshots";

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

/** The Save-Custom-View dialog OPEN capture: open the "Saved Reports
 *  (N)" outline button, clip the dialog (+20px breathing margin — the
 *  wide 672x420 shell with the cured checkbox grid inside). The
 *  walk63 evidence face. */
async function captureDialogOpen(page: Page, base: string, shot: string): Promise<void> {
  await page.goto(`${base}/reports`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2600);
  await page.locator('main button:has-text("Saved Reports")').first().click();
  await page.waitForTimeout(1000);
  const clip = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    if (!dlg) throw new Error("the dialog not found after open");
    const r = dlg.getBoundingClientRect();
    return {
      x: Math.max(0, r.x - 20),
      y: Math.max(0, r.y - 20),
      width: r.width + 40,
      height: r.height + 40,
    };
  });
  await page.screenshot({ path: shot, clip });
}

/** The standard dev-server page set (the operator's record): the
 *  full-page render of the CRM pages at the seeded state. */
async function capturePage(page: Page, base: string, route: string, shot: string): Promise<void> {
  await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2800);
  await page.screenshot({ path: shot, fullPage: false });
}

async function main(): Promise<void> {
  // the boot-site form (the walk57/58 precedent): spawn the dev server
  // if it is not up; kill it at the end (only if WE spawned it).
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${BASE}/login`, 3000)) {
    console.log("[captures-190] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${BASE}/login`, 90000))) process.exit(1);
  }
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[captures-190] pair state: ready");

    // the round's ours+ref evidence faces (511-514: the desktop pair +
    // the phone pair — the byte-equal dialog shells, the D-190a1-cured
    // checkbox grid inside)
    const pairJobs: Array<[string, string, number, number]> = [
      [BASE, `${OUT}/511-savecustomview-open-ours-desktop.png`, 1440, 900],
      [REF, `${OUT}/512-savecustomview-open-ref-desktop.png`, 1440, 900],
      [BASE, `${OUT}/513-savecustomview-open-ours-phone.png`, 390, 844],
      [REF, `${OUT}/514-savecustomview-open-ref-phone.png`, 390, 844],
    ];
    for (const [origin, shot, w, h] of pairJobs) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, storageState: state });
      const page = await ctx.newPage();
      await captureDialogOpen(page, origin, shot);
      await ctx.close();
      console.log(`[captures-190] ${shot}`);
    }

    // the standard dev-server page set (515-522, the operator's record)
    const pageJobs: Array<[string, string]> = [
      ["/dashboard", `${OUT}/515-devserver-dashboard.png`],
      ["/leads", `${OUT}/516-devserver-leads.png`],
      ["/calendar", `${OUT}/517-devserver-calendar.png`],
      ["/contacts", `${OUT}/518-devserver-contacts.png`],
      ["/accounts", `${OUT}/519-devserver-accounts.png`],
      ["/activities", `${OUT}/520-devserver-activities.png`],
      ["/reports", `${OUT}/521-devserver-reports.png`],
      ["/settings", `${OUT}/522-devserver-settings.png`],
    ];
    for (const [route, shot] of pageJobs) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      await capturePage(page, BASE, route, shot);
      await ctx.close();
      console.log(`[captures-190] ${shot}`);
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
  console.error("[captures-190]", e);
  process.exit(1);
});

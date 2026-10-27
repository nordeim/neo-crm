// Session-191 (WP-6): the captures 523-538 — THE THREE CREATE DIALOGS'
// OPEN FACES' own evidence faces: the CONTACT/ACCOUNT/EVENT dialogs OPEN
// ours+ref at the desktop axis (the byte-equal 512x810 / 672x472 /
// 672x634 shells — the D-191 id-parity-cured id/for maps inside), the
// contact pair at the phone axis (the w-full 390x760 shell), + the
// standard dev-server page set for the operator's record (dashboard,
// leads, calendar, contacts, accounts, activities, reports, settings —
// the seeded state, the full-page renders).
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
    /* fall through to the cwd */
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

/** The create-dialog OPEN capture: open the page's trigger button,
 *  clip the dialog (+20px breathing margin — the byte-equal shells
 *  with the D-191-cured id/for maps inside). The walk64 evidence
 *  face. The submits are NEVER fired. */
async function captureDialogOpen(page: Page, base: string, path: string, trigger: string, shot: string): Promise<void> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2600);
  await page.locator(`main button:has-text("${trigger}")`).first().click();
  await page.waitForTimeout(1000);
  const clip = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    if (!dlg) throw new Error("the dialog not found after open");
    const r = dlg.getBoundingClientRect();
    return {
      x: Math.max(0, r.x - 20),
      y: Math.max(0, r.y - 20),
      width: Math.min(r.width + 40, window.innerWidth),
      height: Math.min(r.height + 40, window.innerHeight),
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
    console.log("[captures-191] reusing the dev server on :3000");
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
    console.log("[captures-191] pair state: ready");

    // the round's ours+ref evidence faces (523-528: the three dialogs'
    // desktop pairs — the byte-equal shells, the D-191-cured id/for
    // maps inside)
    const pairJobs: Array<[string, string, string, string, number, number]> = [
      [BASE, "/contacts", "New Contact", `${OUT}/523-contact-dialog-ours-desktop.png`, 1440, 900],
      [REF, "/contacts", "New Contact", `${OUT}/524-contact-dialog-ref-desktop.png`, 1440, 900],
      [BASE, "/accounts", "New Account", `${OUT}/525-account-dialog-ours-desktop.png`, 1440, 900],
      [REF, "/accounts", "New Account", `${OUT}/526-account-dialog-ref-desktop.png`, 1440, 900],
      [BASE, "/calendar", "New Event", `${OUT}/527-event-dialog-ours-desktop.png`, 1440, 900],
      [REF, "/calendar", "New Event", `${OUT}/528-event-dialog-ref-desktop.png`, 1440, 900],
    ];
    for (const [origin, path, trigger, shot, w, h] of pairJobs) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, storageState: state });
      const page = await ctx.newPage();
      await captureDialogOpen(page, origin, path, trigger, shot);
      await ctx.close();
      console.log(`[captures-191] ${shot}`);
    }

    // the contact phone pair (529-530: the w-full 390x760 shell)
    const phoneJobs: Array<[string, string, string, string, number, number]> = [
      [BASE, "/contacts", "New Contact", `${OUT}/529-contact-dialog-ours-phone.png`, 390, 844],
      [REF, "/contacts", "New Contact", `${OUT}/530-contact-dialog-ref-phone.png`, 390, 844],
    ];
    for (const [origin, path, trigger, shot, w, h] of phoneJobs) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, storageState: state });
      const page = await ctx.newPage();
      await captureDialogOpen(page, origin, path, trigger, shot);
      await ctx.close();
      console.log(`[captures-191] ${shot}`);
    }

    // the standard dev-server page set (531-538, the operator's record)
    const pageJobs: Array<[string, string]> = [
      ["/dashboard", `${OUT}/531-devserver-dashboard.png`],
      ["/leads", `${OUT}/532-devserver-leads.png`],
      ["/calendar", `${OUT}/533-devserver-calendar.png`],
      ["/contacts", `${OUT}/534-devserver-contacts.png`],
      ["/accounts", `${OUT}/535-devserver-accounts.png`],
      ["/activities", `${OUT}/536-devserver-activities.png`],
      ["/reports", `${OUT}/537-devserver-reports.png`],
      ["/settings", `${OUT}/538-devserver-settings.png`],
    ];
    for (const [route, shot] of pageJobs) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      await capturePage(page, BASE, route, shot);
      await ctx.close();
      console.log(`[captures-191] ${shot}`);
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
  console.error("[captures-191]", e);
  process.exit(1);
});

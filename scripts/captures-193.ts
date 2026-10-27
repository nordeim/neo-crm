// Session-193 (WP-6): the captures 559-574 — THE MARKETING-INTERIOR
// ARMS' own evidence faces: the two authenticated interiors (/about +
// /contact) ours+ref at the desktop axis (the byte-equal content — the
// D-193a1-cured outline-color family riding the anchors' focus faces
// inside the chrome) + the phone-axis pairs (the byte-equal 390 faces
// — the drawer triggers + the stacked cards + the footer) + the
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

/** The authenticated marketing-interior capture: the full viewport at
 *  the given axis (the interior + the chrome — the byte-equal content
 *  with the D-193a1-cured outline-color family inside). */
async function captureInterior(page: Page, origin: string, path: string, shot: string): Promise<void> {
  await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: shot, fullPage: false });
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
    console.log("[captures-193] reusing the dev server on :3000");
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
    console.log("[captures-193] pair state: ready (the ours+ref interiors ride it)");

    // the round's ours+ref evidence faces (559-566: the two interiors'
    // desktop pairs + the phone pairs — the byte-equal content, the
    // D-193a1-cured outline family inside the chrome)
    const interiorJobs: Array<[string, string, string, number, number]> = [
      [BASE, "/about", `${OUT}/559-about-ours-desktop.png`, 1440, 900],
      [REF, "/about", `${OUT}/560-about-ref-desktop.png`, 1440, 900],
      [BASE, "/contact", `${OUT}/561-contact-ours-desktop.png`, 1440, 900],
      [REF, "/contact", `${OUT}/562-contact-ref-desktop.png`, 1440, 900],
      [BASE, "/about", `${OUT}/563-about-ours-phone.png`, 390, 844],
      [REF, "/about", `${OUT}/564-about-ref-phone.png`, 390, 844],
      [BASE, "/contact", `${OUT}/565-contact-ours-phone.png`, 390, 844],
      [REF, "/contact", `${OUT}/566-contact-ref-phone.png`, 390, 844],
    ];
    for (const [origin, path, shot, w, h] of interiorJobs) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, storageState: state });
      const page = await ctx.newPage();
      await captureInterior(page, origin, path, shot);
      console.log(`  captured ${shot.split("/").pop()}`);
      await ctx.close();
    }

    // the standard dev-server page set (567-574: the operator's record)
    const pageJobs: Array<[string, string]> = [
      ["/dashboard", `${OUT}/567-devserver-dashboard.png`],
      ["/leads", `${OUT}/568-devserver-leads.png`],
      ["/calendar", `${OUT}/569-devserver-calendar.png`],
      ["/contacts", `${OUT}/570-devserver-contacts.png`],
      ["/accounts", `${OUT}/571-devserver-accounts.png`],
      ["/activities", `${OUT}/572-devserver-activities.png`],
      ["/reports", `${OUT}/573-devserver-reports.png`],
      ["/settings", `${OUT}/574-devserver-settings.png`],
    ];
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
    const page = await ctx.newPage();
    for (const [route, shot] of pageJobs) {
      await capturePage(page, BASE, route, shot);
      console.log(`  captured ${shot.split("/").pop()}`);
    }
    await ctx.close();
    console.log("[captures-193] all 16 captures landed");
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
  console.error("[captures-193]", e);
  process.exit(1);
});

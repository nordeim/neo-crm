// Session-194 (WP-6): the captures 575-588 — THE 404 INTERIOR'S
// INTERACTIVE ARMS' own evidence faces: the designed 404 view ours+ref
// at the desktop axis (the byte-equal skeleton post-cure — the
// D-194a1-stripped path span + the D-194a3 heroicons glyph + the
// D-194a4 retired title) + the phone-axis pairs (the byte-equal 390
// faces — the responsive center + the Go Home arm) + the Go Home
// FOCUS-FACE clip pairs (the REAL keyboard Tab face — the white-2px +
// slate-500-4px ring family, byte-equal on the visible layers) + the
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

/** The authenticated 404-interior capture: the full viewport at the
 *  given axis (the designed 404 view — no chrome, the bare
 *  slate-family surface). */
async function capture404(page: Page, origin: string, shot: string): Promise<void> {
  await page.goto(`${origin}/zzz-captures-194`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: shot, fullPage: false });
}

/** The Go Home REAL focus-face clip: Tab once (the arm is the first
 *  stop on both apps), settle, then clip around the arm box (the
 *  658,556 123x38 arm + a 50px pad — the white-2px + slate-500-4px
 *  ring family visible on the REAL keyboard face). */
async function captureGoHomeFocus(page: Page, origin: string, shot: string): Promise<void> {
  await page.goto(`${origin}/zzz-captures-194`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2400);
  await page.locator("body").click({ position: { x: 8, y: 8 } }).catch(() => undefined);
  await page.waitForTimeout(300);
  await page.keyboard.press("Tab");
  await page.waitForTimeout(400);
  await page.screenshot({
    path: shot,
    clip: { x: 578, y: 496, width: 263, height: 158 },
  });
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
    console.log("[captures-194] reusing the dev server on :3000");
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
    console.log("[captures-194] pair state: ready (the ours+ref 404 faces ride it)");

    // the round's ours+ref evidence faces (575-580: the 404 interior's
    // desktop pairs + the phone pairs + the Go Home focus-clip pairs —
    // the byte-equal skeleton post-cure)
    const jobs: Array<[string, string, number, number, "full" | "focus"]> = [
      [BASE, `${OUT}/575-404-ours-desktop.png`, 1440, 900, "full"],
      [REF, `${OUT}/576-404-ref-desktop.png`, 1440, 900, "full"],
      [BASE, `${OUT}/577-404-ours-phone.png`, 390, 844, "full"],
      [REF, `${OUT}/578-404-ref-phone.png`, 390, 844, "full"],
      [BASE, `${OUT}/579-404-gohome-focus-ours.png`, 1440, 900, "focus"],
      [REF, `${OUT}/580-404-gohome-focus-ref.png`, 1440, 900, "focus"],
    ];
    for (const [origin, shot, w, h, mode] of jobs) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, storageState: state });
      const page = await ctx.newPage();
      if (mode === "full") await capture404(page, origin, shot);
      else await captureGoHomeFocus(page, origin, shot);
      console.log(`  captured ${shot.split("/").pop()}`);
      await ctx.close();
    }

    // the standard dev-server page set (581-588: the operator's record)
    const pageJobs: Array<[string, string]> = [
      ["/dashboard", `${OUT}/581-devserver-dashboard.png`],
      ["/leads", `${OUT}/582-devserver-leads.png`],
      ["/calendar", `${OUT}/583-devserver-calendar.png`],
      ["/contacts", `${OUT}/584-devserver-contacts.png`],
      ["/accounts", `${OUT}/585-devserver-accounts.png`],
      ["/activities", `${OUT}/586-devserver-activities.png`],
      ["/reports", `${OUT}/587-devserver-reports.png`],
      ["/settings", `${OUT}/588-devserver-settings.png`],
    ];
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
    const page = await ctx.newPage();
    for (const [route, shot] of pageJobs) {
      await capturePage(page, BASE, route, shot);
      console.log(`  captured ${shot.split("/").pop()}`);
    }
    await ctx.close();
    console.log("[captures-194] all 14 captures landed");
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
  console.error("[captures-194]", e);
  process.exit(1);
});

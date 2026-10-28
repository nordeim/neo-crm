// Session-198 captures: the round's reports pair (ours + the reference
// at the desktop + phone axes — the PDF-export surface whose dependency
// chain carried the cured critical: jspdf › dompurify) + the dev-server
// set of the remediated tree (the landing + the dashboard + the
// reports + the mobile drawer-open face — the operator's standing
// mobile-nav ask). Numbered past the s197 613-620 (the 621 series).
//
// Run: bun scripts/capture-198.ts
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

/** The reports capture face: the main-wait + the charts settle + the
 *  badge-close (the s149 platform pill, the REF only) + the settle. */
async function captureReports(
  page: import("@playwright/test").Page,
  base: string,
  file: string,
  width: number,
  height: number,
  label: string,
) {
  await page.setViewportSize({ width, height });
  await page.goto(`${base}/reports`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2500); // the recharts settle
  await page
    .locator('button[aria-label*="close badge" i]')
    .click({ timeout: 2000 })
    .catch(() => undefined);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, file) });
  console.log(`[capture-198] ${file} — the ${label} reports face at ${width}x${height}`);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[capture-198] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[capture-198] pair state: ready");

    // 621-624 — the round's reports pair at BOTH axes (the D-198a1 surface)
    for (const [n, label, base] of [
      ["621", "OURS", OUR_URL],
      ["622", "REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
      const page = await ctx.newPage();
      await captureReports(page, base, `${n}-s198-reports-desktop-${label.trim().toLowerCase()}.png`, 1280, 800, label.trim());
      await ctx.close();
    }
    for (const [n, label, base] of [
      ["623", "OURS", OUR_URL],
      ["624", "REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
      const page = await ctx.newPage();
      await captureReports(page, base, `${n}-s198-reports-390-${label.trim().toLowerCase()}.png`, 390, 844, label.trim());
      await ctx.close();
    }

    // 625-628 — the dev-server set of the remediated tree (ours)
    const oursCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
    const ours = await oursCtx.newPage();

    // 625 — the landing (the public marketing surface)
    await ours.goto(`${OUR_URL}/`, { waitUntil: "domcontentloaded" });
    await ours.waitForTimeout(1800);
    await ours.screenshot({ path: join(OUT, "625-s198-dev-landing.png") });
    console.log("[capture-198] 625 — the dev-server landing face");

    // 626 — the dashboard (the authenticated surface)
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(1500);
    await ours.screenshot({ path: join(OUT, "626-s198-dev-dashboard.png") });
    console.log("[capture-198] 626 — the dev-server dashboard face");

    // 627 — the reports (the remediated tree's own PDF-export surface)
    await captureReports(ours, OUR_URL, "627-s198-dev-reports.png", 1280, 800, "dev");

    // 628 — the mobile drawer-open face (the operator's standing ask)
    const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const phone = await phoneCtx.newPage();
    await phone.goto(`${OUR_URL}/Dashboard`, { waitUntil: "domcontentloaded" });
    await phone.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await phone.waitForTimeout(2000);
    await phone.locator('button[aria-label="Open navigation"]').click();
    await phone.waitForTimeout(900); // the 500ms slide-in + settle
    await phone.screenshot({ path: join(OUT, "628-s198-dev-drawer-open-390.png") });
    console.log("[capture-198] 628 — the dev-server drawer-open face at 390");
    await phoneCtx.close();
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
  console.error("[capture-198]", e);
  process.exit(1);
});

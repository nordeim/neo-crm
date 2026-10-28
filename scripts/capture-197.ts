// Session-197 captures: the round's 404 pair (ours + the reference at
// the desktop + phone axes — the drift-gate registration's own
// surface) + the dev-server set of the remediated tree (the landing +
// the dashboard + the 404 + the mobile drawer-open face — the
// operator's standing mobile-nav ask). Numbered past the s196
// 600-612 (the 613 series).
//
// Run: bun scripts/capture-197.ts
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

/** The 404 capture face: the h1-404 content-wait (the D-197a1 override's
 *  own anchor) + the badge-close + the settle. */
async function capture404(
  page: import("@playwright/test").Page,
  base: string,
  file: string,
  width: number,
  height: number,
  label: string,
) {
  await page.setViewportSize({ width, height });
  await page.goto(`${base}/no-such-capture-route-197`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page
    .getByRole("heading", { name: "404", exact: true })
    .first()
    .waitFor({ state: "visible", timeout: 15000 })
    .catch(() => undefined);
  await page.waitForTimeout(1500);
  await page
    .locator('button[aria-label*="close badge" i]')
    .click({ timeout: 2000 })
    .catch(() => undefined);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, file) });
  console.log(`[capture-197] ${file} — the ${label} 404 face at ${width}x${height}`);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[capture-197] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[capture-197] pair state: ready");

    // 613-616 — the round's 404 pair at BOTH axes (the D-197a1 surface)
    for (const [n, label, base] of [
      ["613", "OURS", OUR_URL],
      ["614", "REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
      const page = await ctx.newPage();
      await capture404(page, base, `${n}-s197-404-desktop-${label.trim().toLowerCase()}.png`, 1280, 800, label.trim());
      await ctx.close();
    }
    for (const [n, label, base] of [
      ["615", "OURS", OUR_URL],
      ["616", "REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
      const page = await ctx.newPage();
      await capture404(page, base, `${n}-s197-404-390-${label.trim().toLowerCase()}.png`, 390, 844, label.trim());
      await ctx.close();
    }

    // 617-620 — the dev-server set of the remediated tree (ours)
    const oursCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
    const ours = await oursCtx.newPage();

    // 617 — the landing (the public marketing surface)
    await ours.goto(`${OUR_URL}/`, { waitUntil: "domcontentloaded" });
    await ours.waitForTimeout(1800);
    await ours.screenshot({ path: join(OUT, "617-s197-dev-landing.png") });
    console.log("[capture-197] 617 — the dev-server landing face");

    // 618 — the dashboard (the authenticated surface)
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(1500);
    await ours.screenshot({ path: join(OUT, "618-s197-dev-dashboard.png") });
    console.log("[capture-197] 618 — the dev-server dashboard face");

    // 619 — the 404 (the remediated tree's own designed face)
    await capture404(ours, OUR_URL, "619-s197-dev-404.png", 1280, 800, "dev");

    // 620 — the mobile drawer-open face (the operator's standing ask)
    const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const phone = await phoneCtx.newPage();
    await phone.goto(`${OUR_URL}/Dashboard`, { waitUntil: "domcontentloaded" });
    await phone.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await phone.waitForTimeout(2000);
    await phone.locator('button[aria-label="Open navigation"]').click();
    await phone.waitForTimeout(900); // the 500ms slide-in + settle
    await phone.screenshot({ path: join(OUT, "620-s197-dev-drawer-open-390.png") });
    console.log("[capture-197] 620 — the dev-server drawer-open face at 390");
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
  console.error("[capture-197]", e);
  process.exit(1);
});

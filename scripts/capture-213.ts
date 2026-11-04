// Session-213 captures: the round's dev-server set (the s212 form —
// the pages unchanged this round, the cures test-side only; the set
// re-landed as the round's own record): the dashboard at desktop +
// at phone · the mobile drawer OPEN at phone (the operator's standing
// mobile-nav ask) · the landing mobile disclosure menu OPEN at phone ·
// the login card. Numbered past the s212 717-721 (the 722 series).
//
// Run: bun scripts/capture-213.ts
// (boots or reuses the dev server on :3000; the drawer/dashboard legs
//  ride the sweep-state storageState pair — ONE reference login, the
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

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[capture-213] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    // the authed legs ride the pair state (the dashboard + the drawer)
    const state = await preflightPairState(browser);
    console.log("[capture-213] pair state: ready");

    // 722 — the dashboard at desktop
    const oursCtx = await browser.newContext({ viewport: { width: 1280, height: 900 }, storageState: state });
    const ours = await oursCtx.newPage();
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(2200);
    await ours.screenshot({ path: join(OUT, "722-s213-dev-dashboard-1280.png") });
    console.log("[capture-213] 722-s213-dev-dashboard-1280.png — the dashboard at 1280");

    // 723 — the dashboard at phone
    await ours.setViewportSize({ width: 390, height: 844 });
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(1800);
    await ours.screenshot({ path: join(OUT, "723-s213-dev-dashboard-390.png") });
    console.log("[capture-213] 723-s213-dev-dashboard-390.png — the dashboard at 390");

    // 724 — the mobile drawer OPEN at phone (the operator's standing ask)
    await ours.getByRole("button", { name: "Open navigation" }).click();
    await ours.waitForTimeout(700);
    await ours.screenshot({ path: join(OUT, "724-s213-dev-drawer-open-390.png") });
    console.log("[capture-213] 724-s213-dev-drawer-open-390.png — the drawer OPEN at 390");
    await ours.keyboard.press("Escape").catch(() => undefined);
    await oursCtx.close();

    // 725 — the landing mobile disclosure menu OPEN at phone (anon)
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await page.goto(`${OUR_URL}/`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
      await page.waitForTimeout(2000);
      await page.getByRole("button", { name: "Toggle navigation" }).click();
      await page
        .locator("div.md\\:hidden.border-t")
        .first()
        .waitFor({ state: "visible", timeout: 10000 })
        .catch(() => undefined);
      await page.waitForTimeout(700); // the mount + settle
      await page.screenshot({ path: join(OUT, "725-s213-dev-landing-mobilemenu-390.png") });
      console.log("[capture-213] 725-s213-dev-landing-mobilemenu-390.png — the landing mobile menu OPEN at 390");
      await ctx.close();
    }

    // 726 — the login card at desktop (anon)
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(`${OUR_URL}/login`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
      await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
      await page.waitForTimeout(1800);
      await page.screenshot({ path: join(OUT, "726-s213-dev-login-1280.png") });
      console.log("[capture-213] 726-s213-dev-login-1280.png — the login card at 1280");
      await ctx.close();
    }

    console.log("[capture-213] DONE — the 722-726 series landed.");
  } finally {
    await browser.close().catch(() => undefined);
    if (spawned) {
      try {
        process.kill(-spawned.pid!, "SIGTERM");
      } catch {
        /* already gone */
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

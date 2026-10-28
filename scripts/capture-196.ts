// Session-196 captures: the round's drawer-open set (ours + the
// reference pair at TRUE 390x844) + the dev-server page set of the
// remediated tree. Numbered past the s195 589-599 (the 600 series).
//
// Run: bun scripts/capture-196.ts
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

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[capture-196] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[capture-196] pair state: ready");

    // 600/601 — the drawer-open pair at TRUE 390x844 (the round's surface)
    for (const [n, label, base] of [
      ["600", "OURS", OUR_URL],
      ["601", "REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
      const page = await ctx.newPage();
      await page.goto(`${base}/Dashboard`, { waitUntil: "domcontentloaded" });
      await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
      await page.waitForTimeout(2000);
      await page.locator('button[aria-label="Open navigation"]').click();
      await page.waitForTimeout(900); // the 500ms slide-in + settle
      await page.screenshot({ path: join(OUT, `${n}-s196-drawer-open-390-${label.trim().toLowerCase()}.png`) });
      console.log(`[capture-196] ${n} — the ${label.trim()} drawer-open face at 390`);
      await ctx.close();
    }

    // 602-612 — the dev-server set of the remediated tree (ours)
    const oursCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
    const ours = await oursCtx.newPage();
    const pages: Array<[string, string]> = [
      ["602", "/dashboard"],
      ["603", "/contacts"],
      ["604", "/leads"],
      ["605", "/accounts"],
      ["606", "/calendar"],
      ["607", "/activities"],
      ["608", "/reports"],
      ["609", "/settings"],
      ["610", "/profile"],
    ];
    for (const [n, path] of pages) {
      await ours.goto(`${OUR_URL}${path}`, { waitUntil: "domcontentloaded" });
      await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
      await ours.waitForTimeout(1500);
      const name = path.replace(/^\//, "") || "root";
      await ours.screenshot({ path: join(OUT, `${n}-s196-dev-${name}.png`) });
      console.log(`[capture-196] ${n} — the dev-server ${path} face`);
    }

    // 611 — the 404 surface (the s195 family's standing set member)
    await ours.goto(`${OUR_URL}/zzz-s196-capture`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
    await ours.waitForTimeout(1200);
    await ours.screenshot({ path: join(OUT, "611-s196-dev-404.png") }).catch(() => undefined);
    console.log("[capture-196] 611 — the dev-server 404 face");

    // 612 — the dashboard at 390 (drawer closed)
    const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const phone = await phoneCtx.newPage();
    await phone.goto(`${OUR_URL}/Dashboard`, { waitUntil: "domcontentloaded" });
    await phone.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await phone.waitForTimeout(1800);
    await phone.screenshot({ path: join(OUT, "612-s196-dev-dashboard-390.png") });
    console.log("[capture-196] 612 — the dev-server dashboard at 390 (drawer closed)");
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
  console.error("[capture-196]", e);
  process.exit(1);
});

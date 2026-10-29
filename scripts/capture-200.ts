// Session-200 captures: the round's /contact pair (ours + the
// reference at the desktop axis — the two-app-renderable registered
// surface, walk66's own surface, the round's own axis) + the
// dev-server set of the three newly-registered page surfaces at both
// widths (the /about + the /contact + the /reset-password set-password
// form — the round's own battery growth) + the mobile drawer-open
// face (the operator's standing mobile-nav ask) + the dashboard.
// Numbered past the s199 629-636 (the 637 series).
//
// Run: bun scripts/capture-200.ts
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

/** an authenticated page-surface face (the marketing interiors ride
 *  the app chrome; the storageState pair carries both apps' logins). */
async function captureAuthedPage(
  page: import("@playwright/test").Page,
  base: string,
  route: string,
  file: string,
  label: string,
  width: { w: number; h: number; tag: string },
) {
  await page.setViewportSize({ width: width.w, height: width.h });
  await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2200);
  await closeBadge(page);
  await page.screenshot({ path: join(OUT, file) });
  console.log(`[capture-200] ${file} — the ${label} at ${width.w}x${width.h}`);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[capture-200] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[capture-200] pair state: ready");

    // 637-638 — the round's pair: the /contact page, ours + the
    // reference at the desktop axis (the two-app-openable registered
    // surface — walk66's own surface, the round's own axis)
    for (const [n, label, base, route] of [
      ["637", "ours", OUR_URL, "/contact"],
      ["638", "ref", REF_URL, "/Contact"],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
      const page = await ctx.newPage();
      await captureAuthedPage(
        page,
        base,
        route,
        `${n}-s200-contact-${label}.png`,
        `${label} /contact`,
        { w: 1280, h: 800, tag: "desktop" },
      );
      await ctx.close();
    }

    // 639-641 — the dev-server set: the marketing interiors at both
    // widths (ours, the seeded tree)
    const oursCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
    const ours = await oursCtx.newPage();
    await captureAuthedPage(ours, OUR_URL, "/about", "639-s200-dev-about-1280.png", "ours /about", {
      w: 1280,
      h: 800,
      tag: "desktop",
    });
    await captureAuthedPage(ours, OUR_URL, "/about", "640-s200-dev-about-390.png", "ours /about", {
      w: 390,
      h: 844,
      tag: "phone",
    });
    await captureAuthedPage(ours, OUR_URL, "/contact", "641-s200-dev-contact-390.png", "ours /contact", {
      w: 390,
      h: 844,
      tag: "phone",
    });

    // 642-643 — the reset-password set-password form state at both
    // widths (ours, ANON — the surface is public + session-agnostic)
    const anonCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const anon = await anonCtx.newPage();
    for (const [n, w, h, tag] of [
      ["642", 1280, 800, "desktop"],
      ["643", 390, 844, "phone"],
    ] as const) {
      await anon.setViewportSize({ width: w, height: h });
      await anon.goto(`${OUR_URL}/reset-password?token=e2e-shape-probe`, { waitUntil: "domcontentloaded" });
      await anon.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
      await anon.waitForTimeout(1800);
      await anon.screenshot({ path: join(OUT, `${n}-s200-dev-reset-form-${tag}.png`) });
      console.log(`[capture-200] ${n} — the reset-password form state at ${tag}`);
    }
    await anonCtx.close();

    // 644 — the mobile drawer-open face (the operator's standing ask)
    const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const phone = await phoneCtx.newPage();
    await phone.goto(`${OUR_URL}/Dashboard`, { waitUntil: "domcontentloaded" });
    await phone.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await phone.waitForTimeout(2000);
    await phone.locator('button[aria-label="Open navigation"]').click();
    await phone.waitForTimeout(900); // the 500ms slide-in + settle
    await phone.screenshot({ path: join(OUT, "644-s200-dev-drawer-open-390.png") });
    console.log("[capture-200] 644 — the dev-server drawer-open face at 390");
    await phoneCtx.close();

    // 645 — the dashboard (the dev-server set member)
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(1500);
    await ours.screenshot({ path: join(OUT, "645-s200-dev-dashboard.png") });
    console.log("[capture-200] 645 — the dev-server dashboard face");
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
  console.error("[capture-200]", e);
  process.exit(1);
});

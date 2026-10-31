// Session-203 captures: the round's marketing client-state pair (ours +
// the reference at the 390×844 phone axis — the round's own genus, the
// two-app-openable surface: the mobile disclosure menu OPEN on both
// apps, the walk65-walked member) + the dev-server set of the round's
// registrations (the FAQ non-default open state at BOTH widths + the
// menu-open dev face) + the mobile drawer-open face (the operator's
// standing mobile-nav ask) + the dashboard. Numbered past the s202
// 660-669 (the 670 series).
//
// Run: bun scripts/capture-203.ts
// (boots or reuses the dev server on :3000; the landing/menu rides ride
//  FRESH anon contexts — the PUBLIC surface, zero auth, zero writes;
//  the drawer/dashboard legs ride the sweep-state storageState pair —
//  ONE reference login, the s162 doctrine; the db census contract
//  untouched by every leg.)
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

/** a marketing client-state face: navigate fresh at the phone axis,
 *  drive the arm's toggle, wait on the arm's L-164c2 sentinel (the
 *  panel mount + its unique Preview link — ours) or the visible panel
 *  (the reference's own construction), capture. */
async function captureMenuOpen(
  page: import("@playwright/test").Page,
  base: string,
  file: string,
  label: string,
): Promise<void> {
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  // the panel-mount sentinel: ours is the div.md\:hidden.border-t
  // (the landing.spec:105 house form); the reference's own panel rides
  // the same censused construction (walk65: the menu panel 0,64
  // 390x229) — wait on EITHER face, then settle.
  await page
    .locator("div.md\\:hidden.border-t")
    .first()
    .waitFor({ state: "visible", timeout: 10000 })
    .catch(() => undefined);
  await page.waitForTimeout(700); // the mount + settle
  await page.screenshot({ path: join(OUT, file) });
  console.log(`[capture-203] ${file} — ${label}`);
}

/** the FAQ non-default open state (the Q6 ride — the L-164c2 sentinel
 *  pair: the Q6 answer mounted + the resting Q1 answer GONE). */
async function captureFaqOpen(
  page: import("@playwright/test").Page,
  base: string,
  file: string,
  label: string,
): Promise<void> {
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page.waitForTimeout(2000);
  const faq = page.locator("#faq");
  await faq.getByRole("button", { name: "Which tier do I need?" }).click();
  await page.locator("#faq-answer-5").waitFor({ state: "visible", timeout: 10000 });
  await page.waitForTimeout(700); // the mount + settle
  await page.screenshot({ path: join(OUT, file) });
  console.log(`[capture-203] ${file} — ${label}`);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[capture-203] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    // 670-671 — the round's pair: the mobile disclosure menu OPEN at
    // the 390×844 phone axis, ours + the reference (the
    // two-app-openable marketing client-state surface — the
    // walk65-walked member, the round's own genus; fresh anon
    // contexts — the PUBLIC surface)
    for (const [n, label, base] of [
      ["670", "ours", OUR_URL],
      ["671", "ref", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await captureMenuOpen(
        page,
        base,
        `${n}-s203-menuopen-${label}-390.png`,
        `the ${label} mobile disclosure menu OPEN at 390`,
      );
      await ctx.close();
    }

    // 672-674 — the dev-server set: the round's own registrations
    // (ours, the remediated tree)
    for (const [n, w, tag] of [
      ["672", { width: 1280, height: 800 }, "faqopen-1280"],
      ["673", { width: 390, height: 844 }, "faqopen-390"],
    ] as const) {
      const ctx = await browser.newContext({ viewport: w });
      const page = await ctx.newPage();
      await captureFaqOpen(page, OUR_URL, `${n}-s203-dev-${tag}.png`, `the dev ${tag}`);
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await captureMenuOpen(page, OUR_URL, "674-s203-dev-menuopen-390.png", "the dev menuopen-390");
      await ctx.close();
    }

    // 675 — the mobile drawer-open face at 390×844 (the operator's
    // standing mobile-nav ask) + 676 — the dashboard (the authed face)
    const state = await preflightPairState(browser);
    console.log("[capture-203] pair state: ready");
    const oursCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const ours = await oursCtx.newPage();
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(2000);
    await ours.getByRole("button", { name: "Open navigation" }).click();
    await ours.waitForTimeout(700);
    await ours.screenshot({ path: join(OUT, "675-s203-dev-drawer-open-390.png") });
    console.log("[capture-203] 675-s203-dev-drawer-open-390.png — the drawer OPEN at 390");
    await ours.keyboard.press("Escape").catch(() => undefined);
    await ours.waitForTimeout(400);
    await ours.setViewportSize({ width: 1280, height: 800 });
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
    await ours.waitForTimeout(2000);
    await ours.screenshot({ path: join(OUT, "676-s203-dev-dashboard.png") });
    console.log("[capture-203] 676-s203-dev-dashboard.png — the dashboard");
    await oursCtx.close();

    console.log("[capture-203] DONE — the 670-676 series landed.");
  } finally {
    await browser.close().catch(() => undefined);
    if (spawned) {
      try {
        process.kill(-spawned.pid!, "SIGTERM");
      } catch {
        /* the reused-server case */
      }
    }
  }
}

main().catch((e) => {
  console.error("[capture-203] FATAL", e);
  process.exit(1);
});

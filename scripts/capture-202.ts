// Session-202 captures: the round's client-state pair (ours + the
// reference at the desktop axis — the round's own genus, the
// two-app-openable surface: the login card's reset view OPEN on both
// apps, the walk65-walked member) + the dev-server set of the three
// view states at BOTH widths (the round's own battery growth) + the
// mobile drawer-open face (the operator's standing mobile-nav ask) +
// the dashboard. Numbered past the s201 646-659 (the 660 series).
//
// Run: bun scripts/capture-202.ts
// (boots or reuses the dev server on :3000; the drawer/dashboard legs
//  ride the sweep-state storageState pair — ONE reference login, the
//  s162 doctrine; the login-view legs ride FRESH anon contexts — the
//  logged-out surface; the verify rides sign throwaway users into
//  the DEV db and DELETE them after — the db-census contract, the
//  discover-202 cleanup form.)
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
const DEMO_EMAIL = "sepnetflix2023@outlook.com";
const throwawayEmails: string[] = [];

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

/** a login-card view face: navigate fresh, swap the card to the view,
 *  wait on the VIEW-SENTINEL h2 (the L-164c2 guard), capture. */
async function captureView(
  page: import("@playwright/test").Page,
  base: string,
  ride: (page: import("@playwright/test").Page) => Promise<void>,
  file: string,
  label: string,
) {
  await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page.waitForTimeout(2000);
  await ride(page);
  await page.waitForTimeout(700); // the mount + settle
  await page.screenshot({ path: join(OUT, file) });
  console.log(`[capture-202] ${file} — ${label}`);
}

const resetRide = async (p: import("@playwright/test").Page) => {
  await p.getByRole("button", { name: "Forgot password?" }).click();
  await p.getByRole("heading", { name: "Reset your password" }).waitFor({ state: "visible", timeout: 10000 });
};

const sentRide = async (p: import("@playwright/test").Page) => {
  await p.getByRole("button", { name: "Forgot password?" }).click();
  await p.getByRole("heading", { name: "Reset your password" }).waitFor({ state: "visible", timeout: 10000 });
  await p.getByLabel("Email").fill(DEMO_EMAIL);
  await p.getByRole("button", { name: "Send reset link" }).click();
  await p.getByRole("heading", { name: "Check your email" }).waitFor({ state: "visible", timeout: 10000 });
};

function verifyRide(email: string) {
  return async (p: import("@playwright/test").Page) => {
    await p.getByRole("button", { name: /Need an account\?/ }).click();
    await p.getByRole("heading", { name: "Create your account" }).waitFor({ state: "visible", timeout: 10000 });
    await p.getByLabel("Email").fill(email);
    await p.getByLabel("Password", { exact: true }).fill("A11yThrowaway1!");
    await p.getByLabel("Confirm Password").fill("A11yThrowaway1!");
    await p.getByRole("button", { name: "Create account" }).click();
    await p.getByRole("heading", { name: "Verify your email" }).waitFor({ state: "visible", timeout: 10000 });
  };
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[capture-202] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[capture-202] pair state: ready");

    // 660-661 — the round's pair: the login card's reset view OPEN at
    // the desktop axis, ours + the reference (the two-app-openable
    // client-state surface — the walk65-walked member, the round's own
    // genus; fresh anon contexts — the logged-out surface)
    for (const [n, label, base] of [
      ["660", "ours", OUR_URL],
      ["661", "ref", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      await captureView(
        page,
        base,
        resetRide,
        `${n}-s202-resetview-${label}-1280.png`,
        `the ${label} reset view OPEN at 1280`,
      );
      await ctx.close();
    }

    // 662-667 — the dev-server set: the three view states at BOTH
    // widths (ours, the seeded tree — the round's own registrations)
    for (const [n, w, ride, tag] of [
      ["662", { width: 1280, height: 800 }, resetRide, "resetview-1280"],
      ["663", { width: 390, height: 844 }, resetRide, "resetview-390"],
      ["664", { width: 1280, height: 800 }, sentRide, "sentview-1280"],
      ["665", { width: 390, height: 844 }, sentRide, "sentview-390"],
    ] as const) {
      const ctx = await browser.newContext({ viewport: w });
      const page = await ctx.newPage();
      await captureView(page, OUR_URL, ride, `${n}-s202-dev-${tag}.png`, `the dev ${tag}`);
      await ctx.close();
    }
    for (const [n, w, tag] of [
      ["666", { width: 1280, height: 800 }, "verifyview-1280"],
      ["667", { width: 390, height: 844 }, "verifyview-390"],
    ] as const) {
      const email = `capture202-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
      throwawayEmails.push(email);
      const ctx = await browser.newContext({ viewport: w });
      const page = await ctx.newPage();
      await captureView(page, OUR_URL, verifyRide(email), `${n}-s202-dev-${tag}.png`, `the dev ${tag}`);
      await ctx.close();
    }

    // 668 — the mobile drawer-open face at 390×844 (the operator's
    // standing mobile-nav ask) + 669 — the dashboard (the authed face)
    const oursCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const ours = await oursCtx.newPage();
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(2000);
    await ours.getByRole("button", { name: "Open navigation" }).click();
    await ours.waitForTimeout(700);
    await ours.screenshot({ path: join(OUT, "668-s202-dev-drawer-open-390.png") });
    console.log("[capture-202] 668-s202-dev-drawer-open-390.png — the drawer OPEN at 390");
    await ours.keyboard.press("Escape").catch(() => undefined);
    await ours.waitForTimeout(400);
    await ours.setViewportSize({ width: 1280, height: 800 });
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
    await ours.waitForTimeout(2000);
    await ours.screenshot({ path: join(OUT, "669-s202-dev-dashboard.png") });
    console.log("[capture-202] 669-s202-dev-dashboard.png — the dashboard");
    await oursCtx.close();

    // the throwaway-user cleanup (the db-census contract: 4 users)
    if (throwawayEmails.length > 0) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient({
          datasources: { db: { url: `file:${join(REPO, "db", "custom.db")}` } },
        });
        const res = await prisma.user.deleteMany({ where: { email: { in: throwawayEmails } } });
        await prisma.$disconnect();
        console.log(`[cleanup] deleted ${res.count} throwaway verify-capture user(s) — the db-census contract held`);
      } catch (e) {
        console.log(`[cleanup] ERROR: ${e}`);
      }
    }

    console.log("[capture-202] DONE — the 660-669 series landed.");
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
  console.error("[capture-202] FATAL", e);
  process.exit(1);
});

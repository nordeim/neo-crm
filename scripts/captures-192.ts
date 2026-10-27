// Session-192 (WP-6): the captures 539-558 — THE LOGIN ANON-SURFACE
// INTERIORS + THE LANDING MARKETING ARMS' own evidence faces: the four
// login views (signin/signup/reset/sent) ours+ref at the desktop axis
// (the byte-equal card shells — the D-192-cured id/for maps + the
// ring-ring submits inside), the FAQ single-open pair at the desktop
// axis (the Q2-open state), the mobile disclosure menu OPEN pair at
// the phone axis (the byte-equal 0,64 390x229 panel), + the standard
// dev-server page set for the operator's record (dashboard, leads,
// calendar, contacts, accounts, activities, reports, settings — the
// seeded state, the full-page renders).
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

/** The login-card VIEW capture: ride the view machine to the target
 *  view (client state only), clip the card (+20px breathing margin —
 *  the byte-equal shells with the D-192-cured id/for maps + the
 *  ring-ring submits inside). The submits are NEVER fired except the
 *  sent view's nonexistent-email POST (the no-enumeration 200
 *  family, write-free on both apps). */
async function captureLoginView(
  page: Page,
  origin: string,
  view: "signin" | "signup" | "reset" | "sent",
  shot: string,
): Promise<void> {
  await page.goto(`${origin}/login`, { waitUntil: "domcontentloaded" });
  await page.locator("h1").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2400);
  if (view === "signup") {
    await page.locator('button:has-text("Sign up")').first().click();
    await page.waitForTimeout(800);
  } else if (view === "reset" || view === "sent") {
    await page.locator('button:has-text("Forgot password?")').first().click();
    await page.waitForTimeout(800);
  }
  if (view === "sent") {
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count()) {
      await emailInput.fill("walk192probe@example.com");
      await page.locator('button[type="submit"]:has-text("Send reset link")').first().click();
      await page.waitForTimeout(1800);
    }
  }
  const clip = await page.evaluate(() => {
    const card = document.querySelector('div[class*="rounded-2xl"][class*="shadow-2xl"]');
    if (!card) throw new Error("the login card not found");
    const r = card.getBoundingClientRect();
    return {
      x: Math.max(0, r.x - 20),
      y: Math.max(0, r.y - 20),
      width: Math.min(r.width + 40, window.innerWidth),
      height: Math.min(r.height + 40, window.innerHeight),
    };
  });
  await page.screenshot({ path: shot, clip });
}

/** The FAQ single-open capture: click Q2, clip the FAQ section (the
 *  Q2-open state — the chevron rotate + the single visible answer). */
async function captureFaqOpen(page: Page, origin: string, shot: string): Promise<void> {
  await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
  await page.locator("header").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2400);
  const q2 = page.locator('section button', { hasText: "Is my data separate" }).first();
  if (await q2.count()) {
    await q2.click();
    await page.waitForTimeout(600);
  }
  const clip = await page.evaluate(() => {
    const faq = Array.from(document.querySelectorAll("section")).find((s) =>
      /questions, answered/i.test(s.querySelector("h2")?.textContent ?? ""),
    );
    if (!faq) throw new Error("the FAQ section not found");
    const r = faq.getBoundingClientRect();
    return {
      x: Math.max(0, r.x - 20),
      y: Math.max(0, r.y - 20),
      width: Math.min(r.width + 40, window.innerWidth),
      height: Math.min(r.height + 40, window.innerHeight),
    };
  });
  await page.screenshot({ path: shot, clip });
}

/** The mobile disclosure menu OPEN capture @390: click the hamburger,
 *  clip the header + the OPEN panel (the byte-equal 0,64 390x229). */
async function captureMenuOpen(page: Page, origin: string, shot: string): Promise<void> {
  await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
  await page.locator("header").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2400);
  const btn = page.locator('header button[aria-label="Toggle navigation"]').first();
  if (await btn.count()) {
    await btn.click();
    await page.waitForTimeout(700);
  }
  const clip = await page.evaluate(() => {
    const header = document.querySelector("header");
    if (!header) throw new Error("the landing header not found");
    const r = header.getBoundingClientRect();
    return {
      x: 0,
      y: 0,
      width: Math.min(r.width + 40, window.innerWidth),
      height: Math.min(r.bottom + 40, window.innerHeight),
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
    console.log("[captures-192] reusing the dev server on :3000");
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
    console.log("[captures-192] pair state: ready (the dev-server page set rides it)");

    // the round's ours+ref evidence faces (539-546: the four login
    // views' desktop pairs — FRESH contexts, the byte-equal shells, the
    // D-192-cured id/for maps + the ring-ring submits inside)
    const loginJobs: Array<[string, "signin" | "signup" | "reset" | "sent", string, number, number]> = [
      [BASE, "signin", `${OUT}/539-login-signin-ours-desktop.png`, 1440, 900],
      [REF, "signin", `${OUT}/540-login-signin-ref-desktop.png`, 1440, 900],
      [BASE, "signup", `${OUT}/541-login-signup-ours-desktop.png`, 1440, 900],
      [REF, "signup", `${OUT}/542-login-signup-ref-desktop.png`, 1440, 900],
      [BASE, "reset", `${OUT}/543-login-reset-ours-desktop.png`, 1440, 900],
      [REF, "reset", `${OUT}/544-login-reset-ref-desktop.png`, 1440, 900],
      [BASE, "sent", `${OUT}/545-login-sent-ours-desktop.png`, 1440, 900],
      [REF, "sent", `${OUT}/546-login-sent-ref-desktop.png`, 1440, 900],
    ];
    for (const [origin, view, shot, w, h] of loginJobs) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      await captureLoginView(page, origin, view, shot);
      await ctx.close();
      console.log(`[captures-192] ${shot}`);
    }

    // the FAQ single-open pair (547-548, the Q2-open state at desktop)
    const faqJobs: Array<[string, string, number, number]> = [
      [BASE, `${OUT}/547-landing-faq-open-ours-desktop.png`, 1440, 900],
      [REF, `${OUT}/548-landing-faq-open-ref-desktop.png`, 1440, 900],
    ];
    for (const [origin, shot, w, h] of faqJobs) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      await captureFaqOpen(page, origin, shot);
      await ctx.close();
      console.log(`[captures-192] ${shot}`);
    }

    // the mobile disclosure menu OPEN pair (549-550 @390, the
    // byte-equal 0,64 390x229 panel)
    const menuJobs: Array<[string, string, number, number]> = [
      [BASE, `${OUT}/549-landing-mobilemenu-ours-phone.png`, 390, 844],
      [REF, `${OUT}/550-landing-mobilemenu-ref-phone.png`, 390, 844],
    ];
    for (const [origin, shot, w, h] of menuJobs) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      await captureMenuOpen(page, origin, shot);
      await ctx.close();
      console.log(`[captures-192] ${shot}`);
    }

    // the standard dev-server page set (551-558, the operator's record)
    const pageJobs: Array<[string, string]> = [
      ["/dashboard", `${OUT}/551-devserver-dashboard.png`],
      ["/leads", `${OUT}/552-devserver-leads.png`],
      ["/calendar", `${OUT}/553-devserver-calendar.png`],
      ["/contacts", `${OUT}/554-devserver-contacts.png`],
      ["/accounts", `${OUT}/555-devserver-accounts.png`],
      ["/activities", `${OUT}/556-devserver-activities.png`],
      ["/reports", `${OUT}/557-devserver-reports.png`],
      ["/settings", `${OUT}/558-devserver-settings.png`],
    ];
    for (const [route, shot] of pageJobs) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      await capturePage(page, BASE, route, shot);
      await ctx.close();
      console.log(`[captures-192] ${shot}`);
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
  console.error("[captures-192]", e);
  process.exit(1);
});

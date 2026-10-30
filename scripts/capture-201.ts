// Session-201 captures: the round's phone dialog-open pair (ours + the
// reference at the 390×844 axis — the round's own width, the
// two-app-openable surface: the /contacts New Contact dialog OPEN on
// both apps) + the dev-server set of the eleven phone dialog-open
// states (the round's own battery growth) + the mobile drawer-open
// face (the operator's standing mobile-nav ask) + the dashboard.
// Numbered past the s200 637-645 (the 646 series).
//
// Run: bun scripts/capture-201.ts
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

/** a phone dialog-open face: navigate, open the dialog, wait on the
 *  VISIBLE dialog (the L-164c2 guard), capture. */
async function capturePhoneDialog(
  page: import("@playwright/test").Page,
  base: string,
  route: string,
  open: (page: import("@playwright/test").Page) => Promise<void>,
  file: string,
  label: string,
) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2000);
  await closeBadge(page);
  await open(page);
  await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
  await page.waitForTimeout(700); // the mount + settle
  await page.screenshot({ path: join(OUT, file) });
  console.log(`[capture-201] ${file} — ${label}`);
  await page.keyboard.press("Escape").catch(() => undefined);
  await page.waitForTimeout(400);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[capture-201] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[capture-201] pair state: ready");

    // 646-647 — the round's pair: the /contacts New Contact dialog
    // OPEN at the 390×844 axis, ours + the reference (the
    // two-app-openable surface at the round's own width — walk64's
    // own phone axis, the round's own axis)
    for (const [n, label, base] of [
      ["646", "ours", OUR_URL],
      ["647", "ref", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
      const page = await ctx.newPage();
      await capturePhoneDialog(
        page,
        base,
        "/contacts",
        async (p) => {
          await p.getByRole("button", { name: "New Contact" }).click();
        },
        `${n}-s201-newcontact-dialog-${label}-390.png`,
        `the ${label} New Contact dialog OPEN at 390`,
      );
      await ctx.close();
    }

    // 648-658 — the dev-server set: the eleven phone dialog-open
    // states (ours, the seeded tree — the round's own registrations)
    const oursCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const ours = await oursCtx.newPage();
    const rowMenuEdit = async (p: import("@playwright/test").Page) => {
      await p.locator("table tbody button[aria-haspopup='menu']").first().click();
      await p.waitForTimeout(600);
      await p.getByRole("menuitem", { name: /^edit/i }).first().click();
    };
    const SET: Array<[string, string, string, (p: import("@playwright/test").Page) => Promise<void>]> = [
      ["648", "/leads", "newlead", async (p) => { await p.getByRole("button", { name: "New Lead" }).click(); }],
      ["649", "/accounts", "newaccount", async (p) => { await p.getByRole("button", { name: "New Account" }).click(); }],
      ["650", "/calendar", "newevent", async (p) => { await p.getByRole("button", { name: "New Event" }).click(); }],
      ["651", "/activities", "logcall", async (p) => { await p.getByRole("button", { name: "Log Call" }).first().click(); }],
      ["652", "/contacts", "editcontact", rowMenuEdit],
      ["653", "/leads", "editlead", rowMenuEdit],
      ["654", "/accounts", "editaccount", rowMenuEdit],
      ["655", "/contacts", "import", async (p) => { await p.getByRole("button", { name: "Import" }).click(); }],
      ["656", "/accounts", "insights", async (p) => { await p.locator("table tbody tr").first().click(); }],
      ["657", "/reports", "savereport", async (p) => { await p.getByRole("button", { name: /Saved Reports \(\d+\)/ }).click(); }],
    ];
    // (the New Contact phone state is the round's pair member 646 —
    //  the set below covers the other ten)
    for (const [n, route, tag, open] of SET) {
      await capturePhoneDialog(ours, OUR_URL, route, open, `${n}-s201-dev-${tag}-390.png`, `the dev ${tag} dialog OPEN at 390`);
    }

    // 658 — the mobile drawer-open face (the operator's standing ask)
    await ours.goto(`${OUR_URL}/Dashboard`, { waitUntil: "domcontentloaded" });
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(2000);
    await ours.locator('button[aria-label="Open navigation"]').click();
    await ours.waitForTimeout(900); // the 500ms slide-in + settle
    await ours.screenshot({ path: join(OUT, "658-s201-dev-drawer-open-390.png") });
    console.log("[capture-201] 658 — the dev-server drawer-open face at 390");

    // 659 — the dashboard (the dev-server set member)
    await ours.goto(`${OUR_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await ours.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await ours.waitForTimeout(1500);
    await ours.screenshot({ path: join(OUT, "659-s201-dev-dashboard.png") });
    console.log("[capture-201] 659 — the dev-server dashboard face");
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
  console.error("[capture-201]", e);
  process.exit(1);
});

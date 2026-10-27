// discover-190 micro-probe #2: the Save-Custom-View dialog's name input —
// the FULL class chain (no truncation) + the COMPUTED font at 1440 on
// BOTH apps. The discovery probe's 160-char slice showed OURS carrying
// `text-base md:text-sm text-ink` where the reference goes straight
// `text-base shadow-sm` — this leg decides (before the plan) whether the
// dialog's input is a genuine font-size arm (a live-find candidate the
// walk must decode) or a class-order artifact. Throwaway probe.
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
    /* fall through */
  }
  return process.cwd();
})();
const OUR_URL = "http://localhost:3000";
const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app";

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

async function probeInput(page: import("@playwright/test").Page, base: string, label: string) {
  await page.goto(`${base}/reports`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2800);
  await page.locator('main button:has-text("Saved Reports")').first().click();
  await page.waitForTimeout(1200);
  const out = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    const input = dlg?.querySelector('input[id="reportName"], input[placeholder*="Q1"]') as HTMLInputElement | null;
    if (!input) return null;
    const cs = getComputedStyle(input);
    // the FIRST checkbox's full chain + computed border color (the
    // M-81c2 genus re-check: border-primary vs border-neutral-900)
    const cb = dlg?.querySelector('[role="checkbox"]') ?? null;
    const cbCs = cb ? getComputedStyle(cb as HTMLElement) : null;
    // the trigger's full chain too (the round's freeze-pin target)
    return {
      inputCls: input.getAttribute("class") ?? "",
      font: `${cs.fontSize}/${cs.fontWeight}`,
      lineHeight: cs.lineHeight,
      cbCls: cb?.getAttribute("class") ?? "",
      cbBorder: cbCs?.border ?? "",
      cbBg: cbCs?.backgroundColor ?? "",
    };
  });
  console.log(`\n=== ${label} dialog input + checkbox (FULL chains) ===`);
  console.log(`  input.cls: "${out?.inputCls}"`);
  console.log(`  input computed font: ${out?.font} lineHeight=${out?.lineHeight}`);
  console.log(`  checkbox.cls: "${out?.cbCls}"`);
  console.log(`  checkbox border: "${out?.cbBorder}" bg=${out?.cbBg}`);
  await page.keyboard.press("Escape").catch(() => undefined);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[micro2-190] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL;
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }
  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      await probeInput(page, base, label);
      await ctx.close();
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
  console.error("[micro2-190]", e);
  process.exit(1);
});

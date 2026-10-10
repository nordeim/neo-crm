// Session-95: the mobile-nav drawer battery at TRUE 390x844 — the
// standing mobile-nav verification, productized as a tool (the s94
// corrected exact-selector protocol: the PANEL `div.h-dvh.w-72` inside
// `[role="dialog"]`, never the root; exact aria-labels; a REAL user
// click; the URL-based wait — the /Leads route is the s24 CAPITAL-route
// construction and the dev server compiles it on first visit).
// Run: env -u DATABASE_URL bun scripts/drawer-battery-390.ts
// Verifies: trigger geometry · panel 288px @ x0 · 8 links · focus
// inside · dual body+main lock · navigate-close -> /Leads with the full
// release · Escape-close · the resize-past-md lock release.
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const REPO = "/home/z/my-project/neo-crm";
const OUR_URL = "http://localhost:3000";
const EMAIL = "sepnetflix2023@outlook.com";
const PASSWORD = "$Abcd1234";

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
    console.log("[battery] reusing the dev server on :3000");
  } else {
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(`${OUR_URL}/login`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await Promise.all([
      page.waitForURL((u) => !u.pathname.endsWith("/login"), { timeout: 30000 }),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForTimeout(2000);

    // 1. the trigger: exact aria-label, geometry at TRUE 390
    const trigger = page.locator('button[aria-label="Open navigation menu"]');
    const tBox = await trigger.boundingBox();
    console.log("[battery] trigger:", JSON.stringify(tBox));

    // 2. OPEN (a REAL user click — fires the pointer sequence)
    await trigger.click();
    await page.waitForTimeout(700);

    const openProbe = await page.evaluate(() => {
      const root = document.querySelector('[role="dialog"][aria-label="Navigation menu"]') as HTMLElement | null;
      const panel = root ? (root.querySelector("div.h-dvh.w-72") as HTMLElement | null) : null;
      const links = panel ? Array.from(panel.querySelectorAll("a")) : [];
      const cs = panel ? getComputedStyle(panel) : null;
      const body = getComputedStyle(document.body);
      const main = document.querySelector("main");
      const mainCs = main ? getComputedStyle(main) : null;
      return {
        panelW: panel ? Math.round(panel.getBoundingClientRect().width) : null,
        panelX: panel ? Math.round(panel.getBoundingClientRect().x) : null,
        panelBg: cs ? cs.backgroundColor : null,
        panelVisible: panel ? getComputedStyle(panel).visibility : null,
        linkCount: links.length,
        linkTexts: links.slice(0, 3).map((a) => a.textContent?.trim()),
        focusInside: panel ? panel.contains(document.activeElement) : false,
        activeEl: document.activeElement?.tagName + "/" + (document.activeElement?.textContent || "").slice(0, 12),
        bodyOverflow: body.overflow,
        mainOverflow: mainCs ? mainCs.overflow : null,
        rootAriaModal: root?.getAttribute("aria-modal"),
        rootInert: root?.inert ?? null,
      };
    });
    console.log("[battery] OPEN:", JSON.stringify(openProbe, null, 1));

    // 3. navigate-close: click the Leads link -> /Leads + full release
    await page.locator('[role="dialog"] a[href="/Leads"]').first().click();
    await page.waitForURL((u) => u.pathname.includes("Leads"), { timeout: 30000 }).catch(() => undefined);
    await page.waitForTimeout(800);
    const afterNav = await page.evaluate(() => {
      const root = document.querySelector('[role="dialog"]') as HTMLElement | null;
      const main = document.querySelector("main");
      return {
        pathname: location.pathname,
        rootExists: !!root,
        rootInert: root?.inert ?? null,
        rootHidden: root?.hasAttribute("hidden") ?? null,
        rootVisibility: root ? getComputedStyle(root).visibility : null,
        rootPointerEvents: root ? getComputedStyle(root).pointerEvents : null,
        bodyOverflow: getComputedStyle(document.body).overflow,
        mainOverflow: main ? getComputedStyle(main).overflow : null,
      };
    });
    console.log("[battery] NAV-CLOSE:", JSON.stringify(afterNav));

    // 4. reopen + Escape-close
    await page.locator('button[aria-label="Open navigation menu"]').click();
    await page.waitForTimeout(600);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    const afterEsc = await page.evaluate(() => {
      const root = document.querySelector('[role="dialog"]') as HTMLElement | null;
      return {
        rootInert: root?.inert ?? null,
        rootHidden: root?.hasAttribute("hidden") ?? null,
        rootVisibility: root ? getComputedStyle(root).visibility : null,
        rootPointerEvents: root ? getComputedStyle(root).pointerEvents : null,
        bodyOverflow: getComputedStyle(document.body).overflow,
      };
    });
    console.log("[battery] ESC-CLOSE:", JSON.stringify(afterEsc));

    // 5. the resize-past-md lock release (the s8 regression)
    await page.setViewportSize({ width: 900, height: 800 });
    await page.waitForTimeout(600);
    const afterGrow = await page.evaluate(() => ({
      bodyOverflow: getComputedStyle(document.body).overflow,
      rootInert: (document.querySelector('[role="dialog"]') as HTMLElement)?.inert ?? null,
    }));
    console.log("[battery] RESIZE-PAST-MD:", JSON.stringify(afterGrow));

    await browser.close();
    console.log("[battery] done");
  } finally {
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
  console.error("[battery]", e);
  process.exit(1);
});

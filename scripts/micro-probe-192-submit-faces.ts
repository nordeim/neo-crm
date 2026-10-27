// Session-192 micro-probe: the auth-card sibling dark submits' REAL
// :focus-visible faces (the walk65 signin-submit decode's family check —
// the signup "Create account" + the reset "Send reset link" arms; the
// verify arm stays write-gated, its cure rides the family doctrine).
// The walk65 Phase B evidence: OURS signin submit ring slate-400 vs REF
// near-black rgb(9,9,11) — the stock focus-visible:ring-ring family.
import { chromium } from "@playwright/test";

const OUR_URL = "http://localhost:3000";
const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app";

async function probeSubmit(
  browser: import("@playwright/test").Browser,
  base: string,
  view: "signup" | "reset",
): Promise<void> {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
  await page.locator("h1").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2000);
  if (view === "signup") {
    await page.locator('button:has-text("Sign up")').first().click();
  } else {
    await page.locator('button:has-text("Forgot password?")').first().click();
  }
  await page.waitForTimeout(700);
  // Tab to the submit (type=submit is the last focusable in the card)
  let face: string | null = null;
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(180);
    const hit = (await page.evaluate(`(() => {
      const ae = document.activeElement;
      return !!ae && ae.getAttribute("type") === "submit";
    })()`)) as boolean;
    if (hit) {
      face = (await page.evaluate(`(() => {
        const cs = getComputedStyle(document.activeElement);
        return "outline=" + cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor + " ring=" + cs.boxShadow;
      })()`)) as string;
      break;
    }
  }
  console.log(`[${new URL(base).hostname}] ${view} submit REAL focus: ${face ?? "(submit never reached)"}`);
  await ctx.close();
}

const browser = await chromium.launch({ headless: true });
for (const base of [OUR_URL, REF_URL]) {
  await probeSubmit(browser, base, "signup");
  await probeSubmit(browser, base, "reset");
}
await browser.close();

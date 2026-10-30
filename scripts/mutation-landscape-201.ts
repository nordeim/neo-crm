// The s201 mutation-landscape probe: why does the open-dialog scan at
// phone NOT flag the nameless Import button behind the New Contact
// dialog? The hypothesis: Radix's hideOthers sets aria-hidden on the
// app root when the dialog portal opens — the page furniture leaves
// the a11y tree. Run with the mutation STILL PLANTED.
import { chromium } from "@playwright/test";
import { preflightPairState } from "./sweep-state";
import { waitOnUrl } from "./sweep";

const OUR_URL = "http://localhost:3000";
const REPO = process.cwd();

async function main() {
  if (!(await waitOnUrl(`${OUR_URL}/login`, 3000))) process.exit(1);
  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const page = await ctx.newPage();

    // 1) the page WITHOUT a dialog: the Import button's name state
    await page.goto(`${OUR_URL}/contacts`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    const flat = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("main button")) as HTMLButtonElement[];
      const imp = btns.find((b) => !b.getAttribute("aria-label") && b.querySelector("span")?.textContent?.trim() === "Import");
      return imp
        ? {
            found: true,
            name: imp.getAttribute("aria-label"),
            ariaHiddenSelf: imp.getAttribute("aria-hidden"),
            rootAriaHidden: document.body.firstElementChild?.getAttribute("aria-hidden"),
          }
        : { found: false };
    });
    console.log(`[flat] the mutated Import button: ${JSON.stringify(flat)}`);

    // 2) open the New Contact dialog: does the app root go aria-hidden?
    await page.getByRole("button", { name: "New Contact" }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(800);
    const open = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("main button")) as HTMLButtonElement[];
      const imp = btns.find((b) => !b.getAttribute("aria-label") && b.querySelector("span")?.textContent?.trim() === "Import");
      const appRoot = document.body.firstElementChild as HTMLElement | null;
      return {
        impFound: Boolean(imp),
        impAriaHidden: imp?.getAttribute("aria-hidden"),
        impClosestAriaHidden: imp?.closest("[aria-hidden='true']")?.tagName ?? "(none)",
        rootAriaHidden: appRoot?.getAttribute("aria-hidden"),
        rootInert: appRoot?.hasAttribute("inert") ?? false,
      };
    });
    console.log(`[dialog-open] the page behind: ${JSON.stringify(open)}`);
    await ctx.close();
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});

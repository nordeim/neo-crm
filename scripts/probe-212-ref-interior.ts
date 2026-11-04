// Session-212 (F-212a decode — the interior drift event): a ONE-OFF
// diagnostic probe. The interior census went RED on EVERY data page
// (100-900 unexplained events; the reference's DOM count halved and its
// pages shortened dramatically at every band). This probe dumps the
// STRUCTURE of both apps' dashboard + contacts pages — the main wrapper,
// the element count, mainH, and a class-skeleton of the first content
// levels — so the reference-side change can be decoded live.
//
// Run: bun scripts/probe-212-ref-interior.ts
// Env: OUR_URL / REF_URL / REF_EMAIL / REF_PASSWORD (the sweep contract)

import { chromium } from "@playwright/test";
import { preflightPairState } from "./sweep-state";

const OUR_URL = process.env.OUR_URL ?? "http://localhost:3000";
const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app";

const log = (s: string) => console.log(`[probe212] ${s}`);

type Skel = { tag: string; cls: string; kids: Skel[]; text?: string };

async function skeleton(
  root: import("@playwright/test").Locator,
  depth: number,
): Promise<Skel> {
  const el = root;
  const tag = await el.evaluate((n) => n.tagName.toLowerCase());
  const cls = (await el.evaluate((n) => n.getAttribute("class") ?? "")) || "";
  const kids: Skel[] = [];
  if (depth > 0) {
    const children = await el.locator(":scope > *").all();
    for (const c of children.slice(0, 14)) {
      kids.push(await skeleton(c, depth - 1));
    }
  }
  let text: string | undefined;
  if (kids.length === 0) {
    text = (await el.textContent())?.trim().slice(0, 60) || undefined;
  }
  return { tag, cls: cls.slice(0, 130), kids, text };
}

function printSkel(s: Skel, indent = 0): void {
  const pad = "  ".repeat(indent);
  const txt = s.text ? `  «${s.text}»` : "";
  console.log(`${pad}<${s.tag} class="${s.cls}">${txt}`);
  for (const k of s.kids) printSkel(k, indent + 1);
}

async function probe(
  page: import("@playwright/test").Page,
  base: string,
  path: string,
  label: string,
): Promise<void> {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const main = page.locator("main").first();
  const mainH = await main.evaluate((n) => n.scrollHeight);
  // the page shell = main's first child div (the p-4 sm:p-8 … wrapper)
  const shell = main.locator(":scope > div").first();
  const els = await main.evaluate((n) => n.querySelectorAll("*").length);
  log(`${label} ${path}: mainH=${mainH} els=${els}`);
  const shellSkel = await skeleton(shell, 3);
  printSkel(shellSkel, 1);
}

async function main(): Promise<void> {
  const browser = await chromium.launch();
  try {
    const state = await preflightPairState(browser);
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      storageState: state,
    });
    const refPage = await ctx.newPage();
    const ourPage = await ctx.newPage();

    await probe(refPage, REF_URL, "/Dashboard", "REF");
    await probe(ourPage, OUR_URL, "/Dashboard", "OURS");
    await probe(refPage, REF_URL, "/Contacts", "REF");
    await probe(ourPage, OUR_URL, "/Contacts", "OURS");
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

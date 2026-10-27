// discover-190 micro-probe: the dashboard follow-up-rows checkbox arms —
// the main probe's card-locator leg failed on BOTH apps ("card not
// found"); this leg finds the Lead Sources / Upcoming Activities cards
// by TEXT (any element) and walks up to the card root, censusing the
// row/checkbox counts + the first faces on BOTH apps. Throwaway probe —
// the s398-c era micro-probe form (scripts/probe-leads-search-and-tab-
// outline.ts precedent).
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

async function probeDashboard(page: import("@playwright/test").Page, base: string, label: string) {
  await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2800);

  console.log(`\n=== ${label} DASHBOARD FOLLOW-UP ARMS (text-anchored) ===`);
  const census = await page.evaluate(() => {
    // find the title by TEXT anywhere in main, then walk up to the card root
    const findByText = (re: RegExp) => {
      const walker = document.createTreeWalker(document.querySelector("main") ?? document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const t = (node.textContent ?? "").trim();
        if (re.test(t)) {
          const el = (node as ChildNode).parentElement;
          if (!el) continue;
          // walk up until we reach an element with a border-ish class or the 7th ancestor
          let cur: HTMLElement | null = el;
      for (let i = 0; i < 8 && cur; i++) {
            const cls = cur.getAttribute("class") ?? "";
        if (/rounded-(xl|2xl|lg).*border|border.*rounded-(xl|2xl|lg)/.test(cls) || (cls.includes("rounded-xl") && cls.includes("bg-white"))) {
              return { title: t, titleCls: cls, card: cur, depth: i };
            }
            cur = cur.parentElement;
          }
          return { title: t, titleCls: el.getAttribute("class") ?? "", card: el.parentElement, depth: -1 };
        }
      }
      return null;
    };
    const leadSrc = findByText(/^Lead Sources$/);
    const upcoming = findByText(/^Upcoming Activities$/);
    const censusCard = (hit: { card: HTMLElement | null; title: string } | null) => {
      if (!hit || !hit.card) return { found: false, title: hit?.title ?? "(none)", rows: 0, checkboxes: 0, rowTexts: [] as string[], emptyText: "" };
      const card = hit.card;
      const rows = Array.from(card.querySelectorAll("label, div.flex.items-center")).filter((r) => (r.textContent ?? "").trim().length > 0 && (r.textContent ?? "").trim().length < 80);
      const checkboxes = Array.from(card.querySelectorAll('input[type="checkbox"], [role="checkbox"]'));
      const emptyP = Array.from(card.querySelectorAll("p")).find((p) => /no |not yet|empty/i.test(p.textContent ?? ""));
      return {
        found: true,
        title: hit.title,
        rows: rows.length,
        checkboxes: checkboxes.length,
        rowTexts: rows.slice(0, 5).map((r) => (r.textContent ?? "").trim().slice(0, 50)),
        emptyText: emptyP?.textContent?.trim().slice(0, 60) ?? "",
      };
    };
    return { leadSources: censusCard(leadSrc), upcoming: censusCard(upcoming) };
  });
  for (const [name, c] of [["Lead Sources", census.leadSources], ["Upcoming Activities", census.upcoming]] as const) {
    console.log(`  ${name}: found=${c.found} rows=${c.rows} checkboxes=${c.checkboxes} empty="${c.emptyText}"`);
    if (c.found && c.rowTexts.length) console.log(`    rows: [${c.rowTexts.join(" | ")}]`);
  }

  // The first checkbox face on each card (if rows exist)
  const cbFace = await page
    .evaluate(() => {
      const boxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
      const byText = (re: RegExp) => {
        const box = boxes.find((b) => {
          let cur: HTMLElement | null = b as HTMLElement;
          for (let i = 0; i < 6 && cur; i++) {
            const t = cur.textContent ?? "";
            if (re.test(t)) return true;
            cur = cur.parentElement;
          }
          return false;
        });
        return box ?? null;
      };
      const faceOf = (el: Element | null) => {
        if (!el) return null;
        const cs = getComputedStyle(el as HTMLElement);
        const r = el.getBoundingClientRect();
        const wrap = el.closest("label, div.flex, button");
        const wrapCls = wrap ? wrap.getAttribute("class") ?? "" : "";
        return {
          cls: (el.getAttribute("class") ?? "").slice(0, 140),
          aria: el.getAttribute("aria-label") ?? "(none)",
          bg: cs.backgroundColor,
          border: cs.border,
          radius: cs.borderRadius,
          box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
          wrapCls: wrapCls.slice(0, 140),
        };
      };
      return {
        leadSrc: faceOf(byText(/Follow up with/i)),
        upcoming: faceOf(boxes.find((b) => {
          let cur: HTMLElement | null = b.parentElement;
          for (let i = 0; i < 6 && cur; i++) {
            const sib = cur.querySelector("p, span");
            const t = cur.textContent ?? "";
            if (/Follow up with|activities/i.test(t) && sib) return true;
            cur = cur.parentElement;
          }
          return false;
        }) ?? null),
      };
    })
    .catch(() => null);
  if (cbFace?.leadSrc) {
    console.log(`  Lead-Sources checkbox: box=${cbFace.leadSrc.box} bg=${cbFace.leadSrc.bg} border="${cbFace.leadSrc.border}" radius=${cbFace.leadSrc.radius}\n    cls="${cbFace.leadSrc.cls}"\n    wrap="${cbFace.leadSrc.wrapCls}"`);
  } else {
    console.log("  Lead-Sources checkbox: (none found)");
  }
  if (cbFace?.upcoming) {
    console.log(`  Upcoming checkbox: box=${cbFace.upcoming.box} bg=${cbFace.upcoming.bg} border="${cbFace.upcoming.border}" radius=${cbFace.upcoming.radius}\n    cls="${cbFace.upcoming.cls}"`);
  } else {
    console.log("  Upcoming checkbox: (none found)");
  }
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[micro-190] reusing the dev server on :3000");
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
      await probeDashboard(page, base, label);
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
  console.error("[micro-190]", e);
  process.exit(1);
});

// Session-193 (micro-probe): THE OUTLINE-COLOR CARRIER decode — the
// walk66 focus faces surfaced the D-193a2 candidate: OURS resolves the
// UA auto-outline to a near-black OPAQUE rgb(16,16,16)-family carrier
// at the focus face and currentColor at the resting face, while the
// REFERENCE resolves rgba(10,10,10,0.5) everywhere. Neither app authors
// an outline rule on the in-page anchors — this probe answers WHO
// carries the color: (a) an authored rule in either app's stylesheet
// (a CSSOM walk for every outline-carrying rule + the anchor's matched
// rules), (b) the engine's auto resolution (the computed outlineColor
// on a BARE unclassed element outside both apps' style trees — an
// appended <span> with no classes), (c) accent-color / color-scheme
// tokens either app sets at the root.
//
// Run: bun scripts/micro-probe-193-outline-carrier.ts
// (reuses the dev server on :3000; the legs ride the sweep-state pair.)
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

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (!(await waitOnUrl(`${OUR_URL}/login`, 3000))) {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
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
      await page.goto(`${base}/about`, { waitUntil: "domcontentloaded" });
      await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
      await page.waitForTimeout(2400);
      const probe = (await page.evaluate(
        `(() => {
          const out = {};
          // (1) the anchor's own computed outline triplet + color carriers
          const anchor = Array.from(document.querySelectorAll("main a")).find((a) => (a.textContent || "").includes("Get in touch"));
          const acs = anchor ? getComputedStyle(anchor) : null;
          out.anchor = acs ? {
            outlineColor: acs.outlineColor,
            color: acs.color,
            accentColor: acs.accentColor,
            caretColor: acs.caretColor,
          } : null;
          // (2) the ROOT tokens: color-scheme + accent-color at the html/body
          const html = document.documentElement;
          const hcs = getComputedStyle(html);
          const bcs = getComputedStyle(document.body);
          out.root = {
            htmlColorScheme: hcs.colorScheme,
            htmlAccentColor: hcs.accentColor,
            bodyColorScheme: bcs.colorScheme,
            bodyAccentColor: bcs.accentColor,
            htmlClass: html.className.slice(0, 80),
          };
          // (3) the BARE element: an unclassed <span> + <a> appended to body —
          // outside every authored rule (only the UA + any * selectors)
          const span = document.createElement("span");
          span.id = "micro-probe-bare-span";
          document.body.appendChild(span);
          const bareA = document.createElement("a");
          bareA.id = "micro-probe-bare-a";
          bareA.textContent = "bare";
          document.body.appendChild(bareA);
          out.bare = {
            spanOutlineColor: getComputedStyle(span).outlineColor,
            aOutlineColor: getComputedStyle(bareA).outlineColor,
            aColor: getComputedStyle(bareA).color,
          };
          span.remove();
          bareA.remove();
          // (4) the CSSOM walk: every authored rule carrying outline in its text
          const outlineRules = [];
          for (const sheet of Array.from(document.styleSheets)) {
            let rules;
            try { rules = sheet.cssRules; } catch (e) { continue; }
            if (!rules) continue;
            for (const rule of Array.from(rules)) {
              const text = rule.cssText || "";
              if (/outline/i.test(text) && text.length < 300) {
                outlineRules.push(text.slice(0, 200));
              }
              if (outlineRules.length >= 12) break;
            }
            if (outlineRules.length >= 12) break;
          }
          out.outlineRules = outlineRules;
          // (5) the focused face on the bare anchor: does Tab-painted auto
          // resolve differently per app? (a programmatic focus never paints
          // :focus-visible, so we read the RESOLVED color after a REAL-ish
          // focus via the focus-visible polyfill-free forced flag)
          out.forcedColors = matchMedia("(forced-colors: active)").matches;
          return out;
        })()`,
      )) as {
        anchor: { outlineColor: string; color: string; accentColor: string; caretColor: string } | null;
        root: Record<string, string>;
        bare: Record<string, string>;
        outlineRules: string[];
        forcedColors: boolean;
      };
      console.log(`\n=== ${label} OUTLINE-CARRIER PROBE (/about):`);
      console.log(`  anchor: ${JSON.stringify(probe.anchor)}`);
      console.log(`  root: ${JSON.stringify(probe.root)}`);
      console.log(`  bare: ${JSON.stringify(probe.bare)}`);
      console.log(`  outlineRules(${probe.outlineRules.length}):`);
      for (const r of probe.outlineRules) console.log(`    - ${r}`);
      console.log(`  forcedColors: ${probe.forcedColors}`);
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
  console.error("[micro-probe-193]", e);
  process.exit(1);
});

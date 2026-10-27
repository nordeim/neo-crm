// Session-194 (glyph probe): the Go Home icon's exact svg path data on
// both apps (the M-82c2 icon-identity family — the D-186a1 pen-cure
// precedent) + the reference's live per-route titles (the 404 title
// genus adjudication: the s10 probes held "Accounts | NEO CRM" on the
// CRM routes; the s13 decode held the login as plain "NEO CRM"; the
// live 404 is plain "NEO CRM" — the s12 absolute title is a pre-drift
// decode).
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
    console.log("[glyph-194] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[glyph-194] pair state: ready");
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n########## GO-HOME GLYPH + TITLES ${label} ##########`);
      await page.goto(`${base}/zzz-glyph-194`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(3000);
      const glyph = await page.evaluate(() => {
        const arm = Array.from(document.querySelectorAll("a, button")).find((el) =>
          (el.textContent ?? "").includes("Go Home"),
        );
        if (!arm) return { found: false };
        const svg = arm.querySelector("svg");
        const paths = svg ? Array.from(svg.querySelectorAll("path")) : [];
        return {
          found: true,
          tag: arm.tagName.toLowerCase(),
          href: (arm as HTMLAnchorElement).getAttribute("href") ?? "(none)",
          svgAttrs: svg
            ? {
                viewBox: svg.getAttribute("viewBox") ?? "(none)",
                width: svg.getAttribute("width") ?? "(none)",
                height: svg.getAttribute("height") ?? "(none)",
                fill: svg.getAttribute("fill") ?? "(none)",
                stroke: svg.getAttribute("stroke") ?? "(none)",
                strokeWidth: svg.getAttribute("stroke-width") ?? "(none)",
                strokeLinecap: svg.getAttribute("stroke-linecap") ?? "(none)",
                strokeLinejoin: svg.getAttribute("stroke-linejoin") ?? "(none)",
                cls: svg.getAttribute("class") ?? "(none)",
              }
            : null,
          paths: paths.map((p) => ({ d: p.getAttribute("d") ?? "(none)" })),
        };
      });
      console.log(`  Go Home arm: found=${glyph.found} tag=${glyph.tag ?? "-"} href=${glyph.href ?? "-"}`);
      if (glyph.svgAttrs) console.log(`  svg: ${JSON.stringify(glyph.svgAttrs)}`);
      (glyph.paths ?? []).forEach((p, i) => console.log(`  path[${i}]: ${p.d}`));

      // The live titles on the real routes (the title genus decode)
      for (const p of ["/dashboard", "/accounts", "/about"]) {
        await page.goto(`${base}${p}`, { waitUntil: "domcontentloaded" }).catch(() => undefined);
        await page.waitForTimeout(3200);
        const t = await page.evaluate(() => ({ title: document.title, path: location.pathname }));
        console.log(`  TITLE ${t.path}: "${t.title}"`);
      }
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
  console.error("[glyph-194]", e);
  process.exit(1);
});

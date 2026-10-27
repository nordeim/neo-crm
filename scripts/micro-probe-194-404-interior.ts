// Session-194 (micro-probe): the 404 interior's deeper decode — the
// discovery's LEG-2 found the AUTHENTICATED 404 LIVE on both apps with
// three delta candidates (the quoted-path form, the Go Home arm
// [OURS anchors=1, REF anchors=0], the document title). This probe
// decodes the root causes BEFORE the plan:
//
//   1. The REF's authenticated-404 DFS ledger — what its Go Home arm
//      actually is (a button? an anchor? absent?), the full element
//      tree (els=29 vs OURS 24), and every computed face.
//   2. The final URL at both legs (does either app redirect? the REF's
//      anon unknown-route renders the login view — AT the unknown URL
//      or after a redirect to /login?).
//   3. The REAL keyboard Tab chain through the AUTHENTICATED 404 on
//      both apps (the Go Home focus face; the REF's platform badge).
//
// Run: bun scripts/micro-probe-194-404-interior.ts
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

/** The DFS ledger — every visible element's tag/cls/text/box + the
 * interactive elements' computed faces (the LEDGER_JS form, condensed
 * for a ~30-element surface). */
async function dfsLedger(page: import("@playwright/test").Page, base: string, label: string, path: string): Promise<void> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2600);
  const ledger = await page.evaluate(() => {
    const out: string[] = [];
    const walk = (el: Element, depth: number) => {
      for (const node of Array.from(el.children)) {
        const r = node.getBoundingClientRect();
        if (r.width === 0 && r.height === 0 && !["html", "head", "script", "style", "link", "noscript"].includes(node.tagName.toLowerCase())) {
          out.push(`${"  ".repeat(depth)}<${node.tagName.toLowerCase()}> (zero-size, cls="${node.className && typeof node.className === "string" ? node.className : ""}")`);
          continue;
        }
        const cls = node.className && typeof node.className === "string" ? node.className.slice(0, 90) : "";
        const text = (node.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 34);
        const ownText = Array.from(node.childNodes)
          .filter((n) => n.nodeType === 3)
          .map((n) => (n.textContent ?? "").trim())
          .join(" ")
          .slice(0, 34);
        out.push(
          `${"  ".repeat(depth)}<${node.tagName.toLowerCase()}> cls="${cls}" box=${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} text="${ownText || text}"`,
        );
        if (depth < 7) walk(node, depth + 1);
      }
    };
    walk(document.body, 0);
    const interactives = Array.from(document.querySelectorAll("a, button, input, [role]")).map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        sel: `<${el.tagName.toLowerCase()}> "${((el as HTMLElement).textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 26)}"`,
        box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        cls: (el.className && typeof el.className === "string" ? el.className : "").slice(0, 110),
        color: cs.color,
        bg: cs.backgroundColor,
        border: cs.border,
        radius: cs.borderRadius,
        shadow: cs.boxShadow.slice(0, 90),
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
        font: `${cs.fontSize} ${cs.fontWeight}`,
        padding: cs.padding,
        display: cs.display,
        gap: cs.gap,
      };
    });
    return {
      url: location.href,
      title: document.title,
      els: document.querySelectorAll("body *").length,
      lines: out,
      interactives,
    };
  });
  console.log(`\n=== ${label} ${path} DFS LEDGER (final URL: ${ledger.url}) ===`);
  console.log(`  title="${ledger.title}" els=${ledger.els}`);
  ledger.lines.slice(0, 40).forEach((l) => console.log(l));
  console.log(`  interactives(${ledger.interactives.length}):`);
  for (const it of ledger.interactives) {
    console.log(
      `    ${it.sel} box=${it.box}\n      cls="${it.cls}"\n      color=${it.color} bg=${it.bg} border=${it.border} radius=${it.radius} font=${it.font} pad=${it.padding} display=${it.display} gap=${it.gap}\n      shadow=[${it.shadow}] outline=[${it.outline}]`,
    );
  }
}

/** The REAL Tab chain through the AUTHENTICATED 404. */
async function tabChain(page: import("@playwright/test").Page, base: string, label: string, path: string): Promise<void> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2400);
  await page.locator("body").click({ position: { x: 8, y: 8 } }).catch(() => undefined);
  await page.waitForTimeout(300);
  const stops: string[] = [];
  const faces: string[] = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(160);
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return { tag: "body", face: null as null | Record<string, string> };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el as HTMLElement);
      const label =
        (el as HTMLElement).getAttribute("aria-label") ??
        (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 32);
      return {
        tag: el.tagName.toLowerCase(),
        label,
        box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        face: {
          shadow: cs.boxShadow.slice(0, 140),
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
          bg: cs.backgroundColor,
          color: cs.color,
        },
      };
    });
    if (stop.tag === "body") {
      stops.push(`(body — chain end)`);
      break;
    }
    stops.push(`${stop.tag} "${stop.label}" @${stop.box}`);
    if (stop.face) faces.push(`${stop.tag} "${stop.label}": shadow=[${stop.face.shadow}] outline=[${stop.face.outline}] bg=${stop.face.bg} color=${stop.face.color}`);
    if (i > 0 && stops[0].startsWith(stop.tag) && stops[0].includes(stop.label ?? "")) {
      stops.push("(wrapped — chain complete)");
      break;
    }
  }
  console.log(`\n=== ${label} ${path} AUTH-404 REAL TAB CHAIN (${stops.length} stops):`);
  stops.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  console.log(`  FOCUS-VISIBLE faces:`);
  faces.forEach((f) => console.log(`    ${f}`));
}

/** The anon unknown-route final-URL decode (the REF's login-wall posture
 * — redirect or render-at-URL?). */
async function anonUrl(page: import("@playwright/test").Page, base: string, label: string, path: string): Promise<void> {
  const resp = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" }).catch(() => null);
  await page.waitForTimeout(2400);
  const info = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.trim() ?? "(none)",
  }));
  console.log(`\n=== ${label} ANON ${path}: final=${info.url} (http ${resp?.status() ?? "?"}) title="${info.title}" h1="${info.h1}"`);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[micro-probe-194] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[micro-probe-194] pair state: ready");
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n########## AUTH-404 DECODE ${label} ##########`);
      await dfsLedger(page, base, label, "/zzz-probe-194");
      await tabChain(page, base, label, "/zzz-probe-194");
      await ctx.close();
    }
    // The anon URL decode — fresh contexts
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      console.log(`\n########## ANON URL DECODE ${label} ##########`);
      await anonUrl(page, base, label, "/zzz-probe-194");
      await anonUrl(page, base, label, "/Login");
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
  console.error("[micro-probe-194]", e);
  process.exit(1);
});

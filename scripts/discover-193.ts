// Session-193 (discovery): the s406 close's named next-rotation candidates,
// adjudicated BEFORE the plan:
//
//   1. THE STANDING RE-CHECKS (LEG-1, the discover-184..192 legs condensed
//      one pass) — the Edit-family rows + rowMenus + the topbar-search
//      dropdown + the dashboard follow-up checkboxes + the activities
//      Completed-tab. probe:ref STABLE this session (46bc2d9c — the demo
//      data still ZERO) means every data-dependent arm is expected KILLED
//      again; the legs are the standing one-probe re-check.
//   2. THE /ABOUT + /CONTACT AUTHENTICATED INTERIORS (LEG-2, the NEW
//      candidate — the s406 close's own naming: "the /About + /Contact
//      authenticated interiors' interactive arms, if any surface beyond
//      the census gate's coverage"). The 156-c interior-census legs hold
//      the mainH geometry; the sweep holds the pixels; the s142 census
//      held the construction — but the INTERACTIVE arms (the in-page
//      anchor inventory + their href/target/rel semantics + the footer
//      link pair + the sidebar focus-stops) were never walked two-app at
//      the OPEN-LEDGER level. DATA-INDEPENDENT: pure static server
//      content inside the authenticated AppShell chrome on both apps.
//   3. THE REAL KEYBOARD TAB DRIVE (LEG-3) — the walk54/58/64 focus form
//      through the /About interior: the chain's stop inventory + the
//      sidebar links' REAL :focus-visible faces + the topbar dead-stub
//      arms' focus faces + the in-page anchor faces. The programmatic
//      .focus() never triggers :focus-visible — only the REAL Tab key
//      paints the true face.
//
// Run: bun scripts/discover-193.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  authenticated legs ride the sweep-state storageState pair, the
//  s162 doctrine.)
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

/** Leg 1a — the standing Edit-family re-check (condensed): the three
 * entity pages' rows + rowMenus, one pass per app. */
async function censusRows(page: import("@playwright/test").Page, url: string, label: string): Promise<void> {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2200);
  const census = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("main table tbody tr")).filter(
      (tr) => (tr.textContent ?? "").trim().length > 0,
    );
    const rowMenuButtons = Array.from(document.querySelectorAll('main button[aria-haspopup="true"], main button[aria-haspopup="menu"]'));
    return { tableRows: rows.length, rowMenuCount: rowMenuButtons.length };
  });
  console.log(`  [${label}] ${new URL(url).pathname}: rows=${census.tableRows} rowMenus=${census.rowMenuCount}`);
}

/** Leg 1b — the topbar-search dropdown (the standing conditional gate). */
async function probeTopbarSearch(page: import("@playwright/test").Page, base: string, label: string): Promise<void> {
  await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2200);
  const search = page.locator('header input, input[type="search"], input[placeholder*="Search"]').first();
  if (!(await search.count())) {
    console.log(`\n=== ${label} TOPBAR SEARCH: INPUT NOT FOUND`);
    return;
  }
  await search.click();
  await search.fill("Acme");
  await page.waitForTimeout(1500);
  const census = await page.evaluate(() => {
    const pop = Array.from(document.querySelectorAll('[role="listbox"], [data-radix-popper-content-wrapper]'));
    const visible = pop.filter((p) => {
      const r = p.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    return { popCount: visible.length };
  });
  console.log(`\n=== ${label} TOPBAR SEARCH: populated=${census.popCount}`);
  await page.keyboard.press("Escape").catch(() => undefined);
}

/** Leg 1c — the dashboard follow-up-rows checkboxes (the suspended candidate). */
async function probeDashboardCheckboxes(page: import("@playwright/test").Page, base: string, label: string): Promise<void> {
  await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2600);
  const census = await page.evaluate(() => {
    const checkboxes = Array.from(document.querySelectorAll('main [role="checkbox"], main input[type="checkbox"]'));
    return { checkboxes: checkboxes.length };
  });
  console.log(`\n=== ${label} DASHBOARD CHECKBOX ARMS: checkboxes=${census.checkboxes}`);
}

/** Leg 1d — the activities Completed-tab row actions (the suspended candidate). */
async function probeActivitiesCompleted(page: import("@playwright/test").Page, base: string, label: string): Promise<void> {
  await page.goto(`${base}/activities`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2600);
  const completedTab = page.locator('main button[role="tab"]:has-text("Completed")').first();
  if (await completedTab.count()) {
    await completedTab.click();
    await page.waitForTimeout(1000);
    const census = await page.evaluate(() => {
      const checkBtns = Array.from(document.querySelectorAll("main button")).filter((b) =>
        /check as completed|mark as scheduled/i.test((b.textContent ?? "") + (b.getAttribute("aria-label") ?? "")),
      );
      return { checkButtons: checkBtns.length };
    });
    console.log(`\n=== ${label} ACTIVITIES COMPLETED-TAB: checkButtons=${census.checkButtons}`);
  } else {
    console.log(`\n=== ${label} ACTIVITIES COMPLETED-TAB: NOT FOUND`);
  }
}

/** LEG-2 — the /About + /Contact AUTHENTICATED interior census + the
 * interactive-arm inventory. The face helper + the anchor inventory ride
 * the standing discover form. */
async function probeMarketingInterior(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  path: string,
): Promise<void> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2400);
  const census = await page.evaluate(() => {
    const main = document.querySelector("main");
    const mr = main?.getBoundingClientRect();
    const els = main ? main.querySelectorAll("*").length : 0;
    const anchors = main
      ? Array.from(main.querySelectorAll("a")).map((a) => {
          const r = a.getBoundingClientRect();
          const cs = getComputedStyle(a);
          return {
            text: (a.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40),
            href: a.getAttribute("href") ?? "(none)",
            target: a.getAttribute("target") ?? "(none)",
            rel: a.getAttribute("rel") ?? "(none)",
            box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
            color: cs.color,
            weight: cs.fontWeight,
            deco: cs.textDecorationLine,
          };
        })
      : [];
    const h1 = main?.querySelector("h1");
    const hr = h1?.getBoundingClientRect();
    const h2s = main
      ? Array.from(main.querySelectorAll("h2")).map((h) => (h.textContent ?? "").trim())
      : [];
    const buttons = main ? Array.from(main.querySelectorAll("button")).length : 0;
    const footer = document.querySelector("footer");
    const footerLinks = footer
      ? Array.from(footer.querySelectorAll("a")).map((a) => ({
          text: (a.textContent ?? "").trim(),
          href: a.getAttribute("href") ?? "(none)",
        }))
      : [];
    const nav = document.querySelector("nav, aside");
    const nr = nav?.getBoundingClientRect();
    const navLinks = nav
      ? Array.from(nav.querySelectorAll("a")).map((a) => (a.textContent ?? "").trim()).filter(Boolean)
      : [];
    return {
      path: location.pathname,
      mainH: mr ? Math.round(mr.height) : 0,
      els,
      h1: h1?.textContent?.trim() ?? "(none)",
      h1Box: hr ? `${Math.round(hr.x)},${Math.round(hr.y)} ${Math.round(hr.width)}x${Math.round(hr.height)}` : "(none)",
      h2s,
      anchors,
      buttons,
      footerLinks,
      navBox: nr ? `${Math.round(nr.width)}px` : "(none)",
      navLinks,
    };
  });
  console.log(`\n=== ${label} ${path} AUTHENTICATED INTERIOR:`);
  console.log(
    `  mainH=${census.mainH} els=${census.els} h1="${census.h1}" box=${census.h1Box} buttons=${census.buttons}`,
  );
  console.log(`  h2s(${census.h2s.length}): [${census.h2s.join(" | ")}]`);
  console.log(`  in-page anchors(${census.anchors.length}):`);
  for (const a of census.anchors) {
    console.log(
      `    "${a.text}" href=${a.href} target=${a.target} rel=${a.rel} box=${a.box} color=${a.color} weight=${a.weight} deco=${a.deco}`,
    );
  }
  console.log(`  footer links(${census.footerLinks.length}): [${census.footerLinks.map((l) => `${l.text}->${l.href}`).join(" | ")}]`);
  console.log(`  nav: ${census.navBox} links(${census.navLinks.length}): [${census.navLinks.join(" | ")}]`);
}

/** LEG-3 — the REAL keyboard Tab drive through the /About interior: the
 * stop inventory + the REAL :focus-visible faces. Tab from body, capture
 * up to 26 stops, decode the visible focus face at the sidebar links, the
 * topbar dead-stub arms, and the in-page anchors. */
async function probeTabChain(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  path: string,
): Promise<void> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2400);
  await page.locator("body").click({ position: { x: 8, y: 8 } }).catch(() => undefined);
  await page.waitForTimeout(300);
  const stops: string[] = [];
  const faces: string[] = [];
  for (let i = 0; i < 26; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(140);
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
          shadow: cs.boxShadow.slice(0, 120),
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
          bg: cs.backgroundColor,
        },
      };
    });
    if (stop.tag === "body") {
      stops.push(`(body — chain end)`);
      break;
    }
    stops.push(`${stop.tag} "${stop.label}" @${stop.box}`);
    if (stop.face) faces.push(`${stop.tag} "${stop.label}": shadow=[${stop.face.shadow}] outline=[${stop.face.outline}] bg=${stop.face.bg}`);
    // stop when the chain wraps back to the first interactive (a full loop)
    if (i > 0 && stops[0].startsWith(stop.tag) && stops[0].includes(stop.label ?? "")) {
      stops.push("(wrapped — chain complete)");
      break;
    }
  }
  console.log(`\n=== ${label} ${path} REAL TAB CHAIN (${stops.length} stops):`);
  stops.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  console.log(`  FOCUS-VISIBLE faces:`);
  faces.forEach((f) => console.log(`    ${f}`));
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-193] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    // LEG 1 + LEG 2 + LEG 3 — the authenticated pair state (the s162 guarded form)
    const state = await preflightPairState(browser);
    console.log("[discover-193] pair state: ready (the s162 guarded form)");
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n########## LEG-1 STANDING RE-CHECKS ${label} ##########`);
      for (const p of ["/contacts", "/leads", "/accounts"]) {
        await censusRows(page, `${base}${p}`, label).catch((e) => console.log(`  [${p} ${label}] ERROR: ${e}`));
      }
      await probeTopbarSearch(page, base, label).catch((e) => console.log(`  [topbar ${label}] ERROR: ${e}`));
      await probeDashboardCheckboxes(page, base, label).catch((e) => console.log(`  [dashboard ${label}] ERROR: ${e}`));
      await probeActivitiesCompleted(page, base, label).catch((e) => console.log(`  [activities ${label}] ERROR: ${e}`));

      console.log(`\n########## LEG-2 MARKETING INTERIORS ${label} ##########`);
      await probeMarketingInterior(page, base, label, "/about").catch((e) => console.log(`  [about ${label}] ERROR: ${e}`));
      await probeMarketingInterior(page, base, label, "/contact").catch((e) => console.log(`  [contact ${label}] ERROR: ${e}`));

      console.log(`\n########## LEG-3 REAL TAB DRIVE ${label} ##########`);
      await probeTabChain(page, base, label, "/about").catch((e) => console.log(`  [tabchain ${label}] ERROR: ${e}`));
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
  console.error("[discover-193]", e);
  process.exit(1);
});

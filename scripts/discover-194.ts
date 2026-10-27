// Session-194 (discovery): the s408 close's named next-rotation candidates,
// adjudicated BEFORE the plan:
//
//   1. THE STANDING RE-CHECKS (LEG-1, the discover-184..193 legs condensed
//      one pass) — the Edit-family rows + rowMenus + the topbar-search
//      dropdown + the dashboard follow-up checkboxes + the activities
//      Completed-tab. probe:ref STABLE this session (46bc2d9c — the demo
//      data still ZERO) means every data-dependent arm is expected KILLED
//      again; the legs are the standing one-probe re-check.
//   2. THE 404 INTERIOR (LEG-2, the NEW candidate — the s408 close's own
//      naming: "the 404/error-boundary interiors' interactive arms, if any
//      surface beyond the census gate's coverage"). The s12 construction +
//      the NOT_FOUND_LAYOUT pins + the crm.spec render test hold the
//      strings — but the INTERACTIVE arms (the Go Home link's href/box/
//      computed face + the quoted-pathname message + the bare-vs-chrome
//      posture + the capital-auth 404 form) were never walked two-app at
//      the OPEN-LEDGER level: no DFS ledger, no anchor inventory, no REAL
//      keyboard Tab chain, no REAL :focus-visible face, no link-ride
//      decode. The error.tsx/global-error.tsx pair is OUR-ONLY (the s170
//      scandihaven ports — the reference cannot be forced to crash; its
//      interiors carry no two-app walk, only the 17-check source pins).
//      LEG-2 walks the 404 at BOTH contexts: ANON (fresh — the public
//      posture) + AUTHENTICATED (the sweep-state pair — does either app
//      wrap the 404 in chrome when sessioned?).
//   3. THE REAL KEYBOARD TAB DRIVE (LEG-3) — the walk54/58/64/66 focus
//      form through the ANON 404: the chain's stop inventory + the Go
//      Home link's REAL :focus-visible face. The programmatic .focus()
//      never triggers :focus-visible — only the REAL Tab key paints the
//      true face.
//
// Run: bun scripts/discover-194.ts
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

/** LEG-2 — the 404 interior census at the given context. The face helper
 * + the anchor inventory ride the standing discover form, plus the
 * 404-specific arms: the quoted-pathname message, the bare-vs-chrome
 * posture (nav/aside/header/footer presence), and the document title. */
async function probe404Interior(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  path: string,
): Promise<void> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2600);
  const census = await page.evaluate(() => {
    const body = document.body;
    const br = body.getBoundingClientRect();
    const bcs = getComputedStyle(body);
    const root = body.firstElementChild as HTMLElement | null;
    const rr = root?.getBoundingClientRect();
    const rcs = root ? getComputedStyle(root) : null;
    // The 404 surface may not carry <main>; census from the visible text
    // anchors instead. Take the whole document's anchors EXCLUDING any
    // platform badge (the base44 pill is a REF-only artifact, censused
    // separately below).
    const anchors = Array.from(document.querySelectorAll("a")).map((a) => {
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      return {
        text: (a.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40),
        href: a.getAttribute("href") ?? "(none)",
        target: a.getAttribute("target") ?? "(none)",
        rel: a.getAttribute("rel") ?? "(none)",
        box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        color: cs.color,
        bg: cs.backgroundColor,
        weight: cs.fontWeight,
        size: cs.fontSize,
        border: cs.border,
        radius: cs.borderRadius,
        shadow: cs.boxShadow.slice(0, 100),
        deco: cs.textDecorationLine,
      };
    });
    const h1 = document.querySelector("h1");
    const hr = h1?.getBoundingClientRect();
    const h1cs = h1 ? getComputedStyle(h1) : null;
    const h2s = Array.from(document.querySelectorAll("h2")).map((h) => {
      const r = h.getBoundingClientRect();
      const cs = getComputedStyle(h);
      return { text: (h.textContent ?? "").trim(), box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`, color: cs.color, size: cs.fontSize, weight: cs.fontWeight };
    });
    const ps = Array.from(document.querySelectorAll("p")).map((p) => {
      const r = p.getBoundingClientRect();
      const cs = getComputedStyle(p);
      const pathSpan = p.querySelector("span");
      const spanCs = pathSpan ? getComputedStyle(pathSpan) : null;
      return {
        text: (p.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 90),
        box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        color: cs.color,
        size: cs.fontSize,
        spanColor: spanCs?.color ?? "(none)",
        spanWeight: spanCs?.fontWeight ?? "(none)",
      };
    });
    const svgs = Array.from(document.querySelectorAll("a svg")).map((s) => {
      const r = s.getBoundingClientRect();
      return { box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`, aria: s.getAttribute("aria-hidden") ?? "(none)" };
    });
    return {
      path: location.pathname,
      title: document.title,
      bodyBox: `${Math.round(br.width)}x${Math.round(br.height)}`,
      bodyBg: bcs.backgroundColor,
      bodyColor: bcs.color,
      rootTag: root?.tagName.toLowerCase() ?? "(none)",
      rootCls: rcs ? String(root?.className ?? "").slice(0, 120) : "(none)",
      rootBox: rr ? `${Math.round(rr.x)},${Math.round(rr.y)} ${Math.round(rr.width)}x${Math.round(rr.height)}` : "(none)",
      rootBg: rcs?.backgroundColor ?? "(none)",
      els: document.querySelectorAll("body *").length,
      chrome: {
        nav: document.querySelectorAll("nav").length,
        aside: document.querySelectorAll("aside").length,
        header: document.querySelectorAll("header").length,
        footer: document.querySelectorAll("footer").length,
        main: document.querySelectorAll("main").length,
      },
      h1: h1?.textContent?.trim() ?? "(none)",
      h1Box: hr ? `${Math.round(hr.x)},${Math.round(hr.y)} ${Math.round(hr.width)}x${Math.round(hr.height)}` : "(none)",
      h1Color: h1cs?.color ?? "(none)",
      h1Size: h1cs?.fontSize ?? "(none)",
      h1Weight: h1cs?.fontWeight ?? "(none)",
      h2s,
      ps,
      anchors,
      svgs,
    };
  });
  console.log(`\n=== ${label} ${path} 404 INTERIOR:`);
  console.log(
    `  title="${census.title}" body=${census.bodyBox} bg=${census.bodyBg} root=${census.rootTag} cls="${census.rootCls}" box=${census.rootBox} bg=${census.rootBg} els=${census.els}`,
  );
  console.log(
    `  chrome: nav=${census.chrome.nav} aside=${census.chrome.aside} header=${census.chrome.header} footer=${census.chrome.footer} main=${census.chrome.main}`,
  );
  console.log(
    `  h1="${census.h1}" box=${census.h1Box} color=${census.h1Color} size=${census.h1Size} weight=${census.h1Weight}`,
  );
  census.h2s.forEach((h) => console.log(`  h2 "${h.text}" box=${h.box} color=${h.color} size=${h.size} weight=${h.weight}`));
  census.ps.forEach((p) => console.log(`  p "${p.text}" box=${p.box} color=${p.color} size=${p.size} spanColor=${p.spanColor} spanWeight=${p.spanWeight}`));
  console.log(`  anchors(${census.anchors.length}):`);
  for (const a of census.anchors) {
    console.log(
      `    "${a.text}" href=${a.href} target=${a.target} rel=${a.rel} box=${a.box} color=${a.color} bg=${a.bg} weight=${a.weight} size=${a.size} border=${a.border} radius=${a.radius} shadow=[${a.shadow}] deco=${a.deco}`,
    );
  }
  census.svgs.forEach((s) => console.log(`    svg box=${s.box} aria-hidden=${s.aria}`));
}

/** LEG-3 — the REAL keyboard Tab drive through the ANON 404: the stop
 * inventory + the REAL :focus-visible faces. Tab from body, capture up to
 * 12 stops (the 404 is a 1-link surface), decode the Go Home focus face. */
async function probeTabChain(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  path: string,
): Promise<void> {
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
          shadow: cs.boxShadow.slice(0, 120),
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
  console.log(`\n=== ${label} ${path} REAL TAB CHAIN (${stops.length} stops):`);
  stops.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  console.log(`  FOCUS-VISIBLE faces:`);
  faces.forEach((f) => console.log(`    ${f}`));
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-194] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    // LEG-1 — the authenticated standing re-checks (the s162 guarded form)
    const state = await preflightPairState(browser);
    console.log("[discover-194] pair state: ready (the s162 guarded form)");
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

      console.log(`\n########## LEG-2a 404 AUTHENTICATED ${label} ##########`);
      await probe404Interior(page, base, label, "/zzz-discover-194").catch((e) => console.log(`  [404auth ${label}] ERROR: ${e}`));
      await ctx.close();
    }

    // LEG-2b — the ANON 404 at BOTH apps (fresh contexts, no storageState)
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      console.log(`\n########## LEG-2b 404 ANON ${label} ##########`);
      await probe404Interior(page, base, label, "/zzz-discover-194").catch((e) => console.log(`  [404anon ${label}] ERROR: ${e}`));
      console.log(`\n########## LEG-2c 404 CAPITAL-AUTH ANON ${label} ##########`);
      await probe404Interior(page, base, label, "/Login").catch((e) => console.log(`  [404cap ${label}] ERROR: ${e}`));
      console.log(`\n########## LEG-3 REAL TAB DRIVE ANON-404 ${label} ##########`);
      await probeTabChain(page, base, label, "/zzz-discover-194").catch((e) => console.log(`  [tabchain ${label}] ERROR: ${e}`));
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
  console.error("[discover-194]", e);
  process.exit(1);
});

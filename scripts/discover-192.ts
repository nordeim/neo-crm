// Session-192 (discovery): THE LOGIN PAGE'S ANON-SURFACE INTERIORS + THE
// LANDING PAGE'S MARKETING ARMS probe — the s404 close's named candidates
// are all CONDITIONAL (the topbar-search dropdown the day the
// reference's own suggestions populate · the Insights + Edit-family
// dialogs the day the reference carries rows again · the dashboard
// follow-up-rows checkbox arms + the activities Completed-tab row
// actions — the data-dependent candidates stay suspended) plus the
// standing conditional gates (the fresh-bundle re-derivation the day
// probe:ref trips · the recharts 4.0 gate when 4.0 ships). probe:ref
// STABLE (46bc2d9c, this session) kills the fresh-bundle candidate;
// the registry's latest 3.10.1 (verified live) kills the recharts 4.0
// gate. This probe answers the round-shape questions BEFORE the plan:
//
//   1. THE STANDING RE-CHECKS (the discover-184..191 legs, condensed
//      one pass) — the Edit-family rows + calendar chips + the
//      topbar-search dropdown + the dashboard follow-up checkboxes +
//      the activities Completed-tab. The reference's zero-data state
//      kills every data-dependent arm again if it persists.
//   2. THE LOGIN PAGE'S ANON-SURFACE INTERIORS (the NEW candidate —
//      genuinely unwalked two-app: the e2e auth family pins OURS
//      only; the s11/s21/s79/s111 LOGIN_* pins are OURS-only source
//      pins; the sweep's /login page gate is the RESTING geometry;
//      the view machine's OPEN interiors — the signup view, the reset
//      view, the sent view — were never two-app walked). DATA-
//      INDEPENDENT: every view renders at zero data on both apps;
//      the submits are NEVER fired (the destructive-arm discipline —
//      the one exception: the reset "Send reset link" ride on a
//      guaranteed-nonexistent email, the no-enumeration 200 family,
//      write-free on both apps).
//   3. THE LANDING PAGE'S MARKETING ARMS (the NEW candidate — the
//      s143 walk33 censused the anatomy; the s155 public leg gated
//      the four-axis geometry; the INTERACTIVE arms — the FAQ
//      single-open accordion ride, the mobile disclosure menu OPEN
//      ride — were never two-app walked at the OPEN-state level).
//      DATA-INDEPENDENT: pure client state on both apps.
//
// Run: bun scripts/discover-192.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  authenticated legs ride the sweep-state storageState pair, the
//  s162 doctrine; the anon legs ride FRESH contexts.)
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

/** Leg 2 — the LOGIN anon-surface census (the NEW candidate). The
 * signin resting face + the view-machine rides. FRESH context — the
 * login page is the anon surface. The submits are never fired except
 * the reset ride on a nonexistent email (write-free, the
 * no-enumeration family). */
async function probeLogin(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  axis: number,
): Promise<void> {
  console.log(`\n=== ${label} LOGIN ANON SURFACES @${axis}x*:`);
  await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
  await page.locator("main, form, div.min-h-screen").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2500);

  // L1 — the signin resting face
  const l1 = await page.evaluate(() => {
    const card = document.querySelector("form")?.closest("div") ?? null;
    const h1 = document.querySelector("h1");
    const google = Array.from(document.querySelectorAll("button")).find((b) => /continue with google/i.test(b.textContent ?? ""));
    const forgot = Array.from(document.querySelectorAll("button, a")).find((b) => /forgot password/i.test(b.textContent ?? ""));
    const signup = Array.from(document.querySelectorAll("button, a")).find((b) => /need an account|sign up/i.test(b.textContent ?? ""));
    const inputs = Array.from(document.querySelectorAll("input")).map((i) => ({
      id: i.id || "(none)",
      type: i.type,
      ph: i.placeholder || "(none)",
    }));
    const submit = Array.from(document.querySelectorAll('button[type="submit"]')).map((b) => (b.textContent ?? "").trim());
    const active = document.activeElement;
    const face = (el: Element | null | undefined) => {
      if (!el) return null;
      const cs = getComputedStyle(el as HTMLElement);
      const r = el.getBoundingClientRect();
      return {
        box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        bg: cs.backgroundColor,
        color: cs.color,
        radius: cs.borderRadius,
      };
    };
    return {
      url: location.pathname,
      h1: h1?.textContent?.trim() ?? "(none)",
      subtitle: document.querySelector("h1 + p, h1 ~ p")?.textContent?.trim().slice(0, 30) ?? "(none)",
      google: google ? { text: (google.textContent ?? "").trim(), face: face(google) } : null,
      forgot: forgot ? (forgot.textContent ?? "").trim() : null,
      signupLink: signup ? (signup.textContent ?? "").trim().replace(/\s+/g, " ") : null,
      inputs,
      submits: submit,
      mountFocus: active ? `${active.tagName.toLowerCase()}${active.id ? "#" + active.id : ""}` : "(none)",
    };
  });
  console.log(`  [L1 signin] url=${l1.url} h1="${l1.h1}" subtitle="${l1.subtitle}"`);
  console.log(`    google: "${l1.google?.text}" box=${l1.google?.face?.box} bg=${l1.google?.face?.bg}`);
  console.log(`    forgot: "${l1.forgot}" signup: "${l1.signupLink}" mountFocus: ${l1.mountFocus}`);
  console.log(`    inputs(${l1.inputs.length}): [${l1.inputs.map((i) => `${i.id}<${i.type}:${i.ph.slice(0, 16)}>`).join(" | ")}]`);
  console.log(`    submits: [${l1.submits.join(" | ")}]`);

  // L2 — the signup view ride (the footer link click, client state only)
  const signupLink = page.locator('button:has-text("Sign up"), a:has-text("Sign up")').first();
  if (await signupLink.count()) {
    await signupLink.click();
    await page.waitForTimeout(700);
    const l2 = await page.evaluate(() => {
      const h2 = document.querySelector("h2");
      const back = Array.from(document.querySelectorAll("button")).find((b) => /back to sign in/i.test(b.textContent ?? ""));
      const inputs = Array.from(document.querySelectorAll("input")).map((i) => ({
        id: i.id || "(none)",
        type: i.type,
        ph: i.placeholder || "(none)",
      }));
      const submit = Array.from(document.querySelectorAll('button[type="submit"]')).map((b) => (b.textContent ?? "").trim());
      const google = Array.from(document.querySelectorAll("button")).find((b) => /continue with google/i.test(b.textContent ?? ""));
      const r = h2?.getBoundingClientRect();
      return {
        h2: h2?.textContent?.trim() ?? "(none)",
        h2Box: r ? `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` : "(none)",
        back: back ? (back.textContent ?? "").trim() : null,
        inputs,
        submits: submit,
        googlePresent: !!google,
      };
    });
    console.log(`  [L2 signup] h2="${l2.h2}" box=${l2.h2Box} back="${l2.back}" google=${l2.googlePresent}`);
    console.log(`    inputs(${l2.inputs.length}): [${l2.inputs.map((i) => `${i.id}<${i.type}:${i.ph.slice(0, 18)}>`).join(" | ")}]`);
    console.log(`    submits: [${l2.submits.join(" | ")}]`);
    // the back-nav round-trip
    const backBtn = page.locator('button:has-text("Back to sign in")').first();
    if (await backBtn.count()) {
      await backBtn.click();
      await page.waitForTimeout(500);
      const backH1 = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim() ?? "(none)");
      console.log(`    back-nav -> h1="${backH1}"`);
    }
  } else {
    console.log(`  [L2 signup]: TRIGGER NOT FOUND`);
  }

  // L3 — the reset view ride (the forgot link click, client state only)
  const forgotLink = page.locator('button:has-text("Forgot password?")').first();
  if (await forgotLink.count()) {
    await forgotLink.click();
    await page.waitForTimeout(700);
    const l3 = await page.evaluate(() => {
      const h2 = document.querySelector("h2");
      const back = Array.from(document.querySelectorAll("button")).find((b) => /back to sign in/i.test(b.textContent ?? ""));
      const desc = document.querySelector("h2 ~ p, h2 + p")?.textContent?.trim().slice(0, 60) ?? "(none)";
      const inputs = Array.from(document.querySelectorAll("input")).map((i) => ({
        id: i.id || "(none)",
        type: i.type,
        ph: i.placeholder || "(none)",
      }));
      const submit = Array.from(document.querySelectorAll('button[type="submit"]')).map((b) => (b.textContent ?? "").trim());
      const active = document.activeElement;
      return {
        h2: h2?.textContent?.trim() ?? "(none)",
        desc,
        back: back ? (back.textContent ?? "").trim() : null,
        inputs,
        submits: submit,
        mountFocus: active ? `${active.tagName.toLowerCase()}${active.id ? "#" + active.id : ""}` : "(none)",
      };
    });
    console.log(`  [L3 reset] h2="${l3.h2}" desc="${l3.desc}" back="${l3.back}" mountFocus=${l3.mountFocus}`);
    console.log(`    inputs(${l3.inputs.length}): [${l3.inputs.map((i) => `${i.id}<${i.type}:${i.ph.slice(0, 18)}>`).join(" | ")}]`);
    console.log(`    submits: [${l3.submits.join(" | ")}]`);
    // the back-nav round-trip
    const backBtn = page.locator('button:has-text("Back to sign in")').first();
    if (await backBtn.count()) {
      await backBtn.click();
      await page.waitForTimeout(500);
      const backH1 = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim() ?? "(none)");
      console.log(`    back-nav -> h1="${backH1}"`);
    }
  } else {
    console.log(`  [L3 reset]: TRIGGER NOT FOUND`);
  }
}

/** Leg 3 — the LANDING marketing-arms census (the NEW candidate): the
 * FAQ single-open ride at the desktop axis + the mobile disclosure
 * menu OPEN ride at the phone axis. FRESH context — the landing is
 * public. Pure client state on both apps. */
async function probeLanding(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  axis: number,
): Promise<void> {
  console.log(`\n=== ${label} LANDING MARKETING ARMS @${axis}x*:`);
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.locator("header, nav").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2500);

  // M1 — the FAQ single-open ride (desktop axis only — the reference's
  // FAQ is the same construction at any width; the ride censuses the
  // default-open face, the Q2 click, the close)
  if (axis === 1440) {
    const m1 = await page.evaluate(() => {
      const faqSection = Array.from(document.querySelectorAll("section")).find((s) =>
        /questions, answered/i.test(s.querySelector("h2")?.textContent ?? ""),
      );
      if (!faqSection) return { found: false };
      const buttons = Array.from(faqSection.querySelectorAll("button"));
      const answers = Array.from(faqSection.querySelectorAll("p")).filter(
        (p) => (p.textContent ?? "").length > 40,
      );
      const openBtns = buttons.map((b) => ({
        text: (b.textContent ?? "").trim().slice(0, 34),
        ariaExpanded: b.getAttribute("aria-expanded") ?? "(none)",
      }));
      return {
        found: true,
        sectionBox: (() => {
          const r = faqSection.getBoundingClientRect();
          return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`;
        })(),
        questionCount: buttons.length,
        visibleAnswers: answers.length,
        openBtns,
      };
    });
    if (m1.found) {
      console.log(
        `  [M1 faq-rest] box=${m1.sectionBox} questions=${m1.questionCount} visibleAnswers=${m1.visibleAnswers}`,
      );
      for (const b of (m1.openBtns ?? []))
        console.log(`    q: "${b.text}" aria-expanded=${b.ariaExpanded}`);
      // the Q2 ride: click the second question, re-census
      const q2 = page.locator("section button", { hasText: "Is my data separate" }).first();
      if (await q2.count()) {
        await q2.click();
        await page.waitForTimeout(600);
        const m1b = await page.evaluate(() => {
          const faqSection = Array.from(document.querySelectorAll("section")).find((s) =>
            /questions, answered/i.test(s.querySelector("h2")?.textContent ?? ""),
          );
          if (!faqSection) return { found: false };
          const answers = Array.from(faqSection.querySelectorAll("p")).filter((p) => (p.textContent ?? "").length > 40);
          const btns = Array.from(faqSection.querySelectorAll("button")).map((b) => ({
            text: (b.textContent ?? "").trim().slice(0, 34),
            ariaExpanded: b.getAttribute("aria-expanded") ?? "(none)",
            chevronRotated: (b.querySelector("svg")?.getAttribute("class") ?? "").includes("rotate-180"),
          }));
          return { found: true, visibleAnswers: answers.length, answersText: answers.map((a) => (a.textContent ?? "").trim().slice(0, 30)), btns };
        });
        console.log(`  [M1 faq-q2-open] visibleAnswers=${m1b.visibleAnswers}`);
        for (const a of m1b.answersText ?? []) console.log(`    open answer: "${a}"`);
        for (const b of m1b.btns ?? [])
          console.log(`    q: "${b.text}" aria=${b.ariaExpanded} chevron180=${b.chevronRotated}`);
      } else {
        console.log(`  [M1 faq-q2]: Q2 TRIGGER NOT FOUND`);
      }
    } else {
      console.log(`  [M1 faq]: SECTION NOT FOUND`);
    }
  }

  // M2 — the mobile disclosure menu ride (phone axis only)
  if (axis === 390) {
    const m2rest = await page.evaluate(() => {
      const menuBtn = Array.from(document.querySelectorAll("header button")).find((b) =>
        /toggle navigation/i.test(b.getAttribute("aria-label") ?? "") || /menu/i.test(b.getAttribute("aria-label") ?? ""),
      );
      if (!menuBtn) return { found: false };
      const r = menuBtn.getBoundingClientRect();
      return {
        found: true,
        box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        ariaExpanded: menuBtn.getAttribute("aria-expanded") ?? "(none)",
        ariaLabel: menuBtn.getAttribute("aria-label") ?? "(none)",
      };
    });
    if (!m2rest.found) {
      console.log(`  [M2 hamburger]: NOT FOUND`);
      return;
    }
    console.log(`  [M2 hamburger] box=${m2rest.box} aria="${m2rest.ariaLabel}" aria-expanded=${m2rest.ariaExpanded}`);
    const menuBtn = page
      .locator("header button", { hasText: "" })
      .filter({ has: page.locator("svg") })
      .last();
    const ariaBtn = page.locator('header button[aria-label="Toggle navigation"]').first();
    const target = (await ariaBtn.count()) ? ariaBtn : menuBtn;
    if (!(await target.count())) {
      console.log(`  [M2 hamburger]: CLICK TARGET NOT FOUND`);
      return;
    }
    await target.click();
    await page.waitForTimeout(700);
    const m2open = await page.evaluate(() => {
      const panel = document.querySelector("header div.md\\:hidden") ?? null;
      const links = panel ? Array.from(panel.querySelectorAll("a")).map((a) => (a.textContent ?? "").trim()) : [];
      const r = panel?.getBoundingClientRect();
      return {
        panelOpen: !!panel,
        panelBox: r ? `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` : "(none)",
        links,
        iconSwapped: !!document.querySelector("header button svg.lucide-x"),
      };
    });
    console.log(`  [M2 open] panelOpen=${m2open.panelOpen} box=${m2open.panelBox} iconSwapped=${m2open.iconSwapped}`);
    console.log(`    links(${m2open.links.length}): [${m2open.links.join(" | ")}]`);
    // the close: click the toggle again (the icon-swap construction)
    await target.click();
    await page.waitForTimeout(500);
    const m2closed = await page.evaluate(() => !document.querySelector("header div.md\\:hidden"));
    console.log(`  [M2 re-toggle] panelClosed=${m2closed}`);
  }
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-192] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    // LEG 1 — the standing re-checks (the authenticated pair state)
    const state = await preflightPairState(browser);
    console.log("[discover-192] pair state: ready (the s162 guarded form)");
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
      await ctx.close();
    }

    // LEG 2+3 — the anon legs (FRESH contexts, no storageState)
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      for (const axis of [1440, 390] as const) {
        const ctx = await browser.newContext({ viewport: { width: axis, height: axis === 1440 ? 900 : 844 } });
        const page = await ctx.newPage();
        console.log(`\n########## LEG-2/3 ANON ${label} @${axis} ##########`);
        await probeLogin(page, base, label, axis).catch((e) => console.log(`  [login ${label}@${axis}] ERROR: ${e}`));
        await probeLanding(page, base, label, axis).catch((e) => console.log(`  [landing ${label}@${axis}] ERROR: ${e}`));
        await ctx.close();
      }
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
  console.error("[discover-192]", e);
  process.exit(1);
});

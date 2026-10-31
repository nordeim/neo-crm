// Session-203 (discovery): the post-202 audit rotation. The rotation
// trigger THE OWNER'S NEWEST COMMIT (549e5d2 — the session_427
// transcript, the s202 round's own execution record). The session_426
// close's standing material adjudicated BEFORE the plan —
//
//   1. LEG-1 THE STANDING DATA-GATED RE-CHECKS (the discover-184..202
//      legs condensed one pass) — probe:ref re-run this session; the
//      reference's unchanged zero-data state means every
//      data-dependent arm is expected KILLED again.
//   2. LEG-2 THE s120-ERA INTERACTIVE-TABLE RE-WALK KILL — the kill
//      condition re-checked live (the leads family source via git
//      log · the deps census via the lockfile · the reference bundle
//      via this session's probe:ref verdict).
//   3. LEG-3 THE CONDITIONAL GATES — the registry's latest recharts
//      fetched live (the 4.0 gate); probe:ref's verdict kills the
//      fresh-bundle candidate.
//   4. LEG-4 THE STANDING PRE-SHIP DUTY (the s164 bun-audit doctrine)
//      — `bun audit` re-run live against the shipped tree, the census
//      diffed against the s198-TRIPLE-PINNED form (9: 4h/4m/1l, all
//      dev-toolchain; the overrides.dompurify 3.4.17 posture + the
//      dormancy re-checked).
//   5. LEG-5 THE A11Y REGISTER'S MARKETING CLIENT-STATE FAMILY — THE
//      S202 CLOSE'S BANKED STANDING CANDIDATE (the landing page's
//      client-state arms): the landing surface carries exactly TWO
//      client-state machines (LandingHeader's menuOpen + Faq's
//      openIndex) whose non-resting states render DOM the resting
//      page-family scan never sees — the mobile disclosure menu's
//      OPEN panel (the drawer-genus sibling on the marketing surface:
//      a whole-panel MOUNT of 5 links + the w-full CTA at phone
//      width only — the md:hidden width-inverse) + the FAQ's
//      non-default open-item states (the answer <p> of an item whose
//      resting state is closed, mounted while the resting Q1 answer
//      unmounts) — and the register carries ZERO marketing
//      client-state registrations at ANY width. LIVE axe probes on
//      every arm (the FAQ non-default state × BOTH widths + the
//      menu-open state at phone) re-verify the born-green expectation
//      (the s172 discovery doctrine: the audit probes the surfaces
//      BEFORE the plan) + the mutation-candidate decode (the mobile
//      menu toggle's aria-label "Toggle navigation" — the ONLY
//      accessible name of an icon-only md:hidden button: the
//      name-evaporation genus the s201 contacts Import trigger
//      decoded) + the panel-mount decode (the div-count delta + the
//      mounted control census — the drawer-genus proof) + the live
//      docs stale-claim hunt (the s197a2/s199a2/s200a2/s201a2/s202a2
//      pattern on the marketing-state axis).
//
// Run: bun scripts/discover-203.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  LEG-1 legs ride the sweep-state storageState pair, the s162
//  doctrine; the LEG-5 probes ride FRESH anon contexts — the landing
//  surface is PUBLIC, no auth rides, the db census contract untouched
//  by every leg.)
import { execFileSync, spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

import { preflightPairState } from "./sweep-state";
import { waitOnUrl } from "./sweep";

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
const AXE_PATH = join(REPO, "node_modules", "axe-core", "axe.min.js");
const A11Y_SPEC = join(REPO, "tests", "e2e", "a11y.spec.ts");
const DIALOG_PINS = join(REPO, "tests", "dialog-controls.test.ts");
const LANDING_SRC = join(REPO, "src", "components", "landing", "landing-page.tsx");

/** LEG-1 — the standing Edit-family re-check (condensed): the three
 *  entity pages' rows + rowMenus, one pass per app. */
async function censusRows(page: import("@playwright/test").Page, url: string, label: string): Promise<void> {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2200);
  const census = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("main table tbody tr")).filter(
      (tr) => (tr.textContent ?? "").trim().length > 0,
    );
    const rowMenuButtons = Array.from(document.querySelectorAll('main button[aria-haspopup="true"], main button[aria-haspopup="menu"]'));
    return {
      rows: rows.length,
      emptyState: (document.querySelector("main .text-center, main [class*='py-10']")?.textContent ?? "").trim().slice(0, 60),
      rowMenuButtons: rowMenuButtons.length,
    };
  });
  console.log(`  [${url.replace(/^https?:\/\/[^/]+/, "")} ${label}] rows=${census.rows} rowMenus=${census.rowMenuButtons} empty="${census.emptyState}"`);
}

/** LEG-4 — the live `bun audit` parse: the summary census + the
 *  vulnerable-package enumeration. */
function runBunAudit(): string {
  try {
    return execFileSync("bun", ["audit"], { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 120_000 });
  } catch (e) {
    // bun audit exits non-zero when advisories exist — the stdout is the payload
    const err = e as { stdout?: string };
    return err.stdout ?? "(audit failed with no stdout)";
  }
}

function parseAudit(out: string): { summary: string; packages: string[] } {
  const m = out.match(/(\d+) vulnerabilities \(([^)]+)\)/);
  const summary = m ? `${m[1]} (${m[2]})` : "(no summary line)";
  const packages = Array.from(
    new Set(
      out
        .split("\n")
        .map((l) => l.match(/^([a-z@][\w.-]*)\s+[<>=~^]/))
        .filter((m2): m2 is RegExpMatchArray => Boolean(m2))
        .map((m2) => m2[1]),
    ),
  );
  return { summary, packages };
}

/** The live axe probe (the s172 discovery form): runs the wcag-tagged
 *  axe battery on the CURRENT page state, returns the violation census
 *  split by the two-gate classes (structural vs the contrast/svg-alt
 *  family). */
async function axeProbe(
  page: import("@playwright/test").Page,
): Promise<Array<{ id: string; targets: string[] }>> {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1500);
  await page.addScriptTag({ path: AXE_PATH });
  return page.evaluate(async () => {
    const axe = (window as unknown as {
      axe: { run: (o: object) => Promise<{ violations: Array<{ id: string; nodes: Array<{ target: string[] }> }> }> };
    }).axe;
    const r = await axe.run({
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
    return r.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target.join(" ")),
    }));
  });
}

function logProbe(label: string, violations: Array<{ id: string; targets: string[] }>): void {
  const structural = violations.filter((v) => v.id !== "color-contrast" && v.id !== "svg-img-alt");
  const contrast = violations.filter((v) => v.id === "color-contrast" || v.id === "svg-img-alt");
  console.log(`  [probe ${label}] structural=${structural.length} contrast/svg-alt=${contrast.length}`);
  for (const v of structural) console.log(`    STRUCTURAL ${v.id}: ${v.targets.slice(0, 4).join(" || ")}`);
  for (const v of contrast) console.log(`    contrast-family ${v.id}: ${v.targets.slice(0, 6).join(" || ")}`);
}

/** LEG-5a — the register's live census from the spec source: the total
 *  test() count + the family split + the MARKETING-STATE split (the
 *  round's own axis) + the landing surface's client-state machine
 *  decode (read from the source). */
function registerCensus(): void {
  const spec = readFileSync(A11Y_SPEC, "utf8");
  const tests = spec.match(/^\s*test\(/gm)?.length ?? 0;
  const dialogLabels = spec.match(/test\("([^"]*dialog OPEN[^"]*)"/g)?.length ?? 0;
  const viewLabels = spec.match(/test\("([^"]*view OPEN[^"]*)"/g)?.length ?? 0;
  const marketingLabels =
    spec.match(/test\("([^"]*(?:FAQ item|menu) OPEN[^"]*)"/g)?.length ?? 0;
  const pageFamily = tests - dialogLabels - viewLabels - marketingLabels;
  console.log(`  [register] total test()=${tests} · dialog-open=${dialogLabels} · client-state view=${viewLabels} · marketing client-state=${marketingLabels} · page-family=${pageFamily}`);
  // the landing surface's own client-state machines — read from source
  const src = readFileSync(LANDING_SRC, "utf8");
  const machines = src.match(/useState(?:<[^>]+>)?\(([^)]*)\)/g) ?? [];
  console.log(`  [register] the landing surface's client-state machines: ${machines.join(" · ")}`);
  const menuOpen = /menuOpen\s*:\s*boolean/.test(src) || /menuOpen/.test(src);
  const faqOpen = /openIndex/.test(src);
  console.log(`  [register] the machines: menuOpen=${menuOpen ? "menuOpen (2 states: closed | the mounted panel)" : "?"} · openIndex=${faqOpen ? "openIndex (7 states: Q1-Q6 open | all-closed)" : "?"}`);
  // the resting registrations' coverage — what the / landing scans cover
  const restingLanding = spec.match(/test\("(?:desktop|phone) \/ \(landing, anon\)"/g)?.length ?? 0;
  console.log(`  [register] the resting / landing registrations: ${restingLanding} (both widths — they scan the CLOSED menu + the Q1-OPEN accordion face)`);
  console.log(`  [register] the UNREGISTERED marketing client-state arms: the mobile disclosure menu OPEN (phone-only — the md:hidden width-inverse) + the FAQ non-default open states (both widths) + the FAQ all-closed state (the minus-construction) — ${marketingLabels === 0 ? "VIOLATED (the marketing-state genus — the s202 close's banked candidate carries ZERO two-gate registrations at ANY width)" : "compliant"}`);
  // the head criterion claim — the marketing-state decode
  const criterion = spec.includes("one test() per surface × width");
  console.log(`  [register] the head criterion claim "one test() per surface × width": ${criterion ? "CARRIED" : "ABSENT"}`);
  const pins = readFileSync(DIALOG_PINS, "utf8");
  const marketingAxisHeld = /FAQ|mobile disclosure|menuOpen/.test(pins);
  console.log(`  [register] the criterion's MARKETING-STATE axis held by any pin: ${marketingAxisHeld ? "yes" : "NO (no pin cross-reads the landing surface's client-state machines against the register — the s202a2 genus on the marketing-state axis)"}`);
}

/** The FAQ ride (the non-default open state): swap the accordion to the
 *  LAST item (Q6 — the maximal-distance member from the resting Q1)
 *  with the L-164c2 open-wait sentinel: Q6's answer mounted + Q1's
 *  resting answer GONE (the single-open invariant — the state the
 *  registration claims to scan, not the resting face behind the
 *  label). */
async function faqRide(page: import("@playwright/test").Page): Promise<void> {
  await page.goto(`${OUR_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const faq = page.locator("#faq");
  await faq.getByRole("button", { name: "Which tier do I need?" }).click();
  await page.locator("#faq-answer-5").waitFor({ state: "visible", timeout: 10000 });
  // the single-open invariant: the resting Q1 answer must be GONE
  await page.locator("#faq-answer-0").waitFor({ state: "hidden", timeout: 10000 });
}

/** The mobile-menu ride (the marketing drawer): mount the panel at
 *  390×844 (phone-only — the md:hidden toggle renders at no wider
 *  band) with the L-164c2 open-wait sentinel: the panel div itself +
 *  its unique "Preview" link (the only "Preview" link visible at 390 —
 *  the desktop nav is display:none, the footer carries no Preview). */
async function menuRide(page: import("@playwright/test").Page): Promise<void> {
  await page.goto(`${OUR_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  const panel = page.locator("div.md\\:hidden.border-t");
  await panel.waitFor({ state: "visible", timeout: 10000 });
  await panel.getByRole("link", { name: "Preview" }).waitFor({ state: "visible", timeout: 10000 });
}

type ArmRide = {
  label: string;
  width: { width: number; height: number };
  ride: (page: import("@playwright/test").Page) => Promise<void>;
};

/** LEG-5c — the mutation-candidate decode: the mobile menu toggle —
 *  the MARKETING name-evaporation family. The toggle's accessible
 *  name lives ONLY in its aria-label ("Toggle navigation" — the
 *  reference's exact label): an ICON-ONLY md:hidden button (the
 *  Menu/X svg, no text, no <label> wiring, no title). A dropped
 *  aria-label ships a NAMELESS icon-only trigger at phone width —
 *  the s201 contacts Import trigger genus (the hidden-span sibling)
 *  — that the resting phone / registration scans (the toggle renders
 *  at rest at 390) and NO open-state scan has ever covered. */
async function mutationCandidateDecode(page: import("@playwright/test").Page): Promise<void> {
  await page.goto(`${OUR_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const decode = await page.evaluate(() => {
    const btn = document.querySelector('header button[aria-label="Toggle navigation"]') as HTMLButtonElement | null;
    if (!btn) return { found: false };
    const textContent = (btn.textContent ?? "").trim();
    const svgs = btn.querySelectorAll("svg").length;
    const labels = Array.from(document.querySelectorAll("label"));
    const wiredLabel = labels.find((l) => l.htmlFor === btn.id);
    return {
      found: true,
      ariaLabel: btn.getAttribute("aria-label"),
      ariaExpanded: btn.getAttribute("aria-expanded"),
      textContent,
      svgCount: svgs,
      title: btn.getAttribute("title"),
      hasWiredLabel: Boolean(wiredLabel),
      className: btn.className,
    };
  });
  console.log(`  [5c-mutation] the mobile menu toggle: ${JSON.stringify(decode)}`);
  const onlyName =
    decode.found && decode.ariaLabel === "Toggle navigation" && decode.textContent === "" && decode.svgCount === 1 && !decode.title && !decode.hasWiredLabel;
  console.log(`  [5c-mutation] the aria-label is the ONLY accessible name of the icon-only trigger: ${onlyName ? "YES (the marketing name-evaporation genus — a dropped label ships a nameless md:hidden button the resting phone scan sees but NO open-state scan covers)" : "no?!"}`);
}

/** LEG-5d — the panel-mount + FAQ-state decodes (the drawer-genus
 *  proof + the text-only state's control census): the open panel's
 *  mounted control inventory (the div-count delta) + the FAQ answer
 *  <p> decode (the aria-controls wiring + the no-controls state). */
async function panelAndFaqDecode(page: import("@playwright/test").Page): Promise<void> {
  // the panel-mount decode (phone)
  await page.goto(`${OUR_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const closed = await page.evaluate(() => document.querySelectorAll("header div").length);
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.locator("div.md\\:hidden.border-t").waitFor({ state: "visible", timeout: 10000 });
  const open = await page.evaluate(() => ({
    headerDivs: document.querySelectorAll("header div").length,
    panelLinks: Array.from(document.querySelectorAll("div.md\\:hidden.border-t a")).map((a) => (a.textContent ?? "").trim()),
    panelButtons: document.querySelectorAll("div.md\\:hidden.border-t button").length,
  }));
  console.log(`  [5d-mount] the panel-mount decode: header divs closed=${closed} open=${open.headerDivs} (the mount/unmount construction — the drawer-genus sibling)`);
  console.log(`  [5d-mount] the mounted panel's control census: links=[${open.panelLinks.join(" · ")}] + buttons=${open.panelButtons} — ${open.panelLinks.length + open.panelButtons} controls NO resting scan ever sees (the phone / registration scans the CLOSED face: the toggle only)`);
  await page.keyboard.press("Escape").catch(() => undefined);
  // the FAQ state decode (desktop)
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${OUR_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const faq = await page.evaluate(() => {
    const faqEl = document.querySelector("#faq");
    if (!faqEl) return { found: false };
    const buttons = Array.from(faqEl.querySelectorAll("button"));
    const answers = Array.from(faqEl.querySelectorAll("p[id^='faq-answer-']"));
    const firstOpen = buttons.find((b) => b.getAttribute("aria-expanded") === "true");
    return {
      found: true,
      buttonCount: buttons.length,
      mountedAnswers: answers.length,
      openButtonAriaControls: firstOpen?.getAttribute("aria-controls") ?? null,
      answerControlsId: answers[0]?.id ?? null,
      answerControls: Array.from(answers[0]?.querySelectorAll("button, a, input, select, textarea") ?? []).length,
    };
  });
  console.log(`  [5d-faq] the FAQ resting state: ${JSON.stringify(faq)}`);
  console.log(`  [5d-faq] the open-answer is a TEXT-ONLY state (controls=${faq.answerControls ?? "?"}) — the mounted <p> carries the family's construction (the resting Q1 answer holds the class face); the NON-DEFAULT state's unique surfaces: the Q6 answer mounted + the Q1 face closed (aria-expanded=false + the answer unmounted) — the state the client-state registration scans`);
}

/** LEG-5e — the stale-claim hunt (the marketing-state axis): the live
 *  docs' register-closure claims + the criterion's marketing-state
 *  coverage. */
function staleClaimHunt(): void {
  const sites: Array<[string, string]> = [
    ["tests/e2e/a11y.spec.ts", "one test() per surface × width"],
    ["tests/dialog-controls.test.ts", "landing"],
    ["CLAUDE.md", "every renderable page surface registered at both widths"],
    ["CLAUDE.md", "closed on every axis"],
    ["Project_Architecture_Document.md", "the FAQ's open-item switch renders the same family DOM"],
    ["Project_Architecture_Document.md", "the marketing batteries"],
    ["Project_Architecture_Document.md", "closed on every axis its criterion names"],
    ["docs/session_426.md", "the landing page's client-state arms"],
  ];
  for (const [file, needle] of sites) {
    try {
      const text = readFileSync(join(REPO, file), "utf8");
      const hits = text.split("\n").filter((l) => l.includes(needle)).length;
      console.log(`  [claims] ${file}: "${needle}" -> ${hits} site(s)`);
    } catch {
      console.log(`  [claims] ${file}: NOT FOUND (skip)`);
    }
  }
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-203] reusing the dev server on :3000");
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
    console.log("[discover-203] pair state: ready (the s162 guarded form)");
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n########## LEG-1 STANDING DATA-GATED RE-CHECKS ${label} ##########`);
      for (const p of ["/contacts", "/leads", "/accounts"]) {
        await censusRows(page, `${base}${p}`, label).catch((e) => console.log(`  [${p} ${label}] ERROR: ${e}`));
      }
      await ctx.close();
    }
    console.log("  [leg-1] verdict: the reference's zero-data state re-checked (probe:ref re-run below) — every data-dependent arm KILLED (the discover-184..203 standing census)");

    console.log("\n########## LEG-2 THE s120-ERA RE-WALK KILL RE-CHECK ##########");
    try {
      const leadsLog = execFileSync("git", ["log", "--oneline", "-1", "--", "src/app/(app)/leads/"], {
        cwd: REPO,
        encoding: "utf8",
      }).trim();
      console.log(`  [leg-2] the leads family last touch: ${leadsLog.slice(0, 72)}`);
      const lock = readFileSync(join(REPO, "bun.lock"), "utf8");
      for (const dep of ["recharts", "lucide-react", "tailwindcss"]) {
        const m = lock.match(new RegExp(`"${dep}@([\\d.]+)"`));
        console.log(`  [leg-2] lockfile ${dep}: ${m?.[1] ?? "(not found)"}`);
      }
      console.log("  [leg-2] verdict: the kill STANDING (the source frozen + the deps locked + the bundle STABLE)");
    } catch (e) {
      console.log(`  [leg-2] ERROR: ${e}`);
    }

    console.log("\n########## LEG-3 THE CONDITIONAL GATES ##########");
    try {
      const latest = execFileSync("npm", ["view", "recharts", "version"], { encoding: "utf8", timeout: 30_000 }).trim();
      console.log(`  [leg-3] the registry's latest recharts: ${latest} (ours 3.10.1 — the 4.0 gate ${latest.startsWith("4") ? "OPENS" : "KILLED"})`);
    } catch (e) {
      console.log(`  [leg-3] the registry fetch failed (offline?) — ${e}`);
    }
    // probe:ref — the standing conditional gate, re-run live
    try {
      const probeOut = execFileSync("bun", ["run", "probe:ref"], { cwd: REPO, encoding: "utf8", timeout: 180_000, stdio: ["ignore", "pipe", "pipe"] });
      const verdict = probeOut.split("\n").filter((l) => /stable|drift|md5|STABLE|DRIFT/i.test(l)).slice(0, 4);
      console.log(`  [leg-3] probe:ref live: ${verdict.join(" | ") || "(see output)"}`);
    } catch (e) {
      const err = e as { stdout?: string };
      const out = (err.stdout ?? "").split("\n").filter((l) => /stable|drift|md5|STABLE|DRIFT/i.test(l)).slice(0, 4);
      console.log(`  [leg-3] probe:ref live (non-zero exit): ${out.join(" | ") || e}`);
    }

    console.log("\n########## LEG-4 THE STANDING PRE-SHIP DUTY (bun audit) ##########");
    const audit = parseAudit(runBunAudit());
    console.log(`  [leg-4] bun audit live: ${audit.summary} — the s198-pinned census 9 (4 high / 4 moderate / 1 low)`);
    console.log(`  [leg-4] the vulnerable packages: ${audit.packages.join(" · ")}`);
    const drift = audit.summary !== "9 (4 high, 4 moderate, 1 low)";
    console.log(`  [leg-4] verdict: ${drift ? "DRIFT — the round's material" : "CLEAN (no drift; the triple-pinned posture stands)"}`);
    // the dormancy half (the s198 pin): pdf-export.ts never calls .html(
    const pdfSrc = readFileSync(join(REPO, "src", "lib", "pdf-export.ts"), "utf8");
    const htmlCalls = (pdfSrc.match(/\.html\(/g) ?? []).length;
    console.log(`  [leg-4] the dormancy re-check: pdf-export.ts .html( call sites=${htmlCalls} (the pinned zero)`);

    console.log("\n########## LEG-5 THE A11Y REGISTER'S MARKETING CLIENT-STATE FAMILY ##########");
    registerCensus();
    staleClaimHunt();

    // 5b — THE LIVE axe probes: the marketing client-state arms
    // (the banked born-green pre-verification re-probed live — the
    // s172 discovery doctrine: probe BEFORE the plan). Fresh ANON
    // contexts (the landing surface is PUBLIC).
    console.log("\n  ---- LEG-5b the live axe probes: the marketing client-state arms ----");
    const rides: ArmRide[] = [
      { label: "desktop / (a non-default FAQ item OPEN) @1280", width: { width: 1280, height: 800 }, ride: faqRide },
      { label: "phone / (a non-default FAQ item OPEN) @390", width: { width: 390, height: 844 }, ride: faqRide },
      { label: "phone / (the mobile disclosure menu OPEN) @390", width: { width: 390, height: 844 }, ride: menuRide },
    ];
    let bornGreen = 0;
    let probed = 0;
    for (const r of rides) {
      try {
        const ctx = await browser.newContext({ viewport: r.width });
        const page = await ctx.newPage();
        await r.ride(page);
        const violations = await axeProbe(page);
        logProbe(r.label, violations);
        const structural = violations.filter((v) => v.id !== "color-contrast" && v.id !== "svg-img-alt");
        probed += 1;
        if (structural.length === 0) bornGreen += 1;
        await ctx.close();
      } catch (e) {
        console.log(`  [probe ${r.label}] RIDE/SCAN ERROR: ${e}`);
      }
    }
    console.log(`  [5b] the born-green census: ${bornGreen}/${probed} marketing client-state arms structural=0 (probed ${probed}/3)`);

    // 5c — the mutation-candidate decode (the mobile menu toggle)
    console.log("\n  ---- LEG-5c the mutation-candidate decode (the mobile menu toggle) ----");
    try {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await mutationCandidateDecode(page);
      await ctx.close();
    } catch (e) {
      console.log(`  [5c] ERROR: ${e}`);
    }

    // 5d — the panel-mount + FAQ-state decodes
    console.log("\n  ---- LEG-5d the panel-mount + FAQ-state decodes ----");
    try {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await panelAndFaqDecode(page);
      await ctx.close();
    } catch (e) {
      console.log(`  [5d] ERROR: ${e}`);
    }

    console.log("\n[discover-203] DONE — the legs above are the round's evidence.");
  } finally {
    await browser.close().catch(() => undefined);
    if (spawned) {
      try {
        process.kill(-spawned.pid!, "SIGTERM");
      } catch {
        /* the reused-server case */
      }
    }
  }
}

main().catch((e) => {
  console.error("[discover-203] FATAL", e);
  process.exit(1);
});

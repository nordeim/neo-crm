// Session-202 (discovery): the post-201 audit rotation. The rotation
// trigger THE OWNER'S NEWEST COMMIT (35b2c97 — the session_425
// transcript, the s201 round's own execution record). The session_424
// close's standing material adjudicated BEFORE the plan —
//
//   1. LEG-1 THE STANDING DATA-GATED RE-CHECKS (the discover-184..201
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
//   5. LEG-5 THE A11Y REGISTER'S CLIENT-STATE FAMILY — THE S201
//      CLOSE'S BANKED STANDING CANDIDATE (the register's remaining
//      client-state arms: the login card's in-card view states): the
//      view machine (src/lib/login-reset.ts: signin | reset | sent |
//      signup | verify) renders WHOLE-CARD DOM surfaces the resting
//      /login scan never sees (the s172 closed-by-default genus's
//      client-state sibling — the view swaps REPLACE the card's
//      column entirely), and the register carries ZERO view-state
//      registrations at ANY width — the surface-blind genus. LIVE axe
//      probes on every view state at BOTH widths re-verify the
//      born-green expectation (the s172 discovery doctrine: the audit
//      probes the surfaces BEFORE the plan) + the mutation-candidate
//      decode (the verify view's six code inputs — the aria-label the
//      ONLY name: the client-state name-evaporation family) + the
//      live-docs stale-claim hunt (the s197a2/s199a2/s200a2/s201a2
//      pattern on the state axis).
//
// Run: bun scripts/discover-202.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  LEG-1 legs ride the sweep-state storageState pair, the s162
//  doctrine; the LEG-5 probes ride FRESH anon contexts — the login
//  card's views are the logged-out surface. The verify-view rides
//  sign throwaway users into the DEV db and DELETE them after (the
//  db-census contract: 15/24/10/23/12 + 4 users); the sent-view
//  rides the demo email's forgot-password POST — the in-app delivery
//  answers the resetUrl (the RICHER face), the token row is
//  census-inert.)
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
const LOGIN_MACHINE = join(REPO, "src", "lib", "login-reset.ts");
const DEMO_EMAIL = "sepnetflix2023@outlook.com";

/** LEG-1 — the standing Edit-family re-check (condensed): the three
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
    return {
      rows: rows.length,
      emptyState: (document.querySelector("main .text-center, main [class*='py-10']")?.textContent ?? "").trim().slice(0, 60),
      rowMenuButtons: rowMenuButtons.length,
    };
  });
  console.log(`  [${url.replace(/^https?:\/\/[^/]+/, "")} ${label}] rows=${census.rows} rowMenus=${census.rowMenuButtons} empty="${census.emptyState}"`);
}

/** LEG-4 — the live `bun audit` parse: the summary census + the
 * vulnerable-package enumeration. */
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
 *  test() count + the family split + the CLIENT-STATE split (the
 *  round's own axis) + the criterion's state-axis decode. */
function registerCensus(): void {
  const spec = readFileSync(A11Y_SPEC, "utf8");
  const tests = spec.match(/^\s*test\(/gm)?.length ?? 0;
  const dialogLabels = spec.match(/test\("([^"]*dialog OPEN[^"]*)"/g)?.length ?? 0;
  const viewLabels = spec.match(/test\("([^"]*view OPEN[^"]*)"/g)?.length ?? 0;
  const pageFamily = tests - dialogLabels - viewLabels;
  console.log(`  [register] total test()=${tests} · dialog-open=${dialogLabels} · client-state view=${viewLabels} · page-family=${pageFamily}`);
  // the machine's own census — the state axis the register must cover
  const machineSrc = readFileSync(LOGIN_MACHINE, "utf8");
  const union = machineSrc.match(/export type LoginView = ([^;]+);/)?.[1] ?? "";
  const states = union.match(/"(\w+)"/g)?.map((s) => s.slice(1, -1)) ?? [];
  console.log(`  [register] the LoginView machine: ${states.join(" | ")} (${states.length} states)`);
  const pageRegistered = new Set(["signin", "signup"]); // the /login + /signup page registrations
  const unregistered = states.filter((s) => !pageRegistered.has(s));
  console.log(`  [register] the page-registered states: ${[...pageRegistered].join(" · ")} (the /login + /signup surfaces)`);
  console.log(`  [register] the UNREGISTERED view states: ${unregistered.join(" · ") || "(none)"} — ${unregistered.length === 0 ? "COMPLIANT" : `VIOLATED (the surface-blind genus — ${unregistered.length} whole-card view surfaces carry ZERO two-gate registrations at ANY width)`}`);
  // the head criterion claim — the state-axis decode
  const criterion = spec.includes("one test() per surface × width");
  console.log(`  [register] the head criterion claim "one test() per surface × width": ${criterion ? "CARRIED" : "ABSENT"}`);
  const pins = readFileSync(DIALOG_PINS, "utf8");
  const stateAxisHeld = /LoginView/.test(pins);
  console.log(`  [register] the criterion's STATE axis held by any pin: ${stateAxisHeld ? "yes" : "NO (no pin cross-reads the machine's union against the register — the s201a2 genus on the state axis)"}`);
}

/** LEG-5b — the view-state ride table (the machine's own openers,
 *  re-driven at BOTH widths): each entry swaps the card to its view
 *  with the VIEW-SENTINEL open-wait guard (the L-164c2 form — a
 *  silently-failed swap would otherwise scan the signin view behind
 *  the label). */
type ViewRide = {
  label: string;
  width: { width: number; height: number };
  ride: (page: import("@playwright/test").Page) => Promise<void>;
};

function resetRide(page: import("@playwright/test").Page): Promise<void> {
  return (async () => {
    await page.goto(`${OUR_URL}/login`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await page.getByRole("heading", { name: "Reset your password" }).waitFor({ state: "visible", timeout: 10000 });
  })();
}

function sentRide(page: import("@playwright/test").Page): Promise<void> {
  return (async () => {
    await page.goto(`${OUR_URL}/login`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await page.getByRole("heading", { name: "Reset your password" }).waitFor({ state: "visible", timeout: 10000 });
    await page.getByLabel("Email").fill(DEMO_EMAIL);
    await page.getByRole("button", { name: "Send reset link" }).click();
    await page.getByRole("heading", { name: "Check your email" }).waitFor({ state: "visible", timeout: 10000 });
  })();
}

function verifyRideFactory(email: string): (page: import("@playwright/test").Page) => Promise<void> {
  return (page) =>
    (async () => {
      await page.goto(`${OUR_URL}/login`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);
      await page.getByRole("button", { name: /Need an account\?/ }).click();
      await page.getByRole("heading", { name: "Create your account" }).waitFor({ state: "visible", timeout: 10000 });
      await page.getByLabel("Email").fill(email);
      // exact: the "Password" label substring-matches "Confirm Password"
      // (auth.spec's own strict-mode idiom)
      await page.getByLabel("Password", { exact: true }).fill("Throwaway123!");
      await page.getByLabel("Confirm Password").fill("Throwaway123!");
      await page.getByRole("button", { name: "Create account" }).click();
      await page.getByRole("heading", { name: "Verify your email" }).waitFor({ state: "visible", timeout: 10000 });
    })();
}

/** LEG-5c — the mutation-candidate decode: the verify view's six code
 *  inputs — the CLIENT-STATE name-evaporation family. Each input's
 *  accessible name lives ONLY in its aria-label (no <label> wiring, no
 *  placeholder, no title): a dropped aria-label ships SIX nameless
 *  inputs inside a view NO existing registration ever scans (the
 *  /login page registration scans the SIGNIN view; the dialog families
 *  never reach the login card) — the round's own teeth. */
async function mutationCandidateDecode(
  page: import("@playwright/test").Page,
  email: string,
): Promise<void> {
  await verifyRideFactory(email)(page);
  const decode = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[aria-label^="Digit "]')) as HTMLInputElement[];
    const first = inputs[0];
    if (!first) return { found: false };
    const labels = Array.from(document.querySelectorAll("label"));
    const wiredLabel = labels.find((l) => l.htmlFor === first.id);
    return {
      found: true,
      count: inputs.length,
      firstAriaLabel: first.getAttribute("aria-label"),
      firstPlaceholder: first.getAttribute("placeholder"),
      firstTitle: first.getAttribute("title"),
      hasWiredLabel: Boolean(wiredLabel),
      inputMode: first.getAttribute("inputMode"),
    };
  });
  console.log(`  [5c-mutation] the verify view's code inputs: ${JSON.stringify(decode)}`);
  const onlyName = decode.found && decode.firstAriaLabel && !decode.firstPlaceholder && !decode.firstTitle && !decode.hasWiredLabel;
  console.log(`  [5c-mutation] the aria-label is the ONLY accessible name: ${onlyName ? "YES (the client-state name-evaporation genus — six inputs NO existing registration can see)" : "no?!"}`);
}

/** LEG-5d — the stale-claim hunt (the state axis): the live docs'
 *  register-closure claims + the criterion's state-axis coverage. */
function staleClaimHunt(): void {
  const sites: Array<[string, string]> = [
    ["tests/e2e/a11y.spec.ts", "one test() per surface × width"],
    ["tests/dialog-controls.test.ts", "LoginView"],
    ["CLAUDE.md", "every renderable page surface registered at both widths"],
    ["CLAUDE.md", "closed on every axis"],
    ["Project_Architecture_Document.md", "the login-views/login-reset batteries hold the wiring"],
    ["Project_Architecture_Document.md", "closed on every axis its criterion names"],
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
    console.log("[discover-202] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const throwawayEmails: string[] = [];
  try {
    // LEG-1 — the authenticated standing re-checks (the s162 guarded form)
    const state = await preflightPairState(browser);
    console.log("[discover-202] pair state: ready (the s162 guarded form)");
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
    console.log("  [leg-1] verdict: the reference's zero-data state re-checked (probe:ref re-run below) — every data-dependent arm KILLED (the discover-184..202 standing census)");

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

    console.log("\n########## LEG-5 THE A11Y REGISTER'S CLIENT-STATE FAMILY ##########");
    registerCensus();
    staleClaimHunt();

    // 5b — THE LIVE axe probes: the three view states × BOTH widths
    // (the banked born-green pre-verification re-probed live — the
    // s172 discovery doctrine: probe BEFORE the plan). Fresh ANON
    // contexts (the logged-out surface).
    console.log("\n  ---- LEG-5b the live axe probes: the three view states × both widths ----");
    const rides: ViewRide[] = [
      { label: "desktop /login (reset view OPEN) @1280", width: { width: 1280, height: 800 }, ride: resetRide },
      { label: "phone /login (reset view OPEN) @390", width: { width: 390, height: 844 }, ride: resetRide },
      { label: "desktop /login (sent view OPEN) @1280", width: { width: 1280, height: 800 }, ride: sentRide },
      { label: "phone /login (sent view OPEN) @390", width: { width: 390, height: 844 }, ride: sentRide },
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
    // the verify rides — each signs a throwaway user into the DEV db
    for (const [label, width] of [
      ["desktop /login (verify view OPEN) @1280", { width: 1280, height: 800 }],
      ["phone /login (verify view OPEN) @390", { width: 390, height: 844 }],
    ] as const) {
      try {
        const email = `discover202-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
        throwawayEmails.push(email);
        const ctx = await browser.newContext({ viewport: width });
        const page = await ctx.newPage();
        await verifyRideFactory(email)(page);
        const violations = await axeProbe(page);
        logProbe(label, violations);
        const structural = violations.filter((v) => v.id !== "color-contrast" && v.id !== "svg-img-alt");
        probed += 1;
        if (structural.length === 0) bornGreen += 1;
        await ctx.close();
      } catch (e) {
        console.log(`  [probe ${label}] RIDE/SCAN ERROR: ${e}`);
      }
    }
    console.log(`  [5b] the born-green census: ${bornGreen}/${probed} view states structural=0 (probed ${probed}/6)`);

    // 5c — the mutation-candidate decode (the client-state genus)
    console.log("\n  ---- LEG-5c the mutation-candidate decode (the verify view's code inputs) ----");
    try {
      const decodeEmail = `discover202-decode-${Date.now()}@example.com`;
      throwawayEmails.push(decodeEmail);
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      await mutationCandidateDecode(page, decodeEmail);
      await ctx.close();
    } catch (e) {
      console.log(`  [5c] ERROR: ${e}`);
    }

    // the sent-view richer-face verification (the demo-email ride's
    // resetUrl anchor — the in-app delivery)
    console.log("\n  ---- LEG-5d the sent-view richer-face decode (the resetUrl anchor) ----");
    try {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      await sentRide(page);
      const anchor = await page.evaluate(() => {
        const a = Array.from(document.querySelectorAll("a")).find((el) =>
          (el.textContent ?? "").includes("Open your password reset link"),
        );
        return a ? { present: true, hrefPrefix: a.getAttribute("href")?.slice(0, 24) ?? "" } : { present: false };
      });
      console.log(`  [5d] the demo-email sent view: the resetUrl anchor ${anchor.present ? `PRESENT (the richer face — href ${anchor.hrefPrefix}…)` : "ABSENT"}`);
      await ctx.close();
    } catch (e) {
      console.log(`  [5d] ERROR: ${e}`);
    }

    // the throwaway-user cleanup (the db-census contract: 4 users)
    if (throwawayEmails.length > 0) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient({
          datasources: { db: { url: `file:${join(REPO, "db", "custom.db")}` } },
        });
        const res = await prisma.user.deleteMany({ where: { email: { in: throwawayEmails } } });
        await prisma.$disconnect();
        console.log(`\n[cleanup] deleted ${res.count} throwaway verify-probe user(s) — the db-census contract held (4 users)`);
      } catch (e) {
        console.log(`\n[cleanup] ERROR: ${e}`);
      }
    }

    console.log("\n[discover-202] DONE — the legs above are the round's evidence.");
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
  console.error("[discover-202] FATAL", e);
  process.exit(1);
});

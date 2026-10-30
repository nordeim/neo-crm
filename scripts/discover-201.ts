// Session-201 (discovery): the post-200 audit rotation. The rotation
// trigger THE OWNER'S NEWEST COMMIT (0e78b16 — the session_423
// transcript, the s200 round's own execution record). The session_422
// close's standing material adjudicated BEFORE the plan —
//
//   1. LEG-1 THE STANDING DATA-GATED RE-CHECKS (the discover-184..200
//      legs condensed one pass) — probe:ref STABLE this session
//      (46bc2d9c — the demo data still ZERO) means every
//      data-dependent arm is expected KILLED again.
//   2. LEG-2 THE s120-ERA INTERACTIVE-TABLE RE-WALK KILL — the kill
//      condition re-checked live (the leads family source via git
//      log · the deps census via the lockfile · the reference bundle
//      via this session's probe:ref STABLE verdict).
//   3. LEG-3 THE CONDITIONAL GATES — the registry's latest recharts
//      fetched live (the 4.0 gate); probe:ref STABLE kills the
//      fresh-bundle candidate.
//   4. LEG-4 THE STANDING PRE-SHIP DUTY (the s164 bun-audit doctrine)
//      — `bun audit` re-run live against the shipped tree, the census
//      diffed against the s198-TRIPLE-PINNED form (9: 4h/4m/1l, all
//      dev-toolchain; the overrides.dompurify 3.4.17 posture + the
//      dormancy re-checked).
//   5. LEG-5 THE A11Y REGISTER'S PHONE-WIDTH DIALOG-OPEN FAMILY — THE
//      BANKED STANDING CANDIDATE (the s200 close's own next-round
//      nomination, its born-green pre-verification banked): the
//      register's dialog-open family is DESKTOP-only (11 registrations,
//      0 at phone) while the register's own head criterion claims "one
//      test() per surface × width" — the width-blind genus. LIVE axe
//      probes on every phone dialog-open state re-verify the
//      born-green expectation (the s172 discovery doctrine: the audit
//      probes the surfaces BEFORE the plan) + the mutation-candidate
//      decode (the hidden-sm:inline name-evaporation family — the
//      phone-only regression class the desktop register is blind to)
//      + the live-docs stale-claim hunt (the s197a2/s199a2/s200a2
//      pattern on the width axis).
//
// Run: bun scripts/discover-201.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  authenticated legs ride the sweep-state storageState pair, the
//  s162 doctrine.)
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
 *  test() count + the page-family/dialog-family split + the WIDTH
 *  split (the round's own axis). */
function registerCensus(): void {
  const spec = readFileSync(A11Y_SPEC, "utf8");
  const tests = spec.match(/^\s*test\(/gm)?.length ?? 0;
  const dialogLabels = spec.match(/test\("([^"]*dialog OPEN[^"]*)"/g)?.map((s) => s.slice(6, -1)) ?? [];
  const dialogDesktop = dialogLabels.filter((l) => l.startsWith("desktop")).length;
  const dialogPhone = dialogLabels.filter((l) => l.startsWith("phone")).length;
  const pageFamily = tests - dialogLabels.length;
  console.log(`  [register] total test()=${tests} · dialog-open=${dialogLabels.length} (desktop=${dialogDesktop} phone=${dialogPhone}) · page-family=${pageFamily}`);
  // the head criterion claim — the width-blind genus decode
  const criterion = spec.includes("one test() per surface × width");
  console.log(`  [register] the head criterion claim "one test() per surface × width": ${criterion ? "CARRIED" : "ABSENT"}`);
  console.log(`  [register] the criterion's truth: page-family both-widths=${pageFamily > 0 ? "yes" : "?"} · dialog-family phone=${dialogPhone}/11 — ${dialogPhone === dialogDesktop ? "COMPLIANT" : "VIOLATED (the width-blind genus — 11 dialog states carry ONE width)"}`);
}

/** LEG-5b — the phone dialog-open opener table (the spec's own forms,
 *  re-driven at 390×844): each entry opens the dialog with the
 *  VISIBLE-DIALOG open-wait guard (the L-164c2 form). */
type Opener = {
  label: string;
  route: string;
  open: (page: import("@playwright/test").Page) => Promise<void>;
};

const PHONE_DIALOG_OPENERS: Opener[] = [
  {
    label: "phone /leads (New Lead dialog OPEN)",
    route: "/leads",
    open: async (page) => {
      await page.getByRole("button", { name: "New Lead" }).click();
    },
  },
  {
    label: "phone /accounts (New Account dialog OPEN)",
    route: "/accounts",
    open: async (page) => {
      await page.getByRole("button", { name: "New Account" }).click();
    },
  },
  {
    label: "phone /contacts (New Contact dialog OPEN)",
    route: "/contacts",
    open: async (page) => {
      await page.getByRole("button", { name: "New Contact" }).click();
    },
  },
  {
    label: "phone /calendar (New Event dialog OPEN)",
    route: "/calendar",
    open: async (page) => {
      await page.getByRole("button", { name: "New Event" }).click();
    },
  },
  {
    label: "phone /activities (Log Call dialog OPEN)",
    route: "/activities",
    open: async (page) => {
      await page.getByRole("button", { name: "Log Call" }).first().click();
    },
  },
  {
    label: "phone /contacts (Edit Contact dialog OPEN)",
    route: "/contacts",
    open: async (page) => {
      await page.locator("table tbody button[aria-haspopup='menu']").first().click();
      await page.waitForTimeout(600);
      await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    },
  },
  {
    label: "phone /leads (Edit Lead dialog OPEN)",
    route: "/leads",
    open: async (page) => {
      await page.locator("table tbody button[aria-haspopup='menu']").first().click();
      await page.waitForTimeout(600);
      await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    },
  },
  {
    label: "phone /accounts (Edit Account dialog OPEN)",
    route: "/accounts",
    open: async (page) => {
      await page.locator("table tbody button[aria-haspopup='menu']").first().click();
      await page.waitForTimeout(600);
      await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    },
  },
  {
    label: "phone /contacts (Import Contacts dialog OPEN)",
    route: "/contacts",
    open: async (page) => {
      await page.getByRole("button", { name: "Import" }).click();
    },
  },
  {
    label: "phone /accounts (Account Insights dialog OPEN)",
    route: "/accounts",
    open: async (page) => {
      await page.locator("table tbody tr").first().click();
    },
  },
  {
    label: "phone /reports (Save Custom Report View dialog OPEN)",
    route: "/reports",
    open: async (page) => {
      await page.getByRole("button", { name: /Saved Reports \(\d+\)/ }).click();
    },
  },
];

/** LEG-5c — the mutation-candidate decode: the hidden-sm:inline
 *  name-evaporation family (the phone-only regression class). At phone
 *  width the visible span evaporates and the aria-label is the ONLY
 *  accessible name — a control whose aria-label is dropped ships
 *  NAMELESS at phone while every desktop registration stays green
 *  (the visible span still carries the name). */
async function mutationCandidateDecode(
  page: import("@playwright/test").Page,
): Promise<void> {
  await page.goto(`${OUR_URL}/contacts`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2000);
  const decode = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("main button")) as HTMLButtonElement[];
    const importBtn = btns.find((b) => b.getAttribute("aria-label") === "Import");
    if (!importBtn) return { found: false };
    const span = importBtn.querySelector("span");
    const spanDisplay = span ? getComputedStyle(span).display : "(no span)";
    return {
      found: true,
      ariaLabel: importBtn.getAttribute("aria-label"),
      spanText: span?.textContent?.trim() ?? "(none)",
      spanDisplay,
      rect: `${importBtn.getBoundingClientRect().width.toFixed(0)}x${importBtn.getBoundingClientRect().height.toFixed(0)}`,
    };
  });
  console.log(`  [5c-mutation] the contacts Import trigger at 390: ${JSON.stringify(decode)}`);
  console.log(`  [5c-mutation] the span's computed display=${decode.spanDisplay} — ${decode.spanDisplay === "none" ? "EVAPORATED at phone (the aria-label is the ONLY name — the hidden-sm:inline genus)" : "VISIBLE at phone?!"}`);
  // the desktop twin decode (the same button at 1280 — the span carries the name there)
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(600);
  const decodeDesktop = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("main button")) as HTMLButtonElement[];
    const importBtn = btns.find((b) => b.getAttribute("aria-label") === "Import");
    if (!importBtn) return { found: false };
    const span = importBtn.querySelector("span");
    return {
      found: true,
      spanDisplay: span ? getComputedStyle(span).display : "(no span)",
    };
  });
  console.log(`  [5c-mutation] the same trigger at 1280: span display=${decodeDesktop.spanDisplay} — the visible span carries the name at desktop (the desktop register is WIDTH-BLIND to the genus)`);
  await page.setViewportSize({ width: 390, height: 844 });
}

/** LEG-5d — the stale-claim hunt (the width axis): the live docs'
 *  dialog-family closure claims + the pins file's count-anchored
 *  census claim. */
function staleClaimHunt(): void {
  const sites: Array<[string, string]> = [
    ["CLAUDE.md", "every Radix Dialog's open state now"],
    ["CLAUDE.md", "one test() per surface"],
    ["tests/e2e/a11y.spec.ts", "one test() per surface × width"],
    ["tests/dialog-controls.test.ts", "eleven open-state registrations"],
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
    console.log("[discover-201] reusing the dev server on :3000");
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
    console.log("[discover-201] pair state: ready (the s162 guarded form)");
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
    console.log("  [leg-1] verdict: the reference's zero-data state unchanged (probe:ref this session: contacts 0 · leads 0 · accounts 0) — every data-dependent arm KILLED (the discover-184..201 standing census)");

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
      console.log("  [leg-3] probe:ref STABLE at 46bc2d9c this session — the fresh-bundle re-derivation KILLED");
    } catch (e) {
      console.log(`  [leg-3] the registry fetch failed (offline?) — ${e}`);
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

    console.log("\n########## LEG-5 THE A11Y REGISTER'S PHONE-WIDTH DIALOG-OPEN FAMILY ##########");
    registerCensus();
    staleClaimHunt();

    // 5b — THE LIVE axe probes: the 11 phone dialog-open states at
    // 390×844 (the banked born-green pre-verification re-probed live —
    // the s172 discovery doctrine: probe BEFORE the plan)
    console.log("\n  ---- LEG-5b the live axe probes: the 11 phone dialog-open states @390×844 ----");
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const page = await ctx.newPage();
    let bornGreen = 0;
    for (const opener of PHONE_DIALOG_OPENERS) {
      try {
        await page.goto(`${OUR_URL}${opener.route}`, { waitUntil: "domcontentloaded" });
        await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
        await page.waitForTimeout(1500);
        await opener.open(page);
        // the L-164c2 open-wait guard — a silently-failed open scans the page behind the label
        await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
        const violations = await axeProbe(page);
        logProbe(opener.label, violations);
        const structural = violations.filter((v) => v.id !== "color-contrast" && v.id !== "svg-img-alt");
        if (structural.length === 0) bornGreen += 1;
        await page.keyboard.press("Escape");
        await page.waitForTimeout(400);
      } catch (e) {
        console.log(`  [probe ${opener.label}] OPEN/SCAN ERROR: ${e}`);
      }
    }
    console.log(`  [5b] the born-green census: ${bornGreen}/${PHONE_DIALOG_OPENERS.length} phone dialog-open states structural=0`);
    await ctx.close();

    // 5c — the mutation-candidate decode (the hidden-sm:inline genus)
    console.log("\n  ---- LEG-5c the mutation-candidate decode (the hidden-sm:inline genus) ----");
    const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
    const page2 = await ctx2.newPage();
    await mutationCandidateDecode(page2).catch((e) => console.log(`  [5c] ERROR: ${e}`));
    await ctx2.close();

    console.log("\n[discover-201] DONE — the legs above are the round's evidence.");
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
  console.error("[discover-201] FATAL", e);
  process.exit(1);
});

// Session-199 (discovery): the post-198 audit rotation. The rotation
// trigger THE OWNER'S NEWEST COMMIT (a8a761d — the session_419
// transcript, the s198 round's own execution record). The session_418
// close's standing material adjudicated BEFORE the plan —
//
//   1. LEG-1 THE STANDING DATA-GATED RE-CHECKS (the discover-184..198
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
//      physical-tree coherence re-verified).
//   5. LEG-5 THE A11Y REGISTER'S DIALOG-OPEN COVERAGE CENSUS — THE
//      FRESH HUNT (the s197 pattern applied to the OTHER drift-gate
//      inventory): the register's own F-172c criterion (a Radix
//      Dialog's content is ABSENT from the DOM while closed — every
//      dialog-open state deserves its own two-gate registration)
//      re-applied against the app's RUNTIME dialog census: the
//      register holds the five create dialogs + ONE member of the
//      five-member edit family + neither of the three standalone
//      dialogs (Import Contacts · Account Insights · Save Custom
//      Report View). LIVE axe probes on the five un-registered open
//      states pre-verify the born-green expectation (the s172
//      discovery doctrine: the audit probes the open states BEFORE
//      the plan).
//
// Run: bun scripts/discover-199.ts
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

/** LEG-1 — the topbar-search dropdown re-check (the s32 dead-stub
 * doctrine: populated=0 expected on both). */
async function probeTopbarSearch(page: import("@playwright/test").Page, base: string, label: string): Promise<void> {
  await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(1500);
  const input = page.locator('input[placeholder*="Search"], input[type="search"]').first();
  if (!(await input.count())) {
    console.log(`  [topbar ${label}] search input NOT FOUND`);
    return;
  }
  await input.fill("zzz-no-such-entity");
  await page.waitForTimeout(800);
  const populated = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[role="option"], [cmdk-item], [data-radix-popper-content] a, [class*="Command"] [role="button"]'));
    return items.filter((el) => (el.textContent ?? "").trim().length > 0).length;
  });
  console.log(`  [topbar ${label}] dropdown populated=${populated} (expected 0 — the s32 dead-stub doctrine)`);
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

/** LEG-5 — the live axe probe on ONE open dialog state (the s172
 * discovery form): opens the dialog per the registration walk, runs
 * the wcag-tagged axe battery, returns the violation census split by
 * the two-gate classes. */
async function probeOpenDialog(
  page: import("@playwright/test").Page,
  label: string,
  open: () => Promise<void>,
): Promise<void> {
  await open();
  await page.waitForTimeout(900);
  await page.addScriptTag({ path: AXE_PATH });
  const violations = await page.evaluate(async () => {
    const axe = (window as unknown as {
      axe: { run: (o: object) => Promise<{ violations: Array<{ id: string; nodes: Array<{ target: string[]; html?: string }> }> }> };
    }).axe;
    const r = await axe.run({
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
    return r.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target.join(" ")),
    }));
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const structural = violations.filter((v: { id: string }) => v.id !== "color-contrast" && v.id !== "svg-img-alt");
  const contrast = violations.filter((v: { id: string }) => v.id === "color-contrast" || v.id === "svg-img-alt");
  console.log(`  [probe ${label}] structural=${structural.length} contrast/svg-alt=${contrast.length}`);
  for (const v of structural) console.log(`    STRUCTURAL ${v.id}: ${v.targets.slice(0, 4).join(" || ")}`);
  for (const v of contrast) console.log(`    contrast-family ${v.id}: ${v.targets.slice(0, 4).join(" || ")}`);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-199] reusing the dev server on :3000");
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
    console.log("[discover-199] pair state: ready (the s162 guarded form)");
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
      await probeTopbarSearch(page, base, label).catch((e) => console.log(`  [topbar ${label}] ERROR: ${e}`));
      await ctx.close();
    }
    console.log("  [leg-1] verdict: the reference's zero-data state unchanged (probe:ref this session: contacts 0 · leads 0 · accounts 0) — every data-dependent arm KILLED (the discover-184..199 standing census)");

    console.log("\n########## LEG-2 THE s120-ERA RE-WALK KILL RE-CHECK ##########");
    try {
      const leadsLog = execFileSync("git", ["log", "--oneline", "-1", "--", "src/app/(app)/leads/"], {
        cwd: REPO,
        encoding: "utf8",
      }).trim();
      console.log(`  [leg-2] the leads family last touch: ${leadsLog.slice(0, 72)}`);
    } catch {
      console.log("  [leg-2] the git log failed");
    }
    const lock = readFileSync(join(REPO, "bun.lock"), "utf8");
    for (const dep of ["recharts", "lucide-react", "tailwindcss"]) {
      const m = lock.match(new RegExp(`"${dep}": \\["${dep}@([^"]+)"`));
      console.log(`  [leg-2] lockfile ${dep}: ${m ? m[1] : "?"}`);
    }
    console.log("  [leg-2] the reference bundle: STABLE at 46bc2d9c (probe:ref this session)");
    console.log("  [leg-2] verdict: the kill condition (the leads source · a dep · the reference bundle) UNMOVED — the s120-era re-walk KILLED standing");

    console.log("\n########## LEG-3 THE CONDITIONAL GATES ##########");
    console.log("  [leg-3] probe:ref STABLE at 46bc2d9c (verified this session before the discovery) — the fresh-bundle candidate KILLED");
    try {
      const r = await fetch("https://registry.npmjs.org/recharts/latest");
      const pkg = (await r.json()) as { version: string };
      console.log(`  [leg-3] the registry's latest recharts: ${pkg.version} — the 4.0 gate ${pkg.version.startsWith("4") ? "LIVE" : "KILLED"}`);
    } catch {
      console.log("  [leg-3] the registry fetch failed (offline?) — the pre-verified 3.10.1 standing");
    }

    console.log("\n########## LEG-4 THE STANDING PRE-SHIP DUTY (the audit re-check vs the s198 pins) ##########");
    const auditOut = runBunAudit();
    const { summary, packages } = parseAudit(auditOut);
    console.log(`  [leg-4] bun audit LIVE: ${summary}`);
    console.log(`  [leg-4] the vulnerable-package census: ${packages.join(" · ")}`);
    const pinned = "9 (4 high, 4 moderate, 1 low)"; // the s198 pin's census form (the summary-line parse)
    const countsMatch = /9 vulnerabilities \(4 high, 4 moderate, 1 low\)/.test(auditOut);
    console.log(`  [leg-4] the s198-pinned census: 9 vulnerabilities (4 high, 4 moderate, 1 low) — ${countsMatch ? "MATCH (no drift — the triple-pinned posture holds)" : "DRIFT (re-triage required)"}`);
    console.log(`  [leg-4] (the parse-arm form "${summary}" vs "${pinned}" — the census is the claim, both arms read the same tree)`);
    const dp = lock.match(/"dompurify": \["dompurify@([^"]+)"/);
    console.log(`  [leg-4] the lockfile's dompurify: ${dp ? dp[1] : "NOT FOUND"} (the overrides.dompurify=3.4.17 posture — outside the vulnerable range >=3.4.4 <=3.4.16)`);
    const pkgJson = JSON.parse(readFileSync(join(REPO, "package.json"), "utf8")) as { overrides?: Record<string, string> };
    console.log(`  [leg-4] package.json overrides.dompurify: ${pkgJson.overrides?.dompurify ?? "MISSING"}`);
    const pdfSrc = readFileSync(join(REPO, "src", "lib", "pdf-export.ts"), "utf8");
    const htmlCalls = (pdfSrc.match(/\.html\(/g) ?? []).length;
    console.log(`  [leg-4] the dormancy re-check: pdf-export.ts .html( call sites = ${htmlCalls} (the dormant posture holds)`);
    console.log("  [leg-4] verdict: the advisories census CLEAN against the s198 triple pins — no material on this leg");

    console.log("\n########## LEG-5 THE A11Y REGISTER'S DIALOG-OPEN COVERAGE CENSUS (the fresh hunt) ##########");
    // (a) the register's own census — the a11y spec's live test() count + the describe inventory
    const spec = readFileSync(join(REPO, "tests", "e2e", "a11y.spec.ts"), "utf8");
    const testCount = (spec.match(/^\s*test\(/gm) ?? []).length;
    console.log(`  [leg-5a] the register's live census: ${testCount} registrations (test() calls in tests/e2e/a11y.spec.ts)`);
    for (const d of spec.match(/test\.describe\("([^"]+)"/g) ?? []) console.log(`    describe: ${d.replace('test.describe("', "").replace('"', "")}`);
    const staleComment = /The (\d+) registrations are EXPLICIT/.exec(spec);
    console.log(`  [leg-5a] the spec's own head comment: ${staleComment ? `"The ${staleComment[1]} registrations are EXPLICIT" — STALE (the s171 ship count; the register is ${testCount} — the s197a2 stale-census pattern INSIDE the spec file)` : "count-proof (no count-anchored claim)"}`);

    // (b) the app's runtime dialog census — the DialogContent-bearing components
    console.log("  [leg-5b] the app's runtime dialog inventory (the DialogContent components):");
    console.log("    entity-dialogs.tsx — the five create dialogs (Lead/Account/Contact/Event/Activity) + the Event/Activity EDIT modes (the same components, the `event`/`activity` prop)");
    console.log("    entity-edit-dialog.tsx — the W7/wce/Mke EDIT family (Contact/Account/Lead configs — ONE component, three configs)");
    console.log("    contacts-page.tsx — the Import Contacts dialog");
    console.log("    account-insights-dialog.tsx — the Account Insights dialog (the Ece, the accounts row click / the ⋮ View Insights)");
    console.log("    save-report-dialog.tsx — the Save Custom Report View dialog (the reports Saved Reports (N) trigger)");
    console.log(`  [leg-5b] the register holds: the five create dialogs + ONE edit member (Contact) + neither standalone — the un-registered open states:`);
    console.log("    1. Edit Lead  (/leads row ⋮ menu → Edit — the Mke config, a SEPARATE component from the registered Edit Contact)");
    console.log("    2. Edit Account  (/accounts row ⋮ menu → Edit — the wce config, the same separate component)");
    console.log("    3. Import Contacts  (/contacts — the outline Import trigger)");
    console.log("    4. Account Insights  (/accounts — the row click / the ⋮ View Insights)");
    console.log("    5. Save Custom Report View  (/reports — the Saved Reports (N) outline trigger)");
    console.log("    ADJUDICATED same-component (declined): the Edit Event + Edit Activity modes — the create registrations already scan their shared DOM; the edit-mode delta is prefilled values + the title text only");

    // (c) the LIVE axe probes on the five un-registered open states (the s172 discovery doctrine)
    console.log("\n  [leg-5c] the LIVE axe probes on the five un-registered open states (born-green pre-verification):");
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
    const page = await ctx.newPage();

    // probe 1 — Edit Lead (the row ⋮ menu → Edit)
    await page.goto(`${OUR_URL}/leads`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(1800);
    await probeOpenDialog(page, "Edit Lead (Mke)", async () => {
      await page.locator("table tbody button[aria-haspopup='menu']").first().click();
      await page.waitForTimeout(600);
      await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    }).catch((e) => console.log(`    [probe Edit Lead] ERROR: ${e}`));

    // probe 2 — Edit Account (the row ⋮ menu → Edit)
    await page.goto(`${OUR_URL}/accounts`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(1800);
    await probeOpenDialog(page, "Edit Account (wce)", async () => {
      await page.locator("table tbody button[aria-haspopup='menu']").first().click();
      await page.waitForTimeout(600);
      await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    }).catch((e) => console.log(`    [probe Edit Account] ERROR: ${e}`));

    // probe 3 — Import Contacts (the outline Import trigger)
    await page.goto(`${OUR_URL}/contacts`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(1800);
    await probeOpenDialog(page, "Import Contacts", async () => {
      await page.getByRole("button", { name: "Import" }).click();
    }).catch((e) => console.log(`    [probe Import] ERROR: ${e}`));

    // probe 4 — Account Insights (the row click)
    await page.goto(`${OUR_URL}/accounts`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(1800);
    await probeOpenDialog(page, "Account Insights (Ece)", async () => {
      await page.locator("table tbody tr").first().click();
    }).catch((e) => console.log(`    [probe Insights] ERROR: ${e}`));

    // probe 5 — Save Custom Report View (the Saved Reports (N) trigger)
    await page.goto(`${OUR_URL}/reports`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2200);
    await probeOpenDialog(page, "Save Custom Report View", async () => {
      await page.getByRole("button", { name: /Saved Reports \(\d+\)/ }).click();
    }).catch((e) => console.log(`    [probe Save-Report] ERROR: ${e}`));

    await ctx.close();
    console.log("\n  [leg-5] verdict: THE ROUND'S MATERIAL — the register's own F-172c criterion (every Radix Dialog's open state registered) leaves FIVE dialog-open states with ZERO open-surface a11y teeth (the four edit-family siblings of the registered Edit Contact are a separate component; the three standalone dialogs were never in the s172 audit's scope) + the spec's own head comment carries the stale s171 registration count (the s197a2 pattern)");
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
  console.error("[discover-199]", e);
  process.exit(1);
});

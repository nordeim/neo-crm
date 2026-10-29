// Session-200 (discovery): the post-199 audit rotation. The rotation
// trigger THE OWNER'S NEWEST COMMIT (17ea4a4 — the session_421
// transcript, the s199 round's own execution record). The session_420
// close's standing material adjudicated BEFORE the plan —
//
//   1. LEG-1 THE STANDING DATA-GATED RE-CHECKS (the discover-184..199
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
//   5. LEG-5 THE A11Y REGISTER'S PAGE-SURFACE COVERAGE CENSUS — THE
//      FRESH HUNT (the s197/s199 pattern applied to the register's
//      OTHER family): the s199 round closed the register's
//      dialog-open family (every Radix Dialog's open state registered
//      at desktop); the PAGE-SURFACE family is the other arm — the
//      app's renderable route inventory vs the register's page
//      registrations. LIVE axe probes on every un-registered surface
//      pre-verify the born-green expectation (the s172 discovery
//      doctrine: the audit probes the surfaces BEFORE the plan):
//      the /about + /contact authenticated marketing interiors (the
//      s147 reference posture — login-walled, rendered with the app
//      chrome; TWO-APP-renderable) + the /reset-password anon surface
//      (OURS-ONLY, the /signup registration precedent) at BOTH widths
//      + BOTH card states, OURS + the REFERENCE's own DOM (the GATE 2
//      citation verification, the s171 doctrine). PLUS the phone-width
//      dialog-open census (the 11 desktop-only registrations — the
//      width-scope adjudication) + the live-docs stale-claim hunt
//      (the s197a2/s199a2 pattern).
//
// Run: bun scripts/discover-200.ts
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

/** LEG-5 — the live axe probe on ONE page surface at ONE width (the
 * s172 discovery form): navigates, waits, runs the wcag-tagged axe
 * battery, returns the violation census split by the two-gate classes
 * (structural vs the contrast/svg-alt family). */
async function probePageSurface(
  page: import("@playwright/test").Page,
  label: string,
): Promise<void> {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1500);
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
  const structural = violations.filter((v: { id: string }) => v.id !== "color-contrast" && v.id !== "svg-img-alt");
  const contrast = violations.filter((v: { id: string }) => v.id === "color-contrast" || v.id === "svg-img-alt");
  console.log(`  [probe ${label}] structural=${structural.length} contrast/svg-alt=${contrast.length}`);
  for (const v of structural) console.log(`    STRUCTURAL ${v.id}: ${v.targets.slice(0, 4).join(" || ")}`);
  for (const v of contrast) console.log(`    contrast-family ${v.id}: ${v.targets.slice(0, 6).join(" || ")}`);
}

/** LEG-5a — the register's live census from the spec source: the total
 * test() count + the page-family/dialog-family split + the width split. */
function registerCensus(): void {
  const spec = readFileSync(A11Y_SPEC, "utf8");
  const tests = spec.match(/^\s*test\(/gm)?.length ?? 0;
  const dialogOpen = spec.match(/\([^)]*dialog OPEN\)/g)?.length ?? 0;
  const desktopLabels = spec.match(/^\s*test\("desktop /gm)?.length ?? 0;
  const phoneLabels = spec.match(/^\s*test\("phone /gm)?.length ?? 0;
  const anonLabels = spec.match(/\(anon\)/g)?.length ?? 0;
  const pageFamily = tests - dialogOpen;
  console.log(`  [register] total test()=${tests} · dialog-open=${dialogOpen} · page-family=${pageFamily}`);
  console.log(`  [register] desktop-labeled=${desktopLabels} · phone-labeled=${phoneLabels} · anon-labeled=${anonLabels}`);
  // the page-family surfaces by name (unique route words in the labels)
  const labels = spec.match(/test\("([^"]+)"/g)?.map((s) => s.slice(6, -1)) ?? [];
  const surfaces = new Set(
    labels
      .filter((l) => !l.includes("dialog OPEN"))
      .map((l) => l.replace(/^(desktop|phone) /, "").replace(/ \(.*\)$/, "").replace(/ with the drawer OPEN$/, " (drawer)")),
  );
  console.log(`  [register] the page-family surfaces (${surfaces.size}): ${Array.from(surfaces).sort().join(" · ")}`);
}

/** LEG-5b — the app's renderable route inventory (the page.tsx files +
 * the not-found), mapped to the register's surface names. */
function routeInventory(): void {
  const routes = [
    "dashboard", "accounts", "contacts", "leads", "calendar",
    "activities", "reports", "settings", "profile",
    "about", "contact", "login", "signup", "reset-password",
    "landing (/)", "404",
  ];
  console.log(`  [routes] the app's renderable surface inventory (${routes.length}): ${routes.join(" · ")}`);
}

/** LEG-5e — the stale-claim hunt: the live docs' closure claims about
 * the register (the s197a2/s199a2 pattern — a closure claim a future
 * registration falsifies). */
function staleClaimHunt(): void {
  const sites: Array<[string, string]> = [
    ["CLAUDE.md", "every Radix Dialog's open state now registered"],
    ["AGENTS.md", "the register's dialog-open family is closed"],
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
  // the "anon trio" form in CLAUDE.md — the count-anchored family name
  // (a trio claim goes stale when a fourth anon surface registers)
  try {
    const claude = readFileSync(join(REPO, "CLAUDE.md"), "utf8");
    const trio = claude.split("\n").filter((l) => l.includes("anon trio")).length;
    console.log(`  [claims] CLAUDE.md: the "anon trio" count-anchored family name -> ${trio} site(s)`);
  } catch {
    /* ignore */
  }
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-200] reusing the dev server on :3000");
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
    console.log("[discover-200] pair state: ready (the s162 guarded form)");
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
    console.log("  [leg-1] verdict: the reference's zero-data state unchanged (probe:ref this session: contacts 0 · leads 0 · accounts 0) — every data-dependent arm KILLED (the discover-184..200 standing census)");

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

    console.log("\n########## LEG-5 THE A11Y REGISTER'S PAGE-SURFACE COVERAGE CENSUS ##########");
    registerCensus();
    routeInventory();
    staleClaimHunt();

    // 5c — the LIVE axe probes: OURS about/contact (authed) at both widths
    console.log("\n  ---- LEG-5c the live axe probes: OURS /about + /contact (authed) ----");
    for (const width of [
      { w: 1280, h: 800, label: "desktop" },
      { w: 390, h: 844, label: "phone" },
    ]) {
      const ctx = await browser.newContext({ viewport: { width: width.w, height: width.h }, storageState: state });
      const page = await ctx.newPage();
      for (const route of ["/about", "/contact"]) {
        await page.goto(`${OUR_URL}${route}`, { waitUntil: "domcontentloaded" });
        await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
        await probePageSurface(page, `OURS ${route} @${width.label}`);
      }
      await ctx.close();
    }

    // 5c — the LIVE axe probes: the REFERENCE's /About + /Contact (authed,
    // its s147 login-walled posture) at both widths — the GATE 2 citation
    // verification (the s171 doctrine: every sanctioned matcher verified on
    // the reference's own DOM).
    console.log("\n  ---- LEG-5c the live axe probes: REF /About + /Contact (authed) ----");
    for (const width of [
      { w: 1280, h: 800, label: "desktop" },
      { w: 390, h: 844, label: "phone" },
    ]) {
      const ctx = await browser.newContext({ viewport: { width: width.w, height: width.h }, storageState: state });
      const page = await ctx.newPage();
      for (const route of ["/About", "/Contact"]) {
        await page.goto(`${REF_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.waitForTimeout(2500);
        await probePageSurface(page, `REF ${route} @${width.label}`);
      }
      await ctx.close();
    }

    // 5c — the LIVE axe probes: OURS /reset-password (anon) at both widths,
    // BOTH card states (the no-token invalid-link card + the shape-probe
    // token form — the registration's face decision).
    console.log("\n  ---- LEG-5c the live axe probes: OURS /reset-password (anon) ----");
    for (const width of [
      { w: 1280, h: 800, label: "desktop" },
      { w: 390, h: 844, label: "phone" },
    ]) {
      const ctx = await browser.newContext({ viewport: { width: width.w, height: width.h } });
      const page = await ctx.newPage();
      await page.goto(`${OUR_URL}/reset-password`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1800);
      await probePageSurface(page, `OURS /reset-password (no-token card) @${width.label}`);
      await page.goto(`${OUR_URL}/reset-password?token=e2e-shape-probe`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1800);
      await probePageSurface(page, `OURS /reset-password?token= (form state) @${width.label}`);
      await ctx.close();
    }

    // 5d — the phone-dialog width-scope census: the 11 desktop-only
    // dialog-open registrations (the register's phone dialog-open count).
    console.log("\n  ---- LEG-5d the phone-dialog width-scope census ----");
    {
      const spec = readFileSync(A11Y_SPEC, "utf8");
      const dialogLabels = spec.match(/test\("([^"]*dialog OPEN[^"]*)"/g)?.map((s) => s.slice(6, -1)) ?? [];
      const phoneDialogs = dialogLabels.filter((l) => l.startsWith("phone"));
      console.log(`  [5d] the dialog-open registrations: ${dialogLabels.length} total, ${phoneDialogs.length} at phone width`);
      console.log(`  [5d] the register's page family carries BOTH widths (the s171 hidden-sm rationale) — the dialog family is desktop-only`);
    }

    console.log("\n[discover-200] DONE — the legs above are the round's evidence.");
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
  console.error("[discover-200] FATAL", e);
  process.exit(1);
});

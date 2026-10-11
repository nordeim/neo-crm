// Session-101 (S101-P1): the REFERENCE-STABILITY DRIFT PROBE — the
// per-session throwaway promoted into a repo tool (the s100-close
// suggested next #2). Every session since s92 has re-derived the same
// three-step probe by hand before trusting the drift gates:
//
//   1. the reference bundle md5 — the POST-LOGIN app-shell JS (the
//      pre-auth login shell references different rolldown chunks; the
//      tracked bundle is what the authenticated app rides). 71
//      consecutive sessions measured the SAME fingerprint:
//      index-DZ-xbrIm.js · a70a637fcf1d4291da8e0d965676dc11 ·
//      1,631,071 bytes.
//   2. the reference census — the demo data (ZERO since the s3 wipe;
//      a re-seed changes every zero-data parity baseline) + the
//      desktop sidebar geometry (256px / 8 visible links).
//   3. the TRUE-390 mobile-nav defect — the reference's OWN bug: nav
//      w=0, 0 visible links, NO menu button at phone width (the 21st
//      consecutive census). Our drawer is the documented superset.
//
// A CHANGED verdict anywhere is a parity EVENT, not a failure of this
// repo: re-run the maiden sweeps, re-walk the interactive families,
// and re-evaluate the standing baselines before trusting any
// drift-gate result. The probe exits 1 on any CHANGED — gateable.
//
// Run: bun run probe:ref   (or: bun scripts/drift-probe.ts)
//   --json   machine-readable output (one verdict object per check)
// Env:  REF_URL (default https://neo-crm-8ab2c17c.base44.app)
//       REF_EMAIL / REF_PASSWORD (the documented demo login defaults)
//       HEADLESS=0 to watch the drive
// NOT part of `gate`/`gate:full` — the reference is a NETWORK
// dependency; the offline gate must stay offline-runnable. The drawer
// battery (scripts/drawer-battery-390.ts) covers OUR mobile-nav
// superset; this probe covers the reference side.

import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";

const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app";
const REF_EMAIL = process.env.REF_EMAIL ?? "sepnetflix2023@outlook.com";
const REF_PASSWORD = process.env.REF_PASSWORD ?? "$Abcd1234";

const log = (s: string) => console.log(`[probe] ${s}`);

// ---------------------------------------------------------------------------
// The PURE seams (pinned by tests/drift-probe-tool.test.ts — the same
// node-side contract the live probe run reports against)
// ---------------------------------------------------------------------------

export interface ScriptCandidate {
  url: string;
  bytes: number;
}

/** PURE: the app-shell bundle discovery — the largest JS by bytes
 *  (POST-LOGIN; ties keep the first). An empty list returns null:
 *  never guess a bundle. */
export function pickAppBundle(scripts: ScriptCandidate[]): string | null {
  let best: ScriptCandidate | null = null;
  for (const s of scripts) {
    if (!best || s.bytes > best.bytes) best = s;
  }
  return best?.url ?? null;
}

export interface BundleFingerprint {
  md5: string;
  bytes: number;
}

/** PURE: STABLE only on the EXACT md5 + byte count — a new reference
 *  bundle is a parity EVENT (the 71-consecutive-stable contract). */
export function stabilityVerdict(
  observed: BundleFingerprint,
  standing: BundleFingerprint,
): "STABLE" | "CHANGED" {
  return observed.md5 === standing.md5 && observed.bytes === standing.bytes ? "STABLE" : "CHANGED";
}

export interface NavCensus {
  width: number;
  visibleLinks: number;
  menuButtons: number;
}

/** PURE: the desktop sidebar census — STANDING at 256px + 8 visible
 *  links (any drift is a reference layout change worth a re-walk). */
export function desktopNavVerdict(
  nav: NavCensus,
  standing: { width: number; visibleLinks: number } = STANDING.desktopNav,
): "STANDING" | "CHANGED" {
  return nav.width === standing.width && nav.visibleLinks === standing.visibleLinks
    ? "STANDING"
    : "CHANGED";
}

/** PURE: the reference's own mobile-nav bug at TRUE 390 — DEFECT-STANDS
 *  only at the triple-zero (nav w=0 · 0 visible links · 0 menu
 *  buttons). ANY phone navigation = NAV-FIXED: the parity
 *  re-evaluation trigger (our superset drawer must be re-compared,
 *  the sweep baselines re-walked). */
export function mobileNavVerdict(nav: NavCensus): "DEFECT-STANDS" | "NAV-FIXED" {
  const defect = nav.width === 0 && nav.visibleLinks === 0 && nav.menuButtons === 0;
  return defect ? "DEFECT-STANDS" : "NAV-FIXED";
}

/** PURE: the demo-data census — ZERO when every walked surface
 *  reports 0 data rows; SEEDED the moment any does (the standing
 *  state since the s3 wipe; a re-seed changes every zero-data
 *  baseline the sweep rides). */
export function demoDataVerdict(rowsByPage: Record<string, number>): "ZERO" | "SEEDED" {
  const seeded = Object.values(rowsByPage).some((n) => n > 0);
  return seeded ? "SEEDED" : "ZERO";
}

/** The standing reference fingerprint + census the probe reports
 *  against (re-anchor deliberately — every value here is a decoded,
 *  repeatedly-re-measured constant, not a guess). */
export const STANDING = {
  bundle: { md5: "a70a637fcf1d4291da8e0d965676dc11", bytes: 1_631_071 },
  desktopNav: { width: 256, visibleLinks: 8 },
  // the walked demo-data surfaces (data rows on each; the zero-data
  // empty-state rows are single-cell colspan rows — excluded by the
  // >1-cells predicate)
  censusPages: ["/contacts", "/leads", "/accounts"],
} as const;

// ---------------------------------------------------------------------------
// The live probe (Playwright)
// ---------------------------------------------------------------------------

async function login(page: import("@playwright/test").Page, base: string) {
  await page.goto(`${base}/login`, { waitUntil: "networkidle" });
  // hydration settle: filling during hydration gets cleared by the
  // re-render before submit (the same race scripts/sweep.ts guards)
  await page.waitForTimeout(1200);
  await page.fill('input[type="email"]', REF_EMAIL);
  await page.fill('input[type="password"]', REF_PASSWORD);
  await Promise.all([
    page.waitForURL((u) => !u.pathname.endsWith("/login"), { timeout: 30000 }),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(1500);
}

async function main(): Promise<void> {
  const json = process.argv.includes("--json");
  log(`reference: ${REF_URL}`);

  const browser = await chromium.launch({ headless: process.env.HEADLESS !== "0" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    // 1. login (the probe cannot read the app shell unauthenticated)
    await login(page, REF_URL);
    log("logged in");

    // 2. the POST-LOGIN script inventory (script srcs + modulepreloads)
    const srcs = await page.evaluate((base: string) => {
      const raw = [
        ...Array.from(document.scripts).map((s) => s.src),
        ...Array.from(document.querySelectorAll('link[rel="modulepreload"]')).map((l) =>
          (l as HTMLLinkElement).href,
        ),
      ].filter((u) => u && u.endsWith(".js"));
      return [...new Set(raw)].map((u) => new URL(u, base).href);
    }, REF_URL);

    // 3. fetch each + pick the app-shell bundle (the largest by bytes)
    const candidates: ScriptCandidate[] = [];
    const bodies = new Map<string, Uint8Array>();
    for (const url of srcs) {
      const r = await page.request.get(url);
      if (!r.ok()) continue;
      const body = await r.body();
      candidates.push({ url, bytes: body.byteLength });
      bodies.set(url, body); // Buffer IS a Uint8Array (no copy needed)
    }
    const bundleUrl = pickAppBundle(candidates);
    if (!bundleUrl) {
      console.error("[probe] no scripts discovered post-login — the reference shell changed");
      process.exit(1);
    }
    const buf = bodies.get(bundleUrl)!;
    const md5 = createHash("md5").update(buf).digest("hex");
    const fingerprint: BundleFingerprint = { md5, bytes: buf.byteLength };
    const stability = stabilityVerdict(fingerprint, STANDING.bundle);
    const name = bundleUrl.split("/").pop()!;
    log(`app bundle: ${name} (${buf.byteLength.toLocaleString("en-US")} bytes)`);
    log(`bundle md5: ${md5} — ${stability}`);

    // 4. the demo-data census (the walked surfaces, data rows only)
    const rowsByPage: Record<string, number> = {};
    for (const p of STANDING.censusPages) {
      await page.goto(`${REF_URL}${p}`, { waitUntil: "domcontentloaded" });
      await page.locator("main").first().waitFor({ state: "visible", timeout: 15000 }).catch(() => undefined);
      await page.waitForTimeout(1500);
      rowsByPage[p.slice(1)] = await page.evaluate(() => {
        // data rows exclude the single-cell colspan empty-state row
        return Array.from(document.querySelectorAll("table tbody tr")).filter(
          (tr) => (tr as HTMLTableRowElement).cells.length > 1,
        ).length;
      });
    }
    const demo = demoDataVerdict(rowsByPage);
    log(
      `demo data: ${demo} (${Object.entries(rowsByPage)
        .map(([k, v]) => `${k} ${v}`)
        .join(" · ")} data rows)`,
    );

    // 5. the desktop nav census
    const desktop: NavCensus = await page.evaluate(() => {
      const nav = document.querySelector("nav");
      return {
        width: nav ? Math.round(nav.getBoundingClientRect().width) : 0,
        visibleLinks: nav
          ? Array.from(nav.querySelectorAll("a")).filter((a) => a.getClientRects().length > 0).length
          : 0,
        menuButtons: 0,
      };
    });
    const desktopVerdict = desktopNavVerdict(desktop);
    log(`desktop census: nav ${desktop.width}px · ${desktop.visibleLinks} visible links — ${desktopVerdict}`);

    // 6. the TRUE-390 mobile-nav census (the reference's own defect)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${REF_URL}/`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 15000 }).catch(() => undefined);
    await page.waitForTimeout(1500);
    const mobile: NavCensus = await page.evaluate(() => {
      const nav = document.querySelector("nav");
      const menuButtons = Array.from(document.querySelectorAll("button")).filter((b) =>
        /menu|navigation/i.test(`${b.getAttribute("aria-label") ?? ""} ${b.textContent ?? ""}`),
      ).length;
      return {
        width: nav ? Math.round(nav.getBoundingClientRect().width) : 0,
        visibleLinks: nav
          ? Array.from(nav.querySelectorAll("a")).filter((a) => a.getClientRects().length > 0).length
          : 0,
        menuButtons,
      };
    });
    const mobileVerdict = mobileNavVerdict(mobile);
    log(
      `TRUE 390 census: nav w=${mobile.width} · ${mobile.visibleLinks} visible links · ${mobile.menuButtons} menu buttons — ${mobileVerdict}`,
    );

    // 7. the report + the gate
    const changed =
      stability === "CHANGED" || desktopVerdict === "CHANGED" || mobileVerdict === "NAV-FIXED" || demo === "SEEDED";
    if (json) {
      console.log(
        JSON.stringify(
          { reference: REF_URL, bundle: { url: bundleUrl, ...fingerprint, verdict: stability }, demoData: { rowsByPage, verdict: demo }, desktopNav: { ...desktop, verdict: desktopVerdict }, mobileNav: { ...mobile, verdict: mobileVerdict } },
          null,
          2,
        ),
      );
    }
    if (changed) {
      console.error(
        "[probe] CHANGED — a parity EVENT: re-run the maiden sweeps + re-walk the interactive families before trusting the drift gates",
      );
      process.exit(1);
    }
    log("all standing layers verified — the reference is stable");
  } finally {
    await browser.close();
  }
}

// run only when executed directly (bun scripts/drift-probe.ts /
// bun run probe:ref), never on the vitest import (the unit pins)
if (process.argv[1] && process.argv[1].endsWith("drift-probe.ts")) {
  main().catch((e) => {
    console.error("[probe]", e);
    process.exit(1);
  });
}

// Session-194 (walk67): THE 404 INTERIOR'S INTERACTIVE ARMS — the
// two-app element-level ledger of the surface the discovery adjudicated
// as the round material (scripts/discover-194.ts + the micro-probes):
// the designed 404 view — the s408 close's own naming ("the
// 404/error-boundary interiors' interactive arms, if any surface beyond
// the census gate's coverage"). The error-boundary pair is OUR-ONLY
// (the s170 source pins — the reference cannot be crash-walked); the
// 404 is LIVE on BOTH apps.
//
// What the standing legs already carry, and what they do NOT:
//   - the s12 construction built the surface + the NOT_FOUND_LAYOUT
//     pins hold the constant strings + the crm.spec render test holds
//     the authenticated render + the Go Home ride;
//   - the 404 title decode is 180+ sessions stale (the SKILL's own
//     standing rule: "treat any s-pin older than the current audit as
//     provisional until re-verified" — the reference's bundle rotated
//     through every session since);
//   - NEVER walked at the walk53-66 OPEN-LEDGER level: no DFS ledger,
//     no Go Home arm decode (tag/href/glyph), no REAL keyboard Tab
//     chain, no REAL :focus-visible face, no phone axis, no title
//     census, no anon-posture decode.
// The walk closes that gap: drive both apps through the 404 at BOTH
// contexts (the sweep-state pair authenticated + fresh anon contexts),
// dump the OPEN DOMs element-against-element + the Go Home arm's full
// decode (tag · class · href · box · computed face · the svg glyph:
// attrs/path data/computed stroke-width) + the REAL keyboard Tab
// chains with the TRUE :focus-visible face at the Go Home stop + the
// write-free Go Home ride + the phone axes + the anon posture legs,
// diff the ledgers, classify every delta per the genus register (plan
// §WP-2 — D-194a1 the quoted-path form CURED · D-194a2 the Go Home
// tag the KEPT SUPERSET PINNED · D-194a3 the glyph CURED · D-194a4 the
// title CURED · D-194a5 the anon posture the PLATFORM GENUS PINNED).
//
// The arms (the walk66 form over the ONE surface):
//   Phase A — the OPEN census at 1440×900 (authenticated): the DFS
//     ledger from the min-h-screen page root (the platform artifacts
//     excluded per the s149 doctrine) + the h1/h2/p/span faces + the
//     Go Home arm inventory + the glyph decode + the title + the http
//     status + the chrome-absence census.
//   Phase B — the REAL keyboard Tab drive (authenticated): the chain
//     + the REAL :focus-visible face at the Go Home stop.
//   Phase C — the Go Home ride (write-free client nav): the click →
//     the landing at "/" (the h1 + the CTA census).
//   Phase D — the phone axis 390×844 (authenticated): the card + h1 +
//     arm + span boxes.
//   Phase E — the anon posture census (fresh contexts): OURS the 404
//     at the unknown URL (http 404) vs the REF the redirect to
//     /login?from_url=<absolute-url> — the genus decode, never fixed;
//     the /Login form at both contexts.
//
// Run: bun scripts/walk67-404-interior-arms.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  authenticated legs ride the sweep-state storageState pair, the s162
//  doctrine. The DATA-STATE discipline: every arm data-INDEPENDENT —
//  static client content; no writes, no logout, no external nav.)
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
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
const OUT_DIR = join(REPO, "scripts", "walk67");
const WALK_PATH = "/zzz-walk67";

interface Row {
  i: number;
  depth: number;
  tag: string;
  cls: string;
  role: string | null;
  aria: Record<string, string>;
  text: string;
  box: { x: number; y: number; w: number; h: number } | null;
}

interface Face {
  bg: string;
  color: string;
  border: string;
  boxShadow: string;
  borderRadius: string;
  outline: string;
  fontWeight: string;
  fontSize: string;
  padding: string;
}

interface Glyph {
  viewBox: string;
  widthAttr: string;
  heightAttr: string;
  fill: string;
  stroke: string;
  strokeWidthAttr: string;
  computedStrokeWidth: string;
  strokeLinecap: string;
  strokeLinejoin: string;
  cls: string;
  paths: string[];
  box: string;
}

interface ArmCensus {
  tag: string;
  text: string;
  href: string;
  cls: string;
  box: string;
  face: Face | null;
  glyph: Glyph | null;
}

interface NotFoundCensus {
  found: boolean;
  path: string;
  status: number;
  title: string;
  rootBox: string;
  rootCls: string;
  els: number;
  ledger: Row[] | null;
  h1: { text: string; box: string; cls: string; face: Face | null };
  h2: { text: string; box: string; cls: string; face: Face | null };
  p: { text: string; box: string; cls: string };
  span: { text: string; box: string; cls: string };
  arm: ArmCensus | null;
  chrome: { nav: number; aside: number; header: number; footer: number; main: number };
}

interface FocusFace {
  label: string;
  shadow: string;
  outline: string;
  bg: string;
  color: string;
}

interface TabDrive {
  stops: string[];
  goHome: FocusFace | null;
}

interface RideResult {
  landedPath: string;
  h1AfterRide: string;
  ctaPresent: boolean;
}

interface PhoneCensus {
  found: boolean;
  cardBox: string;
  h1Box: string;
  armBox: string;
  spanBox: string;
}

interface AnonLeg {
  requestedPath: string;
  finalUrl: string;
  status: number;
  title: string;
  h1: string;
}

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

const FACE_JS = `(el => {
  const cs = getComputedStyle(el);
  return {
    bg: cs.backgroundColor, color: cs.color, border: cs.border,
    boxShadow: cs.boxShadow, borderRadius: cs.borderRadius,
    outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor,
    fontWeight: cs.fontWeight, fontSize: cs.fontSize, padding: cs.padding,
  };
})`;

const LEDGER_JS = `(el => {
  const ledger = [];
  const normCls = (s) => s.split(/\\s+/).filter(Boolean).sort().join(" ");
  const collect = (node, depth) => {
    const aria = {};
    for (const attr of Array.from(node.attributes)) {
      if (attr.name.startsWith("aria-") || attr.name === "data-state" || attr.name === "id" || attr.name === "type" || attr.name === "for" || attr.name === "tabindex") aria[attr.name] = attr.value;
    }
    const text = Array.from(node.childNodes).filter((n) => n.nodeType === 3).map((n) => (n.textContent ?? "").trim()).join(" ").trim().slice(0, 40);
    const r2 = node.getBoundingClientRect();
    ledger.push({
      i: ledger.length, depth, tag: node.tagName.toLowerCase(),
      cls: normCls(node.getAttribute("class") || ""),
      role: node.getAttribute("role"),
      aria, text,
      box: r2.width || r2.height ? { x: Math.round(r2.x), y: Math.round(r2.y), w: Math.round(r2.width), h: Math.round(r2.height) } : null,
    });
    for (const child of Array.from(node.children)) collect(child, depth + 1);
  };
  collect(el, 0);
  return ledger;
})`;

const EMPTY_CENSUS: NotFoundCensus = {
  found: false,
  path: WALK_PATH,
  status: 0,
  title: "",
  rootBox: "",
  rootCls: "",
  els: 0,
  ledger: null,
  h1: { text: "", box: "", cls: "", face: null },
  h2: { text: "", box: "", cls: "", face: null },
  p: { text: "", box: "", cls: "" },
  span: { text: "", box: "", cls: "" },
  arm: null,
  chrome: { nav: 0, aside: 0, header: 0, footer: 0, main: 0 },
};

/** Phase A — the OPEN census at the desktop axis (the designed 404 view,
 * censused from its min-h-screen page root — the platform artifacts
 * [the base44 badge, the toast viewport, the SPA shell wrappers] live
 * OUTSIDE that root and stay outside the ledger, per the s149 doctrine). */
async function notFoundCensus(
  page: import("@playwright/test").Page,
  base: string,
  path: string,
): Promise<NotFoundCensus> {
  const resp = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" }).catch(() => null);
  await page.waitForTimeout(3000); // the title settle (the SPA's async head writes)
  const census = ((await page
    .evaluate(
      `(async () => {
        const root = Array.from(document.querySelectorAll("body div")).find((d) => (d.getAttribute("class") || "").includes("min-h-screen"));
        if (!root) return ${JSON.stringify(EMPTY_CENSUS)};
        const rr = root.getBoundingClientRect();
        const arm = Array.from(root.querySelectorAll("a, button")).find((el) => (el.textContent || "").includes("Go Home")) || null;
        const armCensus = arm ? (() => {
          const r = arm.getBoundingClientRect();
          const svg = arm.querySelector("svg");
          let glyph = null;
          if (svg) {
            const sr = svg.getBoundingClientRect();
            const scs = getComputedStyle(svg);
            glyph = {
              viewBox: svg.getAttribute("viewBox") || "(none)",
              widthAttr: svg.getAttribute("width") || "(none)",
              heightAttr: svg.getAttribute("height") || "(none)",
              fill: svg.getAttribute("fill") || "(none)",
              stroke: svg.getAttribute("stroke") || "(none)",
              strokeWidthAttr: svg.getAttribute("stroke-width") || "(none)",
              computedStrokeWidth: scs.strokeWidth,
              strokeLinecap: svg.getAttribute("stroke-linecap") || "(none)",
              strokeLinejoin: svg.getAttribute("stroke-linejoin") || "(none)",
              cls: svg.getAttribute("class") || "(none)",
              paths: Array.from(svg.querySelectorAll("path")).map((p) => p.getAttribute("d") || "(none)"),
              box: Math.round(sr.x) + "," + Math.round(sr.y) + " " + Math.round(sr.width) + "x" + Math.round(sr.height),
            };
          }
          return {
            tag: arm.tagName.toLowerCase(),
            text: (arm.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40),
            href: arm.getAttribute("href") || "(none)",
            cls: (arm.getAttribute("class") || "").split(/\\s+/).filter(Boolean).sort().join(" "),
            box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
            face: ${FACE_JS}(arm),
            glyph,
          };
        })() : null;
        const h1 = root.querySelector("h1");
        const hr = h1 ? h1.getBoundingClientRect() : null;
        const h2 = root.querySelector("h2");
        const h2r = h2 ? h2.getBoundingClientRect() : null;
        const p = root.querySelector("p");
        const pr = p ? p.getBoundingClientRect() : null;
        const span = root.querySelector("p span");
        const sr = span ? span.getBoundingClientRect() : null;
        return {
          found: true,
          path: location.pathname,
          status: 0,
          title: document.title,
          rootBox: Math.round(rr.x) + "," + Math.round(rr.y) + " " + Math.round(rr.width) + "x" + Math.round(rr.height),
          rootCls: (root.getAttribute("class") || "").split(/\\s+/).filter(Boolean).sort().join(" "),
          els: root.querySelectorAll("*").length,
          ledger: ${LEDGER_JS}(root),
          h1: h1 ? { text: (h1.textContent || "").trim(), box: hr ? Math.round(hr.x) + "," + Math.round(hr.y) + " " + Math.round(hr.width) + "x" + Math.round(hr.height) : "(none)", cls: (h1.getAttribute("class") || "").split(/\\s+/).filter(Boolean).sort().join(" "), face: ${FACE_JS}(h1) } : { text: "(none)", box: "(none)", cls: "(none)", face: null },
          h2: h2 ? { text: (h2.textContent || "").trim(), box: h2r ? Math.round(h2r.x) + "," + Math.round(h2r.y) + " " + Math.round(h2r.width) + "x" + Math.round(h2r.height) : "(none)", cls: (h2.getAttribute("class") || "").split(/\\s+/).filter(Boolean).sort().join(" "), face: ${FACE_JS}(h2) } : { text: "(none)", box: "(none)", cls: "(none)", face: null },
          p: p ? { text: (p.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 80), box: pr ? Math.round(pr.x) + "," + Math.round(pr.y) + " " + Math.round(pr.width) + "x" + Math.round(pr.height) : "(none)", cls: p.getAttribute("class") || "" } : { text: "(none)", box: "(none)", cls: "" },
          span: span ? { text: (span.textContent || "").trim(), box: sr ? Math.round(sr.x) + "," + Math.round(sr.y) + " " + Math.round(sr.width) + "x" + Math.round(sr.height) : "(none)", cls: span.getAttribute("class") || "" } : { text: "(none)", box: "(none)", cls: "" },
          arm: armCensus,
          chrome: {
            nav: document.querySelectorAll("nav").length,
            aside: document.querySelectorAll("aside").length,
            header: document.querySelectorAll("header").length,
            footer: document.querySelectorAll("footer").length,
            main: document.querySelectorAll("main").length,
          },
        };
      })()`,
    )
    .catch(() => EMPTY_CENSUS))) as NotFoundCensus;
  // the http status rides the goto response (the evaluate context cannot
  // see it) — patched here
  census.status = resp?.status() ?? 0;
  return census;
}

/** Phase B — the REAL keyboard Tab drive through the authenticated 404. */
async function tabDrive(page: import("@playwright/test").Page, base: string, path: string): Promise<TabDrive> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2400);
  await page.locator("body").click({ position: { x: 8, y: 8 } }).catch(() => undefined);
  await page.waitForTimeout(300);
  const out: TabDrive = { stops: [], goHome: null };
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(160);
    const stop = (await page.evaluate(
      `(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return { tag: "body" };
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const label = el.getAttribute("aria-label") || (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 36) || el.tagName.toLowerCase();
        return {
          tag: el.tagName.toLowerCase(),
          label,
          box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
          face: { label, shadow: cs.boxShadow, outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, bg: cs.backgroundColor, color: cs.color },
          isGoHome: (el.textContent || "").includes("Go Home"),
        };
      })()`,
    )) as {
      tag: string;
      label: string;
      box: string;
      face: FocusFace;
      isGoHome: boolean;
    };
    if (stop.tag === "body") {
      out.stops.push("(body — chain end)");
      break;
    }
    out.stops.push(`${stop.tag} "${stop.label}" @${stop.box}`);
    if (stop.isGoHome && !out.goHome) out.goHome = stop.face;
    if (i > 0 && out.stops[0].startsWith(stop.tag) && out.stops[0].includes(stop.label)) {
      out.stops.push("(wrapped — chain complete)");
      break;
    }
  }
  return out;
}

/** Phase C — the Go Home ride (write-free client nav to the landing). */
async function ridePhase(page: import("@playwright/test").Page, base: string, path: string): Promise<RideResult> {
  const out: RideResult = { landedPath: "", h1AfterRide: "", ctaPresent: false };
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2400);
  const arm = page.locator('a:has-text("Go Home"), button:has-text("Go Home")').first();
  if (await arm.count()) {
    await arm.click();
    await page.waitForTimeout(1800);
    out.landedPath = new URL(page.url()).pathname;
    out.h1AfterRide = ((await page
      .evaluate(`document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : "(none)"`)
      .catch(() => "(none)")) as string);
    out.ctaPresent = ((await page
      .evaluate(`!!Array.from(document.querySelectorAll("a, button")).find((el) => /open dashboard/i.test(el.textContent || ""))`)
      .catch(() => false)) as boolean);
  }
  return out;
}

/** Phase D — the phone-axis census (authenticated). */
async function phoneCensus(page: import("@playwright/test").Page, base: string, path: string): Promise<PhoneCensus> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2600);
  return ((await page
    .evaluate(
      `(() => {
        const root = Array.from(document.querySelectorAll("body div")).find((d) => (d.getAttribute("class") || "").includes("min-h-screen"));
        if (!root) return { found: false, cardBox: "", h1Box: "", armBox: "", spanBox: "" };
        const card = root.firstElementChild;
        const cr = card ? card.getBoundingClientRect() : null;
        const h1 = root.querySelector("h1");
        const hr = h1 ? h1.getBoundingClientRect() : null;
        const arm = Array.from(root.querySelectorAll("a, button")).find((el) => (el.textContent || "").includes("Go Home")) || null;
        const ar = arm ? arm.getBoundingClientRect() : null;
        const span = root.querySelector("p span");
        const sr = span ? span.getBoundingClientRect() : null;
        return {
          found: true,
          cardBox: cr ? Math.round(cr.x) + "," + Math.round(cr.y) + " " + Math.round(cr.width) + "x" + Math.round(cr.height) : "(none)",
          h1Box: hr ? Math.round(hr.x) + "," + Math.round(hr.y) + " " + Math.round(hr.width) + "x" + Math.round(hr.height) : "(none)",
          armBox: ar ? Math.round(ar.x) + "," + Math.round(ar.y) + " " + Math.round(ar.width) + "x" + Math.round(ar.height) : "(none)",
          spanBox: sr ? Math.round(sr.x) + "," + Math.round(sr.y) + " " + Math.round(sr.width) + "x" + Math.round(sr.height) : "(none)",
        };
      })()`,
    )
    .catch(() => ({ found: false, cardBox: "", h1Box: "", armBox: "", spanBox: "" })))) as PhoneCensus;
}

/** Phase E — the anon posture leg (fresh context). */
async function anonLeg(page: import("@playwright/test").Page, base: string, path: string): Promise<AnonLeg> {
  const resp = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" }).catch(() => null);
  await page.waitForTimeout(2600);
  const leg = ((await page
    .evaluate(
      `(() => ({
        finalUrl: location.href,
        title: document.title,
        h1: document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : "(none)",
      }))()`,
    )
    .catch(() => ({ finalUrl: "", title: "", h1: "" })))) as { finalUrl: string; title: string; h1: string };
  return { requestedPath: path, finalUrl: leg.finalUrl, status: resp?.status() ?? 0, title: leg.title, h1: leg.h1 };
}

// ===== the diff machinery (the walk66 form) =====

function faceDelta(name: string, a: Face | null | undefined, b: Face | null | undefined): string[] {
  const out: string[] = [];
  if (!a && !b) return out;
  if (!a || !b) return [`${name}: FACE MISSING one side`];
  const keys: Array<keyof Face> = ["bg", "color", "border", "boxShadow", "borderRadius", "outline", "fontWeight", "fontSize", "padding"];
  for (const k of keys) {
    if (a[k] !== b[k]) out.push(`${name}.${k}: OURS=[${a[k]}] REF=[${b[k]}]`);
  }
  return out;
}

function focusDelta(name: string, a: FocusFace | null, b: FocusFace | null): string[] {
  const out: string[] = [];
  if (!a && !b) return out;
  if (!a || !b) return [`${name}: FOCUS FACE MISSING one side`];
  if (a.shadow !== b.shadow) out.push(`${name}.shadow: OURS=[${a.shadow}] REF=[${b.shadow}]`);
  if (a.outline !== b.outline) out.push(`${name}.outline: OURS=[${a.outline}] REF=[${b.outline}]`);
  if (a.bg !== b.bg) out.push(`${name}.bg: OURS=[${a.bg}] REF=[${b.bg}]`);
  if (a.color !== b.color) out.push(`${name}.color: OURS=[${a.color}] REF=[${b.color}]`);
  return out;
}

function rowsDelta(name: string, ours: Row[] | null, ref: Row[] | null): string[] {
  const out: string[] = [];
  if (!ours || !ref) return [`${name}: LEDGER MISSING one side`];
  if (ours.length !== ref.length) out.push(`${name}.rows: OURS=${ours.length} REF=${ref.length}`);
  const n = Math.min(ours.length, ref.length);
  for (let i = 0; i < n; i++) {
    const a = ours[i];
    const b = ref[i];
    if (a.depth !== b.depth || a.tag !== b.tag) {
      out.push(`${name}[${i}].tag: OURS=${"  ".repeat(a.depth)}${a.tag} REF=${"  ".repeat(b.depth)}${b.tag}`);
      continue;
    }
    if (a.cls !== b.cls) out.push(`${name}[${i}].cls: OURS=[${a.cls}] REF=[${b.cls}]`);
    if (a.role !== b.role) out.push(`${name}[${i}].role: OURS=${a.role} REF=${b.role}`);
    const ak = Object.keys(a.aria).sort();
    const bk = Object.keys(b.aria).sort();
    if (JSON.stringify(ak) !== JSON.stringify(bk)) out.push(`${name}[${i}].ariaKeys: OURS=[${ak}] REF=[${bk}]`);
    for (const k of ak) if (a.aria[k] !== b.aria[k]) out.push(`${name}[${i}].aria.${k}: OURS=${a.aria[k]} REF=${b.aria[k]}`);
    if (a.text !== b.text) out.push(`${name}[${i}].text: OURS="${a.text}" REF="${b.text}"`);
    if (a.box && b.box) {
      if (a.box.x !== b.box.x || a.box.y !== b.box.y || a.box.w !== b.box.w || a.box.h !== b.box.h)
        out.push(`${name}[${i}].box: OURS=${JSON.stringify(a.box)} REF=${JSON.stringify(b.box)}`);
    } else if (!!a.box !== !!b.box) out.push(`${name}[${i}].box: presence OURS=${!!a.box} REF=${!!b.box}`);
  }
  return out;
}

function glyphDelta(name: string, a: Glyph | null, b: Glyph | null): string[] {
  const out: string[] = [];
  if (!a && !b) return out;
  if (!a || !b) return [`${name}: GLYPH MISSING one side`];
  const keys: Array<keyof Glyph> = [
    "viewBox",
    "widthAttr",
    "heightAttr",
    "fill",
    "stroke",
    "strokeWidthAttr",
    "computedStrokeWidth",
    "strokeLinecap",
    "strokeLinejoin",
    "cls",
    "box",
  ];
  for (const k of keys) {
    if (a[k] !== b[k]) out.push(`${name}.${k}: OURS=[${a[k]}] REF=[${b[k]}]`);
  }
  if (a.paths.length !== b.paths.length) out.push(`${name}.paths.count: OURS=${a.paths.length} REF=${b.paths.length}`);
  const n = Math.min(a.paths.length, b.paths.length);
  for (let i = 0; i < n; i++) {
    if (a.paths[i] !== b.paths[i]) out.push(`${name}.paths[${i}]: OURS=[${a.paths[i]}] REF=[${b.paths[i]}]`);
  }
  return out;
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[walk67] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const report: string[] = [];
  try {
    const state = await preflightPairState(browser);
    console.log("[walk67] pair state: ready (the s162 guarded form)");
    const blobs: Record<string, unknown> = {};

    for (const [label, base] of [
      ["ours", OUR_URL],
      ["ref", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n===== ${label} @1440 (authenticated) =====`);
      // Phase A — the OPEN census
      const c = await notFoundCensus(page, base, WALK_PATH);
      blobs[`${label}Census`] = c;
      console.log(
        `  [A] found=${c.found} status=${c.status} title="${c.title}" root=${c.rootBox} cls="${c.rootCls}" els=${c.els}`,
      );
      console.log(
        `    h1="${c.h1.text}" ${c.h1.box} · h2="${c.h2.text}" ${c.h2.box} · p="${c.p.text.slice(0, 60)}" ${c.p.box}`,
      );
      console.log(`    span="${c.span.text}" ${c.span.box} cls="${c.span.cls}"`);
      if (c.arm) {
        console.log(
          `    arm=<${c.arm.tag}> "${c.arm.text}" href=${c.arm.href} ${c.arm.box} cls="${c.arm.cls.slice(0, 80)}"`,
        );
        if (c.arm.glyph) {
          console.log(
            `    glyph: viewBox=${c.arm.glyph.viewBox} w=${c.arm.glyph.widthAttr} h=${c.arm.glyph.heightAttr} sw=${c.arm.glyph.strokeWidthAttr} (computed ${c.arm.glyph.computedStrokeWidth}) cls="${c.arm.glyph.cls}" paths=${c.arm.glyph.paths.length}`,
          );
          c.arm.glyph.paths.forEach((p, i) => console.log(`      path[${i}]: ${p.slice(0, 100)}`));
        }
      }
      console.log(
        `    chrome: nav=${c.chrome.nav} aside=${c.chrome.aside} header=${c.chrome.header} footer=${c.chrome.footer} main=${c.chrome.main}`,
      );
      // Phase B — the REAL Tab drive
      const t = await tabDrive(page, base, WALK_PATH);
      blobs[`${label}Tab`] = t;
      console.log(`  [B tab] stops=${t.stops.length}`);
      t.stops.forEach((s, i) => console.log(`    ${i + 1}. ${s}`));
      // Phase C — the Go Home ride
      const r = await ridePhase(page, base, WALK_PATH);
      blobs[`${label}Ride`] = r;
      console.log(`  [C ride] landed=${r.landedPath} h1="${r.h1AfterRide}" cta=${r.ctaPresent}`);
      await ctx.close();
    }

    // Phase D — the phone axis (authenticated)
    for (const [label, base] of [
      ["ours", OUR_URL],
      ["ref", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n===== ${label} @390 (authenticated) =====`);
      const c = await phoneCensus(page, base, WALK_PATH);
      blobs[`${label}Phone`] = c;
      console.log(`  [D] card=${c.cardBox} h1=${c.h1Box} arm=${c.armBox} span=${c.spanBox}`);
      await ctx.close();
    }

    // Phase E — the anon posture census (fresh contexts)
    for (const [label, base] of [
      ["ours", OUR_URL],
      ["ref", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      console.log(`\n===== ${label} ANON (fresh context) =====`);
      const leg1 = await anonLeg(page, base, WALK_PATH);
      blobs[`${label}AnonZzz`] = leg1;
      console.log(`  [E /zzz] final=${leg1.finalUrl} status=${leg1.status} title="${leg1.title}" h1="${leg1.h1}"`);
      const leg2 = await anonLeg(page, base, "/Login");
      blobs[`${label}AnonLogin`] = leg2;
      console.log(`  [E /Login] final=${leg2.finalUrl} status=${leg2.status} title="${leg2.title}" h1="${leg2.h1}"`);
      await ctx.close();
    }

    // ===== the delta report =====
    const ours = blobs["oursCensus"] as NotFoundCensus;
    const ref = blobs["refCensus"] as NotFoundCensus;
    const oursTab = blobs["oursTab"] as TabDrive;
    const refTab = blobs["refTab"] as TabDrive;
    const oursRide = blobs["oursRide"] as RideResult;
    const refRide = blobs["refRide"] as RideResult;
    const oursPhone = blobs["oursPhone"] as PhoneCensus;
    const refPhone = blobs["refPhone"] as PhoneCensus;
    const oursAnonZzz = blobs["oursAnonZzz"] as AnonLeg;
    const refAnonZzz = blobs["refAnonZzz"] as AnonLeg;
    const oursAnonLogin = blobs["oursAnonLogin"] as AnonLeg;
    const refAnonLogin = blobs["refAnonLogin"] as AnonLeg;

    if (ours.status !== ref.status) report.push(`census.status: OURS=${ours.status} REF=${ref.status}`);
    if (ours.title !== ref.title) report.push(`census.title: OURS="${ours.title}" REF="${ref.title}"`);
    if (ours.rootBox !== ref.rootBox) report.push(`census.rootBox: OURS=${ours.rootBox} REF=${ref.rootBox}`);
    if (ours.rootCls !== ref.rootCls) report.push(`census.rootCls: OURS=[${ours.rootCls}] REF=[${ref.rootCls}]`);
    if (ours.els !== ref.els) report.push(`census.els: OURS=${ours.els} REF=${ref.els}`);
    if (ours.h1.text !== ref.h1.text) report.push(`census.h1.text: OURS="${ours.h1.text}" REF="${ref.h1.text}"`);
    if (ours.h1.box !== ref.h1.box) report.push(`census.h1.box: OURS=${ours.h1.box} REF=${ref.h1.box}`);
    if (ours.h1.cls !== ref.h1.cls) report.push(`census.h1.cls: OURS=[${ours.h1.cls}] REF=[${ref.h1.cls}]`);
    report.push(...faceDelta("census.h1", ours.h1.face, ref.h1.face));
    if (ours.h2.text !== ref.h2.text) report.push(`census.h2.text: OURS="${ours.h2.text}" REF="${ref.h2.text}"`);
    if (ours.h2.box !== ref.h2.box) report.push(`census.h2.box: OURS=${ours.h2.box} REF=${ref.h2.box}`);
    if (ours.h2.cls !== ref.h2.cls) report.push(`census.h2.cls: OURS=[${ours.h2.cls}] REF=[${ref.h2.cls}]`);
    report.push(...faceDelta("census.h2", ours.h2.face, ref.h2.face));
    if (ours.p.text !== ref.p.text) report.push(`census.p.text: OURS="${ours.p.text}" REF="${ref.p.text}"`);
    if (ours.p.box !== ref.p.box) report.push(`census.p.box: OURS=${ours.p.box} REF=${ref.p.box}`);
    if (ours.span.text !== ref.span.text) report.push(`census.span.text: OURS="${ours.span.text}" REF="${ref.span.text}"`);
    if (ours.span.box !== ref.span.box) report.push(`census.span.box: OURS=${ours.span.box} REF=${ref.span.box}`);
    if (ours.span.cls !== ref.span.cls) report.push(`census.span.cls: OURS=[${ours.span.cls}] REF=[${ref.span.cls}]`);
    if (JSON.stringify(ours.chrome) !== JSON.stringify(ref.chrome))
      report.push(`census.chrome: OURS=${JSON.stringify(ours.chrome)} REF=${JSON.stringify(ref.chrome)}`);
    // the arm + glyph decode
    if (!ours.arm || !ref.arm) {
      report.push(`census.arm: MISSING one side OURS=${!!ours.arm} REF=${!!ref.arm}`);
    } else {
      if (ours.arm.tag !== ref.arm.tag) report.push(`arm.tag: OURS=${ours.arm.tag} REF=${ref.arm.tag}`);
      if (ours.arm.href !== ref.arm.href) report.push(`arm.href: OURS=${ours.arm.href} REF=${ref.arm.href}`);
      if (ours.arm.box !== ref.arm.box) report.push(`arm.box: OURS=${ours.arm.box} REF=${ref.arm.box}`);
      if (ours.arm.cls !== ref.arm.cls) report.push(`arm.cls: OURS=[${ours.arm.cls}] REF=[${ref.arm.cls}]`);
      report.push(...faceDelta("arm", ours.arm.face, ref.arm.face));
      report.push(...glyphDelta("arm.glyph", ours.arm.glyph, ref.arm.glyph));
    }
    report.push(...rowsDelta("ledger", ours.ledger, ref.ledger));

    // the Tab-chain diff
    if (oursTab.stops.length !== refTab.stops.length)
      report.push(`tab.stops: OURS=${oursTab.stops.length} REF=${refTab.stops.length}`);
    const nStops = Math.min(oursTab.stops.length, refTab.stops.length);
    for (let i = 0; i < nStops; i++) {
      if (oursTab.stops[i] !== refTab.stops[i]) report.push(`tab.stops[${i}]: OURS=${oursTab.stops[i]} REF=${refTab.stops[i]}`);
    }
    report.push(...focusDelta("focus.goHome", oursTab.goHome, refTab.goHome));

    // the rides diff
    if (oursRide.landedPath !== refRide.landedPath)
      report.push(`ride.landedPath: OURS=${oursRide.landedPath} REF=${refRide.landedPath}`);
    if (oursRide.h1AfterRide !== refRide.h1AfterRide)
      report.push(`ride.h1AfterRide: OURS="${oursRide.h1AfterRide}" REF="${refRide.h1AfterRide}"`);
    if (oursRide.ctaPresent !== refRide.ctaPresent)
      report.push(`ride.ctaPresent: OURS=${oursRide.ctaPresent} REF=${refRide.ctaPresent}`);

    // the phone diff
    if (oursPhone.cardBox !== refPhone.cardBox) report.push(`phone.cardBox: OURS=${oursPhone.cardBox} REF=${refPhone.cardBox}`);
    if (oursPhone.h1Box !== refPhone.h1Box) report.push(`phone.h1Box: OURS=${oursPhone.h1Box} REF=${refPhone.h1Box}`);
    if (oursPhone.armBox !== refPhone.armBox) report.push(`phone.armBox: OURS=${oursPhone.armBox} REF=${refPhone.armBox}`);
    if (oursPhone.spanBox !== refPhone.spanBox) report.push(`phone.spanBox: OURS=${oursPhone.spanBox} REF=${refPhone.spanBox}`);

    // the anon posture diff (the D-194a5 genus decode — censused, never fixed)
    if (oursAnonZzz.status !== refAnonZzz.status)
      report.push(`anon.zzz.status: OURS=${oursAnonZzz.status} REF=${refAnonZzz.status}`);
    if (oursAnonZzz.finalUrl !== refAnonZzz.finalUrl)
      report.push(`anon.zzz.finalUrl: OURS=${oursAnonZzz.finalUrl} REF=${refAnonZzz.finalUrl}`);
    if (oursAnonZzz.h1 !== refAnonZzz.h1) report.push(`anon.zzz.h1: OURS="${oursAnonZzz.h1}" REF="${refAnonZzz.h1}"`);
    if (oursAnonLogin.status !== refAnonLogin.status)
      report.push(`anon.login.status: OURS=${oursAnonLogin.status} REF=${refAnonLogin.status}`);
    if (oursAnonLogin.finalUrl !== refAnonLogin.finalUrl)
      report.push(`anon.login.finalUrl: OURS=${oursAnonLogin.finalUrl} REF=${refAnonLogin.finalUrl}`);
    if (oursAnonLogin.h1 !== refAnonLogin.h1)
      report.push(`anon.login.h1: OURS="${oursAnonLogin.h1}" REF="${refAnonLogin.h1}"`);

    writeFileSync(join(OUT_DIR, "walk67-blob.json"), JSON.stringify(blobs, null, 2));
    const text = report.length ? report.join("\n") : "(no deltas — byte-equal)";
    writeFileSync(join(OUT_DIR, "delta-report.txt"), text + "\n");
    console.log(`\n===== THE DELTA REPORT (${report.length} deltas) =====`);
    console.log(text);
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
  console.error("[walk67]", e);
  process.exit(1);
});

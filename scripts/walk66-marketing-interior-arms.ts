// Session-193 (walk66): THE MARKETING-INTERIOR ARMS — the two-app
// element-level ledger of the surfaces the discovery adjudicated as the
// round material (scripts/discover-193.ts): the /About + /Contact
// AUTHENTICATED INTERIORS' interactive arms inside the AppShell chrome —
// the s406 close's own naming ("the /About + /Contact authenticated
// interiors' interactive arms, if any surface beyond the census gate's
// coverage").
//
// What the standing legs already carry, and what they do NOT:
//   - the s142 census held the pages' construction (every string from
//     the reference's DOM); the s144 walk34 walked the GUEST funnel;
//     the s147 posture flip re-walled the guests (the group layout
//     only — the page files untouched since);
//   - the 156-c interior-census legs hold the main-interior GEOMETRY
//     (mainH byte-equal); the sweep holds the PIXELS;
//   - NEVER walked at the walk53-65 OPEN-LEDGER level: no DFS ledger,
//     no anchor-inventory map, no REAL keyboard Tab chain, no REAL
//     :focus-visible face, no link-ride decode — the family is 48
//     sessions stale;
//   - the s7 sidebar focus-visible ring (ring-2 ring-white/50, "a
//     deliberate a11y superset") was re-verified INVISIBLE at the
//     s177 walk50 RESTING face — its REAL keyboard face was never
//     walked, and the construction carries ZERO test teeth.
// The walk closes that gap: drive both apps through the two interiors
// (AUTHENTICATED contexts — the sweep-state storageState pair, the s162
// doctrine), dump the OPEN DOMs element-against-element (tag · class ·
// role/aria/id · text · geometry) + the anchor inventories (href/
// target/rel byte-equal decode) + the REAL keyboard Tab chains with the
// TRUE :focus-visible faces at the decoded stops (the sidebar link —
// the D-193a1 ring adjudication · the search input · the dead-stub ·
// the account trigger · the in-page anchor — the D-193a2 outline
// resolution · the footer link) + the client-nav link rides, diff the
// ledgers, classify every delta per the genus register (plan §WP-2).
//
// The arms (the walk61/65 multi-arm form — ONE battery, TWO pages):
//   Phase A — per page (about/contact), the OPEN census at the desktop
//     axis 1440×900: the main root geometry + the DFS ledger + the h1
//     face + the h2 vocabulary + the FULL anchor inventory + the
//     footer pair + the nav census.
//   Phase B — the REAL keyboard Tab drive through /about: the chain's
//     stop inventory + the REAL :focus-visible faces at the six
//     decoded stops.
//   Phase C — the link rides (write-free client nav): the
//     Get-in-touch round-trip + the footer Contact ride + the
//     back-nav round-trip.
//   Phase D — the phone axis 390×844, per page: the main box + the h1
//     box + the first anchor face + the drawer trigger census + the
//     footer stack.
//
// Run: bun scripts/walk66-marketing-interior-arms.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  legs ride the sweep-state storageState pair — the pages render only
//  inside the login-walled chrome. The DATA-STATE discipline: every arm
//  is data-INDEPENDENT (static server content + session-borne chrome);
//  the EXTERNAL navigations are NEVER fired — the mailto/social rides
//  stay census-only, the destructive-arm discipline.)
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
const OUT_DIR = join(REPO, "scripts", "walk66");

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
}

interface AnchorCensus {
  text: string;
  href: string;
  target: string;
  rel: string;
  cls: string;
  box: string;
  face: Face | null;
}

interface PageCensus {
  found: boolean;
  path: string;
  mainBox: string;
  mainCls: string;
  mainH: number;
  els: number;
  ledger: Row[] | null;
  h1: { text: string; box: string; cls: string; face: Face | null };
  h2s: string[];
  anchors: AnchorCensus[] | null;
  footerLinks: { text: string; href: string; box: string }[];
  navLinks: string[];
}

interface FocusFace {
  label: string;
  shadow: string;
  outline: string;
  bg: string;
}

interface TabDrive {
  stops: string[];
  sidebar1: FocusFace | null;
  searchInput: FocusFace | null;
  messagesStub: FocusFace | null;
  accountTrigger: FocusFace | null;
  inpage1: FocusFace | null;
  footer1: FocusFace | null;
}

interface RideResult {
  getInTouchLanded: string;
  h1AfterRide: string;
  footerRideLanded: string;
  h1AfterFooterRide: string;
  backLanded: string;
}

interface PhoneCensus {
  found: boolean;
  path: string;
  mainBox: string;
  h1Box: string;
  firstAnchor: { text: string; href: string; box: string } | null;
  drawerTrigger: { found: boolean; box: string; ariaLabel: string } | null;
  footerBox: string;
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
    fontWeight: cs.fontWeight,
  };
})`;

const LEDGER_JS = `(el => {
  const ledger = [];
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
  const normCls = (s) => s.split(/\\s+/).filter(Boolean).sort().join(" ");
  collect(el, 0);
  return ledger;
})`;

const ANCHORS_JS = `(el => {
  return Array.from(el.querySelectorAll("a")).map((a) => {
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return {
      text: (a.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 60),
      href: a.getAttribute("href") || "(none)",
      target: a.getAttribute("target") || "(none)",
      rel: a.getAttribute("rel") || "(none)",
      cls: (a.getAttribute("class") || "").split(/\\s+/).filter(Boolean).sort().join(" "),
      box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
      face: { bg: cs.backgroundColor, color: cs.color, border: cs.border, boxShadow: cs.boxShadow, borderRadius: cs.borderRadius, outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, fontWeight: cs.fontWeight },
    };
  });
})`;

/** Phase A — the per-page OPEN census at the desktop axis. */
async function pageCensus(page: import("@playwright/test").Page, base: string, path: string): Promise<PageCensus> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2400);
  const empty: PageCensus = {
    found: false,
    path,
    mainBox: "",
    mainCls: "",
    mainH: 0,
    els: 0,
    ledger: null,
    h1: { text: "", box: "", cls: "", face: null },
    h2s: [],
    anchors: null,
    footerLinks: [],
    navLinks: [],
  };
  return ((await page
    .evaluate(
      `(async () => {
        const main = document.querySelector("main");
        if (!main) return ${JSON.stringify(empty)};
        const mr = main.getBoundingClientRect();
        const h1 = main.querySelector("h1");
        const hr = h1 ? h1.getBoundingClientRect() : null;
        const h1cs = h1 ? getComputedStyle(h1) : null;
        const footer = document.querySelector("footer");
        const footerLinks = footer ? Array.from(footer.querySelectorAll("a")).map((a) => {
          const r = a.getBoundingClientRect();
          return { text: (a.textContent || "").trim(), href: a.getAttribute("href") || "(none)", box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height) };
        }) : [];
        const nav = document.querySelector("nav");
        const navLinks = nav ? Array.from(nav.querySelectorAll("a")).map((a) => (a.textContent || "").trim()).filter(Boolean) : [];
        const ledger = ${LEDGER_JS}(main.querySelector("h1") ? main.querySelector("h1").parentElement : main);
        const anchors = ${ANCHORS_JS}(main);
        return {
          found: true,
          path: location.pathname,
          mainBox: Math.round(mr.x) + "," + Math.round(mr.y) + " " + Math.round(mr.width) + "x" + Math.round(mr.height),
          mainCls: (main.getAttribute("class") || "").split(/\\s+/).filter(Boolean).sort().join(" "),
          mainH: Math.round(mr.height),
          els: main.querySelectorAll("*").length,
          ledger,
          h1: {
            text: h1 ? (h1.textContent || "").trim() : "(none)",
            box: hr ? Math.round(hr.x) + "," + Math.round(hr.y) + " " + Math.round(hr.width) + "x" + Math.round(hr.height) : "(none)",
            cls: h1 ? (h1.getAttribute("class") || "").split(/\\s+/).filter(Boolean).sort().join(" ") : "(none)",
            face: h1cs ? { bg: h1cs.backgroundColor, color: h1cs.color, border: h1cs.border, boxShadow: h1cs.boxShadow, borderRadius: h1cs.borderRadius, outline: h1cs.outlineWidth + " " + h1cs.outlineStyle + " " + h1cs.outlineColor, fontWeight: h1cs.fontWeight } : null,
          },
          h2s: Array.from(main.querySelectorAll("h2")).map((h) => (h.textContent || "").trim()),
          anchors,
          footerLinks,
          navLinks,
        };
      })()`,
    )
    .catch(() => empty))) as PageCensus;
}

/** Phase B — the REAL keyboard Tab drive through the page. Six decoded
 * stops capture the FULL focus face (shadow + outline, untruncated). */
async function tabDrive(page: import("@playwright/test").Page, base: string, path: string): Promise<TabDrive> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2400);
  await page.locator("body").click({ position: { x: 8, y: 8 } }).catch(() => undefined);
  await page.waitForTimeout(300);
  const out: TabDrive = {
    stops: [],
    sidebar1: null,
    searchInput: null,
    messagesStub: null,
    accountTrigger: null,
    inpage1: null,
    footer1: null,
  };
  const seenFirstInpage = { done: false };
  const seenFirstFooter = { done: false };
  const seenMessages = { done: false };
  for (let i = 0; i < 22; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(150);
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
          x: Math.round(r.x),
          box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
          face: { label, shadow: cs.boxShadow, outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, bg: cs.backgroundColor },
          inMain: !!el.closest("main"),
          inFooter: !!el.closest("footer"),
          inNav: !!el.closest("nav"),
        };
      })()`,
    )) as { tag: string; label: string; x: number; box: string; face: FocusFace; inMain: boolean; inFooter: boolean; inNav: boolean };
    if (stop.tag === "body") {
      out.stops.push("(body — chain end)");
      break;
    }
    out.stops.push(`${stop.tag} "${stop.label}" @${stop.box}`);
    // the six decoded stops (first-of-family only; the stub/trigger keyed
    // by GEOMETRY — the REF carries no aria-labels, its labels are the
    // visible text, so text-matching would miss the capture)
    if (stop.inNav && !out.sidebar1) out.sidebar1 = stop.face;
    if (stop.tag === "input" && !out.searchInput) out.searchInput = stop.face;
    if (stop.tag === "button" && stop.x >= 1070 && stop.x <= 1090 && !seenMessages.done) {
      out.messagesStub = stop.face;
      seenMessages.done = true;
    }
    if (stop.tag === "button" && stop.x >= 1180 && !out.accountTrigger) out.accountTrigger = stop.face;
    if (stop.inMain && !stop.inNav && !seenFirstInpage.done) {
      out.inpage1 = stop.face;
      seenFirstInpage.done = true;
    }
    if (stop.inFooter && !seenFirstFooter.done) {
      out.footer1 = stop.face;
      seenFirstFooter.done = true;
    }
  }
  return out;
}

/** Phase C — the link rides (write-free client nav). */
async function ridePhase(page: import("@playwright/test").Page, base: string): Promise<RideResult> {
  const out: RideResult = { getInTouchLanded: "", h1AfterRide: "", footerRideLanded: "", h1AfterFooterRide: "", backLanded: "" };
  await page.goto(`${base}/about`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2200);
  const getInTouch = page.locator('main a:has-text("Get in touch")').first();
  if (await getInTouch.count()) {
    await getInTouch.click();
    await page.waitForTimeout(1400);
    out.getInTouchLanded = page.url().replace(base, "");
    out.h1AfterRide = (await page
      .evaluate(`document.querySelector("main h1") ? document.querySelector("main h1").textContent.trim() : "(none)"`)
      .catch(() => "(none)")) as string;
  }
  // the footer Contact link ride (on /contact now)
  const footerContact = page.locator('footer a:has-text("Contact")').first();
  if (await footerContact.count()) {
    await footerContact.click();
    await page.waitForTimeout(1400);
    out.footerRideLanded = page.url().replace(base, "");
    out.h1AfterFooterRide = (await page
      .evaluate(`document.querySelector("main h1") ? document.querySelector("main h1").textContent.trim() : "(none)"`)
      .catch(() => "(none)")) as string;
  }
  // the back-nav round-trip via the footer About link
  const footerAbout = page.locator('footer a:has-text("About")').first();
  if (await footerAbout.count()) {
    await footerAbout.click();
    await page.waitForTimeout(1400);
    out.backLanded = page.url().replace(base, "");
  }
  return out;
}

/** Phase D — the phone-axis census per page. */
async function phoneCensus(page: import("@playwright/test").Page, base: string, path: string): Promise<PhoneCensus> {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2400);
  return ((await page
    .evaluate(
      `(() => {
        const main = document.querySelector("main");
        if (!main) return { found: false, path: ${JSON.stringify(path)} };
        const mr = main.getBoundingClientRect();
        const h1 = main.querySelector("h1");
        const hr = h1 ? h1.getBoundingClientRect() : null;
        const firstAnchor = main.querySelector("a");
        const ar = firstAnchor ? firstAnchor.getBoundingClientRect() : null;
        const trigger = document.querySelector('header button[aria-label="Open navigation"], header button[aria-label="Toggle navigation"]');
        const tr = trigger ? trigger.getBoundingClientRect() : null;
        const footer = document.querySelector("footer");
        const fr = footer ? footer.getBoundingClientRect() : null;
        return {
          found: true,
          path: location.pathname,
          mainBox: Math.round(mr.x) + "," + Math.round(mr.y) + " " + Math.round(mr.width) + "x" + Math.round(mr.height),
          h1Box: hr ? Math.round(hr.x) + "," + Math.round(hr.y) + " " + Math.round(hr.width) + "x" + Math.round(hr.height) : "(none)",
          firstAnchor: firstAnchor && ar
            ? { text: (firstAnchor.textContent || "").trim().slice(0, 40), href: firstAnchor.getAttribute("href") || "(none)", box: Math.round(ar.x) + "," + Math.round(ar.y) + " " + Math.round(ar.width) + "x" + Math.round(ar.height) }
            : null,
          drawerTrigger: trigger && tr
            ? { found: true, box: Math.round(tr.x) + "," + Math.round(tr.y) + " " + Math.round(tr.width) + "x" + Math.round(tr.height), ariaLabel: trigger.getAttribute("aria-label") || "(none)" }
            : { found: false, box: "", ariaLabel: "" },
          footerBox: fr ? Math.round(fr.x) + "," + Math.round(fr.y) + " " + Math.round(fr.width) + "x" + Math.round(fr.height) : "(none)",
        };
      })()`,
    )
    .catch(() => ({ found: false, path, mainBox: "", h1Box: "", firstAnchor: null, drawerTrigger: null, footerBox: "" })))) as PhoneCensus;
}

// ===== the diff machinery (the walk65 form) =====

function normCls(cls: string): string {
  return cls
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

function faceDelta(name: string, a: Face | null | undefined, b: Face | null | undefined): string[] {
  const out: string[] = [];
  if (!a && !b) return out;
  if (!a || !b) return [`${name}: FACE MISSING one side`];
  const keys: Array<keyof Face> = ["bg", "color", "border", "boxShadow", "borderRadius", "outline", "fontWeight"];
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

function anchorsDelta(name: string, ours: AnchorCensus[] | null, ref: AnchorCensus[] | null): string[] {
  const out: string[] = [];
  if (!ours || !ref) return [`${name}: ANCHORS MISSING one side`];
  if (ours.length !== ref.length) out.push(`${name}.count: OURS=${ours.length} REF=${ref.length}`);
  const n = Math.min(ours.length, ref.length);
  for (let i = 0; i < n; i++) {
    const a = ours[i];
    const b = ref[i];
    const tag = `${name}[${i}]"${a.text.slice(0, 24)}"`;
    if (a.href !== b.href) out.push(`${tag}.href: OURS=${a.href} REF=${b.href}`);
    if (a.target !== b.target) out.push(`${tag}.target: OURS=${a.target} REF=${b.target}`);
    if (a.rel !== b.rel) out.push(`${tag}.rel: OURS=${a.rel} REF=${b.rel}`);
    if (a.box !== b.box) out.push(`${tag}.box: OURS=${a.box} REF=${b.box}`);
    if (a.cls !== b.cls) out.push(`${tag}.cls: OURS=[${a.cls}] REF=[${b.cls}]`);
    out.push(...faceDelta(tag, a.face, b.face));
  }
  return out;
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[walk66] reusing the dev server on :3000");
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
    console.log("[walk66] pair state: ready (the s162 guarded form)");
    const blobs: Record<string, unknown> = {};

    for (const [label, base] of [
      ["ours", OUR_URL],
      ["ref", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n===== ${label} @1440 =====`);
      // Phase A — the OPEN census per page
      for (const p of ["/about", "/contact"]) {
        const c = await pageCensus(page, base, p);
        blobs[`${label}${p}`] = c;
        console.log(`  [A ${p}] found=${c.found} main=${c.mainBox} H=${c.mainH} els=${c.els} h1="${c.h1.text}" ${c.h1.box}`);
        console.log(`    h2s(${c.h2s.length})=[${c.h2s.join(" | ")}] anchors=${c.anchors?.length ?? 0} footer=${c.footerLinks.length} nav=${c.navLinks.length}`);
      }
      // Phase B — the REAL Tab drive (about only — the contact chain shares the chrome)
      const t = await tabDrive(page, base, "/about");
      blobs[`${label}Tab`] = t;
      console.log(`  [B tab] stops=${t.stops.length}`);
      t.stops.forEach((s, i) => console.log(`    ${i + 1}. ${s}`));
      // Phase C — the link rides
      const r = await ridePhase(page, base);
      blobs[`${label}Ride`] = r;
      console.log(`  [C ride] getInTouch->${r.getInTouchLanded} (h1 "${r.h1AfterRide}") footerContact->${r.footerRideLanded} (h1 "${r.h1AfterFooterRide}") back->${r.backLanded}`);
      await ctx.close();
    }

    // the phone axis
    for (const [label, base] of [
      ["ours", OUR_URL],
      ["ref", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n===== ${label} @390 =====`);
      for (const p of ["/about", "/contact"]) {
        const c = await phoneCensus(page, base, p);
        blobs[`${label}${p}Phone`] = c;
        console.log(
          `  [D ${p}] main=${c.mainBox} h1=${c.h1Box} firstAnchor=${c.firstAnchor ? `${c.firstAnchor.text}@${c.firstAnchor.box}` : "(none)"} drawer=${c.drawerTrigger?.found ? `${c.drawerTrigger.box} aria=${c.drawerTrigger.ariaLabel}` : "NOT FOUND"} footer=${c.footerBox}`,
        );
      }
      await ctx.close();
    }

    // ===== the delta report =====
    const oursAbout = blobs["ours/about"] as PageCensus;
    const refAbout = blobs["ref/about"] as PageCensus;
    const oursContact = blobs["ours/contact"] as PageCensus;
    const refContact = blobs["ref/contact"] as PageCensus;
    const oursTab = blobs["oursTab"] as TabDrive;
    const refTab = blobs["refTab"] as TabDrive;
    const oursRide = blobs["oursRide"] as RideResult;
    const refRide = blobs["refRide"] as RideResult;

    for (const [nm, a, b] of [
      ["about", oursAbout, refAbout],
      ["contact", oursContact, refContact],
    ] as const) {
      if (a.mainBox !== b.mainBox) report.push(`${nm}.mainBox: OURS=${a.mainBox} REF=${b.mainBox}`);
      if (a.mainH !== b.mainH) report.push(`${nm}.mainH: OURS=${a.mainH} REF=${b.mainH}`);
      if (a.els !== b.els) report.push(`${nm}.els: OURS=${a.els} REF=${b.els}`);
      if (a.mainCls !== b.mainCls) report.push(`${nm}.mainCls: OURS=[${a.mainCls}] REF=[${b.mainCls}]`);
      if (a.h1.text !== b.h1.text) report.push(`${nm}.h1.text: OURS="${a.h1.text}" REF="${b.h1.text}"`);
      if (a.h1.box !== b.h1.box) report.push(`${nm}.h1.box: OURS=${a.h1.box} REF=${b.h1.box}`);
      if (a.h1.cls !== b.h1.cls) report.push(`${nm}.h1.cls: OURS=[${a.h1.cls}] REF=[${b.h1.cls}]`);
      report.push(...faceDelta(`${nm}.h1`, a.h1.face, b.h1.face));
      if (JSON.stringify(a.h2s) !== JSON.stringify(b.h2s)) report.push(`${nm}.h2s: OURS=[${a.h2s}] REF=[${b.h2s}]`);
      report.push(...anchorsDelta(`${nm}.anchors`, a.anchors, b.anchors));
      if (JSON.stringify(a.footerLinks) !== JSON.stringify(b.footerLinks))
        report.push(`${nm}.footerLinks: OURS=${JSON.stringify(a.footerLinks)} REF=${JSON.stringify(b.footerLinks)}`);
      if (JSON.stringify(a.navLinks) !== JSON.stringify(b.navLinks))
        report.push(`${nm}.navLinks: OURS=[${a.navLinks}] REF=[${b.navLinks}]`);
      report.push(...rowsDelta(`${nm}.ledger`, a.ledger, b.ledger));
    }

    // the Tab-chain diff (structural: the stop vocabulary + geometry)
    if (oursTab.stops.length !== refTab.stops.length)
      report.push(`tab.stops: OURS=${oursTab.stops.length} REF=${refTab.stops.length}`);
    const nStops = Math.min(oursTab.stops.length, refTab.stops.length);
    for (let i = 0; i < nStops; i++) {
      if (oursTab.stops[i] !== refTab.stops[i]) report.push(`tab.stops[${i}]: OURS=${oursTab.stops[i]} REF=${refTab.stops[i]}`);
    }
    report.push(...focusDelta("focus.sidebar1", oursTab.sidebar1, refTab.sidebar1));
    report.push(...focusDelta("focus.searchInput", oursTab.searchInput, refTab.searchInput));
    report.push(...focusDelta("focus.messagesStub", oursTab.messagesStub, refTab.messagesStub));
    report.push(...focusDelta("focus.accountTrigger", oursTab.accountTrigger, refTab.accountTrigger));
    report.push(...focusDelta("focus.inpage1", oursTab.inpage1, refTab.inpage1));
    report.push(...focusDelta("focus.footer1", oursTab.footer1, refTab.footer1));

    // the rides diff
    const rideKeys: Array<keyof RideResult> = [
      "getInTouchLanded",
      "h1AfterRide",
      "footerRideLanded",
      "h1AfterFooterRide",
      "backLanded",
    ];
    for (const k of rideKeys) {
      if (oursRide[k] !== refRide[k]) report.push(`ride.${k}: OURS=${oursRide[k]} REF=${refRide[k]}`);
    }

    // the phone diff
    for (const p of ["/about", "/contact"]) {
      const a = blobs[`ours${p}Phone`] as PhoneCensus;
      const b = blobs[`ref${p}Phone`] as PhoneCensus;
      const nm = `${p.replace("/", "")}Phone`;
      if (a.mainBox !== b.mainBox) report.push(`${nm}.mainBox: OURS=${a.mainBox} REF=${b.mainBox}`);
      if (a.h1Box !== b.h1Box) report.push(`${nm}.h1Box: OURS=${a.h1Box} REF=${b.h1Box}`);
      if (JSON.stringify(a.firstAnchor) !== JSON.stringify(b.firstAnchor))
        report.push(`${nm}.firstAnchor: OURS=${JSON.stringify(a.firstAnchor)} REF=${JSON.stringify(b.firstAnchor)}`);
      if (JSON.stringify(a.drawerTrigger) !== JSON.stringify(b.drawerTrigger))
        report.push(`${nm}.drawerTrigger: OURS=${JSON.stringify(a.drawerTrigger)} REF=${JSON.stringify(b.drawerTrigger)}`);
      if (a.footerBox !== b.footerBox) report.push(`${nm}.footerBox: OURS=${a.footerBox} REF=${b.footerBox}`);
    }

    writeFileSync(join(OUT_DIR, "walk66-blob.json"), JSON.stringify(blobs, null, 2));
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
  console.error("[walk66]", e);
  process.exit(1);
});

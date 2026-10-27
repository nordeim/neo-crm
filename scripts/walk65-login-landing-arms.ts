// Session-192 (walk65): THE LOGIN ANON-SURFACE INTERIORS + THE LANDING
// MARKETING ARMS — the two-app element-level ledger of the two surfaces
// the s404 close adjudicated as the round material (the discovery
// probe's live adjudication, scripts/discover-192.ts): the LOGIN page's
// anon-surface interiors (the signin resting card + the view machine's
// OPEN interiors — the signup/reset/sent views) and the LANDING page's
// marketing arms (the FAQ single-open accordion + the mobile disclosure
// menu) — all LIVE on BOTH apps, byte-equal at the census level.
//
// What the standing legs already carry, and what they do NOT:
//   - the s111/s126 login walks censused the computed styles + the
//     viewStack heights — never the OPEN element ledger, never the
//     id map, never the REAL keyboard faces; the family is 28 sessions
//     stale (the s163 auth retrofit touched the sent view's
//     construction, never re-walked since);
//   - the s143 walk33 + the s155 public leg censused the landing
//     anatomy + the four-axis geometry — never the FAQ/menu OPEN-state
//     interiors;
//   - the s11/s21/s79/s111 LOGIN_* pins + the s142 landing-page pins
//     are OURS-only source regexes — never the two-app id map;
//   - the e2e auth battery pins OUR behavior — OURS only;
//   - the drift sweeps carry PIXELS of the /login resting page (the
//     public-leg landing too) — never an OPEN interior.
// The walk closes that gap: drive both apps through the login view
// ladder (signin → signup → reset → sent — the client-state arms only,
// the signin/signup submits NEVER fired; the ONE write-free exception:
// the sent-view ride's nonexistent-email forgot-password POST, the
// no-enumeration 200 family — write-free on both apps, the
// reference's own forgot-password is client-side theater) + the
// landing arms (the FAQ single-open ride + the mobile disclosure menu
// ride), dump the OPEN DOMs element-against-element (tag · class ·
// role/aria/id/type/for · text · geometry) + the computed faces RESTING
// and under the REAL keyboard Tab drive (:focus-visible fires only
// under real keyboard focus, which no sweep drives), diff the
// ledgers, classify every delta per the genus register (plan §WP-2).
// The ID-PARITY adjudication is this round's decode spine: the full
// id map live on both apps per view, every delta classified under the
// D-114a2/D-187a1/D-190a1/D-191a1/a2 ids-are-construction-parity
// doctrine (the reference's literal ids restored; the aria supersets
// kept).
//
// The arms (the walk61 multi-arm form — ONE battery, TWO surfaces):
//   Phase A — per login view (signin/signup/reset/sent), the OPEN
//     census at the desktop axis 1440×900: the card root geometry +
//     the DFS ledger + the heading + the FULL inputs census (the id
//     map) + the labels wiring map + the google button + the divider +
//     the submit face + the back/footer links + the mount focus — the
//     view rides (the footer-link clicks) + the back-nav round-trips.
//   Phase B — the REAL keyboard Tab drive through the signin card:
//     the chain through the card's focusables + the REAL
//     :focus-visible faces at the email input, the Google button, and
//     the submit.
//   Phase C — the state decode: the view-flip draft round-trip (type
//     in the signin email → flip to reset → flip back — the
//     client-state contract on both apps).
//   Phase D — the phone axis 390×844, per view: the card root box +
//     the first input's face + the submit face + the heading box.
//   Phase E — the FAQ arm @1440: the resting census (Q1 open by
//     default) + the Q2 click-open ride (the single-open decode) +
//     the Q3 re-ride (the open-item switch).
//   Phase F — the mobile disclosure menu arm @390: the hamburger
//     resting face + the click-open ride (the OPEN panel census) +
//     the icon-swap decode + the re-toggle close.
//   Phase G — the CTA faces @both axes (light census): the hero CTA
//     pair + the pricing tier buttons' computed faces (the
//     brand-token genus evidence).
//
// Run: bun scripts/walk65-login-landing-arms.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  anon legs ride FRESH contexts on BOTH apps — no login, no
//  storageState; the standing authenticated legs are NOT in this
//  battery, they rode the discovery.)
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

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
const OUT_DIR = join(REPO, "scripts", "walk65");

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

/** The computed face — the effective-layer style probe (the walk51-64
 * form: the VISIBLE carriers; the zero-width v4 variable-chain shadow
 * slots never enter the comparison). */
interface Face {
  bg: string;
  color: string;
  border: string;
  boxShadow: string;
  borderRadius: string;
  outline: string;
  fontWeight: string;
}

interface InputCensus {
  tag: string;
  id: string;
  type: string;
  placeholder: string;
  cls: string;
  box: string;
  font: string;
  lineHeight: string;
  face: Face | null;
}

interface LabelCensus {
  text: string;
  for: string;
  cls: string;
}

interface BtnCensus {
  text: string;
  cls: string;
  box: string;
  face: Face | null;
  disabled: boolean;
}

interface ViewCensus {
  found: boolean;
  view: string;
  rootBox: string;
  rootCls: string;
  rootFace: Face | null;
  ledger: Row[] | null;
  heading: string;
  headingCls: string;
  subline: string;
  inputs: InputCensus[] | null;
  labels: LabelCensus[] | null;
  google: BtnCensus | null;
  submit: BtnCensus | null;
  back: BtnCensus | null;
  dividerPresent: boolean;
  mountFocus: string;
  mountFocusFace: Face | null;
  backNavLanded: string;
}

interface TabResult {
  stops: string[];
  emailFocus: { outline: string; ring: string } | null;
  googleFocus: { outline: string; ring: string } | null;
  submitFocus: { outline: string; ring: string } | null;
}

interface DraftResult {
  typedEmail: string;
  afterResetFlip: string;
  afterBackFlip: string;
  refBehavior: string;
}

interface FaqCensus {
  found: boolean;
  sectionBox: string;
  containerCls: string;
  questions: { text: string; ariaExpanded: string; cls: string; box: string }[];
  answers: string[];
  chevrons: { rotated: boolean; cls: string }[];
}

interface MenuCensus {
  found: boolean;
  triggerBox: string;
  triggerCls: string;
  triggerFace: Face | null;
  triggerAriaLabel: string;
  triggerAriaExpanded: string;
  panelBox: string;
  panelCls: string;
  links: string[];
  iconSwapped: boolean;
  closedAfterRetoggle: boolean;
}

interface CtaCensus {
  found: boolean;
  heroCtas: { text: string; box: string; bg: string; color: string; radius: string }[];
  pricingCtas: { text: string; box: string; bg: string; color: string }[];
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
      if (attr.name.startsWith("aria-") || attr.name === "data-state" || attr.name === "id" || attr.name === "type" || attr.name === "for" || attr.name === "tabindex" || attr.name === "accept") aria[attr.name] = attr.value;
    }
    const text = Array.from(node.childNodes).filter((n) => n.nodeType === 3).map((n) => (n.textContent ?? "").trim()).join(" ").trim().slice(0, 40);
    const r2 = node.getBoundingClientRect();
    ledger.push({ i: ledger.length, depth, tag: node.tagName.toLowerCase(), cls: (node.getAttribute("class") ?? "").trim(), role: node.getAttribute("role"), aria, text, box: { x: Math.round(r2.x), y: Math.round(r2.y), w: Math.round(r2.width), h: Math.round(r2.height) } });
    for (const child of Array.from(node.children)) collect(child, depth + 1);
  };
  collect(el, 0);
  return ledger;
})`;

/** The OPEN-card census anchor: the card div (rounded-2xl + shadow-2xl
 * — the two-app shared construction; the h1/h2 chains both bottom out
 * at it). */
const CARD_QUERY_JS = `document.querySelector('div[class*="rounded-2xl"][class*="shadow-2xl"]')`;

/** The per-view OPEN census (Phase A + D share the form). viewIn:
 * "signin" | "signup" | "reset" | "sent". */
async function viewPhase(
  browser: import("@playwright/test").Browser,
  base: string,
  axis: { w: number; h: number },
  view: "signin" | "signup" | "reset" | "sent",
): Promise<ViewCensus> {
  const ctx = await browser.newContext({ viewport: { width: axis.w, height: axis.h } });
  const page = await ctx.newPage();
  const out: ViewCensus = {
    found: false, view, rootBox: "", rootCls: "", rootFace: null, ledger: null,
    heading: "", headingCls: "", subline: "", inputs: null, labels: null,
    google: null, submit: null, back: null, dividerPresent: false,
    mountFocus: "", mountFocusFace: null, backNavLanded: "",
  };
  try {
    await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2400);

    // the view rides (client state only — the signin/signup submits
    // NEVER fired; the sent ride's forgot-password POST carries a
    // guaranteed-nonexistent email, the no-enumeration 200 family,
    // write-free on both apps)
    if (view === "signup") {
      const link = page.locator('button:has-text("Sign up"), a:has-text("Sign up")').first();
      if (await link.count()) { await link.click(); await page.waitForTimeout(800); }
    } else if (view === "reset" || view === "sent") {
      const link = page.locator('button:has-text("Forgot password?")').first();
      if (await link.count()) { await link.click(); await page.waitForTimeout(800); }
    }
    if (view === "sent") {
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.count()) {
        await emailInput.fill("walk192probe@example.com");
        const send = page.locator('button[type="submit"]:has-text("Send reset link")').first();
        if (await send.count()) {
          await send.click();
          await page.waitForTimeout(1800);
        }
      }
    }

    const census = (await page.evaluate(`(() => {
      const card = ${CARD_QUERY_JS};
      if (!card) return null;
      const rr = card.getBoundingClientRect();
      const h = card.querySelector("h1, h2");
      const inputs = Array.from(card.querySelectorAll("input, textarea")).map((inp) => {
        const cs = getComputedStyle(inp);
        const r = inp.getBoundingClientRect();
        return {
          tag: inp.tagName.toLowerCase(),
          id: inp.id ?? "",
          type: (inp.getAttribute("type") ?? ""),
          placeholder: (inp.getAttribute("placeholder") ?? ""),
          cls: (inp.getAttribute("class") ?? "").slice(0, 200),
          box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
          font: cs.fontSize + "/" + cs.fontWeight,
          lineHeight: cs.lineHeight,
          face: ${FACE_JS}(inp),
        };
      });
      const labels = Array.from(card.querySelectorAll("label")).map((l) => ({
        text: (l.textContent ?? "").trim().slice(0, 40),
        for: l.getAttribute("for") ?? "",
        cls: (l.getAttribute("class") ?? "").slice(0, 120),
      }));
      const btnFace = (b) => {
        const r = b.getBoundingClientRect();
        return { text: (b.textContent ?? "").trim().slice(0, 34), cls: (b.getAttribute("class") ?? "").slice(0, 160), box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height), face: ${FACE_JS}(b), disabled: b.disabled };
      };
      const google = Array.from(card.querySelectorAll("button")).find((b) => /continue with google/i.test(b.textContent ?? ""));
      const submit = card.querySelector('button[type="submit"]');
      const back = Array.from(card.querySelectorAll("button")).find((b) => /back to sign in/i.test(b.textContent ?? ""));
      const divider = !!card.querySelector("div[class*=divide-y], hr, div[class*='h-px']");
      const subline = h ? ((h.parentElement && h.parentElement.querySelector("p"))?.textContent ?? h.closest("div")?.querySelector("p")?.textContent ?? "").trim().slice(0, 60) : "";
      const ae = document.activeElement;
      const mountName = ae ? ae.tagName + "/" + ((ae.getAttribute("aria-label") ?? ae.textContent ?? "").trim().slice(0, 24) || "(no text)") + (ae.id ? "#" + ae.id : "") : "(none)";
      return {
        rootCls: card.getAttribute("class") ?? "",
        rootBox: Math.round(rr.x) + "," + Math.round(rr.y) + " " + Math.round(rr.width) + "x" + Math.round(rr.height),
        rootFace: ${FACE_JS}(card),
        ledger: ${LEDGER_JS}(card),
        heading: h ? (h.textContent ?? "").trim() : "(none)",
        headingCls: h ? (h.getAttribute("class") ?? "") : "",
        subline,
        inputs, labels,
        google: google ? btnFace(google) : null,
        submit: submit ? btnFace(submit) : null,
        back: back ? btnFace(back) : null,
        dividerPresent: divider,
        mountFocus: mountName,
        mountFocusFace: ae ? ${FACE_JS}(ae) : null,
      };
    })()`).catch(() => null)) as (Omit<ViewCensus, "found" | "view" | "backNavLanded"> & { ledger: Row[] }) | null;
    if (!census) return out;
    out.found = true;
    out.rootCls = census.rootCls;
    out.rootBox = census.rootBox;
    out.rootFace = census.rootFace;
    out.ledger = census.ledger;
    out.heading = census.heading;
    out.headingCls = census.headingCls;
    out.subline = census.subline;
    out.inputs = census.inputs;
    out.labels = census.labels;
    out.google = census.google;
    out.submit = census.submit;
    out.back = census.back;
    out.dividerPresent = census.dividerPresent;
    out.mountFocus = census.mountFocus;
    out.mountFocusFace = census.mountFocusFace;

    // the back-nav round-trip (the non-signin views)
    if (view !== "signin") {
      const backBtn = page.locator('button:has-text("Back to sign in")').first();
      if (await backBtn.count()) {
        await backBtn.click();
        await page.waitForTimeout(600);
        out.backNavLanded = (await page.evaluate(`(() => { const h = ${CARD_QUERY_JS}?.querySelector("h1, h2"); return h ? (h.textContent ?? "").trim() : "(none)"; })()`)) as string;
      }
    } else {
      out.backNavLanded = "(n/a)";
    }
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase B — the REAL keyboard Tab drive through the signin card: the
 * chain through the card's focusables + the REAL :focus-visible faces
 * at the email input, the Google button, the submit. */
async function tabPhase(
  browser: import("@playwright/test").Browser,
  base: string,
): Promise<TabResult> {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out: TabResult = { stops: [], emailFocus: null, googleFocus: null, submitFocus: null };
  try {
    await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2400);

    const describe = (): Promise<string> =>
      page.evaluate(`(() => {
        const ae = document.activeElement;
        if (!ae) return "(none)";
        const cs = getComputedStyle(ae);
        const r = ae.getBoundingClientRect();
        const name = (ae.getAttribute("aria-label") ?? ae.getAttribute("placeholder") ?? ae.textContent ?? "").trim().slice(0, 26) || "(no text)";
        return ae.tagName.toLowerCase() + "[" + name + "]" + (ae.id ? "#" + ae.id : "") + "@" + Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height) + " outline=" + cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor + " ring=" + cs.boxShadow.slice(0, 130);
      })()`) as Promise<string>;

    out.stops.push(`start:${await describe()}`);

    // the chain: Tab through the card's controls until the wrap (the
    // wrap check rides the tag+box repeat against stop 1's)
    const stop1TagBox = (await page.evaluate(`(() => {
      const ae = document.activeElement; if (!ae) return "body";
      const r = ae.getBoundingClientRect();
      return ae.tagName.toLowerCase() + "@" + Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height);
    })()`)) as string;
    let wrapped = false;
    for (let t = 0; t < 14 && !wrapped; t++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      const stop = (await page.evaluate(`(() => {
        const ae = document.activeElement;
        if (!ae) return "?";
        const cs = getComputedStyle(ae);
        const inCard = !!ae.closest('div[class*="rounded-2xl"][class*="shadow-2xl"]');
        const r = ae.getBoundingClientRect();
        const name = (ae.getAttribute("aria-label") ?? ae.getAttribute("placeholder") ?? ae.textContent ?? "").trim().slice(0, 22) || "(no text)";
        return (inCard ? "" : "(OUTSIDE) ") + ae.tagName.toLowerCase() + "[" + name + "]" + (ae.id ? "#" + ae.id : "") + " ring=" + cs.boxShadow.split("rgba").length + "slots outline=" + cs.outlineWidth + " " + cs.outlineStyle;
      })()`)) as string;
      const tagBox = (await page.evaluate(`(() => {
        const ae = document.activeElement; if (!ae) return "?";
        const r = ae.getBoundingClientRect();
        return ae.tagName.toLowerCase() + "@" + Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height);
      })()`)) as string;
      out.stops.push(`tab${t + 1}:${stop}`);
      if (stop.includes("(OUTSIDE)") || (t > 1 && tagBox === stop1TagBox)) wrapped = true;
    }

    // the REAL focus faces at the three targets: fresh drive per target
    const refocus = async (predicate: string, budget = 12): Promise<{ outline: string; ring: string } | null> => {
      await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);
      for (let i = 0; i < budget; i++) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(180);
        const hit = (await page.evaluate(`(() => { const ae = document.activeElement; return !!ae && (${predicate}); })()`)) as boolean;
        if (hit) {
          return (await page.evaluate(`(() => { const cs = getComputedStyle(document.activeElement); return { outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, ring: cs.boxShadow }; })()`)) as { outline: string; ring: string };
        }
      }
      return null;
    };
    out.emailFocus = await refocus(`ae.tagName === "INPUT" && ae.type === "email"`);
    out.googleFocus = await refocus(`/continue with google/i.test(ae.textContent ?? "")`);
    out.submitFocus = await refocus(`ae.getAttribute("type") === "submit"`);
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase C — the state decode: the view-flip draft round-trip. Type a
 * distinctive value in the signin email field, flip to the reset view,
 * census the reset email field's value, flip back, census the signin
 * email field's value — the client-state contract on both apps. */
async function draftPhase(
  browser: import("@playwright/test").Browser,
  base: string,
): Promise<DraftResult> {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out: DraftResult = { typedEmail: "", afterResetFlip: "", afterBackFlip: "", refBehavior: "" };
  try {
    await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2400);
    const email = page.locator('input[type="email"]').first();
    await email.fill("draft-roundtrip@walk192.test");
    out.typedEmail = (await email.inputValue()) as string;
    await page.locator('button:has-text("Forgot password?")').first().click();
    await page.waitForTimeout(700);
    const resetEmail = page.locator('input[type="email"]').first();
    out.afterResetFlip = (await resetEmail.inputValue()) as string;
    await page.locator('button:has-text("Back to sign in")').first().click();
    await page.waitForTimeout(600);
    out.afterBackFlip = (await page.evaluate(`(() => {
      const inp = document.querySelector('input[type="email"]');
      return inp ? inp.value : "(none)";
    })()`)) as string;
    out.refBehavior = `${out.typedEmail ? "typed" : "empty"} -> reset:"${out.afterResetFlip}" -> back:"${out.afterBackFlip}"`;
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase E — the FAQ arm @1440: the resting census (Q1 open by
 * default) + the Q2 click-open ride (the single-open decode) + the Q3
 * re-ride (the open-item switch). Pure client state. */
async function faqPhase(
  browser: import("@playwright/test").Browser,
  base: string,
  ride: "rest" | "q2" | "q3",
): Promise<FaqCensus> {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out: FaqCensus = { found: false, sectionBox: "", containerCls: "", questions: [], answers: [], chevrons: [] };
  try {
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
    await page.locator("header").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2400);
    if (ride === "q2") {
      const q2 = page.locator('section button', { hasText: "Is my data separate" }).first();
      if (await q2.count()) { await q2.click(); await page.waitForTimeout(600); }
    } else if (ride === "q3") {
      const q2 = page.locator('section button', { hasText: "Is my data separate" }).first();
      if (await q2.count()) { await q2.click(); await page.waitForTimeout(400); }
      const q3 = page.locator('section button', { hasText: "Can I bring my existing contacts" }).first();
      if (await q3.count()) { await q3.click(); await page.waitForTimeout(600); }
    }
    const census = (await page.evaluate(`(() => {
      const faq = Array.from(document.querySelectorAll("section")).find((s) => /questions, answered/i.test(s.querySelector("h2")?.textContent ?? ""));
      if (!faq) return null;
      const r = faq.getBoundingClientRect();
      const container = faq.querySelector("div[class*='max-w']");
      const btns = Array.from(faq.querySelectorAll("button")).map((b) => {
        const br = b.getBoundingClientRect();
        return {
          text: (b.textContent ?? "").trim().slice(0, 40),
          ariaExpanded: b.getAttribute("aria-expanded") ?? "(none)",
          cls: (b.getAttribute("class") ?? "").slice(0, 140),
          box: Math.round(br.x) + "," + Math.round(br.y) + " " + Math.round(br.width) + "x" + Math.round(br.height),
        };
      });
      const answers = Array.from(faq.querySelectorAll("p")).filter((p) => (p.textContent ?? "").length > 40).map((p) => (p.textContent ?? "").trim().slice(0, 44));
      const chevrons = Array.from(faq.querySelectorAll("button svg")).map((s) => ({
        rotated: (s.getAttribute("class") ?? "").includes("rotate-180"),
        cls: (s.getAttribute("class") ?? "").slice(0, 100),
      }));
      return {
        sectionBox: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
        containerCls: container ? (container.getAttribute("class") ?? "") : "(none)",
        questions: btns, answers, chevrons,
      };
    })()`).catch(() => null)) as Omit<FaqCensus, "found"> | null;
    if (!census) return out;
    out.found = true;
    out.sectionBox = census.sectionBox;
    out.containerCls = census.containerCls;
    out.questions = census.questions;
    out.answers = census.answers;
    out.chevrons = census.chevrons;
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase F — the mobile disclosure menu arm @390: the hamburger resting
 * face + the click-open ride (the OPEN panel census + the link
 * vocabulary + their faces) + the icon-swap decode + the re-toggle
 * close. Pure client state. */
async function menuPhase(
  browser: import("@playwright/test").Browser,
  base: string,
): Promise<MenuCensus> {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const out: MenuCensus = {
    found: false, triggerBox: "", triggerCls: "", triggerFace: null, triggerAriaLabel: "", triggerAriaExpanded: "",
    panelBox: "", panelCls: "", links: [], iconSwapped: false, closedAfterRetoggle: false,
  };
  try {
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
    await page.locator("header").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2400);
    const rest = (await page.evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll("header button")).find((b) => /toggle navigation|menu/i.test(b.getAttribute("aria-label") ?? ""));
      if (!btn) return null;
      const r = btn.getBoundingClientRect();
      return {
        box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
        cls: (btn.getAttribute("class") ?? "").slice(0, 140),
        face: ${FACE_JS}(btn),
        ariaLabel: btn.getAttribute("aria-label") ?? "(none)",
        ariaExpanded: btn.getAttribute("aria-expanded") ?? "(none)",
      };
    })()`).catch(() => null)) as { box: string; cls: string; face: Face; ariaLabel: string; ariaExpanded: string } | null;
    if (!rest) return out;
    out.found = true;
    out.triggerBox = rest.box;
    out.triggerCls = rest.cls;
    out.triggerFace = rest.face;
    out.triggerAriaLabel = rest.ariaLabel;
    out.triggerAriaExpanded = rest.ariaExpanded;
    // the click-open ride
    const btn = page.locator('header button[aria-label="Toggle navigation"]').first();
    if (await btn.count()) {
      await btn.click();
      await page.waitForTimeout(700);
      const open = (await page.evaluate(`(() => {
        const panel = document.querySelector("header div[class*='md:hidden']");
        if (!panel) return null;
        const r = panel.getBoundingClientRect();
        return {
          panelBox: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
          panelCls: (panel.getAttribute("class") ?? "").slice(0, 160),
          links: Array.from(panel.querySelectorAll("a")).map((a) => (a.textContent ?? "").trim()),
          iconSwapped: !!document.querySelector("header button svg[class*='lucide-x']"),
        };
      })()`).catch(() => null)) as Pick<MenuCensus, "panelBox" | "panelCls" | "links" | "iconSwapped"> | null;
      if (open) {
        out.panelBox = open.panelBox;
        out.panelCls = open.panelCls;
        out.links = open.links;
        out.iconSwapped = open.iconSwapped;
      }
      // the re-toggle close
      await btn.click();
      await page.waitForTimeout(500);
      out.closedAfterRetoggle = (await page.evaluate(`(() => !document.querySelector("header div[class*='md:hidden']"))()`)) as boolean;
    }
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase G — the CTA faces @both axes (light census): the hero CTA
 * pair + the pricing tier buttons' computed faces (the brand-token
 * genus evidence). */
async function ctaPhase(
  browser: import("@playwright/test").Browser,
  base: string,
  axis: { w: number; h: number },
): Promise<CtaCensus> {
  const ctx = await browser.newContext({ viewport: { width: axis.w, height: axis.h } });
  const page = await ctx.newPage();
  const out: CtaCensus = { found: false, heroCtas: [], pricingCtas: [] };
  try {
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
    await page.locator("header").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2400);
    const census = (await page.evaluate(`(() => {
      const ctaFace = (el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return { text: (el.textContent ?? "").trim().slice(0, 30), box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height), bg: cs.backgroundColor, color: cs.color, radius: cs.borderRadius };
      };
      const hero = Array.from(document.querySelectorAll("a")).filter((a) => /^(open dashboard|see pricing|start free|get started)$/i.test((a.textContent ?? "").trim()));
      const pricing = Array.from(document.querySelectorAll("button, a")).filter((a) => /^start with (standard|pro|advanced)$/i.test((a.textContent ?? "").trim()));
      return {
        heroCtas: hero.map(ctaFace),
        pricingCtas: pricing.map((el) => {
          const f = ctaFace(el);
          return { text: f.text, box: f.box, bg: f.bg, color: f.color };
        }),
      };
    })()`).catch(() => null)) as Pick<CtaCensus, "heroCtas" | "pricingCtas"> | null;
    if (!census) return out;
    out.found = true;
    out.heroCtas = census.heroCtas;
    out.pricingCtas = census.pricingCtas;
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

function faceDelta(name: string, a: Face | null | undefined, b: Face | null | undefined): string[] {
  const out: string[] = [];
  if (!a || !b) {
    if (a || b) out.push(`${name}: presence OURS=${!!a} REF=${!!b}`);
    return out;
  }
  for (const k of Object.keys(a) as Array<keyof Face>) {
    if (a[k] !== b[k]) out.push(`${name}.${k}: OURS "${String(a[k]).slice(0, 200)}" | REF "${String(b[k]).slice(0, 200)}"`);
  }
  return out;
}

/** The token/aria/class normalization for the structural diffs (the
 * s88-c9 aria superset + the M-81c2 token pair + the class-order
 * genera — normalized, never compared raw). */
function normCls(cls: string): string {
  return cls
    .replace(/\bborder-line\b/g, "border-TOKEN")
    .replace(/\bborder-input\b/g, "border-TOKEN")
    .replace(/\bborder-primary\b/g, "border-DARKTOKEN")
    .replace(/\bborder-neutral-900\b/g, "border-DARKTOKEN")
    .replace(/\btext-ink\b/g, "text-TOKEN")
    .replace(/\btext-foreground\b/g, "text-TOKEN")
    .replace(/\bbg-surface\b/g, "bg-POPTOKEN")
    .replace(/\bbg-background\b/g, "bg-POPTOKEN")
    .replace(/\bhover:bg-line-soft\b/g, "hover:bg-HOVERTOKEN")
    .replace(/\bhover:bg-accent\b/g, "hover:bg-HOVERTOKEN")
    .replace(/\bhover:text-neutral-900\b/g, "hover:text-HOVERTOKEN")
    .replace(/\bhover:text-accent-foreground\b/g, "hover:text-HOVERTOKEN")
    .replace(/\btext-primary-foreground\b/g, "text-DARKTOKEN")
    .replace(/\btext-neutral-50\b/g, "text-DARKTOKEN")
    .replace(/\bbg-primary\b/g, "bg-DARKTOKEN")
    .replace(/\bbg-neutral-900\b/g, "bg-DARKTOKEN")
    .replace(/\btext-muted-ink\b/g, "text-TRACKTOKEN")
    .replace(/\btext-muted-foreground\b/g, "text-TRACKTOKEN")
    .replace(/\btext-card-foreground\b/g, "text-TOKEN")
    .replace(/\bring-offset-background\b/g, "")
    .replace(/\boutline-none\b/g, "OUTLINENONE")
    .replace(/\s+/g, " ")
    .trim();
}

function diffRows(name: string, ours: Row[] | null, ref: Row[] | null): string[] {
  const out: string[] = [];
  if (!ours || !ref) {
    out.push(`${name}: presence OURS=${!!ours} REF=${!!ref}`);
    return out;
  }
  const norm = (r: Row) => ({ ...r, cls: normCls(r.cls) });
  const o = ours.map(norm);
  const r = ref.map(norm);
  const max = Math.max(o.length, r.length);
  let structural = 0;
  for (let i = 0; i < max; i++) {
    const a = o[i];
    const b = r[i];
    if (!a || !b) { out.push(`${name}[${i}]: presence OURS=${!!a} REF=${!!b}`); structural++; continue; }
    if (a.depth !== b.depth || a.tag !== b.tag || a.cls !== b.cls) {
      out.push(`${name}[${i}] d${a.depth}/${b.depth} <${a.tag}>/<${b.tag}>: cls OURS "${a.cls.slice(0, 90)}" | REF "${b.cls.slice(0, 90)}"`);
      structural++;
    }
    const ja = JSON.stringify(a.aria, Object.keys(a.aria).sort());
    const jb = JSON.stringify(b.aria, Object.keys(b.aria).sort());
    if (ja !== jb) out.push(`${name}[${i}] <${a.tag}> aria/id: OURS ${ja.slice(0, 160)} | REF ${jb.slice(0, 160)}`);
  }
  if (!structural) out.push(`${name}: rows STRUCTURALLY IDENTICAL (${o.length} rows) modulo the aria/id naming`);
  return out;
}

/** The id-map report: the inputs census side by side (the id-parity
 * adjudication's evidence — the reference's literal ids vs ours). */
function idMapDiff(name: string, ours: InputCensus[] | null, ref: InputCensus[] | null): string[] {
  const out: string[] = [];
  if (!ours || !ref) {
    out.push(`${name}.inputs: presence OURS=${!!ours} REF=${!!ref}`);
    return out;
  }
  const max = Math.max(ours.length, ref.length);
  for (let i = 0; i < max; i++) {
    const a = ours[i];
    const b = ref[i];
    if (!a || !b) { out.push(`${name}.inputs[${i}]: presence OURS=${!!a} REF=${!!b}`); continue; }
    const sameType = a.tag === b.tag && a.type === b.type;
    const samePh = a.placeholder === b.placeholder;
    const sameId = a.id === b.id;
    if (!sameType || !samePh || !sameId) {
      out.push(`${name}.inputs[${i}] ${a.tag}<${a.type}>: id OURS "${a.id}" | REF "${b.id}"${sameType ? "" : ` · type OURS ${a.type} REF ${b.type}`}${samePh ? "" : ` · ph OURS "${a.placeholder}" REF "${b.placeholder}"`}`);
    }
  }
  out.push(`${name}.inputs: ${ours.length} OURS / ${ref.length} REF (the byte-equal rows omitted)`);
  return out;
}

/** The label-wiring report: the labels' for-map side by side. */
function labelMapDiff(name: string, ours: LabelCensus[] | null, ref: LabelCensus[] | null): string[] {
  const out: string[] = [];
  if (!ours || !ref) {
    out.push(`${name}.labels: presence OURS=${!!ours} REF=${!!ref}`);
    return out;
  }
  const max = Math.max(ours.length, ref.length);
  let wiredOurs = 0;
  let wiredRef = 0;
  for (let i = 0; i < max; i++) {
    const a = ours[i];
    const b = ref[i];
    if (a?.for) wiredOurs++;
    if (b?.for) wiredRef++;
    if (a && b && (a.text !== b.text || a.for !== b.for)) {
      out.push(`${name}.labels[${i}] "${a.text}" for="${a.for}" | REF "${b.text}" for="${b.for}"`);
    }
  }
  out.push(`${name}.labels: ${ours.length} OURS (wired ${wiredOurs}) / ${ref.length} REF (wired ${wiredRef})`);
  return out;
}

function btnDiff(name: string, ours: BtnCensus | null, ref: BtnCensus | null, report: string[]): void {
  if (!ours || !ref) {
    if (ours || ref) report.push(`${name}: presence OURS=${!!ours} REF=${!!ref}`);
    else report.push(`${name}: absent on both`);
    return;
  }
  report.push(`${name}: OURS "${ours.text}" ${ours.box}${ours.disabled ? " [disabled]" : ""} | REF "${ref.text}" ${ref.box}${ref.disabled ? " [disabled]" : ""}`);
  report.push(...faceDelta(`${name}.face`, ours.face, ref.face).map((l) => `  ${l}`));
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[walk65] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    console.log("[walk65] the anon battery: FRESH contexts on BOTH apps (no login, no storageState)");
    mkdirSync(OUT_DIR, { recursive: true });
    const report: string[] = [];
    const VIEWS = ["signin", "signup", "reset", "sent"] as const;

    // ===== Phases A + D — the per-view OPEN census at BOTH axes =====
    for (const view of VIEWS) {
      report.push(`\n######## LOGIN VIEW: ${view.toUpperCase()} ########`);
      for (const axis of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
        const oursV = await viewPhase(browser, OUR_URL, axis, view);
        const refV = await viewPhase(browser, REF_URL, axis, view);
        writeFileSync(join(OUT_DIR, `ours-${view}-${axis.w}.json`), JSON.stringify(oursV, null, 2));
        writeFileSync(join(OUT_DIR, `ref-${view}-${axis.w}.json`), JSON.stringify(refV, null, 2));
        report.push(`\n===== ${view.toUpperCase()} @${axis.w}x${axis.h} =====`);
        report.push(`found: OURS ${oursV.found} | REF ${refV.found}`);
        report.push(`card root: OURS ${oursV.rootBox} | REF ${refV.rootBox}`);
        report.push(`root.cls: OURS "${oursV.rootCls}"`);
        report.push(`          REF  "${refV.rootCls}"`);
        report.push(...faceDelta(`${view}.root.face`, oursV.rootFace, refV.rootFace));
        report.push(`heading: OURS "${oursV.heading}" | REF "${refV.heading}"`);
        report.push(`heading.cls: OURS "${oursV.headingCls}" | REF "${refV.headingCls}"`);
        if (oursV.subline || refV.subline) report.push(`subline: OURS "${oursV.subline}" | REF "${refV.subline}"`);
        report.push(...idMapDiff(view, oursV.inputs, refV.inputs));
        report.push(...labelMapDiff(view, oursV.labels, refV.labels));
        btnDiff(`${view}.google`, oursV.google, refV.google, report);
        btnDiff(`${view}.submit`, oursV.submit, refV.submit, report);
        btnDiff(`${view}.back`, oursV.back, refV.back, report);
        report.push(`divider: OURS ${oursV.dividerPresent} | REF ${refV.dividerPresent}`);
        report.push(`mountFocus: OURS "${oursV.mountFocus}" | REF "${refV.mountFocus}"`);
        report.push(...faceDelta(`${view}.mountFocus.face`, oursV.mountFocusFace, refV.mountFocusFace));
        report.push(`backNavLanded: OURS "${oursV.backNavLanded}" | REF "${refV.backNavLanded}"`);
        report.push(...diffRows(`${view}Ledger@${axis.w}`, oursV.ledger, refV.ledger));
      }
    }

    // ===== Phase B — the REAL keyboard Tab drive through the signin card =====
    const oursTab = await tabPhase(browser, OUR_URL);
    const refTab = await tabPhase(browser, REF_URL);
    writeFileSync(join(OUT_DIR, "ours-signin-tab.json"), JSON.stringify(oursTab, null, 2));
    writeFileSync(join(OUT_DIR, "ref-signin-tab.json"), JSON.stringify(refTab, null, 2));
    report.push(`\n===== SIGNIN REAL-TAB CHAIN @1440x900 =====`);
    const tagOf = (s: string) => s.split(":")[1]?.split("[")[0] ?? s;
    const oursTags = oursTab.stops.map(tagOf);
    const refTags = refTab.stops.map(tagOf);
    if (JSON.stringify(oursTags) !== JSON.stringify(refTags)) {
      report.push(`CHAIN DELTA: OURS [${oursTags.join(" → ")}]`);
      report.push(`            REF  [${refTags.join(" → ")}]`);
    } else {
      report.push(`CHAIN: STRUCTURALLY IDENTICAL (${oursTags.length} stops — the tag sequence byte-equal)`);
    }
    report.push(`OURS chain: [${oursTab.stops.map((s) => s.split(" outline=")[0]).join(" → ")}]`);
    report.push(`REF  chain: [${refTab.stops.map((s) => s.split(" outline=")[0]).join(" → ")}]`);
    report.push(`REAL FOCUS-VISIBLE on the email input: OURS outline="${oursTab.emailFocus?.outline}" ring="${oursTab.emailFocus?.ring.slice(0, 160)}"`);
    report.push(`                                    REF  outline="${refTab.emailFocus?.outline}" ring="${refTab.emailFocus?.ring.slice(0, 160)}"`);
    report.push(`REAL FOCUS-VISIBLE on the google button: OURS outline="${oursTab.googleFocus?.outline}" ring="${oursTab.googleFocus?.ring.slice(0, 160)}"`);
    report.push(`                                     REF  outline="${refTab.googleFocus?.outline}" ring="${refTab.googleFocus?.ring.slice(0, 160)}"`);
    report.push(`REAL FOCUS-VISIBLE on the submit: OURS outline="${oursTab.submitFocus?.outline}" ring="${oursTab.submitFocus?.ring.slice(0, 160)}"`);
    report.push(`                               REF  outline="${refTab.submitFocus?.outline}" ring="${refTab.submitFocus?.ring.slice(0, 160)}"`);

    // ===== Phase C — the state decode =====
    const oursDraft = await draftPhase(browser, OUR_URL);
    const refDraft = await draftPhase(browser, REF_URL);
    writeFileSync(join(OUT_DIR, "ours-draft.json"), JSON.stringify(oursDraft, null, 2));
    writeFileSync(join(OUT_DIR, "ref-draft.json"), JSON.stringify(refDraft, null, 2));
    report.push(`\n===== VIEW-FLIP DRAFT DECODE @1440x900 =====`);
    report.push(`OURS: ${oursDraft.refBehavior}`);
    report.push(`REF:  ${refDraft.refBehavior}`);
    report.push(`draft-kept-on-reset: OURS ${oursDraft.afterResetFlip === oursDraft.typedEmail} | REF ${refDraft.afterResetFlip === refDraft.typedEmail}`);
    report.push(`draft-kept-on-back: OURS ${oursDraft.afterBackFlip === oursDraft.typedEmail} | REF ${refDraft.afterBackFlip === refDraft.typedEmail}`);

    // ===== Phase E — the FAQ arm =====
    for (const ride of ["rest", "q2", "q3"] as const) {
      const oursF = await faqPhase(browser, OUR_URL, ride);
      const refF = await faqPhase(browser, REF_URL, ride);
      writeFileSync(join(OUT_DIR, `ours-faq-${ride}.json`), JSON.stringify(oursF, null, 2));
      writeFileSync(join(OUT_DIR, `ref-faq-${ride}.json`), JSON.stringify(refF, null, 2));
      report.push(`\n===== FAQ ${ride.toUpperCase()} @1440x900 =====`);
      report.push(`found: OURS ${oursF.found} | REF ${refF.found}`);
      report.push(`sectionBox: OURS ${oursF.sectionBox} | REF ${refF.sectionBox}`);
      report.push(`containerCls: OURS "${oursF.containerCls}" | REF "${refF.containerCls}"`);
      const qs = Math.max(oursF.questions.length, refF.questions.length);
      for (let i = 0; i < qs; i++) {
        const a = oursF.questions[i];
        const b = refF.questions[i];
        if (a && b) report.push(`q[${i}]: OURS "${a.text}" aria=${a.ariaExpanded} ${a.box} | REF "${b.text}" aria=${b.ariaExpanded} ${b.box}`);
        else report.push(`q[${i}]: presence OURS=${!!a} REF=${!!b}`);
      }
      report.push(`answers: OURS (${oursF.answers.length}) [${oursF.answers.map((x) => x.slice(0, 24)).join(" | ")}]`);
      report.push(`         REF  (${refF.answers.length}) [${refF.answers.map((x) => x.slice(0, 24)).join(" | ")}]`);
      report.push(`chevrons rotated: OURS [${oursF.chevrons.map((c) => c.rotated).join(",")}] | REF [${refF.chevrons.map((c) => c.rotated).join(",")}]`);
    }

    // ===== Phase F — the mobile disclosure menu arm =====
    const oursM = await menuPhase(browser, OUR_URL);
    const refM = await menuPhase(browser, REF_URL);
    writeFileSync(join(OUT_DIR, "ours-menu.json"), JSON.stringify(oursM, null, 2));
    writeFileSync(join(OUT_DIR, "ref-menu.json"), JSON.stringify(refM, null, 2));
    report.push(`\n===== MOBILE DISCLOSURE MENU @390x844 =====`);
    report.push(`found: OURS ${oursM.found} | REF ${refM.found}`);
    report.push(`trigger: OURS ${oursM.triggerBox} aria="${oursM.triggerAriaLabel}" expanded=${oursM.triggerAriaExpanded} | REF ${refM.triggerBox} aria="${refM.triggerAriaLabel}" expanded=${refM.triggerAriaExpanded}`);
    report.push(`trigger.cls: OURS "${oursM.triggerCls}" | REF "${refM.triggerCls}"`);
    report.push(...faceDelta("menu.trigger.face", oursM.triggerFace, refM.triggerFace));
    report.push(`panel OPEN: OURS ${oursM.panelBox} | REF ${refM.panelBox}`);
    report.push(`panel.cls: OURS "${oursM.panelCls}" | REF "${refM.panelCls}"`);
    report.push(`links: OURS (${oursM.links.length}) [${oursM.links.join(" | ")}]`);
    report.push(`       REF  (${refM.links.length}) [${refM.links.join(" | ")}]`);
    report.push(`iconSwapped: OURS ${oursM.iconSwapped} | REF ${refM.iconSwapped}`);
    report.push(`closedAfterRetoggle: OURS ${oursM.closedAfterRetoggle} | REF ${refM.closedAfterRetoggle}`);

    // ===== Phase G — the CTA faces @both axes =====
    for (const axis of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
      const oursC = await ctaPhase(browser, OUR_URL, axis);
      const refC = await ctaPhase(browser, REF_URL, axis);
      writeFileSync(join(OUT_DIR, `ours-cta-${axis.w}.json`), JSON.stringify(oursC, null, 2));
      writeFileSync(join(OUT_DIR, `ref-cta-${axis.w}.json`), JSON.stringify(refC, null, 2));
      report.push(`\n===== CTA FACES @${axis.w}x${axis.h} =====`);
      for (let i = 0; i < Math.max(oursC.heroCtas.length, refC.heroCtas.length); i++) {
        const a = oursC.heroCtas[i];
        const b = refC.heroCtas[i];
        if (a && b) report.push(`hero[${i}]: OURS "${a.text}" ${a.box} bg=${a.bg} color=${a.color} | REF "${b.text}" ${b.box} bg=${b.bg} color=${b.color}`);
        else report.push(`hero[${i}]: presence OURS=${!!a} REF=${!!b}`);
      }
      for (let i = 0; i < Math.max(oursC.pricingCtas.length, refC.pricingCtas.length); i++) {
        const a = oursC.pricingCtas[i];
        const b = refC.pricingCtas[i];
        if (a && b) report.push(`pricing[${i}]: OURS "${a.text}" ${a.box} bg=${a.bg} color=${a.color} | REF "${b.text}" ${b.box} bg=${b.bg} color=${b.color}`);
        else report.push(`pricing[${i}]: presence OURS=${!!a} REF=${!!b}`);
      }
    }

    writeFileSync(join(OUT_DIR, "delta-report.txt"), report.join("\n"));
    console.log(report.join("\n"));
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
  console.error("[walk65]", e);
  process.exit(1);
});

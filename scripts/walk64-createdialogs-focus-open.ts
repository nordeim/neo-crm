// Session-191 (walk64): THE THREE CREATE DIALOGS' OPEN FACES — the two-app
// element-level ledger of the three unwalked members of the create-dialog
// family, the discovery probe's live adjudication (scripts/discover-191):
// the CONTACT (the s15/s30-era avatar + photo-upload construction), the
// ACCOUNT (the s15/s5-era 8-field 2-col grid), and the EVENT (the
// s15/s76 WIDE family) create dialogs — all LIVE on BOTH apps, byte-equal
// at the census level, their OPEN interiors + REAL focus faces never
// walked under ADR-022 (the walk54/58 family opened Lead + Log-Activity
// two-app; the a11y dialog-open family pins OURS only; walk54's family
// chrome freezes are OURS-only source pins).
//
// What the standing legs already carry, and what they do NOT:
//   - the s112 geometry lens walked the 7-dialog CONTENT-BOX axes × 2
//     viewports + the mount-focus census (the D1 genus) — never the OPEN
//     element ledger or the REAL keyboard faces;
//   - the s172 named-controls layer pinned OURS' htmlFor/id wiring —
//     OURS only, never the two-app id map;
//   - the s19/s30 source pins hold OUR wiring regexes (ct-phone tel, the
//     accept trio, zero datalists) — never the reference's own
//     construction, never the call-site chains;
//   - the e2e battery pins OUR behavior (the a11y dialog-open family,
//     the geometry specs) — OURS only;
//   - the drift sweeps carry PIXELS of the resting pages — never an
//     OPEN dialog interior.
// The walk closes that gap: open each dialog on both apps, dump the
// OPEN DOMs element-against-element (tag · class · role/aria/id/type/for ·
// text · geometry) + the computed faces of the trigger/title/inputs/
// comboboxes/footer RESTING and under the REAL keyboard Tab drive
// (:focus-visible fires only under real keyboard focus, which no sweep
// drives), diff the ledgers, classify every delta per the genus register
// (plan §WP-2). The ID-PARITY adjudication is this round's decode spine:
// the full id map live on both apps, every delta classified under the
// D-114a2/D-187a1/D-190a1 ids-are-construction-parity doctrine (the
// reference's literal ids restored; the reference's id-less arms decoded
// as the kept s172 superset).
//
// The arms (the walk61 multi-arm form — ONE battery, THREE dialogs):
//   Phase A — per dialog, the OPEN census at the desktop axis 1440×900:
//     the trigger's resting face + the click-open ride + the root
//     geometry + the DFS ledger + the title + the FULL inputs census
//     (id/type/placeholder/cls/box/computed font/face — the id map) +
//     the labels census (text/for — the wiring map) + the combobox
//     triggers + the contact's file-input construction + the footer's
//     Cancel/Create pair + the close X + the mount focus + the Escape
//     round-trip.
//   Phase B — per dialog, the REAL keyboard Tab drive through the OPEN
//     dialog (the walk54/58/63 focus form): the mount-focus stop + the
//     chain through the dialog's focusables until the wrap + the REAL
//     :focus-visible faces at the first input + a combobox + the Create
//     submit + the Escape close.
//   Phase C — the interactive arms (client-state only, the Create
//     submits NEVER fired on either app): the CONTACT meet-select ride
//     (the listbox OPEN face + the option vocabulary + the REAL
//     data-highlighted face under ArrowDown) · the ACCOUNT status-select
//     ride · the EVENT related-to pick ride (the CONDITIONAL Name field
//     appearance — the M-76c13 decode) · the cancel-then-reopen state
//     decode on the contact arm (the epoch-remount contract on OURS vs
//     the reference's own behavior).
//   Phase D — the phone axis 390×844, per dialog: the phone root box +
//     the first input's face + the footer pair.
//
// Run: bun scripts/walk64-createdialogs-focus-open.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  reference rides the sweep-state storageState pair, the s162 doctrine.)
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
const OUT_DIR = join(REPO, "scripts", "walk64");

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

/** The computed face — the effective-layer style probe (the walk51-63
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

interface ComboboxCensus {
  aria: string;
  text: string;
  cls: string;
  box: string;
  face: Face | null;
}

interface DialogCensus {
  found: boolean;
  triggerText: string;
  triggerFace: Face | null;
  triggerBox: string;
  triggerCls: string;
  rootBox: string;
  rootFace: Face | null;
  rootCls: string;
  ledger: Row[] | null;
  title: string;
  titleCls: string;
  inputs: InputCensus[] | null;
  labels: LabelCensus[] | null;
  comboboxes: ComboboxCensus[] | null;
  fileInput: { accept: string; tabIndex: string; cls: string; id: string } | null;
  footer: Array<{ text: string; disabled: boolean; face: Face | null; box: string }>;
  closeAria: string;
  mountFocus: string;
  mountFocusFace: Face | null;
  escapeClosed: boolean;
}

interface TabResult {
  stops: string[];
  firstInputFocus: { outline: string; ring: string } | null;
  comboboxFocus: { outline: string; ring: string } | null;
  submitFocus: { outline: string; ring: string } | null;
  escapeClosed: boolean;
}

interface SelectRideResult {
  opened: boolean;
  contentBox: string;
  contentCls: string;
  optionTexts: string[];
  firstOptionFace: Face | null;
  highlightedFace: Face | null;
  closedAfter: string;
}

interface ConditionalRideResult {
  relatedPick: string;
  conditionalAppeared: boolean | null;
  conditionalPlaceholder: string;
  conditionalBox: string;
  formGrowth: string;
}

interface CancelReopenResult {
  typedThenCancelled: boolean;
  reopenedValue: string;
}

interface DialogCfg {
  key: string;
  path: string;
  trigger: string;
  submitText: string;
}

const DIALOGS: DialogCfg[] = [
  { key: "contact", path: "/contacts", trigger: "New Contact", submitText: "Create Contact" },
  { key: "account", path: "/accounts", trigger: "New Account", submitText: "Create Account" },
  { key: "event", path: "/calendar", trigger: "New Event", submitText: "Create Event" },
];

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

/** Phase A — per dialog, the OPEN census: the trigger's resting face,
 * the click-open ride, the root geometry + DFS ledger, the title, the
 * FULL inputs census (the id map), the labels census (the wiring map),
 * the combobox triggers, the contact's file input, the footer pair,
 * the close X, the mount focus, the Escape round-trip. */
async function dialogPhase(
  browser: import("@playwright/test").Browser,
  base: string,
  state: unknown,
  axis: { w: number; h: number },
  cfg: DialogCfg,
): Promise<DialogCensus> {
  const ctx = await browser.newContext({ viewport: { width: axis.w, height: axis.h }, storageState: state as never });
  const page = await ctx.newPage();
  const out: DialogCensus = {
    found: false, triggerText: "", triggerFace: null, triggerBox: "", triggerCls: "",
    rootBox: "", rootFace: null, rootCls: "", ledger: null,
    title: "", titleCls: "", inputs: null, labels: null, comboboxes: null, fileInput: null,
    footer: [], closeAria: "", mountFocus: "", mountFocusFace: null, escapeClosed: false,
  };
  try {
    await page.goto(`${base}${cfg.path}`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2600);

    // A1 — the trigger's resting face (pre-click)
    const trigger = page.locator(`main button:has-text("${cfg.trigger}")`).first();
    if (!(await trigger.count())) return out;
    out.found = true;
    out.triggerText = ((await trigger.textContent()) ?? "").trim();
    const t = (await page.evaluate(`(() => {
      const el = Array.from(document.querySelectorAll("main button")).find((b) => (b.textContent ?? "").includes("${cfg.trigger}"));
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { face: ${FACE_JS}(el), cls: el.getAttribute("class") ?? "", box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height) };
    })()`).catch(() => null)) as { face: Face; cls: string; box: string } | null;
    if (!t) return out;
    out.triggerFace = t.face;
    out.triggerCls = t.cls;
    out.triggerBox = t.box;

    // A2 — the click-open ride + the OPEN census
    await trigger.click();
    await page.waitForTimeout(1000);
    const census = (await page.evaluate(`(() => {
      const dlg = document.querySelector('[role="dialog"][data-state="open"], [role="dialog"]');
      if (!dlg) return null;
      const rr = dlg.getBoundingClientRect();
      const title = dlg.querySelector("h2, [data-slot='dialog-title'], h1, [role='heading']");
      const inputs = Array.from(dlg.querySelectorAll("input, textarea")).map((inp) => {
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
      const labels = Array.from(dlg.querySelectorAll("label")).map((l) => ({
        text: (l.textContent ?? "").trim().slice(0, 40),
        for: l.getAttribute("for") ?? "",
        cls: (l.getAttribute("class") ?? "").slice(0, 120),
      }));
      const combos = Array.from(dlg.querySelectorAll('button[role="combobox"]')).map((c) => {
        const r = c.getBoundingClientRect();
        return {
          aria: c.getAttribute("aria-label") ?? "(none)",
          text: (c.textContent ?? "").trim().slice(0, 30),
          cls: (c.getAttribute("class") ?? "").slice(0, 200),
          box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
          face: ${FACE_JS}(c),
        };
      });
      const file = dlg.querySelector('input[type="file"]');
      const fileInput = file ? {
        accept: file.getAttribute("accept") ?? "(none)",
        tabIndex: file.getAttribute("tabindex") ?? "(none)",
        cls: (file.getAttribute("class") ?? "").slice(0, 80),
        id: file.id ?? "",
      } : null;
      const btns = Array.from(dlg.querySelectorAll("button"));
      const footerBtns = btns.filter((b) => /^(Cancel|${cfg.submitText.replace(/[()]/g, "\\$&")})$/.test((b.textContent ?? "").trim()) || (b.getAttribute("class") ?? "").includes("absolute"));
      const x = btns.find((b) => (b.getAttribute("class") ?? "").includes("absolute"));
      const ae = document.activeElement;
      const mountName = ae ? ae.tagName + "/" + ((ae.getAttribute("aria-label") ?? ae.textContent ?? "").trim().slice(0, 24) || "(no text)") + (ae.id ? "#" + ae.id : "") : "(none)";
      return {
        rootCls: dlg.getAttribute("class") ?? "",
        rootBox: Math.round(rr.x) + "," + Math.round(rr.y) + " " + Math.round(rr.width) + "x" + Math.round(rr.height),
        rootFace: ${FACE_JS}(dlg),
        ledger: ${LEDGER_JS}(dlg),
        title: title ? (title.textContent ?? "").trim() : "(none)",
        titleCls: title ? (title.getAttribute("class") ?? "") : "",
        inputs, labels, comboboxes: combos, fileInput,
        footer: footerBtns.map((b) => {
          const r = b.getBoundingClientRect();
          return { text: (b.textContent ?? "").trim().slice(0, 30), disabled: b.disabled, face: ${FACE_JS}(b), box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height) };
        }),
        closeAria: x ? (x.getAttribute("aria-label") ?? "(none)") : "(no X)",
        mountFocus: mountName,
        mountFocusFace: ae ? ${FACE_JS}(ae) : null,
      };
    })()`).catch(() => null)) as (Omit<DialogCensus, "found" | "triggerText" | "triggerFace" | "triggerBox" | "triggerCls" | "escapeClosed"> & { ledger: Row[] }) | null;
    if (!census) return out;
    out.rootCls = census.rootCls;
    out.rootBox = census.rootBox;
    out.rootFace = census.rootFace;
    out.ledger = census.ledger;
    out.title = census.title;
    out.titleCls = census.titleCls;
    out.inputs = census.inputs;
    out.labels = census.labels;
    out.comboboxes = census.comboboxes;
    out.fileInput = census.fileInput;
    out.footer = census.footer;
    out.closeAria = census.closeAria;
    out.mountFocus = census.mountFocus;
    out.mountFocusFace = census.mountFocusFace;

    // A3 — the Escape close round-trip
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    out.escapeClosed = (await page.evaluate(`(() => !document.querySelector('[role="dialog"][data-state="open"]'))()`)) as boolean;
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase B — per dialog, the REAL keyboard Tab drive through the OPEN
 * dialog (the walk54/58/63 focus form): the mount-focus stop, the chain
 * through the dialog's focusables until the wrap, the REAL
 * :focus-visible faces at the first input + a combobox + the Create
 * submit, the Escape close. */
async function tabPhase(
  browser: import("@playwright/test").Browser,
  base: string,
  state: unknown,
  axis: { w: number; h: number },
  cfg: DialogCfg,
): Promise<TabResult> {
  const ctx = await browser.newContext({ viewport: { width: axis.w, height: axis.h }, storageState: state as never });
  const page = await ctx.newPage();
  const out: TabResult = { stops: [], firstInputFocus: null, comboboxFocus: null, submitFocus: null, escapeClosed: false };
  try {
    await page.goto(`${base}${cfg.path}`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2600);
    await page.locator(`main button:has-text("${cfg.trigger}")`).first().click();
    await page.waitForTimeout(1000);

    const describe = (): Promise<string> =>
      page.evaluate(`(() => {
        const ae = document.activeElement;
        if (!ae) return "(none)";
        const cs = getComputedStyle(ae);
        const r = ae.getBoundingClientRect();
        const name = (ae.getAttribute("aria-label") ?? ae.getAttribute("placeholder") ?? ae.textContent ?? "").trim().slice(0, 26) || "(no text)";
        return ae.tagName.toLowerCase() + "[" + name + "]" + (ae.id ? "#" + ae.id : "") + "@" + Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height) + " outline=" + cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor + " ring=" + cs.boxShadow.slice(0, 130);
      })()`) as Promise<string>;

    // the mount-focus stop (stop 0)
    out.stops.push(`mount:${await describe()}`);

    // the chain: Tab through the dialog's controls until the wrap
    // (Radix traps focus; the budget 18 covers the full trap — the
    // wrap check rides the tag+box repeat against stop 1's, never the
    // name slices)
    const stop1TagBox = (await page.evaluate(`(() => {
      const ae = document.activeElement; if (!ae) return "";
      const r = ae.getBoundingClientRect();
      return ae.tagName.toLowerCase() + "@" + Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height);
    })()`)) as string;
    let wrapped = false;
    for (let t = 0; t < 18 && !wrapped; t++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      const stop = (await page.evaluate(`(() => {
        const ae = document.activeElement;
        if (!ae) return "?";
        const cs = getComputedStyle(ae);
        const inDlg = !!ae.closest('[role="dialog"]');
        const r = ae.getBoundingClientRect();
        const name = (ae.getAttribute("aria-label") ?? ae.getAttribute("placeholder") ?? ae.textContent ?? "").trim().slice(0, 22) || "(no text)";
        return (inDlg ? "" : "(OUTSIDE) ") + ae.tagName.toLowerCase() + "[" + name + "]" + (ae.id ? "#" + ae.id : "") + " ring=" + cs.boxShadow.split("rgba").length + "slots outline=" + cs.outlineWidth + " " + cs.outlineStyle;
      })()`)) as string;
      const tagBox = (await page.evaluate(`(() => {
        const ae = document.activeElement; if (!ae) return "?";
        const r = ae.getBoundingClientRect();
        return ae.tagName.toLowerCase() + "@" + Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height);
      })()`)) as string;
      out.stops.push(`tab${t + 1}:${stop}`);
      if (stop.includes("(OUTSIDE)") || (t > 1 && tagBox === stop1TagBox)) wrapped = true;
    }

    // the REAL focus faces at the three targets: drive fresh — Escape,
    // reopen, Tab until the first text input; continue to a combobox;
    // continue to the Create submit; then the Escape close
    await page.keyboard.press("Escape").catch(() => undefined);
    await page.waitForTimeout(600);
    await page.locator(`main button:has-text("${cfg.trigger}")`).first().click();
    await page.waitForTimeout(900);
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      const isInput = (await page.evaluate(`(() => { const ae = document.activeElement; return !!ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA") && ["text", "email", "tel", "", "datetime-local", "number", "textarea"].includes(ae.type ?? ae.tagName.toLowerCase()); })()`)) as boolean;
      if (isInput) {
        out.firstInputFocus = (await page.evaluate(`(() => { const cs = getComputedStyle(document.activeElement); return { outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, ring: cs.boxShadow }; })()`)) as { outline: string; ring: string };
        break;
      }
    }
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      const isCb = (await page.evaluate(`(() => { const ae = document.activeElement; return !!ae && ae.getAttribute("role") === "combobox"; })()`)) as boolean;
      if (isCb) {
        out.comboboxFocus = (await page.evaluate(`(() => { const cs = getComputedStyle(document.activeElement); return { outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, ring: cs.boxShadow }; })()`)) as { outline: string; ring: string };
        break;
      }
    }
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      const isSubmit = (await page.evaluate(`(() => { const ae = document.activeElement; return !!ae && /${cfg.submitText}/i.test(ae.textContent ?? ""); })()`)) as boolean;
      if (isSubmit) {
        out.submitFocus = (await page.evaluate(`(() => { const cs = getComputedStyle(document.activeElement); return { outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, ring: cs.boxShadow }; })()`)) as { outline: string; ring: string };
        break;
      }
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    out.escapeClosed = (await page.evaluate(`(() => !document.querySelector('[role="dialog"][data-state="open"]'))()`)) as boolean;
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase C1 — the select ride (the contact meet-select + the account
 * status-select): open the combobox, census the listbox OPEN face + the
 * option vocabulary + the first option's resting face + the REAL
 * data-highlighted face under ArrowDown, then Escape (client state —
 * the context discards it). */
async function selectRidePhase(
  browser: import("@playwright/test").Browser,
  base: string,
  state: unknown,
  cfg: DialogCfg,
  comboboxAria: string,
): Promise<SelectRideResult> {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state as never });
  const page = await ctx.newPage();
  const out: SelectRideResult = { opened: false, contentBox: "", contentCls: "", optionTexts: [], firstOptionFace: null, highlightedFace: null, closedAfter: "(probe failed)" };
  try {
    await page.goto(`${base}${cfg.path}`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2600);
    await page.locator(`main button:has-text("${cfg.trigger}")`).first().click();
    await page.waitForTimeout(900);

    const combo = page.locator(`[role="dialog"] button[role="combobox"]`).first();
    if (await combo.count()) {
      await combo.click();
      await page.waitForTimeout(700);
      const census = (await page.evaluate(`(() => {
        const lb = document.querySelector('[role="listbox"][data-state="open"], [role="listbox"]');
        if (!lb) return null;
        const r = lb.getBoundingClientRect();
        const opts = Array.from(lb.querySelectorAll('[role="option"]'));
        return {
          box: Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height),
          cls: (lb.getAttribute("class") ?? "").slice(0, 200),
          texts: opts.map((o) => (o.textContent ?? "").trim().slice(0, 24)),
          firstFace: opts[0] ? ${FACE_JS}(opts[0]) : null,
        };
      })()`).catch(() => null)) as { box: string; cls: string; texts: string[]; firstFace: Face | null } | null;
      if (census) {
        out.opened = true;
        out.contentBox = census.box;
        out.contentCls = census.cls;
        out.optionTexts = census.texts;
        out.firstOptionFace = census.firstFace;
        // the REAL data-highlighted face under ArrowDown (the walk53
        // form — data-highlighted fires under real keyboard focus)
        await page.keyboard.press("ArrowDown");
        await page.waitForTimeout(350);
        out.highlightedFace = (await page.evaluate(`(() => {
          const hi = document.querySelector('[role="listbox"] [role="option"][data-highlighted], [role="listbox"] [role="option"][aria-selected="true"]');
          return hi ? ${FACE_JS}(hi) : null;
        })()`).catch(() => null)) as Face | null;
      }
      await page.keyboard.press("Escape").catch(() => undefined);
      await page.waitForTimeout(500);
      out.closedAfter = (await page.evaluate(`(() => { const lb = document.querySelector('[role="listbox"]'); const dlg = document.querySelector('[role="dialog"][data-state="open"]'); return "listboxGone=" + !lb + " dialogOpen=" + !!dlg; })()`)) as string;
    } else {
      out.closedAfter = "(no combobox)";
    }
    await page.keyboard.press("Escape").catch(() => undefined);
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase C2 — the EVENT related-to pick ride: open the Related To
 * select, pick the "Contact" option, census the CONDITIONAL Name
 * field's appearance (the M-76c13 decode: the placeholder + the box) +
 * the form's geometry growth. Client state — the context discards it. */
async function conditionalRidePhase(
  browser: import("@playwright/test").Browser,
  base: string,
  state: unknown,
  cfg: DialogCfg,
): Promise<ConditionalRideResult> {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state as never });
  const page = await ctx.newPage();
  const out: ConditionalRideResult = { relatedPick: "", conditionalAppeared: null, conditionalPlaceholder: "", conditionalBox: "", formGrowth: "(probe failed)" };
  try {
    await page.goto(`${base}${cfg.path}`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2600);
    await page.locator(`main button:has-text("${cfg.trigger}")`).first().click();
    await page.waitForTimeout(900);

    // the pre-pick dialog height (the growth decode's baseline)
    const preH = (await page.evaluate(`(() => { const d = document.querySelector('[role="dialog"]'); const r = d ? d.getBoundingClientRect() : null; return r ? Math.round(r.height) : -1; })()`)) as number;

    // the Related To trigger: the THIRD combobox (Event Type, Status,
    // Related To — the construction order)
    const combos = page.locator('[role="dialog"] button[role="combobox"]');
    const n = await combos.count();
    if (n >= 3) {
      await combos.nth(2).click();
      await page.waitForTimeout(600);
      const contactOpt = page.locator('[role="listbox"] [role="option"]').filter({ hasText: /contact/i }).first();
      if (await contactOpt.count()) {
        await contactOpt.click();
        await page.waitForTimeout(700);
        out.relatedPick = "Contact";
        const census = (await page.evaluate(`(() => {
          const dlg = document.querySelector('[role="dialog"]');
          const r = dlg ? dlg.getBoundingClientRect() : null;
          // the pick verification: the THIRD combobox's own text after
          // the pick (the SelectValue flip "Select type" -> "Contact")
          const combos = dlg ? Array.from(dlg.querySelectorAll('button[role="combobox"]')) : [];
          const comboTexts = combos.map((c) => (c.textContent ?? "").trim().slice(0, 24));
          // the CONDITIONAL Name field: the input whose placeholder
          // carries the M-76c13 capitalization (attribute-less inputs
          // ride the property census, never the [type] selector)
          const inputs = dlg ? Array.from(dlg.querySelectorAll("input, textarea")) : [];
          const all = inputs.map((i) => ({ id: i.id ?? "", ph: i.getAttribute("placeholder") ?? "", type: i.getAttribute("type") ?? "(none)" }));
          const cond = inputs.find((i) => /^Enter .* name$/i.test(i.getAttribute("placeholder") ?? "")) ?? null;
          return {
            h: r ? Math.round(r.height) : -1,
            comboTexts,
            all,
            condPh: cond ? (cond.getAttribute("placeholder") ?? "(none)") : "(no input)",
            condBox: cond ? (() => { const b = cond.getBoundingClientRect(); return Math.round(b.x) + "," + Math.round(b.y) + " " + Math.round(b.width) + "x" + Math.round(b.height); })() : "",
            condId: cond ? (cond.id ?? "") : "",
          };
        })()`).catch(() => null)) as { h: number; comboTexts: string[]; all: Array<{ id: string; ph: string; type: string }>; condPh: string; condBox: string; condId: string } | null;
        if (census) {
          out.conditionalAppeared = census.condPh !== "(no input)";
          out.conditionalPlaceholder = census.condPh;
          out.conditionalBox = census.condBox + (census.condId ? ` id=${census.condId}` : "");
          out.formGrowth = `dialogH ${preH} -> ${census.h} comboTexts=[${census.comboTexts.join(" | ")}] inputs=[${census.all.map((x) => (x.id || x.ph || x.type)).join(",")}]`;
        }
      } else {
        out.relatedPick = "(no Contact option)";
      }
    } else {
      out.relatedPick = `(combos=${n})`;
    }
    await page.keyboard.press("Escape").catch(() => undefined);
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase C3 — the cancel-then-reopen state decode (the contact arm):
 * open, type into the name input, Cancel, reopen — is the typed value
 * KEPT or CLEARED? (OURS: the s71 epoch remount clears; the reference's
 * own behavior censused live.) Client state — the context discards it. */
async function cancelReopenPhase(
  browser: import("@playwright/test").Browser,
  base: string,
  state: unknown,
  cfg: DialogCfg,
): Promise<CancelReopenResult> {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state as never });
  const page = await ctx.newPage();
  const out: CancelReopenResult = { typedThenCancelled: false, reopenedValue: "(probe failed)" };
  try {
    await page.goto(`${base}${cfg.path}`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2600);
    await page.locator(`main button:has-text("${cfg.trigger}")`).first().click();
    await page.waitForTimeout(900);

    // the first text input (the name field on both apps)
    const first = page.locator('[role="dialog"] input[type="text"], [role="dialog"] input:not([type])').first();
    if (await first.count()) {
      await first.click();
      await first.fill("Walk64 Probe");
      await page.waitForTimeout(400);
      await page.locator('[role="dialog"] button:has-text("Cancel")').first().click();
      await page.waitForTimeout(600);
      out.typedThenCancelled = true;
      await page.locator(`main button:has-text("${cfg.trigger}")`).first().click();
      await page.waitForTimeout(900);
      out.reopenedValue = (await page.evaluate(`(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const inputs = dlg ? Array.from(dlg.querySelectorAll("input, textarea")) : [];
        const first = inputs.find((i) => (i.getAttribute("type") ?? "text") === "text" || i.tagName === "TEXTAREA") ?? null;
        return first ? (first.value || "(empty)") : "(no input)";
      })()`)) as string;
    }
    await page.keyboard.press("Escape").catch(() => undefined);
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

/** The label-wiring report: the labels' for-map side by side (the
 * s172 superset vs the reference's bare-label decode evidence). */
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
    if (a && b && (a.text !== b.text || !!a.for !== !!b.for)) {
      out.push(`${name}.labels[${i}] "${a.text}" for="${a.for}" | REF "${b.text}" for="${b.for}"`);
    }
  }
  out.push(`${name}.labels: ${ours.length} OURS (wired ${wiredOurs}) / ${ref.length} REF (wired ${wiredRef})`);
  return out;
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[walk64] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[walk64] pair state: ready (the s162 guarded form)");
    mkdirSync(OUT_DIR, { recursive: true });
    const report: string[] = [];

    for (const cfg of DIALOGS) {
      report.push(`\n######## ${cfg.key.toUpperCase()} CREATE DIALOG (${cfg.trigger}) ########`);

      // ===== Phase A — the OPEN census at BOTH axes =====
      const oursDlg = await dialogPhase(browser, OUR_URL, state, { w: 1440, h: 900 }, cfg);
      const refDlg = await dialogPhase(browser, REF_URL, state, { w: 1440, h: 900 }, cfg);
      const oursDlgp = await dialogPhase(browser, OUR_URL, state, { w: 390, h: 844 }, cfg);
      const refDlgp = await dialogPhase(browser, REF_URL, state, { w: 390, h: 844 }, cfg);
      writeFileSync(join(OUT_DIR, `ours-${cfg.key}-desktop.json`), JSON.stringify(oursDlg, null, 2));
      writeFileSync(join(OUT_DIR, `ref-${cfg.key}-desktop.json`), JSON.stringify(refDlg, null, 2));
      writeFileSync(join(OUT_DIR, `ours-${cfg.key}-phone.json`), JSON.stringify(oursDlgp, null, 2));
      writeFileSync(join(OUT_DIR, `ref-${cfg.key}-phone.json`), JSON.stringify(refDlgp, null, 2));

      report.push(`\n===== ${cfg.key.toUpperCase()} OPEN DIALOG @1440x900 =====`);
      report.push(`found: OURS ${oursDlg.found} | REF ${refDlg.found}`);
      report.push(`trigger: OURS "${oursDlg.triggerText}" ${oursDlg.triggerBox} | REF "${refDlg.triggerText}" ${refDlg.triggerBox}`);
      report.push(...faceDelta(`${cfg.key}.trigger.face`, oursDlg.triggerFace, refDlg.triggerFace));
      report.push(`root: OURS ${oursDlg.rootBox} | REF ${refDlg.rootBox}`);
      report.push(`root.cls: OURS "${oursDlg.rootCls}"`);
      report.push(`          REF  "${refDlg.rootCls}"`);
      report.push(...faceDelta(`${cfg.key}.root.face`, oursDlg.rootFace, refDlg.rootFace));
      report.push(`title: OURS "${oursDlg.title}" | REF "${refDlg.title}"`);
      report.push(`title.cls: OURS "${oursDlg.titleCls}" | REF "${refDlg.titleCls}"`);
      report.push(...idMapDiff(cfg.key, oursDlg.inputs, refDlg.inputs));
      report.push(...labelMapDiff(cfg.key, oursDlg.labels, refDlg.labels));
      const oursCb = oursDlg.comboboxes ?? [];
      const refCb = refDlg.comboboxes ?? [];
      for (let i = 0; i < Math.max(oursCb.length, refCb.length); i++) {
        const a = oursCb[i];
        const b = refCb[i];
        if (!a || !b) { report.push(`${cfg.key}.combobox[${i}]: presence OURS=${!!a} REF=${!!b}`); continue; }
        report.push(`combobox[${i}]: OURS text "${a.text}" aria "${a.aria}" ${a.box} | REF text "${b.text}" aria "${b.aria}" ${b.box}`);
        report.push(...faceDelta(`${cfg.key}.combobox[${i}].face`, a.face, b.face).map((l) => `  ${l}`));
      }
      if (oursDlg.fileInput || refDlg.fileInput) {
        report.push(`fileInput: OURS accept="${oursDlg.fileInput?.accept}" tabIndex="${oursDlg.fileInput?.tabIndex}" id="${oursDlg.fileInput?.id}"`);
        report.push(`           REF  accept="${refDlg.fileInput?.accept}" tabIndex="${refDlg.fileInput?.tabIndex}" id="${refDlg.fileInput?.id}"`);
      }
      for (let i = 0; i < Math.max(oursDlg.footer.length, refDlg.footer.length); i++) {
        const a = oursDlg.footer[i];
        const b = refDlg.footer[i];
        if (!a || !b) { report.push(`${cfg.key}.footer[${i}]: presence OURS=${!!a} REF=${!!b}`); continue; }
        report.push(`footer[${i}] "${a.text}"${a.disabled ? " [disabled]" : ""}: OURS ${a.box} | REF ${b.box}`);
        report.push(...faceDelta(`${cfg.key}.footer[${i}].face`, a.face, b.face).map((l) => `  ${l}`));
      }
      report.push(`closeAria: OURS "${oursDlg.closeAria}" | REF "${refDlg.closeAria}"`);
      report.push(`mountFocus: OURS "${oursDlg.mountFocus}" | REF "${refDlg.mountFocus}"`);
      report.push(...faceDelta(`${cfg.key}.mountFocus.face`, oursDlg.mountFocusFace, refDlg.mountFocusFace));
      report.push(`escapeClosed: OURS ${oursDlg.escapeClosed} | REF ${refDlg.escapeClosed}`);
      report.push(...diffRows(`${cfg.key}Ledger`, oursDlg.ledger, refDlg.ledger));

      report.push(`\n===== ${cfg.key.toUpperCase()} OPEN DIALOG @390x844 =====`);
      report.push(`found: OURS ${oursDlgp.found} | REF ${refDlgp.found}`);
      report.push(`phone root: OURS ${oursDlgp.rootBox} | REF ${refDlgp.rootBox}`);
      const oursIn = oursDlgp.inputs ?? [];
      const refIn = refDlgp.inputs ?? [];
      if (oursIn[0] && refIn[0]) {
        report.push(`phone first input: OURS ${oursIn[0].box} ${oursIn[0].font} | REF ${refIn[0].box} ${refIn[0].font}`);
        report.push(...faceDelta(`${cfg.key}.phone first-input.face`, oursIn[0].face, refIn[0].face));
      }
      for (let i = 0; i < Math.min(oursDlgp.footer.length, refDlgp.footer.length); i++) {
        const a = oursDlgp.footer[i];
        const b = refDlgp.footer[i];
        if (a && b) report.push(`phone footer[${i}] "${a.text}": OURS ${a.box} | REF ${b.box}`);
      }

      // ===== Phase B — the REAL keyboard Tab drive =====
      const oursTab = await tabPhase(browser, OUR_URL, state, { w: 1440, h: 900 }, cfg);
      const refTab = await tabPhase(browser, REF_URL, state, { w: 1440, h: 900 }, cfg);
      writeFileSync(join(OUT_DIR, `ours-${cfg.key}-tab.json`), JSON.stringify(oursTab, null, 2));
      writeFileSync(join(OUT_DIR, `ref-${cfg.key}-tab.json`), JSON.stringify(refTab, null, 2));
      report.push(`\n===== ${cfg.key.toUpperCase()} REAL-TAB CHAIN @1440x900 =====`);
      // The s88-c9 naming genus normalized: the CHAIN equality rides the
      // tag sequence only — the names report separately (the kept superset).
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
      report.push(`REAL FOCUS-VISIBLE on the first input: OURS outline="${oursTab.firstInputFocus?.outline}"`);
      report.push(`                                    REF  outline="${refTab.firstInputFocus?.outline}"`);
      report.push(`REAL first-input ring: OURS "${oursTab.firstInputFocus?.ring.slice(0, 200)}"`);
      report.push(`                       REF  "${refTab.firstInputFocus?.ring.slice(0, 200)}"`);
      report.push(`REAL FOCUS-VISIBLE on combobox: OURS outline="${oursTab.comboboxFocus?.outline}" ring="${oursTab.comboboxFocus?.ring.slice(0, 160)}"`);
      report.push(`                               REF  outline="${refTab.comboboxFocus?.outline}" ring="${refTab.comboboxFocus?.ring.slice(0, 160)}"`);
      report.push(`REAL FOCUS-VISIBLE on ${cfg.submitText}: OURS outline="${oursTab.submitFocus?.outline}" ring="${oursTab.submitFocus?.ring.slice(0, 160)}"`);
      report.push(`                             REF  outline="${refTab.submitFocus?.outline}" ring="${refTab.submitFocus?.ring.slice(0, 160)}"`);
      report.push(`escapeClosed (B): OURS ${oursTab.escapeClosed} | REF ${refTab.escapeClosed}`);

      // ===== Phase C — the interactive arms =====
      if (cfg.key === "contact" || cfg.key === "account") {
        const oursSel = await selectRidePhase(browser, OUR_URL, state, cfg, "");
        const refSel = await selectRidePhase(browser, REF_URL, state, cfg, "");
        writeFileSync(join(OUT_DIR, `ours-${cfg.key}-select.json`), JSON.stringify(oursSel, null, 2));
        writeFileSync(join(OUT_DIR, `ref-${cfg.key}-select.json`), JSON.stringify(refSel, null, 2));
        report.push(`\n===== ${cfg.key.toUpperCase()} SELECT RIDE @1440x900 =====`);
        report.push(`opened: OURS ${oursSel.opened} | REF ${refSel.opened}`);
        report.push(`content: OURS ${oursSel.contentBox} | REF ${refSel.contentBox}`);
        report.push(`content.cls: OURS "${oursSel.contentCls}"`);
        report.push(`             REF  "${refSel.contentCls}"`);
        report.push(`options: OURS (${oursSel.optionTexts.length}) [${oursSel.optionTexts.join(" | ")}]`);
        report.push(`         REF  (${refSel.optionTexts.length}) [${refSel.optionTexts.join(" | ")}]`);
        report.push(...faceDelta(`${cfg.key}.option[0].face`, oursSel.firstOptionFace, refSel.firstOptionFace));
        report.push(...faceDelta(`${cfg.key}.highlighted.face`, oursSel.highlightedFace, refSel.highlightedFace));
        report.push(`closedAfter: OURS ${oursSel.closedAfter} | REF ${refSel.closedAfter}`);
      }
      if (cfg.key === "event") {
        const oursCond = await conditionalRidePhase(browser, OUR_URL, state, cfg);
        const refCond = await conditionalRidePhase(browser, REF_URL, state, cfg);
        writeFileSync(join(OUT_DIR, "ours-event-conditional.json"), JSON.stringify(oursCond, null, 2));
        writeFileSync(join(OUT_DIR, "ref-event-conditional.json"), JSON.stringify(refCond, null, 2));
        report.push(`\n===== EVENT RELATED-TO CONDITIONAL RIDE @1440x900 =====`);
        report.push(`relatedPick: OURS "${oursCond.relatedPick}" | REF "${refCond.relatedPick}"`);
        report.push(`conditionalAppeared: OURS ${oursCond.conditionalAppeared} | REF ${refCond.conditionalAppeared}`);
        report.push(`conditionalPlaceholder: OURS "${oursCond.conditionalPlaceholder}" | REF "${refCond.conditionalPlaceholder}"`);
        report.push(`conditionalBox: OURS ${oursCond.conditionalBox} | REF ${refCond.conditionalBox}`);
        report.push(`formGrowth: OURS ${oursCond.formGrowth} | REF ${refCond.formGrowth}`);
      }
      if (cfg.key === "contact") {
        const oursCr = await cancelReopenPhase(browser, OUR_URL, state, cfg);
        const refCr = await cancelReopenPhase(browser, REF_URL, state, cfg);
        writeFileSync(join(OUT_DIR, "ours-contact-cancelreopen.json"), JSON.stringify(oursCr, null, 2));
        writeFileSync(join(OUT_DIR, "ref-contact-cancelreopen.json"), JSON.stringify(refCr, null, 2));
        report.push(`\n===== CONTACT CANCEL-THEN-REOPEN STATE DECODE @1440x900 =====`);
        report.push(`typedThenCancelled: OURS ${oursCr.typedThenCancelled} | REF ${refCr.typedThenCancelled}`);
        report.push(`reopenedValue: OURS "${oursCr.reopenedValue}" | REF "${refCr.reopenedValue}"`);
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
  console.error("[walk64]", e);
  process.exit(1);
});

// Session-190 (walk63): THE REPORTS SAVE-CUSTOM-VIEW DIALOG OPEN FACES
// INTERIOR WALK — the walk53-62 ledger form over the LIVE arm the
// discover-190 probe adjudicated (the s400 close's named candidates:
// the reports SAVE-CUSTOM-VIEW dialog LIVE on BOTH apps; the dashboard
// follow-up-rows checkbox arms + the activities Completed-tab row
// actions KILLED — the reference's zero-data state persists), at BOTH
// axes:
//
//   Phase A — the OPEN dialog census at the desktop axis 1440×900:
//     the trigger's resting face (the "Saved Reports (N)" outline
//     button — byte-equal at 1216,113 192x36 per the discovery), the
//     click-open ride, the OPEN dialog's root geometry ledger (the
//     box + the face + the DFS ledger), the title, the name input's
//     FULL chain + computed font + placeholder face, the 6-column
//     checkbox grid (the vocabulary + the first checkbox's chain +
//     computed face), the Current-Filters summary box, the footer's
//     Cancel/Save pair + the disabled-Save resting face, the close X,
//     the mount-focus census.
//   Phase B — the REAL keyboard Tab drive through the OPEN dialog
//     (the walk54/58 focus form: the mount-focus stop + the chain
//     through the dialog's focusables until the wrap + each stop's
//     REAL :focus-visible ring — the programmatic face never the true
//     face) + the REAL focus faces on the name input + the first
//     checkbox + the Save button + the Escape close round-trip.
//   Phase C — the interactive arms: type a name → the disabled-Save
//     flip → the SAVE round-trip (the localStorage seam — the browser
//     context discards it; never a DB write) → the post-save REOPEN
//     (the L-74c8 name-clear decode) + the saved-list arm (the p-3
//     bg-gray-50 rows + the Load outline-sm + the bookmark glyph) +
//     the cancel-then-reopen state decode (the typed name KEEPS —
//     the L-74c7 contract) + one column-checkbox toggle ride (the
//     unchecked face — client state, discardable).
//   Phase D — the phone axis 390×844: the dialog's phone box (w-full)
//     + the input + the phone REAL-TAB drive + the phone footer.
//
// The DATA-STATE discipline: the dialog is DATA-INDEPENDENT — the
// reference's own zero-data state reaches every censused face (the
// reports page renders its real charts at zero data, the session-10
// doctrine); the saved-list arm rides the walk's OWN saved report on
// both apps (the localStorage `crm_saved_reports` seam — the
// IDENTICAL one-item state, the browser context discarding it). The
// aria-label naming (ours the superset) normalizes in the chain
// comparison — the s88-c9 kept genus. The destructive arms are NEVER
// fired (the save is a client-side localStorage write inside a
// discardable browser context; the Load applies client-side filter
// state; the checkbox toggles are client state).
//
// Run: bun scripts/walk63-savedreports-dialog-focus-open.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
// reference rides the sweep-state storageState pair, the s162 doctrine.)
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
const OUT_DIR = join(REPO, "scripts", "walk63");

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

/** The computed face — the effective-layer style probe (the walk51-62
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
  input: { cls: string; font: string; lineHeight: string; placeholder: string; box: string; face: Face | null; id: string; labelledBy: string } | null;
  checkboxes: { count: number; labels: string[]; firstCls: string; firstFace: Face | null; firstBox: string; firstAria: string } | null;
  summary: { text: string; cls: string; box: string } | null;
  footer: Array<{ text: string; disabled: boolean; face: Face | null; box: string }>;
  closeAria: string;
  mountFocus: string;
  mountFocusFace: Face | null;
  escapeClosed: boolean;
}

interface TabResult {
  stops: string[];
  inputFocus: { outline: string; ring: string } | null;
  checkboxFocus: { outline: string; ring: string } | null;
  saveFocus: { outline: string; ring: string } | null;
  escapeClosed: boolean;
}

interface InteractiveResult {
  typeFlipsSave: boolean | null;
  saveRoundTrip: string;
  reopenName: string;
  reopenLoadButtons: number;
  savedRow: { name: string; date: string; loadFace: Face | null; loadCls: string; box: string } | null;
  cancelReopenKeepsName: boolean | null;
  checkboxToggle: string;
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
      if (attr.name.startsWith("aria-") || attr.name === "data-state" || attr.name === "id" || attr.name === "type" || attr.name === "for") aria[attr.name] = attr.value;
    }
    const text = Array.from(node.childNodes).filter((n) => n.nodeType === 3).map((n) => (n.textContent ?? "").trim()).join(" ").trim().slice(0, 40);
    const r2 = node.getBoundingClientRect();
    ledger.push({ i: ledger.length, depth, tag: node.tagName.toLowerCase(), cls: (node.getAttribute("class") ?? "").trim(), role: node.getAttribute("role"), aria, text, box: { x: Math.round(r2.x), y: Math.round(r2.y), w: Math.round(r2.width), h: Math.round(r2.height) } });
    for (const child of Array.from(node.children)) collect(child, depth + 1);
  };
  collect(el, 0);
  return ledger;
})`;

/** Phase A — the OPEN dialog census: the trigger's resting face, the
 * click-open ride, the root geometry + DFS ledger, the title, the
 * input, the checkbox grid, the summary, the footer, the close X,
 * the mount focus, the Escape round-trip. */
async function dialogPhase(
  browser: import("@playwright/test").Browser,
  base: string,
  state: unknown,
  axis: { w: number; h: number },
): Promise<DialogCensus> {
  const ctx = await browser.newContext({ viewport: { width: axis.w, height: axis.h }, storageState: state as never });
  const page = await ctx.newPage();
  const out: DialogCensus = {
    found: false, triggerText: "", triggerFace: null, triggerBox: "", triggerCls: "",
    rootBox: "", rootFace: null, rootCls: "", ledger: null,
    title: "", titleCls: "", input: null, checkboxes: null, summary: null,
    footer: [], closeAria: "", mountFocus: "", mountFocusFace: null, escapeClosed: false,
  };
  try {
    await page.goto(`${base}/reports`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2600);

    // A1 — the trigger's resting face (pre-click)
    const trigger = page.locator('main button:has-text("Saved Reports")').first();
    if (!(await trigger.count())) return out;
    out.found = true;
    out.triggerText = ((await trigger.textContent()) ?? "").trim();
    const t = (await page.evaluate(`(() => {
      const el = Array.from(document.querySelectorAll("main button")).find((b) => (b.textContent ?? "").includes("Saved Reports"));
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
      const input = dlg.querySelector("input[id='reportName'], input[placeholder*='Q1']");
      const cbs = Array.from(dlg.querySelectorAll("[role='checkbox'], input[type='checkbox']"));
      const cbLabels = cbs.map((c) => {
        const row = c.closest("label, div");
        return (row?.textContent ?? "").trim().slice(0, 30);
      });
      const summary = Array.from(dlg.querySelectorAll("p")).find((p) => /Current Filters/i.test(p.textContent ?? ""));
      const summaryBox = summary ? summary.closest("div") : null;
      const btns = Array.from(dlg.querySelectorAll("button"));
      const footerBtns = btns.filter((b) => /^(Cancel|Save Report)$/.test((b.textContent ?? "").trim()) || (b.getAttribute("class") ?? "").includes("absolute"));
      const x = btns.find((b) => (b.getAttribute("class") ?? "").includes("absolute"));
      const ae = document.activeElement;
      const mountName = ae ? ae.tagName + "/" + ((ae.getAttribute("aria-label") ?? ae.textContent ?? "").trim().slice(0, 24) || "(no text)") : "(none)";
      return {
        rootCls: dlg.getAttribute("class") ?? "",
        rootBox: Math.round(rr.x) + "," + Math.round(rr.y) + " " + Math.round(rr.width) + "x" + Math.round(rr.height),
        title: title ? title.textContent?.trim() ?? "" : "(none)",
        titleCls: title ? title.getAttribute("class") ?? "" : "",
        input: input ? {
          cls: input.getAttribute("class") ?? "",
          placeholder: input.placeholder,
          id: input.id,
          font: getComputedStyle(input).fontSize + "/" + getComputedStyle(input).fontWeight,
          lineHeight: getComputedStyle(input).lineHeight,
          labelledBy: input.getAttribute("aria-labelledby") ?? "(none)",
          box: (() => { const r = input.getBoundingClientRect(); return Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height); })(),
        } : null,
        cbCount: cbs.length,
        cbLabels,
        firstCb: cbs[0] ? {
          cls: cbs[0].getAttribute("class") ?? "",
          aria: cbs[0].getAttribute("aria-label") ?? "(none)",
          box: (() => { const r = cbs[0].getBoundingClientRect(); return Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height); })(),
        } : null,
        summary: summary ? { text: (summary.textContent ?? "").trim().slice(0, 120), cls: summaryBox ? summaryBox.getAttribute("class") ?? "" : "", box: summaryBox ? (() => { const r = summaryBox.getBoundingClientRect(); return Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height); })() : "" } : null,
        footerBtns: footerBtns.map((b) => ({
          text: (b.textContent ?? "").trim().slice(0, 30) || "(icon)",
          disabled: (b).disabled ?? false,
          cls: b.getAttribute("class") ?? "",
          box: (() => { const r = b.getBoundingClientRect(); return Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height); })(),
        })),
        closeAria: x ? Array.from(x.attributes).filter((a) => a.name.startsWith("aria")).map((a) => a.name + "=" + a.value).join(" ") || "(no aria)" : "(missing)",
        mountFocus: mountName,
      };
    })()`).catch(() => null)) as (DialogCensus & {
      firstCb: { cls: string; aria: string; box: string };
      footerBtns: Array<{ text: string; disabled: boolean; cls: string; box: string }>;
      cbCount: number;
      cbLabels: string[];
    }) | null;
    if (!census) return out;
    out.rootBox = census.rootBox;
    out.rootCls = census.rootCls;
    out.rootFace = (await page.evaluate(`(() => { const dlg = document.querySelector('[role="dialog"]'); return dlg ? ${FACE_JS}(dlg) : null; })()`)) as Face | null;
    out.ledger = (await page.evaluate(`(el => ${LEDGER_JS}(el))(document.querySelector('[role="dialog"]'))`)) as Row[] | null;
    out.title = census.title;
    out.titleCls = census.titleCls;
    if (census.input) {
      out.input = {
        cls: census.input.cls, font: census.input.font, lineHeight: census.input.lineHeight,
        placeholder: census.input.placeholder, box: census.input.box, id: census.input.id,
        labelledBy: census.input.labelledBy,
        face: (await page.evaluate(`(() => { const i = document.querySelector('[role="dialog"] input'); return i ? ${FACE_JS}(i) : null; })()`)) as Face | null,
      };
    }
    if (census.cbCount > 0 && census.firstCb) {
      out.checkboxes = {
        count: census.cbCount, labels: census.cbLabels,
        firstCls: census.firstCb.cls, firstAria: census.firstCb.aria, firstBox: census.firstCb.box,
        firstFace: (await page.evaluate(`(() => { const c = document.querySelector('[role="dialog"] [role="checkbox"], [role="dialog"] input[type="checkbox"]'); return c ? ${FACE_JS}(c) : null; })()`)) as Face | null,
      };
    }
    out.summary = census.summary ?? null;
    out.footer = [];
    for (const fb of census.footerBtns) {
      const face = (await page.evaluate(`((t) => { const b = Array.from(document.querySelectorAll('[role="dialog"] button')).find((x) => (x.textContent ?? "").trim() === t || ((x.getAttribute("class") ?? "").includes("absolute") && t === "(icon)")); return b ? ${FACE_JS}(b) : null; })(${JSON.stringify(fb.text)})`)) as Face | null;
      out.footer.push({ text: fb.text, disabled: fb.disabled, face, box: fb.box });
    }
    out.closeAria = census.closeAria;
    out.mountFocus = census.mountFocus;
    out.mountFocusFace = (await page.evaluate(`(() => { const ae = document.activeElement; return ae ? ${FACE_JS}(ae) : null; })()`)) as Face | null;

    // A3 — the Escape close round-trip
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    out.escapeClosed = (await page.evaluate(`(() => !document.querySelector('[role="dialog"][data-state="open"]'))()`)) as boolean;
  } finally {
    await ctx.close().catch(() => undefined);
  }
  return out;
}

/** Phase B — the REAL keyboard Tab drive through the OPEN dialog (the
 * walk54/58 focus form): the mount-focus stop, the chain through the
 * dialog's focusables until the wrap, the REAL :focus-visible faces on
 * the input + a checkbox + the Save button, the Escape close. */
async function tabPhase(
  browser: import("@playwright/test").Browser,
  base: string,
  state: unknown,
  axis: { w: number; h: number },
): Promise<TabResult> {
  const ctx = await browser.newContext({ viewport: { width: axis.w, height: axis.h }, storageState: state as never });
  const page = await ctx.newPage();
  const out: TabResult = { stops: [], inputFocus: null, checkboxFocus: null, saveFocus: null, escapeClosed: false };
  try {
    await page.goto(`${base}/reports`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2600);
    await page.locator('main button:has-text("Saved Reports")').first().click();
    await page.waitForTimeout(1000);

    const describe = (): Promise<string> =>
      page.evaluate(`(() => {
        const ae = document.activeElement;
        if (!ae) return "(none)";
        const cs = getComputedStyle(ae);
        const r = ae.getBoundingClientRect();
        const name = (ae.getAttribute("aria-label") ?? ae.getAttribute("placeholder") ?? ae.textContent ?? "").trim().slice(0, 26) || "(no text)";
        return ae.tagName.toLowerCase() + "[" + name + "]@" + Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height) + " outline=" + cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor + " ring=" + cs.boxShadow.slice(0, 130);
      })()`) as Promise<string>;

    // the mount-focus stop (stop 0)
    out.stops.push(`mount:${await describe()}`);

    // the chain: Tab through the dialog's controls until the wrap
    // (Radix traps focus; the budget 16 covers the full trap — the
    // wrap check rides the tag+geometry, never the name slices)
    let wrapped = false;
    for (let t = 0; t < 16 && !wrapped; t++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      const stop = (await page.evaluate(`(() => {
        const ae = document.activeElement;
        if (!ae) return "?";
        const cs = getComputedStyle(ae);
        const inDlg = !!ae.closest('[role="dialog"]');
        const r = ae.getBoundingClientRect();
        const name = (ae.getAttribute("aria-label") ?? ae.getAttribute("placeholder") ?? ae.textContent ?? "").trim().slice(0, 22) || "(no text)";
        return (inDlg ? "" : "(OUTSIDE) ") + ae.tagName.toLowerCase() + "[" + name + "] ring=" + cs.boxShadow.split("rgba").length + "slots outline=" + cs.outlineWidth + " " + cs.outlineStyle;
      })()`)) as string;
      const tagBox = (await page.evaluate(`(() => {
        const ae = document.activeElement;
        if (!ae) return "?";
        const r = ae.getBoundingClientRect();
        return ae.tagName.toLowerCase() + "@" + Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height);
      })()`)) as string;
      out.stops.push(`tab${t + 1}:${stop}`);
      const mountTagBox = out.stops[0].replace(/^mount:/, "").match(/@(-?\d+,-?\d+ \d+x\d+)/);
      if (stop.includes("(OUTSIDE)") || (t > 1 && mountTagBox && tagBox === `${"INPUT"}@${mountTagBox[1].replace(/ \d+x\d+$/, " 622x36")}`.replace(/^INPUT/, "input"))) {
        wrapped = true;
      }
    }

    // the REAL focus faces on the three targets: drive fresh — Escape,
    // reopen, Tab until the input, capture; continue to a checkbox +
    // the Save button; then the Escape close
    await page.keyboard.press("Escape").catch(() => undefined);
    await page.waitForTimeout(600);
    await page.locator('main button:has-text("Saved Reports")').first().click();
    await page.waitForTimeout(900);
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      const isInput = (await page.evaluate(`(() => { const ae = document.activeElement; return !!ae && ae.tagName === "INPUT" && (ae.id === "reportName" || (ae.getAttribute("placeholder") ?? "").includes("Q1")); })()`)) as boolean;
      if (isInput) {
        out.inputFocus = (await page.evaluate(`(() => { const cs = getComputedStyle(document.activeElement); return { outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, ring: cs.boxShadow }; })()`)) as { outline: string; ring: string };
        break;
      }
    }
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      const isCb = (await page.evaluate(`(() => { const ae = document.activeElement; return !!ae && (ae.getAttribute("role") === "checkbox" || ae.type === "checkbox"); })()`)) as boolean;
      if (isCb) {
        out.checkboxFocus = (await page.evaluate(`(() => { const cs = getComputedStyle(document.activeElement); return { outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, ring: cs.boxShadow }; })()`)) as { outline: string; ring: string };
        break;
      }
    }
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      const isSave = (await page.evaluate(`(() => { const ae = document.activeElement; return !!ae && /Save Report/i.test(ae.textContent ?? ""); })()`)) as boolean;
      if (isSave) {
        out.saveFocus = (await page.evaluate(`(() => { const cs = getComputedStyle(document.activeElement); return { outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, ring: cs.boxShadow }; })()`)) as { outline: string; ring: string };
        break;
      }
    }
    if (!out.saveFocus) {
      // the Save button is DISABLED at the fresh-open state — never in
      // the focus chain. Type a name first (the disabled-Save flip — the
      // reference's own gating), then Tab to it: the REAL face.
      await page.evaluate(`(() => { const i = document.querySelector('[role="dialog"] input'); if (i) { i.focus(); } })()`);
      await page.keyboard.type("x");
      await page.waitForTimeout(300);
      for (let i = 0; i < 16; i++) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(200);
        const isSave = (await page.evaluate(`(() => { const ae = document.activeElement; return !!ae && /Save Report/i.test(ae.textContent ?? ""); })()`)) as boolean;
        if (isSave) {
          out.saveFocus = (await page.evaluate(`(() => { const cs = getComputedStyle(document.activeElement); return { outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor, ring: cs.boxShadow }; })()`)) as { outline: string; ring: string };
          break;
        }
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

/** Phase C — the interactive arms: the type + the disabled-Save flip +
 * the SAVE round-trip (the localStorage seam) + the post-save REOPEN
 * (the L-74c8 clear) + the saved-list arm + the cancel-then-reopen
 * decode (the L-74c7 keep) + the checkbox-toggle ride. */
async function interactivePhase(
  browser: import("@playwright/test").Browser,
  base: string,
  state: unknown,
): Promise<InteractiveResult> {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: state as never });
  const page = await ctx.newPage();
  const out: InteractiveResult = {
    typeFlipsSave: null, saveRoundTrip: "", reopenName: "(probe failed)", reopenLoadButtons: -1,
    savedRow: null, cancelReopenKeepsName: null, checkboxToggle: "(probe failed)",
  };
  try {
    await page.goto(`${base}/reports`, { waitUntil: "domcontentloaded" });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2600);

    // C1 — open + type + the disabled-Save flip
    await page.locator('main button:has-text("Saved Reports")').first().click();
    await page.waitForTimeout(900);
    const input = page.locator('[role="dialog"] input[id="reportName"], [role="dialog"] input[placeholder*="Q1"]').first();
    if (!(await input.count())) return out;
    await input.click();
    await input.fill("Walk63 Report");
    await page.waitForTimeout(400);
    out.typeFlipsSave = !(await page
      .locator('[role="dialog"] button:has-text("Save Report")')
      .first()
      .isDisabled()
      .catch(() => null));

    // C2 — the SAVE round-trip (the localStorage seam — discarded with the context)
    await page.locator('[role="dialog"] button:has-text("Save Report")').first().click();
    await page.waitForTimeout(900);
    const dialogClosed = (await page.evaluate(`(() => !document.querySelector('[role="dialog"][data-state="open"]'))()`)) as boolean;
    const triggerAfter = ((await page.locator('main button:has-text("Saved Reports")').first().textContent()) ?? "").trim();
    out.saveRoundTrip = `dialogClosed=${dialogClosed} triggerAfter="${triggerAfter}"`;

    // C3 — the post-save REOPEN (the L-74c8 clear) + the saved-list arm
    await page.locator('main button:has-text("Saved Reports")').first().click();
    await page.waitForTimeout(900);
    const reopen = (await page.evaluate(`(() => {
      const dlg = document.querySelector('[role="dialog"]');
      const input = dlg ? dlg.querySelector("input[id='reportName'], input[placeholder*='Q1']") : null;
      const loadBtns = dlg ? Array.from(dlg.querySelectorAll("button")).filter((b) => /^Load$/i.test((b.textContent ?? "").trim())) : [];
      const load = loadBtns[0];
      const row = load ? load.closest("div.flex") : null;
      const date = row ? (row.querySelector("p.text-xs")?.textContent ?? "").trim() : "";
      const name = row ? (row.querySelector("p.font-medium")?.textContent ?? "").trim() : "";
      return {
        name: input ? input.value : "(no input)",
        loadButtons: loadBtns.length,
        loadCls: load ? load.getAttribute("class") ?? "" : "",
        rowName: name,
        rowDate: date,
      };
    })()`).catch(() => null)) as { name: string; loadButtons: number; loadCls: string; rowName: string; rowDate: string } | null;
    if (reopen) {
      out.reopenName = reopen.name;
      out.reopenLoadButtons = reopen.loadButtons;
      if (reopen.loadButtons > 0) {
        out.savedRow = {
          name: reopen.rowName,
          date: reopen.rowDate,
          loadCls: reopen.loadCls,
          box: "",
          loadFace: (await page.evaluate(`(() => { const b = Array.from(document.querySelectorAll('[role="dialog"] button')).find((x) => /^Load$/i.test((x.textContent ?? "").trim())); return b ? ${FACE_JS}(b) : null; })()`)) as Face | null,
        };
      }
    }

    // C4 — the cancel-then-reopen decode (the L-74c7 keep: the typed
    // name survives a cancel; the s74 contract — the n3e state lives
    // outside the portal)
    await page.keyboard.press("Escape").catch(() => undefined);
    await page.waitForTimeout(600);
    await page.locator('main button:has-text("Saved Reports")').first().click();
    await page.waitForTimeout(800);
    const input2 = page.locator('[role="dialog"] input[id="reportName"], [role="dialog"] input[placeholder*="Q1"]').first();
    if (await input2.count()) {
      await input2.click();
      await input2.fill("Keep Me");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(600);
      await page.locator('main button:has-text("Saved Reports")').first().click();
      await page.waitForTimeout(800);
      out.cancelReopenKeepsName = (await page.evaluate(`(() => { const i = document.querySelector('[role="dialog"] input'); return i ? i.value : null; })()`)) as boolean | null;
    }
    await page.keyboard.press("Escape").catch(() => undefined);
    await page.waitForTimeout(500);

    // C5 — the checkbox-toggle ride: one column checkbox (the
    // UNCHECKED face — all six ride checked by default), then restored
    await page.locator('main button:has-text("Saved Reports")').first().click();
    await page.waitForTimeout(800);
    const before = (await page.evaluate(`(() => { const c = document.querySelector('[role="dialog"] [role="checkbox"], [role="dialog"] input[type="checkbox"]'); return c ? ${FACE_JS}(c) : null; })()`)) as Face | null;
    const cb = page.locator('[role="dialog"] [role="checkbox"], [role="dialog"] input[type="checkbox"]').first();
    if (await cb.count()) {
      await cb.click();
      await page.waitForTimeout(400);
      const after = (await page.evaluate(`(() => { const c = document.querySelector('[role="dialog"] [role="checkbox"], [role="dialog"] input[type="checkbox"]'); return c ? ${FACE_JS}(c) : null; })()`)) as Face | null;
      await cb.click().catch(() => undefined);
      await page.waitForTimeout(300);
      out.checkboxToggle = before && after
        ? `checked bg=${before.bg} border="${before.border}" -> unchecked bg=${after.bg} border="${after.border}" (restored)`
        : "(faces missing)";
    } else {
      out.checkboxToggle = "(no checkbox)";
    }
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
    if (ja !== jb) out.push(`${name}[${i}] <${a.tag}> aria: OURS ${ja} | REF ${jb}`);
  }
  if (!structural) out.push(`${name}: rows STRUCTURALLY IDENTICAL (${o.length} rows) modulo the aria/data naming`);
  return out;
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[walk63] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[walk63] pair state: ready (the s162 guarded form)");
    mkdirSync(OUT_DIR, { recursive: true });
    const report: string[] = [];

    // ===== Phase A — the OPEN dialog census at BOTH axes =====
    const oursDlg = await dialogPhase(browser, OUR_URL, state, { w: 1440, h: 900 });
    const refDlg = await dialogPhase(browser, REF_URL, state, { w: 1440, h: 900 });
    const oursDlgp = await dialogPhase(browser, OUR_URL, state, { w: 390, h: 844 });
    const refDlgp = await dialogPhase(browser, REF_URL, state, { w: 390, h: 844 });
    writeFileSync(join(OUT_DIR, "ours-dialog-desktop.json"), JSON.stringify(oursDlg, null, 2));
    writeFileSync(join(OUT_DIR, "ref-dialog-desktop.json"), JSON.stringify(refDlg, null, 2));
    writeFileSync(join(OUT_DIR, "ours-dialog-phone.json"), JSON.stringify(oursDlgp, null, 2));
    writeFileSync(join(OUT_DIR, "ref-dialog-phone.json"), JSON.stringify(refDlgp, null, 2));

    report.push("\n===== SAVE-CUSTOM-VIEW DIALOG @1440x900 =====");
    report.push(`found: OURS ${oursDlg.found} | REF ${refDlg.found}`);
    report.push(`trigger: OURS "${oursDlg.triggerText}" ${oursDlg.triggerBox} | REF "${refDlg.triggerText}" ${refDlg.triggerBox}`);
    report.push(...faceDelta("trigger.face", oursDlg.triggerFace, refDlg.triggerFace));
    report.push(`root: OURS ${oursDlg.rootBox} | REF ${refDlg.rootBox}`);
    report.push(`root.cls: OURS "${oursDlg.rootCls}"`);
    report.push(`          REF  "${refDlg.rootCls}"`);
    report.push(...faceDelta("root.face", oursDlg.rootFace, refDlg.rootFace));
    report.push(`title: OURS "${oursDlg.title}" | REF "${refDlg.title}"`);
    report.push(`title.cls: OURS "${oursDlg.titleCls}" | REF "${refDlg.titleCls}"`);
    if (oursDlg.input && refDlg.input) {
      report.push(`input.placeholder: OURS "${oursDlg.input.placeholder}" | REF "${refDlg.input.placeholder}"`);
      report.push(`input.font: OURS ${oursDlg.input.font} line ${oursDlg.input.lineHeight} | REF ${refDlg.input.font} line ${refDlg.input.lineHeight}`);
      report.push(`input.box: OURS ${oursDlg.input.box} | REF ${refDlg.input.box}`);
      report.push(`input.id/labelledBy: OURS ${oursDlg.input.id}/${oursDlg.input.labelledBy} | REF ${refDlg.input.id}/${refDlg.input.labelledBy}`);
      report.push(`input.cls: OURS "${oursDlg.input.cls}"`);
      report.push(`           REF  "${refDlg.input.cls}"`);
      report.push(...faceDelta("input.face", oursDlg.input.face, refDlg.input.face));
    } else {
      report.push(`input: presence OURS=${!!oursDlg.input} REF=${!!refDlg.input}`);
    }
    if (oursDlg.checkboxes && refDlg.checkboxes) {
      report.push(`checkboxes: OURS (${oursDlg.checkboxes.count}) [${oursDlg.checkboxes.labels.join(" | ")}]`);
      report.push(`             REF  (${refDlg.checkboxes.count}) [${refDlg.checkboxes.labels.join(" | ")}]`);
      report.push(`checkbox[0].box: OURS ${oursDlg.checkboxes.firstBox} | REF ${refDlg.checkboxes.firstBox}`);
      report.push(`checkbox[0].cls: OURS "${oursDlg.checkboxes.firstCls}"`);
      report.push(`                 REF  "${refDlg.checkboxes.firstCls}"`);
      report.push(...faceDelta("checkbox[0].face", oursDlg.checkboxes.firstFace, refDlg.checkboxes.firstFace));
    } else {
      report.push(`checkboxes: presence OURS=${!!oursDlg.checkboxes} REF=${!!refDlg.checkboxes}`);
    }
    if (oursDlg.summary && refDlg.summary) {
      report.push(`summary: OURS "${oursDlg.summary.text}" | REF "${refDlg.summary.text}"`);
      report.push(`summary.cls: OURS "${oursDlg.summary.cls}" | REF "${refDlg.summary.cls}"`);
      report.push(`summary.box: OURS ${oursDlg.summary.box} | REF ${refDlg.summary.box}`);
    }
    for (let i = 0; i < Math.max(oursDlg.footer.length, refDlg.footer.length); i++) {
      const a = oursDlg.footer[i];
      const b = refDlg.footer[i];
      if (!a || !b) { report.push(`footer[${i}]: presence OURS=${!!a} REF=${!!b}`); continue; }
      report.push(`footer[${i}] "${a.text}"${a.disabled ? " [disabled]" : ""}: OURS ${a.box} | REF ${b.box}`);
      report.push(...faceDelta(`footer[${i}].face`, a.face, b.face).map((l) => `  ${l}`));
    }
    report.push(`closeAria: OURS "${oursDlg.closeAria}" | REF "${refDlg.closeAria}"`);
    report.push(`mountFocus: OURS "${oursDlg.mountFocus}" | REF "${refDlg.mountFocus}"`);
    report.push(...faceDelta("mountFocus.face", oursDlg.mountFocusFace, refDlg.mountFocusFace));
    report.push(`escapeClosed: OURS ${oursDlg.escapeClosed} | REF ${refDlg.escapeClosed}`);
    report.push(...diffRows("dialogLedger", oursDlg.ledger, refDlg.ledger));

    report.push("\n===== SAVE-CUSTOM-VIEW DIALOG @390x844 =====");
    report.push(`found: OURS ${oursDlgp.found} | REF ${refDlgp.found}`);
    report.push(`phone root: OURS ${oursDlgp.rootBox} | REF ${refDlgp.rootBox}`);
    if (oursDlgp.input && refDlgp.input) {
      report.push(`phone input.box: OURS ${oursDlgp.input.box} | REF ${refDlgp.input.box}`);
      report.push(`phone input.font: OURS ${oursDlgp.input.font} | REF ${refDlgp.input.font}`);
      report.push(...faceDelta("phone input.face", oursDlgp.input.face, refDlgp.input.face));
    }
    if (oursDlgp.checkboxes && refDlgp.checkboxes) {
      report.push(`phone checkboxes: OURS (${oursDlgp.checkboxes.count}) | REF (${refDlgp.checkboxes.count})`);
      report.push(`phone checkbox[0].box: OURS ${oursDlgp.checkboxes.firstBox} | REF ${refDlgp.checkboxes.firstBox}`);
    }
    for (let i = 0; i < Math.max(oursDlgp.footer.length, refDlgp.footer.length); i++) {
      const a = oursDlgp.footer[i];
      const b = refDlgp.footer[i];
      if (!a || !b) continue;
      report.push(`phone footer[${i}] "${a.text}": OURS ${a.box} | REF ${b.box}`);
    }

    // ===== Phase B — the REAL keyboard Tab drives through the dialog =====
    const oursTab = await tabPhase(browser, OUR_URL, state, { w: 1440, h: 900 });
    const refTab = await tabPhase(browser, REF_URL, state, { w: 1440, h: 900 });
    writeFileSync(join(OUT_DIR, "ours-tab.json"), JSON.stringify(oursTab, null, 2));
    writeFileSync(join(OUT_DIR, "ref-tab.json"), JSON.stringify(refTab, null, 2));
    report.push("\n===== DIALOG REAL-TAB CHAIN @1440x900 =====");
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
    report.push(`REAL FOCUS-VISIBLE on the input: OURS outline="${oursTab.inputFocus?.outline}"`);
    report.push(`                                REF  outline="${refTab.inputFocus?.outline}"`);
    report.push(`REAL input ring: OURS "${oursTab.inputFocus?.ring.slice(0, 200)}"`);
    report.push(`                  REF  "${refTab.inputFocus?.ring.slice(0, 200)}"`);
    report.push(`REAL FOCUS-VISIBLE on checkbox[0]: OURS outline="${oursTab.checkboxFocus?.outline}" ring="${oursTab.checkboxFocus?.ring.slice(0, 160)}"`);
    report.push(`                                    REF  outline="${refTab.checkboxFocus?.outline}" ring="${refTab.checkboxFocus?.ring.slice(0, 160)}"`);
    report.push(`REAL FOCUS-VISIBLE on Save: OURS outline="${oursTab.saveFocus?.outline}" ring="${oursTab.saveFocus?.ring.slice(0, 160)}"`);
    report.push(`                             REF  outline="${refTab.saveFocus?.outline}" ring="${refTab.saveFocus?.ring.slice(0, 160)}"`);
    report.push(`escapeClosed (B): OURS ${oursTab.escapeClosed} | REF ${refTab.escapeClosed}`);

    // ===== Phase C — the interactive arms =====
    const oursInt = await interactivePhase(browser, OUR_URL, state);
    const refInt = await interactivePhase(browser, REF_URL, state);
    writeFileSync(join(OUT_DIR, "ours-interactive.json"), JSON.stringify(oursInt, null, 2));
    writeFileSync(join(OUT_DIR, "ref-interactive.json"), JSON.stringify(refInt, null, 2));
    report.push("\n===== DIALOG INTERACTIVE ARMS @1440x900 =====");
    report.push(`typeFlipsSave: OURS ${oursInt.typeFlipsSave} | REF ${refInt.typeFlipsSave}`);
    report.push(`saveRoundTrip: OURS ${oursInt.saveRoundTrip}`);
    report.push(`               REF  ${refInt.saveRoundTrip}`);
    report.push(`reopenName (L-74c8 post-save clear): OURS "${oursInt.reopenName}" | REF "${refInt.reopenName}"`);
    report.push(`reopenLoadButtons: OURS ${oursInt.reopenLoadButtons} | REF ${refInt.reopenLoadButtons}`);
    if (oursInt.savedRow && refInt.savedRow) {
      report.push(`savedRow: OURS name="${oursInt.savedRow.name}" date="${oursInt.savedRow.date}" | REF name="${refInt.savedRow.name}" date="${refInt.savedRow.date}"`);
      report.push(`savedRow.loadCls: OURS "${oursInt.savedRow.loadCls}" | REF "${refInt.savedRow.loadCls}"`);
      report.push(...faceDelta("savedRow.loadFace", oursInt.savedRow.loadFace, refInt.savedRow.loadFace));
    }
    report.push(`cancelReopenKeepsName (L-74c7): OURS ${oursInt.cancelReopenKeepsName} | REF ${refInt.cancelReopenKeepsName}`);
    report.push(`checkboxToggle: OURS ${oursInt.checkboxToggle}`);
    report.push(`                REF  ${refInt.checkboxToggle}`);

    writeFileSync(join(OUT_DIR, "delta-report.txt"), report.join("\n"));
    console.log(report.join("\n"));
    console.log(`\n[walk63] ledger + delta report written to ${OUT_DIR}`);
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
  console.error("[walk63]", e);
  process.exit(1);
});

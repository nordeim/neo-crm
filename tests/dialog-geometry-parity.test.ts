// Session-92 pins: the dialog-geometry family (the 92-c rotation — the
// dialogs-at-390 walk; every dialog family opened at TRUE 390px on BOTH
// apps, geometry + construction diffed live).
//
// THE HEADLINE (M-92c1) — THE PHANTOM-MB SELECT-TRIGGER GENUS, a NEW
// v4 space-y face: Radix renders a hidden native <select>
// (position:absolute, aria-hidden, NO `hidden` attribute) as the LAST
// TREE-CHILD of every Select group inside <form> contexts — so v4's
// `:where(.space-y-2 > :not(:last-child))` matches the TRIGGER (a
// non-last child!) and gives it margin-bottom: 8px, where v3's
// `:not([hidden]) ~ :not([hidden])` rule gave the trigger margin-TOP
// only (mb always 0 on the reference — live-probed). In plain block
// groups the phantom mb collapses out through the parent's bottom
// edge (invisible — but the computed mb is 8 vs the reference's 0:
// the Lead Status/Source triggers). WHERE THE GROUP IS A DIRECT GRID
// ITEM (grid items establish a BFC — child margins are contained and
// can NEVER collapse out) THE GROUP INFLATES 68 -> 76: LIVE-verified
// on the Account create dialog's Status group (ours 76 vs ref 68; the
// dialog 516 vs 508; the 4th row track 76px vs 68px) and the Contact
// create dialog's "How did you meet?" group (76 vs 68). Proven by
// isolation: the display:block natural-height test returns 68 for
// every group at any width — the +8 exists only in the grid/BFC
// context.
//
// The fix: `DIALOG_GROUP.controlMt` "mt-2" -> "mt-2 mb-0" — mb-0 at
// (0,1,0) beats the :where() rule at (0,0,0), every controlMt trigger
// computes mb 0 = the reference. The token's Input call sites are
// unaffected (Inputs are genuine last children — mb already 0).
//
// - L-92c2 THE CONTACT DIALOG'S SECTIONS: the reference nests each
//   section as space-y-4 [H3, field-group, field-group] (live-probed:
//   two 188px section divs); ours flattened the H3s as separate grid
//   items — the H3->field gap computed 24px (the grid gap-6) where the
//   reference computes 16px (the section's space-y-4) = +16px.
// - M-92c3 THE EVENT DIALOG'S DESCRIPTION ROWS: the reference's
//   textarea is rows=3 (live-probed 90px); ours rendered rows=2 (66px,
//   the HTML default — the rows prop never set; the house's own
//   entity-dialogs comment documents "the Event dialog's rows=3").
// - N-92c4 THE IMPORT DIALOG'S COLUMNS-BOX p2: the box carries
//   space-y-1; the reference's `font-semibold mt-2` p2 COMPUTES 4px
//   (v3's space-y-1 rule at (0,3,0) overrides the (0,1,0) utility);
//   ours computed 8px (v4's :where at (0,0,0) loses to it) — the
//   M-91c2 genus in the INVERSE direction. Fixed to mt-1 per the s11
//   computed-gap rule.
//
// The census anchors: the dialog select census (the 4 controlMt
// triggers; the Event family's BARE-cell selects immune by
// construction), the textarea rows family (Event 3 + Activity 4), and
// the space-y usage census (F-92a1: the s91 header's "all 99 space-y
// usages" was not re-derivable — this suite's algorithm is the
// documented method: the s91 suite's own noComments() strip + a
// global occurrence count over src/**/*.{ts,tsx}).

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");
const dialogsSrc = () => read("src/components/shared/entity-dialogs.tsx");
const contactsSrc = () => read("src/app/(app)/contacts/contacts-page.tsx");
const layoutSrc = () => read("src/lib/page-layout.ts");

/** Strip block comments (the assertions scan the CODE, not the prose —
 * the s88/s90 needle-in-own-docs lesson: retirement comments
 * legitimately name the retired tokens). */
function noComments(s: string): string {
  return s.replace(/\{\/[\s\S]*?\*\//g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/[^\n]*$/gm, "$1");
}

/** The Account create dialog body: from the ACCOUNT_DIALOG.body div to
 * the DialogFooter. */
function accountBody(): string {
  const src = dialogsSrc();
  const start = src.indexOf("ACCOUNT_DIALOG.body");
  const end = src.indexOf("DialogFooter", start);
  return src.slice(start, end);
}

/** The Contact create dialog body: from the CONTACT_DIALOG.body div to
 * the DialogFooter. */
function contactBody(): string {
  const src = dialogsSrc();
  const start = src.indexOf("CONTACT_DIALOG.body");
  const end = src.indexOf("DialogFooter", start);
  return src.slice(start, end);
}

/** The Event dialog form: from the EVENT_DIALOG.form to the Event
 * dialog's own footer button (the Create Event label — before the
 * ActivityDialog component begins). */
function eventForm(): string {
  const src = dialogsSrc();
  const start = src.indexOf("EVENT_DIALOG.form");
  const end = src.indexOf('"Create Event"', start);
  return src.slice(start, end);
}

/** The Import dialog columns box: the bg-gray-50 box region. */
function importColumnsBox(): string {
  const src = contactsSrc();
  const start = src.indexOf("bg-gray-50 rounded-lg p-3");
  const end = src.indexOf("</div>", src.indexOf("Optional columns", start));
  return src.slice(start, end);
}

describe("session-92 (M-92c1): the phantom-mb select-triggers (the Radix native-select tree-sibling genus)", () => {
  it("DIALOG_GROUP.controlMt gains mb-0 (the phantom margin-bottom neutralized at (0,1,0) vs the :where() (0,0,0) rule)", async () => {
    const L = (await import("@/lib/page-layout")).DIALOG_GROUP;
    expect(L.controlMt).toBe("mt-2 mb-0");
  });

  it("the genus is documented at the token (the hidden native select + v4's :not(:last-child) + the BFC containment)", () => {
    const src = layoutSrc();
    const i = src.indexOf('controlMt: "mt-2 mb-0"');
    const comment = src.slice(Math.max(0, i - 1400), i);
    expect(comment).toMatch(/M-92c1/);
    expect(comment).toMatch(/native/);
    expect(comment).toMatch(/:not\(:last-child\)/);
  });

  it("the dialog select census: exactly 4 triggers ride controlMt + w-full (Account Status, Contact Source, Lead Status + Source)", () => {
    const src = noComments(dialogsSrc());
    const sites = src.match(/controlMt \+ " w-full"/g) ?? [];
    expect(sites.length).toBe(4);
  });

  it("the Event family's selects stay BARE-CELL (className=\"w-full\", no controlMt — no space-y ancestor, immune by construction)", () => {
    const form = noComments(eventForm());
    const bareTriggers = form.match(/<SelectTrigger className="w-full"/g) ?? [];
    expect(bareTriggers.length).toBe(3);
    expect(form).not.toMatch(/<SelectTrigger className={DIALOG_GROUP/);
  });
});

describe("session-92 (L-92c2): the contact dialog's NESTED sections", () => {
  it("each h3 sits INSIDE its space-y-4 section div (the reference's own construction — the H3->field gap 16px, not the grid's 24px)", () => {
    const body = noComments(contactBody());
    // post-fix: the pairGroup opens and the h3 is its FIRST child
    expect(body).toMatch(/CONTACT_DIALOG\.pairGroup}>\s*(?:\{\/\*[\s\S]*?\*\/\s*)?<h3/);
  });

  it("both section headers nest (Contact Details + Professional Details — two sections, the fields follow inside)", () => {
    const body = noComments(contactBody());
    const nested = body.match(/CONTACT_DIALOG\.pairGroup}>[\s\S]{0,400}?<h3/g) ?? [];
    expect(nested.length).toBe(2);
  });

  it("no h3 is a DIRECT child of the body grid (the flattened construction retired)", () => {
    const body = noComments(contactBody());
    // pre-fix the h3 directly followed the avatar section at grid level;
    // post-fix every h3 is preceded by a pairGroup open tag within 400 chars
    const direct = body.match(/<\/div>\s*<h3/g) ?? [];
    expect(direct).toHaveLength(0);
  });

  it("the section wrapper keeps the reference's space-y-4 (the pairGroup token unchanged)", async () => {
    const L = (await import("@/lib/page-layout")).CONTACT_DIALOG;
    expect(L.pairGroup).toBe("space-y-4");
  });
});

describe("session-92 (M-92c3): the Event dialog's Description rows", () => {
  it("the ev-desc Textarea carries rows={3} (the reference's own rows — 90px vs our collapsed 66px)", () => {
    const form = eventForm();
    expect(form).toMatch(/<Textarea id="ev-desc"[^>]*rows=\{3\}/);
  });

  it("the textarea rows family census: Event rows=3 + Activity rows=4 (the two dialog textareas, both the reference's own)", () => {
    const src = noComments(dialogsSrc());
    const rowses = src.match(/rows=\{(\d)\}/g) ?? [];
    expect(rowses).toEqual(["rows={3}", "rows={4}"]);
  });
});

describe("session-92 (N-92c4): the import dialog's columns-box p2 margin", () => {
  it("the Optional-columns p carries mt-1 (the reference COMPUTES 4px — v3's space-y-1 rule at (0,3,0) kills the mt-2)", () => {
    const box = importColumnsBox();
    expect(box).toContain('className="font-semibold mt-1"');
    expect(box).not.toContain('className="font-semibold mt-2"');
  });

  it("the v3-kill is documented (the s11 computed-gap rule, the M-91c2 inverse)", () => {
    const src = contactsSrc();
    const i = src.indexOf('className="font-semibold mt-1"');
    const comment = src.slice(Math.max(0, i - 1200), i);
    expect(comment).toMatch(/N-92c4/);
  });
});

describe("session-92 (F-92a1): the space-y usage census (the documented method)", () => {
  // The s91 header claimed "all 99 space-y usages" — not re-derivable
  // by any method (the raw grep is 172 lines; the comment-stripped
  // occurrence count is the census below). This it IS the method: the
  // s91 suite's own noComments() strip + a global occurrence count
  // over src/**/*.{ts,tsx}. Re-derive here when the codebase changes.
  it("the census: 112 comment-stripped space-y occurrences across the 19 src files that carry one", () => {
    const files = execFileSync(
      "grep",
      ["-rl", "space-y-", `${root}/src`, "--include=*.ts", "--include=*.tsx"],
      { encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean);
    let total = 0;
    for (const f of files) {
      const stripped = noComments(readFileSync(f, "utf8"));
      total += (stripped.match(/space-y-/g) ?? []).length;
    }
    expect(files.length).toBe(19);
    expect(total).toBe(112);
  });

  it("the s91 header's unstable '99' claim is re-derived (spacey-hazard-parity no longer asserts an un-derivable count)", () => {
    const s91 = read("tests/spacey-hazard-parity.test.ts");
    expect(s91).not.toMatch(/all 99 space-y/);
    expect(s91).toMatch(/112 comment-stripped/);
  });

  it("the SKILL project_state + the PAD row carry the re-derived census (the living docs, method-stated)", () => {
    expect(read("neo-crm_SKILL.md")).toMatch(/112 comment-stripped space-y occurrences/);
    expect(read("Project_Architecture_Document.md")).not.toMatch(/all 99 space-y/);
  });
});

describe("session-92 (F-92a2 + B-92a5 + B-92a4): the audit nanos", () => {
  it("the stat-value-contract header: the leads arm is EXPLICIT (the shared IconStatCard arm) — 2 bare + 4 explicit, no phantom 'leads-contacts-arm' label", () => {
    const header = read("tests/stat-value-contract.test.ts").slice(0, 2400);
    expect(header).toMatch(/two BARE families/);
    expect(header).not.toMatch(/three BARE families/);
    expect(header).not.toMatch(/leads-contacts-arm/);
  });

  it("the constants.test B-2 label: the correct attribution (not 'G-91a2-class')", () => {
    const src = read("tests/constants.test.ts");
    expect(src).not.toMatch(/G-91a2-class/);
    expect(src).toMatch(/B-2-class/);
  });

  it("AGENTS.md carries the §Session-91 history block (the per-session cadence restored)", () => {
    expect(read("AGENTS.md")).toMatch(/### Session-91 — the v4 space-y hazard family/);
  });

  it("the CLAUDE.md stale 1788 anchors are re-derived (the test-pyramid line + the coverage line — F-92a3)", () => {
    const claude = read("CLAUDE.md");
    expect(claude).toContain("Unit (Vitest, 1828 checks)");
    expect(claude).toContain("(currently 1828)");
    expect(claude).not.toMatch(/1788 checks/);
    expect(claude).not.toMatch(/currently 1788/);
  });
});

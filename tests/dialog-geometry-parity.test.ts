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

  it("the Event family's selects stay BARE-CELL (className=\"w-full\", no controlMt — no space-y ancestor, immune by construction; session-172: the aria-label prefix joins the construction — the naming fix, attribute-only)", () => {
    const form = noComments(eventForm());
    // the s172 named form: the trigger leads with its aria-label, then
    // the SAME bare className (no controlMt compensator)
    const bareTriggers = form.match(/<SelectTrigger aria-label="[^"]+" className="w-full"/g) ?? [];
    expect(bareTriggers.length).toBe(3);
    expect(form).not.toMatch(/<SelectTrigger className={DIALOG_GROUP/);
    // no nameless Event-family trigger remains (the F-172a cure)
    expect(form).not.toMatch(/<SelectTrigger className="w-full"/);
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
  it("the census: 123 comment-stripped space-y occurrences across the 23 src files that carry one", () => {
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
    // session-163 re-anchor: 115 -> 117 / 20 -> 21 files (the reset-
    // password screen — the digma reset-funnel port: the form heading's
    // `space-y-2 sm:space-y-3` + the invalid-link/success cards'
    // centered stacks ride the login family's own vocabulary)
    expect(files.length).toBe(23);
    // session-147 re-anchor: 114 -> 115 (the s147 sheet re-derivation: the
    // mobile drawer's SheetHeader carries the reference's own
    // `flex flex-col space-y-2` rhythm — the sheet family's header, live-
    // censused on its parity-event bundle; page-layout.ts already a census
    // file, the count +1 occurrence, the file set unchanged)
    // session-96 re-anchor: 112 -> 111 (the v4 space-y genus fix on the
    // auth fields — the two `space-y-1.5` field constants retired to the
    // `[&>*+*]:mt-1.5` v3-semantics variant, the google wrap's inert
    // `space-y-3` added inside the new w-full section: net −1)
    // session-98 re-anchor: 111 -> 110 / 19 -> 18 files (the CardHeader
    // base's `space-y-1.5` retired to the `[&>*+*]:mt-1.5` v3-semantics
    // variant — the F-98c1 row-genus fix; card.tsx's only space-y, the
    // file drops out of the census)
    // session-111 re-anchor: 110 -> 108 (the s111 login-family re-walk:
    // the signup titleStack wrapper retired [its inert single-child
    // space-y-2] + the verify headingStack's `space-y-3 sm:space-y-4`
    // re-pinned to the reference's flat `space-y-2` — the sm: arm's
    // second occurrence retired; net −2)
    // session-123 re-anchor: 108 -> 107 (the F-123a6 reports Tabs fix:
    // the wrapper's `space-y-6` retired for the panels' `mt-6` — the v4
    // mb-model's trailing margin extended the scroll extent; the s96/s98
    // v3-semantics lineage, now at the reports wrapper)
    // session-142 re-anchor: 107 -> 114 / 18 -> 20 files (the s142
    // marketing-layer parity build: the PUBLIC landing page — the
    // reference's own space-y constructions mirrored verbatim [its
    // mobile menu panel space-y-3, its FAQ-free mock sidebar space-y-1,
    // the hero mock main space-y-3, the preview rows' space-y-12
    // sm:space-y-16, the pricing lists' space-y-3] + the /about page's
    // space-y-4 intro block [both live in the two new census files; the
    // +7 occurrences are all reference-censused constructions, not
    // regressions of the v4 genus — the landing + about pages ride the
    // reference's OWN v3-era class strings])
    // session-187 re-anchor: 123 -> 122 (the walk60 D-187a3 cure: the
    // SETTINGS_DATA.listBody `space-y-2` retired to the
    // `[&>*+*]:mt-2` v3-semantics variant — the v4 flip's INLINE-FLOW
    // variant, the reference's margin-TOP-on-following dropping its
    // byte-equal baseline-aligned button row 8px below our row at the
    // same byte-equal title/desc/content boxes; the s96/s98/s123
    // v3-semantics lineage, now at the settings Data-tab list body —
    // page-layout.ts already a census file, the count −1 occurrence, the
    // file set unchanged)
    expect(total).toBe(122);
  });

  it("the s91 header's unstable '99' claim is re-derived (spacey-hazard-parity no longer asserts an un-derivable count)", () => {
    const s91 = read("tests/spacey-hazard-parity.test.ts");
    expect(s91).not.toMatch(/all 99 space-y/);
    expect(s91).toMatch(/108 comment-stripped/);
  });

  it("the SKILL project_state + the PAD row carry the re-derived census (the living docs, method-stated)", () => {
    // session-93 pin-shape repair: the census phrase lives line-wrapped in
    // §16cf ("112\n  comment-stripped space-y occurrences") — the s92 form
    // matched only the UNWRAPPED project_state line and went brittle the
    // moment the s93 project_state stopped repeating it. Flexible
    // whitespace keeps the semantic anchor (the census, method-stated)
    // without depending on where the line breaks.
    expect(read("neo-crm_SKILL.md")).toMatch(/108\s+comment-stripped space-y occurrences/);
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
    // session-97 lockstep carry-forward: 1849 -> 1862 (the s97 +13 — the
    // 3 tablet-class baseline pins + the 5 parseNumberArg fail-fast pins
    // + the stale-comment pin + the 4 gate:full pins — the same lockstep
    // s92 performed 1788 -> 1828, s93 1828 -> 1829, s94 1829 -> 1832,
    // s95 1832 -> 1836, s96 1836 -> 1849)
    // session-98 lockstep carry-forward: 1862 -> 1870 (the s98 +8 — the
    // 2 CardHeader row-genus pins + the 2 vs-wins legend pins + the 4
    // sweep docs/per-class-print pins)
    // session-99 lockstep carry-forward: 1870 -> 1872 (the s99 +2 — the
    // landscape table pin + the landscape driftVerdict contrast pin;
    // the banding/doc/explained/gate/lockstep pins are re-anchors,
    // not new its)
    // session-100 lockstep carry-forward: 1872 -> 1880 (the s100 +8 —
    // the 7 clusterDiff seam pins + the 1 --clusters wiring pin; the
    // ALL-FIVE parseNumberArg re-anchor + this lockstep are re-anchors,
    // not new its)
    // session-101 lockstep carry-forward: 1880 -> 1892 (the s101 +12 —
    // the 2 clusterDiff edge-wrap pins + the 10 drift-probe-tool pins;
    // this lockstep is a re-anchor, not a new it)
    // session-102 lockstep carry-forward: 1892 -> 1903 (the s102 +11 —
    // the 11 docs-counts secondary-sites pins; this lockstep is a
    // re-anchor, not a new it)
    // session-103 lockstep carry-forward: 1903 -> 1915 (the s103 +12 —
    // the 11 seeded-charts freeze pins + the s103-maiden sweep-tool
    // floor pin; this lockstep is a re-anchor, not a new it)
    // session-104 lockstep carry-forward: 1915 -> 1921 (the s104 +6 —
    // the docs-counts e2e-count lockstep extension: the AGENTS/CLAUDE/
    // README/PAD e2e-site pins + the e2e stale-form negatives + the
    // mobile-nav suite-count pin; this lockstep is a re-anchor, not a
    // new it)
    // session-105 lockstep carry-forward: unit UNCHANGED at 1921 (the
    // s105 rotation added zero unit its; this lockstep untouched).
    // session-106 lockstep carry-forward: 1921 -> 1922 (the s106 +1 —
    // the docs-counts H1/project_state lockstep it, the F-106a1 fix)
    // + the F-106c1 third site joined: CLAUDE's commands-table unit
    // row ("Vitest unit suites (N checks)") was an UNPINNED
    // live-tense unit-count site — the F-99a1 genus on the CLAUDE
    // commands-table axis, missed by the s102/s104 locksteps (found
    // in-flight during the s106 plan validation).
    // session-107 lockstep carry-forward: 1922 -> 1927 (the s107 +5 —
    // the seeded-reports-kpis freeze suite [+4] + the docs-counts
    // Appendix B totals pin [+1]) + the F-107b1 FOURTH site joined:
    // CLAUDE's gate-order unit half ("`bun run test` (N)") was another
    // UNPINNED live-tense unit-count site — the docs-counts AGENTS
    // gate-order pin covered only AGENTS while CLAUDE's e2e half was
    // already pinned (the asymmetry; found in-flight during the s107
    // plan validation).
    // session-108 lockstep carry-forward: 1927 -> 1932 (the s108 +5 —
    // the calendar-grid freeze suite [+3] + the calendar-cells chip
    // pin [+1] + the docs-counts four-site pin [+1]); the four sites
    // re-anchored, the retired 1927 forms join the negatives below.
    // session-109 lockstep carry-forward: 1932 -> 1934 (the s109 +2 —
    // the activities-calendar-parity row pin [+1] + the docs-counts
    // line-census pin [+1]); the four sites re-anchored again, the
    // retired 1932 forms join the negatives below.
    // session-110 lockstep carry-forward: 1934 -> 1938 (the s110 +4 —
    // the seeded-dashboard-kpis freeze suite, the dashboardKpis seam
    // extraction); the four sites re-anchored again, the retired 1934
    // forms join the negatives below.
    // session-111 lockstep carry-forward: 1938 -> 1942 (the s111 +4 —
    // the login-family LIVE re-walk's four new its; the two re-anchors
    // land in existing its, no net change); the four sites re-anchored
    // again, the retired 1938 forms join the negatives below.
    // session-112 lockstep carry-forward: 1942 -> 1944 (the s112 +2 —
    // the dialog-family LIVE re-walk's two new its: the close-X
    // byte-parity re-pin + the camera aria-label superset pin; both
    // land in EXISTING files); the four sites re-anchored again, the
    // retired 1942 forms join the negatives below.
    // session-113 lockstep carry-forward: 1944 -> 1946 (the s113 +2 —
    // the menu/popover-family LIVE re-walk's two new its: the
    // MENU_CONTENT outline-none retirement re-pin + the Filters
    // field-label LABEL-element pin; both land in page-layout.test.ts);
    // the four sites re-anchored again, the retired 1944 forms join
    // the negatives below.
    // session-114 lockstep carry-forward: 1946 -> 1948 (the s114 +2 —
    // the profile + settings Data-tab family walk's two new its: the
    // profile email/role ID construction pin + the camera/file-input
    // wiring pin; both land in profile-family-parity.test.ts); the
    // four sites re-anchored again, the retired 1946 forms join the
    // negatives below.
    // session-115 lockstep carry-forward: 1948 -> 1950 (the s115 +2 —
    // the Defaults-tab + insights-dialog family walk's two freeze its:
    // the Defaults label htmlFor/id association superset pin
    // [settings-defaults-parity.test.ts] + the insights tabs
    // segmented-variant construction pin [account-surfaces.test.ts]);
    // the four sites re-anchored again, the retired 1948 forms join
    // the negatives below.
    // session-116 lockstep carry-forward: 1950 -> 1951 (the s116 +1 —
    // the reports-tables family walk's freeze it: the ten-CardTitle +
    // risk-construction census pin [reports-tabcontent-parity.test.ts]);
    // the four sites re-anchored again, the retired 1950 forms join
    // the negatives below.
    // session-117 lockstep carry-forward: 1951 -> 1952 (the s117 +1 —
    // the accounts-list family walk's freeze it: the five-KPI-label
    // census pin [account-contacts-parity.test.ts]);
    // the four sites re-anchored again, the retired 1951 forms join
    // the negatives below.
    // session-118 lockstep carry-forward: 1952 -> 1953 (the s118 +1 —
    // the dashboard-charts + leads-statcard family walk's freeze it:
    // the six-label + adjacency census pin
    // [leads-statcard-parity.test.ts]);
    // the four sites re-anchored again, the retired 1952 forms join
    // the negatives below.
    // session-119 lockstep carry-forward: 1953 -> 1956 (the s119 +3 —
    // the contacts-list family walk's freeze its: the
    // primary-foreground re-pin [design-tokens.test.ts] + the
    // four-label + adjacency census pin + the mobile-list empty-state
    // retirement pin [contacts-family-parity.test.ts]);
    // the four sites re-anchored again, the retired 1953 forms join
    // the negatives below.
    // session-120 lockstep carry-forward: 1956 -> 1957 (the s120 +1 —
    // the leads interactive-table family walk's freeze it: the SortHead
    // cursor-pointer census pin [leads-inline.test.ts, the pin-only
    // session, ZERO src changes]);
    // session-121 lockstep carry-forward: 1957 -> 1964 (the s121 +7 —
    // the photo-upload family walk's fixes + freezes: the F-121c1
    // uploads standalone-anchor fix + its 4-it trap pins [a NEW file]
    // + the both-avatar-carriers pin + the profile hint/in-flight
    // pins); the four sites re-anchored again, the retired 1957 forms
    // join the negatives below.
    // session-122 lockstep carry-forward: 1964 -> 1972 (the s122 +8 —
    // the settings-family walk's pin-only freezes: the D-122a0
    // account-card arm pins + the D-122a1 Danger-Zone surface pins +
    // the D-122a2 export title/MIME + EMPTY-face pins + the D-122a3
    // picklist Add-button pin [all in EXISTING files, ZERO src
    // changes]); the four sites re-anchored again, the retired 1964
    // forms join the negatives below.
    // session-123 lockstep carry-forward: 1972 -> 1980 (the s123 +8 —
    // the reports export/PDF walk's six-fix session pins: the
    // D-123a0 sweep/battery dev-spawn guards + the D-123a1 BOM
    // retirement pin + the D-123a2 PDF mm-geometry pins + the
    // D-123a3/4/5 reports-page pins [all in EXISTING files]); the four
    // sites re-anchored again, the retired 1972 forms join the
    // negatives below.
    // session-124 lockstep carry-forward: 1980 -> 1991 (the s124 +11 —
    // the calendar family walk's pin-only session pins: the
    // D-124a0..a6 walk pins [+10 its, activities-calendar-parity] +
    // the D-124a7 csvWithBom dead-code retirement pin [+1 it,
    // csv-contract]).
    // session-125 lockstep carry-forward: 1991 -> 2000 (the s125 +9 —
    // the activities family walk [the LAST never-two-app-walked
    // interactive family]: the F-125c1 segmented active-pill pin [+1
    // it, page-layout] + the D-125a2..a6 walk pins [+8 its,
    // activities-calendar-parity]); the four sites re-anchored again,
    // the retired 1991 forms join the negatives below.
    // session-126 lockstep carry-forward: 2000 -> 2003 (the s126 +3 —
    // the login-family second-cycle re-check [the FIRST re-walk of the
    // second rotation cycle]: the F-126c1 apostrophe pin + the F-126c2
    // auth-input-ink pin + the F-126c3 code-input bg-white pin [+3 its,
    // login-family-parity]); the four sites re-anchored again, the
    // retired 2000 forms join the negatives below.
    // session-127 lockstep carry-forward: 2003 -> 2004 (the s127 +1 —
    // the dialog-family second-cycle re-check [the SECOND re-walk of
    // the second rotation cycle]: the F-127c2 import-submit
    // DARK-NEUTRAL pin [+1 it, import-dialog.test.ts]; the F-127c1
    // placeholder pin re-anchored six -> ten IN PLACE, no new it); the
    // four sites re-anchored again, the retired 2003 forms join the
    // negatives below.
    // session-128 lockstep carry-forward: 2004 -> 2005 (the s128 +1 —
    // the menu-family second-cycle re-check [the THIRD re-walk of the
    // second rotation cycle]: the F-128c1 menu-item focus-wash TEXT-arm
    // pin [+1 it, page-layout.test.ts]); the four sites re-anchored
    // again, the retired 2004 forms join the negatives below.
    // session-130 lockstep carry-forward: 2008 -> 2009 (the s130 +1 —
    // the defaults + insights family second-cycle re-check: the F-130c1
    // ghost-hover-text pin [+1 it, page-layout.test.ts]); the four
    // sites re-anchored again, the retired 2008 forms join the
    // negatives below.
    // session-131 lockstep carry-forward: 2009 -> 2018 (the s131 +9 —
    // the toast family walk: the NEW toast-anatomy suite [2 RED-first
    // fix pins + 7 walk-censused freeze pins]); the four sites
    // re-anchored again, the retired 2009 forms join the negatives
    // below.
    // session-132 lockstep carry-forward: 2018 -> 2021 (the s132 +3 —
    // the reports-tables family third-cycle re-check: the freeze-pin
    // session [D-132a0 the chart-card family freeze +2 its +
    // D-132a1 the bar-trio label freeze +1 it, ZERO src changes]);
    // the four sites re-anchored again, the retired 2018 forms join
    // the negatives below.
    // session-133 lockstep carry-forward: 2021 -> 2023 (the s133 +2 —
    // the accounts-list family third-cycle re-check: the one-fix
    // session [D-133a0 the placeholderState retirement + D-133a2 the
    // freeze pins +2 its, the 8-heads set + the toolbar construction]);
    // the four sites re-anchored again, the retired 2018+2021 forms
    // join the negatives below.
    // session-134 lockstep carry-forward: 2023 -> 2026 (the s134 +3 —
    // the dashboard-charts family third-cycle re-check: the ZERO-FIX/
    // FREEZE-PIN session [D-134a0 the freeze pins +3 its — the 6 KPI
    // labels ordered set + the quick-create menu set + the filter-bar
    // construction order, dashboard-kpi-parity.test.ts; ZERO src
    // changes]); the four sites re-anchored again, the retired
    // 2018+2021+2023 forms join the negatives below.
    // session-135 lockstep carry-forward: 2026 -> 2032 (the s135 +6 —
    // the contacts-list family third-cycle re-check: the ONE-FIX +
    // FREEZE-PIN session [D-135a0 the scan-dialog fix + D-135a1 the
    // pins +6 its, contacts-family-parity.test.ts — the 2 fix pins +
    // the 4 freeze pins]); the four sites re-anchored again, the
    // retired 2026 form joins the negatives below.
    // session-136 lockstep carry-forward: 2032 -> 2036 (the s136 +4 —
    // the leads-table family third-cycle re-check: the ZERO-FIX/
    // FREEZE-PIN session [D-136a0 the freeze pins +4 its — the 9 table
    // heads ordered set + the Gke 4 field labels + the row-menu trio +
    // the edit dialog's 7 labels, leads-family-parity.test.ts; ZERO src
    // changes]); the four sites re-anchored again, the retired 2032
    // form joins the negatives below.
    // session-137 lockstep carry-forward: 2036 -> 2041 (the s137 +5 —
    // the settings picklist-editor family fresh-eyes walk: the PIN-ONLY
    // session [D-137a0 the freeze pins +5 its, settings-family-parity
    // .test.ts — the 5 panel titles + the 3 tab labels + the 5 add-input
    // placeholders + the Defaults 6-label ordered set + the picklist
    // interactive chrome; ZERO src changes]); the four sites re-anchored
    // again, the retired 2036 form joins the negatives below.
    // session-138 lockstep carry-forward: 2041 -> 2051 (the s138 +10 —
    // the reports chart-interiors family fresh-eyes walk: the GRID-FIX
    // session [D-138a0 the L-138c1 grid tick-delivery fix in charts.tsx
    // + D-138a1 the pins +10 its, reports-family-parity.test.ts — the 5
    // stash-proven grid-fix source pins + the KPI 5-label ordered set +
    // the Lost-Deals no-spark split + the 5 tab labels + the four
    // labelFor contracts]); the four sites re-anchored again, the
    // retired 2041 form joins the negatives below.
    // session-139 lockstep carry-forward: 2051 -> 2053 (the s139 +2 —
    // the dashboard chart-interiors post-fix re-walk: the TWO-FIX
    // session [D-139a0 the F-139c1 target-rounding retirement in
    // api/dashboard/route.ts + D-139a1 the F-139c2 area-spark
    // stroke-width retirement in page-parts.tsx + D-139a2 the pins +2
    // its in dashboard-family-parity.test.ts — the target-formula pin +
    // the spark-area-arm pin, stash-proven exactly 2 RED alone]; the
    // four sites re-anchored again, the retired 2051 form joins the
    // negatives below.

    // session-140 lockstep carry-forward: 2053 -> 2057 (the s140 +4 — the
    // leads chart-interiors post-fix re-walk: the PIN-ONLY session [a
    // clean walk — walk31 PASS 1 245 axes ZERO diffs, the s38 grid fix's
    // consumer #3 verified byte-exact; D-140a0 the freeze pins +4 its —
    // +3 in leads-family-parity (the pipeline call-site tooltip
    // construction + the wonlost series construction + the funnel call
    // site) + +1 in charts-internals (the ConversionFunnel family stock
    // construction — the maiden funnel face), mutation-proven exactly
    // 2 RED alone per drift]; the four sites re-anchored again, the
    // retired 2053 form joins the negatives below.
    // session-144 lockstep carry-forward: 2104 -> 2108 (+4 — the
    // session-143 carry-forward: 2101 -> 2104 (+3 — the
    // landing family walk's remediation pins: the APP_FOOTER contract +
    // the AppShell mount + the FAQ container) AND the s142-missed pair
    // filled: CLAUDE's commands-table unit row + the test-pyramid line
    // still read 2060 (the s142 realignment updated only the gate-order/
    // e2e/seam sites — the 143-a docs-gap genus, here at the CLAUDE
    // carrier axis; both sites now 2104 with the 2060/2101 forms joining
    // the negatives below).
    // session-145 lockstep carry-forward: 2108 -> 2112 (the walk35
    // transition pins: the landing session-static + the logout target +
    // the post-login redirect + the /login+/signup pure-render).
    // session-146 lockstep carry-forward: 2112 -> 2115 (the baselines
    // re-derivation's +3 pins in sweep-tool.test.ts — the re-anchored
    // baseline values + the byte-stable confirmations + the
    // mechanism-comment source pins).
    expect(claude).not.toContain("Unit (Vitest, 2108 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2112 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2167 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2173 checks)");
    // session-152 lockstep carry-forward: 2177 -> 2199 (the walk42
    // standing sixth gate — the interior-census-tool suite +22).
    // session-153 lockstep carry-forward: 2199 -> 2207 (the walk43
    // desktop leg — the census suite +8 in place).
    // session-154 lockstep carry-forward: 2207 -> 2217 (the walk44
    // tablet/landscape legs — the census suite +10 in place).
    // session-155 lockstep carry-forward: 2217 -> 2225 (the walk45
    // landing public leg — the census suite +8 in place).
    // session-156 lockstep carry-forward: 2225 -> 2229 (the walk46
    // about/contact interior legs — the census suite +4 in place).
    // session-157 lockstep carry-forward: 2229 -> 2233 (the walk47
    // login-wall leg + the fullpage entry guard — the census suite +3
    // in place, the fullpage suite +1).
    // session-158 lockstep carry-forward: 2233 -> 2241 (the parallel-axes
    // option + the quiescence read — the census suite +8 in place).
    // session-159 lockstep carry-forward: 2241 -> 2252 (the settings
    // intraday-rhythm map — the NEW settings-rhythm-tool suite +11).
    // session-160 lockstep carry-forward: 2252 -> 2257 (the census LOGIN
    // CONSOLIDATION — the interior-census-tool suite +5 in place).
    // session-161 lockstep carry-forward: 2257 -> 2262 (the rhythm LOGIN
    // CONSOLIDATION — the settings-rhythm-tool suite +5 in place).
    // session-162 lockstep carry-forward: 2262 -> 2271 (the sweep LOGIN
    // CONSOLIDATION — the sweep-tool suite +9 in place: the cross-process
    // storageState file + the seed's ID-STABILITY contract).
    // session-166 lockstep carry-forward: 2382 -> 2450 (the CRUD-family
    // Zod seam: the schemas-crud + crud-zod-seam batteries + the
    // body-pregate consolidation — the same lockstep the family
    // performs every count change).
    // session-165 lockstep carry-forward: 2362 -> 2382 (the bounded-
    // reader port: the readBoundedJson seam + the CSRF gate + the stream
    // counter + the e2e-census doctrine + the docs-truth carriers —
    // the same lockstep the family performs every count change)
    // session-164 lockstep carry-forward: 2347 -> 2362 (the test-isolation
    // cure + the reset-token hash + the amortized sweep — the auth +
    // password-seam + auth-reset + rate-limit suites +15 in place).
    expect(claude).not.toContain("Unit (Vitest, 2454 checks)");
    // session-167 lockstep carry-forward: 2454 -> 2480 (the stale-site
    // closure + the schema live-census — the schemas-census battery
    // +21 [the 128th suite] + the docs-counts carrier pins +5).
    expect(claude).not.toContain("Unit (Vitest, 2382 checks)");
    // session-168 lockstep carry-forward: 2480 -> 2520 (the
    // agents-doctrine closure + the inventory live-census — the
    // inventory-census battery +40 [the 129th suite]).
    expect(claude).not.toContain("Unit (Vitest, 2480 checks)");
    // session-169 lockstep carry-forward: 2520 -> 2559 (the
    // claude-doctrine closure + the stack-facts live-census + the
    // production secret gate — the facts-census battery +36 [the
    // 130th suite] + the auth secret-gate pins +3).
    expect(claude).not.toContain("Unit (Vitest, 2520 checks)");
    expect(claude).not.toContain("(currently 2454)");
    expect(claude).not.toContain("(currently 2480)");
    expect(claude).not.toContain("(currently 2520)");
    expect(claude).not.toContain("Unit (Vitest, 2362 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2347 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2271 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2177 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2199 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2207 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2217 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2225 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2229 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2233 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2241 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2252 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2257 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2697 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2712 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2717 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2726 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2733 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2735 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2740 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2744 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2749 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2750 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2754 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2757 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2760 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2763 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2766 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2769 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2772 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2773 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2777 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2778 checks)"); // session-189: the retired form joins the negatives ladder (the walk62 +3)
    expect(claude).not.toContain("Unit (Vitest, 2781 checks)"); // session-190: the retired form joins the negatives ladder (the walk63 +5)
    expect(claude).not.toContain("Unit (Vitest, 2786 checks)"); // session-191: the retired form joins the negatives ladder (the walk64 +9)
    expect(claude).not.toContain("Unit (Vitest, 2811 checks)"); // session-197: the retired form joins the negatives
    expect(claude).not.toContain("Unit (Vitest, 2813 checks)"); // session-198: the retired form joins the negatives
    expect(claude).not.toContain("Unit (Vitest, 2813 checks)"); // session-198: the retired form joins the negatives ladder (the D-197a1 sweep-tool +2)
    expect(claude).toContain("Unit (Vitest, 2817 checks)");
    // session-145 lockstep carry-forward: the coverage line 2108 ->
    // 2112 (the walk35 transition pins); s146: 2112 -> 2115.
    expect(claude).not.toContain("(currently 2108)");
    expect(claude).not.toContain("(currently 2112)");
    expect(claude).not.toContain("(currently 2167)");
    expect(claude).not.toContain("(currently 2173)");
    expect(claude).not.toContain("(currently 2177)");
    expect(claude).not.toContain("(currently 2199)");
    expect(claude).not.toContain("(currently 2207)");
    expect(claude).not.toContain("(currently 2217)");
    expect(claude).not.toContain("(currently 2225)");
    expect(claude).not.toContain("(currently 2229)");
    expect(claude).not.toContain("(currently 2233)");
    expect(claude).not.toContain("(currently 2241)");
    expect(claude).not.toContain("(currently 2252)");
    expect(claude).not.toContain("(currently 2257)");
    expect(claude).not.toContain("(currently 2271)");
    expect(claude).not.toContain("(currently 2382)");
    expect(claude).not.toContain("(currently 2347)");
    expect(claude).not.toContain("(currently 2697)");
    expect(claude).not.toContain("(currently 2712)");
    expect(claude).not.toContain("(currently 2717)");
    expect(claude).not.toContain("(currently 2726)");
    expect(claude).not.toContain("(currently 2733)");
    expect(claude).not.toContain("(currently 2735)");
    expect(claude).not.toContain("(currently 2740)");
    expect(claude).not.toContain("(currently 2744)");
    expect(claude).not.toContain("(currently 2749)");
    expect(claude).not.toContain("(currently 2750)");
    expect(claude).not.toContain("(currently 2754)");
    expect(claude).not.toContain("(currently 2757)");
    expect(claude).not.toContain("(currently 2760)");
    expect(claude).not.toContain("(currently 2763)");
    expect(claude).not.toContain("(currently 2766)");
    expect(claude).not.toContain("(currently 2769)");
    expect(claude).not.toContain("(currently 2772)");
    expect(claude).not.toContain("(currently 2773)");
    expect(claude).not.toContain("(currently 2777)");
    expect(claude).not.toContain("(currently 2778)"); // session-189: the retired form joins the negatives ladder
    expect(claude).not.toContain("(currently 2811)"); // session-197: the retired form joins the negatives ladder
    expect(claude).not.toContain("(currently 2813)"); // session-198: the retired form joins the negatives ladder
    expect(claude).not.toContain("(currently 2813)"); // session-198: the retired form joins the negatives ladder (the D-197a1 sweep-tool +2)
    expect(claude).toContain("(currently 2817)");
    expect(claude).not.toContain("Vitest unit suites (2108 checks)");
    expect(claude).not.toContain("Vitest unit suites (2112 checks)");
    expect(claude).not.toContain("Vitest unit suites (2167 checks)");
    expect(claude).not.toContain("Vitest unit suites (2173 checks)");
    expect(claude).not.toContain("Vitest unit suites (2177 checks)");
    expect(claude).not.toContain("Vitest unit suites (2199 checks)");
    expect(claude).not.toContain("Vitest unit suites (2207 checks)");
    expect(claude).not.toContain("Vitest unit suites (2217 checks)");
    expect(claude).not.toContain("Vitest unit suites (2225 checks)");
    expect(claude).not.toContain("Vitest unit suites (2229 checks)");
    expect(claude).not.toContain("Vitest unit suites (2233 checks)");
    expect(claude).not.toContain("Vitest unit suites (2241 checks)");
    expect(claude).not.toContain("Vitest unit suites (2252 checks)");
    expect(claude).not.toContain("Vitest unit suites (2257 checks)");
    expect(claude).not.toContain("Vitest unit suites (2271 checks)");
    expect(claude).not.toContain("Vitest unit suites (2382 checks)");
    expect(claude).not.toContain("Vitest unit suites (2454 checks)");
    expect(claude).not.toContain("Vitest unit suites (2480 checks)");
    expect(claude).not.toContain("Vitest unit suites (2520 checks)");
    expect(claude).not.toContain("Vitest unit suites (2347 checks)");
    expect(claude).not.toContain("Vitest unit suites (2697 checks)");
    expect(claude).not.toContain("Vitest unit suites (2712 checks)");
    expect(claude).not.toContain("Vitest unit suites (2717 checks)");
    expect(claude).not.toContain("Vitest unit suites (2726 checks)");
    expect(claude).not.toContain("Vitest unit suites (2733 checks)");
    expect(claude).not.toContain("Vitest unit suites (2735 checks)");
    expect(claude).not.toContain("Vitest unit suites (2740 checks)");
    expect(claude).not.toContain("Vitest unit suites (2744 checks)");
    expect(claude).not.toContain("Vitest unit suites (2749 checks)");
    expect(claude).not.toContain("Vitest unit suites (2750 checks)");
    expect(claude).not.toContain("Vitest unit suites (2754 checks)");
    expect(claude).not.toContain("Vitest unit suites (2757 checks)");
    expect(claude).not.toContain("Vitest unit suites (2760 checks)");
    expect(claude).not.toContain("Vitest unit suites (2763 checks)");
    expect(claude).not.toContain("Vitest unit suites (2766 checks)");
    expect(claude).not.toContain("Vitest unit suites (2769 checks)");
    expect(claude).not.toContain("Vitest unit suites (2772 checks)");
    expect(claude).not.toContain("Vitest unit suites (2773 checks)");
    expect(claude).not.toContain("Vitest unit suites (2777 checks)");
    expect(claude).not.toContain("Vitest unit suites (2778 checks)"); // session-189: the retired form joins the negatives ladder
    expect(claude).not.toContain("Vitest unit suites (2811 checks)"); // session-197: the retired form joins the neg
    expect(claude).not.toContain("Vitest unit suites (2813 checks)"); // session-198: the retired form joins the neg
    expect(claude).not.toContain("Vitest unit suites (2813 checks)"); // session-198: the retired form joins the negatives ladder (the D-197a1 sweep-tool +2)
    expect(claude).toContain("Vitest unit suites (2817 checks)");
    expect(claude).not.toContain("`bun run test` (2108)");
    expect(claude).not.toContain("`bun run test` (2112)");
    expect(claude).not.toContain("`bun run test` (2115)");
    expect(claude).not.toContain("`bun run test` (2167)");
    // session-151 lockstep carry-forward: 2173 -> 2177 (the walk41
    // F-151c1 remediation — the dashboard-interior-parity suite +4).
    expect(claude).not.toContain("`bun run test` (2173)");
    expect(claude).not.toContain("`bun run test` (2177)");
    expect(claude).not.toContain("`bun run test` (2199)");
    expect(claude).not.toContain("`bun run test` (2207)");
    expect(claude).not.toContain("`bun run test` (2217)");
    expect(claude).not.toContain("`bun run test` (2225)");
    expect(claude).not.toContain("`bun run test` (2229)");
    expect(claude).not.toContain("`bun run test` (2233)");
    expect(claude).not.toContain("`bun run test` (2241)");
    expect(claude).not.toContain("`bun run test` (2252)");
    expect(claude).not.toContain("`bun run test` (2257)");
    expect(claude).not.toContain("`bun run test` (2271)");
    expect(claude).not.toContain("`bun run test` (2382)");
    expect(claude).not.toContain("`bun run test` (2454)");
    expect(claude).not.toContain("`bun run test` (2480)");
    expect(claude).not.toContain("`bun run test` (2520)");
    expect(claude).not.toContain("`bun run test` (2347)");
    expect(claude).not.toContain("`bun run test` (2559)");
    expect(claude).not.toContain("`bun run test` (2644)");
    expect(claude).not.toContain("`bun run test` (2697)");
    expect(claude).not.toContain("`bun run test` (2712)");
    expect(claude).not.toContain("`bun run test` (2717)");
    expect(claude).not.toContain("`bun run test` (2726)");
    expect(claude).not.toContain("`bun run test` (2733)");
    expect(claude).not.toContain("`bun run test` (2735)");
    expect(claude).not.toContain("`bun run test` (2740)");
    expect(claude).not.toContain("`bun run test` (2744)");
    expect(claude).not.toContain("`bun run test` (2749)");
    expect(claude).not.toContain("`bun run test` (2750)");
    expect(claude).not.toContain("`bun run test` (2754)");
    expect(claude).not.toContain("`bun run test` (2757)");
    expect(claude).not.toContain("`bun run test` (2760)");
    expect(claude).not.toContain("`bun run test` (2763)");
    expect(claude).not.toContain("`bun run test` (2766)");
    expect(claude).not.toContain("`bun run test` (2769)");
    expect(claude).not.toContain("`bun run test` (2772)");
    expect(claude).not.toContain("`bun run test` (2773)");
    expect(claude).not.toContain("`bun run test` (2777)");
    expect(claude).not.toContain("`bun run test` (2778)"); // session-189: the retired form joins the negatives ladder
    expect(claude).not.toContain("`bun run test` (2811)"); // session-197: the retired form joins the negatives ladd
    expect(claude).not.toContain("`bun run test` (2813)"); // session-198: the retired form joins the negatives ladd
    expect(claude).not.toContain("`bun run test` (2813)"); // session-198: the retired form joins the negatives ladder (the D-197a1 sweep-tool +2)
    expect(claude).toContain("`bun run test` (2817)");
    expect(claude).not.toContain("Unit (Vitest, 2060 checks)");
    expect(claude).not.toContain("Vitest unit suites (2060 checks)");
    expect(claude).not.toContain("(currently 2101)");
    expect(claude).not.toContain("`bun run test` (2101)");
    expect(claude).not.toContain("Unit (Vitest, 2053 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2051 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2041 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2036 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2032 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2026 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2023 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2021 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2018 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2009 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2008 checks)");
    expect(claude).not.toContain("Unit (Vitest, 2005 checks)")
    expect(claude).not.toContain("Unit (Vitest, 2004 checks)");
    expect(claude).not.toContain("(currently 2032)")
    expect(claude).not.toContain("(currently 2026)")
    expect(claude).not.toContain("(currently 2023)")
    expect(claude).not.toContain("(currently 2021)")
    expect(claude).not.toContain("(currently 2009)")
    expect(claude).not.toContain("(currently 2008)")
    expect(claude).not.toContain("(currently 2005)")
    expect(claude).not.toContain("(currently 2004)");
    expect(claude).not.toContain("Vitest unit suites (2026 checks)")
    expect(claude).not.toContain("Vitest unit suites (2023 checks)")
    expect(claude).not.toContain("Vitest unit suites (2021 checks)")
    expect(claude).not.toContain("Vitest unit suites (2009 checks)")
    expect(claude).not.toContain("Vitest unit suites (2005 checks)")
    expect(claude).not.toContain("Vitest unit suites (2004 checks)");
    expect(claude).not.toContain("`bun run test` (2026)")
    expect(claude).not.toContain("`bun run test` (2023)")
    expect(claude).not.toContain("`bun run test` (2021)")
    expect(claude).not.toContain("`bun run test` (2009)")
    expect(claude).not.toContain("`bun run test` (2005)")
    expect(claude).not.toContain("`bun run test` (2004)");
    expect(claude).not.toContain("Unit (Vitest, 2000 checks)");
    expect(claude).not.toContain("(currently 2000)");
    expect(claude).not.toContain("Vitest unit suites (2000 checks)");
    expect(claude).not.toContain("`bun run test` (2000)");
    expect(claude).not.toContain("Vitest unit suites (1980 checks)");
    expect(claude).not.toContain("`bun run test` (1980)");
    expect(claude).not.toContain("Unit (Vitest, 1964 checks)");
    expect(claude).not.toContain("Unit (Vitest, 1957 checks)");
    expect(claude).not.toContain("Unit (Vitest, 1956 checks)");
    expect(claude).not.toContain("(currently 1964)");
    expect(claude).not.toContain("(currently 1957)");
    expect(claude).not.toContain("(currently 1956)");
    expect(claude).not.toContain("Vitest unit suites (1964 checks)");
    expect(claude).not.toContain("Vitest unit suites (1957 checks)");
    expect(claude).not.toContain("Vitest unit suites (1956 checks)");
    expect(claude).not.toContain("`bun run test` (1964)");
    expect(claude).not.toContain("`bun run test` (1957)");
    expect(claude).not.toContain("`bun run test` (1956)");
    expect(claude).not.toContain("Unit (Vitest, 1953 checks)");
    expect(claude).not.toContain("(currently 1953)");
    expect(claude).not.toContain("Vitest unit suites (1953 checks)");
    expect(claude).not.toContain("`bun run test` (1953)");
    expect(claude).not.toContain("Unit (Vitest, 1952 checks)");
    expect(claude).not.toContain("(currently 1952)");
    expect(claude).not.toContain("Vitest unit suites (1952 checks)");
    expect(claude).not.toContain("`bun run test` (1952)");
    expect(claude).not.toContain("Unit (Vitest, 1951 checks)");
    expect(claude).not.toContain("(currently 1951)");
    expect(claude).not.toContain("Vitest unit suites (1951 checks)");
    expect(claude).not.toContain("`bun run test` (1951)");
    expect(claude).not.toContain("Unit (Vitest, 1950 checks)");
    expect(claude).not.toContain("(currently 1950)");
    expect(claude).not.toContain("Vitest unit suites (1950 checks)");
    expect(claude).not.toContain("`bun run test` (1950)");
    expect(claude).not.toContain("Unit (Vitest, 1948 checks)");
    expect(claude).not.toContain("(currently 1948)");
    expect(claude).not.toContain("Vitest unit suites (1948 checks)");
    expect(claude).not.toContain("`bun run test` (1948)");
    expect(claude).not.toContain("Unit (Vitest, 1946 checks)");
    expect(claude).not.toContain("(currently 1946)");
    expect(claude).not.toContain("Vitest unit suites (1946 checks)");
    expect(claude).not.toContain("`bun run test` (1946)");
    expect(claude).not.toContain("Unit (Vitest, 1944 checks)");
    expect(claude).not.toContain("(currently 1944)");
    expect(claude).not.toContain("Vitest unit suites (1944 checks)");
    expect(claude).not.toContain("`bun run test` (1944)");
    expect(claude).not.toContain("Unit (Vitest, 1942 checks)");
    expect(claude).not.toContain("(currently 1942)");
    expect(claude).not.toContain("Vitest unit suites (1942 checks)");
    expect(claude).not.toContain("`bun run test` (1942)");
    expect(claude).not.toContain("Unit (Vitest, 1938 checks)");
    expect(claude).not.toContain("(currently 1938)");
    expect(claude).not.toContain("Vitest unit suites (1938 checks)");
    expect(claude).not.toContain("`bun run test` (1938)");
    expect(claude).not.toContain("Unit (Vitest, 1934 checks)");
    expect(claude).not.toContain("(currently 1934)");
    expect(claude).not.toContain("Vitest unit suites (1934 checks)");
    expect(claude).not.toContain("`bun run test` (1934)");
    expect(claude).not.toMatch(/1788 checks/);
    expect(claude).not.toMatch(/currently 1788/);
    expect(claude).not.toMatch(/1828 checks/);
    expect(claude).not.toMatch(/1829 checks/);
    expect(claude).not.toMatch(/1832 checks/);
    expect(claude).not.toMatch(/currently 1832/);
    expect(claude).not.toMatch(/1836 checks/);
    expect(claude).not.toMatch(/1849 checks/);
    expect(claude).not.toMatch(/currently 1849/);
    expect(claude).not.toMatch(/currently 1836/);
    expect(claude).not.toMatch(/1862 checks/);
    expect(claude).not.toMatch(/currently 1862/);
    expect(claude).not.toMatch(/1870 checks/);
    expect(claude).not.toMatch(/currently 1870/);
    expect(claude).not.toMatch(/1872 checks/);
    expect(claude).not.toMatch(/currently 1872/);
    expect(claude).not.toMatch(/1880 checks/);
    expect(claude).not.toMatch(/currently 1880/);
    expect(claude).not.toMatch(/1892 checks/);
    expect(claude).not.toMatch(/currently 1892/);
    expect(claude).not.toMatch(/1903 checks/);
    expect(claude).not.toMatch(/currently 1903/);
    expect(claude).not.toMatch(/1915 checks/);
    expect(claude).not.toMatch(/currently 1915/);
    // session-107: the retired 1922 forms join the ladder (CLAUDE keeps
    // no session-history blocks — after the realignment no 1922
    // construction may remain anywhere in the file)
    expect(claude).not.toMatch(/1922 checks/);
    expect(claude).not.toMatch(/currently 1922/);
    expect(claude).not.toMatch(/`bun run test` \(1922\)/);
  });
});

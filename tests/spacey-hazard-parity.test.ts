import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-91 pins: the v4 space-y hazard family (the 91-c rotation —
// the FULL-APP SCREENSHOT DIFF against the reference, both apps driven
// to the ZERO-DATA state, 9 pages at 1440x900, the pairwise pixel diff
// + the DOM probes decoding every divergence).
//
// THE ROOT CAUSE (one family, four surfaces): v3 compiles `space-y-N`
// as margin-TOP on FOLLOWING siblings through
// `.space-y-N > :not([hidden]) ~ :not([hidden])` at specificity
// (0,3,0) — with a `margin-bottom: calc(N * --tw-space-y-reverse)`
// sidecar; v4 compiles it as margin-BOTTOM on NON-LAST children inside
// `:where(& > :not(:last-child))` — ZERO specificity. The two compute
// IDENTICAL gaps for plain block stacks and diverge exactly when
// (a) a non-last child is INLINE (vertical margins do not apply to
//     inline boxes — every shadcn <Label> is display:inline), or
// (b) a non-first child carries its own mb-* class (v3's (0,3,0) rule
//     kills it; v4's :where preserves it).
//
// The four surfaces (the N-91 family, LIVE-measured on BOTH apps +
// bundle-decoded):
// - M-91c1 THE PROFILE FORM: the reference's four space-y-2 groups
//   compute 12px label->control gaps (v3 input margin-top 8px + the
//   4px inline-label strut); ours collapsed to 4px (the v4 label
//   margin-bottom IGNORED on the inline label) — the whole form 32px
//   shorter (472 vs 504px). The s14/s15 sessions fixed this genus on
//   the dialogs + the settings defaults (the controlMt precedent —
//   three tokens: SETTINGS_DEFAULTS / SETTINGS_DANGER / DIALOG_GROUP);
//   the profile arm was never walked.
// - M-91c2 THE LEADS TOOLBAR: the reference's filters row carries
//   `mb-4` but it computes 0px — v3's space-y-4 rule at (0,3,0) forces
//   margin-bottom: calc(1rem × 0), killing the (0,1,0) .mb-4. Ours
//   kept it alive (v4's :where never touches the last child) -> 16px
//   extra -> the toolbar 137 vs 121px, the table 16px lower, the card
//   262 vs 246px. The s11 rule: re-derive from the reference's
//   COMPUTED gap, never copy the class string.
// - L-91c3 THE EDIT DIALOGS: the reference's wce/Mke/Edit-Lead field
//   groups are BARE unclassed divs (label + control direct children,
//   the 4px strut gap — the DIALOG_BARE_GROUP form the s15 decode
//   documented for the Event/Activity dialogs, never re-derived for
//   the EDIT family); ours shipped space-y-2 groups computing 4px ONLY
//   through the v4 accident.
// - L-91c4 THE IMPORT DIALOG: the reference's `space-y-2` Select File
//   group computes a 12px label->dropzone gap; ours 4px.
//
// The foundations verified CLEAN (the genus sweep, all 99 space-y
// usages): the create dialogs + the settings defaults/danger carry the
// controlMt fix; the calendar-rail + save-report section labels are
// `block` (margins apply); the checkbox stacks are block rows; the
// other table toolbars carry no space-y.

const root = path.resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");
const profileSrc = () => read("src/app/(app)/profile/profile-page.tsx");
const leadsSrc = () => read("src/app/(app)/leads/leads-page.tsx");
const editDialogSrc = () => read("src/components/shared/entity-edit-dialog.tsx");
const contactsSrc = () => read("src/app/(app)/contacts/contacts-page.tsx");
const layoutSrc = () => read("src/lib/page-layout.ts");

/** Strip block comments (the assertions scan the CODE, not the prose —
 * the s88/s90 needle-in-own-docs lesson: retirement comments legitimately
 * name the retired tokens). */
function noComments(s: string): string {
  return s.replace(/\{\/[\s\S]*?\*\//g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/[^\n]*$/gm, "$1");
}

/** The profile form region: from the space-y-6 wrapper to the </form>. */
function profileForm(): string {
  const src = profileSrc();
  const start = src.indexOf('className="space-y-6"');
  const end = src.indexOf("</form>", start);
  return src.slice(start, end);
}

/** The leads toolbar region: from the TABLE_CARD.toolbar div to the
 * table wrapper. */
function leadsToolbar(): string {
  const src = leadsSrc();
  const start = src.indexOf('cn(TABLE_CARD.toolbar, "space-y-4")');
  const end = src.indexOf("overflow-x-auto", start);
  return src.slice(start, end);
}

/** The edit-dialog field loop: the fields.map body. */
function editDialogFields(): string {
  const src = editDialogSrc();
  const start = src.indexOf("fields.map((row, ri)");
  const end = src.indexOf("DIALOG_FOOTER_WIDE", start);
  return src.slice(start, end);
}

/** The import-dialog Select File group: from the fragment to the
 * Required columns box. */
function importSelectFile(): string {
  const src = contactsSrc();
  const start = src.indexOf('"Select File"');
  const end = src.indexOf("Required columns", start);
  return src.slice(Math.max(0, start - 400), end > start ? end : start + 1600);
}

describe("session-91 (M-91c1): the profile form's controlMt x4", () => {
  it("PROFILE_LAYOUT gains the controlMt token (the fourth of the family, after SETTINGS_DEFAULTS/SETTINGS_DANGER/DIALOG_GROUP)", async () => {
    const L = (await import("@/lib/page-layout")).PROFILE_LAYOUT;
    expect(L.controlMt).toBe("mt-2");
  });

  it("the avatar-row wrapper carries the controlMt (the Profile Picture group's gap 4 -> 12px)", () => {
    const form = profileForm();
    expect(form).toContain('cn("flex flex-col items-center gap-4 sm:flex-row", PROFILE_LAYOUT.controlMt)');
  });

  it("the Full Name / Email / Role inputs carry the controlMt", () => {
    const form = profileForm();
    const controls = form.match(/<Input[\s\S]*?\/>/g) ?? [];
    // exactly three Inputs inside the form (name, email, role)
    expect(controls.length).toBe(3);
    for (const c of controls) {
      expect(c).toContain("PROFILE_LAYOUT.controlMt");
    }
  });

  it("no form group ships a bare control (the v4 inline-label collapse guard)", () => {
    const form = profileForm();
    // every <Input inside the form must carry the controlMt — a space-y-2
    // group whose Input lacks it computes the collapsed 4px gap
    const bare = form.match(/<Input(?![^/]*controlMt)[\s\S]*?\/>/g) ?? [];
    expect(bare).toHaveLength(0);
  });
});

describe("session-91 (M-91c2): the leads filters row's dead mb-4", () => {
  it("the filters row drops the mb-4 (dead on the reference — the v3 space-y-4 rule kills it at (0,3,0))", () => {
    const toolbar = leadsToolbar();
    expect(toolbar).toContain("flex flex-col gap-2 sm:flex-row sm:gap-4");
    // the row WITHOUT the trailing mb-4 — the computed-geometry mirror
    expect(toolbar).not.toMatch(/sm:gap-4 mb-4/);
  });

  it("the retirement is documented (the v3 specificity kill, the s11 computed-gap rule)", () => {
    const src = leadsSrc();
    const i = src.indexOf("flex flex-col gap-2 sm:flex-row sm:gap-4");
    const comment = src.slice(Math.max(0, i - 1200), i);
    expect(comment).toMatch(/M-91c2/);
  });
});

describe("session-91 (L-91c3): the edit dialogs' BARE field groups", () => {
  it("the field groups are bare unclassed divs (the reference's wce/Mke construction — never space-y-2)", () => {
    const fields = noComments(editDialogFields());
    expect(fields).toContain('<div key={f.key}>');
    expect(fields).not.toContain('space-y-2');
  });

  it("the form keeps its space-y-4 + the row grids (computed-equal, untouched)", () => {
    const src = editDialogSrc();
    expect(src).toContain('className="space-y-4"');
    expect(src).toContain('"grid grid-cols-2 gap-4"');
  });
});

describe("session-91 (L-91c4): the import dialog's Select File group", () => {
  it("the dropzone wrapper carries mt-2 (the gap 4 -> 12px, the controlMt precedent)", () => {
    const group = importSelectFile();
    expect(group).toContain('className="flex flex-col gap-3 mt-2"');
  });

  it("the group keeps the reference's space-y-2 wrapper (the class string mirrors; the mt-2 restores the v3 computed gap)", () => {
    const src = contactsSrc();
    const i = src.indexOf('"Select File"');
    expect(src.slice(Math.max(0, i - 300), i)).toContain("space-y-2");
  });
});

describe("session-91 (N-91c5): the genus census — the known-clean surfaces stand", () => {
  it("the three controlMt precedents stand (the s14/s15 fixes this session extends)", () => {
    const src = layoutSrc();
    expect(src.match(/controlMt: "mt-2"/g)?.length).toBeGreaterThanOrEqual(4);
  });

  it("the create dialogs apply DIALOG_GROUP.controlMt to their controls", () => {
    const src = read("src/components/shared/entity-dialogs.tsx");
    expect(src).toContain("DIALOG_GROUP.controlMt");
  });

  it("the section labels that ship mb-* are block display (margins apply — never the inline-label collapse)", () => {
    const src = layoutSrc();
    // the calendar/contacts rails + the save-report sections
    expect(src).toMatch(/groupLabel: "text-sm font-semibold mb-3 block"/);
  });
});

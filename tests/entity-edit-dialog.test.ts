import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-28 pins (S28-P2): the reference's EDIT-DIALOG family — W7
// (contact), wce (account), Mke (lead), all bundle-extracted. The
// reference does NOT reuse its create dialogs for editing: every edit
// dialog is a SEPARATE max-w-2xl form with grid-cols-2 rows, a Status /
// Source select pair, and the "Save Changes" / "Saving..." footer. All
// three support a readOnly mode that flips the title to "... Details",
// disables the inputs, and swaps the footer to a single Close button
// (the shared anatomy of the family).
//
// The one-off quirks pinned here:
// - The CONTACT edit source select is PLAIN (no emojis — the emojis live
//   only in the CREATE dialog's "How did you meet?" select).
// - The ACCOUNT edit carries the full field set: Website (url,
//   placeholder "https://example.com"), Annual Revenue (number,
//   "100000") / Employees (number, "50"), Status with THREE options
//   (active/inactive/prospect).
// - The LEAD edit's Status vocabulary is New/Contacted/Qualified/
//   Unqualified (NOT the table's 5-status set — the reference's own
//   inconsistency) and its Source has FOUR options (no Referral).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const dialog = () => stripComments(read("src/components/shared/entity-edit-dialog.tsx") ?? "");
const contacts = () => stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
const accounts = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const leads = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");

describe("session-28: the shared EntityEditDialog anatomy", () => {
  it("the max-w-2xl max-h-[90vh] scrollable shell + the space-y-4 form", () => {
    const src = dialog();
    // Session-68 (N-68d): the edit family CONSUMES the shared constant
    // (DIALOG_CONTENT.wide) instead of a hand-inlined byte-copy — a
    // future constant re-pin can no longer silently diverge the
    // create/edit dialog families.
    expect(src).toMatch(/DialogContent className=\{DIALOG_CONTENT\.wide\}/);
    expect(src).toMatch(/space-y-4/);
    expect(src).toMatch(/grid grid-cols-2 gap-4/);
  });

  it("the footer: the shared DIALOG_FOOTER_WIDE with Cancel + Save Changes / Saving...", () => {
    const src = dialog();
    // Session-68 (N-68d): same wiring — the footer consumes the shared
    // DIALOG_FOOTER_WIDE constant, not an inline copy.
    expect(src).toMatch(/className=\{DIALOG_FOOTER_WIDE\}/);
    expect(src).toContain("Save Changes");
    expect(src).toContain("Saving...");
    expect(src).toContain("Cancel");
  });

  it("readOnly mode: the disabled inputs + the single Close footer", () => {
    const src = dialog();
    // Session-66 (N-66h): the alternatives collapsed — `disabled={a}` and
    // the bare `readOnly ? "Close"` branch matched nothing at HEAD (the
    // honest forms subsume them).
    expect(src).toMatch(/disabled=\{readOnly\}/);
    expect(src).toMatch(/readOnly \? "Close" : "Cancel"/);
  });
});

describe("session-28: the CONTACT edit config (W7)", () => {
  it("fields: Name*/Email, Phone(tel)/Company, Position full-width, Status/Source", () => {
    const src = dialog();
    const i = src.indexOf("CONTACT_EDIT_FIELDS");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 1600);
    expect(block).toContain('"Name *"');
    expect(block).toContain('"Email *"');
    expect(block).toContain('"Phone"');
    expect(block).toMatch(/type: "tel"/);
    expect(block).toContain('"Company"');
    expect(block).toContain('"Position"');
    expect(block).toContain('"Status"');
    expect(block).toContain('"Source"');
  });

  it("the edit source select is PLAIN — value/label pairs, no emojis", () => {
    const src = dialog();
    const i = src.indexOf("SOURCE_PAIRS");
    expect(i).toBeGreaterThan(-1);
    // Skip the EditSelectOption[] type annotation (its `]` would truncate
    // the slice) — anchor from the array literal's `= [`.
    const start = src.indexOf("= [", i);
    const block = src.slice(start, src.indexOf("]", start));
    expect(block).toMatch(/value: "call", label: "Call"/);
    expect(block).toMatch(/value: "email", label: "Email"/);
    expect(block).toMatch(/value: "website", label: "Website"/);
    expect(block).toMatch(/value: "partner", label: "Partner"/);
    expect(block).toMatch(/value: "referral", label: "Referral"/);
    expect(block).not.toContain("📞");
    expect(block).not.toContain("✉️");
  });

  it("the contacts page wires the edit dialog (not the create dialog) for Edit", () => {
    const src = contacts();
    expect(src).toMatch(/EntityEditDialog|ContactEditDialog/);
    expect(src).toMatch(/"Edit Contact"/);
  });
});

describe("session-28: the ACCOUNT edit config (wce)", () => {
  it("fields: Account Name+Industry, Phone(tel)/Email(email), Website url, Annual Revenue/Employees numbers, Status", () => {
    const src = dialog();
    const i = src.indexOf("ACCOUNT_EDIT_FIELDS");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 2000);
    expect(block).toContain('"Account Name *"');
    expect(block).toContain('"Industry"');
    expect(block).toMatch(/"Phone"[\s\S]{0,200}type: "tel"/);
    expect(block).toMatch(/"Email"[\s\S]{0,200}type: "email"/);
    expect(block).toContain('"Website"');
    // NOTE: the stripComments helper eats from the `//` inside the
    // "https://example.com" STRING to end-of-line — anchor on the
    // strip-safe prefix only (the s27 comment-anchor lesson).
    expect(block).toMatch(/placeholder: "https:/);
    expect(block).toContain('"Annual Revenue"');
    expect(block).toMatch(/placeholder: "100000"/);
    expect(block).toContain('"Employees"');
    expect(block).toMatch(/placeholder: "50"/);
    expect(block).toContain('"Status"');
  });

  it("the accounts page wires the edit dialog for Edit", () => {
    const src = accounts();
    expect(src).toMatch(/EntityEditDialog|AccountEditDialog/);
    expect(src).toMatch(/"Edit Account"/);
  });
});

describe("session-28: the LEAD edit config (Mke)", () => {
  it("fields: Name*/Email, Phone(tel)/Company, Status/Source, Estimated Value number", () => {
    const src = dialog();
    const i = src.indexOf("LEAD_EDIT_FIELDS");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 1800);
    expect(block).toContain('"Name *"');
    expect(block).toContain('"Email"');
    expect(block).toMatch(/type: "tel"/);
    expect(block).toContain('"Company"');
    expect(block).toContain('"Status"');
    expect(block).toContain('"Source"');
    expect(block).toContain('"Estimated Value"');
    expect(block).toMatch(/placeholder: "50000"/);
  });

  it("the lead edit status vocabulary is the 4-option set (no Won/Lost)", () => {
    const src = dialog();
    const i = src.indexOf("LEAD_EDIT_FIELDS");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, src.indexOf("]", src.indexOf("Estimated Value", i)));
    expect(block).toMatch(/value: "new", label: "New"/);
    expect(block).toMatch(/value: "contacted", label: "Contacted"/);
    expect(block).toMatch(/value: "qualified", label: "Qualified"/);
    expect(block).toMatch(/value: "unqualified", label: "Unqualified"/);
    expect(block).not.toMatch(/value: "won"/);
    expect(block).not.toMatch(/value: "lost"/);
  });

  it("the lead edit source has FOUR options (no Referral)", () => {
    const src = dialog();
    const i = src.indexOf("LEAD_EDIT_FIELDS");
    const block = src.slice(i, src.indexOf("Estimated Value", i));
    expect(block).toMatch(/value: "call", label: "Call"/);
    expect(block).toMatch(/value: "email", label: "Email"/);
    expect(block).toMatch(/value: "website", label: "Website"/);
    expect(block).toMatch(/value: "partner", label: "Partner"/);
    expect(block).not.toMatch(/value: "referral"/);
  });

  it("the leads page wires the edit dialog for Edit", () => {
    const src = leads();
    expect(src).toMatch(/EntityEditDialog|LeadEditDialog/);
    expect(src).toMatch(/"Edit Lead"/);
  });
});

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-50 pins (S50-P1): the N-47d dead-edit-branch retirement —
// the third src-dead-removal of the house (the s48 CONTACT_SOURCES +
// s49 LEAD_SOURCES precedent class, this time a BRANCH family inside
// living components instead of a constant). The three create dialogs
// (ContactDialog/AccountDialog/LeadDialog in
// src/components/shared/entity-dialogs.tsx) carried full dual-mode
// machinery — the contact/account/lead entity props, the createMode
// locals, the !createMode edit branches (~170 lines), the update-verb
// submit ternaries, the "Edit X"/"Save Changes" title/footer ternaries
// — but every caller passed setEditing(null) ONLY: the branches were
// UNREACHABLE since the s28 EntityEditDialog family took over the edit
// surface. The reference itself NEVER reuses its create dialogs for
// editing (the s28 bundle extraction: W7/wce/Mke are separate
// max-w-2xl edit forms); our dead branches were a pre-s28 leftover
// whose only risk was a future session wiring setEditing(entity) and
// shipping a divergent-from-reference edit surface.
//
// EventDialog/ActivityDialog keep their dual-mode BY DESIGN — their
// edit modes are LIVE (the setEditing(a) row-menu Edit at
// activities-page:213 + the calendar's three setEditing(e) sites at
// :370/:442/:507 — s64 refresh);
// the pin at the bottom guards exactly that boundary.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const dialogs = () => stripComments(read("src/components/shared/entity-dialogs.tsx") ?? "");

// Slice a region between two anchors (the house idiom — the region is
// stable under unrelated edits elsewhere in the file).
function region(src: string, start: string, end: string): string {
  const i = src.indexOf(start);
  expect(i, `anchor not found: ${start}`).toBeGreaterThan(-1);
  const j = src.indexOf(end, i);
  expect(j, `end anchor not found after ${start}: ${end}`).toBeGreaterThan(-1);
  return src.slice(i, j);
}

describe("session-50: the create dialogs are single-mode (N-47d retired)", () => {
  it("the three Dialog wrappers carry NO entity prop", () => {
    const src = dialogs();
    const contact = region(src, "export function ContactDialog", "function ContactForm");
    const account = region(src, "export function AccountDialog", "function AccountForm");
    const lead = region(src, "export function LeadDialog", "function LeadForm");
    // The optional entity-prop shape (onSaved's callback params stay by
    // design — only the contact?/account?/lead? PROPS are the dead mode).
    expect(contact).not.toMatch(/contact\?:/);
    expect(account).not.toMatch(/account\?:/);
    expect(lead).not.toMatch(/lead\?:/);
  });

  it("the three Forms carry NO createMode machinery and NO edit branch", () => {
    const src = dialogs();
    // Code anchors only — the banner comments are stripped by the
    // helper (the s27 comment-anchor lesson).
    const contact = region(src, "function ContactForm", "export function LeadDialog");
    const account = region(src, "function AccountForm", "export function ContactDialog");
    const lead = region(src, "function LeadForm", "export function EventDialog");
    for (const [name, block] of [
      ["ContactForm", contact],
      ["AccountForm", account],
      ["LeadForm", lead],
    ] as const) {
      expect(block, `${name} createMode`).not.toContain("createMode");
      expect(block, `${name} !createMode`).not.toContain("!createMode");
    }
  });

  it("entity-dialogs.tsx references NO contact/account/lead update verb (create-only submits)", () => {
    const src = dialogs();
    expect(src).not.toContain("updateContact");
    expect(src).not.toContain("updateAccount");
    expect(src).not.toContain("updateLead");
  });

  it("the three pages declare NO dead editing state and mount the dialogs entity-prop-free", () => {
    const contacts = stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
    const accounts = stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
    const leads = stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
    expect(contacts).not.toMatch(/setEditing/);
    expect(contacts).not.toMatch(/<ContactDialog[^>]*contact=/);
    expect(accounts).not.toMatch(/setEditing/);
    expect(accounts).not.toMatch(/<AccountDialog[^>]*account=/);
    expect(leads).not.toMatch(/setEditing/);
    expect(leads).not.toMatch(/<LeadDialog[^>]*lead=/);
  });
});

describe("session-50: the create-mode surfaces intact (the regression guards)", () => {
  it("the three titles + toasts + the reference's create vocabularies survive the retirement", () => {
    const src = dialogs();
    // Plain JSX text (the ternary wrappers are gone with the dead mode).
    expect(src).toContain("Create New Contact");
    expect(src).toContain("Create New Account");
    expect(src).toContain("Create New Lead");
    // The toast STRINGS (green-through-RED: they ride the ternaries on
    // HEAD, the single branch after the fix).
    expect(src).toContain('"Contact created"');
    expect(src).toContain('"Account created"');
    expect(src).toContain('"Lead created"');
    // The create Status vocabularies (the reference's own 4-option sets).
    expect(src).toContain("CREATE_LEAD_STAGES");
    expect(src).toContain("CONTACT_SOURCE_OPTIONS");
    expect(src).toContain("LEAD_SOURCE_OPTIONS");
  });

  it("EventDialog/ActivityDialog keep their dual-mode (the LIVE edit surface untouched)", () => {
    const src = dialogs();
    const event = region(src, "export function EventDialog", "export function ActivityDialog");
    // The Activity family runs to EOF — slice from its declaration.
    const i = src.indexOf("export function ActivityDialog");
    expect(i).toBeGreaterThan(-1);
    const activityBlock = src.slice(i);
    expect(event).toMatch(/event\?:/);
    expect(activityBlock).toMatch(/activity\?:/);
    // Their forms keep the dual-verb label design. Session-76
    // (M-76c12): the EventForm's createMode VARIABLE retired when the
    // submit went blue in BOTH modes — the dual-verb design now lives
    // in the label ternaries (the s54 retired-surface precedent).
    const eventForm = region(src, "function EventForm", "export function ActivityDialog");
    expect(eventForm).toContain('event ? "Update Event" : "Create Event"');
    expect(activityBlock).toContain('activity ? "Save Changes" : "Log Activity"');
  });
});

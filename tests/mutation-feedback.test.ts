import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-46 pins (S46-P1): the mutation-failure feedback sweep — the
// F-46a audit. The store's call() is total and toasts NOTHING (the
// accounts-page comment "toast handled globally by store refresh" was
// false — grep-verified zero toast calls in crm-store.ts), while the
// codebase's own convention (entity-dialogs :167/:456/:742, profile,
// settings editors) toasts every failure. Ten page-level mutation sites
// discarded the failure silently: 3 EntityEditDialog submits (a failed
// PUT strands the dialog open with a dead-feeling Save), 5 inline
// deletes, 2 inline mutations (toggleComplete, updateRole). The raw
// census finds 11 mutation call sites in the five pages; the 11th —
// importContacts at contacts-page:262 — is already handled by the
// s39-P2 three-way banner. The fix: the entity-dialogs convention
// verbatim — toast.error(<title>, res.error) on the failed branch, the
// happy path untouched.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const accounts = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const contacts = () => stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
const leads = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
const activities = () => stripComments(read("src/app/(app)/activities/activities-page.tsx") ?? "");
const calendar = () => stripComments(read("src/app/(app)/calendar/calendar-page.tsx") ?? "");

/** Slice a bounded region at an anchor (a failed anchor fails the pin). */
function regionAt(src: string, anchor: string, span: number): string {
  const at = src.indexOf(anchor);
  expect(at).toBeGreaterThanOrEqual(0);
  return src.slice(at, at + span);
}

describe("session-46: the mutation-failure feedback sweep (S46-P1)", () => {
  it("accounts: the edit-dialog submit toasts a failed save (the dialog stays open)", () => {
    const src = accounts();
    const region = regionAt(src, "await updateAccount(editTarget.id", 700);
    expect(region).toMatch(/if \(res\.ok\)\s*\{/);
    expect(region).toMatch(/\}\s*else\s*\{/);
    expect(region).toMatch(/toast\.error\(\s*"Could not save account",\s*res\.error\s*\)/);
  });

  it("leads: the edit-dialog submit toasts a failed save", () => {
    const src = leads();
    const region = regionAt(src, "await updateLead(editTarget.id", 700);
    expect(region).toMatch(/if \(res\.ok\)\s*\{/);
    expect(region).toMatch(/\}\s*else\s*\{/);
    expect(region).toMatch(/toast\.error\(\s*"Could not save lead",\s*res\.error\s*\)/);
  });

  it("contacts: the edit-dialog submit toasts a failed save", () => {
    const src = contacts();
    const region = regionAt(src, "await updateContact(editTarget.id", 700);
    expect(region).toMatch(/if \(res\.ok\)\s*\{/);
    expect(region).toMatch(/\}\s*else\s*\{/);
    expect(region).toMatch(/toast\.error\(\s*"Could not save contact",\s*res\.error\s*\)/);
  });

  it("accounts: the inline delete toasts a failed delete (the empty if(ret.ok){} retired)", () => {
    const src = accounts();
    const region = regionAt(src, "async function onDelete(account", 450);
    expect(region).toMatch(/const res = await deleteAccount\(/);
    expect(region).toMatch(/if \(!res\.ok\)\s*\{/);
    expect(region).toMatch(/toast\.error\(\s*"Could not delete account",\s*res\.error\s*\)/);
  });

  it("contacts: the inline delete toasts a failed delete", () => {
    const src = contacts();
    const region = regionAt(src, "async function onDelete(contact", 450);
    expect(region).toMatch(/const res = await deleteContact\(/);
    expect(region).toMatch(/if \(!res\.ok\)\s*\{/);
    expect(region).toMatch(/toast\.error\(\s*"Could not delete contact",\s*res\.error\s*\)/);
  });

  it("leads: the inline delete toasts a failed delete", () => {
    const src = leads();
    const region = regionAt(src, "async function onDelete(lead", 450);
    expect(region).toMatch(/const res = await deleteLead\(/);
    expect(region).toMatch(/if \(!res\.ok\)\s*\{/);
    expect(region).toMatch(/toast\.error\(\s*"Could not delete lead",\s*res\.error\s*\)/);
  });

  it("activities: the inline delete (the ⋮ Delete activity button) toasts a failed delete", () => {
    const src = activities();
    const region = regionAt(src, "Delete activity", 600);
    expect(region).toMatch(/const res = await deleteActivity\(/);
    expect(region).toMatch(/if \(!res\.ok\)\s*\{?\s*toast\.error\(\s*"Could not delete activity",\s*res\.error\s*\)/);
  });

  it("calendar: the event-delete dropdown item toasts a failed delete", () => {
    const src = calendar();
    // Anchor on the call itself with a backward window — `const res = `
    // precedes the await, so a forward-only slice would miss it.
    const at = src.indexOf("deleteEvent(e.id)");
    expect(at).toBeGreaterThanOrEqual(0);
    const region = src.slice(Math.max(0, at - 80), at + 400);
    expect(region).toMatch(/const res = await deleteEvent\(/);
    expect(region).toMatch(/if \(!res\.ok\)\s*\{?\s*toast\.error\(\s*"Could not delete event",\s*res\.error\s*\)/);
  });

  it("activities: toggleComplete toasts a failed status update", () => {
    const src = activities();
    const region = regionAt(src, "async function toggleComplete", 450);
    expect(region).toMatch(/const res = await updateActivity\(/);
    expect(region).toMatch(/if \(!res\.ok\)\s*\{/);
    expect(region).toMatch(/toast\.error\(\s*"Could not update activity",\s*res\.error\s*\)/);
  });

  it("contacts: updateRole toasts a failed role update (the row select's mutation)", () => {
    const src = contacts();
    const region = regionAt(src, "async function updateRole", 400);
    expect(region).toMatch(/const res = await updateContact\(/);
    expect(region).toMatch(/if \(!res\.ok\)\s*\{/);
    expect(region).toMatch(/toast\.error\(\s*"Could not update contact",\s*res\.error\s*\)/);
  });

  it("the toast-import census: all four newly-toasting pages import the helper", () => {
    // leads-page already imported it (its own :132 storage guard).
    for (const src of [accounts(), contacts(), activities(), calendar()]) {
      expect(src).toMatch(/import \{ toast \} from "@\/components\/ui\/toast";/);
    }
  });
});

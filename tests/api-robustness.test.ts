import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-35 pins (S35-P5): the API robustness layer. The audit found the
// PUT [id] routes assign accountId/ownerId/contactId straight into the
// Prisma update data with NO existence check (the POST-side checks exist),
// so a stale dropdown value throws Prisma P2003 — an UNHANDLED rejection
// that escapes the { ok, error } envelope as a raw non-JSON 500 — and NO
// route wraps its mutating DB call in try/catch (ERR.INTERNAL exists in
// src/lib/api.ts but was never used). The store-side pins: resetData()
// must refetch the opportunities slice (the reset route wipes opps) and
// logout() must clear the settings slice (the previous user's picklists
// otherwise linger into the next session).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const route = (rel: string) => stripComments(read(rel) ?? "");
const store = () => stripComments(read("src/stores/crm-store.ts") ?? "");

describe("session-35: PUT [id] routes validate foreign keys (the POST vocabulary)", () => {
  it("contacts/[id] checks accountId + ownerId before the update", () => {
    const src = route("src/app/api/contacts/[id]/route.ts");
    expect(src).toMatch(/db\.account\.findUnique/);
    expect(src).toMatch(/Selected company does not exist/);
    expect(src).toMatch(/db\.user\.findUnique/);
    expect(src).toMatch(/Selected owner does not exist/);
  });

  it("leads/[id] checks accountId + ownerId before the update", () => {
    const src = route("src/app/api/leads/[id]/route.ts");
    expect(src).toMatch(/db\.account\.findUnique/);
    expect(src).toMatch(/Selected company does not exist/);
    expect(src).toMatch(/db\.user\.findUnique/);
    expect(src).toMatch(/Selected owner does not exist/);
  });

  it("accounts/[id] checks ownerId before the update", () => {
    const src = route("src/app/api/accounts/[id]/route.ts");
    expect(src).toMatch(/db\.user\.findUnique/);
    expect(src).toMatch(/Selected owner does not exist/);
  });

  it("events/[id] checks accountId + contactId before the update", () => {
    const src = route("src/app/api/events/[id]/route.ts");
    expect(src).toMatch(/db\.account\.findUnique/);
    expect(src).toMatch(/Selected company does not exist/);
    expect(src).toMatch(/db\.contact\.findUnique/);
    expect(src).toMatch(/Selected contact does not exist/);
  });
});

describe("session-35: POST routes check the accountId they were missing", () => {
  it("activities POST checks accountId (contactId was already checked)", () => {
    const src = route("src/app/api/activities/route.ts");
    expect(src).toMatch(/db\.account\.findUnique/);
    expect(src).toMatch(/Selected company does not exist/);
  });

  it("events POST checks accountId (contactId was already checked)", () => {
    const src = route("src/app/api/events/route.ts");
    expect(src).toMatch(/db\.account\.findUnique/);
    expect(src).toMatch(/Selected company does not exist/);
  });
});

describe("session-35: mutating DB failures stay inside the { ok, error } envelope", () => {
  const MUTATING_ROUTES = [
    "src/app/api/contacts/[id]/route.ts",
    "src/app/api/leads/[id]/route.ts",
    "src/app/api/accounts/[id]/route.ts",
    "src/app/api/events/[id]/route.ts",
    "src/app/api/activities/route.ts",
    "src/app/api/events/route.ts",
  ];

  it.each(MUTATING_ROUTES)("%s wraps its DB writes in try/catch → ERR.INTERNAL", (rel) => {
    const src = route(rel);
    expect(src).toMatch(/try\s*\{/);
    expect(src).toMatch(/catch/);
    expect(src).toMatch(/ERR\.INTERNAL/);
  });
});

describe("session-35: the store's reset + logout hygiene", () => {
  it("resetData() refetches the opportunities slice (the reset route wipes opps)", () => {
    const src = store();
    // Anchor on the IMPLEMENTATION signature — the type declaration at the
    // top of the file also spells "resetData:" and would make the slice
    // swallow hydrate()'s fetchOpportunities (a tautology).
    const resetBlock = src.slice(src.indexOf("resetData: async"));
    expect(src).toMatch(/resetData:\s*async/);
    expect(resetBlock).toMatch(/fetchOpportunities/);
  });

  it("logout() clears the settings slice (no cross-session picklist leakage)", () => {
    const src = store();
    const logoutBlock = src.slice(src.indexOf("logout: async"), src.indexOf("fetchUsers: async"));
    expect(src).toMatch(/logout:\s*async/);
    expect(logoutBlock).toMatch(/settings:\s*null/);
  });
});

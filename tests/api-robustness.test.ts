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

// ---------------------------------------------------------------------------
// Session-36 pins (S36-P1..P5). The re-audit found the session-35 envelope
// layer INCOMPLETE: the five DELETE handlers, the three POST creates
// (contacts/leads/accounts), the users PATCH update, the settings PUT upsert
// and the activities [id] update all still let Prisma failures escape as raw
// non-envelope 500s — and /api/reset runs its seven deleteMany calls
// sequentially OUTSIDE a transaction (a mid-chain failure leaves a partial
// wipe). The deferred audit graduated one finding to HIGH: the events PUT
// drops the end≥start invariant the POST side enforces. Plus the upload
// Content-Length pre-gate, the photoUrl prefix guard, and health's honest
// 503. The per-handler slices below are deliberately STRONGER than the
// session-35 it.each pins (which match anywhere in the file): a handler that
// moves its write back out of the try FAILS its pin.
// ---------------------------------------------------------------------------

/** Slice one handler out of a (comment-stripped) route file: from its
 *  `export async function <verb>` to the next export (or EOF). */
function handlerBlock(src: string, verb: string): string {
  const start = src.indexOf(`export async function ${verb}`);
  expect(start).toBeGreaterThanOrEqual(0);
  const next = src.indexOf("export async function", start + 1);
  return next === -1 ? src.slice(start) : src.slice(start, next);
}

describe("session-36: the events end≥start invariant (the POST vocabulary, now on PUT too)", () => {
  it("events POST keeps the invariant (the guard pin — the exact message)", () => {
    const src = route("src/app/api/events/route.ts");
    expect(src).toMatch(/End time must be after start time/);
  });

  it("events/[id] PUT enforces the invariant against the MERGED record (patch semantics)", () => {
    const src = route("src/app/api/events/[id]/route.ts");
    expect(src).toMatch(/End time must be after start time/);
    // The effective values must consider the EXISTING row when a field is
    // absent from the patch body — checking only the patch's own startAt
    // would let {endAt: <early>} slip past an unchanged later startAt.
    expect(src).toMatch(/existing\.startAt/);
    expect(src).toMatch(/existing\.endAt/);
  });
});

describe("session-36: every handler's DB calls stay inside the envelope (the per-handler proof)", () => {
  const DELETE_HANDLERS = [
    "src/app/api/contacts/[id]/route.ts",
    "src/app/api/leads/[id]/route.ts",
    "src/app/api/accounts/[id]/route.ts",
    "src/app/api/events/[id]/route.ts",
    "src/app/api/activities/[id]/route.ts",
  ];

  it.each(DELETE_HANDLERS)("%s: DELETE wraps findUnique + delete in try/catch → ERR.INTERNAL", (rel) => {
    const del = handlerBlock(route(rel), "DELETE");
    expect(del).toMatch(/db\.\w+\.findUnique/);
    expect(del).toMatch(/db\.\w+\.delete\(/);
    expect(del).toMatch(/try\s*\{/);
    expect(del).toMatch(/ERR\.INTERNAL/);
  });

  it.each([
    "src/app/api/contacts/route.ts",
    "src/app/api/leads/route.ts",
    "src/app/api/accounts/route.ts",
  ])("%s: POST wraps its FK guards + create in try/catch → ERR.INTERNAL", (rel) => {
    const post = handlerBlock(route(rel), "POST");
    expect(post).toMatch(/db\.\w+\.create\(/);
    expect(post).toMatch(/try\s*\{/);
    expect(post).toMatch(/ERR\.INTERNAL/);
  });

  it("activities/[id] PUT wraps its update in try/catch → ERR.INTERNAL", () => {
    const put = handlerBlock(route("src/app/api/activities/[id]/route.ts"), "PUT");
    expect(put).toMatch(/db\.activity\.update/);
    expect(put).toMatch(/try\s*\{/);
    expect(put).toMatch(/ERR\.INTERNAL/);
  });

  it("users PATCH wraps its update in try/catch → ERR.INTERNAL", () => {
    const patch = handlerBlock(route("src/app/api/users/route.ts"), "PATCH");
    expect(patch).toMatch(/db\.user\.update/);
    expect(patch).toMatch(/try\s*\{/);
    expect(patch).toMatch(/ERR\.INTERNAL/);
  });

  it("settings PUT wraps its upsert in try/catch → ERR.INTERNAL", () => {
    const put = handlerBlock(route("src/app/api/settings/route.ts"), "PUT");
    expect(put).toMatch(/db\.setting\.upsert/);
    expect(put).toMatch(/try\s*\{/);
    expect(put).toMatch(/ERR\.INTERNAL/);
  });

  it("reset POST wipes ATOMICALLY ($transaction) inside the envelope", () => {
    const post = handlerBlock(route("src/app/api/reset/route.ts"), "POST");
    expect(post).toMatch(/\$transaction/);
    expect(post).toMatch(/try\s*\{/);
    expect(post).toMatch(/ERR\.INTERNAL/);
  });
});

describe("session-36: photoUrl accepts only the documented URL shapes", () => {
  // The only UI writer is the upload flow, returning /api/uploads/<32hex>.<ext>;
  // the reference's own data shape is https:// CDN links. Anything else (a
  // data: URL, a javascript: URL, an arbitrary tracker) is rejected with the
  // shared vocabulary instead of being stored and rendered to every viewer.
  it.each([
    "src/app/api/users/route.ts",
    "src/app/api/contacts/route.ts",
    "src/app/api/contacts/[id]/route.ts",
  ])("%s guards photoUrl with the prefix check (Invalid photo URL)", (rel) => {
    const src = route(rel);
    expect(src).toMatch(/Invalid photo URL/);
    expect(src).toMatch(/\/api\/uploads\//);
    // NOTE: stripComments eats the `//` inside the "https://" string literal,
    // so the pin matches the bare scheme — the mangled source keeps `https:`.
    expect(src).toMatch(/https:/);
  });
});

describe("session-36: health tells the truth when the database is down", () => {
  it("the db-down branch is a 503 SERVICE_UNAVAILABLE, not an ok-200", () => {
    const src = route("src/app/api/health/route.ts");
    const catchBlock = src.slice(src.indexOf("catch"));
    expect(src.indexOf("catch")).toBeGreaterThanOrEqual(0);
    expect(catchBlock).toMatch(/SERVICE_UNAVAILABLE/);
    expect(catchBlock).toMatch(/503/);
  });
});

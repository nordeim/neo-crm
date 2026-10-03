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

// ---------------------------------------------------------------------------
// Session-37 pins (S37-P1..P5). The re-audit found the session-36 envelope
// claim one family short: the AUTH routes' four mutating calls (signup's
// user.create, verify's two user.updates, resend's user.update) were
// unwrapped; the activities [id] PUT still ran its existence fetch OUTSIDE
// the try; the settings GET's lazy singleton create (inside readSettings)
// escaped the envelope. The deferred audit graduated the non-string FK
// coercion (a numeric/object FK payload silently coerced to a null FK —
// a SILENT CLEAR on PUT). And the s36 pins proved PRESENCE, not
// CONTAINMENT — a write could move back out of the try and every pin
// stayed green. The pins below assert containment: every DB call in the
// handler block must fall inside a try→catch span.
// ---------------------------------------------------------------------------

/** All try→catch spans in a (comment-stripped) handler block, as
 * [start, catchIndex) pairs. The span END anchors on the try's catch
 * CLAUSE (`} catch`) — a bare indexOf("catch") would truncate at the
 * promise `.catch(() => null)` chains these handlers carry (req.json's
 * inside leads' whole-handler try; the fire-and-forget lastActivityAt
 * updates) and mis-slice the span. Caveat: `} catch` inside a string
 * literal could in principle match — none of the pinned handlers
 * carries one (verified per-file). */
function trySpans(block: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  let from = 0;
  for (;;) {
    const t = block.indexOf("try {", from);
    if (t < 0) break;
    const c = block.indexOf("} catch", t);
    if (c < 0) break;
    spans.push([t, c]);
    from = c + 7;
  }
  return spans;
}

/** true when EVERY match of re in block falls inside some try→catch span
 *  (and at least one span exists). A DB call outside every try — before
 *  the try, or after the catch — returns false: the containment proof. */
function allInsideTry(block: string, re: RegExp): boolean {
  const spans = trySpans(block);
  if (spans.length === 0) return false;
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m: RegExpExecArray | null;
  while ((m = g.exec(block)) !== null) {
    const idx = m.index;
    if (!spans.some(([s, e]) => idx >= s && idx < e)) return false;
  }
  return true;
}

const DB_CALL = /\bdb\.\w+\.\w+\(/;

describe("session-37: the auth family joins the envelope (S37-P1)", () => {
  it.each([
    "src/app/api/auth/signup/route.ts",
    "src/app/api/auth/verify/route.ts",
    "src/app/api/auth/resend/route.ts",
  ])("%s holds every mutating DB call inside try/catch → ERR.INTERNAL", (rel) => {
    const post = handlerBlock(route(rel), "POST");
    expect(post).toMatch(/db\.user\.(create|update)\(/);
    expect(allInsideTry(post, /db\.user\.(create|update)\(/)).toBe(true);
    expect(post).toMatch(/ERR\.INTERNAL/);
  });
});

describe("session-37: the containment proof (S37-P2 + P4)", () => {
  it.each([
    "src/app/api/contacts/[id]/route.ts",
    "src/app/api/leads/[id]/route.ts",
    "src/app/api/accounts/[id]/route.ts",
    "src/app/api/events/[id]/route.ts",
    "src/app/api/activities/[id]/route.ts",
  ])("%s: PUT holds EVERY DB call inside the envelope (incl. the existence fetch)", (rel) => {
    const put = handlerBlock(route(rel), "PUT");
    expect(put).toMatch(DB_CALL);
    expect(allInsideTry(put, DB_CALL)).toBe(true);
    expect(put).toMatch(/ERR\.INTERNAL/);
  });

  it.each([
    "src/app/api/contacts/[id]/route.ts",
    "src/app/api/leads/[id]/route.ts",
    "src/app/api/accounts/[id]/route.ts",
    "src/app/api/events/[id]/route.ts",
    "src/app/api/activities/[id]/route.ts",
  ])("%s: DELETE holds every DB call inside the envelope", (rel) => {
    const del = handlerBlock(route(rel), "DELETE");
    expect(del).toMatch(DB_CALL);
    expect(allInsideTry(del, DB_CALL)).toBe(true);
  });

  it.each([
    "src/app/api/contacts/route.ts",
    "src/app/api/leads/route.ts",
    "src/app/api/accounts/route.ts",
    "src/app/api/activities/route.ts",
    "src/app/api/events/route.ts",
  ])("%s: POST holds every DB call inside the envelope", (rel) => {
    const post = handlerBlock(route(rel), "POST");
    expect(post).toMatch(DB_CALL);
    expect(allInsideTry(post, DB_CALL)).toBe(true);
  });

  it("users PATCH holds every DB call inside the envelope", () => {
    const patch = handlerBlock(route("src/app/api/users/route.ts"), "PATCH");
    expect(patch).toMatch(DB_CALL);
    expect(allInsideTry(patch, DB_CALL)).toBe(true);
  });

  it("settings PUT holds every DB call (incl. readSettings) inside the envelope", () => {
    const put = handlerBlock(route("src/app/api/settings/route.ts"), "PUT");
    expect(allInsideTry(put, /db\.\w+\.\w+\(|readSettings\(/)).toBe(true);
  });

  it("settings GET wraps its readSettings (the lazy singleton create) in the envelope", () => {
    const get = handlerBlock(route("src/app/api/settings/route.ts"), "GET");
    expect(allInsideTry(get, /readSettings\(/)).toBe(true);
    expect(get).toMatch(/ERR\.INTERNAL/);
  });

  it("events/[id] PUT pins the invariant's comparison DIRECTION (a flipped operator fails)", () => {
    const put = handlerBlock(route("src/app/api/events/[id]/route.ts"), "PUT");
    expect(put).toMatch(/effectiveEnd\s*&&\s*effectiveEnd\s*<\s*effectiveStart/);
  });
});

describe("session-37: FK ids reject non-string payloads (S37-P3, no silent coercion)", () => {
  it("asFKId maps the clear/absent shapes to null and trims strings", async () => {
    const api = await import("@/lib/api");
    expect(typeof api.asFKId).toBe("function");
    expect(api.asFKId(undefined)).toBeNull();
    expect(api.asFKId(null)).toBeNull();
    expect(api.asFKId("")).toBeNull();
    expect(api.asFKId("   ")).toBeNull();
    expect(api.asFKId(" c1a2b3 ")).toBe("c1a2b3");
    expect(api.asFKId("c1a2b3")).toBe("c1a2b3");
  });

  it("isBadFK flags every present non-string payload (numbers, booleans, objects)", async () => {
    const api = await import("@/lib/api");
    expect(typeof api.isBadFK).toBe("function");
    expect(api.isBadFK(undefined)).toBe(false);
    expect(api.isBadFK(null)).toBe(false);
    expect(api.isBadFK("")).toBe(false);
    expect(api.isBadFK("abc")).toBe(false);
    expect(api.isBadFK(123)).toBe(true);
    expect(api.isBadFK(0)).toBe(true);
    expect(api.isBadFK(true)).toBe(true);
    expect(api.isBadFK({})).toBe(true);
    expect(api.isBadFK([])).toBe(true);
  });

  // The coercing parse pattern must be GONE from all nine route files,
  // replaced by the isBadFK guard at every FK field the route accepts.
  const FK_SITES: Array<[string, string[]]> = [
    ["src/app/api/contacts/route.ts", ["accountId", "ownerId"]],
    ["src/app/api/contacts/[id]/route.ts", ["accountId", "ownerId"]],
    ["src/app/api/leads/route.ts", ["ownerId", "accountId"]],
    ["src/app/api/leads/[id]/route.ts", ["accountId", "ownerId"]],
    ["src/app/api/events/route.ts", ["contactId", "accountId"]],
    ["src/app/api/events/[id]/route.ts", ["accountId", "contactId"]],
    ["src/app/api/activities/route.ts", ["contactId", "accountId"]],
    ["src/app/api/accounts/route.ts", ["ownerId"]],
    ["src/app/api/accounts/[id]/route.ts", ["ownerId"]],
  ];

  it.each(FK_SITES)("%s guards its FK fields with isBadFK → asFKId", (rel, fks) => {
    const src = route(rel);
    // The silent-coercion pattern is gone…
    expect(src).not.toMatch(/asString\(body\.(accountId|ownerId|contactId)\s*,/);
    // …and every FK field this route accepts is guarded + parsed by the
    // new helpers.
    for (const fk of fks) {
      expect(src).toMatch(new RegExp(`isBadFK\\(body\\.${fk}\\)`));
      expect(src).toMatch(new RegExp(`asFKId\\(body\\.${fk}\\)`));
    }
  });

  it("the FK-400 vocabulary stays in the family (company / owner / contact)", () => {
    const contacts = route("src/app/api/contacts/route.ts");
    expect(contacts).toMatch(/Invalid company selection/);
    expect(contacts).toMatch(/Invalid owner selection/);
    const events = route("src/app/api/events/route.ts");
    expect(events).toMatch(/Invalid contact selection/);
    expect(events).toMatch(/Invalid company selection/);
  });
});

describe("session-37: photoUrl cap parity across the three writers (S37-P5)", () => {
  it("users PATCH no longer truncates at 300 — the shared 500 cap", () => {
    const patch = handlerBlock(route("src/app/api/users/route.ts"), "PATCH");
    expect(patch).not.toMatch(/slice\(0,\s*300\)/);
    expect(patch).toMatch(/500/);
    // The contacts writers already cap at 500 (asString max).
    expect(route("src/app/api/contacts/route.ts")).toMatch(/photoUrl,\s*\{\s*optional:\s*true,\s*max:\s*500\s*\}/);
    expect(route("src/app/api/contacts/[id]/route.ts")).toMatch(/photoUrl,\s*\{\s*optional:\s*true,\s*max:\s*500\s*\}/);
  });
});

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

  // The coercing parse pattern must be GONE from all ten route files
  // (the s37-era "nine" count never re-derived after session-42's
  // S42-P3 row — the 10th FK site; N-89a2), replaced by the isBadFK
  // guard at every FK field the route accepts.
  const FK_SITES: Array<[string, string[]]> = [
    ["src/app/api/contacts/route.ts", ["accountId", "ownerId"]],
    ["src/app/api/contacts/[id]/route.ts", ["accountId", "ownerId"]],
    // Session-43 (S43-P1): Lead.contactId joins the census — the schema +
    // wire type carried the relation but NO leads route accepted it (a
    // contactId payload was silently dropped on BOTH verbs — the
    // N-42b shape one level up, LIVE-proven).
    ["src/app/api/leads/route.ts", ["ownerId", "accountId", "contactId"]],
    ["src/app/api/leads/[id]/route.ts", ["accountId", "ownerId", "contactId"]],
    ["src/app/api/events/route.ts", ["contactId", "accountId"]],
    ["src/app/api/events/[id]/route.ts", ["accountId", "contactId"]],
    ["src/app/api/activities/route.ts", ["contactId", "accountId"]],
    // Session-42 (S42-P3): the census row the s37 sweep missed — the
    // activities [id] PUT had NO FK branches at all (the POST accepts
    // both), so its links could never be re-assigned or cleared.
    ["src/app/api/activities/[id]/route.ts", ["contactId", "accountId"]],
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

// ---------------------------------------------------------------------------
// Session-38 pins (S38-P1..P6). The re-audit's findings: the signup
// nameFromEmail fallback is DEAD CODE (asString's non-optional "" defeats
// the ?? — every UI signup stores name: ""); photoUrl carries the exact
// silent-coercion class s37 graduated for FKs (a numeric payload silently
// CLEARS on the contacts PUT, is silently IGNORED on the users PATCH —
// LIVE-proven); the import loop uses naive split(",") instead of the tested
// parseCsv seam (quoted commas corrupt rows) + a full-list refetch per row;
// the upload POST's writeFile/mkdirSync escape the envelope (raw 500s on
// ENOSPC); sweepRateLimits runs only from login; and the proof coverage has
// four holes (reset unpinned, settings-GET vacuous, auth reads unpinned,
// $-APIs invisible to DB_CALL).
// ---------------------------------------------------------------------------

describe("session-38: the signup name-fallback revival (S38-P1)", () => {
  it("the name parse is OPTIONAL so the ?? nameFromEmail fallback actually fires", () => {
    const post = handlerBlock(route("src/app/api/auth/signup/route.ts"), "POST");
    // The trap: asString's NON-optional form returns "" for an absent
    // name, and "" ?? fallback keeps "" (empty string is not nullish) —
    // the fallback has been dead since s21. The optional form returns
    // undefined, which is nullish, so the ?? fires.
    expect(post).toMatch(/asString\(body\.name,\s*\{\s*max:\s*80,\s*optional:\s*true\s*\}\)/);
    expect(post).toMatch(/\?\?\s*nameFromEmail\(/);
  });

  it("the fallback helper derives a display name from the email local part", () => {
    const src = route("src/app/api/auth/signup/route.ts");
    expect(src).toMatch(/function nameFromEmail\(/);
    // The fallback must survive the optional-parse fix (not be deleted
    // as "unused" — it is the absent-name path). Session-39 re-anchor:
    // the expression is now parenthesized for the .slice(0, 80) cap.
    expect(src).toMatch(/const name = \(asString\(body\.name/);
  });
});

describe("session-38: the photoUrl type-guard family (S38-P2)", () => {
  it("contacts POST rejects a present non-string photoUrl (was a silent clear)", () => {
    const post = handlerBlock(route("src/app/api/contacts/route.ts"), "POST");
    expect(post).toMatch(/isBadFK\(body\.photoUrl\)/);
    expect(post).toMatch(/Invalid photo URL/);
  });

  it("contacts PUT rejects a present non-string photoUrl (LIVE-proven silent clear)", () => {
    const put = handlerBlock(route("src/app/api/contacts/[id]/route.ts"), "PUT");
    expect(put).toMatch(/isBadFK\(body\.photoUrl\)/);
    expect(put).toMatch(/Invalid photo URL/);
  });

  it("users PATCH rejects a present non-string photoUrl (was a silent ignore)", () => {
    const patch = handlerBlock(route("src/app/api/users/route.ts"), "PATCH");
    expect(patch).toMatch(/isBadFK\(body\.photoUrl\)/);
    expect(patch).toMatch(/Invalid photo URL/);
  });

  it("the trim is harmonized — users PATCH trims like the contacts writers (F12)", () => {
    const patch = handlerBlock(route("src/app/api/users/route.ts"), "PATCH");
    // Contacts trim via asString before the prefix check; users sliced
    // raw, so " https://…" was accepted+trimmed on contacts but 400ed
    // on the profile. Both writers now trim.
    expect(patch).toMatch(/body\.photoUrl\.trim\(\)\.slice\(0,\s*500\)/);
  });
});

/** Slice one store action out of the (comment-stripped) store source:
 *  from the IMPLEMENTATION `name: async` (not the interface's type line)
 *  to the store's action-closing `\n  },`. */
function actionBlock(src: string, name: string): string {
  const start = src.indexOf(`${name}: async`);
  if (start < 0) return "";
  const end = src.indexOf("\n  },", start);
  return end > start ? src.slice(start, end) : src.slice(start, start + 900);
}

describe("session-38: the import parser graduation (S38-P3)", () => {
  it("the contacts page's runImport uses the tested parseCsv seam (not naive split)", () => {
    const src = route("src/app/(app)/contacts/contacts-page.tsx");
    expect(src).toMatch(/parseCsv\(/);
    // The naive parser is GONE: split(",") + the quote-strip replace
    // corrupted quoted cells with embedded commas (wrong name, shifted
    // email columns).
    expect(src).not.toMatch(/row\.split\(","\)/);
    expect(src).not.toMatch(/\^"\|"\$/);
  });

  it("runImport batches through the store's importContacts (no per-row createContact)", () => {
    const src = route("src/app/(app)/contacts/contacts-page.tsx");
    expect(src).toMatch(/importContacts/);
    const run = src.slice(src.indexOf("runImport"), src.indexOf("runImport") + 1500);
    expect(run).not.toMatch(/createContact/);
  });

  it("the store's importContacts refetches the slice exactly ONCE, after the loop", () => {
    const block = actionBlock(store(), "importContacts");
    expect(block).toMatch(/for\s*\(const \w+ of \w+\)/);
    // Exactly one refetch — the O(N²) per-row createContact refetch is
    // the regression this pin guards.
    expect(block.match(/fetchContacts\(/g)?.length ?? 0).toBe(1);
    // …and it comes AFTER the loop's close, not inside it.
    expect(block).toMatch(/created \+= 1;\s*\}\s*await get\(\)\.fetchContacts\(\);/);
  });
});

describe("session-38: the upload write envelope (S38-P5)", () => {
  it("the upload POST's write path (uploadsDir mkdir + writeFile) is envelope-held", () => {
    const post = handlerBlock(route("src/app/api/upload/route.ts"), "POST");
    expect(post).toMatch(/writeFile\(/);
    expect(post).toMatch(/uploadsDir\(/);
    // Containment: ENOSPC/EACCES on the mkdir or the write answers
    // ERR.INTERNAL inside { ok, error } — not a raw non-JSON 500.
    expect(allInsideTry(post, /writeFile\(|uploadsDir\(/)).toBe(true);
    expect(post).toMatch(/ERR\.INTERNAL/);
  });
});

describe("session-38: the limiter sweep hygiene (S38-P6)", () => {
  it.each([
    "src/app/api/auth/login/route.ts",
    "src/app/api/auth/signup/route.ts",
    "src/app/api/auth/verify/route.ts",
    "src/app/api/auth/resend/route.ts",
  ])("%s sweeps the limiter buckets (the opportunistic cleanup)", (rel) => {
    // The audit's sharpened note: the sweep ran ONLY from login, so the
    // signup/verify/resend buckets were swept only when someone next
    // logged in. All four rate-limited auth routes now run it (login's
    // own placement — after the bucket read — is untouched; the sweep
    // is opportunistic either way).
    const src = route(rel);
    expect(src).toMatch(/sweepRateLimits\(\);/);
    const post = handlerBlock(src, "POST");
    expect(post).toMatch(/sweepRateLimits\(\);/);
  });
});

describe("session-38: the proof-coverage completion (S38-P4 — strengthening pins)", () => {
  it("reset POST holds every deleteMany inside the envelope (containment, not presence)", () => {
    const post = handlerBlock(route("src/app/api/reset/route.ts"), "POST");
    expect(post).toMatch(/db\.\w+\.deleteMany\(/);
    expect(allInsideTry(post, /db\.\w+\.deleteMany\(/)).toBe(true);
    expect(post).toMatch(/\$transaction/);
    expect(post).toMatch(/ERR\.INTERNAL/);
  });

  it("settings GET keeps its readSettings call (presence — the pin was vacuously satisfiable)", () => {
    const get = handlerBlock(route("src/app/api/settings/route.ts"), "GET");
    expect(get).toMatch(/readSettings\(/);
    expect(allInsideTry(get, /readSettings\(/)).toBe(true);
    expect(get).toMatch(/ERR\.INTERNAL/);
  });

  it.each([
    "src/app/api/auth/login/route.ts",
    "src/app/api/auth/signup/route.ts",
    "src/app/api/auth/verify/route.ts",
    "src/app/api/auth/resend/route.ts",
  ])("%s: the wrapped READS are containment-pinned too (findUnique/count)", (rel) => {
    const post = handlerBlock(route(rel), "POST");
    expect(allInsideTry(post, /db\.user\.(create|update|findUnique|count)\(/)).toBe(true);
    // Session-39 (S39-P5): the presence pairing — allInsideTry is
    // vacuously TRUE on zero matches, so a route that lost all its
    // reads kept the pin green. Every auth route carries at least the
    // findUnique; signup additionally the count.
    // Session-40 (S40-P5): login joins — its findUnique was the only
    // auth read left outside the envelope (a raw non-JSON 500 on a
    // SQLITE_BUSY-class failure).
    expect(post).toMatch(/db\.user\.findUnique\(/);
    if (rel.endsWith("signup/route.ts")) {
      expect(post).toMatch(/db\.user\.count\(/);
    }
  });

  it("health GET's $queryRaw is containment-pinned (the DB_CALL $-API blind spot)", () => {
    const get = handlerBlock(route("src/app/api/health/route.ts"), "GET");
    expect(get).toMatch(/db\.\$queryRaw/);
    expect(allInsideTry(get, /db\.\$queryRaw/)).toBe(true);
  });
});

describe("session-39: the import error semantics (S39-P2)", () => {
  it("importContacts returns { created, attempted } — the count alone cannot tell failure from empty", () => {
    const block = actionBlock(store(), "importContacts");
    // The s38 action returned a bare count; `created === 0` conflated
    // "the CSV had no valid rows" with "every POST failed" (expired
    // session, network drop) — the wrong banner either way.
    expect(block).toMatch(/attempted/);
    expect(block).toMatch(/return\s*\{\s*created,\s*attempted\s*\}/);
  });

  it("runImport distinguishes all-POSTs-failed from no-valid-rows (the reference's vocabulary)", () => {
    const src = route("src/app/(app)/contacts/contacts-page.tsx");
    const run = src.slice(src.indexOf("async function runImport"), src.indexOf("async function runImport") + 2200);
    // The three-way branch: attempted > 0 with created === 0 is the
    // "Failed to import contacts" case; attempted === 0 is the
    // "No valid contacts found" case. Both strings are the reference's
    // pinned vocabulary (S26-P6) — the branch assigns each to its
    // correct cause.
    expect(run).toMatch(/created > 0/);
    expect(run).toMatch(/attempted > 0/);
    expect(run).toMatch(/Failed to import contacts\. Please try again\./);
    expect(run).toMatch(/No valid contacts found\. Make sure your file has name and email columns\./);
    // The failure branch must NOT be reachable only via the outer
    // catch — it is the created===0 && attempted>0 assignment.
    const failureIdx = run.indexOf("Failed to import contacts");
    const catchIdx = run.indexOf("} catch");
    expect(failureIdx).toBeGreaterThan(-1);
    expect(failureIdx).toBeLessThan(catchIdx);
  });

  it("the store's importContacts still refetches exactly ONCE, after the loop (the s38 shape holds)", () => {
    const block = actionBlock(store(), "importContacts");
    expect(block.match(/fetchContacts\(/g)?.length ?? 0).toBe(1);
    expect(block).toMatch(/created \+= 1;\s*\}\s*await get\(\)\.fetchContacts\(\);/);
  });
});

describe("session-39: the signup name family completion (S39-P4)", () => {
  it("a present non-string name is a 400 (the photoUrl guard's shape, one field over)", () => {
    const post = handlerBlock(route("src/app/api/auth/signup/route.ts"), "POST");
    // {"name": 123} used to ride asString's optional coercion to
    // undefined and silently derive from the email — the same
    // coercion class the s38 photoUrl guards closed.
    expect(post).toMatch(/isBadFK\(body\.name\)/);
    expect(post).toMatch(/Invalid name/);
  });

  it("the DERIVED name is capped at the explicit-name ceiling (80)", () => {
    const src = route("src/app/api/auth/signup/route.ts");
    // nameFromEmail returns the email local part — up to ~150 chars
    // under the 160 email cap, vs the 80 an explicit name gets. The
    // combined expression now caps both paths.
    const m = src.match(/const name = ([^;]+);/);
    expect(m).not.toBeNull();
    expect(m![1]).toMatch(/slice\(0,\s*80\)/);
  });
});

describe("session-39: the sweep placement harmonization (S39-P7)", () => {
  it.each([
    "src/app/api/auth/login/route.ts",
    "src/app/api/auth/signup/route.ts",
    "src/app/api/auth/verify/route.ts",
    "src/app/api/auth/resend/route.ts",
  ])("%s sweeps BEFORE the rate-limit return (denied requests sweep too)", (rel) => {
    const src = route(rel);
    const post = handlerBlock(src, "POST");
    // Login sweeps before the !allowed return; the three s38 routes
    // swept after it, so a storm of denied requests never pruned the
    // bucket map. The placement is now uniform — the code finally
    // matches its own \"mirrored\" comment.
    const sweepIdx = post.indexOf("sweepRateLimits();");
    const deniedIdx = post.indexOf("!limit.allowed");
    expect(sweepIdx).toBeGreaterThan(-1);
    expect(deniedIdx).toBeGreaterThan(-1);
    expect(sweepIdx).toBeLessThan(deniedIdx);
  });
});


// ---------------------------------------------------------------------------
// Session-40 (S40-P2/P3/P4/P5): the non-FK coercion family graduates.
// The graduation audit quantified 37 silent PUT members + 40 silent POST
// members — the ledger's "~15 PUT sites" undercounted (the 19 `?? null`
// optional-string clears were never counted). Every silent member is the
// isBadFK class one parse-shape over: a present non-string rides
// asString/asDate/asNumber's lenient coercion into a SILENT mutation
// ({"status":123} reset an inactive contact to active — LIVE-proven;
// {"endAt":{}} cleared the end time AND bypassed the s36 invariant;
// {"defaultCurrency":123} stored "" through a dead ?? fallback).
// ---------------------------------------------------------------------------

const guardCall = (guard: string, field: string) =>
  new RegExp(`${guard}\\(body\\.${field}\\)`);

describe("session-40: the PUT-side type-guard sweep (S40-P2 — the silent-mutation family)", () => {
  it.each([
    // [route, field, guard, message] — the s37 FK-guard shape, one
    // parse family over. Every row was a LIVE-verified silent mutation.
    ["src/app/api/leads/[id]/route.ts", "email", "isBadString", "Invalid email"],
    ["src/app/api/leads/[id]/route.ts", "phone", "isBadString", "Invalid phone number"],
    ["src/app/api/leads/[id]/route.ts", "company", "isBadString", "Invalid company"],
    ["src/app/api/leads/[id]/route.ts", "source", "isBadString", "Invalid source"],
    ["src/app/api/leads/[id]/route.ts", "value", "isBadNumber", "Invalid value"],
    ["src/app/api/leads/[id]/route.ts", "expectedCloseDate", "isBadDate", "Invalid expected close date"],
    ["src/app/api/leads/[id]/route.ts", "nextFollowUp", "isBadDate", "Invalid follow-up date"],
    ["src/app/api/contacts/[id]/route.ts", "email", "isBadString", "Invalid email"],
    ["src/app/api/contacts/[id]/route.ts", "phone", "isBadString", "Invalid phone number"],
    ["src/app/api/contacts/[id]/route.ts", "company", "isBadString", "Invalid company"],
    ["src/app/api/contacts/[id]/route.ts", "position", "isBadString", "Invalid position"],
    ["src/app/api/contacts/[id]/route.ts", "source", "isBadString", "Invalid source"],
    ["src/app/api/contacts/[id]/route.ts", "role", "isBadString", "Invalid role"],
    ["src/app/api/contacts/[id]/route.ts", "engagementLevel", "isBadString", "Invalid engagement level"],
    ["src/app/api/contacts/[id]/route.ts", "companySize", "isBadString", "Invalid company size"],
    ["src/app/api/contacts/[id]/route.ts", "status", "isBadString", "Invalid status"],
    ["src/app/api/accounts/[id]/route.ts", "industry", "isBadString", "Invalid industry"],
    ["src/app/api/accounts/[id]/route.ts", "email", "isBadString", "Invalid email"],
    ["src/app/api/accounts/[id]/route.ts", "phone", "isBadString", "Invalid phone number"],
    ["src/app/api/accounts/[id]/route.ts", "website", "isBadString", "Invalid website"],
    ["src/app/api/accounts/[id]/route.ts", "annualRevenue", "isBadNumber", "Invalid annual revenue"],
    ["src/app/api/accounts/[id]/route.ts", "employees", "isBadNumber", "Invalid employee count"],
    ["src/app/api/activities/[id]/route.ts", "notes", "isBadString", "Invalid notes"],
    ["src/app/api/activities/[id]/route.ts", "relatedType", "isBadString", "Invalid related type"],
    ["src/app/api/activities/[id]/route.ts", "relatedName", "isBadString", "Invalid related name"],
    ["src/app/api/activities/[id]/route.ts", "dueAt", "isBadDate", "Invalid due date"],
    ["src/app/api/events/[id]/route.ts", "description", "isBadString", "Invalid description"],
    ["src/app/api/events/[id]/route.ts", "location", "isBadString", "Invalid location"],
    ["src/app/api/events/[id]/route.ts", "relatedType", "isBadString", "Invalid related type"],
    ["src/app/api/events/[id]/route.ts", "endAt", "isBadDate", "Invalid end date"],
  ])("%s: %s rejects the present-non-string class (400 %s)", (rel, field, guard, message) => {
    const put = handlerBlock(route(rel), "PUT");
    expect(put).toMatch(guardCall(guard, field));
    expect(put).toMatch(message);
  });

  it("contacts/[id] status gains the CONTACT_STATUSES membership (N-B5: \"banana\" stored verbatim)", () => {
    const put = handlerBlock(route("src/app/api/contacts/[id]/route.ts"), "PUT");
    expect(put).toMatch(/CONTACT_STATUSES/);
    expect(put).toMatch(/Invalid status/);
  });
});

describe("session-40: the settings dead-fallback revival + guards (S40-P3 — N-B4)", () => {
  it.each([
    ["defaultCurrency", "isBadString", "Invalid currency"],
    ["defaultLeadStage", "isBadString", "Invalid default lead stage"],
    ["defaultTier", "isBadString", "Invalid default tier"],
    ["calendarView", "isBadString", "Invalid calendar view"],
    ["followUpDays", "isBadNumber", "Invalid follow-up days"],
  ])("settings PUT %s: the type guard (400 %s)", (field, guard, message) => {
    const put = handlerBlock(route("src/app/api/settings/route.ts"), "PUT");
    expect(put).toMatch(guardCall(guard, field));
    expect(put).toMatch(message);
  });

  it("the quartet's ?? fallbacks are LIVE (optional: true — \"\" is not nullish, the s38 lesson)", () => {
    const put = handlerBlock(route("src/app/api/settings/route.ts"), "PUT");
    for (const field of ["defaultCurrency", "defaultLeadStage", "defaultTier", "calendarView"]) {
      const m = put.match(new RegExp(`asString\\(body\\.${field},[^)]*\\)`));
      expect(m).not.toBeNull();
      expect(m![0]).toMatch(/optional:\s*true/);
    }
  });
});

describe("session-40: the POST-side inventing twins (S40-P4 — bad types silently invent data)", () => {
  it.each([
    // leads: value→0, the dates→null
    ["src/app/api/leads/route.ts", "value", "isBadNumber", "Invalid value"],
    ["src/app/api/leads/route.ts", "expectedCloseDate", "isBadDate", "Invalid expected close date"],
    ["src/app/api/leads/route.ts", "nextFollowUp", "isBadDate", "Invalid follow-up date"],
    // accounts: revenue/employees→null
    ["src/app/api/accounts/route.ts", "annualRevenue", "isBadNumber", "Invalid annual revenue"],
    ["src/app/api/accounts/route.ts", "employees", "isBadNumber", "Invalid employee count"],
    // activities: dueAt→new Date() — the WORST (invents NOW)
    ["src/app/api/activities/route.ts", "dueAt", "isBadDate", "Invalid due date"],
    // events: endAt→null — the invariant twin
    ["src/app/api/events/route.ts", "endAt", "isBadDate", "Invalid end date"],
  ])("%s: %s rejects the inventing class (400 %s)", (rel, field, guard, message) => {
    const post = handlerBlock(route(rel), "POST");
    expect(post).toMatch(guardCall(guard, field));
    expect(post).toMatch(message);
  });
});

describe("session-40: the login envelope (S40-P5 — the last unwrapped auth read)", () => {
  it("login POST wraps its read + cookie-set tail in try/catch → ERR.INTERNAL", () => {
    const post = handlerBlock(route("src/app/api/auth/login/route.ts"), "POST");
    expect(post).toMatch(/try\s*\{/);
    expect(post).toMatch(/db\.user\.findUnique\(/);
    expect(allInsideTry(post, /db\.user\.findUnique\(/)).toBe(true);
    expect(post).toMatch(/ERR\.INTERNAL/);
  });
});

// ---------------------------------------------------------------------------
// Session-41 (S41-P1): the POST-side lenient-create completion. The
// graduation audit's headline: the ledger's "lenient-create, no data
// destroyed" rationale was FALSE as stated — a present non-string payload
// IS silently destroyed (POST {"phone":123} → 200 + phone:null — the
// caller's data dropped without error; LIVE-proven). Every one of the 19
// string-null sites has a PUT twin already guarded in s40 with the
// identical predicate + message; the 12 enum-field type-gaps silently
// invent defaults (POST {"stage":123} → 200 + "new"; {"type":{}} →
// "call" — LIVE-proven). The guards below close the non-string silent
// path; the enum MEMBERSHIP checks (bad strings) already 400; the source
// enum-membership question stays deferred (settings-configurable
// vocabulary + the CSV import's arbitrary source strings).
// ---------------------------------------------------------------------------

describe("session-41: the POST-side lenient-create completion (S41-P1 — the silent-drop family)", () => {
  it.each([
    // [route, field, message] — the PUT vocabulary VERBATIM, applied at
    // the parse site on the POST side. Every row was a LIVE-verified
    // silent drop or silent default invention.
    // contacts: the 9 lenient members (email regex only fires on strings;
    // the four classifier enums default; the create-inline strings null)
    ["src/app/api/contacts/route.ts", "email", "Invalid email"],
    ["src/app/api/contacts/route.ts", "priority", "Invalid priority"],
    ["src/app/api/contacts/route.ts", "role", "Invalid role"],
    ["src/app/api/contacts/route.ts", "engagementLevel", "Invalid engagement level"],
    ["src/app/api/contacts/route.ts", "companySize", "Invalid company size"],
    ["src/app/api/contacts/route.ts", "phone", "Invalid phone number"],
    ["src/app/api/contacts/route.ts", "company", "Invalid company"],
    ["src/app/api/contacts/route.ts", "position", "Invalid position"],
    ["src/app/api/contacts/route.ts", "source", "Invalid source"],
    // leads: stage→"new", source/email/phone/company→null
    ["src/app/api/leads/route.ts", "stage", "Invalid stage"],
    ["src/app/api/leads/route.ts", "source", "Invalid source"],
    ["src/app/api/leads/route.ts", "email", "Invalid email"],
    ["src/app/api/leads/route.ts", "phone", "Invalid phone number"],
    ["src/app/api/leads/route.ts", "company", "Invalid company"],
    // accounts: status→"active", the four strings→null (Session-86
    // M-86c2: the tier row RETIRED with the stored column — the
    // reference derives tier from revenue and models no tier field)
    ["src/app/api/accounts/route.ts", "status", "Invalid status"],
    ["src/app/api/accounts/route.ts", "industry", "Invalid industry"],
    ["src/app/api/accounts/route.ts", "email", "Invalid email"],
    ["src/app/api/accounts/route.ts", "phone", "Invalid phone number"],
    ["src/app/api/accounts/route.ts", "website", "Invalid website"],
    // activities: type→"call", status→"scheduled", priority→"normal",
    // notes/relatedType/relatedName→null
    ["src/app/api/activities/route.ts", "type", "Invalid activity type"],
    ["src/app/api/activities/route.ts", "status", "Invalid status"],
    ["src/app/api/activities/route.ts", "priority", "Invalid priority"],
    ["src/app/api/activities/route.ts", "notes", "Invalid notes"],
    ["src/app/api/activities/route.ts", "relatedType", "Invalid related type"],
    ["src/app/api/activities/route.ts", "relatedName", "Invalid related name"],
    // events: type→"meeting", status→"scheduled", the three strings→null
    ["src/app/api/events/route.ts", "type", "Invalid event type"],
    ["src/app/api/events/route.ts", "status", "Invalid status"],
    ["src/app/api/events/route.ts", "description", "Invalid description"],
    ["src/app/api/events/route.ts", "location", "Invalid location"],
    ["src/app/api/events/route.ts", "relatedType", "Invalid related type"],
  ])("%s: POST %s rejects the present-non-string class (400 %s)", (rel, field, message) => {
    const post = handlerBlock(route(rel), "POST");
    expect(post).toMatch(guardCall("isBadString", field));
    expect(post).toMatch(message);
  });
});

// ---------------------------------------------------------------------------
// Session-41 (S41-P4): the session-read envelope. The s40 login wrap
// closed the last unwrapped auth-route READ — but requireSession()'s own
// getSessionUser() await (src/lib/auth.ts findUnique) was still bare, so
// a SQLITE_BUSY-class failure during the SESSION read answered a raw
// non-JSON 500 on EVERY protected route. auth/me — the only route that
// reads the session directly — had the same hole.
// ---------------------------------------------------------------------------

describe("session-41: the session-read envelope (S41-P4 — every protected route's shared read)", () => {
  it("requireSession wraps its getSessionUser await in try/catch → ERR.INTERNAL", () => {
    const src = route("src/lib/api.ts");
    const m = src.match(/export async function requireSession[\s\S]*?\n\}/);
    expect(m).not.toBeNull();
    const block = m![0];
    expect(block).toMatch(/try\s*\{/);
    expect(block).toMatch(/getSessionUser\(\)/);
    // Session-42 (S42-P5): presence upgraded to CONTAINMENT — the call
    // drifting back outside the try must fail the pin (the N-42d
    // strengthening; GREEN-on-arrival by construction).
    expect(allInsideTry(block, /getSessionUser\(\)/)).toBe(true);
    expect(block).toMatch(/ERR\.INTERNAL/);
  });

  it("auth/me GET wraps its direct session read in try/catch → ERR.INTERNAL", () => {
    const get = handlerBlock(route("src/app/api/auth/me/route.ts"), "GET");
    expect(get).toMatch(/try\s*\{/);
    expect(get).toMatch(/getSessionUser\(\)/);
    // Session-42 (S42-P5): the containment upgrade, same as above.
    expect(allInsideTry(get, /getSessionUser\(\)/)).toBe(true);
    expect(get).toMatch(/ERR\.INTERNAL/);
  });
});

// ---------------------------------------------------------------------------
// Session-42 (S42-P1): the GET list routes join the envelope. The s37
// family closed PUT/DELETE/POST; the s41-P4 layer closed the shared
// session read; the 11 GET list handlers were the LAST raw reads — a
// SQLITE_BUSY-class failure during a list read answered a raw non-JSON
// 500 on each (the store degrades it to "Request failed (500)" instead
// of the house message). Per-route try/catch — NOT a HOC wrapper, which
// would break the handlerBlock slicing these pins (and every older
// family) rely on. The deliberate keeps: the (app) layout + signup page
// (honest 500 pages, the s41-P4 doctrine) and health (its own 503).
// ---------------------------------------------------------------------------

describe("session-42: the GET list routes hold every DB call inside the envelope (S42-P1)", () => {
  it.each([
    "src/app/api/contacts/route.ts",
    "src/app/api/leads/route.ts",
    "src/app/api/accounts/route.ts",
    "src/app/api/activities/route.ts",
    "src/app/api/events/route.ts",
    "src/app/api/opportunities/route.ts",
    "src/app/api/users/route.ts",
    "src/app/api/dashboard/route.ts",
    "src/app/api/reports/route.ts",
    "src/app/api/search/route.ts",
    "src/app/api/export/route.ts",
  ])("%s: GET holds every DB call inside try/catch → ERR.INTERNAL", (rel) => {
    const get = handlerBlock(route(rel), "GET");
    // Presence pairing (the §16ad vacuous-lesson): the handler must
    // actually read the DB before containment can mean anything…
    expect(get).toMatch(DB_CALL);
    // …then EVERY read sits inside a try→catch span…
    expect(allInsideTry(get, DB_CALL)).toBe(true);
    // …and the catch answers the envelope.
    expect(get).toMatch(/ERR\.INTERNAL/);
  });
});

// ---------------------------------------------------------------------------
// Session-42 (S42-P2): the strict-bool silent-clear family. The strict
// `=== true` idioms silently stored FALSE for a present non-boolean and
// silently CLEARED an existing true on PUT (LIVE-proven: a key account
// PUT {"isKey":"yes"} → 200 + isKey:false — the s41 silent-drop class,
// one type-shape over). isBadBool rejects only a PRESENT non-boolean;
// the UI writers are real checkbox booleans (or absent — the event
// dialog has no all-day control), so the surface is API-only.
// ---------------------------------------------------------------------------

describe("session-42: booleans reject the present-non-boolean class (S42-P2)", () => {
  it.each([
    // [route, verb, field, message]
    // Session-86 (M-86c2): the two isKey rows RETIRED with the stored
    // column + its write seams (the reference models no key-account
    // flag — its star rides the computed tier).
    ["src/app/api/events/route.ts", "POST", "allDay", "Invalid all-day flag"],
    ["src/app/api/events/[id]/route.ts", "PUT", "allDay", "Invalid all-day flag"],
  ])("%s %s: %s rejects present non-booleans (400 %s)", (rel, verb, field, message) => {
    const block = handlerBlock(route(rel), verb);
    expect(block).toMatch(guardCall("isBadBool", field));
    expect(block).toMatch(message);
  });
});

// ---------------------------------------------------------------------------
// Session-42 (S42-P3): activities/[id] PUT silently IGNORED contactId/
// accountId — no branch existed (the POST route accepts both), so an
// activity's account/contact links could never be re-assigned or cleared
// via the API and the caller's payload was dropped without error
// (LIVE-proven: PUT {"contactId":<id>} → 200 + contactId still null).
// The contacts/[id] FK shape, mirrored verbatim.
// ---------------------------------------------------------------------------

describe("session-42: activities/[id] PUT accepts contactId/accountId (S42-P3)", () => {
  it("the PUT guards + parses both FK fields (the contacts/[id] shape)", () => {
    const put = handlerBlock(route("src/app/api/activities/[id]/route.ts"), "PUT");
    expect(put).toMatch(guardCall("isBadFK", "contactId"));
    expect(put).toMatch(guardCall("isBadFK", "accountId"));
    expect(put).toMatch(/asFKId\(body\.contactId\)/);
    expect(put).toMatch(/asFKId\(body\.accountId\)/);
  });

  it("the PUT checks FK existence inside the try (the POST's own vocabulary)", () => {
    const put = handlerBlock(route("src/app/api/activities/[id]/route.ts"), "PUT");
    expect(put).toMatch(/db\.contact\.findUnique/);
    expect(put).toMatch(/Selected contact does not exist/);
    expect(put).toMatch(/db\.account\.findUnique/);
    expect(put).toMatch(/Selected company does not exist/);
  });
});

// ---------------------------------------------------------------------------
// Session-42 (S42-P4): contacts/[id] PUT {"status":""} silently RESET an
// inactive contact to "active" — the only optional-parse enum on PUT
// whose ?? default passes the membership check (LIVE-proven). The
// sibling-enum shape now: non-optional parse + membership (a present
// '' is a BAD value, not a clear).
// ---------------------------------------------------------------------------

describe("session-42: contacts/[id] PUT status \"\" is a 400, not a silent reset (S42-P4)", () => {
  it("the status parse is non-optional — no ?? \"active\" default can fire on a present value", () => {
    const put = handlerBlock(route("src/app/api/contacts/[id]/route.ts"), "PUT");
    // The silent-reset shape is gone…
    expect(put).not.toMatch(/asString\(body\.status,\s*\{[^}]*optional:\s*true[^}]*\}\)\s*\?\?\s*"active"/);
    // …replaced by the sibling-enum shape (non-optional parse).
    expect(put).toMatch(/const status = asString\(body\.status, \{ max: 20 \}\)/);
  });
});

// ---------------------------------------------------------------------------
// Session-42 (S42-P6): the bare-request period default — LIVE-discovered
// during the post-fix verification (the warm-up probe itself): a GET
// /api/reports (or /api/export?type=report) WITHOUT an explicit period
// returned 400 "Invalid period" — the `?? "quarter"` defaults were DEAD
// (non-optional asString(null) returns "", never undefined, and "" is
// not nullish). The documented default-quarter contract is unreachable
// for API consumers; the store always sends an explicit period, which
// is why no e2e ever tripped it. The s40 dead-?? shape with a real
// behavioral consequence.
// ---------------------------------------------------------------------------

describe("session-42: the bare-request period default is reachable (S42-P6)", () => {
  it.each([
    "src/app/api/reports/route.ts",
    "src/app/api/export/route.ts",
  ])("%s: a missing period param defaults to quarter (the optional parse)", (rel) => {
    const get = handlerBlock(route(rel), "GET");
    expect(get).toMatch(/asString\(url\.searchParams\.get\("period"\),\s*\{\s*optional:\s*true\s*\}\)\s*\?\?\s*"quarter"/);
  });
});

// ---------------------------------------------------------------------------
// Session-43 (S43-P1): Lead.contactId — the schema (prisma/schema.prisma)
// and the wire type (types/index.ts) carried the relation, but NO leads
// route accepted it: a contactId payload was silently dropped on BOTH
// verbs (LIVE-proven: POST {"name":…,"contactId":<real id>} → 200 +
// contactId:null — the N-42b shape one level up; activities was the same
// class, fixed s42-P3). The wire type has NO `contact` object, so the
// fix is the FK branch pair + the create-data field + the existence
// checks — no include changes.
// ---------------------------------------------------------------------------

describe("session-43: leads accept contactId on both verbs (S43-P1)", () => {
  it("the POST create data carries contactId (the dropped field stores now)", () => {
    const post = handlerBlock(route("src/app/api/leads/route.ts"), "POST");
    expect(post).toMatch(/isBadFK\(body\.contactId\)/);
    expect(post).toMatch(/asFKId\(body\.contactId\)/);
    // The create data itself must carry the parsed field (the silent
    // drop was exactly here: the payload parsed nowhere, stored nowhere).
    const createAt = post.indexOf("db.lead.create");
    expect(createAt).toBeGreaterThanOrEqual(0);
    expect(post.slice(createAt)).toMatch(/contactId/);
  });

  it("the PUT checks contactId existence inside the try (the POST's own vocabulary)", () => {
    const put = handlerBlock(route("src/app/api/leads/[id]/route.ts"), "PUT");
    expect(put).toMatch(/db\.contact\.findUnique/);
    expect(put).toMatch(/Selected contact does not exist/);
    // The parse-side branch too (a non-string FK is a 400, not a silent
    // coercion — the s37-P3 doctrine).
    expect(put).toMatch(guardCall("isBadFK", "contactId"));
    expect(put).toMatch(/asFKId\(body\.contactId\)/);
  });
});

// ---------------------------------------------------------------------------
// Session-43 (S43-P2): the dead-`??` enum-default sites — non-
// optional asString returns "" (never undefined), so `?? "<enum>"` can
// never fire and "" already 400s on the membership check below (the
// exact shape s42-P5 removed from settings). The removals are
// behavior-identical; the pins keep the dead fallbacks from creeping
// back (each row asserts the NON-OPTIONAL parse carries no `??`).
// Session-88 (N-88a1): the count re-derived — EIGHT rows stand after
// the s86 tier retirement (the N-87a1 row removal; the s43-era
// "×9"/"nine" titles drifted).
// ---------------------------------------------------------------------------

describe("session-43: the eight dead-?? enum defaults are gone (S43-P2)", () => {
  it.each([
    ["src/app/api/leads/[id]/route.ts", "stage"],
    ["src/app/api/activities/[id]/route.ts", "priority"],
    ["src/app/api/activities/[id]/route.ts", "type"],
    ["src/app/api/activities/[id]/route.ts", "status"],
    ["src/app/api/events/[id]/route.ts", "type"],
    ["src/app/api/events/[id]/route.ts", "status"],
    ["src/app/api/accounts/[id]/route.ts", "status"],
    // Session-87 (N-87a1): the accounts `tier` row retired — the tier
    // PUT block retired with the s86 computed-tier derivation (the
    // stored-field retirement); the row had been vacuously green since.
    ["src/app/api/contacts/[id]/route.ts", "priority"],
  ])("%s: asString(body.%s) carries no dead ?? fallback", (rel, field) => {
    const put = handlerBlock(route(rel), "PUT");
    // The non-optional parse (no options object) must not ride a `??` —
    // optional parses with `{ optional: true }` are NOT matched (their
    // ?? defaults are live code).
    expect(put).not.toMatch(new RegExp(`asString\\(body\\.${field}\\)\\s*\\?\\?`));
  });
});

// ---------------------------------------------------------------------------
// Session-43 (S43-P3): the settings defaults quartet — the trio lacked
// membership (LIVE-proven: {"defaultLeadStage":"banana-probe"} → 200 +
// saved verbatim; a poisoned default flows into the create dialogs'
// initial values and makes every subsequent create 400 confusingly —
// the free-text UI Inputs are the vector), and firstDayOfWeek lacked
// the isBadString guard its sibling quintet has. The firstDayOfWeek
// sibling shape, applied to the family.
// ---------------------------------------------------------------------------

describe("session-43: the settings defaults quartet completes (S43-P3)", () => {
  it("defaultLeadStage membership vs LEAD_STAGES (the create routes' own vocabulary)", () => {
    const put = handlerBlock(route("src/app/api/settings/route.ts"), "PUT");
    expect(put).toMatch(/LEAD_STAGES/);
    expect(put).toMatch(/Default lead stage must be a valid stage/);
  });

  it("defaultTier membership vs ACCOUNT_TIERS", () => {
    const put = handlerBlock(route("src/app/api/settings/route.ts"), "PUT");
    expect(put).toMatch(/ACCOUNT_TIERS/);
    expect(put).toMatch(/Default account tier must be A, B or C/);
  });

  it("calendarView membership vs the settings UI's own Select vocabulary", () => {
    const put = handlerBlock(route("src/app/api/settings/route.ts"), "PUT");
    expect(put).toMatch(/month/);
    // Session-72 (M-72c3): the invented agenda option retired — the
    // reference's Select ships exactly month/week (bundle-decoded).
    expect(put).toMatch(/Calendar view must be month or week/);
    expect(put).not.toMatch(/agenda/);
  });

  it("firstDayOfWeek gains the isBadString guard its sibling quintet has", () => {
    const put = handlerBlock(route("src/app/api/settings/route.ts"), "PUT");
    expect(put).toMatch(guardCall("isBadString", "firstDayOfWeek"));
    expect(put).toMatch(/Invalid first day of week/);
  });
});

// ---------------------------------------------------------------------------
// Session-43 (S43-P5): events GET from/to — asDate("garbage") →
// undefined → the window filter silently DROPPED (the caller asked for
// a window, got everything). The period precedent (400 on garbage)
// applied: a present-but-unparseable date param is a 400, not a silent
// filter drop. isBadDate semantics for URL params: absent (null)
// passes, empty "" passes (≡ absent, the house GET convention), a
// garbage string rejects.
// ---------------------------------------------------------------------------

describe("session-43: events GET from/to reject garbage (S43-P5)", () => {
  it("the from/to guards carry the isBadDate shape + the exact vocabulary", () => {
    const get = handlerBlock(route("src/app/api/events/route.ts"), "GET");
    expect(get).toMatch(/isBadDate\(fromRaw\)/);
    expect(get).toMatch(/Invalid from date/);
    expect(get).toMatch(/isBadDate\(toRaw\)/);
    expect(get).toMatch(/Invalid to date/);
  });
});

// ---------------------------------------------------------------------------
// Session-44 (S44-P1): Account.health — the last dead schema field
// end-to-end (the N-43a shape one model over). The schema
// (prisma/schema.prisma:62, default "Healthy"), the wire type
// (types/index.ts:31), the seed ("Healthy"/"At Risk"/"Needs Attention")
// and two UI readers (the accounts-page badge + the CSV Health column)
// all carried it, but NEITHER accounts verb accepted it — LIVE-proven:
// POST {"name":"…","health":"At Risk"} → 200 + health:"Healthy"; PUT
// {"health":"Needs Attention"} → 200 + health:"Healthy" (the payload
// silently dropped on BOTH verbs; the stored column frozen at its seed
// value forever). The fix: the ACCOUNT_HEALTH_STATUSES vocabulary +
// both verbs' branches (the accounts status/tier shapes).
// ---------------------------------------------------------------------------

describe("session-44: accounts accept health on both verbs (S44-P1)", () => {
  it("the POST guards + stores health (absent keeps the schema default)", () => {
    const post = handlerBlock(route("src/app/api/accounts/route.ts"), "POST");
    expect(post).toMatch(/isBadString\(body\.health\)/);
    expect(post).toMatch(/Invalid health status/);
    expect(post).toMatch(/ACCOUNT_HEALTH_STATUSES/);
    // The create-default semantics (the priority shape): absent/""/null →
    // "Healthy", a present garbage string 400s.
    expect(post).toMatch(/asString\(body\.health,\s*\{\s*optional:\s*true,\s*max:\s*20\s*\}\)\s*\?\?\s*"Healthy"/);
    expect(post).toMatch(/^\s*health,/m);
  });

  it("the PUT branch validates + assigns (present \"\" is a 400, absent is no-change)", () => {
    const put = handlerBlock(route("src/app/api/accounts/[id]/route.ts"), "PUT");
    expect(put).toMatch(/"health" in body/);
    expect(put).toMatch(/isBadString\(body\.health\)/);
    expect(put).toMatch(/Invalid health status/);
    expect(put).toMatch(/ACCOUNT_HEALTH_STATUSES/);
    // The s43-P2 narrow shape: a non-optional parse never returns
    // undefined, so `!health ||` is the live tsc narrow.
    expect(put).toMatch(/!health \|\|/);
    expect(put).toMatch(/data\.health = health/);
  });
});

// ---------------------------------------------------------------------------
// Session-44 (S44-P2): contacts POST silently dropped `status` — the PUT
// accepts it (s42-P4: isBadString + CONTACT_STATUSES membership, present
// "" is a 400) but the POST had no branch and no create-data field —
// LIVE-proven: POST {"name":"…","status":"inactive"} → 200 +
// status:"active" (every contact created "active" regardless of payload;
// the N-42b PUT-accepts-POST-drops mirror). The fix: the PUT's own
// vocabulary adapted to create-default semantics (the POST priority
// shape — absent/""/null keep "active", a present garbage string 400s).
// ---------------------------------------------------------------------------

describe("session-44: contacts POST accepts status (S44-P2)", () => {
  it("the POST guards + stores status (absent keeps the schema default)", () => {
    const post = handlerBlock(route("src/app/api/contacts/route.ts"), "POST");
    expect(post).toMatch(/isBadString\(body\.status\)/);
    expect(post).toMatch(/Invalid status/);
    expect(post).toMatch(/CONTACT_STATUSES/);
    expect(post).toMatch(/asString\(body\.status,\s*\{\s*optional:\s*true,\s*max:\s*20\s*\}\)\s*\?\?\s*"active"/);
    expect(post).toMatch(/^\s*status,/m);
  });
});

// ---------------------------------------------------------------------------
// Session-44 (S44-P6): the dead account include — the reports leads
// findMany fetched `account: {select: {name: true}}` but serializeLead
// unconditionally overwrote it with `account: null`, so the fetched name
// was NEVER delivered (the table renders name/source/stage only) — a
// wasted LEFT JOIN on every reports read. The owner include STAYS (it
// feeds the serializer's consumers).
// ---------------------------------------------------------------------------

describe("session-44: the reports leads findMany drops the dead account include (S44-P6)", () => {
  it("the leads query keeps the owner include and no longer fetches the discarded account name", () => {
    const src = route("src/app/api/reports/route.ts");
    const leadQueryAt = src.indexOf("db.lead.findMany");
    expect(leadQueryAt).toBeGreaterThanOrEqual(0);
    const leadQuery = src.slice(leadQueryAt, leadQueryAt + 400);
    expect(leadQuery).toMatch(/owner:\s*\{\s*select:\s*\{\s*id:\s*true,\s*name:\s*true,\s*avatarColor:\s*true\s*\}\s*\}/);
    expect(leadQuery).not.toMatch(/account:\s*\{/);
  });
});

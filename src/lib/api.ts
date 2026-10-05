// API envelope + guards for route handlers.
// Every handler returns { ok, data } | { ok, error: { code, message } }.

import { NextResponse } from "next/server";
import { getSessionUser, type SessionUser } from "./auth";

export type ApiError = { code: string; message: string };
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export function ok<T>(data: T, init?: number): NextResponse {
  return NextResponse.json({ ok: true, data } satisfies ApiResult<T>, { status: init ?? 200 });
}

export function fail(code: string, message: string, status = 400): NextResponse {
  return NextResponse.json({ ok: false, error: { code, message } } satisfies ApiResult<never>, {
    status,
  });
}

export const ERR = {
  UNAUTHORIZED: () => fail("UNAUTHORIZED", "Sign in required", 401),
  FORBIDDEN: () => fail("FORBIDDEN", "Not allowed", 403),
  NOT_FOUND: (what = "Record") => fail("NOT_FOUND", `${what} not found`, 404),
  BAD_REQUEST: (msg: string) => fail("BAD_REQUEST", msg, 400),
  // Session-67 (N-67h): the 429 family carries Retry-After consistently —
  // login used to hand-build its own (bypassing fail()) while the
  // siblings shipped no header at all. The optional param keeps the
  // zero-arg calls valid; the envelope shape is identical either way.
  RATE_LIMITED: (retryAfterSec?: number): NextResponse =>
    retryAfterSec === undefined
      ? fail("RATE_LIMITED", "Too many attempts. Try again later.", 429)
      : NextResponse.json(
          { ok: false, error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } } satisfies ApiResult<never>,
          { status: 429, headers: { "Retry-After": String(Math.max(1, retryAfterSec)) } },
        ),
  INTERNAL: () => fail("INTERNAL", "Something went wrong. Please try again.", 500),
};

/** Guard: returns the session user or a 401 response (callers must return it). */
export async function requireSession(): Promise<{ user: SessionUser } | { response: NextResponse }> {
  // Session-41 (S41-P4): the shared session read joined the envelope —
  // getSessionUser()'s findUnique is the one DB call EVERY protected route
  // makes, and a SQLITE_BUSY-class failure here used to answer a raw
  // non-JSON 500. The 401 path (no session / bad cookie) is unchanged.
  let user: SessionUser | null;
  try {
    user = await getSessionUser();
  } catch {
    return { response: ERR.INTERNAL() };
  }
  if (!user) return { response: ERR.UNAUTHORIZED() };
  return { user };
}

export function isGuarded(x: { user: SessionUser } | { response: NextResponse }): x is { response: NextResponse } {
  return "response" in x;
}

// ---- the auth-family body pre-gate (session-67, N-67d) ---------------------

/** Session-67 (N-67d): the declared-size ceiling for the public auth
 * routes' JSON bodies — the S36-P3 upload precedent extended to the
 * family that buffers req.json() with no default cap. The honest bodies
 * are tiny (email capped at 160 chars + password + a 6-digit code), so
 * 16KB is beyond generous. Documented limitation (inherited from the
 * upload gate): a chunked body without a Content-Length header bypasses
 * this check; the JSON parse's own failure mode stays the backstop.
 * Session-68 (F-68a2): the SAME ceiling + helper now gate the sessioned
 * CRUD family too (accounts/activities/contacts/events/leads x[root+
 * [id]] + settings + reset — placed after requireSession, before the
 * parse; the honest CRUD bodies are asString-capped fields, far below
 * the ceiling). */
export const MAX_AUTH_BODY_BYTES = 16 * 1024;

/** True when the request DECLARES a body larger than the auth ceiling —
 * call before `req.json()` so an oversized body is rejected without ever
 * being read into memory. */
export function isBodyTooLarge(req: Request): boolean {
  return Number(req.headers.get("content-length") ?? 0) > MAX_AUTH_BODY_BYTES;
}

// ---- hand-rolled validation helpers (no schema lib — scaffold style) -------

export function asString(v: unknown, { max = 500, optional = false } = {}): string | undefined {
  if (v === undefined || v === null) return optional ? undefined : "";
  if (typeof v !== "string") return optional ? undefined : "";
  const s = v.trim();
  if (s.length === 0) return optional ? undefined : "";
  return s.slice(0, max);
}

/** Session-37 (S37-P3): a PRESENT FK payload must be a string (or an
 *  explicit null). Non-string values used to ride asString's optional
 *  coercion to `undefined` → `null` — a SILENT FK clear on PUT. Routes
 *  pair this with a 400 ("Invalid company/owner/contact selection"). */
export function isBadFK(v: unknown): boolean {
  return v !== undefined && v !== null && typeof v !== "string";
}

/** Session-37 (S37-P3): FK id parse — null/""/whitespace → null (the
 *  explicit clear), a string → the trimmed id. Guard with isBadFK first:
 *  this helper silently clears non-strings by design (the asString
 *  semantics the selects' "" emissions rely on). */
export function asFKId(v: unknown): string | null {
  return asString(v, { optional: true }) ?? null;
}

/** Session-40 (S40-P1): the general present-non-string predicate —
 *  isBadFK's class, named for the non-FK fields it guards (email, phone,
 *  notes, status…). A PRESENT non-string used to ride asString's
 *  optional coercion to undefined → `?? null` — a SILENT field clear
 *  on PUT. Routes pair this with a 400 ("Invalid <thing>"). */
export function isBadString(v: unknown): boolean {
  return v !== undefined && v !== null && typeof v !== "string";
}

/** Session-40 (S40-P1): dates have a parseable shape, so the guard is
 *  stricter than isBadString — an UNPARSEABLE string is bad too
 *  (asDate("garbage") → undefined → `?? null` silently cleared the
 *  field). "" stays the explicit clear (the asFKId convention); a
 *  parseable string (ISO, date-only) passes. */
export function isBadDate(v: unknown): boolean {
  if (v === undefined || v === null || v === "") return false;
  if (typeof v !== "string") return true;
  return Number.isNaN(new Date(v).getTime());
}

/** Session-40 (S40-P1): Number()'s truthy/array edges are the hazard —
 *  Number(true)=1, Number([5])=5, Number([])=0, Number(" ")=0 — so a
 *  JSON boolean/array payload silently stored a number. Accepted: a
 *  finite number, or a numeric string (the UI's Number()/parseFloat
 *  shapes serialize through JSON as strings only when hand-written).
 *  "" stays absent (asNumber's own special case); a whitespace-only
 *  string is BAD (it would silently store 0). */
export function isBadNumber(v: unknown): boolean {
  if (v === undefined || v === null || v === "") return false;
  if (typeof v === "number") return !Number.isFinite(v);
  if (typeof v === "string") return v.trim() === "" || !Number.isFinite(Number(v));
  return true;
}

/** Session-42 (S42-P2): the strict-bool silent-clear family —
 *  `data.isKey = body.isKey === true` silently stored FALSE for a
 *  present non-boolean ({"isKey":"yes"} → 200 + false) and silently
 *  CLEARED an existing true on PUT (a key account de-keyed without an
 *  error — LIVE-proven). The isBadString shape one type over: only a
 *  PRESENT non-boolean is bad; absent/null keep the false-default
 *  (POST) and no-change (PUT) semantics. The UI writers are real
 *  checkbox booleans (Radix onCheckedChange) or absent — the surface
 *  is API-only. */
export function isBadBool(v: unknown): boolean {
  return v !== undefined && v !== null && typeof v !== "boolean";
}

export function asNumber(v: unknown): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function asInt(v: unknown): number | undefined {
  const n = asNumber(v);
  return n === undefined ? undefined : Math.trunc(n);
}

export function asDate(v: unknown): Date | undefined {
  if (typeof v !== "string" || !v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

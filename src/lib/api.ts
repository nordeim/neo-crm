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
  RATE_LIMITED: () => fail("RATE_LIMITED", "Too many attempts. Try again later.", 429),
  INTERNAL: () => fail("INTERNAL", "Something went wrong. Please try again.", 500),
};

/** Guard: returns the session user or a 401 response (callers must return it). */
export async function requireSession(): Promise<{ user: SessionUser } | { response: NextResponse }> {
  const user = await getSessionUser();
  if (!user) return { response: ERR.UNAUTHORIZED() };
  return { user };
}

export function isGuarded(x: { user: SessionUser } | { response: NextResponse }): x is { response: NextResponse } {
  return "response" in x;
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

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

export function asRequiredString(v: unknown, field: string, { max = 500 } = {}): string | null {
  if (typeof v !== "string" || v.trim().length === 0) return null;
  if (field === "") return null;
  return v.trim().slice(0, max);
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

export function asOneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

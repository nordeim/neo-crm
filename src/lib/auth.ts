// Hand-rolled session auth (no NextAuth, no JWTs — matches the scaffold
// family conventions): scrypt password hashes + HMAC-SHA256 signed
// stateless cookie (`neo_session`, 7-day TTL).
//
// Cookie payload: base64url(JSON{uid,iat,exp}) + "." + hex HMAC.

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";

export const SESSION_COOKIE = "neo_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const DEV_SECRET = "neo-crm-dev-only-insecure-secret";

// Session-63 (N-63g): the short-secret case used to fall back as
// silently as the unset case — production would ship forgeable
// sessions with no signal. Warn ONCE: secret() rides every session op.
let warnedInsecureSecret = false;

function secret(): string {
  const env = process.env.AUTH_SECRET;
  if (env && env.length >= 16) return env;
  if (process.env.NODE_ENV === "production" && !warnedInsecureSecret) {
    warnedInsecureSecret = true;
    console.warn(
      "[auth] AUTH_SECRET is missing or shorter than 16 chars — falling back to the insecure dev-only secret; sessions are forgeable. Generate one with: openssl rand -hex 32",
    );
  }
  return DEV_SECRET;
}

// ---- password hashing ------------------------------------------------------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expected] = parts;
  const actual = scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(actual, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ---- session token ---------------------------------------------------------

export interface SessionPayload {
  uid: string;
  iat: number;
  exp: number;
}

function b64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function unb64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

export function signSession(uid: string, now = Date.now()): string {
  const payload: SessionPayload = {
    uid,
    iat: now,
    exp: now + SESSION_TTL_MS,
  };
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret()).update(body).digest("hex");
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null, now = Date.now()): SessionPayload | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(body).digest("hex");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(unb64url(body)) as SessionPayload;
    if (typeof payload.uid !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---- request helpers -------------------------------------------------------

export async function setSessionCookie(uid: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, signSession(uid), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  // Session-67 (N-67j): the flag family mirrors the set-side twin —
  // deletion only ever needed name+path match, but a future cookie-policy
  // change now stays consistent across set/clear by construction.
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
  // Session-30 (S30-P3): carried so the topbar avatar can render the
  // uploaded photo (the reference's profile_picture).
  photoUrl: string | null;
  role: string;
}

/** Resolve the signed-in user from the request cookie, or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const user = await db.user.findUnique({ where: { id: payload.uid } });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarColor: user.avatarColor,
    photoUrl: user.photoUrl,
    role: user.role,
  };
}

import { db } from "@/lib/db";
import { ok, fail, ERR, asString } from "@/lib/api";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { clientKey, rateLimit, sweepRateLimits } from "@/lib/rate-limit";
import { isVerificationPending, verificationRequiredMessage } from "@/lib/verification";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const limit = rateLimit(`login:${clientKey(req)}`, 10, 15 * 60 * 1000);
  sweepRateLimits();
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const email = (asString(body.email) ?? "").toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return ERR.BAD_REQUEST("Email and password are required");

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    // Session-21 (S21-P1): the reference's banner text — "Invalid email or
    // password" (ours said "Incorrect…"; wrong-password probes on both apps).
    return fail("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  // Session-21 (S21-P5): an unverified account cannot sign in — the
  // reference answers "Please verify your email before logging in. Check
  // your email for the verification code." (live-verified with a throwaway
  // signup). Pre-session-21 rows (verificationExpiresAt null) and expired
  // codes pass through — the seeded demo account predates the flow.
  if (isVerificationPending(user.verificationExpiresAt)) {
    return fail("VERIFICATION_REQUIRED", verificationRequiredMessage(), 403);
  }

  await setSessionCookie(user.id);
  return ok({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarColor: user.avatarColor,
    role: user.role,
  });
}

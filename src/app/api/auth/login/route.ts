import { db } from "@/lib/db";
import { ok, fail, ERR, asString, isBodyTooLarge } from "@/lib/api";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { clientKey, rateLimit, sweepRateLimits } from "@/lib/rate-limit";
import { isVerificationPending, verificationRequiredMessage } from "@/lib/verification";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const limit = rateLimit(`login:${clientKey(req)}`, 10, 15 * 60 * 1000);
  sweepRateLimits();
  // Session-67 (N-67h): the 429 joins the ERR family — the hand-built
  // NextResponse block is retired; the Retry-After header it carried
  // moves into ERR.RATE_LIMITED so every auth route ships it.
  if (!limit.allowed) return ERR.RATE_LIMITED(limit.retryAfterSec);

  // Session-67 (N-67d): the declared-size pre-gate BEFORE the parse —
  // req.json() buffers with no default cap in App Router handlers.
  if (isBodyTooLarge(req)) return ERR.BAD_REQUEST("Request body too large");

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  // Session-63 (N-63i): the email cap joins the 160 family (signup/
  // resend/verify) — asString TRUNCATES, so a >160-char email stored
  // truncated by signup could never log in under the old default (500).
  const email = (asString(body.email, { max: 160 }) ?? "").toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return ERR.BAD_REQUEST("Email and password are required");

  // Session-40 (S40-P5): the read + verification + cookie-set tail
  // joins the envelope — this was the ONLY auth-route DB read left
  // unwrapped (a SQLITE_BUSY-class failure answered a raw non-JSON
  // 500; signup/verify/resend wrapped theirs in s37). The returns
  // inside the try are the handler's own responses — the catch only
  // fires on a thrown DB failure.
  try {
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
  } catch {
    return ERR.INTERNAL();
  }
}

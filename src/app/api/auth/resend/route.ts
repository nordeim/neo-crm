import { db } from "@/lib/db";
import { ok, ERR, asString } from "@/lib/api";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { VERIFICATION_TTL_MS, isVerificationPending, verificationResentMessage } from "@/lib/verification";
import { generateVerificationCode, hashVerificationCode } from "@/lib/verification-server";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/resend — session-21 (S21-P5), the verify-email view's
 * "Didn't receive the code? Resend". The reference answers with the info
 * banner "New verification code sent to your email" (live-verified) and
 * the resend resets the attempts ladder (the lockout message names the
 * resend as the recovery path). Like the signup route, the fresh code is
 * stored hashed and logged to the SERVER console — never shipped to the
 * client.
 */
export async function POST(req: Request) {
  const limit = rateLimit(`resend:${clientKey(req)}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) return ERR.RATE_LIMITED();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const email = (asString(body.email, { max: 160 }) ?? "").toLowerCase();
  if (!email) return ERR.BAD_REQUEST("Email is required");

  // Session-37 (S37-P1): the auth family joins the envelope — the
  // findUnique/update failures stay inside { ok, error }.
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.verificationCodeHash || !isVerificationPending(user.verificationExpiresAt)) {
      // Unknown account or nothing to resend: answer with the same info
      // banner (the reference's non-leaking posture) — a rate-limited no-op.
      return ok({ resent: true, message: verificationResentMessage() });
    }

    const code = generateVerificationCode();
    await db.user.update({
      where: { id: user.id },
      data: {
        verificationCodeHash: hashVerificationCode(code),
        verificationAttempts: 0,
        verificationExpiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
      },
    });

    console.info(`[verification] code for ${email}: ${code} (expires in 15 minutes)`);

    return ok({ resent: true, message: verificationResentMessage() });
  } catch {
    return ERR.INTERNAL();
  }
}

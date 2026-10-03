import { db } from "@/lib/db";
import { ok, ERR, asString } from "@/lib/api";
import { hashPassword } from "@/lib/auth";
import { clientKey, rateLimit, sweepRateLimits } from "@/lib/rate-limit";
import { VERIFICATION_TTL_MS } from "@/lib/verification";
import { generateVerificationCode, hashVerificationCode } from "@/lib/verification-server";

export const dynamic = "force-dynamic";

const NAME_COLORS = ["#2563eb", "#0891b2", "#7c3aed", "#059669", "#d97706", "#dc2626", "#db2777"];

/** Derives the account name from the email's local part — the reference's
 *  signup form collects NO name (Email / Password / Confirm Password only,
 *  DOM-verified), so the account carries the local part until edited. */
function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return email;
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function POST(req: Request) {
  const limit = rateLimit(`signup:${clientKey(req)}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) return ERR.RATE_LIMITED();
  // Session-38 (S38-P6): the opportunistic bucket sweep — the audit
  // found it ran ONLY from login, so the signup/verify/resend buckets
  // were cleaned only when someone next logged in (bounded, but
  // dishonest; login's own placement, mirrored here).
  sweepRateLimits();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  // Session-21 (S21-P4): the reference's signup form has NO name field —
  // the name is derived from the email local part. The optional body name
  // stays accepted (API compatibility) but is no longer required.
  // Session-38 (S38-P1): the parse is OPTIONAL — asString's non-optional
  // form returns "" for an absent name, and "" ?? fallback keeps "" (an
  // empty string is not nullish), so the nameFromEmail fallback was DEAD
  // CODE for 16 sessions: every UI signup stored name: "" (the "?"
  // avatars). The optional form returns undefined, so the ?? fires.
  const name = asString(body.name, { max: 80, optional: true }) ?? nameFromEmail(asString(body.email, { max: 160 }) ?? "");
  const email = (asString(body.email, { max: 160 }) ?? "").toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ERR.BAD_REQUEST("Enter a valid email address");
  if (password.length < 8) return ERR.BAD_REQUEST("Password must be at least 8 characters");

  // Session-37 (S37-P1): the auth family joins the envelope — the
  // findUnique/count/create failures (SQLITE_BUSY-class) stay inside
  // { ok, error } instead of a raw non-JSON 500. The validation prefixes
  // above touch no DB and stay outside.
  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      // Session-21 (S21-P6): the reference's banner text — "A user with this
      // email already exists" (ours said "An account with…"; existing-email
      // probes on both apps).
      return ERR.BAD_REQUEST("A user with this email already exists");
    }

    const count = await db.user.count();

    // Session-21 (S21-P5): signup no longer signs the account in — it mints
    // a 6-digit verification code and the login card swaps to the verify
    // view ("Verify your email", live-verified on the reference). The code
    // is stored HASHED (scrypt, the auth layer's format) with a 15-minute
    // expiry; a self-hosted deployment has no mail transport, so the code
    // is logged to the SERVER console for the demo workflow (never shipped
    // to the client, never committed).
    const code = generateVerificationCode();
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        avatarColor: NAME_COLORS[count % NAME_COLORS.length],
        role: count === 0 ? "admin" : "rep",
        verificationCodeHash: hashVerificationCode(code),
        verificationAttempts: 0,
        verificationExpiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
      },
    });

    console.info(`[verification] code for ${email}: ${code} (expires in 15 minutes)`);

    return ok({ id: user.id, email: user.email, requiresVerification: true });
  } catch {
    return ERR.INTERNAL();
  }
}

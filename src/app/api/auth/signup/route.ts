import { db } from "@/lib/db";
import { ok, ERR, asString } from "@/lib/api";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const NAME_COLORS = ["#2563eb", "#0891b2", "#7c3aed", "#059669", "#d97706", "#dc2626", "#db2777"];

export async function POST(req: Request) {
  const limit = rateLimit(`signup:${clientKey(req)}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) return ERR.RATE_LIMITED();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const name = asString(body.name, { max: 80 });
  const email = (asString(body.email, { max: 160 }) ?? "").toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!name) return ERR.BAD_REQUEST("Name is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ERR.BAD_REQUEST("Enter a valid email address");
  if (password.length < 8) return ERR.BAD_REQUEST("Password must be at least 8 characters");

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return ERR.BAD_REQUEST("An account with this email already exists");

  const count = await db.user.count();
  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      avatarColor: NAME_COLORS[count % NAME_COLORS.length],
      role: count === 0 ? "admin" : "rep",
    },
  });

  await setSessionCookie(user.id);
  return ok({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarColor: user.avatarColor,
    role: user.role,
  });
}

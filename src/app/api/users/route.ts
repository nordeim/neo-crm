import { db } from "@/lib/db";
import { asString, ok, isGuarded, requireSession, ERR } from "@/lib/api";

export const dynamic = "force-dynamic";

/** Owners list (for filter dropdowns + rep leaderboards). */
export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const users = await db.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, email: true, name: true, avatarColor: true, photoUrl: true, role: true },
  });
  return ok(users);
}

/** Update the signed-in user's own profile (Full Name + photo — email/role
 * are fixed). Session-30 (S30-P3): the photoUrl mirrors the reference's
 * updateMe({display_name, profile_picture}) — an explicit null clears it,
 * an absent key leaves it untouched. */
export async function PATCH(request: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid JSON body");

  const name = asString(body.name, { max: 60 });
  if (!name || name.trim().length < 2) return ERR.BAD_REQUEST("Name must be at least 2 characters");

  // photoUrl: string | null | undefined (absent = keep the stored value).
  let photoUrl: string | null | undefined;
  if (body.photoUrl === null) photoUrl = null;
  else if (typeof body.photoUrl === "string") photoUrl = body.photoUrl.slice(0, 300);

  const user = await db.user.update({
    where: { id: guard.user.id },
    data: { name: name.trim(), ...(photoUrl !== undefined ? { photoUrl } : {}) },
    select: { id: true, email: true, name: true, avatarColor: true, photoUrl: true, role: true },
  });
  return ok(user);
}

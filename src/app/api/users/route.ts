import { db } from "@/lib/db";
import { ok, isGuarded, requireSession } from "@/lib/api";

export const dynamic = "force-dynamic";

/** Owners list (for filter dropdowns + rep leaderboards). */
export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const users = await db.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, email: true, name: true, avatarColor: true, role: true },
  });
  return ok(users);
}

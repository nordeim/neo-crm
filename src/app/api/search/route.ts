import { db } from "@/lib/db";
import { ok, ERR, asString, isGuarded, requireSession } from "@/lib/api";

export const dynamic = "force-dynamic";

/** Global "Search Anything..." — name/email/company across the big three. */
export async function GET(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const url = new URL(req.url);
  const q = (asString(url.searchParams.get("q"), { max: 80 }) ?? "").toLowerCase();
  if (q.length < 2) return ok({ accounts: [], contacts: [], leads: [] });

  // Session-42 (S42-P1): the read family joined the envelope — the
  // null-guard answers the { ok, error } envelope on failure.
  const rows = await (async () => {
    try {
      return await Promise.all([
        db.account.findMany({
          where: {
            OR: [
              { name: { contains: q } },
              { industry: { contains: q } },
              { email: { contains: q } },
              { website: { contains: q } },
            ],
          },
          take: 5,
          orderBy: { name: "asc" },
        }),
        db.contact.findMany({
          where: {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
              { company: { contains: q } },
              { position: { contains: q } },
            ],
          },
          take: 5,
          orderBy: { name: "asc" },
        }),
        db.lead.findMany({
          where: {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
              { company: { contains: q } },
            ],
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
        }),
      ]);
    } catch {
      return null;
    }
  })();
  if (!rows) return ERR.INTERNAL();
  const [accounts, contacts, leads] = rows;

  return ok({ accounts, contacts, leads });
}

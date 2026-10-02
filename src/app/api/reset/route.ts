import { db } from "@/lib/db";
import { ok, ERR, isGuarded, requireSession } from "@/lib/api";

export const dynamic = "force-dynamic";

/** Destructive reset of all domain data (users and settings survive). */
export async function POST(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const body = (await req.json().catch(() => null)) as { confirm?: string } | null;
  if (!body || body.confirm !== "RESET") {
    return ERR.BAD_REQUEST('Type "RESET" to confirm');
  }

  await db.activity.deleteMany();
  await db.event.deleteMany();
  await db.lead.deleteMany();
  // Session-31: the reference's reset wipes opportunities too (its confirm
  // message has said "opportunities" since the s26 decode).
  await db.opportunity.deleteMany();
  await db.contact.deleteMany();
  await db.account.deleteMany();
  await db.savedReport.deleteMany();

  return ok({ reset: true });
}

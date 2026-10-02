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

  // Session-36 (S36-P2): the seven deleteMany calls run INSIDE one
  // $transaction — a mid-chain failure used to leave a PARTIAL wipe plus a
  // raw non-envelope 500; now the wipe is atomic and the failure path is
  // envelope-held.
  try {
    await db.$transaction([
      db.activity.deleteMany(),
      db.event.deleteMany(),
      db.lead.deleteMany(),
      // Session-31: the reference's reset wipes opportunities too (its confirm
      // message has said "opportunities" since the s26 decode).
      db.opportunity.deleteMany(),
      db.contact.deleteMany(),
      db.account.deleteMany(),
      db.savedReport.deleteMany(),
    ]);

    return ok({ reset: true });
  } catch {
    return ERR.INTERNAL();
  }
}

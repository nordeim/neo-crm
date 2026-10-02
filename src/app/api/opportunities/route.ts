import { db } from "@/lib/db";
import { ok, isGuarded, requireSession } from "@/lib/api";

export const dynamic = "force-dynamic";

// Session-31 (S31-P1): the Opportunity list route — the read-only mirror of
// the reference's rt.entities.Opportunity.list("-created_date"). The
// reference ships NO create/edit UI for opportunities anywhere (its leads
// "Convert to Opportunity" item is dead — no onClick; no New Opportunity
// dialog exists), so this route is LIST-ONLY by design; the reset route
// wipes them alongside the other entities.
export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const opportunities = await db.opportunity.findMany({
    orderBy: { createdAt: "desc" },
  });
  return ok(opportunities);
}

import { db } from "@/lib/db";
import { ok, ERR, asString, asNumber, asDate, isGuarded, requireSession } from "@/lib/api";
import { LEAD_STAGES, LEAD_SOURCES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      account: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
    },
  });
  return ok(leads);
}

export async function POST(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const name = asString(body.name, { max: 120 });
  if (!name) return ERR.BAD_REQUEST("Lead name is required");

  const stage = asString(body.stage, { optional: true }) ?? "new";
  if (!(LEAD_STAGES as readonly string[]).includes(stage)) return ERR.BAD_REQUEST("Invalid stage");

  const source = asString(body.source, { optional: true, max: 40 }) ?? null;

  const ownerId = asString(body.ownerId, { optional: true }) ?? null;
  if (ownerId) {
    const owner = await db.user.findUnique({ where: { id: ownerId } });
    if (!owner) return ERR.BAD_REQUEST("Selected owner does not exist");
  }

  const accountId = asString(body.accountId, { optional: true }) ?? null;
  if (accountId) {
    const account = await db.account.findUnique({ where: { id: accountId } });
    if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
  }

  const closed = stage === "won" || stage === "lost";
  const lead = await db.lead.create({
    data: {
      name,
      email: asString(body.email, { optional: true, max: 160 }) ?? null,
      phone: asString(body.phone, { optional: true, max: 40 }) ?? null,
      company: asString(body.company, { optional: true, max: 120 }) ?? null,
      value: asNumber(body.value) ?? 0,
      stage,
      source,
      status: closed ? (stage === "won" ? "closed_won" : "closed_lost") : "open",
      expectedCloseDate: asDate(body.expectedCloseDate) ?? null,
      closedAt: closed ? new Date() : null,
      nextFollowUp: asDate(body.nextFollowUp) ?? null,
      accountId,
      ownerId,
    },
    include: {
      account: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
    },
  });
  return ok(lead);
}

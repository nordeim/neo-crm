import { db } from "@/lib/db";
import { ok, ERR, asString, asNumber, asDate, isGuarded, requireSession } from "@/lib/api";
import { LEAD_STAGES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing) return ERR.NOT_FOUND("Lead");

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const data: Record<string, unknown> = {};
  if ("name" in body) {
    const name = asString(body.name, { max: 120 });
    if (!name) return ERR.BAD_REQUEST("Lead name is required");
    data.name = name;
  }
  if ("email" in body) data.email = asString(body.email, { optional: true, max: 160 }) ?? null;
  if ("phone" in body) data.phone = asString(body.phone, { optional: true, max: 40 }) ?? null;
  if ("company" in body) data.company = asString(body.company, { optional: true, max: 120 }) ?? null;
  if ("value" in body) data.value = asNumber(body.value) ?? 0;
  if ("source" in body) data.source = asString(body.source, { optional: true, max: 40 }) ?? null;
  if ("accountId" in body) data.accountId = asString(body.accountId, { optional: true }) ?? null;
  if ("ownerId" in body) data.ownerId = asString(body.ownerId, { optional: true }) ?? null;
  if ("expectedCloseDate" in body) data.expectedCloseDate = asDate(body.expectedCloseDate) ?? null;
  if ("nextFollowUp" in body) data.nextFollowUp = asDate(body.nextFollowUp) ?? null;
  if ("stage" in body) {
    const stage = asString(body.stage) ?? "new";
    if (!(LEAD_STAGES as readonly string[]).includes(stage)) return ERR.BAD_REQUEST("Invalid stage");
    data.stage = stage;
    const closed = stage === "won" || stage === "lost";
    data.status = closed ? (stage === "won" ? "closed_won" : "closed_lost") : "open";
    if (closed && !existing.closedAt) data.closedAt = new Date();
    if (!closed && existing.closedAt) data.closedAt = null;
  }

  // Session-35 (S35-P5): FK existence guards on PUT — the POST-side
  // vocabulary — plus the envelope-held failure path (P2003 and every
  // other DB failure stay inside the { ok, error } envelope).
  try {
    if (typeof data.accountId === "string" && data.accountId) {
      const account = await db.account.findUnique({ where: { id: data.accountId } });
      if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
    }
    if (typeof data.ownerId === "string" && data.ownerId) {
      const owner = await db.user.findUnique({ where: { id: data.ownerId } });
      if (!owner) return ERR.BAD_REQUEST("Selected owner does not exist");
    }
    const lead = await db.lead.update({
      where: { id },
      data,
      include: {
        account: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, avatarColor: true } },
      },
    });
    return ok(lead);
  } catch {
    return ERR.INTERNAL();
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing) return ERR.NOT_FOUND("Lead");

  await db.lead.delete({ where: { id } });
  return ok({ deleted: id });
}

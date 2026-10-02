import { db } from "@/lib/db";
import { ok, ERR, asString, asNumber, asInt, isGuarded, requireSession } from "@/lib/api";
import { ACCOUNT_STATUSES, ACCOUNT_TIERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const data: Record<string, unknown> = {};
  if ("name" in body) {
    const name = asString(body.name, { max: 120 });
    if (!name) return ERR.BAD_REQUEST("Account name is required");
    data.name = name;
  }
  if ("industry" in body) data.industry = asString(body.industry, { optional: true, max: 80 }) ?? null;
  if ("email" in body) data.email = asString(body.email, { optional: true, max: 160 }) ?? null;
  if ("phone" in body) data.phone = asString(body.phone, { optional: true, max: 40 }) ?? null;
  if ("website" in body) data.website = asString(body.website, { optional: true, max: 200 }) ?? null;
  if ("annualRevenue" in body) data.annualRevenue = asNumber(body.annualRevenue) ?? null;
  if ("employees" in body) data.employees = asInt(body.employees) ?? null;
  if ("isKey" in body) data.isKey = body.isKey === true;
  if ("ownerId" in body) data.ownerId = asString(body.ownerId, { optional: true }) ?? null;
  if ("status" in body) {
    const status = asString(body.status) ?? "active";
    if (!(ACCOUNT_STATUSES as readonly string[]).includes(status)) return ERR.BAD_REQUEST("Invalid status");
    data.status = status;
  }
  if ("tier" in body) {
    const tier = asString(body.tier) ?? "B";
    if (!(ACCOUNT_TIERS as readonly string[]).includes(tier)) return ERR.BAD_REQUEST("Invalid tier");
    data.tier = tier;
  }

  // Session-35 (S35-P5): FK existence guard on PUT — the POST-side
  // vocabulary — plus the envelope-held failure path. Session-36 (S36-P2):
  // the existence fetch moved INSIDE the try.
  try {
    const existing = await db.account.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Account");
    if (typeof data.ownerId === "string" && data.ownerId) {
      const owner = await db.user.findUnique({ where: { id: data.ownerId } });
      if (!owner) return ERR.BAD_REQUEST("Selected owner does not exist");
    }
    const account = await db.account.update({
      where: { id },
      data,
      include: { owner: { select: { id: true, name: true, avatarColor: true } } },
    });
    return ok(account);
  } catch {
    return ERR.INTERNAL();
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  // Session-36 (S36-P2): the delete is envelope-held.
  try {
    const existing = await db.account.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Account");

    await db.account.delete({ where: { id } });
    return ok({ deleted: id });
  } catch {
    return ERR.INTERNAL();
  }
}

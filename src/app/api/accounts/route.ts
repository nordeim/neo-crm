import { db } from "@/lib/db";
import { ok, ERR, asString, asNumber, asInt, asDate, isGuarded, requireSession } from "@/lib/api";
import { ACCOUNT_STATUSES, ACCOUNT_TIERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const accounts = await db.account.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      owner: { select: { id: true, name: true, avatarColor: true } },
      _count: { select: { contacts: true, leads: true, activities: true } },
    },
  });
  return ok(accounts);
}

export async function POST(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const name = asString(body.name, { max: 120 });
  if (!name) return ERR.BAD_REQUEST("Account name is required");

  const tier = asString(body.tier, { optional: true }) ?? "B";
  if (!(ACCOUNT_TIERS as readonly string[]).includes(tier)) return ERR.BAD_REQUEST("Invalid tier");

  const status = asString(body.status, { optional: true }) ?? "active";
  if (!(ACCOUNT_STATUSES as readonly string[]).includes(status)) return ERR.BAD_REQUEST("Invalid status");

  const ownerId = asString(body.ownerId, { optional: true }) ?? null;
  if (ownerId) {
    const owner = await db.user.findUnique({ where: { id: ownerId } });
    if (!owner) return ERR.BAD_REQUEST("Selected owner does not exist");
  }

  const account = await db.account.create({
    data: {
      name,
      industry: asString(body.industry, { optional: true, max: 80 }) ?? null,
      email: asString(body.email, { optional: true, max: 160 }) ?? null,
      phone: asString(body.phone, { optional: true, max: 40 }) ?? null,
      website: asString(body.website, { optional: true, max: 200 }) ?? null,
      annualRevenue: asNumber(body.annualRevenue) ?? null,
      employees: asInt(body.employees) ?? null,
      tier,
      isKey: body.isKey === true,
      status,
      ownerId,
      lastActivityAt: new Date(),
    },
    include: { owner: { select: { id: true, name: true, avatarColor: true } } },
  });
  return ok(account);
}

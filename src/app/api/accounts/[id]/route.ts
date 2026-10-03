import { db } from "@/lib/db";
import { ok, ERR, asString, asNumber, asInt, asFKId, isBadFK, isBadString, isBadNumber, isBadBool, isGuarded, requireSession } from "@/lib/api";
import { ACCOUNT_STATUSES, ACCOUNT_TIERS, ACCOUNT_HEALTH_STATUSES } from "@/lib/constants";

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
  // Session-40 (S40-P2): the silent-clear family — isBadFK's class,
  // one parse-shape over (a present non-string rode the optional
  // coercion to null on PUT).
  if ("industry" in body) {
    if (isBadString(body.industry)) return ERR.BAD_REQUEST("Invalid industry");
    data.industry = asString(body.industry, { optional: true, max: 80 }) ?? null;
  }
  if ("email" in body) {
    if (isBadString(body.email)) return ERR.BAD_REQUEST("Invalid email");
    data.email = asString(body.email, { optional: true, max: 160 }) ?? null;
  }
  if ("phone" in body) {
    if (isBadString(body.phone)) return ERR.BAD_REQUEST("Invalid phone number");
    data.phone = asString(body.phone, { optional: true, max: 40 }) ?? null;
  }
  if ("website" in body) {
    if (isBadString(body.website)) return ERR.BAD_REQUEST("Invalid website");
    data.website = asString(body.website, { optional: true, max: 200 }) ?? null;
  }
  if ("annualRevenue" in body) {
    // Number()'s truthy/array edges silently stored a number before.
    if (isBadNumber(body.annualRevenue)) return ERR.BAD_REQUEST("Invalid annual revenue");
    data.annualRevenue = asNumber(body.annualRevenue) ?? null;
  }
  if ("employees" in body) {
    if (isBadNumber(body.employees)) return ERR.BAD_REQUEST("Invalid employee count");
    data.employees = asInt(body.employees) ?? null;
  }
  // Session-42 (S42-P2): the strict-bool silent-clear family — a
  // present non-boolean used to silently CLEAR an existing true (a key
  // account de-keyed without an error — LIVE-proven).
  if ("isKey" in body) {
    if (isBadBool(body.isKey)) return ERR.BAD_REQUEST("Invalid key account");
    data.isKey = body.isKey === true;
  }
  // Session-37 (S37-P3): a non-string FK payload is a 400, not a silent
  // coercion to null (the silent FK clear on PUT).
  if ("ownerId" in body) {
    if (isBadFK(body.ownerId)) return ERR.BAD_REQUEST("Invalid owner selection");
    data.ownerId = asFKId(body.ownerId);
  }
  if ("status" in body) {
    // Session-43 (S43-P2): the dead `?? "active"` / `?? "B"` removed
    // (the s42-P5 shape — non-optional asString returns "", never
    // undefined; the fallbacks could never fire).
    const status = asString(body.status);
    if (!status || !(ACCOUNT_STATUSES as readonly string[]).includes(status)) return ERR.BAD_REQUEST("Invalid status");
    data.status = status;
  }
  if ("tier" in body) {
    const tier = asString(body.tier);
    if (!tier || !(ACCOUNT_TIERS as readonly string[]).includes(tier)) return ERR.BAD_REQUEST("Invalid tier");
    data.tier = tier;
  }
  // Session-44 (S44-P1): health joins the PUT vocabulary — the badge's
  // stored value was frozen at its seed forever (neither verb accepted a
  // health payload). Present "" is the sibling enums' 400 (a required
  // enum on a defaulted column — a bad value, not a clear); absent is
  // no-change.
  if ("health" in body) {
    if (isBadString(body.health)) return ERR.BAD_REQUEST("Invalid health status");
    const health = asString(body.health, { max: 20 });
    if (!health || !(ACCOUNT_HEALTH_STATUSES as readonly string[]).includes(health)) {
      return ERR.BAD_REQUEST("Invalid health status");
    }
    data.health = health;
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

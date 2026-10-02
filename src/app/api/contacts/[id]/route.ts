import { db } from "@/lib/db";
import { ok, ERR, asString, isGuarded, requireSession } from "@/lib/api";
import { CONTACT_PRIORITIES, CONTACT_PRIORITIES_REF, CONTACT_ROLES, ENGAGEMENT_LEVELS, COMPANY_SIZES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  const existing = await db.contact.findUnique({ where: { id } });
  if (!existing) return ERR.NOT_FOUND("Contact");

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const data: Record<string, unknown> = {};
  if ("name" in body) {
    const name = asString(body.name, { max: 120 });
    if (!name) return ERR.BAD_REQUEST("Name is required");
    data.name = name;
  }
  if ("email" in body) {
    const email = asString(body.email, { optional: true, max: 160 }) ?? null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ERR.BAD_REQUEST("Enter a valid email address");
    }
    data.email = email;
  }
  if ("phone" in body) data.phone = asString(body.phone, { optional: true, max: 40 }) ?? null;
  if ("company" in body) data.company = asString(body.company, { optional: true, max: 120 }) ?? null;
  if ("position" in body) data.position = asString(body.position, { optional: true, max: 80 }) ?? null;
  if ("source" in body) data.source = asString(body.source, { optional: true, max: 40 }) ?? null;
  if ("accountId" in body) data.accountId = asString(body.accountId, { optional: true }) ?? null;
  if ("ownerId" in body) data.ownerId = asString(body.ownerId, { optional: true }) ?? null;
  if ("priority" in body) {
    // Session-28 (S28-P1): the Key/Standard/At Risk vocabulary with the
    // legacy hot/warm/cold set still accepted (mapped).
    const raw = asString(body.priority) ?? "Standard";
    const LEGACY_PRIORITY: Record<string, string> = { hot: "Key", warm: "Standard", cold: "At Risk" };
    const priority = LEGACY_PRIORITY[raw] ?? raw;
    if (!(CONTACT_PRIORITIES_REF as readonly string[]).includes(priority) &&
        !(CONTACT_PRIORITIES as readonly string[]).includes(raw)) {
      return ERR.BAD_REQUEST("Invalid priority");
    }
    data.priority = priority;
  }
  // Session-28 (S28-P1): the new first-class fields ride PATCH too (the
  // inline role select updates role alone).
  if ("role" in body) {
    const role = asString(body.role, { optional: true, max: 60 }) ?? null;
    if (role && !(CONTACT_ROLES as readonly string[]).includes(role)) {
      return ERR.BAD_REQUEST("Invalid role");
    }
    data.role = role;
  }
  if ("engagementLevel" in body) {
    const engagementLevel = asString(body.engagementLevel, { optional: true, max: 20 }) ?? null;
    if (engagementLevel && !(ENGAGEMENT_LEVELS as readonly string[]).includes(engagementLevel)) {
      return ERR.BAD_REQUEST("Invalid engagement level");
    }
    data.engagementLevel = engagementLevel;
  }
  if ("companySize" in body) {
    const companySize = asString(body.companySize, { optional: true, max: 40 }) ?? null;
    if (companySize && !(COMPANY_SIZES as readonly string[]).includes(companySize)) {
      return ERR.BAD_REQUEST("Invalid company size");
    }
    data.companySize = companySize;
  }
  if ("photoUrl" in body) data.photoUrl = asString(body.photoUrl, { optional: true, max: 500 }) ?? null;
  if ("status" in body) data.status = asString(body.status, { optional: true, max: 20 }) ?? "active";

  const contact = await db.contact.update({
    where: { id },
    data,
    include: {
      account: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
    },
  });
  return ok(contact);
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  const existing = await db.contact.findUnique({ where: { id } });
  if (!existing) return ERR.NOT_FOUND("Contact");

  await db.contact.delete({ where: { id } });
  return ok({ deleted: id });
}

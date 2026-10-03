import { db } from "@/lib/db";
import { ok, ERR, asString, asFKId, isBadFK, isBadString, isGuarded, requireSession } from "@/lib/api";
import { CONTACT_PRIORITIES, CONTACT_PRIORITIES_REF, CONTACT_ROLES, CONTACT_STATUSES, ENGAGEMENT_LEVELS, COMPANY_SIZES } from "@/lib/constants";

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
    if (!name) return ERR.BAD_REQUEST("Name is required");
    data.name = name;
  }
  if ("email" in body) {
    // Session-40 (S40-P2): the silent-clear family (isBadFK's class,
    // one parse-shape over).
    if (isBadString(body.email)) return ERR.BAD_REQUEST("Invalid email");
    const email = asString(body.email, { optional: true, max: 160 }) ?? null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ERR.BAD_REQUEST("Enter a valid email address");
    }
    data.email = email;
  }
  if ("phone" in body) {
    if (isBadString(body.phone)) return ERR.BAD_REQUEST("Invalid phone number");
    data.phone = asString(body.phone, { optional: true, max: 40 }) ?? null;
  }
  if ("company" in body) {
    if (isBadString(body.company)) return ERR.BAD_REQUEST("Invalid company");
    data.company = asString(body.company, { optional: true, max: 120 }) ?? null;
  }
  if ("position" in body) {
    if (isBadString(body.position)) return ERR.BAD_REQUEST("Invalid position");
    data.position = asString(body.position, { optional: true, max: 80 }) ?? null;
  }
  if ("source" in body) {
    if (isBadString(body.source)) return ERR.BAD_REQUEST("Invalid source");
    data.source = asString(body.source, { optional: true, max: 40 }) ?? null;
  }
  // Session-37 (S37-P3): a non-string FK payload is a 400, not a silent
  // coercion to null (the silent FK clear on PUT).
  if ("accountId" in body) {
    if (isBadFK(body.accountId)) return ERR.BAD_REQUEST("Invalid company selection");
    data.accountId = asFKId(body.accountId);
  }
  if ("ownerId" in body) {
    if (isBadFK(body.ownerId)) return ERR.BAD_REQUEST("Invalid owner selection");
    data.ownerId = asFKId(body.ownerId);
  }
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
    if (isBadString(body.role)) return ERR.BAD_REQUEST("Invalid role");
    const role = asString(body.role, { optional: true, max: 60 }) ?? null;
    if (role && !(CONTACT_ROLES as readonly string[]).includes(role)) {
      return ERR.BAD_REQUEST("Invalid role");
    }
    data.role = role;
  }
  if ("engagementLevel" in body) {
    if (isBadString(body.engagementLevel)) return ERR.BAD_REQUEST("Invalid engagement level");
    const engagementLevel = asString(body.engagementLevel, { optional: true, max: 20 }) ?? null;
    if (engagementLevel && !(ENGAGEMENT_LEVELS as readonly string[]).includes(engagementLevel)) {
      return ERR.BAD_REQUEST("Invalid engagement level");
    }
    data.engagementLevel = engagementLevel;
  }
  if ("companySize" in body) {
    if (isBadString(body.companySize)) return ERR.BAD_REQUEST("Invalid company size");
    const companySize = asString(body.companySize, { optional: true, max: 40 }) ?? null;
    if (companySize && !(COMPANY_SIZES as readonly string[]).includes(companySize)) {
      return ERR.BAD_REQUEST("Invalid company size");
    }
    data.companySize = companySize;
  }
  if ("photoUrl" in body) {
    // Session-36 (S36-P4): photoUrl accepts only the documented URL shapes
    // (our upload flow's /api/uploads/<name> or an https:// link like the
    // reference's CDN data) — never a data:/javascript: URL or an arbitrary
    // tracker rendered to every viewer.
    // Session-38 (S38-P2): a PRESENT non-string photoUrl is a 400 — it
    // used to ride asString's optional coercion to null: a SILENT photo
    // CLEAR on PUT (LIVE-proven with {"photoUrl": 999} → 200 + null).
    if (isBadFK(body.photoUrl)) return ERR.BAD_REQUEST("Invalid photo URL");
    const photoUrl = asString(body.photoUrl, { optional: true, max: 500 }) ?? null;
    if (photoUrl && !photoUrl.startsWith("/api/uploads/") && !photoUrl.startsWith("https://")) {
      return ERR.BAD_REQUEST("Invalid photo URL");
    }
    data.photoUrl = photoUrl;
  }
  if ("status" in body) {
    // Session-40 (S40-P2): status had NO type guard and NO enum check —
    // {"status":123} silently reset an inactive contact to "active"
    // (LIVE-proven) and {"status":"banana"} stored verbatim.
    // Session-42 (S42-P4): the parse went NON-OPTIONAL — the optional
    // form's `?? "active"` fired on a present "" and silently reset an
    // inactive contact (LIVE-proven; the only optional-parse enum on
    // PUT whose default passes the membership check). A present ""
    // is now the sibling enums' 400 (status is a required enum — ""
    // is a bad value, not a clear).
    if (isBadString(body.status)) return ERR.BAD_REQUEST("Invalid status");
    const status = asString(body.status, { max: 20 });
    if (!status || !(CONTACT_STATUSES as readonly string[]).includes(status)) {
      return ERR.BAD_REQUEST("Invalid status");
    }
    data.status = status;
  }

  // Session-35 (S35-P5): FK existence guards on PUT — the POST-side
  // vocabulary — plus the envelope-held failure path. A stale dropdown id
  // would otherwise throw Prisma P2003 as an unhandled rejection (a raw
  // non-envelope 500); any other DB failure lands in ERR.INTERNAL now.
  // Session-36 (S36-P2): the existence fetch moved INSIDE the try — every
  // DB call in the handler is envelope-held now.
  try {
    const existing = await db.contact.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Contact");
    if (typeof data.accountId === "string" && data.accountId) {
      const account = await db.account.findUnique({ where: { id: data.accountId } });
      if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
    }
    if (typeof data.ownerId === "string" && data.ownerId) {
      const owner = await db.user.findUnique({ where: { id: data.ownerId } });
      if (!owner) return ERR.BAD_REQUEST("Selected owner does not exist");
    }
    const contact = await db.contact.update({
      where: { id },
      data,
      include: {
        account: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, avatarColor: true } },
      },
    });
    return ok(contact);
  } catch {
    return ERR.INTERNAL();
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  // Session-36 (S36-P2): the delete is envelope-held (SQLITE_BUSY-class
  // failures stay inside { ok, error } instead of a raw non-JSON 500).
  try {
    const existing = await db.contact.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Contact");

    await db.contact.delete({ where: { id } });
    return ok({ deleted: id });
  } catch {
    return ERR.INTERNAL();
  }
}

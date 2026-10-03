import { db } from "@/lib/db";
import { ok, ERR, asString, asDate, asFKId, isBadFK, isBadString, isBadDate, isGuarded, requireSession } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const data: Record<string, unknown> = {};
  if ("title" in body) {
    const title = asString(body.title, { max: 160 });
    if (!title) return ERR.BAD_REQUEST("Event title is required");
    data.title = title;
  }
  // Session-40 (S40-P2): the silent-clear family — isBadFK's class,
  // one parse-shape over.
  if ("description" in body) {
    if (isBadString(body.description)) return ERR.BAD_REQUEST("Invalid description");
    data.description = asString(body.description, { optional: true, max: 1000 }) ?? null;
  }
  if ("location" in body) {
    if (isBadString(body.location)) return ERR.BAD_REQUEST("Invalid location");
    data.location = asString(body.location, { optional: true, max: 200 }) ?? null;
  }
  if ("relatedType" in body) {
    if (isBadString(body.relatedType)) return ERR.BAD_REQUEST("Invalid related type");
    data.relatedType = asString(body.relatedType, { optional: true, max: 40 }) ?? null;
  }
  if ("allDay" in body) data.allDay = body.allDay === true;
  // Session-37 (S37-P3): a non-string FK payload is a 400, not a silent
  // coercion to null (the silent FK clear on PUT).
  if ("accountId" in body) {
    if (isBadFK(body.accountId)) return ERR.BAD_REQUEST("Invalid company selection");
    data.accountId = asFKId(body.accountId);
  }
  if ("contactId" in body) {
    if (isBadFK(body.contactId)) return ERR.BAD_REQUEST("Invalid contact selection");
    data.contactId = asFKId(body.contactId);
  }
  if ("startAt" in body) {
    const startAt = asDate(body.startAt);
    if (!startAt) return ERR.BAD_REQUEST("Start date and time are required");
    data.startAt = startAt;
  }
  if ("endAt" in body) {
    // Session-40 (S40-P2): a bad-type endAt BOTH silently cleared the
    // end time AND bypassed the s36 end≥start invariant below (a null
    // effectiveEnd skips the merged-record check — LIVE-proven with
    // {"endAt": {"$gt": …}} → 200 + endAt null).
    if (isBadDate(body.endAt)) return ERR.BAD_REQUEST("Invalid end date");
    data.endAt = asDate(body.endAt) ?? null;
  }
  if ("type" in body) {
    const type = asString(body.type) ?? "meeting";
    if (!(EVENT_TYPES as readonly string[]).includes(type)) return ERR.BAD_REQUEST("Invalid event type");
    data.type = type;
  }
  if ("status" in body) {
    const status = asString(body.status) ?? "scheduled";
    if (!["scheduled", "completed", "cancelled"].includes(status)) return ERR.BAD_REQUEST("Invalid status");
    data.status = status;
  }

  // Session-35 (S35-P5): FK existence guards on PUT — the POST-side
  // vocabulary — plus the envelope-held failure path. Session-36 (S36-P1):
  // the end≥start invariant the POST side enforces, checked against the
  // MERGED record (patch semantics — an absent field keeps the existing
  // row's value; checking only the patch's own startAt would let
  // {endAt: <early>} slip past an unchanged later startAt). Session-36
  // (S36-P2): the existence fetch moved INSIDE the try.
  try {
    const existing = await db.event.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Event");

    const effectiveStart = (data.startAt as Date | undefined) ?? existing.startAt;
    const effectiveEnd = data.endAt !== undefined ? (data.endAt as Date | null) : existing.endAt;
    if (effectiveEnd && effectiveEnd < effectiveStart) {
      return ERR.BAD_REQUEST("End time must be after start time");
    }

    if (typeof data.accountId === "string" && data.accountId) {
      const account = await db.account.findUnique({ where: { id: data.accountId } });
      if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
    }
    if (typeof data.contactId === "string" && data.contactId) {
      const contact = await db.contact.findUnique({ where: { id: data.contactId } });
      if (!contact) return ERR.BAD_REQUEST("Selected contact does not exist");
    }
    const event = await db.event.update({
      where: { id },
      data,
      include: {
        account: { select: { id: true, name: true } },
        contact: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, avatarColor: true } },
      },
    });
    return ok(event);
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
    const existing = await db.event.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Event");

    await db.event.delete({ where: { id } });
    return ok({ deleted: id });
  } catch {
    return ERR.INTERNAL();
  }
}

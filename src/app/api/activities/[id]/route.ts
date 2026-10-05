import { db } from "@/lib/db";
import { ok, ERR, asString, asDate, asFKId, isBadString, isBadDate, isBadFK, isBodyTooLarge, isGuarded, requireSession  } from "@/lib/api";
import { ACTIVITY_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  // Session-68 (F-68a2): the declared-size pre-gate BEFORE the parse —
  // the N-67d auth-family gate extended to the sessioned CRUD family
  // (req.json() buffers with no default cap in App Router handlers;
  // the honest CRUD bodies are far smaller than the 16KB ceiling).
  if (isBodyTooLarge(req)) return ERR.BAD_REQUEST("Request body too large");

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const data: Record<string, unknown> = {};
  if ("subject" in body) {
    const subject = asString(body.subject, { max: 200 });
    if (!subject) return ERR.BAD_REQUEST("Activity details are required");
    data.subject = subject;
  }
  // Session-40 (S40-P2): the silent-clear family — isBadFK's class,
  // one parse-shape over.
  if ("notes" in body) {
    if (isBadString(body.notes)) return ERR.BAD_REQUEST("Invalid notes");
    data.notes = asString(body.notes, { optional: true, max: 2000 }) ?? null;
  }
  if ("relatedType" in body) {
    if (isBadString(body.relatedType)) return ERR.BAD_REQUEST("Invalid related type");
    data.relatedType = asString(body.relatedType, { optional: true, max: 40 }) ?? null;
  }
  if ("relatedName" in body) {
    if (isBadString(body.relatedName)) return ERR.BAD_REQUEST("Invalid related name");
    data.relatedName = asString(body.relatedName, { optional: true, max: 160 }) ?? null;
  }
  if ("dueAt" in body) {
    // An unparseable string silently cleared the date before the
    // guard (asDate("garbage") → undefined → null).
    if (isBadDate(body.dueAt)) return ERR.BAD_REQUEST("Invalid due date");
    data.dueAt = asDate(body.dueAt) ?? null;
  }
  if ("priority" in body) {
    // Session-43 (S43-P2): the dead `?? "normal"` removed (the s42-P5
    // shape — non-optional asString returns "", never undefined).
    const priority = asString(body.priority);
    if (!priority || !["high", "normal", "low"].includes(priority)) return ERR.BAD_REQUEST("Invalid priority");
    data.priority = priority;
  }
  if ("type" in body) {
    const type = asString(body.type);
    if (!type || !(ACTIVITY_TYPES as readonly string[]).includes(type)) return ERR.BAD_REQUEST("Invalid activity type");
    data.type = type;
  }
  if ("status" in body) {
    const status = asString(body.status);
    if (!status || !["scheduled", "completed"].includes(status)) return ERR.BAD_REQUEST("Invalid status");
    data.status = status;
    data.completedAt = status === "completed" ? new Date() : null;
  }
  // Session-42 (S42-P3): the FK branches the route was missing entirely —
  // a PUT contactId/accountId used to be silently IGNORED (the caller's
  // payload dropped without error; an activity's links could never be
  // re-assigned or cleared via the API). The contacts/[id] shape,
  // verbatim.
  if ("contactId" in body) {
    if (isBadFK(body.contactId)) return ERR.BAD_REQUEST("Invalid contact selection");
    data.contactId = asFKId(body.contactId);
  }
  if ("accountId" in body) {
    if (isBadFK(body.accountId)) return ERR.BAD_REQUEST("Invalid company selection");
    data.accountId = asFKId(body.accountId);
  }

  // Session-36 (S36-P2): the update is envelope-held (SQLITE_BUSY-class
  // failures stay inside { ok, error } instead of a raw non-JSON 500).
  // Session-37 (S37-P2): the existence fetch moved INSIDE the try — the
  // last [id] route to join (a DB failure on the read stays inside the
  // envelope; missing-id + malformed-body now answers 400 before 404,
  // matching the four sibling [id] routes' ordering).
  try {
    const existing = await db.activity.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Activity");

    // Session-42 (S42-P3): FK existence guards — the POST route's own
    // vocabulary (a stale dropdown id must be a 400, not a raw P2003).
    if (typeof data.contactId === "string" && data.contactId) {
      const contact = await db.contact.findUnique({ where: { id: data.contactId } });
      if (!contact) return ERR.BAD_REQUEST("Selected contact does not exist");
    }
    if (typeof data.accountId === "string" && data.accountId) {
      const account = await db.account.findUnique({ where: { id: data.accountId } });
      if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
    }

    const activity = await db.activity.update({
      where: { id },
      data,
      include: {
        account: { select: { id: true, name: true } },
        contact: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, avatarColor: true } },
      },
    });
    return ok(activity);
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
    const existing = await db.activity.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Activity");

    await db.activity.delete({ where: { id } });
    return ok({ deleted: id });
  } catch {
    return ERR.INTERNAL();
  }
}

import { db } from "@/lib/db";
import { ok, ERR, asString, asDate, asFKId, isBadFK, isBadDate, isGuarded, requireSession } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const url = new URL(req.url);
  const from = asDate(url.searchParams.get("from"));
  const to = asDate(url.searchParams.get("to"));

  const events = await db.event.findMany({
    where: {
      ...(from || to
        ? { startAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
        : {}),
    },
    orderBy: { startAt: "asc" },
    include: {
      account: { select: { id: true, name: true } },
      contact: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
    },
  });
  return ok(events);
}

export async function POST(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const title = asString(body.title, { max: 160 });
  if (!title) return ERR.BAD_REQUEST("Event title is required");

  const startAt = asDate(body.startAt);
  if (!startAt) return ERR.BAD_REQUEST("Start date and time are required");

  const type = asString(body.type, { optional: true }) ?? "meeting";
  if (!(EVENT_TYPES as readonly string[]).includes(type)) return ERR.BAD_REQUEST("Invalid event type");

  const status = asString(body.status, { optional: true }) ?? "scheduled";
  if (!["scheduled", "completed", "cancelled"].includes(status)) return ERR.BAD_REQUEST("Invalid status");

  // Session-40 (S40-P4): the invariant twin — a bad-type endAt
  // silently nulled the end time (the end≥start check below skips a
  // null endAt, the s36 invariant's own bypass).
  if (isBadDate(body.endAt)) return ERR.BAD_REQUEST("Invalid end date");
  const endAt = asDate(body.endAt);
  if (endAt && endAt < startAt) return ERR.BAD_REQUEST("End time must be after start time");

  // Session-37 (S37-P3): a non-string FK payload is a 400, not a silent
  // coercion to null.
  if (isBadFK(body.contactId)) return ERR.BAD_REQUEST("Invalid contact selection");
  const contactId = asFKId(body.contactId);
  if (isBadFK(body.accountId)) return ERR.BAD_REQUEST("Invalid company selection");
  const accountId = asFKId(body.accountId);
  // Session-35 (S35-P5): the accountId FK guard the POST side was missing
  // (contactId was already checked) + the envelope-held failure path.
  // Session-36 (S36-P2): the contactId guard moved INSIDE the try — every
  // DB call in the handler is envelope-held.
  try {
    if (contactId) {
      const contact = await db.contact.findUnique({ where: { id: contactId } });
      if (!contact) return ERR.BAD_REQUEST("Selected contact does not exist");
    }
    if (accountId) {
      const account = await db.account.findUnique({ where: { id: accountId } });
      if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
    }
    const event = await db.event.create({
      data: {
        title,
        description: asString(body.description, { optional: true, max: 1000 }) ?? null,
        type,
        status,
        startAt,
        endAt,
        allDay: body.allDay === true,
        location: asString(body.location, { optional: true, max: 200 }) ?? null,
        relatedType: asString(body.relatedType, { optional: true, max: 40 }) ?? null,
        accountId,
        contactId,
        ownerId: guard.user.id,
      },
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

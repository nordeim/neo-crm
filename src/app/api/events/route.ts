import { db } from "@/lib/db";
import { ok, ERR, asString, asDate, asFKId, isBadFK, isBadDate, isBadString, isBadBool, isBodyTooLarge, isGuarded, requireSession  } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const url = new URL(req.url);
  // Session-43 (S43-P5): a present-but-unparseable window param is a
  // 400, not a silent filter drop — asDate("garbage") → undefined used
  // to DROP the window (the caller asked for a window, got everything;
  // the period param's own 400-on-garbage precedent). isBadDate
  // semantics for URL params: absent (null) passes, empty "" passes
  // (≡ absent, the house GET convention), a garbage string rejects.
  const fromRaw = url.searchParams.get("from");
  const toRaw = url.searchParams.get("to");
  if (isBadDate(fromRaw)) return ERR.BAD_REQUEST("Invalid from date");
  if (isBadDate(toRaw)) return ERR.BAD_REQUEST("Invalid to date");
  const from = asDate(fromRaw);
  const to = asDate(toRaw);

  // Session-42 (S42-P1): the list read joined the envelope.
  try {
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
  } catch {
    return ERR.INTERNAL();
  }
}

export async function POST(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  // Session-68 (F-68a2): the declared-size pre-gate BEFORE the parse —
  // the N-67d auth-family gate extended to the sessioned CRUD family
  // (req.json() buffers with no default cap in App Router handlers;
  // the honest CRUD bodies are far smaller than the 16KB ceiling).
  if (isBodyTooLarge(req)) return ERR.BAD_REQUEST("Request body too large");

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const title = asString(body.title, { max: 160 });
  if (!title) return ERR.BAD_REQUEST("Event title is required");

  const startAt = asDate(body.startAt);
  if (!startAt) return ERR.BAD_REQUEST("Start date and time are required");

  // Session-41 (S41-P1): the POST-side lenient-create completion — the
  // enum type-gaps closed (a non-string type/status used to silently
  // default to "meeting"/"scheduled"). The PUT twins' guards + vocabulary.
  if (isBadString(body.type)) return ERR.BAD_REQUEST("Invalid event type");
  const type = asString(body.type, { optional: true }) ?? "meeting";
  if (!(EVENT_TYPES as readonly string[]).includes(type)) return ERR.BAD_REQUEST("Invalid event type");

  if (isBadString(body.status)) return ERR.BAD_REQUEST("Invalid status");
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
    // Session-41 (S41-P1): the create-inline string parses — the silent
    // ?? null drops closed (the PUT twins' guards + vocabulary).
    if (isBadString(body.description)) return ERR.BAD_REQUEST("Invalid description");
    if (isBadString(body.location)) return ERR.BAD_REQUEST("Invalid location");
    if (isBadString(body.relatedType)) return ERR.BAD_REQUEST("Invalid related type");
    // Session-42 (S42-P2): the strict-bool silent-clear family —
    // {"allDay":"yes"} used to silently store false (the === true
    // idiom's non-boolean edge; the event dialog has no all-day
    // control, so the surface is API-only).
    if (isBadBool(body.allDay)) return ERR.BAD_REQUEST("Invalid all-day flag");
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

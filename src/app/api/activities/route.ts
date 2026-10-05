import { db } from "@/lib/db";
import { ok, ERR, asString, asDate, asFKId, isBadFK, isBadDate, isBadString, isBodyTooLarge, isGuarded, requireSession  } from "@/lib/api";
import { ACTIVITY_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  // Session-42 (S42-P1): the list read joined the envelope.
  try {
    const activities = await db.activity.findMany({
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      include: {
        account: { select: { id: true, name: true } },
        contact: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, avatarColor: true } },
      },
    });
    return ok(activities);
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

  const subject = asString(body.subject, { max: 200 });
  if (!subject) return ERR.BAD_REQUEST("Activity details are required");

  // Session-41 (S41-P1): the POST-side lenient-create completion — the
  // enum type-gaps closed (a non-string type/status/priority used to
  // silently default to "call"/"scheduled"/"normal"). The PUT twins'
  // guards + vocabulary.
  if (isBadString(body.type)) return ERR.BAD_REQUEST("Invalid activity type");
  const type = asString(body.type, { optional: true }) ?? "call";
  if (!(ACTIVITY_TYPES as readonly string[]).includes(type)) return ERR.BAD_REQUEST("Invalid activity type");

  if (isBadString(body.status)) return ERR.BAD_REQUEST("Invalid status");
  const status = asString(body.status, { optional: true }) ?? "scheduled";
  if (!["scheduled", "completed"].includes(status)) return ERR.BAD_REQUEST("Invalid status");

  if (isBadString(body.priority)) return ERR.BAD_REQUEST("Invalid priority");
  const priority = asString(body.priority, { optional: true }) ?? "normal";
  if (!["high", "normal", "low"].includes(priority)) return ERR.BAD_REQUEST("Invalid priority");

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
    // Session-40 (S40-P4): the WORST inventing twin — a bad-type dueAt
    // silently invented NOW (asDate → undefined → new Date()).
    if (isBadDate(body.dueAt)) return ERR.BAD_REQUEST("Invalid due date");
    // Session-41 (S41-P1): the create-inline string parses — the silent
    // ?? null drops closed (the PUT twins' guards + vocabulary).
    if (isBadString(body.notes)) return ERR.BAD_REQUEST("Invalid notes");
    if (isBadString(body.relatedType)) return ERR.BAD_REQUEST("Invalid related type");
    if (isBadString(body.relatedName)) return ERR.BAD_REQUEST("Invalid related name");
    const activity = await db.activity.create({
      data: {
        type,
        subject,
        notes: asString(body.notes, { optional: true, max: 2000 }) ?? null,
        status,
        priority,
        dueAt: asDate(body.dueAt) ?? new Date(),
        completedAt: status === "completed" ? new Date() : null,
        relatedType: asString(body.relatedType, { optional: true, max: 40 }) ?? null,
        relatedName: asString(body.relatedName, { optional: true, max: 160 }) ?? null,
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

    // Touch the related contact/account "last activity" stamps.
    const now = new Date();
    if (contactId) await db.contact.update({ where: { id: contactId }, data: { lastActivityAt: now } }).catch(() => null);
    if (accountId) await db.account.update({ where: { id: accountId }, data: { lastActivityAt: now } }).catch(() => null);

    return ok(activity);
  } catch {
    return ERR.INTERNAL();
  }
}

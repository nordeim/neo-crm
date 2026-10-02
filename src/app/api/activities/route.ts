import { db } from "@/lib/db";
import { ok, ERR, asString, asDate, isGuarded, requireSession } from "@/lib/api";
import { ACTIVITY_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const activities = await db.activity.findMany({
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    include: {
      account: { select: { id: true, name: true } },
      contact: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
    },
  });
  return ok(activities);
}

export async function POST(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const subject = asString(body.subject, { max: 200 });
  if (!subject) return ERR.BAD_REQUEST("Activity details are required");

  const type = asString(body.type, { optional: true }) ?? "call";
  if (!(ACTIVITY_TYPES as readonly string[]).includes(type)) return ERR.BAD_REQUEST("Invalid activity type");

  const status = asString(body.status, { optional: true }) ?? "scheduled";
  if (!["scheduled", "completed"].includes(status)) return ERR.BAD_REQUEST("Invalid status");

  const priority = asString(body.priority, { optional: true }) ?? "normal";
  if (!["high", "normal", "low"].includes(priority)) return ERR.BAD_REQUEST("Invalid priority");

  const contactId = asString(body.contactId, { optional: true }) ?? null;
  const accountId = asString(body.accountId, { optional: true }) ?? null;
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

import { db } from "@/lib/db";
import { ok, ERR, asString, isGuarded, requireSession } from "@/lib/api";
import { CONTACT_PRIORITIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const contacts = await db.contact.findMany({
    orderBy: { name: "asc" },
    include: {
      account: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
    },
  });
  return ok(contacts);
}

export async function POST(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const name = asString(body.name, { max: 120 });
  if (!name) return ERR.BAD_REQUEST("Name is required");
  const email = asString(body.email, { optional: true, max: 160 }) ?? null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return ERR.BAD_REQUEST("Enter a valid email address");
  }

  const priority = asString(body.priority, { optional: true }) ?? "warm";
  if (!(CONTACT_PRIORITIES as readonly string[]).includes(priority)) {
    return ERR.BAD_REQUEST("Invalid priority");
  }

  const accountId = asString(body.accountId, { optional: true }) ?? null;
  if (accountId) {
    const account = await db.account.findUnique({ where: { id: accountId } });
    if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
  }

  const ownerId = asString(body.ownerId, { optional: true }) ?? null;
  if (ownerId) {
    const owner = await db.user.findUnique({ where: { id: ownerId } });
    if (!owner) return ERR.BAD_REQUEST("Selected owner does not exist");
  }

  const contact = await db.contact.create({
    data: {
      name,
      email,
      phone: asString(body.phone, { optional: true, max: 40 }) ?? null,
      company: asString(body.company, { optional: true, max: 120 }) ?? null,
      position: asString(body.position, { optional: true, max: 80 }) ?? null,
      source: asString(body.source, { optional: true, max: 40 }) ?? null,
      priority,
      accountId,
      ownerId,
      lastActivityAt: new Date(),
    },
    include: {
      account: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
    },
  });
  return ok(contact);
}

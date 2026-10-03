import { db } from "@/lib/db";
import { ok, ERR, asString, asFKId, isBadFK, isGuarded, requireSession } from "@/lib/api";
import { CONTACT_PRIORITIES, CONTACT_PRIORITIES_REF, CONTACT_ROLES, ENGAGEMENT_LEVELS, COMPANY_SIZES } from "@/lib/constants";

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

  // Session-28 (S28-P1): the reference's contact priority vocabulary is
  // Key/Standard/At Risk — the legacy hot/warm/cold set stays accepted on
  // input (the create dialog used to send it) but maps onto the new
  // vocabulary so old clients don't break.
  const rawPriority = asString(body.priority, { optional: true }) ?? "Standard";
  const LEGACY_PRIORITY: Record<string, string> = { hot: "Key", warm: "Standard", cold: "At Risk" };
  const priority = LEGACY_PRIORITY[rawPriority] ?? rawPriority;
  if (!(CONTACT_PRIORITIES_REF as readonly string[]).includes(priority) &&
      !(CONTACT_PRIORITIES as readonly string[]).includes(rawPriority)) {
    return ERR.BAD_REQUEST("Invalid priority");
  }

  // The new first-class fields (the inline role select, the 3-bar
  // engagement cell, the company-size stack, the photo avatar).
  const role = asString(body.role, { optional: true, max: 60 }) ?? null;
  if (role && !(CONTACT_ROLES as readonly string[]).includes(role)) {
    return ERR.BAD_REQUEST("Invalid role");
  }
  const engagementLevel = asString(body.engagementLevel, { optional: true, max: 20 }) ?? null;
  if (engagementLevel && !(ENGAGEMENT_LEVELS as readonly string[]).includes(engagementLevel)) {
    return ERR.BAD_REQUEST("Invalid engagement level");
  }
  const companySize = asString(body.companySize, { optional: true, max: 40 }) ?? null;
  if (companySize && !(COMPANY_SIZES as readonly string[]).includes(companySize)) {
    return ERR.BAD_REQUEST("Invalid company size");
  }
  // Session-36 (S36-P4): photoUrl accepts only the documented URL shapes
  // (our upload flow's /api/uploads/<name> or an https:// link like the
  // reference's CDN data) — never a data:/javascript: URL or an arbitrary
  // tracker rendered to every viewer.
  const photoUrl = asString(body.photoUrl, { optional: true, max: 500 }) ?? null;
  if (photoUrl && !photoUrl.startsWith("/api/uploads/") && !photoUrl.startsWith("https://")) {
    return ERR.BAD_REQUEST("Invalid photo URL");
  }

  // Session-36 (S36-P2): the FK guards + create are envelope-held now —
  // every DB call in the handler inside the try. Session-37 (S37-P3):
  // a non-string FK payload is a 400, not a silent coercion to null.
  try {
    if (isBadFK(body.accountId)) return ERR.BAD_REQUEST("Invalid company selection");
    const accountId = asFKId(body.accountId);
    if (accountId) {
      const account = await db.account.findUnique({ where: { id: accountId } });
      if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
    }

    if (isBadFK(body.ownerId)) return ERR.BAD_REQUEST("Invalid owner selection");
    const ownerId = asFKId(body.ownerId);
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
        role,
        engagementLevel,
        companySize,
        photoUrl,
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
  } catch {
    return ERR.INTERNAL();
  }
}

import { db } from "@/lib/db";
import { ok, ERR, asString, asNumber, asDate, asFKId, isBadFK, isBadNumber, isBadDate, isBadString, isBodyTooLarge, isGuarded, requireSession  } from "@/lib/api";
import { LEAD_STAGES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  // Session-42 (S42-P1): the list read joined the envelope.
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        account: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, avatarColor: true } },
      },
    });
    return ok(leads);
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

  const name = asString(body.name, { max: 120 });
  if (!name) return ERR.BAD_REQUEST("Lead name is required");

  // Session-41 (S41-P1): the POST-side lenient-create completion — the
  // enum type-gaps closed (a non-string stage used to silently default to
  // "new"; the string fields silently nulled). The PUT twins' guards +
  // vocabulary; null/absent keep the default/null semantics.
  if (isBadString(body.stage)) return ERR.BAD_REQUEST("Invalid stage");
  const stage = asString(body.stage, { optional: true }) ?? "new";
  if (!(LEAD_STAGES as readonly string[]).includes(stage)) return ERR.BAD_REQUEST("Invalid stage");

  // Session-48 (S48-P2): source stays FREE-FORM — the s48 reconciliation
  // record (constants.ts's Session-48 comment). NO enum-membership (the
  // stage above IS enum-checked — the contrast is deliberate): the
  // vocabulary is deliberately fragmented across five surfaces, every
  // candidate list is case-disjoint from another, and the reference
  // itself accepts arbitrary import strings for source. String-ness +
  // the 40-char cap only.
  if (isBadString(body.source)) return ERR.BAD_REQUEST("Invalid source");
  const source = asString(body.source, { optional: true, max: 40 }) ?? null;

  // Session-36 (S36-P2): the FK guards + create are envelope-held now.
  // Session-37 (S37-P3): a non-string FK payload is a 400, not a silent
  // coercion to null.
  try {
    if (isBadFK(body.ownerId)) return ERR.BAD_REQUEST("Invalid owner selection");
    const ownerId = asFKId(body.ownerId);
    if (ownerId) {
      const owner = await db.user.findUnique({ where: { id: ownerId } });
      if (!owner) return ERR.BAD_REQUEST("Selected owner does not exist");
    }

    if (isBadFK(body.accountId)) return ERR.BAD_REQUEST("Invalid company selection");
    const accountId = asFKId(body.accountId);
    if (accountId) {
      const account = await db.account.findUnique({ where: { id: accountId } });
      if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
    }

    // Session-43 (S43-P1): Lead.contactId joins the FK family — the
    // schema + wire type carried the relation but this create silently
    // DROPPED the payload (LIVE-proven: {"contactId":<id>} → 200 +
    // null). The ownerId/accountId shape, verbatim.
    if (isBadFK(body.contactId)) return ERR.BAD_REQUEST("Invalid contact selection");
    const contactId = asFKId(body.contactId);
    if (contactId) {
      const contact = await db.contact.findUnique({ where: { id: contactId } });
      if (!contact) return ERR.BAD_REQUEST("Selected contact does not exist");
    }

    const closed = stage === "won" || stage === "lost";
    // Session-40 (S40-P4): the POST-side inventing twins — a bad type
    // silently INVENTED data (value→0, the dates→null) instead of
    // rejecting. The PUT guards' exact shapes.
    if (isBadNumber(body.value)) return ERR.BAD_REQUEST("Invalid value");
    if (isBadDate(body.expectedCloseDate)) return ERR.BAD_REQUEST("Invalid expected close date");
    if (isBadDate(body.nextFollowUp)) return ERR.BAD_REQUEST("Invalid follow-up date");
    // Session-41 (S41-P1): the create-inline string parses — the silent
    // ?? null drops closed (the PUT twins' guards + vocabulary).
    if (isBadString(body.email)) return ERR.BAD_REQUEST("Invalid email");
    if (isBadString(body.phone)) return ERR.BAD_REQUEST("Invalid phone number");
    if (isBadString(body.company)) return ERR.BAD_REQUEST("Invalid company");
    const lead = await db.lead.create({
      data: {
        name,
        email: asString(body.email, { optional: true, max: 160 }) ?? null,
        phone: asString(body.phone, { optional: true, max: 40 }) ?? null,
        company: asString(body.company, { optional: true, max: 120 }) ?? null,
        value: asNumber(body.value) ?? 0,
        stage,
        source,
        status: closed ? (stage === "won" ? "closed_won" : "closed_lost") : "open",
        expectedCloseDate: asDate(body.expectedCloseDate) ?? null,
        closedAt: closed ? new Date() : null,
        nextFollowUp: asDate(body.nextFollowUp) ?? null,
        accountId,
        ownerId,
        contactId,
      },
      include: {
        account: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, avatarColor: true } },
      },
    });
    return ok(lead);
  } catch {
    return ERR.INTERNAL();
  }
}

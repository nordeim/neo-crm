import { db } from "@/lib/db";
import { ok, ERR, asString, asNumber, asDate, asFKId, isBadFK, isBadString, isBadDate, isBadNumber, isBodyTooLarge, isGuarded, requireSession  } from "@/lib/api";
import { LEAD_STAGES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  // Session-35 (S35-P5): FK existence guards on PUT — the POST-side
  // vocabulary — plus the envelope-held failure path (P2003 and every
  // other DB failure stay inside the { ok, error } envelope).
  // Session-36 (S36-P2): the whole handler body is envelope-held — the
  // existence fetch moved INSIDE the try (the stage parsing below reads
  // existing.closedAt, so the try must start at the fetch).
  try {
    const existing = await db.lead.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Lead");

  // Session-68 (F-68a2): the declared-size pre-gate BEFORE the parse —
  // the N-67d auth-family gate extended to the sessioned CRUD family
  // (req.json() buffers with no default cap in App Router handlers;
  // the honest CRUD bodies are far smaller than the 16KB ceiling).
  if (isBodyTooLarge(req)) return ERR.BAD_REQUEST("Request body too large");

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return ERR.BAD_REQUEST("Invalid request body");

    const data: Record<string, unknown> = {};
    if ("name" in body) {
      const name = asString(body.name, { max: 120 });
      if (!name) return ERR.BAD_REQUEST("Lead name is required");
      data.name = name;
    }
    // Session-40 (S40-P2): the non-FK silent-clear family — a present
    // non-string used to ride the optional coercion to null (the
    // isBadFK class one parse-shape over).
    if ("email" in body) {
      if (isBadString(body.email)) return ERR.BAD_REQUEST("Invalid email");
      data.email = asString(body.email, { optional: true, max: 160 }) ?? null;
    }
    if ("phone" in body) {
      if (isBadString(body.phone)) return ERR.BAD_REQUEST("Invalid phone number");
      data.phone = asString(body.phone, { optional: true, max: 40 }) ?? null;
    }
    if ("company" in body) {
      if (isBadString(body.company)) return ERR.BAD_REQUEST("Invalid company");
      data.company = asString(body.company, { optional: true, max: 120 }) ?? null;
    }
    if ("value" in body) {
      // Number()'s truthy/array edges (true→1, [5]→5, []→0) silently
      // stored a number before the guard.
      if (isBadNumber(body.value)) return ERR.BAD_REQUEST("Invalid value");
      data.value = asNumber(body.value) ?? 0;
    }
    if ("source" in body) {
      if (isBadString(body.source)) return ERR.BAD_REQUEST("Invalid source");
      data.source = asString(body.source, { optional: true, max: 40 }) ?? null;
    }
    // Session-37 (S37-P3): a non-string FK payload is a 400, not a
    // silent coercion to null (the silent FK clear on PUT).
    if ("accountId" in body) {
      if (isBadFK(body.accountId)) return ERR.BAD_REQUEST("Invalid company selection");
      data.accountId = asFKId(body.accountId);
    }
    if ("ownerId" in body) {
      if (isBadFK(body.ownerId)) return ERR.BAD_REQUEST("Invalid owner selection");
      data.ownerId = asFKId(body.ownerId);
    }
    // Session-43 (S43-P1): the contactId branch — the PUT silently
    // IGNORED the field while the POST (now) accepts it (the N-42b
    // class; an activity's/lead's links could never be re-assigned or
    // cleared via the API).
    if ("contactId" in body) {
      if (isBadFK(body.contactId)) return ERR.BAD_REQUEST("Invalid contact selection");
      data.contactId = asFKId(body.contactId);
    }
    if ("expectedCloseDate" in body) {
      // An unparseable string silently cleared the date before the
      // guard (asDate("garbage") → undefined → null).
      if (isBadDate(body.expectedCloseDate)) return ERR.BAD_REQUEST("Invalid expected close date");
      data.expectedCloseDate = asDate(body.expectedCloseDate) ?? null;
    }
    if ("nextFollowUp" in body) {
      if (isBadDate(body.nextFollowUp)) return ERR.BAD_REQUEST("Invalid follow-up date");
      data.nextFollowUp = asDate(body.nextFollowUp) ?? null;
    }
    if ("stage" in body) {
      // Session-43 (S43-P2): the dead `?? "new"` removed — non-optional
      // asString returns "" (never undefined), so the fallback could
      // never fire; a present "" already 400s on the membership below
      // (the s42-P5 settings shape, generalized across the family).
      const stage = asString(body.stage);
      if (!stage || !(LEAD_STAGES as readonly string[]).includes(stage)) return ERR.BAD_REQUEST("Invalid stage");
      data.stage = stage;
      const closed = stage === "won" || stage === "lost";
      data.status = closed ? (stage === "won" ? "closed_won" : "closed_lost") : "open";
      if (closed && !existing.closedAt) data.closedAt = new Date();
      if (!closed && existing.closedAt) data.closedAt = null;
    }

    if (typeof data.accountId === "string" && data.accountId) {
      const account = await db.account.findUnique({ where: { id: data.accountId } });
      if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
    }
    if (typeof data.ownerId === "string" && data.ownerId) {
      const owner = await db.user.findUnique({ where: { id: data.ownerId } });
      if (!owner) return ERR.BAD_REQUEST("Selected owner does not exist");
    }
    // Session-43 (S43-P1): the contactId existence check — the POST's
    // own vocabulary (a stale dropdown id must be a 400, not a raw
    // P2003).
    if (typeof data.contactId === "string" && data.contactId) {
      const contact = await db.contact.findUnique({ where: { id: data.contactId } });
      if (!contact) return ERR.BAD_REQUEST("Selected contact does not exist");
    }
    const lead = await db.lead.update({
      where: { id },
      data,
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

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  // Session-36 (S36-P2): the delete is envelope-held.
  try {
    const existing = await db.lead.findUnique({ where: { id } });
    if (!existing) return ERR.NOT_FOUND("Lead");

    await db.lead.delete({ where: { id } });
    return ok({ deleted: id });
  } catch {
    return ERR.INTERNAL();
  }
}

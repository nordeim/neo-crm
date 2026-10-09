import { db } from "@/lib/db";
import { ok, ERR, asString, asNumber, asInt, asFKId, isBadFK, isBadNumber, isBadString, isBodyTooLarge, isGuarded, requireSession  } from "@/lib/api";
import { ACCOUNT_STATUSES, ACCOUNT_HEALTH_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  // Session-42 (S42-P1): the list read joined the envelope.
  try {
    // Session-75 (N-75c1-5): the _count include RETIRED — zero consumers
    // (the page + the insights dialog count from the store's arrays
    // client-side; only the reports route's own _count join is consumed).
    const accounts = await db.account.findMany({
      orderBy: [{ name: "asc" }],
      include: {
        owner: { select: { id: true, name: true, avatarColor: true } },
      },
    });
    return ok(accounts);
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
  if (!name) return ERR.BAD_REQUEST("Account name is required");

  // Session-86 (M-86c2): the tier/isKey write seams RETIRED — the
  // reference models NO stored tier (its tier is DERIVED from revenue
  // at render time; its dialogs offer no tier field). A stored field
  // nothing displays is the s42 silent-lie API class.
  if (isBadString(body.status)) return ERR.BAD_REQUEST("Invalid status");
  const status = asString(body.status, { optional: true }) ?? "active";
  if (!(ACCOUNT_STATUSES as readonly string[]).includes(status)) return ERR.BAD_REQUEST("Invalid status");

  // Session-44 (S44-P1): the last dead schema field — health was carried
  // by the schema + wire type + seed + the badge/CSV readers but silently
  // dropped on BOTH verbs (LIVE-proven: POST {"health":"At Risk"} → 200 +
  // "Healthy"). The create-default semantics (the status shape): absent/
  // ""/null keep the schema default, a present garbage string 400s.
  if (isBadString(body.health)) return ERR.BAD_REQUEST("Invalid health status");
  const health = asString(body.health, { optional: true, max: 20 }) ?? "Healthy";
  if (!(ACCOUNT_HEALTH_STATUSES as readonly string[]).includes(health)) {
    return ERR.BAD_REQUEST("Invalid health status");
  }

  // Session-36 (S36-P2): the FK guard + create are envelope-held now.
  // Session-37 (S37-P3): a non-string FK payload is a 400, not a silent
  // coercion to null; the dead asDate import removed.
  try {
    if (isBadFK(body.ownerId)) return ERR.BAD_REQUEST("Invalid owner selection");
    const ownerId = asFKId(body.ownerId);
    if (ownerId) {
      const owner = await db.user.findUnique({ where: { id: ownerId } });
      if (!owner) return ERR.BAD_REQUEST("Selected owner does not exist");
    }

    // Session-40 (S40-P4): the POST-side inventing twins (revenue/
    // employees silently nulled on a bad type).
    if (isBadNumber(body.annualRevenue)) return ERR.BAD_REQUEST("Invalid annual revenue");
    if (isBadNumber(body.employees)) return ERR.BAD_REQUEST("Invalid employee count");
    // Session-41 (S41-P1): the create-inline string parses — the silent
    // ?? null drops closed (the PUT twins' guards + vocabulary).
    if (isBadString(body.industry)) return ERR.BAD_REQUEST("Invalid industry");
    if (isBadString(body.email)) return ERR.BAD_REQUEST("Invalid email");
    if (isBadString(body.phone)) return ERR.BAD_REQUEST("Invalid phone number");
    if (isBadString(body.website)) return ERR.BAD_REQUEST("Invalid website");
    // Session-86 (M-86c2): the isKey write seam RETIRED with the stored
    // column (the reference models no key-account flag — its star rides
    // the computed tier).
    const account = await db.account.create({
      data: {
        name,
        industry: asString(body.industry, { optional: true, max: 80 }) ?? null,
        email: asString(body.email, { optional: true, max: 160 }) ?? null,
        phone: asString(body.phone, { optional: true, max: 40 }) ?? null,
        website: asString(body.website, { optional: true, max: 200 }) ?? null,
        annualRevenue: asNumber(body.annualRevenue) ?? null,
        employees: asInt(body.employees) ?? null,
        status,
        health,
        ownerId,
        // Session-75 (N-75c1-6, bundle-decoded): NO lastActivityAt stamp —
        // the reference's bce create form ships no last-activity field;
        // a fresh account renders "No activity" in the table (the schema
        // default null), exactly like the reference.
      },
      include: { owner: { select: { id: true, name: true, avatarColor: true } } },
    });
    return ok(account);
  } catch {
    return ERR.INTERNAL();
  }
}

import { db } from "@/lib/db";
import { ok, ERR, asString, asInt, isBadString, isBadNumber, isBodyTooLarge, isGuarded, requireSession  } from "@/lib/api";
import { ACCOUNT_TIERS, LEAD_STAGES } from "@/lib/constants";
import type { Settings } from "@/types";

export const dynamic = "force-dynamic";

function parseList(raw: string, fallback: string[]): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) return parsed;
  } catch {
    // fall through
  }
  return fallback;
}

async function readSettings(): Promise<Settings> {
  let row = await db.setting.findUnique({ where: { id: "singleton" } });
  if (!row) {
    row = await db.setting.create({ data: { id: "singleton" } });
  }
  return {
    // Session-48 (S48-P2): the contactSources defaults stay the
    // reference's own Capitalized six, VERBATIM — part of the
    // source-vocabulary reconciliation record (the operator decision).
    // Bundle-verified 2026-10-04: the reference's settings contactSources
    // is an entity-backed CRUD list whose ONLY consumer is the settings
    // page's own ConfigEditor — it drives nothing functional THERE either.
    // Our mirror therefore persists this free-form user list while the
    // functional vocabulary (the dialogs' hardcoded raw values) stays
    // case-disjoint — the fragmentation IS the reference's product
    // design. Do NOT "reconcile" by wiring this list into the dialogs or
    // by validating source against it: both would break parity (the
    // dialogs' options are bundle-pinned; the import accepts arbitrary
    // strings BY the reference's own design).
    contactSources: parseList(row.contactSources, ["Email", "Phone", "Website", "Referral", "Event", "Social Media"]),
    leadStages: parseList(row.leadStages, ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]),
    activityTypes: parseList(row.activityTypes, ["call", "email", "meeting", "whatsapp", "task", "note"]),
    accountTiers: parseList(row.accountTiers, ["A", "B", "C"]),
    industries: parseList(row.industries, ["Technology", "Manufacturing", "Retail", "Finance", "Healthcare", "Education", "Logistics", "Energy"]),
    defaultCurrency: row.defaultCurrency,
    defaultLeadStage: row.defaultLeadStage,
    defaultTier: row.defaultTier,
    followUpDays: row.followUpDays,
    calendarView: row.calendarView,
    firstDayOfWeek: row.firstDayOfWeek,
  };
}

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  // Session-37 (S37-P2): readSettings lazily CREATES the singleton row
  // when missing — a mutating call reached from a GET; its failure path
  // joins the envelope (the PUT's readSettings call was already inside
  // its try — the GET's was the gap).
  try {
    return ok(await readSettings());
  } catch {
    return ERR.INTERNAL();
  }
}

export async function PUT(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  // Session-68 (F-68a2): the declared-size pre-gate BEFORE the parse —
  // the N-67d auth-family gate extended to the sessioned CRUD family
  // (req.json() buffers with no default cap in App Router handlers;
  // the honest CRUD bodies are far smaller than the 16KB ceiling).
  if (isBodyTooLarge(req)) return ERR.BAD_REQUEST("Request body too large");

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const data: Record<string, unknown> = {};

  const listKeys = ["contactSources", "leadStages", "activityTypes", "accountTiers", "industries"] as const;
  for (const key of listKeys) {
    if (key in body) {
      const raw = body[key];
      if (!Array.isArray(raw) || !raw.every((x) => typeof x === "string" && x.trim().length > 0 && x.length <= 60)) {
        return ERR.BAD_REQUEST(`${key} must be a list of non-empty labels`);
      }
      if (raw.length > 40) return ERR.BAD_REQUEST(`${key} is limited to 40 entries`);
      data[key] = JSON.stringify(raw.map((x) => (x as string).trim()));
    }
  }

  // Session-40 (S40-P3): the dead-fallback revival — the quartet used
  // NON-optional asString, and "" is not nullish, so `?? "default"
  // NEVER fired: a present non-string (or "") silently stored ""
  // (LIVE-proven: {"defaultCurrency":123} → 200 + ""). The s38
  // signup-name fix shape: optional:true makes the fallback live, and
  // the type guard makes a bad payload a 400 instead of a silent
  // empty-string corruption.
  if ("defaultCurrency" in body) {
    if (isBadString(body.defaultCurrency)) return ERR.BAD_REQUEST("Invalid currency");
    const currency = asString(body.defaultCurrency, { max: 8, optional: true }) ?? "AED";
    data.defaultCurrency = currency.toUpperCase();
  }
  if ("defaultLeadStage" in body) {
    if (isBadString(body.defaultLeadStage)) return ERR.BAD_REQUEST("Invalid default lead stage");
    // Session-43 (S43-P3): membership vs LEAD_STAGES — the create
    // routes' own vocabulary. A poisoned default (LIVE-proven:
    // "banana-probe" saved verbatim) flowed into the lead dialog's
    // initial stage and made every subsequent create 400 confusingly.
    // The optional parse keeps the s40-P3 revival (""/null → the
    // default, not a 400).
    const stage = asString(body.defaultLeadStage, { max: 40, optional: true }) ?? "new";
    if (!(LEAD_STAGES as readonly string[]).includes(stage)) return ERR.BAD_REQUEST("Default lead stage must be a valid stage");
    data.defaultLeadStage = stage;
  }
  if ("defaultTier" in body) {
    if (isBadString(body.defaultTier)) return ERR.BAD_REQUEST("Invalid default tier");
    // Session-43 (S43-P3): membership vs ACCOUNT_TIERS (the accounts
    // routes' own vocabulary — the tier default seeds the account
    // dialog's initial value).
    const tier = asString(body.defaultTier, { max: 4, optional: true }) ?? "B";
    if (!(ACCOUNT_TIERS as readonly string[]).includes(tier)) return ERR.BAD_REQUEST("Default account tier must be A, B or C");
    data.defaultTier = tier;
  }
  if ("followUpDays" in body) {
    if (isBadNumber(body.followUpDays)) return ERR.BAD_REQUEST("Invalid follow-up days");
    const days = asInt(body.followUpDays) ?? 3;
    if (days < 0 || days > 90) return ERR.BAD_REQUEST("Follow-up days must be between 0 and 90");
    data.followUpDays = days;
  }
  if ("calendarView" in body) {
    if (isBadString(body.calendarView)) return ERR.BAD_REQUEST("Invalid calendar view");
    // Session-43 (S43-P3): membership vs the settings UI's own Select
    // vocabulary (the settings-page dropdown is the only writer).
    // Session-72 (M-72c3, bundle-decoded): the reference's Select
    // ships exactly month/week — the invented third option retired.
    // Session-63 (N-63b): the `!view` fragment retired — asString's
    // optional+trim contract returns undefined-or-a-non-empty-string,
    // so after `?? "month"` the value can never be falsy (unreachable
    // by construction, the N-62c class).
    const view = asString(body.calendarView, { max: 20, optional: true }) ?? "month";
    if (!["month", "week"].includes(view)) return ERR.BAD_REQUEST("Calendar view must be month or week");
    data.calendarView = view;
  }
  if ("firstDayOfWeek" in body) {
    // Session-42 (S42-P5): the dead `?? "monday"` removed — non-optional
    // asString returns "" (never undefined), so the fallback could never
    // fire; a present "" already 400s on the enum below (the s40
    // dead-?? shape).
    // Session-43 (S43-P3): the isBadString guard its sibling quintet
    // has — a non-string now 400s with the type vocabulary, not the
    // enum message.
    if (isBadString(body.firstDayOfWeek)) return ERR.BAD_REQUEST("Invalid first day of week");
    const dow = asString(body.firstDayOfWeek, { max: 10 });
    if (!dow || !["monday", "sunday"].includes(dow)) return ERR.BAD_REQUEST("First day of week must be monday or sunday");
    data.firstDayOfWeek = dow;
  }

  // Session-36 (S36-P2): the upsert + re-read are envelope-held.
  try {
    await db.setting.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });

    return ok(await readSettings());
  } catch {
    return ERR.INTERNAL();
  }
}

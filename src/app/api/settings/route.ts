import { db } from "@/lib/db";
import { ok, ERR, asString, asInt, isBadString, isBadNumber, isGuarded, requireSession } from "@/lib/api";
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
    data.defaultLeadStage = asString(body.defaultLeadStage, { max: 40, optional: true }) ?? "new";
  }
  if ("defaultTier" in body) {
    if (isBadString(body.defaultTier)) return ERR.BAD_REQUEST("Invalid default tier");
    data.defaultTier = asString(body.defaultTier, { max: 4, optional: true }) ?? "B";
  }
  if ("followUpDays" in body) {
    if (isBadNumber(body.followUpDays)) return ERR.BAD_REQUEST("Invalid follow-up days");
    const days = asInt(body.followUpDays) ?? 3;
    if (days < 0 || days > 90) return ERR.BAD_REQUEST("Follow-up days must be between 0 and 90");
    data.followUpDays = days;
  }
  if ("calendarView" in body) {
    if (isBadString(body.calendarView)) return ERR.BAD_REQUEST("Invalid calendar view");
    data.calendarView = asString(body.calendarView, { max: 20, optional: true }) ?? "month";
  }
  if ("firstDayOfWeek" in body) {
    const dow = asString(body.firstDayOfWeek, { max: 10 }) ?? "monday";
    if (!["monday", "sunday"].includes(dow)) return ERR.BAD_REQUEST("First day of week must be monday or sunday");
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

import { db } from "@/lib/db";
import { ok, ERR, asString, asInt, isGuarded, requireSession } from "@/lib/api";
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
  return ok(await readSettings());
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

  if ("defaultCurrency" in body) {
    const currency = asString(body.defaultCurrency, { max: 8 }) ?? "AED";
    data.defaultCurrency = currency.toUpperCase();
  }
  if ("defaultLeadStage" in body) data.defaultLeadStage = asString(body.defaultLeadStage, { max: 40 }) ?? "new";
  if ("defaultTier" in body) data.defaultTier = asString(body.defaultTier, { max: 4 }) ?? "B";
  if ("followUpDays" in body) {
    const days = asInt(body.followUpDays) ?? 3;
    if (days < 0 || days > 90) return ERR.BAD_REQUEST("Follow-up days must be between 0 and 90");
    data.followUpDays = days;
  }
  if ("calendarView" in body) data.calendarView = asString(body.calendarView, { max: 20 }) ?? "month";
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

import { db } from "@/lib/db";
import { ERR, asString, isGuarded, requireSession } from "@/lib/api";
import { toCsv, csvWithBom, csvFilename, type CsvColumn } from "@/lib/csv";
import { formatDate, startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from "@/lib/format";
import { REPORT_PERIODS } from "@/lib/constants";

export const dynamic = "force-dynamic";

/** The /api/reports period vocabulary (session-25, S25-P6) — the
 *  reference's SHORT ids: today/week/month/quarter/ytd/all. */
function reportPeriodStart(period: string, now: Date): Date {
  switch (period) {
    case "today":
      return startOfDay(now);
    case "week":
      return startOfWeek(now, "monday");
    case "month":
      return startOfMonth(now);
    case "quarter":
      return startOfQuarter(now);
    case "ytd":
      return startOfYear(now);
    default:
      return new Date(0);
  }
}

/** CSV export for the reports header (session-29 re-scope). The leads
 *  branch RETIRED with the client-side rewire: the reference's leads
 *  Export button builds a client-side blob from the FILTERED rows (the
 *  U bundle extract — src/lib/entity-export.ts unquotedHeaderCsv + the
 *  page's onExport), so the route now serves type=report only. The
 *  contacts/accounts/activities branches went the same way in s26. */
export async function GET(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "report";
  if (type !== "report") return ERR.BAD_REQUEST("Invalid type");
  const download = url.searchParams.get("download") === "1";
  // The report CSV's Owner column needs the user names (session-25).
  const usersCache = await db.user.findMany();

  let csv = "";
  let filename = "";

  {
    // Session-25 (S25-P5): the reports header CSV — the reference's
    // crm_report_YYYY-MM-DD.csv (SINGULAR "report", unlike the PDF's
    // plural crm_reports): Deal Name,Account,Amount,Stage,Source,Owner,
    // Close Date — the deal rows filtered by the SAME period/owner/
    // stage/status params as /api/reports (the row mapping is reasoned
    // from the column set: one row per lead in the filtered window).
    const period = asString(url.searchParams.get("period")) ?? "quarter";
    if (!REPORT_PERIODS.some((p) => p.id === period)) return ERR.BAD_REQUEST("Invalid period");
    const notAll = (v: string | null) => (v && v !== "all" ? v : null);
    const ownerId = notAll(url.searchParams.get("ownerId"));
    const stage = notAll(url.searchParams.get("stage"));
    const status = notAll(url.searchParams.get("status"));
    const now = new Date();
    const from = reportPeriodStart(period, now);
    const leadWhere = {
      ...(ownerId ? { ownerId } : {}),
      ...(stage ? { stage } : {}),
      ...(status ? { status } : {}),
      ...(period === "all" ? {} : { createdAt: { gte: from } }),
    };
    const rows = await db.lead.findMany({ where: leadWhere, orderBy: { value: "desc" } });
    const ownerName = (id: string | null) =>
      usersCache.find((u) => u.id === id)?.name ?? "";
    const columns: CsvColumn<(typeof rows)[number]>[] = [
      { header: "Deal Name", value: (r) => r.name },
      { header: "Account", value: (r) => r.company },
      { header: "Amount", value: (r) => r.value },
      { header: "Stage", value: (r) => r.stage },
      { header: "Source", value: (r) => r.source },
      { header: "Owner", value: (r) => ownerName(r.ownerId) },
      { header: "Close Date", value: (r) => formatDate(r.closedAt) },
    ];
    csv = toCsv(rows, columns);
    filename = csvFilename("crm_report");
  }

  return new Response(download ? csvWithBom(csv) : csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      ...(download ? { "Content-Disposition": `attachment; filename="${filename}"` } : {}),
    },
  });
}

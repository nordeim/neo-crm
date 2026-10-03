import { db } from "@/lib/db";
import { ERR, asString, isGuarded, requireSession } from "@/lib/api";
import { toCsv, csvWithBom, csvFilename, type CsvColumn } from "@/lib/csv";
import { formatDate, startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from "@/lib/format";
import { REPORT_PERIODS } from "@/lib/constants";

export const dynamic = "force-dynamic";

/** The /api/reports period vocabulary (session-25 S25-P6 + session-32
 *  S32-P4) — the reference's WIRE ids: today/thisWeek/thisMonth/quarter/
 *  ytd/all (the s25 week/month inferences corrected by the bundle
 *  decode). */
function reportPeriodStart(period: string, now: Date): Date {
  switch (period) {
    case "today":
      return startOfDay(now);
    case "thisWeek":
      return startOfWeek(now, "monday");
    case "thisMonth":
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

  let csv = "";
  let filename = "";

  {
    // Session-25 (S25-P5) + Session-31: the reports header CSV — the
    // reference's crm_report_YYYY-MM-DD.csv (SINGULAR "report", unlike the
    // PDF's plural crm_reports): Deal Name,Account,Amount,Stage,Source,
    // Owner,Close Date — one row per OPPORTUNITY in the filtered window
    // (the reference's `y` export maps its filteredOppportunities), with
    // the SAME period/owner/stage/status filter model as /api/reports.
    // Session-42 (S42-P6): the parse went OPTIONAL — the non-optional form
    // returned "" for a missing param, so the `?? "quarter"` default was
    // DEAD and a bare export answered 400 "Invalid period".
    const period = asString(url.searchParams.get("period"), { optional: true }) ?? "quarter";
    if (!REPORT_PERIODS.some((p) => p.id === period)) return ERR.BAD_REQUEST("Invalid period");
    const notAll = (v: string | null) => (v && v !== "all" ? v : null);
    const owner = notAll(url.searchParams.get("owner"));
    const stage = notAll(url.searchParams.get("stage"));
    const status = notAll(url.searchParams.get("status"));
    const source = notAll(url.searchParams.get("source"));
    const now = new Date();
    const from = reportPeriodStart(period, now);
    const oppWhere = {
      ...(owner ? { owner } : {}),
      ...(stage ? { stage } : {}),
      ...(source ? { source } : {}),
      ...(status === "won" ? { stage: "closed_won" } : status === "lost" ? { stage: "closed_lost" } : {}),
      ...(period === "all" ? {} : { createdAt: { gte: from } }),
    };
    // Session-42 (S42-P1): the read joined the envelope — the CSV build
    // below is pure; on failure the catch answers the { ok, error }
    // envelope (the download flow only consumes the CSV on 200).
    const fetched = await (async () => {
      try {
        return await db.opportunity.findMany({ where: oppWhere, orderBy: { createdAt: "desc" } });
      } catch {
        return null;
      }
    })();
    if (!fetched) return ERR.INTERNAL();
    const rows = status === "open" ? fetched.filter((o) => o.stage !== "closed_won" && o.stage !== "closed_lost") : fetched;
    const columns: CsvColumn<(typeof rows)[number]>[] = [
      { header: "Deal Name", value: (r) => r.name },
      { header: "Account", value: (r) => r.accountName },
      { header: "Amount", value: (r) => r.amount },
      { header: "Stage", value: (r) => r.stage },
      { header: "Source", value: (r) => r.source },
      { header: "Owner", value: (r) => r.owner },
      { header: "Close Date", value: (r) => formatDate(r.closeDate) },
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

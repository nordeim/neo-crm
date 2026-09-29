import { db } from "@/lib/db";
import { ERR, isGuarded, requireSession } from "@/lib/api";
import { toCsv, csvWithBom, csvFilename, type CsvColumn } from "@/lib/csv";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

/** CSV export for contacts / accounts / leads / activities. */
export async function GET(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "contacts";
  const download = url.searchParams.get("download") === "1";

  let csv = "";
  let filename = "";

  if (type === "contacts") {
    const rows = await db.contact.findMany({ orderBy: { name: "asc" } });
    const columns: CsvColumn<(typeof rows)[number]>[] = [
      { header: "Name", value: (r) => r.name },
      { header: "Email", value: (r) => r.email },
      { header: "Phone", value: (r) => r.phone },
      { header: "Company", value: (r) => r.company },
      { header: "Position", value: (r) => r.position },
      { header: "Source", value: (r) => r.source },
      { header: "Priority", value: (r) => r.priority },
      { header: "Created", value: (r) => formatDate(r.createdAt) },
    ];
    csv = toCsv(rows, columns);
    filename = csvFilename("contacts");
  } else if (type === "accounts") {
    const rows = await db.account.findMany({ orderBy: { name: "asc" } });
    const columns: CsvColumn<(typeof rows)[number]>[] = [
      { header: "Account Name", value: (r) => r.name },
      { header: "Industry", value: (r) => r.industry },
      { header: "Email", value: (r) => r.email },
      { header: "Phone", value: (r) => r.phone },
      { header: "Website", value: (r) => r.website },
      { header: "Annual Revenue", value: (r) => r.annualRevenue },
      { header: "Employees", value: (r) => r.employees },
      { header: "Tier", value: (r) => r.tier },
      { header: "Key Account", value: (r) => (r.isKey ? "Yes" : "No") },
      { header: "Status", value: (r) => r.status },
    ];
    csv = toCsv(rows, columns);
    filename = csvFilename("accounts");
  } else if (type === "leads") {
    const rows = await db.lead.findMany({ orderBy: { createdAt: "desc" } });
    const columns: CsvColumn<(typeof rows)[number]>[] = [
      { header: "Lead Name", value: (r) => r.name },
      { header: "Email", value: (r) => r.email },
      { header: "Phone", value: (r) => r.phone },
      { header: "Company", value: (r) => r.company },
      { header: "Value", value: (r) => r.value },
      { header: "Stage", value: (r) => r.stage },
      { header: "Status", value: (r) => r.status },
      { header: "Source", value: (r) => r.source },
      { header: "Expected Close", value: (r) => formatDate(r.expectedCloseDate) },
      { header: "Created", value: (r) => formatDate(r.createdAt) },
    ];
    csv = toCsv(rows, columns);
    filename = csvFilename("leads");
  } else if (type === "activities") {
    const rows = await db.activity.findMany({ orderBy: { createdAt: "desc" } });
    const columns: CsvColumn<(typeof rows)[number]>[] = [
      { header: "Type", value: (r) => r.type },
      { header: "Subject", value: (r) => r.subject },
      { header: "Status", value: (r) => r.status },
      { header: "Priority", value: (r) => r.priority },
      { header: "Due", value: (r) => formatDate(r.dueAt) },
      { header: "Completed", value: (r) => formatDate(r.completedAt) },
      { header: "Notes", value: (r) => r.notes },
    ];
    csv = toCsv(rows, columns);
    filename = csvFilename("activities");
  } else {
    return ERR.BAD_REQUEST("Unknown export type");
  }

  return new Response(download ? csvWithBom(csv) : csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      ...(download ? { "Content-Disposition": `attachment; filename="${filename}"` } : {}),
    },
  });
}

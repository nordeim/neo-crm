"use client";

import { downloadBlob } from "@/lib/download";
import * as React from "react";
import { Bookmark, Calendar as CalendarIcon, Download, FileText, RotateCcw, Target, TrendingDown, TrendingUp, User as UserIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsPanel } from "@/components/ui/tabs";
// Session-55 (S55-P1, N-55a): four orphaned imports retired from the
// statements below — KpiCard (page-parts), RevenueLineChart +
// ConversionFunnel (charts), CHART_COLORS (constants). Each had exactly
// one in-file reference: the import itself (the N-53c class; the s53
// sweep missed this file). The exports stay alive on their real owners
// (page.tsx owns KpiCard/RevenueLineChart, leads-page owns
// ConversionFunnel, the palette is shared).
import { CircleStatCard, PageHeader, Sparkline } from "@/components/shared/page-parts";
import { SaveReportDialog } from "@/components/shared/save-report-dialog";
import {
  EMPTY_STATE,
  KPI_STATICS,
  PAGE_KPI_GRIDS,
  PAGE_ROOT,
  REPORTS_FILTER_BAR,
  REPORTS_TABLE_CARD,
} from "@/lib/page-layout";
import {
  GroupedBarsChart,
  HorizontalBarChart,
  LabelPieChart,
  SingleBarChart,
  TrendLineChart,
  dollarFormatter,
  numberFormatter,
  percentFormatter,
} from "@/components/charts/charts";
import { useCrmStore } from "@/stores/crm-store";
import { OPP_STAGE_META, OPPORTUNITY_STAGES, REPORT_PERIODS, REPORTS_PIE_FILLS, REPORT_STATUSES, REPORT_TABS } from "@/lib/constants";
import { HEALTH_PIE_FILLS, lastActivityText } from "@/lib/account-health";
import { formatCompactCurrency, formatDate } from "@/lib/format";
import { toCsv, csvFilename } from "@/lib/csv";
import { exportReportsPdf, exportTablePdf, isoDateSuffix } from "@/lib/pdf-export";
import { listSavedReports, saveReport, normalizeSavedPeriod, normalizeSavedStage, normalizeSavedStatus, type SavedReport, type SavedReportColumns } from "@/lib/saved-reports";
import type { ReportsData } from "@/types";

export default function ReportsPage() {
  // Session-31: the owner filter is the OPPORTUNITY owner STRING (the
  // reference's owner dropdown lists the DISTINCT opp owners — not the
  // user directory); the stage select offers the OPP stage vocabulary.
  const { opportunities, fetchReports, hydrated } = useCrmStore();
  const [tab, setTab] = React.useState("sales");
  const [period, setPeriod] = React.useState("quarter");
  const [owner, setOwner] = React.useState("all");
  const [stage, setStage] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const oppOwners = React.useMemo(
    () => [...new Set(opportunities.map((o) => o.owner).filter((n): n is string => Boolean(n)))],
    [opportunities],
  );
  const [data, setData] = React.useState<ReportsData | null>(null);
  // Session-25 (S25-P4): the saved-report views — the count drives the
  // button label (the reference's live "Saved Reports (N)"), the list
  // feeds the dialog's saved section. localStorage is unreadable during
  // SSR — the read lands in the mount effect behind a yield (the
  // established leads-filters pattern; React 19 discipline: no
  // synchronous setState inside effect bodies).
  const [savedCount, setSavedCount] = React.useState(0);
  const [savedList, setSavedList] = React.useState<SavedReport[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => {
      const list = listSavedReports();
      setSavedList(list);
      setSavedCount(list.length);
    }, 0);
    return () => clearTimeout(t);
  }, []);
  // Session-25 (S25-P1): the `loading` state + the ReportSkeletons are
  // retired — the reference renders its reports IMMEDIATELY with zeros
  // while the fetch is in flight (its empty state IS its loading state,
  // live-verified with the entity-fetch-abort probe). The KPI cards +
  // every tab already read `data?.x ?? 0` / `data?.x ?? []` — null-safe.

  React.useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      await Promise.resolve(); // yield: all setState happens in async continuations
      if (cancelled) return;
      const res = await fetchReports({ period, owner, stage, status });
      if (cancelled) return;
      if (res.ok) setData(res.data);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, period, owner, stage, status, fetchReports]);

  const k = data?.kpis;

  return (
    // Session-16 (S16-P2): the page owns its padding — the reference's
    // reports root is `p-4 sm:p-8 bg-gray-50 min-h-screen` (the sticky
    // filter bar still sticks to main's top).
    <div id="reports-content" className={PAGE_ROOT.standard}>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive CRM reporting hub"
        subtitleSize="sm"
        unwrapActions
        actions={
          <Button
            variant="outline"
            onClick={() => setSaveDialogOpen(true)}
          >
            <Bookmark className="h-4 w-4 mr-2" /> Saved Reports ({savedCount})
          </Button>
        }
      />

      {/* Session-7 (S7-14): sticky filter bar — the reference RE-ADDED the
          Reset button (absent during the session-6 audit) and dropped the
          bar buttons to h-8 with mr-2 leading icons; the first two selects
          (period / owner) wrap in flex items-center gap-2 rows with
          calendar / user leading icons. Export CSV is primary, PDF outline. */}
      <div className={REPORTS_FILTER_BAR.bar}>
        <div className={REPORTS_FILTER_BAR.row}>
          <div className={REPORTS_FILTER_BAR.selectsWrap}>
            <div className={REPORTS_FILTER_BAR.selectWrap}>
              <CalendarIcon className={REPORTS_FILTER_BAR.selectIcon} />
              <Select value={period} onValueChange={setPeriod}>
                {/* Session-83 (N-83c5, bundle-verbatim): the reference's
                    SelectValue carries this placeholder — DEAD in both
                    apps (the controlled value is always set; the reset
                    terminal sets all four fields); mirrored for source
                    parity, the FILTER_BAR.searchPlaceholder precedent. */}
                <SelectTrigger className="w-44"><SelectValue placeholder="Date: This Quarter" /></SelectTrigger>
                <SelectContent>
                  {REPORT_PERIODS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={REPORTS_FILTER_BAR.selectWrap}>
              <UserIcon className={REPORTS_FILTER_BAR.selectIcon} />
              {/* Session-31: the reference's owner dropdown lists the
                  DISTINCT OPPORTUNITY owner strings (its `p` memo) — not
                  the user directory. */}
              <Select value={owner} onValueChange={setOwner}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Owner: All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {oppOwners.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Session-31: the stage select is the OPP vocabulary — all
                six stages, the Closed Won / Closed Lost labels (the
                reference's lCe filter card). */}
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Stage: All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {/* Session-65 (N-65e): the `?.label ?? s` arms RETIRED —
                    s ranges over OPPORTUNITY_STAGES and OPP_STAGE_META
                    covers all six keys (the s63 N-63b class's missed
                    sibling; the dashboard PIPELINE_LABELS twin retired
                    there). */}
                {OPPORTUNITY_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>{OPP_STAGE_META[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Status: All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {/* Session-49 (S49-P1): the status vocabulary is the shared
                    REPORT_STATUSES — the same list both route guards
                    membership-check (the REPORT_PERIODS precedent). */}
                {REPORT_STATUSES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Session-74 (L-74c9): the Reset button is the selects
                cluster's LAST CHILD in the reference's lCe (the sibling
                of the four selects inside the flex-wrap container — NOT
                a member of the export actions cluster). */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPeriod("quarter");
                setOwner("all");
                setStage("all");
                setStatus("all");
              }}
            >
              <RotateCcw className={REPORTS_FILTER_BAR.barBtnIcon} /> Reset
            </Button>
          </div>
          <div className={REPORTS_FILTER_BAR.actions}>
            {/* Session-25 (S25-P5): the reports CSV — the reference's
                crm_report_YYYY-MM-DD.csv (Deal Name, Account, Amount,
                Stage, Source, Owner, Close Date), filter-aware through the
                same params as /api/reports. NOT the leads export it was
                wired to before. */}
            <Button
              size="sm"
              onClick={() => {
                // Session-48 (S48-P4, N-48g): the F-47a mechanism's LAST
                // instance retired — downloadFile set window.location.href,
                // so a non-200 (an expired session's 401 envelope, an
                // INTERNAL 500) NAVIGATED the browser to the raw JSON body
                // instead of downloading. The reference's own reports
                // export is a CLIENT-side blob (bundle-verified — it cannot
                // fail-navigate); our s25 architecture keeps the route as
                // the single-source filter/artifact seam, so this is the
                // fetch->blob flow: the artifact bytes stay EXACTLY the
                // route's (BOM + CRLF + escapeCell quoting), and failures
                // surface through the s46 convention instead of stranding
                // the user on a JSON page.
                void (async () => {
                  try {
                    const res = await fetch(
                      `/api/export?type=report&period=${encodeURIComponent(period)}&owner=${encodeURIComponent(owner)}&stage=${encodeURIComponent(stage)}&status=${encodeURIComponent(status)}&download=1`,
                    );
                    if (!res.ok) {
                      // The route's { ok, error } envelope — same shape the
                      // store's call() surfaces everywhere else.
                      const envelope = (await res.json().catch(() => null)) as
                        | { ok: false; error?: { message?: string } }
                        | null;
                      toast.error(
                        "Could not export report",
                        envelope?.error?.message ?? "Export failed — please try again",
                      );
                      return;
                    }
                    // res.text() alone would STRIP the route's BOM
                    // (TextDecoder skips it by default) — decode with
                    // ignoreBOM so the artifact bytes round-trip EXACTLY
                    // (the s25-pinned download=1 convention).
                    const csv = new TextDecoder("utf-8", { ignoreBOM: true }).decode(
                      await res.arrayBuffer(),
                    );
                    // The route owns the artifact's name (Content-Disposition);
                    // the csvFilename fallback mirrors its own convention.
                    const disposition = res.headers.get("content-disposition") ?? "";
                    const match = /filename="([^"]+)"/.exec(disposition);
                    downloadBlob(csv, match?.[1] ?? csvFilename("crm_report"), "text/csv");
                  } catch {
                    toast.error("Could not export report", "Network error — check your connection and try again");
                  }
                })();
              }}
            >
              <Download className={REPORTS_FILTER_BAR.barBtnIcon} /> Export CSV
            </Button>
            {/* Session-25 (S25-P2): the header PDF — the reference's
                html2canvas + jsPDF full-content capture
                (crm_reports_YYYY-MM-DD.pdf), no print dialog, no toast
                on the happy path.
                Session-45 (S45-P1): the capture itself is rejectable
                (html2canvas-pro on huge canvases / mid-capture DOM
                mutations) — the bare `void` left an unhandled
                rejection + a dead-feeling button. The s44-P4
                convention: surface it, never strand it. */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void exportReportsPdf().catch(() => {
                  toast.error("Could not export PDF", "Please try again.");
                });
              }}
            >
              <FileText className={REPORTS_FILTER_BAR.barBtnIcon} /> PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Session-25 (S25-P1): no skeleton pass — the KPI row renders
          immediately with zeros (the `k?.x ?? 0` reads below). */}
      <>
          {/* Reference KPI row (session-5 anatomy + S27-P5): square
              rounded-lg tinted chips, the amount INLINE on Won Deals
              ($542.0K) but a delta-column SUBTITLE on Lost Deals ($196K) —
              the reference's own split — uppercase-K currency on this page. */}
          <div className={PAGE_KPI_GRIDS.reports}>
            {/* Session-27 (S27-P5): the reference HARDCODES these sparklines
                (its `z=X=>[65,72,68,85,78,92]` — one static array shared by
                every sparkline card) and the Lost Deals amount is a
                SUBTITLE in the delta column, not part of the bold value. */}
            <CircleStatCard label="Total Leads" value={(k?.totalLeads ?? 0).toLocaleString()} icon={<Target className="h-5 w-5" />} color="#3b82f6">
              <Sparkline values={[...KPI_STATICS.reportsSpark]} color="#3b82f6" variant="line" />
            </CircleStatCard>
            <CircleStatCard label="Open Leads" value={(k?.openLeads ?? 0).toLocaleString()} icon={<Users className="h-5 w-5" />} color="#f97316">
              <Sparkline values={[...KPI_STATICS.reportsSpark]} color="#f97316" variant="line" />
            </CircleStatCard>
            <CircleStatCard
              label="Won Deals"
              value={`${k?.wonDeals ?? 0} ${formatCompactCurrency(k?.wonValue ?? 0, { scale: "k", upper: true })}`}
              icon={<TrendingUp className="h-5 w-5" />}
              color="#10b981"
            >
              <Sparkline values={[...KPI_STATICS.reportsSpark]} color="#10b981" variant="line" />
            </CircleStatCard>
            {/* Session-12 (S12-P6) + Session-27 (S27-P5): NO sparkline on
                Lost Deals, and the $XK amount is the SUBTITLE in the delta
                column (the reference's own won-inline/lost-subtitle split). */}
            <CircleStatCard
              label="Lost Deals"
              value={k?.lostDeals ?? 0}
              subValue={formatCompactCurrency(k?.lostValue ?? 0, { scale: "k", upper: true, decimals: 0 })}
              icon={<TrendingDown className="h-5 w-5" />}
              color="#ef4444"
            />
            {/* Session-10 (S10 VLM round): the reference's Conversion Rate
                chip icon is lucide-target (same as Total Leads) — ours
                rendered Percent. */}
            <CircleStatCard
              label="Conversion Rate"
              value={`${k?.conversionRate ?? 0}%`}
              icon={<Target className="h-5 w-5" />}
              color="#8b5cf6"
            >
              <Sparkline values={[...KPI_STATICS.reportsSpark]} color="#8b5cf6" variant="line" />
            </CircleStatCard>
          </div>

          {/* Session-11 (S11-P5): the reference's tabs are NOT card-wrapped —
              the pill tab bar + panels render bare in the page (a space-y-6
              container directly under the KPI row; content spans the full
              1192px). The session-3 "white card" reading only described the
              sticky filter bar above. The Tabs' own space-y-6 puts 24px
              between the bar and the panel (the reference's TabsContent
              mt-2 is dead CSS under its space-y-6 — same computed gap). */}
          {/* Session-23 (S23-P1): the reference's Tabs region — a space-y-6
              wrapper holding the tablist + the N wired panel shells (each
              with the stock Radix focus-ring family + mt-2, which collapses
              against the wrapper's space-y margin — the s11 24px
              bar-to-panel gap, live-measured). The old built-in panel
              wrapper retired with its space-y-6 className, which moved
              here onto the region wrapper. */}
          <Tabs variant="pill" cols={5} className="space-y-6" value={tab} onValueChange={setTab} tabs={REPORT_TABS.map((t) => ({ id: t.id, label: t.label }))}>
            <TabsPanel tab="sales" className="mt-2">{tab === "sales" && <SalesTab data={data} />}</TabsPanel>
            <TabsPanel tab="pipeline" className="mt-2">{tab === "pipeline" && <PipelineTab data={data} />}</TabsPanel>
            <TabsPanel tab="activity" className="mt-2">{tab === "activity" && <ActivityTab data={data} />}</TabsPanel>
            <TabsPanel tab="sources" className="mt-2">{tab === "sources" && <SourcesTab data={data} />}</TabsPanel>
            {/* Session-83 (N-83c6): the reference's fifth tab id is
                "accounts" (its value:"accounts" — an invisible internal
                id; no URL state, the s24 census). */}
            <TabsPanel tab="accounts" className="mt-2">{tab === "accounts" && <HealthTab data={data} />}</TabsPanel>
          </Tabs>

          {/* Session-25 (S25-P4): the Save Custom Report View dialog —
              the reference's own save/load flow, riding the localStorage
              seam. */}
          <SaveReportDialog
            open={saveDialogOpen}
            onOpenChange={setSaveDialogOpen}
            filters={{ dateRange: period, stage, source: "all", status, owner }}
            savedCount={savedCount}
            savedList={savedList}
            onSave={(name: string, columns: SavedReportColumns) => {
              // Session-44 (S44-P4): the saveReport family rides localStorage
              // (saved-reports.ts setItem) — a quota/private-mode exception
              // used to escape the React event handler uncaught (no toast,
              // the dialog stranded open). The leads-page saveView
              // convention: surface the storage failure.
              try {
                const count = saveReport({
                  name,
                  filters: { dateRange: period, stage, source: "all", status, owner },
                  columns,
                });
                setSavedCount(count);
                setSavedList(listSavedReports());
                setSaveDialogOpen(false);
              } catch {
                toast.error("Could not save report", "Browser storage is unavailable.");
              }
            }}
            onLoad={(report: SavedReport) => {
              // Session-32 (S32-P4): normalize the stored dateRange — stale
              // s25 entries (week/month) migrate to the wire ids; unknown
              // values fall back to "quarter" so a Load never 400s.
              // Session-49 (S49-P1, N-49m): stage/status normalize too —
              // both routes now membership-check them, so a stale saved
              // view must fall back to "all" rather than flip the fetch
              // from silently-EMPTY to silently-STALE data.
              setPeriod(normalizeSavedPeriod(report.filters.dateRange));
              setOwner(report.filters.owner);
              setStage(normalizeSavedStage(report.filters.stage));
              setStatus(normalizeSavedStatus(report.filters.status));
              setSaveDialogOpen(false);
            }}
          />
      </>
    </div>
  );
}

// ---- Tab: Sales Overview ----------------------------------------------------

function SalesTab({ data }: { data: ReportsData | null }) {
  return (
    <div className="space-y-6">
      {/* Session-85 (N-85c2): the reference's cCe renders THREE grid
          children — Revenue+WonLost, then Pipeline+Funnel, then the
          tables (DealTables owns the third). Our single 4-chart grid is
          retired; visually identical (all charts height 300, gap-6). */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue Over Time">
          {/* Session-27 (S27-P3): the reference's tab-1 revenue chart is a
              SINGLE #3b82f6 strokeWidth-2 LINE over {month, revenue} with
              a $ tooltip — NOT the dashboard's won/target areas our
              scaffold reused here. Session-31: the series derives from WON
              OPP amounts by close month ("MMM yyyy" keys, insertion
              order). */}
          <TrendLineChart
            data={(data?.revenueOverTime ?? []).map((r) => ({ month: r.month, revenue: r.revenue }))}
            xKey="month"
            series={[{ key: "revenue", stroke: "#3b82f6" }]}
            formatter={dollarFormatter}
          />
        </ChartCard>
        <ChartCard title="Won vs Lost Over Time">
          {/* Session-27 (S27-P3): grouped BARS with the stock Legend (the
              reference's wonlost family — never the scaffold's lines). */}
          <GroupedBarsChart
            data={data?.wonVsLostOverTime ?? []}
            xKey="month"
            series={[
              { key: "won", name: "Won", fill: "#10b981" },
              { key: "lost", name: "Lost", fill: "#ef4444" },
            ]}
          />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Pipeline by Stage">
          {/* Session-27 (S27-P3): ROW-DERIVED (open deals by stage — EMPTY
              at zero, like the reference) with the violet VALUE bars and
              the "Value ($)" series name on a plain-number tooltip.
              Session-31: the rows are OPEN OPPORTUNITIES grouped by their
              RAW stage slugs (the reference's plain-object grouping).
              Session-74 (L-74c13): the plain toLocaleString formatter —
              the reference's `formatter:p=>p.toLocaleString()` (no $). */}
          <SingleBarChart
            data={(data?.pipelineByStageRows ?? []).map((p) => ({ stage: p.stage, value: p.value }))}
            xKey="stage"
            dataKey="value"
            fill="#8b5cf6"
            name="Value ($)"
            formatter={numberFormatter}
          />
        </ChartCard>
        <ChartCard title="Conversion Funnel">
          {/* Session-27 (S27-P3): the funnel's horizontal bars carry a
              SINGLE cyan fill (#06b6d4) with a stage YAxis at width 100 —
              no per-stage Cells, no radius/maxBarSize. The data is the
              fixed 8-slug bucket list (the s10 quirk register). */}
          <HorizontalBarChart
            data={(data?.pipeline ?? []).map((p) => ({ stage: p.slug, count: p.count }))}
            yKey="stage"
            yWidth={100}
            dataKey="count"
            fill="#06b6d4"
          />
        </ChartCard>
      </div>
      <DealTables data={data} />
    </div>
  );
}

function DealTables({ data }: { data: ReportsData | null }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Won Deals</CardTitle>
        </CardHeader>
        <CardContent className={REPORTS_TABLE_CARD.content}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Session-31: the rows are WON OPPORTUNITIES slice(0,10) —
                  Deal/Account/Amount with the $ toLocaleString cell (the
                  reference's table cells, NOT compact currency). */}
              {(data?.recentWonDeals ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No won deals</TableCell>
                </TableRow>
              ) : (
              data!.recentWonDeals.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  {/* Session-85 (L-85c1): the reference renders d.account_name
                      BARE — no fallback (a null account renders an EMPTY
                      cell; the s82 "$"-alone precedent for invented
                      fallbacks). */}
                  <TableCell>{d.account}</TableCell>
                  <TableCell className="text-right">${(d.amount || 0).toLocaleString()}</TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Deals by Value</CardTitle>
        </CardHeader>
        <CardContent className={REPORTS_TABLE_CARD.content}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Session-31: ALL opportunities amount-desc slice(0,10); the
                  Stage cell is the OUTLINE badge with the RAW slug. */}
              {(data?.topDeals ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No deals</TableCell>
                </TableRow>
              ) : (
              data!.topDeals.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{d.stage}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${(d.amount || 0).toLocaleString()}</TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Tab: Pipeline & Forecast -------------------------------------------------

function PipelineTab({ data }: { data: ReportsData | null }) {
  // Session-10 (S10-8): rebuilt to the reference's tab-2 structure —
  // "Forecasting Accuracy" (WIDE chart + the centered
  // "Average Accuracy: N%" caption), "Pipeline by Stage" (row-derived),
  // "Forecast by Probability", "Aging Pipeline" (the fixed 4 buckets), then
  // the "Open Deals by Stage" + "Deals at Risk" tables with their Export
  // CSV / Export PDF buttons. NO KPI cards (the reference ships none here —
  // our old 4 KPI cards + duplicated DealTables are removed).
  // Session-27 (S27-P4): the chart internals are bundle-pinned — the
  // forecast chart is a TWO-LINE trend (forecasted #3b82f6 / actual
  // #10b981, $ tooltip), the pipeline bars are single-blue VALUE bars,
  // the forecast-by-probability chart is a PIE over the 4 fixed bands,
  // and the aging bars are violet with the "age" XAxis.
  const aging = data?.agingPipeline ?? [];
  return (
    <div className="space-y-6">
      {/* Session-85 (N-85c3): the reference's ZEe ships this ONE header
          with the appended flex-row family (its other tab-2 headers are
          plain) — a structural mirror, visually identical with a single
          title child. */}
      <ChartCard title="Forecasting Accuracy" wide headerClassName="flex flex-row items-center justify-between">
        {/* Session-31: the series is the reference's actual/forecasted
            model — forecasted = amount × (probability||50)/100 per closed
            opp, actual = won amounts, grouped by close month (the s10
            100−|diff| formula retired). */}
        <TrendLineChart
          height={300}
          data={(data?.forecastingAccuracy.points ?? []).map((p) => ({ month: p.month, forecasted: p.forecasted, actual: p.actual }))}
          xKey="month"
          series={[
            { key: "forecasted", name: "Forecasted", stroke: "#3b82f6" },
            { key: "actual", name: "Actual", stroke: "#10b981" },
          ]}
          formatter={dollarFormatter}
        />
        {/* Session-85 (N-85c4): the reference's caption construction —
            div.mt-4.text-center > p.text-sm.text-gray-500 > the span at
            the reference's own class order (font-bold text-lg). */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Average Accuracy:{" "}
            <span className="font-bold text-lg text-gray-900">{data?.forecastingAccuracy.average ?? 0}%</span>
          </p>
        </div>
      </ChartCard>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Pipeline by Stage">
          <SingleBarChart
            data={(data?.pipelineByStageRows ?? []).map((p) => ({ stage: p.stage, value: p.value }))}
            xKey="stage"
            dataKey="value"
            fill="#3b82f6"
            formatter={dollarFormatter}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Forecast by Probability">
          <LabelPieChart
            data={data?.forecastByProbability ?? []}
            outerRadius={90}
            labelFor={(e) => `${e.band}%: $${(Number(e.value ?? 0) / 1e3).toFixed(0)}K`}
            fills={[...REPORTS_PIE_FILLS.four]}
            formatter={dollarFormatter}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Aging Pipeline">
          <SingleBarChart
            data={aging.map((a) => ({ age: a.label, count: a.count }))}
            xKey="age"
            dataKey="count"
            fill="#8b5cf6"
            height={300}
          />
        </ChartCard>
      </div>
      <DealsTables data={data} />
    </div>
  );
}

// Session-25 (S25-P2/P5): the per-table CSV — the reference's
// client-side blob model (its createElement/createObjectURL spies
// observed blob: text/csv), downloading as <prefix>_YYYY-MM-DD.csv with
// the table's OWN column headers (Deal,Stage,Amount / Deal,Account,
// Amount — captured from its downloaded artifacts). NOTE the reference's
// own inconsistency: the CSV prefixes are SHORTER than the PDF slugs
// (open_deals_ vs open_deals_by_stage_ — both captured live); the
// prefix is passed per-button like the reference's own filenames.
function exportTableCsv(filenamePrefix: string, columns: string[], rows: string[][]): void {
  const csv = toCsv(rows, columns.map((header, i) => ({ header, value: (r: string[]) => r[i] ?? "" })));
  downloadBlob(csv, `${filenamePrefix}_${isoDateSuffix()}.csv`, "text/csv");
}

function DealsTables({ data }: { data: ReportsData | null }) {
  // The reference's tab-2 pair: Open Deals by Stage + Deals at Risk (No
  // Activity 14+ Days), each with Export CSV / Export PDF buttons in the
  // card header row. The in-table empty rows carry the exact copy. Both
  // buttons generate from the table's OWN rows (session-25).
  // Session-74 (M-74c6): the reference's own SPLIT — the CSV rows stay
  // RAW (its f/d functions pass `_.amount||0`) while the dB PDF data
  // carries the FORMATTED `$${(amount||0).toLocaleString()}` cells; the
  // at-risk PDF title is the SHORT "Deals at Risk" (its own prop).
  const openRows = (data?.openDealsByStage ?? []).map((l) => [l.deal, l.stage, String(l.amount ?? "")]);
  const riskRows = (data?.dealsAtRisk ?? []).map((l) => [l.deal, l.account ?? "", String(l.amount ?? "")]);
  const openPdfRows = (data?.openDealsByStage ?? []).map((d) => [d.deal, d.stage, `$${(d.amount || 0).toLocaleString()}`]);
  const riskPdfRows = (data?.dealsAtRisk ?? []).map((d) => [d.deal, d.account ?? "", `$${(d.amount || 0).toLocaleString()}`]);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Open Deals by Stage</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportTableCsv("open_deals", ["Deal", "Stage", "Amount"], openRows)}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportTablePdf("Open Deals by Stage", ["Deal", "Stage", "Amount"], openPdfRows)}>
              <FileText className="h-4 w-4 mr-2" /> Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className={REPORTS_TABLE_CARD.content}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Session-31: OPEN OPPORTUNITIES in list order slice(0,10) —
                  the Stage cell is the OUTLINE badge with the RAW slug, the
                  Amount cell the $ toLocaleString form. */}
              {(data?.openDealsByStage ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No open deals</TableCell>
                </TableRow>
              ) : (
              data!.openDealsByStage.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.deal}</TableCell>
                  <TableCell><Badge variant="outline">{d.stage}</Badge></TableCell>
                  <TableCell className="text-right">${(d.amount || 0).toLocaleString()}</TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Deals at Risk (No Activity 14+ Days)</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportTableCsv("deals_at_risk", ["Deal", "Account", "Amount"], riskRows)}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportTablePdf("Deals at Risk", ["Deal", "Account", "Amount"], riskPdfRows)}>
              <FileText className="h-4 w-4 mr-2" /> Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className={REPORTS_TABLE_CARD.content}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Session-31: the reference's at-risk rows carry bg-red-50 —
                  open opps with no linked activity for >14 days, slice(0,20). */}
              {(data?.dealsAtRisk ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No at-risk deals</TableCell>
                </TableRow>
              ) : (
              data!.dealsAtRisk.map((d) => (
                <TableRow key={d.id} className="bg-red-50">
                  <TableCell className="font-medium">{d.deal}</TableCell>
                  {/* Session-85 (L-85c1): the reference's bare
                      p.account_name — the same no-fallback mirror as the
                      Recent Won table. */}
                  <TableCell>{d.account}</TableCell>
                  <TableCell className="text-right">${(d.amount || 0).toLocaleString()}</TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Tab: Activity & Productivity ---------------------------------------------

function ActivityTab({ data }: { data: ReportsData | null }) {
  // Session-10 (S10-8): rebuilt to the reference's tab-3 structure — three
  //   charts (Activities by Type, Activities Over Time, Activities vs Wins)
  //   + the Overdue Activities and Activity Log by Owner tables.
  // Session-27 (S27-P4): the chart internals are bundle-pinned — by-type
  //   is a PIE (`${type}: ${count}` labels, the 5-color palette),
  //   over-time is a SINGLE #3b82f6 line, vs-wins is grouped BARS
  //   (Activities/Won Deals), and the overdue rows carry bg-red-50 +
  //   outline-Badge types.
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Activities by Type">
          <LabelPieChart
            data={(data?.activitiesByType ?? []).map((a) => ({ type: a.label, value: a.count }))}
            outerRadius={90}
            labelFor={(e) => `${e.type}: ${e.value}`}
            fills={[...REPORTS_PIE_FILLS.five]}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Activities Over Time">
          <TrendLineChart
            data={data?.activitiesOverTime ?? []}
            xKey="month"
            series={[{ key: "count", stroke: "#3b82f6" }]}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Activities vs Wins">
          <GroupedBarsChart
            data={data?.activitiesVsWins ?? []}
            xKey="month"
            series={[
              { key: "activities", name: "Activities", fill: "#3b82f6" },
              { key: "wins", name: "Won Deals", fill: "#10b981" },
            ]}
            height={300}
          />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overdue Activities</CardTitle>
          </CardHeader>
          <CardContent className={REPORTS_TABLE_CARD.content}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.overdueActivities ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No overdue activities</TableCell>
                  </TableRow>
                ) : (
                data!.overdueActivities.map((a) => (
                  <TableRow key={a.id} className="bg-red-50">
                    <TableCell className="font-medium">{a.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.type}</Badge>
                    </TableCell>
                    {/* Session-85 (N-85c5): the reference renders
                        Tc(li(f.date), "MMM d, yyyy") BARE — its filter's
                        date-present guard (f.date &&) guarantees the date,
                        so no ternary, no fallback. */}
                    <TableCell>{formatDate(a.dueAt)}</TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity Log by Owner</CardTitle>
          </CardHeader>
          <CardContent className={REPORTS_TABLE_CARD.content}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Activities</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.activitiesByOwner ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className={EMPTY_STATE.reportsRow}>No activities</TableCell>
                  </TableRow>
                ) : (
                data!.activitiesByOwner.map((o) => (
                  <TableRow key={o.name}>
                    <TableCell className="font-medium">{o.name}</TableCell>
                    <TableCell className="text-right">{o.total}</TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- Tab: Lead Sources ----------------------------------------------------------

function SourcesTab({ data }: { data: ReportsData | null }) {
  // Session-10 (S10-8): rebuilt to the reference's tab-4 structure — three
  //   charts (Leads by Source, Win Rate by Source (%), Avg Deal Value by
  //   Source) + the Leads List by Source and Source Performance Summary
  //   tables (Source/Leads/Won/Revenue, empty row "No data").
  // Session-27 (S27-P4): bundle-pinned internals — by-source is a PIE
  //   (`${source}: ${count}` labels, the 5-color palette), win-rate is
  //   #10b981 bars with the % tooltip, avg-value is #8b5cf6 bars with
  //   the $ tooltip.
  const rows = data?.leadSources ?? [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Leads by Source">
          <LabelPieChart
            data={rows.map((r) => ({ source: r.source, value: r.leads }))}
            outerRadius={90}
            labelFor={(e) => `${e.source}: ${e.value}`}
            fills={[...REPORTS_PIE_FILLS.five]}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Win Rate by Source (%)">
          {/* Session-31: the OPPORTUNITY win rate — won/(won+lost) per
              source, one decimal (NOT the lead-based share). */}
          <SingleBarChart
            data={rows.map((r) => ({ source: r.source, winRate: Number(r.winRate) }))}
            xKey="source"
            dataKey="winRate"
            fill="#10b981"
            formatter={percentFormatter}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Avg Deal Value by Source">
          {/* Session-31: the OPPORTUNITY average — Math.round(total/count)
              per source (the API's avgValue). */}
          <SingleBarChart
            data={rows.map((r) => ({
              source: r.source,
              avgValue: r.avgValue,
            }))}
            xKey="source"
            dataKey="avgValue"
            fill="#8b5cf6"
            formatter={dollarFormatter}
            height={300}
          />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leads List by Source</CardTitle>
          </CardHeader>
          <CardContent className={REPORTS_TABLE_CARD.content}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Session-31: ALL opportunities amount-desc slice(0,10);
                    Session-74 (M-74c4): the reference's t3e caps at
                    slice(0,10) — the s31-era 8 dropped rows 9-10. */}
                {(data?.leadsListBySource ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No leads</TableCell>
                  </TableRow>
                ) : (
                data!.leadsListBySource.slice(0, 10).map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell>{l.source || "Unknown"}</TableCell>
                    <TableCell>
                      {/* Session-74 (M-74c5): the reference's t3e renders
                          zn variant="outline" with the RAW status — the
                          source-vocabulary form (our STAGE_META pill was
                          the tinted-badge family bleeding in). */}
                      <Badge variant="outline">{l.stage}</Badge>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Source Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className={REPORTS_TABLE_CARD.content}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Won</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className={EMPTY_STATE.reportsRow}>No data</TableCell>
                  </TableRow>
                ) : (
                rows.map((r) => (
                  <TableRow key={r.source}>
                    <TableCell className="font-medium">{r.source}</TableCell>
                    <TableCell className="text-right">{r.leads}</TableCell>
                    <TableCell className="text-right">{r.won}</TableCell>
                    {/* Session-31: the reference's revenue cell —
                        `$${(revenue/1e3).toFixed(0)}K`. */}
                    <TableCell className="text-right">${(r.revenue / 1e3).toFixed(0)}K</TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- Tab: Account Health ---------------------------------------------------------

function HealthTab({ data }: { data: ReportsData | null }) {
  // Session-27 (S27-P1/P2): the reference's Account Health tab,
  // bundle-extracted — the health distribution PIE (the computed
  // Healthy/Needs Attention/At Risk vocabulary, `${name}: ${value}`
  // labels, the 3-color palette), the horizontal Top 10 by revenue
  // (sorted desc), the red-tinted At Risk table ("Nd ago"/"Never", the
  // red "At Risk" badge), and the Account Summary with outline badges.
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Account Health Distribution">
          <LabelPieChart
            data={data?.accountHealth ?? []}
            outerRadius={100}
            labelFor={(e) => `${e.name}: ${e.value}`}
            fills={[...HEALTH_PIE_FILLS]}
          />
        </ChartCard>
        <ChartCard title="Top 10 Accounts by Revenue">
          <HorizontalBarChart
            data={(data?.topAccounts ?? []).map((a) => ({ name: a.name, revenue: a.revenue }))}
            yKey="name"
            yWidth={120}
            dataKey="revenue"
            fill="#3b82f6"
            formatter={dollarFormatter}
          />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>At Risk Accounts</CardTitle>
          </CardHeader>
          <CardContent className={REPORTS_TABLE_CARD.content}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.atRiskAccounts ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No at-risk accounts</TableCell>
                  </TableRow>
                ) : (
                data!.atRiskAccounts.map((a) => (
                  <TableRow key={a.id} className="bg-red-50">
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>{lastActivityText(a.daysSinceActivity)}</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800">At Risk</Badge>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent className={REPORTS_TABLE_CARD.content}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.accountSummary ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No accounts</TableCell>
                  </TableRow>
                ) : (
                data!.accountSummary.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>{a.industry || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
  wide = false,
  headerClassName,
}: {
  title: string;
  children: React.ReactNode;
  /** Session-10: the tab-2 Forecasting Accuracy card spans the full row
   *  on the reference (1142px at 1512 viewport — DOM-extracted). */
  wide?: boolean;
  /** Session-85 (N-85c3): the reference's ZEe appends the flex-row
   *  family to the Forecasting Accuracy CardHeader — the one per-card
   *  escape (every other chart card keeps the plain base). */
  headerClassName?: string;
}) {
  return (
    <Card className={wide ? "lg:col-span-3" : undefined}>
      <CardHeader className={headerClassName}>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

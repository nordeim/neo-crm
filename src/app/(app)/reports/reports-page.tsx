"use client";

import { downloadBlob, downloadFile } from "@/lib/download";
import * as React from "react";
import { Bookmark, Calendar as CalendarIcon, Download, FileText, RotateCcw, Target, TrendingDown, TrendingUp, User as UserIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsPanel } from "@/components/ui/tabs";
import { CircleStatCard, KpiCard, PageHeader, Sparkline } from "@/components/shared/page-parts";
import { SaveReportDialog } from "@/components/shared/save-report-dialog";
import {
  EMPTY_STATE,
  PAGE_KPI_GRIDS,
  PAGE_ROOT,
  REPORTS_FILTER_BAR,
  REPORTS_TABLE_CARD,
} from "@/lib/page-layout";
import { DonutChart, FunnelBarChart, PipelineBarChart, RevenueLineChart, WonLostLineChart } from "@/components/charts/charts";
import { useCrmStore } from "@/stores/crm-store";
import { LEAD_STAGES, STAGE_META, CHART_COLORS, REPORT_PERIODS, REPORT_TABS } from "@/lib/constants";
import { formatCompactCurrency, formatDate } from "@/lib/format";
import { toCsv } from "@/lib/csv";
import { exportReportsPdf, exportTablePdf, isoDateSuffix } from "@/lib/pdf-export";
import { listSavedReports, saveReport, type SavedReport, type SavedReportColumns } from "@/lib/saved-reports";
import type { ReportsData } from "@/types";

export default function ReportsPage() {
  const { users, fetchReports, hydrated } = useCrmStore();
  const [tab, setTab] = React.useState("sales");
  const [period, setPeriod] = React.useState("quarter");
  const [ownerId, setOwnerId] = React.useState("all");
  const [stage, setStage] = React.useState("all");
  const [status, setStatus] = React.useState("all");
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
      const res = await fetchReports({ period, ownerId, stage, status });
      if (cancelled) return;
      if (res.ok) setData(res.data);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, period, ownerId, stage, status, fetchReports]);

  const k = data?.kpis;

  return (
    // Session-16 (S16-P2): the page owns its padding — the reference's
    // reports root is `p-4 sm:p-8 bg-gray-50 min-h-screen` (the sticky
    // filter bar still sticks to main's top).
    <div className={PAGE_ROOT.standard}>
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
            <Bookmark className="h-4 w-4" /> Saved Reports ({savedCount})
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
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REPORT_PERIODS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={REPORTS_FILTER_BAR.selectWrap}>
              <UserIcon className={REPORTS_FILTER_BAR.selectIcon} />
              <Select value={ownerId} onValueChange={setOwnerId}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {LEAD_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>{STAGE_META[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={REPORTS_FILTER_BAR.actions}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPeriod("quarter");
                setOwnerId("all");
                setStage("all");
                setStatus("all");
              }}
            >
              <RotateCcw className={REPORTS_FILTER_BAR.barBtnIcon} /> Reset
            </Button>
            {/* Session-25 (S25-P5): the reports CSV — the reference's
                crm_report_YYYY-MM-DD.csv (Deal Name, Account, Amount,
                Stage, Source, Owner, Close Date), filter-aware through the
                same params as /api/reports. NOT the leads export it was
                wired to before. */}
            <Button
              size="sm"
              onClick={() =>
                downloadFile(
                  `/api/export?type=report&period=${encodeURIComponent(period)}&ownerId=${encodeURIComponent(ownerId)}&stage=${encodeURIComponent(stage)}&status=${encodeURIComponent(status)}&download=1`,
                )
              }
            >
              <Download className={REPORTS_FILTER_BAR.barBtnIcon} /> Export CSV
            </Button>
            {/* Session-25 (S25-P2): the header PDF — the reference's
                html2canvas + jsPDF full-content capture
                (crm_reports_YYYY-MM-DD.pdf), no print dialog, no toast. */}
            <Button variant="outline" size="sm" onClick={() => void exportReportsPdf()}>
              <FileText className={REPORTS_FILTER_BAR.barBtnIcon} /> PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Session-25 (S25-P1): no skeleton pass — the KPI row renders
          immediately with zeros (the `k?.x ?? 0` reads below). */}
      <>
          {/* Reference KPI row (session-5 anatomy): square rounded-lg tinted
              chips, count + amount INLINE in one text-2xl font-bold value,
              uppercase-K currency on this page ($542.0K won / $196K lost). */}
          <div className={PAGE_KPI_GRIDS.reports}>
            <CircleStatCard label="Total Leads" value={k?.totalLeads ?? 0} icon={<Target className="h-5 w-5" />} color="#3b82f6">
              <Sparkline values={data?.revenueOverTime?.map((r) => r.won) ?? []} color="#3b82f6" variant="line" className="h-full" />
            </CircleStatCard>
            <CircleStatCard label="Open Leads" value={k?.openLeads ?? 0} icon={<Users className="h-5 w-5" />} color="#f97316">
              <Sparkline values={data?.revenueOverTime?.map((r) => r.won) ?? []} color="#f97316" variant="line" className="h-full" />
            </CircleStatCard>
            <CircleStatCard
              label="Won Deals"
              value={<>{" "}{k?.wonDeals ?? 0} {formatCompactCurrency(k?.wonValue ?? 0, { upper: true })}</>}
              icon={<TrendingUp className="h-5 w-5" />}
              color="#10b981"
            >
              <Sparkline values={data?.revenueOverTime?.map((r) => r.won) ?? []} color="#10b981" variant="line" className="h-full" />
            </CircleStatCard>
            {/* Session-12 (S12-P6): the reference's LOST DEALS card ships NO
                sparkline (KPI_SPARK.lostDealsSpark) — only Total Leads /
                Open Leads / Won Deals / Conversion Rate carry one. */}
            <CircleStatCard
              label="Lost Deals"
              value={<>{" "}{k?.lostDeals ?? 0} {formatCompactCurrency(k?.lostValue ?? 0, { upper: true, decimals: 0 })}</>}
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
              <Sparkline values={data?.revenueOverTime?.map((r) => r.won) ?? []} color="#8b5cf6" variant="line" className="h-full" />
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
            <TabsPanel tab="health" className="mt-2">{tab === "health" && <HealthTab data={data} />}</TabsPanel>
          </Tabs>

          {/* Session-25 (S25-P4): the Save Custom Report View dialog —
              the reference's own save/load flow, riding the localStorage
              seam. */}
          <SaveReportDialog
            open={saveDialogOpen}
            onOpenChange={setSaveDialogOpen}
            filters={{ dateRange: period, stage, source: "all", status, owner: ownerId }}
            savedCount={savedCount}
            savedList={savedList}
            onSave={(name: string, columns: SavedReportColumns) => {
              const count = saveReport({
                name,
                filters: { dateRange: period, stage, source: "all", status, owner: ownerId },
                columns,
              });
              setSavedCount(count);
              setSavedList(listSavedReports());
              setSaveDialogOpen(false);
            }}
            onLoad={(report: SavedReport) => {
              setPeriod(report.filters.dateRange);
              setOwnerId(report.filters.owner);
              setStage(report.filters.stage);
              setStatus(report.filters.status);
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue Over Time">
          {/* Reference Sales Overview revenue chart: no legend, both series
              filled areas (mirrors the dashboard chart). */}
          <RevenueLineChart
            hideLegend
            data={data?.revenueOverTime ?? []}
            series={[
              { key: "won", label: "Won", color: CHART_COLORS.emerald, filled: true },
              { key: "target", label: "Target", color: CHART_COLORS.red, filled: true },
            ]}
          />
        </ChartCard>
        <ChartCard title="Won vs Lost Over Time">
          <WonLostLineChart data={data?.wonVsLostOverTime ?? []} />
        </ChartCard>
        <ChartCard title="Pipeline by Stage">
          <PipelineBarChart data={data?.pipeline ?? []} />
        </ChartCard>
        <ChartCard title="Conversion Funnel">
          {/* Session-13 (S13-P8): the reference's reports funnel is a
              HORIZONTAL BAR chart over the 8 raw stage slugs (its own
              pipeline vocabulary), not a trapezoid FunnelChart — the
              pipeline seam (reportsBucketCounts) is the same fixed list. */}
          <FunnelBarChart data={data?.pipeline ?? []} />
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
              {(data?.recentWonDeals ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No won deals</TableCell>
                </TableRow>
              ) : (
              data!.recentWonDeals.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium text-foreground">{l.name}</TableCell>
                  <TableCell className="text-muted">{l.company ?? "—"}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">{formatCompactCurrency(l.value)}</TableCell>
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
              {(data?.topDeals ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No deals</TableCell>
                </TableRow>
              ) : (
              data!.topDeals.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium text-foreground">{l.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STAGE_META[l.stage]?.badge}>
                      {STAGE_META[l.stage]?.label ?? l.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">{formatCompactCurrency(l.value)}</TableCell>
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
  // "Forecasting Accuracy" (WIDE line chart + the centered
  // "Average Accuracy: N%" caption, DOM-extracted: <p class="text-sm
  // text-gray-500"> under the chart), "Pipeline by Stage" (row-derived),
  // "Forecast by Probability", "Aging Pipeline" (the fixed 4 buckets), then
  // the "Open Deals by Stage" + "Deals at Risk" tables with their Export
  // CSV / Export PDF buttons. NO KPI cards (the reference ships none here —
  // our old 4 KPI cards + duplicated DealTables are removed).
  const aging = data?.agingPipeline ?? [];
  return (
    <div className="space-y-6">
      <ChartCard title="Forecasting Accuracy" wide>
        <RevenueLineChart
          height={300}
          data={(data?.forecastingAccuracy.points ?? []).map((p) => ({ month: p.month, accuracy: p.accuracy }))}
          series={[{ key: "accuracy", label: "Accuracy %", color: CHART_COLORS.blue }]}
        />
        <p className="mt-2 text-center text-sm text-gray-500">
          Average Accuracy: {data?.forecastingAccuracy.average ?? 0}%
        </p>
      </ChartCard>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Pipeline by Stage">
          <PipelineBarChart data={(data?.pipelineByStageRows ?? []).map((p) => ({ label: p.label, value: p.value, count: p.count, color: p.color }))} height={300} />
        </ChartCard>
        <ChartCard title="Forecast by Probability">
          <PipelineBarChart
            data={(data?.forecastByProbability ?? []).map((f) => ({ label: f.label, value: f.weighted, count: f.weighted, color: CHART_COLORS.blue }))}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Aging Pipeline">
          <PipelineBarChart
            data={aging.map((a) => ({ label: a.label, value: a.count, count: a.count, color: CHART_COLORS.blue }))}
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
  const openRows = (data?.openDealsByStage ?? []).map((l) => [l.deal, l.stage, String(l.amount ?? "")]);
  const riskRows = (data?.dealsAtRisk ?? []).map((l) => [l.deal, l.account ?? "", String(l.amount ?? "")]);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Open Deals by Stage</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportTableCsv("open_deals", ["Deal", "Stage", "Amount"], openRows)}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportTablePdf("Open Deals by Stage", ["Deal", "Stage", "Amount"], openRows)}>
              <FileText className="h-3.5 w-3.5" /> Export PDF
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
              {(data?.openDealsByStage ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No open deals</TableCell>
                </TableRow>
              ) : (
              data!.openDealsByStage.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium text-foreground">{l.deal}</TableCell>
                  <TableCell className="text-muted">{l.stage}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">{formatCompactCurrency(l.amount)}</TableCell>
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
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportTablePdf("Deals at Risk (No Activity 14+ Days)", ["Deal", "Account", "Amount"], riskRows)}>
              <FileText className="h-3.5 w-3.5" /> Export PDF
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
              {(data?.dealsAtRisk ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No at-risk deals</TableCell>
                </TableRow>
              ) : (
              data!.dealsAtRisk.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium text-foreground">{l.deal}</TableCell>
                  <TableCell className="text-muted">{l.account ?? "—"}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">{formatCompactCurrency(l.amount)}</TableCell>
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
  // row-derived charts (Activities by Type, Activities Over Time,
  // Activities vs Wins) + the Overdue Activities and Activity Log by Owner
  // tables. The old single donut + calls/emails/meetings table are removed.
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Activities by Type">
          <PipelineBarChart
            data={(data?.activitiesByType ?? []).map((a) => ({ label: a.label, value: a.count, count: a.count, color: a.color }))}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Activities Over Time">
          <WonLostLineChart
            data={(data?.activitiesOverTime ?? []).map((m) => ({ month: m.month, won: m.count, lost: 0 }))}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Activities vs Wins">
          <WonLostLineChart
            data={(data?.activitiesVsWins ?? []).map((m) => ({ month: m.month, won: m.activities, lost: m.wins }))}
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
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-foreground">{a.subject}</TableCell>
                    <TableCell className="text-muted">{a.type}</TableCell>
                    <TableCell className="text-muted">{a.dueAt ? formatDate(a.dueAt) : "—"}</TableCell>
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
                    <TableCell className="font-medium text-foreground">{o.name}</TableCell>
                    <TableCell className="text-right text-muted">{o.total}</TableCell>
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
  // charts (Leads by Source, Win Rate by Source (%), Avg Deal Value by
  // Source) + the Leads List by Source and Source Performance Summary
  // tables (Source/Leads/Won/Revenue, empty row "No data").
  const rows = data?.leadSources ?? [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Leads by Source">
          <PipelineBarChart
            data={rows.map((r) => ({ label: r.source, value: r.leads, count: r.leads, color: CHART_COLORS.blue }))}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Win Rate by Source (%)">
          <PipelineBarChart
            data={rows.map((r) => ({ label: r.source, value: r.winRate, count: r.winRate, color: CHART_COLORS.green }))}
            height={300}
          />
        </ChartCard>
        <ChartCard title="Avg Deal Value by Source">
          <PipelineBarChart
            data={rows.map((r) => ({ label: r.source, value: r.value, count: r.value, color: CHART_COLORS.violet }))}
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
                {(data?.leadsListBySource ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className={EMPTY_STATE.reportsRow}>No leads</TableCell>
                  </TableRow>
                ) : (
                data!.leadsListBySource.slice(0, 8).map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium text-foreground">{l.name}</TableCell>
                    <TableCell className="text-muted">{l.source || "Unknown"}</TableCell>
                    <TableCell>
                      <span className={STAGE_META[l.stage]?.badge ?? ""}>{STAGE_META[l.stage]?.label ?? l.stage}</span>
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
                    <TableCell className="font-medium text-foreground">{r.source}</TableCell>
                    <TableCell className="text-right text-muted">{r.leads}</TableCell>
                    <TableCell className="text-right text-muted">{r.won}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{formatCompactCurrency(r.value)}</TableCell>
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Account Health Distribution">
          <DonutChart
            data={(data?.accountHealth ?? []).map((a) => ({ name: a.label, value: a.count, color: a.color }))}
          />
        </ChartCard>
        <ChartCard title="Top 10 Accounts by Revenue">
          <PipelineBarChart
            data={(data?.topAccounts ?? []).map((a, i) => ({
              label: a.name.length > 12 ? `${a.name.slice(0, 12)}…` : a.name,
              count: i + 1,
              value: a.revenue,
              color: CHART_COLORS.blue,
            }))}
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
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-foreground">{a.name}</TableCell>
                    <TableCell className="text-muted">{a.lastActivityAt ? formatDate(a.lastActivityAt) : "—"}</TableCell>
                    <TableCell className="capitalize text-muted">{a.status}</TableCell>
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
                    <TableCell className="font-medium text-foreground">{a.name}</TableCell>
                    <TableCell className="text-muted">{a.industry ?? "—"}</TableCell>
                    <TableCell className="capitalize text-muted">{a.status}</TableCell>
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
}: {
  title: string;
  children: React.ReactNode;
  /** Session-10: the tab-2 Forecasting Accuracy card spans the full row
   *  on the reference (1142px at 1512 viewport — DOM-extracted). */
  wide?: boolean;
}) {
  return (
    <Card className={wide ? "lg:col-span-3" : undefined}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

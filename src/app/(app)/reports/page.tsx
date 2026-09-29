"use client";

import { downloadFile } from "@/lib/download";
import * as React from "react";
import { Bookmark, Calendar as CalendarIcon, Download, FileText, RotateCcw, Target, TrendingDown, TrendingUp, User as UserIcon, Users, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/tabs";
import { CircleStatCard, KpiCard, PageHeader, Sparkline } from "@/components/shared/page-parts";
import { PAGE_KPI_GRIDS, REPORTS_FILTER_BAR } from "@/lib/page-layout";
import { ConversionFunnel, DonutChart, PipelineBarChart, RevenueLineChart, WonLostLineChart } from "@/components/charts/charts";
import { useCrmStore } from "@/stores/crm-store";
import { LEAD_STAGES, STAGE_META, CHART_COLORS, REPORT_PERIODS, REPORT_TABS } from "@/lib/constants";
import { formatCompactCurrency, formatDate } from "@/lib/format";
import { toast } from "@/components/ui/toast";
import type { ReportsData } from "@/types";

export default function ReportsPage() {
  const { users, fetchReports, hydrated } = useCrmStore();
  const [tab, setTab] = React.useState("sales");
  const [period, setPeriod] = React.useState("this_quarter");
  const [ownerId, setOwnerId] = React.useState("all");
  const [stage, setStage] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [data, setData] = React.useState<ReportsData | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      await Promise.resolve(); // yield: all setState happens in async continuations
      if (cancelled) return;
      setLoading(true);
      const res = await fetchReports({ period, ownerId, stage, status });
      if (cancelled) return;
      if (res.ok) setData(res.data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, period, ownerId, stage, status, fetchReports]);

  function exportPdf() {
    window.print();
    toast.info("Print dialog opened", "Choose “Save as PDF” to export this report.");
  }

  const k = data?.kpis;

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive CRM reporting hub"
        subtitleSize="sm"
        actions={
          <Button
            variant="outline"
            onClick={() => toast.info("Saved reports", "You have no saved reports yet — configure filters and save one from here.")}
          >
            <Bookmark className="h-4 w-4" /> Saved Reports (0)
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
                setPeriod("this_quarter");
                setOwnerId("all");
                setStage("all");
                setStatus("all");
              }}
            >
              <RotateCcw className={REPORTS_FILTER_BAR.barBtnIcon} /> Reset
            </Button>
            <Button size="sm" onClick={() => downloadFile("/api/export?type=leads&download=1")}>
              <Download className={REPORTS_FILTER_BAR.barBtnIcon} /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportPdf}>
              <FileText className={REPORTS_FILTER_BAR.barBtnIcon} /> PDF
            </Button>
          </div>
        </div>
      </div>

      {loading && !data ? (
        <div className={PAGE_KPI_GRIDS.reports}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[118px]" />
          ))}
        </div>
      ) : (
        <>
          {/* Reference KPI row (session-5 anatomy): square rounded-lg tinted
              chips, count + amount INLINE in one text-2xl font-bold value,
              uppercase-K currency on this page ($542.0K won / $196K lost). */}
          <div className={PAGE_KPI_GRIDS.reports}>
            <CircleStatCard label="Total Leads" value={k?.totalLeads ?? 0} icon={<Target className="h-5 w-5" />} color="#3b82f6">
              <Sparkline values={data?.revenueOverTime?.map((r) => r.won) ?? []} color="#3b82f6" variant="line" className="h-6" />
            </CircleStatCard>
            <CircleStatCard label="Open Leads" value={k?.openLeads ?? 0} icon={<Users className="h-5 w-5" />} color="#f97316">
              <Sparkline values={data?.revenueOverTime?.map((r) => r.won) ?? []} color="#f97316" variant="line" className="h-6" />
            </CircleStatCard>
            <CircleStatCard
              label="Won Deals"
              value={<>{" "}{k?.wonDeals ?? 0} {formatCompactCurrency(k?.wonValue ?? 0, { upper: true })}</>}
              icon={<TrendingUp className="h-5 w-5" />}
              color="#10b981"
            >
              <Sparkline values={data?.revenueOverTime?.map((r) => r.won) ?? []} color="#10b981" variant="line" className="h-6" />
            </CircleStatCard>
            <CircleStatCard
              label="Lost Deals"
              value={<>{" "}{k?.lostDeals ?? 0} {formatCompactCurrency(k?.lostValue ?? 0, { upper: true, decimals: 0 })}</>}
              icon={<TrendingDown className="h-5 w-5" />}
              color="#ef4444"
            >
              <Sparkline values={data?.wonVsLostOverTime?.map((r) => r.lost) ?? []} color="#ef4444" variant="line" className="h-6" />
            </CircleStatCard>
            <CircleStatCard
              label="Conversion Rate"
              value={`${k?.conversionRate ?? 0}%`}
              icon={<Percent className="h-5 w-5" />}
              color="#8b5cf6"
            >
              <Sparkline values={data?.revenueOverTime?.map((r) => r.won) ?? []} color="#8b5cf6" variant="line" className="h-6" />
            </CircleStatCard>
          </div>

          <Card className="mt-6">
            <CardContent className="py-4">
              <Tabs variant="pill" cols={5} value={tab} onValueChange={setTab} tabs={REPORT_TABS.map((t) => ({ id: t.id, label: t.label }))}>
                {loading ? (
                  <div className="grid gap-4 py-6 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-64" />
                    ))}
                  </div>
                ) : (
                  <div className="py-4">
                    {tab === "sales" && <SalesTab data={data} />}
                    {tab === "pipeline" && <PipelineTab data={data} />}
                    {tab === "activity" && <ActivityTab data={data} />}
                    {tab === "sources" && <SourcesTab data={data} />}
                    {tab === "health" && <HealthTab data={data} />}
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// ---- Tab: Sales Overview ----------------------------------------------------

function SalesTab({ data }: { data: ReportsData | null }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
          <ConversionFunnel data={data?.funnel ?? []} />
        </ChartCard>
      </div>
      <DealTables data={data} />
    </div>
  );
}

function DealTables({ data }: { data: ReportsData | null }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Won Deals</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {(data?.recentWonDeals ?? []).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No won deals</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data!.recentWonDeals.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium text-foreground">{l.name}</TableCell>
                    <TableCell className="text-muted">{l.company ?? "—"}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{formatCompactCurrency(l.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Deals by Value</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {(data?.topDeals ?? []).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No deals</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data!.topDeals.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium text-foreground">{l.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STAGE_META[l.stage]?.badge}>
                        {STAGE_META[l.stage]?.label ?? l.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{formatCompactCurrency(l.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Tab: Pipeline & Forecast -------------------------------------------------

function PipelineTab({ data }: { data: ReportsData | null }) {
  const pipeline = data?.pipeline ?? [];
  const open = pipeline.filter((p) => p.stage !== "won");
  const weighted = open.reduce((s, p) => s + p.value * (p.stage === "negotiation" ? 0.6 : p.stage === "proposal" ? 0.4 : p.stage === "qualified" ? 0.25 : 0.1), 0);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Open Pipeline" value={formatCompactCurrency(open.reduce((s, p) => s + p.value, 0))} />
        <KpiCard label="Weighted Forecast" value={formatCompactCurrency(weighted)} />
        <KpiCard label="Best Case" value={formatCompactCurrency(open.reduce((s, p) => s + p.value, 0) + (data?.kpis.wonValue ?? 0))} />
        <KpiCard label="Avg. Deal Size" value={formatCompactCurrency(pipeline.length ? pipeline.reduce((s, p) => s + p.value, 0) / pipeline.reduce((s, p) => s + p.count, 0) : 0)} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Pipeline by Stage">
          <PipelineBarChart data={pipeline} />
        </ChartCard>
        <ChartCard title="Revenue Over Time">
          <RevenueLineChart
            data={data?.revenueOverTime ?? []}
            series={[
              { key: "won", label: "Won", color: CHART_COLORS.green },
              { key: "lost", label: "Lost", color: CHART_COLORS.red },
              { key: "target", label: "Target", color: CHART_COLORS.blue, dashed: true },
            ]}
          />
        </ChartCard>
      </div>
      <DealTables data={data} />
    </div>
  );
}

// ---- Tab: Activity & Productivity ---------------------------------------------

function ActivityTab({ data }: { data: ReportsData | null }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Activities by Type">
          <DonutChart
            data={(data?.activitiesByType ?? []).map((a) => ({ name: a.label, value: a.count, color: a.color }))}
          />
        </ChartCard>
        <Card>
          <CardHeader>
            <CardTitle>Activity by Owner</CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-0">
            {(data?.activitiesByOwner ?? []).length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">No activity in this period</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Calls</TableHead>
                    <TableHead className="text-right">Emails</TableHead>
                    <TableHead className="text-right">Meetings</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data!.activitiesByOwner.map((o) => (
                    <TableRow key={o.name}>
                      <TableCell className="font-medium text-foreground">{o.name}</TableCell>
                      <TableCell className="text-right text-muted">{o.calls}</TableCell>
                      <TableCell className="text-right text-muted">{o.emails}</TableCell>
                      <TableCell className="text-right text-muted">{o.meetings}</TableCell>
                      <TableCell className="text-right font-semibold text-foreground">{o.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- Tab: Lead Sources ----------------------------------------------------------

function SourcesTab({ data }: { data: ReportsData | null }) {
  const rows = data?.leadSources ?? [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Source Performance</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No lead data</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Won</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
                <TableHead className="text-right">Won Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.source}>
                  <TableCell className="font-medium text-foreground">{r.source}</TableCell>
                  <TableCell className="text-right text-muted">{r.leads}</TableCell>
                  <TableCell className="text-right text-muted">{r.won}</TableCell>
                  <TableCell className="text-right text-muted">{r.winRate}%</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">{formatCompactCurrency(r.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Tab: Account Health ---------------------------------------------------------

function HealthTab({ data }: { data: ReportsData | null }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>At Risk Accounts</CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-0">
            {(data?.atRiskAccounts ?? []).length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">No at-risk accounts</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data!.atRiskAccounts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-foreground">{a.name}</TableCell>
                      <TableCell className="text-muted">{a.lastActivityAt ? formatDate(a.lastActivityAt) : "—"}</TableCell>
                      <TableCell className="capitalize text-muted">{a.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-0">
            {(data?.accountSummary ?? []).length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">No accounts</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data!.accountSummary.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-foreground">{a.name}</TableCell>
                      <TableCell className="text-muted">{a.industry ?? "—"}</TableCell>
                      <TableCell className="capitalize text-muted">{a.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

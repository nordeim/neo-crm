"use client";

import { downloadFile } from "@/lib/download";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Filter,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/misc";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { KpiCard, PageHeader, Sparkline } from "@/components/shared/page-parts";
import { PipelineBarChart, RevenueLineChart } from "@/components/charts/charts";
import { AccountDialog, ActivityDialog, ContactDialog, EventDialog, LeadDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { STAGE_META, CHART_COLORS, LEAD_SOURCES } from "@/lib/constants";
import { formatCompactCurrency, formatDate, timeUntil } from "@/lib/format";
import { ACTIVITY_TYPE_META } from "@/lib/constants";

type QuickCreate = "lead" | "contact" | "account" | "event" | "activity" | null;

export default function DashboardPage() {
  const router = useRouter();
  const { dashboard, users, hydrated, fetchDashboard } = useCrmStore();
  const [stage, setStage] = React.useState("all");
  const [source, setSource] = React.useState("all");
  const [owner, setOwner] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [quickCreate, setQuickCreate] = React.useState<QuickCreate>(null);

  React.useEffect(() => {
    if (hydrated) fetchDashboard();
  }, [hydrated, fetchDashboard]);

  // Client-side filtered deal rows (Recent Deals respects the filter bar).
  const filteredDeals = React.useMemo(() => {
    let rows = dashboard?.recentDeals ?? [];
    if (stage !== "all") rows = rows.filter((l) => l.stage === stage);
    if (source !== "all") rows = rows.filter((l) => l.source === source);
    if (owner !== "all") rows = rows.filter((l) => l.ownerId === owner);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (l) => l.name.toLowerCase().includes(q) || (l.company ?? "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [dashboard, stage, source, owner, search]);

  const k = dashboard?.kpis;
  // Monthly won revenue — feeds the KPI sparklines (Deals Closed / Revenue /
  // Sales Target), mirroring the reference dashboard's bar strips.
  const rev = dashboard?.revenueOverTime ?? [];
  const sparkWon = rev.map((r) => r.won);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        actions={
          <>
            <Dropdown>
              <DropdownTrigger asChild>
                {/* Reference trigger: plus icon + "Add" only — no chevron. */}
                <Button variant="secondary">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </DropdownTrigger>
              <DropdownContent align="end">
                <DropdownItem onClick={() => setQuickCreate("lead")}><Target className="h-4 w-4 text-muted" /> Lead</DropdownItem>
                <DropdownItem onClick={() => setQuickCreate("contact")}><Users className="h-4 w-4 text-muted" /> Contact</DropdownItem>
                <DropdownItem onClick={() => setQuickCreate("account")}><TrendingUp className="h-4 w-4 text-muted" /> Account</DropdownItem>
                <DropdownItem onClick={() => setQuickCreate("event")}><Phone className="h-4 w-4 text-muted" /> Event</DropdownItem>
                <DropdownItem onClick={() => setQuickCreate("activity")}><Zap className="h-4 w-4 text-muted" /> Activity</DropdownItem>
              </DropdownContent>
            </Dropdown>
            {/* The reference ships two adjacent Export buttons (its own
                template quirk). We keep the exact visual but give each a
                distinct job: outline opens the export menu, filled is the
                one-click leads export. */}
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant="secondary">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </DropdownTrigger>
              <DropdownContent align="end">
                <DropdownItem onClick={() => downloadFile("/api/export?type=leads&download=1")}>Leads</DropdownItem>
                <DropdownItem onClick={() => downloadFile("/api/export?type=contacts&download=1")}>Contacts</DropdownItem>
                <DropdownItem onClick={() => downloadFile("/api/export?type=accounts&download=1")}>Accounts</DropdownItem>
                <DropdownItem onClick={() => downloadFile("/api/export?type=activities&download=1")}>Activities</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <Button
              variant="default"
              onClick={() => {
                downloadFile("/api/export?type=leads&download=1");
              }}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </>
        }
      />

      {/* KPI row */}
      {!k ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[118px]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Total Leads" value={k.totalLeads} delta={k.totalLeadsDelta ?? undefined}>
            <Sparkline values={sparkWon} color={CHART_COLORS.emerald} variant="line" />
          </KpiCard>
          <KpiCard label="Deals Closed" value={formatCompactCurrency(k.dealsClosedValue)}>
            <Sparkline values={sparkWon} color={CHART_COLORS.cyan400} />
          </KpiCard>
          <KpiCard label="Revenue This Month" value={formatCompactCurrency(k.revenueThisMonth)} delta={k.revenueDelta ?? undefined}>
            <Sparkline values={sparkWon} color={CHART_COLORS.green400} />
          </KpiCard>
          <KpiCard
            label="Sales Target"
            value={formatCompactCurrency(k.salesTarget)}
            delta={k.salesTargetProgress}
          >
            <Sparkline
              values={rev.map((r) => Math.max(r.won, r.target))}
              colorFor={(_, i) => (rev[i].won >= rev[i].target ? CHART_COLORS.blue : CHART_COLORS.amber400)}
              color={CHART_COLORS.amber400}
            />
          </KpiCard>
          <KpiCard label="Conversion Rate" value={`${k.conversionRate}%`}>
            <Sparkline values={sparkWon} color={CHART_COLORS.violet} variant="area" />
          </KpiCard>
          <KpiCard
            label="Avg. Sales Cycle"
            value={<>{k.avgSalesCycleDays}<span className="ml-1 text-sm font-medium text-muted">days</span></>}
            delta={k.avgSalesCycleDelta ?? undefined}
            deltaSuffix="d"
            invertDelta
          >
            <Sparkline values={sparkWon} color={CHART_COLORS.emerald} variant="line" />
          </KpiCard>
        </div>
      )}

      {/* Filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" className="h-9">
          <Filter className="h-3.5 w-3.5" /> Filter
        </Button>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"].map((s) => (
              <SelectItem key={s} value={s}>{STAGE_META[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Owner filter — the reference renders this dropdown with an empty
            label (its own defect); here it is a real, working control. */}
        <Select value={owner} onValueChange={setOwner}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Owners</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {LEAD_SOURCES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Stage: Source" className="pl-9" aria-label="Filter deals" />
        </div>
        <button
          type="button"
          onClick={() => router.push("/leads")}
          className="ml-auto hidden text-xs font-medium text-primary hover:underline sm:block"
        >
          More...
        </button>
      </div>

      {/* Charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Sales Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineBarChart data={dashboard?.pipeline ?? []} />
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Revenue Over Time</CardTitle>
            <span className="text-xs text-muted">Last 6 months</span>
          </CardHeader>
          <CardContent>
            <RevenueLineChart
              data={dashboard?.revenueOverTime ?? []}
              series={[
                // Both series are filled Areas on the reference (DOM-verified
                // recharts-area-area ×2: Won #10b981, Target #ef4444).
                { key: "won", label: "Won", color: CHART_COLORS.emerald, filled: true },
                { key: "target", label: "Target", color: CHART_COLORS.red, filled: true },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Lists row — reference ships exactly three cards here. */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Top Performing Sales Reps</CardTitle>
            <Button variant="ghost" size="iconSm" aria-label="More actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-2.5">
            {(dashboard?.topReps ?? []).length === 0 ? (
              <p className="px-2.5 py-6 text-center text-xs text-muted">No reps yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] tracking-wide text-subtle">
                    <th className="px-2.5 pb-2 font-medium">Sales Rep</th>
                    <th className="px-2.5 pb-2 text-right font-medium">Deals</th>
                    <th className="px-2.5 pb-2 font-medium">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {(dashboard?.topReps ?? []).map((r) => (
                    <tr key={r.id} className="border-t border-line/70">
                      <td className="px-2.5 py-2">
                        <span className="flex items-center gap-2">
                          <Avatar name={r.name} color={r.avatarColor} size="sm" />
                          <span className="truncate font-medium text-foreground">{r.name}</span>
                        </span>
                      </td>
                      <td className="px-2.5 py-2 text-right">
                        <span className="font-semibold text-foreground">{r.deals}</span>
                        <span className="block text-[11px] text-muted">{formatCompactCurrency(r.value)}</span>
                      </td>
                      <td className="px-2.5 py-2 text-xs text-muted">{r.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Lead Sources</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setQuickCreate("lead")}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            {(dashboard?.leadSources ?? []).length === 0 ? (
              <p className="py-6 text-center text-xs text-muted">No lead sources yet</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {(dashboard?.leadSources ?? []).slice(0, 6).map((s) => {
                  const max = dashboard?.leadSources[0]?.count || 1;
                  return (
                    <div key={s.source}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{s.source}</span>
                        <span className="text-muted">{s.count}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.max(6, Math.round((s.count / max) * 100))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Upcoming Activities</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setQuickCreate("activity")}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            {(dashboard?.upcomingActivities ?? []).length === 0 ? (
              <p className="py-6 text-center text-xs text-muted">No upcoming activities</p>
            ) : (
              <div className="flex flex-col gap-3">
                {(dashboard?.upcomingActivities ?? []).slice(0, 5).map((a) => {
                  const meta = ACTIVITY_TYPE_META[a.type] ?? ACTIVITY_TYPE_META.call;
                  return (
                    <div key={a.id} className="flex items-start gap-2.5">
                      <span
                        className="mt-1 h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">{a.subject}</p>
                        <p className="text-[11px] text-muted">
                          {meta.label} · {a.dueAt ? timeUntil(a.dueAt) : "—"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent deals */}
      <Card className="mt-4">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Deals</CardTitle>
          <Button variant="ghost" size="iconSm" aria-label="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          {filteredDeals.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">No deals match the current filters</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Deal Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Close Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium text-foreground">{l.name}</TableCell>
                    <TableCell className="text-muted">{l.company ?? "—"}</TableCell>
                    <TableCell className="font-semibold text-foreground">{formatCompactCurrency(l.value)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STAGE_META[l.stage]?.badge}>
                        {STAGE_META[l.stage]?.label ?? l.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {l.owner && <Avatar name={l.owner.name} color={l.owner.avatarColor} size="sm" />}
                        <span className="text-muted">{l.owner?.name ?? "Unassigned"}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-muted">{formatDate(l.closedAt ?? l.expectedCloseDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick-create dialogs */}
      <LeadDialog open={quickCreate === "lead"} onOpenChange={(o) => !o && setQuickCreate(null)} />
      <ContactDialog open={quickCreate === "contact"} onOpenChange={(o) => !o && setQuickCreate(null)} />
      <AccountDialog open={quickCreate === "account"} onOpenChange={(o) => !o && setQuickCreate(null)} />
      <EventDialog open={quickCreate === "event"} onOpenChange={(o) => !o && setQuickCreate(null)} />
      <ActivityDialog open={quickCreate === "activity"} onOpenChange={(o) => !o && setQuickCreate(null)} />
    </div>
  );
}

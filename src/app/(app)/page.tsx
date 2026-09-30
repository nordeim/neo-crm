"use client";

import { downloadFile } from "@/lib/download";
import {
  DASHBOARD_CARD,
  DASHBOARD_HEADER,
  PAGE_KPI_GRIDS,
  PAGE_ROOT,
  FILTER_BAR,
  VIEW_SWITCHER,
  EMPTY_STATE,
  TOP_REPS,
  CARD_TITLE_OVERRIDE,
} from "@/lib/page-layout";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { FilterPolygon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { STAGE_META, CHART_COLORS, LEAD_SOURCES, PIPELINE_STAGES, PIPELINE_LABELS } from "@/lib/constants";
import { formatCompactCurrency, formatDate, timeUntil } from "@/lib/format";
import { ACTIVITY_TYPE_META } from "@/lib/constants";

type QuickCreate = "lead" | "contact" | "account" | "event" | "activity" | null;

export default function DashboardPage() {
  const router = useRouter();
  const { dashboard, hydrated, fetchDashboard } = useCrmStore();
  const [stage, setStage] = React.useState("all");
  const [source, setSource] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [quickCreate, setQuickCreate] = React.useState<QuickCreate>(null);
  // S8-2: the reference's middle filter-bar select is a dead Table/Cards
  // view-switcher rendered with an EMPTY label. Ours keeps the empty default
  // (mirror) and actually switches the Recent Deals section (functional
  // superset). "" behaves as Table until the user picks one.
  const [dealsView, setDealsView] = React.useState<string>("");

  React.useEffect(() => {
    if (hydrated) fetchDashboard();
  }, [hydrated, fetchDashboard]);

  // Client-side filtered deal rows (Recent Deals respects the filter bar).
  const filteredDeals = React.useMemo(() => {
    let rows = dashboard?.recentDeals ?? [];
    if (stage !== "all") rows = rows.filter((l) => l.stage === stage);
    if (source !== "all") rows = rows.filter((l) => l.source === source);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (l) => l.name.toLowerCase().includes(q) || (l.company ?? "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [dashboard, stage, source, search]);

  const k = dashboard?.kpis;
  // Monthly won revenue — feeds the KPI sparklines (Deals Closed / Revenue /
  // Sales Target), mirroring the reference dashboard's bar strips.
  const rev = dashboard?.revenueOverTime ?? [];
  const sparkWon = rev.map((r) => r.won);

  return (
    // Session-16 (S16-P2): the page owns its padding (the shell-level
    // wrapper retired) — the reference's dashboard root is
    // `p-4 sm:p-8 bg-gray-50 min-h-screen` (bg-background = #f9fafb
    // computes equal).
    <div className={PAGE_ROOT.standard}>
      <PageHeader
        title="Dashboard"
        actions={
          <>
            <Dropdown>
              <DropdownTrigger asChild>
                {/* Session-6 anatomy: outline h-8 px-3 text-xs with the label
                    hidden below sm (reference: border-input bg-background
                    shadow-sm h-8 rounded-md px-3 text-xs + span.hidden
                    sm:inline). */}
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add</span>
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
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownTrigger>
              <DropdownContent align="end">
                <DropdownItem onClick={() => downloadFile("/api/export?type=leads&download=1")}>Leads</DropdownItem>
                <DropdownItem onClick={() => downloadFile("/api/export?type=contacts&download=1")}>Contacts</DropdownItem>
                <DropdownItem onClick={() => downloadFile("/api/export?type=accounts&download=1")}>Accounts</DropdownItem>
                <DropdownItem onClick={() => downloadFile("/api/export?type=activities&download=1")}>Activities</DropdownItem>
              </DropdownContent>
            </Dropdown>
            {/* Session-8 (S8-1): the reference's primary Export renders its
                label as a BARE always-visible text node (not hidden below
                sm like the outline Export) — re-pinned from the live DOM. */}
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                downloadFile("/api/export?type=leads&download=1");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              {DASHBOARD_HEADER.primaryExportLabel}
            </Button>
          </>
        }
      />

      {/* KPI row */}
      {!k ? (
        <div className={PAGE_KPI_GRIDS.dashboard}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[118px]" />
          ))}
        </div>
      ) : (
        <div className={PAGE_KPI_GRIDS.dashboard}>
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
          {/* Session-13 (S13-P10): the reference's Avg. Sales Cycle card
              carries NO delta — value + "days" unit only (its other KPI
              cards DO render deltas at zero data, so a delta element here
              would render if it existed). Our "+1d" delta is retired. */}
          <KpiCard
            label="Avg. Sales Cycle"
            value={k.avgSalesCycleDays}
            suffix="days"
          >
            <Sparkline values={sparkWon} color={CHART_COLORS.emerald} variant="line" />
          </KpiCard>
        </div>
      )}

      {/* Filter bar — session-6: the reference wraps these controls in a
          white card (bg-white rounded-lg shadow mb-6 p-4) whose contents
          stack on phones (flex flex-col sm:flex-row gap-3); Filter = outline
          h-8 with a hidden-sm label. */}
      <div className={FILTER_BAR.card}>
        <div className={FILTER_BAR.row}>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <FilterPolygon className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span>
        </Button>
        {/* Session-5: the reference's All Stages filter offers the PIPELINE
            stages (Prospecting/Qualification/Proposal/Negotiation/Won) — the
            same labels the pipeline chart above it renders. */}
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {PIPELINE_STAGES.map((s) => (
              <SelectItem key={s} value={s}>{PIPELINE_LABELS[s] ?? s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Session-8 (S8-2): the reference's middle select is a dead
            Table/Cards view-switcher with an EMPTY label (the session-2
            "All Owners" reading was a misinterpretation of that empty
            trigger). Mirror the empty default; make the switch real for
            the Recent Deals section below. */}
        <Select value={dealsView} onValueChange={setDealsView}>
          <SelectTrigger className={VIEW_SWITCHER.trigger} aria-label="Recent deals view">
            <SelectValue placeholder={VIEW_SWITCHER.emptyLabel} />
          </SelectTrigger>
          <SelectContent>
            {VIEW_SWITCHER.options.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {LEAD_SOURCES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className={FILTER_BAR.searchWrap}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Stage: Source" className="pl-9" aria-label="Filter deals" />
        </div>
        {/* Session-6: "More..." is a ghost h-8 button on the reference
            (hover:bg-accent h-8 px-3 text-xs) — not a text link. */}
        <Button variant="ghost" size="sm" className="sm:ml-auto" onClick={() => router.push("/leads")}>
          More...
        </Button>
        </div>
      </div>

      {/* Charts — session-6: plain lg:grid-cols-2 gap-6 (the reference has
          no 3/2 col-span split). */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Sales Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineBarChart data={dashboard?.pipeline ?? []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Revenue Over Time</CardTitle>
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

      {/* Lists row — reference ships exactly three cards here (session-6:
          lg:grid-cols-3 gap-6 mb-6). */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Top Performing Sales Reps</CardTitle>
            {/* Session-7 (S7-18): ellipsis actions are ghost h-8 w-8. */}
            <Button variant="ghost" size="sm" className={DASHBOARD_CARD.ellipsisBtn} aria-label="More actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Session-9 (S9-17): the reference renders this card as a DIV
                list, not a table — a bordered header row (Sales Rep left,
                Deals/Owner right in a flex gap-8) inside space-y-4. At zero
                data it renders the header row alone (no empty state). */}
            <div className="space-y-4">
              <div className={TOP_REPS.headerRow}>
                <span>Sales Rep</span>
                <div className={TOP_REPS.colRight}>
                  <span>Deals</span>
                  <span>Owner</span>
                </div>
              </div>
              {(dashboard?.topReps ?? []).map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <Avatar name={r.name} color={r.avatarColor} size="sm" />
                    <span className="truncate font-medium text-foreground">{r.name}</span>
                  </span>
                  <div className="flex items-center gap-8">
                    <span className="text-right">
                      <span className="font-semibold text-foreground">{r.deals}</span>
                      <span className="block text-[11px] text-muted">{formatCompactCurrency(r.value)}</span>
                    </span>
                    <span className="text-xs text-muted">{r.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Lead Sources</CardTitle>
            {/* Session-7 (S7-18): ghost h-8 blue-text Add with mr-1 plus. */}
            <Button
              variant="ghost"
              size="sm"
              className={DASHBOARD_CARD.addBtn}
              onClick={() => setQuickCreate("lead")}
            >
              <Plus className={DASHBOARD_CARD.addIcon} /> Add
            </Button>
          </CardHeader>
          <CardContent>
            {/* Session-9 (S9-10): at zero data the reference renders an
                EMPTY space-y-3 container — no empty-state paragraph. */}
            {(dashboard?.leadSources ?? []).length === 0 ? (
              <div className="space-y-3" />
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
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Upcoming Activities</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className={DASHBOARD_CARD.addBtn}
              onClick={() => setQuickCreate("activity")}
            >
              <Plus className={DASHBOARD_CARD.addIcon} /> Add
            </Button>
          </CardHeader>
          <CardContent>
            {(dashboard?.upcomingActivities ?? []).length === 0 ? (
              <p className={EMPTY_STATE.dashboardList}>No upcoming activities</p>
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

      {/* Recent deals — session-5: the reference renders this as a COMPACT
          custom table (tr text-xs text-gray-500, th py-2 font-medium, no
          horizontal cell padding — the card's p-6 provides the gutters) plus
          a trailing w-8 action column. Session-9 (S9-9): the reference's
          DUPLICATE "Status" column is now MIRRORED (visible quirk —
          strict-mirror precedent: the "Add new industrie" typo, dead
          controls, empty-label selects); the cells render the same badge
          twice. */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Recent Deals</CardTitle>
          <Button variant="ghost" size="sm" className={DASHBOARD_CARD.ellipsisBtn} aria-label="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Session-9 (S9-9): at zero rows the reference renders the
              compact table with an EMPTY tbody — the old empty-state
              paragraph is removed; the Cards superset keeps its grid. */}
          {filteredDeals.length === 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line text-xs text-muted">
                    <th className="py-2 text-left font-medium">Lead</th>
                    <th className="py-2 text-left font-medium">Company</th>
                    <th className="py-2 text-left font-medium">Deal Value</th>
                    <th className="py-2 text-left font-medium">Status</th>
                    <th className="py-2 text-left font-medium">Owner</th>
                    <th className="py-2 text-left font-medium">Close Date</th>
                    <th className="py-2 text-left font-medium">Status</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody />
              </table>
            </div>
          ) : dealsView === "Cards" ? (
            /* S8-2 functional superset: the reference's view-switcher is
               dead; picking Cards here renders a compact card grid instead
               of the compact table. */
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDeals.map((l) => (
                <div
                  key={l.id}
                  className="rounded-lg border border-line bg-surface p-4 transition-colors hover:bg-line-soft/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{l.name}</p>
                    <Badge variant="outline" className={STAGE_META[l.stage]?.badge}>
                      {STAGE_META[l.stage]?.label ?? l.stage}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">{l.company ?? "—"}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {formatCompactCurrency(l.value)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      {l.owner && <Avatar name={l.owner.name} color={l.owner.avatarColor} size="sm" />}
                      {l.owner?.name ?? "Unassigned"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line text-xs text-muted">
                    {/* Session-9 (S9-9): the reference renders EIGHT columns —
                        "Status" appears TWICE after Close Date (a visible
                        copy-paste quirk, mirrored per the strict-mirror
                        precedent — see the quirk register). */}
                    <th className="py-2 text-left font-medium">Lead</th>
                    <th className="py-2 text-left font-medium">Company</th>
                    <th className="py-2 text-left font-medium">Deal Value</th>
                    <th className="py-2 text-left font-medium">Status</th>
                    <th className="py-2 text-left font-medium">Owner</th>
                    <th className="py-2 text-left font-medium">Close Date</th>
                    <th className="py-2 text-left font-medium">Status</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {/* At zero rows the reference renders the headers with an
                      EMPTY tbody — no empty-state paragraph. */}
                  {filteredDeals.map((l) => (
                    <tr key={l.id} className="border-b border-line text-xs text-muted transition-colors hover:bg-line-soft/60">
                      <td className="py-2 font-medium text-foreground">{l.name}</td>
                      <td className="py-2">{l.company ?? "—"}</td>
                      <td className="py-2 font-semibold text-foreground">{formatCompactCurrency(l.value)}</td>
                      <td className="py-2">
                        <Badge variant="outline" className={STAGE_META[l.stage]?.badge}>
                          {STAGE_META[l.stage]?.label ?? l.stage}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <span className="flex items-center gap-2">
                          {l.owner && <Avatar name={l.owner.name} color={l.owner.avatarColor} size="sm" />}
                          <span>{l.owner?.name ?? "Unassigned"}</span>
                        </span>
                      </td>
                      <td className="py-2">{formatDate(l.closedAt ?? l.expectedCloseDate)}</td>
                      <td className="py-2">
                        <Badge variant="outline" className={STAGE_META[l.stage]?.badge}>
                          {STAGE_META[l.stage]?.label ?? l.stage}
                        </Badge>
                      </td>
                      <td className="w-8" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

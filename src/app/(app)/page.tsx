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
  KPI_STATICS,
  PIPELINE_LEGEND,
} from "@/lib/page-layout";
import * as React from "react";
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
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/label";
import { KpiCard, PageHeader, Sparkline } from "@/components/shared/page-parts";
import { RevenueLineChart, SingleBarChart, dollarFormatter } from "@/components/charts/charts";
import { AccountDialog, ActivityDialog, ContactDialog, EventDialog, LeadDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { STAGE_META, CHART_COLORS, LEAD_SOURCE_OPTIONS, PIPELINE_STAGES, PIPELINE_LABELS } from "@/lib/constants";
import { formatCompactCurrency, formatDate } from "@/lib/format";

type QuickCreate = "lead" | "contact" | "account" | "event" | "activity" | null;

export default function DashboardPage() {
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

      {/* KPI row — session-25 (S25-P1): the reference renders its KPI
          cards IMMEDIATELY with zeros while data is still loading (its
          empty state IS its loading state — live-verified with the
          entity-fetch-abort probe). The `!k` skeleton branch is retired;
          the cards read `k?.x ?? 0` exactly like the reports page. */}
      <div className={PAGE_KPI_GRIDS.dashboard}>
        {/* Session-27 (S27-P7): the reference HARDCODES its KPI deltas
            ("+5.3%" / "+15%") and sparkline arrays — its KPI memo computes
            the real totals but feeds the sparks/deltas fixed literals. The
            sparks below mirror those arrays verbatim (KPI_STATICS); the
            Sales Target progress text is NEUTRAL text-gray-600. */}
        <KpiCard label="Total Leads" value={k?.totalLeads ?? 0} delta={KPI_STATICS.deltas.totalLeads}>
          <Sparkline values={[...KPI_STATICS.sparks.totalLeads]} color={CHART_COLORS.emerald} variant="line" />
        </KpiCard>
        <KpiCard label="Deals Closed" value={formatCompactCurrency(k?.dealsClosedValue ?? 0)}>
          <Sparkline values={[...KPI_STATICS.sparks.dealsClosed]} color={CHART_COLORS.cyan400} />
        </KpiCard>
        <KpiCard label="Revenue This Month" value={formatCompactCurrency(k?.revenueThisMonth ?? 0)} delta={KPI_STATICS.deltas.revenueThisMonth}>
          <Sparkline values={[...KPI_STATICS.sparks.revenueThisMonth]} color={CHART_COLORS.green400} />
        </KpiCard>
        <KpiCard
          label="Sales Target"
          value={formatCompactCurrency(k?.salesTarget ?? 0)}
          valueNote={`${k?.salesTargetProgress ?? 0}%`}
        >
          <Sparkline
            values={[...KPI_STATICS.sparks.salesTarget]}
            colorFor={(_, i) => (i < 4 ? "#fbbf24" : "#3b82f6")}
            color="#fbbf24"
          />
        </KpiCard>
        <KpiCard label="Conversion Rate" value={`${k?.conversionRate ?? 0}%`}>
          <Sparkline values={[...KPI_STATICS.sparks.conversionRate]} color={CHART_COLORS.violet} variant="area" />
        </KpiCard>
          {/* Session-13 (S13-P10): the reference's Avg. Sales Cycle card
              carries NO delta — value + "days" unit only. */}
          <KpiCard
            label="Avg. Sales Cycle"
            value={k?.avgSalesCycleDays ?? 0}
            suffix="days"
          >
            <Sparkline values={[...KPI_STATICS.sparks.avgSalesCycle]} color={CHART_COLORS.emerald} variant="line" />
          </KpiCard>
      </div>

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
            {/* Session-29 (S29-P4): the RAW values with capitalized labels. */}
            {LEAD_SOURCE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className={FILTER_BAR.searchWrap}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Stage: Source" className="pl-9" aria-label="Filter deals" />
        </div>
        {/* Session-6: "More..." is a ghost h-8 button on the reference
            (hover:bg-accent h-8 px-3 text-xs) — not a text link.
            Session-24 (S24-P3): it is also a complete NO-OP there —
            live-clicked with zero DOM delta, zero dialogs and zero
            navigation (the same dead-affordance family as the reference's
            mail/bell buttons). Our onClick router.push("/leads") was an
            invention; retired. */}
        <Button variant="ghost" size="sm" className="sm:ml-auto">
          More...
        </Button>
        </div>
      </div>

      {/* Charts — session-6: plain lg:grid-cols-2 gap-6 (the reference has
          no 3/2 col-span split). Session-27 (S27-P6/P7): the chart
          internals are bundle-pinned — the pipeline bars are SINGLE
          #3b82f6 with radius [8,8,0,0] on the VALUE dataKey ($ tooltip,
          tick 12), with the per-stage colors living in the LEGEND CHIPS
          below; the revenue areas carry fillOpacity .6 (won) / .3 (target)
          with STOCK strokeWidth + the $ tooltip + tick 12. */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Sales Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <SingleBarChart
              data={(dashboard?.pipeline ?? []).map((p) => ({ stage: p.label, value: p.value }))}
              xKey="stage"
              dataKey="value"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              formatter={dollarFormatter}
              tickFontSize={12}
            />
            {/* The O-map legend chips — the per-stage colors live HERE
                (w-3 h-3 rounded squares on Tailwind bg-* classes), with
                the reference's own lookup-miss quirk: the "Won" label
                misses the snake_case map and falls back to bg-gray-400. */}
            <div className={PIPELINE_LEGEND.row}>
              {(dashboard?.pipeline ?? []).map((p) => (
                <div key={p.stage} className={PIPELINE_LEGEND.chip}>
                  {/* The reference looks the class up by the LABEL slug
                      (stage.toLowerCase().replace(" ","_")) — so its "Won"
                      label misses the closed_won key and falls back to
                      gray-400. Our internal stage ids differ (new vs
                      prospecting), so the label-based lookup is the
                      faithful expression of the same mechanism. */}
                  <div
                    className={`${PIPELINE_LEGEND.swatch} ${PIPELINE_LEGEND.stageClass[p.label.toLowerCase().replace(" ", "_")] ?? PIPELINE_LEGEND.fallbackClass}`}
                  />
                  <span className={PIPELINE_LEGEND.label}>
                    {p.label}: ${(p.value / 1e3).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
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
              tickFontSize={12}
              series={[
                // Both series are filled Areas on the reference (DOM-verified
                // recharts-area ×2) — fillOpacity .6 won / .3 target,
                // STOCK strokeWidth (the reference passes none).
                { key: "won", label: "Won", color: CHART_COLORS.emerald, fillOpacity: 0.6 },
                { key: "target", label: "Target", color: CHART_COLORS.red, fillOpacity: 0.3 },
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
            {/* Session-27 (S27-P8, bundle-extracted): the rows are the
                checkbox family — [inert Checkbox] "Follow up with {source}"
                … count — p-2 hover:bg-gray-50 rounded rows in a space-y-3,
                FOUR max (slice(0,4)). At zero data the container renders
                EMPTY (S9-10). Our old progress-bar list was an invention. */}
            <div className="space-y-3">
              {(dashboard?.leadSources ?? []).slice(0, 4).map((s) => (
                <div key={s.source} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <Checkbox />
                    <span className="text-sm">Follow up with {s.source}</span>
                  </div>
                  <span className="text-xs text-gray-500">{s.count}</span>
                </div>
              ))}
            </div>
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
            {/* Session-27 (S27-P8, bundle-extracted): the rows are the
                checkbox family — [inert Checkbox] description +
                related-name subtext … toLocaleDateString — the same
                p-2 hover:bg-gray-50 rounded rows; empty = the centered
                py-4 gray paragraph. Our old colored-dot rows were an
                invention. */}
            {(dashboard?.upcomingActivities ?? []).length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming activities</p>
            ) : (
              <div className="space-y-3">
                {(dashboard?.upcomingActivities ?? []).map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <Checkbox />
                      <div>
                        <p className="text-sm">{a.subject}</p>
                        <p className="text-xs text-gray-500">{a.relatedName ?? a.type}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {a.dueAt ? new Date(a.dueAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                ))}
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

"use client";

import { downloadFile } from "@/lib/download";
import * as React from "react";
import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  MoreHorizontal,
  Percent,
  Pencil,
  Plus,
  Save,
  Search,
  Target,
  TrendingUp,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import { toast } from "@/components/ui/toast";
import { IconStatCard, PageHeader, TableEmptyRow } from "@/components/shared/page-parts";
import {
  PAGE_HEADER, LEADS_FILTERS_POPOVER, LEADS_TOOLBAR, PAGE_KPI_GRIDS, PAGE_ROOT, TABLE_CARD,
  CARD_TITLE_OVERRIDE } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import {
  DEFAULT_LEAD_FILTERS,
  LEAD_FILTERS_STORAGE_KEY,
  decodeLeadFilters,
  encodeLeadFilters,
  leadFiltersEqual,
  type LeadFilters,
} from "@/lib/lead-filters";
import { ConversionFunnel, PipelineBarChart, WonLostLineChart } from "@/components/charts/charts";
import { LeadDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { CHART_COLORS, FUNNEL_STAGES, STAGE_META, isDroppedStage } from "@/lib/constants";
import { avgDaysBetween, formatCompactCurrency, formatCurrency, formatDate } from "@/lib/format";
import type { Lead } from "@/types";

type SortKey = "name" | "email" | "value" | "createdAt";
type SortDir = "asc" | "desc";

export default function LeadsPage() {
  const { leads, loadingFlags, hydrated, deleteLead, fetchLeads } = useCrmStore();
  const [search, setSearch] = React.useState("");
  // S8-5: the reference's Filters control is a w-80 POPOVER with
  // Status/Source/Min Deal Value/Follow-up Date — not an inline expander.
  const [filters, setFilters] = React.useState<LeadFilters>(DEFAULT_LEAD_FILTERS);
  const [sortKey, setSortKey] = React.useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Lead | null>(null);

  React.useEffect(() => {
    if (hydrated) fetchLeads();
  }, [hydrated, fetchLeads]);

  // Restore the saved filter view after mount. The setState is deferred to
  // a timer callback (React 19 lint: never setState synchronously inside an
  // effect body) and the first paint uses the defaults, so there is no
  // hydration mismatch with the server-rendered markup.
  React.useEffect(() => {
    const t = setTimeout(() => {
      const saved = decodeLeadFilters(window.localStorage.getItem(LEAD_FILTERS_STORAGE_KEY));
      if (saved) setFilters((prev) => (leadFiltersEqual(prev, saved) ? prev : saved));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function saveView() {
    try {
      window.localStorage.setItem(LEAD_FILTERS_STORAGE_KEY, encodeLeadFilters(filters));
      toast.success("View saved", "This filter set will be restored on your next visit.");
    } catch {
      toast.error("Could not save view", "Browser storage is unavailable.");
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "createdAt" ? "desc" : "asc");
    }
  }

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const statusStage: Record<string, string> = {
      New: "new",
      Contacted: "contacted",
      Qualified: "qualified",
      Won: "won",
    };
    const rows = leads.filter((l) => {
      if (q && !`${l.name} ${l.email ?? ""} ${l.company ?? ""}`.toLowerCase().includes(q)) return false;
      if (filters.status) {
        if (filters.status === "Lost") {
          if (!isDroppedStage(l.stage)) return false;
        } else if (l.stage !== statusStage[filters.status]) return false;
      }
      if (filters.source && (l.source ?? "").toLowerCase() !== filters.source.toLowerCase()) return false;
      if (filters.minValue != null && l.value < filters.minValue) return false;
      if (filters.followUpDate) {
        const fd = l.nextFollowUp ? new Date(l.nextFollowUp).toISOString().slice(0, 10) : null;
        if (fd !== filters.followUpDate) return false;
      }
      return true;
    });
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "email") cmp = (a.email ?? "").localeCompare(b.email ?? "");
      else if (sortKey === "value") cmp = a.value - b.value;
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [leads, search, filters, sortKey, sortDir]);

  const won = leads.filter((l) => l.stage === "won");
  const lost = leads.filter((l) => isDroppedStage(l.stage));
  const open = leads.filter((l) => l.stage !== "won" && !isDroppedStage(l.stage));
  const avgCycle = avgDaysBetween(
    won.map((l) => l.createdAt),
    won.map((l) => l.closedAt ?? l.createdAt),
  );

  // Reference chart vocabulary: New / Qualified / Won / Lost on a count axis.
  const pipelineByStage = ["new", "qualified", "won", "lost"].map((s) => ({
    label: STAGE_META[s].label,
    stage: s,
    count: filtered.filter((l) => l.stage === s).length,
    value: filtered.filter((l) => l.stage === s).reduce((acc, l) => acc + l.value, 0),
    color: STAGE_META[s].color,
  }));

  // Won vs lost by month — session-10 (S10-9): ROW-DERIVED month series
  // (one entry per DISTINCT closed month, EMPTY at zero — the reference
  // renders no month ticks at zero data on this chart; DOM-verified).
  const wonVsLost = React.useMemo(() => {
    const key = (l: Lead) => {
      const t = new Date(l.closedAt ?? l.createdAt);
      return `${t.getFullYear()}-${t.getMonth()}`;
    };
    const byKey = new Map<string, { month: string; won: number; lost: number; sort: number }>();
    for (const l of won) {
      const e = byKey.get(key(l)) ?? { month: "", won: 0, lost: 0, sort: new Date(l.closedAt ?? l.createdAt).getTime() };
      e.month = new Date(l.closedAt ?? l.createdAt).toLocaleString("en-US", { month: "short" });
      e.won += 1;
      byKey.set(key(l), e);
    }
    for (const l of lost) {
      const e = byKey.get(key(l)) ?? { month: "", won: 0, lost: 0, sort: new Date(l.closedAt ?? l.createdAt).getTime() };
      e.month = new Date(l.closedAt ?? l.createdAt).toLocaleString("en-US", { month: "short" });
      e.lost += 1;
      byKey.set(key(l), e);
    }
    return [...byKey.entries()].sort((a, b) => a[1].sort - b[1].sort).map(([, v]) => ({ month: v.month, won: v.won, lost: v.lost }));
  }, [won, lost]);

  // Session-10 (S10-7): the funnel is the 4-stage FUNNEL_STAGES list
  // (New/Qualified/Won/Lost — the same vocabulary as the sibling
  // "Pipeline Value by Stage" chart), rendered as a recharts FunnelChart.
  // Cumulative counts; always four entries (no count>0 filter — the
  // reference renders 4 trapezoid groups even at zero data).
  const funnel = React.useMemo(() => {
    const reached = (order: string[]) =>
      leads.filter((l) => order.includes(l.stage) || l.stage === "won").length;
    const count = (s: string) => leads.filter((l) => l.stage === s).length;
    return FUNNEL_STAGES.map((s) => {
      const c =
        s === "new"
          ? leads.length
          : s === "qualified"
            ? reached(["qualified", "proposal", "negotiation"])
            : s === "won"
              ? count("won")
              : count("lost");
      return { id: s, label: STAGE_META[s]?.label ?? s, count: c, color: STAGE_META[s]?.color ?? CHART_COLORS.gray };
    });
  }, [leads]);


  async function onDelete(lead: Lead) {
    if (!window.confirm(`Delete "${lead.name}"? This cannot be undone.`)) return;
    await deleteLead(lead.id);
  }

  return (
    // Session-16 (S16-P2): the page owns its padding — the reference's
    // Leads root is just `p-4 sm:p-8` (NO bg / min-h-screen — the
    // reference's own quirk; main's bg fills the gap).
    <div className={PAGE_ROOT.bare}>
      <PageHeader
        title="Leads"
        subtitle="Manage your sales leads"
        variant="leads"
        actions={
          <>
            {/* Session-6: the reference's leads Export is ENABLED even at
                zero data (unlike accounts/contacts) — mirrored. */}
            <Button
              variant="outline"
              className={PAGE_HEADER.leads.buttonStretch}
              onClick={() => downloadFile("/api/export?type=leads&download=1")}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button
              className={PAGE_HEADER.leads.buttonStretch}
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> New Lead
            </Button>
          </>
        }
      />

      {/* Reference stat cards (session-5 anatomy): plain white card,
          p-4 sm:p-6, label text-xs sm:text-sm, value text-xl sm:text-2xl,
          tinted square chip w-8 h-8 sm:w-10 sm:h-10 on the right. The Won/
          Dropped amounts render in FULL currency form (the reference's
          zero-state shows "$0" where the dashboard shows "$0.0k"). */}
      <div className={PAGE_KPI_GRIDS.leads}>
        <IconStatCard variant="leads" label="Total Leads" value={leads.length} icon={<TrendingUp className="h-5 w-5" />} color="#3b82f6" />
        <IconStatCard variant="leads" label="Open Leads" value={open.length} icon={<Target className="h-5 w-5" />} color="#f97316" />
        <IconStatCard
          variant="leads"
          label="Won Deals"
          value={won.length}
          subValue={formatCurrency(won.reduce((s, l) => s + l.value, 0))}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="#10b981"
        />
        <IconStatCard
          variant="leads"
          label="Dropped Deals"
          value={lost.length}
          subValue={formatCurrency(lost.reduce((s, l) => s + l.value, 0))}
          icon={<XCircle className="h-5 w-5" />}
          color="#ef4444"
        />
        <IconStatCard
          variant="leads"
          label="Conversion Rate"
          value={`${leads.length ? Math.round((won.length / leads.length) * 1000) / 10 : 0}%`}
          icon={<Percent className="h-5 w-5" />}
          color="#8b5cf6"
        />
        <IconStatCard variant="leads" label="Avg. Sales Cycle" value={`${avgCycle} days`} icon={<CalendarDays className="h-5 w-5" />} color="#14b8a6" />
      </div>

      {/* Session-8 (S8-4/S8-5, DOM re-pinned): search + a Filters POPOVER
          trigger live in the card header. The search uses the contacts
          anatomy (w-5 icon + pl-10); the Filters button is an outline h-9
          `w-full sm:w-auto` popover trigger with a Filter icon and NO
          chevron — its w-80 content carries Status / Source / Min Deal
          Value / Follow-up Date + Clear / Save View (the reference's is
          inert; ours filters for real and Save View persists to
          localStorage via the @/lib/lead-filters seam). */}
      {/* Session-16 (S16-P5): a PLAIN div, not Card — the Card base's
          `border border-line` leaks through cn() (the reference's card
          is the borderless bg-white rounded-lg shadow, no
          overflow-hidden). */}
      <div className={TABLE_CARD.card}>
        <div className={cn(TABLE_CARD.toolbar, "space-y-4")}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className={cn("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle", LEADS_TOOLBAR.searchIcon)} />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className={LEADS_TOOLBAR.searchInput} aria-label="Search leads" />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 mb-4">
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant="outline" className={LEADS_FILTERS_POPOVER.trigger} aria-label="Open lead filters">
                  <Filter className={LEADS_FILTERS_POPOVER.triggerIcon} /> Filters
                </Button>
              </DropdownTrigger>
              <DropdownContent align="start" className={cn("rounded-md", LEADS_FILTERS_POPOVER.content)}>
                <div className={LEADS_FILTERS_POPOVER.stack}>
                  <div>
                    <span className={LEADS_FILTERS_POPOVER.fieldLabel}>Status</span>
                    <Select value={filters.status} onValueChange={(v) => setFilters((f) => ({ ...f, status: v === "All Status" ? "" : v }))}>
                      <SelectTrigger className={LEADS_FILTERS_POPOVER.select} aria-label="Filter by status">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEADS_FILTERS_POPOVER.statusOptions.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <span className={LEADS_FILTERS_POPOVER.fieldLabel}>Source</span>
                    <Select value={filters.source} onValueChange={(v) => setFilters((f) => ({ ...f, source: v === "All Sources" ? "" : v }))}>
                      <SelectTrigger className={LEADS_FILTERS_POPOVER.select} aria-label="Filter by source">
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEADS_FILTERS_POPOVER.sourceOptions.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <span className={LEADS_FILTERS_POPOVER.fieldLabel}>Min Deal Value</span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      className={LEADS_FILTERS_POPOVER.numberInput}
                      aria-label="Minimum deal value"
                      value={filters.minValue ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setFilters((f) => ({ ...f, minValue: raw === "" ? null : Math.max(0, Math.floor(Number(raw))) }));
                      }}
                    />
                  </div>
                  <div>
                    <span className={LEADS_FILTERS_POPOVER.fieldLabel}>Follow-up Date</span>
                    <Input
                      type="date"
                      className={LEADS_FILTERS_POPOVER.dateInput}
                      aria-label="Follow-up date"
                      value={filters.followUpDate}
                      onChange={(e) => setFilters((f) => ({ ...f, followUpDate: e.target.value }))}
                    />
                  </div>
                  <div className={LEADS_FILTERS_POPOVER.footer}>
                    <Button variant="outline" className={LEADS_FILTERS_POPOVER.footerBtn} onClick={() => setFilters(DEFAULT_LEAD_FILTERS)}>
                      <X className={LEADS_FILTERS_POPOVER.footerIcon} /> Clear
                    </Button>
                    <Button variant="outline" className={LEADS_FILTERS_POPOVER.footerBtn} onClick={saveView}>
                      <Save className={LEADS_FILTERS_POPOVER.footerIcon} /> Save View
                    </Button>
                  </div>
                </div>
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
        <div className={TABLE_CARD.scrollArea}>
        <CardContent className="px-0 py-0">
          {/* Reference (session-5): leads hides columns progressively —
              Phone below md, Company below lg, Source below xl. */}
          <Table>
            <TableHeader>
              <TableRow>
                <SortHead label="Lead Name" k="name" active={sortKey === "name"} dir={sortDir} onToggle={toggleSort} />
                <SortHead label="Email" k="email" active={sortKey === "email"} dir={sortDir} onToggle={toggleSort} />
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Company</TableHead>
                <SortHead label="Value" k="value" active={sortKey === "value"} dir={sortDir} onToggle={toggleSort} />
                <TableHead>Status</TableHead>
                <TableHead className="hidden xl:table-cell">Source</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingFlags.leads && leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-2">
                    <div className="flex flex-col gap-2 p-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12" />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <TableEmptyRow colSpan={9} message="No leads found" />
              ) : (
                <>
                {filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium text-foreground">{l.name}</TableCell>
                    <TableCell className="text-muted">{l.email ?? "—"}</TableCell>
                    <TableCell className="hidden text-muted md:table-cell">{l.phone ?? "—"}</TableCell>
                    <TableCell className="hidden text-muted lg:table-cell">{l.company ?? "—"}</TableCell>
                    <TableCell className="font-semibold text-foreground">{formatCompactCurrency(l.value)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STAGE_META[l.stage]?.badge}>
                        {STAGE_META[l.stage]?.label ?? l.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted xl:table-cell">{l.source ?? "—"}</TableCell>
                    <TableCell className="text-muted">{formatDate(l.nextFollowUp)}</TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger asChild>
                          <Button variant="ghost" size="iconSm" aria-label={`Actions for ${l.name}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownContent>
                          <DropdownItem
                            onClick={() => {
                              setEditing(l);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-muted" /> Edit
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setEditing(null);
                              setDialogOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 text-muted" /> New Lead
                          </DropdownItem>
                          <DropdownSeparator />
                          <DropdownItem destructive onClick={() => onDelete(l)}>
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
        </div>
      </div>

      {/* Session-6: charts row = grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6
          mt-6 (three equal cards — no 2/3 ladder). */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Pipeline Value by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineBarChart data={pipelineByStage} height={250} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Won vs Lost Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <WonLostLineChart data={wonVsLost} height={250} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ConversionFunnel data={funnel} height={250} />
          </CardContent>
        </Card>
      </div>

      <LeadDialog open={dialogOpen} onOpenChange={setDialogOpen} lead={editing} />
    </div>
  );
}

// Module-level sortable header (stable identity — never created during render).
function SortHead({
  label,
  k,
  active,
  dir,
  onToggle,
}: {
  label: string;
  k: SortKey;
  active: boolean;
  dir: SortDir;
  onToggle: (key: SortKey) => void;
}) {
  return (
    <TableHead>
      <button
        type="button"
        className="inline-flex items-center gap-1 tracking-wide"
        onClick={() => onToggle(k)}
      >
        {label}
        {/* Reference: inactive sortable headers show lucide arrow-up-down
            (w-4); the active sort flips to a directional chevron. */}
        {active ? (
          dir === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 text-subtle" />
        )}
      </button>
    </TableHead>
  );
}

"use client";

import * as React from "react";
import {
  ArrowUpDown,
  // Session-17 (S17-P2): the reference's leads KPI chips ship
  // `circle-check-big` (the BIG check filling the circle — CheckCircle2
  // renders the small one) and `calendar` (blank body — CalendarDays
  // adds the day dots).
  Calendar,
  CircleAlert,
  CircleCheckBig,
  ChevronDown,
  ChevronUp,
  Download,
  // Session-29 (S29-P2, the C2 extract): the ⋮ trigger is the VERTICAL
  // dots (the contacts/accounts family), not the horizontal More.
  EllipsisVertical,
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
import { FilterPolygon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import { toast } from "@/components/ui/toast";
import { IconStatCard, PageHeader, TableEmptyRow } from "@/components/shared/page-parts";
import {
  PAGE_HEADER, LEADS_FILTERS_POPOVER, LEADS_TOOLBAR, PAGE_KPI_GRIDS, PAGE_ROOT, TABLE_CARD,
  CARD_TITLE_OVERRIDE } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import {
  DEFAULT_LEAD_FILTERS,
  LEAD_FILTER_SOURCE_OPTIONS,
  LEAD_FILTER_STATUS_OPTIONS,
  LEAD_VIEWS_STORAGE_KEY,
  applySavedView,
  decodeSavedLeadViews,
  encodeSavedLeadViews,
  filtersActive,
  isOverdueFollowUp,
  leadFiltersEqual,
  toDateInputValue,
  type LeadFilters,
  type SavedLeadView,
} from "@/lib/lead-filters";
import { ConversionFunnel, GroupedBarsChart, SingleBarChart, dollarFormatter } from "@/components/charts/charts";
import { LeadDialog } from "@/components/shared/entity-dialogs";
import { EntityEditDialog, LEAD_EDIT_FIELDS } from "@/components/shared/entity-edit-dialog";
import { useCrmStore } from "@/stores/crm-store";
import { CHART_COLORS, LEADS_FUNNEL, LEAD_INLINE_STATUS_OPTIONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { downloadBlob } from "@/lib/download";
import { entityExportFilename, unquotedHeaderCsv } from "@/lib/entity-export";
import type { Lead } from "@/types";

type SortKey = "name" | "email" | "value" | "createdAt";
type SortDir = "asc" | "desc";

export default function LeadsPage() {
  const { leads, hydrated, deleteLead, updateLead, fetchLeads } = useCrmStore();
  const [search, setSearch] = React.useState("");
  // S8-5 (re-scoped S29-P3): the reference's Filters control is a w-80
  // POPOVER with Status/Source/Min Deal Value/Follow-up Date — the RAW
  // value selects + the "all" sentinel (bundle + live verified).
  const [filters, setFilters] = React.useState<LeadFilters>(DEFAULT_LEAD_FILTERS);
  // Session-29 (S29-P3): the prompt-named SAVED VIEWS — the reference
  // renders them as a select that applies a view's filters (in-memory
  // there; ours persists to localStorage, the documented superset).
  const [savedViews, setSavedViews] = React.useState<SavedLeadView[]>([]);
  const [sortKey, setSortKey] = React.useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Lead | null>(null);
  // Session-28 (S28-P2): the Mke Edit Lead dialog — a SEPARATE max-w-2xl
  // dialog (NOT the create form), wired to the ⋮ Edit item.
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Lead | null>(null);

  React.useEffect(() => {
    if (hydrated) fetchLeads();
  }, [hydrated, fetchLeads]);

  // Session-29 (S29-P3): load the persisted SAVED VIEWS list after mount
  // (the reference's views are in-memory — ours survive reloads). The
  // setState is deferred to a timer callback (React 19 lint: never
  // setState synchronously inside an effect body) and the first paint
  // uses the empty list, so there is no hydration mismatch. The filters
  // themselves do NOT auto-restore — the reference starts every load at
  // the defaults.
  React.useEffect(() => {
    const t = setTimeout(() => {
      // Session-45 (S45-P2): the storage read rides a try/catch — a
      // blocked storage (all-cookies-blocked Chromium) keeps the empty
      // list instead of throwing inside the uncaught timer; the write
      // path already toasts.
      try {
        const views = decodeSavedLeadViews(window.localStorage.getItem(LEAD_VIEWS_STORAGE_KEY));
        if (views && views.length > 0) setSavedViews((prev) => (prev.length === 0 ? views : prev));
      } catch {
        // Blocked storage — keep the empty list (the first-paint default).
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Session-29 (S29-P3, live-verified): Save View fires the NATIVE
  // prompt("Enter view name:") — the s8 "inert" pin was the s26
  // native-dialog auto-dismiss hazard. The current filter set is saved
  // under the name; ours also persists the list (the reference keeps it
  // in memory only).
  function saveView() {
    const name = window.prompt("Enter view name:");
    if (!name) return;
    setSavedViews((prev) => {
      const next = [...prev, { name, filters }];
      try {
        window.localStorage.setItem(LEAD_VIEWS_STORAGE_KEY, encodeSavedLeadViews(next));
      } catch {
        toast.error("Could not save view", "Browser storage is unavailable.");
      }
      return next;
    });
  }

  function applyView(name: string) {
    const view = savedViews.find((v) => v.name === name);
    if (!view) return;
    setFilters((prev) => (leadFiltersEqual(prev, view.filters) ? prev : applySavedView(view)));
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "createdAt" ? "desc" : "asc");
    }
  }

  // Session-29 (S29-P3, the B useMemo bundle extract): the reference's
  // filter semantics — the search matches name OR email OR company (the
  // OR-form, not a concatenated string); the status/source filters are
  // STRICT equality against the RAW vocabularies ("lost" matches stage
  // "lost" only — the dropped/unqualified mapping retired); a min value
  // passes only TRUTHY lead values (the reference's own `X.value &&`
  // quirk — zero-value leads never pass a min filter); the follow-up
  // filter compares the raw date string (our stored datetimes compare on
  // the yyyy-MM-dd slice).
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = leads.filter((l) => {
      if (
        q &&
        !(
          l.name.toLowerCase().includes(q) ||
          (l.email ?? "").toLowerCase().includes(q) ||
          (l.company ?? "").toLowerCase().includes(q)
        )
      )
        return false;
      if (filters.status !== "all" && l.stage !== filters.status) return false;
      if (filters.source !== "all" && l.source !== filters.source) return false;
      if (filters.minValue != null && filters.minValue > 0 && !(l.value && l.value >= filters.minValue)) return false;
      if (filters.followUpDate && toDateInputValue(l.nextFollowUp) !== filters.followUpDate) return false;
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

  // Session-29 (S29-P5, the H useMemo bundle extract): EVERYTHING derives
  // from the FILTERED set (the KPIs, the charts, the export) — and the
  // vocabularies are the reference's own: "Open Leads" = new+contacted+
  // qualified (NOT everything-not-won — proposal/negotiation/unqualified
  // lead rows exist only in our merged model and count in nothing but the
  // total); "Dropped Deals" = lost STRICTLY (unqualified is not dropped);
  // the avg cycle is the average AGE of the won leads (now - created,
  // floored to days — NOT created→closed).
  const won = filtered.filter((l) => l.stage === "won");
  const lost = filtered.filter((l) => l.stage === "lost");
  const open = filtered.filter((l) => ["new", "contacted", "qualified"].includes(l.stage));
  const avgCycle =
    won.length > 0
      ? Math.round(
          won.reduce((acc, l) => acc + Math.floor((Date.now() - new Date(l.createdAt).getTime()) / 86_400_000), 0) /
            won.length,
        )
      : 0;

  // Session-27 (S27-P9, bundle-extracted `Xke`): the FIVE-status
  // vocabulary (new/contacted/qualified/won/lost — Capitalized labels;
  // "Contacted" elides from the ticks at the 331px card, recharts tick
  // elision) with the VALUE sums per status. The bars are single #3b82f6
  // (the $ tooltip + tick 12 live on the chart wiring below).
  const pipelineByStage = ["new", "contacted", "qualified", "won", "lost"].map((s) => ({
    stage: s.charAt(0).toUpperCase() + s.slice(1),
    value: filtered.filter((l) => l.stage === s).reduce((acc, l) => acc + l.value, 0),
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

  // Session-27 (S27-P9, bundle-extracted): the funnel's true vocabulary —
  // New Leads / Contacted / Qualified / Won with STATUS-CUMULATIVE counts
  // (new / contacted+qualified+won / qualified+won / won) and the
  // reference's fills #3b82f6/#8b5cf6/#10b981/#22c55e (LEADS_FUNNEL).
  // The old FUNNEL_STAGES new/qualified/won/lost reading was inferred from
  // the zero-data DOM (where the funnel renders nothing).
  const funnel = React.useMemo(() => {
    const n = (stages: string[]) => filtered.filter((l) => stages.includes(l.stage)).length;
    return LEADS_FUNNEL.map((f) => ({
      id: f.id,
      label: f.label,
      color: f.fill,
      count:
        f.id === "new-leads"
          ? n(["new"])
          : f.id === "contacted"
            ? n(["contacted", "qualified", "won"])
            : f.id === "qualified"
              ? n(["qualified", "won"])
              : n(["won"]),
    }));
  }, [filtered]);


  // Session-29 (S29-P5, the U bundle extract): the Export button is a
  // CLIENT-SIDE blob from the FILTERED rows — the UNQUOTED 8-column
  // header, every VALUE cell quoted, \n-joined, `leads_YYYY-MM-DD.csv`
  // via the anchor-click download (NOT /api/export — the server route's
  // leads branch rode our invented all-rows export).
  function onExport() {
    const header = ["Name", "Email", "Phone", "Company", "Value", "Status", "Source", "Next Follow-up"];
    const rows = filtered.map((l) => [
      l.name,
      l.email || "",
      l.phone || "",
      l.company || "",
      String(l.value || 0),
      l.stage,
      l.source || "",
      toDateInputValue(l.nextFollowUp),
    ]);
    downloadBlob(unquotedHeaderCsv(header, rows), entityExportFilename("Leads"), "text/csv");
  }

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
                zero data (unlike accounts/contacts) — mirrored.
                Session-29 (S29-P5): it is a CLIENT-SIDE blob from the
                FILTERED rows (the U bundle extract), not /api/export. */}
            <Button
              variant="outline"
              className={PAGE_HEADER.leads.buttonStretch}
              onClick={onExport}
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
        {/* Session-29 (S29-P5): the H bundle extract — the KPIs derive from
            the FILTERED set; the conversion rate is the one-decimal
            toFixed(1) form. */}
        <IconStatCard variant="leads" label="Total Leads" value={filtered.length} icon={<TrendingUp className="h-5 w-5" />} color="#3b82f6" />
        <IconStatCard variant="leads" label="Open Leads" value={open.length} icon={<Target className="h-5 w-5" />} color="#f97316" />
        <IconStatCard
          variant="leads"
          label="Won Deals"
          value={won.length}
          subValue={formatCurrency(won.reduce((s, l) => s + l.value, 0))}
          icon={<CircleCheckBig className="h-5 w-5" />}
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
          value={`${filtered.length ? ((won.length / filtered.length) * 100).toFixed(1) : 0}%`}
          icon={<Percent className="h-5 w-5" />}
          color="#8b5cf6"
        />
        <IconStatCard variant="leads" label="Avg. Sales Cycle" value={`${avgCycle} days`} icon={<Calendar className="h-5 w-5" />} color="#14b8a6" />
      </div>

      {/* Session-8 (S8-4/S8-5, DOM re-pinned; re-scoped S29-P3 bundle +
          LIVE verified): search + a Filters POPOVER trigger live in the
          card header. The search uses the contacts anatomy (w-5 icon +
          pl-10); the Filters button is an outline h-9 `w-full sm:w-auto`
          popover trigger with the Filter icon — the trigger gains the
          "(Active)" suffix while any filter is set (live-confirmed), the
          w-80 content carries Status / Source / Min Deal Value /
          Follow-up Date + Clear / Save View, and Save View fires the
          NATIVE prompt("Enter view name:") (live-confirmed — the s8
          "inert" pin was the s26 native-dialog auto-dismiss hazard). The
          saved views render as a w-full sm:w-48 select that applies a
          view's filters; ours persists the list to localStorage (the
          reference keeps them in memory — the documented superset). */}
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
                  <FilterPolygon className={LEADS_FILTERS_POPOVER.triggerIcon} /> Filters {filtersActive(filters) && "(Active)"}
                </Button>
              </DropdownTrigger>
              <DropdownContent align="start" className={cn("rounded-md", LEADS_FILTERS_POPOVER.content)}>
                <div className={LEADS_FILTERS_POPOVER.stack}>
                  <div>
                    <span className={LEADS_FILTERS_POPOVER.fieldLabel}>Status</span>
                    {/* S29-P3: the RAW slugs with the explicit All item
                        bound to the "all" sentinel (value "new", label
                        "New" — live-confirmed options). */}
                    <Select value={filters.status} onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}>
                      <SelectTrigger className={LEADS_FILTERS_POPOVER.select} aria-label="Filter by status">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_FILTER_STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>{o === "all" ? "All Status" : o.charAt(0).toUpperCase() + o.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <span className={LEADS_FILTERS_POPOVER.fieldLabel}>Source</span>
                    <Select value={filters.source} onValueChange={(v) => setFilters((f) => ({ ...f, source: v }))}>
                      <SelectTrigger className={LEADS_FILTERS_POPOVER.select} aria-label="Filter by source">
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_FILTER_SOURCE_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>{o === "all" ? "All Sources" : o.charAt(0).toUpperCase() + o.slice(1)}</SelectItem>
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
            {/* S29-P3 (live-confirmed): the Saved Views select appears once
                a view exists; selecting one applies its filter set. */}
            {savedViews.length > 0 && (
              <Select onValueChange={applyView}>
                <SelectTrigger className={LEADS_FILTERS_POPOVER.savedViewsSelect} aria-label="Saved views">
                  <SelectValue placeholder="Saved Views" />
                </SelectTrigger>
                <SelectContent>
                  {savedViews.map((v) => (
                    <SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <div className={TABLE_CARD.scrollArea}>
        <CardContent className="px-0 py-0">
          {/* Reference (session-5): leads hides columns progressively —
              Phone below md, Company below lg, Source below xl.
              Session-29 (S29-P2, the C2 bundle extract): the thead is
              STICKY (live-confirmed) and the actions header is w-12. */}
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <SortHead label="Lead Name" k="name" active={sortKey === "name"} dir={sortDir} onToggle={toggleSort} />
                <SortHead label="Email" k="email" active={sortKey === "email"} dir={sortDir} onToggle={toggleSort} />
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Company</TableHead>
                <SortHead label="Value" k="value" active={sortKey === "value"} dir={sortDir} onToggle={toggleSort} />
                <TableHead>Status</TableHead>
                <TableHead className="hidden xl:table-cell">Source</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={9} message="No leads found" />
              ) : (
                <>
                {filtered.map((l) => (
                  // S29-P2: the explicit hover:bg-gray-50 (NOT the kit's
                  // line-soft tint) and NO row click — unlike the
                  // contacts/accounts rows, the leads row is inert.
                  <TableRow key={l.id} className="hover:bg-gray-50">
                    {/* The orange Target name box (the reference's
                        `op` glyph — Target, lucide-stable). */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="font-medium">{l.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{l.email || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{l.phone || "-"}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{l.company || "-"}</TableCell>
                    <TableCell>
                      {/* S29-P2: the INLINE Value number input —
                          parseFloat || 0, immediate mutation (the store
                          applies optimistically so per-keystroke edits
                          never clobber). */}
                      <Input
                        type="number"
                        value={l.value || ""}
                        onChange={(e) => updateLead(l.id, { value: parseFloat(e.target.value) || 0 })}
                        className="w-24 h-8 text-sm"
                        placeholder="$0"
                        aria-label={`Value for ${l.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      {/* S29-P2: the INLINE Status select — EXACTLY the
                          five raw options; unmatched stages
                          (proposal/negotiation/unqualified — our
                          merged-model artifacts) render a BLANK trigger
                          (Radix's unmatched-value behavior, mirrored). */}
                      <Select value={l.stage} onValueChange={(v) => updateLead(l.id, { stage: v })}>
                        <SelectTrigger className="w-32 h-8" aria-label={`Status for ${l.name}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAD_INLINE_STATUS_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {l.source ? <Badge variant="outline" className="text-xs">{l.source}</Badge> : "-"}
                    </TableCell>
                    <TableCell>
                      {/* S29-P2: the INLINE date input + the overdue
                          border-red-500 + the CircleAlert glyph
                          (isOverdueFollowUp: any PAST date, strict <). */}
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={toDateInputValue(l.nextFollowUp)}
                          onChange={(e) => updateLead(l.id, { nextFollowUp: e.target.value || null })}
                          className={cn("w-36 h-8 text-sm", isOverdueFollowUp(l.nextFollowUp) && "border-red-500")}
                          aria-label={`Next follow-up for ${l.name}`}
                        />
                        {isOverdueFollowUp(l.nextFollowUp) && <CircleAlert className="w-4 h-4 text-red-500 flex-shrink-0" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger asChild>
                          <Button variant="ghost" size="iconSm" aria-label={`Actions for ${l.name}`}>
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownContent>
                          {/* Session-28 (S28-P2): the ⋮ Edit opens the
                              reference's SEPARATE Mke edit dialog. */}
                          <DropdownItem
                            onClick={() => {
                              setEditTarget(l);
                              setEditOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-muted" /> Edit
                          </DropdownItem>
                          {/* S29-P2: the reference's own quirk — Convert
                              to Opportunity has NO onClick
                              (bundle-verified dead item). */}
                          <DropdownItem>Convert to Opportunity</DropdownItem>
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
            <SingleBarChart
              data={pipelineByStage}
              xKey="stage"
              dataKey="value"
              fill="#3b82f6"
              formatter={dollarFormatter}
              tickFontSize={12}
              height={250}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className={CARD_TITLE_OVERRIDE.dashboard}>Won vs Lost Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedBarsChart
              data={wonVsLost}
              xKey="month"
              series={[
                { key: "won", name: "Won", fill: "#10b981" },
                { key: "lost", name: "Lost", fill: "#ef4444" },
              ]}
              tickFontSize={12}
              height={250}
            />
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

      {/* Session-28 (S28-P2): the Mke Edit Lead dialog — max-w-2xl, the
          4-option status set + the 4-option source, Estimated Value. */}
      <EntityEditDialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditTarget(null);
        }}
        title="Edit Lead"
        detailsTitle="Lead Details"
        fields={LEAD_EDIT_FIELDS}
        entityId={editTarget?.id ?? null}
        initial={{
          name: editTarget?.name ?? "",
          email: editTarget?.email ?? "",
          phone: editTarget?.phone ?? "",
          company: editTarget?.company ?? "",
          status: editTarget?.stage ?? "new",
          source: editTarget?.source ?? "call",
          value: editTarget?.value ?? "",
        }}
        onSubmit={async (form) => {
          if (!editTarget) return;
          const res = await updateLead(editTarget.id, {
            name: form.name,
            email: form.email || null,
            phone: form.phone || null,
            company: form.company || null,
            stage: form.status || "new",
            source: form.source || "call",
            value: form.value ? Number(form.value) : 0,
          });
          if (res.ok) {
            setEditOpen(false);
            setEditTarget(null);
          }
        }}
      />

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
    // S29-P2: the reference's sortable th carries cursor-pointer + the
    // flex items-center gap-2 label/icon container (bundle-extracted);
    // ours keeps the th>button accessible superset inside it.
    <TableHead className="cursor-pointer">
      <button
        type="button"
        className="inline-flex items-center gap-2 tracking-wide"
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

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
  Search,
  Target,
  TrendingUp,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox, Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import { IconStatCard, PageHeader, TableEmptyRow } from "@/components/shared/page-parts";
import { ConversionFunnel, PipelineBarChart, WonLostLineChart } from "@/components/charts/charts";
import { LeadDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { LEAD_STAGES, STAGE_META, isDroppedStage } from "@/lib/constants";
import { avgDaysBetween, formatCompactCurrency, formatCurrency, formatDate } from "@/lib/format";
import type { Lead } from "@/types";

type SortKey = "name" | "email" | "value" | "createdAt";
type SortDir = "asc" | "desc";

export default function LeadsPage() {
  const { leads, users, settings, loadingFlags, hydrated, deleteLead, fetchLeads } = useCrmStore();
  const [search, setSearch] = React.useState("");
  const [stage, setStage] = React.useState("all");
  const [ownerId, setOwnerId] = React.useState("all");
  const [source, setSource] = React.useState("all");
  const [openOnly, setOpenOnly] = React.useState(false);
  const [sortKey, setSortKey] = React.useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [showFilters, setShowFilters] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Lead | null>(null);

  React.useEffect(() => {
    if (hydrated) fetchLeads();
  }, [hydrated, fetchLeads]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "createdAt" ? "desc" : "asc");
    }
  }

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = leads.filter((l) => {
      if (q && !`${l.name} ${l.email ?? ""} ${l.company ?? ""}`.toLowerCase().includes(q)) return false;
      if (stage !== "all" && l.stage !== stage) return false;
      if (ownerId !== "all" && l.ownerId !== ownerId) return false;
      if (source !== "all" && l.source !== source) return false;
      if (openOnly && (l.stage === "won" || isDroppedStage(l.stage))) return false;
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
  }, [leads, search, stage, ownerId, source, openOnly, sortKey, sortDir]);

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

  // Won vs lost by month (last 6 months)
  const wonVsLost = React.useMemo(() => {
    const out: Array<{ month: string; won: number; lost: number }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const inRange = (l: Lead) => {
        const t = new Date(l.closedAt ?? l.createdAt);
        return t >= d && t < next;
      };
      out.push({
        month: d.toLocaleString("en-US", { month: "short" }),
        won: won.filter(inRange).length,
        lost: lost.filter(inRange).length,
      });
    }
    return out;
  }, [won, lost]);

  const funnel = React.useMemo(() => {
    const order = ["new", "contacted", "qualified", "proposal", "negotiation", "won"];
    const counts = order.map((s, i) => ({
      id: s,
      label: STAGE_META[s].label,
      count: leads.filter((l) => order.indexOf(l.stage) >= i || l.stage === "won").length,
      color: STAGE_META[s].color,
    }));
    // Make the funnel monotonically non-increasing (stage skips happen).
    for (let i = 1; i < counts.length; i += 1) {
      counts[i].count = Math.min(counts[i].count, counts[i - 1].count);
    }
    return counts.filter((c) => c.count > 0);
  }, [leads]);

  const sources = settings?.contactSources ?? ["Email", "Phone", "Website", "Referral"];

  async function onDelete(lead: Lead) {
    if (!window.confirm(`Delete "${lead.name}"? This cannot be undone.`)) return;
    await deleteLead(lead.id);
  }

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Manage your sales leads"
        actions={
          <>
            <Button
              variant="secondary"
              disabled={filtered.length === 0}
              onClick={() => downloadFile("/api/export?type=leads&download=1")}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
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

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className="pl-9" aria-label="Search leads" />
        </div>
        <Button variant="secondary" size="sm" className="h-9" aria-expanded={showFilters} onClick={() => setShowFilters((v) => !v)}>
          <Filter className="h-3.5 w-3.5" /> Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="mt-3">
          <CardContent className="flex flex-wrap items-end gap-4 py-4">
            <div className="grid gap-1.5">
              <Label>Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {LEAD_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{STAGE_META[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Owner</Label>
              <Select value={ownerId} onValueChange={setOwnerId}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="pb-1">
              <Checkbox checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} label="Open leads only" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reference wrapper: bg-white rounded-lg shadow — NO border (session-5). */}
      <Card className="mt-4 rounded-lg border-0 shadow">
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
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Value by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineBarChart data={pipelineByStage} height={240} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Won vs Lost Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <WonLostLineChart data={wonVsLost} height={240} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ConversionFunnel data={funnel} height={240} />
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

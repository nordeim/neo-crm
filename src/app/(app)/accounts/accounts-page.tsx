"use client";

import { downloadFile } from "@/lib/download";
import * as React from "react";
import { Building2, Download, MoreHorizontal, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox, Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import { BarStatCard, PageHeader, TableEmptyRow } from "@/components/shared/page-parts";
import { FILTER_RAIL, PAGE_KPI_GRIDS, PAGE_ROOT, RAIL_LAYOUT, TABLE_CARD, TABLE_TOOLBAR, VIEW_SWITCHER } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { AccountDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { ACCOUNT_STATUS_META, TIER_META, CHART_COLORS } from "@/lib/constants";
import { formatCompactCurrency, timeAgo } from "@/lib/format";
import type { Account } from "@/types";

const REVENUE_RANGES = [
  { id: "all", label: "All Revenue" },
  { id: "0-500k", label: "< $500k" },
  { id: "500k-2m", label: "AED 500K – 2M" },
  { id: "2m-10m", label: "AED 2M – 10M" },
  { id: "10m+", label: "AED 10M+" },
];

export default function AccountsPage() {
  const { accounts, users, activities, settings, hydrated, hydrate, deleteAccount, fetchAccounts } = useCrmStore();
  const [search, setSearch] = React.useState("");
  const [ownerId, setOwnerId] = React.useState("all");
  const [industry, setIndustry] = React.useState("all");
  const [revenue, setRevenue] = React.useState("all");
  const [tierKey, setTierKey] = React.useState(false);
  const [tierA, setTierA] = React.useState(false);
  const [tierB, setTierB] = React.useState(false);
  const [tierC, setTierC] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Account | null>(null);
  // S8-3: the reference's toolbar view-switcher — dead there, functional
  // here. The reference's trigger DISPLAYS "Table" (its value is set),
  // unlike the dashboard's middle select which renders empty.
  const [view, setView] = React.useState<string>("Table");

  React.useEffect(() => {
    if (hydrated) fetchAccounts();
  }, [hydrated, fetchAccounts]);

  const industries = React.useMemo(() => {
    const set = new Set<string>(settings?.industries ?? []);
    for (const a of accounts) if (a.industry) set.add(a.industry);
    return [...set].sort();
  }, [accounts, settings]);

  const overdueCount = React.useMemo(
    () =>
      activities.filter((a) => a.status === "scheduled" && a.dueAt && new Date(a.dueAt) < new Date()).length,
    [activities],
  );

  // Per-industry series feed the KPI sparklines (the reference shows a
  // 6-bar blue strip in every accounts KPI card; industries are the natural
  // six buckets for this workspace).
  const industrySpark = React.useMemo(() => {
    const buckets = new Map<string, number>();
    for (const i of industries) buckets.set(i, 0);
    for (const a of accounts) {
      const key = a.industry && buckets.has(a.industry) ? a.industry : [...buckets.keys()][0] ?? "";
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return [...buckets.values()];
  }, [accounts, industries]);

  const activeSpark = React.useMemo(() => {
    const buckets = new Map<string, number>();
    for (const i of industries) buckets.set(i, 0);
    for (const a of accounts) {
      if (a.status !== "active") continue;
      const key = a.industry && buckets.has(a.industry) ? a.industry : [...buckets.keys()][0] ?? "";
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return [...buckets.values()];
  }, [accounts, industries]);

  const revenueSpark = React.useMemo(() => {
    const buckets = new Map<string, number>();
    for (const i of industries) buckets.set(i, 0);
    for (const a of accounts) {
      const key = a.industry && buckets.has(a.industry) ? a.industry : [...buckets.keys()][0] ?? "";
      buckets.set(key, (buckets.get(key) ?? 0) + (a.annualRevenue ?? 0));
    }
    return [...buckets.values()];
  }, [accounts, industries]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return accounts.filter((a) => {
      if (q && !`${a.name} ${a.industry ?? ""} ${a.email ?? ""}`.toLowerCase().includes(q)) return false;
      if (ownerId !== "all" && a.ownerId !== ownerId) return false;
      if (industry !== "all" && a.industry !== industry) return false;
      const rev = a.annualRevenue ?? 0;
      if (revenue === "0-500k" && !(rev < 500_000)) return false;
      if (revenue === "500k-2m" && !(rev >= 500_000 && rev < 2_000_000)) return false;
      if (revenue === "2m-10m" && !(rev >= 2_000_000 && rev < 10_000_000)) return false;
      if (revenue === "10m+" && !(rev >= 10_000_000)) return false;
      const tiers = [tierKey && "key", tierA && "A", tierB && "B", tierC && "C"].filter(Boolean);
      if (tiers.length > 0) {
        const match =
          (tiers.includes("key") && a.isKey) ||
          tiers.includes(a.tier);
        if (!match) return false;
      }
      return true;
    });
  }, [accounts, search, ownerId, industry, revenue, tierKey, tierA, tierB, tierC]);

  const totalRevenue = accounts.reduce((s, a) => s + (a.annualRevenue ?? 0), 0);

  async function onDelete(account: Account) {
    if (!window.confirm(`Delete "${account.name}"? This cannot be undone.`)) return;
    const res = await deleteAccount(account.id);
    if (res.ok) {
      // toast handled globally by store refresh; add explicit feedback:
    }
  }

  return (
    // Session-16 (S16-P2): the page owns its padding — the reference's
    // accounts root is `p-4 sm:p-8 bg-gray-50 min-h-screen`.
    <div className={PAGE_ROOT.standard}>
      <PageHeader
        title="Accounts"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={filtered.length === 0}
              onClick={() => downloadFile("/api/export?type=accounts&download=1")}
            >
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> New Account
            </Button>
          </>
        }
      />

      {/* KPI cards — reference anatomy: label + trending-icon delta on top,
          bold value left + h-10 mini-bar strip right (DOM-verified). */}
      <div className={PAGE_KPI_GRIDS.accounts}>
        <BarStatCard
          label="Total Accounts"
          value={accounts.length}
          delta="+2%"
          bars={industrySpark}
          barColor={CHART_COLORS.blue400}
          barWidth="w-24"
        />
        <BarStatCard
          label="Active Accounts"
          value={accounts.filter((a) => a.status === "active").length}
          delta="+2%"
          bars={activeSpark}
          barColor={CHART_COLORS.green400}
          barWidth="w-24"
        />
        <BarStatCard
          label="Key Accounts"
          value={accounts.filter((a) => a.isKey).length}
          delta="+5%"
          bars={industrySpark.map((v) => Math.round(v / 3))}
          barColor={CHART_COLORS.cyan400}
          barWidth="w-24"
        />
        <BarStatCard
          label="Total Revenue"
          value={formatCompactCurrency(totalRevenue)}
          delta="+3.6%"
          bars={revenueSpark}
          barColor={CHART_COLORS.purple400}
          barWidth="w-24"
        />
        <BarStatCard
          label="Overdue Activities"
          value={overdueCount}
          bars={industrySpark.map((v) => Math.round(v / 4))}
          barColor={CHART_COLORS.red400}
          barWidth="w-24"
        />
      </div>

      {/* Session-6: reference layout = `flex gap-6` with the table card on
          `flex-1` (toolbar INSIDE the card as p-4 border-b) and a w-80
          filter rail visible from lg (rail hidden on phones — reference
          behavior, documented in the plan quirk register). */}
      <div className={RAIL_LAYOUT.row}>
        <div className={RAIL_LAYOUT.content}>
        {/* Reference wrapper: bg-white rounded-lg shadow — NO border (session-5). */}
        {/* Session-16 (S16-P5): a PLAIN div, not Card — the Card base
            ships `border border-line` which cn() cannot remove (the
            reference's table card is the borderless `bg-white rounded-lg
            shadow`; ours computed a 1px border + an invented
            overflow-hidden). */}
        <div className={TABLE_CARD.card}>
          {/* Toolbar — session-8 (S8-3) re-pinned from the live DOM:
              [Table/Cards switcher][Standard/Detailed density select (empty
              label)][More outline h-8] BEFORE the search, then Export CSV.
              The switcher is functional here (dead on the reference); the
              density select and More button are mirrored dead affordances
              (same treatment as the topbar mail/bell buttons — quirk
              register). */}
          <div className={TABLE_CARD.toolbar}>
            <div className={TABLE_TOOLBAR.row}>
              <Select value={view} onValueChange={setView}>
                <SelectTrigger className={VIEW_SWITCHER.trigger} aria-label="Accounts view">
                  <SelectValue placeholder={VIEW_SWITCHER.emptyLabel} />
                </SelectTrigger>
                <SelectContent>
                  {VIEW_SWITCHER.options.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Dead density switcher — the reference renders it with an
                  empty label and never sets a value. */}
              <Select value="" onValueChange={() => {}}>
                <SelectTrigger className={TABLE_TOOLBAR.select} aria-label="Row density">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {TABLE_TOOLBAR.densityOptions.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className={TABLE_TOOLBAR.moreBtn} aria-label="More">
                More
              </Button>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search accounts..." className="pl-9" aria-label="Search accounts" />
              </div>
              <Button
                variant="outline"
                size="sm"
                className={TABLE_TOOLBAR.moreBtn}
                disabled={filtered.length === 0}
                onClick={() => downloadFile("/api/export?type=accounts&download=1")}
              >
                Export CSV
              </Button>
            </div>
          </div>
          {view === "Cards" ? (
            /* S8-3 functional superset: the reference's switcher is dead;
               Cards renders the account list as a card grid at all widths. */
            <CardContent className="p-4">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">No accounts found</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((a) => (
                    <div key={a.id} className="rounded-lg border border-line bg-surface p-4 transition-colors hover:bg-line-soft/40">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={a.name} color="#e5e7eb" size="md" className="!text-gray-600" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{a.name}</p>
                            <p className="truncate text-xs text-muted">{a.industry ?? "—"}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={ACCOUNT_STATUS_META[a.status]?.badge}>
                          {ACCOUNT_STATUS_META[a.status]?.label ?? a.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Badge variant="outline" className={TIER_META[a.tier]?.badge}>{a.tier}</Badge>
                          {a.isKey && <Badge variant="warning">Key</Badge>}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {a.annualRevenue != null ? formatCompactCurrency(a.annualRevenue) : "—"}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
                        <span className="flex items-center gap-1.5">
                          {a.owner && <Avatar name={a.owner.name} color={a.owner.avatarColor} size="sm" />}
                          {a.owner?.name ?? "Unassigned"}
                        </span>
                        <span>{timeAgo(a.lastActivityAt ?? a.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          ) : (
          <div className={TABLE_CARD.scrollArea}>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableEmptyRow colSpan={8} message="No accounts found" />
                ) : (
                  <>
                    {filtered.map((a) => (
                      <TableRow key={a.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={a.name} color="#e5e7eb" size="md" className="!text-gray-600" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{a.name}</p>
                            <p className="truncate text-xs text-muted">{a.email ?? a.website ?? "—"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted">{a.industry ?? "—"}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        {a.annualRevenue != null ? formatCompactCurrency(a.annualRevenue) : "—"}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          <Badge variant="outline" className={TIER_META[a.tier]?.badge}>{a.tier}</Badge>
                          {a.isKey && <Badge variant="warning">Key</Badge>}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          {a.owner && <Avatar name={a.owner.name} color={a.owner.avatarColor} size="sm" />}
                          <span className="text-muted">{a.owner?.name ?? "Unassigned"}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-muted">{timeAgo(a.lastActivityAt ?? a.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={ACCOUNT_STATUS_META[a.status]?.badge}>
                          {ACCOUNT_STATUS_META[a.status]?.label ?? a.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger asChild>
                            <Button variant="ghost" size="iconSm" aria-label={`Actions for ${a.name}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownContent>
                            <DropdownItem
                              onClick={() => {
                                setEditing(a);
                                setDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4 text-muted" /> Edit
                            </DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem destructive onClick={() => onDelete(a)}>
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
          )}
        </div>
        </div>

        {/* Filter rail — session-6: reference renders a persistent w-80 rail
            (hidden below lg) as a Card with a Filters/Save-All header row,
            plain-div groups (select labels mb-2, checkbox label mb-3), and
            a full-width primary Filter button in a pt-2 wrapper. */}
        <div className={RAIL_LAYOUT.rail}>
          <Card>
            <CardHeader className={FILTER_RAIL.headerPad}>
              <div className={FILTER_RAIL.headerRow}>
                <CardTitle className={FILTER_RAIL.title}>Filters</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setOwnerId("all");
                    setIndustry("all");
                    setRevenue("all");
                    setTierKey(false);
                    setTierA(false);
                    setTierB(false);
                    setTierC(false);
                  }}
                >
                  Save All
                </Button>
              </div>
            </CardHeader>
            <CardContent className={FILTER_RAIL.body}>
              <div>
                <Label className={FILTER_RAIL.groupLabelSelect}>Owner</Label>
                <Select value={ownerId} onValueChange={setOwnerId}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={FILTER_RAIL.groupLabelSelect}>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={FILTER_RAIL.groupLabelSelect}>Revenue Range</Label>
                <Select value={revenue} onValueChange={setRevenue}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REVENUE_RANGES.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={FILTER_RAIL.groupLabel}>Tier</Label>
                <div className={FILTER_RAIL.checkboxStack}>
                  <Checkbox checked={tierKey} onCheckedChange={setTierKey} label="Key Account" />
                  <Checkbox checked={tierA} onCheckedChange={setTierA} label="A" />
                  <Checkbox checked={tierB} onCheckedChange={setTierB} label="B" />
                  <Checkbox checked={tierC} onCheckedChange={setTierC} label="C" />
                </div>
              </div>
              {/* Full-width primary Filter button (reference anatomy). With
                  live filtering it re-hydrates the data under the current
                  filters — a real refresh action (fix-over-defect). */}
              <div className={FILTER_RAIL.filterButtonWrap}>
                <Button className="w-full" onClick={() => void hydrate()}>Filter</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AccountDialog open={dialogOpen} onOpenChange={setDialogOpen} account={editing} />
    </div>
  );
}

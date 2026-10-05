"use client";

import { downloadBlob } from "@/lib/download";
import * as React from "react";
import { Building2, Download, MoreVertical, Plus, Search, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox, Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// Session-56 (S56-P1, N-56a): DropdownSeparator narrowed out of the
// dropdown import below — its only in-file reference was the import
// itself (the N-53c/N-55a class). The export stays alive (leads-page
// consumes it live).
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown";
import { BarStatCard, PageHeader, TableEmptyRow } from "@/components/shared/page-parts";
import { FILTER_RAIL, PAGE_KPI_GRIDS, PAGE_ROOT, RAIL_LAYOUT, TABLE_CARD, TABLE_TOOLBAR, VIEW_SWITCHER } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { AccountDialog } from "@/components/shared/entity-dialogs";
import { EntityEditDialog, ACCOUNT_EDIT_FIELDS } from "@/components/shared/entity-edit-dialog";
import { AccountInsightsDialog } from "@/components/accounts/account-insights-dialog";
import { useCrmStore } from "@/stores/crm-store";
import { ACCOUNT_TIER_BADGE, ACCOUNT_HEALTH_BADGE, CHART_COLORS } from "@/lib/constants";
import { formatCompactCurrency, timeAgo } from "@/lib/format";
import { csvFilename } from "@/lib/csv";
import { toQuotedCsv } from "@/lib/entity-export";
import type { Account } from "@/types";

// Session-28 (S28-P6): the reference's Oce Revenue Range values —
// $0-$1M / $1M-$5M / $5M+ (bundle-extracted; our legacy ranges retire).
const REVENUE_RANGES = [
  { id: "all", label: "All Revenue" },
  { id: "0-1m", label: "$0 - $1M" },
  { id: "1m-5m", label: "$1M - $5M" },
  { id: "5m+", label: "$5M+" },
];

export default function AccountsPage() {
  const {
    accounts,
    contacts,
    opportunities,
    users,
    activities,
    settings,
    hydrated,
    hydrate,
    deleteAccount,
    updateAccount,
    fetchAccounts,
  } = useCrmStore();
  // Session-26 (S26-P5): the reference's accounts page export
  // (bundle-extracted): a client-side quoted CSV with the 10-column set
  // Name,Industry,Phone,Email,Website,Annual Revenue,Employees,Status,
  // Tier,Health + the `accounts_ISO-date.csv` filename + the
  // `if (length === 0) return;` guard. The reference's header button is
  // disabled at zero data; its toolbar one stays ENABLED with the runtime
  // guard (its own pair inconsistency, mirrored verbatim). The export
  // covers the FULL list, not the filtered view.
  // Session-62 (N-62e) precision note: the header binding below reads
  // `filtered.length === 0` — zero-FILTERED, not zero-data. The
  // reference's own zero-data state makes the two indistinguishable
  // LIVE (its demo workspace ships empty), so the mirror claim cannot
  // be resolved beyond what the bundle shows; the binding + its pin
  // stay as shipped, annotated here.
  function exportAccounts() {
    if (accounts.length === 0) return;
    const header = ["Name", "Industry", "Phone", "Email", "Website", "Annual Revenue", "Employees", "Status", "Tier", "Health"];
    const rows = accounts.map((a) => [
      a.name || "",
      a.industry || "",
      a.phone || "",
      a.email || "",
      a.website || "",
      String(a.annualRevenue || ""),
      String(a.employees || ""),
      a.status || "",
      a.tier || "",
      a.health || "",
    ]);
    downloadBlob(toQuotedCsv(header, rows), csvFilename("accounts"), "text/csv");
  }

  const [search, setSearch] = React.useState("");
  const [ownerId, setOwnerId] = React.useState("all");
  const [industry, setIndustry] = React.useState("all");
  const [revenue, setRevenue] = React.useState("all");
  const [tierKey, setTierKey] = React.useState(false);
  const [tierA, setTierA] = React.useState(false);
  const [tierB, setTierB] = React.useState(false);
  const [tierC, setTierC] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // Session-28 (S28-P2/P6): the reference's SEPARATE surfaces — the wce
  // edit dialog (the ⋮ Edit item) + the Ece insights dialog (the row click
  // / the View Insights item).
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Account | null>(null);
  const [insightsOpen, setInsightsOpen] = React.useState(false);
  const [insightsAccount, setInsightsAccount] = React.useState<Account | null>(null);
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
      if (revenue === "0-1m" && !(rev < 1_000_000)) return false;
      if (revenue === "1m-5m" && !(rev >= 1_000_000 && rev < 5_000_000)) return false;
      if (revenue === "5m+" && !(rev >= 5_000_000)) return false;
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
    // Session-46 (S46-P1): the failed delete was fully silent (the store's
    // call() is total and toasts nothing — the old comment claiming a
    // global toast was false). The entity-dialogs convention:
    if (!res.ok) {
      toast.error("Could not delete account", res.error);
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
              onClick={exportAccounts}
            >
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button
              size="sm"
              onClick={() => {
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
          value={formatCompactCurrency(totalRevenue, { scale: "M" })}
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
                onClick={exportAccounts}
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
                        <Badge className={
                          a.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }>
                          {a.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Badge className={ACCOUNT_TIER_BADGE[a.isKey ? "Key" : a.tier] ?? ACCOUNT_TIER_BADGE.C}>
                            {a.isKey ? "Key" : a.tier}
                          </Badge>
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {/* Session-32 (S32-P3): the M-scale form — the
                              reference's revenue convention (its table cell
                              renders the literal `$${(v/1e6).toFixed(1)}M`). */}
                          {a.annualRevenue != null ? formatCompactCurrency(a.annualRevenue, { scale: "M" }) : "—"}
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
                    {filtered.map((a) => {
                      // Session-28 (S28-P6): the reference's per-account
                      // overdue count (the red border-l-4 + the badge).
                      const overdue = activities.filter(
                        (act) =>
                          act.accountId === a.id &&
                          act.status === "scheduled" &&
                          act.dueAt &&
                          new Date(act.dueAt) < new Date(),
                      ).length;
                      const owner = users.find((u) => u.id === a.ownerId);
                      const ownerInitials = owner
                        ? owner.name.split(" ").map((w) => w[0]).join("")
                        : "A";
                      const tier = a.isKey ? "Key" : a.tier;
                      return (
                    <TableRow
                      key={a.id}
                      className={cn(
                        "cursor-pointer hover:bg-gray-50",
                        (a.isKey || a.tier === "Key") && "bg-yellow-50/30",
                        overdue > 0 && "border-l-4 border-l-red-500",
                      )}
                      onClick={() => {
                        setInsightsAccount(a);
                        setInsightsOpen(true);
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{a.name}</p>
                              {(a.isKey || a.tier === "Key") && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              )}
                              {overdue > 0 && (
                                <Badge variant="danger" className="text-xs">
                                  {overdue} Overdue
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{a.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{a.industry || "-"}</TableCell>
                      <TableCell>
                        {a.annualRevenue ? `$${(a.annualRevenue / 1e6).toFixed(1)}M` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={ACCOUNT_TIER_BADGE[tier] ?? ACCOUNT_TIER_BADGE.C}>
                          {tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center">
                            {ownerInitials}
                          </div>
                          <span className="text-sm">{owner?.name ?? a.ownerId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {a.lastActivityAt ? new Date(a.lastActivityAt).toLocaleDateString() : "No activity"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {/* Session-28 (S28-P6): the reference renders the
                            HEALTH badge under the "Status" header — its own
                            header/cell mismatch, mirrored verbatim. */}
                        <Badge className={ACCOUNT_HEALTH_BADGE[a.health] ?? ACCOUNT_HEALTH_BADGE.Healthy}>
                          {a.health}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${a.name}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownContent>
                            <DropdownItem
                              onClick={() => {
                                setEditTarget(a);
                                setEditOpen(true);
                              }}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                setInsightsAccount(a);
                                setInsightsOpen(true);
                              }}
                            >
                              View Insights
                            </DropdownItem>
                            <DropdownItem destructive onClick={() => onDelete(a)}>
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownItem>
                          </DropdownContent>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                      );
                    })}
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
              {/* Full-width primary Filter button (reference anatomy —
                  Session-28: the reference's explicit bg-blue-600
                  hover:bg-blue-700 pair). With live filtering it re-hydrates
                  the data under the current filters — a real refresh action
                  (fix-over-defect). */}
              <div className={FILTER_RAIL.filterButtonWrap}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => void hydrate()}>Filter</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Session-28 (S28-P2): the wce Edit Account dialog — a SEPARATE
          max-w-2xl dialog with the full field set (Website url, Annual
          Revenue / Employees numbers, the 3-option Status), wired to the ⋮
          Edit item. */}
      <EntityEditDialog
        key={editTarget?.id ?? "none"}
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditTarget(null);
        }}
        title="Edit Account"
        detailsTitle="Account Details"
        fields={ACCOUNT_EDIT_FIELDS}
        initial={{
          name: editTarget?.name ?? "",
          industry: editTarget?.industry ?? "",
          phone: editTarget?.phone ?? "",
          email: editTarget?.email ?? "",
          website: editTarget?.website ?? "",
          annualRevenue: editTarget?.annualRevenue ?? "",
          employees: editTarget?.employees ?? "",
          status: editTarget?.status ?? "active",
        }}
        onSubmit={async (form) => {
          if (!editTarget) return;
          const res = await updateAccount(editTarget.id, {
            name: form.name,
            industry: form.industry || null,
            phone: form.phone || null,
            email: form.email || null,
            website: form.website || null,
            annualRevenue: form.annualRevenue ? Number(form.annualRevenue) : null,
            employees: form.employees ? Number(form.employees) : null,
            status: form.status,
          });
          if (res.ok) {
            setEditOpen(false);
            setEditTarget(null);
          } else {
            // Session-46 (S46-P1): a failed PUT used to strand the dialog
            // open with a dead-feeling Save — the entity-dialogs convention
            // toasts and the user keeps their edit.
            toast.error("Could not save account", res.error);
          }
        }}
      />

      {/* Session-28 (S28-P6): the Ece Account Insights dialog (the row
          click + the View Insights item). */}
      <AccountInsightsDialog
        open={insightsOpen}
        onOpenChange={(o) => {
          setInsightsOpen(o);
          if (!o) setInsightsAccount(null);
        }}
        account={insightsAccount}
        activities={activities}
        contacts={contacts}
        opportunities={opportunities}
      />

      <AccountDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

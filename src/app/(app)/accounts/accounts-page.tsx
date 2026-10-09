"use client";

import { downloadBlob } from "@/lib/download";
import * as React from "react";
import { Building2, Download, EllipsisVertical, Plus, Search, Star } from "lucide-react";
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
// Session-73 (S73-P1, M-73c6): the row-action menu migrated to the REAL
// Menu* primitives (the reference's own construction — its five Yg
// align:"end" DropdownMenus bundle-decoded: the account menu + the four
// row menus, all with stock text-only $s items).
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/dropdown";
import { BarStatCard, PageHeader, TableEmptyRow } from "@/components/shared/page-parts";
import { FILTER_RAIL, PAGE_KPI_GRIDS, PAGE_ROOT, RAIL_LAYOUT, TABLE_CARD, TABLE_TOOLBAR, VIEW_SWITCHER } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { AccountDialog } from "@/components/shared/entity-dialogs";
import { EntityEditDialog, ACCOUNT_EDIT_FIELDS } from "@/components/shared/entity-edit-dialog";
import { AccountInsightsDialog } from "@/components/accounts/account-insights-dialog";
import { useCrmStore } from "@/stores/crm-store";
import { ACCOUNT_TIER_BADGE, ACCOUNT_HEALTH_BADGE } from "@/lib/constants";
// Session-86 (M-86c2): the COMPUTED tier seam — the reference derives
// tier from revenue everywhere (its N memo's te); our stored tier/isKey
// columns retire.
import { accountTierFromRevenue } from "@/lib/account-tier";
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
  // Session-71 (S71-P2): the saving state feeding the edit dialog's
  // isLoading (the reference's disabled/"Saving..." capability).
  const [savingEdit, setSavingEdit] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Account | null>(null);
  const [insightsOpen, setInsightsOpen] = React.useState(false);
  const [insightsAccount, setInsightsAccount] = React.useState<Account | null>(null);
  // S8-3: the reference's toolbar view-switcher — dead there, functional
  // here. The reference's trigger DISPLAYS "Table" (its value is set),
  // unlike the dashboard's middle select which renders empty.
  const [view, setView] = React.useState<string>("Table");
  // Session-78 (L-78c5, the M-77c3 missed sibling): the reference's accounts
  // tbody renders a colSpan-8 "Loading..." row while the first fetch is in
  // flight (bundle-decoded: `b ? Loading... : E.length===0 ? "No accounts
  // found" : rows`) — the s77 leadsLoaded local-flag precedent, applied to
  // the sibling page the s77 rotation did not cover.
  const [accountsLoaded, setAccountsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!hydrated) return;
    // Session-78 (L-78c5): the flag flips when the fetch settles (either
    // way — a failed fetch must not strand the Loading row).
    void fetchAccounts().then(() => setAccountsLoaded(true));
  }, [hydrated, fetchAccounts]);

  const industries = React.useMemo(() => {
    const set = new Set<string>(settings?.industries ?? []);
    for (const a of accounts) if (a.industry) set.add(a.industry);
    return [...set].sort();
  }, [accounts, settings]);

  // Session-75 (M-75c1-1, bundle-decoded): the reference's Overdue
  // Activities KPI counts ACCOUNTS with >=1 overdue scheduled activity
  // (its memo: N.filter(te => te.overdueActivities > 0).length —
  // overdueAccounts), NOT the raw overdue-activity count.
  const overdueAccounts = React.useMemo(
    () =>
      new Set(
        activities
          .filter(
            (a) =>
              a.status === "scheduled" &&
              a.dueAt &&
              new Date(a.dueAt) < new Date() &&
              a.accountId != null,
          )
          .map((a) => a.accountId),
      ).size,
    [activities],
  );

  // Session-75 (L-75c1-2, bundle-decoded): the five KPI sparkbars are the
  // reference's STATIC 6-value chartData literals — never computed
  // per-industry buckets (the t3e-era industrySpark memos retired).

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const tiers = [tierKey && "Key", tierA && "A", tierB && "B", tierC && "C"].filter(Boolean);
    return accounts.filter((a) => {
      // Session-86 (L-86c3): the reference's search matches NAME ONLY
      // (its memo: `U.name?.toLowerCase().includes(e.toLowerCase())`)
      // — the s10-era name+industry+email concat retired (searching
      // "logistics", an INDUSTRY value, matched 2 rows where the
      // reference matches 0).
      if (q && !a.name.toLowerCase().includes(q)) return false;
      // Session-86 (N-86c7, documented superset): the reference's Owner
      // + Revenue Range selects are DEAD — its filter memo reads
      // name/industry/tiers ONLY (d.owner/d.revenue are tracked state,
      // never read). OURS filter live (fix-over-defect, the S33-P1
      // dashboard-search precedent — our workspace carries real users
      // + revenue data that the filters genuinely narrow).
      if (ownerId !== "all" && a.ownerId !== ownerId) return false;
      if (industry !== "all" && a.industry !== industry) return false;
      const rev = a.annualRevenue ?? 0;
      if (revenue === "0-1m" && !(rev < 1_000_000)) return false;
      if (revenue === "1m-5m" && !(rev >= 1_000_000 && rev < 5_000_000)) return false;
      if (revenue === "5m+" && !(rev >= 5_000_000)) return false;
      // Session-86 (M-86c2): the checkbox filter matches the COMPUTED
      // tier (the reference's `d.tiers.includes(U.tier)` — with
      // "Key Account" mapping to computed "Key"); the stored a.isKey/
      // a.tier arms retired with the columns.
      const match =
        tiers.length === 0 ||
        tiers.includes(accountTierFromRevenue(a.annualRevenue));
      return match;
    });
  }, [accounts, search, ownerId, industry, revenue, tierKey, tierA, tierB, tierC]);

  const totalRevenue = accounts.reduce((s, a) => s + (a.annualRevenue ?? 0), 0);

  // Session-26 (S26-P5) + Session-86 (L-86c4): the reference's accounts
  // page export (bundle-extracted): a client-side quoted CSV with the
  // 10-column set Name,Industry,Phone,Email,Website,Annual Revenue,
  // Employees,Status,Tier,Health + the `accounts_ISO-date.csv` filename
  // + the `if (m.length === 0) return;` guard — a zero-RAW guard. The
  // ROWS map the FILTERED memo (its `ee = E.map(...)` — E is the filter
  // memo; the s26 "covers the FULL list" note was a misdecode of the
  // same bundle). The header button is disabled at zero RAW data; the
  // toolbar one stays ENABLED with the runtime guard (its own pair
  // inconsistency, mirrored verbatim). The Tier column carries the
  // COMPUTED tier (its fe.tier is the memo's derived value).
  function exportAccounts() {
    if (accounts.length === 0) return;
    const header = ["Name", "Industry", "Phone", "Email", "Website", "Annual Revenue", "Employees", "Status", "Tier", "Health"];
    const rows = filtered.map((a) => [
      a.name || "",
      a.industry || "",
      a.phone || "",
      a.email || "",
      a.website || "",
      String(a.annualRevenue || ""),
      String(a.employees || ""),
      a.status || "",
      accountTierFromRevenue(a.annualRevenue),
      a.health || "",
    ]);
    downloadBlob(toQuotedCsv(header, rows), csvFilename("accounts"), "text/csv");
  }


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
              disabled={accounts.length === 0}
              onClick={exportAccounts}
            >
              <Download className="h-4 w-4 mr-2" /> <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> New Account
            </Button>
          </>
        }
      />

      {/* KPI cards — the zv (accounts) arm of the gm/zv family
          (DOM-verified): label + trending-icon delta on top, bold value
          left + h-10 w-24 mini-bar strip right. Session-90 (L-90c4):
          the color KEY + the trend/trendValue pair (the reference's
          own call-site vocabulary — trend="up" on the first four, none
          on Overdue). */}
      <div className={PAGE_KPI_GRIDS.accounts}>
        <BarStatCard
          arm="accounts"
          label="Total Accounts"
          value={accounts.length}
          trend="up"
          trendValue="+2%"
          bars={[50, 60, 55, 70, 65, 75]}
          color="blue"
        />
        <BarStatCard
          arm="accounts"
          label="Active Accounts"
          value={accounts.filter((a) => a.status === "active").length}
          trend="up"
          trendValue="+2%"
          bars={[55, 60, 58, 68, 65, 72]}
          color="green"
        />
        <BarStatCard
          arm="accounts"
          label="Key Accounts"
          value={accounts.filter((a) => accountTierFromRevenue(a.annualRevenue) === "Key").length}
          trend="up"
          trendValue="+5%"
          bars={[40, 45, 50, 55, 58, 62]}
          color="cyan"
        />
        <BarStatCard
          arm="accounts"
          label="Total Revenue"
          value={formatCompactCurrency(totalRevenue, { scale: "M" })}
          trend="up"
          trendValue="+3.6%"
          bars={[60, 65, 70, 75, 78, 82]}
          color="purple"
        />
        <BarStatCard
          arm="accounts"
          label="Overdue Activities"
          value={overdueAccounts}
          bars={[30, 35, 40, 38, 42, 45]}
          color="red"
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
                {/* Session-86 (N-86c6 + N-86c7): the reference's icon is
                    `absolute left-3 top-1/2 transform -translate-y-1/2
                    text-gray-400 w-4 h-4` (its v3-era transform is inert
                    under v4; text-subtle computes the same #9ca3af) and its
                    input carries the explicit `pl-9 h-9` — mirrored. The
                    pointer-events-none is OUR click-through fix (the
                    reference's icon is a 16x16 click dead-zone over the
                    input's padding). */}
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search accounts..." className="pl-9 h-9" aria-label="Search accounts" />
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
                          <Badge className={ACCOUNT_TIER_BADGE[accountTierFromRevenue(a.annualRevenue)] ?? ACCOUNT_TIER_BADGE.C}>
                            {accountTierFromRevenue(a.annualRevenue)}
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
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!accountsLoaded ? (
                  <TableEmptyRow colSpan={8} message="Loading..." />
                ) : filtered.length === 0 ? (
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
                      const tier = accountTierFromRevenue(a.annualRevenue);
                      return (
                    <TableRow
                      key={a.id}
                      // Session-65 (N-65d) + Session-86 (M-86c2): the tier
                      // is DERIVED from revenue (the reference's N memo's
                      // te — >1M Key / >500k A / >100k B / else C); the
                      // stored a.isKey/a.tier arms retired with the columns.
                      className={cn(
                        "cursor-pointer hover:bg-gray-50",
                        tier === "Key" && "bg-yellow-50/30",
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
                              {tier === "Key" && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              )}
                              {overdue > 0 && (
                                <Badge variant="destructive" className="text-xs">
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
                            header/cell mismatch, mirrored verbatim.
                            Session-75 (N-75c1-4, bundle-decoded): the
                            out-of-vocabulary terminal is the GRAY map
                            (`||"bg-gray-100 text-gray-800"`), not the
                            Healthy green. */}
                        <Badge className={ACCOUNT_HEALTH_BADGE[a.health] ?? "bg-gray-100 text-gray-800"}>
                          {a.health}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Menu>
                          <MenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${a.name}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EllipsisVertical className="h-4 w-4" />
                            </Button>
                          </MenuTrigger>
                          <MenuContent>
                            <MenuItem
                              onClick={() => {
                                setEditTarget(a);
                                setEditOpen(true);
                              }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                setInsightsAccount(a);
                                setInsightsOpen(true);
                              }}
                            >
                              View Insights
                            </MenuItem>
                            {/* S73-P1 (M-73c9): the reference's bare
                                text-red-600 literal on the stock item —
                                the destructive prop's danger-soft hover
                                was our invention. The window.confirm gate
                                below is our documented safety superset
                                (the reference's deletes are direct). */}
                            <MenuItem className="text-red-600" onClick={() => onDelete(a)}>
                              Delete
                            </MenuItem>
                          </MenuContent>
                        </Menu>
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
                    // Session-86 (N-86c7, documented superset): the
                    // reference's Save All has NO onClick — a dead button
                    // (the Oce bundle decode). OURS resets the filters to
                    // their defaults (fix-over-defect — a control that
                    // looks like an action should do something; the
                    // dashboard view-switcher precedent).
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
                {/* Session-86 (N-86c5): the reference's SelectValue
                    placeholders ("John Kuy" / "Technology" /
                    "$1M to $5M") are DEAD — its filter defaults are the
                    "all" values, which always match an item, so the
                    placeholder never renders; mirrored for source parity
                    (the N-83c5 reports-filter precedent). Session-86
                    (N-86c7): its Owner/Industry ITEM sets are static
                    literals (All Owners/John Kuy + the five industries) —
                    OURS map the real workspace users + the settings
                    industries (functional supersets). */}
                <Select value={ownerId} onValueChange={setOwnerId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="John Kuy" /></SelectTrigger>
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
                  <SelectTrigger className="w-full"><SelectValue placeholder="Technology" /></SelectTrigger>
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
                  <SelectTrigger className="w-full"><SelectValue placeholder="$1M to $5M" /></SelectTrigger>
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
        isLoading={savingEdit}
        onSubmit={async (form) => {
          if (!editTarget) return;
          // Session-71 (S71-P2, L-71b1): the savingEdit bracket — the
          // reference's own disabled/"Saving..." capability
          // (bundle-decoded: disabled:isPending), closing the N-46e
          // wire-or-remove posture + the double-submit guard.
          setSavingEdit(true);
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
          setSavingEdit(false);
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

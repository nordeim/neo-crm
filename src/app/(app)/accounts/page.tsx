"use client";

import { downloadFile } from "@/lib/download";
import * as React from "react";
import { Building2, Download, MoreHorizontal, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox, Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import { KpiCard, PageHeader } from "@/components/shared/page-parts";
import { AccountDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { ACCOUNT_STATUS_META, TIER_META } from "@/lib/constants";
import { formatCompactCurrency, timeAgo } from "@/lib/format";
import type { Account } from "@/types";

const REVENUE_RANGES = [
  { id: "all", label: "All Revenue" },
  { id: "0-500k", label: "< AED 500K" },
  { id: "500k-2m", label: "AED 500K – 2M" },
  { id: "2m-10m", label: "AED 2M – 10M" },
  { id: "10m+", label: "AED 10M+" },
];

export default function AccountsPage() {
  const { accounts, users, activities, settings, loadingFlags, hydrated, deleteAccount, fetchAccounts } = useCrmStore();
  const [search, setSearch] = React.useState("");
  const [ownerId, setOwnerId] = React.useState("all");
  const [industry, setIndustry] = React.useState("all");
  const [revenue, setRevenue] = React.useState("all");
  const [tierKey, setTierKey] = React.useState(false);
  const [tierA, setTierA] = React.useState(false);
  const [tierB, setTierB] = React.useState(false);
  const [tierC, setTierC] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Account | null>(null);

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
    <div>
      <PageHeader
        title="Accounts"
        actions={
          <>
            <Button
              variant="secondary"
              disabled={filtered.length === 0}
              onClick={() => downloadFile("/api/export?type=accounts&download=1")}
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button
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

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total Accounts" value={accounts.length} delta={2} hint="vs. last quarter" />
        <KpiCard label="Active Accounts" value={accounts.filter((a) => a.status === "active").length} delta={2} hint="currently engaged" />
        <KpiCard label="Key Accounts" value={accounts.filter((a) => a.isKey).length} delta={5} hint="strategic tier" />
        <KpiCard label="Total Revenue" value={formatCompactCurrency(totalRevenue)} delta={3.6} hint="annual, all accounts" />
        <KpiCard label="Overdue Activities" value={overdueCount} hint="past due date" />
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Select defaultValue="table">
          <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="table">Table</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" size="sm" className="h-9" onClick={() => setShowFilters((v) => !v)}>
          More
        </Button>
        <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search accounts..." className="pl-9" aria-label="Search accounts" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-9"
          disabled={filtered.length === 0}
          onClick={() => downloadFile("/api/export?type=accounts&download=1")}
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {/* Table + filters */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <Card>
          <CardContent className="px-0 py-0">
            {loadingFlags.accounts && accounts.length === 0 ? (
              <div className="flex flex-col gap-2 p-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Building2 className="h-5 w-5" />}
                title="No accounts found"
                description="Try adjusting your search or filters, or create your first account."
              />
            ) : (
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
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Filters panel */}
        {showFilters && (
          <Card className="h-fit">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Filters</p>
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
              <div className="grid gap-1.5">
                <Label>Owner</Label>
                <Select value={ownerId} onValueChange={setOwnerId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Revenue Range</Label>
                <Select value={revenue} onValueChange={setRevenue}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REVENUE_RANGES.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Tier</Label>
                <div className="flex flex-col gap-2 pt-0.5">
                  <Checkbox checked={tierKey} onChange={(e) => setTierKey(e.target.checked)} label="Key Account" />
                  <Checkbox checked={tierA} onChange={(e) => setTierA(e.target.checked)} label="A" />
                  <Checkbox checked={tierB} onChange={(e) => setTierB(e.target.checked)} label="B" />
                  <Checkbox checked={tierC} onChange={(e) => setTierC(e.target.checked)} label="C" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AccountDialog open={dialogOpen} onOpenChange={setDialogOpen} account={editing} />
    </div>
  );
}

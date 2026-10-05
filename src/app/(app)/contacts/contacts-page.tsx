"use client";

import { downloadBlob } from "@/lib/download";
import * as React from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleCheckBig,
  Crown,
  Download,
  FileText,
  Mail,
  MessageCircle,
  MoreVertical,
  Phone,
  Plus,
  // Session-17 (S17-P2c): the reference's Scan Card ships `scan` (4
  // corner brackets, NO center line — ScanLine adds it) and its Import
  // button ships a DOWNLOAD glyph (the reference's own quirk).
  Scan,
  Search,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { FilterPolygon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Session-56 (S56-P1, N-56a): SIX orphaned tokens narrowed out of this
// file's imports — Pencil (the lucide block above), Avatar (its whole
// import line, deleted), DropdownSeparator (dropdown), FILTER_RAIL
// (page-layout), ENGAGEMENT_LEVELS (constants), and timeAgo (its whole
// import line, deleted) — each had exactly one in-file reference: the
// import itself (the N-53c/N-55a class; the s53/s55 sweeps never read
// this file's full import surface). The exports stay alive on their real
// consumers (timeAgo is LIVE in activities-page; ENGAGEMENT_LEVELS in
// the contacts API routes; FILTER_RAIL in calendar/reports; Avatar in
// accounts-page + the ui kit [s57 correction — profile hand-rolls its
// avatar spans]; DropdownSeparator in leads).
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown";
import { IconStatCard, PageHeader, TableEmptyRow } from "@/components/shared/page-parts";
import { CONTACTS_LAYOUT, PAGE_KPI_GRIDS, TABLE_CARD } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { ContactDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { ContactDetailPanel } from "@/components/contacts/contact-detail-panel";
import { EntityEditDialog, CONTACT_EDIT_FIELDS } from "@/components/shared/entity-edit-dialog";
import {
  COMPANY_SIZES,
  CONTACT_PRIORITY_META,
  CONTACT_ROLES,
  CONTACT_SOURCE_OPTIONS,
  ENGAGEMENT_BARS,
  engagementBarCount,
  lastActivityCe,
} from "@/lib/constants";
import { csvFilename, parseCsv } from "@/lib/csv";
import { toQuotedCsv } from "@/lib/entity-export";
import type { Contact } from "@/types";

type SortKey = "name" | "lastActivity";
type SortDir = "asc" | "desc";

export default function ContactsPage() {
  // Session-65 (N-65c): leads/users/settings RETIRED from this
  // destructure — zero body reads (comment mentions only; the s41-P5
  // sweep deleted the dead `sources` sibling and missed these three).
  const {
    contacts,
    activities,
    opportunities,
    hydrated,
    deleteContact,
    updateContact,
    fetchContacts,
    importContacts,
  } = useCrmStore();
  const [search, setSearch] = React.useState("");
  // Session-28 (S28-P5): the reference's kke FILTER MODEL — checkbox
  // groups (roles/priorities/companySizes/sources as arrays, the single
  // noRecentActivity flag), NOT select dropdowns. "Clear All" resets.
  const [roles, setRoles] = React.useState<string[]>([]);
  const [priorities, setPriorities] = React.useState<string[]>([]);
  const [companySizes, setCompanySizes] = React.useState<string[]>([]);
  const [sourcesF, setSourcesF] = React.useState<string[]>([]);
  const [noRecentActivity, setNoRecentActivity] = React.useState(false);
  const [sortKey, setSortKey] = React.useState<SortKey>("lastActivity");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [showFilters, setShowFilters] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // Session-28 (S28-P2/P4): the reference's SEPARATE surfaces — the W7
  // edit dialog (the ⋮ Edit item) and the Pke slide-over (the row click).
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Contact | null>(null);
  const [detailContact, setDetailContact] = React.useState<Contact | null>(null);
  const [scanOpen, setScanOpen] = React.useState(false);
  // Session-28 (S28-P5): the NAe Scan Card state (the chosen image + the
  // scanning flag).
  const [scanFile, setScanFile] = React.useState<File | null>(null);
  const [scanBusy, setScanBusy] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  // Session-26 (S26-P6): the reference's import dialog state — the chosen
  // file, the busy flag, the result (green/red). The reference also tracks
  // uploading separately (its base44 storage round-trip); our parse is
  // local so one busy flag covers it (documented divergence).
  const [importFile, setImportFile] = React.useState<File | null>(null);
  const [importBusy, setImportBusy] = React.useState(false);
  const [importResult, setImportResult] = React.useState<{ success: boolean; message: string } | null>(null);

  React.useEffect(() => {
    if (hydrated) fetchContacts();
  }, [hydrated, fetchContacts]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = contacts.filter((c) => {
      if (q && !`${c.name} ${c.email ?? ""} ${c.company ?? ""} ${c.position ?? ""}`.toLowerCase().includes(q)) return false;
      // Session-28 (S28-P5): the kke checkbox model — a contact passes a
      // group when it carries ANY of the checked values (an empty group
      // passes everything); noRecentActivity keeps the 30-day rule.
      if (roles.length > 0 && !roles.includes(c.role ?? "")) return false;
      if (priorities.length > 0 && !priorities.includes(c.priority)) return false;
      if (companySizes.length > 0 && !companySizes.includes(c.companySize ?? "")) return false;
      if (sourcesF.length > 0 && !sourcesF.includes(c.source ?? "")) return false;
      if (noRecentActivity) {
        const last = c.lastActivityAt ? new Date(c.lastActivityAt).getTime() : null;
        const stale = last == null || Date.now() - last >= 30 * 86400000;
        if (!stale) return false;
      }
      return true;
    });
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else {
        const av = new Date(a.lastActivityAt ?? a.createdAt).getTime();
        const bv = new Date(b.lastActivityAt ?? b.createdAt).getTime();
        cmp = av - bv;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [contacts, search, roles, priorities, companySizes, sourcesF, noRecentActivity, sortKey, sortDir]);

  // Session-28 (S28-P5): the reference's kke toggle/reset handlers.
  const toggleFilter = (group: "roles" | "priorities" | "companySizes" | "sources", value: string) => {
    const setters = { roles: setRoles, priorities: setPriorities, companySizes: setCompanySizes, sources: setSourcesF };
    const current = { roles, priorities, companySizes, sources: sourcesF }[group];
    setters[group](current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };
  const clearFilters = () => {
    setRoles([]);
    setPriorities([]);
    setCompanySizes([]);
    setSourcesF([]);
    setNoRecentActivity(false);
  };

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Session-41 (S41-P5): the dead `sources` var deleted — zero reads (the
  // kke filter panel uses `sourcesF` + the static CONTACT_SOURCE_OPTIONS;
  // the settings-managed contactSources list drives nothing functional).

  // Session-28 (S28-P3): the inline role update — the reference's row
  // select fires the mutation immediately (X = the async update).
  async function updateRole(id: string, role: string) {
    const res = await updateContact(id, { role });
    // Session-46 (S46-P1): the row select's mutation was fire-and-forget —
    // a failed role update left the select showing the un-persisted value
    // with zero feedback.
    if (!res.ok) {
      toast.error("Could not update contact", res.error);
    }
  }

  async function onDelete(contact: Contact) {
    if (!window.confirm(`Delete "${contact.name}"? This cannot be undone.`)) return;
    const res = await deleteContact(contact.id);
    // Session-46 (S46-P1): the entity-dialogs failure convention.
    if (!res.ok) {
      toast.error("Could not delete contact", res.error);
    }
  }

  /** Session-26 (S26-P5): the reference's contacts page export
   * (bundle-extracted): a client-side quoted CSV with the 7-column set
   * Name,Email,Phone,Company,Position,Status,Source + the
   * `contacts_ISO-date.csv` filename + the `if (length === 0) return;`
   * guard. Replaces the /api/export wiring. */
  function exportContacts() {
    if (contacts.length === 0) return;
    const header = ["Name", "Email", "Phone", "Company", "Position", "Status", "Source"];
    const rows = contacts.map((c) => [
      c.name || "",
      c.email || "",
      c.phone || "",
      c.company || "",
      c.position || "",
      c.status || "",
      c.source || "",
    ]);
    downloadBlob(toQuotedCsv(header, rows), csvFilename("contacts"), "text/csv");
  }

  /** Session-26 (S26-P6): the reference's import flow (bundle-extracted):
   * the row filter requires name AND email; the messages are its exact
   * vocabulary ("Could not map any CSV column to the target schema" /
   * "No valid contacts found. Make sure your file has name and email
   * columns." / "Failed to import contacts. Please try again."); the
   * success message `Successfully imported N contact(s)` + the 2-second
   * auto-close with the refetch (its onImportComplete callback). */
  async function runImport() {
    if (!importFile) return;
    setImportBusy(true);
    try {
      // Session-38 (S38-P3): the tested parseCsv seam (RFC-4180 quotes —
      // BOM, CRLF, embedded commas, blank-row filtering all unit-pinned
      // in tests/csv.test.ts). The naive row.split(",") + quote-strip
      // replace silently CORRUPTED quoted cells with commas ("Last, First"
      // became name "Last" + a shifted email column).
      const rows = parseCsv(await importFile.text());
      const header = (rows[0] ?? []).map((h) => h.trim().toLowerCase());
      const idx = (name: string) => header.indexOf(name);
      if (idx("name") < 0 && idx("email") < 0) {
        setImportBusy(false);
        setImportResult({ success: false, message: "Could not map any CSV column to the target schema" });
        return;
      }
      const inputs: Record<string, unknown>[] = [];
      for (const cells of rows.slice(1)) {
        const name = cells[idx("name")] ?? "";
        const email = cells[idx("email")] ?? "";
        if (!name || !email) continue;
        inputs.push({
          name,
          email,
          phone: cells[idx("phone")] || undefined,
          company: cells[idx("company")] || undefined,
          position: cells[idx("position")] || undefined,
          source: cells[idx("source")] || "email",
        });
      }
      // Session-38 (S38-P3): the batch action — ONE slice refetch after
      // the loop (the per-row createContact refetch was O(N²) network).
      // Session-39 (S39-P2): the three-way branch — a bare `created`
      // count conflated "no valid rows" with "every POST failed" (the
      // all-failed case got the no-rows banner). The vocabulary is the
      // reference's own (S26-P6); only the branch conditions changed.
      const { created, attempted } = await importContacts(inputs);
      setImportBusy(false);
      if (created > 0) {
        setImportResult({
          success: true,
          message: `Successfully imported ${created} contact${created === 1 ? "" : "s"}`,
        });
        // The reference's setTimeout(…, 2e3): refetch, close, clear.
        window.setTimeout(async () => {
          await fetchContacts();
          resetImportDialog();
          setImportOpen(false);
        }, 2000);
      } else if (attempted > 0) {
        setImportResult({ success: false, message: "Failed to import contacts. Please try again." });
      } else {
        setImportResult({ success: false, message: "No valid contacts found. Make sure your file has name and email columns." });
      }
    } catch {
      setImportBusy(false);
      setImportResult({ success: false, message: "Failed to import contacts. Please try again." });
    }
  }

  function resetImportDialog() {
    setImportFile(null);
    setImportResult(null);
    setImportBusy(false);
  }

  return (
    // Session-16 (S16-P1): the full-height layout IS the page root — the
    // reference renders `main > flex h-[calc(100vh-64px)]` DIRECTLY (no
    // padding wrapper; ours sat inside the shell's blanket p-4 sm:p-8,
    // double-padding the box: 358px wide at 390 instead of the full
    // 390px, the table card 294px instead of 326px, and main scrolling
    // 37px instead of the 5px mirrored topbar quirk). The padding lives
    // inside the flex-1 overflow-auto > p-8 scroller. The dialogs below
    // are portals — layout-independent inside the flex row.
    // Session-11 (S11-P8): the reference's contacts page is the ONLY
    // full-height layout — a `flex h-[calc(100vh-64px)]` wrapper with a
    // `flex-1 overflow-auto` inner scroller and `p-8` content at ALL
    // widths (every other page ships p-4 sm:p-8 — contacts shows 32px
    // at 390px where the others show 16px). The calc's 64px is 5px
    // short of the real 69px topbar (a reference quirk mirrored
    // verbatim — main overflows 5px).
    <div className={CONTACTS_LAYOUT.fullHeight}>
      <div className={CONTACTS_LAYOUT.innerScroll}>
        <div className={CONTACTS_LAYOUT.content}>
      {/* Session-6: contacts is the flat header variant (text-3xl title,
          plain row, gap-3 actions); buttons are h-9 outline with hidden-sm
          labels on Scan Card/Import.
          Session-63 (G-4, the N-62e precision note completing the set):
          the header Export CSV's disabled binding reads
          `filtered.length === 0` while the export itself ships the FULL
          list (the runtime guard is contacts.length === 0) — a
          filter-to-empty state therefore disables an export whose
          artifact would be non-empty. Kept as shipped: the reference's
          own zero-data state makes the filtered-vs-full distinction
          unresolvable LIVE (indistinguishable mirrors). */}
      <PageHeader
        title="Contacts"
        subtitle="Manage your contacts"
        variant="contacts"
        actions={
          <>
            <Button
              variant="outline"
              disabled={filtered.length === 0}
              onClick={exportContacts}
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" onClick={() => setScanOpen(true)}>
              <Scan className="h-4 w-4" /> <span className="hidden sm:inline">Scan Card</span>
            </Button>
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Import</span>
            </Button>
            <Button
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> New Contact
            </Button>
          </>
        }
      />

      {/* Reference stat cards: gradient card, solid -500 icon chips, trend
          row on "New This Month" (DOM-verified). */}
      <div className={PAGE_KPI_GRIDS.contacts}>
        <IconStatCard
          label="Total Contacts"
          value={contacts.length}
          icon={<Users className="h-5 w-5" />}
          tone="solid"
          gradient
          color="#3b82f6"
        />
        <IconStatCard
          label="New This Month"
          value={contacts.filter((c) => new Date(c.createdAt) >= monthStart).length}
          trend={`+${contacts.filter((c) => new Date(c.createdAt) >= monthStart).length}`}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="solid"
          gradient
          color="#22c55e"
        />
        <IconStatCard
          label="Top Decision Makers"
          value={contacts.filter((c) => c.role === "Key Contact").length}
          icon={<Crown className="h-5 w-5" />}
          tone="solid"
          gradient
          color="#f59e0b"
        />
        <IconStatCard
          label="No Recent Activity"
          value={contacts.filter((c) => !c.lastActivityAt || new Date(c.lastActivityAt) < new Date(Date.now() - 30 * 86400000)).length}
          icon={<CircleAlert className="h-5 w-5" />}
          tone="solid"
          gradient
          color="#ef4444"
        />
      </div>

      {/* Session-6: the reference renders a white `rounded-lg shadow` card
          whose `p-4 border-b` toolbar holds a max-w-md search + an
          outline "Filters" button (live DOM). Session-28 (S28-P5): the
          Filters button now opens the reference's kke PANEL — a checkbox
          card rail in a `fixed right-0 top-16 bottom-0 w-80 … lg:static
          lg:shadow-none` wrapper — replacing our invented expandable
          select-toolbar. */}
      <div className={cn(TABLE_CARD.card, "mb-6")}>
        <div className={cn(TABLE_CARD.toolbar, "flex gap-3")}>
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..." className="pl-10" aria-label="Search contacts" />
          </div>
          <Button
            variant="outline"
            aria-expanded={showFilters}
            onClick={() => setShowFilters((v) => !v)}
          >
            <FilterPolygon className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Reference wrapper: rounded-xl + border + shadow-sm + overflow-hidden
          (session-5) — contacts is the one bordered table wrapper (mb-6
          spacing per session-6). Session-11 (S11-P9): the shadow-sm
          override is now EXPLICIT — the Card base's bare `shadow` rendered
          one step heavier than the reference's tiny shadow-sm here (the
          contacts table is the only entity table with the small shadow;
          accounts/leads keep the standard one). Session-12 (S12-P3): the
          reference's border here is EXPLICIT border-gray-200 — the strong
          token (--color-line-strong), not the #e5e5e5 platform default.
          `cn` is tailwind-merge, so both conflicts resolve correctly. */}
      <Card className="mb-6 overflow-hidden shadow-sm border-line-strong">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                {/* Reference: contacts headers are font-semibold text-gray-700
                    (bolder than other tables); Name is w-64 cursor-pointer with
                    NO sort icon (dead affordance mirrored); only Last Activity
                    is sortable (chevron-down default desc). */}
                <TableHead className="w-64 cursor-pointer font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Role</TableHead>
                <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <button type="button" className="inline-flex items-center gap-1" onClick={() => toggleSort("lastActivity")}>
                    Last Activity
                    {sortKey === "lastActivity" ? (
                      sortDir === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="h-4 w-4 text-subtle" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Engagement</TableHead>
                <TableHead className="font-semibold text-gray-700">Company</TableHead>
                <TableHead className="font-semibold text-gray-700">Source</TableHead>
                <TableHead className="w-10 font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={8} message="No contacts found" padding="py-12" />
              ) : (
                <>
                {filtered.map((c) => {
                  // Session-28 (S28-P3): the reference's row state — pe =
                  // the last activity is ≥30 days old (or never), ve = the
                  // Key priority (the amber row tint + the avatar overlay).
                  const lastT = c.lastActivityAt ? new Date(c.lastActivityAt).getTime() : null;
                  const pe = lastT == null || Date.now() - lastT >= 30 * 86400000;
                  const ve = c.priority === "Key";
                  const bars = engagementBarCount(c.engagementLevel);
                  return (
                  <TableRow
                    key={c.id}
                    className={cn(
                      "cursor-pointer transition-all border-b border-gray-100 hover:bg-blue-50/50 hover:shadow-sm",
                      ve && "bg-gradient-to-r from-amber-50/50 to-amber-50/30 border-l-4 border-l-amber-400",
                      pe && "opacity-70",
                    )}
                    onClick={() => setDetailContact(c)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()} className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md ring-2 ring-blue-100 overflow-hidden">
                            {c.photoUrl ? (
                              <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white font-semibold text-base">{c.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          {ve && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 flex items-center gap-2">{c.name}</p>
                          <p className="text-sm text-gray-600">{c.position || "No position"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select value={c.role ?? ""} onValueChange={(v) => void updateRole(c.id, v)}>
                        <SelectTrigger className="h-9 w-[140px] border-gray-300 hover:border-blue-400 transition-colors">
                          <SelectValue placeholder="Set role" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTACT_ROLES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Badge className={`${CONTACT_PRIORITY_META[c.priority] ?? CONTACT_PRIORITY_META.Standard} border font-medium px-3 py-1`}>
                        {c.priority || "Standard"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${pe ? "text-red-500" : "text-green-500"}`} />
                        <span className={`text-sm font-medium ${pe ? "text-red-600" : "text-gray-700"}`}>
                          {lastActivityCe(c.lastActivityAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {c.engagementLevel && (
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className={`w-2 h-6 rounded-full transition-all ${
                                i < bars
                                  ? ENGAGEMENT_BARS[c.engagementLevel as keyof typeof ENGAGEMENT_BARS]
                                  : ENGAGEMENT_BARS.empty
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{c.company || "-"}</p>
                        {c.companySize && <p className="text-xs text-gray-500 mt-0.5">{c.companySize}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {c.source && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                          {c.source}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {/* S54-P4: the reference's own inert affordances —
                            Call/Email/WhatsApp carry NO onClick in the
                            reference's bundle (ghost Buttons with children
                            only, bundle-verified session-54); mirrored,
                            with the aria-labels as our accessible
                            superset. */}
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-green-100 hover:text-green-700 transition-colors" aria-label={`Call ${c.name}`}>
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-purple-100 hover:text-purple-700 transition-colors" aria-label={`Email ${c.name}`}>
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-100 hover:text-blue-700 transition-colors" aria-label={`WhatsApp ${c.name}`}>
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Dropdown>
                          <DropdownTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100" aria-label={`Actions for ${c.name}`}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownContent>
                            <DropdownItem
                              onClick={() => {
                                setEditTarget(c);
                                setEditOpen(true);
                              }}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem onClick={() => setDetailContact(c)}>
                              Log Activity
                            </DropdownItem>
                            <DropdownItem destructive onClick={() => onDelete(c)}>
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownItem>
                          </DropdownContent>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Session-6 (S6-7): the reference ships an `lg:hidden mt-6 space-y-4`
          mobile card list below the (horizontally scrolling) table — phone
          users get compact cards instead of squashed columns. Session-28
          (S28-P3): rebuilt to the reference's card anatomy (the w-12 h-12
          avatar with photo/initial, name + POSITION (not email), the
          priority badge, the company/email/last-activity lines, the
          Call/Email outline row, and the card click → the slide-over). */}
      {/* Session-68 (N-68d): wired to CONTACTS_LAYOUT.mobileCards (was a
          reordered hand-inline of the same computed classes). */}
      <div className={CONTACTS_LAYOUT.mobileCards}>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No contacts found</p>
        ) : (
          filtered.map((c) => {
            const ve = c.priority === "Key";
            return (
            <Card key={c.id} className="cursor-pointer" onClick={() => setDetailContact(c)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center overflow-hidden">
                      {c.photoUrl ? (
                        <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-semibold text-lg">{c.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-gray-600">{c.position}</p>
                    </div>
                  </div>
                  <Badge className={`${CONTACT_PRIORITY_META[c.priority] ?? CONTACT_PRIORITY_META.Standard} border font-medium`}>
                    {c.priority || "Standard"}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">{c.company}</p>
                  <p className="text-gray-600">{c.email}</p>
                  {c.lastActivityAt && (
                    <p className="text-gray-500">Last activity: {lastActivityCe(c.lastActivityAt)}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-1" />Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />Email
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })
        )}
      </div>

      </div>
        </div>

      {/* Scan card — Session-28 (S28-P5): the reference's NAe contract
          (bundle-extracted): the dashed border-2 gray-300 dropzone with the
          w-12 h-12 scan glyph, "Upload a photo or image of the business
          card", a VISIBLE file input (max-w-xs mx-auto — not our hidden
          dropzone-clicker), the green "Selected: {name}" line, and the
          Cancel / Scan Card footer with the Scanning spinner state. The
          base44 ExtractDataFromUploadedFile AI round-trip is replaced by
          the documented local divergence: a chosen image opens the create
          dialog (the reference prefills from the extraction; ours starts
          the manual form — same treatment as the s26 import). */}
      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Business Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Scan className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">Upload a photo or image of the business card</p>
              <input
                type="file"
                accept="image/*"
                className="max-w-xs mx-auto"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setScanFile(f);
                }}
              />
              {scanFile && (
                <p className="text-sm text-green-600 mt-2">Selected: {scanFile.name}</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setScanOpen(false)}>Cancel</Button>
              <Button
                disabled={!scanFile || scanBusy}
                onClick={() => {
                  setScanBusy(true);
                  // The local-parse divergence: the reference's AI
                  // extraction prefills the create dialog; ours opens it.
                  window.setTimeout(() => {
                    setScanBusy(false);
                    setScanOpen(false);
                    setDialogOpen(true);
                  }, 600);
                }}
              >
                <Scan className="w-4 h-4 mr-2" />
                {scanBusy ? "Scanning..." : "Scan Card"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import — Session-26 (S26-P6): the reference's contract, bundle +
          live extracted (sm:max-w-md, the Select File label, the w-32
          dashed dropzone with the upload glyph, the chosen-file blue box,
          the Required/Optional columns box, the Cancel/Close + Import
          footer, the green/red result box, and the 2-second auto-close
          after a success). NO template link — the reference ships none. */}
      <Dialog
        open={importOpen}
        onOpenChange={(o) => {
          setImportOpen(o);
          if (!o) resetImportDialog();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>Upload a CSV or Excel file with contact information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {importResult ? (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  importResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                {importResult.success ? (
                  <CircleCheckBig className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <CircleAlert className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <p className={`text-sm font-medium ${importResult.success ? "text-green-900" : "text-red-900"}`}>
                  {importResult.message}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Select File</Label>
                  <div className="flex flex-col gap-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-sm text-gray-600">{importFile ? importFile.name : "Click to upload CSV or Excel"}</p>
                        <p className="text-xs text-gray-400">CSV, XLS, XLSX</p>
                      </div>
                      <input
                        type="file"
                        accept=".csv,.xls,.xlsx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImportFile(file);
                            setImportResult(null);
                          }
                        }}
                      />
                    </label>
                    {importFile && (
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-900 flex-1">{importFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                  <p className="font-semibold">Required columns:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>name</li>
                    <li>email</li>
                  </ul>
                  <p className="font-semibold mt-2">Optional columns:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>phone, company, position, source</li>
                  </ul>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setImportOpen(false);
                resetImportDialog();
              }}
            >
              {importResult?.success ? "Close" : "Cancel"}
            </Button>
            {!importResult && (
              <Button onClick={() => void runImport()} disabled={!importFile || importBusy}>
                {importBusy ? "Processing..." : "Import"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session-28 (S28-P5): the reference's kke FILTER PANEL — the
          `fixed right-0 top-16 bottom-0 w-80 bg-white shadow-2xl z-40
          lg:static lg:shadow-none` wrapper with the checkbox-card rail:
          sticky Filters/Clear All header, then the Role / Priority /
          Activity Status / Company Size / Source card groups. */}
      {showFilters && (
        <div className="fixed right-0 top-16 bottom-0 w-80 bg-white shadow-2xl z-40 lg:static lg:shadow-none">
          <div className="w-full lg:w-80 bg-white border-l h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <div className="p-4 space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-sm">Role</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {CONTACT_ROLES.map((r) => (
                    <div key={r} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`role-${r}`}
                        checked={roles.includes(r)}
                        onChange={() => toggleFilter("roles", r)}
                      />
                      <label htmlFor={`role-${r}`} className="text-sm font-normal cursor-pointer">{r}</label>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Priority</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {["Key", "Standard", "At Risk"].map((p) => (
                    <div key={p} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`priority-${p}`}
                        checked={priorities.includes(p)}
                        onChange={() => toggleFilter("priorities", p)}
                      />
                      <label htmlFor={`priority-${p}`} className="text-sm font-normal cursor-pointer">{p}</label>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Activity Status</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="no-activity"
                      checked={noRecentActivity}
                      onChange={() => setNoRecentActivity(!noRecentActivity)}
                    />
                    <label htmlFor="no-activity" className="text-sm font-normal cursor-pointer">
                      No Recent Activity (30+ days)
                    </label>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Company Size</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {COMPANY_SIZES.map((s) => (
                    <div key={s} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`size-${s}`}
                        checked={companySizes.includes(s)}
                        onChange={() => toggleFilter("companySizes", s)}
                      />
                      <label htmlFor={`size-${s}`} className="text-sm font-normal cursor-pointer">{s}</label>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Source</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {CONTACT_SOURCE_OPTIONS.map((o) => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`source-${o.value}`}
                        checked={sourcesF.includes(o.value)}
                        onChange={() => toggleFilter("sources", o.value)}
                      />
                      <label htmlFor={`source-${o.value}`} className="text-sm font-normal cursor-pointer">{o.value}</label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Session-28 (S28-P2): the W7 Edit Contact dialog — a SEPARATE
          max-w-2xl dialog (NOT the create form), wired to the ⋮ Edit item. */}
      <EntityEditDialog
        key={editTarget?.id ?? "none"}
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditTarget(null);
        }}
        title="Edit Contact"
        detailsTitle="Contact Details"
        fields={CONTACT_EDIT_FIELDS}
        initial={{
          name: editTarget?.name ?? "",
          email: editTarget?.email ?? "",
          phone: editTarget?.phone ?? "",
          company: editTarget?.company ?? "",
          position: editTarget?.position ?? "",
          status: editTarget?.status ?? "active",
          source: editTarget?.source ?? "email",
        }}
        onSubmit={async (form) => {
          if (!editTarget) return;
          const res = await updateContact(editTarget.id, {
            name: form.name,
            email: form.email || null,
            phone: form.phone || null,
            company: form.company || null,
            position: form.position || null,
            status: form.status,
            source: (form.source || "email").toLowerCase(),
          });
          if (res.ok) {
            setEditOpen(false);
            setEditTarget(null);
          } else {
            // Session-46 (S46-P1): a failed PUT used to strand the dialog
            // open with a dead-feeling Save.
            toast.error("Could not save contact", res.error);
          }
        }}
      />

      {/* Session-28 (S28-P4): the Pke contact-detail slide-over (the row
          click + the mobile card click). */}
      <ContactDetailPanel
        contact={detailContact}
        activities={activities}
        opportunities={opportunities}
        onClose={() => setDetailContact(null)}
      />

      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

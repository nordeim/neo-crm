"use client";

import { downloadBlob } from "@/lib/download";
import * as React from "react";
import {
  Award,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleCheckBig,
  Download,
  FileText,
  MoreHorizontal,
  Pencil,
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
} from "lucide-react";
import { FilterPolygon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
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
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import { IconStatCard, PageHeader, TableEmptyRow } from "@/components/shared/page-parts";
import { CONTACTS_LAYOUT, FILTER_RAIL, PAGE_KPI_GRIDS, TABLE_CARD } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { ContactDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { PRIORITY_META } from "@/lib/constants";
import { timeAgo } from "@/lib/format";
import { csvFilename } from "@/lib/csv";
import { toQuotedCsv } from "@/lib/entity-export";
import type { Contact } from "@/types";

type SortKey = "name" | "lastActivity";
type SortDir = "asc" | "desc";

export default function ContactsPage() {
  const { contacts, users, settings, hydrated, deleteContact, fetchContacts, createContact } = useCrmStore();
  const [search, setSearch] = React.useState("");
  const [priority, setPriority] = React.useState("all");
  const [ownerId, setOwnerId] = React.useState("all");
  const [source, setSource] = React.useState("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("lastActivity");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [showFilters, setShowFilters] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Contact | null>(null);
  const [scanOpen, setScanOpen] = React.useState(false);
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
      if (priority !== "all" && c.priority !== priority) return false;
      if (ownerId !== "all" && c.ownerId !== ownerId) return false;
      if (source !== "all" && c.source !== source) return false;
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
  }, [contacts, search, priority, ownerId, source, sortKey, sortDir]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const sources = settings?.contactSources ?? ["Email", "Phone", "Website", "Referral"];

  async function onDelete(contact: Contact) {
    if (!window.confirm(`Delete "${contact.name}"? This cannot be undone.`)) return;
    await deleteContact(contact.id);
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
      const text = await importFile.text();
      const rows = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((r) => r.trim().length > 0);
      const header = rows[0]?.split(",").map((h) => h.trim().toLowerCase()) ?? [];
      const idx = (name: string) => header.indexOf(name);
      if (idx("name") < 0 && idx("email") < 0) {
        setImportBusy(false);
        setImportResult({ success: false, message: "Could not map any CSV column to the target schema" });
        return;
      }
      let created = 0;
      for (const row of rows.slice(1)) {
        const cells = row.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        const name = cells[idx("name")] ?? "";
        const email = cells[idx("email")] ?? "";
        if (!name || !email) continue;
        const res = await createContact({
          name,
          email,
          phone: cells[idx("phone")] || undefined,
          company: cells[idx("company")] || undefined,
          position: cells[idx("position")] || undefined,
          source: cells[idx("source")] || "email",
        });
        if (res.ok) created += 1;
      }
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
          labels on Scan Card/Import; Export CSV is disabled at zero data. */}
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
                setEditing(null);
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
          value={contacts.filter((c) => c.priority === "hot").length}
          icon={<Award className="h-5 w-5" />}
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
          outline "Filters" button (live DOM; the live body below the
          border-b renders nothing at zero data). We mirror the toolbar
          exactly and keep our working filter groups in the expandable
          body (functional superset, documented). */}
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
        {showFilters && (
          <div className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 sm:max-w-[180px]">
                <Label className={FILTER_RAIL.groupLabelSelect}>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 sm:max-w-[180px]">
                <Label className={FILTER_RAIL.groupLabelSelect}>Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {sources.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 sm:max-w-[180px]">
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
            </div>
          </div>
        )}
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
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={c.name} color="#2563eb" size="md" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{c.name}</p>
                          <p className="truncate text-xs text-muted">{c.email ?? "—"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted">{c.position ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={PRIORITY_META[c.priority]?.badge}>
                        {PRIORITY_META[c.priority]?.label ?? c.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted">{timeAgo(c.lastActivityAt ?? c.createdAt)}</TableCell>
                    <TableCell className="text-muted">{c.source ?? "—"}</TableCell>
                    <TableCell className="text-muted">{c.company ?? c.account?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted">{c.source ?? "—"}</TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger asChild>
                          <Button variant="ghost" size="iconSm" aria-label={`Actions for ${c.name}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownContent>
                          <DropdownItem
                            onClick={() => {
                              setEditing(c);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-muted" /> Edit
                          </DropdownItem>
                          <DropdownSeparator />
                          <DropdownItem destructive onClick={() => onDelete(c)}>
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

      {/* Session-6 (S6-7): the reference ships an `lg:hidden mt-6 space-y-4`
          mobile card list below the (horizontally scrolling) table — phone
          users get compact cards instead of squashed columns. Empty at zero
          data on the reference; here it mirrors `filtered` exactly. */}
      <div className="mt-6 space-y-4 lg:hidden">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No contacts found</p>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="rounded-xl border border-line bg-surface p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={c.name} color="#2563eb" size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{c.name}</p>
                    <p className="truncate text-xs text-muted">{c.email ?? "—"}</p>
                  </div>
                </div>
                <Badge variant="outline" className={PRIORITY_META[c.priority]?.badge}>
                  {PRIORITY_META[c.priority]?.label ?? c.priority}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span>{c.position ?? "—"}</span>
                <span>{c.company ?? c.account?.name ?? "—"}</span>
                <span>{c.source ?? "—"}</span>
                <span className="sm:hidden">{timeAgo(c.lastActivityAt ?? c.createdAt)}</span>
              </div>
              <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => { setEditing(c); setDialogOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      </div>
        </div>

      {/* Scan card — portals render outside the full-height wrapper. */}
      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Business Card</DialogTitle>
            <DialogDescription>
              Scan a business card to extract contact details instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-dashed border-line bg-line-soft px-6 py-10 text-center">
            <Scan className="mx-auto h-8 w-8 text-subtle" />
            <p className="mt-3 text-sm font-medium text-foreground">Camera not available</p>
            <p className="mt-1 text-xs text-muted">
              Card scanning requires a device camera. On desktop, use Import (CSV) or New Contact instead.
            </p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setScanOpen(false)}>Close</Button>
            <Button onClick={() => { setScanOpen(false); setEditing(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Contact
            </Button>
          </DialogFooter>
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

      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} contact={editing} />
    </div>
  );
}

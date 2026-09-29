"use client";

import { downloadFile } from "@/lib/download";
import * as React from "react";
import {
  Award,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Download,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  ScanLine,
  Search,
  Trash2,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox, Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import { IconStatCard, PageHeader } from "@/components/shared/page-parts";
import { ContactDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { PRIORITY_META } from "@/lib/constants";
import { timeAgo } from "@/lib/format";
import { toast } from "@/components/ui/toast";
import type { Contact } from "@/types";

type SortKey = "name" | "lastActivity";
type SortDir = "asc" | "desc";

export default function ContactsPage() {
  const { contacts, users, settings, loadingFlags, hydrated, deleteContact, fetchContacts, createContact } = useCrmStore();
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

  async function handleImport(file: File) {
    const text = await file.text();
    const rows = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((r) => r.trim().length > 0);
    if (rows.length < 2) {
      toast.error("Import failed", "The CSV needs a header row and at least one contact.");
      return;
    }
    const header = rows[0].split(",").map((h) => h.trim().toLowerCase());
    const idx = (name: string) => header.indexOf(name);
    let created = 0;
    for (const row of rows.slice(1)) {
      const cells = row.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const name = cells[idx("name")] ?? "";
      if (!name) continue;
      const res = await createContact({
        name,
        email: cells[idx("email")] || undefined,
        phone: cells[idx("phone")] || undefined,
        company: cells[idx("company")] || undefined,
        position: cells[idx("position")] || undefined,
        source: cells[idx("source")] || undefined,
      });
      if (res.ok) created += 1;
    }
    setImportOpen(false);
    toast.success("Import complete", `${created} contact${created === 1 ? "" : "s"} imported.`);
  }

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle="Manage your contacts"
        actions={
          <>
            <Button
              variant="secondary"
              disabled={filtered.length === 0}
              onClick={() => downloadFile("/api/export?type=contacts&download=1")}
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="secondary" onClick={() => setScanOpen(true)}>
              <ScanLine className="h-4 w-4" /> Scan Card
            </Button>
            <Button variant="secondary" onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4" /> Import
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

      {/* Reference stat cards: solid colored icon chips on the right. */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <IconStatCard
          label="Total Contacts"
          value={contacts.length}
          icon={<Users className="h-5 w-5" />}
          tone="solid"
          color="#3b82f6"
        />
        <IconStatCard
          label="New This Month"
          value={contacts.filter((c) => new Date(c.createdAt) >= monthStart).length}
          subValue={<span className="font-medium text-success">+{contacts.filter((c) => new Date(c.createdAt) >= monthStart).length}</span>}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="solid"
          color="#10b981"
        />
        <IconStatCard
          label="Top Decision Makers"
          value={contacts.filter((c) => c.priority === "hot").length}
          icon={<Award className="h-5 w-5" />}
          tone="solid"
          color="#f59e0b"
        />
        <IconStatCard
          label="No Recent Activity"
          value={contacts.filter((c) => !c.lastActivityAt || new Date(c.lastActivityAt) < new Date(Date.now() - 30 * 86400000)).length}
          icon={<CircleAlert className="h-5 w-5" />}
          tone="solid"
          color="#ef4444"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..." className="pl-9" aria-label="Search contacts" />
        </div>
        <Button variant="secondary" size="sm" className="h-9" aria-expanded={showFilters} onClick={() => setShowFilters((v) => !v)}>
          <Filter className="h-3.5 w-3.5" /> Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="mt-3">
          <CardContent className="flex flex-wrap items-end gap-4 py-4">
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
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
          </CardContent>
        </Card>
      )}

      <Card className="mt-4">
        <CardContent className="px-0 py-0">
          {loadingFlags.contacts && contacts.length === 0 ? (
            <div className="flex flex-col gap-2 p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Users className="h-5 w-5" />}
              title="No contacts found"
              description="Try adjusting your search or filters"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button type="button" className="inline-flex items-center gap-1 tracking-wide" onClick={() => toggleSort("name")}>
                      Name
                      {sortKey === "name" ? (
                        sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>
                    <button type="button" className="inline-flex items-center gap-1 tracking-wide" onClick={() => toggleSort("lastActivity")}>
                      Last Activity
                      {sortKey === "lastActivity" ? (
                        sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-10">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Scan card */}
      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Business Card</DialogTitle>
            <DialogDescription>
              Scan a business card to extract contact details instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-dashed border-line bg-line-soft px-6 py-10 text-center">
            <ScanLine className="mx-auto h-8 w-8 text-subtle" />
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

      {/* Import */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Upload a CSV with the columns: name, email, phone, company, position, source.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <a
              href="/api/export?type=contacts"
              download="contacts-template.csv"
              className="text-xs font-medium text-primary hover:underline"
            >
              Download the CSV template
            </a>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-line-soft px-6 py-10 text-center transition-colors hover:border-primary/50">
              <Upload className="h-6 w-6 text-subtle" />
              <span className="text-sm font-medium text-foreground">Choose a CSV file</span>
              <span className="text-xs text-muted">Click to browse</span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImport(file);
                }}
              />
            </label>
          </div>
        </DialogContent>
      </Dialog>

      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} contact={editing} />
    </div>
  );
}

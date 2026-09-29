"use client";

// Entity create/edit dialogs shared by the Dashboard quick-add and the
// Accounts/Contacts/Leads/Calendar/Activities pages.
//
// Pattern (React 19 lint-clean): each dialog shell mounts its form only while
// open, keyed by entity id — so the form initializes ALL state via useState
// initializers at mount. No setState-inside-effects, ever.

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useCrmStore } from "@/stores/crm-store";
import { toLocalInputValue } from "@/lib/format";
import {
  ACCOUNT_STATUSES,
  ACCOUNT_STATUS_META,
  ACCOUNT_TIERS,
  ACTIVITY_TYPES,
  ACTIVITY_TYPE_META,
  CONTACT_PRIORITIES,
  EVENT_TYPES,
  EVENT_TYPE_META,
  LEAD_STAGES,
  STAGE_META,
} from "@/lib/constants";
import type { Account, Activity, Contact, CrmEvent, Lead } from "@/types";

// ---------------------------------------------------------------------------
// Account dialog
// ---------------------------------------------------------------------------

export function AccountDialog({
  open,
  onOpenChange,
  account,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
  onSaved?: (account: Account) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{account ? "Edit Account" : "Create New Account"}</DialogTitle>
          <DialogDescription>
            {account ? "Update the account details below." : "Add a company to your CRM workspace."}
          </DialogDescription>
        </DialogHeader>
        {open && (
          <AccountForm key={account?.id ?? "new"} account={account ?? null} onOpenChange={onOpenChange} onSaved={onSaved} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AccountForm({
  account,
  onOpenChange,
  onSaved,
}: {
  account: Account | null;
  onOpenChange: (open: boolean) => void;
  onSaved?: (account: Account) => void;
}) {
  const { createAccount, updateAccount, settings, users } = useCrmStore();
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    name: account?.name ?? "",
    industry: account?.industry ?? "",
    email: account?.email ?? "",
    phone: account?.phone ?? "",
    website: account?.website ?? "",
    annualRevenue: account?.annualRevenue != null ? String(account.annualRevenue) : "",
    employees: account?.employees != null ? String(account.employees) : "",
    tier: account?.tier ?? settings?.defaultTier ?? "B",
    status: account?.status ?? "active",
    isKey: account?.isKey ?? false,
    ownerId: account?.ownerId ?? "",
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Account name is required");
      return;
    }
    setPending(true);
    const payload = {
      name: form.name,
      industry: form.industry || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      website: form.website || undefined,
      annualRevenue: form.annualRevenue ? Number(form.annualRevenue) : undefined,
      employees: form.employees ? Number(form.employees) : undefined,
      tier: form.tier,
      status: form.status,
      isKey: form.isKey,
      ownerId: form.ownerId || undefined,
    };
    const res = account ? await updateAccount(account.id, payload) : await createAccount(payload);
    setPending(false);
    if (res.ok) {
      toast.success(account ? "Account updated" : "Account created", form.name);
      onSaved?.(res.data);
      onOpenChange(false);
    } else {
      toast.error("Could not save account", res.error);
    }
  }

  const industries = settings?.industries ?? ["Technology", "Manufacturing", "Retail", "Finance"];

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="acc-name">Account Name *</Label>
        <Input id="acc-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Acme Industries" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="acc-industry">Industry</Label>
          <Input id="acc-industry" list="industry-options" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Technology" />
          <datalist id="industry-options">
            {industries.map((i) => (
              <option key={i} value={i} />
            ))}
          </datalist>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="acc-website">Website</Label>
          <Input id="acc-website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://…" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="acc-email">Email</Label>
          <Input id="acc-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="hello@acme.com" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="acc-phone">Phone</Label>
          <Input id="acc-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+971 50 123 4567" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="acc-revenue">Annual Revenue</Label>
          <Input id="acc-revenue" type="number" min={0} value={form.annualRevenue} onChange={(e) => setForm({ ...form, annualRevenue: e.target.value })} placeholder="2500000" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="acc-employees">Employees</Label>
          <Input id="acc-employees" type="number" min={0} value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} placeholder="120" />
        </div>
        <div className="grid gap-1.5">
          <Label>Tier</Label>
          <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACCOUNT_TIERS.map((t) => (
                <SelectItem key={t} value={t}>Tier {t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACCOUNT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{ACCOUNT_STATUS_META[s].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Owner</Label>
          <Select value={form.ownerId || "unassigned"} onValueChange={(v) => setForm({ ...form, ownerId: v === "unassigned" ? "" : v })}>
            <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.isKey}
            onChange={(e) => setForm({ ...form, isKey: e.target.checked })}
            className="h-4 w-4 appearance-none rounded border border-gray-300 checked:border-primary checked:bg-primary"
          />
          Key account
        </label>
      </div>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : account ? "Save Changes" : "Create Account"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Contact dialog
// ---------------------------------------------------------------------------

export function ContactDialog({
  open,
  onOpenChange,
  contact,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact | null;
  onSaved?: (contact: Contact) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact" : "Create New Contact"}</DialogTitle>
          <DialogDescription>Add a person to your CRM workspace.</DialogDescription>
        </DialogHeader>
        {open && (
          <ContactForm key={contact?.id ?? "new"} contact={contact ?? null} onOpenChange={onOpenChange} onSaved={onSaved} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ContactForm({
  contact,
  onOpenChange,
  onSaved,
}: {
  contact: Contact | null;
  onOpenChange: (open: boolean) => void;
  onSaved?: (contact: Contact) => void;
}) {
  const { createContact, updateContact, accounts, settings } = useCrmStore();
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    name: contact?.name ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    company: contact?.company ?? "",
    position: contact?.position ?? "",
    source: contact?.source ?? "Email",
    priority: contact?.priority ?? "warm",
    accountId: contact?.accountId ?? "",
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setPending(true);
    const res = contact
      ? await updateContact(contact.id, { ...form, accountId: form.accountId || undefined })
      : await createContact({ ...form, accountId: form.accountId || undefined });
    setPending(false);
    if (res.ok) {
      toast.success(contact ? "Contact updated" : "Contact created", form.name);
      onSaved?.(res.data);
      onOpenChange(false);
    } else {
      toast.error("Could not save contact", res.error);
    }
  }

  const sources = settings?.contactSources ?? ["Email", "Phone", "Website", "Referral"];

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="ct-name">Name *</Label>
        <Input id="ct-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Jane Cooper" />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contact details</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="ct-email">Email</Label>
          <Input id="ct-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ct-phone">Phone</Label>
          <Input id="ct-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+971 50 123 4567" />
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Professional details</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="ct-company">Company</Label>
          <Input
            id="ct-company"
            list="account-options"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Company name"
          />
          <datalist id="account-options">
            {accounts.map((a) => (
              <option key={a.id} value={a.name} />
            ))}
          </datalist>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ct-position">Position</Label>
          <Input id="ct-position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Sales Director" />
        </div>
        <div className="grid gap-1.5">
          <Label>Source</Label>
          <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {sources.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Priority</Label>
          <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CONTACT_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : contact ? "Save Changes" : "Create Contact"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Lead dialog
// ---------------------------------------------------------------------------

export function LeadDialog({
  open,
  onOpenChange,
  lead,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSaved?: (lead: Lead) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lead ? "Edit Lead" : "Create New Lead"}</DialogTitle>
          <DialogDescription>Track a new sales opportunity.</DialogDescription>
        </DialogHeader>
        {open && <LeadForm key={lead?.id ?? "new"} lead={lead ?? null} onOpenChange={onOpenChange} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  );
}

function LeadForm({
  lead,
  onOpenChange,
  onSaved,
}: {
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
  onSaved?: (lead: Lead) => void;
}) {
  const { createLead, updateLead, settings } = useCrmStore();
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    company: lead?.company ?? "",
    value: lead?.value != null && lead.value > 0 ? String(lead.value) : "",
    stage: lead?.stage ?? settings?.defaultLeadStage ?? "new",
    source: lead?.source ?? "Email",
    expectedCloseDate: toLocalInputValue(lead?.expectedCloseDate).slice(0, 10),
    nextFollowUp: toLocalInputValue(lead?.nextFollowUp).slice(0, 10),
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Lead name is required");
      return;
    }
    setPending(true);
    const payload = {
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      company: form.company || undefined,
      value: form.value ? Number(form.value) : 0,
      stage: form.stage,
      source: form.source || undefined,
      expectedCloseDate: form.expectedCloseDate ? new Date(form.expectedCloseDate).toISOString() : undefined,
      nextFollowUp: form.nextFollowUp ? new Date(form.nextFollowUp).toISOString() : undefined,
    };
    const res = lead ? await updateLead(lead.id, payload) : await createLead(payload);
    setPending(false);
    if (res.ok) {
      toast.success(lead ? "Lead updated" : "Lead created", form.name);
      onSaved?.(res.data);
      onOpenChange(false);
    } else {
      toast.error("Could not save lead", res.error);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="ld-name">Name *</Label>
        <Input id="ld-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Acme — 50 licenses" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="ld-email">Email</Label>
          <Input id="ld-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="buyer@acme.com" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ld-phone">Phone</Label>
          <Input id="ld-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+971 50 123 4567" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ld-company">Company</Label>
          <Input id="ld-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Industries" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ld-value">Estimated Value</Label>
          <Input id="ld-value" type="number" min={0} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="25000" />
        </div>
        <div className="grid gap-1.5">
          <Label>Stage</Label>
          <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LEAD_STAGES.map((s) => (
                <SelectItem key={s} value={s}>{STAGE_META[s].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Source</Label>
          <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(settings?.contactSources ?? ["Email", "Phone", "Website", "Referral"]).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ld-close">Expected Close</Label>
          <Input id="ld-close" type="date" value={form.expectedCloseDate} onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ld-follow">Next Follow-up</Label>
          <Input id="ld-follow" type="date" value={form.nextFollowUp} onChange={(e) => setForm({ ...form, nextFollowUp: e.target.value })} />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : lead ? "Save Changes" : "Create Lead"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Event dialog
// ---------------------------------------------------------------------------

export function EventDialog({
  open,
  onOpenChange,
  event,
  defaultStart,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CrmEvent | null;
  defaultStart?: Date | null;
  onSaved?: (event: CrmEvent) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "New Event"}</DialogTitle>
          <DialogDescription>Schedule a meeting, call or appointment.</DialogDescription>
        </DialogHeader>
        {open && (
          <EventForm
            key={event?.id ?? String(defaultStart?.getTime() ?? "new")}
            event={event ?? null}
            defaultStart={defaultStart ?? null}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EventForm({
  event,
  defaultStart,
  onOpenChange,
  onSaved,
}: {
  event: CrmEvent | null;
  defaultStart: Date | null;
  onOpenChange: (open: boolean) => void;
  onSaved?: (event: CrmEvent) => void;
}) {
  const { createEvent, updateEvent } = useCrmStore();
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    title: event?.title ?? "",
    description: event?.description ?? "",
    type: event?.type ?? "meeting",
    status: event?.status ?? "scheduled",
    startAt: event ? toLocalInputValue(event.startAt) : toLocalInputValue(defaultStart ?? new Date()),
    endAt: event?.endAt ? toLocalInputValue(event.endAt) : "",
    location: event?.location ?? "",
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Event title is required");
      return;
    }
    if (!form.startAt) {
      toast.error("Start date and time are required");
      return;
    }
    setPending(true);
    const payload = {
      title: form.title,
      description: form.description || undefined,
      type: form.type,
      status: form.status,
      startAt: new Date(form.startAt).toISOString(),
      endAt: form.endAt ? new Date(form.endAt).toISOString() : undefined,
      location: form.location || undefined,
    };
    const res = event ? await updateEvent(event.id, payload) : await createEvent(payload);
    setPending(false);
    if (res.ok) {
      toast.success(event ? "Event updated" : "Event created", form.title);
      onSaved?.(res.data);
      onOpenChange(false);
    } else {
      toast.error("Could not save event", res.error);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="ev-title">Title *</Label>
        <Input id="ev-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Quarterly review — Acme" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="ev-desc">Description</Label>
        <Textarea id="ev-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Agenda, prep notes…" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{EVENT_TYPE_META[t].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["scheduled", "completed", "cancelled"].map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s[0].toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ev-start">Starts *</Label>
          <Input id="ev-start" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ev-end">Ends</Label>
          <Input id="ev-end" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="ev-loc">Location</Label>
        <Input id="ev-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Enter location or meeting link" />
      </div>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : event ? "Save Changes" : "Create Event"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Activity dialog
// ---------------------------------------------------------------------------

export function ActivityDialog({
  open,
  onOpenChange,
  defaultType = "call",
  activity,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: string;
  activity?: Activity | null;
  onSaved?: (activity: Activity) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activity ? "Edit Activity" : "Log Activity"}</DialogTitle>
          <DialogDescription>Record a call, email, meeting or task.</DialogDescription>
        </DialogHeader>
        {open && (
          <ActivityForm
            key={activity?.id ?? `${defaultType}-${Date.now()}`}
            activity={activity ?? null}
            defaultType={defaultType}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ActivityForm({
  activity,
  defaultType,
  onOpenChange,
  onSaved,
}: {
  activity: Activity | null;
  defaultType: string;
  onOpenChange: (open: boolean) => void;
  onSaved?: (activity: Activity) => void;
}) {
  const { createActivity, updateActivity, contacts } = useCrmStore();
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    type: activity?.type ?? defaultType,
    subject: activity?.subject ?? "",
    notes: activity?.notes ?? "",
    dueAt: activity?.dueAt ? toLocalInputValue(activity.dueAt) : toLocalInputValue(new Date()),
    status: activity?.status ?? "scheduled",
    priority: activity?.priority ?? "normal",
    contactId: activity?.contactId ?? "",
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject.trim()) {
      toast.error("Please describe the activity");
      return;
    }
    if (!form.dueAt) {
      toast.error("Date and time are required");
      return;
    }
    setPending(true);
    const payload = {
      type: form.type,
      subject: form.subject,
      notes: form.notes || undefined,
      dueAt: new Date(form.dueAt).toISOString(),
      status: form.status,
      priority: form.priority,
      contactId: form.contactId || undefined,
    };
    const res = activity ? await updateActivity(activity.id, payload) : await createActivity(payload);
    setPending(false);
    if (res.ok) {
      toast.success(activity ? "Activity updated" : "Activity logged", form.subject);
      onSaved?.(res.data);
      onOpenChange(false);
    } else {
      toast.error("Could not save activity", res.error);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{ACTIVITY_TYPE_META[t].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ac-due">Date &amp; time *</Label>
          <Input id="ac-due" type="datetime-local" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} required />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="ac-subject">Details *</Label>
        <Textarea id="ac-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="Enter activity details..." />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Related to</Label>
          <Select value={form.contactId || "none"} onValueChange={(v) => setForm({ ...form, contactId: v === "none" ? "" : v })}>
            <SelectTrigger><SelectValue placeholder="Select contact" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No contact</SelectItem>
              {contacts.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : activity ? "Save Changes" : "Log Activity"}
        </Button>
      </DialogFooter>
    </form>
  );
}

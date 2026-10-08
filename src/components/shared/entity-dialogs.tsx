"use client";

// Entity create/edit dialogs shared by the Dashboard quick-add and the
// Accounts/Contacts/Leads/Calendar/Activities pages.
//
// Pattern (React 19 lint-clean), session-71 re-timing: every shell
// mounts its form UNCONDITIONALLY, keyed by an open-epoch counter that
// bumps ONLY on false→true transitions (the adjust-during-render
// `useOpenEpoch` below — the AppShell close-on-route-change idiom). At
// open the epoch re-keys the form → fresh state per open (the s46 F-46f
// contract; the initializer re-reads the live props, including the
// resolved settings slice). While open the epoch is stable → store
// re-renders are inert (the s71 M-71a1 Date.now() wipe retired). At
// close the form stays mounted → the Radix root plays its pinned
// `data-[state=closed]` exit chrome over the FULL form body — the
// reference's own geometry (its W7/wce/Mke and create dialogs render
// unconditionally, no key — bundle-decoded; its own prop→state sync
// rides setState-in-effect, an ERROR under our lint). No
// setState-inside-effects, ever.

import * as React from "react";
import { Camera, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogFooterWide,
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
  ACCOUNT_DIALOG,
  ACTIVITY_DIALOG,
  CONTACT_AVATAR,
  CONTACT_DIALOG,
  DIALOG_CONTENT,
  DIALOG_FIELDS_WRAPPER,
  DIALOG_GROUP,
  DIALOG_SUBMIT,
  EVENT_DIALOG,
  LEAD_DIALOG,
} from "@/lib/page-layout";
import {
  ACCOUNT_STATUSES,
  ACCOUNT_STATUS_META,
  // Session-76 (L-76c6): the dialog's type select rides the FIVE-option
  // list (the full ACTIVITY_TYPES array stays on the rail/KPI consumers).
  ACTIVITY_DIALOG_TYPES,
  ACTIVITY_TYPE_META,
  CONTACT_SOURCE_OPTIONS,
  EVENT_TYPES,
  EVENT_TYPE_META,
  // Session-29 (S29-P4): the RAW source values with capitalized labels
  // (value "call", label "Call") — the s28 contact-source precedent;
  // the Tke default is source:"email" (bundle-extracted).
  LEAD_SOURCE_OPTIONS,
  STAGE_META,
} from "@/lib/constants";
import type { Account, Activity, Contact, CrmEvent, Lead } from "@/types";

// Session-5 reference option lists (DOM-extracted from the live dialogs):
// Session-15 (S15-P4/P14): the reference's five CREATE dialogs ship NO
// DialogDescription and NO input placeholders — verified on the live app
// (zero <p> elements, zero placeholder attributes in every dump). The
// field SETS below stay the session-5 DOM extraction; the body anatomy
// (space-y-2 groups + mt-2 controls, py-4 wrappers, 2-col pairs, the
// Contact avatar section, the max-w-2xl Event/Activity family) is the
// session-15 layer.

/** The Create Lead dialog's Status options (live listbox). */
const CREATE_LEAD_STAGES = ["new", "contacted", "qualified", "unqualified"] as const;

/** Session-71 (S71-P1): the open-epoch counter — the adjust-during-render
 *  pattern for this component's OWN state (the AppShell
 *  close-on-route-change idiom; the reference's own prop→state sync
 *  rides setState-in-effect, an ERROR under our lint). The returned
 *  epoch increments ONLY on false→true transitions of `open`:
 *  - at open: the bump re-keys the form → the useState initializers
 *    re-run against the LIVE props (fresh state per open — the s46
 *    F-46f contract, including the settings-slice defaults);
 *  - while open: the epoch is stable → parent re-renders (store slice
 *    resolutions) never re-key the form (the M-71a1 Date.now() wipe
 *    class retired);
 *  - at close: the epoch stays put → the form remains mounted
 *    through the Radix exit animation (the full body slides out —
 *    the reference's bundle-decoded geometry; the s46 outer-key fix
 *    unmounted the tree instantly and the exit chrome never played). */
function useOpenEpoch(open: boolean): number {
  const [epoch, setEpoch] = React.useState(0);
  const [wasOpen, setWasOpen] = React.useState(open);
  if (open && !wasOpen) {
    setWasOpen(true);
    setEpoch((e) => e + 1);
  } else if (!open && wasOpen) {
    setWasOpen(false);
  }
  return epoch;
}

/** The New Event dialog's Related To options (live listbox). */
const EVENT_RELATED_OPTIONS = [
  { value: "none", label: "None" },
  { value: "contact", label: "Contact" },
  { value: "account", label: "Account" },
  { value: "opportunity", label: "Opportunity" },
  { value: "lead", label: "Lead" },
] as const;

/** The Log Activity dialog's Related To (Type) options (live listbox - no None). */
const ACTIVITY_RELATED_OPTIONS = [
  { value: "contact", label: "Contact" },
  { value: "account", label: "Account" },
  { value: "opportunity", label: "Opportunity" },
  { value: "lead", label: "Lead" },
] as const;

// ---------------------------------------------------------------------------
// Account dialog
// ---------------------------------------------------------------------------

export function AccountDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (account: Account) => void;
}) {
  // Session-71 (S71-P1): the permanently-mounted form keyed by the
  // open-epoch (see useOpenEpoch) — fresh state per open, inert to
  // store re-renders while open, full body through the exit animation.
  const epoch = useOpenEpoch(open);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Session-30 (S30-P6): the reference's Create New Account ships
          the BARE max-w-2xl — no scroll cap (its own inconsistency vs
          the edit dialogs; mirrored). */}
      {/* Session-50 (S50-P1): create-only — the N-47d dead edit mode
          retired. The live edit surface is the EntityEditDialog family
          (wce — the reference itself never reuses its create dialogs
          for editing). */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>
        <AccountForm key={epoch} onOpenChange={onOpenChange} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}

function AccountForm({
  onOpenChange,
  onSaved,
}: {
  onOpenChange: (open: boolean) => void;
  onSaved?: (account: Account) => void;
}) {
  const { createAccount, settings } = useCrmStore();
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    name: "",
    industry: "",
    email: "",
    phone: "",
    website: "",
    annualRevenue: "",
    employees: "",
    tier: settings?.defaultTier ?? "B",
    status: "active",
    isKey: false,
    ownerId: "",
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
      industry: form.industry || null,
      email: form.email || null,
      phone: form.phone || null,
      website: form.website || null,
      annualRevenue: form.annualRevenue ? Number(form.annualRevenue) : null,
      employees: form.employees ? Number(form.employees) : null,
      tier: form.tier,
      status: form.status,
      isKey: form.isKey,
      ownerId: form.ownerId || null,
    };
    const res = await createAccount(payload);
    setPending(false);
    if (res.ok) {
      toast.success("Account created", form.name);
      onSaved?.(res.data);
      onOpenChange(false);
    } else {
      toast.error("Could not save account", res.error);
    }
  }

  // Session-19 (S19-P7): the industries list fed the scaffold-era
  // datalist on the Industry input — the reference ships no datalist, so
  // both are gone (settings stays: it drives the default-tier fallback).

  // Session-5: the reference's CREATE dialog ships exactly eight fields
  // (Account Name*/Industry/Email/Phone/Website/Annual Revenue/Employees/
  // Status — no Tier/Owner/Key account; those fall back to workspace
  // defaults through the payload's form state). Session-50 (S50-P1): the
  // dead edit-mode superset branch (Tier/Owner/Key — unreachable since
  // the s28 EntityEditDialog family took over editing) is retired; the
  // reference's own create dialog is create-only the same way.
  //
  // Session-15 (S15-P10): the body is the reference's 2-COLUMN grid
  // (`grid grid-cols-2 gap-4 py-4` — pairs Name/Industry, Email/Phone,
  // Website/Revenue, Employees/Status), groups are space-y-2 with the
  // v4 controlMt fix, and the CREATE inputs carry NO placeholders.
  return (
    <form onSubmit={submit}>
      <div className={ACCOUNT_DIALOG.body}>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="acc-name">Account Name *</Label>
          <Input
            id="acc-name"
            className={DIALOG_GROUP.controlMt}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="acc-industry">Industry</Label>
          {/* Session-19 (S19-P7): the reference ships ZERO datalist
              suggestion elements in any create dialog (attribute + element
              counts probed live) — the scaffold-era industry dropdown is
              removed for parity. */}
          <Input
            id="acc-industry"
            className={DIALOG_GROUP.controlMt}
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="acc-email">Email</Label>
          <Input
            id="acc-email"
            className={DIALOG_GROUP.controlMt}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="acc-phone">Phone</Label>
          <Input
            id="acc-phone"
            className={DIALOG_GROUP.controlMt}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="acc-website">Website</Label>
          <Input
            id="acc-website"
            className={DIALOG_GROUP.controlMt}
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="acc-revenue">Annual Revenue</Label>
          <Input
            id="acc-revenue"
            className={DIALOG_GROUP.controlMt}
            type="number"
            min={0}
            value={form.annualRevenue}
            onChange={(e) => setForm({ ...form, annualRevenue: e.target.value })}
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="acc-employees">Employees</Label>
          <Input
            id="acc-employees"
            className={DIALOG_GROUP.controlMt}
            type="number"
            min={0}
            value={form.employees}
            onChange={(e) => setForm({ ...form, employees: e.target.value })}
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger className={DIALOG_GROUP.controlMt + " w-full"}><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACCOUNT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{ACCOUNT_STATUS_META[s].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending} className={DIALOG_SUBMIT.button}>
          {pending ? "Saving..." : "Create Account"}
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
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (contact: Contact) => void;
}) {
  // Session-71 (S71-P1): the permanently-mounted form keyed by the
  // open-epoch (see useOpenEpoch).
  const epoch = useOpenEpoch(open);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Session-30 (S30-P2): the AAe's exact shell — max-w-lg (the
          base) + the scroll-cap pair max-h-[90vh] overflow-y-auto
          (bundle-extracted; the tallest create dialog NEEDS it — the
          footer submit rides below the fold without it). */}
      {/* Session-50 (S50-P1): create-only — the N-47d dead edit mode
          retired (the live edit surface is the W7 EntityEditDialog;
          the reference's own create dialog is create-only). */}
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
        </DialogHeader>
        <ContactForm key={epoch} onOpenChange={onOpenChange} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}

function ContactForm({
  onOpenChange,
  onSaved,
}: {
  onOpenChange: (open: boolean) => void;
  onSaved?: (contact: Contact) => void;
}) {
  const { createContact } = useCrmStore();
  const [pending, setPending] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    // Session-28 (S28-P1): the RAW source value (the emoji strings are
    // create-dialog labels only).
    source: "email",
    priority: "warm",
    accountId: "",
    // Session-30 (S30-P2): the photo round-trip — the reference's AAe
    // seeds photo_url from initialData (the Scan Card prefill) and
    // stores the uploaded file_url here until submit.
    photoUrl: "",
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setPending(true);
    const res = await createContact({ ...form, accountId: form.accountId || null });
    setPending(false);
    if (res.ok) {
      toast.success("Contact created", form.name);
      onSaved?.(res.data);
      onOpenChange(false);
    } else {
      toast.error("Could not save contact", res.error);
    }
  }

  // Session-5: the reference's CREATE dialog = Name*/Email* (required)/
  // Phone/Company/Position/"How did you meet?" (the five emoji sources) —
  // no Priority. Session-50 (S50-P1): the dead !createMode Priority
  // select (the N-47d edit-mode leftover) is retired — the W7
  // EntityEditDialog owns the edit surface.
  // Session-15 (S15-P11) → session-30 (S30-P2): the body is the reference's
  // `grid gap-6 py-4` with the AVATAR SECTION first — now the REAL upload
  // round-trip (bundle + live-verified): the photo/initials/User render,
  // the remove X, the disabled-while-uploading camera, the exact alert
  // strings, the "Uploading photo..." hint, and the Name field INSIDE
  // the section with the reference's placeholder + centered medium
  // weight. Then space-y-4 pair groups (Email+Phone, Company+Position),
  // then the How-did-you-meet group.
  const initials = form.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // The reference's AAe onChange (bundle-extracted, live-verified): the
  // image-type check with its exact alert, the upload, the failure
  // alert — and the photo lands in the form state until submit.
  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG or PNG)");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        data?: { file_url?: string };
      } | null;
      if (res.ok && body?.ok && body.data?.file_url) {
        setForm((f) => ({ ...f, photoUrl: body.data!.file_url! }));
      } else {
        alert("Failed to upload photo. Please try again.");
      }
    } catch (err) {
      console.error("Failed to upload photo:", err);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  // The reference's remove handler: clears the form value AND resets the
  // file input's value (so re-picking the SAME file re-fires onChange).
  function removePhoto() {
    setForm((f) => ({ ...f, photoUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form onSubmit={submit}>
      <div className={CONTACT_DIALOG.body}>
        <div className={CONTACT_AVATAR.section}>
          <div className={CONTACT_AVATAR.wrapper}>
            <div className={CONTACT_AVATAR.circle}>
              {form.photoUrl ? (
                <img src={form.photoUrl} alt={form.name} className="w-full h-full object-cover" />
              ) : (
                <span className={CONTACT_AVATAR.initials}>
                  {initials || <User className="w-10 h-10 text-white/80" />}
                </span>
              )}
            </div>
            {form.photoUrl && (
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={CONTACT_AVATAR.camera}
              aria-label="Upload photo"
            >
              <Camera className={CONTACT_AVATAR.cameraIcon} />
            </button>
            {/* Session-19 (S19-P8): the reference's accept list is the
                explicit MIME trio, not image/*. Session-30 (S30-P2): the
                onChange is the REAL round-trip (the visual-parity stub
                retired). */}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" tabIndex={-1} onChange={uploadPhoto} />
          </div>
          {uploading && <p className={CONTACT_AVATAR.uploadingHint}>Uploading photo...</p>}
          <div className={CONTACT_AVATAR.nameGroup}>
            <Label htmlFor="ct-name">Name *</Label>
            <Input
              id="ct-name"
              className={`${DIALOG_GROUP.controlMt} text-center font-medium`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
        </div>
        {/* Session-28 (S28-P3): the reference's AAe create dialog ships
            TWO h3 section headers (live-verified 2026-10-02) —
            "Contact Details" over the Email/Phone pair and "Professional
            Details" over the Company/Position pair
            (text-sm font-semibold text-gray-700 uppercase tracking-wide). */}
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contact Details</h3>
        <div className={CONTACT_DIALOG.pairGroup}>
          <div className={DIALOG_GROUP.group}>
            <Label htmlFor="ct-email">Email *</Label>
            <Input
              id="ct-email"
              className={DIALOG_GROUP.controlMt}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className={DIALOG_GROUP.group}>
            <Label htmlFor="ct-phone">Phone</Label>
            {/* Session-19 (S19-P6): the reference's CONTACT dialog Phone is
                type=tel (live input census) while its LEAD dialog Phone is
                plain text — its own inconsistency, mirrored exactly: only
                the contact field gets tel. */}
            <Input
              id="ct-phone"
              className={DIALOG_GROUP.controlMt}
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Professional Details</h3>
        <div className={CONTACT_DIALOG.pairGroup}>
          <div className={DIALOG_GROUP.group}>
            <Label htmlFor="ct-company">Company</Label>
            {/* Session-19 (S19-P7): the reference ships no datalist here
                either — the account-name suggestion dropdown is removed. */}
            <Input
              id="ct-company"
              className={DIALOG_GROUP.controlMt}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className={DIALOG_GROUP.group}>
            <Label htmlFor="ct-position">Position</Label>
            <Input
              id="ct-position"
              className={DIALOG_GROUP.controlMt}
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
          </div>
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label>How did you meet?</Label>
          <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
            <SelectTrigger className={DIALOG_GROUP.controlMt + " w-full"}><SelectValue /></SelectTrigger>
            <SelectContent>
              {/* Session-28 (S28-P1): the RAW values with the emoji labels
                  (value "email", label "\u2709\ufe0f Email"). */}
              {CONTACT_SOURCE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending} className={DIALOG_SUBMIT.button}>
          {pending ? "Saving..." : "Create Contact"}
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
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (lead: Lead) => void;
}) {
  // Session-71 (S71-P1): the permanently-mounted form keyed by the
  // open-epoch (see useOpenEpoch).
  const epoch = useOpenEpoch(open);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Session-50 (S50-P1): create-only — the N-47d dead edit mode
          retired (the live edit surface is the Mke EntityEditDialog;
          the reference's own create dialog is create-only). */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
        </DialogHeader>
        <LeadForm key={epoch} onOpenChange={onOpenChange} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}

function LeadForm({
  onOpenChange,
  onSaved,
}: {
  onOpenChange: (open: boolean) => void;
  onSaved?: (lead: Lead) => void;
}) {
  const { createLead, settings } = useCrmStore();
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    name: "",
    email: "",
    phone: "",
    company: "",
    value: "",
    stage: settings?.defaultLeadStage ?? "new",
    // Session-29 (S29-P4): the RAW source default (the Tke initial state
    // is source:"email" — bundle-extracted).
    source: "email",
    expectedCloseDate: "",
    nextFollowUp: "",
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
      email: form.email || null,
      phone: form.phone || null,
      company: form.company || null,
      value: form.value ? Number(form.value) : 0,
      stage: form.stage,
      source: form.source || null,
      expectedCloseDate: form.expectedCloseDate ? new Date(form.expectedCloseDate).toISOString() : null,
      nextFollowUp: form.nextFollowUp ? new Date(form.nextFollowUp).toISOString() : null,
    };
    const res = await createLead(payload);
    setPending(false);
    if (res.ok) {
      toast.success("Lead created", form.name);
      onSaved?.(res.data);
      onOpenChange(false);
    } else {
      toast.error("Could not save lead", res.error);
    }
  }

  // Session-5: the reference's CREATE dialog ships exactly seven fields
  // (Name*/Email/Phone/Company/Estimated Value/Status/Source — no dates),
  // Status offers New/Contacted/Qualified/Unqualified, Source offers the
  // four hardcoded lead sources. Session-50 (S50-P1): the dead edit-mode
  // grid (the LEAD_STAGES superset + the date pair — unreachable since
  // the s28 Mke EntityEditDialog took over editing) is retired; the
  // reference's own create dialog cannot even produce the stages its
  // own charts display — its create dialog is create-only the same way.
  //
  // Session-15 (S15-P7/P8/P9): the body is the reference's `grid gap-4
  // py-4` wrapper with space-y-2 groups (controlMt v4 fix) and the
  // Status+Source pair side-by-side in a 2-col grid (162px cells even at
  // 390). No placeholders, no description.
  return (
    <form onSubmit={submit}>
      <div className={DIALOG_FIELDS_WRAPPER.lead}>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="ld-name">Name *</Label>
          <Input
            id="ld-name"
            className={DIALOG_GROUP.controlMt}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="ld-email">Email</Label>
          <Input
            id="ld-email"
            className={DIALOG_GROUP.controlMt}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="ld-phone">Phone</Label>
          <Input
            id="ld-phone"
            className={DIALOG_GROUP.controlMt}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="ld-company">Company</Label>
          <Input
            id="ld-company"
            className={DIALOG_GROUP.controlMt}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
        <div className={DIALOG_GROUP.group}>
          <Label htmlFor="ld-value">Estimated Value</Label>
          <Input
            id="ld-value"
            className={DIALOG_GROUP.controlMt}
            type="number"
            min={0}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
        </div>
        <div className={LEAD_DIALOG.statusSourceGrid}>
          <div className={DIALOG_GROUP.group}>
            <Label>Status</Label>
            <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
              <SelectTrigger className={DIALOG_GROUP.controlMt + " w-full"}><SelectValue /></SelectTrigger>
              <SelectContent>
                {CREATE_LEAD_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>{STAGE_META[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className={DIALOG_GROUP.group}>
            <Label>Source</Label>
            <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
              <SelectTrigger className={DIALOG_GROUP.controlMt + " w-full"}><SelectValue /></SelectTrigger>
              <SelectContent>
                {/* Session-29 (S29-P4): value/label pairs — the RAW
                    values are stored; the labels are display-only. */}
                {LEAD_SOURCE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending} className={DIALOG_SUBMIT.button}>
          {pending ? "Saving..." : "Create Lead"}
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
  // Session-71 (S71-P1): the permanently-mounted form keyed by the
  // open-epoch (see useOpenEpoch) — the s46 render-time
  // defaultStart?.getTime() key retired with it: the epoch re-keys at
  // open against the THEN-current event/defaultStart props (the
  // calendar sets both before opening), and no render-time value can
  // re-key mid-session (the M-71a1 class).
  const epoch = useOpenEpoch(open);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_CONTENT.wide}>
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>
        <EventForm
          key={epoch}
          event={event ?? null}
          defaultStart={defaultStart ?? null}
          onOpenChange={onOpenChange}
          onSaved={onSaved}
        />
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
    // Session-76 (L-76c10, bundle-decoded from SAe): the initial
    // related_to_type is "" — the "Select type" placeholder shows at
    // rest (ours preselected "none" for 61 sessions). The None option's
    // value stays "none" in our Radix string-value world (the reference
    // uses null) — mapped to "" in the payload.
    relatedType: event?.relatedType ?? "",
    // Session-76 (M-76c13): the conditional "Name" field's value — the
    // reference's related_to_name.
    relatedName: event?.relatedName ?? "",
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
      description: form.description || null,
      type: form.type,
      status: form.status,
      startAt: new Date(form.startAt).toISOString(),
      endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
      location: form.location || null,
      relatedType: form.relatedType === "none" ? "" : form.relatedType,
      relatedName: form.relatedName || null,
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

  // Session-5: the reference's New Event dialog = Title*/Description/
  // Event Type*/Status/Start Date & Time*/End Date & Time/Location/
  // Related To (None/Contact/Account/Opportunity/Lead).
  // Session-15 (S15-P12): the WIDE family — max-w-2xl (672px), form
  // space-y-4, BARE unclassed field divs (label + control direct children,
  // ~4px natural gap), grid-cols-2 pairs (Type+Status, Start+End), Related
  // To ALONE in a grid-cols-2 (the reference's second cell gains the
  // CONDITIONAL Name field — session-76 M-76c13), the min-h-[60px]
  // Description textarea, the pt-4 wide footer, and the blue submit in
  // BOTH modes (session-76 M-76c12 — the reference's own footer decodes
  // `bg-blue-600 hover:bg-blue-700` with the "Update Event" label in
  // edit mode).
  return (
    <form onSubmit={submit} className={EVENT_DIALOG.form}>
      <div>
        <Label htmlFor="ev-title">Title *</Label>
        <Input id="ev-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="ev-desc">Description</Label>
        <Textarea id="ev-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className={EVENT_DIALOG.pair}>
        <div>
          <Label>Event Type *</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{EVENT_TYPE_META[t].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["scheduled", "completed", "cancelled"].map((s) => (
                <SelectItem key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className={EVENT_DIALOG.pair}>
        <div>
          <Label htmlFor="ev-start">Start Date &amp; Time *</Label>
          <Input id="ev-start" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="ev-end">End Date &amp; Time</Label>
          <Input id="ev-end" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
        </div>
      </div>
      <div>
        <Label htmlFor="ev-loc">Location</Label>
        <Input
          id="ev-loc"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Enter location or meeting link"
        />
      </div>
      <div className={EVENT_DIALOG.relatedToAlone}>
        <div>
          <Label>Related To</Label>
          <Select value={form.relatedType} onValueChange={(v) => setForm({ ...form, relatedType: v })}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {EVENT_RELATED_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Session-76 (M-76c13, bundle-decoded from SAe): the second cell
            renders a CONDITIONAL "Name" field when a related TYPE is
            chosen — `a.related_to_type && jsx(div, [Label "Name", Input
            placeholder: `Enter ${a.related_to_type} name`])`. The s15
            "second cell empty" pin was a zero-interaction live read; the
            reference's placeholder capitalizes the wire value
            ("Enter Contact name") — mirrored via the capitalize helper. */}
        {form.relatedType && form.relatedType !== "none" && (
          <div>
            <Label htmlFor="ev-related-name">Name</Label>
            <Input
              id="ev-related-name"
              value={form.relatedName}
              onChange={(e) => setForm({ ...form, relatedName: e.target.value })}
              placeholder={`Enter ${form.relatedType.charAt(0).toUpperCase()}${form.relatedType.slice(1)} name`}
            />
          </div>
        )}
      </div>
      <DialogFooterWide>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        {/* Session-76 (M-76c12, bundle-decoded from SAe): the submit is
            `bg-blue-600 hover:bg-blue-700` in BOTH modes with the label
            "Update Event" in edit — the s15 "edit keeps the dark
            superset" claim was bundle-falsified (the decoded footer:
            `n?"Saving...":i?"Update Event":"Create Event"`). */}
        <Button
          type="submit"
          disabled={pending}
          className={EVENT_DIALOG.submit}
        >
          {pending ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </DialogFooterWide>
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
  // Session-71 (S71-P1, M-71a1): the permanently-mounted form keyed by
  // the open-epoch — the s46 create key rode a RENDER-TIME Date.now()
  // (every parent re-render while the dialog was open re-keyed the
  // form and WIPED the user's typed subject/notes; all five consumer
  // pages destructure the whole store, so the first-load slice
  // resolutions were a guaranteed re-render source). The epoch bumps
  // only on false→true — fresh state per open against the
  // THEN-current defaultType/activity props, inert while open.
  const epoch = useOpenEpoch(open);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_CONTENT.wide}>
        <DialogHeader>
          <DialogTitle>{activity ? "Edit Activity" : "Log Activity"}</DialogTitle>
        </DialogHeader>
        <ActivityForm
          key={epoch}
          activity={activity ?? null}
          defaultType={defaultType}
          onOpenChange={onOpenChange}
          onSaved={onSaved}
        />
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
  const { createActivity, updateActivity } = useCrmStore();
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    // Session-76 (L-76c6, bundle-decoded from Mce): the form ALWAYS starts
    // at "Call" in create mode — the quick-log preset never presets the
    // visible form value (it rides the SUBMIT instead, the reference's
    // `type: i || N.type` construction). Edit mode keeps the activity's
    // own type.
    type: activity?.type ?? "call",
    subject: activity?.subject ?? "",
    notes: activity?.notes ?? "",
    dueAt: activity?.dueAt ? toLocalInputValue(activity.dueAt) : toLocalInputValue(new Date()),
    status: activity?.status ?? "scheduled",
    priority: activity?.priority ?? "normal",
    // Session-76 (L-76c10): the reference's initial related_to_type is ""
    // — the "Select type" placeholder shows at rest (ours preselected
    // "contact" for 61 sessions).
    relatedType: activity?.relatedType ?? "",
    relatedName: activity?.relatedName ?? "",
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
    // Session-76 (L-76c6, bundle-decoded from the reference's Mce call
    // site): `onSubmit: N => mutate({...N, type: i || N.type})` — the
    // quick-log PRESET wins at submit time in create mode (the reference's
    // own quirk: changing the select under an active preset is silently
    // overridden). Edit mode keeps the form's own type.
    const payload = {
      type: activity ? form.type : (defaultType || form.type),
      subject: form.subject,
      notes: form.notes || null,
      dueAt: new Date(form.dueAt).toISOString(),
      status: form.status,
      priority: form.priority,
      relatedType: form.relatedType || null,
      relatedName: form.relatedName || null,
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

  // Session-5: the reference's Log Activity dialog = Activity Type*/
  // Date & Time*/Description*/Related To (Type) + Related To (Name) —
  // a type select plus a FREEFORM name input, and no Status select (new
  // activities default to scheduled).
  // Session-15 (S15-P13): the WIDE family — max-w-2xl (672px), form
  // space-y-4, grid-cols-2 pairs (Type+DateTime, RelatedType+RelatedName)
  // with BARE cells, the bare min-h-[60px] Description textarea, and the
  // pt-4 wide footer.
  return (
    <form onSubmit={submit} className={ACTIVITY_DIALOG.form}>
      <div className={ACTIVITY_DIALOG.pair}>
        <div>
          <Label>Activity Type *</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {/* Session-76 (L-76c6): FIVE options — Call/Email/Meeting/
                  Task/Note. WhatsApp is NEVER listed (the quick-log preset
                  rides the submit); listing it made our preset visible,
                  diverging from the reference's select. */}
              {ACTIVITY_DIALOG_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{ACTIVITY_TYPE_META[t].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="ac-due">Date &amp; Time *</Label>
          <Input id="ac-due" type="datetime-local" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} required />
        </div>
      </div>
      <div>
        <Label htmlFor="ac-subject">Description *</Label>
        {/* Session-76 (L-76c8/M-76c14, bundle-decoded from Mce): the
            Activity Description textarea is rows=4 (~88px — the Event
            dialog's rows=3 min-h-[60px] is its own surface) and carries
            the placeholder the s15 dump missed. */}
        <Textarea
          id="ac-subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="Enter activity details..."
          rows={4}
          required
        />
      </div>
      <div className={ACTIVITY_DIALOG.pair}>
        <div>
          <Label>Related To (Type)</Label>
          <Select value={form.relatedType} onValueChange={(v) => setForm({ ...form, relatedType: v })}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {ACTIVITY_RELATED_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="ac-related-name">Related To (Name)</Label>
          <Input
            id="ac-related-name"
            value={form.relatedName}
            onChange={(e) => setForm({ ...form, relatedName: e.target.value })}
            placeholder="e.g., John Doe"
          />
        </div>
      </div>
      <DialogFooterWide>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending} className={DIALOG_SUBMIT.button}>
          {pending ? "Saving..." : activity ? "Save Changes" : "Log Activity"}
        </Button>
      </DialogFooterWide>
    </form>
  );
}

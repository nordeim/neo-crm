"use client";

// Session-28 (S28-P2): the reference's EDIT-DIALOG family — W7 (contact),
// wce (account), Mke (lead), all bundle-extracted. The reference never
// reuses its create dialogs for editing: every edit dialog is a SEPARATE
// max-w-2xl form with grid-cols-2 rows, a Status/Source select pair, and
// the "Save Changes" / "Saving..." footer. All three support a readOnly
// mode that flips the title to "... Details", disables the inputs, and
// swaps the footer to a single Close button.
//
// The reference's own quirks pinned here:
// - The contact edit's source select is PLAIN (Call/Email/Website/Partner/
//   Referral) — the emojis live only in the CREATE dialog.
// - The account edit ships the full field set (Website url, Annual
//   Revenue / Employees numbers) with a THREE-option status select.
// - The lead edit's status vocabulary is New/Contacted/Qualified/
//   Unqualified (not the table's 5-status set) and its source has FOUR
//   options (no Referral).
//
// React 19 lint-clean, session-71 re-timing: the shell mounts its
// form UNCONDITIONALLY, keyed by an open-epoch counter (the
// adjust-during-render `useOpenEpoch` in entity-dialogs.tsx — the
// AppShell close-on-route-change idiom) that bumps ONLY on false→true
// transitions of `open`. At open the epoch re-keys the form → the
// useState initializer re-reads the LIVE `initial` (the s46 F-46f
// contract — fresh state per open, whichever row's Edit you click);
// while open the epoch is stable → store re-renders never re-key the
// form; at close the form stays mounted → the Radix root plays its
// pinned exit chrome over the FULL body (the s46 outer-key fix
// unmounted the tree at close and the animation never played — the
// 71-c M-71a2 finding; the reference mounts its W7/wce/Mke with NO
// key, permanently — bundle-decoded).

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Session-68 (N-68d): the edit family consumes the shared chrome
// constants instead of hand-inlined byte-copies — a future constant
// re-pin can no longer silently diverge the create/edit families.
import { DIALOG_CONTENT, DIALOG_FOOTER_WIDE } from "@/lib/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type EditSelectOption = { value: string; label: string };

/** Session-71 (S71-P1): the open-epoch counter — see the module header
 *  and the entity-dialogs.tsx twin for the full contract (the
 *  adjust-during-render form; setState-in-effect is an ERROR under our
 *  lint — the reference's own prop→state sync pattern). */
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

export type EditFieldSpec = {
  label: string;
  key: string;
  type?: "text" | "tel" | "email" | "url" | "number";
  placeholder?: string;
  required?: boolean;
  /** Select options — plain strings (value = label) or {value, label}
   * pairs (the reference's status/source selects store RAW values with
   * capitalized labels: value "call", label "Call"). */
  options?: readonly (string | EditSelectOption)[];
};

const optValue = (o: string | EditSelectOption): string => (typeof o === "string" ? o : o.value);
const optLabel = (o: string | EditSelectOption): string => (typeof o === "string" ? o : o.label);

const STATUS_PAIRS: EditSelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];
const SOURCE_PAIRS: EditSelectOption[] = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
  { value: "partner", label: "Partner" },
  { value: "referral", label: "Referral" },
];

/** The W7 contact config: Name+Email, Phone(tel)/Company, Position
 * (full width), Status/Source (value/label pairs — raw values, capitalized
 * labels, no emojis in the edit select). */
export const CONTACT_EDIT_FIELDS: EditFieldSpec[][] = [
  [
    { label: "Name *", key: "name", required: true },
    { label: "Email *", key: "email", type: "email", required: true },
  ],
  [
    { label: "Phone", key: "phone", type: "tel" },
    { label: "Company", key: "company" },
  ],
  [{ label: "Position", key: "position" }],
  [
    { label: "Status", key: "status", options: STATUS_PAIRS },
    { label: "Source", key: "source", options: SOURCE_PAIRS },
  ],
];

/** The wce account config: Account Name+Industry, Phone(tel)/Email,
 * Website (url), Annual Revenue/Employees (numbers), the 3-option Status. */
export const ACCOUNT_EDIT_FIELDS: EditFieldSpec[][] = [
  [
    { label: "Account Name *", key: "name", required: true },
    { label: "Industry", key: "industry" },
  ],
  [
    { label: "Phone", key: "phone", type: "tel" },
    { label: "Email", key: "email", type: "email" },
  ],
  [{ label: "Website", key: "website", type: "url", placeholder: "https://example.com" }],
  [
    { label: "Annual Revenue", key: "annualRevenue", type: "number", placeholder: "100000" },
    { label: "Employees", key: "employees", type: "number", placeholder: "50" },
  ],
  [
    { label: "Status", key: "status", options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "prospect", label: "Prospect" },
    ] },
  ],
];

/** The Mke lead config: Name+Email, Phone(tel)/Company, Status (the
 * 4-option set)/Source (4 options), Estimated Value (number). */
export const LEAD_EDIT_FIELDS: EditFieldSpec[][] = [
  [
    { label: "Name *", key: "name", required: true },
    { label: "Email", key: "email", type: "email" },
  ],
  [
    { label: "Phone", key: "phone", type: "tel" },
    { label: "Company", key: "company" },
  ],
  [
    { label: "Status", key: "status", options: [
      { value: "new", label: "New" },
      { value: "contacted", label: "Contacted" },
      { value: "qualified", label: "Qualified" },
      { value: "unqualified", label: "Unqualified" },
    ] },
    { label: "Source", key: "source", options: [
      { value: "call", label: "Call" },
      { value: "email", label: "Email" },
      { value: "website", label: "Website" },
      { value: "partner", label: "Partner" },
    ] },
  ],
  [{ label: "Estimated Value", key: "value", type: "number", placeholder: "50000" }],
];

export function EntityEditDialog({
  open,
  onOpenChange,
  title,
  detailsTitle,
  fields,
  initial,
  onSubmit,
  isLoading = false,
  readOnly = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  detailsTitle: string;
  fields: EditFieldSpec[][];
  initial: Record<string, string | number | null | undefined>;
  // Session-59 (S59-P2, N-59b): the `entityId` prop RETIRED here —
  // destructured + typed + passed by all three call sites
  // (contacts/leads/accounts) since s28, but never read in the body
  // (the N-56a lint-invisible class, DESTRUCTURED variant; both
  // no-unused-vars rules off). The call-site bindings retired with
  // it; `editTarget` stays live through `initial` at every site.
  // Session-62 (N-62d): `readOnly` (and the detailsTitle render that
  // lives only under it) is PRODUCTION-DEAD — no call site passes
  // readOnly=true, so the three "… Details" bindings never render.
  // Kept deliberately: the reference's own capability, test-pinned
  // (entity-edit-dialog.test.ts) — the third member of the N-46e
  // isLoading wire-or-remove posture family.
  onSubmit: (form: Record<string, string>) => void | Promise<void>;
  isLoading?: boolean;
  readOnly?: boolean;
}) {
  // Session-71 (S71-P1, M-71a2): the shell stays UNKEYED and
  // permanently mounted — the three call-site pages retired their
  // outer `key={editTarget?.id ?? "none"}` (it flipped to "none" in
  // the same batched close render `open` went false, unmounting the
  // Radix Root instantly — the exit animation NEVER played). The
  // epoch-keyed child below carries the fresh-state-per-open
  // contract instead; the parents keep nulling editTarget on close
  // (harmless — the keyed child's state is isolated from the
  // `initial` prop, so the populated body persists through the exit).
  const epoch = useOpenEpoch(open);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_CONTENT.wide}>
        <DialogHeader>
          <DialogTitle>{readOnly ? detailsTitle : title}</DialogTitle>
        </DialogHeader>
        <EntityEditForm
          key={epoch}
          fields={fields}
          initial={initial}
          isLoading={isLoading}
          readOnly={readOnly}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

/** The form body — mounted inside the shell, keyed by the open-epoch
 * (all state initializes via useState at (re)mount — the repo
 * pattern; the key change at each open re-runs the initializer
 * against the live `initial`). */
function EntityEditForm({
  fields,
  initial,
  isLoading,
  readOnly,
  onSubmit,
  onCancel,
}: {
  fields: EditFieldSpec[][];
  initial: Record<string, string | number | null | undefined>;
  isLoading?: boolean;
  readOnly?: boolean;
  onSubmit: (form: Record<string, string>) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const row of fields) {
      for (const f of row) {
        const v = initial[f.key];
        out[f.key] = v == null ? "" : String(v);
      }
    }
    if (!out.status) out.status = "active";
    return out;
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    void onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {fields.map((row, ri) => (
        <div key={ri} className={row.length === 2 ? "grid grid-cols-2 gap-4" : undefined}>
          {row.map((f) => (
            <div key={f.key} className="space-y-2">
              <Label>{f.label}</Label>
              {f.options ? (
                <Select
                  value={form[f.key] ?? ""}
                  onValueChange={(v) => set(f.key, v)}
                  disabled={readOnly}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options.map((o) => (
                      <SelectItem key={optValue(o)} value={optValue(o)}>
                        {optLabel(o)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={f.type ?? "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                  disabled={readOnly}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <div className={DIALOG_FOOTER_WIDE}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {readOnly ? "Close" : "Cancel"}
        </Button>
        {!readOnly && (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>
    </form>
  );
}

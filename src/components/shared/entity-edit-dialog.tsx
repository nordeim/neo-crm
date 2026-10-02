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
// React 19 lint-clean: the form mounts only while open, keyed by entity
// id, so all state initializes via useState at mount (the repo pattern).

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type EditSelectOption = { value: string; label: string };

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
  entityId,
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
  entityId?: string | null;
  onSubmit: (form: Record<string, string>) => void | Promise<void>;
  isLoading?: boolean;
  readOnly?: boolean;
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{readOnly ? detailsTitle : title}</DialogTitle>
        </DialogHeader>
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
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
      </DialogContent>
    </Dialog>
  );
}

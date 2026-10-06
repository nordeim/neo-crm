"use client";

// Session-25 (S25-P4): the "Save Custom Report View" dialog — the
// reference's "Saved Reports (N)" button opens THIS (live-verified
// 2026-10-01 with a complete save/load round-trip). The structure rides
// the stock kit exactly like the reference's own n3e construction
// (re-decoded in full session-74):
//
//   DialogTitle "Save Custom Report View"
//   body space-y-6 py-4 > section space-y-4:
//     Label "Report Name" + Input (placeholder "e.g., Q1 Won Deals by
//       Region", mt-1)
//     Label "Select Columns to Display" (mb-3 block) + the 6 checkbox
//       rows in a grid grid-cols-2 gap-3 (the stock button-checkbox with
//       the Check indicator — the reference's exact `peer h-4 w-4
//       shrink-0 rounded-sm border border-primary shadow` construction
//       is our CHECKBOX.control family)
//     the Current-Filters summary in the bg-blue-50 border-blue-200
//       rounded-lg p-3 box (text-sm text-blue-800, "Current Filters:"
//       bold + " Date Range: X, Stage: Y, Owner: Z" — three dimensions,
//       raw slugs, the `|| "All"` owner terminal)
//   the saved list (when ≥1): border-t pt-4 + "Saved Reports" label +
//     a space-y-2 max-h-48 overflow-y-auto scroll list + per-item
//     p-3 bg-gray-50 rounded-lg rows (the blue bookmark glyph + name +
//     the locale date + an outline "Load" button)
//   Footer: Cancel (outline) + "Save Report" (primary, the Save icon,
//     disabled until named) + the opacity Close X (DialogContent's stock)
//
// Session-74 (L-74c8): the dialog does NOT reset on open — the n3e
// state lives outside the Radix portal and persists across opens (a
// cancel-then-reopen shows the typed name); the name clears ONLY after
// a successful save (the reference's own post-save s("")).
// Save → the localStorage seam + the count updates + the dialog closes.
// Load → applies the saved filters + closes. Zero toasts, zero network
// calls — the reference's exact contract.

import * as React from "react";
import { Bookmark, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox, Label } from "@/components/ui/label";
import {
  DEFAULT_SAVED_COLUMNS,
  REPORT_COLUMNS,
  savedReportDate,
  type SavedReport,
  type SavedReportColumns,
  type SavedReportFilters,
} from "@/lib/saved-reports";
import { DIALOG_CONTENT } from "@/lib/page-layout";

interface SaveReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The live filter state — captured into the saved view + the summary. */
  filters: SavedReportFilters;
  /** The current count (drives the saved-list section). */
  savedCount: number;
  /** Persist the view; the parent updates the count + closes. */
  onSave: (name: string, columns: SavedReportColumns) => void;
  /** Apply a saved view's filters; the parent closes. */
  onLoad: (report: SavedReport) => void;
  /** The saved list (read by the parent through the seam). */
  savedList: SavedReport[];
}

export function SaveReportDialog({
  open,
  onOpenChange,
  filters,
  savedCount,
  onSave,
  onLoad,
  savedList,
}: SaveReportDialogProps) {
  const [name, setName] = React.useState("");
  const [columns, setColumns] = React.useState<SavedReportColumns>(DEFAULT_SAVED_COLUMNS);

  const toggleColumn = (key: keyof SavedReportColumns) => {
    setColumns((c) => ({ ...c, [key]: !c[key] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Session-30 (S30-P6): the reference's Save Custom Report ships
          the wide family's scroll-cap pair (bundle-extracted).
          Session-68 (N-68d): wired to DIALOG_CONTENT.wide (was a
          hand-inlined byte-copy of the same string). */}
      <DialogContent className={DIALOG_CONTENT.wide}>
        <DialogHeader>
          <DialogTitle>Save Custom Report View</DialogTitle>
        </DialogHeader>

        {/* Session-74 (L-74c7): the reference's n3e body — space-y-6 py-4
            over a space-y-4 first section (name + columns + the filters
            box), then the saved-reports section. */}
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Q1 Won Deals by Region"
              />
            </div>

            <div>
              <Label className="mb-3 block">Select Columns to Display</Label>
              <div className="grid grid-cols-2 gap-3">
                {REPORT_COLUMNS.map((col) => (
                  <Checkbox
                    key={col.key}
                    checked={columns[col.key]}
                    onCheckedChange={() => toggleColumn(col.key)}
                    label={col.label}
                  />
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Current Filters:</strong>
                {" "}
                Date Range: {filters.dateRange}, Stage: {filters.stage}, Owner: {filters.owner || "All"}
              </p>
            </div>
          </div>

          {savedCount > 0 ? (
            <div className="border-t pt-4">
              <Label className="mb-3 block">Saved Reports</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedList.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{r.name}</p>
                        <p className="text-xs text-gray-500">{savedReportDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => onLoad(r)}
                    >
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={name.trim().length === 0}
            onClick={() => {
              onSave(name.trim(), columns);
              // Session-74 (L-74c8): the reference's own post-save clear —
              // the n3e clears ITS name after handing the report up; a
              // cancel-then-reopen keeps whatever was typed.
              setName("");
            }}
          >
            <Save className="w-4 h-4 mr-2" /> Save Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

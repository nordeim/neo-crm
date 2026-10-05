"use client";

// Session-25 (S25-P4): the "Save Custom Report View" dialog — the
// reference's "Saved Reports (N)" button opens THIS (live-verified
// 2026-10-01 with a complete save/load round-trip). The structure rides
// the stock kit exactly like the reference's own construction:
//
//   DialogTitle "Save Custom Report View"
//   Label "Report Name" + Input (placeholder "e.g., Q1 Won Deals by Region")
//   Label "Select Columns to Display" + 6 checkbox rows (the stock
//     button-checkbox with the Check indicator — the reference's exact
//     `peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow`
//     construction is our CHECKBOX.control family)
//   "Current Filters:" (bold) + " Date Range: quarter, Stage: all,
//     Owner: all" — THREE dimensions only, raw slugs
//   The saved list (when ≥1): border-t pt-4 + "Saved Reports" label +
//     a space-y-2 max-h-48 overflow-y-auto scroll list + per-item
//     p-3 bg-gray-50 rounded-lg rows (the blue bookmark glyph + name +
//     M/D/YYYY + an outline "Load" button)
//   Footer: Cancel (outline) + "Save Report" (primary, disabled until
//     named) + the opacity Close X (DialogContent's stock close)
//
// Save → the localStorage seam + the count updates + the dialog closes.
// Load → applies the saved filters + closes. Zero toasts, zero network
// calls — the reference's exact contract.

import * as React from "react";
import { Bookmark } from "lucide-react";
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

  // Reset the form each time the dialog opens (the reference opens with
  // a blank name + all columns checked — verified on every re-open).
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setName("");
      setColumns(DEFAULT_SAVED_COLUMNS);
    }
  }

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

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Q1 Won Deals by Region"
            />
          </div>

          <div className="grid gap-2">
            <Label>Select Columns to Display</Label>
            <div className="grid gap-2">
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

          <p className="text-sm text-muted">
            <strong className="text-foreground">Current Filters:</strong>
            {" "}
            Date Range: {filters.dateRange}, Stage: {filters.stage}, Owner: {filters.owner}
          </p>

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
          <Button disabled={name.trim().length === 0} onClick={() => onSave(name.trim(), columns)}>
            Save Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

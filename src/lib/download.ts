"use client";

// Browser download helper.
//
// Session-48 (S48-P4, N-48g): the `downloadFile` navigation seam
// (window.location.href = url) was RETIRED — its last consumer (the
// reports header Export CSV) was the F-47a mechanism's final instance:
// a non-200 answer navigated the browser to the raw JSON error body
// instead of downloading anything. Every download surface now builds
// client-side artifacts (or round-trips them via fetch) and lands here
// through the blob family below.

// Session-25 (S25-P5): the client-side artifact family — the reference's
// per-table CSVs/PDFs generate their downloads in the browser (its
// createElement/createObjectURL spies observed blob: text/csv + a
// programmatic anchor click). Blob → object URL → anchor click → revoke.
export function downloadBlob(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

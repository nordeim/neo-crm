"use client";

// Browser download helper. `window.location.href` is intentional here: these
// are file downloads (Content-Disposition: attachment), not client-side
// navigations — hence the single, centralized spot for this pattern.

export function downloadFile(url: string): void {
  window.location.href = url;
}

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


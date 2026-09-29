"use client";

// Browser download helper. `window.location.href` is intentional here: these
// are file downloads (Content-Disposition: attachment), not client-side
// navigations — hence the single, centralized spot for this pattern.

export function downloadFile(url: string): void {
  window.location.href = url;
}

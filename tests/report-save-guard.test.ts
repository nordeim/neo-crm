import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-44 pins (S44-P4): the reports saveReport storage guard — the
// F-44b audit. saveReport's setItem (src/lib/saved-reports.ts) and the
// reports-page's onSave handler were un-wrapped: a quota/private-mode
// exception escapes the React event handler (React 19 boundaries don't
// catch event throws) → an uncaught error, no toast, the dialog stays
// open. The leads-page saveView twin IS guarded
// (toast.error("Could not save view", "Browser storage is unavailable."))
// — this brings the reports surface to the same convention.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");

describe("session-44: the reports save surfaces storage failures (S44-P4)", () => {
  it("the onSave handler wraps the saveReport family in try/catch", () => {
    const src = page();
    const at = src.indexOf("onSave={");
    expect(at).toBeGreaterThanOrEqual(0);
    const handler = src.slice(at, at + 700);
    expect(handler).toMatch(/try\s*\{/);
    expect(handler).toMatch(/\}\s*catch\s*\{/);
    expect(handler).toMatch(/saveReport\(/);
  });

  it("the catch toasts the storage-failure vocabulary (the leads-page saveView convention)", () => {
    const src = page();
    const at = src.indexOf("onSave={");
    const handler = src.slice(at, at + 700);
    expect(handler).toMatch(/toast\.error\(\s*"Could not save report"/);
    expect(handler).toMatch(/Browser storage is unavailable\./);
  });
});

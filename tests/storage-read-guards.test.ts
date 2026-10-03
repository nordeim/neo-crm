import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-45 pins (S45-P2): the localStorage READ guards — the F-45b
// audit. s44-P4 guarded the WRITE side only; the reads remained bare:
// `saved-reports.ts` listSavedReports touches window.localStorage.getItem
// with no try/catch (merely TOUCHING window.localStorage throws
// SecurityError in all-cookies-blocked Chromium), consumed inside the
// uncaught setTimeout callback (reports-page.tsx mount effect); the
// leads twin reads getItem inside its own uncaught timer (its WRITE at
// saveView IS guarded — the same convention inconsistency F-44b was).
// Full census: exactly 2 unguarded READ sites repo-wide. The fix: a
// blocked storage falls back to the empty list (the first-paint
// default), never an uncaught timer exception. Write-side topology:
// leads setItem guards inline; saved-reports setItem is guarded by its
// caller (the reports-page onSave try/catch, the s44-P4 pin).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const lib = () => stripComments(read("src/lib/saved-reports.ts") ?? "");
const leads = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
const reports = () => stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");

/** True when the access at `at` sits inside a try region (a catch
 *  follows before the region end) — the guard-shape probe. */
function guardedFrom(src: string, at: number, span = 1200): boolean {
  const region = src.slice(at, at + span);
  return /catch\s*\{/.test(region);
}

describe("session-45: the localStorage reads are guarded (S45-P2)", () => {
  it("listSavedReports wraps the storage read in try/catch (blocked storage → the empty list)", () => {
    const src = lib();
    const at = src.indexOf("export function listSavedReports");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 400);
    expect(fn).toMatch(/try\s*\{/);
    expect(fn).toMatch(/\}\s*catch\s*\{/);
    expect(fn).toMatch(/return \[\];/);
    expect(fn).toMatch(/localStorage\.getItem/);
  });

  it("the leads-page mount-effect read wraps its storage access in try/catch", () => {
    const src = leads();
    const at = src.indexOf("LEAD_VIEWS_STORAGE_KEY)");
    expect(at).toBeGreaterThanOrEqual(0);
    // The READ site (the first occurrence — the mount-effect timer),
    // not the guarded write further down.
    const timer = src.lastIndexOf("setTimeout(", at);
    expect(timer).toBeGreaterThanOrEqual(0);
    const region = src.slice(timer, at + 200);
    expect(region).toMatch(/try\s*\{/);
    expect(region).toMatch(/catch\s*\{/);
  });

  it("the census holds: every localStorage read sits in a try region; the writes keep their guards", () => {
    // The two READ sites — both must be locally guarded.
    const libSrc = lib();
    const getItem = libSrc.indexOf("localStorage.getItem");
    expect(getItem).toBeGreaterThanOrEqual(0);
    expect(guardedFrom(libSrc, getItem), "saved-reports.ts getItem unguarded").toBe(true);

    const leadsSrc = leads();
    const leadsRead = leadsSrc.indexOf("localStorage.getItem");
    expect(leadsRead).toBeGreaterThanOrEqual(0);
    expect(guardedFrom(leadsSrc, leadsRead), "leads-page.tsx getItem unguarded").toBe(true);

    // The leads WRITE — guarded inline (the s29 convention).
    const leadsWrite = leadsSrc.indexOf("localStorage.setItem");
    expect(leadsWrite).toBeGreaterThanOrEqual(0);
    expect(guardedFrom(leadsSrc, leadsWrite), "leads-page.tsx setItem unguarded").toBe(true);

    // The saved-reports WRITE — guarded by the reports-page onSave
    // caller (the s44-P4 convention, re-asserted here so the census is
    // self-contained).
    const onSave = reports().indexOf("onSave={");
    expect(onSave).toBeGreaterThanOrEqual(0);
    const handler = reports().slice(onSave, onSave + 700);
    expect(handler).toMatch(/try\s*\{/);
    expect(handler).toMatch(/\}\s*catch\s*\{/);
    expect(handler).toMatch(/saveReport\(/);
  });
});

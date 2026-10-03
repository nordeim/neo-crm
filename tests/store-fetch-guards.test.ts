import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-45 pins (S45-P4): the calendar events last-call-wins token —
// the F-45e audit. fetchEvents (crm-store.ts) had no
// AbortController/token and was last-RESOLVED-wins: rapid calendar
// month flips could strand the stale month's slice in the store (Jan →
// Feb → Mar with Feb resolving last shows FEBRUARY's events under
// March's cursor). The fix at the store seam: a monotonically
// increasing module token; only the newest call's resolution may write
// the slice. Sequential flows are unaffected (the token only skips a
// write when a NEWER call exists — the hydrate → calendar-effect
// handoff resolves in the calendar's favor, the correct owner). The
// stale-response twin of the s45-P3 topbar controller.

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

const store = () => stripComments(read("src/stores/crm-store.ts") ?? "");

describe("session-45: fetchEvents writes only the newest call's slice (S45-P4)", () => {
  it("a module-level fetch token exists and increments per call", () => {
    const src = store();
    expect(src).toMatch(/let\s+eventsFetchToken(?::\s*number)?\s*=\s*0/);
    const at = src.indexOf("fetchEvents: async");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 400);
    expect(fn).toMatch(/\+\+eventsFetchToken/);
    expect(fn).toMatch(/const token = \+\+eventsFetchToken/);
  });

  it("the set is token-guarded (a stale resolution cannot overwrite the newer call's)", () => {
    const src = store();
    const at = src.indexOf("fetchEvents: async");
    const fn = src.slice(at, at + 400);
    expect(fn).toMatch(/if\s*\(res\.ok\s*&&\s*token === eventsFetchToken\)\s*set\(\{\s*events:\s*res\.data\s*\}\)/);
  });
});

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-46 pins (S46-P3): the settings editors' failure rollback +
// the remount-key collision — the F-46c audit. mutate() left a failed
// picklist PUT's phantom item in the editor (label > 60 chars / 41st
// entry → 400 at settings/route.ts:65/:68; no client-side cap), and
// the remount keys cfg-${JSON.stringify(settings).length} /
// def-${…length} keyed on JSON LENGTH — same-length snapshots collide
// (an add+remove of equal-length items → no remount → stale local
// state). The fix: the guarded revert (only roll back when the list is
// still the failed snapshot — reference equality on the array) and the
// full-serialization keys.

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

const page = () => stripComments(read("src/app/(app)/settings/settings-page.tsx") ?? "");

describe("session-46: the settings failure rollback + remount key (S46-P3)", () => {
  it("mutate() reverts the list on a failed save — guarded so a user who kept editing is not clobbered", () => {
    const src = page();
    const at = src.indexOf("function mutate(");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 900);
    // The pre-mutation snapshot is captured…
    expect(fn).toMatch(/const prev = l\[key\];/);
    // …the failure still toasts (the standing behavior)…
    expect(fn).toMatch(/toast\.error\(\s*"Could not save",\s*res\.error\s*\)/);
    // …and the revert only fires when the current list is still the
    // failed snapshot (reference equality — a further edit wins).
    expect(fn).toMatch(/setLists\(\(cur\) => \(cur\[key\] === next\[key\] \? \{ \.\.\.cur, \[key\]: prev \} : cur\)\)/);
  });

  it("the remount keys use the FULL settings serialization (length collisions impossible)", () => {
    const src = page();
    expect(src).toContain("cfg-${JSON.stringify(settings)}");
    expect(src).toContain("def-${JSON.stringify(settings)}");
    expect(src).not.toContain("JSON.stringify(settings).length");
  });
});

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-46 pins (S46-P3), REWRITTEN at session-72 for the
// props-driven ConfigEditor: the F-46c intent (a failed picklist PUT
// leaves no phantom item in the editor) is now STRUCTURAL — the
// editor renders its lists from the settings PROPS (the reference's
// own React-Query architecture), so a 400 never changes what the UI
// shows; the item appears only when the store accepts the PUT. The
// s46-era guarded revert (setLists + reference-equality rollback)
// and the JSON.stringify remount keys (the s46-F46c length-collision
// fix) are both RETIRED by the M-72c1/M-72c4 rewrite: there is no
// local lists copy to roll back and no remount key to collide.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/settings/settings-page.tsx") ?? "");

function configEditor(src: string): string {
  const at = src.indexOf("function ConfigEditor");
  expect(at).toBeGreaterThanOrEqual(0);
  const end = src.indexOf("function DefaultsEditor");
  expect(end).toBeGreaterThan(at);
  return src.slice(at, end);
}

describe("session-46 S46-P3 (rewritten at s72): the settings failure contract — structural", () => {
  it("the ConfigEditor has NO local lists state — the phantom-item class is unreachable", () => {
    const src = configEditor(page());
    // The props-driven contract: the five lists read from the
    // settings snapshot directly (the [] fallback covers the
    // not-yet-fetched state — the reference's data:n=[] initial).
    expect(src).toMatch(/settings\?\.contactSources \?\? \[\]/);
    expect(src).not.toContain("setLists");
    expect(src).not.toContain("useState");
  });

  it("a failed PUT only toasts — the handler never mutates local state (nothing to roll back)", () => {
    const src = configEditor(page());
    // The putList shape: fire the single-key patch, toast on failure.
    // The UI is the store's truth; a 400 leaves the rendered rows
    // exactly as they were.
    expect(src).toMatch(/toast\.error\(\s*"Could not save",\s*res\.error\s*\)/);
    expect(src).not.toMatch(/const prev =/);
    expect(src).not.toMatch(/setLists\(/);
  });

  it("the add/update/delete handlers PUT single-key patches computed from the CURRENT props", () => {
    const src = configEditor(page());
    // The partial-patch form — the route's per-key validation + the
    // full-settings response make the single-key PUT exact.
    expect(src).toMatch(/updateSettings\(\{ \[key\]: next \}\)/);
    // The rename: the index-targeted map.
    expect(src).toMatch(/\.map\(\(x, xi\) => \(xi === i \? name : x\)\)/);
    // The delete: the index filter.
    expect(src).toMatch(/\.filter\(\(_, xi\) => xi !== i\)/);
  });

  it("the remount keys are GONE — no JSON.stringify keys anywhere in the page", () => {
    const src = page();
    expect(src).not.toContain("JSON.stringify(settings)");
    expect(src).not.toContain("cfg-${");
    expect(src).not.toContain("def-${");
  });
});

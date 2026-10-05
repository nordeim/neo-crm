import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-46 pin (S46-P7): the dropdown click containment — the F-46g
// finding (discovered LIVE while verifying S46-P1, reproduced on the
// stashed pre-session code — pre-existing). The custom Dropdown renders
// its items in a Radix Popover portal; React synthetic clicks on portal
// content bubble through the REACT tree to the TableRow's onClick — so
// clicking Edit / View Insights / Delete ALSO opened the row-click
// dialog (accounts: the insights ghost; contacts: the detail
// slide-over, on rows AND cards) — LIVE-verified with a native trusted
// click (two [data-state=open] dialogs after one Edit click). Radix's
// composeEventHandlers does NOT stop propagation (source-verified in
// node_modules/@radix-ui/primitive). The fix: DropdownContent composes
// e.stopPropagation() into its onClick — item handlers run, nothing
// bubbles to clickable ancestors. (No caller passes onClick to
// DropdownContent today — census-verified — and the caller's handler,
// if one ever arrives, still runs first.)

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const dropdown = () => stripComments(read("src/components/ui/dropdown.tsx") ?? "");

describe("session-46: the dropdown content contains its clicks (S46-P7)", () => {
  it("DropdownContent composes stopPropagation into its onClick (menu clicks cannot bubble to the row's onClick)", () => {
    const src = dropdown();
    const at = src.indexOf("function DropdownContent");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 1200);
    // The composed handler preserves a caller's onClick then stops the
    // bubbling — the portal tree must not reach clickable ancestors.
    expect(fn).toMatch(/onClick=\{\(e\) => \{[\s\S]{0,160}props\.onClick\?\.\(e\);[\s\S]{0,200}e\.stopPropagation\(\);[\s\S]{0,80}\}\}/);
    // And the composition must sit AFTER the {...props} spread so it
    // actually owns the prop.
    const spreadAt = fn.indexOf("{...props}");
    const onClickAt = fn.indexOf("onClick={(e) =>");
    expect(spreadAt).toBeGreaterThanOrEqual(0);
    expect(onClickAt).toBeGreaterThan(spreadAt);
  });
});

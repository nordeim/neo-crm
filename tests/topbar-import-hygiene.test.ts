import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-47 pin (S47-P4): the topbar dead-import removal — the N-47g
// audit. The entire Dropdown import block (Dropdown, DropdownContent,
// DropdownItem, DropdownTrigger) was dead: the topbar uses only the
// Menu* family (10 usages) since the account menu migrated to the stock
// primitives. Lint-invisible (no-unused-vars is off in eslint.config.mjs),
// so it survived — the s46-a fresh-eyes census caught it.

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

const topbar = () => stripComments(read("src/components/layout/topbar.tsx") ?? "");

describe("session-47: the topbar import hygiene (S47-P4, N-47g)", () => {
  it("the dead Dropdown import block is gone (the Menu* family remains)", () => {
    const src = topbar();
    // The import block from the dropdown module...
    const importAt = src.indexOf('from "@/components/ui/dropdown"');
    expect(importAt).toBeGreaterThanOrEqual(0);
    const importBlock = src.slice(Math.max(0, src.lastIndexOf("import {", importAt)), importAt);
    // ...carries NONE of the Popover-based Dropdown family...
    expect(importBlock).not.toMatch(/\bDropdown\b/);
    expect(importBlock).not.toMatch(/\bDropdownContent\b/);
    expect(importBlock).not.toMatch(/\bDropdownItem\b/);
    expect(importBlock).not.toMatch(/\bDropdownTrigger\b/);
    // ...and still carries the Menu* family the topbar actually uses.
    expect(importBlock).toMatch(/\bMenu\b/);
    expect(importBlock).toMatch(/\bMenuContent\b/);
    expect(importBlock).toMatch(/\bMenuItem\b/);
    expect(importBlock).toMatch(/\bMenuTrigger\b/);
    // No JSX usage of the removed names remains anywhere in the file.
    expect(src).not.toMatch(/<Dropdown/);
    expect(src).not.toMatch(/<DropdownContent/);
    expect(src).not.toMatch(/<DropdownItem/);
    expect(src).not.toMatch(/<DropdownTrigger/);
  });
});

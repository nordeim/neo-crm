import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatMonthYear } from "@/lib/format";

// Session-45 pins (S45-P5): the format.ts hygiene pair — the F-45c +
// F-45d audit findings. (a) Three dead exports — formatCompactNumber,
// monthName, monthShort — carried zero callers in src + tests
// (grep-verified both) yet shipped in the public seam surface; the
// clean-code discipline removes them. (b) formatMonthYear lacked the
// NaN guard every sibling carries — a bad input rendered
// "undefined NaN" instead of the em-dash convention. The behavioral
// pin rides the pure-seam precedent (format.test.ts imports the
// function; the negative pins are source-shape, the dialog-clear-
// parity census precedent).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const src = () => stripComments(read("src/lib/format.ts") ?? "");

describe("session-45: the format.ts dead exports are gone (S45-P5)", () => {
  it("formatCompactNumber is no longer exported (zero callers — removed)", () => {
    expect(src()).not.toMatch(/export function formatCompactNumber/);
  });

  it("monthName is no longer exported (zero callers — removed)", () => {
    expect(src()).not.toMatch(/export function monthName/);
  });

  it("monthShort is no longer exported (zero callers — removed)", () => {
    expect(src()).not.toMatch(/export function monthShort/);
  });
});

describe("session-45: formatMonthYear carries the sibling NaN guard (S45-P5)", () => {
  it("a bad input returns the em-dash (the sibling convention), never 'undefined NaN'", () => {
    expect(formatMonthYear("not-a-date")).toBe("—");
    expect(formatMonthYear(Number.NaN)).toBe("—");
  });

  it("the happy path is unchanged (Month YYYY)", () => {
    expect(formatMonthYear(new Date(2026, 9, 3))).toBe("October 2026");
  });
});

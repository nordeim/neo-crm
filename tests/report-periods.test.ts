import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-25 period vocabulary pins (S25-P6): the reference's period
// combobox ships SIX options — Today / This Week / This Month /
// This Quarter / YTD / All Time (its expanded listbox, live-probed) —
// with the SHORT internal values today/week/month/quarter/ytd/all
// (today/quarter/ytd each verified live via saved-report localStorage
// probes; week/month/all inferred from the pattern). Our clone shipped
// FIVE options (This Week … This Year … All Time) with this_* ids —
// the Today + YTD options were missing and This Year stood in for YTD.
//
// The vocabulary change also makes the saved-report dateRange values
// byte-faithful (S25-P4 stores the period state directly).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-25: the reports period vocabulary (S25-P6)", () => {
  it("REPORT_PERIODS is the reference's 6-entry set with the short ids", () => {
    const code = stripComments(read("src/lib/constants.ts")!);
    const m = code.match(/export const REPORT_PERIODS[\s\S]+?\] as const;/);
    expect(m).toBeTruthy();
    const ids = [...m![0].matchAll(/\{ id: "([^"]+)", label: "([^"]+)" \}/g)].map(
      (x) => `${x[1]}|${x[2]}`,
    );
    expect(ids).toEqual([
      "today|Today",
      "week|This Week",
      "month|This Month",
      "quarter|This Quarter",
      "ytd|YTD",
      "all|All Time",
    ]);
  });

  it("the API periodStart maps today + ytd (and retires this_year)", () => {
    const code = stripComments(read("src/app/api/reports/route.ts")!);
    expect(code).toMatch(/case "today":/);
    expect(code).toMatch(/case "ytd":/);
    expect(code).not.toMatch(/case "this_year":/);
    expect(code).not.toMatch(/this_quarter/);
  });

  it("the reports page defaults to the quarter period", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    expect(code).toMatch(/useState\("quarter"\)/);
    expect(code).not.toMatch(/this_quarter/);
  });
});

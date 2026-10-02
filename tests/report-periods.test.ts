import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-25 period vocabulary pins (S25-P6), CORRECTED session-32
// (S32-P4): the reference's period combobox ships SIX options — Today /
// This Week / This Month / This Quarter / YTD / All Time (its expanded
// listbox, live-probed). The s25 ids were today/week/month/quarter/ytd/all
// — today/quarter/ytd live-verified via saved-report localStorage probes,
// but week/month were INFERRED from the pattern. The session-32 bundle
// decode (index-DZ-xbrIm.js, the i3e reports filter) proves the wire ids
// are today/thisWeek/thisMonth/quarter/ytd/all — the two inferences were
// wrong; the labels never changed.
//
// The vocabulary change keeps the saved-report dateRange values
// byte-faithful (S25-P4 stores the period state directly) and
// normalizeSavedPeriod() (S32-P4) migrates stale localStorage entries.

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

describe("session-25: the reports period vocabulary (S25-P6, ids corrected S32-P4)", () => {
  it("REPORT_PERIODS is the reference's 6-entry set with the bundle's wire ids", () => {
    const code = stripComments(read("src/lib/constants.ts")!);
    const m = code.match(/export const REPORT_PERIODS[\s\S]+?\] as const;/);
    expect(m).toBeTruthy();
    const ids = [...m![0].matchAll(/\{ id: "([^"]+)", label: "([^"]+)" \}/g)].map(
      (x) => `${x[1]}|${x[2]}`,
    );
    expect(ids).toEqual([
      "today|Today",
      "thisWeek|This Week",
      "thisMonth|This Month",
      "quarter|This Quarter",
      "ytd|YTD",
      "all|All Time",
    ]);
  });

  it("the API periodStart maps the bundle's ids (thisWeek/thisMonth, not week/month)", () => {
    const code = stripComments(read("src/app/api/reports/route.ts")!);
    expect(code).toMatch(/case "today":/);
    expect(code).toMatch(/case "thisWeek":/);
    expect(code).toMatch(/case "thisMonth":/);
    expect(code).toMatch(/case "ytd":/);
    expect(code).not.toMatch(/case "week":/);
    expect(code).not.toMatch(/case "month":/);
  });

  it("the export route's periodStart carries the same wire ids", () => {
    const code = stripComments(read("src/app/api/export/route.ts")!);
    expect(code).toMatch(/case "thisWeek":/);
    expect(code).toMatch(/case "thisMonth":/);
    expect(code).not.toMatch(/case "week":/);
    expect(code).not.toMatch(/case "month":/);
  });

  it("the reports page defaults to the quarter period", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    expect(code).toMatch(/useState\("quarter"\)/);
  });
});

describe("session-32: the legacy period-id migration (S32-P4)", () => {
  it("normalizeSavedPeriod maps the s25 legacy ids and rejects unknowns", async () => {
    const mod = await import("../src/lib/saved-reports");
    const { normalizeSavedPeriod } = mod as { normalizeSavedPeriod: (raw: string) => string };
    // legacy s25 ids → the bundle's wire ids
    expect(normalizeSavedPeriod("week")).toBe("thisWeek");
    expect(normalizeSavedPeriod("month")).toBe("thisMonth");
    // valid ids pass through
    expect(normalizeSavedPeriod("quarter")).toBe("quarter");
    expect(normalizeSavedPeriod("thisWeek")).toBe("thisWeek");
    expect(normalizeSavedPeriod("all")).toBe("all");
    // unknowns fall back to the default period
    expect(normalizeSavedPeriod("bogus")).toBe("quarter");
    expect(normalizeSavedPeriod("")).toBe("quarter");
  });

  it("the reports page's onLoad normalizes the stored dateRange before applying", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    const region = code.slice(code.indexOf("onLoad="), code.indexOf("onLoad=") + 500);
    expect(region).toMatch(/normalizeSavedPeriod/);
    expect(region).toMatch(/setPeriod\(normalizeSavedPeriod\(/);
  });
});

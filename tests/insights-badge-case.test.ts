import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-48 pins (S48-P3): the account-insights badge display-case —
// N-48b, the F-47b seam's remaining half. The s47 fix lowercased the
// icon/tint COMPARISONS (the reference's Capitalized values work in ITS
// storage; ours stores lowercase) but left the type BADGE rendering the
// raw lowercase slug ("call") — while the reference's badge renders ITS
// raw type, which is Capitalized ("Call") in ITS storage. The same
// display the reference renders, from OUR storage, is the house
// display-case idiom: ACTIVITY_TYPE_META[a.type]?.label ?? a.type
// (the byType chart labels at activities-page:192 + the reports
// route's ?.label ?? t form at :224 — call→"Call", email→"Email";
// the META definition at constants.ts:388, s64 refresh). The icon/tint
// comparisons stay
// exactly as s47 shipped them (pinned in insights-vocabulary.test.ts).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-48: the insights badge display-case (S48-P3, N-48b)", () => {
  it("the type badge renders the ACTIVITY_TYPE_META label with the raw fallback", () => {
    const src = stripComments(read("src/components/accounts/account-insights-dialog.tsx") ?? "");
    const region = src.slice(src.indexOf("accountActivities.slice"), src.indexOf("Close Date:"));
    // The house display-case idiom — the same badge text the reference
    // renders with its own Capitalized storage.
    expect(region).toMatch(/ACTIVITY_TYPE_META\[a\.type\]\?\.label \?\? a\.type/);
  });

  it("the raw-slug badge shape is gone", () => {
    const src = stripComments(read("src/components/accounts/account-insights-dialog.tsx") ?? "");
    const region = src.slice(src.indexOf("accountActivities.slice"), src.indexOf("Close Date:"));
    // The raw lowercase slug ("call") no longer reaches the badge
    // directly — the label map owns the display case.
    expect(region).not.toMatch(/className="text-xs">\{a\.type\}<\/Badge>/);
  });
});

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-28 pins (S28-P6): the accounts SURFACES — the table row (the
// Key tier tint, the overdue border + badge, the owner initials, the
// health badge in the Status column), the Ece Account Insights dialog,
// and the Oce filter sidebar alignment. All bundle-extracted.
//
// The decisive contracts:
// - The ROW: cursor-pointer hover:bg-gray-50; Key tier → bg-yellow-50/30;
//   overdue > 0 → border-l-4 border-l-red-500 + the "{N} Overdue"
//   destructive badge + the filled star; the w-10 h-10 bg-blue-100
//   building-icon box; the owner INITIALS box (not our Avatar); the last
//   activity as a DATE ("No activity" fallback); the HEALTH badge under
//   the "Status" header (the reference's own header/cell mismatch,
//   mirrored); the ⋮ Edit/View Insights/Delete + row click → Insights.
// - Ece: max-w-3xl, the 3 stat cards (Total Revenue $X.XM / Open Deals /
//   Contacts), the Recent Activities/Contacts/Open Deals tabs with the
//   type-tinted icon rows.
// - Oce: the Save All ghost + Owner/Industry/Revenue selects + the Tier
//   checkboxes (Key Account/A/B/C) + the blue Filter button.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const insights = () =>
  stripComments(read("src/components/accounts/account-insights-dialog.tsx") ?? "");

describe("session-28: the accounts table row contract", () => {
  it("the row tints: cursor-pointer + Key yellow + overdue red border", () => {
    const src = page();
    expect(src).toMatch(/cursor-pointer/);
    expect(src).toMatch(/hover:bg-gray-50/);
    expect(src).toMatch(/bg-yellow-50\/30/);
    expect(src).toMatch(/border-l-4 border-l-red-500/);
  });

  it("the overdue badge vocabulary: N Overdue (destructive)", () => {
    const src = page();
    expect(src).toMatch(/Overdue/);
    expect(src).toMatch(/destructive|bg-red-|text-red-/);
  });

  it("the Key star (filled yellow)", () => {
    const src = page();
    expect(src).toMatch(/text-yellow-500 fill-yellow-500/);
  });

  it("the w-10 h-10 bg-blue-100 building icon box", () => {
    const src = page();
    expect(src).toMatch(/w-10 h-10 bg-blue-100 rounded-lg/);
  });

  it("the owner initials box (w-6 h-6 bg-blue-100)", () => {
    const src = page();
    expect(src).toMatch(/w-6 h-6 bg-blue-100/);
  });

  it("the last activity date + the No activity fallback", () => {
    const src = page();
    expect(src).toContain("No activity");
  });

  it("the health badge renders in the Status column (the header/cell mismatch)", () => {
    const src = page();
    expect(src).toMatch(/ACCOUNT_HEALTH_BADGE|healthBadge/);
  });

  it("the action menu: Edit / View Insights / Delete + the row click", () => {
    const src = page();
    expect(src).toContain("View Insights");
    expect(src).toContain("Delete");
  });
});

describe("session-28: the Ece Account Insights dialog", () => {
  it("the max-w-3xl max-h-[80vh] shell", () => {
    const src = insights();
    expect(src).toMatch(/max-w-3xl max-h-\[80vh\] overflow-y-auto/);
  });

  it("the header: the account name + industry + the status badge", () => {
    const src = insights();
    expect(src).toMatch(/text-xl/);
    expect(src).toMatch(/bg-green-100 text-green-800/);
    expect(src).toMatch(/bg-gray-100 text-gray-800/);
  });

  it("the three stat cards: Total Revenue / Open Deals / Contacts", () => {
    const src = insights();
    expect(src).toContain("Total Revenue");
    expect(src).toContain("Open Deals");
    expect(src).toContain("Contacts");
    expect(src).toMatch(/grid grid-cols-3 gap-4/);
  });

  it("the revenue formats $X.XM and the open-deals count excludes closed", () => {
    const src = insights();
    expect(src).toMatch(/1e6\)/);
    expect(src).toMatch(/closed_lost/);
  });

  it("the tabs: Recent Activities / Contacts / Open Deals + the empty states", () => {
    const src = insights();
    expect(src).toContain("Recent Activities");
    expect(src).toContain("No recent activities");
    expect(src).toContain("No contacts found");
    expect(src).toContain("No open deals");
  });

  it("the type-tinted activity icon rows (Email=blue, Call=green, else purple)", () => {
    const src = insights();
    expect(src).toMatch(/bg-blue-100 text-blue-600/);
    expect(src).toMatch(/bg-green-100 text-green-600/);
    expect(src).toMatch(/bg-purple-100 text-purple-600/);
  });

  it("the deals rows carry Close Date:", () => {
    const src = insights();
    expect(src).toContain("Close Date:");
  });
});

describe("session-28: the Oce filter sidebar alignment", () => {
  it("the Filters header + the Save All ghost", () => {
    const src = page();
    expect(src).toContain("Save All");
  });

  it("the Owner / Industry / Revenue selects", () => {
    const src = page();
    expect(src).toContain("All Owners");
    expect(src).toContain("All Industries");
    expect(src).toContain("All Revenue");
    expect(src).toContain("$1M - $5M");
    expect(src).toContain("$5M+");
  });

  it("the Tier checkboxes include Key Account", () => {
    const src = page();
    expect(src).toContain("Key Account");
  });

  it("the full-width blue Filter button", () => {
    const src = page();
    expect(src).toMatch(/w-full bg-blue-600 hover:bg-blue-700/);
    expect(src).toContain("Filter");
  });
});

// ---------------------------------------------------------------------------
// Session-32 (S32-P3): the accounts revenue family — the bundle renders
// BOTH the Total Revenue KPI and every revenue cell through the LITERAL
// `$${(v/1e6).toFixed(1)}M` formula (zv KPI + the table cell) — never the
// magnitude-branching compact default. "$0.0M" at zero, "$0.9M" at
// Brightline's seeded 900k, "$77.5M" at the seeded total.
// ---------------------------------------------------------------------------

describe("session-32: the accounts revenue formats (S32-P3)", () => {
  it("the Total Revenue KPI uses the fixed M scale", () => {
    const src = page();
    const kpi = src.slice(src.indexOf('label="Total Revenue"'), src.indexOf('label="Total Revenue"') + 300);
    expect(kpi).toMatch(/scale: "M"/);
  });

  it("the table row's Revenue cell keeps the literal /1e6 formula with the '-' fallback", () => {
    const src = page();
    expect(src).toMatch(/a\.annualRevenue \? `\$\$\{\(a\.annualRevenue \/ 1e6\)\.toFixed\(1\)\}M` : "-"/);
  });

  it("the Cards-view revenue cell uses the fixed M scale too (the S8-3 superset stays format-consistent)", () => {
    const src = page();
    // The cards view renders a.annualRevenue via the seam's M scale —
    // the same convention the reference's table cell uses. Anchor: the
    // `view === "Cards"` conditional (the comment anchor is stripped).
    const cardsRegion = src.slice(src.indexOf('view === "Cards"'), src.indexOf('view === "Cards"') + 8000);
    expect(cardsRegion).toMatch(/scale: "M"/);
  });
});

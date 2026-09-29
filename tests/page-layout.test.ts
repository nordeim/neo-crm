import { describe, expect, it } from "vitest";
import {
  FILTER_BAR,
  FILTER_RAIL,
  PAGE_HEADER,
  PAGE_KPI_GRIDS,
  RAIL_LAYOUT,
  REPORTS_FILTER_BAR,
  TABLE_CARD,
  allLayoutClasses,
} from "@/lib/page-layout";

// Session-6 parity pins: every class string below was extracted from the
// LIVE reference app's DOM (class-list extraction at 1512x945 + 390x844 on
// 2026-09-29), not from screenshots. If the reference changes, re-extract
// and re-pin — do not "fix" these tests to match the code.

describe("KPI grid parity (session-6 DOM-verified)", () => {
  it("every KPI grid starts single-column on phones", () => {
    for (const [page, cls] of Object.entries(PAGE_KPI_GRIDS)) {
      expect(cls, page).toMatch(/^grid grid-cols-1 /);
    }
  });

  it("dashboard / leads / activities: sm:2 lg:3 xl:6 with gap-4 mb-6", () => {
    const expected = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6";
    expect(PAGE_KPI_GRIDS.dashboard).toBe(expected);
    expect(PAGE_KPI_GRIDS.leads).toBe(expected);
    expect(PAGE_KPI_GRIDS.activities).toBe(expected);
  });

  it("accounts breaks at lg:5 (not xl), reports at xl:5", () => {
    expect(PAGE_KPI_GRIDS.accounts).toBe(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6",
    );
    expect(PAGE_KPI_GRIDS.reports).toBe(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6",
    );
  });

  it("contacts uses the md:2 lg:4 ladder; calendar sm:2 lg:4", () => {
    expect(PAGE_KPI_GRIDS.contacts).toBe(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
    );
    expect(PAGE_KPI_GRIDS.calendar).toBe(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
    );
  });
});

describe("page header parity (session-6 DOM-verified)", () => {
  it("standard header stacks on phones (flex-col sm:flex-row, mb-6 gap-4)", () => {
    expect(PAGE_HEADER.standard.row).toBe(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4",
    );
  });

  it("standard title scales text-2xl sm:text-3xl with no tracking tweak", () => {
    expect(PAGE_HEADER.standard.title).toBe("text-2xl sm:text-3xl font-bold text-foreground");
  });

  it("subtitle is base-size (16px) muted text — the reference ships no text-sm", () => {
    expect(PAGE_HEADER.standard.subtitle).toBe("text-muted mt-1");
  });

  it("actions run w-full on phones and gap-2 from sm", () => {
    expect(PAGE_HEADER.standard.actions).toBe("flex gap-2 w-full sm:w-auto");
  });

  it("leads header adds the sm:mb-8 variant", () => {
    expect(PAGE_HEADER.leads.row).toBe(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4",
    );
  });

  it("contacts header is the flat variant: text-3xl title, plain row, gap-3 actions", () => {
    expect(PAGE_HEADER.contacts.row).toBe("flex items-center justify-between mb-6");
    expect(PAGE_HEADER.contacts.title).toBe("text-3xl font-bold text-foreground");
    expect(PAGE_HEADER.contacts.actions).toBe("flex gap-3");
  });
});

describe("rail + table-card layout parity (session-6 DOM-verified)", () => {
  it("accounts/calendar/activities use flex gap-6 with a w-80 rail visible from lg", () => {
    expect(RAIL_LAYOUT.row).toBe("flex gap-6");
    expect(RAIL_LAYOUT.rail).toBe("hidden lg:block w-80");
    expect(RAIL_LAYOUT.railStack).toBe("hidden lg:block w-80 space-y-6");
    // min-w-0 keeps wide tables from squeezing the rail (flexbox
    // min-width:auto default — found live at 1024px during session-6).
    expect(RAIL_LAYOUT.content).toBe("flex-1 min-w-0");
    expect(RAIL_LAYOUT.contentStack).toBe("flex-1 min-w-0 space-y-6");
  });

  it("white table card: rounded-lg shadow (no border) with p-4 border-b toolbar", () => {
    expect(TABLE_CARD.card).toBe("bg-surface rounded-lg shadow");
    expect(TABLE_CARD.toolbar).toBe("p-4 border-b");
    expect(TABLE_CARD.toolbarRow).toBe("flex flex-col sm:flex-row gap-3");
    expect(TABLE_CARD.scrollArea).toBe("overflow-x-auto");
  });
});

describe("filter-bar parity (session-6 DOM-verified)", () => {
  it("dashboard filter bar is a white card that stacks on phones", () => {
    expect(FILTER_BAR.card).toBe("bg-surface rounded-lg shadow mb-6 p-4");
    expect(FILTER_BAR.row).toBe("flex flex-col sm:flex-row gap-3");
    expect(FILTER_BAR.searchWrap).toBe("relative flex-1");
  });

  it("reports filter bar is sticky with border + shadow-md", () => {
    expect(REPORTS_FILTER_BAR.bar).toBe(
      "rounded-xl border border-line bg-surface p-4 mb-6 sticky top-0 z-10 shadow-md",
    );
    expect(REPORTS_FILTER_BAR.row).toBe("flex flex-col lg:flex-row gap-4 items-center");
    expect(REPORTS_FILTER_BAR.selectsWrap).toBe("flex flex-wrap gap-3 flex-1");
    expect(REPORTS_FILTER_BAR.actions).toBe("flex gap-2");
  });

  it("filter rails pin the live card anatomy (header row, labels, actions)", () => {
    // CardHeader keeps its stock column direction — the action row is a
    // CHILD div (cn/tailwind-merge cannot reset flex-col on the header).
    expect(FILTER_RAIL.headerPad).toBe("p-6 pb-3");
    expect(FILTER_RAIL.headerRow).toBe("flex justify-between items-center");
    // Rail titles stay 16px at every breakpoint (they never climb to the
    // sm:text-lg default of the regular card titles).
    expect(FILTER_RAIL.title).toBe("text-base sm:text-base");
    // Calendar's rail action is a blue text link, not a ghost button
    // (accounts/activities use a ghost h-8 "Save All" — Button variant).
    expect(FILTER_RAIL.clearAllLink).toBe(
      "text-xs text-blue-600 hover:text-blue-700 font-normal",
    );
    expect(FILTER_RAIL.body).toBe("p-6 pt-0 space-y-4");
    // Checkbox-group labels sit mb-3; select-group labels sit mb-2 (live DOM).
    expect(FILTER_RAIL.groupLabel).toBe("text-sm font-semibold mb-3 block");
    expect(FILTER_RAIL.groupLabelSelect).toBe("text-sm font-semibold mb-2 block");
    expect(FILTER_RAIL.checkboxStack).toBe("space-y-2");
    expect(FILTER_RAIL.filterButtonWrap).toBe("pt-2");
  });
});

describe("layout regression guards", () => {
  it("guards against de-bracketed arbitrary-value grid classes", () => {
    // Arbitrary-value grid tracks must open with a bracket — a class like
    // `xl:grid-cols-inmax(0,1fr)_260px]` (missing the leading `[m`) is an
    // invalid arbitrary value that Tailwind silently drops, leaving the
    // two-column layout as a silent no-op. Session 6 moved every rail page
    // to the reference's `flex gap-6` + `hidden lg:block w-80` model, so no
    // valid layout class needs this shape either.
    for (const cls of allLayoutClasses()) {
      expect(cls).not.toContain("grid-cols-inmax");
      expect(cls).not.toContain("grid-cols-(");
    }
  });

  it("rail classes hide below lg (reference behavior)", () => {
    expect(RAIL_LAYOUT.rail).toMatch(/hidden lg:block/);
  });
});

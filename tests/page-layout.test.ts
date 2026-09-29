import { describe, expect, it } from "vitest";
import {
  ACTIVITY_CARD,
  DASHBOARD_CARD,
  FILTER_BAR,
  FILTER_RAIL,
  LOGIN_LAYOUT,
  NAV_LAYOUT,
  PAGE_HEADER,
  PAGE_KPI_GRIDS,
  RAIL_LAYOUT,
  REPORTS_FILTER_BAR,
  SETTINGS_PICKLIST,
  SHELL_LAYOUT,
  STAT_CARD,
  TABLE_CARD,
  TOPBAR_LAYOUT,
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

  it("subtitles split by page: base-size (16px) default, text-sm on calendar/reports", () => {
    // Session-7 re-extraction: contacts/leads/settings/profile subtitles are
    // 16px (`text-gray-500 mt-1`), but calendar + reports render
    // `text-gray-500 text-sm mt-1` (14px) — per-page variance.
    expect(PAGE_HEADER.standard.subtitle).toBe("text-muted mt-1");
    expect(PAGE_HEADER.standard.subtitleSm).toBe("text-sm text-muted mt-1");
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

  it("reports bar buttons are h-8 with mr-2 icons; first two selects carry leading icons (session-7 re-pin)", () => {
    // The reference RE-ADDED the Reset button after session 6 and dropped
    // the bar buttons to h-8; the This Quarter / All Owners selects gained
    // calendar/user leading icons inside flex items-center gap-2 wrappers.
    expect(REPORTS_FILTER_BAR.barBtn).toBe("h-8 rounded-md px-3 text-xs");
    expect(REPORTS_FILTER_BAR.barBtnIcon).toBe("h-4 w-4 mr-2");
    expect(REPORTS_FILTER_BAR.selectWrap).toBe("flex items-center gap-2");
    expect(REPORTS_FILTER_BAR.selectIcon).toBe("h-4 w-4 text-muted");
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

describe("app-shell parity (session-7 DOM-verified)", () => {
  it("root is an h-screen flex row — the sidebar is an in-flow flex child from md", () => {
    expect(SHELL_LAYOUT.root).toBe("flex h-screen bg-background");
    // md, NOT lg — verified live at 900px (visible) and 700px (hidden).
    expect(SHELL_LAYOUT.sidebar).toBe("hidden md:flex w-64 bg-sidebar text-white flex-col");
    expect(SHELL_LAYOUT.mainColumn).toBe("flex-1 flex flex-col overflow-hidden");
  });

  it("main is the true scroller (window never scrolls) with a p-4 sm:p-8 inner", () => {
    expect(SHELL_LAYOUT.main).toBe("flex-1 overflow-auto bg-background");
    expect(SHELL_LAYOUT.inner).toBe("p-4 sm:p-8 bg-background min-h-screen");
  });
});

describe("sidebar nav parity (session-7 DOM-verified)", () => {
  it("brand: p-6 gap-3 row, 40px white circle + 24px blue dot, text-2xl wordmark", () => {
    expect(NAV_LAYOUT.brand).toBe("p-6 flex items-center gap-3");
    expect(NAV_LAYOUT.brandLogoOuter).toBe(
      "w-10 h-10 bg-white rounded-full flex items-center justify-center",
    );
    expect(NAV_LAYOUT.brandLogoInner).toBe("w-6 h-6 bg-sidebar rounded-full");
    expect(NAV_LAYOUT.brandWordmark).toBe("text-2xl font-bold");
  });

  it("nav links: px-4 py-3, hover:bg-white/5, active bg-white/10 (no bold bump)", () => {
    expect(NAV_LAYOUT.link).toBe(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/5",
    );
    expect(NAV_LAYOUT.linkActive).toBe(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-white/10",
    );
    // Icons are uniform 20px stroke-2 (no active/inactive stroke variation).
    expect(NAV_LAYOUT.icon).toBe("h-5 w-5");
    expect(NAV_LAYOUT.label).toBe("font-medium");
  });

  it("nav container + groups: space-y-1 stack, footer group pinned bottom via mt-auto", () => {
    expect(NAV_LAYOUT.container).toBe("flex-1 px-3 space-y-1 flex flex-col");
    expect(NAV_LAYOUT.group).toBe("space-y-1");
    expect(NAV_LAYOUT.footerGroup).toBe("mt-auto space-y-1 pt-4 border-t border-white/10");
  });
});

describe("topbar parity (session-7 DOM-verified)", () => {
  it("header is static py-4 with a justify-between inner row", () => {
    expect(TOPBAR_LAYOUT.header).toBe("bg-surface border-b border-line px-4 sm:px-8 py-4");
    expect(TOPBAR_LAYOUT.inner).toBe("flex items-center justify-between gap-4");
  });

  it("search block is hidden below sm, max-w-xl, icon 20px, input h-9 pl-10 bg-gray-50", () => {
    expect(TOPBAR_LAYOUT.searchBlock).toBe("hidden sm:flex flex-1 max-w-xl");
    expect(TOPBAR_LAYOUT.searchWrap).toBe("relative w-full");
    expect(TOPBAR_LAYOUT.searchIcon).toBe("h-5 w-5 text-subtle");
    expect(TOPBAR_LAYOUT.searchInput).toContain("h-9 w-full rounded-md border border-line bg-background pl-10");
  });

  it("mail/bell are rounded-md h-9 w-9 icon buttons hidden below sm", () => {
    expect(TOPBAR_LAYOUT.iconButton).toBe(
      "hidden h-9 w-9 rounded-md text-muted transition-colors hover:bg-line-soft hover:text-foreground sm:inline-flex",
    );
    expect(TOPBAR_LAYOUT.iconClass).toBe("h-5 w-5");
  });

  it("right group gap-2 sm:gap-4; user button is a rectangular ghost h-9", () => {
    expect(TOPBAR_LAYOUT.rightGroup).toBe("flex items-center gap-2 sm:gap-4");
    expect(TOPBAR_LAYOUT.userButton).toBe(
      "flex h-9 items-center gap-1 rounded-md px-4 py-2 transition-colors hover:bg-line-soft sm:gap-2",
    );
    expect(TOPBAR_LAYOUT.userLabel).toBe("hidden text-sm font-medium text-gray-700 sm:inline");
    expect(TOPBAR_LAYOUT.userAvatar).toBe(
      "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-semibold text-sm text-gray-600",
    );
    expect(TOPBAR_LAYOUT.userChevron).toBe("h-4 w-4 text-muted");
  });

  it("user menu is min-w-[8rem] with plain items (no separator, no destructive)", () => {
    expect(TOPBAR_LAYOUT.userMenu).toBe("min-w-[8rem]");
  });
});

describe("login-card parity (session-7 DOM-verified)", () => {
  it("page wrapper is a slate gradient; card is borderless glass with an accent strip", () => {
    expect(LOGIN_LAYOUT.page).toBe(
      "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4",
    );
    expect(LOGIN_LAYOUT.card).toBe(
      "relative overflow-hidden rounded-2xl border-0 bg-white/95 shadow-2xl backdrop-blur-sm",
    );
    expect(LOGIN_LAYOUT.accent).toBe(
      "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200",
    );
  });

  it("inner is centered space-y-6 sm:space-y-8 with p-8 sm:p-10", () => {
    expect(LOGIN_LAYOUT.inner).toBe("p-8 sm:p-10 md:pt-12 md:pb-10 md:px-10");
    expect(LOGIN_LAYOUT.centered).toBe(
      "flex flex-col items-center text-center space-y-6 sm:space-y-8",
    );
  });

  it("title scales text-2xl sm:text-3xl in slate-900; subtitle text-sm sm:text-base", () => {
    expect(LOGIN_LAYOUT.title).toBe("text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight");
    expect(LOGIN_LAYOUT.subtitle).toBe("text-slate-500 text-sm sm:text-base font-medium");
  });

  it("inputs are h-11 sm:h-12 rounded-xl slate-50/50 with pl-10 icons", () => {
    expect(LOGIN_LAYOUT.input).toContain("h-11");
    expect(LOGIN_LAYOUT.input).toContain("sm:h-12");
    expect(LOGIN_LAYOUT.input).toContain("rounded-xl border border-slate-200 bg-slate-50/50 pl-10");
    expect(LOGIN_LAYOUT.label).toBe("text-sm font-medium text-slate-700");
  });

  it("submit is slate-900 h-11 sm:h-12 rounded-xl; footer links are slate-500", () => {
    expect(LOGIN_LAYOUT.submit).toContain("h-11");
    expect(LOGIN_LAYOUT.submit).toContain("sm:h-12");
    expect(LOGIN_LAYOUT.submit).toContain("bg-slate-900");
    expect(LOGIN_LAYOUT.submit).toContain("hover:bg-slate-800");
    expect(LOGIN_LAYOUT.footer).toBe(
      "flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0",
    );
  });
});

describe("stat/card header parity (session-7 DOM-verified)", () => {
  it("TrendStatCard: p-4 body, mb-3 top row, 40px -50 chips, green-600 trend", () => {
    expect(STAT_CARD.card).toBe("rounded-xl border border-line bg-surface shadow");
    expect(STAT_CARD.body).toBe("p-4");
    expect(STAT_CARD.topRow).toBe("flex items-start justify-between mb-3");
    expect(STAT_CARD.chip).toBe("w-10 h-10 rounded-lg flex items-center justify-center");
    expect(STAT_CARD.chipIcon).toBe("h-5 w-5");
    expect(STAT_CARD.trend).toBe("flex items-center gap-1 text-xs text-green-600");
    expect(STAT_CARD.trendIcon).toBe("h-3 w-3");
    expect(STAT_CARD.value).toBe("text-2xl font-bold text-foreground");
    expect(STAT_CARD.label).toBe("text-xs text-muted mt-1");
  });

  it("activities card headers: h2 text-lg titles, mb-4/mb-6 rows, ••• text button", () => {
    expect(ACTIVITY_CARD.title).toBe("text-lg font-semibold text-foreground");
    expect(ACTIVITY_CARD.priorityRow).toBe("flex items-center justify-between mb-4");
    expect(ACTIVITY_CARD.timelineRow).toBe("flex items-center justify-between mb-6");
    expect(ACTIVITY_CARD.dotsLabel).toBe("•••");
    // Empty states: Timeline py-12, Priority panels py-8 — both base-size 16px.
    expect(ACTIVITY_CARD.emptyTimeline).toBe("text-center py-12 text-muted");
    expect(ACTIVITY_CARD.emptyPanel).toBe("text-center py-8 text-muted");
  });

  it("dashboard card-header buttons: blue ghost h-8 Adds, h-8 w-8 ellipsis", () => {
    expect(DASHBOARD_CARD.addBtn).toBe("h-8 px-3 text-xs text-primary");
    expect(DASHBOARD_CARD.addIcon).toBe("h-4 w-4 mr-1");
    expect(DASHBOARD_CARD.ellipsisBtn).toBe("h-8 w-8");
  });

  it("settings picklists: space-y-2 mb-4 items, plain text-sm empty state", () => {
    expect(SETTINGS_PICKLIST.items).toBe("space-y-2 mb-4");
    expect(SETTINGS_PICKLIST.empty).toBe("text-sm text-muted text-center py-4");
    expect(SETTINGS_PICKLIST.addRow).toBe("flex gap-2");
    // The reference's placeholder typo on the Industries card is mirrored.
    expect(SETTINGS_PICKLIST.industriesPlaceholder).toBe("Add new industrie");
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

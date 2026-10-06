import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ACTIVITY_CARD,
  BY_TYPE_CARD,
  CALENDAR_CELL,
  CARD_TITLE_OVERRIDE,
  DIALOG_TITLE,
  ACTIVITY_QUICKLOG,
  ACCOUNT_DIALOG,
  ACTIVITY_DIALOG,
  BUTTON_BASE,
  CARD,
  CHECKBOX,
  CONTACT_AVATAR,
  CONTACT_DIALOG,
  DASHBOARD_CARD,
  DASHBOARD_HEADER,
  DELTA_TEXT,
  DIALOG_BARE_GROUP,
  DIALOG_CLOSE,
  DIALOG_CONTENT,
  DIALOG_FOOTER,
  DIALOG_FOOTER_WIDE,
  DIALOG_GROUP,
  DIALOG_HEADER,
  DIALOG_OVERLAY,
  DIALOG_SUBMIT,
  DIALOG_TEXTAREA,
  DIALOG_FIELDS_WRAPPER,
  EVENT_DIALOG,
  LEAD_DIALOG,
  EMPTY_STATE,
  FILTER_BAR,
  FILTER_RAIL,
  INPUT_BASE,
  KPI_CARD,
  KPI_CHIP_BG,
  KPI_SPARK,
  KPI_VALUE,
  LEADS_FILTERS_POPOVER,
  LEADS_TOOLBAR,
  LOGIN_LAYOUT,
  MENU_CONTENT,
  MENU_ITEM,
  MOBILE_NAV_LAYOUT,
  NAV_LAYOUT,
  NOT_FOUND_LAYOUT,
  PAGE_HEADER,
  PAGE_KPI_GRIDS,
  PAGE_ROOT,
  PAGE_TITLES,
  CALENDAR_CARD,
  SEARCH_INPUT,
  SELECT_TRIGGER,
  CHART_GEOMETRY,
  CONTACTS_LAYOUT,
  PROFILE_LAYOUT,
  RAIL_LAYOUT,
  RECENT_DEALS,
  REPORTS_FILTER_BAR,
  REPORTS_TABLE_CARD,
  SETTINGS_DEFAULTS,
  SETTINGS_DANGER,
  SETTINGS_DATA,
  SETTINGS_GRID,
  SETTINGS_PICKLIST,
  SHELL_LAYOUT,
  STAT_CARD,
  STAT_SHADOWS,
  TABS_PILL,
  TABS_SEGMENTED,
  TABLE_SHADOWS,
  TABLE_CARD,
  TABLE_TOOLBAR,
  TOP_REPS,
  TOPBAR_LAYOUT,
  VIEW_SWITCHER,
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
    // Session-13 re-pin (S13-P9): the reference's h1s are EXPLICIT
    // text-gray-900 (#111827) — the default foreground flipped to #0a0a0a
    // this session, so the h1s must not ride text-foreground.
    expect(PAGE_HEADER.standard.title).toBe("text-2xl sm:text-3xl font-bold text-gray-900");
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
    // Session-13 re-pin (S13-P9): explicit text-gray-900 like every h1.
    expect(PAGE_HEADER.contacts.title).toBe("text-3xl font-bold text-gray-900");
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
    // Session-12 (S12-P3): the reference's filter card border is EXPLICIT
    // border-gray-200 — the strong token, not the #e5e5e5 default.
    expect(REPORTS_FILTER_BAR.bar).toBe(
      "rounded-xl border border-line-strong bg-surface p-4 mb-6 sticky top-0 z-10 shadow-md",
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
    // Session-13 re-pin (S13-P6): the reference's filter titles are plain
    // `text-base` (no sm: step) — the redundant sm:text-base retired.
    expect(FILTER_RAIL.title).toBe("text-base");
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

  it("main is the true scroller (window never scrolls); padding belongs to the PAGE roots", () => {
    expect(SHELL_LAYOUT.main).toBe("flex-1 overflow-auto bg-background");
    // Session-16 (S16-P1/P2): the blanket SHELL_LAYOUT.inner wrapper is
    // RETIRED — the reference's pages own their padding (PAGE_ROOT), and
    // the shell wrapper double-padded the contacts full-height layout
    // (16px extra per side at 390; main scrolled 37px instead of the
    // 5px mirrored topbar quirk). The s13 "plain p-4 sm:p-8 inner" pin
    // was a shell-level read of what are actually PER-PAGE roots.
    expect("inner" in SHELL_LAYOUT).toBe(false);
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

  it("search block is hidden below sm, max-w-xl, icon 20px; input = stock Input + extras", () => {
    expect(TOPBAR_LAYOUT.searchBlock).toBe("hidden sm:flex flex-1 max-w-xl");
    expect(TOPBAR_LAYOUT.searchWrap).toBe("relative w-full");
    expect(TOPBAR_LAYOUT.searchIcon).toBe("h-5 w-5 text-subtle");
    // Session-10 (S10-3): the search pill is the shared (stock) Input +
    // SEARCH_INPUT.extras (pl-10 bg-gray-50 border-gray-200) — the
    // reference's exact construction (12px right padding from the stock
    // px-3 base, keyboard-only focus, ink/placeholder tokens).
    expect(TOPBAR_LAYOUT.searchInput).toBe("use shared Input + SEARCH_INPUT.extras");
  });

  it("mail/bell are rounded-md h-9 w-9 icon buttons hidden below sm", () => {
    // Session-11 (S11-P10): the reference ships `sm:flex` here (computed
    // display: flex); the s7 pin recorded our sm:inline-flex variant —
    // aligned to the reference's exact class this session.
    expect(TOPBAR_LAYOUT.iconButton).toBe(
      "hidden h-9 w-9 rounded-md text-muted transition-colors hover:bg-line-soft hover:text-foreground sm:flex",
    );
    expect(TOPBAR_LAYOUT.iconClass).toBe("h-5 w-5");
  });

  it("right group gap-2 sm:gap-4; user button is the stock ghost Button composition (S17-P1)", () => {
    expect(TOPBAR_LAYOUT.rightGroup).toBe("flex items-center gap-2 sm:gap-4");
    // Session-17 (S17-P1): the reference's trigger is the STOCK ghost
    // Button — `justify-center whitespace-nowrap rounded-md text-sm
    // font-medium transition-colors focus-visible:ring-1
    // focus-visible:ring-ring … hover:bg-accent
    // hover:text-accent-foreground h-9 px-4 py-2` + `flex items-center
    // gap-1 sm:gap-2` (tailwind-merge replacing inline-flex/gap-2). The
    // button now renders via <Button variant="ghost"> — this className
    // only adds the flex/gap composition + neutralizes the iconGap's
    // trailing-chevron margin (the reference's chevron carries NO mr-2).
    expect(TOPBAR_LAYOUT.userButton).toBe(
      "flex items-center gap-1 sm:gap-2 [&_svg]:mr-0",
    );
    expect(TOPBAR_LAYOUT.userLabel).toBe("hidden text-sm font-medium text-gray-700 sm:inline");
    // Session-17 (S17-P1): the reference ships the STOCK two-level
    // Avatar — root (stock Avatar shape, w-8 h-8) + fallback div (stock
    // AvatarFallback shape with the bg-gray-200/gray-600/text-sm
    // literals). Ours was a ONE-level hand-written span.
    expect(TOPBAR_LAYOUT.userAvatarRoot).toBe(
      "relative flex shrink-0 overflow-hidden rounded-full w-8 h-8",
    );
    expect(TOPBAR_LAYOUT.userAvatarFallback).toBe(
      "w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm",
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
    // Session-70 (F-70a1): the bare family form — the text-foreground
    // retired (the s69 F-69a1 precedent; the stat-value-contract
    // session-70 describe pins the retirement).
    expect(STAT_CARD.value).toBe("text-2xl font-bold");
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

describe("session-8 parity pins (DOM-verified 2026-09-30)", () => {
  it("mobile-nav auto-close query matches the drawer's md range (768px, not lg)", () => {
    // S8-P1: session-7 moved the drawer from lg to md but left the
    // auto-close media listener at 1024px — resizing from 700 to 800px with
    // the drawer open left body+main scroll-locked with the drawer hidden.
    expect(MOBILE_NAV_LAYOUT.autoCloseQuery).toBe("(min-width: 768px)");
    expect(MOBILE_NAV_LAYOUT.autoCloseQuery).not.toContain("1024");
    // The drawer/trigger hide from md — the query must fire at the SAME
    // breakpoint (symmetrical breakpoint strategy).
    expect(MOBILE_NAV_LAYOUT.drawerRange).toBe("md:hidden");
  });

  it("dashboard primary Export carries an always-visible label (bare text node)", () => {
    // S8-1: the reference's third header button renders the label as a BARE
    // text node — NOT wrapped in `hidden sm:inline` like the outline Export.
    expect(DASHBOARD_HEADER.primaryExportLabel).toBe("Export");
    expect(DASHBOARD_HEADER.primaryExportLabelClass).toBe("");
  });

  it("view switcher: w-full sm:w-32 trigger, empty default label, Table/Cards", () => {
    // S8-2/S8-3: the reference's Table/Cards switcher renders with an EMPTY
    // placeholder (never set — dead on the reference); ours keeps the empty
    // default but switches the view for real.
    expect(VIEW_SWITCHER.trigger).toBe("w-full sm:w-32");
    expect(VIEW_SWITCHER.emptyLabel).toBe("");
    expect(VIEW_SWITCHER.options).toEqual(["Table", "Cards"]);
  });

  it("accounts table toolbar: switcher + density select + More before the search", () => {
    // S8-3: [Table select][Standard/Detailed select (empty, dead)][More
    // outline h-8 dead] then the search and Export CSV.
    expect(TABLE_TOOLBAR.row).toBe("flex flex-col sm:flex-row gap-3");
    expect(TABLE_TOOLBAR.select).toBe("w-full sm:w-32");
    expect(TABLE_TOOLBAR.densityOptions).toEqual(["Standard", "Detailed"]);
    expect(TABLE_TOOLBAR.moreBtn).toBe("h-8 rounded-md px-3 text-xs");
  });

  it("leads search uses the contacts anatomy: w-5 icon + pl-10 input", () => {
    // S8-4: the reference's leads search icon is w-5 h-5 with pl-10 —
    // identical to contacts (ours was h-4 w-4 + pl-9).
    expect(LEADS_TOOLBAR.searchIcon).toBe("h-5 w-5");
    expect(LEADS_TOOLBAR.searchInput).toContain("pl-10");
    expect(LEADS_TOOLBAR.searchInput).not.toContain("pl-9");
  });

  it("leads Filters popover: w-80 p-4, four fields, Clear + Save View h-9 flex-1", () => {
    // S8-5: the reference's Filters button opens a Radix Popover (not an
    // inline expander) with Status/Source/Min Deal Value/Follow-up Date.
    expect(LEADS_FILTERS_POPOVER.trigger).toBe("h-9 w-full sm:w-auto");
    expect(LEADS_FILTERS_POPOVER.triggerIcon).toBe("h-4 w-4 mr-2");
    expect(LEADS_FILTERS_POPOVER.content).toBe("w-80 p-4");
    expect(LEADS_FILTERS_POPOVER.stack).toBe("space-y-4");
    expect(LEADS_FILTERS_POPOVER.fieldLabel).toBe("text-sm font-medium mb-2 block");
    expect(LEADS_FILTERS_POPOVER.select).toBe("h-9 w-full");
    expect(LEADS_FILTERS_POPOVER.numberInput).toBe("h-9 w-full");
    expect(LEADS_FILTERS_POPOVER.dateInput).toBe("h-9 w-full");
    expect(LEADS_FILTERS_POPOVER.footer).toBe("flex gap-2 pt-2");
    expect(LEADS_FILTERS_POPOVER.footerBtn).toBe("flex-1 h-9 px-4 py-2");
    expect(LEADS_FILTERS_POPOVER.footerIcon).toBe("h-4 w-4 mr-2");
  });

  it("leads Filters popover vocabularies (DOM-pinned option lists)", () => {
    // Status uses the 6-value filter list; Source has FIVE options — the
    // popover's Referral is absent from the 4-option create dialog.
    expect(LEADS_FILTERS_POPOVER.statusOptions).toEqual([
      "All Status",
      "New",
      "Contacted",
      "Qualified",
      "Won",
      "Lost",
    ]);
    expect(LEADS_FILTERS_POPOVER.sourceOptions).toEqual([
      "All Sources",
      "Call",
      "Email",
      "Website",
      "Partner",
      "Referral",
    ]);
  });

  it("Log WhatsApp is a SOLID emerald button (reference regression since session 6)", () => {
    // S8-6: bg-emerald-600 hover:bg-emerald-700 + shadow on the live
    // reference — the session-6 "ghost" pin is stale.
    expect(ACTIVITY_QUICKLOG.whatsapp).toBe(
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow",
    );
  });

  it("settings picklist add buttons are dark neutral-900 (reference bg-primary = rgb(23,23,23))", () => {
    // S8-7: the reference's `bg-primary` resolves to the STOCK shadcn
    // zinc-950 (computed rgb(23,23,23)), not the app's blue-600 token.
    expect(SETTINGS_PICKLIST.addButton).toBe(
      "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 shadow h-9 px-4 py-2",
    );
  });
});

// ---------------------------------------------------------------------------
// Session-9 pins: component anatomy (buttons, inputs, card titles, dialog
// submits, empty states, table cards) — every value DOM-verified against
// the live reference at 1512x945 on 2026-09-30 (computed-style probes where
// noted). See docs/plans/2026-09-30-session9-parity-remediation.md.
// ---------------------------------------------------------------------------
describe("session-9 component-anatomy pins", () => {
  it("settings header is the PLAIN variant (no flex row, non-responsive h1)", () => {
    // S9-4: the reference's settings page has no header buttons, so its
    // header is a plain `mb-6` div with a text-3xl h1 (no sm: downshift).
    expect(PAGE_HEADER.settings.row).toBe("mb-6");
    // Session-13 re-pin (S13-P9): explicit text-gray-900 like every h1.
    expect(PAGE_HEADER.settings.title).toBe("text-3xl font-bold text-gray-900");
    expect(PAGE_HEADER.settings.subtitle).toBe("text-muted mt-1");
    expect(PAGE_HEADER.settings.noActionsWrap).toBe(true);
  });

  it("leads header actions stack below sm and both buttons stretch", () => {
    // S9-5: flex-col sm:flex-row + per-button w-full sm:w-auto.
    expect(PAGE_HEADER.leads.actions).toBe("flex flex-col sm:flex-row gap-2 w-full sm:w-auto");
    expect(PAGE_HEADER.leads.buttonStretch).toBe("w-full sm:w-auto");
  });

  it("activities quick-log group wraps", () => {
    // S9-6: flex-wrap on the reference (4 buttons wrap, not squeeze).
    expect(PAGE_HEADER.activities.actions).toBe("flex flex-wrap gap-2 w-full sm:w-auto");
  });

  it("button base: 16px icon-text gap + 1px near-black focus ring", () => {
    // S9-1: reference icons carry mr-2 ON TOP of gap-2 (measured 16px vs
    // our 8px); icon-only buttons get no margin (only-child guard).
    // S9-16: ring-1 ring-ring focus (reference --ring = 0 0% 3.9%).
    expect(BUTTON_BASE.iconGap).toBe("[&_svg]:mr-2 [&_svg:only-child]:mr-0");
    expect(BUTTON_BASE.focusRing).toBe("focus-visible:ring-1 focus-visible:ring-ring");
  });

  it("input base: 16px below md + 1px near-black focus ring", () => {
    // S9-12: the reference's stock Input is text-base md:text-sm (16px on
    // phones). S9-16: ring-1 focus, border color unchanged.
    // Session-10 (S10-2/S10-3) refinement: the ring is keyboard-only
    // (focus-visible:) and drops the border-color change — see the
    // session-10 block for the full stock base.
    expect(INPUT_BASE.size).toBe("text-base md:text-sm");
    expect(INPUT_BASE.focusRing).toBe(
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    );
  });

  it("dialog submit buttons are DARK neutral-900 (reference stock --primary)", () => {
    // S9-2: computed rgb(23,23,23) on Create Lead / Create Account / Log
    // Activity — same family as the session-8 settings add buttons. Header
    // primary buttons stay blue-600 (bg-primary token).
    expect(DIALOG_SUBMIT.button).toBe(
      "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 shadow h-9 px-4 py-2",
    );
  });

  it("card titles: div.font-semibold classes, no explicit foreground", () => {
    // S9-3: the reference renders card titles as divs (no heading
    // semantics) inheriting the foreground color.
    // Session-13 re-pin (S13-P6): the CardTitle DEFAULT is the STOCK
    // string (the reports + profile surfaces); the bigger variants ride
    // CARD_TITLE_OVERRIDE at the call sites (dashboard/leads text-base
    // sm:text-lg, filters/by-type text-base, settings text-lg).
    expect(CARD.title).toBe("font-semibold leading-none tracking-tight");
  });

  it("Recent Deals: EIGHT headers incl. the duplicate Status quirk + empty tbody", () => {
    // S9-9: the reference renders Status twice (visible quirk, mirrored
    // per the strict-mirror precedent) and an EMPTY tbody at zero rows.
    expect(RECENT_DEALS.headers).toEqual([
      "Lead",
      "Company",
      "Deal Value",
      "Status",
      "Owner",
      "Close Date",
      "Status",
      "",
    ]);
    expect(RECENT_DEALS.emptyTbody).toBe(true);
  });

  it("empty-state anatomy per surface", () => {
    // S9-10: (a) dashboard Upcoming = text-sm py-4; (b) Lead Sources
    // renders an empty container (no paragraph); (c) calendar = py-8 with
    // inherited 16px; (d) reports = IN-TABLE rows without vertical padding.
    expect(EMPTY_STATE.dashboardList).toBe("py-4 text-center text-sm text-muted");
    expect(EMPTY_STATE.calendar).toBe("text-center py-8 text-muted");
    expect(EMPTY_STATE.reportsRow).toBe("text-center text-muted");
    expect(EMPTY_STATE.leadSourcesEmptyContainer).toBe(true);
  });

  it("Top Performing Sales Reps is a div list with a bordered header row", () => {
    // S9-17: div.space-y-4 > flex items-center justify-between text-xs
    // text-gray-500 pb-2 border-b — Sales Rep left, Deals/Owner right in
    // a flex gap-8 (not a real table).
    expect(TOP_REPS.headerRow).toBe(
      "flex items-center justify-between text-xs text-muted pb-2 border-b",
    );
    expect(TOP_REPS.colRight).toBe("flex gap-8");
  });

  it("reports table cards inset their tables (p-6 pt-0)", () => {
    // S9-11: the reference's reports tables sit inside 24px gutters —
    // not flush like the accounts/leads table cards.
    expect(REPORTS_TABLE_CARD.content).toBe("p-6 pt-0");
  });

  it("profile card surface: buttons, avatar, placeholder, wrappers", () => {
    // S9-8: outline default-size Upload Photo + stretched buttons, avatar
    // primitive with a stroke-2 user icon, plain name wrapper (parent
    // carries p-6), space-y column, no h-fit on the card, and the
    // "Enter your full name" placeholder.
    expect(PROFILE_LAYOUT.uploadBtn).toBe("w-full sm:w-auto");
    expect(PROFILE_LAYOUT.saveBtn).toBe("w-full sm:w-auto");
    expect(PROFILE_LAYOUT.avatarIcon).toBe("h-10 w-10 sm:h-12 sm:w-12");
    expect(PROFILE_LAYOUT.avatarIconStroke).toBe(2);
    expect(PROFILE_LAYOUT.nameWrap).toBe("flex flex-col items-center text-center");
    expect(PROFILE_LAYOUT.columnWrap).toBe("space-y-4 sm:space-y-6");
    expect(PROFILE_LAYOUT.card).toBe("rounded-xl border border-line bg-surface shadow");
    expect(PROFILE_LAYOUT.namePlaceholder).toBe("Enter your full name");
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

  it("the sweep covers every exported class-string group (N-63c, s63)", () => {
    // The s63 extension: STAT_SHADOWS, TABLE_SHADOWS, MENU_CONTENT/
    // MENU_ITEM, BUTTON_BASE, CHECKBOX, INPUT_BASE, SELECT_TRIGGER,
    // SEARCH_INPUT, the DIALOG chrome family (HEADER/OVERLAY/CLOSE/
    // FOOTER/FOOTER_WIDE/TITLE/TEXTAREA/SUBMIT/BARE_GROUP), PAGE_ROOT,
    // CALENDAR_CARD, CARD, CONTACTS_LAYOUT, PROFILE_LAYOUT,
    // REPORTS_TABLE_CARD, SETTINGS_GRID, KPI_VALUE, KPI_SPARK,
    // PIPELINE_LEGEND, TOP_REPS, EMPTY_STATE joined the sweep — the
    // ~30 groups the "Every exported class string" claim promised but
    // the list never carried (the 62-a#4 coverage class). The
    // vocabulary/data groups (PAGE_TITLES, RECENT_DEALS, KPI_STATICS)
    // and the numeric CHART_GEOMETRY stay out, documented in the
    // sweep's own comment. Representatives unique to the additions:
    expect(allLayoutClasses()).toContain("shadow");
    expect(allLayoutClasses()).toContain(DIALOG_OVERLAY);
    expect(allLayoutClasses()).toContain(MENU_CONTENT);
    expect(allLayoutClasses()).toContain(INPUT_BASE.size);
    expect(allLayoutClasses()).toContain(STAT_SHADOWS.kpiHover);
  });

  it("rail classes hide below lg (reference behavior)", () => {
    expect(RAIL_LAYOUT.rail).toMatch(/hidden lg:block/);
  });
});

describe("session-10 stock-primitive pins (DOM-verified 2026-09-30)", () => {
  it("input base matches the reference's stock Input internals", () => {
    // S10-2: the reference's stock Input is `bg-transparent` (NO bg class),
    // carries NO text color class (typed text inherits its --foreground
    // #0a0a0a — pinned as --color-ink) and `placeholder:text-muted-foreground`
    // (#737373 — pinned as --color-muted-ink). Ours shipped bg-white +
    // text-foreground (#111827) + placeholder #9ca3af.
    expect(INPUT_BASE.bg).toBe("bg-transparent");
    expect(INPUT_BASE.ink).toBe("text-ink");
    expect(INPUT_BASE.placeholder).toBe("placeholder:text-muted-ink");
    expect(INPUT_BASE.transition).toBe("transition-colors");
  });

  it("input focus uses focus-visible (keyboard-only), not focus:", () => {
    // S10-2/S10-3: the reference's stock base uses `focus-visible:` on both
    // the outline-none and the ring — the ring does NOT fire on mouse click.
    // The topbar search on ours fired on click (focus:).
    expect(INPUT_BASE.focusRing).toBe(
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    );
  });

  it("select trigger matches the stock shadcn trigger (rounded-md, no gap, transparent, auto width)", () => {
    // S10-2: the reference's Select trigger is stock: rounded-md (6px, not
    // our 8px rounded-lg), NO gap-2 (justify-between only), bg-transparent,
    // placeholder #737373, and NO base w-full (the reference adds w-full
    // per-surface: 270px rail selects yes / 128px toolbar selects no).
    expect(SELECT_TRIGGER.base).toBe(
      "flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink shadow-sm transition-colors placeholder:text-muted-ink",
    );
    expect(SELECT_TRIGGER.base).not.toContain("w-full");
    expect(SELECT_TRIGGER.base).not.toContain("gap-2");
    expect(SELECT_TRIGGER.placeholderState).toBe("data-[placeholder]:text-muted-ink");
  });

  it("the topbar search is the stock Input + pl-10 gray-50 extras (12px right padding)", () => {
    // S10-3: the reference's search pill = the stock Input base + `pl-10
    // bg-gray-50 border-gray-200`; the stock `px-3 py-1` base leaves a 12px
    // right padding (ours was pr-4 = 16px). Focus is keyboard-only.
    expect(SEARCH_INPUT.extras).toBe("pl-10 bg-gray-50 border-gray-200");
    expect(SEARCH_INPUT.usesStockInput).toBe(true);
  });

  it("per-page document titles follow the reference's Page | NEO CRM scheme", () => {
    // S10-10: the reference titles every non-dashboard page "X | NEO CRM";
    // the dashboard and login stay "NEO CRM".
    expect(PAGE_TITLES.dashboard).toBe("NEO CRM");
    expect(PAGE_TITLES.accounts).toBe("Accounts | NEO CRM");
    expect(PAGE_TITLES.contacts).toBe("Contacts | NEO CRM");
    expect(PAGE_TITLES.leads).toBe("Leads | NEO CRM");
    expect(PAGE_TITLES.calendar).toBe("Calendar | NEO CRM");
    expect(PAGE_TITLES.activities).toBe("Activities | NEO CRM");
    expect(PAGE_TITLES.reports).toBe("Reports | NEO CRM");
    expect(PAGE_TITLES.settings).toBe("Settings | NEO CRM");
    expect(PAGE_TITLES.profile).toBe("Profile | NEO CRM");
  });
});

describe("session-11 stat-card shadow + chart geometry pins (DOM-verified 2026-09-30)", () => {
  it("every stat-card family carries the reference's bare shadow (not the tiny shadow-sm)", () => {
    // S11-P2: the reference's stat cards compute 0 1px 3px 0.1 (bare
    // `shadow`) on ALL families — dashboard KPI, reports KPI, accounts,
    // leads, activities, calendar AND the contacts gradient cards. Our
    // IconStatCard (both variants) + CircleStatCard shipped the
    // s9-re-pinned tiny `shadow-sm` (0 1px 2px 0.05) — one step too
    // light. KpiCard/BarStatCard/TrendStatCard were already correct.
    expect(STAT_SHADOWS.kpiCard).toBe("shadow");
    expect(STAT_SHADOWS.barStatCard).toBe("shadow");
    expect(STAT_SHADOWS.trendStatCard).toBe("shadow");
    expect(STAT_SHADOWS.iconStatLeads).toBe("shadow");
    expect(STAT_SHADOWS.iconStatContacts).toBe("shadow");
    expect(STAT_SHADOWS.circleStat).toBe("shadow");
    expect(STAT_SHADOWS.iconStatLeads).not.toContain("shadow-sm");
    expect(STAT_SHADOWS.circleStat).not.toContain("shadow-sm");
  });

  it("the reports KPI cards hover (S11-P3; session-68 N-68c comment re-scope)", () => {
    // DOM: `rounded-xl bg-card text-card-foreground shadow border
    // border-gray-200 hover:shadow-md transition-shadow` on the REPORTS
    // KPI rows ONLY — the dashboard half retired at s12 (S12-P5;
    // KPI_CARD.card is pinned WITHOUT the hover below).
    expect(STAT_SHADOWS.kpiHover).toBe("hover:shadow-md transition-shadow");
  });

  it("chart heights are per-surface constants (S11-P4)", () => {
    // .recharts-wrapper measurements on the reference at 1512×945:
    // dashboard pipeline + revenue 534×300; reports tab-1 4×534×300;
    // tab-2 Forecasting 1142×300 + three 331×300; tabs 3/4 331×300;
    // the leads rail 3×331×250; activities by-type 270×150.
    expect(CHART_GEOMETRY.dashboardHeight).toBe(300);
    expect(CHART_GEOMETRY.reportsHeight).toBe(300);
    expect(CHART_GEOMETRY.leadsRailHeight).toBe(250);
    expect(CHART_GEOMETRY.activitiesByTypeHeight).toBe(150);
  });

  it("the contacts page is the reference's full-height architecture (S11-P8)", () => {
    // The reference's contacts is the ONLY page with
    // main > DIV.flex.h-[calc(100vh-64px)] > DIV.flex-1.overflow-auto >
    // DIV.p-8 > content. The calc's 64px is 5px short of the real 69px
    // topbar (a reference quirk mirrored verbatim); the padding is p-8
    // at ALL widths (every other page: p-4 sm:p-8 — contacts shows 32px
    // at 390px where the others show 16px).
    expect(CONTACTS_LAYOUT.fullHeight).toBe("flex h-[calc(100vh-64px)]");
    expect(CONTACTS_LAYOUT.innerScroll).toBe("flex-1 overflow-auto");
    expect(CONTACTS_LAYOUT.content).toBe("p-8");
    expect(CONTACTS_LAYOUT.mobileCards).toBe("lg:hidden mt-6 space-y-4");
  });

  it("the contacts table card is the TINY shadow + border variant (S11-P9)", () => {
    // DOM: `bg-white rounded-xl shadow-sm border border-gray-200
    // overflow-hidden` — the only entity table card with shadow-sm
    // (accounts/leads ship `bg-white rounded-lg shadow`, no border).
    expect(TABLE_SHADOWS.contacts).toBe("shadow-sm");
    expect(TABLE_SHADOWS.accounts).toBe("shadow");
    expect(TABLE_SHADOWS.leads).toBe("shadow");
  });

  it("the topbar icon buttons use the reference's sm:flex (S11-P10)", () => {
    // DOM: `hidden … sm:flex` (computed display: flex). Ours shipped
    // sm:inline-flex — visually identical on fixed-size buttons, but the
    // computed value differs; aligned for exact parity.
    expect(TOPBAR_LAYOUT.iconButton).toContain("hidden");
    expect(TOPBAR_LAYOUT.iconButton).toContain("sm:flex");
    expect(TOPBAR_LAYOUT.iconButton).not.toContain("sm:inline-flex");
  });
});

describe("session-12: tabs anatomy (S12-P4)", () => {
  it("the pill track (reports) carries the reference's full class set", () => {
    // DOM: `items-center justify-center rounded-lg p-1
    // text-muted-foreground grid w-full grid-cols-2 lg:grid-cols-5 h-auto
    // bg-white border`. The track's text-muted-foreground is what makes
    // inactive tabs inherit #737373 (NOT our gray-500 #6b7280); h-auto is
    // the reference's explicit height reset.
    expect(TABS_PILL.track).toContain("text-muted-ink");
    expect(TABS_PILL.track).toContain("h-auto");
    expect(TABS_PILL.track).toContain("rounded-lg");
    expect(TABS_PILL.track).toContain("bg-white");
    expect(TABS_PILL.track).toContain("grid w-full grid-cols-2");
    expect(TABS_PILL.track).not.toContain("h-9");
  });

  it("the pill trigger matches the reference's stock Radix tab classes", () => {
    // DOM: `inline-flex items-center justify-center whitespace-nowrap
    // rounded-md px-3 py-1 font-medium ring-offset-background
    // transition-all … text-xs sm:text-sm data-[state=active]:shadow
    // data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700`.
    // No h-7 (natural 28px), no hover: (the reference ships NO hover on
    // any tab variant), transition-all (not colors-only).
    expect(TABS_PILL.trigger).toContain("ring-offset-background");
    expect(TABS_PILL.trigger).toContain("transition-all");
    expect(TABS_PILL.trigger).toContain("text-xs sm:text-sm");
    expect(TABS_PILL.trigger).toContain("data-[state=active]:shadow");
    expect(TABS_PILL.trigger).toContain("data-[state=active]:bg-blue-50");
    expect(TABS_PILL.trigger).not.toContain("h-7");
    expect(TABS_PILL.trigger).not.toContain("hover:");
    expect(TABS_PILL.trigger).not.toContain("transition-colors");
  });

  it("the segmented track (activities + settings) carries text-muted-ink", () => {
    // DOM: `h-9 items-center justify-center rounded-lg bg-muted p-1
    // text-muted-foreground grid w-full grid-cols-{n}` — the same
    // muted-foreground inheritance as the pill track.
    expect(TABS_SEGMENTED.track).toContain("h-9");
    expect(TABS_SEGMENTED.track).toContain("text-muted-ink");
    expect(TABS_SEGMENTED.track).toContain("rounded-lg bg-line-soft p-1");
  });

  it("the segmented trigger matches the reference's stock classes", () => {
    // DOM: `inline-flex items-center justify-center whitespace-nowrap
    // rounded-md px-3 py-1 text-sm font-medium ring-offset-background
    // transition-all … data-[state=active]:shadow
    // data-[state=active]:bg-background data-[state=active]:text-foreground`.
    // The ACTIVE pill computes the v3 `shadow` scale (0 1px 3px .1 +
    // 0 1px 2px -1px .1) — the s6 shadow-sm pin was one step light.
    expect(TABS_SEGMENTED.trigger).toContain("text-sm");
    expect(TABS_SEGMENTED.trigger).toContain("ring-offset-background");
    expect(TABS_SEGMENTED.trigger).toContain("transition-all");
    expect(TABS_SEGMENTED.trigger).toContain("data-[state=active]:shadow");
    expect(TABS_SEGMENTED.trigger).toContain("data-[state=active]:bg-background");
    expect(TABS_SEGMENTED.trigger).not.toContain("h-7");
    expect(TABS_SEGMENTED.trigger).not.toContain("hover:");
    // the active shadow must be the BARE scale, not shadow-sm (one step light)
    expect(TABS_SEGMENTED.trigger).not.toContain("data-[state=active]:shadow-sm");
  });
});

describe("session-12: dashboard KPI card de-hover + label tokens (S12-P5)", () => {
  it("the KpiCard drops the stale hover pin (the reference moved)", () => {
    // The reference's DASHBOARD KPI cards are now plain stock cards —
    // `rounded-xl border bg-card text-card-foreground shadow` + p-4
    // sm:p-6, NO hover:shadow-md, NO transition-shadow, NO
    // border-gray-200 (rides the #e5e5e5 default). The s11 hover pin
    // applied to a reference state that no longer exists; the REPORTS
    // KPI family (CircleStatCard) keeps its hover.
    expect(KPI_CARD.card).toContain("rounded-xl border border-line bg-surface");
    expect(KPI_CARD.card).toContain("shadow");
    expect(KPI_CARD.card).not.toContain("hover:shadow-md");
    expect(KPI_CARD.card).not.toContain("transition-shadow");
  });

  it("the KpiCard label + neutral delta are gray-600, deltas drop font-medium", () => {
    // DOM: label `text-xs sm:text-sm text-gray-600` (#4b5563 — one step
    // darker than our old text-muted #6b7280); deltas `text-xs
    // text-green-600/text-gray-600 mb-1` with NO font-medium.
    expect(KPI_CARD.label).toContain("text-xs sm:text-sm");
    expect(KPI_CARD.label).toContain("text-gray-600");
    expect(KPI_CARD.label).not.toContain("text-muted");
    expect(DELTA_TEXT.base).toContain("text-xs");
    expect(DELTA_TEXT.base).not.toContain("font-medium");
    expect(DELTA_TEXT.neutral).toBe("text-gray-600");
    expect(DELTA_TEXT.good).toBe("text-green-600");
    expect(DELTA_TEXT.bad).toBe("text-red-600");
  });

  it("the reports KPI cards (CircleStatCard) KEEP hover + gain the strong border", () => {
    // The reference's reports KPI cards still ship `border-gray-200
    // hover:shadow-md transition-shadow` — the one stat family with the
    // hover treatment. The border rides --color-line-strong (#e5e7eb).
    expect(STAT_CARD.reportsCard).toContain("border-line-strong");
    expect(STAT_CARD.reportsCard).toContain("hover:shadow-md");
    expect(STAT_CARD.reportsCard).toContain("transition-shadow");
  });
});

describe("session-12: sparkline geometry + chip palette (S12-P6)", () => {
  it("the dashboard spark container is mt-2 h-8", () => {
    // DOM: the trend visual lives in `<div class="mt-2 h-8">` inside the
    // KPI card content (32px tall).
    expect(KPI_SPARK.dashboardContainer).toBe("mt-2 h-8");
  });

  it("the reports spark row is the flex-end split with an h-12 slot", () => {
    // DOM: `<div class="flex items-end justify-between mt-2">` →
    // `<div class="flex-1 h-12 mr-2">` (48px) wrapping a recharts
    // ResponsiveContainer whose wrapper caps at max-width 176px.
    expect(KPI_SPARK.reportsWrapper).toBe("flex items-end justify-between mt-2");
    expect(KPI_SPARK.reportsSlot).toBe("flex-1 h-12 mr-2");
    expect(KPI_SPARK.reportsMaxWidth).toBe("max-w-[176px]");
  });

  it("the sparkline variants carry the recharts geometry contract", () => {
    // Reference paths are recharts monotone CUBIC curves (type=monotone):
    // line variant strokeWidth 2, no dots, no axes/grid; area variant
    // fillOpacity 0.3 + strokeWidth 1 closing at the chart's x-axis.
    expect(KPI_SPARK.line).toContain("monotone");
    expect(KPI_SPARK.line).toContain("strokeWidth: 2");
    expect(KPI_SPARK.line).toContain("dot: false");
    expect(KPI_SPARK.area).toContain("monotone");
    expect(KPI_SPARK.area).toContain("strokeWidth: 1");
    expect(KPI_SPARK.area).toContain("fillOpacity: 0.3");
  });

  it("the icon chips are SOLID color-50s (not alpha tints)", () => {
    // Computed: blue-50 #eff6ff / orange-50 #fff7ed / green-50 #f0fdf4 /
    // red-50 #fef2f2 / violet-50 #faf5ff. Ours shipped 10%-alpha tints
    // (rgba(59,130,246,.1) ≈ #e8f0fd — a different wash).
    expect(KPI_CHIP_BG["#3b82f6"]).toBe("#eff6ff");
    expect(KPI_CHIP_BG["#f97316"]).toBe("#fff7ed");
    expect(KPI_CHIP_BG["#10b981"]).toBe("#f0fdf4");
    expect(KPI_CHIP_BG["#ef4444"]).toBe("#fef2f2");
    expect(KPI_CHIP_BG["#8b5cf6"]).toBe("#faf5ff");
  });

  it("the reports LOST DEALS card ships NO sparkline", () => {
    // The reference's reports KPI row sparks Total Leads (blue), Open
    // Leads (orange), Won Deals (emerald) and Conversion Rate (violet) —
    // the 4th card (Lost Deals) has NO trend visual.
    expect(KPI_SPARK.lostDealsSpark).toBe(false);
  });
});

describe("session-12: custom 404 page (S12-P2)", () => {
  it("the not-found page mirrors the reference's slate family", () => {
    // Reference: root `min-h-screen flex items-center justify-center p-6
    // bg-slate-50` → `max-w-md w-full` → `text-center space-y-6` →
    // `space-y-2` heading group; H1 `404` text-7xl font-light
    // text-slate-300; H2 `Page Not Found` text-2xl font-medium
    // text-slate-800; P `The page "{path}" could not be found in this
    // application.` text-slate-600 leading-relaxed.
    expect(NOT_FOUND_LAYOUT.page).toBe("min-h-screen flex items-center justify-center p-6 bg-slate-50");
    expect(NOT_FOUND_LAYOUT.card).toBe("max-w-md w-full");
    expect(NOT_FOUND_LAYOUT.center).toBe("text-center space-y-6");
    expect(NOT_FOUND_LAYOUT.headingGroup).toBe("space-y-2");
    expect(NOT_FOUND_LAYOUT.h1).toBe("text-7xl font-light text-slate-300");
    expect(NOT_FOUND_LAYOUT.h2).toBe("text-2xl font-medium text-slate-800");
    expect(NOT_FOUND_LAYOUT.p).toBe("text-slate-600 leading-relaxed");
    // VLM round-1 catches (DOM-verified): a 2px×64px slate-200 divider bar
    // under the "404", the h2+p in their own space-y-3 group, the quoted
    // pathname in a font-medium slate-700 span, and the button in a pt-6
    // group — three children under the space-y-6 center, not two.
    expect(NOT_FOUND_LAYOUT.divider).toBe("h-0.5 w-16 bg-slate-200 mx-auto");
    expect(NOT_FOUND_LAYOUT.textGroup).toBe("space-y-3");
    expect(NOT_FOUND_LAYOUT.pathSpan).toBe("font-medium text-slate-700");
    expect(NOT_FOUND_LAYOUT.buttonGroup).toBe("pt-6");
  });

  it("the Go Home button mirrors the reference's white bordered pill", () => {
    // DOM: `inline-flex items-center px-4 py-2 text-sm font-medium
    // text-slate-700 bg-white border border-slate-200 rounded-lg
    // hover:bg-slate-50 hover:border-slate-300 transition-colors
    // duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    // focus:ring-slate-500` with a lucide Home icon (w-4 h-4 mr-2),
    // navigating to `/`.
    expect(NOT_FOUND_LAYOUT.homeButton).toContain("bg-white border border-slate-200 rounded-lg");
    expect(NOT_FOUND_LAYOUT.homeButton).toContain("text-slate-700");
    expect(NOT_FOUND_LAYOUT.homeButton).toContain("focus:ring-slate-500");
    expect(NOT_FOUND_LAYOUT.homeIcon).toBe("h-4 w-4 mr-2");
    expect(NOT_FOUND_LAYOUT.homeHref).toBe("/");
  });
});

// ============================================================
// Session-13 pins (DOM-verified 2026-09-30 at 1512x945)
// ============================================================

describe("session-13: button radius (S13-P3)", () => {
  it("the Button base flips to the reference's rounded-md", () => {
    // Computed sweep across all 8 reference pages + the profile page +
    // dialog buttons + topbar icon buttons: EVERY reference button renders
    // 6px (rounded-md). Our base shipped rounded-lg (8px) — visible on
    // every default-size button (contacts/calendar/reports-saved/profile).
    expect(BUTTON_BASE.rounded).toBe("rounded-md");
  });
});

describe("session-13: CardTitle per-page map (S13-P6)", () => {
  it("the CardTitle default becomes the STOCK string", () => {
    // Reference reports (11 titles) + profile (1) render the stock shadcn
    // CardTitle: `font-semibold leading-none tracking-tight` (16px, no
    // size class, leading-none). Ours shipped
    // `font-semibold tracking-tight text-base sm:text-lg` (18px at sm+).
    expect(CARD.title).toBe("font-semibold leading-none tracking-tight");
  });

  it("the per-page overrides carry the bigger reference variants", () => {
    // dashboard (6) + leads (3): `text-base sm:text-lg` (18px at sm+);
    // settings (5): `text-lg` (18px at ALL widths — ours shipped
    // text-base sm:text-lg = 16px below sm). Session-68 (N-68i): the
    // `filters` member retired — the rails consume FILTER_RAIL.title
    // ("text-base", pinned in its own it below), so the member was a
    // zero-consumer byte-duplicate.
    expect(CARD_TITLE_OVERRIDE.dashboard).toBe("text-base sm:text-lg");
    expect(CARD_TITLE_OVERRIDE.settings).toBe("text-lg");
    // N-68i absence pin: the retired member stays retired
    expect(CARD_TITLE_OVERRIDE).not.toHaveProperty("filters");
  });

  it("the filter-rail titles drop the redundant sm:text-base", () => {
    // Reference accounts/activities/calendar filter cards:
    // `font-semibold tracking-tight text-base` (calendar adds the flex
    // row classes for its Clear All action).
    expect(FILTER_RAIL.title).toBe("text-base");
    expect(FILTER_RAIL.titleWithAction).toBe("text-base flex items-center justify-between");
  });
});

describe("session-13: page h1s pin text-gray-900 (S13-P9)", () => {
  it("every PAGE_HEADER title carries the explicit gray-900", () => {
    // The reference's page H1s are ALL `text-gray-900` (#111827 —
    // verified on /, /contacts, /settings, /activities, /leads, /profile)
    // while the DEFAULT foreground flips to #0a0a0a this session. Our
    // h1s rode text-foreground — after the token flip they would drift
    // one gray step dark unless pinned explicitly.
    for (const [name, spec] of Object.entries(PAGE_HEADER)) {
      expect((spec as { title: string }).title).toContain("text-gray-900");
      expect((spec as { title: string }).title).not.toContain("text-foreground");
    }
  });
});

describe("session-13: dialog title stock string (S13-P9)", () => {
  it("DialogTitle gains leading-none tracking-tight like the stock primitive", () => {
    // Reference dialog title (New Account dialog): `text-lg font-semibold
    // leading-none tracking-tight` inheriting #0a0a0a. Ours:
    // `text-lg font-semibold text-foreground` — missing leading-none +
    // tracking-tight.
    expect(DIALOG_TITLE).toBe("text-lg font-semibold leading-none tracking-tight");
  });
});

describe("session-13: KPI value string (S13-P9 + S13-P10)", () => {
  it("the KPI value drops leading-none/tracking-tight/text-foreground", () => {
    // Reference KPI value: SPAN `text-2xl sm:text-3xl font-bold`
    // (inherits card-foreground #0a0a0a, line-height 36px, letter-spacing
    // normal). Ours added leading-none (30px line-height) + tracking-tight
    // (-0.75px) + text-foreground — REAL computed diffs.
    expect(KPI_VALUE).toBe("text-2xl sm:text-3xl font-bold");
  });

  it("the dashboard's Avg. Sales Cycle KPI carries NO delta (S13-P10)", () => {
    // Reference card row = value + "days" unit only — no third element
    // (the reference renders deltas at zero on its OTHER cards, so a
    // delta element here would render; it does not exist). Ours shipped
    // a "+1d" delta.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/page.tsx"),
      "utf8",
    );
    const m = src.match(/label="Avg\. Sales Cycle"[\s\S]{0,400}?<\/KpiCard>/);
    expect(m).toBeTruthy();
    expect(m![0]).not.toContain("delta=");
  });
});

describe("session-13: profile page parity (S13-P2)", () => {
  it("the header becomes the reference's plain mb-6 wrapper", () => {
    // Reference: `div [mb-6 sm:mb-8]` (plain) with the h1 + subtitle
    // inside. Ours shipped a flex justify-between wrapper.
    expect(PROFILE_LAYOUT.headerRow).toBe("mb-6 sm:mb-8");
    expect(PROFILE_LAYOUT.headerRow).not.toContain("flex");
  });

  it("the Personal Information title is the STOCK CardTitle", () => {
    // `font-semibold leading-none tracking-tight` (16px) — ours rendered
    // 18px via text-base sm:text-lg.
    expect(PROFILE_LAYOUT.cardTitle).toBe("font-semibold leading-none tracking-tight");
  });

  it("the disabled email input gains the reference's bg-gray-50 wash", () => {
    // Reference email input (disabled): stock Input + `bg-gray-50`.
    // Ours: bg-transparent (indistinguishable from an editable input).
    expect(PROFILE_LAYOUT.emailDisabled).toContain("bg-gray-50");
  });

  it("the disabled role input gains bg-gray-50 AND capitalize", () => {
    // Reference role input: stock Input + `bg-gray-50 capitalize` — the
    // raw value "user" displays "User" (VLM-caught, DOM-verified).
    expect(PROFILE_LAYOUT.roleDisabled).toContain("bg-gray-50");
    expect(PROFILE_LAYOUT.roleDisabled).toContain("capitalize");
  });

  it("the role badge is the STOCK shadcn Badge default variant structure", () => {
    // Reference: `inline-flex items-center rounded-md border px-2.5
    // py-0.5 text-xs font-semibold transition-colors focus:outline-none
    // focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent
    // bg-primary text-primary-foreground shadow hover:bg-primary/80` +
    // `mt-2 capitalize` — where the reference's PAGE-LOCAL primary is
    // #171717 (its global --primary; its blue buttons elsewhere are
    // explicit bg-blue-600). Ours maps --primary to blue, so the badge
    // carries the exact colors via the neutral literals (bg #171717 =
    // neutral-900, fg #fafafa = neutral-50, hover #262626).
    expect(PROFILE_LAYOUT.badge).toContain("rounded-md border");
    expect(PROFILE_LAYOUT.badge).toContain("px-2.5 py-0.5 text-xs font-semibold");
    expect(PROFILE_LAYOUT.badge).toContain("bg-neutral-900 text-neutral-50");
    expect(PROFILE_LAYOUT.badge).toContain("shadow");
    expect(PROFILE_LAYOUT.badge).toContain("hover:bg-neutral-800");
    expect(PROFILE_LAYOUT.badge).toContain("focus:ring-2 focus:ring-ring focus:ring-offset-2");
    expect(PROFILE_LAYOUT.badge).toContain("border-transparent");
    expect(PROFILE_LAYOUT.badge).toContain("mt-2");
    expect(PROFILE_LAYOUT.badge).toContain("capitalize");
  });

  it("the save/upload buttons are STOCK buttons with w-full sm:w-auto", () => {
    // Reference Save Changes: default variant (bg-primary … shadow
    // hover:bg-primary/90) + `h-9 px-4 py-2 w-full sm:w-auto`; Upload
    // Photo: outline variant + the same size classes, camera icon
    // carrying `w-4 h-4 mr-2` ON THE SVG.
    expect(PROFILE_LAYOUT.saveBtn).toContain("w-full sm:w-auto");
    expect(PROFILE_LAYOUT.uploadBtn).toContain("w-full sm:w-auto");
    expect(PROFILE_LAYOUT.uploadIcon).toBe("h-4 w-4 mr-2");
  });

  it("the page root is the reference's max-w-4xl mx-auto inner div", () => {
    // Reference: `div [p-4 sm:p-8]` (the SHELL inner — plain, re-pinned
    // above) wrapping `div [max-w-4xl mx-auto]` (the page root).
    expect(PROFILE_LAYOUT.root).toBe("max-w-4xl mx-auto");
  });
});

describe("session-13: activities by-type card (S13-P5)", () => {
  it("the header follows the filter-rail pattern with the subtitle inside", () => {
    // Reference header: `flex flex-col space-y-1.5 p-6 pb-3` containing a
    // `flex justify-between items-center` title row + the subtitle
    // `text-xs text-gray-500` INSIDE the header. Ours: a custom flex-row
    // header with the subtitle in the body.
    expect(BY_TYPE_CARD.headerPad).toBe("p-6 pb-3");
    expect(BY_TYPE_CARD.headerRow).toBe("flex justify-between items-center");
    expect(BY_TYPE_CARD.subtitle).toBe("text-xs text-gray-500");
  });

  it("the subtitle is the STATIC 'Last 2 days' (the filter does not change it)", () => {
    // Live probe: switching the range combobox to "Last 30 Days" leaves
    // the card subtitle at "Last 2 days" — a static string on the
    // reference. Ours shipped a dynamic "Last {range} days".
    expect(BY_TYPE_CARD.subtitleText).toBe("Last 2 days");
  });

  it("the card-header dots are BARE text buttons", () => {
    // Reference: `text-gray-400 hover:text-gray-600` (24px, no radius, no
    // bg — NOT a ghost icon button). The footer dots add ml-auto.
    expect(BY_TYPE_CARD.dotsButton).toBe("text-gray-400 hover:text-gray-600");
    expect(BY_TYPE_CARD.footerDotsButton).toBe("ml-auto text-gray-400 hover:text-gray-600");
  });

  it("the chips row renders five per-type count chips", () => {
    // `flex flex-wrap gap-3 mt-4` with `flex items-center gap-2` chips:
    // a `w-3 h-3 rounded` swatch (INLINE background-color) + a
    // `text-xs text-gray-600` "Call N" label.
    expect(BY_TYPE_CARD.chipsRow).toBe("flex flex-wrap gap-3 mt-4");
    expect(BY_TYPE_CARD.chip).toBe("flex items-center gap-2");
    expect(BY_TYPE_CARD.chipSwatch).toBe("w-3 h-3 rounded");
    expect(BY_TYPE_CARD.chipLabel).toBe("text-xs text-gray-600");
  });

  it("the chart series colors are blue/violet/amber/emerald/teal", () => {
    // Reference swatches: Call #3b82f6, Email #8b5cf6, Meeting #f59e0b,
    // Task #10b981, Note #14b8a6. Ours rendered blue/cyan/amber/violet/
    // gray (email/task/note wrong).
    expect(BY_TYPE_CARD.colors).toEqual({
      call: "#3b82f6",
      email: "#8b5cf6",
      meeting: "#f59e0b",
      task: "#10b981",
      note: "#14b8a6",
    });
  });

  it("the footer renders the Activities checkbox row under a hairline", () => {
    // `mt-4 pt-4 border-t` with a stock-style checkbox + label
    // `text-sm font-medium cursor-pointer` "Activities" + the ml-auto
    // dots button.
    expect(BY_TYPE_CARD.footer).toBe("mt-4 pt-4 border-t");
    expect(BY_TYPE_CARD.footerLabel).toBe("text-sm font-medium cursor-pointer");
  });

  it("the by-type CardTitle is text-base (16px)", () => {
    expect(BY_TYPE_CARD.title).toBe("text-base");
  });
});

describe("session-13: calendar day cells (S13-P7)", () => {
  it("out-of-month cells keep the default border (not transparent)", () => {
    // Reference: `bg-gray-50 text-gray-400` with the DEFAULT border
    // (#e5e5e5) + transition-all. Ours hid the border
    // (border-transparent) and used token aliases.
    // Session-63 re-anchor (N-63a): the record is RE-DERIVED from the
    // live calendar-page cell — out-of-month no longer duplicates
    // `transition-all` (base carries it; the pre-s63 record was a stale
    // copy the page had drifted from — the s24 click-contract lesson).
    expect(CALENDAR_CELL.outOfMonth).toContain("border-line");
    expect(CALENDAR_CELL.outOfMonth).toContain("bg-gray-50");
    expect(CALENDAR_CELL.outOfMonth).toContain("text-gray-400");
    expect(CALENDAR_CELL.outOfMonth).not.toContain("transition-all");
    expect(CALENDAR_CELL.outOfMonth).not.toContain("border-transparent");
    expect(CALENDAR_CELL.base).toContain("transition-all");
  });

  it("current-month cells hover to the reference's gray-50 wash", () => {
    // Reference: `bg-white hover:bg-gray-50` (ours shipped
    // hover:border-primary/40 — the clickable superset keeps its
    // focus-visible ring, but the REST-state hover mirrors the
    // reference).
    expect(CALENDAR_CELL.current).toContain("bg-white");
    expect(CALENDAR_CELL.current).toContain("hover:bg-gray-50");
  });

  it("the today cell stays the blue-600 pill", () => {
    // `bg-blue-600 text-white border-blue-600` — ours renders the
    // identical computed values via --color-sidebar #2563eb.
    expect(CALENDAR_CELL.today).toContain("bg-sidebar");
    expect(CALENDAR_CELL.today).toContain("text-white");
    expect(CALENDAR_CELL.today).toContain("border-sidebar");
  });

  it("base mirrors the live cell: the s27 flex column + the focus ring (the s63 re-derive)", () => {
    // The live calendar-page cell (calendar-page.tsx) ships
    // `flex min-h-20 flex-col items-stretch …` — the tall-bar/agenda
    // layout the s27 calendar-cells work added — plus the
    // focus-visible ring pair of the clickable-superset BUTTON. The
    // pre-s63 record carried neither (a stale copy of the s13
    // extraction).
    expect(CALENDAR_CELL.base).toContain("flex");
    expect(CALENDAR_CELL.base).toContain("flex-col");
    expect(CALENDAR_CELL.base).toContain("items-stretch");
    expect(CALENDAR_CELL.base).toContain("min-h-20");
    expect(CALENDAR_CELL.base).toContain("sm:min-h-24");
    expect(CALENDAR_CELL.base).toContain("rounded-lg");
    expect(CALENDAR_CELL.focusRing).toContain("focus-visible:ring-2");
  });
});

describe("session-13: stock account menu (S13-P4)", () => {
  it("the account menu content is the stock DropdownMenu surface", () => {
    // Reference: `z-50 min-w-[8rem] overflow-hidden rounded-md border
    // bg-popover p-1 text-popover-foreground shadow-md …` (Radix
    // DropdownMenu, role=menu). Ours: a Popover (role=dialog) with
    // z-[60] rounded-lg shadow-lg + custom tokens.
    expect(MENU_CONTENT).toContain("z-50");
    expect(MENU_CONTENT).toContain("min-w-[8rem]");
    expect(MENU_CONTENT).toContain("rounded-md");
    expect(MENU_CONTENT).toContain("shadow-md");
    expect(MENU_CONTENT).not.toContain("z-[60]");
    expect(MENU_CONTENT).not.toContain("rounded-lg");
    expect(MENU_CONTENT).not.toContain("shadow-lg");
  });

  it("the account menu items are the stock menuitem anatomy", () => {
    // Reference item: `relative flex cursor-default select-none items-
    // center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none
    // transition-colors focus:bg-accent focus:text-accent-foreground …`
    // (ours was: rounded-md hover:bg-line-soft cursor-pointer w-full
    // text-left). Our accent wash rides the --color-line-soft token
    // (#f3f4f6 — the reference's --accent computes the same gray wash).
    expect(MENU_ITEM).toContain("rounded-sm px-2 py-1.5 text-sm");
    expect(MENU_ITEM).toContain("cursor-default");
    expect(MENU_ITEM).toContain("focus:bg-line-soft");
    expect(MENU_ITEM).toContain("relative");
    expect(MENU_ITEM).not.toContain("hover:bg-line-soft");
    expect(MENU_ITEM).not.toContain("cursor-pointer");
    expect(MENU_ITEM).not.toContain("w-full");
  });

  it("the topbar account menu renders a real role=menu (e2e-pinned)", () => {
    // Source-level pin: the topbar must use the Menu primitives (not the
    // Popover-based Dropdown) for the account menu.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/layout/topbar.tsx"),
      "utf8",
    );
    expect(src).toContain("<MenuContent");
    expect(src).not.toMatch(/<DropdownContent[^>]*userMenu/);
  });
});

describe("session-13: stock Label primitive (S13-P13)", () => {
  it("the Label component carries the stock shadcn string", () => {
    // Reference dialog label (New Account): `text-sm font-medium
    // leading-none peer-disabled:cursor-not-allowed
    // peer-disabled:opacity-70` (14px, inheriting the foreground). Ours
    // shipped a 12px text-xs custom with a /80 foreground wash.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/label.tsx"),
      "utf8",
    );
    expect(src).toContain('"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"');
    expect(src).not.toContain("text-xs font-medium text-foreground/80");
  });
});

// ---------------------------------------------------------------------------
// Session 14 (S14-P1..P5): settings Defaults/Data tab structure, the Danger
// Zone rebuild, the /Profile casing redirect and the line-soft re-pin.
// ---------------------------------------------------------------------------

describe("session-14: settings Defaults tab single-column layout (S14-P1)", () => {
  it("the Default Values body is a single-column space-y-4 stack", () => {
    // Reference: body `p-6 pt-0 space-y-4` — one column at ALL widths
    // (computed g1MT 16px). Ours shipped a 3-col responsive grid.
    expect(SETTINGS_DEFAULTS.body).toBe("p-6 pt-0 space-y-4");
    expect(SETTINGS_DEFAULTS.body).not.toMatch(/grid-cols/);
  });

  it("each Defaults group is space-y-2 (12px computed label gap)", () => {
    // Reference groups: `space-y-2` (computed label→control gap 12px);
    // ours shipped `grid gap-1.5` (6px).
    expect(SETTINGS_DEFAULTS.group).toBe("space-y-2");
  });

  it("every control carries mt-2 — the v4 space-y flip NO-OPS on inline labels", () => {
    // The reference's v3-era `space-y-2 > * + *` lands margin-TOP 8px on
    // the block-level control; Tailwind v4's
    // `:where(& > :not(:last-child))` lands margin-BOTTOM on the INLINE
    // label — vertical margins on inline elements do not apply, so the
    // gap silently collapsed to ~3px. The explicit mt-2 restores the
    // reference's computed geometry (inputMT 8px, rect gap 12px).
    expect(SETTINGS_DEFAULTS.controlMt).toBe("mt-2");
    expect(SETTINGS_DANGER.controlMt).toBe("mt-2");
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/settings/settings-page.tsx"),
      "utf8",
    );
    // 4 Defaults inputs + 2 select triggers + the Danger Zone input.
    expect(src.match(/SETTINGS_DEFAULTS\.controlMt/g)?.length).toBe(6);
    expect(src.match(/SETTINGS_DANGER\.controlMt/g)?.length).toBe(1);
  });

  it("the Defaults CardTitle rides the STOCK string (not the settings text-lg override)", () => {
    expect(SETTINGS_DEFAULTS.cardTitle).toBe(CARD.title);
    expect(SETTINGS_DEFAULTS.cardTitle).not.toContain("text-lg");
  });

  it("the Defaults subtitle is the stock CardDescription family (14px, #737373)", () => {
    // Reference: `text-sm text-muted-foreground` (computed 14px /
    // rgb(115,115,115)); ours shipped `text-xs text-muted` (12px/#6b7280).
    expect(SETTINGS_DEFAULTS.subtitle).toBe("text-sm text-muted-ink");
    expect(SETTINGS_DEFAULTS.subtitle).not.toContain("text-xs");
  });
});

describe("session-14: settings Data tab structure (S14-P2)", () => {
  it("the template card is titled 'Import Templates'", () => {
    // The reference's title carries the 'Import ' prefix; ours said just
    // 'Templates'.
    expect(SETTINGS_DATA.importTitle).toBe("Import Templates");
  });

  it("both list bodies are vertical space-y-2 stacks", () => {
    // Reference: `p-6 pt-0 space-y-2` (buttons stacked, 8px apart);
    // ours shipped `flex flex-wrap gap-2` (horizontal wrap).
    expect(SETTINGS_DATA.listBody).toBe("p-6 pt-0 space-y-2");
    expect(SETTINGS_DATA.listBody).not.toContain("flex-wrap");
  });

  it("the Data tab buttons are stock outline default-size with w-full sm:w-auto", () => {
    // Reference: outline variant, h-9 px-4 py-2 text-sm, `w-full
    // sm:w-auto`, download icon w-4 h-4. Ours shipped secondary/sm
    // (h-8 px-3 text-xs, icon h-3.5, no responsive width).
    expect(SETTINGS_DATA.buttonCls).toContain("w-full sm:w-auto");
    expect(SETTINGS_DATA.buttonIcon).toBe("h-4 w-4");
  });

  it("the Data tab CardTitles ride the STOCK string", () => {
    expect(SETTINGS_DATA.cardTitle).toBe(CARD.title);
    expect(SETTINGS_DATA.cardTitle).not.toContain("text-lg");
  });
});

describe("session-14: Danger Zone rebuild (S14-P3)", () => {
  it("the card is the tinted warning surface (bg-red-50 + red-200 border)", () => {
    // Reference: `rounded-xl border text-card-foreground shadow
    // border-red-200 bg-red-50` (computed border #fecdd3 = our
    // rose-200/red-200 — kept; the bg was missing).
    expect(SETTINGS_DANGER.card).toContain("border-red-200");
    expect(SETTINGS_DANGER.card).toContain("bg-red-50");
  });

  it("the title is stock + text-red-700 + flex + gap with the circle-alert icon", () => {
    // Reference: `font-semibold leading-none tracking-tight text-red-700
    // flex items-center gap-2` + lucide circle-alert w-5 h-5. Ours shipped
    // `text-lg text-danger` (#ef4444 — the WRONG red) with no icon.
    expect(SETTINGS_DANGER.title).toBe(
      "font-semibold leading-none tracking-tight text-red-700 flex items-center gap-2",
    );
    expect(SETTINGS_DANGER.titleIcon).toBe("h-5 w-5");
  });

  it("the body stacks the input group then the button (no warning paragraph)", () => {
    // Reference body: `p-6 pt-0 space-y-4` with ONLY the `space-y-2`
    // input group (label 'Type "RESET" to confirm' + max-w-xs input) and
    // the destructive button below it. Ours shipped an extra paragraph +
    // a flex-row input+button pair.
    expect(SETTINGS_DANGER.body).toBe("p-6 pt-0 space-y-4");
    expect(SETTINGS_DANGER.group).toBe("space-y-2");
    expect(SETTINGS_DANGER.label).toBe('Type "RESET" to confirm');
    expect(SETTINGS_DANGER.inputCls).toContain("max-w-xs");
  });

  it("the reset button foreground is #fafafa (neutral-50), not pure white", () => {
    // Reference destructive-foreground computes rgb(250,250,250); ours
    // shipped text-white (#ffffff).
    expect(SETTINGS_DANGER.resetFg).toBe("text-neutral-50");
  });
});

describe("session-14: settings CardTitle override scope (S14-P1/P2)", () => {
  it("the text-lg override stays ONLY on the five CRM Configuration picklist cards", () => {
    // The s13 pin ('settings (5) text-lg') covered ONLY the CRM
    // Configuration tab's five picklist cards — the Defaults (1) and Data
    // (3) cards ride the stock default. The settings-page source must
    // apply CARD_TITLE_OVERRIDE.settings inside ListEditor but NOT on the
    // Defaults/Data cards.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/settings/settings-page.tsx"),
      "utf8",
    );
    // ListEditor (the five picklist cards) keeps the override…
    expect(src).toMatch(/<CardTitle className=\{CARD_TITLE_OVERRIDE\.settings\}>\{title\}/);
    // …and the Defaults/Data/Danger titles must NOT carry it.
    expect(src).not.toMatch(/CARD_TITLE_OVERRIDE\.settings\}[^>]*>(Default Values|Import Templates|Export Data|Danger Zone)/);
    expect(src).not.toMatch(/CARD_TITLE_OVERRIDE\.settings,\s*"text-danger"/);
  });
});

// ---------------------------------------------------------------------------
// Session-15: the entity-dialog geometry layer (DIALOG_FAMILY)
// ---------------------------------------------------------------------------

describe("session-15: dialog chrome — content, overlay, header, footer, close (S15-P1..P6)", () => {
  it("DialogContent ships the stock shadcn geometry (w-full, sm:rounded-lg, shadow-lg, slide animations)", () => {
    // Reference (all five dialogs): `fixed left-[50%] top-[50%] z-50 grid
    // w-full translate-x-[-50%] translate-y-[-50%] gap-4 border
    // bg-background p-6 shadow-lg … data-[state=open]:slide-in-from-left-1/2
    // data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-lg`.
    // Computed: 8px radius ≥sm, 0 below; FULL-BLEED 390px at phone widths.
    expect(DIALOG_CONTENT.base).toContain("w-full");
    expect(DIALOG_CONTENT.base).toContain("sm:rounded-lg");
    expect(DIALOG_CONTENT.base).toContain("shadow-lg");
    expect(DIALOG_CONTENT.base).toContain("data-[state=open]:slide-in-from-left-1/2");
    expect(DIALOG_CONTENT.base).toContain("data-[state=open]:slide-in-from-top-[48%]");
    expect(DIALOG_CONTENT.base).toContain("data-[state=closed]:slide-out-to-left-1/2");
    expect(DIALOG_CONTENT.base).toContain("data-[state=closed]:slide-out-to-top-[48%]");
    expect(DIALOG_CONTENT.base).toContain("max-w-lg");
    // The scaffold-era geometry is gone:
    expect(DIALOG_CONTENT.base).not.toContain("rounded-2xl");
    expect(DIALOG_CONTENT.base).not.toContain("shadow-xl");
    expect(DIALOG_CONTENT.base).not.toContain("w-[calc(100vw-2rem)]");
  });

  it("the max-w-2xl family (Event + Activity) overrides the width cap + the scroll pair (S30-P6)", () => {
    // Reference Event/Activity: max-w-2xl = 672px at 1512 — AND the
    // scroll-cap pair max-h-[90vh] overflow-y-auto (session-30's
    // bundle extraction: the reference's Edit-family + Log Activity +
    // Save Custom Report ALL ship it; only the Lead/Account CREATE
    // dialogs are cap-free — its own inconsistency, mirrored).
    expect(DIALOG_CONTENT.wide).toBe("max-w-2xl max-h-[90vh] overflow-y-auto");
  });

  it("DialogOverlay is the stock black/80 — no backdrop blur (S15-P2)", () => {
    // Reference: `fixed inset-0 z-50 bg-black/80 … fade-in-0` — NO blur.
    expect(DIALOG_OVERLAY).toContain("bg-black/80");
    expect(DIALOG_OVERLAY).not.toContain("backdrop-blur");
    expect(DIALOG_OVERLAY).not.toContain("bg-gray-900/45");
  });

  it("DialogHeader centers below sm (S15-P3)", () => {
    // Reference: `flex flex-col space-y-1.5 text-center sm:text-left`
    // (computed text-align center at 390, left at 1512).
    expect(DIALOG_HEADER).toBe("flex flex-col space-y-1.5 text-center sm:text-left");
  });

  it("DialogFooter ships the stock col-reverse string — no gap class (S15-P5)", () => {
    // Reference Lead/Account/Contact: `flex flex-col-reverse sm:flex-row
    // sm:justify-end sm:space-x-2` — computed column-reverse + gap normal
    // (buttons touch when stacked on phones; 8px margin at sm).
    expect(DIALOG_FOOTER).toBe("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2");
  });

  it("the wide family footer is flex justify-end gap-3 pt-4 (S15-P5/P12/P13)", () => {
    // Reference Event/Activity: `flex justify-end gap-3 pt-4`.
    expect(DIALOG_FOOTER_WIDE).toBe("flex justify-end gap-3 pt-4");
  });

  it("the close X is the stock opacity pattern (S15-P6)", () => {
    // Reference: `absolute right-4 top-4 rounded-sm opacity-70
    // transition-opacity hover:opacity-100 …` — no padding/bg classes.
    expect(DIALOG_CLOSE).toContain("rounded-sm");
    expect(DIALOG_CLOSE).toContain("opacity-70");
    expect(DIALOG_CLOSE).toContain("hover:opacity-100");
    expect(DIALOG_CLOSE).not.toContain("hover:bg-");
    expect(DIALOG_CLOSE).not.toContain("p-1");
  });
});

describe("session-15: dialog body anatomy — groups and wrappers (S15-P7/P8)", () => {
  it("max-w-lg family field groups are space-y-2 with the v4 controlMt fix", () => {
    // Reference Lead/Account/Contact groups: `<div class="space-y-2">` —
    // computed 12px label→control gap / 28px top-to-top (the SAME
    // geometry as the s14 settings fix). Under v4 the literal space-y-2
    // collapses on the INLINE label — the established fix is the
    // explicit mt-2 on the control.
    expect(DIALOG_GROUP.group).toBe("space-y-2");
    expect(DIALOG_GROUP.controlMt).toBe("mt-2");
  });

  it("max-w-2xl family field pairs are BARE (unclassed) — 4px natural gap", () => {
    // Reference Event/Activity single fields + grid cells: unclassed
    // divs, label + control as direct children (computed 4px gap —
    // no space-y, no mt).
    expect(DIALOG_BARE_GROUP).toBe("");
  });

  it("the fields wrapper is a py-4 grid inside the form (S15-P8 -> S71-P4: only the CONSUMED .lead key survives)", () => {
    // Reference Lead: form > `div.grid.gap-4.py-4` > groups; Contact:
    // `div.grid.gap-6.py-4`; Account: `div.grid.grid-cols-2.gap-4.py-4`.
    // Session-71 (N-71d3): the .contact/.account records retired —
    // ZERO consumers since their s15 birth (the dialogs carry their
    // own body constants; only the lead form rides the wrapper
    // record — entity-dialogs.tsx:656). The N-57 zero-consumer class.
    expect(DIALOG_FIELDS_WRAPPER.lead).toBe("grid gap-4 py-4");
    expect(DIALOG_FIELDS_WRAPPER).not.toHaveProperty("contact");
    expect(DIALOG_FIELDS_WRAPPER).not.toHaveProperty("account");
  });

  it("the Lead Status + Source pair is a 2-col grid (S15-P9)", () => {
    // Reference: `grid grid-cols-2 gap-4` — 162px cells even at 390.
    expect(LEAD_DIALOG.statusSourceGrid).toBe("grid grid-cols-2 gap-4");
  });

  it("the dialog textarea is min-h-[60px] rounded-md", () => {
    // Reference Event/Activity Description: `flex min-h-[60px] w-full
    // rounded-md …` — ours shipped min-h-[72px] rounded-lg.
    expect(DIALOG_TEXTAREA).toContain("min-h-[60px]");
    expect(DIALOG_TEXTAREA).toContain("rounded-md");
    expect(DIALOG_TEXTAREA).not.toContain("min-h-[72px]");
    expect(DIALOG_TEXTAREA).not.toContain("rounded-lg");
  });
});

describe("session-15: per-dialog bodies (S15-P9..P13)", () => {
  it("the Account dialog body is 2-column (S15-P10)", () => {
    // Pairs: Name/Industry, Email/Phone, Website/Annual Revenue,
    // Employees/Status — inside `grid grid-cols-2 gap-4 py-4`.
    expect(ACCOUNT_DIALOG.body).toBe("grid grid-cols-2 gap-4 py-4");
  });

  it("the Contact dialog ships the avatar section (S15-P11)", () => {
    // `flex flex-col items-center gap-4 pb-4 border-b` with the w-24
    // h-24 gradient circle (from-blue-500 to-blue-700), the initials
    // span (text-white font-bold text-3xl), the camera button (w-8 h-8
    // bg-white rounded-full shadow-md, lucide-camera w-4 h-4
    // text-blue-600), a hidden file input — and the Name field INSIDE
    // the section (w-full space-y-2).
    expect(CONTACT_DIALOG.body).toBe("grid gap-6 py-4");
    expect(CONTACT_AVATAR.section).toBe("flex flex-col items-center gap-4 pb-4 border-b");
    expect(CONTACT_AVATAR.circle).toContain("w-24 h-24 rounded-full");
    expect(CONTACT_AVATAR.circle).toContain("bg-gradient-to-br from-blue-500 to-blue-700");
    expect(CONTACT_AVATAR.initials).toBe("text-white font-bold text-3xl");
    expect(CONTACT_AVATAR.camera).toContain("w-8 h-8 bg-white rounded-full");
    expect(CONTACT_AVATAR.cameraIcon).toBe("w-4 h-4 text-blue-600");
    expect(CONTACT_AVATAR.nameGroup).toBe("w-full space-y-2");
    // The Email/Phone + Company/Position pairs are space-y-4 groups.
    expect(CONTACT_DIALOG.pairGroup).toBe("space-y-4");
  });

  it("the Event dialog is the wide family with the blue submit (S15-P12)", () => {
    // max-w-2xl (672px), form space-y-4, bare single fields, two
    // grid-cols-2 pairs (Type+Status, Start+End), Related To ALONE in a
    // grid-cols-2, footer DIALOG_FOOTER_WIDE, submit bg-blue-600
    // hover:bg-blue-700 (the only blue submit on the reference).
    expect(EVENT_DIALOG.content).toBe("max-w-2xl");
    expect(EVENT_DIALOG.form).toBe("space-y-4");
    expect(EVENT_DIALOG.pair).toBe("grid grid-cols-2 gap-4");
    expect(EVENT_DIALOG.relatedToAlone).toBe("grid grid-cols-2 gap-4");
    // The reference's bg-blue-600/bg-blue-700 (v3 #2563eb/#1d4ed8) is
    // expressed through our --primary/--primary-hover TOKENS — the literal
    // v4 bg-blue-600 class compiles to a DIFFERENT oklch blue
    // (rgb(21,93,252)), a session-15 v4 hazard.
    expect(EVENT_DIALOG.submit).toBe(
      "bg-primary text-primary-foreground shadow hover:bg-primary-hover",
    );
  });

  it("the Activity dialog is the wide family with the dark submit (S15-P13)", () => {
    expect(ACTIVITY_DIALOG.content).toBe("max-w-2xl");
    expect(ACTIVITY_DIALOG.form).toBe("space-y-4");
    expect(ACTIVITY_DIALOG.pair).toBe("grid grid-cols-2 gap-4");
  });
});

describe("session-15: no description, no invented placeholders (S15-P4/P14)", () => {
  it("the create dialogs render NO DialogDescription", () => {
    // Reference headers render ONLY the h2 — zero <p> elements in any of
    // the five create dialogs (verified 2026-09-30). The scan-card dialog
    // on contacts keeps its description (our unverifiable superset).
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/shared/entity-dialogs.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/<DialogDescription/);
  });

  it("the create dialogs carry NO placeholder attributes — except the contact Name field's John Doe (S30-P2)", () => {
    // s15: `placeholder="` count = 0 across all five reference dialog
    // dumps. Session-30 (S30-P2): the AAe contact Name field DOES carry
    // placeholder="John Doe" (bundle-extracted + live-verified — the
    // s15 dump missed it); the pin now allows exactly that one, and
    // nothing else.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/shared/entity-dialogs.tsx"),
      "utf8",
    );
    const placeholders = [...src.matchAll(/placeholder="([^"]*)"/g)].map((m) => m[1]);
    expect(placeholders, "only the contact Name placeholder is allowed").toEqual([
      "John Doe",
    ]);
  });
});

describe("session-16: the page-root model — padding belongs to the page (S16-P1/P2)", () => {
  it("PAGE_ROOT.standard: six pages ship p-4 sm:p-8 + bg + min-height", () => {
    // dashboard, accounts, calendar, activities, reports, settings.
    // bg-background (#f9fafb) computes equal to the reference's literal
    // bg-gray-50 — canvas pixel-verified rgb(249,250,251) on both apps
    // (no literal-palette drift for gray-50 under our v4).
    expect(PAGE_ROOT.standard).toBe("p-4 sm:p-8 bg-background min-h-screen");
  });

  it("PAGE_ROOT.bare: Leads + Profile drop the bg + min-height (the reference's own quirk)", () => {
    // The reference's Leads and Profile roots are just `p-4 sm:p-8` —
    // main's own gray-50 fills the gap below short content.
    expect(PAGE_ROOT.bare).toBe("p-4 sm:p-8");
  });

  it("the AppShell never pads pages (the wrapper retired at the source level)", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/layout/app-shell.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/SHELL_LAYOUT\.inner/);
    expect(src).toMatch(/<main[^>]*>\{children\}/);
  });

  it("every page renders its own root wrapper (source-level)", () => {
    const standard = [
      "../src/app/(app)/page.tsx",
      "../src/app/(app)/accounts/accounts-page.tsx",
      "../src/app/(app)/calendar/calendar-page.tsx",
      "../src/app/(app)/activities/activities-page.tsx",
      "../src/app/(app)/reports/reports-page.tsx",
      "../src/app/(app)/settings/settings-page.tsx",
    ];
    for (const rel of standard) {
      const src = readFileSync(path.resolve(import.meta.dirname, rel), "utf8");
      expect(src, rel).toMatch(/PAGE_ROOT\.standard/);
    }
    const bare = [
      "../src/app/(app)/leads/leads-page.tsx",
      "../src/app/(app)/profile/profile-page.tsx",
    ];
    for (const rel of bare) {
      const src = readFileSync(path.resolve(import.meta.dirname, rel), "utf8");
      expect(src, rel).toMatch(/PAGE_ROOT\.bare/);
    }
  });

  it("contacts: the full-height layout IS the page root (no padding wrapper)", () => {
    // Reference: main > flex h-[calc(100vh-64px)] directly — the padding
    // lives inside its flex-1 overflow-auto > p-8 scroller. Ours wrapped
    // the h-calc box in the shell padding (the S16-P1 double-pad).
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/contacts/contacts-page.tsx"),
      "utf8",
    );
    // The return opens with the fullHeight div (contract comments may
    // sit between `return (` and the element — allowed, wrappers are not).
    expect(src).toMatch(
      /return \(\s*(?:\/\/[^\n]*\n\s*)*<div className=\{CONTACTS_LAYOUT\.fullHeight\}>/,
    );
    expect(src).not.toMatch(/PAGE_ROOT/);
  });
});

describe("session-16: the table kit on stock strings (S16-P3/P4)", () => {
  const tableSrc = readFileSync(
    path.resolve(import.meta.dirname, "../src/components/ui/table.tsx"),
    "utf8",
  );

  it("the Table container is the stock overflow-auto (no scrollbar-thin, no x-only)", () => {
    // Strip comments first — the contract comments document the retired
    // classes and must not satisfy (or trip) the source pins.
    const noComments = tableSrc
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");
    expect(noComments).toMatch(/relative w-full overflow-auto/);
    expect(noComments).not.toMatch(/overflow-x-auto/);
    expect(noComments).not.toMatch(/scrollbar-thin/);
  });

  it("TableHead carries the stock checkbox variant classes", () => {
    expect(tableSrc).toMatch(
      /\[&:has\(\[role=checkbox\]\)\]:pr-0 \[&>\[role=checkbox\]\]:translate-y-\[2px\]/,
    );
    // The head string still ships the s6 density + the muted ink.
    expect(tableSrc).toMatch(/h-10 px-2 text-left align-middle font-medium/);
  });

  it("TableCell carries the stock checkbox variant classes", () => {
    expect(tableSrc).toMatch(/p-2 align-middle/);
    expect(tableSrc.match(/\[&:has\(\[role=checkbox\]\)\]:pr-0/g)?.length).toBe(2);
  });

  it("TableRow: hover /50 + the selected state (the stock pair, token-spelled)", () => {
    // The reference's stock `hover:bg-muted/50 data-[state=selected]:bg-muted`
    // — its muted SURFACE is our line-soft (#f5f5f5, the s14 re-pin); ours
    // shipped /60 opacity and no selected state.
    expect(tableSrc).toMatch(/hover:bg-line-soft\/50/);
    expect(tableSrc).toMatch(/data-\[state=selected\]:bg-line-soft/);
    expect(tableSrc).not.toMatch(/hover:bg-line-soft\/60/);
  });
});

describe("session-16: TABLE_CARD surfaces are plain divs (S16-P5)", () => {
  it("no TABLE_CARD surface renders through the Card primitive (the border leak)", () => {
    // Card's base ships `border border-line`; cn() never removes it
    // (tailwind-merge replaces same-property classes only), so every
    // <Card className={cn(TABLE_CARD.card, …)}> computed a 1px border —
    // the reference's accounts/leads/activities cards are plain
    // borderless `bg-white rounded-lg shadow [p-6]` divs.
    const surfaces = [
      "../src/app/(app)/accounts/accounts-page.tsx",
      "../src/app/(app)/leads/leads-page.tsx",
      "../src/app/(app)/activities/activities-page.tsx",
    ];
    for (const rel of surfaces) {
      const src = readFileSync(path.resolve(import.meta.dirname, rel), "utf8");
      expect(src, rel).not.toMatch(/<Card className=\{cn\(TABLE_CARD\.card/);
    }
  });

  it("the accounts/leads cards drop the invented overflow-hidden", () => {
    // The reference ships NO overflow-hidden on those cards (the
    // contacts bordered card is the only overflow-hidden table card).
    for (const rel of [
      "../src/app/(app)/accounts/accounts-page.tsx",
      "../src/app/(app)/leads/leads-page.tsx",
    ]) {
      const src = readFileSync(path.resolve(import.meta.dirname, rel), "utf8");
      expect(src, rel).toMatch(/<div className=\{TABLE_CARD\.card\}>/);
    }
  });
});

describe("session-16: the calendar card internals (S16-P7)", () => {
  it("header row, title, nav — the flat anatomy", () => {
    expect(CALENDAR_CARD.headerRow).toBe("flex items-center justify-between mb-6");
    expect(CALENDAR_CARD.title).toBe("text-xl sm:text-2xl font-bold text-gray-900");
    expect(CALENDAR_CARD.navRow).toBe("flex gap-2");
  });

  it("the DOW row is its own grid with responsive labels", () => {
    expect(CALENDAR_CARD.dowGrid).toBe("grid grid-cols-7 gap-1 sm:gap-2 mb-2");
    expect(CALENDAR_CARD.dowLabel).toBe(
      "text-center text-xs sm:text-sm font-semibold text-gray-600 py-2",
    );
  });

  it("the month grid is separate with the responsive gap", () => {
    expect(CALENDAR_CARD.monthGrid).toBe("grid grid-cols-7 gap-1 sm:gap-2");
  });

  it("the calendar page renders the split grids, not the merged 42-kid grid", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/calendar/calendar-page.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/grid grid-cols-7 gap-1 text-center/);
    expect(src).toMatch(/CALENDAR_CARD\.dowGrid/);
    expect(src).toMatch(/CALENDAR_CARD\.monthGrid/);
    expect(src).toMatch(/CALENDAR_CARD\.dowLabel/);
  });
});

describe("session-16: the settings picklist grid breaks at md (S16-P6)", () => {
  it("the grid is md:grid-cols-2 — 2 columns from 768px", () => {
    // Ours shipped lg:grid-cols-2 (1 column at 768-1023px, 580px cards)
    // where the reference renders 2 columns (282px cards) — a
    // mid-width-only divergence invisible to 390/1512 probes.
    expect(SETTINGS_GRID).toBe("grid grid-cols-1 md:grid-cols-2 gap-4");
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/settings/settings-page.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/lg:grid-cols-2/);
  });
});

// ---------------------------------------------------------------------------
// Session 17 (S17-P1..P5): the stock button/checkbox layer + the icon-glyph
// census. Every pin below was extracted from the LIVE reference DOM
// (2026-09-30): the topbar account trigger (stock ghost Button + two-level
// Avatar), the icon glyph census (SVG path data, all nine pages), the
// checkbox anatomy (every filter rail: accounts 4 / calendar 10 / activities
// 5 stock Radix button checkboxes), the default variant's bare shadow and
// the ghost variant's missing text color.
// ---------------------------------------------------------------------------

describe("session-17: the topbar account trigger renders via the stock ghost Button (S17-P1)", () => {
  it("topbar.tsx uses Button variant=ghost through MenuTrigger asChild", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/layout/topbar.tsx"),
      "utf8",
    );
    expect(src).toMatch(/<Button[^>]*variant="ghost"[^>]*TOPBAR_LAYOUT\.userButton/);
    expect(src).not.toMatch(/<button[^>]*className=\{TOPBAR_LAYOUT\.userButton\}/);
  });

  it("the avatar is the two-level stock structure (root + fallback)", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/layout/topbar.tsx"),
      "utf8",
    );
    expect(src).toMatch(/TOPBAR_LAYOUT\.userAvatarRoot/);
    expect(src).toMatch(/TOPBAR_LAYOUT\.userAvatarFallback/);
    expect(src).not.toMatch(/userAvatar[^RF]/);
  });
});

describe("session-17: the sidebar nav glyphs (S17-P2a)", () => {
  it("nav-config ships Users / CircleUser / Calendar — the reference's exact glyphs", () => {
    // Reference sidebar: Accounts = `users` (TWO-person glyph), Contacts =
    // `circle-user` (head r=3 + shoulders path), Calendar = `calendar`
    // (blank body — no day dots). Ours shipped User (one person),
    // CircleUserRound (rounder head r=4 + arc) and CalendarDays (6 dots).
    // All three reference glyphs are exported by lucide-react 0.525 under
    // the renamed canonical names (path-verified byte-equal).
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/layout/nav-config.ts"),
      "utf8",
    );
    expect(src).toMatch(/^\s*Users,$/m);
    expect(src).toMatch(/^\s*CircleUser,$/m);
    expect(src).toMatch(/^\s*Calendar,$/m);
    expect(src).not.toMatch(/^\s*CircleUserRound,$/m);
    expect(src).not.toMatch(/^\s*CalendarDays,$/m);
    expect(src).not.toMatch(/^\s*User,$/m);
    expect(src).not.toMatch(/icon: User[,}]/);
    expect(src).not.toMatch(/icon: CircleUserRound/);
    expect(src).not.toMatch(/icon: CalendarDays/);
  });
});

describe("session-17: the polygon Filter glyph (S17-P2b)", () => {
  it("the FilterPolygon component renders the reference's old-lucide polygon", () => {
    // The reference's Filter/Filters buttons ship the OLD lucide `filter`
    // — the straight-edged polygon funnel. lucide-react 0.525 re-exports
    // the redesigned curved Funnel AS Filter; the polygon glyph is not
    // exported under any name, so it lives here as a hand-rolled SVG.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/icons.tsx"),
      "utf8",
    );
    expect(src).toContain('points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"');
    expect(src).toMatch(/function FilterPolygon/);
  });

  it("dashboard, leads and contacts use FilterPolygon for their filter buttons", () => {
    for (const rel of [
      "../src/app/(app)/page.tsx",
      "../src/app/(app)/leads/leads-page.tsx",
      "../src/app/(app)/contacts/contacts-page.tsx",
    ]) {
      const src = readFileSync(path.resolve(import.meta.dirname, rel), "utf8");
      expect(src, rel).toMatch(/<FilterPolygon/);
      // the lucide Filter (curved Funnel re-export) must not be rendered
      expect(src, rel).not.toMatch(/<Filter[\s>]/);
      expect(src, rel).not.toMatch(/import[^;]*\bFilter\b[^P][^;]*lucide-react/);
    }
  });
});

describe("session-17: the remaining glyph swaps (S17-P2c-f)", () => {
  it("contacts: Scan (not ScanLine) and Download (not Upload) on the toolbar", () => {
    // The reference's Scan Card ships `scan` (4 corner brackets, NO
    // center line) and its Import button ships a DOWNLOAD glyph (the
    // reference's own quirk — an import affordance with a download icon).
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/contacts/contacts-page.tsx"),
      "utf8",
    );
    expect(src).toMatch(/<Scan /);
    expect(src).not.toMatch(/<ScanLine|ScanLine,/);
    expect(src).toMatch(/<Download /);
    // Session-26 refinement: the no-Upload rule is scoped to the TOOLBAR
    // Import button (the page-header action row) — the rebuilt import
    // DIALOG's dropzone legitimately ships the reference's `lucide-upload
    // w-8 h-8 text-gray-400` glyph (live DOM probe, S26-P6). The toolbar
    // Import button keeps the Download quirk.
    const toolbar = src.slice(src.indexOf("actions={"), src.indexOf("<ContactDialog open"));
    const importBtn = toolbar.slice(toolbar.indexOf("setImportOpen(true)"));
    expect(importBtn.slice(0, 400)).toMatch(/<Download className="h-4 w-4"/);
    expect(importBtn.slice(0, 400)).not.toMatch(/<Upload /);
  });

  it("leads chips: CircleCheckBig (Won Deals) + Calendar (Avg. Sales Cycle)", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/leads/leads-page.tsx"),
      "utf8",
    );
    expect(src).toMatch(/<CircleCheckBig /);
    expect(src).not.toMatch(/<CheckCircle2|CheckCircle2,/);
    expect(src).not.toMatch(/<CalendarDays|CalendarDays,/);
  });

  it("calendar chips: Calendar (Today's Events) + Users (Meetings This Week)", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/calendar/calendar-page.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/<CalendarDays|CalendarDays,/);
    expect(src).toMatch(/icon=\{<Users className="h-5 w-5" \/>\}/);
  });

  it("activities quick-log: Calendar (Log Meeting) + MessageSquare (Log WhatsApp)", () => {
    // Reference: Log Meeting ships `calendar` (ours: Video — an invented
    // video affordance), Log WhatsApp ships `message-square` (ours:
    // message-circle — the round bubble).
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/activities/activities-page.tsx"),
      "utf8",
    );
    expect(src).toMatch(/label: "Log Meeting", icon: Calendar/);
    expect(src).toMatch(/label: "Log WhatsApp", icon: MessageSquare/);
    expect(src).not.toMatch(/<Video |  Video,/);
    expect(src).not.toMatch(/<MessageCircle|  MessageCircle,/);
  });
});

describe("session-17: the stock checkbox anatomy (S17-P3)", () => {
  it("the CHECKBOX contract carries the stock Radix string with the dark primary", () => {
    // Reference checkbox: `peer h-4 w-4 shrink-0 rounded-sm border
    // border-primary shadow … data-[state=checked]:bg-primary
    // data-[state=checked]:text-primary-foreground` — its platform
    // --primary computes #171717 (DARK, not the app blue) with the check
    // indicator at #fafafa, so the computed-equal expression is
    // neutral-900 / neutral-50. The shadow is the BARE scale (verified
    // rgba(0,0,0,.1) 0 1px 3px 0 … on the reference).
    expect(CHECKBOX.control).toBe(
      "peer h-4 w-4 shrink-0 rounded-sm border border-neutral-900 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neutral-900 data-[state=checked]:text-neutral-50",
    );
    expect(CHECKBOX.indicator).toBe("flex items-center justify-center text-current");
  });

  it("the row + label strings match the reference rails", () => {
    expect(CHECKBOX.row).toBe("flex items-center space-x-2");
    expect(CHECKBOX.label).toBe("text-sm cursor-pointer");
  });

  it("label.tsx no longer ships a native input checkbox — the button primitive replaces it", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/label.tsx"),
      "utf8",
    );
    expect(src).not.toContain('type="checkbox"');
    expect(src).toMatch(/role="checkbox"/);
    expect(src).toMatch(/data-state=/);
    expect(src).toMatch(/onCheckedChange/);
    expect(src).toMatch(/CHECKBOX\.control/);
  });

  it("every call site uses the onCheckedChange API (no e.target.checked)", () => {
    for (const rel of [
      "../src/app/(app)/accounts/accounts-page.tsx",
      "../src/app/(app)/calendar/calendar-page.tsx",
      "../src/app/(app)/activities/activities-page.tsx",
    ]) {
      const src = readFileSync(path.resolve(import.meta.dirname, rel), "utf8");
      expect(src, rel).not.toMatch(/<Checkbox[^>]*onChange=/);
      expect(src, rel).not.toMatch(/e\.target\.checked/);
    }
  });
});

describe("session-17: the Button variant corrections (S17-P4/P5)", () => {
  it("the default variant carries the BARE shadow scale (not shadow-sm)", () => {
    // Reference blue primaries (New Account/Lead/Event/Contact + the
    // activities Filter): `… shadow … bg-blue-600 hover:bg-blue-700` —
    // computed rgba(0,0,0,.1) 0 1px 3px 0, rgba(0,0,0,.1) 0 1px 2px -1px.
    // Ours shipped shadow-sm (one step light under the s9-re-pinned
    // scale). Outline buttons stay shadow-sm on both.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/button.tsx"),
      "utf8",
    );
    expect(src).toMatch(/default: "bg-primary text-primary-foreground shadow hover:bg-primary-hover"/);
  });

  it("the ghost variant carries NO base text color (stock ghost)", () => {
    // The reference's ghost = stock shadcn `hover:bg-accent
    // hover:text-accent-foreground` with NO text-* class — its one
    // text-bearing ghost ("Save All") renders the inherited #0a0a0a.
    // Ours added text-muted → gray. Computed-equal expression keeps our
    // hover tokens.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/button.tsx"),
      "utf8",
    );
    expect(src).toMatch(/ghost: "hover:bg-line-soft hover:text-foreground"/);
    expect(src).not.toMatch(/ghost: "text-muted/);
  });
});

describe("session-33 parity pins (the filter-bar search + the header trio)", () => {
  it("FILTER_BAR pins the search placeholder — the reference's DEAD input (S33-P1)", () => {
    // The s33 bundle decode: the reference's dashboard filter-bar search
    // renders c.jsx(Ct,{placeholder:"Stage: Source",className:"pl-9 h-9"})
    // with NO value/onChange — the same dead-input family as the s32
    // topbar "Search Anything..." decode. Ours is FUNCTIONAL (it filters
    // the Recent Deals rows) — the documented superset, now pinned.
    expect(FILTER_BAR.searchPlaceholder).toBe("Stage: Source");
  });

  it("DASHBOARD_HEADER pins the FULL trio: Add + outline Export + blue Export (S33-P2)", () => {
    // The s33 bundle decode: the reference's dashboard header ships
    // THREE adjacent buttons — Add (outline, label hidden below sm),
    // Export (outline, label hidden below sm), Export (bg-blue-600
    // hover:bg-blue-700, bare always-visible label) — and ALL THREE are
    // DEAD there (no onClick in the bundle; the §16c dead-list covered
    // only the Exports + the login Sign up link). Ours keeps the exact
    // visual with functional superset jobs (quick-create menu / export
    // menu / one-click export).
    expect(DASHBOARD_HEADER.addLabel).toBe("Add");
    expect(DASHBOARD_HEADER.addLabelClass).toBe("hidden sm:inline");
    expect(DASHBOARD_HEADER.outlineExportLabel).toBe("Export");
    expect(DASHBOARD_HEADER.outlineExportLabelClass).toBe("hidden sm:inline");
    expect(DASHBOARD_HEADER.primaryExportLabel).toBe("Export");
    expect(DASHBOARD_HEADER.primaryExportLabelClass).toBe("");
  });
});

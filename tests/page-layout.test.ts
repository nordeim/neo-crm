import { describe, expect, it } from "vitest";
import {
  ACTIVITY_CARD,
  ACTIVITY_QUICKLOG,
  BUTTON_BASE,
  CARD,
  DASHBOARD_CARD,
  DASHBOARD_HEADER,
  DIALOG_SUBMIT,
  EMPTY_STATE,
  FILTER_BAR,
  FILTER_RAIL,
  INPUT_BASE,
  LEADS_FILTERS_POPOVER,
  LEADS_TOOLBAR,
  LOGIN_LAYOUT,
  MOBILE_NAV_LAYOUT,
  NAV_LAYOUT,
  PAGE_HEADER,
  PAGE_KPI_GRIDS,
  PAGE_TITLES,
  SEARCH_INPUT,
  SELECT_TRIGGER,
  CHART_GEOMETRY,
  CONTACTS_LAYOUT,
  PROFILE_LAYOUT,
  RAIL_LAYOUT,
  RECENT_DEALS,
  REPORTS_FILTER_BAR,
  REPORTS_TABLE_CARD,
  SETTINGS_PICKLIST,
  SHELL_LAYOUT,
  STAT_SHADOWS,
  TABLE_SHADOWS,
  STAT_CARD,
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
    expect(PAGE_HEADER.settings.title).toBe("text-3xl font-bold text-foreground");
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
    expect(CARD.title).toBe("font-semibold tracking-tight text-base sm:text-lg");
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

  it("the dashboard/reports KPI cards hover (S11-P3)", () => {
    // DOM: `rounded-xl bg-card text-card-foreground shadow border
    // border-gray-200 hover:shadow-md transition-shadow` on BOTH the
    // dashboard and the reports KPI rows.
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

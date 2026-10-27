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
  KPI_SPARK,
  KPI_VALUE,
  APP_FOOTER,
  LEADS_FILTERS_POPOVER,
  LEADS_TOOLBAR,
  LOGIN_LAYOUT,
  MENU_CONTENT,
  MENU_ITEM,
  MOBILE_NAV_LAYOUT,
  MOBILE_NAV_SHEET,
  MOBILE_NAV_TRIGGER,
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
  STAT_SHADOWS,
  TABS_PILL,
  TABS_SEGMENTED,
  TABLE_SHADOWS,
  TABLE_CARD,
  TABLE_TOOLBAR,
  TOP_REPS,
  TOPBAR_LAYOUT,
  allLayoutClasses,
} from "@/lib/page-layout";

/** Session-90: the raw-source reader for the construction-retirement
 * pins (the STAT_CARD/KPI_CHIP_BG re-anchors read the source, not the
 * module — the tokens retire with zero consumers). */
const read = (p: string) =>
  readFileSync(path.resolve(import.meta.dirname, "..", p), "utf8");

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

describe("session-143: the app-shell footer (F-143c1 — the 11-page main-level footer)", () => {
  it("APP_FOOTER — the byte-censused construction (walk33, live at 1440x900)", () => {
    // The reference renders a footer INSIDE main after the page wrapper on
    // ALL 11 app pages (dashboard, accounts, contacts, leads, calendar,
    // activities, reports, settings, profile, about, contact) —
    // byte-extracted from its live DOM. Below the 900px fold on 10 pages;
    // on profile above-fold at viewport 823 (its white bg a 6-channel
    // delta under the sweep's 12 tolerance — the text/border pixels ride
    // inside profile's 0.17% baseline).
    expect(APP_FOOTER.footer).toBe(
      "border-t border-gray-200 bg-white px-4 sm:px-8 py-4 text-sm text-gray-500 flex flex-wrap items-center gap-x-5 gap-y-2",
    );
    expect(APP_FOOTER.link).toBe("hover:text-gray-800 transition-colors");
    expect(APP_FOOTER.copyright).toBe("© 2026 NEO CRM");
    expect(APP_FOOTER.about).toEqual({ href: "/About", label: "About" });
    expect(APP_FOOTER.contact).toEqual({ href: "/Contact", label: "Contact" });
  });

  it("the AppShell renders the footer INSIDE main, AFTER the page children (the reference's placement)", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/layout/app-shell.tsx"),
      "utf8",
    );
    // the exact mount: <main>{children}<footer …> — the footer a sibling
    // of the page wrapper, a direct child of the main scroller
    expect(src).toMatch(
      /<main className=\{SHELL_LAYOUT\.main\}>\s*\{children\}\s*<footer className=\{APP_FOOTER\.footer\}>/,
    );
    expect(src).toContain("<span>{APP_FOOTER.copyright}</span>");
    expect(src).toContain("href={APP_FOOTER.about.href}");
    expect(src).toContain("href={APP_FOOTER.contact.href}");
  });
});

describe("session-144 → session-147: the guest chrome + the marketing group (F-144c1 → F-147c2 — the posture REVERSED upstream)", () => {
  it("APP_GUEST_USER — the guest topbar contract retired with the re-gating (the reference now login-walls its marketing pages)", () => {
    // Session-147 (F-147c2): the reference's new bundle client-redirects
    // guests on /About + /Contact to /login?from_url=<abs> (walk37,
    // reproduced 3 passes + the from_url round-trip verified). The s144
    // guest-serving posture — the full app chrome + "Hi, Guest" + the
    // gray-200 "G" avatar fed by APP_GUEST_USER — retired with it: no
    // layout feeds the contract anymore. The Topbar's own fallback
    // chain (user?.name || user?.email || "Guest") stays as null-safety.
    const pageLayout = read("src/lib/page-layout.ts");
    expect(pageLayout).not.toContain("APP_GUEST_USER");
    const marketing = read("src/app/(marketing)/layout.tsx");
    expect(marketing).not.toContain("APP_GUEST_USER");
  });

  it("the (marketing) layout GUARDS — the GuestLoginRedirect shim (the F-147c2 mirror; the s144 no-redirect contract retired)", () => {
    const src = read("src/app/(marketing)/layout.tsx");
    expect(src).toContain("getSessionUser()");
    expect(src).toContain("GuestLoginRedirect");
    // THE F-147c2 CONTRACT: guests get the shim, never the shell
    expect(src).toMatch(/if \(!user\)\s*return\s*<GuestLoginRedirect \/>/);
    expect(src).not.toMatch(/user \?\? APP_GUEST_USER/);
  });

  it("the (app) group's guard — the SAME shim (the from_url mirror on both groups; the 307 retired)", () => {
    const src = read("src/app/(app)/layout.tsx");
    // Session-147: the reference's client guard carries from_url on the
    // CRM pages too (guest /Dashboard → /login?from_url=…/Dashboard,
    // post-login → /Dashboard). The server 307 became the shim — the
    // session decision stays server-side (guests never receive the CRM
    // page HTML; the shim renders instead of the shell).
    expect(src).toContain("GuestLoginRedirect");
    expect(src).not.toContain('redirect("/login")');
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
    // Session-73 (L-73c3): the reference's header carries the EXPLICIT
    // border-gray-200 family (#e5e7eb — our --color-line-strong token;
    // border-line #e5e5e5 was one family off, the S12-P3 inventory's
    // own omission).
    expect(TOPBAR_LAYOUT.header).toBe("bg-surface border-b border-line-strong px-4 sm:px-8 py-4");
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

  it("mail/bell are the STOCK ghost icon Buttons (S73-P2) — the record's class era retired", () => {
    // Session-73 (S73-P2, L-73c1/c2/c9): the reference renders
    // `<Button variant="ghost" size="icon" className="text-gray-600
    // hidden sm:flex">` — the stock base supplies the h-9 w-9, the
    // rounded-md, the hover pair AND the [&_svg]:size-4 cascade (the
    // icons COMPUTE 16px under their w-5 h-5 class noise — LIVE-
    // measured on the reference). The hand-rolled iconButton record
    // (text-muted, 20px icons, no focus ring) is RETIRED — the parity
    // pins live in tests/topbar-rowmenu-parity.test.ts.
    expect((TOPBAR_LAYOUT as Record<string, unknown>).iconButton).toBeUndefined();
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
    // only adds the flex/gap composition (the reference's chevron
    // carries NO margin; the s82 base retirement removed the
    // trailing-chevron neutralizer the iconGap cascade required).
    expect(TOPBAR_LAYOUT.userButton).toBe(
      "flex items-center gap-1 sm:gap-2",
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

  it("the dead userMenu record retired (S73-P2) — MenuContent owns min-w-[8rem]", () => {
    // Session-73 (N-73c4): zero consumers ever read TOPBAR_LAYOUT.
    // userMenu — the stock MenuContent carries MENU_CONTENT's own
    // min-w-[8rem]. The record + this pin retire together.
    expect((TOPBAR_LAYOUT as Record<string, unknown>).userMenu).toBeUndefined();
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
  it("TrendStatCard: the STAT_CARD token family RETIRED at s90 (the construction inlined per the Mx decode)", () => {
    // Session-90 (L-90c3/c5): the TrendStatCard/CircleStatCard mirrors
    // ride the stock Card > CardContent pair with the reference's own
    // inline constructions — the s7-era STAT_CARD token family (card/
    // body/topRow/chip/chipIcon/trend/trendIcon/value/label/reportsCard)
    // retired with zero consumers; the per-component forms are pinned
    // in the statcard-family-parity suite (the s88/s89 precedent for
    // construction rotations).
    const layout = read("src/lib/page-layout.ts") ?? "";
    expect(layout).not.toContain("export const STAT_CARD");
    expect(layout).not.toContain("STAT_CARD");
    expect(layout).not.toContain("KPI_CHIP_BG");
    expect(layout).not.toContain("KPI_ICON_TEXT");
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

  it("dashboard card-header buttons: the ellipsis pair only (the F-151c1 retirement)", () => {
    // Session-151 (F-151c1, walk41): the s7-era ghost Add buttons (the
    // Lead Sources / Upcoming Activities CardHeaders) retired against
    // the CURRENT reference bundle — title-only headers there,
    // live-decoded on both apps at 390 + 1440. The addBtn/addIcon
    // members retired with them; the dashboard-interior-parity suite
    // owns the object-shape freeze + the zero-wiring census.
    expect(DASHBOARD_CARD.ellipsisBtn).toBe("h-8 w-8");
  });

  it("settings picklists: space-y-2 mb-4 items, plain text-sm empty state", () => {
    expect(SETTINGS_PICKLIST.items).toBe("space-y-2 mb-4");
    expect(SETTINGS_PICKLIST.empty).toBe("text-sm text-muted text-center py-4");
    expect(SETTINGS_PICKLIST.addRow).toBe("flex gap-2");
    // The reference's placeholder typo on the Industries card is mirrored.
    expect(SETTINGS_PICKLIST.industriesPlaceholder).toBe("Add new industrie");
  });

  it("session-72: the picklist ITEM ROW is the reference's bordered-row geometry (H-72c1)", () => {
    // The 72-c rotation's bundle decode (ly): each item renders as a
    // bordered list row with a flex-1 name span + the Pencil/Trash2
    // ghost icon pair — NOT a rounded-full chip pill (zero rounded-full
    // classes in the reference's picklist; the 7 bundle hits are all
    // avatars/dots/pills elsewhere). The S12-P8 "chip rows — ALIGNED"
    // record is corrected at session-72.
    expect(SETTINGS_PICKLIST.itemRow).toBe(
      "flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50",
    );
    // The delete icon button carries the reference's red pair.
    expect(SETTINGS_PICKLIST.deleteBtn).toBe("text-red-600 hover:text-red-700");
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

  it("view switcher RETIRED (s148/F-147c3): the contract is gone with both its consumers", () => {
    // S8-2/S8-3 (historical): the reference's Table/Cards switcher
    // rendered with an EMPTY placeholder. Session-148: the reference
    // removed BOTH live instances (the accounts toolbar trigger + the
    // dashboard middle slot — walk38j/walk38k); the contract retired.
    expect(read("src/lib/page-layout.ts")).not.toMatch(/export const VIEW_SWITCHER/);
  });

  it("accounts table toolbar (s148-re-anchored): row + moreBtn only — the Export's class; select/densityOptions retired", () => {
    // walk38j: the post-F-147c3 stack is [search + magnifier][Export
    // CSV] — the trio before the search retired; the Export button
    // keeps the h-8 rounded-md px-3 text-xs outline class.
    expect(TABLE_TOOLBAR.row).toBe("flex flex-col sm:flex-row gap-3");
    expect(TABLE_TOOLBAR.moreBtn).toBe("h-8 rounded-md px-3 text-xs");
    expect(TABLE_TOOLBAR).not.toHaveProperty("select");
    expect(TABLE_TOOLBAR).not.toHaveProperty("densityOptions");
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

  it("the leads Filters field labels are LABEL elements (S113, D-113a1 — the reference renders <label>, ours shipped <span>)", () => {
    // The s113 menu/popover-family LIVE re-walk: the reference's Filters
    // popover renders FOUR <label> elements (cls `text-sm font-medium
    // mb-2 block`, bare + unassociated — the live census) for Status /
    // Source / Min Deal Value / Follow-up Date. Ours shipped the same
    // four as <span>s — real label semantics (the a11y tree + the
    // form-labeling family) is the strict-mirror fix. The bare-label
    // construction byte-matches the reference (no htmlFor on either
    // side — the login-card htmlFor family is the ASSOCIATED genus,
    // this surface the reference's own unassociated one).
    const src = read("src/app/(app)/leads/leads-page.tsx")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");
    for (const labelText of ["Status", "Source", "Min Deal Value", "Follow-up Date"]) {
      expect(src).toContain(
        `<label className={LEADS_FILTERS_POPOVER.fieldLabel}>${labelText}</label>`,
      );
    }
    // The retired span forms — zero survive.
    expect(src).not.toContain(
      `<span className={LEADS_FILTERS_POPOVER.fieldLabel}>`,
    );
  });

  it("Log WhatsApp is the DEFAULT variant + the bare emerald pair (the reference's own construction)", () => {
    // Session-83 (L-83c4): the reference rides the DEFAULT Button
    // variant + className:"bg-emerald-600 hover:bg-emerald-700" — the
    // base's text-primary-foreground keeps the label WHITE on hover.
    // Ours rode ghost + text-white: the ghost's surviving
    // hover:text-foreground flipped the label #0a0a0a on hover over
    // the emerald surface (live-exercisable since the s80 hover
    // un-wrap). The s8 "SOLID emerald" pin (vs ghost-with-no-fill)
    // survives; the construction is now the reference's own.
    expect(ACTIVITY_QUICKLOG.whatsapp).toBe(
      "bg-emerald-600 hover:bg-emerald-700",
    );
  });

  it("settings picklist add buttons are dark neutral-900 (reference bg-primary = rgb(23,23,23))", () => {
    // S8-7: the reference's `bg-primary` resolves to the STOCK shadcn
    // zinc-950 (computed rgb(23,23,23)), not the app's blue-600 token.
    // Session-80 (M-80c1): its Add button's hover is the class-decoded
    // hover:bg-primary/90 — the computed-equal is neutral-900 at 90%
    // alpha, NOT the solid neutral-800 the s8 translation shipped.
    expect(SETTINGS_PICKLIST.addButton).toBe(
      "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 shadow h-9 px-4 py-2",
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

  it("button base: the per-surface svg margins + 1px near-black focus ring", () => {
    // Session-82 (M-82c1): the reference's stock Button base (the
    // bundle's uie, decoded verbatim) ships NO svg-margin arms — its
    // icon-text spacing rides EACH SURFACE'S OWN svg margin class
    // (mr-2 on the header/export family, mr-1 on the compact family).
    // The s9 iconGap invention ([&_svg]:mr-2 + [&_svg:only-child]:mr-0)
    // nullified every per-surface margin on svg+bare-text buttons (the
    // only-child mr-0 at (0,2,1) beats the svg's own (0,1,0) classes —
    // LIVE-measured 0px where the reference computes 4px/8px) and
    // required the topbar's mr-0 neutralizer. RETIRED; the 16px
    // icon-text gap (the s9 measurement) now rides the per-surface
    // mr-2 classes exactly like the reference.
    // S9-16: ring-1 ring-ring focus (reference --ring = 0 0% 3.9%).
    expect(BUTTON_BASE.focusRing).toBe("focus-visible:ring-1 focus-visible:ring-ring");
    // Session-73 (N-73c5 — the L-73c9 carrier): the reference's stock
    // Button base carries [&_svg]:size-4 between pointer-events-none
    // and shrink-0 — the cascade that makes the reference's w-5-h-5-
    // classed Mail/Bell icons COMPUTE 16px (LIVE-measured; specificity
    // (0,1,1) beats the icon's own (0,1,0) size classes).
    expect(BUTTON_BASE.svgSize).toBe("[&_svg]:size-4");
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
    // Session-73 (N-73c6): the reference's stock Input base carries the
    // file:* family (live-dumped on the reference's search input) —
    // latent for us (no type=file input uses the component) but part
    // of the exact stock mirror.
    expect(INPUT_BASE.file).toBe(
      "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    );
  });

  it("dialog submit buttons are DARK neutral-900 (reference stock --primary)", () => {
    // S9-2: computed rgb(23,23,23) on Create Lead / Create Account / Log
    // Activity — same family as the session-8 settings add buttons. Header
    // primary buttons stay blue-600 (bg-primary token).
    // Session-80 (M-80c1): the reference's dialog submits carry the
    // class-decoded hover:bg-primary/90 — the computed-equal is
    // neutral-900 at 90% alpha, not the solid neutral-800.
    expect(DIALOG_SUBMIT.button).toBe(
      "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 shadow h-9 px-4 py-2",
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
    // Walk60 (D-187a2): the reference's avatar glyph carries its color ON
    // THE SVG (text-blue-600 — its DOM `lucide lucide-user w-10 h-10
    // sm:w-12 sm:h-12 text-blue-600`); the h/w-order delta is the standing
    // lucide class-order genus, ours keeps its own order. The color arm
    // moved here from the retired wrapper span at session-187.
    expect(PROFILE_LAYOUT.avatarIcon).toBe("h-10 w-10 sm:h-12 sm:w-12 text-blue-600");
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

  it("select trigger matches the stock shadcn trigger (rounded-md, no gap, transparent, auto width, CLICK focus ring)", () => {
    // S10-2, re-derived session-77 (N-77c11 — the S10-2 pin's model
    // bundle-falsified on the focus form): the reference's Select
    // trigger is stock: rounded-md (6px, not our 8px rounded-lg), NO
    // gap-2 (justify-between only), bg-transparent, placeholder
    // #737373 — and its focus ring is PLAIN focus: (the ring FIRES on
    // mouse click), unlike the Input/Button bases which are
    // focus-visible on BOTH apps (byte-verified session-77). The
    // reference's bundle base also carries w-full; our per-surface
    // w-full additions compute equal on every current surface (270px
    // rails yes / w-full sm:w-32 toolbars) — the per-surface model
    // stays, documented.
    // Session-81 (M-81c3, bundle re-decoded + live-DOM-confirmed on the
    // settings x2 + dashboard x3 selects): the base re-derived to the
    // reference's verbatim construction — NO text color (the trigger
    // inherits the #0a0a0a ink), NO transition-colors, NO placeholder:
    // arm, + the latent ring-offset-background (offset-0 no-op).
    expect(SELECT_TRIGGER.base).toBe(
      "flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-line bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background",
    );
    expect(SELECT_TRIGGER.base).not.toContain("w-full");
    expect(SELECT_TRIGGER.base).not.toContain("gap-2");
    // Session-133 (D-133a1, F-133c1) — the s133-era retirement, REVERSED
    // at session-185 (D-185a1, the walk58 live find): the s133 decode
    // held the reference's trigger carries NO data-[placeholder] arm
    // (the s81 M-81c3 bundle decode, live-confirmed on the density axis
    // — its platform avoided Radix's placeholder state entirely, the
    // N-87c4 fixed no-match "format" value). TWO later facts reversed
    // it: (1) the s133 round's own protected face — the accounts
    // density select — RETIRED upstream at session-148 (F-147c3, the
    // walk38j toolbar sweep: the density select + the switcher + the
    // More button all gone), leaving the retirement protecting nothing
    // while diverging every genuine placeholder-state face; (2) the
    // walk58 two-app census (scripts/walk58-quicklog-dialog-open.ts)
    // proved the reference's CURRENT trigger construction carries the
    // stock arm VERBATIM — `data-[placeholder]:text-muted-foreground` on
    // BOTH walked comboboxes — and its placeholder-state select (the
    // Log Activity dialog's Related To (Type), the "Select type" face)
    // computes the MUTED ink rgb(115,115,115) where ours computed the
    // foreground rgb(10,10,10): the s81-era bundle predates the s147
    // mobile-nav-fix bundle event (probe #119), the current reference
    // build carries the arm. THE CURE: the arm restored in our token
    // expression — data-[placeholder]:text-muted-ink (the s10 pair for
    // its data-[placeholder]:text-muted-foreground; --color-muted-ink:
    // #737373 ≡ its --muted-foreground) — and the composition
    // interpolation restored; the re-walk proves the Related To (Type)
    // face byte-equal on both apps.
    expect(SELECT_TRIGGER.placeholderState).toBe("data-[placeholder]:text-muted-ink");
    expect(
      read("src/components/ui/select.tsx"),
      "the trigger composition must interpolate the placeholder arm (the s185 restoration)",
    ).toContain("${SELECT_TRIGGER.placeholderState}");
    // Session-77 (N-77c11): the ring fires on mouse click — plain
    // focus:, NOT the keyboard-only focus-visible: the S10-2 comment
    // claimed.
    expect(SELECT_TRIGGER.focusRing).toBe("focus:outline-none focus:ring-1 focus:ring-ring");
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
    // the dashboard KPI card's split is pinned in the session-87
    // suite — the s88 N-88a2 comment re-derivation: the old
    // KPI_CARD.card member retired at s87).
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

  it("the topbar icon buttons use the reference's sm:flex (S11-P10) — via the stock Button construction (S73-P2)", () => {
    // DOM: `hidden … sm:flex` (computed display: flex). Ours shipped
    // sm:inline-flex — visually identical on fixed-size buttons, but the
    // computed value differs; aligned for exact parity.
    // Session-73 (S73-P2): the record RETIRED — the reference's exact
    // `text-gray-600 hidden sm:flex` now rides the stock ghost icon
    // Button in topbar.tsx (pinned in tests/topbar-rowmenu-parity.test.ts).
    expect((TOPBAR_LAYOUT as Record<string, unknown>).iconButton).toBeUndefined();
    expect(
      readFileSync(path.resolve(import.meta.dirname, "../src/components/layout/topbar.tsx"), "utf-8"),
    ).toContain('className="text-gray-600 hidden sm:flex"');
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
    // rounded-md px-3 py-1 font-medium … transition-all … text-xs sm:text-sm
    // data-[state=active]:shadow data-[state=active]:bg-blue-50
    // data-[state=active]:text-blue-700`. No h-7 (natural 28px), no
    // hover: (the reference ships NO hover on any tab variant),
    // transition-all (not colors-only).
    // Session-129 (F-129c1): ring-offset-background RETIRED at the
    // visible-offset rides — the DIALOG_CLOSE s11 computed-contract
    // precedent. The reference's own class computes hsl(0 0% 100%) =
    // #ffffff; OUR --color-background is the page bg #f9fafb (the
    // F-119c2 inverted-token genus), so the ride drifts the 2px
    // focus-visible offset halo. The v4 DEFAULT offset color is #fff —
    // byte-equal with the class absent. Live-walked on the segmented
    // trigger at s129 (the resting custom property + the focus halo
    // both live-confirmed); the pill rides the identical class family.
    expect(TABS_PILL.trigger).not.toContain("ring-offset-background");
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
    // rounded-md px-3 py-1 text-sm font-medium … transition-all …
    // data-[state=active]:shadow data-[state=active]:bg-background
    // data-[state=active]:text-foreground`.
    // The ACTIVE pill computes the v3 `shadow` scale (0 1px 3px .1 +
    // 0 1px 2px -1px .1) — the s6 shadow-sm pin was one step light.
    // Session-129 (F-129c1): ring-offset-background RETIRED — the walk's
    // resting --tw-ring-offset-color read #f9fafb on ours vs the
    // reference's hsl(0 0% 100%), and the real focus-visible halo layer
    // rgba(249,250,251,1) 0px 0px 0px 2px vs rgb(255,255,255) — at BOTH
    // viewports. The DIALOG_CLOSE s11 computed-contract precedent: the
    // v4 default offset color #fff computes byte-equal with the class
    // absent (the class itself sets the drifting page-bg token).
    expect(TABS_SEGMENTED.trigger).toContain("text-sm");
    expect(TABS_SEGMENTED.trigger).not.toContain("ring-offset-background");
    expect(TABS_SEGMENTED.trigger).toContain("transition-all");
    expect(TABS_SEGMENTED.trigger).toContain("data-[state=active]:shadow");
    expect(TABS_SEGMENTED.trigger).not.toContain("h-7");
    expect(TABS_SEGMENTED.trigger).not.toContain("hover:");
    // the active shadow must be the BARE scale, not shadow-sm (one step light)
    expect(TABS_SEGMENTED.trigger).not.toContain("data-[state=active]:shadow-sm");
  });

  it("session-125 (F-125c1): the active pill rides the LITERAL bg-white — the reference's token resolves to ITS stock white, ours to the page bg", () => {
    // The 125-c two-app walk's live finding: the active segmented tab
    // computed rgb(249,250,251) on ours vs rgb(255,255,255) on the
    // reference — on BOTH surfaces (/activities + /settings), both
    // widths, the tracks/inactive/geometry all byte-equal. The root
    // cause: the reference's own construction rides
    // data-[state=active]:bg-background, which resolves to ITS stock
    // shadcn zinc background #ffffff; OUR theme deliberately redefined
    // --color-background to #f9fafb (the app's page bg, the F-119c2
    // inverted-token-mapping genus) — the token ride silently drifted
    // 6 rgb units. The fix: the LITERAL, never the divergent token.
    expect(TABS_SEGMENTED.trigger).toContain("data-[state=active]:bg-white");
    expect(TABS_SEGMENTED.trigger).not.toContain("data-[state=active]:bg-background");
  });
});

describe("session-12: dashboard KPI card de-hover + label tokens (S12-P5)", () => {
  it("the KpiCard drops the stale hover pin (the reference moved)", () => {
    // The reference's DASHBOARD KPI cards are now plain stock cards —
    // `rounded-xl border bg-card text-card-foreground shadow` + a
    // CardContent override `p-4 sm:p-6`, NO hover:shadow-md, NO
    // transition-shadow, NO border-gray-200 (rides the #e5e5e5 default).
    // The s11 hover pin applied to a reference state that no longer
    // exists; the REPORTS KPI family (CircleStatCard) keeps its hover.
    // Session-87 (L-87c3): the merged-div KPI_CARD.card member retired
    // with the Card/CardContent split — the stock classes live in the
    // Card component's own base (pinned in the dashboard-kpi-parity
    // suite's Card/CardContent construction pin); the padding rides
    // KPI_CARD.content.
    expect(KPI_CARD.content).toBe("p-4 sm:p-6");
    expect(KPI_CARD.labelRow).toBe("flex justify-between items-start mb-2");
    expect(KPI_CARD.valueRow).toBe("flex items-end gap-2");
    expect("card" in KPI_CARD).toBe(false);
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

  it("the reports KPI cards (CircleStatCard) KEEP hover + gain the strong border (re-anchored at s90)", () => {
    // The reference's reports KPI cards still ship `border-gray-200
    // hover:shadow-md transition-shadow` — the one stat family with the
    // hover treatment. The border rides --color-line-strong (#e5e7eb).
    // Session-90 (L-90c3): the merged reportsCard token retired — the
    // classes ride the stock Card's className prop now.
    const parts = read("src/components/shared/page-parts.tsx") ?? "";
    const block = parts.slice(parts.indexOf("export function CircleStatCard"));
    expect(block).toContain('border border-line-strong hover:shadow-md transition-shadow');
    expect(block).not.toContain("STAT_CARD.reportsCard");
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
    // ResponsiveContainer. Session-74 (L-74c11): the reference's slot
    // carries NO max-width — our max-w-[176px] cap was a scaffold-era
    // invention (the 176px the DOM probe measured was the flex-b
    // shrink, not a class); the record + the cap retired together.
    expect(KPI_SPARK.reportsWrapper).toBe("flex items-end justify-between mt-2");
    expect(KPI_SPARK.reportsSlot).toBe("flex-1 h-12 mr-2");
    expect("reportsMaxWidth" in KPI_SPARK).toBe(false);
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

  it("the icon chips are the color-KEY pair maps post-s90 (the hex-keyed KPI_CHIP_BG retired)", () => {
    // Session-90 (L-90c5): the reference's Mx/ay chips take the color
    // KEY and map to the {bg: bg-*-50, text: text-*-600} pairs — the
    // inline-hex KPI_CHIP_BG/KPI_ICON_TEXT maps retired with zero
    // consumers. The computed -50s are unchanged (blue-50 #eff6ff /
    // orange-50 #fff7ed / green-50 #f0fdf4 / red-50 #fef2f2 /
    // purple-50 #faf5ff — the s88 re-pin's -50 steps).
    const parts = read("src/components/shared/page-parts.tsx") ?? "";
    const map = parts.slice(parts.indexOf("TREND_CHIP"), parts.indexOf("TREND_CHIP") + 500);
    expect(map).toContain('bg: "bg-blue-50"');
    expect(map).toContain('bg: "bg-green-50"');
    expect(map).toContain('bg: "bg-purple-50"');
    expect(map).toContain('bg: "bg-orange-50"');
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
    // focus:ring-slate-500` navigating to `/`. Session-194 (D-194a3):
    // the icon is the reference's heroicons home OUTLINE inlined — the
    // bare `w-4 h-4 mr-2` class (the reference's exact w/h order, the
    // lucide-house prefix retired at this one site).
    expect(NOT_FOUND_LAYOUT.homeButton).toContain("bg-white border border-slate-200 rounded-lg");
    expect(NOT_FOUND_LAYOUT.homeButton).toContain("text-slate-700");
    expect(NOT_FOUND_LAYOUT.homeButton).toContain("focus:ring-slate-500");
    expect(NOT_FOUND_LAYOUT.homeIcon).toBe("w-4 h-4 mr-2");
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
      path.resolve(import.meta.dirname, "../src/app/(app)/dashboard/page.tsx"),
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
    // neutral-900, fg #fafafa = neutral-50, hover the /80 alpha arm —
    // session-80).
    expect(PROFILE_LAYOUT.badge).toContain("rounded-md border");
    expect(PROFILE_LAYOUT.badge).toContain("px-2.5 py-0.5 text-xs font-semibold");
    expect(PROFILE_LAYOUT.badge).toContain("bg-neutral-900 text-neutral-50");
    expect(PROFILE_LAYOUT.badge).toContain("shadow");
    expect(PROFILE_LAYOUT.badge).toContain("hover:bg-neutral-900/80");
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

  it("the menu content byte-matches the reference's CURRENT stock string (S113, D-113a2 — the outline-none retired)", () => {
    // The s113 menu-family LIVE re-walk (both apps, 1440×900 + 390×844):
    // the reference's CURRENT stock DropdownMenu content carries NO
    // `outline-none` — our s13-era string predates the reference's
    // shadcn bump (the s112 D-112a1 close-X genus). Verified INERT live
    // on both open paths: the click-open's programmatic focus on the
    // content is not :focus-visible (no outline renders on either
    // app), and the keyboard-open focuses the first ITEM — the content
    // never holds focus-visible. The token-map arms (border-line /
    // bg-surface / text-foreground for the reference's bare border /
    // bg-popover / text-popover-foreground) STAY — the documented s73
    // computed-equal mechanism, live-verified (white / #e5e5e5 / #0a0a0a
    // on both apps, the s86 border-input precedent).
    expect(MENU_CONTENT).not.toContain("outline-none");
    expect(MENU_CONTENT).toContain("border-line bg-surface p-1 text-foreground");
    expect(MENU_CONTENT).toContain("data-[state=open]:animate-in");
    expect(MENU_CONTENT).toContain("data-[side=bottom]:slide-in-from-top-2");
    expect(MENU_CONTENT).toContain("data-[side=left]:slide-in-from-right-2");
    expect(MENU_CONTENT).toContain("data-[side=right]:slide-in-from-left-2");
    expect(MENU_CONTENT).toContain("data-[side=top]:slide-in-from-bottom-2");
    // The ITEM's own outline-none is NOT in scope here — the
    // reference's stock menuitem DOES carry it (live-verified: `relative
    // flex cursor-default select-none items-center gap-2 rounded-sm px-2
    // py-1.5 text-sm outline-none transition-colors focus:bg-accent …`).
    expect(MENU_ITEM).toContain("outline-none");
  });

  it("the menu item's focus wash carries the TEXT arm — focus:text-neutral-900 (F-128c1, session-128)", () => {
    // The s128 menu-family re-walk (both apps, 1440×900 + 390×844): the
    // keyboard-highlighted item computes rgb(23,23,23) ink on the
    // reference (its accent-foreground #171717) where ours computed
    // rgb(10,10,10) — the M-81c2 genus on the DropdownMenu family: the
    // Select family's items were live-walked and fixed to the pair at
    // s81 (select.tsx:113 — the s80 badge precedent: the reference's
    // accent-foreground expressed as our neutral-900 literal); the menu
    // family's HIGHLIGHTED ink was never censused before (the s113
    // keyboard census measured only the #f5f5f5 wash bg — which
    // byte-matches still). The resting ink inherits #0a0a0a on both
    // apps; only the focus wash's TEXT arm diverged.
    expect(MENU_ITEM).toContain("focus:text-neutral-900");
    expect(MENU_ITEM).not.toContain("focus:text-foreground");
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

  it("both list bodies are vertical 8px stacks in the v3 following-sibling form", () => {
    // Reference: `p-6 pt-0 space-y-2` (buttons stacked, 8px apart) — under
    // ITS v3-era semantics that is margin-TOP on following siblings.
    // Walk60 (D-187a3): under our v4 the same class string flips to
    // margin-BOTTOM on PRECEDING siblings, and the children being
    // inline-flex buttons makes the flip VISIBLE — the reference's
    // button-2 margin-top extends the line box 8px ABOVE, dropping the
    // whole baseline-aligned row 8px below the content top (first button
    // 313,348 REF vs 313,340 OURS at the same byte-equal
    // title/desc/content boxes; the same 8px on the Export card). The
    // house's s11-era explicit form (the CardHeader `[&>*+*]:mt-1.5`
    // precedent) restores the v3 semantics byte-exactly; the s14-era
    // `space-y-2` class string retirement rides the same evidence.
    expect(SETTINGS_DATA.listBody).toBe("p-6 pt-0 [&>*+*]:mt-2");
    expect(SETTINGS_DATA.listBody).not.toContain("flex-wrap");
    expect(SETTINGS_DATA.listBody).not.toContain("space-y-2");
  });

  it("the Data tab buttons are stock outline default-size with w-full sm:w-auto", () => {
    // Reference: outline variant, h-9 px-4 py-2 text-sm, `w-full
    // sm:w-auto`, download icon w-4 h-4 mr-2 (the reference's `cs` —
    // session-83 M-83a1: the s72-era record shipped h-4 w-4 with no
    // margin while the file's own s72 comment documented the reference's
    // mr-2; the icon-text gap computed 8px vs the reference's 16px on
    // all seven export buttons). Ours shipped secondary/sm (h-8 px-3
    // text-xs, icon h-3.5, no responsive width).
    expect(SETTINGS_DATA.buttonCls).toContain("w-full sm:w-auto");
    expect(SETTINGS_DATA.buttonIcon).toBe("h-4 w-4 mr-2");
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

  it("the close X byte-matches the reference's CURRENT stock string (S112-P2, D-112a1 — the dialog-family walk's re-pin)", () => {
    // Session-112 (the 112-c walk): the reference's close carries the
    // CURRENT stock shadcn string — our s15-era form predates its
    // shadcn bump (the s15 extraction recorded the then-current form;
    // the reference redeployed since; the bundle itself STABLE the
    // 83rd). LIVE-measured on the walk2 full-string extraction:
    //   ref: absolute right-4 top-4 rounded-sm opacity-70
    //        ring-offset-background transition-opacity
    //        hover:opacity-100 focus:outline-none focus:ring-2
    //        focus:ring-ring focus:ring-offset-2
    //        disabled:pointer-events-none data-[state=open]:bg-accent
    //        data-[state=open]:text-muted-foreground
    // The two data-[state=open] arms are INERT on both apps (the
    // Radix DialogClose never carries a data-state attribute) — the
    // s111 D2/D5 byte-parity genus: the class strings are the
    // contract, even when inert.
    expect(DIALOG_CLOSE).toContain("data-[state=open]:bg-accent");
    expect(DIALOG_CLOSE).toContain("data-[state=open]:text-muted-foreground");
    // `disabled:opacity-70` RETIRED — the reference's current string
    // does not carry it (the close is never disabled; inert on ours).
    expect(DIALOG_CLOSE).not.toContain("disabled:opacity-70");
    // `ring-offset-background` is the COMPUTED-CONTRACT EXCEPTION —
    // DELIBERATELY ABSENT (the s11 computed-gap rule: re-derive from
    // the computed value, never copy the class string). The
    // reference's focused-close ring offset computes hsl(0 0% 100%)
    // = #fff; ours computes #fff (the v4 default); the class would
    // set var(--color-background) = #f9fafb — INTRODUCING the very
    // divergence it would pin away (LIVE-measured on both apps).
    expect(DIALOG_CLOSE).not.toContain("ring-offset-background");
  });
});

describe("session-15: dialog body anatomy — groups and wrappers (S15-P7/P8)", () => {
  it("max-w-lg family field groups are space-y-2 with the v4 controlMt fix", () => {
    // Reference Lead/Account/Contact groups: `<div class="space-y-2">` —
    // computed 12px label→control gap / 28px top-to-top (the SAME
    // geometry as the s14 settings fix). Under v4 the literal space-y-2
    // collapses on the INLINE label — the established fix is the
    // explicit mt-2 on the control.
    // Session-92 (M-92c1) re-anchor: controlMt gains mb-0 — the
    // phantom-mb select-trigger genus (the Radix native-select
    // tree-sibling + v4's :not(:last-child)); see the token's comment
    // in page-layout.ts.
    expect(DIALOG_GROUP.group).toBe("space-y-2");
    expect(DIALOG_GROUP.controlMt).toBe("mt-2 mb-0");
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

  it("the create dialogs carry the reference's placeholder set — John Doe (S30-P2) + the five S76 additions + the four S127 contact fields", () => {
    // s15: `placeholder="` count = 0 across all five reference dialog
    // dumps. Session-30 (S30-P2): the AAe contact Name field DOES carry
    // placeholder="John Doe" (bundle-extracted + live-verified — the
    // s15 dump missed it). Session-76 (M-76c14): the fresh bundle decode
    // found FIVE more the s15 dump missed (the Event Location / Event
    // Related SelectValue / Activity Description / Activity Related Type
    // SelectValue / Activity Related Name) — ten allowed. Session-127
    // (F-127c1, the dialog-family re-walk's TEXT-CONTENT census): the
    // LIVE reference's Create New Contact ships FOUR MORE the bundle
    // decode missed — the Email `john@company.com`, the Phone
    // `+1 (555) 000-0000`, the Company `Acme Inc.`, the Position
    // `Sales Manager` (live-DOM-censused on both viewports; the DOM text
    // verbatim, not the decoded bundle, is the ground truth — the
    // F-126c1 genus lesson).
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/shared/entity-dialogs.tsx"),
      "utf8",
    );
    const placeholders = [...src.matchAll(/placeholder="([^"]*)"/g)].map((m) => m[1]);
    expect([...placeholders].sort(), "exactly the reference's ten dialog placeholders").toEqual([
      "+1 (555) 000-0000",
      "Acme Inc.",
      "Enter activity details...",
      "Enter location or meeting link",
      "John Doe",
      "Sales Manager",
      "Select type",
      "Select type",
      "e.g., John Doe",
      "john@company.com",
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
    // Session-143 re-anchor: {children} still rides DIRECTLY in main (no
    // padding wrapper) — the footer now follows it on its own line.
    expect(src).toMatch(/<main[^>]*>\s*\{children\}/);
  });

  it("every page renders its own root wrapper (source-level)", () => {
    const standard = [
      "../src/app/(app)/dashboard/page.tsx",
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
      "../src/app/(app)/dashboard/page.tsx",
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
    // Session-82 (M-82c1b) re-anchor: the toolbar svgs now carry their
    // own mr-2 (the reference's per-surface class) after the iconGap
    // base retirement.
    expect(importBtn.slice(0, 400)).toMatch(/<Download className="h-4 w-4 mr-2"/);
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
    // Session-90 (L-90c5): the icon arrives as a COMPONENT REFERENCE
    // (icon={Users}) — the component applies the w-5 h-5 classes
    // itself (the Mx mechanism).
    expect(src).toMatch(/icon=\{Users\}/);
    expect(src).toMatch(/icon=\{Calendar\}/);
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
    // Session-130 (F-130c1) re-anchor: the hover TEXT arm flipped to
    // the neutral-900 literal (the reference's accent-foreground
    // #171717 — the F-128c1/F-129c3 value pair live-walked on the
    // Save All ghost); the BASE-color rule unchanged (no leading
    // text-* arm).
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/button.tsx"),
      "utf8",
    );
    expect(src).toMatch(/ghost: "hover:bg-line-soft hover:text-neutral-900"/);
    expect(src).not.toMatch(/ghost: "text-muted/);
    expect(src).not.toMatch(/ghost: "text-foreground/);
  });
});

describe("session-129 parity pins (the highlighted-state lens — F-129c1/c2/c3)", () => {
  it("F-129c1: the tabs PANEL_BASE retires ring-offset-background (the s11 computed-contract precedent)", () => {
    // The 129-c walk's genus: the reference's PANEL_BASE rides
    // ring-offset-background + focus-visible:ring-offset-2, its offset
    // halo computing hsl(0 0% 100%) = #ffffff; OUR --color-background is
    // the page bg #f9fafb, so the ride drifts the panel's 2px
    // focus-visible halo — the same F-119c2 inverted-token genus the
    // trigger census live-confirmed at both viewports. The DIALOG_CLOSE
    // s11 precedent: the v4 DEFAULT offset color is #fff — byte-equal
    // with the class absent, "the class would set var(--color-background)
    // = #f9fafb, introducing the very divergence it would pin away."
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/tabs.tsx"),
      "utf8",
    );
    const panel = /PANEL_BASE =\s*\n?\s*"([^"]+)"/.exec(src);
    expect(panel).not.toBeNull();
    expect(panel?.[1] ?? "").not.toContain("ring-offset-background");
    expect(panel?.[1] ?? "").toContain("focus-visible:ring-offset-2");
    expect(panel?.[1] ?? "").toContain("focus-visible:ring-2");
  });

  it("F-129c2: the destructive hover is the ALPHA form — hover:bg-danger/90 (the M-80c1 genus)", () => {
    // The 129-c walk's live finding on the Danger Zone reset (both
    // viewports): our hover computed the SOLID darker step
    // rgb(220,38,38) (hover:bg-red-600) where the reference computes
    // rgba(239,68,68,0.9) — its destructive at 90% ALPHA. The M-80c1
    // genus (the s80 Save precedent: the reference's hovers are the
    // /90 alpha form, never the solid darker step). The resting bg
    // byte-matches (#ef4444 both apps); only the hover arm diverged —
    // never censused before the F-128c1 highlighted-state lens.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/button.tsx"),
      "utf8",
    );
    expect(src).toMatch(/destructive: "bg-danger text-white shadow-sm hover:bg-danger\/90"/);
    expect(src).not.toMatch(/destructive: "[^"]*hover:bg-red-600/);
  });

  it("F-129c3: the outline variant gains hover:text-neutral-900 — the reference's hover:text-accent-foreground", () => {
    // The 129-c walk's live finding on BOTH censused outline surfaces
    // (the Data-tab Download Contacts Template button + the profile
    // Upload Photo, both viewports): our hover text stayed
    // rgb(10,10,10) (text-foreground, no hover arm) where the
    // reference computes rgb(23,23,23) — its stock outline variant's
    // hover:text-accent-foreground #171717. The F-128c1 value pair
    // (shipped REAL for the menu-item ink at s128); the s80 badge
    // precedent expresses its accent-foreground as our neutral-900
    // literal. The s82-era bundle decode missed the hover:text arm —
    // the F-127c1 doctrine: the live DOM is the ground truth.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/button.tsx"),
      "utf8",
    );
    expect(src).toMatch(
      /outline: "border border-line bg-surface text-foreground shadow-sm hover:bg-line-soft hover:text-neutral-900"/,
    );
    expect(src).not.toMatch(/outline: "[^"]*hover:text-foreground/);
  });
});

describe("session-130 parity pins (the highlighted-state lens — F-130c1)", () => {
  it("F-130c1: the ghost hover text is neutral-900 — the reference's hover:text-accent-foreground", () => {
    // The 130-c walk's live finding on the accounts filter rail's Save
    // All ghost (two-app at 1440, the reference's own a dead button —
    // the Oce decode): our ghost's hover text computed rgb(10,10,10)
    // (hover:text-foreground) where the reference computes rgb(23,23,23)
    // — its stock ghost's hover:text-accent-foreground #171717. The
    // hover BG byte-equal rgb(245,245,245) both apps; only the TEXT arm
    // diverged. The F-128c1/F-129c3 value pair on the GHOST variant —
    // the third consecutive session to ship the genus (s128 the
    // menu-item ink · s129 the outline hover text · s130 the ghost
    // hover text); the 130-a inventory's named TOP latent risk
    // (L-130a1), live-confirmed exactly where named, corroborated
    // ours-side on the row-menu ghost trigger. The s80 badge precedent
    // expresses the reference's accent-foreground as our neutral-900
    // literal. The residual genus arms (record-only, no reference
    // surface): the toast close X (our own construction, never
    // live-censused on the reference), the Tabs underline variant
    // (dead code — no app surface mounts it), the mobile-nav trigger
    // (our fix-over-defect superset).
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/ui/button.tsx"),
      "utf8",
    );
    expect(src).toMatch(/ghost: "hover:bg-line-soft hover:text-neutral-900"/);
    expect(src).not.toMatch(/ghost: "[^"]*hover:text-foreground/);
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

  it("DASHBOARD_HEADER pins the s142 SINGLETON: the blue Export alone (D-142b0)", () => {
    // Session-142 (D-142b0): the reference's index-Dc6wvGtA.js bundle
    // RETIRED the s33 trio — its header row now carries exactly ONE
    // button (the blue primary Export; live-censused at 1440 + 390, no
    // Add anywhere). The addLabel/outlineExportLabel members retired
    // with the reference's own buttons; the s33 dead-trio decode and
    // the s47 functional-superset rewire are historical records.
    expect(DASHBOARD_HEADER.primaryExportLabel).toBe("Export");
    expect(DASHBOARD_HEADER.primaryExportLabelClass).toBe("");
    expect("addLabel" in DASHBOARD_HEADER).toBe(false);
    expect("outlineExportLabel" in DASHBOARD_HEADER).toBe(false);
    expect("addLabelClass" in DASHBOARD_HEADER).toBe(false);
    expect("outlineExportLabelClass" in DASHBOARD_HEADER).toBe(false);
  });
});

describe("session-98 parity pins (the CardHeader v4 row-genus fix, F-98c1)", () => {
  it("the CardHeader base carries the v3-COMPUTED margin form — the space-y-1.5 genus retired", () => {
    // F-98c1 (the 98-c rotation decode): the base `flex flex-col
    // space-y-1.5 p-6` + a call-site `flex-row` override computed +6px of
    // header height under v4 — space-y's margin-BOTTOM lands on the TITLE
    // (the non-last child) and grows the flex line's cross-size when the
    // title is the tallest child (the reports tab-2 table cards: "Open
    // Deals by Stage" 221 vs 215, "Deals at Risk" 253 vs 247 at 390).
    // Under the reference's v3 the SAME class string is margin-TOP on the
    // FOLLOWING sibling (the button row — vertically inert), so the
    // reference computes NO gap contribution in row headers. The
    // M-79c2 doctrine: re-derive from the COMPUTED gap, never copy the
    // class string — the mt-on-following form IS the reference's v3
    // semantics under v4 syntax (identical 6px gaps in column mode,
    // inert in row mode, no margin on single-child headers either way).
    const src = read("src/components/ui/card.tsx");
    const fn = src
      .slice(
        src.indexOf("function CardHeader"),
        src.indexOf("function CardHeader") + 1600,
      )
      // strip the line comments — the root-cause comment legitimately
      // names the retired token; the pin guards the CODE
      .replace(/\/\/[^\n]*/g, "");
    expect(fn).not.toMatch(/space-y-1\.5/);
    expect(fn).toMatch(/\[\&>\*\+\*\]:mt-1\.5/);
  });

  it("the two reports flex-row headers keep their call-site override (the row escape unchanged)", () => {
    // The fix lives in the BASE (every current and future flex-row
    // CardHeader is safe by construction); the two call sites keep the
    // reference's own appended family verbatim (its Forecasting header
    // computes the same string — the tabcontent-parity N-85c3 pin).
    const src = read("src/app/(app)/reports/reports-page.tsx");
    expect(
      (src.match(/CardHeader className="flex-row items-center justify-between"/g) ?? []).length,
    ).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Session 145 (walk35 — the auth-transition family): the LOGOUT transition
// contract. The reference's own Logout keeps the user on the current CRM
// page, which re-renders in its guest platform face ("Hi, Guest" + the
// zero-data dashboard — the documented no-guard genus we do not mirror).
// OURS lands on /login: the (app)-group server guard would 307 any CRM
// page for the logged-out user anyway; the client-side push is the same
// posture expressed one hop earlier (the fix-over-defect's transition
// face). The pin freezes the target so a "logout stays on-page" drift
// (the genus copy) REDs here exactly.
// ---------------------------------------------------------------------------

describe("session-145: the logout transition (walk35)", () => {
  it("the topbar's Logout lands on /login — the (app)-guard posture's client expression", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/layout/topbar.tsx"),
      "utf8",
    ).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    // the transition: await logout() → push("/login") → refresh()
    expect(src).toMatch(/await logout\(\);/);
    expect(src).toMatch(/router\.push\("\/login"\)/);
    // negatives: the logout never lands on the landing or a CRM page
    // (the reference's stay-on-page genus is NOT mirrored)
    const logoutBlock = src.slice(
      src.indexOf('onSelect={async () => {'),
      src.indexOf("Logout", src.indexOf('onSelect={async () => {')),
    );
    expect(logoutBlock).not.toMatch(/router\.push\("\/"\)/);
    expect(logoutBlock).not.toMatch(/router\.push\("\/[Dd]ashboard"\)/);
  });
});

// Session-147 (probe:ref #119's parity event — the reference's mobile-nav
// fix decoded, walk37): the drawer re-derived onto the repo's own Radix
// dialog primitives (the shadcn Sheet pattern the reference itself now
// ships), the guest re-gating + the from_url round-trip (F-147c2).
describe("session-147: the mobile-nav parity event (the reference's Sheet drawer, walk37-decoded)", () => {
  it("MOBILE_NAV_SHEET — the byte-decoded sheet contracts (the reference's new drawer)", () => {
    // the content: the Radix Dialog sheet — left-anchored, w-72 (288px),
    // the brand-blue sidebar token (their bg-[#2563eb] literal), the
    // 500ms-in/300ms-out slide, NO radius, NO border, p-0
    expect(MOBILE_NAV_SHEET.content).toBe(
      "fixed z-50 gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out inset-y-0 left-0 h-full data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm w-72 border-0 bg-sidebar p-0 text-white",
    );
    // the header: the reference's SheetHeader (space-y-2 — the sheet
    // family's own rhythm, NOT the entity dialogs' space-y-1.5)
    expect(MOBILE_NAV_SHEET.header).toBe(
      "flex flex-col space-y-2 text-center sm:text-left p-6",
    );
    // the title: the WORDMARK replaces the BrandMark circle in the
    // drawer — the h2 the Radix aria-labelledby points at. The
    // s177 re-anchor: the trailing mb-0 (the walk50 phantom-mb cure —
    // the v4 space-y cure at the title, see the session-177 block)
    expect(MOBILE_NAV_SHEET.title).toBe("text-left text-2xl font-bold text-white mb-0");
    expect(MOBILE_NAV_SHEET.titleText).toBe("CRM");
    // the description: sr-only on the reference — "Navigate between
    // your CRM pages" never paints
    expect(MOBILE_NAV_SHEET.description).toBe("text-sm text-muted-foreground sr-only");
    expect(MOBILE_NAV_SHEET.descriptionText).toBe("Navigate between your CRM pages");
    // the close: the STOCK DialogClose (computed-equal to the
    // reference's — its data-[state=open]:bg-secondary literal is the
    // same #f5f5f5 family our bg-accent computes)
    expect(MOBILE_NAV_SHEET.close).toBe(DIALOG_CLOSE);
  });

  it("MOBILE_NAV_SHEET — the drawer's own nav contracts (NOT the desktop sidebar's link styles)", () => {
    // the drawer's navs: gap-1 (the sheet family), the settings group
    // mt-4 (NOT the sidebar's mt-auto pin) behind the border-t
    expect(MOBILE_NAV_SHEET.nav).toBe("flex flex-col gap-1 px-3");
    expect(MOBILE_NAV_SHEET.navFooter).toBe(
      "mt-4 flex flex-col gap-1 border-t border-white/10 px-3 pt-4",
    );
    // the drawer link styles: text-sm font-medium EXPLICIT, the
    // white/80 inactive + the BRIGHTER white/20 active (the desktop
    // sidebar ships bg-white/10 — the two surfaces diverged upstream)
    expect(MOBILE_NAV_SHEET.link).toBe(
      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors text-white/80 hover:bg-white/10 hover:text-white",
    );
    expect(MOBILE_NAV_SHEET.linkActive).toBe(
      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors bg-white/20 text-white",
    );
    expect(MOBILE_NAV_SHEET.icon).toBe("h-5 w-5");
  });

  it("MOBILE_NAV_TRIGGER — the reference's construction: the stock ghost Button + md:hidden text-gray-600 + the lucide-menu glyph", () => {
    const src = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/layout/topbar.tsx"),
      "utf8",
    );
    // the label is the reference's EXACT string (no "menu" — the
    // walk37 decode; the e2e + battery re-anchored with it)
    expect(MOBILE_NAV_TRIGGER.label).toBe("Open navigation");
    expect(src).toContain('aria-label={MOBILE_NAV_TRIGGER.label}');
    // the trigger: the STOCK ghost icon Button (the reference's own
    // construction — its topbar-icon sibling pattern) + the range pair
    expect(MOBILE_NAV_TRIGGER.className).toBe("md:hidden text-gray-600");
    expect(src).toContain('variant="ghost"');
    // the glyph: lucide-menu (three EQUAL lines — our old custom svg's
    // short third line retired with the reference's own glyph)
    expect(src).toMatch(/<Menu\b/);
    expect(src).not.toMatch(/M3 15h9/);
    // the Radix wiring: the DialogTrigger (aria-controls/data-state)
    expect(src).toMatch(/DialogTrigger|Dialog\.Trigger/);
  });

  it("the drawer rides the repo's Radix dialog primitives (the reference's own Sheet mechanism) with our kept behavioral supersets", () => {
    const src = read("src/components/layout/mobile-nav.tsx");
    // the Radix construction: the sheet composes the raw primitives
    // (Portal/Overlay/Content/Close/Title/Description); the Root lives
    // in AppShell (the pin below)
    expect(src).toMatch(/DialogPrimitive\./);
    expect(src).toMatch(/DialogPrimitive\.Content/);
    // the stock overlay — byte-equal to the reference's bg-black/80
    // fade (our DIALOG_OVERLAY, the same string our entity dialogs
    // ship)
    expect(src).toMatch(/DialogOverlay|DIALOG_OVERLAY/);
    // OUR SUPERSETS (invisible to pixels, e2e-pinned): the S8-P1
    // resize-past-md auto-close + the main-scroller lock (Radix locks
    // body via react-remove-scroll; the main lock is ours)
    expect(src).toContain("autoCloseQuery");
    expect(src).toMatch(/querySelector.*main/);
    // the SHEET contracts ride page-layout (the single-source
    // discipline)
    expect(src).toContain("MOBILE_NAV_SHEET");
  });

  it("the AppShell wires the Root around the shell (the controlled open state + the route-change close)", () => {
    const src = read("src/components/layout/app-shell.tsx");
    // the Radix Root is controlled by AppShell's state — the
    // route-change adjust-during-render close survives
    expect(src).toMatch(/onOpenChange/);
    expect(src).toMatch(/setMobileNavOpen\(false\)/);
    // the drawer nav links close on click (the reference's sheet does
    // the same — its nav links are onClick-closers)
    const navSrc = read("src/components/layout/mobile-nav.tsx");
    expect(navSrc).toMatch(/onNavigate/);
  });
});

// Session-177 (walk50 — THE DRAWER INTERIOR RE-WALK, the six-closes
// candidate no round ever ran): the two-app element-ledger decode found
// the drawer header's space-y-2 riding the v4 margin-BOTTOM semantics —
// the h2's :where() mb-2 PARTICIPATES in the flex-column layout (header
// 88px), where the reference's v3-era mt-on-the-sr-only-<p> never did
// (the absolute positioning takes the p out of flow — header 80px). The
// reference's header computes 24 (p-6) + 32 (the h2 line box) + 24
// (p-6) = 80px; ours computed 88 — an 8px spine shift cascading to
// every nav link and the footer group (walk50 ledger: nav y 88 vs 80 ·
// footer y 436 vs 428 · every icon/rect +8). Never caught before
// because no standing leg walks the drawer-open interior: the census
// carries zero drawer-open runs, the battery pins behavior, the a11y
// gate violations, the captures visuals. The cure is the M-92c1
// phantom-mb precedent: the explicit mb-0 on the title — (0,1,0) beats
// the :where() rule's (0,0,0) — keeping the header's space-y-2 class
// string byte-parity with the reference's (walk50 ROW 7) while the
// COMPUTED rhythm goes byte-equal too.
describe("session-177: the drawer interior re-walk (walk50 — the header rhythm's v4 space-y cure)", () => {
  it("MOBILE_NAV_SHEET.title — the mb-0 override (the M-92c1 phantom-mb precedent, the drawer's own face)", () => {
    // RED on the s176 tree: the walk50 ledger's header h=88 vs the
    // reference's 80 — the h2's :where() mb-2 participates in the
    // layout. The cure: the title class carries the explicit mb-0.
    expect(MOBILE_NAV_SHEET.title).toBe(
      "text-left text-2xl font-bold text-white mb-0",
    );
  });

  it("the walk50 decode freeze — the header stays byte-parity (the space-y-2 literal preserved; the computed fix rides the title)", () => {
    // the parity doctrine: keep the reference's literal header classes
    // (walk50 ROW 7 byte-equal on both apps), fix the v4 COMPUTED
    // divergence at the title — never rewrite the reference's string
    expect(MOBILE_NAV_SHEET.header).toBe(
      "flex flex-col space-y-2 text-center sm:text-left p-6",
    );
    // the description stays sr-only — the element the reference's
    // v3-era mt landed on (out of flow, never a gap; our v4 mb-2 on
    // the h2 was the gap the mb-0 now kills)
    expect(MOBILE_NAV_SHEET.description).toBe(
      "text-sm text-muted-foreground sr-only",
    );
    expect(MOBILE_NAV_SHEET.descriptionText).toBe(
      "Navigate between your CRM pages",
    );
  });
});

describe("session-147: F-147c2 — the guest re-gating + the from_url round-trip (the s144 posture REVERSED)", () => {
  it("the (marketing) group now GUARDS guests — the GuestLoginRedirect shim replaces the APP_GUEST_USER feed", () => {
    const src = read("src/app/(marketing)/layout.tsx");
    // the reference's new bundle login-walls /About + /Contact (walk37:
    // guest /About → /login?from_url=<abs> → post-login → /About). The
    // s144 session-optional posture is RETIRED — the layout renders the
    // shim INSTEAD of the shell for guests (the decision stays
    // SERVER-side: the marketing content never reaches a guest).
    expect(src).toContain("GuestLoginRedirect");
    expect(src).toMatch(/if \(!user\)/);
    // the s144 feed retired
    expect(src).not.toContain("APP_GUEST_USER");
  });

  it("the (app) group's guard becomes the SAME shim — the reference's client-side mechanism (from_url on BOTH groups)", () => {
    const src = read("src/app/(app)/layout.tsx");
    // walk37: the reference's client guard carries from_url on the CRM
    // pages too (guest /Dashboard → /login?from_url=…/Dashboard). The
    // server 307 retired with it — the session decision stays
    // server-side (the guest never receives the page HTML, only the
    // shim), the navigation rides the reference's own mechanism.
    expect(src).toContain("GuestLoginRedirect");
    expect(src).not.toMatch(/redirect\("\/login"\)/);
    // the CRM content stays unreachable for guests — the shim renders
    // INSTEAD of the shell
    expect(src).toMatch(/if \(!user\)\s*return\s*<GuestLoginRedirect \/>/);
  });

  it("the GuestLoginRedirect shim — the reference's own mechanism (JS replace + the absolute from_url)", () => {
    const src = read("src/components/layout/guest-login-redirect.tsx");
    expect(src.length).toBeGreaterThan(0);
    // the mirror of the reference's client guard: router.replace to
    // /login?from_url=<location.href urlencoded>
    expect(src).toMatch(/router\.replace/);
    expect(src).toMatch(/from_url=/);
    expect(src).toContain("encodeURIComponent");
    expect(src).toContain("window.location.href");
  });
});


// ---------------------------------------------------------------------------
// Session-148 (F-147c3): the desktop-interior mirror — the constants
// retirement. The reference removed its KPI delta chips family-wide, its
// accounts toolbar trio + rail buttons, and its dashboard middle select +
// More... ghost; the constants that existed ONLY for those surfaces retire
// (walk38-decoded, live-verified on both apps).
// ---------------------------------------------------------------------------
describe("session-148: the F-147c3 constants retirement (the delta-chip family + the view-switcher)", () => {
  const layoutSrc = () => read("src/lib/page-layout.ts");
  it("KPI_STATICS loses its deltas arm — the sparks + the reports spark stay (the reference's dashboard cards render no delta chips)", () => {
    const src = layoutSrc();
    const block = src.slice(src.indexOf("export const KPI_STATICS"), src.indexOf("} as const;", src.indexOf("export const KPI_STATICS")));
    expect(block).not.toMatch(/\bdeltas:\s*\{/);
    expect(block).toMatch(/sparks:\s*\{/);
    expect(block).toMatch(/reportsSpark:/);
  });

  it("ACTIVITY_KPI_STATICS loses its delta fields — the subs + the bar arrays stay (the reference kept 'Due now' / '+7 today' / '+4 today' / '+1h 12m', walk38)", () => {
    const src = layoutSrc();
    const block = src.slice(src.indexOf("export const ACTIVITY_KPI_STATICS"), src.indexOf("} as const;", src.indexOf("export const ACTIVITY_KPI_STATICS")));
    expect(block).not.toMatch(/delta:/);
    expect(block).toMatch(/sub:\s*"Due now"/);
    expect(block).toMatch(/sub:\s*"\+7 today"/);
    expect(block).toMatch(/bars:/);
  });

  it("CALENDAR_KPI_STATICS retires (the reference's calendar cards render no trend texts — walk38: zero trend rows, h=138)", () => {
    expect(layoutSrc()).not.toMatch(/export const CALENDAR_KPI_STATICS/);
  });

  it("VIEW_SWITCHER retires (both its consumers — the accounts toolbar trio + the dashboard middle select — are gone)", () => {
    expect(layoutSrc()).not.toMatch(/export const VIEW_SWITCHER/);
  });

  it("TABLE_TOOLBAR keeps row + moreBtn (the accounts Export CSV rides moreBtn) but loses select + densityOptions (the density select's only consumers)", () => {
    expect(TABLE_TOOLBAR.row).toBe("flex flex-col sm:flex-row gap-3");
    expect(TABLE_TOOLBAR.moreBtn).toBe("h-8 rounded-md px-3 text-xs");
    const src = layoutSrc();
    const block = src.slice(src.indexOf("TABLE_TOOLBAR ="), src.indexOf("} as const;", src.indexOf("TABLE_TOOLBAR =")));
    expect(block).not.toMatch(/select:/);
    expect(block).not.toMatch(/densityOptions:/);
  });
});


// ---------------------------------------------------------------------------
// Session-178 (walk51 — THE TOPBAR SEARCH FOCUS + SETTINGS SEGMENTED-ACTIVE
// WALK, the s177 close's two oldest unwalked OPEN/ACTIVE interiors,
// adjudicated per ADR-022): the two-app element-ledger + computed-census
// decode found ZERO live defects — every delta a documented genus or a
// kept superset, every VISIBLE face byte-equal. The decode's register:
// (a) the search focus face — both apps' FOCUSED input paints the same
//     1px near-black box-shadow ring (rgb(10,10,10) 0px 0px 0px 1px —
//     live-censused under REAL keyboard Tab focus, 9 tabs on both apps,
//     the same placeholder locator) over the same resting shadow
//     (rgba(0,0,0,0.05) 0px 1px 2px 0px — the s9 re-pin);
// (b) THE NEW DOCUMENTED GENUS — v4's outline-none is outline-style:none
//     where the reference's v3-era outline-none is 2px solid transparent:
//     OURS paints nothing (style none), the REFERENCE paints nothing
//     visible (transparent) — zero pixels on both, but the computed
//     outline triplet diverges (1px/none vs 2px/solid) — the
//     shadow/blur/space-y rename family's fourth member;
// (c) the box-shadow SLOT-COUNT genus — v4 composes 5 slots
//     (inset-shadow, inset-ring, ring-offset, ring, shadow) where the
//     v3-era composes 3: the extra OURS slots are fully transparent, the
//     reference's zero-extent white slot (rgb(255,255,255) 0px 0px 0px
//     0px) is clipped inside the border box — the VISIBLE layers
//     byte-equal in every state (resting · focused · active);
// (d) the segmented active face — the s125 bg-white literal + the s129
//     retired ring-offset re-verified live: the active pill computes
//     rgb(255,255,255) + the bare-shadow pair + ink rgb(10,10,10) +
//     weight 500, byte-equal on both apps at BOTH viewports (371px
//     desktop columns · 117px phone columns), the tablist's computed
//     bg/color byte-equal (the house token idiom bg-line-soft/
//     text-muted-ink vs the reference's bg-muted/text-muted-foreground);
// (e) OUR kept supersets re-verified live — the search input's
//     aria-label (the reference's field carries NONE) and the roving
//     tabindex (OURS [0,-1,-1] at default where the reference's is
//     [-1,-1,-1] — the s23 accessible fix over its keyboard-unreachable
//     platform defect).
// The pins are the decode's contract freeze — born-green over the
// working code (the s173 P-p/P-q precedent), mutation-proven at birth.
describe("session-178: the topbar search focus + settings segmented-active walk (walk51 — the zero-defect decode freeze)", () => {
  it("the search focus contract — the 1px near-black keyboard-only ring, NO ring-offset (the walk's focused face byte-equal)", () => {
    // the walk's Phase A: REAL keyboard Tab focus on both apps paints
    // the identical 1px near-black ring + the identical resting shadow.
    expect(INPUT_BASE.focusRing).toBe(
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    );
    // no ring-offset class — no offset-color divergence is constructible
    // on this surface (the s129 F-129c1 genus cannot recur here)
    expect(INPUT_BASE.focusRing).not.toContain("ring-offset");
    expect(SEARCH_INPUT.extras).toBe("pl-10 bg-gray-50 border-gray-200");
    expect(SEARCH_INPUT.usesStockInput).toBe(true);
  });

  it("the search aria-label superset — OUR accessible fix over the reference's unnamed field (the walk: REF carries NO aria-label)", () => {
    const src = read("src/components/layout/topbar.tsx");
    expect(src).toContain(
      'aria-label="Search accounts, contacts and leads"',
    );
    // the s10 placeholder decode — the locator that found BOTH apps
    expect(src).toContain('placeholder="Search Anything..."');
  });

  it("the segmented active contract — the s125 bg-white literal + the s129 retired offset, re-verified byte-equal at the walk (both viewports)", () => {
    expect(TABS_SEGMENTED.trigger).toContain("data-[state=active]:bg-white");
    expect(TABS_SEGMENTED.trigger).toContain("data-[state=active]:shadow");
    expect(TABS_SEGMENTED.trigger).toContain(
      "data-[state=active]:text-foreground",
    );
    // the s129 retirement stands — the reference's own stock class still
    // carries ring-offset-background (its ride computes #ffffff); OUR
    // --color-background is the page bg #f9fafb — the class stays retired
    expect(TABS_SEGMENTED.trigger).not.toContain("ring-offset-background");
    // the track's house token idiom — computed-equal live (the walk's
    // tablist census: bg/color byte-equal on both apps)
    expect(TABS_SEGMENTED.track).toContain("bg-line-soft");
    expect(TABS_SEGMENTED.track).toContain("text-muted-ink");
    expect(TABS_SEGMENTED.track).toContain("h-9");
    expect(TABS_SEGMENTED.track).toContain("grid w-full");
  });

  it("the roving tabindex superset — the s23 accessible fix, re-verified live (OURS [0,-1,-1] default; REF [-1,-1,-1] — its platform defect)", () => {
    const src = read("src/components/ui/tabs.tsx");
    expect(src).toContain("tabIndex={isActive ? 0 : -1}");
  });

  it("the walk51 standing script exists (the ADR-022 re-walk tool — re-runnable the day probe:ref trips)", () => {
    const src = read("scripts/walk51-search-focus-segmented-active.ts");
    expect(src).toContain("PHASE A: the topbar search focus state");
    expect(src).toContain("PHASE B: the settings segmented active state");
  });
});

// ---------------------------------------------------------------------------
// Session-179 (walk52 — THE REPORTS PILL-TAB FOCUS-STATE INTERIOR RE-WALK,
// the s129 close's own never-censused list ["the pill-tab surfaces' focus
// states never live-censused"], named first by the session-379 close):
// the two-app computed ledger of the PILL family's focus + active faces —
// the external s178 walked the SEGMENTED family's active face (settings);
// the PILL family (reports) is the remaining blank, the same ADR-022
// doctrine, the family's own turn.
//
// THE VERDICT: ZERO live defects — the FOCUSED pill trigger's ring
// byte-equal on BOTH axes (rgb(255,255,255) 0 0 0 2px [the ring-offset-2
// halo] + rgb(10,10,10) 0 0 0 4px [the ring-2] + the active bare-shadow
// pair — the ring-2+offset-2 focus-visible form computes IDENTICALLY on
// both apps, desktop AND phone); the pill interior geometry byte-equal
// at zero-data (x=293/515/737/959/1181 · w=222 · h=28 — the five columns
// pixel-exact); the switched active face byte-equal (Pipeline & Forecast
// + the post-interaction roving tabindex=0 on BOTH apps — the REF's
// [-1,-1,-1] is its INITIAL render, walk51's decode re-confirmed on the
// pill family). The genera: F-129c1's ring-offset-background retirement
// (the reference's own stock class still carries it — its ride computes
// #ffffff) · the token-selection genus (text-muted-ink vs
// text-muted-foreground — computed-equal) · the class-order genus · the
// outline VERSION FORM (ours v4 `none` vs the reference's v3-era
// `2px solid transparent` — both zero-visual, the s178-documented genus)
// · the DATA-STATE genus (the seeded-vs-zero page offset: ours-seeded
// renders the reports KPI/chart stack 32px taller above the tab bar —
// the pill interior geometry itself byte-equal at zero-data, the sweep's
// own zero-data pairing the standing proof).
//
// The battery below is the born-green contract-freeze form (the s173
// P-p/P-q precedent over working code — the walk surfaced no defect to
// cure, so the pins freeze the walk-proven contracts whole).
// ---------------------------------------------------------------------------
describe("session-179: the reports pill-tab focus-state interior re-walk (walk52 — the focus ring byte-equal on both axes, zero live defects)", () => {
  it("the walk52 decode freeze — the REAL keyboard Tab drive + the effective-layer alignment + the zero-data phased form (the tool's own contract)", () => {
    const src = read("scripts/walk52-pill-focus-active.ts");
    // the REAL keyboard focus (the walk51 form): Tab from a known
    // origin until a tab trigger holds focus — focus-visible fires
    // only under real keyboard focus, which no sweep drives
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain('el.getAttribute("role") === "tab"');
    // the effective-layer alignment — the zero-width v4 variable-chain
    // layers never enter the comparison
    expect(src).toMatch(/0px 0px 0px 0px/);
    // the REAL tab switch — the active face's move is part of the walk
    expect(src).toContain(`page.locator('[role="tab"]').nth(1).click()`);
    // BOTH axes — the pill track is responsive (grid-cols-2 below lg)
    expect(src).toContain('["desktop", 1440, 900]');
    expect(src).toContain('["phone", 390, 844]');
  });

  it("the pill focus face — TABS_PILL.trigger stays the walk52-proven ring-2 + offset-2 form (the two-app byte-equal layer's class carrier)", () => {
    // walk52's computed proof: the focused ring is EXACTLY the
    // ring-offset-2 white halo + the ring-2 near-black ring + the active
    // bare-shadow pair on both apps. The FULL-string freeze — any token
    // swap, class-order drift, or variant-arm change REDs here (the
    // existing pins are fragment-containment; this is the whole form).
    expect(TABS_PILL.trigger).toBe(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700",
    );
  });

  it("the pill track — the FULL-string freeze (the responsive grid-cols-2/lg:grid-cols-5 form, the computed-equal token family)", () => {
    // walk52: the track's computed bg/color byte-equal on both axes
    // (text-muted-ink computing the reference's muted-foreground); the
    // responsive pair grid-cols-2 lg:grid-cols-5 IS the track's own face
    // (the phone axis proves the 2-column arm, desktop the 5-column).
    expect(TABS_PILL.track).toBe(
      "items-center justify-center rounded-lg p-1 text-muted-ink grid w-full grid-cols-2 lg:grid-cols-5 h-auto bg-white border border-line",
    );
  });

  it("the data-state genus pin — the walk's own pairing discipline (the zero-data PASS is the two-app form; the seeded face is ours-only)", () => {
    // The walk's decode: the seeded-vs-zero page offset (32px above the
    // reports tab bar) is a DATA-STATE genus, never a pill defect — the
    // pill interior geometry is byte-equal at zero-data. The phased
    // form (zero-data PASS for the two-app alignment) is the sweep's
    // own doctrine (scripts/zero-data.ts, the s91 tool) — pinned here
    // as the walk's standing pairing discipline.
    const src = read("scripts/walk52-pill-focus-active.ts");
    expect(src).toContain("zero-data");
    const zero = read("scripts/zero-data.ts");
    expect(zero.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// session-180: THE DROPDOWN/SELECT OPEN-STATE INTERIOR WALK (walk53)
//
// The post-179 audit rotation (its trigger THE OWNER'S NEWEST COMMITS —
// the session_381 transcript + the prompt-to-review-3 doc; the s380
// close's first-named candidate: "the remaining unwalked focus/OPEN
// faces — the dropdown/select OPEN states beyond the s133/s136 lenses,
// the s379 close's own second arm · the account-menu OPEN re-walk
// under ADR-022"). probe:ref STABLE (46bc2d9c) killed the fresh-bundle
// candidate; the registry's latest 3.10.1 killed the recharts 4.0 gate.
//
// THE WALK [scripts/walk53-dropdown-open-interior.ts — the two-app
// element ledger of the OPEN states at BOTH axes (1440x900 + 390x844):
// Phase A the account-menu (the topbar button[aria-haspopup="menu"] →
// the [role="menu"] content → the Profile/Logout menuitems), Phase B
// the settings Defaults "Default Calendar View" select (the first
// combobox → the [role="listbox"] content → the Month/Week options —
// the M-72c3-decoded vocabulary); the REAL keyboard ArrowDown drive
// (data-highlighted fires only under real keyboard focus), the
// mount-focus census, the computed faces of the trigger/content/items
// RESTING and KEYBOARD-HIGHLIGHTED].
//
// THE VERDICT: ZERO LIVE DEFECTS — the menu spine byte-equal on both
// axes (3 rows, the same DFS structure, ZERO box deltas, mount-focus
// DIV/menu on both apps, ArrowDown → Profile on both); the listbox
// spine byte-equal (the Month/Week vocabulary, data-state
// checked/unchecked identical, mount-focus DIV/option on both — Radix
// focuses the SELECTED option, ArrowDown → Week on both). The genera:
// the outline VERSION FORM (the s178 genus re-met on the OPEN faces +
// the NEW alpha-color carrier sub-form: OURS 3px none rgb(10,10,10) vs
// the reference's 3px none rgba(10,10,10,0.5) on the triggers — style
// none paints ZERO pixels on both; the items' 3px none vs 2px solid
// transparent the s178 fingerprint) · the box-shadow SLOT-COUNT genus
// (v4's 5 transparent zero-extent slots vs the v3-era's 3 — the
// VISIBLE layers byte-equal: the trigger's shadow-sm
// rgba(0,0,0,0.05) 0 1px 2px 0 + the content's shadow-md pair) · the
// token-selection genus (MENU_CONTENT's border-line/bg-surface/
// text-foreground vs the reference's bare border/bg-popover/
// text-popover-foreground + the items' focus:bg-line-soft/
// focus:text-neutral-900 vs focus:bg-accent/focus:text-accent-foreground
// — computed-equal in BOTH the resting and the REAL-keyboard-highlighted
// states, the M-81c2-decoded #f5f5f5 wash + the #171717 ink shift) ·
// the React useId format genus (radix-_R_*/radix-_r_* vs radix-:r*:) ·
// lucide's aria-hidden version genus (the option's check svg).
//
// The battery below is the born-green contract-freeze form (the s173
// P-p/P-q precedent over working code — the walk surfaced no defect to
// cure, so the pins freeze the walk-proven contracts whole; the
// s179-precedent FULL-string upgrades over the register-level
// fragment pins).
// ---------------------------------------------------------------------------
describe("session-180: the dropdown/select OPEN-state interior walk (walk53 — the OPEN faces byte-equal on both axes, zero live defects)", () => {
  it("the walk53 decode freeze — the two-app OPEN ledger + the REAL keyboard drive + the attribute-selector discovery (the tool's own contract)", () => {
    const src = read("scripts/walk53-dropdown-open-interior.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // the OPEN-state roots — the dropdown proper + the listbox family
    expect(src).toContain(`faceOf(page, '[role="menu"]')`);
    expect(src).toContain(`dumpLedger(page, '[role="menu"]')`);
    expect(src).toContain(`faceOf(page, '[role="listbox"]')`);
    expect(src).toContain(`dumpLedger(page, '[role="listbox"]')`);
    // the REAL keyboard drive (the walk51 form): data-highlighted
    // fires only under real keyboard focus, which no sweep drives
    expect(src).toContain('await page.keyboard.press("ArrowDown")');
    expect(src).toContain(`'[role="menuitem"][data-highlighted]'`);
    expect(src).toContain(`'[role="option"][data-highlighted]'`);
    // BOTH axes — both surfaces exist at phone width
    expect(src).toContain("[1440, 900]");
    expect(src).toContain("[390, 844]");
    // THE WALK'S OWN DISCOVERY (the load-bearing locator): Playwright's
    // getByRole("combobox") engine STOPS matching the trigger once
    // aria-expanded flips true at open (count 0 while the raw
    // [role="combobox"] attribute stays live) — the attribute selector
    // is the only form that matches BOTH the resting and open states.
    expect(src).toContain(`page.locator('[role="combobox"]').first()`);
    expect(src).toContain("aria-expanded");
  });

  it("the account-menu content — MENU_CONTENT stays the walk53-proven OPEN face (the full-string freeze over the register-level pin)", () => {
    // walk53's computed proof: the OPEN [role=menu] bg/color/border/
    // radius byte-equal on both axes (bg-surface computing the
    // reference's bg-popover white; border-line its inherited border
    // #e5e5e5; text-foreground its popover-foreground #0a0a0a) + the
    // VISIBLE shadow-md layers byte-equal behind the v4 slot-count
    // genus. The FULL-string freeze — any token swap, class-order
    // drift, or animation-arm change REDs here.
    expect(MENU_CONTENT).toBe(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-line bg-surface p-1 text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    );
  });

  it("the account-menu items — MENU_ITEM stays the walk53-proven highlighted-wash form (the full-string freeze)", () => {
    // walk53's computed proof: the ArrowDown-highlighted Profile item
    // computes byte-equal on both apps (the #f5f5f5 wash + the #171717
    // ink shift, the M-81c2 decode) — focus:bg-line-soft is the
    // computed-equal expression of the reference's focus:bg-accent,
    // focus:text-neutral-900 of its accent-foreground. The FULL-string
    // freeze pins the whole carrier.
    expect(MENU_ITEM).toBe(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-line-soft focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
    );
  });

  it("the select OPEN content — the M-81c1-decoded z-50/max-h-96 family stays whole (the inline carrier's full-string freeze)", () => {
    // walk53's computed proof: the OPEN [role=listbox] bg/color/border/
    // radius byte-equal on both axes + the VISIBLE shadow-md layers
    // byte-equal (the extra v4 slots fully transparent, zero-extent).
    // The M-81c1 decode (live-DOM on the reference's own open popovers)
    // is the carrier's provenance; the inline string in select.tsx is
    // its only home — the pin reads the source.
    const src = read("src/components/ui/select.tsx");
    expect(src).toContain(
      '"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-line bg-surface text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"',
    );
  });

  it("the select options — the M-81c2-decoded rounded-sm + wash pair stays whole (the item carrier's full-string freeze)", () => {
    // walk53's computed proof: the Month option's RESTING and
    // data-highlighted faces byte-equal on both apps — the checked
    // item carries data-highlighted + data-state=checked identically,
    // the REAL-keyboard ArrowDown moves the highlight to Week on both.
    // The M-81c2 decode (rounded-sm 4px + the #f5f5f5/#171717 wash
    // pair over the reference's accent family) is the carrier's
    // provenance; the inline string is its only home — the pin reads
    // the source.
    const src = read("src/components/ui/select.tsx");
    expect(src).toContain(
      '"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-line-soft focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"',
    );
  });
});

// session-181: THE DIALOG-SURFACE FOCUS-STATE INTERIOR WALK (walk54)
//
// The post-180 audit rotation (its trigger THE OWNER'S NEWEST COMMITS —
// the session_383 transcript, the s180 round's own execution record;
// the s380 close's remaining named candidate: "the dialog-surface
// focus faces" — the s379 close's own third arm). probe:ref STABLE
// (46bc2d9c) killed the fresh-bundle candidate; the registry's latest
// 3.10.1 killed the recharts 4.0 gate.
//
// THE WALK [scripts/walk54-dialog-focus-interior.ts — the walk50
// ledger form over the New Lead dialog's OPEN + FOCUS states at BOTH
// axes (1440x900 + 390x844): Phase A the OPEN spine (the 51-row DFS
// ledger of [role="dialog"][data-state="open"] — the D-112a4 rule)
// + the computed faces of the overlay/content/title/close-X/inputs/
// footer RESTING, Phase B the REAL keyboard Tab drive — 10 stops from
// the mount-focused first input through the whole focusable chain
// (5 inputs · Status · Source · Cancel · Create Lead · the close X)
// with each stop's FOCUSED face censused, then the wrap past the last
// focusable (the Radix focus-trap cycle)].
//
// THE VERDICT: ZERO LIVE DEFECTS — the 51-row spine byte-equal on
// both axes (identical tag census: 12 div · 8 option · 7 label ·
// 5 input · 5 button · 4 path · 3 span · 3 svg · 2 select · 1 h2 ·
// 1 form; ZERO box deltas); the Tab chain position-identical on every
// stop (ld-email → phone → company → value → Status(New) →
// Source(Email) → Cancel → Create Lead → Close → WRAP to ld-name on
// both apps); the mount-focus on the first input with :focus-visible
// TRUE on both (Radix's programmatic mount focus paints the ring);
// every VISIBLE focus face byte-equal — the inputs'/triggers'/
// Cancel's ring rgb(10,10,10) 0px 0px 0px 1px + the shadow-sm layer,
// the submit's ring + its shadow pair, and the close X's DOUBLE ring
// rgb(255,255,255) 0px 0px 0px 2px + rgb(10,10,10) 0px 0px 0px 4px
// (the ring-2 + ring-offset-2 form) — on BOTH axes. The genera: the
// outline VERSION FORM (s178, re-met on every dialog face + the
// alpha-color carrier sub-form: OURS 3px none rgb(10,10,10) vs the
// reference's 3px none rgba(10,10,10,0.5) — style none paints ZERO
// pixels on both; the inputs' 1px none vs 2px solid transparent the
// s178 fingerprint) · the box-shadow SLOT-COUNT genus (v4's extra
// transparent zero-extent slots: 3-vs-1 on the input ring, 4-vs-2 on
// the content, 2-vs-0 on the close-X double ring — every VISIBLE
// layer byte-equal) · the v4 color-serialization genus (the overlay's
// bg-black/80 computing oklab(0 0 0 / 0.8) vs rgba(0,0,0,0.8) — the
// SAME visual color, the s28 canvas-readback precedent) · the
// token-selection genus (the content's border-line/bg-surface vs
// border/bg-background, the inputs' border-line/text-ink/
// placeholder:text-muted-ink vs border-input/placeholder:
// text-muted-foreground, the Cancel's border-line/bg-surface/
// hover:bg-line-soft vs border-input/bg-background/hover:bg-accent,
// the submit's bg-neutral-900/text-neutral-50 vs bg-primary/
// text-primary-foreground — computed-equal on every face) · the
// class-order genus (max-w-lg mid-string vs tail) · the space-y
// margin-BOTTOM family (our mt-2 mb-0 explicit margins vs the
// v3-era's implicit — computed geometry byte-equal) · the s133
// placeholderState retirement (the reference's trigger still carries
// data-[placeholder]:text-muted-foreground) · the F-129c1
// ring-offset-background retirement (the reference's close X still
// carries it — its ride computes #fff on both) · the id-name superset
// (our ld- prefixes) · our aria-label supersets (the Status/Source
// triggers) · the React useId format genus (radix-_R_* vs radix-:r*:)
// · lucide's aria-hidden version genus (the X svg).
//
// THE WALK'S OWN DISCOVERY (the NEW genus): the DANGLING
// aria-describedby — the reference's OPEN dialog declares
// aria-describedby="radix-:r8:" pointing at a NON-EXISTENT node (its
// own platform's dead pointer, live-probed: "NO SUCH ELEMENT"); OURS
// carries no attribute at all (the clean form — the s15-P4
// no-description doctrine; a dangling ARIA reference is the
// reference's own defect, NOT mirrored per the s23 platform-defect
// precedent). Documented here + inside the walk's decode comments.
// ---------------------------------------------------------------------------
describe("session-181: the dialog-surface focus-state interior walk (walk54 — the focus faces byte-equal on both axes, zero live defects)", () => {
  it("the walk54 decode freeze — the two-app dialog focus ledger + the REAL keyboard Tab drive + the D-112a4 root rule (the tool's own contract)", () => {
    const src = read("scripts/walk54-dialog-focus-interior.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // the OPEN dialog root — the D-112a4 rule (our permanently-mounted
    // mobile-nav drawer carries role="dialog" with no data-state)
    expect(src).toContain(`'[role="dialog"][data-state="open"]'`);
    // the overlay: the ONE non-dialog [data-state=open] node (the
    // decode probe's finding — the portal mounts overlay + content as
    // BODY-level siblings; [data-radix-dialog-overlay] matches nothing)
    expect(src).toContain(`'[data-state="open"]:not([role="dialog"])'`);
    // the REAL keyboard Tab drive (the walk51 form): focus-visible
    // fires only under real keyboard focus, which no sweep drives
    expect(src).toContain('await page.keyboard.press("Tab")');
    // the Tab-chain census: 10 stops + the wrap past the last focusable
    // (the Radix focus-trap cycle — stop 10 IS the wrap to ld-name)
    expect(src).toContain("tabStops");
    expect(src).toContain("wrapFocus");
    expect(src).toContain("matchesFocusVisible");
    // BOTH axes — the family's full-bleed phone form is the s15/s112
    // geometry; the focus interior was never walked at either
    expect(src).toContain("[1440, 900]");
    expect(src).toContain("[390, 844]");
    // the mount-focus census (the s112 D1 decode) + the mount face
    expect(src).toContain("mountFocus");
    expect(src).toContain("mountFace");
  });

  it("the dialog content — DIALOG_CONTENT stays the walk54-proven OPEN face (the full-string freeze over the s15 fragment pins)", () => {
    // walk54's computed proof: the OPEN dialog content's bg/color/
    // border/radius byte-equal on both axes (bg-surface computing the
    // reference's bg-background white; border-line its bare border
    // #e5e5e5) + the VISIBLE shadow-lg layers byte-equal behind the v4
    // slot-count genus. The FULL-string freeze — any token swap,
    // class-order drift, or animation-arm change REDs here.
    expect(DIALOG_CONTENT.base).toBe(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-line bg-surface p-6 shadow-lg outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
    );
  });

  it("the close X — DIALOG_CLOSE stays the walk54-proven focused DOUBLE-ring face (the full-string freeze over the s15/s112 fragment pins)", () => {
    // walk54's computed proof: the REAL-keyboard-focused close X
    // computes the DOUBLE ring on both apps — rgb(255,255,255)
    // 0px 0px 0px 2px + rgb(10,10,10) 0px 0px 0px 4px (the ring-2 +
    // ring-offset-2 form) — behind the v4 slot-count genus (our 2
    // extra transparent zero-extent slots). The full-string freeze
    // pins the whole carrier, the focus-ring arm included.
    expect(DIALOG_CLOSE).toBe(
      "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
    );
  });

  it("the overlay — DIALOG_OVERLAY stays the walk54-proven OPEN face (the full-string freeze; the oklab/rgba serialization genus's class carrier)", () => {
    // walk54's computed proof: the overlay's class byte-equal on both
    // apps (fixed inset-0 z-50 bg-black/80 + the fade animations) at
    // 0,0 full-viewport on both axes; the bg computes oklab(0 0 0 /
    // 0.8) on our v4 vs rgba(0,0,0,0.8) on the reference's v3-era —
    // the SAME visual color (the s28 canvas-readback precedent). The
    // full-string freeze pins the carrier the serialization rides on.
    expect(DIALOG_OVERLAY).toBe(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    );
  });
});

// session-182: THE REPORTS-FILTER SELECTS OPEN-STATE INTERIOR WALK (walk55)
//
// The post-181 audit rotation (its trigger THE OWNER'S NEWEST COMMIT —
// the session_384/385 transcripts, the s181 round's own execution
// record; the s384 close's first-named candidate: "the reports filter
// selects' OPEN states beyond the walk53 settings arm" — walk53's
// Phase B consumed the settings Defaults select, the reports page's
// own four filter instances never walked). probe:ref STABLE
// (46bc2d9c) killed the fresh-bundle candidate; the registry's latest
// 3.10.1 killed the recharts 4.0 gate.
//
// THE WALK [scripts/discover-182.ts the discovery probe — the four
// comboboxes at byte-equal geometry on both apps (329/541/729/917,202
// 176x36 at 1440x900, the icon-wrap parents byte-equal); OURS carries
// the four aria-label supersets (Filter by period/owner/stage/
// status — the same accessible-name genus as the walk53 account-menu
// trigger), the reference's triggers carry NONE; the mount-focus
// DIV/option on every open (the walk53 form); the period/stage/
// status option vocabularies byte-equal (6/7/4 options); the OWNER
// select the data-borne arm — OURS (seeded) lists All Owners + the 3
// DISTINCT opp owners, the reference (its live zero-data state) All
// Owners only. Then scripts/walk55-reports-selects-open.ts, the
// walk53 ledger form over the reports filter bar's FOUR selects'
// OPEN states at BOTH axes (1440x900 + 390x844): the trigger
// RESTING + OPEN faces, the listbox DFS ledger, the option faces
// RESTING + the checked option's HIGHLIGHTED face, then the REAL
// keyboard ArrowDown drive (the highlight rides REAL keyboard
// focus — data-highlighted fires under it, which no sweep drives)]:
// ZERO LIVE DEFECTS [the period spine 24 rows byte-equal on both
// axes (6 options, checked This Quarter both, ArrowDown -> YTD
// both); the stage spine 27 rows byte-equal (7 options, ArrowDown ->
// Prospecting both); the status spine 18 rows byte-equal (4
// options, ArrowDown -> Open both); the owner arm the DATA-STATE
// genus — OURS 18 rows (4 options: All Owners + Omar Haddad · Sara
// Chen · Lena Fischer) vs the reference's 9 (1 option: All Owners
// only, its live zero-data state), the listbox height 138-vs-42 the
// data-borne consequence, the ArrowDown landing Omar Haddad-vs-All
// Owners the same; the chrome + the static All Owners option
// byte-equal behind the standing genera]. The genera [the outline
// VERSION FORM re-met on every face + BOTH its sub-forms — the
// alpha-color carrier on the triggers (OURS 3px none rgb(10,10,10)
// vs the reference's 3px none rgba(10,10,10,0.5) — style none
// paints ZERO pixels on both) · the transparent-solid carrier on
// the options (OURS 1px none rgb(16,16,16) vs the reference's 2px
// solid rgba(0,0,0,0) — the s178 fingerprint) · the box-shadow
// SLOT-COUNT genus (5-vs-3 on the trigger, 6-vs-4 on the content —
// every VISIBLE layer byte-equal: rgba(0,0,0,0.05) 0px 1px 2px +
// the content's rgba(0,0,0,0.1) pair) · the token-selection genus
// (the listbox's border-line/bg-surface/text-foreground vs the
// reference's border/bg-popover/text-popover-foreground + the
// options' focus:bg-line-soft focus:text-neutral-900 vs its
// focus:bg-accent focus:text-accent-foreground — the M-81c2 pair,
// computed-equal on every face) · the React useId format genus
// (radix-_r_* vs radix-:r*:) · lucide's aria-hidden version genus
// (the Check svg — the reference's carries NO aria-hidden) · the
// aria-label superset genus (our four trigger labels) · the
// DATA-STATE genus (the owner arm)]; the walk's own decode
// knowledge: the mount-focus lands ON the checked option (the
// DIV/option census, activeElement = the highlighted option), the
// checked option carries data-highlighted at open (Radix's at-open
// highlight), and the trigger's OPEN face is byte-equal to its own
// RESTING face on both apps (no visible focus ring paints on the
// open trigger).
describe("session-182: the reports-filter selects open-state interior walk (walk55 — the four select OPEN interiors byte-equal on both axes, zero live defects)", () => {
  it("the walk55 decode freeze — the four-select OPEN ledger + the REAL keyboard highlight drive + the owner DATA-STATE arm (the tool's own contract)", () => {
    const src = read("scripts/walk55-reports-selects-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // the four-select parameterization (the discovery probe's
    // contract: period · owner · stage · status, the filter bar's
    // combobox DOM order)
    expect(src).toContain('{ key: "period", idx: 0 }');
    expect(src).toContain('{ key: "owner", idx: 1 }');
    expect(src).toContain('{ key: "stage", idx: 2 }');
    expect(src).toContain('{ key: "status", idx: 3 }');
    // the ATTRIBUTE selector is load-bearing (the walk53 discovery:
    // Playwright's getByRole("combobox") engine STOPS matching the
    // trigger once aria-expanded flips true at open)
    expect(src).toContain(`'main [role="combobox"]'`);
    // the REAL keyboard ArrowDown drive (the walk53 form): the
    // data-highlighted wash fires under REAL keyboard focus, which
    // no sweep drives
    expect(src).toContain('await page.keyboard.press("ArrowDown")');
    expect(src).toContain('[role="option"][data-highlighted]');
    // the mount-focus census + the checked option's HIGHLIGHTED face
    // (Radix highlights the selected item at open — the walk's own
    // decode knowledge)
    expect(src).toContain("activeAfterOpen");
    expect(src).toContain("checkedFace");
    // the owner DATA-STATE arm: the option-TEXT census carries the
    // verdict (our seeded DISTINCT opp owners vs the reference's
    // zero-data All Owners-only list)
    expect(src).toContain("optionTexts");
    // BOTH axes — the s105 seeded-state reports guard holds the
    // closed phone surface; the OPEN interiors were never walked
    // at either
    expect(src).toContain("[1440, 900]");
    expect(src).toContain("[390, 844]");
  });

  it("the owner select's option list — the DISTINCT-opportunity-owners derivation stays the s31-decoded contract (the DATA-STATE arm's source carrier)", () => {
    // The s31 bundle decode (live-confirmed): the reference's owner
    // dropdown lists the DISTINCT OPPORTUNITY owner strings (its own
    // `p` memo) — NOT the user directory — over the static
    // "All Owners" head. walk55's two-app proof: the reference (its
    // live zero-data state) renders the head ONLY; OURS (seeded)
    // renders the head + the 3 DISTINCT seeded owners — the list is
    // data-borne by design on BOTH apps (the DATA-STATE genus), and
    // this derivation is the arm's only source carrier.
    const src = read("src/app/(app)/reports/reports-page.tsx");
    expect(src).toContain(
      "const oppOwners = React.useMemo(\n    () => [...new Set(opportunities.map((o) => o.owner).filter((n): n is string => Boolean(n)))],\n    [opportunities],\n  );",
    );
    expect(src).toContain('<SelectItem value="all">All Owners</SelectItem>');
    expect(src).toContain("{oppOwners.map((name) => (");
    expect(src).toContain("<SelectItem key={name} value={name}>{name}</SelectItem>");
    // the derivation reads the OPPORTUNITY table, not the user
    // directory (the s31 contract's negative arm — the memo body is
    // code, so the raw read carries it)
    expect(src).not.toContain("oppOwners.map((u)");
  });

  it("the select item's checked indicator — the walk55-proven indicator span + Check pair stays whole (the full-string freeze, the genuine s180-battery gap)", () => {
    // walk55's computed proof: every checked option row in the two-app
    // ledger carries the SAME indicator construction — the span
    // (absolute right-2 flex h-3.5 w-3.5 items-center justify-center)
    // mounting the Check (h-4 w-4) only when data-state=checked — at
    // byte-equal geometry on both apps (the 14x14 indicator box). The
    // s180 battery froze the content + item strings; the indicator
    // span + icon rode unpinned — the walk's rows 15/16 are this
    // carrier's first two-app proof.
    const src = read("src/components/ui/select.tsx");
    expect(src).toContain('<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">');
    expect(src).toContain('<Check className="h-4 w-4" />');
  });
});

// session-183: THE LEADS-FILTER POPOVER + CONTACTS-FILTER-PANEL
// OPEN-STATE INTERIOR WALK (walk56)
//
// The post-182 audit rotation (its trigger THE OWNER'S NEWEST COMMIT —
// the session_386/387 transcripts, the s182 round's own execution
// record; the s386 close's first-named candidate: "the popover
// family's OPEN faces under ADR-022 — the leads filter popover + the
// contacts filter panel" — walk53 froze the DropdownMenu + Select
// chrome, the Popover family's own carriers never). probe:ref STABLE
// (46bc2d9c) killed the fresh-bundle candidate; the registry's latest
// 3.10.1 killed the recharts 4.0 gate.
//
// THE WALK [scripts/discover-183.ts the discovery probe — the leads
// Filters trigger + the OPEN popover div[role=dialog] at byte-equal
// geometry on both apps (304,443 108x36 + 304,483 320x398 at
// 1440x900; the 390 collision FLIP-UP to data-side=top at 32,36 on
// BOTH apps — the s113-decoded flip re-confirmed); the mount-focus
// BUTTON/combobox (the first select trigger) on both; the field
// labels byte-equal [Status | Source | Min Deal Value | Follow-up
// Date]; OURS carrying the aria-label supersets the reference's
// controls lack; the 1st-Tab landing byte-equal (the Source select
// both); the contacts Filters trigger + the OPEN panel + the Clear
// All geometry byte-equal at BOTH axes; the 20 checkbox ids identical.
// Then scripts/walk56-leads-popover-open.ts, the walk53/55 ledger
// form over the family's TWO OPEN arms at BOTH axes (1440x900 +
// 390x844)]: the D-183a1 LIVE FIND [the contacts Filters trigger's
// OPEN variant-flip: OURS renders OUR blue default (bg-primary
// rgb(37,99,235)) where the reference's own default variant renders
// its DARK stock primary (#171717, rgb(23,23,23) — its global --primary
// token; its blue CTAs carry explicit classes) — the CLOSED outline
// face byte-equal, the OPEN face never walked before; the profile
// save-button precedent (S13-P2/M-80c1) carries the literal family].
// The genera [the outline VERSION FORM + both sub-forms (the
// alpha-color carrier on the triggers/labels/inputs · the
// transparent-solid carrier on the content + the select triggers) ·
// the box-shadow SLOT-COUNT genus (5-vs-3 everywhere, every VISIBLE
// layer byte-equal) · the token-selection genus (the popover's
// border-line/bg-surface/text-foreground + the call-site rounded-md
// shadow-md w-80 p-4 vs the reference's z-50 rounded-md border
// bg-popover p-4 text-popover-foreground shadow-md — the M-81c2
// pair's Popover member) · the s133 placeholderState retirement · the
// React useId format genus (radix-_r_* vs radix-:r*:) · lucide's
// aria-hidden version genus (the X/Save svgs) · the class-order genus
// (h-4 w-4 vs w-4 h-4) · the aria-label superset genus (our trigger +
// field labels)].
describe("session-183: the leads-popover + contacts-panel open-state interior walk (walk56 — the popover family's OPEN faces on both axes; the D-183a1 open-flip find)", () => {
  it("the walk56 decode freeze — the two-arm OPEN ledger + the mount-focus census + the REAL Tab drive + BOTH axes (the tool's own contract)", () => {
    const src = read("scripts/walk56-leads-popover-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A the portal arm — the walk54 D-112a4 root rule over the
    // Popover content ([role=dialog][data-state=open]; the portal
    // mounts at body level)
    expect(src).toContain(`'[role="dialog"][data-state="open"]'`);
    // the mount-focus census + the REAL keyboard Tab drive (the
    // mount-focus rides the first select trigger on both apps — the
    // Popover family's own focus model, no trap)
    expect(src).toContain("mountFocus");
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain("tab1Landing");
    // the data-side + content box census (the 390 collision FLIP-UP to
    // data-side=top on BOTH apps — the s113-decoded flip)
    expect(src).toContain("dataSide");
    expect(src).toContain("contentBox");
    // Phase B the in-flow arm — the panel census keyed on the h3
    // "Filters" header (the s75 kke construction: the sticky header +
    // Clear All + the checkbox card groups)
    expect(src).toContain(`(h.textContent ?? "").trim() === "Filters"`);
    expect(src).toContain("clearAllBox");
    expect(src).toContain("checkboxIds");
    // the trigger face pair (the variant-flip arm the D-183a1 find
    // rode — the RESTING outline face + the OPEN default face)
    expect(src).toContain("triggerResting");
    expect(src).toContain("triggerOpen");
    // BOTH axes
    expect(src).toContain("[1440, 900]");
    expect(src).toContain("[390, 844]");
    // the field faces — the labels census (each label lives in its
    // own field div; the nth-of-type trap the maiden pass caught)
    expect(src).toContain("labelFaces");
  });

  it("the popover content chrome — the shared Dropdown wrapper's content class string stays whole (the full-string freeze, the genuine walk53-battery gap: the DropdownMenu + Select carriers were full-frozen at walk53, the Popover family's own carrier never)", () => {
    // walk56's two-app proof: the OPEN popover's content row (ROW 0,
    // div[role=dialog]) renders byte-equal geometry + computed faces
    // behind the standing genera — the token-selection genus's
    // Popover member: OURS border-line/bg-surface/text-foreground +
    // the call-site rounded-md shadow-md w-80 p-4 vs the reference's
    // z-50 rounded-md border bg-popover p-4 text-popover-foreground
    // shadow-md (the M-81c2 pair, computed-equal on every face). The
    // content string is the family's ONLY chrome carrier (every
    // popover surface in the app rides it — the leads Filters, the
    // accounts tier menu, the row menus).
    const src = read("src/components/ui/dropdown.tsx");
    expect(src).toContain(
      "z-[60] min-w-[10rem] overflow-hidden rounded-lg border border-line bg-surface p-1 text-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    );
  });

  it("the contacts Filters trigger's OPEN face — the reference's DARK stock primary, carried by the neutral literals under the variant ternary (the D-183a1 cure, the profile S13-P2/M-80c1 precedent)", () => {
    // walk56's computed find: the reference's OPEN trigger renders
    // rgb(23,23,23) — ITS global --primary (#171717, the platform's
    // DARK stock primary; its blue CTAs carry explicit classes) —
    // where OURS rendered our blue default (rgb(37,99,235); our
    // --color-primary is deliberately the blue the reference's CTAs
    // use, per the s10-family re-pin). The CLOSED outline face was
    // byte-equal; the OPEN variant-flip was never walked. The cure
    // rides the profile save-button precedent: the variant ternary
    // STAYS (the s75 mechanism pin) + the neutral literal pair
    // (bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 —
    // #171717, the s80-computed hover alpha) overrides the default
    // variant's blue via tailwind-merge, mirroring the reference's
    // own bg-primary text-primary-foreground hover:bg-primary/90.
    const src = read("src/app/(app)/contacts/contacts-page.tsx");
    expect(src).toContain('variant={showFilters ? "default" : "outline"}');
    expect(src).toContain(
      'className={showFilters ? "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90" : undefined}',
    );
  });
});

describe("session-184: the activities more-filters toggle + rail-actions open-state interior walk (walk57 — the expander's hover + open faces byte-equal; the variant-flip family's second member adjudicated CLEAN)", () => {
  it("the walk57 decode freeze — the expander hover/open ledger + the reveal census + the REAL Tab chains + the rail action pair + the phone absence (the tool's own contract)", () => {
    const src = read("scripts/walk57-activities-rail-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A the expander — THE HOVER PROBE: the first mouse-borne
    // face ever walked in the battery (every standing walk drives the
    // REAL keyboard only); the walk's own discovery — Chromium's Tab
    // drive starts from the last-focused element's position even
    // after blur(), so the OPEN-rail chain resets via the blank-spot
    // click (the sequential-navigation starting-point rule, decoded
    // live in the debug leg)
    expect(src).toContain("await trigger.hover()");
    expect(src).toContain("hovered");
    expect(src).toContain("unhovered");
    // the CLICK + the reveal census (OURS reveals More Types | Task |
    // Note — the functional superset; the reference the DEAD STUB,
    // its face the permanently-outline one, L-125c2 re-verified live)
    expect(src).toContain("deadStub");
    expect(src).toContain('=== "More Types"');
    expect(src).toContain("ariaExpanded");
    expect(src).toContain("toggleBackLabels");
    // Phase B the REAL keyboard Tab drive — the closed-rail chain
    // byte-equal on both apps (9 stops) + OURS-OPEN chain (the
    // revealed Task/Note checkboxes enter the order — 11 stops)
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain("closedStops");
    expect(src).toContain("openRail");
    // Phase C the rail action pair (Save All ghost + Filter primary —
    // the D-183a1-family adjudication: the reference's Filter rides
    // its EXPLICIT blue CTA classes, byte-equal rgb(37,99,235)) + the
    // select triggers + the vocabularies (the owner options the
    // DATA-STATE genus's activities member)
    expect(src).toContain("saveAllFace");
    expect(src).toContain("filterFace");
    expect(src).toContain("ownerOptions");
    expect(src).toContain("statusOptions");
    // Phase D the phone-axis ABSENCE census — the rail is
    // display:none below lg (the s109 pin), the VISIBLE-expander
    // count 0 on both apps
    expect(src).toContain("moreVisible");
  });

  it("the activities more-filters expander construction — the FIXED outline variant (no flip: the D-183a1 same-family adjudication CLEAN) + the aria-expanded superset + the functional toggle (the genuine battery gap: no pin held the expander's construction; the s125 walk-pins hold the completed/scheduled toggle, never this one)", () => {
    // walk57's two-app proof: the trigger's RESTING + HOVER faces
    // byte-equal on both apps (the hover wash rgb(245,245,245) + the
    // ink rgb(23,23,23) — computed-EQUAL via the token-selection
    // genus's outline-Button hover member: OURS
    // hover:bg-line-soft hover:text-neutral-900 ≡ the reference's
    // hover:bg-accent hover:text-accent-foreground, the M-81c2 pair).
    // OURS carries the FIXED `variant="outline"` — NO variant flip
    // anywhere on this trigger (the reference's permanently-outline
    // dead face is the only face it can ever show; ours matches both
    // closed AND open). The D-183a1 OPEN-face defect (the contacts
    // Filters trigger's blue-default flip) has NO second member here.
    const src = read("src/app/(app)/activities/activities-page.tsx");
    // the FULL-string freeze (the walk53/56 precedent — the
    // activities page carries a Badge variant="outline" too; only
    // the multi-line block pins the EXPANDER's own construction)
    expect(src).toContain(`variant="outline"
                  className="w-full"
                  aria-expanded={showMoreFilters}
                  onClick={() => setShowMoreFilters((v) => !v)}`);
    expect(src).not.toContain('variant={showMoreFilters ? "default" : "outline"}');
    // OUR accessibility superset — the reference's button carries
    // NO aria (the s88-c9 doctrine, kept)
    expect(src).toContain("aria-expanded={showMoreFilters}");
    // the functional toggle — ours over the reference's dead stub
    // (the s125 fix-over-defect doctrine, L-125c2)
    expect(src).toContain("onClick={() => setShowMoreFilters((v) => !v)}");
    expect(src).toContain("More Filters (1)");
    // the outline Button's hover token contract (the walk's own
    // decode: the computed-equal hover pair)
    const button = read("src/components/ui/button.tsx");
    expect(button).toContain(
      'outline: "border border-line bg-surface text-foreground shadow-sm hover:bg-line-soft hover:text-neutral-900"',
    );
  });

  it("the reveal construction — the More Types group + the Task/Note vocabulary + the walk's own decode knowledge (the revealed checkboxes ENTER the REAL tab order between the type group and the Owner select: the OPEN-rail chain 11 stops vs the closed 9)", () => {
    // walk57's behavioral proof: OURS-OPEN chain = Save All → 4
    // type checkboxes → Task → Note → All Owners → Last 7 Days →
    // More Filters → Filter (11 stops); the closed chain byte-equal
    // 9 stops on both apps; the reference's dead expander never
    // changes its chain. The reveal inserts the group BEFORE the
    // Owner select in DOM order — the tab order follows.
    const src = read("src/app/(app)/activities/activities-page.tsx");
    expect(src).toContain('const VISIBLE_TYPE_FILTERS = ["call", "email", "meeting", "whatsapp"] as const;');
    expect(src).toContain('const MORE_TYPE_FILTERS = ["task", "note"] as const;');
    // the conditional reveal — the group rides the same
    // FILTER_RAIL.groupLabel construction as the type group above
    expect(src).toContain("{showMoreFilters && (");
    expect(src).toContain('More Types');
    expect(src).toContain("FILTER_RAIL.groupLabel}>More Types");
    expect(src).toContain("FILTER_RAIL.checkboxStack");
    // the reveal's checkboxes ride the SAME stock Checkbox
    // construction as the visible four (the S17-P3 stock anatomy)
    expect(src.match(/MORE_TYPE_FILTERS\.map/g) ?? []).toHaveLength(1);
    expect(src.match(/VISIBLE_TYPE_FILTERS\.map/g) ?? []).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Session-185 (walk58): the quick-log dialog open-state interior walk —
// the s390 close's FIRST-NAMED candidate (the Log Activity dialog's
// create-focus arm, the walk54 CREATE-family sibling at this call site)
// + the second-named (the by-type card's checkbox-footer/••• face, the
// s13 construction never re-walked under ADR-022). The discovery
// (scripts/discover-185.ts) proved the reference's quartet FUNCTIONAL
// (the L-125c2 dead-stub doctrine does NOT reach this family) with the
// dialog OPEN at byte-equal geometry on both apps (384,237 672x426
// desktop / 0,201 390x442 phone; the labels + footer + placeholder
// byte-equal; the type quintet Call/Email/Meeting/Task/Note with
// WhatsApp NEVER listed, the L-76c6 doctrine; the related quartet
// Contact/Account/Opportunity/Lead). The walk's verdict: ZERO live
// defects on the family faces EXCEPT the D-185a1 find (the
// placeholder-ink cure, pinned in its own re-anchored s133 block) —
// every remaining delta a documented genus (the box-shadow slot-count
// with every VISIBLE layer byte-equal · the outline VERSION FORM +
// both sub-forms · the oklab/rgba serialization on the overlay · the
// token-selection M-81c2 pairs incl. the footer pair's
// bg-neutral-900 ≡ bg-primary computed rgb(23,23,23), the D-183a1
// same-family check CLEAN · the class-order md:text-sm position · our
// aria-label supersets on the combobox triggers + the ••• dots · the
// React useId format · lucide's aria-hidden X · the Radix
// SelectContent mount-state offset in the interior ledger).
// ---------------------------------------------------------------------------

describe("session-185: the quick-log dialog open-state interior walk (walk58 — the Log Activity dialog's OPEN interiors byte-equal on both apps at both axes; the by-type footer re-walked under ADR-022)", () => {
  it("the walk58 decode freeze — the two-app dialog OPEN ledger at both axes + the mount-focus census + the REAL Tab drive through the dialog + the select vocabularies + the by-type footer decode (the tool's own contract)", () => {
    const src = read("scripts/walk58-quicklog-dialog-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A the dialog OPEN census at BOTH axes (the dialog family is
    // reachable at phone, unlike the rail) — the chrome faces (root +
    // overlay + close X), the interior DFS ledger, the mount-focus
    // census, the combobox faces, the select vocabularies, the footer
    // pair, the CANCEL round-trip
    expect(src).toContain("dialogPhase");
    expect(src).toContain('\'[role="dialog"][data-state="open"]\'');
    expect(src).toContain("mountFocus");
    expect(src).toContain("typeOptions");
    expect(src).toContain("relatedOptions");
    expect(src).toContain("cancelRoundTrip");
    expect(src).toContain("{ w: 390, h: 844 }");
    // Phase B the REAL keyboard Tab drive through the OPEN dialog (the
    // walk54 focus form, now TWO-APP: the chain from the mount-focus
    // stop through the trap, each stop's ring carrier, the Escape
    // round-trip)
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain("escapeClosed");
    // Phase D the by-type footer decode (the s13 construction
    // re-walked under ADR-022 — the discovery proved the checkbox +
    // ••• + label faces byte-equal; the walk freezes the census)
    expect(src).toContain("byTypePhase");
    expect(src).toContain('button[role="checkbox"]');
    expect(src).toContain('"Activities by Type"');
  });

  it("the quick-log trigger→dialog construction — the QUICK_LOG quartet + the onClick wiring + the ActivityDialog call-site props (the genuine battery gap: the s125 pins hold the FORM side, never the PAGE side; the walk proves the reference's quartet FUNCTIONAL — the L-125c2 dead-stub doctrine does not reach this family)", () => {
    const src = read("src/app/(app)/activities/activities-page.tsx");
    // the quartet's vocabulary in ORDER (the walk's census: all four
    // byte-equal on both apps, the emerald DEFAULT member the WhatsApp
    // one — the s83 construction)
    const block = src.slice(src.indexOf("const QUICK_LOG"), src.indexOf("as const;", src.indexOf("const QUICK_LOG")) + 9);
    expect(block).toContain('{ type: "call", label: "Log Call", icon: Phone }');
    expect(block.indexOf('"Log Email"')).toBeGreaterThan(block.indexOf('"Log Call"'));
    expect(block.indexOf('"Log Meeting"')).toBeGreaterThan(block.indexOf('"Log Email"'));
    expect(block.indexOf('"Log WhatsApp"')).toBeGreaterThan(block.indexOf('"Log Meeting"'));
    // the trigger→dialog wiring: every quartet member opens the SAME
    // dialog with the preset (the reference's own Mce construction —
    // the preset rides the SUBMIT, never the visible form, L-76c6)
    expect(src).toContain(`onClick={() => {
                  setEditing(null);
                  setDefaultType(q.type);
                  setDialogOpen(true);
                }}`);
    // the variant ternary (the s83 stock construction: outline x3 + the
    // SOLID emerald WhatsApp)
    expect(src).toContain('variant={q.type === "whatsapp" ? "default" : "outline"}');
    // the call-site props (the preset carrier + the edit-mode null arm)
    expect(src).toContain(
      '<ActivityDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType={defaultType} activity={editing} />',
    );
  });

  it("the by-type footer pair — the defaultChecked checkbox + the htmlFor label + the ••• with the aria-label superset (the genuine gap: the s76/s13 pins hold the CLASS tokens, never the PAIR construction; the walk proves the pair byte-equal on both apps modulo our kept aria superset)", () => {
    const src = read("src/app/(app)/activities/activities-page.tsx");
    // the footer's own block (the walk's census: the checkbox checked
    // fill rgb(23,23,23) byte-equal — the s17 stock doctrine; the •••
    // face byte-equal with OURS carrying the aria-label superset the
    // reference's unnamed button lacks — the s88-c9 doctrine, kept)
    const block = src.slice(src.indexOf("const BY_TYPE_CATEGORIES"), src.indexOf("</Card>", src.indexOf("activities-by-type-toggle")));
    expect(block).toContain('<Checkbox\n                    id="activities-by-type-toggle"\n                    defaultChecked\n                  />');
    expect(block).toContain('htmlFor="activities-by-type-toggle"');
    expect(block).toContain('{BY_TYPE_CARD.footerLabel}');
    expect(block).toMatch(/labelled-by[\s\S]*Activities[\s\S]*<\/label>|>\s*Activities\s*\n\s*<\/label>/);
    expect(block).toContain('aria-label="More actions"');
    expect(block).toContain("•••");
    // the default-checked face is the walk's own proof (the discovery +
    // the walk: checked=true at 16x16 with the dark rgb(23,23,23) fill
    // on BOTH apps)
    expect(block).toContain("defaultChecked");
  });
});

// ---------------------------------------------------------------------------
// Session-186 (walk59): the settings picklist-editor open-state interior
// walk + Defaults-tab selects sibling — the s392 close's FIRST-NAMED
// candidate (the settings pages' own interactive arms under ADR-022 —
// the picklist editor's focus/open faces, the s83-era construction
// never re-walked live) + the Defaults combobox pair. The discovery
// (scripts/discover-186.ts) proved the picklist rows LIVE on BOTH apps
// (the settings singleton's own configuration, NOT the demo data the
// zero-data state wiped — ours the seeded 8/7/6/3/8, the reference its
// own 5/6/6/4/10 defaults: the DATA-STATE genus) with the row chrome
// byte-equal, the rename arm OPENING on both, the mount-focus landing
// on the Save button on both (the DOM-reuse retention), the X/Escape
// cancels the safe two-app round-trips (the destructive arms never
// fired on the reference), and the Defaults vocabularies byte-equal
// (Month/Week — the s72 M-72c3 decode — + Monday/Sunday). The walk's
// verdict: ONE live find cured (D-186a1 the rename-trigger GLYPH — the
// Pen, pinned in its own re-anchored s72 block in
// settings-profile-parity.test.ts) — every remaining delta a
// documented genus (the box-shadow slot-count with every VISIBLE
// layer byte-equal incl. the Input's shadow-sm arm + the Add's bare
// shadow + the select content's shadow-lg · the ring-offset white
// zero-extent slot · the outline VERSION FORM + both sub-forms · the
// token-selection M-81c2 pairs · the class-order md:text-sm position ·
// our aria-label supersets on the Pen/Trash2/Save/X/Add controls ·
// the lucide version genus on the class names · the DATA-STATE values)
// — and the Escape probe answered byte-equal (the reference's own
// rename swap does NOT close on Escape either; the X is the cancel on
// both apps).
// ---------------------------------------------------------------------------

describe("session-186: the settings picklist-editor open-state interior walk (walk59 — the picklist arms' faces byte-equal on both apps at both axes; the D-186a1 Pen glyph cured; the Defaults selects decoded)", () => {
  it("the walk59 decode freeze — the two-app picklist OPEN ledger at both axes + the mount-focus census + the REAL Tab drive through the swapped row + the add-row + the Defaults combobox decode (the tool's own contract)", () => {
    const src = read("scripts/walk59-settings-picklist-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A the picklist OPEN census at BOTH axes (the settings family
    // reachable at phone) — the first-card first-row RESTING face, the
    // Pencil-click swap, the interior DFS ledger, the mount-focus, the
    // rename Input's resting + focus ring, the X close round-trip, the
    // ADD row census (the placeholder + the dark Add + its hover), the
    // row + Trash2 HOVER faces (the walk57 mouse-borne precedent)
    expect(src).toContain("picklistPhase");
    expect(src).toContain('"Contact Sources"');
    expect(src).toContain("mountFocus");
    expect(src).toContain("inputFocusRing");
    expect(src).toContain("xRoundTrip");
    expect(src).toContain('placeholder^="Add new"');
    expect(src).toContain("trashHoverColor");
    expect(src).toContain("rowHoverBg");
    expect(src).toContain("{ w: 390, h: 844 }");
    // Phase B the REAL keyboard Tab drive through the swapped row (the
    // fixed 3-stop chain: the mount-focus Save → Shift-Tab the Input →
    // Tab Save → Tab X) + the ESCAPE probe (the walk's answer: the
    // reference's own swap does NOT close on Escape either)
    expect(src).toContain('await page.keyboard.press("Shift+Tab")');
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain("escapeClosed");
    // Phase D the Defaults tab decode — the two comboboxes' OPEN faces
    // (the Month/Week + Monday/Sunday vocabularies, the highlighted
    // faces, the Escape round-trip) + the four inputs' resting faces
    expect(src).toContain("defaultsPhase");
    expect(src).toContain('"Default Values"');
    expect(src).toContain('[role="listbox"]');
    expect(src).toContain('[role="option"]');
  });

  it("the ListEditor rename-arm construction — the editingIndex ternary + the Input aria-label + the Save/X ghost pair + the Enter wiring + the add-row pair (the genuine battery gap: the s72 pins hold the ROW + the ADD classes, never the RENAME SWAP's construction; the walk proves the swap byte-equal on both apps)", () => {
    const src = read("src/app/(app)/settings/settings-page.tsx");
    // the swap ternary's RESTING arm — the name span + the Pen (the
    // D-186a1 glyph) + the red Trash2, each with its aria-label
    expect(src).toContain(`<>
                  <Input
                    value={editingName}`);
    expect(src).toContain('aria-label={`Rename ${item}`}');
    expect(src).toContain('aria-label="Save rename"');
    expect(src).toContain('aria-label="Cancel rename"');
    // the Enter wiring (the Input's key handler — Enter saves, exactly
    // the reference's own construction; Escape is NOT wired on either
    // app — the walk's byte-equal answer)
    expect(src).toMatch(/if \(e\.key === "Enter"\) \{\s*e\.preventDefault\(\);\s*saveEdit\(\);/);
    // the swap's Input rides the stock Input (no className override on
    // the rename field beyond flex-1 — the walk's census: the byte-equal
    // construction)
    expect(src).toMatch(/<Input\s+value=\{editingName\}\s+onChange=\{\(e\) => setEditingName\(e\.target\.value\)\}\s+className="flex-1"/);
    // the add-row pair — the placeholder Input + the dark Add (the
    // SETTINGS_PICKLIST.addRow/addButton carriers, the s72 pins, riding
    // the walked add-row census: the placeholder byte-equal, the Add
    // rgb(23,23,23) 48x36 byte-equal on both apps)
    expect(src).toMatch(/<Input\s+value=\{value\}\s+onChange=\{\(e\) => setValue\(e\.target\.value\)\}/);
    expect(src).toContain('aria-label="Add item"');
    expect(src).toMatch(/aria-label=\{`Add new \$\{title\.toLowerCase\(\)\} item`}/);
  });

  it("the Defaults-tab select wiring — the Month/Week pair + the Monday/Sunday pair + the debounced set() persist (the genuine gap: the s14 pins hold the LAYOUT, never the two comboboxes' value wiring; the walk proves the vocabularies + the highlighted faces byte-equal on both apps)", () => {
    const src = read("src/app/(app)/settings/settings-page.tsx");
    // the two selects' exact vocabularies (the s72 M-72c3 decode frozen
    // at the walked faces: Month/Week — "Agenda" NEVER returns;
    // Monday/Sunday only). Assert the ITEM members (the source comment
    // carries the retired "Agenda" legend — the M-72c3 doctrine lives
    // in the comment + the item set, never in a bare absence claim)
    const calView = src.slice(src.indexOf('id="def-calview"'), src.indexOf("</Select>", src.indexOf('id="def-calview"')));
    expect(calView).toContain('<SelectItem value="month">Month</SelectItem>');
    expect(calView).toContain('<SelectItem value="week">Week</SelectItem>');
    expect(calView.match(/<SelectItem /g)?.length).toBe(2);
    const firstDay = src.slice(src.indexOf('id="def-firstday"'), src.indexOf("</Select>", src.indexOf('id="def-firstday"')));
    expect(firstDay).toContain('<SelectItem value="monday">Monday</SelectItem>');
    expect(firstDay).toContain('<SelectItem value="sunday">Sunday</SelectItem>');
    expect(firstDay.match(/<SelectItem /g)?.length).toBe(2);
    // the value wiring (the controlled selects ride the defaultsDraft
    // state; the s46-P2 debounced persist owns the writes)
    expect(src).toContain('value={defaults.calendarView} onValueChange={(v) => set("calendarView", v)}');
    expect(src).toContain('value={defaults.firstDayOfWeek} onValueChange={(v) => set("firstDayOfWeek", v)}');
    expect(src).toContain("timerRef.current = setTimeout(() => void flush(), 500);");
    // the fallback family (the M-72c4 decode — the instant-render
    // contract: AED/new/B/3/month/monday before the fetch resolves,
    // byte-equal on both apps per the walk's input census)
    expect(src).toMatch(/defaultCurrency: settings\?\.defaultCurrency \?\? "AED"/);
    expect(src).toMatch(/calendarView: settings\?\.calendarView \?\? "month"/);
    expect(src).toMatch(/firstDayOfWeek: settings\?\.firstDayOfWeek \?\? "monday"/);
  });
});

// ---------------------------------------------------------------------------
// Session-187 (walk60): the profile photo-upload family focus/open interior
// walk + settings Data-tab sibling — the s394 close's named candidates (the
// profile page's own interactive arms under ADR-022 — the s30-era
// construction never re-walked live · the Data-tab template/export
// buttons' focus faces, the s26/s83 margins walked but never the focus
// faces). The discovery (scripts/discover-187.ts) proved BOTH families
// LIVE on BOTH apps with the construction byte-equal on the resting
// faces (h1 + the four labels + the small-card vocabulary + the Upload/
// name/Save geometry byte-equal at 537,312/425,446/425,730; the
// Data-tab three cards byte-equal; the ten-button vocabulary byte-equal;
// the Danger gate states byte-equal), the topbar-search gate KILLED
// again (populated=0 on both), the Edit-family re-check still zero-row.
// The walk's verdict: THREE live finds cured (D-187a1 the file input's
// id + tabIndex retirement — the D-114a2 same-page precedent ·
// D-187a2 the avatar's stock DIV fallback + the color ON THE SVG at
// BOTH sites · D-187a3 the Data-tab 8px button-row offset — the v4
// space-y semantics flip's INLINE-FLOW variant, the reference's
// margin-TOP-on-following dropping the baseline-aligned row 8px, cured
// with the house's s11-era explicit form) — every remaining delta a
// documented genus (the box-shadow slot-count with every VISIBLE layer
// byte-equal — the shadow-sm resting arm, the 1px near-black ring, the
// Save's 0.1-alpha shadow pair · the ring-offset white zero-extent
// slot · the outline VERSION FORM + both sub-forms · the
// token-selection M-81c2 pairs · the class-order family — the avatar's
// h/w positions, flex orderings, the lucide w/h order · our aria-hidden
// supersets · the programmatic-focus stop's :focus-visible absence on
// BOTH apps — the REAL Tab is the true face, and it paints the
// byte-equal 1px near-black ring on both) — the re-walk proves all
// three cures byte-equal (the id/tabIndex pair, the div fallback + the
// svg color, the 8px cured at BOTH cards on BOTH axes).
// ---------------------------------------------------------------------------

describe("session-187: the profile photo-upload + Data-tab focus/open interior walk (walk60 — both families byte-equal on both apps at both axes post-cure; the D-187a1/a2/a3 cures re-walked byte-equal)", () => {
  it("the walk60 decode freeze — the two-app profile OPEN ledger at both axes + the REAL Tab drives + the Data-tab sibling decode (the tool's own contract)", () => {
    const src = read("scripts/walk60-profile-datatab-focus-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A the profile OPEN census at BOTH axes — the PI card's DFS
    // ledger, the avatar's face (the D-187a2 tag/carrier decode), the
    // Upload button's resting + focus faces + its Camera glyph, the
    // hidden file input's construction census (the D-187a1 id decode),
    // the name input's rings, the disabled email/role faces, the Save
    // button's shadow pair, the right-column census
    expect(src).toContain("profilePhase");
    expect(src).toContain('"Personal Information"');
    expect(src).toContain('input[type="file"]');
    expect(src).toContain("fileInput");
    expect(src).toContain("innerTag");
    expect(src).toContain("svgCls");
    expect(src).toContain('filter({ hasText: "Upload Photo" })');
    expect(src).toContain('input[id="display_name"]');
    expect(src).toContain('filter({ hasText: "Save Changes" })');
    expect(src).toContain("{ w: 390, h: 844 }");
    // Phase B the REAL keyboard Tab drive through the profile form +
    // the Data-tab row (the programmatic .focus() never triggers
    // :focus-visible there on either app — the REAL keyboard is the
    // only true face)
    expect(src).toContain("profileTabPhase");
    expect(src).toContain("dataTabTabPhase");
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain("normChain");
    // Phase C the Data-tab sibling — the three cards' geometry ledger
    // (the D-187a3 8px decode), the template/export buttons' faces,
    // the Danger Zone's census, the RESET input's ring, the gate
    // states (the write NEVER fired)
    expect(src).toContain("dataTabPhase");
    expect(src).toContain('"Import Templates"');
    expect(src).toContain('"Danger Zone"');
    expect(src).toContain('input[placeholder="RESET"]');
    expect(src).toContain("emptyGate");
    expect(src).toContain("armed");
  });

  it("the profile avatar family — the stock two-level structure at BOTH sites (the genuine battery gap: the s13 pins held the ROOT span + the icon class, never the fallback's tag or the color carrier; the walk proves the reference's DIV fallback + the ON-SVG color byte-equal)", () => {
    const src = read("src/app/(app)/profile/profile-page.tsx");
    // the form avatar: the span root keeps its aria-hidden superset; the
    // fallback is the DIV (the stock AvatarFallback form the topbar
    // already carries); the color rides the SVG via PROFILE_LAYOUT.avatarIcon
    // (the [\s\S]*? allows the s30-era comment block inside the span)
    expect(src).toMatch(/<span\s+className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full sm:h-24 sm:w-24"\s+aria-hidden="true"\s*>[\s\S]*?\{photoUrl \? \(/);
    expect(src).toContain('<div className="flex h-full w-full items-center justify-center bg-blue-100">\n                    <User className={PROFILE_LAYOUT.avatarIcon}');
    // the Account card avatar: the SAME two-level cure (its reference
    // svg renders `lucide-user w-10 h-10 text-blue-600`)
    expect(src).toContain('<div className="flex h-full w-full items-center justify-center bg-blue-100">\n                  <User className="h-10 w-10 text-blue-600"');
    // the retired wrapper-span carrier must stay gone (both sites)
    expect(src).not.toMatch(/<span className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600">/);
  });

  it("the Data-tab list-body rhythm — the v3 following-sibling form wired on both cards (the genuine gap: the s14/s26/s83 pins held the labels/margins/icon, never the v4-vs-v3 rhythm arm; the walk proves the 8px cured byte-equal at both cards on both axes)", () => {
    const src = read("src/app/(app)/settings/settings-page.tsx");
    // both list bodies ride the contract (the template card + the
    // export card) — the D-187a3 carrier
    const uses = src.match(/SETTINGS_DATA\.listBody/g) ?? [];
    expect(uses.length).toBe(2);
    // the contract itself: the explicit following-sibling form, never
    // the v4 space-y string (the re-anchored s14 pin holds the same
    // string; this freeze holds the WIRING)
    const layout = read("src/lib/page-layout.ts")!;
    const block = layout.slice(layout.indexOf("SETTINGS_DATA = {"), layout.indexOf("SETTINGS_DATA = {") + 2600);
    expect(block).toMatch(/listBody:\s*"p-6 pt-0 \[&>\*\+\*\]:mt-2"/);
    expect(block).not.toMatch(/listBody:\s*"p-6 pt-0 space-y-2"/);
  });
});

// ---------------------------------------------------------------------------
// Session-188 (walk61): the settings segmented tab-bar focus/open interior
// walk + the accounts-rail/leads-search page-arms sibling — the s396 close's
// named candidates (the settings Data-tab's OWN deeper focus faces — the
// tab-bar segmented focus faces never walked · the account/leads/reports
// page-level interactive arms under ADR-022 — the s18/s25-era constructions
// never re-walked live). The discovery (scripts/discover-188.ts + the
// micro-probe scripts/probe-leads-search-and-tab-outline.ts) proved ALL
// families LIVE on BOTH apps with the construction byte-equal on every
// resting face (the strip `288,189 1120x36` + the three triggers byte-equal
// at `292/663/1033 371x28`; the rail selects byte-equal at
// `1113,376/456/536 270x36`; the leads search byte-equal at `304,391
// 1088x36` + `32,1037 326x36` at phone; the reports pills/selects
// byte-equal modulo the walk52-documented DATA-STATE y-offset), the
// density-selects arm KILLED (F-147c3 retired upstream), the leads-search
// aria-label superset confirmed (the reference's input carries NONE), the
// topbar-search gate KILLED again (populated=0 on both), the Edit-family
// re-check still zero-row. The walk's verdict: ZERO LIVE FINDS — every
// delta a documented genus, the round the s134-precedent zero-fix
// freeze-pin session. The NEW genus sub-form the decode adds to the
// register: the outline COLOR-CARRIER arm (at rest and at mouse-click both
// apps compute outline-style NONE — zero visible pixels — but the carrier
// color resolves currentColor on OURS [rgb(10,10,10)/rgb(115,115,115)/
// rgb(29,78,216) per element] against the reference's platform constant
// rgba(10,10,10,0.5) on every element; under the REAL keyboard the s178
// outline-none v3/v4 sub-forms hold — OURS `1px none`, REF `2px solid
// rgba(0,0,0,0)` — and the VISIBLE focus ring layers are byte-equal: the
// white 2px offset slot + the 4px near-black ring + the active shadow
// pair). The REAL keyboard Tab chain: STRUCTURALLY IDENTICAL — 13 stops
// both (the 8 sidebar links → the topbar search → the 3 topbar buttons →
// the strip), the ArrowRight automatic-activation landing byte-equal.
// ---------------------------------------------------------------------------

describe("session-188: the settings tab-bar + rail/leads page-arms focus/open interior walk (walk61 — zero live finds; every delta a documented genus, both apps byte-equal on every resting + REAL-keyboard face at both axes)", () => {
  it("the walk61 decode freeze — the two-app settings tab-bar OPEN ledger at both axes + the REAL Tab/ArrowRight drive + the mouse-click face + the rail/leads/reports siblings' decode (the tool's own contract)", () => {
    const src = read("scripts/walk61-settings-tabs-rail-focus-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A the settings tab-bar OPEN census at BOTH axes — the
    // strip's geometry ledger, the three triggers' resting faces, the
    // data-state arms, the click-through round-trip (local state, NO
    // writes), the panel mount census, the s23 live-measured 24px gap
    expect(src).toContain("tabsPhase");
    expect(src).toContain('main [role="tablist"]');
    expect(src).toContain("contentGap");
    expect(src).toContain("flipRoundTrip");
    expect(src).toContain('"CRM Configuration"');
    expect(src).toContain('"Defaults"');
    expect(src).toContain('{ w: 390, h: 844 }');
    // Phase B the REAL keyboard Tab drive into the strip (the
    // programmatic .focus() face is NEVER trusted — the REAL keyboard
    // is the only true focus face) + the ArrowRight s23 contract
    expect(src).toContain("tabsRealTabPhase");
    expect(src).toContain("tabStopIndex");
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain('await page.keyboard.press("ArrowRight")');
    expect(src).toContain("normChain");
    // Phase B2 the REAL mouse-click face (the walk57 mouse-borne
    // precedent — the outline decode: :focus without :focus-visible)
    expect(src).toContain("tabsMousePhase");
    expect(src).toContain('filter({ hasText: "Defaults" })');
    // Phase C the accounts rail sibling — the three filter selects'
    // geometry + faces + the OPEN listbox census (the DATA-STATE
    // item-count genus: REF 1 at zero-data vs OURS 5 at the seeded db)
    expect(src).toContain("railPhase");
    expect(src).toContain('main [role="combobox"]');
    expect(src).toContain("firstOpen");
    expect(src).toContain("itemCount");
    // Phase D the leads search sibling — the input's resting + focus
    // faces + the toolbar geometry + the Filters trigger (walk56's
    // OPEN face re-censused at rest)
    expect(src).toContain("leadsPhase");
    expect(src).toContain('main input[placeholder="Search leads..."]');
    expect(src).toContain("focusRing");
    // Phase E the reports pills/selects re-walk leg (the walk52/55
    // re-check on the live tree)
    expect(src).toContain("reportsPhase");
  });

  it("the settings tab-bar call-site construction — the segmented strip's OWN wiring (the genuine battery gap: the s23 pins hold the tabs-aria WIRING + the s12/s125/s129 pins the constant's class strings, never the settings page's own segmented call-site)", () => {
    const src = read("src/app/(app)/settings/settings-page.tsx");
    // the walk's live decode: the strip `variant="segmented" cols={3}`
    // with the space-y-6 wrapper (the s23-era construction, the 24px
    // strip-to-content gap live-measured byte-equal on both apps) +
    // the three-tab vocabulary byte-equal on both apps
    expect(src).toContain('variant="segmented"');
    expect(src).toContain("cols={3}");
    expect(src).toContain('className="space-y-6"');
    expect(src).toContain('value={tab}');
    expect(src).toContain("onValueChange={setTab}");
    expect(src).toContain('{ id: "config", label: "CRM Configuration" }');
    expect(src).toContain('{ id: "defaults", label: "Defaults" }');
    expect(src).toContain('{ id: "data", label: "Data" }');
    // the panel shells: the mt-2 gap-collapse arms + the space-y
    // rhythm arms (the s72 space-y-6 Data panel direct form)
    expect(src).toContain('<TabsPanel tab="config" className="mt-2 space-y-4">');
    expect(src).toContain('<TabsPanel tab="defaults" className="mt-2 space-y-4">');
    expect(src).toContain('<TabsPanel tab="data" className="mt-2 space-y-6">');
  });

  it("the accounts rail-selects construction — the three filter comboboxes' call-sites (the genuine battery gap: the s28 pins hold the row/rail geometry, never the three SelectTrigger sites' construction + the Label pairing; the walk proves the boxes byte-equal at 1113,376/456/536 270x36 on both apps)", () => {
    const src = read("src/app/(app)/accounts/accounts-page.tsx");
    // the three rail sites: the aria-label superset (s88-c9, KEPT —
    // the reference's comboboxes carry NONE; the axe battery requires
    // the names) + the w-full arm + the reference's placeholder values
    expect(src).toContain('<SelectTrigger aria-label="Filter by owner" className="w-full"><SelectValue placeholder="John Kuy" /></SelectTrigger>');
    expect(src).toContain('<SelectTrigger aria-label="Filter by industry" className="w-full"><SelectValue placeholder="Technology" /></SelectTrigger>');
    expect(src).toContain('<SelectTrigger aria-label="Filter by revenue range" className="w-full"><SelectValue placeholder="$1M to $5M" /></SelectTrigger>');
    // the Label pairing (the walk's label census: Owner/Industry/
    // Revenue Range byte-equal on both apps)
    expect(src).toContain('<Label className={FILTER_RAIL.groupLabelSelect}>Owner</Label>');
    expect(src).toContain('<Label className={FILTER_RAIL.groupLabelSelect}>Industry</Label>');
    expect(src).toContain('<Label className={FILTER_RAIL.groupLabelSelect}>Revenue Range</Label>');
  });

  it("the leads-search call-site construction — the toolbar search row (the genuine battery gap: the s29 pins hold the inline ROW + the s8-4 pin the pl-10 arm, never the search input's own call-site; the walk proves the box byte-equal at 304,391 1088x36 desktop + 32,1037 326x36 phone)", () => {
    const src = read("src/app/(app)/leads/leads-page.tsx");
    // the icon + the input: the s8-4 anatomy (w-5 icon + pl-10 input)
    // + the aria-label superset (s88-c9, KEPT — the reference's input
    // carries NO aria-label; the placeholder byte-equal both apps)
    expect(src).toContain('<Search className={cn("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle", LEADS_TOOLBAR.searchIcon)} />');
    expect(src).toContain('<Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className={LEADS_TOOLBAR.searchInput} aria-label="Search leads" />');
    // the Filters trigger row sibling (walk56's popover trigger — the
    // walk re-censused its resting face byte-equal at 304,443 108x36)
    expect(src).toContain('aria-label="Open lead filters"');
  });
});

// ---------------------------------------------------------------------------
// Session-189 (walk62): the leads Saved-Views select open faces + the
// calendar month-nav arms interior walk — the s398 close's named
// candidates (the account INSIGHTS dialog + the leads SAVED-VIEWS
// select's open faces — the s28/s29-era constructions never re-walked
// live under ADR-022 · the calendar month-nav arms — the s27-era
// construction, its interactive faces never walked). The discovery
// (scripts/discover-189.ts) adjudicated: the Insights arm KILLED (the
// reference's zero-row state persists — rows=1/rowMenus=0/
// insightsTriggers=0 on all three entity pages, zero calendar chips),
// the topbar-search gate KILLED again (populated=0 on both), the
// Saved-Views select + the month-nav LIVE on BOTH apps. The walk's
// verdict: ZERO LIVE FINDS — every delta a documented genus, the round
// the s134/s188-precedent zero-fix freeze-pin session. The byte-equal
// ledger: the select `428,443 192x36` desktop + `32,482 326x36` phone
// + the OPEN listbox `428,483 194x42` radius 6 + the one-item
// vocabulary identical on both apps; the nav heading `313,374 183x32`
// + prev `877,372 36x36` + Today `921,372 75x36` + next `1003,372
// 36x36` byte-equal; the REAL-keyboard chains: the select reached at
// stop 5 on BOTH (Export → New Lead → search → Filters → the select),
// the nav row reached at stop 15 on BOTH (STRUCTURALLY IDENTICAL tag+
// geometry sequences); the REAL :focus-visible faces byte-equal on
// the VISIBLE layers (the 1px near-black ring + shadow-sm; the outline
// s178 sub-forms + the slot-count + the s129 white zero-extent offset
// slot the standing genera); the month-flip round-trip identical
// (prev → "September 2026"; today → "October 2026"); the phone axis:
// the select w-full stack byte-equal, the Today button hidden below
// sm on BOTH (the s27 live pin); the Saved-Views persistence OURS the
// kept superset (localStorage vs the reference's memory-only list —
// the s29 live-verified contract; the walk's drive runs same-session
// so the REF's select survives). The aria-label superset (s88-c9,
// kept) covers the select trigger + both nav icons; the token genus
// (M-81c2: border-line/bg-surface vs border-input/bg-popover,
// computed-equal) covers the select + listbox + nav buttons; the
// class-order genus covers the outline-button ring-position pair.
// ---------------------------------------------------------------------------

describe("session-189: the leads Saved-Views select + calendar month-nav focus/open interior walk (walk62 — zero live finds; every delta a documented genus, both apps byte-equal on every resting + REAL-keyboard face at both axes)", () => {
  it("the walk62 decode freeze — the two-arm OPEN ledger at both axes + the REAL Tab/ArrowDown drives + the native-prompt save flow + the month-flip round-trips (the tool's own contract)", () => {
    const src = read("scripts/walk62-savedviews-calnav-focus-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A the Saved-Views select OPEN census at BOTH axes — the
    // pre-save absence census, the save flow (the Filters popover →
    // Save View → the NATIVE prompt — the s29 live-verified contract),
    // the mounted select's geometry ledger, the OPEN listbox census
    // (radius 6, the one-item vocabulary), the apply round-trip
    expect(src).toContain("savedViewsPhase");
    expect(src).toContain("preSaveComboCount");
    expect(src).toContain('accept("Walk62 View")');
    expect(src).toContain("applyRoundTrip");
    expect(src).toContain('{ w: 390, h: 844 }');
    // Phase B the REAL keyboard drive into the mounted select — the
    // SAME-SESSION form (the reference keeps its view list IN MEMORY
    // ONLY — ours persists to localStorage, the kept superset; a
    // reload would kill the REF's select) + the ArrowDown open +
    // the highlight + the Enter apply
    expect(src).toContain("IN MEMORY ONLY");
    expect(src).toContain("selectRealDrivePhase");
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain('await page.keyboard.press("ArrowDown")');
    // Phase C the calendar month-nav census — the header-row geometry
    // ledger, the three buttons' resting faces, the click round-trip
    // (prev → the heading flip; today → the today-jump back — local
    // state, NO writes), the month-flip grid re-census
    expect(src).toContain("navPhase");
    expect(src).toContain("flipRoundTrip");
    expect(src).toContain("gridAfterFlip");
    // Phase C2 the REAL keyboard Tab drive through the three nav
    // buttons (the REAL :focus-visible faces — the programmatic face
    // is never the true face) + the s88-c9 naming normalization
    expect(src).toContain("navRealTabPhase");
    expect(src).toContain("landingFaces");
    expect(src).toContain("tagOf");
  });

  it("the Saved-Views select call-site construction — the conditionally-mounted select's own chain (the genuine battery gap: the s29 pins hold the toolbar row + the savedViewsSelect width class, never the SelectTrigger call-site's construction; the walk proves the box byte-equal at 428,443 192x36 desktop + 32,482 326x36 phone + the OPEN listbox 428,483 194x42 radius 6 on both apps)", () => {
    const src = read("src/app/(app)/leads/leads-page.tsx");
    // the conditional mount (the s29-P3 live-confirmed contract: the
    // select appears once a view exists) + the uncontrolled Select
    // riding onValueChange (the apply seam)
    expect(src).toContain("{savedViews.length > 0 && (");
    expect(src).toContain("<Select onValueChange={applyView}>");
    // the trigger: the width class + the aria-label superset (s88-c9,
    // KEPT — the reference's combobox carries NONE; the axe battery
    // requires the name) + the byte-equal placeholder both apps
    expect(src).toContain('<SelectTrigger className={LEADS_FILTERS_POPOVER.savedViewsSelect} aria-label="Saved views">');
    expect(src).toContain('<SelectValue placeholder="Saved Views" />');
    // the item map (the savedViews list — ours persisted to
    // localStorage, the reference's memory-only list the kept
    // superset)
    expect(src).toContain("{savedViews.map((v) => (");
    expect(src).toContain("<SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>");
  });

  it("the calendar month-nav call-site construction — the three outline buttons' own call-sites (the genuine battery gap: the s16 pins hold the navRow container + the s27 pins the day cells, never the three Button call-sites; the walk proves the boxes byte-equal at 877/921/1003,372 36x36/75x36/36x36 on both apps + the phone-axis Today kill on both)", () => {
    const src = read("src/app/(app)/calendar/calendar-page.tsx");
    // the prev/next icon pair: the outline variant + size="icon" + the
    // aria-label superset (s88-c9, KEPT — the reference's buttons
    // carry NONE) + the cursor month-flip wiring (local state)
    expect(src).toContain('<Button variant="outline" size="icon" aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))}>');
    expect(src).toContain('<ChevronLeft className="h-4 w-4" />');
    expect(src).toContain('<Button variant="outline" size="icon" aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))}>');
    expect(src).toContain('<ChevronRight className="h-4 w-4" />');
    // the Today button: the outline variant + the hidden-below-sm arm
    // (the s27 live pin — the phone-axis kill byte-verified on BOTH
    // apps at 390: 2 nav buttons on each) + the today-jump wiring
    // (cursor + selectedDay, local state)
    expect(src).toContain('className="hidden sm:flex"');
    expect(src).toContain("setCursor(now);");
    expect(src).toContain("setSelectedDay(now);");
  });
});

// ---------------------------------------------------------------------------
// Session-190 (walk63): the reports Save-Custom-View dialog open faces
// interior walk — the s400 close's named candidates (the reports
// SAVE-CUSTOM-VIEW dialog — the s25-era construction, its open faces
// never walked under ADR-022 · the dashboard follow-up-rows checkbox
// arms — the s27-era construction · the activities Completed-tab row
// actions — the s109-era construction). The discovery
// (scripts/discover-190.ts + the micro-probes) adjudicated: the
// dialog LIVE on BOTH apps at every censused face; the dashboard
// checkbox arms + the Completed-tab row actions KILLED (the
// reference's zero-data state persists — 0 checkboxes on Lead
// Sources, the No-upcoming empty state, the empty Completed panel);
// the topbar-search gate KILLED again (populated=0). The walk's
// verdict: ONE live find — D-190a1 THE SIX COLUMN CHECKBOXES'
// LITERAL ID/FOR CONSTRUCTION (the reference's checkboxes carry the
// literal REPORT_COLUMNS keys as ids — id="name" … id="wonDate",
// for="name" … for="wonDate" — ours shipped React useId ids; the
// D-114a2/D-187a1 ids-are-construction-parity doctrine; THE CURE:
// id={col.key} at the call site, the component's id ?? generated
// seam carrying it to the htmlFor). The byte-equal ledger: the
// trigger `1216,113 192x36` + the OPEN dialog `384,240 672x420` +
// the input `409,343 622x36` (placeholder + the COMPUTED font
// 14px/400 line 20px byte-equal — the md:text-sm a class-order
// genus, the reference appending it at the chain's end) + the
// checkbox[0] `409,423 16x16` + the summary `409,521 622x46` + the
// footer Cancel `792,599 81x36` / Save `882,599 149x36` / Close
// `1023,257 16x16` — all byte-equal at BOTH axes (the phone root
// `0,184 390x476`, the phone input 16px/400 — the s9 below-md
// doctrine); the REAL-keyboard chain STRUCTURALLY IDENTICAL (10
// stops: the mount input → 6 checkboxes → Cancel → Close → the
// input wrap — the Save NEVER in the chain at the fresh-open state,
// disabled buttons are not focusable; the post-type drive captures
// its REAL face); the REAL :focus-visible faces byte-equal on the
// VISIBLE layers (the 1px near-black ring); the interactive arms
// byte-equal (the type-flip + the save round-trip `Saved Reports
// (1)` + the L-74c8 post-save clear + the L-74c7 cancel-keep + the
// saved row name/date + the Load token genus + the checkbox-toggle
// faces); every remaining delta a documented genus (the slot-count
// with every VISIBLE layer byte-equal · the outline VERSION FORM +
// both sub-forms · the s129 ring-offset white zero-extent slot ·
// the M-81c2 token pairs — border-line/bg-surface/text-ink/
// muted-ink/line-soft/neutral-900 vs border-input/bg-background/
// muted-foreground/accent/primary, computed-equal on every face ·
// the class-order genus · the React useId format · the DANGLING
// aria-describedby genus [walk54: the reference's own dead pointer,
// not mirrored] · the aria-hidden svg superset [kept]).
// ---------------------------------------------------------------------------

describe("session-190: the reports Save-Custom-View dialog focus/open interior walk (walk63 — one live find cured [D-190a1 the checkbox literal ids]; every other delta a documented genus, both apps byte-equal on every resting + REAL-keyboard face at both axes)", () => {
  it("the walk63 decode freeze — the one-arm OPEN ledger at both axes + the REAL Tab/Save drives + the save/reopen round-trips + the checkbox-toggle ride (the tool's own contract)", () => {
    const src = read("scripts/walk63-savedreports-dialog-focus-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A the OPEN dialog census at BOTH axes — the trigger's
    // resting face, the click-open ride, the root geometry ledger,
    // the title, the name input's FULL chain + computed font, the
    // 6-column checkbox grid, the Current-Filters summary, the
    // footer pair, the close X, the mount focus
    expect(src).toContain("dialogPhase");
    expect(src).toContain("mountFocus");
    expect(src).toContain("closeAria");
    expect(src).toContain('{ w: 390, h: 844 }');
    // Phase B the REAL keyboard Tab drive through the OPEN dialog
    // (the walk54/58 focus form) + the disabled-Save decode (the
    // Save NEVER in the fresh-open chain — the post-type drive
    // captures its REAL face)
    expect(src).toContain("tabPhase");
    expect(src).toContain("the Save button is DISABLED at the fresh-open state");
    expect(src).toContain('await page.keyboard.press("Tab")');
    // Phase C the interactive arms — the type-flip, the SAVE
    // round-trip (the localStorage seam), the post-save REOPEN (the
    // L-74c8 name-clear), the saved-list arm, the cancel-then-reopen
    // decode (the L-74c7 keep), the checkbox-toggle ride
    expect(src).toContain("interactivePhase");
    expect(src).toContain("typeFlipsSave");
    expect(src).toContain("reopenName");
    expect(src).toContain("cancelReopenKeepsName");
    expect(src).toContain("checkboxToggle");
  });

  it("the Saved-Reports TRIGGER call-site construction — the outline button's own chain (the genuine battery gap: the s25 pins hold the wiring regex, never the trigger's own construction; the walk proves the box byte-equal at 1216,113 192x36 on both apps)", () => {
    const src = read("src/app/(app)/reports/reports-page.tsx");
    // the outline variant + the Bookmark glyph + the LIVE count form
    // (the s25-P4 wiring, now the construction freeze)
    expect(src).toContain('<Button\n            variant="outline"\n            onClick={() => setSaveDialogOpen(true)}\n          >');
    expect(src).toContain('<Bookmark className="h-4 w-4 mr-2" /> Saved Reports ({savedCount})');
  });

  it("the Save-Report-Dialog open-interior construction — the wide shell + the name input + the checkbox grid + the summary box + the footer pair (the genuine gap: the s25 pins hold the content words as regexes, never the call-site chains; the walk proves the root byte-equal at 384,240 672x420 + the input 409,343 622x36 + the checkbox[0] 409,423 16x16 + the summary 409,521 622x46 + Cancel 792,599 81x36 + Save 882,599 149x36 on both apps at BOTH axes)", () => {
    const src = read("src/components/shared/save-report-dialog.tsx");
    // the wide shell (the s30-P6 scroll-cap pair — the s68 N-68d wiring)
    expect(src).toContain('<DialogContent className={DIALOG_CONTENT.wide}>');
    // the name input: the htmlFor/id pairing + the mt-1 + the exact
    // placeholder (the walk: the COMPUTED font byte-equal 14px/400)
    expect(src).toContain('<Label htmlFor="reportName">Report Name</Label>');
    expect(src).toContain('id="reportName"');
    expect(src).toContain('className="mt-1"');
    expect(src).toContain('placeholder="e.g., Q1 Won Deals by Region"');
    // the six-column checkbox grid: the two-column rhythm
    expect(src).toContain('<div className="grid grid-cols-2 gap-3">');
    // the Current-Filters summary box (the three-dimension line)
    expect(src).toContain('className="bg-blue-50 border border-blue-200 rounded-lg p-3"');
    // the footer pair: the outline Cancel + the BLACK-pair Save (the
    // s123 F-123a4 DIALOG_SUBMIT family) with the disabled-until-named
    // gate + the L-74c8 post-save clear
    expect(src).toContain('<Button variant="outline" onClick={() => onOpenChange(false)}>');
    expect(src).toContain('className={DIALOG_SUBMIT.button}');
    expect(src).toContain("disabled={name.trim().length === 0}");
    expect(src).toContain('setName("");');
  });

  it("D-190a1 the six column checkboxes' LITERAL id/for construction — the reference's checkboxes carry the literal REPORT_COLUMNS keys as ids (id=\"name\" … id=\"wonDate\", for=\"name\" … for=\"wonDate\" — live-walked byte-equal on the reference's DOM); ours shipped React useId ids (the D-114a2/D-187a1 ids-are-construction-parity doctrine; the cure: id={col.key} at the call site, the component's id ?? generated seam carrying it to the htmlFor)", () => {
    const src = read("src/components/shared/save-report-dialog.tsx");
    // the literal-id cure: every checkbox rides its REPORT_COLUMNS
    // key as the id (the reference's own construction)
    expect(src).toContain("<Checkbox");
    expect(src).toContain("id={col.key}");
    expect(src).toContain("key={col.key}");
    // the component seam honors the id (the generated fallback only
    // when no id passed)
    const comp = read("src/components/ui/label.tsx")!;
    expect(comp).toContain("const inputId = id ?? generated;");
    expect(comp).toContain("htmlFor={inputId}");
  });
});

// ---------------------------------------------------------------------------
// Session-191 (walk64): THE THREE CREATE DIALOGS' OPEN FACES — the two-app
// element-level ledger of the three unwalked members of the create-dialog
// family (the CONTACT — the s15/s30-era avatar + photo-upload construction ·
// the ACCOUNT — the s15/s5-era 8-field 2-col grid · the EVENT — the
// s15/s76 WIDE family), the discovery probe's live adjudication
// (scripts/discover-191): all LIVE on BOTH apps, byte-equal at the census
// level — the triggers 1255,115 153x36 / 1274,103 134x32 / 1269,113 139x36
// byte-equal, the OPEN roots 464,45 512x810 / 384,214 672x472 /
// 384,133 672x634 byte-equal, the titles byte-equal, the field vocabularies
// byte-equal (the contact's 6 placeholders + type=tel; the account's 8
// placeholder-LESS fields; the event's combobox trio + datetime pair +
// Location placeholder), the footer pairs byte-equal, the mount-focus
// byte-equal BEHAVIOR (the camera button on the contact; the first input on
// the account/event), the REAL-TAB chains STRUCTURALLY IDENTICAL (19/12/19
// stops), the select rides byte-equal (the meet-select's 5 emoji options +
// the status 3-option set + the listbox boxes), the EVENT related-to pick
// byte-equal (the M-76c13 conditional Name field — the placeholder "Enter
// Contact name" + the box 728,638 303x36 + the comboTexts flip), the phone
// axes byte-equal (0,42 390x760 / 0,168 390x508 / 0,99 390x646).
// THE WALK'S VERDICT — the live finds, all ONE FAMILY (the ids): D-191a1
// THE CONTACT DIALOG'S LITERAL ID/FOR MAP (the reference carries
// id="name"/"email"/"phone"/"company"/"position" with for= the same; ours
// shipped ct-*) · D-191a2 THE ACCOUNT DIALOG'S LITERAL ID/FOR MAP (the
// reference: name/industry/email/phone/website/revenue/employees; ours
// acc-*) · D-191a3 THE SELECTS' ID + LABEL FOR WIRING (the reference's
// meet-select carries button id="source" + label for="source"; its account
// Status button id="status" + label for="status"; ours shipped bare labels
// + aria-label triggers — the cure wires the id/for while KEEPING the
// aria-label superset, which wins the accessible-name computation) ·
// D-191a4 THE CONTACT FILE INPUT'S EXPLICIT tabIndex (ours ships
// tabIndex={-1}; the reference carries none — the D-187a1 retirement's
// next member; both inert — className="hidden"). The event dialog's
// id-less reference inputs + bare labels decode as the KEPT s172
// SUPERSET (our labels wire htmlFor/id — the reference's bare labels are
// its own defect, never mirrored). The cancel-then-reopen state delta
// (ours clears via the S71-P1 epoch remount; the reference keeps the
// draft) decodes as the PINNED house superset (the fresh-per-open
// contract — dialog-mount-contract.test.ts). Every remaining delta a
// documented genus (the box-shadow slot-count with every VISIBLE layer
// byte-equal · the outline VERSION FORM + both sub-forms + the
// color-carrier sub-form · the M-81c2 token pairs — border-line/
// bg-surface vs border/bg-background, computed-equal · the md:text-sm
// composition genus — the COMPUTED font 14px/500 byte-equal both apps ·
// the aria-label supersets · our aria-hidden svg + Radix placeholder-
// <option> supersets · the reference's own Radix-version artifacts — the
// stale aria-controls at rest + the dangling aria-describedby genus ·
// the React useId format).
// ---------------------------------------------------------------------------

describe("session-191: the three create dialogs' focus/open interior walk (walk64 — the id-parity family cured [D-191a1/a2 the literal id/for maps + D-191a3 the selects' id/for wiring + D-191a4 the tabIndex retirement]; every other delta a documented genus or kept superset, both apps byte-equal on every resting + REAL-keyboard face at both axes)", () => {
  it("the walk64 decode freeze — the three-arm OPEN ledger at both axes + the REAL Tab drives + the select rides + the conditional-Name appearance + the cancel-then-reopen decode (the tool's own contract)", () => {
    const src = read("scripts/walk64-createdialogs-focus-open.ts");
    // the two-app pair form (the s162 login consolidation)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // the three arms (the walk61 multi-arm form)
    expect(src).toContain('{ key: "contact", path: "/contacts", trigger: "New Contact", submitText: "Create Contact" }');
    expect(src).toContain('{ key: "account", path: "/accounts", trigger: "New Account", submitText: "Create Account" }');
    expect(src).toContain('{ key: "event", path: "/calendar", trigger: "New Event", submitText: "Create Event" }');
    // Phase A per dialog the OPEN census — the trigger's resting face,
    // the click-open ride, the root geometry + DFS ledger, the title,
    // the FULL inputs census (the id map), the labels census (the
    // wiring map), the comboboxes, the file input, the footer pair, the
    // mount focus, the Escape round-trip — at BOTH axes
    expect(src).toContain("dialogPhase");
    expect(src).toContain("idMapDiff");
    expect(src).toContain("labelMapDiff");
    expect(src).toContain("mountFocus");
    expect(src).toContain('{ w: 390, h: 844 }');
    // Phase B the REAL keyboard Tab drive through each OPEN dialog
    // (the walk54/58/63 focus form) + the REAL :focus-visible faces at
    // the first input + a combobox + the Create submit
    expect(src).toContain("tabPhase");
    expect(src).toContain('await page.keyboard.press("Tab")');
    // Phase C the interactive arms — the select rides (the listbox OPEN
    // face + the option vocabulary + the REAL data-highlighted face
    // under ArrowDown) + the EVENT related-to pick ride (the M-76c13
    // conditional) + the cancel-then-reopen state decode — the submits
    // NEVER fired on either app
    expect(src).toContain("selectRidePhase");
    expect(src).toContain("conditionalRidePhase");
    expect(src).toContain("cancelReopenPhase");
    expect(src).toContain("submits NEVER fired on either app");
  });

  it("the CONTACT open-interior construction freeze — the avatar section + the two h3 headers + the pair groups + the file input + the footer pair (the genuine battery gap: the s19/s30 pins hold OUR wiring regexes, never the call-site chains; the walk proves the root byte-equal at 464,45 512x810 on both apps at both axes)", () => {
    const src = read("src/components/shared/entity-dialogs.tsx");
    // the body + the avatar section (the s15/s30 construction)
    expect(src).toContain('<div className={CONTACT_DIALOG.body}>');
    expect(src).toContain('<div className={CONTACT_AVATAR.section}>');
    // the hidden file input (the s30-P2 REAL round-trip; the accept
    // trio — the reference's explicit MIME list; D-191a4: NO tabIndex)
    expect(src).toContain('accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={uploadPhoto}');
    // the two h3 section headers (the L-92c2 nested sections)
    expect(src).toContain('<h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contact Details</h3>');
    expect(src).toContain('<h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Professional Details</h3>');
    // the meet-select (the s28-P1 raw values + emoji labels)
    expect(src).toContain("{CONTACT_SOURCE_OPTIONS.map((o) =>");
    // the footer pair: the outline Cancel + the BLACK-pair submit (the
    // s123 F-123a4 DIALOG_SUBMIT family)
    expect(src).toContain('<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>');
    expect(src).toContain('{pending ? "Creating..." : "Create Contact"}');
  });

  it("the ACCOUNT open-interior construction freeze — the 8-field 2-col grid + the Status select + the footer pair (the genuine gap: the s15/s5 pins hold the field ORDER + the payload contracts, never the call-site chains; the walk proves the root byte-equal at 384,214 672x472 on both apps at both axes)", () => {
    const src = read("src/components/shared/entity-dialogs.tsx");
    // the 2-column grid body (the S15-P10 pairs contract)
    expect(src).toContain('<div className={ACCOUNT_DIALOG.body}>');
    // the Status select rides the ACCOUNT_STATUSES vocabulary
    expect(src).toContain("{ACCOUNT_STATUSES.map((s) =>");
    // the footer pair + the pending label
    expect(src).toContain('{pending ? "Creating..." : "Create Account"}');
    expect(src).toContain("className={DIALOG_SUBMIT.button}");
  });

  it("the EVENT open-interior construction freeze — the wide family + the bare-field form + the combobox trio + the conditional Name arm + the blue submit (the genuine gap: the s15/s76 pins hold the constants + the bundle decode, never the call-site chains; the walk proves the root byte-equal at 384,133 672x634 + the M-76c13 conditional live on both apps)", () => {
    const src = read("src/components/shared/entity-dialogs.tsx");
    // the wide shell + the form rhythm + the two grid pairs
    expect(src).toContain('<DialogContent className={DIALOG_CONTENT.wide}>');
    expect(src).toContain('className={EVENT_DIALOG.form}');
    expect(src).toContain('className={EVENT_DIALOG.pair}');
    expect(src).toContain('className={EVENT_DIALOG.relatedToAlone}');
    // the rows=3 textarea (the M-92c3 live decode)
    expect(src).toContain('<Textarea id="ev-desc" rows={3}');
    // the combobox trio (the aria-label superset family — the
    // reference's own triggers are aria-less)
    expect(src).toContain('<SelectTrigger aria-label="Event Type" className="w-full"><SelectValue /></SelectTrigger>');
    expect(src).toContain('<SelectTrigger aria-label="Status" className="w-full"><SelectValue /></SelectTrigger>');
    expect(src).toContain('<SelectTrigger aria-label="Related To" className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>');
    // the M-76c13 conditional Name field (the capitalized placeholder —
    // live-walked byte-equal "Enter Contact name" on both apps)
    expect(src).toContain('placeholder={`Enter ${form.relatedType.charAt(0).toUpperCase()}${form.relatedType.slice(1)} name`}');
    // the blue submit (the M-76c12 one-off, BOTH modes)
    expect(src).toContain("className={EVENT_DIALOG.submit}");
    expect(src).toContain('{pending ? "Saving..." : event ? "Update Event" : "Create Event"}');
  });

  it("D-191a5 the EVENT create-dialog's start-date pre-fill retired — the reference's fresh-open start input is EMPTY (live-walked: the VLM battery caught the value-blind census's gap, the micro-probe confirmed OURS '2026-10-27T04:00' vs REF ''); ours pre-filled NOW (toLocalInputValue(defaultStart ?? new Date())) — the D-114a2 construction-parity family's behavioral member; the day-cell dblclick flow keeps its own defaultStart (the s54 decode, untouched by the cure)", () => {
    const src = read("src/components/shared/entity-dialogs.tsx");
    // the post-cure form: the create mode pre-fills ONLY the passed
    // defaultStart (the day-cell flow), NEVER the NOW fallback — the
    // fresh-open start is EMPTY, matching the reference
    expect(src).toContain("startAt: event ? toLocalInputValue(event.startAt) : (defaultStart ? toLocalInputValue(defaultStart) : \"\"),");
    expect(src).not.toContain("toLocalInputValue(defaultStart ?? new Date())");
    // the submit gate still guards the empty start (the reference's
    // required-attribute face; our toast superset stays)
    expect(src).toContain('if (!form.startAt) {');
    expect(src).toContain('"Start date and time are required"');
    // the call site: the header "New Event" flow passes NO default
    // (the reference's own fresh-open face); only the day-cell flows
    // pass their OWN 09:00 default (the s54 decode)
    const cal = read("src/app/(app)/calendar/calendar-page.tsx")!;
    expect(cal).toContain("if (!day) {\n      setEditing(null);\n      setDefaultStart(null);\n      setDialogOpen(true);\n      return;\n    }");
    expect(cal).toContain("start.setHours(9, 0, 0, 0);");
    expect(cal).not.toContain("start.setHours(start.getHours() + 1, 0, 0, 0);");
  });

  it("D-191a1 the CONTACT dialog's LITERAL id/for map — the reference's inputs carry the bare literal ids (id=\"name\"/\"email\"/\"phone\"/\"company\"/\"position\", for= the same — live-walked byte-equal on the reference's DOM); ours shipped ct-* prefixed ids (the D-114a2/D-187a1/D-190a1 ids-are-construction-parity doctrine; the cure: the literal ids restored at every call site)", () => {
    const src = read("src/components/shared/entity-dialogs.tsx");
    // the five literal pairs (the reference's own construction)
    expect(src).toContain('<Label htmlFor="name">Name *</Label>');
    expect(src).toContain('<Label htmlFor="email">Email *</Label>');
    expect(src).toContain('<Label htmlFor="phone">Phone</Label>');
    expect(src).toContain('<Label htmlFor="company">Company</Label>');
    expect(src).toContain('<Label htmlFor="position">Position</Label>');
    // the ids themselves (the htmlFor targets)
    expect(src).toMatch(/id="name"\s*\n/);
    expect(src).toContain('id="email"');
    expect(src).toContain('id="phone"');
    expect(src).toContain('id="company"');
    expect(src).toContain('id="position"');
    // the ct-* era is GONE (no prefixed ids remain)
    expect(src).not.toContain('id="ct-');
    expect(src).not.toContain('htmlFor="ct-');
  });

  it("D-191a2 the ACCOUNT dialog's LITERAL id/for map — the reference's inputs carry the bare literal ids (id=\"name\"/\"industry\"/\"email\"/\"phone\"/\"website\"/\"revenue\"/\"employees\", for= the same); ours shipped acc-* prefixed ids (the same doctrine; the cure: the literal ids restored)", () => {
    const src = read("src/components/shared/entity-dialogs.tsx");
    // the seven literal pairs
    expect(src).toContain('<Label htmlFor="name">Account Name *</Label>');
    expect(src).toContain('<Label htmlFor="industry">Industry</Label>');
    expect(src).toContain('<Label htmlFor="email">Email</Label>');
    expect(src).toContain('<Label htmlFor="phone">Phone</Label>');
    expect(src).toContain('<Label htmlFor="website">Website</Label>');
    expect(src).toContain('<Label htmlFor="revenue">Annual Revenue</Label>');
    expect(src).toContain('<Label htmlFor="employees">Employees</Label>');
    // the ids themselves
    expect(src).toContain('id="industry"');
    expect(src).toContain('id="website"');
    expect(src).toContain('id="revenue"');
    expect(src).toContain('id="employees"');
    // the acc-* era is GONE
    expect(src).not.toContain('id="acc-');
    expect(src).not.toContain('htmlFor="acc-');
  });

  it("D-191a3 the create-dialog SELECTS' id + label-for wiring — the reference's meet-select carries button id=\"source\" + label for=\"source\" and its account Status button id=\"status\" + label for=\"status\" (live-walked); ours shipped bare labels + aria-label triggers (the cure: the id/for wiring restored while KEEPING the aria-label superset — aria-label wins the accessible-name computation, so the a11y pin's name contract is unchanged)", () => {
    const src = read("src/components/shared/entity-dialogs.tsx");
    // the contact meet-select: the wired label + the id on the trigger
    expect(src).toContain('<Label htmlFor="source">How did you meet?</Label>');
    expect(src).toContain('<SelectTrigger id="source" aria-label="How did you meet?"');
    // the account Status select: the wired label + the id
    expect(src).toContain('<Label htmlFor="status">Status</Label>');
    expect(src).toContain('<SelectTrigger id="status" aria-label="Status"');
  });

  it("D-191a4 the CONTACT file input's explicit tabIndex retirement — the reference's hidden input carries NO tabIndex attribute (live-walked: tabIndex=\"(none)\"); ours shipped tabIndex={-1} (the D-187a1 doctrine's next member — both inert, className=\"hidden\" removes the input from the layout AND the tab chain; the cure: the explicit attribute retired)", () => {
    const src = read("src/components/shared/entity-dialogs.tsx");
    // the post-cure construction: accept trio + hidden + onChange, NO
    // explicit tabIndex anywhere on a file input
    expect(src).toContain('accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={uploadPhoto}');
    expect(src).not.toContain("tabIndex={-1}");
    // the collateral pin: the s19 ct-phone source pin rides the cured
    // literal id (the D-191a1 rename)
    const pwa = read("tests/pwa-metadata.test.ts")!;
    expect(pwa).toMatch(/id="phone"[\s\S]{0,120}type="tel"/);
  });
});

// ---------------------------------------------------------------------------
// Session-192 (walk65): THE LOGIN ANON-SURFACE INTERIORS + THE LANDING
// MARKETING ARMS — the two-app element-level ledger of the two surfaces
// the s404 close adjudicated as the round material (the discovery
// probe scripts/discover-192.ts): the login view ladder (signin →
// signup → reset → sent — the client-state arms only) + the FAQ
// single-open accordion + the mobile disclosure menu, both apps at
// 1440×900 + 390×844 on FRESH contexts (the anon battery).
// ---------------------------------------------------------------------------

describe("session-192: the login anon-surface + landing marketing-arms walk (walk65 — the id-parity family + the REAL focus ring cured [D-192a1 the signup confirm literal id + D-192a2 the reset email literal id + D-192a3 the dark submits' REAL focus-visible ring]; every other delta a documented genus or kept superset, both apps byte-equal on every resting + REAL-keyboard face at both axes)", () => {
  it("the walk65 decode freeze — the four-view OPEN ledgers + the REAL Tab chain + the draft decode + the FAQ/menu arms + the CTA faces at both axes (the tool's own contract; the anon battery — FRESH contexts, NO storageState on either app)", () => {
    const src = read("scripts/walk65-login-landing-arms.ts");
    // the anon battery form (the s162 login consolidation RETIRED for
    // this battery — the login/landing legs ride FRESH contexts)
    expect(src).toContain("FRESH contexts on BOTH apps (no login, no storageState)");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    expect(src).not.toContain("preflightPairState");
    // the four login views (the walk61 multi-arm form)
    expect(src).toContain('const VIEWS = ["signin", "signup", "reset", "sent"] as const;');
    // Phase A per view the OPEN census — the card root geometry + DFS
    // ledger + heading + the FULL inputs census (the id map) + the
    // labels wiring map + the google button + the submit face + the
    // back/footer links + the mount focus — at BOTH axes
    expect(src).toContain("viewPhase");
    expect(src).toContain("idMapDiff");
    expect(src).toContain("labelMapDiff");
    expect(src).toContain('{ w: 1440, h: 900 }, { w: 390, h: 844 }');
    // the sent-ride write-free contract: the nonexistent-email POST
    // (the no-enumeration 200 family — the reference's own
    // forgot-password is client-side theater, never a network call)
    expect(src).toContain('await emailInput.fill("walk192probe@example.com")');
    expect(src).toContain("the signin/signup submits NEVER fired");
    // Phase B the REAL keyboard Tab drive through the signin card + the
    // REAL :focus-visible faces at the email input + the google button +
    // the submit (the programmatic face never the true face)
    expect(src).toContain("tabPhase");
    expect(src).toContain('await page.keyboard.press("Tab")');
    // Phase C the view-flip draft decode (the client-state contract)
    expect(src).toContain("draftPhase");
    // Phase E/F the landing arms — the FAQ single-open ride + the mobile
    // disclosure menu ride + Phase G the CTA faces
    expect(src).toContain("faqPhase");
    expect(src).toContain("menuPhase");
    expect(src).toContain("ctaPhase");
  });

  it("the LOGIN open-interior construction freeze — the signin card chain + the signup 3-field chain + the reset email chain + the sent callout chain (the genuine battery gap: the s11/s21/s79/s111 pins hold OUR wiring regexes + the computed-style contracts, never the call-site chains at the walk65 level; the walk proves the card root byte-equal at 496,95 448x710 / 16,73 358x650 on both apps at both axes)", () => {
    const src = read("src/components/layout/login-card.tsx");
    // the signin view: the h1/subtitle pair + the google button + the
    // footer link pair (the in-place view machine)
    expect(src).toContain('<h1 className={LOGIN_LAYOUT.title}>Welcome to NEO CRM</h1>');
    expect(src).toContain('<p className={LOGIN_LAYOUT.subtitle}>Sign in to continue</p>');
    expect(src).toContain("Continue with Google");
    expect(src).toContain('onClick={() => goto("forgot")}');
    expect(src).toContain('onClick={() => goto("signup")}');
    // the view machine replaces the login column entirely (the S21-P4
    // in-place contract — no logo, no google, no divider)
    expect(src).toContain('{view !== "signin" ? (');
    // the signup view: the back + the h2 + the 3-field vocabulary
    expect(src).toContain("<h2 className={LOGIN_SIGNUP_LAYOUT.title}>Create your account</h2>");
    expect(src).toContain('placeholder="Re-enter password"');
    expect(src).toContain('{pending ? "Please wait…" : "Create account"}');
    // the reset view: the back + the h2 + the description + the form
    expect(src).toContain("<h2 className={LOGIN_RESET_LAYOUT.title}>Reset your password</h2>");
    expect(src).toContain("Enter your email and we'll send you a link to reset your password");
    expect(src).toContain("onSubmit={onSendResetLink}");
    // the sent view: the icon tile + the h2 + the email line + the
    // callout + the back (the s163 resetUrl rides ONLY when present)
    expect(src).toContain("<h2 className={LOGIN_RESET_LAYOUT.title}>Check your email</h2>");
    expect(src).toContain("We've sent password reset instructions to");
    expect(src).toContain("{resetUrl && (");
    expect(src).toContain('onClick={() => goto("back")}');
  });

  it("the LANDING marketing-arms construction freeze — the FAQ single-open accordion chain + the mobile disclosure menu chain (the genuine battery gap: the s142 pins hold the component-level regexes, never the call-site chains; the walk proves the FAQ section byte-equal at 1440x677 with Q1 open by default + the menu panel byte-equal at 0,64 390x229 with the 6-link vocabulary on both apps)", () => {
    const src = read("src/components/landing/landing-page.tsx");
    // the FAQ single-open machine: Q1 (index 0) open by default, the
    // click flips open→-1 (close) or→index (single-open)
    expect(src).toContain("const [openIndex, setOpenIndex] = React.useState(0);");
    expect(src).toContain("onClick={() => setOpenIndex(open ? -1 : index)}");
    // the a11y superset (the reference's toggles carry NO aria — the
    // standing s142 DEVIATION pin, KEPT)
    expect(src).toContain("aria-expanded={open}");
    expect(src).toContain('aria-controls={`faq-answer-${index}`}');
    // the answer mounts/unmounts with the open item (the walk65
    // visibleAnswers=1 evidence: exactly ONE answer on any ride)
    expect(src).toContain("{open && (");
    expect(src).toContain('id={`faq-answer-${index}`}');
    // the chevron gains rotate-180 on the open item
    expect(src).toContain('open && "rotate-180"');
    // the mobile disclosure menu: the mount/unmount in-flow panel +
    // the menu↔x icon swap + the in-panel close
    expect(src).toContain("const [menuOpen, setMenuOpen] = React.useState(false);");
    expect(src).toContain("{menuOpen && (");
    expect(src).toContain("{menuOpen ? <X className=\"w-6 h-6\" /> : <Menu className=\"w-6 h-6\" />}");
    expect(src).toContain('onClick={() => setMenuOpen((v) => !v)}');
    expect(src).toContain("onClick={() => setMenuOpen(false)}");
    expect(src).toContain('className="md:hidden text-gray-700 p-1"');
  });

  it("D-192a1 the SIGNUP view's confirm input LITERAL id — the reference's confirm carries id=\"confirmPassword\" + for=\"confirmPassword\" (live-walked byte-equal on the reference's DOM: the walk65 signup id-map decode); ours shipped the kebab-case id=\"confirm-password\" (the D-114a2/D-187a1/D-190a1/D-191a1/a2 ids-are-construction-parity doctrine; the cure: the literal id restored at the call site — matching the reset-password page's own confirmPassword family)", () => {
    const src = read("src/components/layout/login-card.tsx");
    // the post-cure pair (the reference's own construction)
    expect(src).toContain('<label htmlFor="confirmPassword" className={LOGIN_SIGNUP_LAYOUT.label}>');
    expect(src).toContain('id="confirmPassword"');
    // the kebab-case era is GONE
    expect(src).not.toContain('id="confirm-password"');
    expect(src).not.toContain('htmlFor="confirm-password"');
  });

  it("D-192a2 the RESET view's email input LITERAL id — the reference's reset view carries the bare literal id=\"email\" + for=\"email\" (live-walked byte-equal on the reference's DOM: the walk65 reset id-map decode); ours shipped id=\"reset-email\" (the same doctrine; the cure: the bare literal restored — the views never render simultaneously, so no id collision with the signin view's own id=\"email\")", () => {
    const src = read("src/components/layout/login-card.tsx");
    // the post-cure pair (the reset branch's own chain — the
    // LOGIN_LAYOUT.label carrier distinguishes it from the signup
    // branch's LOGIN_SIGNUP_LAYOUT.label email label)
    expect(src).toContain('<label htmlFor="email" className={LOGIN_LAYOUT.label}>');
    expect(src).toContain('className={LOGIN_RESET_LAYOUT.resetInput}');
    // the reset-email era is GONE
    expect(src).not.toContain('id="reset-email"');
    expect(src).not.toContain('htmlFor="reset-email"');
  });

  it("D-192a3 the auth-card dark submits' REAL focus-visible ring — the reference's stock dark submits focus to the near-black --ring token (rgb(9,9,11) over the white 2px offset — live-walked on the signin/signup/reset submits' REAL keyboard faces: the walk65 Phase B + the micro-probe-192 family check); ours shipped ring-slate-400 (the s10-era authoring assumption, never live-probed on the submit — the INPUTS' slate-400 rings are byte-equal and STAY; the cure: focus-visible:ring-ring at all four submit sites)", () => {
    const pl = read("src/lib/page-layout.ts")!;
    const lr = read("src/lib/login-reset.ts")!;
    // the signin submit (LOGIN_LAYOUT.submit)
    expect(pl).toContain("focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2");
    expect(pl).not.toContain("focus-visible:ring-slate-400");
    // the three one-size-down submits (the reset send + the signup
    // submit + the verify submit)
    const submitLines = lr.split("\n").filter((l) => l.includes("bg-slate-900") && l.includes("focus-visible:ring"));
    expect(submitLines.length).toBeGreaterThanOrEqual(3);
    for (const line of submitLines) {
      expect(line).toContain("focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2");
      expect(line).not.toContain("focus-visible:ring-slate-400");
    }
    // the INPUTS keep their byte-equal slate-400 rings (the walk65
    // evidence: the email input's REAL ring white-2px + slate-400-4px
    // byte-equal on both apps)
    expect(lr).toContain("focus:ring-2 focus:ring-slate-400 focus:ring-offset-2");
  });
});

// Session-193 (walk66): THE MARKETING-INTERIOR ARMS — the /About +
// /Contact AUTHENTICATED INTERIORS' interactive arms, the s406 close's
// own naming, walked two-app at the OPEN-LEDGER level (the family 48
// sessions stale: the pages censused at s142, the guest funnel at
// s144, the 156-c interior-census legs hold the mainH geometry, the
// sweep holds the pixels — never the DFS ledger, the anchor inventory,
// the REAL Tab chain, the REAL focus faces, or the link rides).
// [D-193a1 the base layer's universal outline-color rule CURED — the
// alpha-color carrier family's PAINTING member: the walk53/61/66
// resting faces decoded OURS currentColor/adaptive near-black vs the
// reference's fixed rgba(10,10,10,0.5) with style:none (zero pixels —
// the documented genus); the walk66 FOCUS faces found the same carrier
// PAINTING (1px auto) on the marketing anchors — near-black OPAQUE vs
// the reference's authored 50% ring — and the micro-probe-193 CSSOM
// walk root-caused it: the reference's compiled base carries
// `* { border-color: hsl(var(--border)); outline-color: hsl(var(--ring) / .5); }`
// (the shadcn base template's universal line); OURS carried only the
// border-color half. THE CURE: the outline-color half added at the
// same * rule (the v4 color-mix idiom over our --color-ring #0a0a0a —
// the same resolved 50% near-black the reference authors)].
// [D-193a2 the sidebar links' REAL focus-visible ring — the KEPT
// SUPERSET, PINNED: OURS paints focus-visible:ring-2 ring-white/50
// (the s7 "deliberate a11y superset", re-verified invisible at the
// s177 walk50 resting face — never before walk-proven at the REAL
// keyboard face, and carrying ZERO test teeth); the reference ships
// NO authored focus face on its sidebar links — the bare UA outline,
// its own keyboard-focus-gap family (the D-112a2 doctrine), never
// mirrored]. Every other walk66 delta a documented genus or kept
// superset: the token-selection bg-background/bg-gray-50 pair
// (computed-equal #f9fafb — the M-81c2 family) · the box-shadow
// SLOT-COUNT (every VISIBLE layer byte-equal) · the outline VERSION
// FORM + both sub-forms (1px none vs 2px solid transparent — zero
// visible pixels on both) · OUR aria-hidden svg superset (the s19
// family, KEPT) · OUR aria-label superset on the topbar arms (the
// s88-c9 family, KEPT) · the reference's platform badge-close 16th
// Tab stop (the s149 genus, never mirrored).
describe("session-193: the marketing-interior arms walk (walk66 — the /About + /Contact authenticated interiors' interactive arms [D-193a1 the universal outline-color base rule cured; D-193a2 the sidebar ring the KEPT SUPERSET, pinned]; the Tab chains structurally identical at 15 stops both, the link rides + the phone axes byte-equal)", () => {
  it("the walk66 decode freeze — the two-page OPEN ledgers + the REAL Tab chains with the geometry-keyed focus captures + the write-free link rides + the phone axes (the tool's own contract; the AUTHENTICATED battery — the sweep-state pair, the pages render only inside the login-walled chrome)", () => {
    const src = read("scripts/walk66-marketing-interior-arms.ts");
    // the authenticated battery form (the s162 pair-state doctrine)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A per page the OPEN census — the main root + the DFS ledger +
    // the h1 face + the h2 vocabulary + the FULL anchor inventory + the
    // footer pair + the nav census
    expect(src).toContain("pageCensus");
    expect(src).toContain("LEDGER_JS");
    expect(src).toContain("ANCHORS_JS");
    // Phase B the REAL keyboard Tab drive — the chain's stop inventory +
    // the REAL :focus-visible faces at the six decoded stops; the stub/
    // trigger captures keyed by GEOMETRY (the REF carries no aria-labels
    // — its labels are the visible text, so text-matching would miss)
    expect(src).toContain("tabDrive");
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain("stop.x >= 1070");
    expect(src).toContain("stop.x >= 1180");
    // Phase C the link rides (write-free client nav) + Phase D the phone axis
    expect(src).toContain("ridePhase");
    expect(src).toContain("phoneCensus");
    expect(src).toContain("{ width: 1440, height: 900 }");
    expect(src).toContain("{ width: 390, height: 844 }");
    // the destructive-arm discipline: the EXTERNAL navigations NEVER
    // fired (the mailto/social rides stay census-only)
    expect(src).toContain("the EXTERNAL navigations are NEVER fired");
    // the decode machinery: the anchor + focus-face deltas
    expect(src).toContain("anchorsDelta");
    expect(src).toContain("focusDelta");
  });

  it("the MARKETING open-interior construction freeze — the about page's h1 + the Get-in-touch anchor chain + the contact page's h1 + the mailto + the three social anchors (the genuine battery gap: the s142 landing-page pins hold the LANDING page's strings, never the about/contact call-site chains; the walk proves every anchor href/target/rel byte-equal on both apps, the rides byte-equal, the phone axes byte-equal)", () => {
    const about = read("src/app/(marketing)/about/page.tsx");
    const contact = read("src/app/(marketing)/contact/page.tsx");
    // the about page chains
    expect(about).toContain('<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">About NEO CRM</h1>');
    expect(about).toContain('className="text-blue-600 font-medium hover:underline" href="/Contact"');
    expect(about).toContain("Get in touch with us →");
    // the contact page chains — the mailto + the three social anchors
    // (the walk66 Phase E census: href/target/rel byte-equal both apps)
    expect(contact).toContain('<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>');
    expect(contact).toContain('href="mailto:hello@example.com"');
    expect(contact).toContain('href="https://www.linkedin.com"');
    expect(contact).toContain('href="https://x.com"');
    expect(contact).toContain('href="https://github.com"');
    expect(contact).toContain('target="_blank"');
    expect(contact).toContain('rel="noopener noreferrer"');
  });

  it("D-193a2 the SIDEBAR links' focus-visible ring — the KEPT SUPERSET, pinned (OURS paints focus-visible:ring-2 ring-white/50 at every sidebar stop, walk-proven at the REAL keyboard face: the oklab white/50 2px shadow carrier vs the reference's bare UA outline 1px auto rgba(10,10,10,0.5); the reference ships NO authored focus face on its sidebar links — its own keyboard-focus-gap family, the D-112a2 doctrine, never mirrored; the construction dates to session-7, re-verified invisible at the s177 walk50 RESTING face, and carried ZERO test teeth until this pin — both navs stay in lockstep)", () => {
    const sidebar = read("src/components/layout/sidebar.tsx");
    const mobileNav = read("src/components/layout/mobile-nav.tsx");
    // the desktop sidebar + the drawer's nav — the same construction
    expect(sidebar).toContain('"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"');
    expect(mobileNav).toContain('"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"');
  });
});

// Session-194 (walk67): THE 404 INTERIOR'S INTERACTIVE ARMS — the
// designed 404 view the s408 close named ("the 404/error-boundary
// interiors' interactive arms, if any surface beyond the census gate's
// coverage"), walked two-app at the OPEN-LEDGER level for the first
// time (the s12 construction is 180+ sessions stale against the
// reference's CURRENT build — the SKILL's own standing rule: "treat
// any s-pin older than the current audit as provisional until
// re-verified"). The error-boundary pair (error.tsx + global-error.tsx)
// is OUR-ONLY (the s170 scandihaven ports, source-pinned — the
// reference cannot be crash-walked); the 404 is LIVE on BOTH apps.
// [D-194a1 the QUOTED-PATHNAME FORM CURED — OURS interpolated
// usePathname() verbatim ('The page "/x" could not be found…', the
// LEADING SLASH inside the quotes); the reference interpolates its
// router path WITHOUT the leading slash ('The page "x" …' — the span
// 604,459 103x19 vs our 601,459 108x19 at the walk's maiden decode);
// THE CURE: pathname.replace(/^\//, "") at the interpolation].
// [D-194a2 the GO HOME TAG — the KEPT SUPERSET, PINNED: OURS renders
// <Link href="/"> (an anchor — role=link, the href affordances, the
// WCAG-correct link semantics for a navigation affordance); the
// reference renders a <button> with NO href (its SPA JS-router
// idiom). Every VISIBLE layer byte-equal (box 658,556 123x38 · color
// · bg · border · radius · font · padding); the rides byte-equal
// (both land at the landing "/"). The D-112a2 a11y-superset
// doctrine's next member — the reference's own gap never mirrored;
// the construction carried ZERO test teeth on the TAG identity until
// this round's freeze].
// [D-194a3 the GO HOME GLYPH CURED — the M-82c2 icon-identity
// family's first CROSS-LIBRARY member (the D-186a1 pen-cure
// precedent): OURS shipped lucide `house` (2 paths — the house + the
// door; stroke-width 2; the `lucide lucide-house` class prefix; the
// width/height attrs); the reference ships the heroicons home
// OUTLINE (exactly ONE path, NO stroke-width attr → computed weight
// 1, NO width/height attrs, the bare `w-4 h-4 mr-2` class) — its 404
// view's platform-template origin, the one non-lucide icon family in
// its tree. THE CURE: the reference's exact svg inlined at the Go
// Home site (the lucide Home import retired there; OUR aria-hidden
// kept — the s19 superset family)]. [D-194a4 the 404 TITLE CURED —
// OURS shipped the s12 absolute title 'This Page Does Not Exist |
// NEO CRM' (decoded from the reference's PRE-DRIFT build); the
// CURRENT reference ships bare 'NEO CRM' (live-verified at both
// contexts, 3s settles — and the title machinery is byte-equal on
// every real route: both ship bare 'NEO CRM' on /dashboard, 'Accounts
// | NEO CRM' on /accounts, 'About | NEO CRM' on /about; only the 404
// differed). THE CURE: the metadata export retired in not-found.tsx —
// the root layout's title.default 'NEO CRM' renders, byte-equal].
// [D-194a5 the ANON UNKNOWN-ROUTE POSTURE — the PLATFORM GENUS,
// PINNED: the reference's auth-first client-router guard redirects
// anon unknown-routes to /login?from_url=<absolute-url> (its
// designed 404 appears only PAST the guard — it never adjudicates
// routability for anon visitors, everything anon → the wall; its SPA
// also never ships a real HTTP 404 status — 200 everywhere); OURS
// renders the designed 404 AT the unknown URL with a true HTTP 404
// (routability adjudicated first — the route-group architecture:
// known guarded routes → the wall; unknown routes → the 404,
// session-independent). The reference's posture is its SPA platform
// artifact (the s149 family) — OURS keeps the correct web semantics,
// PINNED]. Every other walk67 delta a documented genus: the
// outline-color serialization (oklab vs rgba — the s126 noise genus,
// the D-193a1 cure's own family, zero visible pixels) · the
// box-shadow SLOT-COUNT (every VISIBLE layer byte-equal — white 2px
// + slate-500 4px) · the outline VERSION FORM (1px none vs 2px solid
// transparent — the walk51 decode, zero visible pixels both) · the
// reference's platform badge-close Tab stop (the s149 genus, never
// mirrored) · OUR aria-hidden superset (the s19 family, KEPT).
describe("session-194: the 404 interior's interactive arms (walk67 — the designed 404 view [D-194a1 the quoted-path form cured; D-194a2 the Go Home tag the KEPT SUPERSET, pinned; D-194a3 the glyph cured; D-194a4 the title cured; D-194a5 the anon posture the PLATFORM GENUS, pinned]; the Tab chains structurally identical, the Go Home ride + the phone axes byte-equal)", () => {
  it("D-194a1 the quoted-pathname form — the CURE PIN (RED-first: the reference interpolates its router path WITHOUT the leading slash; our usePathname() carries it — the strip at the interpolation is the parity form)", () => {
    const body = read("src/app/not-found-body.tsx");
    // the CONSTRUCTION form (the JSX interpolation chain — the windowed
    // form: the file's own docstring quotes the bare expression as decode
    // history, so the pin guards the `}&quot;` interpolation tail only
    // the construction carries)
    expect(body).toContain('{pathname.replace(/^\\//, "")}&quot;');
  });

  it("D-194a3 the Go Home glyph — the CURE PIN (RED-first: the reference's heroicons home outline inlined — exactly ONE path, NO stroke-width attr [computed weight 1], NO width/height attrs, the bare w-4 h-4 mr-2 class; the lucide House import retired at this one site — the M-82c2 icon-identity family's first cross-library member, the D-186a1 pen-cure precedent)", () => {
    const body = read("src/app/not-found-body.tsx");
    // the lucide import retired (the one non-lucide site in the reference's tree)
    expect(body).not.toContain('import { Home } from "lucide-react"');
    // the reference's exact glyph: the heroicons home outline path
    expect(body).toContain(
      'd="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"',
    );
    // the reference's exact attr set: NO width/height, NO stroke-width
    // (computed weight 1 — the visible weight delta the walk decoded)
    const svgMatch = body.match(/<svg[^>]*>/);
    expect(svgMatch).not.toBeNull();
    const svg = svgMatch![0];
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).toContain('fill="none"');
    expect(svg).toContain('stroke="currentColor"');
    expect(svg).not.toContain("stroke-width");
    expect(svg).not.toContain('width="');
    expect(svg).not.toContain('height="');
    // OUR aria-hidden kept (the s19 superset family — the reference's
    // svg carries none, its own a11y gap, never mirrored)
    expect(svg).toContain('aria-hidden="true"');
    // the class rides the constant (the reference's exact w-4 h-4 order)
    expect(read("src/lib/page-layout.ts")).toContain('homeIcon: "w-4 h-4 mr-2"');
  });

  it("D-194a4 the 404 title — the CURE PIN (RED-first: the s12 absolute title is a PRE-DRIFT decode — the current reference ships bare 'NEO CRM'; the metadata export retires and the root layout's title.default renders, byte-equal)", () => {
    const src = read("src/app/not-found.tsx");
    // the CONSTRUCTION negatives (the windowed form — the file's own
    // comment legitimately quotes the retired title as decode history,
    // so the pin guards the metadata export + the absolute-title form,
    // never the prose)
    expect(src).not.toContain("export const metadata");
    expect(src).not.toContain("title: { absolute:");
  });

  it("the walk67 decode freeze — the two-context OPEN ledgers + the REAL Tab chain with the Go Home focus capture + the write-free ride + the phone axis + the anon posture census (the tool's own contract; the AUTHENTICATED legs ride the sweep-state pair, the anon legs ride fresh contexts)", () => {
    const src = read("scripts/walk67-404-interior-arms.ts");
    // the authenticated battery form (the s162 pair-state doctrine)
    expect(src).toContain("preflightPairState");
    expect(src).toContain('const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app"');
    // Phase A the OPEN census — the DFS ledger from the min-h-screen page
    // root (the platform artifacts stay OUTSIDE, the s149 doctrine) + the
    // h1/h2/p/span faces + the Go Home arm inventory + the glyph decode +
    // the title + the http status
    expect(src).toContain("notFoundCensus");
    expect(src).toContain("LEDGER_JS");
    expect(src).toContain("computedStrokeWidth");
    expect(src).toContain("glyphDelta");
    // Phase B the REAL keyboard Tab drive + Phase C the write-free ride +
    // Phase D the phone axis
    expect(src).toContain("tabDrive");
    expect(src).toContain('await page.keyboard.press("Tab")');
    expect(src).toContain("ridePhase");
    expect(src).toContain("phoneCensus");
    expect(src).toContain("{ width: 1440, height: 900 }");
    expect(src).toContain("{ width: 390, height: 844 }");
    // Phase E the anon posture census (fresh contexts — the D-194a5 genus
    // decode: OURS the 404 at the unknown URL vs the REF the redirect to
    // /login?from_url — censused, never fixed)
    expect(src).toContain("anonLeg");
    expect(src).toContain('"/Login"');
    // the destructive-arm discipline: no writes, no logout, no external nav
    expect(src).toContain("no writes, no logout, no external nav");
    // the diff machinery
    expect(src).toContain("rowsDelta");
    expect(src).toContain("focusDelta");
  });

  it("the 404 open-interior construction freeze — the not-found-body call-site chains (the genuine battery gap: the s12 pins hold the NOT_FOUND_LAYOUT constant strings, never the call-site construction; the walk proves the h1/h2/p/span boxes + the Go Home arm box byte-equal two-app, the ride + the phone axes byte-equal)", () => {
    const body = read("src/app/not-found-body.tsx");
    const wrapper = read("src/app/not-found.tsx");
    // the skeleton chains — the three-group center (the s12 VLM decode)
    expect(body).toContain('<h1 className={NOT_FOUND_LAYOUT.h1}>404</h1>');
    expect(body).toContain('<h2 className={NOT_FOUND_LAYOUT.h2}>Page Not Found</h2>');
    expect(body).toContain('<div className={NOT_FOUND_LAYOUT.divider} aria-hidden="true" />');
    // D-194a1: the stripped interpolation (the reference's router-path form)
    expect(body).toContain('&quot;{pathname.replace(/^\\//, "")}&quot;');
    // D-194a2: the ANCHOR construction — the KEPT SUPERSET (the reference
    // renders a JS-router <button> with no href; ours keeps the
    // WCAG-correct link semantics, the D-112a2 doctrine's next member).
    // The negative is scoped to the JSX return block — the file's own
    // docstring legitimately names the reference's <button> as decode
    // history (the D-193a1 windowed-slice lesson).
    expect(body).toContain('<Link href={NOT_FOUND_LAYOUT.homeHref} className={NOT_FOUND_LAYOUT.homeButton}>');
    const jsx = body.slice(body.indexOf("return ("));
    expect(jsx).not.toContain("<button");
    // D-194a3: the inline heroicons glyph rides the constant
    expect(body).toContain("<svg");
    expect(body).toContain("className={NOT_FOUND_LAYOUT.homeIcon}");
    // the client seam (the only way to read the unmatched pathname)
    expect(body).toContain("usePathname");
    // the wrapper renders the body — no metadata, no session check
    expect(wrapper).toContain('import { NotFoundBody } from "./not-found-body"');
    expect(wrapper).toContain("return <NotFoundBody />;");
  });

  it("D-194a5 the ANON unknown-route posture — the PLATFORM GENUS, pinned (the 404 is SESSION-INDEPENDENT by design: no session resolution, no redirect — the reference's auth-first client-router guard walls every anon URL at /login?from_url=<absolute-url>, its designed 404 appearing only PAST the guard, and its SPA never ships a real HTTP 404 status; OURS adjudicates routability first and renders the designed 404 with the true 404 status for anon and authenticated visitors alike — the s149 platform family, never mirrored)", () => {
    const wrapper = read("src/app/not-found.tsx");
    const body = read("src/app/not-found-body.tsx");
    // the session-independent construction: no session seam, no redirect
    expect(wrapper).not.toContain("getSessionUser");
    expect(wrapper).not.toContain("redirect(");
    expect(body).not.toContain("getSessionUser");
    expect(body).not.toContain("redirect(");
    // no auth import anywhere on the surface
    expect(wrapper).not.toContain('from "@/lib/auth"');
    expect(body).not.toContain('from "@/lib/auth"');
  });
});

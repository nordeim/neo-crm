import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-46 pins (S46-P5): the dead-code hygiene pair — the N-46d +
// N-46g audit notes. (1) accounts-page destructured the `leads` slice
// and never used it (exactly one occurrence in the file: the
// destructure itself). (2) activities-page's todayCount/yesterdayCount
// filters carried the dead `?? a.createdAt` tail —
// `a.createdAt ?? a.dueAt ?? a.createdAt` — the s42 dead-?? class: the
// trailing arm can only return the already-known-nullish createdAt
// (if createdAt were non-null the FIRST arm already returned), so the
// tail is unreachable-non-null by construction.
//
// Session-53 pins (S53-P3/P4, N-53c/N-53d): the orphaned-import
// retirement + the never-caching memo. (3) the 53-b fresh-eyes census
// found 8 imports whose only in-file reference is the import itself
// (calendar-page ×7 + leads-page ×1 — an s27 cleanup miss), and retiring
// the calendar's EVENT_STATUS_META import leaves that constant fully
// src-dead (the s48 CONTACT_SOURCES / s49 LEAD_SOURCES precedent).
// (4) the leads-page wonVsLost useMemo never cached — deps [won, lost]
// are fresh filtered identities every render — so it is retired to the
// plain-call sibling idiom (pipelineByStage computes plainly).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const accounts = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const activities = () => stripComments(read("src/app/(app)/activities/activities-page.tsx") ?? "");
const calendar = () => stripComments(read("src/app/(app)/calendar/calendar-page.tsx") ?? "");
const contacts = () => stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
const dashboard = () => stripComments(read("src/app/(app)/page.tsx") ?? "");
const profilePage = () => stripComments(read("src/app/(app)/profile/profile-page.tsx") ?? "");
const leads = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
const reports = () => stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
const reportsRoute = () => stripComments(read("src/app/api/reports/route.ts") ?? "");
const charts = () => stripComments(read("src/components/charts/charts.tsx") ?? "");
const pageParts = () => stripComments(read("src/components/shared/page-parts.tsx") ?? "");
const stockCard = () => stripComments(read("src/components/ui/card.tsx") ?? "");
const stockDialog = () => stripComments(read("src/components/ui/dialog.tsx") ?? "");
const stockDropdown = () => stripComments(read("src/components/ui/dropdown.tsx") ?? "");
const stockSelect = () => stripComments(read("src/components/ui/select.tsx") ?? "");
const constants = () => stripComments(read("src/lib/constants.ts") ?? "");
const format = () => stripComments(read("src/lib/format.ts") ?? "");
const uploadsLib = () => stripComments(read("src/lib/uploads.ts") ?? "");
const leadFilters = () => stripComments(read("src/lib/lead-filters.ts") ?? "");
const miscModule = () => read("src/components/ui/misc.tsx");

describe("session-46: the dead-code hygiene pair (S46-P5)", () => {
  it("accounts-page no longer destructures the unused leads slice", () => {
    // The whole (comment-stripped) file is leads-free — the slice was
    // dead weight in the selector. A future legit use must retire this
    // pin deliberately.
    expect(accounts()).not.toMatch(/\bleads\b/);
  });

  it("activities-page drops the dead ?? a.createdAt tail at BOTH count filters", () => {
    const src = activities();
    // The dead triple-chain is gone…
    expect(src).not.toMatch(/a\.createdAt\s*\?\?\s*a\.dueAt\s*\?\?\s*a\.createdAt/);
    // …and the live two-arm form appears exactly twice (todayCount +
    // yesterdayCount).
    const live = src.match(/a\.createdAt\s*\?\?\s*a\.dueAt/g) ?? [];
    expect(live.length).toBe(2);
  });
});

describe("session-53: the orphaned-import retirement + the never-caching memo (S53-P3/P4)", () => {
  it("calendar-page carries none of the seven orphaned imports (N-53c)", () => {
    const src = calendar();
    // Each of these had exactly one in-file reference — the import
    // itself (the s27 cleanup miss; the 53-b fresh-eyes census).
    expect(src).not.toMatch(/\bClock\b/);
    expect(src).not.toMatch(/\bBadge\b/);
    expect(src).not.toMatch(/\bEVENT_TYPE_META\b/);
    expect(src).not.toMatch(/\bEVENT_STATUS_META\b/);
    expect(src).not.toMatch(/\bformatTime\b/);
    expect(src).not.toMatch(/\btimeUntil\b/);
    expect(src).not.toMatch(/\bEMPTY_STATE\b/);
    // …while the LIVE chip map stays (the event chips render through it).
    expect(src).toMatch(/\bEVENT_TYPE_CHIP\b/);
  });

  it("leads-page no longer imports CHART_COLORS (the palette is shared, not reports-owned — corrected s56/N-56d)", () => {
    expect(leads()).not.toMatch(/\bCHART_COLORS\b/);
  });

  it("constants: the src-dead EVENT_STATUS_META is retired (the s48/s49 precedent)", () => {
    // Zero src consumers once the calendar import went; zero test pins
    // ever referenced it. A record comment may remain (comment-stripped
    // source is asserted).
    expect(constants()).not.toMatch(/\bEVENT_STATUS_META\b/);
  });

  it("the wonVsLost computation is a plain module-scope call — the never-caching useMemo retired (N-53d)", () => {
    const src = leads();
    // The memo form (deps [won, lost] — fresh identities every render,
    // so it never cached) is gone…
    expect(src).not.toMatch(/const wonVsLost = React\.useMemo/);
    // …replaced by the sibling idiom: a module-scope pure function
    // called plainly (pipelineByStage computes plainly too).
    expect(src).toMatch(/function buildWonVsLost\(won: Lead\[\], lost: Lead\[\]\)/);
    expect(src).toMatch(/const wonVsLost = buildWonVsLost\(won, lost\)/);
  });
});

describe("session-54: the calendar memo family + the dead-vocabulary retirement (S54-P1/P2/P4)", () => {
  it("the calendar visible/eventsOn wrappers are retired — plain forms (N-54a)", () => {
    const src = calendar();
    // The visible useMemo NEVER cached: deps [events, activeTypes,
    // activeDates, query] included the fresh .filter().map() identities
    // at activeTypes/activeDates — the N-53d class in calendar. The
    // eventsOn useCallback (deps [visible]) recreated every render too
    // and is called only during render. Both go plain (the s53-P4
    // buildWonVsLost idiom).
    expect(src).not.toMatch(/const visible = React\.useMemo/);
    expect(src).not.toMatch(/const eventsOn = React\.useCallback/);
    // …the extraction: a module-scope pure function called plainly.
    expect(src).toMatch(/function buildVisibleEvents\(/);
    expect(src).toMatch(
      /const visible = buildVisibleEvents\(events, activeTypes, activeDates, query\)/,
    );
  });

  it("constants: the seven FULLY-DEAD vocabulary exports are retired (N-54b)", () => {
    const src = constants();
    // Each had exactly one repo-wide reference — the definition itself
    // (zero src, zero test consumers; the 54-b fresh-eyes census). The
    // s48/s49/s53 retirement precedent; record comments may remain
    // (comment-stripped source is asserted).
    expect(src).not.toMatch(/\bOPEN_STAGES\b/);
    expect(src).not.toMatch(/\bisClosedOppStage\b/);
    expect(src).not.toMatch(/\bCONTACT_SOURCE_LABEL\b/);
    expect(src).not.toMatch(/\bLEAD_EDIT_STATUSES\b/);
    expect(src).not.toMatch(/\bLEAD_EDIT_SOURCES\b/);
    expect(src).not.toMatch(/\bTIER_META\b/);
    expect(src).not.toMatch(/\bPRIORITY_META\b/);
  });

  it("constants: the TEST-ONLY vocabulary family is retired too (N-54b)", () => {
    const src = constants();
    // Src-dead but pinned by stale tests: DROPPED_STAGES + isDroppedStage
    // (the s5 "dropped = lost + unqualified" reading the live KPI
    // contradicts), REPORTS_PIPELINE_SLUGS + FUNNEL_STAGES (the living
    // surfaces — pipelineStageCounts / LEADS_FUNNEL — carry the truth and
    // their own pins), ACCOUNT_EDIT_STATUSES (the stale wce decode — the
    // live select maps ACCOUNT_STATUSES).
    expect(src).not.toMatch(/\bDROPPED_STAGES\b/);
    expect(src).not.toMatch(/\bisDroppedStage\b/);
    expect(src).not.toMatch(/\bREPORTS_PIPELINE_SLUGS\b/);
    expect(src).not.toMatch(/\bFUNNEL_STAGES\b/);
    expect(src).not.toMatch(/\bACCOUNT_EDIT_STATUSES\b/);
  });

  it("the live Dropped truth: leads-page counts lost STRICTLY (the re-anchor)", () => {
    // S29-P5 is the live contract — "Dropped Deals" = lost strictly
    // (unqualified is NOT dropped). The retired isDroppedStage helper
    // misdocumented this; the pin now asserts the live filter directly.
    expect(leads()).toMatch(/const lost = filtered\.filter\(\(l\) => l\.stage === "lost"\)/);
  });

  it("the ghost-action families carry the dead-affordance annotations (N-54f)", () => {
    // RAW source (not comment-stripped): the annotations ARE comments.
    // The contacts Call/Email/WhatsApp trio + the calendar Phone/Message
    // pair are the reference's own inert affordances (bundle-verified
    // session-54: no onClick in the reference's constructions) — the
    // leads Convert-item annotation precedent.
    const contactsRaw = read("src/app/(app)/contacts/contacts-page.tsx") ?? "";
    const calendarRaw = read("src/app/(app)/calendar/calendar-page.tsx") ?? "";
    expect(contactsRaw).toMatch(/S54-P4: the reference's own inert affordances/);
    expect(calendarRaw).toMatch(/S54-P4: the reference's own inert affordances/);
  });
});

describe("session-55: the orphaned-import + test-only-seam retirement (S55-P1/P2/P3)", () => {
  it("reports-page carries none of the four orphaned imports (N-55a)", () => {
    const src = reports();
    // Each had exactly one in-file reference — the import itself (the
    // N-53c class in reports; the s53 sweep missed this file). The
    // exports stay alive on their real owners (page.tsx owns
    // KpiCard/RevenueLineChart, leads-page owns ConversionFunnel, the
    // palette is shared) — this is import narrowing, not retirement.
    expect(src).not.toMatch(/\bKpiCard\b/);
    expect(src).not.toMatch(/\bRevenueLineChart\b/);
    expect(src).not.toMatch(/\bConversionFunnel\b/);
    expect(src).not.toMatch(/\bCHART_COLORS\b/);
    // …while the live siblings from the same import lines stay.
    expect(src).toMatch(/\bCircleStatCard\b/);
    expect(src).toMatch(/\bPageHeader\b/);
    expect(src).toMatch(/\bSparkline\b/);
    expect(src).toMatch(/\bGroupedBarsChart\b/);
    expect(src).toMatch(/\bTrendLineChart\b/);
    expect(src).toMatch(/\bOPP_STAGE_META\b/);
  });

  it("format: the TEST-ONLY analytics pair is retired (N-55b)", () => {
    const src = format();
    // avgDaysBetween + percentDelta had zero non-test consumers (the
    // live derivations are the leads-page inline avgCycle + the
    // dashboard's hardcoded KPI_STATICS deltas). The s48/s49/s53/s54
    // retirement precedent; record comments may remain (comment-stripped
    // source is asserted).
    expect(src).not.toMatch(/\bavgDaysBetween\b/);
    expect(src).not.toMatch(/\bpercentDelta\b/);
    // …while the living formatters stay.
    expect(src).toMatch(/\bformatCurrency\b/);
    expect(src).toMatch(/\bformatCompactCurrency\b/);
    expect(src).toMatch(/\bcalendarGrid\b/);
    expect(src).toMatch(/\bcalendarFetchBounds\b/);
  });

  it("lead-filters: the TEST-ONLY encode/decode pair is retired (N-55c)", () => {
    const src = leadFilters();
    // encodeLeadFilters + decodeLeadFilters were src-dead since the s29
    // saved-views supersession (the page persists the VIEWS LIST; the
    // list decoding validates through the internal asFilters directly).
    // The behavioral pins re-anchored to the living pair in
    // tests/lead-filters.test.ts (the s54 ACCOUNT_EDIT_STATUSES
    // precedent).
    expect(src).not.toMatch(/\bencodeLeadFilters\b/);
    expect(src).not.toMatch(/\bdecodeLeadFilters\b/);
  });

  it("the living saved-views seam survives (the re-anchor's subject)", () => {
    const src = leadFilters();
    // The guards: the living pair + its validation core + the equality
    // helper all stay exported — the retirement must not over-reach.
    expect(src).toMatch(/export function encodeSavedLeadViews\(/);
    expect(src).toMatch(/export function decodeSavedLeadViews\(/);
    expect(src).toMatch(/export function leadFiltersEqual\(/);
    expect(src).toMatch(/function asFilters\(/);
  });

  it("the leads-page stale palette-ownership claim is corrected (N-55e)", () => {
    // RAW source: the claim is inside a comment. The s53 record comment
    // said “the reports page owns the palette” — the palette is shared
    // (page.tsx/activities/accounts), and after N-55a the reports page
    // does not import it at all.
    const leadsRaw = read("src/app/(app)/leads/leads-page.tsx") ?? "";
    expect(leadsRaw).not.toMatch(/the reports page owns the palette/);
  });
});

// Session-56 pins (S56-P1/P2/P3, the N-56 family): the orphaned-import
// sweep + the dead-module retirement. (1) the 56-b fresh-eyes census found
// TWELVE more lint-invisible orphaned imports across six files (the
// N-53c/N-55a class; eslint has BOTH no-unused-vars rules off, so only
// source-reading pins catch them). (2) page-parts' CardCaption was fully
// dead since the initial commit; ui/misc.tsx (an APP-AUTHORED grab-bag,
// never part of the vendored stock mirror) carried only the s25-stranded
// EmptyState. (3) format's addMonths became TEST-ONLY once the reports
// route's orphaned import narrowed away (the s55 N-55b class).
describe("session-56: the orphaned-import sweep + the dead-module retirement (S56-P1/P2/P3)", () => {
  it("contacts-page carries none of the six orphaned imports (N-56a)", () => {
    const src = contacts();
    // Each had exactly one in-file reference — the import itself. The
    // exports all stay alive on their real consumers (timeAgo is LIVE in
    // activities-page:385 [s58 refresh — the s57 comment growth
    // self-shifted the token one line, the chronic self-shift class];
    // ENGAGEMENT_LEVELS in the contacts API routes;
    // FILTER_RAIL/EMPTY_STATE in calendar + reports; Avatar in
    // accounts-page + the ui kit [s57 correction]; DropdownSeparator in
    // leads) — import narrowing only.
    expect(src).not.toMatch(/\bPencil\b/);
    expect(src).not.toMatch(/\bAvatar\b/);
    expect(src).not.toMatch(/\bDropdownSeparator\b/);
    expect(src).not.toMatch(/\bFILTER_RAIL\b/);
    expect(src).not.toMatch(/\bENGAGEMENT_LEVELS\b/);
    expect(src).not.toMatch(/\btimeAgo\b/);
    // …while the live siblings from the same import lines stay.
    expect(src).toMatch(/\bCONTACTS_LAYOUT\b/);
    expect(src).toMatch(/\bPAGE_KPI_GRIDS\b/);
    expect(src).toMatch(/\bTABLE_CARD\b/);
    expect(src).toMatch(/\bENGAGEMENT_BARS\b/);
    expect(src).toMatch(/\bMoreVertical\b/);
    expect(src).toMatch(/\bDropdownContent\b/);
  });

  it("accounts-page + activities-page carry none of their three orphans (N-56a)", () => {
    expect(accounts()).not.toMatch(/\bDropdownSeparator\b/);
    const acts = activities();
    expect(acts).not.toMatch(/\bCell\b/);
    expect(acts).not.toMatch(/\bAvatar\b/);
    // …while the live siblings from the same import lines stay.
    expect(accounts()).toMatch(/\bDropdownContent\b/);
    expect(accounts()).toMatch(/\bDropdownTrigger\b/);
    expect(acts).toMatch(/\bResponsiveContainer\b/);
    expect(acts).toMatch(/\btimeUntil\b/);
  });

  it("the dashboard + the reports route + charts.tsx carry none of their three orphans (N-56a)", () => {
    expect(dashboard()).not.toMatch(/\bEMPTY_STATE\b/);
    expect(reportsRoute()).not.toMatch(/\baddMonths\b/);
    expect(charts()).not.toMatch(/import \* as React/);
    // …while the live siblings from the same import lines stay.
    expect(dashboard()).toMatch(/\bPAGE_KPI_GRIDS\b/);
    expect(dashboard()).toMatch(/\bKPI_STATICS\b/);
    expect(reportsRoute()).toMatch(/\bstartOfWeek\b/);
    expect(reportsRoute()).toMatch(/\bstartOfQuarter\b/);
    expect(charts()).toMatch(/\bResponsiveContainer\b/);
  });

  it("page-parts no longer exports CardCaption (N-56b — fully dead since the initial commit)", () => {
    const src = pageParts();
    expect(src).not.toMatch(/\bCardCaption\b/);
    // …while the living page-parts exports stay (ten at s57 count;
    // the guard below pins the seven load-bearing ones — DeltaText/
    // DeltaBadgeText/Sparkline are also live on their own consumers).
    expect(src).toMatch(/export function PageHeader/);
    expect(src).toMatch(/export function KpiCard/);
    expect(src).toMatch(/export function IconStatCard/);
    expect(src).toMatch(/export function BarStatCard/);
    expect(src).toMatch(/export function TrendStatCard/);
    expect(src).toMatch(/export function CircleStatCard/);
    expect(src).toMatch(/export function TableEmptyRow/);
  });

  it("the misc.tsx module is retired — EmptyState's whole module (N-56c, s25-stranded)", () => {
    // The app-authored grab-bag module's sole export had zero src
    // consumers since s25 stranded it. The module is GONE (the
    // loading-layer suite re-anchors its own Skeleton pin to the same
    // fact).
    expect(miscModule()).toBeNull();
    // …and nothing in src/ references the module path anymore.
    const consumers = [contacts(), activities(), dashboard(), leads(), reports(), accounts(), calendar()]
      .every((s) => !s.includes("ui/misc"));
    expect(consumers).toBe(true);
  });

  it("format: addMonths is retired — the seam went test-only when the reports route narrowed (N-56f, the s55 N-55b class)", () => {
    const src = format();
    expect(src).not.toMatch(/\baddMonths\b/);
    // …while the live date-arithmetic siblings stay.
    expect(src).toMatch(/export function startOfWeek/);
    expect(src).toMatch(/export function startOfMonth/);
    expect(src).toMatch(/export function startOfQuarter/);
    expect(src).toMatch(/export function timeAgo/);
    expect(src).toMatch(/export function timeUntil/);
  });

  it("the living underlying surfaces stay exported (the narrowing is not a retirement)", () => {
    // timeAgo (activities :384), ENGAGEMENT_LEVELS (contacts API),
    // FILTER_RAIL/EMPTY_STATE (page-layout), the stock Avatar/Cell/
    // DropdownSeparator — all still exported by their owners.
    expect(format()).toMatch(/export function timeAgo/);
    expect(constants()).toMatch(/\bENGAGEMENT_LEVELS\b/);
    const pageLayout = stripComments(read("src/lib/page-layout.ts") ?? "");
    expect(pageLayout).toMatch(/\bFILTER_RAIL\b/);
    expect(pageLayout).toMatch(/\bEMPTY_STATE\b/);
    const avatar = stripComments(read("src/components/ui/avatar.tsx") ?? "");
    expect(avatar).toMatch(/export \{ Avatar,/);
    const dropdown = stripComments(read("src/components/ui/dropdown.tsx") ?? "");
    expect(dropdown).toMatch(/DropdownSeparator/);
  });

  it("the vendored ui stock-surface mirror stays whole (the N-56e operator KEEP)", () => {
    // The source-vocabulary retirement policy does NOT extend to the
    // vendored stock primitives (the s10 mirror of the reference's own
    // component library). Unused stock exports stay exported — the
    // mirror's completeness is part of the parity contract, and
    // tree-shaking keeps the bundle byte-identical.
    expect(stockCard()).toMatch(/CardDescription/);
    expect(stockCard()).toMatch(/CardFooter/);
    expect(stockDialog()).toMatch(/DialogClose/);
    expect(stockDialog()).toMatch(/DialogTrigger/);
    expect(stockDropdown()).toMatch(/DropdownLabel/);
    expect(stockSelect()).toMatch(/SelectGroup/);
    expect(stockSelect()).toMatch(/SelectLabel/);
    expect(stockSelect()).toMatch(/SelectSeparator/);
  });
});

describe("session-57: the dead-surface narrowing + the comment-accuracy carriers (S57-P1/P2)", () => {
  it("profile-page no longer passes the dead usersTotal prop (N-57c)", () => {
    // 57-b fresh-eyes: the page passed usersTotal={users.length} and
    // typed it, but ProfileForm never destructured it (dead since s10)
    // — and the `users` store destructure existed solely to feed it.
    // The prop, the type entry, and the destructure all retire.
    const src = profilePage();
    expect(src).not.toMatch(/usersTotal/);
    expect(src).not.toMatch(/\busers\.length\b/);
  });

  it("uploads.ts no longer EXPORTS UPLOADS_DIR_NAME (N-57b — the export keyword narrows)", () => {
    // The N-56a lint-invisible class, EXPORT variant: the constant is
    // alive (the internal repo-root resolution consumes it) but the
    // `export` keyword had zero external consumers repo-wide.
    expect(uploadsLib()).not.toMatch(/export const UPLOADS_DIR_NAME/);
  });

  it("the living surfaces stay (guard)", () => {
    // The constant itself stays for its internal consumer, and the
    // profile form keeps its LIVE wiring — the onSaved refresh through
    // fetchUsers + the keyed remount (the s28 edit-dialog idiom).
    expect(uploadsLib()).toMatch(/const UPLOADS_DIR_NAME = "uploads"/);
    const src = profilePage();
    expect(src).toMatch(/onSaved=\{fetchUsers\}/);
    expect(src).toMatch(/key=\{`\$\{user\.id\}-\$\{user\.name\}`\}/);
  });
});

describe("session-58: the dead-surface narrowing + the type-contract boundary (S58-P1/P2)", () => {
  it("crm-store no longer carries the dead apiCall alias export (N-58a)", () => {
    // 58-b fresh-eyes: `export { call as apiCall };` had exactly ONE
    // repo-wide reference — the export line itself. Zero consumers
    // anywhere (not even tests), dead since the initial commit. The
    // aliased `call` stays alive internally (every store action feeds
    // through it) — the N-57b EXPORT-variant class.
    const src = stripComments(read("src/stores/crm-store.ts") ?? "");
    expect(src).not.toMatch(/apiCall/);
  });

  it("types/index.ts no longer carries the dead SearchResult interface (N-58b)", () => {
    // Definition-only since birth: zero references repo-wide INCLUDING
    // its own file — and shape-inaccurate (it claimed full
    // Account[]/Contact[]/Lead[] entities while the live topbar
    // consumes its own slimmer inline row shape). The s54 fully-dead
    // class, TYPE variant. The SKILL §20 carrier followed the code.
    const src = stripComments(read("src/types/index.ts") ?? "");
    expect(src).not.toMatch(/SearchResult/);
  });

  it("constants.ts no longer carries the three definition-only derived types (N-58b)", () => {
    // `export type LeadStage/ActivityType/EventType = (typeof …)[number]`
    // — each had zero non-definition references repo-wide (the
    // `defaultLeadStage` settings FIELD is a different identifier).
    // The arrays and their _META maps stay; only the derived types
    // were dead vocabulary.
    const src = constants();
    expect(src).not.toMatch(/\bLeadStage\b/);
    expect(src).not.toMatch(/\bActivityType\b/);
    expect(src).not.toMatch(/\bEventType\b/);
  });

  it("the living surfaces + the module type-contract boundary stay (guard)", () => {
    // The store's `call` engine stays (module-scope, every action's
    // seam); the three arrays stay exported (their META maps + API
    // consumers are live); AND the N-58c boundary holds — the
    // internally-consumed export keywords are each module's declared
    // contract surface (the s58 operator KEEP, the N-56e mechanism
    // applied to app-owned modules): a representative set stays
    // exported so future sweeps don't re-litigate the boundary.
    const store = stripComments(read("src/stores/crm-store.ts") ?? "");
    expect(store).toMatch(/async function call/);
    const src = constants();
    expect(src).toMatch(/export const LEAD_STAGES/);
    expect(src).toMatch(/export const ACTIVITY_TYPES/);
    expect(src).toMatch(/export const EVENT_TYPES/);
    // The type-contract KEEP set (N-58c, guard-pinned):
    expect(stripComments(read("src/lib/api.ts") ?? "")).toMatch(/export (type|interface) ApiError/);
    expect(stripComments(read("src/lib/api.ts") ?? "")).toMatch(/export (type|interface) ApiResult/);
    expect(pageParts()).toMatch(/export function DeltaText/);
    expect(pageParts()).toMatch(/export function DeltaBadgeText/);
    expect(stripComments(read("src/lib/rate-limit.ts") ?? "")).toMatch(/export (type|interface) RateLimitResult/);
    expect(store).toMatch(/export interface CrmState/);
  });
});

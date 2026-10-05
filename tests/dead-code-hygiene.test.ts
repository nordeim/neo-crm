import { existsSync, readdirSync, readFileSync } from "node:fs";
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

  it("activities-page reads createdAt DIRECTLY at BOTH count filters (re-anchored s62)", () => {
    const src = activities();
    // Session-62 (N-62c): the s46 retirement removed only the trailing
    // `?? a.createdAt` tail; the surviving `?? a.dueAt` arm was
    // unreachable by the type contract (Activity.createdAt is a
    // non-nullable string — src/types/index.ts), so the whole ?? chain
    // retires: both filters read `new Date(a.createdAt)` directly. This
    // pin re-anchors the s46 two-arm expectation (the s54 re-anchor
    // precedent — a retired surface's pin follows the retirement).
    expect(src).not.toMatch(/a\.createdAt\s*\?\?/);
    expect(src).not.toMatch(/\?\?\s*a\.dueAt/);
    // The two count-filter sites, pinned by their exact forms (a bare
    // count of `new Date(a.createdAt)` would be fragile — the timeline
    // and meeting filters carry five more of them).
    expect(src).toMatch(/new Date\(a\.createdAt\) >= startOfDay\(today\)/);
    expect(src).toMatch(/const d = new Date\(a\.createdAt\);/);
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
    // activities-page:388, the timeline's {meta.label} · timeAgo(a.createdAt)
    // consumer [s64 refresh — the s57/s58 refreshes both self-shifted;
    // the durable anchor is the TOKEN, not the line];
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
    // timeAgo (the activities timeline consumer, :388), ENGAGEMENT_LEVELS
    // (contacts API), FILTER_RAIL/EMPTY_STATE (page-layout), the stock
    // Avatar/Cell/DropdownSeparator — all still exported by their owners.
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

describe("session-59: the dead-surface narrowing (S59-P2)", () => {
  it("types/index.ts no longer carries the dead SavedReport interface (N-59a)", () => {
    // 59-b fresh-eyes: the barrel's SavedReport (the DB wire shape:
    // id/name/tab/config/createdAt) had zero references repo-wide
    // INCLUDING its own file. The LIVE SavedReport is a different
    // localStorage shape in src/lib/saved-reports.ts (the s25 seam,
    // consumed by save-report-dialog + the reports page). The type
    // shadow of ledger-10's dead Prisma model (whose only db consumers
    // are the reset + seed-time wipes). The s54 fully-dead class, TYPE
    // variant. The SKILL §20 carrier followed the code.
    const src = stripComments(read("src/types/index.ts") ?? "");
    expect(src).not.toMatch(/SavedReport/);
  });

  it("entity-edit-dialog no longer carries the dead entityId prop (N-59b)", () => {
    // Destructured + typed + passed by all three call sites
    // (contacts/leads/accounts) since s28, but never read in the body —
    // the N-56a lint-invisible class, DESTRUCTURED variant (both
    // no-unused-vars rules off; an unused destructured binding is
    // exactly what they would have flagged). The three call-site
    // bindings retired with it; `editTarget` stays live through
    // `initial` at every site.
    const src = stripComments(read("src/components/shared/entity-edit-dialog.tsx") ?? "");
    expect(src).not.toMatch(/entityId/);
  });

  it("the living surfaces stay (guard)", () => {
    // The LIVE SavedReport type stays exported in saved-reports.ts (the
    // localStorage shape — the filters/columns nesting); the dialog
    // keeps its living prop contract (initial/fields/onSubmit); the
    // three pages keep their fields/initial bindings — the edit
    // dialogs' real contract surface.
    const saved = stripComments(read("src/lib/saved-reports.ts") ?? "");
    expect(saved).toMatch(/export interface SavedReport/);
    expect(saved).toMatch(/dateRange/);
    expect(saved).toMatch(/wonDate/);
    const dialog = stripComments(read("src/components/shared/entity-edit-dialog.tsx") ?? "");
    expect(dialog).toMatch(/initial,/);
    expect(dialog).toMatch(/onSubmit,/);
    expect(dialog).toMatch(/fields: EditFieldSpec\[\]\[\]/);
    expect(accounts()).toMatch(/fields=\{ACCOUNT_EDIT_FIELDS\}/);
    expect(leads()).toMatch(/fields=\{LEAD_EDIT_FIELDS\}/);
    expect(contacts()).toMatch(/fields=\{CONTACT_EDIT_FIELDS\}/);
  });
});

describe("session-60: the dead-surface narrowing (S60-P2)", () => {
  it("constants.ts no longer carries the six never-read CHART_COLORS keys (N-60a)", () => {
    // 60-b fresh-eyes (the map-key census rotation): six of the
    // palette's sixteen keys — blue/cyan/teal/amber/orange/green — had
    // zero key-reads AND zero computed access repo-wide (the live read
    // set: red/gray/violet/emerald + the -400 family — the raw-hex
    // literals in the contacts/reports pages are independent string
    // props, not key reads). The s54 fully-dead class, KEY variant —
    // the third face after the TYPE (s58) and INTERFACE (s59)
    // variants. The CSS --color-chart-1…6 token family is a different
    // surface and stays whole; `emerald` shares the retired `green`'s
    // #10b981 hex but is key-distinct (the pins anchor on key names).
    const src = stripComments(read("src/lib/constants.ts") ?? "");
    expect(src).not.toMatch(/blue: "#3b82f6"/);
    expect(src).not.toMatch(/cyan: "#06b6d4"/);
    expect(src).not.toMatch(/teal: "#14b8a6"/);
    expect(src).not.toMatch(/amber: "#f59e0b"/);
    expect(src).not.toMatch(/orange: "#f97316"/);
    expect(src).not.toMatch(/green: "#10b981"/);
  });

  it("crm.spec.ts no longer carries the dead formAvatar locator (N-60b)", () => {
    // The N-56a lint-invisible class's TEST-LOCAL variant — a locator
    // declared inside the profile-photo-upload test and never used
    // (the empty state is asserted through the `form img` count 0
    // instead). Both no-unused-vars rules are off; the unit-side
    // hygiene suite reads src/ only — found only by rotating the
    // fresh-eyes sweep INTO the test tree. The class's fourth home:
    // IMPORT (s56) / PROP-TYPE (s57c) / DESTRUCTURED (s59) /
    // TEST-LOCAL (s60).
    const src = stripComments(read("tests/e2e/crm.spec.ts") ?? "");
    expect(src).not.toMatch(/\bformAvatar\b/);
  });

  it("the living palette stays (guard)", () => {
    // The ten live keys + their live consumers — the palette's real
    // contract surface: the dashboard KPI sparklines (emerald/violet/
    // red + the cyan400/green400 default-variant bars), the accounts
    // and activities stat-card mini bars (the -400 family + gray).
    const src = stripComments(read("src/lib/constants.ts") ?? "");
    expect(src).toMatch(/red: "#ef4444"/);
    expect(src).toMatch(/gray: "#9ca3af"/);
    expect(src).toMatch(/violet: "#8b5cf6"/);
    expect(src).toMatch(/emerald: "#10b981"/);
    expect(src).toMatch(/blue400: "#60a5fa"/);
    expect(src).toMatch(/green400: "#4ade80"/);
    expect(src).toMatch(/cyan400: "#22d3ee"/);
    expect(src).toMatch(/purple400: "#c084fc"/);
    expect(src).toMatch(/red400: "#f87171"/);
    expect(src).toMatch(/amber400: "#fbbf24"/);
    expect(dashboard()).toMatch(/CHART_COLORS\.emerald/);
    expect(dashboard()).toMatch(/CHART_COLORS\.violet/);
    expect(dashboard()).toMatch(/CHART_COLORS\.red\b/);
    expect(accounts()).toMatch(/CHART_COLORS\.blue400/);
    expect(activities()).toMatch(/CHART_COLORS\.gray\b/);
  });
});

describe("session-61: the dead-surface narrowing (S61-P1)", () => {
  it("public/ no longer carries the duplicate dashboard png (N-61a)", () => {
    // 61-b fresh-eyes (the public-asset rotation): the file was a
    // byte-identical duplicate of docs/neo-crm-dashboard.png (both md5
    // a7b963b0…) with ZERO tracked references (the prompt docs point at
    // the GitHub docs/ path) — and it shipped in every standalone build
    // via the `cp -r public` step. The s54 fully-dead class,
    // PUBLIC-ASSET variant — a new face after the IMPORT (s56) /
    // PROP-TYPE (s57c) / DESTRUCTURED (s59) / TEST-LOCAL (s60) / KEY
    // (s60) / TYPE-INTERFACE (s58/s59) / ALIAS (s58) variants. The
    // docs/ original stays — it is the referenced one (guard below).
    expect(read("public/neo-crm-dashboard.png")).toBeNull();
  });

  it("package.json no longer carries the three never-referenced deps (N-61b + N-61d)", () => {
    // 61-b fresh-eyes (the dependency-manifest rotation): two radix
    // runtime deps (react-alert-dialog, react-radio-group) with ZERO
    // imports repo-wide, zero git history beyond the initial scaffold,
    // and no ui components — plus bun-types (devDep) with zero
    // references (no Bun.* usage, no tsconfig "types" field, not
    // @types-scoped so never auto-included by tsc). The session-2 R-4
    // unused-scaffold precedent, RUNTIME-DEP + DEV-DEP variants. The
    // 7 live radix packages + tw-animate-css (the ADR-005 vendoring
    // source) stay (guard below).
    const raw = read("package.json") ?? "";
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    expect(pkg.dependencies?.["@radix-ui/react-alert-dialog"]).toBeUndefined();
    expect(pkg.dependencies?.["@radix-ui/react-radio-group"]).toBeUndefined();
    expect(pkg.devDependencies?.["bun-types"]).toBeUndefined();
    expect(raw).not.toMatch(/react-alert-dialog/);
    expect(raw).not.toMatch(/react-radio-group/);
    expect(raw).not.toMatch(/"bun-types"/);
  });

  it("the living dependency surface stays (guard)", () => {
    // The live radix packages with their real import sites — the
    // stock-primitive seam the app actually renders through — plus the
    // ADR-005 vendoring source (tw-animate-css), the s25 PDF seam
    // (jspdf + html2canvas-pro), and the REFERENCED dashboard image
    // (the docs/ original the prompt docs point at).
    // Session-62 correction: @radix-ui/react-toast is NOT among the
    // live set — the s61 census wrongly counted it (toast.tsx is a
    // from-scratch mirror that never imports the package); it retired
    // at s62 (N-62a). react-label's import site joins the pinned set
    // (unpinned at s61 — 62-a#4).
    const raw = read("package.json") ?? "";
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    for (const dep of [
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
    ]) {
      expect(pkg.dependencies?.[dep]).toBeTruthy();
    }
    expect(pkg.devDependencies?.["tw-animate-css"]).toBeTruthy();
    expect(pkg.dependencies?.["jspdf"]).toBeTruthy();
    expect(pkg.dependencies?.["html2canvas-pro"]).toBeTruthy();
    expect(stripComments(read("src/components/ui/dialog.tsx") ?? "")).toMatch(
      /@radix-ui\/react-dialog/,
    );
    expect(stripComments(read("src/components/ui/button.tsx") ?? "")).toMatch(
      /@radix-ui\/react-slot/,
    );
    expect(stripComments(read("src/components/ui/select.tsx") ?? "")).toMatch(
      /@radix-ui\/react-select/,
    );
    expect(stripComments(read("src/components/ui/dropdown.tsx") ?? "")).toMatch(
      /@radix-ui\/react-dropdown-menu/,
    );
    expect(stripComments(read("src/components/ui/dropdown.tsx") ?? "")).toMatch(
      /@radix-ui\/react-popover/,
    );
    expect(read("docs/neo-crm-dashboard.png")).not.toBeNull();
  });
});

describe("session-62: the manifest honesty + the dead-arm retirement", () => {
  it("the never-imported react-toast retires; @types/node becomes explicit (N-62a + 62-a#3)", () => {
    // Convergent find (62-a#1 + 62-b's N-62a): @radix-ui/react-toast
    // was NEVER imported — toast.tsx is a from-scratch implementation
    // whose header says it "Mirrors the @radix-ui/react-toast API
    // shape"; git log -S finds no import in ANY commit. The s61 census
    // wrongly claimed a "verified import site" and the s61 guard pinned
    // it live — the entrenchment this it reverses.
    // @types/node joins as an EXPLICIT devDep (62-a#3): the s61
    // package-lock regen dropped the resolved @types/node (an optional
    // peer npm never auto-installs), so an npm-install consumer (the
    // install_packages.sh path) would lack the types tsc needs for the
    // node: imports (db-path/verification-server/next.config/scripts).
    // The version pins what the bun tree already resolves: zero change.
    const raw = read("package.json") ?? "";
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    expect(pkg.dependencies?.["@radix-ui/react-toast"]).toBeUndefined();
    expect(raw).not.toMatch(/react-toast/);
    expect(pkg.devDependencies?.["@types/node"]).toBeTruthy();
    const script = read("scripts/install_packages.sh") ?? "";
    expect(script).not.toContain("@radix-ui/react-toast");
    expect(script).toContain("@types/node");
    // 19 runtime + 11 dev = the 30-token set.
    expect(Object.keys(pkg.dependencies ?? {}).length).toBe(19);
    expect(Object.keys(pkg.devDependencies ?? {}).length).toBe(11);
  });

  it("every surviving radix package has a REAL import site (the honest census — 62-a#4)", () => {
    // The 6 survivors, EACH pinned to its actual consumer file — label
    // joins the pinned set at s62 (the s61 guard asserted sites for
    // only 5 of 7). toast is gone (never had one). The ui/ mirror files
    // are the ground truth: stripComments so a header mention can never
    // masquerade as an import (the exact trap the s61 census fell into).
    expect(stripComments(read("src/components/ui/dialog.tsx") ?? "")).toMatch(
      /@radix-ui\/react-dialog/,
    );
    expect(stripComments(read("src/components/ui/button.tsx") ?? "")).toMatch(
      /@radix-ui\/react-slot/,
    );
    expect(stripComments(read("src/components/ui/select.tsx") ?? "")).toMatch(
      /@radix-ui\/react-select/,
    );
    expect(stripComments(read("src/components/ui/dropdown.tsx") ?? "")).toMatch(
      /@radix-ui\/react-dropdown-menu/,
    );
    expect(stripComments(read("src/components/ui/dropdown.tsx") ?? "")).toMatch(
      /@radix-ui\/react-popover/,
    );
    expect(stripComments(read("src/components/ui/label.tsx") ?? "")).toMatch(
      /@radix-ui\/react-label/,
    );
  });
});

describe("session-63: the foreign-doc retirement + the dead-arm split + the micro-honesty", () => {
  it("the two foreign project manuals are gone from the repo root (63-b #1, the s54 DOC-FILE class)", () => {
    // scandihaven_SKILL.md (the Scandi Haven project's own 128 KB
    // manual) and project-management_SKILL.md (ORBITAL's manual — a
    // THIRD project entirely) shipped in every clone since the initial
    // scaffold b48fc3d, never modified once, with zero functional
    // references: the operator's prompt templates cite the GITHUB repo
    // URL for scandihaven's docs, never the local copies. Recovery if
    // ever needed: git show b48fc3d:scandihaven_SKILL.md.
    expect(
      existsSync(path.resolve(import.meta.dirname, "..", "scandihaven_SKILL.md")),
    ).toBe(false);
    expect(
      existsSync(
        path.resolve(import.meta.dirname, "..", "project-management_SKILL.md"),
      ),
    ).toBe(false);
  });

  it("the construction-dead arms retire; the defensive DB-read arms stay annotated (N-63b)", () => {
    // SPLIT by risk class. RETIRED — unreachable by construction over
    // INTERNAL constants (the N-62c class): the PIPELINE_STAGES.map
    // loops index PIPELINE_LABELS with keys that are all verified
    // present (the dashboard route + the client page's stage select),
    // and settings' `!view` guarded a value that asString's
    // optional+trim contract already guarantees non-empty after
    // `?? "month"`. KEPT + ANNOTATED — defensive over PERSISTED data
    // (a different risk class: a Record<string,…> lookup over DB
    // values degrades gracefully on an unexpected key): the reports
    // ACTIVITY_TYPE_META[...]?.label triple, `o.stage || "unknown"`,
    // and the dashboard `: 0` ternary arm (Activity.dueAt is
    // DateTime?; the filter guarantees it at runtime but the type
    // requires the arm — the codebase has zero type-predicate /
    // non-null-assertion patterns, so the arm is the honest static
    // form).
    const dashboardRoute = stripComments(read("src/app/api/dashboard/route.ts") ?? "");
    expect(dashboardRoute).toContain("label: PIPELINE_LABELS[stage],");
    expect(dashboardRoute).not.toMatch(/PIPELINE_LABELS\[stage\] \?\?/);
    expect(dashboard()).toContain("{PIPELINE_LABELS[s]}");
    expect(dashboard()).not.toMatch(/PIPELINE_LABELS\[s\] \?\?/);
    const settingsRoute = stripComments(read("src/app/api/settings/route.ts") ?? "");
    expect(settingsRoute).not.toMatch(/!view/);
    expect(settingsRoute).toMatch(/\["month", "week", "agenda"\]\.includes\(view\)/);
    // The keep-annotations ride the RAW sources (comments above are
    // stripped for the form pins).
    expect(read("src/app/api/reports/route.ts") ?? "").toContain("defensive DB-read");
    expect(read("src/app/api/dashboard/route.ts") ?? "").toContain("statically required");
  });

  it("the DEV_SECRET fallback warns once in production (N-63g)", () => {
    // The short-(<16-char)-AUTH_SECRET case used to fall back as
    // silently as the unset case — production would ship forgeable
    // sessions with no signal. The warn fires ONCE (secret() rides
    // every session op); the unset case keeps its documented posture.
    const authRaw = read("src/lib/auth.ts") ?? "";
    expect(authRaw).toContain('process.env.NODE_ENV === "production"');
    expect(authRaw).toContain("console.warn");
  });

  it("login's email cap joins the 160 family (N-63i)", () => {
    // signup (:57-58), resend (:29) and verify (:39) all read the email
    // at { max: 160 }; login rode the asString default (500). Beyond
    // the inconsistency, a >160-char email stored TRUNCATED by signup
    // could never log in (login's untruncated read mismatches the
    // stored prefix). 160 everywhere = the truncation-parity contract.
    const loginRoute = stripComments(read("src/app/api/auth/login/route.ts") ?? "");
    expect(loginRoute).toMatch(/asString\(body\.email, \{ max: 160 \}\)/);
    expect(loginRoute).not.toMatch(/asString\(body\.email\) \?\?/);
  });
});

describe("session-64: the stripComments dead-cargo retirement (N-64g)", () => {
  it("no test helper carries the unreachable second replace (the braced-comment pattern after the plain-comment sweep)", () => {
    // The shared stripComments helper's SECOND replace — the one whose
    // regex targeted BRACED JSX comment spans after the first pass had
    // already swept the plain ones — was unreachable: the first replace
    // removes every plain /*…*/ span, and the second pattern requires
    // an `/*` with a following `*/`, exactly what the first pass
    // consumed. Dead cargo duplicated across all 54 helper copies at
    // s63 HEAD (the s54 dead-cargo class, HELPER variant), retired in
    // one sweep at s64. The needle below is written ESCAPED so this
    // pin's own bytes can never satisfy it (the docs above deliberately
    // avoid the literal).
    const needle = ".replace(/\\{\\/\\*[\\s\\S]*?\\*\\/\\}/g, \"\")";
    const dir = path.resolve(import.meta.dirname);
    const offenders = readdirSync(dir)
      .filter((f) => f.endsWith(".test.ts"))
      .filter((f) => (readFileSync(path.join(dir, f), "utf-8")).includes(needle));
    expect(offenders).toEqual([]);
  });
});

describe("session-65: the page-render dead-surface retirement (N-65c/d/e + the /Profile doc re-derive)", () => {
  it("accounts-page carries no construction-dead Key disjunct (tier is membership-validated to A/B/C at both write seams)", () => {
    // N-65d (the 65-c rotation): `(a.isKey || a.tier === "Key")` rode the
    // accounts table + card rows, but tier can never hold "Key" — the
    // create + update routes membership-validate it against ACCOUNT_TIERS
    // (["A","B","C"]) and the seed plants only A/B/C; a.isKey is the
    // live arm (the display mapping `a.isKey ? "Key" : a.tier` is the
    // honest form). The adjudicated s63 N-63b class over persisted data
    // — retired, with the record comment in the source.
    const src = accounts();
    expect(src).not.toContain('a.tier === "Key"');
    expect(read("src/app/(app)/accounts/accounts-page.tsx") ?? "").toMatch(/N-65d/);
  });

  it("reports-page's stage select reads OPP_STAGE_META[s].label directly (the s63 N-63b missed sibling)", () => {
    // N-65e: the select mapped OPPORTUNITY_STAGES through
    // `OPP_STAGE_META[s]?.label ?? s` — but s ranges over the six-key
    // constant and OPP_STAGE_META covers all six (constants.ts), so both
    // the optional chain and the fallback arm are construction-dead over
    // internal constants. The dashboard twin (PIPELINE_LABELS[s] ?? s)
    // was retired at s63; this is the missed sibling.
    const src = reports();
    expect(src).toContain("OPP_STAGE_META[s].label");
    expect(src).not.toContain("OPP_STAGE_META[s]?.label ?? s");
  });

  it("contacts-page's store destructure carries only live bindings (the s41-P5 sources-sibling sweep completed)", () => {
    // N-65c: the destructure carried leads/users/settings with zero body
    // reads (comment mentions only — the s41-P5 sweep deleted the dead
    // `sources` sibling from this very destructure and missed these
    // three). Narrowed to the live set.
    const src = contacts();
    const at = src.indexOf("} = useCrmStore()");
    const region = src.slice(Math.max(0, src.lastIndexOf("const {", at)), at);
    expect(region).not.toMatch(/^\s*leads,$/m);
    expect(region).not.toMatch(/^\s*users,$/m);
    expect(region).not.toMatch(/^\s*settings,$/m);
  });

  it("settings-page's SettingsPage destructure carries no updateSettings (the editors destructure their own)", () => {
    // N-65c sibling: SettingsPage destructured updateSettings but never
    // read it in its own scope — ConfigEditor and DefaultsEditor each
    // destructure their own from the store.
    const src = stripComments(read("src/app/(app)/settings/settings-page.tsx") ?? "");
    const at = src.indexOf("export default function SettingsPage");
    const region = src.slice(at, at + 400);
    expect(region).not.toContain("updateSettings");
  });

  it("AGENTS + PAD document the /Profile RENDER-alias mechanism (the s24 form — the s14 redirect retired)", () => {
    // N-65g (the 65-c rotation + the orchestrator's pre-validation
    // extension): the AGENTS architecture-facts block and the PAD
    // design-system row still documented the RETIRED s14 mechanism — a
    // top-level src/app/Profile/page.tsx server component that
    // redirect("/profile")s outside the (app) group. At HEAD /Profile
    // is the s24 RENDER alias inside the group (src/app/(app)/Profile/
    // page.jsx — renders in place, pinned by tests/profile-route.test.ts
    // asserting the redirect's ABSENCE). The docs now carry the live
    // mechanism; the do-NOT-use-config-redirect rationale survives.
    const agents = read("AGENTS.md") ?? "";
    const pad = read("Project_Architecture_Document.md") ?? "";
    for (const doc of [agents, pad]) {
      expect(doc).toContain("src/app/(app)/Profile/page.jsx");
      expect(doc).not.toContain("src/app/Profile/page.tsx");
    }
  });
});

// ---------------------------------------------------------------------------
// Session-66 (the 66-c components rotation): the dead-surface retirement —
// N-66b the tabs GRID_COLS_LG const (zero references repo-wide — the pill's
// lg:grid-cols-5 lives in page-layout.ts), N-66c the page-parts dead props
// (KpiCard.deltaSuffix/invertDelta + BarStatCard.barColorFor — never passed
// anywhere; the barColorFor ternary arm construction-dead), N-66j the
// Sparkline's Math.max computed before its own empty guard.
// ---------------------------------------------------------------------------

describe("session-66: the components dead-surface retirement (N-66b/c/j)", () => {
  it("tabs carries NO GRID_COLS_LG (zero references — the pill's lg: columns live in page-layout.ts)", () => {
    // N-66b: the s54 fully-dead class, CONST variant — the record comment
    // documents the retirement. The absence check reads the
    // COMMENT-STRIPPED source so the pin can never trip on its own
    // documentation (the s64/s65 needle-in-own-docs lesson).
    const stripped = read("src/components/ui/tabs.tsx") ?? "";
    expect(stripComments(stripped)).not.toMatch(/GRID_COLS_LG/);
    expect(stripped).toContain("N-66b");
  });

  it("KpiCard carries NO deltaSuffix/invertDelta props (DeltaText keeps its own — the N-58c boundary)", () => {
    const src = pageParts();
    expect(src).not.toMatch(/deltaSuffix/);
    expect(src).not.toMatch(/invertDelta/);
  });

  it("BarStatCard carries NO barColorFor prop and the construction-dead ternary arm is gone", () => {
    const src = pageParts();
    expect(src).not.toMatch(/barColorFor/);
    // The old arm: backgroundColor: barColorFor ? barColorFor(v, i) : barColor
    expect(src).not.toMatch(/barColorFor \? barColorFor\(v, i\) : barColor/);
    expect(src).toMatch(/backgroundColor: barColor/);
  });

  it("the Sparkline guards the empty series BEFORE computing Math.max (N-66j)", () => {
    const src = read("src/components/shared/page-parts.tsx") ?? "";
    const guard = src.indexOf("if (values.length === 0) return null;");
    const max = src.indexOf("Math.max(...values, 1)");
    expect(guard).toBeGreaterThan(-1);
    expect(max).toBeGreaterThan(-1);
    expect(guard).toBeLessThan(max);
  });
});

// Session-68 (N-68d/N-68h): the wiring + dedupe set from the 68-c
// rotation — the hand-inlined byte-copies of pinned constants retired
// (the settings typo, the contacts mobile-cards grid, the edit-family
// dialog chrome [pinned in entity-edit-dialog.test.ts]) + the format
// month-array dedupe.
describe("session-68: the unwired-duplicate wiring + the format dedupe", () => {
  it("the settings page consumes SETTINGS_PICKLIST.industriesPlaceholder (the mirrored typo cannot silently un-mirror)", () => {
    const src = stripComments(read("src/app/(app)/settings/settings-page.tsx") ?? "");
    expect(src).toMatch(/placeholder=\{SETTINGS_PICKLIST\.industriesPlaceholder\}/);
    // the hand-inlined byte-copy is gone
    expect(src).not.toMatch(/placeholder="Add new industrie"/);
  });

  it("the contacts mobile-card grid consumes CONTACTS_LAYOUT.mobileCards", () => {
    const src = stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
    expect(src).toMatch(/className=\{CONTACTS_LAYOUT\.mobileCards\}/);
    // the reordered hand-inline is gone
    expect(src).not.toMatch(/className="mt-6 space-y-4 lg:hidden"/);
  });

  it("format.ts declares the month array exactly once (formatMonthDayTime rides MONTHS_SHORT)", () => {
    const src = stripComments(read("src/lib/format.ts") ?? "");
    const hits = src.match(/"Jan", "Feb"/g) ?? [];
    expect(hits.length).toBe(1);
  });

  it("contact-detail-panel's mmmDyyyy rides the exported MONTHS_SHORT (F-69a5)", () => {
    // The N-68h class survived OUTSIDE format.ts: mmmDyyyy re-declared
    // the byte-identical month array because MONTHS_SHORT was
    // module-private. Session-69 exports it and the panel consumes it —
    // the repo declares the array exactly once.
    const src = stripComments(read("src/components/contacts/contact-detail-panel.tsx") ?? "");
    expect(src).not.toMatch(/"Jan", "Feb"/);
    expect(src).toMatch(/MONTHS_SHORT/);
    expect(src).toMatch(/from "@\/lib\/format"/);
    const fmt = stripComments(read("src/lib/format.ts") ?? "");
    expect((fmt.match(/"Jan", "Feb"/g) ?? []).length).toBe(1);
    expect(fmt).toMatch(/export const MONTHS_SHORT/);
  });
});

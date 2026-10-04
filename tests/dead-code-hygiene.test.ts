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
const leads = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
const reports = () => stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
const constants = () => stripComments(read("src/lib/constants.ts") ?? "");
const format = () => stripComments(read("src/lib/format.ts") ?? "");
const leadFilters = () => stripComments(read("src/lib/lead-filters.ts") ?? "");

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

  it("leads-page no longer imports CHART_COLORS (the reports page owns it)", () => {
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

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  ACCOUNT_HEALTH_STATUSES,
  AGING_BUCKETS,
  CHART_COLORS,
  CONTACT_SOURCE_OPTIONS,
  EVENT_TYPES,
  EVENT_TYPE_META,
  LEAD_SOURCE_OPTIONS,
  LEAD_STAGES,
  STAGE_META,
} from "@/lib/constants";

// Session-4 parity pins: every color below was extracted from the LIVE
// reference app's DOM (computed styles / legend swatches / card outerHTML),
// not from screenshots. If the reference changes, re-extract and re-pin —
// do not "fix" these tests to match the code.

/** Source read + comment strip (the s48 source-vocabulary idiom) — used
 * by the source-structure pins that must not be tripped by the very
 * comments documenting the shapes they assert. */
function readConstants(): string {
  const p = path.resolve(import.meta.dirname, "..", "src/lib/constants.ts");
  return existsSync(p)
    ? readFileSync(p, "utf-8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*/g, "")
    : "";
}

describe("chart palette parity (session-4 DOM-verified)", () => {
  it("dashboard pipeline stage colors: Proposal yellow-500, Won grey-400", () => {
    // Legend swatches on the live dashboard: rgb(59,130,246) / rgb(6,182,212)
    // / rgb(234,179,8) / rgb(249,115,22) / rgb(156,163,175).
    expect(STAGE_META.new.color).toBe("#3b82f6");
    expect(STAGE_META.qualified.color).toBe("#06b6d4");
    expect(STAGE_META.proposal.color).toBe("#eab308");
    expect(STAGE_META.negotiation.color).toBe("#f97316");
    expect(STAGE_META.won.color).toBe("#9ca3af");
  });

  it("badge pills are independent of chart hex (Won badge stays emerald)", () => {
    expect(STAGE_META.won.badge).toContain("emerald");
  });

  it("stat-card bar family: the tailwind -400 palette the reference renders", () => {
    // Accounts/activities stat cards: bg-blue-400 / bg-green-400 / bg-cyan-400
    // / bg-purple-400 / bg-red-400; Sales Target two-tone bg-amber-400 +
    // bg-blue-500; sparkline lines stroke #10b981.
    expect(CHART_COLORS.blue400).toBe("#60a5fa");
    expect(CHART_COLORS.green400).toBe("#4ade80");
    expect(CHART_COLORS.cyan400).toBe("#22d3ee");
    expect(CHART_COLORS.purple400).toBe("#c084fc");
    expect(CHART_COLORS.red400).toBe("#f87171");
    expect(CHART_COLORS.amber400).toBe("#fbbf24");
    expect(CHART_COLORS.emerald).toBe("#10b981");
  });
});

// Session-5 parity pins: option vocabularies extracted from the LIVE
// reference's create dialogs and dashboard filter listboxes (DOM extraction,
// 2026-09-29). The reference hardcodes these lists (its Settings picklists
// are empty at zero data yet the dialogs/filters still show them).
describe("dialog/filter vocabularies (session-5 DOM-verified)", () => {
  it("lead create dialog Status options: New / Contacted / Qualified / Unqualified", () => {
    // Live "Create New Lead" listbox: New, Contacted, Qualified, Unqualified.
    expect(STAGE_META.unqualified).toBeDefined();
    expect(STAGE_META.unqualified.label).toBe("Unqualified");
    expect(LEAD_STAGES).toContain("unqualified");
  });

  it("lead create dialog Source options: the RAW call / email / website / partner (the living vocabulary)", () => {
    // Session-29 (S29-P4, bundle-extracted from the Tke/Mke selects): the
    // dialogs store RAW values (value "call", label "Call") — the s28
    // contact-source precedent. Referral exists in the filters popover's
    // five-option list only.
    // Session-49 (S49-P5, N-49c): the pin re-anchored to the LIVING
    // LEAD_SOURCE_OPTIONS (the dialogs' own list — the create dialog's
    // LEAD_SOURCE_OPTIONS.map at entity-dialogs:725 + the dashboard's
    // Lead Sources rows at page.tsx:305, s64 refresh) after the
    // src-dead LEAD_SOURCES twin was removed with the s48-P2 CONTACT_SOURCES
    // precedent (zero src consumers; only this pin read it).
    expect(LEAD_SOURCE_OPTIONS.map((o) => o.value)).toEqual(["call", "email", "website", "partner"]);
  });

  it("the src-dead LEAD_SOURCES constant is removed (N-49c — the s48 CONTACT_SOURCES twin)", () => {
    // Source-structure pin (stripComments so the removal's own record
    // comment cannot trip it): the dead export is gone; the living
    // vocabulary LEAD_SOURCE_OPTIONS never matches (the identifier
    // continues with "_OPTIONS").
    const src = readConstants();
    expect(src).not.toMatch(/export const LEAD_SOURCES\b/);
    expect(src).toMatch(/export const LEAD_SOURCE_OPTIONS/);
  });

  it("contact create dialog \"How did you meet?\" emoji options (the living vocabulary)", () => {
    // Live "Create New Contact" listbox: 📞 Phone Call, ✉️ Email, 🌐 Website,
    // 🤝 Partner Referral, 👥 Personal Referral (emoji included — the trigger
    // itself renders "✉️ Email").
    //
    // Session-48 (S48-P2): the pin re-anchored from the removed src-dead
    // CONTACT_SOURCES constant to the LIVING vocabulary — the s28-corrected
    // CONTACT_SOURCE_OPTIONS pairs these same emoji labels with the RAW
    // values the reference stores (call/email/website/partner/referral);
    // its own pin lives at contact-model.test.ts:108. The s48
    // reconciliation record + the dead-constant removal: constants.ts's
    // Session-48 comment block + tests/source-vocabulary.test.ts.
    expect(CONTACT_SOURCE_OPTIONS.map((o) => o.label)).toEqual([
      "📞 Phone Call",
      "✉️ Email",
      "🌐 Website",
      "🤝 Partner Referral",
      "👥 Personal Referral",
    ]);
  });

  it("event dialog Event Type options: Meeting / Call / Demo / Task / Reminder / Appointment", () => {
    // Live "New Event" Event Type listbox.
    expect(EVENT_TYPES.map((t) => EVENT_TYPE_META[t].label)).toEqual([
      "Meeting",
      "Call",
      "Demo",
      "Task",
      "Reminder",
      "Appointment",
    ]);
  });
  // Session-54 (S54-P2): the isDroppedStage pin RETIRED with its dead
  // subject — the live "Dropped Deals" KPI counts `lost` STRICTLY
  // (leads-page S29-P5), which this pin misdocumented since s5. The
  // live truth is pinned in dead-code-hygiene's session-54 describe.
});

describe("session-10 vocabulary pins (reports/chart internals)", () => {
  // Session-54 (S54-P2): the REPORTS_PIPELINE_SLUGS pair + the
  // FUNNEL_STAGES pin retired with their dead subjects — the 8-slug
  // order is pinned FUNCTIONALLY by reports-data.test.ts's complete
  // ordered arrays, and the live funnel vocabulary is LEADS_FUNNEL
  // (pinned in leads-charts.test.ts). The constants themselves retired
  // from constants.ts (zero src consumers).
  it("aging pipeline ships the reference's 4 fixed buckets", () => {
    // S10-8: the reference's tab-2 "Aging Pipeline" bar chart renders 4 bar
    // rects at zero with ticks <30 days / 30-60 days / >90 days (the 60-90
    // label drops at 331px — recharts tick elision; the DATA list is 4).
    expect(AGING_BUCKETS.map((b) => b.label)).toEqual([
      "<30 days",
      "30-60 days",
      "60-90 days",
      ">90 days",
    ]);
  });
});


// Session-44 (S44-P1): the Account.health vocabulary — the route-side
// membership constant for the last dead schema field (the schema default
// "Healthy", the seed's three values, the badge map's three keys — one
// named vocabulary instead of three anonymous literals).
describe("session-44: the account health vocabulary (S44-P1)", () => {
  it("ACCOUNT_HEALTH_STATUSES matches the seed + the badge map exactly", () => {
    expect(ACCOUNT_HEALTH_STATUSES).toEqual(["Healthy", "At Risk", "Needs Attention"]);
  });
});

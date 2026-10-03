import { describe, expect, it } from "vitest";
import {
  ACCOUNT_HEALTH_STATUSES,
  AGING_BUCKETS,
  CHART_COLORS,
  CONTACT_SOURCES,
  EVENT_TYPES,
  EVENT_TYPE_META,
  FUNNEL_STAGES,
  LEAD_SOURCES,
  LEAD_STAGES,
  REPORTS_PIPELINE_SLUGS,
  STAGE_META,
  isDroppedStage,
} from "@/lib/constants";

// Session-4 parity pins: every color below was extracted from the LIVE
// reference app's DOM (computed styles / legend swatches / card outerHTML),
// not from screenshots. If the reference changes, re-extract and re-pin —
// do not "fix" these tests to match the code.
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

  it("lead create dialog Source options: the RAW call / email / website / partner", () => {
    // Session-29 (S29-P4, bundle-extracted from the Tke/Mke selects): the
    // dialogs store RAW values (value "call", label "Call") — the s28
    // contact-source precedent. Referral exists in the filters popover's
    // five-option list only.
    expect([...LEAD_SOURCES]).toEqual(["call", "email", "website", "partner"]);
  });

  it("contact create dialog \"How did you meet?\" emoji options", () => {
    // Live "Create New Contact" listbox: 📞 Phone Call, ✉️ Email, 🌐 Website,
    // 🤝 Partner Referral, 👥 Personal Referral (emoji included — the trigger
    // itself renders "✉️ Email").
    expect([...CONTACT_SOURCES]).toEqual([
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

  it("unqualified counts as dropped alongside lost", () => {
    expect(isDroppedStage("lost")).toBe(true);
    expect(isDroppedStage("unqualified")).toBe(true);
    expect(isDroppedStage("new")).toBe(false);
    expect(isDroppedStage("won")).toBe(false);
  });
});

describe("session-10 vocabulary pins (reports/chart internals)", () => {
  it("reports pipeline chart ships the reference's 8 RAW slugs in order", () => {
    // S10-6: the reference's reports tab-1 "Pipeline by Stage" X ticks are
    // the raw merged stage list (extracted at 1512, 2026-09-30):
    // new, contacted, qualified, prospecting, qualification, proposal,
    // negotiation, closed_won — snake_case, no title-casing. The reference's
    // own merged-list bug: new≡prospecting and qualified≡qualification
    // (its dashboard aliases) plus won≡closed_won all leak into one list.
    expect(REPORTS_PIPELINE_SLUGS).toEqual([
      "new",
      "contacted",
      "qualified",
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed_won",
    ]);
  });

  it("the conversion funnel is a 4-stage list (new/qualified/won/lost)", () => {
    // S10-7: the reference's funnel renders 4 trapezoid groups (leads page
    // AND reports tab 1) — the same 4-stage vocabulary as the leads page's
    // "Pipeline Value by Stage" chart (New/Qualified/Won/Lost).
    expect(FUNNEL_STAGES).toEqual(["new", "qualified", "won", "lost"]);
    expect(FUNNEL_STAGES.map((s) => STAGE_META[s].label)).toEqual([
      "New",
      "Qualified",
      "Won",
      "Lost",
    ]);
  });

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

  it("the 8-slug list is the leads+opps CONCATENATION order (session-31 correction)", () => {
    // The s10 "merged-list double-report" reading is RETIRED: the
    // bundle-decoded funnel is the leads' new/contacted/qualified counts
    // followed by the OPPORTUNITY five-stage counts
    // (reports-data.ts pipelineStageCounts). The slug ORDER is pinned; the
    // split itself is pinned by tests/reports-data.test.ts.
    expect(REPORTS_PIPELINE_SLUGS).toEqual([
      "new",
      "contacted",
      "qualified",
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed_won",
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

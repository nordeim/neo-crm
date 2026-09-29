import { describe, expect, it } from "vitest";
import {
  CHART_COLORS,
  CONTACT_SOURCES,
  EVENT_TYPES,
  EVENT_TYPE_META,
  LEAD_SOURCES,
  LEAD_STAGES,
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

  it("lead create dialog Source options: Call / Email / Website / Partner", () => {
    // Live "Create New Lead" Source listbox (and dashboard All Sources):
    // Call, Email, Website, Partner.
    expect([...LEAD_SOURCES]).toEqual(["Call", "Email", "Website", "Partner"]);
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

import { describe, expect, it } from "vitest";
import { CHART_COLORS, STAGE_META } from "@/lib/constants";

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

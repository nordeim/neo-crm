import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-83 parity suite (the 83-c reports filter-card family rotation):
// every pin mirrors a BUNDLE-DECODED reference fact (the fresh-fetched
// index-DZ-xbrIm.js, md5 a70a637… — the 54th consecutive stable bundle).
//
// The reference facts pinned here (all decoded this session):
// - the lCe filter card's FOUR SelectValues carry placeholders
//   ("Date: This Quarter" / "Owner: All" / "Stage: All" / "Status: All")
//   — dead in BOTH apps (the controlled values are always set); mirrored
//   for source parity (the FILTER_BAR.searchPlaceholder precedent).
// - the reports page root carries id="reports-content" (the reference's
//   own PDF capture hook; ours captures main — the s25-pinned variant —
//   the id is a zero-risk mirror).
// - the fifth tab's id is "accounts" (the reference's
//   value:"accounts" — an invisible internal id, no URL state).
// - the settings DATA tab's 7 export buttons: the reference's `cs` =
//   w-4 h-4 mr-2 (the file's own s72 comment said so; the record shipped
//   h-4 w-4 — the 83-a M-83a1 catch).
// - the dashboard Filter button's svg: w-4 h-4 mr-2 (OC at 1123817) —
//   ours shipped h-3.5 w-3.5 (a 2-fold divergence: 14px vs 16px AND no
//   margin; the svg+span construction's gap regressed 16px -> 8px at
//   s82 when the base cascade retired).
// - the activities quick-log row's four svgs: w-4 h-4 mr-2 (af/nf/qd/LB
//   at 972724) — ours shipped h-4 w-4 (no margin since the s9 only-child
//   arm nullified it).
// - the Log WhatsApp button rides the DEFAULT variant +
//   "bg-emerald-600 hover:bg-emerald-700" (the base's
//   text-primary-foreground keeps the label white on hover); ours rode
//   ghost + text-white — the ghost's surviving hover:text-foreground
//   flipped the label #0a0a0a on hover.
// - the save-dialog Load button is the BARE outline sm (the reference's
//   Ke variant:"outline" size:"sm" — no className); ours duplicated the
//   sm size in a className.
//
// Documented parities pinned green-by-design (computed-equal, no code
// change): the bar chrome (the Card base + appended classes
// twMerge-resolve to our tokens — bg-surface #ffffff = bg-white,
// border-line-strong #e5e7eb = border-gray-200, shadow-md); the
// row/selectsWrap/selectWrap/selectIcon construction; the four w-44
// triggers + the period/stage/status option sets; the Reset button (the
// selects cluster's LAST CHILD, outline sm, RotateCcw mr-2); the
// actions pair (Export CSV default sm + Download mr-2 — the reference's
// explicit bg-blue-600 override = our default blue; PDF outline sm +
// FileText mr-2); the page header family; the KPI grid + the
// [65,72,68,85,78,92] static spark; the KPI card construction (the
// chips' -50/-600 pairs; the value's BARE form = the s69/s70 documented
// standing decision — the reference's text-gray-900 accepted as the
// inherited #0a0a0a); the TABS_PILL resolved forms; the Sparkline line
// variant; the save dialog's Current-Filters box + saved-list family.
// - the three stale doc carriers (AGENTS.md:187-190 + :684-686 +
// page-layout.ts:448) still documenting the RETIRED s9 iconGap
// mechanism as current — re-derived (absence-pinned here so the N-50a
// doc-carrier-escapes-pins genus cannot recur on these surfaces).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

// The hazard comments in the touched files name the retired classes by
// design (v4 scans comments), so the NEGATIVE pins read the
// comment-stripped source (the s81 stripComments convention).
const reportsSrc = () => stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
const reportsRaw = () => read("src/app/(app)/reports/reports-page.tsx") ?? "";
const constantsSrc = () => stripComments(read("src/lib/constants.ts") ?? "");
const pageLayoutRaw = () => read("src/lib/page-layout.ts") ?? "";
const dashboardSrc = () => stripComments(read("src/app/(app)/page.tsx") ?? "");
const activitiesSrc = () => stripComments(read("src/app/(app)/activities/activities-page.tsx") ?? "");
const saveDialogSrc = () => stripComments(read("src/components/shared/save-report-dialog.tsx") ?? "");
const agentsRaw = () => read("AGENTS.md") ?? "";
const globalsRaw = () => read("src/app/globals.css") ?? "";

async function layout() {
  return await import("@/lib/page-layout");
}

describe("session-83: the reports filter-card family — the SelectValue placeholders (N-83c5)", () => {
  it("the four selects carry the reference's verbatim placeholders", async () => {
    const src = reportsSrc();
    expect(src).toContain('<SelectValue placeholder="Date: This Quarter" />');
    expect(src).toContain('<SelectValue placeholder="Owner: All" />');
    expect(src).toContain('<SelectValue placeholder="Stage: All" />');
    expect(src).toContain('<SelectValue placeholder="Status: All" />');
  });

  it("the placeholders are DEAD in both apps — the four selects stay controlled", () => {
    // The reference's e.dateRange/e.owner/e.stage/e.status are always
    // set (its reset terminal sets all four + source); ours likewise.
    // The placeholder never renders — mirrored for source parity only.
    const src = reportsSrc();
    expect(src).toContain("<Select value={period} onValueChange={setPeriod}>");
    expect(src).toContain("<Select value={owner} onValueChange={setOwner}>");
    expect(src).toContain("<Select value={stage} onValueChange={setStage}>");
    expect(src).toContain("<Select value={status} onValueChange={setStatus}>");
  });
});

describe("session-83: the reports page root + the tab id (N-83c6 + N-83c8)", () => {
  it("the page root carries the reference's id=\"reports-content\"", () => {
    expect(reportsSrc()).toContain('<div id="reports-content" className={PAGE_ROOT.standard}>');
  });

  it("the fifth tab's id is the reference's \"accounts\" (not \"health\")", async () => {
    const src = constantsSrc();
    expect(src).toContain('{ id: "accounts", label: "Account Health" }');
    expect(src).not.toContain('{ id: "health"');
  });

  it("the panel consumer + the conditional ride the same id", () => {
    const src = reportsSrc();
    expect(src).toContain('<TabsPanel tab="accounts"');
    expect(src).toContain('tab === "accounts"');
    expect(src).not.toContain('tab === "health"');
  });

  it("the labels stay the reference's verbatim five", async () => {
    const { REPORT_TABS } = await import("@/lib/constants");
    expect(REPORT_TABS.map((t) => t.label)).toEqual([
      "Sales Overview",
      "Pipeline & Forecast",
      "Activity & Productivity",
      "Lead Sources",
      "Account Health",
    ]);
  });
});

describe("session-83: the settings Data-tab margins (M-83a1)", () => {
  it("SETTINGS_DATA.buttonIcon is the reference's w-4 h-4 mr-2", async () => {
    const { SETTINGS_DATA } = await layout();
    expect(SETTINGS_DATA.buttonIcon).toBe("h-4 w-4 mr-2");
  });

  it("the record's doc-comment no longer claims the gap rides the retired iconGap field", () => {
    // The N-50a doc-carrier genus: the s72 comment documented the
    // reference's cs = w-4 h-4 mr-2 while the record shipped h-4 w-4
    // AND attributed the gap to the (now-retired) BUTTON_BASE.iconGap.
    expect(pageLayoutRaw()).not.toContain("the mr-2 gap rides BUTTON_BASE.iconGap");
  });

  it("the seven export buttons consume the record icon (the page-level read)", () => {
    const src = stripComments(read("src/app/(app)/settings/settings-page.tsx") ?? "");
    const count = (src.match(/SETTINGS_DATA\.buttonIcon/g) ?? []).length;
    expect(count).toBe(7);
  });
});

describe("session-83: the dashboard Filter button (M-83c2)", () => {
  it("the svg carries the reference's w-4 h-4 mr-2 (was h-3.5 w-3.5, no margin)", () => {
    const src = dashboardSrc();
    expect(src).toMatch(/<FilterPolygon className="w-4 h-4 mr-2" \/>/);
    expect(src).not.toMatch(/h-3\.5 w-3\.5/);
  });

  it("the label span stays the reference's hidden sm:inline construction", () => {
    expect(dashboardSrc()).toMatch(/<span className="hidden sm:inline">Filter<\/span>/);
  });

  it("the glyph stays the s17 hand-rolled polygon (the reference's old-lucide filter)", async () => {
    // The reference's OC = tr("Filter", YQ) with the polygon
    // "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" — our lucide
    // 0.525's Filter is a redesigned glyph, so the polygon lives in
    // icons.tsx (S17-P2b). The dashboard/leads/contacts usages stay.
    const src = stripComments(read("src/components/ui/icons.tsx") ?? "");
    expect(src).toContain('points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"');
  });
});

describe("session-83: the activities quick-log row (M-83c3 + L-83c4)", () => {
  it("the four quick-log svgs carry the reference's w-4 h-4 mr-2", () => {
    const src = activitiesSrc();
    expect(src).toMatch(/<q\.icon className="w-4 h-4 mr-2" \/>/);
    expect(src).not.toMatch(/<q\.icon className="h-4 w-4" \/>/);
  });

  it("the icon identities stay the reference's Phone/Mail/Calendar/MessageSquare", () => {
    const src = activitiesSrc();
    expect(src).toContain('label: "Log Call", icon: Phone');
    expect(src).toContain('label: "Log Email", icon: Mail');
    expect(src).toContain('label: "Log Meeting", icon: Calendar');
    expect(src).toContain('label: "Log WhatsApp", icon: MessageSquare');
  });

  it("the Log WhatsApp button rides the DEFAULT variant (the reference's own construction)", async () => {
    const src = activitiesSrc();
    expect(src).toMatch(/variant=\{q\.type === "whatsapp" \? "default" : "outline"\}/);
    expect(src).not.toMatch(/"whatsapp" \? "ghost"/);
  });

  it("ACTIVITY_QUICKLOG.whatsapp is the reference's bare color pair (text/shadow ride the default base)", async () => {
    const { ACTIVITY_QUICKLOG } = await layout();
    expect(ACTIVITY_QUICKLOG.whatsapp).toBe("bg-emerald-600 hover:bg-emerald-700");
  });
});

describe("session-83: the save-dialog Load button (N-83c7)", () => {
  it("the Load button is the BARE outline sm (no redundant className)", () => {
    const src = saveDialogSrc();
    expect(src).toMatch(/<Button\s+variant="outline"\s+size="sm"\s+onClick=\{\(\) => onLoad\(r\)\}\s*>/);
    expect(src).not.toMatch(/className="h-8 px-3 text-xs"/);
  });
});

describe("session-83: the stale doc carriers (N-83a1 + N-83a2 — absence-pinned)", () => {
  it("AGENTS.md no longer documents the retired iconGap mechanism", () => {
    // The s82 retirement left :187-190 carrying BUTTON_BASE.iconGap +
    // the [&_svg] arms as the CURRENT mechanism — re-derived.
    expect(agentsRaw()).not.toContain("BUTTON_BASE.iconGap");
    expect(agentsRaw()).not.toContain("[&_svg]:only-child");
  });

  it("AGENTS.md no longer documents the userButton's retired mr-0 neutralizer", () => {
    expect(agentsRaw()).not.toContain("[&_svg]:mr-0");
  });
});

describe("session-83: the filter-card family's standing computed-equal surfaces (green-by-design)", () => {
  it("the bar chrome: the record exact + the token equivalences the twMerge decode proved", async () => {
    const { REPORTS_FILTER_BAR } = await layout();
    expect(REPORTS_FILTER_BAR.bar).toBe(
      "rounded-xl border border-line-strong bg-surface p-4 mb-6 sticky top-0 z-10 shadow-md",
    );
    expect(REPORTS_FILTER_BAR.row).toBe("flex flex-col lg:flex-row gap-4 items-center");
    expect(REPORTS_FILTER_BAR.selectsWrap).toBe("flex flex-wrap gap-3 flex-1");
    expect(REPORTS_FILTER_BAR.selectWrap).toBe("flex items-center gap-2");
    // The reference's Card base + appended "p-4 mb-6 sticky top-0 z-10
    // bg-white shadow-md border-gray-200" twMerge-resolves to exactly
    // these computed values (verified this session against the bundle's
    // ot/Bt decode): bg-white = --color-surface #ffffff;
    // border-gray-200 = --color-line-strong #e5e7eb; the base shadow
    // drops to shadow-md.
    const css = globalsRaw();
    expect(css).toContain("--color-surface: #ffffff;");
    expect(css).toContain("--color-line-strong: #e5e7eb;");
  });

  it("the leading icons: text-muted = the reference's text-gray-500 #6b7280", async () => {
    const { REPORTS_FILTER_BAR } = await layout();
    expect(REPORTS_FILTER_BAR.selectIcon).toBe("h-4 w-4 text-muted");
    expect(globalsRaw()).toContain("--color-muted: #6b7280;");
  });

  it("the four triggers are w-44 + the period/status vocabularies byte-match the lCe decode", async () => {
    const src = reportsSrc();
    expect((src.match(/<SelectTrigger className="w-44">/g) ?? []).length).toBe(4);
    const { REPORT_PERIODS, REPORT_STATUSES, OPP_STAGE_META } = await import("@/lib/constants");
    expect(REPORT_PERIODS.map((p) => p.id)).toEqual([
      "today", "thisWeek", "thisMonth", "quarter", "ytd", "all",
    ]);
    expect(REPORT_PERIODS.map((p) => p.label)).toEqual([
      "Today", "This Week", "This Month", "This Quarter", "YTD", "All Time",
    ]);
    expect(REPORT_STATUSES.map((s) => s.id)).toEqual(["open", "won", "lost"]);
    expect(REPORT_STATUSES.map((s) => s.label)).toEqual(["Open", "Won", "Lost"]);
    // The lCe stage list: all + the OPP six with the FULL Closed Won /
    // Closed Lost labels (the s74 M-74c1 fix).
    expect(OPP_STAGE_META.closed_won.label).toBe("Closed Won");
    expect(OPP_STAGE_META.closed_lost.label).toBe("Closed Lost");
  });

  it("the Reset button: the selects cluster's LAST CHILD, outline sm, RotateCcw mr-2", () => {
    const src = reportsSrc();
    // The Reset is the last child inside selectsWrap (L-74c9): its
    // RotateCcw lives AFTER the fourth select and BEFORE the wrap's
    // closing div, with no further Button between it and the wrap's
    // close; its icon rides barBtnIcon = h-4 w-4 mr-2.
    const wrap = src.indexOf("REPORTS_FILTER_BAR.selectsWrap");
    const actions = src.indexOf("REPORTS_FILTER_BAR.actions");
    const segment = src.slice(wrap, actions);
    expect(segment).toContain('<RotateCcw className={REPORTS_FILTER_BAR.barBtnIcon} /> Reset');
    const lastBtn = segment.lastIndexOf("<Button");
    const afterLastBtn = segment.slice(lastBtn);
    expect(afterLastBtn).toContain("RotateCcw");
    expect(afterLastBtn.indexOf("</Button>")).toBeGreaterThan(afterLastBtn.indexOf("RotateCcw"));
    expect(afterLastBtn.slice(afterLastBtn.indexOf("</Button>")).trim().startsWith("</Button>")).toBe(true);
  });

  it("the actions pair: Export CSV default sm + Download mr-2; PDF outline sm + FileText mr-2", async () => {
    const src = reportsSrc();
    expect(src).toMatch(/<Download className=\{REPORTS_FILTER_BAR\.barBtnIcon\} \/> Export CSV/);
    expect(src).toMatch(/<FileText className=\{REPORTS_FILTER_BAR\.barBtnIcon\} \/> PDF/);
    const { REPORTS_FILTER_BAR } = await layout();
    expect(REPORTS_FILTER_BAR.barBtnIcon).toBe("h-4 w-4 mr-2");
  });

  it("the header family: the standard row + the sm subtitle + the Saved Reports button", async () => {
    const { PAGE_HEADER } = await layout();
    expect(PAGE_HEADER.standard.row).toBe(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4",
    );
    expect(PAGE_HEADER.standard.title).toBe("text-2xl sm:text-3xl font-bold text-gray-900");
    expect(PAGE_HEADER.standard.subtitleSm).toBe("text-sm text-muted mt-1");
    const src = reportsSrc();
    expect(src).toMatch(/<Bookmark className="h-4 w-4 mr-2" \/> Saved Reports \(\{savedCount\}\)/);
  });

  it("the KPI grid + the static spark byte-match the ay decode", async () => {
    const { PAGE_KPI_GRIDS, KPI_STATICS } = await layout();
    expect(PAGE_KPI_GRIDS.reports).toBe(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6",
    );
    expect(KPI_STATICS.reportsSpark).toEqual([65, 72, 68, 85, 78, 92]);
  });

  it("the KPI card: the reportsCard chrome + the chip pairs + the BARE value (the s69/s70 standing decision)", async () => {
    const { STAT_CARD, KPI_ICON_TEXT, KPI_CHIP_BG } = await layout();
    expect(STAT_CARD.reportsCard).toBe(
      "rounded-xl border border-line-strong bg-surface p-5 shadow transition-shadow hover:shadow-md",
    );
    // The ay color map: bg-*-50 chips + text-*-600 icons (one step
    // darker than the -500 sparkline strokes). The chip bg rides the
    // inline style (KPI_CHIP_BG's hex values = the -50 literals):
    // blue-50 #eff6ff, green-50 #ecfdf5, red-50 #fef2f2,
    // purple-50 #f5f3ff, orange-50 #fff7ed.
    expect(KPI_ICON_TEXT["#3b82f6"]).toBe("text-blue-600");
    expect(KPI_ICON_TEXT["#10b981"]).toBe("text-green-600");
    expect(KPI_ICON_TEXT["#ef4444"]).toBe("text-red-600");
    expect(KPI_ICON_TEXT["#8b5cf6"]).toBe("text-purple-600");
    expect(KPI_ICON_TEXT["#f97316"]).toBe("text-orange-600");
    expect(KPI_CHIP_BG["#3b82f6"]).toBe("#eff6ff");
    expect(KPI_CHIP_BG["#ef4444"]).toBe("#fef2f2");
    // The value: the reference ships text-gray-900; ours rides the
    // documented bare family form (the inherited #0a0a0a accepted —
    // the s69 leads / s70 calendar precedent, the standing decision).
    expect(STAT_CARD.value).toBe("text-2xl font-bold");
    expect(STAT_CARD.value).not.toContain("text-foreground");
  });

  it("the spark: the line variant is the reference's LineChart + strokeWidth 2 + dot false", async () => {
    const src = stripComments(read("src/components/shared/page-parts.tsx") ?? "");
    // Session-87 (L-87c2): the line arm renders the ResponsiveContainer
    // BARE inside the slot — no wrapping div, no explicit margin (the
    // recharts default IS the 5px margin the reference inherits by
    // passing none; the s83 pin's explicit margin prop was the same
    // computed value spelled out).
    expect(src).toMatch(/<LineChart data=\{data\}>/);
    expect(src).toMatch(/strokeWidth=\{2\}/);
    expect(src).toMatch(/dot=\{false\}/);
    const { KPI_SPARK } = await layout();
    expect(KPI_SPARK.reportsSlot).toBe("flex-1 h-12 mr-2");
  });

  it("the tabs strip: the TABS_PILL forms match the resolved reference constructions", async () => {
    const { TABS_PILL } = await layout();
    // The reference's Gg base + "grid w-full grid-cols-2 lg:grid-cols-5
    // h-auto bg-white border" resolves (twMerge) to grid/w-full/cols/
    // h-auto/bg-white/border + the surviving base arms — our record is
    // that resolved form with the border color made explicit
    // (border-line #e5e5e5 = the reference's default --border family).
    expect(TABS_PILL.track).toBe(
      "items-center justify-center rounded-lg p-1 text-muted-ink grid w-full grid-cols-2 lg:grid-cols-5 h-auto bg-white border border-line",
    );
    expect(TABS_PILL.trigger).toContain("text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700");
    // The base's overridden arms (text-sm, bg-background, text-foreground
    // on active) are correctly absent.
    expect(TABS_PILL.trigger).not.toContain("data-[state=active]:bg-background");
  });

  it("the save dialog: the Current-Filters three-field box + the saved-list family", () => {
    const src = saveDialogSrc();
    expect(src).toContain(
      'Date Range: {filters.dateRange}, Stage: {filters.stage}, Owner: {filters.owner || "All"}',
    );
    expect(src).toContain('className="border-t pt-4"');
    expect(src).toContain('className="space-y-2 max-h-48 overflow-y-auto"');
    expect(src).toMatch(/<Bookmark className="w-4 h-4 text-blue-600" \/>/);
  });
});

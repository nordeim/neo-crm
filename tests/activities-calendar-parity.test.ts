import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-76 pins: the activities/calendar FAMILY parity suite (the 76-c
// fresh-eyes rotation — the family's first dedicated rotation, the
// session_145 suggested target). Every pin below is bundle-decoded
// against the fresh-fetched reference (the M/L/N-76 family, validated at
// file:line by the orchestrator; component identities: activities =
// JSe/gm/vx/Rce/Lce/QSe/Mce, calendar = jAe/Mx/_Ae/SAe).
//
// The decisive contracts:
// - KPI STATICS: the ten stat cards ship the reference's STATIC
//   deltas/subtexts/bar arrays (the gm literals: "+23%" / "Due now" +
//   "2h overdue" / "+7 today" / "+4 today" / "+1h 12m" / the six
//   6-value chartData arrays; the Mx trends "+3"/"+34"/"+2"/"+3") —
//   never computed values. The labels are the literal text-gray-600
//   (not the muted token). The WhatsApp bars are green-400 like Calls.
// - PRIORITY ROWS (vx): the p-3 hover:bg-gray-50 rounded-lg border-b row
//   with the initials avatar box, the relatedName-||-"Activity" title,
//   the destructive "Xh/Xd overdue" badge, the description line, the
//   time span, and the ghost "Check as completed" button.
// - TIMELINE (Rce): the long-weekday date groups, the Card p-4
//   hover:shadow-md items with the tinted icon square (the 100/600
//   pairs), the "Related to:" blue-link line, and the avatar + owner +
//   type-badge footer; "Loading activities..." while the first fetch is
//   in flight.
// - TABS: "No activities due today"; the per-tab caps (no cap on
//   overdue/dueToday, slice(0,5) on upcoming/completed); the Status
//   select vocabulary 7days/30days/90days.
// - KPI DERIVATIONS: Activities Today by the DUE DATE within
//   [startOfToday, startOfTomorrow); Meetings Scheduled counts ALL
//   meetings; the overdue boundary is startOfToday; the values read the
//   type-filtered set.
// - CALENDAR GRID: TODAY always carries the blue pill (the
//   white-on-white bug); the grid is the UNTRIMMED 42 cells; the chip
//   container is a plain space-y-0.5; the page renders through
//   CALENDAR_CELL.
// - UPCOMING/AGENDA: the 7-day window + scheduled + slice(0,5); the
//   agenda timestamp is the "EEEE, MMM d • h:mm a" weekday-bullet form
//   + the event DESCRIPTION line; the events query orders DESC.
// - CALENDAR KPIs read the RAW events array; the Date rail is
//   single-valued radio semantics.
// - DIALOGS: the Event submit is BLUE in both modes with the "Update
//   Event" label; the conditional Name field renders when a related
//   type is chosen; the five s15-missed placeholders land; the Activity
//   type select lists five (the WhatsApp preset rides the SUBMIT); the
//   Activity textarea is rows=4; the related selects default "" (the
//   placeholder shows at rest); "Saving..." carries three ASCII dots.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const activitiesPage = () => stripComments(read("src/app/(app)/activities/activities-page.tsx") ?? "");
const calendarPage = () => stripComments(read("src/app/(app)/calendar/calendar-page.tsx") ?? "");
const entityDialogs = () => stripComments(read("src/components/shared/entity-dialogs.tsx") ?? "");
const pageParts = () => stripComments(read("src/components/shared/page-parts.tsx") ?? "");
const pageLayoutSrc = () => stripComments(read("src/lib/page-layout.ts") ?? "");
const constantsSrc = () => stripComments(read("src/lib/constants.ts") ?? "");
const formatSrc = () => stripComments(read("src/lib/format.ts") ?? "");
const eventsRoute = () => stripComments(read("src/app/api/events/route.ts") ?? "");

describe("session-76: the KPI STATICS family (gm/Mx literals)", () => {
  it("the six activities chartData literals + static deltas/subtexts ship as constants", () => {
    const src = pageLayoutSrc();
    const block = src.slice(src.indexOf("ACTIVITY_KPI_STATICS"), src.indexOf("ACTIVITY_KPI_STATICS") + 1400);
    expect(src).toMatch(/ACTIVITY_KPI_STATICS/);
    // Whitespace-insensitive on the arrays (prettier-formatted); the
    // string literals keep their spaces via flexible regexes.
    const compact = block.replace(/\s+/g, "");
    expect(compact).toContain("[60,70,65,80,75,85]");
    expect(compact).toContain("[40,50,45,60,55,50]");
    expect(compact).toContain("[30,40,50,60,70,80]");
    expect(compact).toContain("[50,55,60,65,70,75]");
    expect(compact).toContain("[40,50,55,60,70,65]");
    expect(compact).toContain("[30,35,40,45,50,55]");
    expect(block).toMatch(/delta:\s*"\+23%"/);
    expect(block).toMatch(/sub:\s*"Due now"/);
    expect(block).toMatch(/delta:\s*"2h overdue"/);
    expect(block).toMatch(/sub:\s*"\+7 today"/);
    expect(block).toMatch(/sub:\s*"\+4 today"/);
    expect(block).toMatch(/sub:\s*"\+1h 12m"/);
  });

  it("the activities cards render the statics — the dynamic delta/subtext/bar memos retire", () => {
    const src = activitiesPage();
    expect(src).toMatch(/ACTIVITY_KPI_STATICS/);
    for (const retired of ["todayDelta", "overdueLabel", "emailsToday", "callsToday", "meetingDuration", "barsFor", "allBars"]) {
      expect(src, `${retired} must retire`).not.toContain(retired);
    }
  });

  it("the calendar trend texts are the static +3/+34/+2/+3 literals", () => {
    const src = calendarPage();
    // The four Mx cards render CALENDAR_KPI_STATICS (the +3/+34/+2/+3
    // literals) — never a computed trend.
    expect((src.match(/CALENDAR_KPI_STATICS\./g) ?? []).length).toBe(4);
    expect(src).not.toMatch(/trend=\{trend\(/);
    const layout = pageLayoutSrc();
    const block = layout.slice(layout.indexOf("CALENDAR_KPI_STATICS"), layout.indexOf("CALENDAR_KPI_STATICS") + 300);
    expect(block).toContain('"+3"');
    expect(block).toContain('"+34"');
    expect(block).toContain('"+2"');
  });

  it("the TrendStatCard swaps TrendingDown on the down direction", () => {
    const src = pageParts();
    expect(src).toMatch(/TrendingDown/);
    expect(src).toMatch(/trend === "down"|trendDirection === "down"/);
  });

  it("the stat-card labels are the literal text-gray-600 (gm/Mx contract)", () => {
    const parts = pageParts();
    // BarStatCard's LABEL span (the gm label) — scoped: the KpiCard
    // suffix / IconStatCard / CircleStatCard labels are OTHER families
    // with their own prior pins. Session-90: the window anchored to the
    // next component boundary (the construction mirror grew the body
    // past the old 1200-char window).
    const barStart = parts.indexOf("export function BarStatCard");
    const barBlock = parts.slice(barStart, parts.indexOf("export function", barStart + 30) > 0 ? parts.indexOf("export function", barStart + 30) : barStart + 2600);
    expect(barBlock).toMatch(/text-xs text-gray-600/);
    expect(barBlock).not.toMatch(/<span className="text-xs text-muted">\{label\}/);
    // Session-90 (L-90c3): the Mx label lives in the TrendStatCard
    // component (page-parts), not the calendar page — the construction
    // mirror moved it there.
    const trendBlock = parts.slice(parts.indexOf("export function TrendStatCard"));
    expect(trendBlock).toContain('<div className="text-xs text-gray-600 mt-1">{label}</div>');
  });

  it("the WhatsApp bars are the green color KEY (the gm color map — re-anchored at s90)", () => {
    const src = activitiesPage();
    const block = src.slice(src.indexOf('label="WhatsApp"'), src.indexOf('label="WhatsApp"') + 300);
    // Session-90 (L-90c4): the bars ride the bg-CLASS color map keyed
    // by the reference's own color strings — the CHART_COLORS.green400
    // hex prop retired.
    expect(block).toMatch(/color="green"/);
    expect(block).not.toMatch(/green400/);
    expect(block).not.toMatch(/#22c55e/);
  });
});

describe("session-76: the priority-tab row family (vx)", () => {
  it("the rows are the p-3 hover rounded-lg border-b construction with the initials avatar", () => {
    const src = activitiesPage();
    expect(src).toContain("hover:bg-gray-50 rounded-lg border-b");
    expect(src).toContain("p-3");
    expect(src).toMatch(/w-10 h-10 bg-blue-100/);
    expect(src).toMatch(/text-blue-600 text-sm font-semibold/);
  });

  it("the title is relatedName || Activity with the destructive overdue badge", () => {
    const src = activitiesPage();
    expect(src).toMatch(/a\.relatedName \|\| a\.contact\?\.name \|\| "Activity"/);
    expect(src).toMatch(/variant="destructive"/);
    expect(src).toMatch(/h overdue|d overdue/);
  });

  it("the right side carries the time span + the Check as completed button", () => {
    const src = activitiesPage();
    expect(src).toContain("Check as completed");
    expect(src).toMatch(/text-red-600/);
  });

  it("the retired divide-y/toggle construction is gone", () => {
    const src = activitiesPage();
    expect(src).not.toContain("divide-y");
    expect(src).not.toMatch(/<CheckCircle2/);
    expect(src).not.toMatch(/<Circle /);
  });
});

describe("session-76: the timeline family (Rce)", () => {
  it("the date groups render the long weekday format under the h3", () => {
    const src = activitiesPage();
    expect(src).toMatch(/weekday: "long"/);
    expect(src).toMatch(/text-sm font-semibold text-gray-900 mb-3/);
  });

  it("the items are Card p-4 hover:shadow-md with the tinted icon square", () => {
    const src = activitiesPage();
    expect(src).toContain("hover:shadow-md transition-shadow");
    expect(src).toMatch(/w-10 h-10 rounded-lg/);
    // The tint pairs live in constants (ACTIVITY_TIMELINE_TINT) — the
    // page consumes the map with the gray-terminal fallback.
    expect(src).toMatch(/ACTIVITY_TIMELINE_TINT\[a\.type\] \?\? "bg-gray-100 text-gray-600"/);
    const consts = constantsSrc();
    const block = consts.slice(consts.indexOf("ACTIVITY_TIMELINE_TINT"), consts.indexOf("ACTIVITY_TIMELINE_TINT") + 500);
    expect(block).toContain('"bg-blue-100 text-blue-600"');
    expect(block).toContain('"bg-green-100 text-green-600"');
    expect(block).toContain('"bg-purple-100 text-purple-600"');
    expect(block).toContain('"bg-emerald-100 text-emerald-600"');
    expect(block).toContain('"bg-gray-100 text-gray-600"');
  });

  it("the Related-to line + the avatar/owner/type-badge footer render", () => {
    const src = activitiesPage();
    expect(src).toContain("Related to:");
    expect(src).toMatch(/text-blue-600 hover:underline cursor-pointer/);
    expect(src).toMatch(/w-6 h-6 bg-gray-200/);
  });

  it("the loading line renders while the first fetch is in flight", () => {
    const src = activitiesPage();
    expect(src).toContain("Loading activities...");
    expect(src).toMatch(/text-center py-12 text-gray-500/);
  });

  it("the retired border-l dotted rail construction is gone", () => {
    const src = activitiesPage();
    expect(src).not.toContain("border-l ");
    expect(src).not.toContain("-left-[27px]");
  });
});

describe("session-76: the tabs + rail vocabulary", () => {
  it('the due-today empty label reads "No activities due today"', () => {
    const src = activitiesPage();
    expect(src).toContain('"No activities due today"');
    expect(src).not.toContain("Nothing due today");
  });

  it("the per-tab caps: NO slice on overdue/dueToday, slice(0,5) on upcoming/completed", () => {
    const src = activitiesPage();
    expect(src).not.toContain("slice(0, 8)");
    expect((src.match(/slice\(0, 5\)/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it("the Status select vocabulary is 7days/30days/90days (default 7days)", () => {
    const src = activitiesPage();
    expect(src).toContain('"7days"');
    expect(src).toContain('"30days"');
    expect(src).toContain('"90days"');
    expect(src).not.toContain("Last 24 hours");
    expect(src).not.toContain("All Time");
  });
});

describe("session-76: the activities KPI derivations", () => {
  it("Activities Today buckets by the DUE DATE within the today window", () => {
    const src = activitiesPage();
    expect(src).not.toMatch(/createdAt.*startOfDay|startOfDay.*createdAt/);
    expect(src).toMatch(/dueAt/);
  });

  it("Meetings Scheduled counts ALL meetings (not upcoming-only)", () => {
    const src = activitiesPage();
    // The reference's meetingsScheduled: A.filter(H=>H.type==="Meeting") —
    // no status guard, no window. Our upcomingMeetings memo retires.
    expect(src).not.toContain("upcomingMeetings");
  });

  it("the overdue boundary is startOfToday (not < now)", () => {
    const src = activitiesPage();
    expect(src).not.toMatch(/dueAt\) < now/);
  });
});

describe("session-76: the calendar grid", () => {
  it("TODAY always carries the blue pill — never a white number on a white cell", () => {
    const src = calendarPage();
    // The state chain keys isToday BEFORE inMonth — the pill can never
    // be lost to selection, and the number never goes white on a light bg.
    const chain = src.match(/isToday\s*\?[\s\S]*?:[\s\S]*?inMonth\s*\?/);
    expect(chain, "the isToday-first ternary chain must exist").not.toBeNull();
  });

  it("the grid renders the UNTRIMMED 42 cells", () => {
    const src = calendarPage();
    expect(src).not.toMatch(/Math\.ceil\(\(lead/);
    expect(src).not.toMatch(/weeks \* 7/);
  });

  it("the chip container is the plain space-y-0.5 stack (no mt-auto flex)", () => {
    const src = calendarPage();
    expect(src).not.toContain("mt-auto flex flex-col gap-0.5");
    expect(src).toContain("space-y-0.5");
  });

  it("the page renders through CALENDAR_CELL (the record is the source of truth)", () => {
    const src = calendarPage();
    expect(src).toMatch(/CALENDAR_CELL\./);
  });
});

describe("session-76: the upcoming/agenda pair", () => {
  it("the upcoming derivation is the 7-day window + scheduled + slice(0,5)", () => {
    const src = calendarPage();
    expect(src).toMatch(/86400000 \* 7|addDays\(today, 7\)/);
    expect(src).toMatch(/status === "scheduled"/);
    expect(src).not.toMatch(/slice\(0, 6\)/);
  });

  it("the agenda timestamp is the weekday-bullet format + the description line", () => {
    const src = calendarPage();
    expect(src).toMatch(/formatWeekdayBulletTime/);
    const agenda = src.slice(src.indexOf("Agenda View"), src.indexOf("Agenda View") + 2600);
    expect(agenda).toMatch(/line-clamp-2/);
  });

  it("the events route orders startAt DESC", () => {
    const src = eventsRoute();
    expect(src).toContain('orderBy: { startAt: "desc" }');
  });

  it("formatWeekdayBulletTime renders the EEEE, MMM d • h:mm a shape", async () => {
    const mod = await import("../src/lib/format");
    const f = (mod as unknown as { formatWeekdayBulletTime: (d: Date) => string }).formatWeekdayBulletTime;
    expect(f(new Date(2026, 9, 5, 10, 0))).toBe("Monday, Oct 5 • 10:00 AM");
  });
});

describe("session-76: the calendar KPI basis + the Date rail", () => {
  it("the KPI memo reads the RAW events array (not visible)", () => {
    const src = calendarPage();
    const memo = src.slice(src.indexOf("const todaysEvents"), src.indexOf("const todaysEvents") + 900);
    expect(memo).not.toContain("visible");
    expect(memo).toMatch(/events\./);
  });

  it("the Date rail is single-valued (radio semantics)", () => {
    const src = calendarPage();
    // The dateRange is ONE value or null — the onCheckedChange writes
    // setDateRange(v ? d.id : null), never an accumulation into the
    // filters record; Clear All resets it.
    expect(src).toMatch(/setDateRange\(v \? d\.id : null\)/);
    expect(src).toMatch(/dateRange === d\.id/);
    expect(src).not.toMatch(/onCheckedChange=\{\(v\) => setFilters\(\(f\) => \(\{ \.\.\.f, \[d\.id\]: v \}\)\)\}\)/);
  });
});

describe("session-76: the dialog family (SAe/Mce)", () => {
  it("the Event submit is BLUE in both modes with the Update Event label", () => {
    const src = entityDialogs();
    const block = src.slice(src.indexOf("ev-end"), src.indexOf("ev-end") + 2200);
    expect(block).toMatch(/className=\{EVENT_DIALOG\.submit\}/);
    expect(block).toContain('"Update Event"');
    expect(block).not.toContain("DIALOG_SUBMIT.button");
  });

  it("the conditional Name field renders when a related type is chosen", () => {
    const src = entityDialogs();
    expect(src).toMatch(/Enter \$\{/);
    expect(src).toMatch(/relatedType && |relatedType\)/);
  });

  it("the five s15-missed placeholders land", () => {
    const src = entityDialogs();
    expect(src).toContain('"Enter location or meeting link"');
    expect(src).toContain('"Select type"');
    expect(src).toContain('"Enter activity details..."');
    expect(src).toContain('"e.g., John Doe"');
  });

  it("the Activity type select lists five (no whatsapp) — the preset rides the submit", () => {
    const src = entityDialogs();
    const block = src.slice(src.indexOf("ACTIVITY_DIALOG_TYPES"), src.indexOf("ACTIVITY_DIALOG_TYPES") + 600);
    expect(block).not.toMatch(/ACTIVITY_TYPES\.map/);
    // The reference's `type: i || N.type` — the preset wins at submit in
    // create mode; the edit mode keeps the form's own type.
    expect(src).toMatch(/type: activity \? form\.type : \(defaultType \|\| form\.type\)/);
    const consts = constantsSrc();
    expect(consts).toMatch(/ACTIVITY_DIALOG_TYPES = \["call", "email", "meeting", "task", "note"\]/);
  });

  it("the Activity Description textarea is rows=4", () => {
    const src = entityDialogs();
    const block = src.slice(src.indexOf("Enter activity details..."), src.indexOf("Enter activity details...") - 300);
    expect(block + src.slice(src.indexOf("Enter activity details..."), src.indexOf("Enter activity details...") + 200)).toMatch(/rows=\{4\}|rows="4"/);
  });

  it("the related selects default empty (the placeholder shows at rest)", () => {
    const src = entityDialogs();
    // The reference's initial related_to_type is "" — the "Select type"
    // placeholder shows at rest; ours preselected "none"/"contact".
    expect(src).not.toMatch(/relatedType: (event\?\.relatedType )?\?\? "none"/);
    expect(src).not.toMatch(/relatedType: (activity\?\.relatedType )?\?\? "contact"/);
  });

  it('"Saving..." carries three ASCII dots (no ellipsis character)', () => {
    const src = entityDialogs();
    expect(src).not.toContain("Saving…");
    expect(src).toContain('"Saving..."');
  });
});

describe("session-76: the hygiene pair", () => {
  it("the dead green field retires from QUICK_LOG", () => {
    const src = activitiesPage();
    expect(src).not.toContain("green: true");
  });

  it("the by-type footer wraps its children in the inner flex row", () => {
    const layout = pageLayoutSrc();
    const block = layout.slice(layout.indexOf("BY_TYPE_CARD"), layout.indexOf("BY_TYPE_CARD") + 900);
    // The reference: div.mt-4.pt-4.border-t > div.flex.items-center.gap-2 >
    // [checkbox, label, ml-auto dots] — the ml-auto is inert without the
    // inner row. Pinned on the footerRow FIELD (the chip row also carries
    // "flex items-center gap-2" — a bare substring match false-positives).
    expect(block).toMatch(/footerRow: "flex items-center gap-2"/);
  });
});

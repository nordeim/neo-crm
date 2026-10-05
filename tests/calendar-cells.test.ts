import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-27 pins (S27-P11): the calendar day-cell + chip + rail-row
// contracts — the s45 "Next" pointer, unprobeable for 22 sessions at the
// reference's zero data (no day ever carried an event chip). The bundle's
// calendar component gave up the full contract:
//
//   day number:  text-xs sm:text-sm font-medium mb-1 (+ text-white when
//                today) — a PLAIN TEXT, no circle/pill
//   event chip:  text-xs px-1 py-0.5 rounded truncate cursor-pointer with
//                the type TINT classes (bg-*-100 text-*-800) + a solid
//                w-1.5 h-1.5 rounded-full mr-1 bg-*-600 DOT + the title
//                ONLY (no time prefix) + onClick → the EDIT dialog + the
//                title attr; on today bg-white/20 text-white + bg-white dot
//   "+N more":   a separate line AFTER the chips — text-xs
//                text-gray-500 (text-white on today), reading "+N more"
//   type map:    meeting blue / call green / demo purple / task orange /
//                reminder yellow / appointment cyan (100/800/600 triples)
//   upcoming:    flex items-center gap-3 p-3 border rounded-lg
//                hover:bg-gray-50 rows with a TALL w-2 h-12 rounded-full
//                bar + title (font-medium text-gray-900 truncate) +
//                "MMM d, h:mm a" (text-sm text-gray-600) + related line +
//                THREE ghost icon buttons (edit + phone-on-call + more)
//   agenda:      flex items-start gap-3 p-3 border rounded-lg
//                hover:bg-gray-50 rows with a 40x40 w-10 h-10 rounded-lg
//                TINTED square + inner w-2 h-2 dot + title; the list is
//                the FILTERED events slice(0,10) (search + type + date
//                filters — NOT a selected-day list); Edit/Delete via the
//                ••• dropdown

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/calendar/calendar-page.tsx") ?? "");
const constants = () => stripComments(read("src/lib/constants.ts") ?? "");

describe("session-27: the calendar chip tint map (EVENT_TYPE_CHIP)", () => {
  it("the map carries the six type triples (bg-100 / text-800 / dot-600)", () => {
    const src = constants();
    const block = src.slice(src.indexOf("EVENT_TYPE_CHIP"), src.indexOf("EVENT_TYPE_CHIP") + 900);
    expect(src).toMatch(/EVENT_TYPE_CHIP/);
    for (const triple of [
      'bg-blue-100',
      'text-blue-800',
      'bg-blue-600',
      'bg-green-100',
      'text-green-800',
      'bg-green-600',
      'bg-purple-100',
      'text-purple-800',
      'bg-purple-600',
      'bg-orange-100',
      'text-orange-800',
      'bg-orange-600',
      'bg-yellow-100',
      'text-yellow-800',
      'bg-yellow-600',
      'bg-cyan-100',
      'text-cyan-800',
      'bg-cyan-600',
    ]) {
      expect(block).toContain(triple);
    }
  });
});

describe("session-27: the day-cell contract", () => {
  it("the day number is PLAIN TEXT (text-xs sm:text-sm font-medium mb-1) — no circle/pill", () => {
    const src = page();
    const region = src.slice(src.indexOf("monthGrid"), src.indexOf("monthGrid") + 3600);
    expect(region).toMatch(/text-xs sm:text-sm font-medium mb-1/);
    // the scaffold's circle pill (h-6 w-6 rounded-full on the NUMBER) is retired
    expect(region).not.toMatch(/h-6 w-6/);
  });

  it("the event chips carry the tint classes + the dot span + title only (no time prefix)", () => {
    const src = page();
    const region = src.slice(src.indexOf("monthGrid"), src.indexOf("monthGrid") + 3200);
    expect(region).toMatch(/EVENT_TYPE_CHIP/);
    expect(region).toMatch(/rounded-full mr-1/);
    expect(region).not.toMatch(/formatTime\(e\.startAt\)/);
  });

  it("the chips are CLICKABLE (cursor-pointer + onClick → the edit dialog) with the title attr", () => {
    const src = page();
    const region = src.slice(src.indexOf("monthGrid"), src.indexOf("monthGrid") + 3200);
    expect(region).toMatch(/cursor-pointer/);
    expect(region).toMatch(/setEditing\(e\)/);
  });

  it("the today variant renders bg-white/20 text-white chips with a bg-white dot", () => {
    const src = page();
    const region = src.slice(src.indexOf("monthGrid"), src.indexOf("monthGrid") + 3200);
    expect(region).toMatch(/bg-white\/20/);
  });

  it("'+N more' is a separate line AFTER the chips reading '+N more' (not an inline +N)", () => {
    const src = page();
    const region = src.slice(src.indexOf("monthGrid"), src.indexOf("monthGrid") + 3600);
    expect(region).toMatch(/\+.*more/);
    expect(region).not.toMatch(/text-\[10px\]/);
  });

  it("the max-2 chips slice is kept", () => {
    const src = page();
    const region = src.slice(src.indexOf("monthGrid"), src.indexOf("monthGrid") + 3200);
    expect(region).toMatch(/slice\(0, 2\)/);
  });
});

describe("session-27: the Upcoming Events rail rows", () => {
  it("the rows are the p-3 border hover family with the TALL w-2 h-12 bar", () => {
    const src = page();
    const region = src.slice(src.indexOf("Upcoming Events"), src.indexOf("Upcoming Events") + 2600);
    expect(region).toMatch(/p-3 border rounded-lg/);
    expect(region).toMatch(/w-2 h-12 rounded-full/);
  });

  it("the row text is the reference's 'MMM d, h:mm a' format (the formatMonthDayTime helper) + the related line", () => {
    const src = page();
    const region = src.slice(src.indexOf("Upcoming Events"), src.indexOf("Upcoming Events") + 3000);
    expect(region).toMatch(/formatMonthDayTime/);
  });

  it("formatMonthDayTime renders the date-fns 'MMM d, h:mm a' output shape", async () => {
    const fmt = await import("../src/lib/format");
    // Oct 5, 2026 10:00 AM → "Oct 5, 10:00 AM" (the reference's upcoming-row timestamp)
    expect(fmt.formatMonthDayTime(new Date(2026, 9, 5, 10, 0))).toBe("Oct 5, 10:00 AM");
    expect(fmt.formatMonthDayTime(new Date(2026, 0, 31, 14, 5))).toBe("Jan 31, 2:05 PM");
    expect(fmt.formatMonthDayTime(new Date(2026, 11, 24, 0, 0))).toBe("Dec 24, 12:00 AM");
    expect(fmt.formatMonthDayTime(null)).toBe("—");
  });

  it("the rows carry the ghost icon actions (the edit button opens the dialog)", () => {
    const src = page();
    const region = src.slice(src.indexOf("Upcoming Events"), src.indexOf("Upcoming Events") + 3000);
    expect(region).toMatch(/setEditing\(e\)/);
  });
});

describe("session-27: the Agenda View rows (the filtered-events list)", () => {
  it("the rows carry the 40x40 tinted square with the inner dot", () => {
    const src = page();
    const region = src.slice(src.indexOf("Agenda View"), src.indexOf("Agenda View") + 2800);
    expect(region).toMatch(/w-10 h-10 rounded-lg/);
    expect(region).toMatch(/w-2 h-2 rounded-full/);
  });

  it("the agenda list is the FILTERED events slice(0,10) — not the selected-day list", () => {
    const src = page();
    const region = src.slice(src.indexOf("Agenda View"), src.indexOf("Agenda View") + 3000);
    expect(region).toMatch(/slice\(0, 10\)/);
    expect(src).not.toMatch(/dayAgenda/);
  });

  it("the agenda Edit/Delete live in the ••• dropdown (not inline buttons)", () => {
    const src = page();
    const region = src.slice(src.indexOf("Agenda View"), src.indexOf("Agenda View") + 3200);
    expect(region).toMatch(/DropdownContent/);
    expect(region).toMatch(/DropdownItem/);
  });
});

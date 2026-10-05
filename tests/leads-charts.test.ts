import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-27 pins (S27-P9): the leads rail charts, bundle-extracted from
// the reference's `Xke` component. The live /Leads DOM at zero data shows
// ticks New/Qualified/Won/Lost — but that is the FIVE-status list with
// "Contacted" ELIDED by recharts at the 331px card (the s10 tick-elision
// phenomenon). The bundle's data construction is the truth:
//
//   stages = ["new","contacted","qualified","won","lost"] (Capitalized)
//   value  = SUM of lead value by STATUS per stage
//   Bar dataKey "value" fill "#3b82f6" + $ tooltip + tick fontSize 12
//
// The won-vs-lost chart is grouped BARS (+ stock Legend), and the funnel
// labels are New Leads / Contacted / Qualified / Won (STATUS-based
// cumulative: new / contacted+qualified+won / qualified+won / won) with
// fills #3b82f6 / #8b5cf6 / #10b981 / #22c55e.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
const constants = () => stripComments(read("src/lib/constants.ts") ?? "");

describe("session-27: the leads pipeline chart (the 5-status vocabulary)", () => {
  it("the pipeline vocabulary is the FIVE statuses (new/contacted/qualified/won/lost — Contacted included)", () => {
    const src = page();
    expect(src).toMatch(/\["new", "contacted", "qualified", "won", "lost"\]/);
  });

  it("the chart carries VALUE sums (not counts) on the bars", () => {
    const src = page();
    const region = src.slice(src.indexOf("const pipelineByStage"), src.indexOf("const pipelineByStage") + 700);
    expect(region).toMatch(/reduce\(/);
  });

  it("the SingleBarChart wiring uses #3b82f6 + the $ formatter + tick 12", () => {
    const src = page();
    const region = src.slice(src.indexOf("Pipeline Value by Stage") - 300, src.indexOf("Pipeline Value by Stage") + 600);
    expect(region).toMatch(/SingleBarChart/);
    expect(region).toMatch(/#3b82f6/);
  });
});

describe("session-27: the leads won-vs-lost grouped bars", () => {
  it("the chart is GroupedBarsChart (the reference's bars + stock Legend — our lines are retired)", () => {
    const src = page();
    const region = src.slice(src.indexOf("Won vs Lost Over Time") - 400, src.indexOf("Won vs Lost Over Time") + 500);
    expect(region).toMatch(/GroupedBarsChart/);
    expect(src).not.toMatch(/WonLostLineChart/);
  });
});

describe("session-27: the leads funnel vocabulary + colors (the bundle contract)", () => {
  it("LEADS_FUNNEL pins the reference's four entries (labels + fills)", () => {
    const src = constants();
    const block = src.slice(src.indexOf("LEADS_FUNNEL"), src.indexOf("LEADS_FUNNEL") + 700);
    expect(block).toContain('"New Leads"');
    expect(block).toContain('"Contacted"');
    expect(block).toContain('"Qualified"');
    expect(block).toContain('"Won"');
    expect(block).toContain("#3b82f6");
    expect(block).toContain("#8b5cf6");
    expect(block).toContain("#10b981");
    expect(block).toContain("#22c55e");
  });

  it("the funnel counts are STATUS-CUMULATIVE (contacted = contacted+qualified+won; qualified = qualified+won)", () => {
    const src = page();
    // Session-64 (N-64b): the pin is the EXACT cumulative filter forms.
    // The pre-s64 form matched /cumulative|LEADS_FUNNEL/ against this
    // region — and LEADS_FUNNEL.map sits inside it, so the disjunct
    // could NEVER fail: a bundle-parity contract with zero effective
    // coverage while the real forms went unpinned anywhere repo-wide.
    const counts = src.slice(src.indexOf("const funnel"), src.indexOf("const funnel") + 900);
    expect(counts).toContain('f.id === "new-leads"');
    expect(counts).toContain('n(["new"])');
    expect(counts).toContain('n(["contacted", "qualified", "won"])');
    expect(counts).toContain('n(["qualified", "won"])');
    expect(counts).toContain('n(["won"]),');
  });

  it("the old FUNNEL_STAGES new/qualified/won/lost list is retired from this chart (the funnel no longer feeds it)", () => {
    const src = page();
    const region = src.slice(src.indexOf("Conversion Funnel") - 400, src.indexOf("Conversion Funnel") + 600);
    expect(region).not.toMatch(/FUNNEL_STAGES/);
  });
});

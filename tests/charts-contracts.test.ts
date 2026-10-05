import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-13 chart contracts (S13-P8), DOM-verified on the live reference
// on 2026-09-30: EVERY gridded reference chart renders
// stroke-dasharray="3 3" #ccc — dashboard (Sales Pipeline 11 lines,
// Revenue 12), reports tab-1 (Revenue 4, Won vs Lost 4, Pipeline 4,
// funnel 15), leads (Pipeline 10, Won vs Lost 4). Ours rendered SOLID
// grids everywhere: the session-10 comment "the CartesianGrid at the
// default DASHED 3 3" was a misreading of the recharts default (it is
// SOLID — the reference passes the dash explicitly). And the reference's
// reports tab-1 "Conversion Funnel" is a HORIZONTAL BAR CHART (534x300,
// dashed grid, numeric XAxis 0-4, category YAxis with the EIGHT raw
// slugs new/contacted/qualified/prospecting/qualification/proposal/
// negotiation/closed_won — built inline by pipelineStageCounts in
// src/lib/reports-data.ts; the s54 sweep retired the old
// REPORTS_PIPELINE_SLUGS export this header used to cite), not the
// recharts FunnelChart we shipped.

const src = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/charts/charts.tsx"),
  "utf8",
);

describe("session-13: CartesianGrid dashes (S13-P8a)", () => {
  it("every CartesianGrid in charts.tsx carries strokeDasharray 3 3", () => {
    const grids = src.match(/<CartesianGrid[^>]*>/g) ?? [];
    expect(grids.length).toBeGreaterThanOrEqual(4);
    for (const g of grids) {
      expect(g).toContain('strokeDasharray="3 3"');
    }
  });
});

describe("session-13/27: reports funnel is a horizontal bar chart (S13-P8b, re-pinned S27-P3)", () => {
  // Session-27: the FunnelBarChart was superseded by the parameterized
  // HorizontalBarChart family — the funnel mounts it with the bundle-
  // extracted config (SINGLE cyan #06b6d4 fill, stage YAxis width 100,
  // no radius/maxBarSize/Cells). The s13 intent (horizontal bars over
  // the 8 slugs, never a trapezoid funnel, on reports) is preserved.
  it("exports the HorizontalBarChart family with a vertical layout", () => {
    expect(src).toContain("export function HorizontalBarChart");
    const m = src.match(/export function HorizontalBarChart[\s\S]{0,1600}?<\/ResponsiveContainer>/);
    expect(m).toBeTruthy();
    expect(m![0]).toContain('layout="vertical"');
  });

  it("the family grid is dashed and its axes are numeric X + category Y with the yWidth prop", () => {
    const m = src.match(/export function HorizontalBarChart[\s\S]{0,1600}?<\/ResponsiveContainer>/);
    expect(m).toBeTruthy();
    expect(m![0]).toContain('strokeDasharray="3 3"');
    expect(m![0]).toMatch(/<XAxis[^>]*type="number"/);
    expect(m![0]).toMatch(/<YAxis[^>]*type="category"[^>]*width=\{yWidth\}/);
  });

  it("the reports tab-1 card mounts the horizontal bar family, not the trapezoid funnel", () => {
    const reports = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/(app)/reports/reports-page.tsx"),
      "utf8",
    );
    expect(reports).toContain("<HorizontalBarChart");
    // The trapezoid ConversionFunnel may remain for the leads page
    // (the reference's leads funnel renders NOTHING at zero data —
    // unverifiable, documented inference) but must NOT mount on reports.
    const reportsFunnel = reports.match(/<ConversionFunnel/g);
    expect(reportsFunnel ?? []).toHaveLength(0);
  });
});

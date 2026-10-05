import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-68 pins (N-68a + N-68b): the stat-card VALUE typography + the
// reports currency call-sites. The s13 KPI-value decoration sweep
// (S13-P9) proved the leading-none/tracking-tight trio a REAL computed
// diff (line-height 30 vs 36px, letter-spacing -0.75px) but fixed only
// KpiCard/KPI_VALUE. The bundle (byte-stable since, re-fetched fresh
// for this pin set) renders the KPI-value forms BARE at every surface:
// `text-2xl sm:text-3xl font-bold` x15, `text-3xl font-bold` x4,
// `text-2xl font-bold` x10 — leading-none/tracking-tight appear ONLY
// on the Label/DialogTitle/CardTitle primitives, never on a KPI value.
//
// The currency half (N-68b): the reference's reports Won/Lost KPIs are
// ALWAYS /1e3 — `value: `${count} $${(value/1e3).toFixed(1)}K`` and
// `subtitle: `$${(value/1e3).toFixed(0)}K`` — exactly our scale:"k"
// path (the S32-P1 literal-formula family). The reports consumers
// passed { upper } WITHOUT scale, so $950 rendered "$950.0K" (a 1000x
// misread) through the legacy magnitude branching's sub-1000 window.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const parts = () => stripComments(read("src/components/shared/page-parts.tsx") ?? "");
const reports = () => stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");

describe("session-68: the stat-card value typography (N-68a — the s13 sweep completed)", () => {
  it("BarStatCard renders the bare responsive KPI-value form", () => {
    expect(parts()).toContain('<p className="text-2xl sm:text-3xl font-bold">{value}</p>');
  });

  it("IconStatCard (contacts) renders the bare text-3xl form", () => {
    expect(parts()).toContain('<p className="mb-2 mt-2 text-3xl font-bold">{value}</p>');
  });

  it("CircleStatCard (reports) renders the bare text-2xl form", () => {
    expect(parts()).toContain(
      '<p className="flex flex-wrap items-baseline gap-1.5 text-2xl font-bold">',
    );
  });

  it("no stat VALUE carries the retired decoration trio anywhere in page-parts", () => {
    // The s13-proved scaffold-era decorations: leading-none,
    // tracking-tight, leading-tight, text-foreground on VALUE <p>s.
    // (Comments are stripped, so the s13 record comment cannot satisfy
    // the absence read — the needle-in-own-docs class avoided.)
    expect(parts()).not.toContain("leading-none tracking-tight text-foreground");
    expect(parts()).not.toContain("leading-tight text-foreground");
  });
});

describe("session-68: the reports Won/Lost fixed-scale (N-68b — the reference's literal /1e3)", () => {
  it("the Won KPI passes scale k (upper K, one decimal)", () => {
    expect(reports()).toContain('formatCompactCurrency(k?.wonValue ?? 0, { scale: "k", upper: true })');
  });

  it("the Lost KPI passes scale k (upper K, zero decimals)", () => {
    expect(reports()).toContain(
      'formatCompactCurrency(k?.lostValue ?? 0, { scale: "k", upper: true, decimals: 0 })',
    );
  });
});

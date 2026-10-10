import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-68 pins (N-68a + N-68b): the stat-card VALUE typography + the
// reports currency call-sites. The s13 KPI-value decoration sweep
// (S13-P9) proved the leading-none/tracking-tight trio a REAL computed
// diff (line-height 30 vs 36px, letter-spacing -0.75px) but fixed only
// KpiCard/KPI_VALUE. The bundle (byte-stable since, re-fetched fresh
// for this pin set) renders the KPI-value forms with NO extra
// decoration at any surface — two BARE families (dashboard
// `text-2xl sm:text-3xl font-bold`, activities/accounts
// `text-2xl sm:text-3xl font-bold` over the gm/zv arms) + FOUR
// explicit-gray-900 surfaces (the SHARED contacts/leads IconStatCard
// arm `text-xl sm:text-2xl font-bold text-gray-900` + the calendar Mx
// + the reports ay — the s75/s88/s89/s90 mirrors;
// leading-none/tracking-tight appear ONLY on the
// Label/DialogTitle/CardTitle primitives, never on a KPI value.
// Session-91 (G-91a1): the header's old "BARE at every surface" census
// pre-dated the s89/s90 explicit-gray-900 mirrors. Session-92
// (F-92a2): the G-91a1 re-derivation itself miscounted — it listed
// the leads arm in BOTH lists ("three BARE" counting the leads
// `text-xl sm:text-2xl font-bold` + "the leads Sm arm" among the
// explicit four) under a phantom leads-contacts label that exists
// nowhere else; the file's own :108-110 pin holds the leads
// value EXPLICIT (the s89 Sm mirror) — the leads arm belongs to the
// IconStatCard family ONCE, explicit. Re-derived: 2 bare + 4
// explicit.
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

describe("session-70: the TrendStatCard value (F-70a1 — re-anchored at s90)", () => {
  it("the calendar value carries the EXPLICIT gray-900 — the s70 bare-form premise LIVE-disproven", () => {
    // The 70-a re-audit's find re-derived at s90 (M-90c1, LIVE-probed on
    // BOTH apps): the reference's Mx value is `text-2xl font-bold
    // text-gray-900` — computed rgb(17,24,39) on the reference where our
    // bare inherited form computed the page ink rgb(10,10,10). The s70
    // pin's own comment CITED the gray-900 + its LIVE color and then
    // shipped the bare form on the FALSE premise "the color carried by
    // the inherited card foreground" — the M-89c1 misdecode genus on
    // the calendar arm. The STAT_CARD.value token retired with the
    // construction mirror (the class now inlines in the component).
    expect(parts()).toContain('<div className="text-2xl font-bold text-gray-900">{value}</div>');
    expect(parts()).not.toContain('<div className="text-2xl font-bold">{value}</div>');
    expect(parts()).not.toContain("text-2xl font-bold text-foreground");
  });
});

describe("session-68: the stat-card value typography (N-68a — the s13 sweep completed)", () => {
  it("BarStatCard renders the bare responsive KPI-value form on a DIV (the gm/zv tag)", () => {
    // Session-90 (L-90c8): the reference's gm/zv render the value on a
    // DIV (the bare responsive form — rgb(10,10,10) on BOTH apps, the
    // dashboard/activities/accounts bare family).
    expect(parts()).toContain('<div className="text-2xl sm:text-3xl font-bold">{value}</div>');
  });

  it("IconStatCard (contacts) renders the explicit gray-900 text-3xl form", () => {
    // Session-75 (L-75c2-7, bundle-decoded — the reference's Rx
    // component): the contacts value carries the explicit gray-900 +
    // mb-2 (the s68 bare-form census predated the Rx decode; the
    // decoration trio stays retired — no leading-none/tracking-tight).
    expect(parts()).toContain('<p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>');
  });

  it("CircleStatCard (reports) renders the explicit gray-900 text-2xl form (M-90c2)", () => {
    // Session-74 (L-74c15) pinned the plain-div form but left the value
    // BARE — its own comment cited the reference's `text-2xl font-bold
    // text-gray-900`. Session-90 (M-90c2, LIVE-probed on BOTH apps): the
    // gray-900 landed — computed rgb(17,24,39) on the reference where
    // our bare form computed rgb(10,10,10) — the M-89c1 misdecode genus
    // on the reports arm.
    expect(parts()).toContain('<div className="text-2xl font-bold text-gray-900">{value}</div>');
    expect(parts()).not.toContain("flex flex-wrap items-baseline gap-1.5");
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

describe("session-69: the leads-variant stat value (F-69a1 — the s68 sweep's survivor)", () => {
  it("IconStatCard (leads) renders the gray-900 responsive form — no text-foreground", () => {
    // The 69-a re-audit's find: the leads variant kept `text-xl
    // font-bold text-foreground sm:text-2xl` — retired at s69. Session-89
    // (M-89c1, LIVE-probed on BOTH apps): the reference's leads values
    // carry the EXPLICIT `text-gray-900` — rgb(17,24,39) on the
    // reference where our bare inherited form computed the page ink
    // rgb(10,10,10) — the s69 note's own bundle citation finally
    // landed (the DASHBOARD values stay bare — rgb(10,10,10) on both
    // apps; the gray-900 class is the leads Sm family's own).
    expect(parts()).toContain(
      '<span className="text-xl sm:text-2xl font-bold text-gray-900">{value}</span>',
    );
    // the pre-fix form is gone (both the exact string and the broader
    // class-order shape)
    expect(parts()).not.toContain("text-xl font-bold text-foreground sm:text-2xl");
    expect(parts()).not.toContain("text-foreground sm:text-2xl");
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

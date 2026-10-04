import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-46 pins (S46-P5): the dead-code hygiene pair — the N-46d +
// N-46g audit notes. (1) accounts-page destructured the `leads` slice
// and never used it (exactly one occurrence in the file: the
// destructure itself). (2) activities-page's todayCount/yesterdayCount
// filters carried the dead `?? a.createdAt` tail —
// `a.createdAt ?? a.dueAt ?? a.createdAt` — the s42 dead-?? class: the
// trailing arm can only return the already-known-nullish createdAt
// (if createdAt were non-null the FIRST arm already returned), so the
// tail is unreachable-non-null by construction.
//
// Session-53 pins (S53-P3/P4, N-53c/N-53d): the orphaned-import
// retirement + the never-caching memo. (3) the 53-b fresh-eyes census
// found 8 imports whose only in-file reference is the import itself
// (calendar-page ×7 + leads-page ×1 — an s27 cleanup miss), and retiring
// the calendar's EVENT_STATUS_META import leaves that constant fully
// src-dead (the s48 CONTACT_SOURCES / s49 LEAD_SOURCES precedent).
// (4) the leads-page wonVsLost useMemo never cached — deps [won, lost]
// are fresh filtered identities every render — so it is retired to the
// plain-call sibling idiom (pipelineByStage computes plainly).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const accounts = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const activities = () => stripComments(read("src/app/(app)/activities/activities-page.tsx") ?? "");
const calendar = () => stripComments(read("src/app/(app)/calendar/calendar-page.tsx") ?? "");
const leads = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
const constants = () => stripComments(read("src/lib/constants.ts") ?? "");

describe("session-46: the dead-code hygiene pair (S46-P5)", () => {
  it("accounts-page no longer destructures the unused leads slice", () => {
    // The whole (comment-stripped) file is leads-free — the slice was
    // dead weight in the selector. A future legit use must retire this
    // pin deliberately.
    expect(accounts()).not.toMatch(/\bleads\b/);
  });

  it("activities-page drops the dead ?? a.createdAt tail at BOTH count filters", () => {
    const src = activities();
    // The dead triple-chain is gone…
    expect(src).not.toMatch(/a\.createdAt\s*\?\?\s*a\.dueAt\s*\?\?\s*a\.createdAt/);
    // …and the live two-arm form appears exactly twice (todayCount +
    // yesterdayCount).
    const live = src.match(/a\.createdAt\s*\?\?\s*a\.dueAt/g) ?? [];
    expect(live.length).toBe(2);
  });
});

describe("session-53: the orphaned-import retirement + the never-caching memo (S53-P3/P4)", () => {
  it("calendar-page carries none of the seven orphaned imports (N-53c)", () => {
    const src = calendar();
    // Each of these had exactly one in-file reference — the import
    // itself (the s27 cleanup miss; the 53-b fresh-eyes census).
    expect(src).not.toMatch(/\bClock\b/);
    expect(src).not.toMatch(/\bBadge\b/);
    expect(src).not.toMatch(/\bEVENT_TYPE_META\b/);
    expect(src).not.toMatch(/\bEVENT_STATUS_META\b/);
    expect(src).not.toMatch(/\bformatTime\b/);
    expect(src).not.toMatch(/\btimeUntil\b/);
    expect(src).not.toMatch(/\bEMPTY_STATE\b/);
    // …while the LIVE chip map stays (the event chips render through it).
    expect(src).toMatch(/\bEVENT_TYPE_CHIP\b/);
  });

  it("leads-page no longer imports CHART_COLORS (the reports page owns it)", () => {
    expect(leads()).not.toMatch(/\bCHART_COLORS\b/);
  });

  it("constants: the src-dead EVENT_STATUS_META is retired (the s48/s49 precedent)", () => {
    // Zero src consumers once the calendar import went; zero test pins
    // ever referenced it. A record comment may remain (comment-stripped
    // source is asserted).
    expect(constants()).not.toMatch(/\bEVENT_STATUS_META\b/);
  });

  it("the wonVsLost computation is a plain module-scope call — the never-caching useMemo retired (N-53d)", () => {
    const src = leads();
    // The memo form (deps [won, lost] — fresh identities every render,
    // so it never cached) is gone…
    expect(src).not.toMatch(/const wonVsLost = React\.useMemo/);
    // …replaced by the sibling idiom: a module-scope pure function
    // called plainly (pipelineByStage computes plainly too).
    expect(src).toMatch(/function buildWonVsLost\(won: Lead\[\], lost: Lead\[\]\)/);
    expect(src).toMatch(/const wonVsLost = buildWonVsLost\(won, lost\)/);
  });
});

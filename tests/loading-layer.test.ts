import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-25 loading-state pins (S25-P1): the reference ships ZERO
// loading UI — live-verified on 2026-10-01 three independent ways:
// (a) with its Lead entity fetch network-ABORTED the full /Leads page
// renders immediately (h1, KPI cards showing 0, the empty table row —
// even "Hi, Guest" when the user fetch fails too) — its empty state IS
// its loading state; (b) a broad MutationObserver installed BEFORE the
// SPA navigations reads ZERO pulse/skeleton/spinner/progress elements
// across Dashboard → Reports → Leads; (c) its 1.6MB bundle's stylesheet
// carries no skeleton vocabulary. Our clone shipped FIVE skeleton
// families (dashboard 6× h-[118px] KPI from FIRST paint — the `!k`
// condition; leads/accounts/contacts 5× h-12 rows; contacts 4× h-24
// cards; reports 5× KPI + 4× h-64 ReportSkeletons) that flash during
// the fetch window (caught live with a 4s-delayed-API init script).
// The retirement follows the session-10 ChartEmpty precedent: the
// reference renders real content in its persistent zero-data state —
// and in its transitory loading state too. It also removes the
// documented e2e "reports skeleton race" flake family.
//
// These tests parse the component/page/store sources so the contract
// is pinned at the unit layer without a browser; the no-skeleton
// first-paint behavior is additionally pinned by the e2e loading-layer
// check (tests/e2e/crm.spec.ts).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

// Source pins read RULES, not documentation: strip comments first (the
// s21/s22 own-doc-comment hazard — the retirement notes themselves name
// the retired constructs).
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const PAGES = [
  "src/app/(app)/page.tsx",
  "src/app/(app)/leads/leads-page.tsx",
  "src/app/(app)/accounts/accounts-page.tsx",
  "src/app/(app)/contacts/contacts-page.tsx",
  "src/app/(app)/reports/reports-page.tsx",
  "src/app/(app)/calendar/calendar-page.tsx",
  "src/app/(app)/activities/activities-page.tsx",
  "src/app/(app)/settings/settings-page.tsx",
  "src/app/(app)/profile/profile-page.tsx",
];

describe("session-25: zero loading UI — the reference's instant-render model (S25-P1)", () => {
  it("no page imports the Skeleton component", () => {
    for (const p of PAGES) {
      const src = read(p);
      expect(src, `${p} must exist`).not.toBeNull();
      const code = stripComments(src!);
      expect(code, `${p} must not import Skeleton`).not.toMatch(
        /import\s*\{[^}]*Skeleton[^}]*\}\s*from\s*"@\/components\/ui\/misc"/,
      );
    }
  });

  it("zero animate-pulse strings anywhere in src/", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
          const code = stripComments(readFileSync(full, "utf8"));
          if (code.includes("animate-pulse")) offenders.push(path.relative(process.cwd(), full));
        }
      }
    };
    walk(path.resolve(import.meta.dirname, "..", "src"));
    expect(offenders).toEqual([]);
  });

  it("the misc.tsx module itself is retired (session-56)", () => {
    // The module's sole export (EmptyState) was src-dead since session-25
    // stranded it — zero src consumers. The strongest form of the
    // no-Skeleton contract: the whole app-authored grab-bag module is
    // GONE (a module that does not exist can export neither Skeleton
    // nor anything else). The vendored stock primitives in ui/ are NOT
    // affected — misc.tsx was app-authored, not stock.
    const misc = read("src/components/ui/misc.tsx");
    expect(misc).toBeNull();
  });

  it("the dashboard renders KPI cards when k is null (no !k skeleton branch)", () => {
    const src = read("src/app/(app)/page.tsx");
    const code = stripComments(src!);
    // The `!k ? skeletons : cards` ternary is retired — the cards render
    // unconditionally with null-safe values (the reports page's existing
    // `k?.totalLeads ?? 0` pattern).
    expect(code).not.toMatch(/\{\s*!k\s*\?/);
    expect(code).not.toMatch(/h-\[118px\]/);
    expect(code).not.toMatch(/length:\s*6/);
    // Null-safe value reads: the reference renders literal 0s while the
    // dashboard slice is still null.
    expect(code).toMatch(/k\?\.(totalLeads|avgSalesCycleDays)/);
  });

  it("the leads/accounts/contacts tables render the empty state directly (no loadingFlags branch)", () => {
    for (const p of [
      "src/app/(app)/leads/leads-page.tsx",
      "src/app/(app)/accounts/accounts-page.tsx",
      "src/app/(app)/contacts/contacts-page.tsx",
    ]) {
      const code = stripComments(read(p)!);
      expect(code, `${p} must not reference loadingFlags`).not.toMatch(/loadingFlags/);
      // The reference's model: the empty-state row IS the loading state.
      expect(code).toMatch(/No (leads|accounts|contacts) found/);
    }
  });

  it("the contacts cards view has no skeleton branch", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    expect(code).not.toMatch(/h-24 rounded-xl/);
    expect(code).not.toMatch(/length:\s*4/);
  });

  it("the reports page has no loading state, no ReportSkeletons, no h-64 skeletons", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    expect(code).not.toMatch(/useState\(\s*false\s*\).*loading|loading.*useState\(\s*false\s*\)/);
    expect(code).not.toMatch(/setLoading/);
    expect(code).not.toMatch(/ReportSkeletons/);
    expect(code).not.toMatch(/h-64/);
    expect(code).not.toMatch(/loading\s*&&\s*!data/);
    // Every tab renders unconditionally with null-safe data.
    expect(code).not.toMatch(/loading\s*\?/);
  });

  it("the store carries no loadingFlags field and no loading() helper", () => {
    const code = stripComments(read("src/stores/crm-store.ts")!);
    expect(code).not.toMatch(/loadingFlags/);
    expect(code).not.toMatch(/function loading\(/);
  });
});

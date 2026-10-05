import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-49 pins (S49-P1 + S49-P2): the pointer-(a) filter-membership
// reconciliation — the operator decision deferred since the s46 audits
// and decided this session. The reference's reports filters are
// CLIENT-SIDE React state with fixed-vocabulary Selects (bundle: the
// stage select offers the six OPP stages, the status select
// all/open/won/lost, the owner dropdown the DISTINCT opp owner names —
// NO server-side filter validation exists there at all); our clone
// passes the values through the URL to the API, so the envelope
// contract is the clone's own robustness layer (the `period`
// validation two lines up the same routes already stands on exactly
// this reasoning — the s41 "fix its defects" doctrine).
//
// THE DECISION: targeted membership on the genuinely-CLOSED
// vocabularies; owner and source stay open BY DESIGN:
//   - stage vs OPPORTUNITY_STAGES (the fixed six — the page's own
//     select list; a typo'd stage used to answer a silently EMPTY
//     report);
//   - status vs REPORT_STATUSES ({open, won, lost} — the new shared
//     vocabulary, the REPORT_PERIODS precedent; a typo'd status used
//     to be a silent NO-OP: the spread's else-branch matched nothing,
//     the filter dropped, EVERYTHING came back — the s42 strict-bool
//     silent-coercion class);
//   - owner OPEN (the data-dependent NAME-STRING join — a renamed
//     owner would 400 every stale saved view; membership would need a
//     DB round trip per fetch);
//   - source OPEN (the s48 documented-parity free-form decision — no
//     canonical list exists; the page never sends source at all).
//
// N-49m companion: the saved-view Load applies RAW stage/status
// (reports-page:384-387, the setPeriod(normalizeSavedPeriod(...)) /
// setStage / setStatus trio in onLoad — s64 refresh) — without
// normalization the new validation
// would turn a stale saved view from silently-EMPTY into
// silently-STALE data. normalizeSavedStage/normalizeSavedStatus follow
// the s32 normalizeSavedPeriod precedent (unknown values fall back to
// "all" so a Load never 400s).
//
// N-49n (S49-P2): the reference's filter predicate ANDs every
// conjunct (bundle: D&&$&&V&&B&&R — stage `$` and the status-derived
// stage test `B` are INDEPENDENT) while BOTH our routes built oppWhere
// by object spread with the status branch LAST: a concurrent
// stage+status(won/lost) request OVERWROTE the stage filter
// (stage=prospecting&status=won returned every closed_won; the
// reference returns the EMPTY intersection). The status conjunct is
// now AND-wrapped in both routes.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const reportsRoute = () => stripComments(read("src/app/api/reports/route.ts") ?? "");
const exportRoute = () => stripComments(read("src/app/api/export/route.ts") ?? "");

describe("session-49: the reports/export filter-membership validation (S49-P1, pointer (a))", () => {
  it("reports/route.ts membership-validates stage (OPPORTUNITY_STAGES) and status (REPORT_STATUSES)", () => {
    const src = reportsRoute();
    // The stage guard — the fixed six, the page select's own list.
    expect(src).toMatch(/OPPORTUNITY_STAGES\.some\(\(s\) => s === stage\)/);
    expect(src).toMatch(/ERR\.BAD_REQUEST\("Invalid stage"\)/);
    // The status guard — the shared vocabulary, the REPORT_PERIODS
    // precedent (one list for the page select + both route guards).
    expect(src).toMatch(/REPORT_STATUSES\.some\(\(s\) => s\.id === status\)/);
    expect(src).toMatch(/ERR\.BAD_REQUEST\("Invalid status"\)/);
  });

  it("export/route.ts carries the same membership pair (the shared filter model)", () => {
    const src = exportRoute();
    expect(src).toMatch(/OPPORTUNITY_STAGES\.some\(\(s\) => s === stage\)/);
    expect(src).toMatch(/ERR\.BAD_REQUEST\("Invalid stage"\)/);
    expect(src).toMatch(/REPORT_STATUSES\.some\(\(s\) => s\.id === status\)/);
    expect(src).toMatch(/ERR\.BAD_REQUEST\("Invalid status"\)/);
  });

  it("owner and source stay OPEN (the documented-parity posture — no membership)", () => {
    for (const src of [reportsRoute(), exportRoute()]) {
      // The raw notAll pass-throughs survive verbatim…
      expect(src).toMatch(/\.\.\.\(owner \? \{ owner \} : \{\}\)/);
      expect(src).toMatch(/\.\.\.\(source \? \{ source \} : \{\}\)/);
      // …and neither route 400s on them (owner is the data-dependent
      // name-string join; source is the s48 free-form decision).
      expect(src).not.toMatch(/Invalid owner/);
      expect(src).not.toMatch(/Invalid source/);
    }
  });

  it("the reconciliation record is documented in-file at both routes", () => {
    // Unstripped reads — the s48-P2 idiom: the decision record rides
    // the code it governs.
    for (const rel of ["src/app/api/reports/route.ts", "src/app/api/export/route.ts"]) {
      const src = read(rel) ?? "";
      expect(src).toMatch(/S49-P1/);
      expect(src).toMatch(/pointer \(a\)/);
    }
  });
});

describe("session-49: the saved-view normalizers (S49-P1, N-49m)", () => {
  it("normalizeSavedStage keeps OPP stages, falls back to 'all' (the s32 period precedent)", async () => {
    const { normalizeSavedStage } = await import("@/lib/saved-reports");
    // Valid OPP stages pass through.
    expect(normalizeSavedStage("prospecting")).toBe("prospecting");
    expect(normalizeSavedStage("closed_won")).toBe("closed_won");
    // LEAD stages are NOT OPP stages (the cross-vocabulary guard — a
    // stale s29-era entry carrying a lead stage must not 400 the route).
    expect(normalizeSavedStage("won")).toBe("all");
    expect(normalizeSavedStage("new")).toBe("all");
    // Unknown/legacy/empty values fall back to the no-filter sentinel.
    expect(normalizeSavedStage("Old Stage")).toBe("all");
    expect(normalizeSavedStage("")).toBe("all");
    expect(normalizeSavedStage("all")).toBe("all");
  });

  it("normalizeSavedStatus keeps open/won/lost, falls back to 'all'", async () => {
    const { normalizeSavedStatus } = await import("@/lib/saved-reports");
    expect(normalizeSavedStatus("open")).toBe("open");
    expect(normalizeSavedStatus("won")).toBe("won");
    expect(normalizeSavedStatus("lost")).toBe("lost");
    // Anything else — the lead-status vocabulary, junk, empty — is the
    // no-filter sentinel, so a Load never 400s the newly-validated route.
    expect(normalizeSavedStatus("new")).toBe("all");
    expect(normalizeSavedStatus("wonn")).toBe("all");
    expect(normalizeSavedStatus("")).toBe("all");
    expect(normalizeSavedStatus("all")).toBe("all");
  });

  it("the reports-page Load applies both normalizers", () => {
    const src = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    expect(src).toMatch(/setStage\(normalizeSavedStage\(report\.filters\.stage\)\)/);
    expect(src).toMatch(/setStatus\(normalizeSavedStatus\(report\.filters\.status\)\)/);
  });
});

describe("session-49: the stage∧status AND semantics (S49-P2, N-49n)", () => {
  it("both routes AND-wrap the status conjunct — it can never overwrite a concurrent stage filter", () => {
    for (const src of [reportsRoute(), exportRoute()]) {
      const at = src.indexOf("const oppWhere");
      expect(at).toBeGreaterThanOrEqual(0);
      const block = src.slice(at, at + 700);
      // The AND-wrapped conjunct: stage=X AND stage=closed_won/closed_lost
      // (the reference's intersection semantics — bundle D&&$&&V&&B&&R).
      expect(block).toMatch(/AND: \[\{ stage: status === "won" \? "closed_won" : "closed_lost" \}\]/);
      // The bare overwrite form is gone (the pre-fix shape spread the
      // status stage directly, clobbering any concurrent stage filter).
      expect(block).not.toMatch(/\.\.\.\(status === "won" \? \{ stage: "closed_won" \} : status === "lost" \? \{ stage: "closed_lost" \} : \{\}\)/);
    }
  });
});

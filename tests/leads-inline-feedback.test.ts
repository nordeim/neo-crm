import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-47 pins (S47-P3): the leads inline-edit failure feedback — the
// F-47f audit. The three s29-P2 onChange arrows (value :534 / stage :546 /
// nextFollowUp :568) called updateLead fire-and-forget with no feedback —
// a failed PUT silently reverted via the unconditional refetch (the user's
// edit vanished). Missed by the s46 census because they are onChange
// arrows, not async/await sites. The fix: the s46-P1 convention adapted —
// each arrow chains .then(onLeadEditResult); ONE shared 500 ms trailing
// debounce collapses a failing PER-KEYSTROKE burst (the value input) into
// a single toast (the s46-P2 DefaultsEditor lesson). The pinned call
// shapes stay verbatim (leads-inline.test.ts:77-83/:106 still match).

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

const page = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");

/** Slice a bounded region at an anchor (a failed anchor fails the pin). */
function regionAt(src: string, anchor: string, span: number): string {
  const at = src.indexOf(anchor);
  expect(at).toBeGreaterThanOrEqual(0);
  return src.slice(at, at + span);
}

describe("session-47: the leads inline-edit failure feedback (S47-P3, F-47f)", () => {
  it("the three inline controls chain the result into the failure handler", () => {
    const src = page();
    // Unique anchors: the inline cells' aria-labels (the filters popover's
    // value/date inputs share the input types but not the labels). The
    // onChange PRECEDES the aria-label in the attribute order — slice
    // BACKWARD from the label to the input's opening tag.
    const inputRegion = (label: string): string => {
      const at = src.indexOf(label);
      expect(at).toBeGreaterThanOrEqual(0);
      return src.slice(Math.max(0, src.lastIndexOf("<Input", at)), at + label.length);
    };
    const value = inputRegion("aria-label={`Value for");
    expect(value).toMatch(/updateLead\(l\.id, \{\s*value:\s*parseFloat\(e\.target\.value\) \|\| 0\s*\}\)/);
    expect(value).toMatch(/\.then\(onLeadEditResult\)/);

    const stage = regionAt(src, '<Select value={l.stage}', 700);
    expect(stage).toMatch(/updateLead\(l\.id, \{\s*stage: v\s*\}\)/);
    expect(stage).toMatch(/\.then\(onLeadEditResult\)/);

    const followUp = inputRegion("aria-label={`Next follow-up for");
    expect(followUp).toMatch(/updateLead\(l\.id, \{\s*nextFollowUp: e\.target\.value \|\| null\s*\}\)/);
    expect(followUp).toMatch(/\.then\(onLeadEditResult\)/);
  });

  it("the failure helper debounces the toast (500 ms trailing — no per-keystroke toasts)", () => {
    const src = page();
    const region = regionAt(src, "onLeadEditResult", 900);
    // The happy path is silent.
    expect(region).toMatch(/if \(res\.ok\) return/);
    // ONE trailing window: cleared then rescheduled — a failing typing
    // burst collapses into a single toast (the s46-P2 lesson).
    expect(region).toMatch(/window\.clearTimeout\(/);
    expect(region).toMatch(/window\.setTimeout\(/);
    expect(region).toMatch(/500/);
    expect(region).toMatch(/toast\.error\(\s*"Could not update lead",\s*res\.error\s*\)/);
  });

  it("the window timer is cleaned up on unmount", () => {
    const src = page();
    // The cleanup-only arrow form (the s46 precedent: `() => () => …`,
    // not `return () => …`) — a late toast after navigation would fire
    // on a dead page.
    expect(src).toMatch(/React\.useEffect\(\(\) => \(\) => window\.clearTimeout\(leadEditFailTimer\.current\), \[\]\)/);
  });
});

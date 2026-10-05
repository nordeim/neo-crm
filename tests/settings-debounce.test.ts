import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-46 pins (S46-P2): the DefaultsEditor debounced persist — the
// F-46b audit. Every keystroke on the free-text inputs (defaultCurrency,
// defaultLeadStage, defaultTier, followUpDays) fired an immediate
// full-defaults PUT; the s43-P3 membership guards (settings/route.ts:98
// stage / :111 tier — the if ("defaultLeadStage" in body) /
// if ("defaultTier" in body) blocks, s64 refresh) collided with the
// reference-mirrored
// immediate-persist idiom — typing "Negotiation" produced a
// guaranteed-failing PUT per keystroke ("N" → 400) and a red toast per
// keystroke, plus a last-RESOLVED-wins write race and no rollback. The
// reference's own idiom works only because it validates nothing. The
// fix: ONE shared trailing debounce (500 ms) inside DefaultsEditor —
// the no-save-button parity line preserved (changes still persist
// automatically), the membership 400s meet only the FINAL value, the
// flush is serialized (two PUTs can never race within the editor), and
// the unmount cleanup flushes a pending snapshot so a typed edit is not
// lost on navigation.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/settings/settings-page.tsx") ?? "");

/** The DefaultsEditor component body (from its declaration to the end). */
function defaultsEditor(src: string): string {
  const at = src.indexOf("function DefaultsEditor");
  expect(at).toBeGreaterThanOrEqual(0);
  return src.slice(at, at + 4200);
}

describe("session-46: the DefaultsEditor debounced persist (S46-P2)", () => {
  it("set() schedules a trailing 500 ms debounce — no inline PUT per keystroke", () => {
    const src = defaultsEditor(page());
    const at = src.indexOf("function set<");
    expect(at).toBeGreaterThanOrEqual(0);
    const setFn = src.slice(at, at + 500);
    expect(setFn).toMatch(/setTimeout\(/);
    expect(setFn).toMatch(/,\s*500\s*\)/);
    // The inline per-keystroke PUT is GONE from set().
    expect(setFn).not.toMatch(/updateSettings\(/);
  });

  it("the unmount cleanup clears the timer AND flushes a pending snapshot", () => {
    const src = defaultsEditor(page());
    // The cleanup-only effect form: React.useEffect(() => () => { … }, []).
    expect(src).toMatch(
      /\(\) => \(\) => \{[\s\S]{0,200}clearTimeout\(timerRef\.current\);[\s\S]{0,120}void flush\(\);[\s\S]{0,80}\},?\s*\n?\s*\[\],?\s*\n?\s*\);/,
    );
  });

  it("the flush is serialized — a flushing guard plus a re-schedule when a newer snapshot arrived", () => {
    const src = defaultsEditor(page());
    const at = src.indexOf("async function flush");
    expect(at).toBeGreaterThanOrEqual(0);
    const flushFn = src.slice(at, at + 800);
    expect(flushFn).toMatch(/flushingRef\.current\)/);
    expect(flushFn).toMatch(/finally\s*\{/);
    expect(flushFn).toMatch(/flushingRef\.current = false/);
    // The chain: a newer pending snapshot re-schedules flush (0 ms —
    // strictly after the in-flight one resolves).
    expect(flushFn).toMatch(/setTimeout\(\s*\(\) => void flush\(\),\s*0\s*\)/);
  });

  it("the happy path persists through flush — updateSettings is called, failures toast", () => {
    const src = defaultsEditor(page());
    const at = src.indexOf("async function flush");
    expect(at).toBeGreaterThanOrEqual(0);
    const flushFn = src.slice(at, at + 800);
    expect(flushFn).toMatch(/await updateSettings\(/);
    expect(flushFn).toMatch(/toast\.error\(\s*"Could not save",\s*res\.error\s*\)/);
  });
});

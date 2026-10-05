import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-43 pins (S43-P4): the topbar global search — the debounced
// fetch inside the setTimeout callback was the ONLY unwrapped fetch in
// src (the store's call(), the login card ×4, the profile ×2 and the
// entity dialogs are all wrapped). A network failure rejected the timer
// callback → an unhandled rejection + silently stale results (the s39
// N-B3 profile-save class). The wrap: try/catch around fetch+parse; the
// catch resets (setResults(null) + setOpen(false)) so a failure neither
// strands the rejection nor leaves stale results open. Blast radius
// zero: no unit pin touched topbar before this; the global-search e2e
// is happy-path only.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const topbar = () => stripComments(read("src/components/layout/topbar.tsx") ?? "");

describe("session-43: the topbar search fetch is wrapped (S43-P4)", () => {
  it("the debounced search effect wraps its fetch in try/catch (the last unwrapped fetch in src)", () => {
    const src = topbar();
    // The effect exists and still debounces (the shape is unchanged)…
    const effectAt = src.indexOf("React.useEffect");
    expect(effectAt).toBeGreaterThanOrEqual(0);
    const effect = src.slice(effectAt);
    // …the fetch rides inside a try…
    expect(effect).toMatch(/try\s*\{[\s\S]*?await fetch\(`\/api\/search/);
    // …and the catch resets BOTH the results and the dropdown.
    expect(effect).toMatch(/\}\s*catch\s*\{[\s\S]*?setResults\(null\);[\s\S]*?setOpen\(false\);/);
  });

  it("the catch resets before the timer closes (the reset lives inside the setTimeout callback)", () => {
    const src = topbar();
    const timerAt = src.indexOf("setTimeout(async");
    expect(timerAt).toBeGreaterThanOrEqual(0);
    const timer = src.slice(timerAt, timerAt + 1400);
    expect(timer).toMatch(/try\s*\{/);
    expect(timer).toMatch(/catch\s*\{/);
    expect(timer).toMatch(/setResults\(null\)/);
  });
});

// ---------------------------------------------------------------------------
// Session-44 (S44-P5): the envelope-reset — the N-44g micro. The s43-P4
// catch only fired on a NETWORK-level rejection; a JSON 401/500 envelope
// (body?.ok falsy) silently no-oped, leaving stale results open. The
// catch's reset now applies to the envelope path too.
// ---------------------------------------------------------------------------

describe("session-44: the topbar search resets on a non-ok envelope too (S44-P5)", () => {
  it("the !body?.ok path resets BOTH the results and the dropdown (the catch's own reset)", () => {
    const src = topbar();
    expect(src).toMatch(
      /if\s*\(body\?\.ok\)\s*\{[\s\S]*?\}\s*else(?:\s+if\s*\(!controller\.signal\.aborted\))?\s*\{[\s\S]*?setResults\(null\);[\s\S]*?setOpen\(false\);[\s\S]*?\}/,
    );
    // Session-46 (S46-P4) evolution: the envelope reset gained the
    // abort-awareness gate (} else { → } else if (!controller.signal.
    // aborted) {) — the pinned INTENT (the envelope path resets BOTH
    // results and dropdown) is unchanged; the s46 pin below pins the
    // gate itself.
  });
});

// ---------------------------------------------------------------------------
// Session-45 (S45-P3): the AbortController — the N-45c finding. The
// 250 ms debounce only prevents same-window timer races; two in-flight
// fetches could still resolve out of order ("ab" fires A → "abc" fires
// B → A resolves last → stale "ab" results overwrite B's). A controller
// per effect run, aborted in the cleanup: a superseded fetch hands its
// state ownership to the newer run instead of clobbering it — only a
// REAL failure resets (the s43-P4 reset, unchanged).
// ---------------------------------------------------------------------------

describe("session-45: the topbar search aborts superseded fetches (S45-P3)", () => {
  it("the effect creates an AbortController per run and passes its signal to the fetch", () => {
    const src = topbar();
    const effectAt = src.indexOf("React.useEffect");
    expect(effectAt).toBeGreaterThanOrEqual(0);
    const effect = src.slice(effectAt, effectAt + 2000);
    expect(effect).toMatch(/new AbortController\(\)/);
    expect(effect).toMatch(/signal:\s*controller\.signal/);
  });

  it("the cleanup aborts the controller (a superseded run cannot clobber the newer one)", () => {
    const src = topbar();
    const effectAt = src.indexOf("React.useEffect");
    const effect = src.slice(effectAt, effectAt + 2000);
    const cleanupAt = effect.indexOf("return () =>");
    expect(cleanupAt).toBeGreaterThanOrEqual(0);
    const cleanup = effect.slice(cleanupAt, cleanupAt + 300);
    expect(cleanup).toMatch(/controller\.abort\(\)/);
    expect(cleanup).toMatch(/clearTimeout\(timer\.current\)/);
  });

  it("the catch treats an abort as a handoff, not a failure (aborted → return, no reset)", () => {
    const src = topbar();
    const effectAt = src.indexOf("React.useEffect");
    const effect = src.slice(effectAt, effectAt + 2000);
    const catchAt = effect.indexOf("} catch {");
    expect(catchAt).toBeGreaterThanOrEqual(0);
    const catchBlock = effect.slice(catchAt, catchAt + 300);
    expect(catchBlock).toMatch(/controller\.signal\.aborted/);
    expect(catchBlock).toMatch(/return;/);
    // The REAL-failure reset survives below the handoff check.
    expect(catchBlock).toMatch(/setResults\(null\);/);
    expect(catchBlock).toMatch(/setOpen\(false\);/);
  });
});

// ---------------------------------------------------------------------------
// Session-46 (S46-P4): the envelope reset's abort-awareness — the N-46a
// finding. The s45-P3 catch treats an abort as a handoff, but the s44-P5
// ENVELOPE reset (the !body?.ok branch) did not: an abort landing during
// the body-parse window resolves `body` to null via the swallowed
// `.catch(() => null)`, routing a SUPERSEDED run into the reset branch —
// a transient close of the newer run's dropdown (self-correcting within
// 250 ms + fetch, but the asymmetry was real). The gate: the reset now
// carries the same handoff semantics as the catch. (The s44-P5 pin above
// evolves WITH this fix — its `} else {` shape becomes `} else if (!…)` —
// the pinned intent, the envelope path resetting BOTH results and
// dropdown, is preserved.)
// ---------------------------------------------------------------------------

describe("session-46: the topbar envelope reset is abort-aware (S46-P4)", () => {
  it("the !body?.ok reset is gated on !controller.signal.aborted (a superseded run cannot close the newer dropdown)", () => {
    const src = topbar();
    const effectAt = src.indexOf("React.useEffect");
    expect(effectAt).toBeGreaterThanOrEqual(0);
    const effect = src.slice(effectAt, effectAt + 2000);
    expect(effect).toMatch(
      /else\s+if\s*\(!controller\.signal\.aborted\)\s*\{[\s\S]{0,200}setResults\(null\);[\s\S]{0,120}setOpen\(false\);/,
    );
  });
});

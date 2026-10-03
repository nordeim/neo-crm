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
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
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
      /if\s*\(body\?\.ok\)\s*\{[\s\S]*?\}\s*else\s*\{[\s\S]*?setResults\(null\);[\s\S]*?setOpen\(false\);[\s\S]*?\}/,
    );
  });
});

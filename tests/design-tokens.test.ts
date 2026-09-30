import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-9 design-token pins (S9-P0, S9-16): the Tailwind v4 shadow-scale
// rename made our `shadow-sm` compile to `0 1px 3px …, 0 1px 2px -1px …`
// (the renamed old bare `shadow`), while the reference app ships the
// pre-rename scale — its `shadow-sm` COMPUTES to `0 1px 2px 0 rgb(0 0 0 /
// .05)` (verified via getComputedStyle on the outline Add button on
// 2026-09-30). The fix is a single @theme token re-pin in
// src/app/globals.css, documented in
// skills/avant-garde-design-v4/references/02-tailwind-v4-deep-dive.md
// ("Renamed Utilities": v3 shadow-sm -> v4 shadow-xs).
//
// These tests parse the CSS source so the contract is pinned at the unit
// layer without a browser.

const css = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);

function themeToken(name: string): string | undefined {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return m?.[1]?.trim();
}

describe("design tokens: Tailwind v4 shadow-scale re-pin (S9-P0)", () => {
  it("shadow-sm re-pins to the reference's computed tiny shadow", () => {
    // The reference's .shadow-sm computes 0 1px 2px 0 rgb(0 0 0 / .05).
    // Tailwind v4's default --shadow-sm is one step heavier (the renamed
    // old bare `shadow`) — the bug this token fixes.
    expect(themeToken("shadow-sm")).toBe("0 1px 2px 0 rgb(0 0 0 / 0.05)");
  });

  it("does NOT redefine the bare shadow scale (cards match already)", () => {
    // Bare `shadow` (the Card family, session-7 pin) computes identically
    // on both apps — the re-pin must not touch it.
    expect(themeToken("shadow")).toBeUndefined();
  });

  it("focus ring color token matches the reference --ring (near-black)", () => {
    // S9-16: the reference's --ring is 0 0% 3.9% (#0a0a0a) — focus rings
    // render 1px near-black, not the app blue.
    expect(themeToken("color-ring")).toBe("#0a0a0a");
  });
});

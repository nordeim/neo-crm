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

describe("design tokens: Session 10 pins (S10-P0, S10-1, S10-2)", () => {
  it("blur-sm re-pins to the reference's computed 4px glass blur", () => {
    // S10-P0: v4 renamed the blur scale (v3 blur-sm=4px became v4 blur-xs;
    // v4 blur-sm is the old bare blur=8px). The reference's login card
    // `backdrop-blur-sm` COMPUTES blur(4px) (getComputedStyle, 2026-09-30);
    // our v4 default compiled 8px — one step too strong. Same family as the
    // S9-P0 shadow re-pin.
    expect(themeToken("blur-sm")).toBe("4px");
  });

  it("does NOT redefine other blur steps (bare blur-xl on the logo glow is not a parity surface)", () => {
    // Only blur-sm is affected by the rename on parity surfaces; blur-xl was
    // not renamed in v4 and stays on the default scale.
    expect(themeToken("blur-xl")).toBeUndefined();
  });

  it("ships the global cursor rule from the reference's platform CSS", () => {
    // S10-1: the reference's global stylesheet contains
    // `button, [role="button"] { cursor: pointer; }` — every button shows the
    // hand cursor. Our buttons computed cursor:default. The rule lands in
    // the base layer of globals.css.
    expect(css).toMatch(/button,\s*\[role="?button"?\]\s*\{\s*cursor:\s*pointer;\s*\}/);
  });

  it("input ink token matches the reference's inherited input text color", () => {
    // S10-2: the reference's stock Input has NO text color class — typed
    // text inherits its --foreground 0 0% 3.9% = #0a0a0a (computed probe on
    // the search input: rgb(10,10,10)). Ours rendered text-foreground
    // #111827. The new --color-ink token carries the near-black.
    expect(themeToken("color-ink")).toBe("#0a0a0a");
  });

  it("placeholder ink token matches the reference's --muted-foreground", () => {
    // S10-2: the reference's placeholders compute #737373 (its
    // --muted-foreground 0 0% 45.1%; computed probe on the search ::placeholder
    // = rgb(115,115,115)). Ours rendered #9ca3af (subtle) on inputs and
    // #6b7280 (muted) on the search pill — three different values; the token
    // unifies them on the reference's value.
    expect(themeToken("color-muted-ink")).toBe("#737373");
  });
});

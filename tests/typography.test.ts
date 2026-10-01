import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-22 typography / base-cascade pins (S22-P1/P2/P3): the reference
// app ships ZERO webfonts — its 79.5KB stylesheet contains no @font-face
// rule, document.fonts is empty, and every surface (body, h1, buttons, the
// sidebar brand) computes Tailwind's stock default sans stack
// `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
//  "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` (byte-extracted
// from its preflight html rule on 2026-10-01). It also ships NO font
// smoothing (-webkit-font-smoothing: auto, no text-rendering override) and
// NO ::selection rule — the browser defaults.
//
// Our clone shipped the scaffold-era shadcn trio of inventions: the Inter
// webfont (next/font/google + the --font-inter variable + a v3-style
// --font-sans override), DOUBLE antialiased smoothing (an html CSS rule +
// the body utility class), and a blue-tinted ::selection rule. Measured
// drift on the same 62-char string at 16px: reference 466.8px/522.4px
// (regular/bold) vs ours 439px/451.3px — every text surface rendered in
// the wrong typeface.
//
// These tests parse the layout/globals sources so the contract is pinned
// at the unit layer without a browser; the computed-style parity is pinned
// by the e2e typography checks (tests/e2e/crm.spec.ts).

const css = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);

const layout = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/layout.tsx"),
  "utf8",
);

function themeToken(name: string): string | undefined {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return m?.[1]?.trim();
}

// Source pins read RULES, not documentation: strip comments first (the
// s21 "own-doc-comment" hazard — the retirement notes themselves name
// the retired properties).
const cssRules = css.replace(/\/\*[\s\S]*?\*\//g, "");
const layoutRules = layout
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/\/\/[^\n]*/g, "");

describe("typography: the Inter webfont retirement (S22-P1)", () => {
  it("the root layout imports NO webfont (the reference ships zero @font-face)", () => {
    expect(layoutRules).not.toMatch(/next\/font\/google/);
  });

  it("the root layout applies NO font variable to <html> (lang only)", () => {
    expect(layout).not.toMatch(/inter\.variable/);
    expect(layout).toMatch(/<html lang="en">/);
  });

  it("globals.css references NO --font-inter variable", () => {
    expect(css).not.toMatch(/--font-inter/);
  });

  it("the @theme block pins the reference's EXACT --font-sans stack", () => {
    // Byte-extracted from the reference's preflight html rule; Tailwind
    // 4.3's own default (-apple-system, BlinkMacSystemFont, …) is the
    // v4.0 list and NOT byte-identical, so the reference's stack is
    // pinned explicitly — version-proof against future Tailwind default
    // changes.
    expect(themeToken("font-sans")).toBe(
      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",\n    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    );
  });

  it("the pinned stack contains NO webfont variable and NO v3-style fallback list", () => {
    const token = themeToken("font-sans") ?? "";
    expect(token).not.toContain("--font-inter");
    expect(token).not.toContain("-apple-system");
    expect(token).not.toContain("BlinkMacSystemFont");
    expect(token).not.toContain("Roboto");
  });

  it("the body keeps its font-family rule resolving through var(--font-sans)", () => {
    // The body rule stays — it resolves through the pinned @theme token
    // (the reference's exact stack). Guards against the body rule being
    // deleted and the family falling to the UA serif default on
    // non-font-sans-classed surfaces.
    expect(css).toMatch(/font-family:\s*var\(--font-sans\)/);
  });
});

describe("typography: the antialiased smoothing retirement (S22-P2)", () => {
  it("globals.css ships NO -webkit-font-smoothing rule (the reference computes auto)", () => {
    expect(cssRules).not.toMatch(/-webkit-font-smoothing/);
  });

  it("globals.css ships NO text-rendering override (the reference computes auto)", () => {
    expect(cssRules).not.toMatch(/text-rendering/);
  });

  it("the body className carries NO antialiased utility", () => {
    expect(layoutRules).not.toMatch(/antialiased/);
  });
});

describe("typography: the ::selection retirement (S22-P3)", () => {
  it("globals.css ships NO ::selection rule (the reference's selection is the browser default)", () => {
    expect(cssRules).not.toMatch(/::selection/);
  });
});

describe("typography: the s13 base-font regression guards (re-held)", () => {
  it("the body sets NO explicit font-size (the reference computes 16px)", () => {
    // Strip comments first so the pin reads RULES, not documentation
    // (the s13 lesson text mentions the retired value), then scope to
    // the body rule block — the input-base utility's 0.875rem is a
    // control surface, not the body default.
    const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const bodyRule = noComments.match(/body\s*\{[^}]*\}/)?.[0] ?? "";
    expect(bodyRule).not.toMatch(/font-size/);
  });
});

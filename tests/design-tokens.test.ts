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

describe("design tokens: Session 12 border split (S12-P3)", () => {
  it("--color-line re-pins to the reference's platform DEFAULT #e5e5e5", () => {
    // The reference renders TWO border grays. Its platform DEFAULT (the
    // `* { border-color }` base + `--input`) is NEUTRAL-200 #e5e5e5 — the
    // color of every bare-`border` surface: ALL stock cards, table rows,
    // the reports tablist, outline buttons, select triggers/contents,
    // dropdown contents, dialog content and every bare form input
    // (computed probes on all 9 pages, 2026-09-30). Ours shipped gray-200
    // #e5e7eb everywhere.
    expect(themeToken("color-line")).toBe("#e5e5e5");
  });

  it("--color-line-strong carries the reference's EXPLICIT gray-200 family", () => {
    // The reference's explicit `border-gray-200` surfaces (#e5e7eb): the
    // reports KPI stat cards, the reports sticky filter card, the contacts
    // table card (plus the topbar search input, which already ships
    // literal border-gray-200). A second token keeps the split addressable.
    expect(themeToken("color-line-strong")).toBe("#e5e7eb");
  });

  it("the soft wash re-pins to the reference's muted/accent #f5f5f5 (S14-P5)", () => {
    // --color-line-soft was a SCAFFOLD-ERA assumption (#f3f4f6, gray-100)
    // — computed on the live reference (2026-09-30): the settings
    // segmented tab track (bg-muted) and a bg-accent probe both render
    // rgb(245,245,245) = #f5f5f5 (neutral-100). The token rides 27 class
    // usages, all in the muted/accent role (tab tracks, outline/ghost
    // hovers, select/menu focus washes, row hovers, count badges) — the
    // same class of finding as the s13 14px-base-font assumption.
    expect(themeToken("color-line-soft")).toBe("#f5f5f5");
  });
});

describe("design tokens: Session 13 default foreground flip (S13-P9)", () => {
  it("--color-foreground re-pins to the reference's #0a0a0a default", () => {
    // The reference's BODY default and card-foreground are BOTH
    // rgb(10,10,10) = #0a0a0a (computed probes on document.body, the
    // stock cards, the KPI values, the "More..." button and the dialog
    // text, 2026-09-30). Card titles, KPI values and buttons all INHERIT
    // it; only the page H1s are explicitly text-gray-900 (#111827 —
    // pinned separately in PAGE_HEADER). Ours shipped --color-foreground
    // #111827, so every inheriting surface rendered one gray step light.
    expect(themeToken("color-foreground")).toBe("#0a0a0a");
  });

  it("--color-ink stays #0a0a0a (the input text token converges with it)", () => {
    // After the flip the input token and the default foreground are the
    // SAME value — keep --color-ink as the input-text token so input
    // surfaces keep their explicit pin (they now coincide, and the pin
    // guards against future drift between the two).
    expect(themeToken("color-ink")).toBe("#0a0a0a");
  });
});

describe("design tokens: Session 13 body font-size (S13-P12)", () => {
  it("the body sets NO explicit font-size (the reference computes 16px)", () => {
    // The reference's <body> computes 16px — the browser default
    // (verified on its dashboard + profile, 2026-09-30). The
    // scaffold-era `font-size: 14px` was never reference-verified and
    // made every size-INHERITING surface render one step small (the
    // stock CardTitle computed 14px vs the reference's 16px).
    // Strip comments first so the pin reads RULES, not documentation.
    const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const body = noComments.match(/(^|[\s}])body\s*\{[^}]*\}/)?.[0] ?? "";
    expect(body).not.toMatch(/font-size:\s*14px/);
    expect(body).not.toMatch(/font-size:\s*0\.875rem/);
  });
});

describe("design tokens: Session 16 platform th/td reset (S16-P4)", () => {
  it("the base layer mirrors the reference's global th, td { padding: 1px }", () => {
    // The reference's platform ships a global `th, td { padding: 1px }`
    // reset that surfaces wherever no utility class overrides it: its
    // standard th compute `1px 8px` (header rows 43px vs our 41px) and
    // the dashboard compact th compute `8px 1px` (vs our `8px 0px`).
    // Utility classes (h-10/px-2/p-2/py-8/…) override the element
    // selector, so the reset only fills the unclassed axes — exactly
    // the reference's behavior. Strip comments before matching.
    const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(noComments).toMatch(/th,\s*td\s*\{\s*padding:\s*1px;?\s*\}/);
  });
});

describe("design tokens: Session 119 primary-foreground re-pin (D-119a1)", () => {
  it("the primary foreground re-pins to the reference's #fafafa (the shadcn stock hsl(0 0% 98%))", () => {
    // The 119-c contacts-family walk's systemic find (F-119c2): every
    // blue primary on the LIVE reference computes text rgb(250,250,250)
    // — the shadcn stock --primary-foreground hsl(0 0% 98%) the
    // reference kept while overriding --primary to blue-600. Our
    // scaffold-era pin was pure #ffffff (globals.css:39). Sampled live
    // on New Contact / New Account / New Lead / New Event / the
    // accounts+activities Filter buttons — bg rgb(37,99,235) byte-equal
    // on both apps, ONLY the foreground diverged. The s13 plan's badge
    // record ("fg #fafafa ✓") already carried the reference's token
    // value. Riders: the Button default variant (all blue primaries),
    // the dialog submits, the emerald quick-log (the default-variant
    // base) — all matching the reference's own mechanism; the badge
    // (text-neutral-50) and the login submit (explicit text-white,
    // live-verified white on BOTH apps) unaffected.
    expect(themeToken("color-primary-foreground")).toBe("#fafafa");
  });
});

// Session-193 (D-193a1): the base layer's universal OUTLINE-COLOR rule.
// The walk66 focus faces found the alpha-color carrier family's PAINTING
// member on the marketing anchors (1px auto outline: OURS the engine's
// adaptive near-black OPAQUE rgb(16,16,16)-family vs the reference's
// authored rgba(10,10,10,0.5)); the micro-probe-193 CSSOM walk
// root-caused it — the reference's compiled base layer carries the
// shadcn base template's universal line:
//   * { border-color: hsl(var(--border)); outline-color: hsl(var(--ring) / .5); }
// OURS carried only the border-color half (session-7's base import);
// every UA-outline-painting surface (any element without an authored
// focus-visible utility — the marketing pages' anchors, stock links)
// resolved the ENGINE default instead of the reference's authored 50%
// ring. The cure: the outline-color half added at the same * rule, in
// the v4 idiom (color-mix over the --color-ring token — the same
// resolved 50% near-black: #0a0a0a, the reference's own --ring value).
// The authored focus faces (outline-none + the box-shadow rings) are
// UNAFFECTED — their outline-style is none on both apps (the s178
// VERSION FORM genus documented the twin; this pin holds the carrier).
describe("design tokens: the base layer's universal outline-color rule (D-193a1)", () => {
  it("the * base rule carries the outline-color half of the shadcn base template — color-mix over the --color-ring token at 50% (the reference's compiled hsl(var(--ring) / .5); the walk66 re-walk proves the marketing anchors' focus outline-color lands the reference's family)", () => {
    // the @layer base * rule carries BOTH halves of the shadcn base line
    // (a windowed slice — the rule's own comment quotes the reference's
    // closing brace, so a [^}]+ rule-body regex would stop inside it)
    const baseIdx = css.indexOf("@layer base");
    expect(baseIdx).toBeGreaterThanOrEqual(0);
    const baseStar = css.slice(baseIdx, baseIdx + 2200);
    expect(baseStar).toContain("border-color: var(--color-line);");
    expect(baseStar).toContain(
      "outline-color: color-mix(in oklab, var(--color-ring) 50%, transparent);",
    );
    // the token the rule rides — the reference's own --ring #0a0a0a
    expect(themeToken("color-ring")).toBe("#0a0a0a");
  });
});

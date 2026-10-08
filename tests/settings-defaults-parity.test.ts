import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-81 pins: the settings-defaults-FAMILY parity suite (the 81-c
// fresh-eyes rotation on the settings defaults editors' deeper family —
// the session_157 suggested target, never a dedicated rotation: s14
// pinned the SETTINGS_DEFAULTS layout records, s26 the data-tab chrome,
// s72 the store/API seams + the debounce contract; nobody had ever
// walked the editors' own DOM + computed styles + the Select stock
// family they ride against the live reference at 1440 AND 390). Every
// pin below is LIVE-EXTRACTED from the reference (DOM + computed probes
// on both apps; the Select family decoded from its own bundle +
// open-popover DOM).
//
// The decisive contracts:
// - SELECT-CONTENT CHROME (M-81c1): the reference's open Select
//   popover ships `z-50 max-h-96 min-w-[8rem] overflow-hidden
//   rounded-md border bg-popover text-popover-foreground shadow-md` +
//   the FULL animation arm set (fade + zoom + ALL FOUR slide-in-from-*
//   arms + all four per-side translates) — LIVE-computed: radius 6px,
//   shadow-md (0 4px 6px -1px, 0 2px 4px -2px), max-height 384px,
//   z-index 50. OURS shipped the scaffold-era shadcn draft (z-[60]
//   max-h-72 rounded-lg shadow-lg, fade+zoom only) — never pinned in
//   80 sessions (the s13 MENU_CONTENT pin covered the dropdown-menu
//   family, not the select).
// - SELECT-ITEM + CHECK (M-81c2): the reference's items ship rounded-sm
//   computing 4px + focus:bg-accent focus:text-accent-foreground — the
//   HIGHLIGHTED item's text shifts #0a0a0a -> #171717 (LIVE: the
//   highlighted "Month" computed rgb(23,23,23) while the resting "Week"
//   computed rgb(10,10,10)). Its selected item's check svg is h-4 w-4
//   BARE — inheriting the near-black ink. OURS shipped rounded-md (6px)
//   with no focus:text arm and a BLUE check (h-4 w-4 text-primary =
//   #2563eb — our --primary is the app blue) on every selected item.
// - TRIGGER BASE RE-DERIVATION (M-81c3): the reference's bundle-verbatim
//   trigger base carries NO text color, NO transition-colors, NO
//   placeholder: arm, and DOES carry ring-offset-background (a latent
//   offset-0 no-op) + [&>span]:line-clamp-1 (LIVE-computed on its
//   trigger span: display flow-root, overflow hidden, text-overflow
//   clip, line-clamp 1 — vs our truncate's block/ellipsis/none). Its
//   chevron is h-4 w-4 opacity-50 — the bundle's `h-4 w-4 shrink-0` is
//   the CHECKBOX's class, not the chevron's.
// - NUMBER-INPUT MIN FAMILY (L-81c4): the reference ships NO min and NO
//   max on its settings follow-up input and NO min on its New Account
//   dialog's Annual Revenue / Employees inputs (live-probed,
//   hasAttribute false). OURS shipped min={0} max={90} + min={0} x2 —
//   the s77 "min={0} retire" precedent; the API-side 0-90 guard STAYS
//   (the documented s43-P3/S46-P2 superset).
// - TABSPANEL ATTR TRIO (L-81c5): the reference's Radix panels carry
//   data-state="active" data-orientation="horizontal" tabindex="0" (+
//   the id/aria-labelledby/hidden wiring our s23 shell already ships);
//   tabindex=0 is the a11y-relevant one — the panel enters the tab
//   order.
// - SUBTITLE ELEMENT (N-81c6): the reference's Default Values
//   CardDescription slot renders a DIV; ours shipped a <p> (our own
//   Data tab already renders the div — the s26 pin).
//
// Documented parities pinned green-by-design (computed-equal, no code
// change): the card chrome (12px radius, #e5e5e5 border, white bg, the
// shadow family); the six-group space-y-4/space-y-2 stack (16px
// inter-group, 12px labelGap, 8px controlMt — the v4 inline-label fix);
// the stock Label (14px/500/#0a0a0a); the inputs + selects (36px/14px/
// #0a0a0a ink, transparent bg, #e5e5e5 border); the 390px set (input +
// select 308px, card 358px, zero overflow — measured identical on both
// apps); the placeholders AED/new/B; the fallback values AED/new/B/3/
// month/monday; the Month/Week + Monday/Sunday Select vocabularies; the
// debounced persist contract (the 500ms shared trailing debounce, the
// epoch remount key — the s46/s72 pins re-held here because the
// rotation touches the same component body).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const selectSrc = () => read("src/components/ui/select.tsx") ?? "";
const tabsSrc = () => read("src/components/ui/tabs.tsx") ?? "";
const settingsSrc = () => read("src/app/(app)/settings/settings-page.tsx") ?? "";
const dialogsSrc = () => read("src/components/shared/entity-dialogs.tsx") ?? "";
const pageLayoutSrc = () => read("src/lib/page-layout.ts") ?? "";

async function selectTrigger() {
  return (await import("@/lib/page-layout")).SELECT_TRIGGER;
}

/** The DefaultsEditor component body (from its declaration to EOF). */
function defaultsEditorBody(): string {
  const src = settingsSrc();
  const at = src.indexOf("function DefaultsEditor");
  return at === -1 ? "" : src.slice(at);
}

describe("session-81: the Select-content chrome (M-81c1)", () => {
  it("the content ships the reference's z-50 / max-h-96 / rounded-md / shadow-md set", () => {
    const src = selectSrc();
    expect(src).toContain("z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md");
    expect(src).toContain("border-line bg-surface text-foreground shadow-md");
  });

  it("the scaffold-era chrome is retired (z-[60] / max-h-72 / rounded-lg / shadow-lg)", () => {
    // Comment-stripped: the Session-81 hazard comment in select.tsx
    // documents the retired draft by name (the stripComments house
    // convention — the s80 profile-suite precedent).
    const src = stripComments(selectSrc());
    expect(src).not.toContain("z-[60]");
    expect(src).not.toContain("max-h-72");
    expect(src).not.toMatch(/rounded-lg border border-line bg-surface/);
    expect(src).not.toContain("shadow-lg");
  });

  it("the FULL animation arm set — all four slide-in-from-* arms + all four translates", () => {
    const src = selectSrc();
    // The reference ships every arm on its single popper construction
    // (bundle + live DOM); ours shipped fade+zoom + the two vertical
    // translates only, behind a position ternary.
    expect(src).toContain("data-[side=bottom]:slide-in-from-top-2");
    expect(src).toContain("data-[side=left]:slide-in-from-right-2");
    expect(src).toContain("data-[side=right]:slide-in-from-left-2");
    expect(src).toContain("data-[side=top]:slide-in-from-bottom-2");
    expect(src).toContain("data-[side=left]:-translate-x-1");
    expect(src).toContain("data-[side=right]:translate-x-1");
  });

  it("the position ternary retires — the arms ride the single unconditional construction", () => {
    const src = selectSrc();
    expect(src).not.toContain('position === "popper" && "data-[side=bottom]:translate-y-1');
  });
});

describe("session-81: the Select-item + check family (M-81c2)", () => {
  it("the items ship rounded-sm (the reference's 4px, not our 6px rounded-md)", () => {
    const src = selectSrc();
    expect(src).toMatch(/items-center rounded-sm py-1\.5 pl-2 pr-8 text-sm/);
  });

  it("the focus wash carries the TEXT arm — focus:text-neutral-900 (the reference's accent-foreground #171717)", () => {
    // LIVE on the reference: the highlighted item computes
    // rgb(23,23,23) while the resting items compute rgb(10,10,10) —
    // its focus:text-accent-foreground arm. neutral-900 IS our house
    // expression for #171717 (the s80 badge precedent).
    const src = selectSrc();
    expect(src).toContain("focus:bg-line-soft focus:text-neutral-900");
  });

  it("the check svg is BARE h-4 w-4 — the blue text-primary retires", () => {
    // The reference's check inherits the near-black ink (#0a0a0a
    // resting / #171717 highlighted). Ours rendered a BLUE check
    // (#2563eb) on every selected item — our --primary is the app
    // blue, not the reference's popover ink.
    const src = selectSrc();
    expect(src).toMatch(/<Check className="h-4 w-4" \/>/);
    expect(src).not.toContain('h-4 w-4 text-primary"');
  });
});

describe("session-81: the trigger base re-derivation (M-81c3)", () => {
  it("the span arm is the reference's [&>span]:line-clamp-1 (not truncate)", async () => {
    // LIVE-computed on the reference's trigger span: display
    // flow-root, overflow hidden, text-overflow clip, line-clamp 1.
    // Our truncate computed display block, text-overflow ellipsis,
    // line-clamp none — a different clipping construction on every
    // select.
    const src = selectSrc();
    expect(src).toContain("[&>span]:line-clamp-1");
    expect(src).not.toContain("[&>span]:truncate");
  });

  it("SELECT_TRIGGER.base drops the invented arms + gains ring-offset-background", async () => {
    const T = await selectTrigger();
    // The reference's bundle-verbatim base: no text color (inherits
    // the #0a0a0a ink), no transition-colors, no placeholder: arm,
    // and the latent ring-offset-background (offset-0 no-op). The
    // per-surface w-full model STAYS (the s77 documented decision).
    expect(T.base).toBe(
      "flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-line bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background",
    );
    expect(T.base).not.toContain("text-ink");
    expect(T.base).not.toContain("transition-colors");
    expect(T.base).not.toContain("placeholder:text-muted-ink");
  });

  it("the chevron is the reference's bare h-4 w-4 opacity-50 (the shrink-0 retires)", () => {
    // The bundle's `h-4 w-4 shrink-0` is the CHECKBOX's class; the
    // reference's select chevron is h-4 w-4 opacity-50.
    const src = selectSrc();
    expect(src).toContain('<ChevronDown className="h-4 w-4 opacity-50" />');
    expect(src).not.toContain("h-4 w-4 shrink-0 opacity-50");
  });
});

describe("session-81: the number-input min family (L-81c4)", () => {
  it("the settings follow-up input ships NO min/max (the reference's own quirk)", () => {
    const body = defaultsEditorBody();
    const at = body.indexOf('id="def-follow"');
    const block = at === -1 ? "" : body.slice(at, at + 700);
    expect(block).toContain('type="number"');
    expect(block).not.toContain("min={0}");
    expect(block).not.toContain("max={90}");
  });

  it("the entity dialogs' Annual Revenue + Employees inputs ship NO min", () => {
    const src = dialogsSrc();
    for (const field of ["annualRevenue", "employees"]) {
      const at = src.indexOf(`value={form.${field}}`);
      const block = at === -1 ? "" : src.slice(Math.max(0, at - 400), at);
      expect(block).not.toContain("min={0}");
    }
  });

  it("the API-side 0-90 guard STAYS (the documented s43-P3/S46-P2 superset)", () => {
    const route = read("src/app/api/settings/route.ts") ?? "";
    expect(route).toContain("days < 0 || days > 90");
  });
});

describe("session-81: the TabsPanel attr trio (L-81c5)", () => {
  it("TabsPanel carries data-state + data-orientation + tabIndex (the reference's Radix stock)", () => {
    const src = tabsSrc();
    expect(src).toMatch(/data-state=\{active \? "active" : "inactive"\}/);
    expect(src).toMatch(/data-orientation="horizontal"/);
    expect(src).toMatch(/tabIndex=\{0\}/);
  });
});

describe("session-81: the subtitle element (N-81c6)", () => {
  it("the Default Values CardDescription slot renders a DIV (the reference's own element)", () => {
    const src = settingsSrc();
    expect(src).toMatch(/<div className=\{SETTINGS_DEFAULTS\.subtitle\}>Set default values for new records<\/div>/);
    expect(src).not.toMatch(/<p className=\{SETTINGS_DEFAULTS\.subtitle\}/);
  });
});

describe("session-81: green-by-design anchors (the measured parities)", () => {
  it("the card chrome: the stock Card string on the Defaults card", () => {
    const src = settingsSrc();
    // LIVE-computed on both apps: 12px radius, #e5e5e5 border, white
    // bg, the shadow family — our border-line/bg-surface tokens are
    // the computed-equal expressions.
    const card = read("src/components/ui/card.tsx") ?? "";
    expect(card).toContain("rounded-xl border border-line bg-surface shadow");
  });

  it("the stock Label string (14px/500/#0a0a0a on both apps)", () => {
    const label = read("src/components/ui/label.tsx") ?? "";
    expect(label).toContain(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    );
  });

  it("the six-group stack + the v4 controlMt fix + the placeholders + the fallbacks", () => {
    const body = defaultsEditorBody();
    expect(body).toContain('className={SETTINGS_DEFAULTS.body}');
    expect(body).toMatch(/settings\?\.defaultCurrency \?\? "AED"/);
    expect(body).toMatch(/settings\?\.defaultLeadStage \?\? "new"/);
    expect(body).toMatch(/settings\?\.defaultTier \?\? "B"/);
    expect(body).toMatch(/settings\?\.followUpDays \?\? 3/);
    expect(body).toMatch(/settings\?\.calendarView \?\? "month"/);
    expect(body).toMatch(/settings\?\.firstDayOfWeek \?\? "monday"/);
    expect(body).toContain('placeholder="AED"');
    expect(body).toContain('placeholder="new"');
    expect(body).toContain('placeholder="B"');
  });

  it("the Month/Week + Monday/Sunday Select vocabularies (the s72 pins, re-held)", () => {
    const body = defaultsEditorBody();
    expect(body).toContain('<SelectItem value="month">Month</SelectItem>');
    expect(body).toContain('<SelectItem value="week">Week</SelectItem>');
    expect(body).toContain('<SelectItem value="monday">Monday</SelectItem>');
    expect(body).toContain('<SelectItem value="sunday">Sunday</SelectItem>');
  });

  it("the Select viewport keeps the stock p-1 + the popper trio (the reference's own)", () => {
    const src = selectSrc();
    expect(src).toContain("p-1");
    expect(src).toContain("h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]");
  });

  it("the debounced persist contract survives (the 500ms shared trailing debounce)", () => {
    // The 500ms timer lives in the editor body; the epoch remount key
    // lives on the CALL SITE (SettingsPage's render, s72 M-72c1).
    const body = defaultsEditorBody();
    expect(body).toContain("setTimeout(() => void flush(), 500)");
    expect(settingsSrc()).toMatch(/key=\{settings \? "resolved" : "pending"\}/);
  });

  it("SETTINGS_DEFAULTS.subtitle keeps the stock class (the s14 pin, re-held)", async () => {
    const D = (await import("@/lib/page-layout")).SETTINGS_DEFAULTS;
    expect(D.subtitle).toBe("text-sm text-muted-ink");
    expect(D.controlMt).toBe("mt-2");
  });

  it("the record docblock re-derivation rides the SELECT_TRIGGER block (page-layout source)", () => {
    // The S10-2 comment above the record must describe the re-derived
    // base (the 81-c model), not the retired text-ink one.
    const src = pageLayoutSrc();
    const at = src.indexOf("export const SELECT_TRIGGER");
    const doc = src.slice(Math.max(0, at - 900), at);
    expect(doc).toContain("ring-offset-background");
  });
});

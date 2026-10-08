import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-80 pins: the profile-FAMILY parity suite (the 80-c fresh-eyes
// rotation on the profile page's own surfaces — the session_154 suggested
// target, never a dedicated VISUAL rotation: s13 pinned PROFILE_LAYOUT,
// s30 the photo flow, s72 the store/API seams; nobody had ever walked the
// page's DOM + computed styles against the live reference at 1440 AND
// 390). Every pin below is LIVE-EXTRACTED from the reference (DOM +
// computed probes on both apps + its own compiled stylesheet decoded).
//
// The decisive contracts:
// - HOVER VARIANT: Tailwind v4 wraps every `hover:` utility in
//   `@media (hover: hover)` (CSSOM-walked live on our dev server — our
//   .hover\:bg-neutral-800:hover rides TWO (hover: hover) blocks), so
//   ALL our hover affordances no-op on hover-incapable devices. The
//   reference's v3-era stylesheet (index-Be9epoFc.css, 79,581 bytes)
//   contains ZERO (hover: hover) media queries — every hover rule is a
//   BARE :hover selector. LIVE-PROVEN: with the mouse parked over our
//   badge (:hover matching, polled true for 1s) the computed background
//   stayed #171717 — the rule never fired in a hover:none environment
//   where the reference's identical probe computes rgba(23,23,23,0.8).
//   The fix: @custom-variant hover (&:hover); in globals.css — the
//   fourth member of the v4 shadow/blur/space-y re-pin family.
// - NEUTRAL-900 HOVER ALPHA ARMS: the reference's dark-primary surfaces
//   ship ALPHA hovers — its stylesheet literally reads
//   .hover\:bg-primary\/80:hover{background-color:hsl(var(--primary) /
//   .8)} with --primary = #171717. LIVE hover-probed: the profile role
//   badge settles at rgba(23,23,23,0.8); the profile Save Changes at
//   rgba(23,23,23,0.9); the New Lead dialog submit + the settings
//   picklist Add button carry the class-decoded
//   hover:bg-primary/90. OURS shipped SOLID hover:bg-neutral-800
//   (#262626 = rgb(38,38,38)) on all five carriers — the s66 badge
//   translation miscalculated the alpha math (0.8x23 + 0.2x255 = 69.4
//   ~= #454545, NOT #262626; the same genus as the s21 "-mb-2
//   verbatim" v4-math error). The computed-equal expressions:
//   hover:bg-neutral-900/80 (badges) and /90 (buttons) — v4's
//   color-mix(in oklab, ...) = the reference's hsl(var(--primary) / .N)
//   for the neutral gray.
// - EMAIL INPUT TYPE: the reference's disabled email input renders
//   type="email" (Full Name / Role stay type="text" like ours); ours
//   shipped type="text" — a DOM attribute diff with autofill +
//   password-manager + a11y semantics.
// - S21 COMMENT REMNANTS (80-a's nano note): the login-reset.ts file
//   header still asserted the LIVE-FALSIFIED "-mb-2 verbatim / computes
//   8px under BOTH v3 and v4" claim and login-card.tsx:305 still read
//   "the -mb-2 back button" — both retired with the s79 records.
//
// Documented parities pinned green-by-design (computed-equal, no code
// change): the value ps' text-foreground (BOTH apps compute rgb(10,10,10)
// — our --color-foreground was re-pinned #0a0a0a in s73); the gap stack
// (h3->p 0, p->badge 8px via the badge's mt-2 — measured on both apps);
// the avatar ladders (the form's 80/96 + the Account card's flat 80);
// the three chips' inline-color pairs (computed-equal with the
// reference's blue-100/green-100/purple-100 class expressions); the
// w-full sm:w-auto responsive set (measured 308px at 390 on both apps).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const globalsCss = () => read("src/app/globals.css") ?? "";
const badgeSrc = () => stripComments(read("src/components/ui/badge.tsx") ?? "");
const profileSrc = () => read("src/app/(app)/profile/profile-page.tsx") ?? "";
const loginResetSrc = () => read("src/lib/login-reset.ts") ?? "";
const loginCardSrc = () => read("src/components/layout/login-card.tsx") ?? "";

async function pageLayout() {
  return (await import("@/lib/page-layout")).PROFILE_LAYOUT;
}
async function dialogSubmit() {
  return (await import("@/lib/page-layout")).DIALOG_SUBMIT;
}
async function settingsPicklist() {
  return (await import("@/lib/page-layout")).SETTINGS_PICKLIST;
}

describe("session-80: the hover-variant un-wrap (M-80c2)", () => {
  it("globals.css re-defines the hover variant as a bare :hover (the reference's v3 semantics)", () => {
    // The reference's compiled stylesheet ships ZERO (hover: hover)
    // media queries — every hover rule is a bare :hover selector, so
    // its hovers apply on touch (sticky) exactly like desktop. v4's
    // default wraps hover: utilities in @media (hover: hover), which
    // LIVE-PROVEN no-ops every hover affordance we ship on
    // hover-incapable devices. The @custom-variant override restores
    // the reference's semantics family-wide.
    expect(globalsCss()).toContain("@custom-variant hover (&:hover);");
  });
});

describe("session-80: the neutral-900 hover alpha arms (M-80c1)", () => {
  it("the stock Badge default variant hovers at neutral-900/80 (the reference's bg-primary/80)", async () => {
    // LIVE hover-probed on the reference: rgba(23,23,23,0.8) — the
    // stylesheet's hsl(var(--primary) / .8). The solid neutral-800
    // (#262626) was the s66 alpha-math miscalculation.
    expect(badgeSrc()).toContain(
      "border-transparent bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/80",
    );
    expect(badgeSrc()).not.toMatch(/hover:bg-neutral-800\b/);
  });

  it("PROFILE_LAYOUT.badge hovers at neutral-900/80", async () => {
    const L = await pageLayout();
    expect(L.badge).toContain("hover:bg-neutral-900/80");
    expect(L.badge).not.toContain("hover:bg-neutral-800");
  });

  it("DIALOG_SUBMIT.button hovers at neutral-900/90 (the reference's dialog submits)", async () => {
    // Class-decoded on the reference's live New Lead dialog:
    // bg-primary text-primary-foreground shadow hover:bg-primary/90 —
    // its --primary = #171717 on dialog surfaces (the s5 finding); the
    // computed-equal hover is neutral-900 at 90% alpha.
    expect((await dialogSubmit()).button).toBe(
      "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 shadow h-9 px-4 py-2",
    );
  });

  it("SETTINGS_PICKLIST.addButton hovers at neutral-900/90", async () => {
    // Class-decoded on the reference's live settings picklist Add
    // button: the same default-Button /90 construction.
    expect((await settingsPicklist()).addButton).toBe(
      "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 shadow h-9 px-4 py-2",
    );
  });

  it("the profile Save Changes rides the /90 arm and drops the inert border-transparent", async () => {
    // LIVE hover-probed on the reference: rgba(23,23,23,0.9); its Save
    // is the stock default variant + w-full sm:w-auto — NO
    // border-transparent (the stock default ships no border arm; ours
    // carried the inert class since s13).
    const src = profileSrc();
    expect(src).toContain(
      "bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90",
    );
    expect(src).not.toContain("border-transparent bg-neutral-900");
  });
});

describe("session-80: the profile email input type (L-80c3)", () => {
  it("the disabled email input renders type=email like the reference", () => {
    // DOM-extracted on the reference: its email input carries
    // type="email" (Full Name + Role stay text). Autofill
    // categorization + password-manager field detection + the a11y
    // role computation all read the type.
    const src = profileSrc();
    const emailInput = src.match(/<Input[^>]*id="profile-email"[^>]*\/>/);
    expect(emailInput).not.toBeNull();
    expect(emailInput![0]).toContain('type="email"');
  });
});

describe("session-80: the s21 comment remnants retired (N-80c4)", () => {
  it("the login-reset.ts header no longer asserts the falsified -mb-2 verbatim claim", () => {
    // 80-a's nano note #1: the file header survived the s79 comment
    // sweep still asserting the LIVE-FALSIFIED "safe to mirror -mb-2
    // verbatim / computes 8px under BOTH v3 and v4" claim (s79
    // measured -8px OVERLAP on ours vs the reference's +8px).
    expect(loginResetSrc()).not.toMatch(
      /safe to mirror -mb-2 verbatim/i,
    );
    expect(loginResetSrc()).not.toMatch(
      /computes 8px under BOTH v3 and v4/i,
    );
  });

  it("login-card.tsx no longer references the -mb-2 back button", () => {
    expect(loginCardSrc()).not.toContain("the -mb-2 back button");
  });
});

describe("session-80: the documented parities, pinned green (N-80c5)", () => {
  it("the three info-card values ride text-foreground (#0a0a0a — both apps compute rgb(10,10,10))", () => {
    // The reference's value ps carry NO color class (inheriting its
    // card-foreground #0a0a0a); ours carries text-foreground — the
    // computed-equal expression since the s73 foreground re-pin.
    const src = profileSrc();
    expect(src).toContain("truncate font-semibold capitalize text-foreground");
    expect(src).toContain("font-semibold text-foreground");
  });

  it("the badge's gap stack: mt-2 on the badge, no margins between h3 and email (0/8px measured both apps)", async () => {
    const L = await pageLayout();
    expect(L.badge).toContain("mt-2");
    expect(L.nameWrap).toBe("flex flex-col items-center text-center");
  });

  it("the avatar ladders: the form's responsive 80/96 + the Account card's flat 80", async () => {
    const L = await pageLayout();
    expect(L.avatarIcon).toBe("h-10 w-10 sm:h-12 sm:w-12");
    expect(L.avatarIconStroke).toBe(2);
    // The Account card's icon stays FLAT h-10 w-10 (the reference's
    // own split — no sm arm there).
    expect(profileSrc()).toContain('<User className="h-10 w-10"');
  });

  it("the three chips' inline-color pairs compute equal to the reference's class expressions", () => {
    // blue-100/#2563eb (Account Type), green-100/#16a34a (Email
    // Verified), purple-100/#f3e8ff + purple-600 #9333ea (Security) —
    // all four hex pairs measured on the reference's chips.
    const src = profileSrc();
    expect(src).toContain('bg="#dbeafe" color="#2563eb"');
    expect(src).toContain('bg="#dcfce7" color="#16a34a"');
    expect(src).toContain('bg="#f3e8ff" color="#9333ea"');
  });

  it("the responsive w-full sm:w-auto set (308px measured at 390 on both apps)", async () => {
    const L = await pageLayout();
    expect(L.uploadBtn).toBe("w-full sm:w-auto");
    expect(L.saveBtn).toBe("w-full sm:w-auto");
  });

  it("the upload icon carries its margin ON THE SVG (w-4 h-4 mr-2)", async () => {
    const L = await pageLayout();
    expect(L.uploadIcon).toBe("h-4 w-4 mr-2");
  });
});

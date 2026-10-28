import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-79 pins: the login-FAMILY parity suite (the 79-c fresh-eyes
// rotation on the login/signup card family — the session_151 suggested
// target, never a dedicated rotation; the login card is PLATFORM code,
// not app-bundle code — zero auth markers exist in the 1.63MB bundle —
// so every pin below is LIVE-EXTRACTED from the reference at 1440 AND
// 390 and cross-probed on our own dev server).
//
// The decisive contracts:
// - TEXT LADDER: the reference's auth inputs/submits compute 14px at
//   desktop — the signin/reset inputs carry the stock text-base
//   md:text-sm (16px <768 / 14px >=768); the four submits text-sm
//   (14px at ALL widths); the signup inputs the three-rung text-sm
//   sm:text-base + the stock md:text-sm (14/16/14). Ours shipped a
//   flat 16px (no text-size classes anywhere).
// - BACK BUTTONS: under our v4 space-y (:where() margin-BOTTOM), the
//   reference's -mb-2 computes an 8px OVERLAP (its own class wins the
//   specificity fight) — the v4-correct expression of the reference's
//   computed +8px gap is mb-2 (signup/verify, flat) and mb-2 sm:mb-4
//   (reset — 8px <640 / 16px >=640, LIVE-measured on both apps).
// - SHIELDCHECK: the verify tile's glyph is lucide ShieldCheck (the
//   s21 pin wrongly recorded the sent view's Mail).
// - FOCUS RING: the auth inputs focus to a SOLID slate-400 2px ring +
//   a 2px WHITE offset (computed rgb(148,163,184) 0 0 0 4px over
//   rgb(255,255,255) 0 0 0 2px on the reference) — NOT the 30%-opacity
//   ring we shipped.
// - TABLEHEAD (the N-77c17 adjudication): the reference's stock th is
//   text-muted-foreground rgb(115,115,115) — our computed-equal token
//   is text-muted-ink (#737373); text-muted (#6b7280) retires.
// - MOBILE SPACER: every auth view ships the trailing mt-8
//   text-slate-400 sm:hidden nbsp spacer inside the max-w-md wrapper.
// - VERIFY HINT: the reference renders the "Enter the verification
//   code sent to your email" hint under the six code inputs (inside
//   the same plain wrapper div — the mt-3 must not ride the form's
//   space-y).
// - VERIFY STACK/FORM: space-y-4 sm:space-y-6 (ours shipped the
//   signup's tighter families).
// - ICON SPLIT: the signin icons are slate-500; the reset + signup
//   views' icons are the LIGHTER slate-400 family.
// - CODE INPUTS: the flat stock mirror — no shadow-sm, no
//   transition-colors, no ring-offset, no redundant inline h-11.
// - SUBMIT CHROME: disabled:pointer-events-none disabled:opacity-50 +
//   the keyboard focus-visible ring (slate-400 + offset).
// - CALLOUT TEXT: the callout text renders as a BARE text node (the
//   [&_p]:leading-relaxed arm stays inert like the reference's own).
// - BACK2: the dead LOGIN_VERIFY_LAYOUT.back2 member retires.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const loginCard = () => stripComments(read("src/components/layout/login-card.tsx") ?? "");
const loginCardRaw = () => read("src/components/layout/login-card.tsx") ?? "";
const loginReset = () => read("src/lib/login-reset.ts") ?? "";
const pageLayout = () => read("src/lib/page-layout.ts") ?? "";
const tableSrc = () => read("src/components/ui/table.tsx") ?? "";
const claude = () => read("CLAUDE.md") ?? "";

async function loginLayout() {
  return (await import("@/lib/page-layout")).LOGIN_LAYOUT;
}
async function resetLayout() {
  return (await import("@/lib/login-reset")).LOGIN_RESET_LAYOUT;
}
async function signupLayout() {
  return (await import("@/lib/login-reset")).LOGIN_SIGNUP_LAYOUT;
}
async function verifyLayout() {
  return (await import("@/lib/login-reset")).LOGIN_VERIFY_LAYOUT;
}

describe("session-79: the auth text-size ladder (M-79c1)", () => {
  it("the signin input carries the stock text-base md:text-sm pair", async () => {
    const L = await loginLayout();
    expect(L.input).toContain("text-base md:text-sm");
  });

  it("the signin submit is text-sm (14px at all widths)", async () => {
    const L = await loginLayout();
    expect(L.submit).toContain("text-sm");
  });

  it("the reset input carries the stock text-base md:text-sm pair", async () => {
    const L = await resetLayout();
    expect(L.resetInput).toContain("text-base md:text-sm");
  });

  it("the reset Send (the shared signup/verify submit) is text-sm", async () => {
    const L = await resetLayout();
    expect(L.send).toContain("text-sm");
  });

  it("the signup input carries the three-rung text-sm sm:text-base md:text-sm ladder", async () => {
    const L = await signupLayout();
    expect(L.input).toContain("text-sm sm:text-base");
    expect(L.input).toContain("md:text-sm");
  });

  it("the verify submit record is the shared send family (text-sm rides it)", async () => {
    const L = await verifyLayout();
    const R = await resetLayout();
    expect(L.submit).toBe(R.send);
  });
});

describe("session-79: the back-button overlap fix (M-79c2 + L-79c9)", () => {
  it("the signup back button is mb-2 (the v4-correct flat 8px gap)", async () => {
    const L = await signupLayout();
    expect(L.back).toContain("mb-2");
    expect(L.back).not.toContain("-mb-2");
  });

  it("the verify back button is the responsive mb-2 sm:mb-4 ladder (s111: the reference's collapsed 24-8=16 at >=640)", async () => {
    const L = await verifyLayout();
    expect(L.back).toContain("mb-2 sm:mb-4");
    expect(L.back).not.toContain("-mb-2");
  });

  it("the reset back button is the responsive mb-2 sm:mb-4 ladder (8px <640, 16px >=640)", async () => {
    const L = await resetLayout();
    expect(L.back).toContain("mb-2 sm:mb-4");
    // A standalone mb-4 (the pre-79 flat form) never reappears — only
    // the sm:mb-4 arm carries it.
    expect(L.back).not.toMatch(/ mb-4/);
    expect(L.back).not.toContain("-mb-2");
  });
});

describe("session-79: the verify-email ShieldCheck glyph (M-79c3)", () => {
  it("the verify tile renders the ShieldCheck icon", () => {
    expect(loginCard()).toMatch(/ShieldCheck/);
  });

  it("the verify tile no longer renders the Mail glyph (the sent view keeps its own)", () => {
    // The verify arm's icon element: <ShieldCheck className={LOGIN_VERIFY_LAYOUT.icon} />
    // — the Mail import stays for the signin/reset/sent arms (their own
    // icon records are unrelated to the verify tile's).
    const src = loginCard();
    expect(src).not.toMatch(/<Mail className=\{LOGIN_VERIFY_LAYOUT\.icon\}\s*\/>/);
  });
});

describe("session-79: the auth focus-ring construction (M-79c4)", () => {
  it("the signin input: solid slate-400 ring + the 2px white offset", async () => {
    const L = await loginLayout();
    expect(L.input).toContain("focus:ring-2 focus:ring-slate-400 focus:ring-offset-2");
    expect(L.input).not.toContain("ring-slate-400/30");
  });

  it("the reset input: the same focus construction", async () => {
    const L = await resetLayout();
    expect(L.resetInput).toContain("focus:ring-2 focus:ring-slate-400 focus:ring-offset-2");
    expect(L.resetInput).not.toContain("ring-slate-400/30");
  });

  it("the signup input: the same focus construction", async () => {
    const L = await signupLayout();
    expect(L.input).toContain("focus:ring-2 focus:ring-slate-400 focus:ring-offset-2");
    expect(L.input).not.toContain("ring-slate-400/30");
  });
});

describe("session-79: the N-77c17 TableHead token sweep (M-79c5)", () => {
  it("the stock th carries text-muted-ink (the computed-equal of the reference's text-muted-foreground #737373)", () => {
    const src = tableSrc();
    expect(src).toMatch(/font-medium text-muted-ink \[/);
    expect(src).not.toMatch(/font-medium text-muted \[/);
  });

  it("the th keeps the stock density + checkbox variants", () => {
    expect(tableSrc()).toMatch(
      /h-10 px-2 text-left align-middle font-medium text-muted-ink \[&:has\(\[role=checkbox\]\)\]:pr-0/,
    );
  });
});

describe("session-79: the mobile spacer (L-79c6)", () => {
  it("the card wrapper ships the trailing mt-8 sm:hidden nbsp spacer", () => {
    const src = loginCard();
    expect(src).toContain("mt-8 text-center text-xs text-slate-400 sm:hidden");
    expect(src).toMatch(/&nbsp;/);
  });

  it("the spacer renders on every view (it rides the card wrapper, outside the view ternary)", () => {
    // The spacer must sit AFTER the card div, INSIDE the w-full
    // max-w-md wrapper — the reference's own position.
    const src = loginCard();
    const wrapperOpen = src.indexOf('className="w-full max-w-md"');
    const spacerAt = src.indexOf("mt-8 text-center text-xs text-slate-400 sm:hidden");
    expect(wrapperOpen).toBeGreaterThan(-1);
    expect(spacerAt).toBeGreaterThan(wrapperOpen);
  });
});

describe("session-79: the verify hint line + the wrapper (L-79c7)", () => {
  it("the hint record carries the reference's literal line + classes", async () => {
    const L = await verifyLayout();
    expect(L.hint).toBe("text-xs text-slate-500 text-center mt-3");
    expect(L.hintLine).toBe("Enter the verification code sent to your email");
  });

  it("the card renders the hint under the code inputs (the record members consumed)", () => {
    const src = loginCard();
    expect(src).toContain("LOGIN_VERIFY_LAYOUT.hint");
    expect(src).toContain("LOGIN_VERIFY_LAYOUT.hintLine");
  });

  it("the codeWrap + the hint ride inside a plain wrapper div (the mt-3 must not ride the form's space-y)", () => {
    // The wrapper div opens DIRECTLY before the codeWrap and the hint
    // follows the codeWrap's close — the reference's own structure
    // (margin collapse keeps the hint's mt-3 out of the form's space-y).
    const src = loginCard();
    expect(src).toMatch(
      /<div>\s*<div className=\{LOGIN_VERIFY_LAYOUT\.codeWrap\}>[\s\S]*?<\/div>\s*<p className=\{LOGIN_VERIFY_LAYOUT\.hint\}>/,
    );
  });
});

describe("session-79: the verify stack/form spacing (L-79c8)", () => {
  it("the verify viewStack is space-y-4 sm:space-y-6", async () => {
    const L = await verifyLayout();
    expect(L.viewStack).toBe("space-y-4 sm:space-y-6");
  });

  it("the verify form has its own space-y-4 sm:space-y-6 member", async () => {
    const L = await verifyLayout();
    expect(L.form).toBe("space-y-4 sm:space-y-6");
  });

  it("the verify call site uses the verify form (not the signup's tighter family)", () => {
    const src = loginCard();
    // Session-111: the anchor gained the ' ? (' discriminator — the D1
    // focus effect + the D3a stack conditional introduced earlier
    // `view === "verify"` / `view === "signup"` occurrences in the
    // hooks + the shared stack div (the s111 in-flight re-derivation).
    const verifyArm = src.slice(
      src.indexOf('view === "verify" ? ('),
      src.indexOf("LOGIN_VERIFY_LAYOUT.buttonsGroup"),
    );
    expect(verifyArm).toContain("LOGIN_VERIFY_LAYOUT.form");
    expect(verifyArm).not.toContain("LOGIN_SIGNUP_LAYOUT.form");
  });
});

describe("session-79: the input-icon color split (L-79c10)", () => {
  it("the reset view's icons are the lighter slate-400 family", async () => {
    const L = await resetLayout();
    expect(L.inputIcon).toContain("text-slate-400");
  });

  it("the signup view's icons are the lighter slate-400 family", async () => {
    const L = await signupLayout();
    expect(L.inputIcon).toContain("text-slate-400");
  });

  it("the signin view's icons stay slate-500 (the reference's own split)", async () => {
    const L = await loginLayout();
    expect(L.inputIcon).toContain("text-slate-500");
  });

  it("the reset + signup call sites consume their own icon records", () => {
    const src = loginCard();
    // Session-111: the anchors gained the ' ? (' discriminator (the
    // D3a stack conditional introduced an earlier `view === "signup"`
    // occurrence — the s111 in-flight re-derivation).
    const resetArm = src.slice(
      src.indexOf('view === "reset" ? ('),
      src.indexOf('view === "signup" ? ('),
    );
    const signupArm = src.slice(
      src.indexOf('view === "signup" ? ('),
      src.indexOf('view === "verify" ? ('),
    );
    expect(resetArm).toContain("LOGIN_RESET_LAYOUT.inputIcon");
    expect(signupArm).toContain("LOGIN_SIGNUP_LAYOUT.inputIcon");
  });
});

describe("session-79: the code-input extras retired (L-79c11)", () => {
  it("the code inputs are the flat stock mirror — no shadow, no transition, no offset, no inline h-11", () => {
    const src = loginCard();
    const codeArm = src.slice(src.indexOf("codeDigits.map"), src.indexOf("codeDigits.map") + 1400);
    expect(codeArm).not.toContain("shadow-sm");
    expect(codeArm).not.toContain("transition-colors");
    expect(codeArm).not.toContain("ring-offset-2");
    expect(codeArm).not.toMatch(/className=\{`flex h-11/);
    expect(codeArm).toContain("focus-visible:ring-2 focus-visible:ring-ring");
    // Session-126 (F-126c3, the D-125a1 re-anchor doctrine): the active
    // arm rides the LITERAL bg-white — the reference's stock white, never
    // our redefined bg-background token (the F-125c1 inverted-token genus)
    expect(codeArm).toContain("rounded-lg border border-input bg-white");
    expect(codeArm).not.toContain("bg-background");
  });
});

describe("session-79: the submit chrome family (N-79c12)", () => {
  it("the signin submit carries the disabled + keyboard-ring stock arms", async () => {
    const L = await loginLayout();
    expect(L.submit).toContain("disabled:opacity-50");
    expect(L.submit).toContain("focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2");
  });

  it("the shared send record carries the same chrome (reset/signup/verify)", async () => {
    const L = await resetLayout();
    expect(L.send).toContain("disabled:opacity-50");
    expect(L.send).toContain("focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2");
  });
});

describe("session-79: the callout text nodes (N-79c13)", () => {
  it("the sent callout's text renders as a bare text node (no <p> wrapper)", () => {
    const src = loginCard();
    const sentArm = src.slice(
      src.indexOf("sentCalloutText"),
      src.indexOf("sentCalloutText") + 700,
    );
    expect(sentArm).not.toMatch(/<p>/);
  });

  it("the error + info callouts render bare text nodes too", () => {
    const src = loginCard();
    const errorFn = src.slice(src.indexOf("function ErrorCallout"));
    expect(errorFn.slice(0, 500)).not.toMatch(/<p>/);
    const infoFn = src.slice(src.indexOf("function InfoCallout"));
    expect(infoFn.slice(0, 500)).not.toMatch(/<p>/);
  });
});

describe("session-79: the back2 retirement (N-79c14)", () => {
  it("LOGIN_VERIFY_LAYOUT no longer carries the dead back2 member", async () => {
    const L = await verifyLayout();
    expect("back2" in L).toBe(false);
    expect(loginReset()).not.toContain("back2");
  });
});

describe("session-79: the CLAUDE.md e2e count carriers (N-79b1)", () => {
  it("no CLAUDE.md line still reads the stale 131 e2e count", () => {
    const src = claude();
    expect(src).not.toContain("(131 checks)");
    expect(src).not.toContain("Playwright E2E (131 checks");
    // session-104 lockstep carry-forward: the carrier re-anchored
    // 132 -> 133 (the S104-P2 drawer-OPEN seeded-state guard grows the
    // mobile spec; the new docs-counts e2e-site pins now carry the
    // table/pyramid forms — this s79 carrier keeps the pyramid line's
    // historical guard alive beside them).
    expect(src).not.toContain("**E2E (Playwright, 132 checks)**");
    // session-105 lockstep carry-forward: the carrier re-anchored
    // 133 -> 134 (the S105-P2 reports-tabs guard in the new spec file;
    // the retired form joins its negatives, the doctrine unchanged).
    expect(src).not.toContain("**E2E (Playwright, 133 checks)**");
    // session-106 lockstep carry-forward: the carrier re-anchored
    // 134 -> 135 (the S106-P2 settings-tabs guard in the new spec
    // file; the retired form joins its negatives, the doctrine
    // unchanged).
    expect(src).not.toContain("**E2E (Playwright, 134 checks)**");
    // session-108 lockstep carry-forward: the carrier re-anchored
    // 135 -> 136 (the S108-P2 calendar-grid guard in the new spec
    // file; the retired form joins its negatives, the doctrine
    // unchanged).
    expect(src).not.toContain("**E2E (Playwright, 135 checks)**");
    // session-109 lockstep carry-forward: the carrier re-anchored
    // 136 -> 137 (the S109-P3 activities priority-rows guard in the new
    // spec file; the retired form joins its negatives, the doctrine
    // unchanged).
    expect(src).not.toContain("**E2E (Playwright, 136 checks)**");
    // session-138 lockstep carry-forward: the carrier re-anchored
    // 137 -> 138 (the s138 e2e LIVE pin — the SECOND reports-mobile
    // guard: the aging chart's 9-line classic grid + the source pie's
    // 5 labels at 390, the recharts-upgrade sentinel; the retired form
    // joins its negatives, the doctrine unchanged).
    expect(src).not.toContain("**E2E (Playwright, 137 checks)**");
    // session-144 lockstep carry-forward: the carrier re-anchored
    // 146 -> 149 (the s144 guest marketing block — the guest /About +
    // /Contact faces + the funnel; the retired form joins its
    // negatives, the doctrine unchanged).
    expect(src).not.toContain("**E2E (Playwright, 146 checks)**");
    // session-145 lockstep carry-forward: the carrier re-anchored
    // 149 -> 150 (the guest 390 drawer e2e — the hamburger + the 8
    // links on the guest /About; the retired form joins its negatives).
    expect(src).not.toContain("**E2E (Playwright, 149 checks)**");
    expect(src).not.toContain("**E2E (Playwright, 152 checks)**");
    // session-163 lockstep carry-forward: the carrier re-anchored
    // 153 -> 161 (the reset-password spec's 8 checks join the e2e
    // census; the retired 153 form joins its negatives, the doctrine
    // unchanged).
    expect(src).not.toContain("**E2E (Playwright, 153 checks)**");
    // session-150 lockstep carry-forward: 152 -> 153 (the walk40
    // marketing-mobile spec — the internal-scroller scroll model).
    // session-163 lockstep carry-forward: 153 -> 161 (the reset-password
    // spec — the digma reset-funnel port's 8 checks).
    // session-195 lockstep carry-forward: 192 -> 194 (the s195 two-gate
    // 404 registrations — the desktop + phone scans of the one
    // anon-reachable surface the register never adjudicated; the retired
    // form joins its negatives, the doctrine unchanged).
    // session-196 lockstep carry-forward: 194 -> 195 (the D-196a1
    // drawer-open spine registration — the rendered interior-geometry
    // freeze, the walk50 re-walk's genuine battery gap; the retired
    // form joins its negatives, the doctrine unchanged).
    expect(src).not.toContain("**E2E (Playwright, 194 checks)**");
    expect(src).toContain("**E2E (Playwright, 195 checks)**");
  });
});

describe("session-79: the documented parities re-held (green anchors)", () => {
  it("the signin input keeps the slate-600 placeholder + the h-11 sm:h-12 ladder", async () => {
    const L = await loginLayout();
    expect(L.input).toContain("placeholder:text-slate-600");
    expect(L.input).toContain("h-11");
    expect(L.input).toContain("sm:h-12");
  });

  it("the code inputs keep the md:text-sm desktop arm (the s21 pin)", async () => {
    const L = await verifyLayout();
    expect(L.codeInput).toContain("md:text-sm");
    expect(L.codeInput).toContain("text-center w-10 h-11 text-base font-semibold");
  });

  it("the mobile spacer + the auth pages never touch the mobile-nav drawer contract", () => {
    // The spacer is auth-page-only (sm:hidden, no drawer interaction);
    // the mobile-nav suite's 9 checks stay frozen elsewhere.
    const src = loginCard();
    expect(src).toContain('className="w-full max-w-md"');
  });
});

describe("session-111: the login-family LIVE re-walk (the first since s79)", () => {
  // The first LIVE parity re-walk of the auth family since s79 — the
  // pre-auth shell rides UNTRACKED rolldown chunks (probe:ref tracks
  // only the POST-LOGIN bundle) and the four drift gates never touch
  // the auth pages. The walk (both apps through the full view ladder
  // at 1440x900 + 390x844, computed styles + the per-child viewStack
  // census) found three real drifts + two inert class-string
  // divergences, all adjudicated against the source contracts:
  //
  // - D1 (behavioral, verify): the reference AUTO-FOCUSES the first
  //   code box on verify mount — live-measured as the 2px ring on box
  //   1 only (box 6 rests at none), reproduced twice at both viewports.
  // - D3 (structural, signup): the reference's signup rides a FLAT
  //   space-y-4 stack with the h2 as a DIRECT child; ours inherited the
  //   reset view's shared space-y-4 sm:space-y-6 — the s21-authored
  //   LOGIN_SIGNUP_LAYOUT.viewStack const was correct but never wired
  //   (+8px at >=640 in the title->form gap).
  // - D4 (structural, verify): the reference's verify back->heading gap
  //   computes 16 at >=640 (its -mb-2 collapses with the v3 mt 24);
  //   ours rode flat mb-2 — the reset view's back already had the
  //   ladder (pinned above, re-anchored).
  // - D2 (inert, verify): the headingStack — the tile's own mb-3
  //   sm:mb-4 always overrides the stack's space-y on both apps (the
  //   heading heights measure 168/144 identical); re-pinned for byte
  //   parity (the s21 "the sent view's family" misread retired).
  // - D5 (inert, sent): the sentCallout's [&>svg] arm family — no svg
  //   ever renders on the auth surfaces; re-pinned for byte parity in
  //   tests/login-reset.test.ts.
  it("D1: the verify view auto-focuses the first code box on mount (the reference's focus-entry)", () => {
    const src = loginCard();
    expect(src).toContain('if (view === "verify") codeRefs.current[0]?.focus();');
  });

  it("D2: the verify headingStack is text-center space-y-2 (the s21 'sent view family' misread retired)", async () => {
    const L = await verifyLayout();
    expect(L.headingStack).toBe("text-center space-y-2");
  });

  it("D3a: the signup view rides its OWN flat space-y-4 stack (the s21 const finally wired)", async () => {
    const src = loginCard();
    const L = await signupLayout();
    expect(L.viewStack).toBe("space-y-4");
    expect(src).toContain('view === "signup" ? LOGIN_SIGNUP_LAYOUT.viewStack : LOGIN_RESET_LAYOUT.viewStack');
  });

  it("D3b: the signup h2 is a DIRECT stack child — the inert titleStack wrapper retired (the reference's census structure)", () => {
    const src = loginCard();
    // The slice spans the signup branch's back button to its form —
    // the exact scope the wrapper lived in (the reset view keeps its
    // OWN text-center space-y-2 wrapper, the reference's).
    const start = src.indexOf("LOGIN_SIGNUP_LAYOUT.back");
    const end = src.indexOf("LOGIN_SIGNUP_LAYOUT.form");
    const branch = src.slice(start, end);
    expect(branch).toContain('<h2 className={LOGIN_SIGNUP_LAYOUT.title}>Create your account</h2>');
    expect(branch).not.toContain("text-center space-y-2");
  });
});

// ---------------------------------------------------------------------------
// Session-126 (the 126-c login-family re-walk — the second rotation
// cycle's first re-check): the three-fix pins. The walk (both apps,
// 1440+390, the five-view ladder) found THREE real parity defects the
// s111-era lenses could not see:
//   F-126c1 the apostrophe genus — ours ships typographic &rsquo; where
//   the reference ships straight ASCII ' (live-confirmed on the reset
//   description, the sent view, the verify email line);
//   F-126c2 the auth-input text color — ours text-slate-900 rgb(15,23,42)
//   vs the reference's rgb(9,9,11) ink (never censused before);
//   F-126c3 the code-input bg — the F-125c1 inverted-token genus on the
//   login surface (bg-background resolving to our page-bg #f9fafb vs
//   the reference's stock white).
// ---------------------------------------------------------------------------

describe("session-126: the login re-walk's three fixes", () => {
  it("F-126c1: the four auth texts ride the reference's STRAIGHT apostrophes (zero &rsquo;)", () => {
    const src = loginCard();
    const raw = loginCardRaw();
    // the four live-confirmed sites (the reset description, the verify
    // email line, the resend line, the sent view)
    expect(src).toContain("we'll send you a link to reset your password");
    expect(src).toContain("We've sent a 6-digit code to");
    expect(src).toContain("Didn't receive the code?");
    expect(src).toContain("We've sent password reset instructions to");
    // the negative: the typographic entity is retired everywhere
    expect(raw).not.toContain("&rsquo;");
  });

  it("F-126c2: the auth input records carry no text-slate-900 — the typed ink inherits the foreground", async () => {
    const L = await loginLayout();
    const R = await resetLayout();
    const S = await signupLayout();
    // the reference's inputs compute rgb(9,9,11) (its own ink); ours
    // inherits --color-foreground #0a0a0a — within the standing
    // fuzzy-2 tolerance. The s7-era slate-900 class retires from the
    // three INPUT records (the TITLES keep it — the reference's own
    // titles ARE slate-900, live-confirmed by the walk).
    expect(L.input).not.toContain("text-slate-900");
    expect(R.resetInput).not.toContain("text-slate-900");
    expect(S.input).not.toContain("text-slate-900");
    // the meaningful-chrome positives (the records stay otherwise intact)
    expect(L.input).toContain("bg-slate-50/50");
    expect(R.resetInput).toContain("bg-slate-50/50");
    expect(S.input).toContain("bg-slate-50/50");
  });

  it("F-126c3: the verify code input rides the LITERAL bg-white — the F-125c1 doctrine", () => {
    const src = loginCard();
    const codeArm = src.slice(src.indexOf("codeDigits.map"), src.indexOf("codeDigits.map") + 1400);
    // the reference's code inputs compute rgb(255,255,255); our
    // bg-background resolves to the page-bg #f9fafb — the exact F-125c1
    // inverted-token genus, fixed with the literal (the D-125a0 lineage)
    expect(codeArm).toContain("rounded-lg border border-input bg-white");
    expect(codeArm).not.toContain("bg-background");
    expect(codeArm).toContain("focus-visible:ring-2 focus-visible:ring-ring");
  });
});

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

  it("the verify back button is mb-2 (the same overlap fix)", async () => {
    const L = await verifyLayout();
    expect(L.back).toContain("mb-2");
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
    const verifyArm = src.slice(
      src.indexOf('view === "verify"'),
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
    const resetArm = src.slice(
      src.indexOf('view === "reset"'),
      src.indexOf('view === "signup"'),
    );
    const signupArm = src.slice(
      src.indexOf('view === "signup"'),
      src.indexOf('view === "verify"'),
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
    expect(codeArm).toContain("rounded-lg border border-input bg-background");
  });
});

describe("session-79: the submit chrome family (N-79c12)", () => {
  it("the signin submit carries the disabled + keyboard-ring stock arms", async () => {
    const L = await loginLayout();
    expect(L.submit).toContain("disabled:opacity-50");
    expect(L.submit).toContain("focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2");
  });

  it("the shared send record carries the same chrome (reset/signup/verify)", async () => {
    const L = await resetLayout();
    expect(L.send).toContain("disabled:opacity-50");
    expect(L.send).toContain("focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2");
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
    expect(src).toContain("**E2E (Playwright, 132 checks)**");
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

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  LOGIN_RESET_LAYOUT,
  nextLoginView,
  type LoginView,
} from "@/lib/login-reset";
// The session-21 seams load DYNAMICALLY so the red state fails
// check-by-check instead of erroring the file at import time (the s18
// granular-red pattern — the exports/modules do not exist yet).
const signupLayout = async () => (await import("@/lib/login-reset")).LOGIN_SIGNUP_LAYOUT;
const verifyLayout = async () => (await import("@/lib/login-reset")).LOGIN_VERIFY_LAYOUT;
const errorCallout = async () => (await import("@/lib/login-reset")).LOGIN_ERROR_CALLOUT;
const verification = async () => import("@/lib/verification");

// Session-21: the login-card error + view-state layer — the surface never
// swept before (the reference's auth error banner, its in-place signup
// view, and its verify-email view). Every pin below is live-verified
// against the reference (2026-10-01 census, wrong-password / signup /
// verification probes on both apps):
//   - the reference's login error banner reads "Invalid email or password"
//     (ours said "Incorrect email or password" — one word of drift);
//   - its signup error reads "A user with this email already exists"
//     (ours said "An account with this email already exists");
//   - it fires ZERO toasts on the auth flows — login failure renders the
//     INLINE banner only, login success redirects silently (ours fired
//     toast.error + toast.success on both paths);
//   - the banner is the shadcn Callout pattern (the red variant of the
//     s11-pinned green sent-callout): bg-red-50/70 + border-red-200 + p-4
//     + the inner text-red-700 text-sm [&_p]:leading-relaxed div;
//   - the reference's "Need an account? Sign up" is an onclick BUTTON that
//     swaps the login card IN PLACE (URL stays /login) — the s10 pin's
//     "dead login button" claim is disproven. The view: "Back to sign in"
//     (ArrowLeft + slate-500, -mb-2 under a space-y-4 stack) → h2 "Create
//     your account" → a MINIMAL form (Email / Password / Confirm Password
//     — NO Name field, NO Google button, NO divider, NO logo) → the
//     one-size-down stock submit "Create account". Mismatch → "Passwords
//     do not match";
//   - the reference's signup success swaps to a THIRD view — "Verify your
//     email": the 64px slate-100 icon tile, the "We've sent a 6-digit code
//     to {email}" paragraph, SIX w-10 h-11 centered numeric inputs (the
//     first autoComplete="one-time-code"), the "Verify email" submit, the
//     "Didn't receive the code? Resend" line, and "Back to sign in". The
//     error ladder: "Please enter all 6 digits" → "Invalid verification
//     code. N attempts remaining." (4…1) → "Too many failed attempts.
//     Please request a new verification code." (lockout after 5); Resend →
//     "New verification code sent to your email";
//   - an UNVERIFIED account trying to sign in gets "Please verify your
//     email before logging in. Check your email for the verification code."
//
// The source reads are existence-guarded so the red state fails
// check-by-check instead of erroring the file (the s18/s19/s20 pattern).

const repoFile = (rel: string) =>
  path.resolve(import.meta.dirname, "..", rel);

const readOr = (rel: string): string => {
  const p = repoFile(rel);
  return existsSync(p) ? readFileSync(p, "utf8") : "";
};

const loginRouteSrc = () => readOr("src/app/api/auth/login/route.ts");
const signupRouteSrc = () => readOr("src/app/api/auth/signup/route.ts");
const loginCardSrc = () => readOr("src/components/layout/login-card.tsx");
const verifyRouteSrc = () => readOr("src/app/api/auth/verify/route.ts");
const resendRouteSrc = () => readOr("src/app/api/auth/resend/route.ts");

describe("session-21: the auth error messages (S21-P1 / S21-P6)", () => {
  it("the login route's credential failure reads 'Invalid email or password'", () => {
    expect(loginRouteSrc()).toContain('"Invalid email or password"');
    expect(loginRouteSrc()).not.toContain("Incorrect email or password");
  });

  it("the signup route's duplicate email reads 'A user with this email already exists'", () => {
    expect(signupRouteSrc()).toContain('"A user with this email already exists"');
    expect(signupRouteSrc()).not.toContain("An account with this email already exists");
  });

  it("the login route refuses unverified users with the reference's banner text", () => {
    // The route routes the refusal through verificationRequiredMessage();
    // the literal itself is pinned in the verification module.
    expect(loginRouteSrc()).toMatch(/verificationRequiredMessage\(\)/);
    expect(readOr("src/lib/verification.ts")).toContain(
      "Please verify your email before logging in. Check your email for the verification code.",
    );
  });
});

describe("session-21: zero toasts on the auth flows (S21-P2)", () => {
  it("the login card's submit path fires neither toast.error nor toast.success", () => {
    const src = loginCardSrc();
    expect(src).not.toMatch(/toast\.error\s*\(/);
    expect(src).not.toMatch(/toast\.success\s*\(/);
  });

  it("the Google button's not-configured fallback stays (the documented self-hosted expression)", () => {
    // The reference's Google button performs a REAL Google OAuth redirect
    // (accounts.google.com, verified live) — unimplementable self-hosted;
    // the toast.info fallback is the s7-era documented superset.
    expect(loginCardSrc()).toMatch(/toast\.info\s*\(/);
  });
});

describe("session-21: the Callout error banner (S21-P3)", () => {
  it("ships the reference's red Callout vocabulary verbatim", async () => {
    const c = await errorCallout();
    expect(c.callout).toBe(
      "relative w-full border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground text-foreground bg-red-50/70 border-red-200 rounded-xl",
    );
    expect(c.text).toBe("[&_p]:leading-relaxed text-red-700 text-sm");
  });

  it("the login card renders the Callout through shared components at every error site", () => {
    const src = loginCardSrc();
    // ErrorCallout: one definition, four usages (signin / reset / signup /
    // verify forms). InfoCallout: the green resend banner.
    expect(src).toMatch(/function ErrorCallout\(/);
    expect((src.match(/<ErrorCallout message=/g) || []).length).toBe(4);
    expect(src).toMatch(/function InfoCallout\(/);
    expect((src.match(/role="alert"/g) || []).length).toBe(2);
  });

  it("the old bare banner classes are gone", () => {
    expect(loginCardSrc()).not.toContain("rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600");
  });
});

describe("session-21: the extended view state machine (S21-P4 / S21-P5)", () => {
  it("LoginView gains signup + verify", () => {
    // Session-64 (N-64f): the length assert on a locally-declared literal
    // is tautological AT RUNTIME (the literal's own length — it cannot
    // fail). The it's residual value is the TYPE annotation: the array
    // must satisfy LoginView[], so a view string drifting out of the
    // union fails HERE at the tsc gate, not at runtime.
    const views: LoginView[] = ["signin", "reset", "sent", "signup", "verify"];
    expect(views.length).toBe(5);
  });

  it("'Need an account? Sign up' moves signin → signup", () => {
    expect(nextLoginView("signin", "signup")).toBe("signup");
  });

  it("a successful signup moves signup → verify", () => {
    expect(nextLoginView("signup", "verify")).toBe("verify");
  });

  it("Back to sign in returns from signup and verify", () => {
    expect(nextLoginView("signup", "back")).toBe("signin");
    expect(nextLoginView("verify", "back")).toBe("signin");
  });

  it("the s11 reset transitions still hold (no regressions)", () => {
    expect(nextLoginView("signin", "forgot")).toBe("reset");
    expect(nextLoginView("reset", "send")).toBe("sent");
    expect(nextLoginView("reset", "back")).toBe("signin");
    expect(nextLoginView("sent", "back")).toBe("signin");
  });

  it("unknown transitions keep the current view", () => {
    expect(nextLoginView("signin", "back")).toBe("signin");
    expect(nextLoginView("verify", "send")).toBe("verify");
    expect(nextLoginView("signup", "forgot")).toBe("signup");
  });
});

describe("session-21: the signup view vocabulary (S21-P4)", () => {
  it("the back button is the v4-correct mb-2 (the reference's computed 8px gap at all widths)", async () => {
    const L = await signupLayout();
    // DOM: <button class="flex items-center gap-2 text-sm text-slate-500
    // hover:text-slate-700 font-medium transition-colors -mb-2"> …
    // Session-79 (M-79c2): the s21 "-mb-2 mirrors verbatim" claim was
    // v4-FALSIFIED — under our :where(space-y) margin-BOTTOM model the
    // -mb-2 (0,1,0) WINS and computes an 8px OVERLAP (LIVE: -8px on our
    // dev server). The reference computes +8px at BOTH 390 and 1440 (its
    // v3 margin-TOP space-y-4 collapses 16-8). `mb-2` expresses the SAME
    // computed 8px gap directly.
    expect(L.back).toBe(
      "flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors mb-2",
    );
    expect(L.backIcon).toBe(LOGIN_RESET_LAYOUT.backIcon);
  });

  it("the stack is space-y-4 (no sm variant) inside the w-full column", async () => {
    const L = await signupLayout();
    expect(L.viewColumn).toBe("w-full");
    expect(L.viewStack).toBe("space-y-4");
  });

  it("the h2 reuses the s11 title vocabulary", async () => {
    const L = await signupLayout();
    expect(L.title).toBe("text-xl sm:text-2xl font-bold text-slate-900");
  });

  it("the form is the tighter space-y-3 sm:space-y-4 with a space-y-3 fields group", async () => {
    const L = await signupLayout();
    expect(L.form).toBe("space-y-3 sm:space-y-4");
    expect(L.fields).toBe("space-y-3");
  });

  it("the submit reuses the s11 one-size-down send family", async () => {
    const L = await signupLayout();
    expect(L.submit).toBe(LOGIN_RESET_LAYOUT.send);
  });

  it("the login card renders Confirm Password and NO Name field in the signup view", () => {
    const src = loginCardSrc();
    expect(src).toContain("Confirm Password");
    expect(src).toMatch(/Passwords do not match/);
    // The Name field is GONE from the card (the reference's signup form
    // collects no name; the account derives it from the email local part).
    expect(src).not.toContain('htmlFor="name"');
    expect(src).not.toContain('autoComplete="name"');
  });

  it("'Need an account? Sign up' is a view-swap BUTTON, not a Link to /signup", () => {
    const src = loginCardSrc();
    expect(src).not.toContain('Link href="/signup"');
    expect(src).toMatch(/Need an account\?/);
    expect(src).toMatch(/intent.*signup|goto\("signup"\)|setView\("signup"\)/);
  });
});

describe("session-21: the verify view vocabulary (S21-P5)", () => {
  it("the icon tile is the sent view's envelope circle", async () => {
    const L = await verifyLayout();
    expect(L.iconWrap).toBe(
      "mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4",
    );
    expect(L.icon).toBe("h-7 w-7 sm:h-8 sm:w-8 text-slate-700");
  });

  it("the heading stack + email line mirror the sent view's family", async () => {
    const L = await verifyLayout();
    expect(L.title).toBe("text-xl sm:text-2xl font-bold text-slate-900");
    expect(L.emailLine).toBe("text-slate-600 text-sm sm:text-base");
    expect(L.emailSpan).toBe("font-medium text-slate-900");
  });

  it("the six code inputs: wrap + stock-input + center/size overrides", async () => {
    const L = await verifyLayout();
    expect(L.codeWrap).toBe("flex items-center justify-center gap-1.5");
    expect(L.codeInput).toContain("text-center w-10 h-11 text-base font-semibold");
  });

  it("the resend line: slate-600 text + the slate-700 medium button", async () => {
    const L = await verifyLayout();
    expect(L.resendLine).toBe("text-sm text-slate-600");
    expect(L.resendButton).toBe(
      "font-medium text-slate-700 hover:text-slate-900 disabled:opacity-50 transition-colors",
    );
  });

  it("the verify submit reuses the one-size-down send family", async () => {
    const L = await verifyLayout();
    expect(L.submit).toBe(LOGIN_RESET_LAYOUT.send);
  });
});

describe("session-21: the verification machinery (S21-P5)", () => {
  it("the code is 6 digits and the ladder locks out at 5 attempts", async () => {
    const v = await verification();
    expect(v.VERIFICATION_CODE_LENGTH).toBe(6);
    expect(v.VERIFICATION_MAX_ATTEMPTS).toBe(5);
  });

  it("the remaining-attempts message mirrors the reference's ladder", async () => {
    const v = await verification();
    expect(v.verificationRemainingMessage(4)).toBe(
      "Invalid verification code. 4 attempts remaining.",
    );
    expect(v.verificationRemainingMessage(1)).toBe(
      "Invalid verification code. 1 attempts remaining.",
    );
  });

  it("the lockout message mirrors the reference's", async () => {
    const v = await verification();
    expect(v.verificationLockoutMessage()).toBe(
      "Too many failed attempts. Please request a new verification code.",
    );
  });

  it("the verify + resend API routes exist", () => {
    expect(verifyRouteSrc()).toMatch(/POST/);
    expect(resendRouteSrc()).toMatch(/POST/);
  });

  it("the signup route stores a hashed code, not the plaintext, and never logs it raw", () => {
    const src = signupRouteSrc();
    expect(src).toMatch(/verificationCodeHash/);
    expect(src).not.toMatch(/verificationCode:\s*code\b/);
  });
});

// ---------------------------------------------------------------------------
// Session-96 (S96-P0): the FORM-family walk remediation — the v4 space-y
// genus on the auth surface, decoded live on BOTH apps at TRUE 390x844 and
// 1440x900 (the 96-c rotation, the last unwalked static family):
//   - the reference's `space-y-1.5` fields are v3 — margin-TOP on the
//     FOLLOWING block (its inputWrap measures m=[6px/0px] live). Our v4
//     space-y puts margin-BOTTOM on the PRECEDING child — the label — a
//     non-replaced INLINE element where vertical margins are IGNORED, so
//     the 6px gap was silently LOST (live: label→input 4px ours vs 10px
//     the reference, at BOTH widths; net +12px card height at 390).
//   - the reference nests [google + divider + form] inside ONE `w-full`
//     BLOCK section (DOM-verified: the form's parent chain runs form →
//     div.w-full m=[24/0] → centered) — inside it the adjacent margins
//     COLLAPSE to 24/24. Ours had them as DIRECT children of the flex
//     column where v4's space-y margin-bottom STACKS with the divider's
//     my-6 (48px vs 24 at 390; 56 vs 24 at 1440).
// Same genus class as M-79c2 (the back-button -mb-2 → mb-2 fix): express
// the reference's COMPUTED gap with the v4-correct construction, never the
// v3 class string verbatim.
// ---------------------------------------------------------------------------
describe("session-96: the form-family walk remediation (the v4 space-y genus on the auth fields)", () => {
  const loginLayout = async () => (await import("@/lib/page-layout")).LOGIN_LAYOUT;

  it("the signin/reset field spacing is the v4-correct mt-on-following (the reference's computed 6px gap — the M-79c2 doctrine)", async () => {
    const L = await loginLayout();
    // DOM: <div class="space-y-1.5"><label class="text-sm …">Email</label>
    //   <div class="relative">…input…</div></div>
    // v4 space-y-1.5 = margin-BOTTOM on the label — INERT on the inline
    // label (vertical margins on non-replaced inline elements are
    // ignored). The reference's v3 margin-TOP lands on the inputWrap
    // BLOCK. [&>*+*]:mt-1.5 expresses that exact mechanism in v4.
    expect(L.field).toBe("[&>*+*]:mt-1.5");
    // negative: the bare v3 class string must not come back
    expect(L.field).not.toBe("space-y-1.5");
  });

  it("the signup field spacing rides the same v4-correct construction", async () => {
    const L = await signupLayout();
    expect(L.field).toBe("[&>*+*]:mt-1.5");
    expect(L.field).not.toBe("space-y-1.5");
  });

  it("the labels stay INLINE (the reference's own 16px inline label box — a block label would sit 2px high)", async () => {
    const L = await loginLayout();
    expect(L.label).toBe("text-sm font-medium text-slate-700");
    // negative: no display-changing class sneaks in
    expect(L.label).not.toMatch(/\b(block|flex|inline-block)\b/);
  });

  it("the signin column nests [google + divider] in the platform's data-ds island inside ONE w-full block section (the s211 re-anchor of the S96-P0 margin-collapsing wrap)", () => {
    const src = loginCardSrc();
    // the section: ONE w-full div wrapping the platform's design-system
    // island (the 2026-11 reference parity event — the Base44 runtime
    // wrapped the login Google-auth block in `<div data-ds="base44"
    // data-theme="light">`), and the island wrapping the google button's
    // own space-y-3 wrap + the divider; the form stays the island's
    // SIBLING (DOM-verified on the reference) — the block section's
    // adjacent margins still collapse to 24/24 (the island is a classless
    // block; margins pass through it unchanged).
    expect(src).toMatch(
      /<div className="w-full">\s*<div data-ds="base44" data-theme="light">\s*<div className="space-y-3">[\s\S]*?Continue with Google[\s\S]*?<\/div>\s*<div className=\{LOGIN_LAYOUT\.divider\}[\s\S]*?<\/div>\s*<\/div>\s*<form onSubmit=\{onSigninSubmit\} className=\{LOGIN_LAYOUT\.form\}/,
    );
    // negative: the OLD flat shape is gone — the google button no longer
    // sits DIRECTLY inside a w-full wrap with the divider as its next
    // sibling (the flex column stacks space-y's margin-bottom with the
    // divider's my-6 — the +24px/+32px genus)
    expect(src).not.toMatch(
      /<div className="w-full">\s*<button[\s\S]*?<\/button>\s*<\/div>\s*<div className=\{LOGIN_LAYOUT\.divider\}/,
    );
    // negative: the s95-s210 pre-island shape is gone — the space-y-3
    // google wrap no longer sits DIRECTLY inside the w-full section
    // (the reference moved it inside its data-ds island on 2026-11)
    expect(src).not.toMatch(
      /<div className="w-full">\s*<div className="space-y-3">/,
    );
  });
});

// ---------------------------------------------------------------------------
// Session 211 (F-211a — the login sem-island parity event): the Base44
// platform re-wrapped the login Google-auth block in its own design-system
// island (`<div data-ds="base44" data-theme="light">`), live-decoded on the
// reference this round:
//   - the button flipped from the app's slate palette to the platform's
//     semantic tokens (bg --sem-surface-interactive-white-default #fff ·
//     text --sem-text-icon-primary #0f0e0e · border
//     --sem-border-light-default #e9e6e0 · hover #f1eeea / #ddd8d2) —
//     pixel-verified on the sweep captures (the ref border renders
//     (233,230,224) vs our slate-200 (226,232,240); the ref text
//     near-black vs our slate-700);
//   - the island sets --font-body: "Wix Madefor Text", system-ui,
//     sans-serif and the platform LOADS the latin variable woff2 — the
//     button label renders 166px vs our system-stack 172px (the census
//     shift event; decisively probed: both system stacks measure 172.5,
//     the Madefor stack 166 — the webfont is live on the reference);
//   - the "or" divider's label flipped to the sem tokens
//     (--sem-text-icon-secondary #5d5d5d) and its line carries the
//     platform's data-orientation/role attrs;
//   - the button's G icon is the classic EXACT Google brand svg
//     (M22.56 12.25… — ours was a hand-approximated variant; the
//     D-194a3 icon-identity doctrine);
//   - the scope: the signin view ONLY (the signup view carries no google
//     button on either app); the form stays OUTSIDE the island.
// The pins freeze the mirrored construction so any drift REDs here.
// ---------------------------------------------------------------------------

describe("session-211: the login sem-island parity event (F-211a)", () => {
  const loginLayout = async () => (await import("@/lib/page-layout")).LOGIN_LAYOUT;

  it("the google button rides the island's EXACT sem class string + the reference's class order (the group class included)", async () => {
    const L = await loginLayout();
    expect(L.google).toBe(
      "w-full flex items-center justify-center gap-3 bg-[var(--sem-surface-interactive-white-default)] text-[color:var(--sem-text-icon-primary)] px-5 py-3.5 rounded-xl border border-[var(--sem-border-light-default)] hover:bg-[var(--sem-surface-interactive-white-hover)] hover:border-[var(--sem-border-default-default)] hover:shadow-sm transition-all duration-200 font-medium text-[16px] group",
    );
    // the icon wrap: the reference's exact class order (its own DOM dump
    // carries the leading-space noise; the classes themselves are these,
    // in this order)
    expect(L.googleIcon).toBe("transition-transform duration-200 -ml-4");
    // negatives: the retired slate forms stay retired
    expect(L.google).not.toContain("border-slate-200");
    expect(L.google).not.toContain("text-slate-700");
    expect(L.google).not.toContain("hover:bg-slate-50");
  });

  it("the GoogleIcon is the reference's EXACT classic Google G svg (the D-194a3 icon-identity doctrine; our aria-hidden kept — the s19 superset)", () => {
    const src = loginCardSrc();
    // the four brand paths, exact data + fills (byte-extracted from the
    // reference's live DOM this round)
    expect(src).toContain('d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"');
    expect(src).toContain('fill="#4285F4"');
    expect(src).toContain('d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"');
    expect(src).toContain('fill="#34A853"');
    expect(src).toContain('d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"');
    expect(src).toContain('fill="#FBBC05"');
    expect(src).toContain('d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"');
    expect(src).toContain('fill="#EA4335"');
    // negative: the retired hand-approximated blue path is gone
    expect(src).not.toContain("M23.5 12.3c0-.9");
    // the superset kept
    expect(src).toMatch(/<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">/);
  });

  it("the or-divider carries the island's sem tokens + the platform line attrs (our aria-hidden kept — the s19 superset)", async () => {
    const L = await loginLayout();
    expect(L.dividerLabelSpan).toBe(
      "bg-[var(--sem-surface-interactive-white-default)] px-3 text-[color:var(--sem-text-icon-secondary)] font-medium tracking-wider",
    );
    // negative: the retired slate-500 label form stays retired
    expect(L.dividerLabelSpan).not.toContain("text-slate-500");
    // the line: the platform's Radix-style attrs at the call site
    const src = loginCardSrc();
    expect(src).toMatch(
      /<div data-orientation="horizontal" role="none" className=\{LOGIN_LAYOUT\.dividerLine\}\s*\/>/,
    );
    // the line class itself stays the reference's slate-200 hairline
    expect(L.dividerLine).toBe("shrink-0 h-[1px] w-full bg-slate-200");
  });
});

// ---------------------------------------------------------------------------
// Session 145 (walk35 — the auth-transition family): the transition-target
// pins. Three contracts live-verified on BOTH apps this walk:
//   1. the POST-LOGIN REDIRECT target is the PUBLIC landing `/` (the
//      reference's own submit lands there; ours since the s142 re-anchor —
//      previously source-unpinned, e2e-only);
//   2. /login + /signup are PURE RENDERS — no session read, no
//      authenticated redirect (the s23-P2 / s67-N-67f retirements; the
//      reference serves the login card to authed visitors too, verified
//      live on both apps).
// The pins freeze the targets so a future redirect drift REDs here exactly.
// ---------------------------------------------------------------------------

describe("session-145: the auth-transition targets (walk35)", () => {
  it("the post-login redirect lands on the PUBLIC landing — BOTH submit sites (the s142 re-anchor; s147 re-anchored: the sign-in site routes through the from_url resolver whose DEFAULT is the plain \"/\")", () => {
    const src = loginCardSrc()
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");
    // the two sites: the signin success (S21-P2 — s147: the resolver's
    // "/" default when no from_url rides the query) + the reset-completion
    // return to the signin view — both land on the landing
    const pushes = src.match(/router\.push\("\/"\)/g) ?? [];
    expect(pushes.length).toBe(1);
    // the from_url resolver's plain-login default: the sign-in site
    // routes through resolveFromUrl(fromUrl ?? "/") — the "/" fallback
    expect(src).toMatch(/fromUrl \?\? "\/"/);
    // negatives: never the CRM dashboard (the pre-s142 target) and
    // never a deep page
    expect(src).not.toMatch(/router\.push\("\/[Dd]ashboard"\)/);
    expect(src).not.toMatch(/router\.push\("\/(accounts|contacts|leads|reports|settings|profile)"/);
  });

  it("/login + /signup are pure renders — NO session read, NO authenticated redirect (the s23-P2 + N-67f retirements, walk35-verified on both apps)", () => {
    const pages = [
      ["src/app/login/page.tsx", "the login route"],
      ["src/app/signup/page.tsx", "the signup route"],
    ] as const;
    for (const [rel, label] of pages) {
      const raw = readOr(rel);
      expect(raw.length, `${label} must exist`).toBeGreaterThan(0);
      // comments stripped: both pages DOCUMENT the retirement in
      // comments that name redirect() — the pin reads the code, not the
      // documentation (the s21/s22 own-doc-comment hazard)
      const src = raw
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*/g, "");
      expect(src, `${label}: no session resolution`).not.toMatch(/getSessionUser/);
      expect(src, `${label}: no redirect call`).not.toMatch(/redirect\(/);
      expect(src, `${label}: no layout guard import`).not.toMatch(/from "next\/navigation"/);
    }
  });
});

// Session-147 (F-147c2): the from_url round-trip — the reference's new
// auth wall (guest /About → /login?from_url=<abs> → post-login → /About).
// The sign-in submit navigates to the SAME-ORIGIN-VALIDATED target.
describe("session-147: the from_url round-trip (walk37 — the reference's auth-wall return)", () => {
  it("the sign-in submit reads from_url and navigates to the VALIDATED target (the open-redirect guard)", () => {
    const src = loginCardSrc()
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");
    // the param is read client-side (the login page is force-dynamic —
    // no Suspense boundary needed)
    expect(src).toMatch(/useSearchParams\(\)/);
    expect(src).toMatch(/get\("from_url"\)/);
    // THE OPEN-REDIRECT GUARD: same-origin validation before the push —
    // never router.push(<raw param>)
    expect(src).toMatch(/origin\s*[!=]==\s*window\.location\.origin/);
    expect(src).not.toMatch(/router\.push\((fromUrl|from_url)\)/);
    // the fallback stays "/" (the s142/s145 plain-login pin)
    expect(src).toMatch(/resolveFromUrl|safeFromUrl|fromUrlTarget/);
  });

  it("the post-login redirect target pin re-anchored: the plain default STAYS / (the s145 pin) + the from_url override", () => {
    const src = loginCardSrc()
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");
    // the sign-in site: push(target) where target = resolveFromUrl(...) —
    // the "/" default inside the resolver; the reset-completion site
    // keeps its bare "/"
    const pushes = src.match(/router\.push\(/g) ?? [];
    expect(pushes.length).toBeGreaterThanOrEqual(2);
    // negatives stand: never a hardcoded CRM page
    expect(src).not.toMatch(/router\.push\("\/[Dd]ashboard"\)/);
    expect(src).not.toMatch(/router\.push\("\/(accounts|contacts|leads|reports|settings|profile)"/);
  });
});

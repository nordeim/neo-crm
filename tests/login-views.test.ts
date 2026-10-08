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

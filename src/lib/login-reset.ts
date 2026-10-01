/**
 * The login card's reset-password flow — session 11 (S11-P1).
 *
 * The reference's "Forgot password?" button is NOT dead: it swaps the login
 * card IN PLACE (the URL stays /login) through two views:
 *
 *   signin → (Forgot password?) → reset → (Send reset link) → sent
 *                              └── (Back to sign in) ──┘
 *
 * The reference never sends an email — its demo renders the "Check your
 * email" confirmation purely from client state (no network call fires; the
 * request log shows only analytics pings). Our clone mirrors the two views
 * exactly; a self-hosted deployment can wire a real sender behind
 * {@link canSubmitReset} without touching the view classes.
 *
 * Every class string below is DOM-extracted from the live reference at
 * 1512×945 and pinned by tests/login-reset.test.ts. Both views replace the
 * login column's content entirely — the logo, the Google button and the
 * divider are NOT part of them.
 *
 * ------------------------------------------------------------------
 * Session 21 (S21-P3/P4/P5) — the same in-place architecture extended to
 * the auth funnel the s10 pin misread as a "dead login button":
 *
 *   signin → (Need an account? Sign up) → signup → (Create account) →
 *            verify → (Verify email / Back to sign in) → signin
 *
 * The reference's "Need an account? Sign up" is an onclick BUTTON (no
 * href, verified live): the card swaps to a MINIMAL signup form — Email /
 * Password / Confirm Password, NO Name field, NO Google button, NO
 * divider — with "Back to sign in" and a one-size-down stock submit
 * "Create account". A successful signup swaps again to the verify-email
 * view (six single-digit inputs + the attempts ladder). The signup view's
 * error banner is the Callout vocabulary below (the red variant of the
 * s11 sent-callout); the -mb-2 on ITS back button is safe to mirror
 * verbatim because the signup stack is space-y-4 at ALL widths (the
 * margin collapse computes 8px under BOTH v3 and v4 — unlike the reset
 * view's sm:space-y-6 case documented above).
 */

/** The five card views. `signin` is the default (the /signup page starts at `signup`). */
export type LoginView = "signin" | "reset" | "sent" | "signup" | "verify";

/** The user intents that move between views. */
export type LoginViewIntent = "forgot" | "send" | "back" | "signup" | "verify";

/**
 * The pure view state machine. Unknown combinations keep the current view
 * (e.g. "back" from signin is a no-op — the button does not render there).
 */
export function nextLoginView(view: LoginView, intent: LoginViewIntent): LoginView {
  if (view === "signin" && intent === "forgot") return "reset";
  if (view === "signin" && intent === "signup") return "signup";
  if (view === "reset" && intent === "send") return "sent";
  if ((view === "reset" || view === "sent") && intent === "back") return "signin";
  if (view === "signup" && intent === "verify") return "verify";
  if ((view === "signup" || view === "verify") && intent === "back") return "signin";
  return view;
}

/**
 * The Send reset link guard. The reference keeps the reset view when the
 * email field is empty or malformed; a non-empty local part + "@" + host
 * part swaps to the sent view.
 */
export function canSubmitReset(email: string): boolean {
  const at = email.indexOf("@");
  return at > 0 && at < email.length - 1 && email.indexOf("@", at + 1) === -1;
}

/** The reset/sent views' class vocabulary (DOM-extracted, see header). */
export const LOGIN_RESET_LAYOUT = {
  /** The w-full column that replaces the login column's content. */
  viewColumn: "w-full",
  /** The space-y-4 sm:space-y-6 stack both views render inside. */
  viewStack: "space-y-4 sm:space-y-6",
  /** The reset view's left-aligned Back to sign in. NOTE: the reference's
   *  class is `… -mb-2`, which under ITS v3-era space-y (margin-TOP on
   *  following siblings) computes a 16px gap to the title (24 − 8). Under
   *  OUR Tailwind v4, space-y is wrapped in :where() and sets
   *  margin-BOTTOM — where a `-mb-2` (0,1,0) WINS the specificity fight
   *  and produces an 8px OVERLAP. `mb-4` is the v4-correct expression of
   *  the same computed 16px gap (16 = 24 − 8, directly).
   *  Live-verified: reference gap 16px / clone gap must be 16px. */
  back: "flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors mb-4",
  /** The back button's ArrowLeft icon size. */
  backIcon: "h-4 w-4",
  /** Both views' h2 — one step below the login h1 (text-xl vs text-2xl). */
  title: "text-xl sm:text-2xl font-bold text-slate-900",
  /** Both views' description / email line. */
  description: "text-slate-600 text-sm sm:text-base",
  /** The reset view's submit — one size below Sign in (h-10 sm:h-11). */
  send:
    "w-full h-10 sm:h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm rounded-xl transition-all duration-200",
  /** The reset view's email input — the login input family one size down
   *  (h-10 sm:h-11 vs the sign-in form's h-11 sm:h-12), same pl-10 mail
   *  icon + slate-50/50 surface. The placeholder is LIGHTER than the
   *  sign-in fields' (slate-400 vs slate-600 — the reference's own
   *  inconsistency, mirrored; DOM: rgb(148,163,184)). */
  resetInput:
    "h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/30 sm:h-11",
  /** The sent view's heading stack (icon circle + title block). */
  sentHeadingStack: "text-center space-y-3 sm:space-y-4",
  /** The sent view's icon circle wrap. */
  sentIconWrap:
    "mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center",
  /** The sent view's lucide-mail icon. */
  sentIcon: "h-7 w-7 sm:h-8 sm:w-8 text-slate-700",
  /** The title + email line stack inside the sent heading. */
  sentTitleStack: "space-y-2",
  /** The "We've sent password reset instructions to" paragraph. */
  sentEmailLine: "text-slate-600 text-sm sm:text-base",
  /** The email itself — medium-weight slate-900. */
  sentEmailSpan: "font-medium text-slate-900",
  /** The green callout box (no icon renders on the reference). */
  sentCallout: "relative w-full border p-4 bg-green-50/70 border-green-200 rounded-xl",
  /** The callout's text (leading-relaxed green-700 14px). */
  sentCalloutText: "[&_p]:leading-relaxed text-green-700 text-sm",
  /** The sent view's full-width centered Back to sign in. */
  sentBack:
    "w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors",
} as const;

/**
 * The signup view's class vocabulary — session 21 (S21-P4), DOM-extracted
 * from the live reference at 1512×844 (the in-place swap the s10 pin
 * misread as a dead button). The column/stack/back/title/submit all ride
 * the SAME families the s11 reset views pinned; only the form spacing
 * (space-y-3 sm:space-y-4 + the space-y-3 fields group) is the signup
 * view's own.
 */
export const LOGIN_SIGNUP_LAYOUT = {
  /** The w-full column that replaces the login column's content. */
  viewColumn: "w-full",
  /** The space-y-4 stack (NO sm variant — unlike the reset view's sm:space-y-6). */
  viewStack: "space-y-4",
  /** The back button — -mb-2 mirrored VERBATIM (the stack's 16px margin
   *  collapses with the -8px to an 8px gap under BOTH v3 and v4; the s11
   *  reset-view hazard does not apply at this width). */
  back: "flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors -mb-2",
  /** The back button's ArrowLeft icon size (the s11 pin). */
  backIcon: "h-4 w-4",
  /** The view's h2 — the s11 title family. */
  title: "text-xl sm:text-2xl font-bold text-slate-900",
  /** The form — one step tighter than the signin form. */
  form: "space-y-3 sm:space-y-4",
  /** The fields group inside the form. */
  fields: "space-y-3",
  /** The field wrapper + label — the signin family (space-y-1.5 + the
   *  stock-label slate-700), DOM-verified on the signup view. */
  field: "space-y-1.5",
  label: "text-sm font-medium text-slate-700",
  /** The input — the s11 resetInput family (h-10 sm:h-11, ONE size down
   *  from the signin form's h-11 sm:h-12), DOM-verified on the reference's
   *  signup view: …pl-10 h-10 sm:h-11 bg-slate-50/50 border-slate-200
   *  focus:border-slate-400 focus:ring-slate-400 rounded-xl
   *  placeholder:text-slate-400 text-sm sm:text-base. */
  input:
    "h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400 text-sm sm:text-base sm:h-11",
  /** The submit — the s11 one-size-down send family. */
  submit: "w-full h-10 sm:h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm rounded-xl transition-all duration-200",
} as const;

/**
 * The verify-email view's class vocabulary — session 21 (S21-P5),
 * DOM-extracted from the live reference at 1512×844. Every element rides
 * the families the s11 sent view already pinned (the icon tile, the title,
 * the email line); the six code inputs are the stock Input plus the
 * reference's center/size overrides.
 */
export const LOGIN_VERIFY_LAYOUT = {
  /** The w-full column + stack (the signup view's space-y-4 family). */
  viewColumn: "w-full",
  viewStack: "space-y-4",
  /** The back button (left-aligned, the -mb-2 family). */
  back: "flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors -mb-2",
  backIcon: "h-4 w-4",
  /** The centered heading stack (the sent view's family). */
  headingStack: "text-center space-y-3 sm:space-y-4",
  /** The envelope tile — the sent view's icon circle + its own mb. */
  iconWrap:
    "mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4",
  icon: "h-7 w-7 sm:h-8 sm:w-8 text-slate-700",
  /** The title + email line stack inside the heading. */
  titleStack: "space-y-2",
  /** The view's h2. */
  title: "text-xl sm:text-2xl font-bold text-slate-900",
  /** The "We've sent a 6-digit code to" paragraph. */
  emailLine: "text-slate-600 text-sm sm:text-base",
  /** The email itself — medium-weight slate-900. */
  emailSpan: "font-medium text-slate-900",
  /** The six code inputs' wrap (DOM: flex items-center justify-center gap-1.5). */
  codeWrap: "flex items-center justify-center gap-1.5",
  /** Each code input — the stock Input + the reference's overrides
   *  (DOM: …text-center w-10 h-11 text-base font-semibold — with the
   *  stock md:text-sm winning at desktop, computed 14px; inputMode
   *  numeric; the FIRST input carries autoComplete="one-time-code", the
   *  rest "off"). NOTE: no w-full — the reference's own w-full+w-10
   *  conflict resolves to 40px under ITS v3 cascade; under our v4 the
   *  same pair flex-shrinks to ~56px, so only w-10 ships. */
  codeInput: "text-center w-10 h-11 text-base font-semibold md:text-sm",
  /** The submit — the s11 one-size-down send family. */
  submit: "w-full h-10 sm:h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm rounded-xl transition-all duration-200",
  /** The "Didn't receive the code? Resend" line (the P itself). */
  resendLine: "text-sm text-slate-600",
  /** The resend line's centered wrapper (DOM: div.text-center > p). */
  resendWrap: "text-center",
  /** The Resend button inside the line. */
  resendButton: "font-medium text-slate-700 hover:text-slate-900 disabled:opacity-50 transition-colors",
  /** The form's buttons group (DOM: div.space-y-3 holding the submit +
   *  the resend line — the verify view's own bottom-of-form family). */
  buttonsGroup: "space-y-3",
  /** The full-width centered Back to sign in below the resend line. */
  back2: "w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors",
} as const;

/**
 * The error-banner Callout — session 21 (S21-P3), DOM-extracted from the
 * live reference (the red variant of the s11 sent-callout, the shadcn
 * Callout pattern). The `[&>svg]` classes position an icon the reference
 * never renders on the auth surfaces — they are part of its own Callout
 * markup and ship verbatim.
 */
export const LOGIN_ERROR_CALLOUT = {
  /** The Callout box. */
  callout:
    "relative w-full border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground text-foreground bg-red-50/70 border-red-200 rounded-xl",
  /** The inner text div. */
  text: "[&_p]:leading-relaxed text-red-700 text-sm",
} as const;

/**
 * The info-banner Callout — session 21 (S21-P5), the GREEN variant the
 * reference renders for the resend confirmation ("New verification code
 * sent to your email", DOM: bg rgba(240,253,244,.7) + border
 * rgb(187,247,208)). It auto-dismisses (~3s, live-bounded 1.6–3.2s)
 * where the error banners persist — the card drives that timing.
 */
export const LOGIN_INFO_CALLOUT = {
  /** The Callout box. */
  callout:
    "relative w-full border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground text-foreground bg-green-50/70 border-green-200 rounded-xl",
  /** The inner text div. */
  text: "[&_p]:leading-relaxed text-green-700 text-sm",
} as const;

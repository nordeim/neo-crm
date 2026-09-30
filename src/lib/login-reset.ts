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
 */

/** The three card views. `signin` is the default (and the signup mode's). */
export type LoginView = "signin" | "reset" | "sent";

/** The user intents that move between views. */
export type LoginViewIntent = "forgot" | "send" | "back";

/**
 * The pure view state machine. Unknown combinations keep the current view
 * (e.g. "back" from signin is a no-op — the button does not render there).
 */
export function nextLoginView(view: LoginView, intent: LoginViewIntent): LoginView {
  if (view === "signin" && intent === "forgot") return "reset";
  if (view === "reset" && intent === "send") return "sent";
  if ((view === "reset" || view === "sent") && intent === "back") return "signin";
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

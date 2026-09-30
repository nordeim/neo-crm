"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";
import { LOGIN_LAYOUT } from "@/lib/page-layout";
import { canSubmitReset, LOGIN_RESET_LAYOUT, nextLoginView, type LoginView } from "@/lib/login-reset";
import { toast } from "@/components/ui/toast";

type Mode = "signin" | "signup";

/**
 * Login card — session-7 re-pin (LOGIN_LAYOUT contracts): the reference's
 * slate design. A borderless glass card (`bg-white/95 backdrop-blur-sm
 * shadow-2xl`) with a gradient accent strip, centered logo/title column,
 * white Google button, `h-11 sm:h-12` slate inputs and a slate-900 submit.
 * The logo is a CSS brand mark (the reference hotlinks a screenshot image;
 * we reproduce the white-circle + blue-dot shape with no external asset).
 * Kept beyond parity: the inline error alert
 * and the signup mode (label ids + button names stay e2e-pinned).
 */
export function LoginCard({ mode = "signin" }: { mode?: Mode }) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // Session-11 (S11-P1): the reference's Forgot-password flow — the card
  // swaps in place through reset → sent (no URL change; the reference's
  // demo never sends an email, the confirmation is pure client state).
  const [view, setView] = React.useState<LoginView>("signin");

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignup ? { name, email, password } : { email, password }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.ok) {
        const message = body?.error?.message ?? "Sign in failed. Try again.";
        setError(message);
        toast.error(isSignup ? "Could not create account" : "Sign in failed", message);
        return;
      }
      toast.success(isSignup ? "Welcome to NEO CRM" : "Signed in", "Redirecting to your dashboard…");
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  /** S11-P1: swap the card's view via the login-reset state machine. */
  function goto(intent: "forgot" | "send" | "back") {
    setView((v) => nextLoginView(v, intent));
  }

  /** S11-P1: the reset view's submit — valid email swaps to the sent view
   *  (the reference renders the confirmation without any network call;
   *  a real sender can be wired behind canSubmitReset later). */
  function onSendResetLink(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmitReset(email)) {
      setError("Enter a valid email address to reset your password.");
      return;
    }
    setError(null);
    setView("sent");
  }

  return (
    <div className="w-full max-w-md">
      <div className={LOGIN_LAYOUT.card}>
        {/* Gradient accent strip along the card's top edge. */}
        <div className={LOGIN_LAYOUT.accent} aria-hidden="true" />

        <div className={LOGIN_LAYOUT.inner}>
          <div className={LOGIN_LAYOUT.centered}>
            {view !== "signin" ? (
              <>
                {/* S11-P1: the reset/sent views replace the login column
                    entirely (no logo, no Google button, no divider —
                    DOM-verified on the reference). */}
                <div className={LOGIN_RESET_LAYOUT.viewColumn}>
                  <div className={LOGIN_RESET_LAYOUT.viewStack}>
                    {view === "reset" ? (
                      <>
                        <button
                          type="button"
                          className={LOGIN_RESET_LAYOUT.back}
                          onClick={() => goto("back")}
                        >
                          <ArrowLeft className={LOGIN_RESET_LAYOUT.backIcon} aria-hidden="true" />
                          Back to sign in
                        </button>
                        <div className="text-center space-y-2">
                          <h2 className={LOGIN_RESET_LAYOUT.title}>Reset your password</h2>
                          <p className={LOGIN_RESET_LAYOUT.description}>
                            Enter your email and we&rsquo;ll send you a link to reset your password
                          </p>
                        </div>
                        <form className="space-y-4 sm:space-y-5" onSubmit={onSendResetLink} noValidate>
                          {error && (
                            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                              {error}
                            </p>
                          )}
                          <div className={LOGIN_LAYOUT.field}>
                            <label htmlFor="reset-email" className={LOGIN_LAYOUT.label}>
                              Email
                            </label>
                            <div className={LOGIN_LAYOUT.inputWrap}>
                              <Mail className={LOGIN_LAYOUT.inputIcon} aria-hidden="true" />
                              <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={LOGIN_RESET_LAYOUT.resetInput}
                              />
                            </div>
                          </div>
                          <button type="submit" className={LOGIN_RESET_LAYOUT.send}>
                            Send reset link
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        <div className={LOGIN_RESET_LAYOUT.sentHeadingStack}>
                          <div className={LOGIN_RESET_LAYOUT.sentIconWrap} aria-hidden="true">
                            <Mail className={LOGIN_RESET_LAYOUT.sentIcon} />
                          </div>
                          <div className={LOGIN_RESET_LAYOUT.sentTitleStack}>
                            <h2 className={LOGIN_RESET_LAYOUT.title}>Check your email</h2>
                            <p className={LOGIN_RESET_LAYOUT.sentEmailLine}>
                              We&rsquo;ve sent password reset instructions to
                              <br />
                              <span className={LOGIN_RESET_LAYOUT.sentEmailSpan}>{email}</span>
                            </p>
                          </div>
                        </div>
                        <div className={LOGIN_RESET_LAYOUT.sentCallout}>
                          <div className={LOGIN_RESET_LAYOUT.sentCalloutText}>
                            <p>
                              Please check your email for the password reset link. It may take a few
                              minutes to arrive.
                            </p>
                          </div>
                        </div>
                        <button type="button" className={LOGIN_RESET_LAYOUT.sentBack} onClick={() => goto("back")}>
                          <ArrowLeft className={LOGIN_RESET_LAYOUT.backIcon} aria-hidden="true" />
                          Back to sign in
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
            {/* Logo — CSS brand mark (white circle + blue dot) with a soft
                slate glow, ringed and shadowed like the reference avatar. */}
            <div className={LOGIN_LAYOUT.logoWrap}>
              <div className={LOGIN_LAYOUT.logoGlow} aria-hidden="true" />
              <span className={LOGIN_LAYOUT.logo} aria-hidden="true">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar sm:h-12 sm:w-12" />
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h1 className={LOGIN_LAYOUT.title}>Welcome to NEO CRM</h1>
              <p className={LOGIN_LAYOUT.subtitle}>{isSignup ? "Create your account" : "Sign in to continue"}</p>
            </div>

            {/* Google sign-in — the reference's white rounded-xl button. */}
            <div className="w-full">
              <button
                type="button"
                className={LOGIN_LAYOUT.google}
                onClick={() =>
                  toast.info(
                    "Google sign-in not configured",
                    "This self-hosted clone uses email and password sign-in (demo credentials in the README).",
                  )
                }
              >
                <div className={LOGIN_LAYOUT.googleIcon}>
                  <GoogleIcon />
                </div>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className={LOGIN_LAYOUT.divider} aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className={LOGIN_LAYOUT.dividerLine} />
              </div>
              <div className={LOGIN_LAYOUT.dividerLabel}>
                <span className={LOGIN_LAYOUT.dividerLabelSpan}>or</span>
              </div>
            </div>

            <form onSubmit={onSubmit} className={LOGIN_LAYOUT.form} noValidate>
              <div className={LOGIN_LAYOUT.fields}>
                {isSignup && (
                  <div className={LOGIN_LAYOUT.field}>
                    <label htmlFor="name" className={LOGIN_LAYOUT.label}>
                      Name
                    </label>
                    <div className={LOGIN_LAYOUT.inputWrap}>
                      <User className={LOGIN_LAYOUT.inputIcon} />
                      <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className={LOGIN_LAYOUT.input}
                      />
                    </div>
                  </div>
                )}

                <div className={LOGIN_LAYOUT.field}>
                  <label htmlFor="email" className={LOGIN_LAYOUT.label}>
                    Email
                  </label>
                  <div className={LOGIN_LAYOUT.inputWrap}>
                    <Mail className={LOGIN_LAYOUT.inputIcon} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={LOGIN_LAYOUT.input}
                    />
                  </div>
                </div>

                <div className={LOGIN_LAYOUT.field}>
                  <label htmlFor="password" className={LOGIN_LAYOUT.label}>
                    Password
                  </label>
                  <div className={LOGIN_LAYOUT.inputWrap}>
                    <Lock className={LOGIN_LAYOUT.inputIcon} />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={isSignup ? 8 : undefined}
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      placeholder="••••••••"
                      className={LOGIN_LAYOUT.input}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="space-y-3">
                <button type="submit" disabled={pending} className={LOGIN_LAYOUT.submit}>
                  {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
                </button>
                <div className={LOGIN_LAYOUT.footer}>
                  {!isSignup ? (
                    <button
                      type="button"
                      className={`${LOGIN_LAYOUT.footerLink} font-medium`}
                      onClick={() => goto("forgot")}
                    >
                      Forgot password?
                    </button>
                  ) : (
                    <span />
                  )}
                  {!isSignup ? (
                    <Link href="/signup" className={LOGIN_LAYOUT.footerLink}>
                      Need an account? <span className={LOGIN_LAYOUT.footerLinkStrong}>Sign up</span>
                    </Link>
                  ) : (
                    <Link href="/login" className={LOGIN_LAYOUT.footerLink}>
                      Already have an account?{" "}
                      <span className={LOGIN_LAYOUT.footerLinkStrong}>Sign in</span>
                    </Link>
                  )}
                </div>
              </div>
            </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7c2-1.9 3.1-4.7 3.1-8.1v-.6z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.6 2.8C3.5 21.3 7.4 24 12 24z"
      />
      <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4V9.5L1.3 6.7C.5 8.3 0 10.1 0 12s.5 3.7 1.3 5.3l3.9-2.9z" />
      <path
        fill="#EA4335"
        d="M12 4.7c2.2 0 3.7.9 4.5 1.7l3.3-3.2C17.9 1.2 15.2 0 12 0 7.4 0 3.5 2.7 1.3 6.7l3.9 3c1-2.9 3.7-5 6.8-5z"
      />
    </svg>
  );
}

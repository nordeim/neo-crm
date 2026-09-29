"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { LOGIN_LAYOUT } from "@/lib/page-layout";
import { toast } from "@/components/ui/toast";

type Mode = "signin" | "signup";

/**
 * Login card — session-7 re-pin (LOGIN_LAYOUT contracts): the reference's
 * slate design. A borderless glass card (`bg-white/95 backdrop-blur-sm
 * shadow-2xl`) with a gradient accent strip, centered logo/title column,
 * white Google button, `h-11 sm:h-12` slate inputs and a slate-900 submit.
 * The logo is a CSS brand mark (the reference hotlinks a screenshot image;
 * we reproduce the white-circle + blue-dot shape with no external asset).
 * Kept beyond parity: the demo-credentials hint, the inline error alert
 * and the signup mode (label ids + button names stay e2e-pinned).
 */
export function LoginCard({ mode = "signin" }: { mode?: Mode }) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

  return (
    <div className="w-full max-w-md">
      <div className={LOGIN_LAYOUT.card}>
        {/* Gradient accent strip along the card's top edge. */}
        <div className={LOGIN_LAYOUT.accent} aria-hidden="true" />

        <div className={LOGIN_LAYOUT.inner}>
          <div className={LOGIN_LAYOUT.centered}>
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
                    "This self-hosted clone uses email and password sign-in. Use the demo credentials below.",
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
                    <button type="button" className={`${LOGIN_LAYOUT.footerLink} font-medium`}>
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
          </div>

          {!isSignup && (
            <div className="mt-6 rounded-xl bg-slate-50 px-3 py-2.5 text-center text-xs text-slate-500">
              Demo login:{" "}
              <span className="font-medium text-slate-700">sepnetflix2023@outlook.com</span> ·{" "}
              <span className="font-medium text-slate-700">$Abcd1234</span>
            </div>
          )}
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

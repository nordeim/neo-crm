"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type Mode = "signin" | "signup";

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
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-xl">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sidebar">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </span>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Welcome to <span className="text-primary">NEO CRM</span>
            </h1>
            <p className="mt-0.5 text-sm text-muted">{isSignup ? "Create your account" : "Sign in to continue"}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Button
            type="button"
            variant="secondary"
            className="h-10 w-full"
            onClick={() =>
              toast.info(
                "Google sign-in not configured",
                "This self-hosted clone uses email and password sign-in. Use the demo credentials below.",
              )
            }
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface px-3 text-xs font-medium uppercase tracking-widest text-subtle">or</span>
            </div>
          </div>

          {isSignup && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isSignup ? 8 : undefined}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="••••••••"
                className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
              {error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="h-10 w-full bg-gray-900 text-white hover:bg-gray-800">
            {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
          </Button>

          <div className="flex items-center justify-between text-xs text-muted">
            {!isSignup ? (
              <Link href="/login" className="font-medium text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </Link>
            ) : (
              <span />
            )}
            {!isSignup ? (
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Need an account? Sign up
              </Link>
            ) : (
              <Link href="/login" className="font-medium text-primary hover:underline">
                Already have an account? Sign in
              </Link>
            )}
          </div>
        </form>

        {!isSignup && (
          <div className="mt-5 rounded-lg bg-line-soft px-3 py-2.5 text-center text-xs text-muted">
            Demo login: <span className="font-medium text-foreground">sepnetflix2023@outlook.com</span> ·{" "}
            <span className="font-medium text-foreground">$Abcd1234</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
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

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginCard } from "@/components/layout/login-card";

export const metadata: Metadata = { title: "Sign up" };

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) redirect("/");
  return (
    <main className="flex min-h-screen items-center justify-center bg-line-soft px-4 py-10">
      <LoginCard mode="signup" />
    </main>
  );
}

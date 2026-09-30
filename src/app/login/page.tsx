import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginCard } from "@/components/layout/login-card";
import { LOGIN_LAYOUT } from "@/lib/page-layout";

// Session-10 (S10-10): the reference's login page title is plain "NEO CRM"
// (document.title probe) — not "Sign in | NEO CRM".
export const metadata: Metadata = { title: "NEO CRM" };

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");
  return (
    <main
    className={LOGIN_LAYOUT.page}
  >
      <LoginCard />
    </main>
  );
}

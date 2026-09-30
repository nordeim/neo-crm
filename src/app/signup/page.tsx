import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginCard } from "@/components/layout/login-card";
import { LOGIN_LAYOUT } from "@/lib/page-layout";

// Session-10: the reference has no /signup (404 + a dead login button —
// kept as our working superset). Its title follows the same scheme.
export const metadata: Metadata = { title: "Sign up | NEO CRM" };

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) redirect("/");
  return (
    <main
    className={LOGIN_LAYOUT.page}
  >
      <LoginCard mode="signup" />
    </main>
  );
}

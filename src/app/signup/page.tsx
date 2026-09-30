import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginCard } from "@/components/layout/login-card";
import { LOGIN_LAYOUT } from "@/lib/page-layout";

// Session-10: the reference has no /signup (404 + a dead login button —
// kept as our working superset). Its title follows the same scheme.
// Session-13 (S13-P1): ABSOLUTE — the string already contains the
// suffix, so the root template doubled it ("Sign up | NEO CRM | NEO CRM").
export const metadata: Metadata = { title: { absolute: "Sign up | NEO CRM" } };

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

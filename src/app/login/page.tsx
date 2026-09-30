import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginCard } from "@/components/layout/login-card";
import { LOGIN_LAYOUT } from "@/lib/page-layout";

// Session-10 (S10-10): the reference's login page title is plain "NEO CRM"
// (document.title probe) — not "Sign in | NEO CRM".
// Session-13 (S13-P1): the title must be ABSOLUTE — a relative string
// rides the root layout's "%s | NEO CRM" template and SSRs the DOUBLED
// "NEO CRM | NEO CRM" (curl-verified; same bug class as the s12 404).
export const metadata: Metadata = { title: { absolute: "NEO CRM" } };

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

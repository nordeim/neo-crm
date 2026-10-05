import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginCard } from "@/components/layout/login-card";
import { LOGIN_LAYOUT } from "@/lib/page-layout";
import { pageMetadata } from "@/lib/site";

// Session-10: the reference has no /signup (404 + a dead login button —
// kept as our working superset). Its title follows the same scheme.
// Session-13 (S13-P1): ABSOLUTE — the string already contains the
// suffix, so the root template doubled it ("Sign up | NEO CRM | NEO CRM").
// Session-19 (S19-P4/P5): the per-route canonical/OG/Twitter family —
// the reference has no signup to mirror, so this is our superset's own
// self-consistent expression (the factory's unprefixed family + the
// absolute suffixed title the s13 pin freezes).
export const metadata = pageMetadata({ page: null, route: "/signup", title: "Sign up | NEO CRM" });

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) redirect("/");
  return (
    <main className={LOGIN_LAYOUT.page}>
      <LoginCard mode="signup" />
    </main>
  );
}

import { pageMetadata } from "@/lib/site";
import CalendarPage from "./calendar-page";

// Session-10 (S10-10): per-page document titles — the reference titles every
// non-dashboard page "X | NEO CRM" (document.title probes, all 10 routes);
// the dashboard and login stay "NEO CRM" (root-layout default). A server
// page wrapper contributes the metadata (client pages cannot export it);
// the AppShell effect covers client-side navigations too.
// Session-19 (S19-P4/P5): the reference also ships PER-ROUTE canonical +
// OG/Twitter on every inner page (og:title "X | NEO CRM", og:url
// origin+route, og:description "X on NEO CRM. " + the root paragraph) —
// all built through the pageMetadata() factory in src/lib/site.ts.
export const metadata = pageMetadata({ page: "Calendar", route: "/calendar" });

export default function CalendarPageRoute() {
  return <CalendarPage />;
}

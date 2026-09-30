import type { Metadata } from "next";
import SettingsPage from "./settings-page";

// Session-10 (S10-10): per-page document titles — the reference titles every
// non-dashboard page "X | NEO CRM" (document.title probes, all 10 routes);
// the dashboard and login stay "NEO CRM" (root-layout default). A server
// page wrapper contributes the metadata (client pages cannot export it);
// the AppShell effect covers client-side navigations too.
export const metadata: Metadata = { title: "Settings" };

export default function SettingsPageRoute() {
  return <SettingsPage />;
}

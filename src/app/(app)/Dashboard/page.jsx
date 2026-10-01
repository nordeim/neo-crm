// Session-24 (S24-P1): the reference serves the dashboard at BOTH `/`
// and `/Dashboard` — its sidebar's Dashboard link points at the CAPITAL
// path (byte-extracted from its live DOM; the post-login redirect stays
// `/`). Probing /Dashboard browser-side renders the full dashboard IN
// PLACE with the URL PRESERVED, and its SSR head is the ROOT head
// (og:url + canonical at the origin, og:title "NEO CRM" — the dashboard
// inherits the root layout's metadata at both paths, live-curl-verified).
// Hence: a render alias with NO metadata export of its own.
//
// A route FOLDER (not a next.config redirect) because Next.js matches
// config redirects CASE-INSENSITIVELY — a `/Dashboard -> /` rule would
// loop against every path (the s14 lesson). Route folders are case-exact
// on the filesystem, so the alias can never fight the canonical route.
// NOTE (S24-P1, gate-caught): this alias is a .jsx file ON PURPOSE —
// TypeScript's TS1149 fires whenever ONE program includes two real files
// whose paths differ ONLY in casing ((app)/Accounts/page.tsx vs
// (app)/accounts/page.tsx — the check is not flag-controllable;
// forceConsistentCasingInFileNames does not suppress it). The .jsx
// extension keeps the alias out of that collision (paths differ by
// extension), resolves through allowJs exactly like the reference
// route's page.js import in Next's generated validator, and compiles
// identically through SWC. The lowercase page.tsx stays canonical.

import DashboardPage from "../page";

export default function DashboardCapitalRoute() {
  return <DashboardPage />;
}

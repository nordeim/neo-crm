// Session-24 (S24-P1): the reference serves every app route at BOTH
// casings, live-verified — its sidebar links point at the CAPITALIZED
// paths and each capital URL renders the real page IN PLACE (no
// normalization; the URL bar keeps the casing the visitor typed or
// clicked). Each casing is a first-class SSR route: the reference's
// /Contacts serves og:url + canonical at …/Contacts while /contacts serves
// them at …/contacts (identical og:title/og:description). This thin render
// alias inside the (app) group gives the capital casing the same app
// shell + auth guard + capital-case head as the reference; the lowercase
// route stays canonical (all tests + the sitemap point at it).
//
// A route FOLDER (not a next.config redirect) because Next.js matches
// config redirects CASE-INSENSITIVELY — a `/Contacts -> /contacts` rule
// also matches the destination itself and loops (the s14 lesson). Route
// folders are case-exact on the filesystem, so the alias can never fight
// the canonical route.
// NOTE (S24-P1, gate-caught): this alias is a .jsx file ON PURPOSE —
// TypeScript's TS1149 fires whenever ONE program includes two real files
// whose paths differ ONLY in casing ((app)/Accounts/page.tsx vs
// (app)/accounts/page.tsx — the check is not flag-controllable;
// forceConsistentCasingInFileNames does not suppress it). The .jsx
// extension keeps the alias out of that collision (paths differ by
// extension), resolves through allowJs exactly like the reference
// route's page.js import in Next's generated validator, and compiles
// identically through SWC. The lowercase page.tsx stays canonical.

import { pageMetadata } from "@/lib/site";
import ContactsPage from "../contacts/contacts-page";

export const metadata = pageMetadata({ page: "Contacts", route: "/Contacts" });

export default function ContactsCapitalRoute() {
  return <ContactsPage />;
}

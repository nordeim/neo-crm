import { redirect } from "next/navigation";

// Session-14 (S14-P4): the reference serves BOTH casings of the profile
// route — its account menu links to `/Profile` (capital P) and `/Profile`
// + `/profile` both return 200. Our canonical route stays lowercase (all
// internal links + tests point at `(app)/profile`); this thin top-level
// alias makes the uppercase casing resolve exactly like the reference
// instead of landing on the designed 404.
//
// Why a route folder and NOT a next.config.ts redirect: Next.js matches
// config redirects CASE-INSENSITIVELY — a `/Profile -> /profile` rule also
// matches the destination itself and loops into ERR_TOO_MANY_REDIRECTS
// (reproduced on the e2e server; the `caseSensitive` escape hatch is not a
// valid per-redirect property in Next 16 and fails the build with "Invalid
// redirect found"). Route folders are case-exact on the filesystem, so the
// alias can never fight the canonical route.
//
// The page lives OUTSIDE the (app) group on purpose: it is a pure alias,
// so it skips the app-shell layout and the auth guard — unauthenticated
// visits chain straight through to /profile, whose own guard sends them
// to /login exactly like any direct lowercase hit. `redirect()` throws
// before render, so no markup is ever produced here.
export default function ProfileAliasPage(): never {
  redirect("/profile");
}

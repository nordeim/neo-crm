import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-14 (S14-P4) established that the reference serves BOTH casings
// of the profile route — its account menu links to `/Profile` (capital P,
// an <a href>) and `/Profile` + `/profile` both return 200.
//
// Session-24 (S24-P1) upgraded the mechanism: the reference does NOT
// normalize the casing — probing /Profile browser-side renders the full
// app page IN PLACE (h1 "Profile & Settings") with the URL PRESERVED, and
// both casings serve first-class SSR heads (og:url + canonical mirror the
// requested case). The s14 top-level redirect alias (which normalized the
// URL bar to /profile) is RETIRED; the alias now lives INSIDE the (app)
// group as a render alias — same shape as the other eight capital-route
// aliases — so it gets the app shell + auth guard + capital-route
// metadata exactly like the reference.
//
// Implementation note (the e2e server taught us twice): a next.config.ts
// redirect is the WRONG tool here — Next.js matches config redirects
// CASE-INSENSITIVELY, so `/Profile -> /profile` also matches the
// destination itself and loops into ERR_TOO_MANY_REDIRECTS, and the
// `caseSensitive` escape hatch is not a valid per-redirect property in
// Next 16 ("Invalid redirect found" at build). Route folders are
// case-exact on the filesystem — the alias can never fight the canonical.
describe("session-24: /Profile capital render alias (S14-P4 -> S24-P1)", () => {
  // The alias is a .jsx file (the TS1149 lesson — see route-case.test.ts).
  const aliasPath = path.resolve(import.meta.dirname, "../src/app/(app)/Profile/page.jsx");
  const aliasSrc = existsSync(aliasPath) ? readFileSync(aliasPath, "utf8") : "";

  it("ships a /Profile render alias INSIDE the (app) group (shell + guard + URL preserved)", () => {
    expect(existsSync(aliasPath)).toBe(true);
    expect(aliasSrc).not.toMatch(/redirect\(/);
    expect(aliasSrc).not.toMatch(/next\/navigation/);
    expect(aliasSrc).toMatch(/import ProfilePage from "\.\.\/profile\/profile-page"/);
    expect(aliasSrc).toMatch(/return <ProfilePage \/>/);
  });

  it("the alias emits the reference's capital-case head (og:url + canonical at /Profile)", () => {
    expect(aliasSrc).toMatch(/pageMetadata\(\{ page: "Profile", route: "\/Profile" \}\)/);
  });

  it("the s14 top-level redirect alias is retired (no src/app/Profile outside the group)", () => {
    expect(
      existsSync(path.resolve(import.meta.dirname, "../src/app/Profile/page.tsx")),
    ).toBe(false);
    expect(
      existsSync(path.resolve(import.meta.dirname, "../src/app/Profile/page.jsx")),
    ).toBe(false);
  });

  it("next.config.ts carries NO /Profile redirect (it would loop)", () => {
    // Case-insensitive matching makes the config redirect self-loop —
    // pinned so nobody "simplifies" the alias back into a redirect rule.
    const configSrc = readFileSync(
      path.resolve(import.meta.dirname, "../next.config.ts"),
      "utf8",
    );
    expect(configSrc).not.toMatch(/redirects\(\)/);
    expect(configSrc).not.toContain('"/Profile"');
  });

  it("the canonical lowercase route keeps the real page", () => {
    expect(
      existsSync(path.resolve(import.meta.dirname, "../src/app/(app)/profile/page.tsx")),
    ).toBe(true);
  });
});

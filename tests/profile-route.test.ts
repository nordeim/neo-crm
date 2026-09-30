import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session 14 (S14-P4): the reference serves BOTH casings of the profile
// route — its account menu links to `/Profile` (capital P, an <a href>) and
// `/Profile` + `/profile` both return 200. Our canonical route stays
// lowercase (`(app)/profile`, where all internal links + tests point); a
// thin top-level alias route covers the uppercase casing.
//
// Implementation note (the e2e server taught us twice): a next.config.ts
// redirect is the WRONG tool here — Next.js matches config redirects
// CASE-INSENSITIVELY, so `/Profile -> /profile` also matches the
// destination itself and loops into ERR_TOO_MANY_REDIRECTS, and the
// `caseSensitive` escape hatch is not a valid per-redirect property in
// Next 16 ("Invalid redirect found" at build). Route folders are
// case-exact on the filesystem — the alias can never fight the canonical.
describe("session-14: /Profile casing alias (S14-P4)", () => {
  const aliasPath = path.resolve(import.meta.dirname, "../src/app/Profile/page.tsx");
  const aliasSrc = existsSync(aliasPath) ? readFileSync(aliasPath, "utf8") : "";

  it("ships a thin /Profile alias route that redirects to /profile", () => {
    expect(existsSync(aliasPath)).toBe(true);
    expect(aliasSrc).toContain(`redirect("/profile")`);
    expect(aliasSrc).toMatch(/import \{ redirect \} from "next\/navigation"/);
  });

  it("the alias stays OUTSIDE the (app) group (no shell/guard side effects)", () => {
    // A pure alias: redirect() throws before render, so it must not drag
    // in the app-shell layout or the auth guard — unauthenticated visits
    // chain straight through to /profile's own guard.
    expect(aliasPath).not.toMatch(/\(app\)/);
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

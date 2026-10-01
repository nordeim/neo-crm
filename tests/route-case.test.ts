import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-24 route-case + URL-state pins (S24-P1/P2/P3): the reference
// serves EVERY app route at BOTH casings, live-verified on 2026-10-01 —
// its sidebar links point at CAPITALIZED paths (/Dashboard, /Accounts,
// /Contacts, /Leads, /Calendar, /Activities, /Reports, /Settings —
// byte-extracted from its live DOM) and its account menu ships
// <A href="/Profile">. Probing each capital URL browser-side: all NINE
// render the real page IN PLACE with NO normalization (the URL bar keeps
// the casing the visitor typed/clicked), and each casing is a
// first-class SSR route — /Reports serves og:url + canonical at
// …/Reports while /reports serves them at …/reports; /Dashboard serves
// the ROOT head exactly like /. The auth routes are the deliberate
// exception: /Login and /Signup render the reference's 404 view (its
// client router does not case-fold them) — our clone 404s both too, and
// these tests pin that NO capital auth aliases appear.
//
// S24-P2: the active-state matcher is CASE-INSENSITIVE on the reference
// (at lowercase /reports the Reports item — href /Reports — carries the
// active background; the Dashboard item is active at BOTH / and
// /Dashboard), and our nav hrefs must byte-match the reference's.
//
// S24-P3: the reference's dashboard "More..." ghost button is a complete
// NO-OP (domDelta 0, no navigation) — our router.push("/leads") was an
// invention.
//
// These tests parse the component/page sources so the contract is pinned
// at the unit layer without a browser; the live capital-route rendering,
// the URL preservation and the sidebar href bytes are pinned by the e2e
// route-case checks (tests/e2e/crm.spec.ts).

const APP = "src/app";
const CAPITAL_ROUTES = [
  { route: "Accounts", page: "Accounts", comp: "accounts-page" },
  { route: "Contacts", page: "Contacts", comp: "contacts-page" },
  { route: "Leads", page: "Leads", comp: "leads-page" },
  { route: "Calendar", page: "Calendar", comp: "calendar-page" },
  { route: "Activities", page: "Activities", comp: "activities-page" },
  { route: "Reports", page: "Reports", comp: "reports-page" },
  { route: "Settings", page: "Settings", comp: "settings-page" },
  { route: "Profile", page: "Profile", comp: "profile-page" },
] as const;

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

// Source pins read RULES, not documentation: strip comments first (the
// s21/s22 own-doc-comment hazard — the retirement notes themselves name
// the retired constructs).
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-24: the capital-route render aliases (S24-P1)", () => {
  for (const { route, page, comp } of CAPITAL_ROUTES) {
    it(`(app)/${route}/page.jsx renders the lowercase page IN PLACE (no redirect)`, () => {
      // The alias is a .jsx file ON PURPOSE (gate-caught): TypeScript's
      // TS1149 — NOT flag-controllable — fires whenever one program
      // includes two real files whose paths differ ONLY in casing, which
      // a page.tsx at (app)/${route} would do against the canonical
      // (app)/${route.toLowerCase()}/page.tsx (Next's generated validator
      // imports both). The .jsx extension breaks the collision and
      // resolves through allowJs exactly like the validator's page.js
      // import; the lowercase page.tsx stays canonical + type-checked.
      const src = read(`${APP}/(app)/${route}/page.jsx`);
      expect(src, `src/app/(app)/${route}/page.jsx must exist`).not.toBeNull();
      expect(
        existsSync(path.resolve(import.meta.dirname, "..", `${APP}/(app)/${route}/page.tsx`)),
      ).toBe(false);
      const code = stripComments(src!);
      expect(code).toMatch(new RegExp(`import ${page}Page from "\\.\\./[a-z]+/${comp}"`));
      expect(code).not.toMatch(/redirect\(/);
      expect(code).not.toMatch(/next\/navigation/);
      expect(code).toMatch(new RegExp(`return <${page}Page />`));
    });

    it(`(app)/${route}/page.jsx emits pageMetadata with the CAPITAL route "/${route}"`, () => {
      const code = stripComments(read(`${APP}/(app)/${route}/page.jsx`)!);
      expect(code).toMatch(new RegExp(`pageMetadata\\(\\{ page: "${page}", route: "/${route}" \\}\\)`));
    });
  }

  it("(app)/Dashboard/page.jsx renders the root dashboard IN PLACE with NO metadata export", () => {
    const src = read(`${APP}/(app)/Dashboard/page.jsx`);
    expect(src, "src/app/(app)/Dashboard/page.jsx must exist").not.toBeNull();
    const code = stripComments(src!);
    expect(code).toMatch(/import DashboardPage from "\.\.\/page"/);
    expect(code).toMatch(/return <DashboardPage \/>/);
    expect(code).not.toMatch(/redirect\(/);
    // The reference's /Dashboard serves the ROOT head (og:url/canonical at
    // the origin, og:title "NEO CRM") — the alias must NOT carry its own
    // per-route metadata or it would emit /Dashboard og:url tags.
    expect(code).not.toMatch(/export const metadata/);
    expect(code).not.toMatch(/pageMetadata/);
  });

  it("the s14 top-level /Profile redirect alias is RETIRED (superseded by the render alias)", () => {
    expect(read(`${APP}/Profile/page.tsx`)).toBeNull();
    expect(read(`${APP}/Profile/page.jsx`)).toBeNull();
  });

  it("NO capital auth-route aliases exist (/Login + /Signup must keep 404ing like the reference)", () => {
    // The reference's client router case-folds its 9 app routes but NOT
    // its auth routes — /Login and /Signup render its 404 view. Our clone
    // 404s them too (parity by coincidence): pin that no alias sneaks in.
    expect(read(`${APP}/Login/page.tsx`)).toBeNull();
    expect(read(`${APP}/Signup/page.tsx`)).toBeNull();
    expect(read(`${APP}/(app)/Login/page.tsx`)).toBeNull();
    expect(read(`${APP}/(app)/Signup/page.tsx`)).toBeNull();
    expect(read(`${APP}/Login/page.jsx`)).toBeNull();
    expect(read(`${APP}/Signup/page.jsx`)).toBeNull();
    expect(read(`${APP}/(app)/Login/page.jsx`)).toBeNull();
    expect(read(`${APP}/(app)/Signup/page.jsx`)).toBeNull();
  });

  it("next.config.ts still carries NO redirects() (the s14 case-insensitive loop hazard)", () => {
    const configSrc = read("next.config.ts")!;
    expect(configSrc).not.toMatch(/redirects\(\)/);
  });
});

describe("session-24: the nav href byte-contract + case-insensitive active state (S24-P2)", () => {
  const navSrc = read("src/components/layout/nav-config.ts")!;
  const nav = stripComments(navSrc);

  it("NAV_ITEMS hrefs are the reference's CAPITALIZED paths — Dashboard at /Dashboard, not /", () => {
    expect(nav).toMatch(/href: "\/Dashboard", label: "Dashboard"/);
    expect(nav).toMatch(/href: "\/Accounts", label: "Accounts"/);
    expect(nav).toMatch(/href: "\/Contacts", label: "Contacts"/);
    expect(nav).toMatch(/href: "\/Leads", label: "Leads"/);
    expect(nav).toMatch(/href: "\/Calendar", label: "Calendar"/);
    expect(nav).toMatch(/href: "\/Activities", label: "Activities"/);
    expect(nav).toMatch(/href: "\/Reports", label: "Reports"/);
    expect(nav).toMatch(/href: "\/Settings", label: "Settings"/);
  });

  it("zero lowercase nav hrefs remain in nav-config", () => {
    expect(nav).not.toMatch(/href: "\/accounts"/);
    expect(nav).not.toMatch(/href: "\/contacts"/);
    expect(nav).not.toMatch(/href: "\/leads"/);
    expect(nav).not.toMatch(/href: "\/calendar"/);
    expect(nav).not.toMatch(/href: "\/activities"/);
    expect(nav).not.toMatch(/href: "\/reports"/);
    expect(nav).not.toMatch(/href: "\/settings"/);
    expect(nav).not.toMatch(/href: "\/"/);
  });

  it("sidebar isActive is CASE-INSENSITIVE with the Dashboard root special case", () => {
    const sidebar = stripComments(read("src/components/layout/sidebar.tsx")!);
    // The reference highlights Reports (href /Reports) at lowercase
    // /reports, and Dashboard at BOTH / and /Dashboard.
    expect(sidebar).toMatch(/const isActive = \(href: string\) =>/);
    expect(sidebar).toMatch(/pathname\.toLowerCase\(\)/);
    expect(sidebar).toMatch(/href\.toLowerCase\(\)/);
    expect(sidebar).toMatch(/h === "\/dashboard"/);
    expect(sidebar).toMatch(/p === "\/" \|\| p === "\/dashboard"/);
    // The old case-SENSITIVE one-liner contract is gone.
    expect(sidebar).not.toMatch(/href === "\/" \? pathname === "\/"/);
  });

  it("the topbar account menu pushes the reference's /Profile target", () => {
    const topbar = stripComments(read("src/components/layout/topbar.tsx")!);
    expect(topbar).toMatch(/router\.push\("\/Profile"\)/);
    expect(topbar).not.toMatch(/router\.push\("\/profile"\)/);
  });
});

describe("session-24: the dashboard More... button is the reference's dead affordance (S24-P3)", () => {
  const dash = stripComments(read("src/app/(app)/page.tsx")!);

  it("carries NO router.push (the reference's button is a live-verified no-op)", () => {
    expect(dash).not.toMatch(/router\.push\("\/leads"\)/);
    expect(dash).not.toMatch(/onClick=\{\(\) => router\.push/);
  });

  it("retires the now-unused useRouter import + hook", () => {
    expect(dash).not.toMatch(/useRouter/);
  });
});

describe("session-24: URL-state parity holds (the s39 pointer, CLOSED)", () => {
  it("no page or component writes filter/view state into the URL (no useSearchParams anywhere)", () => {
    // Both apps live-verified: filters, sorting, periods, calendar
    // months, view switchers, tabs and search write ZERO URL state, and
    // deep-link params are ignored by both. Our only router targets are
    // NAVIGATION pushes (topbar search rows + account menu + login) —
    // never state serialization.
    const searchResults = [
      ...globFiles("src/app"),
      ...globFiles("src/components"),
    ];
    const offenders = searchResults.filter(
      (f) => f.endsWith(".tsx") && /useSearchParams|history\.pushState|history\.replaceState/.test(readFileSync(f, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});

function globFiles(dir: string): string[] {
  // Small recursive walk (node:fs) — the repo has no deep glob dep at the
  // unit layer and this keeps the test hermetic.
  const out: string[] = [];
  const abs = path.resolve(import.meta.dirname, "..", dir);
  if (!existsSync(abs)) return out;
  const stack = [abs];
  while (stack.length) {
    const d = stack.pop()!;
    for (const entry of readdirSync(d)) {
      const full = path.join(d, entry);
      if (statSync(full).isDirectory()) stack.push(full);
      else out.push(full);
    }
  }
  return out;
}

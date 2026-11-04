// Session-169 (WP-1): THE STACK-FACTS LIVE-CENSUS — the L-165c1 doctrine
// extended to the layer no pin family ever read: the VERSION CARRIERS,
// the doctrine stragglers CLAUDE.md still carries, the phantom helper,
// the tree counts, and the color mirror's unpinned rows.
//
// The audit's finding register (F-169a…s + the F-9/F-1/F-5 stragglers):
//   F-169f  the version carriers drifted at the s163-era dep bump
//           (04e367c: next 16.3.6→16.4.2, playwright 1.63→1.64.1 — no
//           doc updated): README badge+table+row · PAD stack table ·
//           SKILL §2 rows.
//   F-169a  CLAUDE.md is the LAST un-flipped doctrine doc ("Hand-rolled
//           validation … no schema library by design" — zero zod/
//           parseBody/schemas.ts mentions in the whole file).
//   F-169b  the sitemap stragglers: CLAUDE's "nine-route" + AGENTS's
//           "nine-URL" (live 11 since s142 — the F-168i fix pinned
//           README only).
//   F-9     DEPLOYMENT's "the 27 API route handlers" (live 29 route
//           files) + the docs-counts pin ITSELF asserting the stale
//           constant — the L-165c1 genus inside the pin family.
//   F-169k  PAD's own contradictions: §3.1's "hand-rolled validation at
//           the boundary" + §6.1's PHANTOM `asOneOf` helper (the live
//           set: asString/asNumber/asInt/asDate/asFKId).
//   F-169l  PAD's tree "auth(6: …)" (live 8 auth route dirs since s163).
//   F-169m  PAD ADR-003's "~129 auditable lines" (live auth.ts = 171 —
//           PAD's own §11 row, pinned, carries 171).
//   F-169c  CLAUDE's models list carries 8 of 9 (Opportunity missing).
//   F-169d  CLAUDE's env table carries 3 of 6 knobs.
//   F-169e  CLAUDE's e2e enumeration names 7 of 10 specs.
//   F-5/3/4 SKILL §4.1's "(complete)" @theme mirror: five stale tokens +
//           missing line-strong + the false label (globals.css carries
//           127 --color-* tokens); §19's primary/primary-hover rows
//           carry the same two stale primaries.
//   F-6     SKILL §20's "(3 vars)" cross-reference (live 6).
//   F-169h  README's file tree: "(app)/ 📄 page.tsx # Dashboard (/)" —
//           the file does not exist (removed s142; / is the public
//           landing; the dashboard is (app)/dashboard/).
//   F-169i  README's Quick Start: "Visiting / redirects to /login" +
//           "land on a dashboard" (pre-s142 narration).
//   F-169j  README's "gate + the FOUR drift sweeps" (live SIX gates).
//   F-169n  README's Tested row embeds the s98-era "space-y census
//           re-anchored 110/18" (live 21 files / 117 occurrences).
//   F-11    AGENTS' metadata doctrine: "the 8 inner wrappers + login +
//           signup consume it" (live 13 primary pages + 10 aliases).
//   F-12    AGENTS' "596 Vitest checks across 38 suites" in the
//           live-tense layer (no era marker).
//   F-13    AGENTS' "242 color-mix() calls" (the s25 compiled count;
//           live compiled CSS carries 293 — build-dependent, reframed).
//   F-169s  PAD §7.1's s76/s77 row inversion + the s127-s130 row gap.
//   F-169p  .env.example's false "hard error an unset value raises"
//           contrast (the production secret gate flips the posture —
//           the doc face pinned here, the code face in tests/auth.test.ts).
//
// The battery's design (the house live-census doctrine): every value is
// read LIVE from the source (node_modules' installed versions, the
// globals.css tokens, the schema's model census, the sitemap's ROUTES
// array, the auth-route dirs, the pageMetadata consumer census, the
// space-y comment-stripped census) and the DOC is asserted to carry it
// — the next staleness, EITHER face (a doc edit OR a source change),
// fails `bun run test`. RED at birth on every stale site; GREEN when
// WP-3 flips them. Mutation-proven at birth per the house doctrine.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DELTA_TEXT,
  LOGIN_LAYOUT,
  MOBILE_NAV_TRIGGER,
  NAV_LAYOUT,
  REPORTS_FILTER_BAR,
  TOPBAR_LAYOUT,
} from "../src/lib/page-layout";

const root = join(import.meta.dirname, "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");

// wc -l semantics: the newline count (the s109 line-census convention).
const lines = (p: string) => (read(p).match(/\n/g) ?? []).length;

// The tree census (the docs-counts walk idiom).
const walk = (rel: string): string[] => {
  const out: string[] = [];
  const step = (dir: string) => {
    for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) step(full);
      else out.push(full.split(root + "/")[1] ?? full);
    }
  };
  step(rel);
  return out.sort();
};

// The installed-version census (the scandihaven PAD §1.2 lockstep
// pattern, embodied as a live pin): node_modules is the tree the gate
// runs against — three sources agree (package.json range, the lockfile,
// the build banner).
const installed = (p: string) =>
  JSON.parse(readFileSync(join(root, "node_modules", p, "package.json"), "utf8")).version as string;
const majorMinor = (v: string) => v.split(".").slice(0, 2).join(".");

// The noComments strip (the dialog-geometry census idiom — comment-
// stripped occurrence counting).
const noComments = (s: string) =>
  s
    .replace(/\{\/[\s\S]*?\*\//g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\s)\/\/[^\n]*$/gm, "$1");

// ---------------------------------------------------------------------------
// WP-1a — the version-carrier live-census (F-169f): the installed
// stack read live from node_modules, every doc row asserted to carry it.
// ---------------------------------------------------------------------------
describe("session-169 (WP-1a): the version-carrier live-census — the installed stack vs every doc row (F-169f)", () => {
  const next = installed("next");
  const pw = installed("@playwright/test");

  it(`the installed stack census (next ${next} · @playwright/test ${pw} — package.json, the lockfile, and the build banner agree)`, () => {
    expect(next).toMatch(/^16\.4\./); // the s163-era bump (04e367c), live since
    expect(pw).toMatch(/^1\.64\./);
    // the broader lockstep family (the live rows the PAD stack table
    // carries — the scandihaven §1.2 pattern, every row live-read)
    expect(majorMinor(installed("react"))).toBe("19.3");
    expect(majorMinor(installed("tailwindcss"))).toBe("4.3");
    expect(majorMinor(installed("prisma"))).toBe("6.19");
    expect(majorMinor(installed("zustand"))).toBe("5.0");
    expect(majorMinor(installed("vitest"))).toBe("5.0");
    expect(majorMinor(installed("lucide-react"))).toBe("0.525");
    // Session-176 (the N-3 retirement): recharts 2.15 → 3.10 — the
    // migration round's own version carrier, live-read.
    expect(majorMinor(installed("recharts"))).toBe("3.10");
  });

  it("README's badge + stack table carry the LIVE next version", () => {
    const readme = read("README.md");
    expect(readme).toContain(`Next.js-${next}`);
    expect(readme).toContain(`| Framework | Next.js (App Router) | ${next} |`);
    expect(readme).not.toContain("Next.js-16.3.6");
    expect(readme).not.toContain("| Framework | Next.js (App Router) | 16.3.6 |");
  });

  it("README's Playwright row carries the LIVE major.minor", () => {
    const readme = read("README.md");
    expect(readme).toContain(`| E2E tests | Playwright | ${majorMinor(pw)} |`);
    expect(readme).not.toContain("| E2E tests | Playwright | 1.63 |");
  });

  it("PAD's stack table carries the LIVE versions (the full lockstep — every row read from node_modules)", () => {
    const pad = read("Project_Architecture_Document.md");
    const STACK: Array<[string, string]> = [
      ["| Web framework | Next.js (App Router) |", next],
      ["| UI runtime | React |", majorMinor(installed("react"))],
      ["| Styling | Tailwind CSS |", majorMinor(installed("tailwindcss"))],
      ["| ORM | Prisma |", majorMinor(installed("prisma"))],
      ["| State | Zustand |", majorMinor(installed("zustand"))],
      ["| Unit tests | Vitest |", majorMinor(installed("vitest"))],
      ["| Icons | lucide-react |", majorMinor(installed("lucide-react"))],
      ["| Charts | recharts |", majorMinor(installed("recharts"))],
      ["| E2E tests | Playwright |", majorMinor(pw)],
    ];
    for (const [row, version] of STACK) {
      expect(pad, `${row} must carry ${version}`).toContain(`${row} ${version}`);
    }
    expect(pad).not.toContain("| Web framework | Next.js (App Router) | 16.3.6 |");
    expect(pad).not.toContain("| E2E tests | Playwright | 1.63 |");
  });

  it("SKILL §2's rows carry the LIVE next + playwright forms", () => {
    const skill = read("neo-crm_SKILL.md");
    expect(skill).toContain(`| Framework | Next.js (App Router) | \`${next}\` |`);
    expect(skill).toContain(`| E2E tests | @playwright/test | \`${majorMinor(pw)}.x\` |`);
    expect(skill).not.toContain("| Framework | Next.js (App Router) | `16.3.6` |");
    expect(skill).not.toContain("| E2E tests | @playwright/test | `1.63.x` |");
  });
});

// ---------------------------------------------------------------------------
// WP-1b — the CLAUDE doctrine + facts pins (F-169a/b/c/d/e): CLAUDE.md
// joins the docs pin family — the LAST doctrine doc, pinned.
// ---------------------------------------------------------------------------
describe("session-169 (WP-1b): the CLAUDE.md doctrine + facts pins (F-169a/b/c/d/e)", () => {
  const claude = read("CLAUDE.md");
  // whitespace-normalized view for the doctrine pins — the clauses wrap
  // across lines (the s167 lesson: a single-line anchor on wrapped text
  // is a vacuous negative)
  const claudeNorm = claude.replace(/\s+/g, " ");

  it("the retired hand-rolled doctrine clause is absent (F-169a's negative)", () => {
    expect(claudeNorm).not.toContain(
      "Hand-rolled validation (`asString` / `asNumber` / `asDate` / enum membership) at every route boundary — no schema library by design",
    );
  });

  it("the Zod-seam clause is present (F-169a's positive — CLAUDE.md joins the pin family)", () => {
    expect(claude).toContain("Validation rides the Zod seam at every body boundary");
    expect(claude).toContain("parseBody");
    expect(claude).toContain("src/lib/schemas.ts");
  });

  it("the sitemap claim carries the LIVE route count (F-169b)", () => {
    const routes = (read("src/app/sitemap.xml/route.ts").match(/\{ path: "/g) ?? []).length;
    expect(routes).toBe(11); // the s142 surface
    expect(claude).toContain("the eleven-route sitemap.xml");
    expect(claude).not.toContain("the nine-route sitemap.xml");
  });

  it("the models list carries the LIVE model census + Opportunity (F-169c)", () => {
    const models = (read("prisma/schema.prisma").match(/^model /gm) ?? []).length;
    expect(models).toBe(9); // the tree census
    expect(claude).toContain("Event, Opportunity,");
    expect(claude).toContain(`Setting (singleton row) — ${models} models.`);
    expect(claude).not.toContain("Event, SavedReport,\n  Setting (singleton row).");
  });

  it("the env table carries the six-knob contract (F-169d)", () => {
    for (const knob of [
      "NEO_PROXY_HOPS",
      "NEO_DISABLE_IN_APP_OTP",
      "NEO_DISABLE_IN_APP_RESET",
    ]) {
      expect(claude, `the ${knob} row must sit in CLAUDE's env table`).toContain(
        `| \`${knob}\` |`,
      );
    }
  });

  it("the e2e enumeration carries the three post-s150 specs (F-169e)", () => {
    for (const spec of [
      "landing.spec.ts",
      "marketing-mobile.spec.ts",
      "reset-password.spec.ts",
    ]) {
      expect(claude, `the ${spec} family must be named`).toContain(spec);
    }
  });

  it("the unit enumeration carries its era marker + the live pointer (F-169e)", () => {
    // the enumeration narrates the s13-s51 accretion inside a pinned
    // live-count carrier — the honest form marks the era and points at
    // the complete live enumeration (README's pinned list)
    expect(claudeNorm).toContain(
      "(the s51-era snapshot — the complete live suite enumeration rides README's pinned list)",
    );
  });
});

// ---------------------------------------------------------------------------
// WP-1c — the PAD doctrine + tree pins (F-169k/l/m/s).
// ---------------------------------------------------------------------------
describe("session-169 (WP-1c): the PAD doctrine + tree pins (F-169k/l/m/s)", () => {
  const pad = read("Project_Architecture_Document.md");
  // whitespace-normalized view — the doctrine clauses wrap across lines
  // (the s167 lesson applied at birth this time)
  const padNorm = pad.replace(/\s+/g, " ");

  it("§3.1's retired boundary rule is absent + the seam form present (F-169k)", () => {
    expect(padNorm).not.toContain("Rule: hand-rolled validation at the boundary;");
    expect(padNorm).toContain("Rule: validation rides the Zod seam at the body boundary");
  });

  it("§6.1's phantom asOneOf is absent + the live helper set present (F-169k)", () => {
    // asOneOf exists NOWHERE in src/ — the live exported set is
    // asString/asNumber/asInt/asDate/asFKId (+ the isBad* predicates)
    expect(pad).not.toContain("asString/asNumber/asDate/asOneOf");
    expect(pad).toContain("asString/asNumber/asDate/asFKId");
  });

  it("the route tree carries the LIVE auth-route census (F-169l)", () => {
    const authDirs = readdirSync(join(root, "src/app/api/auth"), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
    expect(authDirs.length).toBe(8); // + forgot-password + reset-password (s163)
    // the tree wraps across comment lines carrying the │ drawing chars —
    // the FIRST-LINE fragment is the unique positive; the retired form
    // never wraps (its negative rides the same first-line prefix)
    expect(pad).toContain("auth(8: login signup logout me verify");
    expect(pad).not.toContain("auth(6: login signup logout me verify");
    expect(padNorm).toContain("resend forgot-password reset-password) users");
  });

  it("ADR-003's rationale carries the LIVE auth.ts line count (F-169m)", () => {
    const live = lines("src/lib/auth.ts");
    expect(live).toBe(184); // the s169 secret-gate edit grew it 171 -> 184 (the live census reads the growth)
    expect(pad).toContain(`~${live} auditable lines`);
    expect(pad).not.toContain("~129 auditable lines");
  });

  it("the inventory table's s76 rows precede the s77 row (F-169s — the inversion cured)", () => {
    // the s167 re-seating fixed s86-s91 but never the s76/s77 swap
    const first76 = pad.indexOf("the M-76c6 KPI-statics pins");
    const first77 = pad.indexOf("the M-77c1/M-77c2 pins");
    expect(first76).toBeGreaterThan(0);
    expect(first77).toBeGreaterThan(0);
    expect(first76, "the s76 row must sit before the s77 row").toBeLessThan(first77);
  });

  it("the s127-s130 inventory gap carries its footnote (F-169s)", () => {
    expect(pad).toContain("sessions 127-130 recorded no inventory rows");
  });
});

// ---------------------------------------------------------------------------
// WP-1d — the DEPLOYMENT re-anchor (F-9): the live route-file census,
// the stale literal retired — AND the docs-counts pin itself re-anchored
// (the L-165c1 root cure applied to the pin family's own member).
// ---------------------------------------------------------------------------
describe("session-169 (WP-1d): the DEPLOYMENT build-line live-census (F-9)", () => {
  it("the build line carries the LIVE route-file census", () => {
    const routes = walk("src/app/api").filter((f) => f.endsWith("route.ts")).length;
    expect(routes).toBe(29); // the tree census (the three SEO handlers excluded)
    const deployment = read("docs/DEPLOYMENT.md");
    expect(deployment).toContain(`the ${routes} API route files (41 verb handlers)`);
    expect(deployment).not.toContain("the 27 API route handlers");
  });
});

// ---------------------------------------------------------------------------
// WP-1e — the SKILL color/facts mirror (F-5/F-3/F-4/F-6/F-19): the
// §19 color-mirror census extended to the primary family + the §4.1
// block's tokens read live + the §20 cross-reference + Appendix B.
// ---------------------------------------------------------------------------
describe("session-169 (WP-1e): the SKILL color + facts mirror (F-5/F-3/F-4/F-6/F-19)", () => {
  const skill = read("neo-crm_SKILL.md");
  const css = read("src/app/globals.css");
  const token = (name: string) => {
    const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6});`));
    expect(m, `globals.css must carry --color-${name}`).not.toBeNull();
    return (m as RegExpMatchArray)[1].toLowerCase();
  };
  const rgb = (hex: string) =>
    hex
      .slice(1)
      .match(/.{2}/g)!
      .map((b) => parseInt(b, 16))
      .join(" ");

  it("§19's primary row mirrors the LIVE globals.css token (F-3)", () => {
    const hex = token("primary");
    expect(hex).toBe("#2563eb"); // the session-7 re-pin
    expect(skill).toContain(`| \`primary\` | \`${hex}\` | ${rgb(hex)} |`);
    expect(skill).not.toContain("| `primary` | `#3b82f6` | 59 130 246 |");
  });

  it("§19's primary-hover row mirrors the LIVE token (F-4)", () => {
    const hex = token("primary-hover");
    expect(hex).toBe("#1d4ed8");
    expect(skill).toContain(`| \`primary-hover\` | \`${hex}\` | ${rgb(hex)} |`);
    expect(skill).not.toContain("| `primary-hover` | `#2563eb` | 37 99 235 |");
  });

  it("§4.1's block carries the LIVE semantic tokens + line-strong (F-5)", () => {
    expect(skill).toContain(`--color-primary: ${token("primary")};`);
    expect(skill).toContain(`--color-primary-hover: ${token("primary-hover")};`);
    expect(skill).toContain(`--color-foreground: ${token("foreground")};`);
    expect(skill).toContain(`--color-line: ${token("line")};`);
    expect(skill).toContain(`--color-line-strong: ${token("line-strong")};`);
    expect(skill).toContain(`--color-line-soft: ${token("line-soft")};`);
    // the five stale era-1 forms retired
    expect(skill).not.toContain("--color-primary: #3b82f6;");
    expect(skill).not.toContain("--color-foreground: #111827;");
    expect(skill).not.toContain("--color-line: #e5e7eb;");
    expect(skill).not.toContain("--color-line-soft: #f3f4f6;");
  });

  it("§4.1's heading carries the scoped form — the false complete label retired (F-5)", () => {
    expect(skill).not.toContain("### 4.1 The `@theme` block (complete)");
    expect(skill).toContain("### 4.1 The `@theme` core (the semantic subset)");
  });

  it("§4.1's census note carries the LIVE --color token count (F-5)", () => {
    const colorTokens = (css.match(/^\s*--color-/gm) ?? []).length;
    expect(colorTokens).toBe(127); // the s88 V3-PALETTE families included
    expect(skill).toContain(`carries ${colorTokens} \`--color-*\` tokens`);
  });

  it("§20's env cross-reference carries the six-knob form (F-6)", () => {
    expect(skill).toContain("Environment interface (6 vars): see §3.3.");
    expect(skill).not.toContain("Environment interface (3 vars): see §3.3.");
  });

  it("Appendix B's runtime prose is internally consistent (F-19)", () => {
    // the wall-clock paragraph's "~15 s" contradicted the table row's
    // "~18 s" — the paragraph form flipped to match (the count-agnostic
    // pin: the suite count rides the ladder, the runtime claim is the
    // consistency invariant)
    expect(skill).not.toContain("~15 s (");
    expect(skill).toContain("~21 s (");
  });
});

// ---------------------------------------------------------------------------
// WP-1f — the README tree/quick-start/gates pins (F-169h/i/j/n).
// ---------------------------------------------------------------------------
describe("session-169 (WP-1f): the README tree + Quick Start + gate pins (F-169h/i/j/n)", () => {
  const readme = read("README.md");

  it("the file tree carries the s142 reality (F-169h)", () => {
    // the dashboard is (app)/dashboard/; / is the public landing; the
    // marketing pair + reset-password joined at s142/s163
    expect(readme).toContain("📄 page.tsx               # public landing (/ — the s142 marketing surface)");
    expect(readme).toContain("📂 dashboard/         # Dashboard (/dashboard)");
    expect(readme).toContain("📂 (marketing)/");
    expect(readme).toContain("📂 reset-password/");
    expect(readme).not.toContain("├── 📄 page.tsx           # Dashboard (/)");
  });

  it("the Quick Start narrates the landing reality (F-169i)", () => {
    expect(readme).not.toContain("Visiting `/` redirects to `/login`");
    expect(readme).toContain("Visiting `/` serves the public landing page");
    expect(readme).not.toContain("and land on a dashboard with 24 seeded leads");
    expect(readme).toContain("land back on the landing page");
  });

  it("the gate line carries the SIX drift gates (F-169j)", () => {
    expect(readme).not.toContain("gate + the FOUR drift sweeps");
    expect(readme).toContain("gate + the SIX drift gates");
  });

  it("the Tested row carries the LIVE space-y census (F-169n)", () => {
    // the dialog-geometry census idiom: comment-stripped occurrences
    // across the files grep -rl finds
    const files = execFileSync(
      "grep",
      ["-rl", "space-y-", `${root}/src`, "--include=*.ts", "--include=*.tsx"],
      { encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean);
    let total = 0;
    for (const f of files) {
      total += (noComments(readFileSync(f, "utf8")).match(/space-y-/g) ?? []).length;
    }
    expect(files.length).toBe(23); // the dialog-geometry census (s170: the boundary family +2)
    // session-187 re-anchor: 123 -> 122 (the walk60 D-187a3 listBody
    // retirement — the README's Tested row flipped in the same commit)
    expect(total).toBe(122);
    expect(readme).toContain(`the space-y census at ${files.length} files / ${total} occurrences`);
    expect(readme).not.toContain("the space-y census re-anchored 110/18");
  });
});

// ---------------------------------------------------------------------------
// WP-1g — the AGENTS straggler pins (F-1/F-11/F-12/F-13).
// ---------------------------------------------------------------------------
describe("session-169 (WP-1g): the AGENTS.md straggler pins (F-1/F-11/F-12/F-13)", () => {
  const agents = read("AGENTS.md");
  // whitespace-normalized view — the straggler clauses wrap across lines
  const agentsNorm = agents.replace(/\s+/g, " ");

  it("the sitemap line carries the eleven-URL form (F-1)", () => {
    const routes = (read("src/app/sitemap.xml/route.ts").match(/\{ path: "/g) ?? []).length;
    expect(routes).toBe(11);
    expect(agentsNorm).toContain("an eleven-URL `/sitemap.xml`");
    expect(agentsNorm).not.toContain("a nine-URL `/sitemap.xml`");
  });

  it("the metadata doctrine carries the LIVE pageMetadata consumer census (F-11)", () => {
    // the census: primary page.tsx routes that call pageMetadata (the
    // client parts and aliases excluded — the ROUTE-entry definition)
    const primaryPages = walk("src/app").filter(
      (f) => f.endsWith("page.tsx") && !f.match(/-page\.tsx$/),
    );
    const consumers = primaryPages.filter((f) => read(f).includes("pageMetadata(")).length;
    const aliases = walk("src/app").filter(
      (f) => f.endsWith("page.jsx") && read(f).includes("pageMetadata("),
    ).length;
    expect(primaryPages.length).toBe(15); // the inventory-census surface
    expect(consumers).toBe(13); // 8 inner + login + signup + marketing pair + reset-password
    expect(aliases).toBe(10); // the capitalized RENDER aliases (Dashboard inherits root)
    expect(agents).toContain(`(the ${consumers} primary pages consume it`);
    // the SITE-FORM anchor (the full wrapped clause): the session records
    // quote the retired fragment by name — only the original site's own
    // construction carries the "; the dashboard inherits" continuation
    expect(agents).not.toContain(
      "the 8 inner wrappers + login + signup consume it; the dashboard\n  inherits the root layout",
    );
  });

  it("the 596/38 clause carries its era marker (F-12)", () => {
    expect(agents).not.toContain("— 596 Vitest checks across\n  38 suites (session-13 added");
    expect(agents).toContain("596 Vitest checks across\n  38 suites at the s22 era");
  });

  it("the color-mix clause carries the count-free live form (F-13)", () => {
    // the compiled count is build-dependent (no build before unit in
    // the gate) — the count-free form is the root cure; the s169 census
    // (293) lives in the session record, not the live-tense doctrine
    expect(agentsNorm).not.toContain("carries 242 `color-mix()` calls");
    expect(agentsNorm).toContain("carries the `color-mix()` family the classic parser cannot read");
  });
});

// ---------------------------------------------------------------------------
// WP-1h — the production-secret doc posture (F-169p's doc face): the
// .env.example truth line + the env-table default cells. The code face
// (the secret() gate itself) rides tests/auth.test.ts.
// ---------------------------------------------------------------------------
describe("session-169 (WP-1h): the production-secret doc posture (F-169p — the doc face)", () => {
  it(".env.example carries the production fail-hard line + the retired false contrast absent", () => {
    // whitespace-normalized with the comment-continuation '#' prefixes
    // stripped — the comment wraps across '#' lines
    const envExampleNorm = read(".env.example")
      .replace(/\n#\s?/g, " ")
      .replace(/\s+/g, " ");
    expect(envExampleNorm).toContain("in production a missing or shorter value FAILS HARD");
    // the contiguous fragment of the retired false contrast (the wrapped
    // whole never matches — the s167 line-wrap lesson)
    expect(envExampleNorm).not.toContain("hard error an unset value raises");
  });

  it("README + PAD env tables carry the production-fail default cells", () => {
    const readme = read("README.md");
    const pad = read("Project_Architecture_Document.md");
    expect(readme).toContain("| `AUTH_SECRET` | Prod | HMAC secret for session cookies (≥16 chars — production fails hard on missing/short) |");
    expect(pad).toContain("| `AUTH_SECRET` | Prod (≥16 chars — fails hard in production) |");
  });
});

// ---------------------------------------------------------------------------
// Session-204 (D-204a1) — the .env.example parity-tools contract (the
// F-167e genus on the TOOLING axis): the drift-gate scripts consume
// four env vars with baked-in defaults (scripts/sweep.ts:741-744 —
// OUR_URL · REF_URL · REF_EMAIL · REF_PASSWORD; the drift-probe +
// interior-census family rides the same REF_* pair) — .env.example
// documents them or an operator running `gate:full` against a different
// port/deployment has no knob. The LIVE-CENSUS doctrine (F-109a1): the
// defaults are read from the sweep's OWN source, so a default change
// in the tool fails this pin until the doc face follows.
// ---------------------------------------------------------------------------
describe("session-204 (D-204a1): the .env.example parity-tools contract (the drift-gate knobs)", () => {
  it(".env.example documents the four parity-tool vars (the F-167e genus, tooling axis)", () => {
    const envExample = read(".env.example");
    for (const knob of ["OUR_URL", "REF_URL", "REF_EMAIL", "REF_PASSWORD"]) {
      expect(envExample, `the ${knob} knob must appear in .env.example`).toContain(knob);
    }
  });

  it("the documented defaults match the sweep's own source (the live-census doctrine)", () => {
    // the tool's defaults, read live from scripts/sweep.ts — the pin
    // fails if the tool's defaults move without the doc face following
    const sweep = read("scripts/sweep.ts");
    const liveDefaults: Record<string, string> = {};
    for (const line of sweep.split("\n")) {
      const m = /^const (OUR_URL|REF_URL|REF_EMAIL|REF_PASSWORD) = process\.env\.\1 \?\? "([^"]*)";$/.exec(line);
      if (m) liveDefaults[m[1] as keyof typeof liveDefaults] = m[2];
    }
    expect(Object.keys(liveDefaults).sort()).toEqual(
      ["OUR_URL", "REF_EMAIL", "REF_PASSWORD", "REF_URL"],
    );
    // .env.example carries each default verbatim in the commented block
    const envExample = read(".env.example");
    for (const [knob, dflt] of Object.entries(liveDefaults)) {
      expect(envExample, `the ${knob} default cell`).toContain(`# ${knob}=${dflt}`);
    }
  });
});

// ---------------------------------------------------------------------------
// Session-204 (D-204b2) — the TITLE-ATTRIBUTE SOURCE CENSUS: the scoping
// guard for the a11y register's `span[title=` matcher arm (D-204b1). The
// calendar event chip is the ONLY `title={` HTML-attribute construction in
// src/ (the axe target form the arm sanctions); a future title= anywhere
// else trips this census BEFORE the arm can silently widen — the F-109a1
// live-census doctrine applied to a matcher's blast radius.
// ---------------------------------------------------------------------------
describe("session-204 (D-204b2): the title-attribute source census (the span[title= arm's scoping guard)", () => {
  it("the calendar event chip is the ONLY title= attribute construction in src/", () => {
    const hits: string[] = [];
    for (const f of walk("src")) {
      if (!/\.(tsx|ts)$/.test(f)) continue;
      const text = read(f);
      // The HTML-attribute forms (title={…} AND title="…") on a DOM
      // (lowercase) tag — NOT a CAPITALIZED component's prop pass
      // (PageHeader title="Accounts" / MockDashboard title={row.title}
      // render as text content, never an HTML attribute — axe never
      // sees them), not the <title> element, not the dialog Title
      // components. Multiline JSX props are handled by scanning
      // BACKWARD from each title= to its enclosing tag opener.
      const tagOpeners: Array<{ pos: number; name: string }> = [];
      const tagRe = /<([A-Za-z][\w.]*)/g;
      let tm: RegExpExecArray | null;
      while ((tm = tagRe.exec(text)) !== null) {
        tagOpeners.push({ pos: tm.index, name: tm[1] });
      }
      const titleRe = /title=(?:\{|")/g;
      let m: RegExpExecArray | null;
      while ((m = titleRe.exec(text)) !== null) {
        // the nearest tag opener at-or-before this attribute
        let opener: string | undefined;
        for (const t of tagOpeners) {
          if (t.pos > m.index) break;
          opener = t.name;
        }
        if (!opener || /^[A-Z]/.test(opener)) continue; // component prop
        if (opener === "title") continue; // the <title> element
        const line = text.slice(0, m.index).split("\n").length;
        hits.push(`${f}:${line}`);
      }
    }
    expect(
      hits.sort(),
      "exactly ONE title= construction may exist (the calendar chip) — more trips the census: the span[title= matcher arm must be re-adjudicated",
    ).toEqual(["src/app/(app)/calendar/calendar-page.tsx:419"]);
  });

  it("the a11y register carries the span[title= arm inside the white-wash matcher (the D-204b1 face)", () => {
    const spec = read("tests/e2e/a11y.spec.ts");
    expect(spec).toContain('"span[title="');
    expect(spec).toContain("THE CALENDAR TODAY-CHIP ARM (session-204, D-204b1)");
  });
});

// ---------------------------------------------------------------------------
// Session-205 (D-205a1) — THE .ENV.EXAMPLE E2E-PORT + HEADLESS KNOBS (the
// F-167e genus on the TOOLING axis, the D-204a1 continuation): the s204
// round documented the four drift-gate knobs the sweep consumes, but the
// repo's own tooling reads TWO MORE env vars with no documented face —
//   E2E_PORT  — the e2e boot port (single source: tests/e2e/e2e-port.ts,
//               consumed by playwright.config.ts + the crm.spec 401 probe;
//               an operator with a :3100 conflict has no knob)
//   HEADLESS  — the drift scripts' watch mode (HEADLESS=0 to watch the
//               captures — sweep.ts / drift-probe.ts / interior-census.ts,
//               documented only in the scripts' own header comments)
// The LIVE-CENSUS doctrine (F-109a1): the E2E_PORT default is read from
// the e2e-port module's OWN source, so a default change in the tool fails
// this pin until the doc face follows.
// ---------------------------------------------------------------------------
describe("session-205 (D-205a1): the .env.example e2e-port + headless knobs (the tooling axis, the D-204a1 continuation)", () => {
  it(".env.example documents the E2E_PORT + HEADLESS tooling vars", () => {
    const envExample = read(".env.example");
    expect(envExample, "the E2E_PORT knob must appear in .env.example").toContain("E2E_PORT");
    expect(envExample, "the HEADLESS knob must appear in .env.example").toContain("HEADLESS");
  });

  it("the documented E2E_PORT default matches the e2e-port module's own source (the live-census doctrine)", () => {
    // the tool's default, read live from tests/e2e/e2e-port.ts — the pin
    // fails if the tool's default moves without the doc face following
    const source = read("tests/e2e/e2e-port.ts");
    const m = /export const E2E_PORT_DEFAULT = "(\d+)";/.exec(source);
    expect(m, "the E2E_PORT_DEFAULT literal must exist in tests/e2e/e2e-port.ts").not.toBeNull();
    const liveDefault = m![1];
    // .env.example carries the default verbatim in the commented block
    const envExample = read(".env.example");
    expect(
      envExample,
      "the E2E_PORT default cell",
    ).toContain(`# E2E_PORT=${liveDefault}`);
  });
});

// ---------------------------------------------------------------------------
// Session-205 (D-205a2) — THE ENV-FACE TOTALITY CENSUS (the F-167e genus
// CLOSES): D-204a1 pinned the four knobs that round's audit found; this
// round's audit found TWO MORE the per-knob pin never saw — the instance
// cure cannot close the genus. THE CURE: walk src/ + scripts/ + tests/
// (the skills/ folder is excluded from code checking per the standing
// rule) for every process.env.* consumer on comment-stripped source,
// subtract the framework/convention exclusion set (NODE_ENV · CI ·
// NEXT_RUNTIME · NEXT_PHASE — framework-owned knobs never belong in the
// app's env face), and assert EVERY remaining knob appears in
// .env.example. Any future env var added to the code without a doc face
// trips this census RED at the unit gate. The REVERSE arm: every env var
// NAME .env.example offers must be a real consumer — a stale/phantom knob
// in the doc face (a rename leaves the old name behind) trips it too.
// ---------------------------------------------------------------------------
describe("session-205 (D-205a2): the env-face totality census (the F-167e genus closes)", () => {
  // framework/convention-owned knobs — never documented in .env.example
  // (the D-195a1 scrubbing precedent runs the other way: the e2e child
  // env is PINNED, not documented)
  const FRAMEWORK_SET = new Set(["NODE_ENV", "CI", "NEXT_RUNTIME", "NEXT_PHASE"]);

  const consumerCensus = (): Set<string> => {
    const found = new Set<string>();
    for (const dir of ["src", "scripts", "tests"]) {
      for (const f of walk(dir)) {
        if (!/\.(tsx|ts)$/.test(f)) continue;
        // comment-stripped: header-comment mentions (the scripts' own
        // "Env:" banners) must not mask a real consumer's absence
        const text = noComments(read(f));
        const re = /process\.env\.([A-Z_0-9]+)/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
          if (!FRAMEWORK_SET.has(m[1])) found.add(m[1]);
        }
      }
    }
    return found;
  };

  it("every non-framework process.env consumer in src/ + scripts/ + tests/ is documented in .env.example", () => {
    const envExample = read(".env.example");
    const consumers = consumerCensus();
    // the standing face: the six app knobs + the four s204 parity knobs
    // + this round's E2E_PORT + HEADLESS — the totality
    expect(consumers).toEqual(
      new Set([
        "DATABASE_URL",
        "AUTH_SECRET",
        "NEXT_PUBLIC_SITE_URL",
        "NEO_PROXY_HOPS",
        "NEO_DISABLE_IN_APP_OTP",
        "NEO_DISABLE_IN_APP_RESET",
        "OUR_URL",
        "REF_URL",
        "REF_EMAIL",
        "REF_PASSWORD",
        "E2E_PORT",
        "HEADLESS",
      ]),
    );
    for (const knob of consumers) {
      expect(envExample, `the ${knob} knob must appear in .env.example`).toContain(knob);
    }
  });

  it("every env var .env.example offers is a real consumer (no phantom knobs in the doc face)", () => {
    const envExample = read(".env.example");
    // every VAR= line (commented or live) — the PostgreSQL example line
    // carries the same DATABASE_URL name, the only duplicate
    const offered = new Set<string>();
    for (const m of envExample.matchAll(/^(# )?([A-Z_0-9]+)=/gm)) {
      offered.add(m[2]);
    }
    const consumers = consumerCensus();
    const phantoms = [...offered].filter((k) => !consumers.has(k));
    expect(
      phantoms,
      "every .env.example knob must be a real code consumer (a phantom means a rename left the doc face behind)",
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Session-207 (D-207b1) — THE CHART-STACK DOC-FAMILY PIN (F-207b): the
// s176 recharts major (2.15 → 3.10.1, ADR-021) updated CLAUDE's charts
// row + the PAD's stack row (live-pinned by the WP-1a STACK loop since
// s169) — but the SKILL §2 Charts row kept BOTH stale cells (the 2.15.x
// version + the pre-s10 "empty-state fallback" doctrine note), the SKILL
// §10 chart-blank row kept the pre-s10 doctrine, and the README stack
// table kept the 2.15 version — 31 green sessions (s176 → s206). The
// WP-1a SKILL pin covers only the next + playwright rows; no pin guarded
// the Charts row anywhere. THE CURE: the three doc flips (the code-wins
// rule) + this pin family — the version cells read LIVE from node_modules
// (the F-109a1 live-census doctrine: a recharts bump fails the pin until
// the doc face follows), the doctrine cells frozen to the s10/s176 live
// forms, the stale fingerprints banned AT their claim sections (the s206
// scoping doctrine — historical session records keep their ship-time
// quotes; the pin bans the LIVE claim site).
// ---------------------------------------------------------------------------
describe("session-207 (D-207b1): the chart-stack doc-family live-census (F-207b — the recharts row joins the pin)", () => {
  const section = (doc: string, from: string, to: string) => {
    const s = doc.indexOf(from);
    expect(s, `${from} must exist in the doc`).toBeGreaterThan(0);
    const e = doc.indexOf(to, s);
    return doc.slice(s, e > s ? e : undefined);
  };
  const recharts = installed("recharts");

  it("SKILL §2's Charts row mirrors the LIVE recharts + the real-chart doctrine (the 31-session instance)", () => {
    const sec2 = section(
      read("neo-crm_SKILL.md"),
      "## 2. Tech Stack & Environment",
      "## 3. Bootstrapping & Configuration",
    );
    expect(
      sec2,
      "the §2 Charts row's version cell must mirror the installed recharts",
    ).toContain(`| Charts | recharts | \`${majorMinor(recharts)}.x\` |`);
    expect(sec2, "the §2 Charts row carries the s10 real-chart doctrine").toContain(
      "the REAL chart renders at all-zero data",
    );
    expect(sec2, "the pre-176 version cell is retired at its claim section").not.toContain(
      "| Charts | recharts | `2.15.x` |",
    );
    expect(sec2, "the pre-s10 empty-state-fallback note is retired at its claim section").not.toContain(
      "Every chart has an empty-state fallback",
    );
  });

  it("the chart-stack family lockstep: README's row + SKILL §10's blank-chart note + CLAUDE's migration form (the genus)", () => {
    const readme = read("README.md");
    expect(
      readme,
      "README's stack-table Charts row must mirror the installed recharts",
    ).toContain(`| Charts | recharts | ${majorMinor(recharts)} |`);
    expect(readme, "the pre-176 README row is retired").not.toContain(
      "| Charts | recharts | 2.15 |",
    );
    const sec10 = section(
      read("neo-crm_SKILL.md"),
      "## 10. Debugging Guide",
      "## 11. Pre-Ship Checklist",
    );
    expect(sec10, "the §10 chart-blank row carries the s10 zero-data doctrine").toContain(
      "the REAL chart renders at zero",
    );
    expect(sec10, "the pre-s10 §10 doctrine is retired at its claim section").not.toContain(
      "by design — empty-state fallback",
    );
    // the freeze arm: CLAUDE's charts row carries the live migration form
    // (a future recharts bump fails here until CLAUDE's row follows)
    expect(read("CLAUDE.md")).toContain(`2.15 → ${recharts}`);
  });
});

// ---------------------------------------------------------------------------
// Session-208 (D-208a1 + D-208a2) — THE DOC-CLAIM TOTALITY CENSUS (F-208a —
// the genus the s206/s207 closes both named as "its own rotation's
// material"). The census walk (executed before the plan landed): 1516+
// claims verified across the mechanically-checkable families — the bun-run
// command claims, the backticked repo-path claims, the ADR references, the
// transcript references, the route counts, the line-count families, and
// the SKILL §5.2 structural cluster — THE DOC FAMILY IS CLEAN at the s207
// ship state (the three regex-flagged sites are doctrine-covered: the
// negative `prisma/migrations/` claim, the PAD ADR's rejected-alternative
// `prisma/.env` narration, and the SKILL §16p lesson with its inline s24
// supersession). The census's structural finding: ONE unguarded cluster —
// §5.2 "Inventory (verified counts)" carries the component/page/route-
// gating census (28 .tsx / 22 "use client" / 15 pages / 29 routes /
// 19 gated / 10 ungated) with NO pin anywhere reading it — the F-207b
// exposure (correct-and-unpinned is one refactor away from a 31-session
// stale ride). THE CURE — the two genus pins, born-green at the cured
// tree (the doc family is clean; the round's material IS the pin — the
// D-205a2 born-green-census precedent), MUTATION-PROVEN x5 at birth:
//   D-208a1  the §5.2 structural live-census — every count read LIVE
//            from the tree (the F-109a1 doctrine), asserted in the exact
//            claim forms + the freeze anchors (either face drifts -> RED)
//   D-208a2  the doc-claim totality census — the D-205a2 pattern on the
//            doc-claim axes: every LIVE-section `bun run <script>` claim
//            resolves in package.json scripts; every backticked repo path
//            resolves in the tree (extension-less forms matched against
//            .ts/.tsx siblings; a ±2-line negative-claim window — the doc
//            itself asserting absence — is a verified-by-doc claim, not a
//            phantom); every ADR-NNN reference resolves in the PAD. The
//            live-section scoping is the s206 doctrine: historical
//            session records keep their ship-time quotes; the pin bans
//            the LIVE claim sites (README/CLAUDE/DEPLOYMENT whole-file —
//            zero embedded session records; AGENTS head + Conventions/Git
//            islands; SKILL TOC+§1-§16a + §17-Appendix B; PAD §1-§7 head
//            + §7.2-§12 — the §7.1 inventory rows are session records).
// ---------------------------------------------------------------------------
describe("session-208 (D-208a1/D-208a2): the doc-claim totality census (F-208a — every live claim family joins the pin)", () => {
  const section = (doc: string, from: string, to: string) => {
    const s = doc.indexOf(from);
    expect(s, `${from} must exist in the doc`).toBeGreaterThan(0);
    const e = doc.indexOf(to, s);
    return doc.slice(s, e > s ? e : undefined);
  };

  it("D-208a1: SKILL §5.2's inventory carries the LIVE structural census (the component/page/gating counts)", () => {
    const sec52 = section(read("neo-crm_SKILL.md"), "### 5.2 Inventory", "### 5.3 ");
    const tsx = walk("src/components").filter((f) => f.endsWith(".tsx"));
    const useClient = tsx.filter((f) =>
      /^["']use client["']/.test(read(f).split("\n")[0] ?? ""),
    ).length;
    const pages = walk("src/app").filter((f) => f.endsWith("/page.tsx"));
    const routes = walk("src/app/api").filter((f) => f.endsWith("route.ts"));
    const gated = routes.filter(
      (f) => (noComments(read(f)).match(/requireSession\(/g) ?? []).length > 0,
    ).length;

    // the doc face must carry the LIVE numbers — the F-109a1 live-census
    // doctrine: a tree change fails here until the doc face follows
    expect(sec52, "the component census").toContain(
      `- ${tsx.length} \`.tsx\` files under \`src/components/\``,
    );
    expect(sec52, "the use-client census").toContain(
      `${useClient} start with \`"use client"\``,
    );
    expect(sec52, "the page census").toContain(
      `- ${pages.length} pages (\`src/app/**/page.tsx\`)`,
    );
    expect(sec52, "the route census").toContain(`- ${routes.length} API route files`);
    // the claim wraps across lines ("… — 19 gated via\n`requireSession()`…")
    // — the single-line anchor is the count form
    expect(sec52, "the gating census").toContain(`— ${gated} gated via`);
    expect(sec52, "the ungated census").toContain(`the ${routes.length - gated} ungated`);

    // the freeze anchors — the current census (a drift on EITHER face
    // fails with a named message, the WP-1a form)
    expect(tsx.length, "the live component census").toBe(28);
    expect(useClient, "the live use-client census").toBe(22);
    expect(pages.length, "the live page census").toBe(15);
    expect(routes.length, "the live route census").toBe(29);
    expect(gated, "the live gated census").toBe(19);
  });

  // the live-section map: [doc, startMarker (null = file start),
  // endMarker (null = file end)] — every marker verified unique at birth
  const LIVE_SEGMENTS: Array<[string, string | null, string | null]> = [
    ["README.md", null, null],
    ["CLAUDE.md", null, null],
    ["docs/DEPLOYMENT.md", null, null],
    // AGENTS: the live head (Commands + Architecture facts) up to the
    // first session record; the Conventions/Git island up to the next
    ["AGENTS.md", null, "**Session-50**"],
    ["AGENTS.md", "## Conventions that differ from defaults", "**Session-73 (SKILL v1.70.0)**"],
    // SKILL: the TOC + §1-§16a block; the §17-Appendix-B block (the
    // §16b+ session layers + Appendix C/D are historical records)
    ["neo-crm_SKILL.md", "## Table of Contents", "## 16b."],
    ["neo-crm_SKILL.md", "## 17. Responsive Breakpoint Reference", "## Appendix C:"],
    // PAD: §1-§7 head (the ADR sections live here); §7.2-§12 (the §7.1
    // inventory rows are session records)
    ["Project_Architecture_Document.md", null, "### 7.1 "],
    ["Project_Architecture_Document.md", "### 7.2 ", null],
  ];

  const liveText = (rel: string): string => {
    const doc = read(rel);
    const segs = LIVE_SEGMENTS.filter(([d]) => d === rel);
    expect(segs.length, `${rel} must have live segments defined`).toBeGreaterThan(0);
    return segs
      .map(([, from, to]) => {
        const s = from === null ? 0 : doc.indexOf(from);
        expect(s, `${rel}: the '${from}' live-section marker must exist`).toBeGreaterThanOrEqual(0);
        const e = to === null ? doc.length : doc.indexOf(to, s);
        return doc.slice(s, e > s ? e : doc.length);
      })
      .join("\n");
  };

  it("D-208a2 (the command arm): every live-section `bun run <script>` claim resolves in package.json", () => {
    const scripts = new Set(
      Object.keys(JSON.parse(read("package.json")).scripts as Record<string, string>),
    );
    // .env.example joins the command arm (its `bun run db:push` /
    // `db:seed` claims are live) — the D-205a2 census owns its knob face
    for (const doc of ["README.md", "CLAUDE.md", "docs/DEPLOYMENT.md", "AGENTS.md", "neo-crm_SKILL.md", "Project_Architecture_Document.md", ".env.example"]) {
      const text = doc === ".env.example" ? read(doc) : liveText(doc);
      for (const m of text.matchAll(/bun run ([a-z][a-z0-9:_-]{2,40})/g)) {
        expect(
          scripts.has(m[1]),
          `${doc}: the 'bun run ${m[1]}' claim must resolve in package.json scripts`,
        ).toBe(true);
      }
    }
  });

  it("D-208a2 (the path + ADR arm): every live-section repo path resolves + every ADR reference is defined in the PAD", () => {
    const pad = read("Project_Architecture_Document.md");
    // the PAD's two definition forms: the bold `**ADR-NNN: Title**`
    // (001-017) and the H3 `### ADR-NNN — Title` (018-022)
    const adrs = new Set<string>();
    for (const m of pad.matchAll(/\*\*ADR-(\d{3}):/g)) adrs.add(m[1]);
    for (const m of pad.matchAll(/### ADR-(\d{3})/g)) adrs.add(m[1]);
    expect(adrs.size, "the PAD must define its ADR inventory").toBeGreaterThan(0);
    // the negative-claim window: a path claim whose ±2-line context
    // asserts absence (the `prisma/migrations/` form) or rejects the
    // alternative (the PAD ADR form) is a verified-by-doc claim
    const NEGATIVE =
      /does not exist|there is no|no longer|not exist|removed|retired|never|absent|reject/i;
    const pathOk = (p: string) =>
      existsSync(join(root, p)) ||
      [".ts", ".tsx"].some((ext) => existsSync(join(root, p + ext)));

    // the generated-artifact contract (F-210a — the checkout-portability
    // cure, session-210): some live-section paths name RUNTIME ARTIFACTS —
    // git-ignored files the tools themselves create (the e2e scratch db,
    // the smoke scratch db, the persisted auth state). On a fresh clone
    // none of them resolves, and their contexts correctly assert USAGE,
    // not absence — the census must not require the artifact on disk,
    // only the tracked GENERATOR that creates it. The map is frozen and
    // live-pinned both ways: each generator must resolve (a deleted
    // generator → the named RED — the census pins the generator contract
    // the docs claim), and every entry must still be claimed in a live
    // section (a retired claim leaves a dead entry → the named RED — the
    // map can never rot). A path NOT in the map still needs the tree or
    // the NEGATIVE context — the carve-out does not gut the census.
    const GENERATED: Record<string, string> = {
      "db/e2e.db": "tests/e2e/global-setup.ts",
      "db/smoke.db": "scripts/smoke-test.sh",
      "tests/e2e/.auth/user.json": "playwright.config.ts",
    };
    for (const [artifact, generator] of Object.entries(GENERATED)) {
      expect(
        existsSync(join(root, generator)),
        `the generated-artifact contract: \`${artifact}\`'s generator \`${generator}\` must resolve in the tree`,
      ).toBe(true);
    }
    const liveAll = (["README.md", "CLAUDE.md", "docs/DEPLOYMENT.md", "AGENTS.md", "neo-crm_SKILL.md", "Project_Architecture_Document.md"] as const)
      .map((d) => liveText(d))
      .join("\n");
    for (const artifact of Object.keys(GENERATED)) {
      expect(
        liveAll.includes(`\`${artifact}\``),
        `the generated-artifact contract: \`${artifact}\` is no longer claimed in any live section — retire the map entry`,
      ).toBe(true);
    }

    for (const doc of ["README.md", "CLAUDE.md", "docs/DEPLOYMENT.md", "AGENTS.md", "neo-crm_SKILL.md", "Project_Architecture_Document.md"]) {
      const lines = liveText(doc).split("\n");
      lines.forEach((line, i) => {
        for (const m of line.matchAll(/`((?:src|scripts|tests|prisma|db|docs)\/[A-Za-z0-9._/@()-]+)`/g)) {
          const path = m[1].replace(/\/+$/, "");
          if (pathOk(path)) continue;
          // the runtime artifact — its tracked generator asserted above
          if (GENERATED[path]) continue;
          const ctx = lines.slice(Math.max(0, i - 2), i + 3).join(" ");
          expect(
            NEGATIVE.test(ctx),
            `${doc}: the path claim \`${path}\` must resolve in the tree (or its context must assert absence)`,
          ).toBe(true);
        }
        for (const m of line.matchAll(/\bADR-(\d{3})\b/g)) {
          expect(
            adrs.has(m[1]),
            `${doc}: the ADR-${m[1]} reference must be defined in the PAD`,
          ).toBe(true);
        }
      });
    }
  });
});

// Session-209 (D-209a1 + D-209a2) — THE PUSH-RITUAL REMOTE CONTRACT
// (F-209a — the fresh-eyes walk's catch: the operational push-ritual
// pair [docs/ssh_git_wrapper_v3.py + the how-to runbook] carried the
// SIBLING REPO's remote [task-management] verbatim from the initial
// scaffold — the wrapper's DEFAULT_REMOTE, its docstring claim, its
// Options default, and the runbook's purpose · cd · expected-output ·
// variants · troubleshooting · and the factually WRONG
// AGENTS-corroboration claim [the live AGENTS.md:7 says neo-crm]).
// The runbook's PRIMARY sequence invokes the wrapper with NO
// --remote — it rides the stale default; every round pushed safely
// only because AGENTS's git island + the operator's briefs carry the
// explicit neo-crm remote [the F-206a/F-207b correct-and-lucky
// genus]. The D-208a2 totality census never scoped this family (the
// six core docs + .env.example only). THE CURE — the remote-contract
// flips (D-209a1) + this pin (D-209a2, the genus closes):
//   it-1  the wrapper arm — the canonical remote read LIVE from
//         AGENTS.md's own head claim (the SSH transform), asserted
//         equal to the wrapper's DEFAULT_REMOTE (read live from the
//         code, the F-109a1 doctrine) + the freeze anchor + the
//         wrapper's own doc faces + the AGENTS git-island
//         invocation's explicit --remote (the cross-doc arm)
//   it-2  the runbook arm — the canonical SSH remote at the claim
//         sites (the purpose · the --remote variants · the
//         ls-remote troubleshooting line) + the AGENTS-corroboration
//         claim quoting the LIVE AGENTS clone remote + the STALE
//         FORM BAN (neither operational file contains
//         `task-management` — file-wide)
// Either face drifting — a wrapper default change, an AGENTS remote
// change, a lost invocation site, or a stale re-plant — fails with a
// named message. MUTATION-PROVEN x4 at birth.
// ---------------------------------------------------------------------------
describe("session-209 (D-209a2): the push-ritual remote contract (F-209a — the operational docs carry the repo's own remote)", () => {
  // the repo's canonical remote, read LIVE from AGENTS.md's own head
  // claim (the s109 live-census doctrine): the https clone URL at
  // the head, SSH-transformed — the same repo, both URL forms
  const agentsText = read("AGENTS.md");
  const agentsHead = agentsText.split("**Session-50**")[0] ?? "";
  const cloneM = agentsHead.match(
    /Clone remote: `https:\/\/github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)\.git`/,
  );
  expect(
    cloneM,
    "AGENTS.md's head must carry the `Clone remote:` claim (the pin derives the canonical remote from it)",
  ).toBeTruthy();
  const SSH_REMOTE = `git@github.com:${cloneM![1]}.git`;
  const HTTPS_REMOTE = `https://github.com/${cloneM![1]}.git`;

  it("D-209a2 (the wrapper arm): the wrapper's DEFAULT_REMOTE is the repo's own canonical SSH remote — the AGENTS contract, the docstring, and the Options default agree", () => {
    const wrapper = read("docs/ssh_git_wrapper_v3.py");
    // the live default, read from the code (the F-109a1 doctrine)
    const def = wrapper.match(/DEFAULT_REMOTE = "([^"]+)"/);
    expect(def, "the wrapper must define DEFAULT_REMOTE").toBeTruthy();
    expect(
      def![1],
      "the wrapper's default must be the AGENTS clone remote's SSH form",
    ).toBe(SSH_REMOTE);
    // the freeze anchor — a drift on either face names both
    expect(
      SSH_REMOTE,
      "the canonical SSH remote (the s209 freeze)",
    ).toBe("git@github.com:nordeim/neo-crm.git");
    // the wrapper's own doc faces carry the same remote (the
    // docstring's canonical-remote claim + the Options default)
    expect(
      wrapper,
      "the docstring's canonical-remote claim",
    ).toContain(`(\`${SSH_REMOTE}\`)`);
    expect(wrapper, "the Options default").toContain(`(default ${SSH_REMOTE})`);
    // the cross-doc arm: AGENTS's git-island invocation passes the
    // same remote explicitly (the living contract site that saved
    // every round's push)
    expect(
      agentsText,
      "the AGENTS git-island invocation's explicit --remote",
    ).toContain(`--remote ${SSH_REMOTE}`);
    // the STALE FORM BAN on the wrapper's own file — the sibling
    // repo's remote must stay gone (file-wide; the historical
    // field-test note names no repo — the historical-quote doctrine)
    expect(
      wrapper,
      "the stale sibling-repo remote must stay gone from the wrapper (F-209a)",
    ).not.toContain("task-management");
  });

  it("D-209a2 (the runbook arm): the push runbook carries the repo's own remote at every claim site — and the stale sibling-repo remote is banned file-wide", () => {
    const runbook = read("docs/how-to-git-push-using-ssh-wrapper_SKILL.md");
    // the purpose claim (the canonical SSH remote + the deploy-key form)
    expect(
      runbook,
      "the purpose claim",
    ).toContain(`${SSH_REMOTE}\` using a deploy key`);
    // the variant + troubleshooting sites
    expect(runbook, "the --remote variant sites").toContain(`--remote ${SSH_REMOTE}`);
    expect(
      runbook,
      "the ls-remote troubleshooting line",
    ).toContain(`git ls-remote ${SSH_REMOTE} refs/heads/main`);
    // the AGENTS-corroboration claim must quote the LIVE AGENTS
    // clone remote (F-209a's factually-wrong site)
    expect(
      runbook,
      "the AGENTS-corroboration claim must quote the live AGENTS clone remote",
    ).toContain(`AGENTS.md: clone remote is \`${HTTPS_REMOTE}\``);
    // the STALE FORM BAN on the runbook's own file — the sibling
    // repo's remote must stay gone (file-wide)
    expect(
      runbook,
      "the stale sibling-repo remote must stay gone from the runbook (F-209a)",
    ).not.toContain("task-management");
  });
});

// ---------------------------------------------------------------------------
// Session-213 (D-213a1): THE SEMANTIC-PROSE CONVENTIONS CENSUS — the
// AGENTS "Conventions that differ from defaults" block's semantic claims
// join the pin (F-213a: the F-206a home block, the last prose family
// with no teeth; the s212 close's named candidate, scoped to its first
// mechanically-checkable family). Every claim is read LIVE (the imported
// page-layout tokens, the installed zod, the walked z-tier inventory)
// and the DOC is asserted to carry it — EITHER face rotting (a token
// flip OR a doc edit) fails `bun run test`.
// ---------------------------------------------------------------------------
describe("session-213 (D-213a1): the semantic-prose conventions census (F-213a — the AGENTS conventions block joins the pin)", () => {
  const agents = read("AGENTS.md");
  const start = agents.indexOf("## Conventions that differ from defaults");
  const end = agents.indexOf("## Git", start);
  expect(start, "the conventions section must exist in AGENTS.md").toBeGreaterThan(0);
  const section = agents.slice(start, end > start ? end : undefined);
  // the prose-claim anchor form: the section's whitespace flattened to
  // single spaces (the s208 birth lesson — claims wrap across lines, the
  // anchor must be wrap-blind)
  const flat = section.replace(/\s+/g, " ");

  it("the VALIDATION-SEAM claim mirrors the live seam (zod ^4 · schemas.ts · parseBody · the URL-param helpers)", () => {
    // the doc face
    expect(flat).toContain("zod ^4");
    expect(flat).toContain("`src/lib/schemas.ts`");
    expect(flat).toContain("`parseBody()` in `src/lib/api.ts`");
    expect(flat).toContain("`asString`/`asNumber`/`asDate`");
    // the live face (the F-109a1 doctrine — read from the tree itself)
    expect(installed("zod").startsWith("4."), "the installed zod must be major 4").toBe(true);
    const schemas = read("src/lib/schemas.ts");
    expect(schemas.length, "schemas.ts must be a real module").toBeGreaterThan(100);
    expect(schemas).toMatch(/^export /m);
    const api = read("src/lib/api.ts");
    // the \b anchors are load-bearing (the M6 mutation-proof caught the
    // prefix-blind form: a parseBodyRenamed rename sailed through)
    expect(api).toMatch(/export (async )?function parseBody\b/);
    expect(api).toMatch(/export function asString\b/);
    expect(api).toMatch(/export function asNumber\b/);
    expect(api).toMatch(/export function asDate\b/);
  });

  it("the ICON-CASCADE claim mirrors the live tokens (nav+topbar h-5 w-5 · content h-4 w-4 · the uniform stroke-2)", () => {
    // the doc face
    expect(flat).toContain("`h-5 w-5` stroke-2");
    expect(flat).toContain("content icons stay `h-4 w-4`");
    // the live face — the layout tokens, read LIVE via the import
    expect(NAV_LAYOUT.icon).toBe("h-5 w-5");
    expect(TOPBAR_LAYOUT.iconClass).toBe("h-5 w-5");
    expect(TOPBAR_LAYOUT.searchIcon).toContain("h-5 w-5");
    expect(MOBILE_NAV_TRIGGER.icon).toBe("h-5 w-5");
    // the content-surface tokens carry h-4 w-4
    expect(REPORTS_FILTER_BAR.selectIcon).toContain("h-4 w-4");
    expect(REPORTS_FILTER_BAR.barBtnIcon).toContain("h-4 w-4");
    expect(TOPBAR_LAYOUT.userChevron).toContain("h-4 w-4");
    expect(LOGIN_LAYOUT.inputIcon).toContain("h-4 w-4");
    // the sidebar's uniform stroke — exactly ONE strokeWidth form, no
    // active/inactive variation (the session-7 re-pin claim)
    const sidebar = noComments(read("src/components/layout/sidebar.tsx"));
    expect(sidebar).toContain("strokeWidth={2}");
    expect(
      sidebar.match(/strokeWidth/g)?.length,
      "the sidebar must carry exactly one strokeWidth form (the no-variation claim)",
    ).toBe(1);
  });

  it("the DELTA-TEXT claim mirrors the live split (green/red-600 on deltas · success/danger stay on badges)", () => {
    // the doc face
    expect(flat).toContain("`text-green-600` / `text-red-600`");
    expect(flat).toContain("not the `success`/`danger` tokens (those stay on badges)");
    // the live face — the DELTA_TEXT token (read LIVE via the import)
    expect(DELTA_TEXT.good).toBe("text-green-600");
    expect(DELTA_TEXT.bad).toBe("text-red-600");
    // the hand-inlined delta site carries the raw classes, NOT the tokens
    const pageParts = noComments(read("src/components/shared/page-parts.tsx"));
    expect(pageParts).toContain("text-green-600");
    expect(pageParts).not.toContain("text-success");
    expect(pageParts).not.toContain("text-danger");
    // ...and the badge family keeps the tokens (the "stay on badges" arm)
    const toast = read("src/components/ui/toast.tsx");
    expect(toast).toContain("text-success");
    expect(toast).toContain("text-danger");
  });

  it("the Z-SCALE census — the live tier inventory stays on the flat scale (the D-205a2 census form)", () => {
    // the doc face — the four named tiers + the explicit ban
    expect(flat).toContain("topbar z-40, drawer/dialogs z-50, dropdown portals z-[60], toasts z-[100]");
    expect(flat).toContain("No ad-hoc `z-[9999]`");
    // the live face — walk comment-stripped src/ for EVERY z-tier
    const tiers = new Set<number>();
    for (const file of walk("src").filter((f) => /\.[jt]sx?$/.test(f))) {
      for (const m of noComments(read(file)).matchAll(/\bz-\[?(\d+)\]?/g)) {
        tiers.add(Number(m[1]));
      }
    }
    const FLAT_SCALE = [10, 40, 50, 60, 100];
    for (const tier of tiers) {
      expect(
        FLAT_SCALE.includes(tier),
        `z-${tier} (${[...tiers].join(", ")}) is off the flat scale ${FLAT_SCALE.join("/")} — the AGENTS z-index convention forbids ad-hoc tiers`,
      ).toBe(true);
    }
    for (const claimed of [40, 50, 60, 100]) {
      expect(
        tiers.has(claimed),
        `the claimed tier z-${claimed} must actually exist in src/`,
      ).toBe(true);
    }
    expect(tiers.has(9999), "z-[9999] is explicitly banned").toBe(false);
  });

  it("the ESLint-IGNORES claim mirrors the live config (skills/ + the build output dirs)", () => {
    // the doc face
    expect(flat).toContain("ESLint ignores `skills/`");
    // the live face — the config's ignores array
    const eslint = read("eslint.config.mjs");
    const ignores = eslint.match(/ignores:\s*\[([^\]]*)\]/)?.[1] ?? "";
    expect(ignores, "the ignores array must exist").not.toBe("");
    expect(ignores).toContain('"skills"');
    expect(ignores).toContain(".next");
    expect(ignores).toContain('"build/**"');
    expect(ignores).toContain("node_modules");
  });

  it("the CHARTS bullet (the AGENTS face D-207b1 never covered) carries the live chart doctrine", () => {
    expect(flat).toContain("recharts DEFAULTS");
    expect(flat).toContain("the REAL chart renders at all-zero data");
    expect(flat).toContain("fixed lists render ticks at zero, row-derived series render empty");
  });
});

// ---------------------------------------------------------------------------
// Session-214 (D-214a1): THE AUTH-BULLET SEMANTIC CENSUS — the AGENTS
// "Architecture facts you would otherwise guess wrong" section's FIRST
// bullet, the auth bullet, joins the pin (F-214a: the semantic-prose
// census's next family, the s213 close's named candidate). Every claim
// is read LIVE (the walked rate-limit call-site census, the exported
// session constants, the reset-funnel constants, the proxy-hops ladder,
// the guard exports) and the DOC is asserted to carry it — EITHER face
// rotting (a limit flip OR a doc edit) fails `bun run test`.
// ---------------------------------------------------------------------------
describe("session-214 (D-214a1): the auth-bullet semantic census (F-214a — the AGENTS architecture-facts auth bullet joins the pin)", () => {
  const agents = read("AGENTS.md");
  const start = agents.indexOf("## Architecture facts you would otherwise guess wrong");
  expect(start, "the architecture-facts section must exist in AGENTS.md").toBeGreaterThan(0);
  const firstBulletEnd = agents.indexOf("\n- **API envelope", start);
  expect(firstBulletEnd, "the auth bullet must end at the API-envelope bullet").toBeGreaterThan(start);
  // the wrap-blind flattened form (the s208/s213 birth lesson)
  const bullet = agents.slice(start, firstBulletEnd).replace(/\s+/g, " ");

  it("the RATE-LIMIT TABLE claim mirrors the live call-site census (the seven-route table at the 15-min window)", () => {
    // the doc face
    expect(bullet).toContain("login 10, signup 10, resend 5, verify 20, forgot 10, reset 10");
    expect(bullet).toContain("session-67 adds the sessioned upload route at 20");
    expect(bullet).toContain("per IP/15 min");
    // the live face — the CENSUS: every rateLimit call site's family,
    // limit, and window (a new/changed/removed site trips the census)
    const found = new Map<string, { limit: string; window: string }>();
    for (const file of walk("src/app/api").filter((f) => f.endsWith("route.ts"))) {
      for (const m of noComments(read(file)).matchAll(
        /rateLimit\(`(\w+):\$\{clientKey\((?:req|request)\)\}`\s*,\s*(\d+)\s*,\s*([^)]+)\)/g,
      )) {
        found.set(m[1], { limit: m[2], window: m[3].replace(/\s+/g, "") });
      }
    }
    const TABLE: Record<string, string> = {
      login: "10",
      signup: "10",
      resend: "5",
      verify: "20",
      forgot: "10",
      reset: "10",
      upload: "20",
    };
    expect(
      [...found.keys()].sort(),
      "the live census must carry exactly the documented seven rate-limit families",
    ).toEqual(Object.keys(TABLE).sort());
    for (const [family, limit] of Object.entries(TABLE)) {
      expect(found.get(family)?.limit, `the ${family} limit must stay at ${limit}`).toBe(limit);
      expect(found.get(family)?.window, `the ${family} window must stay at 15 min`).toBe("15*60*1000");
    }
  });

  it("the SESSION-CONTRACT claim mirrors the live seam (scrypt:salt:hash · HMAC-SHA256 · neo_session · 7-day TTL · uid,iat,exp,v)", () => {
    // the doc face
    expect(bullet).toContain("scrypt password hashes (`scrypt:salt:hash`)");
    expect(bullet).toContain("HMAC-SHA256 signed stateless cookie `neo_session` (7-day TTL)");
    expect(bullet).toContain("`uid,iat,exp,v`");
    // the live face — the password format template
    expect(read("src/lib/password.ts")).toContain("`scrypt:${salt}:${hash}`");
    // the session constants + the payload field census + the HMAC pair
    const auth = read("src/lib/auth.ts");
    expect(auth).toContain('export const SESSION_COOKIE = "neo_session"');
    expect(auth).toContain("export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000");
    const payload = noComments(auth).match(/export interface SessionPayload \{([^}]*)\}/)?.[1] ?? "";
    const fields = [...payload.matchAll(/^\s*(\w+):/gm)].map((m) => m[1]);
    expect(fields, "the payload must carry exactly the four documented fields").toEqual([
      "uid",
      "iat",
      "exp",
      "v",
    ]);
    expect(auth.match(/createHmac\("sha256"/g)?.length, "the sign + verify HMAC pair").toBe(2);
  });

  it("the RESET-FUNNEL claim mirrors the live constants (32-byte token · 60-min TTL · P2024/P2028→503 · the eviction)", () => {
    // the doc face
    expect(bullet).toContain("32-byte crypto-random token, 60-min TTL");
    expect(bullet).toContain("no-enumeration 200");
    expect(bullet).toContain("P2024/P2028→503");
    // the live face — the forgot route's constants
    const forgot = read("src/app/api/auth/forgot-password/route.ts");
    expect(forgot).toContain("randomBytes(32)");
    expect(forgot).toContain("RESET_TOKEN_TTL_MS = 60 * 60 * 1000");
    // the reset route's 503 mapping (the co-location arm) + the eviction
    const reset = noComments(read("src/app/api/auth/reset-password/route.ts"));
    expect(reset).toMatch(/error\.code === "P2024" \|\| error\.code === "P2028"[\s\S]{0,200}503/);
    expect(reset).toContain("tokenVersion: { increment: 1 }");
  });

  it("the PROXY-HOPS claim mirrors the live ladder (unset=1 · unparsable/negative fails CLOSED · else the parsed depth)", () => {
    // the doc face
    expect(bullet).toContain("unset=1, 0=direct/unknown, N≥2=Nth-from-last, unparsable fails closed");
    // the live face — the exact parse ladder in proxyHopDepth()
    const ladder = read("src/lib/rate-limit.ts");
    expect(ladder).toContain("export function proxyHopDepth()");
    expect(ladder).toContain('if (raw === undefined || raw === "") return 1;');
    expect(ladder).toContain("if (!Number.isFinite(parsed) || parsed < 0) return 1;");
    expect(ladder).toContain("return parsed;");
  });

  it("the GUARD claims mirror the live tree (requireSession + isGuarded exported · no NextAuth · no middleware)", () => {
    // the doc face
    expect(bullet).toContain("`requireSession()` + the `isGuarded()` narrowing helper guard every route handler");
    expect(bullet).toContain("No NextAuth, no JWTs, no middleware/proxy");
    // the live face — the guard exports (the \b anchors, the s213 M6 lesson)
    const api = read("src/lib/api.ts");
    expect(api).toMatch(/export (async )?function requireSession\b/);
    expect(api).toMatch(/export function isGuarded\b/);
    // no NextAuth in the dependency manifest
    const pkg = JSON.parse(read("package.json")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    expect({ ...pkg.dependencies, ...pkg.devDependencies }).not.toHaveProperty("next-auth");
    // no middleware anywhere in src/ (the walk census)
    expect(walk("src").filter((f) => f.endsWith("middleware.ts")), "the no-middleware claim").toEqual([]);
  });
});

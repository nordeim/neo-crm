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
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

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

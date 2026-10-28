// Session-168 (WP-1): THE INVENTORY LIVE-CENSUS — the L-165c1 doctrine
// extended from the schema seam (s167) to the DOC INVENTORY LAYER.
//
// The audit's finding register (F-168a…i): ten stale doc-truth sites the
// existing pin families never read —
//   F-168c  PAD §11's Lines column: SEVEN stale rows (api 172/308 ·
//           constants 547/549 · rate-limit 51/126 · mobile-nav 215/143 ·
//           app-shell 70/94 · globals.css 413/430 · (app)/layout 11/22)
//           — the s109 line-census family pinned THIRTEEN rows + the
//           SKILL headers but never these PAD rows (the exact gap class
//           that let them drift through s142-s165).
//   F-168d  SKILL §3.2's layer map: "pages (11) + API route handlers
//           (27)" — live 15/29 (the s142 marketing trio + the s163
//           reset-password page + the s163 auth-route pair never joined).
//   F-168e  SKILL §5.2's inventory: "25 .tsx / 19 use client" (live
//           28/22) + the "11 pages" enumeration (live 15).
//   F-168f  SKILL §3.1's schema row: "8 models" (live 9).
//   F-168g  SKILL §9's Bug #1: "7-check e2e suite" (live 10-check).
//   F-168h  SKILL §19's color mirror: primary-foreground #ffffff (live
//           #fafafa — the s119 re-pin §4.1 carries).
//   F-168a  AGENTS.md's architecture-facts doctrine: the retired
//           "keeps the `asString` guards" incremental-path clause.
//   F-168b  AGENTS.md's conventions: "No schema library — zod was
//           deliberately pruned" — contradicting the same file's seam.
//   F-168i  README's "nine-route /sitemap.xml" (live 11 routes since
//           s142).
//
// The battery's design (the house live-census doctrine): every count is
// read LIVE from the source (the file's newline count, the tree's glob
// census, the schema's model census, the sitemap's ROUTES array, the
// spec's test census) and the DOC is asserted to carry it — the next
// staleness, EITHER face (a doc edit OR a source growth), fails
// `bun run test`. RED at birth on every stale site; GREEN when WP-2
// flips them. Mutation-proven at birth per the house doctrine.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");

// wc -l semantics: count the newline characters (all repo files are
// newline-terminated), so the live value equals `wc -l` exactly — the
// s109 line-census convention.
const lines = (p: string) => (read(p).match(/\n/g) ?? []).length;

// The tree census (the docs-counts walk idiom, repo-relative paths).
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

// ---------------------------------------------------------------------------
// WP-1a — the PAD §11 Lines-column live-census (F-168c): the whole
// count-carrying surface of the Key Files Reference table, every row
// asserted against its file's LIVE line count.
// ---------------------------------------------------------------------------
describe("session-168 (WP-1a): the PAD §11 Lines-column live-census — every count-carrying row carries its file's live count (F-168c)", () => {
  const pad = read("Project_Architecture_Document.md");
  const start = pad.indexOf("## 11. Key Files Reference");
  const end = pad.indexOf("## 12. Glossary");
  expect(start).toBeGreaterThan(0);
  const section = pad.slice(start, end > start ? end : undefined);
  // the count-carrying rows: | `path` | N | … (the "—" rows skip)
  const rows = [...section.matchAll(/^\| `([^`]+)` \| (\d+) \|/gm)].map(
    (m) => [m[1] as string, m[2] as string] as const,
  );
  // the surface itself is censused: 37 count-carrying rows today (27 at
  // s168 + the six s170 resilience-family rows + the two s171 a11y
  // rows + the two s172 dialog/property rows) — a row silently
  // added/removed fails THIS pin before any row pin.
  it("the §11 table's count-carrying row surface is censused (37 rows — a row added or dropped fails here first)", () => {
    expect(rows.length).toBe(37); // s172: 35 + the dialog-controls + property rows
  });

  for (const [file, claimed] of rows) {
    it(`\`${file}\` — the row carries the LIVE count (claimed ${claimed})`, () => {
      const live = lines(file);
      expect(claimed, `PAD says ${claimed}; the file is ${live} lines`).toBe(
        String(live),
      );
    });
  }
});

// ---------------------------------------------------------------------------
// WP-1b — the SKILL inventory live-census (F-168d…h): the tree read live.
// ---------------------------------------------------------------------------
describe("session-168 (WP-1b): the SKILL inventory live-census — the tree read live (F-168d/e/f/g/h)", () => {
  const skill = read("neo-crm_SKILL.md");

  // F-168f: the models count — read live from the schema.
  it("§3.1's schema row carries the LIVE model count (F-168f)", () => {
    const models = (read("prisma/schema.prisma").match(/^model /gm) ?? []).length;
    expect(models).toBe(9); // the tree census (the drift guard's own anchor)
    expect(skill).toContain(`\`prisma/schema.prisma\` | ${models} models;`);
    expect(skill).not.toContain("`prisma/schema.prisma` | 8 models;");
  });

  // F-168d: the layer map — pages + route files read live from the tree.
  // The page census: ROUTE `page.tsx` entries — the `*-page.tsx` client
  // parts (the session-10 thin-wrapper pattern) and the capitalized
  // `page.jsx` aliases (the s14 decision) are NOT new routes.
  it("§3.2's layer map carries the LIVE page + route-file counts (F-168d)", () => {
    const pages = walk("src/app").filter(
      (f) => f.endsWith("page.tsx") && !f.match(/-page\.tsx$/),
    ).length;
    // the API route census: src/app/api/** only — the three SEO route
    // handlers (sitemap.xml/robots.txt/manifest.json) are not API routes.
    const routes = walk("src/app/api").filter((f) => f.endsWith("route.ts")).length;
    expect(pages).toBe(15); // the tree census
    expect(routes).toBe(29); // the tree census
    expect(skill).toContain(`pages (${pages}) + API route handlers (${routes}) + layouts`);
    expect(skill).not.toContain("pages (11) + API route handlers (27)");
  });

  // F-168e: the §5.2 inventory — components + the page enumeration.
  it("§5.2's component counts carry the LIVE tree census (F-168e)", () => {
    const components = walk("src/components").filter((f) => f.endsWith(".tsx"));
    const client = components.filter((f) =>
      read(f).trimStart().startsWith('"use client"'),
    );
    expect(components.length).toBe(28); // the tree census
    expect(client.length).toBe(22); // the tree census
    expect(skill).toContain(
      `- ${components.length} \`.tsx\` files under \`src/components/\`; ${client.length} start with \`"use client"\`.`,
    );
    expect(skill).not.toContain(
      "- 25 `.tsx` files under `src/components/`; 19 start with",
    );
  });

  it("§5.2's page enumeration carries the LIVE count + the four post-s12 pages (F-168e)", () => {
    const pages = walk("src/app").filter(
      (f) => f.endsWith("page.tsx") && !f.match(/-page\.tsx$/),
    ).length;
    expect(skill).toContain(`- ${pages} pages (\`src/app/**/page.tsx\`)`);
    // the four pages the era-12 enumeration forgot
    for (const name of ["landing (", "about", "contact", "reset-password"]) {
      expect(skill).toContain(name);
    }
    expect(skill).not.toContain("- 11 pages (`src/app/**/page.tsx`): login, signup");
  });

  // F-168g: the Bug #1 line — the check count read live from the spec.
  it("§9's Bug #1 carries the LIVE mobile-nav spec check count (F-168g)", () => {
    const spec = read("tests/e2e/mobile-navigation.spec.ts");
    const checks = (spec.match(/\btest\(/g) ?? []).length;
    expect(checks).toBe(11); // the spec census (s196: +1 the spine registration)
    expect(skill).toContain(`drawer + ${checks}-check e2e suite.`);
    expect(skill).not.toContain("drawer + 7-check e2e suite.");
  });

  // F-168h: the §19 color mirror — the hex read live from globals.css.
  it("§19's primary-foreground row mirrors the LIVE globals.css token (F-168h)", () => {
    const css = read("src/app/globals.css");
    const m = css.match(/--color-primary-foreground:\s*(#[0-9a-fA-F]{6});/);
    expect(m).not.toBeNull();
    const hex = (m as RegExpMatchArray)[1].toLowerCase();
    expect(hex).toBe("#fafafa"); // the s119 re-pin
    const rgb = hex
      .slice(1)
      .match(/.{2}/g)!
      .map((b) => parseInt(b, 16))
      .join(" ");
    expect(skill).toContain(
      `| \`primary-foreground\` | \`${hex}\` | ${rgb} |`,
    );
    expect(skill).not.toContain(
      "| `primary-foreground` | `#ffffff` | 255 255 255 |",
    );
  });
});

// ---------------------------------------------------------------------------
// WP-1c — the AGENTS doctrine pins (F-168a/b): AGENTS.md joins the docs
// pin family for the first time — the L-167c1 root-cure applied to the
// file the last three rotations kept forgetting to flip.
// ---------------------------------------------------------------------------
describe("session-168 (WP-1c): the AGENTS.md validation doctrine pins (F-168a/b)", () => {
  const agents = read("AGENTS.md");

  it("the architecture-facts layer carries the completed-adoption clause (F-168a)", () => {
    expect(agents).toContain(
      "the CRUD family joined at session-166: every body route rides the seam",
    );
  });

  it("the retired incremental-path clause is absent (F-168a's negative)", () => {
    expect(agents).not.toContain("keeps the `asString` guards, the documented incremental");
  });

  it("the retired no-schema-library clause is absent (F-168b's negative)", () => {
    expect(agents).not.toContain("No schema library — zod was deliberately pruned");
  });

  it("the conventions bullet names the Zod seam (F-168b's positive)", () => {
    expect(agents).toContain("Validation rides the Zod seam at every body boundary");
    expect(agents).toContain("the auth family since session-163, the CRUD family since session-166");
  });
});

// ---------------------------------------------------------------------------
// WP-1d — the README sitemap pins (F-168i): the route count read live
// from the sitemap source, the prose asserted to carry it.
// ---------------------------------------------------------------------------
describe("session-168 (WP-1d): the README sitemap-route pins (F-168i)", () => {
  const NUM_TO_WORD: Record<number, string> = {
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
  };
  const src = read("src/app/sitemap.xml/route.ts");
  const routes = (src.match(/\{ path: "/g) ?? []).length;
  const word = NUM_TO_WORD[routes];

  it(`the live sitemap ROUTES census (reads the source: ${routes} routes)`, () => {
    expect(routes).toBe(11); // the s142 surface: 9 + /about + /contact
    expect(word).toBeDefined();
  });

  it(`README's sitemap claims carry the LIVE route count ("${word}-route")`, () => {
    const readme = read("README.md");
    expect(readme).toContain(`an ${word}-route \`/sitemap.xml\``);
    expect(readme).toContain(`the ${word}-route`);
    expect(readme).not.toContain("nine-route");
  });
});

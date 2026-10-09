import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-86 parity suite (the 86-c accounts filter-rail family
// rotation): every pin mirrors a BUNDLE-DECODED reference fact (the
// fresh-fetched index-DZ-xbrIm.js, md5 a70a637… — the 57th consecutive
// stable bundle) or a LIVE-computed DOM fact censused on BOTH apps this
// session.
//
// The reference facts pinned here (all decoded from the Oce rail +
// the accounts page memo/filter/row/KPI family + the bce/wce dialogs):
// - BOTH dialogs ship the Status trio Active/Inactive/PROSPECT
//   (value "prospect"); our edit config had it right, our
//   ACCOUNT_STATUSES/API carried churned — the edit dialog's own
//   Prospect option ALWAYS 400'd ("Invalid status") pre-fix.
// - The account TIER is DERIVED from revenue everywhere: `te = U
//   .annual_revenue > 1e6 ? "Key" : > 5e5 ? "A" : > 1e5 ? "B" : "C"`
//   (the N memo) — consumed at the row (tint/star/badge), the Key
//   Accounts KPI (N.filter(te => te.tier === "Key")), the tier
//   checkbox filter (d.tiers.includes(U.tier), "Key Account" →
//   computed "Key"), and the CSV export (E.map's fe.tier). The
//   reference models NO stored tier field (its dialogs offer none).
// - The accounts search filters NAME ONLY: `U.name?.toLowerCase()
//   .includes(e.toLowerCase())`.
// - The export maps the FILTERED rows (ee = E.map(...)) under the
//   zero-RAW guard (if (m.length === 0) return); the header Export
//   CSV binds disabled: m.length === 0 (RAW — the N-62e ambiguity
//   resolved by this decode).
// - The rail selects carry the DEAD placeholders "John Kuy" /
//   "Technology" / "$1M to $5M" (dead in both apps — the "all"
//   defaults always match; the N-83c5 mirror precedent) and the
//   search input carries the explicit `pl-9 h-9`.
// - The reference's Owner + Revenue Range selects NEVER filter (its
//   memo reads name/industry/tiers only) and its Save All has NO
//   onClick — our live-filtering/reset/static-item supersets keep,
//   now documented per the S33-P1/S47-P1 convention.
//
// Green-by-design anchors: the rail anatomy (FILTER_RAIL labels,
// Save All ghost sm, the blue Filter button, the tier checkbox
// labels), the REVENUE_RANGES labels, the tier/health badge maps,
// the edit dialog's trio — the s10/s13/s17/s28-pinned surfaces
// re-held at the page-wiring level.

function read(rel: string): string {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : "";
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx"));
const dashboard = () => stripComments(read("src/app/(app)/page.tsx"));
const dialogs = () => stripComments(read("src/components/shared/entity-dialogs.tsx"));
const editDialog = () => stripComments(read("src/components/shared/entity-edit-dialog.tsx"));
const constants = () => stripComments(read("src/lib/constants.ts"));
const postRoute = () => stripComments(read("src/app/api/accounts/route.ts"));
const idRoute = () => stripComments(read("src/app/api/accounts/[id]/route.ts"));
const schema = () => read("prisma/schema.prisma");
const types = () => stripComments(read("src/types/index.ts"));
const seed = () => stripComments(read("prisma/seed.ts"));
const railRegion = () => {
  const src = page();
  const start = src.indexOf("RAIL_LAYOUT.rail");
  return start >= 0 ? src.slice(start - 80, start + 3900) : "";
};

describe("session-86: the account status vocabulary (M-86c1)", () => {
  it("ACCOUNT_STATUSES is the reference's trio (active/inactive/prospect)", () => {
    const src = constants();
    const i = src.indexOf("export const ACCOUNT_STATUSES");
    expect(i).toBeGreaterThan(-1);
    expect(src.slice(i, i + 120)).toMatch(/\["active",\s*"inactive",\s*"prospect"\]/);
  });

  it("ACCOUNT_STATUS_META carries prospect and NOT churned", () => {
    const src = constants();
    const i = src.indexOf("export const ACCOUNT_STATUS_META");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 600);
    expect(block).toMatch(/prospect:\s*\{\s*label:\s*"Prospect"/);
    expect(block).not.toMatch(/churned/);
  });

  it("the edit dialog's Status config is the same trio (the s28 wce decode — now SAVABLE)", () => {
    const src = editDialog();
    const i = src.indexOf("ACCOUNT_EDIT_FIELDS");
    const block = src.slice(i, i + 1200);
    expect(block).toMatch(/value: "prospect", label: "Prospect"/);
  });

  it("the create dialog maps the trio through ACCOUNT_STATUSES + META labels", () => {
    const src = dialogs();
    expect(src).toMatch(/\{ACCOUNT_STATUSES\.map\(\(s\) =>/);
    expect(src).toMatch(/\{ACCOUNT_STATUS_META\[s\]\.label\}/);
  });

  it("the seed plants no off-vocabulary status (the churned value retired)", () => {
    expect(seed()).not.toMatch(/churned/);
  });

  it("the schema comment carries the trio", () => {
    const src = schema();
    const i = src.indexOf("model Account");
    const block = src.slice(i, i + 900);
    expect(block).toMatch(/status\s+String\s+@default\("active"\)\s*\/\/ active \| inactive \| prospect/);
  });
});

describe("session-86: the computed-tier derivation (M-86c2)", () => {
  it("accountTierFromRevenue mirrors the reference's te formula (the boundary matrix)", async () => {
    // Dynamic import: the seam does not exist pre-fix (the RED state —
    // the s83 require->await ESM pattern).
    const { accountTierFromRevenue } = await import("../src/lib/account-tier");
    // The bundle: `U.annual_revenue > 1e6 ? "Key" : U.annual_revenue >
    // 5e5 ? "A" : U.annual_revenue > 1e5 ? "B" : "C"` — null/undefined
    // arithmetic-coerces through every comparison to false → "C".
    expect(accountTierFromRevenue(null)).toBe("C");
    expect(accountTierFromRevenue(undefined)).toBe("C");
    expect(accountTierFromRevenue(0)).toBe("C");
    expect(accountTierFromRevenue(100_000)).toBe("C");
    expect(accountTierFromRevenue(100_001)).toBe("B");
    expect(accountTierFromRevenue(500_000)).toBe("B");
    expect(accountTierFromRevenue(500_001)).toBe("A");
    expect(accountTierFromRevenue(1_000_000)).toBe("A");
    expect(accountTierFromRevenue(1_000_001)).toBe("Key");
    expect(accountTierFromRevenue(22_000_000)).toBe("Key");
  });

  it("the row derives tier from revenue (the tint/star/badge arm)", () => {
    const src = page();
    expect(src).toMatch(/const tier = accountTierFromRevenue\(a\.annualRevenue\)/);
    expect(src).not.toMatch(/a\.isKey \? "Key" : a\.tier/);
  });

  it("the row tint + star key on the computed tier", () => {
    const src = page();
    const body = src.indexOf("<TableBody>");
    const i = src.indexOf('key={a.id}', body);
    const block = src.slice(i, i + 1600);
    expect(block).toMatch(/tier === "Key" && "bg-yellow-50\/30"/);
    expect(block).toMatch(/tier === "Key" && \(/);
  });

  it("the Key Accounts KPI counts the computed tier", () => {
    const src = page();
    const i = src.indexOf('label="Key Accounts"');
    const block = src.slice(i, i + 260);
    expect(block).toMatch(/accountTierFromRevenue\(a\.annualRevenue\) === "Key"/);
  });

  it("the tier checkbox filter matches the computed tier", () => {
    const src = page();
    const i = src.indexOf("const tiers = ");
    const block = src.slice(i, i + 1100);
    expect(block).toMatch(/accountTierFromRevenue\(a\.annualRevenue\)/);
    expect(src).not.toMatch(/a\.isKey\)/);
    expect(src).not.toMatch(/tiers\.includes\(a\.tier\)/);
  });

  it("the accounts CSV export carries the computed Tier column", () => {
    const src = page();
    const i = src.indexOf("function exportAccounts");
    const block = src.slice(i, i + 900);
    expect(block).toMatch(/accountTierFromRevenue\(a\.annualRevenue\)/);
  });

  it("the Cards badge derives from revenue", () => {
    const src = page();
    const i = src.indexOf("ACCOUNT_TIER_BADGE[accountTierFromRevenue");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 240);
    expect(block).toMatch(/accountTierFromRevenue\(a\.annualRevenue\)/);
    expect(block).not.toMatch(/a\.isKey/);
  });

  it("the dashboard's accounts CSV export carries the computed Tier column", () => {
    const src = dashboard();
    const i = src.indexOf("function exportAccountsCsv");
    const block = src.slice(i, i + 1100);
    expect(block).toMatch(/accountTierFromRevenue\(a\.annualRevenue\)/);
  });

  it("the stored tier/isKey RETIRE: schema, wire type, API blocks, create payload, seed", () => {
    // The reference models NO tier field (computed only); our stored
    // columns were the invented mechanism — retired per the s54
    // dead-vocabulary policy (a stored-but-never-displayed field is
    // the s42 silent-lie API class).
    const model = schema().slice(schema().indexOf("model Account"), schema().indexOf("model Contact"));
    expect(model).not.toMatch(/\btier\s+String/);
    expect(model).not.toMatch(/\bisKey\s+Boolean/);
    expect(model).not.toMatch(/@@index\(\[tier\]\)/);

    const accType = types().slice(types().indexOf("export interface Account"), types().indexOf("export interface Contact"));
    expect(accType).not.toMatch(/\btier:\s*string/);
    expect(accType).not.toMatch(/isKey:\s*boolean/);

    for (const src of [postRoute(), idRoute()]) {
      expect(src).not.toMatch(/Invalid tier/);
      expect(src).not.toMatch(/Invalid key account/);
      expect(src).not.toMatch(/data\.isKey/);
      expect(src).not.toMatch(/data\.tier/);
    }

    expect(dialogs()).not.toMatch(/isKey: form\.isKey/);
    expect(dialogs()).not.toMatch(/tier: form\.tier/);

    const seedBlock = seed().slice(seed().indexOf("accountSeed"), seed().indexOf("const accounts:"));
    expect(seedBlock).not.toMatch(/\btier:\s*"A"/);
    expect(seedBlock).not.toMatch(/isKey:\s*(true|false)/);
  });
});

describe("session-86: the search mirror (L-86c3 + N-86c6)", () => {
  it("the filter matches NAME ONLY (the reference's own predicate)", () => {
    const src = page();
    expect(src).toMatch(/a\.name\.toLowerCase\(\)\.includes\(q\)/);
    expect(src).not.toMatch(/a\.name\} \$\{a\.industry/);
    expect(src).not.toMatch(/\$\{a\.email \?\? ""\}/);
  });

  it("the search input carries the reference's explicit pl-9 h-9", () => {
    const src = page();
    expect(src).toMatch(/className="pl-9 h-9"/);
  });

  it("the search icon keeps the pointer-events-none click-through (the documented superset)", () => {
    const src = page();
    expect(src).toMatch(/pointer-events-none absolute left-3 top-1\/2 h-4 w-4 -translate-y-1\/2 text-subtle/);
  });
});

describe("session-86: the export row basis + the header binding (L-86c4)", () => {
  it("the export maps the FILTERED rows (the reference's E.map)", () => {
    const src = page();
    const i = src.indexOf("function exportAccounts");
    const block = src.slice(i, i + 900);
    expect(block).toMatch(/const rows = filtered\.map\(\(a\) => \[/);
    expect(block).not.toMatch(/const rows = accounts\.map/);
  });

  it("the zero-RAW guard stays on the unfiltered list (the m.length === 0 arm)", () => {
    const src = page();
    const i = src.indexOf("function exportAccounts");
    const block = src.slice(i, i + 300);
    expect(block).toMatch(/if \(accounts\.length === 0\) return/);
  });

  it("the header Export CSV binds the RAW zero (the N-62e ambiguity resolved)", () => {
    const src = page();
    const i = src.indexOf("onClick={exportAccounts}");
    expect(i).toBeGreaterThan(-1);
    const headerRegion = src.slice(Math.max(0, i - 500), i);
    expect(headerRegion).toMatch(/disabled=\{accounts\.length === 0\}/);
    expect(page()).not.toMatch(/disabled=\{filtered\.length === 0\}/);
  });
});

describe("session-86: the rail placeholders + the superset documentation (N-86c5 + N-86c7)", () => {
  it("the three dead SelectValue placeholders mirror the reference", () => {
    const src = railRegion();
    expect(src).toMatch(/placeholder="John Kuy"/);
    expect(src).toMatch(/placeholder="Technology"/);
    expect(src).toMatch(/placeholder="\$1M to \$5M"/);
  });

  it("the rail superset comments document the dead reference controls (raw source)", () => {
    const raw = read("src/app/(app)/accounts/accounts-page.tsx");
    // The Owner/Revenue live-filtering superset (the reference's memo
    // reads name/industry/tiers only) + the Save All reset (the
    // reference's has no onClick).
    expect(raw).toMatch(/\+ Revenue Range selects are DEAD/);
    expect(raw).toMatch(/Save All has NO onClick/);
  });

  it("the green anchors: the rail anatomy rides the FILTER_RAIL records", () => {
    const src = railRegion();
    expect(src).toMatch(/FILTER_RAIL\.headerPad/);
    expect(src).toMatch(/FILTER_RAIL\.headerRow/);
    expect(src).toMatch(/FILTER_RAIL\.groupLabelSelect\}>Owner/);
    expect(src).toMatch(/FILTER_RAIL\.groupLabel\}>Tier/);
    expect(src).toMatch(/FILTER_RAIL\.checkboxStack/);
    expect(src).toMatch(/FILTER_RAIL\.filterButtonWrap/);
    expect(src).toMatch(/w-full bg-blue-600 hover:bg-blue-700/);
  });

  it("the green anchors: the Save All ghost sm + the tier checkbox labels + the revenue ranges", () => {
    const src = page();
    expect(src).toMatch(/Save All/);
    expect(src).toContain('label="Key Account"');
    expect(src).toContain('label="A"');
    expect(src).toContain('label="B"');
    expect(src).toContain('label="C"');
    const i = src.indexOf("REVENUE_RANGES");
    expect(src.slice(i, i + 300)).toMatch(/All Revenue/);
    expect(src.slice(i, i + 300)).toMatch(/\$0 - \$1M/);
    expect(src.slice(i, i + 300)).toMatch(/\$1M - \$5M/);
    expect(src.slice(i, i + 300)).toMatch(/\$5M\+/);
  });
});

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-26 pins (S26-P4 + S26-P5): the export family. The reference's
// settings "Export Data" `m(entity)` (bundle-extracted):
//
//   const rows = await rt.entities[entity].list();
//   const csv = [Object.keys(rows[0] || {}).join(","),
//                ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(","))]
//              .join("\n");
//   → Blob → anchor download `${entity.toLowerCase()}_ISO-date.csv`
//
// (every value double-quoted; the header is the FIRST ROW's own keys, so
// at zero rows the artifact is an EMPTY file — live-verified: the anchor
// fired four times with contact_/account_/lead_/activity_2026-10-01.csv
// and empty blob bodies).
//
// The PAGE-level exports (bundle-extracted, the 22-session "data-gated"
// surface unlocked):
//   contacts: guard `if (length === 0) return;` + columns
//     Name,Email,Phone,Company,Position,Status,Source + quoted cells +
//     contacts_ISO.csv + the button DISABLED at zero data
//   accounts: the same guard + columns
//     Name,Industry,Phone,Email,Website,Annual Revenue,Employees,Status,
//     Tier,Health + accounts_ISO.csv; the header button disabled at zero
//     data, the toolbar one enabled-but-guarded.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-26: the raw-dump seam (S26-P4)", () => {
  it("src/lib/entity-export.ts exists", () => {
    expect(read("src/lib/entity-export.ts")).not.toBeNull();
  });

  it("entityDumpCsv builds the header from the FIRST row's own keys", () => {
    const code = read("src/lib/entity-export.ts")!;
    expect(code).toMatch(/Object\.keys\(/);
    expect(code).toMatch(/rows\[0\]/);
  });

  it("every value is double-quoted (the reference's `\"${v}\"` mapping — via the s41 qq() quoter, embedded quotes doubled)", () => {
    const code = read("src/lib/entity-export.ts")!;
    expect(code).toMatch(/Object\.values\(/);
    // session-41 (S41-P2): the plain `"${v}"` wrap became the qq() cell-quoter
    // (RFC-4180 — a cell containing a quote doubles it). The mapping is still
    // "every value quoted"; the quote-bearing half is pinned by the s41 block.
    expect(code).toMatch(/const qq = \(v: unknown\): string =>/);
    expect(code).toContain(`replace(/"/g, '""')`);
  });

  it("the rows join with \\n and the header joins with ,", () => {
    const code = read("src/lib/entity-export.ts")!;
    expect(code).toMatch(/join\(","\)/);
    expect(code).toMatch(/join\("\\n"\)/);
  });

  it("entityExportFilename emits the SINGULAR prefixes + ISO date", () => {
    const code = read("src/lib/entity-export.ts")!;
    expect(code).toMatch(/contact_/);
    expect(code).toMatch(/account_/);
    expect(code).toMatch(/lead_/);
    expect(code).toMatch(/activity_/);
    expect(code).toMatch(/toLowerCase\(\)/);
  });

  it("zero rows → an EMPTY string (no headers when the first row is absent)", () => {
    const code = read("src/lib/entity-export.ts")!;
    expect(code).toMatch(/rows\.length === 0|!rows\.length/);
  });
});

describe("session-26: the settings page's export wiring (S26-P4)", () => {
  it("the four export buttons call the seam through downloadBlob", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    const expBlock = code.slice(
      code.indexOf("Export Contacts"),
      code.indexOf("Export Activities") + 120,
    );
    expect(expBlock).toMatch(/entityDumpCsv|entityExportFilename|ENTITY_EXPORT/);
    expect(expBlock).toMatch(/downloadBlob\(/);
  });

  it("the export buttons carry ZERO /api/export references", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    const expBlock = code.slice(
      code.indexOf("Export Contacts"),
      code.indexOf("Export Activities") + 120,
    );
    expect(expBlock).not.toMatch(/\/api\/export/);
  });
});

describe("session-26: the contacts page export (S26-P5)", () => {
  it("the export is CLIENT-SIDE with the reference's 7 columns", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    const i = code.indexOf("function exportContacts");
    expect(i).toBeGreaterThan(-1);
    const region = code.slice(i, i + 700);
    expect(region).not.toMatch(/\/api\/export/);
    expect(region).toMatch(/toQuotedCsv\(/);
    expect(region).toMatch(/downloadBlob\(/);
    // The reference's 7-column set, in its order.
    for (const col of ["Name", "Email", "Phone", "Company", "Position", "Status", "Source"]) {
      expect(region).toContain(`"${col}"`);
    }
  });

  it("the row mapping uses the store's contact fields in the reference's order", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    const i = code.indexOf("function exportContacts");
    const region = code.slice(i, i + 700);
    // name, email, phone, company, position, status, source — the
    // reference's map order (bundle-extracted).
    expect(region).toMatch(/c\.name \|\|/);
    expect(region).toMatch(/c\.email \|\|/);
    expect(region).toMatch(/c\.phone \|\|/);
    expect(region).toMatch(/c\.company \|\|/);
    expect(region).toMatch(/c\.position \|\|/);
    expect(region).toMatch(/c\.status \|\|/);
    expect(region).toMatch(/c\.source \|\|/);
  });

  it("the zero-data guard retires the download at empty (the disabled binding stays)", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    const i = code.indexOf("function exportContacts");
    const region = code.slice(i, i + 300);
    expect(region).toMatch(/contacts\.length === 0\) return/);
    const btn = code.indexOf("Export CSV");
    const btnRegion = code.slice(Math.max(0, btn - 300), btn + 100);
    expect(btnRegion).toMatch(/disabled=\{/);
  });
});

describe("session-26: the accounts page export (S26-P5)", () => {
  it("the export is CLIENT-SIDE with the reference's 10 columns incl. Health", () => {
    const code = stripComments(read("src/app/(app)/accounts/accounts-page.tsx")!);
    const i = code.indexOf("function exportAccounts");
    expect(i).toBeGreaterThan(-1);
    const region = code.slice(i, i + 800);
    expect(region).toMatch(/toQuotedCsv\(/);
    expect(region).toMatch(/downloadBlob\(/);
    expect(code).not.toMatch(/\/api\/export/);
    // The reference's 10-column set, in its order — incl. Health.
    for (const col of ["Name", "Industry", "Phone", "Email", "Website", "Annual Revenue", "Employees", "Status", "Tier", "Health"]) {
      expect(region).toContain(`"${col}"`);
    }
    expect(code).not.toContain('"Account Name"');
  });

  it("the header button keeps the disabled binding; the toolbar one stays enabled-but-guarded", () => {
    const code = stripComments(read("src/app/(app)/accounts/accounts-page.tsx")!);
    // The reference: the header Export CSV disabled at zero RAW data
    // (`disabled: m.length === 0` — m is the unfiltered list), the
    // toolbar Export CSV enabled with the runtime guard.
    // Session-86 (L-86c4): the N-62e ambiguity RESOLVED by the s86
    // bundle decode — the binding re-anchors from filtered.length to
    // the RAW accounts.length (and the export itself now maps the
    // FILTERED rows, per the reference's `ee = E.map(...)`).
    const header = code.indexOf("Export CSV");
    const headerRegion = code.slice(Math.max(0, header - 400), header + 200);
    expect(headerRegion).toMatch(/disabled=\{accounts\.length === 0\}/);
    const toolbarI = code.indexOf("Export CSV", code.indexOf("Export CSV") + 10);
    const toolbar = code.slice(toolbarI, toolbarI + 500);
    expect(toolbar).not.toMatch(/disabled=/);
  });

  it("the row mapping carries a.health into the Health column", () => {
    const code = stripComments(read("src/app/(app)/accounts/accounts-page.tsx")!);
    expect(code).toMatch(/a\.health \|\|/);
  });

  it("the zero-data guard exists for the runtime no-op", () => {
    const code = stripComments(read("src/app/(app)/accounts/accounts-page.tsx")!);
    const i = code.indexOf("function exportAccounts");
    const region = code.slice(i, i + 300);
    expect(region).toMatch(/accounts\.length === 0\) return/);
  });
});

describe("session-26: the dead export branches retire (S26-P4/P5 cleanup; re-scoped S29-P5)", () => {
  it("/api/export keeps ONLY the report branch (the leads branch went client-side in S29)", () => {
    const code = stripComments(read("src/app/api/export/route.ts")!);
    expect(code).not.toMatch(/type === "contacts"/);
    expect(code).not.toMatch(/type === "accounts"/);
    expect(code).not.toMatch(/type === "activities"/);
    expect(code).not.toMatch(/type === "leads"/);
    expect(code).toMatch(/type !== "report"/);
  });
});

describe("session-29: the leads page export seam (S29-P5, the U bundle extract)", () => {
  it("unquotedHeaderCsv: plain header, every VALUE quoted, \\n-joined", async () => {
    const { unquotedHeaderCsv } = await import("@/lib/entity-export");
    expect(
      unquotedHeaderCsv(["Name", "Email", "Status"], [
        ["Khalid", "k@example.com", "new"],
        ["Priya", "", "won"],
      ]),
    ).toBe('Name,Email,Status\n"Khalid","k@example.com","new"\n"Priya","","won"');
  });

  it("an empty row set yields the header-only artifact (never an empty file)", async () => {
    const { unquotedHeaderCsv } = await import("@/lib/entity-export");
    expect(unquotedHeaderCsv(["Name", "Email"], [])).toBe("Name,Email");
  });
});

// ---------------------------------------------------------------------------
// Session-41 (S41-P2): the embedded-quote escaping. The three builders
// wrapped every value in plain `"${v}"` with NO quote doubling — a value
// like `Acme "Best" Inc` exported as `"Acme "Best" Inc"` (malformed CSV:
// a column shift on re-parse, corrupting our own export→import
// round-trip). The qq() cell-quoter doubles embedded quotes per
// RFC-4180 — byte-identical for every quote-free cell (the pinned
// reference-format contract untouched: the e2e pins filenames + headers
// only, and all existing fixtures are quote-free).
// ---------------------------------------------------------------------------

describe("session-41: the embedded-quote escaping (S41-P2 — RFC-4180 in the export family)", () => {
  it("toQuotedCsv doubles embedded quotes (Acme \"Best\" Inc → \"Acme \"\"Best\"\" Inc\")", async () => {
    const { toQuotedCsv } = await import("@/lib/entity-export");
    expect(
      toQuotedCsv(["Company", "Notes"], [["Acme \"Best\" Inc", "said \"hi\""]]),
    ).toBe('"Company","Notes"\n"Acme ""Best"" Inc","said ""hi"""');
  });

  it("entityDumpCsv doubles embedded quotes in every value cell", async () => {
    const { entityDumpCsv } = await import("@/lib/entity-export");
    const out = entityDumpCsv([{ name: 'Acme "Best" Inc', city: "Dubai" }]);
    expect(out).toBe('name,city\n"Acme ""Best"" Inc","Dubai"');
  });

  it("unquotedHeaderCsv doubles embedded quotes in the VALUE cells (the header stays unquoted)", async () => {
    const { unquotedHeaderCsv } = await import("@/lib/entity-export");
    expect(
      unquotedHeaderCsv(["Name", "Company"], [['Khalid', 'Acme "Best" Inc']]),
    ).toBe('Name,Company\n"Khalid","Acme ""Best"" Inc"');
  });

  it("quote-free data is byte-identical to the pinned reference format (the contract)", async () => {
    const { toQuotedCsv, unquotedHeaderCsv, entityDumpCsv } = await import("@/lib/entity-export");
    expect(
      toQuotedCsv(["Name", "Email"], [["Khalid", "k@example.com"]]),
    ).toBe('"Name","Email"\n"Khalid","k@example.com"');
    expect(
      unquotedHeaderCsv(["Name", "Email", "Status"], [
        ["Khalid", "k@example.com", "new"],
        ["Priya", "", "won"],
      ]),
    ).toBe('Name,Email,Status\n"Khalid","k@example.com","new"\n"Priya","","won"');
    expect(entityDumpCsv([{ name: "Khalid", city: "Dubai" }])).toBe(
      'name,city\n"Khalid","Dubai"',
    );
  });

  it("the export→import round-trip is whole again (toQuotedCsv → parseCsv → the original values)", async () => {
    const { toQuotedCsv } = await import("@/lib/entity-export");
    const { parseCsv } = await import("@/lib/csv");
    const header = ["Name", "Company", "Notes"];
    const rows = [['Khalid', 'Acme "Best" Inc', 'said "hi", twice']];
    const parsed = parseCsv(toQuotedCsv(header, rows));
    expect(parsed).toEqual([["Name", "Company", "Notes"], ...rows]);
  });
});

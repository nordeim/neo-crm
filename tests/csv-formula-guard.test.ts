import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { toCsv, parseCsv } from "@/lib/csv";
import { toQuotedCsv, unquotedHeaderCsv, entityDumpCsv } from "@/lib/entity-export";
import { CSV_TEMPLATES } from "@/lib/csv-templates";

// Session-48 pins (S48-P1): the CSV formula-injection guard — the
// operator's posture-(b) decision, landed after six sessions deferred
// (a)/(b)/(c). Every builder surface passed cells beginning with
// = + - @ tab CR through UNSANITIZED (escapeCell quoted only on
// [",\n\r]; qq only quote-wrapped) — the OWASP CSV-injection vector,
// live on eight surfaces carrying user free-text (names, subjects,
// notes, report Deal Names; every seeded phone starts with +).
//
// POSTURE (b): guard EXACTLY the = + @ tab CR prefixes (prefix a single
// quote inside the quoting — Excel's own text marker); `-` is
// DELIBERATELY EXCLUDED (negative numbers and dash-prefixed free text
// stay exact — the (c) cost rejected; modern Excel blocks DDE by
// default, narrowing the residual - vector); safe cells stay
// BYTE-IDENTICAL (the s41-P2 quote-doubling precedent: the pinned
// reference format untouched for every safe fixture). The three STATIC
// import templates stay OUTSIDE the guard (our own example content — no
// attacker-controlled data flows through them) and the import parser
// stays untouched (parity: it accepts arbitrary strings by design).
//
// The round-trip trade-off is DOCUMENTED here: a '-prefixed export cell
// re-imports as data with the literal apostrophe (parseCsv strips no
// markers). In Excel — the dominant consumer — the phone renders MORE
// faithfully than before (a compact +1234567890 currently loses its +
// to formula evaluation; the ' text marker keeps it).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

describe("session-48: the CSV formula-injection guard (S48-P1, posture b)", () => {
  it("toCsv guards =-prefixed cells (the HYPERLINK payload) with the ' text marker", () => {
    const csv = toCsv(
      [{ v: '=HYPERLINK("http://evil.example","x")' }],
      [{ header: "Name", value: (r: { v: string }) => r.v }],
    );
    // Guarded inside the quoting: the ' lands before the =, the payload's
    // quotes still doubled (the s41-P2 RFC-4180 behavior preserved).
    expect(csv).toBe('Name\r\n"\'=HYPERLINK(""http://evil.example"",""x"")"');
  });

  it("toCsv guards + (the phone), @, tab and CR prefixes", () => {
    const csv = toCsv(
      [
        { v: "+971 4 200 4000" },
        { v: "@SUM(A1:A9)" },
        { v: "\tsmuggled" },
        { v: "\rsmuggled" },
      ],
      [{ header: "Phone", value: (r: { v: string }) => r.v }],
    );
    const lines = csv.split("\r\n");
    // The + phone gains the text marker (the documented phone cost: Excel
    // renders +971… faithfully as text; raw-text consumers see the ').
    expect(lines[1]).toBe("'+971 4 200 4000");
    expect(lines[2]).toBe("'@SUM(A1:A9)");
    // Tab-prefixed: guarded, unquoted (tab is not a CSV metacharacter).
    expect(lines[3]).toBe("'\tsmuggled");
    // CR-prefixed: guarded AND quoted (the \r keeps the RFC-4180 wrap —
    // the bare \r inside the quoted cell does not split on \r\n).
    expect(lines[4]).toBe('"\'\rsmuggled"');
  });

  it("toCsv does NOT guard the - prefix (the posture-(b) exclusion, pinned)", () => {
    const csv = toCsv(
      [{ v: "-500" }, { v: "-urgent follow-up note" }],
      [{ header: "Amount", value: (r: { v: string }) => r.v }],
    );
    // Negative numbers and dash-prefixed text stay EXACT — the deliberate
    // (b)-vs-(c) line: full-OWASP would mangle these.
    expect(csv.split("\r\n")[1]).toBe("-500");
    expect(csv.split("\r\n")[2]).toBe("-urgent follow-up note");
  });

  it("safe cells stay byte-identical (the no-op contract)", () => {
    const csv = toCsv(
      [{ v: "Ada Lovelace" }, { v: 123 }, { v: 'Acme "Best" Inc' }, { v: null }],
      [{ header: "Name", value: (r: { v: string | number | null }) => r.v }],
    );
    const lines = csv.split("\r\n");
    expect(lines[0]).toBe("Name");
    expect(lines[1]).toBe("Ada Lovelace");
    expect(lines[2]).toBe("123");
    // The s41 quote-doubling untouched.
    expect(lines[3]).toBe('"Acme ""Best"" Inc"');
    expect(lines[4]).toBe("");
  });

  it("toQuotedCsv guards dangerous cells in the quoted family", () => {
    const csv = toQuotedCsv(["Name"], [["=1+1"], ["+9715550000"], ["Ada"]]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe('"Name"');
    expect(lines[1]).toBe("\"'=1+1\"");
    expect(lines[2]).toBe("\"'+9715550000\"");
    expect(lines[3]).toBe('"Ada"');
  });

  it("unquotedHeaderCsv guards values while the header stays unquoted", () => {
    const csv = unquotedHeaderCsv(["Name", "Email"], [["=cmd", "a@b.example"], ["Ada", "ada@b.example"]]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Name,Email");
    expect(lines[1]).toBe("\"'=cmd\",\"a@b.example\"");
    expect(lines[2]).toBe('"Ada","ada@b.example"');
  });

  it("entityDumpCsv guards the raw-dump values", () => {
    const csv = entityDumpCsv([{ type: "=2+2", subject: "ok" }]);
    const lines = csv.split("\n");
    // The header is the first row's own keys (schema field names — safe,
    // unquoted, unguarded by design).
    expect(lines[0]).toBe("type,subject");
    expect(lines[1]).toBe("\"'=2+2\",\"ok\"");
  });

  it("parseCsv does NOT strip the guard marker (the documented round-trip trade-off)", () => {
    // A '-guarded export cell re-imports as data with the literal
    // apostrophe — the accepted (b) cost, pinned so a future session
    // cannot "fix" it silently and break the guard's semantics.
    const rows = parseCsv("Name\n'+971 4 200 4000\nAda");
    expect(rows[1]![0]).toBe("'+971 4 200 4000");
    expect(rows[2]![0]).toBe("Ada");
  });

  it("the three static import templates stay OUTSIDE the guard (our own content)", () => {
    // The templates ship the reference's example rows byte-exact —
    // +1234567890 verbatim. No attacker-controlled data flows through
    // them, so sanitizing buys zero security and costs the import UX.
    for (const key of ["contacts", "accounts", "leads"] as const) {
      expect(CSV_TEMPLATES[key].content).toContain("+1234567890");
      expect(CSV_TEMPLATES[key].content).not.toContain("'+1234567890");
    }
  });

  it("the guard lives in BOTH seams (the csv.ts helper, imported by entity-export.ts)", () => {
    const csvSrc = read("src/lib/csv.ts") ?? "";
    const exportSrc = read("src/lib/entity-export.ts") ?? "";
    // The shared helper is defined at the codec seam…
    expect(csvSrc).toMatch(/export function guardFormulaPrefix/);
    // …and the client-side family imports it (the operator decision's
    // scope: BOTH csv.ts and entity-export.ts).
    expect(exportSrc).toMatch(/import \{ guardFormulaPrefix \} from "@\/lib\/csv"/);
    expect(exportSrc).toMatch(/guardFormulaPrefix\(/);
  });
});

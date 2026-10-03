/**
 * The raw-dump entity CSV family (session-26, S26-P4).
 *
 * The reference's Settings "Export Data" `m(entity)` (bundle-extracted):
 *
 *   const rows = await rt.entities[entity].list();
 *   const csv = [Object.keys(rows[0] || {}).join(","),
 *                ...rows.map(r => Object.values(r).map(v => `${v}`).join(","))]
 *              .join("\n");
 *   → new Blob([csv], {type: "text/csv"}) → anchor
 *     `download=\`${entity.toLowerCase()}_${ISO-date}.csv\``
 *
 * (live-verified on 2026-10-02: the anchor fired with
 * contact_/account_/lead_/activity_2026-10-01.csv and — at zero data —
 * EMPTY blob bodies, because the header row is the FIRST ROW's own keys:
 * no rows → no header → an empty artifact).
 *
 * The page-level quoted-CSV helper (S26-P5) is the same quoting family the
 * reference's contacts/accounts page exports use
 * (`["${header}", ...] + rows.map(r => r.map(v => \`"${v}"\`).join(","))`).
 */

import { isoDateSuffix } from "@/lib/pdf-export";
import { guardFormulaPrefix } from "@/lib/csv";

/**
 * The RFC-4180 cell-quoter (session-41, S41-P2). Every builder in this
 * family wraps values in quotes — and a cell CONTAINING a quote must
 * DOUBLE it or the artifact is malformed (`Acme "Best" Inc` exported
 * as `"Acme "Best" Inc"` — a column shift on re-parse, corrupting our
 * own export→import round-trip). The reference's own builders shipped
 * the unescaped `"${v}"` wrap (its defect); our fix is byte-identical
 * for every quote-free cell, so the pinned reference format — the
 * filenames, the headers, the quote-free fixtures — is untouched.
 *
 * Session-48 (S48-P1): the formula-injection guard rides the same seam
 * (the operator's posture-(b) decision — csv.ts's guardFormulaPrefix,
 * shared by BOTH export families): a cell starting with `=`/`+`/`@`/
 * tab/CR gains the `'` text marker INSIDE the quoting, so spreadsheet
 * consumers render it as text instead of evaluating it. Safe cells stay
 * byte-identical; `-` stays unguarded (the documented exclusion).
 */
const qq = (v: unknown): string => `"${guardFormulaPrefix(String(v)).replace(/"/g, '""')}"`;

/** Raw dump: the header is the FIRST row's own keys; every value quoted. */
export function entityDumpCsv(rows: object[]): string {
  if (rows.length === 0) return "";
  const first = rows[0] as Record<string, unknown>;
  const header = Object.keys(first).join(",");
  const body = rows.map((r) =>
    Object.values(r as Record<string, unknown>)
      .map((v) => qq(v))
      .join(","),
  );
  return [header, ...body].join("\n");
}

/**
 * The Settings export filename: the SINGULAR entity name + the ISO date —
 * `contact_2026-10-02.csv` (the reference's onClick args are
 * "Contact"/"Account"/"Lead"/"Activity", lowercased into the prefix).
 */
export function entityExportFilename(entity: string, d = new Date()): string {
  return `${entity.toLowerCase()}_${isoDateSuffix(d)}.csv`;
}

/** The page-level family: quoted cells, a fixed header, rows joined by \n. */
export function toQuotedCsv(header: string[], rows: string[][]): string {
  return [
    header.map((h) => qq(h)).join(","),
    ...rows.map((r) => r.map((v) => qq(v)).join(",")),
  ].join("\n");
}

/** Session-29 (S29-P5, the C2 bundle extract): the leads PAGE export — a
 *  client-side blob from the FILTERED rows. The reference's builder joins
 *  the header UNQUOTED (`z.join(",")`) while every VALUE cell is
 *  `"quoted"` — its own inconsistency vs the toQuotedCsv family (the
 *  s25 header-only capture could not see the quoting; with data it is
 *  bundle-verified). */
export function unquotedHeaderCsv(header: string[], rows: string[][]): string {
  return [header.join(","), ...rows.map((r) => r.map((v) => qq(v)).join(","))].join("\n");
}

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

/** Raw dump: the header is the FIRST row's own keys; every value quoted. */
export function entityDumpCsv(rows: object[]): string {
  if (rows.length === 0) return "";
  const first = rows[0] as Record<string, unknown>;
  const header = Object.keys(first).join(",");
  const body = rows.map((r) =>
    Object.values(r as Record<string, unknown>)
      .map((v) => `"${v}"`)
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
    header.map((h) => `"${h}"`).join(","),
    ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
  ].join("\n");
}

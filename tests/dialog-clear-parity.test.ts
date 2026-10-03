import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-44 pins (S44-P3): the UI clear-parity family — the F-44a
// audit + the live reference proof. The API's explicit-clear convention
// (present ""/null → null) was unreachable from the five dual-verb
// dialogs: every `X: form.X || undefined` mapping DROPPED the key when
// the user emptied the field (JSON.stringify drops undefined), so the
// PUT's `"X" in body` branch skipped and the OLD value persisted while
// the save toasted success. Reference parity proven live BOTH
// directions: the reference's edit dialog PERSISTS clears (a cleared
// description stays ""; Related To "None" clears back to the
// placeholder). The three EntityEditDialog pages already send `|| null`
// — this sweep brings the dual-verb layer to the same contract.
// Behavior-identical on CREATE (null/"" ≡ absent through the optional
// parses); on UPDATE the user's clear now applies.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const dialogs = () => stripComments(read("src/components/shared/entity-dialogs.tsx") ?? "");

// Each row: [label, the regex the submit payload must match]. The
// POSITIVE shape (null / "") is pinned — not merely the absence of
// `undefined` — so a regression to any other drop-key idiom fails.
const CLEAR_SITES: Array<[string, RegExp]> = [
  // ---- AccountForm (the ⋮-menu edit + the quick create) ----
  ["account industry maps empty → null", /industry:\s*form\.industry\s*\|\|\s*null/],
  ["account email maps empty → null", /email:\s*form\.email\s*\|\|\s*null/],
  ["account phone maps empty → null", /phone:\s*form\.phone\s*\|\|\s*null/],
  ["account website maps empty → null", /website:\s*form\.website\s*\|\|\s*null/],
  ["account annualRevenue maps empty → null", /annualRevenue:\s*form\.annualRevenue\s*\?\s*Number\(form\.annualRevenue\)\s*:\s*null/],
  ["account employees maps empty → null", /employees:\s*form\.employees\s*\?\s*Number\(form\.employees\)\s*:\s*null/],
  ["account ownerId maps empty → null", /ownerId:\s*form\.ownerId\s*\|\|\s*null/],
  // ---- ContactForm (the text fields clear via the {...form} spread's
  //      ""; only the FK override needed the fix) ----
  ["contact accountId maps empty → null", /accountId:\s*form\.accountId\s*\|\|\s*null/],
  // ---- LeadForm ----
  ["lead email maps empty → null", /email:\s*form\.email\s*\|\|\s*null/],
  ["lead phone maps empty → null", /phone:\s*form\.phone\s*\|\|\s*null/],
  ["lead company maps empty → null", /company:\s*form\.company\s*\|\|\s*null/],
  ["lead source maps empty → null", /source:\s*form\.source\s*\|\|\s*null/],
  [
    "lead expectedCloseDate maps a cleared date → null (the date-ternary member)",
    /expectedCloseDate:\s*form\.expectedCloseDate\s*\?\s*new Date\(form\.expectedCloseDate\)\.toISOString\(\)\s*:\s*null/,
  ],
  [
    "lead nextFollowUp maps a cleared date → null (the date-ternary member)",
    /nextFollowUp:\s*form\.nextFollowUp\s*\?\s*new Date\(form\.nextFollowUp\)\.toISOString\(\)\s*:\s*null/,
  ],
  // ---- EventForm (the parity-proven surface) ----
  ["event description maps empty → null", /description:\s*form\.description\s*\|\|\s*null/],
  ["event location maps empty → null", /location:\s*form\.location\s*\|\|\s*null/],
  [
    "event endAt maps a cleared date → null (the date-ternary member)",
    /endAt:\s*form\.endAt\s*\?\s*new Date\(form\.endAt\)\.toISOString\(\)\s*:\s*null/,
  ],
  [
    "event relatedType maps the None option → the explicit-clear empty string",
    /relatedType:\s*form\.relatedType\s*===\s*"none"\s*\?\s*""\s*:\s*form\.relatedType/,
  ],
  // ---- ActivityForm ----
  ["activity notes maps empty → null", /notes:\s*form\.notes\s*\|\|\s*null/],
  ["activity relatedType maps empty → null", /relatedType:\s*form\.relatedType\s*\|\|\s*null/],
  ["activity relatedName maps empty → null", /relatedName:\s*form\.relatedName\s*\|\|\s*null/],
];

describe("session-44: the dual-verb dialogs reach the API's explicit-clear convention (S44-P3)", () => {
  it.each(CLEAR_SITES)("%s", (_label, shape) => {
    expect(dialogs()).toMatch(shape);
  });

  it("no drop-key undefined mapping survives on any submit payload (the class census)", () => {
    const src = dialogs();
    // Every historical `|| undefined` / `: undefined` payload mapping is
    // gone — the class, not just the pinned sites (the Number and Date
    // ternary members included; the REQUIRED dates keep their bare
    // `new Date(...)` calls — no ternary, no drop).
    expect(src).not.toMatch(/\|\|\s*undefined/);
    expect(src).not.toMatch(/\?\s*Number\([^)]*\)\s*:\s*undefined/);
    expect(src).not.toMatch(/\?\s*new Date\([^)]*\)\.toISOString\(\)\s*:\s*undefined/);
  });
});

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-48 pins (S48-P2): the source-vocabulary reconciliation — the
// operator decision landed after seven sessions of deferral. NEW bundle
// evidence this session: the reference's settings contactSources is an
// ENTITY-BACKED CRUD list (rt.entities.ContactSource create/update/delete)
// whose ONLY consumer is the settings page's own ConfigEditor (exactly one
// ContactSource.list query site in the bundle) — the reference's contact
// create dialog HARDCODES its five emoji options and its DB stores raw
// values. The five-vocabulary fragmentation IS the reference's product
// design; our clone mirrors every surface of it. The reconciliation is
// therefore DOCUMENTED PARITY, not a merge:
//   - NO enum-membership on source (the routes keep isBadString + max:40 —
//     membership would 400 the reference's own accepted arbitrary import
//     strings, and every candidate list is case-disjoint from another
//     surface so any single-list guard breaks dialogs or imports);
//   - the settings surface stays verbatim (the Capitalized defaults mirror
//     the reference's own disjoint list; it feeds no consumer BY DESIGN);
//   - the src-dead CONTACT_SOURCES constant (zero src consumers; its s5
//     header comment CONTRADICTED the s28 correction directly beneath it —
//     N-47e) is REMOVED, its pin retired; the living vocabulary stays
//     pinned where it lives (contact-model.test.ts:108 the OPTIONS,
//     entity-edit-dialog.test.ts:83 the SOURCE_PAIRS).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-48: the source-vocabulary reconciliation (S48-P2)", () => {
  it("the src-dead CONTACT_SOURCES constant is removed (N-47e closed)", () => {
    const src = stripComments(read("src/lib/constants.ts") ?? "");
    // The dead export is gone (stripComments so the removal's own
    // documentation comment cannot trip the pin; the LIVING vocabulary —
    // CONTACT_SOURCE_OPTIONS — never matches this regex: the identifier
    // continues with "_OPTIONS", not "S").
    expect(src).not.toMatch(/export const CONTACT_SOURCES\b/);
  });

  it("the contradictory s5 comment is retired with the constant", () => {
    const src = read("src/lib/constants.ts") ?? "";
    // The stale "Stored values include the emoji" claim contradicted the
    // s28 correction beneath it (raw values are stored; the emoji strings
    // are create-dialog labels only) — gone with the dead constant.
    expect(src).not.toMatch(/Stored values include the emoji/);
    // The s28-corrected vocabulary remains the surviving source of truth.
    expect(src).toMatch(/export const CONTACT_SOURCE_OPTIONS/);
  });

  it("the routes keep free-form source validation (NO enum membership — the parity posture)", () => {
    const contacts = stripComments(read("src/app/api/contacts/route.ts") ?? "");
    const leads = stripComments(read("src/app/api/leads/route.ts") ?? "");
    // The current shape: isBadString + the max:40 optional parse.
    for (const src of [contacts, leads]) {
      expect(src).toMatch(/if \(isBadString\(body\.source\)\) return ERR\.BAD_REQUEST\("Invalid source"\);/);
      expect(src).toMatch(/asString\(body\.source, \{ optional: true, max: 40 \}\)/);
    }
    // …and NO source-vocabulary membership: neither route references any
    // of the vocabulary constants (the settings list is case-disjoint from
    // the functional one — a single-list guard would 400 dialogs or
    // imports, and the reference accepts arbitrary import strings).
    expect(contacts).not.toMatch(/CONTACT_SOURCE|LEAD_SOURCE/);
    expect(leads).not.toMatch(/CONTACT_SOURCE|LEAD_SOURCE/);
  });

  it("the settings contactSources defaults stay the reference's Capitalized six, verbatim", () => {
    const src = read("src/app/api/settings/route.ts") ?? "";
    // The schema-default mirror (schema.prisma:230) — the reference's own
    // disjoint settings list, mirrored byte-exact. The ConfigEditor list
    // feeds no functional consumer BY DESIGN (bundle-verified: exactly one
    // ContactSource.list consumer — the settings page itself).
    expect(src).toMatch(
      /contactSources: parseList\(row\.contactSources, \["Email", "Phone", "Website", "Referral", "Event", "Social Media"\]\)/,
    );
  });
});

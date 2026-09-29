import { describe, expect, it } from "vitest";
import {
  DEFAULT_LEAD_FILTERS,
  decodeLeadFilters,
  encodeLeadFilters,
  leadFiltersEqual,
  LEAD_FILTERS_STORAGE_KEY,
} from "@/lib/lead-filters";

// Session-8 (S8-5): the leads Filters popover's "Save View" persists the
// filter set to localStorage and restores it on the next visit. The
// encode/decode pair is a pure seam (the component owns storage access) so
// it is unit-testable: round-trips must be lossless, and any malformed or
// unknown payload must decode to null (fall back to defaults) rather than
// crash or resurrect stale vocabularies.

describe("encodeLeadFilters / decodeLeadFilters round-trip", () => {
  it("round-trips the default filter set", () => {
    const decoded = decodeLeadFilters(encodeLeadFilters(DEFAULT_LEAD_FILTERS));
    expect(decoded).toEqual(DEFAULT_LEAD_FILTERS);
  });

  it("round-trips a fully-populated filter set", () => {
    const filters = {
      status: "Qualified",
      source: "Referral",
      minValue: 25000,
      followUpDate: "2026-10-15",
    };
    const decoded = decodeLeadFilters(encodeLeadFilters(filters));
    expect(decoded).toEqual(filters);
  });

  it("round-trips partial filter sets", () => {
    const filters = { status: "Won", source: "", minValue: null, followUpDate: "" };
    const decoded = decodeLeadFilters(encodeLeadFilters(filters));
    expect(decoded).toEqual(filters);
  });
});

describe("decodeLeadFilters defensive behavior", () => {
  it("returns null for malformed JSON", () => {
    expect(decodeLeadFilters("not json {")).toBeNull();
  });

  it("returns null for non-object JSON", () => {
    expect(decodeLeadFilters("[1,2,3]")).toBeNull();
    expect(decodeLeadFilters("\"a string\"")).toBeNull();
    expect(decodeLeadFilters("42")).toBeNull();
  });

  it("returns null for payloads with unknown status/source vocabularies", () => {
    // Unknown enum values must not resurrect stale vocabularies after a
    // future rename — fall back to defaults instead.
    const bad = encodeLeadFilters({ ...DEFAULT_LEAD_FILTERS, status: "frozen" });
    expect(decodeLeadFilters(bad)).toBeNull();
    const badSource = encodeLeadFilters({ ...DEFAULT_LEAD_FILTERS, source: "Carrier Pigeon" });
    expect(decodeLeadFilters(badSource)).toBeNull();
  });

  it("returns null for payloads with wrong-typed fields", () => {
    expect(decodeLeadFilters(JSON.stringify({ status: 7, source: "Call", minValue: null, followUpDate: "" }))).toBeNull();
    expect(decodeLeadFilters(JSON.stringify({ status: "New", source: "Call", minValue: "lots", followUpDate: "" }))).toBeNull();
    expect(decodeLeadFilters(JSON.stringify({ status: "New", source: "Call", minValue: null, followUpDate: 15 }))).toBeNull();
  });

  it("returns null for payloads missing required keys", () => {
    expect(decodeLeadFilters(JSON.stringify({ status: "New" }))).toBeNull();
    expect(decodeLeadFilters(JSON.stringify({}))).toBeNull();
    expect(decodeLeadFilters("null")).toBeNull();
  });

  it("accepts every pinned status/source option", () => {
    for (const status of ["", "New", "Contacted", "Qualified", "Won", "Lost"]) {
      const decoded = decodeLeadFilters(
        encodeLeadFilters({ ...DEFAULT_LEAD_FILTERS, status }),
      );
      expect(decoded?.status).toBe(status);
    }
    for (const source of ["", "Call", "Email", "Website", "Partner", "Referral"]) {
      const decoded = decodeLeadFilters(
        encodeLeadFilters({ ...DEFAULT_LEAD_FILTERS, source }),
      );
      expect(decoded?.source).toBe(source);
    }
  });

  it("rejects negative minValue but accepts zero and positive integers", () => {
    const zero = decodeLeadFilters(encodeLeadFilters({ ...DEFAULT_LEAD_FILTERS, minValue: 0 }));
    expect(zero?.minValue).toBe(0);
    const pos = decodeLeadFilters(encodeLeadFilters({ ...DEFAULT_LEAD_FILTERS, minValue: 1000 }));
    expect(pos?.minValue).toBe(1000);
    const neg = encodeLeadFilters({ ...DEFAULT_LEAD_FILTERS, minValue: -5 } as never);
    expect(decodeLeadFilters(neg)).toBeNull();
  });
});

describe("leadFiltersEqual", () => {
  it("compares filter sets by value", () => {
    const a = { status: "New", source: "Call", minValue: 5, followUpDate: "2026-01-01" };
    const b = { status: "New", source: "Call", minValue: 5, followUpDate: "2026-01-01" };
    const c = { ...a, status: "Won" };
    expect(leadFiltersEqual(a, b)).toBe(true);
    expect(leadFiltersEqual(a, c)).toBe(false);
  });
});

describe("storage key", () => {
  it("is namespaced and stable", () => {
    expect(LEAD_FILTERS_STORAGE_KEY).toBe("neo-crm.leads.view");
  });
});

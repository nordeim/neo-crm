import { describe, expect, it } from "vitest";
import {
  DEFAULT_LEAD_FILTERS,
  LEAD_FILTER_SOURCE_OPTIONS,
  LEAD_FILTER_STATUS_OPTIONS,
  LEAD_VIEWS_STORAGE_KEY,
  applySavedView,
  decodeSavedLeadViews,
  encodeSavedLeadViews,
  filtersActive,
  isOverdueFollowUp,
  leadFiltersEqual,
  type LeadFilters,
  type SavedLeadView,
} from "@/lib/lead-filters";

// Session-29 (S29-P1/P3, bundle + LIVE verified): the leads filters seam
// moves to the reference's RAW vocabularies — the Gke popover's Status
// select stores all/new/contacted/qualified/won/lost and its Source select
// stores all/call/email/website/partner/referral (value "call", label
// "Call"), the trigger gains the "(Active)" suffix when any filter is set
// (live-confirmed), Save View fires the native prompt("Enter view name:")
// and the saved views render as a w-full sm:w-48 select that APPLIES a
// view's filters on selection (live-confirmed; the reference keeps them
// in-memory — our localStorage list stays the documented superset).

describe("session-29: the raw filter vocabularies", () => {
  it("the status options are the RAW five-status set + the all sentinel", () => {
    expect([...LEAD_FILTER_STATUS_OPTIONS]).toEqual([
      "all",
      "new",
      "contacted",
      "qualified",
      "won",
      "lost",
    ]);
  });

  it("the source options are the RAW five sources + the all sentinel", () => {
    expect([...LEAD_FILTER_SOURCE_OPTIONS]).toEqual([
      "all",
      "call",
      "email",
      "website",
      "partner",
      "referral",
    ]);
  });

  it("the defaults use the all sentinel (the reference's Gke state shape)", () => {
    expect(DEFAULT_LEAD_FILTERS).toEqual({
      status: "all",
      source: "all",
      minValue: null,
      followUpDate: "",
    });
  });
});

// Session-55 (S55-P3, N-55c): the encode/decode its RE-ANCHORED to the
// living saved-views surface — encodeLeadFilters/decodeLeadFilters were
// TEST-ONLY since the s29 supersession (the page persists the VIEWS LIST
// through encodeSavedLeadViews/decodeSavedLeadViews, whose decoding
// validates through the same internal asFilters). The behavioral classes
// are unchanged: lossless round-trips, the legacy-vocabulary rejection,
// the malformed-payload rejection.

describe("session-29/55: the saved-views round-trip (the living seam)", () => {
  it("round-trips a saved view with a raw filter set losslessly", () => {
    const filters: LeadFilters = {
      status: "contacted",
      source: "partner",
      minValue: 5000,
      followUpDate: "2026-10-15",
    };
    const view: SavedLeadView = { name: "Big partners", filters };
    expect(decodeSavedLeadViews(encodeSavedLeadViews([view]))).toEqual([view]);
  });

  it("round-trips the all-sentinel defaults inside a saved view", () => {
    const view: SavedLeadView = { name: "Everything", filters: DEFAULT_LEAD_FILTERS };
    expect(decodeSavedLeadViews(encodeSavedLeadViews([view]))).toEqual([view]);
  });

  it("rejects the LEGACY capitalized vocabulary (stale saved views fall back to defaults)", () => {
    // The pre-s29 schema stored the capitalized labels; after the rename
    // they decode to null so the page falls back to defaults instead of
    // resurrecting a dead vocabulary.
    expect(
      decodeSavedLeadViews(
        JSON.stringify([{ name: "Old", filters: { status: "New", source: "Call", minValue: null, followUpDate: "" } }]),
      ),
    ).toBeNull();
    expect(
      decodeSavedLeadViews(
        JSON.stringify([{ name: "Old", filters: { status: "all", source: "Referral", minValue: null, followUpDate: "" } }]),
      ),
    ).toBeNull();
  });

  it("rejects malformed payloads", () => {
    expect(decodeSavedLeadViews(null)).toBeNull();
    expect(decodeSavedLeadViews("")).toBeNull();
    expect(decodeSavedLeadViews("not-json")).toBeNull();
    // A non-array top level is not a views list.
    expect(
      decodeSavedLeadViews(JSON.stringify({ status: "new", source: "call", minValue: null, followUpDate: "" })),
    ).toBeNull();
    // An empty name is not a view.
    expect(
      decodeSavedLeadViews(
        JSON.stringify([{ name: "", filters: { status: "new", source: "call", minValue: null, followUpDate: "" } }]),
      ),
    ).toBeNull();
    // Bad filter types are not a filter set.
    expect(
      decodeSavedLeadViews(
        JSON.stringify([{ name: "X", filters: { status: 7, source: "all", minValue: null, followUpDate: "" } }]),
      ),
    ).toBeNull();
    expect(
      decodeSavedLeadViews(
        JSON.stringify([{ name: "X", filters: { status: "new", source: "call", minValue: "lots", followUpDate: "" } }]),
      ),
    ).toBeNull();
    expect(
      decodeSavedLeadViews(
        JSON.stringify([{ name: "X", filters: { status: "new", source: "call", minValue: null, followUpDate: 15 } }]),
      ),
    ).toBeNull();
    // A missing filters object is not a view.
    expect(decodeSavedLeadViews(JSON.stringify([{ name: "X" }]))).toBeNull();
  });
});

describe("session-29: the saved-views list (our persistence superset)", () => {
  it("round-trips the views list", () => {
    const views: SavedLeadView[] = [
      { name: "My Pipeline", filters: { status: "new", source: "all", minValue: null, followUpDate: "" } },
      { name: "Big deals", filters: { status: "all", source: "partner", minValue: 50000, followUpDate: "" } },
    ];
    expect(decodeSavedLeadViews(encodeSavedLeadViews(views))).toEqual(views);
  });

  it("an empty list round-trips (vs null for malformed payloads)", () => {
    expect(decodeSavedLeadViews(encodeSavedLeadViews([]))).toEqual([]);
    expect(decodeSavedLeadViews(null)).toBeNull();
    expect(decodeSavedLeadViews("garbage")).toBeNull();
    expect(decodeSavedLeadViews(JSON.stringify([{ name: "X", filters: { status: "New" } }]))).toBeNull();
  });

  it("applySavedView returns the view's filters", () => {
    const view: SavedLeadView = {
      name: "Won only",
      filters: { status: "won", source: "all", minValue: null, followUpDate: "" },
    };
    expect(applySavedView(view)).toEqual(view.filters);
  });

  it("the views live under their own storage key", () => {
    expect(LEAD_VIEWS_STORAGE_KEY).toBe("neo-crm.leads.views");
  });
});

describe("session-29: the (Active) suffix predicate (live-confirmed)", () => {
  it("the defaults are NOT active", () => {
    expect(filtersActive(DEFAULT_LEAD_FILTERS)).toBe(false);
  });

  it("any set filter is active — status, source, minValue, or follow-up date", () => {
    expect(filtersActive({ ...DEFAULT_LEAD_FILTERS, status: "new" })).toBe(true);
    expect(filtersActive({ ...DEFAULT_LEAD_FILTERS, source: "call" })).toBe(true);
    expect(filtersActive({ ...DEFAULT_LEAD_FILTERS, minValue: 100 })).toBe(true);
    expect(filtersActive({ ...DEFAULT_LEAD_FILTERS, followUpDate: "2026-10-15" })).toBe(true);
    // minValue 0 is falsy — the reference's some(v => v && v !== "all")
    // treats it as inactive, mirrored.
    expect(filtersActive({ ...DEFAULT_LEAD_FILTERS, minValue: 0 })).toBe(false);
  });
});

describe("session-29: the overdue predicate (the reference's ee)", () => {
  it("null / empty / absent dates are never overdue", () => {
    expect(isOverdueFollowUp(null)).toBe(false);
    expect(isOverdueFollowUp(undefined)).toBe(false);
    expect(isOverdueFollowUp("")).toBe(false);
  });

  it("future dates are NOT overdue; a later-today datetime is not either", () => {
    const laterToday = new Date(Date.now() + 3_600_000).toISOString();
    expect(isOverdueFollowUp(laterToday)).toBe(false);
    expect(isOverdueFollowUp("2999-01-01")).toBe(false);
  });

  it("the reference's own quirk: a DATE-ONLY 'today' string IS overdue", () => {
    // `new Date("2026-10-02")` parses at UTC MIDNIGHT — which is before
    // any later moment the same day. The reference's ee has exactly this
    // behavior (`new Date(z) < new Date()`), so a follow-up set for
    // today renders the red border + CircleAlert for most of the day.
    // (Pinned on the UTC date string so the assertion is timezone-safe.)
    const utcToday = new Date().toISOString().slice(0, 10);
    expect(isOverdueFollowUp(utcToday)).toBe(true);
  });

  it("any past date IS overdue — the red border + CircleAlert state", () => {
    expect(isOverdueFollowUp("2020-01-01")).toBe(true);
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    expect(isOverdueFollowUp(yesterday)).toBe(true);
  });
});

describe("session-29: equality", () => {
  it("leadFiltersEqual compares all four fields", () => {
    const a: LeadFilters = { status: "new", source: "call", minValue: 5, followUpDate: "2026-01-01" };
    const b: LeadFilters = { status: "new", source: "call", minValue: 5, followUpDate: "2026-01-01" };
    expect(leadFiltersEqual(a, b)).toBe(true);
    expect(leadFiltersEqual(a, { ...b, status: "all" })).toBe(false);
    expect(leadFiltersEqual(a, { ...b, minValue: null })).toBe(false);
  });
});

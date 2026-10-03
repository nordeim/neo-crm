import { describe, expect, it } from "vitest";
import { isBadString, isBadDate, isBadNumber } from "../src/lib/api";

// Session-40 pins (S40-P1): the coercion-guard helper family. The
// graduation audit quantified 37 silent PUT members + 40 silent POST
// members where a non-string/non-number/non-date payload rode the
// lenient parse helpers into a SILENT mutation (a `{"status": 123}`
// reset an inactive contact to active; `{"endAt": {}}` cleared the end
// time AND bypassed the s36 invariant; `{"defaultCurrency": 123}`
// stored "" through a dead `??` fallback). These three predicates are
// the isBadFK class generalized to the parse shapes the non-FK fields
// use. Behavior tests (pure functions — the REAL edge matrix, not
// source contracts).

describe("session-40: isBadString (the general isBadFK mirror)", () => {
  it("absent, null, and empty string are NOT bad (the explicit clear/absent)", () => {
    expect(isBadString(undefined)).toBe(false);
    expect(isBadString(null)).toBe(false);
    expect(isBadString("")).toBe(false);
  });

  it("any string is NOT bad (whitespace is asString's business, not the guard's)", () => {
    expect(isBadString("abc")).toBe(false);
    expect(isBadString("  ")).toBe(false);
    expect(isBadString("+1 (555) 010-0199")).toBe(false);
  });

  it("every non-string present payload IS bad (the silent-??-null class)", () => {
    expect(isBadString(123)).toBe(true);
    expect(isBadString(true)).toBe(true);
    expect(isBadString({ evil: 1 })).toBe(true);
    expect(isBadString(["a"])).toBe(true);
  });
});

describe("session-40: isBadDate (dates have a parseable shape — garbage strings clear today)", () => {
  it("absent, null, and empty string are NOT bad (the explicit clear)", () => {
    expect(isBadDate(undefined)).toBe(false);
    expect(isBadDate(null)).toBe(false);
    expect(isBadDate("")).toBe(false);
  });

  it("parseable strings are NOT bad (the ISO and date-only forms the UI sends)", () => {
    expect(isBadDate("2026-10-10T12:00:00.000Z")).toBe(false);
    expect(isBadDate("2026-10-10")).toBe(false);
  });

  it("an UNPARSEABLE string IS bad (asDate('garbage') silently cleared the field)", () => {
    expect(isBadDate("garbage")).toBe(true);
    expect(isBadDate("next tuesday")).toBe(true);
  });

  it("every non-string present payload IS bad", () => {
    expect(isBadDate(123)).toBe(true);
    expect(isBadDate(true)).toBe(true);
    expect(isBadDate({ $gt: "2026-01-01" })).toBe(true);
    expect(isBadDate([])).toBe(true);
  });
});

describe("session-40: isBadNumber (the truthy/array edges of Number())", () => {
  it("absent, null, and empty string are NOT bad (asNumber's own absent special case)", () => {
    expect(isBadNumber(undefined)).toBe(false);
    expect(isBadNumber(null)).toBe(false);
    expect(isBadNumber("")).toBe(false);
  });

  it("finite numbers and numeric strings are NOT bad (the UI's Number()/parseFloat shapes)", () => {
    expect(isBadNumber(5)).toBe(false);
    expect(isBadNumber(5.5)).toBe(false);
    expect(isBadNumber(0)).toBe(false);
    expect(isBadNumber("123")).toBe(false);
    expect(isBadNumber("12.5")).toBe(false);
  });

  it("garbage and whitespace strings ARE bad (Number(' ') is 0 — a silent zero store)", () => {
    expect(isBadNumber("abc")).toBe(true);
    expect(isBadNumber(" ")).toBe(true);
  });

  it("booleans, arrays, and objects ARE bad (Number(true)=1, Number([5])=5, Number([])=0)", () => {
    expect(isBadNumber(true)).toBe(true);
    expect(isBadNumber([5])).toBe(true);
    expect(isBadNumber([])).toBe(true);
    expect(isBadNumber({ v: 5 })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Session-41 (S41-P5): the non-finite edge matrix — JSON.parse('{"v":1e999}')
// yields Infinity (a present, typeof-number payload), and NaN arrives the
// same way through asNumber's arithmetic. Number.isFinite() rejects both
// in the predicate; these rows pin the branch so it cannot silently
// regress (GREEN-on-arrival strengthening, the s38-P4 precedent).
// ---------------------------------------------------------------------------

describe("session-41: isBadNumber's non-finite edges (Infinity + NaN)", () => {
  it("Infinity and -Infinity ARE bad (JSON.parse 1e999 overflows to Infinity)", () => {
    expect(isBadNumber(Infinity)).toBe(true);
    expect(isBadNumber(-Infinity)).toBe(true);
    expect(isBadNumber(JSON.parse('{"v":1e999}').v)).toBe(true);
  });

  it("NaN IS bad (arithmetic residue — Number('')-adjacent paths)", () => {
    expect(isBadNumber(NaN)).toBe(true);
    expect(isBadNumber(Number("abc"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Session-42 (S42-P2): the boolean edge matrix — the strict-bool idioms
// (`isKey: body.isKey === true`, `allDay: body.allDay === true`)
// silently stored FALSE for a present non-boolean and silently CLEARED
// an existing true on PUT (LIVE-proven: a key account PUT
// {"isKey":"yes"} → 200 + isKey:false — the s41 silent-drop class, one
// type-shape over). isBadBool is the isBadString shape for booleans:
// only a PRESENT non-boolean is bad. The UI writers are real checkbox
// booleans (or absent — the event dialog has no all-day control), so
// no legit payload can trip the guard.
// ---------------------------------------------------------------------------

describe("session-42: isBadBool (the strict-bool silent-clear family)", () => {
  it("is exported (the isBadString shape, one type over)", async () => {
    const api = await import("../src/lib/api");
    expect(typeof api.isBadBool).toBe("function");
  });

  it("absent, null, and real booleans are NOT bad (the checkbox payload shapes)", async () => {
    const api = await import("../src/lib/api");
    expect(api.isBadBool(undefined)).toBe(false);
    expect(api.isBadBool(null)).toBe(false);
    expect(api.isBadBool(true)).toBe(false);
    expect(api.isBadBool(false)).toBe(false);
  });

  it("every present non-boolean IS bad (the === true silent-clear class)", async () => {
    const api = await import("../src/lib/api");
    expect(api.isBadBool("yes")).toBe(true);
    expect(api.isBadBool("true")).toBe(true);
    expect(api.isBadBool(1)).toBe(true);
    expect(api.isBadBool(0)).toBe(true);
    expect(api.isBadBool({})).toBe(true);
    expect(api.isBadBool([])).toBe(true);
  });
});

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-96 (S96-P1): the drawer battery tool — the F-96a1 fix + the
// encoded s94/s95 protocol, pinned. The battery (scripts/
// drawer-battery-390.ts) is the standing mobile-nav verification tool
// (the operator's particular ask); the 96-a audit found its step-5
// resize-past-md probe ran against a CLOSED drawer — the auto-close
// listener at mobile-nav.tsx:54-62 only registers while OPEN, so the
// probe could never go red for an s8-class regression. These pins anchor
// the corrected construction (the reopen) + the exact-selector protocol
// the s94/s95 sessions debugged into it.

const root = path.resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

describe("session-96 (S96-P1): the drawer battery tool — the F-96a1 reopen fix + the encoded protocol", () => {
  it("step 5 REOPENS the drawer before the resize-past-md probe (F-96a1: the auto-close listener only registers while open)", () => {
    const src = read("scripts/drawer-battery-390.ts");
    // the resize step must run against an OPEN drawer: a second open
    // (after the Escape-close step) precedes the setViewportSize grow
    const resizeIdx = src.indexOf("setViewportSize");
    expect(resizeIdx).toBeGreaterThan(0);
    const before = src.slice(0, resizeIdx);
    // the reopen: a second trigger click after the Escape-close block
    const escapeIdx = before.lastIndexOf("Escape");
    expect(escapeIdx).toBeGreaterThan(0);
    const between = before.slice(escapeIdx);
    expect(between).toMatch(/trigger\.click\(\)/);
    // and the drawer must be verified OPEN again before resizing (the
    // panel locator re-resolves)
    expect(between).toMatch(/h-dvh/);
  });

  it("the exact-selector protocol: the panel is the div.h-dvh.w-72 INSIDE the dialog root (not the root itself — the s94 probe-trap lesson)", () => {
    const src = read("scripts/drawer-battery-390.ts");
    // the panel selector rides the dialog root + the panel class pair
    expect(src).toMatch(/\[role=?.?dialog.?\][\s\S]*?h-dvh/);
    expect(src).toContain("w-72");
  });

  it("the navigate-close wait is URL-based on the CAPITAL /Leads route (the s24 route-case construction — the dev server compiles it on first visit)", () => {
    const src = read("scripts/drawer-battery-390.ts");
    expect(src).toMatch(/waitForURL[\s\S]*?Leads/);
  });

  it("the battery keeps the dual body+main scroll-lock probe and the REAL-user-click doctrine (locator clicks, never synthetic el.click())", () => {
    const src = read("scripts/drawer-battery-390.ts");
    expect(src).toMatch(/overflow[\s\S]*hidden/);
    // no synthetic clicks
    expect(src).not.toMatch(/\.click\(\)\s*;?\s*\/\/\s*synthetic/);
  });
});

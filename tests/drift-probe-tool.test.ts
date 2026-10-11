// Session-101 pins (S101-P1): the drift probe tool — the per-session
// reference-stability throwaway promoted into a repo tool (the
// s100-close suggested next #2: "promote the drift probe [bundle md5
// + census] into a tool beside the sweep"). Every session since s92
// re-derived the same probe by hand: the reference's POST-LOGIN
// app-shell bundle md5 (71 consecutive stable sessions measured
// a70a637fcf1d4291da8e0d965676dc11, 1,631,071 bytes), the reference
// census (demo data zero · the desktop nav 256px/8 visible links),
// and the TRUE-390 mobile-nav defect check (the reference's own bug:
// nav w=0, 0 visible links, NO menu button at phone width — our
// drawer the superset). These pins exercise the PURE seams the tool's
// Playwright main() consumes — the same node-side contract the live
// probe run reports.

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

const probe = () => import("../scripts/drift-probe");

describe("session-101 (S101-P1): the drift probe — the reference-stability tool", () => {
  it("pickAppBundle: the largest script by bytes wins (the app-shell bundle discovery — POST-LOGIN, the s96 decode: the pre-auth shell rides different chunks)", async () => {
    const { pickAppBundle } = await probe();
    expect(
      pickAppBundle([
        { url: "https://ref/assets/login-6f02a1b4.js", bytes: 182_000 },
        { url: "https://ref/assets/index-DZ-xbrIm.js", bytes: 1_631_071 },
        { url: "https://ref/assets/vendor-9c1ff0e2.js", bytes: 402_111 },
      ]),
    ).toBe("https://ref/assets/index-DZ-xbrIm.js");
  });

  it("pickAppBundle: an empty list returns null (fail fast — never guess a bundle)", async () => {
    const { pickAppBundle } = await probe();
    expect(pickAppBundle([])).toBe(null);
  });

  it("stabilityVerdict: STABLE only on the EXACT md5 + byte count (the 71-consecutive-stable contract)", async () => {
    const { stabilityVerdict, STANDING } = await probe();
    expect(stabilityVerdict(STANDING.bundle, STANDING.bundle)).toBe("STABLE");
  });

  it("stabilityVerdict: CHANGED on either field drift (a new reference bundle is a parity EVENT — re-walk the families before trusting the gates)", async () => {
    const { stabilityVerdict, STANDING } = await probe();
    expect(
      stabilityVerdict({ md5: "deadbeefdeadbeefdeadbeefdeadbeef", bytes: STANDING.bundle.bytes }, STANDING.bundle),
    ).toBe("CHANGED");
    expect(
      stabilityVerdict({ md5: STANDING.bundle.md5, bytes: STANDING.bundle.bytes + 1 }, STANDING.bundle),
    ).toBe("CHANGED");
  });

  it("desktopNavVerdict: STANDING at 256px + 8 visible links (the reference desktop sidebar census)", async () => {
    const { desktopNavVerdict } = await probe();
    expect(desktopNavVerdict({ width: 256, visibleLinks: 8, menuButtons: 0 })).toBe("STANDING");
    expect(desktopNavVerdict({ width: 240, visibleLinks: 8, menuButtons: 0 })).toBe("CHANGED");
    expect(desktopNavVerdict({ width: 256, visibleLinks: 7, menuButtons: 0 })).toBe("CHANGED");
  });

  it("mobileNavVerdict: DEFECT-STANDS at the triple-zero (the reference's own bug at TRUE 390 — nav w=0 · 0 visible links · 0 menu buttons)", async () => {
    const { mobileNavVerdict } = await probe();
    expect(mobileNavVerdict({ width: 0, visibleLinks: 0, menuButtons: 0 })).toBe("DEFECT-STANDS");
  });

  it("mobileNavVerdict: NAV-FIXED when ANY phone navigation appears (the parity re-evaluation trigger — our superset drawer must be re-compared)", async () => {
    const { mobileNavVerdict } = await probe();
    // a drawer + hamburger (our own construction, at the reference's width)
    expect(mobileNavVerdict({ width: 288, visibleLinks: 8, menuButtons: 1 })).toBe("NAV-FIXED");
    // just a menu button
    expect(mobileNavVerdict({ width: 0, visibleLinks: 0, menuButtons: 1 })).toBe("NAV-FIXED");
    // just a visible nav
    expect(mobileNavVerdict({ width: 256, visibleLinks: 0, menuButtons: 0 })).toBe("NAV-FIXED");
  });

  it("demoDataVerdict: ZERO when every walked surface reports 0 data rows; SEEDED the moment any does (the standing state since the s3 wipe)", async () => {
    const { demoDataVerdict } = await probe();
    expect(demoDataVerdict({ contacts: 0, leads: 0, accounts: 0 })).toBe("ZERO");
    expect(demoDataVerdict({ contacts: 0, leads: 3, accounts: 0 })).toBe("SEEDED");
  });

  it("STANDING: the pinned constants — the bundle md5 + bytes · the desktop nav 256/8 (the census contract the probe reports against)", async () => {
    const { STANDING } = await probe();
    expect(STANDING.bundle).toEqual({ md5: "a70a637fcf1d4291da8e0d965676dc11", bytes: 1_631_071 });
    expect(STANDING.desktopNav).toEqual({ width: 256, visibleLinks: 8 });
  });

  it("the probe wires the seams: the header documents the tool · package.json gains probe:ref · the --json flag literal · NOT part of the offline gate", () => {
    const src = read("scripts/drift-probe.ts");
    // the exported seam family
    expect(src).toContain("export function pickAppBundle(");
    expect(src).toContain("export function stabilityVerdict(");
    expect(src).toContain("export function desktopNavVerdict(");
    expect(src).toContain("export function mobileNavVerdict(");
    expect(src).toContain("export function demoDataVerdict(");
    expect(src).toContain("export const STANDING");
    // the flag (the machine-readable output)
    expect(src).toContain('process.argv.includes("--json")');
    // the header documents the tool + the offline-gate boundary
    expect(src).toMatch(/reference-stability/i);
    expect(src).toContain("NOT part of");
    // package.json: the one-command entry + the offline gate untouched
    const pkg = JSON.parse(read("package.json"));
    expect(pkg.scripts["probe:ref"]).toBe("bun scripts/drift-probe.ts");
    expect(pkg.scripts["gate:full"]).not.toContain("probe:ref");
    expect(pkg.scripts["gate"]).not.toContain("probe:ref");
  });
});

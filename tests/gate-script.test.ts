import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-38 pins (S38-P6): the gate umbrella script. The documented
// gate order (AGENTS.md "Gate order before every push") was manual —
// five commands run by hand in order, with the known hazard that
// `test:e2e` does not depend on `build` (a leftover standalone server
// on :3100 silently tests STALE code, per the deferred ledger's N7).
// The `gate` script encodes the order in one command.
//
// Session-39 correction (S39-P1): chaining `build` before `test:e2e`
// does NOT by itself guarantee the fresh tree — playwright.config's
// `reuseExistingServer: !process.env.CI` reuses a leftover :3100
// listener regardless of build timing (a running process holds the OLD
// code in memory while the rebuild swaps static assets underneath).
// The gate's e2e step therefore runs with `CI=1`, which forces
// `reuseExistingServer: false`: the gate ALWAYS boots a fresh server
// from the just-built tree and kills it on exit. Plain `bun run
// test:e2e` keeps the reuse ergonomics for iteration.

const pkg = JSON.parse(
  readFileSync(path.resolve(import.meta.dirname, "..", "package.json"), "utf-8"),
) as { scripts?: Record<string, string> };

describe("session-38: the gate umbrella script (S38-P6)", () => {
  it("package.json ships a `gate` script", () => {
    expect(typeof pkg.scripts?.gate).toBe("string");
    expect(pkg.scripts!.gate.length).toBeGreaterThan(0);
  });

  it("the chain is lint → typecheck → test → build → CI=1 test:e2e (the AGENTS.md order)", () => {
    const steps = pkg.scripts!.gate.split("&&").map((s) => s.trim());
    expect(steps).toEqual([
      "bun run lint",
      "bun run typecheck",
      "bun run test",
      "bun run build",
      "CI=1 bun run test:e2e",
    ]);
  });

  it("the build step precedes the e2e boot (the no-build hazard, closed in-script)", () => {
    expect(pkg.scripts!.gate.indexOf("bun run build")).toBeLessThan(
      pkg.scripts!.gate.indexOf("bun run test:e2e"),
    );
  });
});

describe("session-39: the gate's fresh-boot guarantee (S39-P1)", () => {
  it("the e2e step runs with CI=1 so a leftover :3100 server is never reused", () => {
    // reuseExistingServer: !process.env.CI in playwright.config.ts —
    // under CI=1 the gate always boots the just-built standalone
    // server (and kills it on exit). Without the prefix, a leftover
    // listener would serve STALE in-memory code through the whole e2e
    // leg — the s38 "closed the stale-server class" claim was false
    // in exactly this scenario.
    expect(pkg.scripts!.gate).toMatch(/CI=1\s+bun run test:e2e/);
  });

  it("plain `test:e2e` keeps the reuse ergonomics (the prefix lives only in the gate)", () => {
    // The iteration workflow (bun run test:e2e against an
    // already-running server) is documented local ergonomics — the
    // CI=1 prefix must not leak into the standalone script.
    expect(pkg.scripts!["test:e2e"]).toBe("playwright test");
  });
});

describe("session-39: the lint warning enforcement (S39-P6)", () => {
  it("the lint script fails on warnings (--max-warnings 0) — the documented 0/0 standard is load-bearing", () => {
    // `eslint .` exits 0 on warnings; every doc says "lint 0/0" as the
    // gate standard, but nothing enforced it. The flag makes the
    // convention a contract.
    expect(pkg.scripts!.lint).toMatch(/--max-warnings\s+0/);
  });
});

describe("session-69: the E2E_PORT single source (N-69g)", () => {
  // The 69-c rotation's find: the "3100" default was hardcoded TWICE —
  // playwright.config.ts (Number(process.env.E2E_PORT ?? 3100)) and the
  // crm.spec 401 probe (process.env.E2E_PORT ?? "3100") — so a default
  // change in one place silently sends the probe at a dead port. The
  // fix: tests/e2e/e2e-port.ts owns the default + the env resolution;
  // both consumers import it (the S68-P4 constant-wiring class).
  function stripComments(src: string): string {
    return src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");
  }
  function read(rel: string): string {
    const p = path.resolve(import.meta.dirname, "..", rel);
    return existsSync(p) ? readFileSync(p, "utf-8") : "";
  }

  it("the 3100 default lives exactly once (in e2e-port.ts) and both consumers import it", () => {
    const port = stripComments(read("tests/e2e/e2e-port.ts"));
    expect(port).toContain('"3100"');
    const config = stripComments(read("playwright.config.ts"));
    const spec = stripComments(read("tests/e2e/crm.spec.ts"));
    // neither consumer carries the literal anymore
    expect(config).not.toContain("?? 3100");
    expect(spec).not.toContain('?? "3100"');
    // both consume the shared module
    expect(config).toMatch(/e2e-port/);
    expect(spec).toMatch(/e2e-port/);
  });
});

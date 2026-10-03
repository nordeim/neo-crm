import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-38 pins (S38-P6): the gate umbrella script. The documented
// gate order (AGENTS.md "Gate order before every push") was manual —
// five commands run by hand in order, with the known hazard that
// `test:e2e` does not depend on `build` (a leftover standalone server
// on :3100 silently tests STALE code, per the deferred ledger's N7).
// The `gate` script encodes the order in one command — and because it
// chains `build` BEFORE `test:e2e`, running it always exercises the
// fresh tree.

const pkg = JSON.parse(
  readFileSync(path.resolve(import.meta.dirname, "..", "package.json"), "utf-8"),
) as { scripts?: Record<string, string> };

describe("session-38: the gate umbrella script (S38-P6)", () => {
  it("package.json ships a `gate` script", () => {
    expect(typeof pkg.scripts?.gate).toBe("string");
    expect(pkg.scripts!.gate.length).toBeGreaterThan(0);
  });

  it("the chain is lint → typecheck → test → build → test:e2e (the AGENTS.md order)", () => {
    const steps = pkg.scripts!.gate.split("&&").map((s) => s.trim());
    expect(steps).toEqual([
      "bun run lint",
      "bun run typecheck",
      "bun run test",
      "bun run build",
      "bun run test:e2e",
    ]);
  });

  it("the build step precedes the e2e boot (the stale-server hazard, closed in-script)", () => {
    expect(pkg.scripts!.gate.indexOf("bun run build")).toBeLessThan(
      pkg.scripts!.gate.indexOf("bun run test:e2e"),
    );
  });
});

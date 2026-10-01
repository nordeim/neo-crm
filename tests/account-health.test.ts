import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-26 pins (S26-P5, the model half): the reference's Account entity
// carries a STORED health (Healthy / At Risk / Needs Attention — its detail
// view's class-map), backend-defaulted (its New Account dialog has NO
// health field — live-verified: 8 labels, none health). Its accounts page
// export includes the Health column. Our Prisma Account model lacked the
// field entirely.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-26: the Account health field (S26-P5 model half)", () => {
  it("the Prisma schema carries health with the default", () => {
    const schema = read("prisma/schema.prisma")!;
    const block = schema.slice(schema.indexOf("model Account"), schema.indexOf("model Account") + 900);
    expect(block).toMatch(/health\s+String\s+@default\("Healthy"\)/);
  });

  it("the client-side Account type carries health", () => {
    const types = read("src/types/index.ts")!;
    const block = types.slice(types.indexOf("interface Account"), types.indexOf("interface Account") + 500);
    expect(block).toMatch(/health:\s*string/);
  });

  it("the seed assigns varied health values (the reference's three-state vocabulary)", () => {
    const seed = read("prisma/seed.ts")!;
    expect(seed).toMatch(/Healthy/);
    expect(seed).toMatch(/At Risk/);
    expect(seed).toMatch(/Needs Attention/);
  });

  it("the seed data block wires health into db.account.create", () => {
    const seed = read("prisma/seed.ts")!;
    const block = seed.slice(seed.indexOf("db.account.create"), seed.indexOf("db.account.create") + 600);
    expect(block).toMatch(/health:/);
  });
});

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-68 pins (F-68a2 — the 68-a re-audit's find): the N-67d body
// pre-gate family extended to the SESSIONED CRUD routes. All 12 routes
// that parse req.json() behind requireSession() (accounts/activities/
// contacts/events/leads x[root+[id]] + settings + reset) now gate the
// declared Content-Length BEFORE the parse — the same isBodyTooLarge
// ceiling the four public auth routes carry (MAX_AUTH_BODY_BYTES =
// 16KB; the honest CRUD bodies are far smaller — asString defaults to
// a 500-char cap, the settings PUT carries the picklists). The gate
// sits after requireSession (the upload route's documented placement:
// the unauth 401 is cheap and pre-auth bucketing concerns do not apply
// to a pure size check) and before req.json() so an oversized body is
// rejected without ever being read into memory.
//
// The pins are ORDERING-aware (indexOf comparisons, not mere
// containment) so a gate placed after the parse cannot satisfy them.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const ROUTES = [
  "src/app/api/accounts/route.ts",
  "src/app/api/accounts/[id]/route.ts",
  "src/app/api/activities/route.ts",
  "src/app/api/activities/[id]/route.ts",
  "src/app/api/contacts/route.ts",
  "src/app/api/contacts/[id]/route.ts",
  "src/app/api/events/route.ts",
  "src/app/api/events/[id]/route.ts",
  "src/app/api/leads/route.ts",
  "src/app/api/leads/[id]/route.ts",
  "src/app/api/settings/route.ts",
  "src/app/api/reset/route.ts",
] as const;

describe("session-68: the sessioned body pre-gate family (F-68a2)", () => {
  it("all 12 sessioned routes import isBodyTooLarge from the api seam", () => {
    for (const rel of ROUTES) {
      const src = stripComments(read(rel) ?? "");
      expect(src, rel).toMatch(/isBodyTooLarge/);
      expect(src, rel).toMatch(/from "@\/lib\/api"/);
    }
  });

  it("the gate runs BEFORE req.json() in every sessioned route", () => {
    for (const rel of ROUTES) {
      const src = stripComments(read(rel) ?? "");
      const gate = src.indexOf("isBodyTooLarge(req)");
      const parse = src.indexOf("req.json()");
      expect(gate, `${rel}: no gate`).toBeGreaterThanOrEqual(0);
      expect(parse, `${rel}: no parse`).toBeGreaterThan(gate);
    }
  });

  it("the rejection mirrors the auth family's exact 400 form", () => {
    for (const rel of ROUTES) {
      const src = stripComments(read(rel) ?? "");
      expect(src, rel).toContain(
        'if (isBodyTooLarge(req)) return ERR.BAD_REQUEST("Request body too large");',
      );
    }
  });
});

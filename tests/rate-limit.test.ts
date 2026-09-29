import { describe, expect, it } from "vitest";
import { rateLimit, sweepRateLimits, clientKey } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows up to the limit then blocks", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 10; i += 1) {
      expect(rateLimit(key, 10, 60_000).allowed).toBe(true);
    }
    const blocked = rateLimit(key, 10, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("tracks remaining quota", () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 3, 60_000);
    rateLimit(key, 3, 60_000);
    expect(rateLimit(key, 3, 60_000).remaining).toBe(0);
  });

  it("isolates keys", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).allowed).toBe(false);
    expect(rateLimit(b, 1, 60_000).allowed).toBe(true);
  });

  it("sweeps expired buckets", () => {
    const key = `sweep-${Math.random()}`;
    rateLimit(key, 1, -1); // already expired window
    sweepRateLimits();
    expect(rateLimit(key, 1, 60_000).allowed).toBe(true);
  });
});

describe("clientKey", () => {
  it("prefers the first x-forwarded-for entry", () => {
    const req = new Request("http://x", {
      headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" },
    });
    expect(clientKey(req)).toBe("203.0.113.7");
  });

  it("falls back to unknown", () => {
    expect(clientKey(new Request("http://x"))).toBe("unknown");
  });
});

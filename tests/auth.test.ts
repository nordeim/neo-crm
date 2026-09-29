import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword, signSession, verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

describe("password hashing", () => {
  it("round-trips a password", () => {
    const stored = hashPassword("Sup3rSecret!");
    expect(stored.startsWith("scrypt:")).toBe(true);
    expect(verifyPassword("Sup3rSecret!", stored)).toBe(true);
  });

  it("rejects a wrong password", () => {
    const stored = hashPassword("Sup3rSecret!");
    expect(verifyPassword("wrong", stored)).toBe(false);
  });

  it("produces unique salts for identical passwords", () => {
    expect(hashPassword("same")).not.toBe(hashPassword("same"));
  });

  it("rejects malformed stored hashes", () => {
    expect(verifyPassword("x", "not-a-hash")).toBe(false);
    expect(verifyPassword("x", "bcrypt:abc:def")).toBe(false);
    expect(verifyPassword("x", "scrypt:only-two")).toBe(false);
  });
});

describe("session tokens", () => {
  it("signs and verifies a session", () => {
    const token = signSession("user_123");
    const payload = verifySessionToken(token);
    expect(payload?.uid).toBe("user_123");
    expect(typeof payload?.exp).toBe("number");
  });

  it("rejects tampered signatures", () => {
    const token = signSession("user_123");
    const tampered = `${token.slice(0, -4)}dead`;
    expect(verifySessionToken(tampered)).toBeNull();
  });

  it("rejects expired tokens", () => {
    const now = Date.now();
    const token = signSession("user_123", now - 8 * 24 * 60 * 60 * 1000); // 8 days ago
    expect(verifySessionToken(token, now)).toBeNull();
  });

  it("rejects garbage tokens", () => {
    expect(verifySessionToken(null)).toBeNull();
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken("no-dot")).toBeNull();
    expect(verifySessionToken("....")).toBeNull();
  });

  it("exports the expected cookie name", () => {
    expect(SESSION_COOKIE).toBe("neo_session");
  });
});

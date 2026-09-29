import { describe, expect, it } from "vitest";
import { avatarTextColor, initialsOf } from "@/components/ui/avatar";

describe("initialsOf", () => {
  it("uses the first letter of a single word", () => {
    expect(initialsOf("sepnetflix2023")).toBe("S");
  });

  it("combines first and last words of multi-word names", () => {
    expect(initialsOf("Sara Chen")).toBe("SC");
    expect(initialsOf("Omar Haddad")).toBe("OH");
  });

  it("handles null/empty safely", () => {
    expect(initialsOf(null)).toBe("?");
    expect(initialsOf("   ")).toBe("?");
  });
});

describe("avatarTextColor", () => {
  it("keeps white text on saturated brand colors", () => {
    expect(avatarTextColor("#2563eb")).toBe("#ffffff");
    expect(avatarTextColor("#0891b2")).toBe("#ffffff");
  });

  it("switches to dark ink on light backgrounds like the reference grey avatar", () => {
    expect(avatarTextColor("#e5e7eb")).toBe("#374151");
    expect(avatarTextColor("#f3f4f6")).toBe("#374151");
  });
});

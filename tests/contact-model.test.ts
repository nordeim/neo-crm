import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-28 pins (S28-P1): the CONTACT model layer — the reference's
// bundle-extracted vocabularies. The decisive findings:
//
// 1. The reference's contact PRIORITY vocabulary is Key / Standard /
//    At Risk (NOT our inherited hot/warm/cold — that set belongs to the
//    LEAD temperature). Badge map: Key=amber-100/amber-800/amber-300,
//    Standard=blue-100/blue-800/blue-300, At Risk=red-100/red-800/red-300.
// 2. The contact ROLE is a first-class field with the 5-option vocabulary
//    Decision Maker / Key Contact / Influencer / End User / Other — an
//    INLINE select in the table row (placeholder "Set role").
// 3. ENGAGEMENT_LEVEL High/Medium/Low drives the 3-bar cell (w-2 h-6
//    rounded-full; High=3 green-500, Medium=2 yellow-500, Low=1 red-500,
//    unfilled bg-gray-200 — the TABLE variant; the slide-over uses the
//    -600 solids).
// 4. The SOURCE stores RAW values (call/email/website/partner/referral);
//    the emoji strings are CREATE-DIALOG LABELS ONLY. The edit dialog's
//    source select is PLAIN (no emojis).
// 5. The ce() last-activity formatter: Never / Today / "1 day ago" /
//    "N days ago" (<30) / "N months ago" (floor 30).
// 6. COMPANY_SIZE stores the filter's exact strings "Small (1-50)" /
//    "Medium (51-500)" / "Large (500+)".

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const constants = () => stripComments(read("src/lib/constants.ts") ?? "");
const schema = () => read("prisma/schema.prisma") ?? "";

describe("session-28: the contact priority vocabulary (Key/Standard/At Risk)", () => {
  it("CONTACT_PRIORITY_META carries the three-state map with the reference's badge classes", async () => {
    const src = constants();
    const i = src.indexOf("CONTACT_PRIORITY_META");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 900);
    expect(block).toMatch(/Key:\s*"bg-amber-100 text-amber-800 border-amber-300"/);
    expect(block).toMatch(/Standard:\s*"bg-blue-100 text-blue-800 border-blue-300"/);
    expect(block).toMatch(/"At Risk":\s*"bg-red-100 text-red-800 border-red-300"/);
  });

  it("the prisma Contact model carries role/engagementLevel/companySize/photoUrl", () => {
    const src = schema();
    const i = src.indexOf("model Contact");
    const block = src.slice(i, src.indexOf("}", i));
    expect(block).toContain("role");
    expect(block).toContain("engagementLevel");
    expect(block).toContain("companySize");
    expect(block).toContain("photoUrl");
    expect(block).toMatch(/priority\s+String\s+@default\("Standard"\)/);
  });
});

describe("session-28: the role + engagement + company-size vocabularies", () => {
  it("CONTACT_ROLES is the five-option select vocabulary", () => {
    const src = constants();
    const i = src.indexOf("CONTACT_ROLES");
    const block = src.slice(i, src.indexOf("]", i));
    expect(block).toContain('"Decision Maker"');
    expect(block).toContain('"Key Contact"');
    expect(block).toContain('"Influencer"');
    expect(block).toContain('"End User"');
    expect(block).toContain('"Other"');
  });

  it("ENGAGEMENT_LEVELS is High/Medium/Low", () => {
    const src = constants();
    const i = src.indexOf("ENGAGEMENT_LEVELS");
    const block = src.slice(i, src.indexOf("]", i));
    expect(block).toContain('"High"');
    expect(block).toContain('"Medium"');
    expect(block).toContain('"Low"');
  });

  it("COMPANY_SIZES stores the filter's exact strings", () => {
    const src = constants();
    const i = src.indexOf("COMPANY_SIZES");
    const block = src.slice(i, src.indexOf("]", i));
    expect(block).toContain('"Small (1-50)"');
    expect(block).toContain('"Medium (51-500)"');
    expect(block).toContain('"Large (500+)"');
  });

  it("the engagement bar classes pin the table variant (500s + shadow-sm + gray-200 unfilled)", () => {
    const src = constants();
    const i = src.indexOf("ENGAGEMENT_BARS");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 500);
    expect(block).toMatch(/High.*bg-green-500/);
    expect(block).toMatch(/Medium.*bg-yellow-500/);
    expect(block).toMatch(/Low.*bg-red-500/);
    expect(block).toMatch(/empty.*bg-gray-200/);
  });
});

describe("session-28: the source value/label split", () => {
  it("CONTACT_SOURCE_OPTIONS pairs raw values with the emoji labels", () => {
    const src = constants();
    const i = src.indexOf("CONTACT_SOURCE_OPTIONS");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, src.indexOf("]", src.indexOf("]", i) + 1) + 1);
    expect(block).toMatch(/value:\s*"call",\s*label:\s*"📞 Phone Call"/);
    expect(block).toMatch(/value:\s*"email",\s*label:\s*"✉️ Email"/);
    expect(block).toMatch(/value:\s*"website",\s*label:\s*"🌐 Website"/);
    expect(block).toMatch(/value:\s*"partner",\s*label:\s*"🤝 Partner Referral"/);
    expect(block).toMatch(/value:\s*"referral",\s*label:\s*"👥 Personal Referral"/);
  });
});

describe("session-28: the ce() last-activity formatter", () => {
  it("lastActivityCe renders Never/Today/1 day ago/N days ago/N months ago", async () => {
    const mod = await import("../src/lib/constants");
    const ce = (mod as { lastActivityCe: (d: Date | string | null | undefined, now?: Date | number) => string }).lastActivityCe;
    expect(ce(null)).toBe("Never");
    const now = new Date("2026-10-02T12:00:00Z");
    expect(ce(new Date("2026-10-02T10:00:00Z"), now)).toBe("Today");
    expect(ce(new Date("2026-10-01T10:00:00Z"), now)).toBe("1 day ago");
    expect(ce(new Date("2026-09-28T10:00:00Z"), now)).toBe("4 days ago");
    expect(ce(new Date("2026-08-25T10:00:00Z"), now)).toBe("1 months ago");
    expect(ce(new Date("2026-05-02T10:00:00Z"), now)).toBe("5 months ago");
  });

  it("the contacts page imports lastActivityCe for the Last Activity column", () => {
    const src = stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
    expect(src).toMatch(/lastActivityCe/);
  });
});

describe("session-28: the account edit vocabulary + the health/tier badge maps", () => {
  it("the account Status select maps over ACCOUNT_STATUSES (the live wce wiring)", () => {
    // Session-54 (S54-P2) re-anchor: the ACCOUNT_EDIT_STATUSES constant
    // (["active","inactive","prospect"]) was a stale s28 decode with zero
    // src consumers — the LIVE Edit Account select maps over
    // ACCOUNT_STATUSES (active/inactive/churned) through
    // ACCOUNT_STATUS_META labels. The constant retired with this pin's
    // old subject; this is the honest s49-style re-anchor.
    const src = stripComments(read("src/components/shared/entity-dialogs.tsx") ?? "");
    expect(src).toMatch(/\{ACCOUNT_STATUSES\.map\(\(s\) =>/);
    expect(src).toMatch(/\{ACCOUNT_STATUS_META\[s\]\.label\}/);
    expect(src).not.toMatch(/\bACCOUNT_EDIT_STATUSES\b/);
  });

  it("ACCOUNT_HEALTH_BADGE pins the H map (green/yellow/red with the gray fallback)", () => {
    const src = constants();
    const i = src.indexOf("ACCOUNT_HEALTH_BADGE");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 400);
    expect(block).toMatch(/Healthy.*bg-green-100 text-green-800/);
    expect(block).toMatch(/"At Risk".*bg-yellow-100 text-yellow-800/);
    expect(block).toMatch(/"Needs Attention".*bg-red-100 text-red-800/);
  });

  it("ACCOUNT_TIER_BADGE pins the B map (Key=yellow, A=green, B=blue, C=gray)", () => {
    const src = constants();
    const i = src.indexOf("ACCOUNT_TIER_BADGE");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 400);
    expect(block).toMatch(/Key.*bg-yellow-100 text-yellow-800/);
    expect(block).toMatch(/\bA:.*bg-green-100 text-green-800/);
    expect(block).toMatch(/\bB:.*bg-blue-100 text-blue-800/);
    expect(block).toMatch(/\bC:.*bg-gray-100 text-gray-800/);
  });
});

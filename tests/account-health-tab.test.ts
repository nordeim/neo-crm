import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-27 pins (S27-P1/P2): the Account Health tab end-to-end — the
// s45 "Next" pointer, data-gated for 22 sessions until the bundle gave up
// the reference's `r3e` component. The reference COMPUTES health
// client-side (it is NOT the stored status distribution our API shipped):
//
//   daysSinceActivity = latest related activity ? diffDays(now, it) : 999
//   health = (days > 60 || account has a closed_lost deal) ? "At Risk"
//          : days > 30                              ? "Needs Attention"
//          :                                          "Healthy"
//
// The four surfaces: a full PIE (outerRadius 100, `${name}: ${value}`
// labels, cells #10b981/#f59e0b/#ef4444, NO legend), a horizontal Top-10
// by revenue (sorted DESC), the red-tinted At Risk table (bg-red-50 rows,
// "Nd ago"/"Never", the bg-red-100 text-red-800 "At Risk" badge), and the
// Account Summary with outline-Badge statuses.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const health = () => {
  const src = read("src/lib/account-health.ts");
  return src ? stripComments(src) : null;
};

describe("session-27: the computed account-health seam (src/lib/account-health.ts)", () => {
  it("the seam file exists", () => {
    expect(health()).not.toBeNull();
  });

});

// ---- behavioral tests (import the seam) ----

describe("session-27: accountHealth() behavior", () => {
  it("an account with activity 10 days ago and no lost deals is Healthy", async () => {
    const m = await import("../src/lib/account-health");
    const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
    const h = m.accountHealth({
      lastActivityAt: daysAgo(10),
      hasLostDeals: false,
    });
    expect(h.health).toBe("Healthy");
    expect(h.daysSinceActivity).toBe(10);
  });

  it("an account with activity 35 days ago and no lost deals is Needs Attention", async () => {
    const m = await import("../src/lib/account-health");
    const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
    const h = m.accountHealth({ lastActivityAt: daysAgo(35), hasLostDeals: false });
    expect(h.health).toBe("Needs Attention");
  });

  it("an account with activity 75 days ago is At Risk (the >60 rule)", async () => {
    const m = await import("../src/lib/account-health");
    const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
    const h = m.accountHealth({ lastActivityAt: daysAgo(75), hasLostDeals: false });
    expect(h.health).toBe("At Risk");
  });

  it("an account with a closed_lost deal is At Risk even with recent activity", async () => {
    const m = await import("../src/lib/account-health");
    const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
    const h = m.accountHealth({ lastActivityAt: daysAgo(5), hasLostDeals: true });
    expect(h.health).toBe("At Risk");
  });

  it("an account with NO activity ever carries daysSinceActivity 999 (the reference's sentinel)", async () => {
    const m = await import("../src/lib/account-health");
    const h = m.accountHealth({ lastActivityAt: null, hasLostDeals: false });
    expect(h.daysSinceActivity).toBe(999);
    expect(h.health).toBe("At Risk");
  });

  it("lastActivityText renders 'Never' at the 999 sentinel and 'Nd ago' otherwise", async () => {
    const m = await import("../src/lib/account-health");
    expect(m.lastActivityText(999)).toBe("Never");
    expect(m.lastActivityText(12)).toBe("12d ago");
    expect(m.lastActivityText(0)).toBe("0d ago");
  });

  it("the health vocabulary + pie palette are the reference's exact sets", async () => {
    const m = await import("../src/lib/account-health");
    expect(m.HEALTH_STATES).toEqual(["Healthy", "Needs Attention", "At Risk"]);
    expect(m.HEALTH_PIE_FILLS).toEqual(["#10b981", "#f59e0b", "#ef4444"]);
  });
});

describe("session-27: the API's account-health data (S27-P1)", () => {
  it("accountHealth ships the COMPUTED health distribution (not the status distribution)", () => {
    const route = stripComments(read("src/app/api/reports/route.ts") ?? "");
    expect(route).toMatch(/accountHealth\(/);
    expect(route).not.toMatch(/ACCOUNT_STATUS_META\[s\]\.color/);
    const ix = route.indexOf("const lostAccountIds");
    const block = route.slice(ix, ix + 1000);
    expect(block).toMatch(/accountHealth\(/);
    expect(block).toMatch(/HEALTH_STATES/);
  });

  it("topAccounts SORTS by revenue desc before the slice (the reference's sort)", () => {
    const route = stripComments(read("src/app/api/reports/route.ts") ?? "");
    const ix = route.indexOf("const lostAccountIds");
    const block = route.slice(ix, ix + 1400);
    expect(block).toMatch(/sort\(/);
  });

  it("atRiskAccounts derives from the computed health (slice 20) and ships daysSinceActivity", () => {
    const route = stripComments(read("src/app/api/reports/route.ts") ?? "");
    const ix = route.indexOf("const lostAccountIds");
    const block = route.slice(ix, ix + 1600);
    expect(block).toMatch(/slice\(0, 20\)/);
    expect(block).toMatch(/daysSinceActivity/);
  });
});

describe("session-27: the tab-5 rendering (S27-P2)", () => {
  it("the At Risk table rows carry bg-red-50 + the 'Nd ago'/'Never' text + the red 'At Risk' badge", () => {
    const page = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    const region = page.slice(page.indexOf("At Risk Accounts"), page.indexOf("At Risk Accounts") + 2000);
    expect(region).toMatch(/bg-red-50/);
    expect(region).toMatch(/lastActivityText/);
    expect(region).toMatch(/bg-red-100 text-red-800/);
    expect(region).toMatch(/>At Risk</);
  });

  it("the Account Summary renders outline-Badge statuses and the '-' industry fallback", () => {
    const page = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    const region = page.slice(page.indexOf("Account Summary"), page.indexOf("Account Summary") + 1600);
    expect(region).toMatch(/variant="outline"/);
    expect(region).toMatch(/\|\| "-"/);
  });

  it("the health distribution is the LabelPieChart with the HEALTH_PIE_FILLS palette", () => {
    const page = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    const region = page.slice(page.indexOf("Account Health Distribution") - 300, page.indexOf("Account Health Distribution") + 600);
    expect(region).toMatch(/HEALTH_PIE_FILLS/);
  });
});

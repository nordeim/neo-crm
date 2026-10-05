import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-47 pins (S47-P2): the account-insights icon vocabulary — the
// F-47b audit. The dialog's comparison sites (s48 correction, N-48a:
// exactly FOUR — the tint ternary ×2 + the icon ternary ×2; the
// session-47 records said "six (×3 each)" — the fix and these pins were
// unaffected, they assert presence, not count) compared Capitalized
// "Email"/"Call" against our lowercase Activity.type vocabulary
// (ACTIVITY_TYPES call/email/meeting/whatsapp/task/note — the seed and
// every other surface lowercase), so both branches were DEAD with real
// data: every activity row rendered the purple CalendarDays fallback.
// The REFERENCE stores Capitalized types (bundle: ["Call","Email",
// "Meeting","Task","Note"]), so ITS comparisons match ITS storage — our
// clone pinned the lowercase vocabulary (s28, tested), so OUR dialog must
// compare lowercase to render the same icons the reference renders with
// its own data. The tint classes + the Mail/Phone/CalendarDays mapping
// stay VERBATIM (pin-pinned by account-surfaces.test.ts:122-127).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const insights = () =>
  stripComments(read("src/components/accounts/account-insights-dialog.tsx") ?? "");

describe("session-47: the insights icon vocabulary (S47-P2, F-47b)", () => {
  it("the activity-type comparisons match our lowercase vocabulary", () => {
    const src = insights();
    const region = src.slice(src.indexOf("accountActivities.slice"), src.indexOf("Close Date:"));
    expect(region).toMatch(/a\.type === "email"/);
    expect(region).toMatch(/a\.type === "call"/);
    // The Capitalized forms are gone (dead against our storage).
    expect(region).not.toMatch(/a\.type === "Email"/);
    expect(region).not.toMatch(/a\.type === "Call"/);
  });

  it("the tint classes + the icon mapping stay verbatim (the s28 mirror)", () => {
    const src = insights();
    expect(src).toMatch(/bg-blue-100 text-blue-600/);
    expect(src).toMatch(/bg-green-100 text-green-600/);
    expect(src).toMatch(/bg-purple-100 text-purple-600/);
    // Mail for email, Phone for call, CalendarDays for the rest.
    expect(src).toMatch(/<Mail className="w-5 h-5" \/>/);
    expect(src).toMatch(/<Phone className="w-5 h-5" \/>/);
    expect(src).toMatch(/<CalendarDays className="w-5 h-5" \/>/);
  });
});

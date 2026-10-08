import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-84 parity suite (the 84-c accounts insights-dialog family
// rotation): every pin mirrors a BUNDLE-DECODED reference fact (the
// fresh-fetched index-DZ-xbrIm.js, md5 a70a637… — the 55th consecutive
// stable bundle). The session_163 suggested target — "the standing
// unresolvable-in-bundle icon identities" — resolved this session at
// the aliases' own tr() assignment lines (the s76 playbook trick):
//   Wc=tr("TrendingUp",bJ)  op=tr("Target",vJ)  q0=tr("Users",SJ)
//   nf=tr("Mail",JQ)  af=tr("Phone",iJ)  qd=tr("Calendar",jQ)
//
// The reference facts pinned here (all decoded this session):
// - the three stat cards' icons: TRENDING-UP on the blue Total Revenue
//   card, TARGET on the green Open Deals card, USERS on the purple
//   Contacts card (ours shipped Users/Phone/Users — the s28-era decode
//   never resolved the aliases; the LIVE pre-fix probe measured
//   lucide-users 24x24 on the blue card + lucide-phone on the green).
// - the contacts initials box is the STOCK AVATAR PRIMITIVE: Ll = the
//   Radix Avatar.Root wrapper ("relative flex h-10 w-10 shrink-0
//   overflow-hidden rounded-full") with the tint classes appended
//   ("w-10 h-10 bg-blue-100 text-blue-600 flex items-center
//   justify-center text-sm font-semibold") — twMerge resolves the pair
//   to a 40x40 ROUNDED-FULL CIRCLE; ours shipped a bare SQUARE div
//   (LIVE pre-fix: radius 0px, position static, overflow visible).
//   The topbar's s17 two-level avatar is the house stock-mirror
//   precedent.
// - the initials FORMULA is the reference's verbatim
//   d.name.split(" ").map(g=>g[0]).join("") — NO .toUpperCase(), NO
//   fallback (ours shipped a toUpperCase helper — behavior-identical
//   on the capitalized seed, mirrored for source parity; the topbar's
//   "the FORMULA is the parity" precedent).
// - the deals badge is the zn Badge with ONLY "mt-1 text-xs" — the
//   DEFAULT dark variant (bg-neutral-900 text-neutral-50 under the s66
//   stock mirror) + the RAW stage slug. The colored-map family is the
//   reference's OWN DASHBOARD badge (its Recent Deals zn rides its
//   P[N.stage] map) — NOT its insights badge; our dashboard surface
//   keeps the map (pin-pinned by dashboard-contracts).
// - the activities fallback icon is qd = CALENDAR — the blank-body
//   glyph (M8 2v4 + M16 2v4 + rect(18x18 at 3,4 rx 2) + M3 10h18),
//   the same glyph the s17 sidebar census fixed; ours shipped
//   CalendarDays (the s28 header comment's own claim misread the
//   alias — LIVE pre-fix: lucide-calendar-days 20px on the meeting
//   row).
//
// Documented parities pinned green-by-design (computed-equal, no code
// change): the vo/xo/yo dialog chrome (the s15 stock family via our
// ui/dialog); the ot Card + ct CardContent trio (p-4 text-center
// twMerge-resolves over p-6 pt-0 — the s83 precedent); the grid
// grid-cols-3 gap-4 mb-6 KPI grid + the three card bodies; the
// $X.XM + notLostCount + contacts-count value formulas (the s31
// account_name join + the s28 notLostCount quirk documented); the
// i1/Gg/ta/ra tabs construction (our segmented variant + cols=3 —
// the track's twMerge-resolved grid form + the stock trigger's
// data-[state=active] trio); the activities rows' construction + the
// F-47b lowercase tint ternaries + the N-48b ACTIVITY_TYPE_META badge
// display-case; the empty-state trio verbatim; the deals rows' "Close
// Date: " + the open-stage filter + the $X,XXX amount form.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

// The hazard comments in the touched file name the retired surfaces by
// design (v4 scans comments), so the NEGATIVE pins read the
// comment-stripped source (the s81 stripComments convention).
const insightsSrc = () => stripComments(read("src/components/accounts/account-insights-dialog.tsx") ?? "");
const insightsRaw = () => read("src/components/accounts/account-insights-dialog.tsx") ?? "";

describe("session-84: the stat-card icons (M-84c1 + M-84c2)", () => {
  it("the Total Revenue card ships TRENDING-UP (the reference's Wc)", () => {
    const src = insightsSrc();
    expect(src).toContain('<TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />');
  });

  it("the Open Deals card ships TARGET (the reference's op)", () => {
    const src = insightsSrc();
    expect(src).toContain('<Target className="w-6 h-6 mx-auto mb-2 text-green-600" />');
  });

  it("the Contacts card keeps USERS (the reference's q0)", () => {
    const src = insightsSrc();
    expect(src).toContain('<Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />');
  });

  it("the s28 misreads are gone: no Users-on-blue, no Phone-on-green", () => {
    const src = insightsSrc();
    // Pre-fix ours rendered Users on the blue revenue card + Phone on
    // the green deals card (LIVE: lucide-users/lucide-phone 24x24).
    expect(src).not.toContain('<Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />');
    expect(src).not.toContain('<Phone className="w-6 h-6 mx-auto mb-2 text-green-600" />');
  });
});

describe("session-84: the contacts initials box — the stock Avatar shape (M-84c3)", () => {
  it("the box is the ROUNDED-FULL stock Avatar construction", () => {
    const src = insightsSrc();
    // The reference's twMerge-resolved computed form: the Ll base
    // ("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full")
    // + the appended tint/flex classes (grid-position dedupe).
    expect(src).toContain(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-blue-100 text-blue-600 items-center justify-center text-sm font-semibold",
    );
  });

  it("the square-div form is gone", () => {
    const src = insightsSrc();
    // The pre-fix bare div: "w-10 h-10 bg-blue-100 text-blue-600 flex
    // items-center justify-center text-sm font-semibold" — LIVE
    // pre-fix: radius 0px (a SQUARE where the reference computes a
    // 40x40 CIRCLE).
    expect(src).not.toContain('className="w-10 h-10 bg-blue-100 text-blue-600');
  });

  it("the initials formula is the reference's verbatim split/map/join — NO uppercase", () => {
    const src = insightsSrc();
    // d.name.split(" ").map(g=>g[0]).join("") — the reference's own
    // expression (the topbar's "the FORMULA is the parity" precedent).
    expect(src).toContain('c.name.split(" ").map((w) => w[0]).join("")');
    expect(src).not.toContain("toUpperCase");
  });
});

describe("session-84: the deals badge — the bare DEFAULT variant (L-84c4)", () => {
  it("the badge is the bare default-variant zn form: only mt-1 text-xs + the raw slug", () => {
    const src = insightsSrc();
    expect(src).toContain('<Badge className="mt-1 text-xs">{d.stage}</Badge>');
  });

  it("the OPP_STAGE_META color map is gone from the file (the dashboard-only family)", () => {
    const src = insightsSrc();
    // The colored map is the reference's DASHBOARD badge (its Recent
    // Deals P[N.stage]) — NOT its insights badge; our dashboard keeps
    // the map (pin-pinned by dashboard-contracts).
    expect(src).not.toContain("OPP_STAGE_META");
  });
});

describe("session-84: the activities fallback icon — the blank-body Calendar (L-84c5)", () => {
  it("the fallback ships CALENDAR (the reference's qd — the s17 sidebar glyph)", () => {
    const src = insightsSrc();
    expect(src).toContain('<Calendar className="w-5 h-5" />');
  });

  it("CalendarDays is gone from the file", () => {
    const src = insightsSrc();
    // The s28 header comment's own "CalendarDays" claim misread the
    // alias (LIVE pre-fix: lucide-calendar-days 20px on the meeting
    // row where the reference renders the blank-body Calendar).
    expect(src).not.toContain("CalendarDays");
  });
});

describe("session-84: the standing computed-equal surfaces (green-by-design)", () => {
  it("the shell + header + KPI grid construction", () => {
    const src = insightsSrc();
    expect(src).toMatch(/max-w-3xl max-h-\[80vh\] overflow-y-auto/);
    expect(src).toContain('<DialogTitle className="text-xl">{account.name}</DialogTitle>');
    expect(src).toContain('<p className="text-sm text-gray-500">{account.industry}</p>');
    expect(src).toContain("grid grid-cols-3 gap-4 mb-6");
    expect(src).toContain('<CardContent className="p-4 text-center">');
  });

  it("the status badge's conditional tint pair", () => {
    const src = insightsSrc();
    expect(src).toContain("bg-green-100 text-green-800");
    expect(src).toContain("bg-gray-100 text-gray-800");
  });

  it("the three stat-value formulas (the $X.XM + notLostCount quirk + the contacts count)", () => {
    const src = insightsSrc();
    expect(src).toContain("${(wonRevenue / 1e6).toFixed(1)}M");
    expect(src).toContain('o.stage !== "closed_lost").length');
    expect(src).toContain("{accountContacts.length}");
  });

  it("the tabs: the segmented variant + cols=3 + the three labels + the default", () => {
    const src = insightsSrc();
    expect(src).toContain('variant="segmented"');
    expect(src).toContain("cols={3}");
    expect(src).toContain('{ id: "activities", label: "Recent Activities" }');
    expect(src).toContain('{ id: "contacts", label: "Contacts" }');
    expect(src).toContain('{ id: "deals", label: "Open Deals" }');
    expect(src).toContain('React.useState("activities")');
  });

  it("the activities rows: the row + icon-box classes + the F-47b lowercase ternaries", () => {
    const src = insightsSrc();
    expect(src).toContain("flex items-start gap-3 p-3 border rounded-lg");
    expect(src).toContain("w-10 h-10 rounded-lg flex items-center justify-center");
    expect(src).toContain('a.type === "email"');
    expect(src).toContain('a.type === "call"');
    expect(src).toContain('<Mail className="w-5 h-5" />');
    expect(src).toContain('<Phone className="w-5 h-5" />');
  });

  it("the activities badge display-case (the N-48b standing decision)", () => {
    const src = insightsSrc();
    expect(src).toContain("{ACTIVITY_TYPE_META[a.type]?.label ?? a.type}");
  });

  it("the empty-state trio verbatim", () => {
    const src = insightsSrc();
    expect(src).toContain("No recent activities");
    expect(src).toContain("No contacts found");
    expect(src).toContain("No open deals");
  });

  it("the deals rows: the Close Date string + the open-stage filter + the amount form", () => {
    const src = insightsSrc();
    expect(src).toContain("Close Date:");
    expect(src).toContain('o.stage !== "closed_lost" && o.stage !== "closed_won"');
    expect(src).toContain("${(d.amount || 0).toLocaleString()}");
  });

  it("the s31 account_name join + the s28 relational superset (documented standing)", () => {
    const src = insightsSrc();
    expect(src).toContain("o.accountName === account.name");
    expect(src).toContain("a.accountId === account.id");
    expect(src).toContain("c.accountId === account.id");
  });

  it("the s28 header comment no longer carries the four misreads", () => {
    // The doc-carrier genus (the N-50a family): the s28 comment's own
    // anatomy record named CalendarDays + the bare initials box; the
    // re-derivation documents the stock-Avatar box + the blank-body
    // Calendar + the TrendingUp/Target/Users identities + the bare
    // default badge.
    const raw = insightsRaw();
    expect(raw).not.toContain("the initials box (w-10 h-10 bg-blue-100 text-blue-600)");
    expect(raw).toContain("TrendingUp");
    expect(raw).toContain("the stock Avatar");
  });
});

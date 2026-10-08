import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-82 pins: the contacts-PANEL family parity suite (the 82-c
// fresh-eyes rotation on the contacts slide-over's deeper chrome — the
// session_159 suggested target: s28 decoded the Pke structure + s75
// walked the filter rail, but nobody had ever walked the panel's own
// card bodies + the activity/deal constructions + the icon identities
// + the Button icon-text mechanics they ride). Every pin below is
// decoded from the byte-stable reference bundle (md5-exact for the
// 53rd consecutive session) + LIVE-probed on our dev server.
//
// The decisive contracts:
// - BUTTON-ICON MARGINS: the reference's stock Button base (the
//   bundle's `uie`, decoded verbatim) carries
//   `[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` and
//   NO svg-margin arms — its icon-text spacing rides EACH SURFACE'S
//   OWN svg margin class (`w-4 h-4 mr-2` on the entire header/export
//   family; `w-4 h-4 mr-1` on the compact family — the slide-over's
//   Call/Email/WhatsApp, the mobile cards, the Check-as-completed
//   ghost). OURS shipped the s9 `BUTTON_BASE.iconGap` invention
//   (`[&_svg]:mr-2 [&_svg:only-child]:mr-0`) whose cascade BREAKS the
//   per-surface margins: on svg+BARE-TEXT buttons the svg is the only
//   ELEMENT child (text labels are text nodes), so the only-child
//   mr-0 (specificity 0,2,1) nullifies the svg's own mr-1/mr-2
//   (0,1,0) — LIVE-measured 0px margin on our contacts header Export
//   CSV + New Contact (the reference's mr-2 family computes 8px: our
//   total gap 8px vs its 16px) and on the panel's Call button (the
//   mr-1 family: 8px vs 12px). The fix retires the arms + restores
//   the per-surface classes (16 sites gain their own mr-2).
// - THE ACTIVITY ICON: the reference's slide-over activity card
//   renders `AC` = lucide Activity (the bundle:
//   `AC=tr("Activity",vQ)` with the pulse path
//   `M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48
//   0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2`
//   — our lucide-react's Activity path is byte-identical). OURS
//   rendered Zap (the lightning bolt) — the wrong glyph on every
//   activity card in the slide-over; the s76 alias rotation resolved
//   the activities page's families but never walked this card.
// - THE ACTIVITY-DATE FORMAT: the reference renders
//   `st(l.date).format("MMM D, YYYY h:mm A")` — date + TIME (e.g.
//   "Oct 5, 2026 10:00 AM"); ours rendered "MMM D, YYYY" (no time).
// - THE DEALS AMOUNT: the reference renders the jsx array
//   `["$",(f=l.amount)==null?void 0:f.toLocaleString()]` — "$" +
//   amount?.toLocaleString() with NO space and NO 0-fallback (a null
//   amount renders "$" alone); ours rendered "$ 1,234"/"$ 0".
//
// Documented parities pinned green-by-design (computed-equal, no code
// change): the panel root/sticky header/hero/badge pair/engagement
// bars (the constants byte-equal to the decoded maps); the
// grid-cols-3 action row; the Contact Information icon rows; the
// tabs track (the Gg base + `grid w-full grid-cols-3` — twMerge
// resolves the display conflict, computed-equal); the three empty
// states; the already-per-surface mr-1/mr-2 sites (6 + 5).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

// The hazard comments in the touched files name the retired classes by
// design (v4 scans comments), so the NEGATIVE pins read the
// comment-stripped source (the s81 stripComments convention).
const panelSrc = () => stripComments(read("src/components/contacts/contact-detail-panel.tsx") ?? "");
const panelRaw = () => read("src/components/contacts/contact-detail-panel.tsx") ?? "";
const buttonSrc = () => stripComments(read("src/components/ui/button.tsx") ?? "");
const formatSrc = () => stripComments(read("src/lib/format.ts") ?? "");
const topbarSrc = () => read("src/components/layout/topbar.tsx") ?? "";
const page = (rel: string) => stripComments(read(rel) ?? "");

async function layout() {
  return await import("@/lib/page-layout");
}

describe("session-82: the Button-icon-margin re-derivation (M-82c1)", () => {
  it("the Button base ships NO svg-margin arms (the reference's uie verbatim)", () => {
    // The reference's base: pointer-events-none + size-4 + shrink-0
    // ONLY. The s9 iconGap cascade ([&_svg]:mr-2 +
    // [&_svg:only-child]:mr-0) nullified every per-surface svg margin
    // on bare-text buttons (LIVE-measured 0px) — retired.
    expect(buttonSrc()).not.toContain("[&_svg]:mr-2");
    expect(buttonSrc()).not.toContain("[&_svg:only-child]");
    expect(buttonSrc()).not.toContain("iconGap");
  });

  it("the stock size cascade stays (the reference's own [&_svg]:size-4)", () => {
    // button.tsx consumes the record field; the literal lives in
    // page-layout.ts (BUTTON_BASE.svgSize) — pin BOTH.
    expect(buttonSrc()).toContain("BUTTON_BASE.svgSize");
    expect(buttonSrc()).toContain("[&_svg]:shrink-0");
    expect(buttonSrc()).toContain("[&_svg]:pointer-events-none");
  });

  it("the BUTTON_BASE record retires the iconGap field", async () => {
    const { BUTTON_BASE } = await layout();
    expect(BUTTON_BASE).not.toHaveProperty("iconGap");
    expect(BUTTON_BASE.svgSize).toBe("[&_svg]:size-4");
  });

  it("the topbar user button drops the mr-0 neutralizer (nothing left to neutralize)", async () => {
    const { TOPBAR_LAYOUT } = await layout();
    expect(TOPBAR_LAYOUT.userButton).toBe("flex items-center gap-1 sm:gap-2");
  });

  it("the header/export family: every text-button svg carries its own mr-2 (16 sites)", () => {
    // Each the reference's own per-surface class, bundle-decoded:
    // Ad/cs/IB/kB/Fy/FB + w-4 h-4 mr-2 on every header/export button.
    const dashboard = page("src/app/(app)/page.tsx");
    expect(dashboard).toMatch(/<Plus className="h-4 w-4 mr-2" \/> <span/);
    expect(dashboard).toMatch(/<Download className="h-4 w-4 mr-2" \/> <span/);

    const accounts = page("src/app/(app)/accounts/accounts-page.tsx");
    expect(accounts).toMatch(/<Download className="h-4 w-4 mr-2" \/> <span/);
    expect(accounts).toMatch(/<Plus className="h-4 w-4 mr-2" \/> New Account/);

    const contacts = page("src/app/(app)/contacts/contacts-page.tsx");
    expect(contacts).toMatch(/<Download className="h-4 w-4 mr-2" \/> Export CSV/);
    expect(contacts).toMatch(/<Scan className="h-4 w-4 mr-2" \/> <span/);
    expect(contacts).toMatch(/<Download className="h-4 w-4 mr-2" \/> <span/);
    expect(contacts).toMatch(/<Plus className="h-4 w-4 mr-2" \/> New Contact/);

    const leads = page("src/app/(app)/leads/leads-page.tsx");
    expect(leads).toMatch(/<Download className="h-4 w-4 mr-2" \/> Export/);
    expect(leads).toMatch(/<Plus className="h-4 w-4 mr-2" \/> New Lead/);

    const reports = page("src/app/(app)/reports/reports-page.tsx");
    expect(reports).toMatch(/<Bookmark className="h-4 w-4 mr-2" \/> Saved Reports/);
    expect(reports).toMatch(/<Download className="h-4 w-4 mr-2" \/> Export CSV/);
    expect(reports).toMatch(/<FileText className="h-4 w-4 mr-2" \/> Export PDF/);

    const settings = page("src/app/(app)/settings/settings-page.tsx");
    expect(settings).toMatch(/<Trash2 className="h-4 w-4 mr-2" \/> Reset All Data/);
  });

  it("the compact family keeps its mr-1 (the reference's own per-surface class)", () => {
    // The slide-over's Call/Email/WhatsApp + the mobile cards' Call/
    // Email + the Check-as-completed ghost — all `w-4 h-4 mr-1` in
    // the bundle; ours already carried them (they simply start
    // APPLYING once the cascade retires).
    expect(panelSrc()).toMatch(/<Phone className="w-4 h-4 mr-1" \/>Call/);
    expect(panelSrc()).toMatch(/<Mail className="w-4 h-4 mr-1" \/>Email/);
    expect(panelSrc()).toMatch(/<MessageCircle className="w-4 h-4 mr-1" \/>WhatsApp/);
    const contacts = page("src/app/(app)/contacts/contacts-page.tsx");
    expect(contacts).toMatch(/<Phone className="w-4 h-4 mr-1" \/>Call/);
    expect(contacts).toMatch(/<Mail className="w-4 h-4 mr-1" \/>Email/);
    const activities = page("src/app/(app)/activities/activities-page.tsx");
    expect(activities).toMatch(/<CircleCheck className="w-4 h-4 mr-1"/);
  });
});

describe("session-82: the panel activity-icon identity (M-82c2)", () => {
  it("the activity card renders lucide Activity (the bundle's AC, the pulse path)", () => {
    // AC=tr("Activity",vQ) — the pulse icon our lucide renders
    // byte-identical; Zap was the wrong glyph.
    expect(panelRaw()).toMatch(/\bActivity\b/);
    expect(panelSrc()).toMatch(/<Activity className="w-4 h-4 text-blue-600 mt-1" \/>/);
    expect(panelSrc()).not.toMatch(/<Zap /);
  });

  it("the Zap import retires from the panel", () => {
    expect(panelRaw()).not.toMatch(/import[\s\S]*?\bZap\b[\s\S]*?from "lucide-react"/);
    expect(panelRaw()).toMatch(/Activity,/);
  });
});

describe("session-82: the panel activity-date format (M-82c3)", () => {
  it("format.ts ships formatMonthDayYearTime (the MMM D, YYYY h:mm A form)", () => {
    expect(formatSrc()).toContain("export function formatMonthDayYearTime");
  });

  it("the worked examples: the moment format's exact output (independent literals)", async () => {
    const { formatMonthDayYearTime } = await import("@/lib/format");
    // Known-good literals worked from the moment format string, NOT
    // recomputed by the same code (the tautology guard).
    expect(formatMonthDayYearTime("2026-10-05T10:00:00")).toBe("Oct 5, 2026 10:00 AM");
    expect(formatMonthDayYearTime("2026-10-05T13:05:00")).toBe("Oct 5, 2026 1:05 PM");
    expect(formatMonthDayYearTime("2027-01-01T00:00:00")).toBe("Jan 1, 2027 12:00 AM");
    expect(formatMonthDayYearTime("2026-12-31T12:00:00")).toBe("Dec 31, 2026 12:00 PM");
    expect(formatMonthDayYearTime("2026-03-09T23:59:00")).toBe("Mar 9, 2026 11:59 PM");
  });

  it("the panel's activity card consumes the datetime seam (the old no-time mmmDyyyy retires from the card)", () => {
    expect(panelSrc()).toMatch(/formatMonthDayYearTime\(/);
    // The card's date line — the helper replaces the bare mmmDyyyy on
    // the ACTIVITY card only; the Last Activity row keeps the
    // reference's own date-only "MMM D, YYYY" (bundle:
    // .format("MMM D, YYYY")).
    const card = panelSrc().match(/formatMonthDayYearTime\([^)]*\)/);
    expect(card).not.toBeNull();
  });

  it("the Last Activity row keeps the date-only form (the reference's own split)", () => {
    expect(panelSrc()).toMatch(/mmmDyyyy\(contact\.lastActivityAt\)/);
  });
});

describe("session-82: the deals-card amount construction (L-82c4)", () => {
  it("the amount renders the reference's jsx array: bare $ + amount?.toLocaleString()", () => {
    // ["$", amount==null?void 0:amount.toLocaleString()] — NO space,
    // NO 0-fallback (a null amount renders "$" alone).
    expect(panelSrc()).toMatch(/\{"\$"\}\s*\{d\.amount == null \? undefined : d\.amount\.toLocaleString\(\)\}/);
    expect(panelSrc()).not.toMatch(/(\$ \{d\.amount|== null \? 0 :)/);
  });
});

describe("session-82: the email-row bare form (N-82c6)", () => {
  it("the Email value renders the raw field (the reference's bare e.email)", () => {
    expect(panelSrc()).toContain("{contact.email}");
    expect(panelSrc()).not.toMatch(/contact\.email \?\? "—"/);
  });
});

describe("session-82: the panel's standing parities (green-by-design anchors)", () => {
  it("the root: fixed top-0 right-0 h-full w-full md:w-[500px] + shadow-2xl + border-l", () => {
    const src = panelRaw();
    expect(src).toMatch(/fixed top-0 right-0 h-full w-full md:w-\[500px\] bg-white shadow-2xl z-50 overflow-y-auto border-l/);
  });

  it("the sticky header + the hero family (the w-20 gradient + first initial + the badge pair)", () => {
    const src = panelRaw();
    expect(src).toMatch(/sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10/);
    expect(src).toMatch(/w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full/);
    expect(src).toMatch(/text-2xl font-bold text-white/);
    expect(src).toContain('text-xl font-bold">Contact Details');
  });

  it("the engagement bars ride the constants (byte-equal to the decoded maps)", async () => {
    const { ENGAGEMENT_BARS_SOLID, engagementBarCount } = await import("@/lib/constants");
    expect(ENGAGEMENT_BARS_SOLID.High).toBe("bg-green-600");
    expect(ENGAGEMENT_BARS_SOLID.Medium).toBe("bg-yellow-600");
    expect(ENGAGEMENT_BARS_SOLID.Low).toBe("bg-red-600");
    expect(ENGAGEMENT_BARS_SOLID.empty).toBe("bg-gray-200");
    expect(engagementBarCount("High")).toBe(3);
    expect(engagementBarCount("Medium")).toBe(2);
    expect(engagementBarCount("Low")).toBe(1);
  });

  it("the tabs: the segmented variant with cols=3 (the reference's grid track)", () => {
    expect(panelRaw()).toMatch(/variant="segmented"\s*\n?\s*cols=\{3\}/);
  });

  it("the three empty states (the s28-pinned literals)", () => {
    const src = panelRaw();
    expect(src).toContain("No activities yet");
    expect(src).toContain("No deals found");
    expect(src).toContain("No notes yet");
  });

  it("the deal badge stays the stock default (the reference's bare zn)", () => {
    expect(panelSrc()).toMatch(/<Badge>\{d\.stage\}<\/Badge>/);
  });
});

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-88 pins: the contacts filter-panel + stat-card family parity
// suite (the 88-c fresh-eyes rotation — the standing session_171
// first-listed alternate: the kke panel's own chrome + the Rx stat
// cards + the Cke toolbar/export/shrink family, never a dedicated
// rotation — s28 pinned the panel structure + the checkbox anatomy,
// s75 the memo + the row construction, s82 the slide-over chrome, but
// nobody had walked the stat card's Card/CardContent split, the chip's
// class-vs-inline mechanism, the trend row's construction, the row
// icon identities, or the export's disabled binding). PLUS the
// rotation's root-cause discovery: THE V4 PALETTE DIVERGENCE — every
// literal palette class used in src/ re-pins to the reference's v3
// values in @theme (the fifth member of the v4 re-pin family).
//
// The decisive contracts (all bundle-decoded from the byte-stable
// reference + LIVE-probed on BOTH apps):
// - THE PALETTE (M-88c1): v4's default oklch palette is NOT v3's —
//   blue-600 v4 #155dfc rgb(21,93,252) vs v3 #2563eb rgb(37,99,235);
//   red-600 Δ38; green-400 Δ69; amber-400 Δ36; purple-600 Δ35;
//   cyan-400 Δ34. @theme re-pins every literal (family, step) used
//   in src/ to the v3 values (verified against the reference's
//   compiled index-Be9epoFc.css on 97 rules, ZERO mismatches).
// - THE STAT CARD SPLIT (L-88c5): the reference's Rx = Card (the
//   stock component, gradient className) > CardContent "p-6" > the
//   div.flex.items-start.justify-between row — the padding NEVER
//   merges into the card div.
// - THE CHIP MECHANISM (L-88c5): `p-3 rounded-lg ${iconColor}` where
//   iconColor is a CLASS STRING (bg-blue-500 …) — NO inline style,
//   NO shrink-0, NO aria-hidden.
// - THE TREND ROW (L-88c5): a DIV `flex items-center gap-1` holding
//   the TrendingUp|TrendingDown `w-4 h-4 text-green-600|text-red-600`
//   + the span `text-sm font-medium text-{green|red}-600` — the
//   direction is a prop; the icon color is EXPLICIT.
// - THE ROW ICON (M-88c2): the table's last-activity icon is lucide
//   ACTIVITY (the bundle's AC=tr("Activity")) — never Zap.
// - THE AWARD PAIR (M-88c3): the bundle's wT=tr("Award") — the stat
//   card icon AND the name-cell overlay; the bundle ships NO Crown.
// - THE SOURCE LABEL CASE (M-88c4): the reference renders the Source
//   labels CAPITALIZED via charAt(0).toUpperCase()+slice(1) — the raw
//   lowercase value only rides the id + the wire.
// - THE EXPORT BINDING (L-88c6): disabled binds the RAW list
//   ($.length === 0 — the bundle), not filtered.length.
// - THE DETAIL SHRINK (L-88c7): the inner scroll div appends
//   mr-[500px] while the detail slide-over is open.
// - THE MOBILE BADGE (N-88c8): the map value ONLY — the Badge base's
//   font-semibold stands (no border font-medium extras on mobile).

const root = path.resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");
const CONTACTS_LAYOUT_ANCHOR = "CONTACTS_LAYOUT.mobileCards";
const contactsSrc = () => read("src/app/(app)/contacts/contacts-page.tsx");
const pagePartsSrc = () => read("src/components/shared/page-parts.tsx");
const globalsSrc = () => read("src/app/globals.css");

function themeToken(name: string): string | undefined {
  const m = globalsSrc().match(new RegExp(`--${name}:\\s*([^;]+);`));
  return m?.[1]?.trim();
}

/** The contacts arm of IconStatCard = the return block after the
 *  session-88 comment (the comment itself names the retired arms, so
 *  the assertions must scan the CODE, not the prose). */
function contactsArm(): string {
  const src = pagePartsSrc();
  const comment = src.indexOf("Session-88 (L-88c5, bundle-decoded from the reference's Rx)");
  const start = src.indexOf("return (", comment);
  const end = src.indexOf("/**", start);
  return src.slice(start, end > start ? end : start + 2000);
}

describe("session-88: the @theme v3-palette re-pin (M-88c1)", () => {
  it("the blue family re-pins to the reference's v3 values (blue-600 #2563eb, not v4's #155dfc)", () => {
    expect(themeToken("color-blue-500")).toBe("#3b82f6");
    expect(themeToken("color-blue-600")).toBe("#2563eb");
    expect(themeToken("color-blue-700")).toBe("#1d4ed8");
  });

  it("the chromatic families re-pin (red/green/amber/purple/cyan — v4's oklch defaults diverge by Δ34-69)", () => {
    expect(themeToken("color-red-500")).toBe("#ef4444");
    expect(themeToken("color-red-600")).toBe("#dc2626");
    expect(themeToken("color-red-700")).toBe("#b91c1c");
    expect(themeToken("color-green-400")).toBe("#4ade80");
    expect(themeToken("color-green-500")).toBe("#22c55e");
    expect(themeToken("color-green-600")).toBe("#16a34a");
    expect(themeToken("color-amber-400")).toBe("#fbbf24");
    expect(themeToken("color-purple-600")).toBe("#9333ea");
    expect(themeToken("color-cyan-400")).toBe("#22d3ee");
    expect(themeToken("color-cyan-500")).toBe("#06b6d4");
    expect(themeToken("color-emerald-600")).toBe("#059669");
    expect(themeToken("color-orange-600")).toBe("#ea580c");
    expect(themeToken("color-yellow-500")).toBe("#eab308");
  });

  it("the gray/slate families re-pin (the imperceptible Δ≤3 divergences retired too)", () => {
    expect(themeToken("color-gray-500")).toBe("#6b7280");
    expect(themeToken("color-gray-600")).toBe("#4b5563");
    expect(themeToken("color-gray-700")).toBe("#374151");
    expect(themeToken("color-gray-800")).toBe("#1f2937");
    expect(themeToken("color-gray-900")).toBe("#111827");
    expect(themeToken("color-slate-600")).toBe("#475569");
    expect(themeToken("color-slate-700")).toBe("#334155");
    expect(themeToken("color-slate-800")).toBe("#1e293b");
    expect(themeToken("color-slate-900")).toBe("#0f172a");
  });

  it("the pin block carries the session-88 divergence comment (the v4!=v3 mechanism)", () => {
    expect(globalsSrc()).toMatch(/Session-88 \(M-88c1\): THE V3 PALETTE RE-PIN/);
    expect(globalsSrc()).toMatch(/#155dfc/);
  });

  it("the pin set covers every literal (family, step) used in src/ — the 92-token census", () => {
    const all = execFileSync(
      "grep",
      [
        "-rhoE",
        "(text|bg|border|ring|from|via|to)-(gray|blue|green|red|amber|yellow|emerald|cyan|purple|indigo|slate|orange|rose|neutral|zinc|stone)-[0-9]+",
        "src/",
        "--include=*.tsx",
        "--include=*.ts",
      ],
      { cwd: root, encoding: "utf8" },
    ).split("\n").filter(Boolean);
    const tokens = new Set(all.map((c) => c.replace(/^(text|bg|border|ring|from|via|to)-/, "color-")));
    expect(tokens.size).toBe(92);
    for (const t of tokens) {
      expect(themeToken(t), `token ${t} must be pinned`).toBeDefined();
    }
  });
});

describe("session-88: the stat card construction (L-88c5)", () => {
  it("the contacts arm ships Card > CardContent p-6 > the row (the padding never merges into the card)", () => {
    const src = pagePartsSrc();
    expect(src).toMatch(/<Card className=\{gradient \? "bg-gradient-to-br from-white to-gray-50" : undefined\}>/);
    expect(src).toMatch(/<CardContent className="p-6">/);
    expect(src).toMatch(/flex items-start justify-between/);
  });

  it("the chip is a CLASS mechanism — p-3 rounded-lg ${iconColor}, no inline style, no shrink-0, no aria-hidden", () => {
    const arm = contactsArm();
    expect(arm).toMatch(/p-3 rounded-lg \$\{iconColor\}/);
    expect(arm).not.toMatch(/backgroundColor/);
    expect(arm).not.toMatch(/shrink-0/);
    expect(arm).not.toMatch(/aria-hidden/);
  });

  it("the trend row is a DIV with the explicit-color icon + the direction-colored span", () => {
    const arm = contactsArm();
    expect(arm).toMatch(/<TrendingUp className="w-4 h-4 text-green-600" \/>/);
    expect(arm).toMatch(/<TrendingDown className="w-4 h-4 text-red-600" \/>/);
    expect(arm).toMatch(/trendDir === "up" \?/);
    expect(arm).toMatch(/text-sm font-medium \$\{trendDir === "up" \? "text-green-600" : "text-red-600"\}/);
  });

  it("the subValue retires from the contacts arm (leads-only)", () => {
    expect(contactsArm()).not.toMatch(/subValue/);
  });

  it("the four contacts call sites pass the bg-CLASS chips (no hex color props)", () => {
    const src = contactsSrc();
    expect(src).toMatch(/iconColor="bg-blue-500"/);
    expect(src).toMatch(/iconColor="bg-green-500"/);
    expect(src).toMatch(/iconColor="bg-amber-500"/);
    expect(src).toMatch(/iconColor="bg-red-500"/);
    expect(src).not.toMatch(/color="#(3b82f6|22c55e|f59e0b|ef4444)"/);
  });
});

describe("session-88: the row icon identities (M-88c2/c3)", () => {
  it("the table's last-activity icon is lucide Activity — never Zap (the AC=tr(Activity) decode)", () => {
    const src = contactsSrc();
    expect(src).toMatch(/<Activity className=\{`w-4 h-4 \$\{pe \? "text-red-500" : "text-green-500"\}`\} \/>/);
    expect(src).not.toMatch(/<Zap/);
    expect(src).not.toMatch(/\bZap,/);
  });

  it("the Award icon replaces Crown at BOTH sites (the stat card + the name-cell overlay)", () => {
    const src = contactsSrc();
    expect(src).toMatch(/icon=\{<Award className="w-6 h-6 text-white" \/>\}/);
    expect(src).toMatch(/<Award className="w-3 h-3 text-white" \/>/);
    expect(src).not.toMatch(/\bCrown,/);
    expect(src).not.toMatch(/<Crown/);
  });
});

describe("session-88: the Source label case + the export binding + the shrink (M-88c4, L-88c6/c7)", () => {
  it("the Source labels render CAPITALIZED (the reference's own capitalizer; the id/value stay raw)", () => {
    const src = contactsSrc();
    expect(src).toMatch(/charAt\(0\)\.toUpperCase\(\) \+ o\.value\.slice\(1\)/);
    expect(src).toMatch(/id=\{`source-\$\{o\.value\}`\}/);
  });

  it("the Export CSV disabled binding reads the RAW list (the bundle's $.length === 0), never filtered", () => {
    const src = contactsSrc();
    expect(src).toMatch(/disabled=\{contacts\.length === 0\}/);
    expect(src).not.toMatch(/disabled=\{filtered\.length === 0\}/);
  });

  it("the inner scroll area appends mr-[500px] while the detail slide-over is open", () => {
    const src = contactsSrc();
    expect(src).toMatch(/detailContact[^}]*mr-\[500px\]/);
  });
});

describe("session-88: the mobile badge + the aria superset note (N-88c8/c9)", () => {
  it("the mobile priority badge renders the map value ONLY (the base font-semibold stands)", () => {
    const src = contactsSrc();
    const mobile = src.slice(src.indexOf(CONTACTS_LAYOUT_ANCHOR));
    const badge = mobile.match(/<Badge className=\{`([^`]+)`\}/);
    expect(badge?.[1]).toBe("${CONTACT_PRIORITY_META[c.priority] ?? CONTACT_PRIORITY_META.Standard}");
  });

  it("the Filters button documents the aria-expanded superset", () => {
    const src = contactsSrc();
    expect(src).toMatch(/aria-expanded=\{showFilters\}/);
    expect(src).toMatch(/accessibility superset/);
  });
});

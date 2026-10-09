import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-89 pins: the leads stat-card family parity suite (the 89-c
// fresh-eyes rotation — the remaining standing alternate per
// session_173.md's suggested next: the Sm KPI-card family's own
// construction never walked — s11 pinned the shadow, s29 the
// derivations, s68/s69 the value typography, s77 the chip PAIRS, but
// nobody had walked the card's Card/CardContent split, the chip's
// element/guard mechanism, the value's explicit color, or the dead
// trend row). Every claim decoded from the byte-stable reference
// bundle (the Sm component + its six call sites + the H memo + the
// alias identities Wc/op/MB/BQ/nJ/qd) + LIVE-probed on BOTH apps at
// 1440 AND 390.
//
// The decisive contracts:
// - THE VALUE COLOR (M-89c1): the reference's Sm value span carries
//   the EXPLICIT text-gray-900 — LIVE rgb(17,24,39) #111827; our bare
//   form inherited the page ink rgb(10,10,10) (the F-69a1 s69 pin's
//   own comment cited the reference's gray-900 but shipped the bare
//   form — a misdecode the LIVE probe resolved). The DASHBOARD KPI
//   values are bare on the reference too (rgb(10,10,10) both apps) —
//   the gray-900 class is the LEADS Sm family's own.
// - THE CARD SPLIT (L-89c2): Card (the stock ot, BARE — no
//   className) > CardContent "p-4 sm:p-6" — the merged-padding div
//   retires (the L-87c3 KpiCard / L-88c5 contacts genus; the leads
//   arm was the LAST stat-card arm standing).
// - THE CHIP (L-89c3): the icon-guarded DIV with the reference's own
//   width-first template `w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex
//   items-center justify-center ${pair}` — chipTone DEFAULTS "blue"
//   (the reference's color="blue"); the retired span extras are gone.
// - THE DEAD TREND ROW (N-89c5): the reference's Sm ships a number
//   trend no call site exercises — `flex items-center gap-1 mt-2
//   text-xs ${sign}` > TrendingUp|TrendingDown w-3 h-3 + the
//   Math.abs(n)% span; mirrored via the shared prop's number arm.
// - THE TRUTHY subValue GUARD (N-89c7): `subValue &&` — the
//   reference's own guard (behaviorally equal on every real input).
// - THE CIRCLEX IMPORT (N-89c4): the reference's BQ=tr("CircleX") —
//   the deprecated XCircle alias retires (same circle-x glyph).
// - THE LUCIDE SUPERSET (N-89c6): lucide-react 0.525 injects an
//   svg-level aria-hidden the reference's older lucide does not —
//   documented at the icon family's own module.

const root = path.resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");
const pagePartsSrc = () => read("src/components/shared/page-parts.tsx");
const leadsPageSrc = () => read("src/app/(app)/leads/leads-page.tsx");
const iconsSrc = () => read("src/components/ui/icons.tsx");

/** The whole leads arm: from the `if (variant === "leads")` gate to the
 *  contacts arm's session-88 comment (which never moves). */
function leadsArmAll(): string {
  const src = pagePartsSrc();
  const start = src.indexOf('if (variant === "leads")');
  const end = src.indexOf("// Session-88 (L-88c5", start);
  return src.slice(start, end > start ? end : start + 2600);
}

/** The leads arm's CODE ONLY — from its own `return (` past the comment
 *  block (the comment names retired things; the assertions scan the
 *  code, not the prose — the s88 lesson). */
function leadsArmCode(): string {
  const arm = leadsArmAll();
  const start = arm.indexOf("return (");
  return arm.slice(start);
}

describe("session-89: the leads stat-card split (L-89c2 — the Sm decode)", () => {
  it("the arm renders the bare stock Card > CardContent p-4 sm:p-6 — the merged-padding div retires", () => {
    const arm = leadsArmAll();
    expect(arm).toContain("<Card>");
    expect(arm).toContain('<CardContent className="p-4 sm:p-6">');
    // the pre-fix merged form (the padding + shadow ON the card div)
    expect(leadsArmCode()).not.toContain("bg-surface p-4 shadow sm:p-6");
  });

  it("the chip is the icon-guarded width-first DIV consuming STAT_CHIP_PAIRS", () => {
    const arm = leadsArmCode();
    expect(arm).toContain("icon && (");
    expect(arm).toContain("w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center");
    expect(arm).toContain("STAT_CHIP_PAIRS[chipTone]");
    // the retired span extras are gone from the arm's code
    expect(arm).not.toContain("shrink-0");
    expect(arm).not.toMatch(/aria-hidden/);
    expect(arm).not.toMatch(/<span[^>]*rounded-lg/);
  });

  it("chipTone defaults blue — the reference's color=\"blue\" default", () => {
    const src = pagePartsSrc();
    expect(src).toMatch(/chipTone = "blue"/);
  });
});

describe("session-89: the value color (M-89c1 — LIVE rgb(17,24,39) on the reference)", () => {
  it("the leads value carries the explicit text-gray-900 — never the inherited ink", () => {
    expect(leadsArmCode()).toContain(
      '<span className="text-xl sm:text-2xl font-bold text-gray-900">{value}</span>',
    );
  });

  it("the subValue guard is the reference's truthy form", () => {
    expect(leadsArmCode()).toContain("{subValue && (");
    expect(leadsArmCode()).not.toContain("subValue !== undefined");
  });
});

describe("session-89: the dead trend mechanism (N-89c5 — dead in the reference, mirrored)", () => {
  it("the shared trend prop widens to the number form (the Sm trend is a signed percent)", () => {
    expect(pagePartsSrc()).toMatch(/trend\?: React\.ReactNode \| number/);
  });

  it("the leads arm consumes the number form — the sign-colored row + the Math.abs % span", () => {
    const arm = leadsArmCode();
    expect(arm).toContain("typeof trend === \"number\"");
    expect(arm).toContain('trend >= 0 ? "text-green-600" : "text-red-600"');
    expect(arm).toContain("w-3 h-3");
    expect(arm).toContain("Math.abs(trend)");
    // the reference renders the value as JSX children [Math.abs(n), "%"]
    // — never a template literal
    expect(arm).toContain("{Math.abs(trend)}%");
    expect(arm).not.toContain("${Math.abs(trend)}");
    expect(arm).toContain("flex items-center gap-1 mt-2 text-xs");
  });
});

describe("session-89: the icon identities (N-89c4 + N-89c6)", () => {
  it("the Dropped Deals icon is CircleX — the deprecated XCircle alias retires", () => {
    const src = leadsPageSrc();
    expect(src).toMatch(/\bCircleX\b/);
    expect(src).not.toMatch(/\bXCircle\b/);
  });

  it("the lucide 0.525 library-injected svg aria-hidden superset is documented (N-89c6)", () => {
    // The reference's older lucide renders bare svgs; our pinned 0.525
    // injects aria-hidden="true" on every icon lacking an a11y prop
    // (Icon.js: `...!children && !hasA11yProp(rest) && {...}`). Not
    // removable without forking the pinned stack — documented per the
    // S33-P1/S47-P1 superset convention at the icon family's module.
    expect(iconsSrc()).toContain("library-injected aria-hidden superset");
  });
});

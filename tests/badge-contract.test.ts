import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// ---------------------------------------------------------------------------
// Session-66 (N-66i): the Badge primitive stock re-derivation.
//
// The reference's Badge (bundle-decoded: the `zn` component over the `fie`
// cva) is a DIV carrying
//   "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs
//    font-semibold transition-colors focus:outline-none focus:ring-2
//    focus:ring-ring focus:ring-offset-2"
// with the STOCK variant set:
//   default:     "border-transparent bg-primary text-primary-foreground
//                 shadow hover:bg-primary/80"   (its --primary = #171717)
//   secondary:   "border-transparent bg-secondary text-secondary-foreground
//                 hover:bg-secondary/80"          (its --secondary = #f5f5f5)
//   destructive: "border-transparent bg-destructive text-destructive-foreground
//                 shadow hover:bg-destructive/80" (its --destructive = #ef4444)
//   outline:     "text-foreground"
//
// Our scaffold-era primitive was a SPAN with rounded-full px-2 font-medium
// gap-1 whitespace-nowrap + an invented variant set (success/warning/danger/
// info/muted) — never re-derived because the reference renders NO badges at
// its persistent zero data (the live probes could not see them) and the
// session-27..31 decodes pinned the CALL-SITE class maps, not the chrome.
// Every call-site className is already byte-identical to the bundle's; only
// the primitive diverged.
//
// Computed-equal expressions for the tokens we deliberately invert (our
// --primary IS the app blue #2563eb; the reference's --primary is the stock
// dark #171717 — the s5 DIALOG_SUBMIT / s13 PROFILE_LAYOUT.badge precedent):
//   default     -> bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/80
//                  (the reference's hover:bg-primary/80 — its --primary
//                   #171717 at 80% = rgba(23,23,23,0.8), session-80)
//   secondary   -> bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80
//                  (neutral-100 = hsl(0 0% 96.1%) = the reference's
//                   --secondary exactly)
//   destructive -> bg-danger text-neutral-50 shadow hover:bg-danger/80
//                  (our --danger #ef4444 IS the reference's --destructive)
//   outline     -> text-foreground (NOT text-muted)
// ---------------------------------------------------------------------------

const raw = (p: string) => readFileSync(p, "utf8");
// The absence pins read the COMMENT-STRIPPED source — the record comments
// quote the retired forms (the s64/s65 needle-in-own-docs lesson), and a
// pin must never trip on its own documentation.
const stripComments = (src: string) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
const badge = () => stripComments(raw("src/components/ui/badge.tsx"));
const accounts = () => stripComments(raw("src/app/(app)/accounts/accounts-page.tsx"));
const panel = () => stripComments(raw("src/components/contacts/contact-detail-panel.tsx"));
const contacts = () => stripComments(raw("src/app/(app)/contacts/contacts-page.tsx"));

describe("session-66: the Badge primitive stock mirror (N-66i)", () => {
  it("the base is the reference's stock badge string (rounded-md px-2.5 font-semibold)", () => {
    const src = badge();
    expect(src).toMatch(/inline-flex items-center rounded-md border px-2\.5 py-0\.5 text-xs font-semibold transition-colors/);
    expect(src).toMatch(/focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2/);
  });

  it("the scaffold-era chrome is retired (rounded-full pill / px-2 / font-medium base / gap-1 / whitespace-nowrap / span)", () => {
    const src = badge();
    expect(src).not.toMatch(/rounded-full/);
    expect(src).not.toMatch(/gap-1 rounded/);
    expect(src).not.toMatch(/whitespace-nowrap/);
    // The element is a DIV like the reference's zn (c.jsx("div", …)).
    expect(src).toMatch(/ComponentProps<"div">/);
    expect(src).not.toMatch(/ComponentProps<"span">/);
  });

  it("the variant set is EXACTLY the stock four (the invented success/warning/info/muted/danger retire)", () => {
    const src = badge();
    expect(src).toMatch(/variant\?: "default" \| "secondary" \| "destructive" \| "outline"/);
    expect(src).not.toMatch(/"success"/);
    expect(src).not.toMatch(/"warning"/);
    expect(src).not.toMatch(/"info"/);
    expect(src).not.toMatch(/"muted"/);
    expect(src).not.toMatch(/"danger"/);
  });

  it("default = the computed-equal stock dark (border-transparent + neutral-900/50 + shadow)", () => {
    const src = badge();
    const region = src.slice(src.indexOf("default:"), src.indexOf("secondary:"));
    expect(region).toMatch(/border-transparent bg-neutral-900 text-neutral-50 shadow/);
    expect(region).toMatch(/hover:bg-neutral-900\/80/);
    // NOT our inverted --primary token — the reference's --primary is the
    // stock dark #171717, ours is the app blue (the s13 badge precedent).
    expect(region).not.toMatch(/bg-primary/);
  });

  it("secondary = the computed-equal neutral-100 family (the reference's --secondary = #f5f5f5)", () => {
    const src = badge();
    const region = src.slice(src.indexOf("secondary:"), src.indexOf("destructive:"));
    expect(region).toMatch(/border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100\/80/);
  });

  it("destructive = the SOLID red (our --danger #ef4444 IS the reference's --destructive)", () => {
    const src = badge();
    const region = src.slice(src.indexOf("destructive:"), src.indexOf("outline:"));
    expect(region).toMatch(/border-transparent bg-danger text-neutral-50 shadow hover:bg-danger\/80/);
    // NOT the scaffold-era soft tint + rose border.
    expect(region).not.toMatch(/danger-soft/);
    expect(region).not.toMatch(/border-rose-200/);
  });

  it("outline = text-foreground (the reference's form) — NOT text-muted", () => {
    const src = badge();
    const region = src.slice(src.indexOf("outline:"));
    expect(region).toMatch(/text-foreground/);
    expect(region).not.toMatch(/text-muted/);
    expect(region).not.toMatch(/border-line/);
  });
});

describe("session-66: the Badge call-site wirings", () => {
  it("the accounts \"N Overdue\" badge rides variant=\"destructive\" (the bundle's zn,{variant:\"destructive\",className:\"text-xs\"})", () => {
    const src = accounts();
    expect(src).toMatch(/<Badge variant="destructive" className="text-xs">/);
  });

  it("the slide-over priority badge carries NO row overrides (the bundle's slide-over: zn,{className:i[e.priority]} — stock form)", () => {
    const src = panel();
    expect(src).toMatch(/<Badge className=\{`\$\{CONTACT_PRIORITY_META\[contact\.priority\] \?\? CONTACT_PRIORITY_META\.Standard\}`\}>/);
    // The ROW badge's overrides must NOT leak into the slide-over (the
    // reference's own per-surface inconsistency: row = border font-medium
    // px-3 py-1, slide-over = stock).
    expect(src).not.toMatch(/border font-medium px-3 py-1/);
  });

  it("the ROW priority badge KEEPS the reference's overrides byte-identical (border font-medium px-3 py-1)", () => {
    const src = contacts();
    expect(src).toMatch(/border font-medium px-3 py-1/);
  });
});

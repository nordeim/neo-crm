// Session-172 (WP-1): THE DIALOG-SURFACE NAMED-CONTROL BATTERY — the
// closed-surface arm of the a11y doctrine's live-census. The s171 round
// named every OPEN-surface control; the dialogs stayed nameless because
// a Radix Dialog's content is ABSENT from the DOM while closed — the
// genus was invisible to every open-surface probe AND to the a11y
// two-gate (which scans pages + the drawer-open state only).
//
// The audit's live open-dialog probes (axe-core 4.13 on each OPEN
// state) found: 9 nameless create-dialog SelectTriggers (Lead 2 ·
// Account 1 · Contact 1 · Event 3 · Activity 2 — sibling <Label> text
// is invisible to the combobox name computation, the F-171a genus) +
// the entity-edit-dialog family: 5 nameless config-driven SelectTriggers
// (Contact Status+Source · Lead Status+Source · Account Status) AND 17
// unlabeled Inputs (the bare <Label>{f.label}</Label> renders no
// htmlFor, the Inputs no id — the label association never forms).
//
// THE PARITY CONTEXT (verified live on the reference's own open
// dialogs): it ships the IDENTICAL nameless-combobox family on every
// dialog (Lead 2 · Account 1 · Contact 1 · Event 3 · Activity 2) PLUS
// its own label violations (its event dialog: 4 unlabeled inputs; its
// activity dialog: 1). Our fixes are invisible supersets under the
// s171 doctrine — the reference's nameless controls are its defect,
// ours name them.
//
// The battery's design (the house live-census doctrine): every pin
// reads the SOURCE live and asserts the accessible-name form. RED at
// birth on every nameless site; GREEN when WP-3 lands the labels.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");

const CREATE_DIALOGS = "src/components/shared/entity-dialogs.tsx";
const EDIT_DIALOG = "src/components/shared/entity-edit-dialog.tsx";

// The combobox census (the s171 helper form): the tag interior is the
// text from "<SelectTrigger" to the first ">" — the multi-line
// constructions wrap className + children across lines.
function selectTriggerTagInteriors(source: string): string[] {
  const interiors: string[] = [];
  let idx = source.indexOf("<SelectTrigger");
  while (idx !== -1) {
    const end = source.indexOf(">", idx);
    if (end === -1) break;
    interiors.push(source.slice(idx, end));
    idx = source.indexOf("<SelectTrigger", end);
  }
  return interiors;
}

// ---------------------------------------------------------------------------
// (a) The create-dialog SelectTrigger census (F-172a) — 9 sites across
// the five entity dialogs, every one carrying aria-label.
// ---------------------------------------------------------------------------
describe("session-172 (a): every create-dialog SelectTrigger carries an accessible name (F-172a)", () => {
  it("the census is non-vacuous: entity-dialogs.tsx rides exactly 9 trigger sites", () => {
    const source = read(CREATE_DIALOGS);
    const interiors = selectTriggerTagInteriors(source);
    // the audit's live probe counted exactly these: Account 1 · Contact 1
    // · Lead 2 · Event 3 · Activity 2 = 9 render sites
    expect(interiors.length).toBe(9);
  });

  it("zero nameless <SelectTrigger> constructions remain (F-172a)", () => {
    const source = read(CREATE_DIALOGS);
    const nameless = selectTriggerTagInteriors(source).filter(
      (i) => !i.includes("aria-label="),
    );
    expect(nameless).toEqual([]);
  });

  it("zero nameless <SelectTrigger> constructions in the edit dialog (F-172b)", () => {
    const source = read(EDIT_DIALOG);
    const nameless = selectTriggerTagInteriors(source).filter(
      (i) => !i.includes("aria-label="),
    );
    expect(nameless).toEqual([]);
  });

  it("the labels name the FIELD (the sibling <Label> text — the dialog form, not the 'Filter by …' page form)", () => {
    const source = read(CREATE_DIALOGS);
    // the account dialog's Status select
    expect(source).toContain('aria-label="Status"');
    // the contact dialog's source select (its label text verbatim)
    expect(source).toContain('aria-label="How did you meet?"');
    // the event dialog's trio
    expect(source).toContain('aria-label="Event Type"');
    expect(source).toContain('aria-label="Related To"');
    // the activity dialog's pair (the second Related To names its label
    // form — "(Type)" — the two dialogs' labels differ)
    expect(source).toContain('aria-label="Activity Type"');
    expect(source).toContain('aria-label="Related To (Type)"');
  });

  it("the photo-button pair stays named (green-by-design — the s30 pair)", () => {
    const source = read(CREATE_DIALOGS);
    expect(source).toContain('aria-label="Remove photo"');
    expect(source).toContain('aria-label="Upload photo"');
  });
});

// ---------------------------------------------------------------------------
// (b) The edit-dialog label ASSOCIATION census (F-172b) — the config-
// driven family wires htmlFor/id pairs; the config's own label names the
// combobox.
// ---------------------------------------------------------------------------
describe("session-172 (b): the edit-dialog wires Label htmlFor + Input id + the config-driven aria-label (F-172b)", () => {
  it("the Label binds htmlFor on the field key (the association forms)", () => {
    const source = read(EDIT_DIALOG);
    expect(source).toContain("<Label htmlFor={`edit-${f.key}`}>{f.label}</Label>");
  });

  it("the Input carries the matching id", () => {
    const source = read(EDIT_DIALOG);
    expect(source).toContain("id={`edit-${f.key}`}");
  });

  it("the config-driven SelectTrigger names itself from the config label", () => {
    const source = read(EDIT_DIALOG);
    expect(source).toContain("<SelectTrigger aria-label={f.label} className=\"w-full\">");
  });

  it("the three configs ride the edit family (the census is non-vacuous)", () => {
    const source = read(EDIT_DIALOG);
    expect(source).toContain("CONTACT_EDIT_FIELDS");
    expect(source).toContain("ACCOUNT_EDIT_FIELDS");
    expect(source).toContain("LEAD_EDIT_FIELDS");
  });
});

// ---------------------------------------------------------------------------
// (c) The dialog-open e2e contract (F-172c) — the two-gate extended to
// the closed surfaces: the five CREATE dialogs + the contact EDIT
// dialog, each opened, scanned, closed.
// ---------------------------------------------------------------------------
describe("session-172 (c): the a11y two-gate scans the OPEN dialog states (F-172c)", () => {
  const SPEC = "tests/e2e/a11y.spec.ts";

  it("the five create dialogs ride the two-gate (the explicit registrations)", () => {
    const spec = read(SPEC);
    expect(spec).toContain("dialog-open two-gate: the create dialogs");
  });

  it("the contact edit dialog rides the two-gate (the row ⋮ menu walk)", () => {
    const spec = read(SPEC);
    expect(spec).toContain("dialog-open two-gate: the contact edit dialog");
  });

  it("each dialog scan opens, scans, and closes (the Escape form)", () => {
    const spec = read(SPEC);
    expect(spec).toContain('keyboard.press("Escape")');
    expect(spec).toContain("scanTwoGate(page");
  });
});

// ---------------------------------------------------------------------------
// (d) The declared fast-check devDep (F-172d) — the property family
// must not ride an undeclared transitive.
// ---------------------------------------------------------------------------
describe("session-172 (d): fast-check is a DECLARED devDependency (F-172d)", () => {
  it("package.json devDependencies carries fast-check", () => {
    const pkg = JSON.parse(read("package.json")) as {
      devDependencies: Record<string, string>;
    };
    expect(pkg.devDependencies["fast-check"]).toBeDefined();
  });

  it("the property battery rides the declared dep (the import form)", () => {
    const battery = read("tests/property.test.ts");
    expect(battery).toContain('from "fast-check"');
  });
});

// ---------------------------------------------------------------------------
// (e) The session-199 register-coverage closure — the five un-registered
// dialog-open states. The register's own F-172c criterion re-applied: the
// s172 audit covered the five CREATE dialogs + ONE edit member (Contact);
// the Edit Lead / Edit Account siblings (the Mke/wce configs — a
// SEPARATE component from the registered Edit Contact) + the three
// standalone dialogs (Import Contacts · Account Insights · Save Custom
// Report View — never in the s172 audit's scope) carried ZERO
// open-surface a11y teeth. The discovery's live axe probes (s199,
// discover-199 LEG-5c) pre-verified every open state (GATE 1
// structural=0 · GATE 2 all-cited-sanctioned) — the registrations are
// born-green; these spec-contract pins hold them (a future silent
// removal trips the census arm + the containment arms by name).
// ---------------------------------------------------------------------------
describe("session-199 (e): the register's dialog-open coverage closure — the five un-registered open states ride the two-gate", () => {
  const SPEC = "tests/e2e/a11y.spec.ts";

  it("the Edit Lead + Edit Account siblings ride the two-gate (the Mke/wce configs — the separate EntityEditDialog members)", () => {
    const spec = read(SPEC);
    expect(spec).toContain("with the Edit Lead dialog OPEN");
    expect(spec).toContain("with the Edit Account dialog OPEN");
  });

  it("the three standalone dialogs ride the two-gate (the Import · the Insights · the Save-Report)", () => {
    const spec = read(SPEC);
    expect(spec).toContain("with the Import Contacts dialog OPEN");
    expect(spec).toContain("with the Account Insights dialog OPEN");
    expect(spec).toContain("with the Save Custom Report View dialog OPEN");
  });

  it("the dialog-open register census: twenty-two open-state registrations (eleven at desktop + the eleven phone twins — the s201 width-scope closure)", () => {
    const spec = read(SPEC);
    const labels = spec.match(/\([^)]*dialog OPEN\)/g) ?? [];
    expect(
      labels,
      `the dialog-open scan labels (found ${labels.length}: ${labels.map((l) => l.slice(1, -1)).join(" · ")})`,
    ).toHaveLength(22);
  });
});

// ---------------------------------------------------------------------------
// (f) The spec's own register claim is count-proof — the s197a2 doctrine.
// The head comment shipped at s171 as "The 25 registrations are EXPLICIT"
// and went STALE through the s172 +6 and the s195 +2 (the register is 33)
// — exactly the silent-staleness failure the count-proof NAME form
// exists to prevent: a name never goes stale when a registration joins.
// ---------------------------------------------------------------------------
describe("session-199 (f): the spec's register claim is count-proof (the s197a2 doctrine)", () => {
  const SPEC = "tests/e2e/a11y.spec.ts";

  it("the head claim never re-anchors to a count (the retired 25-form joins the negatives)", () => {
    const spec = read(SPEC);
    expect(spec).not.toMatch(/The \d+ registrations are EXPLICIT/);
  });

  it("the count-proof NAME form is the live face", () => {
    const spec = read(SPEC);
    expect(spec).toContain("The register is EXPLICIT");
  });
});

// ---------------------------------------------------------------------------
// (g) The session-200 register-coverage closure — the three un-registered
// PAGE surfaces. The register's own criterion re-applied to the page
// family (the s199 round closed the dialog-open family; the page family
// is the other arm): the app's renderable route inventory is 16 surfaces,
// the register held 13 — the /about + /contact authenticated marketing
// interiors (two-app-renderable, login-walled per the s147 reference
// posture, walked at s193/walk66 but never axe-scanned) + the
// /reset-password anon surface (OURS-ONLY, the /signup registration
// precedent; the s163 digma port) carried ZERO a11y teeth at any width.
// The discovery's live axe probes (s200, discover-200 LEG-5c)
// pre-verified every surface at both widths (GATE 1 structural=0 · GATE 2
// zero contrast flags) — the registrations are born-green; these
// spec-contract pins hold them (a future silent removal trips the census
// arm + the containment arms by name).
// ---------------------------------------------------------------------------
describe("session-200 (g): the register's page-surface coverage closure — the three un-registered surfaces ride the two-gate", () => {
  const SPEC = "tests/e2e/a11y.spec.ts";

  it("the marketing interiors ride the two-gate at BOTH widths (the s147 login-walled posture — the authed form)", () => {
    const spec = read(SPEC);
    expect(spec).toContain('test("desktop /about');
    expect(spec).toContain('test("phone /about');
    expect(spec).toContain('test("desktop /contact');
    expect(spec).toContain('test("phone /contact');
  });

  it("the reset-password surface rides the two-gate at both widths (the anon form — the /signup precedent, the set-password form state)", () => {
    const spec = read(SPEC);
    expect(spec).toContain('test("desktop /reset-password');
    expect(spec).toContain('test("phone /reset-password');
  });

  it("the page-surface register census: thirty-three page-family registrations (the 9 CRM pages × 2 + the drawer + the anon family + the marketing pair + the reset surface)", () => {
    const spec = read(SPEC);
    const total = (spec.match(/^\s*test\(/gm) ?? []).length;
    const dialogs = (spec.match(/\([^)]*dialog OPEN\)/g) ?? []).length;
    // session-202: the client-state view family (+6) joined the register —
    // the census subtracts BOTH non-page families (the s201 (e) re-anchor
    // precedent: the live read moves with the register, the page-family
    // count stays the page family's own)
    const views = (spec.match(/\([^)]*view OPEN\)/g) ?? []).length;
    expect(
      total - dialogs - views,
      `the page-family count (total test()=${total} minus dialog-open=${dialogs} minus view-state=${views})`,
    ).toBe(33);
  });
});

// ---------------------------------------------------------------------------
// (h) The spec's own anon-family claim is count-proof — the s197a2/s199a2
// doctrine. The anon describe head shipped at s171 as "The three anon
// surfaces (login/signup/landing)" and went STALE at s195 — the 404 ×2
// joined that very describe without the count moving (the family is four
// surfaces today, five after the s200 cure) — exactly the silent-
// staleness failure the count-proof NAME form exists to prevent: a name
// never goes stale when a surface joins.
// ---------------------------------------------------------------------------
describe("session-200 (h): the spec's anon-family claim is count-proof (the s197a2/s199a2 doctrine)", () => {
  const SPEC = "tests/e2e/a11y.spec.ts";

  it("the anon-family head claim never re-anchors to a count (the retired three-form joins the negatives)", () => {
    const spec = read(SPEC);
    // the count word may be spelled out ("three") or a digit ("3") — the
    // s200 live catch: the first draft's bare \d+ was fooled by the WORD
    // form the s171 head actually carries; \w+ catches both spellings
    expect(spec).not.toMatch(/The \w+ anon surfaces/);
  });

  it("the count-proof NAME form is the live face", () => {
    const spec = read(SPEC);
    expect(spec).toContain("The anon family");
  });
});

// ---------------------------------------------------------------------------
// (i) The session-201 width-scope closure — the phone-width dialog-open
// family. The register's head criterion ("one test() per surface ×
// width") was VIOLATED by the dialog family since s172: the 11 open
// states carried ONE width (desktop-only) while the page family
// carried both — the s199a2 re-anchor WORDED a criterion the register
// never satisfied for this family (the width-blind genus, born false
// at s199 and held through s200). The s200 close banked the family as
// the standing candidate; the discovery (discover-201 LEG-5b)
// re-probed every phone state live (structural=0 on all 11; every
// contrast flag citing an existing sanctioned matcher — the quick-log
// bg-emerald-600 · the accounts badge/border family · the calendar
// text-gray-400 · the -trigger- segmented pair) — the registrations
// are born-green; these spec-contract pins hold them (a future silent
// removal trips the census arm + the containment arms by name).
// ---------------------------------------------------------------------------
describe("session-201 (i): the register's phone-width dialog-open closure — the eleven phone states ride the two-gate", () => {
  const SPEC = "tests/e2e/a11y.spec.ts";

  it("the create family rides the two-gate at phone width (the five create dialogs)", () => {
    const spec = read(SPEC);
    expect(spec).toContain('test("phone /leads with the New Lead dialog OPEN');
    expect(spec).toContain('test("phone /accounts with the New Account dialog OPEN');
    expect(spec).toContain('test("phone /contacts with the New Contact dialog OPEN');
    expect(spec).toContain('test("phone /calendar with the New Event dialog OPEN');
    expect(spec).toContain('test("phone /activities with the Log Call dialog OPEN');
  });

  it("the edit + standalone family rides the two-gate at phone width (the six remaining states)", () => {
    const spec = read(SPEC);
    expect(spec).toContain('test("phone /contacts with the Edit Contact dialog OPEN');
    expect(spec).toContain('test("phone /leads with the Edit Lead dialog OPEN');
    expect(spec).toContain('test("phone /accounts with the Edit Account dialog OPEN');
    expect(spec).toContain('test("phone /contacts with the Import Contacts dialog OPEN');
    expect(spec).toContain('test("phone /accounts with the Account Insights dialog OPEN');
    expect(spec).toContain('test("phone /reports with the Save Custom Report View dialog OPEN');
  });

  it("the phone-width census: eleven phone-width open-state registrations (the live read)", () => {
    const spec = read(SPEC);
    const labels = spec.match(/test\("phone [^"]*dialog OPEN[^"]*"/g) ?? [];
    expect(
      labels,
      `the phone dialog-open registration names (found ${labels.length})`,
    ).toHaveLength(11);
  });
});

// ---------------------------------------------------------------------------
// (j) The spec's own head criterion is width-TRUE — the width axis of
// the s197a2/s199a2/s200a2 count-proof doctrine. The criterion ("one
// test() per surface × width") was born FALSE at s199 — the dialog
// family carried one width — and no pin has ever held it. The cure:
// the phone family registered (the criterion TRUE for every family)
// + this width-pair census holding it (a future width-scope
// regression trips the equality + the twin arms by name).
// ---------------------------------------------------------------------------
describe("session-201 (j): the register's head criterion is width-true (one test() per surface × width)", () => {
  const SPEC = "tests/e2e/a11y.spec.ts";

  it("the width-pair census: every desktop dialog registration carries its phone twin (the criterion held, live-read)", () => {
    const spec = read(SPEC);
    const labels = spec.match(/test\("([^"]*dialog OPEN[^"]*)"/g)?.map((s) => s.slice(6, -1)) ?? [];
    const desktop = labels.filter((l) => l.startsWith("desktop"));
    const phone = labels.filter((l) => l.startsWith("phone"));
    expect(
      desktop.length,
      `the width split (desktop=${desktop.length} phone=${phone.length})`,
    ).toBe(phone.length);
    for (const d of desktop) {
      const twin = `test("${d.replace(/^desktop/, "phone")}`;
      expect(spec, `the phone twin of "${d}"`).toContain(twin);
    }
  });

  it("the criterion's NAME form is the live face (the width-blind form never returns)", () => {
    const spec = read(SPEC);
    expect(spec).toContain("one test() per surface × width");
    // the width-blind form — the criterion claimed WITHOUT the × width
    // axis — never re-anchors (a future edit dropping the axis trips
    // this arm: "per surface" must always carry the " × width" tail)
    expect(spec).not.toMatch(/per surface(?! × width)/);
  });
});

// ---------------------------------------------------------------------------
// (k) The session-202 client-state closure — the login card's in-card
// view states. The register's families were URL-addressable (page
// routes + click-opened dialogs) while the login card's view machine
// (src/lib/login-reset.ts: signin | reset | sent | signup | verify)
// renders WHOLE-CARD DOM surfaces no resting scan ever sees — the
// s172 closed-by-default genus's client-state sibling (the view swaps
// REPLACE the card's column entirely). The register carried ZERO
// view-state registrations at ANY width (the surface-blind genus);
// the s201 close banked the family as the standing candidate and the
// discovery (discover-202 LEG-5b) probed every state live at BOTH
// widths — 6/6 structural=0, zero contrast flags (born-green; these
// spec-contract pins hold them — a future silent removal trips the
// census arm + the containment arms by name).
// ---------------------------------------------------------------------------
describe("session-202 (k): the register's client-state closure — the login card's three view states ride the two-gate", () => {
  const SPEC = "tests/e2e/a11y.spec.ts";

  it("the reset + sent views ride the two-gate at both widths (the forgot-password ladder)", () => {
    const spec = read(SPEC);
    expect(spec).toContain('test("desktop /login with the reset view OPEN');
    expect(spec).toContain('test("phone /login with the reset view OPEN');
    expect(spec).toContain('test("desktop /login with the sent view OPEN');
    expect(spec).toContain('test("phone /login with the sent view OPEN');
  });

  it("the verify view rides the two-gate at both widths (the in-card signup ladder)", () => {
    const spec = read(SPEC);
    expect(spec).toContain('test("desktop /login with the verify view OPEN');
    expect(spec).toContain('test("phone /login with the verify view OPEN');
  });

  it("the client-state census: six view-state registrations (the live read)", () => {
    const spec = read(SPEC);
    const labels = spec.match(/test\("(?:desktop|phone) [^"]*view OPEN[^"]*"/g) ?? [];
    expect(
      labels,
      `the view-state registration names (found ${labels.length})`,
    ).toHaveLength(6);
  });
});

// ---------------------------------------------------------------------------
// (l) The spec's own head criterion is state-TRUE — the state axis of
// the s197a2/s199a2/s200a2/s201a2 count-proof doctrine. The criterion
// ("one test() per surface × width") has been SURFACE-BLIND since the
// register's s171 birth for the client-state genus: the view machine
// renders whole-card surfaces no resting scan sees, the criterion's
// STATE axis was never adjudicated against the machine's inventory,
// and no pin ever held it (the s201 width-pair pin holds the WIDTH
// axis only). The cure: the client-state family registered (the
// criterion TRUE on the state axis for every family) + this pin pair
// holding it — the state-machine census cross-reads the machine's own
// union against the register (a future view state added to the
// machine without its registration trips it), the state-pair census
// holds the width twins (a future width-scope regression trips the
// equality + the twin arms).
// ---------------------------------------------------------------------------
describe("session-202 (l): the register's head criterion is state-true (every LoginView state rides the two-gate)", () => {
  const SPEC = "tests/e2e/a11y.spec.ts";
  const MACHINE = "src/lib/login-reset.ts";

  /** The machine's live union — read from the source (a state added
   * to the machine raises the expectation without a pin edit). */
  function loginViewStates(): string[] {
    const src = read(MACHINE);
    const union = src.match(/export type LoginView = ([^;]+);/)?.[1] ?? "";
    return union.match(/"(\w+)"/g)?.map((s) => s.slice(1, -1)) ?? [];
  }

  it("the state-machine census: every LoginView state rides the two-gate somewhere in the register (the live cross-read)", () => {
    const spec = read(SPEC);
    const states = loginViewStates();
    expect(states.length, "the machine's union is non-empty").toBeGreaterThan(0);
    // the page-registered states (the /login + /signup surfaces)
    const pageRegistered = new Set(["signin", "signup"]);
    for (const state of states) {
      if (pageRegistered.has(state)) {
        expect(
          spec,
          `the ${state} state's page registration (the /${state === "signin" ? "login" : "signup"} surface)`,
        ).toContain(`test("desktop /${state === "signin" ? "login" : "signup"} (anon)`);
      } else {
        expect(
          spec,
          `the ${state} view state's two-gate registration`,
        ).toContain(`with the ${state} view OPEN`);
      }
    }
  });

  it("the state-pair census: every view-state registration carries its width twin + the family covers the machine's un-page-registered states (the live read)", () => {
    const spec = read(SPEC);
    const labels = spec.match(/test\("([^"]*view OPEN[^"]*)"/g)?.map((s) => s.slice(6, -1)) ?? [];
    const desktop = labels.filter((l) => l.startsWith("desktop"));
    const phone = labels.filter((l) => l.startsWith("phone"));
    expect(
      desktop.length,
      `the width split (desktop=${desktop.length} phone=${phone.length})`,
    ).toBe(phone.length);
    for (const d of desktop) {
      const twin = `test("${d.replace(/^desktop/, "phone")}`;
      expect(spec, `the phone twin of "${d}"`).toContain(twin);
    }
    // the family's live count equals the machine's un-page-registered
    // state count (the surface-blind register's own proof: every
    // whole-card view state the machine names is registered)
    const states = loginViewStates();
    const pageRegistered = new Set(["signin", "signup"]);
    const expected = states.filter((s) => !pageRegistered.has(s)).length;
    expect(
      desktop.length,
      `the family covers the machine's un-page-registered states (${expected})`,
    ).toBe(expected);
  });
});


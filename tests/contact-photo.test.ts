import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-30 pins (S30-P2): the AAe contact-dialog PHOTO section — the
// s47-era pointer, bundle-extracted + LIVE-verified end-to-end on the
// reference (a real PNG upload → the CDN file_url → the img renders +
// the remove X appears; the non-image alert intercepted with the exact
// string).
//
// The decisive contracts (bundle index-DZ-xbrIm.js @ AAe):
// - The avatar renders the PHOTO when set: <img src alt={name}
//   className="w-full h-full object-cover"/> over the gradient circle;
//   the fallback is the 2-char initials OR the User glyph (w-10 h-10
//   text-white/80) when the name is empty.
// - The remove X (photo set only): absolute -top-1 -right-1 w-7 h-7
//   bg-red-500 rounded-full ... + X w-4 h-4 text-white; clears the
//   photo AND resets the file input's value.
// - The camera button: border-2 border-blue-500 + disabled while
//   uploading; the hidden input accept="image/jpeg,image/png,image/jpg".
// - onChange: the image-type check → alert("Please upload an image file
//   (JPG or PNG)"); the upload → photoUrl; catch → alert("Failed to
//   upload photo. Please try again."); "Uploading photo..." while
//   in flight.
// - The Name field INSIDE the section: placeholder "John Doe" +
//   text-center font-medium.
// - The W7 EDIT dialog has NO photo field (the reference cannot edit a
//   photo post-create — mirrored), and the Pke slide-over hero is
//   INITIAL-ONLY (no img branch — our clone's img is the divergence
//   this session retires).

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

const dialogs = () => stripComments(read("src/components/shared/entity-dialogs.tsx") ?? "");
const layout = () => stripComments(read("src/lib/page-layout.ts") ?? "");
const panel = () => stripComments(read("src/components/contacts/contact-detail-panel.tsx") ?? "");
const editDialog = () =>
  stripComments(read("src/components/shared/entity-edit-dialog.tsx") ?? "");

describe("session-30: the avatar render — photo / initials / User glyph", () => {
  it("renders the uploaded photo with object-cover inside the gradient circle", () => {
    const src = dialogs();
    expect(src).toMatch(/<img[^>]*src=\{form\.photoUrl\}/);
    expect(src).toMatch(/w-full h-full object-cover/);
  });

  it("falls back to the User glyph when the name is empty (the reference's || chain)", () => {
    const src = dialogs();
    expect(src).toMatch(/<User/);
    expect(src).toMatch(/w-10 h-10 text-white\/80/);
  });

  it("the initials span keeps the reference's exact classes", () => {
    const src = layout();
    expect(src).toMatch(/text-white font-bold text-3xl/);
  });

  it("the circle carries shadow-lg (the bundle's exact class list)", () => {
    const src = layout();
    expect(src).toMatch(/w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg/);
  });
});

describe("session-30: the remove X button", () => {
  it("renders only when a photo is set, at the exact classes", () => {
    const src = dialogs();
    expect(src).toMatch(
      /form\.photoUrl\s*&&[\s\S]*?absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full/,
    );
    expect(src).toMatch(/hover:bg-red-600 transition-colors/);
  });

  it("carries the X glyph in white", () => {
    const src = dialogs();
    expect(src).toMatch(/<X[^>]*className="w-4 h-4 text-white"/);
  });

  it("clears the photo AND resets the file input's value", () => {
    const src = dialogs();
    expect(src).toMatch(/photoUrl:\s*""/);
    expect(src).toMatch(/\.value\s*=\s*""/);
  });
});

describe("session-30: the camera button + the hidden input", () => {
  it("the camera button carries border-2 border-blue-500 and disables while uploading", () => {
    expect(layout()).toMatch(/border-2 border-blue-500/);
    expect(dialogs()).toMatch(/disabled=\{uploading\}/);
  });

  it("the hidden input keeps the explicit MIME trio (the s19 pin, unchanged)", () => {
    // Raw source read — stripComments eats the `image/*` inside the string.
    const raw = read("src/components/shared/entity-dialogs.tsx") ?? "";
    expect(raw).toMatch(/accept="image\/jpeg,image\/png,image\/jpg"/);
  });
});

describe("session-30: the upload round-trip semantics", () => {
  it("validates the image type with the reference's exact alert", () => {
    const src = dialogs();
    expect(src).toMatch(/startsWith\("image\/"\)/);
    expect(src).toMatch(/Please upload an image file \(JPG or PNG\)/);
  });

  it("uploads to our seam and stores the returned file_url in the form", () => {
    const src = dialogs();
    expect(src).toMatch(/\/api\/upload/);
    expect(src).toMatch(/file_url/);
    expect(src).toMatch(/photoUrl:\s*[A-Za-z]/);
  });

  it("the failure path alerts the reference's exact string", () => {
    const src = dialogs();
    expect(src).toMatch(/Failed to upload photo\. Please try again\./);
  });

  it("shows the Uploading photo... hint while in flight", () => {
    const src = dialogs();
    expect(src).toMatch(/Uploading photo\.\.\./);
    expect(layout()).toMatch(/text-xs text-gray-500/);
  });

  it("carries photoUrl through create (the AAe submit passes the whole form)", () => {
    const src = dialogs();
    // The form state includes photoUrl and the submit passes it to create.
    expect(src).toMatch(/photoUrl/);
    expect(read("src/types/index.ts") ?? "").toMatch(/photoUrl:\s*string \| null/);
  });
});

describe("session-30: the Name field inside the avatar section", () => {
  it("carries the reference's placeholder + the centered medium weight", () => {
    const raw = read("src/components/shared/entity-dialogs.tsx") ?? "";
    expect(raw).toMatch(/placeholder="John Doe"/);
    expect(stripComments(raw)).toMatch(/text-center font-medium/);
  });
});

describe("session-30: the dialog scroll-cap layer (S30-P6, bundle-extracted)", () => {
  it("the contact CREATE dialog carries the AAe's max-h-[90vh] overflow-y-auto", () => {
    const src = dialogs();
    // The ContactDialog shell (base max-w-lg) + the cap pair.
    expect(src).toMatch(/DialogContent className="max-h-\[90vh\] overflow-y-auto"/);
  });

  it("the account CREATE dialog ships the BARE max-w-2xl (the reference's own cap-free quirk)", () => {
    const src = dialogs();
    expect(src).toMatch(/DialogContent className="max-w-2xl"/);
  });

  it("the Lead CREATE dialog stays the plain base (bare max-w-lg — the reference's other cap-free create)", () => {
    const src = dialogs();
    // Five DialogContent openings in this file: account (bare wide),
    // contact (capped), lead (plain), event + activity (the wide family
    // with the cap pair via DIALOG_CONTENT.wide).
    const shells = [...src.matchAll(/<DialogContent([^>]*)>/g)].map((m) => m[1].trim());
    expect(shells).toEqual([
      'className="max-w-2xl"',
      'className="max-h-[90vh] overflow-y-auto"',
      "",
      "className={DIALOG_CONTENT.wide}",
      "className={DIALOG_CONTENT.wide}",
    ]);
  });

  it("the Save Custom Report dialog carries the wide family's cap pair", () => {
    const src = stripComments(read("src/components/shared/save-report-dialog.tsx") ?? "");
    expect(src).toMatch(/max-w-2xl max-h-\[90vh\] overflow-y-auto/);
  });

  it("the W7/Mke edit family + Account Insights already carry their caps (s28, unchanged)", () => {
    expect(editDialog()).toMatch(/max-w-2xl max-h-\[90vh\] overflow-y-auto/);
    expect(stripComments(read("src/components/accounts/account-insights-dialog.tsx") ?? "")).toMatch(
      /max-w-3xl max-h-\[80vh\] overflow-y-auto/,
    );
  });
});

describe("session-30: the two negative contracts (W7 + slide-over)", () => {
  it("the W7 EDIT dialog has NO photo field (the reference's own limitation)", () => {
    expect(editDialog()).not.toMatch(/photoUrl/);
  });

  it("the Pke slide-over hero is INITIAL-ONLY — no img branch (our divergence retired)", () => {
    expect(panel()).not.toMatch(/<img/);
  });
});

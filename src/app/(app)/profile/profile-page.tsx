"use client";

import * as React from "react";
import { Camera, Mail, Shield, User } from "lucide-react";
import { PAGE_ROOT, PROFILE_LAYOUT } from "@/lib/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCrmStore } from "@/stores/crm-store";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/**
 * Profile & Settings — mirrors the reference layout (DOM-verified):
 * a "Personal Information" form (blue-100 80/96px avatar circle with a user
 * glyph, camera-icon Upload Photo, editable Full Name, fixed Email + Role,
 * black Save Changes) beside a stack of four small cards — Account (centered
 * avatar + identity + badge), Account Type, Email Verified and Security,
 * each with a 48px tinted icon chip.
 */
export default function ProfilePage() {
  const { user, updateUser } = useCrmStore();

  return (
    // Session-16 (S16-P2): the page owns its padding — the reference's
    // Profile root is just `p-4 sm:p-8` (NO bg / min-h-screen, like
    // Leads) with the `max-w-4xl mx-auto` column INSIDE. Session-13
    // (S13-P2): the header is a PLAIN `mb-6 sm:mb-8` div — not the
    // flex PageHeader row.
    // Session-72 (L-72c9, bundle-decoded): the loading branch is
    // HEADERLESS — the reference's else-arm is a plain
    // `text-center py-12` "Loading..." inside the max-w-4xl column
    // (the h1 renders only in the loaded branch).
    <div className={PAGE_ROOT.bare}>
    <div className={PROFILE_LAYOUT.root}>
      {!user ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          <div className={PROFILE_LAYOUT.headerRow}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile &amp; Settings</h1>
            <p className="text-muted mt-1">Manage your account information</p>
          </div>
          {/* Keyed remount: the form initializes its local state from the
              user snapshot at mount — no setState-in-effect needed. The
              value-based key also re-initializes the form when the store
              user updates after a save (the pre-reload refresh). */}
          <ProfileForm key={`${user.id}-${user.name}`} user={user} updateUser={updateUser} />
        </>
      )}
    </div>
    </div>
  );
}

/** 48px tinted circle chip (bg-100 tint + 600-level glyph). */
function ProfileChip({
  icon,
  bg,
  color,
  className,
}: {
  icon: React.ReactNode;
  bg: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", className)}
      style={{ backgroundColor: bg, color }}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

function ProfileForm({
  user,
  updateUser,
}: {
  user: { id: string; name: string; email: string; role: string; photoUrl?: string | null };
  updateUser: (patch: { name: string; photoUrl?: string | null }) => Promise<{ ok: boolean }>;
}) {
  const [name, setName] = React.useState(user.name);
  const [photoUrl, setPhotoUrl] = React.useState(user.photoUrl ?? "");
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Session-30 (S30-P3): the reference's aCe upload handler — NO client
  // type-validation on this surface (unlike the contact dialog's alert),
  // TOASTS instead of alerts, and the uploaded file_url lands in the form
  // state until Save.
  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        data?: { file_url?: string };
      } | null;
      if (res.ok && body?.ok && body.data?.file_url) {
        setPhotoUrl(body.data.file_url);
        toast.success("Photo uploaded successfully");
      } else {
        toast.error("Failed to upload photo");
      }
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    // Session-62 (N-62b): the reference's save is UNCONDITIONAL — its
    // bundle (index-DZ-xbrIm.js) disables the button only while saving
    // (`disabled:i`) and its submit always PATCHes both fields. The
    // name-only `dirty` gate that used to live here was a self-inflicted
    // divergence: a photo-only upload left Save a silent no-op (the
    // button looked clickable; the handler returned early; navigation
    // lost the upload).
    setSaving(true);
    // Session-39 (S39-P3): the envelope — the sibling uploadPhoto has
    // had this shape since s30; a bare await chain let a network throw
    // propagate from `void save()` as an unhandled rejection with the
    // Save button stranded busy. The finally un-busies every path.
    // Session-72 (S72-P7): the PATCH flows through the store's
    // updateUser action (the call() envelope + the s64 write-guard +
    // the user-slice set) — the reference's t(await me()) contract:
    // the Account card's name + photo land in the pre-reload window.
    // The toasts are single-arg — the reference's exact vocabulary
    // (bundle-decoded: Ix.error("Failed to update profile")).
    try {
      const res = await updateUser({ name, photoUrl: photoUrl || null });
      if (res.ok) {
        toast.success("Profile updated successfully");
        // Session-30 (S30-P3): the reference reloads after 500ms so the
        // topbar avatar (server-rendered session user) picks up the photo.
        setTimeout(() => window.location.reload(), 500);
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }


  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      {/* Personal information — session-6: spans two of the three lg
          columns (reference DOM). */}
      <Card className="lg:col-span-2">
        <CardHeader>
          {/* Session-13 (S13-P2): the STOCK CardTitle (16px,
              leading-none) — the reference's profile title is not a size
              variant. */}
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        {/* Session-9 (S9-8): standard content + form + space-y-6 (no
            max-w constraint — the reference's inputs stretch full width). */}
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
          <div className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            {/* Session-91 (M-91c1): the avatar row carries controlMt — the
                v4 inline-label collapse fix (see PROFILE_LAYOUT.controlMt). */}
            <div className={cn("flex flex-col items-center gap-4 sm:flex-row", PROFILE_LAYOUT.controlMt)}>
              {/* Reference: the stock Avatar primitive wrapping a bg-blue-100
                  inner div with a stroke-2 user glyph (DOM-verified 80/96px,
                  icon #2563EB). Session-30 (S30-P3): the reference renders
                  the uploaded photo over the fallback (img object-cover). */}
              <span
                className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full sm:h-24 sm:w-24"
                aria-hidden="true"
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600">
                    <User className={PROFILE_LAYOUT.avatarIcon} strokeWidth={PROFILE_LAYOUT.avatarIconStroke} />
                  </span>
                )}
              </span>
              <div className="w-full flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  tabIndex={-1}
                  onChange={uploadPhoto}
                />
                {/* Session-30 (S30-P3): the reference's aCe — the outline
                    Upload Photo button fires the REAL round-trip (accept
                    image/*, NO type alert on this surface, toasts).
                    Session-72 (N-72c7, bundle-decoded): while uploading the
                    label is the "Uploading..." TEXT ONLY — the Camera icon
                    drops (the reference's own ternary form). */}
                <Button
                  variant="outline"
                  className={PROFILE_LAYOUT.uploadBtn}
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Session-13 (S13-P2): the reference carries the margin
                      ON THE SVG (w-4 h-4 mr-2), not on the wrapper. */}
                  {uploading ? "Uploading..." : (
                    <>
                      <Camera className={PROFILE_LAYOUT.uploadIcon} /> Upload Photo
                    </>
                  )}
                </Button>
                <p className="mt-2 text-xs text-muted">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Full Name</Label>
            <Input
              id="display_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={PROFILE_LAYOUT.namePlaceholder}
              className={PROFILE_LAYOUT.controlMt}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            {/* Session-13 (S13-P2): the reference's disabled email input
                carries the bg-gray-50 wash (ours was bg-transparent —
                indistinguishable from an editable input). */}
            <Input
              id="profile-email"
              type="email"
              value={user.email}
              disabled
              className={cn(PROFILE_LAYOUT.emailDisabled, PROFILE_LAYOUT.controlMt)}
            />
            <p className="text-xs text-muted">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-role">Role</Label>
            {/* Session-13 (S13-P2): bg-gray-50 + capitalize — the raw
                value "user" displays "User" like the reference. */}
            <Input
              id="profile-role"
              value={user.role}
              disabled
              className={cn(PROFILE_LAYOUT.roleDisabled, PROFILE_LAYOUT.controlMt)}
            />
          </div>

          <div className="pt-4">
            {/* Session-13 (S13-P2): the STOCK Button structure with the
                reference's PAGE-LOCAL primary — its profile surfaces ride
                bg-primary #171717 (its global --primary; its blue buttons
                elsewhere are explicit bg-blue-600). Ours maps --primary
                to blue, so the neutral literals carry the exact colors:
                bg #171717, fg #fafafa, bare shadow. Session-80 (M-80c1):
                the reference's hover is the ALPHA hover:bg-primary/90 —
                LIVE-probed rgba(23,23,23,0.9) — so the computed-equal is
                neutral-900 at 90%, not the solid neutral-800 s13 shipped;
                the inert border-transparent (the stock default ships no
                border arm) retired with it.
                Session-72 (L-72c4): the three-dot "Saving..." form —
                the reference's own label (bundle-decoded). */}
            <Button
              type="submit"
              className={cn(
                "bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90",
                PROFILE_LAYOUT.saveBtn,
              )}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
          </div>
          </form>
        </CardContent>
      </Card>

      {/* Right column — four small cards, each with a tinted icon chip.
          Session-9 (S9-8): space-y stack; the Account card carries a
          plain p-6 content with the centered name-wrap inside (no h-fit). */}
      <div className={PROFILE_LAYOUT.columnWrap}>
        <Card>
          <CardContent className="p-6">
            <div className={PROFILE_LAYOUT.nameWrap}>
            {/* Session-72 (L-72c2, bundle-decoded): the Account card reads
                the STORE user's photo + name — the reference's card rides
                the session user (e.profile_picture), so the card stays
                stale through the upload (the form avatar alone previews)
                and updates only after the save's me() round-trip — our
                updateUser set lands the same pre-reload update. */}
            <span
              className="relative mb-4 flex h-20 w-20 shrink-0 overflow-hidden rounded-full"
              aria-hidden="true"
            >
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600">
                  <User className="h-10 w-10" strokeWidth={PROFILE_LAYOUT.avatarIconStroke} />
                </span>
              )}
            </span>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted">{user.email}</p>
            {/* Session-13 (S13-P2): the STOCK shadcn Badge default
                variant (shadow + hover + transition + focus ring) on the
                contract string — the hand-rolled minimal span retired. */}
            <div className={PROFILE_LAYOUT.badge}>{user.role}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <ProfileChip icon={<User className="h-6 w-6" />} bg="#dbeafe" color="#2563eb" />
              <div className="min-w-0">
                <p className="text-sm text-muted">Account Type</p>
                <p className="truncate font-semibold capitalize text-foreground">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <ProfileChip icon={<Mail className="h-6 w-6" />} bg="#dcfce7" color="#16a34a" />
              <div className="min-w-0">
                <p className="text-sm text-muted">Email Verified</p>
                <p className="font-semibold text-foreground">Yes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <ProfileChip icon={<Shield className="h-6 w-6" />} bg="#f3e8ff" color="#9333ea" />
              <div className="min-w-0">
                <p className="text-sm text-muted">Security</p>
                <p className="font-semibold text-foreground">Protected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

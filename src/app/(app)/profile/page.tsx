"use client";

import * as React from "react";
import { Camera, Mail, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-parts";
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
  const { user, users, fetchUsers } = useCrmStore();

  return (
    // Session-6 (S6-12): reference wraps profile content in max-w-4xl
    // mx-auto with the leads-style header (mb-6 sm:mb-8).
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Profile & Settings" subtitle="Manage your account information" variant="leads" />

      {!user ? (
        <p className="py-10 text-center text-sm text-muted">Loading profile…</p>
      ) : (
        /* Keyed remount: the form initializes its local state from the
           user snapshot at mount — no setState-in-effect needed. */
        <ProfileForm key={`${user.id}-${user.name}`} user={user} onSaved={fetchUsers} usersTotal={users.length} />
      )}
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
  onSaved,
}: {
  user: { id: string; name: string; email: string; role: string; avatarColor?: string | null };
  onSaved: () => Promise<void>;
  usersTotal: number;
}) {
  const [name, setName] = React.useState(user.name);
  const [saving, setSaving] = React.useState(false);
  const dirty = name.trim() !== user.name && name.trim().length >= 2;

  async function save() {
    if (!dirty) return;
    setSaving(true);
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    const body = await res.json().catch(() => null);
    setSaving(false);
    if (body?.ok) {
      toast.success("Profile saved", "Your display name has been updated.");
      await onSaved();
    } else {
      toast.error("Could not save", body?.error?.message ?? "Please try again.");
    }
  }

  const roleLabel = user.role === "admin" ? "Admin" : "User";

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      {/* Personal information — session-6: spans two of the three lg
          columns (reference DOM). */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="flex max-w-xl flex-col gap-5">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {/* Reference: a plain blue-100 circle with a user glyph — not an
                  initial avatar (DOM-verified 80/96px, icon #2563EB). */}
              <span
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-600 sm:h-24 sm:w-24"
                aria-hidden="true"
              >
                <User className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
              </span>
              <div className="w-full flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Upload Photo", "Profile photo upload is not available in this demo workspace.")}
                >
                  <Camera className="h-4 w-4" /> Upload Photo
                </Button>
                <p className="mt-2 text-xs text-muted">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="profile-name">Full Name</Label>
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" value={user.email} disabled />
            <p className="text-xs text-muted">Email cannot be changed</p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="profile-role">Role</Label>
            <Input id="profile-role" value={roleLabel} disabled />
          </div>

          <div>
            {/* Reference Save Changes is a dark neutral button (computed
                rgb(23,23,23) bg — DOM-verified), not the blue primary. */}
            <Button
              className="border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-800"
              onClick={save}
              disabled={!dirty || saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right column — four small cards, each with a tinted icon chip. */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <span
              className="mb-4 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-600"
              aria-hidden="true"
            >
              <User className="h-10 w-10" strokeWidth={1.5} />
            </span>
            <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted">{user.email}</p>
            <span className="mt-2 inline-flex items-center rounded-md border border-transparent bg-neutral-900 px-2.5 py-0.5 text-xs font-semibold capitalize text-neutral-50">
              {user.role}
            </span>
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

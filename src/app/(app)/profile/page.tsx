"use client";

import * as React from "react";
import { Camera, ShieldCheck, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-parts";
import { useCrmStore } from "@/stores/crm-store";
import { toast } from "@/components/ui/toast";

/**
 * Profile & Settings — mirrors the reference layout: a "Personal Information"
 * form (editable Full Name, fixed Email + Role) beside an account summary
 * card (avatar, identity, account meta rows).
 */
export default function ProfilePage() {
  const { user, users, fetchUsers } = useCrmStore();

  return (
    <div>
      <PageHeader title="Profile & Settings" subtitle="Manage your account information" />

      {!user ? (
        <p className="py-10 text-center text-sm text-muted">Loading profile…</p>
      ) : (
        /* Keyed remount: the form initializes its local state from the
           user snapshot at mount — no setState-in-effect needed. */
        <ProfileForm key={`${user.id}-${user.name}`} user={user} memberCount={users.length} onSaved={fetchUsers} />
      )}
    </div>
  );
}

function ProfileForm({
  user,
  memberCount,
  onSaved,
}: {
  user: { id: string; name: string; email: string; role: string; avatarColor?: string | null };
  memberCount: number;
  onSaved: () => Promise<void>;
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

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Personal information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="flex max-w-xl flex-col gap-5">
              <div className="flex flex-wrap items-center gap-4">
                <Label>Profile Picture</Label>
                <span className="relative">
                  <Avatar name={user.name} color={user.avatarColor} size="lg" />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
                    <Camera className="h-2.5 w-2.5" />
                  </span>
                </span>
                <Button variant="secondary" size="sm" onClick={() => toast.info("Upload Photo", "Profile photo upload is not available in this demo workspace.")}>
                  <Upload className="h-3.5 w-3.5" /> Upload Photo
                </Button>
                <p className="w-full text-xs text-muted">JPG, PNG or GIF. Max 5MB.</p>
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
                <Input id="profile-role" value={user.role === "admin" ? "Admin" : "User"} disabled />
              </div>

              <div>
                <Button onClick={save} disabled={!dirty || saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account summary — the reference stacks four small cards. */}
          <div className="flex flex-col gap-4">
            <Card className="h-fit">
              <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <User className="h-7 w-7" />
                </span>
                <h3 className="mt-1 text-base font-semibold text-foreground">{user.name}</h3>
                <p className="text-xs text-muted">{user.email}</p>
                <span className="mt-1 rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-semibold text-white">User</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-4 text-sm">
                <span className="text-muted">Account Type</span>
                <span className="font-medium text-foreground">User</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-4 text-sm">
                <span className="text-muted">Email Verified</span>
                <span className="font-medium text-success">Yes</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-4 text-sm">
                <span className="text-muted">Security</span>
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <ShieldCheck className="h-4 w-4 text-success" /> Protected
                </span>
              </CardContent>
            </Card>
            <p className="text-center text-xs text-muted">Workspace team: {memberCount} member{memberCount === 1 ? "" : "s"}</p>
          </div>
    </div>
  );
}

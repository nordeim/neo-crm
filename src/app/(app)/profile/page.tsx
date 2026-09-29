"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-parts";
import { useCrmStore } from "@/stores/crm-store";
import { formatDate } from "@/lib/format";

export default function ProfilePage() {
  const router = useRouter();
  const { user, accounts, contacts, leads, activities } = useCrmStore();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profile" subtitle="Your NEO CRM account" />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <Avatar name={user.name} color={user.avatarColor} size="lg" className="h-20 w-20 text-2xl" />
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
            <p className="mt-1 text-xs capitalize text-subtle">Role: {user.role}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Workspace Footprint</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Accounts" value={accounts.length} />
          <Stat label="Contacts" value={contacts.length} />
          <Stat label="Leads" value={leads.length} />
          <Stat label="Activities" value={activities.length} />
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button
          variant="destructive"
          onClick={async () => {
            const { logout } = useCrmStore.getState();
            await logout();
            router.push("/login");
            router.refresh();
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-subtle">Member since {formatDate(new Date())}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-line-soft/60 p-3 text-center">
      <p className="text-xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

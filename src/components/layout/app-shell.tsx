"use client";

import * as React from "react";
import { SidebarNav, BrandMark } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Topbar } from "./topbar";
import { useCrmStore } from "@/stores/crm-store";
import type { User as AppUser } from "@/types";

/**
 * App chrome: fixed desktop sidebar (>= lg), sticky topbar, and the mobile
 * navigation drawer (< lg). The drawer exists specifically because the
 * reference app leaves phone users without navigation — verified fix.
 */
export function AppShell({ user, children }: { user: AppUser; children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const hydrate = useCrmStore((s) => s.hydrate);

  // One-time bootstrap of the client store from the session cookie.
  React.useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar lg:flex">
        <BrandMark />
        <div className="min-h-0 flex-1">
          <SidebarNav />
        </div>
      </aside>

      {/* Mobile drawer */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Content column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar user={user} onOpenMobileNav={() => setMobileNavOpen(true)} mobileNavOpen={mobileNavOpen} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

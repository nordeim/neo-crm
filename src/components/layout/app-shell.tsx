"use client";

import * as React from "react";
import { SidebarNav, BrandMark } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Topbar } from "./topbar";
import { useCrmStore } from "@/stores/crm-store";
import { SHELL_LAYOUT } from "@/lib/page-layout";
import type { User as AppUser } from "@/types";

/**
 * App chrome — session-7 reference model (SHELL_LAYOUT contracts):
 * a `flex h-screen` row holds the sidebar as an IN-FLOW flex child
 * (visible from `md`) and a `flex-1 … overflow-hidden` main column whose
 * `main` is the ONLY scroller (the window never scrolls). The mobile
 * drawer covers `< md` — it remains the deliberate fix for the reference
 * app's missing phone navigation.
 */
export function AppShell({ user, children }: { user: AppUser; children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const hydrate = useCrmStore((s) => s.hydrate);

  // One-time bootstrap of the client store from the session cookie.
  React.useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <div className={SHELL_LAYOUT.root}>
      {/* Desktop sidebar — in-flow flex child, visible from md (768px). */}
      <aside className={SHELL_LAYOUT.sidebar}>
        <BrandMark />
        <div className="min-h-0 flex-1">
          <SidebarNav />
        </div>
      </aside>

      {/* Mobile drawer (< md) — the reference ships no phone navigation. */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Main column: topbar + main scroller. The column is
          overflow-hidden so `main` owns all scrolling; padding lives on
          the inner full-bleed wrapper (p-4 sm:p-8) — no max-width cap, and
          sticky bars (reports) stick to main's top. */}
      <div className={SHELL_LAYOUT.mainColumn}>
        <Topbar user={user} onOpenMobileNav={() => setMobileNavOpen(true)} mobileNavOpen={mobileNavOpen} />
        <main className={SHELL_LAYOUT.main}>
          <div className={SHELL_LAYOUT.inner}>{children}</div>
        </main>
      </div>
    </div>
  );
}

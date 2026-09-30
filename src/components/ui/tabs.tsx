"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TABS_PILL, TABS_SEGMENTED } from "@/lib/page-layout";

// Native-ARIA tab strip. `variant="underline"` matches the reference's
// plain text tabs; `variant="segmented"` renders the segmented control
// used by the Activities priority tabs and the Settings tabs — the
// reference track is `h-9 grid w-full grid-cols-{n} rounded-lg bg-muted
// p-1 text-muted-foreground` with an equal-width column per tab and the
// active tab a raised white pill; `variant="pill"` renders the Reports
// tab bar — white bordered container `grid grid-cols-2 lg:grid-cols-{n}`,
// active tab `bg-blue-50 text-blue-700`.
//
// Session-12 (S12-P4): the tracks carry text-muted-ink (the reference's
// tablist text-muted-foreground — inactive tabs INHERIT #737373 instead
// of carrying gray-500) and the triggers are the reference's STOCK Radix
// classes: natural height (no h-7), transition-all, ring-offset-background,
// the bare `shadow` on the active state (the s6 shadow-sm pin was one step
// light), data-[state=active]:* variants riding a data-state attribute,
// and NO hover classes (the reference ships none on any tab variant).
// The reference's own tabs are all tabIndex=-1 (keyboard-unreachable
// platform defect) — our roving tabindex stays the accessible fix.

interface TabsProps {
  tabs: ReadonlyArray<{ id: string; label: string; count?: number }>;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  variant?: "underline" | "segmented" | "pill";
  /** Equal-width grid columns for segmented/pill tracks (reference: one per tab). */
  cols?: number;
  children: React.ReactNode;
}

// Static class maps — Tailwind v4 scans source for literal class strings, so
// dynamic `grid-cols-${n}` templates would never compile.
const GRID_COLS: Record<number, string> = {
  2: "grid grid-cols-2",
  3: "grid grid-cols-3",
  4: "grid grid-cols-4",
  5: "grid grid-cols-5",
  6: "grid grid-cols-6",
};
const GRID_COLS_LG: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

function Tabs({ tabs, value, onValueChange, className, variant = "underline", cols, children }: TabsProps) {
  const inTrack = variant === "segmented" || variant === "pill";
  const trackClass =
    variant === "segmented"
      ? cn(TABS_SEGMENTED.track, cols && "w-full", cols ? GRID_COLS[cols] ?? null : "flex items-center gap-1 overflow-x-auto scrollbar-thin")
      : variant === "pill"
        ? TABS_PILL.track
        : cn(
            "flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-line",
          );
  const triggerClass = variant === "segmented" ? TABS_SEGMENTED.trigger : variant === "pill" ? TABS_PILL.trigger : null;
  if (inTrack) {
    return (
      <div className={cn("w-full", className)}>
        <div
          role="tablist"
          aria-orientation="horizontal"
          className={trackClass}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === value;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-state={isActive ? "active" : "inactive"}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onValueChange(tab.id)}
                className={cn(
                  // Stock Radix trigger classes from the S12-P4 contracts —
                  // the active styling rides the data-[state=active]
                  // variants, so the string is identical on every tab.
                  triggerClass,
                )}
              >
                {tab.label}
                {typeof tab.count === "number" && (
                  <span
                    className={cn(
                      "ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                      isActive ? "bg-primary/10 text-primary" : "bg-white text-muted",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div role="tabpanel">{children}</div>
      </div>
    );
  }
  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={trackClass}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === value;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onValueChange(tab.id)}
              className={cn(
                "-mb-px whitespace-nowrap rounded-t-md border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:border-line hover:text-foreground",
              )}
            >
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                    isActive ? "bg-primary/10 text-primary" : "bg-line-soft text-muted",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{children}</div>
    </div>
  );
}

export { Tabs };

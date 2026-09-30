"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Native-ARIA tab strip. `variant="underline"` matches the reference's
// plain text tabs; `variant="segmented"` renders the segmented control
// used by the Activities priority tabs and the Settings tabs — the
// reference track is `h-9 grid w-full grid-cols-{n} rounded-lg bg-muted p-1`
// with an equal-width column per tab and the active tab a raised white pill
// (DOM-verified on both pages); `variant="pill"` renders the Reports tab
// bar — white bordered container `grid grid-cols-2 lg:grid-cols-{n}`, active
// tab `bg-blue-50 text-blue-700` (DOM-verified).

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
  const activeClass =
    variant === "segmented"
      ? "bg-white text-foreground shadow-sm"
      : "bg-blue-50 text-blue-700";
  const grid = cols ? GRID_COLS[cols] ?? null : null;
  const trackClass =
    variant === "segmented"
      ? cn(
          "h-9 items-center justify-center rounded-lg bg-line-soft p-1",
          grid && "w-full",
          grid ?? "flex items-center gap-1 overflow-x-auto scrollbar-thin",
        )
      : cn(
          "items-center justify-center rounded-lg border border-line bg-white p-1",
          cols ? cn("grid w-full grid-cols-2", GRID_COLS_LG[cols] ?? "") : "flex items-center gap-1 overflow-x-auto scrollbar-thin",
        );
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
                tabIndex={isActive ? 0 : -1}
                onClick={() => onValueChange(tab.id)}
                className={cn(
                  // Session-9 (S9-16): the reference's tabs focus with a 2px
                // near-black ring + offset (ring-ring ring-offset-2).
                "inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive ? activeClass : "text-muted hover:text-foreground",
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
        className="flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-line"
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

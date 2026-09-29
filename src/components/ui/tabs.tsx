"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Native-ARIA tab strip — matches the reference app's tab bars
// (Reports, Activities priority tabs, Settings).

interface TabsProps {
  tabs: ReadonlyArray<{ id: string; label: string; count?: number }>;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

function Tabs({ tabs, value, onValueChange, className, children }: TabsProps) {
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
                "-mb-px whitespace-nowrap rounded-t-md border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
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

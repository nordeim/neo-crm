"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      // Session-13 (S13-P13): the STOCK shadcn Label — `text-sm font-medium
      // leading-none peer-disabled:cursor-not-allowed
      // peer-disabled:opacity-70` (reference class dump on the New
      // Account dialog, 14px). Ours shipped a 12px text-xs custom with a
      // /80 foreground wash.
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

// Checkbox: native input with an accent-colored appearance — reliable in all
// browsers and preserves full keyboard semantics.

interface CheckboxProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
}

function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const generated = React.useId();
  const inputId = id ?? generated;
  const box = (
    <input
      id={inputId}
      type="checkbox"
      className={cn(
        "h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-gray-300 bg-white transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-disabled disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
  if (!label) return box;
  return (
    <div className="flex items-center gap-2">
      {box}
      <label htmlFor={inputId} className="cursor-pointer select-none text-sm text-foreground">
        {label}
      </label>
    </div>
  );
}

export { Label, Checkbox };

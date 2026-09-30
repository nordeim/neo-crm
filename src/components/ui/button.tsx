"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { BUTTON_BASE } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

// Session-9 (S9-1, S9-16): the reference's text buttons carry `mr-2` ON
// their icons in addition to the flex gap-2 — a measured 16px icon-text
// gap (ours was 8px); icon-only buttons get no margin (only-child guard).
// Focus rings are 1px near-black (`ring-ring`, --color-ring = #0a0a0a).
const buttonVariants = cva(
  cn(
    // Session-13 (S13-P3): rounded-md — the reference renders 6px radius
    // on EVERY button (computed sweep, all pages + dialogs + icon
    // buttons). Ours shipped rounded-lg on the base.
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    BUTTON_BASE.iconGap,
    BUTTON_BASE.focusRing,
  ),
  {
    variants: {
      variant: {
        // Session-17 (S17-P4): BARE shadow — the reference's blue
        // primaries (New Account/Lead/Event/Contact + the activities
        // Filter) compute rgba(0,0,0,.1) 0 1px 3px 0 (the bare scale);
        // shadow-sm was one step light under the s9-re-pinned scale.
        default: "bg-primary text-primary-foreground shadow hover:bg-primary-hover",
        secondary: "bg-white text-foreground border border-line shadow-sm hover:bg-line-soft",
        // Session-17 (S17-P5): NO base text color — the stock ghost. The
        // reference's ghost carries only the hover pair; its one
        // text-bearing ghost ("Save All") renders the inherited #0a0a0a.
        // Our old text-muted rendered it gray.
        ghost: "hover:bg-line-soft hover:text-foreground",
        destructive: "bg-danger text-white shadow-sm hover:bg-red-600",
        sidebar: "bg-white/10 text-white hover:bg-white/20",
        outline: "border border-line bg-surface text-foreground shadow-sm hover:bg-line-soft",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
        iconSm: "h-7 w-7 rounded-md",
        pill: "rounded-full px-4 py-1.5 h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

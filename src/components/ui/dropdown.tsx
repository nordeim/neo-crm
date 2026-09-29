"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

// Lightweight dropdown built on @radix-ui/react-popover (already a project
// dependency) with menu semantics — click-to-toggle, outside-press closes,
// items render as buttons/links by the caller.

const Dropdown = PopoverPrimitive.Root;
const DropdownTrigger = PopoverPrimitive.Trigger;

function DropdownContent({
  className,
  align = "end",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-[60] min-w-[10rem] overflow-hidden rounded-lg border border-line bg-surface p-1 text-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function DropdownItem({
  className,
  destructive = false,
  ...props
}: React.ComponentProps<"button"> & { destructive?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-line-soft focus-visible:bg-line-soft",
        destructive ? "text-danger hover:bg-danger-soft" : "text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DropdownSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("-mx-1 my-1 h-px bg-line", className)} {...props} />;
}

function DropdownLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-2 py-1.5 text-xs font-medium text-muted", className)} {...props} />;
}

export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator, DropdownLabel };

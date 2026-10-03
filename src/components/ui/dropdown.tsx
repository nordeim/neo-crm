"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { MENU_CONTENT, MENU_ITEM } from "@/lib/page-layout";

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
        onClick={(e) => {
          props.onClick?.(e);
          // Session-46 (S46-P7): click containment — the items render in
          // a portal, but React synthetic clicks still bubble through the
          // REACT tree to clickable ancestors (a TableRow's onClick), so
          // every row-menu action ALSO opened the row-click dialog (the
          // F-46g ghost). Item handlers run first; the bubbling stops
          // here. Radix's composeEventHandlers does not stop it for us
          // (source-verified in @radix-ui/primitive).
          e.stopPropagation();
        }}
      />
    </PopoverPrimitive.Portal>
  );
}

function DropdownItem({
  className,
  destructive = false,
  ...props
}: React.ComponentProps<"button"> & { destructive?: boolean }) {
  // Session-29 (S29-P2): items close the popover on click — the
  // reference's ⋮ menus are real Radix DropdownMenus whose items
  // auto-close on select (its DEAD "Convert to Opportunity" item closes
  // the menu too). PopoverPrimitive.Close composes with the child's own
  // onClick (the caller's handler runs, then the popover closes).
  return (
    <PopoverPrimitive.Close asChild>
      <button
        type="button"
        className={cn(
          "flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-line-soft focus-visible:bg-line-soft",
          destructive ? "text-danger hover:bg-danger-soft" : "text-foreground",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Close>
  );
}

function DropdownSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("-mx-1 my-1 h-px bg-line", className)} {...props} />;
}

function DropdownLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-2 py-1.5 text-xs font-medium text-muted", className)} {...props} />;
}

export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator, DropdownLabel };

// ---------------------------------------------------------------------------
// Session-13 (S13-P4): the STOCK account-menu primitives. The reference's
// topbar account menu is a real Radix DropdownMenu (role=menu with
// menuitems, z-50/rounded-md/shadow-md surface, rounded-sm items with
// focus:bg-accent + cursor-default) — class-dumped on the live reference
// (2026-09-30). The Popover-based Dropdown above stays for our superset
// menus (row actions, quick-create — unverifiable on the zero-data
// reference). Token VALUES are preserved via our own variables where the
// reference uses popover tokens (bg-popover = our --color-surface white,
// border = --color-line #e5e5e5, text = --color-foreground).
// ---------------------------------------------------------------------------

const Menu = DropdownMenuPrimitive.Root;
const MenuTrigger = DropdownMenuPrimitive.Trigger;

function MenuContent({
  className,
  align = "end",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(MENU_CONTENT, className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function MenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return <DropdownMenuPrimitive.Item className={cn(MENU_ITEM, className)} {...props} />;
}

export { Menu, MenuTrigger, MenuContent, MenuItem };

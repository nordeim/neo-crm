import * as React from "react";
import { CARD } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  // Session-7: the reference's bordered cards (settings picklists, calendar
  // cards, KPI stat cards, filter rails) carry `shadow`, not `shadow-sm`.
  return (
    <div
      className={cn("rounded-xl border border-line bg-surface shadow", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  // Session-9 (S9-3): the reference renders card titles as DIVs
  // (`div.font-semibold.tracking-tight.text-base.sm:text-lg` — no heading
  // semantics on any card except the activities h2s and the profile name
  // h3, both separately pinned). Color is inherited from the card
  // foreground, not an explicit class.
  return <div className={cn(CARD.title, className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-xs text-muted", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

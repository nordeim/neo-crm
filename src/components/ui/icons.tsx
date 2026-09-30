import * as React from "react";
import { cn } from "@/lib/utils";

/** Session-17 (S17-P2b): the reference's Filter/Filters buttons ship the
 *  OLD lucide `filter` — the straight-edged POLYGON funnel
 *  (`<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3">`,
 *  class-dumped on the live reference 2026-09-30). lucide-react 0.525
 *  renamed that icon `funnel` AND redesigned it to a curved outline, then
 *  re-exported the new glyph as `Filter` — the old polygon is exported by
 *  NO name in 0.525 (verified against the package source), so it lives
 *  here as a hand-rolled SVG with lucide-compatible construction
 *  (24×24 viewBox, currentColor stroke, strokeWidth/linecap/linejoin
 *  defaults, className passthrough). Used by the dashboard `Filter`,
 *  leads `Filters` and contacts `Filters` buttons. */
export function FilterPolygon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      // the lucide namespacing classes carry no styles — they keep icon
      // censuses / class-level probes comparable with real lucide icons
      className={cn("lucide lucide-filter", className)}
      aria-hidden="true"
      {...props}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

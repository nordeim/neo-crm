"use client";

import * as React from "react";
// Session-17 (S17-P2e): the reference's calendar KPI chips ship
// `calendar` (blank body — CalendarDays adds day dots) and `users`
// (two-person — User is one).
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  MessageCircle,
  Pen,
  Phone,
  Plus,
  Search,
  Target,
  Users,
} from "lucide-react";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox, Label } from "@/components/ui/label";
import { PageHeader, TrendStatCard } from "@/components/shared/page-parts";
import { EventDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
// Session-53 (S53-P3, N-53c): the import list narrowed to the live set —
// seven s27-era orphans retired (Clock, Badge, EVENT_TYPE_META,
// EVENT_STATUS_META, formatTime, timeUntil, EMPTY_STATE — each had only
// its import as the in-file reference; EVENT_STATUS_META went fully
// src-dead with it, retired from constants.ts the s48/s49 way).
import { EVENT_TYPE_CHIP } from "@/lib/constants";
import {
  addDays,
  calendarFetchBounds,
  calendarGrid,
  formatDate,
  formatMonthDayTime,
  formatMonthYear,
  isSameDay,
  startOfWeek,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  CALENDAR_CARD,
  FILTER_RAIL,
  PAGE_KPI_GRIDS,
  PAGE_ROOT,
  RAIL_LAYOUT,
} from "@/lib/page-layout";
import type { CrmEvent } from "@/types";

/** Reference filter vocabulary — six type options (incl. Reminders/Demos). */
const TYPE_FILTERS = [
  { id: "appointment", label: "Appointments" },
  { id: "call", label: "Calls" },
  { id: "meeting", label: "Meetings" },
  { id: "task", label: "Tasks" },
  { id: "reminder", label: "Reminders" },
  { id: "demo", label: "Demos" },
];

const DATE_FILTERS = [
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "this_week", label: "This Week" },
  { id: "next_week", label: "Next Week" },
] as const;

type DateFilter = (typeof DATE_FILTERS)[number]["id"];

function inRange(day: Date, filter: DateFilter): boolean {
  const today = new Date();
  switch (filter) {
    case "today":
      return isSameDay(day, today);
    case "tomorrow":
      return isSameDay(day, addDays(today, 1));
    case "this_week": {
      const start = startOfWeek(today, "sunday");
      const end = addDays(start, 7);
      return day >= start && day < end;
    }
    case "next_week": {
      const start = addDays(startOfWeek(today, "sunday"), 7);
      const end = addDays(start, 7);
      return day >= start && day < end;
    }
  }
}

/**
 * Session-54 (S54-P1, N-54a): the visible-events filter, extracted to a
 * module-scope pure function and called plainly — the old `useMemo`
 * NEVER cached (deps [events, activeTypes, activeDates, query] included
 * the fresh `.filter().map()` identities at activeTypes/activeDates), the
 * same N-53d class the leads wonVsLost memo had. The body is verbatim.
 */
function buildVisibleEvents(
  events: CrmEvent[],
  activeTypes: string[],
  activeDates: DateFilter[],
  query: string,
): CrmEvent[] {
  return events.filter((e) => {
    if (activeTypes.length > 0 && !activeTypes.includes(e.type)) return false;
    if (activeDates.length > 0 && !activeDates.some((d) => inRange(new Date(e.startAt), d))) return false;
    // Session-7: the reference re-added a header search ("Search
    // events...") — ours filters by event title (functional superset;
    // the live control is inert at zero data).
    const q = query.trim().toLowerCase();
    if (q && !e.title.toLowerCase().includes(q)) return false;
    return true;
  });
}

export default function CalendarPage() {
  const { events, hydrated, fetchEvents, deleteEvent } = useCrmStore();
  const [cursor, setCursor] = React.useState(() => new Date()); // any date inside the visible month
  const [selectedDay, setSelectedDay] = React.useState(() => new Date());
  const [filters, setFilters] = React.useState<Record<string, boolean>>({});
  const [query, setQuery] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CrmEvent | null>(null);
  const [defaultStart, setDefaultStart] = React.useState<Date | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  React.useEffect(() => {
    if (!hydrated) return;
    // Session-51 (N-51a): the window comes from the seam — its `to` bound
    // covers the UNTRIMMED grid's last day, so the trailing next-month
    // cells keep their events after a month flip (the old month-end
    // bound lost them: the s45 token makes this fetch authoritative).
    const { from, to } = calendarFetchBounds(year, month);
    fetchEvents(from, to);
  }, [hydrated, year, month, fetchEvents]);

  const activeTypes = TYPE_FILTERS.filter((t) => filters[t.id]).map((t) => t.id);
  const activeDates = DATE_FILTERS.filter((d) => filters[d.id]).map((d) => d.id);
  // Session-54 (S54-P1): the plain call — the memo wrapper never cached
  // (see buildVisibleEvents above).
  const visible = buildVisibleEvents(events, activeTypes, activeDates, query);

  // Sunday-anchored grid with leading days, trimmed to whole weeks actually
  // needed (the reference shows previous-month days like Aug 30/31).
  const days = React.useMemo(() => {
    const grid = calendarGrid(year, month, "sunday", true);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lead = grid.findIndex((d) => d.getMonth() === month && d.getDate() === 1);
    const weeks = Math.max(Math.ceil((lead + daysInMonth) / 7), 4);
    return grid.slice(0, weeks * 7);
  }, [year, month]);
  const today = new Date();

  // Session-54 (S54-P1): the plain form — the useCallback wrapper (deps
  // [visible]) recreated every render anyway (visible never cached), and
  // eventsOn is called only during render (the KPI rows + the days map).
  const eventsOn = (day: Date) =>
    visible.filter((e) => isSameDay(new Date(e.startAt), day)).sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

  const weekStart = startOfWeek(today, "sunday");
  const weekEnd = addDays(weekStart, 7);
  const lastWeekStart = addDays(weekStart, -7);

  const upcoming = visible
    .filter((e) => new Date(e.startAt) >= today && e.status !== "cancelled")
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt))
    .slice(0, 6);

  // Green trend texts (reference shows "^ +N" deltas per card).
  const trend = (current: number, previous: number) =>
    current === previous ? "±0" : current > previous ? `+${current - previous}` : `-${previous - current}`;

  const todaysEvents = eventsOn(today);
  const yesterdaysEvents = visible.filter((e) => isSameDay(new Date(e.startAt), addDays(today, -1))).length;
  const meetingsThisWeek = visible.filter(
    (e) => e.type === "meeting" && new Date(e.startAt) >= weekStart && new Date(e.startAt) < weekEnd,
  ).length;
  const meetingsLastWeek = visible.filter(
    (e) => e.type === "meeting" && new Date(e.startAt) >= lastWeekStart && new Date(e.startAt) < weekStart,
  ).length;
  const callsThisWeek = visible.filter(
    (e) => e.type === "call" && new Date(e.startAt) >= weekStart && new Date(e.startAt) < weekEnd,
  ).length;
  const callsLastWeek = visible.filter(
    (e) => e.type === "call" && new Date(e.startAt) >= lastWeekStart && new Date(e.startAt) < weekStart,
  ).length;

  function openNewEvent(day?: Date) {
    const start = day ? new Date(day) : new Date();
    if (!day) {
      start.setHours(start.getHours() + 1, 0, 0, 0);
    } else {
      start.setHours(9, 0, 0, 0);
    }
    setEditing(null);
    setDefaultStart(start);
    setDialogOpen(true);
  }

  return (
    // Session-16 (S16-P2): the page owns its padding — the reference's
    // calendar root is `p-4 sm:p-8 bg-gray-50 min-h-screen`.
    <div className={PAGE_ROOT.standard}>
      <PageHeader
        title="Calendar"
        subtitle="Manage your schedule and events"
        subtitleSize="sm"
        actions={
          <>
            {/* Session-7 (S7-13): the reference re-added a header search —
                `relative flex-1 sm:flex-none sm:w-64` wrapper, pl-9 h-9 input. */}
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                aria-label="Search events"
                className="h-9 pl-9"
              />
            </div>
            <Button onClick={() => openNewEvent()}>
              <Plus className="h-4 w-4 mr-2" /> New Event
            </Button>
          </>
        }
      />

      {/* Session-7 stat-card re-pin (STAT_CARD contracts): 40px -50 chips,
          h-5 w-5 icons, green-600 trends, label under the value. */}
      <div className={PAGE_KPI_GRIDS.calendar}>
        <TrendStatCard
          label="Today's Events"
          value={todaysEvents.length}
          trend={trend(todaysEvents.length, yesterdaysEvents)}
          icon={<Calendar className="h-5 w-5" />}
          chipBg="bg-blue-50"
          chipIconClass="text-blue-600"
        />
        <TrendStatCard
          label="Total Events"
          value={visible.length}
          trend={`+${visible.length}`}
          icon={<Target className="h-5 w-5" />}
          chipBg="bg-green-50"
          chipIconClass="text-green-600"
        />
        <TrendStatCard
          label="Meetings This Week"
          value={meetingsThisWeek}
          trend={trend(meetingsThisWeek, meetingsLastWeek)}
          icon={<Users className="h-5 w-5" />}
          chipBg="bg-purple-50"
          chipIconClass="text-purple-600"
        />
        <TrendStatCard
          label="Calls This Week"
          value={callsThisWeek}
          trend={trend(callsThisWeek, callsLastWeek)}
          icon={<Phone className="h-5 w-5" />}
          chipBg="bg-orange-50"
          chipIconClass="text-orange-600"
        />
      </div>

      {/* Session-6 (S6-9): reference layout = flex gap-6 — flex-1 column
          (month card p-4 sm:p-6 mb-6, then Upcoming/Agenda in
          lg:grid-cols-2) + a w-80 Filters rail visible from lg. */}
      <div className={RAIL_LAYOUT.row}>
        <div className={RAIL_LAYOUT.content}>
        {/* Month card — Session-16 (S16-P7): the reference's FLAT anatomy
            (padding ON the card, three direct children): the header row
            (h2 text-xl sm:text-2xl font-bold text-gray-900 + the gap-2
            nav), the DOW grid (gap-1 sm:gap-2 mb-2, seven text-xs
            sm:text-sm font-semibold text-gray-600 py-2 labels), and the
            month grid (gap-1 sm:gap-2). Ours had merged the DOW labels
            + the cells into ONE 42-child grid behind a
            padding-neutralized CardHeader/CardContent pair — 16px
            header gap vs 24px, 4px DOW gap vs 8px, an 18px semibold
            title vs 20/24px bold. The month heading stays an h2
            (a11y-verified level 2). */}
        <Card className={CALENDAR_CARD.root}>
          <div className={CALENDAR_CARD.headerRow}>
            <h2 className={CALENDAR_CARD.title}>{formatMonthYear(cursor)}</h2>
            <div className={CALENDAR_CARD.navRow}>
              {/* Session-7: outline h-9 w-9 nav icons; Today is outline and
                  hidden below sm (live pins). */}
              <Button variant="outline" size="icon" aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden sm:flex"
                onClick={() => {
                  const now = new Date();
                  setCursor(now);
                  setSelectedDay(now);
                }}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={CALENDAR_CARD.dowGrid}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className={CALENDAR_CARD.dowLabel}>
                {d}
              </div>
            ))}
          </div>
          <div className={CALENDAR_CARD.monthGrid}>
              {days.map((day) => {
                const inMonth = day.getMonth() === month;
                const isToday = isSameDay(day, today);
                const isSelected = isSameDay(day, selectedDay);
                const dayEvents = eventsOn(day);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    onDoubleClick={() => openNewEvent(day)}
                    className={cn(
                      // Session-13 (S13-P7): the reference's literal state
                      // classes — out-of-month cells KEEP the default
                      // border (bg-gray-50 text-gray-400) and current
                      // cells hover to the gray-50 wash; transition-all.
                      // Our cells stay BUTTONS (the clickable superset) —
                      // the focus ring is the only interactive extra.
                      "flex min-h-20 flex-col items-stretch rounded-lg border p-1 text-left transition-all sm:min-h-24 sm:p-2",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                      // Exclusive ternary chain — the selected/today cell
                      // carries NO hover (the reference's blue pill is
                      // inert); the hover wash belongs to the plain
                      // current-month cells only.
                      isSelected
                        ? "border-sidebar bg-sidebar text-white"
                        : inMonth
                          ? "border-line bg-white hover:bg-gray-50"
                          : "border-line bg-gray-50 text-gray-400",
                    )}
                    aria-label={`${formatDate(day)} — ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`}
                    aria-pressed={isSelected}
                  >
                    {/* Session-27 (S27-P11, bundle-extracted): the day
                        number is PLAIN TEXT (text-xs sm:text-sm
                        font-medium mb-1, text-white on today) — the
                        scaffold's h-6 w-6 rounded-full circle pill is
                        retired. */}
                    <span className={cn("text-xs sm:text-sm font-medium mb-1", isToday || isSelected ? "text-white" : "")}>
                      {day.getDate()}
                    </span>
                    <span className="mt-auto flex flex-col gap-0.5">
                      {dayEvents.slice(0, 2).map((e) => {
                        // Defensive DB-read posture (s65 N-65l, the s63
                        // family): Event.type is PERSISTED data — an
                        // unexpected key degrades to the meeting chip
                        // instead of crashing the render (same arm at the
                        // upcoming-bar + agenda-row sites below).
                        const chip = EVENT_TYPE_CHIP[e.type] ?? EVENT_TYPE_CHIP.meeting;
                        return (
                          <span
                            key={e.id}
                            title={e.title}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setEditing(e);
                              setDefaultStart(null);
                              setDialogOpen(true);
                            }}
                            className={cn(
                              "cursor-pointer truncate rounded px-1 py-0.5 text-xs",
                              isSelected
                                ? "bg-white/20 text-white"
                                : `${chip.bg} ${chip.text}`,
                            )}
                          >
                            <span
                              className={cn("inline-block w-1.5 h-1.5 rounded-full mr-1", isSelected ? "bg-white" : chip.dot)}
                            />
                            {e.title}
                          </span>
                        );
                      })}
                      {/* The "+N more" overflow — a SEPARATE line after the
                          chips (the reference reads "+N more", never the
                          scaffold's inline "+N"). */}
                      {dayEvents.length > 2 && (
                        <span className={cn("text-xs", isSelected ? "text-white" : "text-gray-500")}>
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
          </div>
        </Card>

        {/* Upcoming + Agenda — session-6: lg:grid-cols-2 gap-6 inside the
            flex-1 column (below the month card). */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Session-9: the reference renders these two rail cards with
              p-6 ON the card (no header/content split) and a literal h3
              title (text-lg font-semibold mb-4) — unlike the CardTitle
              divs everywhere else. */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Upcoming Events</h3>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No upcoming events</p>
              ) : (
                upcoming.map((e) => {
                  /* Session-27 (S27-P11, bundle-extracted): the TALL-BAR
                      row family — a w-2 h-12 rounded-full type-colored
                      bar + title + "MMM d, h:mm a" + the related line +
                      three ghost icon actions (Pen / Phone-on-call /
                      MessageCircle). */
                  const chip = EVENT_TYPE_CHIP[e.type] ?? EVENT_TYPE_CHIP.meeting; // defensive DB-read (see the day-cell note)
                  return (
                    <div key={e.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <div className={cn("w-2 h-12 rounded-full", chip.dot)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900">{e.title}</p>
                        <p className="text-sm text-gray-600">{formatMonthDayTime(e.startAt)}</p>
                        {(e.account?.name ?? e.contact?.name) && (
                          <p className="text-xs text-gray-500">
                            {e.relatedType ?? "Contact"}: {e.account?.name ?? e.contact?.name}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Edit event"
                          onClick={() => {
                            setEditing(e);
                            setDefaultStart(null);
                            setDialogOpen(true);
                          }}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                        {/* S54-P4: the reference's own inert affordances —
                            the agenda Phone/Message pair carries NO
                            onClick in the reference's bundle (the
                            Pen/Edit before them does; bundle-verified
                            session-54); mirrored. */}
                        {e.type === "call" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Call contact">
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Message contact">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Agenda View</h3>
            <div className="space-y-3">
              {/* Session-27 (S27-P11, bundle-extracted): the agenda is the
                  FILTERED events list (search + type + date filters,
                  slice(0,10)) — NOT the selected-day list our scaffold
                  invented — and each row is the 40×40 TINTED SQUARE family
                  with the Edit/Delete actions in an EllipsisVertical
                  dropdown. */}
              {visible.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No events found</p>
              ) : (
                visible.slice(0, 10).map((e) => {
                  const chip = EVENT_TYPE_CHIP[e.type] ?? EVENT_TYPE_CHIP.meeting; // defensive DB-read (see the day-cell note)
                  return (
                    <div key={e.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", chip.bg)}>
                        <div className={cn("w-2 h-2 rounded-full", chip.dot)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900">{e.title}</p>
                        <p className="text-sm text-gray-600">{formatMonthDayTime(e.startAt)}</p>
                        {(e.account?.name ?? e.contact?.name) && (
                          <p className="text-xs text-gray-500">
                            {e.relatedType ?? "Contact"}: {e.account?.name ?? e.contact?.name}
                          </p>
                        )}
                      </div>
                      <Dropdown>
                        <DropdownTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Event actions">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownContent align="end">
                          <DropdownItem
                            onClick={() => {
                              setEditing(e);
                              setDefaultStart(null);
                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            className="text-red-600"
                            onClick={async () => {
                              if (window.confirm(`Delete "${e.title}"?`)) {
                                const res = await deleteEvent(e.id);
                                // Session-46 (S46-P1): the failure convention.
                                if (!res.ok) toast.error("Could not delete event", res.error);
                              }
                            }}
                          >
                            Delete
                          </DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
        </div>

        {/* Filter rail — session-6: w-80, visible from lg (reference). The
            calendar header is the outlier: the title element ITSELF carries
            the flex row (no nested headerRow div) and its action is a blue
            text link (Clear All), not a ghost button. */}
        <div className={RAIL_LAYOUT.rail}>
          <Card>
            <CardHeader className={FILTER_RAIL.headerPad}>
              <CardTitle className={FILTER_RAIL.titleWithAction}>
                Filters
                <button type="button" className={FILTER_RAIL.clearAllLink} onClick={() => setFilters({})}>
                  Clear All
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className={FILTER_RAIL.body}>
              <div>
                <Label className={FILTER_RAIL.groupLabel}>Type</Label>
                <div className={FILTER_RAIL.checkboxStack}>
                  {TYPE_FILTERS.map((t) => (
                    <Checkbox
                      key={t.id}
                      checked={filters[t.id] ?? false}
                      onCheckedChange={(v) => setFilters((f) => ({ ...f, [t.id]: v }))}
                      label={t.label}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label className={FILTER_RAIL.groupLabel}>Date</Label>
                <div className={FILTER_RAIL.checkboxStack}>
                  {DATE_FILTERS.map((d) => (
                    <Checkbox
                      key={d.id}
                      checked={filters[d.id] ?? false}
                      onCheckedChange={(v) => setFilters((f) => ({ ...f, [d.id]: v }))}
                      label={d.label}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EventDialog open={dialogOpen} onOpenChange={setDialogOpen} event={editing} defaultStart={defaultStart} />
    </div>
  );
}

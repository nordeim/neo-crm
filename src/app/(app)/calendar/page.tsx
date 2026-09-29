"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Phone, Plus, Search, Target, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader, TrendStatCard } from "@/components/shared/page-parts";
import { EventDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { EVENT_TYPE_META, EVENT_STATUS_META } from "@/lib/constants";
import {
  addDays,
  calendarGrid,
  endOfDay,
  formatDate,
  formatMonthYear,
  formatTime,
  isSameDay,
  startOfWeek,
  timeUntil,
} from "@/lib/format";
import { cn } from "@/lib/utils";
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

export default function CalendarPage() {
  const { events, hydrated, fetchEvents, deleteEvent } = useCrmStore();
  const [cursor, setCursor] = React.useState(() => new Date()); // any date inside the visible month
  const [selectedDay, setSelectedDay] = React.useState(() => new Date());
  const [filters, setFilters] = React.useState<Record<string, boolean>>({});
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CrmEvent | null>(null);
  const [defaultStart, setDefaultStart] = React.useState<Date | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  React.useEffect(() => {
    if (!hydrated) return;
    const from = new Date(year, month - 1, 1).toISOString();
    const to = endOfDay(new Date(year, month + 1, 0)).toISOString();
    fetchEvents(from, to);
  }, [hydrated, year, month, fetchEvents]);

  const activeTypes = TYPE_FILTERS.filter((t) => filters[t.id]).map((t) => t.id);
  const activeDates = DATE_FILTERS.filter((d) => filters[d.id]).map((d) => d.id);
  const visible = React.useMemo(
    () =>
      events.filter((e) => {
        if (activeTypes.length > 0 && !activeTypes.includes(e.type)) return false;
        if (activeDates.length > 0 && !activeDates.some((d) => inRange(new Date(e.startAt), d))) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          if (!(e.title.toLowerCase().includes(q) || (e.location ?? "").toLowerCase().includes(q))) return false;
        }
        return true;
      }),
    [events, activeTypes, activeDates, search],
  );

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

  const eventsOn = React.useCallback(
    (day: Date) => visible.filter((e) => isSameDay(new Date(e.startAt), day)).sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt)),
    [visible],
  );

  const weekStart = startOfWeek(today, "sunday");
  const weekEnd = addDays(weekStart, 7);
  const lastWeekStart = addDays(weekStart, -7);

  const upcoming = visible
    .filter((e) => new Date(e.startAt) >= today && e.status !== "cancelled")
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt))
    .slice(0, 6);

  const dayAgenda = eventsOn(selectedDay);

  // Green trend texts (reference shows "^ +N" deltas per card).
  const trend = (current: number, previous: number) =>
    current === previous ? "±0" : current > previous ? `+${current - previous}` : `-${previous - current}`;

  const todaysEvents = eventsOn(today);
  const yesterdaysEvents = events.filter((e) => isSameDay(new Date(e.startAt), addDays(today, -1))).length;
  const meetingsThisWeek = visible.filter(
    (e) => e.type === "meeting" && new Date(e.startAt) >= weekStart && new Date(e.startAt) < weekEnd,
  ).length;
  const meetingsLastWeek = events.filter(
    (e) => e.type === "meeting" && new Date(e.startAt) >= lastWeekStart && new Date(e.startAt) < weekStart,
  ).length;
  const callsThisWeek = visible.filter(
    (e) => e.type === "call" && new Date(e.startAt) >= weekStart && new Date(e.startAt) < weekEnd,
  ).length;
  const callsLastWeek = events.filter(
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
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Manage your schedule and events"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="pl-9" aria-label="Search events" />
            </div>
            <Button onClick={() => openNewEvent()}>
              <Plus className="h-4 w-4" /> New Event
            </Button>
          </div>
        }
      />

      {/* Reference stat cards: icon chip top-left, green trend top-right. */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <TrendStatCard
          label="Today's Events"
          value={todaysEvents.length}
          trend={trend(todaysEvents.length, yesterdaysEvents)}
          icon={<CalendarDays className="h-4 w-4" />}
          color="#3b82f6"
        />
        <TrendStatCard
          label="Total Events"
          value={visible.length}
          trend={`+${visible.length}`}
          icon={<Target className="h-4 w-4" />}
          color="#14b8a6"
        />
        <TrendStatCard
          label="Meetings This Week"
          value={meetingsThisWeek}
          trend={trend(meetingsThisWeek, meetingsLastWeek)}
          icon={<User className="h-4 w-4" />}
          color="#8b5cf6"
        />
        <TrendStatCard
          label="Calls This Week"
          value={callsThisWeek}
          trend={trend(callsThisWeek, callsLastWeek)}
          icon={<Phone className="h-4 w-4" />}
          color="#f97316"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Month grid */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">{formatMonthYear(cursor)}</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="iconSm" aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  setCursor(now);
                  setSelectedDay(now);
                }}
              >
                Today
              </Button>
              <Button variant="secondary" size="iconSm" aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <span key={d} className="pb-1 text-[11px] font-semibold tracking-wide text-subtle">
                  {d}
                </span>
              ))}
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
                      "flex min-h-[72px] flex-col items-stretch rounded-lg border p-1.5 text-left transition-colors",
                      "hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                      inMonth ? "border-line bg-white" : "border-transparent bg-line-soft/50 text-subtle",
                      isSelected && "border-primary ring-1 ring-primary/30",
                    )}
                    aria-label={`${formatDate(day)} — ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`}
                    aria-pressed={isSelected}
                  >
                    <span className="flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                          isToday ? "bg-primary text-white" : inMonth ? "text-foreground" : "text-subtle",
                        )}
                      >
                        {day.getDate()}
                      </span>
                      {dayEvents.length > 2 && <span className="text-[10px] text-muted">+{dayEvents.length - 2}</span>}
                    </span>
                    <span className="mt-auto flex flex-col gap-0.5">
                      {dayEvents.slice(0, 2).map((e) => (
                        <span
                          key={e.id}
                          className="truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight text-white"
                          style={{ backgroundColor: EVENT_TYPE_META[e.type]?.color ?? "#6b7280" }}
                        >
                          {formatTime(e.startAt)} {e.title}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {upcoming.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted">No upcoming events</p>
              ) : (
                upcoming.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className="flex items-start gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-line-soft"
                    onClick={() => {
                      setEditing(e);
                      setDefaultStart(null);
                      setDialogOpen(true);
                    }}
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: EVENT_TYPE_META[e.type]?.color }} />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium text-foreground">{e.title}</span>
                      <span className="block text-[11px] text-muted">
                        {formatDate(e.startAt)} · {formatTime(e.startAt)} · {timeUntil(e.startAt)}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Agenda View</CardTitle>
              <span className="text-xs text-muted">{formatDate(selectedDay)}</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {dayAgenda.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted">No events found</p>
              ) : (
                dayAgenda.map((e) => (
                  <div key={e.id} className="rounded-lg border border-line p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{e.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                          <Clock className="h-3 w-3" /> {formatTime(e.startAt)}
                          {e.location && <span className="truncate">· {e.location}</span>}
                        </p>
                      </div>
                      <Badge variant="outline" className={EVENT_STATUS_META[e.status]?.badge}>
                        {EVENT_STATUS_META[e.status]?.label ?? e.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(e); setDefaultStart(null); setDialogOpen(true); }}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger hover:bg-danger-soft"
                        onClick={async () => {
                          if (window.confirm(`Delete "${e.title}"?`)) await deleteEvent(e.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
                Clear All
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <p className="text-xs font-medium text-muted">Type</p>
              {TYPE_FILTERS.map((t) => (
                <Checkbox
                  key={t.id}
                  checked={filters[t.id] ?? false}
                  onChange={(e) => setFilters((f) => ({ ...f, [t.id]: e.target.checked }))}
                  label={t.label}
                />
              ))}
              <p className="mt-2 text-xs font-medium text-muted">Date</p>
              {DATE_FILTERS.map((d) => (
                <Checkbox
                  key={d.id}
                  checked={filters[d.id] ?? false}
                  onChange={(e) => setFilters((f) => ({ ...f, [d.id]: e.target.checked }))}
                  label={d.label}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <EventDialog open={dialogOpen} onOpenChange={setDialogOpen} event={editing} defaultStart={defaultStart} />
    </div>
  );
}

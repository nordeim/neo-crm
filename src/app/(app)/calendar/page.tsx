"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/label";
import { KpiCard, PageHeader } from "@/components/shared/page-parts";
import { EventDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { EVENT_TYPE_META, EVENT_STATUS_META } from "@/lib/constants";
import { calendarGrid, endOfDay, formatDate, formatMonthYear, formatTime, isSameDay, monthName, startOfWeek, timeUntil } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CrmEvent } from "@/types";

const TYPE_FILTERS = [
  { id: "appointment", label: "Appointments" },
  { id: "call", label: "Calls" },
  { id: "meeting", label: "Meetings" },
  { id: "task", label: "Tasks" },
];

export default function CalendarPage() {
  const { events, hydrated, fetchEvents, deleteEvent } = useCrmStore();
  const [cursor, setCursor] = React.useState(() => new Date()); // any date inside the visible month
  const [selectedDay, setSelectedDay] = React.useState(() => new Date());
  const [filters, setFilters] = React.useState<Record<string, boolean>>({});
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
  const visible = React.useMemo(
    () => (activeTypes.length > 0 ? events.filter((e) => activeTypes.includes(e.type)) : events),
    [events, activeTypes],
  );

  const days = React.useMemo(() => calendarGrid(year, month, "monday", false), [year, month]);
  const today = new Date();

  const eventsOn = React.useCallback(
    (day: Date) => visible.filter((e) => isSameDay(new Date(e.startAt), day)).sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt)),
    [visible],
  );

  const weekStart = startOfWeek(today, "monday");
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const upcoming = visible
    .filter((e) => new Date(e.startAt) >= today && e.status !== "cancelled")
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt))
    .slice(0, 6);

  const dayAgenda = eventsOn(selectedDay);

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
          <Button onClick={() => openNewEvent()}>
            <Plus className="h-4 w-4" /> New Event
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Today's Events" value={eventsOn(today).length} hint="scheduled today" />
        <KpiCard label="Total Events" value={events.length} hint="in view" />
        <KpiCard
          label="Meetings This Week"
          value={visible.filter((e) => e.type === "meeting" && new Date(e.startAt) >= weekStart && new Date(e.startAt) < weekEnd).length}
          hint="Mon – Sun"
        />
        <KpiCard
          label="Calls This Week"
          value={visible.filter((e) => e.type === "call" && new Date(e.startAt) >= weekStart && new Date(e.startAt) < weekEnd).length}
          hint="Mon – Sun"
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
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d} className="pb-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">
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
            </CardContent>
          </Card>
        </div>
      </div>

      <EventDialog open={dialogOpen} onOpenChange={setDialogOpen} event={editing} defaultStart={defaultStart} />
    </div>
  );
}

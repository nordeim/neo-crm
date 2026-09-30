"use client";

import * as React from "react";
import {
  CheckCircle2,
  Circle,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Trash2,
  Video,
} from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox, Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { BarStatCard, PageHeader } from "@/components/shared/page-parts";
import { ActivityDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { ACTIVITY_TYPE_META, ACTIVITY_STATUS_META, CHART_COLORS } from "@/lib/constants";
import { endOfDay, formatDate, formatTime, startOfDay, timeAgo, timeUntil } from "@/lib/format";
import { ACTIVITY_QUICKLOG, ACTIVITY_CARD, FILTER_RAIL, PAGE_KPI_GRIDS, RAIL_LAYOUT, TABLE_CARD } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types";

/** Reference shows exactly four type checkboxes (Call/Email/Meeting/
 *  WhatsApp) plus a "More Filters (1)" outline expander — on the live site
 *  the expander is a dead stub; ours expands the remaining two types
 *  (Task/Note) as a functional superset (fix-over-defect). */
const VISIBLE_TYPE_FILTERS = ["call", "email", "meeting", "whatsapp"] as const;
const MORE_TYPE_FILTERS = ["task", "note"] as const;

const QUICK_LOG = [
  { type: "call", label: "Log Call", icon: Phone },
  { type: "email", label: "Log Email", icon: Mail },
  { type: "meeting", label: "Log Meeting", icon: Video },
  { type: "whatsapp", label: "Log WhatsApp", icon: MessageCircle, green: true },
] as const;

/**
 * Reference stat card: label + delta row on top (trending icon on %
 * deltas — DOM-verified), big value with the h-10 bar strip to its RIGHT,
 * optional sub text under the value. Thin wrapper over BarStatCard.
 */
function ActivityStatCard({
  label,
  value,
  sub,
  delta,
  deltaIcon = "up",
  deltaTone,
  bars,
  barColor,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  delta?: string;
  deltaIcon?: "up" | "down" | null;
  deltaTone?: "success" | "danger" | "muted";
  bars: number[];
  barColor: string;
}) {
  return (
    <BarStatCard
      label={label}
      value={value}
      subValue={sub}
      delta={delta}
      deltaIcon={deltaIcon}
      deltaTone={deltaTone}
      bars={bars}
      barColor={barColor}
      className="p-4"
    />
  );
}

export default function ActivitiesPage() {
  const { activities, users, hydrated, fetchActivities, updateActivity, deleteActivity } = useCrmStore();
  const [tab, setTab] = React.useState("overdue");
  const [typeFilters, setTypeFilters] = React.useState<Record<string, boolean>>({});
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);
  const [ownerId, setOwnerId] = React.useState("all");
  const [range, setRange] = React.useState("7");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [defaultType, setDefaultType] = React.useState("call");
  const [editing, setEditing] = React.useState<Activity | null>(null);

  React.useEffect(() => {
    if (hydrated) fetchActivities();
  }, [hydrated, fetchActivities]);

  const now = new Date();
  const today = new Date();
  const rangeStart = new Date();
  rangeStart.setDate(rangeStart.getDate() - Number(range));

  const baseFiltered = React.useMemo(() => {
    const activeTypes = Object.entries(typeFilters).filter(([, v]) => v).map(([k]) => k);
    return activities.filter((a) => {
      if (activeTypes.length > 0 && !activeTypes.includes(a.type)) return false;
      if (ownerId !== "all" && a.ownerId !== ownerId) return false;
      if (range !== "all" && new Date(a.createdAt) < rangeStart) return false;
      return true;
    });
  }, [activities, typeFilters, ownerId, range]);

  const overdue = baseFiltered.filter((a) => a.status === "scheduled" && a.dueAt && new Date(a.dueAt) < now);
  const dueToday = baseFiltered.filter(
    (a) => a.status === "scheduled" && a.dueAt && new Date(a.dueAt) >= now && new Date(a.dueAt) <= endOfDay(today),
  );
  const upcoming = baseFiltered.filter((a) => a.status === "scheduled" && a.dueAt && new Date(a.dueAt) > endOfDay(today));
  const completed = baseFiltered.filter((a) => a.status === "completed");

  const tabRows = { overdue, dueToday, upcoming, completed }[tab] ?? [];

  const todayCount = activities.filter((a) => new Date(a.createdAt ?? a.dueAt ?? a.createdAt) >= startOfDay(today)).length;
  const yesterdayCount = activities.filter((a) => {
    const d = new Date(a.createdAt ?? a.dueAt ?? a.createdAt);
    return d >= startOfDay(new Date(today.getTime() - 86400000)) && d < startOfDay(today);
  }).length;
  const todayDelta =
    yesterdayCount === 0
      ? `+${todayCount}`
      : `${todayCount >= yesterdayCount ? "+" : ""}${Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)}%`;

  // "2h overdue"-style label: hours since the most overdue activity.
  const oldestOverdue = overdue.reduce<number | null>((acc, a) => {
    const t = a.dueAt ? new Date(a.dueAt).getTime() : null;
    if (t === null) return acc;
    return acc === null ? t : Math.min(acc, t);
  }, null);
  const overdueLabel =
    oldestOverdue === null ? "0h overdue" : `${Math.max(0, Math.floor((now.getTime() - oldestOverdue) / 3600000))}h overdue`;

  const emailsToday = activities.filter((a) => a.type === "email" && new Date(a.createdAt) >= startOfDay(today)).length;
  const callsToday = activities.filter((a) => a.type === "call" && new Date(a.createdAt) >= startOfDay(today)).length;
  const upcomingMeetings = baseFiltered.filter((a) => a.type === "meeting" && a.status === "scheduled" && a.dueAt && new Date(a.dueAt) >= now);
  const meetingMinutes = upcomingMeetings.reduce((s, a) => {
    const start = a.dueAt ? new Date(a.dueAt).getTime() : 0;
    const end = a.completedAt ? new Date(a.completedAt).getTime() : start + 45 * 60000;
    return s + Math.max(0, end - start) / 60000;
  }, 0);
  const meetingDuration = `${Math.floor(meetingMinutes / 60) || 0}h ${Math.round(meetingMinutes % 60)}m`;

  const barsFor = (type: string, n = 7) =>
    Array.from({ length: n }, (_, i) => {
      const day = new Date(today);
      day.setDate(day.getDate() - (n - 1 - i));
      return activities.filter((a) => a.type === type && a.createdAt >= startOfDay(day).toISOString() && a.createdAt < endOfDay(day).toISOString()).length;
    });

  const allBars = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(day.getDate() - (6 - i));
    return activities.filter((a) => new Date(a.createdAt) >= startOfDay(day) && new Date(a.createdAt) < endOfDay(day)).length;
  });

  // Timeline grouped by date (createdAt), most recent first.
  const timeline = React.useMemo(() => {
    const groups = new Map<string, Activity[]>();
    for (const a of [...baseFiltered].sort((x, y) => +new Date(y.createdAt) - +new Date(x.createdAt))) {
      const key = formatDate(a.createdAt);
      const arr = groups.get(key) ?? [];
      arr.push(a);
      groups.set(key, arr);
    }
    return [...groups.entries()];
  }, [baseFiltered]);

  // Reference "Activities by Type" categories: Call / Email / Meeting /
  // Task / Note — WhatsApp is a quick-log type but NOT a chart series
  // (DOM-verified on the live card).
  const BY_TYPE_CATEGORIES = ["call", "email", "meeting", "task", "note"] as const;
  const byType = BY_TYPE_CATEGORIES.map((t) => ({
    label: ACTIVITY_TYPE_META[t].label,
    type: t,
    count: baseFiltered.filter((a) => a.type === t).length,
    color: ACTIVITY_TYPE_META[t].color,
  }));

  async function toggleComplete(a: Activity) {
    await updateActivity(a.id, { status: a.status === "completed" ? "scheduled" : "completed" });
  }

  return (
    <div>
      <PageHeader
        title="Activities"
        variant="activities"
        actions={
          <>
            {/* Session-8 (S8-6, re-pinned from the live DOM): the quick-log
                row is outline h-8 x3 plus a SOLID emerald Log WhatsApp
                (bg-emerald-600 hover:bg-emerald-700 + shadow) — the
                session-6 "ghost" pin was stale. */}
            {QUICK_LOG.map((q) => (
              <Button
                key={q.type}
                variant={q.type === "whatsapp" ? "ghost" : "outline"}
                size="sm"
                className={q.type === "whatsapp" ? ACTIVITY_QUICKLOG.whatsapp : undefined}
                onClick={() => {
                  setEditing(null);
                  setDefaultType(q.type);
                  setDialogOpen(true);
                }}
              >
                <q.icon className="h-4 w-4" /> {q.label}
              </Button>
            ))}
          </>
        }
      />

      {/* Reference: six stat cards, value + colored bar strip side by side
          (delta rows carry trending icons — DOM-verified). */}
      <div className={PAGE_KPI_GRIDS.activities}>
        <ActivityStatCard
          label="Activities Today"
          value={todayCount}
          delta={todayDelta}
          deltaIcon="up"
          bars={allBars}
          barColor={CHART_COLORS.blue400}
        />
        <ActivityStatCard
          label="Overdue Activities"
          value={overdue.length}
          sub="Due now"
          delta={overdueLabel}
          deltaIcon="down"
          bars={allBars.map((v) => Math.max(0, v - 1))}
          barColor={CHART_COLORS.red400}
        />
        {/* Session-5: "+N today" renders as a gray SUBTEXT under the value
            (the reference's only header deltas are the green % and the red
            "Xh overdue"). */}
        <ActivityStatCard
          label="Emails Sent"
          value={activities.filter((a) => a.type === "email").length}
          sub={`+${emailsToday} today`}
          bars={barsFor("email")}
          barColor={CHART_COLORS.cyan400}
        />
        <ActivityStatCard
          label="Calls Logged"
          value={activities.filter((a) => a.type === "call").length}
          sub={`+${callsToday} today`}
          bars={barsFor("call")}
          barColor={CHART_COLORS.green400}
        />
        <ActivityStatCard
          label="Meetings Scheduled"
          value={upcomingMeetings.length}
          sub={`+${meetingDuration}`}
          bars={barsFor("meeting")}
          barColor={CHART_COLORS.gray}
        />
        <ActivityStatCard
          label="WhatsApp"
          value={activities.filter((a) => a.type === "whatsapp").length}
          bars={barsFor("whatsapp")}
          barColor="#22c55e"
        />
      </div>

      {/* Session-6 (S6-10): reference layout = flex gap-6 with flex-1
          space-y-6 (Priority card + Timeline) and a w-80 space-y-6 rail
          (Filters + Activities by Type), rail visible from lg. */}
      <div className={RAIL_LAYOUT.row}>
        <div className={RAIL_LAYOUT.contentStack}>
          {/* Priority activities — session-6: bg-surface rounded-lg shadow
              with a p-4 border-b toolbar holding title + More + tab track. */}
          <Card className={cn(TABLE_CARD.card)}>
            <div className={TABLE_CARD.toolbar}>
              {/* Session-7 (S7-17): h2 text-lg title + mb-4 row (live pins). */}
              <div className={ACTIVITY_CARD.priorityRow}>
                <h2 className={ACTIVITY_CARD.title}>Priority Activities</h2>
                <Button variant="ghost" size="sm">
                  More
                </Button>
              </div>
              <Tabs
                variant="segmented"
                cols={4}
                value={tab}
                onValueChange={setTab}
                tabs={[
                  { id: "overdue", label: "Overdue" },
                  { id: "dueToday", label: "Due Today" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "completed", label: "Completed" },
                ]}
              >
                {null}
              </Tabs>
            </div>
            <CardContent>
              <div role="tabpanel">
                {tabRows.length === 0 ? (
                  <p className={ACTIVITY_CARD.emptyPanel}>
                    {tab === "overdue" ? "No overdue activities" : tab === "dueToday" ? "Nothing due today" : tab === "upcoming" ? "No upcoming activities" : "No completed activities"}
                  </p>
                ) : (
                  <ul className="flex flex-col divide-y divide-line">
                    {tabRows.slice(0, 8).map((a) => {
                      const meta = ACTIVITY_TYPE_META[a.type] ?? ACTIVITY_TYPE_META.call;
                      return (
                        <li key={a.id} className="flex items-center gap-3 py-3">
                          <button
                            type="button"
                            aria-label={a.status === "completed" ? "Mark as scheduled" : "Mark as completed"}
                            onClick={() => toggleComplete(a)}
                            className="text-subtle transition-colors hover:text-primary"
                          >
                            {a.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={cn("truncate text-sm font-medium", a.status === "completed" ? "text-muted line-through" : "text-foreground")}>
                              {a.subject}
                            </p>
                            <p className="text-xs text-muted">
                              {meta.label}
                              {a.relatedName ? ` · ${a.relatedName}` : a.contact ? ` · ${a.contact.name}` : ""}
                              {a.dueAt ? ` · due ${formatDate(a.dueAt)} ${formatTime(a.dueAt)}` : ""}
                              {a.status === "scheduled" && a.dueAt ? ` (${timeUntil(a.dueAt)})` : ""}
                            </p>
                          </div>
                          <Badge variant="outline" className={meta.badge}>
                            {meta.label}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="iconSm"
                            aria-label="Edit activity"
                            onClick={() => {
                              setEditing(a);
                              setDialogOpen(true);
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline — session-7 (S7-17): plain mb-6 header row inside the
              p-6 card, h2 text-lg title, ghost h-8 "•••" TEXT button. */}
          <Card className={cn(TABLE_CARD.card, "p-6")}>
            <div className={ACTIVITY_CARD.timelineRow}>
              <h2 className={ACTIVITY_CARD.title}>Activity Timeline</h2>
              <Button variant="ghost" size="sm" aria-label="More actions">
                {ACTIVITY_CARD.dotsLabel}
              </Button>
            </div>
            <CardContent className="flex flex-col gap-5 px-0 pb-0 pt-0">
              {timeline.length === 0 ? (
                <p className={ACTIVITY_CARD.emptyTimeline}>No activities found</p>
              ) : (
                timeline.map(([date, rows]) => (
                  <div key={date}>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-subtle">{date}</p>
                    <div className="relative flex flex-col gap-3 border-l border-line pl-5">
                      {rows.map((a) => {
                        const meta = ACTIVITY_TYPE_META[a.type] ?? ACTIVITY_TYPE_META.call;
                        return (
                          <div key={a.id} className="relative rounded-lg border border-line bg-white p-3">
                            <span
                              className="absolute -left-[27px] top-4 h-3 w-3 rounded-full border-2 border-white"
                              style={{ backgroundColor: meta.color }}
                            />
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">{a.subject}</p>
                                <p className="mt-0.5 text-xs text-muted">
                                  {meta.label} · {timeAgo(a.createdAt)}
                                  {a.relatedName ? ` · ${a.relatedName}` : a.contact ? ` · ${a.contact.name}` : ""}
                                  {a.status === "completed" ? " · completed" : a.dueAt ? ` · due ${formatDate(a.dueAt)}` : ""}
                                </p>
                                {a.notes && <p className="mt-1 line-clamp-2 text-xs text-muted">{a.notes}</p>}
                              </div>
                              <div className="flex shrink-0 items-center gap-1">
                                <Badge variant="outline" className={ACTIVITY_STATUS_META[a.status]?.badge}>
                                  {ACTIVITY_STATUS_META[a.status]?.label}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="iconSm"
                                  aria-label="Delete activity"
                                  className="text-danger hover:bg-danger-soft"
                                  onClick={async () => {
                                    if (window.confirm("Delete this activity?")) await deleteActivity(a.id);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters + chart rail — session-6: w-80 space-y-6, from lg. The
            rail card pins the live anatomy: header row with a ghost
            "Save All", four visible type checkboxes + a "More Filters (1)"
            outline expander (dead on the live site; ours reveals the
            Task/Note group — fix-over-defect), Owner/Status selects with
            mb-2 labels, and the pt-2 wrapper holding expander + primary
            Filter (mt-2). */}
        <div className={RAIL_LAYOUT.railStack}>
          <Card>
            <CardHeader className={FILTER_RAIL.headerPad}>
              <div className={FILTER_RAIL.headerRow}>
                <CardTitle className={FILTER_RAIL.title}>Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setTypeFilters({})}>
                  Save All
                </Button>
              </div>
            </CardHeader>
            <CardContent className={FILTER_RAIL.body}>
              <div>
                <Label className={FILTER_RAIL.groupLabel}>Activity Type</Label>
                <div className={FILTER_RAIL.checkboxStack}>
                  {VISIBLE_TYPE_FILTERS.map((t) => (
                    <Checkbox
                      key={t}
                      checked={typeFilters[t] ?? false}
                      onChange={(e) => setTypeFilters((f) => ({ ...f, [t]: e.target.checked }))}
                      label={ACTIVITY_TYPE_META[t].label}
                    />
                  ))}
                </div>
              </div>
              {showMoreFilters && (
                <div>
                  <Label className={FILTER_RAIL.groupLabel}>More Types</Label>
                  <div className={FILTER_RAIL.checkboxStack}>
                    {MORE_TYPE_FILTERS.map((t) => (
                      <Checkbox
                        key={t}
                        checked={typeFilters[t] ?? false}
                        onChange={(e) => setTypeFilters((f) => ({ ...f, [t]: e.target.checked }))}
                        label={ACTIVITY_TYPE_META[t].label}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label className={FILTER_RAIL.groupLabelSelect}>Owner</Label>
                <Select value={ownerId} onValueChange={setOwnerId}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={FILTER_RAIL.groupLabelSelect}>Status</Label>
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last 24 hours</SelectItem>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* pt-2 wrapper holds both actions (live anatomy): the
                  outline More Filters (1) expander + the full-width primary
                  Filter button with mt-2. */}
              <div className={FILTER_RAIL.filterButtonWrap}>
                <Button
                  variant="outline"
                  className="w-full"
                  aria-expanded={showMoreFilters}
                  onClick={() => setShowMoreFilters((v) => !v)}
                >
                  More Filters (1)
                </Button>
                <Button className="w-full mt-2" onClick={() => fetchActivities()}>
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Activities by Type</CardTitle>
              <Button variant="ghost" size="iconSm" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-muted">Last {range === "all" ? "all time" : `${range} days`}</p>
              {/* Session-10 (S10-11): the reference's by-type chart —
                  DOM-extracted from the live reference (270x150 in the
                  filter rail): NO CartesianGrid, 150px tall, ticks at
                  fontSize 10 with the recharts-default #666 fill, and the
                  DEFAULT tooltip. Was 180px + grid + custom tooltip. */}
              <div className="h-[150px] chart-no-outline">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byType} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" name="Logged" radius={[6, 6, 0, 0]} maxBarSize={36}>
                      {byType.map((t) => (
                        <Cell key={t.type} fill={t.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ActivityDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType={defaultType} activity={editing} />
    </div>
  );
}

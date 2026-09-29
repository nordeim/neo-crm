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
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox, Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { PageHeader, Sparkline } from "@/components/shared/page-parts";
import { ActivityDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { ACTIVITY_TYPE_META, ACTIVITY_STATUS_META, CHART_COLORS } from "@/lib/constants";
import { endOfDay, formatDate, formatTime, startOfDay, timeAgo, timeUntil } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types";

const QUICK_LOG = [
  { type: "call", label: "Log Call", icon: Phone },
  { type: "email", label: "Log Email", icon: Mail },
  { type: "meeting", label: "Log Meeting", icon: Video },
  { type: "whatsapp", label: "Log WhatsApp", icon: MessageCircle, green: true },
] as const;

/**
 * Reference stat card: label (+ optional top-right delta), big value with the
 * bar strip to its RIGHT, optional sub text under the value.
 */
function ActivityStatCard({
  label,
  value,
  sub,
  delta,
  deltaTone = "muted",
  bars,
  barColor,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  delta?: string;
  deltaTone?: "success" | "danger" | "muted";
  bars: number[];
  barColor: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium tracking-wide text-muted">{label}</p>
        {delta && (
          <span
            className={cn(
              "shrink-0 text-xs font-semibold",
              deltaTone === "success" ? "text-success" : deltaTone === "danger" ? "text-danger" : "text-muted",
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[26px] font-semibold leading-none tracking-tight text-foreground">
          {value}
          {sub && <span className="mt-1 block text-xs font-normal text-muted">{sub}</span>}
        </p>
        <Sparkline values={bars} color={barColor} className="w-16 shrink-0" />
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  const { activities, users, hydrated, fetchActivities, updateActivity, deleteActivity } = useCrmStore();
  const [tab, setTab] = React.useState("overdue");
  const [typeFilters, setTypeFilters] = React.useState<Record<string, boolean>>({});
  const [ownerId, setOwnerId] = React.useState("all");
  const [range, setRange] = React.useState("7");
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);
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

  const byType = Object.keys(ACTIVITY_TYPE_META).map((t) => ({
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
        actions={
          <>
            {QUICK_LOG.map((q) => (
              <Button
                key={q.type}
                variant="secondary"
                size="sm"
                className={"green" in q && q.green ? "border-transparent bg-[#16a34a] text-white hover:bg-[#15803d]" : undefined}
                onClick={() => {
                  setEditing(null);
                  setDefaultType(q.type);
                  setDialogOpen(true);
                }}
              >
                <q.icon className="h-4 w-4" /> <span className="hidden sm:inline">{q.label}</span>
              </Button>
            ))}
          </>
        }
      />

      {/* Reference: six stat cards, value + colored bar strip side by side. */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <ActivityStatCard
          label="Activities Today"
          value={todayCount}
          delta={todayDelta}
          deltaTone="success"
          bars={allBars}
          barColor={CHART_COLORS.blue}
        />
        <ActivityStatCard
          label="Overdue Activities"
          value={overdue.length}
          sub={`Due now ${dueToday.length}`}
          delta={overdueLabel}
          deltaTone="danger"
          bars={allBars.map((v) => Math.max(0, v - 1))}
          barColor={CHART_COLORS.red}
        />
        <ActivityStatCard
          label="Emails Sent"
          value={activities.filter((a) => a.type === "email").length}
          delta={`+${emailsToday} today`}
          bars={barsFor("email")}
          barColor={CHART_COLORS.cyan}
        />
        <ActivityStatCard
          label="Calls Logged"
          value={activities.filter((a) => a.type === "call").length}
          delta={`+${callsToday} today`}
          bars={barsFor("call")}
          barColor={CHART_COLORS.green}
        />
        <ActivityStatCard
          label="Meetings Scheduled"
          value={upcomingMeetings.length}
          delta={meetingDuration}
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

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          {/* Priority activities */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Priority Activities</CardTitle>
              <Button variant="ghost" size="sm">
                More
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs
                variant="segmented"
                value={tab}
                onValueChange={setTab}
                tabs={[
                  { id: "overdue", label: "Overdue" },
                  { id: "dueToday", label: "Due Today" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "completed", label: "Completed" },
                ]}
              >
                {tabRows.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted">
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
                              {a.contact ? ` · ${a.contact.name}` : ""}
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
              </Tabs>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Activity Timeline</CardTitle>
              <Button variant="ghost" size="iconSm" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {timeline.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted">No activities found</p>
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
                                  {a.contact ? ` · ${a.contact.name}` : ""}
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

        {/* Filters + chart */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setTypeFilters({})}>
                Save All
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Activity Type</Label>
                {["call", "email", "meeting", "whatsapp"].map((t) => (
                  <Checkbox
                    key={t}
                    checked={typeFilters[t] ?? false}
                    onChange={(e) => setTypeFilters((f) => ({ ...f, [t]: e.target.checked }))}
                    label={ACTIVITY_TYPE_META[t].label}
                  />
                ))}
              </div>
              <div className="grid gap-1.5">
                <Label>Owner</Label>
                <Select value={ownerId} onValueChange={setOwnerId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Status</Label>
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last 24 hours</SelectItem>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showMoreFilters && (
                <div className="flex flex-col gap-2 rounded-lg bg-line-soft/60 p-3">
                  <Label className="text-muted">More Filters</Label>
                  <Checkbox
                    checked={typeFilters["task"] ?? false}
                    onChange={(e) => setTypeFilters((f) => ({ ...f, task: e.target.checked }))}
                    label={ACTIVITY_TYPE_META.task.label}
                  />
                  <Checkbox
                    checked={typeFilters["note"] ?? false}
                    onChange={(e) => setTypeFilters((f) => ({ ...f, note: e.target.checked }))}
                    label={ACTIVITY_TYPE_META.note.label}
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button variant="secondary" size="sm" aria-expanded={showMoreFilters} onClick={() => setShowMoreFilters((v) => !v)}>
                  More Filters ({showMoreFilters ? 2 : 1})
                </Button>
                <Button size="sm" onClick={() => fetchActivities()}>
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
              <div className="h-[180px] chart-no-outline">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byType} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(59,130,246,0.06)" }}
                      content={({ active, payload }) =>
                        active && payload && payload.length > 0 ? (
                          <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-lg">
                            <p className="font-semibold text-foreground">{payload[0]?.payload?.label}</p>
                            <p className="text-muted">{payload[0]?.value} logged</p>
                          </div>
                        ) : null
                      }
                    />
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

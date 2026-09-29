"use client";

import * as React from "react";
import {
  CheckCircle2,
  Circle,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox, Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { KpiCard, PageHeader } from "@/components/shared/page-parts";
import { ActivityDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { ACTIVITY_TYPE_META, ACTIVITY_STATUS_META } from "@/lib/constants";
import { endOfDay, formatDate, formatTime, startOfDay, timeAgo, timeUntil } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types";

const QUICK_LOG = [
  { type: "call", label: "Log Call", icon: Phone },
  { type: "email", label: "Log Email", icon: Mail },
  { type: "meeting", label: "Log Meeting", icon: Video },
  { type: "whatsapp", label: "Log WhatsApp", icon: MessageCircle },
];

export default function ActivitiesPage() {
  const { activities, users, hydrated, fetchActivities, updateActivity, deleteActivity } = useCrmStore();
  const [tab, setTab] = React.useState("overdue");
  const [typeFilters, setTypeFilters] = React.useState<Record<string, boolean>>({});
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
    count: baseFiltered.filter((a) => a.type === t).length,
    color: ACTIVITY_TYPE_META[t].color,
  }));
  const maxType = Math.max(1, ...byType.map((t) => t.count));

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
                onClick={() => {
                  setEditing(null);
                  setDefaultType(q.type);
                  setDialogOpen(true);
                }}
              >
                <q.icon className="h-4 w-4" /> <span className="hidden sm:inline">{q.label}</span>
              </Button>
            ))}
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setDefaultType("call");
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        <KpiCard label="Activities Today" value={todayCount} delta={23} hint="logged today" />
        <KpiCard label="Overdue" value={overdue.length} hint="past due" />
        <KpiCard label="Due now" value={dueToday.length} hint="before midnight" />
        <KpiCard label="Emails Sent" value={activities.filter((a) => a.type === "email").length} hint="all time" />
        <KpiCard label="Calls Logged" value={activities.filter((a) => a.type === "call").length} hint="all time" />
        <KpiCard label="Meetings" value={activities.filter((a) => a.type === "meeting").length} hint="all time" />
        <KpiCard label="WhatsApp" value={activities.filter((a) => a.type === "whatsapp").length} hint="all time" />
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
                value={tab}
                onValueChange={setTab}
                tabs={[
                  { id: "overdue", label: "Overdue", count: overdue.length },
                  { id: "dueToday", label: "Due Today", count: dueToday.length },
                  { id: "upcoming", label: "Upcoming", count: upcoming.length },
                  { id: "completed", label: "Completed", count: completed.length },
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
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {timeline.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted">No activities found</p>
              ) : (
                timeline.map(([date, rows]) => (
                  <div key={date}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">{date}</p>
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
            <CardHeader>
              <CardTitle>Filters</CardTitle>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activities by Type</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-muted">Last {range === "all" ? "all time" : `${range} days`}</p>
              {byType.map((t) => (
                <div key={t.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{t.label}</span>
                    <span className="text-muted">{t.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((t.count / maxType) * 100)}%`, backgroundColor: t.color }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <ActivityDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType={defaultType} activity={editing} />
    </div>
  );
}

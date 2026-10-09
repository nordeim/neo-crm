"use client";

import * as React from "react";
import {
  CircleCheck,
  FileText,
  Mail,
  MoreHorizontal,
  Phone,
  // Session-17 (S17-P2f): the reference's quick-log ships `calendar` on
  // Log Meeting (ours: Video — an invented video affordance) and
  // `message-square` on Log WhatsApp (ours: message-circle — the round
  // bubble).
  Calendar,
  MessageSquare,
} from "lucide-react";
// Session-56 (S56-P1, N-56a): Cell narrowed out of the recharts import
// and Avatar's whole import line deleted — each had exactly one in-file
// reference: the import itself (the N-53c/N-55a class). Both exports
// stay alive (charts.tsx consumes Cell; accounts-page + the ui kit own
// Avatar [s57 correction — profile hand-rolls its avatar spans]).
// Session-70 (S70-P3, N-70c5): the whole recharts import retired — the
// by-type chart now rides the SingleBarChart family (grid={false},
// tickFontSize 10, height 150), dropping the invented name="Logged"
// (the reference's Bar ships NO name — its tooltip reads "count : N").
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox, Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsPanel } from "@/components/ui/tabs";
import { BarStatCard, PageHeader } from "@/components/shared/page-parts";
import { SingleBarChart } from "@/components/charts/charts";
import { ActivityDialog } from "@/components/shared/entity-dialogs";
import { useCrmStore } from "@/stores/crm-store";
import { ACTIVITY_TYPE_META, ACTIVITY_TIMELINE_TINT } from "@/lib/constants";
import { formatTime, startOfDay } from "@/lib/format";
import { ACTIVITY_KPI_STATICS, BY_TYPE_CARD, ACTIVITY_QUICKLOG, ACTIVITY_CARD, FILTER_RAIL, PAGE_KPI_GRIDS, PAGE_ROOT, RAIL_LAYOUT, TABLE_CARD  } from "@/lib/page-layout";
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
  { type: "meeting", label: "Log Meeting", icon: Calendar },
  { type: "whatsapp", label: "Log WhatsApp", icon: MessageSquare },
] as const;

/** Session-76 (M-76c2, bundle-decoded from the reference's Rce timeline):
 *  the per-type icon map for the tinted icon squares — the square carries
 *  the ACTIVITY_TIMELINE_TINT pair and the w-5 h-5 icon inherits the text
 *  color. Task/unknown fall to the gray terminal + FileText (the
 *  reference's own `r(i) || Fy` fallback). */
const TIMELINE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  whatsapp: MessageSquare,
  note: FileText,
};

// Session-90 (L-90c3/c4/c6): the ActivityStatCard thin wrapper RETIRED
// — the calls go to BarStatCard directly (the component now mirrors the
// reference's gm construction itself; the wrapper's only value was the
// p-4 className the Card split retired). The delta props rename to the
// reference's own trend/trendValue + the hex barColor becomes the color
// KEY.

export default function ActivitiesPage() {
  const { activities, users, hydrated, fetchActivities, updateActivity, deleteActivity } = useCrmStore();
  const [tab, setTab] = React.useState("overdue");
  const [typeFilters, setTypeFilters] = React.useState<Record<string, boolean>>({});
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);
  const [ownerId, setOwnerId] = React.useState("all");
  // Session-76 (M-76c5, bundle-decoded from Lce): the Status select's
  // vocabulary is 7days/30days/90days (default 7days) — the reference's
  // own values. The select is DEAD on the reference (state set, never
  // consumed); ours filters for real — the s8 dead-select precedent.
  const [range, setRange] = React.useState("7days");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [defaultType, setDefaultType] = React.useState("call");
  const [editing, setEditing] = React.useState<Activity | null>(null);
  // Session-76 (N-76c5, bundle-decoded from JSe): the reference renders
  // "Loading activities..." while its React-Query isLoading is true — from
  // mount until the first fetch resolves. Our equivalent: a local loaded
  // flag flipped by the first fetchActivities resolution (the loadingFlags
  // store family stays retired — this is page-local, exactly the query
  // state the reference models).
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (hydrated) {
      fetchActivities().finally(() => setLoaded(true));
    }
  }, [hydrated, fetchActivities]);

  const rangeDays = range === "7days" ? 7 : range === "30days" ? 30 : 90;
  const rangeStart = new Date();
  rangeStart.setDate(rangeStart.getDate() - rangeDays);

  // Session-76 (L-76c2, bundle-decoded from JSe's A/O/P memos): the
  // reference's derivation family — all buckets and KPI values read the
  // TYPE-SEARCH-FILTERED set (ours: baseFiltered — the owner/range
  // functional superset folds in), and the boundaries are CALENDAR-DAY
  // based: overdue = due < startOfToday && !completed; dueToday =
  // [startOfToday, startOfTomorrow); upcoming = >= startOfTomorrow. The
  // old `dueAt < now` boundary put a 9am-due activity into Overdue at
  // 3pm where the reference keeps it in Due Today.
  const todayStart = startOfDay(new Date());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const baseFiltered = React.useMemo(() => {
    const activeTypes = Object.entries(typeFilters).filter(([, v]) => v).map(([k]) => k);
    return activities.filter((a) => {
      if (activeTypes.length > 0 && !activeTypes.includes(a.type)) return false;
      if (ownerId !== "all" && a.ownerId !== ownerId) return false;
      if (new Date(a.createdAt) < rangeStart) return false;
      return true;
    });
  }, [activities, typeFilters, ownerId, rangeStart]);

  const overdue = baseFiltered.filter(
    (a) => a.status === "scheduled" && a.dueAt && new Date(a.dueAt) < todayStart,
  );
  const dueToday = baseFiltered.filter(
    (a) =>
      a.status === "scheduled" &&
      a.dueAt &&
      new Date(a.dueAt) >= todayStart &&
      new Date(a.dueAt) < tomorrowStart,
  );
  const upcoming = baseFiltered.filter(
    (a) => a.status === "scheduled" && a.dueAt && new Date(a.dueAt) >= tomorrowStart,
  );
  const completed = baseFiltered.filter((a) => a.status === "completed");

  // Session-76 (L-76c2): the KPI values read the FILTERED set —
  // Activities Today by the DUE DATE within the today window (the old
  // createdAt basis diverged whenever an old activity was logged today);
  // Meetings Scheduled counts ALL meetings (the reference's
  // meetingsScheduled has NO status/window guard).
  const activitiesToday = baseFiltered.filter(
    (a) => a.dueAt && new Date(a.dueAt) >= todayStart && new Date(a.dueAt) < tomorrowStart,
  ).length;
  const emailsSent = baseFiltered.filter((a) => a.type === "email").length;
  const callsLogged = baseFiltered.filter((a) => a.type === "call").length;
  const meetingsScheduled = baseFiltered.filter((a) => a.type === "meeting").length;
  const whatsappInteractions = baseFiltered.filter((a) => a.type === "whatsapp").length;

  // Timeline grouped by the reference's LONG WEEKDAY date format
  // (session-76 M-76c2, bundle-decoded from Rce: toLocaleDateString
  // "en-US", {weekday:"long",year:"numeric",month:"long",day:"numeric"}),
  // most recent first.
  const timeline = React.useMemo(() => {
    const groups = new Map<string, Activity[]>();
    for (const a of [...baseFiltered].sort((x, y) => +new Date(y.createdAt) - +new Date(x.createdAt))) {
      const d = new Date(a.createdAt);
      const key = d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
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
    // Session-13 (S13-P5): the chart series + chip swatches follow the
    // reference's palette (DOM-extracted from its chip inline-colors) —
    // blue/violet/amber/emerald/teal. The ACTIVITY_TYPE_META colors stay
    // on the BADGE surfaces (timeline chips), which the zero-data
    // reference cannot verify.
    color: BY_TYPE_CARD.colors[t],
  }));

  async function toggleComplete(a: Activity) {
    const res = await updateActivity(a.id, { status: a.status === "completed" ? "scheduled" : "completed" });
    // Session-46 (S46-P1): the checkbox mutation was fire-and-forget — a
    // failed toggle left the box unchanged with zero feedback.
    if (!res.ok) {
      toast.error("Could not update activity", res.error);
    }
  }

  function openEditActivity(a: Activity) {
    setEditing(a);
    setDialogOpen(true);
  }

  return (
    // Session-16 (S16-P2): the page owns its padding — the reference's
    // activities root is `p-4 sm:p-8 bg-gray-50 min-h-screen`.
    <div className={PAGE_ROOT.standard}>
      <PageHeader
        title="Activities"
        variant="activities"
        actions={
          <>
            {/* Session-8 (S8-6, re-pinned from the live DOM): the quick-log
                row is outline h-8 x3 plus a SOLID emerald Log WhatsApp.
                Session-83 (M-83c3 + L-83c4, bundle-decoded at the Rce
                header): the reference's four svgs all carry w-4 h-4
                mr-2 (ours shipped the bare h-4 w-4 — the margin never
                applied, first nullified by the s9 only-child arm, then
                simply absent post-s82); the WhatsApp button rides the
                DEFAULT variant + the bare emerald pair — the base's
                text-primary-foreground keeps the label white on hover
                (our ghost variant's surviving hover:text-foreground
                flipped it #0a0a0a). */}
            {QUICK_LOG.map((q) => (
              <Button
                key={q.type}
                variant={q.type === "whatsapp" ? "default" : "outline"}
                size="sm"
                className={q.type === "whatsapp" ? ACTIVITY_QUICKLOG.whatsapp : undefined}
                onClick={() => {
                  setEditing(null);
                  setDefaultType(q.type);
                  setDialogOpen(true);
                }}
              >
                <q.icon className="w-4 h-4 mr-2" /> {q.label}
              </Button>
            ))}
          </>
        }
      />

      {/* Reference: six stat cards, value + colored bar strip side by side
          (delta rows carry trending icons — DOM-verified). Session-76
          (M-76c6, bundle-decoded from gm): the deltas/subtexts/bars are
          the reference's STATIC literals (ACTIVITY_KPI_STATICS) — the
          KPI_STATICS "NEVER feed these cards real" rule extends here;
          only the VALUES stay live. */}
      <div className={PAGE_KPI_GRIDS.activities}>
        {/* Session-90 (L-90c4/c6, bundle-decoded from the reference's gm
            call sites): the color KEY + the trend/trendValue pair —
            trend="up" trendValue="+23%" on Activities Today, the DOWN
            arm on Overdue, none on the middle four. */}
        <BarStatCard
          label="Activities Today"
          value={activitiesToday}
          trend="up"
          trendValue={ACTIVITY_KPI_STATICS.activitiesToday.delta}
          bars={[...ACTIVITY_KPI_STATICS.activitiesToday.bars]}
          color="blue"
        />
        <BarStatCard
          label="Overdue Activities"
          value={overdue.length}
          subValue={ACTIVITY_KPI_STATICS.overdue.sub}
          trend="down"
          trendValue={ACTIVITY_KPI_STATICS.overdue.delta}
          bars={[...ACTIVITY_KPI_STATICS.overdue.bars]}
          color="red"
        />
        <BarStatCard
          label="Emails Sent"
          value={emailsSent}
          subValue={ACTIVITY_KPI_STATICS.emailsSent.sub}
          bars={[...ACTIVITY_KPI_STATICS.emailsSent.bars]}
          color="cyan"
        />
        <BarStatCard
          label="Calls Logged"
          value={callsLogged}
          subValue={ACTIVITY_KPI_STATICS.callsLogged.sub}
          bars={[...ACTIVITY_KPI_STATICS.callsLogged.bars]}
          color="green"
        />
        {/* Session-76 (M-76c6): the reference's color map has NO purple
            arm — "purple" falls through to the GRAY else, so the Meetings
            bars render bg-gray-400 (byte-equal to the reference). */}
        <BarStatCard
          label="Meetings Scheduled"
          value={meetingsScheduled}
          subValue={ACTIVITY_KPI_STATICS.meetingsScheduled.sub}
          bars={[...ACTIVITY_KPI_STATICS.meetingsScheduled.bars]}
          color="purple"
        />
        {/* Session-76 (L-76c7): the gm maps "green" → bg-green-400 for
            BOTH Calls Logged and WhatsApp. */}
        <BarStatCard
          label="WhatsApp"
          value={whatsappInteractions}
          bars={[...ACTIVITY_KPI_STATICS.whatsapp.bars]}
          color="green"
        />
      </div>

      {/* Session-6 (S6-10): reference layout = flex gap-6 with flex-1
          space-y-6 (Priority card + Timeline) and a w-80 space-y-6 rail
          (Filters + Activities by Type), rail visible from lg. */}
      <div className={RAIL_LAYOUT.row}>
        <div className={RAIL_LAYOUT.contentStack}>
          {/* Priority activities — session-6: bg-surface rounded-lg shadow
              with a p-4 border-b toolbar holding title + More + tab track.
              Session-16 (S16-P5): a PLAIN div, not Card — the Card base's
              border border-line leaks through cn() (the reference's card
              is borderless). */}
          <div className={TABLE_CARD.card}>
            <div className={TABLE_CARD.toolbar}>
              {/* Session-7 (S7-17): h2 text-lg title + mb-4 row (live pins). */}
              <div className={ACTIVITY_CARD.priorityRow}>
                <h2 className={ACTIVITY_CARD.title}>Priority Activities</h2>
                <Button variant="ghost" size="sm">
                  More
                </Button>
              </div>
              {/* Session-23 (S23-P1 + S23-P3): the reference's priority card
                  is ONE p-4 border-b region — title row, tab strip, and the
                  panel content all inside it (its border-b renders BELOW the
                  content at the card's bottom; the s15-era clone split the
                  content into a CardContent below the toolbar, drawing a
                  separator line the reference does not ship and insetting
                  the rows at p-6 instead of the toolbar's p-4). The Tabs
                  wrapper is bare (the reference's own wrapper carries no
                  classes) and the panels ride its mt-4 space-y-2 contract —
                  the 16px tablist-to-panel gap, live-measured. */}
              <Tabs
                variant="segmented"
                cols={4}
                value={tab}
                onValueChange={setTab}
                tabs={[
                  // Session-66 (N-66d): the Overdue count badge — the reference
                  // renders ["Overdue", P.overdue.length>0 && <span …>] on
                  // exactly this tab (the other three are plain labels); the
                  // >0 guard lives here, the reference's own shape.
                  { id: "overdue", label: "Overdue", count: overdue.length > 0 ? overdue.length : undefined },
                  { id: "dueToday", label: "Due Today" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "completed", label: "Completed" },
                ]}
              >
                <TabsPanel tab="overdue" className="mt-4 space-y-2">
                  {/* Session-76 (M-76c4, bundle-decoded from JSe): NO cap on
                      overdue/dueToday; slice(0,5) on upcoming/completed —
                      ours sliced every tab at 8. */}
                  {tab === "overdue" && <PriorityRows rows={overdue} empty="No overdue activities" onToggle={toggleComplete} onEdit={openEditActivity} />}
                </TabsPanel>
                <TabsPanel tab="dueToday" className="mt-4 space-y-2">
                  {/* Session-76 (M-76c3): the reference's empty string —
                      ours read "Nothing due today" for 61 sessions. */}
                  {tab === "dueToday" && <PriorityRows rows={dueToday} empty="No activities due today" onToggle={toggleComplete} onEdit={openEditActivity} />}
                </TabsPanel>
                <TabsPanel tab="upcoming" className="mt-4 space-y-2">
                  {tab === "upcoming" && <PriorityRows rows={upcoming.slice(0, 5)} empty="No upcoming activities" onToggle={toggleComplete} onEdit={openEditActivity} />}
                </TabsPanel>
                <TabsPanel tab="completed" className="mt-4 space-y-2">
                  {tab === "completed" && <PriorityRows rows={completed.slice(0, 5)} empty="No completed activities" onToggle={toggleComplete} onEdit={openEditActivity} />}
                </TabsPanel>
              </Tabs>
            </div>
          </div>

          {/* Timeline — session-7 (S7-17): plain mb-6 header row inside the
              p-6 card, h2 text-lg title, ghost h-8 "•••" TEXT button.
              Session-16 (S16-P5): a PLAIN div, not Card (borderless). */}
          <div className={cn(TABLE_CARD.card, "p-6")}>
            <div className={ACTIVITY_CARD.timelineRow}>
              <h2 className={ACTIVITY_CARD.title}>Activity Timeline</h2>
              <Button variant="ghost" size="sm" aria-label="More actions">
                {ACTIVITY_CARD.dotsLabel}
              </Button>
            </div>
            {/* Session-76 (M-76c2 + N-76c5, bundle-decoded from Rce): the
                timeline rows are Card p-4 hover:shadow-md items with the
                TINTED icon square + the Related-to link + the
                avatar/owner/type-badge footer, grouped under the reference's
                LONG-WEEKDAY h3 headers; "Loading activities..." renders
                while the first fetch is in flight (the reference's own
                React-Query isLoading render — a text line, not a
                Skeleton/animate-pulse surface, so the s25 loading-layer
                pins stay whole). */}
            <CardContent className="space-y-6 px-0 pb-0 pt-0">
              {!loaded ? (
                <div className="text-center py-12 text-gray-500">Loading activities...</div>
              ) : timeline.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No activities found</div>
              ) : (
                timeline.map(([date, rows]) => (
                  <div key={date}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{date}</h3>
                    <div className="space-y-3">
                      {rows.map((a) => {
                        // Defensive DB-read posture (s65 N-65l, the s63
                        // family): Activity.type is PERSISTED data — an
                        // unexpected key degrades to the gray terminal +
                        // FileText (the reference's own `|| Fy` fallback)
                        // instead of crashing the render.
                        const tint = ACTIVITY_TIMELINE_TINT[a.type] ?? "bg-gray-100 text-gray-600";
                        const Icon = TIMELINE_ICON[a.type] ?? FileText;
                        return (
                          <Card key={a.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${tint}`}>
                                <Icon className="w-5 h-5" aria-hidden="true" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="font-medium text-sm">{a.subject}</p>
                                    {a.relatedName && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Related to:{" "}
                                        <span className="text-blue-600 hover:underline cursor-pointer">
                                          {(a.relatedType ? ACTIVITY_TYPE_META[a.relatedType]?.label ?? a.relatedType : "Contact")}: {a.relatedName}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">{formatTime(a.dueAt ?? a.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="w-6 h-6 bg-gray-200 rounded-full" aria-hidden="true" />
                                  <span className="text-xs text-gray-600">{a.owner?.name ?? "You"}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {ACTIVITY_TYPE_META[a.type]?.label ?? a.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </div>
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
                      onCheckedChange={(v) => setTypeFilters((f) => ({ ...f, [t]: v }))}
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
                        onCheckedChange={(v) => setTypeFilters((f) => ({ ...f, [t]: v }))}
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
                    {/* Session-76 (M-76c5, bundle-decoded from Lce): the
                        reference's three-value vocabulary — 7days/30days/
                        90days (the select is dead on the reference; ours
                        filters createdAt — the functional superset). The
                        scaffold's Last 24 hours + All Time options were
                        inventions. */}
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
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

          {/* Session-13 (S13-P5): full structural rebuild — the reference
              card carries its subtitle INSIDE a flex-col p-6 pb-3 header
              (with a bare-text ••• in the title row), a five-chip count
              row under the chart, and a border-t footer with the
              "Activities" checkbox + a ml-auto ••• . The subtitle is the
              STATIC "Last 2 days" (the range filter does not change it —
              live-verified). */}
          <Card>
            <CardHeader className={BY_TYPE_CARD.headerPad}>
              <div className={BY_TYPE_CARD.headerRow}>
                <CardTitle className={BY_TYPE_CARD.title}>Activities by Type</CardTitle>
                <button type="button" className={BY_TYPE_CARD.dotsButton} aria-label="More actions">
                  •••
                </button>
              </div>
              <p className={BY_TYPE_CARD.subtitle}>{BY_TYPE_CARD.subtitleText}</p>
            </CardHeader>
            <CardContent className={BY_TYPE_CARD.body}>
              {/* Session-27 (S27-P10, bundle-extracted): the by-type bars
                  are a SINGLE #3b82f6 fill with radius [4,4,0,0] and NO
                  grid (no CartesianGrid), stock axes, tick fontSize 10 —
                  the per-type colors live ONLY in the chips row below
                  (S13-P5). No maxBarSize, no interval override.
                  Session-70 (S70-P3): expressed through the family —
                  the hand-rolled BarChart duplicate retired (N-70c5). */}
              <SingleBarChart
                data={byType}
                xKey="label"
                dataKey="count"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                tickFontSize={10}
                height={150}
                grid={false}
              />

              {/* The five per-type count chips (swatch + "Call N"). */}
              <div className={BY_TYPE_CARD.chipsRow}>
                {byType.map((t) => (
                  <div key={t.type} className={BY_TYPE_CARD.chip}>
                    <div
                      className={BY_TYPE_CARD.chipSwatch}
                      style={{ backgroundColor: t.color }}
                      aria-hidden="true"
                    />
                    <span className={BY_TYPE_CARD.chipLabel}>
                      {t.label} {t.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* The border-t footer: the Activities checkbox (default
                  checked, mirroring the reference's stock 16px checkbox)
                  + the ml-auto ••• . Rides the shared stock Checkbox
                  primitive (S17-P3 — button role=checkbox + Check
                  indicator, the reference's exact anatomy). */}
              <div className={BY_TYPE_CARD.footer}>
                {/* Session-76 (M-76c11, bundle-decoded from QSe): the
                    footer's children sit in an INNER flex items-center
                    gap-2 row — without it the ml-auto on the ••• is inert
                    and the checkbox/label sit flush. */}
                <div className={BY_TYPE_CARD.footerRow}>
                  <Checkbox
                    id="activities-by-type-toggle"
                    defaultChecked
                  />
                  <label htmlFor="activities-by-type-toggle" className={BY_TYPE_CARD.footerLabel}>
                    Activities
                  </label>
                  <button type="button" className={BY_TYPE_CARD.footerDotsButton} aria-label="More actions">
                    •••
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ActivityDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType={defaultType} activity={editing} />
    </div>
  );
}

// Session-76 (M-76c1, bundle-decoded from the reference's vx): the
// priority-tab row family — the `flex items-center justify-between p-3
// hover:bg-gray-50 rounded-lg border-b` row with the INITIALS AVATAR box
// (w-10 h-10 bg-blue-100 text-blue-600 text-sm font-semibold, initials of
// relatedName || "A"), the `relatedName || "Activity"` title + the
// destructive "Xh/Xd overdue" Badge when overdue, the text-xs gray-600
// description line, the right-side TIME span (text-red-600 when overdue
// else text-gray-900) + the ghost-sm text-xs "Check as completed" button
// (the CircleCheck w-4 h-4 mr-1 glyph). Our kept supersets (documented):
// the toggle's aria-label + the edit affordance (the reference ships
// neither edit nor toggle — its rows only complete) + the un-complete
// arm of the toggle.
function PriorityRows({
  rows,
  empty,
  onToggle,
  onEdit,
}: {
  rows: Activity[];
  empty: string;
  onToggle: (a: Activity) => void;
  onEdit: (a: Activity) => void;
}) {
  if (rows.length === 0) {
    return <p className={ACTIVITY_CARD.emptyPanel}>{empty}</p>;
  }
  return (
    <div>
      {rows.map((a) => {
        const now = new Date();
        const due = a.dueAt ? new Date(a.dueAt) : null;
        const isOverdue = due !== null && due < now && a.status !== "completed";
        // The reference's `a()` helper: hours-late floored, then d/h forms.
        const hoursLate = due !== null ? Math.floor((now.getTime() - due.getTime()) / 3600000) : 0;
        const overdueText = hoursLate >= 24 ? `${Math.floor(hoursLate / 24)}d overdue` : `${hoursLate}h overdue`;
        return (
          <div key={a.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border-b">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold">
                {(a.relatedName ?? a.contact?.name ?? "A").split(" ").map((w) => w[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{a.relatedName || a.contact?.name || "Activity"}</p>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      {overdueText}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600">{a.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                {formatTime(a.dueAt ?? a.createdAt)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                aria-label={a.status === "completed" ? "Mark as scheduled" : "Check as completed"}
                onClick={() => onToggle(a)}
              >
                <CircleCheck className="w-4 h-4 mr-1" aria-hidden="true" />
                Check as completed
              </Button>
              {/* Our documented superset: the reference's rows carry no
                  edit affordance (only complete); ours opens the edit
                  dialog (the s50 dual-mode keep). */}
              <Button variant="ghost" size="iconSm" aria-label="Edit activity" onClick={() => onEdit(a)}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

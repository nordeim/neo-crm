"use client";

import { downloadFile } from "@/lib/download";
import * as React from "react";
import { AlertCircle, Download, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-parts";
import { cn } from "@/lib/utils";
import { CARD_TITLE_OVERRIDE, PAGE_ROOT, SETTINGS_DANGER, SETTINGS_DATA, SETTINGS_DEFAULTS, SETTINGS_GRID, SETTINGS_PICKLIST } from "@/lib/page-layout";
import { Tabs, TabsPanel } from "@/components/ui/tabs";
import { useCrmStore } from "@/stores/crm-store";
import { toast } from "@/components/ui/toast";
import type { Settings } from "@/types";

interface ListEditorProps {
  title: string;
  items: string[];
  placeholder: string;
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}

function ListEditor({ title, items, placeholder, onAdd, onRemove }: ListEditorProps) {
  const [value, setValue] = React.useState("");
  return (
    <Card>
      <CardHeader>
        <CardTitle className={CARD_TITLE_OVERRIDE.settings}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {/* Session-7 (S7-19): live pins — items `space-y-2 mb-4`, empty state
            a plain `text-sm text-center py-4` paragraph (no dashed box). */}
        {items.length === 0 ? (
          <div className={SETTINGS_PICKLIST.items}>
            <p className={SETTINGS_PICKLIST.empty}>No items yet</p>
          </div>
        ) : (
          <div className={SETTINGS_PICKLIST.items}>
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-line-soft py-1 pl-3 pr-1.5 text-xs font-medium text-foreground"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="rounded-full p-0.5 text-subtle transition-colors hover:bg-danger-soft hover:text-danger"
                    aria-label={`Remove ${item}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className={SETTINGS_PICKLIST.addRow}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) {
                e.preventDefault();
                onAdd(value.trim());
                setValue("");
              }
            }}
            placeholder={placeholder}
            aria-label={`Add new ${title.toLowerCase()} item`}
          />
          {/* Session-8 (S8-7, computed-color probe): the reference's add
              button uses bg-primary where --primary is the STOCK shadcn
              zinc-950 (rgb(23,23,23)) — a DARK button, not the app's blue
              (same neutral family as the profile Save Changes button). */}
          <Button
            size="sm"
            className={SETTINGS_PICKLIST.addButton}
            disabled={!value.trim()}
            aria-label="Add item"
            onClick={() => {
              if (value.trim()) {
                onAdd(value.trim());
                setValue("");
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { settings, hydrated, fetchSettings, updateSettings, resetData } = useCrmStore();
  const [tab, setTab] = React.useState("config");
  const [resetText, setResetText] = React.useState("");

  React.useEffect(() => {
    if (hydrated) fetchSettings();
  }, [hydrated, fetchSettings]);

  return (
    // Session-16 (S16-P2/P6): the page owns its padding — the reference's
    // settings root is `p-4 sm:p-8 bg-gray-50 min-h-screen` with the
    // max-w-6xl mx-auto column INSIDE (S6-12). The picklist grid breaks
    // at md (2 columns from 768px — ours waited for lg).
    <div className={PAGE_ROOT.standard}>
    <div className="mx-auto max-w-6xl">
      {/* Session-9 (S9-4): plain header variant — the reference renders a
          simple mb-6 div with a non-responsive text-3xl h1 (no header
          buttons on this page). */}
      <PageHeader title="Settings" subtitle="Configure your CRM preferences and defaults" variant="settings" />

      {/* Session-23 (S23-P1): the reference's Tabs region — a space-y-6
          wrapper holding the tablist + the N wired panel shells; each
          shell carries the stock Radix focus-ring family + mt-2 space-y-4
          (the mt-2 collapses against the wrapper's space-y margin —
          live-measured 24px tablist-to-content gap). The old py-4 content
          wrapper retired: the reference's panel content starts at the
          panel's own edge. */}
      <Tabs
        variant="segmented"
        cols={3}
        className="space-y-6"
        value={tab}
        onValueChange={setTab}
        tabs={[
          { id: "config", label: "CRM Configuration" },
          { id: "defaults", label: "Defaults" },
          { id: "data", label: "Data" },
        ]}
      >
        {/* Config + Defaults editors remount (keyed) whenever a fresh
            settings snapshot arrives, so local state initializes from
            props at mount — never via setState-in-effect. */}
        <TabsPanel tab="config" className="mt-2 space-y-4">
          {tab === "config" &&
            (settings ? (
              <ConfigEditor key={`cfg-${JSON.stringify(settings).length}`} settings={settings} />
            ) : (
              <p className="py-10 text-center text-sm text-muted">Loading settings…</p>
            ))}
        </TabsPanel>

        <TabsPanel tab="defaults" className="mt-2 space-y-4">
          {tab === "defaults" &&
            (settings ? (
              <DefaultsEditor key={`def-${JSON.stringify(settings).length}`} settings={settings} />
            ) : (
              <p className="py-10 text-center text-sm text-muted">Loading settings…</p>
            ))}
        </TabsPanel>

        <TabsPanel tab="data" className="mt-2 space-y-4">
          {tab === "data" && (
            <div className="flex flex-col gap-4">
              {/* Session-14 (S14-P2): the reference's template card carries
                  the 'Import ' prefix, a STOCK CardTitle and a VERTICAL
                  space-y-2 stack of outline default-size buttons
                  (`w-full sm:w-auto`, download icon w-4 h-4). */}
              <Card>
                <CardHeader>
                  <CardTitle>{SETTINGS_DATA.importTitle}</CardTitle>
                </CardHeader>
                <CardContent className={SETTINGS_DATA.listBody}>
                  <Button variant="outline" className={SETTINGS_DATA.buttonCls} onClick={() => downloadFile("/api/export?type=contacts")}>
                    <Download className={SETTINGS_DATA.buttonIcon} /> Download Contacts Template
                  </Button>
                  <Button variant="outline" className={SETTINGS_DATA.buttonCls} onClick={() => downloadFile("/api/export?type=accounts")}>
                    <Download className={SETTINGS_DATA.buttonIcon} /> Download Accounts Template
                  </Button>
                  <Button variant="outline" className={SETTINGS_DATA.buttonCls} onClick={() => downloadFile("/api/export?type=leads")}>
                    <Download className={SETTINGS_DATA.buttonIcon} /> Download Leads Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                </CardHeader>
                <CardContent className={SETTINGS_DATA.listBody}>
                  <Button variant="outline" className={SETTINGS_DATA.buttonCls} onClick={() => downloadFile("/api/export?type=contacts&download=1")}>
                    Export Contacts
                  </Button>
                  <Button variant="outline" className={SETTINGS_DATA.buttonCls} onClick={() => downloadFile("/api/export?type=accounts&download=1")}>
                    Export Accounts
                  </Button>
                  <Button variant="outline" className={SETTINGS_DATA.buttonCls} onClick={() => downloadFile("/api/export?type=leads&download=1")}>
                    Export Leads
                  </Button>
                  <Button variant="outline" className={SETTINGS_DATA.buttonCls} onClick={() => downloadFile("/api/export?type=activities&download=1")}>
                    Export Activities
                  </Button>
                </CardContent>
              </Card>

              {/* Session-14 (S14-P3): the reference's TINTED warning surface
                  — border-red-200 + bg-red-50, the circle-alert title on
                  text-red-700, and a space-y-4 stack of the confirm input
                  group then the destructive button (no warning paragraph).
                  The reset foreground is #fafafa (neutral-50), not white. */}
              <Card className={SETTINGS_DANGER.card}>
                <CardHeader>
                  <CardTitle className={SETTINGS_DANGER.title}>
                    <AlertCircle className={SETTINGS_DANGER.titleIcon} aria-hidden="true" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className={SETTINGS_DANGER.body}>
                  <div className={SETTINGS_DANGER.group}>
                    <Label htmlFor="reset-confirm">{SETTINGS_DANGER.label}</Label>
                    <Input
                      id="reset-confirm"
                      value={resetText}
                      onChange={(e) => setResetText(e.target.value)}
                      placeholder="RESET"
                      aria-label={SETTINGS_DANGER.label}
                      className={cn(SETTINGS_DANGER.inputCls, SETTINGS_DANGER.controlMt)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    className={SETTINGS_DANGER.resetFg}
                    disabled={resetText !== "RESET"}
                    onClick={async () => {
                      const res = await resetData();
                      if (res.ok) {
                        toast.success("Workspace reset", "All domain data deleted. Seed again with `bun run db:seed`.");
                        setResetText("");
                      } else {
                        toast.error("Reset failed", res.error);
                      }
                    }}
                  >
                    Reset All Data
                  </Button>
                </CardContent>
              </Card>
            </div>
        )}
        </TabsPanel>
      </Tabs>
    </div>
    </div>
  );
}

function ConfigEditor({ settings }: { settings: Settings }) {
  const { updateSettings } = useCrmStore();
  const [lists, setLists] = React.useState(() => ({
    contactSources: [...settings.contactSources],
    leadStages: [...settings.leadStages],
    activityTypes: [...settings.activityTypes],
    accountTiers: [...settings.accountTiers],
    industries: [...settings.industries],
  }));

  // The reference has no "Save All" button — every add/remove persists
  // immediately, so the picklists always mirror the stored settings.
  function mutate(key: keyof typeof lists, fn: (arr: string[]) => string[]) {
    setLists((l) => {
      const next = { ...l, [key]: fn(l[key]) };
      void updateSettings(next).then((res) => {
        if (!res.ok) toast.error("Could not save", res.error);
      });
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={SETTINGS_GRID}>
        <ListEditor
          title="Contact Sources"
          items={lists.contactSources}
          placeholder="Add new contact source"
          onAdd={(v) => mutate("contactSources", (a) => [...a, v])}
          onRemove={(i) => mutate("contactSources", (a) => a.filter((_, x) => x !== i))}
        />
        <ListEditor
          title="Lead Stages"
          items={lists.leadStages}
          placeholder="Add new lead stage"
          onAdd={(v) => mutate("leadStages", (a) => [...a, v])}
          onRemove={(i) => mutate("leadStages", (a) => a.filter((_, x) => x !== i))}
        />
        <ListEditor
          title="Activity Types"
          items={lists.activityTypes}
          placeholder="Add new activity type"
          onAdd={(v) => mutate("activityTypes", (a) => [...a, v])}
          onRemove={(i) => mutate("activityTypes", (a) => a.filter((_, x) => x !== i))}
        />
        <ListEditor
          title="Account Tiers"
          items={lists.accountTiers}
          placeholder="Add new account tier"
          onAdd={(v) => mutate("accountTiers", (a) => [...a, v])}
          onRemove={(i) => mutate("accountTiers", (a) => a.filter((_, x) => x !== i))}
        />
        {/* "Add new industrie" mirrors the reference's placeholder typo
            (like "Conversion Funnel") — SETTINGS_PICKLIST pins it. */}
        <ListEditor
          title="Industries"
          items={lists.industries}
          placeholder="Add new industrie"
          onAdd={(v) => mutate("industries", (a) => [...a, v])}
          onRemove={(i) => mutate("industries", (a) => a.filter((_, x) => x !== i))}
        />
      </div>
    </div>
  );
}

function DefaultsEditor({ settings }: { settings: Settings }) {
  const { updateSettings } = useCrmStore();
  const [defaults, setDefaults] = React.useState(() => ({
    defaultCurrency: settings.defaultCurrency,
    defaultLeadStage: settings.defaultLeadStage,
    defaultTier: settings.defaultTier,
    followUpDays: settings.followUpDays,
    calendarView: settings.calendarView,
    firstDayOfWeek: settings.firstDayOfWeek,
  }));

  // Reference behavior: no save button — each change persists immediately.
  function set<K extends keyof typeof defaults>(key: K, value: (typeof defaults)[K]) {
    setDefaults((d) => {
      const next = { ...d, [key]: value };
      void updateSettings(next).then((res) => {
        if (!res.ok) toast.error("Could not save", res.error);
      });
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Session-14 (S14-P1): the reference's Default Values card is a
          SINGLE-COLUMN space-y-4 stack (16px between groups, every width)
          with space-y-2 groups (12px computed label→control gap), the
          STOCK CardTitle and the stock CardDescription subtitle
          (text-sm text-muted-foreground — 14px/#737373). Ours shipped a
          responsive 3-col grid with 6px gaps, the text-lg title and a
          12px subtitle. */}
      <Card>
        <CardHeader>
          <CardTitle>Default Values</CardTitle>
          <p className={SETTINGS_DEFAULTS.subtitle}>Set default values for new records</p>
        </CardHeader>
        <CardContent className={SETTINGS_DEFAULTS.body}>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-currency">Default Currency</Label>
            <Input
              id="def-currency"
              className={SETTINGS_DEFAULTS.controlMt}
              value={defaults.defaultCurrency}
              onChange={(e) => set("defaultCurrency", e.target.value.toUpperCase().slice(0, 6))}
            />
          </div>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-stage">Default Lead Stage</Label>
            <Input
              id="def-stage"
              className={SETTINGS_DEFAULTS.controlMt}
              value={defaults.defaultLeadStage}
              onChange={(e) => set("defaultLeadStage", e.target.value)}
            />
          </div>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-tier">Default Account Tier</Label>
            <Input
              id="def-tier"
              className={SETTINGS_DEFAULTS.controlMt}
              value={defaults.defaultTier}
              onChange={(e) => set("defaultTier", e.target.value.toUpperCase().slice(0, 2))}
            />
          </div>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-follow">Follow-up Days After Activity</Label>
            <Input
              id="def-follow"
              className={SETTINGS_DEFAULTS.controlMt}
              type="number"
              min={0}
              max={90}
              value={defaults.followUpDays}
              onChange={(e) => set("followUpDays", Number(e.target.value) || 0)}
            />
          </div>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-calview">Default Calendar View</Label>
            <Select value={defaults.calendarView} onValueChange={(v) => set("calendarView", v)}>
              <SelectTrigger id="def-calview" className={cn("w-full", SETTINGS_DEFAULTS.controlMt)}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-firstday">First Day of Week</Label>
            <Select value={defaults.firstDayOfWeek} onValueChange={(v) => set("firstDayOfWeek", v)}>
              <SelectTrigger id="def-firstday" className={cn("w-full", SETTINGS_DEFAULTS.controlMt)}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

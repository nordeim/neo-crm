"use client";

import { downloadFile } from "@/lib/download";
import * as React from "react";
import { Download, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-parts";
import { Tabs } from "@/components/ui/tabs";
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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-muted">
            No items yet
          </p>
        ) : (
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
        )}
        <div className="flex gap-2">
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
          <Button
            variant="secondary"
            size="icon"
            disabled={!value.trim()}
            aria-label="Add item"
            className="border-transparent bg-gray-800 text-white hover:bg-gray-700"
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
    // Session-6 (S6-12): reference wraps settings content in max-w-6xl mx-auto.
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Settings" subtitle="Configure your CRM preferences and defaults" />

      <Tabs
        variant="segmented"
        cols={3}
        value={tab}
        onValueChange={setTab}
        tabs={[
          { id: "config", label: "CRM Configuration" },
          { id: "defaults", label: "Defaults" },
          { id: "data", label: "Data" },
        ]}
      >
        <div className="py-4">
          {/* Config + Defaults editors remount (keyed) whenever a fresh
              settings snapshot arrives, so local state initializes from
              props at mount — never via setState-in-effect. */}
          {tab === "config" &&
            (settings ? (
              <ConfigEditor key={`cfg-${JSON.stringify(settings).length}`} settings={settings} />
            ) : (
              <p className="py-10 text-center text-sm text-muted">Loading settings…</p>
            ))}

          {tab === "defaults" &&
            (settings ? (
              <DefaultsEditor key={`def-${JSON.stringify(settings).length}`} settings={settings} />
            ) : (
              <p className="py-10 text-center text-sm text-muted">Loading settings…</p>
            ))}

          {tab === "data" && (
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => downloadFile("/api/export?type=contacts")}>
                    <Download className="h-3.5 w-3.5" /> Download Contacts Template
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => downloadFile("/api/export?type=accounts")}>
                    <Download className="h-3.5 w-3.5" /> Download Accounts Template
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => downloadFile("/api/export?type=leads")}>
                    <Download className="h-3.5 w-3.5" /> Download Leads Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => downloadFile("/api/export?type=contacts&download=1")}>
                    Export Contacts
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => downloadFile("/api/export?type=accounts&download=1")}>
                    Export Accounts
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => downloadFile("/api/export?type=leads&download=1")}>
                    Export Leads
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => downloadFile("/api/export?type=activities&download=1")}>
                    Export Activities
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-rose-200">
                <CardHeader>
                  <CardTitle className="text-danger">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-xs text-muted">
                    Reset deletes all accounts, contacts, leads, activities, events and saved reports. Users and settings are kept.
                    Type <span className="font-semibold text-foreground">RESET</span> to confirm.
                  </p>
                  <div className="flex max-w-md gap-2">
                    <Input
                      value={resetText}
                      onChange={(e) => setResetText(e.target.value)}
                      placeholder="RESET"
                      aria-label="Type RESET to confirm"
                      className={resetText && resetText !== "RESET" ? "border-rose-300" : ""}
                    />
                    <Button
                      variant="destructive"
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
                      <Trash2 className="h-4 w-4" /> Reset All Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Tabs>
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
        <ListEditor
          title="Industries"
          items={lists.industries}
          placeholder="Add new industry"
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
      <Card>
        <CardHeader>
          <CardTitle>Default Values</CardTitle>
          <p className="text-xs text-muted">Set default values for new records</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-1.5">
            <Label htmlFor="def-currency">Default Currency</Label>
            <Input
              id="def-currency"
              value={defaults.defaultCurrency}
              onChange={(e) => set("defaultCurrency", e.target.value.toUpperCase().slice(0, 6))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="def-stage">Default Lead Stage</Label>
            <Input
              id="def-stage"
              value={defaults.defaultLeadStage}
              onChange={(e) => set("defaultLeadStage", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="def-tier">Default Account Tier</Label>
            <Input
              id="def-tier"
              value={defaults.defaultTier}
              onChange={(e) => set("defaultTier", e.target.value.toUpperCase().slice(0, 2))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="def-follow">Follow-up Days After Activity</Label>
            <Input
              id="def-follow"
              type="number"
              min={0}
              max={90}
              value={defaults.followUpDays}
              onChange={(e) => set("followUpDays", Number(e.target.value) || 0)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Default Calendar View</Label>
            <Select value={defaults.calendarView} onValueChange={(v) => set("calendarView", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>First Day of Week</Label>
            <Select value={defaults.firstDayOfWeek} onValueChange={(v) => set("firstDayOfWeek", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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

"use client";

import { downloadBlob } from "@/lib/download";
import * as React from "react";
import { AlertCircle, Download, Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
import { CSV_TEMPLATES, CSV_TEMPLATE_MIME } from "@/lib/csv-templates";
import { entityDumpCsv, entityExportFilename } from "@/lib/entity-export";

interface ListEditorProps {
  title: string;
  items: string[];
  placeholder: string;
  onAdd: (value: string) => void;
  onUpdate: (index: number, name: string) => void;
  onDelete: (index: number) => void;
}

/**
 * Session-72 (H-72c1, bundle-decoded from the reference's ly
 * component): the picklist rows are BORDERED LIST ROWS — `flex
 * items-center gap-2 p-2 border rounded-lg hover:bg-gray-50` — each
 * carrying a `span.flex-1` name + a Pencil ghost icon button (the
 * inline RENAME: the row swaps to an Input [Enter saves] + a
 * Save-icon + an X) + a Trash2 ghost icon button in the reference's
 * red pair. The s7-era chip pills are retired. The icon buttons
 * carry aria-labels — the accessible superset over the reference's
 * unlabeled icons (the roving-tabindex precedent).
 */
function ListEditor({ title, items, placeholder, onAdd, onUpdate, onDelete }: ListEditorProps) {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingName, setEditingName] = React.useState("");
  const [value, setValue] = React.useState("");

  function saveEdit() {
    if (editingIndex !== null && editingName.trim()) {
      onUpdate(editingIndex, editingName.trim());
      setEditingIndex(null);
      setEditingName("");
    }
  }

  function add() {
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={CARD_TITLE_OVERRIDE.settings}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {/* The items container (space-y-2 mb-4) holds the mapped rows;
            the empty state renders as their sibling (the reference's
            `t.length===0 && p` children-array form). */}
        <div className={SETTINGS_PICKLIST.items}>
          {items.map((item, i) => (
            <div key={`${item}-${i}`} className={SETTINGS_PICKLIST.itemRow}>
              {editingIndex === i ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit();
                      }
                    }}
                    aria-label={`Rename ${item}`}
                  />
                  <Button size="icon" variant="ghost" onClick={saveEdit} aria-label="Save rename">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditingIndex(null)} aria-label="Cancel rename">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1">{item}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingIndex(i);
                      setEditingName(item);
                    }}
                    aria-label={`Rename ${item}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(i)}
                    className={SETTINGS_PICKLIST.deleteBtn}
                    aria-label={`Delete ${item}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
          {items.length === 0 && <p className={SETTINGS_PICKLIST.empty}>No items yet</p>}
        </div>
        <div className={SETTINGS_PICKLIST.addRow}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) {
                e.preventDefault();
                add();
              }
            }}
            placeholder={placeholder}
            aria-label={`Add new ${title.toLowerCase()} item`}
          />
          {/* Session-8 (S8-7, computed-color probe): the reference's add
              button uses bg-primary where --primary is the STOCK shadcn
              zinc-950 (rgb(23,23,23)) — a DARK button, not the app's blue
              (same neutral family as the profile Save Changes button).
              Session-72 (N-72c2): the dead `size="sm"` retired — the
              reference ships the default size. */}
          <Button
            className={SETTINGS_PICKLIST.addButton}
            disabled={!value.trim()}
            aria-label="Add item"
            onClick={add}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  // Session-65 (N-65c): updateSettings RETIRED from this destructure —
  // dead in SettingsPage's own scope (ConfigEditor + DefaultsEditor
  // each destructure their own from the store).
  const { settings, hydrated, fetchSettings, resetData, accounts, contacts, leads, activities } = useCrmStore();
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
          panel's own edge.
          Session-72 (M-72c4): BOTH editor tabs render INSTANTLY — the
          Config tab shows "No items yet" x5 and the Defaults tab the
          fallback values until the settings fetch resolves (the
          reference's own data:n=[] / ||"AED" contract; the "Loading
          settings…" gates retired). */}
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
        {/* Session-72 (M-72c1): the editors NEVER remount on their own
            saves — the ConfigEditor is props-driven (no key at all) and
            the DefaultsEditor keys on the RESOLVED EPOCH only (the
            single pending→resolved remount when the fetch lands; a
            store update from a save leaves the key — and the focus —
            intact). The s7-era JSON.stringify keys remounted the
            editors ~RTT after every PUT, wiping in-flight typing. */}
        <TabsPanel tab="config" className="mt-2 space-y-4">
          {tab === "config" && <ConfigEditor settings={settings} />}
        </TabsPanel>

        <TabsPanel tab="defaults" className="mt-2 space-y-4">
          {tab === "defaults" && <DefaultsEditor key={settings ? "resolved" : "pending"} settings={settings} />}
        </TabsPanel>

        {/* Session-72 (M-72c5, bundle-decoded): the reference's Data
            panel carries space-y-6 DIRECTLY (24px between the three
            cards — `ra value="data" className="space-y-6"`); the
            s14-era inner flex-col gap-4 wrapper (16px) retired. */}
        <TabsPanel tab="data" className="mt-2 space-y-6">
          {tab === "data" && (
            <>
              {/* Session-14 (S14-P2): the reference's template card carries
                  the 'Import ' prefix, a STOCK CardTitle and a VERTICAL
                  space-y-2 stack of outline default-size buttons.
                  Session-26 (S26-P1): the header gains the reference's
                  CardDescription; the 2nd+ buttons gain `ml-0 sm:ml-2`
                  (live-computed marginLeft 8px). S26-P3: the buttons are
                  STATIC client-side templates (the reference's `b(key)`
                  map — bundle-extracted), not /api/export calls. */}
              <Card>
                <CardHeader>
                  <CardTitle>{SETTINGS_DATA.importTitle}</CardTitle>
                  <div className={SETTINGS_DATA.desc}>Download CSV templates for bulk imports</div>
                </CardHeader>
                <CardContent className={SETTINGS_DATA.listBody}>
                  <Button
                    variant="outline"
                    className={SETTINGS_DATA.buttonCls}
                    onClick={() => {
                      const t = CSV_TEMPLATES.contacts;
                      downloadBlob(t.content, t.filename, CSV_TEMPLATE_MIME);
                    }}
                  >
                    <Download className={SETTINGS_DATA.buttonIcon} /> Download Contacts Template
                  </Button>
                  <Button
                    variant="outline"
                    className={SETTINGS_DATA.buttonClsAlt}
                    onClick={() => {
                      const t = CSV_TEMPLATES.accounts;
                      downloadBlob(t.content, t.filename, CSV_TEMPLATE_MIME);
                    }}
                  >
                    <Download className={SETTINGS_DATA.buttonIcon} /> Download Accounts Template
                  </Button>
                  <Button
                    variant="outline"
                    className={SETTINGS_DATA.buttonClsAlt}
                    onClick={() => {
                      const t = CSV_TEMPLATES.leads;
                      downloadBlob(t.content, t.filename, CSV_TEMPLATE_MIME);
                    }}
                  >
                    <Download className={SETTINGS_DATA.buttonIcon} /> Download Leads Template
                  </Button>
                </CardContent>
              </Card>

              {/* Session-26 (S26-P4): the exports are client-side RAW DUMPS —
                  the reference's `m(entity)` (bundle-extracted): the header is
                  the FIRST ROW's own keys, every value double-quoted, the
                  filename the SINGULAR entity + ISO date. At zero rows the
                  artifact is an EMPTY file (no header when there is no first
                  row) — live-verified on the reference.
                  Session-72 (L-72c1, bundle-decoded): every export button
                  carries the Download icon (the reference's `cs` at
                  w-4 h-4 mr-2) — the template buttons' exact chrome. */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                  <div className={SETTINGS_DATA.desc}>Export your CRM data to CSV</div>
                </CardHeader>
                <CardContent className={SETTINGS_DATA.listBody}>
                  <Button
                    variant="outline"
                    className={SETTINGS_DATA.buttonCls}
                    onClick={() => downloadBlob(entityDumpCsv(contacts), entityExportFilename("Contact"), "text/csv")}
                  >
                    <Download className={SETTINGS_DATA.buttonIcon} /> Export Contacts
                  </Button>
                  <Button
                    variant="outline"
                    className={SETTINGS_DATA.buttonClsAlt}
                    onClick={() => downloadBlob(entityDumpCsv(accounts), entityExportFilename("Account"), "text/csv")}
                  >
                    <Download className={SETTINGS_DATA.buttonIcon} /> Export Accounts
                  </Button>
                  <Button
                    variant="outline"
                    className={SETTINGS_DATA.buttonClsAlt}
                    onClick={() => downloadBlob(entityDumpCsv(leads), entityExportFilename("Lead"), "text/csv")}
                  >
                    <Download className={SETTINGS_DATA.buttonIcon} /> Export Leads
                  </Button>
                  <Button
                    variant="outline"
                    className={SETTINGS_DATA.buttonClsAlt}
                    onClick={() => downloadBlob(entityDumpCsv(activities), entityExportFilename("Activity"), "text/csv")}
                  >
                    <Download className={SETTINGS_DATA.buttonIcon} /> Export Activities
                  </Button>
                </CardContent>
              </Card>

              {/* Session-14 (S14-P3): the reference's TINTED warning surface
                  — border-red-200 + bg-red-50, the circle-alert title on
                  text-red-700, and a space-y-4 stack of the confirm input
                  group then the destructive button.
                  Session-26 (S26-P1): the header gains the reference's
                  `text-red-600` warning paragraph (live DOM probe — the s14
                  pin recorded "no warning paragraph" from a different
                  reference state; the live reference ships it today).
                  Session-26 (S26-P2): the destructive button carries the
                  reference's trash2 icon and the handler gates on the native
                  confirm() + reports via native alert()s (bundle-extracted:
                  the defensive guard, the 118-char confirm message, the
                  success/failure alerts) — the invented toast retired. */}
              <Card className={SETTINGS_DANGER.card}>
                <CardHeader>
                  <CardTitle className={SETTINGS_DANGER.title}>
                    <AlertCircle className={SETTINGS_DANGER.titleIcon} aria-hidden="true" />
                    Danger Zone
                  </CardTitle>
                  <div className={SETTINGS_DANGER.desc}>Permanently delete all CRM data. This cannot be undone.</div>
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
                      if (resetText !== "RESET") {
                        alert("Please type RESET to confirm");
                        return;
                      }
                      if (!confirm("This will permanently delete all contacts, accounts, leads, opportunities, activities, and calendar events. Are you sure?")) {
                        return;
                      }
                      try {
                        const res = await resetData();
                        if (res.ok) {
                          setResetText("");
                          alert("Data reset complete");
                        } else {
                          alert("Failed to reset data");
                        }
                      } catch {
                        alert("Failed to reset data");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> Reset All Data
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsPanel>
      </Tabs>
    </div>
    </div>
  );
}

/**
 * Session-72 (M-72c1 + M-72c4 + L-72c6): the props-driven contract —
 * the reference's own React-Query architecture. The five lists render
 * directly from the settings snapshot (the [] fallback covers the
 * not-yet-fetched state); only the TRANSIENT editing state (the
 * rename target, the add-input value) is local to the ListEditor.
 * A save PUTs the single-key patch computed from the CURRENT props;
 * the store's response updates the settings slice and the rows
 * re-render. A FAILED PUT can no longer leave a phantom item — the
 * UI shows the store's truth, and the props never changed (the
 * s46-P3 guarded-revert intent, now structural). The s7-era local
 * lists copy + the JSON.stringify remount key are both retired.
 */
function ConfigEditor({ settings }: { settings: Settings | null }) {
  const { updateSettings } = useCrmStore();

  function putList(key: ListKey, next: string[]) {
    void updateSettings({ [key]: next }).then((res) => {
      if (!res.ok) {
        toast.error("Could not save", res.error);
      }
    });
  }

  const lists: Record<ListKey, string[]> = {
    contactSources: settings?.contactSources ?? [],
    leadStages: settings?.leadStages ?? [],
    activityTypes: settings?.activityTypes ?? [],
    accountTiers: settings?.accountTiers ?? [],
    industries: settings?.industries ?? [],
  };

  return (
    <div className={SETTINGS_GRID}>
      <ListEditor
        title="Contact Sources"
        items={lists.contactSources}
        placeholder="Add new contact source"
        onAdd={(v) => putList("contactSources", [...lists.contactSources, v])}
        onUpdate={(i, name) => putList("contactSources", lists.contactSources.map((x, xi) => (xi === i ? name : x)))}
        onDelete={(i) => putList("contactSources", lists.contactSources.filter((_, xi) => xi !== i))}
      />
      <ListEditor
        title="Lead Stages"
        items={lists.leadStages}
        placeholder="Add new lead stage"
        onAdd={(v) => putList("leadStages", [...lists.leadStages, v])}
        onUpdate={(i, name) => putList("leadStages", lists.leadStages.map((x, xi) => (xi === i ? name : x)))}
        onDelete={(i) => putList("leadStages", lists.leadStages.filter((_, xi) => xi !== i))}
      />
      <ListEditor
        title="Activity Types"
        items={lists.activityTypes}
        placeholder="Add new activity type"
        onAdd={(v) => putList("activityTypes", [...lists.activityTypes, v])}
        onUpdate={(i, name) => putList("activityTypes", lists.activityTypes.map((x, xi) => (xi === i ? name : x)))}
        onDelete={(i) => putList("activityTypes", lists.activityTypes.filter((_, xi) => xi !== i))}
      />
      <ListEditor
        title="Account Tiers"
        items={lists.accountTiers}
        placeholder="Add new account tier"
        onAdd={(v) => putList("accountTiers", [...lists.accountTiers, v])}
        onUpdate={(i, name) => putList("accountTiers", lists.accountTiers.map((x, xi) => (xi === i ? name : x)))}
        onDelete={(i) => putList("accountTiers", lists.accountTiers.filter((_, xi) => xi !== i))}
      />
      {/* "Add new industrie" mirrors the reference's placeholder typo
          (like "Conversion Funnel") — SETTINGS_PICKLIST pins it. */}
      <ListEditor
        title="Industries"
        items={lists.industries}
        placeholder={SETTINGS_PICKLIST.industriesPlaceholder}
        onAdd={(v) => putList("industries", [...lists.industries, v])}
        onUpdate={(i, name) => putList("industries", lists.industries.map((x, xi) => (xi === i ? name : x)))}
        onDelete={(i) => putList("industries", lists.industries.filter((_, xi) => xi !== i))}
      />
    </div>
  );
}

type ListKey = "contactSources" | "leadStages" | "activityTypes" | "accountTiers" | "industries";

function DefaultsEditor({ settings }: { settings: Settings | null }) {
  const { updateSettings } = useCrmStore();
  // Session-72 (M-72c4, bundle-decoded): the reference's fallback
  // values — the editor mounts instantly (even before the settings
  // fetch resolves) showing AED/new/B/3/month/monday, exactly the
  // reference's `(l?.default_currency) || "AED"` family. The epoch
  // key remounts this initializer ONCE when the fetch lands.
  const [defaults, setDefaults] = React.useState(() => ({
    defaultCurrency: settings?.defaultCurrency ?? "AED",
    defaultLeadStage: settings?.defaultLeadStage ?? "new",
    defaultTier: settings?.defaultTier ?? "B",
    followUpDays: settings?.followUpDays ?? 3,
    calendarView: settings?.calendarView ?? "month",
    firstDayOfWeek: settings?.firstDayOfWeek ?? "monday",
  }));

  // Session-46 (S46-P2): the debounced persist. The reference mirrors an
  // immediate-PUT-per-change idiom, but its settings API validates
  // NOTHING — ours carries the s43-P3 membership guards (stage/tier), so
  // a per-keystroke PUT collided with a guaranteed-failing intermediate
  // (typing "N" in Default Lead Stage → 400 → a red toast per keystroke)
  // and left a last-RESOLVED-wins write race. ONE shared trailing
  // debounce (500 ms): the no-save-button parity line holds (changes
  // still persist automatically), the guards meet only the FINAL value,
  // and the flush is serialized so two PUTs can never race within this
  // editor. The unmount cleanup flushes a pending snapshot — a typed
  // edit is not lost on navigation.
  const pendingRef = React.useRef<typeof defaults | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushingRef = React.useRef(false);

  async function flush(): Promise<void> {
    const pending = pendingRef.current;
    if (!pending || flushingRef.current) return;
    flushingRef.current = true;
    pendingRef.current = null;
    try {
      const res = await updateSettings(pending);
      if (!res.ok) toast.error("Could not save", res.error);
    } finally {
      flushingRef.current = false;
      // A snapshot that arrived while this PUT was in flight re-runs the
      // flush — strictly after the in-flight one resolved.
      if (pendingRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => void flush(), 0);
      }
    }
  }

  // Session-72 (L-72c6): the pure form — `next` is computed OUTSIDE the
  // updater (the render's `defaults` is fresh at every event), so the
  // setDefaults updater no longer writes refs or schedules the timer
  // (React requires pure updaters; the s46 form embedded the
  // side effects inside the setDefaults callback).
  function set<K extends keyof typeof defaults>(key: K, value: (typeof defaults)[K]) {
    const next = { ...defaults, [key]: value };
    pendingRef.current = next;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void flush(), 500);
    setDefaults(next);
  }

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      void flush();
    },
    [],
  );

  return (
    // Session-73 (N-73a3): the single-child flex wrapper retired — the
    // Data-panel M-72c5 retirement's last sibling (a flex-col gap-4
    // around an only child computes nothing).
    <>
      {/* Session-14 (S14-P1): the reference's Default Values card is a
          SINGLE-COLUMN space-y-4 stack (16px between groups, every width)
          with space-y-2 groups (12px computed label→control gap), the
          STOCK CardTitle and the stock CardDescription subtitle
          (text-sm text-muted-foreground — 14px/#737373). Ours shipped a
          responsive 3-col grid with 6px gaps, the text-lg title and a
          12px subtitle.
          Session-72 (L-72c8 + N-72c1, bundle-decoded): the free-text
          inputs persist RAW keystrokes (the reference's onChange wires
          the value verbatim; our route's server-side uppercase + caps
          own the guard) and carry the reference's placeholders. */}
      <Card>
        <CardHeader>
          <CardTitle>Default Values</CardTitle>
          {/* Session-81 (N-81c6): the reference's CardDescription slot
              renders a DIV (live-DOM on its settings Defaults card) —
              the p retires; our own Data tab already renders the div
              (the s26 pin). */}
          <div className={SETTINGS_DEFAULTS.subtitle}>Set default values for new records</div>
        </CardHeader>
        <CardContent className={SETTINGS_DEFAULTS.body}>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-currency">Default Currency</Label>
            <Input
              id="def-currency"
              className={SETTINGS_DEFAULTS.controlMt}
              value={defaults.defaultCurrency}
              onChange={(e) => set("defaultCurrency", e.target.value)}
              placeholder="AED"
            />
          </div>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-stage">Default Lead Stage</Label>
            <Input
              id="def-stage"
              className={SETTINGS_DEFAULTS.controlMt}
              value={defaults.defaultLeadStage}
              onChange={(e) => set("defaultLeadStage", e.target.value)}
              placeholder="new"
            />
          </div>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-tier">Default Account Tier</Label>
            <Input
              id="def-tier"
              className={SETTINGS_DEFAULTS.controlMt}
              value={defaults.defaultTier}
              onChange={(e) => set("defaultTier", e.target.value)}
              placeholder="B"
            />
          </div>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-follow">Follow-up Days After Activity</Label>
            {/* Session-81 (L-81c4): the reference's follow-up input ships
                NO min/max (live-probed, hasAttribute false on both) — the
                spinner is unbounded like its own quirk; the API-side 0-90
                guard stays as the documented s43-P3/S46-P2 superset (the
                debounce ensures only the FINAL value meets it). */}
            <Input
              id="def-follow"
              className={SETTINGS_DEFAULTS.controlMt}
              type="number"
              value={defaults.followUpDays}
              onChange={(e) => set("followUpDays", Number(e.target.value) || 0)}
            />
          </div>
          <div className={SETTINGS_DEFAULTS.group}>
            <Label htmlFor="def-calview">Default Calendar View</Label>
            <Select value={defaults.calendarView} onValueChange={(v) => set("calendarView", v)}>
              <SelectTrigger id="def-calview" className={cn("w-full", SETTINGS_DEFAULTS.controlMt)}><SelectValue /></SelectTrigger>
              <SelectContent>
                {/* Session-72 (M-72c3, bundle-decoded): the reference's
                    Select ships exactly month/week — the invented
                    "Agenda" option retired. */}
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
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
    </>
  );
}

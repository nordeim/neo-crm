"use client";

// Session-28 (S28-P6): the reference's Account Insights dialog (the
// bundle's `Ece`), opened by the accounts row click + the "View Insights"
// menu item. Anatomy (bundle-extracted; the icon identities + the box
// shape re-derived session-84 at the aliases' own tr() assignment
// lines — the s76 playbook trick):
//
// - max-w-3xl max-h-[80vh] overflow-y-auto dialog
// - header: the account name (text-xl DialogTitle) + industry
//   (text-sm text-gray-500) + the status badge (active = green-100/
//   green-800, else gray-100/gray-800)
// - THREE stat cards (grid grid-cols-3 gap-4, p-4 text-center):
//   Total Revenue `$X.XM` (the closed_won OPP sum — TrendingUp,
//   blue), Open Deals (Target, green — NOTE the reference's own quirk:
//   `stage !== "closed_lost"` ONLY, so WON deals count too), Contacts
//   (Users, purple)
// - the Recent Activities / Contacts / Open Deals tabs:
//   - activities: the type-tinted w-10 h-10 icon rows (Email = blue-100/
//     blue-600 Mail, Call = green-100/green-600 Phone, else purple-100/
//     purple-600 Calendar — the BLANK-BODY glyph, the s17 sidebar
//     family) + description + toLocaleDateString + the type outline
//     badge — max 5, "No recent activities" at zero
//   - contacts: the stock Avatar initials circle — the reference's Ll
//     (Radix Avatar.Root: relative flex h-10 w-10 shrink-0
//     overflow-hidden rounded-full) + the appended blue tint classes,
//     twMerge-resolved below; the initials ride the reference's own
//     split/map/join formula (no uppercase)
//   - deals: the OPEN deals only (neither closed_lost nor closed_won) —
//     name, "Close Date: " + date, $amount + the stage badge (the BARE
//     default-variant Badge + the raw slug — NOT the dashboard's
//     colored P-map, a different surface)
//
// Session-31: the deals surfaces derive from OPPORTUNITIES matched by the
// account NAME string (the reference's account_name join); activities
// still match by our relational accountId.

import * as React from "react";
import { Calendar, Mail, Phone, Target, TrendingUp, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsPanel } from "@/components/ui/tabs";
import { ACTIVITY_TYPE_META } from "@/lib/constants";
import type { Account, Activity, Contact, Opportunity } from "@/types";

export function AccountInsightsDialog({
  open,
  onOpenChange,
  account,
  activities,
  contacts,
  opportunities,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  activities: Activity[];
  contacts: Contact[];
  opportunities: Opportunity[];
}) {
  const [tab, setTab] = React.useState("activities");
  if (!account) return null;

  const accountActivities = activities.filter((a) => a.accountId === account.id);
  const accountContacts = contacts.filter((c) => c.accountId === account.id);
  // Session-31: the reference's account_name join — the OPPS matched by
  // the account NAME string.
  const accountOpps = opportunities.filter((o) => o.accountName === account.name);
  const wonRevenue = accountOpps
    .filter((o) => o.stage === "closed_won")
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  // The reference's own quirk: the Open Deals COUNT card filters
  // `stage !== "closed_lost"` ONLY — won deals count toward it.
  const notLostCount = accountOpps.filter((o) => o.stage !== "closed_lost").length;
  const openDeals = accountOpps.filter((o) => o.stage !== "closed_lost" && o.stage !== "closed_won");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{account.name}</DialogTitle>
              <p className="text-sm text-gray-500">{account.industry}</p>
            </div>
            <Badge className={account.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {account.status}
            </Badge>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">${(wonRevenue / 1e6).toFixed(1)}M</div>
              <div className="text-xs text-gray-500">Total Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{notLostCount}</div>
              <div className="text-xs text-gray-500">Open Deals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{accountContacts.length}</div>
              <div className="text-xs text-gray-500">Contacts</div>
            </CardContent>
          </Card>
        </div>
        <Tabs
          tabs={[
            { id: "activities", label: "Recent Activities" },
            { id: "contacts", label: "Contacts" },
            { id: "deals", label: "Open Deals" },
          ]}
          value={tab}
          onValueChange={setTab}
          className="w-full"
          variant="segmented"
          cols={3}
        >
          <TabsPanel tab="activities" className="space-y-3 mt-4">
            {accountActivities.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No recent activities</p>
            ) : (
              /* Session-47 (S47-P2, F-47b): the icon comparisons match OUR
               * lowercase Activity.type vocabulary (ACTIVITY_TYPES — the
               * seed and every other surface lowercase). The reference's
               * own dialog compares Capitalized "Email"/"Call" because ITS
               * storage is Capitalized (bundle: ["Call","Email","Meeting",
               * "Task","Note"]); mirrored verbatim the comparisons were
               * dead here — every row fell to the purple CalendarDays
               * fallback. The tint classes + icon mapping stay verbatim. */
              accountActivities.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      a.type === "email"
                        ? "bg-blue-100 text-blue-600"
                        : a.type === "call"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {a.type === "email" ? (
                      <Mail className="w-5 h-5" />
                    ) : a.type === "call" ? (
                      <Phone className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(a.dueAt ?? a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Session-48 (S48-P3, N-48b): the badge renders the
                      house display-case label (ACTIVITY_TYPE_META — the
                      activities page + the reports route idiom) instead of
                      the raw lowercase slug: the reference's badge renders
                      ITS raw type, which is Capitalized in ITS storage;
                      ours stores lowercase, so the label map renders the
                      same DISPLAY the reference renders. */}
                  <Badge variant="outline" className="text-xs">
                    {ACTIVITY_TYPE_META[a.type]?.label ?? a.type}
                  </Badge>
                </div>
              ))
            )}
          </TabsPanel>
          <TabsPanel tab="contacts" className="space-y-3 mt-4">
            {accountContacts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No contacts found</p>
            ) : (
              accountContacts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {/* Session-84 (M-84c3): the reference's stock Avatar
                   * initials CIRCLE — its Ll is the Radix Avatar.Root
                   * wrapper ("relative flex h-10 w-10 shrink-0
                   * overflow-hidden rounded-full") with the tint
                   * classes appended ("w-10 h-10 bg-blue-100
                   * text-blue-600 flex items-center justify-center
                   * text-sm font-semibold"); twMerge resolves the pair
                   * to this single string (the topbar's s17 two-level
                   * avatar is the house stock-mirror precedent). The
                   * initials ride the reference's own formula (no
                   * uppercase — N-84c6, the "FORMULA is the parity"
                   * precedent). */}
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-blue-100 text-blue-600 items-center justify-center text-sm font-semibold">
                    {c.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.position || "Contact"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{c.email ?? ""}</p>
                    <p className="text-xs text-gray-500">{c.phone ?? ""}</p>
                  </div>
                </div>
              ))
            )}
          </TabsPanel>
          <TabsPanel tab="deals" className="space-y-3 mt-4">
            {openDeals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No open deals</p>
            ) : (
              openDeals.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Close Date:{" "}
                      {d.closeDate ? new Date(d.closeDate).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${(d.amount || 0).toLocaleString()}</p>
                    {/* Session-84 (L-84c4): the reference's deals badge
                     * is the BARE default-variant zn with only
                     * "mt-1 text-xs" — the dark stock primary + the
                     * RAW stage slug. The colored OPP_STAGE_META map is
                     * its DASHBOARD badge family (the Recent Deals
                     * P[N.stage] — a different surface, kept there). */}
                    <Badge className="mt-1 text-xs">{d.stage}</Badge>
                  </div>
                </div>
              ))
            )}
          </TabsPanel>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

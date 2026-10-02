"use client";

// Session-28 (S28-P6): the reference's Account Insights dialog (the
// bundle's `Ece`), opened by the accounts row click + the "View Insights"
// menu item. Anatomy (bundle-extracted):
//
// - max-w-3xl max-h-[80vh] overflow-y-auto dialog
// - header: the account name (text-xl DialogTitle) + industry
//   (text-sm text-gray-500) + the status badge (active = green-100/
//   green-800, else gray-100/gray-800)
// - THREE stat cards (grid grid-cols-3 gap-4, p-4 text-center):
//   Total Revenue `$X.XM` (the closed_won OPP sum, blue), Open Deals
//   (green — NOTE the reference's own quirk: `stage !== "closed_lost"`
//   ONLY, so WON deals count too), Contacts (purple)
// - the Recent Activities / Contacts / Open Deals tabs:
//   - activities: the type-tinted w-10 h-10 icon rows (Email = blue-100/
//     blue-600 Mail, Call = green-100/green-600 Phone, else purple-100/
//     purple-600 CalendarDays) + description + toLocaleDateString + the
//     type outline badge — max 5, "No recent activities" at zero
//   - contacts: the initials box (w-10 h-10 bg-blue-100 text-blue-600)
//     + name + position || "Contact" + email/phone right
//   - deals: the OPEN deals only (neither closed_lost nor closed_won) —
//     name, "Close Date: " + date, $amount + the stage badge
//
// Session-31: the deals surfaces derive from OPPORTUNITIES matched by the
// account NAME string (the reference's account_name join); activities
// still match by our relational accountId.

import * as React from "react";
import { CalendarDays, Mail, Phone, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsPanel } from "@/components/ui/tabs";
import { OPP_STAGE_META } from "@/lib/constants";
import type { Account, Activity, Contact, Opportunity } from "@/types";

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

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
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">${(wonRevenue / 1e6).toFixed(1)}M</div>
              <div className="text-xs text-gray-500">Total Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Phone className="w-6 h-6 mx-auto mb-2 text-green-600" />
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
              accountActivities.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      a.type === "Email"
                        ? "bg-blue-100 text-blue-600"
                        : a.type === "Call"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {a.type === "Email" ? (
                      <Mail className="w-5 h-5" />
                    ) : a.type === "Call" ? (
                      <Phone className="w-5 h-5" />
                    ) : (
                      <CalendarDays className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(a.dueAt ?? a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">{a.type}</Badge>
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
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                    {initials(c.name)}
                  </div>
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
                    <Badge className={`mt-1 text-xs ${OPP_STAGE_META[d.stage]?.badge ?? ""}`}>{d.stage}</Badge>
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

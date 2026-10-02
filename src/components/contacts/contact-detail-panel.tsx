"use client";

// Session-28 (S28-P4): the reference's Contact Details SLIDE-OVER (the
// bundle's `Pke`), opened by the contacts row click (and the mobile card
// click). NOT a dialog — a right-side panel: `fixed top-0 right-0 h-full
// w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto border-l`.
//
// Anatomy (bundle-extracted):
// - sticky header: "Contact Details" (text-xl font-bold) + the ghost X
// - hero (text-center pb-6 border-b): w-20 h-20 gradient circle + the
//   FIRST INITIAL, name (text-2xl font-bold), position || "No position",
//   the priority badge (Key/Standard/At Risk class map) + the optional
//   role outline badge, the engagement 3-bar indicator (-600 solids)
// - the Call / Email / WhatsApp grid-cols-3 outline buttons
// - the "Contact Information" card with icon rows (Email / Phone /
//   Company + company_size / Last Activity "MMM D, YYYY")
// - the Activities / Deals / Notes tabs with the empty states
//   "No activities yet" / "No deals found" / "No notes yet"
//
// The activities/deals data ride props (the page already holds both
// slices in the store; the reference queries per-contact — the props are
// the equivalent seam).

import * as React from "react";
import {
  Building2,
  CalendarDays,
  Mail,
  MessageCircle,
  Phone,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsPanel } from "@/components/ui/tabs";
import type { Activity, Contact, Opportunity } from "@/types";
import {
  CONTACT_PRIORITY_META,
  ENGAGEMENT_BARS_SOLID,
  engagementBarCount,
} from "@/lib/constants";

function mmmDyyyy(d: string): string {
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`;
}

export function ContactDetailPanel({
  contact,
  activities,
  opportunities,
  onClose,
}: {
  contact: Contact | null;
  activities: Activity[];
  /** Session-31: the reference's Pke joins OPPORTUNITIES by
   *  account_name === contact.company (bundle: Opportunity.filter). */
  opportunities: Opportunity[];
  onClose: () => void;
}) {
  const [tab, setTab] = React.useState("activities");
  if (!contact) return null;

  const contactActivities = activities.filter((a) => a.contactId === contact.id);
  const contactDeals = opportunities.filter((o) => o.accountName === contact.company);
  const bars = engagementBarCount(contact.engagementLevel);

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto border-l">
      <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
        <h2 className="text-xl font-bold">Contact Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close contact details">
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-6 space-y-6">
        <div className="text-center pb-6 border-b">
          {/* Session-30 (S30-P4): the reference's Pke hero is
              INITIAL-ONLY — no img branch in the bundle (unlike the table
              row and the mobile cards, which DO render photo_url). Our
              invented img branch is retired; the w-20 gradient circle
              always shows the first initial. */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">
              {(contact.name.charAt(0) ?? "").toUpperCase()}
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{contact.name}</h3>
          <p className="text-gray-600 mb-3">{contact.position || "No position"}</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className={`${CONTACT_PRIORITY_META[contact.priority] ?? CONTACT_PRIORITY_META.Standard} border font-medium px-3 py-1`}>
              {contact.priority || "Standard"}
            </Badge>
            {contact.role && <Badge variant="outline">{contact.role}</Badge>}
          </div>
          {contact.engagementLevel && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-600">Engagement:</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-6 rounded ${
                      i < bars
                        ? ENGAGEMENT_BARS_SOLID[contact.engagementLevel as keyof typeof ENGAGEMENT_BARS_SOLID]
                        : ENGAGEMENT_BARS_SOLID.empty
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="w-full">
            <Phone className="w-4 h-4 mr-1" />Call
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Mail className="w-4 h-4 mr-1" />Email
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <MessageCircle className="w-4 h-4 mr-1" />WhatsApp
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{contact.email ?? "—"}</p>
              </div>
            </div>
            {contact.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{contact.phone}</p>
                </div>
              </div>
            )}
            {contact.company && (
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="font-medium">{contact.company}</p>
                  {contact.companySize && (
                    <p className="text-sm text-gray-500">{contact.companySize}</p>
                  )}
                </div>
              </div>
            )}
            {contact.lastActivityAt && (
              <div className="flex items-start gap-3">
                <CalendarDays className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Last Activity</p>
                  <p className="font-medium">{mmmDyyyy(contact.lastActivityAt)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs
          tabs={[
            { id: "activities", label: "Activities" },
            { id: "deals", label: "Deals" },
            { id: "notes", label: "Notes" },
          ]}
          value={tab}
          onValueChange={setTab}
          className="w-full"
          variant="segmented"
          cols={3}
        >
          <TabsPanel tab="activities" className="mt-4 space-y-3">
            {contactActivities.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No activities yet</p>
            ) : (
              contactActivities.slice(0, 5).map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">{a.type}</p>
                        <p className="text-sm text-gray-600">{a.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {mmmDyyyy(a.dueAt ?? a.completedAt ?? a.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsPanel>
          <TabsPanel tab="deals" className="mt-4 space-y-3">
            {contactDeals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No deals found</p>
            ) : (
              contactDeals.map((d) => (
                <Card key={d.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{d.name}</p>
                        <p className="text-sm text-gray-600">
                          $ {d.amount == null ? 0 : d.amount.toLocaleString()}
                        </p>
                      </div>
                      <Badge>{d.stage}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsPanel>
          <TabsPanel tab="notes" className="mt-4">
            <p className="text-center text-gray-500 py-8">No notes yet</p>
          </TabsPanel>
        </Tabs>
      </div>
    </div>
  );
}

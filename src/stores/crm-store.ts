"use client";

// Single Zustand store for all server state (scaffold convention — no React
// Query, no SWR). Actions call the API envelope, then refresh the affected
// slice. `call()` is the only sanctioned fetch client.

import { create } from "zustand";
import type {
  Opportunity,
  Account,
  Activity,
  Contact,
  CrmEvent,
  DashboardData,
  Lead,
  ReportsData,
  Result,
  Settings,
  User,
} from "@/types";

interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
}

async function call<T>(path: string, init?: RequestInit): Promise<Result<T, string>> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
    if (!res.ok || !body || body.ok === false) {
      const message =
        body && body.error ? body.error.message : `Request failed (${res.status})`;
      return { ok: false, error: message };
    }
    return { ok: true, data: body.data as T };
  } catch {
    return { ok: false, error: "Network error — check your connection and try again." };
  }
}

export interface CrmState {
  // session
  user: User | null;
  users: User[];
  hydrated: boolean;

  // domain slices
  accounts: Account[];
  contacts: Contact[];
  leads: Lead[];
  opportunities: Opportunity[];
  activities: Activity[];
  events: CrmEvent[];
  settings: Settings | null;
  dashboard: DashboardData | null;

  // actions
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchContacts: () => Promise<void>;
  fetchLeads: () => Promise<void>;
  fetchOpportunities: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  fetchEvents: (from?: string, to?: string) => Promise<void>;
  fetchSettings: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
  fetchReports: (params: Record<string, string>) => Promise<Result<ReportsData, string>>;

  createAccount: (input: Record<string, unknown>) => Promise<Result<Account, string>>;
  updateAccount: (id: string, input: Record<string, unknown>) => Promise<Result<Account, string>>;
  deleteAccount: (id: string) => Promise<Result<null, string>>;

  createContact: (input: Record<string, unknown>) => Promise<Result<Contact, string>>;
  updateContact: (id: string, input: Record<string, unknown>) => Promise<Result<Contact, string>>;
  deleteContact: (id: string) => Promise<Result<null, string>>;
  // Session-38 (S38-P3): the Import dialog's batch path — serial POSTs
  // with ONE slice refetch after the loop (createContact's per-call
  // refetch made an N-row import O(N²) network).
  importContacts: (inputs: Record<string, unknown>[]) => Promise<{ created: number; attempted: number }>;

  createLead: (input: Record<string, unknown>) => Promise<Result<Lead, string>>;
  updateLead: (id: string, input: Record<string, unknown>) => Promise<Result<Lead, string>>;
  deleteLead: (id: string) => Promise<Result<null, string>>;

  createActivity: (input: Record<string, unknown>) => Promise<Result<Activity, string>>;
  updateActivity: (id: string, input: Record<string, unknown>) => Promise<Result<Activity, string>>;
  deleteActivity: (id: string) => Promise<Result<null, string>>;

  createEvent: (input: Record<string, unknown>) => Promise<Result<CrmEvent, string>>;
  updateEvent: (id: string, input: Record<string, unknown>) => Promise<Result<CrmEvent, string>>;
  deleteEvent: (id: string) => Promise<Result<null, string>>;

  updateSettings: (patch: Record<string, unknown>) => Promise<Result<Settings, string>>;
  resetData: () => Promise<Result<null, string>>;
}

export const useCrmStore = create<CrmState>((set, get) => ({
  user: null,
  users: [],
  hydrated: false,
  accounts: [],
  contacts: [],
  leads: [],
  opportunities: [],
  activities: [],
  events: [],
  settings: null,
  dashboard: null,

  hydrate: async () => {
    const res = await call<User | null>("/api/auth/me");
    if (res.ok && res.data) {
      set({ user: res.data, hydrated: true });
      await Promise.all([
        get().fetchUsers(),
        get().fetchAccounts(),
        get().fetchContacts(),
        get().fetchLeads(),
        get().fetchOpportunities(),
        get().fetchActivities(),
        get().fetchEvents(),
        get().fetchSettings(),
        get().fetchDashboard(),
      ]);
    } else {
      set({ user: null, hydrated: true });
    }
  },

  logout: async () => {
    await call("/api/auth/logout", { method: "POST" });
    // Session-35: settings joins the reset — the previous user's picklists
    // otherwise linger in memory into the next session until hydrate()'s
    // fetchSettings overwrites them.
    set({ user: null, users: [], accounts: [], contacts: [], leads: [], opportunities: [], activities: [], events: [], dashboard: null, settings: null });
  },

  fetchUsers: async () => {
    const res = await call<User[]>("/api/users");
    if (res.ok) set({ users: res.data });
  },

  fetchAccounts: async () => {
    const res = await call<Account[]>("/api/accounts");
    if (res.ok) set({ accounts: res.data });
  },

  fetchContacts: async () => {
    const res = await call<Contact[]>("/api/contacts");
    if (res.ok) set({ contacts: res.data });
  },

  fetchLeads: async () => {
    const res = await call<Lead[]>("/api/leads");
    if (res.ok) set({ leads: res.data });
  },

  fetchOpportunities: async () => {
    const res = await call<Opportunity[]>("/api/opportunities");
    if (res.ok) set({ opportunities: res.data });
  },

  fetchActivities: async () => {
    const res = await call<Activity[]>("/api/activities");
    if (res.ok) set({ activities: res.data });
  },

  fetchEvents: async (from, to) => {
    const qs = from || to ? `?${new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) })}` : "";
    const res = await call<CrmEvent[]>(`/api/events${qs}`);
    if (res.ok) set({ events: res.data });
  },

  fetchSettings: async () => {
    const res = await call<Settings>("/api/settings");
    if (res.ok) set({ settings: res.data });
  },

  fetchDashboard: async () => {
    const res = await call<DashboardData>("/api/dashboard");
    if (res.ok) set({ dashboard: res.data });
  },

  fetchReports: async (params) => call<ReportsData>(`/api/reports?${new URLSearchParams(params)}`),

  // ---- accounts ----
  createAccount: async (input) => {
    const res = await call<Account>("/api/accounts", { method: "POST", body: JSON.stringify(input) });
    if (res.ok) await get().fetchAccounts();
    return res;
  },
  updateAccount: async (id, input) => {
    const res = await call<Account>(`/api/accounts/${id}`, { method: "PUT", body: JSON.stringify(input) });
    if (res.ok) await Promise.all([get().fetchAccounts(), get().fetchDashboard()]);
    return res;
  },
  deleteAccount: async (id) => {
    const res = await call<null>(`/api/accounts/${id}`, { method: "DELETE" });
    if (res.ok) await get().fetchAccounts();
    return res;
  },

  // ---- contacts ----
  createContact: async (input) => {
    const res = await call<Contact>("/api/contacts", { method: "POST", body: JSON.stringify(input) });
    if (res.ok) await get().fetchContacts();
    return res;
  },
  // Session-38 (S38-P3): the import batch — the reference's flow is a
  // serial per-row create; the difference is the refetch, ONCE after
  // the loop (the naive per-row createContact refetch was O(N²)).
  // Session-39 (S39-P2): the return is { created, attempted } — a bare
  // count cannot tell "the CSV had no valid rows" from "every POST
  // failed" (expired session, network drop), and the page rendered the
  // wrong banner for the second case.
  importContacts: async (inputs) => {
    let created = 0;
    const attempted = inputs.length;
    for (const input of inputs) {
      const res = await call<Contact>("/api/contacts", { method: "POST", body: JSON.stringify(input) });
      if (res.ok) created += 1;
    }
    await get().fetchContacts();
    return { created, attempted };
  },
  updateContact: async (id, input) => {
    const res = await call<Contact>(`/api/contacts/${id}`, { method: "PUT", body: JSON.stringify(input) });
    if (res.ok) await get().fetchContacts();
    return res;
  },
  deleteContact: async (id) => {
    const res = await call<null>(`/api/contacts/${id}`, { method: "DELETE" });
    if (res.ok) await get().fetchContacts();
    return res;
  },

  // ---- leads ----
  createLead: async (input) => {
    const res = await call<Lead>("/api/leads", { method: "POST", body: JSON.stringify(input) });
    if (res.ok) await Promise.all([get().fetchLeads(), get().fetchDashboard()]);
    return res;
  },
  updateLead: async (id, input) => {
    // Session-29 (S29-P2, the C2 contract): apply the patch to the leads
    // slice BEFORE the network call — the reference's React-Query cache
    // updates instantly on the inline row edits (Value/Status/Date), and
    // the per-keystroke controlled inputs need the local apply to avoid
    // the stale-race clobber. The refetch reconciles; on failure it
    // rolls back to server truth.
    set({ leads: get().leads.map((l) => (l.id === id ? ({ ...l, ...input } as Lead) : l)) });
    const res = await call<Lead>(`/api/leads/${id}`, { method: "PUT", body: JSON.stringify(input) });
    await Promise.all([get().fetchLeads(), get().fetchDashboard()]);
    return res;
  },
  deleteLead: async (id) => {
    const res = await call<null>(`/api/leads/${id}`, { method: "DELETE" });
    if (res.ok) await Promise.all([get().fetchLeads(), get().fetchDashboard()]);
    return res;
  },

  // ---- activities ----
  createActivity: async (input) => {
    const res = await call<Activity>("/api/activities", { method: "POST", body: JSON.stringify(input) });
    if (res.ok) await Promise.all([get().fetchActivities(), get().fetchDashboard()]);
    return res;
  },
  updateActivity: async (id, input) => {
    const res = await call<Activity>(`/api/activities/${id}`, { method: "PUT", body: JSON.stringify(input) });
    if (res.ok) await get().fetchActivities();
    return res;
  },
  deleteActivity: async (id) => {
    const res = await call<null>(`/api/activities/${id}`, { method: "DELETE" });
    if (res.ok) await get().fetchActivities();
    return res;
  },

  // ---- events ----
  createEvent: async (input) => {
    const res = await call<CrmEvent>("/api/events", { method: "POST", body: JSON.stringify(input) });
    if (res.ok) await get().fetchEvents();
    return res;
  },
  updateEvent: async (id, input) => {
    const res = await call<CrmEvent>(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(input) });
    if (res.ok) await get().fetchEvents();
    return res;
  },
  deleteEvent: async (id) => {
    const res = await call<null>(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) await get().fetchEvents();
    return res;
  },

  updateSettings: async (patch) => {
    const res = await call<Settings>("/api/settings", { method: "PUT", body: JSON.stringify(patch) });
    if (res.ok) set({ settings: res.data });
    return res;
  },

  resetData: async () => {
    const res = await call<null>("/api/reset", { method: "POST", body: JSON.stringify({ confirm: "RESET" }) });
    if (res.ok) {
      await Promise.all([
        get().fetchAccounts(),
        get().fetchContacts(),
        get().fetchLeads(),
        // Session-35: the reset route wipes opportunities too — refetch the
        // slice or the reports owner dropdown keeps listing pre-reset owners.
        get().fetchOpportunities(),
        get().fetchActivities(),
        get().fetchEvents(),
        get().fetchSettings(),
        get().fetchDashboard(),
      ]);
    }
    return res;
  },
}));

export { call as apiCall };

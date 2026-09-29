"use client";

// Single Zustand store for all server state (scaffold convention — no React
// Query, no SWR). Actions call the API envelope, then refresh the affected
// slice. `call()` is the only sanctioned fetch client.

import { create } from "zustand";
import type {
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
  activities: Activity[];
  events: CrmEvent[];
  settings: Settings | null;
  dashboard: DashboardData | null;
  loadingFlags: Record<string, boolean>;

  // actions
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchContacts: () => Promise<void>;
  fetchLeads: () => Promise<void>;
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

function loading(store: CrmState, key: string, on: boolean) {
  return { loadingFlags: { ...store.loadingFlags, [key]: on } };
}

export const useCrmStore = create<CrmState>((set, get) => ({
  user: null,
  users: [],
  hydrated: false,
  accounts: [],
  contacts: [],
  leads: [],
  activities: [],
  events: [],
  settings: null,
  dashboard: null,
  loadingFlags: {},

  hydrate: async () => {
    const res = await call<User | null>("/api/auth/me");
    if (res.ok && res.data) {
      set({ user: res.data, hydrated: true });
      await Promise.all([
        get().fetchUsers(),
        get().fetchAccounts(),
        get().fetchContacts(),
        get().fetchLeads(),
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
    set({ user: null, users: [], accounts: [], contacts: [], leads: [], activities: [], events: [], dashboard: null });
  },

  fetchUsers: async () => {
    const res = await call<User[]>("/api/users");
    if (res.ok) set({ users: res.data });
  },

  fetchAccounts: async () => {
    set((s) => loading(s, "accounts", true));
    const res = await call<Account[]>("/api/accounts");
    set((s) => ({ accounts: res.ok ? res.data : s.accounts, ...loading(s, "accounts", false) }));
  },

  fetchContacts: async () => {
    set((s) => loading(s, "contacts", true));
    const res = await call<Contact[]>("/api/contacts");
    set((s) => ({ contacts: res.ok ? res.data : s.contacts, ...loading(s, "contacts", false) }));
  },

  fetchLeads: async () => {
    set((s) => loading(s, "leads", true));
    const res = await call<Lead[]>("/api/leads");
    set((s) => ({ leads: res.ok ? res.data : s.leads, ...loading(s, "leads", false) }));
  },

  fetchActivities: async () => {
    set((s) => loading(s, "activities", true));
    const res = await call<Activity[]>("/api/activities");
    set((s) => ({ activities: res.ok ? res.data : s.activities, ...loading(s, "activities", false) }));
  },

  fetchEvents: async (from, to) => {
    set((s) => loading(s, "events", true));
    const qs = from || to ? `?${new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) })}` : "";
    const res = await call<CrmEvent[]>(`/api/events${qs}`);
    set((s) => ({ events: res.ok ? res.data : s.events, ...loading(s, "events", false) }));
  },

  fetchSettings: async () => {
    const res = await call<Settings>("/api/settings");
    if (res.ok) set({ settings: res.data });
  },

  fetchDashboard: async () => {
    set((s) => loading(s, "dashboard", true));
    const res = await call<DashboardData>("/api/dashboard");
    set((s) => ({ dashboard: res.ok ? res.data : s.dashboard, ...loading(s, "dashboard", false) }));
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
    const res = await call<Lead>(`/api/leads/${id}`, { method: "PUT", body: JSON.stringify(input) });
    if (res.ok) await Promise.all([get().fetchLeads(), get().fetchDashboard()]);
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

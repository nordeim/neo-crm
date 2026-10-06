"use client";

// Single Zustand store for all server state (scaffold convention — no React
// Query, no SWR). Actions call the API envelope, then refresh the affected
// slice (fetchReports is the one exception — reports data is page-local,
// never stored; the API call rides call() for the envelope contract).
// call() is the only sanctioned JSON-ENVELOPE client (N-70c3 re-scope:
// the eight raw-fetch exceptions — the topbar AbortController search, the
// pre-store login-card flows, the multipart photo uploads, the
// BOM-preserving blob export, the profile PATCH — each documents its own
// reason at its site).

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

// Session-45 (S45-P4): the events-slice last-call-wins token. fetchEvents
// had no AbortController and was last-RESOLVED-wins — rapid calendar
// month flips could strand the stale month's slice (Feb resolving after
// Mar shows February's events under March's cursor). A monotonically
// increasing token per call: only the newest call's resolution may write
// the slice. Sequential flows are unaffected (the token only skips a
// write when a NEWER call exists — the hydrate → calendar-effect
// handoff resolves in the calendar's favor, the correct owner).
let eventsFetchToken = 0;

// Session-64 (N-64j): the logout write-guard — the s45 token family's
// third seam (after the s45-P3 topbar AbortController and the s45-P4
// events token). logout() clears every slice, but hydrate()'s nine
// parallel fetches and the page effects' refetches carried no generation
// token: a logout landing mid-fetch let the stale resolutions
// re-populate the cleared slices (the s35 leakage class via a narrow
// race window — self-healing on the next hydrate, but a cross-user
// flash on a fast logout → login). Every fetch captures this token at
// entry and may only write while it still matches; logout bumps it
// (and the events token, invalidating in-flight fetchEvents through
// its own s45 mechanism) immediately before the clearing set.
let sessionWriteToken = 0;

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
    // Session-64 (N-64j): a logout that landed while /api/auth/me was
    // in flight kills this hydrate entirely — no user set, no slice
    // fetches (the stale resolutions could otherwise re-populate the
    // logged-out store, the s35 leakage class).
    // Session-70 (N-70c1): the nine fetches below run in the same
    // continuation as the hydrated:true flip, so each page's
    // hydrated-gate effect (`if (hydrated) fetchX()`) fires a CONCURRENT
    // DUPLICATE GET of its own slice on first load (2x /api/dashboard
    // on /, 2x /api/leads on /leads, ...). Deliberate: the one-store
    // architecture has no React-Query same-key dedupe, and the page
    // effect's copy doubles as the one-shot RETRY when hydrate's own
    // copy failed (slice-fetch failures are silent by reference
    // parity). Cost: one extra GET per page load — accepted.
    const session = sessionWriteToken;
    const res = await call<User | null>("/api/auth/me");
    if (session !== sessionWriteToken) return;
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
    // Session-64 (N-64j): bump BOTH tokens before the clear so every
    // in-flight fetch resolution (hydrate's nine + the page effects'
    // refetches) is skipped instead of re-populating the cleared
    // slices. The events token is bumped through its own s45 mechanism
    // — an in-flight fetchEvents fails its `token === eventsFetchToken`
    // check the same way a superseding call would.
    eventsFetchToken += 1;
    sessionWriteToken += 1;
    set({ user: null, users: [], accounts: [], contacts: [], leads: [], opportunities: [], activities: [], events: [], dashboard: null, settings: null });
  },

  fetchUsers: async () => {
    const session = sessionWriteToken;
    const res = await call<User[]>("/api/users");
    if (res.ok && session === sessionWriteToken) set({ users: res.data });
  },

  fetchAccounts: async () => {
    const session = sessionWriteToken;
    const res = await call<Account[]>("/api/accounts");
    if (res.ok && session === sessionWriteToken) set({ accounts: res.data });
  },

  fetchContacts: async () => {
    const session = sessionWriteToken;
    const res = await call<Contact[]>("/api/contacts");
    if (res.ok && session === sessionWriteToken) set({ contacts: res.data });
  },

  fetchLeads: async () => {
    const session = sessionWriteToken;
    const res = await call<Lead[]>("/api/leads");
    if (res.ok && session === sessionWriteToken) set({ leads: res.data });
  },

  fetchOpportunities: async () => {
    const session = sessionWriteToken;
    const res = await call<Opportunity[]>("/api/opportunities");
    if (res.ok && session === sessionWriteToken) set({ opportunities: res.data });
  },

  fetchActivities: async () => {
    const session = sessionWriteToken;
    const res = await call<Activity[]>("/api/activities");
    if (res.ok && session === sessionWriteToken) set({ activities: res.data });
  },

  fetchEvents: async (from, to) => {
    const token = ++eventsFetchToken;
    const qs = from || to ? `?${new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) })}` : "";
    const res = await call<CrmEvent[]>(`/api/events${qs}`);
    if (res.ok && token === eventsFetchToken) set({ events: res.data });
  },

  fetchSettings: async () => {
    const session = sessionWriteToken;
    const res = await call<Settings>("/api/settings");
    if (res.ok && session === sessionWriteToken) set({ settings: res.data });
  },

  fetchDashboard: async () => {
    const session = sessionWriteToken;
    const res = await call<DashboardData>("/api/dashboard");
    if (res.ok && session === sessionWriteToken) set({ dashboard: res.data });
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
    // the stale-race clobber. The set is TASK-SYNCHRONOUS with the onChange
    // (no await precedes it), so a logout continuation can never land
    // between the keystroke and the apply (the N-70c2 scoping note — the
    // s64 write-guard is unnecessary here, unlike updateSettings' POST-
    // AWAIT set). The refetches reconcile on success and roll the patch
    // back to server truth on a server-side failure; on a NETWORK-level
    // failure the refetch fails too and the patch stays until the next
    // refetch (the s47 toast surfaces the failure — N-70c10 re-scope).
    set({ leads: get().leads.map((l) => (l.id === id ? ({ ...l, ...input } as Lead) : l)) });
    const res = await call<Lead>(`/api/leads/${id}`, { method: "PUT", body: JSON.stringify(input) });
    // fetchLeads is UNCONDITIONAL — it is the optimistic patch's rollback
    // on failure and its reconcile on success; the dashboard KPIs only
    // change on a successful PUT (a failed one leaves server truth
    // unchanged — the N-70c10 needless-refetch retirement).
    await get().fetchLeads();
    if (res.ok) await get().fetchDashboard();
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
    // Session-70 (N-70c2): the POST-AWAIT set carries the s64 write-guard
    // (the fetcher pattern) — a logout landing between the PUT resolution
    // and this set would otherwise re-populate the cleared settings slice
    // (the s35 leakage class through a narrow window; self-healing on the
    // next hydrate, but a cross-user flash on a fast logout → login).
    const session = sessionWriteToken;
    const res = await call<Settings>("/api/settings", { method: "PUT", body: JSON.stringify(patch) });
    if (res.ok && session === sessionWriteToken) set({ settings: res.data });
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

// Session-58 (S58-P2, N-58a): the `export { call as apiCall };` alias
// RETIRED here — the only repo-wide `apiCall` reference was the export
// line itself (zero consumers, dead since the initial commit; the
// N-57b EXPORT-variant class). The aliased `call` stays alive
// internally — every store action feeds through it.

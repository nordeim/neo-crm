import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-45 pins (S45-P4): the calendar events last-call-wins token —
// the F-45e audit. fetchEvents (crm-store.ts) had no
// AbortController/token and was last-RESOLVED-wins: rapid calendar
// month flips could strand the stale month's slice in the store (Jan →
// Feb → Mar with Feb resolving last shows FEBRUARY's events under
// March's cursor). The fix at the store seam: a monotonically
// increasing module token; only the newest call's resolution may write
// the slice. Sequential flows are unaffected (the token only skips a
// write when a NEWER call exists — the hydrate → calendar-effect
// handoff resolves in the calendar's favor, the correct owner). The
// stale-response twin of the s45-P3 topbar controller.
//
// Session-64 pins (N-64j): the logout write-guard — the s45 token
// family's third seam. logout() clears every slice, but hydrate()'s
// nine parallel fetches (and the page effects' refetches) carried no
// generation token: a logout landing mid-fetch let the stale
// resolutions re-populate the cleared slices (the s35 leakage class
// via a narrow race window — self-healing on the next hydrate, but a
// cross-user flash on a fast logout → login). The fix mirrors the s45
// pattern at the logout boundary: a module-level session token every
// fetch captures at entry; logout bumps it (and the events token)
// before the clearing set, so every in-flight resolution is skipped.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const store = () => stripComments(read("src/stores/crm-store.ts") ?? "");

describe("session-45: fetchEvents writes only the newest call's slice (S45-P4)", () => {
  it("a module-level fetch token exists and increments per call", () => {
    const src = store();
    expect(src).toMatch(/let\s+eventsFetchToken(?::\s*number)?\s*=\s*0/);
    const at = src.indexOf("fetchEvents: async");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 400);
    expect(fn).toMatch(/\+\+eventsFetchToken/);
    expect(fn).toMatch(/const token = \+\+eventsFetchToken/);
  });

  it("the set is token-guarded (a stale resolution cannot overwrite the newer call's)", () => {
    const src = store();
    const at = src.indexOf("fetchEvents: async");
    const fn = src.slice(at, at + 400);
    expect(fn).toMatch(/if\s*\(res\.ok\s*&&\s*token === eventsFetchToken\)\s*set\(\{\s*events:\s*res\.data\s*\}\)/);
  });
});

describe("session-64: the logout write-guard (N-64j — stale fetch resolutions cannot re-populate a logged-out store)", () => {
  it("a module-level session write token exists alongside the s45 events token", () => {
    const src = store();
    expect(src).toMatch(/let\s+sessionWriteToken(?::\s*number)?\s*=\s*0/);
  });

  it("logout bumps BOTH tokens before the clearing set (every in-flight write is invalidated)", () => {
    const src = store();
    const at = src.indexOf("logout: async");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 700);
    expect(fn).toMatch(/eventsFetchToken \+= 1/);
    expect(fn).toMatch(/sessionWriteToken \+= 1/);
    const bump = fn.indexOf("eventsFetchToken += 1");
    const clear = fn.indexOf("set({ user: null");
    expect(clear).toBeGreaterThan(bump);
  });

  it("every slice fetch captures the session token and guards its set", () => {
    const src = store();
    for (const name of [
      "fetchUsers",
      "fetchAccounts",
      "fetchContacts",
      "fetchLeads",
      "fetchOpportunities",
      "fetchActivities",
      "fetchSettings",
      "fetchDashboard",
    ]) {
      const at = src.indexOf(`${name}: async`);
      expect(at, name).toBeGreaterThanOrEqual(0);
      const fn = src.slice(at, at + 400);
      expect(fn, name).toMatch(/const session = sessionWriteToken/);
      expect(fn, name).toMatch(/if\s*\(res\.ok\s*&&\s*session === sessionWriteToken\)\s*set\(/);
    }
  });

  it("hydrate dies entirely when a logout landed mid-auth (no user set, no slice fetches)", () => {
    const src = store();
    const at = src.indexOf("hydrate: async");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 600);
    expect(fn).toMatch(/const session = sessionWriteToken/);
    expect(fn).toMatch(/if\s*\(session !== sessionWriteToken\)\s*return/);
    const guard = fn.indexOf("if (session !== sessionWriteToken) return");
    const userSet = fn.indexOf("set({ user:");
    expect(userSet).toBeGreaterThan(guard);
  });

  it("fetchEvents keeps its s45 last-call-wins token byte-identical (the s64 change does not touch it)", () => {
    const src = store();
    const at = src.indexOf("fetchEvents: async");
    const fn = src.slice(at, at + 400);
    expect(fn).toMatch(/const token = \+\+eventsFetchToken/);
    expect(fn).toMatch(/if\s*\(res\.ok\s*&&\s*token === eventsFetchToken\)\s*set\(\{\s*events:\s*res\.data\s*\}\)/);
    // The session guard rides logout's bump of the events token, NOT a
    // second condition inside fetchEvents (the s45 body stays as shipped
    // and the window stays inside the function — fetchSettings follows).
    expect(fn).not.toMatch(/session === sessionWriteToken/);
  });
});

describe("session-70: the mutation-path write-guard + the updateLead refetch shape (N-70c2/c10)", () => {
  it("updateSettings guards its POST-AWAIT set with the session token (the fetcher pattern)", () => {
    // The 70-c rotation's find: the s64 write-guard covered hydrate's
    // nine fetches + the page-effect refetches, but updateSettings'
    // `if (res.ok) set({ settings: res.data })` is a POST-AWAIT direct
    // write — a logout landing between the PUT resolution and the set
    // re-populates the cleared settings slice (the s35 leakage class
    // through a narrow window; self-healing on the next hydrate). The
    // fix mirrors the fetcher pattern: capture at entry, guard the set.
    const src = store();
    const at = src.indexOf("updateSettings: async");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 400);
    expect(fn).toMatch(/const session = sessionWriteToken/);
    expect(fn).toMatch(/if\s*\(res\.ok\s*&&\s*session === sessionWriteToken\)\s*set\(/);
  });

  it("updateLead: fetchLeads unconditional (the rollback), fetchDashboard gated on res.ok", () => {
    // N-70c10: the failure path refetched the dashboard needlessly (a
    // failed PUT leaves the server truth unchanged) while fetchLeads
    // MUST stay unconditional — it is the optimistic patch's rollback
    // on server-side failures (and the reconcile on success).
    const src = store();
    const at = src.indexOf("updateLead: async");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 700);
    const leadsRefetch = fn.indexOf("get().fetchLeads()");
    const dashboardRefetch = fn.indexOf("get().fetchDashboard()");
    expect(leadsRefetch).toBeGreaterThan(fn.indexOf("await call"));
    expect(dashboardRefetch).toBeGreaterThan(leadsRefetch);
    // the dashboard refetch rides the success gate
    const gate = fn.lastIndexOf("res.ok", dashboardRefetch);
    expect(gate).toBeGreaterThan(-1);
    expect(gate).toBeGreaterThan(fn.indexOf("await call"));
  });
});

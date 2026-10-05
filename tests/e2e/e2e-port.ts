// Session-69 (N-69g): the single source for the e2e port. The "3100"
// default used to live TWICE — playwright.config.ts
// (Number(process.env.E2E_PORT ?? 3100)) and the crm.spec 401 probe
// (process.env.E2E_PORT ?? "3100") — so a default change in one place
// silently sent the probe at a dead port. Both consumers import this
// module now (the S68-P4 constant-wiring class: a future re-pin can no
// longer diverge the config from the probe).

/** The default e2e port — the ONLY place the literal lives. */
export const E2E_PORT_DEFAULT = "3100";

/** The env-resolved port, as a string (the probe's URL-concat form). */
export function e2ePort(): string {
  return process.env.E2E_PORT ?? E2E_PORT_DEFAULT;
}

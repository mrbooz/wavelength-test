// TMP-5 — north-star instrumentation (issue #32).
// One event, fired exactly once per occurrence, visible in the log.
// Dashboards stay simulated (and labeled) until real traffic exists.

const fired = new Set();

/**
 * Track an analytics event. `once` de-duplicates by key so a re-render or a
 * double click can't double-count an occurrence.
 */
export function track(event, props = {}, { once = null } = {}) {
  if (once !== null) {
    if (fired.has(once)) return false;
    fired.add(once);
  }
  // The "log" for now is the console — honest about what exists.
  console.log(`[analytics] ${event}`, { ...props, at: new Date().toISOString() });
  return true;
}

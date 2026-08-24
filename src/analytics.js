// TMP-5 — north-star instrumentation (issue #32).
// One event, fired exactly once per occurrence, visible in the log.
// Dashboards stay simulated (and labeled) until real traffic exists.

// The once-guard has to survive a reload, or "once per visitor per day"
// only holds until F5 (review catch on #33). localStorage is the visitor
// memory we actually have; the in-memory Set stays as a fallback for
// environments without storage (private mode quota, tests).
const fired = new Set();
const STORE_KEY = "firstspin.analytics.fired";

function alreadyFired(key) {
  if (fired.has(key)) return true;
  try {
    const stored = JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
    return stored.includes(key);
  } catch {
    return false;
  }
}

function rememberFired(key) {
  fired.add(key);
  try {
    const stored = JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
    if (!stored.includes(key)) {
      // Keep only the recent handful — this is a dedupe memory, not a log.
      localStorage.setItem(STORE_KEY, JSON.stringify([...stored, key].slice(-14)));
    }
  } catch {
    /* storage unavailable — the Set already covers this session */
  }
}

/**
 * Track an analytics event. `once` de-duplicates by key — across reloads —
 * so a re-render, a double click, or an F5 can't double-count an occurrence.
 */
export function track(event, props = {}, { once = null } = {}) {
  if (once !== null) {
    if (alreadyFired(once)) return false;
    rememberFired(once);
  }
  // The "log" for now is the console — honest about what exists.
  console.log(`[analytics] ${event}`, { ...props, at: new Date().toISOString() });
  return true;
}

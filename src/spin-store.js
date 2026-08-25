// Where "today's spin" actually lives — TMP-8.
//
// Before this, the screen forgot. You could spin, see your song, refresh, and
// be offered the same spin again as though the day hadn't happened; the only
// thing that remembered was the analytics dedupe guard, which is a counter,
// not a record. So the page showed something that wasn't true.
//
// One record per day, keyed by the day. Storage that isn't there (private
// mode, quota) degrades to "no spin recorded yet" rather than throwing — a
// visitor with storage off gets a working product with a shorter memory.

const KEY = "firstspin.spin";

/** The spin recorded for `dayKey`, or null. Never throws. */
export function readSpin(dayKey) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const spin = JSON.parse(raw);
    return spin && spin.dayKey === dayKey ? spin : null;
  } catch {
    return null;
  }
}

/** Record today's spin. Returns the record so the caller renders what was stored,
 *  not what it hoped was stored. Never throws. */
export function recordSpin({ title, artist, dayKey }) {
  const spin = { title, artist, dayKey, at: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(spin));
  } catch {
    /* storage unavailable — the record lives for this page only */
  }
  return spin;
}

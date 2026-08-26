/** The repo's one local-day rule, shared.
 *
 *  toISOString() is UTC, so anything keyed on it rolls over at UTC midnight —
 *  5pm in California, 1am in Rotterdam. Both halves of this repo learned the
 *  same lesson separately (the morning card in songs.js, the shift split in
 *  rules/attribution.js): a day belongs to the person living through it, so
 *  the calendar day is always the LOCAL one. One implementation, imported by
 *  both, so the two rules can never drift apart.
 */
export function dayKeyFor(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

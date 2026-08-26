// VEL-6121: a shift that crosses midnight is divided at midnight.
//
// A night shift is one shift to the person working it and two days to
// everybody who has to pay for it. This module answers only the first
// question the engine gets asked: which day owns which hours. What those
// hours are worth (premiums, contracts, the Aldervale 21:30 clause) is
// premium's business and deliberately absent here.

/** Format a Date's LOCAL calendar day as "YYYY-MM-DD" — the same local-day
 *  rule the rest of this repo settled on in songs.js (a shift belongs to the
 *  day the person lived through, not the day in Greenwich). */
function dayKeyOf(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Midnight after the given instant, in local time. */
function nextMidnight(date) {
  const m = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  m.setDate(m.getDate() + 1);
  return m;
}

/**
 * Divide a shift's hours among the calendar days it touches.
 *
 * @param {{start: Date, end: Date}} shift - end must be after start.
 * @returns {Array<{dayKey: string, from: Date, to: Date, hours: number}>}
 *   One segment per calendar day, in order. Hours are exact (minutes as
 *   fractions), and the segments always sum to the shift's full length —
 *   the header total equals the sum of the day columns by construction.
 */
export function attributeShift(shift) {
  const { start, end } = shift;
  if (!(start instanceof Date) || !(end instanceof Date) || end <= start) {
    throw new Error("attributeShift: shift needs a start before its end");
  }
  const segments = [];
  let cursor = start;
  while (cursor < end) {
    const boundary = nextMidnight(cursor);
    const to = boundary < end ? boundary : end;
    segments.push({
      dayKey: dayKeyOf(cursor),
      from: cursor,
      to,
      hours: (to - cursor) / 36e5,
    });
    cursor = to;
  }
  return segments;
}

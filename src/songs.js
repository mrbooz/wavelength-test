// A tiny seed catalogue so the daily spin has something to land on.
// Real catalogue integration is someone else's ticket.
export const SONGS = [
  { title: "Pink Pony Club", artist: "Chappell Roan" },
  { title: "Nightcall", artist: "Kavinsky" },
  { title: "Dreams", artist: "Fleetwood Mac" },
  { title: "Redbone", artist: "Childish Gambino" },
  { title: "Kilby Girl", artist: "The Backseat Lovers" },
  { title: "Myth", artist: "Beach House" },
  { title: "Tek It", artist: "Cafuné" },
];

/** The day key for a date, in the READER'S calendar rather than UTC.
 *
 *  toISOString() is UTC, so "today's song" rolled over at UTC midnight —
 *  5pm in California. On a product whose whole shape is a MORNING card,
 *  the song changed in the middle of the reader's afternoon and the card
 *  then named a day they were not in yet. Local date, local day. */
export { dayKeyFor } from "./local-day.js";
import { dayKeyFor } from "./local-day.js";

// Deterministic pick: same calendar day -> same song for everyone in that day.
export function songForToday(date = new Date()) {
  const dayKey = dayKeyFor(date);
  let h = 0;
  for (const c of dayKey) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { ...SONGS[h % SONGS.length], dayKey };
}

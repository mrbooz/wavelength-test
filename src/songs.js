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

// Deterministic pick: same calendar day -> same song for everyone.
export function songForToday(date = new Date()) {
  const dayKey = date.toISOString().slice(0, 10);
  let h = 0;
  for (const c of dayKey) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { ...SONGS[h % SONGS.length], dayKey };
}

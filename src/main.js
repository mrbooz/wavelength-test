import "./style.css";
import "./tokens.css";
import { createMorningCard } from "./morning-card.js";
import { PRODUCT_NAME, PITCH } from "./config.js";
import { songForToday } from "./songs.js";
import { track } from "./analytics.js";
import { readSpin, recordSpin } from "./spin-store.js";
import { loadingCard, errorCard, emptyCard } from "./card-states.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <section class="hello">
    <p class="kicker">Today's spin</p>
    <h1>${PRODUCT_NAME}</h1>
    <p class="pitch">${PITCH}</p>
    <button id="spin" class="spin">Play today's spin</button>
    <div id="reveal" class="reveal" hidden></div>
  </section>
`;

const spinBtn = document.querySelector("#spin");
const reveal = document.querySelector("#reveal");

/** Draw the card for a spin that exists. Rendering only — see the note on
 *  `track` below for why restoring is not the same as completing. */
/** Draw the card for a spin that exists — and RETIRE the button on purpose.
 *  One spin per day is the product: after a successful reveal the button
 *  reads "That's your spin for today" and stays disabled until refresh()
 *  re-arms it on the next local day (visibilitychange/focus). A reviewer
 *  read the permanent disable as a leak once, so it is now stated: this is
 *  the designed end state of a spun day, not a forgotten re-enable. */
function showSpin(spin) {
  reveal.replaceChildren(
    createMorningCard({
      title: spin.title,
      artist: spin.artist,
      kicker: "Your song today",
      footnote: formatDay(spin.dayKey),
    }),
  );
  reveal.hidden = false;
  spinBtn.textContent = "That's your spin for today";
  spinBtn.disabled = true;
}

/** The card states the day it is showing, so "same song for everyone today"
 *  is a claim the reader can check rather than take on trust. */
function formatDay(dayKey) {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// TMP-8: what the screen shows is what actually happened. If today's spin is
// already on record, restore it instead of offering it again — the old page
// forgot on every reload and invited the visitor to "spin" a day they had
// already spun.
//
// NO EVENT ON RESTORE, deliberately. `core_action_completed` marks a person
// finishing the action, and re-opening a tab is not finishing anything. The
// analytics once-guard would swallow the duplicate anyway, but relying on a
// dedupe to keep a number honest is how the number stops meaning what its
// name says (Ben's device-day-not-human-day caveat, sprint review 1).
/** Restore whatever is on record for the CURRENT day, or offer a spin.
 *
 * Recomputed rather than captured: a tab left open across midnight used to
 * keep yesterday's card on screen with the button still disabled, so the
 * reader was locked out of a day they had not spun. Re-checked whenever the
 * tab comes back to the front, which is exactly when someone returns to a
 * page they left open overnight. */
function refresh() {
  const recorded = readSpin(songForToday().dayKey);
  if (recorded) {
    showSpin(recorded);
    return;
  }
  // TMP-9: first-run is a drawn state, not an absence. A visitor with no spin
  // today sees the empty card — the one state allowed to sell the product —
  // instead of a bare button over blank space.
  reveal.replaceChildren(emptyCard());
  reveal.hidden = false;
  spinBtn.disabled = false;
  spinBtn.textContent = "Play today's spin";
}

refresh();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refresh();
});
window.addEventListener("focus", refresh);

/** The spin, as an async road — TMP-9 makes the wait and the failure real
 *  states instead of assumptions. The catalogue is local today so `load`
 *  resolves fast, which is exactly the case the 300ms skeleton delay exists
 *  for: a fast load never shows a skeleton at all. */
async function spin() {
  spinBtn.disabled = true;
  spinBtn.textContent = "Spinning…";
  reveal.replaceChildren(loadingCard());
  reveal.hidden = false;
  try {
    const song = await loadTodaysSong();

    // Render the result FIRST — the event fires when the result is on screen,
    // not on page load and not on the click itself (TMP-5). What is rendered
    // is what was stored, so the screen and the record cannot drift apart.
    showSpin(recordSpin(song));

    // Exactly once per occurrence: one reveal per day per visitor. Loading,
    // error and empty fire NOTHING — the metric counts finished spins only
    // (result-state contract, flagged to Nadia at the pivot).
    track("core_action_completed", { song: song.title, day: song.dayKey }, { once: `reveal:${song.dayKey}` });
  } catch (err) {
    // The failure is kept, not discarded — the console is the app's log
    // today (TMP-5's honest-log rule), and an error state you cannot
    // diagnose is a dead end with better typography.
    console.error("[spin] load failed", err);
    // The label is set here, not assumed: before this, "Play today's spin"
    // was an invariant of the path taken rather than a fact of the state,
    // and any new caller could have broken it silently. Each state now
    // writes its own label.
    reveal.replaceChildren(errorCard(() => void spin()));
    spinBtn.disabled = false;
    spinBtn.textContent = "Play today's spin";
  }
}

/** Local catalogue behind an async seam, so TMP-8's "what it shows is true"
 *  and a future real backend share one call site. `?fail=1` forces the error
 *  road — the only honest way to demo a state the local catalogue can never
 *  reach on its own. */
function loadTodaysSong() {
  return new Promise((resolve, reject) => {
    if (new URLSearchParams(location.search).has("fail")) {
      setTimeout(() => reject(new Error("forced by ?fail=1")), 700);
      return;
    }
    resolve(songForToday());
  });
}

spinBtn.addEventListener("click", () => void spin());

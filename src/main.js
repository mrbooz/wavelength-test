import "./style.css";
import "./tokens.css";
import { createMorningCard } from "./morning-card.js";
import { PRODUCT_NAME, PITCH } from "./config.js";
import { songForToday } from "./songs.js";
import { track } from "./analytics.js";
import { readSpin, recordSpin } from "./spin-store.js";

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
  reveal.hidden = true;
  reveal.replaceChildren();
  spinBtn.disabled = false;
  spinBtn.textContent = "Play today's spin";
}

refresh();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refresh();
});
window.addEventListener("focus", refresh);

spinBtn.addEventListener("click", () => {
  const song = songForToday();

  // Render the result FIRST — the event fires when the result is on screen,
  // not on page load and not on the click itself (acceptance criteria, TMP-5).
  // What is rendered is what was stored, so the screen and the record cannot
  // drift apart.
  showSpin(recordSpin(song));

  // Exactly once per occurrence: one reveal per day per visitor.
  track("core_action_completed", { song: song.title, day: song.dayKey }, { once: `reveal:${song.dayKey}` });
});

import "./style.css";
import { PRODUCT_NAME, PITCH } from "./config.js";
import { songForToday } from "./songs.js";
import { track } from "./analytics.js";

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

spinBtn.addEventListener("click", () => {
  const song = songForToday();

  // Render the result FIRST — the event fires when the result is on screen,
  // not on page load and not on the click itself (acceptance criteria, TMP-5).
  reveal.innerHTML = `
    <p class="kicker">Your song today</p>
    <p class="song-title">${song.title}</p>
    <p class="song-artist">${song.artist}</p>
  `;
  reveal.hidden = false;
  spinBtn.textContent = "That's your spin for today";
  spinBtn.disabled = true;

  // Exactly once per occurrence: one reveal per day per visitor.
  track("core_action_completed", { song: song.title, day: song.dayKey }, { once: `reveal:${song.dayKey}` });
});

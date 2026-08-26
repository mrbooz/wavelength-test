import "./card-states.css";

/**
 * TMP-9 — the states the morning card shows when it has no song to show.
 * One module owns all three, so "no route into a blank or dead screen"
 * is checkable in one place. Each returns an element shaped like the card
 * (same class, same grid) so the surface never jumps between states.
 */

function shell(stateName) {
  const card = document.createElement("article");
  card.className = `morning-card card-state--${stateName}`;
  return card;
}

/** Skeleton shapes where the words will be. Invisible for the first 300ms —
 *  a fast load never flashes a skeleton (planning risk: loading and empty
 *  looked identical for the first beat; now loading shows NOTHING first). */
export function loadingCard() {
  const card = shell("loading");
  for (const kind of ["kicker", "title", "artist"]) {
    const s = document.createElement("div");
    s.className = `skel skel--${kind}`;
    card.appendChild(s);
  }
  return card;
}

/** Plain words, one retry, no dead ends. */
export function errorCard(onRetry) {
  const card = shell("error");
  const words = document.createElement("p");
  words.className = "state-words";
  words.textContent = "Today's song didn't load.";
  const quiet = document.createElement("p");
  quiet.className = "state-quiet";
  quiet.textContent = "It's us, not you. The song is still there.";
  const retry = document.createElement("button");
  retry.className = "retry";
  retry.textContent = "Try again";
  retry.addEventListener("click", onRetry);
  card.append(words, quiet, retry);
  return card;
}

/** First-run: zero data, and the one state allowed to sell the product. */
export function emptyCard() {
  const card = shell("empty");
  const kicker = document.createElement("p");
  kicker.className = "state-kicker";
  kicker.textContent = "First Spin";
  const words = document.createElement("p");
  words.className = "state-words";
  words.textContent = "One song a day, chosen for you.";
  const quiet = document.createElement("p");
  quiet.className = "state-quiet";
  quiet.textContent = "Press play. That's the whole app.";
  card.append(kicker, words, quiet);
  return card;
}

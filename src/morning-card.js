import "./morning-card.css";

/**
 * The one-song morning card — TMP-7.
 *
 * SCOPE, deliberately narrow: this builds the POPULATED card and nothing else.
 * Where the song comes from is TMP-8; loading, error and the first-run empty
 * state are TMP-9. Passing no song is therefore a programming error here, not
 * a state to render — TMP-9 owns that screen and will own it in one place.
 *
 * Returns an element rather than a string so the caller decides where it goes
 * and nothing has to trust innerHTML with a song title someone else typed.
 */
export function createMorningCard({ title, artist, footer = "Today's spin" }) {
  if (!title || !artist) {
    throw new Error("createMorningCard: title and artist are required (empty state is TMP-9)");
  }

  const card = document.createElement("article");
  card.className = "morning-card";

  const kicker = document.createElement("p");
  kicker.className = "morning-card__kicker";
  kicker.textContent = footer;

  const heading = document.createElement("h1");
  heading.className = "morning-card__title";
  heading.textContent = title;

  const by = document.createElement("p");
  by.className = "morning-card__artist";
  by.textContent = artist;

  const foot = document.createElement("p");
  foot.className = "morning-card__footer";
  foot.textContent = "One song. Every morning.";

  card.append(kicker, heading, by, foot);
  return card;
}

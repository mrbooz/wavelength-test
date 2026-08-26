# HANDOFF.md — First Spin, squad Foxtrot

For whoever sits here next.

## Where things live

- The board keeps the tickets. The wiki keeps the docs.
- The review bar keeps the standard — it does not lower for deadlines; ask
  the record. The written version is [REVIEWS.md](REVIEWS.md).

## What waits

- The fast-follow list from launch triage — triaged, in writing, none of it
  secret: slow first load, and the tab icon (through normal review, no
  "tiny" labels; that word is banned from descriptions for a reason).

## The thing I know that you don't yet

The hello shell in `index.html` mirrors the markup `main.js` renders — on
purpose, so the first paint isn't a blank page while the bundle loads. If
you change one, change the other, or the first frame a stranger sees will
lie. And when a review feels wrong, diff it against the code before you
argue: twice this year the review was mistaken, and a trace settled it
politely both times.

— Tyler, Day 20

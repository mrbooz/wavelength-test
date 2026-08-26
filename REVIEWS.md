# Reviews: same-day, or a same-day reason

Retro #1 action (TMP-6). This is the rule we already live by on good days,
written down so it holds on the bad ones.

## The rule

- A review lands **the same working day** the PR asks for it.
- If it can't, the reviewer posts **a reason in the PR thread the same day**
  ("deep in the incident, tomorrow morning" counts; silence doesn't).
- "Same day" follows the reviewer's working hours, not the clock of whoever
  opened the PR.

## What the PR owes the reviewer

A review that can land same-day is one that can be picked up cold:

- **What** changed, in one or two sentences.
- **Why** — the ticket, and the reason behind it if the ticket doesn't say.
- **How to verify** — the steps you ran, so the reviewer re-runs them instead
  of guessing. (Standard since PR #41.)

## Re-requesting

- After changes, re-request explicitly — a push alone is not a request.
- A thin description doesn't pause the clock: the reviewer still answers
  same-day, but "can't review this cold — needs what/why/verify" is a valid
  same-day answer. Fixing the description and re-requesting opens a fresh
  clock, like any other re-request.
- A re-request opens a fresh same-day clock.
- Don't ask for a stamp "because it's tiny." Tiny is a label, not a size;
  if it touches anything shared, it gets the same review as everything else.

## Why this is written down

A bar that only holds when nobody's stressed isn't a bar. The reason-in-thread
rule keeps the record honest: either the review is there, or the reason is —
the thread never just goes quiet.

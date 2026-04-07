# Discover Ontology And Post Grammar Lock

Date: 2026-04-06
Owner: Codex

## Summary
- Updated `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md` to stop Discover ontology and activity-surface behavior from living only in chat memory.
- Added an explicit `sources` vs `signals` split so followable origin objects do not get conflated with the artifacts they produce or carry.
- Locked recommendations as explicit user-to-signal relationships with one active recommendation per user, rendered through the fixed avatar + balloon grammar.
- Locked support as a lightweight post-level counter/reaction rather than a separate authored post type.
- Replaced stale `High Activity / Recommendations` wording with the actual Discover structure:
  - `Popular Signals` = high-engagement signal objects in scope
  - `Recommendations Row / Carousel` = users + their active recommendations using the same avatar/balloon grammar
  - promos/events = conditional Discover content only when scope/visit context makes them relevant

## Key Locked Rules
- Sources: artists, communities, businesses, promoters, events; future sources include ambassadors, venues, mixologists.
- Signals: singles, Uprises, promos, flyers; future signals include mixes.
- Recommendation text is fixed: `Check out "signal"`.
- Selecting `Recommend` replaces the user’s prior active recommendation.
- Feed, profile, and Discover all reuse the same canonical signal-action post grammar instead of inventing parallel systems.
- Flyers remain externally authored promoter assets; UPRISE owns framing/context/click behavior only.
- Print Shop remains the future internal artist-authored artifact lane.

## Verification
- `pnpm run docs:lint`

## Follow-up
- Reconcile any remaining Discover prompt packs or implementation notes that still treat recommendations as a freeform text system or still use `High Activity` / activity-score wording for the recommendation rail.

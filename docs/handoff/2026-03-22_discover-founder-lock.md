# Discover Founder Lock Handoff (2026-03-22)

## Purpose
Convert founder-confirmed Discover decisions from the 2026-03-22 walkthrough into a durable repo document so future UX and implementation work does not depend on session memory.

## Added
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`

## What The New Lock Covers
- Discover purpose and structure
- Uprise travel search vs local artist/song search
- map/dropdown behavior
- Recommendations / Trending / Top Artists ordering and behavior
- retune vs explicit community entry
- visitor-mode restrictions for visited communities
- native link-resolution rules at the Discover boundary
- Home Scene / saved-Uprise carry-forward assumptions used by Discover

## Important Boundary
This doc intentionally stops at the artist-page handoff boundary. Artist-page internal composition was treated as a separate documentation hole and not redefined here.

## Reconciliation Note
`docs/specs/communities/discovery-scene-switching.md` still contains narrower legacy/current-spec assumptions that should be intentionally reconciled later. The new founder lock is meant to control upcoming review and implementation work until that reconciliation happens.

## Deferral Decision
- Discover should ultimately be updated back into canon/spec whether or not every part is implemented immediately.
- That broader canon/spec rewrite is intentionally deferred to V2 so current clarification work is not forced into partial mid-stream canon edits.
- Until then, `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md` is the controlling Discover authority for founder-confirmed behavior captured in this walkthrough.

## Verification
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed

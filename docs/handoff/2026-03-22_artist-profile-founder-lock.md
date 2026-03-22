# Artist Profile Founder Lock Handoff (2026-03-22)

## Purpose
Convert the artist-page founder confirmations from the 2026-03-22 walkthrough into a durable repo document so implementation can stop guessing at core artist-surface behavior.

## Added
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

## What The New Lock Covers
- familiar profile-page structure requirement
- core artist-page actions (`Follow`, `Add`, `Blast`, `Support`)
- playback behavior when entering from artist links
- playback behavior when entering from single/signal links

## Important Boundary
This lock does not yet finalize every artist-page section detail. It is the first stable founder lock for the surface, built on top of the separate artist-profile documentation audit.

## Verification
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed

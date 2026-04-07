# Surface Contracts R1

**Date:** 2026-04-05
**Owner:** Codex

## What changed
- Added `docs/solutions/SURFACE_CONTRACT_HOME_R1.md`.
- Added `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md`.
- Added `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md`.
- Added `docs/solutions/SURFACE_CONTRACT_COMMUNITY_R1.md`.
- Clarified active spec/prompt docs so `Home` remains the left nav destination and `Plot` is read as the sectional system inside Home rather than as a peer route.
- Indexed the new contracts in `docs/solutions/README.md`.
- Recorded the rollout in `docs/CHANGELOG.md`.

## Why
The AutoHarness doctrine needed compact per-surface contracts so external models stop reinterpreting the product structure. The main correction locked here is that `Home` is the left bottom-nav destination and `Plot` lives inside `Home` as the tabbed sectional system, rather than acting as a peer surface.

## Key points
- Home and Discover are shell peers.
- Plot is structural inside Home.
- Discover remains player-anchored and right-nav scoped.
- Community remains an explicit destination entered through links/visit flows rather than a bottom-nav peer.

## Verification
- `pnpm run docs:lint`

## Follow-ups
- Reconcile any older docs that still treat Plot as a peer to Home.
- Promote the surface-contract set into the AutoHarness review flow and future Codex skill.

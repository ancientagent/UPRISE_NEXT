# 2026-04-15 — Cross-Device Listening Presence Note

## Summary
Captured a future-facing product/system note for cross-device listening presence between the website and app shells.

## Product Direction
If a user is listening through the website, the app can surface the current artist/source profile as an expanded discovery experience instead of forcing the user to re-find that context manually.

## Recommended MVP Shape
Keep the first version passive and read-only:
- website emits a lightweight `now listening` presence/state update
- app, when the same user is active there, can surface:
  - `Listening on web`
  - current artist/source profile card
  - optional tap-through into expanded source/profile detail
- do **not** start with remote-control playback sync
- do **not** start with automatic hard navigation or device takeover

## Likely Existing Building Blocks In Repo
- shared user identity across website/app surfaces
- artist/source linkage on tracks and profiles
- socket infrastructure already present in repo
- current-player / now-playing state already exists in website runtime somewhere

This suggests the feature is likely more wiring/projection work than a net-new invention.

## System Model
This fits standard backend categories rather than requiring a novel subsystem:
- presence
- now-playing session state
- activity stream / listening event
- latest-state projection

## Likely Storage / Runtime Options
Ordered by likely MVP fit:
1. socket-layer presence plus lightweight persistence/projection
2. Postgres-backed latest listening-session state
3. Redis-backed ephemeral presence if low-latency/high-churn cross-device state becomes more important later

## Current Recommendation
Do not implement immediately as part of the current action-matrix reconciliation branch.

When revisited, treat it as a dedicated slice with explicit answers for:
- whether `Discover` is app-shell only or cross-shell
- user/session linking rules
- presence expiry / heartbeat behavior
- privacy/intent rules for cross-device mirroring
- whether the app shows a passive prompt/card or auto-opens the source profile

## Why This Matters
This can deepen discovery without forcing recommendation-engine behavior:
- the website remains the listening surface
- the app becomes the richer contextual discovery surface
- artist/source exploration stays user-initiated and stateful rather than algorithmic

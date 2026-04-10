# 2026-04-10 — RaDIYo Playback Minimal Runtime

## Summary
- wired real RaDIYo playback into the existing Plot and Discover player shells using browser-native audio
- kept the MVP media path simple: existing track `fileUrl` values, API-driven rotation selection, no new streaming/transcoding stack
- made active broadcast rotation tier-aware on the API so `city` and `state` player scopes resolve different scene rotations from the same user context

## What Landed
- API
  - `GET /broadcast/rotation?tier=city|state|national` now resolves the correct active scene for the requested tier
  - `national` currently clamps through the same state-resolution path used elsewhere in the MVP surface
  - rotation responses now include scene metadata in `meta` for the resolved broadcast context
- Web
  - added `apps/web/src/lib/broadcast/client.ts`
  - Plot now fetches active broadcast rotation when the player is in `RADIYO` mode and a tier is live
  - Discover now fetches active broadcast rotation for the current Discover tier
  - `RadiyoPlayerPanel` now renders a native `<audio>` element against the current track `fileUrl`
  - pool switching (`New` / `Current`) now swaps the actual playable queue, not just shell copy

## Scope Boundaries Kept
- no new upload pipeline
- no transcoder/runtime media architecture changes
- no playlist/queue transport redesign
- no collection-mode playback expansion
- no explicit play/pause button redesign; the existing tier/pool shell remains the control surface

## Verification
- `pnpm --filter api test -- fair-play.rotation`
- `pnpm --filter web test -- broadcast-client plot-ux-regression-lock`
- `pnpm run typecheck`

## Follow-up
- playback currently starts from the first track in the selected pool; no auto-advance or queue memory yet
- Plot player still follows active user broadcast context, not arbitrary stats-panel community selection
- if the founder wants richer transport behavior later, add it as a separate slice after core playback is stable

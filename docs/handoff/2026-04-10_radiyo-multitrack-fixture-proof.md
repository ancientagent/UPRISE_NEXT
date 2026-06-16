# 2026-04-10 — RaDIYo Multi-Track Fixture Proof

## Summary
- Expanded the local RaDIYo QA fixture from a single city-tier tone into deterministic multi-track city and state rotations.
- Verified live browser playback progression against those seeded queues in the Chrome DevTools MCP browser.

## What Changed
- Reworked `apps/api/scripts/seed-radiyo-dev-fixture.mjs` so it now:
  - generates four browser-served WAV fixtures under `apps/web/public/dev-audio/`
  - ensures a matching active state scene exists for the seeded city scene
  - seeds two `NEW_RELEASES` and two `MAIN_ROTATION` tracks for both city and state scope
  - prunes stale QA fixture rotation entries so queue order stays deterministic
- The seeded QA catalog now uses:
  - artist: `UPRISE QA`
  - album: `Dev Fixtures`

## Seeded Playback Shapes
- City scene:
  - `QA Austin New 1`
  - `QA Austin New 2`
  - `QA Austin Current 1`
  - `QA Austin Current 2`
- State scene:
  - `QA Texas New 1`
  - `QA Texas New 2`
  - `QA Texas Current 1`
  - `QA Texas Current 2`

## Local Command
Run from `apps/api` when you need the deterministic playback fixture again:

```bash
pnpm run seed:radiyo-fixture
```

## Live Browser QA
Verified in the existing Chrome DevTools MCP browser against the local app:

- `/discover` city tier:
  - current rotation rendered `QA Austin Current 1`
  - after the 2-second tone ended, the title advanced to `QA Austin Current 2`
  - this proves in-browser auto-advance on the seeded city queue
- `/discover` state tier:
  - current rotation rendered `QA Texas Current 1`
  - network requests then advanced from the first state-track WAV to the second state-track WAV
  - this proves the state queue is also progressing instead of pinning to track one

## Why This Matters
- The original playback proof only showed that a single seeded audio asset could play.
- This pass proves the minimal queue runtime actually advances across a real multi-track rotation shape for both active MVP tiers.

## Remaining Boundary
- The fixture is deterministic QA scaffolding, not production music ingest.
- Queue progression is still minimal:
  - move to the next queued track on native audio `ended`
  - no richer queue memory, history, or transport redesign yet

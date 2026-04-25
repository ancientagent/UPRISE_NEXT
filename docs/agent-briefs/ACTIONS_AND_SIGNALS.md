# Actions And Signals Agent Brief

Status: active
Last Updated: 2026-04-25

## Use When
Use this brief when the task is about:
- listener actions
- signal/action boundaries
- engagement wheel behavior
- `Collect`, `Blast`, `Recommend`, `Play It Loud`, `Upvote`
- feed insert action rules
- artist-profile action rules
- event/action grammar
- stale `Add` / `Support` wording

## Do Not Use For
- pure visual layout work unless actions are visible
- backend-only source-dashboard ownership work
- event calendar layout without action grammar changes
- deployment/infrastructure work

## Loading Rule
Start with the normal repo entry rules, then this brief.

Do not read every linked document by default. Load the exact runtime files and one controlling lock for the action being changed.

## Section Pointers
Runtime files:
- `apps/api/src/signals/signals.controller.ts`
- `apps/api/src/signals/signals.service.ts`
- `apps/api/src/signals/dto/signal.dto.ts`
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
- `apps/web/src/app/artist-bands/[id]/page.tsx`

Specs / locks:
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/events/events-and-flyers.md`

Tests / verification files:
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- signal/API tests in the touched package, when present

## Current Truth
- `MVP_ACTION_SYSTEM_MATRIX_R1` is the controlling action grammar lock.
- `Collect` applies to signals/artifacts where allowed.
- `Recommend` requires the listener to genuinely hold the thing first.
- `Add` is reserved for event calendar behavior.
- `Support` is derived backing/activity state, not a direct public button.
- `Back` is Registrar-only procedural behavior.
- `Play It Loud` belongs to the `RADIYO` wheel.
- `Upvote` remains the `RADIYO` propagation action.
- `Blast` belongs to held music-distribution signals in the personal player / user space.
- `Blast` does not belong on Artist Profile.
- `Blast` does not belong on feed insert cards.
- Artist Profile uses local song-row controls, not the engagement wheel.
- Feed inserts are read-only launch surfaces with no inline `Collect`, `Blast`, `Follow`, or wheel actions.
- Events are objects, not sources; event action is `Add` to calendar.
- Flyers are event-bound artifacts, not default music-distribution signals.

## Current Runtime Pointers
- `/signals/:id/collect` is the public collect alias; legacy add compatibility may still exist in runtime.
- `/signals/:id/blast` may exist in API/runtime, but current UI placement must follow the personal-player / user-space boundary.
- `/plot` currently carries the visible `RADIYO` and `SPACE` action split.
- Artist Profile currently owns direct-listen `Collect` / gated `Recommend` behavior.

## Design / Implementation Boundaries
- Do not put `Blast` back on the `RADIYO` wheel.
- Do not place the engagement wheel on Artist Profile.
- Do not add direct `Support` buttons.
- Do not use `Add` for saving songs in user-facing UI.
- Do not put inline action buttons on feed insert cards.
- Do not make event pages blast targets.
- Do not let older source/feed docs outrank the action matrix when they conflict.

## Verification
Use the narrowest relevant checks:
- `pnpm --filter web test -- plot-ux-regression-lock.test.ts`
- package-specific API tests for signal/controller/service changes
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`

## Update Rule
Patch this brief whenever action grammar or signal placement changes. Do not leave action corrections in chat memory only.

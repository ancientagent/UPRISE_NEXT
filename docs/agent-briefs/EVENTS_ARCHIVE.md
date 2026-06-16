# Events And Archive Agent Brief

Status: active
Last Updated: 2026-04-25

## Use When
Use this brief when the task is about:
- Plot `Events`
- Plot `Archive`
- event cards/details/calendar behavior
- event-bound flyers/artifacts
- descriptive stats/history surfaces
- Scene Map / archive-style community records
- stale `Statistics` or `Promotions` tab language

## Do Not Use For
- action grammar outside event/archive surfaces
- Artist Profile or Source Dashboard work unless events are being surfaced there
- Home/player/profile interaction unless it changes Events or Archive placement
- deployment/infrastructure work

## Loading Rule
Start with the normal repo entry rules, then this brief.

Do not read every linked document by default. For Events work, load the event spec and touched Events files. For Archive work, load the current UI brief plus the stats/archive lock that authorizes the behavior.

## Section Pointers
Runtime files:
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/components/plot/PlotEventsPanel.tsx`
- `apps/web/src/components/plot/StatisticsPanel.tsx`
- `apps/web/src/components/plot/statistics-request.ts`
- `apps/api/src/events/`
- `apps/api/src/communities/`

Specs / locks:
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/solutions/MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1.md`
- `docs/solutions/MVP_SCREEN_AND_SURFACE_MAP_R1.md`
- `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/specs/communities/plot-and-scene-plot.md`

Tests / verification files:
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `apps/web/__tests__/plot-statistics-request.test.ts`
- `apps/web/__tests__/communities-client.test.ts`

## Current Truth
- Current MVP Plot tabs are `Feed`, `Events`, and `Archive`.
- `Archive` is the current user-facing label for the descriptive stats/history lane.
- Do not call the active current tab `Statistics`.
- There is no current MVP `Promotions` tab.
- Older docs may still describe `Feed`, `Events`, `Promotions`, and `Statistics`; treat that as stale unless a current lock explicitly reactivates it.
- Events are scene-bound scheduled objects.
- Event action grammar is `Add` to calendar.
- Events are not sources.
- Event pages are not blast targets.
- Event creation is source-facing through Print Shop.
- Listeners discover, add/calendar, attend, and collect verified event artifacts where supported.
- Flyers are event-bound artifacts, not default current MVP signals.
- Archive/stats are descriptive only.
- Archive must not become ranking, predictive analytics, leaderboards, or comparative artist scoring.

## Current Runtime Pointers
- `/plot` currently routes the third MVP tab to the existing statistics/archive panel implementation.
- Runtime component names may still contain `StatisticsPanel`; current user-facing language should be `Archive`.
- Events read through scene-scoped community event endpoints.
- Print Shop owns current source-facing event creation flow.

## Design / Implementation Boundaries
- Do not reintroduce `Statistics` as the active tab label.
- Do not reintroduce `Promotions` as a current MVP Plot tab.
- Do not make Archive a leaderboard.
- Do not add ranking, trending hype, predictive success metrics, or comparative artist scores.
- Do not make event pages blast targets.
- Do not make following a source automatically add all its events to calendar.
- Do not move event creation into listener-facing Plot Events.
- Do not let flyer artifacts affect Fair Play rotation or tier progression.

## Verification
Use the narrowest relevant checks:
- `pnpm --filter web test -- plot-ux-regression-lock.test.ts`
- `pnpm --filter web test -- plot-statistics-request.test.ts`
- `pnpm --filter web test -- communities-client.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`

Use broader `pnpm run verify` before PR/closeout when feasible.

## Update Rule
Patch this brief whenever Events, Archive, descriptive stats, Scene Map, or event artifact truth changes.

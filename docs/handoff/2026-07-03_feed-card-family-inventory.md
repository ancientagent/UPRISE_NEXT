# 2026-07-03 Feed Card Family Inventory

Status: complete
Branch: `docs/feed-card-family-inventory`
Scope: UPRISE Development Plan R1 / Task 9

## Summary

Completed a docs/test inventory pass for the current `/plot` Feed card families. No runtime behavior was added.

Created `docs/solutions/FEED_CARD_FAMILY_INVENTORY_R1.md` to classify current Feed/runtime candidates as launch-scope, source-facing, beta/deferred, or remove/quarantine. Added one targeted regression lock so Feed inserts reject inline calendar mutation strings in the same way they already reject inline engagement controls.

## Authority Checked

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/events/events-and-flyers.md`

## Read-Only Lane Checks

Codex read-only subagents checked three independent lanes before synthesis:

- `UX_UI`: confirmed active Feed row families, inserts, source links, deferred panels, and missing playback-coupling follow-up.
- `ACTIONS_SIGNALS`: confirmed `blast`, `track_release`, `event_created`, and `signal_created` Feed row types, no active Travel affordance, and no inline Feed insert actions.
- `EVENTS_ARCHIVE`: confirmed Plot Events and Feed event inserts stay read-only and identified the missing Feed insert calendar-mutation negative lock.

## Files Changed

- `docs/solutions/FEED_CARD_FAMILY_INVENTORY_R1.md`
- `docs/handoff/2026-07-03_feed-card-family-inventory.md`
- `docs/CHANGELOG.md`
- `docs/operations/ACTIVE_PM.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `apps/web/__tests__/plot-tab-contracts.test.ts`

## Runtime Impact

None. This slice does not add card actions, Transport, Travel, calendar mutation, source tooling, or player behavior.

## Regression Lock Added

`apps/web/__tests__/plot-tab-contracts.test.ts` now rejects these strings in `SeedFeedPanel.tsx`:

- `Add to calendar`
- `addToCalendar`
- `onAddToCalendar`
- `calendarMutation`
- `CalendarButton`

## Task 10 Next Signal

Proceed to UPRISE Development Plan R1 Task 10 only after this branch merges:

- harden launch-scope Blast card source-link/listen-load behavior for in-community signals where runtime data exists;
- keep Travel hidden/deferred;
- do not add general Plot transport;
- do not add inline Feed insert actions.

## Validation

To be run before PR:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

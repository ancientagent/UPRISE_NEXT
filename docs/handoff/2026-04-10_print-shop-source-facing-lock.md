# 2026-04-10 Print Shop Source-Facing Lock

## Summary
- Locked the Print Shop boundary more explicitly across the active specs.
- Print Shop is source-facing infrastructure for artists/promoters and event/flyer issuance workflows.
- Listeners do not use Print Shop as an event-authoring or issuance-management surface.

## What Changed
- `docs/specs/economy/print-shop-and-promotions.md`
  - now states directly that Print Shop is source-facing infrastructure and not a listener-facing creation surface
  - clarifies that create/manage issuance flows belong to source operators
- `docs/specs/events/events-and-flyers.md`
  - now states directly that event creation remains source-facing through Print Shop
  - listener event interaction remains discovery/follow/attendance oriented
- `docs/specs/system/registrar.md`
  - clarifies that promoter capability unlocks a source-facing Print Shop/event lane, not a listener event-authoring surface
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
  - event ontology lock now includes the Print Shop source-facing boundary

## Resulting Rule
- Print Shop: source-facing
- Event creation/write lane: source-facing
- Listener event behavior: read/discover, follow, and later attendance artifact flows

## Follow-Up
- When event creation/package runtime is implemented, do not add a listener-facing Print Shop entry or listener event-write path unless founder direction explicitly changes.

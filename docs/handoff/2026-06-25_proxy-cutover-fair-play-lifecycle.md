# Proxy Cutover + Fair Play Lifecycle Join Points

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Scope: docs-only owner-contract slice
Runtime changes: none
Migrations: none

## Summary

Completed Slice 2 from the community activation strategy by promoting proxy-to-natural song/vote/user cutover rules into the broadcast/Fair Play and onboarding owner specs.

This slice defines:

- existing proxy-scene songs are not cloned, transferred, or double-listed into a newly active natural Home Scene;
- existing songs finish their current active New Releases/Main Rotation/tier placement in the prior proxy scene until a normal lifecycle transition, removal/replacement rule, or approved promotion path ends that active placement;
- new songs submitted after natural-scene activation attach according to source-origin / active Home Scene rules;
- proxy-scene votes, engagement history, and recurrence evidence remain historical to the proxy scene/tier where they occurred;
- the newly active natural Home Scene starts its own local city-tier voting/evidence context;
- users whose submitted/default Home Scene becomes active should re-resolve to the natural scene on the next supported cutover path;
- the former proxy may remain as an Away Scene/saved listening context where profile/collection support exists;
- cross-state proxy advancement remains a provisional edge case that must preserve both source-origin state and proxy-scene state before automated statewide identity depends on it.

## Files Changed

- `docs/specs/broadcast/radiyo-and-fair-play.md`
  - Added `Proxy Cutover And Lifecycle Join Points` as the Fair Play owner section.
  - Reduced older support-contract bullets to a pointer to the new owner section.
  - Added acceptance criteria for proxy history retention and no dual-active listing.
- `docs/specs/users/onboarding-home-scene-resolution.md`
  - Added `Proxy-to-Natural Cutover User Contract` for user re-resolution, Away Scene preservation, and cutover messaging boundaries.
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
  - Added short pointer that vote authority/history does not transfer during proxy-to-natural cutover.
- `docs/specs/system/documentation-framework.md`
  - Tightened contract ownership rows to exact anchors for activation and proxy lifecycle.
- `docs/specs/communities/scenes-uprises-sects.md`
  - Harmonized trigger-mechanism wording with Registrar.
- `docs/CHANGELOG.md`
  - Added one Unreleased entry.

## Explicit Non-Goals

- No runtime cutover job.
- No Fair Play promotion evaluator.
- No activation evaluator.
- No migration.
- No dedicated `Uprise` model.
- No new song-removal policy.
- No final cross-state statewide identity rule beyond preserving diagnostics and marking it edge-case.

## Remaining Follow-Up Slices

1. Activation metrics read path: define and implement internal/admin readiness diagnostics for source-origin readiness.
2. Activation trigger execution path: implement scheduled/manual activation evaluator after trigger authority is locked.
3. Listener/source notification path: define exact notification surface and copy.
4. Release Deck eligibility owner spec: lock song length, replacement behavior, and active-rotation eligibility before enforcement.

## Validation

To run before commit:

```bash
pnpm run docs:lint
git diff --check
```

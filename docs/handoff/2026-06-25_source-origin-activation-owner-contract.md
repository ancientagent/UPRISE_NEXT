# Source Origin + Community Activation Owner Contract

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Scope: docs-only owner-contract slice
Runtime changes: none
Migrations: none

## Summary

Promoted the source-origin and city-tier activation lifecycle from strategy/future-work language into owner specs.

This slice defines:

- source origin as the submitted natural `city + state + music community` verified through Registrar/GPS authority;
- temporary proxy routing as a listening/voting/operating bridge, not source-origin identity;
- city-tier activation readiness as source/music-driven: at least `45` minutes approved playable music from at least `5` distinct registered source accounts;
- the `20` minute per-source cap for any one Uprise rotation;
- activation counting as source-origin-matching approved playable music, not listener demand, missing-community requests, or passive tags;
- proxy-to-natural side-effect boundaries: future listeners/uploads route to the natural scene, existing proxy songs finish lifecycle, vote/history data stays with the scene/tier where it happened.

## Files Changed

- `docs/specs/system/registrar.md`
  - Added `Source Origin Contract`.
  - Added `City-Tier Activation Authority`.
  - Added acceptance-test and deferred-runtime pointers for activation metrics/trigger/cutover implementation.
- `docs/specs/communities/scenes-uprises-sects.md`
  - Added `City-Tier Activation Workflow` with candidate, readiness, trigger/side effects, and source/listener re-resolution rules.
  - Updated future-work wording so numeric threshold is no longer treated as unresolved.
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
  - Added short pointers to source-origin and activation authority.
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
  - Added owner-contract pointers and clarified submitted Home Scene metadata is not a listener-side pending Community row.
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
  - Added source-origin pointer for source tools and proxy routing.
- `docs/CHANGELOG.md`
  - Added one Unreleased entry.

## Explicit Non-Goals

- No runtime code changes.
- No Prisma migration.
- No activation evaluator/job.
- No source-origin schema change.
- No Release Deck/media eligibility implementation.
- No Project-to-Cause terminology migration.
- No dedicated `Uprise` model.
- No Prime-model generation.

## Remaining Follow-Up Slices

1. Proxy cutover + Fair Play lifecycle join points: lock exact lifecycle-end conditions, cross-state edge policy, and vote/history treatment in the broadcast/Fair Play owner spec.
2. Activation metrics read path: add internal/admin diagnostics for source-origin readiness without enabling public listener promises.
3. Activation trigger execution path: implement scheduled/manual evaluator only after the owner contract and metrics contract are locked.
4. Source/listener notification path: define where users/sources see proxy-to-natural activation changes.
5. Release Deck eligibility owner spec: create or designate the media/Release Deck eligibility contract before enforcing song length/replacement behavior.

## Validation

To run before commit:

```bash
pnpm run docs:lint
git diff --check
```

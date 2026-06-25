# 2026-06-25 — Activation Readiness Source-Origin Runtime Blocker

## Summary

Slice 3 was scoped as the activation metrics/readiness read path after the source-origin and proxy cutover owner contracts. Runtime inspection showed the read path cannot be implemented truthfully yet because Registrar does not persist inactive natural source-origin tuples separately from the active/proxy scene.

This handoff records the blocker and updates the owner docs so future agents start with source-origin persistence before adding activation diagnostics or automation.

## Branch / Commit State

- Branch: `docs/abacus-fusion-swarm-strategy`
- Previous reviewed HEAD: `bf0efb8` (`docs: define proxy cutover fair play contract`)
- Runtime change: none
- Migration change: none
- Data/provider action: none

## Runtime Evidence

Current Artist/Band registration runtime:

- `apps/api/src/registrar/dto/registrar.dto.ts` accepts `sceneId`, `name`, `slug`, `entityType`, and `members`; it does not accept submitted natural source-origin tuple fields.
- `apps/api/src/registrar/registrar.service.ts` looks up `dto.sceneId`, requires the scene to be city-tier, requires the user to be GPS-verified, and rejects submissions where the user's Home Scene tuple does not match the target scene tuple.
- `apps/api/src/registrar/registrar.service.ts` creates `RegistrarEntry` with `sceneId: scene.id` and materializes `ArtistBand.homeSceneId: entry.sceneId`.
- `apps/api/test/registrar.service.test.ts` locks active-scene behavior: rejects outside user Home Scene and materializes Artist/Band with `homeSceneId: 'scene-1'`.

This means current runtime supports Artist/Band registration in an existing active Home Scene. It does not yet preserve a separate inactive natural source-origin tuple for a source operating through a proxy scene.

## Contract Decision

Do not implement activation readiness diagnostics from `ArtistBand.homeSceneId` alone while source origin and proxy scene can differ.

Before activation readiness APIs, trigger jobs, or admin diagnostics can be correct, one implementation path must be selected and tested:

- persist source-origin tuple fields on Registrar entry and/or materialized Artist/Band;
- add a dedicated source-origin/readiness model linked to Registrar and Artist/Band;
- or use another owner-approved model that preserves inactive natural tuple identity without restoring listener-side pioneer workflows.

## Files Changed

- `docs/specs/system/registrar.md`
  - Added `Runtime Parity Blocker: Source-Origin Persistence` under the Source Origin Contract.
  - Added source-origin persistence for inactive natural tuples to deferred runtime work.
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
  - Clarified that Slice 3 must begin with source-origin persistence before readiness diagnostics.
- `docs/specs/system/documentation-framework.md`
  - Updated initial issue sequencing so source-origin persistence precedes activation readiness diagnostics and trigger orchestration.
- `docs/CHANGELOG.md`
  - Added a concise Unreleased Changed entry.

## Validation

Run before commit:

```bash
pnpm run docs:lint
git diff --check
```

## Next Slice

Recommended next implementation slice:

1. Add failing Registrar/API tests proving proxy source-origin must persist independently from proxy operating scene.
2. Choose the smallest model path for source-origin persistence.
3. Implement persistence and materialization behavior.
4. Only after that, add activation readiness read APIs/diagnostics.

## Not Done

- No activation readiness endpoint added.
- No activation trigger added.
- No schema migration added.
- No runtime Registrar behavior changed.

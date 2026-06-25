# 2026-06-25 Registrar Source-Origin Compatibility Audit

## Summary

Audited current `main` Registrar/source-origin runtime against `docs/specs/system/registrar.md#source-origin-contract` and the Music-Community Preference compatibility cleanup plan.

Result: source-origin persistence is broadly aligned with the active owner contract. Artist/Band registration is GPS-gated, city-tier only, permits assigned same-music-community proxy operation, preserves submitted natural source-origin fields on `RegistrarEntry`, and copies those fields to `ArtistBand` on materialization.

Remaining compatibility gap: Registrar still derives source-origin music community from `User.homeSceneCommunity`. That is acceptable as current compatibility behavior, but it should move to the shared default music-community preference resolver once Item 3 merges, so explicit default/star state cannot drift from Registrar source-origin authority.

No runtime code, schema, migration, provider, DB, seed, deploy, or browser action was performed in this audit.

## Evidence Checked

Owner contract:

- `docs/specs/system/registrar.md#source-origin-contract`
- `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract`
- `docs/specs/users/onboarding-home-scene-resolution.md#compatibility-cleanup-plan-2026-06-25`

Runtime/schema:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/src/registrar/registrar.controller.ts`

Tests/handoffs:

- `apps/api/test/registrar.service.test.ts`
- `docs/handoff/2026-06-25_registrar-source-origin-persistence.md`
- `docs/handoff/2026-06-25_activation-readiness-source-origin-runtime-blocker.md`

## Confirmed Current Runtime

- `ArtistBand` has `sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity` plus an index for activation/readiness lookup.
- `RegistrarEntry` has `sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity` plus an index for activation/readiness lookup.
- Artist/Band registration selects `gpsVerified`, submitted Home Scene city/state/community, and `tunedSceneId` from the registering user.
- Artist/Band registration rejects non-city-tier target scenes.
- Artist/Band registration rejects users without GPS verification.
- Artist/Band registration accepts either the natural Home Scene tuple or the assigned same-music-community proxy scene when `User.tunedSceneId` matches the requested scene.
- Artist/Band registration stores natural source-origin fields from the user's submitted Home Scene tuple, not from the proxy operating scene.
- Materialization creates `ArtistBand.homeSceneId` from the operating scene and copies `ArtistBand.sourceOrigin*` from the Registrar entry.
- Tests lock GPS verification, city-tier restriction, unrelated Away/visitor scene rejection, proxy registration with preserved source origin, submitted source-origin fields, and materialized source-origin fields.

## Compatibility Findings

### P1 — Registrar source-origin music-community still reads the compatibility field

`submitArtistBandRegistration` derives both authorization and source-origin music community from `User.homeSceneCommunity`. This is currently consistent with the compatibility cleanup plan, but it means default/star changes in `UserMusicCommunityPreference` are not authoritative for Registrar until the read path is inverted.

Recommended follow-up after Item 3 merges:

- Inject/use the shared default music-community preference resolver in `RegistrarService`.
- Prefer explicit `UserMusicCommunityPreference.isDefault` for source-origin music community.
- Keep `User.homeSceneCommunity` fallback for older rows.
- Add a focused Registrar test where `homeSceneCommunity='punk'`, default preference is `metal`, and a GPS-verified Austin Metal source registration is accepted while Austin Punk is no longer treated as the active default.

### P2 — Promoter/project/sect Registrar paths still use Home Scene tuple compatibility behavior

Promoter, project, and sect-motion registration methods also compare requested scene identity against `User.homeSceneCity/homeSceneState/homeSceneCommunity`. These are less directly tied to Artist/Band source-origin activation, but they should be audited when the shared default-preference resolver is rolled through all Registrar paths.

### P2 — GPS verification remains a boolean gate, not a source-origin locality proof record

Current runtime requires `user.gpsVerified=true`, which matches the current owner contract enough for MVP. A later audit may need a stronger locality-proof model if the platform wants to prove which city/state the GPS verification covered after city moves, default preference changes, or multi-preference expansion.

Do not block current Registrar source-origin behavior on this. Treat it as a future authority-model refinement.

## Not Findings

- No listener-side pioneer activation queue was found in Registrar source-origin behavior.
- No source-origin data is derived from listener demand or missing-community requests.
- No activation readiness code appears to count `ArtistBand.homeSceneId` alone when source origin can differ; readiness docs and source-origin fields are aligned.
- No source-origin fields are overwritten during materialization.

## Recommended Next Slice

Item 5 should audit activation readiness runtime next, with special attention to whether diagnostics and manual activation count source-origin fields rather than operating-scene fields.

When Item 3 is merged, a follow-up implementation slice should apply the default-preference resolver to Registrar source-origin reads.

## Validation

Audit validation to run before commit:

- `pnpm run docs:lint`
- `git diff --check`

## Boundaries

- No runtime changes in this audit.
- No schema changes.
- No provider, DB, seed, migration, deploy, or browser commands.
- Existing `art/` untracked assets were not touched.

# Activation Notification And Away Scene Contract

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Community activation proxy lifecycle - activation notification / former-proxy preservation

## Summary

Promoted activation notification and former-proxy Away Scene preservation into the onboarding/Home Scene cutover owner contract without changing runtime behavior.

Owner contract updates:

- `docs/specs/users/onboarding-home-scene-resolution.md#proxy-to-natural-cutover-user-contract` now owns listener/source activation messaging and former-proxy saved context behavior.
- `docs/specs/system/documentation-framework.md` now routes activation notification and former-proxy Away Scene preservation to that owner contract.
- Admin, community, onboarding brief, and strategy docs now clarify that current runtime only re-roots listeners/sources; notification persistence and saved-scene storage remain implementation follow-ups.

No code, schema, migration, seed, provider, or DB action was added.

## Files Changed

- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`
- `docs/specs/admin/super-admin-controls.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_activation-notification-away-scene-contract.md`

## Behavior Locked

- Activation messaging should explain that the natural Home Scene activated because source/music readiness was met.
- Messaging must not imply listener demand, onboarding counts, or missing-community requests created the community.
- Source-facing activation context should explain that future uploads attach to the natural scene while existing proxy-scene songs finish their current lifecycle in the prior active scene.
- Notification delivery must not mutate voting authority, source origin, existing track placement, votes, engagement history, or rotation evidence.
- The former proxy scene may be preserved as an Away Scene or saved profile/collection context when a product surface supports it.
- Former proxy preservation must not keep the proxy in the Home Scene roller or preserve city-tier voting authority there.
- Existing signal/collection shelves are not automatically promoted into saved Away Scene storage until their signal type and shelf semantics are explicitly locked.

## Current Runtime Boundary

Current runtime after manual activation:

- re-anchors matching `ArtistBand.homeSceneId` values to the newly active natural scene for future uploads;
- re-roots matching listener `User.tunedSceneId` values to the newly active natural scene for Home/Plot resolution;
- does not emit notifications;
- does not persist saved Away Scene/profile context;
- does not move existing tracks, votes, engagement history, or rotation entries.

## Validation

Run before commit:

```bash
pnpm run docs:lint
git diff --check
```

## Next Slice

Recommended next implementation/artifact choices:

1. Define notification UI placement and whether notification persistence is needed, or
2. Define saved Away Scene storage semantics if former-proxy preservation should be persisted before the UI exists, or
3. Move to Music-Community Preference runtime parity audit if implementation should pause until the branch is reviewed.

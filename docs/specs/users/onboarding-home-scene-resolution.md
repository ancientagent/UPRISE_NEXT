# Onboarding and Home Scene Resolution

**ID:** `USER-ONBOARDING`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-06-24`

## Overview & Purpose

Defines the onboarding flow for selecting a Home Scene and deterministic assignment to an active major-node Home Scene when a submitted city-tier scene is inactive or unavailable.

## User Roles & Use Cases

- New Listener selects a Home Scene during onboarding.
- Listener denies GPS and still participates without voting.
- User enters a city/community not yet active and is assigned to the nearest/relevant active major-node Home Scene for the same parent music community.

## Functional Requirements

- Onboarding asks for local scene context using **City**, **State**, optional **ZIP/postal code**, and **Music Community**.
- Listener location authority is manual-first: if the user enters city/state, that submitted location is the Home Scene intent even when GPS is denied. Optional ZIP/postal code is submitted-location detail for preview/context only and does not replace city/state/music-community identity.
- If the user does not enter city/state and accepts GPS, GPS-derived reverse geocoding supplies the submitted city/state before Home Scene review and may prefill ZIP/postal code when the provider returns it.
- Onboarding music community input is **selection-only** from approved parent communities (no free-text genre/community creation).
- Current MVP launch selection uses the implementation list in `docs/specs/seed/music-communities.json`.
- Current MVP launch matrix is defined in `docs/specs/seed/launch-community-city-matrix.json` as `6` launch cities x `8` launch music communities = `48` city-tier Home Scene tuples.
- Current MVP launch geofence readiness uses the city-center point and `50000` meter radius stored on each launch city in `docs/specs/seed/launch-community-city-matrix.json`; every music-community scene in the same launch city inherits that city geofence for exact active Home Scene voting verification.
- Home Scene architecture is invariant. City and music-community identity change the scene data, membership, content, activity, and later generated Prime-model structures; they must not change runtime screens, menus, tabs, actions, player behavior, or routing.
- UPRISE starts with a fixed set of active major-node Home Scenes / music capitals for each parent music community. These nodes absorb listeners and sources from surrounding or inactive cities until enough local artist/source concentration exists to split off a new active city-tier Home Scene.
- New city-tier communities are created through artist/source registration and Registrar/source activation, not listener onboarding, listener demand, or listener-side pioneer tracking. Without active local artists/music, there is no music community to activate.
- A new Home Scene activates when it has at least `45` minutes of approved playable music from at least `5` distinct registered source accounts.
- No single source may occupy more than `20` minutes of any one Uprise rotation at a time.
- If a listener's submitted/GPS city differs from the assigned active Home Scene, Home may show lightweight helper copy telling the listener they can help bring UPRISE to their hometown by inviting local bands/artists to register. This is messaging only; it does not create a listener-side activation queue.
- When a new active city-tier Home Scene splits off from a major node, future listener assignment and future source uploads attach according to the newly active Home Scene. Existing songs finish their current rotation lifecycle in their prior active scene unless a later approved spec changes the cutover rule.
- Sects, generated channels, and sub-communities are created later through the Prime model, not through bespoke launch seed behavior.
- Missing-music-community requests are intake only: they do not create selectable onboarding options or live city-tier scenes until repeated submissions from distinct people in distinct cities make the request eligible for review.
- Missing-music-community intake is stored through `POST /onboarding/music-community-requests`; it records distinct requester/city review signals and does not define a final approval threshold in code.
- Taste tags are **not** collected during onboarding; they are configured after entering Home Scene.
- Home Scene selection is stored regardless of GPS verification.
- Setting a Home Scene auto-joins the resolved active city-tier Scene membership.
- GPS verification is requested only to enable voting rights.
- If GPS is denied or unavailable, user remains affiliated but cannot vote.
- If the submitted city-tier scene is inactive/unavailable, the user is assigned to the nearest/relevant active major-node city scene for the selected parent community regardless of whether the submitted city/state came from manual input or GPS detection.
- Major-node assignment must stay in-state when any same-state active major-node exists for the selected music community.
- Cross-state major-node assignment is allowed only when no same-state active major-node exists for the selected music community.
- Within the allowed same-state candidate set, major-node assignment is distance-based when the submitted city/state can be geocoded and active candidate scenes have geofences; if coordinates are unavailable, runtime falls back to deterministic member/name ordering rather than blocking onboarding.
- Cross-state proxy assignment is an edge case. If unavoidable, songs may still advance through tier progression, but statewide origin/identity handling needs explicit edge-case policy before implementation depends on it.
- Inactive-city onboarding must not persist listener-side pioneer activation queues or promise community creation from listener demand.
- If the selected Home Scene is inactive/unavailable, GPS verification may check the submitted city/state locality while voting applies to the assigned active major-node community.
- Home may show lightweight helper copy after Home Scene context loads when the user's submitted/GPS city differs from the assigned active Home Scene.
- Helper copy delivery may use the top-right notification icon in the profile strip (next to the `...` settings menu) or an equivalent Home dashboard tooltip.

### Implemented Resolution Logic

- Input:
  - `city`, `state`, `musicCommunity`
- Resolution:
  - Find city-tier `Community` by exact `{city, state, musicCommunity, tier='city'}`.
  - If not found or not active, assign the user to the nearest/relevant active major-node `Community` for the selected parent music community.
  - If same-state active city-tier candidates exist for the selected music community, discard cross-state candidates before distance ranking.
  - Cross-state candidates are eligible only when no same-state active major-node candidate exists.
  - When submitted city/state coordinates are available, rank eligible active city-tier candidates by PostGIS distance from the submitted location before member-count/name tie-breakers.
  - Set active listening/voting anchor to the assigned active major-node community through `User.tunedSceneId` where current runtime needs an explicit resolved anchor.
  - Persist user home-scene fields as the submitted `city`, `state`, and `musicCommunity` for location context, but do not treat those fields as a listener-side community activation queue.
  - Auto-join via `CommunityMember` (idempotent; duplicate join ignored).
  - After loading user into Home Scene context, optionally show helper copy explaining major-node assignment and inviting the listener to tell local artists/bands to register if they want UPRISE to activate in their hometown.

### GPS Verification Semantics (Implemented)

- Exact active Home Scene verification checks user coordinates against that Home Scene geofence/radius.
- When the submitted Home Scene is inactive/unavailable, GPS verification may check the submitted city/state locality by reverse-geocoding the user's coordinates and comparing them to the submitted location. It does not require the user to be physically inside the assigned major-node community geofence.
- For inactive/unavailable Home Scenes, voting still uses the assigned active major-node scene stored in `User.tunedSceneId` after submitted locality verification succeeds.
- Launch geofences are only a voting-readiness locality gate; they are not tier logic, state/national scope logic, discovery radius logic, or a city-specific runtime branch.
- When GPS permission is accepted and city/state are auto-locked from GPS-derived location, onboarding treats that GPS-derived city/state as the submitted Home Scene location and rechecks stored GPS coordinates after Home Scene persistence for voting eligibility.
- Voting is enabled only when the exact active Home Scene geofence check or submitted-location locality check succeeds.
- If no Home Scene or geofence, coordinates are stored but `gpsVerified=false`.

## Non-Functional Requirements

- Clarity: onboarding copy must avoid “genre selection” framing.
- Consistency: Home Scene is represented as city+state+music community.
- Safety: GPS is never required for non-civic participation.
- Determinism: major-node assignment and any helper messaging must be deterministic and explainable.

## Architectural Boundaries

- Canon definitions come from `docs/canon/`.
- Voting is the only action gated by GPS verification.
- Web tier stores local onboarding state but uses API for authoritative server persistence when authenticated.

## Data Models & Migrations

### Prisma Models

- `User`
  - `homeSceneCity`
  - `homeSceneState`
  - `homeSceneCommunity`
  - `tunedSceneId`
  - `gpsVerified`
  - `latitude` / `longitude`
- `Community`
  - `city`, `state`, `musicCommunity`, `tier`, `isActive`, `geofence`, `radius`
- `CommunityMember`
- `SectTag`
- `UserTag`

### Migrations

- `20260213154237_add_scene_and_sect_tags`
- `20260216004000_add_user_home_scene_and_track_engagement`

## API Design

### Endpoints

| Method | Path                                   | Auth     | Description                                                                         |
| ------ | -------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| POST   | `/onboarding/home-scene`               | required | Resolve Home Scene, persist user affinity, auto-join resolved active Scene          |
| POST   | `/onboarding/gps-verify`               | required | Verify exact Home Scene geofence or submitted-location fallback voting eligibility  |
| POST   | `/onboarding/music-community-requests` | required | Store missing music-community intake for later review without creating a live Scene |
| GET    | `/communities/resolve-home`            | required | Resolve exact Home Scene tuple for Plot/community anchoring                         |

### Request/Response

- `POST /onboarding/home-scene` request:
  - `city: string`
  - `state: string`
  - `musicCommunity: string`
- `POST /onboarding/home-scene` response:
  - user affinity fields
  - `sceneId: string`
  - `resolvedCitySceneId: string`
  - `resolvedCitySceneLabel: string`
  - `tunedSceneId: string`
  - `votingEligible: boolean`
  - legacy compatibility fields such as `pioneerHomeScene` / `pioneer` may exist until runtime cleanup, but product language must not build new listener-side pioneer activation flows around them

- `POST /onboarding/gps-verify` request:
  - `latitude: number`
  - `longitude: number`
- `POST /onboarding/gps-verify` response:
  - `id`, `gpsVerified`, `latitude`, `longitude`
  - `votingEligible: boolean`
  - `votingSceneId: string | null`
  - `distance: number | null`
  - `reason: string | null` where applicable:
    - `NO_HOME_SCENE`
    - `SCENE_NOT_FOUND`
    - `SCENE_NO_GEOFENCE`
    - `OUTSIDE_GEOFENCE`
    - `SUBMITTED_LOCATION_NOT_VERIFIED`
    - `SUBMITTED_LOCATION_MISMATCH`

- `POST /onboarding/music-community-requests` request:
  - `requestedName: string`
  - `city: string`
  - `state: string`
- `POST /onboarding/music-community-requests` response:
  - stored request id/status
  - normalized display fields
  - `reviewSignals.distinctRequesterCount`
  - `reviewSignals.distinctCityCount`
  - no `Community` id and no selector mutation

## Web UI / Client Behavior

- `apps/web/src/app/onboarding/page.tsx`:
  - captures City/State, optional ZIP/postal code, and Music Community (selection-only parent community)
  - lets manual city/state input set the submitted Home Scene when GPS is denied or skipped
  - lets GPS-derived reverse geocoding provide city/state when the user does not manually enter location
  - rechecks stored GPS coordinates after authenticated Home Scene persistence so GPS-first onboarding can enable voting once a scene exists
  - allows authenticated users to submit a missing-music-community request without changing the selected approved parent community
  - requests GPS with clear voting-only gating copy
  - resolves active major-node assignment when city is inactive
  - shows assigned active Home Scene in review when the submitted city is not yet active
  - shows voting eligibility and failure reason in review step
- `apps/web/src/app/plot/page.tsx`:
  - after onboarding completion and Home Scene context load, Home may show major-node assignment helper copy through the notification icon or a lightweight Home dashboard tooltip.
  - helper copy explains that local communities are activated by local artist/band/source participation through Registrar/source registration, and that inviting local artists can help bring UPRISE to the listener's hometown.
- `apps/web/src/store/onboarding.ts`:
  - persists local onboarding state (`homeScene`, including optional `postalCode`, `gpsStatus`, `votingEligible`, `gpsReason`)

## Acceptance Tests / Test Plan

- Active existing scene input resolves and persists correctly.
- Inactive city selection assigns the user to the nearest/relevant active major-node city scene for the selected parent community.
- Major-node assignment returns deterministic active scene label in onboarding review.
- Parent community input accepts only approved selection values.
- Duplicate scene join does not create duplicate `CommunityMember` rows.
- Denied GPS keeps participation intact and voting disabled.
- Geofence miss returns `OUTSIDE_GEOFENCE` and leaves `gpsVerified=false`.

## Future Work & Open Questions

- Runtime cleanup: retire or rename legacy `pioneer`/`pioneerHomeScene` fields and tests once the major-node assignment language is implemented end-to-end.
- Define the Registrar/source activation workflow and artist/source concentration threshold for splitting a new active city-tier Home Scene from a major-node community.
- Lock Home dashboard tooltip copy for users whose submitted/GPS city differs from their assigned active Home Scene.
- Sect uprising motion mechanics remain governed by `docs/specs/DECISIONS_REQUIRED.md`.

## References

- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`

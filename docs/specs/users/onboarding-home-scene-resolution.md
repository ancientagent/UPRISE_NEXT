# Onboarding and Home Scene Resolution

**ID:** `USER-ONBOARDING`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-06-19`

## Overview & Purpose

Defines the onboarding flow for selecting a Home Scene and deterministic resolution/routing when a selected city-tier scene is inactive.

## User Roles & Use Cases

- New Listener selects a Home Scene during onboarding.
- Listener denies GPS and still participates without voting.
- User enters a city/community not in DB and is treated as a pioneer.

## Functional Requirements

- Onboarding asks for local scene context using **City**, **State**, and **Music Community**.
- Listener location authority is manual-first: if the user enters city/state, that submitted location is the Home Scene intent even when GPS is denied.
- If the user does not enter city/state and accepts GPS, GPS-derived reverse geocoding supplies the submitted city/state before Home Scene review.
- Onboarding music community input is **selection-only** from approved parent communities (no free-text genre/community creation).
- Current MVP launch selection uses the implementation list in `docs/specs/seed/music-communities.json`.
- Current MVP launch matrix is defined in `docs/specs/seed/launch-community-city-matrix.json` as `6` launch cities x `8` launch music communities = `48` city-tier Home Scene tuples.
- Current MVP launch geofence readiness uses the city-center point and `50000` meter radius stored on each launch city in `docs/specs/seed/launch-community-city-matrix.json`; every music-community scene in the same launch city inherits that city geofence for exact active Home Scene voting verification.
- Home Scene architecture is invariant. City and music-community identity change the scene data, membership, content, activity, and later generated Prime-model structures; they must not change runtime screens, menus, tabs, actions, player behavior, or routing.
- Sects, generated channels, and sub-communities are created later through the Prime model, not through bespoke launch seed behavior.
- Missing-music-community requests are intake only: they do not create selectable onboarding options or live city-tier scenes until repeated submissions from distinct people in distinct cities make the request eligible for review.
- Missing-music-community intake is stored through `POST /onboarding/music-community-requests`; it records distinct requester/city review signals and does not define a final approval threshold in code.
- Taste tags are **not** collected during onboarding; they are configured after entering Home Scene.
- Home Scene selection is stored regardless of GPS verification.
- Setting a Home Scene auto-joins the resolved active city-tier Scene membership.
- GPS verification is requested only to enable voting rights.
- If GPS is denied or unavailable, user remains affiliated but cannot vote.
- If selected city-tier scene is inactive/unavailable, user is auto-routed to nearest active city scene for the selected parent community regardless of whether the submitted city/state came from manual input or GPS detection.
- Nearest-active fallback is distance-based when the submitted city/state can be geocoded and active candidate scenes have geofences; if coordinates are unavailable, runtime falls back to deterministic same-state/member/name ordering rather than blocking onboarding.
- Inactive-city onboarding must persist pioneer intent and trigger pioneer notification messaging.
- If the selected Home Scene is inactive/unavailable, GPS verification checks the submitted city/state locality while voting applies to the resolved nearest active city-tier community; the submitted city/state/music-community remains preserved as pioneer intent.
- Pioneer notification is shown after the user is loaded into Home Scene context (routed nearest active scene when required).
- Pioneer notification delivery UI is the top-right notification icon in the profile strip (next to the `...` settings menu).

### Implemented Resolution Logic

- Input:
  - `city`, `state`, `musicCommunity`
- Resolution:
  - Find city-tier `Community` by exact `{city, state, musicCommunity, tier='city'}`.
  - If not found or not active, mark user as pioneer for selected `{city,state,musicCommunity}`.
  - Resolve nearest active city-tier `Community` for the selected parent music community.
  - When submitted city/state coordinates are available, rank active city-tier candidates by PostGIS distance from the submitted location before same-state/member-count/name tie-breakers.
  - Set active listening/voting anchor to the nearest active city-tier community through `User.tunedSceneId`; preserve pioneer intent for the chosen city.
  - Persist user home-scene fields as the submitted `city`, `state`, and `musicCommunity`.
  - Auto-join via `CommunityMember` (idempotent; duplicate join ignored).
  - After loading user into Home Scene context, trigger pioneer informational notification (in-app + transactional notification path) stating fallback scene and pioneer tracking.

### GPS Verification Semantics (Implemented)

- Exact active Home Scene verification checks user coordinates against that Home Scene geofence/radius.
- When the submitted Home Scene is inactive/unavailable, GPS verification checks the submitted city/state locality by reverse-geocoding the user's coordinates and comparing them to the preserved pioneer intent. It does not verify the user against the resolved fallback community geofence.
- For inactive/unavailable Home Scenes, voting still uses the resolved active fallback scene stored in `User.tunedSceneId` after submitted locality verification succeeds.
- Launch geofences are only a voting-readiness locality gate; they are not tier logic, state/national scope logic, discovery radius logic, or a city-specific runtime branch.
- When GPS permission is accepted and city/state are auto-locked from GPS-derived location, onboarding treats that GPS-derived city/state as the submitted Home Scene location and rechecks stored GPS coordinates after Home Scene persistence for voting eligibility.
- Voting is enabled only when the exact active Home Scene geofence check or submitted-location locality check succeeds.
- If no Home Scene or geofence, coordinates are stored but `gpsVerified=false`.

## Non-Functional Requirements

- Clarity: onboarding copy must avoid “genre selection” framing.
- Consistency: Home Scene is represented as city+state+music community.
- Safety: GPS is never required for non-civic participation.
- Determinism: fallback routing and pioneer messaging must be deterministic and explainable.

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
  - `pioneerHomeScene: { city: string; state: string; musicCommunity: string } | null`
  - `tunedSceneId: string`
  - `votingEligible: boolean`
  - `pioneer: boolean`

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
  - captures City/State/Music Community (selection-only parent community)
  - lets manual city/state input set the submitted Home Scene when GPS is denied or skipped
  - lets GPS-derived reverse geocoding provide city/state when the user does not manually enter location
  - rechecks stored GPS coordinates after authenticated Home Scene persistence so GPS-first onboarding can enable voting once a scene exists
  - allows authenticated users to submit a missing-music-community request without changing the selected approved parent community
  - requests GPS with clear voting-only gating copy
  - resolves active scene fallback when city is inactive
  - shows pioneer status and nearest active routed scene in review step
  - shows voting eligibility and failure reason in review step
- `apps/web/src/app/plot/page.tsx`:
  - after onboarding completion and Home Scene context load, the pioneer message is available from the notification icon in the profile strip.
  - pioneer message copy explains fallback routing and that the user can establish/uprise their own city scene once enough local users join.
- `apps/web/src/store/onboarding.ts`:
  - persists local onboarding state (`homeScene`, `gpsStatus`, `votingEligible`, `gpsReason`)

## Acceptance Tests / Test Plan

- Active existing scene input resolves and persists correctly.
- Inactive city selection marks pioneer intent and auto-routes user to nearest active city scene for selected parent community.
- Pioneer routing returns deterministic nearest active scene label in onboarding review.
- Parent community input accepts only approved selection values.
- Duplicate scene join does not create duplicate `CommunityMember` rows.
- Denied GPS keeps participation intact and voting disabled.
- Geofence miss returns `OUTSIDE_GEOFENCE` and leaves `gpsVerified=false`.

## Future Work & Open Questions

- Pioneer incentives/recruitment tooling remains open beyond baseline pioneer notification.
- Sect uprising motion mechanics remain governed by `docs/specs/DECISIONS_REQUIRED.md`.

## References

- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`

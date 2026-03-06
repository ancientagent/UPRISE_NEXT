# Onboarding and Home Scene Resolution

**ID:** `USER-ONBOARDING`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-03-02`

## Overview & Purpose
Defines the onboarding flow for selecting a Home Scene and deterministic resolution/routing when a selected city-tier scene is inactive.

## User Roles & Use Cases
- New Listener selects a Home Scene during onboarding.
- Listener denies GPS and still participates without voting.
- User enters a city/community not in DB and is treated as a pioneer.

## Functional Requirements
- Onboarding asks for local scene context using **City**, **State**, and **Music Community**.
- Onboarding music community input is **selection-only** from approved parent communities (no free-text genre/community creation).
- Taste tags are **not** collected during onboarding; they are configured after entering Home Scene.
- Home Scene selection is stored regardless of GPS verification.
- Setting a Home Scene auto-joins the resolved city-tier Scene membership.
- GPS verification is requested only to enable voting rights.
- If GPS is denied or unavailable, user remains affiliated but cannot vote.
- If selected city-tier scene is inactive/unavailable, user is auto-routed to nearest active city scene for the selected parent community.
- Inactive-city onboarding must persist pioneer intent and trigger pioneer notification messaging.
- Pioneer notification is shown after the user is loaded into Home Scene context (routed nearest active scene when required).
- Pioneer notification delivery UI is the top-right notification icon in the profile strip (next to the `...` settings menu).

### Implemented Resolution Logic
- Input:
  - `city`, `state`, `musicCommunity`
- Resolution:
  - Find city-tier `Community` by exact `{city, state, musicCommunity, tier='city'}`.
  - If not found or not active, mark user as pioneer for selected `{city,state,musicCommunity}`.
  - Resolve nearest active city-tier `Community` for the selected parent music community.
  - Set active listening anchor/Home Scene context to the nearest active city-tier community; preserve pioneer intent for the chosen city.
  - Persist user home-scene fields.
  - Auto-join via `CommunityMember` (idempotent; duplicate join ignored).
  - After loading user into Home Scene context, trigger pioneer informational notification (in-app + transactional notification path) stating fallback scene and pioneer tracking.

### GPS Verification Semantics (Implemented)
- Verification checks user coordinates against Home Scene geofence/radius.
- When GPS permission is accepted and city/state are auto-locked from GPS-derived location, onboarding treats the user as GPS-verified for voting eligibility.
- Voting is enabled only when user is within geofence.
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
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/onboarding/home-scene` | required | Resolve/create Home Scene, persist user affinity, auto-join Scene |
| POST | `/onboarding/gps-verify` | required | Verify geofence and set voting eligibility |
| GET | `/communities/resolve-home` | required | Resolve exact Home Scene tuple for Plot/community anchoring |

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
  - `votingEligible: boolean`
  - `pioneer: boolean`

- `POST /onboarding/gps-verify` request:
  - `latitude: number`
  - `longitude: number`
- `POST /onboarding/gps-verify` response:
  - `id`, `gpsVerified`, `latitude`, `longitude`
  - `votingEligible: boolean`
  - `distance: number | null`
  - `reason: string | null` where applicable:
    - `NO_HOME_SCENE`
    - `SCENE_NOT_FOUND`
    - `SCENE_NO_GEOFENCE`
    - `OUTSIDE_GEOFENCE`

## Web UI / Client Behavior
- `apps/web/src/app/onboarding/page.tsx`:
  - captures City/State/Music Community (selection-only parent community)
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

# Onboarding and Home Scene Resolution

**ID:** `USER-ONBOARDING`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-23`

## Overview & Purpose
Defines the onboarding flow for selecting a Home Scene and the current input-driven resolution logic that routes users into a city-tier Scene container and optional sect tagging.

## User Roles & Use Cases
- New Listener selects a Home Scene during onboarding.
- Listener denies GPS and still participates without voting.
- User enters optional other musical taste tag (sub/microgenre tag).
- User enters a city/community not in DB and is treated as a pioneer.

## Functional Requirements
- Onboarding asks for local scene context using **City**, **State**, and **Music Community**.
- Home Scene selection is stored regardless of GPS verification.
- Setting a Home Scene auto-joins the resolved city-tier Scene membership.
- GPS verification is requested only to enable voting rights.
- If GPS is denied or unavailable, user remains affiliated but cannot vote.

### Implemented Resolution Logic
- Input:
  - `city`, `state`, `musicCommunity`, optional `tasteTag`
- Resolution:
  - Find city-tier `Community` by exact `{city, state, musicCommunity, tier='city'}`.
  - If not found, create new inactive `Community` (`isActive=false`) and mark user as pioneer.
  - Persist user home-scene fields.
  - Auto-join via `CommunityMember` (idempotent; duplicate join ignored).
  - If `tasteTag` provided, upsert `SectTag` and link via `UserTag`.

### GPS Verification Semantics (Implemented)
- Verification checks user coordinates against Home Scene geofence/radius.
- Voting is enabled only when user is within geofence.
- If no Home Scene or geofence, coordinates are stored but `gpsVerified=false`.

## Non-Functional Requirements
- Clarity: onboarding copy must avoid “genre selection” framing.
- Consistency: Home Scene is represented as city+state+music community.
- Safety: GPS is never required for non-civic participation.

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
  - `homeSceneTag`
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
  - `tasteTag?: string`
- `POST /onboarding/home-scene` response:
  - user affinity fields
  - `sceneId: string`
  - `appliedTags: string[]`
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
  - captures City/State/Music Community + optional taste tag
  - requests GPS with clear voting-only gating copy
  - shows voting eligibility and failure reason in review step
- `apps/web/src/store/onboarding.ts`:
  - persists local onboarding state (`homeScene`, `gpsStatus`, `votingEligible`, `gpsReason`)

## Acceptance Tests / Test Plan
- Active existing scene input resolves and persists correctly.
- New scene input creates inactive pioneer scene and auto-joins user.
- Duplicate scene join does not create duplicate `CommunityMember` rows.
- Denied GPS keeps participation intact and voting disabled.
- Geofence miss returns `OUTSIDE_GEOFENCE` and leaves `gpsVerified=false`.

## Future Work & Open Questions
- Parent-scene mapping for free-text sect names is not yet implemented.
- Pioneer incentives/recruitment tooling remains open.
- Sect uprising motion mechanics remain governed by `docs/specs/DECISIONS_REQUIRED.md`.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`

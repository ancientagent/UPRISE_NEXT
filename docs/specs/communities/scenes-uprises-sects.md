# Scenes, Uprises, and Sects

**ID:** `COMM-SCENES`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-25`

## Overview & Purpose
This spec defines the structural hierarchy of **Scenes**, **Communities**, **Uprises**, and **Sects**. It formalizes how place, people, and broadcast relate, and how a Sect can mature into its own Uprise.

## User Roles & Use Cases
- Listener selects a Home Scene and participates locally.
- Artist (capability) registers to a Home Scene and uploads to its broadcast.
- Registrar participants enter motions to form a new Uprise when thresholds are met.
- Visitors traverse other Scenes without civic voting rights.

## Functional Requirements
- A **Scene** is a place-bound container. Scenes exist at City, State, and National levels.
- A **Community** is the people operating within a Scene.
- An **Uprise** is a dual-state object: the broadcast station/infrastructure operated by a Community within a Scene and the Signal of that community broadcast carried by RaDIYo.
- A **Home Scene** is the user’s local music Scene of choice and civic anchor.
- **Sects** are artist-based civic motions inside a Home Scene that can mature into sub-community Uprises.
- Sect initiation belongs to the artist-facing interface, not a listener taste-tag manager.
- A Sect becomes an Uprise only after meeting the support threshold and having enough committed artist catalog to sustain rotation (45 minutes of total playtime from artists who back/sign the motion).
- When a Sect meets the threshold, a motion is entered in the Registrar to establish the Sect Uprise.
- Artists must back/commit to the Sect Uprise for it to activate. If support is insufficient, the sect motion does not realize into an Uprise.
- Citywide is the only tier with civic infrastructure. Statewide and National are aggregate broadcasts only.

### Implemented Behavior (Current)
- Home Scene selection currently resolves exact `{city, state, musicCommunity}` in `Community` (tier `city`).
- If the city-tier community does not exist, the system creates it as inactive (`isActive=false`) and marks the user as pioneer.
- Older `tasteTag` / `SectTag` / `UserTag` structures remain in runtime as legacy debt, but they should not drive new sect formation or realization work.
- User is auto-joined to the resolved Scene via `CommunityMember`.
- Community profile read surface is available in web at `apps/web/src/app/community/[id]/page.tsx` using:
  - `GET /communities/:id` for profile metadata
  - `GET /communities/:id/feed` for recent S.E.E.D activity projection
- Registrar sect-motion submit skeleton exists:
  - `POST /registrar/sect-motion` creates a Home Scene-scoped registrar entry (`type = sect_motion`, `status = submitted`).
  - Current primitive enforces scene locality guardrails; threshold validation/approval remains deferred.

### Deferred Behavior (Not Implemented Yet)
- Dedicated Uprise persistence model and one-to-one Scene/Uprise lifecycle management.
- Reconcile/remove older taste-tag sect flow from onboarding and sect runtime.
- Registrar motion threshold validation, approval workflow, and automatic Sect-to-Uprise activation.
- City-to-State-to-National propagation thresholds and enforcement jobs (see `docs/specs/DECISIONS_REQUIRED.md`).

## Non-Functional Requirements
- Consistency: Scene, Community, and Uprise are never treated as interchangeable.
- Clarity: onboarding language must use “Music Community,” not “Genre Selection.”
- Neutrality: no algorithmic ranking or recommendation is implied by Scene structure.

## Architectural Boundaries
- Canon definitions come from `docs/canon/`.
- “Genre/subgenre/microgenre” must not be used as the live sect-formation mechanism.
- Home Scene selection uses **City**, **State**, **Music Community** labels.

## Data Models & Migrations
### Prisma Models
- `Community`
  - Structural fields: `city`, `state`, `musicCommunity`, `tier`, `isActive`
  - Geofence fields: `geofence` (PostGIS geography), `radius`
- `CommunityMember`
  - Scene membership linkage (`userId`, `communityId`, `role`)
  - Unique membership constraint on `(userId, communityId)`
- `SectTag` / `UserTag`
  - legacy tag-era sect structures still present in schema
  - should be treated as migration/runtime debt rather than the preferred sect model for new MVP work
- `User`
  - Home-scene affinity fields (`homeSceneCity`, `homeSceneState`, `homeSceneCommunity`, `homeSceneTag`, `gpsVerified`)
  - `homeSceneTag` is not the preferred sect driver going forward

### Migrations
- `20260213154237_add_scene_and_sect_tags` (scene metadata + sect/user tag tables)
- `20260216004000_add_user_home_scene_and_track_engagement` (user home-scene/gps fields)
- Backfill strategy: none required (nullable adds + new tables)
- Rollback: drop added columns/tables only if no onboarding/tag data is needed

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/onboarding/home-scene` | required | Resolve/create Home Scene and auto-join membership |
| POST | `/onboarding/gps-verify` | required | Verify voting eligibility against Home Scene geofence |
| GET | `/communities` | required | List communities |
| GET | `/communities/:id` | required | Community details |
| POST | `/communities` | required | Create community (supports geofence fields) |
| GET | `/communities/nearby` | required | Nearby scene lookup by lat/lng |
| POST | `/communities/:id/verify-location` | required | Verify user location against a community geofence |

### Request/Response
- `POST /onboarding/home-scene` request:
  - `city`, `state`, `musicCommunity`, optional legacy `tasteTag`
- `POST /onboarding/home-scene` response:
  - user home-scene fields + `sceneId`, legacy `appliedTags[]`, `votingEligible`, `pioneer`
- `POST /onboarding/gps-verify` response:
  - `gpsVerified`, `votingEligible`, `distance`, optional reason:
    - `NO_HOME_SCENE`
    - `SCENE_NOT_FOUND`
    - `SCENE_NO_GEOFENCE`
    - `OUTSIDE_GEOFENCE`

## Web UI / Client Behavior
- Onboarding prompts for **City**, **State**, **Music Community**.
- Legacy taste-tag capture may still appear in old/runtime paths, but new sect UX should not rely on tag assignment.
- Plot/community surfaces should move toward follow-driven and artist-motion-driven sect visibility rather than tag display.

## Acceptance Tests / Test Plan
- Doc review: Scene, Community, and Uprise definitions align to canon.
- UI copy review: no “genre selection” wording.
- API behavior:
  - Unknown city/community creates inactive pioneer Scene and auto-joins user.
  - Existing city/community resolves without duplicate membership.
  - GPS verify changes voting eligibility only.
- Legacy tag behavior:
  - if `tasteTag` still exists in old/runtime paths, it remains non-authoritative and should not be expanded into new sect behavior.

## Future Work & Open Questions
- Define formal Sect Uprise activation mechanics beyond the 45-minute artist playtime threshold (motion schema + approvals).
- Add explicit Uprise model and Scene<->Uprise lifecycle constraints.
- Lock propagation thresholds and policy in `docs/specs/DECISIONS_REQUIRED.md`.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`

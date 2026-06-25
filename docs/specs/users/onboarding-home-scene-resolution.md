# Onboarding and Home Scene Resolution

**ID:** `USER-ONBOARDING`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-06-25`

## Overview & Purpose

Defines the onboarding flow for selecting a Home Scene and deterministic assignment to an active major-node Home Scene when a submitted city-tier scene is inactive or unavailable.

## User Roles & Use Cases

- New Listener selects a Home Scene during onboarding.
- Listener denies GPS and still participates without voting.
- User enters a city/community not yet active and is assigned to the nearest/relevant active major-node Home Scene for the same parent music community.

## Functional Requirements

- Onboarding asks for local scene context using **City**, **State**, optional **ZIP/postal code**, and one **Music Community** as the user's primary scene of choice.
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
- The Home Scene selected during onboarding becomes the user's initial active/default Home Scene.
- Music-community preference, default-scene, roller, and city-move behavior follows the contract below.
- Saved Away Scenes and other explored scenes are profile/collection interests, not Home Scene memberships.
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

## Proxy-to-Natural Cutover User Contract

This section owns the user-facing Home Scene resolution side of proxy-to-natural cutover. Registrar owns source origin, the community spec owns activation readiness, and the broadcast spec owns song/vote lifecycle behavior.

Owner references:
- `docs/specs/system/registrar.md#source-origin-contract`
- `docs/specs/communities/scenes-uprises-sects.md#city-tier-activation-workflow`
- `docs/specs/broadcast/radiyo-and-fair-play.md#proxy-cutover-and-lifecycle-join-points`

- When a submitted/default Home Scene tuple becomes active after source-driven activation, matching users should resolve to the natural active Home Scene on the next supported Home Scene resolution/cutover path.
- Current MVP runtime performs this minimal cutover in the manual activation trigger by updating matching users' `tunedSceneId` to the newly active natural scene. Notification delivery and saved Away Scene/profile preservation for the former proxy context remain follow-up work.
- User profile music-community preferences remain the user's declared affiliations/interests; activation changes which scene those preferences resolve to, not the fact that the user holds the preference.
- If a user was routed through a proxy scene for a music community, that proxy scene may remain available as an Away Scene or saved/listenable context where profile/collection support exists.
- Voting authority follows the currently verified/default city and the resolved active Home Scene/proxy rules. Activation of the natural scene does not preserve city-tier voting authority in the former proxy scene unless the user is visiting it as an Away Scene under separate visitor rules.
- Historical votes and activity remain tied to the scene/tier where they occurred; the user's profile may show history, but that history does not become natural-scene vote evidence.
- Cutover messaging should be lightweight and explanatory: the natural Home Scene is now active because source/music readiness was met. It must not imply that listener demand alone created the community.
- Runtime may continue carrying legacy `pioneer` compatibility fields until cleanup, but new user-facing copy should use submitted Home Scene, proxy scene, natural Home Scene, and Away Scene language.

### Activation Notification Contract

- The activation event should create lightweight context for affected listeners and sources explaining that their submitted/default natural Home Scene is now active.
- Listener-facing copy should say the community activated because source/music readiness was met. It must not imply listener demand, onboarding counts, or missing-community requests created the community.
- Source-facing copy should explain that future uploads attach to the newly active natural Home Scene while existing proxy-scene songs finish their current lifecycle in the prior active scene.
- Current MVP may surface this context through Home/Profile strip notification affordances, a Home dashboard tooltip, Registrar/source-dashboard status context, or a future notification record.
- Until a notification persistence model exists, activation messaging may remain a read-only/contextual UI requirement rather than a stored inbox event.
- Notification delivery must not change voting authority, source origin, existing track placement, votes, engagement history, or rotation evidence.

### Former Proxy / Away Scene Preservation Contract

- After natural-scene activation, the former proxy scene should be preserved as a listenable Away Scene or saved profile/collection context when the product surface supports it.
- Preserving the former proxy scene does not keep it in the Home Scene roller. The roller remains for resolvable primary music-community preferences in the user's current/default city.
- Preserving the former proxy scene does not preserve city-tier voting authority there. The user may visit/listen under Away Scene behavior, but voting follows current verified/default city and Home Scene rules.
- The former proxy scene should not be duplicated as a second registered Home Scene affiliation for the same music-community preference.
- Existing collection/signal shelves may be used for future saved Uprise/Away Scene representation only if the signal type and shelf semantics are explicitly locked; this slice does not introduce that storage model.
- If an implementation later persists a saved Away Scene record, it must store enough context to distinguish historical proxy context from active Home Scene membership.

## Non-Functional Requirements

- Clarity: onboarding copy must avoid “genre selection” framing.
- Consistency: Home Scene is represented as city+state+music community.
- Safety: GPS is never required for non-civic participation.
- Determinism: major-node assignment and any helper messaging must be deterministic and explainable.

## Architectural Boundaries

- Canon definitions come from `docs/canon/`.
- Voting is the only action gated by GPS verification.
- Web tier stores local onboarding state but uses API for authoritative server persistence when authenticated.
- Profile-held music-community preferences are the source of truth for multi-community membership.
- GPS verification is city-scoped for voting.

## Music-Community Preference Contract

- Onboarding collects one primary scene-of-choice music community, not multiple preferences.
- Additional music-community preferences are added later from the user profile.
- A music-community preference means the user is a fan / involved with that music community.
- Music-community preferences persist across cities.
- The current verified/default city determines which local Home Scene or proxy scene content loads for each preference.
- Active major-node cities should generally carry the same primary music-community set, so saved preferences normally resolve locally when a user changes city.
- If a saved music-community preference does not resolve to an active current-city scene, it remains visible in the profile but does not appear in the Home Scene roller until resolvable.
- One successful GPS verification for a city grants voting rights across all of the user's registered music-community preferences that resolve in that verified city.
- Verifying a new city replaces the user's prior city voting authority; users do not hold voting authority in multiple cities at the same time.
- When a user verifies a new city and changes their Home Scene location, music-community preferences carry forward automatically without a separate re-confirmation step, but Home/Plot/RADIYO/Feed/Events/Archive content re-resolves to the new city's active or proxy scenes.
- The starred default music-community preference determines the Home Scene the user is anchored to and loaded into on login.
- The Home Scene roller is a shortcut to the user's resolvable primary music-community preferences in the current verified/default city.
- The currently selected roller item is the scene the user is in.

### Runtime Parity Status (2026-06-25)

- Current runtime has a profile-held preference persistence foundation: `UserMusicCommunityPreference` stores each user's registered music-community preferences and explicit default/star state.
- Existing users are backfilled from the single `User.homeSceneCommunity` field as their initial default preference by migration.
- Current API foundation:
  - `GET /users/me/music-community-preferences`
  - `POST /users/me/music-community-preferences`
  - `POST /users/me/music-community-preferences/default`
  - `GET /users/me/home-scene-roller`
- Typed web client wrappers exist in `apps/web/src/lib/users/client.ts`.
- The Home Scene roller read model resolves registered preferences against the user's current/default city: exact active natural scene first, same-state active proxy scene second, then any active proxy scene for that music community. Preferences with no active resolution remain profile-only and are excluded from the roller response.
- The Fair Play voting gate now allows a GPS-verified user to vote in any registered music-community preference that resolves from their current/default city to the target exact natural scene or active proxy scene. This does not authorize unregistered music communities, arbitrary visitor scenes, or simultaneous multi-city voting authority.
- The Home Scene selected during onboarding still writes the compatibility fields `User.homeSceneCity`, `User.homeSceneState`, `User.homeSceneCommunity`, and `User.tunedSceneId`; preference runtime foundation does not remove those fields yet.
- `CommunityMember` records membership in specific resolved communities, but it does not encode music-community preference order, profile affiliation intent, default-star semantics, or city-carried preference behavior.
- `POST /discover/tune` and `POST /discover/set-home-scene` mutate scene context by `sceneId`; they are not the final profile preference/default system.
- Remaining runtime work: profile UI integration, Plot/Home consumption of the roller read model, unresolved-profile visibility outside the roller, and migration cleanup once compatibility fields are retired.

## Data Models & Migrations

### Prisma Models

- `User`
  - `homeSceneCity`
  - `homeSceneState`
  - `homeSceneCommunity`
  - `tunedSceneId`
  - `gpsVerified`
  - `latitude` / `longitude`
- `UserMusicCommunityPreference`
  - `userId`
  - `musicCommunity`
  - `isDefault`
  - unique `{userId, musicCommunity}`
  - one default preference per user enforced by partial unique index
- The current `User` fields above remain the single-preference compatibility path for onboarding/Home Scene resolution until the full preference/default/roller runtime replaces them.
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
| GET    | `/users/me/music-community-preferences` | required | List current user's profile-held music-community preferences                       |
| POST   | `/users/me/music-community-preferences` | required | Add a profile-held music-community preference without implicitly changing default  |
| POST   | `/users/me/music-community-preferences/default` | required | Set the user's explicit default music-community preference                |
| GET    | `/users/me/home-scene-roller` | required | List resolvable Home Scene roller items from the user's registered preferences |

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
  - after natural Home Scene activation, Home may show lightweight cutover context that the user's submitted/default Home Scene is now active and the former proxy can remain an Away Scene/listening context where supported.
  - any former-proxy saved context must not reappear as a Home Scene roller item unless it is also a registered/resolvable current-city music-community preference.
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
- Continue the Music-Community Preference Contract runtime path: profile UI integration, Plot/Home roller consumption, unresolved-profile visibility outside the roller, and GPS voting scope across resolvable registered preferences.
- Implement the Registrar/source activation workflow and artist/source concentration metric path for splitting a new active city-tier Home Scene from a major-node community.
- Lock Home dashboard tooltip copy for users whose submitted/GPS city differs from their assigned active Home Scene.
- Implement cutover notification/Away Scene preservation using the Activation Notification and Former Proxy / Away Scene contracts above.
- Lock final UI placement/copy and any notification/saved-scene persistence model before adding stored notification records.
- Sect uprising motion mechanics remain governed by `docs/specs/DECISIONS_REQUIRED.md`.

## References

- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`

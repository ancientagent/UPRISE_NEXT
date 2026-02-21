# Identity, Roles, and Capabilities

**ID:** `USER-IDENTITY`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-21`

## Overview & Purpose
Defines identity and permission boundaries for UPRISE. Canon model: one base `User` identity, linked Artist/Band entities registered via the Registrar, and additive role capabilities where explicitly defined (for example Promoter).

## User Roles & Use Cases
- **Listener (base user):** default account type; can participate in Home Scene and as Visitor elsewhere.
- **Artist/Band entity (Registrar-registered):** a separate music entity linked to one or more Users for upload/management workflows.
- **Promoter capability (additive, V1 target):** enables event and promotion workflows through named Production identities.
- **Business capabilities (V2+):** merchant/venue style economic surfaces.
- **Super Admin:** platform operations and moderation authority.
- **Visitor state:** listener in a non-Home Scene with non-civic permissions only.

## Functional Requirements
- Every person has one `User` identity.
- Artist/Band accounts are separate entities linked to User identities (many-to-many management model).
- Home Scene affiliation and GPS verification determine voting eligibility; GPS gates voting only.
- Capability expansion is additive permissions attached to existing user identity.
- Visitor state may listen and use non-civic actions; Visitor state cannot vote.
- Role/capability language in docs and API must remain aligned to Registrar + linked-entity canon.

### Implemented Now
- Auth and identity:
  - `POST /auth/register`
  - `POST /auth/login`
  - JWT-based authenticated access on protected routes.
- User listing/profile reads:
  - `GET /users`
  - `GET /users/:id`
  - `GET /users/:id/profile`
  - `POST /users/me/collection-display`
  - Transitional bridge: user read payloads now include `hasArtistBand` derived from canonical membership graph.
  - Legacy `isArtist` and `isArtistTransitional` are removed from user detail/profile response contracts.
- Schema fields currently present:
  - `User.gpsVerified`
  - `User.collectionDisplayEnabled`
  - home-scene fields (`homeSceneCity`, `homeSceneState`, `homeSceneCommunity`, `homeSceneTag`)
- Canonical Artist/Band identity foundation (slice 1, additive/non-breaking):
  - `ArtistBand` model added for registrar-linked music entities.
  - `ArtistBandMember` model added for many-to-many User<->Artist/Band management.
  - Transitional legacy marker removed in slice 33 (`User.isArtist` dropped from persistence).
- Read-only Artist/Band API surface (auth required):
  - `GET /artist-bands/:id`
  - `GET /artist-bands?userId=:id` (defaults to authenticated user when omitted)
- Registrar submission primitive for Artist/Band identity onboarding:
  - `POST /registrar/artist` creates a scene-scoped registrar entry (does not yet create ArtistBand row directly).
  - Requires GPS-verified submitter in Home Scene.
  - Captures proposed member roster (`name`, `email`, `city`, `instrument`) for registrar processing.
  - `GET /registrar/artist/entries` lists submitter-owned Artist/Band registrar entries + invite/member summary counts, including materialized canonical entity summary when linked.
  - `POST /registrar/artist/:entryId/materialize` finalizes canonical `ArtistBand` + owner membership from submitter-owned registration entry.
  - `POST /registrar/artist/:entryId/dispatch-invites` queues pending non-platform member invites with tokenized claim payload.
  - `POST /registrar/artist/:entryId/sync-members` links eligible registrar members into canonical `ArtistBandMember` rows.
  - `GET /registrar/artist/:entryId/invites` returns invite roster and status summary for submitter tracking.
- Registrar submission primitive for Promoter capability onboarding:
  - `POST /registrar/promoter` creates a scene-scoped promoter registration entry with named production identity payload.
  - Entry is Home Scene-scoped and does not grant promoter capability by itself.
  - `GET /registrar/promoter/entries` lists submitter-owned promoter registration entries with scene context + submission payload summary.
- Invite claim account bootstrap (slice 6):
  - `POST /auth/invite-preview` provides prefill context (member + scene/community) for invited users before claim.
  - `POST /auth/register-invite` creates account from invite token for non-platform registrar members.
  - Claim flow sets Home Scene defaults from registrar scene context (`homeSceneCity`, `homeSceneState`, `homeSceneCommunity`).
  - Claimed accounts start with `gpsVerified = false` (GPS still required for voting validation).
- Web registrar entry + Artist/Band action intake (slice 10):
  - Plot now exposes Registrar entrypoint action (`Open Registrar`) from Home Scene civic surface.
  - `/registrar` web route includes explicit `Band / Artist Registration` action selection.
  - Registration form submits to `POST /registrar/artist` with required roster fields:
    - `name`, `email`, `city`, `instrument`.
  - Client flow resolves Home Scene ID from canonical tuple and blocks submit until `gpsVerified` is true.
- Registrar registration tracking + follow-up actions (slice 12):
  - `/registrar` now loads submitter-owned entries via `GET /registrar/artist/entries`.
  - UI supports explicit follow-up actions on submitted entries:
    - materialize entity,
    - queue member invites,
    - inspect invite status summary.
  - All actions remain API-backed and submitter-scoped.
- Registrar web canonical membership sync action (slice 14):
  - `/registrar` status panel includes explicit `Sync Eligible Members` action for materialized entries.
  - Calls `POST /registrar/artist/:entryId/sync-members` to attach eligible registrar members to canonical entity membership.

### Deferred (Not Implemented Yet)
- Promoter capability grants.
- Business profile role surfaces.
- Capability grant audit log and admin role-management APIs.

### Promoter Policy (Locked Direction)
- Base user identity remains listener/supporter/fan.
- Promoter is an additive capability, not a separate account tree.
- Web account management stays unified across listener/artist/promoter capability holders.
- Promoters operate named Production entities for public promotional actions.
- Promoters can:
  - create/manage events (via Print Shop flow),
  - publish promotional messages publicly as production identity,
  - manage promoter web profile.

## Non-Functional Requirements
- Clarity: role semantics must remain unambiguous in docs and API contracts.
- Security: auth routes hash passwords and enforce credential validation.
- Consistency: capability behavior must align with canon terminology.

## Architectural Boundaries
- Canon identity semantics are sourced from `docs/canon/`.
- Web tier must consume role/capability changes through API only.
- Capabilities cannot be used to bypass civic limits (for example, voting boundaries).

## Data Models & Migrations
### Prisma Models
- `User`
  - Identity and auth fields (`email`, `username`, `displayName`, `password`)
  - Verification fields (`gpsVerified`, `isVerified`)
  - Home-scene affinity fields
- `ArtistBand`
  - Canonical artist/band identity entity
  - Registrar linkage placeholder (`registrarEntryRef`) for registrar workflow handoff
  - Scene scope linkage (`homeSceneId`) and creator linkage (`createdById`)
- `ArtistBandMember`
  - User membership rows for Artist/Band management relationships
  - Unique membership per pair (`artistBandId`, `userId`)
- `RegistrarEntry`
  - Tracks Home Scene-scoped registration submissions for civic activation workflows
  - Stores submission payload/state for registrar-mediated Artist/Band intake
- `RegistrarArtistMember`
  - Stores registrar-submitted artist/band member records and invite delivery state
  - Distinguishes existing platform users vs non-platform invitees (`inviteStatus`)
- `RegistrarInviteDelivery`
  - Stores queued invite delivery payloads for non-platform band members
  - Delivery status state machine (`queued`, `sent`, `failed`)

### Migrations
- `20260216004000_add_user_home_scene_and_track_engagement` (home-scene affinity and GPS-related user fields)
- `20260220130000_add_artist_bands_identity` (adds `artist_bands` + `artist_band_members`; leaves `User.isArtist` intact)
- `20260220141000_add_registrar_entries` (adds `registrar_entries` for Artist/Band registration submissions)
- `20260220170000_add_registrar_artist_members` (adds `registrar_artist_members` for registration member roster + invite state)
- `20260220183000_add_registrar_invite_delivery` (adds invite token fields + `registrar_invite_deliveries` queue persistence)
- `20260221220000_drop_user_is_artist` (removes legacy `users.isArtist` transitional marker)

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | none | Create base user identity |
| POST | `/auth/invite-preview` | none | Preview invited member + scene context prior to invite claim registration |
| POST | `/auth/register-invite` | none | Create invited registrar-member account using invite token |
| POST | `/auth/login` | none | Authenticate and return tokens |
| GET | `/users` | required | List users (paginated) |
| GET | `/users/:id` | required | Fetch a user profile |
| GET | `/users/:id/profile` | required | Fetch user profile + collection shelves (respect visibility rules) |
| POST | `/users/me/collection-display` | required | Set profile collection visibility toggle |
| GET | `/artist-bands/:id` | required | Fetch canonical Artist/Band entity details + membership |
| GET | `/artist-bands` | required | List Artist/Band entities managed by a user (`userId` query or self default) |
| POST | `/registrar/artist` | required | Submit Home Scene-scoped Artist/Band registration entry |
| GET | `/registrar/artist/entries` | required | List submitter-owned Artist/Band registrar entries + invite/member summary counts |
| POST | `/registrar/artist/:entryId/materialize` | required | Materialize registration into canonical Artist/Band entity (submitter-owned) |
| POST | `/registrar/artist/:entryId/dispatch-invites` | required | Queue invite deliveries for pending non-platform members |
| POST | `/registrar/artist/:entryId/sync-members` | required | Sync eligible registrar members into canonical Artist/Band membership graph |
| GET | `/registrar/artist/:entryId/invites` | required | Read invite roster + status summary for submitter-owned registration |
| GET | `/registrar/promoter/entries` | required | List submitter-owned promoter registration entries + scene context |

### Request/Response
- `POST /auth/register` and `POST /auth/login` use shared schemas from `@uprise/types`.
- Protected routes require JWT bearer token.
- Transitional read compatibility:
  - legacy `isArtist` and transitional alias `isArtistTransitional` are removed from user detail/profile response contracts.
  - shared cross-app `User` type contract no longer includes `isArtist`.
  - canonical identity linkage remains `hasArtistBand`.
  - `GET /users/:id` and `GET /users/:id/profile` return `managedArtistBands` summary list for canonical linked-entity rendering, including per-entity `membershipRole`.
- Error behavior:
  - `401` for invalid credentials / missing auth
  - `403` for forbidden actions when role/civic constraints apply (as new capability routes are added)
  - `POST /registrar/artist` returns `403` when submitter is not GPS-verified or is outside Home Scene scope.

## Web UI / Client Behavior
- Onboarding establishes Home Scene and then optional GPS verification for voting rights.
- Plot provides explicit Registrar navigation (`Open Registrar`) for civic registration actions.
- Registrar web flow supports explicit Artist/Band registration submission from listener identity.
- Registrar web flow includes submitter-owned registration status tracking and explicit follow-up actions only.
- User profile web surface displays canonical linked Artist/Band entities via existing `/artist-bands?userId=:id` read API.
- Capability management UI beyond base listener flows is deferred.

## Acceptance Tests / Test Plan
- Register/login succeeds with valid payload and hashed-password compare.
- Invalid login credentials return unauthorized.
- Protected `/users` routes reject unauthenticated requests.
- Home Scene + GPS flow controls voting eligibility without disabling non-civic participation.

## Future Work & Open Questions
- Expand canonical Artist/Band implementation from read-only foundation to full registrar-gated create/update lifecycle.
- Add registrar write flows so Artist/Band records are created only via Registrar submissions.
- Add outbound delivery provider pipeline for queued `pending_email`/`queued` member invites.
- See phased execution note: `docs/handoff/2026-02-21_artist-band-identity-remaining-phased-plan.md`.
- Define Promoter capability registration and code exchange flow.
- Define business capability model for Promotions/Print Shop workflows.

## References
- `docs/canon/Master Identity and Philosohpy Canon.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`

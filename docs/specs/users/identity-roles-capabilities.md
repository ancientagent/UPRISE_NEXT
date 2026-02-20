# Identity, Roles, and Capabilities

**ID:** `USER-IDENTITY`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-20`

## Overview & Purpose
Defines identity and permission boundaries for UPRISE. The canonical rule is one user identity with additive capabilities; role/capability expansion must not split civic identity from participation.

## User Roles & Use Cases
- **Listener (base user):** default account type; can participate in Home Scene and as Visitor elsewhere.
- **Artist capability (additive):** enables contribution-side tooling without creating a second user account.
- **Promoter capability (additive, V1 target):** enables event and promotion workflows through named Production identities.
- **Business capabilities (V2+):** merchant/venue style economic surfaces.
- **Super Admin:** platform operations and moderation authority.
- **Visitor state:** listener in a non-Home Scene with non-civic permissions only.

## Functional Requirements
- Every person has one `User` identity.
- Home Scene affiliation and GPS verification determine voting eligibility; GPS gates voting only.
- Capability expansion is additive permissions attached to existing user identity.
- Visitor state may listen and use non-civic actions; Visitor state cannot vote.
- Role/capability language in docs and API must not imply separate listener-vs-artist account trees.

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
- Schema fields currently present:
  - `User.isArtist`
  - `User.gpsVerified`
  - `User.collectionDisplayEnabled`
  - home-scene fields (`homeSceneCity`, `homeSceneState`, `homeSceneCommunity`, `homeSceneTag`)

### Deferred (Not Implemented Yet)
- Artist/Band entity model + membership model.
- Promoter registration flow and capability grants.
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
  - Capability/verification fields (`isArtist`, `gpsVerified`, `isVerified`)
  - Home-scene affinity fields

### Migrations
- `20260216004000_add_user_home_scene_and_track_engagement` (home-scene affinity and GPS-related user fields)

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | none | Create base user identity |
| POST | `/auth/login` | none | Authenticate and return tokens |
| GET | `/users` | required | List users (paginated) |
| GET | `/users/:id` | required | Fetch a user profile |
| GET | `/users/:id/profile` | required | Fetch user profile + collection shelves (respect visibility rules) |
| POST | `/users/me/collection-display` | required | Set profile collection visibility toggle |

### Request/Response
- `POST /auth/register` and `POST /auth/login` use shared schemas from `@uprise/types`.
- Protected routes require JWT bearer token.
- Error behavior:
  - `401` for invalid credentials / missing auth
  - `403` for forbidden actions when role/civic constraints apply (as new capability routes are added)

## Web UI / Client Behavior
- Onboarding establishes Home Scene and then optional GPS verification for voting rights.
- Capability management UI beyond base listener flows is deferred.

## Acceptance Tests / Test Plan
- Register/login succeeds with valid payload and hashed-password compare.
- Invalid login credentials return unauthorized.
- Protected `/users` routes reject unauthenticated requests.
- Home Scene + GPS flow controls voting eligibility without disabling non-civic participation.

## Future Work & Open Questions
- Define Artist/Band capability persistence and membership graph.
- Define Promoter capability registration and code exchange flow.
- Define business capability model for Promotions/Print Shop workflows.

## References
- `docs/canon/Master Identity and Philosohpy Canon.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`

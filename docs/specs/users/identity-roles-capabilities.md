# Identity, Roles, and Capabilities

**ID:** `USER-IDENTITY`  
**Status:** `draft`  
**Owner:** `platform`  
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines the account model and role/capability structure for UPRISE. A Listener account is the core identity; additional capabilities allow users to operate artist, band, and business entities without creating separate user accounts.

## User Roles & Use Cases
- **Listener:** participates in a Home Scene, listens, engages, and votes (if GPS verified).
- **Artist capability:** enables a Listener to register and manage one or more Artist/Band profiles.
- **Business roles:** Promoter (V1), Merchant (V2), Venue (V2) for event and offer functions.
- **Super Admin:** platform-level control and moderation.
- **Visitor:** Listener in a non‑Home Scene with non‑civic permissions only.

## Functional Requirements
- Every person has one Listener account (core identity).
- A Listener may unlock **Artist capability** to register and manage Artist/Band profiles.
- Artist/Band profiles are entities registered by a Listener; they are not separate user accounts.
- A Listener may link to multiple Artist/Band profiles; multiple Listeners may link to the same Artist/Band profile.
- Artist capability includes upload and catalog management in the WebApp.
- Rotation slots:
  - Standard Artist capability: **1 active slot**.
  - Premium Artist capability (Play Pass): **3 active slots**.
- **Locally Affiliated** status is determined by Home Scene selection. GPS verification gates **voting only**.
- **Visitor** capabilities are limited to non‑civic actions (Listen, ADD, FOLLOW, BLAST, SKIP, REPORT).

## Non-Functional Requirements
- Clarity: role language must not imply separate user accounts.
- Consistency: role terms match canon definitions.
- Safety: voting remains limited to GPS‑verified Home Scene listeners.

## Architectural Boundaries
- Canon definitions come from `docs/canon/`.
- Role descriptions must not introduce new structural terms outside canon.
- Web tier must use API endpoints for role and capability changes.

## Data Models & Migrations
### Prisma Models
- User (Listener identity)
- ArtistProfile (Artist/Band entity)
- ArtistMembership (many‑to‑many between Users and ArtistProfiles)
- BusinessProfile (Promoter/Merchant/Venue roles)
- Role/Capability flags (per user)
- HomeSceneId, GPSVerified status

### Migrations
- TBD (as models are finalized)

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | none | Create Listener account |
| POST | `/auth/login` | none | Login |
| POST | `/artists` | required | Create Artist/Band profile |
| GET  | `/artists/:id` | required | Fetch Artist/Band profile |
| POST | `/artists/:id/members` | required | Link Listener to Artist/Band |
| POST | `/businesses` | required | Create Business profile |
| GET  | `/businesses/:id` | required | Fetch Business profile |

### Request/Response
- Schemas defined in `packages/types` (TBD)
- Error codes: 401/403 for auth and permission violations

## Web UI / Client Behavior
- Listener onboarding is mobile‑first.
- Artist/Band management is WebApp‑first.
- Capability upgrade surfaces clearly separate **User identity** from **Artist/Band entity** management.
- Role‑specific dashboards show only permitted actions.

## Acceptance Tests / Test Plan
- Verify a Listener can create and manage Artist/Band profiles.
- Verify multiple users can be linked to one Artist/Band profile.
- Verify voting is blocked without GPS verification.
- Verify Visitor permissions exclude voting.

## Future Work & Open Questions
- Formalize business profile permissions and tiers (Promoter/Merchant/Venue).
- Finalize role/capability storage in Prisma schema.
- Define audit logs for role changes.

## References
- `docs/canon/Master Identity and Philosohpy Canon.md`
- `docs/canon/Master Glossary Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`

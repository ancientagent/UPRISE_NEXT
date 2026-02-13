# <Spec Title>

**ID:** `<ID>` (e.g., `T5`, `AUTH-ONBOARDING`)  
**Status:** `draft | active | deprecated`  
**Owner:** `<team/agent>`  
**Last Updated:** `<YYYY-MM-DD>`

## Overview & Purpose
- What this feature/system change does.
- Why it exists and what problems it solves.
- Links to any relevant blueprint(s) or architecture docs.

## User Roles & Use Cases
- Roles affected (listener, artist, admin, etc.)
- Key user stories / flows

## Functional Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Non-Functional Requirements
- Performance:
- Security:
- Reliability:
- Observability:
- Error handling:

## Architectural Boundaries
- Web tier: no DB access/secrets in `apps/web` (see `apps/web/WEB_TIER_BOUNDARY.md`).
- Contracts: shared types live in `packages/types` and should remain backwards-compatible where possible.
- Data tier: PostGIS queries must be documented and tested (see `docs/RUNBOOK.md`, `docs/PROJECT_STRUCTURE.md`).
- Environment variables: document required env vars and which tier consumes them.

## Data Models & Migrations
### Prisma Models
- Model(s) added/changed:
- Relationships:
- Indexes / constraints:

### Migrations
- Migration name(s):
- Backfill strategy (if applicable):
- Rollback considerations:

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET    | `/api/...` | required/optional/none | ... |

### Request/Response
- Request schema:
- Response schema:
- Error codes:

## Web UI / Client Behavior
- Routes/pages:
- Components:
- Data fetching (cache/invalidations):
- Real-time behavior (if applicable):
- Loading/empty/error states:

## Acceptance Tests / Test Plan
- Unit tests:
- Integration tests:
- E2E tests (if applicable):
- Manual verification checklist:

## Future Work & Open Questions
- Follow-ups:
- Known tech debt:
- Decisions to revisit:

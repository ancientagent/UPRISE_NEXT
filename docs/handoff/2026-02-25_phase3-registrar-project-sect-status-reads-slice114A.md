# 2026-02-25 — Phase 3 Slice 114A: Registrar Project/Sect Status Read Surfaces

## Scope
- Add submitter-owned status list/detail read endpoints for project registrations and sect motions.
- Keep slice additive and API-only (no schema migration, no UI action changes).

## Implemented
- API controller routes in `apps/api/src/registrar/registrar.controller.ts`:
  - `GET /registrar/project/entries`
  - `GET /registrar/project/:entryId`
  - `GET /registrar/sect-motion/entries`
  - `GET /registrar/sect-motion/:entryId`
- Service read methods in `apps/api/src/registrar/registrar.service.ts`:
  - `listProjectRegistrations`, `getProjectRegistration`
  - `listSectMotionRegistrations`, `getSectMotionRegistration`
- Guardrails:
  - submitter-only reads (`createdById` ownership)
  - strict type checks (`project_registration`, `sect_motion`)
  - not-found handling
- Payload normalization:
  - `projectName` normalized to `string | null`
  - sect-motion payload normalized to object shape

## Tests Added
- `apps/api/test/registrar.controller.test.ts`
  - project list/detail success + propagated error coverage
  - sect-motion list/detail success + propagated error coverage
- `apps/api/test/registrar.service.test.ts`
  - project list/detail success + ownership/type/not-found guards
  - sect-motion list/detail success + ownership/type/not-found guards

## Docs Updated
- `docs/specs/system/registrar.md`
- `docs/CHANGELOG.md`

## Risk and Rollback
- Risk: low (read-only API additions, no schema changes).
- Rollback: revert the slice commit; no migration rollback required.

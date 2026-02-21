# Artist/Band Identity Slice 4 Handoff: Registrar Entry Materialization (2026-02-20)

**Author:** Codex (GPT-5)  
**Scope:** Add explicit materialization step from submitted registrar entry to canonical Artist/Band entity.

## Canon/Spec Authorization
- `docs/canon/Master Narrative Canon.md`
  - `5.2 Artist / Band Entity`
  - `7.4 Registrable Actions (V1)`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`

## Implemented
- Endpoint: `POST /registrar/artist/:entryId/materialize`
- Service method: `materializeArtistBandRegistration(userId, entryId)`
- Behavior:
  - Requires registrar entry type `artist_band_registration`.
  - Requires submitter ownership (`createdById` must match authenticated user).
  - Creates `ArtistBand` from registrar payload (`name`, `slug`, `entityType`).
  - Creates owner membership row (`ArtistBandMember.role = owner`).
  - Updates registrar entry to `status = materialized` and links `artistBandId`.
  - Idempotent when already materialized.

## Test Coverage
- `apps/api/test/registrar.service.test.ts`
  - materialize success path,
  - idempotent already-linked path,
  - non-owner rejection path.

## Out of Scope
- Staff/admin approval workflow.
- Materialization policy beyond submitter-owned registrations.
- Email delivery/claim completion flow (handled in separate slices).

## Files
- `apps/api/src/registrar/registrar.controller.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/test/registrar.service.test.ts`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/CHANGELOG.md`

# Artist/Band Identity Slice 2 Handoff: Registrar Submission Primitives (2026-02-20)

**Author:** Codex (GPT-5)  
**Scope:** Add canonical Registrar submission primitives for Artist/Band onboarding; keep implementation additive and non-breaking.

## Canon/Spec Authorization
- `docs/canon/Master Narrative Canon.md`
  - `7.4 Registrable Actions (V1)`: Artist/Band registration requires Registrar submission.
  - `7.3 Registrar Scope`: Registrar is Home Scene-bound.
- `docs/specs/system/registrar.md` (`SYS-REGISTRAR`)
- `docs/specs/users/identity-roles-capabilities.md` (`USER-IDENTITY`)

## Implemented
- Prisma model:
  - `RegistrarEntry` in `apps/api/prisma/schema.prisma`
- Migration:
  - `apps/api/prisma/migrations/20260220141000_add_registrar_entries/migration.sql`
- API module:
  - `apps/api/src/registrar/registrar.module.ts`
  - `apps/api/src/registrar/registrar.controller.ts`
  - `apps/api/src/registrar/registrar.service.ts`
  - `apps/api/src/registrar/dto/registrar.dto.ts`
  - `apps/api/src/app.module.ts` (module wiring)
- Endpoint:
  - `POST /registrar/artist`

## Behavior
- Creates `registrar_entries` row with:
  - `type = artist_band_registration`
  - `status = submitted`
  - scene + user linkage
  - payload `{ name, slug, entityType }`
- Enforces Home Scene civic boundary:
  - city-tier scene only,
  - scene must match authenticated user's Home Scene (`city/state/musicCommunity`).

## Out of Scope (intentionally not done)
- Direct ArtistBand creation from registrar submission.
- Promoter/project/sect-motion registrar endpoints.
- Membership mutation workflows.
- `User.isArtist` deprecation/removal.

## Risks
- Home Scene matching currently compares normalized text fields (`city/state/musicCommunity`), so stricter identity linkage by persistent home scene id remains a future hardening step.
- Submission payload schema is intentionally minimal for this slice; future moderation/approval flows may require richer fields.

## Rollback
- Additive rollback path:
  - disable `/registrar/artist` route/module,
  - leave `registrar_entries` unused,
  - or drop `registrar_entries` table if full rollback required.

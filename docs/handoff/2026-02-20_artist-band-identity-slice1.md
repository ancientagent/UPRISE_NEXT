# Artist/Band Identity Slice 1 Handoff (2026-02-20)

**Author:** Codex (GPT-5)  
**Scope:** Canonical Artist/Band identity foundation replacing transitional `User.isArtist` behavior in phased, non-breaking slices.

## Canon Evidence Anchors
- `docs/canon/Master Narrative Canon.md`:
  - `5.2 Artist / Band Entity`: Artist/Band is a registered entity operated by one or more Users.
  - `7.4 Registrable Actions (V1)`: Artist/Band creation flows through Registrar.
- `docs/specs/users/identity-roles-capabilities.md` (`USER-IDENTITY`)
- `docs/specs/system/registrar.md` (`SYS-REGISTRAR`)

## Phased Implementation Plan

### Slice 1 (this session)
- Add canonical persistence primitives:
  - `ArtistBand`
  - `ArtistBandMember`
- Keep `User.isArtist` transitional and unchanged.
- Add read-only API retrieval surface for canonical entity access.
- Add unit tests for retrieval behavior.

### Slice 2
- Add registrar submission write path for Artist/Band creation (Registrar-gated only).
- Add membership management rules (owner/manager role constraints, audit fields).
- Backfill strategy:
  - identify `User.isArtist = true` users without ArtistBand membership,
  - map via controlled script or Registrar-assisted claim workflow,
  - emit migration report.

### Slice 3
- Move writer/consumer services to canonical ArtistBand checks.
- Deprecate `User.isArtist` reads in API contracts.
- Remove `User.isArtist` from schema only after compatibility window + call-site audit.

## Migration Strategy (Non-Breaking)
- Migration is additive-only in slice 1:
  - creates `artist_bands`
  - creates `artist_band_members`
- No destructive changes.
- No behavior changes to existing auth/user/profile endpoints.
- `User.isArtist` remains for backward compatibility.

## Risks
- **Dual-source identity drift:** callers may continue relying on `User.isArtist` while canonical entities become source-of-truth.
- **Registrar linkage ambiguity:** `registrarEntryRef` is a placeholder until RegistrarEntry model/write flow is implemented.
- **Data integrity during migration:** future backfill could create duplicate or orphaned membership rows without strict idempotency constraints.

## Rollback Strategy
- Slice 1 rollback is straightforward because changes are additive:
  - disable new `/artist-bands` API routes,
  - leave new tables unused,
  - retain all existing user behavior (`User.isArtist`).
- If schema rollback is required, drop `artist_band_members` then `artist_bands` in reverse dependency order.

## Implemented in Slice 1
- Prisma:
  - `apps/api/prisma/schema.prisma`
  - `apps/api/prisma/migrations/20260220130000_add_artist_bands_identity/migration.sql`
- API read surface:
  - `apps/api/src/artist-bands/artist-bands.module.ts`
  - `apps/api/src/artist-bands/artist-bands.service.ts`
  - `apps/api/src/artist-bands/artist-bands.controller.ts`
  - `apps/api/src/app.module.ts` (module wiring)
- Unit tests:
  - `apps/api/test/artist-bands.service.test.ts`

## Docs Updated
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/CHANGELOG.md`

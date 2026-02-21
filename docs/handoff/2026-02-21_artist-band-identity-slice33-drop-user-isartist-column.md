# 2026-02-21 — Artist/Band Identity Slice 33 (Drop User.isArtist Column)

## Scope
- Execute final destructive persistence cleanup for legacy artist marker.
- Remove `User.isArtist` from Prisma schema and add explicit drop-column migration.
- Keep canonical Artist/Band identity model as sole source.

## Implemented
- Prisma schema: `apps/api/prisma/schema.prisma`
  - Removed `User.isArtist` field.
- Migration: `apps/api/prisma/migrations/20260221220000_drop_user_is_artist/migration.sql`
  - Drops `users.isArtist` column.
- Client regen:
  - Ran `pnpm --filter api prisma:generate` after schema update.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
  - docs lint + canon lint passed.
- `pnpm run infra-policy-check`
  - web-tier contract guard passed with no violations.
- `pnpm run report:isartist-consumers:strict`
  - strict report passed; `isArtist` references in scanned code: `0`.
- `pnpm --filter api test -- users.profile.collection.test.ts`
  - 1 suite passed, 4 tests passed.
- `pnpm --filter api typecheck`
  - `tsc --noEmit` passed.
- `pnpm --filter web typecheck`
  - `tsc --noEmit` passed.

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/prisma/schema.prisma apps/api/prisma/migrations/20260221220000_drop_user_is_artist/migration.sql docs/specs/users/identity-roles-capabilities.md docs/specs/system/registrar.md docs/CHANGELOG.md docs/handoff/2026-02-21_artist-band-identity-slice33-drop-user-isartist-column.md docs/handoff/README.md docs/handoff/2026-02-21_artist-band-identity-remaining-phased-plan.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Restore `User.isArtist` in Prisma schema and add compensating migration to recreate column with default value.
- Re-run Prisma generate and restore any dependent response mapping only if needed.

## Out of Scope Kept
- No registrar flow or web action changes.
- No non-identity schema changes.

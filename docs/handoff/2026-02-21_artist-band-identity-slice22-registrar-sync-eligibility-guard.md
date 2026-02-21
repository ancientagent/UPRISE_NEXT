# 2026-02-21 — Artist/Band Identity Slice 22 (Registrar Sync Eligibility Guard)

## Scope
- Guard `Sync Eligible Members` action on explicit eligibility counts.
- Add focused helper tests.

## Implemented
- Web helper update:
  - `apps/web/src/lib/registrar/entryStatus.ts`
  - added `getRegistrarSyncEligibleCount(existingUserCount, claimedCount)`.
- Tests:
  - `apps/web/__tests__/registrar-entry-status.test.ts`
  - added sync-eligible count assertions.
- Registrar page:
  - `apps/web/src/app/registrar/page.tsx`
  - `Sync Eligible Members` button now disabled when eligible count is zero,
  - button label includes current eligible count,
  - entry summary now displays `existing` count.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- registrar-entry-status.test.ts registrar-artist-registration.test.ts artist-band-labels.test.ts`
- `pnpm --filter web typecheck`

## Out of Scope Kept
- No backend/schema changes.
- No new registrar API endpoints.
- No destructive identity migration.

# 2026-02-21 — Artist/Band Identity Slice 18 (User Profile Canonical Entity Read)

## Scope
- Extend web user profile to show canonical linked Artist/Band entities.
- Reuse existing read API only.

## Implemented
- Updated `apps/web/src/app/users/[id]/page.tsx`:
  - now calls `GET /artist-bands?userId=:id` alongside profile read,
  - renders read-only linked entity list (`name`, `entityType`, `slug`).
- Added helper:
  - `apps/web/src/lib/registrar/artistBandLabels.ts`
- Added unit test:
  - `apps/web/__tests__/artist-band-labels.test.ts`

## Canon/Spec Alignment
- Implements canonical linked-entity visibility from existing Registrar-linked Artist/Band model.
- Read-only; no new authority or workflow actions introduced.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- artist-band-labels.test.ts registrar-entry-status.test.ts registrar-artist-registration.test.ts`
- `pnpm --filter web typecheck`

## Out of Scope Kept
- No backend/schema changes.
- No registrar flow behavior changes.
- No destructive identity deprecation step.

# 2026-02-21 — Artist/Band Identity Slice 19 (User Profile Linked-Entity Read Resilience)

## Scope
- Keep `/users/[id]` profile usable when canonical linked-entity read call fails.
- Web-only resilience update.

## Implemented
- Updated `apps/web/src/app/users/[id]/page.tsx`:
  - profile read (`/users/:id/profile`) remains primary blocking call,
  - linked-entity read (`/artist-bands?userId=:id`) is now non-blocking,
  - linked-entity panel surfaces warning message if read fails,
  - profile rendering remains available on linked-entity fetch failures.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- artist-band-labels.test.ts registrar-entry-status.test.ts registrar-artist-registration.test.ts`
- `pnpm --filter web typecheck`

## Out of Scope Kept
- No backend/schema changes.
- No registrar flow changes.
- No new user-facing actions.

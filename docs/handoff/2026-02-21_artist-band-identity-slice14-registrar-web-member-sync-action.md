# 2026-02-21 — Artist/Band Identity Slice 14 (Registrar Web Member Sync Action)

## Scope
- Add web action for the new canonical member-sync primitive.
- Keep changes web-only + docs/handoff updates.

## Implemented
- Updated `apps/web/src/app/registrar/page.tsx`:
  - Added `Sync Eligible Members` action per entry in registrar status panel.
  - Action calls `POST /registrar/artist/:entryId/sync-members`.
  - Button is enabled only when registration is materialized (`artistBandId` present).
  - Displays summary message (`created/eligible/skipped`) after sync.

## Canon/Spec Alignment
- Keeps member linking explicit and submitter-driven.
- Uses only existing, authorized registrar API surfaces.
- No new role/capability semantics introduced.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- registrar-artist-registration.test.ts registrar-entry-status.test.ts`
- `pnpm --filter web typecheck`

## Out of Scope Kept
- No backend/schema changes.
- No invite provider integration.
- No `User.isArtist` removal.

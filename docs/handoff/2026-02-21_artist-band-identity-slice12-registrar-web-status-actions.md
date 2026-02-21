# 2026-02-21 — Artist/Band Identity Slice 12 (Registrar Web Status + Actions)

## Scope
- Extend `/registrar` web page with submitter-owned registration tracking.
- Expose explicit follow-up actions using already-implemented registrar endpoints.
- Keep backend/schema unchanged.

## Implemented
- Web page updates: `apps/web/src/app/registrar/page.tsx`
  - Loads submitter-owned entries from `GET /registrar/artist/entries`.
  - Shows per-entry status + scene + member/invite summary counts.
  - Adds submitter actions for existing APIs:
    - `POST /registrar/artist/:entryId/materialize`
    - `POST /registrar/artist/:entryId/dispatch-invites`
    - `GET /registrar/artist/:entryId/invites`
- New web helper: `apps/web/src/lib/registrar/entryStatus.ts`
  - status label formatting
  - invite link payload defaults for dispatch action
- New unit tests: `apps/web/__tests__/registrar-entry-status.test.ts`

## Canon/Spec Alignment
- Keeps registrar behavior explicit-intent only (no automatic materialization/dispatch).
- Uses submitter-scoped read/write APIs; no authority model changes.
- Preserves Home Scene/GPS gate for initial registration submission.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- registrar-artist-registration.test.ts registrar-entry-status.test.ts`
- `pnpm --filter web typecheck`

## Out of Scope Kept
- No new API endpoint/schema/migration.
- No outbound email provider worker integration.
- No deprecation/removal of `User.isArtist`.
- No promoter/project/sect registrar flows.

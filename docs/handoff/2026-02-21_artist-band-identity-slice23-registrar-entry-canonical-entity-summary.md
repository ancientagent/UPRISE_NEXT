# 2026-02-21 — Artist/Band Identity Slice 23 (Registrar Entry Canonical Entity Summary)

## Scope
- Enrich registrar entry list read contract with materialized canonical entity summary.
- Render entity summary in registrar web status panel.

## Implemented
- API service update: `apps/api/src/registrar/registrar.service.ts`
  - `listArtistBandRegistrations` now includes `artistBand` summary (`id`, `name`, `slug`, `entityType`) when entry is linked.
- API test update: `apps/api/test/registrar.service.test.ts`
  - asserts `artistBand` summary presence in list response.
- Web update: `apps/web/src/app/registrar/page.tsx`
  - registrar entry cards now show materialized entity name/slug when present.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web test -- registrar-entry-status.test.ts registrar-artist-registration.test.ts artist-band-labels.test.ts`
- `pnpm --filter web typecheck`

## Out of Scope Kept
- No schema/migration changes.
- No new registrar endpoints.
- No destructive identity deprecation work.

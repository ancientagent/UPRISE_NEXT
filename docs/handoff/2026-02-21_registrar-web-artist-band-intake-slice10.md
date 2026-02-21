# 2026-02-21 — Registrar Web Artist/Band Intake (Slice 10)

## Scope
- Added explicit Registrar web entrypoint from Plot.
- Added explicit `Band / Artist Registration` action selection on `/registrar`.
- Added Artist/Band registrar intake form and API wiring to existing `POST /registrar/artist`.
- Preserved canonical constraints: Home Scene-bound resolution + GPS-verified submit requirement.

## Implemented
- Web route: `apps/web/src/app/registrar/page.tsx`
  - Action gate section with `Band / Artist Registration` option.
  - Form fields: `name`, `entityType`, optional slug input, member roster (`name`, `email`, `city`, `instrument`).
  - Home Scene ID resolution via `GET /communities/resolve-home` using onboarding tuple.
  - Client-side submit blocking when `gpsVerified` is false or Home Scene cannot be resolved.
  - Submits payload to existing registrar write endpoint: `POST /registrar/artist`.
- Plot navigation:
  - Added `Open Registrar` action in `apps/web/src/app/plot/page.tsx`.
- Web helper module:
  - `apps/web/src/lib/registrar/artistRegistration.ts`.
  - Includes slug normalization, empty-member factory, and payload builder.
- Unit tests:
  - `apps/web/__tests__/registrar-artist-registration.test.ts`.

## Canon/Spec Authorization
- `docs/canon/Master Narrative Canon.md` section 7.4 (`Artist / Band Registration` under Registrable Actions).
- `docs/specs/system/registrar.md` Web UI requirement: registrar entrypoint reachable from Plot civic surfaces.
- `docs/specs/users/identity-roles-capabilities.md` implemented registrar artist intake fields and GPS/Home Scene constraints.

## Validation
Commands run after changes:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- registrar-artist-registration.test.ts`
- `pnpm --filter web typecheck`

## Out of Scope Kept
- No new backend registrar behavior.
- No email worker/provider integration.
- No `User.isArtist` destructive migration.
- No Promoter/Project/Sect registrar flows.

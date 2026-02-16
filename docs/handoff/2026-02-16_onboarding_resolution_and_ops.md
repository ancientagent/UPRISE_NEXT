# 2026-02-16 — Onboarding Resolution + Ops Streamlining

## Scope

- Onboarding home-scene resolution and GPS voting eligibility behavior (canon-aligned).
- Repo ops streamlining: standard verify commands, branch-protection docs alignment, and Solutions playbooks.

## Changes

### Onboarding (API + Web)

- API: `apps/api/src/onboarding/onboarding.service.ts`
  - Home Scene resolution now resolves (or creates) a `Community` for `{city, state, musicCommunity}` and auto-joins the user.
  - Optional `tasteTag` is stored as tag association (Sect incubation behavior via tagging, not song migration).
  - GPS verification now gates voting eligibility (in-geofence only). Denial is allowed; user can still proceed.

- Web: `apps/web/src/app/onboarding/page.tsx`, `apps/web/src/store/onboarding.ts`
  - Review step now surfaces voting eligibility and a reason when GPS is denied/unverified.

### Web Build Reliability

- Removed network-dependent Google Fonts usage from `apps/web/src/app/layout.tsx` to prevent `next/font` build failures in restricted/DNS-flaky environments.

### Ops / Docs

- Added standardized commands:
  - `pnpm run verify` (docs:lint + infra-policy-check + typecheck)
  - `pnpm run verify:full` (verify + test + build)
- Updated `docs/RUNBOOK.md` branch-protection required checks section to match current minimal merge gate.
- Added Solutions playbooks:
  - `docs/solutions/WEB_TS6053_NEXT_TYPES.md`
  - `docs/solutions/NEXT_FONT_GOOGLE_FONTS_BUILD_FAIL.md`

## Verification

- `pnpm run docs:lint` (pass)
- `pnpm run infra-policy-check` (pass)
- `pnpm run typecheck` (pass)
- `pnpm --filter web build` (pass)

## Notes / Deferred

- Fair Play rotation, UPVOTE endpoints, and tier propagation remain deferred (requires founder lock inputs).
- API tests requiring Postgres/PostGIS are not run as part of `verify` (use `verify:full` with `DATABASE_URL` set).


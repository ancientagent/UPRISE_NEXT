# CI/CD Pipeline

**ID:** `T8`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2025-12-13`

## Overview & Purpose
The CI/CD pipeline ensures UPRISE_NEXT remains buildable, type-safe, and compliant with architectural boundaries. CI acts as the quality gate for merges to `main`/`develop` and enforces:
- linting and type safety,
- unit/integration tests,
- successful builds,
- web-tier contract guard checks,
- secrets scanning.

## User Roles & Use Cases
- **Contributors/agents:** validate changes before merge.
- **Maintainers:** rely on CI to prevent regressions and policy violations.
- **Security:** detect accidental secret commits early.

## Functional Requirements
- Run on PRs and pushes to `main`/`develop`.
- Install via pnpm with caching.
- Execute:
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm --filter <app> test` (matrix)
  - `pnpm --filter <app> build` (matrix)
  - `pnpm run infra-policy-check`
- Run secrets scanning (Gitleaks/TruffleHog + custom patterns).

## Non-Functional Requirements
- **Runtime:** keep CI under ~15 minutes for typical PRs.
- **Determinism:** use lockfile + cache to reduce variability.
- **Safety:** do not deploy production services from CI in this repo context.

## Architectural Boundaries
- CI enforces web-tier boundary via the contract guard (`T5`).
- Secrets must not be committed; `.env.example` should contain placeholders only.
- Production hosting is external (see `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`).

## Data Models & Migrations
- For API tests, CI provisions Postgres + PostGIS and applies Prisma migrations before running tests.

## Acceptance Tests / Test Plan
- Local equivalents (recommended before pushing):
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `DATABASE_URL=... pnpm run test`
  - `pnpm run build`
  - `pnpm run infra-policy-check`
- CI validation:
  - verify GitHub Actions workflows are green on PR.

## Success Metrics
- CI failures catch regressions before merge.
- Web-tier violations never land on `main`.
- Secrets scans produce zero findings on `main`.

## References
- `.github/workflows/ci.yml`
- `.github/workflows/infra-policy-check.yml`
- `.github/workflows/secrets-check.yml`
- `docs/RUNBOOK.md`
- `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`


# 2026-02-23 — Slice 85: DB QA Runner External-DB Fallback

## Scope
- Unblock DB QA execution in environments without Docker by allowing direct use of configured `DATABASE_URL`.
- Keep behavior additive and migration-free.

## Implementation
- `scripts/qa-db.sh`
  - Removed hard requirement on Docker/Docker Compose presence.
  - If Docker Compose is available, behavior is unchanged: spin up `postgres` service and wait for healthy.
  - If Docker Compose is unavailable, script now proceeds against existing `DATABASE_URL` target without orchestration.
  - DB migrate/test steps remain identical.

## Docs
- Updated:
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm run qa:phase2:db` — failed in this environment (`P1001` cannot reach `localhost:5432`)
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low (runner fallback behavior only).
- Rollback: single commit revert; migration-free.

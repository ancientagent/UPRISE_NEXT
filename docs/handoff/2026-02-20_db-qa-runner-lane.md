# DB QA Runner Lane (2026-02-20)

**Author:** Codex (GPT-5)

## Added Commands
- Root: `pnpm run qa:db`
- API: `pnpm --filter api test:db`

## What `qa:db` does
1. Ensures Docker + Compose are available.
2. Starts `postgres` service from `docker-compose.yml`.
3. Waits for `uprise_postgres` health to become `healthy`.
4. Sets default `DATABASE_URL` to local compose DB if unset.
5. Runs `pnpm --filter api exec prisma migrate deploy`.
6. Runs DB-dependent API test suite `communities.test.ts`.

## Notes
- Uses non-destructive startup (`docker compose up -d postgres`).
- Keeps container running after tests for faster repeated QA cycles.
- If Docker Desktop WSL integration is disabled, `qa:db` fails fast with actionable guidance.
- `apps/api/test/setup.ts` fallback `DATABASE_URL` was aligned to compose defaults to keep `pnpm run verify:full` consistent with the DB QA lane.

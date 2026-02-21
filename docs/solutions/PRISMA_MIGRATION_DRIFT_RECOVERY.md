# Prisma Migration Drift Recovery

## Problem
`prisma migrate deploy` fails with errors like:
- `P3018` + `relation "communities" does not exist`
- `P3009` failed migration marker present

This indicates migration history and actual schema are out of sync for the target database.

## Scope
Use this playbook for local/dev databases only unless you have explicit production recovery approval.

## Fast Local Recovery (Disposable DB)
From repo root:

```bash
# Ensure local postgres container is running

docker compose up -d postgres

# Reset and re-apply migrations against local docker db (5432)
DATABASE_URL="postgresql://uprise:uprise_dev_password@localhost:5432/uprise_dev?schema=public" pnpm --filter api exec prisma migrate reset --force
DATABASE_URL="postgresql://uprise:uprise_dev_password@localhost:5432/uprise_dev?schema=public" pnpm --filter api exec prisma migrate deploy
DATABASE_URL="postgresql://uprise:uprise_dev_password@localhost:5432/uprise_dev?schema=public" pnpm --filter api exec prisma migrate status
```

Expected result:
- migrations apply cleanly
- `Database schema is up to date!`

## Non-Disposable / Shared DB Recovery
Do **not** run `migrate reset`.

1. Check status:
```bash
pnpm --filter api exec prisma migrate status
```
2. Inspect failed migration and table state.
3. Use `prisma migrate resolve` only with explicit operator decision.
4. Prefer restore from known-good backup/snapshot if drift is severe.

## Common Cause in This Repo
- Running migrate commands in parallel against the same DB can reintroduce failed migration markers.
- Use sequential commands (`&&`) for reset/deploy/status.

## Related Commands
- Generate client after schema updates:
```bash
pnpm --filter api prisma:generate
```
- DB QA lane (if available on branch):
```bash
pnpm run qa:db
```

## Verification
After recovery, run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api typecheck`

# 2026-06-29 Hosted Migration Runner

## Status

Branch: `chore/hosted-migration-runner`
Base: `main` at `1f00549`

Runtime changed: no request/response behavior changed
Provider state changed: no
Database writes run: no
Secrets read or changed: no

## Summary

This slice closes the Fly API staging migration-runner gap found during the
2026-06-29 launch-readiness pass. The API production package now includes the
Prisma CLI, `apps/api` owns an explicit `migrate:deploy` script, and the repo has
a local production-deploy verification helper that fails if the production
package cannot run Prisma migrations.

## Scope & Deliverables

In scope:

- Add `pnpm --filter api run migrate:deploy` for Prisma deploy migrations.
- Include Prisma CLI in the API production dependency set so `pnpm deploy --prod`
  packages it into the Fly runtime image.
- Add `pnpm --filter api run verify:prod-migration-runner` to prove a temporary
  production deploy folder contains an executable Prisma CLI.
- Document the exact Fly staging command for hosted migrations.

Out of scope:

- Running migrations against staging or production.
- Changing Prisma schema or adding migrations.
- Changing provider secrets, Fly apps, Neon databases, or Vercel state.
- Authenticated onboarding/browser QA.

## Operational Command

Before running this against a hosted app, confirm the visible provider targets:

- Fly app: `uprise-api-staging`
- Neon database: `uprise_staging`

Then run:

```bash
~/.fly/bin/flyctl ssh console -a uprise-api-staging -C "/bin/sh -lc 'cd /app && ./node_modules/.bin/prisma migrate deploy --schema prisma/schema.prisma'"
```

For a read-only hosted check before applying pending migrations, use:

```bash
~/.fly/bin/flyctl ssh console -a uprise-api-staging -C "/bin/sh -lc 'cd /app && ./node_modules/.bin/prisma migrate status --schema prisma/schema.prisma'"
```

## Validation

Local verification run in this branch:

```bash
pnpm --filter api run verify:prod-migration-runner
pnpm --filter api build
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
pnpm run verify
```

Results:

- `verify:prod-migration-runner` passed and confirmed Prisma CLI `5.22.0` in a
  temporary API production deploy folder.
- `pnpm --filter api build` passed.
- `pnpm run docs:lint` passed.
- `pnpm run infra-policy-check` passed.
- `git diff --check` passed.
- `pnpm run verify` passed.

Expected hosted verification after deploying an image that includes this slice:

```bash
~/.fly/bin/flyctl ssh console -a uprise-api-staging -C "/bin/sh -lc 'cd /app && test -x node_modules/.bin/prisma && node_modules/.bin/prisma --version'"
~/.fly/bin/flyctl ssh console -a uprise-api-staging -C "/bin/sh -lc 'cd /app && ./node_modules/.bin/prisma migrate status --schema prisma/schema.prisma'"
UPRISE_API_URL=https://uprise-api-staging.fly.dev pnpm run smoke:staging:api
```

## Carry-Forward

Authenticated onboarding persistence QA still requires a controlled staging
user/token path or an explicitly authorized temporary-user flow. Do not claim
that QA from this migration-runner slice.

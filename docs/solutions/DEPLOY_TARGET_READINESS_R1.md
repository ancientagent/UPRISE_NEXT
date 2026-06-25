# Deploy Target Readiness R1

Status: Active planning document
Owner: Founder + product engineering
Last updated: 2026-06-15

## Purpose

Define the practical path from the current Supercomputer dev environment into the
intended hosted stack without weakening existing architecture rules.

This document does not replace `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`,
`docs/RUNBOOK.md`, or `docs/ENVIRONMENTS.md`. It translates those policies into
an execution checklist.

## Current Baseline

The repo is already shaped as a hosted multi-service system:

- `apps/web` is the Next.js web tier and is intended for Vercel.
- `apps/api` is the NestJS data/API tier and is intended for Fly.io or AWS App
  Runner.
- `apps/socket` is the Socket.IO realtime tier and is intended for Fly.io or AWS
  App Runner.
- `apps/workers/transcoder` is the media worker tier and is intended for AWS
  Fargate or equivalent worker compute.
- Postgres with PostGIS is the database target; production target is Neon
  Postgres or AWS RDS.
- Media storage target is S3 or Cloudflare R2.

Supercomputer remains valid for development, CI, local orchestration, test runners,
and agent throughput. It must not become the production host, production
database, production API, worker compute, or media storage layer.

## Current Readiness

Ready or mostly ready:

- Monorepo package shape exists.
- `pnpm` workspace policy exists.
- Web-tier boundary is documented.
- Web-tier boundary guard exists in `scripts/infra-policy-check.ts`.
- CI has docs, typecheck, test, build, canon, secrets, and infra-policy
  workflows.
- Local dev Postgres/PostGIS and Redis are represented in `docker-compose.yml`.
- API, socket, and worker apps are separated enough to deploy independently.

Not ready yet:

- Production deploy manifests are not present for Vercel, Fly.io, App Runner, or
  Fargate.
- Environment variable ownership is not centralized by service and environment.
- Neon/PostGIS bootstrap and migration runbook is not explicit enough for a
  first production deploy.
- S3/R2 bucket, CORS, object lifecycle, and media URL strategy are not locked.
- API/socket healthcheck and smoke-test expectations are not tied to deployment
  gates.
- Worker queue/storage dependencies are not mapped to production secrets and
  runtime permissions.
- Staging and production endpoint wiring are not documented as a single matrix.

## Target Deployment Shape

Web:

- Target: Vercel.
- Build command: `pnpm --filter web build`.
- Required public env:
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_SOCKET_URL`
  - analytics keys only when activated.
- Must not receive `DATABASE_URL`, JWT signing secrets, S3/R2 secrets, or
  provider admin tokens.

API:

- Target: Fly.io or AWS App Runner.
- Build command: `pnpm --filter api build`.
- Start command: `pnpm --filter api start`.
- Required private env:
  - `DATABASE_URL`
  - `DIRECT_URL` if Prisma/Neon pooling requires it.
  - `JWT_SECRET` or configured JWT/JWKS authority.
  - Google Places/Geocoding key only if onboarding city lookup uses Google.
  - S3/R2 signing credentials only for server-side media operations.

Socket:

- Target: Fly.io or AWS App Runner.
- Build command: `pnpm --filter socket build`.
- Start command: `pnpm --filter socket start`.
- Required private env:
  - JWT verification config compatible with API-issued auth.
  - allowed origins for the deployed web app.
  - runtime port/bind settings required by the host.

Workers:

- Target: AWS Fargate or equivalent worker compute.
- Required private env:
  - queue connection values.
  - S3/R2 credentials.
  - media bucket names and region/endpoint values.
  - API callback or status-update credentials if worker reports completion.
- FFmpeg must be available inside the worker image.

Database:

- Target: Neon Postgres with PostGIS, or AWS RDS Postgres with PostGIS.
- Required work:
  - confirm PostGIS extension availability.
  - define migration command for deploys: `prisma migrate deploy`.
  - separate pooled runtime URL from direct migration URL if Neon requires it.
  - document restore/backup path before production data exists.

Storage:

- Target: S3 or Cloudflare R2.
- Required work:
  - define bucket names for staging and production.
  - define public/private object policy.
  - define signed URL behavior.
  - define artwork/audio/HLS path conventions.
  - configure CORS only for required read/write surfaces.

## Execution Order

1. Create the environment matrix.
2. Add healthcheck endpoints and smoke-test expectations per service.
3. Add deploy manifests for one staging environment.
4. Wire Neon staging and run migrations against staging.
5. Wire S3/R2 staging and validate one media upload/read path.
6. Deploy API and socket to staging.
7. Deploy web to Vercel staging with staging endpoint envs.
8. Run smoke tests for onboarding, Plot read, artist profile read, source
   dashboard read, and socket connection.
9. Only after staging is repeatable, promote the same manifests to production.

## Environment Matrix To Create

Required columns:

- service
- environment: local, CI, staging, production
- variable
- public/private
- owning platform
- required for build
- required for runtime
- example value
- notes

Start with:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `AUTH_JWKS_URL`
- `GOOGLE_PLACES_API_KEY` or current equivalent key name
- `S3_ENDPOINT`
- `S3_BUCKET`
- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- Redis or queue connection values if workers depend on Redis/BullMQ.

## Provider Manifest Work

Add only after the environment matrix is agreed:

- `vercel.json` or Vercel project configuration for `apps/web`.
- API deploy config for Fly.io or App Runner.
- Socket deploy config for Fly.io or App Runner.
- Worker Dockerfile and Fargate task definition plan.
- Staging deploy documentation under `docs/`.

Do not hardcode secrets into manifests.

## Gates Before First Production Deploy

Required:

- `pnpm run verify`
- web-tier policy check passes.
- canon/docs checks pass.
- API can connect to hosted Postgres.
- PostGIS extension is confirmed on hosted DB.
- Prisma migrations apply cleanly on staging.
- API healthcheck responds on hosted target.
- API `/health/live` and `/health/ready` respond as expected on hosted target.
- Socket smoke test passes on hosted target.
- Web build uses hosted staging env values.
- Media upload/read path is validated on staging storage.

Recommended before production:

- secrets scan passes.
- rollback process is documented per platform.
- database backup/restore path is documented.
- monitoring target is selected for API/socket/workers.

## Do Not Do Yet

- Do not bind production to Supercomputer.
- Do not move production data into the local Docker Postgres.
- Do not expose database credentials to `apps/web`.
- Do not add paid billing or business-dashboard runtime as part of deployment
  readiness.
- Do not widen MVP product scope while doing infrastructure work.
- Do not run destructive migrations or reset hosted data without explicit
  founder approval.

## Recommended Next Slice

Use `docs/DEPLOY_ENV_MATRIX_R1.md` as the single source of truth for deploy
secrets and public runtime URLs.

The selected first staging path is now documented in
`docs/solutions/FIRST_STAGING_TARGET_VERCEL_FLY_NEON_R1.md`: Vercel for
`apps/web`, Fly.io for `apps/api`, and Neon Postgres/PostGIS for the database.
Socket, workers, and storage remain deferred until the web/API/database staging
path is repeatable.

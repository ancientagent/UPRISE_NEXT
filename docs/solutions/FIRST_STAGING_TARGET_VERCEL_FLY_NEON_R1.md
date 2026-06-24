# First Staging Target: Vercel + Fly + Neon R1

Status: Active staging plan
Owner: Founder + product engineering
Last updated: 2026-06-15

## Purpose

Lock the first hosted staging path so agents stop treating deployment provider
selection as an open-ended architecture debate.

This is a staging plan, not a production launch plan.

## Selected First Path

- Web: Vercel, serving `apps/web`.
- API: Fly.io, serving `apps/api`.
- Database: Neon Postgres with PostGIS.
- Socket: deferred until web + API staging is repeatable.
- Workers: deferred until media processing is the active deployment slice.
- Storage: deferred for the current URL-only Release Deck MVP; when media
  upload/read is explicitly activated, use
  `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md` for the R2/S3 decision
  boundary.

## Why This Path

- Vercel is the intended target for the Next.js web tier.
- Fly is a lightweight first API host for the existing NestJS service.
- Neon matches the intended production database direction while keeping PostGIS
  in scope.
- Deferring socket/workers keeps the first staging pass focused on the smallest
  useful live path: web -> API -> database.

## First Staging Scope

In scope:

- Hosted web build.
- Hosted API build.
- Hosted staging Postgres database.
- PostGIS availability check.
- Prisma migration path for staging.
- Basic API healthcheck.
- Web environment values pointing at the staging API.
- Smoke test for a narrow product read path after deployment.

Vercel staging project:

- Project name: `uprise-web-staging`.
- Local project link exists through `.vercel/project.json`, which must remain
  untracked/local-only.
- Dashboard root directory is `apps/web`, with framework preset Next.js and
  Node.js `22.x`.
- `apps/web/vercel.json` mirrors the monorepo web build/install/dev commands for
  CLI/manual deploys and does not force a custom output directory.
- GitHub integration is connected to the private `ancientagent/UPRISE_NEXT`
  repository.

Fly staging API:

- App name: `uprise-api-staging`.
- Public URL: `https://uprise-api-staging.fly.dev`.
- Live manifests now exist at `.dockerignore`, `apps/api/Dockerfile`, and
  `fly.api.staging.toml`.
- Health endpoints pass against Neon/PostGIS:
  `/health/live`, `/health/db`, `/health/postgis`, and `/health/ready`.

Neon staging database:

- Project: `uprise`.
- Branch: `staging`.
- Database: `uprise_staging`.
- PostGIS is enabled and verified.

Out of scope:

- Production deployment.
- Hosted Socket.IO.
- Hosted transcoder worker.
- S3/R2 media path.
- Media upload, storage, transcoding, waveform extraction, and paid ad-slot
  mechanics.
- Billing, premium analytics, business dashboard runtime, or other product scope
  expansion.
- Production domain cutover.

## Required Account-Specific Inputs

Before provider files are committed, collect:

- Vercel project name: recommended `uprise-web-staging`.
- Fly app name for staging API: recommended `uprise-api-staging`.
- Fly primary region: recommended `ord` unless a different launch geography is chosen.
- Neon project/database/branch name: recommended project `uprise`, database `uprise_staging`, branch `staging`.
- Staging API URL.
- Staging web URL.
- Staging public web app URL for Registrar invite links.
- Whether `DIRECT_URL` is required for Prisma migrations on Neon.
- Confirmed Google API key variable name, if onboarding location lookup is used
  in hosted staging.

Use `docs/DEPLOY_ACCOUNT_SETUP_CHECKLIST_R1.md` when creating these provider
resources.

Use product-first provider names. Do not use `UPRISE_NEXT` as a hosted resource
name; that is the repo/build-generation name, not the public product name.

Future production naming should follow the same pattern:

- Vercel web project: `uprise-web`.
- Fly API app: `uprise-api`.
- Neon database: `uprise_production`.
- Neon branch: `production`.
- Future socket app: `uprise-socket`.
- Future worker service: `uprise-transcoder`.
- Future storage bucket: `uprise-media-production`.

## Environment Setup Order

1. Create Neon staging database.
2. Confirm PostGIS extension support.
3. Decide pooled `DATABASE_URL` and direct migration `DIRECT_URL`.
4. Create Fly staging API app.
5. Add API secrets to Fly.
6. Deploy API and confirm healthcheck.
7. Create Vercel staging project for `apps/web`.
8. Add `NEXT_PUBLIC_API_URL` in Vercel.
9. Deploy web and confirm it calls the staging API.

## Initial Env Values

Vercel:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL` only after socket staging exists.

Fly API:

- `DATABASE_URL`
- `DIRECT_URL` if required by Neon/Prisma.
- `JWT_SECRET`
- `CORS_ORIGIN`
- `GOOGLE_PLACES_API_KEY` or the current code-equivalent name, only if needed.

Vercel web:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WEB_APP_URL`
- `NEXT_PUBLIC_SOCKET_URL` only after socket staging exists.
- `NEXT_PUBLIC_MOBILE_APP_URL` only after mobile/deep-link behavior is active.

Neon:

- staging database with PostGIS enabled.
- migration-capable connection string.
- runtime connection string.

## Provider Files Rule

Do not add real provider secrets to the repo.

Do not commit provider files with fake app names that look production-ready. If
templates are needed, keep them under `docs/` with `.example` naming until real
account-specific values are chosen.

Example-only templates live under `docs/deploy/examples/`.

Real staging manifests may be committed only after their account-specific names
are confirmed. Current confirmed live files:

- `.dockerignore`
- `apps/api/Dockerfile`
- `fly.api.staging.toml`

## First Validation Target

After the staging web/API/DB path exists, the first smoke target should be:

- web loads successfully from Vercel staging.
- web calls Fly API staging.
- API can connect to Neon staging.
- API confirms PostGIS-dependent database readiness where applicable.
- one read-only product route works against staging data.

API health endpoints:

- `/health/live` confirms the hosted API process is running.
- `/health/ready` confirms required API dependencies are ready.
- `/health/db` checks database connectivity.
- `/health/postgis` checks PostGIS installation and spatial query behavior.

## Next Engineering Slice

Push the deployment slice so GitHub/Vercel creates a fresh preview with the
current `NEXT_PUBLIC_API_URL`, then run the first web-to-Fly smoke test.

# Deploy Account Setup Checklist R1

Status: Active setup checklist
Owner: Founder + product engineering
Last updated: 2026-06-15

## Purpose

List the provider-side resources that must exist before committing real staging
deployment manifests for UPRISE.

This checklist uses product-first resource names. Do not use `UPRISE_NEXT` as a
hosted provider resource name.

## Selected First Staging Stack

- Web: Vercel
- API: Fly.io
- Database: Neon Postgres with PostGIS
- Socket: deferred
- Workers: deferred
- Storage: deferred

## Vercel Setup

Create:

- Project: `uprise-web-staging`
- Root directory: `apps/web`.
- Framework preset: Next.js
- Node.js version: `22.x`
- Build command: `pnpm --filter web build`
- Install command: `pnpm install --frozen-lockfile`
- Development command: `pnpm --filter web dev`
- Output directory: use the Next.js default; do not override it.

`apps/web/vercel.json` mirrors the monorepo build/install/dev commands for
CLI/manual deploys. It does not force a custom output directory.

Set environment variables:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WEB_APP_URL`

Hold until socket staging exists:

- `NEXT_PUBLIC_SOCKET_URL`

Hold until mobile/deep-link behavior is active:

- `NEXT_PUBLIC_MOBILE_APP_URL`

Do not set:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- any private provider/admin token

GitHub integration note:

- If Vercel cannot connect `ancientagent/UPRISE_NEXT`, grant Vercel's GitHub
  app access to the private repo from Vercel/GitHub integration settings.
- Manual deploys can still run from the locally linked project while Git
  integration is unresolved.

## Fly.io API Setup

Create:

- App: `uprise-api-staging`
- Region: `ord` unless another launch geography is selected.
- Service: `apps/api`

Set secrets:

- `DATABASE_URL`
- `DIRECT_URL` if Neon/Prisma migration flow requires it.
- `JWT_SECRET`
- `CORS_ORIGIN`
- `GOOGLE_PLACES_API_KEY` or current code-equivalent name, only if hosted
  onboarding location lookup requires it.

Initial health checks:

- liveness: `/health/live`
- readiness: `/health/ready`

Do not set web-only public vars here unless the API code explicitly requires
them.

Production-mode API startup must fail if `JWT_SECRET` is missing.

## Neon Setup

Create:

- Project: `uprise`
- Branch: `staging`
- Database: `uprise_staging`

Confirm:

- PostGIS extension is available.
- Runtime pooled connection string is available.
- Direct migration connection string is available if Prisma needs it.
- Backup/restore behavior is understood before production data exists.

Required validation target:

- API `/health/db` confirms database connectivity.
- API `/health/postgis` confirms PostGIS installation and spatial behavior.

## GitHub / CI Setup

Do not add deploy tokens until provider projects exist.

Future CI secrets may include:

- Vercel deploy token and project/org IDs.
- Fly API token.
- Neon connection strings for migration jobs.

Keep production and staging secrets separate.

## First Staging Smoke Checklist

After the first deployment exists:

- Vercel web URL loads.
- Fly API `/health/live` returns healthy.
- Fly API `/health/ready` returns healthy.
- Fly API `/health/db` confirms Neon connectivity.
- Fly API `/health/postgis` confirms PostGIS.
- Vercel web can call the Fly API through `NEXT_PUBLIC_API_URL`.
- One read-only product route can load against staging data.

## Deferred Setup

Socket:

- Future app name: `uprise-socket-staging`
- Configure only after web + API staging is repeatable.

Workers:

- Future service name: `uprise-transcoder-staging`
- Configure only after media processing is the active deployment slice.

Storage:

- Future bucket name: `uprise-media-staging`
- Choose S3 or Cloudflare R2 only when the media upload/read path is in scope.

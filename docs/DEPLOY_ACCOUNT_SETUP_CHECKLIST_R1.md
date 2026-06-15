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

- Project: `uprise-web-staging` (created)
- Root directory: `apps/web` (configured)
- Framework preset: Next.js (configured)
- Node.js version: `22.x` (configured)
- Build command: `pnpm --filter web build` (configured)
- Install command: `pnpm install --frozen-lockfile` (configured)
- Development command: `pnpm --filter web dev` (configured)
- Output directory: use the Next.js default; do not override it (configured)

`apps/web/vercel.json` mirrors the monorepo build/install/dev commands for
CLI/manual deploys. It does not force a custom output directory.

Set environment variables:

- `NEXT_PUBLIC_API_URL` (set to `https://uprise-api-staging.fly.dev` for
  Production and for the `feat/ux-founder-locks-and-harness` Preview branch)
- `NEXT_PUBLIC_WEB_APP_URL` (defer until stable staging web URL/domain is
  selected)

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

- Vercel's GitHub integration has access to `ancientagent/UPRISE_NEXT`.
- Manual deploys can still run from the locally linked project for emergency
  verification, but Git-driven preview deploys are now the repeatable path.

## Fly.io API Setup

Create:

- App: `uprise-api-staging` (created)
- Region: `ord`
- Service: `apps/api`

Set secrets:

- `DATABASE_URL` (set to Neon pooled staging connection string)
- `DIRECT_URL` if Neon/Prisma migration flow requires it (not set yet)
- `JWT_SECRET` (set)
- `CORS_ORIGIN` (set to the first protected Vercel preview URL; replace with
  stable staging web URL/domain when selected)
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

- Project: `uprise` (created)
- Branch: `staging` (`br-lucky-water-atjlgbjo`, parent `production`)
- Database: `uprise_staging` (created)

Confirm:

- PostGIS extension is available and verified.
- Runtime pooled connection string is available.
- Direct migration connection string is available if Prisma needs it; not wired
  into Fly yet.
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
- Fly API `/health/live` returns healthy. (verified)
- Fly API `/health/ready` returns healthy. (verified)
- Fly API `/health/db` confirms Neon connectivity. (verified)
- Fly API `/health/postgis` confirms PostGIS. (verified)
- Vercel web can call the Fly API through `NEXT_PUBLIC_API_URL`. (env set;
  verify after the next Git-driven Vercel preview)
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

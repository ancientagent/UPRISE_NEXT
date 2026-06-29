# Deploy Environment Matrix R1

Status: Active planning document
Owner: Founder + product engineering
Last updated: 2026-06-29

## Purpose

Define which environment variables belong to each UPRISE service before hosted
deployment manifests are added.

This document is the deploy-env companion to
`docs/solutions/DEPLOY_TARGET_READINESS_R1.md`.

## Rules

- Do not commit real secrets.
- `apps/web` may only receive `NEXT_PUBLIC_*` values.
- Database, JWT signing, storage, provider, and queue secrets stay server-side.
- Production values live in provider secret stores, not in repo files.
- Local examples may use `.env.example` placeholders only.
- If a variable is renamed in code, update this matrix in the same change.

## Service Ownership

| Service | Runtime target | Env owner |
| --- | --- | --- |
| `apps/web` | Vercel | Vercel project env |
| `apps/api` | Fly.io or AWS App Runner | Fly/App Runner secrets |
| `apps/socket` | Fly.io or AWS App Runner | Fly/App Runner secrets |
| `apps/workers/transcoder` | AWS Fargate or equivalent worker compute | AWS task/env secrets |
| Database | Neon Postgres or AWS RDS Postgres | Neon/AWS secret + deploy pipeline |
| Storage | S3 or Cloudflare R2 | AWS/R2 credentials in server/worker secret stores |
| CI | GitHub Actions | GitHub Actions secrets |

## Environment Variables

| Variable | Service | Public/private | Build/runtime | Local | CI | Staging | Production | Provider owner | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | web | public | build + runtime | local API URL | optional | staging API URL | production API URL | Vercel | Must point to hosted API for deployed web. |
| `NEXT_PUBLIC_SOCKET_URL` | web | public | build + runtime | local socket URL | optional | staging socket URL | production socket URL | Vercel | Must point to hosted Socket.IO service for deployed web. |
| `NEXT_PUBLIC_WEB_APP_URL` | web | public | build + runtime | local web URL | optional | staging web URL | production web URL | Vercel | Used by Registrar invite-link generation. |
| `NEXT_PUBLIC_MOBILE_APP_URL` | web | public | build + runtime | local/deferred mobile URL | optional | staging mobile/deep-link URL | production mobile/deep-link URL | Vercel/mobile platform | Used by Registrar invite-link generation when mobile links are active. |
| `DATABASE_URL` | api | private | runtime | local PostGIS URL | test DB URL | Neon pooled URL or RDS URL | Neon pooled URL or RDS URL | Fly/App Runner + Neon/AWS | Never expose to web. |
| `DIRECT_URL` | api | private | migration/runtime as needed | optional local direct URL | optional | Neon direct URL if required | Neon direct URL if required | Fly/App Runner + Neon | Use when Prisma/Neon needs a direct migration connection separate from pooled runtime. |
| `DATABASE_SHADOW_URL` | api | private | migration | local shadow DB | CI shadow DB | optional | optional | GitHub/Fly/App Runner | Needed only for migration workflows that require a shadow database. |
| `JWT_SECRET` | api, socket | private | runtime | local secret | test secret | staging secret | production secret | Fly/App Runner | API issuance and socket verification must agree. Prefer managed issuer/JWKS later if adopted. |
| `AUTH_ISSUER` | api, socket | private/public depending provider | runtime | placeholder | placeholder | staging issuer | production issuer | Auth provider/Fly/App Runner | Use if moving away from shared JWT secret toward issuer-based auth. |
| `AUTH_AUDIENCE` | api, socket | private/public depending provider | runtime | placeholder | placeholder | staging audience | production audience | Auth provider/Fly/App Runner | Must match token validation rules. |
| `AUTH_JWKS_URL` | api, socket | private/public depending provider | runtime | optional | optional | staging JWKS URL | production JWKS URL | Auth provider/Fly/App Runner | Required only for JWKS validation. |
| `GOOGLE_PLACES_API_KEY` | api | private | runtime | optional dev key | optional | restricted staging key | restricted production key | Fly/App Runner + Google Cloud | Used only if onboarding city lookup/reverse geocode uses Google APIs. Restrict by API and host/IP where possible. |
| `S3_ENDPOINT` | api, workers | private | runtime | local/R2 endpoint | optional | staging endpoint | production endpoint | Fly/App Runner/AWS/R2 | Required for R2 or non-default S3-compatible storage. |
| `S3_BUCKET` | api, workers | private | runtime | local bucket name | optional | staging bucket | production bucket | Fly/App Runner/AWS/R2 | Use separate staging and production buckets. |
| `S3_REGION` | api, workers | private | runtime | local region | optional | staging region | production region | Fly/App Runner/AWS/R2 | Required by AWS SDK/S3-compatible clients. |
| `S3_ACCESS_KEY_ID` | api, workers | private | runtime | local key | optional | staging key | production key | Fly/App Runner/AWS/R2 | Server/worker only. |
| `S3_SECRET_ACCESS_KEY` | api, workers | private | runtime | local secret | optional | staging secret | production secret | Fly/App Runner/AWS/R2 | Server/worker only. |
| `REDIS_URL` | api, socket, workers | private | runtime | local Redis URL | test Redis URL if needed | staging Redis URL | production Redis URL | Fly/App Runner/Fargate/Redis provider | Use only if queue/session/realtime runtime depends on Redis. |
| `PORT` | api, socket, workers | private | runtime | local port | CI assigned | provider assigned | provider assigned | Host platform | Hosts may inject this automatically. |
| `CORS_ORIGIN` | api, socket | private | runtime | local web origin | optional | staging web origin | production web origin | Fly/App Runner | Keep web origins explicit. |
| `SENTRY_DSN` | web, api, socket, workers | public in browser, private elsewhere | build + runtime | optional | optional | staging DSN | production DSN | Vercel/Fly/App Runner/AWS | Browser DSN is safe but auth tokens are not. |
| `SENTRY_AUTH_TOKEN` | CI only | private | build/deploy | absent | GitHub secret | GitHub secret | GitHub secret | GitHub Actions | Never expose to apps/web. |
| `NEXT_PUBLIC_POSTHOG_KEY` | web | public | build + runtime | optional | optional | staging key | production key | Vercel/PostHog | Only when analytics is activated. |
| `POSTHOG_HOST` | web | public | build + runtime | optional | optional | staging host | production host | Vercel/PostHog | Use public host only. |

## Minimum Local `.env.example` Shape

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
NEXT_PUBLIC_WEB_APP_URL=http://localhost:3000
NEXT_PUBLIC_MOBILE_APP_URL=

DATABASE_URL=postgresql://uprise:uprise_dev_password@localhost:5432/uprise_dev
DIRECT_URL=
DATABASE_SHADOW_URL=

JWT_SECRET=replace-me-local-only
AUTH_ISSUER=
AUTH_AUDIENCE=
AUTH_JWKS_URL=

GOOGLE_PLACES_API_KEY=

S3_ENDPOINT=
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000

SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
POSTHOG_HOST=https://us.i.posthog.com
```

## First Staging Env Set

For the first hosted staging pass, configure only:

- web: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`
- web Registrar links: `NEXT_PUBLIC_WEB_APP_URL`, `NEXT_PUBLIC_MOBILE_APP_URL` only if invite dispatch is exercised in staging
- api: `DATABASE_URL`, `DIRECT_URL` if needed, `JWT_SECRET`, `CORS_ORIGIN`
- socket: `JWT_SECRET`, `CORS_ORIGIN`
- database: Neon/PostGIS staging database
- CI: provider deploy tokens only after deployment provider is selected

Storage and worker env can wait until the media path is the active deployment
slice. Current media posture is locked in
`docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md`: Release Deck stays
URL-only for MVP, real upload/storage/transcoding is deferred, and Cloudflare R2
is the recommended first staging provider only when the media path is explicitly
activated.

Current first staging target:

- web: Vercel
- api: Fly.io
- database: Neon Postgres with PostGIS
- socket: deferred until web + API staging is repeatable
- workers/storage: deferred until media path work is active; current MVP does
  not require storage credentials or transcoder deployment

Current configured staging values:

- `NEXT_PUBLIC_API_URL`: `https://uprise-api-staging.fly.dev` in Vercel
  Production and in the `feat/ux-founder-locks-and-harness` Preview branch.
- API `DATABASE_URL`: Neon pooled connection string for `uprise_staging`, set
  in Fly secrets.
- API `JWT_SECRET`: set in Fly secrets.
- API `CORS_ORIGIN`: set to the current Git-driven preview URL plus the stable
  branch preview alias; replace with the stable staging web URL/domain when
  selected.
- `DIRECT_URL`: intentionally not set yet; add only when hosted Prisma
  migration execution is wired.

Repeatable read-only staging API smoke:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev pnpm run smoke:staging:api
```

Repeatable read-only full staging readiness smoke:

```bash
pnpm run smoke:staging:readiness
```

Add `UPRISE_WEB_URL=<confirmed Vercel staging origin>` to include web-load and
CORS preflight checks. Direct unauthenticated HTTP may report Vercel URLs as
`protected` when Vercel Authentication is enabled; use Vercel MCP, automation
bypass, or a stable authenticated browser session for full page proof.

Add `UPRISE_EXPECTED_CORS_ORIGIN=<confirmed web origin>` to the command when
verifying CORS for a specific Vercel preview or stable staging domain.

Current 2026-06-29 smoke note: API, Neon/PostGIS, stable Vercel web load,
Google Places, and Vercel-to-Fly CORS checks pass against
`https://uprise-api-staging.fly.dev` for:

- `https://uprise-web-staging.vercel.app`
- `https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`

The stable staging web URL returns `200` to unauthenticated HTTP. The Git-driven
`main` branch alias may still be Vercel-auth protected for direct web-page load,
but its API CORS preflight passes.

Launch-readiness DB verification on 2026-06-29 confirmed the Neon staging
database has the expected `48` active, geofenced city-tier launch-community
tuples and no duplicate city/music-community/tier tuples. The same pass found
that staging has not applied the
`20260625150000_add_user_music_community_preferences` migration yet; the
`user_music_community_preferences` table is absent, so the read-only
music-community preference verifier cannot be claimed against staging until
migrations are applied.

Browser onboarding QA on 2026-06-29 found the deployed staging build still
treated manual `TX` input as different from seeded `Texas` scenes. The fix lives
in `chore/launch-readiness-verification-2026-06-29`; deploy and re-run browser
QA before claiming the staging browser flow fully clean.

Launch community seed guard:

- Use `pnpm --filter api run seed:launch-communities:dry-run` before any write
  seed to inspect the `48` tuple plan without touching a database.
- Any non-local seed target must set
  `UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED=seed-launch-communities:<database_name>`.
- For the documented Neon staging database, the expected confirmation is
  `seed-launch-communities:uprise_staging`.
- This confirmation requirement does not replace human/provider verification;
  confirm the visible Neon project, branch, database, and `DATABASE_URL` target
  before running the write command.

Recommended product-first resource names:

- Vercel project: `uprise-web-staging`
- Fly API app: `uprise-api-staging`
- Neon project: `uprise`
- Neon database: `uprise_staging`
- Neon branch: `staging`
- future socket app: `uprise-socket-staging`
- future worker service: `uprise-transcoder-staging`
- future storage bucket: `uprise-media-staging`

Do not use `UPRISE_NEXT` in provider resource names.

## Open Decisions

- Stable staging web URL/domain for `CORS_ORIGIN` and `NEXT_PUBLIC_WEB_APP_URL`.
- Media storage is not required for the current URL-only Release Deck MVP. When
  media upload/read is explicitly activated, `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md`
  recommends Cloudflare R2 as the first staging default while preserving the
  S3-compatible abstraction and requiring provider/account confirmation before
  any bucket or credential changes.
- Whether JWT remains shared-secret based for MVP staging or moves to issuer/JWKS.
- Whether Redis is needed in the first staging pass or only once queue/realtime
  persistence requires it.
- Final Google API key name in code and provider secrets.

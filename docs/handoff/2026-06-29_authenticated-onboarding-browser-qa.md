# 2026-06-29 Authenticated Onboarding Browser QA

## Status

Branch: `docs/authenticated-onboarding-browser-qa`
Base: `main` at `87a3a2c`

Runtime changed: no
Provider state changed: no
Database writes run: yes - temporary browser QA users were created in staging and cleaned up
Secrets read or changed: no

## Target

- Web: `https://uprise-web-staging.vercel.app`
- API: `https://uprise-api-staging.fly.dev`
- Fly image: `uprise-api-staging:deployment-01KW9FNEH61S4R908FS7QCP5WT`
- Fly machine: `2870191f055128`, version `15`
- API health after QA: `/health/ready` returned healthy API, database, and PostGIS checks

## Scenario Covered

Authenticated browser onboarding, manual location, GPS denied:

- Temporary user created through `POST /auth/register`.
- Auth state injected into the stable staging browser session through the same persisted `auth-storage` shape used by the web auth store.
- Browser opened `https://uprise-web-staging.vercel.app/onboarding`.
- User denied GPS.
- User entered:
  - City: `Austin`
  - State: `Texas`
  - ZIP: `78701`
  - Music Community: `Punk`
- User continued to review.
- User entered Plot.
- User expanded the profile panel.

## Verified Browser Evidence

Onboarding review showed:

- Home Scene: `Austin, Texas • Punk`
- Submitted location: `Austin, Texas 78701`
- Listening scene: `Austin, Texas • Punk`
- Voting Eligibility: `Not enabled`
- GPS reason: `Skipped GPS.`

Plot showed:

- Profile strip: `Austin, Texas • Punk`
- Home Scene Roller location: `Austin, Texas`
- Home Scene Roller item: `Punk / Austin, Texas / Home Scene / Default`
- Selected Community: `Austin, Texas • Punk`
- Feed anchor: `Austin, Texas • Punk`

Expanded listener profile showed:

- Profile Summary: `QA Browser Onboarding`
- Scene Context: `Austin, Texas • Punk`
- Music Communities: `Punk`
- Preference label: `In Home Scene Roller`
- Preference label: `Default Home Scene`

Screenshot artifact created locally:

- `output/playwright/onboarding-browser-qa/.playwright-cli/page-2026-06-29T11-04-50-270Z.png`

The artifact path is local/ignored and not committed.

## Cleanup

Cleanup ran inside the Fly app environment using Prisma against staging.

Matched temporary users:

- `qa-browser-onboarding-browser-1782730834-6e8a7c@uprise.local`
- `qa-browser-onboarding-browser-1782730856-8a2eb6@uprise.local`
- `qa-browser-onboarding-browser-1782730881-e28917@uprise.local`

Cleanup result:

- Temporary users deleted: `3`
- Temporary memberships deleted: `1`
- Communities decremented: `1`

## Non-Blocking Observation

`GET /users/me` is not a general current-user endpoint in the current API shape.
During QA, calling `/users/me` returned `404` because `UsersController` declares
`@Get(':id')` before the specific `/users/me/...` routes, so bare `me` is treated
as a user id.

This did not block onboarding because the current web flow stores auth from
`/auth/register` or `/auth/login`, and the target readback endpoints are specific
paths such as:

- `GET /users/me/music-community-preferences`
- `GET /users/me/home-scene-roller`

Follow-up recommendation: if future web runtime needs a bare current-user
profile endpoint, add an explicit `GET /users/me` route before `@Get(':id')` and
cover route ordering with an API test. Do not treat this as a blocker for the
current onboarding persistence/browser QA result.

## Commands / Tools

Browser automation used the local Playwright CLI wrapper with session:

```bash
PLAYWRIGHT_CLI_SESSION=uprise-staging-auth-onboarding \
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh open https://uprise-web-staging.vercel.app/onboarding
```

Auth/session setup used temporary API registration plus localStorage injection
for `auth-storage` in the browser session.

Cleanup used:

```bash
~/.fly/bin/flyctl ssh console -a uprise-api-staging -C "...Prisma cleanup..."
```

## Validation

- Browser flow completed successfully.
- Staging API `/health/ready` passed after cleanup.
- Repo worktree was clean before this documentation closeout.

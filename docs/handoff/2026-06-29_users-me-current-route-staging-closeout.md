# Users Me Current Route Staging Closeout

Date: 2026-06-29
Branch: docs/users-me-route-staging-closeout
Runtime merge commit: c5e6e0c (`fix(api): add authenticated users me route (#135)`)
Staging app: `uprise-api-staging`

## Summary

PR #135 was merged into `main` and deployed to Fly API staging. The authenticated bare current-user route now works in staging: `GET /users/me` returns the JWT user instead of falling through to `/users/:id` with `id = "me"`.

## Deployment Evidence

Command:

```bash
~/.fly/bin/flyctl deploy --config fly.api.staging.toml --app uprise-api-staging --remote-only --now
```

Result:

- Image: `registry.fly.io/uprise-api-staging:deployment-01KW9K4R2KZF50H3ZAW6FX6NPJ`
- Machine: `2870191f055128`
- Fly health checks: passed
- DNS: verified

The deploy emitted a transient Fly listen-warning before health checks completed, then reported the machine in a good state. External health checks passed after deploy.

## Health Verification

```bash
curl -fsS https://uprise-api-staging.fly.dev/health/live
curl -fsS https://uprise-api-staging.fly.dev/health/ready
```

Result:

- `/health/live`: healthy
- `/health/ready`: healthy
- Database: healthy
- PostGIS: healthy

## Authenticated Smoke

Created one temporary staging user via `POST /auth/register`, then called:

```bash
GET https://uprise-api-staging.fly.dev/users/me
Authorization: Bearer <temporary JWT>
```

Result:

```json
{"success":true,"email":"qa-users-me-route-1782733642-20696@uprise.local","userId":"92c40392-58c1-43ba-9565-cb21d8b87af0","username":"qausersme178273364220696"}
```

The API response was validated to match the temporary JWT user. The route no longer returns `404 User not found` for bare `/users/me`.

## Cleanup

Temporary user cleanup was run inside the Fly app environment with Prisma.

Result:

```json
{"email":"qa-users-me-route-1782733642-20696@uprise.local","deleted":1}
{"email":"qa-users-me-route-1782733642-20696@uprise.local","remaining":0}
```

No staging smoke user remains.

## Notes

- No database migrations or seed writes were run.
- No provider secrets were printed.
- No browser QA was needed for this closeout because the route is API-only.

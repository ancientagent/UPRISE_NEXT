# Users Me Current Route Hardening

Date: 2026-06-29
Branch: fix/users-me-current-route
Base: main @ e319a2e
Mode: focused API bug fix

## Summary

Authenticated staging browser QA for onboarding found that bare `GET /users/me` returned `404 User not found`. The specific `me/*` routes used by Plot and onboarding were already working, but the controller did not expose a bare current-user route and the parameterized `GET /users/:id` route was registered before current-user routes.

This slice adds `GET /users/me` and keeps all current-user `me/*` routes before parameterized user routes so `me` is not interpreted as a user id.

## Classification

- Type: bug
- Area: API identity / authenticated current-user read
- Product doctrine changed: no
- Provider/database state touched: no
- Runtime behavior changed: yes, authenticated `GET /users/me` now returns the JWT user payload shape from `UsersService.findById`.

## Files Changed

- `apps/api/src/users/users.controller.ts`
- `apps/api/test/users.profile.collection.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-29_users-me-current-route.md`

## Behavior Locked

- `GET /users/me` delegates to `UsersService.findById(req.user.userId)`.
- Current-user routes are registered before `GET /users/:id`.
- Existing current-user routes remain protected by `JwtAuthGuard` at the controller level.
- Existing `GET /users/:id` and `GET /users/:id/profile` behavior is preserved.

## Validation

Initial regression before fix:

```bash
pnpm --filter api test -- users.profile.collection.test.ts --runInBand
```

Failed as expected because `@Get('me')` was absent and `controller.findMe` did not exist.

Post-fix validation:

```bash
pnpm --filter api test -- users.profile.collection.test.ts --runInBand
```

Result: passed, 14 tests.

Further validation should run before merge:

```bash
pnpm --filter api typecheck
pnpm run docs:lint
git diff --check
pnpm run verify
```

## Follow-Up

After merge and API staging deploy, rerun a small authenticated smoke against Fly staging:

1. Register a temporary user through `/auth/register`.
2. Call `GET /users/me` with the returned JWT.
3. Confirm `success: true` and `data.id` matches the temporary user.
4. Delete the temporary user through the existing Fly-side Prisma cleanup pattern.

Do not run direct staging DB writes locally; use Fly app environment when cleanup requires staging credentials.

# Discover Public Read Runtime Fix (2026-03-23)

## Scope
Targeted runtime fix for Discover hydration failures reported by the live browser harness.

## Implemented
- `apps/api/src/auth/guards/optional-jwt-auth.guard.ts`
  - added an optional JWT guard so read-only Discover endpoints can accept anonymous requests without collapsing into auth failures
- `apps/api/src/communities/discovery.controller.ts`
  - switched `GET /discover/scenes` and `GET /discover/context` to optional auth
  - kept `POST /discover/tune`, `POST /discover/set-home-scene`, `POST /discover/save-uprise`, and community-local search/highlights behind required auth
- `apps/api/src/communities/communities.service.ts`
  - allowed anonymous scene-list reads without requiring a user lookup
  - returns neutral empty discovery context when no authenticated user is present
- `apps/api/src/main.ts`
  - expanded the default CORS allowlist to include both `http://localhost:3000` and `http://127.0.0.1:3000`
- `apps/api/test/communities.discovery.controller.test.ts`
  - added anonymous scene-read coverage and guard overrides for the optional-auth path
- `apps/api/test/communities.discovery.service.test.ts`
  - added anonymous scene-read and anonymous context coverage

## Why
The live Discover surface was entering `Discover unavailable` / `Failed to fetch` before rendering any travel results. Two repo-level causes were addressed in this slice:
- scene-list reads were intended to be token-optional in web, but the API controller still required `JwtAuthGuard` for every Discover endpoint
- default API CORS allowed `localhost:3000` only, while harness/browser inspection has been running against `127.0.0.1:3000`

## Validation
- `pnpm --filter api test -- communities.discovery.controller.test.ts communities.discovery.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Remaining Runtime Question
If the live Discover surface still fails after this slice, the remaining blocker is environment/process availability for the API server itself, not controller/service typing or auth policy.

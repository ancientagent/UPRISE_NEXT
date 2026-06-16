# API Dev/Build Runtime Fix (2026-03-23)

## Scope
Fix the API build/dev path so the local Nest server actually emits runnable output and boots on port `4000` for live web QA.

## Root Cause
`apps/api` was using `tsconfig.json` with `incremental: true` and a workspace-root `tsconfig.tsbuildinfo` file. `nest build` deleted `dist/`, but the stale build-info file remained, so TypeScript treated the project as up to date and emitted nothing. As a result:
- `pnpm --filter api build` produced only copied assets
- `pnpm --filter api dev` compiled in watch mode and then crashed trying to execute missing `dist/main`
- live Discover/browser QA had no API process behind `http://localhost:4000`

## Implemented
- added `apps/api/tsconfig.build.json`
  - extends `apps/api/tsconfig.json`
  - disables incremental build output reuse for the runtime build
  - moves build-info output under `dist/`
  - excludes test/report files from runtime build output

## Validation
- `pnpm --filter api build`
- `pnpm --filter api dev`
- `curl http://127.0.0.1:4000/health`

The API now boots successfully in watch mode and responds on port `4000`.

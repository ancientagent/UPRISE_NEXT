# 2026-06-15 Deploy Readiness And Env Matrix

Status: active carry-forward
Branch context: `feat/ux-founder-locks-and-harness`

## Summary

Added the first concrete deployment-readiness planning layer for moving UPRISE
from DeepAgent/dev-only operation toward the intended hosted stack.

DeepAgent remains valid for development, CI, local orchestration, and agent
throughput. It is not production hosting, production database, production API,
worker compute, or media storage.

## New Docs

- `docs/solutions/DEPLOY_TARGET_READINESS_R1.md`
- `docs/DEPLOY_ENV_MATRIX_R1.md`
- `docs/DEPLOY_ACCOUNT_SETUP_CHECKLIST_R1.md`

## Current Direction

Recommended first staging path:

- Vercel for `apps/web`.
- Fly.io for `apps/api`.
- Neon Postgres with PostGIS for the first hosted database.
- Socket and worker deployment can follow after API + web staging is repeatable.
- Storage should be S3 or Cloudflare R2 once the media path is the active slice.

The selected staging path is now captured in
`docs/solutions/FIRST_STAGING_TARGET_VERCEL_FLY_NEON_R1.md`.

Recommended provider resource names:

- Vercel staging web project: `uprise-web-staging`
- Fly staging API app: `uprise-api-staging`
- Neon project: `uprise`
- Neon database: `uprise_staging`
- Neon branch: `staging`

Provider names should use the public product name `uprise`, not the repo name
`UPRISE_NEXT`.

## Agent Routing Update

The `INFRA_RUNTIME_QA` lane in `docs/agent-briefs/CONTEXT_ROUTER.md` now points
future agents to:

- `docs/RUNBOOK.md`
- `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
- `docs/solutions/DEPLOY_TARGET_READINESS_R1.md`
- `docs/DEPLOY_ENV_MATRIX_R1.md`
- `apps/web/WEB_TIER_BOUNDARY.md` when web-tier behavior is touched

## Do Not Drift

- Do not bind production to DeepAgent.
- Do not expose database or storage secrets to `apps/web`.
- Do not add billing/business runtime as part of deploy readiness.
- Do not widen MVP product scope while doing infrastructure work.
- Do not write provider manifests until env ownership is clear.
- Do not run destructive hosted database migrations without explicit founder
  approval.

## Next Slice

Pick the first hosted staging provider pair and add provider manifests in this
order:

1. Vercel staging for `apps/web`.
2. API staging target for `apps/api`.
3. Neon/PostGIS staging migration runbook.
4. Staging smoke tests for web -> API.
5. Socket and worker staging only after the API/web path is repeatable.

API health endpoint context:

- `/health/live` is the process liveness check.
- `/health/ready` is the dependency readiness check.
- `/health/db` checks database connectivity.
- `/health/postgis` checks PostGIS installation and spatial behavior.

Auth/env context:

- API production startup now requires `JWT_SECRET`; local/test fallback remains
  available outside production.
- Registrar invite-link web env also includes `NEXT_PUBLIC_WEB_APP_URL` and
  optional `NEXT_PUBLIC_MOBILE_APP_URL`.

Provider setup context:

- Use `docs/DEPLOY_ACCOUNT_SETUP_CHECKLIST_R1.md` before committing real
  provider manifests.
- Keep provider names product-first with `uprise-*` naming.
- Use `docs/deploy/examples/` for non-runnable provider examples until real
  account-specific values are confirmed.

Vercel context:

- Vercel project `uprise-web-staging` is locally linked.
- GitHub integration failed because Vercel does not yet have access to
  `ancientagent/UPRISE_NEXT`.
- `.vercel/` is local-only and excluded through `.git/info/exclude`.
- Vercel dashboard is configured for root directory `apps/web`, framework
  preset Next.js, Node.js `22.x`, build `pnpm --filter web build`, install
  `pnpm install --frozen-lockfile`, and dev `pnpm --filter web dev`.
- `apps/web/vercel.json` mirrors the build/install/dev commands for CLI/manual
  deploys and intentionally does not override the Next.js output directory.
- `.vercelignore` excludes local workspaces, docs, and design/reference assets
  from manual Vercel uploads.
- First preview deployment is READY:
  `https://uprise-web-staging-8x2er8ahx-ben-risemans-projects.vercel.app`
  (`dpl_84WtnQZ4wR4aPt8kLRgbkuq6ad3Y`).
- The preview is protected by Vercel Authentication because standard
  Deployment Protection is enabled; unauthenticated browser smoke checks route
  to Vercel login unless protection is changed intentionally.
- Browser-auth handling correction: do not launch fresh browser sessions after
  the founder completes Vercel/Google/GitHub security checks. Reuse the
  already-authenticated controlled browser tab/profile if available, or verify
  protected deployments through Vercel CLI/MCP/automation-bypass headers. If no
  reusable authenticated session is available, stop and ask before triggering
  another interactive login flow.
- Preferred provider-browser workflow:
  - Set `PLAYWRIGHT_CLI_SESSION=uprise-provider-auth`.
  - Open/login once in that named session.
  - Save auth storage with:
    `playwright-cli state-save .auth/playwright/vercel-state.json`.
  - Before future checks, load it with:
    `playwright-cli state-load .auth/playwright/vercel-state.json`.
  - `.auth/` is local-only and excluded through `.git/info/exclude`; do not
    commit auth storage snapshots.
  - Current local Vercel auth storage has been saved at
    `.auth/playwright/vercel-state.json`; load it before protected-preview
    browser checks instead of asking the founder to log in again.
- The successful preview was deployed from a dirty local working tree on
  `feat/ux-founder-locks-and-harness`; commit or PR the deployment-prep slice
  before treating Git-driven deploys as repeatable.
- Vercel blocked the earlier preview attempt because `next@15.5.6` was flagged
  as vulnerable. The web package was patched to `next@15.5.19` and
  `eslint-config-next@15.5.19`.

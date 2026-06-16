# Launch Community Preload Seed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a deterministic, idempotent API-side seed path that preloads the 48 launch city-tier Home Scene communities.

**Architecture:** Keep all seed behavior in the API/data tier. Unit-test pure helper logic without touching a live DB, then expose a Prisma seed entrypoint that can be run later by operators. Use a deterministic system owner user for the required `Community.createdById` relation and avoid schema migrations in this slice.

**Tech Stack:** pnpm, TypeScript, Jest, Prisma Client, tsx.

---

### Task 1: Seed Helper Contract

**Files:**

- Create: `apps/api/test/launch-community-seed.test.ts`
- Create: `apps/api/src/seed/launch-community-seed.ts`

- [x] **Step 1: Write failing tests for matrix expansion, slug/name shape, and system owner defaults**

Run: `pnpm --filter api test -- launch-community-seed.test.ts`
Expected: FAIL because `../src/seed/launch-community-seed` does not exist.

- [x] **Step 2: Implement pure helper functions**

Implement:

- `SYSTEM_COMMUNITY_SEED_OWNER`
- `slugifyLaunchCommunity`
- `buildLaunchCommunitySeedRecords`
- `validateLaunchCommunityMatrix`

- [x] **Step 3: Run focused tests**

Run: `pnpm --filter api test -- launch-community-seed.test.ts`
Expected: PASS.

### Task 2: Idempotent Prisma Runner

**Files:**

- Modify: `apps/api/test/launch-community-seed.test.ts`
- Modify: `apps/api/src/seed/launch-community-seed.ts`
- Create: `apps/api/prisma/seed.ts`
- Modify: `apps/api/package.json`

- [x] **Step 1: Write failing tests for owner upsert and tuple upsert behavior**

Run: `pnpm --filter api test -- launch-community-seed.test.ts`
Expected: FAIL because runner functions are missing.

- [x] **Step 2: Implement runner functions and CLI entrypoint**

Implement:

- `ensureLaunchCommunitySeedOwner`
- `seedLaunchCommunities`
- `apps/api/prisma/seed.ts` that invokes the runner and disconnects Prisma.
- `apps/api/package.json` script `seed:launch-communities`.

- [x] **Step 3: Run focused tests**

Run: `pnpm --filter api test -- launch-community-seed.test.ts`
Expected: PASS.

### Task 3: Docs And Verification

**Files:**

- Modify: `docs/specs/seed/README.md`
- Modify: `docs/CHANGELOG.md`
- Create: `docs/handoff/2026-06-16_launch-community-preload-seed.md`

- [x] **Step 1: Document the seed command and owner policy**

Update seed docs and changelog. Add a dated handoff noting that the seed path exists but was not run against a live database.

- [x] **Step 2: Verify**

Run:

- `pnpm --filter api test -- launch-community-seed.test.ts`
- `pnpm --filter api typecheck`
- `pnpm run docs:lint`
- `git diff --check`

Expected: all exit 0.

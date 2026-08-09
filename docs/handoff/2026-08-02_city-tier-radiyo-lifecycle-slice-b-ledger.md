# City-Tier RADIYO Lifecycle Slice B Ledger

**Date:** 2026-08-02
**Branch:** `codex/classic-avatar-asset-production`
**Phase:** local schema and transaction seam checkpoint
**Deployment target:** none
**Status:** implemented and independently reviewed

## Delivered

Slice B adds the durable `FairPlayLifecycleRun` ledger required by the Fair
Play owner contract. Its unique key is `jobType + communityId + cadenceBucket`.
The new `FairPlayLifecycleRunService` supports claimed, fenced lifecycle work
for city-tier Release Deck ingestion, New Releases graduation, and recurrence
recomputation.

The existing manual APIs remain compatible. Their write implementations now
also expose transaction-aware internal seams so a leased lifecycle run can:

1. lock the lifecycle record and active city-tier community together;
2. revalidate the lease with database wall-clock time;
3. perform the eligible Fair Play write; and
4. record successful completion in that same transaction.

Recurrence derives `initial` only when no prior success exists. Later runs use
`after:<priorSuccessfulRunId>` and may claim only after the previous successful
completion is at least 48 hours old. Reclaimed leases receive a new token;
stale workers cannot apply, fail, or complete the newer claim.

## Migration Boundary

`apps/api/prisma/migrations/20260802120000_add_fair_play_lifecycle_runs/`
matches the Prisma model and is committed as source. It has **not** been
applied to any database in this slice.

## Explicit Non-Goals

- No scheduler, timer, startup hook, worker process, controller, or production
  caller.
- No provider, staging, deployment, database migration application, or other
  database state change.
- No changes to Release Deck eligibility, Fair Play policy, Sect behavior,
  voting, propagation, state/national aggregation, media, or product rules.

## Validation

- Focused API suites: 6 passed; 32 tests passed; 2 integration tests skipped.
- `pnpm --filter api typecheck`: passed.
- `pnpm --filter api exec prisma validate`: passed.
- `pnpm run verify`: passed.
- `pnpm run workspace:audit`: passed.
- `git diff --check`: passed.
- Two independent Sol xhigh runtime reviews: passed with no findings.

The integration suite runs only with an explicitly supplied local
`UPRISE_TEST_DATABASE_URL`; it deliberately rejects the default `DATABASE_URL`
and was not run because no such local test database was authorized.

## Next Gate

Do not treat this ledger as production automation. A worker/host decision,
disabled-by-default operational configuration, migration-application plan, and
staging-preview approval are separate future slices requiring their own owner
contract, review, and explicit authorization.

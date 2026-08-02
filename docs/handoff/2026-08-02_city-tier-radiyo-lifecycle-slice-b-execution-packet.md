# City-Tier RADIYO Lifecycle Slice B Execution Packet

**Date:** 2026-08-02  
**Branch:** `codex/classic-avatar-asset-production`  
**Phase:** schema-bearing runtime slice, plan only  
**Status:** independently reviewed and ready for the bounded Slice B implementation  
**Deployment target:** local/shared checkout only; no staging or provider action

## Goal

Implement the minimum durable coordination seam that allows a later dedicated
city-tier RADIYO worker to claim lifecycle work safely. This slice does not add
the worker process, scheduler, startup hook, API timer, provider configuration,
or automatic lifecycle trigger.

The owner contract is
`docs/specs/broadcast/radiyo-and-fair-play.md#lifecycle-automation-coordination`.
It is the authority for this packet.

## Required Reading

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/agent-briefs/CONTEXT_ROUTER.md`
4. `docs/specs/system/documentation-framework.md`
5. `docs/specs/media/release-deck-and-eligibility.md`
6. `docs/specs/broadcast/radiyo-and-fair-play.md`
7. `docs/handoff/2026-08-01_city-tier-radiyo-automation-execution-packet.md`
8. `docs/handoff/2026-08-02_city-tier-radiyo-durable-run-contract.md`
9. `apps/api/src/fair-play/fair-play-ingestion.service.ts`
10. `apps/api/src/fair-play/fair-play-graduation.service.ts`
11. `apps/api/src/fair-play/fair-play.service.ts`
12. `apps/api/src/fair-play/fair-play.module.ts`
13. `apps/api/prisma/schema.prisma`
14. the focused Fair Play service/controller/module tests

Do not use legacy RADIYO, prior density-band, Sect, state/national, or provider
documents as authority unless a current owner spec explicitly points there.

## Confirmed Starting State

- Manual authenticated ingestion and graduation paths exist.
- `RadiyoLifecyclePreviewCoordinator` is read-only and has no trigger.
- `FairPlayIngestionService` and `FairPlayGraduationService` already revalidate
  active city-tier communities during their write transactions.
- `FairPlayService.aggregateRecurrenceScores()` is write-capable, has no
  production caller, and must not become an automatic path in this slice.
- There is no durable run ledger, lease, worker identity, or recurrence success
  watermark.
- City tier is the active source-of-truth lane. State/national, Sect, voting,
  propagation, removal, and personalization remain excluded.

## In Scope

1. Add the minimum Prisma `FairPlayLifecycleRun` model and migration required by
   the owner contract, including the `Community` relation.
2. Add a server-side lifecycle-run service that can atomically claim, reclaim,
   complete, and fail one ledger row.
3. Extract transaction-aware internal apply seams for ingestion, graduation,
   and recurrence without changing the existing public manual endpoint
   contracts.
4. Make recurrence application capable of running in one transaction with an
   active city-tier recheck, a valid current lease, score updates, and ledger
   completion.
5. Add focused tests for concurrency/lease fencing, retries, completed-bucket
   terminality, recurrence chaining, and manual-path compatibility.
6. Record a dated handoff and changelog entry only if runtime/model behavior
   lands.

## Explicitly Out Of Scope

- Any worker executable, queue consumer, cron, `setInterval`, controller,
  startup hook, or write-enabled coordinator caller.
- Provider, environment, staging, deployment, database identity, or database
  migration execution against a shared/staging/production database.
- Release-date capacity policy, source eligibility policy, song duration rules,
  New Releases duration, and any public UI/API behavior change.
- State/national aggregation, Sect lifecycle/readiness, voting/propagation,
  Support/Participation, avatar/media, and unrelated cleanup.

## Required Model Boundary

The implementation must add only a coordination record. It is not a broadcast
or analytics history table.

Minimum fields:

| Field | Requirement |
| --- | --- |
| `id` | stable primary key |
| `jobType` | one of `release_deck_ingestion`, `new_releases_graduation`, `recurrence_recompute` |
| `communityId` | required relation to the intended city-tier community |
| `cadenceBucket` | canonical dispatch-window boundary, or `initial` / `after:<priorSuccessfulRunId>` for recurrence |
| `status` | `leased`, `completed`, or `failed` |
| `attemptCount` | incremented for every claim or reclaim |
| `workerId` | non-secret worker/run identity for the current/latest lease |
| `leaseToken` | opaque token regenerated for every claim or reclaim |
| `claimedAt`, `leaseExpiresAt` | required lease timing |
| `completedAt`, `failedAt` | lifecycle result timing as applicable |
| `resultSummary`, `errorSummary` | aggregate-only result data capped at 8 KB serialized; non-secret error text capped at 2,000 characters |

The schema must enforce `@@unique([jobType, communityId, cadenceBucket])` and
indexes that support status/lease-expiry recovery and successful recurrence
anchor lookup. Do not add a listener, source, track, vote, or engagement
relation to this model.

The migration is a repository migration artifact only. It must not be applied
to a shared, staging, or production database in this slice.

## Claim And Fencing Plan

1. Dispatch claims accept only an ingestion/graduation job type, community ID,
   canonical UTC dispatch-window bucket, worker ID, and operations-provided
   lease duration. Recurrence claims never accept a caller-provided bucket:
   their transaction derives `initial` or `after:<priorSuccessfulRunId>`.
2. Database time is authoritative for claim, expiry, reclaim, completion,
   failure, and recurrence eligibility. A domain execution instant is separate
   and must come from the same transaction when exact Fair Play timing matters.
3. Claim/reclaim is an atomic database operation that revalidates the target
   community is active and `tier = city`. A new row starts as `leased`; an
   expired `leased` row or a `failed` row may be reclaimed in its same bucket.
   A `completed` row must never be reclaimed.
4. Every successful claim/reclaim assigns a fresh `leaseToken`, database-time
   `claimedAt`, database-time `leaseExpiresAt`, and incremented `attemptCount`.
   Reclaim atomically clears stale `failedAt`, `errorSummary`, `completedAt`,
   and `resultSummary` before the new attempt begins.
5. A transaction-scoped lease guard must lock and verify the currently leased
   row's status, worker ID, token, and unexpired database-time lease before any
   lifecycle domain write. Apply, completion, and failure use that same guard.
   A stale worker cannot write after another worker reclaimed its lease.
6. Use database-enforced uniqueness plus conditional mutation/locking. Do not
   use an in-memory mutex, process-local singleton, or assumed one-worker
   deployment for correctness.
7. Dry-run paths must never create or modify a ledger row.

The implementation may choose the narrowest Prisma/Postgres mechanism that
proves these properties. If row locking needs a bounded raw SQL statement, keep
it parameterized, local to the lifecycle-run service, and cover it with a real
Postgres concurrency test.

## Transaction Seams

### Ingestion

Keep `FairPlayIngestionService.ingestDueSchedules()` as the manual wrapper.
Extract an internal transaction-aware apply method that:

- reads current due schedules inside the supplied transaction;
- revalidates the active city-tier community there;
- preserves existing schedule, source, track, duration, and one-active-new-
  release checks;
- makes the existing conditional `RotationEntry` and schedule-status writes;
- returns only operational result counts/details needed for the ledger summary.

The later worker will call that internal method inside the transaction-scoped
lease guard, not after a separate claim check. A canonical dispatch window may
pass a date-only eligibility value to preserve the existing Release Deck
scheduled-date behavior; it must not create a new same-day cutoff.

### Graduation

Keep `FairPlayGraduationService.runGraduation()` as the manual wrapper.
Extract an internal transaction-aware apply method that preserves current
entry-time/new-window conditional updates. The later worker calls it inside the
transaction-scoped lease guard and passes a database-derived execution instant
so it honors `now >= enteredPoolAt + newWindowDays`; the date-only manual
wrapper remains compatible until its public contract is intentionally changed.

### Recurrence

Extract recurrence score calculation/application so it can use a supplied
transaction client. For a ledger-owned recurrence run, one transaction must:

1. use the transaction-scoped lease guard to lock/verify the ledger row still
   has the claimant's current worker ID, token, and unexpired database-time
   lease;
2. revalidate the community is active and `tier = city`;
3. calculate/update Main Rotation recurrence scores using the existing
   owner-defined rolling window;
4. record the matching ledger completion.

The claim transaction determines recurrence eligibility by locking/selecting
the latest successful recurrence record for that community. It claims `initial`
when none exists; otherwise it claims `after:<priorSuccessfulRunId>` only when
the recorded completion is at least 48 hours old. A failed/expired claim retries
that same bucket; a completed bucket cannot be re-applied.

## Verification Required

### Focused Unit/Service Tests

- Exactly one of two competing claim attempts succeeds for one
  `jobType + communityId + cadenceBucket`.
- Expiry/reclaim creates a new token; the prior token cannot apply, fail, or
  complete the run.
- Completed rows cannot be reclaimed or applied again.
- Failed rows retry in the same bucket with a new token.
- A schedule created after an earlier same-day dispatch completes is actually
  ingested by the next same-day dispatch window while eligibility remains
  Release Deck date-based.
- Recurrence uses `initial` only before a successful completion, derives the
  next bucket exactly as `after:<priorSuccessfulRunId>`, and rejects at
  `48 hours - 1 ms` while accepting exactly at the 48-hour boundary.
- Graduation rejects at `enteredPoolAt + newWindowDays - 1 ms` and accepts
  exactly at `enteredPoolAt + newWindowDays`.
- Recurrence rejects inactive/non-city communities before score updates.
- Existing manual ingestion and graduation controller/service behavior retains
  exact DTO validation, response shape, dry-run behavior, and error semantics.

### Real-Postgres Concurrency Test

Add or prepare one integration test that runs only with an explicitly supplied
`UPRISE_TEST_DATABASE_URL`, never the default `DATABASE_URL`. The test harness
must fail closed unless the URL targets a local test database (localhost or
loopback host and a database name reserved for UPRISE tests). It must use
independent connections to prove concurrent claim behavior and stale-token
fencing. Inject a failure after recurrence score updates but before ledger
completion and prove both roll back; separately prove both commit on success.
If this dedicated local test database is unavailable, do not substitute a
provider or shared database: report the test as prepared but not run.

### Required Commands

```bash
pnpm --filter api test -- fair-play*.test.ts --runInBand
pnpm --filter api typecheck
pnpm run verify
pnpm run workspace:audit
git diff --check
```

Run the real-Postgres test only with an explicitly approved local test database
identity. Do not inspect or print secrets.

## Review Gate

Before code or schema edits, an independent high-reasoning reviewer must check
this packet against the current owner contract and runtime for:

- lease fencing completeness;
- recurrence cadence/retry semantics;
- manual-path compatibility;
- Prisma migration/model minimality;
- no accidental scheduler, provider, or automatic write activation.

If the review blocks, patch this packet or the owner contract first. Do not
work around a contract flaw in migration code.

## Review History

- 2026-08-02 independent review blocked the first draft for caller-clock,
  claim/apply TOCTOU, recurrence-bucket ownership, reclaim cleanup, boundary-
  test, and integration-test safety gaps. The owner contract and this packet
  were corrected before re-review; no schema or runtime files were changed.
- 2026-08-02 independent re-review passed the corrected packet with no
  findings. The bounded implementation may proceed; no worker, timer, provider,
  staging, or product-policy scope is authorized by that pass.

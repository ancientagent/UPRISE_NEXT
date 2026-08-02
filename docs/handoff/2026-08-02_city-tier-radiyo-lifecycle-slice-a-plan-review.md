# City-Tier RADIYO Lifecycle Slice A Plan Review

**Date:** 2026-08-02
**Branch:** `codex/classic-avatar-asset-production`
**HEAD reviewed:** `28b149f`
**Reviewer:** independent Sol read-only architecture review
**Status:** plan corrected; implementation awaits explicit approval

## Scope

Reviewed the city-tier RADIYO automation packet against the active Release
Deck, Fair Play, admin, schema, and runtime contracts. No files, database
records, provider settings, or scheduler configuration were changed by the
review.

## Confirmed Runtime Boundary

- `FairPlayIngestionService.ingestDueSchedules()` supports explicit dry-run
  delegation and revalidates active city-tier community state before writes.
- `FairPlayGraduationService.runGraduation()` supports explicit dry-run
  delegation and transaction-time city-tier revalidation.
- `FairPlayService.aggregateRecurrenceScores()` is write-capable only. It does
  not expose a preview path and currently verifies scene existence but not
  active city-tier state.
- No durable run, lease, success watermark, or recurrence cadence bucket exists
  in the current Prisma schema.

## Review Correction

The prior Slice A wording, `Owner Contract And Pure Coordinator`, was too broad.
It could not safely delegate all lifecycle stages in preview mode because
recurrence always writes. It also could not enforce a 48-hour recurrence cadence
without durable state.

Slice A is therefore narrowed to a **preview-only thin coordinator**:

1. read one injected clock value;
2. enumerate active city-tier communities in deterministic
   `state`, `city`, `musicCommunity`, `id` order;
3. invoke ingestion and graduation with explicit `dryRun: true`;
4. report recurrence as deferred rather than invoking its write-capable method;
5. isolate failures by lifecycle stage and community;
6. add no controller, startup hook, API timer, worker process, schema, or
   write-enabled path.

The coordinator must not issue direct lifecycle writes. It is an orchestrator,
not a pure function.

## Later Gates

Before the durable ledger slice:

- approve the worker plus run/lease boundary;
- promote the durable coordination contract into the broadcast owner spec;
- define unique bucket, claim, completion, failure, retry, stale-lease, and
  worker-identity behavior;
- add recurrence preview/apply separation and city-tier revalidation;
- validate concurrent claims with real PostgreSQL, not only mocked Prisma.

Before a worker process or staging automation:

- complete and independently review the ledger slice;
- keep write automation disabled by default;
- verify provider, database, and deployment identity;
- run supervised staging preview and compare candidates with current manual
  endpoints;
- do not introduce an API-local production timer.

## Required Slice A Tests

- active city-tier filtering and full-tuple deterministic ordering;
- one injected clock snapshot per run;
- explicit dry-run calls for ingestion and graduation;
- recurrence never called;
- zero scenes has zero delegates;
- a stage failure does not block subsequent stages or communities;
- coordinator has no direct Prisma write calls;
- no state/national, Sect, propagation, voting, removal, or provider behavior.

## Recommendation

The revised Slice A is safe to implement only after explicit approval as a
no-schema, preview-only local coordinator. The original write-capable all-stage
coordinator is not safe to implement before the later durable ledger work.

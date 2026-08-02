# City-Tier RADIYO Durable Run Contract

**Date:** 2026-08-02
**Branch:** `codex/classic-avatar-asset-production`
**Phase:** owner-contract promotion, no schema or provider work
**Status:** independently reviewed and ready for a schema-bearing execution packet

## Purpose

Promote the durable coordination rules needed before a city-tier RADIYO worker
can mutate lifecycle state. This contract does not add a migration, worker,
timer, provider configuration, deployment, or automatic write path.

## Contract Promoted

`docs/specs/broadcast/radiyo-and-fair-play.md#lifecycle-automation-coordination`
now owns:

- the `FairPlayLifecycleRun` run/lease ledger boundary;
- job types and the unique `jobType + communityId + cadenceBucket` claim key;
- repeatable UTC dispatch-window buckets for ingestion and graduation, while
  Release Deck eligibility remains date-based;
- recurrence eligibility derived from the previous successful completion, with
  the canonical `initial` / `after:<priorSuccessfulRunId>` bucket derivation
  and at least 48 hours between successful runs;
- retry semantics for failed/expired leases;
- fresh-token fencing for reclaimed leases, transaction-aware internal apply
  paths, and the required atomic city-tier-validated recurrence apply plus
  ledger completion transaction;
- city-tier-only, disabled-by-default, no-API-timer, provider-identity, and
  staging-preview boundaries.

## Reasoning

The current manual ingestion and graduation services are transactionally
revalidated and conditionally idempotent. A dispatch window, rather than one
whole UTC-day bucket, ensures a schedule created later on its valid release day
is eligible for a later run that same day. A crash after a ledger claim can be
retried without creating an additional effective ingestion/graduation result.

Current recurrence recomputation updates Main Rotation rows directly. A lease
alone cannot make that safe: a reclaimed worker must be fenced from applying
stale work, and a crash after score updates but before ledger completion would
permit a repeat update in the same logical 48-hour cycle. The later
implementation must therefore use transaction-aware internal apply paths,
fenced leases, and recurrence application inside the same transaction that
records successful ledger completion.

## Required Next Validation

Before any `FairPlayLifecycleRun` migration is written:

1. independent owner-contract review confirms the 48-hour, dispatch-window,
   fencing, and crash/retry semantics; **passed 2026-08-02 with no findings**;
2. a schema-bearing execution packet identifies the minimum Prisma model,
   migration, transaction seams, and real-Postgres concurrency test;
3. the branch owner confirms no provider, scheduler, staging, or write-enabled
   worker work is included.

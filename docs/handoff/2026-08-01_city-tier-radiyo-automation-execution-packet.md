# City-Tier RADIYO Lifecycle Automation Execution Packet

**Date:** 2026-08-01

**Status:** reviewed continuation packet; runtime automation not started

**Branch evidence:** normalized stack through
`codex/classic-avatar-asset-production@28b149f`, plus the 2026-08-02 plan review

**Owner:** next sole branch-owning executor

## Goal

Close the remaining automation seam in the city-tier Release Deck and RADIYO
lifecycle without changing Fair Play policy:

1. ingest due Release Deck schedules into New Releases;
2. graduate entries after each song's stored 10-day protected window;
3. recompute Main Rotation recurrence on the locked 48-hour cadence.

City-tier communities are the source-of-truth work lanes. Statewide and
national RADIYO lanes remain aggregate/deferred behavior and are outside this
packet.

## Authority And Required Reading

Read in this order:

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/agent-briefs/CONTEXT_ROUTER.md`
4. `docs/specs/media/release-deck-and-eligibility.md`
5. `docs/specs/broadcast/radiyo-and-fair-play.md`
6. `docs/specs/admin/super-admin-controls.md`
7. `docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md`
8. `docs/handoff/2026-07-08_release-deck-fair-play-ingestion.md`
9. `docs/handoff/2026-07-14_new-releases-graduation.md`
10. Current runtime and tests named below

Do not read legacy media/Fair Play documents by default. Expand only if a
current owner spec points to a specific legacy passage.

## Verified Current State

### Implemented

- Release Deck measurement, availability, durable scheduling, and Source
  Dashboard scheduling client.
- `FairPlayIngestionService.ingestDueSchedules()` and authenticated manual
  endpoint `POST /admin/fair-play/new-releases/ingest`.
- Fixed `RotationEntry.newWindowDays = 10` at ingestion.
- `FairPlayGraduationService.runGraduation()` and authenticated manual endpoint
  `POST /admin/fair-play/graduation/run`.
- Exact New Releases-to-Main Rotation eligibility:
  `enteredPoolAt + newWindowDays <= asOf`.
- Engagement-derived initial recurrence at graduation.
- `FairPlayService.aggregateRecurrenceScores()` and the thin
  `RecurrenceAggregationJob.runForScene()` wrapper.
- Focused service/controller tests for ingestion, graduation, and recurrence.

### Missing

- No production caller invokes due ingestion.
- No production caller invokes due graduation.
- No production caller invokes recurrence recomputation.
- No durable per-job/per-scene success watermark, lease, or cadence bucket
  prevents duplicate work across process restarts or multiple replicas.
- No dedicated RADIYO lifecycle worker package/process exists.
- Production scheduler/worker hosting and database-backed coordination have not
  been approved or implemented.

### Owner-Spec Terminology Correction

The Fair Play owner spec previously used `graduation` for two different
transitions:

- the locked New Releases-to-Main Rotation transition after the stored 10-day
  window; and
- the separate 14-day tier-propagation eligibility/evaluation policy.

The current normalization pass clarifies the latter as tier propagation and
retains `GRADUATION_*` only as compatibility configuration names. This is a
wording correction, not a policy change.

## Intended Versus Implemented

| Owner intent | Current implementation | Classification |
| --- | --- | --- |
| Scheduled songs enter New Releases on or after their release date. | Manual ingestion service and endpoint exist; no production trigger calls them. | implementation gap |
| Every song receives the same stored 10-day protected window. | Implemented and tested. | confirmed current |
| Songs graduate after their stored window expires. | Manual graduation service and endpoint exist; no production trigger calls them. | implementation gap |
| Main Rotation recurrence changes only on a 48-hour cadence. | Aggregation code exists, but it has no production caller or durable cadence state. | implementation gap |
| Tier propagation uses separate voting policy and deferred thresholds. | No tier-propagation automation is part of this lane. | confirmed boundary |

## Recommended Architecture

### Dedicated Worker, Not An API Timer

Create a dedicated server-side lifecycle worker, proposed home:

`apps/workers/radiyo-lifecycle`

The worker should import or call bounded server-side lifecycle services and run
outside the web tier. Do not add a production `setInterval()` to the API
process. API replicas may restart or overlap deployments, so an in-process API
timer cannot prove singleton execution. The infrastructure directive names AWS
Fargate as the production worker target; the first staging host remains an
explicit operational decision and is not selected by this packet.

### Durable Coordination

Before enabling production writes, add a database-backed run/lease record with
a uniqueness boundary equivalent to:

```text
job_type + community_id + cadence_bucket
```

Required job types:

- `release_deck_ingestion`
- `new_releases_graduation`
- `recurrence_recompute`

The exact model/table name is not locked by this packet. A proposed
`FairPlayLifecycleRun` model should record:

- job type;
- city-tier community;
- cadence bucket;
- started/completed/failed state;
- attempt count;
- start and finish timestamps;
- summarized result counts;
- bounded error text;
- worker/run identity.

The unique bucket prevents multiple worker replicas from claiming the same
scene/job/cadence. Failed attempts must remain retryable without rewriting
successful history.

### Coordinator Order

For each active city-tier community:

1. claim the due-ingestion bucket and ingest schedules due through the current
   UTC day;
2. claim the graduation bucket and graduate entries whose stored window has
   expired;
3. claim recurrence only when the scene's previous successful recurrence
   bucket is at least 48 hours old;
4. record independent results so a recurrence failure does not roll back a
   successful ingestion or graduation run.

The coordinator must use the existing transactional services rather than
reimplementing their eligibility logic.

## Decisions Required Before Runtime Enablement

These are operational/database decisions, not unresolved music-product
doctrine:

1. Approve a dedicated RADIYO lifecycle worker rather than an API-local timer.
2. Approve a schema migration for durable run/lease records.
3. Select the first worker host and scheduler. Production must remain aligned
   with the infrastructure directive's AWS Fargate worker target; a staging
   equivalent requires explicit approval. A timer in every API replica is
   rejected.
4. Set operational polling/dispatch frequency. The product invariants remain
   date-based ingestion, exact stored-window graduation, and 48-hour recurrence;
   the worker may wake more often as long as durable buckets prevent early or
   duplicate mutation.
5. Decide whether staging automation remains disabled by default until a
   supervised dry-run proves the candidate counts.

No provider, environment, or database state should be changed merely by
approving this packet.

## Implementation Slices

### Slice A: Preview-Only Thin Coordinator

- Add a thin coordinator with an injected clock and explicit preview-only
  `runOnce()`. It owns no direct lifecycle writes.
- Enumerate active city-tier communities in deterministic order.
- Delegate to ingestion and graduation with explicit `dryRun: true`.
- Report recurrence as deferred: the existing recurrence service has no
  non-mutating preview API and no durable 48-hour cadence state.
- Catch failures independently per stage and city-tier community.
- Add no controller, startup hook, timer, worker process, schema, or
  write-enabled path in this slice.

`Pure coordinator` was inaccurate terminology: this component reads
communities and delegates to read-capable services. It is a thin orchestrator,
not a pure function.

### Slice B: Durable Run Ledger And Claiming

- Promote the approved worker/coordination boundary into
  `docs/specs/broadcast/radiyo-and-fair-play.md` before schema work.
- Add the approved Prisma model and migration.
- Add atomic claim/complete/fail semantics with unique cadence buckets.
- Prove two concurrent workers cannot both claim the same successful bucket.
- Add the recurrence preview/apply seam and city-tier revalidation required to
  enforce the 48-hour cadence through the ledger.
- Do not touch provider state.

### Slice C: Worker Process And Configuration

- Add `apps/workers/radiyo-lifecycle`.
- Add explicit enablement, dry-run, and bounded concurrency configuration.
- Default write automation to disabled.
- Add structured summaries without track/user private payloads or secrets.

### Slice D: Staging Proof

- Verify provider/database identity before any stateful action.
- Deploy to staging only.
- Run dry mode and compare candidates with existing manual endpoints.
- Enable write mode only after reviewed evidence.
- Prove restart, overlap, failure, and retry behavior.

## Required Runtime Files To Trace

- `apps/api/src/fair-play/fair-play-ingestion.service.ts`
- `apps/api/src/fair-play/fair-play-graduation.service.ts`
- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/src/fair-play/jobs/recurrence-aggregation.job.ts`
- `apps/api/src/fair-play/fair-play.module.ts`
- `apps/api/src/release-deck/release-deck-scheduling.service.ts`
- `apps/api/prisma/schema.prisma`
- corresponding focused tests under `apps/api/test/`

The executor must trace all callers before editing. At the current evidence
checkpoint, the manual controllers and tests are the only callers of ingestion
and graduation, and recurrence has only its job wrapper/tests.

## Acceptance And Anti-Regression Tests

- Slice A scans only in explicit preview mode; it has no automation trigger;
- only active city-tier communities are scanned;
- deterministic community order;
- one injected clock snapshot is shared across the preview run;
- due ingestion and graduation receive explicit dry-run delegation;
- recurrence is not called by Slice A;
- one scene's failure does not block other scenes;
- no state/national tier mutation;
- no tier propagation, voting, removal/floor, or Sect behavior;
- no modification of track, vote, or engagement history outside existing
  service contracts;
- dry mode performs no lifecycle mutation;
- logs contain counts/identifiers needed for operations but no secrets or
  direct personal data.

Slice B adds the remaining acceptance coverage: 48-hour recurrence cadence,
atomic claims, one concurrent winner, retryable failed leases, and no duplicate
completed bucket.

## Stop Conditions

Stop and return for approval if:

- the implementation requires a database migration before Slice B is approved;
- a provider/scheduler must be created or configured;
- multiple replicas cannot be coordinated without weakening the durable claim
  boundary;
- the executor discovers a conflict with the locked 10-day protected window or
  48-hour recurrence cadence;
- any proposal introduces tier propagation, promotion thresholds,
  `GRADUATION_CAP_PER_RUN` behavior, removal/floor policy, or state/national
  aggregation;
- the current manual services would need behavior changes rather than bounded
  orchestration.

## Recommended Next Signal

Approve or reject the dedicated-worker plus durable-run-ledger architecture.
If approved, execute Slice A only on a clean sole-writer branch/workspace and
send the committed result to one read-only reviewer before beginning the
schema-bearing Slice B.

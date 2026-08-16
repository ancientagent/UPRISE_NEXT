# City-Tier RADIYO Worker Slice A

Status: active execution packet
Date: 2026-08-16
Branch: `fable/handoff` (shared local sole-writer workspace)

## Current Evidence

- Release Deck scheduling persists eligible `ReleaseDeckSchedule` rows.
- `FairPlayIngestionService` transactionally moves due scheduled tracks into
  `NEW_RELEASES`; `FairPlayGraduationService` moves expired entries into
  `MAIN_ROTATION`.
- Both services are currently exposed through authenticated manual endpoints.
- No Fair Play worker invokes those services. The only comparable runtime
  pattern is the Registrar's disabled-by-default in-process trigger.

## Execution Packet

Lane: `uprise-fairplay-broadcast`

Owner Contract: `docs/specs/broadcast/radiyo-and-fair-play.md`

Starting Branch / HEAD: `fable/handoff` at the commit that adds this packet.

Must Read:

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `apps/api/src/fair-play/fair-play-ingestion.service.ts`
- `apps/api/src/fair-play/fair-play-graduation.service.ts`
- `apps/api/test/fair-play.ingestion.service.test.ts`
- `apps/api/test/fair-play.graduation.service.test.ts`

Do Not Read By Default: Sect implementation, tiers above city, web player/UI,
provider runbooks, preserved UX worktrees, and legacy docs.

Source Drift / Behavior To Correct: `not_applicable`. This is a first-pass
internal orchestration seam; it does not repair a user-visible defect.

Feature / Behavior Scope: add one internal `FairPlayLifecycleWorkerService`
that enumerates active city-tier communities and calls the existing ingestion
and graduation services once per community. It must return deterministic,
per-community results suitable for a later controlled runner.

Repo-Aspects To Verify:

- only active `tier='city'` communities are selected;
- one consistent UTC `asOf` value is passed to each service in a run;
- dry-run remains explicit and defaults to the existing service defaults only
  when caller has not selected a mode;
- service errors are isolated and represented in results rather than aborting
  subsequent city communities;
- no recurrence aggregation call is added.

Development Plan:

1. Add the internal worker service and Fair Play module provider/export wiring.
2. Use the existing service contracts directly; add no endpoint or trigger.
3. Add focused unit tests for enumeration, per-city invocation, error
   isolation, dry-run forwarding, and exclusion of inactive/non-city rows.
4. Do not change Prisma schema, migrations, env files, deployment config, or
   web code.

Plan Review: HY3 `upriseauditorminus` returned `REVISE` until the owner spec
authorized this narrow worker; that contract correction is included with this
packet. A bounded post-implementation HY3 review is required.

Files Likely Touched:

- `apps/api/src/fair-play/fair-play-lifecycle-worker.service.ts`
- `apps/api/src/fair-play/fair-play.module.ts`
- `apps/api/test/fair-play.lifecycle-worker.test.ts`
- current operations docs only when state materially changes.

Tests / Validation Seed:

- `pnpm --filter api test -- fair-play.lifecycle-worker.test.ts fair-play.ingestion.service.test.ts fair-play.graduation.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm run verify`
- `pnpm run workspace:audit`
- `git diff --check`

Expansion Conditions: a later worker trigger, recurrence scheduling, a
cross-instance lease, retry history, or deployment requires a new approved
schema/operations packet and owner review.

Stop Conditions: any need for a migration, provider configuration, a poll
interval/default, production runner, new public/admin endpoint, recurrence
automation, or a new Fair Play policy stops this slice.

Branch Owner: Codex local, sole writer.

Subagent Use: one fresh HY3 reviewer after implementation; no concurrent
writers.

## Executor Readiness

issue_active: yes
branch_verified: yes
owner_contract_identified: yes
source_drift_or_bug_identified: not_applicable
feature_reviewed_against_repo: yes
development_plan_written: yes
development_plan_reviewed: yes
files_and_tests_clear: yes
risk_impacts_named: yes
provider_or_db_risk: no
ready_for_executor: yes
blockers: none for the untriggered no-schema worker seam

## Deferred Durable Run / Lease Plan

A process-local `running` flag can prevent overlapping ticks only within one
Node process. It cannot coordinate replicas, survive process death, record
run history, or provide retry/observability. Before an automatic runner is
enabled in a multi-instance environment, approve a separate slice with:

- durable cross-instance lease acquisition and expiry/heartbeat;
- one run record containing start/end, owner, result counts, and errors;
- idempotent retry behavior tied to existing ingestion/graduation safety;
- recurrence cadence ownership, because recurrence must not change more often
  than its existing 48-hour contract;
- deployment ownership and a single-runner or shared-lease operational model.

## Closeout Contract

executor_completed: no
tests_passed: no
reviewer_required: yes
reviewer_passed: no
qa_required: no
qa_passed: not_required
drift_source_corrected_or_quarantined: not_applicable
owner_spec_changed: yes
owner_spec_verified: no
docs_handoff_required: yes
docs_handoff_done: yes
changelog_required: yes
changelog_done: yes
provider_state_touched: no
provider_identity_verified: not_required
schema_or_migration_touched: no
schema_or_migration_verified: not_required
linear_ready_to_close: no
blockers: durable runner/lease remains intentionally deferred
next_signal: implement the bounded worker, then run one independent review

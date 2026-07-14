# New Releases Graduation — Execution Plan And Handoff

**Date:** 2026-07-14  
**Branch:** `codex/new-releases-graduation`  
**Starting HEAD:** `375d06c`  
**Status:** complete and independently reviewed; local-only branch preserved

## A. Evidence Used

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/specs/system/documentation-framework.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/specs/admin/super-admin-controls.md`
- `docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md`
- current Fair Play schema, ingestion/controller/module, recurrence aggregation, and focused tests

## B. Current State Versus Deferred Or Unknown

Current repo truth:

- scheduled Release Deck tracks can be manually ingested into `NEW_RELEASES`;
- each ingested `RotationEntry` stores its locked `newWindowDays` value, currently `10`;
- recurrence aggregation already sums engagement scores over the configured rolling window, defaulting to `14` days;
- committed checkpoint `41a584b` adds the manual graduation service and
  `POST /admin/fair-play/graduation/run` dry-run/write endpoint;
- both manual Fair Play lifecycle endpoints are protected by `JwtAuthGuard`;
  full RBAC remains deferred.

Deferred or unresolved and therefore excluded:

- cron/queue automation;
- tier propagation, vote behavior, propagation caps, and removal/floor policy;
- any change to engagement history;
- graduation caps or pool-density policy;
- UI/operator tooling;
- schema or migration changes;
- new RBAC, super-admin enforcement, or audit-log infrastructure beyond the existing authenticated MVP admin primitive.

No founder decision is required for this slice. The owner architecture explicitly defines manual R1 graduation and the transition acceptance contract. The admin owner spec explicitly defers full RBAC, so this implementation must not imply that super-admin authorization is already active.

## Feature Review

The feature is a bounded Fair Play lifecycle transition:

- actor: an authenticated MVP operator using a manual endpoint;
- source state: a `NEW_RELEASES` rotation entry in an active city-tier community;
- eligibility invariant: `enteredPoolAt + newWindowDays <= asOf`;
- destination state: `MAIN_ROTATION`, with `graduatedAt` set and recurrence initialized from attributable engagement in the existing configured rolling window;
- preserved evidence: votes and engagement history remain untouched;
- systems-scale invariant: all selection is by `communityId` and per-entry state, with no city-, source-, artist-, or fixture-specific behavior.

The slice was a GO because the active owner architecture names it as Slice 5 and the transition was missing at the starting checkpoint. It is now implemented at `41a584b` pending final review closeout.

### Independent Plan Review Result

PASS at committed plan checkpoint `157d990`; no blocking findings.

The reviewer confirmed owner-contract alignment, recurrence parity, manual endpoint scope, current authentication wording, and the transaction/concurrency design. Two optional clarifications were accepted into this plan before implementation:

- `provider_or_db_risk` is `yes` because write mode mutates rotation rows transactionally, even though no schema, migration, provider, or infrastructure change is involved;
- eligibility always uses the stored `enteredPoolAt` timestamp without normalization. Canonical scheduled ingestion writes UTC day-start timestamps, while any legacy timestamped row retains its exact timestamp boundary.

## Execution Packet

Lane: API / Fair Play lifecycle  
Owner Contract: `docs/specs/broadcast/radiyo-and-fair-play.md`  
Starting Branch / HEAD: `codex/new-releases-graduation` / `375d06c`  
Must Read: the evidence list above, especially the Fair Play owner spec, admin auth boundary, Slice 5 architecture, and current Fair Play code/tests  
Do Not Read By Default: legacy mobile code, unrelated UX batch plans, propagation/Sect implementation slices, remote PR state  
Source Drift / Behavior To Correct: `not_applicable`; this is a first-pass implementation of a missing owner-defined transition  
Feature / Behavior Scope: manual dry-run/write graduation for one active city-tier community, exact per-entry window eligibility, deterministic recurrence initialization, structured counts/reasons, and no evidence rewrites  
Repo-Aspects To Verify: Prisma `RotationEntry` shape and indexes; recurrence window semantics; current admin guard; module wiring; transaction and race behavior; focused test conventions  
Development Plan: see below  
Plan Review: independent read-only Codex reviewer required before runtime edits  
Files Likely Touched: `apps/api/src/fair-play/fair-play-graduation.service.ts`, a graduation DTO/controller, `fair-play.module.ts`, focused API tests, this handoff, `docs/CHANGELOG.md`, and implementation-state wording in the active architecture if needed  
Tests / Validation Seed: focused graduation/controller/module tests; existing recurrence and Fair Play regressions; API typecheck; `pnpm run verify`; workspace audit; diff check  
Expansion Conditions: expand only if focused tests prove a small shared recurrence helper is required to prevent divergent scoring semantics  
Stop Conditions: owner-spec conflict; schema/provider change becomes necessary; authorization beyond the documented MVP guard becomes necessary; an unresolved product policy would change eligibility or scoring  
Branch Owner: Codex local, sole writer  
Subagent Use: independent read-only plan/code/product-contract reviewers only

## Development Plan

1. Add a Zod request contract for `{ communityId, asOf?, dryRun? }`, preserving the established `YYYY-MM-DD` format and `dryRun: true` default.
2. Add a dedicated graduation service that:
   - validates the target exists and is an active city-tier community;
   - normalizes `asOf` to the UTC start of the supplied/default day;
   - scans only that community's `NEW_RELEASES` entries in stable order;
   - computes each `eligibleAt` from the entry's own `enteredPoolAt` and `newWindowDays`;
   - treats non-positive/non-finite windows and inconsistent pre-graduated New Releases rows as explicit skips rather than silently applying policy;
   - reads the global recurrence rolling-window setting, defaulting to the existing `14` days;
   - sums existing `TrackEngagement.score` rows for eligible tracks over the inclusive `[asOf - rollingWindowDays, asOf]` interval;
   - returns dry-run `would_graduate` results without opening a transaction or writing;
   - in write mode, revalidates the community and entries inside one transaction, then conditionally updates each still-eligible row to `MAIN_ROTATION`, sets `graduatedAt = asOf`, and writes the computed recurrence score;
   - reports a deterministic skip when a concurrent run has already changed the row;
   - never writes Track, TrackEngagement, TrackVote, schedule, tier, or propagation state.
3. Add `POST /admin/fair-play/graduation/run` behind the same `JwtAuthGuard` used by the current MVP Fair Play ingestion endpoint. Do not label this as completed RBAC or super-admin enforcement.
4. Wire the controller/service into `FairPlayModule` without changing public rotation behavior.
5. Add focused tests covering:
   - exact eligibility boundary and use of each entry's stored window;
   - not-due and invalid-state skip reasons;
   - recurrence score sum, zero default, and configured rolling window;
   - dry-run read-only behavior;
   - write-mode transaction revalidation and conditional/idempotent update;
   - concurrent/no-longer-eligible skip behavior;
   - active city-tier validation;
   - DTO default/validation, controller delegation, guard metadata, and module construction;
   - no writes to votes, engagement history, schedules, tracks, tiers, or propagation state.
6. Update only implementation-state documentation and the changelog/handoff required by the repo. Do not change owner doctrine or activate deferred operations.
7. Commit a coherent implementation checkpoint, run focused validation, and send that committed HEAD to independent read-only code and product-contract reviewers. Address any blocking findings as the same sole writer, recommit, and re-review the correction before closeout.

## Risk Review

- Date boundary: use the owner contract's exact `<= asOf` rule against the unmodified stored `enteredPoolAt` timestamp. Canonical scheduled ingestion writes day-start timestamps, so day-granularity runs preserve the full locked window; a legacy timestamped row remains ineligible until its exact timestamp boundary. Do not reinterpret a supplied date as end-of-day.
- Concurrency: candidate discovery alone is insufficient. Write mode must re-read inside the transaction and use a conditional update so repeated/concurrent runs do not report duplicate graduation.
- Scoring drift: initial recurrence must use the same engagement source and rolling-window default as existing aggregation. If code sharing is introduced, it must not change existing aggregation outputs.
- Authorization wording: authentication is implemented; role-based admin authorization remains deferred. Tests and docs must state that boundary accurately.
- Evidence integrity: engagement and vote records are read-only. Graduation changes only the qualifying rotation row.

## Acceptance Criteria

- entries graduate exactly when `enteredPoolAt + newWindowDays <= asOf`;
- dry run reports what would graduate and performs no writes;
- write mode transactionally revalidates and conditionally changes qualifying rows;
- `pool` becomes `MAIN_ROTATION` and `graduatedAt` is set;
- recurrence score is initialized deterministically from the existing rolling engagement window, or `0` when no qualifying engagement exists;
- response counts and per-entry skipped reasons are stable and test-covered;
- votes, engagement history, schedules, propagation evidence, and tier state are not moved or rewritten;
- endpoint is authenticated using the current MVP guard without claiming unresolved RBAC exists;
- no schema, migration, cron, provider, UI, or remote-repo change occurs;
- focused tests, API typecheck, repo verification, workspace audit, diff check, and independent reviews pass on committed HEAD.

## Executor Readiness

issue_active: yes  
branch_verified: yes  
owner_contract_identified: yes  
source_drift_or_bug_identified: not_applicable  
feature_reviewed_against_repo: yes  
development_plan_written: yes  
development_plan_reviewed_by_codex: yes
files_and_tests_clear: yes  
risk_impacts_named: yes  
provider_or_db_risk: yes
ready_for_executor: yes
blockers: none

## Closeout Contract

reviewer_required: yes  
reviewer_passed: yes
qa_required: yes  
qa_passed: yes
focused_tests_passed: yes (10 suites, 52 tests)
package_typecheck_passed: yes
repo_verify_passed: yes
workspace_audit_passed: yes
worktree_clean: yes
owner_spec_verified: yes
docs_handoff_required: yes  
docs_handoff_done: yes
changelog_required: yes  
changelog_done: yes
provider_state_touched: no  
provider_identity_verified: not_required  
schema_or_migration_touched: no  
schema_or_migration_verified: not_required  
linear_ready_to_close: not_applicable  
blockers: none
next_signal: review Slice 6 official Sect and song-level backing against current owner contracts before any schema implementation

## Implementation Checkpoint

Implemented by the sole branch writer:

- `FairPlayGraduationService` with active city-tier validation, exact stored-timestamp window evaluation, recurrence snapshot reads, dry-run output, transactional write revalidation, and conditional idempotent row updates;
- `FairPlayGraduationController` and Zod DTO for `POST /admin/fair-play/graduation/run`, guarded by the current `JwtAuthGuard` boundary;
- Fair Play module provider/controller/export wiring;
- focused service, controller, and module tests;
- owner/admin implementation-status, architecture-state, changelog, and handoff updates without changing deferred policy.

Validation on committed implementation checkpoint `41a584b`:

- focused Fair Play API regressions: 10 suites, 52 tests passed;
- API typecheck: passed;
- `pnpm run verify`: passed;
- `pnpm run workspace:audit`: passed with 66 registered entries;
- `git diff --check`: passed.
- full API suite attempted: 56 of 59 suites and 530 of 540 tests passed; the
  three database-backed integration suites (`communities.test.ts`,
  `registrar.invite-delivery.integration.test.ts`, and
  `registrar.invite-delivery.replay.integration.test.ts`) could not connect to
  PostgreSQL at `localhost:5432`, so this is classified as an environment
  limitation rather than a graduation implementation failure.

No schema, migration, provider, remote-repo, cron/queue, UI, vote, engagement-history, schedule, tier, or propagation mutation was added.

First product-contract review found no runtime/product drift. It requested this
bounded documentation correction because the earlier planning/current-state
language still described graduation as missing after `41a584b` implemented it.

Independent code review passed checkpoint `41a584b` with no critical or
important findings. Non-blocking carry-forward notes are to add a non-default
recurrence-window regression if this scoring path changes, replace permissive
internal `any` types during a future contract-typing pass, and monitor the
full-community New Releases scan if active pool volume grows enough to justify
a separately specified pagination or index change.

The bounded product documentation re-review passed at `b333d79`; it confirmed
the current-state, closeout routing, deferred RBAC wording, and lack of product
overstatement. The implementation branch is preserved locally and has not been
pushed or opened as a PR.

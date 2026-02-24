# 2026-02-24 — Platform-Wide MVP Roadmap + Phase 3 Kickoff

## Scope Lock
1. Publish one canonical execution roadmap for the entire platform MVP (not registrar-only).
2. Keep roadmap canon/spec-driven with no new product semantics added.
3. Define phase order, lane ownership, and PR-safe slice sequencing.
4. Start Phase 3 execution from the deferred registrar/capability backlog.
5. Preserve additive-first migration and rollback discipline.

## Out of Scope
- Shipping every MVP feature in one change.
- Unapproved CTA or UI action additions.
- Destructive schema removals in kickoff slices.
- Replacing canon/spec authority with ad-hoc implementation choices.

## Evidence Base
- `docs/specs/README.md` (platform spec inventory)
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/specs/communities/*.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/*.md`
- `docs/specs/social/message-boards-groups-blast.md`
- `docs/specs/system/moderation-and-quality-control.md`
- `docs/specs/admin/super-admin-controls.md`

## Program Status Baseline (as of 2026-02-24)
- Phase 1 (Identity + canonical Artist/Band migration): complete.
- Phase 2 (Registrar invite lifecycle hardening + worker/provider seams + DB lanes): complete.
- Phase 3 starts now and expands from registrar/capability completion to the broader MVP execution track.

## Platform MVP Roadmap (Single Program Plan)

### Phase 0 — Program Safety Rails (maintain continuously)
- Canon/spec lock discipline, no feature drift, no placeholder CTAs.
- Web-tier boundary enforcement and infra policy checks.
- Shared contract hygiene (`packages/types`) and CI gate consistency.

### Phase 1 — Identity & Registrar Foundation (completed)
- Canonical Artist/Band linked-entity model.
- Registrar artist intake, materialization, invite dispatch/claim lifecycle.
- Transitional `User.isArtist` removal and contract cleanup.

### Phase 2 — Registrar Invite Delivery Reliability (completed)
- Delivery state hardening, worker seam, trigger lane, replay safety.
- Provider seam hardening (webhook/noop path, URL/timeout guards).
- DB-backed invite lifecycle integration lanes.

### Phase 3 — Capability Completion + Registrar Expansion (in progress)
- Role registration code issuance/verification workflows.
- Promoter capability progression beyond submission intake.
- Project registration endpoint/status lifecycle.
- Sect motion lifecycle + approval state machine.
- Capability grant audit/admin role-management surfaces.

### Phase 4 — Communities Core
- Plot + scene switching, scene map/metrics baseline.
- Scenes/Uprises/Sects execution behavior needed for MVP.
- Civic constraints preserved under Home Scene policy.

### Phase 5 — Broadcast + Core Signals
- RaDIYo and Fair Play execution lane.
- Signal/universal action wiring required for platform behavior.
- Guardrails ensuring registrar outcomes do not bypass Fair Play.

### Phase 6 — Discovery + Social + Events/Economy MVP
- Vibe/taste discovery essentials and profile-linked read consistency.
- Message boards/groups/blast MVP implementation.
- Events/flyers lifecycle.
- Print Shop/promotions + pricing baseline needed for MVP release.

### Phase 7 — Moderation/Admin/Launch Readiness
- Moderation and quality control controls.
- Super-admin essential operations.
- Edge-case/compliance checklist closure.
- Final QA hardening and release go/no-go criteria.

## Phase 3 Execution Slices (Kickoff Queue)

1. Slice 88: Program kickoff + roadmap publication (this doc + changelog/index updates).
2. Slice 89: `RegistrarCode` additive persistence foundation (schema + migration + internal primitives + tests).
3. Slice 90: Role-code verification read/write service path + auth-safe redemption primitive.
4. Slice 91: Promoter capability grant transition states and submitter/admin read visibility.
5. Slice 92: Capability grant audit log persistence + read surface.
6. Slice 93: Project registrar submit/status APIs (additive; no destructive migration).
7. Slice 94: Sect motion submit/status skeleton with explicit lifecycle states.

## Migration, Risk, Rollback Policy (All Phases)
- Migrations: additive columns/tables first; destructive removals only in explicit deprecation slices.
- Risk controls:
  - per-slice scope lock and out-of-scope declaration,
  - required validation gate before handoff,
  - spec/canon citations for user-facing actions.
- Rollback:
  - prefer single-commit reverts for behavior slices,
  - forward-fix only when revert risks data loss,
  - no hidden data rewrites.

## Validation Gate Per Slice
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- targeted tests for touched modules
- relevant typecheck/build
- DB-backed lane when migration/stateful integration behavior is touched

## Immediate Next Action
- Proceed to Slice 89 (`RegistrarCode` foundation) after resolving one open policy ambiguity:
  - code issuer authority and status precondition for issuance.

## Resolution Note (2026-02-24)
- Ambiguity resolved in `docs/handoff/2026-02-24_registrarcode-issuance-authority-and-status-preconditions.md`.
- Locked policy:
  - issuer authority = system-only trusted registrar API path,
  - issuance precondition = linked registrar entry status `approved` (promoter capability flow scope for Phase 3 kickoff).

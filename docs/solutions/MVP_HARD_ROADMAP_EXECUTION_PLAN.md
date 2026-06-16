# MVP Hard Roadmap Execution Plan (Spec-Locked)

**Status:** Active execution plan  
**Last Updated:** 2026-02-28  
**Owner:** Platform orchestration (human + multi-agent lanes)

## 1. Purpose
This plan is the operational source of truth for getting from current registrar-heavy progress to full MVP readiness without feature drift.

This document is execution-only (not product canon). Product behavior remains defined by `docs/specs/**` and canon docs.

## 2. Non-Negotiable Constraints
- No feature drift beyond specs.
- No placeholder or speculative CTAs.
- Web-tier boundary remains strict (`apps/web/WEB_TIER_BOUNDARY.md`).
- No assumption-based product decisions when canon/spec is ambiguous; stop and ask founder.
- Throughput runs require rollback checkpoints (`docs/solutions/ROLLBACK_CHECKPOINT_CHEATSHEET.md`).
- Throughput runs must obey phase stop-gate control (`docs/solutions/PHASE_STOP_GATE_PLAYBOOK.md`); do not keep seeding batches after convergence without an explicit acceptance/closeout decision.

## 3. Baseline Snapshot (2026-02-28)
Observed from lane queue files (`.reliant/queue/mvp-lane-*.json`):
- Lane queue files: 35
- Total seeded lane tasks tracked: 271
- Done: 262
- Queued: 9
- In progress: 0
- Blocked: 0
- Lane completion on seeded registrar throughput queues: **96.7%**

Important: This is queue throughput completion, not whole-product MVP completion.

## 4. Current Program Position
### 4.1 Largely complete
- Registrar API/service/read-contract hardening and invite lifecycle reliability.
- Queue/supervisor reliability hardening and rollback governance.
- Repeated QA/review batch closeouts for registrar-focused work.

### 4.2 Not yet complete to MVP launch standard
- Unified web UX/UI flow across the full MVP surface set.
- Communities/Broadcast/Core Signals end-to-end behavior closure.
- Discovery/Social/Events/Economy MVP surface closure.
- Founder-driven UX review, integrated UAT, launch checklist closure.

## 5. Parallel Lane Model (Use for Remainder)
Maintain 5 lanes in parallel with strict scope boundaries:
- Lane A: API/core behavior and policy guards
- Lane B: Web contracts + UX implementation (spec-authorized)
- Lane C: Invite/code integration + state integrity
- Lane D: Automation/reliability/tooling
- Lane E: QA/docs/review/risk closeout

Rule: one task per lane runtime at a time; no multi-claim in a lane.

## 6. Hard Roadmap to MVP

## Phase R1 — Backlog Hygiene + Flow Lock (1-2 days)
Goal: eliminate stale queue/state drift and publish definitive MVP flow map before more implementation.

Required outputs:
- Resolve remaining queued/stale tasks in legacy queues.
- Publish an MVP flow map doc that links each user-visible flow to spec files.
- Freeze a prioritized execution backlog grouped by flow.

Exit criteria:
- No stale runtimes.
- No queue summary drift.
- Flow map approved by founder.

## Phase R2 — Web UX/UI Foundation (primary next build phase)
Goal: implement cohesive web-first UX for already-spec'd MVP flows before mobile port.

Spec anchors:
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/registrar.md`
- `docs/specs/core/signals-and-universal-actions.md`

Execution focus:
- Build consistent page-level flow from onboarding -> plot -> registrar/actions.
- Keep all actions API-backed and spec-authorized only.
- Add UX polish, loading/error/empty-state parity, and route-level integration tests.

Exit criteria:
- Founder review pass on web flow coherence.
- No unresolved critical UX blockers in MVP paths.
- Typecheck/tests/docs lint green.

Stop-batching criteria:
- If recent R2 batches are converging cleanly and remaining work is acceptance-oriented rather than implementation-oriented, stop seeding general UX batches.
- Produce readiness review + founder walkthrough + explicit closeout/delta decision before any additional broad R2 queue prep.

## Phase R3 — Core MVP Feature Closure (communities + broadcast + signals)
Goal: close core product behavior required for MVP usage loops.

Spec anchors:
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/specs/core/signals-and-universal-actions.md`

Exit criteria:
- End-to-end flows work in web + API for core loop.
- No spec gaps for implemented behavior.
- QA replay and risk memo completed.

## Phase R4 — Remaining MVP Surfaces (discovery/social/events/economy)
Goal: implement MVP-minimum versions of remaining non-core but required surfaces.

Spec anchors:
- `docs/specs/discovery/vibe-check-and-taste-profiles.md`
- `docs/specs/social/message-boards-groups-blast.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/economy/revenue-and-pricing.md`

Exit criteria:
- MVP-minimum scope delivered with explicit deferred list.
- Founder acceptance of deferred boundaries.
- Consolidated QA/review gates green.

## Phase R5 — Launch Readiness + Portability
Goal: release-ready web MVP and prepare controlled mobile port.

Spec anchors:
- `docs/specs/system/moderation-and-quality-control.md`
- `docs/specs/system/edge-cases-and-compliance.md`
- `docs/specs/admin/super-admin-controls.md`

Execution focus:
- Full UAT matrix + bug burn-down.
- Launch checklist and rollback drills.
- Web-to-mobile port plan (React Native) from stabilized web flows.

Exit criteria:
- Founder sign-off for MVP launch.
- Release checklist complete.
- Mobile port backlog prioritized from proven web flows.

## 7. Stop-and-Ask Triggers (Mandatory)
Stop execution and request founder decision when any of these occur:
- A required behavior is not explicitly defined in canon/spec.
- A UI action could imply new product semantics.
- Competing interpretations exist across docs.
- A slice would add endpoint/schema/role behavior not explicitly authorized.

## 8. Throughput Cadence
Recommended cadence:
- Seed in 5-lane packs (30 slices = 6 per lane) for each batch.
- Require Lane E closeout slices in every batch (QA/review/doc sync).
- Create checkpoint commit/tag at each batch boundary.
- Merge only after all lane queues in the batch report `queued=0,in_progress=0`.

## 9. Verification Standard (Per Slice)
Run task `verifyCommand` exactly. For roadmap-level gates, minimum standard:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- target tests from slice scope
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## 10. Immediate Next Action
1. Finish Phase R1 by publishing a spec-linked MVP flow map and cleaning remaining stale/legacy queue tasks.
2. Start Phase R2 queue seeding focused on web UX/UI flow slices (spec-linked, no new semantics).
3. Keep 5-lane execution active with checkpoint-at-batch-boundary discipline.

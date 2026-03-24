# MVP UX Batch27 Execution Plan

## Objective
Run a 5-lane closeout batch against the current `feat/ux-founder-locks-and-harness` branch state without reopening already-verified Discover and artist-surface work.

This batch is not greenfield feature implementation. It is a constrained remaining-work pass that assumes the following are already materially complete on the branch:
- Discover travel hydration
- Retune flow
- explicit `Visit [Community Name]` handoff
- local artist/song Discover results
- artist page destination routing
- song-link autoplay handoff
- runtime track creation for QA/setup
- registrar signed-out state clarity
- favicon/runtime noise cleanup

## Required Reading (all lanes)
1. `AGENTS.md`
2. `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
3. `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
4. `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
5. `docs/handoff/2026-03-23_discover-verification-and-runtime-cleanup.md`
6. `docs/handoff/2026-03-23_runtime-track-create-path.md`
7. `docs/handoff/2026-03-23_track-create-spec-reconciliation.md`
8. `docs/handoff/2026-03-23_discover-plot-auth-state-hardening.md`

## Current Branch Baseline
Batch27 starts from a branch that already contains:
- `5666ab7` Discover contracts + artist destination flow
- `3ffa011` Discover scope normalization
- `09d6ba4` Discover public-read runtime/CORS fix
- `8a44e0a` API dev build/runtime fix
- `62c2763` strict full-tuple community identity rendering
- `af48886` verified Discover flows + registrar/favicon cleanup
- `c80f1a9` runtime track creation
- `e340638` track-create spec reconciliation
- `a057c4a` Discover/Plot auth-state hardening

## Remaining Scope Only
### In scope
1. Fresh QA sweep on current `HEAD`
2. Triage only current reproducible defects
3. Fix any remaining narrow runtime/UX regressions
4. Add regression coverage for any bugfixes in this batch
5. Produce merge/readiness closeout evidence

### Explicitly out of scope
- re-planning Discover from scratch
- broad map/exploration redesign
- new artist-page feature expansion
- event-page redesign
- monetization or pricing changes
- broad canon rewrite beyond direct implementation reconciliation

## Lane Ownership

### Lane A: Web Surface Residuals
Primary surfaces:
- `apps/web/src/app/discover/page.tsx`
- `apps/web/src/app/community/[id]/page.tsx`
- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/src/app/registrar/page.tsx`
- `apps/web/src/app/onboarding/page.tsx`

Scope:
- fix only current, reproduced UX/state defects in routed web surfaces
- preserve founder-lock behavior
- do not reopen already-verified Discover behavior without new evidence

Acceptance:
- no dead-end CTA exposure
- no false empty/error states where auth/context is the real condition
- no identity regressions

### Lane B: API / Runtime Residuals
Primary surfaces:
- `apps/api/src/communities/**`
- `apps/api/src/tracks/**`
- `apps/api/src/artist-bands/**`
- `apps/api/src/onboarding/**`

Scope:
- fix only current API/runtime defects surfaced by live QA
- preserve the implemented `POST /tracks` support contract
- keep read/write auth boundaries intentional and explicit

Acceptance:
- runtime defects have exact API cause/fix evidence
- no drift in discovery, artist, or track contracts

### Lane C: Continuity / Routing / State
Primary surfaces:
- route-to-route handoff flows
- onboarding-to-plot/discover continuity
- discover-to-community/artist continuity

Scope:
- close any remaining continuity gaps between already-implemented surfaces
- prioritize client state ownership and route entry correctness

Acceptance:
- onboarding -> plot/discover continuity is deterministic
- discover -> community/artist/song continuity is deterministic
- no stale persisted-state dependence beyond intended behavior

### Lane D: Regression Locks / Verification
Primary surfaces:
- targeted tests in `apps/web/__tests__`
- targeted tests in `apps/api/test`

Scope:
- add or tighten regression coverage for any residual bugfixes
- keep test scope narrow and evidence-driven

Acceptance:
- each new bugfix has focused regression protection where practical
- verification commands are recorded exactly

### Lane E: QA / Closeout
Primary surfaces:
- live app verification on current branch
- defect triage
- closeout evidence

Scope:
- rerun QA only against current `HEAD`
- report only current reproducible defects
- stop when no current repro defects remain in scoped surfaces

Acceptance:
- stale findings are discarded
- remaining findings, if any, are exact and reproducible
- branch is ready for merge/readiness review when no scoped defects remain

## Queue Intent
If queues are created for Batch27, they should be remaining-work queues only.

Do not seed any lane with tasks that duplicate already-completed Discover/runtime work from the current branch history.

## Validation
Minimum verification for any Batch27 implementation slice:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- targeted typecheck and tests for touched files
- live QA replay if the slice affects routed behavior

## Exit Criteria
Batch27 is complete when:
- a fresh QA sweep on current `HEAD` yields no current reproducible scoped defects
- any residual defects found during the sweep are fixed and re-verified
- regression coverage is updated for touched runtime fixes
- branch state is documented clearly enough for merge/readiness review

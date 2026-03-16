# GPT-5.4 Oversight Handoff (2026-03-15)

## Intended Use
Open a fresh GPT-5.4 session for:
- UI/UX review
- drift prevention
- computer-use/browser verification
- design/implementation oversight

Keep code-edit execution lanes on GPT-5.3 Codex.

## Repository + Branch State
- Primary repo: `/home/baris/UPRISE_NEXT`
- Windows mirror: `/mnt/c/dev/UPRISE_NEXT`
- Current working branch for new UX docs/queues:
  - `feat/ux-master-lock-batch16`
- Current commit on that branch:
  - `99ecde1`

Important:
- GitHub connector will only see pushed branch state, not local-only uncommitted changes.
- At the time of this handoff, the branch contains pushed Batch16 queue/plan/master-lock work.
- There are also local uncommitted docs-only additions related to Batch16 drift watchlist:
  - `docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md`
  - `docs/handoff/2026-03-15_batch16-drift-watchlist.md`
  - plus related updates in `docs/solutions/README.md` and `docs/CHANGELOG.md`

## Source-of-Truth Rule
If documents conflict, use this precedence:
1. `docs/canon/*`
2. `docs/specs/*`
3. `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
4. other `docs/solutions/*`
5. `docs/legacy/*` reference only

Legacy UX is architecture reference only.  
If legacy differs from current lock/spec, current lock/spec wins.

## Required Reading Order
1. `AGENTS.md`
2. `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
3. `docs/RUNBOOK.md`
4. `docs/FEATURE_DRIFT_GUARDRAILS.md`
5. `docs/architecture/UPRISE_OVERVIEW.md`
6. `docs/PROJECT_STRUCTURE.md`
7. `apps/web/WEB_TIER_BOUNDARY.md`
8. `docs/AGENT_STRATEGY_AND_HANDOFF.md`
9. `docs/README.md`
10. `docs/solutions/README.md`
11. `docs/solutions/SESSION_STANDING_DIRECTIVES.md`
12. `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
13. `docs/solutions/MVP_UX_BATCH16_EXECUTION_PLAN.md`
14. `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
15. `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
16. `docs/specs/users/onboarding-home-scene-resolution.md`
17. `docs/specs/communities/plot-and-scene-plot.md`

If local repo access is unavailable and only GitHub connector is being used, explicitly note which of the above are visible from connector state and which local deltas were provided separately.

## Current MVP UX Position

### Locked
- `/plot` is the main scene dashboard route.
- Top stack remains:
  - profile strip
  - player strip
  - plot tabs
  - active tab body
  - bottom nav
- Player is outside Plot tab body ownership.
- Profile expand/collapse and player mode changes are route-stable.
- Tier model is:
  - `City`
  - `State`
  - `National`
- Onboarding Home Scene resolution + GPS voting-only gate are locked.
- Legacy UX may inform proportions/architecture only, not behavior.

### Batch16 Focus
- Lane A: Plot section overhaul
- Lane B: Discovery closure
- Lane C: Player/Profile parity closeout
- Lane D: automation/reliability guardrails
- Lane E: QA/review/founder checklist closeout

## Batch16 Queue Files
- `.reliant/queue/mvp-lane-a-ux-plot-batch16.json`
- `.reliant/queue/mvp-lane-b-ux-discovery-batch16.json`
- `.reliant/queue/mvp-lane-c-ux-player-profile-batch16.json`
- `.reliant/queue/mvp-lane-d-ux-automation-batch16.json`
- `.reliant/queue/mvp-lane-e-ux-qarev-batch16.json`

## High-Value Docs for Oversight
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_BATCH16_EXECUTION_PLAN.md`
- `docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md` (local delta if not yet pushed)
- `docs/solutions/MVP_FOUNDER_DECISION_REGISTER_R1.md`
- `docs/solutions/MVP_PLATFORM_COVERAGE_MATRIX_R1.md`

## Drift Watch Responsibilities for GPT-5.4
Use GPT-5.4 as a reviewer/overseer, not as the primary batch executor.

Primary responsibilities:
- detect UX drift before/after lane completion
- compare rendered UI against locked docs
- verify no speculative controls/CTAs/features
- call out contradictions between code and source-of-truth docs
- use browser/computer-use checks to verify real behavior

Required output shape for each review:
1. PASS/FAIL summary
2. severity-ordered drift findings
3. minimal required fixes
4. regression checks to run

## Hard Rules
- Do not infer behavior from platform norms.
- Do not add product semantics when docs are silent.
- If canon/spec is silent or conflicting, stop and ask the founder one precise question.
- Treat GitHub connector state as branch-specific. Confirm branch before reviewing.

## Model Split Guidance
- GPT-5.4:
  - planning
  - UI review
  - drift prevention
  - computer-use/browser inspection
- GPT-5.3 Codex:
  - lane execution
  - file edits
  - queue-driven implementation
  - verification runs

## Paste-Ready Bootstrap Prompt for New GPT-5.4 Session

```text
You are supporting UPRISE_NEXT as a UI + drift-prevention copilot.

GitHub connector context:
- Use branch `feat/ux-master-lock-batch16`.
- If connector cannot see local-only docs, treat these as local deltas provided by operator:
  - docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md
  - docs/handoff/2026-03-15_batch16-drift-watchlist.md
  - related README/changelog edits

Do not assume `main` is the active UX branch.

Read first:
1. AGENTS.md
2. docs/solutions/MVP_UX_MASTER_LOCK_R1.md
3. docs/solutions/MVP_UX_BATCH16_EXECUTION_PLAN.md
4. docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md
5. docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md
6. docs/specs/users/onboarding-home-scene-resolution.md
7. docs/specs/communities/plot-and-scene-plot.md
8. docs/solutions/MVP_FOUNDER_DECISION_REGISTER_R1.md
9. docs/solutions/MVP_PLATFORM_COVERAGE_MATRIX_R1.md
10. docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md (if available)

Your role:
- UI/UX review and drift prevention only.
- Use browser/computer-use checks when useful.
- Do not execute queue lanes unless explicitly asked.

Return first:
1. Top 10 Batch16 drift risks
2. Per-lane review checklist
3. Any contradictions across docs
4. Any rendered UI checkpoints that should be inspected live before accepting lane output
```

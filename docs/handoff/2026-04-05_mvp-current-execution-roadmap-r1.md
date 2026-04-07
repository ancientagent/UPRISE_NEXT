# 2026-04-05 — MVP Current Execution Roadmap R1

## Scope
Publish a refreshed execution roadmap that reflects current repo reality and recent founder locks, instead of relying on the older registrar-heavy phased roadmap alone.

## Added
- `docs/solutions/MVP_CURRENT_EXECUTION_ROADMAP_R1.md`

## What changed
- Reframed MVP progress around current web-tier reality (`apps/web`, `apps/api`, `apps/socket`, `apps/workers`).
- Explicitly incorporated the current shell doctrine:
  - `Home` left nav
  - `Discover` right nav
  - `Plot` inside `Home`
  - persistent player as governing system
- Added a dedicated hosted-environment cutover phase so Neon is no longer only implied by infra policy.
- Added immediate next-sequence guidance tying current founder-lock work to Discover closure and hosted MVP readiness.

## Why
The existing roadmap docs remained useful, but they were still weighted toward earlier registrar/invite throughput phases and did not cleanly reflect:
- the newer surface-contract locks,
- the AutoHarness/doctrine layer,
- the current Discover/player/scope focus,
- or the outstanding hosted-environment / Neon cutover need.

## Follow-up
- Use this roadmap for current MVP sequencing.
- Keep product behavior authority in specs/canon and founder locks.
- Update this roadmap when Discover moves from planning into implementation and when the hosted Neon cutover is scheduled.

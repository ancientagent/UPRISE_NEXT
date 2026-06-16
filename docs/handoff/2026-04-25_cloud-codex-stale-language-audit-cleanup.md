# 2026-04-25 — Cloud Codex Stale-Language Audit Cleanup

## Summary
Applied the accepted findings from the Cloud Codex audit-only stale-language report.

## Accepted And Patched
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/solutions/MVP_CURRENT_EXECUTION_ROADMAP_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_MOBILE_UX_MAPPING_FROM_PLOT_PROTOTYPE_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`

## Cleanup Rules Applied
- Current MVP Plot tabs are `Feed`, `Events`, and `Archive`.
- `Archive` is the current user-facing descriptive stats/history lane.
- `Statistics` may remain as internal API/component/contract terminology where it is clearly not the active user-facing tab label.
- `Promotions` may remain only as deferred/non-tab language unless explicitly reactivated.
- Historical docs were not rewritten.
- Discover disabled / `Coming Soon` language remains allowed only because `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md` explicitly authorizes that deferred state.

## Deferred / Not Changed
- Historical prompt packs and old handoffs were left intact.
- Internal component names such as `StatisticsPanel` were left as runtime/internal naming debt.
- Broader business/promo activation remains deferred.

## Verification
- `pnpm run docs:lint`
- `git diff --check`

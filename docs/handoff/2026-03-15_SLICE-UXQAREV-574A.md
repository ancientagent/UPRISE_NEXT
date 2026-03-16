# SLICE-UXQAREV-574A

Date: 2026-03-15
Lane: E - QA/Docs/Closeout
Task: Batch16 founder checklist closeout

## Founder Walkthrough Checklist

### Pre-Walkthrough Gates
- Confirm `Home Scene` is present before entering `/plot`.
- Confirm the walkthrough build is using current Batch16 sources of truth:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
  - `docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md`
  - `docs/specs/users/onboarding-home-scene-resolution.md`
  - `docs/specs/communities/plot-and-scene-plot.md`
- Do not treat Social as founder-approved MVP scope until the active lock conflict is resolved.

### Completed UX Locks To Walk
- Onboarding/Home Scene
  - Home Scene resolution is required before stable `/plot` anchoring.
  - GPS remains voting-only, not a participation gate.
  - Inactive selected city routes to the nearest active city-tier scene for the selected parent community.
  - Pioneer follow-up is expected from the profile-strip notification surface.
- Discovery
  - Discovery states remain deterministic: sign-in, idle, loading, error, empty, results.
  - Discovery scene-card/client/context replay passed in `SLICE-UXQAREV-571A`.
- Plot read surfaces
  - Feed, Events, Promotions, and Statistics targeted replays passed in `SLICE-UXQAREV-570A`.
  - Feed remains scene-scoped and non-personalized.
  - Statistics stays tier-scoped with the parent music-community anchor preserved.
- Player/Profile interaction locks that are currently covered by passing gates
  - `RADIYO` and `Collection` labels remain explicit.
  - Collection entry remains selection-driven with explicit eject return.
  - Tier-title parity for `City`, `State`, and `National` is covered by the current replayed tests.
  - Engagement wheel action sets remain mode-specific in source.

### Known Implementation Risks To Call Out During Walkthrough
- `/plot` still renders a Social tab even though the master lock marks Social deferred for MVP.
- Active-tier tap stop behavior is not yet enforced by the current player interaction path.
- Collapsed profile strip still contains unauthorized MVP elements beyond username, notifications, and `...`.
- Expanded profile composition still behaves like a scaffold, not the fully locked workspace order.

### Unresolved Founder Decision Register Items Relevant To This Walkthrough
- `R1-DEC-003`
  - Canonical Main Rotation recurrence mapping model is still unresolved.
- `R1-DEC-010`
  - Discovery Pass final pricing is unresolved.
- `R1-DEC-011`
  - Play Pass final pricing is unresolved.
- `R1-DEC-012`
  - Promotional-slot mechanics vs Fair Play boundaries are unresolved.
- `R1-DEC-013`
  - Statistics/Scene Map aggregation window policy is unresolved.
- `R1-DEC-014`
  - Geo aggregation granularity and privacy floor for map/stat visibility are unresolved.
- `R1-DEC-015`
  - Top 40 tie-break policy is unresolved.

### Unresolved Register Items Outside Immediate Batch16 Walkthrough Scope
- `R1-DEC-001` and `R1-DEC-002`
  - propagation thresholds remain unresolved.
- `R1-DEC-004` and `R1-DEC-005`
  - Fair Play graduation formula/cap remain unresolved.
- `R1-DEC-006` and `R1-DEC-007`
  - Activity Points scoring/decay remain unresolved.
- `R1-DEC-008` and `R1-DEC-009`
  - moderation auto-flag thresholds and appeal timelines remain unresolved.

## Recommendation
- Treat the Social-tab conflict as a founder-walkthrough blocker, not minor polish.

## Verification
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck
```

Result: passed.

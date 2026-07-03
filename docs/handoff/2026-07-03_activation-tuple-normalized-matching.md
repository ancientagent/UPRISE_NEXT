# Activation Tuple Normalized Matching

Date: 2026-07-03

Branch: `test/activation-tuple-normalized-matching`

Task: `UPRISE-PLAN-008`

## Summary

This slice hardens manual source-driven Home Scene activation so existing inactive city-tier scenes are matched through the same normalized tuple comparison used by activation diagnostics.

Before this slice, activation diagnostics and listener filtering used normalized `city + state + musicCommunity` keys, and source reanchor used source IDs derived from the diagnostic candidate. The remaining weak point was existing inactive `Community` lookup: it used exact case-insensitive equality and could miss edge-spacing drift in stored community rows. That could make activation create a duplicate natural scene instead of activating the existing inactive scene.

## Runtime Change

- `AdminAnalyticsService.findCityTierCommunityByTuple` now fetches city-tier candidate rows using DB-side token-bounded containment, filters them through `activationTupleKey`, and deterministically prefers active rows before `id` order if duplicate normalized rows exist.
- `AdminAnalyticsService.findActivationListeners` now uses DB-side token-bounded city/state containment plus normalized in-memory tuple filtering so casing and whitespace drift do not skip eligible listener cutover rows.
- `activationTupleKey` now normalizes leading/trailing and internal whitespace before lowercasing tuple parts.
- The activation transaction still derives `activationCity`, `activationState`, `activationMusicCommunity`, and source IDs from the transaction-time diagnostic candidate.
- Source/listener mutations remain scoped to the normalized candidate tuple.
- Existing track, vote, rotation, and engagement rows are not moved.

## Test Coverage

- `apps/api/test/admin-analytics.service.test.ts` now proves an inactive natural scene with casing/internal-spacing drift is updated instead of duplicating the scene.
- Existing normalized listener/source cutover coverage remains in place.

## Review

This branch required an independent Codex review because it touches runtime activation behavior. The reviewer checked this branch against:

- `docs/specs/system/registrar.md#source-origin-contract`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/users/onboarding-home-scene-resolution.md#proxy-to-natural-cutover-user-contract`

Reviewer result: approve. Earlier reviewer findings around deterministic duplicate-row selection and unbounded in-memory scans were addressed before PR by adding active-first deterministic sorting, internal whitespace normalization, and DB-side token-bounded query filters before normalized in-memory exact matching.

## Validation

```bash
pnpm --filter api test -- admin-analytics.service.test.ts users.profile.collection.test.ts --runInBand
pnpm --filter api typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Provider / DB / Schema / Art

None touched.

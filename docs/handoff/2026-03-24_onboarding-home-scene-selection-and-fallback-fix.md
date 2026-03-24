# 2026-03-24 — Onboarding home-scene selection and fallback fix

## Surface

- `/onboarding`
- `apps/web/src/lib/onboarding/review-resolution.ts`

## Source of truth

- `AGENTS.md`
- `docs/handoff/2026-03-24_session-context-reconciliation.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`

## Current repro

- `apps/web/src/app/onboarding/page.tsx` allowed free-text `Music Community` entry via `input + datalist`, which violated the selection-only parent-community rule.
- Unsigned onboarding only persisted the selected `{city, state, musicCommunity}` tuple locally and advanced to review. It did not resolve or display deterministic fallback/pioneer review state for valid Home Scene tuples, so the review step skipped the locked fallback behavior unless auth-backed onboarding ran.

## Fix

- Replaced the free-text `Music Community` control with a strict `select` sourced from the approved `MUSIC_COMMUNITIES` list already used on current HEAD.
- Added `apps/web/src/lib/onboarding/review-resolution.ts` as a tightly scoped helper for:
  - approved selection normalization
  - deterministic onboarding review resolution
  - exact active-scene carry-through
  - same-state active fallback
  - same-community fallback when no same-state active scene exists
- Updated `apps/web/src/app/onboarding/page.tsx` so both signed and unsigned review flows:
  - preserve the structural Home Scene identity rule (`city + state + music community`)
  - clear stale tuned-scene context before re-resolution
  - resolve review state from public `discover/scenes` data when auth-backed onboarding is absent or incomplete
  - show explicit `Listening scene` / `Fallback listening scene` review copy
  - preserve pioneer follow-up context only when the selection resolves as pioneer
- Added focused onboarding regression coverage:
  - `apps/web/__tests__/onboarding-review-resolution.test.ts`
  - `apps/web/__tests__/onboarding-page-lock.test.ts`

## Verification

### `pnpm run docs:lint`

```text
> uprise-next@1.0.0 docs:lint /home/baris/UPRISE_NEXT
> node scripts/docs-lint.mjs && pnpm run canon:lint

[docs:lint] ✅ No tracked PDFs
[docs:lint] ✅ No tracked Zone.Identifier artifacts
[docs:lint] ✅ Docs directory structure looks present
[docs:lint] ✅ Specs metadata present
[docs:lint] ✅ No unexpected root-level markdown files
[docs:lint] ✅ docs:lint passed

> uprise-next@1.0.0 canon:lint /home/baris/UPRISE_NEXT
> node scripts/canon-lint.mjs

[canon:lint] OK: Checked 10 canon markdown files
```

### `pnpm run infra-policy-check`

```text
> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT
> tsx scripts/infra-policy-check.ts


🔍 UPRISE Web-Tier Contract Guard
════════════════════════════════════════════════════════════════════════════════
Scanning: apps/web
Patterns: 24 prohibited patterns
════════════════════════════════════════════════════════════════════════════════


✅ Web-Tier Contract Guard: No violations detected!
   All architectural boundaries are properly enforced.


⏱️  Scan completed in 12ms

✅ Build succeeded: All checks passed!
```

### `pnpm --filter web test -- onboarding-review-resolution.test.ts onboarding-page-lock.test.ts`

```text
> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "onboarding-review-resolution.test.ts" "onboarding-page-lock.test.ts"

PASS __tests__/onboarding-page-lock.test.ts
PASS __tests__/onboarding-review-resolution.test.ts

Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        1.043 s
Ran all test suites matching /onboarding-review-resolution.test.ts|onboarding-page-lock.test.ts/i.
```

### `pnpm --filter web typecheck`

```text
> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

## Residual risk

- The onboarding review fallback now uses the repo’s current deterministic active-scene ordering from `discover/scenes` (exact active tuple, then same-state active scene, then same-community active scene). The active repo still does not expose a geospatial nearest-city inventory for unsigned review, so this remains deterministic but not true distance-based nearest-city computation.
- The strict selection lock uses the existing concise `MUSIC_COMMUNITIES` values already wired on this branch. It does not reopen the separate branch-local work that may later align those concise UI labels against the longer internal parent-community seed naming.

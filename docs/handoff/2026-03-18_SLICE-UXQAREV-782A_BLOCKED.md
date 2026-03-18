# SLICE-UXQAREV-782A BLOCKED

Date: 2026-03-18
Lane: E - QA/Docs/Closeout
Task: Batch17 QA replay 3 (Player/Profile)

## Block Reason
Blocked because this slice only allows the targeted replay and transcript publication, but the exact verify command now fails against the current `/plot` implementation: the player/profile regression lock still expects `collectionTitle={selectedCollectionItem?.label}` while `apps/web/src/app/plot/page.tsx` now passes `collectionTitle={selectedCollectionItem?.label ?? null}`.

## Current Conflict Evidence
- Current failing expectation:
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts:57`
  - `expect(plotPageSource).toContain('collectionTitle={selectedCollectionItem?.label}');`
- Current implementation:
  - `apps/web/src/app/plot/page.tsx` renders `collectionTitle={selectedCollectionItem?.label ?? null}`

## Why This Cannot Be Completed In A Replay-Only Slice
- The slice scope is replay-only and does not authorize behavior or test-contract changes.
- The verify failure is a live implementation/test mismatch outside lane E replay scope.
- Completing the slice without a green verify chain would violate the required loop contract.

## Required Follow-up
- Resolve the player/profile regression mismatch in the implementation or the owning lane-C regression lock.
- Re-run this targeted replay slice after the regression is restored to green.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Exact Output
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

> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT
> tsx scripts/infra-policy-check.ts


🔍 UPRISE Web-Tier Contract Guard
════════════════════════════════════════════════════════════════════════════════
Scanning: apps/web
Patterns: 24 prohibited patterns
════════════════════════════════════════════════════════════════════════════════


✅ Web-Tier Contract Guard: No violations detected!
   All architectural boundaries are properly enforced.


⏱️  Scan completed in 3ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "plot-ux-regression-lock.test.ts" "plot-tier-guard.test.ts"

FAIL __tests__/plot-ux-regression-lock.test.ts
  ● /plot UX regression lock › locks collection mode to selection entry and explicit eject return

    expect(received).toContain(expected) // indexOf

    Expected substring: "collectionTitle={selectedCollectionItem?.label}"
    Received string:    "'use client';·
    ...
    <RadiyoPlayerPanel
      mode={playerMode}
      onCollectionEject={handleCollectionEject}
      rotationPool={rotationPool}
      onRotationPoolChange={setRotationPool}
      selectedTier={selectedTier}
      onTierChange={setSelectedTier}
      broadcastLabel={playerMode === 'RADIYO' ? radiyoBroadcastLabel : collectionBroadcastLabel}
      collectionTitle={selectedCollectionItem?.label ?? null}
    />
    ...

      55 |     expect(plotPageSource).toContain("setPlayerMode('RADIYO')");
      56 |     expect(plotPageSource).toContain('mode={playerMode}');
    > 57 |     expect(plotPageSource).toContain('collectionTitle={selectedCollectionItem?.label}');
         |                            ^
      58 |   });
      59 |
      60 |   it('locks engagement wheel actions to deterministic mode-specific sets', () => {

      at Object.<anonymous> (__tests__/plot-ux-regression-lock.test.ts:57:28)

PASS __tests__/plot-tier-guard.test.ts

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 18 passed, 19 total
Snapshots:   0 total
Time:        0.457 s, estimated 1 s
Ran all test suites matching /plot-ux-regression-lock.test.ts|plot-tier-guard.test.ts/i.
/home/baris/UPRISE_NEXT/apps/web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  web@1.0.0 test: `jest "plot-ux-regression-lock.test.ts" "plot-tier-guard.test.ts"`
Exit status 1
```

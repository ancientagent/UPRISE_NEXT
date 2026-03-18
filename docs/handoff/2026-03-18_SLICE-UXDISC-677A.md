# SLICE-UXDISC-677A

## Scope
- Queue: `.reliant/queue/mvp-lane-b-ux-discovery-batch20.json`
- Runtime: `.reliant/runtime/current-task-lane-b-ux-batch20.json`
- Prompt: `Execute one MVP slice only: close lane B with focused contract/test assertions for discovery scope, states, and handoff integrity.`

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`

## Implementation
- Added a discovery-client assertion proving national-tier discovery does not carry `state` or `city` filters.
- Added a communities-client assertion proving absent active-statistics metadata resolves to `sceneId: null`.
- Fixed `listDiscoverScenes()` so `state` is only sent for `city` and `state` tiers.

## Files Touched
- `apps/web/src/lib/discovery/client.ts`
- `apps/web/__tests__/discovery-client.test.ts`
- `apps/web/__tests__/communities-client.test.ts`
- `docs/CHANGELOG.md`

## Drift Guard Confirmation
- No new UI behavior or copy added.
- The slice tightens approved discovery scope and handoff contracts only.
- Web-tier boundary unchanged.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- discovery-context.test.ts discovery-client.test.ts communities-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Initial Verify Output
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


⏱️  Scan completed in 18ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-context.test.ts" "discovery-client.test.ts" "communities-client.test.ts"

FAIL __tests__/discovery-client.test.ts
  ● discovery client › does not carry location filters into national-tier discovery

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      165 |     expect(query.get('tier')).toBe('national');
      166 |     expect(query.get('musicCommunity')).toBe('Punk');
    > 167 |     expect(query.has('state')).toBe(false);
          |                                ^
      168 |     expect(query.has('city')).toBe(false);
      169 |   });
      170 |

      at Object.<anonymous> (__tests__/discovery-client.test.ts:167:32)

PASS __tests__/communities-client.test.ts
PASS __tests__/discovery-context.test.ts

Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 21 passed, 22 total
Snapshots:   0 total
Time:        1.832 s
Ran all test suites matching /discovery-context.test.ts|discovery-client.test.ts|communities-client.test.ts/i.
/home/baris/UPRISE_NEXT/apps/web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  web@1.0.0 test: `jest "discovery-context.test.ts" "discovery-client.test.ts" "communities-client.test.ts"`
Exit status 1
```

## Rerun Verify Output
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


⏱️  Scan completed in 15ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-context.test.ts" "discovery-client.test.ts" "communities-client.test.ts"

PASS __tests__/discovery-client.test.ts
PASS __tests__/communities-client.test.ts
PASS __tests__/discovery-context.test.ts

Test Suites: 3 passed, 3 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        1.585 s
Ran all test suites matching /discovery-context.test.ts|discovery-client.test.ts|communities-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```

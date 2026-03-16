# SLICE-UXQAREV-575A

Date: 2026-03-15
Lane: E - QA/Docs/Closeout
Task: Batch16 final gate replay + closeout

## Scope
- Ran the final targeted Batch16 replay for Plot, Player/Profile, and Discovery test surfaces.
- Published the exact command output.
- Recorded remaining lane E blocker status for closeout visibility.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tier-guard.test.ts plot-statistics-request.test.ts discovery-context.test.ts discovery-client.test.ts communities-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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


⏱️  Scan completed in 4ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "plot-ux-regression-lock.test.ts" "plot-tier-guard.test.ts" "plot-statistics-request.test.ts" "discovery-context.test.ts" "discovery-client.test.ts" "communities-client.test.ts"

PASS __tests__/plot-ux-regression-lock.test.ts
PASS __tests__/communities-client.test.ts
PASS __tests__/plot-statistics-request.test.ts
PASS __tests__/discovery-client.test.ts
PASS __tests__/plot-tier-guard.test.ts
PASS __tests__/discovery-context.test.ts

Test Suites: 6 passed, 6 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        0.523 s, estimated 1 s
Ran all test suites matching /plot-ux-regression-lock.test.ts|plot-tier-guard.test.ts|plot-statistics-request.test.ts|discovery-context.test.ts|discovery-client.test.ts|communities-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```

## Closeout Status
- Passed:
  - `SLICE-UXQAREV-570A`
  - `SLICE-UXQAREV-571A`
  - `SLICE-UXQAREV-574A`
  - `SLICE-UXQAREV-575A`
- Blocked:
  - `SLICE-UXQAREV-572A`
    - docs/spec wording-only pass blocked by active Social-tab implementation vs MVP lock conflict
  - `SLICE-UXQAREV-573A`
    - risk memo published; slice remained blocked when its required verify run hit a temporary `/plot` typecheck regression during concurrent lane-C edits

## Residual Notes
- The final targeted gate replay is green.
- The lane still carries a real source-of-truth conflict documented in `docs/handoff/2026-03-15_SLICE-UXQAREV-572A_BLOCKED.md`.
- Risk/rollback guidance is captured in `docs/handoff/2026-03-15_SLICE-UXQAREV-573A.md`.

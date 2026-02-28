# R1 Lane D — Supervisor Health Gate

## Scope
- Phase R1 automation hardening only.
- No product-surface feature changes.

## Implemented
1. Extended `scripts/reliant-supervisor.mjs` with deterministic `--health-check` mode.
2. Health gate fails (`exit 6`) on:
   - multiple `in_progress` in a queue,
   - stale runtime with no matching `in_progress`,
   - summary drift (`queue.summary` mismatch).
3. Health gate is one-shot and non-mutating (`autoClaim=false`, `repair=false` in health-check mode).
4. Added health-gate payload in status output (`healthCheck.enabled/passed/failureCount/failures`).
5. Updated tests in `scripts/reliant-supervisor.test.mjs` for pass/fail health-gate cases.
6. Updated runbook usage in `docs/solutions/RELIANT_ORCHESTRATOR_RUNBOOK.md`.

## Health-Check Command Example
```bash
node scripts/reliant-supervisor.mjs --health-check --lanes-json .reliant/runtime/r1-healthcheck-lanes.json --status-out .reliant/runtime/r1-healthcheck-status.json
```

### Output (exact)
```text
[supervisor] lane-d-batch13 queued=0 in_progress=0 done=6 blocked=0
[supervisor] health-gate-passed
```

## Verify Commands (exact)
1. `pnpm run docs:lint`
2. `pnpm run infra-policy-check`
3. `pnpm --filter api test -- reliant-slice-queue.test.mjs reliant-supervisor.test.mjs`
4. `pnpm --filter api typecheck`
5. `pnpm --filter web typecheck`

### 1) Output (exact)
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

### 2) Output (exact)
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


⏱️  Scan completed in 4ms

✅ Build succeeded: All checks passed!

```

### 3) Output (exact)
```text

> api@1.0.0 test /home/baris/UPRISE_NEXT/apps/api
> jest "reliant-slice-queue.test.mjs" "reliant-supervisor.test.mjs"

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/baris/UPRISE_NEXT/apps/api
  36 files checked.
  testMatch: **/*.test.ts - 35 matches
  testPathIgnorePatterns: /node_modules/ - 36 matches
  testRegex:  - 0 matches
Pattern: reliant-slice-queue.test.mjs|reliant-supervisor.test.mjs - 0 matches
/home/baris/UPRISE_NEXT/apps/api:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  api@1.0.0 test: `jest "reliant-slice-queue.test.mjs" "reliant-supervisor.test.mjs"`
Exit status 1
```

### 4) Output (exact)
```text

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit

```

### 5) Output (exact)
```text

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

```

## Notes
- Step 3 fails in current repo config because `apps/api` Jest is limited to `**/*.test.ts`, while these supervisor/queue tests are `.mjs` script tests under `scripts/`.
- Script-level health gate coverage was executed successfully with `node scripts/reliant-supervisor.test.mjs`.

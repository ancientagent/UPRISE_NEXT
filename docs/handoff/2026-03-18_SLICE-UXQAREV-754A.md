# SLICE-UXQAREV-754A

Date: 2026-03-18
Lane: E - QA/Docs/Closeout
Task: Batch17 risk/rollback memo

## Scope
- Produced a severity-ordered Batch22 UX risk/rollback memo for the current state.
- Focused on residual risks after the current Batch22 lane outputs.
- No product behavior changed in this slice.

## Severity-Ordered Risks

### 1. Medium: Batch22 lane-E queue metadata still uses Batch17 titles/prompts
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch22.json`
- Residual risk:
  - The Batch22 queue still labels all lane-E tasks as `Batch17 ...`, including the final queued closeout task.
  - Product behavior is unaffected, but replay provenance and title-based audit review are weaker than they should be.
- Deterministic revert note:
  - Keep using task IDs and queue paths as the authoritative trace key.
  - Normalize queue seeding metadata in the source slice JSON or automation scripts instead of rewriting historical completion records.

### 2. Low: handoff/report search by title remains brittle while queue metadata is stale
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch22.json`
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-750A.md`
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-751A.md`
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-752A.md`
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-753A.md`
- Residual risk:
  - The reports correctly describe Batch22 work, but the queue titles still say Batch17.
  - Anyone searching only by slice title instead of task ID can misread cross-batch provenance.
- Deterministic revert note:
  - Continue to key audit/replay work on `SLICE-*` IDs.
  - Repair queue-template titles before the next batch is generated.

### 3. Low: queue-template carry-forward drift can recur in later batches if not fixed at the seed source
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch22.json`
  - current Batch22 lane-E tasks are behaviorally correct but metadata is inherited from an older batch
- Residual risk:
  - Future batches can repeat the same title/prompt mismatch even when the actual slice execution is correct.
- Deterministic revert note:
  - Fix the queue-generation template or source slice manifest before creating the next lane-E QA queue.

## Rollback Protocol
- Compare first:
  - `git diff --stat checkpoint-2026-02-28-code..HEAD`
  - `git diff --stat checkpoint-2026-02-28-full..HEAD`
- Prefer non-destructive rollback:
  - `git switch -c rollback/code checkpoint-2026-02-28-code`
  - or `git revert --no-edit checkpoint-2026-02-28-full..HEAD`
- Follow `docs/solutions/ROLLBACK_CHECKPOINT_CHEATSHEET.md` for any actual rollback.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck
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


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

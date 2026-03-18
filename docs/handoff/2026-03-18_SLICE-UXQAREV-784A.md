# SLICE-UXQAREV-784A

Date: 2026-03-18
Lane: E - QA/Docs/Closeout
Task: Batch17 risk/rollback memo

## Scope
- Produced a severity-ordered Batch23 UX risk/rollback memo for the current state.
- Focused on residual risks after the current Batch23 lane outputs.
- No product behavior changed in this slice.

## Severity-Ordered Risks

### 1. High: Batch23 lane-E carries a live blocked Player/Profile replay caused by implementation/test mismatch
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch23.json`
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-782A_BLOCKED.md`
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts:58`
  - `apps/web/src/app/plot/page.tsx`
- Residual risk:
  - The lane-E queue now contains an actual blocked replay because the regression lock expects `collectionTitle={selectedCollectionItem?.label ?? null}` parity, and this scope cannot repair implementation/test mismatches.
  - Final closeout can only report this block; it cannot produce an all-green lane summary until the owning mismatch is resolved upstream.
- Deterministic revert note:
  - Resolve the implementation/test mismatch in the owning player/profile scope.
  - Re-run `SLICE-UXQAREV-782A` after the regression returns to green.

### 2. Medium: Batch23 lane-E queue metadata still uses Batch17 titles/prompts
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch23.json`
- Residual risk:
  - Every lane-E task title/prompt still says `Batch17 ...` even though this queue is Batch23.
  - Product behavior is unaffected, but provenance and title-based audit review remain weaker than they should be.
- Deterministic revert note:
  - Keep using task IDs and queue paths as the authoritative trace key.
  - Normalize queue seeding metadata in the source slice manifest or automation scripts rather than rewriting historical queue history.

### 3. Low: final closeout will necessarily be mixed-status, not fully green
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch23.json`
  - blocked task `SLICE-UXQAREV-782A`
- Residual risk:
  - Batch23 lane E cannot close with a “blocked: none” summary unless the upstream regression is fixed first.
  - This is operationally acceptable, but it changes how the final closeout must be interpreted.
- Deterministic revert note:
  - Publish the final closeout exactly as mixed-status if the last replay slice passes.
  - Treat `782A` as the explicit open issue for follow-up.

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

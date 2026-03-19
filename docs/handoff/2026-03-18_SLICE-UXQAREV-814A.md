# SLICE-UXQAREV-814A

Date: 2026-03-18
Lane: E - QA/Docs/Closeout
Task: Batch17 risk/rollback memo

## Scope
- Produced a severity-ordered Batch24 UX risk/rollback memo for the current state.
- Focused on residual risks after the current Batch24 lane outputs.
- No product behavior changed in this slice.

## Severity-Ordered Risks

### 1. Medium: Batch24 lane-E queue metadata still uses Batch17 titles/prompts
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch24.json`
  - claimed tasks `SLICE-UXQAREV-810A` through `SLICE-UXQAREV-814A`
- Residual risk:
  - Every lane-E task title still says `Batch17 ...` even though the queue path and execution plan are Batch24.
  - Product behavior is unaffected, but provenance and title-based audit review remain weaker than they should be.
- Deterministic revert note:
  - Keep using task IDs and queue paths as the authoritative trace key.
  - Normalize queue seeding metadata in the source slice manifest or automation scripts rather than rewriting historical queue history.

### 2. Low: Lane-E closeout confidence depends on targeted replay scope rather than a full product verify
- Evidence:
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-810A.md`
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-811A.md`
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-812A.md`
- Residual risk:
  - The lane-E replay slices intentionally validate the locked targeted packs, not the full optional integration/build surface.
  - This matches the queue scope, but any issue outside those targeted packs would remain outside this lane's detection envelope.
- Deterministic revert note:
  - Treat the queued verify commands as the contract for lane-E closeout.
  - Escalate to the slower repo-level verify flow only if canon/spec or release policy explicitly broadens the lane scope.

### 3. Low: Docs/spec consistency slice found no drift, so future drift still depends on upstream lane discipline
- Evidence:
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-813A.md`
- Residual risk:
  - The required Batch24 canon/spec surfaces are aligned now, but later cross-lane edits can still reintroduce wording drift after this memo is published.
  - That is operationally acceptable because the lane-E process is replay and reporting, not long-lived docs ownership.
- Deterministic revert note:
  - Re-run the docs/spec consistency slice on the next queue batch or after any canon/spec unlock.
  - Avoid speculative doc edits outside an explicitly claimed consistency slice.

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

# SLICE-UXQAREV-634A

Date: 2026-03-17
Lane: E - QA/Docs/Closeout
Task: Batch18 risk/rollback memo

## Scope
- Produced a severity-ordered Batch18 UX risk/rollback memo for the current state.
- Focused on residual risks after the current Batch18 lane outputs.
- No product behavior changed in this slice.

## Severity-Ordered Risks

### 1. High: lane-A queue artifacts still preserve an outdated Social-spec blocker reason
- Evidence:
  - `.reliant/queue/mvp-lane-a-ux-plot-batch18.json`
  - `docs/specs/communities/plot-and-scene-plot.md:24`
  - `docs/specs/communities/plot-and-scene-plot.md:118`
- Residual risk:
  - Batch18 lane-A blocked entries still claim the Plot spec authorizes a Social placeholder, while the current spec now says Social is hidden in MVP.
  - This can mislead later queue triage or replay work.
- Deterministic revert note:
  - Do not change product code from this memo slice.
  - Repair the stale lane-A queue blocker text in a queue-hygiene or automation lane before further replay decisions rely on it.

### 2. Medium: Batch18 queue metadata still uses Batch17 titles/prompts for lane E tasks
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch18.json`
- Residual risk:
  - Operator confusion during replay review and transcript auditing.
  - No direct product drift, but it weakens run provenance.
- Deterministic revert note:
  - Keep using task IDs as the source of truth for completion.
  - Normalize task titles/prompts in queue seeding logic or queue source JSON rather than patching history by hand unless queue hygiene is the explicit slice scope.

### 3. Medium: regression coverage and queue history can diverge if stale blocked reasons are not refreshed
- Evidence:
  - lane A queue shows `606A/607A/608A/610A/611A` blocked for a reason that no longer matches current spec text
- Residual risk:
  - Future agents may stop on already-resolved wording conflicts instead of the real remaining implementation or contract issues.
- Deterministic revert note:
  - Re-run the affected lane with fresh claim/block cycles after queue-hygiene correction rather than manually inferring old blocker validity.

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


⏱️  Scan completed in 7ms

✅ Build succeeded: All checks passed!


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

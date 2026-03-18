# SLICE-UXQAREV-694A

Date: 2026-03-18
Lane: E - QA/Docs/Closeout
Task: Batch20 risk/rollback memo

## Scope
- Produced a severity-ordered Batch20 UX risk/rollback memo for the current state.
- Focused on residual risks after the current Batch20 lane outputs.
- No product behavior changed in this slice.

## Severity-Ordered Risks

### 1. High: lane-A queue artifacts still preserve an outdated Social-spec blocker reason
- Evidence:
  - `.reliant/queue/mvp-lane-a-ux-plot-batch20.json`
  - `docs/specs/communities/plot-and-scene-plot.md:24`
  - `docs/specs/communities/plot-and-scene-plot.md:118`
- Residual risk:
  - Batch20 lane-A blocked entries still claim the Plot spec authorizes a Social placeholder, while the current spec and Batch20 policy lock say Social is hidden in MVP.
  - This can mislead later queue triage or replay work.
- Deterministic revert note:
  - Repair stale lane-A queue blocker text in a queue-hygiene or automation lane before relying on it for further stop/go decisions.

### 2. Medium: Batch20 lane-E queue metadata still uses Batch17 titles/prompts
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch20.json`
- Residual risk:
  - Operator confusion during replay review and transcript auditing.
  - No direct product drift, but weaker run provenance.
- Deterministic revert note:
  - Keep using task IDs as the authoritative trace key.
  - Normalize queue seeding metadata in the source slice JSON or automation scripts rather than rewriting historical completion records.

### 3. Medium: stale blocked reasons can diverge from the now-green lane-E consistency result
- Evidence:
  - current lane-E `693A` completed cleanly while lane-A blocked reasons still cite an older spec contradiction
- Residual risk:
  - Future agents may stop on an already-resolved wording conflict instead of the real remaining implementation issues.
- Deterministic revert note:
  - Re-run affected blocked slices after queue-hygiene correction rather than trusting old blocker text.

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


⏱️  Scan completed in 14ms

✅ Build succeeded: All checks passed!


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

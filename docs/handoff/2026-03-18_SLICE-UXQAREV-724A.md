# SLICE-UXQAREV-724A

Date: 2026-03-18
Lane: E - QA/Docs/Closeout
Task: Batch17 risk/rollback memo

## Scope
- Produced a severity-ordered Batch21 UX risk/rollback memo for the current state.
- Focused on residual risks after the current Batch21 lane outputs.
- No product behavior changed in this slice.

## Severity-Ordered Risks

### 1. High: active mobile UX planning artifact still conflicts with the current player-mode lock
- Evidence:
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md:159`
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md:164`
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md:191`
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md:197`
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md:201`
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md:371`
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md:397`
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:62`
  - `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md:19`
  - `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md:49`
- Residual risk:
  - The active planning artifact still describes an explicit `RADIYO` / `Collection` mode switch and strip controls (`Play/Pause`, `Add (+)`), while the current lock requires selection-driven entry into Collection mode, eject-only return, and no dedicated mode switch button.
  - Future queue seeding or design implementation that reads this file directly can reintroduce behavior drift even though the current web implementation/tests are locked correctly.
- Deterministic revert note:
  - Patch `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md` to match the current master lock before using it for any further queue generation, UX prompting, or implementation guidance.

### 2. Medium: Batch21 lane-E queue metadata still uses Batch17 titles/prompts
- Evidence:
  - `.reliant/queue/mvp-lane-e-ux-qarev-batch21.json`
- Residual risk:
  - The Batch21 queue still labels all lane-E tasks as `Batch17 ...`, which weakens replay provenance and makes handoff/audit review by title brittle.
  - Task IDs remain correct, but title-driven triage is error-prone.
- Deterministic revert note:
  - Keep using task IDs and queue paths as the authoritative trace key.
  - Normalize queue seeding metadata in the source slice JSON or automation scripts rather than rewriting historical completion records.

### 3. Medium: docs consistency pass restored Social-hidden wording but did not exhaust all stale solution guidance
- Evidence:
  - `docs/handoff/2026-03-18_SLICE-UXQAREV-723A.md`
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md:159`
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md:371`
- Residual risk:
  - `723A` corrected the MVP Social-hidden wording, but the same solution artifact still contains stale player-control semantics.
  - Later agents may assume the consistency pass cleared the entire artifact and miss the remaining conflict.
- Deterministic revert note:
  - Treat `SLICE-UXQAREV-723A` as a partial wording alignment only.
  - Re-run a focused docs consistency slice against `MVP_MOBILE_UX_SYSTEM_R1.md` before relying on it as an execution source.

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


⏱️  Scan completed in 26ms

✅ Build succeeded: All checks passed!


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

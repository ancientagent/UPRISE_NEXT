# SLICE-UXQAREV-604A

Date: 2026-03-16
Lane: E - QA/Docs/Closeout
Task: Batch17 risk/rollback memo

## Scope
- Produced a severity-ordered Batch17 UX risk/rollback memo.
- Focused on current residual risks that still exist after the Batch17 targeted replays.
- No product behavior changed in this slice.

## Severity-Ordered Risks

### 1. Critical: `/plot` still surfaces deferred Social in the collapsed MVP rail
- Evidence:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:98-99`
  - `docs/specs/communities/plot-and-scene-plot.md:118`
  - `apps/web/src/app/plot/page.tsx:46-48`
  - `apps/web/src/app/plot/page.tsx:534-547`
  - `apps/web/src/app/plot/page.tsx:570-578`
- Residual risk:
  - Founder/demo review can interpret Social as approved MVP scope.
  - The docs/spec consistency slice is correctly blocked until implementation changes.
- Deterministic revert note:
  - Remove `deferredPlotTabs` from the rendered tab rail and delete the `activeTab === 'Social'` body branch in `apps/web/src/app/plot/page.tsx`.

### 2. High: tier controls still do not implement tap-active-tier-to-stop
- Evidence:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:71-74`
  - `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
  - `apps/web/src/components/plot/RadiyoPlayerPanel.tsx:126-130`
  - `apps/web/src/app/plot/page.tsx:367-375`
- Residual risk:
  - Tier-title parity is covered, but the player transport contract remains incomplete.
- Deterministic revert note:
  - Replace direct `setSelectedTier` wiring with a route-level handler that toggles the current tier off when reselected, then lock it with a dedicated regression assertion.

### 3. High: collapsed profile strip still exceeds the approved MVP element set
- Evidence:
  - `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md:38-43`
  - `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md:13-28`
  - `apps/web/src/app/plot/page.tsx:321-347`
- Residual risk:
  - The current collapsed strip still includes an avatar-style initial badge, handle, and panel-state chip beyond the locked `username + notifications + ...` surface.
- Deterministic revert note:
  - Trim the collapsed strip in `apps/web/src/app/plot/page.tsx` to the locked elements only while preserving seam interaction.

### 4. Medium: current Plot regression coverage still normalizes the Social-tab drift
- Evidence:
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts:81-94`
- Residual risk:
  - The gate suite can stay green while explicitly preserving `deferredPlotTabs = ['Social']`.
- Deterministic revert note:
  - Replace the current tab-ownership assertion so the collapsed MVP rail is locked to `Feed`, `Events`, `Promotions`, and `Statistics` only.

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


⏱️  Scan completed in 5ms

✅ Build succeeded: All checks passed!


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

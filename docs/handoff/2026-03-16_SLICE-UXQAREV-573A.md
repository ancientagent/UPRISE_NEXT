# SLICE-UXQAREV-573A

Date: 2026-03-16
Lane: E - QA/Docs/Closeout
Task: Batch16 risk/rollback memo

## Scope
- Produced an updated severity-ordered UX risk/rollback memo for the current Batch16 state.
- Re-ran the required verify command and captured the exact output.
- No product behavior changed in this slice.

## Severity-Ordered Risks

### 1. Critical: `/plot` still exposes deferred Social in the live tab rail
- Evidence:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:98-99`
  - `docs/specs/communities/plot-and-scene-plot.md:118`
  - `apps/web/src/app/plot/page.tsx:46-48`
  - `apps/web/src/app/plot/page.tsx:534-547`
  - `apps/web/src/app/plot/page.tsx:570-578`
- Residual risk:
  - Founder review can read Social as approved MVP scope.
  - The docs/spec consistency slice remains blocked until the implementation matches the lock.
- Deterministic rollback note:
  - Remove `deferredPlotTabs` from the rendered collapsed tab rail and delete the `activeTab === 'Social'` fallback branch in `apps/web/src/app/plot/page.tsx`.

### 2. High: active-tier tap still lacks the locked stop-on-active behavior
- Evidence:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:71-74`
  - `apps/web/src/components/plot/RadiyoPlayerPanel.tsx:126-130`
  - `apps/web/src/app/plot/page.tsx:367-375`
- Residual risk:
  - Tier label parity is present, but the player interaction contract is still incomplete.
- Deterministic rollback note:
  - Replace direct `setSelectedTier` wiring with a route-level handler that toggles the active tier off when tapped again, then add a lock test for that interaction.

### 3. High: collapsed profile strip still exceeds the approved MVP surface
- Evidence:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:52-56`
  - `apps/web/src/app/plot/page.tsx:321-347`
- Residual risk:
  - The strip still includes an avatar-style initial badge, handle line, and panel-state pill beyond the locked `username + notifications + ...` scope.
- Deterministic rollback note:
  - Trim the collapsed strip back to the locked fields in `apps/web/src/app/plot/page.tsx` without changing seam behavior.

### 4. Medium: regression coverage still tolerates the Social-tab conflict
- Evidence:
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts:81-94`
- Residual risk:
  - Current tests explicitly preserve `deferredPlotTabs = ['Social']`, so the gate suite can stay green while the MVP lock remains violated.
- Deterministic rollback note:
  - Replace the current tab-ownership assertion with one that locks the collapsed MVP rail to `Feed`, `Events`, `Promotions`, and `Statistics` only.

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


⏱️  Scan completed in 13ms

✅ Build succeeded: All checks passed!


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

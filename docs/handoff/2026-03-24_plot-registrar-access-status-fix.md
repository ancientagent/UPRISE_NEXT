# Plot Registrar Access Status Fix

## Summary
- fixed the confirmed `/plot` registrar access/status mismatch on current HEAD
- kept the change scoped to the Plot route and existing registrar client/helpers
- preserved signed-out and unresolved Home Scene behavior

## Source Of Truth
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/system/registrar.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- `docs/handoff/2026-03-24_session-context-reconciliation.md`

## Current Repro
- current HEAD exposed registrar history and status only on `/registrar`
- resolved `/plot` did not surface registrar access/status context even though the active Plot spec defines registrar entry as part of the Plot civic workflow
- unresolved `/plot` copy still implied registrar prerequisites directly inside the Home Scene gate

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`

## Fix
- added a minimal `Registrar Access` card to the resolved `/plot` right rail
- sourced the card from the existing web-tier registrar client `listArtistBandRegistrations(token)`
- summarized existing registrar entry data with `getRegistrarPlotSummary(...)` and `formatRegistrarEntryStatus(...)`
- kept the surface limited to repo-truth states already supported by the client/helper stack:
  - signed out
  - loading
  - error
  - empty
  - summarized latest-status/counts
- kept the existing `Open Registrar` navigation path instead of inventing new registrar actions
- trimmed unresolved `/plot` copy to `Complete onboarding to anchor your Home Scene and unlock Plot context.` so the Plot gate no longer implies direct-route registrar prerequisite handling
- added a regression lock so `/plot` keeps the registrar import/source path and route-level surface copy

## Drift Guard Confirmation
- no new registrar behavior was introduced
- no broad Plot redesign was introduced
- no placeholder CTA was added
- implementation stays within the web-tier boundary by consuming existing API/client helpers only

## Verification
- `pnpm run docs:lint`
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

- `pnpm run infra-policy-check`
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


⏱️  Scan completed in 11ms

✅ Build succeeded: All checks passed!
```

- `pnpm --filter web test -- plot-ux-regression-lock.test.ts registrar-entry-status.test.ts`
```text
> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "plot-ux-regression-lock.test.ts" "registrar-entry-status.test.ts"

PASS __tests__/plot-ux-regression-lock.test.ts
PASS __tests__/registrar-entry-status.test.ts

Test Suites: 2 passed, 2 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        0.388 s, estimated 1 s
Ran all test suites matching /plot-ux-regression-lock.test.ts|registrar-entry-status.test.ts/i.
```

- `pnpm --filter web typecheck`
```text
> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

## Notes
- the first targeted test replay failed before the final pass because an existing Plot regression lock already rejected the stale unresolved copy `...satisfy Registrar prerequisites.` on current HEAD
- that copy was corrected as part of this fix, then the same targeted test command was rerun and passed

## Residual Risk
- the new Plot card depends on the existing registrar entries endpoint remaining available for authenticated web reads
- coverage is route-lock and helper-level only; no browser-flow assertion was added in this slice

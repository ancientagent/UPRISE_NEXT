# Handoff: Plot UX Regression Lock Tests

Date: 2026-03-01  
Agent: Codex (GPT-5)

## Scope
- Added lightweight regression lock tests for current approved `/plot` UX parity checkpoints (tests only; no behavior expansion):
  - mode switch label contract (`RADIYO` vs `Collection`)
  - expanded profile contract (expanded state swaps out Plot tabs/body)
  - statistics-only placement contract for `Top Songs` and `Scene Activity`

## Files Changed
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-03-01_plot-ux-regression-lock-tests.md`

## Required Commands (Exact)

### `pnpm run docs:lint`
```text
> uprise-next@1.0.0 docs:lint /home/baris/UPRISE_NEXT_uxmobile
> node scripts/docs-lint.mjs && pnpm run canon:lint

[docs:lint] ✅ No tracked PDFs
[docs:lint] ✅ No tracked Zone.Identifier artifacts
[docs:lint] ✅ Docs directory structure looks present
[docs:lint] ✅ Specs metadata present
[docs:lint] ✅ No unexpected root-level markdown files
[docs:lint] ✅ docs:lint passed

> uprise-next@1.0.0 canon:lint /home/baris/UPRISE_NEXT_uxmobile
> node scripts/canon-lint.mjs

[canon:lint] OK: Checked 10 canon markdown files
```

### `pnpm run infra-policy-check`
```text
> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT_uxmobile
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
```

### `pnpm --filter web typecheck`
```text
> web@1.0.0 typecheck /home/baris/UPRISE_NEXT_uxmobile/apps/web
> tsc --noEmit
```

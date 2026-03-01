# 2026-03-01 — Plot accessibility seam/mode hardening (web-only)

## Scope
Small web-only accessibility hardening for `/plot` seam + mode controls with no route behavior changes.

## Changes
- `apps/web/src/app/plot/page.tsx`
  - Added seam toggle linkage and state semantics:
    - `id="plot-profile-seam-toggle"`
    - `aria-controls="plot-profile-panel"`
    - `aria-expanded={isProfileExpanded}`
  - Added matching profile panel id/label linkage:
    - `id="plot-profile-panel"`
    - `aria-labelledby="plot-profile-seam-toggle"`
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
  - Added mode group semantics:
    - `role="radiogroup"` + `aria-label="Player mode"`
    - Mode buttons use `role="radio"` + `aria-checked`
    - Added explicit mode-switch aria labels
  - Added keyboard parity for mode toggles on radiogroup:
    - `ArrowLeft` / `ArrowUp` -> `RADIYO`
    - `ArrowRight` / `ArrowDown` -> `Collection`
    - `Home` -> `RADIYO`
    - `End` -> `Collection`

## Notes
- Route/state behavior unchanged; only accessibility semantics and keyboard toggle parity were adjusted.
- No focused seam/mode tests existed for this surface, so no new test suite was introduced per instruction.

## Commands Run (exact)
```bash
pnpm run docs:lint
pnpm run infra-policy-check
pnpm --filter web typecheck
```

## Command Output (exact)
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

> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT_uxmobile
> tsx scripts/infra-policy-check.ts


🔍 UPRISE Web-Tier Contract Guard
════════════════════════════════════════════════════════════════════════════════
Scanning: apps/web
Patterns: 24 prohibited patterns
════════════════════════════════════════════════════════════════════════════════


✅ Web-Tier Contract Guard: No violations detected!
   All architectural boundaries are properly enforced.


⏱️  Scan completed in 16ms

✅ Build succeeded: All checks passed!


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT_uxmobile/apps/web
> tsc --noEmit
```

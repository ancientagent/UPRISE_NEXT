# UX-IMPL-531A — Profile Header + Seam Pull-Tab (Mobile-First)

## Scope
Implement one mobile-first UX/UI slice on `/plot`:
- Profile header row with identity/actions
- Seam pull-tab affordance
- In-route `collapsed/peek/expanded` state behavior
- Expanded panel scaffold for profile summary + collection entry point

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `docs/CHANGELOG.md`

## Implementation Notes
- Added top profile row with avatar, display identity, notifications/menu controls.
- Added seam toggle between profile and Plot body with explicit expand/collapse control.
- Added pointer gesture handling:
  - drag down from collapsed enters `peek` and can commit to `expanded`
  - drag up from expanded collapses
  - `peek` settles to `collapsed` on release when threshold not met
- Added expanded profile summary panel (registrar counts + collection/open profile actions).
- Kept existing Plot sections and data flow intact for this slice.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Output (exact)
```text
[docs:lint] ✅ No tracked PDFs
[docs:lint] ✅ No tracked Zone.Identifier artifacts
[docs:lint] ✅ Docs directory structure looks present
[docs:lint] ✅ Specs metadata present
[docs:lint] ✅ No unexpected root-level markdown files
[docs:lint] ✅ docs:lint passed
[canon:lint] OK: Checked 10 canon markdown files
✅ Web-Tier Contract Guard: No violations detected!
✅ Build succeeded: All checks passed!
> web@1.0.0 typecheck /home/baris/UPRISE_NEXT_uxmobile/apps/web
> tsc --noEmit
```

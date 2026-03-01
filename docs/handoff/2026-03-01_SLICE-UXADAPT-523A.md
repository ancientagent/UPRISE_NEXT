# SLICE-UXADAPT-523A — Copy and terminology consistency pass

## Scope
- Docs-only: normalize surface copy (`RADIYO`, `Collection`, tier names, Plot labels) across adaptation docs.

## Changes
- Updated `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`:
  - Added **Terminology Consistency (Adaptation Docs)** section.
  - Added canonical terms table and normalization rules for mode/tier/Plot naming.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Command Output (exact)
```text

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT_uxmobile/apps/web
> tsc --noEmit

```

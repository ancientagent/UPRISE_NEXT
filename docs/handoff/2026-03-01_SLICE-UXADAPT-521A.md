# SLICE-UXADAPT-521A — Desktop fallback controls parity

## Scope
- Docs-only: define click/keyboard fallbacks equivalent to mobile gestures for desktop contexts.

## Changes
- Updated `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`:
  - Added **Desktop Fallback Controls Parity Matrix**.
  - Mapped mobile interaction intents to click and keyboard fallbacks with explicit parity rules.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Command Output (exact)
```text

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT_uxmobile/apps/web
> tsc --noEmit

```

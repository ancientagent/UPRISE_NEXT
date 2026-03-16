# SLICE-UXDISC-557A Handoff

Date: 2026-03-15  
Agent: Codex GPT-5  
Lane: B (`lane-b-ux-discovery-batch16`)

## Scope
Execute one MVP slice only: close Discovery contract parity by consolidating typed-client/test assertions for locked IA and state behavior.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`

## Changes
- Updated `apps/web/__tests__/discovery-client.test.ts`.
- Updated `apps/web/__tests__/discovery-context.test.ts`.
- Added discovery client coverage for:
  - omitting city filters outside `city` scope
  - omitting blank location params
  - rejecting empty tune/set-home mutation payloads
- Added discovery context coverage for explicit non-visitor precedence so local/home status is not overwritten by fallback visitor state.

## Files Touched
- `apps/web/__tests__/discovery-client.test.ts`
- `apps/web/__tests__/discovery-context.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-03-15_SLICE-UXDISC-557A.md`

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- discovery-context.test.ts discovery-client.test.ts communities-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Verify Result
- `docs:lint` passed
- `infra-policy-check` passed
- `pnpm --filter web test -- discovery-context.test.ts discovery-client.test.ts communities-client.test.ts` passed
- `pnpm --filter web typecheck` passed
- `pnpm --filter api typecheck` passed

## Notes
- This slice adds parity coverage only. No new Discovery surface behavior or copy was introduced.

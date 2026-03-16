# SLICE-UXDISC-555A Handoff

Date: 2026-03-15  
Agent: Codex GPT-5  
Lane: B (`lane-b-ux-discovery-batch16`)

## Scope
Execute one MVP slice only: enforce deterministic Discovery-to-Plot scene-switch handoff behavior and context persistence boundaries.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`

## Changes
- Updated `apps/web/src/app/discover/page.tsx`.
- Preserved existing tuned-scene transport context when `Set as Home Scene` completes unless the API explicitly returns replacement discovery context.
- Removed the client-side fallback that previously forced Home Scene reassignment to also overwrite tune transport state.
- Kept Discover-to-Plot handoff aligned with the spec boundary:
  - Home Scene reassignment is a civic-anchor change.
  - Tune context remains a separate transport state.

## Files Touched
- `apps/web/src/app/discover/page.tsx`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-03-15_SLICE-UXDISC-555A.md`

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- discovery-context.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Verify Result
- `docs:lint` passed
- `infra-policy-check` passed
- `pnpm --filter web test -- discovery-context.test.ts plot-tier-guard.test.ts` passed
- `pnpm --filter web typecheck` passed
- `pnpm --filter api typecheck` passed

## Notes
- This change preserves the spec rule that Home Scene assignment and tuned-scene transport are separate controls and separate persisted meanings.

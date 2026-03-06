# 2026-03-06 Reconcile App Drift Pass 3

## Scope

Reconcile remaining app/test drift after recovery commits while preserving existing in-progress work.

## Files Included

- `apps/api/src/places/places.controller.ts`
- `apps/api/src/places/places.service.ts`
- `apps/web/src/app/onboarding/page.tsx`
- `apps/web/src/data/music-communities.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `pnpm-lock.yaml`

## What Was Reconciled

- Kept API reverse-geocode read surface (`GET /places/reverse`) and associated service contract.
- Kept onboarding mobile-first flow + GPS prompt/retry/manual fallback logic already present in working tree.
- Reconciled community labels to concise title-only values (no long explanatory strings).
- Preserved/validated focused `/plot` regression-lock test file.
- Regenerated lockfile to include current workspace dependency graph (including `packages/uizard-mcp`).

## Verification Commands (exact)

```bash
pnpm run docs:lint
pnpm run infra-policy-check
pnpm --filter api typecheck
pnpm --filter web typecheck
pnpm --filter web test -- plot-ux-regression-lock.test.ts
```

## Verification Output (summary)

- `docs:lint`: pass
- `infra-policy-check`: pass
- `api typecheck`: pass
- `web typecheck`: pass
- `web targeted test`: pass (3/3)

## Notes

- `recovery/` remains intentionally untracked for forensic reference.
- No destructive git operations were used.

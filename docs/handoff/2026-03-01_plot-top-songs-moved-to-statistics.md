# Plot Top Songs -> Statistics Scope

## Change
- Moved `Top Songs` panel so it renders only inside `Statistics` tab.
- Removed always-visible Top Songs panel from the right rail.

## Why
- Frees screen real estate for core Plot surfaces (Feed/Events/Promotions/Social).
- Keeps Top Songs coupled to statistics context.

## File
- `apps/web/src/app/plot/page.tsx`

## Verify
```bash
pnpm --filter web typecheck
```

# UX Header Mode Switch (Plot)

## Scope
Adjusted Plot header controls to match requested UX pattern from legacy screenshot:
- Add explicit player mode switch button in the scene row (right side).
- Remove discover/search-style action from Plot header in home mode.

## File
- `apps/web/src/app/plot/page.tsx`

## Verification
```bash
pnpm --filter web typecheck
```

Result:
- Passed (`tsc --noEmit`).

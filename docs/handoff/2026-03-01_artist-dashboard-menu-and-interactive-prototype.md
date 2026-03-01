# Artist Dashboard Menu + Interactive Prototype

## Scope
- Added menu access to artist dashboard prototype.
- Upgraded prototype to interactive sandbox behavior.
- Fixed Plot runtime crash (`Link` import missing) discovered via DevTools.

## Files
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/app/artist-dashboard-r1/page.tsx`
- `docs/CHANGELOG.md`

## DevTools Verification
- Plot header now includes `Artist Dashboard` link.
- Route resolves: `/artist-dashboard-r1`.

## Verify
```bash
pnpm --filter web typecheck
```

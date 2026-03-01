# Discovery Pass Gate + Player Artist Navigation

## Scope
Applied founder-approved behavior updates:
1. Discovery transport entitlement gating for free users.
2. Player-based artist profile navigation from active RaDIYo track area.

## Changes
- `apps/web/src/app/discover/page.tsx`
  - Added Discovery Pass gate model in UI:
    - default free mode: cross-scene transport locked.
    - state/national scope toggles disabled.
    - tune-to-non-home-scene disabled with explicit pass-required label.
  - Override mechanisms for current non-billing implementation:
    - env: `NEXT_PUBLIC_ENABLE_DISCOVERY_PASS=true`
    - dev localStorage: `uprise.discoveryPass=active`

- `apps/web/src/components/plot/PlotPlayerStrip.tsx`
  - Broadcast track parser now captures potential artist profile ids (`uploadedById`, `artistId`, `userId`).
  - Active track title area becomes clickable and routes to `/users/:id` when id is available.

## Canon Alignment
- Matches `ECON-REVENUE` listener tier direction (`Free Listener` vs `Discovery Pass`) without introducing billing backend assumptions.
- Keeps explicit navigation model; no algorithmic discovery added.

## Verification
```bash
pnpm --filter web typecheck
```

Result:
- Passed (`tsc --noEmit`).

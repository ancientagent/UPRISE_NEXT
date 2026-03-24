# 2026-03-24 Cross-Route UX Continuity + Plot Contract Hardening

## Scope
Active web UX lockdown follow-on after `34f625a`, focused on:
- cross-route continuity and auth-dead-end cleanup
- signed-out Discover destination hardening
- community-to-Plot scene handoff durability
- Plot/profile contract cleanup against `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`

## Source of truth
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/system/registrar.md`
- `docs/handoff/2026-03-24_session-context-reconciliation.md`

## Changes

### Cross-route continuity
- `/plot`
  - removed the misleading no-context `Browse Discover` CTA
  - kept the unresolved state anchored to `Complete Onboarding` only
- `/registrar`
  - gated `Band / Artist Registration` before form open when signed out
  - added explicit signed-out action message instead of a late auth dead-end
- `/discover`
  - signed-out current-community discover now warns that artist pages and Home Scene reassignment require sign-in
  - signed-out artist/top-artist/song results no longer link directly into auth-dead-end artist routes
  - explicit button wording is now `Set as Home Scene`
- `/users/[id]`
  - linked Artist/Band entities now route to `/artist-bands/[id]`
- `/community/[id]`
  - `Visit Scene in Plot` now uses explicit scene-context handoff instead of generic `/plot`

### Durable scene handoff
- `/community/[id] -> /plot`
  - switched the route handoff to the existing runtime `POST /discover/tune` contract via `tuneDiscoverScene(...)`
  - preserved a local fallback patch if the tune request fails
  - confirmed live that `Nashville, Tennessee Punk` now reaches `/plot` with:
    - `Tuned Scene: Nashville, Tennessee — Punk`
    - `Visitor`
    - `Selected Community: Nashville, Tennessee Punk`

### Plot/profile contract cleanup
- `/plot`
  - removed non-MVP collapsed-strip avatar/initial bubble
  - removed collapsed-strip state chip (`collapsed` / `peek` / `expanded`)
  - left the strip to username + notifications + options, per locked spec
- `RadiyoPlayerPanel`
  - removed forbidden explicit `Play`, `Pause`, and `Add` buttons from `RADIYO`
  - removed duplicate bottom-row collection transport buttons
  - kept `Collection` mode to eject + shuffle only
  - replaced those extra controls with deterministic helper copy and wheel-action summary
- `/plot`
  - removed Plot-level `SceneContextBadge` after checking spec precedence
  - Plot continuity now lives in the player/context surfaces themselves, which matches the locked mobile + Plot surface docs

## Tests / locks
- updated:
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - `apps/web/__tests__/discover-page-lock.test.ts`
- added:
  - `apps/web/__tests__/route-ux-consistency-lock.test.ts`

## Verification
### Targeted test/runtime verification
- `pnpm --filter web test -- --runInBand __tests__/plot-ux-regression-lock.test.ts __tests__/discover-page-lock.test.ts __tests__/route-ux-consistency-lock.test.ts`
- `pnpm --filter web typecheck`

### Live browser verification (Playwright CLI)
Verified with a disposable signed-in Austin Punk fixture plus runtime Home Scene setup:
- `/registrar`
  - signed-out action gate shows before form open
- unsigned `/discover`
  - sign-in note appears
  - direct artist/song/top-artist auth-dead-end links are suppressed
- `/community/Nashville -> Visit Scene in Plot -> /plot`
  - visitor continuity is preserved end to end
- `/plot`
  - collapsed strip shows username + notification + options only
  - no stacked context badge boxes remain
  - no forbidden RADIYO transport buttons remain
- expanded `/plot` -> Collection mode
  - collection mode enters from selection
  - player shows `Eject` and `Shuffle`
  - no duplicate bottom-row transport buttons remain

## Residual queue
These are not blocked by ambiguity, but they are larger follow-on work than this hardening slice:
- Plot player semantics still do not model a distinct stopped-broadcast state when re-tapping the active tier.
- Expanded-profile `Saved Uprises` / `Saved Promos/Coupons` remain lightweight scene-context placeholders rather than data-backed shelves/cards.
- Plot/profile surface still carries a compact `player mode summary` pill and collection helper copy that may warrant one tighter strict-spec pass if founder wants the screen reduced further.

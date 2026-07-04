# Source Map: Artist Profile / Source Dashboard

Status: active package source map

## Owner Specs

- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/social/message-boards-groups-blast.md`
- `docs/specs/communities/plot-and-scene-plot.md`

## Lane Briefs / Narrative

- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/solutions/SCREEN_NARRATIVE_ARTIST_PROFILE_SOURCE_DASHBOARD_R1.md`

## Runtime Files

- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/app/registrar/page.tsx`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
- `apps/web/src/store/source-account.ts`
- `apps/web/src/lib/source/release-deck-validation.ts`
- `apps/api/src/artist-bands/artist-bands.controller.ts`
- `apps/api/src/artist-bands/artist-bands.service.ts`
- `apps/api/src/registrar/registrar.controller.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/src/tracks/tracks.controller.ts`
- `apps/api/src/tracks/tracks.service.ts`

## Tests / Locks

- `apps/web/__tests__/community-artist-page-lock.test.ts`
- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
- `apps/web/__tests__/source-account-switcher-lock.test.ts`
- `apps/web/__tests__/release-deck-shell-lock.test.ts`
- `apps/web/__tests__/release-deck-validation.test.ts`
- `apps/api/test/registrar.controller.test.ts`
- `apps/api/test/registrar.service.test.ts`
- `apps/api/test/artist-bands.service.test.ts`
- `apps/api/test/tracks.service.test.ts`

## Handoffs / Founder Context

- `docs/handoff/2026-07-04_artist-profile-source-dashboard-owner-spec.md`
- `docs/founder-sessions/2026-07-03_source-listener-messaging-boundary.md`

## Notes

Current web locks are mostly source-content/file-content regression locks and route-level contracts. They are useful drift guards, but they are not proof of full rendered behavior for every state. Major implementation should add focused rendered or integration coverage where behavior changes.

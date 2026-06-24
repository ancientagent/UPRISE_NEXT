# Print Shop Event MVP Hardening

Date: 2026-06-24
Branch: `fix/print-shop-event-mvp-hardening`
Agent: Codex

## Summary

Hardened the current Print Shop event-write seam so it stays source-facing and system-scale:

- promoter-capability users may create promoter-lane events without `artistBandId`
- Artist/Band event creation requires an explicitly selected managed source and submitted `artistBandId`
- generic Artist/Band membership without active source context no longer creates unattached events
- Print Shop event writes reject inactive or non-city community anchors
- web route blocks managed-source event submission until the active source context belongs to the signed-in user
- listener-facing Plot Events remain read-only; no listener event-authoring path was added

## Files Changed

- `apps/api/src/events/events.service.ts`
- `apps/api/test/events.print-shop.service.test.ts`
- `apps/web/src/app/print-shop/page.tsx`
- `apps/web/__tests__/route-ux-consistency-lock.test.ts`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/CHANGELOG.md`

## Contract Locked

- `POST /print-shop/events` accepts promoter-capability events without a source link.
- `POST /print-shop/events` accepts Artist/Band events only when the caller manages the submitted `artistBandId`.
- Managed source Home Scene mismatch still rejects the event.
- Inactive or non-city `communityId` rejects the event.
- `/print-shop` requires either promoter capability or a user-owned active source context before enabling event creation.
- `/print-shop` continues to use explicit venue latitude/longitude input with no city-specific defaults.

## Validation

Run during implementation:

```bash
pnpm --filter api test -- events.print-shop.service.test.ts --runInBand
pnpm --filter web test -- route-ux-consistency-lock.test.ts print-shop-client.test.ts
```

Pending before closeout:

```bash
pnpm --filter api typecheck
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Remaining Notes

- Onboarding browser/device QA remains blocked by the staging CORS mismatch identified in `docs/handoff/2026-06-24_staging-readiness-smoke-2.md`.
- This slice does not implement flyer minting, calendar mutation, paid promotions, business runtime, storage/upload, or listener-facing event authoring.

# Release Deck Media Eligibility Hardening

Date: 2026-07-03
Branch: `test/release-deck-media-eligibility-hardening`
Base: `origin/main` @ `3f746db`
Task: `UPRISE-PLAN-006`

## Summary

Added focused Release Deck eligibility coverage for the current source-admin URL-only MVP contract.

This slice adds a dedicated `tracks.service.test.ts` file so the plan's validation command now targets the Release Deck API eligibility behavior directly.

No runtime behavior, provider state, database state, schema, migrations, media storage, transcoding, paid ad-slot mechanics, or art assets were changed.

## Contract Preserved

- Release Deck has `3` active music slots per managed Artist/Band source per city-tier community.
- No single Release Deck song may exceed `6` minutes / `360` seconds.
- No single source may occupy more than `15` active minutes / `900` seconds in one community rotation at a time.
- `processing` tracks are not counted as active music slots or active rotation minutes.
- Managed source tracks must stay scoped to the managed source Home Scene.
- The paid ad attachment is defined but not active runtime and is not a fourth music slot.
- Current MVP remains hosted `http(s)` URL-only; real upload/storage/transcode/waveform work remains deferred.

## Files Changed

- `apps/api/test/tracks.service.test.ts`
  - Added dedicated Release Deck API eligibility coverage.
- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
  - Added active Release Deck shell/validation locks for caps and paid-ad-slot boundary.
- `docs/CHANGELOG.md`
  - Added this Task 6 slice entry.
- `docs/handoff/2026-07-03_release-deck-media-eligibility-hardening.md`
  - Added this handoff.

## Coverage Added

- API accepts a source-owned ready track at the exact boundary: third slot, `360` seconds, `900` total active seconds.
- API rejects a fourth ready music slot for the same `artistBandId + communityId`.
- API rejects source-owned ready tracks over `360` seconds.
- API rejects source-owned ready tracks that would push the source above `900` active seconds in one community.
- API does not count `processing` tracks as active slots or active rotation minutes.
- API rejects managed-source writes to a community outside the source Home Scene.
- Web shell lock keeps Release Deck cap language explicit and rejects `Music slots: 4` / fourth-music-slot framing.

## Validation

Passed:

```bash
pnpm --filter api test -- tracks.service.test.ts artist-bands.service.test.ts --runInBand
```

Result: 2 suites passed, 9 tests passed.

```bash
pnpm --filter web test -- source-dashboard-shell-lock.test.ts community-artist-page-lock.test.ts release-deck-validation.test.ts release-deck-shell-lock.test.ts --runInBand
```

Result: 4 suites passed, 9 tests passed.

Closeout validation passed:

```bash
pnpm --filter api typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Runtime / Provider / Schema Impact

- Runtime behavior changed: no.
- Provider state touched: no.
- Database state touched: no.
- Schema/migration touched: no.
- Art/assets touched: no.

## Next Slice

Continue to `UPRISE-PLAN-007`: activation readiness transaction revalidation.

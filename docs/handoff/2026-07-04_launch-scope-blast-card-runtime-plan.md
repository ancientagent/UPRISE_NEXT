# 2026-07-04 Launch-Scope Blast Card Runtime Plan

Status: implemented; local validation passed
Branch: `feat/launch-scope-blast-card-runtime`
PR: https://github.com/ancientagent/UPRISE_NEXT/pull/223
Task: UPRISE Development Plan R1 / Stage 4 Task 10

## Execution Packet

Lane: `ACTIONS_SIGNALS` with `UX_UI` Feed surface companion context.

Owner contracts / required docs checked:

- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md`

Likely files:

- `apps/api/src/communities/communities.service.ts`
- `apps/api/test/communities.feed.service.test.ts`
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
- this handoff/plan file

Out of scope:

- No `Travel` button or `travelHref` runtime.
- No Discover map, Seek mode, back-door UI, or transport from Plot.
- No cross-Uprise Blast card activation for launch.
- No Blast on RADIYO wheel, Artist Profile, or Feed inserts.
- No new signal classes, schema changes, provider/db state, or migrations.

Stop conditions:

- If Blast cards require product behavior beyond source link + Artist Profile signal listening handoff.
- If API metadata cannot identify an Artist/Band source from existing signal metadata without inventing a source.
- If implementing listen/load would require creating a dedicated Uprise persistence model or Discover transport path.

## Repo Evidence

Current owner specs say:

- Blast cards are Feed card types for listener Blast activity.
- Every Blast card must expose a link from the blasted signal to that signal's source.
- Eligible outside-Uprise Feed cards may later expose separate `Travel`, but Travel is not launch-scope.
- Current blastable signal classes are `single` and `Uprise`.

Current runtime evidence:

- `SeedFeedPanel.tsx` already renders Feed rows and has `sourceFromMetadata(item)` that reads `item.metadata.artistBand`.
- Track-release rows already link to `/artist-bands/${source.id}?trackId=${item.entity.id}`.
- Artist Profile already supports `?signalId=...` and selects/plays the matching track if the source profile can resolve that signal to a track.
- API `CommunitiesService.getFeed()` builds Blast rows with `metadata.signalMetadata`, but does not project `metadata.artistBand` for Blast rows.
- Therefore the current static lock can pass while real Blast rows may not produce a source link/listening handoff.

## Development Plan

1. RED API test: extend `apps/api/test/communities.feed.service.test.ts` so a `BLAST` action on a `single` signal with metadata `{ title, artist/artistName, artistBandId }` expects the feed item to include:
   - `metadata.signalMetadata` unchanged;
   - `metadata.artistBand.id` from `artistBandId`;
   - `metadata.artistBand.name` from `artist`, `artistName`, or `artistBandName` fallback when present.

2. GREEN API implementation: add a small helper in `CommunitiesService` to derive Artist/Band source projection from signal metadata for Blast rows only when existing metadata contains a usable `artistBandId` and source name. Do not query extra source tables unless needed; keep this deterministic and metadata-compatible.

3. RED web regression lock: update `apps/web/__tests__/plot-ux-regression-lock.test.ts` so Blast rows are expected to have a launch-scope `signalId` Artist Profile handoff, distinct from Travel. The lock should require a helper such as `blastSignalHref(item)` returning `/artist-bands/${source.id}?signalId=${item.entity.id}` only for `item.type === 'blast'` and `item.entity.type === 'signal'`.

4. GREEN web implementation: update `SeedFeedPanel.tsx` so Blast rows with source metadata wrap the row in a `Link` to Artist Profile `?signalId=...`, matching the existing track-release handoff pattern. Keep source text linked where appropriate, but avoid nested links by rendering source text plain inside a linked row.

5. Negative locks must remain:
   - no `Travel` visible;
   - no `travelHref`;
   - no `/discover` handoff from Plot;
   - no inline `Blast`, `Collect`, `Follow`, or wheel controls on Feed inserts.

## Validation Seed

```bash
pnpm --filter api test -- communities.feed.service.test.ts --runInBand
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Plan Review Request

An independent Codex reviewer should verify before implementation:

- the plan matches current repo/spec truth;
- it does not activate deferred Travel/Discover transport;
- it does not invent new signal classes or a Uprise persistence model;
- the proposed API metadata projection is safe and deterministic;
- the proposed web handoff uses Artist Profile `signalId` support rather than adding a new player/transport surface.

## Independent Plan Review Result

Reviewer: Codex subagent `Pauli` (`gpt-5.3-codex-spark`)
Result: PASS

Required safeguards accepted before implementation:

- API projection must emit `metadata.artistBand` only when both a trimmed `artistBandId` and a source name are present in signal metadata.
- API projection must keep `metadata.signalMetadata` unchanged.
- Add a negative API regression case for missing/invalid Blast metadata where source-link data remains absent.
- Web Blast row handoff must be gated on resolved source metadata and `item.type === 'blast'` + `item.entity.type === 'signal'`.
- Avoid nested links: when a row-level Blast handoff exists, source/actor text inside the row must render as plain text, not nested `Link`.
- Keep all Travel/Discover negative locks intact.

Residual risks accepted:

- Older Blast rows with incomplete metadata may remain unlinked until signal creation metadata is hardened.
- Uprise-class Blast signals may land on Artist Profile without selecting a playable track if Artist Profile cannot resolve the signal to a track row.

## Implementation Summary

- `CommunitiesService.getFeed()` now derives a deterministic `metadata.artistBand` projection for Blast rows only when existing signal metadata contains a usable `artistBandId` and source name.
- Blast row metadata keeps `signalMetadata` unchanged for compatibility.
- Incomplete legacy Blast signal metadata intentionally produces no source projection.
- `SeedFeedPanel` now derives a row-level Blast handoff to `/artist-bands/${source.id}?signalId=${item.entity.id}` when the Feed item is a Blast signal row with resolved source metadata.
- Track-release and Blast rows share `itemHref`, which prevents nested links by rendering source/actor text as plain text whenever the whole row is linked.
- Travel/Discover transport remains absent from Plot Feed runtime.

## Independent Execution Review Result

Reviewer: Codex subagent `Averroes` (`gpt-5.3-codex-spark`)
Result: PASS

Reviewer follow-ups addressed before PR merge:

- Marked Task 10 complete in `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md`.
- Added explicit API negative coverage for invalid source metadata guard paths:
  - blank/whitespace `artistBandId`;
  - present `artistBandId` with blank source-name candidates.

## Validation

```bash
pnpm --filter api test -- communities.feed.service.test.ts --runInBand
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm --filter api typecheck
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

Results:

- API focused test passed: 1 suite / 5 tests.
- Web focused tests passed: 2 suites / 43 tests.
- API typecheck passed.
- Web typecheck passed.
- Docs lint passed.
- Workspace registry audit passed with 48 registry entries.
- Whitespace check passed.

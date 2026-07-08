# Release Deck / RADIYO / Sect Readiness Planning Audit

**Agent:** Fable planning auditor
**Date:** 2026-07-08
**Phase:** planning/audit
**Deployment Target:** none (docs/planning only)
**Status:** Complete — recommendation is `patch specs first`

Planning/audit only. No runtime code, no migrations, no provider/env/database state touched.

## 1. Branch / HEAD / Worktree State

| Check | Value |
| --- | --- |
| Base branch | `docs/release-deck-radiyo-sect-readiness-capture` |
| Base HEAD | `47e5125` — matches expected `47e5125` |
| Working branch | `plan/release-deck-radiyo-sect-readiness` |
| Tracked dirty work at start | none (clean) |
| Founder-session file | present (`docs/founder-sessions/2026-07-08_release-deck-radiyo-sect-readiness.md`, 9609 bytes) |

Worktrees:

- `/home/baris/UPRISE_NEXT` — `47e5125` (this audit)
- `/home/baris/UPRISE_NEXT_uximpl` — `be4ddde` `[ux-implementation]` (preserved reference, untouched)
- `/home/baris/UPRISE_NEXT_uxmobile` — `b59a63c` `[ux-mobile-r1-build]` (preserved reference, untouched)

No stop condition triggered.

## 2. Files Read

Authority / routing:

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/specs/system/documentation-framework.md` (Contract Ownership, Lane Agents, Handoff Promotion Rule)
- `docs/agent-briefs/CONTEXT_ROUTER.md` (outline)
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` (action-grammar boundaries)
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md` (sect readiness lines)

Owner specs:

- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md` (scope boundary)

Founder evidence:

- `docs/founder-sessions/2026-07-08_release-deck-radiyo-sect-readiness.md`

Runtime:

- `apps/api/src/tracks/tracks.service.ts`
- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/src/fair-play/fair-play.controller.ts`
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/src/admin-config/dto/fair-play-config.dto.ts`
- `apps/api/src/registrar/` (spec-documented surface; endpoint inventory)
- `apps/api/prisma/schema.prisma` (`Track`, `RotationEntry`, `FairPlayConfig`, `ArtistBand`, `Community`, `SectTag`, `UserTag`, `TrackVote`)
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/lib/source/release-deck-validation.ts`

Tests inspected:

- `apps/api/test/`: `tracks.service.test.ts`, `tracks.engagement.service.test.ts`, `fair-play.service.test.ts`, `fair-play.rotation.test.ts`, `fair-play.metrics.test.ts`, `fair-play.recurrence.test.ts`, `fair-play.vote.test.ts`, `registrar.*.test.ts`
- `apps/web/__tests__/`: `release-deck-validation.test.ts`, `release-deck-shell-lock.test.ts`, `source-dashboard-runtime.test.ts`, `source-dashboard-shell-lock.test.ts`, `tracks-client.test.ts`

## 3. Current Implementation Map

### Release Deck

- `POST /tracks` → `TracksService.createTrack` (`apps/api/src/tracks/tracks.service.ts:32`). Caps apply only when `artistBandId` **and** `communityId` are present **and** `status === 'ready'`:
  - `≤ 360s` per song (`RELEASE_DECK_MAX_TRACK_SECONDS`)
  - `≤ 3` ready tracks per `artistBandId + communityId`
  - `≤ 900s` summed ready duration per `artistBandId + communityId`
  - reject-only; no mutation/replacement of existing tracks
- Web `/source-dashboard/release-deck` calls `createTrack`; `release-deck-validation.ts` mirrors the same caps client-side. `getReleaseDeckReadiness` is **per-source only** (`activeDurationSeconds / 15:00`).
- **Absent:** release date, scheduling, queue, capacity, Uprise-wide aggregation, sect encoding, measurement read model.

### Fair Play / RADIYO

- Implemented and routed: `POST /tracks/:id/vote` (`castVote`), `GET /broadcast/.../rotation` (`getRotation` / `getActiveRotation`), `GET /fair-play/metrics` (`getMetrics`).
- **`ingestNewRelease()` and `aggregateRecurrenceScores()` have no controller route and no production caller.** `fair-play.controller.ts` exposes only `@Post(':id/vote')`. The single `rotationEntry.create` in `apps/api/src` lives inside `ingestNewRelease`, which is referenced only by `apps/api/test/fair-play.service.test.ts`.
- **Consequence: no runtime path moves a Release Deck track into `RotationEntry`. Release Deck and rotation are disconnected today.**
- No graduation job exists. `RotationEntry.graduatedAt` is in schema but never read or written anywhere in `apps/api/src`.
- No `new_window_days` / `newWindowDays` exists anywhere in `apps/api/src` or `apps/web/src`.
- `getMetrics` returns `activeNewCount` but no `current_new_window_days_target`.
- `ingestNewRelease` enforces "artist already has an active new release in this scene" by matching `track.artist` (a **string**), not `artistBandId`. Latent correctness defect if that path is ever wired.

### Density-band configuration

- `FairPlayConfig` carries `bandPersistDays`, `newWindowBandLowMaxActive`, `newWindowBandLowDays`, `newWindowBandMidMinActive`, `newWindowBandMidMaxActive`, `newWindowBandMidDays`, `newWindowBandHighMinActive`, `newWindowBandHighDays`, plus `graduationMinAgeDays`, `graduationExecutionCadenceDays`, `graduationCapPerRun`, `propagation*`.
- `FairPlayService.getFairPlayConfigSnapshot()` reads **only** `recurrenceRollingWindowDays`.
- The band columns are reachable solely through `admin-config` CRUD (`fair-play-config.dto.ts`). **Nothing consumes them for scheduling.**

### Registrar

- Substantial: artist/promoter/project/sect-motion entries, GPS-gated materialization, invite roster + delivery worker seam, capability codes/grants/audit.
- Source origin persisted separately from operating scene: `RegistrarEntry.sourceOrigin{City,State,MusicCommunity}` and `ArtistBand.sourceOrigin{City,State,MusicCommunity}`.
- `POST /registrar/sect-motion` is a skeleton only: `type = sect_motion`, `status = submitted`, payload `{}`. Readback endpoints exist. **No readiness validation, no approval state machine, no Official Sect affiliation records, no Sect entity.**

### Sect readiness

- **Not implemented in any form.** No sect readiness computation exists in `apps/api/src`.
- `SectTag` / `UserTag` exist (community-scoped tag + user join). Specs explicitly hold them non-authoritative (`scenes-uprises-sects.md:131`).
- Onboarding `setHomeScene` still upserts `SectTag`/`UserTag` when a legacy `tasteTag` is supplied.
- **No song↔sect relation exists in schema.** No `Sect` model exists.

### Closest existing analog to Uprise-wide measurement

`AdminAnalyticsService` activation readiness (`GET /admin/analytics/activation-readiness`):

- groups `ready` tracks by `ArtistBand.sourceOrigin{City,State,MusicCommunity}`
- caps each source at `MAX_PLAYABLE_SECONDS_PER_SOURCE = 900`
- thresholds `REQUIRED_PLAYABLE_SECONDS = 2700`, `REQUIRED_DISTINCT_SOURCES = 5`
- read-only/admin; paired with a **manual** trigger `POST /admin/analytics/activation-readiness/activate` (no scheduler)

This is the reusable shape for both Uprise-wide deck measurement and sect readiness. It is keyed on the source-origin tuple rather than `communityId`, has no sect dimension, and returns no "which songs count" breakdown.

## 4. Current Spec Locks (Do Not Change)

- Community identity is `city + state + music community`; never collapsed.
- Release Deck caps: `3` active music slots per source per city-tier community, `6` minutes per song, `15` minutes total active rotation per source. The paid ad attachment is not a music slot. **The founder clarification does not change these.**
- City-tier activation: `45` minutes of approved playable music from `≥ 5` distinct registered source accounts.
- Sect readiness target mirrors activation at `45` minutes.
- Engagement affects recurrence only. Upvotes affect propagation only. Neither crosses.
- `MAX_REPEAT_MAIN = 60 minutes`.
- Voting is city-tier only, GPS-gated, with a currently-playing assertion.
- `Play It Loud` is the RADIYO wheel action. `Blast` is not on RADIYO and not on Artist Profile.
- No personalization, no recommendation engine, no pay-for-placement in broadcast governance.
- Artist Profile: public direct-listen surface, `3` playable rows, no engagement wheel.
- A song cannot be actively listed in more than one Uprise rotation at the same time.
- Sect affiliation is Registrar-held; passive genre/style/taste tags are never authoritative.
- Source origin is stable after materialization; proxy routing must not rewrite it.
- Reject-only behavior at Release Deck cap boundaries (no silent replacement).

## 5. Founder Clarification Summary

From `docs/founder-sessions/2026-07-08_release-deck-radiyo-sect-readiness.md`:

1. Release Deck is **both** per-source tooling **and** the Uprise-wide catalog/scheduling/readiness system. "Think of the release deck for every artist in an uprise as one system."
2. Every accepted song receives **equal protected New Releases time**, currently `10` days, regardless of how many songs enter.
3. Congestion is handled by **release-date scheduling**, not by shortening individual songs to `7` or `5` days.
4. A source places a song in the deck and either **auto-assigns the soonest valid release date** or **chooses a date** when capacity/rules allow.
5. Sect readiness is measured **from Release Deck songs/decks** — not loose tags, passive genre metadata, or popularity. ("release tracks" was corrected to "decks".)
6. Sect backing must be **encoded at the song level**. A source generally affiliating with a sect must **not** automatically make every song count toward that sect.
7. Release Deck must measure: total playable music, remaining source cap, sect-encoded minutes, readiness toward `45` minutes, and **which songs count**.

## 6. Conflicts / Stale Language

### C1 — Density-shortened New Releases window vs equal protected time (direct contradiction)

Current broadcast spec text:

- `radiyo-and-fair-play.md:53-68` — "Density-Based New Window": `≤10 → 10d`, `11–25 → 7d`, `>25 → 5d`, plus 3-day hysteresis.
- `:40-47` — Song Lifecycle: "Assign `new_window_days` from current density target."
- `:152-156` — Telemetry: `ActiveNewCount`, `current_new_window_days_target`.
- `:188-189` — Acceptance: "New-window target changes only after 3-day hysteresis."
- `:197` — Acceptance: "Stable behavior across density scenarios (`~6`, `15`, `25`, `35+` active new songs)."

Founder direction: every accepted song gets the same protected window; congestion is resolved upstream by scheduling.

**Classification: owner-spec correction required.**

**Cost of the correction is effectively zero.** Nothing in `apps/api/src` consumes the density bands, `ingestNewRelease` is unwired, and no graduation job exists. This is a documentation correction plus a greenfield build, not a behavior migration. The `FairPlayConfig` band columns can be deprecated in place.

### C2 — Sect readiness counting unit is source-level, not song-level (direct contradiction)

- `scenes-uprises-sects.md:28` and `:112` — "counts approved playable minutes only from registered source accounts that explicitly tag/back/affiliate with that sect."
- `registrar.md:34` and `:85` — identical wording. `:361` target model: "Explicit registered-source sect backing/readiness references."
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md:68` — identical wording.

Founder: "these things need to be encoded into the song"; source affiliation alone must not make every song count.

**Classification: direct contradiction on the counting unit.** As written, an implementer would count *every* ready track belonging to a sect-affiliated source. That is precisely the behavior the founder prohibited.

Nuance worth preserving: both specs already list *song-level backing limits* as deferred (`scenes-uprises-sects.md:139`, `registrar.md:336`), so song-level granularity was anticipated. This is a tightening of the counting unit, not a reversal of intent. Do not conflate song-level **encoding** (now required) with song-level **backing limits** (still beta-calibrated).

### C3 — Release Deck is defined as per-source only (gap, not contradiction)

`release-deck-and-eligibility.md` scopes everything to `artistBandId + communityId` and its Overview calls Release Deck "the current source-facing path". `PLATFORM_START_HERE.md:25` and `ARTIST_PROFILE_SOURCE_DASHBOARD.md:92-94` repeat the per-source framing. Nothing states Release Deck *is* the Uprise-wide system; nothing states it isn't.

**Classification: missing concept + missing measurement responsibility.**

### C4 — Release-date scheduling has no owner contract (ownership gap)

The contract table in `documentation-framework.md:175` assigns "Release Deck media eligibility" to the media spec and "Broadcast/Fair Play" to the broadcast spec. **Release-date scheduling (queue, capacity, date assignment) is owned by neither.** Per the contract-owner rule in `AGENTS.md`, a cross-system rule must have exactly one owner section before implementation.

### C5 — Release Deck and rotation are not connected in runtime (runtime gap)

`POST /tracks` never creates a `RotationEntry`. `ingestNewRelease` is dead code outside tests. Any "assign release date → enter New Releases" work is greenfield and must build the ingest path.

Secondary defect surfaced while auditing: `ingestNewRelease`'s "one active new release per artist" guard matches on the `track.artist` string rather than `artistBandId`. Two sources with the same display name collide; one source renamed mid-flight escapes the guard. Fix when the path is wired.

### C6 — `RotationEntry` cannot express a scheduled/pending release (schema gap)

`pool` is a two-value enum (`NEW_RELEASES` | `MAIN_ROTATION`), `enteredPoolAt` is required, `@@unique([trackId, sceneId])`. There is no `scheduledFor` and no pending state.

### Stale language to clean during the patch (not conflicts)

- `radiyo-and-fair-play.md:197` density-scenario acceptance criterion.
- `FairPlayConfig.newWindowBand*` + `bandPersistDays` columns and their admin-config DTO/CRUD surface.
- `RotationEntry.graduatedAt` — present, unused; will finally be written by the graduation slice.

## 7. Owner-Spec Patch Plan

Per the Handoff Promotion Rule: full rule in the owner spec, short pointers in lane briefs.

| # | Owner spec | Owns after patch | Change |
| --- | --- | --- | --- |
| P1 | `docs/specs/media/release-deck-and-eligibility.md` | Uprise-wide deck system + measurement read model | New section: aggregate every source deck in a city-tier community as one catalog. Measurement outputs: total playable seconds, per-source capped seconds, remaining source cap, distinct source count, sect-encoded seconds, readiness vs `45` min, and which songs count. Caps (`3`/`6`min/`15`min) unchanged. |
| P2 | `docs/specs/media/release-deck-and-eligibility.md` | **Release-date scheduling contract** | New section: song enters deck → auto-assign soonest valid date **or** source-chosen date when capacity allows. Deterministic and auditable. No pay-for-placement, no manual favoritism. Cross-link the broadcast join point. |
| P3 | `docs/specs/broadcast/radiyo-and-fair-play.md` | New Releases window | **Replace** "Density-Based New Window" with a fixed protected window (`10` days). Patch Song Lifecycle (drop "from current density target"), Telemetry (drop `current_new_window_days_target`; retain `ActiveNewCount` as diagnostic only), Acceptance (drop hysteresis + density-scenario criteria; add "every accepted song receives an equal protected window"). Mark `FairPlayConfig.newWindowBand*` / `bandPersistDays` deprecated-not-dropped. Leave engagement/upvote separation, `MAX_REPEAT_MAIN`, graduation, and propagation untouched. |
| P4 | `docs/specs/broadcast/radiyo-and-fair-play.md` | Scheduling join point | State that congestion is resolved **before** New Releases entry by Release Deck scheduling, and that Fair Play never shortens a window. Add the ingest join point: scheduled release date → New Releases. |
| P5 | `docs/specs/communities/scenes-uprises-sects.md#sect-readiness-and-sect-uprise-boundary` | Sect readiness counting unit | Change "Readiness Inputs" from source-account backing to **song-level sect encoding on Release Deck songs**. Retain the `45`-minute target, the passive-tag prohibition, and beta-calibrated backing limits. State explicitly: source affiliation ≠ automatic song inclusion. |
| P6 | `docs/specs/system/registrar.md#sect-affiliation-and-motion-authority` | Authority to encode song-level backing | Registrar owns **who may encode** (source must hold Registrar-recognized sect affiliation); Release Deck owns **where the encoding lives** (the song). Update `:34`, `:85`, and the `:361` target-model line. |
| P7 | `docs/specs/system/documentation-framework.md` | Contract Ownership table | Add rows: "Uprise-wide Release Deck measurement" → media spec; "Release-date scheduling" → media spec (broadcast holds the join point). Update the "Sect readiness" row to note song-level encoding. |
| P8 | `ARTIST_PROFILE_SOURCE_DASHBOARD.md`, `REGISTRAR_GOVERNANCE.md`, `PLATFORM_START_HERE.md` | pointers only | After P1–P6 merge. `REGISTRAR_GOVERNANCE.md:68` must change source-level → song-level. `PLATFORM_START_HERE.md:25` gains one Uprise-wide deck sentence. `ACTIONS_AND_SIGNALS.md` needs **no** change (no action-grammar impact). |
| P9 | `docs/CHANGELOG.md` | — | Handoff Promotion Rule step 5. |

### Ownership recommendation for P2

**Put release-date scheduling in the media/Release Deck spec, with a join-point subsection in broadcast.**

Rationale: the founder frames scheduling as a deck responsibility ("put it in the release deck, once its put in the deck it gets assigned its release date based on all the other songs in all other release decks"). Capacity lives in the deck. Fair Play's own spec begins its lifecycle at "song enters New Releases Pool". Owning scheduling in broadcast instead would split deck capacity from deck data across two contracts.

## 8. Likely Schema / API / UI Impact

Not implemented here. No migration authored.

### Schema (all additive)

- **`Sect` model** — Registrar-recognized Official Sect, parented to a city-tier `communityId`. Does not exist today. `SectTag` is **not** this and must not be implicitly promoted (`scenes-uprises-sects.md:131`).
- **`TrackSectBacking`** — song↔sect join: `{ trackId, sectId, encodedByArtistBandId, createdAt }`, unique on `(trackId, sectId)`. Uniqueness shape depends on Q1 below.
- **`ReleaseSchedule`** — `{ trackId, communityId, scheduledFor, assignmentMode: 'auto'|'chosen', createdAt }`. Preferred over `Track.scheduledReleaseAt`: keeps `Track` clean, supports per-community scheduling, and survives proxy→natural cutover re-scheduling.
- **`RotationEntry.newWindowDays Int`** — locked at entry (`10` initially). Keeps the per-song window auditable even under a fixed policy; the existing `graduatedAt` finally gets written. Do **not** re-introduce density bands.
- **`FairPlayConfig.newReleaseWindowDays Int?`** default `10`. Deprecate (do not drop) `newWindowBand*` and `bandPersistDays`; column removal is a separate cleanup slice.

### API

- `GET /communities/:id/release-deck/measurement` — Uprise-wide totals. Start read-only/admin-scoped, mirroring the activation-readiness precedent.
- `POST /release-deck/schedule` (or extend `POST /tracks`) accepting `releaseDateMode: 'soonest' | 'chosen'` + optional `requestedReleaseDate`.
- `GET /release-deck/schedule?communityId=` — capacity / next-available preview.
- `POST /registrar/sect/:sectId/affiliate` — source affiliation (Registrar authority).
- `POST /tracks/:id/sect-backing` — song-level encoding, **gated on the source holding sect affiliation**.
- `GET /sects/:id/readiness` — mirrors the activation-readiness response shape.
- Ingest path must be built: scheduled date reached → `RotationEntry` (`NEW_RELEASES`). **Manual/admin trigger first, no scheduler/cron**, following `POST /admin/analytics/activation-readiness/activate`.

### UI

- Release Deck route gains: release-date mode (soonest vs choose), per-song scheduled state, a read-only Uprise-wide readiness panel, and a per-song sect-backing toggle visible only when the source holds sect affiliation.
- Must not add: manual song reordering, purchased placement, popularity signals.
- Source Dashboard shell stays unchanged (explicit task boundary).

## 9. Recommended Implementation Slices

Ordering rationale: **A** must land first because the specs currently instruct the wrong model. **B** is independent of A's runtime and reuses thresholds the founder did not change. **C** needs A2's contract and Q3's answer. **D** needs a `Sect` entity that does not exist plus an open Registrar IA decision. **E** needs the Source Dashboard shell.

### Phase A — spec-only, no runtime (land first)

- **A1** — P3 + P4: replace `10 / 7 / 5` with the fixed protected window; add the scheduling join point. *Highest value, zero runtime cost, unblocks everything.*
- **A2** — P1 + P2: Uprise-wide deck system + release-scheduling contract.
- **A3** — P5 + P6: song-level sect encoding + Registrar encoding authority.
- **A4** — P7 contract table + P8 lane-brief pointers + P9 changelog.

### Phase B — measurement, read-only (safe now; no shell dependency)

- **B1** — Uprise-wide deck measurement service modeled on `AdminAnalyticsService` activation readiness, keyed on `communityId`. Extract a shared capped-playable-minutes helper rather than duplicating `REQUIRED_PLAYABLE_SECONDS` / `MAX_PLAYABLE_SECONDS_PER_SOURCE`.
- **B2** — measurement read endpoint (admin/source-scoped).
- **B3** — deprecate density band config: mark `newWindowBand*` unused in the admin-config DTO, add `newReleaseWindowDays`. **No column drop.**

### Phase C — scheduling (core contract change)

- **C1** — `ReleaseSchedule` model + additive migration (its own PR).
- **C2** — deterministic soonest-date auto-assignment, capacity sourced from B1. *Blocked on Q3.*
- **C3** — source-chosen date with capacity validation. *Blocked on Q2.*
- **C4** — wire the ingest path: scheduled date → `RotationEntry` `NEW_RELEASES` with `newWindowDays = 10`, via manual/admin trigger. Fix the `track.artist`-string guard → `artistBandId` in the same slice.
- **C5** — graduation: `now >= enteredPoolAt + newWindowDays` → `MAIN_ROTATION`, set `graduatedAt`. Still manual-trigger.

### Phase D — sect (gated on Registrar IA)

- **D1** — `Sect` model + Registrar Official Sect affiliation records. *Blocked on "Registrar menu architecture for Official Sect discovery" (`registrar.md:430`, explicitly open).*
- **D2** — `TrackSectBacking` + encoding endpoint gated on source affiliation. *Blocked on Q1.*
- **D3** — sect readiness read model (reuse the B1 helper, add the sect filter).
- **D4** — Release Deck sect-backing UI.

### Phase E — UI (wait for shell)

- Release Deck route scheduling + readiness panel. Deferred until the Artist Profile / Source Dashboard shell settles (specs landed in PR #227; shell scope is separate from Release Deck scheduling/readiness scope).

### Answers to "now vs wait"

- **Implementable now:** A1–A4 (spec), B1–B3 (read-only measurement), C1 (additive model only).
- **Wait for Source Dashboard shell:** E, D4.
- **Wait for founder / Registrar IA:** D1–D3, C2, C3.

## 10. Tests / Validation Plan

### API

- `tracks.service.test.ts` — existing `3` / `6`min / `15`min cap behavior must remain green (regression guard; the founder did not change caps).
- new `fair-play.new-window.test.ts` — **every song receives `newWindowDays = 10` regardless of `ActiveNewCount`.** This is the direct anti-regression test against the `10 / 7 / 5` model. Assert density has no effect at `6`, `15`, `25`, `35+` active new songs.
- new `fair-play.graduation.test.ts` — graduation at `enteredPoolAt + 10d`; `graduatedAt` written.
- `fair-play.service.test.ts` — extend the `ingestNewRelease` conflict test to assert the guard keys on `artistBandId`, not the `artist` display string.
- new `release-deck.measurement.test.ts` — total playable seconds, per-source `900s` cap applied, distinct source count, remaining cap, and the "which songs count" breakdown.
- new `release-schedule.test.ts` — soonest-date assignment is deterministic; chosen date accepted within capacity; over-capacity chosen date handled per Q2; no source exceeds `15` active minutes via scheduling.
- new `sect-readiness.test.ts` — **a sect-affiliated source with zero song-encoded tracks contributes zero minutes.** This is the direct anti-regression test against C2. Only song-encoded tracks count. `SectTag` / `UserTag` rows contribute nothing.
- registrar — encoding a sect backing requires an affiliated source; unaffiliated source is rejected.

### Web

- `release-deck-validation.test.ts` — caps unchanged.
- `release-deck-shell-lock.test.ts` — must not regress when scheduling UI lands.
- new — release-date mode selection; readiness panel is read-only; no manual reorder control rendered; no purchase/placement affordance rendered.

### This PR (docs-only)

- `pnpm run docs:lint`
- `git diff --check`

## 11. Do-Not-Build Boundaries

- No paid promotion, pay-for-placement, or purchasable release dates.
- No recommendation, personalization, or popularity input to scheduling or readiness.
- No manual song-ordering favoritism.
- Sect readiness must not read artist tags, listener taste tags, `SectTag` / `UserTag`, popularity, follower counts, or profile metadata.
- Do not auto-promote `SectTag` / `UserTag` into Official Sect affiliation.
- Do not collapse `city + state + music community` identity.
- Do not move Artist Profile direct-listen behavior into RADIYO wheel behavior.
- Do not put `Blast` on RADIYO or Artist Profile.
- No scheduler/cron in the first slices; follow the activation-readiness manual-trigger precedent.
- Do not drop `FairPlayConfig` band columns in the same PR that changes behavior.
- Do not change the `3` / `6`-minute / `15`-minute Release Deck caps. The founder clarification does not touch them.
- Do not build listener-side sect demand queues.

## 12. Open Founder Questions (Blocking Only)

**Q3 is the most consequential — it blocks the central algorithm.**

- **Q3 (blocks C2, and therefore any auto-assignment): What is the capacity unit for release dates?** Songs per day per Uprise? Minutes per day? Something else? The founder's model — "it gets assigned its release date based on all the other songs in all other release decks" — presupposes a capacity function that exists nowhere in specs or runtime. Without it, "soonest valid date" is undefined and Phase C cannot be specified, let alone built.
- **Q1 (blocks D2 schema): Can one song encode multiple sects, or exactly one?** The founder session explicitly lists this as open ("whether one song can encode one sect or multiple sects"). It determines `TrackSectBacking` uniqueness and whether readiness minutes may double-count across sects in the same Uprise.
- **Q2 (blocks C3 API contract, not C2): When a requested release date is over capacity — reject, or suggest the nearest valid alternate?** The founder session marks this "Excluded / not activated".

Non-blocking, safe to default: whether the measurement endpoint is admin-only at first. **Default: yes**, following the activation-readiness precedent; widen later.

## 13. Final Recommendation

**Patch specs first. Do not begin runtime work.**

1. The broadcast spec currently instructs an implementer to build `10 / 7 / 5` density-shortened windows. The founder direction contradicts this. Runtime work started today would encode the wrong fairness model.
2. **The correction is free.** Nothing in `apps/api/src` consumes the density bands; `ingestNewRelease` is unwired; no graduation job exists. Deleting the density model from the spec carries no migration cost and no rollback risk. This is the cheapest correction this area will ever have.
3. The sect readiness counting unit is contradicted in **three owner specs and one lane brief**. Implementing against the current text produces exactly the behavior the founder prohibited — every song from a sect-affiliated source counting automatically.
4. Release-date scheduling has **no owner contract**. Building it now would create a cross-system rule with no home, violating the contract-owner rule in `AGENTS.md`.
5. Q3 (capacity unit) is genuinely unanswered, so the scheduling algorithm cannot be specified yet.

**Immediate action:** land Phase A (A1–A4) as spec-only PRs. Phase B may proceed in parallel — it reuses the `45`-minute / `5`-source / `15`-minute thresholds the founder did not change, and delivers the measurement surface every later slice depends on.

Treat Release Deck scheduling/readiness as a core contract change, not a visual-only UI task. Keep it sequenced behind spec patches and separate from Artist Profile / Source Dashboard shell work.
</content>
</invoke>

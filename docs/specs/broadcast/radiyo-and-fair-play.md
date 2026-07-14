# RaDIYo and Fair Play (Two-Pool Broadcast V1)

**ID:** `BROADCAST-FP`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-07-14`

## Overview & Purpose
Defines Fair Play V1 as a two-pool broadcast system that preserves radio-like listening while separating recurrence logic from propagation logic.

## Core Concept
Fair Play uses two listening pools:

1. `New Releases Pool`
- Songs in the active New Window.
- Songs cannot be buried during this window.
- Continuous pool-local rotation.

2. `Main Rotation Pool`
- Songs that graduated from New Window.
- Recurrence governed by engagement-derived recurrence weights.
- Hard cap: no song repeats more than once per hour in Main Rotation.

Listeners can explicitly toggle between:
- `New Releases`
- `Main Rotation`

No automatic switching.

## Separation of Concerns (Locked)
- Engagement affects recurrence only.
- Upvotes affect propagation/tier advancement only.
- Upvotes never affect recurrence.
- Engagement never advances tier.
- `Play It Loud` is the positive `RADIYO` wheel action for the currently playing broadcast song.
- `Play It Loud` is not `Upvote` and must not be treated as propagation or hosted-room creation.
- `Blast` belongs to the personal player / user-space listening context, not the `RADIYO` wheel.

## Song Lifecycle
1. Upload:
- Source places the song in Release Deck.
- Release Deck assigns or accepts a valid release date before RADIYO entry.
- On the scheduled release date, the song enters `New Releases Pool`.
- Assign `entered_new_at`.
- Assign `new_window_days = 10`.

2. New Window:
- Song remains visible for full assigned duration.
- Cannot be buried by scoring.

3. Graduation:
- When `now >= entered_new_at + new_window_days`, song exits New Releases and enters Main Rotation.
- Initial recurrence weight is derived from engagement within the configured rolling window.

## Fixed Protected New Releases Window

Every accepted song that enters `New Releases Pool` receives the same protected
New Releases run:

- `new_window_days = 10`

The protected window does not shrink based on how many songs are entering the
system. Daily single volume and Uprise deck density are handled upstream by
Release Deck release-date scheduling, not by shortening an individual song's
protected RADIYO window.

Per-song assignment:
- `new_window_days` is locked at entry.
- No retroactive per-song window edits.
- Existing `FairPlayConfig` density-band fields such as `newWindowBand*` and
  `bandPersistDays` are deprecated compatibility/configuration fields until a
  cleanup migration intentionally removes or repurposes them. They must not be
  used to reintroduce `10 / 7 / 5` protected-window behavior.

## Recurrence Engine (Main Rotation)
Cadence:
- Recompute recurrence weights every `48 hours`.
- Use rolling window of `14 days` for recurrence calculation.

Input model:
- Engagement signal model is configurable (playback-weight model or explicit preference dial).
- V1 preference model target: sticky per-user per-song dial (`-5..+5`), recurrence-only.

Mapping:
- Recurrence weights map to frequency tiers or weighted scheduling.
- Must remain deterministic and auditable.

Hard constraints:
- `MAX_REPEAT_MAIN = 60 minutes`
- No removal purely from low engagement; low-performing songs become increasingly infrequent before any lifecycle removal policy applies.

## Scheduling
### Release Deck Join Point
- Release Deck owns release-date scheduling before a song enters RADIYO.
- Fair Play owns lifecycle after the scheduled song enters `New Releases Pool`.
- Fair Play must not shorten a song's protected run because of pool density.
- Release Deck scheduling must not manually reorder active Fair Play rotation
  entries, create pay-for-placement, or grant per-artist exceptions.

### New Releases Pool
- Continuous fair rotation of active new songs.
- No on-the-hour requirement.

### Main Rotation Pool
- Continuous weighted scheduling by recurrence weight.
- Enforce max-repeat cap.
- Maintain scheduler diagnostics for repeat interval compliance.

## Propagation / Tier Advancement
- Upvotes are the only advancement signal.
- Public-facing wheel/save language should use `Collect`, not `Add`, when listeners keep a song in profile-bound shelves or playlists.
- The positive `RADIYO` wheel action is `Play It Loud`, not `Blast`.
- Threshold model is configurable and must support:
  - minimum unique eligible listeners
  - rate-based thresholding
  - optional confidence-bound gate
- A song is only graduation-eligible after a minimum active lifecycle age of `14 days`.
- Graduation execution runs every `14 days` (batched promotion runs, not continuous draining).
- Graduation cap per run is enforced to prevent pool churn (`GRADUATION_CAP_PER_RUN`, value TBD).

## Proxy Cutover And Lifecycle Join Points

This section owns the Fair Play side of proxy-to-natural Home Scene cutover. Registrar owns source origin; the community spec owns activation readiness and community lifecycle. Fair Play owns what happens to songs, votes, rotation entries, and tier evidence once a natural Home Scene activates.

Owner references:
- `docs/specs/system/registrar.md#source-origin-contract`
- `docs/specs/communities/scenes-uprises-sects.md#city-tier-activation-workflow`
- `docs/specs/users/onboarding-home-scene-resolution.md#proxy-to-natural-cutover-user-contract`

### Locked Cutover Rules

- Activation of a natural Home Scene must not clone, transfer, or double-list an already active proxy-scene song into the new natural scene.
- Existing songs already active in a proxy scene finish their current active placement in that prior scene/tier. "Current active placement" means the song's current New Releases/Main Rotation/tier placement until a normal lifecycle transition, removal/replacement rule, or approved promotion path ends that active placement.
- New songs submitted after natural-scene activation attach according to the source's active Home Scene/source-origin rules.
- A song cannot be actively listed in more than one Uprise rotation at the same time.
- After a proxy-scene active placement ends, the source may reuse the same song in the new natural Home Scene only if the song has not already advanced to the statewide tier.
- Proxy-scene listener votes, source/song voting data, engagement history, and recurrence evidence stay with the scene/tier where they occurred. They do not transfer into the newly active natural city-tier Home Scene.
- The newly active natural Home Scene starts its local city-tier voting/evidence context from its own eligible songs and listeners after activation.
- GPS-verified users routed through a proxy may vote only in their assigned active proxy scene for that music community, not in arbitrary Away Scenes.
- Propagation voting is city-tier only in current runtime: `POST /tracks/:id/vote` must reject state-tier, national-tier, or other non-city scenes even when `User.tunedSceneId` points at that scene for listening context.

### Same-State And Cross-State Edge Policy

- Same-state proxy assignment is the expected path; statewide tier identity remains coherent when the submitted/source-origin state and proxy scene state match.
- Cross-state proxy assignment is an edge case allowed only when no same-state active major-node exists for the selected music community.
- If cross-state proxy assignment is unavoidable, implementation must preserve both source-origin state and proxy-scene state in diagnostics before relying on statewide tier identity.
- Cross-state proxy songs may continue tier progression provisionally, but statewide origin/identity handling remains a policy item to lock before automated production promotion depends on it.

### Not Implemented By This Contract

- No new promotion job is created here.
- No activation evaluator is created here.
- No migration or dedicated Uprise model is required by this section.
- No new song-removal policy is defined here.
- Exact promotion thresholds, graduation cap, and low-recurrence removal/floor policy remain governed by the open Fair Play decisions below.

## Non-Functional Requirements
- No personalization.
- No recommendation engines.
- No pay-for-placement in broadcast governance.
- Deterministic, auditable weight and schedule outputs.

## Telemetry Requirements
- `ActiveNewCount` (daily)
- `new_window_days` per song (currently fixed at `10`)
- scheduled-release diagnostics from Release Deck once scheduling is implemented
- Per-song lifecycle:
  - `entered_new_at`
  - `scheduled_graduation_at`
  - `entered_main_at`
- `recurrence_weight(song_id)` (daily snapshot)
- Scheduling diagnostics:
  - average repeat interval by weight/frequency tier
  - repeat-cap violations (must be zero)

## API Design (Target)
### Implemented now
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/tracks` | required | Create a track row for the authenticated uploader; supports community-scoped runtime ingestion for current artist/discover flows |
| POST | `/tracks/:id/engage` | required | Record recurrence input event |
| POST | `/tracks/:id/vote` | required | Cast city-tier propagation vote (GPS/Home Scene gated; currently-playing assertion required; non-city scenes rejected) |
| GET | `/broadcast/:sceneId/rotation` | required | Retrieve ordered New Releases + Main Rotation pools with metadata |
| GET | `/broadcast/rotation` | required | Retrieve ordered pools for active scene context (tuned scene first, Home Scene fallback) |
| GET | `/fair-play/metrics?sceneId=:sceneId` | required | Retrieve scene lifecycle/recurrence diagnostics |
| POST | `/admin/fair-play/new-releases/ingest` | authenticated (RBAC deferred) | Dry-run or transactionally ingest due Release Deck schedules into fixed-window New Releases entries |
| POST | `/admin/fair-play/graduation/run` | authenticated (RBAC deferred) | Dry-run or transactionally graduate due New Releases entries into Main Rotation with engagement-derived initial recurrence |

### Implemented support contract
- `POST /tracks` currently creates a valid track row with uploader ownership, file URL, duration, and optional community attachment.
- This is a runtime ingestion contract, not a full upload/transcoding pipeline definition.
- Track creation support exists so artist/discover flows can be exercised through the API instead of direct DB fixture insertion.
- Fair Play lifecycle mutation is manual/admin-triggered in R1; cron/queue automation and full admin RBAC are not activated by the ingestion or graduation endpoints.
- Proxy-to-natural song, vote, and tier behavior follows `Proxy Cutover And Lifecycle Join Points`.

### Planned
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/broadcast/:sceneId/new` | required | Stream New Releases pool |
| GET | `/broadcast/:sceneId/main` | required | Stream Main Rotation pool |

## Acceptance Criteria
- New songs remain in New Releases for their assigned window and cannot be buried.
- Every accepted song receives the same protected New Releases run (`10` days)
  once it enters RADIYO/New Releases.
- New-window duration must not shrink because of active new-song density.
- Songs graduate automatically after window expiry.
- Main Rotation recurrence changes only at 48-hour recompute cadence.
- No Main Rotation repeat faster than once/hour.
- Upvotes do not affect recurrence.
- Engagement does not affect propagation.
- Proxy-scene votes/history remain historical to the proxy scene/tier after natural Home Scene activation.
- Vote creation rejects non-city-tier scenes; state/national tier listening or promotion context must not become a direct vote target.
- Natural-scene activation does not create dual-active rotation placement for a song.
- Stable behavior across daily single volume scenarios by relying on Release
  Deck scheduling before New Releases entry.

## Open Decisions
- Exact propagation threshold formula.
- Practical floor/removal policy for persistently low-recurrence songs.
- `GRADUATION_CAP_PER_RUN` numeric value.
- Automated production policy for cross-state proxy advancement identity.
- Production tuning for Release Deck scheduling capacity values and
  scheduler/job wiring.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
- `docs/specs/DECISIONS_REQUIRED.md`

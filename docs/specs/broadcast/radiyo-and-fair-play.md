# RaDIYo and Fair Play (Two-Pool Broadcast V1)

**ID:** `BROADCAST-FP`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-20`

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

## Song Lifecycle
1. Upload:
- Song enters `New Releases Pool`.
- Assign `entered_new_at`.
- Assign `new_window_days` from current density target.

2. New Window:
- Song remains visible for full assigned duration.
- Cannot be buried by scoring.

3. Graduation:
- When `now >= entered_new_at + new_window_days`, song exits New Releases and enters Main Rotation.
- Initial recurrence weight is derived from engagement within the configured rolling window.

## Density-Based New Window
Density driver:
- `ActiveNewCount = number of songs currently in New Releases Pool`
- Listener population is not used for this calculation.

Default step bands:
- `ActiveNewCount <= 10` -> `new_window_days = 10`
- `11 <= ActiveNewCount <= 25` -> `new_window_days = 7`
- `ActiveNewCount > 25` -> `new_window_days = 5`

Hysteresis rule:
- Band changes only commit after `3` consecutive days in the new band.

Per-song assignment:
- `new_window_days` is locked at entry.
- No retroactive per-song window edits.

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
### New Releases Pool
- Continuous fair rotation of active new songs.
- No on-the-hour requirement.

### Main Rotation Pool
- Continuous weighted scheduling by recurrence weight.
- Enforce max-repeat cap.
- Maintain scheduler diagnostics for repeat interval compliance.

## Propagation / Tier Advancement
- Upvotes are the only advancement signal.
- Threshold model is configurable and must support:
  - minimum unique eligible listeners
  - rate-based thresholding
  - optional confidence-bound gate
- A song is only graduation-eligible after a minimum active lifecycle age of `14 days`.
- Graduation execution runs every `14 days` (batched promotion runs, not continuous draining).
- Graduation cap per run is enforced to prevent pool churn (`GRADUATION_CAP_PER_RUN`, value TBD).

## Non-Functional Requirements
- No personalization.
- No recommendation engines.
- No pay-for-placement in broadcast governance.
- Deterministic, auditable weight and schedule outputs.

## Telemetry Requirements
- `ActiveNewCount` (daily)
- `current_new_window_days_target`
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
| POST | `/tracks/:id/engage` | required | Record recurrence input event |
| POST | `/tracks/:id/vote` | required | Cast propagation vote (GPS/Home Scene gated; currently-playing assertion required) |
| GET | `/broadcast/:sceneId/rotation` | required | Retrieve ordered New Releases + Main Rotation pools with metadata |

### Planned
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/broadcast/:sceneId/new` | required | Stream New Releases pool |
| GET | `/broadcast/:sceneId/main` | required | Stream Main Rotation pool |
| GET | `/fair-play/metrics` | required | Retrieve lifecycle/recurrence diagnostics |

## Acceptance Criteria
- New songs remain in New Releases for their assigned window and cannot be buried.
- New-window target changes only after 3-day hysteresis.
- Songs graduate automatically after window expiry.
- Main Rotation recurrence changes only at 48-hour recompute cadence.
- No Main Rotation repeat faster than once/hour.
- Upvotes do not affect recurrence.
- Engagement does not affect propagation.
- Stable behavior across density scenarios (`~6`, `15`, `25`, `35+` active new songs).

## Open Decisions
- Exact propagation threshold formula.
- Practical floor/removal policy for persistently low-recurrence songs.
- `GRADUATION_CAP_PER_RUN` numeric value.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
- `docs/specs/DECISIONS_REQUIRED.md`

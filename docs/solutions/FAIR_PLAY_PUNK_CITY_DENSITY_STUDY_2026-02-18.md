# Fair Play Punk City Density Study (2026-02-18)

## Objective
Stress-test a city-tier Fair Play list model for punk with:
- 20 artists max
- 3/4 of artists carrying 3 songs
- 1 active new song at a time
- average song length of 2:00
- capped cycle targets (60, 75, 90 minutes tested)

This study focuses on:
1. Whether dial-based signal has enough variance.
2. Whether song repeat bands can hit target behavior.
3. Reasonable listener-per-artist defaults for simulation.

## Locked Inputs (from founder direction)
- Dial replaces simple +/- signal.
- Dial scale: `-5..+5` integer.
- Dial is sticky per `user+song` (persisted, editable later).
- Upvote is for propagation only, not placement.
- New-song boost window: max 3 days.
- Weak songs: pushed to max-penalty zone, then removed if degradation continues.
- List model (placement + replay penalties), not equal-round-robin rotation.

## Quick External Calibration (Austin/LA)

### Source-backed anchors
1. BLS OEWS 2023 metro data:
   - Austin-Round Rock, TX: `Musicians and Singers` total employment = `220`.
   - Los Angeles-Long Beach-Anaheim, CA: `Musicians and Singers` total employment = `2,750`.
2. Austin official tourism page states `250+ live music venues`.
3. Bandsintown punk listings (Austin/LA) were used as a crowd-interest proxy (visible listing interest counts, not total audience).

### Practical interpretation
- Bandsintown visible-interest samples (quick scrape from search-visible listing snippets) produce:
  - Austin sample median: `19.5` (trimmed median `17`)
  - Los Angeles sample median: `29.5` (trimmed median `21`)
- Inference: a working MVP default of `~10 listeners per artist` is realistic and conservative for punk city simulation.

## Simulation A: Dial Variance Sufficiency

### Setup
- 50 songs in city list (20 artists, 15x3 songs + 5x1 songs).
- Song latent quality sampled and mapped into integer dial votes `-5..+5`.
- Tested listener density at `5`, `10`, `20` listeners per artist.
- 30 daily samples; measured score spread and top-10 stability.

### Results
| Listeners per Artist | Total Listeners | Mean Score Std Dev | Mean Unique Score Buckets (rounded 0.1) | Mean Top-10 Jaccard Day-to-Day |
|---|---:|---:|---:|---:|
| 5 | 100 | 1.494 | 33.5 | 0.711 |
| 10 | 200 | 1.464 | 33.1 | 0.769 |
| 20 | 400 | 1.467 | 33.4 | 0.823 |

### Conclusion
- The dial provides sufficient variance.
- `10 listeners per artist` materially improves ranking stability over `5`, while avoiding heavy over-smoothing.

## Simulation B: Capped List Scheduler (Punk 2:00 tracks)

### Scheduler profile tested
- Top 1-5: anchor every cycle.
- Rank 6-10: 4 slots/cycle (about every 1.25 cycles per song).
- Rank 11-20: 4 slots/cycle (about every 2.5 cycles per song).
- Extra top repeats: `30%` of cycle slots (to preserve radio-like hit repetition).
- Remaining slots go to rank 21-50 round-robin.

### Capacity math
| Cycle Length | Slots per Cycle (2:00 songs) | Top Repeat Slots | Rank 21-50 Slots | Expected Rank 21-50 Repeat |
|---|---:|---:|---:|---:|
| 60 min | 30 | 9 | 8 | every ~3.75 cycles |
| 75 min | 37 | 11 | 13 | every ~2.31 cycles |
| 90 min | 45 | 14 | 18 | every ~1.67 cycles |

### Target fit
- Requested target for rank `11-20` was every `2-3` cycles.
- The tested policy lands at `~2.5 cycles` (fits target).
- `75 min` is the best middle setting for dense city behavior:
  - keeps strong differentiation
  - keeps lower bands active enough
  - avoids over-flattening seen at 90 min

## Recommended Defaults (City Punk MVP)
1. Listener baseline for simulation and tuning: `10 listeners per artist`.
2. Dense city cycle cap default: `75 minutes`.
3. Keep state-tier hard bounds as discussed: `45 min minimum`, `120 min maximum`.
4. Maintain rank band policy:
   - `1-5` anchored each cycle
   - `6-10` near-cycle
   - `11-20` every 2-3 cycles
   - `21+` penalty-scaled with demotion/removal path

## Important Notes
- This study validates the mechanism shape, not final production constants.
- Bandsintown data here is a proxy for relative crowd pressure, not a complete census of fans.
- Next step should layer propagation eligibility gates (upvote + minimum unique local participation) separately from placement.

## Sources
- BLS OEWS Metro data (May 2023 special request workbook): https://www.bls.gov/oes/special.requests/oesm23ma.zip
- Austin live music official page (250+ venues): https://www.austintexas.org/austin-insider-blog/post/live-music-in-austin/
- Bandsintown Austin punk listings: https://www.bandsintown.com/c/austin-tx/all-dates/genre/punk
- Bandsintown Los Angeles punk listings: https://www.bandsintown.com/c/los-angeles-ca/all-dates/genre/punk

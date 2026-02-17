# Lateral Vote Mid-Entry Simulator (2026-02-16)

## Scope
- Added a standalone Fair Play simulator script with a new mode:
  - `lateral_vote_mid_entry`

## File
- `scripts/fair_play_rotation_sim.py`

## Mode Summary
- New tracks are inserted into a middle band of the neutral cycle (not front-loaded).
- Per-play lateral vote signal (`more`, `fine`, `less`) updates a smoothed cadence score.
- Cadence score maps to replay gap with hard floor/ceiling bounds.
- Optional artist cooldown prevents immediate same-artist reappearance.

## Existing Modes Preserved
- `hour_block`
- `interleaved`

## Key Parameters (lateral mode)
- `--score-lambda`
- `--score-k`
- `--min-gap-min`
- `--max-gap-min`
- `--artist-cooldown-min`
- `--new-mid-band-width`
- `--affinity-sigma`

## Sample Run
```bash
python3 scripts/fair_play_rotation_sim.py \
  --mode lateral_vote_mid_entry \
  --artists 40 --new-active 12 --mature-per-artist 3 \
  --avg-new-len-s 120 --avg-mature-len-s 150 \
  --sim-minutes 1440 --seed 7
```

## Notes
- This is a broadcast-schedule stress tool, not a recommender and not a governance model.
- Tier propagation, authority, and canon policy layers are intentionally out of scope.

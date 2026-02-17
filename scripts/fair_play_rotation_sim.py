#!/usr/bin/env python3
"""
Fair Play Rotation Simulator (UPRISE-style)

Goal: explore broadcast scheduling behavior under density.

This simulator is descriptive only:
- no recommendation/personalization
- no tier advancement simulation
- no governance/authority assignment

Modes:
- hour_block: new releases run at top-of-hour block, mature fills remainder
- interleaved: new releases injected at fixed cadence, mature fills gaps
- lateral_vote_mid_entry: new tracks start in middle of neutral cycle;
  listener votes shift cadence laterally (more/fine/less often), with safety bounds
"""

from __future__ import annotations

import argparse
import heapq
import math
import random
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple


@dataclass(frozen=True)
class Track:
    track_id: str
    artist_id: str
    duration_s: int
    is_new: bool


@dataclass
class SimResult:
    minutes_simulated: float
    new_airtime_s: int
    mature_airtime_s: int
    new_plays: Dict[str, int]
    mature_plays: Dict[str, int]
    new_repeat_gaps_s: List[int]
    mature_repeat_gaps_s: List[int]
    hour_overflow_count: int
    cycle_length_s_observed_max: int
    vote_more_count: int = 0
    vote_fine_count: int = 0
    vote_less_count: int = 0
    starved_track_count: int = 0
    max_track_air_share: float = 0.0


def clamp_int(x: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, x))


def clamp_float(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


def make_tracks(
    n_artists: int,
    n_new_active: int,
    mature_songs_per_artist: int,
    avg_new_len_s: int,
    avg_mature_len_s: int,
    seed: int,
) -> Tuple[List[Track], List[Track]]:
    """
    Create:
    - New set: up to 1 active new track per artist (n_new_active <= n_artists)
    - Mature set: mature_songs_per_artist per artist
    """
    rng = random.Random(seed)
    artists = [f"a{i + 1}" for i in range(n_artists)]

    new_artists = set(rng.sample(artists, k=min(n_new_active, n_artists)))

    new_tracks: List[Track] = []
    mature_tracks: List[Track] = []

    def jitter_duration(avg: int) -> int:
        d = int(rng.gauss(avg, avg * 0.15))
        return clamp_int(d, int(avg * 0.5), int(avg * 2.0))

    for artist_id in artists:
        for j in range(mature_songs_per_artist):
            mature_tracks.append(
                Track(
                    track_id=f"{artist_id}-m{j + 1}",
                    artist_id=artist_id,
                    duration_s=jitter_duration(avg_mature_len_s),
                    is_new=False,
                )
            )

        if artist_id in new_artists:
            new_tracks.append(
                Track(
                    track_id=f"{artist_id}-n1",
                    artist_id=artist_id,
                    duration_s=jitter_duration(avg_new_len_s),
                    is_new=True,
                )
            )

    return new_tracks, mature_tracks


def _record_play(
    tr: Track,
    start_s: int,
    plays_map: Dict[str, int],
    last_play_at: Dict[str, int],
    new_gaps: List[int],
    mature_gaps: List[int],
) -> None:
    if tr.track_id in last_play_at:
        gap = start_s - last_play_at[tr.track_id]
        if tr.is_new:
            new_gaps.append(gap)
        else:
            mature_gaps.append(gap)
    last_play_at[tr.track_id] = start_s
    plays_map[tr.track_id] = plays_map.get(tr.track_id, 0) + 1


def simulate_hour_block(
    new_tracks: List[Track],
    mature_tracks: List[Track],
    sim_minutes: int,
    base_hour_s: int,
    max_cycle_s: int,
    seed: int,
) -> SimResult:
    rng = random.Random(seed)
    t_end = sim_minutes * 60

    new_order = new_tracks[:]
    mature_order = mature_tracks[:]
    rng.shuffle(new_order)
    rng.shuffle(mature_order)

    mature_idx = 0

    new_plays: Dict[str, int] = {tr.track_id: 0 for tr in new_order}
    mature_plays: Dict[str, int] = {tr.track_id: 0 for tr in mature_order}

    last_play_at: Dict[str, int] = {}
    new_gaps: List[int] = []
    mature_gaps: List[int] = []

    new_air = 0
    mature_air = 0
    overflow = 0
    observed_cycle_max = 0

    now = 0
    while now < t_end:
        new_block = sum(tr.duration_s for tr in new_order)
        cycle_len = base_hour_s

        if new_block > cycle_len:
            cycle_len = min(max_cycle_s, new_block)

        observed_cycle_max = max(observed_cycle_max, cycle_len)
        if new_block > max_cycle_s:
            overflow += 1

        cycle_start = now
        cycle_end = min(now + cycle_len, t_end)

        cursor = cycle_start
        for tr in new_order:
            if cursor + tr.duration_s > cycle_end:
                break
            _record_play(tr, cursor, new_plays, last_play_at, new_gaps, mature_gaps)
            new_air += tr.duration_s
            cursor += tr.duration_s

        while cursor < cycle_end and mature_order:
            tr = mature_order[mature_idx % len(mature_order)]
            mature_idx += 1
            if cursor + tr.duration_s > cycle_end:
                break
            _record_play(tr, cursor, mature_plays, last_play_at, new_gaps, mature_gaps)
            mature_air += tr.duration_s
            cursor += tr.duration_s

        now += cycle_len

    return SimResult(
        minutes_simulated=sim_minutes,
        new_airtime_s=new_air,
        mature_airtime_s=mature_air,
        new_plays=new_plays,
        mature_plays=mature_plays,
        new_repeat_gaps_s=new_gaps,
        mature_repeat_gaps_s=mature_gaps,
        hour_overflow_count=overflow,
        cycle_length_s_observed_max=observed_cycle_max,
    )


def simulate_interleaved(
    new_tracks: List[Track],
    mature_tracks: List[Track],
    sim_minutes: int,
    max_cycle_s: int,
    seed: int,
    target_new_air_share: float,
) -> SimResult:
    rng = random.Random(seed)
    t_end = sim_minutes * 60

    new_order = new_tracks[:]
    mature_order = mature_tracks[:]
    rng.shuffle(new_order)
    rng.shuffle(mature_order)

    if not mature_order and not new_order:
        return SimResult(sim_minutes, 0, 0, {}, {}, [], [], 0, 0)

    new_plays: Dict[str, int] = {tr.track_id: 0 for tr in new_order}
    mature_plays: Dict[str, int] = {tr.track_id: 0 for tr in mature_order}

    last_play_at: Dict[str, int] = {}
    new_gaps: List[int] = []
    mature_gaps: List[int] = []

    new_air = 0
    mature_air = 0
    observed_cycle_max = 0

    new_idx = 0
    mature_idx = 0

    if not new_order:
        inject_every = None
    else:
        inject_every = max(1, int(round((1 - target_new_air_share) / max(1e-6, target_new_air_share))))

    now = 0
    while now < t_end:
        observed_cycle_max = max(observed_cycle_max, max_cycle_s)

        choose_new = False
        if inject_every is not None and mature_order:
            if mature_idx > 0 and (mature_idx % inject_every == 0):
                choose_new = True
        elif inject_every is not None and not mature_order:
            choose_new = True

        if choose_new and new_order:
            tr = new_order[new_idx % len(new_order)]
            new_idx += 1
            if now + tr.duration_s > t_end:
                break
            _record_play(tr, now, new_plays, last_play_at, new_gaps, mature_gaps)
            new_air += tr.duration_s
            now += tr.duration_s
        else:
            tr = mature_order[mature_idx % len(mature_order)]
            mature_idx += 1
            if now + tr.duration_s > t_end:
                break
            _record_play(tr, now, mature_plays, last_play_at, new_gaps, mature_gaps)
            mature_air += tr.duration_s
            now += tr.duration_s

    return SimResult(
        minutes_simulated=sim_minutes,
        new_airtime_s=new_air,
        mature_airtime_s=mature_air,
        new_plays=new_plays,
        mature_plays=mature_plays,
        new_repeat_gaps_s=new_gaps,
        mature_repeat_gaps_s=mature_gaps,
        hour_overflow_count=0,
        cycle_length_s_observed_max=observed_cycle_max,
    )


def simulate_lateral_vote_mid_entry(
    new_tracks: List[Track],
    mature_tracks: List[Track],
    sim_minutes: int,
    seed: int,
    score_lambda: float,
    score_k: float,
    min_gap_s: int,
    max_gap_s: int,
    artist_cooldown_s: int,
    new_mid_band_width: float,
    affinity_sigma: float,
) -> SimResult:
    """
    New model:
    - New tracks start in middle of neutral cycle (not front-loaded)
    - Per play, synthetic lateral vote signal adjusts cadence:
      more often (+1), fine (0), less often (-1)
    - Cadence is bounded by min/max replay gap and optional artist cooldown
    """
    rng = random.Random(seed)
    t_end = sim_minutes * 60

    all_tracks = mature_tracks + new_tracks
    if not all_tracks:
        return SimResult(sim_minutes, 0, 0, {}, {}, [], [], 0, 0)

    neutral_cycle_s = max(1, sum(t.duration_s for t in all_tracks))
    min_gap_s = clamp_int(min_gap_s, 30, max_gap_s)
    max_gap_s = max(min_gap_s, max_gap_s)

    new_plays: Dict[str, int] = {t.track_id: 0 for t in new_tracks}
    mature_plays: Dict[str, int] = {t.track_id: 0 for t in mature_tracks}
    last_play_at: Dict[str, int] = {}
    last_artist_play_at: Dict[str, int] = {}
    new_gaps: List[int] = []
    mature_gaps: List[int] = []

    track_score: Dict[str, float] = {t.track_id: 0.0 for t in all_tracks}
    track_affinity: Dict[str, float] = {
        t.track_id: clamp_float(rng.gauss(0.0, affinity_sigma), -1.0, 1.0) for t in all_tracks
    }
    track_air_s: Dict[str, int] = {t.track_id: 0 for t in all_tracks}

    vote_more = 0
    vote_fine = 0
    vote_less = 0

    mature_order = mature_tracks[:]
    rng.shuffle(mature_order)

    # Heap items: (due_time, tie_breaker, track)
    heap: List[Tuple[int, int, Track]] = []
    tie = 0

    # Mature tracks spread across neutral cycle.
    if mature_order:
        spacing = neutral_cycle_s / max(1, len(mature_order))
        for i, tr in enumerate(mature_order):
            heapq.heappush(heap, (int(i * spacing), tie, tr))
            tie += 1

    # New tracks inserted in middle band (not front).
    if new_tracks:
        center = neutral_cycle_s / 2.0
        band_w = clamp_float(new_mid_band_width, 0.05, 0.9) * neutral_cycle_s
        low = max(0.0, center - band_w / 2.0)
        high = min(float(neutral_cycle_s), center + band_w / 2.0)
        for tr in new_tracks:
            due = int(rng.uniform(low, high))
            heapq.heappush(heap, (due, tie, tr))
            tie += 1

    now = 0
    while heap and now < t_end:
        due_s, _, tr = heapq.heappop(heap)
        if due_s > now:
            now = due_s

        # Enforce artist cooldown across all tracks by same artist.
        last_artist = last_artist_play_at.get(tr.artist_id)
        if last_artist is not None and now < last_artist + artist_cooldown_s:
            postponed = last_artist + artist_cooldown_s
            heapq.heappush(heap, (postponed, tie, tr))
            tie += 1
            continue

        if now + tr.duration_s > t_end:
            break

        if tr.is_new:
            _record_play(tr, now, new_plays, last_play_at, new_gaps, mature_gaps)
        else:
            _record_play(tr, now, mature_plays, last_play_at, new_gaps, mature_gaps)

        track_air_s[tr.track_id] += tr.duration_s
        last_artist_play_at[tr.artist_id] = now

        # Synthetic lateral vote based on latent affinity.
        affinity = track_affinity[tr.track_id]
        p_more = clamp_float(0.33 + 0.22 * affinity, 0.05, 0.90)
        p_less = clamp_float(0.33 - 0.22 * affinity, 0.05, 0.90)
        if p_more + p_less > 0.95:
            scale = 0.95 / (p_more + p_less)
            p_more *= scale
            p_less *= scale
        p_fine = 1.0 - p_more - p_less

        r = rng.random()
        if r < p_more:
            vote_signal = 1.0
            vote_more += 1
        elif r < p_more + p_fine:
            vote_signal = 0.0
            vote_fine += 1
        else:
            vote_signal = -1.0
            vote_less += 1

        # Smoothed lateral cadence score (bounded).
        prev = track_score[tr.track_id]
        score = (1.0 - score_lambda) * prev + score_lambda * vote_signal
        score = clamp_float(score, -1.0, 1.0)
        track_score[tr.track_id] = score

        # Score -> replay gap mapping with clamp.
        raw_gap = neutral_cycle_s * math.exp(-score_k * score)
        next_gap = clamp_int(int(raw_gap), min_gap_s, max_gap_s)
        next_due = now + next_gap

        heapq.heappush(heap, (next_due, tie, tr))
        tie += 1
        now += tr.duration_s

    total_air = sum(track_air_s.values())
    max_share = (max(track_air_s.values()) / total_air) if total_air else 0.0
    starved = sum(1 for t in all_tracks if (new_plays.get(t.track_id, 0) + mature_plays.get(t.track_id, 0)) == 0)
    observed_gap = max(new_gaps + mature_gaps) if (new_gaps or mature_gaps) else 0

    return SimResult(
        minutes_simulated=sim_minutes,
        new_airtime_s=sum(track_air_s[t.track_id] for t in new_tracks),
        mature_airtime_s=sum(track_air_s[t.track_id] for t in mature_tracks),
        new_plays=new_plays,
        mature_plays=mature_plays,
        new_repeat_gaps_s=new_gaps,
        mature_repeat_gaps_s=mature_gaps,
        hour_overflow_count=0,
        cycle_length_s_observed_max=observed_gap,
        vote_more_count=vote_more,
        vote_fine_count=vote_fine,
        vote_less_count=vote_less,
        starved_track_count=starved,
        max_track_air_share=max_share,
    )


def summarize(result: SimResult) -> str:
    total_air = result.new_airtime_s + result.mature_airtime_s
    new_share = (result.new_airtime_s / total_air) if total_air else 0.0

    def stats(gaps: List[int]) -> Tuple[Optional[float], Optional[float], Optional[float]]:
        if not gaps:
            return None, None, None
        g = sorted(gaps)
        avg = sum(g) / len(g)
        p50 = g[len(g) // 2]
        p90 = g[int(len(g) * 0.9)]
        return avg, p50, p90

    def fmt(x: Optional[float]) -> str:
        if x is None:
            return "n/a"
        return f"{x / 60:.1f}m"

    new_avg, new_p50, new_p90 = stats(result.new_repeat_gaps_s)
    mat_avg, mat_p50, mat_p90 = stats(result.mature_repeat_gaps_s)

    lines = [
        f"Simulated: {result.minutes_simulated} min",
        f"Airtime: new={result.new_airtime_s/60:.1f}m mature={result.mature_airtime_s/60:.1f}m (new share={new_share*100:.1f}%)",
        f"New repeat gap (avg/p50/p90): {fmt(new_avg)} / {fmt(new_p50)} / {fmt(new_p90)}",
        f"Mature repeat gap (avg/p50/p90): {fmt(mat_avg)} / {fmt(mat_p50)} / {fmt(mat_p90)}",
        f"Hour overflow count (hour_block only): {result.hour_overflow_count}",
        f"Observed max cycle length: {result.cycle_length_s_observed_max/60:.1f}m",
    ]

    vote_total = result.vote_more_count + result.vote_fine_count + result.vote_less_count
    if vote_total > 0:
        lines.extend(
            [
                f"Lateral votes: more={result.vote_more_count} fine={result.vote_fine_count} less={result.vote_less_count}",
                f"Starved tracks (0 plays): {result.starved_track_count}",
                f"Max single-track airtime share: {result.max_track_air_share*100:.2f}%",
            ]
        )

    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--mode",
        choices=["hour_block", "interleaved", "lateral_vote_mid_entry"],
        default="hour_block",
    )
    ap.add_argument("--artists", type=int, required=True)
    ap.add_argument(
        "--new-active",
        type=int,
        default=None,
        help="Active new releases (<= artists). Default: artists (hour_block) or 20% (other modes).",
    )
    ap.add_argument("--mature-per-artist", type=int, default=3)
    ap.add_argument("--avg-new-len-s", type=int, default=120)
    ap.add_argument("--avg-mature-len-s", type=int, default=150)
    ap.add_argument("--sim-minutes", type=int, default=24 * 60)
    ap.add_argument("--base-hour-s", type=int, default=60 * 60)
    ap.add_argument("--max-cycle-min", type=int, default=120)
    ap.add_argument("--target-new-share", type=float, default=0.20)
    ap.add_argument("--seed", type=int, default=7)

    # Lateral vote mode parameters
    ap.add_argument("--score-lambda", type=float, default=0.25, help="Smoothing factor for vote signal -> cadence score.")
    ap.add_argument("--score-k", type=float, default=0.60, help="Sensitivity of cadence gap to score.")
    ap.add_argument("--min-gap-min", type=int, default=20, help="Minimum replay gap in minutes.")
    ap.add_argument("--max-gap-min", type=int, default=240, help="Maximum replay gap in minutes.")
    ap.add_argument("--artist-cooldown-min", type=int, default=20, help="Minimum minutes before same artist can reappear.")
    ap.add_argument(
        "--new-mid-band-width",
        type=float,
        default=0.25,
        help="Fraction of neutral cycle reserved as middle insertion band for new tracks.",
    )
    ap.add_argument(
        "--affinity-sigma",
        type=float,
        default=0.35,
        help="Stddev of latent track affinity controlling synthetic vote tendencies.",
    )

    args = ap.parse_args()

    max_cycle_s = args.max_cycle_min * 60

    if args.new_active is None:
        if args.mode == "hour_block":
            n_new_active = args.artists
        else:
            n_new_active = max(1, int(round(args.artists * 0.2)))
    else:
        n_new_active = args.new_active

    new_tracks, mature_tracks = make_tracks(
        n_artists=args.artists,
        n_new_active=n_new_active,
        mature_songs_per_artist=args.mature_per_artist,
        avg_new_len_s=args.avg_new_len_s,
        avg_mature_len_s=args.avg_mature_len_s,
        seed=args.seed,
    )

    if args.mode == "hour_block":
        res = simulate_hour_block(
            new_tracks=new_tracks,
            mature_tracks=mature_tracks,
            sim_minutes=args.sim_minutes,
            base_hour_s=args.base_hour_s,
            max_cycle_s=max_cycle_s,
            seed=args.seed,
        )
    elif args.mode == "interleaved":
        res = simulate_interleaved(
            new_tracks=new_tracks,
            mature_tracks=mature_tracks,
            sim_minutes=args.sim_minutes,
            max_cycle_s=max_cycle_s,
            seed=args.seed,
            target_new_air_share=args.target_new_share,
        )
    else:
        res = simulate_lateral_vote_mid_entry(
            new_tracks=new_tracks,
            mature_tracks=mature_tracks,
            sim_minutes=args.sim_minutes,
            seed=args.seed,
            score_lambda=clamp_float(args.score_lambda, 0.01, 1.0),
            score_k=clamp_float(args.score_k, 0.05, 2.0),
            min_gap_s=args.min_gap_min * 60,
            max_gap_s=args.max_gap_min * 60,
            artist_cooldown_s=max(0, args.artist_cooldown_min * 60),
            new_mid_band_width=clamp_float(args.new_mid_band_width, 0.05, 0.9),
            affinity_sigma=clamp_float(args.affinity_sigma, 0.01, 1.0),
        )

    print(summarize(res))


if __name__ == "__main__":
    main()

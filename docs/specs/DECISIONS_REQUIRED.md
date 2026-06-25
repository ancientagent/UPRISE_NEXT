# Decisions Required (Canon‑Blocked Items)

This file tracks canon‑blocked items marked as WORKING / UNDECIDED / Founder Lock Needed in `docs/canon/`.  
Do not implement these items until they are locked.

## 1) Scene & Broadcast Thresholds
- **Sect Uprise activation threshold**: when artists in the Sect sign a motion totaling **45 minutes of playtime**, the Sect Uprise becomes available.
- **City-tier community split/activation threshold**: define the numeric/evidence requirements for registered local artists/sources, committed catalog, and source activity that justify splitting a new active city-tier Home Scene from an existing major-node/music-capital community. Listener demand or onboarding counts alone must not activate a music community.
- **Community activation/cutover workflow**: define the Registrar/source workflow for creating the new active city-tier `Community`, assigning source entities, routing future uploads, and messaging listeners whose submitted/GPS city differs from their assigned major-node Home Scene.
- **City → State propagation threshold**
- **State → National propagation threshold**

## 2) Fair Play Two-Pool Locks
- **Main Rotation recurrence mapping** (discrete frequency tiers vs weighted scheduler implementation)
- **Practical floor/removal policy** for persistently low-recurrence songs
- **Propagation threshold formula** (minimum unique listeners + rate + optional confidence bound)
- **Graduation cap per run** (`GRADUATION_CAP_PER_RUN`)

## 3) Activity Points
- **Scoring table**
- **Decay / seasonality rules**

## 4) Moderation & Compliance
- **Report threshold for auto‑flag**
- **Appeal / dispute response timeline**

## 5) Pricing & Monetization
- **Discovery Pass pricing finalization**
- **Play Pass pricing finalization**
- **Promotional slot mechanics (hard boundary from Fair Play)**

## 6) Founder Locks
- Any section marked **WORKING**, **UNDECIDED**, or **Founder Lock Needed** in `docs/canon/`

## 7) Scene Map & Statistics
- **Aggregation window(s)** for Scene metrics (for example rolling 7-day / 30-day / all-time)
- **Geo aggregation granularity + privacy floor** (minimum cohort size before map bucket display)
- **Tier rollup policy** for City -> State -> National map/statistics continuity
- **Top 40 tie-break policy** when songs have equal standing within the same scope

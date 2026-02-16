# Decisions Required (Canon‑Blocked Items)

This file tracks canon‑blocked items marked as WORKING / UNDECIDED / Founder Lock Needed in `docs/canon/`.  
Do not implement these items until they are locked.

## 1) Scene & Broadcast Thresholds
- **Sect Uprise activation threshold**: when artists in the Sect sign a motion totaling **45 minutes of playtime**, the Sect Uprise becomes available.
- **City → State propagation threshold**
- **State → National propagation threshold**

## 2) Fair Play Timing & Rotation
- **Initial release window duration**
- **Re‑evaluation cadence**
- **Backlog ordering policy**
- **Mid‑rotation removal cooldown**

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

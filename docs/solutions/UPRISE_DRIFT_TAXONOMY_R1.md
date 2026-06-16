# UPRISE Drift Taxonomy R1

**Status:** `active`
**Owner:** `founder + codex`
**Last Updated:** `2026-04-05`

## Purpose
Track recurring model failures so they can be rejected, corrected, and prevented from reappearing across tools and sessions.

## Classification Rules
Each drift case should record:
- what the model proposed
- which invariant or contract it violated
- why it is wrong for UPRISE
- the correction direction

## Category A — Persistent Player Drift
### A1. Player removed or hidden
- Failure: proposes screens or flows that ignore the persistent player.
- Violates: persistent player governing-system rule.
- Correction: player context must be accounted for on every surface.

### A2. Player treated as decorative
- Failure: treats the player as visual chrome instead of a governing context source.
- Correction: make search, travel, and adjacent surface logic inherit player context.

### A3. Discover detached from player context
- Failure: creates a separate Discover scope/search system unrelated to the active listening context.
- Correction: Discover inherits current player/listening scope.

## Category B — Community Identity Drift
### B1. City-only collapse
- Failure: identifies communities by city only.
- Violates: `city + state + music community` identity rule.
- Correction: preserve the full tuple.

### B2. Genre-only collapse
- Failure: treats community identity as genre/community label only.
- Correction: preserve place + music-community identity together.

### B3. Generic global browsing
- Failure: ignores local-first context and defaults to worldwide search/discovery.
- Correction: keep scope bounded by current player tier/context and active scene logic.

## Category C — Plot Drift
### C1. Plot treated as Home
- Failure: describes Plot as the home dashboard.
- Correction: Plot is the structural tabbed participation system.

### C2. Unapproved tabs
- Failure: invents `Social`, `Messages`, or other new MVP Plot tabs.
- Correction: current MVP tabs are `Feed`, `Events`, `Promotions`, `Statistics`.

## Category D — Discover Drift
### D1. Separate travel search system
- Failure: creates a second travel search unrelated to player/travel control.
- Correction: Travel is attached to the bottom of the player.

### D2. Map detached from player
- Failure: treats map as a separate exploration tool with unrelated scope.
- Correction: map expands downward from the player and follows the same scope.

### D3. Scope fragmentation
- Failure: gives Search, Popular Signals, Active Participants, and Map different scope models.
- Correction: all Discover subareas share the same current Discover/player scope.

### D4. Track-by-track tier drift
- Failure: changes Discover scope based on whatever individual song is currently playing.
- Correction: listening scope is stable until the user changes it.

## Category E — Support Drift
### E1. Support hidden in profile detail
- Failure: support is logged but not visible.
- Correction: support must be legible across identity and surface interactions.

### E2. Support reduced to vanity decoration
- Failure: identity/customization overwhelms support visibility.
- Correction: identity is functional; support visibility is core.

### E3. Dress-up simulator drift
- Failure: avatar system becomes a fashion/customization toy.
- Correction: optimize for recognizability + visible support, not wardrobe complexity.

## Category F — Metrics Drift
### F1. Metrics become authority
- Failure: participation metrics grant moderation, voting, or governance power.
- Correction: metrics are descriptive only.

### F2. Metrics become recommendation authority
- Failure: activity scores silently become ranking or recommendation engines.
- Correction: do not convert descriptive metrics into algorithmic authority.

### F3. Gamified leaderboard drift
- Failure: scene contribution becomes XP/levels/power status.
- Correction: keep metrics socially legible but non-governing.

## Category G — Platform Trope Drift
### G1. Streaming-clone drift
- Failure: imports Spotify-like global browsing, charts, or taste logic.
- Correction: UPRISE is infrastructure, not a passive streaming clone.

### G2. Social-network drift
- Failure: imports Instagram/TikTok/Facebook feed, creator, or follower logic.
- Correction: reject generic vanity and engagement loops.

### G3. Creator-platform drift
- Failure: reframes artist/community surfaces around creator self-promotion defaults.
- Correction: keep artist support and local scene participation central.

## Category H — Process Drift
### H1. Mode collapse
- Failure: Discussion mode starts building; Plan mode starts redesigning product truth.
- Correction: enforce mode boundaries.

### H2. Unscoped prompt expansion
- Failure: model adds adjacent surfaces/features when asked for one surface only.
- Correction: one scoped change at a time.

### H3. False certainty
- Failure: model declares unsettled policy or founder decisions as locked truth.
- Correction: escalate unsettled areas as founder decisions rather than freezing them.

## How To Use This Taxonomy
When reviewing output:
1. tag the drift category
2. cite the violated invariant or contract
3. reject or revise the output
4. write a correction prompt using the tagged failure

## References
- `docs/solutions/UPRISE_AUTOHARNESS_R1.md`
- `docs/solutions/SOFTWARE_SYSTEMS_GUARDRAILS_R1.md`
- `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md`

--- Page 1 ---

UPRISE — Application Surfaces, Capabilities &
Lifecycle (Working)
Status: CANONICAL (Working Revision)
Purpose This document defines the operational surfaces, capabilities, and lifecycle constraints of UPRISE. It
answers questions of what exists, what actions are possible where, and how long things persist,
without prescribing UI layout or implementation details.
Derivation Rule This document is strictly derived from: - Master Narrative Canon - Master Glossary Canon -
Identity & Philosophy Canon - How UPRISE Works — Canon
No new mechanics may be introduced here. Where decisions are not yet locked, sections will be explicitly
marked UNDECIDED (Founder Lock Needed).
1. Application Surfaces (Non‑UI)
Surfaces describe capability boundaries, not screens or layouts.
1.1 Listener Surface (RaDIYo / Plot)
Clarification (Canonical): Listeners technically tune into Uprise tiers — Citywide, Statewide, and National
— via the RaDIYo broadcast layer.
Everything else is a mode of finding an Uprise, not a different listening mechanism.
• Tuning refers to listening within a selected Uprise tier (City / State / National).
• Seeking refers to swiping through random City or State Uprises (a nod to traditional radio seek/scan
behavior).
• Visiting refers to navigating to a specific Scene via map or search, then listening to that Scene’s
Uprise.
All three modes resolve to the same underlying behavior:
the listener is always tuning into an Uprise broadcast carried by the RaDIYo Broadcast
Network.
These distinctions exist for mental and navigational clarity only; they do not represent different system
logic.
Clarification (Canonical): Listeners do not tune into abstract Scenes. Listeners tune into Uprises — the
broadcast stations of Scenes — via the RaDIYo layer.
1

--- Page 2 ---

Exists to: - Tune into broadcast (RaDIYo) - Traverse rotation - Perform listener actions (ADD, BLAST, UPVOTE
where eligible, SKIP) - View Scene activity and Signals
Explicitly does not allow: - Song selection - Reordering - Artist management - Any form of visibility control
1.2 Artist Management Surface (Web App)
Exists to: - Manage artist identity (post‑Registrar) - Upload and manage songs occupying active slots - View
descriptive engagement data - Create and manage Events (if Promoter‑registered)
Explicitly does not allow: - Voting - Rotation control - Fair Play promotion/boosting
Note: Paid promotional distribution (boost-style reach) is handled in Promotions surfaces via Print Shop
Runs, not by Artist Management rotation controls.
1.3 Registrar Surface
Exists to: - Register Artist identities - Register Promoter identities - Register Projects
Constraints: - Accessible only within the Home Scene - No implicit elevation or automatic registration
2. Song Lifecycle & Slot Constraints
2.1 Entry
• Songs enter the system only via Artist upload into a Citywide Uprise.
• All songs receive an initial Fair Play exposure window.
2.2 Active Slot Definition
Active Slot (working definition): A song occupying an Artist’s limited capacity that is eligible for rotation in
the Citywide broadcast.
Limited Capacity (concise): An artist may have only a finite number of songs occupying the Rotation Stack
at the same time, so no single artist can flood the broadcast.
Release Deck (Clarification): - Artists may maintain a small release deck representing songs they wish to
bring into broadcast circulation. - During early beta, music upload capacity is up to 3 songs. - The Release
Deck interface may also contain a separate paid ad-attachment slot without increasing song capacity. -
Capacity of the release deck may expand or contract over time, but broadcast exposure remains constrained
by slot pressure and pacing rules.
EARLY BETA LOCK (Canonical): - During early beta, each artist may maintain a release deck of up to 3
songs for music upload capacity. - A separate paid ad-attachment slot may exist in the same Release Deck
interface without changing that music cap. - At any given time, only 1 song per artist may be treated as a “new release” within the Release
Cycle.
2

--- Page 3 ---

Post-Beta (Future Policy): - Release deck size and per-artist new-release limits may be revisited after
observing real Scene density and behavior.
2.3 Radio‑Hour Pacing & Density (Two-Pool V1)
UPRISE Fair Play pacing is modeled as two pools, not one flat stack:
• New Releases Pool (time-protected)
• Main Rotation Pool (engagement-recurrence)
Hard rhythm guardrails:
• State/National cycle targets remain between 45 minutes minimum and 120 minutes maximum.
• Main Rotation repeat cap: no song more than once per hour.
2.3.1 New Window by Density
Density driver is ActiveNewCount only (songs currently in New Releases):
• <=10 active new songs -> 10-day window
• 11-25 active new songs -> 7-day window
• >25 active new songs -> 5-day window
Stability (hysteresis):
• New density band must hold for 3 consecutive days before global target changes.
Per-song assignment:
• A song locks new_window_days at entry and keeps that value until graduation.
2.3.2 Artist-Level Constraint
• An artist may maintain limited active slots.
• Only one song per artist may occupy the New Releases Pool at a time.
This prevents single-artist flooding while preserving fair exposure.
2.4 Mid‑Rotation Removal
Known Constraints: - Removal must not retroactively penalize engagement. - Removal must not affect
other songs’ Fair Play behavior.
Founder Clarification (Data Semantics): - Engagement data is primarily artist‑facing and used as
feedback. - Per‑song engagement statistics may persist on the artist profile as catalogue data (e.g., for
scouting or historical reference). - Scene‑level systems do not retain granular engagement history beyond
aggregate historical records (e.g., all‑time top rotations).
Founder Proposal (Policy Direction): - Artists may remove a song mid‑rotation. - To preserve balance
across the Rotation Stack, re‑adding a removed song should be subject to a cooldown period.
UNDECIDED (Founder Lock Needed): - Length and conditions of the cooldown before re‑adding a removed
song. - Whether cooldown applies per song, per artist, or per Scene.
2.5 Pressure Relief via Sects & Local Uprises
Founder Clarification (Structural): In highly dense Scenes, pressure on broadcast inventory is relieved
through:
• Sects — unified stylistic sub‑communities that can establish their own Uprises.
• Local Uprises — parallel outputs that reduce contention in one dense Scene.
3. Fair Play Timing & Windows
3.1 Two-Pool Timing Rules
• Songs enter New Releases on upload.
• Songs remain in New Releases for assigned new_window_days.
• After expiry they graduate into Main Rotation automatically.
• Main Rotation recurrence weights recompute daily.
• Recurrence and propagation remain strictly separated (engagement vs upvotes).

4. Activity Points Resolution
Purpose: Activity Points are a user‑level gamification system that reinforces healthy participation and
scene pride. They are not a song metric and do not affect broadcast behavior.
Earned Through (Examples): - BLASTs that lead to downstream ADDs or other positive engagement - Event
attendance or verified participation - Meaningful contributions to Projects or community efforts
Constraints (Locked): - Awarded to users, not songs - Do not affect Fair Play rotation, tier progression, or
visibility - Do not confer authority or legitimacy
Visibility: - Primarily artist‑facing (feedback) and scene‑level aggregates (pride/health) - Not used for
ranking or optimization
UNDECIDED (Founder Lock Needed): - Decay vs cumulative behavior - Seasonality (if any)
5. Enforcement & Moderation Boundaries
Purpose: Protect signal integrity and community safety without governing culture or taste.
Scope (Locked): - Enforcement affects access, not Fair Play outcomes - No retroactive impact on
engagement or tiering
Examples: - Temporary access restriction for abuse or manipulation - Removal of weaponized content
UNDECIDED (Founder Lock Needed): - Temporary vs permanent restrictions - Appeal flow - Report
thresholds
End of Working Document
5

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
Release Deck (Clarification): - Artists may maintain a small release deck (e.g., up to 3 songs during early
beta) representing songs they wish to bring into broadcast circulation. - Capacity of the release deck may
expand or contract over time, but broadcast exposure remains constrained by slot pressure and pacing
rules.
EARLY BETA LOCK (Canonical): - During early beta, each artist may maintain a release deck of up to 3
songs. - At any given time, only 1 song per artist may be treated as a “new release” within the Release
Cycle.
2

--- Page 3 ---

Post-Beta (Future Policy): - Release deck size and per-artist new-release limits may be revisited after
observing real Scene density and behavior.
2.3 Radio‑Hour Pacing & Density
Founder Clarification (Conceptual): UPRISE broadcast pacing is modeled after the traditional radio hour,
with the purpose of informing listeners about what new music is available.
Sweet‑Spot Constraint (Conceptual): - The effective broadcast cycle should be long enough to sustain
familiarity but short enough to remain fresh. - Target range: approximately 45 minutes (minimum) to 2.5
hours (maximum) for a complete rotation cycle.
New‑Music Allocation Rule (Conceptual): - At any moment, newly introduced songs should occupy only a
percentage of the Rotation Stack. - This ensures new music repeats predictably while older songs continue
to circulate beyond the introduction window.
Artist‑Level Constraint (Conceptual): - Even if an artist has multiple songs in their release deck, only one
song may be treated as a “new release” at a time within the Release Cycle. - This prevents a constant
stream of brand‑new songs from a single artist dominating the hourly introduction block.
Density‑Based Behavior: - Higher Scene density → longer rotation cycle and slower introduction pacing. -
Lower Scene density → shorter cycle and faster introduction pacing.
This ensures: - New music reliably gets a shot. - Songs listeners actively want can sustain beyond the intro
period. - Skipping and intentional seeking become the mechanisms that credit genuine interest. - No artist
can monopolize broadcast attention through output alone.
2.3.1 Backlog (Overflow) of New Songs
Founder Proposal (Policy Direction): When new releases exceed the Release Cycle’s capacity, the Scene
may maintain a backlog (overflow queue) of songs awaiting entry into the Release Cycle.
Intent: - Prevent flooding the hourly / multi-hour introduction block. - Preserve fairness of initial exposure. -
Ensure new songs still receive a guaranteed shot, just paced.
Release Date Semantics (Clarification): - Backlog entries introduce an explicit release date concept at the
broadcast level. - Artists may prepare and promote in advance, knowing when a song is scheduled to enter
the Release Cycle. - The release date reflects scheduled broadcast entry, not upload time.
UNDECIDED (Founder Lock Needed): - Backlog ordering rule (e.g., first-in/first-out, registrar timestamp,
scheduled date) - Whether artists can schedule a release date or only accept the next available slot -
Whether backlog visibility is artist-only or also visible to listeners - Maximum backlog size and overflow
behavior - Whether artists can withdraw a queued song without penalty
3

--- Page 4 ---

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
Founder Clarification (Structural): In highly dense Scenes, pressure on the Rotation Stack is relieved
structurally through:
• Sects — more unified stylistic sub‑communities within a Scene that can establish their own Uprises.
• Local Uprises — parallel broadcast outputs that reduce contention within a single high‑density
rotation.
This allows: - Music to offload into more coherent contexts. - Dense communities to scale without flooding a
single broadcast. - Discovery to remain meaningful even as participation increases.
3. Fair Play Timing & Windows
3.1 Initial Exposure Window
Known: - All songs receive standardized initial exposure - No engagement weighting during this window
Founder Proposal (Policy Direction): - All songs are locked into the initial visibility cycle (also referred to
as a Release Cycle) once they enter. - Artists cannot bypass or reset this cycle via removal and re‑add.
UNDECIDED (Founder Lock Needed): - Fixed duration vs dynamic (Scene density‑based) - Engagement
accumulation timing (during vs after window)
Related Term (Glossary Candidate): - Release Cycle — the initial, mandatory visibility period during which
a newly uploaded song receives standardized exposure before engagement‑weighted rotation applies.
4

--- Page 5 ---

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

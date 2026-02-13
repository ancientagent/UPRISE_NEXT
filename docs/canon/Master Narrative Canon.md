--- Page 1 ---

[CANON ALIGNMENT IN PROGRESS]
This document is an internally aligned, drift-hardened version of the UPRISE Master Narrative. Meaning,
mechanics, and prohibitions are preserved. Language has been unified, ambiguities removed, and
redundant causal descriptions eliminated.
CHANGE STATUS: Pass 1 (Terminology Lock) + Pass 2 (Structural Guarantees) COMPLETE.
1. Location & Scene Structure
1.1 Scene Definition
Scene A Scene is the geographic container in which a Music Community exists and operates.
Formally: - Scene = Geographic Location + Music Community
Scenes exist at three tiers: - Citywide (e.g., Austin Hip-Hop) - Statewide (e.g., Texas Hip-Hop) - Nationwide
(e.g., American Hip-Hop)
Each Scene is uniquely identified by a system key: city-state-music-community
Structural Constraint - Only Citywide Scenes contain user infrastructure. - Statewide and Nationwide
Scenes are aggregate-only constructs. - Aggregate Scenes pull statistics and top-performing songs from
constituent Citywide Scenes. - No direct onboarding, voting, or civic actions occur at aggregate tiers.
1.2 Uprises
Uprise An Uprise is the broadcast station operated by a Music Community within a Scene.
Rules: - Every Scene operates exactly one Uprise per broadcast tier. - Uprises are the sole entry point into
the RaDIYo Broadcast Network.
Citywide Uprise - All music enters the system through Citywide Uprises. - Artists submit singles via their
Play Deck. - Songs enter Fair Play rotation automatically.
Statewide Uprise - Rotation consists of songs that earned sufficient Citywide support across the state. - No
direct submission.
Nationwide Uprise - Rotation consists of songs that earned sufficient Statewide support. - Voting is
disabled at this tier. - No new promotion or advancement occurs beyond this point.
1

--- Page 2 ---

1.3 Home Scene
The Home Scene is the user's civic anchor within the platform.
Rules: - Each user selects exactly one Home Scene during onboarding. - Voting privileges exist only within
the Home Scene. - GPS verification within the Scene's state is required for voting.
Users may: - Visit other Scenes (Discovery Pass required) - Listen, Add, Follow, and Blast outside their Home
Scene
Users may not: - Vote - Initiate civic actions - Influence Fair Play outside their Home Scene
1.4 Taxonomy of Power (Enforced Hierarchy)
1. Scene — Geographic container
2. Uprise — Broadcast station of the Scene
3. Community — People participating within the Scene
4. The Plot — Home Scene interface
5. RaDIYo — Broadcast transport and receiver
Power flows downward only. No layer may bypass or override the layer above it.
1.5 Parent Scenes
Parent Scenes are preloaded, established music communities available at launch.
Characteristics: - No activation threshold to enter - Threshold required to establish a Sect Uprise - Serve as
containers for all sub-communities
1.6 Sects (Sub-Communities)
Sect A Sect is a sub-community within a Scene defined by shared taste tags.
Rules: - Sects are not Scenes at creation. - Sects do not have independent broadcast authority until they
Uprise. - Taste tags assign affiliation only; they do not route broadcasts.
1.7 Sect Uprising
A Sect may Uprise into its own broadcast within a parent Scene when: - A minimum artist music threshold is
met - Artists explicitly support the motion
Once Uprising occurs: - Songs migrate from parent rotation to Sect rotation - Fair Play rules apply identically
2

--- Page 3 ---

2. RaDIYo Broadcast Network
2.1 Definition
RaDIYo is the listener-governed broadcast transport layer of UPRISE.
Rules: - RaDIYo distributes music via continuous broadcast, not playlists. - Broadcast content is determined
exclusively by Fair Play outcomes. - RaDIYo does not select, recommend, rank, or personalize content.
RaDIYo exists solely to transport the output of Scene governance.
2.2 RaDIYo Player
The RaDIYo Player is the user-facing receiver for the broadcast network.
Constraints: - The Player is always tuned to a Scene broadcast. - Users cannot select specific songs within
Fair Play. - Playback is continuous unless explicitly paused, skipped, or interrupted by a tier change.
Tier Change Behavior - If a user attempts to change tiers while a song is playing, the system prompts: -
Interrupting playback before completion may reduce the song's engagement score. - If the user confirms,
the song is interrupted immediately. - Early interruption is treated as low interest and is valid engagement
input.
2.3 Discovery via Broadcast Navigation
Discovery occurs only through explicit user action: - Tier toggling - Scene switching via swipe - Manual Scene
selection in Discover
Discovery is never initiated by the system.
3. Signals & Actions
3.1 Signal Definition
A Signal is the atomic unit of intentional action on UPRISE.
Rules: - Signals are created or propagated by users. - Signals are never ranked, scored, or surfaced
algorithmically. - Signals carry meaning only through explicit action.
Examples: - Songs - Fliers - Projects - Uprises (when referenced)
3

--- Page 4 ---

3.2 Universal Actions
ADD — Save to personal collection (no broadcast effect) FOLLOW — Subscribe to awareness only BLAST —
Public propagation to Home Scene feed SUPPORT — Material or civic backing (Proof-of-Support)
None of these actions influence Fair Play rotation.
4. Fair Play System
4.0 Rotation & Engagement (Narrative Canon)
Each Scene maintains a single, shared rotation. All listeners encounter the same music in the same order.
• Listeners traverse the rotation independently.
• Traversal speed does not alter the structure of the broadcast.
New songs enter the rotation on a fixed schedule and receive standardized exposure during an introductory
period.
Fair Play guarantees opportunity for exposure, not outcomes. Listeners are never required to complete a
song.
Engagement in UPRISE is additive-only. Songs gain standing only through demonstrated listener
engagement. No listener action subtracts from a song’s standing.
Skipping a song does not function as a penalty or negative signal. A skipped song receives no engagement
contribution for that encounter.
Rotation order evolves gradually through accumulated collective engagement. Songs rise relative to others
through presence and support, not through suppression or rejection.
To preserve fairness, individual listener influence on engagement totals is rate-limited over time. No single
listener can disproportionately affect rotation order through speed, repetition, or traversal behavior.
UPRISE does not personalize, predict, or optimize listener taste. The system records engagement only when
it occurs and does not infer meaning from its absence.
Standing within the rotation reflects sustained, collective attention from the community.
4.1 Definition
Fair Play is the rotation system governing all broadcasts.
4

--- Page 5 ---

Rules: - Every song receives equal initial exposure. - No song receives preferential placement. - Rotation
frequency is recalculated based on community response.
4.1.1 Engagement Score Foundation
Engagement Score is the primary quantitative input to Fair Play rotation weighting.
Engagement Score is composed of Playback Weight and Contextual Support Modifiers.
A. Playback Weight (Primary)
Playback behavior establishes the baseline signal of listener interest.
Base allocation per play: - Full song completion: 3 points - Partial listen (majority played): 2 points -
Partial listen (minority played): 1 point (requires ≥ 1/3 of song duration played) - Skip / early
interruption: 0 points
Playback Weight is always applied.
B. Contextual Support Modifiers (Secondary)
Contextual actions may apply small, bounded modifiers to differentiate songs that receive explicit community
support beyond passive listening.
These modifiers exist to prevent score compression and to legitimize relative position within the rotation
stack.
Modifiers: - ADD: +0.5 points - BLAST: +0.25 points
Rules: - Modifiers apply once per user per song per tier. - Modifiers are capped to prevent action-spam
amplification. - Modifiers affect rotation frequency only, never tier progression. - FOLLOW actions apply
no engagement modifier.
C. Prohibited Modifiers
The following must never affect Engagement Score: - Follows - Profile views - External shares - Personal Play
activity - Repeated actions by the same user
D. Structural Safeguards
• Playback Weight always outweighs modifier influence.
5

--- Page 6 ---

• No song can advance tiers without upvotes.
• No combination of modifiers can overcome consistent skips.
4.2 Voting Constraints
• Voting is permitted only:
• Within the user's Home Scene
• While the song is actively playing
• By GPS-verified users
• Voting is disabled at the National tier.
Votes: - Are single-use per song per tier - Cannot be changed after playback ends
4.3 Prohibitions
Fair Play must never: - Predict taste - Optimize virality - Assign legitimacy - Accelerate recognition
5. Users, Roles & Affiliation
5.1 User (Listener)
A User is a listener and civic participant within a Scene.
Rules: - Users participate through listening, voting (when locally affiliated), and signal actions. - Users do not
upload music directly to Fair Play. - Users may be linked to one or more Artist/Band entities.
Users are the only actors with voting power.
5.2 Artist / Band Entity
An Artist/Band is a registered music entity operated by one or more Users.
Rules: - Artist/Band entities upload music via the Web App. - Songs uploaded by an Artist/Band enter Fair
Play through the Citywide Uprise. - An Artist/Band has no voting power.
Account linkage: - One User may manage multiple Artist/Band entities. - Multiple Users may manage a
single Artist/Band entity.
6

--- Page 7 ---

5.3 Local Affiliation States
Users exist in exactly one of the following affiliation states relative to any Scene:
Locally Affiliated - User has selected the Scene as their Home Scene. - GPS verification within the Scene’s
state is complete. - User may vote and initiate civic actions within that Scene.
Visitor - User is listening in a Scene that is not their Home Scene. - User has read-only permissions.
Visitors may: - Listen - ADD - FOLLOW - BLAST
Visitors may not: - Vote - Initiate civic actions - Influence Fair Play within that Scene
5.4 Civic Authority Boundaries
• Voting authority is restricted to Locally Affiliated Users.
• Artist/Band entities never possess civic authority.
• Scene governance cannot be influenced from outside the Scene.
These boundaries are absolute and non-configurable.
6. The Plot (Home Scene Interface)
6.1 Definition
The Plot is the primary civic interface of a user's Home Scene.
It is not a feed in the traditional sense. It is the shared surface where community activity, governance
signals, and scene-level information are made visible.
Users do not browse the Plot; they inhabit it.
6.2 Scope & Boundaries
The Plot exists only within a user's Home Scene.
Rules: - The Plot reflects only activity originating from, or explicitly carried into, the Home Scene. - No cross-
scene content is injected automatically. - The Plot does not personalize ordering or visibility.
The Plot is governed by Scene rules, not individual preference.
7

--- Page 8 ---

6.3 Plot Surfaces
The Plot is composed of multiple fixed surfaces:
Activity Feed (S.E.E.D Feed) - Displays Signals explicitly Blasted into the Scene - Displays new releases entering Fair Play -
Displays civic updates (registrations, motions, milestones) - Contains the Statistics View and Scene Map
Events - Displays events created within the Scene - Shows upcoming shows, gatherings, and verified activity
Promotions - Displays offers and promotions explicitly carried into the Scene - No automatic promotion or
targeting
Social (V2) - Scene message boards and listening rooms - The only location for public discussion
6.4 Activity Feed Rules
The Activity Feed (S.E.E.D Feed) is not ranked, scored, or optimized. S.E.E.D stands for Support, Explore, Engage, Distribute.
Rules: - Content appears only through explicit user action (Blast, registration, release) - No algorithmic
ordering or recommendation - No engagement-based surfacing
Statistics and the Scene Map are descriptive only. They visualize community activity and structure but do
not confer authority or influence visibility.
Visibility in the Activity Feed is a result of community action, not system inference.
6.5 Civic Separation
The Plot enforces strict separation between: - Civic Signals (votes, registrations, motions) - Awareness
Signals (blasts, follows) - Informational Displays (statistics, listings)
No surface may reinterpret one category as another.
7. The Registrar (Civic Activation)
7.1 Definition
The Registrar is the civic activation surface of a Scene.
It is located within the Activity Feed (S.E.E.D Feed) of the Home Scene and functions as the formal gateway for
registering entities, roles, and motions.
8

--- Page 9 ---

The Registrar is not a browsing surface. It is an intentional, action-based interface.
7.2 Purpose
The Registrar exists to: - Formalize participation - Distinguish casual activity from civic action - Prevent
implicit or accidental authority
Nothing becomes structurally real on the platform without passing through the Registrar.
7.3 Registrar Scope
The Registrar is accessible only within a user's Home Scene.
Rules: - All registrations are Scene-bound - No cross-Scene registration is permitted - Visitor users cannot
access the Registrar
7.4 Registrable Actions (V1)
The following actions require Registrar submission:
Artist / Band Registration - Creates a new Artist/Band entity - Grants access to the Web App for music
management
Promoter Registration - Grants permission to create Events
Project Registration - Formalizes a community initiative or motion - Enables Follow, Blast, and Support
actions
7.5 Authority Constraints
• Registration does not grant voting power
• Registration does not affect Fair Play
• Registration does not imply endorsement
Registrar actions create structure, not visibility.
7.6 Design Constraint
The Registrar must always require deliberate user intent.
• No auto-registration
9

--- Page 10 ---

• No passive creation
• No background conversion of activity into authority
8. Events & Proof-of-Support
8.1 Definition
Events are time-bound, place-bound gatherings created by Artists, Promoters, or Venues within a Scene.
They function as the primary bridge between broadcast participation and real-world presence.
Events exist to record showing up, not just interest.
8.2 Location & Surface
The Events surface exists within The Plot of the Home Scene.
Rules: - Events are Scene-bound. - Events appear only in the Scene where they are registered. - Events do
not propagate automatically across Scenes.
The Print Shop is located within the Events surface and is inseparable from event participation.
8.3 Event Creation
Event creation requires Promoter or Artist registration via the Registrar.
Rules: - Events must specify location, date, and hosting entity. - Events cannot be created by Visitors. -
Events do not affect Fair Play rotation.
8.4 Proof-of-Support
Proof-of-Support is the system used to verify real-world participation.
Rules: - Proof-of-Support is earned through verified attendance or material support. - Verification occurs via
QR codes or location confirmation at the Event. - Proof-of-Support may grant Activity Points.
Proof-of-Support is non-transferable and non-replicable.
10

--- Page 11 ---

8.5 The Print Shop
The Print Shop is the issuance surface for physical-digital artifacts tied to Events.
It exists only within the Events surface.
Rules: - Print Shop items are created in association with a specific Event. - Items represent attendance,
support, or participation. - Items do not affect Fair Play or broadcast rotation.
Examples: - Event posters - Limited-run flyers - Patches, passes, or memorabilia
8.6 Economic Constraint
The Print Shop does not function as a marketplace.
Rules: - No speculative resale mechanics. - No algorithmic promotion of items. - No extraction of value from
participation.
The Print Shop records support; it does not monetize attention.
9. Signals vs Entities (Authority Separation)
9.1 Core Distinction
UPRISE enforces a hard separation between Signals and Entities.
• Signals are things that move.
• Entities are actors that exist.
No Signal is an authority. No Entity gains authority through Signal accumulation.
9.2 Signals
Signals are discrete units of intentional action or expression that may propagate through a Scene.
Examples of Signals: - Songs - Events - Projects - Fliers - Proof-of-Support artifacts
Rules: - Signals may be ADDed, BLASTed, or SUPPORTED. - Signals do not carry inherent rank, score, or
legitimacy. - Signal propagation is always the result of explicit user action.
11

--- Page 12 ---

9.3 Entities
Entities are registered actors within the system.
Examples of Entities: - Users - Artists / Bands - Promoters - Venues - Businesses
Rules: - Entities may be FOLLOWed for awareness. - Entities do not propagate themselves. - Entity visibility
does not grant authority.
9.4 Prohibited Conflations
The system must never: - Treat follower count as legitimacy - Treat engagement metrics as authority -
Convert Signal reach into governance power - Allow popularity to override Scene rules
9.5 Downstream Constraints
All current and future features must respect this separation.
This includes: - Analytics dashboards - Social features - Discovery tooling - V2 collaborative systems
If a feature causes Entity power to emerge from Signal accumulation, it violates canon.
10. Promotions & Businesses (Non-Extractive Commerce)
10.1 Definition
Promotions are explicit offers or announcements made by Businesses, Venues, or Artists within a Scene.
They exist to support local economic circulation, not to compete for attention.
Promotions are Signals, not authorities.
10.2 Location & Visibility
Promotions appear only within the Promotions surface of the Plot.
Rules: - Promotions are Scene-bound. - Promotions never appear in the Activity Feed by default. -
Promotions propagate only through explicit user action (ADD, BLAST, or SUPPORT).
There is no automatic targeting or optimization.
12

--- Page 13 ---

10.3 Business & Venue Entities
Businesses and Venues are registered Entities.
Rules: - They may publish Promotions after registration. - They may be FOLLOWed for awareness. - They
possess no civic authority and no influence over Fair Play.
10.4 Economic Constraint
UPRISE does not sell attention.
Rules: - No pay-for-placement. - No bidding systems. - No algorithmic amplification. - No conversion of
spending into visibility or authority.
Promotions may inform; they may not manipulate.
11. Activity Points (Participation Recognition)
11.1 Definition
Activity Points are a non-monetary recognition system that records meaningful participation within a Scene.
They reward doing, not popularity.
Activity Points accumulate at two levels: - Individual Activity Points reflect a user’s personal participation. -
Scene Activity Score is the aggregate sum of all Activity Points earned by members of the Scene.
The Scene Activity Score represents how active a Scene is over time.
Scenes may treat their Activity Score as a point of pride and friendly competition.
However: - The Scene Activity Score confers no authority. - It does not influence Fair Play, visibility, or
governance. - It cannot be used for algorithmic ranking, promotion, or advantage.
Competition may exist socially; it must never exist structurally.
The Scene Activity Score also serves as a signal of creative density.
High or rising Activity Scores may indicate: - Sustained community participation - Prolific artistic output -
Periods of heightened creative emergence
This signal is observational only. It may suggest potential cultural hotbeds, but it never triggers system
behavior, promotion, or preferential treatment.
13

--- Page 14 ---

11.2 How Activity Points Are Earned
Activity Points may be earned through: - Verified Event attendance (Proof-of-Support) - Supporting Projects -
Blasting Signals that result in downstream engagement - Early participation in Scene formation or growth
Exact point values are configurable but must remain bounded.
11.3 What Activity Points Are NOT
Activity Points must never: - Influence Fair Play - Influence Signal visibility - Grant civic authority - Convert
into economic power
11.4 Purpose Constraint
Activity Points exist to: - Acknowledge labor - Encourage participation - Surface community contributors
(informationally only)
They may never become a ranking, status, or governance system.
12. V2 Feature Containment Rules
All V2 features must comply with the following constraints:
• No feature may introduce personalization or prediction.
• No feature may infer meaning from absence of engagement.
• No feature may convert Signals into authority.
• No feature may bypass the Registrar or Fair Play.
V2 features are additive only. They may extend participation, not redefine governance.
13. Data, Privacy & Auditability
13.1 Data Minimization
UPRISE collects only the data required to operate the broadcast, governance, and participation systems
defined in this document.
Rules: - No collection for speculative personalization or prediction. - No secondary use of data beyond
stated system functions. - No sale or transfer of user data for advertising purposes.
14

--- Page 15 ---

13.2 Transparency & Auditability
All governance-impacting systems must be auditable.
Rules: - Fair Play inputs and constraints must be inspectable. - Voting rules and limits must be verifiable. -
Rate limits and safeguards must be documented.
Auditability exists to preserve trust, not to optimize behavior.
14. Non-Goals (Explicit Exclusions)
The following are explicitly not goals of UPRISE:
• Maximizing time-on-platform
• Accelerating virality or growth at any cost
• Predicting user taste or behavior
• Creating influencer hierarchies
• Replacing local scenes with global abstraction
If a proposal advances any of the above, it is out of scope.
15. Spec Readiness & Derivation Constraints
This document is a governing source, not an implementation spec.
All downstream specifications must: - Derive permissions, data models, and flows from these rules -
Preserve prohibitions exactly as written - Avoid adding causal explanations where structure already
guarantees outcomes
When conflicts arise: - Canon wins over convenience - Structure wins over optimization - Locality wins over
scale
16. Canon Change Control
Changes to this document require deliberate review.
Rules: - No silent edits - No reinterpretation through implementation - All amendments must state the
affected sections and rationale
This document defines what UPRISE is. All other documents must conform to it.
[CANON ALIGNMENT COMPLETE]
15

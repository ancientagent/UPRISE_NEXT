# UPRISE Platform Narrative — Canonical Document

**Status:** CANONICAL  
**Purpose:** Comprehensive platform specification — conceptual foundation for all technical development  
**Last Updated:** February 2026 (v2 — Full Rewrite)

---

## 1. Location & Scene Structure

### 1.1 Scene Definition
- A Scene = Geographic location + Music Community
- Scenes exist at every tier: City, State, National
- Examples:
  - City: "Austin Hip-Hop"
  - State: "Texas Hip-Hop"
  - National: "American Hip-Hop"
- System key example: `austin-texas-hip-hop` (State included for disambiguation)

### 1.2 Geographic Tiers
- Citywide: Local community broadcast
- Statewide: Songs that earned citywide support
- Nationwide: Songs that resonated at state level

### 1.3 Home Scene
- User's primary Scene based on location + chosen music community
- Onboarding message: "Welcome to [City] [Music Community]"
- Where user has voting rights (requires GPS verification within state)
- Users can visit any Scene via Discover, but only vote in Home Scene

### 1.4 Taxonomy of Power (Enforced Hierarchy)
1. **Scene:** The environment/container. Scenes exist at City, State, and National levels.
2. **Uprise:** The broadcast signal inside a Scene (e.g., "The Austin Hip-Hop Uprise").
3. **Community:** The people operating within the Scene.
4. **The Plot:** The interface where they interact — the digital habitation and tactical center of the Home Scene.
5. **RaDIYo:** The receiver/transport system that tunes the Uprise.

The Community inhabits the Scene and launches the Uprise. The Uprise expresses the Scene, but it is not the Scene itself. RaDIYo receives and transports the Uprise signal across tiers.

### 1.5 Parent Scenes (Launch-Ready)
- Pre-loaded in the system: established genres with scenes worldwide (Punk, Metal, Hip-Hop, Electronic, Rock, Country, Folk, Blues, etc.)
- Open to users from day one — no activation threshold required
- Early adopters are the recruiters who build the Scene
- Pre-populated using external data (Bandsintown event density) to identify hotspot cities

### 1.6 Child Genres (Microgenre Taxonomy)
- Known microgenres pre-loaded and mapped to parent genres (e.g., Drill → Hip-Hop, Shoegaze → Rock, Synthwave → Electronic)
- NOT their own Scenes at launch
- When a user enters a child genre during onboarding:
  1. System recognizes it as a child of a parent genre
  2. Routes user to nearest parent Scene in their city
  3. Informs user they can tag themselves with their genre using the tag system
  4. Encourages user to find others and unite as a Sect

### 1.7 Sect Activation (Uprising)
A Sect can Uprise into its own broadcast within the Scene when it reaches:
- 6 bands/artists tagged with the same taste tag
- OR 45 minutes of audio content from tagged artists
- Whichever comes first

**Activation Celebration:**
1. Immediate notification to all Sect members
2. Announcement in parent Scene
3. Celebration animation in app
4. Fair Play system initiates for the Sect broadcast
5. Songs from committed artists migrate from parent rotation into Sect rotation

### 1.8 Geographic Uprising (New Scene Creation)
- Users outside the nearest parent Scene's area are routed to it initially
- As users from the same city/region accumulate, they can mobilize to Uprise their own Scene
- Same activation threshold applies: 6 bands/artists OR 45 minutes of audio
- Once activated, their city becomes a new Scene on the map
- New users in that area are now routed to their local Scene instead of the nearest one

---

## 2. RaDIYo & The Broadcast Network

### 2.1 The Uprise Signal
- Each Scene launches an "Uprise" — its broadcast signal
- Example: "The Austin Hip-Hop Uprise" is the broadcast signal of the Austin Hip-Hop Scene
- The Community inhabits the Scene and launches the Uprise
- The Uprise expresses the Scene, but it is not the Scene itself
- All Home Scenes contribute their top singles to form statewide and nationwide broadcasts

### 2.2 The RaDIYo Broadcast Network
- The listener-governed broadcast layer within the UPRISE platform
- Returns music distribution and social cohesion to local communities
- Each Scene has its own broadcast — what plays is determined by community action through Fair Play
- Music travels from city to state to national broadcasts based on real local support
- "RaDIYo" = Radio + DIY

### 2.3 The RaDIYo Player (Interface)
- The user-facing receiver that tunes the Uprise signal
- It is a receiver — not a playlist
- Plays the broadcast of whichever Scene the user is currently in
- Functions as BOTH a music player AND the primary navigation system for moving between Scene levels
- Users aren't passively consuming music — they are actively exploring and participating in Scene cultural centers

### 2.4 Player Controls
- Tier Toggle: Switch between City → State → National
- Swipe RIGHT: Jump to random state (same music community) + opens Discover
- Swipe LEFT: Jump to random city in current state (same music community) + opens Discover
- Action Wheel: Upvote, Add, Blast, Skip, Report

**Note:** Swiping is a way to jump into discovery without having to think about what you are looking for — an exciting, seamless way to discover new music all across the country.

### 2.5 Complete Community Immersion
When users toggle between broadcast tiers via RaDIYo, they are transported to completely different Scene experiences. ALL Plot tabs update to reflect the tier:

**Citywide Tier:**
- Player: Fresh uploads from local artists
- Feed: Updates from citywide Scene members, local achievements
- Events: Local shows in user's city (Locality + Subscription only)
- Promotions: Local business advertisements
- Statistics: Metrics for city's music Scene
- Social (V2): Local Scene discussions

**Statewide Tier:**
- Player: State-level tracks (songs that earned citywide support)
- Feed: Activity and trends across the entire state's Scene network
- Events: Notable shows and festivals throughout the state
- Promotions: Regional businesses and larger venues
- Statistics: State-level metrics and comparative data
- Social (V2): Regional discussions and collaborations

**Nationwide Tier:**
- Player: Top-tier music (songs that resonated at state level)
- Feed: National music community trends and breakout artists
- Events: Major festivals and landmark events
- Promotions: Industry brands and nationwide services
- Statistics: Music community benchmarks and national trends
- Social (V2): Music community-wide discussions and industry topics

### 2.6 Playback Behavior
- Continuous: RaDIYo never stops unless user explicitly pauses
- Seamless transitions between songs — no dead air
- Background play continuation
- Cross-Tier Continuity: When toggling tiers, the current song completes before transitioning. Votes remain available until the song ends.

### 2.7 Persistent Interface
- Always present (fixed directly above navigation bar)
- Available across both The Plot and Discover sections
- Single interface for both music and navigation — reduced cognitive load

---

## 3. App Structure & Navigation

### 3.1 Screen Layout (Bottom to Top)
- **Navigation Bar** (fixed at bottom): Three buttons — Home (left), Search (center, raised above the other two), Discover (right)
- **RaDIYo Player**: Fixed directly above the navigation bar, always visible, persistent across all screens
- **Main Content Area**: Fills the rest of the screen — displays The Plot or Discover depending on active section

### 3.2 Navigation Bar (Bottom)
Three buttons, left to right:
- **Home** (The Plot): User's Scene — Feed, Events, Promotions, Statistics, Social
- **Search**: Look up music, artists, and Scenes
- **Discover**: Explore other Scenes (requires Discovery Pass for non-Home Scenes)

### 3.3 Two Main Sections
- **The Plot**: Community habitation — where users S.E.E.D.
- **Discover**: Exploration — visit other Scenes across the country

### 3.4 RaDIYo Player Position
- Fixed ABOVE the navigation bar
- Visible on every screen regardless of section
- Never hidden — music and navigation are always accessible

---

## 4. Discover Section

### 4.1 Access
- Bottom right nav bar
- Swiping RaDIYo player (lands in Discover, tuned to new Scene)

### 4.2 Search Bar
- Drop down to reveal Map View
- Search for specific Scenes (city/state)

### 4.3 Map View
- Geographic interface with Scene flags
- Flags sized by population, colored by genre, saturated by activity
- Tap a Scene flag to visit

### 4.4 Artist Suggestions
- Based on what's popular in the community user is listening to
- Community-driven, not algorithmic prediction

### 4.5 Navigation via RaDIYo
- Swipe right: random state (same music community)
- Swipe left: random city in current state (same music community)
- Opens Discover, already tuned to new Scene

### 4.6 Access Requirement
- Requires Discovery Pass ($5.99/mo) to visit Scenes outside user's Home Scene
- Home Scene always accessible (all tiers)

---

## 5. Signals & Universal Actions

### 5.1 What is a Signal?
- A Signal is the atomic unit of all interaction on UPRISE
- A discrete unit of meaning that can be carried, echoed, or ignored by a community
- Signals are things that are created or promoted — not the entities that create them

### 5.2 Signal Types
- Core Signals: Songs, Fliers, Uprises
- Discourse Signals: Posts, Threads (situated conversations inside a Scene)
- Economic Signals: Deals/Promotions (Offers)
- Intent Signals: Projects (motions for collective action)
- Materialized Signals: Wearables (patches/shirts), Printed Artifacts (posters)
- Verification Signals: Proof-of-Support confirmations (attendance, donations, merch purchases)

Note: Fliers are viewable on events but can only be obtained through attendance/Proof-of-Support.

### 5.3 Followable Entities (Not Signals)
- Artists
- Businesses
- Events
- Promoters
- Following creates a channel in your Feed for their activity/updates

### 5.4 Universal Signal Actions
- ADD: Save any signal to your personal Collection
- FOLLOW: Subscribe to an entity for ongoing awareness (creates Feed channel)
- BLAST: Publicly amplify a signal to your community Feed
- SUPPORT: Express solidarity or material backing for a Project or Artist

### 5.5 Collections
- Personal collection of signals you've Added
- Can contain: Songs, Uprises, Projects, etc.
- On-demand access to saved signals
- Adding an Uprise creates a quick-access shortcut to that Scene
- Metrics from Collections ("Personal Play") do NOT affect Fair Play rotation

### 5.6 Signal Constraint
- The platform does not interpret, score, rank, or recommend Signals
- All signal propagation is driven by explicit user action (Add, Blast, Follow, Support)
- No algorithmic surfacing, no engagement-based boosting, no personalized signal delivery
- The system DOES track all signal activity for Statistics (Scene metrics, Activity Scores, artist analytics) — tracking is not the same as influencing

---

## 6. The Plot (Digital Habitation)

### 6.1 Definition
- The community's digital habitation and engagement center of the Scene
- Where users S.E.E.D. — Support, Explore, Engage, Distribute
- Users don't "browse" The Plot — they inhabit and cultivate it
- One of two main sections in the mobile app (the other being Discover)

### 6.2 Structure (5 Tabs)

**FEED (default)**
- Live updates: Blasts, new releases, member updates, tour news
- Community Resonance Display: Content surfaced by Scene activity
- Contains: The Registrar (civic actions)

**EVENTS**
- Shows all events for artists within the Scene
- Scene's calendar displays all upcoming events
- Fliers are featured on the event

**PROMOTIONS**
- Local business Offers (coupons, specials, deals)
- Off-platform event promotions
- Appear on the Promotions tab wall within the Scene
- Contains: The Print Shop

**STATISTICS**
- Activity Score: Sum of all community members' individual activity points
- Points earned by: upvoting, blasting, attending events, supporting projects, and more
- Scene health metrics, member counts
- Valuable for artists planning tours
- Statistics will track EVERYTHING — specifics TBD during development

**SOCIAL (V2)**
- Message boards — the ONLY place for public communication within the Scene
- Listening Rooms

### 6.3 Tier Immersion
The Plot is not a static interface. All tabs update dynamically based on the tier the user is tuned to via RaDIYo. When a user toggles tiers, they are transported to a completely different Scene experience:

**Citywide Tier:**
- Feed: Updates from citywide Scene members, local achievements
- Events: Local shows in user's city (Locality + Subscription only)
- Promotions: Local business advertisements
- Statistics: Metrics for city's music Scene
- Social (V2): Local Scene discussions

**Statewide Tier:**
- Feed: Activity and trends across the entire state's Scene network
- Events: Notable shows and festivals throughout the state
- Promotions: Regional businesses and larger venues
- Statistics: State-level metrics and comparative data
- Social (V2): Regional discussions and collaborations

**Nationwide Tier:**
- Feed: National music community trends and breakout artists
- Events: Major festivals and landmark events
- Promotions: Industry brands and nationwide services
- Statistics: Music community benchmarks and national trends
- Social (V2): Music community-wide discussions and industry topics

### 6.4 Community Resonance Display (Feed Logic)
Community Resonance Display is how content surfaces in the Feed. It is driven entirely by Scene Activity — not by algorithms, personalization, or user behavior modeling.

**What drives the Feed:**
- High Blast counts within the Home Scene (what the community is actively sharing)
- Recent Upvotes in the Home Scene (community validation through voting)
- Songs and artists that have demonstrated actual community validation through Scene actions

**What the Feed is NOT:**
- NOT based on user engagement history
- NOT based on listening patterns
- NOT based on personalization
- NOT based on user behavior modeling
- NOT based on predictive algorithms
- NOT algorithmic recommendations

All users in the same Scene see the same Scene Activity-based content. No personalization.

---

## 7. Users & Accounts

### 7.1 User Account (Mobile)
- The person — a Listener and community member
- Has profile
- Active participant: listens, votes, blasts, explores
- Uses mobile app to S.E.E.D. the community

### 7.2 Artist/Band Account (WebApp)
- The stage name or band — an entity, not a user
- Has profile
- Uploads music, creates Fliers, manages presence
- Operates on the WebApp
- Registered via The Registrar → completed on WebApp
- One User can link to multiple Artist/Band accounts
- Multiple Users can link to one Artist/Band account (band members)
- Can upload unlimited songs to library
- Only songs placed in rotation slots enter Fair Play
- Unslotted songs don't participate in economic activity
- Standard Artist: 1 rotation slot (free)
- Premium Artist (Play Pass): 3 rotation slots ($9.99/mo)

### 7.3 Key Distinction
- Users and Artists both have profiles
- Users participate IN the community
- Artists/Bands are what the community engages WITH

### 7.4 Citizen vs Observer (User status)
- Observer: Affiliated with Scene — can Listen, Blast, Add, Follow
- Citizen: GPS verified — can also Vote

### 7.5 Business Roles
- **Promoter (V1):**
  - Register at Registrar → complete on WebApp
  - Can add promotion company name during registration
  - Can create events, upload fliers at Print Shop, receive QR codes for verification
  - Can be followed
- **Merchant (V2):** Local business ads, coupons, specials
- **Venue (V2):** Promote venue, list events, connect with artists

### 7.6 Other Capabilities (V2)
- Mixologist: Create and sell Mixes (+$4/mo add-on)
- Ambassador: Tour guide services for visiting artists

### 7.7 Business Role Permissions

**Promoter (V1):**
- Can: Create events, upload fliers to Print Shop, receive QR codes, be followed, message followers (one-way)
- Cannot: Post in Promotions tab (that's Merchants), manage venue listings

**Merchant (V2):**
- Can: Post offers/coupons/deals in Promotions tab, be followed, message followers (one-way)
- Cannot: Create events, upload fliers to Print Shop

**Venue (V2):**
- Can: List venue, connect with artists, host events on their venue listing, be followed, message followers (one-way)
- Cannot: Post business promotions (that's Merchants), create standalone events without venue association

---

## 8. Fair Play System

### 8.1 Definition
- The algorithm that ensures equal opportunity for all songs entering rotation
- NOT popularity-based — no song gets preferential treatment
- Every song gets the same initial exposure to determine community response

### 8.2 How It Works
- New songs enter rotation through the artist's release deck
- All new releases play on the hour for approximately one week (equal exposure)
- After one week, engagement score is calculated based on metrics (upvotes, skips, blasts, etc.)
- Song finds its place in the rotation stack based on engagement score
- Higher engagement = more frequent rotation
- Re-evaluated each cycle to stay current with community sentiment

**[ARCHITECTURAL CONSTRAINT: TWO-PHASE INGESTION]**

To ensure equal opportunity, the system uses a strict Two-Phase Ingestion Queue for all Active songs:

- **Phase 1 (Time-Based Rotation):** Upon becoming ACTIVE, a song enters a guaranteed rotation window (e.g., ~1 week). During this phase, exposure is calculated strictly by time, ignoring engagement metrics. This ensures the system gathers accurate data before judgment.

- **Phase 2 (Engagement-Based Rotation):** Only after Phase 1 completes does the song move to probability-based rotation, where frequency is weighted by the engagement metrics (Upvotes, Skips, Blasts) gathered during Phase 1.

### 8.3 Tier Progression
- Citywide: Fresh local uploads, all artists start here
- Statewide: Songs that earned citywide support
- Nationwide: Songs that resonated at state level

### 8.4 Key Rules
- Upvotes determine tier progression
- Metrics from Personal Play (Collections) do NOT affect Fair Play
- Voting enabled only for Citizens in Home Scene
- Voting disabled at National tier

### 8.5 Personal Play vs Fair Play
These are two completely separate systems with total data isolation:

**Fair Play (Primary):**
- The community-driven broadcast system
- Automated rotation — no user control over song selection
- All engagement metrics tracked and weighted
- Songs cannot be repeated on demand
- GPS-verified voting impacts rotation

**Personal Play (Secondary):**
- On-demand access to user's ADDed Collection
- Manual selection, repeat, shuffle available
- No impact on Fair Play metrics whatsoever
- No voting capabilities in this mode
- Play counts do NOT affect song priority
- Private listening statistics only

These systems never cross-contaminate. Separate analytics, separate database tables, independent calculation engines.

### 8.6 Vote Casting Process
1. Votes can only be cast while the song is currently playing
2. User presses UPRISE logo button to reveal Action Wheel
3. Visual feedback confirms vote registered
4. Cancellation window available before song ends
5. Once song playback completes, vote is final
6. One-time lock: once cast for a song in a tier, cannot be changed

### 8.7 National Tier Rules

**Hard Constraint: Voting is DISABLED at the National Tier.**

The National Tier is a Scene (atmosphere) that aggregates signals from local Scenes, but it is NOT a Voting Jurisdiction.

**What the National Tier IS:**
- An aggregation point where top singles from all Home Scenes converge
- The highest achievement level for a song
- A discovery point for music that has demonstrated broad community resonance
- Every song on the national broadcast earned its spot city-by-city, state-by-state through real community action

**What the National Tier IS NOT:**
- NOT a Voting Jurisdiction
- NOT a place where new promotion happens
- NOT a shortcut to recognition
- Does NOT assign legitimacy or cultural value
- Does NOT manufacture consensus

**Available Actions at National:**
- ADD songs to personal collection
- BLAST songs to share with Home Scene community
- FOLLOW artists
- Listen

**Disabled Actions at National:**
- Voting (completely disabled — no tier above National)

### 8.8 Anti-Manipulation Measures

**GPS Verification:**
- Real-time location check during vote
- Historical location pattern analysis
- Velocity checks (impossible travel detection)
- VPN/proxy detection
- Multiple device tracking

**Behavioral Analysis:**
- Voting pattern monitoring
- Unusual activity flagging
- Bulk voting detection
- Cross-reference with engagement patterns

**Community Protection:**
- Report suspicious voting
- Automatic suspension for detected manipulation
- Vote audit trails
- Reversal capability for fraudulent votes

### 8.9 Phase 1 Duration
- Initial evaluation period: approximately one week [TUNABLE]

### 8.10 Upvote Rules
- Upvotes determine tier progression (City → State → National)
- Users can upvote as many songs as they want
- Each song can only be upvoted once per tier (if it progresses, can upvote again at next tier)
- Can only upvote while the song is currently playing
- Upvoting enabled only for Citizens in Home Scene
- Upvoting disabled at National tier

### 8.11 Engagement Metrics
- Upvote: Positive weight (determines tier progression)
- Blast: Positive weight
- Skip: Heaviest negative weight
- Other metrics factor into rotation frequency within tier

### 8.12 Skip
- Skips the song so user doesn't hear it
- Space filled with silence or business commercial until next song plays
- Heaviest negative weight on engagement score

### 8.13 Report
- Sends a message to admin
- Can be used for any number of reasons

---

## 9. Events & Fliers

### 9.1 Event Creation
- Promoters create events on WebApp (register at Registrar first)
- Artists/Bands can create events for their own shows
- Band members can create events on behalf of their band
- Listeners must register as a Promoter to create events

Required Fields:
- Event title
- Venue (select existing or create new)
- Date and time (with timezone)
- Event type (concert, open mic, festival, etc.)
- Ticket price (free option available)

Optional Fields:
- Event description (500 characters)
- Event flyer/image upload
- Ticket purchase link
- Age restrictions, capacity limits
- Co-performers, sponsor information

### 9.2 Event Distribution
Events appear based on:
- Locality: Event is in user's Scene
- Subscription: User follows the Artist or Promoter creating the event
- Community action: BLASTed by other users

### 9.3 Events Tab (in The Plot)
- Calendar view at the top showing all upcoming events in the Scene
- List of events below the calendar
- Users can browse both views

### 9.4 Event Page
- Event details (date, time, venue, etc.)
- Links to Promoter profile
- Links to performing bands/artists profiles
- Follow button on the event (similar to Facebook "like")
- Following an event adds it to user's personal calendar

### 9.5 User Actions on Events
- FOLLOW the event (adds to personal calendar, receives updates in Activity Feed)
- Tap Promoter link → visit Promoter profile → can Follow
- Tap Band/Artist link → visit their profile, hear their music → can Follow
- Share externally
- BLAST to amplify in community Feed

### 9.6 User Calendar
- Located alongside Collections (user's personal space)
- Followed artist events auto-add to user's calendar
- Google Calendar sync available
- Apple Calendar and Outlook sync planned

### 9.7 Fliers (Memory Tokens)
- Earned by attending the event
- Verified through Proof-of-Support (ticket receipt or location)
- User receives activity points for attendance
- Tradeable (?)

### 9.8 Event Distribution Rules

**Events appear based on:**
- Locality: Event is in user's Scene
- Subscription: User follows the Artist or Promoter creating the event
- Community action: BLASTed by other users

**What Event Distribution IS:**
- Infrastructure that connects events to relevant local audiences
- Locality-based and subscription-based delivery only

**What Event Distribution IS NOT:**
- NOT algorithmically recommended
- NOT predicted based on user behavior
- NOT surfaced based on "events you might like"
- NOT boosted by engagement metrics
- NO AI-driven suggestions

---

## 10. Promotions & The Print Shop

### 10.1 Promotions Tab (in The Plot)
- Local business Offers (coupons, specials, deals)
- Off-platform event promotions (mainstream acts coming through)
- Contains: The Print Shop

### 10.2 Business Promotions
- Businesses offer promotions, coupons, deals
- Appear on the Promotions tab wall within the Scene

### 10.3 The Print Shop (Issuance Infrastructure)

The Print Shop acts as an infrastructure surface, not a store. It sells Issuance Capacity (the right to mint), not physical goods.

- **The "No Inventory" Rule:** The database tracks rights and records (e.g., "User X has the right to mint 100 Patches"), never stock levels, shipping logistics, or SKUs.

- **Fulfillment:** Physical fulfillment is the sole responsibility of the issuer off-platform. The system's role is strictly to mint the digital record of the transaction.

**Promoters:**
- Upload flier image → receive QR code printout for event verification

**Artists/Bands:**
- Purchase runs of patches, shirts, pins, posters, stickers
- Receive QR code linked to each item type
- Place QR codes strategically:
  - Merch table: Scan to receive digital shirt when buying physical shirt
  - Donation bucket: Scan to receive digital patch when donating
  - Etc.
- Fans scan → receive the minted digital item

### 10.4 Donation & Reciprocity Logic (Proof-of-Support)

To support the circular economy without handling payments, the system uses Proof-of-Support.

1. **Action:** A user donates to an artist off-platform (via Venmo, CashApp) or purchases merch/tickets external to UPRISE.

2. **Verification:** The user submits the receipt or proof to UPRISE (or via API integration).

3. **Trigger:** Verification triggers the minting of a Materialized Signal (Patch/Poster) and awards Activity Points.

### 10.5 The Run Model
- Transacting in Print Shop buys a "Run" (finite issuance allocation)
- Example: Patch Run: 100 units for $10
- Example: Short Poster Run: 20 units for first 20 ticket buyers
- Once exhausted, the Run is closed — cannot be restocked

### 10.6 Minting (Internal, Zero-Cost)
- Minting occurs on UPRISE database, NOT blockchain
- Zero marginal cost to mint
- Fees charged only for purchasing the Run
- Scarcity enforced by Run limit, not gas fees

### 10.7 Materialized Signals

**Promotional Items:**
- Patches, shirts, pins, posters, stickers
- Limited minted digital assets
- Fans can add to collection, trade, admire

**Attendance Artifacts:**
- Non-repeatable signals minted after verified events
- Memory Tokens (e.g., "I was at Austin Punk Show, 2025")
- Records presence

All materialized signals are tradeable (for now).

### 10.8 Business Subscription Tiers

**Basic Tier:**
- Local communities only (citywide Scenes)
- Limited posts per month
- Basic analytics

**Premium Tier:**
- Local + statewide Scene access
- Increased post limits
- Enhanced analytics, scheduling

**Enterprise Tier:**
- Local + statewide + national Scene access
- Unlimited community access
- Priority placement, advanced reporting

All tiers: 4-hour minimum cooldown between posts.

### 10.9 Offer Propagation Rules
- Offers (coupons, deals) do NOT appear in a feed automatically
- Offers only propagate when a user explicitly Carries (ADDs) or Redeems them
- Business-Artist affiliations (e.g., artist wears a business wearable) must be explicit and visible
- Affiliations do NOT affect Fair Play rotation, discovery, or ranking

---

## 11. Statistics Tab (in The Plot)

### 11.1 Scene Statistics
- Activity Score: Sum of all community members' individual activity points
- Scene health metrics, member counts
- Valuable for artists planning tours
- Statistics will track EVERYTHING — specifics TBD during development

### 11.2 Activity Points
- Users earn points through participation (upvoting, blasting, attending events, supporting projects, and more)
- Individual Activity Score visible in user's profile
- Individual points contribute to Scene's overall Activity Score
- Large bonuses permitted for Proof-of-Support actions (verified labor/financial support)

### 11.3 Artist Analytics (WebApp)
- Performance metrics across tiers
- Geographic data
- Fan engagement
- Cross-community performance
- Specifics TBD during development

---

## 12. Social Tab (V2) (in The Plot)

### 12.1 Message Boards
- The ONLY place for public communication within the Scene
- Community-wide discussions
- No DMs to random individuals

### 12.2 Groups
- Once users are in a group together (e.g., Search Parties), they can communicate within that group
- Private to group members

### 12.3 Sects
- Sub-communities within a Scene (by sub-genre, taste, etc.)
- Can message each other through a feed channel

### 12.4 Communication Model
- Scene-wide: Public message boards (Social tab)
- Sect-level: Feed channel within the Sect
- Group-level: Private within group members
- Artists, Businesses, Events, Promoters can message their followers (one-way broadcast)
- Users cannot message Artists, Businesses, Events, Promoters directly
- No direct DMs between users outside of groups

### 12.5 Blast
- Public signal to your Scene
- Amplifies a signal (song, flier, etc.) to your community Feed
- NOT a private message — community action

---

## 13. Onboarding

### 13.1 Account Creation
- Create login credentials manually OR login with Gmail
- Future: Login with Bandcamp/SoundCloud (seamless for artists + metadata)

### 13.2 Home Scene Selection
- Screen: "Join Your Home Scene"
- Enter City, State (autocomplete via Places API)
- Select Music Community:
  - Pre-loaded communities already exist in the system (established genres/subgenres with scenes worldwide: Metal, Punk, Folk, Garage, Blues, Rockabilly, Country, Rock, Hip-Hop, etc.)
  - As user types, matching pre-loaded communities autocomplete in a dropdown
  - User can select from the dropdown OR continue typing a custom entry
- Optional: Verify with GPS (to enable voting)
- Preview: "Welcome to Austin Hip-Hop"

### 13.3 Input-Driven Resolution
When a user submits their Music Community, the system checks City + Music Community:

1. Does City + Music Community exist as an **Active Home Scene**? → Join.
2. Does City + Music Community exist as an **Active Sect**? → Join.
3. Does City + Music Community map to a **Parent Anchor**? → Join Parent + tag user.
4. Is it unknown? → Create **Incubating Tag** + join Parent.

No forced taxonomy. The user types freely and the system resolves. Pre-loaded communities autocomplete to guide users toward established Scenes, but the field is never locked to a fixed list.

### 13.4 Scenario A: Active Scene
- User confirms → taken directly to Home Scene
- Brief tutorial showing how RaDIYo player works

### 13.5 Scenario B: Incubating Scene/Sect

**Pioneer Modal Flow:**

1. "[City] [Music Community] huh?... in [State] you say?"

2. "Your community has yet to Uprise. Until they do, members of your community can be found in [Nearest Uprise]."

3. "Until then..." — mobilizing message motivating user to free their community from corporate platforms

4. Pioneer Card:
   - QR code and shareable link
   - User can promote to their community
   - Major activity points bonuses for each person recruited

5. Prompt: "Continue to nearest scene?"

6. Once user arrives at nearest scene:
   - Tutorial begins
   - First message shows how to find others from their Sect
   - Points to Activity section of The Plot
   - Helps user keep track of who shows up from their inactive community

**Progress Indicators:**
- Current songs: X/15
- Current artists: Y/5
- Message: "Only [Z] more songs needed to restore [City]!"

- Pioneer/Recruiter activity points for early adopters

### 13.6 GPS Verification
- Can be done during onboarding OR later in settings
- Required for Citizen status (voting, uploading)
- Without GPS: Observer status (listen, blast, add, follow only)

---

## 14. Sects (Sub-Communities)

### 14.1 Definition
- A subsection of artists and listeners within the Home Scene
- Share the same taste tag (self-assigned music style affiliation)
- Example: "Austin Drill" within "Austin Hip Hop"

### 14.2 Formation (Labor-Based)
- NOT algorithmic — Sects form through Tagging Density (labor)
- Users/artists self-tag their musical taste
- When enough playtime accumulates, motion can be entered in Registrar
- Sect "Uprises" into its own broadcast

### 14.3 Signal Migration
- When Sect activates, committed artists' songs MIGRATE from Home Scene rotation INTO Sect rotation
- Song has only ONE primary broadcast rotation at a time
- Prevents main Scene feed from being cluttered by polar extremes
- Artist REMAINS in Home Scene for voting/stats — only songs migrate

**[ARCHITECTURAL CONSTRAINT: CIVIC SITUATEDNESS]**

- **Song Migration:** When a Sect activates, the Song migrates from the Home Scene rotation into the Sect rotation. A song has only ONE primary broadcast rotation at a time.

- **Artist Anchoring:** The Artist remains situated in the Home Scene (City+State) for voting rights and statistics. The artist does not "leave" the city; their signal simply broadcasts on a specialized frequency. This prevents the artist from losing their political status in the main Scene.

### 14.4 Communication
- Sects can message each other through a feed channel

### 14.5 Tagging
- Both artists and listeners self-tag their musical taste
- Tags create Sect affiliations
- Same system for everyone

---

## 15. Notifications

### 15.1 Critical (Always On)
- Voting milestones, content reported/removed, account security, payment confirmations

### 15.2 Artist Notifications (Customizable)
- New followers, song tier promotions, event milestones, upvote thresholds

### 15.3 Social Notifications (Customizable)
- Followed artist updates, Blasts from community, event reminders

### 15.4 Discovery Notifications (Optional)
- New Scene recommendations, genre updates, nearby events

### 15.5 Delivery
- In-App: Banner, badge counts, notification center
- External: Push notifications, email digests, calendar reminders

### 15.6 User Controls
- Category toggles, quiet hours, frequency limits

---

## 16. Profiles

### 16.1 User Profile (Mobile)
- Username
- Location (optional)
- Activity Score
- Collections (signals they've Added)
- Materialized Signals (patches, posters, attendance artifacts)
- Artists followed
- Users followed
- Events followed
- Groups (Search Parties, etc.)
- Ambassador services offered (V2)

### 16.2 Artist/Band Profile

**Public (visible to listeners on Mobile):**
- Bio
- Photos/Videos
- External links (website, Bandcamp, merch store, social accounts)
- Contact information
- Released songs (playable)
- Upcoming events

**Artist-Facing (managed on WebApp):**
- Follower count
- Analytics/metrics
- Profile editing
- Song uploads
- Upload/edit album art
- Add new events
- Notifications
- Search for ambassadors in tour cities (V2)

**Band Members:**
- Members linked to a band account can see everything the band profile displays
- Both band account AND member/listener accounts can read band notifications

---

## 17. Search

### 17.1 Scope
- Search is within your own Uprise (Scene)
- Not platform-wide

### 17.2 Music Search
- Look up music currently uprising (broadcasting) in your Scene
- Surfaces songs the community is currently carrying
- Discovery-focused — not a streaming catalog

### 17.3 Artist Search
- Look up artists in your Scene
- Play songs from the artist's profile

### 17.4 Collections Persistence
- Once a song is Added to a Collection, it stays
- Users retain Personal Play access even after songs leave rotation
- Your collection is your history — it doesn't disappear when the broadcast moves on

---

## 18. Proof-of-Support & Event Verification

### 18.1 Promoter Registration
- Users register as Promoters at the Registrar
- Receive code that takes them to WebApp
- Create events on WebApp

### 18.2 Flier & QR Code Flow
- Promoter uploads flier image at the Print Shop
- Receives QR code printout
- Posts QR code at the door or somewhere at the event

### 18.3 Attendee Verification
- Attendees scan QR code at the event
- Verifies attendance
- Receives: Flier (Memory Token) + Activity Points

---

## 19. The Registrar

### 19.1 Definition
- Civic hub located in the Feed tab
- Where users register roles and activate official platform elements

### 19.2 Registration Functions (V1)
- Artist/Band registration → receive code → complete on WebApp
- Promoter registration → receive code → complete on WebApp

### 19.3 Project Registration (V1)
- Community projects are proposed/discussed in Social message boards
- Once ready, users register the project at the Registrar
- Registered Project becomes an active signal that can be Followed, Blasted, Supported

### 19.4 Future Functions
- Sect motions (when Sect has enough density to Uprise)
- Other civic actions TBD

---

## 20. Subscription Tiers

### 20.1 Free Listener
- Full access to Home Scene (all tiers: city, state, national) [may change]
- Full access to The Plot in Home Scene
- Can Blast, Add, Follow, Vote (if Citizen)

### 20.2 Discovery Pass ($5.99/mo)
- Unlocks Scenes outside Home Scene
- Access to Discover section (Map View, other Scenes)
- Can visit any Scene — city, state, and/or nationwide

---

## 21. Revenue & Pricing

### 21.1 Listener Tiers

**Free Listener:**
- Access to Home Scene (all tiers: city, state, national) [may change]
- Full access to The Plot
- Can activate Standard Artist Capability (free)

**Discovery Pass ($5.99/mo):**
- Unlocks all Scenes outside Home Scene
- Full access to Discover section
- Can modify to "Tour Guide" (Ambassador) - V2

**Mixologist Upgrade (+$4/mo):**
- Requires Discovery Pass ($5.99 + $4 = $9.99 total)
- Create and sell curated Mixes - V2

### 21.2 Artist Tiers

**Standard Artist (Free):**
- 1 rotation slot in Fair Play
- Can purchase promotional pack add-ons ($5 per city for touring)

**Premium Artist / Play Pass ($9.99/mo):**
- 3 rotation slots in Fair Play
- Enhanced analytics
- INCLUDES Discovery Pass benefits (no separate subscription needed)
- Can purchase promotional pack add-ons ($5 per city)

### 21.3 Promotional Pack Add-Ons (Artists)
- $5 per city
- Tour flier prominently advertised in Promotions section (citywide + statewide)
- Users in each tour city receive notification in Feed
- Artist profile displayed in "On Tour" carousel in Feed

### 21.4 On-Air Promotional Ads (Artists)
- $5/day or $20/week
- 7-10 second ad in the 4th rotation slot
- Promote shows, tours, new releases, merch, etc.
- Can be sponsored by local businesses paying the artist

### 21.5 Promotions Section (Businesses)
- Local businesses pay to advertise in Scene's Promotions tab
- Targeted ad space for specific music communities
- Flexible/affordable pricing (TBD)
- Can sponsor live shows (pay artist guarantee)

### 21.6 VIP Club (V2 - Price TBD)
- Artists opt into VIP program
- Listeners select favorite VIP artists
- VIP perks: afterparty invites, backstage access, special material
- More VIP listeners = more artist revenue

### 21.7 Print Shop Revenue
- Runs sold as issuance capacity (service fee)
- Artists, Promoters, Businesses purchase Runs
- Example: Patch Run 100 units for $10

---

## 22. Super Admin

### 22.1 Definition
- Platform overseer with full visibility and control
- All knowing — access to everything
- Control over all account layers (Users, Artists/Bands, Promoters, Businesses, Venues)

### 22.2 Statistics Access
- All Scene statistics (every Uprise)
- All user activity data
- All artist/band analytics
- All event data
- All transaction data (Print Shop, subscriptions)
- Platform-wide metrics (total users, songs, events, etc.)

### 22.3 Account Control
- Access to all account types
- View, edit any account
- Suspend, release, or ban users
- Manage permissions across all layers

### 22.4 Content Moderation
- Review reported content
- Remove content/users
- Handle disputes

### 22.5 Platform Configuration
- Edit music communities/genres
- Manage Scene activation thresholds
- Set pricing (subscriptions, Print Shop runs)
- Configure Activity Points (bonuses, multipliers)
- Manage quote rotation (pioneer modals)

### 22.6 Overrides
- Manual Scene activation
- Manual Activity Points adjustments
- Feature flags (enable/disable V2 features)

### 22.7 Fair Play Control
- Tweak, adjust, and tune the Fair Play algorithm
- Can configure for particular Uprises (not just global)
- Modify evaluation periods
- Adjust rotation frequency calculations
- Configure tier progression thresholds

### 22.8 Future Controls
- Additional controls added as features are developed
- TBD during development

---

## 23. Search Parties (V2)

### 23.1 Definition
- Collaborative discovery groups (up to 10 members)
- When any member takes an action, all members benefit
- Expands discovery through shared, explicit actions — not recommendations

### 23.2 Creating a Search Party
- Creator names the party
- Sets discovery focus (music community, region, mood)
- Invites members
- Configures sharing settings
- Sets party duration (ongoing or time-limited)

### 23.3 Sharing Settings
- Share artist FOLLOWs: on/off
- Share song ADDs: on/off
- Share Scene ADDs: on/off
- Share event ADDs: on/off
- Members can opt-out individually

### 23.4 Party Statistics
- Total discoveries
- Most active contributor
- Genre distribution
- Geographic spread
- Party engagement score

### 23.5 Communication
- Group members can communicate within the party (private)

---

## 24. Listening Rooms (V2)

### 24.1 Definition
- Community social feature inside The Plot (Social tab)
- Shared listening experiences with discussion

### 24.2 Room Types
- Public: Open community listening rooms
- Private: Search Party or group sessions

### 24.3 Features
- Shared playback (everyone hears the same thing)
- Discussion via message boards or group chat
- Can be hosted by Search Parties

---

## 25. Mixologist & Mixes (V2)

### 25.1 Mixologist Capability
- Add-on to Discovery Pass (+$4/mo)
- Total: $5.99 + $4 = $9.99/mo
- Allows creation and sale of curated Mixes

### 25.2 Mixes
- Curated collections of songs
- Can be shared publicly or sold
- Personal use mixes are free to create
- Commercial mixes require artist approval

### 25.3 Mix Market
- Premium mixes (paid feature)
- Tip jar for mixologists
- Artist approval workflow for commercial use

### 25.4 Attribution Requirements
- All artists credited in mix metadata
- Links to artist profiles
- Song titles and Scene affiliations displayed
- Mixologist attribution prominent

---

## 26. Ambassador System (V2)

### 26.1 Definition
- Local community members who assist touring artists
- Activated via Discovery Pass (Tour Guide modifier)

### 26.2 Services Offered
- Venue recommendations
- Local Scene connections
- Food and lodging assistance
- Loading/unloading help
- Flyer distribution
- Transportation
- General tour guidance

### 26.3 Features
- Map view of ambassadors by location
- Service categories and availability settings
- Private reviews (artist-to-ambassador, ambassador-to-artist)
- Service booking system
- Booking history and completion tracking

### 26.4 Revenue
- Ambassadors set their own rates
- Platform facilitates connection, not payment (for now)

---

## 27. Vibe Check (V2)

### 27.1 Definition
- User-initiated comparison tool for exploring musical compatibility
- Purpose: Repertoire Expansion — visualizing overlaps and differences to explore new sounds

### 27.2 Taste Profile Setup
- User optionally completes a Taste Questionnaire
- OR grants access to external libraries (Spotify, SoundCloud, etc.)
- Generates a static Taste Profile (a data lens)

### 27.3 How It Works
- User actively initiates a Vibe Check
- Compares their musical footprint against another Entity (User, Scene, Event, or Mix)
- Displays a Vibe Match % (e.g., "You have a 15% overlap with the Austin Punk Scene")
- Serves as navigational context, not a filter

### 27.4 Key Rule
- System does NOT recommend content based on Taste Profile
- Vibe Check is user-initiated only — no algorithmic suggestions

---

## 28. Quality Control & Moderation

### 28.1 Automated Quality Checks
- Audio format validation (supported formats: mp3, wav, flac, m4a, aac)
- File size limit: 100MB
- Duration: minimum 30 seconds, maximum 10 minutes
- Corruption detection, header validation, playability test
- Silence detection (max 30 seconds of silence)
- Copyright screening via acoustic fingerprinting (Gracenote, MusicBrainz)

### 28.2 Community Moderation (Reporting)
- Any user can REPORT content or users
- Report categories: low audio quality, inappropriate content, copyright concern, spam, harassment
- Reports sent to admin for review
- Automatic flagging after multiple reports from different users
- Temporary suspension pending review if threshold reached

### 28.3 Staff Moderation
- Admin review queue for flagged content
- Actions available: warn, remove content, suspend user, ban user
- Dispute resolution process
- Response time targets TBD during development

### 28.4 Content Standards
- Songs must be "legible" quality (community can report low quality)
- No hate speech, explicit threats, or illegal content
- Copyright compliance required
- Community self-policing encouraged through Report action

---

## 29. Edge Cases, Account Limitations & Copyright Compliance

### 29.1 Home Scene Changes
- Users can change their Home Scene (e.g., they move cities)
- 30-day cooldown between Home Scene changes
- One primary Home Scene at a time
- Voting rights transfer to new Home Scene after GPS verification

### 29.2 Scene Falls Below Threshold
- If a Sect's active content drops below activation threshold, broadcast pauses
- Members are notified and routed back to parent Scene
- Content is preserved, not deleted
- Sect can reactivate when threshold is met again

### 29.3 Name Conflicts
- System key (city-state-community) prevents duplicates
- Admin review for ambiguous community names

### 29.4 Copyright Compliance

**Prohibited Content:**
- Cover songs without documented permission from rights holder
- Remixes without documented permission from original artist
- Samples without documented clearance
- Songs containing unlicensed copyrighted material (beats, instrumentals, vocals)
- AI-generated music that mimics a specific artist's voice or style without consent
- Music previously released under exclusive distribution agreements that prevent redistribution

**Enforcement:**
- Acoustic fingerprinting scan on upload (Gracenote, MusicBrainz)
- Community REPORT option for suspected copyright violations
- Artists must affirm original ownership or proper licensing at upload
- Flagged content removed immediately pending review
- Repeat offenders: account suspension, permanent ban

**Dispute Resolution:**
- Counter-claim process for wrongly flagged content
- Artist can submit proof of licensing/permission
- Admin review within [TBD] business days
- Content restored if claim is resolved in artist's favor

**Platform Position:**
- UPRISE does not adjudicate copyright disputes — it enforces compliance
- UPRISE cooperates with DMCA takedown requests
- All uploaded content must be original work or properly licensed

---

## Appendix A: V1 vs V2 Features

### V1 (Launch)
- User accounts (Listener)
- Artist/Band accounts
- Promoter accounts
- The Plot (5 tabs: Feed, Events, Promotions, Statistics, Social placeholder)
- RaDIYo player with tier toggle
- Fair Play system
- Discover section (Map View, Search)
- Print Shop (Runs, QR codes)
- Signals (Add, Follow, Blast, Support)
- Sects (tagging, formation)
- The Registrar (Artist, Promoter, Project registration)
- Discovery Pass subscription
- Activity Points
- Event creation (Promoters, Artists)
- Proof-of-Support verification

### V2 (Future)
- Social tab (message boards, Listening Rooms)
- Merchant accounts
- Venue accounts
- Search Parties (collaborative discovery groups)
- Listening Rooms (shared playback experiences)
- Mixologist capability (create and sell Mixes)
- Mix Market (premium mixes, tip jar)
- Ambassador System (tour guide services)
- Vibe Check (user-initiated musical compatibility comparison)
- VIP Club

---

## Appendix B: Terminology Quick Reference

| Term | Definition |
|------|------------|
| Scene | Geographic location + Music Community (exists at city, state, and national tiers) |
| Uprise | The broadcast signal; also a Scene when treated as a signal |
| The Plot | The community's digital habitation (formerly Ground Zero) |
| RaDIYo | Broadcast receiver/player (Radio + DIY) |
| RaDIYo broadcast network | The listener-governed broadcast layer within the UPRISE platform |
| Fair Play | Equal opportunity rotation algorithm |
| S.E.E.D. | Support, Explore, Engage, Distribute |
| Sect | Sub-community within a Scene (by taste tag) |
| Signal | Atomic unit of interaction (songs, fliers, etc.) |
| Run | Finite issuance allocation from Print Shop |
| Citizen | GPS-verified user (can vote) |
| Observer | Non-verified user (cannot vote) |
| Memory Token | Flier earned by attending event |
| The Registrar | Civic hub for registration and project activation |
| Parent Scene | Pre-loaded established genre Scene (open from launch) |
| Child Genre | Microgenre mapped to a parent genre |
| Personal Play | On-demand playback from user's Collection (isolated from Fair Play) |
| Community Resonance Display | Scene Activity-driven content surfacing in the Feed |
| Search Party | Collaborative discovery group (V2) |
| Listening Room | Shared playback experience space (V2) |
| Mixologist | User who creates and sells Mixes (V2) |
| Ambassador | Local guide for touring artists (V2) |
| Vibe Check | User-initiated musical compatibility comparison (V2) |

---

## Appendix C: The Absolute Prohibitions

The following functions are strictly forbidden in the codebase, regardless of standard industry practice:

**1. No Taste Prediction**
The system must never attempt to model user behavior, predict taste, or recommend music based on listening history.

**2. No Virality Optimization**
The system must never algorithmically accelerate content based on velocity or "trending" status.

**3. No Manufactured Consensus**
The system must not average preferences across Scenes to create a "global" feed.

**4. No Time-to-Fame Collapse**
The system must not create shortcuts to recognition (e.g., "Breakout Artist" features) outside of the established tier progression.

---

*This document is the canonical source for UPRISE platform concepts. Technical specifications should be derived from this foundation.*

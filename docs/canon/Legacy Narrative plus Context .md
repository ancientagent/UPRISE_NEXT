# UPRISE Platform Narrative — Canonical Document

**Status:** CANONICAL  
**Purpose:** Comprehensive platform specification — conceptual foundation for all technical development  
**Last Updated:** February 2026 (v2 — Full Rewrite)

---

## 1. Location & Scene Structure
- Music Community: a group of people that are a part of the same music SCENE; people who share an affinity for a particular music style(s) 									

### 1.1 Scene Definition
- Scene: the all encompassing body, environment, and influence of a music community, the social / cultural imprint of a particular area created and influenced by a music community
- system facing = Geographic location + music community
 Examples:
  - Citywide:  "Austin Hip-Hop" Scene 
  - Statewide: "Texas Hip-Hop" Scene
  - Nationwide: "American Hip-Hop" Scene

 *Only "citywide" scenes contain the user infrastructure for communities to inhabit. 
"Statewide" and "Nationwide"  Scenes exist only as aggregates that pull the collective citywide statistics and top listener voted singles from communities across the country   
                                                                                                                                      
### 1.2	Uprises	
-Uprise: The established broadcast "station" operated by the music community of a particular scene; a community's access point to the RaDIYo Broadcast Network. 
-Each Scene operates its own "Uprise" 

Citywide Uprise:
-All music enters the RaDIYo Broadcast Network from the citywide community. 
-Singles are submitted through artist account by uploading to the Play Deck located in the Artist's management dashboard. 

Statewide Uprise:
 a rotation consisting of the top songs upvoted by the citywide music communities within a state.

Nationwide Uprise:
a rotation consisting of the top songs upvoted by the statewide music communities across the country
-there is no voting as this is as far as the music travels (however there will be plans in the future for other user engaging features) 

### 1.3 Home Scene
- User's local music scene of choice and civic anchor of the platform
- Onboarding message: "Welcome to [City] [Music Community]"
- Users can Vote in their Home Scenes (requires GPS verification within state)
- Users can visit any Scene via Discovery section (paid subscription only), but only vote in Home Scene

**During onboarding, user is asked what their local music Scene of choice is. This is the core mechanic of scene development / assignment on the platform

### 1.4 Taxonomy of Power (Enforced Hierarchy)
1. **Scene:** The environment/container. Scenes exist at City, State, and National levels.
2. **Uprise:**  The broadcast station operated by the music community of a particular Scene (e.g., "The Austin Hip-Hop Uprise").
3. **Community:** The people operating within the Scene.
4. **The Plot:** The home scene dashboard; interface in which music communities engage within their scene. 
5. **RaDIYo:** The transport system / receiver (RaDIYo Player) that powers an Uprise. 

The Community inhabits the Scene and operates the Uprise. The Uprise utilizes the RaDIYo Broadcast Network to distribute music from artists in the scene and is collectively curated by the listeners through upvoting.

### 1.5 Parent Scenes (Launch-Ready)
- Pre-loaded in the system for users to onboard; these are the Established music scenes with large communities worldwide (Punk, Metal, Hip-Hop, Electronic, Rock, Country, Folk, Blues, etc.)
- Open to onboarding users from day one, these are the fundamental scenes in which all "sects" and future scenes are established 
- no activation threshold required to enter, however there is threshold required to "uprise" the sect (establish an uprise)- 8 bands (45 min of music material?)
- Early adopters will become the recruiters who help populate the Scene - awarded "Pioneer" titles that allow them to gain large activity point bonuses along with those who join through them.  
- Major hotspots will be identified and Pre-populate in beta using bands in town and other resources as a reference. 

### 1.6 Subsects or"Sects" (Taste-Tag Taxonomy)
 Known sub-communities can be mapped to parent Scenes (e.g., Drill -> Hip-Hop, Shoegaze -> Hardcore, Synthwave -> Electronic)
 - NOT their own Scenes at launch, rather, can be created as a "taste tag' in both listener and artist profile, that they can assign to their profile
 If a user enters a subsect as their "music scene of choice" during onboarding- ex. "Austin Texas Boom Bap"
  1. System recognizes it as a subsect of Hip-Hop
  2. Routes user to the Austin Texas Hip-Hop scene. 
  3. Informs user they can tag themselves with their preferred subsects of Hip-Hop using the tag system in their profile manager
  4. users who share a tag are automatically part of a "Sect" which growth can be referenced / tracked via the scene map in the plot menu)  
 
### 1.7 Sect Uprising
A Sect can Uprise into its own broadcast within the Scene once it has the registered support of enough artists within the parent scene to meet the music threshold

Process
1. Sect member(s) reference scene map and notice there is enough presence to uprise 
2. A motion is made in the scene Registrar for an uprise (by member(s) )
3. The established presence (music threshold) is guaranteed by artists explicitly supporting the motion
4. Fair Play system initiates for the Sect broadcast
5. Songs from all artists within the sect migrate from parent rotation into Sect rotation
6. Sect will be available on registrars across all homescenes as an official sect to inspire others, once multiple cities in multiple states have their own sect it will become its own scene. 

If a user enters a city / state in their "Music scene of choice" that is not part of the pre-established cities
1. User will be informed that their city has yet to uprise, and will be given a pioneer title and recruitment tools that will provide them large activity point bonuses to both them and those who join their city through them. 
2. Their city of choice (verified by GPS) will be attached to their profile, all users registered city / zip will be able to be referenced / filtered in the scene map located in the plot of their homescene
3. If a motion is made in the scene Registrar for a new local uprising, it must gain the support of enough artists whose music playtime is greater than or equal to 45 min.
4. If support is guaranteed, (artists have signed the motion for a local new uprise (city/zip/or region) a new scene is created all artists and listeners within the city/region will be taken to the new homescene to uprise. 

Sect-level communication occurs in Social tab threads/rooms, not as an auto-created Activity Feed channel.
Regional coordination channels (when enabled) are explicit group/social constructs, not automatic feed injection.
---

## 2. RaDIYo Broadcast Network
- The listener-governed broadcast layer within the UPRISE platform
- Returns music distribution and social cohesion to local communities
- Each Scene has its own broadcast — what plays is determined by community action through Fair Play
- Music travels from city to state to national broadcasts based on real local support
- "RaDIYo" = Radio + DIY

### 2.1 The RaDIYo Player (Interface)
- The user-facing receiver in which users connect to the RaDIYo Broadcast Network
- It is a receiver — not a playlist
- Plays the broadcast of whichever Scene the user is currently in
- Functions as BOTH a music player AND as a way to "seek" new uprises 

### 2.2 Player Controls
- Tier Toggle: Switch between City → State → National
- Swipe RIGHT: Jump to random state (same music community) + opens Discover
- Swipe LEFT: Jump to random city in current state (same music community) + opens Discover
- Action Wheel: Upvote, Add, Blast, Skip, Report

**Note:** Swiping is a way to jump into discovery without having to think about what you are looking for — an exciting, seamless way to discover new music all across the country.

### 2.3 Complete Community Immersion
When users toggle between broadcast tiers via the RaDIYo player, the scene plot will update to reflect the aggregated statistics of the geographic plot 

**Citywide Tier:**
- Player: Fresh uploads from local artists
- Activity Feed (S.E.E.D Feed): Updates from citywide Scene members, local achievements
- Events: Local shows in user's city (Locality + Subscription only)
- Promotions: Local business advertisements
- Statistics: Metrics for city's music Scene
- Social (V2): Local Scene discussions

**Statewide Tier:**
- Player: State-level tracks (songs that earned citywide support)
- Activity Feed (S.E.E.D Feed): Activity and trends across the entire state's Scene network
- Events: Notable shows and festivals throughout the state
- Promotions: Regional businesses and larger venues
- Statistics: State-level metrics and comparative data
- Social (V2): Regional discussions and collaborations

**Nationwide Tier:**
- Player: Top-tier music (songs that resonated at state level)
- Activity Feed (S.E.E.D Feed): National music community trends and breakout artists
- Events: Major festivals and landmark events
- Promotions: Industry brands and nationwide services
- Statistics: Music community benchmarks and national trends
- Social (V2): Music community-wide discussions and industry topics

### 2.4 Playback Behavior
- Continuous: RaDIYo never stops unless user explicitly pauses or skips
- Seamless transitions between songs or artist ads — no dead air
- Background play continuation
- Cross-Tier Continuity: When toggling tiers, the current song completes before transitioning. Votes remain available until the song ends.

### 2.5 Persistent Interface
- Always present (fixed directly above navigation bar)
- Available across both The Plot and Discover sections
- Single interface for both music and navigation — reduced cognitive load

---

## 3. App Structure & Navigation

### 3.1 Screen Layout (Bottom to Top)
- **Navigation Bar** (fixed at bottom): Three buttons — Home (left), Action Wheel (center, raised above the other two), Discover (right)
- **RaDIYo Player**: Fixed directly above the navigation bar, always visible, persistent across all screens
- **Main Content Area**: Fills the rest of the screen — displays the scene plot or Discover interface depending on active section

### 3.2 Navigation Bar (Bottom)
Three buttons, left to right:
- **Home** (The Plot): User's Scene — Activity Feed (S.E.E.D Feed), Events, Promotions, Statistics, Social
  - S.E.E.D stands for Support, Explore, Engage, Distribute.
- **Action Wheel**: tap to reveal song engagement actions Report, Skip, Blast, Add, Upvote 
- **Discover**: Search bar with Discovery Map (requires Discovery Pass for non-Home Scenes)


---

`## 4. Discover Section
Where listeners go to discover different scenes all across the country

### 4.1 Access
- Bottom right nav bar
- Swiping RaDIYo player (lands in Discover, tuned to new Scene)

### 4.2 Search Bar
- Drop down to reveal Map View
- Search for specific Scenes (city/state)

### 4.3 Map View
- Geographic interface with Scene flags
- Flags sized by population, colored by Music Community, saturated by activity
- Tap a Scene flag to visit

### 4.4 Discovery Cues
- Based on explicit Scene activity and user-selected navigation only
- No system-generated artist recommendations or predictive surfacing

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
- A Signal is the atomic unit of supporting interaction on UPRISE
- A discrete unit of meaning that can be carried, echoed, or ignored across the community
- Signals are things that are created or promoted — not the entities that create them
- Can be viewed on  activity feed in the scene plot 

### 5.2 Signal Types
- Core Signals: Songs, Fliers, Events (and Uprises when referenced/shared),  
- Discourse Signals: Posts, Threads (situated conversations inside a Scene)
- Economic Signals: Deals/Promotions (Offers)
- Intent Signals: Projects (motions for collective action)
- Materialized Signals: Wearables (patches/shirts), Printed Artifacts (posters)
- Verification Signals: Proof-of-Support confirmations (attendance, donations, merch purchases)

Note: Fliers are viewable on events but can only be obtained as an artifact through attendance/Proof-of-Support via limited "printshop runs"

### 5.3 Followable Entities (Not Signals)
- Artists
- Businesses
- Events
- Promoters
- Following creates an awareness link for entity updates without ranked or algorithmic feed injection

### 5.4 Universal Signal Actions
- ADD: Save any signal to your personal Collection
- FOLLOW: Subscribe to an entity for ongoing awareness (no automatic ranked feed channel)
- BLAST: Publicly amplify a signal to your community Activity Feed (S.E.E.D Feed)
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

## 6. The Scene Plot (Home scene dashboard)

### 6.1 Definition
- Where users S.E.E.D. — Support, Explore, Engage, Distribute
- Users don't "browse" The Plot — they inhabit and cultivate it
- the prime interface of the "Home" section

### 6.2 Structure (5 Tabs)

**FEED (default)**
- Live updates: Blasts, new releases entering Fair Play, and civic updates (registrations/motions/milestones)
- Community Resonance Display: descriptive Scene activity view (not ranked surfacing)
- Contains The Registrar (civic actions) and Scene statistical data including the Scenescape (scene map)
- No automatic injection from Promotions or cross-Scene content
  STATISTICS
- Activity Score: Sum of all community members' individual activity points
- Scene health metrics, member counts
- Statistics will track EVERYTHING — specifics TBD during development

**EVENTS**
- Shows all events for artists within the Scene
- Scene's calendar displays all upcoming events
- Fliers are featured on the event

**PROMOTIONS**
- Local business Offers (coupons, specials, deals)
- Off-platform event promotions
- Wall of local community ads 
- Links to Event-associated promotional Runs (Print Shop issuance remains in Events)

**SOCIAL (V2)**
- Message boards — the ONLY place for public communication within the Scene
- Listening Rooms

## 7. Users & Accounts

### 7.1 User Account (Mobile)
- The person — a Listener and community member
- Has profile
- Active participant: listens, votes, blasts, explores
- Uses mobile app to S.E.E.D. their scene

### 7.2 Artist/Band Account (WebApp)
- The stage name or band — an entity, registered by a Listener
- Has profile
- Uploads music, manages presence
- Operates on the WebApp
- Registered via The Registrar → completed on WebApp
- One User can link to multiple Artist/Band accounts
- Multiple Users can link to one Artist/Band account (band members)
- songs placed in play deck slots enter Fair Play
- Standard Artist: 1 rotation slot (free)
- Premium Artist (Play Pass): 3 rotation slots ($9.99/mo)

### 7.3 Key Distinction
- Users and Artists both have profiles
- Users participate IN the community
- Artists/Bands can create, promote, list 

### 7.4 Locally Affiliated vs visitor (User status)
- Visitor: someone who is listening in a scene they are not locally affiliated with, have "read only" permissions but can — can Listen, Add, Follow
- Locally Affiliated: can vote (if GPS verified)  can also engage completely in a community that is their "Local Scene of choice" 


### 7.5 Business Role Permissions

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
- The system that ensures equal opportunity for all songs entering rotation
- NOT popularity-based — no song gets preferential treatment
- Every song gets the same initial exposure to determine community response

### 8.2 How It Works
- New songs enter rotation through the artist's play deck
- All new releases play on the hour for approximately one week (equal exposure)
- After one week, engagement score is calculated from playback engagement and contextual modifiers (ADD/BLAST); upvotes are separate and used for tier progression only
- Song finds its place in the rotation stack based on engagement score
- Higher engagement = more frequent rotation
- Re-evaluated each cycle to stay current with community sentiment


### 8.3 Key Rules
- Upvotes determine tier progression
- Metrics from Personal Play (Collections) do NOT affect Fair Play
- only locally affiliated listeners who have registered their GPS can vote in their Home Scene
- Voting disabled at National tier

### 8.4 Personal Play vs Fair Play
These are two completely separate systems with total data isolation:

**Fair Play (Primary):**
- The community-driven broadcast system
- Automated rotation — no user control over song selection
- All engagement metrics tracked and weighted
- Songs cannot be repeated on demand
- GPS-verified voting impacts tier progression (not rotation frequency)

**Personal Play (Secondary):**
- On-demand access to user's ADDed Collection
- Manual selection, or  playlist, repeat, shuffle available
- No impact on Fair Play metrics whatsoever
- No voting capabilities in this mode
- Play counts do NOT affect song priority
- Private listening statistics only

These systems never cross-contaminate. Separate analytics, separate database tables, independent calculation engines.

### 8.5 Vote Casting Process
1. Votes can only be cast while the song is currently playing
2. User presses UPRISE logo button to reveal Action Wheel
3. Visual feedback confirms vote registered
4. Cancellation window available before song ends
5. Once song playback completes, vote is final
6. One-time lock: once cast for a song in a tier, cannot be changed

### 8.6 National Tier 
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


### 8.7 Anti-Manipulation Measures

**GPS Verification:**
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

### 8.8 Phase 1 Duration
- Initial evaluation period: approximately one week [TUNABLE]

### 8.12 Skip
- Skips the song so user doesn't hear it
- Space filled with business / artist ads until next song plays
- Skip contributes no positive engagement score; it does not apply a negative penalty

### 8.13 Report
- Sends a message to admin
- Can be used for any number of reasons
- 3 reports of any signal gets automatically removed until it can be reviewed by admin
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
- Locality: Event is in the home scene it was created in unless it is a tour
- user can follow an event by following the Artist, Promoter, or event itself, or can be followed by a user's blast 
- following an artist and / or promotor will automatically add events to user's calendar both in collection which can synch to google / apple calendars

### 9.3 Events Tab (in The Plot)
- Calendar view at the top showing all upcoming events in the Scene
- List of events below the calendar
- Users can browse both views

### 9.4 Fliers (Memory Tokens)
- Earned by attending the event
- Verified through Proof-of-Support can scan qr at event location
- User receives activity points for attendance
- Non-transferable and non-replicable

### 9.5 Event Distribution Rules

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
- References Event-linked promotional Runs; Print Shop issuance itself is in Events surface

### 10.2 Business Promotions
- Businesses offer promotions, coupons, deals
- Appear on the Promotions tab wall within the Scene

### 10.3 The Print Shop (Issuance Infrastructure)

The Print Shop acts as an infrastructure surface, not a store. It sells Issuance Capacity (the right to mint), not physical goods.
It is scoped to Event-linked issuance in the Events surface.

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

2. **Trigger:** Verification triggers the minting of a Materialized Signal (Patch/Poster) and awards Activity Points.

### 10.5 The Run Model
- Transacting in Print Shop buys a "Run" (finite issuance allocation)
- Example: Patch Run: 100 units for $10
- Example: an artist or a promotor wants to promote by offering limited Poster Run: 20 units for first 20 ticket buyers (users can post poster in profile can be viewed in collections)
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
- Fans can add to collection and display

**Attendance Artifacts:**
- Non-repeatable signals minted after verified events: stamps, patches posters, fliers etc

Materialized signals are non-tradeable by default.

### 10.8 Business Subscription Tiers

**Basic Tier:**
- Local communities only (citywide Scenes)
- Limited posts per month
- Basic analytics

**Premium Tier:**
- statewide Scene access
- Increased post limits
- Enhanced analytics, scheduling

**Enterprise Tier:**
- national Scene access
- Unlimited community access
- Advanced reporting

All tiers: 4-hour minimum cooldown between posts.

### 10.9 Offer Propagation Rules
- Offers (coupons, deals) do NOT appear in a feed automatically
- Offers only propagate when a user explicitly Carries (ADDs) or Redeems them
- Business-Artist affiliations (e.g., artist wears a business wearable) must be explicit and visible
- Affiliations do NOT affect Fair Play rotation, discovery, or ranking

---

### 11. Activity Points

- Users earn points through participation ( blasting, attending events, supporting projects, and more)
- Individual Activity Score visible in user's profile
- Individual points contribute to Scene's overall Activity Score
- Large bonuses permitted for Proof-of-Support actions (verified labor/financial support)and pioneering (recruitment)

### 11.3 Artist Analytics (WebApp)
- Performance metrics across tiers
- Geographic data
- Fan engagement
- Cross-community performance
- Specifics TBD during development

---

## 12. Social Tab (V2) (in The Plot)

### 12.1 Message Boards
- The ONLY place for public communication within the Scene other than group feeds (private)
- Community-wide discussions
- No DMs to random individuals

### 12.2 Groups
- Once users are in a group together (e.g., Search Parties), they can communicate within that group
- Private to group members

### 12.3 Sects
- Sub-communities within a Scene (by taste tags / other musical tastes)
- Can coordinate through Sect threads in Social tab

### 12.4 Communication Model
- Scene-wide: Public message boards (Social tab)
- Sect-level: Social tab Sect threads/rooms
- Group-level: Private within group members
- Artists, Businesses, Events, Promoters can message their followers (one-way broadcast)
- Users cannot message Artists, Businesses, Events, Promoters directly
- No direct DMs between users outside of groups

### 12.5 Blast
- Public signal to your Scene
- Amplifies a signal (song, flier, etc.) to your community Activity Feed (S.E.E.D Feed)
- NOT a private message — community action



## 19. The Registrar

### 19.1 Definition
- Civic hub located in the Activity Feed (S.E.E.D Feed) tab
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
- Tour flier distributed in Promotions surfaces for selected city/state/community scope
- Boost-style paid distribution across selected communities (similar to Facebook Boost)
- No default insertion into Activity Feed (S.E.E.D Feed)
- No impact on Fair Play rotation, ranking, or governance

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
- Edit music communities and taste-tag taxonomy
- Manage Scene activation thresholds
- Set pricing (subscriptions, Print Shop runs)
- Configure Activity Points (bonuses, multipliers)
- Manage quote rotation (pioneer modals)

### 22.6 Overrides
- Manual Scene activation
- Manual Activity Points adjustments
- Feature flags (enable/disable V2 features)

### 22.7 Fair Play Governance Controls
- Monitor Fair Play health/audit signals
- Roll out approved Fair Play versions via feature flags
- Modify global evaluation periods only through approved policy changes
- No manual per-Uprise overrides that change fairness outcomes
- No manual song reordering, placement grants, or tier-progression exceptions

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
- Music Community and taste-tag distribution
- Geographic spread
- Party engagement score

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
- The Plot (5 tabs: Activity Feed (S.E.E.D Feed), Events, Promotions, Statistics, Social placeholder)
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
| Uprise | Dual‑state object: the broadcast station/infrastructure **and** the Signal of that community broadcast |
| The Plot | The community's digital habitation |
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
| Parent Scene | Pre-loaded established Music Community Scene (open from launch) |
| Sect Tag | Taste tag mapped to a parent Music Community |
| Personal Play | On-demand playback from user's Collection (isolated from Fair Play) |
| Community Resonance Display | Descriptive Scene activity view in The Plot (non-ranked) |
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

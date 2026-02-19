# UPRISE Home Scene Statistics — Analytics & Instrumentation Framework

**Purpose:** Exhaustive list of meaningful, measurable statistics that can be recorded for every **Home Scene (Citywide)**.

**Scope:** Instrumentation and storage only (what we *track*). Display decisions are deferred.

**Canon constraints (reminders):**
- Metrics are **descriptive only** and must not become legitimacy, ranking, or authority.
- Tracking ≠ endorsement; presentation can create drift.

---

## I. Scene Population & Membership

### Artist Activity Intensity Metrics (Descriptive Only — No Ranking)

- Total events created per artist (30d / 90d)
- Total new releases entered into rotation per artist (30d / 90d)
- Total tours initiated (multi-city event sequences)
- Avg events per active artist
- % of artists hosting ≥1 event (30d)
- % of artists releasing ≥1 song (30d)
- Artist participation density index (events + releases per artist, aggregate only)
- Repeat event hosting rate (artists with ≥2 events in window)
- Artist cross-sect participation (if applicable)

*Note: These metrics must remain aggregate or artist-profile-specific. No public leaderboard or “most active” ranking language should be used at Scene level to avoid authority or legitimacy assignment.*



### A. Identity & Density
- Total registered users (Home Scene)
- Total locally affiliated users
- Total GPS-verified users
- % GPS-verified of locally affiliated users
- New users (7d / 30d / 90d)
- Returning users (30d)
- Churn rate (defined by inactivity threshold)
- Average member tenure

### B. Artist Population
- Total registered artists/bands
- Active artists (≥1 song in rotation within window)
- New artist registrations (30d)
- Artists with ≥1 event created (30d)
- Artists per sect (distribution)
- Average songs per artist
- Artists with premium capability enabled

---

## II. Broadcast & Fair Play (City Tier, Two-Pool)

### A. Fair Play Structure
- Total songs in active broadcast inventory
- Songs in New Releases Pool
- Songs in Main Rotation Pool
- Average broadcast cycle length
- Median broadcast cycle length
- Total rotation slots occupied
- % slot utilization

### B. Song Lifecycle
- Songs entered New Releases (30d)
- Songs removed (30d)
- Songs graduated from New Releases to Main Rotation
- Average time in Main Rotation
- Median time in Main Rotation
- Survival rate past New Window

### C. Engagement Breakdown (aggregate)
- Total engagement points (30d)
  - Full completions count
  - Majority listens count
  - Partial listens count
- Average engagement per song
- Median engagement per song
- Engagement distribution curve (histogram buckets)
- Skip rate (aggregate)
- Engagement-to-skip ratio

### D. Voting
- Total votes cast (30d)
- Votes per song (avg)
- Votes per active user (avg)
- % of active users voting
- Vote distribution spread (e.g., Gini / variance)
- Vote-to-engagement ratio

### E. Tier Propagation (City -> State -> National)
- Songs advanced to state tier (30d)
- Songs advanced to national tier (30d)
- Total songs currently in national tier (originating from this city)
- All-time songs that have reached national tier (city-origin)
- Songs returning from state tier (if applicable)
- Advancement rate per release cycle
- City-to-national propagation ratio

---

## III. Participation & Labor

### A. Visitor Metrics
- Average visitor density (defined as number of Visitor-status listeners active within window ÷ total locally affiliated members)
- Total visitors (30d)
- Visitor-to-local ratio
- Avg session duration (visitors vs locals)
- Visitor engagement rate (ADD/BLAST per visitor)



### A. Action Totals
- Total ADD actions (30d)
- Total BLAST actions (30d)
- Total FOLLOW actions (30d)
- ADD-to-play ratio
- BLAST-to-engagement correlation (internal)

### B. Behavioral Density
- Avg actions per user (30d)
- % users performing ≥1 civic/scene action
- % users performing ≥3 actions
- % passive listeners (listen-only within window)

### C. Retention & Rhythm
- Avg listening sessions per user
- Avg session duration
- Session frequency per user
- Days active per user (30d)

---

## IV. Sect-Level Metrics

- Total active sects
- New sect tags created
- Sect membership count (per sect)
- Sect artists in rotation
- Sect engagement totals
- Sect vote totals
- Sect event count
- Sect growth rate (30d)
- % of total scene engagement by sect
- Sect density (artists-to-members ratio)
- Sects near uprising threshold (if threshold exists)

---

## V. Events & Proof-of-Support

### A. Event Structure
- Total events created (30d)
- Total events hosted
- Avg events per artist
- Avg events per promoter
- Event density (events per 100 users)

### B. Attendance & Verification
- Total proof-of-support verifications
- Avg verified attendance per event
- % members attending ≥1 event (30d)
- Repeat attendance rate
- Event-to-engagement correlation (internal)
- Artist rotation change after event (internal)

### C. Geographic Concentration (if stored)
- Event location clusters (heatmap)
- Neighborhood distribution

---

## VI. Economic Surfaces

### A. Print Shop
- Total runs purchased
- Run types purchased (patch/poster/etc.)
- Run exhaustion rate
- Avg time to exhaust a run
- % events with runs
- Digital artifact claims

### B. Promotions
- Total business promotions posted
- Promotions per business
- Promotion interaction rate (ADD/BLAST)
- Sponsored artist events
- Business-to-artist sponsorship instances

### C. Subscriptions (internal)
- Discovery Pass penetration rate
- Premium artist capability adoption rate
- Revenue per scene (internal only)

---

## VII. Growth & Structural Momentum

- Net scene growth (users 30d)
- Net artist growth
- Engagement growth rate
- Vote growth rate
- Event growth rate
- Sect formation rate
- Avg time to first vote (new user)
- Avg time to first event attendance

---

## VIII. Integrity & Anti-Manipulation (internal only)

- Vote velocity anomalies
- Engagement spike anomalies
- IP/device clustering events
- Suspicious behavior flags
- Report volume
- Report-to-content ratio
- Temporary suspensions
- False positive rate (if measurable)

---

## IX. Historical Archive

- All-time votes
- All-time engagement points
- Longest sustained rotation presence (historical)
- Total events hosted (all-time)
- Total proof-of-support earned (all-time)
- Total songs ever entered rotation
- Total artists ever registered

---

## X. Structural Pressure Indicators

- ActiveNewCount (daily)
- Current New Window target days
- New Window density-band change count (hysteresis diagnostics)
- Avg wait time before New Releases entry (if backlog exists)
- Broadcast congestion ratio
- Artist slot saturation rate
- Sect threshold proximity
- Uprising motions initiated

---

## XI. Network Context (City aggregates)

- City contribution to state engagement %
- City contribution to state votes %
- City-to-state propagation ratio
- City national advancement count

---

## XII. Composition Metrics (only if collected)

- Genre distribution within scene
- Sect distribution %
- Artist-to-listener ratio
- Promoter-to-artist ratio
- Event-to-artist ratio

### Musician Role / Instrument Distribution (Listener Profile Category)

- Total self-identified musicians (listeners who mark musician role)
- Musician % of total members
- Instrument distribution (e.g., guitar, drums, bass, vocals, synth, DJ, producer, etc.)
- Position distribution (frontperson, backing, producer, engineer, songwriter, etc.)
- Multi-instrumentalist rate (users listing >1 instrument)
- New musicians joined (30d)
- Active musicians (30d participation threshold)
- Musician-to-artist account conversion rate
- Cross-sect musician distribution (instrument by sect)

*Note: Instrument/role data must be self-declared and optional. This is descriptive demographic composition only and must not be used for ranking, visibility adjustment, or governance influence.*

---

---

## XIII. Premium Artist Analytics (Paid Feature — Web App Only)

### Geographic Engagement Insights (Artist-Facing Only)

- Engagement distribution by city (total engagement points per city)
- % of total engagement by city
- Total ADDs by city (count)
- Total BLASTs by city (count)
- Verified event attendance by city
- Songs reaching state tier (by state)
- Songs reaching national tier (origin state context)
- Engagement density index (city engagement % ÷ city listener base %)
- Cross-scene engagement transfer (home → visiting scene)
- Repeat attendance by city
- Average verified attendance per event by city (if the artist has hosted events there)
- Average attendance per visit (total verified attendance in city ÷ total events hosted in that city)

### Awareness & Presence Metrics (Artist-Facing Only)

- Scene awareness % (by city): unique listeners who **FOLLOW** the artist and/or **ADD** at least one song and/or have **verified event attendance** for the artist within the window ÷ total **active listeners** in that city within the same window (activity-based denominator, not total registered users)
  - Active listener definition (city-level): ≥1 playback event within the time window (any song), regardless of ADD/BLAST activity.
- Awareness breakdown components (counts):
  - Followers (unique)
  - Adders (unique)
  - Verified attendees (unique)
  - Union + overlap counts (Venn accounting)
- Awareness trend over time (weekly/monthly series since artist registration)
- Activity timeline strip (since registration): simplified horizontal line
  - Time-binned (week or month)
  - Each bin color-coded by overall engagement activity (derived from ADDs, BLASTs, and engagement points)
  - Line visually shows:
    - When activity begins in a city
    - When activity declines or drops to zero
    - Whether activity is sustained over time
  - Small badge markers placed directly on the line for:
    - Song release entries
    - Events hosted
    - Tour dates
  - Hovering over a bin displays a compact stat panel:
    - Total ADDs
    - Total BLASTs
    - Total engagement points
  - Attendance is displayed separately as "Average Attendance" stat, not part of timeline intensity
  - No automated causal interpretation
  - No ranking language
  - Purely descriptive visual history


**Constraints:**
- Artist-facing only (Web App) for full analytics panel.
- Band members linked to the Artist entity may view limited **context badges/icons on city markers within the Discovery Map** when logged in under their artist-linked account.
- **Event badge:** appears for every city where the artist has hosted ≥1 verified event.
- **Engagement badge:** appears only when city-level engagement exceeds a defined noise threshold (see below).
  - Badge size uses discrete threshold tiers (e.g., Small / Medium / Large / XL) rather than continuous scaling.
  - Threshold tiers are calculated relative to the listener base of that city (engagement ÷ active listeners), not absolute global counts.
  - Each size tier corresponds to defined engagement-to-listener-base ratio ranges (system-configured thresholds).
  - Badge color reflects activity intensity (aligned with timeline color scale: neutral → green → yellow → red).
  - Size tiers are descriptive of absolute engagement volume, not comparative across artists.
- When hovering over or interacting with the badge, a small contextual stats panel appears (city-specific engagement summary for that band).
- No persistent heatmap layer or visual dominance effects.
- Overlay is contextual and permissioned (not visible to general listeners).
- Panel displays descriptive engagement statistics only (counts and percentages; no ranking labels).

### Badge Threshold Rules (Artist-Facing Only)

To prevent random noise or micro-sample distortion:
- Engagement badge requires:
  - Minimum unique adders in city (e.g., ≥ X within window), AND
  - Engagement density index above baseline (city engagement % > city listener base %), AND
  - Minimum active listeners in city window (e.g., ≥ Y) to avoid small-sample skew.
- Threshold values configurable at system level (not artist-adjustable).
- No badge implies "no significant activity" — not a negative signal.
- Badges are descriptive indicators only; they do not imply status, rank, or cultural importance.
- No public city-level leaderboards.
- No comparative ranking vs other artists.
- No automated alerts or "trending" signals.
- Descriptive geographic distribution only.
- Does not affect Fair Play, rotation, or tier progression.

---

---

## XIV. Discovery Map — Listener View (V1 Behavior)

### Scene Flags (Listener-Facing)

- Each flag represents an active Scene (City + Music Community).
- Flag size reflects Scene activity level (based on engagement and participation volume).
- Flag color reflects activity intensity.
- Purpose: discovery of new Scenes; not artist surfacing.

### Hover (Listener-Facing)

Hovering a Scene flag may display a compact descriptive panel including:
- Active artists (30d)
- Songs in rotation
- Total engagement (window-based)
- Events this month
- If user belongs to a Sect in their Home Scene that exists in this Scene: sect population count
- # of artists from this Scene in user’s Collection


*Discovery Map is navigation-first. It is not a ranking surface and does not surface individual artists by status.*

---

## Notes / Open Fields

- **Time windows:** define standard windows (e.g., 7d / 30d / 90d / all-time) later.
- **Definitions:** formalize what counts as “active user,” “active artist,” “active sect,” etc.
- **UI:** defer; this doc is instrumentation only.

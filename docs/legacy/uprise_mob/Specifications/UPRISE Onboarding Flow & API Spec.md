# UPRISE Onboarding Flow & API Specification

## Complete User Flow

### 1. Genre and Location Selection Screen

**Step-by-step interaction:**

1. **User lands on "Location and Genre Selection" screen**
2. **App immediately calls** `GET /onboarding/super-genres` and loads autocomplete data
3. **User begins typing genre** - smart autocomplete suggests from super genres list, but allows custom input
4. **User enters city and state** - autocomplete suggests from cities database
5. **App requests GPS permission** for voting rights verification
6. **User submits location + genre**
7. **App calls** `POST /onboarding/validate-community` 
8. **System Response Options:**
   - **Community Active (≥5 artists):** "Great! The [City] [Genre] scene is active and ready for you!"
   - **Below Threshold:** "The [City] [Genre] scene needs [X] more artists to become active. The nearest active [Genre] scene is in [Nearest City]. Would you like to join [Nearest City] for now or help start the [Your City] scene?"
9. **User confirms community choice**
10. **Artist registration question:** "Would you like to register as an artist in this scene?"
11. **User proceeds directly to their home scene**

## API Endpoints

### GET /onboarding/super-genres
**Purpose:** Returns the complete list of super genres for autocomplete

**Response:**
```json
{
  "super_genres": [
    {
      "id": "hip-hop",
      "name": "Hip Hop",
      "aliases": ["rap", "hip hop", "hiphop"],
      "category": "urban"
    },
    {
      "id": "hardcore-punk",
      "name": "Hardcore Punk",
      "aliases": ["hardcore", "hc punk"],
      "category": "punk"
    }
  ]
}
```

### POST /onboarding/validate-community
**Purpose:** Checks if requested community meets threshold, suggests alternatives

**Request:**
```json
{
  "genre": "hardcore-punk",
  "city": "Austin",
  "state": "Texas",
  "gps_coordinates": {
    "latitude": 30.2672,
    "longitude": -97.7431
  }
}
```

**Response (Community Active):**
```json
{
  "status": "active",
  "community": {
    "id": "austin-tx-hardcore-punk",
    "name": "Austin Hardcore Punk",
    "artist_count": 12,
    "listener_count": 45
  },
  "message": "Great! The Austin Hardcore Punk scene is active and ready for you!"
}
```

**Response (Below Threshold):**
```json
{
  "status": "below_threshold",
  "current_song_count": 8,
  "required_song_count": 15,
  "current_artist_count": 3,
  "message": "You're a revolutionary for the Austin Hardcore Punk scene! Help us reach 15 songs to activate RaDIYo broadcasting.",
  "progress_message": "Only 7 more songs needed to make history in Austin!",
  "pioneer_status": true,
  "activity_points_bonus": 50,
  "alternatives": [
    {
      "community_id": "dallas-tx-hardcore-punk",
      "name": "Dallas Hardcore Punk",
      "distance_miles": 195,
      "song_count": 24,
      "status": "active"
    }
  ],
  "can_join_waitlist": true,
  "mobilization_tools": {
    "invite_link": "uprise://invite/austin-tx-hardcore-punk",
    "share_message": "Help me activate the Austin Hardcore Punk scene on UPRISE!"
  }
}
```

### POST /users/onboarding
**Purpose:** Finalizes user onboarding with confirmed community

**Request:**
```json
{
  "community_id": "austin-tx-hardcore-punk",
  "is_artist": true,
  "gps_verified": true,
  "fallback_community": null
}
```

### GET /communities/cities-autocomplete
**Purpose:** Provides city/state autocomplete suggestions

**Query:** `?q=aust`

**Response:**
```json
{
  "cities": [
    {
      "city": "Austin",
      "state": "Texas",
      "full_name": "Austin, Texas"
    },
    {
      "city": "Austin",
      "state": "Minnesota", 
      "full_name": "Austin, Minnesota"
    }
  ]
}
```

## Super Genres List (200+ Condensed to Key Categories)

### Hip Hop & Urban
- Hip Hop
- Trap
- Drill
- Boom Bap
- Conscious Rap
- Mumble Rap
- UK Drill
- Afro Hip Hop

### Rock & Alternative
- Classic Rock
- Indie Rock
- Alternative Rock
- Garage Rock
- Psychedelic Rock
- Progressive Rock
- Art Rock
- Post Rock

### Punk (Deeper Subgenres)
- Hardcore Punk
- Pop Punk
- Ska Punk
- Crust Punk
- Anarcho Punk
- Street Punk
- Horror Punk
- Folk Punk
- Post Punk
- Punk Rock

### Metal (Deeper Subgenres)
- Death Metal
- Black Metal
- Thrash Metal
- Heavy Metal
- Doom Metal
- Power Metal
- Progressive Metal
- Metalcore
- Deathcore
- Blackened Death Metal
- Symphonic Metal
- Folk Metal

### Electronic (Deeper Subgenres)
- House
- Techno
- Trance
- Drum & Bass
- Dubstep
- Ambient
- IDM
- Breakbeat
- UK Garage
- Future Bass
- Hardstyle
- Minimal Techno
- Deep House
- Tech House
- Progressive House
- Acid House

### Pop & Mainstream
- Pop
- Indie Pop
- Synth Pop
- Dream Pop
- K-Pop
- J-Pop
- Electropop
- Dance Pop

### R&B & Soul
- R&B
- Neo Soul
- Classic Soul
- Funk
- Contemporary R&B
- Gospel

### Country & Folk
- Country
- Folk
- Americana
- Bluegrass
- Indie Folk
- Alt Country
- Outlaw Country

### Jazz & Blues
- Jazz
- Blues
- Smooth Jazz
- Bebop
- Fusion
- Chicago Blues
- Delta Blues

### Latin & World
- Reggaeton
- Salsa
- Bachata
- Regional Mexican
- Bossa Nova
- Cumbia
- Merengue
- Latin Trap

### Reggae & Caribbean
- Reggae
- Dancehall
- Dub
- Ska
- Rocksteady

### African & Afrobeat
- Afrobeat
- Afrohouse
- Amapiano
- Highlife
- Soukous

### Experimental & Avant-garde
- Experimental
- Noise
- Industrial
- Dark Ambient
- Drone
- Musique Concrète

### Classical & Orchestral
- Classical
- Orchestral
- Chamber Music
- Opera
- Contemporary Classical

## Community Threshold Rules

### Song Threshold: 15 total songs minimum (5 artists × 3 songs = ~1 hour of radio)
- **Below threshold:** Community in "incubation" mode
- **At threshold:** Community becomes "active" and RaDIYo broadcasting begins
- **Above threshold:** Community fully operational

### Pioneer Recognition & Gamification
- **Pioneer Artists & Listeners:** First users in incubating scenes receive special "Revolutionary" status
- **Activity Points System:** 
  - Initial pioneer bonus upon joining incubating scene
  - Ongoing bonuses for each new member recruited to the scene
  - Special milestone bonuses when scene reaches activation
- **Inspiring Messages:** 
  - "You're a revolutionary for the [City] [Genre] scene! Help us reach 15 songs to activate RaDIYo broadcasting."
  - "Only [X] more songs needed to make history in [City]!"
- **Mobilization Features:** Special tools to invite others and track scene-building progress

### Scene Activation Celebrations
- **Personal Notifications:** "You made history!" messages sent to all pioneers' inboxes
- **Statewide Announcement:** New scene births announced on statewide community feeds
- **Celebration Message:** "A new [Genre] UPRISE has been born in [City]! Welcome to the revolution!"

### Listener Access
- Can listen to any active community
- Can only vote in their GPS-verified home scene
- Receive suggestions for nearest active communities
- Pioneers get early access to incubating scenes

### Sub-genre Splintering
- When 15+ songs from artists sharing the same sub-genre tags exist in a community
- System suggests creating new dedicated super-genre community
- Original community maintains broader category
- Sub-genre pioneers also receive Revolutionary status

## Technical Implementation Notes

### GPS Verification
- Required for voting rights only
- Optional for basic listening access
- Stored securely for community validation

### Database Schema Considerations
```sql
communities (
  id, 
  super_genre, 
  city, 
  state, 
  status, -- 'incubating', 'active'
  artist_count,
  listener_count,
  created_at
)

genre_suggestions (
  id,
  super_genre_name,
  aliases, -- JSON array of alternative names
  category,
  popularity_rank
)
```

### Fallback Behavior
- If no communities exist for a genre in entire state, suggest creating first one
- Track "pioneer artists" who start new scenes
- Send notifications when communities reach activation threshold
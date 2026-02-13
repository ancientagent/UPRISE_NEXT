# System Overview
(Add high-level components, data flows, and service boundaries here.)

## Phase 2: July Model Consolidation
- Artist/Band unification: canonical identity across Auth, Catalog, UI
- Location filtering: PostGIS-backed communities and API filters
- Radio/Community unification: one entity, different projections
- Genre upgrade: taxonomy + tagging across discovery/promotions

### Unified Domain Model (Phase 2)
- Identity
  - `User` authenticates; may own one or more `ArtistProfile` records.
  - `Band` is a group entity with `BandMembers` that reference `ArtistProfile` or `User`.
  - Canonical performer identifier: `artist_canonical_id` used by Songs, Events, Promotions.
- Community
  - Community key: `city-state-genre` (e.g., `austin-texas-hip-hop`).
  - Radio is a view over Community queues (RaDIYo = community rotation projection).
- Genre
  - Hierarchical taxonomy (parent/child) + freeform tags.
  - Primary `genre_id` per song, optional `genre_tags[]` for discovery/promotions.
- Location
  - PostGIS coordinates for Users, Artists/Bands, Songs, and Events.
  - City/state lookup tables provide stable keys; queries use geofences and centroids.

### Cross‑Module Contracts
- Authentication → Identity/Profiles
  - Login issues tokens bound to `user_id`; profile switching exposes `artist_canonical_id`.
  - Roles include Artist, Band Admin, Venue, Promoter, Business, Admin.
- Community/Radio → API
  - Standard query params: `city`, `state`, `genre`, `lat`, `lng`, `radius`, `community_key`.
  - Radio endpoints accept `community_key` and return tiered queues.
- Discovery/Map → Data
  - Map layers: community centroids, activity heat, events, promoted songs.
  - Filters: location radius + genre taxonomy.
- Promotions/Events → Targeting
  - Targeting predicates include `genre_id`, `genre_tags[]`, `community_key`, and `ST_Contains(geom, point)`.

## Legacy Notes
- Station Community System Analysis (imported)
\n---\n\n## Imported from 01_UPRISE_Master_Overview.md
# UPRISE Platform - Master Overview & System Integration Map

## 📋 **DOCUMENT STRUCTURE & ORGANIZATION**

This overview document maps the complete UPRISE platform architecture across 9 detailed technical specifications. Each document contains comprehensive implementation details, user flows, testing requirements, and success metrics.

---

## 🏗️ **COMPLETE SYSTEM ARCHITECTURE**

### **Platform Development Priorities**
- **🖥️ WebApp-First**: Business tools, complex dashboards, professional workflows
- **📱 Mobile-First**: Consumer discovery, listening, basic social features  
- **🔄 Cross-Platform**: Core functionality optimized for both platforms

---

## 📚 **SYSTEM SPECIFICATIONS INDEX**

### **1. Master Skeleton Framework**
**Purpose**: High-level platform architecture and system relationships  
**Platform**: Cross-Platform Planning Document  
**Key Components**:
- Complete platform overview
- User role definitions (8 user types)
- System integration architecture
- Development phases and priorities

**Integration Points**: Foundation for all other systems

---

### **2. Authentication & User Management**
**Purpose**: User accounts, roles, permissions, and security  
**Platform**: Cross-Platform (WebApp management, Mobile access)  
**Key Components**:
- Multi-role authentication (Listeners, Artists, Venues, Promoters, Business Partners, Labels, Mixologists, Ambassadors)
- Community-based verification
- Security and fraud prevention
- Home scene assignment

**Integration Points**:
- **→ Community System**: User community assignment and verification
- **→ All Systems**: User identity and permissions foundation

---

### **3. Community & Location System**
**Purpose**: Geographic + genre-based community infrastructure  
**Platform**: Cross-Platform  
**Key Components**:
- City + State + Genre community structure
- GPS verification and location services
- Community statistics and activity tracking
- Real-time data synchronization

**Integration Points**:
- **→ Authentication**: Community assignment and verification
- **→ Fair Play Algorithm**: Community-based music rotation
- **→ Discovery**: Geographic music exploration
- **→ Events**: Community event promotion
- **→ Business Features**: Local business targeting
- **→ Phase 2**: Service provider geographic coverage

---

### **4. Fair Play Algorithm & RaDIYo System**
**Purpose**: Democratic music rotation and community radio streaming  
**Platform**: Cross-Platform (WebApp management, Mobile consumption)  
**Key Components**:
- Democratic voting-based music rotation
- Anti-gaming and fraud prevention
- Community radio streaming (RaDIYo)
- Real-time algorithm optimization

**Integration Points**:
- **→ Community System**: Community-specific music rotation
- **→ Song Management**: Song intake and processing
- **→ Discovery**: Algorithm-driven recommendations
- **→ Events**: Event impact on song promotion
- **→ Phase 2 Mixologist**: Professional curation integration

---

### **5. Song Management & Upload System**
**Purpose**: Music content creation, processing, and management  
**Platform**: WebApp-First (Complex management tools)  
**Key Components**:
- Professional audio processing pipeline
- Comprehensive metadata management
- Multi-tier storage and CDN distribution
- Artist portfolio integration

**Integration Points**:
- **→ Fair Play Algorithm**: Processed songs feeding rotation system
- **→ Community System**: Automatic community assignment
- **→ Discovery**: Content for recommendation system
- **→ Events**: Artist music for event promotion
- **→ Business Features**: Sponsored content opportunities

---

### **6. Discovery & Map View System**
**Purpose**: Music and community exploration interface  
**Platform**: Cross-Platform (Advanced features WebApp-First)  
**Key Components**:
- Interactive community map with activity visualization
- AI-powered music recommendations
- Advanced search and filtering
- Personalized discovery feeds

**Integration Points**:
- **→ Community System**: Geographic community visualization
- **→ Fair Play Algorithm**: Trending content integration
- **→ Song Management**: Music content discovery
- **→ Events**: Event discovery and promotion
- **→ Business Features**: Native advertising integration
- **→ Phase 2**: Mixologist and Ambassador service discovery

---

### **7. Events System**
**Purpose**: Live event creation, promotion, and management  
**Platform**: WebApp-First (Event management), Mobile-First (Discovery/booking)  
**Key Components**:
- Complete event lifecycle management
- Venue partnership network
- Integrated ticketing and payment processing
- Event discovery and recommendation

**Integration Points**:
- **→ Community System**: Community-based event promotion
- **→ Authentication**: Artist, venue, and attendee management
- **→ Discovery**: Event recommendation integration
- **→ Song Management**: Artist portfolio for event promotion
- **→ Business Features**: Event sponsorship and partnerships
- **→ Phase 2**: Ambassador services for event logistics

---

### **8. Promotions & Business Features**
**Purpose**: Revenue generation through advertising and partnerships  
**Platform**: WebApp-First (Business tools), Cross-Platform (Ad delivery)  
**Key Components**:
- Self-service advertising platform
- Local business partnership programs
- Dynamic pricing and revenue optimization
- Advanced business analytics

**Integration Points**:
- **→ Community System**: Geographic targeting and local partnerships
- **→ Discovery**: Native advertising integration
- **→ Events**: Event sponsorship opportunities
- **→ Authentication**: Business account management
- **→ All Systems**: Revenue optimization across platform

---

### **9. Phase 2 Features** (Mixologist + Ambassador Systems)
**Purpose**: Professional tools and local service provider network  
**Platform**: WebApp-First (Professional tools), Mobile-First (Consumer booking)  

#### **9A. Mixologist System**
**Key Components**:
- Professional DJ and music curation tools
- Community radio programming
- Advanced playlist management
- Monetization for music professionals

#### **9B. Ambassador System**
**Key Components**:
- Local service provider network (lodging, equipment, transportation, food, professional services)
- Service booking and management
- Quality control and rating system
- Revenue sharing model

**Integration Points**:
- **→ Community System**: Geographic service coverage
- **→ Events**: Service integration with event planning
- **→ Discovery**: Service and mixologist content discovery
- **→ Business Features**: Professional monetization tools
- **→ Authentication**: Professional verification systems

---

## 🔗 **CRITICAL SYSTEM INTEGRATION FLOWS**

### **User Journey Integration**
1. **Authentication** → **Community Assignment** → **Discovery/RaDIYo** → **Events** → **Phase 2 Services**
2. **Song Upload** → **Fair Play Algorithm** → **Community Rotation** → **Discovery Recommendations**
3. **Business Partnership** → **Community Targeting** → **Event Sponsorship** → **Revenue Generation**

### **Data Flow Integration**
- **Community Statistics** flow to **Discovery Algorithm** and **Business Analytics**
- **Fair Play Performance** influences **Song Promotion** and **Artist Revenue**
- **Event Attendance** impacts **Community Activity** and **Business Partnerships**
- **User Behavior** drives **Personalization** across all systems

### **Revenue Integration**
- **Subscription Revenue** (Authentication + Discovery)
- **Event Revenue** (Events + Community promotion)
- **Advertising Revenue** (Business Features + All systems)
- **Service Revenue** (Phase 2 Ambassador network)
- **Professional Tools Revenue** (Phase 2 Mixologist system)

---

## 📱 **PLATFORM DEVELOPMENT STRATEGY**

### **WebApp-First Development Priority**
- Authentication & User Management (Business accounts)
- Song Management & Upload (Professional tools)
- Events System (Event creation and management)
- Promotions & Business Features (Advertising platforms)
- Phase 2 Professional Tools (Mixologist and Ambassador management)

### **Mobile-First Development Priority**
- Discovery & Map View (Consumer exploration)
- Fair Play Algorithm (Music consumption)
- Events System (Event discovery and booking)
- Phase 2 Consumer Tools (Service booking)

### **Cross-Platform Development**
- Community & Location System
- Authentication (Consumer accounts)
- Basic analytics and social features

---

## 🎯 **BUSINESS MODEL INTEGRATION**

### **Revenue Streams**
1. **Subscription Revenue**: Premium discovery and community access
2. **Advertising Revenue**: Local and national business partnerships
3. **Event Revenue**: Ticketing commissions and venue partnerships
4. **Service Revenue**: Ambassador network commissions
5. **Professional Tools**: Mixologist platform revenue sharing

### **Value Propositions**
- **Users**: Democratic music discovery + local community connection
- **Artists**: Fair exposure + multiple monetization streams
- **Businesses**: Targeted music community marketing
- **Venues**: Integrated event management and promotion
- **Service Providers**: Professional network and booking platform

---

## 📊 **SUCCESS METRICS INTEGRATION**

### **Platform Health Metrics**
- User engagement across all systems
- Community activity and growth
- Revenue diversification and growth
- Content quality and creator satisfaction

### **Business Performance Metrics**
- Cross-system conversion rates
- Revenue per user across all streams
- Partner satisfaction and retention
- Market penetration and competitive position

---

*This overview document provides the structural foundation for understanding how all 9 detailed system specifications integrate to create the complete UPRISE platform ecosystem.*\n---\n\n## Station Community System Analysis (Legacy)
# 🔍 **UPRISE Station/Community Assignment System - Archaeological Report**

## **📋 Executive Summary**

The UPRISE platform has evolved from a simple city-based preference system to a complex multi-tiered station assignment system. The developers incorrectly referred to "communities" as "stations" throughout the codebase, creating a hybrid system that combines geographic location with genre preferences to create "home scenes."

**Key Finding**: The system uses "stations" to represent geographic communities, with three hierarchical levels (City/State/National) combined with genre preferences to create user communities.

---

## **📁 Files Containing Relevant Logic**

### **🗄️ Database Models & Migrations**
- `Webapp_API-Develop/src/database/models/userstationprefrence.js` - Current station preference model
- `Webapp_API-Develop/src/database/models/usercityprefrences.js` - Legacy city preference model (deprecated)
- `Webapp_API-Develop/src/database/migrations/20221122120713-create-user-station-prefrence.js` - Migration creating station system
- `Webapp_API-Develop/src/database/migrations/20220613163033-create-user-city-prefrences.js` - Original city preference migration
- `Webapp_API-Develop/src/database/migrations/20220723061351-add_state_to_userCityPrefrences.js` - State addition to legacy system

### **🏗️ Core System Files**
- `Webapp_API-Develop/src/utils/homeSceneManager.js` - Modern home scene management system
- `Webapp_API-Develop/src/utils/fairPlayAlgorithm.js` - Community-based priority algorithm
- `Webapp_API-Develop/src/utils/songQueue.js` - Station-based song queue logic
- `Webapp_API-Develop/src/utils/userInfo.js` - User station preference utilities

### **🔌 API Routes**
- `Webapp_API-Develop/src/routes/user.js` - Station switching logic (lines 424-520)
- `Webapp_API-Develop/src/routes/auth.js` - User location/station assignment (lines 1285-1364)
- `Webapp_API-Develop/src/routes/votes.js` - Home scene verification for voting
- `Webapp_API-Develop/src/routes/statistics.js` - Station-based statistics

### **📱 Frontend Components**
- `src/screens/userLocation/userLocation.js` - Scene creation interface
- `src/screens/RadioPreferences/RadioPreferences.js` - Station switching interface
- `src/services/stationSwitching/stationSwitching.service.js` - Station switching API calls

---

## **🧬 System Evolution & Legacy Code**

### **Phase 1: Simple City Preferences (Legacy)**

**Commented-out code from `user.js` (lines 390-422):**
```javascript
// const userPrefrence =  await UserCityPrefrences.findOne({
//     where :{
//         userId:req.user.id
//     }
// });
// if(!userPrefrence ) throw new Error('User not found');
//         const previousState = userPrefrence.state;
//         const updatedState = await  userPrefrence.update({city,state},{
//             where:{
//                 userId: userPrefrence.userId
//             }
//         });
//         if(previousState !== updatedState.state){
//             await UserRadioQueue.destroy({
//                 where:{
//                     userId:userPrefrence.userId 
//                 }
//             });
//         }
```

**Database Schema (Legacy):**
```sql
CREATE TABLE UserCityPrefrences (
    id INTEGER PRIMARY KEY,
    userId INTEGER,
    city STRING,
    state STRING,  -- Added later via migration 20220723061351
    createdAt DATE,
    updatedAt DATE
);
```

### **Phase 2: Station-Based System (Current)**

**From `userstationprefrence.js`:**
```javascript
UserStationPrefrence.init({
    userId: { type: DataTypes.INTEGER },
    stationPrefrence: { type: DataTypes.STRING },
    stationType: {
        type: DataTypes.ENUM,
        values: ['1','2','3'], // 1=City, 2=State, 3=National
        defaultValue: '1'
    },
    active: { type: DataTypes.BOOLEAN }
});
```

### **Phase 3: Home Scene System (Modern)**

**From `homeSceneManager.js`:**
```javascript
generateSceneKey(city, state, genre) {
    return `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase().replace(/\s+/g, '-')}-${genre.toLowerCase().replace(/\s+/g, '-')}`;
}

// Formula: ${city}, ${state} ${genre} (e.g., "Austin, Texas Hip Hop")
```

---

## **🎯 Key Code Snippets - Station Assignment Logic**

### **1. User Location Assignment (auth.js lines 1285-1364)**
```javascript
// 3. Create Default Station Preference
console.log('3. Creating default station preference...');
const defaultStationPref = await UserStationPrefrence.create({
    userId,
    stationPrefrence: city || 'CITYWIDE', // Use actual city name
    stationType: '1',  // '1' = CITYWIDE, '2' = STATEWIDE, '3' = NATIONAL
    active: true,
});
console.log('Default station preference created:', defaultStationPref.id, 'with preference:', city || 'CITYWIDE');
```

### **2. Station Switching Logic (user.js lines 424-520)**
```javascript
let userPrefrence = await UserStationPrefrence.findOne({
    where: {
        userId: req.user.id,
        stationType
    }
});

if(userPrefrence) {
    await userPrefrence.update({
        stationPrefrence,
        active: true
    });
    
    // Deactivate other station types
    let stationPrefrences = await UserStationPrefrence.findAll({
        where: {
            userId: req.user.id,
            [Op.not]: { stationType }
        }
    });
    
    stationPrefrences.map(async (stationPrefrence) => {
        await stationPrefrence.update({
            active: false
        });
    });
    
    // Clear user's radio queue when switching stations
    await UserRadioQueue.destroy({
        where: { userId: userPrefrence.userId }
    });
}
```

### **3. Song Queue Based on Station (songQueue.js)**
```javascript
const userStationType = await UserStationPrefrence.findOne({
    where: { userId, active: true }
});

if(!userStationType) throw new Error('Invalid station prefrence');

let query;
if (userStationType.stationType === '1') {
    // CITYWIDE
    query = `lower(s."cityName") = lower('${station}')
             and s."deletedAt" is null and s.live = true and
             s."promotedSong" = 'CITY' and b.status='ACTIVE'`;
} else if(userStationType.stationType === '2') {
    // STATEWIDE  
    query = `lower(s."stateName") = lower('${station}')
             and s."deletedAt" is null and s.live = true
             and b.status='ACTIVE' and s."promotedSong" = 'STATE'`;
} else {
    // NATIONAL
    query = `s."deletedAt" is null and s.live = true
             and b.status='ACTIVE' and s."promotedSong" = 'NATIONAL'`;
}
```

### **4. Community Size Calculation (fairPlayAlgorithm.js)**
```javascript
async getCommunitySize(tier) {
    const query = `
        SELECT COUNT(DISTINCT u.id) as community_size
        FROM "Users" u
        JOIN "UserStationPrefrences" usp ON u.id = usp."userId"
        WHERE usp.active = true
        ${tier === 'CITYWIDE' ? 'AND usp."stationType" = \'1\'' : ''}
        ${tier === 'STATEWIDE' ? 'AND usp."stationType" = \'2\'' : ''}
        ${tier === 'NATIONAL' ? 'AND usp."stationType" = \'3\'' : ''}
    `;
    
    const result = await runQuery(query, { type: QueryTypes.SELECT });
    return result[0]?.community_size || 0;
}
```

### **5. Home Scene Verification (votes.js)**
```javascript
async function verifyHomeSceneLocation(userId, location) {
    try {
        // Get user's station preference to determine home scene
        const userStationPref = await UserStationPrefrence.findOne({
            where: {
                userId,
                active: true
            }
        });

        if (!userStationPref) {
            return false;
        }

        // In a real implementation, you would:
        // 1. Geocode the GPS coordinates to get city/state
        // 2. Compare with user's registered home scene
        // 3. Check if the location is within acceptable radius
        
        // For now, we'll do a basic check
        return true;
    } catch (error) {
        console.error('Error verifying home scene location:', error);
        return false;
    }
}
```

---

## **⚙️ How The System Works**

### **1. User Onboarding Flow**
1. **Location Selection**: User selects city/state via Google Places API (`src/screens/userLocation/userLocation.js`)
2. **Genre Selection**: User chooses music genre preferences  
3. **Station Assignment**: System automatically creates default station preference:
   - `stationType: '1'` (CITYWIDE)
   - `stationPrefrence: [city name]`
   - `active: true`
4. **onBoardingStatus Update**: Set to `2` (completed)

### **2. Station Types & Hierarchy**
```
Station Type 1: CITYWIDE (Default)
├── Songs with promotedSong = 'CITY'
├── Geographic filter: cityName = user's city
├── Community: Users in same city + genre
└── Tier progression threshold: 10 upvotes → STATE

Station Type 2: STATEWIDE  
├── Songs with promotedSong = 'STATE'
├── Geographic filter: stateName = user's state
├── Community: Users in same state + genre
└── Tier progression threshold: 50 upvotes → NATIONAL

Station Type 3: NATIONAL
├── Songs with promotedSong = 'NATIONAL'
├── No geographic filter
├── Community: All users + genre
└── No tier progression (highest level)
```

### **3. Community Assignment Logic**
```javascript
// HOME SCENE FORMULA
sceneKey = `${city}-${state}-${genre}`
// Example: "austin-texas-punk"

// COMMUNITY MEMBERSHIP CRITERIA:
// - User's registered city/state (from onboarding)
// - User's genre preferences (can be multiple)
// - Station type preference (City/State/National)
// - GPS verification for voting/engagement (within 50-mile radius)
```

### **4. Song Priority & Fair Play Algorithm**
- **Time-based Priority**: New songs get initial exposure based on upload time
- **Community Threshold**: After 15-35% of community hears song 2-3 times, switches to community-based priority
- **Community-based Priority**: Engagement (likes/dislikes/listens/skips) determines rotation frequency
- **Tier Progression**: Songs can promote from City → State → National based on upvotes
- **Anti-Manipulation**: GPS verification, activity analysis, reporting system

---

## **🏛️ Database Schema Evolution**

### **Legacy Schema (UserCityPrefrences) - DEPRECATED**
```sql
-- Original (from migration 20220613163033)
UserCityPrefrences: 
  id INTEGER PRIMARY KEY,
  userId INTEGER,
  city STRING

-- After migration 20220723061351 (add state)
UserCityPrefrences: 
  id INTEGER PRIMARY KEY,
  userId INTEGER,
  city STRING,
  state STRING
```

### **Current Schema (UserStationPrefrence)**
```sql
-- From migration 20221122120713
UserStationPrefrences: 
  id INTEGER PRIMARY KEY,
  userId INTEGER,
  stationPrefrence STRING,  -- City/State name or 'USA' for national
  stationType ENUM('1','2','3'),  -- 1=City, 2=State, 3=National  
  active BOOLEAN,
  createdAt DATE,
  updatedAt DATE
```

### **Related Tables**
```sql
-- User preferences and location
UserGenrePrefrences: userId, genreId
Locations: userId, city, state, country, zipcode, latitude, longitude

-- Song management and priority
SongPriority: songId, tier, timeBasedPriority, communityPriority, finalPriority
Songs: promotedSong ENUM('CITY','STATE','NATIONAL'), cityName, stateName

-- User engagement
UserRadioQueue: userId, songId (cleared when switching stations)
UserSongListens: userId, songId (tracks listening history)
Votes: userId, songId, tier, type (UPVOTE for tier progression)
```

---

## **🔍 Key Findings**

### **1. Terminology Confusion**
- **"Stations"** = Geographic communities (City/State/National radio stations)
- **"Communities"** = Actual user groups within stations based on shared location + genre
- **"Scenes"** = City + State + Genre combinations (e.g., "Austin, Texas Punk")
- **"Home Scene"** = User's primary geographic and genre-based community

### **2. Legacy System Remnants**
- `UserCityPrefrences` model still exists but is **DEPRECATED**
- Commented-out code in `user.js` lines 390-422 shows old radio preference logic
- Migration files show clear evolution from simple city preferences to complex station system
- Legacy references in `userInfo.js` line 1: `// const { UserCityPrefrences} = require('../database/models/');`

### **3. Modern System Architecture**
- **HomeSceneManager**: Manages scene creation, verification, and community statistics
- **FairPlayAlgorithm**: Community-based song prioritization with anti-manipulation features
- **Station Types**: Three-tier geographic hierarchy with different engagement thresholds
- **GPS Verification**: Location-based restrictions for voting and song engagement
- **Automatic Queue Management**: Radio queue cleared when users switch stations

### **4. Assignment Process Flow**
1. **User Registration**: Basic account creation
2. **Location Onboarding**: City/state selection via Google Places API
3. **Genre Selection**: Music preference selection from available genres
4. **Default Station Creation**: Automatic CITYWIDE station preference
5. **Community Membership**: Based on location + genre intersection
6. **Station Switching**: Manual user control between City/State/National levels
7. **Queue Reset**: Radio queue cleared on station changes to ensure relevant content

### **5. Community Engagement Rules**
- **Voting Rights**: Only in user's verified home scene (GPS-based)
- **Song Engagement**: Likes/dislikes restricted to home scene (except NATIONAL tier)
- **Tier Progression**: Songs advance based on upvote thresholds within communities
- **Fair Play**: Anti-manipulation measures prevent artificial song promotion

---

## **🚨 Important Implementation Notes**

### **Critical Database Relationships**
```javascript
// A user can have multiple station preferences but only one active
UserStationPrefrence.findOne({ where: { userId, active: true } })

// Genre preferences are separate and can be multiple per user
UserGenrePrefrences.findAll({ where: { userId } })

// Songs are geographically tagged and tier-specific
Songs.findAll({ where: { promotedSong: 'CITY', cityName: userCity } })
```

### **Environment Variables Required**
```bash
# For onboarding location selection
MAP_API_KEY=AIzaSyDevelopmentKeyForPlacesAPI

# API endpoints for station management
STATION_SWITCHING=/user/station_switching
USER_LOCATION=/auth/user-location
```

### **Key Business Logic**
1. **One Active Station**: Users can only have one active station preference at a time
2. **Geographic Filtering**: Songs are filtered by user's station type and geographic preference
3. **Queue Management**: Switching stations clears the user's radio queue to prevent irrelevant content
4. **Scene Verification**: Voting and engagement require GPS verification within home scene
5. **Tier Progression**: Songs naturally progress from local to broader audiences based on community engagement

---

## **🔧 Development Considerations**

### **When Working with Communities/Stations:**
1. Always check for active station preference: `active: true`
2. Clear radio queue when changing station preferences
3. Verify GPS location for engagement actions (voting, liking)
4. Use proper tier filtering: CITY/STATE/NATIONAL
5. Consider genre preferences in all community calculations

### **Future Enhancement Opportunities:**
1. Implement proper GPS distance calculation for home scene verification
2. Create dedicated HomeScenes table instead of deriving from UserStationPrefrence
3. Add community analytics and scene health metrics
4. Implement cross-scene collaboration features
5. Add geographic boundaries and scene overlap handling

---

## **📚 Related Documentation**
- `PROJECT-STRUCTURE.md` - Overall project structure and key files
- `QUICK-FIXES.md` - Common issues and solutions
- `UPRISE_FAIR_PLAY_IMPLEMENTATION.md` - Detailed Fair Play Algorithm documentation
- `README-Scripts.md` - Development workflow and scripts

---

**Last Updated**: December 2024  
**Analysis Type**: Archaeological Code Review  
**System Status**: Active Development with Legacy Components 

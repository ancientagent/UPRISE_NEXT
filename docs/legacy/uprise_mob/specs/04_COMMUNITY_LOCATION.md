# UPRISE Community & Location System - Detailed Technical Specification

> Phase 2 Migration Note (Alpha Update)
> - Onboarding classification now uses Direct Sub‑Genres. See specs/GENRE_SYSTEM_ALPHA.md.
> - Community key for alpha flows: city-state-sub-genre-id (e.g., austin-texas-hardcore-punk).
> - Families/Alliances are deprecated for Alpha; legacy references remain for archival context only.
> - When sending filters, prefer `community_key`; `genre` may be used as a fallback.

## Phase 2 Alignment: Location Filters, PostGIS, API Params
- Standard API params for geo queries: `city`, `state`, `genre`, `community_key`, `lat`, `lng`, `radius`.
- Community key format: `city-state-genre` (normalized, lowercase, dash-separated).
- PostGIS is the source of truth for spatial filtering; DB is PostgreSQL on port 5433.
- Indexing: `USING GIST` on geography columns (e.g., `geom geography(POINT, 4326)`).
- Example queries:
  - Containment: `SELECT * FROM songs WHERE ST_Contains(city_geom, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography);`
  - Radius: `... WHERE ST_DWithin(artist_geom, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography, $radius_meters);`
- API response contracts include `community_key`, `genre_id`, and `location` (lat/lng) for clients to keep filters in sync.
- Anti-fraud: GPS verification hooks on vote/engagement endpoints must validate that point lies within the user’s home scene boundary.

## 🎯 **MODULE OVERVIEW**

Standard Parameters: see `docs/specs/_fragments/params.geo-genre.md` for `city,state,genre,lat,lng,radius,community_key`.

### **Purpose**
Creates the geographic + genre-based community system that is the foundation of UPRISE's local-to-national music discovery model. Fixes the critical issue where communities are currently only genre-based.

### **Critical Issues Fixed**
- ❌ **Current**: Communities only segregated by genre (no location component)
- ✅ **Target**: City + State + Genre communities ("Austin, Texas Hip Hop")
- ❌ **Current**: No geographic verification for voting integrity
- ✅ **Target**: GPS-based location verification for all community engagement
- ❌ **Current**: No community-based Fair Play Algorithm support
- ✅ **Target**: Community statistics and activity tracking for algorithm

### **Dependencies**
- **Required**: Authentication & User Management System
- **Integrates With**: Fair Play Algorithm, Discovery System, Events, All User Interactions

---

## 🏗️ **SYSTEM ARCHITECTURE**

### **Core Components**
```
Community & Location System
├── 🌍 Geographic Engine
│   ├── GPS Verification Service
│   ├── Location Boundary Management
│   ├── City/State Database Integration
│   └── Anti-Fraud Detection
│
├── 🏘️ Community Management
│   ├── Home Scene Creation & Assignment
│   ├── Community Statistics Tracking
│   ├── Activity Score Calculation
│   └── Community Health Monitoring
│
├── 🎵 Genre Integration
│   ├── Genre Database Management
│   ├── Custom Genre Request System
│   ├── Genre-Community Mapping
│   └── Cross-Genre Discovery
│
├── 📊 Community Analytics
│   ├── Real-time Statistics
│   ├── Activity Score Tracking
│   ├── Member Count Management
│   └── Trend Detection
│
└── 🔗 Integration Layer
    ├── Authentication System Connector
    ├── Fair Play Algorithm Data Provider
    ├── Discovery System Data Provider
    └── Map View Data Provider
```

---

## 🌍 **GEOGRAPHIC SYSTEM ARCHITECTURE**

### **Location Hierarchy**
```
Geographic Structure:
├── COUNTRY (USA)
│   ├── STATE (Texas)
│   │   ├── CITY (Austin)
│   │   │   ├── GENRE (Hip Hop)
│   │   │   │   └── COMMUNITY: "Austin, Texas Hip Hop"
│   │   │   ├── GENRE (Punk)
│   │   │   │   └── COMMUNITY: "Austin, Texas Punk"
│   │   │   └── GENRE (Country)
│   │   │       └── COMMUNITY: "Austin, Texas Country"
│   │   ├── CITY (Dallas)
│   │   └── CITY (Houston)
│   ├── STATE (California)
│   └── STATE (New York)
```

### **Community Key Generation**
```javascript
// Community Identifier System
const generateCommunityKey = (city, state, genre) => {
  // Normalize inputs
  const normalizedCity = city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const normalizedState = state.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const normalizedGenre = genre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return `${normalizedCity}-${normalizedState}-${normalizedGenre}`;
};

// Examples:
// "Austin, Texas Hip Hop" → "austin-texas-hip-hop"
// "New York City, New York Jazz" → "new-york-city-new-york-jazz"
// "Los Angeles, California Electronic" → "los-angeles-california-electronic"
```

### **Geographic Boundaries**
```javascript
const geographicBoundaries = {
  citywide: {
    radiusMiles: 25, // Default radius from city center
    method: 'POINT_RADIUS', // Point + radius circle
    fallback: 'COUNTY_BOUNDARIES', // If radius doesn't work
    verification: 'GPS_REQUIRED'
  },
  
  statewide: {
    method: 'STATE_BOUNDARIES', // Official state boundaries
    verification: 'GPS_PREFERRED', // GPS preferred but not required
    fallback: 'ZIP_CODE_VERIFICATION'
  },
  
  national: {
    method: 'COUNTRY_BOUNDARIES', // USA boundaries
    verification: 'ACCOUNT_BASED' // Based on account registration
  },
  
  // Special Cases
  specialCases: {
    washingtonDC: {
      treatAs: 'CITY_AND_STATE',
      radius: 30 // Larger radius for metro area
    },
    newYorkMetro: {
      includesCities: ['new-york-city', 'newark', 'jersey-city'],
      sharedCommunities: true
    }
  }
}
```

---

## 🏘️ **COMMUNITY SYSTEM DESIGN**

### **Community Structure**
```javascript
const CommunityStructure = {
  // Unique Identifier
  communityKey: 'austin-texas-hip-hop',
  
  // Geographic Data
  geographic: {
    cityName: 'Austin',
    stateName: 'Texas',
    countryName: 'United States',
    cityCenter: { latitude: 30.2672, longitude: -97.7431 },
    boundaryRadius: 25, // miles
    timeZone: 'America/Chicago'
  },
  
  // Genre Data
  genre: {
    genreId: 15,
    genreName: 'Hip Hop',
    parentGenre: 'Urban',
    subGenres: ['Trap', 'Conscious Rap', 'Southern Hip Hop']
  },
  
  // Community Statistics
  statistics: {
    memberCount: 1247,
    artistCount: 89,
    listenerCount: 1158,
    totalSongs: 267,
    activeSongs: 45, // Currently in rotation
    totalEvents: 23,
    upcomingEvents: 8,
    activityScore: 8942, // Cumulative activity points
    weeklyActivityScore: 342,
    averageEngagement: 0.67 // Percentage of members active weekly
  },
  
  // Tier System
  tiers: {
    citywide: {
      songCount: 45,
      recentUploads: 12, // This week
      averageUpvotes: 23,
      topSong: { songId: 5891, upvotes: 89 }
    },
    statewide: {
      promotedSongs: 3, // Songs that made it to state level
      averagePromotionTime: '3.2 weeks',
      stateRanking: 4 // Ranking among Texas Hip Hop communities
    },
    national: {
      nationalSongs: 1, // Songs that made it to national level
      nationalRanking: 127 // Ranking among all Hip Hop communities
    }
  },
  
  // Community Health
  health: {
    growthRate: 0.08, // 8% monthly growth
    retentionRate: 0.84, // 84% user retention
    engagementTrend: 'INCREASING',
    contentQuality: 'HIGH',
    moderationNeeded: false
  }
}
```

### **Community Creation Flow**
```javascript
const CommunityCreationFlow = {
  // Automatic Creation (Most Common)
  automatic: {
    trigger: 'USER_ONBOARDING',
    process: [
      'GPS_LOCATION_ACQUIRED',
      'CITY_STATE_DETERMINED',
      'GENRE_SELECTED',
      'CHECK_EXISTING_COMMUNITY',
      'CREATE_IF_NEW_OR_ASSIGN_IF_EXISTS'
    ],
    fallback: 'MANUAL_LOCATION_ENTRY'
  },
  
  // Manual Creation (Admin)
  manual: {
    trigger: 'ADMIN_ACTION',
    process: [
      'ADMIN_SPECIFIES_CITY_STATE_GENRE',
      'VALIDATE_GEOGRAPHIC_DATA',
      'CREATE_COMMUNITY_STRUCTURE',
      'SET_INITIAL_PARAMETERS',
      'ACTIVATE_COMMUNITY'
    ]
  },
  
  // User Request (New Genre in Existing City)
  userRequest: {
    trigger: 'USER_GENRE_REQUEST',
    process: [
      'USER_SUBMITS_GENRE_REQUEST',
      'VALIDATE_LOCATION_MATCH',
      'ADMIN_REVIEW_GENRE',
      'APPROVE_OR_MERGE_WITH_EXISTING',
      'CREATE_COMMUNITY_IF_APPROVED'
    ]
  }
}
```

---

## 🔍 **GPS VERIFICATION & LOCATION SERVICES**

### **GPS Verification System**
```javascript
const GPSVerificationSystem = {
  // Verification Levels
  verificationLevels: {
    STRICT: {
      accuracy: 50, // meters
      timeout: 15000, // 15 seconds
      retryAttempts: 3,
      fallback: 'REQUIRE_MANUAL_VERIFICATION',
      useCases: ['VOTING', 'SONG_UPLOAD', 'EVENT_CREATION']
    },
    
    MODERATE: {
      accuracy: 100, // meters
      timeout: 30000, // 30 seconds
      retryAttempts: 5,
      fallback: 'ALLOW_MANUAL_ENTRY',
      useCases: ['COMMUNITY_ASSIGNMENT', 'PROFILE_UPDATE']
    },
    
    LENIENT: {
      accuracy: 500, // meters
      timeout: 45000, // 45 seconds
      retryAttempts: 3,
      fallback: 'ZIP_CODE_VERIFICATION',
      useCases: ['DISCOVERY', 'GENERAL_ACCESS']
    }
  },
  
  // Anti-Fraud Measures
  fraudDetection: {
    velocityCheck: {
      maxSpeed: 500, // mph (to catch impossible movement)
      timeWindow: 300 // 5 minutes
    },
    
    locationSpoofing: {
      checks: [
        'KNOWN_SPOOF_COORDINATES',
        'REPEATED_EXACT_COORDINATES',
        'LOCATION_HISTORY_ANALYSIS',
        'DEVICE_SENSOR_CONSISTENCY'
      ],
      action: 'FLAG_FOR_REVIEW'
    },
    
    multipleAccounts: {
      detection: 'SAME_DEVICE_MULTIPLE_LOCATIONS',
      tolerance: 3, // accounts per device
      action: 'REQUIRE_ADDITIONAL_VERIFICATION'
    }
  },
  
  // Privacy Protection
  privacy: {
    dataRetention: '30_DAYS',
    precisionReduction: true, // Reduce precision for privacy
    userConsent: 'EXPLICIT_OPT_IN',
    dataEncryption: 'AES_256',
    anonymization: 'AFTER_30_DAYS'
  }
}
```

### **Location Resolution Process**
```javascript
const LocationResolutionProcess = {
  // Primary GPS Resolution
  gpsResolution: {
    1: 'REQUEST_GPS_PERMISSION',
    2: 'ACQUIRE_GPS_COORDINATES',
    3: 'VALIDATE_ACCURACY_AND_TIMEOUT',
    4: 'REVERSE_GEOCODE_TO_CITY_STATE',
    5: 'VALIDATE_AGAINST_SUPPORTED_LOCATIONS',
    6: 'ASSIGN_TO_COMMUNITY_OR_CREATE_NEW'
  },
  
  // Fallback Resolution
  fallbackResolution: {
    1: 'SHOW_MANUAL_LOCATION_ENTRY',
    2: 'GOOGLE_PLACES_AUTOCOMPLETE_SEARCH',
    3: 'USER_SELECTS_CITY_STATE',
    4: 'VALIDATE_SELECTION',
    5: 'CONFIRM_WITH_USER',
    6: 'ASSIGN_TO_COMMUNITY'
  },
  
  // Error Handling
  errorHandling: {
    GPS_DENIED: {
      message: 'Location access helps us connect you with your local music scene',
      action: 'FALLBACK_TO_MANUAL_ENTRY',
      options: ['RETRY_GPS', 'MANUAL_ENTRY', 'SKIP_FOR_NOW']
    },
    
    GPS_TIMEOUT: {
      message: 'Unable to determine your location automatically',
      action: 'FALLBACK_TO_MANUAL_ENTRY',
      options: ['TRY_AGAIN', 'MANUAL_ENTRY']
    },
    
    UNSUPPORTED_LOCATION: {
      message: 'We don\'t have a music community in this area yet',
      action: 'SHOW_NEAREST_COMMUNITIES',
      options: ['SELECT_NEAREST', 'REQUEST_NEW_COMMUNITY']
    },
    
    LOCATION_SPOOFING_DETECTED: {
      message: 'Location verification failed',
      action: 'REQUIRE_MANUAL_VERIFICATION',
      escalation: 'ADMIN_REVIEW'
    }
  }
}
```

---

## 📊 **COMMUNITY STATISTICS & ACTIVITY TRACKING**

### **Activity Score System**
```javascript
const ActivityScoreSystem = {
  // Point Values for Different Actions
  pointValues: {
    // Music Engagement
    songUpload: 50,
    songLike: 2,
    songSkip: -1,
    songBlast: 5,
    songUpvote: 10,
    songDownvote: -5,
    
    // Social Engagement
    followArtist: 3,
    unfollowArtist: -2,
    joinSearchParty: 5,
    createSearchParty: 10,
    
    // Event Engagement
    createEvent: 25,
    attendEvent: 15,
    promoteEvent: 8,
    
    // Community Engagement
    inviteUser: 20,
    firstDayActive: 10,
    weeklyActive: 5,
    monthlyActive: 15,
    
    // Business Engagement (Phase 2)
    becomeAmbassador: 100,
    provideAmbassadorService: 25,
    businessPromotion: 10,
    
    // Negative Actions
    reportedContent: -10,
    moderationAction: -25,
    spamDetected: -50
  },
  
  // Activity Score Calculation
  calculation: {
    userActivityScore: 'SUM_OF_ALL_USER_ACTIONS',
    communityActivityScore: 'SUM_OF_ALL_MEMBER_ACTIVITY_SCORES',
    weeklyActivityScore: 'ACTIVITY_SCORE_LAST_7_DAYS',
    monthlyActivityScore: 'ACTIVITY_SCORE_LAST_30_DAYS',
    
    // Decay System
    decay: {
      enabled: true,
      rate: 0.95, // 5% decay per month
      minimum: 0, // Scores can't go negative from decay
      exemptions: ['SONG_UPLOAD', 'EVENT_CREATION'] // These don't decay
    }
  },
  
  // Community Health Metrics
  healthMetrics: {
    // Engagement Rate = Active Users / Total Users
    engagementRate: {
      excellent: 0.8,
      good: 0.6,
      average: 0.4,
      poor: 0.2,
      critical: 0.1
    },
    
    // Growth Rate = New Members / Existing Members (monthly)
    growthRate: {
      excellent: 0.15, // 15% monthly growth
      good: 0.10,
      average: 0.05,
      poor: 0.01,
      critical: -0.05 // Negative growth
    },
    
    // Content Velocity = New Songs / Member Count (weekly)
    contentVelocity: {
      excellent: 0.1, // 10% of members upload weekly
      good: 0.05,
      average: 0.02,
      poor: 0.01,
      critical: 0.005
    }
  }
}
```

### **Real-Time Statistics Tracking**
```javascript
const RealTimeStatistics = {
  // Live Community Stats
  liveStats: {
    currentlyListening: 0, // Users actively listening to RaDIYo
    songsPlayedToday: 0,
    votesCountToday: 0,
    newMembersToday: 0,
    eventsToday: 0,
    activityPointsToday: 0
  },
  
  // Trending Detection
  trendingDetection: {
    hotSongs: {
      algorithm: 'ENGAGEMENT_VELOCITY',
      timeWindow: '24_HOURS',
      threshold: 'TOP_10_PERCENT_GROWTH'
    },
    
    risingArtists: {
      algorithm: 'FOLLOWER_GROWTH_RATE',
      timeWindow: '7_DAYS',
      threshold: '50_PERCENT_INCREASE'
    },
    
    activeDiscussions: {
      algorithm: 'BLAST_FREQUENCY',
      timeWindow: '6_HOURS',
      threshold: '5X_NORMAL_RATE'
    }
  },
  
  // Update Frequency
  updateSchedule: {
    realTime: ['currentlyListening', 'songsPlayed', 'votes'],
    every5Minutes: ['activityScore', 'memberCount'],
    hourly: ['trendingContent', 'healthMetrics'],
    daily: ['communityRankings', 'growthMetrics'],
    weekly: ['communityHealth', 'algorithmOptimization']
  }
}
```

---

## 🗺️ **MAP VIEW DATA INTEGRATION**

### **Map Flag System**
```javascript
const MapFlagSystem = {
  // Flag Visual Encoding
  flagEncoding: {
    size: {
      dataSource: 'MEMBER_COUNT',
      calculation: 'LOG_SCALE', // Logarithmic scaling for better distribution
      sizes: {
        tiny: { memberCount: '1-10', pixelSize: 8 },
        small: { memberCount: '11-50', pixelSize: 12 },
        medium: { memberCount: '51-200', pixelSize: 16 },
        large: { memberCount: '201-1000', pixelSize: 24 },
        xlarge: { memberCount: '1000+', pixelSize: 32 }
      }
    },
    
    color: {
      dataSource: 'GENRE',
      assignment: 'DYNAMIC', // Colors assigned based on user's favorited genres
      fallback: 'HSL_HASH', // Hash genre name to consistent color
      accessibility: 'COLORBLIND_SAFE'
    },
    
    saturation: {
      dataSource: 'ACTIVITY_SCORE',
      calculation: 'PERCENTAGE_OF_MAX_IN_VIEW',
      range: {
        dim: { activityPercentile: '0-25%', saturation: 30 },
        normal: { activityPercentile: '26-75%', saturation: 70 },
        bright: { activityPercentile: '76-100%', saturation: 100 }
      }
    }
  },
  
  // Map Data Layers
  dataLayers: {
    communities: {
      source: 'COMMUNITY_DATABASE',
      filter: 'USER_FAVORITED_GENRES',
      tierFilter: 'USER_CURRENT_LISTENING_TIER',
      realTimeUpdate: true
    },
    
    ambassadors: {
      source: 'AMBASSADOR_PROFILES', // Phase 2
      filter: 'SERVICE_CATEGORIES',
      visibility: 'COMMUNITY_STATISTICS_PANEL',
      requiresClick: true
    },
    
    events: {
      source: 'UPCOMING_EVENTS',
      timeFilter: 'NEXT_30_DAYS',
      overlay: 'OPTIONAL',
      iconType: 'EVENT_CALENDAR'
    }
  },
  
  // Performance Optimization
  performance: {
    clustering: {
      enabled: true,
      distance: 50, // pixels
      maxZoom: 10
    },
    
    levelOfDetail: {
      zoomLevels: {
        country: { showCommunities: false, showStates: true },
        state: { showCommunities: true, showDetails: false },
        city: { showCommunities: true, showDetails: true, showAmbassadors: true }
      }
    },
    
    caching: {
      communityData: '5_MINUTES',
      activityScores: '1_MINUTE',
      userLocation: 'SESSION'
    }
  }
}
```

### **Community Statistics Panel**
```javascript
const CommunityStatisticsPanel = {
  // Panel Content Structure
  panelSections: {
    header: {
      communityName: 'Austin, Texas Hip Hop',
      memberCount: 1247,
      activityScore: 8942,
      healthStatus: 'THRIVING', // THRIVING, ACTIVE, MODERATE, SLOW, DORMANT
      joinButton: 'VISIT_COMMUNITY' // If user has discovery access
    },
    
    demographics: {
      totalMembers: 1247,
      artists: 89,
      listeners: 1158,
      weeklyActive: 521,
      monthlyActive: 892,
      averageAge: 26,
      topCities: ['Austin', 'Round Rock', 'Cedar Park'] // Within community radius
    },
    
    content: {
      totalSongs: 267,
      songsThisWeek: 12,
      totalEvents: 23,
      upcomingEvents: 8,
      averageSongRating: 4.2,
      topArtists: ['ArtistName1', 'ArtistName2', 'ArtistName3']
    },
    
    activity: {
      dailyListeners: 156,
      weeklyUploads: 12,
      votesThisWeek: 892,
      blastsThisWeek: 234,
      engagementRate: 0.67,
      trendDirection: 'INCREASING' // INCREASING, STABLE, DECREASING
    },
    
    ambassadors: { // Phase 2
      totalAmbassadors: 23,
      serviceCategories: {
        lodging: 8,
        equipment: 5,
        transportation: 12,
        food: 15,
        professionalServices: 7
      },
      filterOptions: ['All Services', 'Lodging', 'Equipment', 'Transport', 'Food', 'Pro Services'],
      bookingAvailable: true
    },
    
    rankings: {
      stateRanking: { position: 4, outOf: 47, category: 'Texas Hip Hop Communities' },
      nationalRanking: { position: 127, outOf: 2341, category: 'All Hip Hop Communities' },
      growthRanking: { position: 12, outOf: 47, category: 'Fastest Growing in Texas' }
    }
  },
  
  // Interactive Elements
  interactiveElements: {
    visitButton: {
      condition: 'USER_HAS_DISCOVERY_ACCESS',
      action: 'SWITCH_TO_COMMUNITY',
      subscription: 'PAID_LISTENER_REQUIRED'
    },
    
    ambassadorFiltering: {
      condition: 'PHASE_2_ENABLED',
      filters: ['SERVICE_TYPE', 'AVAILABILITY', 'RATING'],
      bookingIntegration: true
    },
    
    eventCalendar: {
      integration: 'USER_CALENDAR',
      autoAdd: 'IF_FOLLOWING_ARTIST',
      googleCalendarSync: true
    },
    
    artistProfiles: {
      clickable: true,
      action: 'VIEW_ARTIST_PROFILE',
      followOption: true
    }
  }
}
```

---

## 🔄 **USER FLOWS & NAVIGATION**

### **1. COMMUNITY ASSIGNMENT FLOW (New Users)**

#### **GPS-Based Assignment (Primary Flow)**
```
User Completes Email Verification
├── Location Permission Request
│   ├── Permission Granted
│   │   ├── GPS Acquisition (30s timeout)
│   │   │   ├── Success: Coordinates Acquired
│   │   │   │   ├── Reverse Geocoding
│   │   │   │   ├── City/State Determination
│   │   │   │   ├── Location Confirmation: "Is Austin, Texas correct?"
│   │   │   │   │   ├── Yes → Genre Selection
│   │   │   │   │   └── No → Manual Location Entry
│   │   │   │   └── Error: Unknown Location → Manual Entry
│   │   │   └── Failure: GPS Timeout → Manual Entry
│   │   └── GPS Error → Manual Entry
│   └── Permission Denied → Manual Entry
│
Manual Location Entry
├── Google Places Autocomplete Search
├── "Enter your city" input field
├── City/State Selection from Dropdown
├── Confirmation: "Is Austin, Texas correct?"
├── Yes → Genre Selection
└── No → Search Again
```

#### **Genre Selection & Community Creation**
```
Location Confirmed
├── Genre Selection Screen
│   ├── Popular Genres in Area Display
│   ├── Full Genre List with Search
│   ├── "Can't find your genre?" → Custom Genre Request
│   └── Genre Selected → Community Assignment
│
Community Assignment Process
├── Check if Community Exists
│   ├── Exists: "Austin, Texas Hip Hop" → Assign User
│   └── New: Create Community → Assign User
│
├── Home Scene Assignment Complete
├── Community Welcome Message
├── Tutorial: "Your Local Music Scene"
└── → Artist Registration Prompt
```

### **2. COMMUNITY DISCOVERY FLOW**

#### **Map View Exploration**
```
User Opens Discovery Section
├── Map View Loads
│   ├── User's Current Location Highlighted
│   ├── Favorited Genres Displayed
│   ├── Current Tier Communities Shown (City/State/National)
│   └── Flag Encoding: Size=Population, Color=Genre, Saturation=Activity
│
User Interacts with Map
├── Clicks Community Flag
│   ├── Community Statistics Panel Opens
│   ├── Community Details Displayed
│   ├── Ambassador Services Listed (if Phase 2)
│   └── Visit Button Available (if Paid User)
│
User Clicks Visit Button
├── Subscription Check
│   ├── Has Discovery Access → Switch to Community
│   └── No Access → Subscription Prompt
│
Community Switch Complete
├── RaDIYo Player Updates to New Community
├── Exploration Station Updates
├── Statistics Update
└── User Can Engage with Community (No Voting)
```

#### **Community Statistics Exploration**
```
Community Statistics Panel
├── Overview Section
│   ├── Member Count, Activity Score
│   ├── Health Status, Growth Trend
│   └── Community Ranking Information
│
├── Content Section
│   ├── Song Statistics
│   ├── Event Information
│   ├── Top Artists Display
│   └── Clickable Artist Profiles
│
├── Demographics Section
│   ├── Member Breakdown
│   ├── Activity Levels
│   └── Geographic Distribution
│
└── Ambassador Section (Phase 2)
    ├── Available Services
    ├── Service Category Filtering
    ├── Ambassador Profiles
    └── Booking Interface
```

### **3. LOCATION UPDATE FLOW**

#### **User Moves/Changes Location**
```
User Profile → Settings → Update Location
├── Current Location Display
├── "Update Location" Button
├── Location Update Process (Same as Initial)
│   ├── GPS Verification
│   ├── Manual Entry Option
│   └── Location Confirmation
│
Location Change Validation
├── Significant Change Detected (>50 miles)
│   ├── Community Assignment Review
│   ├── "Switch to new home scene?" Prompt
│   │   ├── Yes → Home Scene Change + Tutorial
│   │   └── No → Keep Current Scene + Note about Voting Restrictions
│   └── Update Location Data
│
└── Minor Change (<50 miles)
    ├── Update GPS Coordinates
    ├── No Community Change
    └── Confirmation Message
```

### **4. COMMUNITY HEALTH MONITORING FLOW**

#### **Automated Community Health Checks**
```
Daily Health Check Process
├── Calculate Community Statistics
│   ├── Member Count Change
│   ├── Activity Score Change
│   ├── Content Velocity
│   └── Engagement Rate
│
├── Health Status Determination
│   ├── THRIVING: High engagement, growing
│   ├── ACTIVE: Stable engagement, some growth
│   ├── MODERATE: Average engagement, stable
│   ├── SLOW: Low engagement, declining
│   └── DORMANT: Very low engagement, at risk
│
├── Alert System
│   ├── DORMANT communities → Admin Alert
│   ├── SLOW communities → Engagement Campaign
│   ├── THRIVING communities → Success Story
│   └── Anomalies → Investigation Required
│
└── Automated Actions
    ├── Update Community Rankings
    ├── Adjust Algorithm Parameters
    ├── Update Map Display Priority
    └── Generate Health Reports
```

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Database Schema**

#### **Communities Table (Core)**
```sql
CREATE TABLE Communities (
  id SERIAL PRIMARY KEY,
  community_key VARCHAR(255) UNIQUE NOT NULL, -- "austin-texas-hip-hop"
  
  -- Geographic Data
  city_name VARCHAR(100) NOT NULL,
  state_name VARCHAR(100) NOT NULL,
  country_name VARCHAR(100) DEFAULT 'United States',
  city_center_lat DECIMAL(10, 8) NOT NULL,
  city_center_lng DECIMAL(11, 8) NOT NULL,
  boundary_radius_miles INT DEFAULT 25,
  time_zone VARCHAR(50) NOT NULL,
  
  -- Genre Data
  genre_id INT REFERENCES Genres(id),
  genre_name VARCHAR(100) NOT NULL,
  parent_genre VARCHAR(100),
  
  -- Community Statistics
  member_count INT DEFAULT 0,
  artist_count INT DEFAULT 0,
  listener_count INT DEFAULT 0,
  total_songs INT DEFAULT 0,
  active_songs INT DEFAULT 0,
  total_events INT DEFAULT 0,
  upcoming_events INT DEFAULT 0,
  
  -- Activity Tracking
  activity_score BIGINT DEFAULT 0,
  weekly_activity_score INT DEFAULT 0,
  monthly_activity_score INT DEFAULT 0,
  last_activity_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Health Metrics
  engagement_rate DECIMAL(4, 3) DEFAULT 0.000, -- 0.000 to 1.000
  growth_rate DECIMAL(5, 4) DEFAULT 0.0000, -- -1.0000 to 10.0000
  health_status ENUM('THRIVING', 'ACTIVE', 'MODERATE', 'SLOW', 'DORMANT') DEFAULT 'MODERATE',
  
  -- Tier Performance
  songs_promoted_to_state INT DEFAULT 0,
  songs_promoted_to_national INT DEFAULT 0,
  state_ranking INT,
  national_ranking INT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX(city_name, state_name),
  INDEX(genre_id),
  INDEX(community_key),
  INDEX(activity_score DESC),
  INDEX(member_count DESC),
  INDEX(health_status)
);
```

#### **User Community Memberships Table**
```sql
CREATE TABLE UserCommunityMemberships (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Users(id),
  community_id INT REFERENCES Communities(id),
  
  -- Membership Type
  membership_type ENUM('HOME_SCENE', 'VISITING', 'DISCOVERED') NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE, -- Only one primary per user
  
  -- Verification Data
  location_verified BOOLEAN DEFAULT FALSE,
  verification_method ENUM('GPS', 'MANUAL', 'ZIP_CODE', 'ADMIN') NOT NULL,
  verification_coordinates POINT,
  verification_accuracy DECIMAL(8, 2), -- meters
  verification_timestamp TIMESTAMP,
  
  -- Activity Tracking
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_activity_points INT DEFAULT 0,
  votes_cast INT DEFAULT 0,
  songs_uploaded INT DEFAULT 0,
  events_created INT DEFAULT 0,
  
  -- Status
  status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, community_id),
  INDEX(user_id, is_primary),
  INDEX(community_id, membership_type),
  INDEX(location_verified, verification_method)
);
```

#### **Community Activity Log Table**
```sql
CREATE TABLE CommunityActivityLog (
  id SERIAL PRIMARY KEY,
  community_id INT REFERENCES Communities(id),
  user_id INT REFERENCES Users(id),
  
  -- Activity Details
  activity_type ENUM(
    'SONG_UPLOAD', 'SONG_LIKE', 'SONG_SKIP', 'SONG_BLAST', 'SONG_VOTE',
    'EVENT_CREATE', 'EVENT_ATTEND', 'ARTIST_FOLLOW', 'USER_JOIN',
    'SEARCH_PARTY_CREATE', 'SEARCH_PARTY_JOIN', 'COMMUNITY_INVITE'
  ) NOT NULL,
  
  activity_points INT NOT NULL,
  reference_id INT, -- ID of related object (song, event, etc.)
  reference_type VARCHAR(50), -- Type of related object
  
  -- Context Data
  activity_data JSONB, -- Additional context about the activity
  ip_address INET,
  user_agent TEXT,
  location_data POINT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX(community_id, created_at),
  INDEX(user_id, activity_type),
  INDEX(activity_type, created_at),
  INDEX(created_at) -- For time-based queries
);
```

#### **Genres Table**
```sql
CREATE TABLE Genres (
  id SERIAL PRIMARY KEY,
  genre_name VARCHAR(100) UNIQUE NOT NULL,
  genre_slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly version
  parent_genre_id INT REFERENCES Genres(id),
  
  -- Display Properties
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_custom BOOLEAN DEFAULT FALSE, -- User-requested genres
  
  -- Statistics
  community_count INT DEFAULT 0,
  total_artists INT DEFAULT 0,
  total_songs INT DEFAULT 0,
  
  -- Descriptions
  description TEXT,
  example_artists TEXT[], -- Array of example artist names
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX(parent_genre_id),
  INDEX(is_active, display_order),
  INDEX(genre_slug)
);
```

### **API Endpoints**

#### **Community Management Endpoints**
```javascript
const communityRoutes = {
  'GET /communities/my-home-scene': {
    headers: { authorization: 'Bearer token' },
    response: {
      homeScene: {
        communityId: 'int',
        communityKey: 'string',
        displayName: 'string',
        geographic: 'object',
        statistics: 'object',
        membershipVerified: 'boolean'
      }
    }
  },
  
  'GET /communities/:communityId/statistics': {
    headers: { authorization: 'Bearer token' },
    response: {
      community: 'CommunityObject',
      statistics: {
        demographics: 'object',
        content: 'object',
        activity: 'object',
        rankings: 'object',
        ambassadors: 'object' // Phase 2
      },
      userCanVisit: 'boolean',
      userCanVote: 'boolean'
    }
  },
  
  'POST /communities/visit': {
    headers: { authorization: 'Bearer token' },
    body: { communityId: 'int' },
    response: {
      success: {
        community: 'CommunityObject',
        accessGranted: 'boolean',
        restrictions: 'array'
      },
      error: {
        message: 'string',
        subscriptionRequired: 'boolean',
        upgradeUrl: 'string'
      }
    }
  },
  
  'POST /communities/update-location': {
    headers: { authorization: 'Bearer token' },
    body: {
      latitude: 'float',
      longitude: 'float',
      accuracy: 'float',
      method: 'GPS|MANUAL'
    },
    response: {
      success: {
        locationUpdated: 'boolean',
        homeSceneChanged: 'boolean',
        newHomeScene: 'CommunityObject?',
        verificationStatus: 'boolean'
      },
      error: {
        message: 'string',
        locationInvalid: 'boolean',
        verificationFailed: 'boolean'
      }
    }
  }
}
```

#### **Map View Endpoints**
```javascript
const mapRoutes = {
  'GET /map/communities': {
    headers: { authorization: 'Bearer token' },
    query: {
      bounds: 'string', // "lat1,lng1,lat2,lng2"
      tier: 'CITYWIDE|STATEWIDE|NATIONAL',
      genres: 'string', // Comma-separated genre IDs
      minActivity: 'int?',
      limit: 'int?'
    },
    response: {
      communities: [
        {
          communityId: 'int',
          communityKey: 'string',
          displayName: 'string',
          coordinates: { lat: 'float', lng: 'float' },
          memberCount: 'int',
          activityScore: 'int',
          genre: 'object',
          flagSize: 'string', // 'tiny', 'small', 'medium', 'large', 'xlarge'
          activityLevel: 'string' // 'dim', 'normal', 'bright'
        }
      ],
      totalCount: 'int',
      bounds: 'object'
    }
  },
  
  'GET /map/community/:communityId/details': {
    headers: { authorization: 'Bearer token' },
    response: {
      community: 'DetailedCommunityObject',
      canVisit: 'boolean',
      visitRequirements: 'array',
      ambassadors: 'array' // Phase 2
    }
  }
}
```

#### **Location Services Endpoints**
```javascript
const locationRoutes = {
  'POST /location/verify': {
    headers: { authorization: 'Bearer token' },
    body: {
      latitude: 'float',
      longitude: 'float',
      accuracy: 'float',
      timestamp: 'int',
      verificationLevel: 'STRICT|MODERATE|LENIENT'
    },
    response: {
      verified: 'boolean',
      community: 'CommunityObject?',
      distance: 'float', // Distance from community center
      withinBounds: 'boolean',
      fraudScore: 'float', // 0.0 to 1.0
      action: 'ACCEPT|REVIEW|REJECT'
    }
  },
  
  'GET /location/supported-areas': {
    query: {
      search: 'string?',
      state: 'string?',
      limit: 'int?'
    },
    response: {
      areas: [
        {
          cityName: 'string',
          stateName: 'string',
          coordinates: { lat: 'float', lng: 'float' },
          availableGenres: 'array',
          communityCount: 'int'
        }
      ]
    }
  },
  
  'POST /location/report-issue': {
    headers: { authorization: 'Bearer token' },
    body: {
      issueType: 'GPS_INACCURATE|WRONG_COMMUNITY|VERIFICATION_FAILED',
      description: 'string',
      locationData: 'object'
    },
    response: { reportId: 'string', status: 'SUBMITTED' }
  }
}
```

### **Background Processing**

#### **Community Statistics Update Jobs**
```javascript
const backgroundJobs = {
  // Real-time updates (every 5 minutes)
  updateCommunityStats: {
    schedule: '*/5 * * * *', // Every 5 minutes
    process: [
      'CALCULATE_MEMBER_COUNTS',
      'UPDATE_ACTIVITY_SCORES',
      'REFRESH_CURRENT_LISTENERS',
      'UPDATE_MAP_VIEW_CACHE'
    ],
    performance: 'HIGH_PRIORITY'
  },
  
  // Health monitoring (hourly)
  communityHealthCheck: {
    schedule: '0 * * * *', // Every hour
    process: [
      'CALCULATE_ENGAGEMENT_RATES',
      'DETERMINE_HEALTH_STATUS',
      'DETECT_ANOMALIES',
      'TRIGGER_ALERTS_IF_NEEDED'
    ],
    performance: 'MEDIUM_PRIORITY'
  },
  
  // Ranking updates (daily)
  updateCommunityRankings: {
    schedule: '0 3 * * *', // Daily at 3 AM
    process: [
      'CALCULATE_STATE_RANKINGS',
      'CALCULATE_NATIONAL_RANKINGS',
      'UPDATE_GROWTH_METRICS',
      'GENERATE_TREND_REPORTS'
    ],
    performance: 'LOW_PRIORITY'
  },
  
  // Data cleanup (weekly)
  cleanupOldData: {
    schedule: '0 2 * * 0', // Weekly on Sunday at 2 AM
    process: [
      'ARCHIVE_OLD_ACTIVITY_LOGS',
      'CLEANUP_TEMPORARY_LOCATION_DATA',
      'REMOVE_INACTIVE_COMMUNITIES',
      'OPTIMIZE_DATABASE_INDEXES'
    ],
    performance: 'LOW_PRIORITY'
  }
}
```

---

## 🧪 **TESTING REQUIREMENTS**

### **Location Services Testing**
```javascript
const locationTesting = {
  gpsAccuracy: {
    tests: [
      'accurate_gps_within_bounds',
      'inaccurate_gps_handling',
      'gps_timeout_scenarios',
      'gps_permission_denied',
      'location_spoofing_detection',
      'velocity_impossibility_detection'
    ]
  },
  
  communityAssignment: {
    tests: [
      'new_community_creation',
      'existing_community_assignment',
      'edge_case_locations',
      'unsupported_locations',
      'boundary_edge_cases',
      'multiple_genre_communities'
    ]
  },
  
  fraudDetection: {
    tests: [
      'legitimate_location_changes',
      'suspicious_velocity_patterns',
      'repeated_exact_coordinates',
      'known_spoofing_coordinates',
      'multiple_accounts_same_device'
    ]
  }
}
```

### **Community Statistics Testing**
```javascript
const statisticsTesting = {
  activityCalculation: {
    tests: [
      'activity_point_accumulation',
      'decay_system_application',
      'community_score_aggregation',
      'real_time_updates',
      'batch_processing_accuracy'
    ]
  },
  
  healthMetrics: {
    tests: [
      'engagement_rate_calculation',
      'growth_rate_calculation',
      'health_status_determination',
      'trend_detection_accuracy',
      'alert_trigger_conditions'
    ]
  },
  
  mapIntegration: {
    tests: [
      'flag_size_calculation',
      'activity_saturation_mapping',
      'genre_color_assignment',
      'real_time_map_updates',
      'performance_under_load'
    ]
  }
}
```

### **Performance Testing**
```javascript
const performanceTesting = {
  scalability: {
    targets: {
      concurrentUsers: 10000,
      communitiesSupported: 50000,
      mapViewLoadTime: '< 2s',
      statisticsUpdateFrequency: '5min',
      databaseQueryPerformance: '< 100ms'
    }
  },
  
  loadTesting: {
    scenarios: [
      'peak_onboarding_traffic',
      'simultaneous_map_requests',
      'batch_statistics_updates',
      'high_frequency_location_updates',
      'large_community_data_queries'
    ]
  }
}
```

---

## 🚀 **IMPLEMENTATION ROADMAP**

### **Week 1-2: Core Infrastructure**
1. **Database Schema Setup**
   - Create community and location tables
   - Set up indexing for performance
   - Implement soft delete patterns

2. **Basic Location Services**
   - GPS permission handling
   - Coordinate acquisition
   - Basic reverse geocoding

### **Week 3-4: Community System**
1. **Community Creation Logic**
   - Automatic community creation
   - Community key generation
   - Initial statistics setup

2. **User Assignment**
   - Home scene assignment
   - Membership tracking
   - Verification status management

### **Week 5-6: Statistics & Tracking**
1. **Activity Score System**
   - Point calculation logic
   - Real-time updates
   - Background aggregation jobs

2. **Community Health Monitoring**
   - Health metrics calculation
   - Status determination
   - Alert systems

### **Week 7-8: Map Integration**
1. **Map View Data API**
   - Community data endpoints
   - Flag encoding logic
   - Performance optimization

2. **Statistics Panel**
   - Detailed community information
   - Ambassador integration (Phase 2 ready)
   - Interactive elements

### **Week 9-10: Advanced Features**
1. **Location Verification**
   - GPS fraud detection
   - Verification levels
   - Anti-spoofing measures

2. **Performance Optimization**
   - Query optimization
   - Caching strategies
   - Background job optimization

---

## 📊 **SUCCESS METRICS**

### **System Performance**
- Community assignment success rate > 95%
- GPS verification accuracy > 90%
- Map view load time < 2 seconds
- Statistics update frequency = 5 minutes

### **User Experience**
- Onboarding completion rate > 80%
- Location verification success rate > 85%
- Community engagement rate > 60%
- User retention in home scene > 75%

### **Data Quality**
- Location accuracy within 100 meters
- Community health status accuracy > 90%
- Activity score calculation accuracy > 99%
- Fraud detection false positive rate < 5%

### **Business Impact**
- Communities created automatically > 95%
- Manual intervention required < 5%
- System scalability to 50,000+ communities
- Support for international expansion ready

---

*This completes the detailed Community & Location System specification. This module fixes the critical issue of genre-only communities and provides the geographic foundation that all other platform features depend on.*

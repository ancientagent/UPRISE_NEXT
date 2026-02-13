# UPRISE Fair Play Algorithm & RaDIYo System - Detailed Technical Specification

## Phase 2 Alignment: Genre + Location Inputs
- Inputs now explicitly include `community_key`, `genre_id`, and user-verified location.
- Queue selection and priority weights use community activity stats and genre taxonomy rollups.
- Radio (RaDIYo) operates as a projection of the Community rotation queues; same identity and filters.
- Anti-manipulation requires PostGIS-backed verification that engagement originates from the appropriate community boundary.

## 🎯 **MODULE OVERVIEW**

Standard Parameters: see `docs/specs/_fragments/params.geo-genre.md` for `city,state,genre,lat,lng,radius,community_key`.

### **Purpose**
The Fair Play Algorithm is the core engine that ensures democratic music discovery by giving every song equal initial opportunity while allowing community taste to naturally curate the best content. RaDIYo (Radio DIY) is the broadcasting system that delivers this curated content through three tiers.

### **Critical Issues Fixed**
- ❌ **Current**: Fair Play Algorithm missing entirely from codebase
- ✅ **Target**: Complete democratic song rotation system with community curation
- ❌ **Current**: No song tier progression system
- ✅ **Target**: Three-tier progression (citywide → statewide → national)
- ❌ **Current**: No engagement-based priority system
- ✅ **Target**: Community engagement determines song rotation frequency

### **Dependencies**
- **Required**: Authentication & User Management, Community & Location System
- **Integrates With**: Song Upload System, User Engagement, Discovery System, Analytics

---

## 🏗️ **SYSTEM ARCHITECTURE**

### **Core Components**
```
Fair Play Algorithm & RaDIYo System
├── 🎲 Fair Play Engine
│   ├── Time-based Priority Calculator
│   ├── Community-based Priority Calculator
│   ├── Song Evaluation Thresholds
│   └── Priority Score Aggregator
│
├── 📊 Engagement Tracking System
│   ├── User Interaction Logger
│   ├── Engagement Weight Calculator
│   ├── Anti-Manipulation Detector
│   └── Community Threshold Monitor
│
├── 🎵 Song Tier Management
│   ├── Tier Progression Logic
│   ├── Upvote Threshold Tracker
│   ├── Cross-Tier Analytics
│   └── Song Promotion Processor
│
├── 📻 RaDIYo Broadcasting Engine
│   ├── Real-time Song Selector
│   ├── Tier-based Queue Manager
│   ├── User-specific Rotation
│   └── Playback History Tracker
│
├── 🛡️ Anti-Fraud & Security
│   ├── Vote Manipulation Detection
│   ├── Artificial Engagement Detection
│   ├── Geographic Verification Integration
│   └── Community Integrity Monitoring
│
└── 📈 Analytics & Optimization
    ├── Algorithm Performance Monitoring
    ├── Community Health Impact Analysis
    ├── Engagement Pattern Recognition
    └── Continuous Algorithm Improvement
```

---

## 🎲 **FAIR PLAY ALGORITHM CORE LOGIC**

### **Algorithm Philosophy**
```javascript
const FairPlayPhilosophy = {
  coreBeliefs: {
    equalOpportunity: "Every song gets fair exposure to every listener",
    communityChoice: "Community engagement determines rotation frequency",
    democraticProgression: "Upvotes determine tier advancement",
    antiManipulation: "Geographic and behavioral verification prevents gaming",
    continuousEvaluation: "Songs are re-evaluated as community engagement evolves"
  },
  
  fairnessGuarantees: {
    minimumExposure: "Every song heard by 15-35% of community 2-3 times",
    equalInitialChance: "New songs get time-based priority regardless of artist",
    noPayToWin: "Success based on community response, not payment",
    artistStatusIrrelevant: "Same algorithm applies to all artists equally",
    geographicIntegrity: "Only verified community members can influence rotation"
  }
}
```

### **Two-Phase Priority System**

#### **Phase 1: Time-Based Priority (Initial Exposure)**
```javascript
const TimeBasedPriority = {
  // Purpose: Ensure fair initial exposure for all songs
  purpose: "EQUAL_INITIAL_OPPORTUNITY",
  
  // When Active
  activeWhen: "song.communityExposure < COMMUNITY_THRESHOLD_PERCENTAGE",
  
  // Calculation Method
  calculation: {
    formula: "LOG(daysSinceUpload + 1) * TIME_WEIGHT_MULTIPLIER",
    reasoning: "Older songs get higher priority until they've had fair exposure",
    weightMultiplier: 1.5, // Adjustable parameter
    
    // Example Values
    examples: {
      newSong: { daysSinceUpload: 0, priority: 0.0 },
      oneDayOld: { daysSinceUpload: 1, priority: 1.04 },
      oneWeekOld: { daysSinceUpload: 7, priority: 3.12 },
      oneMonthOld: { daysSinceUpload: 30, priority: 5.14 }
    }
  },
  
  // Community Threshold
  communityThreshold: {
    targetExposure: "15-35% of community members hear song 2-3 times",
    calculation: "UNIQUE_LISTENERS >= (COMMUNITY_SIZE * THRESHOLD_PERCENTAGE)",
    thresholdPercentage: {
      citywide: 0.15, // 15% of citywide community
      statewide: 0.25, // 25% of statewide community  
      national: 0.35  // 35% of national community
    },
    minimumPlays: 2, // Each listener should hear song at least twice
    evaluationPeriod: "ROLLING_7_DAYS"
  }
}
```

#### **Phase 2: Community-Based Priority (Engagement Response)**
```javascript
const CommunityBasedPriority = {
  // Purpose: Community taste determines rotation frequency
  purpose: "COMMUNITY_CURATION",
  
  // When Active
  activeWhen: "song.communityExposure >= COMMUNITY_THRESHOLD_PERCENTAGE",
  
  // Engagement Metrics & Weights
  engagementWeights: {
    // Primary Engagement (One-time per tier, high weight)
    like: 10.0,        // High positive weight
    dislike: -8.0,     // High negative weight
    neutral: 0.0,      // Default state (no engagement)
    
    // Ongoing Engagement (Unlimited, low weight)
    fullListen: 1.0,   // Completed entire song
    skip: -0.5,        // Skipped before completion
    
    // Tier Progression (Separate from rotation priority)
    upvote: "TIER_PROGRESSION_ONLY", // Doesn't affect rotation priority
    downvote: 0.0,     // Doesn't demote songs between tiers
    
    // Social Engagement
    blast: 5.0,        // User promotes song to community
    favorite: 3.0,     // Added to personal collection
    
    // Behavioral Indicators
    replay: 2.0,       // User manually replays song
    share: 8.0         // User shares outside platform (future feature)
  },
  
  // Community Score Calculation
  calculation: {
    formula: `
      COMMUNITY_SCORE = (
        (likes * LIKE_WEIGHT) + 
        (dislikes * DISLIKE_WEIGHT) + 
        (fullListens * LISTEN_WEIGHT) + 
        (skips * SKIP_WEIGHT) + 
        (blasts * BLAST_WEIGHT) + 
        (favorites * FAVORITE_WEIGHT) + 
        (replays * REPLAY_WEIGHT)
      ) / TOTAL_UNIQUE_LISTENERS
    `,
    
    normalization: "SCORE_NORMALIZED_TO_0_TO_100_SCALE",
    minimumListeners: 10, // Minimum listeners before community scoring activates
    
    // Anti-Manipulation Safeguards
    safeguards: {
      maxEngagementPerUser: "ONE_PRIMARY_ENGAGEMENT_PER_TIER",
      gpsVerificationRequired: true,
      velocityChecking: "DETECT_IMPOSSIBLE_MOVEMENT_PATTERNS",
      behaviorAnalysis: "FLAG_SUSPICIOUS_VOTING_PATTERNS"
    }
  }
}
```

### **Final Priority Calculation**
```javascript
const FinalPriorityCalculation = {
  // Priority Determination
  priorityLogic: {
    beforeCommunityThreshold: "priority = timePriority",
    afterCommunityThreshold: "priority = communityScore",
    
    // Fallback for edge cases
    fallbackConditions: {
      noEngagement: "priority = timePriority * 0.5",
      technicalError: "priority = DEFAULT_NEUTRAL_PRIORITY",
      newCommunity: "priority = timePriority" // Until community establishes patterns
    }
  },
  
  // Priority Score Range
  scoreRange: {
    minimum: 0.0,
    maximum: 100.0,
    default: 25.0, // For new songs or edge cases
    excellentThreshold: 80.0, // Top-tier community favorites
    poorThreshold: 20.0 // Songs community doesn't enjoy
  },
  
  // Rotation Frequency Mapping
  rotationFrequency: {
    calculation: "PLAYS_PER_HOUR = (PRIORITY_SCORE / 100) * MAX_PLAYS_PER_HOUR",
    maxPlaysPerHour: 6, // Highest priority songs play max 6 times per hour
    minPlaysPerHour: 0.5, // Lowest priority songs play once every 2 hours
    
    // Example Frequency Mapping
    examples: {
      priority100: { playsPerHour: 6.0, frequency: "Every 10 minutes" },
      priority80: { playsPerHour: 4.8, frequency: "Every 12.5 minutes" },
      priority50: { playsPerHour: 3.0, frequency: "Every 20 minutes" },
      priority25: { playsPerHour: 1.5, frequency: "Every 40 minutes" },
      priority10: { playsPerHour: 0.6, frequency: "Every 100 minutes" }
    }
  }
}
```

---

## 🎵 **SONG TIER PROGRESSION SYSTEM**

### **Three-Tier Architecture**
```javascript
const TierSystem = {
  tiers: {
    CITYWIDE: {
      description: "Songs from local artists in user's home city",
      songCriteria: "artist.homeCity = user.homeCity AND song.tier = 'CITYWIDE'",
      audienceCriteria: "users in same city + genre community",
      
      // Progression Requirements
      progression: {
        method: "UPVOTE_THRESHOLD",
        upvotesRequired: 10, // Configurable parameter
        timeWindow: "UNLIMITED", // No time pressure
        voterRequirements: "GPS_VERIFIED_HOME_SCENE_MEMBERS",
        fallbackCriteria: "EXCEPTIONAL_ENGAGEMENT_SCORE_90_PLUS"
      },
      
      // Community Threshold
      communityThreshold: {
        exposurePercentage: 0.15, // 15% of citywide community
        minimumListeners: 5, // At least 5 unique listeners
        evaluationPeriod: "7_DAYS"
      }
    },
    
    STATEWIDE: {
      description: "Best songs promoted from citywide communities",
      songCriteria: "song.tier = 'STATEWIDE' AND song.state = user.state",
      audienceCriteria: "users in same state + genre communities",
      
      // Progression Requirements
      progression: {
        method: "UPVOTE_THRESHOLD",
        upvotesRequired: 50, // Higher threshold for state level
        timeWindow: "UNLIMITED",
        voterRequirements: "GPS_VERIFIED_STATE_MEMBERS",
        fallbackCriteria: "EXCEPTIONAL_ENGAGEMENT_SCORE_95_PLUS"
      },
      
      // Community Threshold
      communityThreshold: {
        exposurePercentage: 0.25, // 25% of statewide community
        minimumListeners: 25, // Higher minimum for larger audience
        evaluationPeriod: "14_DAYS"
      }
    },
    
    NATIONAL: {
      description: "Best songs promoted from statewide communities",
      songCriteria: "song.tier = 'NATIONAL'",
      audienceCriteria: "all users in genre community nationwide",
      
      // No Further Progression
      progression: {
        method: "NONE", // Highest tier
        voterRequirements: "NO_VOTING_ALLOWED", // As clarified
        engagementAllowed: "LIKE_FAVORITE_BLAST_ONLY"
      },
      
      // Community Threshold
      communityThreshold: {
        exposurePercentage: 0.35, // 35% of national community
        minimumListeners: 100, // Much higher minimum
        evaluationPeriod: "30_DAYS"
      }
    }
  }
}
```

### **Tier Progression Logic**
```javascript
const TierProgressionLogic = {
  // Upvote Tracking
  upvoteTracking: {
    rules: {
      oneVotePerSongPerTier: "Users can vote once per song per tier",
      revotingAfterPromotion: "Users can vote again if song reaches higher tier",
      gpsVerificationRequired: "Votes require GPS verification in appropriate geographic area",
      homeSceneVotingOnly: "Users can only vote in their verified home scene"
    },
    
    // Vote Validation
    voteValidation: {
      geographicVerification: "Voter's GPS location must match tier geographic requirements",
      communityMembership: "Voter must be verified member of relevant community",
      antiManipulation: "Detect and prevent coordinated voting campaigns",
      velocityChecking: "Flag impossible movement patterns between votes"
    }
  },
  
  // Promotion Process
  promotionProcess: {
    automatic: {
      trigger: "UPVOTE_THRESHOLD_REACHED",
      process: [
        "VALIDATE_ALL_VOTES",
        "CONFIRM_GEOGRAPHIC_DISTRIBUTION",
        "CHECK_ANTI_MANIPULATION_FLAGS",
        "PROMOTE_SONG_TO_NEXT_TIER",
        "RESET_TIER_SPECIFIC_METRICS",
        "NOTIFY_ARTIST_AND_VOTERS",
        "UPDATE_COMMUNITY_STATISTICS"
      ],
      
      timing: "IMMEDIATE_UPON_THRESHOLD",
      rollback: "IF_FRAUD_DETECTED_WITHIN_24_HOURS"
    },
    
    // Song Changes Upon Promotion
    songChanges: {
      tierUpdate: "song.tier = NEXT_TIER",
      audienceExpansion: "Available to broader geographic audience",
      priorityReset: "Starts with time-based priority in new tier",
      engagementReset: "Tier-specific engagement metrics reset to zero",
      votingReset: "Users can vote again in new tier",
      statisticsPreservation: "Previous tier performance metrics preserved for analytics"
    }
  },
  
  // Artist Status (Unchanged)
  artistStatusClarification: {
    artistTierDoesNotChange: "Artists remain in home community regardless of song success",
    permissionsUnchanged: "Song success doesn't affect artist account permissions",
    communityMembershipPermanent: "Artists stay in original home scene",
    accessRightsStatic: "No premium artist features based on song tier success"
  }
}
```

---

## 📻 **RaDIYo BROADCASTING SYSTEM**

### **Player Architecture**
```javascript
const RaDIYoBroadcastingSystem = {
  // Player Components
  playerComponents: {
    tierToggle: {
      purpose: "Allow users to switch between community tiers",
      options: ["CITYWIDE", "STATEWIDE", "NATIONAL"],
      default: "CITYWIDE",
      restrictions: "Can only access tiers based on home scene location"
    },
    
    nowPlaying: {
      display: [
        "song.title",
        "artist.name", 
        "song.tier",
        "song.communityOrigin",
        "song.currentPriority",
        "album.artwork"
      ],
      realTimeUpdates: true
    },
    
    engagementControls: {
      primaryActions: ["LIKE", "DISLIKE", "NEUTRAL"],
      secondaryActions: ["SKIP", "BLAST", "FAVORITE"],
      tierProgressionActions: ["UPVOTE", "DOWNVOTE"], // Except on NATIONAL tier
      socialActions: ["FOLLOW_ARTIST", "ADD_TO_SEARCH_PARTY"]
    },
    
    queueManagement: {
      userSpecificQueue: "Each user gets personalized rotation based on their listening history",
      queueLength: 10, // Next 10 songs calculated
      realTimeAdjustment: "Queue adjusts based on real-time engagement and new uploads",
      skipHandling: "Skipped songs get lower priority but remain in potential rotation"
    }
  }
}
```

### **Song Selection Algorithm**
```javascript
const SongSelectionAlgorithm = {
  // Real-time Song Selection Process
  selectionProcess: {
    1: "DETERMINE_USER_TIER_PREFERENCE",
    2: "FETCH_ELIGIBLE_SONGS_FOR_TIER",
    3: "FILTER_BY_USER_LISTENING_HISTORY",
    4: "CALCULATE_CURRENT_PRIORITY_SCORES",
    5: "APPLY_WEIGHTED_RANDOM_SELECTION",
    6: "VALIDATE_GEOGRAPHIC_RESTRICTIONS",
    7: "UPDATE_USER_LISTENING_HISTORY",
    8: "LOG_SELECTION_FOR_ANALYTICS"
  },
  
  // Eligible Songs Criteria
  eligibleSongsCriteria: {
    tierMatching: "song.tier = user.selectedTier",
    geographicMatching: {
      CITYWIDE: "song.city = user.homeCity AND song.genre = user.homeGenre",
      STATEWIDE: "song.state = user.homeState AND song.genre = user.homeGenre", 
      NATIONAL: "song.genre = user.homeGenre"
    },
    statusRequired: "song.status = 'LIVE' AND song.deletedAt IS NULL",
    qualityChecks: "song.reportCount < REMOVAL_THRESHOLD"
  },
  
  // Weighted Random Selection
  weightedSelection: {
    algorithm: "PRIORITY_SCORE_WEIGHTED_RANDOM",
    implementation: `
      totalWeight = SUM(allEligibleSongs.priorityScore)
      randomValue = RANDOM(0, totalWeight)
      selectedSong = findSongWhereWeightSum >= randomValue
    `,
    
    // Selection Probabilities (Examples)
    selectionProbabilities: {
      priority100Song: "20x more likely than priority5 song",
      priority80Song: "16x more likely than priority5 song",
      priority50Song: "10x more likely than priority5 song",
      priority25Song: "5x more likely than priority5 song"
    },
    
    // Repeat Prevention
    repeatPrevention: {
      recentPlayCooldown: "6_HOURS", // Same song won't repeat for 6 hours for same user
      artistCooldown: "2_HOURS", // Same artist won't repeat for 2 hours
      genreVariety: "ENCOURAGE_SUBGENRE_MIXING"
    }
  }
}
```

### **User-Specific Rotation**
```javascript
const UserSpecificRotation = {
  // Personalized Queue Management
  personalizedQueue: {
    queueGeneration: {
      trigger: "USER_NEEDS_NEXT_SONG",
      process: [
        "CHECK_USER_LISTENING_HISTORY",
        "IDENTIFY_SONGS_NOT_RECENTLY_PLAYED",
        "APPLY_PRIORITY_WEIGHTED_SELECTION",
        "ENSURE_ARTIST_VARIETY",
        "VALIDATE_COMMUNITY_REQUIREMENTS",
        "GENERATE_QUEUE_OF_10_SONGS"
      ]
    },
    
    // Listening History Impact
    listeningHistory: {
      recentPlayMemory: "LAST_50_SONGS_PLAYED",
      artistRepeatPrevention: "TRACK_LAST_10_ARTISTS",
      favoriteArtistBias: "SLIGHT_INCREASE_FOR_FOLLOWED_ARTISTS",
      engagementLearning: "LEARN_FROM_LIKE_DISLIKE_PATTERNS"
    },
    
    // Queue Adjustment
    queueAdjustment: {
      realTimeUpdates: "Queue updates when new songs uploaded or priorities change",
      userEngagementImpact: "User's engagement affects their future queue composition",
      communityTrendInfluence: "Trending songs get slight priority boost",
      newUserExperience: "New users get more diverse exposure initially"
    }
  }
}
```

---

## 📊 **ENGAGEMENT TRACKING SYSTEM**

### **User Interaction Logging**
```javascript
const EngagementTracking = {
  // Interaction Types
  interactionTypes: {
    // Primary Engagement (Affects Rotation Priority)
    like: {
      weight: 10.0,
      frequency: "ONCE_PER_SONG_PER_TIER",
      reversible: true,
      impactType: "ROTATION_PRIORITY"
    },
    
    dislike: {
      weight: -8.0,
      frequency: "ONCE_PER_SONG_PER_TIER", 
      reversible: true,
      impactType: "ROTATION_PRIORITY"
    },
    
    // Ongoing Engagement (Unlimited)
    skip: {
      weight: -0.5,
      frequency: "UNLIMITED",
      trackingData: ["skipTime", "songDuration", "skipPercentage"],
      impactType: "ROTATION_PRIORITY"
    },
    
    fullListen: {
      weight: 1.0,
      frequency: "UNLIMITED",
      definition: "Listened to >80% of song duration",
      impactType: "ROTATION_PRIORITY"
    },
    
    // Tier Progression (Separate System)
    upvote: {
      weight: "N/A",
      frequency: "ONCE_PER_SONG_PER_TIER",
      purpose: "TIER_PROGRESSION_ONLY",
      impactType: "TIER_ADVANCEMENT"
    },
    
    downvote: {
      weight: 0.0, // Doesn't affect rotation or demote between tiers
      frequency: "ONCE_PER_SONG_PER_TIER",
      purpose: "USER_FEEDBACK_ONLY",
      impactType: "ANALYTICS_ONLY"
    },
    
    // Social Engagement
    blast: {
      weight: 5.0,
      frequency: "ONCE_PER_SONG_PER_USER",
      visibility: "COMMUNITY_FEED",
      impactType: "ROTATION_PRIORITY_AND_TRENDING"
    },
    
    favorite: {
      weight: 3.0,
      frequency: "UNLIMITED", // Can favorite/unfavorite
      storage: "USER_PERSONAL_COLLECTION",
      impactType: "ROTATION_PRIORITY"
    }
  },
  
  // Engagement Validation
  engagementValidation: {
    geographicVerification: {
      required: ["upvote", "downvote", "like", "dislike"],
      method: "GPS_LOCATION_VERIFICATION",
      tolerance: "50_MILES_FROM_HOME_SCENE",
      fallback: "REQUIRE_MANUAL_VERIFICATION"
    },
    
    timeBasedValidation: {
      minimumListenTime: "15_SECONDS", // Must listen for 15 seconds before engagement counts
      rapidFirePrevention: "1_SECOND_COOLDOWN_BETWEEN_ACTIONS",
      sessionValidation: "DETECT_AUTOMATED_BEHAVIOR_PATTERNS"
    },
    
    communityMembership: {
      homeSceneRequired: ["upvote", "downvote"],
      visitingAllowed: ["like", "dislike", "favorite", "blast"],
      subscriptionGated: "VISITING_REQUIRES_PAID_ACCOUNT"
    }
  }
}
```

### **Anti-Manipulation System**
```javascript
const AntiManipulationSystem = {
  // Detection Methods
  detectionMethods: {
    geographicAnomalies: {
      checks: [
        "IMPOSSIBLE_VELOCITY_DETECTION", // User can't be in two places quickly
        "REPEATED_EXACT_COORDINATES", // Suspicious if GPS always exact same
        "KNOWN_SPOOFING_LOCATIONS", // Database of common spoofed coordinates
        "CLUSTERING_ANALYSIS" // Multiple accounts from same location
      ],
      action: "FLAG_FOR_REVIEW"
    },
    
    behavioralAnomalies: {
      checks: [
        "RAPID_SEQUENTIAL_VOTING", // Voting too quickly in sequence
        "PERFECT_VOTING_PATTERNS", // Always voting same way
        "NEW_ACCOUNT_MASS_VOTING", // New accounts immediately voting heavily
        "COORDINATED_VOTING_TIMING", // Multiple accounts voting at same time
        "ENGAGEMENT_WITHOUT_LISTENING" // Voting without sufficient listen time
      ],
      action: "REQUIRE_ADDITIONAL_VERIFICATION"
    },
    
    socialAnomalies: {
      checks: [
        "SOCK_PUPPET_DETECTION", // Fake accounts supporting specific artists
        "FOLLOW_FARM_DETECTION", // Mass following/unfollowing patterns
        "BLAST_SPAM_DETECTION", // Excessive blasting from same accounts
        "SEARCH_PARTY_MANIPULATION" // Coordinated search party activities
      ],
      action: "SUSPEND_ENGAGEMENT_PRIVILEGES"
    }
  },
  
  // Response Actions
  responseActions: {
    flagForReview: {
      process: "ADMIN_INVESTIGATION_QUEUE",
      userImpact: "ENGAGEMENT_CONTINUES_BUT_FLAGGED",
      timeframe: "48_HOUR_REVIEW_WINDOW"
    },
    
    requireVerification: {
      process: "ADDITIONAL_IDENTITY_VERIFICATION",
      userImpact: "ENGAGEMENT_SUSPENDED_UNTIL_VERIFIED",
      methods: ["PHONE_VERIFICATION", "ID_VERIFICATION", "SOCIAL_VERIFICATION"]
    },
    
    suspendPrivileges: {
      duration: "7_DAYS_TO_PERMANENT",
      impact: "NO_VOTING_OR_ENGAGEMENT_ALLOWED",
      appeal: "USER_CAN_APPEAL_WITH_EVIDENCE"
    },
    
    communityBan: {
      scope: "SPECIFIC_COMMUNITY_OR_PLATFORM_WIDE",
      duration: "30_DAYS_TO_PERMANENT",
      impact: "NO_ACCESS_TO_AFFECTED_COMMUNITIES"
    }
  }
}
```

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Database Schema**

#### **Song Priority Table (Core Algorithm Data)**
```sql
CREATE TABLE SongPriorities (
  id SERIAL PRIMARY KEY,
  song_id INT REFERENCES Songs(id),
  community_id INT REFERENCES Communities(id),
  tier ENUM('CITYWIDE', 'STATEWIDE', 'NATIONAL') NOT NULL,
  
  -- Priority Calculations
  time_based_priority DECIMAL(8, 4) DEFAULT 0.0000,
  community_priority DECIMAL(8, 4) DEFAULT 0.0000,
  final_priority DECIMAL(8, 4) DEFAULT 0.0000,
  
  -- Community Threshold Tracking
  community_threshold_reached BOOLEAN DEFAULT FALSE,
  total_unique_listeners INT DEFAULT 0,
  required_listeners_threshold INT DEFAULT 0,
  threshold_calculation_date TIMESTAMP,
  
  -- Engagement Metrics
  total_likes INT DEFAULT 0,
  total_dislikes INT DEFAULT 0,
  total_skips INT DEFAULT 0,
  total_full_listens INT DEFAULT 0,
  total_blasts INT DEFAULT 0,
  total_favorites INT DEFAULT 0,
  
  -- Tier Progression Tracking
  total_upvotes INT DEFAULT 0,
  total_downvotes INT DEFAULT 0,
  upvote_threshold INT DEFAULT 10, -- Varies by tier
  ready_for_promotion BOOLEAN DEFAULT FALSE,
  promoted_at TIMESTAMP,
  
  -- Performance Metrics
  plays_last_hour INT DEFAULT 0,
  plays_last_day INT DEFAULT 0,
  plays_last_week INT DEFAULT 0,
  engagement_score DECIMAL(6, 4) DEFAULT 0.0000,
  
  -- Algorithm State
  last_priority_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  algorithm_version VARCHAR(10) DEFAULT '1.0',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(song_id, community_id, tier),
  INDEX(community_id, tier, final_priority DESC),
  INDEX(song_id, tier),
  INDEX(ready_for_promotion, upvote_threshold),
  INDEX(last_priority_update)
);
```

#### **Song Engagement Table**
```sql
CREATE TABLE SongEngagements (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Users(id),
  song_id INT REFERENCES Songs(id),
  community_id INT REFERENCES Communities(id),
  tier ENUM('CITYWIDE', 'STATEWIDE', 'NATIONAL') NOT NULL,
  
  -- Engagement Type
  engagement_type ENUM(
    'LIKE', 'DISLIKE', 'NEUTRAL', 'SKIP', 'FULL_LISTEN', 
    'UPVOTE', 'DOWNVOTE', 'BLAST', 'FAVORITE', 'UNFAVORITE'
  ) NOT NULL,
  
  -- Engagement Data
  engagement_weight DECIMAL(6, 2) NOT NULL,
  listen_duration DECIMAL(8, 2), -- Seconds listened
  song_duration DECIMAL(8, 2), -- Total song duration
  listen_percentage DECIMAL(5, 2), -- Percentage of song heard
  skip_time DECIMAL(8, 2), -- When user skipped (if applicable)
  
  -- Validation Data
  location_verified BOOLEAN DEFAULT FALSE,
  gps_coordinates POINT,
  location_accuracy DECIMAL(8, 2), -- GPS accuracy in meters
  ip_address INET,
  user_agent TEXT,
  
  -- Anti-Fraud
  fraud_score DECIMAL(4, 3) DEFAULT 0.000, -- 0.000 to 1.000
  validation_status ENUM('VALID', 'FLAGGED', 'INVALID') DEFAULT 'VALID',
  fraud_reasons TEXT[], -- Array of fraud detection reasons
  
  -- Context
  listening_session_id VARCHAR(255), -- Track user sessions
  previous_engagement ENUM('LIKE', 'DISLIKE', 'NEUTRAL'), -- What they changed from
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, song_id, tier, engagement_type), -- Prevent duplicate primary engagements
  INDEX(song_id, tier, engagement_type),
  INDEX(user_id, created_at),
  INDEX(community_id, tier, created_at),
  INDEX(validation_status, fraud_score)
);
```

#### **User Listening History Table**
```sql
CREATE TABLE UserListeningHistory (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Users(id),
  song_id INT REFERENCES Songs(id),
  community_id INT REFERENCES Communities(id),
  tier ENUM('CITYWIDE', 'STATEWIDE', 'NATIONAL') NOT NULL,
  
  -- Play Details
  play_started_at TIMESTAMP NOT NULL,
  play_ended_at TIMESTAMP,
  listen_duration DECIMAL(8, 2), -- Actual time listened
  song_duration DECIMAL(8, 2), -- Total song duration
  completion_percentage DECIMAL(5, 2), -- How much of song was heard
  
  -- Play Context
  play_method ENUM('QUEUE', 'SKIP_TO', 'REPLAY', 'FAVORITE_PLAY') DEFAULT 'QUEUE',
  user_action ENUM('COMPLETED', 'SKIPPED', 'INTERRUPTED') NOT NULL,
  skip_reason VARCHAR(100), -- Why user skipped (if applicable)
  
  -- Device & Location
  device_type VARCHAR(100),
  ip_address INET,
  gps_coordinates POINT,
  
  -- Session Context
  listening_session_id VARCHAR(255),
  queue_position INT, -- Position in user's queue
  previous_song_id INT REFERENCES Songs(id),
  next_song_id INT REFERENCES Songs(id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX(user_id, play_started_at),
  INDEX(song_id, tier, play_started_at),
  INDEX(community_id, play_started_at),
  INDEX(listening_session_id)
);
```

#### **Song Tier Progressions Table**
```sql
CREATE TABLE SongTierProgressions (
  id SERIAL PRIMARY KEY,
  song_id INT REFERENCES Songs(id),
  from_tier ENUM('CITYWIDE', 'STATEWIDE', 'NATIONAL'),
  to_tier ENUM('STATEWIDE', 'NATIONAL') NOT NULL,
  
  -- Progression Metrics
  upvotes_received INT NOT NULL,
  upvotes_required INT NOT NULL,
  community_id INT REFERENCES Communities(id), -- Community where progression originated
  
  -- Validation Data
  total_voters INT NOT NULL,
  unique_voter_locations INT NOT NULL, -- Geographic diversity of voters
  fraud_checks_passed BOOLEAN DEFAULT TRUE,
  admin_approved BOOLEAN DEFAULT TRUE,
  
  -- Performance Before Promotion
  final_community_score DECIMAL(8, 4),
  total_plays_before_promotion INT,
  total_engagement_before_promotion INT,
  community_ranking_before_promotion INT,
  
  -- Timing
  progression_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  validation_completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX(song_id, progression_date),
  INDEX(from_tier, to_tier),
  INDEX(community_id, progression_date)
);
```

### **API Endpoints**

#### **Fair Play Algorithm Endpoints**
```javascript
const fairPlayRoutes = {
  'GET /radio/next-song': {
    headers: { authorization: 'Bearer token' },
    query: {
      tier: 'CITYWIDE|STATEWIDE|NATIONAL',
      lastSongId: 'int?',
      sessionId: 'string'
    },
    response: {
      song: {
        songId: 'int',
        title: 'string',
        artistName: 'string',
        duration: 'float',
        audioUrl: 'string',
        tier: 'string',
        communityOrigin: 'string',
        currentPriority: 'float',
        albumArtwork: 'string'
      },
      queuePreview: 'array', // Next 3-5 songs
      userEngagementHistory: {
        hasLiked: 'boolean',
        hasDisliked: 'boolean',
        hasUpvoted: 'boolean',
        hasFavorited: 'boolean',
        previousSkips: 'int'
      }
    }
  },
  
  'POST /radio/song-engagement': {
    headers: { authorization: 'Bearer token' },
    body: {
      songId: 'int',
      tier: 'string',
      engagementType: 'LIKE|DISLIKE|SKIP|FULL_LISTEN|UPVOTE|DOWNVOTE|BLAST|FAVORITE',
      listenDuration: 'float?',
      skipTime: 'float?',
      gpsCoordinates: { lat: 'float', lng: 'float' },
      sessionId: 'string'
    },
    response: {
      success: {
        engagementRecorded: 'boolean',
        newPriorityScore: 'float',
        tierProgressionStatus: 'object',
        userActivityPoints: 'int'
      },
      error: {
        message: 'string',
        validationFailed: 'array',
        fraudDetected: 'boolean'
      }
    }
  },
  
  'GET /radio/song-statistics/:songId/:tier': {
    headers: { authorization: 'Bearer token' },
    response: {
      songStatistics: {
        totalPlays: 'int',
        uniqueListeners: 'int',
        averageListenTime: 'float',
        completionRate: 'float',
        engagementBreakdown: {
          likes: 'int',
          dislikes: 'int',
          skips: 'int',
          blasts: 'int',
          favorites: 'int'
        },
        tierProgression: {
          upvotes: 'int',
          upvotesNeeded: 'int',
          readyForPromotion: 'boolean'
        },
        communityRanking: 'int',
        priorityScore: 'float'
      }
    }
  }
}
```

#### **Tier Management Endpoints**
```javascript
const tierRoutes = {
  'POST /tiers/switch': {
    headers: { authorization: 'Bearer token' },
    body: { tier: 'CITYWIDE|STATEWIDE|NATIONAL' },
    response: {
      success: {
        newTier: 'string',
        availableSongs: 'int',
        queueReset: 'boolean',
        nextSong: 'SongObject'
      },
      error: {
        message: 'string',
        accessDenied: 'boolean',
        tierNotAvailable: 'boolean'
      }
    }
  },
  
  'GET /tiers/available': {
    headers: { authorization: 'Bearer token' },
    response: {
      availableTiers: [
        {
          tier: 'string',
          accessible: 'boolean',
          songCount: 'int',
          lastActivity: 'timestamp',
          userCanVote: 'boolean'
        }
      ],
      currentTier: 'string',
      homeScene: 'CommunityObject'
    }
  },
  
  'GET /tiers/:tier/community-stats': {
    headers: { authorization: 'Bearer token' },
    response: {
      communityStatistics: {
        totalSongs: 'int',
        activeSongs: 'int',
        totalArtists: 'int',
        averagePriority: 'float',
        topSongs: 'array',
        recentPromotions: 'array',
        engagementTrends: 'object'
      }
    }
  }
}
```

#### **Artist Analytics Endpoints**
```javascript
const artistAnalyticsRoutes = {
  'GET /analytics/my-songs': {
    headers: { authorization: 'Bearer token' },
    query: {
      timeRange: '7d|30d|90d|all',
      tier: 'CITYWIDE|STATEWIDE|NATIONAL|all'
    },
    response: {
      songs: [
        {
          songId: 'int',
          title: 'string',
          tier: 'string',
          statistics: {
            totalPlays: 'int',
            uniqueListeners: 'int',
            averageRating: 'float',
            priorityScore: 'float',
            tierProgression: 'object',
            geographicReach: 'object',
            engagementTrends: 'object'
          }
        }
      ],
      summary: {
        totalPlays: 'int',
        totalListeners: 'int',
        averageEngagement: 'float',
        promotedSongs: 'int'
      }
    }
  },
  
  'GET /analytics/song/:songId/detailed': {
    headers: { authorization: 'Bearer token' },
    response: {
      detailedAnalytics: {
        performanceByTier: 'object',
        engagementTimeline: 'array',
        geographicBreakdown: 'object',
        listenerDemographics: 'object',
        priorityScoreHistory: 'array',
        tierProgressionHistory: 'array'
      }
    }
  }
}
```

### **Background Processing Jobs**

#### **Priority Update Jobs**
```javascript
const backgroundJobs = {
  updateSongPriorities: {
    schedule: '*/15 * * * *', // Every 15 minutes
    process: [
      'FETCH_SONGS_NEEDING_PRIORITY_UPDATE',
      'CALCULATE_TIME_BASED_PRIORITIES',
      'CALCULATE_COMMUNITY_BASED_PRIORITIES',
      'DETERMINE_FINAL_PRIORITIES',
      'UPDATE_DATABASE_RECORDS',
      'CLEAR_USER_QUEUE_CACHES'
    ],
    performance: 'HIGH_PRIORITY',
    timeout: '10_MINUTES'
  },
  
  evaluateCommunityThresholds: {
    schedule: '0 */4 * * *', // Every 4 hours
    process: [
      'CHECK_SONGS_FOR_THRESHOLD_ELIGIBILITY',
      'CALCULATE_COMMUNITY_EXPOSURE_PERCENTAGES',
      'UPDATE_THRESHOLD_STATUS',
      'TRIGGER_COMMUNITY_PRIORITY_CALCULATIONS',
      'LOG_THRESHOLD_CHANGES'
    ],
    performance: 'MEDIUM_PRIORITY'
  },
  
  processTierProgressions: {
    schedule: '*/30 * * * *', // Every 30 minutes
    process: [
      'CHECK_SONGS_READY_FOR_PROMOTION',
      'VALIDATE_UPVOTE_REQUIREMENTS',
      'RUN_FRAUD_DETECTION_CHECKS',
      'PROMOTE_ELIGIBLE_SONGS',
      'NOTIFY_ARTISTS_AND_COMMUNITIES',
      'UPDATE_COMMUNITY_STATISTICS'
    ],
    performance: 'HIGH_PRIORITY'
  },
  
  cleanupOldData: {
    schedule: '0 2 * * 0', // Weekly on Sunday at 2 AM
    process: [
      'ARCHIVE_OLD_LISTENING_HISTORY',
      'CLEANUP_EXPIRED_ENGAGEMENT_RECORDS',
      'REMOVE_OBSOLETE_PRIORITY_RECORDS',
      'OPTIMIZE_DATABASE_INDEXES'
    ],
    performance: 'LOW_PRIORITY'
  }
}
```

---

## 🔄 **USER FLOWS & INTEGRATION**

### **1. NEW SONG UPLOAD TO FAIR PLAY INTEGRATION**

#### **Song Upload → Fair Play Integration Flow**
```
Artist Uploads New Song
├── Song Processing & Validation
├── Community Assignment Based on Artist Location
├── Initial Fair Play Record Creation
│   ├── Create SongPriorities Record
│   │   ├── tier = 'CITYWIDE'
│   │   ├── community_id = artist.homeCommunity
│   │   ├── time_based_priority = LOG(0 + 1) = 0.0
│   │   ├── community_threshold_reached = FALSE
│   │   └── upvote_threshold = 10 (citywide default)
│   └── Initialize Engagement Tracking
│
├── Song Goes Live
├── Fair Play Algorithm Begins Rotation
│   ├── Time-based Priority Active (Phase 1)
│   ├── Song Added to Community Queue
│   └── Available for User Selection
│
└── Community Exposure Tracking Begins
    ├── Track Unique Listeners
    ├── Monitor Community Threshold (15% of citywide)
    └── Evaluate for Community-based Priority Switch
```

### **2. USER LISTENING & ENGAGEMENT FLOW**

#### **RaDIYo Player Experience**
```
User Opens RaDIYo Player
├── Load User's Home Scene (Default: Citywide)
├── Generate Personalized Queue
│   ├── Fetch Eligible Songs for Tier
│   ├── Apply Priority-weighted Selection
│   ├── Consider User Listening History
│   ├── Ensure Artist Variety
│   └── Create Queue of 10 Songs
│
├── Play Next Song
│   ├── Log Play Start in UserListeningHistory
│   ├── Display Song Information
│   ├── Show Engagement Controls
│   └── Track Listening Progress
│
User Engages with Song
├── Primary Engagement (Like/Dislike)
│   ├── Validate GPS Location
│   ├── Check One-per-tier Restriction
│   ├── Record in SongEngagements
│   ├── Update SongPriorities Metrics
│   └── Award Activity Points
│
├── Tier Progression (Upvote/Downvote)
│   ├── Validate Home Scene Membership
│   ├── Check GPS Verification
│   ├── Record Vote in SongEngagements
│   ├── Update Upvote Count
│   ├── Check Promotion Threshold
│   └── Trigger Promotion if Threshold Met
│
├── Social Engagement (Blast/Favorite)
│   ├── Record Engagement
│   ├── Update Community Feed (if Blast)
│   ├── Add to Personal Collection (if Favorite)
│   └── Update Priority Metrics
│
└── Listening Completion
    ├── Log Final Listen Duration
    ├── Determine Full Listen vs Skip
    ├── Update Engagement Metrics
    └── Queue Next Song
```

### **3. TIER PROGRESSION FLOW**

#### **Song Promotion Process**
```
Song Reaches Upvote Threshold
├── Automated Validation Process
│   ├── Verify All Votes are Valid
│   │   ├── GPS Verification Check
│   │   ├── Home Scene Membership Check
│   │   ├── Anti-fraud Score Review
│   │   └── Vote Timing Analysis
│   │
│   ├── Geographic Distribution Analysis
│   │   ├── Ensure Votes from Multiple Areas
│   │   ├── Prevent Single-location Manipulation
│   │   └── Validate Community Spread
│   │
│   └── Final Validation
│       ├── Admin Approval (if needed)
│       ├── Community Health Check
│       └── Artist Status Validation
│
├── Song Promotion Execution
│   ├── Update Song Tier (CITYWIDE → STATEWIDE)
│   ├── Create New SongPriorities Record for New Tier
│   ├── Reset Tier-specific Metrics
│   ├── Preserve Previous Tier Analytics
│   ├── Update Artist Analytics
│   └── Log Progression in SongTierProgressions
│
├── Community & User Notifications
│   ├── Notify Artist of Promotion
│   ├── Notify Voters of Success
│   ├── Update Community Statistics
│   ├── Add to Community Success Stories
│   └── Update Artist Profile Achievements
│
└── New Tier Integration
    ├── Song Available to Statewide Audience
    ├── Users Can Vote Again in New Tier
    ├── New Community Threshold Applied (25% for Statewide)
    ├── Time-based Priority Restart
    └── Fresh Engagement Tracking Begins
```

---

## 🧪 **TESTING & QUALITY ASSURANCE**

### **Algorithm Testing**
```javascript
const algorithmTesting = {
  priorityCalculation: {
    tests: [
      'time_based_priority_accuracy',
      'community_based_priority_calculation',
      'priority_score_normalization',
      'edge_case_handling_zero_engagement',
      'edge_case_handling_maximum_engagement',
      'priority_update_frequency',
      'cross_tier_priority_consistency'
    ]
  },
  
  fairnessValidation: {
    tests: [
      'equal_initial_exposure_verification',
      'community_threshold_accuracy',
      'weighted_selection_fairness',
      'artist_neutrality_confirmation',
      'geographic_bias_prevention',
      'new_vs_established_artist_equality'
    ]
  },
  
  tierProgression: {
    tests: [
      'upvote_threshold_accuracy',
      'vote_validation_effectiveness',
      'fraud_detection_sensitivity',
      'promotion_timing_correctness',
      'cross_tier_data_consistency',
      'artist_status_preservation'
    ]
  }
}
```

### **Performance Testing**
```javascript
const performanceTesting = {
  realTimePerformance: {
    targets: {
      songSelectionTime: '< 200ms',
      priorityCalculationTime: '< 500ms',
      engagementRecordingTime: '< 100ms',
      queueGenerationTime: '< 300ms',
      tierSwitchingTime: '< 400ms'
    }
  },
  
  scalabilityTargets: {
    concurrentListeners: 50000,
    songsInAlgorithm: 1000000,
    communitiesSupported: 50000,
    engagementsPerSecond: 1000,
    tierProgressionsPerDay: 500
  },
  
  loadTesting: {
    scenarios: [
      'peak_listening_hours',
      'mass_song_uploads',
      'simultaneous_tier_progressions',
      'high_engagement_periods',
      'algorithm_update_cycles'
    ]
  }
}
```

### **Security Testing**
```javascript
const securityTesting = {
  fraudDetection: {
    tests: [
      'location_spoofing_detection',
      'vote_manipulation_prevention',
      'coordinated_attack_resistance',
      'sock_puppet_account_detection',
      'rapid_engagement_prevention'
    ]
  },
  
  dataIntegrity: {
    tests: [
      'engagement_data_consistency',
      'priority_calculation_accuracy',
      'tier_progression_validation',
      'user_history_integrity',
      'analytics_data_reliability'
    ]
  }
}
```

---

## 🚀 **IMPLEMENTATION ROADMAP**

### **Week 1-2: Algorithm Core**
1. **Priority Calculation Engine**
   - Time-based priority algorithm
   - Community-based priority algorithm
   - Final priority aggregation logic

2. **Database Schema Implementation**
   - Create all Fair Play tables
   - Set up indexing for performance
   - Implement update triggers

### **Week 3-4: Engagement System**
1. **Engagement Tracking**
   - User interaction logging
   - Engagement weight calculation
   - Real-time metric updates

2. **Anti-Fraud Foundation**
   - Basic fraud detection
   - GPS verification integration
   - Behavior pattern analysis

### **Week 5-6: Tier Management**
1. **Tier Progression Logic**
   - Upvote threshold tracking
   - Automatic promotion system
   - Cross-tier data management

2. **RaDIYo Player Integration**
   - Song selection algorithm
   - Queue management system
   - Tier switching functionality

### **Week 7-8: Advanced Features**
1. **Community Threshold System**
   - Exposure percentage calculation
   - Algorithm phase switching
   - Community health impact

2. **Performance Optimization**
   - Query optimization
   - Caching strategies
   - Background job efficiency

### **Week 9-10: Security & Polish**
1. **Advanced Anti-Fraud**
   - Sophisticated fraud detection
   - Admin investigation tools
   - Community integrity monitoring

2. **Analytics & Monitoring**
   - Algorithm performance tracking
   - Artist analytics dashboards
   - Community impact analysis

---

## 📊 **SUCCESS METRICS**

### **Algorithm Effectiveness**
- Fair exposure rate: >95% of songs reach community threshold
- Priority accuracy: Community ratings correlate >85% with algorithm priorities
- Tier progression fairness: Geographic diversity in voting >80%
- Anti-fraud effectiveness: False positive rate <5%

### **User Experience**
- Engagement rate: >60% of songs receive user engagement
- Queue satisfaction: <10% skip rate for algorithmically selected songs
- Tier switching adoption: >40% of users regularly switch tiers
- Community participation: >70% of users vote on songs

### **Business Impact**
- Artist retention: >85% of artists continue uploading after first song
- Community growth: >15% monthly growth in active communities
- Platform differentiation: Fair Play Algorithm as key differentiator
- Scalability: Support for 1M+ songs without performance degradation

---

*This completes the comprehensive Fair Play Algorithm & RaDIYo System specification. This system represents the core innovation of UPRISE and transforms how music discovery works by democratizing exposure while allowing community taste to guide curation.*

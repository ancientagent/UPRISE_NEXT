# UPRISE User Roles & Authentication Specification

## Overview

This document outlines the complete user role system and authentication requirements for the UPRISE platform, defining permissions, capabilities, and technical specifications for each user type.

## Core User Types

### **1. ARTIST Role**

**Core Permissions:**
```
- can_upload_songs: true (max 3 simultaneous)
- can_create_events: true
- can_manage_artist_profile: true
- can_access_artist_analytics: true
- can_record_promotional_ads: true (paid feature)
- can_enroll_vip_program: true
- can_purchase_tour_promotions: true
- can_receive_followers: true
- can_view_fan_demographics: true
- can_manage_mix_permissions: true
- can_approve_mix_requests: true
- can_set_mix_auto_approval_settings: true
```

**Content Capabilities:**
```
- max_songs_in_rotation: 3
- can_upload_artist_media: true (photos, bio, links)
- can_create_event_flyers: true
- can_schedule_events: true
- promotional_ad_length: 10 seconds (paid)
- promotional_ad_access_citywide: true (paid)
- promotional_ad_access_statewide: unlocked_if_song_on_statewide_tier
- promotional_ad_access_national: unlocked_if_song_on_national_tier
```

**Analytics Access:**
```
- song_performance_metrics: true (across all tiers where songs appear)
- geographic_performance_data: true (citywide/statewide/national song reach)
- fan_engagement_statistics: true
- tour_route_recommendations: true (future feature)
- cross_community_performance: true (song performance in other communities)
- artist_status_unchanged: true (remains home community member regardless of song success)
```

**Geographic Features:**
```
- belongs_to_home_scene: true (never changes regardless of song success)
- can_vote_in_home_scene: true
- can_tour_promote_multi_city: true (paid)
- song_tier_progression: citywide → statewide → national (songs only, not artist status)
```

**Mix Permission Management:**
```
- can_approve_mix_requests: true
- can_deny_mix_requests: true
- trusted_mixologists_list: editable array
- can_set_auto_approval_settings: true
- can_set_minimum_mix_price_threshold: true
- can_revoke_auto_approvals: true
- mix_permission_notifications: configurable
- auto_decline_below_threshold: configurable
```

### **2. LISTENER (Non-Artist) Role**

**Core Permissions:**
```
- can_vote_songs: true (home scene only)
- can_favorite_songs: true
- can_favorite_scenes: true
- can_follow_artists: true
- can_blast_songs: true
- can_skip_songs: true
- can_report_content: true
- can_join_search_parties: true
- can_access_discovery: false (paid upgrade)
```

**Voting Restrictions:**
```
- voting_location_verified: required (GPS)
- can_vote_per_song_per_tier: 1
- voting_restricted_to: home_scene_only
- can_upvote: true
- can_downvote: true
```

**Social Features:**
```
- can_create_search_parties: true
- can_join_search_parties: true
- activity_score_tracking: true
- can_access_social_boards: true (when implemented)
- vibe_score_eligible: true (opt-in)
- can_blast_content: true (songs, mixes, artists, communities, events, tours, businesses, mixologists, venues)
```

**Subscription Upgrades:**
```
- discovery_section_access: false (requires paid)
- mixologist_capability: false (requires paid upgrade)
- vip_club_participation: false (requires paid)
- tour_guide_services: false (requires paid upgrade)
```

### **3. PROMOTER Role**

**Core Permissions:**
```
- can_create_promotion_posts: true
- can_upload_promotional_media: true
- can_schedule_posts: true
- can_access_multi_city: true
- can_promote_external_events: true
- can_view_community_stats: true (limited)
```

**Content Capabilities:**
- Max image uploads: 10 per post
- Max post length: 750 characters
- Content types: text, image, external_link, event_details
- Can create event series and cross-post cities

**Use Cases:**
- Music promoters and booking agents
- General event promoters
- Festival organizers
- Entertainment companies

### **4. MERCHANT Role**

**Core Permissions:**
```
- can_create_promotion_posts: true
- can_upload_promotional_media: true
- can_create_coupons: true
- can_schedule_posts: true
- can_view_local_community_stats: true (limited)
- can_sponsor_artist_shows: true
```

**Content Capabilities:**
- Max image uploads: 5 per post
- Max post length: 500 characters
- Content types: text, image, coupon, business_hours
- Can create recurring specials

**Use Cases:**
- Restaurants and cafes
- Music gear shops
- Record stores
- General local businesses

### **5. VENUE Role**

**Core Permissions:**
```
- can_create_events: true
- can_manage_venue_profile: true
- can_write_artist_reviews: true (private, venue-to-venue)
- can_read_artist_reviews: true (from other venues)
- can_facilitate_sponsorships: true
- can_access_booking_tools: true
- can_view_venue_analytics: true
```

**Unique Features:**
- Venue capacity and type management
- Artist review system (private network)
- Show revenue analytics
- Sponsorship facilitation tools
- Booking calendar integration

**Use Cases:**
- Music venues and clubs
- Theaters and performance spaces
- Festival grounds
- Bars with live music

### **6. ADMIN Role**

**Core Permissions:**
```
- can_moderate_all_content: true
- can_suspend_users: true
- can_manage_communities: true
- can_access_platform_analytics: true
- can_manage_payment_disputes: true
- can_verify_business_locations: true
- can_investigate_reports: true
- can_manage_fair_play_algorithm: true
```

**Content Moderation:**
```
- can_remove_songs: true
- can_remove_posts: true
- can_ban_users: true
- can_investigate_vote_manipulation: true
- can_manage_community_standards: true
```

**Platform Management:**
```
- can_create_new_communities: true
- can_adjust_algorithm_parameters: true
- can_view_all_user_data: true
- can_generate_platform_reports: true
- can_manage_subscription_tiers: true
```

### **7. MIXOLOGIST Role (Phase 2 - Inactive)**

**Core Permissions:**
```
- can_create_mixes: true
- can_sell_mixes: true
- can_access_mix_market: true
- can_curate_playlists: true
- can_set_mix_prices: true
- can_view_mix_analytics: true
- can_feature_discovered_artists: true
- can_build_mixologist_persona: true
- can_gain_followers: true
- can_request_artist_permissions: true
```

**Persona/Brand Building:**
```
- can_create_mixologist_name: true
- can_upload_mixologist_avatar: true
- can_write_mixologist_bio: true
- can_build_follower_base: true
- can_manage_mixologist_profile: true
- can_respond_to_fan_engagement: true
```

**Content Capabilities:**
```
- max_active_mixes: 10 (or subscription-based limit)
- max_songs_per_mix: 25
- can_add_mix_descriptions: true
- can_upload_mix_artwork: true
- can_set_mix_categories: true (genre, mood, theme)
- can_schedule_mix_releases: true
- can_create_mix_series: true
```

**Artist Permission System:**
```
- must_request_artist_permission: true
- can_replace_denied_songs: true
- cannot_change_terms_after_approval: true
- permission_request_timeline: configurable
- can_negotiate_with_artists: true (outside platform)
```

**Discovery & Curation:**
```
- enhanced_discovery_access: true
- can_discover_across_all_communities: true
- vibe_score_recommendations: true (for finding artists to feature)
- can_save_artists_for_future_mixes: true
- can_track_artist_performance_trends: true
- receives_personalized_artist_suggestions: true
```

**Revenue Features:**
```
- can_set_mix_prices: true
- revenue_split_percentage: 20
- can_view_sales_analytics: true
- can_track_artist_payouts: true
- payment_processing_integration: true
- can_offer_free_mixes: true (for building following)
```

**Mix Market Integration:**
```
- can_publish_to_mix_market: true
- can_promote_mixes: true (additional paid feature)
- can_respond_to_mix_reviews: true
- vibe_score_visibility: true (helps users find compatible mixologists)
- appears_in_compatibility_recommendations: true
- can_be_blasted: true
- can_be_followed: true
- can_be_liked_or_favorited: true
- cannot_be_shared: true (due to monetization)
```

**Account Requirements:**
```
- base_listener_account: required
- subscription_upgrade_cost: $4/month (from $5.99 to $9.99 total)
- vibe_score_participation: required (for recommendations and compatibility)
- minimum_platform_engagement: recommended (but not required)
```

**Success Metrics (Non-Vibe Score Based):**
```
- follower_count: tracked
- mix_sales_volume: tracked
- user_ratings_on_mixes: tracked (1-5 stars)
- engagement_metrics: tracked (likes, blasts, comments)
- repeat_customer_rate: tracked
- featured_artist_feedback: tracked
```

**Vibe Score Integration:**
```
- receives_artist_recommendations: true (based on their taste profile)
- visible_to_compatible_users: true (system recommends to similar tastes)
- compatibility_scoring_with_potential_followers: true
- does_not_determine_mixologist_quality: true
```

**Phase 2 Implementation Notes:**
```
- feature_flag_controlled: MIXOLOGIST_ENABLED = false
- ui_elements_hidden: until activation
- database_schema_included: in initial build
- payment_processing_ready: but inactive
- persona_branding_tools_ready: but inactive
```

### **8. AMBASSADOR Role (Phase 2 - Inactive)**

**Core Permissions:**
```
- can_offer_tour_services: true
- can_manage_service_categories: true
- can_set_service_availability: true
- can_accept_booking_requests: true
- can_write_artist_reviews: true (private, for other ambassadors)
- can_read_artist_reviews: true (from other ambassadors)
- can_receive_artist_reviews: true (from artists, for other artists to read)
- can_earn_activity_points: true
- can_serve_multiple_communities: true (if member)
```

**Service Categories:**
```
- lodging (couch surfing, spare rooms)
- equipment (rental, repair, storage)
- personal_services (haircuts, laundry, etc.)
- food_hospitality (meals, local restaurant guides)
- transportation (rides to venues, gear hauling)
- professional_services (sound tech, merch help, local promotion)
- basic_needs (showers, wifi, phone charging)
```

**Account Requirements:**
```
- base_listener_account: required ($5.99/month)
- no_upgrade_fee: true (additional permissions only)
- community_membership_required: true (for each city they serve)
- gps_verification: required (same as voting system)
- primarily_donation_based: true (initially)
```

**Discovery & Booking:**
```
- discoverable_via_map_view: true
- appears_in_community_statistics: true
- filterable_by_service_category: true
- uses_existing_calendar_system: true
- google_calendar_sync: true
- booking_confirmation_process: true
```

**Community Integration:**
```
- must_be_community_member: true (for each city served)
- can_serve_multiple_cities: true (if verified member of each)
- activity_points_earned: true
- appears_in_community_statistics: true
```

**Review System (Peer-to-Peer):**
```
- ambassadors_review_artists: true (private, ambassador-to-ambassador)
- artists_review_ambassadors: true (private, artist-to-artist)
- bidirectional_quality_control: true
- direct_agreements: true (no UPRISE mediation initially)
```

**Revenue Model:**
```
- no_uprise_transaction_fees: true (initially)
- direct_payment_between_parties: true
- future_monetization_possible: true
- app_store_compliance_required: true (for future payments)
```

**Phase 2 Implementation:**
```
- feature_flag_controlled: AMBASSADOR_ENABLED = false
- ui_elements_hidden: until activation
- calendar_integration_ready: true
- review_system_ready: true
- no_payment_processing_initially: true
```

## Universal Platform Features

### **Blast System (All User Roles)**

**Blastable Elements:**
```
- songs (during Fair Play or from favorites)
- mixes (from Mix Market)
- artists/bands (showing support)
- communities/scenes (promoting scenes)
- events (promoting shows)
- tours (supporting artist tours)
- businesses (in promotions section)
- mixologists (promoting curators)
- venues (supporting local venues)
```

**Blast Functionality:**
```
- blast_visibility: appears in user's community feed
- blast_message: "User is blasting [item]"
- blast_analytics: tracked for trend analysis
- blast_frequency_limits: prevent spam
- blast_community_reach: visible to home scene by default
- universal_blast_target_types: enum [song, mix, artist, community, event, tour, business, mixologist, venue]
```

**Trend Analysis Value:**
```
- real_time_trend_detection: across all platform elements
- community_activity_measurement: true
- cross_community_trend_spreading: true
- business_venue_popularity_tracking: true
- artist_momentum_indicators: true
```

### **Map View Discovery System (Phase 1)**

**Core Functionality:**
```
- flag_size: based on community population count
- flag_color: genre (dynamic per user's view)
- flag_saturation: activity level (bright = active, dim = less active)
- tier_scaling: shows communities at user's current listening tier
- genre_filtering: shows only user's favorited genres
```

**Community Discovery:**
```
- click_flag: opens community statistics panel
- visit_button: allows paid users to enter that community
- ambassador_services: visible in community statistics (filterable)
- real_time_data: population, activity, events, releases
```

**User Integration:**
```
- free_users: can view map but cannot visit communities
- paid_users: can visit any community via discovery access
- context_aware: map shows content relevant to user's tier and preferences
- seamless_integration: with existing discovery subscription model
```

## Authentication Requirements

### **All Users (Base Requirements):**
```
- email_verification: required
- gps_location_verification: required (for voting/community assignment)
- age_verification: required (13+)
- terms_acceptance: required
- privacy_policy_acceptance: required
```

### **Location-Based Authentication:**
```
- verified_zip_code: required
- gps_coordinates: required (for voting integrity)
- community_assignment: automatic (based on location + genre)
- location_update_frequency: periodic (to prevent fraud)
```

### **Payment Integration:**
```
- payment_method_storage: optional
- subscription_status_tracking: required
- billing_cycle_management: required
- payment_failure_handling: required
```

## Subscription Tiers (Business Roles)

### **Basic Tier**
**Access:**
- Local communities only (25-mile radius from verified location)
- Limited posts per month
- Basic analytics

### **Premium Tier**
**Access:**
- Local communities included
- Full statewide access within verified state
- Increased post limits
- Enhanced analytics
- Scheduling capabilities

### **Enterprise Tier**
**Access:**
- Local and statewide access included
- National access (primarily for promoters)
- Unlimited community access
- Priority placement options
- Advanced analytics and reporting

## Role Upgrade Paths

### **Listener → Artist:**
```
- requires: artist_verification_process
- changes: gains upload_songs, create_events, analytics_access
- retains: all listener permissions
- note: all artists have same permissions regardless of song success
```

### **Any User → Business Roles:**
```
- requires: business_verification, location_verification
- separate_account: recommended (or role_switching capability)
- payment_required: true
```

### **Artist Success Clarification:**
```
- song_tier_progression: songs move through tiers, not artists
- artist_permissions_unchanged: success doesn't change artist role or permissions
- community_membership_permanent: artists remain in home scene regardless of song reach
- no_artist_tier_system: all artists have identical permissions and access
```

## Database Schema

### **User Table:**
```sql
- user_id (primary key)
- email (unique)
- role (enum: artist, listener, admin, promoter, merchant, venue)
- verified_location (geolocation)
- home_scene_id (foreign key)
- subscription_tier (enum)
- account_status (enum: active, suspended, banned)
- gps_verification_status (boolean)
- created_at (timestamp)
- last_location_update (timestamp)
```

### **User Permissions Table:**
```sql
- user_id (foreign key)
- permission_name (string)
- permission_value (boolean)
- granted_at (timestamp)
- expires_at (timestamp, nullable)
```

### **Business User Fields (Additional):**
```sql
- business_name (string)
- business_type (enum: promoter, merchant, venue)
- verified_location (geolocation)
- subscription_tier (enum: basic, premium, enterprise)
- local_access (boolean)
- statewide_access (boolean)
- national_access (boolean)
- allowed_community_ids (array)
- posts_this_month (integer)
- account_status (enum)
```

## API Endpoints by Role

### **All Users:**
```
POST /auth/login
POST /auth/logout
POST /auth/verify-location
GET /user/profile
PUT /user/profile
GET /user/permissions
POST /blast/create
GET /blast/my-blasts
GET /feed/community-blasts
GET /map/communities
GET /map/community/:id/stats
POST /map/community/:id/visit (paid users only)
```

### **Artist-Specific:**
```
POST /songs/upload
GET /analytics/my-songs
POST /events/create
GET /followers/list
POST /vip-program/enroll
POST /tour-promotions/purchase
GET /mix-requests/pending
POST /mix-requests/:id/approve
POST /mix-requests/:id/deny
PUT /settings/mix-auto-approval
GET /settings/trusted-mixologists
POST /settings/mixologist/:id/revoke-approval
POST /promotional-packages/purchase
POST /promotional-ads/record
GET /promotional-ads/my-ads
GET /ambassadors/search-by-city
POST /ambassadors/book-service
GET /ambassadors/my-bookings
POST /ambassadors/review-ambassador
```

### **Listener-Specific:**
```
POST /votes/cast
GET /favorites/songs
POST /search-parties/create
GET /discovery/explore (if paid)
POST /vip-club/join
```

### **Business Roles (Shared):**
```
POST /promotions/create
GET /promotions/my-posts
PUT /promotions/:id/edit
DELETE /promotions/:id
GET /communities/allowed
GET /analytics/my-posts
POST /payment/subscription
GET /subscription/status
```

### **Venue-Specific:**
```
POST /venues/events/create
GET /venues/booking-calendar
POST /venues/artist-reviews
GET /venues/artist-reviews
POST /venues/sponsorship/facilitate
GET /venues/analytics/shows
```

### **Admin-Specific:**
```
GET /admin/platform-analytics
POST /admin/moderate-content
PUT /admin/manage-communities
GET /admin/reports/investigate
POST /admin/users/suspend
```

### **Mixologist-Specific (Phase 2):**
```
POST /mixologists/create-persona
GET /mixologists/my-profile
PUT /mixologists/update-persona
POST /mixes/create
GET /mixes/my-mixes
PUT /mixes/:id/edit
POST /mixes/request-artist-permissions
POST /mixes/publish-to-market
GET /mix-market/browse
POST /mix-market/purchase
GET /analytics/mixologist-performance
GET /revenue/mixologist-earnings
POST /mixes/:id/promote
GET /recommendations/artists-for-mixologist
GET /followers/my-followers
PUT /mixes/:id/replace-song
```

### **Ambassador-Specific (Phase 2):**
```
POST /ambassadors/activate
PUT /ambassadors/service-categories
GET /ambassadors/my-services
PUT /ambassadors/availability
GET /booking-requests/pending
POST /booking-requests/:id/accept
POST /booking-requests/:id/decline
POST /ambassadors/artist-reviews
GET /ambassadors/artist-reviews
GET /ambassadors/my-reviews-from-artists
GET /map/ambassadors-by-community
POST /ambassadors/report-service-completion
```

## Security & Moderation

### **Rate Limiting:**
- Posts per day limits based on subscription tier
- Cooldown periods between posts (4-hour minimum for business roles)
- API rate limiting per user role

### **Fraud Prevention:**
- GPS verification for voting integrity
- Location update tracking to prevent manipulation
- Multiple report threshold for automatic content suspension
- Admin investigation tools for suspicious activity

### **Content Moderation:**
- Community reporting system for all content types
- Automatic suspension after multiple reports (3+ for same reason)
- Admin review process for flagged content
- Role-specific moderation capabilities

## Implementation Notes

### **Artist Tier Clarification:**
```
- no_artist_status_tiers: all artists are community-level regardless of song success
- song_progression_only: only songs move through citywide → statewide → national tiers
- artist_permissions_consistent: all artists have identical platform permissions
- community_membership_permanent: success doesn't change artist's home scene
- touring_artist_definition: any UPRISE artist traveling to perform, regardless of song tier success
```

### **Role Switching:**
- Users may need multiple roles (e.g., Artist + Venue owner)
- Consider account linking or role-switching functionality
- Maintain separate permissions and billing for business roles

### **Scalability Considerations:**
- Permission system should be extensible for future roles
- Geographic verification system must handle high volume
- Analytics systems need real-time and batch processing capabilities

### **Compliance:**
- Age verification compliance (13+ requirement)
- Location data privacy regulations
- Payment processing compliance (PCI DSS)
- International expansion considerations for different legal requirements
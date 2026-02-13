# Artist Onboarding Flow

## Listener Signup

- User downloads UPRISE mobile app
- User creates account with email/password or social login
- User completes basic profile setup (name, location, music preferences)
- User gains access to listener features (discovery, radio, community)

## Artist Upgrade (via Profile)

- Listener navigates to Profile and selects “Become an Artist”
- User selects "Become an Artist" option
- System prompts for artist verification (optional: social media links, portfolio)
- User confirms upgrade request
- System processes upgrade and grants artist permissions

## ArtistProfile Creation

- User proceeds through artist profile creation from Profile (not in Home Scene setup)
- System prompts for essential artist information:
  - Artist name (required)
  - Super‑genre selection from taxonomy (required)
  - Bio/description (optional)
  - Location (inherited from user profile)
- User submits initial artist profile
- System creates ArtistProfile record with canonical ID

## BandName Input

- If user indicates they are part of a band:
  - System prompts for band name
  - User enters band name
  - System creates or links to existing band entity
  - Band name is associated with user's ArtistProfile
- If user is solo artist:
  - Artist name becomes the primary identifier
  - No additional band information required

## Webapp Dashboard Access

- User receives notification of successful artist upgrade
- User is provided with webapp dashboard URL
- User can access webapp using same credentials
- Dashboard provides:
  - Song upload interface
  - Analytics and performance metrics
  - Community management tools
  - Event creation and management
  - Promotion tools and campaign management

## Optional Profile Details

- User can enhance their artist profile with:
  - Profile photo/avatar
  - Cover image
  - Social media links
  - Website URL
  - Contact information
  - Music samples or demos
- User can update band information:
  - Add/remove band members
  - Update band description
  - Manage band social media
- User can set preferences:
  - Notification settings
  - Privacy controls
  - Community participation levels
  - Genre and location preferences

## Post-Onboarding Actions

- User receives welcome email with next steps
- User is encouraged to upload their first song
- Song uploads credit the artist’s home community (primary_community_key) so minutes accrue toward activation
- User is invited to join relevant communities
- User can start creating events or promotions
- User gains access to artist-specific features:
  - Song management
  - Performance analytics
  - Community engagement tools
  - Event creation and management
  - Promotion and marketing tools

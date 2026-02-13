# UPRISE Artist Onboarding Flow - Complete Step-by-Step Guide

## Complete Artist Onboarding Flow

### Phase 1: Mobile App Registration (User Acquisition)

**Step 1: Initial App Download & Launch**
- User downloads UPRISE mobile app
- App opens to welcome/onboarding screen

**Step 2: Account Creation Setup**
- User selects account creation method:
  - Manual input (email/password)
  - "Login with Gmail" option
  - Future: Bandcamp/SoundCloud integration for seamless metadata import

**Step 3: Location & Genre Selection**
- User enters city and state (Google Places API autocomplete)
- User selects primary genre preference
- App requests GPS permission for voting rights verification
- System automatically assigns user to their "home scene" (e.g., "Austin, Texas Hip Hop")

**Step 4: Artist Registration Decision Point**
- App presents question: "Would you like to register as an artist in this scene?"
- User has two paths:
  - **Listener Path**: Proceeds directly to home scene as listener
  - **Artist Path**: Checks "I am an artist" box

**Step 5: Artist-Specific Registration (if artist path selected)**
- Single additional input field appears: "Band/Artist Name"
- User enters their stage name or band name
- Optional: Brief explanation of webapp dashboard access

**Step 6: Registration Completion**
- User submits registration
- Backend simultaneously creates:
  - User record (with listener permissions)
  - Band record (linked to user as creator)
  - Default station preference (citywide tier)
- User receives confirmation and is directed to their home scene

### Phase 2: Backend Automatic Processing

**Step 7: Automatic Record Creation**
```javascript
// Simplified backend process
await User.create({
  firstName, lastName, email, password,
  city, state, genre, 
  roleId: ARTIST_ROLE,
  onBoardingStatus: 2 // Completed
});

if (isArtist) {
  await Band.create({
    title: bandName,
    createdBy: userId,
    status: 'ACTIVE',
    // All other fields optional for later completion
  });
}
```

**Step 8: Dashboard Access Preparation**
- System generates webapp login credentials (same as mobile)
- Artist dashboard is pre-configured and ready
- Rotation stack initialized with 4 empty slots

### Phase 3: Webapp Dashboard Access (Content Management)

**Step 9: First Webapp Login**
- Artist navigates to webapp using same login credentials
- System detects artist status and automatically redirects to Artist Dashboard
- No additional setup or band creation required

**Step 10: Artist Dashboard ("Mission Control")**
- Artist lands directly in their dashboard interface
- Sees immediate access to:
  - **Rotation Stack**: 4 slots (3 for songs, 1 for promotional ads)
  - **Upload Interface**: Ready for song uploads (requires profile image completion)
  - **Basic Band Profile**: Shows band name, placeholder for required profile image
  - **Analytics Section**: Prepared for future data
  - **Event Management**: Tools for creating shows

**Step 11: Required Profile Completion for Song Upload**
- Before songs can be uploaded and accepted, artist must provide:
  - **Artist Profile Image**: Required upload in same dashboard screen
  - **Song Files**: Audio files for rotation stack
  - **Album Art**: Cover art for each song
- Upload interface guides artist through required elements before submission

**Step 12: Optional Profile Enhancement**
- All additional details are optional and can be added anytime:
  - Bio/description
  - Social media links
  - Band member management
  - Gallery/photos
- Artist can enhance profile after completing required uploads

## Key Flow Principles

**1. Mobile-First User Acquisition**
- Mobile app serves as the primary entry point
- Focus on simplicity and speed of registration
- Minimal friction to get users into their home scene

**2. Single Registration Process**
- No separate band creation step
- Artist status and band entity created simultaneously
- Eliminates confusion and additional steps

**3. Webapp as Content Management Hub**
- Desktop interface optimized for detailed content management
- Immediate dashboard access upon first login
- No re-registration or additional setup required

**4. Progressive Enhancement**
- Core functionality available immediately
- Optional details can be added over time
- Artist can start uploading and engaging right away

## Error Prevention & User Experience

**Fallback Scenarios:**
- Listeners can upgrade to artist status anytime through Settings → "Become an Artist"
- If band name is missing or invalid, user is prompted before registration completion
- GPS verification failures are handled gracefully with manual location confirmation options

**User Communication:**
- Clear messaging about webapp access during mobile registration
- Explanation that detailed content management happens on desktop
- Confirmation emails with webapp login instructions

## Technical Implementation Notes

**Database Schema Requirements:**
- User table with artist role capability
- Band table with automatic creation trigger
- UserStationPreference with default citywide assignment
- Proper foreign key relationships between User and Band entities

**API Endpoints Needed:**
- `POST /auth/signup` - Handles both user and band creation
- `GET /auth/verify-artist-status` - Checks artist permissions for webapp
- `POST /band/auto-create` - Backend process for automatic band creation

**Frontend Requirements:**
- Mobile: Simple checkbox toggle for artist registration
- Webapp: Automatic redirect logic based on user role
- Progressive enhancement for optional profile fields

This streamlined flow eliminates the convoluted multi-step process and creates a seamless bridge between mobile acquisition and desktop content management, ensuring artists can begin uploading and engaging with their community as quickly as possible.
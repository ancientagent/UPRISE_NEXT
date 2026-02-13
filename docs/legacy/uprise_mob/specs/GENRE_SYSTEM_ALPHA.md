# FINAL UPDATE: Direct Sub-Genre System for Alpha (Complete Architecture Change)

> CRITICAL: Disregard ALL previous genre instructions. The Musical Families/Roots/Alliance system is scrapped for alpha. We are implementing a DIRECT SUB‑GENRE system with future expandability.

## Core Concept
- Users register directly into specific sub‑genre communities.
- No hierarchies: no super genres, no families/alliances.
- Each sub‑genre is its own community.
- Simple text prediction for genre selection.

## User Registration Flow
```text
Step 1: Location
"Enter your city and state" → "Austin, Texas"

Step 2: Direct Genre Selection
"What's your favorite genre?" → Text input with autocomplete
- User types "hardcore" → Suggest "Hardcore Punk", "Melodic Hardcore", etc.
- User selects "Hardcore Punk"

Step 3: Community Assignment
Community: "austin-texas-hardcore-punk"
- No groupings, no alliances — exact sub‑genre community
```

## Database Schema (Alpha Replacement)
```js
// REMOVE: Any Family/Alliance/SuperGenre tables

// NEW: Simple genre system
SubGenre {
  id: "hardcore-punk",
  name: "Hardcore Punk",
  aliases: ["hardcore", "hxc", "hc punk"], // For text prediction
  approved: true, // Admin controlled
  createdAt: timestamp
}

Community {
  id: "austin-texas-hardcore-punk",
  city: "Austin",
  state: "Texas",
  subGenreId: "hardcore-punk", // Direct reference to sub‑genre
  status: "active", // or "incubating"
  musicMinutes: 73,
  artistCount: 12
}

User {
  location: { city: "Austin", state: "Texas" },
  subGenreId: "hardcore-punk", // Direct assignment
  primaryCommunity: "austin-texas-hardcore-punk"
}

// FUTURE: Hidden genre tree (not user‑facing)
GenreRelationship {
  subGenreId: "hardcore-punk",
  allies: ["crust-punk", "d-beat", "powerviolence"],
  overlaps: ["street-punk", "thrash-metal"]
}
```

## Community Naming Convention
```text
Format: {city}-{state}-{sub-genre-id}
Examples:
- austin-texas-hardcore-punk
- denver-colorado-trap
- seattle-washington-grunge
- brooklyn-new-york-drill
```

## Alpha Implementation Requirements

1) Controlled Genre List (editable)
```js
// Example alpha genres (expandable; edit src/config/alpha_genres.js)
export const ALPHA_GENRES = [
  { id: "hardcore-punk", name: "Hardcore Punk", aliases: ["hardcore", "hxc"], approved: true },
  { id: "trap", name: "Trap", aliases: ["trap music"], approved: true },
  { id: "death-metal", name: "Death Metal", aliases: ["death"], approved: true },
  { id: "house", name: "House", aliases: ["house music"], approved: true },
  { id: "indie-rock", name: "Indie Rock", aliases: ["indie"], approved: true },
  // ... add 45–95 more
];
```

2) Text Prediction System
```http
GET /onboarding/genre-suggestions?q={userInput}
→ Returns matching genres from approved list

POST /onboarding/request-genre
→ For genres not in approved list; stores request for admin review
```

3) Super Admin Dashboard (API surface)
```http
GET    /admin/genres
POST   /admin/genres
PUT    /admin/genres/{id}
DELETE /admin/genres/{id}

GET  /admin/genre-requests
POST /admin/genre-requests/{id}/approve
POST /admin/genre-requests/{id}/reject

PUT /admin/genres/{id}/relationships  // future: allies/overlaps
```

4) Community Viability (unchanged)
- 50‑minute threshold per sub‑genre community.
- Revolutionary flow continues for pre‑threshold communities.
- Same activity point bonuses and activation criteria.

## Future Development Architecture

- Phase 1 (Alpha, current): direct sub‑genre registration; controlled list; simple communities; admin management.
- Phase 2 (Post‑Alpha): hidden genre relationships (allies/overlaps) for backend intelligence; user experience remains specific communities.
- Phase 3 (Explorer Mode): guided discovery for non‑scene users; view‑only until commit.
- Phase 4 (Advanced): community splitting; cross‑genre discovery; analytics.

## Critical Implementation Notes

Remove:
- All Family/Roots/Alliance code and references.
- Super‑genre → sub‑genre hierarchy.
- Two‑step registration (family then alliance).
- Any community grouping or alliance logic.

Implement:
- Direct sub‑genre registration with text prediction.
- One sub‑genre = one community.
- Admin dashboard for genre management.
- Controlled, editable alpha genre list.
- Genre request system for expansion.

## Data Migration (if applicable)
```js
// 1. Extract sub-genres from user profiles
// 2. Create direct sub-genre communities
// 3. Reassign users to specific sub-genre communities
// 4. Remove all family/alliance references
```

## API Endpoints (Alpha)
```http
GET  /onboarding/approved-genres
GET  /onboarding/genre-suggestions?q={input}
POST /onboarding/register-user    // direct sub-genre assignment
POST /onboarding/request-genre

// Admin
GET  /admin/genres
POST /admin/genres
GET  /admin/genre-requests
POST /admin/genre-requests/{id}/approve
```

## Why This Change
- Real scene members know their exact sub‑genre → authentic communities from day one.
- No confusing hierarchies during testing → simpler UX.
- Cleaner data model → easier validation and future evolution.

---

Editor note: The alpha genre list is stored in `src/config/alpha_genres.js` and can be edited by maintainers/admins. When backend endpoints are available, the mobile app will prefer server‑provided lists and suggestions.


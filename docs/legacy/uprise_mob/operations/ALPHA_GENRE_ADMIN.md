# Alpha Genre Admin – Managing Sub-Genres (Editable List + API Switch)

This guide explains how to edit the alpha sub‑genre list locally, and how to switch the app to consume server‑provided genres and suggestions when the backend endpoints are available.

## Local (Default) – Editable List
- File: `src/config/alpha_genres.js`
- Structure: `[{ id, name, aliases[], approved }]`
- Edit directly to add/remove/update sub‑genres during alpha.

Example entry:
```js
{ id: 'hardcore-punk', name: 'Hardcore Punk', aliases: ['hardcore', 'hxc'], approved: true }
```

## Client Services (Fallback → Server Preferred)
- File: `src/services/onboarding/genreAlpha.service.js`
  - `getApprovedSubGenres()` → returns server list if configured, else local `ALPHA_GENRES`.
  - `getSubGenreSuggestions({ q })` → calls server if configured, else filters `ALPHA_GENRES` by `name/id/aliases`.
  - `requestSubGenre({ name })` → posts to server if configured; otherwise a local stub logs the request.

## Switch to Server Endpoints
Set these environment keys (e.g., `.env.development`, CI secrets, or RN Config):
- `APPROVED_GENRES_ENDPOINT` → e.g. `https://api.example.com/onboarding/approved-genres`
- `GENRE_SUGGESTIONS_ENDPOINT` → e.g. `https://api.example.com/onboarding/genre-suggestions`
- `REQUEST_GENRE_ENDPOINT` → e.g. `https://api.example.com/onboarding/request-genre`

When present, the client automatically prefers server responses over the local list.

## Testing
- Onboarding screen uses a single Sub‑Genre typeahead. Type to see suggestions.
- If your target sub‑genre isn’t shown, add it to `alpha_genres.js` (local) or use the request endpoint.

## Notes
- The families/super‑genre hierarchy is deprecated for alpha. Ensure any legacy references are ignored or cleaned up.
- Revolutionary/viability logic is unchanged; only the genre selection is simplified.


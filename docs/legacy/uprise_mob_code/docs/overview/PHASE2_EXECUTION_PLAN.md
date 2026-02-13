# Phase 2 Execution Plan

For daily carryover protocol, see [PHASE2_CARRYOVER_TEMPLATE.md](./PHASE2_CARRYOVER_TEMPLATE.md).  
For navigation, see [INDEX.md](./INDEX.md).  
For current state, see [CHANGELOG.md](./CHANGELOG.md).

## Doc Canonicalization (Phase 2)
- Community/Location spec = 04_UPRISE_Community_Location_System.md (treat other location docs as archived).
- "Station" references in code are legacy; all new logic must route through src/contracts/community helpers.
- Discovery = visualization + recommendations; Location = authoritative source of geo/genre keys.
- Future features (ambassadors, advanced promos, extended business integrations) are tracked in 10_UPRISE_Phase2_Features.md, not Phase 2 execution.
 - Genre System (Alpha): see specs/GENRE_SYSTEM_ALPHA.md. Musical Families doc is deprecated for Alpha.

## Workstreams
- Auth & Identity
- Locations & Geo
- Radio/Community
- Genre Taxonomy
- API Integration
- Mobile UI hooks

---


## Purpose  
Unify the July Model realignments with current Phase 2 specs so that **mobile, API, and webapp** all converge on one canonical architecture. This document is the single source of truth for backend integration, onboarding, and smokes.

---

## Core Realignments (Phase 2 Foundations)

### 1. Artist/Band Unification  
- Canonical model: **ArtistProfile**  
- Endpoints:  
  - `GET /user/band` → returns ArtistProfile  
  - `PUT /user/artist-profile` → update profile & logo  
- Remove Band-only calls in mobile/web.  
- References:  
  - `docs/archives/july-model/architecture realignment/ARTIST-UNIFICATION-IMPLEMENTATION.md`  
  - `docs/archives/july-model/architecture realignment/FRONTEND-ARTIST-UNIFICATION-REFACTORING.md`  
  - `docs/specs/06_SONG_MANAGEMENT.md` (canonical IDs)

### 2. Community & Location Filtering  
- Canonical key: **`city-state-genre`** (e.g. `austin-texas-hip-hop`)  
- Params: `city, state, genre, lat, lng, radius, community_key`  
- GPS fraud checks via PostGIS (`ST_DWithin`)  
- References:  
  - `docs/specs/04_COMMUNITY_LOCATION.md`  
  - `docs/archives/july-model/architecture realignment/STATION-COMMUNITY-SYSTEM-ANALYSIS.md`

### 3. Radio/Community Unification  
- Radio is a projection of community queues.  
- Discovery responses echo back `community_key`.  
- Feed = notifications only (no music payloads).  
- References:  
  - `docs/archives/july-model/architecture realignment/STATION-COMMUNITY-SYSTEM-ANALYSIS.md`  
  - (this doc)

### 4. Genre Upgrade (Modern 97 Taxonomy)  
- Endpoints:  
  - `/onboarding/all-genres` → flat 97 list  
  - `/onboarding/super-genres` → hierarchy  
- Used during artist onboarding.  
- References:  
  - `docs/archives/july-model/Feature realignment/MODERN-GENRES-SYSTEM.md`  
  - `docs/reference/architecture/SYSTEM_OVERVIEW.md`

### 5. Business & Promotions Alignment  
- Local businesses + events target communities via `community_key`.  
- Promotions system plugs into community + genre targeting.  
- References:  
  - `docs/specs/09_PROMOTIONS_BUSINESS.md`  
  - `docs/specs/08_EVENTS.md`
- See 10_UPRISE_Phase2_Features.md for post-Phase 2 roadmap items.

---

## Integration Targets

- **Auth (JWT + refresh)**  
  - Confirm refresh token handling + 401 responses.  
  - Secrets and expirations aligned in API.  
  - Header for creator actions: `X-Artist-Canonical-Id`.

- **Onboarding (Artist)**  
  - Signup → capture city/state + genre.  
  - Create ArtistProfile if missing.  
  - Set active profile context.  

- **Radio & Discovery**  
  - Always filtered by `community_key`.  
  - Echo back params for consistency.  

### Post-Login Routing (Authoritative)
- After successful login, route to Home Scene Creation (`CommunitySetup`) unless explicitly bypassed in debug; Dashboard only after onboarding completes and a community exists.

---

## Smokes & Verification

- `docs/automation/scripts/session_kickoff.sh`  
- `docs/automation/scripts/phase2_smoke.sh`  
- `docs/automation/scripts/psql_postgis_check.sh`  
- `docs/automation/scripts/health_checks.sh`

### Emulator Networking (Standard)
- **API Base URL**: `http://10.0.2.2:3000` for Android emulator backend connectivity
- **Environment Variables**: Ensure `.env.development` contains:
  - `API_BASE_URL=http://10.0.2.2:3000`
  - `REFRESH_TOKEN_URL=/auth/refresh`
  - `UPDATED_USERDETAILS=/user/me`
- **Verification Steps**:
  1. Launch emulator and install debug APK
  2. Verify backend health: `curl http://localhost:3000/health` (from host)
  3. Check mobile logs for successful API calls to `10.0.2.2:3000`
  4. Confirm authentication flow works (login → `/user/me` fetch)

**Acceptance Criteria**  
- Build & smoke PASS; artifacts saved with standard names/paths.
- Release logs show no fatal runtime and no Metro references.
- Requests include community_key when available.
- After login: route to Home Scene Creation (`CommunitySetup`) unless explicitly bypassed in debug; 97-genre taxonomy visible; home scene set without AppRegistry/TrackPlayer issues; Dashboard only after onboarding completes and a community exists.
- Docs updated (CHANGELOG + any runbook/KB touched).  

---

## Android Build & Install Guardrails (Carryover)

Use these to avoid flaky installs, empty artifacts, and missing JS bundles during Debug/Release work.

- Tooling alignment
  - SDK/Tools: `compileSdkVersion=33`, `targetSdkVersion=33`, `buildToolsVersion=33.0.2`.
  - Emulator: API 30+ (prefer 33), ABI matches APK (usually `x86_64`).

- Bundle integrity (Release)
  - Embed JS bundle before install: `yarn bundle:android`.
  - Verify in APK: `aapt list app-release.apk | find "index.android.bundle"`.

- Manifest validation (before install)
  - Print merged manifest: `apkanalyzer manifest print app-release.apk`.
  - Check for `android:exported` on any component with an `intent-filter` (API 31+).
  - Permissions: `POST_NOTIFICATIONS` implies target SDK 33.

- Install triage (adb)
  - Uninstall both IDs first: `adb uninstall com.app.uprise[.debug]` then `adb shell pm uninstall -k --user 0 ...`.
  - Install flags: `adb install -r -d -t app-*.apk`.
  - If failure: filter logcat
    - `adb logcat -d | findstr "PackageManager PARSE_FAILED NO_MATCHING_ABIS UPDATE_INCOMPATIBLE VERSION_DOWNGRADE TEST_ONLY install"`.

- ABI checks
  - APK: `aapt dump badging app-*.apk | find "native-code"`.
  - Device: `adb shell getprop ro.product.cpu.abi`.
  - Mismatch → use matching AVD, or enable per‑ABI splits.

- Logging discipline (PowerShell)
  - Capture stdout+stderr: use `*> artifacts\logs\file.txt` or `2>&1 | Tee-Object`.
  - Prefer short commands or scripts to avoid PSReadLine console bugs with long one‑liners.

---

## References (Single Source)

- `docs/reference/architecture/SYSTEM_OVERVIEW.md`
- `docs/specs/03_AUTHENTICATION.md`  
- `docs/specs/04_COMMUNITY_LOCATION.md`  
- `docs/specs/05_FAIR_PLAY_ALGO.md`  
- `docs/specs/06_SONG_MANAGEMENT.md`  
- `docs/specs/07_DISCOVERY_MAP.md`  
- `docs/specs/08_EVENTS.md`  
- `docs/specs/09_PROMOTIONS_BUSINESS.md`  


---

## Sprint Plan (Phase 2)

### P2-00 — Bootstrapping (Done)
- Emulator: Debug + Release stable; Hermes enabled; Release avoids Metro
- Dev server host auto-config: persists `ReactNativeDevServerHost`, ADB reverse 8081
- CI: Android Test Release workflow builds APK + emulator smoke
- Copy: user-visible “Station” → “Community”

### P2-S01 — Communities + Onboarding Groundwork (Direct Sub‑Genre)
Goal: Community is first‑class; discovery/radio use `community_key`; onboarding uses direct sub‑genre selection (no super‑genre/families).

- Contracts + State
  - Helpers: `toCommunityKey`, `fromCommunityKey`, `buildGeoGenreParams`
  - Persist `community_key` in redux; hydrate on app start
  - Selector: `getCommunityKey()`
- Onboarding (client)
  - Services (alpha): `GET /onboarding/approved-genres`, `GET /onboarding/genre-suggestions`, `POST /onboarding/request-genre`
  - UI: Home Scene Creation (first login)
    - Sub‑genre picker (required) via typeahead/autocomplete
    - City/State picker (required) with typeahead + optional “Use my GPS (recommended)”
    - Note: GPS verification is optional, but only GPS‑verified users can upvote songs in Home Scene
  - Persist: location (city/state), `subGenreId`, `community_key={city}-{state}-{subGenreId}`
  - Revolutionary flow:
    - `validate-community` determines if local community is active
    - If inactive: tag user as revolutionary, show invite modal, route to nearest active hub, persist `active_community_key`
    - Summon back: on app start, if local becomes active, prompt user to return to home community
- Requests
  - Use `buildGeoGenreParams` for discovery/radio/events (prefer `community_key`, else normalized geo, else radius)
  - Minimal param debug logs guarded by `__DEV__`
- Copy/Terminology
  - All user‑visible references “Station” → “Community”; Radio title “Community Radio”

Acceptance
- Onboarding shows direct sub‑genre selection with autocomplete
- `community_key` persists and appears in Debug logs before discovery/radio
- Discovery/radio requests carry `community_key` (or normalized fallbacks)
- No “Station”, “super‑genre”, or “families” in UI

### P2-S02 — Auth/Refresh + ArtistProfile Unification
Goal: align mobile with webapp/API: refresh flows, canonical ArtistProfile identity, creator context.

- Auth/Refresh
  - Keep 401→refresh→retry interceptor; add smoke verification
- Artist Upgrade
  - Profile CTA: “Become an Artist”
  - Step 1: Artist Basics (name + super‑genre), inherit location
  - Step 2: Optional Band (skip allowed)
  - Services: `GET /user/artist-profile` (alias `/user/band`), `PUT /user/artist-profile`
  - Persist canonical artist ID; add `X-Artist-Canonical-Id` on creator writes
  - Success screen with dashboard URL
  - Upload crediting: song uploads default `primary_community_key` to artist’s home community so minutes accrue toward activation
- Community Integration
  - Preserve and reuse `community_key` post‑upgrade

Acceptance
- Upgrade flow saves ArtistProfile + canonicalId
- Creator writes include `X-Artist-Canonical-Id` and 403s surface correctly
- Refresh flow works during/after upgrade
- Success screen and handoff

Notes
- Viability gating & suggestions (nearest active, related super‑genres, "Righteous Revolutionary") staged behind a flag until API provides payloads.
- See 10_UPRISE_Phase2_Features.md for post-Phase 2 roadmap items.

---

## Operational Toggles & Admin

- Viability bypass (testing):
  - Server: `COMMUNITY_VIABILITY_BYPASS=true` (or `/admin/toggles/viability-bypass`) — staging only
  - Client (Debug/staging): `COMMUNITY_VIABILITY_BYPASS=true` in react-native-config (guards onboarding validate)
  - Optional header for targeted tests: `X-Bypass-Viability: 1` (SUPERADMIN only)

- Superadmin role (staging):
  - Role: `SUPERADMIN` in JWT `roles[]`
  - Admin endpoints (staging):
    - `POST /admin/communities/seed-minutes { community_key, minutes }`
    - `POST /admin/communities/activate { community_key }`
    - `POST /admin/toggles/viability-bypass { enabled }`
  - Mobile: Profile → Admin Tools (visible only if SUPERADMIN)

- Client PATCHs (recommended):
  - Onboarding completion → `PATCH /user/home-community { community_key }`
  - Routing to hub → `PATCH /user/active-community { community_key }`
  - Summon return → `PATCH /user/active-community { community_key: home }`

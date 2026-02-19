# FRESH_READINESS_REPORT.md

**Generated:** 2026-02-18  
**Validation Status:** ✅ All checks passed  
**Branch:** Current checked-out branch

---

## Validation Results

| Command | Status |
|---------|--------|
| `pnpm run docs:lint` | ✅ Passed |
| `pnpm run infra-policy-check` | ✅ Passed |
| `pnpm run typecheck` | ✅ Passed (8 packages) |
| `pnpm --filter api build` | ✅ Passed |
| `pnpm --filter web build` | ✅ Passed |

---

## A) Evidence-Backed Implementation Map

### API Endpoints (`apps/api/src/`)

| Feature | Endpoint | File:Line | Status | Evidence |
|---------|----------|-----------|--------|----------|
| **Auth** | `POST /auth/register` | `auth/auth.controller.ts:10` | ✅ implemented | Uses `RegisterSchema` from `@uprise/types` |
| **Auth** | `POST /auth/login` | `auth/auth.controller.ts:17` | ✅ implemented | Uses `LoginSchema` from `@uprise/types` |
| **Tracks** | `GET /tracks` | `tracks/tracks.controller.ts:13` | ✅ implemented | Pagination via `findMany()` |
| **Tracks** | `GET /tracks/:id` | `tracks/tracks.controller.ts:21` | ✅ implemented | `findById()` |
| **Tracks** | `POST /tracks/:id/engage` | `tracks/tracks.controller.ts:30` | ✅ implemented | Canon 3/2/1/0 scoring via `engagement.utils.ts` |
| **Communities** | `GET /communities` | `communities/communities.controller.ts:26` | ✅ implemented | Pagination |
| **Communities** | `GET /communities/:id` | `communities/communities.controller.ts:37` | ✅ implemented | With geospatial data |
| **Communities** | `POST /communities` | `communities/communities.controller.ts:47` | ✅ implemented | With GPS + geofence |
| **Communities** | `GET /communities/nearby` | `communities/communities.controller.ts:63` | ✅ implemented | PostGIS ST_DWithin |
| **Communities** | `POST /communities/:id/verify-location` | `communities/communities.controller.ts:95` | ✅ implemented | Geofence verification |
| **Onboarding** | `POST /onboarding/home-scene` | `onboarding/onboarding.controller.ts:17` | ✅ implemented | Home Scene resolution + auto-join |
| **Onboarding** | `POST /onboarding/gps-verify` | `onboarding/onboarding.controller.ts:24` | ✅ implemented | GPS verification for voting |
| **Signals** | `POST /signals` | `signals/signals.controller.ts:12` | ✅ implemented | Create signal |
| **Signals** | `POST /signals/:id/add` | `signals/signals.controller.ts:19` | ✅ implemented | Add to collection |
| **Signals** | `POST /signals/:id/blast` | `signals/signals.controller.ts:25` | ✅ implemented | Blast signal |
| **Signals** | `POST /signals/:id/support` | `signals/signals.controller.ts:31` | ✅ implemented | Support signal |
| **Signals** | `POST /follow` | `signals/signals.controller.ts:37` | ✅ implemented | Follow entity |
| **Health** | `GET /health` | `health/health.controller.ts` | ✅ implemented | Liveness check |
| **Places** | `GET /places/cities` | `places/places.controller.ts` | ✅ implemented | City autocomplete |
| **Broadcast** | `GET /broadcast/:sceneId` | — | ❌ missing | Spec: `docs/specs/broadcast/radiyo-and-fair-play.md` |
| **Voting** | `POST /votes` | — | ❌ missing | Canon §4.2 requires during-playback voting |
| **Fair Play Metrics** | `GET /fair-play/metrics` | — | ❌ missing | Spec: `BROADCAST-FP` |

### Prisma Models (`apps/api/prisma/schema.prisma`)

| Model | Line | Status | Evidence |
|-------|------|--------|----------|
| `User` | 16–51 | ✅ implemented | Home Scene fields (L29–33), `gpsVerified` (L33), `trackEngagements` relation (L48) |
| `Community` | 53–83 | ✅ implemented | `tier` (L66), `geofence` PostGIS (L72), `radius` (L73) |
| `SectTag` | 85–98 | ✅ implemented | `parentCommunityId`, `status` |
| `UserTag` | 100–111 | ✅ implemented | User-to-SectTag link |
| `CommunityMember` | 113–125 | ✅ implemented | Role-based membership |
| `Track` | 127–149 | ✅ implemented | `status`, `playCount`, `likeCount` |
| `TrackEngagement` | 152–167 | ✅ implemented | Canon 3/2/1/0 scoring, `sessionId` spam guard |
| `Signal` | 169–183 | ✅ implemented | Type, metadata, community relation |
| `SignalAction` | 185–197 | ✅ implemented | ADD/BLAST/SUPPORT unique constraint |
| `Follow` | 199–210 | ✅ implemented | Polymorphic entity follow |
| `Collection` | 212–223 | ✅ implemented | Personal collection |
| `CollectionItem` | 225–236 | ✅ implemented | Signal-to-collection link |
| `Event` | 238–260 | ✅ implemented | Location, dates, attendee count |
| `RotationEntry` | — | ❌ missing | Fair Play rotation tracking |
| `Vote` | — | ❌ missing | Canon §4.2 voting model |
| `ActivityPoint` | — | ❌ missing | Canon §11 Activity Points |

### Web App (`apps/web/src/`)

| Feature | File | Status | Evidence |
|---------|------|--------|----------|
| Landing Page | `app/page.tsx` | ✅ implemented | Scene First / Fair Play / No Recommendation messaging |
| Onboarding Flow | `app/onboarding/page.tsx` | ✅ implemented | 3-step flow: Home Scene → GPS → Review |
| The Plot Dashboard | `app/plot/page.tsx` | ⚠️ partial | Tabs stub only (Feed/Events/Promotions/Statistics/Social) |
| API Client | `lib/api.ts` | ✅ implemented | Typed API wrapper |
| Socket Client | `lib/socket.ts` | ✅ implemented | Socket.IO connection |
| Web Tier Guard | `lib/web-tier-guard.ts` | ✅ implemented | Runtime boundary enforcement |
| Auth Store | `store/auth.ts` | ✅ implemented | Token management |
| Onboarding Store | `store/onboarding.ts` | ✅ implemented | Home Scene + GPS state |
| RaDIYo Player | — | ❌ missing | Spec: `BROADCAST-FP` |
| Voting UI | — | ❌ missing | Canon §4.2 |
| Action Wheel | — | ❌ missing | Add/Blast/Upvote/Skip/Report |

---

## B) Canon/Spec Lock Map

### 1. Codified-and-Implemented ✅

| Spec ID | Spec File | Code Evidence |
|---------|-----------|---------------|
| `USER-ONBOARDING` | `docs/specs/users/onboarding-home-scene-resolution.md` | `onboarding.service.ts:21–117` — Full resolution logic |
| `CORE-SIGNALS` (partial) | `docs/specs/core/signals-and-universal-actions.md` | `signals.service.ts` — ADD/BLAST/SUPPORT/FOLLOW |
| Engagement Score (Canon §4.1.1) | `docs/canon/Master Narrative Canon.md` | `engagement.utils.ts:10–21` — 3/2/1/0 mapping |
| Home Scene Fields | Canon §1.3 | `schema.prisma:29–33` — homeSceneCity/State/Community/Tag |
| GPS Verification | Canon §1.3 | `onboarding.service.ts:75–130` — Geofence check |

### 2. Codified-but-Not-Implemented ⚠️

| Spec ID | Spec File | Missing Code |
|---------|-----------|--------------|
| `BROADCAST-FP` | `docs/specs/broadcast/radiyo-and-fair-play.md` | No `GET /broadcast/:sceneId`, no `RotationEntry` model |
| Voting | Canon §4.2 | No `POST /votes`, no `Vote` model |
| Contextual Modifiers | Canon §4.1.1.B | ADD +0.5, BLAST +0.25 not applied to engagement |
| Activity Points | Canon §11 | No `ActivityPoint` model, no scoring API |
| Print Shop | `docs/specs/economy/print-shop-and-promotions.md` | No models or endpoints |
| Events Creation | `docs/specs/events/events-and-flyers.md` | `Event` model exists but no `POST /events` endpoint |
| Sect Uprising | Canon §1.7 | No activation logic (45min threshold) |
| Tier Propagation | Canon §1.2 | No City→State→National logic |

### 3. Founder-Locked (Do Not Implement) 🔒

Per `docs/specs/DECISIONS_REQUIRED.md`:

| Item | Status |
|------|--------|
| Sect Uprise activation threshold (45 min) | 🔒 Founder Lock |
| City → State propagation threshold | 🔒 Founder Lock |
| State → National propagation threshold | 🔒 Founder Lock |
| Initial release window duration | 🔒 Founder Lock |
| Re-evaluation cadence | 🔒 Founder Lock |
| Activity Points scoring table | 🔒 Founder Lock |
| Discovery Pass pricing | 🔒 Founder Lock |
| Play Pass pricing | 🔒 Founder Lock |
| Report threshold for auto-flag | 🔒 Founder Lock |

---

## C) Next 5 Tasks (Strict MVP Critical Path)

### Task 1: Add Vote Model and Endpoint

**Files to edit:**
- `apps/api/prisma/schema.prisma` — Add `Vote` model
- `apps/api/src/votes/` — New module (controller, service, dto)
- `apps/api/src/app.module.ts` — Register VotesModule

**Acceptance criteria:**
- `POST /votes` accepts `{ trackId, sceneId, type: "upvote" }`
- Vote is rejected if user not GPS-verified or outside Home Scene
- Vote is rejected if song not currently playing (session validation)
- Unique constraint: one vote per user per track per tier

**Validation:**
```bash
pnpm run typecheck && pnpm --filter api build
```

---

### Task 2: Add RotationEntry Model for Fair Play

**Files to edit:**
- `apps/api/prisma/schema.prisma` — Add `RotationEntry` model
- Run `pnpm prisma migrate dev --name add_rotation_entry`

**Acceptance criteria:**
- Model includes: `trackId`, `sceneId`, `tier`, `entryDate`, `exposureWindow`, `rotationWeight`
- Index on `(sceneId, tier, createdAt)`

**Validation:**
```bash
pnpm prisma validate && pnpm run typecheck
```

---

### Task 3: Apply Contextual Modifiers to Engagement

**Files to edit:**
- `apps/api/src/tracks/engagement.utils.ts` — Add modifier logic
- `apps/api/src/tracks/tracks.service.ts:31–50` — Apply modifiers on ADD/BLAST

**Acceptance criteria:**
- ADD action adds +0.5 to engagement (once per user/track/tier)
- BLAST action adds +0.25 (once per user/track/tier)
- FOLLOW does NOT add modifier (Canon explicit)

**Validation:**
```bash
pnpm --filter api test && pnpm run typecheck
```

---

### Task 4: Implement Broadcast Endpoint Stub

**Files to edit:**
- `apps/api/src/broadcast/` — New module
- `apps/api/src/broadcast/broadcast.controller.ts` — `GET /broadcast/:sceneId`

**Acceptance criteria:**
- Returns deterministic rotation order (no personalization)
- Includes tier toggle support (city/state/national query param)
- Response: `{ sceneId, tier, tracks: Track[], position }`

**Validation:**
```bash
pnpm --filter api build && curl localhost:3001/broadcast/test-scene?tier=city
```

---

### Task 5: The Plot Feed Integration

**Files to edit:**
- `apps/web/src/app/plot/page.tsx` — Replace stub with API calls
- `apps/web/src/lib/api.ts` — Add feed endpoints

**Acceptance criteria:**
- Feed tab fetches blasts from `/signals?type=BLAST&sceneId=...`
- Statistics tab shows placeholder metrics
- No algorithmic ranking (chronological only)

**Validation:**
```bash
pnpm --filter web build && pnpm --filter web test
```

---

## D) Drift/Contradiction Check

| File | Canon/Spec Says | Code Does | Fix Direction |
|------|-----------------|-----------|---------------|
| `engagement.utils.ts:10–21` | Canon §4.1.1.B: ADD +0.5, BLAST +0.25 | Only base 3/2/1/0 | Add modifier application |
| `signals.service.ts:27–35` | ADD affects engagement score | ADD only creates SignalAction | Link ADD to TrackEngagement modifier |
| `schema.prisma` | Canon §4.2: Vote model required | No Vote model | Add Vote model with tier, session constraints |
| `schema.prisma` | Spec BROADCAST-FP: RotationEntry | No RotationEntry model | Add model for rotation tracking |
| `plot/page.tsx` | Canon §6.4: S.E.E.D Feed (no ranking) | Stub with placeholder text | Implement chronological feed fetch |

---

## E) Execution Guardrails for Future Runs

1. **No platform tropes.** Do not assume Spotify/Instagram/TikTok patterns. Source of truth is `docs/canon/` only.

2. **Canon §4.3 prohibition.** Fair Play must NEVER predict taste, optimize virality, or assign legitimacy. Any PR introducing recommendation logic is blocked.

3. **Voting is GPS-gated.** All vote endpoints must verify `user.gpsVerified === true` AND Home Scene match. No exceptions.

4. **Engagement is additive-only.** Skips = 0 points, never negative. No listener action subtracts from a song's standing.

5. **Web-tier boundary.** `apps/web` must never import `@prisma/client`, access `DATABASE_URL`, or call server-only modules. Run `pnpm run infra-policy-check` before every PR.

6. **No undocumented features.** Before implementing any new endpoint or model, confirm spec exists in `docs/specs/`. If missing, create spec first.

7. **Founder locks are immutable.** Items in `docs/specs/DECISIONS_REQUIRED.md` must not be implemented until explicitly unlocked.

8. **Canon change control.** Any edit to `docs/canon/*.md` requires `CHANGELOG.md` update and explicit rationale.

9. **Signal ≠ Authority.** Signals propagate through explicit action only. Follower count, metrics, and visibility never grant governance power (Canon §9).

10. **Home Scene is civic anchor.** User has exactly one Home Scene. All civic actions (voting, registrar) are Scene-bound.

11. **Run validation before commit.** Always run: `pnpm run docs:lint && pnpm run infra-policy-check && pnpm run typecheck`

12. **Tag agent output.** All generated code must include `// generated-by: <agent-name>` header comment.

---

## Summary

**Implemented:** Auth, Tracks (with engagement), Communities (with PostGIS), Onboarding (Home Scene + GPS), Signals (ADD/BLAST/SUPPORT/FOLLOW), basic web pages.

**Critical gaps:** Voting, RotationEntry, Broadcast endpoint, contextual modifiers, Activity Points.

**Founder-locked:** All threshold values, pricing, propagation rules.

**Next action:** Task 1 (Vote model and endpoint) is the blocking dependency for Fair Play MVP.

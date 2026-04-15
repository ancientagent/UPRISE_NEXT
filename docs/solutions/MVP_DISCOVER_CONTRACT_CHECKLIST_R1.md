# MVP Discover Contract Checklist R1

Status: Active  
Owner: product engineering  
Last updated: 2026-04-15

## 1) Purpose
Provide a concrete contract checklist for finishing Discover without guessing. This document separates:
- contracts that already exist in repo
- contracts that are still missing
- contracts that must be added before a full Discover implementation pass
- richer items that can still be deferred

This is an implementation-prep artifact, not a replacement for the founder lock.

## 2) Controlling Inputs
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- current repo implementation under:
  - `apps/web/src/app/discover/page.tsx`
  - `apps/web/src/lib/discovery/client.ts`
  - `apps/api/src/communities/`
  - `apps/api/src/signals/`

## 3) Existing Contracts (Already In Repo)
These capabilities already exist and should be reused, not reinvented.

### 3.1 Discover scene/Uprise transport
- `GET /discover/scenes`
- `GET /discover/context`
- `POST /discover/tune`
- `POST /discover/set-home-scene`

Current web wrappers:
- `apps/web/src/lib/discovery/client.ts`

### 3.2 Community reads and handoff surfaces
- `GET /communities/:id`
- `GET /communities/:id/feed`
- `GET /communities/:id/events`
- `GET /communities/:id/promotions`
- `GET /communities/:id/statistics`
- `GET /communities/:id/scene-map`
- `GET /communities/resolve-home`

Current web wrappers:
- `apps/web/src/lib/communities/client.ts`

### 3.3 Universal actions infrastructure
- `POST /signals`
- `POST /signals/:id/collect`
- `POST /signals/:id/add`
- `POST /signals/:id/blast`
- `POST /signals/:id/recommend`
- `POST /follow`

Current server implementation:
- `apps/api/src/signals/signals.controller.ts`
- `apps/api/src/signals/signals.service.ts`

Important terminology note:
- current runtime now exposes a public `Collect` endpoint plus legacy `ADD` compatibility
- the controlling action matrix now frames intended listener grammar as:
  - `Collect` / runtime `ADD`
  - `Blast`
  - `Recommend` once genuinely held
  - `Follow`
  - `React` on post surfaces, not as a signal action

### 3.4 Collection shelf support for Uprises
The signal-to-shelf mapping already supports `uprises`:
- `apps/api/src/common/constants/collection-shelves.ts`

This means the repo already understands saved Uprises as a collection shelf outcome.

### 3.5 Artist identity/profile read direction
The repo already has user profile and artist-band identity read contracts:
- `GET /users/:id/profile`
- `GET /artist-bands/:id`
- `GET /artist-bands`

This is enough to support artist destination routing once Discover can resolve artist results.

## 4) Missing Contracts (Not In Repo Yet)
These are the hard blockers for a full Discover implementation.

### 4.1 Local artist search inside community Discover
Missing:
- an API route for searching artists within the current community context
- a typed web client wrapper for that search
- a defined result payload for artist rows in Discover

### 4.2 Local song/single search inside community Discover
Missing:
- an API route for searching songs/singles within the current community context
- a typed web client wrapper for that search
- a defined result payload for song rows in Discover

### 4.3 Recommendations data contract
Missing:
- a community-scoped Discover recommendations endpoint
- a deterministic result payload for recommended signals
- a clear mapping from result items to native destinations/actions

### 4.4 Trending data contract
Missing:
- a community-scoped Discover trending endpoint or equivalent projection
- a result payload that reflects founder-confirmed `blast-count driven` behavior

### 4.5 Top Artists data contract
Missing:
- a community-scoped Discover top-artists endpoint or equivalent projection
- a typed payload for artist-card/list items

### 4.6 Proper saved-Uprise acquisition contract
The repo has generic signal actions, but it does not yet expose a direct, Uprise-keyed collect/save contract.

Missing one of:
- a dedicated endpoint for saving an existing Uprise/community to the user’s `uprises` shelf
- or an explicit canonical contract that defines how an existing community becomes a stable `Signal` for collect/blast/recommend behavior without creating duplicate ad hoc signal rows

### 4.7 Recommend eligibility and held-state semantics
The repo now implements `POST /signals/:id/recommend`, but Discover still needs a clean held-state contract so recommendation only appears when the listener already genuinely holds the target.

Missing:
- a stable read contract telling Discover whether the current user already holds the signal/Uprise
- a UI rule for when recommendation is shown or hidden without implying fake possession

## 5) Must Add Now (Before Full Discover Build)
These are the minimum additions required to build full Discover honestly in one integrated pass.

### 5.1 Community Discover content search
Add:
- community-scoped artist search contract
- community-scoped song/single search contract
- typed web wrappers and result shapes

### 5.2 Community Discover carousel projections
Add:
- recommendations projection
- trending projection
- top-artists projection

These do not need speculative formulas beyond what is already locked, but they do need real API/data contracts.

### 5.3 Saved-Uprise contract
Add:
- a clean collect/save contract for Uprises that writes to the `uprises` collection shelf without relying on duplicate one-off signal creation semantics

### 5.4 Action vocabulary reconciliation
Discover implementation must honor the controlling matrix:
- surface `Collect`/runtime `ADD`, `Blast`, and gated `Recommend` on signal cards
- avoid introducing direct `Support` UI for signals
- do not rebuild a `Supported Now` signal lens
- keep `React` on feed/post surfaces rather than Discover signal cards

## 6) Safe To Defer
These items can remain out of the first full contract pass if needed.

### 6.1 Avatar-heavy recommendation presentation
Already deferred to V2 by founder lock.

### 6.2 Poster ID block / richer listener identity treatment
Not required for core Discover functionality.

### 6.3 Full canon/spec rewrite
The founder lock is already the controlling implementation authority for now.

### 6.4 Deeper map polish
Map motion/polish can lag behind the core travel/search/result contracts as long as the actual map/travel behavior is supported.

## 7) Recommended Build Order
1. Add missing Discover search/result contracts in API + typed clients
2. Add saved-Uprise contract
3. Resolve action vocabulary (`Recommend` now vs later)
4. Implement full Discover UI against those contracts
5. Run route/harness validation against founder lock

## 8) Summary Decision
If the goal is to ship **full Discover all together**, do not start with frontend polish.

Start by adding the missing contracts for:
- artist search
- song search
- recommendations
- trending
- top artists
- saved Uprises
- recommend action, if included

Once those exist, the frontend can be built in one coherent pass without temporary scaffolding or fake data.

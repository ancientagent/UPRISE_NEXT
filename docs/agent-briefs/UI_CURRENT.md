# UI Current Agent Brief

Status: active
Last Updated: 2026-06-24

## Use When

Use this brief when the task is about:

- app/frontend UI
- Claude Designer / Stitch / visual design handoff
- Home / Plot layout
- player/profile interaction
- Feed, Events, Archive
- Artist Profile layout
- mobile/app screen structure
- external design-agent prompts for UPRISE screens

## Do Not Use For

- backend-only API work
- deployment/infrastructure work
- source-dashboard implementation details beyond visible UI structure
- registrar backend rules except where visible in UI
- legacy mobile archive interpretation

## Loading Rule

Start with the normal repo entry rules, then this UI packet.

Do not read every file listed below by default. This brief is the working UI router.

Load more only when the task needs it:

- design prompt / wireframe context: this brief is usually enough
- runtime implementation: load the exact route/component files being edited plus the one relevant lock
- QA/review: load the tested route/component and the regression test/handoff tied to that behavior
- spec/doc correction: load the exact active lock/spec being patched

## Section Pointers

Core UI files:

1. `apps/web/WEB_TIER_BOUNDARY.md`
2. `apps/web/src/app/plot/page.tsx`
3. `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
4. `apps/web/src/components/plot/SeedFeedPanel.tsx`
5. `apps/web/src/app/artist-bands/[id]/page.tsx`
6. `packages/ui/src`

Current UI locks:

1. `docs/solutions/MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1.md`
2. `docs/solutions/MVP_SCREEN_AND_SURFACE_MAP_R1.md`
3. `docs/solutions/SURFACE_CONTRACT_HOME_R1.md`
4. `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md`
5. `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
6. `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`

Reference / companion UI files:

1. `docs/solutions/MVP_MOBILE_UX_MAPPING_FROM_PLOT_PROTOTYPE_R1.md` - mapping-only; does not authorize new behavior.
2. `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md` - historical mobile-first phase reference; do not treat stale tab/action language as current authority.
3. `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md` - historical screenshot-derived reference.
4. `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md` - legacy screenshot element inventory; current locks win on conflict.

Recent handoffs to use only after the locks above:

- `docs/handoff/2026-04-25_player-pulldown-profile-rule.md`
- `docs/handoff/2026-04-23_plot-tabs-archive-runtime-lock.md`
- `docs/handoff/2026-04-23_home-plot-feed-composition-lock.md`

## Current Truth

- Home contains Plot.
- Plot is not a separate destination/screen conceptually.
- Plot is the tabbed dashboard inside the Home-side community interface.
- Current Plot tabs are `Feed`, `Events`, `Archive`.
- `Archive` is the descriptive stats/history lane. Do not call the active tab `Statistics`.
- There is no current MVP `Promotions` tab.
- Feed is the default Plot tab.
- Feed is the Home Scene mainpage/default state inside Plot.
- Feed inserts are `Popular Singles`, `Buzz`, and `Upcoming Events`.
- Feed inserts are read-only launch points, not inline action cards.
- Artist Profile is direct-listen, discovery, information, and sharing outside `RADIYO`.
- User profile means the listener profile / collection workspace for everyone who has onboarded into the app.
- Source management is separate from the listener profile and should be treated as source/admin web tooling that the app reads from.
- Music-community preferences live in the user profile and persist across cities; the detailed membership/default/roller contract lives in `docs/specs/users/onboarding-home-scene-resolution.md`.
- The expanded `/plot` listener profile includes music-community preference management: list registered affiliations, label whether each preference is in the Home Scene Roller or profile-only until active, add approved parent music communities, and explicitly mark the default/starred preference.
- The Home Scene roller is a shortcut to resolvable primary music-community preferences in the current verified/default city; saved Away Scenes stay in the profile/collection workspace.
- Current Plot presentation for the roller is a centered active Home Scene with left/right arrow controls and horizontal swipe between adjacent resolvable preferences, not a full visible preference-management list.
- `/plot` renders the Home Scene roller from the authenticated read model and tunes the selected scene through the existing Discover scene-context path.
- Artist Profile does not use the engagement wheel.
- `Blast` belongs to the personal-player / user-space context, not Artist Profile and not the `RADIYO` wheel.
- `RADIYO` uses `Play It Loud` and `Upvote`.
- Travel / Discover remains deferred as a main destination unless explicitly reactivated.

## Home / Plot Top-To-Bottom Composition

1. User avatar bust.
2. Recommendation bubble attached to the avatar/current listener identity.
3. `UPRISE <CITY>` identity text beside the listener identity layer.
4. Top-right notification icon and settings menu.
5. Avatar visually rests on top of the player, as if standing behind it.
6. Player sits directly below the identity/avatar layer.
7. Plot tab bar sits below the player.
8. Plot body shows the active tab: Feed, Events, or Archive.

## Player / Profile Interaction

Current locked behavior:

- the player starts as top-screen listening infrastructure
- pulling the player down opens the user's profile / collection workspace in-place
- while profile / collection workspace is open, the player relocates to the bottom of the workspace
- if screen space allows, the bottom player may retain its normal controls/status
- if screen space is tight, the bottom player may shrink into a minimal strip with a scrolling marquee for band / song title
- while expanded, Plot tabs are replaced
- collapsing restores the prior Plot context

Do not describe this as:

- a separate normal user-profile route replacing Home
- a profile page that independently sits above the player
- a generic social profile navigation pattern

## User Profile / Collection Workspace

Purpose: listener-owned identity and collection workspace opened from the Home-side player pull-down.

This is not the same surface as Artist Profile.

It is also not the same surface as source management. Artists, bands, promoters, and future businesses are separate source entities managed from source/admin tooling, not from this listener profile workspace.

Onboarding collects one primary scene-of-choice music community; additional music-community preferences are added later from the profile. The detailed membership/default/roller contract lives in `docs/specs/users/onboarding-home-scene-resolution.md`.

Top-to-bottom when expanded:

1. profile summary header
   - listener identity
   - activity score
   - status cards where applicable
   - calendar card
2. collection tab / section selector directly below the calendar area
   - `Singles/Playlists`
   - `Events`
   - `Photos`
   - `Merch`
   - `Saved Uprises`
   - `Saved Promos/Coupons`
3. active collection section body
   - `Singles/Playlists`: saved singles, playlist grouping placeholder, selecting a single enters `SPACE`
   - `Events`: saved event artifacts / flyers
   - `Photos`: scene/event photography workspace
   - `Merch`: posters, shirts, patches, buttons, special items
   - `Saved Uprises`: saved Uprise items
   - `Saved Promos/Coupons`: placeholder until collection support exists
4. bottom player strip
   - full player controls/status if there is enough screen real estate
   - compact marquee-only strip if space is tight
   - mode, tier, and rotation-pool information remains player-owned and must not be duplicated as profile metadata
5. return/collapse action
   - `Return to Plot Tabs`

Boundaries:

- do not turn this into an Instagram-style profile
- do not make follower counts or clout metrics primary
- do not make it a separate route for current Home-side interaction
- do not confuse this collection workspace with Artist Profile
- do not place Release Deck, Print Shop, source-posting, or source-management controls here

## Feed Tab

Purpose: live community pulse inside Plot.

Allowed feed families:

- listener `Blast` activity
- artist/source updates
- track releases
- event/show updates
- community/system updates

Card taxonomy rule:

- map feed/message cards to the reusable families above
- do not create bespoke one-off card behavior for every feed row
- preserve deterministic Home Scene Feed semantics: no personalized ranking, no
  inline engagement actions on insert cards, and no separate notification feed
  replacing the main Feed

Current inserts:

- `Popular Singles`
- `Buzz`
- `Upcoming Events`

Boundaries:

- no algorithmic `For You`
- no inline `Collect`, `Blast`, `Follow`, or wheel actions on insert cards
- music insert cards hand into Artist Profile listening
- event inserts preview only; full event handling belongs in Events

## Avatar / Merch Visual Boundary

The Home identity avatar is part of the listener/player composition. Avatar
customization and avatar-interactive merch behavior remain deferred, but design
work should not over-render the avatar in a way that blocks future merch
wearables.

Current design guidance:

- use a stable shared avatar base/body model where possible
- support interchangeable clothing/body-piece layers such as shirts, jackets,
  pants, shoes, hats, and accessories
- treat the avatar as a stylized fit model for band merch; clothing and band art
  should remain readable
- clothing/artwork swaps should not require regenerating the full avatar
- do not turn this into a fashion/customization toy or listener marketplace

## Events Tab

Purpose: full event surface inside Plot.

Should include:

- scene/community label
- event cards/list
- title, date/time, venue/location
- artist/promoter association
- event detail state where needed

Do not add:

- paid boost controls
- generic social calendar behavior
- standalone promotion tab behavior

## Archive Tab

Purpose: descriptive community record/history lane.

Should include:

- scene/community identity
- descriptive activity snapshot
- top songs / scene activity modules where present
- historical community activity

Do not include:

- interactive `StatisticsPanel`-style deep analytics exploration as the current default Archive body
- tier/map/nearby-community exploration as the default Archive experience
- any behavior that assumes a separate Statistics tab in MVP
- leaderboards
- rankings
- trending hype
- predictive analytics
- comparative artist scoring

## Artist Profile

Purpose: direct-listen/discovery/info/share surface outside `RADIYO`.

Should include:

- artist header / identity
- follow
- share
- bio / information
- up to 3 direct-listen song rows
- local playback chrome for song rows
- `Collect` from profile listening context
- `Recommend` only after listener genuinely holds the song
- official artist links when configured: website, merch, albums/music, donate

Do not include:

- engagement wheel
- `Blast`
- RADIYO controls
- rankings/scores/editorial badges

## Design-Agent Handoff Rules

For Claude Designer, Stitch, Gemini, or similar tools:

- give code/UX references before art references
- ensure the tool repeats the screen hierarchy before it designs visuals
- stop the tool if it says Plot is a standalone screen
- stop the tool if it creates `Statistics` or `Promotions` as current MVP tabs
- stop the tool if it places the engagement wheel on Artist Profile
- stop the tool if it puts source-management tools inside the listener profile
- stop the tool if it designs a Spotify/TikTok/Instagram clone

## Current Upload / Context Pack

If a copied design pack is needed, use the latest pack under:

- `tmp/claude-designer-app-pack-2026-04-24`
- `tmp/claude-designer-app-pack-2026-04-24.tar.gz`

Prefer GitHub/code access when available. Use art/mockups only for visual flavor after the tool understands screen structure.

## Verification

For UI route/surface changes, run the narrowest relevant checks first:

- `pnpm --filter web test -- plot-ux-regression-lock.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`

Use broader `pnpm run verify` before PR/closeout when feasible.

## Update Rule

Patch this file whenever UI truth changes. Do not leave UI corrections in chat memory only.

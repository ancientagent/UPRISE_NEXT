# Discover Transport Map Player Founder Session

Status: raw founder-session capture
Date: 2026-07-01
Source: current chat/session
Related lane(s): UX_UI, COMM_DISCOVERY, ACTIONS_SIGNALS
Owner spec candidates:
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`

## Raw Founder Notes

> no this is fine for now, I just want to make sure we build it right so its easy to implement once it comes time.  there's a map view that I want to make part of the discover/transport system where they player has a "seek" feature, as written  its supposed to be swipe the player left to transport to a random citywide uprise in their state, and swipe right to be taken to a random statewide uprise (of the same music community) im just thinking with swipe being how the user switches homescenes  swiping the player right below that section probably isnt the best ui design, however im thinking that maybethis is only a feature when the user goes to discover first, which makes sense.  though im still not sure swipe may be the best, actually what would be perfect is the if the controlls we re in the action wheel once the user is in discover since many of those controls are dedicated to radiyo feaatures that will be unavailable while they are in communities outside their own. the onlu question im trying to solve now (cuz i dont really remember how i settled this if i did at all) which is do you transport to the uprises you load from your personal player.  and I guess that right there solves it, if you've saved an uprise it gets loaded into your personal player (where you cant vote etc)  I think i decided anyway that there's no real reason for someone to be in another community they arent a part of it, they should be able to search and discover new artists once they transport to another community but that is a different screen its not a plot system.  SO that  said! no there is no transport whatsoever in the plot!

> ok great so to answer your question there is no transport anything that happens inside the plot, the plot is the community dashbboard/neighborhood , only community members access those,  context does change when switching homescenes though. while users are listening to the uprise they will be able to select links to view artists profiles, add songs /tourdates to their calendar etc

## Clarifications

- Transport is part of the Discover/Away Scene system, not Plot.
- Type: settled, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- Plot is the community dashboard/neighborhood for community members. It has no transport actions; Home Scene switching may change context, but it remains Home Scene switching rather than transport.
- Type: settled, pending owner-spec promotion
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md` and `docs/specs/communities/discovery-scene-switching.md`

- While users listen to an Uprise, they may follow links to related surfaces such as Artist Profiles or calendar/tour-date actions. Those links/actions do not make Plot a transport surface.
- Type: settled, pending owner-spec placement confirmation
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`, `docs/specs/events/events-and-flyers.md`, and Artist Profile/source docs

- Saved Uprises can load into the personal player, where the user can listen without voting authority.
- Type: likely settled, pending owner-spec placement confirmation
- Likely owner: `docs/specs/communities/discovery-scene-switching.md` and future collection/personal-player contract

- Users should be able to search/discover artists after transporting to another community, but that search/discovery experience is a different screen and not a Plot system.
- Type: likely settled, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- Player-swipe transport may conflict with Home Scene switching/swiping near the top of Plot, so swipe should not be assumed as the final transport UI.
- Type: open design concern
- Likely owner: future Discover UI design spec / `docs/specs/communities/discovery-scene-switching.md`

- Discover action-wheel controls may be a better home for transport/seek controls because some RADIYO actions are unavailable outside the user's own communities.
- Type: open feature direction
- Likely owner: `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` plus Discover UI spec after confirmation

## Feature Sets

- Discover map + seek transport
- Raw basis: “there's a map view that I want to make part of the discover/transport system where they player has a "seek" feature”
- Included behavior:
  - transport/search happens in Discover, not Plot
  - possible seek behavior: random citywide Uprise in same state, or random statewide Uprise in the same music community
  - transport is user-initiated
  - transported users can listen/search/discover without voting authority
- Excluded / not activated:
  - no Plot transport UI
  - no voting outside voting-authorized Home Scene communities
  - no final commitment to swipe gestures
- Status: open design, not implementation-ready

- Saved Uprises into personal player
- Raw basis: “if you've saved an uprise it gets loaded into your personal player (where you cant vote etc)”
- Included behavior:
  - saved Uprises can serve as an entry into personal-player listening
  - personal player listening is not civic participation or voting
- Excluded / not activated:
  - no vote authority in saved/non-home Uprises
  - no implication that saved Uprises appear in the Home Scene selector
- Status: likely settled direction, needs owner-spec promotion

## Working Interpretation

- The product boundary is tightening: Plot remains the user's Home-side community shell. Transport belongs to Discover and collection/personal-player pathways.
- Plot should be understood as a community dashboard/neighborhood. It can reflect context changes from Home Scene switching and expose links/actions to related surfaces, but it should not originate transport.
- The old player swipe transport idea is not discarded, but it is no longer safe to assume as final UI because Home Scene switching/swiping now occupies nearby interaction semantics.
- Discover may need its own action-wheel state where unavailable Home/RADIYO civic controls are replaced by transport/search controls.
- Saved Uprises are personal-player listening contexts, not Plot/Home Scene contexts.

## Promotion Targets

- Owner spec: `docs/specs/communities/discovery-scene-switching.md`
- Lane brief: `docs/agent-briefs/UI_CURRENT.md`
- Companion brief: `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- Tests/runtime: later Discover/collection/personal-player tests once implementation is scoped
- Linear/PM: future Discover/transport planning slice, not current Plot cleanup

## Do Not Drift

- Do not add transport UI inside Plot.
- Do not interpret outbound links from Plot/Uprise listening to Artist Profiles, songs, tour dates, or calendar actions as transport.
- Do not treat Home Scene selector/swiper as transport.
- Do not assume player swipe is the approved final transport control.
- Do not grant voting authority through saved Uprises, personal-player listening, or Away Scene transport.
- Do not put saved Uprises into the Home Scene selector.

## Raw Founder Notes - Discover Front Door / Back Door Model

> ok so now i can explain discover... this will answer the rest of your questions on transport.  so we'll use language as there's a front door and a back door to every community. when a user hits discover they are taken to the front door which means they are still at their location but they can step out into any other community they want. to help them make this journey into the unknown there are some category/carusells each one containing relevant signals of a certain type, one being other neighboring citywide uprises from your primary music community, another being artists that are coming through to your city on tour, another could be popular suggestions for anything outside of your community made by people in your community (avatars with their reccomendation bubble) meanwhile  your player is still playing your homescene's uprise. from this screen there is a map view button that once you press it the user rotates their phone for lanscape view and their display is their player with a big map in the center. the map is another way for users to stumble upon new scenes that they would never know to search for, this of course would just be a map with plot points where communities exist. people viewing the map should be able to tell the the size and how active it is by the visual marker. to local citywide tier, their avatar will be there standing over
>   their community's icon zoomed into the inner state view (if they were listening at the citywide level when they pressed mapview) where they can see all the other local communities in different cities in their state (default will be the same music community as their homescenes but others can be unfiltered)  if they were listening at the statewide level then they would be seing that map at that scale, they can drag all around the map to discover new communities or use "seek" mode where tapping up on the seek button will take them to a random state and the down button will take them to a random city in that state.  once they reach another community they will land at the communities "back door" which is the same thing as the front door except its all stuff about the community you are visiting.  its a way to take a peek into the community listen to the music etc.. this map view is really important as later people will be able to see artists on tour in the map view just another way to discover things you would never know to search for

## Clarifications - Discover Front Door / Back Door Model

- Discover has a `front door` and `back door` model for communities.
- Type: feature architecture direction, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- The Discover front door starts from the user's current location/Home context. The user is still at their location, with their Home Scene Uprise continuing in the player, but can step out toward other communities.
- Type: settled direction, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- Discover front door should include category/carousel modules built from relevant signal types, such as neighboring citywide Uprises from the user's primary music community, artists touring through the user's city, and popular outside-community suggestions made by people in the user's community.
- Type: feature architecture direction, pending detailed contract
- Likely owner: `docs/specs/communities/discovery-scene-switching.md` plus future signal/search contracts

- Discover map view is entered from the Discover front door. The user rotates the phone to landscape and sees the player plus a large map.
- Type: feature architecture direction, pending design spec
- Likely owner: future Discover UI spec / `docs/specs/communities/discovery-scene-switching.md`

- Discover map markers represent communities. Marker visuals should communicate community size and activity level.
- Type: feature architecture direction, pending data/API contract
- Likely owner: `docs/specs/communities/discovery-scene-switching.md` plus future analytics/community projection contract

- Map default scope depends on the listening tier/context when map view opens: citywide listening opens an inner-state view showing local city communities in the state; statewide listening opens the map at the statewide scale.
- Type: feature architecture direction, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- The default map filter should be the same music community as the user's Home Scene, but the user should be able to unfilter to see other music communities.
- Type: feature architecture direction, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- Seek mode is a user-initiated random discovery mechanic. The working direction described here: tapping up on seek takes the user to a random state; tapping down takes the user to a random city in that state.
- Type: feature architecture direction, pending exact UI/control confirmation
- Likely owner: `docs/specs/communities/discovery-scene-switching.md` and `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`

- Arriving at another community lands the user at that community's `back door`: a visitor-facing version of the front door with content about the community being visited, letting the user peek in and listen without becoming a Plot/community member.
- Type: settled direction, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- Future map view should support artists-on-tour visibility as another way for users to discover things they would not know to search for.
- Type: future feature direction
- Likely owner: Discover spec plus events/touring contracts

## Feature Sets - Discover Front Door / Back Door Model

- Discover front door
- Raw basis: “when a user hits discover they are taken to the front door which means they are still at their location but they can step out into any other community they want”
- Included behavior:
  - starts from the user's current Home/location context
  - Home Scene Uprise keeps playing in the player
  - category/carousel modules help the user start discovery without search-first behavior
  - modules can include neighboring same-music-community Uprises, touring artists, and community-member suggestions
- Excluded / not activated:
  - not Plot
  - not voting authority outside the user's eligible Home Scene communities
  - not algorithmic/personalized recommendation
- Status: design direction, not implementation-ready

- Discover map view
- Raw basis: “from this screen there is a map view button... their display is their player with a big map in the center”
- Included behavior:
  - entered from Discover front door
  - landscape orientation concept
  - player remains present
  - map shows community plot points
  - markers encode size/activity
  - default map filter follows user's Home Scene music community, with optional unfiltering
  - scope depends on current listening tier/context
- Excluded / not activated:
  - no current runtime implementation
  - no final marker visual system yet
  - no final map provider/API choice yet
- Status: design direction, not implementation-ready

- Seek mode
- Raw basis: “use "seek" mode where tapping up on the seek button will take them to a random state and the down button will take them to a random city in that state”
- Included behavior:
  - explicit user-initiated random discovery
  - random state and random city traversal
  - should remain same music-community by default unless user unfilters
- Excluded / not activated:
  - not final gesture/control design
  - not automatic recommendation
  - not authority/voting mutation
- Status: design direction, control details open

- Community back door
- Raw basis: “once they reach another community they will land at the communities "back door" which is the same thing as the front door except its all stuff about the community you are visiting”
- Included behavior:
  - visitor-facing community preview after transport
  - content is about the visited community
  - user can peek in and listen
  - remains separate from Plot/community-member dashboard
- Excluded / not activated:
  - no Plot access for non-members
  - no voting authority
  - no implicit join/home-scene mutation
- Status: design direction, likely settled boundary

## Working Interpretation - Discover Front Door / Back Door Model

- Discover is not simply a map page. It has a front-door state that starts from the user's current Home context and helps them choose a transport path through curated/deterministic signal categories.
- The player continues the user's Home Scene Uprise while they are at the front door, reinforcing that they have not left Home yet.
- Map view is an exploratory transport mode, likely landscape-first, with player plus geography as the main interface.
- Transport arrival should not drop users into Plot. It should land them at a visitor/back-door surface for the target community.
- The back door is the visitor counterpart to the front door: community preview, listening, artist/event discovery, no civic authority.
- Seek is an explicit random traversal control, not a recommendation engine.

## Do Not Drift - Discover Front Door / Back Door Model

- Do not treat Discover as Plot.
- Do not land transported visitors inside a member Plot/community dashboard.
- Do not stop the Home Scene Uprise at the Discover front door unless a later player spec says so.
- Do not turn seek into algorithmic recommendation or personalization.
- Do not make map markers pure decoration; they should communicate community presence, scale, and activity.
- Do not make other-music-community visibility impossible; default same-music-community filtering should be removable.

## Raw Founder Notes - Front Door vs Back Door Content Context

> wshat you are not including is important, the context at the front door is all music outside your community though related enough to help the user check stuff out. the back door is all the highlights and popular stuff about that community according to that community

## Clarifications - Front Door vs Back Door Content Context

- Discover front door content is outside the user's community, but related enough to help them start checking things out from their current context.
- Type: settled clarification, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- Community back door content is the visited community's own highlights and popular material, according to that community.
- Type: settled clarification, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

## Working Interpretation - Front Door vs Back Door Content Context

- Front door is outward-looking from the user's Home context: it introduces external music/scenes/signals that are adjacent, relevant, or socially bridged enough for the user to explore.
- Back door is inward-looking for the target community: it shows that community's own highlights, popular signals, artists, events, and listening context as understood by that community.
- This prevents front door and back door from becoming the same generic discovery page.

## Do Not Drift - Front Door vs Back Door Content Context

- Do not make the front door a feed of the user's own community.
- Do not make the back door a personalized outside-community recommendation feed.
- Do not flatten front door and back door into one generic Discover page.

## Raw Founder Notes - Discover Transport Activation Timing

> i do think its fair to not worry about it neccessarily until it has become popular enough for people to travel

## Clarifications - Discover Transport Activation Timing

- Discover transport/travel does not need to be implemented immediately. It can remain deferred until the platform has enough popularity/activity for cross-community travel to matter.
- Type: deferred/future activation boundary
- Likely owner: `docs/specs/communities/discovery-scene-switching.md` and `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`

## Working Interpretation - Discover Transport Activation Timing

- Keep current local-community-first MVP posture.
- Design Discover/transport cleanly now so future implementation is easy, but do not make it a near-term build priority until community activity justifies travel.
- This reinforces that current Plot cleanup should not absorb Discover transport work.

## Do Not Drift - Discover Transport Activation Timing

- Do not treat Discover transport as required for launch readiness.
- Do not overbuild map/seek/back-door transport before there is enough cross-community demand.
- Do not block current Home/Plot/community work on future Discover travel.

## Raw Founder Notes - Beta Milestone Boundary

> so we will release it in beta but not to get to beta

## Clarifications - Beta Milestone Boundary

- Discover transport/map/seek/back-door can be released during beta, but it is not required to reach beta.
- Type: settled milestone boundary, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`, `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`, and roadmap/PM docs when planning beta scope

## Working Interpretation - Beta Milestone Boundary

- Pre-beta work should preserve clean contracts and avoid blocking on Discover transport.
- Beta can include Discover transport once enough community activity exists and the UX/data contracts are ready.
- This should be treated as a beta expansion target, not a beta entry requirement.

## Do Not Drift - Beta Milestone Boundary

- Do not classify Discover transport as required before beta.
- Do not defer Discover transport beyond beta by default; it is eligible for beta release when justified by activity and implementation readiness.

## Raw Founder Notes - Back Door / Front Door Shared Screen Clarification

> discover is where the user travels around the map manually or through using "seek mode"  which we talked about earlier, which takes the user around the map randomly. going to different community backdoors where they can listen to their uprise, and learn a bit about their top artists, and different contexts about that community. they can save or "add" the uprise to their collection. so when they are back in their homescene they can pop it on, talk about it, promote it to their community members. another way a user can learn about / visit / discover new uprises is if someone in their community blasts one and it shows up in their feed they can click on it to listen to it (the player will load the uprise and say which one it is) and if they like it and want to discover more about the community they can transport to it learn about the other artists, sects, etc.  (also there will eventually be merch tables there so visitors can collect more merch form other communities)

> yes the back door for visitors is the same screen as the front door for nativs the context is just switched. you did document our discover discussion from yesterday when we talked about all this correct? please use your document / context skill that saves to the clarification doc

## Clarifications - Back Door / Front Door Shared Screen

- Discover is where users travel around the map manually or through `Seek Mode`.
- Type: settled clarification, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- `Seek Mode` randomly takes the user around the map to different communities/back doors.
- Type: settled clarification, pending control/API design
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- A visited community back door lets the visitor listen to that community's Uprise and learn about that community's top artists, sects, and other community context.
- Type: settled clarification, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- The back door for visitors is the same screen as the front door for natives; the context is switched to the visited community.
- Type: settled clarification, pending owner-spec promotion
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`

- Users can save/collect a visited Uprise to their collection. Where the raw note says they can later play it from their Home Scene context, that should be read with the later RADIYO/SPACE correction: saved/custom Uprise playback is Discover/collection-owned, not launched from the Plot top shell. The Home Scene relevance is conversation/promotion back to their community members, not a new Plot playback launcher.
- Type: settled clarification with superseded playback wording, pending collection/player contract
- Likely owner: `docs/specs/communities/discovery-scene-switching.md` and future collection/personal-player contract

- A Home Scene Feed blast can expose another Uprise. Clicking it can load that Uprise into the player with a clear label for which Uprise is playing. If the user wants deeper context, Plot should hand off to Discover/back-door context rather than originate transport inside the Feed or Plot surface.
- Type: settled clarification, pending Feed/player/Discover contract
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`, `docs/specs/communities/discovery-scene-switching.md`, and future feed/player tests

- Future visited-community back doors may include merch tables so visitors can collect merch from other communities.
- Type: deferred/future feature direction
- Likely owner: future Discover/commerce/merch specs

## Working Interpretation - Back Door / Front Door Shared Screen

- Front door and back door should not be implemented as unrelated screen architectures. They can share a reusable screen pattern, but their content semantics stay different.
- A native Discover front door remains outward-looking from the user's Home context: it surfaces related music/scenes/signals outside the user's community.
- A visitor back door presents the same kind of community context for visitors after transport, without granting membership, voting authority, or Plot/community-dashboard access.
- Discover travel can start from manual map exploration or Seek Mode; a Feed blast can load another Uprise and offer a handoff into Discover/back-door context without adding transport UI inside Plot.
- Saving/collecting an outside Uprise creates a collection/listening artifact for Discover-owned playback and later Home Scene conversation/promotion; it does not change Home Scene membership.

## Do Not Drift - Back Door / Front Door Shared Screen

- Do not build separate unrelated front-door and back-door screen architectures.
- Do not make visited-community listening equivalent to joining or voting in that community.
- Do not put saved outside Uprises in the Home Scene selector.
- Do not make a Feed blast transport the user automatically into another community; clicking can load/listen, and deeper context must hand off to Discover rather than originate transport inside Plot.
- Do not treat merch tables as current MVP unless explicitly scoped later.

## Raw Founder Notes - Feed Card Travel Action Correction

> the feed card should have a link to travel as well from the feed, they should be able to click on the card to load the uprise or click on the travel to take them to that community (and load the uprise)

## Clarifications - Feed Card Travel Action Correction

- Feed cards that surface another Uprise should support two distinct user actions: clicking the card loads/listens to that Uprise, while clicking `Travel` takes the user to that community's visitor/back-door context and loads the Uprise.
- Type: settled correction to previous Feed/Plot transport wording, pending owner-spec promotion
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`, `docs/specs/communities/discovery-scene-switching.md`, future Feed/player tests

## Working Interpretation - Feed Card Travel Action Correction

- The prior rule should not be read as banning every `Travel` link on Feed cards.
- The safer boundary is: Feed may expose an explicit `Travel` link on eligible outside-Uprise cards, but that action hands off to Discover/back-door visitor context and loads the Uprise. It does not turn the full Plot shell, Home Scene selector, or profile pull-down into a general transport system.
- Card click and `Travel` click are separate: card click is listening; `Travel` click is visitor/community context plus listening.

## Do Not Drift - Feed Card Travel Action Correction

- Do not make card click and `Travel` click the same action.
- Do not remove Feed-card travel just because general Plot transport remains disallowed.
- Do not make Feed-card travel grant membership, Home Scene authority, or voting rights in the visited community.
- Do not add map/Seek/saved-custom-Uprise launchers to Plot under this correction.

## Raw Founder Notes - Blast Card Signal Source Link

> for all blast cards the signal being blasted has a link taking the user to the signals source

## Clarifications - Blast Card Signal Source Link

- Every Blast card should make the blasted signal itself link to that signal's source.
- Type: settled clarification, pending owner-spec promotion
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`, `docs/specs/communities/discovery-scene-switching.md`, `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`, future Feed/Blast card tests

## Working Interpretation - Blast Card Signal Source Link

- Blast cards can expose multiple distinct destinations when the underlying signal supports them.
- The blasted signal/source link takes the user to the source of the specific signal being blasted, such as an Artist Profile, event/tour-date surface, song/single surface, or visited Uprise source context depending on signal type.
- This is separate from a `Travel` link. `Travel` is for visiting the community/back-door context and loading that Uprise; the signal link is for opening the source object behind the blast.

## Do Not Drift - Blast Card Signal Source Link

- Do not make all Blast-card clicks default to `Travel`.
- Do not hide or remove the source link for the signal being blasted.
- Do not collapse signal-source navigation and community travel into one ambiguous action.
- Do not grant voting rights, membership, or Home Scene authority from either link.

## Raw Founder Notes - Blast Card Feed Card Type

> blast card is a card in the feed

## Clarifications - Blast Card Feed Card Type

- A `Blast card` is a Feed card type, not a separate non-Feed surface.
- Type: settled terminology correction, pending owner-spec promotion
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`, `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`, future Feed/Blast card tests

## Working Interpretation - Blast Card Feed Card Type

- Blast-card source links and optional Travel links should be documented under the Feed card contract.
- Future agents should not model Blast cards as a separate destination, tab, panel, or surface outside Feed.

## Do Not Drift - Blast Card Feed Card Type

- Do not treat Blast cards as separate from Feed cards.
- Do not create a separate Blast-card surface just to support signal source links or Travel links.

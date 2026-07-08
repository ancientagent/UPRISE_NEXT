# Player Dropdown And Inventory Visual Language Founder Session

Status: raw founder-session capture
Date: 2026-07-06
Source: current chat/session
Related lane(s): Home/Plot UI, player, inventory, actions/signals, product design
Owner spec candidates: `docs/specs/communities/plot-and-scene-plot.md`; `docs/specs/broadcast/radiyo-and-fair-play.md`; `docs/specs/core/signals-and-universal-actions.md`

## Raw Founder Notes

> yeah should we make this so all of this is a dropdown from the player like the player is the tool that allows us to communicate and what not, I think this could be the best visual language to kind pull it all together.  then there's the inv outside of the player when you swipe it down where you can add/replay everything from the player.

> not the current song but the community

> so you notice how in this mockup we can see how blasts are represented, then we have system driven feeds, and then a carusel of upcoming events,  these are just some examples one way or another designing these could also help really ground the look.  what are you thinking?  we have the static xerox /color faux animation style,  we have the underground event flyer style, an upgraded wireframe style,  or hacker/underground community communicator device, actually for this I would looove to see a classic winamp take graphically,  like if the future winamp was this, same design elements with a hair more polish.. I think this is what would set it off, then really we could just have a different player/device for the communities instead of all the other stuff

> well the signals could be a bit more uniform if it were this rout

> more subtle old school web graphics

> for the cards

> no i mean the winamp player for the community, we can make a winamp player for landscape mode boombox stuff like that

> right. no winamp for the main experience

> we will save it for a bonus llandscape listening mode

> yes ok so I was thinking a frame on the left and the homescene title on the
> right, and we could tap the avatar to slide them to the center expanding the
> background image accross the top frame (vague outdoor or at a show or
> something) then they can pull the tab down to bring them into their indoor
> space fade transition)

> maybe when we open the top shell the scene title goes off screen and makes
> room for their stats, (followers, following, notifications this is where they
> can change out there reccomendation, then bringing them lower that can all fade
> out so we dont need to bring it in the space

> the stats sects, maybe this is how they can change sect broadcasts  they can
> be behind black tape

> this photo could be what seperates the communities too

> at a show punk,  a truck in a field country,  a graffiti wall hiphop

> thats what i mean the app would be able to run it fine right? i mean the user
> could select the sect but it could fire it up upon returning to the homescene.
> also the music is always playing btw

> well if its too difficult, we could do it to where you listen to the personal
> player in the space so the music from the RaDIYo could fade out when entering
> the space

> best would be music never stops playing and there are radiyo and track mode on
> the player, but it wouldnt be the end of the world and might even make more
> sense that the two players are seperate, if that was the case, the saved uprise
> channels would have to appear in the top shell as well which really is pretty
> much the same thing as the sect select

## Clarifications

- The RADIYO/player surface may be the visual and interaction language that ties together the current community/Home Scene, scene signal, and listener actions.
- Type: open design direction
- Likely owner: Product design handoff; `docs/specs/communities/plot-and-scene-plot.md` if behavior changes.

- Correction: the dropdown concept should be community-scoped, not current-song-scoped. The player is the tool for communicating with or acting in the community/scene context.
- Type: stale correction / design clarification
- Likely owner: Product design handoff; `docs/specs/communities/plot-and-scene-plot.md` if behavior changes.

- Inventory should remain visually and conceptually outside the player when swiped down, even if the player is the entry point for collecting, replaying, or acting on the current track.
- Type: open design direction
- Likely owner: Product design handoff; future listener inventory/profile spec.

- Blast representation, system-driven feed rows, and upcoming event carousels can be used as visual modules to ground the Home/Plot look, but they remain examples of community signal types rather than generic social feed content.
- Type: design direction
- Likely owner: Product design handoff; `docs/specs/communities/plot-and-scene-plot.md` if behavior changes.

- If the player/device route is used, signal presentation should become more
  uniform. Blast, source updates, system notices, and event previews can share a
  consistent signal-module grammar instead of each becoming a bespoke card.
- Type: design direction
- Likely owner: Product design handoff; `docs/specs/communities/plot-and-scene-plot.md` if behavior changes.

- The player/device visual route should use subtle old-school web graphics for
  the signal cards/modules rather than heavy full-poster illustration on every
  module.
- Type: design direction
- Likely owner: Product design handoff.

- Correction: the Winamp/boombox idea is for the community-facing player/device,
  especially landscape mode, not for the public Artist Profile tech/control
  layer.
- Type: design clarification
- Likely owner: Product design handoff; `docs/specs/broadcast/radiyo-and-fair-play.md`
  only if behavior changes.

- Correction: Winamp should not become the main/default UPRISE experience.
  Treat it as a constrained landscape-mode community-player/boombox exploration,
  not the primary portrait Home/Plot, public Artist Profile, or app-wide visual
  language.
- Type: design clarification
- Likely owner: Product design handoff.

- Product label/direction: the Winamp/boombox treatment should be saved for a
  bonus landscape listening mode.
- Type: design clarification / future mode label
- Likely owner: Product design handoff; owner specs only if the bonus mode is
  later activated.

- Default Home Scene portrait direction can use the clean/rugged Artist Profile
  visual language: an avatar/photo frame on the left, Home Scene title on the
  right, player beneath, and normal Plot content below.
- Type: design clarification
- Likely owner: Product design handoff; `docs/specs/communities/plot-and-scene-plot.md`
  only if behavior changes.

- Avatar interaction direction: tapping the avatar can slide the avatar into
  the center and expand the background photo across the top frame; pulling the
  tab down can fade-transition into the listener's indoor/personal space.
- Type: design-only interaction direction / open
- Likely owner: Product design handoff; future listener inventory/profile spec
  if activated.

- Expanded top-shell direction: when the top shell opens, the Home Scene title
  can move offscreen to make room for listener-facing stats/status and
  recommendation controls; as the user pulls lower into the indoor space, that
  expanded top-shell information can fade out rather than being carried into the
  indoor/inventory layer.
- Type: design-only interaction direction / open
- Likely owner: Product design handoff; owner specs only if stats,
  notifications, or recommendation-edit behavior are activated.

- Sect broadcast switching may belong in the expanded top-shell stats/status
  area rather than inside the indoor/inventory space. Visually, sect broadcast
  controls can be treated as concealed/gated behind black tape.
- Type: design-only interaction direction / open
- Likely owner: Product design handoff; `docs/specs/communities/plot-and-scene-plot.md`
  and Registrar/sect owner specs only if sect broadcast behavior is activated.

- Sect selection can be treated as a staged selection while the listener is
  outside the Home Scene view; the selected sect broadcast can fire up or become
  active when the listener returns to the Home Scene.
- Type: design/product interaction clarification / open
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`;
  Registrar/sect owner specs if sect broadcast behavior is activated.

- Music is always playing. The player/listening layer should be understood as
  persistent through Home Scene, top-shell, indoor/inventory, and return
  transitions unless a later owner spec defines a specific pause/stop case.
- Type: product interaction clarification
- Likely owner: `docs/specs/broadcast/radiyo-and-fair-play.md`; Product design
  handoff.

- Fallback interaction option: if keeping the same RADIYO player continuous
  through the indoor space proves too difficult, the indoor/personal space can
  use a personal player while RADIYO fades out on entry. Returning to the Home
  Scene can fade RADIYO back in or apply the selected sect broadcast there.
- Type: product interaction fallback / open
- Likely owner: `docs/specs/broadcast/radiyo-and-fair-play.md`; future listener
  inventory/profile spec if activated.

- Preferred audio model: music never stops, and the player can expose both
  RADIYO mode and track mode rather than treating page/shell transitions as
  playback stops.
- Type: product interaction clarification / open
- Likely owner: `docs/specs/broadcast/radiyo-and-fair-play.md`; Product design
  handoff.

- Acceptable fallback: RADIYO and the personal/track player may be separate
  players if that makes the implementation or product model cleaner. If separate
  players are used, saved Uprise channels should appear in the top shell as a
  channel-selection family, conceptually similar to sect selection.
- Type: product interaction fallback / open
- Likely owner: `docs/specs/broadcast/radiyo-and-fair-play.md`;
  `docs/specs/communities/discovery-scene-switching.md`; future listener
  inventory/profile spec if activated.

- Community photo treatment may be the primary visual differentiator between
  Home Scenes/communities. Community-specific scene photography can separate
  communities visually while preserving the same architecture, actions, and
  routing rules.
- Type: design clarification
- Likely owner: Product design handoff; `docs/specs/communities/plot-and-scene-plot.md`
  only if behavior or data contracts change.

- Example community-photo directions: punk can use at-a-show/live-room
  photography; country can use a truck in a field or comparable local rural
  scene image; hip-hop can use a graffiti wall or comparable street/community
  scene image.
- Type: design examples / visual prompt seeds
- Likely owner: Product design handoff.

## Feature Sets

- Player-as-signal-tool
- Raw basis: "the player is the tool that allows us to communicate and what not"
- Included behavior:
  - The player dropdown can expose context for the current Home Scene/community.
  - Community-level controls can feel like broadcast/signal controls rather than
    generic social buttons.
  - The player visually connects RADIYO broadcast, scene signal, community
    context, artist/source links, and allowed listener actions.
- Excluded / not activated:
  - This does not authorize listener-to-listener chat or social posting.
  - This does not move `Blast` onto the RADIYO wheel.
  - This does not authorize saved/custom Uprise playback from Plot unless the current Plot/Discover boundary is explicitly reopened.
- Status: design-only / open.

- Inventory outside-player drawer
- Raw basis: "there's the inv outside of the player when you swipe it down"
- Included behavior:
  - Swiping down can reveal a separate Inventory space tied to the listener/avatar.
  - Inventory can contain held/collected/replayable items and provide a way to return to the player.
  - The UI should make clear when the listener is using scene RADIYO versus their personal inventory/space.
- Excluded / not activated:
  - Full saved/custom Uprise transport remains governed by Discover/Plot boundary docs.
  - Do not turn Inventory into a social feed or profile page replacement.
- Status: design-only / open.

- Home Scene avatar frame and indoor-space transition
- Raw basis: "a frame on the left and the homescene title on the right" and
  "tap the avatar to slide them to the center expanding the background image
  accross the top frame"
- Included behavior:
  - Default portrait Home Scene can show a left-side avatar frame with a black
    and white or muted scene photo background.
  - Home Scene title/context can sit to the right of the avatar frame.
  - The player should sit underneath that top identity frame before normal Plot
    content.
  - Tapping the avatar can shift the avatar to center and expand the background
    image across the top frame.
  - The background image can be vague outdoor, venue, show, or scene-location
    photography to give the listener's space dimension.
  - Community-specific photography can help distinguish one Home Scene/community
    from another without changing the underlying Home/Plot structure.
  - Example photo families can include punk at a show, country with a truck in a
    field or rural scene, and hip-hop against a graffiti wall or street-scene
    background.
  - Pulling a tab down can transition with a fade into the listener's indoor
    personal/inventory space.
  - Opening the top shell can move the Home Scene title offscreen to reveal
    listener status/stat areas such as followers, following, notifications, and
    recommendation-edit access, pending product authority for the exact labels
    and behavior.
  - The same expanded top-shell stats/status area may contain sect broadcast
    switching or sect broadcast access, visually concealed or gated behind
    black tape.
  - Sect selection can be staged while the listener is outside the Home Scene
    view and applied when the listener returns to the Home Scene.
  - As the user pulls lower into the indoor/inventory space, the top-shell
    stats/status/recommendation layer can fade out so the indoor space does not
    need to duplicate that content.
  - Music/listening should persist through the top-shell expansion, indoor-space
    pull-down, and return-to-Home-Scene transition.
  - Fallback path: entering the indoor/personal space can crossfade from RADIYO
    to a personal player if the persistent-RADIYO model is too complex for the
    first implementation.
  - Preferred player model can expose RADIYO mode and track mode on the same
    persistent player.
  - If RADIYO and personal/track listening are separate players, saved Uprise
    channels can appear in the top shell with the same broad selection grammar
    as sect broadcast selection.
- Excluded / not activated:
  - This does not authorize a separate normal profile route replacing Home.
  - This does not authorize saved/custom Uprise playback from Plot unless the
    Plot/Discover boundary is reopened.
  - This does not make the indoor space a social feed, DM surface, or source
    management surface.
  - This does not authorize a generic social follower graph, notification
    system, or recommendation-edit runtime without owner-spec support.
  - This does not authorize sect broadcast switching, sect creation, sect
    visibility, or independent sect broadcast authority without owner-spec and
    Registrar/sect contract support.
  - This does not define sect eligibility, sect membership, sect broadcast
    priority, queueing, persistence, or conflict resolution.
  - This does not define final audio-session ownership, crossfade timing,
    queue transfer, resume position, or conflict behavior between RADIYO and a
    personal player.
  - This does not activate saved/custom Uprise playback from Plot or move
    Discover-owned saved Uprise transport into Home without an owner-spec
    decision.
  - This does not define whether saved Uprise channels and sect broadcasts share
    one data model, only that the top-shell selection pattern may be visually
    similar.
  - This does not change action grammar, upvote ownership, GPS authority, or
    Home Scene selection rules.
- Status: design-only / open.

- Future-Winamp community device visual language
- Raw basis: "classic winamp take graphically, like if the future winamp was this"
- Included behavior:
  - Treat the community/player as the core device that ties together RADIYO,
    scene signal, Blast representation, system-driven community updates, and
    event previews.
  - Explore a more polished version of old Winamp/device UI blended with UPRISE
    punk flyer, xerox, lime signal, red marker, and underground communicator
    language.
  - Use subtle old-school web graphics on cards/modules: small signal icons,
    low-fi textures, pixel/bitmap-like accents, compact panels, and restrained
    motion rather than oversized decorative flyer art everywhere.
  - Use a uniform signal-module grammar so Blast, system updates, source
    updates, and event previews feel like outputs from the same community
    device.
  - Consider whether different communities can have distinct player/device
    skins while preserving the same Home/Plot architecture and action rules.
  - Reserve denser Winamp/boombox-style controls for a bonus landscape listening
    mode where the layout has room for a fuller community-player/boombox
    treatment.
- Excluded / not activated:
  - Do not import generic streaming-app player chrome.
  - Do not turn community device skins into different product behavior per
    community.
  - Do not add new feed/action mechanics just because the visual modules exist.
  - Do not push the landscape community-player device treatment into the public
    Artist Profile portrait/mobile direction by default.
- Status: design-only / open.

## Working Interpretation

- The strongest visual model may be: player first, dropdown for community/scene signal and allowed community actions, then a separate swipe-down Inventory layer owned by the avatar/listener.
- This would let UPRISE reduce separate surfaces while preserving the core distinction between public scene broadcast and private listener inventory.
- The phrase "communicate" should likely mean communicate signal/support/attention through approved actions, not chat/DM/social posting.
- A specific founder decision is still needed before changing durable specs: which community-level controls belong in a player dropdown, and whether Plot's player/inventory drawer is allowed to launch/replay inventory items broadly or only operate as listener inventory outside the community dropdown.
- A later bonus landscape listening mode visual exploration can include a
  classic Winamp / underground communicator take: the community RADIYO device
  becomes a fuller boombox-like object, and Blast/system/event modules can read
  as device-fed signal outputs. This is not the main/default portrait
  experience.
- Uniform signal modules can reduce product clutter: the distinction comes from
  signal type, source/avatar, timestamp/date, and allowed action, not from
  totally different card layouts.
- The next mockup should avoid over-illustrating the signal cards/feed modules.
  Cards should feel like usable old-school web/device interface pieces with
  punk/DIY texture, not a poster wall.
- The Winamp/boombox reference should be carried forward as a bonus landscape
  listening mode exploration. Portrait public Artist Profile work can keep the
  local zine/source-page direction without inheriting the denser community-player
  controls.
- The main portrait Home Scene direction should adapt the clean/rugged Artist
  Profile look into a top identity frame: avatar/photo scene on the left,
  Home Scene title on the right, player underneath, normal Plot content below.
- The avatar can become the transition object between public Home Scene context
  and private listener inventory/indoor space: tap centers/expands the avatar
  frame, then pull-tab/fade transitions into the indoor layer.
- The expanded top shell can briefly carry listener-facing status and controls
  such as stats, notifications, and recommendation changes; those should fade
  away before the indoor/inventory space takes over, keeping the indoor layer
  lighter and more spatial.
- If sect broadcast switching is explored, it should stay in the expanded
  top-shell stats/status layer and can use black-tape concealment/gating as a
  visual metaphor. It should not be treated as activated sect broadcast runtime.
- The app can support this without making the demo heavy if sect choice is
  treated as staged UI state and applied on return to Home Scene, while the
  persistent player continues underneath.
- Music should be treated as continuous across Home Scene, expanded top shell,
  indoor/personal space, and return transitions. The visual shell should not
  imply that navigation stops playback.
- If continuous RADIYO through the indoor space is too heavy, a practical
  fallback is a crossfade: RADIYO fades out as the listener enters the indoor
  personal space, the personal player owns listening inside that space, and
  RADIYO resumes/fades back in when returning to the Home Scene.
- The ideal player model is persistent music with RADIYO and track mode
  available on the player. The acceptable fallback is two separate players, but
  that pushes saved Uprise channel selection into the top shell so it can sit
  beside or mirror the sect-select interaction.
- Community-specific photos can carry visual identity between communities. This
  should be treated as a visual skin/content layer, not as permission for
  different screen architecture, action rules, or route behavior per community.
- The examples should guide art direction, not create rigid stereotypes. Local
  photography should still be grounded in the actual city + music community when
  real assets exist.
- The outdoor/show photo background should create dimension, not become a
  full-screen hero that hides player, inventory access, Feed, Events, or Archive.

## Promotion Targets

- Product design handoff for the next Home/Plot mockup revision.
- Owner spec candidate: `docs/specs/communities/plot-and-scene-plot.md`
- Owner spec candidate: `docs/specs/broadcast/radiyo-and-fair-play.md`
- Lane brief candidate: `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- Runtime/tests if activated: `apps/web/src/app/plot/page.tsx`; `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`; `apps/web/src/components/plot/PlotListenerProfile.tsx`

## Do Not Drift

- Do not make UPRISE a social media network.
- Do not interpret "communicate" as chat, comments, DMs, or generic posting.
- Do not move `Blast` onto the RADIYO wheel or public Artist Profile.
- Do not make the player swallow all app navigation.
- Do not design this as a current-song drawer when the intended object is the community/Home Scene.
- Do not blur community actions, personal Inventory, and Discover transport without an explicit owner-spec decision.
- Do not make per-community player/device skins change allowed actions, voting,
  Home Scene authority, or navigation behavior.
- Do not create bespoke visual systems for every signal type if the community
  device route is selected.
- Do not interpret the Winamp/boombox idea as Artist Profile admin tech chrome;
  it belongs to the community player/device exploration, especially landscape
  mode.
- Do not make Winamp the main/default UPRISE experience or app-wide visual
  language.
- Do not build the bonus landscape listening mode unless a later scoped design
  or implementation slice explicitly activates it.
- Do not let the avatar/photo-frame treatment turn Home into a generic profile
  page or social landing page.
- Do not make the indoor personal space replace Plot, Discover, or source tools.
- Do not hide immediate player, inventory, Feed, Events, or Archive access behind
  an oversized visual hero.
- Do not treat top-shell follower/following/notification/recommendation labels
  as approved runtime fields until the owner specs define them.
- Do not duplicate the expanded top-shell stats/status content inside the indoor
  inventory space by default.
- Do not implement sect broadcast switching, sect broadcast visibility, or
  independent sect broadcast authority from this visual note alone.
- Do not make staged sect selection stop, reset, or remount the player.
- Do not design the indoor/inventory transition as a music-off state.
- Do not treat the personal-player fallback as permission to stop all music when
  entering the indoor space.
- Do not implement crossfade/session handoff behavior without a scoped audio
  owner-spec/runtime slice.
- Do not add saved Uprise channel selection to the top shell as active runtime
  until the Plot/Discover/saved-Uprise ownership boundary is explicitly
  resolved.
- Do not let community-specific photography create one-off community behavior,
  city-specific logic, or different Home/Plot architecture.
- Do not hardcode punk/country/hip-hop images as fixed genre stereotypes; use
  them as prompt seeds and replace with real local community imagery when
  available.

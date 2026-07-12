# Home Feed Card Grammar And Support Founder Session

Status: raw founder-session capture
Date: 2026-07-09
Source: current chat/session
Related lane(s): Home/Plot UI, Feed cards, player, avatar system, actions/signals
Owner spec candidates: `docs/specs/communities/plot-and-scene-plot.md`; `docs/specs/core/signals-and-universal-actions.md`; `docs/specs/engagement/activity-points-and-analytics.md`; future avatar/customization owner spec

## Raw Founder Notes

> ok so the avatars are not in circles they need to be able to show a band shirt/hat etc.  no bubbles.  so it would be closest to the 3rd one since all the sources are normalized.  I actually really like the idea of someone's blast being  the faceplate of their player. (we should offer customizable player stuff)  (for this i like the second one better).  feed cards dont need to have  the source labeled in it  all sources stay on the left (same size)  however its just the message  comeing from the source and a link if there is a signal being reference.

> Like I said, each card source should have its own flare.  also to fill in some more space, listeners should probably be able to "support" stuff this should be similar to "reactions" on facebook  that people build up by being active in the community and they can show support on cards (giving an amount) that gets given to the source.    this should likely be added to features.   this can be measured in activity and given in support

> from belly up

> hmm the cards look a lot better but now the top is all wrong.  Also i may have forgotten to mention this but the avatars (in the feed cards) should display the username  and their support score.  The listener cards should take up the same amount of space as other source cards,  (should be be smaller rather than making others larger)  as far as the blasts go, if we are going to do the player face, it shouldnt be the whole player it should be the digial screen with 2 lines of text, the song name scrolling and the uprise underneath.  the tower denoting which tier its on. you dont need to add "<user> is blasting" in this case.  it would be obvious.  also the tower for the 3 tiers its 1 tower and at the top you have the 3 signal bands on either side at the top.  having the hole tower lit up  and the first set of bands lit up is the first tier.  becuase its showing a weaker signal for a shorter range. lets really pay attention here and try to clear these up. so we can move on

## Clarifications

- Feed source identities must be rendered from the belly up, not as circular avatar portraits, so visible clothing and wearable items such as band shirts or hats remain legible.
- Type: settled design clarification
- Likely owner: future avatar/customization owner spec; Home/Plot product design handoff.

- The feed uses one normalized, same-footprint source rail on the left. The card body should not repeat a source label; it should contain the message and, when applicable, a link to the referenced signal.
- Type: settled design clarification
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`; Home/Plot product design handoff.

- Ordinary Feed cards must not use message bubbles. A Blast may use the listener's player faceplate and a compact track/ticker treatment as its distinctive visual form, rather than becoming a generic chat bubble.
- Type: settled design clarification
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`; `docs/specs/broadcast/radiyo-and-fair-play.md`; Home/Plot product design handoff.

- Each source type needs its own visual flare while preserving the normalized left-side source position and common feed-card grammar.
- Type: settled design clarification
- Likely owner: Home/Plot product design handoff; `docs/specs/communities/plot-and-scene-plot.md` if the card contract needs visual-state guidance.

- Customizable player faceplates or related player customization are desired, but the available customization, ownership, moderation, persistence, and launch scope are not yet defined.
- Type: deferred feature concept
- Likely owner: future player/avatar/customization owner spec.

- Correction: listeners show support directly on Feed cards using an amount built through community activity and given to the referenced source. This replaces the prior rule that `Support` is only a derived backing state rather than a direct action.
- Type: settled product-rule correction; implementation contract remains open
- Likely owner: `docs/specs/core/signals-and-universal-actions.md`; `docs/specs/engagement/activity-points-and-analytics.md`; relevant economy owner spec if support becomes value transfer.

- Feed-card listener identities should display the listener username and support score in the left identity rail. The score's formula, unit, ledger, earning model, and whether it differs from available support balance remain open.
- Type: settled visible UI requirement; score definition open
- Likely owner: Home/Plot product design handoff; future activity/support owner spec.

- Listener Feed cards must use the same source-rail footprint as artist, promoter, Registrar, RADIYO, and system cards. Normalize the listener card footprint to the shared card grammar; do not make source cards larger to match listener cards.
- Type: settled design clarification
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`; Home/Plot product design handoff.

- Blast cards should not render the whole player as the card body. The distinctive Blast treatment should be a compact digital screen/faceplate with two text lines: a scrolling song title and the Uprise/community line underneath. Because the visual form makes the action clear, the card does not need literal "`<user> is blasting`" body text.
- Type: settled design clarification
- Likely owner: Home/Plot product design handoff; `docs/specs/communities/plot-and-scene-plot.md`.

- Tier display for Blast/player contexts should use one tower icon with three signal bands on each side at the top. The first tier shows the tower and the first signal bands lit, representing a weaker/shorter-range signal; additional lit bands represent wider tier reach.
- Type: settled visual language clarification; exact tier-data binding stays owner-spec controlled
- Likely owner: Home/Plot product design handoff; `docs/specs/broadcast/radiyo-and-fair-play.md` when tier visual binding becomes runtime behavior.

## Feature Sets

- Normalized source-rail Feed grammar
- Raw basis: "all sources stay on the left (same size)" and "each card source should have its own flare."
- Included behavior:
  - Every Feed row reserves a consistent left-side identity footprint.
  - Listener identities are belly-up avatars capable of displaying wearable merchandise.
  - Listener identity rails include username and support score once the score metric is defined.
  - Listener cards use the same overall footprint as other source-backed and system Feed cards.
  - Artist, promoter, Registrar, RADIYO, milestone, and other system sources use their own source-appropriate left-rail treatment while preserving the shared footprint.
  - The right-side card body contains the source's message plus a referenced-signal link when the card carries one.
  - Blast is a Feed card and can present a compact digital faceplate/screen with the scrolling song name, Uprise/community line, and tier tower indicator.
- Excluded / not activated:
  - Generic message bubbles, comments, DMs, or a social post composer.
  - A new general source label inside each card body.
  - A full player UI inside each Blast card.
  - Literal "`<user> is blasting`" text when the faceplate treatment already communicates Blast.
  - A new Feed destination or a separate Blast surface.
- Status: design direction; content/action contracts remain governed by existing owner specs.

- Player faceplate customization
- Raw basis: "we should offer customizable player stuff"
- Included behavior:
  - Future player customization may let a listener's Blast visually use their selected player faceplate.
- Excluded / not activated:
  - Skin marketplace, creator-upload pipeline, paid cosmetics, moderation rules, or any runtime persistence behavior.
- Status: deferred / open.

- Activity-earned card support
- Raw basis: "listeners should probably be able to 'support' stuff" and "this can be measured in activity and given in support"
- Included behavior:
  - A future Feed card may expose a support expression that uses an amount a listener has accumulated through community activity.
  - The founder intent is that the expressed amount reaches the referenced source.
- Excluded / not activated:
  - A direct `SUPPORT` button, a signal API endpoint, a payment transfer, balance ledger, conversion rate, wallet, paid reaction, ranking effect, Fair Play effect, or source-level action contract.
- Status: settled product direction; requires a dedicated implementation contract before runtime activation.

## Working Interpretation

- The normalized left rail is the Feed's identity system. It should make card origins scannable without repeating titles in every body, while allowing each source family to remain visually recognizable.
- Belly-up listener avatars should be proportioned to show clothing/accessories without becoming full-card illustrations. Their silhouette should use a shared bounding box rather than a circular crop, with username and support score placed as identity metadata in the same rail.
- Listener Feed cards should feel peer-level with artist/source/system cards by sharing the same card footprint. The way to make this work is to keep listener cards smaller and normalized, not inflate every source card.
- Blast's digital faceplate/screen is a visual differentiation rule, not a new Blast action or destination. The existing rule that the blasted signal links to its source remains intact.
- The Blast faceplate should show track/Uprise/tier state directly: scrolling song title, Uprise line underneath, and one tower with lit signal bands for tier.
- "Support" is a direct activity-earned allocation/action on an eligible Feed card. The unconfirmed implementation details are the unit, earning model, allocation ledger, source/card eligibility, availability limits, reversal behavior, and whether any payout/value-transfer mechanism exists.

## Promotion Targets

- Owner spec candidates: `docs/specs/communities/plot-and-scene-plot.md`; `docs/specs/core/signals-and-universal-actions.md`; `docs/specs/engagement/activity-points-and-analytics.md`.
- Lane brief: future Home/Plot Product Design handoff should include the normalized source rail, belly-up avatar boundary, no-bubble rule, and source-specific visual flare.
- Runtime/tests if activated: future Feed-card renderer, avatar/wearable rendering contract, player-skin persistence, and a dedicated support-value/action contract.
- Implementation decision required before runtime: define the support unit, how it is earned, the recipient object, whether it transfers value, availability/limits, idempotence/reversal behavior, and explicit non-effects on Fair Play/ranking/governance.

## Do Not Drift

- Do not crop listener avatars into circles when the design needs shirts, hats, patches, or other wearable expression to be visible.
- Do not place the same source label in both the left source rail and the card body.
- Do not use ordinary message bubbles for Home/Plot Feed cards.
- Do not turn each source flare into a distinct card layout; retain one normalized source-rail grammar.
- Do not make listener cards a smaller or larger class than other source cards; normalize all Feed rows to the shared footprint.
- Do not omit listener username and support score from the feed-card identity rail once the support score metric is defined.
- Do not render a full player in the Blast card; use only the compact digital screen/faceplate treatment.
- Do not add literal "`<user> is blasting`" copy when the Blast screen treatment already communicates the action.
- Do not draw multiple towers for the three tiers; use one tower with three signal bands per side and vary lit bands.
- Do not treat player-faceplate styling as permission to move Blast from personal player/user-space into the RADIYO wheel or Artist Profile.
- Do not reuse the former direct signal `SUPPORT` counter/API behavior as the new source-bound Feed-card Support contract.
- Do not let activity-earned support create paid ranking, Fair Play progression, civic authority, or a generic social-reaction mechanic without a dedicated owner-spec decision.

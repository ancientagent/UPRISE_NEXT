# Source Dashboard Ad Action Wheel Links Founder Session

Status: raw founder-session capture
Date: 2026-07-06
Source: current chat/session
Related lane(s): ARTIST_SOURCE, UX_UI, ACTIONS_SIGNALS, BUSINESS_MONETIZATION, MEDIA_RELEASE
Owner spec candidates: `docs/specs/users/artist-profile-and-source-dashboard.md`; `docs/specs/media/release-deck-and-eligibility.md`; `docs/specs/core/signals-and-universal-actions.md`; `docs/specs/economy/revenue-and-pricing.md`; `docs/specs/economy/print-shop-and-promotions.md`; `docs/specs/users/identity-roles-capabilities.md`

## Raw Founder Notes

> the last things, i think are next to the band drop down on the top,   to the left is should have Manager next to the user's account name/login  when they use the drop down and select a different source their title will change based on their position in the source  (member, promotor etc)    then, I think we can make the record ad space a little more recognisable as far as its  function.feature properties. maybe a selector for the type of ad?  like (in the future once the local business communities are added to the plot, this can become a sponsorship opportunity.  they should be able to link the business account if this is the case, so there should i guess be a category with options as release date, general, event, sponsor    sponsor would link the business, release date would link the calendar date,  event would link the event. general would be empty i guess.  this should make the linked source/signal accessable to visit through the action wheel (this is a new feature please add this to where applicable in the actionwheel / ads/ release deck  references in the repo and stor the raw data in the founders clarifications/decisions / features folder

> The raw-founder text folder is:
>
>   docs/founder-sessions/
>
> Current structure:
>
>   - Raw notes/index: docs/founder-sessions/README.md
>   - Session files: docs/founder-sessions/YYYY-MM-DD_<topic>.md
>   - Each note is supposed to have:
>       - Raw Founder Notes
>       - Clarifications
>       - Feature Sets
>       - Working Interpretation
>       - Promotion Targets
>       - Do Not Drift
>
> Important distinction:
>
>   - Raw founder wording goes in docs/founder-sessions/.
>   - Durable product truth gets promoted into the relevant owner spec under docs/specs/
>     **.
>
>   - Open unresolved decisions can still live in docs/specs/DECISIONS_REQUIRED.md.
>
> Index status:
>
>   - Yes, docs/founder-sessions/README.md exists as the index.
>   - It is currently incomplete/stale: it lists only 3 "Current Sessions," but the
>     folder has more files, including July 2 and July 3 captures.
>
> Agent instructions status:
>
>   - AGENTS.md does not directly name docs/founder-sessions/.
>   - It does indirectly require this behavior through founder clarification/product
>     truth rules and points agents to docs strategy/framework.
>
>   - The stronger references are in:
>       - docs/AGENT_STRATEGY_AND_HANDOFF.md
>       - docs/specs/system/documentation-framework.md
>       - docs/solutions/codex-skills/uprise-founder-session-capture/SKILL.md
>       - docs/solutions/codex-skills/uprise-founder-clarification-capture/SKILL.md
>
> My recommendation:
>
>   - Update docs/founder-sessions/README.md so the index includes all current files.
>   - Add a direct Task-Specific Add-On line in AGENTS.md for founder clarification/
>     session capture, so agents don't have to discover it indirectly.

## Clarifications

- The source dashboard top command line should show the signed-in user/account context with that user's position for the currently selected source, such as `Manager`, `Member`, or `Promoter`.
- Type: settled design direction, runtime contract pending
- Likely owner: `docs/specs/users/artist-profile-and-source-dashboard.md`; `docs/specs/users/identity-roles-capabilities.md`; `apps/web/src/components/source/SourceAccountSwitcher.tsx`

- When the operator switches sources in the source selector, the displayed role/title should update based on that user's position in the newly selected source.
- Type: settled design direction, runtime contract pending
- Likely owner: `docs/specs/users/artist-profile-and-source-dashboard.md`; `docs/specs/users/identity-roles-capabilities.md`

- The fourth Release Deck paid ad attachment should be more recognizable as an ad feature by exposing an ad type/category selector in design.
- Type: deferred feature set / design-only until paid ad runtime is activated
- Likely owner: `docs/specs/media/release-deck-and-eligibility.md`; `docs/specs/economy/revenue-and-pricing.md`

- Proposed ad categories are `release date`, `general`, `event`, and `sponsor`.
- Type: deferred feature set / open contract
- Likely owner: `docs/specs/media/release-deck-and-eligibility.md`; `docs/specs/economy/revenue-and-pricing.md`; `docs/specs/economy/print-shop-and-promotions.md`

- `sponsor` ads should be able to link a business account after local business/community accounts are active.
- Type: deferred feature set / open contract
- Likely owner: `docs/specs/users/identity-roles-capabilities.md`; `docs/specs/economy/print-shop-and-promotions.md`; `docs/specs/economy/revenue-and-pricing.md`

- `release date` ads should link to the relevant calendar date; `event` ads should link to the relevant event; `general` ads may have no linked target.
- Type: deferred feature set / open contract
- Likely owner: `docs/specs/media/release-deck-and-eligibility.md`; `docs/specs/events/events-and-flyers.md`

- The linked source/signal target should be accessible to visit through an action-wheel-style affordance when that future feature is activated.
- Type: deferred feature set / open contract
- Likely owner: `docs/specs/core/signals-and-universal-actions.md`; `docs/specs/media/release-deck-and-eligibility.md`

## Feature Sets

- Release Deck paid ad category/link target model
- Raw basis: "maybe a selector for the type of ad" and "release date, general, event, sponsor"
- Included behavior:
  - Paid ad attachment can carry an ad category.
  - `release date` links the ad to a calendar date.
  - `event` links the ad to an event.
  - `sponsor` links the ad to a business account when business accounts are active.
  - `general` has no required linked target.
  - Linked targets should be visitable through a future action-wheel-style action.
- Excluded / not activated:
  - No current paid ad purchase, billing, entitlement, recording, review, business account runtime, or action-wheel runtime is activated by this note.
  - No paid ad affects Fair Play, ranking, rotation, tier progression, voting, or governance.
- Status: deferred / design-only until owner specs activate runtime.

- Source account role display in dashboard top command line
- Raw basis: "Manager next to the user's account name/login" and "their title will change based on their position in the source"
- Included behavior:
  - Source dashboard should show the signed-in account/user with the role for the currently selected source.
  - Switching the selected source updates the role label.
- Excluded / not activated:
  - This does not create new roles or permissions by itself.
  - This does not change Registrar, Home Scene, or source ownership authority.
- Status: settled design direction, implementation needs runtime field verification.

## Working Interpretation

- The next Source Dashboard mockup should show account + role context near the source selector, for example `baris@example.com · Manager`, and the role label should change when a different managed source is selected.
- The fourth paid ad row should read as a future ad attachment feature rather than a vague locked record slot.
- Ad type and link-target fields are future metadata, not active MVP runtime.
- `Action wheel` wording must not be interpreted as permission to add the prohibited engagement wheel to public Artist Profile. This future visit affordance needs its own action/signal contract.

## Promotion Targets

- Owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
- Owner spec: `docs/specs/users/identity-roles-capabilities.md`
- Owner spec: `docs/specs/media/release-deck-and-eligibility.md`
- Owner spec: `docs/specs/economy/revenue-and-pricing.md`
- Owner spec: `docs/specs/economy/print-shop-and-promotions.md`
- Owner spec: `docs/specs/core/signals-and-universal-actions.md`
- Open decisions: `docs/specs/DECISIONS_REQUIRED.md`
- Lane brief: `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- Lane brief: `docs/agent-briefs/BUSINESS_MONETIZATION.md`
- Lane brief: `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- Design package: `docs/screen-packages/artist-profile-source-dashboard/`

## Do Not Drift

- Do not implement paid ad purchase, billing, entitlement, recording, storage, review, business account linking, sponsor sales, or action-wheel runtime from this note alone.
- Do not make the paid ad attachment a fourth music slot or standalone rotation entry.
- Do not let paid ad categories affect Fair Play, ranking, rotation, voting, propagation, tier movement, or governance.
- Do not add a public Artist Profile engagement wheel.
- Do not treat `sponsor` as active until business accounts/local business communities are activated by owner specs.
- Do not create anonymous sponsor/business linking; sponsor links must be business-account attached when activated.

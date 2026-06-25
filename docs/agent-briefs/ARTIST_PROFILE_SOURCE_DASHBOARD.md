# Artist Profile And Source Management Agent Brief

Status: active
Last Updated: 2026-06-25

## Use When

Use this brief when the task is about:

- public Artist Profile
- artist/source pages
- source dashboard / source-management surface
- Release Deck
- Print Shop as a source-facing tool
- managed source entity selection
- source-owned tracks or events
- source management design handoff

## Do Not Use For

- listener user profile / collection workspace
- generic Home / Plot layout unless source surfaces are visible
- action grammar without source/profile implications
- deployment/infrastructure work

## Loading Rule

Start with the normal repo entry rules, then this brief.

Do not read every linked document by default. For public artist-page work, load the artist profile lock and the artist route. For source-dashboard work, load the source dashboard contract and the touched route/tool.

## Section Pointers

Runtime files:

- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/app/print-shop/page.tsx`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
- `apps/api/src/artist-bands/`
- `apps/api/src/events/print-shop.controller.ts`
- `apps/api/src/registrar/`

Specs / locks:

- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`

Tests / verification files:

- `apps/web/__tests__/plot-ux-regression-lock.test.ts` when source/profile actions affect Plot handoff or inserts
- package-specific API/web tests for touched routes

## Current Truth

- Artist Profile is a public source page and direct-listen surface outside `RADIYO`.
- Artist Profile is not the listener user profile / collection workspace.
- Artist Profile has source-level actions such as `Follow`, share, and official outbound links.
- Artist Profile song rows can support `Collect` and gated `Recommend`.
- Artist Profile current MVP direct-listen area is capped to `3` playable song rows.
- If a feed/discovery handoff selects a track outside the first three, that selected track may be placed first while preserving the `3` row cap.
- Artist Profile does not use the engagement wheel.
- Artist Profile does not expose `Blast`.
- Full catalogue/library/history expansion is retained future context, not authorization to render the full artist library in the current MVP listener profile page.
- Source Dashboard is the current source-side operating shell for managing source entities.
- Source Dashboard is not the listener user profile / collection workspace.
- Source Dashboard is not part of the listener Home/Plot community space.
- Product direction is a separate source/admin web surface/domain that the listener app reads from.
- Current `/source-dashboard` runtime is the monorepo implementation stand-in for that separate management surface.
- Do not throw away current `/source-dashboard` work because it is not physically on a separate domain yet.
- Future direction: once Registrar materializes/approves a source entity, the operator receives a source-dashboard URL/domain for that entity.
- Authorized users can operate managed source entities linked to their base user identity.
- Current managed-source runtime is artist/band entities.
- Active source context is user-scoped: the persisted source ID must belong to the current signed-in user, and stale or legacy source context must be cleared before source-side tools operate.
- Current Source Dashboard live tool cards are `Release Deck`, `Source Profile`, `Print Shop`, and `Registrar`.
- Source posts/messages are product-valid later but not current MVP runtime; `docs/solutions/SOURCE_POSTS_MESSAGES_DECISION_PACKET_R1.md` keeps follower updates deferred until a dedicated implementation spec activates them.
- Release Deck has `3` music slots plus a `4th` paid `10` second ad-attachment slot.
- No single source may occupy more than `20` minutes of any one Uprise rotation at a time.
- The ad slot is not an extra song slot and not its own rotation entry.
- Release Deck current MVP creates source-owned tracks from explicit hosted `http(s)` audio URLs; real upload, storage, transcoding, waveform extraction, and paid ad-slot mechanics remain deferred.
- Release Deck active-slot and active-duration eligibility is owned by `docs/specs/media/release-deck-and-eligibility.md`; replacement UX and any per-song length cap remain follow-up decisions there.
- Source-origin authority is owned by `docs/specs/system/registrar.md#source-origin-contract`; source tools must not treat temporary proxy routing as the source's natural origin.
- When artist/source concentration justifies splitting a new active city-tier Home Scene from a major-node community, existing songs finish their current rotation lifecycle in the prior active scene; new uploads attach according to the source's active Home Scene after Registrar/source activation.
- A song cannot be actively listed in more than one Uprise rotation at the same time.
- After a proxy-scene lifecycle ends, the source may reuse the same song in the new natural Home Scene unless that song has already advanced to the statewide tier.
- Media/storage activation is governed by `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md`: current MVP remains URL-only, workers/storage stay undeployed, and Cloudflare R2 is only the recommended first staging default if/when media upload/read is explicitly activated.
- Print Shop is source-facing infrastructure for creator/event issuance flows.
- Print Shop event creation requires explicit venue location input; the runtime must not default coordinates or address examples to a particular launch city.
- Print Shop Artist/Band event creation requires an explicitly selected active managed source context; a generic linked membership is not enough to create an unattached source event.
- Print Shop promoter-capability event creation may create a promoter-lane event without `artistBandId`, but it must still attach to the user's resolved active city-tier Home Scene community.
- Registrar remains separate civic/formalization infrastructure but must stay reachable from source-side operating context.

## Current Runtime Pointers

- `/artist-bands/[id]` is the public artist/source profile route.
- `/source-dashboard` is the current source-side operating shell / stand-in for the separate source-management surface.
- `/source-dashboard/release-deck` is the current Release Deck route.
- `/print-shop` is still a direct route but should be understood as part of source-dashboard tooling.
- `/registrar` is still a direct route but should preserve source-side continuity where relevant.

## Design / Implementation Boundaries

- Do not put Artist Profile actions on the listener user profile.
- Do not put listener collection workspace behavior on Artist Profile.
- Do not put source-management tools inside the listener user profile / collection workspace.
- Do not make source management feel like ordinary Home/Plot community participation.
- Do not interpret “separate source-management website/domain” as permission to discard the existing Source Dashboard, Release Deck, or Print Shop work.
- Do not add source-level `Collect`, source-level `Blast`, or source-level `Support`.
- Do not widen the current listener-facing Artist Profile into a full catalogue/library surface unless the Artist Profile lock is explicitly updated.
- Do not add fake source-dashboard cards such as analytics, billing, growth, or upgrade modules unless explicitly activated.
- Do not add source posts/messages, follower-update composers, inboxes, or `Message Followers` placeholders unless `docs/solutions/SOURCE_POSTS_MESSAGES_DECISION_PACKET_R1.md` is superseded by an approved implementation spec.
- Do not model Print Shop as a listener-facing event-authoring utility.
- Do not add city-specific Print Shop defaults, placeholder venues, or hidden coordinate fallbacks unless they are explicitly fixture-only/test-only.
- Do not treat business runtime, causes, source analytics packages, billing, or promotion package management as active MVP source-dashboard scope unless explicitly reactivated.
- Do not let source-dashboard work bypass Home Scene, registrar, or ownership validation rules.
- Do not let source-dashboard work rewrite source origin because a source is operating through a proxy scene.

## Verification

Use the narrowest relevant checks:

- route/component tests for the touched web surface, when present
- API tests for artist/source/event/registrar ownership changes, when present
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`

Use broader `pnpm run verify` before PR/closeout when feasible.

## Update Rule

Patch this brief whenever Artist Profile, Source Dashboard/source-management, Release Deck, or Print Shop source-facing truth changes.

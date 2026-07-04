# Instruction Packet: Artist Profile / Source Dashboard

Status: active seed packet
Snapshot branch/head: `main` @ `b81c5f3` when created
Lane: `uprise-registrar-source` plus `uprise-design-ui` for visual hierarchy
Owner contract: `docs/specs/users/artist-profile-and-source-dashboard.md`

## Goal

Build the Artist Profile / Source Dashboard post-registration screen package without blending listener profile, public Artist Profile, Source Dashboard, Registrar, Release Deck, Print Shop, or deferred source-message/business/media systems.

## Must Read

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/UI_CURRENT.md` for visible screen hierarchy/design work
- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/specs/system/registrar.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/social/message-boards-groups-blast.md`

## Runtime / Tests To Inspect

- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/app/registrar/page.tsx`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
- `apps/web/src/store/source-account.ts`
- `apps/web/src/lib/source/release-deck-validation.ts`
- `apps/api/src/artist-bands/artist-bands.controller.ts`
- `apps/api/src/artist-bands/artist-bands.service.ts`
- `apps/api/src/registrar/registrar.controller.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/src/tracks/tracks.controller.ts`
- `apps/api/src/tracks/tracks.service.ts`
- `apps/web/__tests__/community-artist-page-lock.test.ts`
- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
- `apps/web/__tests__/source-account-switcher-lock.test.ts`
- `apps/web/__tests__/release-deck-shell-lock.test.ts`
- `apps/web/__tests__/release-deck-validation.test.ts`
- `apps/api/test/registrar.artist.service.test.ts`
- `apps/api/test/artist-bands.service.test.ts`
- `apps/api/test/tracks.service.test.ts`

## Agent Outputs

Dev Spec Agent writes `spec/dev-spec.md` with runtime trace, file ownership, contracts, stale-path checks, validation seed, and implementation plan constraints.

Design Spec Agent writes `design-spec/ux-plan.md` with screen hierarchy, states, accessibility expectations, responsive behavior, visual direction, and art needs. It must not invent actions, data contracts, auth rules, navigation, or product doctrine.

Reviewer writes `review/spec-package-review.md` and classifies findings as `dev`, `design`, `cross-spec`, `product decision`, `stale`, or `environment`. Implementation cannot start until this review passes or findings are returned to the responsible spec agent.

Art / Creative Studio receives `art-handoff/creative-brief.md` only after Design Spec is stable.

## Out Of Scope

- Listener-to-artist DM/message controls.
- Artist Profile `Blast`, engagement wheel, source-level `Collect`, source-level `Blast`, or UPRISE source-level `Support` action. Official outbound donation links remain allowed when supplied by source profile data.
- Source posts/messages, follower-update composer, analytics, billing, growth, upgrade, premium tools, or business runtime.
- Real upload/storage/transcoding/waveform pipeline beyond URL-only MVP ingest.
- Fourth music slot in Release Deck.
- Source tools embedded inside listener profile body.
- Public viewer access to source-owner/member tools.
- City-specific, source-specific, or fixture-only behavior unless explicitly marked test-only.

## Validation Seed

- `pnpm --filter web test -- community-artist-page-lock.test.ts source-dashboard-shell-lock.test.ts source-account-switcher-lock.test.ts release-deck-shell-lock.test.ts release-deck-validation.test.ts`
- `pnpm --filter api test -- registrar.artist.service.test.ts artist-bands.service.test.ts tracks.service.test.ts --runInBand`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`

## Stop Conditions

- Owner spec does not authorize the proposed behavior.
- Source/listener/admin boundary is ambiguous.
- Design requires a product action, API field, auth rule, data model, or navigation not in the owner spec.
- Branch/HEAD, dirty worktree, or branch/workspace registry state cannot be verified.
- Provider, DB, schema, migration, security, canon, or product-decision work appears necessary.

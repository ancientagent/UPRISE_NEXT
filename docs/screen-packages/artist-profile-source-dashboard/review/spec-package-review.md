# Artist Profile / Source Dashboard Spec Package Review

Decision: pass

Branch / HEAD reviewed: `docs/artist-profile-source-dashboard-specs` @ `8e2c0c8`

## Executive Summary

The Dev Spec and Design Spec are safe to advance to the implementation-plan gate. They preserve the documented authority order, keep product truth in owner specs, and treat the screen package as an execution workspace rather than a contract owner. The two specs agree on the central boundaries: public Artist Profile is a listener-facing direct-listen surface; Source Dashboard is source-owner/member tooling; Registrar remains listener/base-identity civic infrastructure; Release Deck is URL-only source-admin release tooling; and listener profile remains separate from source management.

No blocking product-drift or implementation-ambiguity finding was found. The package can move to implementation planning, provided the implementation plan uses the corrected test paths and keeps behavior-level coverage requirements in scope.

## Findings

### dev

- PASS: `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md` correctly identifies `docs/specs/users/artist-profile-and-source-dashboard.md` as the cross-surface lifecycle owner and routes supporting contracts to Registrar, identity/roles, Release Deck, action grammar, social/messaging, and Plot specs.
- PASS: The Dev Spec preserves Artist Profile vs Source Dashboard vs Registrar vs listener profile boundaries. Public Artist Profile actions are limited to `Follow`, share/copy, official outbound links, local row playback, row-level `Collect`, and gated row-level `Recommend`; Source Dashboard remains owner/member tooling; Registrar source context remains informational only.
- PASS: File ownership and stop conditions are sufficiently explicit. Implementation is instructed to stop for unauthorized product behavior, ambiguous source/listener/admin boundaries, new product decisions, provider/DB/schema/security/canon work, stale test-path dependence, listener-profile source-tool embedding, or public viewer source-admin tools.
- PASS: Validation seed is implementation-ready and corrects the stale Registrar test path by using `apps/api/test/registrar.service.test.ts` and `apps/api/test/registrar.controller.test.ts` instead of the missing `apps/api/test/registrar.artist.service.test.ts`.

### design

- PASS: `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md` stays in the design lane. It defines hierarchy, states, accessibility, responsive behavior, visual direction, and future art needs while explicitly refusing API fields, auth rules, source ownership logic, Registrar rules, Release Deck limits, action grammar, route creation, provider/storage/media infrastructure, and unsettled product decisions.
- PASS: The Design Spec preserves public/source/admin separation through visual hierarchy requirements: public Artist Profile actions are separate from owner/member tool links, Source Dashboard requires active source context, and listener-profile source access remains a bridge only.
- PASS: The Design Spec avoids platform-trope drift and unapproved placeholders. It prohibits DMs/messages/contact buttons, `Blast`, engagement wheels, `Support`, analytics/billing/growth/upgrade cards, source posts/messages, fourth music slots, upload/transcode/waveform implications, and city/source/fixture-specific behavior.

### cross-spec

- PASS: Dev and Design agree on Release Deck: three active music slots, six-minute per-song cap, fifteen-minute per-source active cap, URL-only MVP ingest, and no active fourth music slot.
- PASS: Dev and Design agree on source context: `activeSourceId` / `activeSourceUserId` must be validated against the current signed-in user and managed sources before source tools operate.
- PASS: Dev and Design agree on public Artist Profile: it is public/listener-facing, supports local direct-listen rows, official outbound links including source-provided donation links, and does not become the Source Dashboard.
- PASS: Dev and Design agree on forbidden actions: no listener-to-artist DMs, no Artist Profile `Blast`, no engagement wheel, no source-level `Collect`, no source-level `Blast`, and no in-app UPRISE source-level `Support`.
- PASS: Dev and Design agree that Source Dashboard live cards remain `Release Deck`, `Source Profile`, `Print Shop`, and `Registrar`, with no fake analytics, billing, growth, upgrade, source-post, message, or follower-update cards.

### product decision

- NON-BLOCKING: Both specs correctly classify source-owner credential validation links as an unresolved future product/runtime parity question. Current implementation planning must not add that behavior unless the owner spec is updated first.
- NON-BLOCKING: Future source/admin URL/domain format, source profile editing surface, source posts/messages, media upload/storage/transcoding, and dual-role visual treatment remain future decisions or design-review follow-ups, not implementation authorization.

### stale

- RESOLVED DURING PACKAGE CLEANUP: The package packet/source map now use `apps/api/test/registrar.service.test.ts` and `apps/api/test/registrar.controller.test.ts` instead of the missing historical `apps/api/test/registrar.artist.service.test.ts` path. Implementation planning should keep using the Dev Spec validation seed.
- NON-BLOCKING: Legacy `artistBandId: null` Artist Profile fallback rows and legacy persisted `ADD` action naming are correctly classified as stale/compatibility paths to avoid, not new behavior sources.

### environment

- NON-BLOCKING: No open GitHub PR was found for head branch `docs/artist-profile-source-dashboard-specs` at review time. This does not block the spec-package gate, but PR metadata will still be required before merge.

## Required Fixes Before Implementation

None. No blocking fix is required before moving to implementation-plan gate.

## Non-Blocking Follow-Ups

- The implementation plan should include behavior-level rendered/integration tests for changed public/source/owner states, because current web locks are mostly file-content/route-contract guards.
- If implementation touches Print Shop runtime beyond source-facing bridge links, expand evidence to `apps/web/src/app/print-shop/page.tsx`, `apps/api/src/events/print-shop.controller.ts`, and `docs/specs/economy/print-shop-and-promotions.md` before edits.

## Approval Statement

Approved for the implementation-plan gate. Implementation may not start from this review alone; the next gate must produce an implementation plan from the passed Dev Spec and Design Spec, use the corrected validation seed, and preserve the stop conditions above.

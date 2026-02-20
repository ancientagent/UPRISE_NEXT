# Master Context Handoff + Chat Archive (2026-02-20)

**Author:** Codex (execution agent)  
**Purpose:** Canon-safe continuity record of operational directives and product decisions discussed in-thread but not consistently centralized.

## 1) Operational Directives to Keep Enforced

- Use `pnpm` only in `UPRISE_NEXT`; never mix with `yarn` in this repo.
- Keep strict web-tier boundary (`apps/web` uses API/shared packages only; no DB/secrets/server imports).
- Prevent feature drift:
  - implement only approved spec/canon behavior,
  - no placeholder CTAs or speculative actions unless explicitly approved.
- Keep anti-platform-trope discipline: no Spotify/Instagram/TikTok default behavior imports.
- For large/parallelizable tasks, use parallel lanes/agents, then consolidate and review before commit.
- For small/tightly-coupled/order-dependent tasks, execute directly in one lane.
- Maintain docs hygiene on meaningful changes:
  - update touched specs,
  - update `docs/CHANGELOG.md`,
  - add handoff note for multi-step work.

## 2) Product Decisions Locked in Chat

### Identity and capabilities
- Base user identity is unified (listener/supporter/fan baseline).
- Artist/Band is a Registrar-linked entity model (not just an additive user capability flag).
- Promoter is additive capability scope on top of base user identity.
- Promoters operate named **Production** identities for public promotional work.

### Discovery and scene model
- No `Join community` semantics were approved.
- Users can visit/tune into non-home scenes (visitor privilege), and explicitly set Home Scene where allowed by rules.
- Discovery scope exists across city/state/national.

### Social and messaging
- Social is a public/community message-board surface.
- Sect broadcast command (`/sectname`) is a required communication pathway.
- DMs are limited to mutual-follow users.
- No DMs to artists; artist messaging to followers is public one-way.

### Collections/profile
- One user collection system with typed shelves:
  - posters, fliers, merch buttons/patches/shirts, singles, uprises.
- Collection display is profile-opt-in for public visibility.

### Events / print shop / promotions
- Event creation flow should originate in Print Shop for workflow uniformity.
- Current monetizable artifact focus: event fliers (touring support).
- Businesses can submit promotions via a web link without account requirement (current phase).
- Current phase direction: auto-publish business submissions, then moderate post-publish.
- Shirt creation is deferred until avatar wearable framing exists; may appear as coming-soon catalog item only.

### Fair Play constraints (current direction)
- Two-pool model direction retained in canon/spec work.
- Upvotes control propagation/tier advancement only.
- Recurrence/frequency control remains separate from propagation.

## 3) What Was Actually Implemented Prior to This Handoff

- Active-scene defaults for Plot/broadcast context resolution.
- Scene discovery + tune + set-home APIs and web surface foundation.
- Plot feed/events/promotions/statistics/scene-map API wiring.
- Fair Play foundation endpoints/models/jobs/tests (with current policy guardrails).
- User profile collection shelves + visibility toggle and profile route wiring.

See recent merged PRs and `docs/CHANGELOG.md` for code-level and endpoint-level evidence.

## 4) Known Risk Pattern to Watch

- Agents may hallucinate unapproved CTA/workflow additions (example previously caught: community `Join` button).
- Mandatory safeguard:
  - compare proposed UI actions against canon/spec before implementation,
  - reject any action not explicitly approved.

## 5) Archive Intent

This document serves as a formal archive of the current chat’s execution-critical decisions and operating constraints so future sessions can recover context without relying on volatile chat memory.

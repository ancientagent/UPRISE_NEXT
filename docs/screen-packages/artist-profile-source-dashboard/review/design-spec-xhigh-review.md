# Design Spec XHigh Review

Decision: pass

## Branch / PR State
- Repo: `/home/baris/UPRISE_NEXT`
- Branch / HEAD: `docs/artist-profile-source-dashboard-specs` @ `84d1b25`
- PR: #227 `docs: add artist profile screen package specs`
- URL: https://github.com/ancientagent/UPRISE_NEXT/pull/227
- State: open, not draft, `MERGEABLE`, merge state `CLEAN`, base `main`
- Dirty state before review: clean
- CI/status: reported green in `gh pr view`; CI Pipeline, Canon Guard, Secrets Scan, and Vercel contexts were successful
- Review scope: Design Spec / UX Plan only; no Design Spec edits, runtime edits, provider/db/schema/art edits, or Dev Spec review performed

## Findings
- BLOCKER: none
- HIGH: none
- MEDIUM: none
- LOW: none against the Design Spec. Implementation follow-up noted below for direct-listen copy parity.

## Confirmed Correct
- The UX Plan stays in the design lane. It states that durable behavior remains in owner specs and that runtime, API, auth, data, validation, and action grammar belong to Dev Spec/runtime lanes in `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:11` and `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:13`.
- The UX Plan preserves the three-surface lifecycle: Registrar for listener/base-user materialization, Source Dashboard for owner/member source operations, and Artist Profile for public listener direct-listen viewing in `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:40`.
- Artist Profile vs listener profile vs Source Dashboard boundaries are preserved. Public Artist Profile identity/actions, owner/member tool separation, and Source Dashboard tool ownership match the owner spec in `docs/specs/users/artist-profile-and-source-dashboard.md:64`, `docs/specs/users/artist-profile-and-source-dashboard.md:66`, `docs/specs/users/artist-profile-and-source-dashboard.md:73`, and `docs/specs/users/artist-profile-and-source-dashboard.md:75`.
- Public Artist Profile action grammar is correct: Follow/share/official outbound links, row-level Play/Pause, Collect, and gated Recommend are allowed, while listener-to-artist DMs, Blast, engagement wheel, source-level Collect/Blast/Support, and source-owner controls for public viewers are prohibited in `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:244`, `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:250`, `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:335`, and `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:350`.
- Official outbound donation links are handled as source-provided official links, not as an in-app UPRISE Support action, matching `docs/specs/users/artist-profile-and-source-dashboard.md:77` and `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:302`.
- Release Deck limits are preserved: three active music slots, six-minute per-song cap, fifteen-minute total source cap, hosted URL-only MVP ingest, reject-only/runtime enforcement left to Dev Spec/API, and no fourth music slot in `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:141`, `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:146`, `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:239`, and `docs/specs/media/release-deck-and-eligibility.md:35`.
- Source Dashboard scope is constrained to current live tool cards: Release Deck, Source Profile, Print Shop, and Registrar, with analytics, billing, growth, upgrade, posts/messages, and fake placeholders explicitly excluded in `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:125` and `docs/specs/users/artist-profile-and-source-dashboard.md:88`.
- Registrar stays Home Scene-bound civic infrastructure and does not become source-owned admin tooling. The plan treats source context as informational/bridge context in `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:148`, matching `docs/specs/system/registrar.md:21` and `docs/specs/system/registrar.md:403`.
- UX hierarchy, responsive/mobile, accessibility, visual direction, and future art needs are sufficient for the next implementation/art pass. The plan covers state model, validation/error/empty/ready states, mobile collapse order, accessible labels/gated-action copy, anti-platform-trope direction, and future Creative Studio asset slots in `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:162`, `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:285`, `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:295`, `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:306`, and `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md:319`.

## Validation Reviewed / Run
- Ran required initial state commands: `pwd`, `git branch --show-current`, `git rev-parse --short HEAD`, `git status --short`, and `gh pr view 227 --json number,title,state,isDraft,headRefName,baseRefName,mergeable,mergeStateStatus,statusCheckRollup,url`.
- Read required authority and package files listed in the prompt, plus `docs/AGENT_STRATEGY_AND_HANDOFF.md` because `AGENTS.md` requires it.
- Reviewed branch diff scope with `git diff --stat origin/main...HEAD` and `git diff --name-only origin/main...HEAD`.
- Performed targeted read-only runtime checks with `rg` against `apps/web/src/app/artist-bands/[id]/page.tsx`, `apps/web/src/app/source-dashboard/page.tsx`, `apps/web/src/app/source-dashboard/release-deck/page.tsx`, `apps/web/src/app/registrar/page.tsx`, `apps/web/src/components/source/SourceAccountSwitcher.tsx`, `apps/web/src/store/source-account.ts`, and `apps/web/src/lib/source/release-deck-validation.ts`.
- `git diff --check`: passed.

## Required Fixes Before Merge
- None for the Design Spec.

## Follow-Ups After Merge
- During implementation, verify the Artist Profile direct-listen copy remains aligned with owner-spec semantics. Current runtime copy in `apps/web/src/app/artist-bands/[id]/page.tsx:504` says a song can pause `RADIYO`; implementation should avoid turning local direct-listen rows into a shared `RADIYO` mutation claim unless a future implementation explicitly specifies and tests that bridge.
- Implementation and art passes should continue treating this UX Plan as design guidance only, with owner specs and runtime tests owning auth, data, validation, and action grammar.

## Recommendation
- Pass the Design Spec as safe to merge as a planning artifact for PR #227.

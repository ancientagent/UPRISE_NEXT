# Dev Spec XHigh Review

Decision: pass

## Branch / PR State

- Repo: `/home/baris/UPRISE_NEXT`
- Branch: `docs/artist-profile-source-dashboard-specs`
- HEAD reviewed: `84d1b25`
- Dirty state before review write: clean (`git status --short` returned no tracked/untracked changes)
- PR: #227, `docs: add artist profile screen package specs`
- PR state: `OPEN`, non-draft, `MERGEABLE`, merge state `CLEAN`
- Base/head: `main` <- `docs/artist-profile-source-dashboard-specs`
- CI/status reviewed from `gh pr view 227`: CI Pipeline, Canon Guard, Secrets Scan, Vercel preview, and Vercel Preview Comments all reported success.

## Findings

- BLOCKER: None.
- HIGH: None.
- MEDIUM: None.
- LOW: None blocking merge.

## Confirmed Correct

- Authority order is preserved. The Dev Spec correctly treats `AGENTS.md` as top authority and owner specs under `docs/specs/**` as durable product/API/runtime truth (`docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:70`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:80`), matching the documentation framework authority model and screen-package rules (`docs/specs/system/documentation-framework.md:28`, `docs/specs/system/documentation-framework.md:40`, `docs/specs/system/documentation-framework.md:142`, `docs/specs/system/documentation-framework.md:159`).
- Screen-package authority is not overclaimed. The package README says this package is an execution workspace and product truth remains in owner specs (`docs/screen-packages/artist-profile-source-dashboard/README.md:8`, `docs/screen-packages/artist-profile-source-dashboard/README.md:12`), and the Dev Spec follows that boundary.
- Artist Profile, Source Dashboard, Registrar, and listener profile boundaries are correctly separated. The owner spec requires Artist Profile to remain a public listener-facing direct-listen surface, Source Dashboard to remain owner/member tooling, Registrar to remain listener/base-identity civic infrastructure, and listener profile to avoid embedded source tools (`docs/specs/users/artist-profile-and-source-dashboard.md:64`, `docs/specs/users/artist-profile-and-source-dashboard.md:90`, `docs/specs/users/artist-profile-and-source-dashboard.md:132`, `docs/specs/users/artist-profile-and-source-dashboard.md:146`). The Dev Spec restates those boundaries without adding new surface ownership (`docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:33`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:40`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:127`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:130`).
- Release Deck limits are accurate. The Dev Spec's `3` active music slots, `360` second song cap, `900` second active-rotation cap, URL-only MVP ingest, and non-active paid ad attachment match the owner spec (`docs/specs/media/release-deck-and-eligibility.md:33`, `docs/specs/media/release-deck-and-eligibility.md:43`) and lifecycle spec (`docs/specs/users/artist-profile-and-source-dashboard.md:91`, `docs/specs/users/artist-profile-and-source-dashboard.md:99`).
- Official outbound links and no source-level UPRISE Support are handled correctly. The lifecycle spec allows official outbound donation links when source-supplied (`docs/specs/users/artist-profile-and-source-dashboard.md:77`, `docs/specs/users/artist-profile-and-source-dashboard.md:79`) while the signals spec rejects direct source/support signal drift (`docs/specs/core/signals-and-universal-actions.md:37`, `docs/specs/core/signals-and-universal-actions.md:43`). The Dev Spec preserves this distinction (`docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:23`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:27`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:92`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:94`).
- No-DM and no-Artist-Profile-Blast boundaries are correct. The social spec says artist accounts cannot receive direct DMs and Blast must not be repurposed as a generic source-profile action (`docs/specs/social/message-boards-groups-blast.md:24`, `docs/specs/social/message-boards-groups-blast.md:27`, `docs/specs/social/message-boards-groups-blast.md:87`, `docs/specs/social/message-boards-groups-blast.md:91`). The Dev Spec's non-goals and stale-path warnings preserve that boundary (`docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:23`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:25`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:216`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:233`).
- Registrar GPS/Home Scene/source-origin authority is accurately traced. Registrar owns the source-origin contract and source-facing `/registrar` bridges do not change its actor model (`docs/specs/system/registrar.md:21`, `docs/specs/system/registrar.md:24`, `docs/specs/system/registrar.md:40`, `docs/specs/system/registrar.md:64`, `docs/specs/system/registrar.md:403`, `docs/specs/system/registrar.md:410`). The Dev Spec correctly marks source context as informational and filings as Home Scene/GPS-bound (`docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:154`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:174`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:226`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:233`).
- Runtime/API traces checked against source-map files were factual. Examples reviewed: optional-auth public profile read (`apps/api/src/artist-bands/artist-bands.controller.ts:11`), profile fetch with optional token and `trackId`/`signalId` selected-row handling (`apps/web/src/app/artist-bands/[id]/page.tsx:83`, `apps/web/src/app/artist-bands/[id]/page.tsx:99`, `apps/web/src/app/artist-bands/[id]/page.tsx:121`), owner/member source-tool visibility (`apps/web/src/app/artist-bands/[id]/page.tsx:130`, `apps/web/src/app/artist-bands/[id]/page.tsx:132`), user-scoped source context persistence (`apps/web/src/store/source-account.ts:5`, `apps/web/src/store/source-account.ts:20`), stale source context clearing (`apps/web/src/app/source-dashboard/page.tsx:98`, `apps/web/src/app/source-dashboard/page.tsx:106`), Release Deck payload building (`apps/web/src/lib/source/release-deck-validation.ts:43`, `apps/web/src/lib/source/release-deck-validation.ts:70`), source-owned track guards (`apps/api/src/tracks/tracks.service.ts:75`, `apps/api/src/tracks/tracks.service.ts:107`), and Registrar materialization/invite/member-sync guards (`apps/api/src/registrar/registrar.service.ts:1508`, `apps/api/src/registrar/registrar.service.ts:1700`, `apps/api/src/registrar/registrar.service.ts:1774`, `apps/api/src/registrar/registrar.service.ts:1964`).
- Implementation boundaries and stop conditions are sufficient for a planning artifact. The Dev Spec names file-ownership limits, design-vs-dev boundaries, web-tier boundary, package manager rule, owner-spec stop, provider/DB/schema/security/canon/product-decision stop, listener-profile stop, public-viewer source-tool stop, and owner-link-validation stop (`docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:236`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:246`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:257`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:269`).
- Missing-test coverage is appropriately called out instead of hidden. The Dev Spec explicitly warns that current web locks are mostly file-content tests and requires future rendered/integration coverage for signed-out/signed-in/source-member states, local direct-listen behavior, three-row cap, no DM/Blast/wheel/source-support, stale source context, Release Deck rejects, Registrar source context, and listener-profile bridge-only behavior (`docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:207`, `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md:220`).

## Validation Reviewed / Run

- Ran required initial state commands: `pwd`, `git branch --show-current`, `git rev-parse --short HEAD`, `git status --short`, and `gh pr view 227 --json number,title,state,isDraft,headRefName,baseRefName,mergeable,mergeStateStatus,statusCheckRollup,url`.
- Reviewed required docs plus AGENTS-mandated `docs/AGENT_STRATEGY_AND_HANDOFF.md`, `docs/README.md`, and `docs/specs/README.md` for spec/doc authority routing.
- Performed targeted read-only runtime/test inspection from the package source map using `rg`/line-numbered source reads. No runtime/provider/db/schema/art files were edited.
- Reviewed CI/status check evidence from GitHub: all reported checks were successful.
- Local tests were not rerun; this review relied on source inspection plus current green PR checks because the requested post-write validation was `git diff --check`.

## Required Fixes Before Merge

None. No blocker or high finding was identified against the Dev Spec as a planning artifact.

## Follow-Ups After Merge

- Future implementation must carry forward the Dev Spec's behavior-level/rendered test requirements before using file-content locks as closeout evidence.
- If implementation touches Print Shop behavior beyond source-facing bridge links, expand evidence to the Print Shop runtime/API files and `docs/specs/economy/print-shop-and-promotions.md` as the Dev Spec already requires.
- If source-owner validation links become required, stop for owner-spec/runtime parity work before implementation; current source submitter materialization is signed-in JWT + GPS based.

## Recommendation

Pass. The Dev Spec is safe to merge as a planning artifact for PR #227. It respects owner-spec authority, accurately traces the relevant runtime/API/data/test contracts, preserves public/source/admin/listener boundaries, and names sufficient stop conditions and validation seeds for the next implementation-planning gate.

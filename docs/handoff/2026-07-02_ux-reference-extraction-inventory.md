# UX Reference Extraction Inventory

Date: 2026-07-02
Branch: `docs/ux-reference-extraction-inventory`
Base: `main` @ `79467df`
Mode: docs-only, read-only extraction inventory

## Executive Summary

The preserved UX branches still contain useful reference material, but none should be merged wholesale.

- `ux-implementation` is `538` commits behind and `14` commits ahead of current `main`.
- `ux-mobile-r1-build` is `370` commits behind and `26` commits ahead of current `main`.
- `feat/ux-batch17` is `354` commits behind and `3` commits ahead of current `main`.
- `feat/ux-batch18-run` is `354` commits behind and `3` commits ahead of current `main`.

Current `main` has already absorbed or superseded most high-value architecture from those branches: `HomeSceneSelector`, `PlotTopShell`, `PlotListenerProfile`, the current top RADIYO player shell, Feed / Events / Archive Plot tabs, Archive Registrar placement, profile-only saved Away Scenes, and no transport UI inside Plot.

Recommendation: keep the preserved branches as references for now, extract only small current-compatible concepts into fresh branches from `main`, and do not rebase or merge the prototype branches directly.

## Current Authority Boundaries

Active product truth reviewed for this inventory:

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- Current `main` runtime components under `apps/web/src/components/plot/`

Rules that control extraction:

- Plot is Feed / Events / Archive only.
- Home Scene selector/swiper switches the user's active Home Scene communities.
- Transport is reserved for Away Scene / Discover / saved Uprise flows and must not be added inside Plot.
- Source tools stay outside non-expanded Plot and outside the listener collection body.
- No `Statistics` or `Promotions` active Plot tab revival.
- No one-off city, genre, artist, fixture, or prototype-specific runtime logic.

## Branch Inventory

| Branch / Worktree | State Versus `main` | Main Content | Extraction Status | Recommendation |
| --- | --- | --- | --- | --- |
| `ux-implementation` / `/home/baris/UPRISE_NEXT_uximpl` | `538` behind / `14` ahead | Plot/profile/player state-machine foundation, profile strip, old collection player mode, artist-dashboard prototype docs/route, discovery transport gating prototype, old Statistics-scoped moves | Partially useful but mostly superseded | Preserve as reference. Extract only current-compatible state-machine/test concepts or source-dashboard IA notes after owner-doc review. Do not merge route/runtime wholesale. |
| `ux-mobile-r1-build` / `/home/baris/UPRISE_NEXT_uxmobile` | `370` behind / `26` ahead | Mobile-first Plot shell, player/profile polish, onboarding mobile/GPS copy experiments, community subgenre copy, old UX docs | Partially useful but mostly superseded | Preserve as reference. Extract only visual composition/test ideas after mapping to current `RADIYO`/`SPACE`, selector, and no-transport-in-Plot language. |
| `feat/ux-batch17` | `354` behind / `3` ahead | Reliant batch 17 lane outputs, blockers, execution-plan/runbook changes | Historical batch evidence | Preserve until explicit archive/extraction decision. Do not merge automation/runtime changes. |
| `feat/ux-batch18-run` | `354` behind / `3` ahead | Reliant batch 18 lane outputs, Social-hidden MVP precedence note, execution-plan/runbook changes | Historical batch evidence | Preserve until explicit archive/extraction decision. Do not merge automation/runtime changes. |

## Current Main Already Covers

These concepts exist on current `main` and should not be reintroduced from old branches:

- Home Scene selector as `apps/web/src/components/plot/HomeSceneSelector.tsx`.
- Non-expanded Plot top shell as `apps/web/src/components/plot/PlotTopShell.tsx`.
- Expanded listener profile body as `apps/web/src/components/plot/PlotListenerProfile.tsx`.
- Current top/bottom RADIYO player behavior as `apps/web/src/components/plot/RadiyoPlayerPanel.tsx` with `RADIYO` / `SPACE` modes.
- Profile-only saved Away Scene and activation-notice rendering.
- Registrar placement in Archive/community information, with Registrar on top and records below.
- No forced non-expanded right/context panel.
- No transport inside Plot.
- Current UX solution docs such as `MVP_MOBILE_UX_SYSTEM_R1.md`, `MVP_PLAYER_PROFILE_INTERACTION_R1.md`, `MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`, `MVP_SCREEN_AND_SURFACE_MAP_R1.md`, and `SURFACE_CONTRACT_PLOT_R1.md`.

## Extractable Candidates

### Candidate 1: Current-compatible Plot state-machine tests

Source reference:

- `ux-implementation`: `apps/web/src/lib/plot-ui-state-machine.ts`
- `ux-implementation`: `apps/web/__tests__/plot-ui-state-machine.test.ts`
- `ux-implementation`: `apps/web/__tests__/plot-ui-store.test.ts`

Potential value:

- Gives a small pure-model way to lock collapsed / expanded profile transitions and player context rules.
- Could reduce UI regression risk without importing old runtime.

Required adaptation:

- Replace old `collection` wording with current `SPACE` where applicable.
- Remove active `national` player tier assumptions unless a current owner spec activates them.
- Tie tests to current `PlotTopShell`, `PlotListenerProfile`, and `RadiyoPlayerPanel` contracts, not old prototype components.

Recommended follow-up branch:

- `test/plot-profile-player-state-contract`

### Candidate 2: Mobile-first visual polish patterns

Source reference:

- `ux-mobile-r1-build`: `apps/web/src/app/plot/page.tsx`
- `ux-mobile-r1-build`: `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
- `ux-mobile-r1-build`: `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
- `ux-mobile-r1-build`: `docs/solutions/MVP_MOBILE_UX_COMPONENT_CONTRACTS_R1.md`

Potential value:

- Visual scale, seam affordance, and expanded-profile layout ideas may still help the current Plot top shell and profile body.

Required adaptation:

- Apply only to current components on fresh `main`.
- Preserve current selector/swiper language.
- Preserve `RADIYO` / `SPACE` mode language.
- Do not add transport controls or Discovery behavior inside Plot.

Recommended follow-up branch:

- `style/plot-mobile-visual-polish-from-reference`

### Candidate 3: Onboarding copy and GPS retry ideas

Source reference:

- `ux-mobile-r1-build`: onboarding commits around GPS prompt, Deny label, retry action, reverse-geocode fallback, and taste-section removal.

Potential value:

- Some microcopy and retry affordance ideas may improve onboarding clarity.

Required adaptation:

- Owner-spec check against `docs/specs/users/onboarding-home-scene-resolution.md` first.
- Do not add a public reverse-geocode provider or provider dependency without explicit provider review.
- Do not enforce mobile-only onboarding unless the owner spec says so.
- Taste-tag removal is already current truth; do not reimplement it from old code.

Recommended follow-up branch:

- `docs/onboarding-gps-copy-reference-review` first, then implementation only if the owner spec supports it.

### Candidate 4: Source-dashboard / artist-dashboard IA notes

Source reference:

- `ux-implementation`: `docs/solutions/artist-dashboard-r1/*`
- `ux-implementation`: `apps/web/src/app/artist-dashboard-r1/page.tsx`

Potential value:

- The IA notes may be useful when hardening `Source Dashboard`, `Release Deck`, or source/admin routes.

Required adaptation:

- Do not add or revive `/artist-dashboard-r1` as a runtime route.
- Translate any useful IA to current `Source Dashboard` vocabulary and source/listener separation rules.
- Route through `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` and active source specs.

Recommended follow-up branch:

- `docs/source-dashboard-ia-reference-extraction`

### Candidate 5: Batch 17/18 evidence only

Source reference:

- `feat/ux-batch17`
- `feat/ux-batch18-run`

Potential value:

- Historical blocker notes and batch outputs can explain why some UX ideas were deferred.

Required adaptation:

- Read as evidence only.
- Do not merge Reliant scripts/runbooks from these old branches into current tooling without a separate tooling owner review.

Recommended follow-up branch:

- None unless a specific missing assertion or blocker note is requested.

## Do Not Extract Without Fresh Approval

Do not extract these from the preserved branches unless an owner spec is patched first and the implementation starts from current `main`:

- Discovery Pass gating or paid Discovery behavior.
- Transport UI inside Plot.
- Active `Statistics`, `Promotions`, or `Social` Plot tabs.
- Old `collection` player-mode naming where current docs say `SPACE`.
- Active `national` player-tier UI in the MVP top player.
- Hard-coded music-community subgenre-range copy.
- Mobile-only onboarding enforcement.
- Public reverse-geocoding fallback or new provider dependency.
- `/artist-dashboard-r1` runtime route.
- Player navigation to `/users/:id` as artist-profile navigation.
- Wholesale `.reliant` queue/orchestrator automation changes.
- Any tip-to-tip merge or rebase of `ux-implementation`, `ux-mobile-r1-build`, `feat/ux-batch17`, or `feat/ux-batch18-run`.

## Recommended Next Order

1. Review this inventory and pick one extraction candidate.
2. If choosing Plot, start with Candidate 1: state-machine/test contract hardening from old ideas only, fresh branch from current `main`.
3. If choosing visuals, use Candidate 2 and inspect the current screen/component first; do not import old components.
4. If choosing onboarding, do a docs/spec review first because provider and mobile-only assumptions are risky.
5. Keep all four preserved UX refs registered until the selected candidate is extracted or explicitly archived.

## Commands Run

```bash
git branch --show-current
git rev-parse --short HEAD
git status --short --branch
pnpm run workspace:register -- --id ux-reference-extraction-inventory --kind branch --branch docs/ux-reference-extraction-inventory --status active --owner "Codex local" --agents "Codex local" --scope "Read-only extraction inventory for preserved UX reference worktrees ux-implementation and ux-mobile-r1-build." --path /home/baris/UPRISE_NEXT --pr - --base main --head pending --closeout "merge docs inventory via PR if green; no prototype merge"
git worktree list --porcelain
gh pr list --state open --limit 50 --json number,title,headRefName,baseRefName,isDraft,mergeable,updatedAt,url,statusCheckRollup
for b in ux-implementation ux-mobile-r1-build feat/ux-batch17 feat/ux-batch18-run; do git rev-list --left-right --count main...$b; git log --oneline main..$b | head -40; done
for b in ux-implementation ux-mobile-r1-build feat/ux-batch17 feat/ux-batch18-run; do git diff --stat main...$b | tail -20; done
find apps/web/src/components/plot -maxdepth 1 -type f -printf '%f\n' | sort
find docs/solutions -maxdepth 1 -type f | grep -E 'UX|PLOT|PLAYER|SCREEN|SURFACE|DISCOVER'
pnpm run workspace:audit
pnpm run docs:lint
git diff --check
git push -u origin docs/ux-reference-extraction-inventory
gh pr create --base main --head docs/ux-reference-extraction-inventory --title "Docs: add UX reference extraction inventory"
```

## Validation

- `pnpm run workspace:audit` - passed; 8 registry entries cover local branches, worktrees, and open PR heads.
- `pnpm run docs:lint` - passed, including `canon:lint`.
- `git diff --check` - passed.
- Branch pushed to `origin/docs/ux-reference-extraction-inventory`.
- PR opened: #183.

## Files Changed By This Slice

- `docs/handoff/2026-07-02_ux-reference-extraction-inventory.md`
- `docs/operations/ACTIVE_PM.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`

No runtime code, provider state, DB/schema state, or art assets were touched.

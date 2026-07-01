# Docs/Audit Branch Review

Date: 2026-07-01
Branch: `docs/active-pm-docs-audit-review`
Base: `main` at `a14801e` (`docs: review resolver onboarding branches (#154)`)
Mode: docs-only branch hygiene review

## Summary

Reviewed the remaining docs/audit preserved branches from `docs/operations/ACTIVE_PM.md`:

- `audit/home-scene-community-cleanup-plan`
- `audit/registrar-source-origin-compatibility`
- `docs/artist-identity-canon-fix`

Result: all three are useful historical context but should not be merged wholesale into current `main`. Current `main` already contains the durable product rules, owner specs, runtime implementation, tests, and newer handoffs that supersede the old branch content. Snapshot merges from these branches would also revert newer runtime/docs work and/or tracked `art/` assets.

Deletion is not performed in this slice. Branch deletion remains a destructive cleanup action requiring explicit approval.

## Branch Findings

### `audit/home-scene-community-cleanup-plan`

- Tip: `86eeaaa docs: inventory home scene community cleanup paths`
- Unique content: `docs/handoff/2026-06-25_home-scene-community-cleanup-read-path-inventory.md` plus changelog entry.
- Review result: superseded.
- Reason: the branch inventories `homeSceneCommunity` read paths and recommends resolver adoption. Current `main` already has the shared `MusicCommunityPreferenceResolverService`, resolver adoption across high-risk read paths, onboarding/invite write sync, activation matching, staging verification command, and current owner-spec/handoff coverage.
- Action: cleanup candidate after explicit branch-deletion approval; do not merge branch.

### `audit/registrar-source-origin-compatibility`

- Tip: `5defe30 docs: audit registrar source origin compatibility`
- Unique content: `docs/handoff/2026-06-25_registrar-source-origin-compatibility-audit.md` plus changelog entry.
- Review result: superseded.
- Reason: the branch flags Registrar source-origin default-preference resolver adoption as follow-up. Current `main` already implements and tests default-preference source-origin behavior, source-origin persistence, activation readiness, transaction-time revalidation, and normalized activation cutover matching.
- Action: cleanup candidate after explicit branch-deletion approval; do not merge branch.

### `docs/artist-identity-canon-fix`

- Tip: `2633292 docs: correct artist identity model to Registrar-linked entity canon`
- Unique content: older identity/spec corrections, a February master-context archive handoff, and broad spec edits for identity, Registrar, Print Shop/events, social messaging, moderation, and analytics.
- Review result: superseded / unsafe wholesale.
- Reason: current `main` already contains the durable Registrar-linked Artist/Band identity model, source-management separation, Print Shop/event boundaries, social messaging locks, Release Deck caps, and newer business-account boundaries. The old branch also contains now-stale anonymous/public-link and auto-publish business promotion language that conflicts with newer active business/source guidance.
- Action: cleanup candidate after explicit branch-deletion approval; do not merge branch.

## Current Evidence Checked

- `docs/PLATFORM_START_HERE.md`
- `docs/operations/ACTIVE_PM.md`
- `docs/handoff/README.md`
- `docs/CHANGELOG.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/registrar.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/social/message-boards-groups-blast.md`
- focused API test/runtime references for preference resolver, Registrar source origin, activation cutover, Release Deck caps, profile/Away Scene notices, and Print Shop event writes.

## Commands Run

```bash
git status --short --branch
git rev-parse --short HEAD
git remote -v
gh pr list --state open --limit 100 --json number,title,headRefName,baseRefName,isDraft,mergeable,updatedAt,url,statusCheckRollup
git worktree list --porcelain
git branch -vv --all --sort=-committerdate
for b in audit/home-scene-community-cleanup-plan audit/registrar-source-origin-compatibility docs/artist-identity-canon-fix; do git rev-list --left-right --count main...$b; git cherry -v main $b; git diff --name-status main...$b; done
git show --stat --oneline --name-status 86eeaaa
git show --stat --oneline --name-status 5defe30
git show --stat --oneline --name-status ff62556 2633292
rg -n "Music-Community Preference|compatibility cleanup|homeSceneCommunity|default preference|MusicCommunityPreferenceResolver|source-origin|source origin|registrar source origin|Activation|cutover|15 minutes|6 minute|Release Deck|Artist/Band is a Registrar-linked|Registrar-linked entity|Production identities|business submissions|Print Shop" docs/PLATFORM_START_HERE.md docs/specs docs/agent-briefs docs/handoff/README.md docs/operations/ACTIVE_PM.md docs/CHANGELOG.md apps/api/src apps/api/test --glob '!node_modules'
```

## Files Changed In This Slice

- `docs/operations/ACTIVE_PM.md`
- `docs/handoff/2026-07-01_docs-audit-branch-review.md`
- `docs/handoff/README.md`
- `docs/CHANGELOG.md`

## Validation

Run before closeout:

```bash
pnpm run docs:lint
git diff --check
```

## Next Signal

Review the remaining preserved branch groups:

1. UX/prototype branches.
2. Phase3 automation/runtime branches.

Do not delete reviewed cleanup candidates until explicit deletion approval is given.

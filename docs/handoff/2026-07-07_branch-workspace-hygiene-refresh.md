# Branch / Workspace Hygiene Refresh

Date: 2026-07-07
Branch: `docs/post-227-branch-hygiene-refresh`
Base: `main` @ `354e6f4`
Owner: Codex local

## Summary

Refreshed UPRISE operations state after PR #227 merged and ran a read-only branch/worktree hygiene pass.

No runtime code, provider state, database state, schema, migrations, or art assets were touched.
No branches or worktrees were deleted in this pass.

## Current Truth

- Main workspace `/home/baris/UPRISE_NEXT` is on `main` @ `354e6f4` before this refresh branch's docs changes.
- PR #227 (`docs/artist-profile-source-dashboard-specs`) is merged and its remote branch was deleted/pruned.
- The only open GitHub PR observed is draft PR #212 (`docs/linear-clean-context-agent-roles`), intentionally deprioritized and currently conflicting.
- `pnpm run workspace:audit` passes for local branches, worktrees, and open PR heads.
- Preserved worktrees are clean:
  - `/home/baris/UPRISE_NEXT_uximpl` on `ux-implementation` @ `be4ddde`
  - `/home/baris/UPRISE_NEXT_uxmobile` on `ux-mobile-r1-build` @ `b59a63c`
- Preserved historical UX batch branches remain:
  - `feat/ux-batch17`
  - `feat/ux-batch18-run`

## Files Changed

- `docs/operations/ACTIVE_PM.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-07_branch-workspace-hygiene-refresh.md`

## Remote-Only Cleanup Findings

`node scripts/workspace-registry.mjs audit --include-remote` still reports historical remote-only refs that predate or sit outside the current registry. These are not standard-audit blockers, but they should be handled in a dedicated cleanup pass.

Merged into `origin/main` by ancestry and likely safe cleanup candidates after explicit deletion approval:

- `origin/abacus/community-activation-proxy-lifecycle`
- `origin/audit/music-community-preference-runtime-parity`
- `origin/chore/staging-readiness-and-seed-safety`
- `origin/docs/abacus-fusion-swarm-strategy`
- `origin/docs/plot-tab-stale-term-annotations`
- `origin/docs/submitted-location-gps-staging-smoke`
- `origin/docs/systems-scale-no-one-off-community`
- `origin/docs/voice-plot-dashboard-definition`
- `origin/feat/onboarding-home-scene-resolution`
- `origin/feat/player-profile-contract-hardening`
- `origin/feat/plot-shell-archive-contract-hardening`
- `origin/feat/submitted-location-gps-authority`
- `origin/feat/ux-foundation-screen-shell`
- `origin/feat/ux-founder-locks-and-harness`
- `origin/fix/api-typecheck-tx`
- `origin/fix/artist-profile-public-read`
- `origin/fix/onboarding-music-community-option-labels`
- `origin/fix/print-shop-location-defaults`
- `origin/fix/release-deck-mvp-validation`
- `origin/fix/source-account-context-hardening`
- `origin/next-from-origin-main`
- `origin/next-slice58-registrar-artist-dispatch-controller-tests`
- `origin/next-slice64-phase2-roadmap-kickoff`
- `origin/phase3-batchc-098-099`
- `origin/phase3-next`
- `origin/test/onboarding-home-scene-smoke`

Not safe to delete without explicit review or preservation decision:

- `origin/codex/propose-prisma-schema-migration` - old closed draft PR #1 with one unique commit; likely obsolete, but schema-related.
- `origin/docs/hermes-launch-reviewer` - PR #87 merged, but branch head is not ancestry-merged; likely squash/merge artifact.
- `origin/docs/upr-11-staging-seed` - PR #88 merged, but branch head is not ancestry-merged; likely squash/merge artifact.
- `origin/docs/linear-clean-context-agent-roles` - open draft PR #212; keep unless explicitly reprioritized or closed.
- `origin/feat/ux-batch17` - preserved historical UX reference.
- `origin/feat/ux-batch18-run` - preserved historical UX reference.
- `origin/ux-implementation` - preserved worktree branch.
- `origin/ux-mobile-r1-build` - preserved worktree branch.

## Validation

Run in this branch:

```bash
pnpm run docs:lint
git diff --check
pnpm run workspace:audit
node scripts/workspace-registry.mjs audit --include-remote
```

Results:

- `pnpm run docs:lint` passed.
- `git diff --check` passed.
- `pnpm run workspace:audit` passed: local branches, worktrees, and open PR heads are covered.
- `node scripts/workspace-registry.mjs audit --include-remote` passed with warnings for historical remote-only refs. Those warnings are expected until a separate approved remote cleanup pass deletes or registers them.

## Commands Run

```bash
git status --short --branch
git worktree list --porcelain
git remote -v
gh pr list --state open --limit 100 --json number,title,headRefName,baseRefName,isDraft,mergeable,updatedAt,url,statusCheckRollup
git fetch --prune origin
gh pr view 227 --json number,title,state,mergedAt,headRefName,baseRefName,url
gh pr view 212 --json number,title,state,isDraft,mergeable,headRefName,baseRefName,url
git branch --merged origin/main
git branch --no-merged origin/main
git branch -r --merged origin/main
git branch -r --no-merged origin/main
pnpm run workspace:audit
node scripts/workspace-registry.mjs audit --include-remote
```

## Next Recommended Action

1. Push/merge this docs-only operations refresh.
2. If the founder approves remote deletion, run a separate cleanup pass for the clearly merged remote-only refs.
3. Keep PR #212 and preserved UX references untouched unless explicitly reprioritized.

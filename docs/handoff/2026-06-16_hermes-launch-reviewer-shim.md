# Hermes Launch Reviewer Shim

Date: 2026-06-16
Branch: `docs/hermes-launch-reviewer`
Status: docs/tooling slice

## Summary

Added a narrow Hermes launch-review role and prompt shim for post-implementation or post-merge checks.

This keeps Hermes in the external-audit lane as a read-only reviewer while giving it enough structure to review one named issue, PR, or launch slice without re-running a broad repo audit.

## Files Added

- `docs/agent-briefs/UPRISE_HERMES_LAUNCH_REVIEWER.md`
- `docs/handoff/agent-control/HERMES_LAUNCH_REVIEW_SHIM.md`

## Files Updated

- `docs/agent-briefs/README.md`
- `docs/agent-briefs/EXTERNAL_TOOLS.md`
- `docs/handoff/agent-control/README.md`
- `docs/CHANGELOG.md`

## Current Use

The shim includes a ready-to-paste UPR-10 review prompt for the post-merge onboarding fallback voting-anchor slice:

- issue: `UPR-10`
- PR: `86`
- branch: `main`
- expected HEAD: `bda25f3`

## Boundaries

- Hermes remains read-only by default.
- Hermes does not run seeds, migrations, deploys, provider CLIs, formatters, commits, or pushes.
- Hermes output is evidence for maintainer review, not product authority.
- Untracked `art/` files remain user-owned art context and are not inspected by launch reviews unless the task is explicitly about art/assets.

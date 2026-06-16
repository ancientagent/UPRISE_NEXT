# Discover Contract Checklist Handoff (2026-03-23)

## Purpose
Capture the repo-grounded contract inventory needed before a full integrated Discover build.

## Added Artifact
- `docs/solutions/MVP_DISCOVER_CONTRACT_CHECKLIST_R1.md`

## What It Does
- separates Discover capabilities that already exist in repo from those that are still missing
- identifies the minimum contract additions required before building full Discover in one pass
- prevents the frontend from being built against fake data or temporary scaffolding

## Key Conclusion
The repo already supports:
- scene/Uprise discovery transport
- community read surfaces
- generic universal signal actions
- Uprise shelf mapping

The repo does not yet support:
- local artist search inside community Discover
- local song search inside community Discover
- Discover `Recommendations`
- Discover `Trending`
- Discover `Top Artists`
- a clean saved-Uprise acquisition contract
- a real `Recommend` backend action, if Discover is meant to ship with it

## Recommended Next Step
Do the missing contract/API layer first, then implement full Discover in one integrated pass.

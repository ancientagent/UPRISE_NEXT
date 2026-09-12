# PM Check-In

**Date/Time:** 2026-08-24 13:47 America/Chicago  
**Run ID:** `01a03517-9d8c-7503-8b87-5415212f5c80`  
**Agent/Thread:** `🟣 UPRISE • Manager • Active` / `🟣 UPRISE • Design • Active`  
**Area:** Design-seat creation and routing  
**Task:** Create a dedicated Design agent while preserving Landing Page + Launch Entry as a separate seat.  
**Branch/Commit:** `fable/handoff` at `3c12c6fc700626e18b7e68300eca1bc03a1441fc` before this documentation change.

## Result

Created and seated the dedicated read-only Design agent. Its first bounded task
is post-onboarding Listener Profile/onboarding-continuity reference extraction
from the preserved UX worktrees.

## Evidence

Design thread `01a03517-9d8c-7503-8b87-5415212f5c80`; current checkout
`/home/baris/UPRISE_NEXT`; Landing Page + Launch Entry remains separately
registered in `.pm/ACTIVE_ROOMS.md`.

## Status

Implemented: seat and registry routing only. No design, code, assets, writer
lease, or Landing scope changed.

## Changed

The agent registry and active-room record now distinguish Design from Landing
and establish the Design agent's reporting route to the Manager.

## Still Open

Design must return its evidence-backed handoff for Manager disposition before a
design or implementation packet is opened.

## Blockers

None for read-only reference extraction.

## Suggested Next Step

Review the Design handoff, then issue or return one narrow Listener Profile
design packet.

## PM Attention

None.

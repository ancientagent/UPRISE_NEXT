# MVP Platform Coverage Matrix (R1)

Status: Active planning artifact  
Last Updated: 2026-02-28  
Owner: Product execution + orchestration

## Purpose
Provide a one-page, non-speculative view of what is covered vs missing across the whole MVP platform so execution does not over-focus on a single subsystem.

## Source Basis
- `docs/solutions/MVP_HARD_ROADMAP_EXECUTION_PLAN.md`
- `docs/solutions/MVP_FLOW_MAP_R1.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/system/registrar.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/README.md`

## Coverage Legend
- `Complete (MVP-usable)`: implemented and usable in current flow.
- `Partial (implemented + deferred)`: meaningful implementation exists, but key scope remains deferred.
- `Not Started / Minimal`: no meaningful MVP-complete implementation evidence yet.

## Platform Coverage Matrix

| Surface | Current Coverage | Evidence | Gaps to MVP | Next Focus |
|---|---|---|---|---|
| Onboarding + Home Scene | Complete (MVP-usable) | `USER-ONBOARDING` implemented endpoints + web onboarding page/store | Parent-scene free-text sect mapping, pioneer incentives | UX polish and messaging consistency |
| Plot shell (Feed/Events/Promotions/Stats/Map reads) | Partial | `COMM-PLOT` shows shell + read surfaces + active/home scene fallback | Unified UX ordering, social tab policy, advanced registrar dashboard | UX-first flow coherence and state handling |
| Registrar (artist/promoter/project/sect + invite/code reads/writes) | Partial-to-strong | `SYS-REGISTRAR` implemented-now list is extensive | Admin orchestration, project/sect lifecycle expansion, provider/scheduler production path | Keep hardening, avoid feature drift, align UX copy |
| Signals / Universal Actions | Partial | `CORE-SIGNALS` endpoints and idempotent actions implemented; current runtime still carries `ADD`/`SUPPORT` naming debt against the newer action matrix | Broader discourse/proof-of-support extensions plus action-grammar reconciliation | Integrate clear UX paths without ranking implications |
| Communities core beyond plot shell | Partial | Specs exist; some read surfaces in Plot | End-to-end closure for scenes/uprises/sects and discovery-scene switching semantics | R3 closure planning |
| Broadcast / Fair Play | Minimal-to-partial | Spec exists and roadmap anchor set | End-to-end MVP behavior closure | R3 execution after UX lock |
| Discovery (vibe/taste) | Minimal | Specs present | MVP implementation closure not evidenced as complete | R4 execution planning |
| Social (message boards/groups/blast) | Minimal | Spec present; Plot notes deferred social/V2 behavior | Core MVP social surfaces pending | R4 execution planning |
| Events lifecycle depth | Partial | Plot events read panel exists | Full event workflow/UX closure | R4 execution planning |
| Economy (print/promotions/pricing) | Minimal-to-partial | Promotions read exists in Plot; pricing specs exist | MVP-economy behavior closure pending | R4 execution planning |
| Moderation/Admin launch controls | Minimal | Specs present | MVP launch-readiness implementation pending | R5 planning |
| Edge cases/compliance/UAT/launch checklist | Not Started / Minimal | Specs and roadmap define as later phase | Full launch hardening pending | R5 |

## Program Balance Assessment (Current)
- Engineering throughput has been heavily weighted to registrar + automation + queue reliability.
- This produced strong execution stability and test discipline.
- Whole-platform MVP still requires meaningful closure across non-registrar surfaces (R3-R5), especially UX coherence and product flow integration.

## Immediate Strategy Implication
- Do not continue registrar-only batching as the primary strategy.
- Shift next execution emphasis to UX-first flow integration while maintaining regression hardening in parallel lanes.

## Founder Checkpoint Questions
1. Confirm preferred first-load Plot emphasis order (feed vs registrar status prominence).
2. Confirm deferred social/V2 visibility policy in navigation/copy.
3. Confirm the cutoff line for MVP launch-ready vs deferred across discovery/social/economy.

## Recommended Next Step
Use this matrix with `MVP_UX_ALIGNMENT_REPORT_R1.md` in the walkthrough, then seed the next UX-first batch with lane-B primary scope and lane A/C/D/E supporting parity/QA/docs.

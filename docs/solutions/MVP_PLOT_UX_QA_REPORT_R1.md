# MVP Plot UX QA Report (R1)

Status: Historical QA-only parity pass; superseded by current Feed / Events / Archive lock
Date: 2026-03-01  
Scope label: UX-IMPL-531A..537A (`/plot` mobile-first UX parity)

Current note:

- This report records an older parity pass.
- Current MVP Plot tabs are `Feed`, `Events`, and `Archive`.
- Do not use this report to reintroduce a `Statistics` or `Promotions` tab.

## Method

- Manual parity verification against:
  - `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
  - `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
- Implementation inspected:
  - `apps/web/src/app/plot/page.tsx`
  - `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`

## Parity Results

| Check                                              | Expected                                                                                             | Actual                                                                                                                    | Result     | Evidence                                                                               |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| Collapsed/peek/expanded seam behavior              | Profile seam supports `collapsed <-> peek <-> expanded` transitions with in-route expansion/collapse | Seam has pointer + toggle handling and explicit `profilePanelState` state machine with all three states                   | PASS       | `apps/web/src/app/plot/page.tsx`                                                       |
| `RADIYO` / `Collection` mode transition            | Selection-driven Collection entry plus explicit eject/back return to `RADIYO`                        | Player shell exposes no dedicated mode switch button and relies on collection selection plus eject/back return            | PASS       | `apps/web/src/app/plot/page.tsx`, `apps/web/src/components/plot/RadiyoPlayerPanel.tsx` |
| Mode-based title label                             | Player/title labeling reflects current mode semantics                                                | `broadcastLabel` switches between scene/uprise label in `RADIYO` and `<user> Collection` in `Collection`                  | PASS       | `apps/web/src/app/plot/page.tsx`                                                       |
| Tabs hidden when expanded, restored when collapsed | Expanded profile state hides Plot tab body and restores on collapse                                  | Conditional branch `isProfileExpanded ? expanded panel : tabs/body` is active                                             | PASS       | `apps/web/src/app/plot/page.tsx`                                                       |
| Top Songs + Scene Activity placement               | Current runtime scopes these modules to the `Archive` tab                                            | Superseded since this report: `TopSongsPanel` and `Scene Activity Snapshot` now live under `activeTab === 'Archive'` only | SUPERSEDED | `apps/web/src/app/plot/page.tsx`                                                       |

## Summary

- Overall parity: `5/5 pass`, `0/5 fail`.
- QA outcome: `/plot` is aligned with the current locked mobile-first UX behavior set for this scope.

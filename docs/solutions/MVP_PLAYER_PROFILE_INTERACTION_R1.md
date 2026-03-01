# MVP Player/Profile Interaction (R1)
Status: Gesture contract companion (locked terms)  
Owner: Founder + product engineering  
Last updated: 2026-03-01

## Purpose
Resolve gesture-term ambiguity between profile pull interactions and player/container behavior for R1.

## Canon Links
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
- `docs/solutions/MVP_FLOW_MAP_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`

## Locked Terms
| Term | Locked Meaning | Not Allowed Interpretation |
|---|---|---|
| `seam` | The draggable/tappable boundary control between profile header and player shell. | Any generic page pull-to-refresh region. |
| `pull-tab` | Visual handle within seam hit area that communicates expand/collapse affordance. | A new route launcher or tab-navigation control. |
| `profile panel` | The expandable surface that reveals identity, stats, and collection sections. | A modal/sheet independent of Plot route. |
| `collapsed` | Baseline profile state with panel closed. | Hidden/unmounted profile system. |
| `peek` | Transient partial-open drag state prior to commit. | Persistent resting state. |
| `expanded` | Committed open profile state in the same Plot route. | Separate fullscreen route. |
| `commit` | Gesture-end decision to settle into `collapsed` or `expanded`. | Mid-gesture visual interpolation. |

## Interaction Boundaries
- Profile expansion/collapse remains route-stable on Plot.
- Player mode switch (`RADIYO` / `Collection`) changes player source/state only.
- Gesture ownership rules are deterministic and resolved by seam/profile/content touch-start context.
- Non-gesture fallback (seam tap toggle) remains mandatory.

## Ambiguity Removal Notes (R1)
- `peek` is explicitly non-persistent and must resolve to `collapsed` or `expanded` on release.
- `pull-tab` is an affordance label only; it is not part of Plot tab navigation.
- Content-body vertical scrolling does not implicitly trigger profile expansion.

# Instruction Packet: Onboarding → Listener Profile

Status: execution-ready design handoff; implementation requires a separate lease
Lane: first post-onboarding Listener Profile continuity
Disposition owner: `🟣 UPRISE • Manager • Active`

## Goal

Preserve the first-session transition from Onboarding Review into the existing
in-place Plot and Listener Profile experience. The target is route-stable,
accessible continuity, not a redesign.

## Required Sources

Authority:

- [`AGENTS.md`](../../../AGENTS.md)
- [`PLATFORM_START_HERE.md`](../../PLATFORM_START_HERE.md)
- [`CONTEXT_ROUTER.md`](../../agent-briefs/CONTEXT_ROUTER.md)
- [`UI_CURRENT.md`](../../agent-briefs/UI_CURRENT.md)
- [`ONBOARDING_HOME_SCENE.md`](../../agent-briefs/ONBOARDING_HOME_SCENE.md)
- [`onboarding-home-scene-resolution.md`](../../specs/users/onboarding-home-scene-resolution.md)
- [`plot-and-scene-plot.md`](../../specs/communities/plot-and-scene-plot.md)
- [`documentation-framework.md`](../../specs/system/documentation-framework.md)

Current runtime and tests:

- [`onboarding/page.tsx`](../../../apps/web/src/app/onboarding/page.tsx)
- [`plot/page.tsx`](../../../apps/web/src/app/plot/page.tsx)
- [`PlotListenerProfile.tsx`](../../../apps/web/src/components/plot/PlotListenerProfile.tsx)
- [`onboarding-page-lock.test.ts`](../../../apps/web/__tests__/onboarding-page-lock.test.ts)
- [`onboarding-regression-lock.test.ts`](../../../apps/web/__tests__/onboarding-regression-lock.test.ts)
- [`plot-ux-regression-lock.test.ts`](../../../apps/web/__tests__/plot-ux-regression-lock.test.ts)
- [`plot-profile-player-state-contract.test.ts`](../../../apps/web/__tests__/plot-profile-player-state-contract.test.ts)

Links are source pointers, not duplicated authority. Reverify all of them before
implementation because this packet records the baseline at
`e775023b8dc761bafd743616bf117d176c43e301`.

## State And Interaction Matrix

| State or event | Required visible result | Input and accessibility contract |
| --- | --- | --- |
| Onboarding Review | Resolved Home Scene plus current listening/proxy and voting context remain legible; `Enter The Plot` is the forward action. | Activation routes to `/plot` through the current control. Do not add a transition route or bespoke animation. |
| First `/plot` render | Existing Home Scene Plot shell appears with profile collapsed, top player, and `Feed`, `Events`, `Archive`. | Do not auto-open the profile. Preserve the current initial focus and route. |
| Collapsed seam | Current listener identity seam, Home Scene context, and Plot tabs remain available. | A downward pointer/touch gesture starts only from the current identity-layer seam. Tap, Enter, or Space on the seam button expands through the same state owner. |
| Peek | The seam provides the current transient pull preview without replacing the Plot tabs/body. | Releasing before the existing expansion commit returns to collapsed. Peek is not a new independent destination or route. |
| Expanded | Expanded profile replaces the Plot tabs/body in place; `RADIYO / SPACE` behavior is unchanged; the player moves to the profile bottom. | The seam button collapses on tap, Enter, or Space. An upward gesture follows the current collapse threshold. Keep `aria-controls="plot-profile-panel"`, expose the expanded value with `aria-expanded`, and retain the labelled panel relationship. |
| Preference loading | Music-community affiliation area stays in the established profile hierarchy and communicates loading. | Keep controls unavailable only as required by current state; do not synthesize preference data. |
| Preference error | The affiliation area presents the current non-destructive error state. | Preserve access to the rest of the profile, bottom player, and return action. Do not invent a recovery contract. |
| Preference empty | The affiliation area states that no preferences are saved. | Preserve the current add/default affordances when authenticated; do not infer an affiliation or change Home Scene. |
| Reduced motion | The same state changes and final layouts occur with minimal or effectively immediate transition. | Respect the user's reduced-motion preference without removing gesture, tap, keyboard, ARIA, or focus semantics. |
| Return to Plot Tabs | Expanded profile closes and the existing Plot tabs/body return in `/plot`; player placement returns to the current top position. | `Return to Plot Tabs` invokes the same profile state owner. Do not reset player mode, collection selection, Home Scene context, or active Plot tab. |

## Expanded Hierarchy

Preserve this sequence and the runtime's current conditional/empty states:

1. Summary, activity score, and conditional status cards.
2. Calendar and current scene context.
3. Music-community affiliations with current default, shown-in-Home, and
   profile-only-until-active-scene states.
4. `Singles/Playlists`, `Events`, `Photos`, `Merch`, `Saved Uprises`, and
   `Saved Promos/Coupons`.
5. Bottom player with unchanged `RADIYO / SPACE` semantics.
6. `Return to Plot Tabs`.

## Acceptance Criteria

- Review's `Enter The Plot` reaches `/plot` with the profile collapsed and the
  resolved Home Scene context intact.
- `Feed`, `Events`, and `Archive` remain the only current primary Plot tabs.
- Collapsed, transient peek, and expanded states stay owned by `/plot`; no
  profile route is introduced.
- Touch/pointer seam, tap, keyboard activation, ARIA state/relationship, and
  reduced-motion behavior all resolve to the same state outcomes.
- Expanded hierarchy, current affiliation/default states, collection sections,
  bottom player, and return action match this packet.
- Loading, error, and empty preference states remain understandable without
  fabricated values or blocking unrelated profile controls.
- Player behavior and labels remain unchanged: collection selection may enter
  `SPACE`, explicit return restores `RADIYO`, and expansion changes placement
  only.
- `Return to Plot Tabs` restores the existing Plot body without losing current
  tab, Home Scene, player mode, or collection selection.
- No item in the package non-goals changes.

## Future Implementation Surface And Validation

Start with only the three runtime files and four tests listed above. Add another
file only when current code ownership requires it and the Manager confirms the
lease remains in scope.

Focused validation must include the four named regression/contract tests plus
web typechecking. Independent QA must verify first-session continuity and the
state matrix at representative touch and keyboard viewports, including reduced
motion. Passing automated checks is not independent QA or product completion.

## Non-Goals And Stop Conditions

Do not implement Landing, automatic profile opening, a bespoke
onboarding-to-Plot animation, new routes, avatar editing, GPS profile badges,
source-management tools, player behavior changes, new collection playback,
RADIYO scheduling/lifecycle automation, or owner-spec/canon changes.

Stop and return to the Manager if the current branch/revision or writer lease is
not verified, a required source conflicts with this packet, acceptance requires
a non-goal or product decision, or independent QA cannot be assigned.

## Completion Routing

Implementation begins only under a separate Manager writer lease. It must end
with the executor contract's scoped commit/push and factual check-in, followed by
independent QA against that exact commit. This design package authorizes neither
implementation nor QA acceptance.

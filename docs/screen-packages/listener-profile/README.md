# Onboarding → Listener Profile Screen Package

Status: founder-approved design package; implementation not authorized
Package owner: `🟣 UPRISE • Design`
Disposition owner: `🟣 UPRISE • Manager • Active`

## Purpose

This package defines one bounded first-session continuity target:
`Onboarding Review → Enter The Plot → collapsed Listener Profile/Plot`, followed
by the existing `collapsed → peek → expanded` profile interaction in `/plot`.

It is a temporary execution handoff. Durable product truth remains in the owner
specs, and current runtime plus regression locks define the implementation
baseline. This package does not authorize code, asset, route, or behavior changes.

## Authority And Evidence

Read the concise execution packet in
[`instruction-packet.md`](./instruction-packet.md), then verify its sources at the
current revision.

Owner authority:

- [`onboarding-home-scene-resolution.md`](../../specs/users/onboarding-home-scene-resolution.md)
- [`plot-and-scene-plot.md`](../../specs/communities/plot-and-scene-plot.md)
- [`documentation-framework.md`](../../specs/system/documentation-framework.md)
- [`UI_CURRENT.md`](../../agent-briefs/UI_CURRENT.md)
- [`ONBOARDING_HOME_SCENE.md`](../../agent-briefs/ONBOARDING_HOME_SCENE.md)

Current implementation evidence:

- [`apps/web/src/app/onboarding/page.tsx`](../../../apps/web/src/app/onboarding/page.tsx)
- [`apps/web/src/app/plot/page.tsx`](../../../apps/web/src/app/plot/page.tsx)
- [`apps/web/src/components/plot/PlotListenerProfile.tsx`](../../../apps/web/src/components/plot/PlotListenerProfile.tsx)
- the four regression/contract tests listed in the instruction packet

The package was authored from `fable/handoff` at
`e775023b8dc761bafd743616bf117d176c43e301`. A future executor must reverify the
then-current branch, revision, specs, runtime, tests, and writer ownership.

## Continuity Target

1. Onboarding Review keeps the resolved Home Scene and listening/proxy context
   visible. `Enter The Plot` routes to `/plot`.
2. `/plot` opens with the Listener Profile collapsed. It does not open the
   profile automatically.
3. The in-place Plot shell preserves Home Scene context, `RADIYO / SPACE`
   terminology, and the current `Feed`, `Events`, `Archive` tabs.
4. The profile seam supports the current `collapsed → peek → expanded`
   interaction with tap and keyboard fallback.
5. Expanded profile replaces the Plot tabs/body in place. Its player sits at
   the bottom, and `Return to Plot Tabs` restores the Plot tab surface.

## Expanded Profile Hierarchy

Keep this order:

1. Profile summary, activity score, and current conditional status.
2. Calendar and current scene context.
3. Music-community affiliations, including current default and profile-only
   resolution states.
4. Current collection sections: `Singles/Playlists`, `Events`, `Photos`,
   `Merch`, `Saved Uprises`, and `Saved Promos/Coupons`.
5. Expanded-profile bottom player.
6. `Return to Plot Tabs` action.

Existing conditional elements inside this hierarchy remain governed by current
runtime and owner authority; this package neither expands nor removes them.

## Non-Goals

- Landing.
- Automatic profile opening.
- A bespoke onboarding-to-Plot animation.
- New routes.
- Avatar editing.
- GPS profile badges.
- Source-management tools.
- Changing player behavior.
- New collection playback.
- RADIYO scheduling or lifecycle automation.
- Changing owner specs or canon.

## Implementation Gate

Implementation requires a separate Manager-issued writer lease in the shared
checkout and independent QA against the accepted commit. The executor must stop
if the work requires a non-goal, a new product decision, or an owner-spec/canon
change. No implementation is authorized by this package.

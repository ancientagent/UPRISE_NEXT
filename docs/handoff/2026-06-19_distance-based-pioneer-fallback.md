# Distance-Based Pioneer Fallback

Date: 2026-06-19
Branch: `fix/distance-based-pioneer-fallback`
Area: onboarding / Home Scene / pioneer fallback

## Summary

The active onboarding spec says inactive or unavailable submitted Home Scenes route to the nearest active city scene for the same parent music community. Prior runtime behavior was deterministic but not actually geographic: same state, then member count, then name/id.

This slice makes fallback distance-based when the submitted city/state can be geocoded and candidate active scenes have geofences.

## Runtime Behavior

- Exact active submitted Home Scene still wins.
- Missing or inactive submitted Home Scene preserves pioneer intent.
- Runtime geocodes the submitted city/state through `PlacesService.geocodeCity`.
- If coordinates are available, active city-tier scenes for the same music community are ranked by PostGIS distance from the submitted location.
- Tie-breakers remain deterministic:
  - shortest distance
  - same submitted state
  - highest member count
  - name
  - id
- If geocoding or geofenced candidates are unavailable, runtime falls back to the older deterministic same-state/member/name ordering rather than blocking onboarding.

## Cost Boundary

Local/dev testing should keep using:

```bash
UPRISE_LOCATION_PROVIDER=fake
```

Fake provider resolves supported test cities without Google calls. Provider-backed Google geocoding should be used only for intentional hosted/provider validation.

## Verification Focus

- `apps/api/test/places.service.test.ts`
  - fake `geocodeCity` resolves El Paso without calling Google.
- `apps/api/test/onboarding.home-scene-resolution.test.ts`
  - missing El Paso/Punk routes to Austin/Punk through the distance-ranked path rather than the old member-count path.

## Future-Agent Notes

- Do not replace this with city-specific fallback tables.
- Do not collapse fallback to state-only or genre-only logic.
- If additional launch cities are added, the same distance-ranked fallback path applies as long as candidate scenes are geofenced.

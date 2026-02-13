# RFC: Mobile Stabilization and Anti‑Drift Strategy

Author: Mobile Team
Status: Draft
Target Branch: feat/home-scene-registry-v2

## Objectives
- Stabilize onboarding/routing and token refresh.
- Eliminate config/secrets drift and committed artifacts.
- Establish CI guardrails and a repeatable release process.

## Scope
- Mobile app (this repo). Dev backend scripts are helpers only.
- Out of scope: Large RN upgrade (planned separately).

## Phases

### Phase 1 — Stabilize (0–2 weeks)
- Navigation unify (v6): Keep route name `CommunitySetup` aliased to `HomeSceneRegistry`; remove legacy after soak.
- Post‑login gating: Route to registry unless fully onboarded and `community_key` present.
- Token refresh: Verify 401→refresh→retry uses the refreshed `accessToken`; add unit test.
- Secrets/config: No hardcoded keys; require `GOOGLE_MAPS_API_KEY` via env; env shape check in CI.
- Artifacts hygiene: Block committed bundles/logs; warn initially, enforce later.
- Tests: Jest for TypeaheadInput and community key helpers; run smokes on PR.

### Phase 2 — Modernize (2–6 weeks)
- RN upgrade ladder (0.66.4 → 0.71 → 0.73+), with dependency audit and smokes per step.
- Requests: Interceptor authoritative; remove `payload.accessToken` paths.
- Cleanup: Delete `CommunitySetup.js` post‑soak; migrate revolutionary flows.
- Security: Secret scanning, license checks, dependency audit in CI.

### Phase 3 — Enterprise Posture (6–12 weeks)
- Repo boundaries: Move `dev-backend/` out (submodule or separate repo).
- Release discipline: Branch protections, PR templates, CODEOWNERS review gates, changelog automation.
- E2E: Add Detox flows for login→registry→dashboard.

## Acceptance Criteria
- Login without community → registry; with key → dashboard.
- discovery/radio requests include `community_key` (dev logs show params).
- No hardcoded secrets; env guard fails bad shapes.
- CI warns (then fails) on committed bundles/logs and missing doc updates.
- Token refresh test validates 401→refresh→retry.

## Risks and Mitigations
- Route churn → keep alias until removal.
- Upgrade breakage → staged ladder + smokes.
- Secret false positives → tuned patterns + documented redaction.

## Rollout Plan
- Land guardrails in warn mode → switch to enforce after 1–2 weeks.
- Track progress in docs/Session-Logs/ with owners and dates.


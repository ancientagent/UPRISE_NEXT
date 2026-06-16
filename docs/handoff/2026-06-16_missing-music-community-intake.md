# Missing Music Community Intake

Date: 2026-06-16
Branch: `feat/missing-community-request-intake`
Issue: `UPR-8`
Status: implementation slice

## Summary

Added missing-music-community request intake without changing the approved launch selector or creating live Community records.

## Runtime Behavior

- `/onboarding` still requires City, State, and one approved parent Music Community to continue.
- The approved selector remains backed by `MUSIC_COMMUNITIES` and `docs/specs/seed/music-communities.json`.
- Users can submit a missing music-community request from onboarding after entering city/state.
- Requests require authentication.
- Request copy explicitly states that submission does not create a live scene and does not add a selector option.

## API

New endpoint:

```http
POST /onboarding/music-community-requests
```

Request body:

```json
{
  "requestedName": "Hardcore",
  "city": "Austin",
  "state": "TX"
}
```

The service stores intake in `music_community_requests`, keyed by user/request/city/state. It returns review signals:

- distinct requester count
- distinct city count

No final review threshold is hard-coded because the founder lock is qualitative: repeated submissions from distinct people in distinct cities.

## Boundaries

- No `Community` record is created by request intake.
- No option is added to the onboarding selector.
- No city/community-specific runtime behavior is introduced.
- No threshold number is invented in code.
- Launch Home Scene architecture remains invariant.

## Verification

Focused tests:

```bash
pnpm --filter api test -- onboarding.music-community-request.test.ts
pnpm --filter web test -- onboarding-regression-lock.test.ts
```

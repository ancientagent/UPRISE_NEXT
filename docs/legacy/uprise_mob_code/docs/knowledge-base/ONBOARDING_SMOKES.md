# Onboarding Flow Smokes (Mobile → API)

Purpose: Verify the first‑login onboarding path and that requests carry `community_key` or normalized geo/genre params.

## Steps
- Build and install Debug (for visibility)
  - `yarn start --reset-cache`
  - `scripts\build_install_verify_v2.ps1 -Configuration Debug`
- Flow
  - Launch app → Signup
  - Home Scene Creation:
    - Pick Sub‑genre (typeahead uses alpha list or `/onboarding/genre-suggestions`)
    - Pick City/State (typeahead or Use my GPS)
    - Submit
  - Expect Dashboard

## What to Observe
- UI
  - Sub‑genre suggestions render; City/State input responds
  - Revolutionary modal only if local community is inactive
- Network (Debug)
  - Requests to `/onboarding/genre-suggestions` (if endpoint configured) or local suggestions
  - Discovery/Radio requests include `community_key` when available
  - Fallback: normalized `city`, `state`, `genre`, optional `lat`, `lng`, `radius`

## Example Debug Lines
```
ReactNativeJS Building params: { community_key: "austin-texas-hip-hop" }
ReactNativeJS GET /api/discovery?community_key=austin-texas-hip-hop
```

## Acceptance
- Onboarding completes; user reaches Dashboard
- `community_key` persists in state and appears in subsequent discovery/radio requests
- No AppRegistry crash; no fatal AndroidRuntime during flow

## Tips
- During debugging, add `.env`: `DISABLE_TRACK_PLAYER=true`, `DISABLE_FIREBASE_MESSAGING=true`
- Use `scripts\windows\capture-logcat.ps1` to capture logs if a crash occurs

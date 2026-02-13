# CI Workflows (Android)
- AVD: API 31, ports 5554/5555, -accel off (Ubuntu), HVF (macOS)
- Artifacts: artifacts/debug, artifacts/release
- Summary JSON schema: [{kind, app_id, apk, launch_rc}]
- Emulator boot diagnostics: logcat/dumpsys captured

## Phase 2 smoke tests (local + CI)
- Local: build APK and run `adb install` only; defer emulator boot if CPU-constrained.
- DB: run PostGIS smoke `SELECT PostGIS_Full_Version();` against local 5433 (no writes).
- API: curl health and routes for `auth`, `radio`, `communities`, `discovery` with `city/state/genre` params.
- Mobile: launch app once; verify Radio fetch with `community_key` set; skip deep UI flows in CI.
- CI: gate on build success + lightweight route checks; emulator boot optional and can be deferred.

Networking (Android emulator)
- Use `http://10.0.2.2:3000` for API base in emulator.
- Ensure `REFRESH_TOKEN_URL=/auth/refresh` and `UPDATED_USERDETAILS=/user/me` present in `.env.development`.

# Phase 2 Test Plan (Mobile + WSL)

Purpose
- Validate the Phase 2 integration targets end-to-end with minimal, repeatable steps.
- Post-login routing is authoritative: after login, app routes to Home Scene Creation (`CommunitySetup`). Dashboard only after onboarding/home scene is set.

Environments
- Mobile (Windows): Pixel 6a AVD, API base `http://10.0.2.2:3000`
- Backend (WSL): Ubuntu/WSL, Postgres 16@5433 with PostGIS, `API_BASE_URL=http://127.0.0.1:3000` for smokes
- Repo root: `/mnt/d/uprise_mob` (WSL), `D:\uprise_mob` (Windows)

Pre‑requisites
- Android SDK build tools 33.0.2; JDK 11; Node 20.19.x; Yarn 1.x
- AVD running (API 33 x86_64)
- If backend is available, health at `http://127.0.0.1:3000/health`

Artifacts
- All logs under `artifacts/logs/` with stable names:
  - `api_health.txt`, `postgis_check.txt`, `migration_guard.txt`, `phase2_smoke.txt`,
  - `routing_spec.txt`, `routing_code_check.txt`, `install_logcat_filtered.txt`

Test Cases (Happy Path)
1) Mobile build + clean install + launch (Windows)
   - Cmd: `yarn mobile:debug`
   - Pass: APK installs successfully; app launches

2) Login → Home Scene Creation (Windows)
   - Tap “Sign In”; verify with quick smoke:
   - Cmd: `docs\scripts\windows\smoke_login_verify.ps1 -Device $env:UPRISE_ADB_DEVICE -WaitSeconds 30`
   - Pass: logcat shows `AUTH RES … status: 200` and UI dump contains header `Community`

3) Onboarding (Windows)
   - Select required sub‑genre (typeahead) and city/state (typeahead/GPS optional)
   - Pass: app persists `community_key={city}-{state}-{subGenreId}`; next screen reflects selection

4) Discovery/Radio carry `community_key` (Windows)
   - With `__DEV__` logs enabled, trigger discovery/radio
   - Pass: requests include `community_key`; responses echo `community_key`

5) WSL – API Health (optional if backend up)
   - Cmd: `yarn wsl:smokes`, `yarn wsl:phase2-smoke`
   - Pass: health OK, PostGIS reports version, migration status reported

6) Post‑Login Routing (spec vs code)
   - Spec: `docs/PHASE2_EXECUTION_PLAN.md` → “Post‑Login Routing (Authoritative)”
   - Code: `src/state/sagas/login/login.saga.js` navigates to `CommunitySetup`
   - Pass: no discrepancy

Negative / Edge
- API unreachable: `api_health.txt` shows failure; mobile should still render login with no crash
- DB unavailable: scripts emit errors; no destructive steps run

Execution Flow (Orchestrated)
- Phase A (Windows/mobile):
  - `set $env:UPRISE_ADB_DEVICE` → `yarn mobile:debug` → `yarn handoff:win:done`
- Phase B (WSL/Codex):
  - `yarn wsl:smokes` → `yarn wsl:phase2-smoke` → `yarn handoff:wsl:done`
- Phase C (Windows/mobile):
  - `smoke_login_verify.ps1` → `yarn handoff:win:done`

Acceptance Summary
- Build & smoke PASS; artifacts saved
- Login routes to `CommunitySetup`; onboarding 97‑genre taxonomy visible; home scene set
- Discovery/Radio requests include `community_key` and responses echo it
- WSL smokes: API health (if up), PostGIS version reported, migrations status emitted

Logging
- Append a 12–15 line entry to `docs/Session-Logs/CODEX-PHASE2-INTAKE-REPORT.md` with UTC timestamp, results, artifacts, and next steps


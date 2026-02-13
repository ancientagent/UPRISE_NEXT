# Phase 2 Orchestration (Mobile ↔ Codex/WSL)

Purpose
- Define a simple, reliable handoff loop between the Windows/mobile executor and the Ubuntu/WSL (Codex) executor.
- Make post‑login outcome explicit: after login, route to Home Scene Creation (`CommunitySetup`).

Event Bus (repo‑local)
- File: `docs/handoff/events.jsonl`
- Append one JSON per event: `{ "from":"mobile-win|codex-wsl", "to":"codex-wsl|mobile-win", "kind":"started|done|blocked", "msg":"...", "time":"<UTC ISO>" }`
- Watchers:
  - Windows: `yarn handoff:watch`
  - WSL: `tail -n 50 -f /mnt/d/uprise_mob/docs/handoff/events.jsonl`

Ready‑to‑run Signals
- Windows → Codex/WSL: `yarn handoff:win:done`
- Codex/WSL → Windows: `yarn handoff:wsl:done`

Phases (minimal happy‑path)
1) Mobile build + clean install + launch (Windows)
   - `set UPRISE_ADB_DEVICE`, then `yarn mobile:debug`
   - Handoff: `yarn handoff:win:done`
2) Backend/API smokes (Codex/WSL)
   - `yarn wsl:smokes` (health, PostGIS, migrations)
   - `yarn wsl:phase2-smoke` (API contract; optional if API up)
   - Handoff: `yarn handoff:wsl:done`
3) Mobile login smoke (Windows)
   - `docs/scripts/windows/smoke_login_verify.ps1 -Device $env:UPRISE_ADB_DEVICE -WaitSeconds 30`
   - Expect: login 200 + UI header “Community” (Home Scene Creation)
   - Handoff: `yarn handoff:win:done`
4) Doc summary (either side)
   - Append a 12–15 line entry to `docs/Session-Logs/CODEX-PHASE2-INTAKE-REPORT.md`

Authoritative Routing
- After successful login, route to Home Scene Creation (`CommunitySetup`) unless explicitly bypassed in debug.
- Dashboard appears only after onboarding completes and a community exists.


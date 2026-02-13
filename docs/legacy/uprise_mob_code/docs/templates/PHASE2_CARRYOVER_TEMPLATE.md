# 🧠 UPRISE Phase 2 Carryover Template

## Roles
- **Ubuntu Executor ("Codex")**: Backend, Postgres, API integration, migrations, backend smokes.
- **Windows Executor ("Mobile Agent")**: React Native 0.66.x, Gradle/Android SDK, Node builds, CI parity.
- **PM (Strategy Steward)**: Phase alignment, task assignment, guardrails.

## Phase Anchor (single source of truth)
- `docs/PHASE2_EXECUTION_PLAN.md`
- Always verify this file exists and is current before starting any work.

## Working roots
- **Windows**: `D:\uprise_mob`
- **WSL/Ubuntu**: `/mnt/d/uprise_mob`
- **Docs**: `<root>/docs`
- **Artifacts**: `<root>/artifacts/{debug,release,logs}`

## Pinned toolchains and paths (authoritative)
- **React Native**: 0.66.4
- **Gradle Wrapper**: 7.0.2; Android Gradle Plugin (AGP): 7.0.4
- **Android SDK**: `%LOCALAPPDATA%\Android\Sdk`
- **Android compileSdkVersion/targetSdkVersion**: 33; buildToolsVersion: 33.0.2
- **Emulator baseline**: API 30+ (prefer API 33); x86_64 AVD for local
- **Java**: JDK 11 (Temurin) on developer machines; JDK 17 in CI only
- **Node**: 20.19.0 portable at `C:\tools\node-v20.19.0-win-x64`; Yarn v1.x
- **local.properties**: sdk.dir uses forward slashes (e.g., `C:/Users/<user>/AppData/Local/Android/Sdk`)

## Environment guardrails
- No admin privileges, no symlinks, no registry edits.
- PowerShell 7 (pwsh) only on Windows; avoid long one-liners to bypass PSReadLine issues.
- WSL Ubuntu: Postgres 16 @ 5433; extensions: postgis, uuid-ossp, pgcrypto; scripts `docs/scripts/*.sh` must be idempotent/non-destructive.

## Kickoff checklist (every session)
1) Confirm `docs/PHASE2_EXECUTION_PLAN.md` (phase scope) and restate role split.
2) Load SYSTEM_OVERVIEW + params fragment if applicable.
3) Run smokes (debug/release + DB) and save artifacts to `artifacts/logs`.
4) Verify DB extensions and migrations (`psql_postgis_check.sh`, `migration_guard.sh`).
5) Restate next 2–3 deliverables with acceptance criteria.
6) Update `docs/CHANGELOG.md` with outcomes.

## Logging and artifacts convention
- Always capture stdout+stderr and use UTF-8:
  - PowerShell: `command *> artifacts\logs\<name>.log` or `2>&1 | Tee-Object -File artifacts\logs\<name>.log`
  - apkanalyzer/aapt outputs saved to `artifacts\logs\*.txt`
- Keep log filenames stable per workflow: `yarn_install*.log`, `gradle_*.log`, `adb_install*.txt`, `apkanalyzer_manifest.txt`, `aapt_xmltree.txt`, `install_logcat_filtered.txt`.

## Do/When/How Rules
- Use community helpers for geo: `src/contracts/community.buildGeoGenreParams`
- UI may show "Community"; code keeps "station" alias until migration completes.
- Run smokes regularly (Debug and Release) and save artifacts with exact paths.
- If blocked >30 minutes: write a 3-line status and blocking point in CHANGELOG; propose next step.
- Prefer short commands or dedicated scripts over long inline one‑liners (PSReadLine rendering can corrupt).
- Align SDKs before install:
  - compile/target 33, buildTools 33.0.2; verify manifest with apkanalyzer before adb install.
  - Verify JS bundle present for Release: `aapt list … | Select-String "index.android.bundle"`.
- No secrets in repo; respect .env protocol.

## Agent HQ usage
- `docs/agent HQ`: at sprint start, select 3–5 agents with clear fit; document selections and any conversions in CHANGELOG.
- If an agent requires conversion, note scope, time-box to 30 minutes, and fall back if not productive.

## References
- `docs/PHASE2_EXECUTION_PLAN.md`
- `docs/Knowledge-Base/UPRISE_CONTEXT_FOR_SPRINTS.md`
- `docs/Knowledge-Base/FIREBASE_MIGRATION_ONBOARDING.md`
- `docs/Knowledge-Base/ARTIST_ONBOARDING_FLOW.md`
- `docs/july-model/JULY_BUILD_POSTMORTEM.md`
- `docs/INDEX.md` (navigation)
- `docs/CHANGELOG.md` (current state)

## Sprint scaffolding
- **Branch**: `<area>/P2-S0X-<slug>`
- **Commit prefix**: `[P2-S0X]`
- **PR title**: `[P2-S0X] <objective>`

## Debug and Release flows (Windows)
- **Debug**: `yarn install`; start Metro; `android\gradlew.bat :app:assembleDebug`; install; capture short logcat.
- **Release**: `yarn bundle:android`; `android\gradlew.bat clean :app:assembleRelease`; `apkanalyzer manifest print app-release.apk`; install; verify embedded bundle; capture logcat; ensure no Metro references.
- **Manifest verification before install**:
  - `apkanalyzer manifest print … > artifacts\logs\apkanalyzer_manifest.txt`
  - `aapt dump xmltree … AndroidManifest.xml > artifacts\logs\aapt_xmltree.txt`

## What "Done" means for Phase 2 (task-level acceptance)
- Build & smoke PASS; artifacts saved with standard names/paths.
- Release logs show no fatal runtime and no Metro references.
- Requests include community_key when available.
- Post-login routing: user is taken directly to Home Scene Creation (`CommunitySetup`). Onboarding shows 97‑genre taxonomy; user completes home scene. Dashboard is only shown after onboarding/home scene is set.
- Docs updated (CHANGELOG + any runbook/KB touched).

## Post-Login Routing (Authoritative)
- After successful login (200), the app must navigate to `CommunitySetup`.
- Do not route to Dashboard on login. Dashboard appears only after onboarding/home scene creation completes.
- Smokes should validate: login → `CommunitySetup`, genre and city/state pickers appear, and `community_key` persists.

## Status update format (when blocked or switching)
- One sentence on what just happened.
- One sentence on what's next (or blocker).
- Link or path to artifacts/logs involved.

## CI Integration
If running in CI, use `.github/workflows/android-test-release.yml` as reference, capture artifact URLs, and log them in CHANGELOG.

## Database smoke acceptance
Done = `\dx` output includes postgis, uuid-ossp, pgcrypto; `npx sequelize-cli db:migrate` exits 0.

## Blocker escalation
If blocked >30m and no solution: log status in CHANGELOG, then request PM decision (don't keep hacking).

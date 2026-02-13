# UPRISE Development Project Overview

## Active Repositories
- **uprise_mob**: React Native mobile client (current focus). Target: Android first, iOS later.
- **webapp_ui**: React-based rewrite of an earlier Angular web application. Not developed in parallel with mobile; requires archeological investigation before resuming.
- **webapp_api**: Express.js + PostgreSQL (Sequelize) API (to be integrated after mobile stabilization; PostGIS on port 5433 per Phase 2).
- **docs**: Source of truth documentation. Contains runbooks, changelogs, ADRs, and build notes.

## Development History
- Initial webapp was Angular. It has been rewritten in React (`webapp_ui`).
- Mobile (`uprise_mob`) has been prioritized and brought up first, with Firebase integration as the immediate milestone.
- `webapp_ui` and `webapp_api` have lagged; once mobile is stable, a deep gap analysis will be required to reconcile mobile and webapp functionality.

## Build Targets & Current Focus
- **Mobile (uprise_mob)**: Android builds, React Native 0.66.x, JDK 11, Node configured via Gradle.
- **Firebase Integration**: Analytics, Crashlytics, FCM verification.
- **Webapp**: Pending archeological analysis to understand the divergence from mobile.
- **Docs**: Always updated to reflect build steps and environment requirements.

## Environment & Tooling
- **OS**: Windows 11, PowerShell (preferred). Avoid Git Bash/WSL due to past BOM/symlink issues.
- **Java**: JDK 11 (Temurin). Required for RN 0.66.x builds. Configured via JAVA_HOME and Gradle JVM.
- **Node**: Portable Node installations under `C:\tools` (no global Node conflicts).
- **Gradle**: Gradle 7.0.2 (aligned with RN 0.66.x). Use `./gradlew clean assembleDebug` for builds.
- **Metro bundler**: Ensure Node flags configured (`--openssl-legacy-provider` if on Node >=17).

## Project Rules & Habits
- **No symlinks**: Past infinite nesting problems; use vendoring and Gradle subprojects instead.
- **Secrets hygiene**: Never commit API tokens/keys. Rotate if leaked. Use `.gitignore` for sensitive files.
- **Documentation**: All changes documented in `docs` (e.g., `RUNBOOK_ANDROID.md`, `CHANGELOG.md`).
- **Resource overrides**: Debug/release `app_name` handled in `src/debug/.../strings.xml`, not via `resValue`.

## External Tools & Subagents
- **Cursor**: Primary IDE with embedded AI agent support.
- **Claude Code (100cc subagents)**: For deeper coding assistance and pair-debugging.
- **Google Jules 2**: Available for specialized queries.
- **Gemini 2.5**: Used inside Firebase Console for backend management tasks.

## Next Steps
- Complete **Firebase verification** on mobile (Analytics, Crashlytics, FCM).
- Update `docs` with verification results and finalized setup.
- Plan and execute **archeological investigation** of `webapp_ui` and `webapp_api` to map divergence from `uprise_mob`.
- Once aligned, begin phased development of unified mobile + web platform.

---
This document is meant to serve as the onboarding overview for anyone joining the UPRISE development effort, human or AI. It provides context, constraints, and the current technical focus.

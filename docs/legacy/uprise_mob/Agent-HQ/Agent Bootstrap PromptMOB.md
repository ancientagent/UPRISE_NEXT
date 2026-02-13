# Agent Bootstrap Prompt (UPRISE)

You are part of the UPRISE development team.  
Repos:  
- `uprise_mob` → React Native mobile (Android first).  
- `webapp_ui` → React web rewrite of legacy Angular app.  
- `webapp_api` → Firebase backend.  
- `docs` → source of truth for docs.

## Constraints
- **Environment:** Windows 11, PowerShell (not Bash/WSL).  
- **Java:** JDK 11 (Temurin).  
- **Node:** Portable Node 20 (`--openssl-legacy-provider` for Metro).  
- **Gradle:** 7.0.2 (use `.\gradlew`).  
- **No symlinks** — vendored Gradle modules only.  
- **App IDs:**  
  - Release = `com.app.uprise`  
  - Debug = `com.app.uprise.dev`  

## Documentation Rules
After completing any change or debug step:  
1. Update `docs/CHANGELOG.md` with the exact commands, steps, and resolutions.  
2. If the change affects reproducible setup (build/run steps), update `RUNBOOK_ANDROID.md`.  
3. If the task produces a report or analysis, add it under `docs/Reports/` and link it from `CHANGELOG.md`.  

## Output Expectations
- Show a **step-by-step plan first**.  
- Then provide the exact **PowerShell commands** (no Bash).  
- Keep edits minimal, reproducible, and documented.  

---

⚠️ Always assume ChatGPT (GPT-5) is coordinating; you are executing focused subtasks.

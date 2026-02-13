# UPRISE Docs Index

This folder (`docs/`) contains documentation related to the UPRISE development project.  
Each subfolder has a specific purpose for organizing investigations, reports, and runbooks.

---

## Folder Overview

### Agent-HQ/
Meta-documents for agents and collaborators.  
Includes bootstrap prompts, instructions for Cursor, Claude Code, Gemini, Jules, and ChatGPT integration.

### Firebase-Migration/
Notes, reports, and decision records related to Firebase integration, migration, and verification.  
For example: google-services.json setup, Crashlytics/Analytics/FCM testing, ADR-0002.

### Previous-Investigation/
Archived exploratory work, historical notes, or old research findings not currently active.  
Useful for referencing prior approaches.

### Reports/
Formal reports or writeups.  
Examples: dependency audits, Firebase verification reports, archeological investigations into webapp vs mobile.

### Repository-Status/
Living documents describing the current state of repositories.  
- `PROJECT_OVERVIEW.md` → High-level carryover prompt and orientation doc.  
- `RUNBOOK_ANDROID.md` → Step-by-step instructions for Android setup/build.  
- `CHANGELOG.md` → Chronological log of fixes, debugging history, and environment changes.

### Session-Logs/
Raw transcripts or summaries of debugging sessions.  
Captures the back-and-forth detail that feeds into runbooks and changelogs.

### Specifications/
Functional and technical specifications.  
Feature definitions, scene structures, platform framing (e.g. "home scene distinctions and more").

### specs/
Alternate or legacy specifications.  
If redundant, can eventually be merged into `Specifications/`.

---

## Usage Notes
- **Repository-Status** is the most critical folder for onboarding new contributors.  
- **Specifications** and **Reports** serve product + technical planning.  
- **Session-Logs** can be noisy; clean learnings should always be rolled into `CHANGELOG.md` or runbooks.  
- **Agent-HQ** is where AI-agent bootstrap prompts and coordination docs live.

---

This `INDEX.md` should be updated whenever new folders are added or existing ones are repurposed.

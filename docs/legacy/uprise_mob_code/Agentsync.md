# CLAUDE Configuration for UPRISE Mobile App

## Repository Information
- **Name**: UPRISE Mobile App
- **Repository**: https://github.com/ancientagent/uprise_mob.git
- **Default Branch**: main
- **Technology Stack**: React Native 0.66.4, Android, Gradle 7.0.2, JDK 11

## CCPM Framework Integration
This repository uses the CCPM (Claude Project Management) framework for structured AI agent collaboration.

### Quick Setup Commands
```bash
# One-time initialization
/pm:init

# Create and manage epics
/pm:prd-new <name> → /pm:prd-parse <name> → /pm:epic-oneshot <name>

# Manage individual work
/pm:issue-start <id> → /pm:issue-sync <id> → /pm:next
```

## Critical Guardrails

### Permissions & Security
**ALL WORK MUST OPERATE IN NON-ADMIN POWERSHELL, USE USER-WRITABLE PATHS, NO SYMLINKS, NO GLOBAL INSTALLS, NO REGISTRY EDITS.**

If a step would require elevation or machine-global state, **STOP** and propose a CI-based alternative.

### Build Environment
- **Gradle**: 7.0.2 (enforced for RN 0.66 compatibility)
- **JDK**: 11 (Temurin/Eclipse Adoptium)
- **Android SDK**: User-local installation only
- **Node.js**: 18+ with legacy OpenSSL support

### CI/CD Requirements
- All builds must work in GitHub Actions CI environment
- No local-only dependencies or configurations
- Use secrets for sensitive data (Firebase, keystores)
- Maintain reproducible builds

## Documentation Update Rule
**ALL CHANGES MUST UPDATE `docs/CHANGELOG.md`** with:
- Date and time of change
- Description of what was changed
- Impact on build process or development workflow
- Any new commands or procedures added

## Project Structure
```
.claude/           # CCPM framework files
├── config/        # Configuration files
├── workflows/     # Workflow definitions
└── prompts/       # Agent prompts

docs/              # Project documentation
├── CHANGELOG.md   # Change tracking (MUST UPDATE)
├── runbooks/      # Runbooks (Android/Web/Backend)
└── Agent-HQ/      # AI agent documentation
    └── CCPM-Usage.md   # Command reference
```

## Current Status
- **Branch**: android/first-launch-hermes-disable-trackplayer
- **Track-Player**: Temporarily disabled (TEMP DISABLE markers)
- **CI Pipeline**: Operational with Android debug builds
- **Metro**: Requires legacy OpenSSL support

## Next Steps
1. ✅ Complete CCPM framework setup
2. ✅ Android CI reliability fixes completed (stale cmdline-tools resolved)
3. Create webapp integration epic using CCPM workflow
4. Re-enable track-player with proper fallbacks
5. Begin React Native app development phase

## Jules Rules Integration
- Always verify current state before making changes
- Use command-line tools for definitive verification
- Follow top-down debugging approach for system issues
- Document all changes in appropriate files

## CCPM SUB-AGENT USAGE

### USE SUB-AGENTS FOR CONTEXT OPTIMIZATION

#### 1. Always use the file-analyzer sub-agent when asked to read files.
The file-analyzer agent is an expert in extracting and summarizing critical information from files, particularly log files and verbose outputs. It provides concise, actionable summaries that preserve essential information while dramatically reducing context usage.

#### 2. Always use the code-analyzer sub-agent when asked to search code, analyze code, research bugs, or trace logic flow.
The code-analyzer agent is an expert in code analysis, logic tracing, and vulnerability detection. It provides concise, actionable summaries that preserve essential information while dramatically reducing context usage.

#### 3. Always use the test-runner sub-agent to run tests and analyze the test results.
Using the test-runner agent ensures:
- Full test output is captured for debugging
- Main conversation stays clean and focused
- Context usage is optimized
- All issues are properly surfaced
- No approval dialogs interrupt the workflow

## ABSOLUTE DEVELOPMENT RULES

- **NO PARTIAL IMPLEMENTATION** - Complete all features fully
- **NO SIMPLIFICATION** - No "simplified for now" comments
- **NO CODE DUPLICATION** - Check existing codebase first, reuse functions
- **NO DEAD CODE** - Either use or delete completely
- **IMPLEMENT TEST FOR EVERY FUNCTION** - No exceptions
- **NO CHEATER TESTS** - Tests must be accurate, reflect real usage, reveal flaws
- **NO INCONSISTENT NAMING** - Follow existing codebase patterns
- **NO OVER-ENGINEERING** - Simple functions over complex abstractions
- **NO MIXED CONCERNS** - Proper separation of validation, API, database, UI
- **NO RESOURCE LEAKS** - Close connections, clear timeouts, remove listeners

## Philosophy

### Error Handling
- **Fail fast** for critical configuration (missing text model)
- **Log and continue** for optional features (extraction model)  
- **Graceful degradation** when external services unavailable
- **User-friendly messages** through resilience layer

### Testing
- Always use the test-runner agent to execute tests
- Do not use mock services for anything ever
- Do not move on to the next test until the current test is complete
- If test fails, check test structure before refactoring codebase
- Tests to be verbose for debugging purposes

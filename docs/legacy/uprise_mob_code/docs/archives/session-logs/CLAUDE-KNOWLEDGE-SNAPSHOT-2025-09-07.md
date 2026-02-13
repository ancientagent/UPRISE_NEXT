# CLAUDE KNOWLEDGE SNAPSHOT - September 7, 2025

Note: CCPM and `.claude` paths mentioned below are deprecated and not part of the current Phase 2 strategy. Use docs/specs/*, docs/reference/architecture/SYSTEM_OVERVIEW.md, and docs/overview/PHASE2_EXECUTION_PLAN.md as the single source of truth.

## 🏗️ PROJECT OVERVIEW

**UPRISE Mobile App Development Session**
- **Date**: September 7, 2025
- **Focus**: Architectural fixes before webapp development
- **Status**: Foundation stabilization phase

## 📁 REPOSITORY STRUCTURE

### **Complete Ecosystem Paths:**
- **Mobile App**: `/mnt/d/uprise_mob/` (React Native 0.66.4)
- **WebApp API**: `/mnt/d/webapp_api/` (Node.js/Express + PostgreSQL) 
- **WebApp UI**: `/mnt/d/webapp_ui/` (React frontend)
- **API Backup**: `/mnt/d/webapp_api_backup/` (Backup copy)

### **Documentation Structure (Current):**
- **Architecture**: `docs/reference/architecture/SYSTEM_OVERVIEW.md`
- **Specs**: `docs/specs/03..09_*.md`
- **Execution Plan**: `docs/overview/PHASE2_EXECUTION_PLAN.md`

## 🚨 CRITICAL ARCHITECTURAL ISSUES IDENTIFIED

### **1. Location Filtering Database Bug** 🔥
**STATUS**: Critical - Users see global content instead of local communities
- **Problem**: Home feed endpoint (`/home/feed`) missing location filtering
- **Impact**: Core user experience broken
- **Files**: `webapp_api/src/routes/home.js` (lines 68-220)
- **Solution**: Add `UserStationPrefrences` filtering to queries

### **2. Genre System Update** 🎯
**STATUS**: Mobile app using outdated genre list
- **Current**: 23 basic genres via `/auth/genres`
- **Should Be**: 97 hierarchical genres via `/onboarding/all-genres`
- **Future**: 200 genre list mentioned for later
- **Files**: Mobile app `GenreSelection.js`, `getUserGenres.service.js`

### **3. Artist/Band Unification** 🔄
**STATUS**: Backend complete, Frontend needs verification/completion
- **Backend**: ✅ `ArtistProfiles` table migrated (48 records)
- **Frontend**: ⚠️ Documentation claims complete, needs verification
- **Mobile Impact**: Still using legacy band endpoints instead of artist profile

### **4. Stations vs Community Architecture** 📚
**STATUS**: Working but confusing documentation
- **Issue**: "Stations" used to mean geographic communities
- **Reality**: 3-tier system (CITYWIDE/STATEWIDE/NATIONAL) works correctly
- **Need**: Clear documentation to prevent developer confusion

## 📱 MOBILE APP CURRENT STATE

### **Build Status:**
- ✅ **Metro Bundler**: Starts successfully with legacy OpenSSL support
- ❌ **TrackPlayer**: Missing `react-native-track-player` dependency
- ⚠️ **App Progress**: Stops at title screen (likely due to audio player initialization failure)
- ✅ **Android Emulator**: Ready for testing

### **Feature Implementation Status:**
| Feature Category | Completeness | Status |
|------------------|-------------|---------|
| Authentication | 95% | ✅ Complete |
| User Profiles | 90% | ✅ Nearly Complete |
| Music Playback | 60% | ⚠️ TrackPlayer Missing |
| Social Features | 85% | ✅ Strong |
| Discovery | 80% | ✅ Good |
| Events | 90% | ✅ Strong |
| Search | 30% | ❌ Missing |
| Upload/Creation | 20% | ❌ Missing |

### **Key Missing Dependencies:**
- `react-native-track-player` (causing startup failure)
- Comprehensive search functionality
- Song upload system

## 💾 BACKEND STATUS

### **PostgreSQL:**
- ✅ **Running**: User confirmed PostgreSQL is operational
- ✅ **Schema**: Existing schema with location/genre data
- ✅ **API Endpoints**: 200+ endpoints documented
- ⚠️ **Location Filtering**: Critical bug needs immediate fix

### **Hybrid Architecture Recommended:**
- **PostgreSQL**: Core business logic, complex queries, geospatial data
- **Firebase**: Real-time features, file storage, push notifications
- **Reason**: Best of both worlds approach based on system requirements analysis

## 🧠 SPECIALIZED AGENTS AVAILABLE

### **Agent Categories (10 total, 100+ agents):**
1. **Core Development** (9 agents) - frontend-developer, mobile-developer, etc.
2. **Language Specialists** (15+ agents) - react-specialist, typescript-pro, etc.
3. **Infrastructure** (12 agents) - postgres-pro, database-administrator, etc.
4. **Quality & Security** (12 agents) - debugger, error-detective, etc.
5. **Data & AI** (12 agents) - data-engineer, database-optimizer, etc.
6. **Developer Experience** (9 agents) - refactoring-specialist, etc.
7. **Specialized Domains** (10 agents) - mobile-app-developer, etc.
8. **Business & Product** (10 agents) - product-manager, etc.
9. **Meta & Orchestration** (8 agents) - multi-agent-coordinator, etc.
10. **Research & Analysis** (6 agents) - research-analyst, etc.

## 📋 CURRENT DEVELOPMENT STRATEGY

### **Decided Approach:**
1. **Foundation First**: Stabilize mobile app before architectural changes
2. **Systematic Fixes**: Follow docs/overview/PHASE2_EXECUTION_PLAN.md and checklists in docs/operations/
3. **Separate Repos**: Abandoned monorepo attempt, working with 3 separate repositories
4. **Agent-Assisted**: Leverage specialized agents for each domain

### **Immediate Priorities:**
1. **Fix TrackPlayer Dependency**: Resolve startup issue
2. **Location Filtering Bug**: Critical UX fix in backend
3. **Genre System Update**: Mobile app to use 97-genre system
4. **Artist Unification**: Complete/verify frontend implementation

## 🔧 TECHNICAL CONSTRAINTS

### **Environment Requirements:**
- **Windows 11 + PowerShell** (non-admin, user-writable paths only)
- **JDK 11** (Temurin) for React Native 0.66 compatibility
- **Gradle 7.0.2** enforced for build stability
- **Node 18+** with legacy OpenSSL support for Metro bundler

### **Security Guardrails:**
- No symlinks, global installs, or registry edits
- CI-based alternatives for elevated operations
- User-local installations only

## 📖 DOCUMENTATION STATUS

### **Comprehensive Documentation Available:**
- **9 UPRISE System Specifications** (Authentication, Community, Fair Play, etc.)
- **27 Previous Investigation Reports** (Debugging sessions, fixes)
- **WebApp Analysis** (Gap analysis, API/UI audits)
- **Mobile Build Reports** (3 build iterations)
- **Architecture Decisions** (Hybrid PostgreSQL + Firebase approach)

### **Key Insights from Documentation:**
- Previous clone attempt failed (dead end after extensive work)
- WebApp serves as blueprint for mobile feature parity
- Firebase project file missing (original architecture)
- Current backend is Node.js/Express + PostgreSQL + AWS S3

## ⏳ NEXT STEPS PLANNED

### **Phase 1: Foundation Stabilization**
1. Fix TrackPlayer dependency issue
2. Diagnose title screen startup failure
3. Connect mobile app to PostgreSQL backend
4. Basic functionality testing

### **Phase 2: Critical Architectural Fixes**
1. Location filtering database bug (Priority 1)
2. Genre system update (23 → 97 genres)
3. Artist/band unification frontend completion
4. Documentation cleanup

### **Phase 3: Feature Development**
1. Re-enable full audio functionality
2. Implement song upload system
3. Build comprehensive search
4. WebApp integration planning

## 🎯 SUCCESS METRICS

### **Immediate Goals:**
- ✅ Mobile app launches past title screen
- ✅ Basic navigation functional
- ✅ API connectivity established
- ✅ Core features operational

### **Short-term Goals:**
- ✅ Location-based content filtering works
- ✅ Modern genre system implemented
- ✅ Artist profile system unified
- ✅ Audio playback restored

## 🤖 AUTOMATION READINESS

### **Automation Ready (No CCPM):**
- Use CI workflows and checklists for predictable execution
- Reference curl/psql hooks defined in docs/overview/PHASE2_EXECUTION_PLAN.md

### **Development Efficiency:**
- **Context Optimization**: File-analyzer and code-analyzer for large file analysis
- **Parallel Processing**: Multiple agents can work simultaneously
- **Progress Tracking**: TodoWrite for task management
- **Quality Assurance**: Built-in code review and testing agents

---

**END OF SNAPSHOT - READY FOR PM MASTER PROMPT INTEGRATION**

*This snapshot captures complete current knowledge state for seamless handoff and continuity.*

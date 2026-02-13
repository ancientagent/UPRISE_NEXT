# 🎯 UPRISE Platform - Source of Truth Document

**Created**: September 7, 2025  
**Purpose**: Centralized reference for platform architecture, implementation status, and development roadmap  
**Status**: Living document - update as implementation progresses

---

## 📚 Documentation Map

### Core Architecture Documents
- **System Overview**: `docs/reference/architecture/SYSTEM_OVERVIEW.md`
- **Phase 2 Overview**: `docs/overview/PHASE2_OVERVIEW.md`
- **Ops & Guardrails**: `docs/operations/CI_WORKFLOWS.md`, `docs/operations/CHECKLISTS.md`

### Feature Specifications (docs/specs)
- **Authentication**: `docs/specs/03_AUTHENTICATION.md`
- **Communities**: `docs/specs/04_COMMUNITY_LOCATION.md`
- **Fair Play**: `docs/specs/05_FAIR_PLAY_ALGO.md`
- **Songs**: `docs/specs/06_SONG_MANAGEMENT.md`
- **Discovery**: `docs/specs/07_DISCOVERY_MAP.md`
- **Events**: `docs/specs/08_EVENTS.md`
- **Promotions**: `docs/specs/09_PROMOTIONS_BUSINESS.md`

### Implementation Status
- **Current Progress**: `docs/overview/PROJECT_OVERVIEW.md`
- **Change Log**: `docs/overview/CHANGELOG.md`
- **Android Runbook**: `docs/guides/runbooks/android.md`

### Previous Investigations
- **API Audit**: `docs/archives/july-model/COMPREHENSIVE-API-ENDPOINT-AUDIT.md`
- **Artist Unification**: `docs/reference/architecture/SYSTEM_OVERVIEW.md` (Phase 2: July Model Consolidation)
- **Home Scene Fix**: `docs/archives/legacy-project-narrative/uprise_community_location_system_detailed.md`
- **Genre System**: `docs/specs/07_DISCOVERY_MAP.md`

---

## 🏗️ Platform Architecture

### Core Concept
**UPRISE is a democratic music discovery platform where local communities curate content through Fair Play voting**

### Key Principles
1. **Equal Opportunity**: Every song gets initial exposure via Fair Play Algorithm
2. **Community-Driven**: Local communities (City + State + Genre) control content
3. **Geographic Integrity**: GPS verification ensures local-only influence
4. **Tier Progression**: Songs advance citywide → statewide → national based on votes

---

## 🔧 System Components & Status

### 1. Authentication System
**Status**: ✅ 95% Complete  
**Documentation**: `03_UPRISE_Authentication_System.md`

#### Designed Features
- 8 user roles with specific permissions
- JWT-based authentication
- Role-based access control
- Subscription management

#### Current Implementation
- ✅ Login/Signup with JWT
- ✅ Basic roles (Artist, Listener, Admin)
- ❌ Missing roles (Venue, Promoter, Merchant, Mixologist, Ambassador)
- ❌ Subscription tiers not implemented

#### Known Issues & Solutions
- **Issue**: 85+ undefined environment variables
- **Solution**: See `docs/archives/july-model/COMPREHENSIVE-API-ENDPOINT-AUDIT.md`
- **Fix Applied**: `.env` file updated with all variables

---

### 2. Community & Location System
**Status**: ⚠️ 40% Complete  
**Documentation**: `04_UPRISE_Community_Location_System.md`

#### Designed Features
- Geographic + Genre communities (e.g., "Austin, Texas Hip Hop")
- GPS-verified home scene assignment
- Activity scoring and health metrics
- Community statistics and leaderboards

#### Current Implementation
- ✅ Basic city/state storage
- ✅ Genre selection (97 genres)
- ❌ No geographic boundaries
- ❌ No GPS verification
- ❌ No activity scoring

#### Critical Gap
**Problem**: System using genre-only communities instead of City+State+Genre  
**Impact**: Core value proposition broken  
**Solution Required**: Refactor UserStationPreferences to include location

---

### 3. Fair Play Algorithm & RaDIYo
**Status**: ❌ 0% Complete (CRITICAL MISSING FEATURE)  
**Documentation**: `05_UPRISE_Fair_Play_Algorithm.md`

#### Designed Features
- Two-phase priority system (time-based → community-based)
- Democratic voting for tier progression
- 15% repeat rate safeguards
- Personalized rotation based on engagement

#### Current Implementation
- ❌ No Fair Play Algorithm in codebase
- ❌ No priority calculation
- ❌ No tier progression logic
- ❌ No voting verification

#### Implementation Plan
1. Build `SongPriorityService` class
2. Implement time-based priority calculator
3. Add community-based priority after threshold
4. Create rotation engine with safeguards

---

### 4. Song Management
**Status**: ✅ 60% Complete  
**Documentation**: `06_UPRISE_Song_Management_System.md`

#### Designed Features
- Professional audio processing pipeline
- Automatic community assignment
- Fair Play integration
- 3-song artist limit in rotation

#### Current Implementation
- ✅ Basic song upload
- ✅ Song storage in S3
- ⚠️ Processing pipeline partial
- ❌ No Fair Play integration
- ❌ No rotation limits

#### Known Issues
- **TrackPlayer**: Missing dependency causing app crash
- **Solution**: Install react-native-track-player

---

### 5. Discovery Map System
**Status**: ❌ 10% Complete  
**Documentation**: `07_UPRISE_Discovery_Map_System.md`

#### Designed Features
- Interactive map with community flags
- Visual activity indicators
- Flag encoding (size, color, animation)
- Statistics panels

#### Current Implementation
- ✅ Basic discovery endpoints
- ❌ No map interface
- ❌ No community visualization
- ❌ No activity tracking

---

## 🚨 Critical Issues & Solutions

### Priority 1: Fair Play Algorithm Missing
**Impact**: Core platform value proposition broken  
**Solution**: Implement from scratch using `05_UPRISE_Fair_Play_Algorithm.md`  
**Effort**: 2-3 weeks  

### Priority 2: Location Filtering Bug
**Impact**: Users see global content instead of local  
**Location**: `webapp_api/src/routes/home.js` lines 68-220  
**Solution**: Add UserStationPreferences filtering  
**Effort**: 2-3 days  

### Priority 3: Genre System Outdated
**Impact**: Limited genre selection  
**Current**: 23 genres via `/auth/genres`  
**Target**: 97 genres via `/onboarding/all-genres`  
**Solution**: Update mobile app service calls  
**Effort**: 1 day  

### Priority 4: Artist/Band Unification
**Impact**: Frontend/backend mismatch  
**Status**: Backend complete, frontend needs update  
**Solution**: See `docs/reference/architecture/SYSTEM_OVERVIEW.md` (Phase 2 Consolidation)
**Effort**: 3-4 days  

---

## 📊 Complete Implementation Status

### webapp_ui (React Frontend)
**Technology**: React 19, TypeScript, Vite, Tailwind CSS

#### ✅ Implemented Features
- Authentication (login/signup/logout)
- Artist dashboard with song uploads
- Event management (create/edit/delete)
- Basic admin functionality
- Song playback interface

#### ❌ Missing Features  
- Discovery map system
- Fair Play voting interface
- Community features
- Real-time notifications
- Mobile-responsive design
- User profile management

#### 🚨 Critical Issues
- Client secret exposed in frontend bundle
- No environment variable management
- Missing TypeScript definitions
- No testing framework

### webapp_api (Express Backend)
**Technology**: Express.js, PostgreSQL, Sequelize, AWS S3

#### ✅ Implemented Features
- Complete authentication system
- User management (CRUD)
- Song upload/storage (S3)
- Event management
- Admin functionality
- Database migrations (57 total)

#### ❌ Missing Features
- Fair Play Algorithm (CRITICAL)
- Community/location services
- Real-time features (WebSocket)
- Push notifications
- Analytics/statistics
- Tier progression system

#### 🚨 Critical Issues
- Authentication bypass vulnerabilities
- SQL injection risks
- No rate limiting
- Improper error handling

### uprise_mob (React Native)
**Technology**: React Native 0.66.4, Redux

#### ✅ Implemented Features
- Authentication flow
- Genre selection (97 genres)
- Basic navigation
- Home feed structure

#### ❌ Missing Features
- TrackPlayer integration (BLOCKING)
- Fair Play interface
- GPS/location verification
- Community features
- Real-time player

#### 🚨 Critical Issues
- App crashes at startup (TrackPlayer)
- Outdated React Native version
- Missing dependencies

---

## 🗺️ Development Roadmap

### Phase 1: Foundation Stabilization (Week 1-2)
- [ ] Fix TrackPlayer dependency - **See**: `RUNBOOK_ANDROID.md`
- [ ] Implement Fair Play core - **See**: `05_UPRISE_Fair_Play_Algorithm.md`
- [ ] Fix location filtering - **See**: `docs/archives/legacy-project-narrative/uprise_community_location_system_detailed.md`
- [ ] Update genre system - **See**: `docs/specs/07_DISCOVERY_MAP.md`

### Phase 2: Core Features (Week 3-6)
- [ ] Complete Community System - **See**: `04_UPRISE_Community_Location_System.md`
- [ ] Add GPS verification - **See**: `UPRISE_community_location_system_detailed.md`
- [ ] Build tier progression - **See**: `05_UPRISE_Fair_Play_Algorithm.md`
- [ ] Implement Discovery Map - **See**: `07_UPRISE_Discovery_Map_System.md`

### Phase 3: Feature Completion (Week 7-10)
- [ ] Events System - **See**: `08_UPRISE_Events_System.md`
- [ ] Promotions - **See**: `09_UPRISE_Promotions_Business.md`
- [ ] Advanced roles - **See**: `03_UPRISE_Authentication_System.md`
- [ ] Analytics dashboards - **See**: Statistics endpoints in API audit

### Phase 4: Enhancement (Future)
- [ ] Phase 2 Features - **See**: `docs/archives/legacy-project-narrative/10_UPRISE_Phase2_Features.md`
- [ ] WebApp Integration - **See**: `docs/reports/webapp/Jules-webapp-api-report/`
- [ ] Performance optimization
- [ ] Advanced analytics

---

## 🔗 Repository Structure

### Active Repositories
- **Mobile App**: `/mnt/d/uprise_mob` (React Native 0.66.4)
- **Backend API**: `/mnt/d/webapp_api` (Express + PostgreSQL + Sequelize)
- **Frontend Web**: `/mnt/d/webapp_ui` (React 19 + TypeScript + Vite)

### Database
- **PostgreSQL 16**: Port 5433
- **Connection**: `postgres://uprise:Loca$h2682@127.0.0.1:5433/uprise_dev`
- **PostGIS**: Enabled for geography support

### CI/CD
- **GitHub Actions**: `.github/workflows/android-debug-build.yml`
- **Branch**: `fix/ci-stability-and-config`
- **Artifacts**: Debug + Release APKs

---

## 📋 Quick Reference

### Environment Setup
1. PostgreSQL connection: See `docs/automation/scripts/psql_postgis_check.sh`
2. Environment variables: See `docs/archives/july-model/COMPREHENSIVE-API-ENDPOINT-AUDIT.md`
3. Android build: See `RUNBOOK_ANDROID.md`

### Common Tasks
- **Run migrations**: `yarn db:migrate`
- **Start API**: `yarn start` (in webapp_api)
- **Build Android**: See CI workflow or `RUNBOOK_ANDROID.md`

### Key Files to Monitor
- `docs/overview/CHANGELOG.md` - All changes
- `docs/overview/PROJECT_OVERVIEW.md` - Current status
- `src/routes/home.js` - Location filtering bug
- `src/services/fairPlay/` - Fair Play implementation (TO BE CREATED)

---

## ⚠️ Critical Issues Identified

### Security Vulnerabilities (URGENT)
1. **webapp_ui**: Client secret exposed in frontend bundle - immediate security risk
2. **webapp_api**: Authentication bypasses and SQL injection vulnerabilities
3. **Environment**: Improper secrets management across all repos

### Core Missing Features
4. **Fair Play Algorithm**: Completely missing - core platform value proposition broken
5. **Discovery System**: Map view and community visualization not implemented
6. **Community Features**: Geographic boundaries and GPS verification missing
7. **Integration**: No mobile-webapp connection or real-time sync

### Technical Debt
8. **webapp_ui**: Missing TypeScript definitions, no testing framework
9. **Mobile App**: React Native 0.66.4 outdated, TrackPlayer dependency missing
10. **CI/CD**: Only mobile has automated builds, webapp repos have no CI/CD

---

**Last Updated**: September 7, 2025  
**Next Review**: After Phase 1 completion

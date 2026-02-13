# UPRISE Subagent Shortlist & Task Mapping

**Generated**: 2025-09-01 20:15 UTC  
**Context**: Android CI + React Native 0.66.4 + Multi-repo architecture  
**Priority**: CI hardening, Android emulator management, Firebase integration, repo archaeology

## Top 10 Subagents for UPRISE (Refined)

### 1. **devops-engineer** 
**Path**: `categories/03-infrastructure/devops-engineer.md`  
**Where to use**: CI/CD pipeline optimization, infrastructure automation, team collaboration  
**3 Concrete Tasks This Week**:
- Optimize GitHub Actions workflows for Android builds (reduce build time from 15min to <10min)
- Implement comprehensive monitoring for CI pipeline health and artifact tracking
- Set up automated rollback procedures for failed deployments and build artifacts

**Risk Notes**: ✅ Safe - focuses on process optimization, no code generation

---

### 2. **deployment-engineer**
**Path**: `categories/03-infrastructure/deployment-engineer.md`  
**Where to use**: CI/CD pipeline design, release automation, artifact management  
**3 Concrete Tasks This Week**:
- Design blue-green deployment strategy for Android APK releases
- Implement automated artifact promotion from debug to release channels
- Create comprehensive rollback procedures for CI pipeline failures

**Risk Notes**: ✅ Safe - deployment automation, no code modification

---

### 3. **build-engineer**
**Path**: `categories/06-developer-experience/build-engineer.md`  
**Where to use**: Gradle optimization, build caching, compilation speed  
**3 Concrete Tasks This Week**:
- Optimize Gradle build configuration for faster Android builds
- Implement distributed caching for CI builds to reduce build times
- Set up build performance monitoring and regression detection

**Risk Notes**: ✅ Safe - build system optimization, no app code changes

---

### 4. **security-auditor**
**Path**: `categories/04-quality-security/security-auditor.md`  
**Where to use**: Security scanning, compliance validation, vulnerability assessment  
**3 Concrete Tasks This Week**:
- Implement automated security scanning for Android APKs and dependencies
- Set up secret scanning for CI/CD pipelines and repository monitoring
- Create security compliance checklist for Android app store submissions

**Risk Notes**: ✅ Safe - security assessment only, no code modification

---

### 5. **documentation-engineer**
**Path**: `categories/06-developer-experience/documentation-engineer.md`  
**Where to use**: Technical documentation, API docs, developer guides  
**3 Concrete Tasks This Week**:
- Automate CHANGELOG.md updates from CI run results and metrics
- Create comprehensive Android build and deployment documentation
- Set up automated API documentation generation for webapp_api endpoints

**Risk Notes**: ✅ Safe - documentation only, no code changes

---

### 6. **research-analyst**
**Path**: `categories/10-research-analysis/research-analyst.md`  
**Where to use**: Repo archaeology, dependency analysis, technology research  
**3 Concrete Tasks This Week**:
- Conduct comprehensive analysis of webapp_ui and webapp_api repositories
- Research Firebase integration strategies for React Native 0.66.4
- Generate dependency graphs and architecture documentation for all repos

**Risk Notes**: ✅ Safe - research and analysis only, no code modification

---

### 7. **tooling-engineer**
**Path**: `categories/06-developer-experience/tooling-engineer.md`  
**Where to use**: Developer tool creation, CLI development, productivity enhancement  
**3 Concrete Tasks This Week**:
- Create automated tools for CI artifact analysis and reporting
- Build CLI utilities for local Android development and testing
- Develop custom scripts for multi-repo dependency management

**Risk Notes**: ✅ Safe - tool creation only, no application code changes

---

### 8. **qa-expert**
**Path**: `categories/04-quality-security/qa-expert.md`  
**Where to use**: Test strategy, quality assurance, CI testing integration  
**3 Concrete Tasks This Week**:
- Design comprehensive test strategy for Android CI smoke tests
- Implement automated quality gates for APK validation and testing
- Set up test automation framework for multi-repo integration testing

**Risk Notes**: ✅ Safe - testing and quality assurance, no code modification

---

### 9. **multi-agent-coordinator**
**Path**: `categories/09-meta-orchestration/multi-agent-coordinator.md`  
**Where to use**: Agent coordination, workflow orchestration, team management  
**3 Concrete Tasks This Week**:
- Orchestrate coordination between CI, documentation, and research agents
- Design workflow patterns for multi-agent collaboration on UPRISE tasks
- Implement communication protocols for agent handoffs and task distribution

**Risk Notes**: ✅ Safe - coordination and orchestration only, no code changes

---

### 10. **refactoring-specialist**
**Path**: `categories/06-developer-experience/refactoring-specialist.md`  
**Where to use**: Code quality improvement, technical debt reduction, safe refactoring  
**3 Concrete Tasks This Week**:
- Analyze code quality across all UPRISE repositories and identify improvement opportunities
- Create refactoring roadmap for React Native 0.66.4 modernization
- Implement automated code quality monitoring and technical debt tracking

**Risk Notes**: ⚠️ Moderate - may suggest code changes, requires careful review

---

## Task Assignment Strategy

### **CI-Android Team** (devops-engineer + deployment-engineer + build-engineer)
- **Own**: Ubuntu smoke tests, watchdogs, artifact schema, concurrency optimization
- **Focus**: CI pipeline hardening, build performance, deployment automation

### **Research & Archaeology Team** (research-analyst + tooling-engineer)
- **Own**: webapp_ui/webapp_api analysis, dependency graphs, Firebase research, custom tools
- **Focus**: Repository archaeology, technology research, developer tooling

### **Security & Quality Team** (security-auditor + qa-expert)
- **Own**: Security scanning, quality gates, test strategy, compliance validation
- **Focus**: Security hardening, quality assurance, testing automation

### **Documentation & Coordination Team** (documentation-engineer + multi-agent-coordinator)
- **Own**: Auto-append RUN_ID/TTJS/sizes to CHANGELOG/RUNBOOK, agent coordination
- **Focus**: Documentation automation, agent orchestration, workflow management

### **Code Quality Team** (refactoring-specialist)
- **Own**: Code quality analysis, technical debt tracking, refactoring roadmap
- **Focus**: Technical debt reduction, code quality improvement, modernization planning

## Risk Assessment

### **Do-Not-Use-Yet** (High Risk)
- **mobile-developer**: May change app functionality, needs careful review
- **legacy-modernizer**: May modify core application code, requires extensive testing

### **Use with Caution** (Moderate Risk)
- **refactoring-specialist**: May suggest code changes, needs review
- **tooling-engineer**: May create tools that modify build processes, requires validation

### **Safe to Use** (Low Risk)
- **devops-engineer**: Process optimization only
- **deployment-engineer**: Deployment automation only
- **build-engineer**: Build system optimization only
- **security-auditor**: Security assessment only
- **documentation-engineer**: Documentation only
- **research-analyst**: Research and analysis only
- **qa-expert**: Testing and quality assurance only
- **multi-agent-coordinator**: Coordination and orchestration only

## Implementation Priority

1. **Week 1**: Start with safe agents (devops-engineer, documentation-engineer, research-analyst, qa-expert)
2. **Week 2**: Add coordination and build optimization (multi-agent-coordinator, build-engineer, deployment-engineer)
3. **Week 3**: Add security and tooling (security-auditor, tooling-engineer)
4. **Week 4**: Evaluate moderate risk agents (refactoring-specialist) with limited scope

## Success Metrics

- **CI Build Time**: Reduce from 15min to <10min
- **Smoke Test Reliability**: >95% success rate
- **Documentation Coverage**: 100% API endpoints documented
- **Security Compliance**: Zero critical vulnerabilities
- **Dependency Health**: <30 days update lag
- **Team Productivity**: 25% reduction in manual tasks

---

*This shortlist is tailored specifically for UPRISE's current priorities: Android CI hardening, React Native 0.66.4 maintenance, and multi-repo architecture management.*

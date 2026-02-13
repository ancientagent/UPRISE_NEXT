# CI Pipeline Changes

## Checklist

### **CI Pipeline Requirements**
- [ ] **r8 sdkmanager path**: Uses cmdline-tools r8 (8092744) for SDK XML v2 compatibility
- [ ] **build-tools=31.0.0 only**: No other build-tools versions specified in workflow
- [ ] **emulator package installed**: API 30 google_apis x86_64 package confirmed
- [ ] **ADB serial pinned + known ports**: ADB hygiene and connection stability measures
- [ ] **watchdogs present**: Timeout and retry logic for all long-running operations
- [ ] **Ubuntu smoke uploads summary.json**: Required gate with comprehensive metrics
- [ ] **macOS job continue-on-error=true**: If present, must not block main pipeline

### **Quality Gates**
- [ ] **APK signing verification**: Release APK properly signed and verifiable
- [ ] **Size limits respected**: Debug <120MB, Release <80MB (soft limits)
- [ ] **SDK validation**: minSdk=21, targetSdk=31 extraction and verification
- [ ] **TTJS performance**: Time-to-first-ReactNativeJS measurement included

### **Documentation**
- [ ] **CHANGELOG.md updated**: Entry added with date, description, and impact
- [ ] **RUNBOOK_ANDROID.md updated**: Relevant sections updated if applicable
- [ ] **Agent playbook compliance**: Changes align with allowed scopes

### **Testing**
- [ ] **CI pipeline tested**: Changes validated in GitHub Actions environment
- [ ] **Smoke test passes**: Ubuntu smoke test completes successfully
- [ ] **Artifacts generated**: Both debug and release APKs created and uploaded
- [ ] **Performance impact**: No degradation in build times or resource usage

## Description

<!-- Describe the CI pipeline changes being made -->

## Impact

<!-- Describe the expected impact on build performance, reliability, or functionality -->

## Testing

<!-- Describe how these changes were tested -->

## Related Issues

<!-- Link to any related GitHub issues or discussions -->

---

**Note**: This PR template ensures all CI pipeline changes meet UPRISE's quality standards and maintain system reliability.

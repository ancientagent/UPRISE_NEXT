# CI Monitoring & Validation Layer

## Overview
This is a **non-invasive monitoring layer** that adds diagnostics and validation to the Android CI/CD workflow without changing core logic or breaking existing functionality.

## Key Features

### 🛡️ Safety First
- All monitoring functions use `|| true` to prevent failures
- No changes to existing workflow logic
- Purely additive - can be removed without impact
- Graceful degradation if monitoring fails

### 📊 What It Monitors

1. **System Resources**
   - CPU, memory, disk usage at job start
   - Resource tracking during critical operations
   - Process monitoring for emulator and builds

2. **SDK Validation**
   - Verifies Android SDK installation
   - Checks for required tools (adb, emulator, aapt)
   - Validates build-tools and system images

3. **APK Validation**  
   - File existence and size checks
   - MD5 checksums for integrity
   - Basic structure validation with aapt

4. **Emulator Boot Progress**
   - Tracks boot stages with timestamps
   - Monitors state changes
   - Provides detailed boot logs

5. **Failure Diagnostics**
   - Captures system state on failures
   - Collects recent logcat output
   - Saves process lists and resource usage

## Output Locations

All monitoring data is saved to `artifacts/monitoring/`:

```
artifacts/monitoring/
├── initial_state.txt         # System state at job start
├── sdk_validation.txt        # SDK validation results
├── apk_validation_debug.txt  # Debug APK validation
├── apk_validation_release.txt # Release APK validation  
├── emulator_boot.log         # Emulator boot progress
├── resources_*.log           # Resource usage logs
├── summary.txt               # Final summary report
└── failures/                 # Failure diagnostics
    └── [context]_[timestamp]/
        ├── system_state.txt
        ├── adb_devices.txt
        └── logcat_tail.txt
```

## How to Use

### Reading the Summary
The monitoring summary is displayed in the CI logs and saved to `artifacts/monitoring/summary.txt`. It shows:
- Validation results (✓ passed, ⚠ warning, ✗ failed)
- APK checksums and sizes
- Emulator boot time
- Count of detected issues

### Investigating Failures
1. Check the **Monitoring Summary** in the CI logs
2. Download the `smoke-ubuntu` or `smoke-macos` artifacts
3. Look in `artifacts/monitoring/failures/` for detailed diagnostics
4. Review specific validation files for warnings

### Common Issues Detected

| Issue | Where to Look | What It Means |
|-------|--------------|---------------|
| SDK not found | `sdk_validation.txt` | Android SDK setup failed |
| APK missing | `apk_validation_*.txt` | Build artifacts not downloaded |
| Emulator timeout | `emulator_boot.log` | Emulator failed to start |
| Resource exhaustion | `resources_*.log` | Out of memory/CPU |

## Disabling Monitoring

To temporarily disable monitoring (if it causes issues):

1. **Disable all monitoring**: Comment out the "Initialize CI Monitoring" steps
2. **Disable specific checks**: Comment out individual validation steps
3. **Keep logs only**: The functions already use `|| true` so they won't fail

## Future Improvements

Once the workflow is stable, this monitoring can help:
1. Identify patterns in failures
2. Optimize resource usage
3. Set up alerts for recurring issues
4. Create performance baselines

## Technical Details

### Why Non-Invasive?
- Uses `|| true` on all commands to prevent failures
- Sources functions with `|| true` to handle missing files
- Runs validation in separate steps from core logic
- Background monitoring doesn't block main execution

### Resource Impact
- Minimal CPU overhead (< 1%)
- Small disk usage (< 10MB typically)
- No impact on build times
- No network calls

### Compatibility
- Works with bash 4.0+
- Compatible with Ubuntu and macOS runners
- No external dependencies
- Uses only standard Unix tools

## Maintenance

The monitoring layer is defined in:
- `.github/workflows/monitoring-functions.sh` - Core functions
- `.github/workflows/android-debug-build.yml` - Integration points

To update monitoring without affecting the build:
1. Edit `monitoring-functions.sh`
2. Test locally with `source monitoring-functions.sh`
3. Functions are loaded fresh each run

## Support

This monitoring layer helps diagnose issues without causing them. If you see warnings in the monitoring output, they indicate potential problems but won't fail the build.

For questions or improvements, refer to the inline documentation in `monitoring-functions.sh`.
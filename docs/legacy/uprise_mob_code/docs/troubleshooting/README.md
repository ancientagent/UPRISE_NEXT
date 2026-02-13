# Troubleshooting Guides

This directory contains detailed troubleshooting documentation for common UPRISE development issues.

## Critical Issues

### [NODE_OPTIONS & ENV Issues](NODE_OPTIONS_AND_ENV_ISSUES.md) 🚨
**Must read if experiencing:**
- DeepAgent "hall of mirrors" (20+ processes)
- Metro bundler not starting or spawning duplicates
- Jest process explosions
- Environment variables not being picked up by the app
- Any Node-based tool spawning excessive processes

**Fixed:** 2025-10-01 - Global NODE_OPTIONS removed from shell config

---

## Quick Diagnostics

### Check for NODE_OPTIONS issues:
```bash
# WSL/Linux:
echo $NODE_OPTIONS
# Should be empty

# PowerShell:
echo $env:NODE_OPTIONS
# Should be empty
```

If not empty, see [NODE_OPTIONS guide](NODE_OPTIONS_AND_ENV_ISSUES.md).

### Check for zombie Metro processes:
```bash
# WSL/Linux:
ps aux | grep metro | grep -v grep

# PowerShell:
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

If you see multiple Metro or excessive node processes (>5), kill them and investigate NODE_OPTIONS.

### Verify ENV vars are loaded:
```bash
# After building and installing APK, check app logs:
adb logcat -s ReactNativeJS:* | grep -i "api_base_url\|config"
```

If Config values are undefined, you need to rebuild (see [Metro ENV pickup guide](NODE_OPTIONS_AND_ENV_ISSUES.md#metro-not-picking-up-env-files)).

---

## Related Documentation

- [Android Runbook](../guides/runbooks/android.md) - Build and deployment procedures
- [CHANGELOG](../overview/CHANGELOG.md) - History of fixes and issues
- [PHASE2_EXECUTION_PLAN](../overview/PHASE2_EXECUTION_PLAN.md) - Development roadmap

---

## Contributing

When documenting new issues:
1. Create a new `.md` file in this directory
2. Use clear headings: "The Problem", "Root Cause", "Solution", "Verification"
3. Include code examples and command output
4. Link to related docs
5. Update this README with a link to your guide
6. Add an entry to CHANGELOG.md

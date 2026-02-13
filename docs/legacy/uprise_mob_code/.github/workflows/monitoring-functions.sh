#!/bin/bash
# Non-invasive monitoring and validation functions for Android CI/CD
# These functions add diagnostics without changing core workflow logic

# Color codes for better visibility in CI logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize monitoring (call at start of each job)
init_monitoring() {
    echo -e "${BLUE}=== Initializing CI Monitoring ===${NC}"
    
    # Create monitoring directory
    mkdir -p artifacts/monitoring
    
    # Capture initial system state
    {
        echo "=== System Information ==="
        echo "Date: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        echo "Runner: ${RUNNER_NAME:-unknown}"
        echo "OS: ${RUNNER_OS:-unknown}"
        echo "Workflow: ${GITHUB_WORKFLOW:-unknown}"
        echo "Job: ${GITHUB_JOB:-unknown}"
        echo "Run ID: ${GITHUB_RUN_ID:-unknown}"
        echo ""
        
        echo "=== Resource Status ==="
        echo "CPU Cores: $(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 'unknown')"
        echo "Memory Total: $(free -h 2>/dev/null | grep '^Mem:' | awk '{print $2}' || echo 'unknown')"
        echo "Disk Space:"
        df -h . 2>/dev/null || echo "unknown"
        echo ""
        
        echo "=== Environment Variables ==="
        env | grep -E '^(ANDROID|JAVA|NODE|PATH)' | sort
    } > artifacts/monitoring/initial_state.txt 2>&1
    
    echo -e "${GREEN}✓ Monitoring initialized${NC}"
}

# Validate SDK installation (non-blocking)
validate_sdk_setup() {
    local status=0
    echo -e "${BLUE}=== Validating Android SDK ===${NC}"
    
    {
        echo "=== SDK Validation Report ==="
        echo "Timestamp: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        echo ""
        
        # Check ANDROID_SDK_ROOT
        if [ -z "${ANDROID_SDK_ROOT:-}" ]; then
            echo "⚠ WARNING: ANDROID_SDK_ROOT not set"
            status=1
        else
            echo "✓ ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT"
            if [ ! -d "$ANDROID_SDK_ROOT" ]; then
                echo "⚠ WARNING: ANDROID_SDK_ROOT directory does not exist"
                status=1
            fi
        fi
        
        # Check critical tools
        echo ""
        echo "=== Tool Availability ==="
        
        # Check adb
        if command -v adb >/dev/null 2>&1; then
            echo "✓ adb: $(adb --version 2>&1 | head -1)"
        else
            echo "⚠ WARNING: adb not found in PATH"
            status=1
        fi
        
        # Check emulator
        if command -v emulator >/dev/null 2>&1; then
            echo "✓ emulator: $(emulator -version 2>&1 | head -1)"
        else
            echo "⚠ WARNING: emulator not found in PATH"
            status=1
        fi
        
        # Check build-tools
        if [ -d "${ANDROID_SDK_ROOT}/build-tools" ]; then
            echo "✓ build-tools directory exists"
            ls -la "${ANDROID_SDK_ROOT}/build-tools/" 2>/dev/null | head -5
        else
            echo "⚠ WARNING: build-tools directory not found"
            status=1
        fi
        
        # Check system images
        if [ -d "${ANDROID_SDK_ROOT}/system-images" ]; then
            echo "✓ system-images directory exists"
            find "${ANDROID_SDK_ROOT}/system-images" -type d -maxdepth 3 2>/dev/null | head -10
        else
            echo "⚠ WARNING: system-images directory not found"
        fi
        
    } > artifacts/monitoring/sdk_validation.txt 2>&1
    
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✓ SDK validation passed${NC}"
    else
        echo -e "${YELLOW}⚠ SDK validation found issues (see artifacts/monitoring/sdk_validation.txt)${NC}"
    fi
    
    # Non-blocking - always return success
    return 0
}

# Monitor emulator boot progress
monitor_emulator_boot() {
    local timeout=${1:-900}  # Default 15 minutes
    local start_time=$SECONDS
    
    echo -e "${BLUE}=== Monitoring Emulator Boot ===${NC}"
    
    {
        echo "=== Emulator Boot Monitor ==="
        echo "Start time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        echo "Timeout: ${timeout}s"
        echo ""
        
        # Check every 10 seconds and log progress
        local last_check=""
        while [ $((SECONDS - start_time)) -lt $timeout ]; do
            local elapsed=$((SECONDS - start_time))
            
            # Check device state
            local device_state=$(adb devices 2>/dev/null | grep emulator | awk '{print $2}')
            local boot_completed=$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')
            local boot_anim=$(adb shell getprop init.svc.bootanim 2>/dev/null | tr -d '\r')
            
            local current_check="${device_state}-${boot_completed}-${boot_anim}"
            
            # Only log if state changed
            if [ "$current_check" != "$last_check" ]; then
                echo "[${elapsed}s] State: device=$device_state, boot_completed=$boot_completed, bootanim=$boot_anim"
                last_check="$current_check"
            fi
            
            # Success condition
            if [ "$device_state" = "device" ] && [ "$boot_completed" = "1" ]; then
                echo ""
                echo "✓ Emulator booted successfully after ${elapsed}s"
                return 0
            fi
            
            sleep 10
        done
        
        echo ""
        echo "✗ Emulator boot timeout after ${timeout}s"
        
    } > artifacts/monitoring/emulator_boot.log 2>&1 &
    
    echo -e "${GREEN}✓ Boot monitoring started (background)${NC}"
}

# Validate APK before testing
validate_apk() {
    local apk_path="$1"
    local apk_type="${2:-unknown}"
    
    echo -e "${BLUE}=== Validating ${apk_type} APK ===${NC}"
    
    if [ ! -f "$apk_path" ]; then
        echo -e "${RED}✗ APK not found: $apk_path${NC}"
        return 1
    fi
    
    {
        echo "=== APK Validation: $apk_type ==="
        echo "Path: $apk_path"
        echo "Size: $(ls -lh "$apk_path" 2>/dev/null | awk '{print $5}')"
        echo "MD5: $(md5sum "$apk_path" 2>/dev/null | awk '{print $1}')"
        echo ""
        
        # Basic structure check with aapt
        if command -v aapt >/dev/null 2>&1; then
            echo "=== APK Structure Check ==="
            aapt dump badging "$apk_path" 2>&1 | head -20
        else
            echo "⚠ aapt not available for structure validation"
        fi
        
    } > "artifacts/monitoring/apk_validation_${apk_type}.txt" 2>&1
    
    echo -e "${GREEN}✓ APK validation completed${NC}"
    return 0
}

# Capture diagnostic data on failure
capture_failure_diagnostics() {
    local failure_context="${1:-unknown}"
    
    echo -e "${YELLOW}=== Capturing Failure Diagnostics ===${NC}"
    
    mkdir -p artifacts/monitoring/failures
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local diag_dir="artifacts/monitoring/failures/${failure_context}_${timestamp}"
    mkdir -p "$diag_dir"
    
    {
        echo "=== Failure Diagnostics ==="
        echo "Context: $failure_context"
        echo "Timestamp: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        echo ""
        
        echo "=== System Resources ==="
        free -h 2>/dev/null || echo "Memory info not available"
        echo ""
        df -h . 2>/dev/null || echo "Disk info not available"
        echo ""
        
        echo "=== Process List ==="
        ps aux 2>/dev/null | grep -E '(emulator|adb|gradle|node)' | head -20
        echo ""
        
        echo "=== Recent System Messages ==="
        dmesg 2>/dev/null | tail -50 || echo "dmesg not available"
        
    } > "$diag_dir/system_state.txt" 2>&1
    
    # Capture ADB state if available
    if command -v adb >/dev/null 2>&1; then
        adb devices > "$diag_dir/adb_devices.txt" 2>&1
        adb logcat -d -t 1000 > "$diag_dir/logcat_tail.txt" 2>&1 || true
    fi
    
    echo -e "${GREEN}✓ Diagnostics saved to $diag_dir${NC}"
}

# Monitor resource usage during critical operations
monitor_resources() {
    local operation="$1"
    local pid="${2:-}"
    
    echo -e "${BLUE}=== Monitoring Resources: $operation ===${NC}"
    
    {
        echo "=== Resource Monitor: $operation ==="
        echo "Start: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        
        # Monitor for up to 5 minutes, logging every 30 seconds
        for i in {1..10}; do
            echo ""
            echo "=== Check $i ($(date +%H:%M:%S)) ==="
            
            # Memory
            free -h 2>/dev/null | grep -E '^(Mem|Swap)' || echo "Memory data unavailable"
            
            # CPU (top processes)
            echo "Top CPU consumers:"
            ps aux --sort=-%cpu 2>/dev/null | head -6 | awk '{printf "  %-20s %5s%%\n", $11, $3}'
            
            # Specific process if PID provided
            if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                echo "Target process ($pid):"
                ps -p "$pid" -o pid,vsz,rss,pcpu,pmem,cmd 2>/dev/null
            else
                [ -n "$pid" ] && echo "Target process ($pid) not running"
            fi
            
            sleep 30
        done
        
    } > "artifacts/monitoring/resources_${operation// /_}.log" 2>&1 &
    
    echo -e "${GREEN}✓ Resource monitoring started (background)${NC}"
}

# Summary report generator
generate_monitoring_summary() {
    echo -e "${BLUE}=== Generating Monitoring Summary ===${NC}"
    
    # Ensure monitoring directory exists
    mkdir -p artifacts/monitoring
    
    {
        echo "=== CI Monitoring Summary ==="
        echo "Generated: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        echo ""
        
        echo "=== Validation Results ==="
        if [ -f "artifacts/monitoring/sdk_validation.txt" ]; then
            grep -E '^(✓|⚠|✗)' artifacts/monitoring/sdk_validation.txt 2>/dev/null
        fi
        echo ""
        
        echo "=== APK Validations ==="
        timeout 30s find artifacts/monitoring -name "apk_validation_*.txt" -type f 2>/dev/null | while read -r apk_val; do
            if [ -f "$apk_val" ]; then
                echo "$(basename "$apk_val"):"
                timeout 10s grep -E '^(Size:|MD5:)' "$apk_val" 2>/dev/null || echo "  (data unavailable)"
            fi
        done || echo "APK validation data unavailable"
        echo ""
        
        echo "=== Emulator Boot ==="
        if [ -f "artifacts/monitoring/emulator_boot.log" ]; then
            timeout 10s tail -3 artifacts/monitoring/emulator_boot.log 2>/dev/null || echo "Boot log unavailable"
        else
            echo "No emulator boot log found"
        fi
        echo ""
        
        echo "=== Detected Issues ==="
        timeout 30s bash -c '
            find artifacts/monitoring -type f -name "*.txt" -o -name "*.log" 2>/dev/null | \
                xargs grep -l "WARNING\|ERROR\|FAIL" 2>/dev/null | while read -r file; do
                issue_count=$(grep -c "WARNING\|ERROR\|FAIL" "$file" 2>/dev/null || echo "?")
                echo "- $(basename "$file"): $issue_count issues"
            done
        ' 2>/dev/null || echo "Issue detection unavailable"
        
    } > artifacts/monitoring/summary.txt 2>&1
    
    # Display summary in CI log
    cat artifacts/monitoring/summary.txt
    
    echo -e "${GREEN}✓ Summary generated (artifacts/monitoring/summary.txt)${NC}"
}

# Export functions for use in workflow
export -f init_monitoring
export -f validate_sdk_setup
export -f monitor_emulator_boot
export -f validate_apk
export -f capture_failure_diagnostics
export -f monitor_resources
export -f generate_monitoring_summary
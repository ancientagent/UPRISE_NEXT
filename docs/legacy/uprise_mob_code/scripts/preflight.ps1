# Local Preflight Script
# Ensures clean debug build with guardrail compliance

$ErrorActionPreference = "Stop"

Write-Host "=== Local Preflight Check ===" -ForegroundColor Cyan
Write-Host ""

# Set NODE_OPTIONS for React Native 0.66.4 compatibility
$env:NODE_OPTIONS = "--openssl-legacy-provider"
Write-Host "Set NODE_OPTIONS=--openssl-legacy-provider" -ForegroundColor Green

# Change to android directory for Gradle commands
Set-Location android

Write-Host ""
Write-Host "Running Gradle clean..." -ForegroundColor Yellow
try {
    .\gradlew clean --no-daemon --stacktrace
    Write-Host "Clean completed successfully" -ForegroundColor Green
} catch {
    Write-Host "Clean failed: $_" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host ""
Write-Host "Building debug APK..." -ForegroundColor Yellow
try {
    .\gradlew :app:assembleDebug --no-daemon --stacktrace
    Write-Host "Debug build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "Debug build failed: $_" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Return to project root
Set-Location ..

Write-Host ""
Write-Host "=== Build Results ===" -ForegroundColor Cyan

# Find and display APK information
$debugApkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $debugApkPath) {
    $apkSize = (Get-Item $debugApkPath).Length
    $apkSizeMB = [math]::Round($apkSize / 1MB, 2)
    
    Write-Host "Debug APK Path: $debugApkPath" -ForegroundColor Green
    Write-Host "APK Size: $apkSizeMB MB ($apkSize bytes)" -ForegroundColor Green
    Write-Host "Preflight completed successfully" -ForegroundColor Green
    
    # Store results for changelog
    $preflightResults = @{
        "status" = "PASS"
        "apk_path" = $debugApkPath
        "apk_size_mb" = $apkSizeMB
        "apk_size_bytes" = $apkSize
        "timestamp" = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    
    # Save results to file for changelog update
    $resultsPath = "artifacts\local\preflight-results.json"
    $resultsDir = Split-Path $resultsPath -Parent
    if (-not (Test-Path $resultsDir)) {
        New-Item -ItemType Directory -Path $resultsDir -Force | Out-Null
    }
    $preflightResults | ConvertTo-Json | Set-Content $resultsPath
    
} else {
    Write-Host "Debug APK not found at expected location" -ForegroundColor Red
    Write-Host "Expected: $debugApkPath" -ForegroundColor Red
    
    # Store failure results
    $preflightResults = @{
        "status" = "FAIL"
        "error" = "APK not found at expected location"
        "timestamp" = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    
    $resultsPath = "artifacts\local\preflight-results.json"
    $resultsDir = Split-Path $resultsPath -Parent
    if (-not (Test-Path $resultsDir)) {
        New-Item -ItemType Directory -Path $resultsDir -Force | Out-Null
    }
    $preflightResults | ConvertTo-Json | Set-Content $resultsPath
    
    exit 1
}

Write-Host ""
Write-Host "=== Preflight Complete ===" -ForegroundColor Cyan
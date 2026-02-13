# Local Environment Check Script
# Verifies toolchain matches project guardrails

Write-Host "=== Local Environment Check ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "Node.js:" -ForegroundColor Yellow
try {
    $nodeVersion = & node --version
    Write-Host "  Version: $nodeVersion" -ForegroundColor Green
    if ($nodeVersion -match "v20\.19\.0") {
        Write-Host "  ✓ Correct version (v20.19.0)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Expected v20.19.0, got $nodeVersion" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Node.js not found in PATH" -ForegroundColor Red
}

Write-Host ""

# Check Java version
Write-Host "Java:" -ForegroundColor Yellow
try {
    $javaVersion = & java -version 2>&1 | Select-Object -First 1
    Write-Host "  Version: $javaVersion" -ForegroundColor Green
    if ($javaVersion -match "11\.0\.\d+") {
        Write-Host "  ✓ JDK 11 detected" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Expected JDK 11, got: $javaVersion" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Java not found in PATH" -ForegroundColor Red
}

Write-Host ""

# Check ANDROID_HOME
Write-Host "Android SDK:" -ForegroundColor Yellow
if ($env:ANDROID_HOME) {
    Write-Host "  ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Green
    if (Test-Path $env:ANDROID_HOME) {
        Write-Host "  ✓ Path exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Path does not exist" -ForegroundColor Red
    }
} else {
    Write-Host "  ✗ ANDROID_HOME not set" -ForegroundColor Red
}

Write-Host ""

# Check adb version
Write-Host "ADB:" -ForegroundColor Yellow
try {
    $adbVersion = & adb version 2>&1 | Select-Object -First 1
    Write-Host "  Version: $adbVersion" -ForegroundColor Green
    Write-Host "  ✓ ADB available" -ForegroundColor Green
} catch {
    Write-Host "  ✗ ADB not found in PATH" -ForegroundColor Red
}

Write-Host ""

# Check NPM script shell
Write-Host "NPM Configuration:" -ForegroundColor Yellow
try {
    $scriptShell = & npm config get script-shell
    Write-Host "  Script Shell: $scriptShell" -ForegroundColor Green
    if ($scriptShell -eq "powershell.exe") {
        Write-Host "  ✓ PowerShell configured" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Expected powershell.exe, got: $scriptShell" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ NPM config check failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Environment Check Complete ===" -ForegroundColor Cyan

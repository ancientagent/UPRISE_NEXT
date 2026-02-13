Write-Host "=== Android Development Environment Check ===" -ForegroundColor Cyan
Write-Host ""

# Check environment variables
Write-Host "Environment Variables:" -ForegroundColor Yellow
Write-Host "  ANDROID_HOME: $env:ANDROID_HOME"
Write-Host "  ANDROID_SDK_ROOT: $env:ANDROID_SDK_ROOT"
Write-Host "  ANDROID_AVD_HOME: $env:ANDROID_AVD_HOME"
Write-Host ""

# Check common SDK locations
$sdkPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:APPDATA\Android\Sdk",
    "C:\Android\Sdk",
    "$env:ProgramFiles\Android\android-sdk",
    "$env:ProgramFiles(x86)\Android\android-sdk"
)

Write-Host "Searching for Android SDK:" -ForegroundColor Yellow
$sdkFound = $false
foreach ($path in $sdkPaths) {
    if (Test-Path $path) {
        Write-Host "  ✓ Found SDK at: $path" -ForegroundColor Green
        $sdkFound = $true
        $env:ANDROID_SDK_ROOT = $path
        
        # Check SDK contents
        Write-Host ""
        Write-Host "SDK Components:" -ForegroundColor Yellow
        if (Test-Path "$path\platform-tools") {
            Write-Host "  ✓ platform-tools" -ForegroundColor Green
        } else {
            Write-Host "  ✗ platform-tools (missing)" -ForegroundColor Red
        }
        
        if (Test-Path "$path\emulator") {
            Write-Host "  ✓ emulator" -ForegroundColor Green
        } else {
            Write-Host "  ✗ emulator (missing)" -ForegroundColor Red
        }
        
        if (Test-Path "$path\build-tools") {
            Write-Host "  ✓ build-tools" -ForegroundColor Green
            $buildTools = Get-ChildItem "$path\build-tools" | Select-Object -Last 1
            Write-Host "    Latest: $($buildTools.Name)" -ForegroundColor Gray
        } else {
            Write-Host "  ✗ build-tools (missing)" -ForegroundColor Red
        }
        
        break
    }
}

if (-not $sdkFound) {
    Write-Host "  ✗ Android SDK not found in common locations" -ForegroundColor Red
    Write-Host ""
    Write-Host "To fix:" -ForegroundColor Yellow
    Write-Host "  1. Open Android Studio"
    Write-Host "  2. Go to File > Settings > Appearance & Behavior > System Settings > Android SDK"
    Write-Host "  3. Note the 'Android SDK Location' path"
    Write-Host "  4. Set environment variable: ANDROID_HOME = [that path]"
}

Write-Host ""

# Check for AVDs
Write-Host "Checking for Android Virtual Devices (AVDs):" -ForegroundColor Yellow
$avdPath = "$env:USERPROFILE\.android\avd"
if (Test-Path $avdPath) {
    $avds = Get-ChildItem "$avdPath\*.ini" -ErrorAction SilentlyContinue
    if ($avds) {
        Write-Host "  Found $($avds.Count) AVD(s):" -ForegroundColor Green
        foreach ($avd in $avds) {
            $name = [System.IO.Path]::GetFileNameWithoutExtension($avd.Name)
            Write-Host "    - $name" -ForegroundColor Gray
        }
    } else {
        Write-Host "  No AVDs found" -ForegroundColor Yellow
        Write-Host "  Create AVDs in Android Studio: Tools > AVD Manager" -ForegroundColor Gray
    }
} else {
    Write-Host "  AVD directory not found at: $avdPath" -ForegroundColor Red
}

Write-Host ""

# Check if ADB is accessible
Write-Host "Checking ADB availability:" -ForegroundColor Yellow
try {
    $adbVersion = & adb version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ ADB is accessible" -ForegroundColor Green
        Write-Host "    $($adbVersion[0])" -ForegroundColor Gray
    } else {
        throw "ADB not in PATH"
    }
} catch {
    Write-Host "  ✗ ADB not found in PATH" -ForegroundColor Red
    if ($sdkFound) {
        Write-Host "  Add to PATH: $env:ANDROID_SDK_ROOT\platform-tools" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Setup Instructions for Cursor AVD Manager Extension ===" -ForegroundColor Cyan
Write-Host "1. Ensure ANDROID_HOME or ANDROID_SDK_ROOT is set in system environment variables"
Write-Host "2. Restart Cursor after setting environment variables"
Write-Host "3. Open Command Palette (Ctrl+Shift+P) and search for 'AVD'"
Write-Host "4. If extension still doesn't work, check extension settings in Cursor"
Write-Host ""
Write-Host "Current recommended ANDROID_HOME value:" -ForegroundColor Yellow
if ($sdkFound) {
    Write-Host "  $env:ANDROID_SDK_ROOT" -ForegroundColor Green
} else {
    Write-Host "  Not detected - check Android Studio SDK location" -ForegroundColor Red
}
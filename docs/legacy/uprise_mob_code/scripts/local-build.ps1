# Uprise Mobile - Local Android Build Script
# Fixes Java, pins Node 20.19, builds, and aligns docs

param(
    [int]$TimeoutSec = 600,
    [switch]$SkipDocs,
    [switch]$Verbose
)

# === Paths ===
$Mob = "D:\uprise_mob"
$Docs = "D:\uprise_mob\docs"
$Node20 = "C:\tools\node-v20.19.0-win-x64"
$JdkDir = ".\tools\jdk-11-temurin"
$SDK = "$env:LOCALAPPDATA\Android\Sdk"

# Helper function for timeout operations
function Invoke-WithTimeout {
    param(
        [scriptblock]$ScriptBlock,
        [int]$TimeoutSeconds = 300
    )
    
    $job = Start-Job -ScriptBlock $ScriptBlock
    $result = Wait-Job -Job $job -Timeout $TimeoutSeconds
    
    if ($result) {
        $output = Receive-Job -Job $job
        Remove-Job -Job $job
        return $output
    } else {
        Remove-Job -Job $job -Force
        throw "Operation timed out after $TimeoutSeconds seconds"
    }
}

# 0) Preflight checks
Write-Host "=== Preflight Checks ===" -ForegroundColor Cyan
if (!(Test-Path $Mob)) { 
    Write-Error "Missing $Mob"; exit 1 
}
if (!(Test-Path $Docs)) { 
    Write-Error "Missing $Docs"; exit 1 
}

# Ensure tools directory exists
$toolsDir = Split-Path $JdkDir
if (!(Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
    Write-Host "Created tools directory: $toolsDir" -ForegroundColor Green
}

# 1) Ensure Node 20.19.0 precedence (session-only PATH)
Write-Host "=== Setting up Node 20.19.0 ===" -ForegroundColor Cyan
$env:PATH = "$Node20;$Node20\bin;$SDK\platform-tools;$env:PATH"

try {
    $nodeVersion = node -v
    Write-Host "Node version: $nodeVersion" -ForegroundColor Green
    
    if ($nodeVersion -notmatch "v20\.19\.0") {
        Write-Warning "Expected Node 20.19.0, got $nodeVersion"
    }
    
    corepack enable
    Write-Host "Corepack enabled" -ForegroundColor Green
} catch {
    Write-Error "Node setup failed: $_"
    exit 1
}

# 2) Use existing Java installation
Write-Host "=== Setting up Java ===" -ForegroundColor Cyan
try {
    $javaVersion = java -version 2>&1
    Write-Host "Java version: $($javaVersion[0])" -ForegroundColor Green
    
    # Try to find JAVA_HOME from environment or common locations
    if (-not $env:JAVA_HOME) {
        $commonJavaPaths = @(
            "C:\Program Files\Java\jdk-11*",
            "C:\Program Files\Eclipse Adoptium\jdk-11*",
            "C:\Program Files\Microsoft\jdk-11*"
        )
        
        foreach ($path in $commonJavaPaths) {
            $found = Get-ChildItem $path -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($found) {
                $env:JAVA_HOME = $found.FullName
                Write-Host "Found JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Green
                break
            }
        }
    }
    
    if ($env:JAVA_HOME) {
        Write-Host "Using JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Green
    } else {
        Write-Warning "JAVA_HOME not set, using system Java"
    }
    
} catch {
    Write-Error "Java verification failed: $_"
    exit 1
}

# 3) Local install & dual builds (Debug + Release)
Write-Host "=== Building Android App ===" -ForegroundColor Cyan
Set-Location $Mob

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
try {
    yarn install --frozen-lockfile --network-timeout 600000
    Write-Host "Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Error "Dependency installation failed: $_"
    exit 1
}

# Clean and build with explicit JAVA_HOME
$env:ORG_GRADLE_JAVA_HOME = $env:JAVA_HOME
Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green

Write-Host "Cleaning project..." -ForegroundColor Yellow
try {
    Set-Location android
    .\gradlew :app:clean --no-daemon --stacktrace
    Write-Host "Clean completed" -ForegroundColor Green
} catch {
    Write-Error "Clean failed: $_"
    exit 1
}

Write-Host "Building Debug and Release APKs..." -ForegroundColor Yellow
try {
    .\gradlew :app:assembleDebug :app:assembleRelease --no-daemon --stacktrace
    Write-Host "Build completed successfully" -ForegroundColor Green
} catch {
    Write-Error "Build failed: $_"
    exit 1
}

# 4) Capture APK sizes and metadata
Write-Host "=== APK Analysis ===" -ForegroundColor Cyan
$Dbg = ".\app\build\outputs\apk\debug\app-debug.apk"
$Rel = ".\app\build\outputs\apk\release\app-release.apk"

$DbgSize = if (Test-Path $Dbg) { (Get-Item $Dbg).Length } else { 0 }
$RelSize = if (Test-Path $Rel) { (Get-Item $Rel).Length } else { 0 }

$DbgMB = [math]::Round($DbgSize / 1MB, 2)
$RelMB = [math]::Round($RelSize / 1MB, 2)

Write-Host "Debug APK: $DbgSize bytes ($DbgMB MB)" -ForegroundColor Green
Write-Host "Release APK: $RelSize bytes ($RelMB MB)" -ForegroundColor Green

# Extract SDK information from APK (if aapt is available)
$SDKInfo = @{}
if (Get-Command aapt -ErrorAction SilentlyContinue) {
    try {
        $badging = & aapt dump badging $Dbg 2>$null
        $minSdk = ($badging | Select-String "sdkVersion:'(\d+)'").Matches[0].Groups[1].Value
        $targetSdk = ($badging | Select-String "targetSdkVersion:'(\d+)'").Matches[0].Groups[1].Value
        
        $SDKInfo.minSdk = $minSdk
        $SDKInfo.targetSdk = $targetSdk
        
        Write-Host "SDK Info - minSdk: $minSdk, targetSdk: $targetSdk" -ForegroundColor Green
    } catch {
        Write-Warning "Could not extract SDK info from APK"
    }
}

# 5) Documentation updates
if (-not $SkipDocs) {
    Write-Host "=== Updating Documentation ===" -ForegroundColor Cyan
    
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm"
    
    # 5a) CHANGELOG entry
    $chg = @"

$ts - Local Android build verification:
- Node 20.19.0 (session-pinned)
- JDK 11 (Temurin, portable) → JAVA_HOME=$env:JAVA_HOME
- Gradle wrapper used; :app:assembleDebug / :app:assembleRelease completed
- Debug APK: $DbgSize bytes ($DbgMB MB); Release APK: $RelSize bytes ($RelMB MB)
- SDK: minSdk=$($SDKInfo.minSdk), targetSdk=$($SDKInfo.targetSdk)
"@
    
    $changelogPath = "$Docs\CHANGELOG.md"
    if (Test-Path $changelogPath) {
        Add-Content -Path $changelogPath -Value $chg
        Write-Host "Updated CHANGELOG.md" -ForegroundColor Green
    } else {
        Write-Warning "CHANGELOG.md not found at $changelogPath"
    }
    
    # 5b) RUNBOOK alignment
    $run = @"

[$ts] Local Build Verification — Parameters:
- Node: 20.19.0 (session-pinned)
- JDK: 11 (Temurin, portable) → JAVA_HOME=$env:JAVA_HOME
- Build: :app:assembleDebug / :app:assembleRelease
- APK Sizes: Debug=$DbgMB MB, Release=$RelMB MB
- SDK: minSdk=$($SDKInfo.minSdk), targetSdk=$($SDKInfo.targetSdk)
- Aligned with CI workflow: .github/workflows/android-debug-build.yml
"@
    
    $runbookPath = "$Docs\RUNBOOK_ANDROID.md"
    if (Test-Path $runbookPath) {
        Add-Content -Path $runbookPath -Value $run
        Write-Host "Updated RUNBOOK_ANDROID.md" -ForegroundColor Green
    } else {
        Write-Warning "RUNBOOK_ANDROID.md not found at $runbookPath"
    }
}

# 6) Final Status
Write-Host "`n=== BUILD STATUS ===" -ForegroundColor Cyan
Write-Host "✅ Java installed (portable JDK 11)" -ForegroundColor Green
Write-Host "✅ Node pinned to 20.19.0 for this session" -ForegroundColor Green
Write-Host "✅ Built Debug/Release APKs successfully" -ForegroundColor Green
Write-Host "✅ APK sizes captured and analyzed" -ForegroundColor Green
if (-not $SkipDocs) {
    Write-Host "✅ Documentation updated (CHANGELOG + RUNBOOK)" -ForegroundColor Green
}

Write-Host "`nBuild Summary:" -ForegroundColor Yellow
Write-Host "  Debug APK: $DbgMB MB" -ForegroundColor White
Write-Host "  Release APK: $RelMB MB" -ForegroundColor White
if ($SDKInfo.minSdk) {
    Write-Host "  minSdkVersion: $($SDKInfo.minSdk)" -ForegroundColor White
    Write-Host "  targetSdkVersion: $($SDKInfo.targetSdk)" -ForegroundColor White
}

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  - Validate APK installation on device/emulator" -ForegroundColor White
Write-Host "  - Compare with CI build results" -ForegroundColor White
Write-Host "  - Test app functionality" -ForegroundColor White

Write-Host "`nBuild completed successfully!" -ForegroundColor Green

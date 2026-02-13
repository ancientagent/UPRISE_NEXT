# Uprise Mobile - APK Information Extractor
# Extracts SDK info and APK sizes locally (aligns with CI workflow)

param(
    [string]$ApkPath,
    [string]$OutputDir = ".\artifacts\local",
    [switch]$Verbose
)

function Write-VerboseOutput {
    param([string]$Message)
    if ($Verbose) {
        Write-Host $Message -ForegroundColor Cyan
    }
}

function Extract-SDKInfo {
    param(
        [string]$ApkPath,
        [string]$OutputDir
    )
    
    Write-Host "=== Extracting SDK Information ===" -ForegroundColor Cyan
    
    if (!(Test-Path $ApkPath)) {
        Write-Error "APK not found: $ApkPath"
        return $null
    }
    
    $sdkInfo = @{
        minSdk = $null
        targetSdk = $null
        packageName = $null
        versionName = $null
        versionCode = $null
    }
    
    # Try aapt first (preferred)
    if (Get-Command aapt -ErrorAction SilentlyContinue) {
        Write-VerboseOutput "Using aapt to extract APK metadata"
        try {
            $badging = & aapt dump badging $ApkPath 2>$null
            
            $sdkInfo.minSdk = ($badging | Select-String "sdkVersion:'(\d+)'").Matches[0].Groups[1].Value
            $sdkInfo.targetSdk = ($badging | Select-String "targetSdkVersion:'(\d+)'").Matches[0].Groups[1].Value
            $sdkInfo.packageName = ($badging | Select-String "package: name='([^']+)'").Matches[0].Groups[1].Value
            $sdkInfo.versionName = ($badging | Select-String "versionName='([^']+)'").Matches[0].Groups[1].Value
            $sdkInfo.versionCode = ($badging | Select-String "versionCode='(\d+)'").Matches[0].Groups[1].Value
            
            # Save badging output
            $badgingPath = Join-Path $OutputDir "apk-badging.txt"
            $badging | Out-File -FilePath $badgingPath -Encoding UTF8
            
        } catch {
            Write-Warning "aapt extraction failed: $_"
        }
    }
    
    # Fallback to apkanalyzer if available
    if ((-not $sdkInfo.minSdk) -and (Get-Command apkanalyzer -ErrorAction SilentlyContinue)) {
        Write-VerboseOutput "Using apkanalyzer as fallback"
        try {
            $sdkInfo.minSdk = & apkanalyzer manifest min-sdk $ApkPath 2>$null
            $sdkInfo.targetSdk = & apkanalyzer manifest target-sdk $ApkPath 2>$null
            $sdkInfo.packageName = & apkanalyzer manifest application-id $ApkPath 2>$null
        } catch {
            Write-Warning "apkanalyzer extraction failed: $_"
        }
    }
    
    # Extract from AndroidManifest.xml as final fallback
    if (-not $sdkInfo.minSdk) {
        Write-VerboseOutput "Attempting to extract from AndroidManifest.xml"
        $manifestPath = ".\app\src\main\AndroidManifest.xml"
        if (Test-Path $manifestPath) {
            $manifestContent = Get-Content $manifestPath -Raw
            $sdkInfo.minSdk = ($manifestContent | Select-String 'android:minSdkVersion="(\d+)"').Matches[0].Groups[1].Value
            $sdkInfo.targetSdk = ($manifestContent | Select-String 'android:targetSdkVersion="(\d+)"').Matches[0].Groups[1].Value
        }
    }
    
    return $sdkInfo
}

function Get-ApkSize {
    param([string]$ApkPath)
    
    if (!(Test-Path $ApkPath)) {
        return @{ bytes = 0; mb = 0; kb = 0 }
    }
    
    $bytes = (Get-Item $ApkPath).Length
    $mb = [math]::Round($bytes / 1MB, 2)
    $kb = [math]::Round($bytes / 1KB, 0)
    
    return @{
        bytes = $bytes
        mb = $mb
        kb = $kb
    }
}

# Main execution
Write-Host "=== APK Information Extractor ===" -ForegroundColor Cyan

# Create output directory
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
    Write-Host "Created output directory: $OutputDir" -ForegroundColor Green
}

# If no APK path specified, look for built APKs
if (-not $ApkPath) {
    $debugApk = ".\app\build\outputs\apk\debug\app-debug.apk"
    $releaseApk = ".\app\build\outputs\apk\release\app-release.apk"
    
    if (Test-Path $debugApk) {
        $ApkPath = $debugApk
        Write-Host "Using debug APK: $ApkPath" -ForegroundColor Green
    } elseif (Test-Path $releaseApk) {
        $ApkPath = $releaseApk
        Write-Host "Using release APK: $ApkPath" -ForegroundColor Green
    } else {
        Write-Error "No APK found. Please build the project first or specify -ApkPath"
        exit 1
    }
}

# Extract SDK information
$sdkInfo = Extract-SDKInfo -ApkPath $ApkPath -OutputDir $OutputDir

# Get APK size
$sizeInfo = Get-ApkSize -ApkPath $ApkPath

# Display results
Write-Host "`n=== APK Analysis Results ===" -ForegroundColor Cyan
Write-Host "APK Path: $ApkPath" -ForegroundColor White
Write-Host "Size: $($sizeInfo.mb) MB ($($sizeInfo.kb) KB)" -ForegroundColor White

if ($sdkInfo.minSdk) {
    Write-Host "minSdkVersion: $($sdkInfo.minSdk)" -ForegroundColor Green
} else {
    Write-Host "minSdkVersion: unknown" -ForegroundColor Yellow
}

if ($sdkInfo.targetSdk) {
    Write-Host "targetSdkVersion: $($sdkInfo.targetSdk)" -ForegroundColor Green
} else {
    Write-Host "targetSdkVersion: unknown" -ForegroundColor Yellow
}

if ($sdkInfo.packageName) {
    Write-Host "Package: $($sdkInfo.packageName)" -ForegroundColor Green
}

if ($sdkInfo.versionName) {
    Write-Host "Version: $($sdkInfo.versionName)" -ForegroundColor Green
}

# Create summary file
$summaryPath = Join-Path $OutputDir "apk-summary.txt"
$summary = @"
=== APK Information Summary ===
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

APK Path: $ApkPath
Size: $($sizeInfo.mb) MB ($($sizeInfo.kb) KB)

SDK Information:
- minSdkVersion: $($sdkInfo.minSdk)
- targetSdkVersion: $($sdkInfo.targetSdk)
- Package: $($sdkInfo.packageName)
- Version: $($sdkInfo.versionName)
- Version Code: $($sdkInfo.versionCode)

=== Source Priority ===
SDK info extracted from APK files (preferred) or AndroidManifest.xml (fallback)
"@

$summary | Out-File -FilePath $summaryPath -Encoding UTF8
Write-Host "`nSummary saved to: $summaryPath" -ForegroundColor Green

# Create JSON output for CI alignment
$jsonPath = Join-Path $OutputDir "apk-info.json"
$jsonData = @{
    timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
    apk_path = $ApkPath
    size = @{
        bytes = $sizeInfo.bytes
        mb = $sizeInfo.mb
        kb = $sizeInfo.kb
    }
    sdk = @{
        min_sdk = $sdkInfo.minSdk
        target_sdk = $sdkInfo.targetSdk
    }
    package = @{
        name = $sdkInfo.packageName
        version_name = $sdkInfo.versionName
        version_code = $sdkInfo.versionCode
    }
} | ConvertTo-Json -Depth 3

$jsonData | Out-File -FilePath $jsonPath -Encoding UTF8
Write-Host "JSON data saved to: $jsonPath" -ForegroundColor Green

Write-Host "`n✅ APK analysis completed successfully!" -ForegroundColor Green

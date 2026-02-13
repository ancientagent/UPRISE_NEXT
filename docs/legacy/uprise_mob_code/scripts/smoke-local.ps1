Param(
  [string]$ApkPath = "app\build\outputs\apk\debug\app-debug.apk"
)

$env:ANDROID_HOME = "$HOME\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:Path"

if (-not (Test-Path $ApkPath)) { throw "APK not found at $ApkPath" }

# Wait for boot
$tries=0
do {
  $tries++; Start-Sleep -Seconds 10
  adb wait-for-device | Out-Null
  $booted = (adb shell getprop sys.boot_completed 2>$null).Trim()
  Write-Host "…waiting for boot ($tries/30) booted=$booted"
} until ($booted -eq "1" -or $tries -ge 30)

if ($booted -ne "1") { throw "Emulator didn't finish booting." }

# Speed up UI, unlock
adb shell settings put global window_animation_scale 0 | Out-Null
adb shell settings put global transition_animation_scale 0 | Out-Null
adb shell settings put global animator_duration_scale 0 | Out-Null
adb shell input keyevent 82 | Out-Null

# Clean uninstall any *uprise* packages
$pkgs = (adb shell pm list packages | % { $_.Replace("package:","").Trim() }) | ? { $_ -match "uprise" }
foreach ($p in $pkgs) { adb uninstall $p | Out-Null }

# Detect package/activity via aapt if available
$component = ""
try {
  $aapt = Join-Path $env:ANDROID_HOME "build-tools\31.0.0\aapt.exe"
  if (Test-Path $aapt) {
    $dump = & $aapt dump badging $ApkPath
    $pkg = ($dump | Select-String -Pattern "package: name='([^']+)'" -AllMatches).Matches[0].Groups[1].Value
    $act = ($dump | Select-String -Pattern "launchable-activity: name='([^']+)'" -AllMatches).Matches[0].Groups[1].Value
    if ($pkg -and $act) { $component = "$pkg/$act" }
  }
} catch { }

if (-not $component) { $component = "com.app.uprise/.MainActivity" }

adb install -r $ApkPath
adb logcat -c
$log = "smoke-logcat.txt"
Start-Job -ScriptBlock { adb logcat *:I } | Out-Null
Start-Sleep -Milliseconds 300

adb shell am start -W -n $component
Start-Sleep -Seconds 10
Get-Job | Receive-Job -Keep | Out-File -Encoding ascii $log
Get-Job | Remove-Job -Force

adb shell dumpsys activity > dumpsys.txt
adb shell pm list packages > pm-packages.txt

if (Select-String -Path $log -Pattern "ActivityTaskManager: Displayed $([regex]::Escape($component))") {
  Write-Host "✅ Launch confirmed: $component" -ForegroundColor Green
} else {
  Write-Host "❌ Launch confirmation not found in logcat" -ForegroundColor Red
  Get-Content $log -Tail 200
}

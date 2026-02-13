Awesome—here’s a ready‑to‑paste section for your runbook. Drop it near the end of `docs/guides/runbooks/android.md`.


---

Preventing & Fixing Permissions Errors (Windows + PowerShell)

React Native + Gradle on Windows can fail with Access is denied, EPERM, or silent write blocks (Defender). Use this checklist to avoid and fix them quickly.

1) Run mode consistency

Pick one: non‑Admin or Admin shell. Don’t mix within the same session; file owners/SIDs will diverge.

Recommended: non‑Admin for normal dev; Admin only for one‑time environment variable changes.


2) Normalize ownership/ACLs

# Set your variables (adjust the repo path if needed)
$REPO = "D:\uprise_mob"
$SDK  = "$env:LOCALAPPDATA\Android\Sdk"
$ME   = "$env:USERNAME"

# Grant yourself Full control, recursively
icacls $REPO /grant "$ME:(OI)(CI)F" /T
icacls $SDK  /grant "$ME:(OI)(CI)F" /T

3) Stable TEMP and Gradle cache paths

# For this shell
$env:GRADLE_USER_HOME = "$env:USERPROFILE\.gradle"
$env:TEMP = "$env:USERPROFILE\AppData\Local\Temp"
$env:TMP  = $env:TEMP

# Persist (run once in elevated PowerShell)
[Environment]::SetEnvironmentVariable("GRADLE_USER_HOME", "$env:USERPROFILE\.gradle", "Machine")
[Environment]::SetEnvironmentVariable("TEMP", "$env:USERPROFILE\AppData\Local\Temp", "Machine")
[Environment]::SetEnvironmentVariable("TMP",  "$env:USERPROFILE\AppData\Local\Temp", "Machine")

4) Windows Defender (Controlled Folder Access)

If CFA is on, allow‑list these executables or temporarily disable CFA during builds:

C:\Program Files\Eclipse Adoptium\jdk-11.0.28.6-hotspot\bin\java.exe

D:\uprise_mob\android\gradlew.bat

C:\tools\node-v20.19.0-win-x64\node.exe

%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe


5) Protect critical files from agent “auto‑fixes”

Mark “do‑not‑touch” files read‑only and soft‑lock in git.

cd D:\uprise_mob
$protect = @(
  "android\gradle\wrapper\gradle-wrapper.jar",
  "android\gradle\wrapper\gradle-wrapper.properties",
  "android\settings.gradle",
  "android\build.gradle",
  "android\app\build.gradle",
  "android\app\src\debug\google-services.json",
  "android\app\src\release\google-services.json"
)
foreach ($p in $protect) { if (Test-Path $p) { attrib +R $p; git update-index --assume-unchanged $p 2>$null } }

# To edit intentionally later:
# foreach ($p in $protect) { attrib -R $p; git update-index --no-assume-unchanged $p 2>$null }

Optional git safety rails

git config core.autocrlf true
git config core.filemode false
git config --global --add safe.directory "D:/uprise_mob"

Add .gitattributes:

* text=auto
*.bat text eol=crlf
*.ps1 text eol=crlf
*.sh  text eol=lf

Pre‑commit hook to block risky edits (.git/hooks/pre-commit):

#!/usr/bin/env sh
set -e
BLOCKED='
android/gradle/wrapper/gradle-wrapper.jar
android/gradle/wrapper/gradle-wrapper.properties
android/settings.gradle
android/build.gradle
android/app/build.gradle
android/app/src/debug/google-services.json
android/app/src/release/google-services.json
'
for f in $BLOCKED; do
  if git diff --cached --name-only | grep -F -x "$f" >/dev/null 2>&1; then
    echo "ERROR: Commit touches protected file: $f"
    echo "Unlock intentionally, update docs, then commit."
    exit 1
  fi
done

Then:

git update-index --chmod=+x .git\hooks\pre-commit

6) Cleanly stop daemons & free locks

# Kill stray Metro/Node (PowerShell way)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop Gradle daemons
cd D:\uprise_mob\android
.\gradlew --stop

7) One‑shot reset script (optional)

Create scripts\reset-build.ps1:

$ErrorActionPreference="SilentlyContinue"
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
cd D:\uprise_mob\android
.\gradlew --stop
Remove-Item -Recurse -Force .\.gradle, .\build, .\app\build
cd D:\uprise_mob
Remove-Item -Recurse -Force .\node_modules\.cache
Write-Host "Build caches cleared."

8) Detect the exact failing path (when it still errors)

cd D:\uprise_mob\android
.\gradlew assembleDebug --stacktrace --info --warning-mode=all | Tee-Object -FilePath build_log.txt
Select-String -Path .\build_log.txt -Pattern "denied|EPERM|EACCES|permission" -CaseSensitive:$false

Copy the matched lines into CHANGELOG.md and fix the specific path/owner/defender rule.


---

Agent Guardrail (copy into agent prompts)

> Use PowerShell only. Do not escalate privileges. If a permission issue appears, propose the minimal icacls command targeting the precise path and add the rationale to CHANGELOG.md. Never edit gradle wrapper, settings.gradle, or google‑services files without explicit unlock instructions in the chat.




---

If you want, I can also give you a short “diff block” to append to CHANGELOG.md noting that this new section was added.

Estimated token cost for this response: ~480–600 tokens.


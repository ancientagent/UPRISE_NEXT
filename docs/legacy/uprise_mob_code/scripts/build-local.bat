@echo off
REM Uprise Mobile - Local Build Runner
REM Simple batch file to run the PowerShell build script

echo === Uprise Mobile Local Build ===
echo.

REM Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if errorlevel 1 (
    echo Error: PowerShell is not available
    pause
    exit /b 1
)

REM Run the PowerShell build script
echo Starting local build process...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0local-build.ps1" %*

if errorlevel 1 (
    echo.
    echo Build failed! Check the output above for errors.
    pause
    exit /b 1
) else (
    echo.
    echo Build completed successfully!
    echo.
    echo To extract APK information, run:
    echo   scripts\extract-apk-info.ps1
    echo.
    pause
)

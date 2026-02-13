#!/usr/bin/env pwsh
# Alias wrapper: Sprint 2 smoke (calls Phase 2 wrapper)
& (Join-Path $PSScriptRoot 'phase2_smoke.ps1')

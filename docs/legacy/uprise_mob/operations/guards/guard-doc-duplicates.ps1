#!/usr/bin/env pwsh
# docs/ops/guards/guard-doc-duplicates.ps1
Set-StrictMode -Version Latest
$rows = Get-Content artifacts/docs_dedupe/docs_inventory.json -Raw | ConvertFrom-Json
$dupes = @()
$byTitle = $rows | Group-Object TitleSlug | Where-Object { $_.Name -ne '' -and $_.Count -gt 1 }
$byBase  = $rows | Group-Object BaseSlug  | Where-Object { $_.Name -ne '' -and $_.Count -gt 1 }
if ($byTitle.Count -gt 0 -or $byBase.Count -gt 0) {
  Write-Host 'Duplicate doc slugs detected. Run the dedupe task.' -ForegroundColor Red
  exit 1
}
Write-Host 'Doc duplicates guard: PASS'

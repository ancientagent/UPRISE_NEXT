# UPRISE – Endpoint Smokes (ZIP & Community Validation)
param(
  [string]$BaseUrl = 'http://127.0.0.1:3000'
)

$ErrorActionPreference = 'Stop'
$root = 'D:\uprise_mob'
$logdir = Join-Path $root 'artifacts\logs'
New-Item -ItemType Directory -Force -Path $logdir | Out-Null

function Save-Curl($url, $outFile) {
  "GET $url`r`n" | Out-File -FilePath $outFile -Encoding ASCII
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -TimeoutSec 10 -Uri $url
    "HTTP/1.1 $($resp.StatusCode) $($resp.StatusDescription)" | Out-File -FilePath $outFile -Append -Encoding ASCII
    $resp.RawContent | Out-File -FilePath $outFile -Append -Encoding ASCII
  } catch {
    "REQUEST FAILED: $_" | Out-File -FilePath $outFile -Append -Encoding ASCII
  }
}

Save-Curl "$BaseUrl/geo/zip-lookup?zip=78610" (Join-Path $logdir 'endpoint_geo_zip_lookup_78610.log')
Save-Curl "$BaseUrl/geo/zip-lookup?zip=99999" (Join-Path $logdir 'endpoint_geo_zip_lookup_99999.log')
Save-Curl "$BaseUrl/onboarding/validate-community?city=Austin&state=Texas&sub_genre=hip-hop" (Join-Path $logdir 'endpoint_validate_active.log')
Save-Curl "$BaseUrl/onboarding/validate-community?city=Buda&state=Texas&sub_genre=thrash-punk" (Join-Path $logdir 'endpoint_validate_inactive.log')

Write-Host "Saved logs to $logdir" -ForegroundColor Green

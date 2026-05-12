$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontend = Join-Path $root "frontend"
$serverCmd = Join-Path $root "Run-ShkruajShpejt-Server.cmd"
$url = "http://localhost:5173/"

function Test-SiteReady {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    }
    catch {
        return $false
    }
}

if (-not (Test-Path $frontend)) {
    Write-Host "Folderi frontend nuk u gjet."
    Read-Host "Shtyp Enter per ta mbyllur"
    exit 1
}

if (-not (Test-Path $serverCmd)) {
    Write-Host "Launcher i serverit nuk u gjet."
    Read-Host "Shtyp Enter per ta mbyllur"
    exit 1
}

if (-not (Test-SiteReady)) {
    Start-Process -FilePath $serverCmd -WorkingDirectory $root

    $ready = $false
    for ($i = 0; $i -lt 90; $i++) {
        Start-Sleep -Milliseconds 500
        if (Test-SiteReady) {
            $ready = $true
            break
        }
    }

    if (-not $ready) {
        Write-Host "Faqja nuk u hap ne portin 5173."
        Write-Host "Kontrollo dritaren e serverit per gabime."
        Read-Host "Shtyp Enter per ta mbyllur"
        exit 1
    }
}

Start-Process $url

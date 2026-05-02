# ============================================
#  A1 DRIVING SCHOOL - WhatsApp Bot Setup
#  PowerShell version (Windows-native)
# ============================================
#  1. Fill in .env
#  2. Run:  powershell -ExecutionPolicy Bypass -File setup.ps1
# ============================================

function Write-Step { param($Num, $Msg) Write-Host "`n[$Num/5] $Msg" -ForegroundColor Green }
function Write-Warn { param($Msg) Write-Host "WARNING: $Msg" -ForegroundColor Yellow }
function Write-Err  { param($Msg) Write-Host "ERROR: $Msg"   -ForegroundColor Red }

Write-Host ""
Write-Host "  ==========================================" -ForegroundColor Green
Write-Host "   A1 DRIVING SCHOOL - WhatsApp Bot"           -ForegroundColor Green
Write-Host "   Automated Setup (Windows / PowerShell)"     -ForegroundColor Green
Write-Host "  ==========================================" -ForegroundColor Green

# --- Pre-checks ---
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Err "Docker CLI not found on PATH."
    Write-Host "  Install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
}

# Test the Docker daemon is responding. Use & invocation + EAP=Continue
# to avoid PS 5.1's NativeCommandError quirk.
$prevEAP = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
$null = & docker info 2>$null
$dockerExit = $LASTEXITCODE
$ErrorActionPreference = $prevEAP

if ($dockerExit -ne 0) {
    Write-Err "Docker is installed but the daemon isn't responding."
    Write-Host "  Right-click the Docker whale icon in your taskbar."
    Write-Host "  It should say 'Docker Desktop is running'. If 'starting', wait and re-run."
    exit 1
}

if (-not (Test-Path '.env')) {
    Write-Err ".env file not found in this folder."
    Write-Host "  Make sure you're running setup.ps1 from D:\Projects\WhatsAppAssistant"
    exit 1
}

# --- Load .env into hashtable + environment ---
$envVars = @{}
Get-Content '.env' | ForEach-Object {
    if ($_ -match '^\s*([^#=\s][^=]*)\s*=\s*(.*?)\s*$') {
        $key = $matches[1].Trim()
        $val = $matches[2].Trim()
        $envVars[$key] = $val
        Set-Item -Path "env:$key" -Value $val
    }
}

# --- Validate placeholders ---
$missing = @()
if ($envVars['OPENAI_API_KEY']     -eq 'sk-xxxxxxxxxxxxxxxxxxxxxxxx')                { $missing += 'OPENAI_API_KEY' }
if ($envVars['TWILIO_ACCOUNT_SID'] -eq 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')         { $missing += 'TWILIO_ACCOUNT_SID' }
if ($envVars['TWILIO_AUTH_TOKEN']  -eq 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')           { $missing += 'TWILIO_AUTH_TOKEN' }
if ($envVars['GOOGLE_CALENDAR_ID'] -eq 'your-calendar-id@group.calendar.google.com') { $missing += 'GOOGLE_CALENDAR_ID' }
if ($envVars['NGROK_AUTHTOKEN']    -eq '2xxxxxxxxxxxxxxxxxxxxxxx')                   { $missing += 'NGROK_AUTHTOKEN' }

if ($missing.Count -gt 0) {
    Write-Err "These .env values still have placeholders: $($missing -join ', ')"
    Write-Host "  Edit .env with your real keys, then re-run."
    exit 1
}

# --- Step 1: Start containers ---
Write-Step 1 "Starting Docker containers (n8n + ngrok)..."
docker compose up -d
if ($LASTEXITCODE -ne 0) { Write-Err "docker compose up failed."; exit 1 }

# --- Step 2: Wait for n8n ---
Write-Step 2 "Waiting for n8n to be ready..."
$ready = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:5678/healthz" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($r.StatusCode -eq 200) { Write-Host "  n8n is up!"; $ready = $true; break }
    } catch {}
    Start-Sleep -Seconds 1
}
if (-not $ready) {
    Write-Err "n8n didn't start in 30s. Check: docker logs a1-n8n"
    exit 1
}

# --- Step 3: Get ngrok URL ---
Write-Step 3 "Getting your public ngrok URL..."
Start-Sleep -Seconds 3
$ngrokUrl = $null
try {
    $tunnels = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -TimeoutSec 5
    $httpsTunnel = $tunnels.tunnels | Where-Object { $_.public_url -like 'https://*' } | Select-Object -First 1
    if ($httpsTunnel) { $ngrokUrl = $httpsTunnel.public_url }
} catch {}

if (-not $ngrokUrl) {
    Write-Warn "Couldn't auto-detect ngrok URL. Open http://localhost:4040 to copy it manually."
    $ngrokUrl = "https://CHECK-LOCALHOST-4040"
} else {
    Write-Host "  Your public URL: $ngrokUrl"
}

# Recreate ONLY the n8n container so WEBHOOK_URL picks up the live ngrok URL.
# IMPORTANT: do not docker compose down here -- that would also restart ngrok
# and give us a fresh ngrok URL, which would no longer match WEBHOOK_URL.
$env:NGROK_URL = $ngrokUrl
docker compose up -d --no-deps --force-recreate n8n
Start-Sleep -Seconds 5

# Re-verify n8n is up (it just restarted)
$ready = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:5678/healthz" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($r.StatusCode -eq 200) { $ready = $true; break }
    } catch {}
    Start-Sleep -Seconds 1
}
if (-not $ready) {
    Write-Warn "n8n didn't come back up after restart. Check: docker logs a1-n8n"
}

# --- Step 4: Try to import workflow ---
Write-Step 4 "Importing workflow into n8n..."
$auth = "$($envVars['N8N_USER']):$($envVars['N8N_PASSWORD'])"
$authBytes = [System.Text.Encoding]::UTF8.GetBytes($auth)
$authHeader = "Basic " + [Convert]::ToBase64String($authBytes)
$headers = @{ Authorization = $authHeader; 'Content-Type' = 'application/json' }

# Wait for n8n API to respond.
for ($i = 1; $i -le 20; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:5678/api/v1/workflows" -Headers $headers -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($r.StatusCode -eq 200) { break }
    } catch {}
    Start-Sleep -Seconds 2
}

$workflowJson = [System.IO.File]::ReadAllText((Resolve-Path 'workflow.json').Path)
$workflowId = $null
try {
    $importResp = Invoke-RestMethod -Uri "http://localhost:5678/api/v1/workflows" `
        -Method POST -Headers $headers -Body $workflowJson -ErrorAction Stop
    $workflowId = $importResp.id
    Write-Host "  Workflow imported (ID: $workflowId)"

    try {
        Invoke-RestMethod -Uri "http://localhost:5678/api/v1/workflows/$workflowId" `
            -Method PATCH -Headers $headers -Body '{"active": true}' -ErrorAction Stop
        Write-Host "  Workflow activated!"
    } catch {
        Write-Warn "Couldn't auto-activate. Open it in n8n UI and toggle 'Active' on (top right)."
    }
} catch {
    Write-Warn "Auto-import failed (this is normal if n8n's public API needs a key)."
    Write-Host "  Import manually: open http://localhost:5678, click 'Add workflow' -> menu -> 'Import from File' -> select workflow.json"
}

# --- Step 5: Print next steps ---
Write-Step 5 "Almost done! Manual steps remaining:"
$openaiHint    = if ($envVars['OPENAI_API_KEY'].Length    -ge 8) { $envVars['OPENAI_API_KEY'].Substring(0, 8) }    else { $envVars['OPENAI_API_KEY'] }
$twilioSidHint = if ($envVars['TWILIO_ACCOUNT_SID'].Length -ge 8) { $envVars['TWILIO_ACCOUNT_SID'].Substring(0, 8) } else { $envVars['TWILIO_ACCOUNT_SID'] }

Write-Host ""
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host " YOU STILL NEED TO DO THESE MANUALLY (one-time):"   -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. OPEN n8n -> http://localhost:5678"
Write-Host "     Login: $($envVars['N8N_USER']) / $($envVars['N8N_PASSWORD'])"
Write-Host ""
Write-Host "  2. Add THREE credentials inside n8n (Credentials -> New):"
Write-Host ""
Write-Host "     a) OpenAI API"
Write-Host "        API Key: $openaiHint..."
Write-Host "        Used by: 'OpenAI Chat' node"
Write-Host ""
Write-Host "     b) Twilio API"
Write-Host "        Account SID: $twilioSidHint..."
Write-Host "        Auth Token:  (from console.twilio.com)"
Write-Host "        Used by:     'Alert Zahid', 'Confirm to Student', 'Optout Reply', 'Chat Reply'"
Write-Host ""
Write-Host "     c) Google Calendar OAuth2"
Write-Host "        Click 'Sign in with Google' -> grant access to your A1 Leads calendar"
Write-Host "        Used by: 'Create Calendar Event' node"
Write-Host ""
Write-Host "  3. SET TWILIO WEBHOOK:"
Write-Host "     Twilio Console -> Messaging -> Try it out -> Send a WhatsApp message -> Sandbox settings"
Write-Host "     'When a message comes in':  $ngrokUrl/webhook/a1-driving-wa"
Write-Host "     Method: HTTP POST"
Write-Host ""
Write-Host "  4. OPT IN your test phone:"
Write-Host "     Send 'join {your-sandbox-code}' from WhatsApp to $($envVars['TWILIO_FROM_NUMBER'])"
Write-Host ""
Write-Host "  5. TEST IT: From the opted-in phone, send 'hi' to $($envVars['TWILIO_FROM_NUMBER'])"
Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " USEFUL LINKS:"                                     -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "  n8n UI:        http://localhost:5678"
Write-Host "  ngrok inspect: http://localhost:4040"
Write-Host "  Public URL:    $ngrokUrl"
Write-Host ""
Write-Host "Done! Your bot infrastructure is running." -ForegroundColor Green

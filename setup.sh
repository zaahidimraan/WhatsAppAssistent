#!/bin/bash
set -e

# =============================================
# A1 DRIVING SCHOOL - ONE-CLICK BOT SETUP
# =============================================
# 1. Fill in .env file
# 2. Run: chmod +x setup.sh && ./setup.sh
# =============================================

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
print_step() { echo -e "\n${GREEN}[$1/5]${NC} $2"; }
print_warn() { echo -e "${YELLOW}⚠  $1${NC}"; }
print_err()  { echo -e "${RED}✗  $1${NC}"; }

# --- Pre-checks ---
echo -e "${GREEN}"
echo "  ╔═══════════════════════════════════════╗"
echo "  ║  A1 DRIVING SCHOOL - WhatsApp Bot     ║"
echo "  ║  Automated Setup                      ║"
echo "  ╚═══════════════════════════════════════╝"
echo -e "${NC}"

if ! command -v docker &>/dev/null; then
  print_err "Docker not found. Install from https://docker.com/products/docker-desktop"
  exit 1
fi

if ! docker info &>/dev/null 2>&1; then
  print_err "Docker not running. Start Docker Desktop first."
  exit 1
fi

# Load .env
if [ ! -f .env ]; then
  print_err ".env file not found. Copy .env.example to .env and fill in your keys."
  exit 1
fi
source .env

# Validate required vars
MISSING=""
[ "$OPENAI_API_KEY" = "sk-xxxxxxxxxxxxxxxxxxxxxxxx" ] && MISSING="$MISSING OPENAI_API_KEY"
[ "$TWILIO_ACCOUNT_SID" = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" ] && MISSING="$MISSING TWILIO_ACCOUNT_SID"
[ "$TWILIO_AUTH_TOKEN" = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" ] && MISSING="$MISSING TWILIO_AUTH_TOKEN"
[ "$GOOGLE_CALENDAR_ID" = "your-calendar-id@group.calendar.google.com" ] && MISSING="$MISSING GOOGLE_CALENDAR_ID"
[ "$NGROK_AUTHTOKEN" = "2xxxxxxxxxxxxxxxxxxxxxxx" ] && MISSING="$MISSING NGROK_AUTHTOKEN"

if [ -n "$MISSING" ]; then
  print_err "These .env values still have placeholders:$MISSING"
  echo "    Edit .env with your real keys, then re-run."
  exit 1
fi

# --- Step 1: Start containers ---
print_step 1 "Starting Docker containers (n8n + ngrok)..."
docker compose up -d

# --- Step 2: Wait for n8n ---
print_step 2 "Waiting for n8n to be ready..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz 2>/dev/null | grep -q "200"; then
    echo "  n8n is up!"
    break
  fi
  [ $i -eq 30 ] && { print_err "n8n didn't start in 30s. Check: docker logs a1-n8n"; exit 1; }
  sleep 1
done

# --- Step 3: Get ngrok URL ---
print_step 3 "Getting your public ngrok URL..."
sleep 3
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
  print_warn "Couldn't auto-detect ngrok URL. Check http://localhost:4040"
  NGROK_URL="https://CHECK-LOCALHOST-4040"
else
  echo "  Your public URL: $NGROK_URL"
fi

# Recreate ONLY the n8n container so WEBHOOK_URL picks up the live ngrok URL.
# DO NOT do `docker compose down` here -- that recycles ngrok too and gives
# us a brand-new ngrok URL that no longer matches WEBHOOK_URL.
export NGROK_URL
docker compose up -d --no-deps --force-recreate n8n
sleep 5

# --- Step 4: Import workflow via n8n API ---
print_step 4 "Importing workflow into n8n..."

# Wait for n8n API
for i in $(seq 1 20); do
  RESP=$(curl -s -o /dev/null -w "%{http_code}" -u "${N8N_USER}:${N8N_PASSWORD}" http://localhost:5678/api/v1/workflows 2>/dev/null)
  [ "$RESP" = "200" ] && break
  sleep 2
done

# Import
IMPORT_RESP=$(curl -s -X POST \
  -u "${N8N_USER}:${N8N_PASSWORD}" \
  -H "Content-Type: application/json" \
  -d @workflow.json \
  http://localhost:5678/api/v1/workflows)

WORKFLOW_ID=$(echo "$IMPORT_RESP" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$WORKFLOW_ID" ]; then
  echo "  Workflow imported (ID: $WORKFLOW_ID)"

  # Activate it
  curl -s -X PATCH \
    -u "${N8N_USER}:${N8N_PASSWORD}" \
    -H "Content-Type: application/json" \
    -d '{"active": true}' \
    http://localhost:5678/api/v1/workflows/$WORKFLOW_ID > /dev/null 2>&1

  echo "  Workflow activated!"
else
  print_warn "Auto-import failed. Import workflow.json manually in n8n UI."
fi

# --- Step 5: Print next steps ---
print_step 5 "Almost done! Manual steps remaining:"

echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW} YOU STILL NEED TO DO THESE MANUALLY (one-time):${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  1. OPEN n8n → http://localhost:5678"
echo "     Login: ${N8N_USER} / ${N8N_PASSWORD}"
echo ""
echo "  2. Add THREE credentials inside n8n (Settings → Credentials → New):"
echo ""
echo "     a) OpenAI API"
echo "        API Key: ${OPENAI_API_KEY:0:8}..."
echo "        Used by: 'OpenAI Chat' node"
echo ""
echo "     b) Twilio API"
echo "        Account SID: ${TWILIO_ACCOUNT_SID:0:8}..."
echo "        Auth Token:  (from console.twilio.com)"
echo "        Used by:     'Alert Zahid', 'Confirm to Student', 'Optout Reply', 'Chat Reply' nodes"
echo ""
echo "     c) Google Calendar OAuth2"
echo "        Click 'Sign in with Google' → grant access to your A1 Leads calendar"
echo "        Used by: 'Create Calendar Event' node"
echo ""
echo "  3. SET TWILIO WEBHOOK:"
echo "     Console → Messaging → Try it out → Send a WhatsApp message → Sandbox settings"
echo "     'When a message comes in':  ${NGROK_URL}/webhook/a1-driving-wa"
echo "     Method: HTTP POST"
echo ""
echo "  4. OPT IN your test phone:"
echo "     Send 'join {your-sandbox-code}' from WhatsApp to ${TWILIO_FROM_NUMBER}"
echo "     (your code is shown on the Twilio Sandbox page)"
echo ""
echo "  5. TEST IT: From the opted-in phone, send 'hi' to ${TWILIO_FROM_NUMBER}"
echo "     The bot should reply asking for name + postcode + manual/auto."
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN} USEFUL LINKS:${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "  n8n UI:        http://localhost:5678"
echo "  ngrok inspect: http://localhost:4040"
echo "  Public URL:    ${NGROK_URL}"
echo ""
echo -e "${GREEN}Done! Your bot infrastructure is running. 🚗${NC}"

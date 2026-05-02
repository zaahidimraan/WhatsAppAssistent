A1 DRIVING SCHOOL - WHATSAPP BOT
=================================

QUICK START (3 steps):

  1. Edit .env  → fill in your API keys (see "WHAT YOU NEED" below)
  2. Run:       chmod +x setup.sh && ./setup.sh
  3. Add credentials in n8n UI (the script tells you exactly what to do)


WHAT YOU NEED BEFORE STARTING:
  - Docker Desktop                 https://www.docker.com/products/docker-desktop
  - OpenAI API key                 https://platform.openai.com/api-keys
  - Twilio account                 https://www.twilio.com/try-twilio
      ↳ Account SID + Auth Token (from Console dashboard)
      ↳ WhatsApp Sandbox activated (Console → Messaging → Try it out)
  - Google account with a Calendar you want leads added to
      ↳ Calendar ID (Calendar settings → Integrate calendar → Calendar ID)
  - Your personal UK WhatsApp number (for receiving lead alerts)
  - ngrok account (free)           https://ngrok.com/signup


WHAT THE BOT DOES:
  Student msgs WhatsApp →  bot collects name, postcode, gearbox, test date,
  prior lessons → when all 5 are gathered, bot:
    1. Creates a "Lead - {name} - {postcode}" event in your Google Calendar
    2. WhatsApps you a lead summary so you can follow up
    3. Replies to the student: "Lovely, you're all booked in!"

  If a student says "stop" / "unsubscribe", bot clears their history and
  replies politely.


FILES:
  .env                Your API keys and config — fill this in first
  docker-compose.yml  Runs n8n + ngrok in Docker
  workflow.json       The n8n chatbot workflow
  setup.sh            Start everything
  stop.sh             Stop everything


TO STOP:   ./stop.sh
TO START:  ./setup.sh


TROUBLESHOOTING:

  Bot doesn't reply when I message it
    → Did you send "join {sandbox-code}" first? Twilio Sandbox requires
      every test phone to opt in once.
    → Check ngrok URL is set in Twilio Sandbox webhook settings.
    → Check n8n executions log: http://localhost:5678 → Executions

  "Workflow execution failed: credential not configured"
    → You skipped step 2 of setup. Open the workflow in n8n UI, click
      each red-bordered node, and add the missing credential.

  Calendar event not created
    → GOOGLE_CALENDAR_ID in .env must match the exact Calendar ID from
      Google Calendar settings (NOT the calendar name).
    → The Google OAuth credential in n8n must have permission to write
      to that calendar.

  ngrok URL changed and bot stopped working
    → Free ngrok URLs change every time the container restarts.
      Each time you ./setup.sh, copy the new URL into Twilio Sandbox
      webhook settings.


PRODUCTION NOTE:
  Twilio's WhatsApp Sandbox is for testing. To go live with your own
  WhatsApp number you'll need to register a Twilio WhatsApp Sender (Meta
  approval required, takes ~1 week). The workflow stays the same — only
  TWILIO_FROM_NUMBER changes.

# Prompt Engineering Rules — A1 Driving School Bot

Reference these rules every time before editing the OpenAI Chat node's system prompt.
A prompt that follows these rules is **concise but complete** — no rambling, no missing edge cases.

---

## Top-level principles (in priority order)

### 1. State the role and goal in the first two lines
The model anchors hard on the opening. Don't bury the purpose.

✅ "You are the WhatsApp assistant for A1 Driving School… Your job: collect 6 fields and emit a booking JSON."
❌ "Hello! Today we will be discussing the various ways in which you can help students…"

### 2. Inject runtime context the model can't know
The model doesn't know today's date, the current time, the user's location, or live business state. Inject all of it via n8n expressions.

✅ `Today is {{ $now.toFormat('cccc d MMMM yyyy') }}. Current UK time: {{ $now.setZone('Europe/London').toFormat('HH:mm') }}.`
❌ "Today is 2024-01-15." (Hardcoded — wrong tomorrow.)

### 3. Specify output format with an exact template
For structured outputs, show the literal JSON the model must emit. Use placeholders only inside the strings.

✅ `{"intent":"book","name":"...","postcode":"...","gearbox":"...","testDate":"...","experience":"...","lessonDateTime":"..."}`
❌ "Output a JSON object with the booking details."

### 4. Use rigid, numbered turn structure for multi-message flows
Models drift. Force a fixed conversation arc.

✅ "MSG 1: ask for X+Y+Z. MSG 2: ask for A+B+C. MSG 3: emit JSON."
❌ "Have a natural conversation and collect all the info."

### 5. Lower the temperature for structured tasks
Default 1.0 is too creative. Use 0.2-0.4 for collect-and-format jobs. Higher for creative/empathetic chat.

### 6. Cap `max_tokens`
Forces brevity. Long prompts beget long replies. For short WhatsApp replies, cap at 300-600.

### 7. Prefer NEGATIVE rules with capitalised "NEVER"
`NEVER ask for confirmation` works better than `Try not to confirm too much`.

### 8. Repeat the critical rule in different words
Once = optional. Twice = important. Three times = inviolable. Use sparingly so it doesn't lose meaning.

### 9. Distinguish lookalike concepts explicitly
The model conflates similar things ("test date" vs "lesson date", "first name" vs "full name").
Spell the difference out: "TEST DATE and LESSON DATE are TWO DIFFERENT THINGS. testDate is when their driving exam is. lessonDateTime is when they want their first driving lesson with Zahid."

### 10. State edge cases AND the action to take
Don't leave the model to invent behaviour for outliers.

✅ "If the date is in the past, reply: 'That time has already passed.' Do NOT emit JSON."
❌ "Reject invalid dates."

### 11. Avoid contradictions
"Be brief" + "Always confirm with the student" creates a hung conversation. Audit for tension between rules.

### 12. Use delimiters for examples
Backticks for code, quotes for strings, blank lines between sections. The model uses visual structure as a parsing hint.

### 13. Locale assumptions belong in the prompt
"3/5/2026 means 3 May 2026, NOT 5 March." UK English bot should not silently apply US date conventions.

### 14. Anti-AI-disclosure
For consumer chat bots: "Never claim you're an AI. Never apologise for limitations as 'I'm just an AI'. Speak as a human assistant on Zahid's team."

---

## JSON-body specific gotchas (HTTP Request node, OpenAI API)

When the system prompt is inside the `jsonBody` of an HTTP Request node:

1. **Every `"` inside the prompt → `\"`** (escape the quotes — they collide with JSON string delimiters)
2. **Every newline → `\n`** (raw newlines break JSON parsing)
3. **Every backslash inside an example → `\\`**
4. **n8n expressions** (`{{ ... }}`) work inside the JSON string, but the values they return must also be valid inside a JSON string (numbers and ISO strings are fine; objects need `JSON.stringify`)
5. **For the user message, wrap dynamic content in `JSON.stringify(...)`** — this auto-escapes quotes and newlines that the student typed

Example user message line:
```
"content": {{ JSON.stringify('Conversation so far: ' + $json.history + ' New message: ' + $json.msg) }}
```
The `JSON.stringify` produces a quoted, escaped string — drops cleanly into the JSON body.

---

## Pre-flight checklist — run through before shipping prompt changes

Before saving a prompt change, walk this list:

- [ ] **Role and goal in first 2 lines?**
- [ ] **Today's date and current time injected via `$now`?**
- [ ] **Exact output template shown (JSON or otherwise)?**
- [ ] **Numbered turn structure for multi-message flows?**
- [ ] **`temperature` ≤ 0.4 for structured tasks?**
- [ ] **`max_tokens` capped to discourage essays?**
- [ ] **Critical rules use "NEVER" / "MUST" / "ONLY"?**
- [ ] **Lookalike concepts explicitly disambiguated?**
- [ ] **Each edge case has a stated action?**
- [ ] **Locale conventions (date format, currency, timezone) stated?**
- [ ] **No contradictions between rules?**
- [ ] **Inside JSON body: all `"` escaped as `\"`, all newlines as `\n`?**
- [ ] **Manually traced 4 test scenarios:**
  - [ ] First message ("hi") → bot asks 3 fields in one go
  - [ ] Partial answer (1 field given) → bot asks for the missing 2
  - [ ] All 6 fields given → bot emits ONLY the JSON, no preamble
  - [ ] Past lesson date → bot refuses with the rejection message
  - [ ] Stop / cancel → bot emits optout JSON

If any checkbox fails, fix before deploying.

---

## How the current prompt scores against these rules (as of latest workflow.json)

| Rule | Status |
|---|---|
| Role + goal in first 2 lines | ✅ |
| Runtime date+time injection | ✅ via `{{ $now.toFormat(...) }}` |
| Exact JSON template | ✅ |
| Numbered turn structure | ✅ MSG 1 / MSG 2 / MSG 3 |
| temperature ≤ 0.4 | ✅ 0.3 |
| max_tokens capped | ✅ 600 |
| NEVER on critical rules | ✅ multiple |
| Test date vs lesson date disambiguated | ✅ explicit |
| Past-date edge case | ✅ + workflow validation as backup |
| UK date format stated | ✅ "3/5/2026 means 3 May" |
| BST/GMT timezone stated | ✅ |
| Anti-AI-disclosure | ✅ |
| Locale (UK) | ✅ |
| Optout intent | ✅ |
| Voice/image rule | ✅ |
| Price-quoting rule | ✅ defers to Zahid |

If a future bug shows the model is misbehaving, find which rule it violates, strengthen that rule first, only then add new ones.

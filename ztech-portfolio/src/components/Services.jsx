import { useState } from 'react'
import SectionLabel from './SectionLabel'

const USE_CASES = {
  booking: {
    label: 'Booking & scheduling',
    title: 'Booking & scheduling bots',
    desc: 'AI dispatchers that fill calendars, handle reschedules, and run while you sleep — for clinics, salons, fitness studios, consultancies, and service-based agencies.',
    bullets: [
      'Auto-fills cancelled slots in under 60s',
      'WhatsApp · SMS · Web chat in one inbox',
      'Smart reminders cut no-shows by ~40%',
      'Plugs into Google Calendar & Stripe',
    ],
    chat: [
      { side: 'in',  text: 'Hi, do you have any slots this Saturday?' },
      { side: 'out', text: 'I have Sat 10:00 or 14:00 with Sam. Which works?', agent: true },
      { side: 'in',  text: 'Saturday 10 please.' },
      { side: 'out', text: 'Booked ✅ — confirmation sent. Hold £64 placed.', agent: true, mono: 'Calendar updated · Stripe hold £64.00' },
    ],
  },
  leads: {
    label: 'Lead qualification',
    title: 'Lead qualification agents',
    desc: 'Inbound forms, ads, and DMs — qualified, scored, and routed to the right rep before your morning coffee.',
    bullets: [
      'Replies to leads in under 60 seconds',
      'Scores fit & intent against your ICP',
      'Books discovery calls on calendar directly',
      'Pushes enriched contacts into your CRM',
    ],
    chat: [
      { side: 'in',  text: "Saw your ad. We're a 40-person SaaS." },
      { side: 'out', text: "Nice — what's the main bottleneck you're trying to solve?", agent: true },
      { side: 'in',  text: 'Onboarding is taking 3 weeks per customer.' },
      { side: 'out', text: 'Got it. Booked you with Zahid · Tue 14:00. Calendar invite sent.', agent: true, mono: 'Lead score: 87/100 · HubSpot updated' },
    ],
  },
  support: {
    label: 'Customer support',
    title: '24/7 support agents',
    desc: 'Tier-1 support that resolves 60% of tickets autonomously — and hands off cleanly with context when humans need to step in.',
    bullets: [
      'Trained on your help docs, transcripts, and brand voice',
      'Resolves password, billing, and how-to tickets instantly',
      'Escalates with full context — no repeat questions',
      'Logs every interaction to Zendesk / Intercom',
    ],
    chat: [
      { side: 'in',  text: 'I was charged twice for my subscription.' },
      { side: 'out', text: 'I see two charges on Apr 28 (£29 each). Refunding the duplicate now.', agent: true },
      { side: 'in',  text: 'Thanks!' },
      { side: 'out', text: 'Done ✅ — refund will land in 3–5 days. Anything else?', agent: true, mono: 'Stripe refund · ticket #4821 closed' },
    ],
  },
  ops: {
    label: 'Internal ops',
    title: 'Internal ops automations',
    desc: 'Quiet workflows that move data between Slack, Sheets, Notion, and your stack. Onboarding, reporting, approvals — handled.',
    bullets: [
      'Auto-generate weekly reports from raw data',
      'Slack-to-Notion sync for meeting notes & action items',
      'Approval flows with audit trails baked in',
      'Trigger anything from anywhere — Zapier-grade, but custom',
    ],
    chat: [
      { side: 'in',  text: "/standup yesterday's wins" },
      { side: 'out', text: 'Pulled 7 PRs merged, 3 deals closed (£24k), 12 tickets resolved.', agent: true },
      { side: 'in',  text: 'Post to #leadership please' },
      { side: 'out', text: 'Posted ✅ — added to the Monday digest queue.', agent: true, mono: 'Slack · Notion · GSheets synced' },
    ],
  },
}

const TAGS = ['WhatsApp Cloud API', 'Make', 'n8n', 'Twilio', 'OpenAI', 'Stripe', 'Slack']

const CAPABILITIES = [
  { k: 'Multichannel',  i: '◐', d: 'WhatsApp, SMS, web, email, Slack — your customers reach you where they already are.' },
  { k: 'Smart routing', i: '⌖', d: 'AI classifies every message — billing, support, sales — and sends it to the right place.' },
  { k: 'Tool-aware',    i: '◇', d: 'Reads and writes your CRM, calendar, payments, docs. Acts, not just chats.' },
]

export default function Services() {
  const [tab, setTab] = useState('booking')
  const uc = USE_CASES[tab]

  return (
    <section id="services" className="relative py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionLabel num="01" title="What we build" />

        <div className="reveal mt-6 flex items-end justify-between flex-wrap gap-6">
          <h2 className="display text-[clamp(36px,5vw,64px)] text-white max-w-2xl">
            One playbook,<br />
            <span className="accent-text">every workflow.</span>
          </h2>
          <p className="text-ink-dim max-w-md leading-relaxed">
            If a human is doing it the same way every day, we can automate it. Pick a use
            case below to see what a Z tech build looks like in practice.
          </p>
        </div>

        {/* Tabs */}
        <div className="reveal mt-10 flex flex-wrap gap-2">
          {Object.entries(USE_CASES).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-2 rounded-full text-[13px] mono uppercase tracking-wider transition-all ${
                tab === k
                  ? 'btn-primary'
                  : 'glass text-ink-dim hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="reveal mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Big card */}
          <div className="lg:col-span-7 min-w-0 glass-strong rounded-3xl p-8 lg:p-10 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.25), transparent 60%)' }}
            />

            <div className="flex items-center gap-3 mb-8">
              <span className="mono text-[11px] tracking-widest text-cyber uppercase">USE CASE</span>
              <span className="h-px flex-1 bg-[var(--line)]" />
              <span className="mono text-[11px] tracking-widest text-ink-faint uppercase">/{tab}</span>
            </div>

            <h3 className="display text-[clamp(30px,4vw,52px)] text-white">
              <span className="accent-text">{uc.title}</span>
            </h3>

            <p className="mt-6 text-ink-dim max-w-xl text-base lg:text-lg leading-relaxed">
              {uc.desc}
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-4">
              {uc.bullets.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="check-dot mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm text-ink">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <span key={t} className="glass mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md text-ink-dim">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Chat preview */}
          <div className="lg:col-span-5 min-w-0 glass rounded-3xl p-2 relative overflow-hidden">
            <div className="rounded-2xl bg-bg1 h-full p-5 flex flex-col">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--line)]">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="mono text-[11px] text-ink-faint ml-2">{uc.label.toLowerCase()} · live thread</span>
                <span className="ml-auto mono text-[10px] text-emerald-400">● online</span>
              </div>
              <div className="flex-1 mt-4 space-y-3 text-sm">
                {uc.chat.map((m, i) => (
                  <Bubble key={i} side={m.side} agent={m.agent}>
                    {m.text}
                    {m.mono && (
                      <>
                        <br />
                        <span className="mono text-[11px] text-cyber">{m.mono}</span>
                      </>
                    )}
                  </Bubble>
                ))}
                <div className="flex items-center gap-1.5 mt-2 mono text-[10px] text-ink-faint">
                  <span className="w-1 h-1 rounded-full bg-ink-faint animate-pulse" />
                  <span className="w-1 h-1 rounded-full bg-ink-faint animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 h-1 rounded-full bg-ink-faint animate-pulse" style={{ animationDelay: '0.4s' }} />
                  bot is typing…
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capability strip — universal */}
        <div className="reveal mt-8 grid md:grid-cols-3 gap-4">
          {CAPABILITIES.map((c) => (
            <div key={c.k} className="glass rounded-2xl p-6">
              <div className="mono text-[11px] uppercase tracking-widest text-cyber mb-3 flex items-center gap-2">
                <span className="text-base">{c.i}</span> {c.k}
              </div>
              <div className="text-sm text-ink-dim leading-relaxed">{c.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Bubble({ side, agent, children }) {
  const isOut = side === 'out'
  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug ${
          isOut
            ? 'bg-gradient-to-br from-cyber to-electric text-bg0 rounded-br-sm'
            : 'bg-bg2 border border-[var(--line)] text-ink rounded-bl-sm'
        }`}
      >
        {agent && <div className="mono text-[10px] uppercase tracking-widest mb-1 opacity-70">Z·BOT</div>}
        {children}
      </div>
    </div>
  )
}

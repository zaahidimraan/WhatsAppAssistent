import SectionLabel from './SectionLabel'

const FEATURES = [
  'Auto-fills cancelled slots in under 60s',
  'WhatsApp · SMS · Email triage in one inbox',
  'Smart reminders cut no-shows by ~40%',
  'Plugs into Google Calendar & Stripe',
]

const TAGS = ['WhatsApp Cloud API', 'Make', 'n8n', 'Twilio', 'Google Calendar', 'Stripe']

const CAPABILITIES = [
  { k: 'Auto-rebook', i: '↻', d: 'When a student cancels, the next student on the waitlist is auto-offered the slot.' },
  { k: 'Smart triage', i: '⌖', d: 'Filters trial enquiries, payment issues, and ADI handoffs into the right queue.' },
  { k: 'Calendar sync', i: '◇', d: "Bi-directional with Google Calendar — block your gym, the bot won't book you." },
]

export default function Services() {
  return (
    <section id="services" className="relative py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionLabel num="01" title="Featured service" />

        <div className="reveal mt-8 grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Big card */}
          <div className="lg:col-span-7 glass-strong rounded-3xl p-8 lg:p-10 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.25), transparent 60%)' }}
            />

            <div className="flex items-center gap-3 mb-8">
              <span className="mono text-[11px] tracking-widest text-cyber uppercase">FLAGSHIP</span>
              <span className="h-px flex-1 bg-[var(--line)]" />
              <span className="mono text-[11px] tracking-widest text-ink-faint uppercase">/booking-bot</span>
            </div>

            <h2 className="display text-[clamp(36px,5vw,64px)] text-white">
              Driving School<br />
              <span className="accent-text">Booking Bot.</span>
            </h2>

            <p className="mt-6 text-ink-dim max-w-xl text-base lg:text-lg leading-relaxed">
              An AI dispatcher that answers WhatsApp, books lessons, reschedules cancellations,
              and keeps your students moving — without you ever picking up the phone.
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-4">
              {FEATURES.map((t) => (
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
          <div className="lg:col-span-5 glass rounded-3xl p-2 relative overflow-hidden">
            <div className="rounded-2xl bg-bg1 h-full p-5 flex flex-col">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--line)]">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="mono text-[11px] text-ink-faint ml-2">student · live thread</span>
                <span className="ml-auto mono text-[10px] text-emerald-400">● online</span>
              </div>
              <div className="flex-1 mt-4 space-y-3 text-sm">
                <Bubble side="in">Hi, do you have any 2-hour slots this Saturday?</Bubble>
                <Bubble side="out" agent>
                  Hey Maya 👋 I have <b>Sat 10:00–12:00</b> or <b>14:00–16:00</b> with instructor Sam (manual). Which works?
                </Bubble>
                <Bubble side="in">Saturday 10 please.</Bubble>
                <Bubble side="out" agent>
                  Booked ✅ — Sat 26 Apr · 10:00 with Sam. Pickup: 14 Bromley Rd.<br />
                  <span className="mono text-[11px] text-cyber">Calendar updated · Stripe hold £64.00</span>
                </Bubble>
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

        {/* Capability strip */}
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

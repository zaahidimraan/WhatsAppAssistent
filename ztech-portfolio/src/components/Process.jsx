import SectionLabel from './SectionLabel'

const STEPS = [
  ['Discover', '1 call. We map your booking flow & edge cases.'],
  ['Build', 'Custom workflow on Make / n8n with your tools.'],
  ['Train', 'We feed it your transcripts so it sounds like you.'],
  ['Hand-off', 'You get the workflow, dashboards, and a 90-day SLA.'],
]

const MARQUEE_TOOLS = [
  'WhatsApp Cloud API', 'Make.com', 'n8n', 'Twilio', 'OpenAI',
  'Google Calendar', 'Stripe', 'Supabase', 'Airtable', 'Zapier',
]

export default function Process() {
  return (
    <section id="process" className="relative py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <SectionLabel num="03" title="How we ship" />
          <h2 className="reveal mt-6 display text-[clamp(36px,5vw,60px)] text-white">
            We don't sell<br />
            <span className="accent-text">black boxes.</span>
          </h2>
          <p className="reveal mt-6 text-ink-dim leading-relaxed max-w-md">
            You see the workflow. Every Z tech build runs on tools you can audit and own —
            <span className="text-white"> Make</span>,
            <span className="text-white"> n8n</span>,
            <span className="text-white"> Twilio</span>, and
            <span className="text-white"> WhatsApp Cloud API</span>.
            No proprietary lock-in, no opaque magic. Just nodes, triggers, and your keys.
          </p>

          <ol className="reveal mt-10 space-y-5">
            {STEPS.map(([k, d], i) => (
              <li key={k} className="flex gap-4">
                <div className="mono text-[11px] tracking-widest text-ink-faint w-8 pt-1">
                  0{i + 1}
                </div>
                <div>
                  <div className="text-white font-medium">{k}</div>
                  <div className="text-sm text-ink-dim mt-0.5">{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-7 reveal">
          <WorkflowDiagram />

          {/* Marquee */}
          <div className="mt-6 overflow-hidden glass rounded-2xl py-4">
            <div className="marquee-track mono text-[11px] uppercase tracking-widest text-ink-dim">
              {Array.from({ length: 2 }).flatMap((_, k) =>
                MARQUEE_TOOLS.map((t, i) => (
                  <span key={`${k}-${i}`} className="flex items-center gap-3">
                    <span>◆</span> {t}
                  </span>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────── WORKFLOW DIAGRAM (Make / n8n style scenario) ─────────── */
function WorkflowDiagram() {
  const nodes = [
    { id: 'wa',  col: 0, row: 1,   label: 'WhatsApp Cloud', sub: 'Trigger · message_in', tone: 'cyber',    icon: '◐' },
    { id: 'twi', col: 0, row: 2,   label: 'Twilio SMS',     sub: 'Trigger · sms_in',     tone: 'cyber',    icon: '◑' },
    { id: 'ai',  col: 1, row: 1.5, label: 'AI Router',      sub: 'OpenAI · classify',    tone: 'electric', icon: '✦' },
    { id: 'cal', col: 2, row: 0.5, label: 'Calendar',       sub: 'Google · find_slot',   tone: 'neutral',  icon: '▣' },
    { id: 'pay', col: 2, row: 1.5, label: 'Stripe',         sub: 'create_hold',          tone: 'neutral',  icon: '◇' },
    { id: 'db',  col: 2, row: 2.5, label: 'Supabase',       sub: 'log + waitlist',       tone: 'neutral',  icon: '◈' },
    { id: 'out', col: 3, row: 1.5, label: 'Reply',          sub: 'WhatsApp · confirm',   tone: 'electric', icon: '→' },
  ]
  const edges = [
    ['wa', 'ai'], ['twi', 'ai'],
    ['ai', 'cal'], ['ai', 'pay'], ['ai', 'db'],
    ['cal', 'out'], ['pay', 'out'], ['db', 'out'],
  ]

  const W = 720, H = 420, padX = 50, padY = 40
  const colW = (W - padX * 2) / 3
  const rowH = 90
  const pos = (id) => {
    const n = nodes.find((x) => x.id === id)
    return { x: padX + n.col * colW, y: padY + n.row * rowH }
  }
  const tone = (t) => (t === 'cyber' ? 'var(--cyber)' : t === 'electric' ? 'var(--electric)' : 'rgba(255,255,255,0.55)')

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="mono text-[11px] text-ink-faint ml-2">make · scenario / driving-school-bot</span>
        <span className="ml-auto mono text-[10px] text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE
        </span>
      </div>

      {/* Canvas */}
      <div
        className="relative p-5"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <defs>
            <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.7" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#a855f7" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map(([a, b], i) => {
            const p1 = pos(a), p2 = pos(b)
            const x1 = p1.x + 130, y1 = p1.y + 30
            const x2 = p2.x, y2 = p2.y + 30
            const mx = (x1 + x2) / 2
            const d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="url(#edge-grad)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <circle r="3" fill="#7dd3fc">
                  <animateMotion dur={`${2.4 + (i % 3) * 0.6}s`} repeatCount="indefinite" path={d} />
                </circle>
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const p = pos(n.id)
            return (
              <g key={n.id} transform={`translate(${p.x},${p.y})`}>
                <rect x="0" y="0" width="130" height="60" rx="10"
                  fill="rgba(17,20,31,0.92)"
                  stroke={tone(n.tone)} strokeOpacity="0.55" strokeWidth="1" />
                <rect x="8" y="10" width="22" height="22" rx="6"
                  fill="rgba(255,255,255,0.04)" stroke={tone(n.tone)} strokeOpacity="0.7" />
                <text x="19" y="26" textAnchor="middle" fontSize="13" fill={tone(n.tone)}>
                  {n.icon}
                </text>
                <text x="38" y="24" fontSize="12" fontWeight="600" fill="#e8ecf5"
                  fontFamily="Space Grotesk, sans-serif">{n.label}</text>
                <text x="38" y="40" fontSize="9.5" fill="#8a93a8"
                  fontFamily="JetBrains Mono, monospace" letterSpacing="0.5">{n.sub}</text>
                <circle cx="120" cy="12" r="2.5" fill="#34d399">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            )
          })}

          {/* Lane labels */}
          {['TRIGGER', 'ROUTE', 'ACT', 'RESPOND'].map((t, i) => (
            <text
              key={t}
              x={padX + i * colW + 65}
              y={20}
              textAnchor="middle"
              fontSize="9"
              letterSpacing="2"
              fontFamily="JetBrains Mono, monospace"
              fill="rgba(255,255,255,0.35)"
            >
              {t}
            </text>
          ))}
        </svg>

        <div className="mt-3 flex items-center justify-between mono text-[10px] uppercase tracking-widest text-ink-faint">
          <span>8 modules · 3 triggers · 0 errors</span>
          <span>last run · 12s ago</span>
        </div>
      </div>
    </div>
  )
}

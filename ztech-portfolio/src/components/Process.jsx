import SectionLabel from './SectionLabel'

const STEPS = [
  ['Discover', '1 call. We map your workflow & edge cases.'],
  ['Build', 'Custom scenario on Make / n8n with your tools.'],
  ['Train', 'We feed it your data so it sounds like your team.'],
  ['Hand-off', 'You get the workflow, dashboards, and a 90-day SLA.'],
]

const MARQUEE_TOOLS = [
  'WhatsApp Cloud API', 'Make.com', 'n8n', 'Twilio', 'OpenAI',
  'Google Calendar', 'Stripe', 'HubSpot', 'Slack', 'Airtable', 'Zapier', 'Notion',
]

export default function Process() {
  return (
    <section id="process" className="relative py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 min-w-0">
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

        <div className="lg:col-span-7 min-w-0 reveal">
          <WorkflowDiagram />

          {/* Marquee */}
          <div className="mt-6 overflow-hidden glass rounded-2xl py-4 px-6">
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

/* ─────────── WORKFLOW DIAGRAM (Make / n8n style scenario, generalized) ─────────── */
function WorkflowDiagram() {
  const nodes = [
    { id: 'wa',  col: 0, row: 0.7, label: 'WhatsApp Cloud', sub: 'Trigger · message_in', tone: 'cyber',    icon: '◐' },
    { id: 'twi', col: 0, row: 2.3, label: 'Web form',       sub: 'Trigger · submit',     tone: 'cyber',    icon: '◑' },
    { id: 'ai',  col: 1, row: 1.5, label: 'AI Router',      sub: 'OpenAI · classify',    tone: 'electric', icon: '✦' },
    { id: 'cal', col: 2, row: 0.2, label: 'Calendar',       sub: 'Google · find_slot',   tone: 'neutral',  icon: '▣' },
    { id: 'pay', col: 2, row: 1.5, label: 'CRM',            sub: 'HubSpot · upsert',     tone: 'neutral',  icon: '◇' },
    { id: 'db',  col: 2, row: 2.8, label: 'Database',       sub: 'log + enrich',         tone: 'neutral',  icon: '◈' },
    { id: 'out', col: 3, row: 1.5, label: 'Reply',          sub: 'Multi-channel out',    tone: 'electric', icon: '→' },
  ]
  const edges = [
    ['wa', 'ai'], ['twi', 'ai'],
    ['ai', 'cal'], ['ai', 'pay'], ['ai', 'db'],
    ['cal', 'out'], ['pay', 'out'], ['db', 'out'],
  ]

  const W = 760, H = 420
  const NODE_W = 130, NODE_H = 60
  const padX = 24, padY = 40
  const colW = (W - padX * 2 - NODE_W) / 3
  const rowH = 86
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
        <span className="mono text-[11px] text-ink-faint ml-2">make · scenario / z-tech-workflow</span>
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
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#a855f7" />
            </marker>
          </defs>

          {/* Edges — start just outside source's right edge, end just outside target's left edge */}
          {edges.map(([a, b], i) => {
            const p1 = pos(a), p2 = pos(b)
            const x1 = p1.x + NODE_W + 2
            const y1 = p1.y + NODE_H / 2
            const x2 = p2.x - 8
            const y2 = p2.y + NODE_H / 2
            const dx = (x2 - x1) * 0.5
            const d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="url(#edge-grad)" strokeWidth="1.6" markerEnd="url(#arrow)" />
                {/* Socket dot at source — reads as a true connection point */}
                <circle cx={x1} cy={y1} r="2.5" fill="#7dd3fc" />
                {/* Animated data pulse */}
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
                <rect x="0" y="0" width={NODE_W} height={NODE_H} rx="10"
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
              x={padX + i * colW + NODE_W / 2}
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

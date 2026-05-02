import Orb from './Orb'
import CornerFrame from './CornerFrame'

const STATS = [
  ['−70%', 'manual hours saved'],
  ['24/7', 'always on'],
  ['< 30s', 'avg response'],
  ['14d', 'from brief to live'],
]

export default function Hero({ orbVariant, mouse }) {
  return (
    <section id="top" className="relative pt-28 pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg radial-fade" />
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.16), transparent 60%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Eyebrow chip */}
        <div className="fade-in-up flex items-center justify-center gap-2 mb-8">
          <span className="glass rounded-full px-3.5 py-1.5 text-[11px] mono tracking-wider text-ink-dim flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-cyber opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-cyber" />
            </span>
            AI · WORKFLOW AUTOMATION · CUSTOM BOTS
          </span>
        </div>

        {/* Headline */}
        <h1 className="fade-in-up display text-center text-[clamp(48px,9vw,128px)] mx-auto max-w-5xl">
          <span className="gradient-text">Z tech.</span><br />
          <span className="text-white">The Future of</span><br />
          <span className="accent-text italic font-light">Automation.</span>
        </h1>

        <p
          className="fade-in-up mt-8 text-center text-lg lg:text-xl text-ink-dim max-w-2xl mx-auto leading-relaxed"
          style={{ animationDelay: '0.15s' }}
        >
          We build intelligent systems that move businesses forward. AI agents and workflows
          that handle the repetitive work — so your team can focus on the work that matters.
        </p>

        <div
          className="fade-in-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          style={{ animationDelay: '0.25s' }}
        >
          <a href="#services" className="btn-primary px-6 py-3.5 rounded-lg flex items-center gap-2">
            See what we build
            <span className="mono text-xs opacity-70">↗</span>
          </a>
          <a href="#contact" className="btn-ghost rounded-lg px-6 py-3.5 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available · May 2026
          </a>
        </div>

        {/* Hero orb */}
        <div className="relative mt-20 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[680px] h-[680px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.12), transparent 60%)' }}
            />
          </div>
          <div className="scene-3d">
            <Orb variant={orbVariant} size={520} intensity={1} mouse={mouse} />
          </div>
          <CornerFrame />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 mono text-[10px] tracking-widest text-ink-faint uppercase whitespace-nowrap">
            ◇ interactive · drag · responds to cursor
          </div>
        </div>

        {/* Stats strip — universal */}
        <div className="reveal mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--line)] rounded-2xl overflow-hidden">
          {STATS.map(([n, l]) => (
            <div key={l} className="bg-bg1 p-6 lg:p-8">
              <div className="display text-3xl lg:text-5xl text-white">{n}</div>
              <div className="mt-1 mono text-[11px] uppercase tracking-wider text-ink-faint">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

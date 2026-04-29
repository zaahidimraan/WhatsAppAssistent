import Orb from './Orb'
import SectionLabel from './SectionLabel'

const PILLARS = [
  ['LISTEN', 'Multichannel intake — WhatsApp, web, email.'],
  ['DECIDE', 'Agent reasoning across calendar + history.'],
  ['ACT', 'Books, replies, charges, learns. Repeat.'],
]

export default function Mind({ orbVariant, mouse }) {
  return (
    <section id="mind" className="relative py-32 lg:py-44 overflow-hidden">
      {/* Huge orb behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="scene-3d opacity-60">
          <Orb variant={orbVariant} size={760} intensity={0.7} mouse={mouse} />
        </div>
      </div>

      {/* Gradient veil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(5,6,10,0.6) 60%, rgba(5,6,10,0.95) 100%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <SectionLabel num="02" title="The 3D Mind" centered />

        <h2 className="reveal mt-8 display text-[clamp(40px,7vw,96px)] text-white">
          A digital nervous<br />
          system, <span className="accent-text italic font-light">always thinking.</span>
        </h2>

        <p className="reveal mt-8 text-lg text-ink-dim max-w-2xl mx-auto leading-relaxed">
          Every Z tech build is wired to a central reasoning core — a network of agents that
          listen, decide, and act. It learns your school's tone, your instructors' schedules,
          and your students' patterns.
        </p>

        <div className="reveal mt-12 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {PILLARS.map(([k, d]) => (
            <div key={k} className="glass rounded-xl p-5 text-left">
              <div className="mono text-[11px] tracking-widest text-electric-glow">{k}</div>
              <div className="mt-2 text-sm text-ink-dim leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

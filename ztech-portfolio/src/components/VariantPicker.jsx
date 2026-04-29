const OPTIONS = [
  { value: 'sphere', label: 'Wireframe' },
  { value: 'brain', label: 'Neural' },
  { value: 'torus', label: 'Knot' },
]

export default function VariantPicker({ value, onChange }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 hidden md:block">
      <div className="glass-strong rounded-xl px-1.5 py-1.5 flex items-center gap-1">
        <span className="mono text-[10px] uppercase tracking-widest text-ink-faint px-2">3D</span>
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`mono text-[11px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-colors ${
              value === o.value
                ? 'bg-gradient-to-r from-cyber to-electric text-bg0 font-semibold'
                : 'text-ink-dim hover:text-white'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

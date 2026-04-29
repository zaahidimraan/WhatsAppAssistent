export default function SectionLabel({ num, title, centered = false }) {
  return (
    <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
      <span className="mono text-[11px] tracking-widest text-cyber uppercase">{num}</span>
      <span className="h-px w-10 bg-[var(--line-strong)]" />
      <span className="mono text-[11px] tracking-widest text-ink-dim uppercase">{title}</span>
    </div>
  )
}

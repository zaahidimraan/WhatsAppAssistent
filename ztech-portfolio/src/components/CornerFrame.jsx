export default function CornerFrame() {
  const positions = [
    { cls: 'top-0 left-0', borders: 'border-l border-t' },
    { cls: 'top-0 right-0', borders: 'border-r border-t' },
    { cls: 'bottom-0 left-0', borders: 'border-l border-b' },
    { cls: 'bottom-0 right-0', borders: 'border-r border-b' },
  ]
  return (
    <>
      {positions.map((p) => (
        <div key={p.cls} className={`absolute ${p.cls} w-6 h-6 pointer-events-none`}>
          <div className={`absolute inset-0 ${p.borders} border-[var(--line-strong)]`} />
        </div>
      ))}
    </>
  )
}

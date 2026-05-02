import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 nav-blur"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <div
            className="relative w-8 h-8 rounded-lg overflow-hidden ring-glow flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)' }}
          >
            <span className="text-bg0 font-bold text-sm">Z</span>
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-semibold tracking-tight">Z tech</div>
            <div className="mono text-[10px] text-ink-faint tracking-wider mt-0.5">v.2026</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-dim">
          <a href="#services" className="hover:text-white transition-colors">What we build</a>
          <a href="#mind" className="hover:text-white transition-colors">The 3D Mind</a>
          <a href="#process" className="hover:text-white transition-colors">Process</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <a href="#contact" className="btn-primary px-4 py-2 rounded-lg text-sm">
          Book a call →
        </a>
      </div>
    </motion.header>
  )
}

import SectionLabel from './SectionLabel'

export default function Contact() {
  return (
    <section id="contact" className="relative pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.18), transparent 65%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <SectionLabel num="04" title="Get in touch" />

        <div className="grid lg:grid-cols-12 gap-10 mt-10">
          <div className="lg:col-span-7">
            <h2 className="display text-[clamp(40px,7vw,96px)] text-white leading-[0.92]">
              Let's automate<br />
              <span className="accent-text italic font-light">what slows you down.</span>
            </h2>
            <p className="mt-6 text-lg text-ink-dim max-w-xl leading-relaxed">
              One short call. We'll tell you within 20 minutes whether automation will move
              the needle for your school — or whether it won't.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="tel:07459267916"
                className="btn-primary px-6 py-3.5 rounded-lg flex items-center gap-2"
              >
                <PhoneIcon />
                Call · 07459 267916
              </a>
              <a
                href="mailto:zaahidimraan@gmail.com"
                className="btn-ghost rounded-lg px-6 py-3.5 text-sm flex items-center gap-2"
              >
                <MailIcon />
                zaahidimraan@gmail.com
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-strong rounded-2xl p-7">
              <div className="mono text-[11px] tracking-widest text-cyber">FOUNDER</div>
              <div className="mt-2 text-2xl text-white font-semibold">Zahid Imran</div>
              <div className="text-sm text-ink-dim mt-1">Founder &amp; lead engineer · Z tech</div>

              <div className="h-px bg-[var(--line)] my-6" />

              <dl className="space-y-4 text-sm">
                <Row k="Phone">
                  <a href="tel:07459267916" className="text-white hover:text-cyber transition-colors">
                    07459 267916
                  </a>
                </Row>
                <Row k="Email">
                  <a href="mailto:zaahidimraan@gmail.com" className="text-white hover:text-cyber transition-colors">
                    zaahidimraan@gmail.com
                  </a>
                </Row>
                <Row k="Hours">
                  <span className="text-white">Mon–Fri · 09:00–18:00 GMT</span>
                </Row>
                <Row k="Response">
                  <span className="text-white">&lt; 4 hours, weekdays</span>
                </Row>
              </dl>
            </div>
          </div>
        </div>

        {/* Mega wordmark */}
        <div className="mt-24 select-none pointer-events-none">
          <div
            className="display text-[clamp(80px,22vw,360px)] leading-none text-center"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(168,85,247,0.4) 60%, rgba(56,189,248,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Z·tech
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--line)] mono text-[11px] text-ink-faint uppercase tracking-widest">
          <div>© 2026 Z tech · all systems automated</div>
          <div className="flex gap-6 flex-wrap justify-center">
            <span>Built in the UK</span>
            <span>v.2026.05</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ k, children }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <dt className="mono text-[11px] uppercase tracking-widest text-ink-faint">{k}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}

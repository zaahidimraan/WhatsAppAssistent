import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Mind from './components/ThreeMind'
import Process from './components/Process'
import Contact from './components/Footer'
import VariantPicker from './components/VariantPicker'
import useReveal from './hooks/useReveal'

export default function App() {
  const [orbVariant, setOrbVariant] = useState('sphere')
  const mouse = useRef({ x: 0, y: 0 })

  // Mouse tracking for orb tilt — ref-based so updates don't re-render
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Scroll-triggered .reveal animations
  useReveal()

  return (
    <div className="grain bg-bg0 text-ink min-h-screen">
      <Navbar />
      <main className="relative z-10">
        <Hero orbVariant={orbVariant} mouse={mouse} />
        <Services />
        <Mind orbVariant={orbVariant} mouse={mouse} />
        <Process />
        <Contact />
      </main>
      <VariantPicker value={orbVariant} onChange={setOrbVariant} />
    </div>
  )
}

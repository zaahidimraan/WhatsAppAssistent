import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

/* ───────── WIRE SPHERE ───────── */
function WireSphere() {
  const ref = useRef()
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.22
  })
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1.6, 28, 16]} />
        <meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[0.3, 0.4, 0]}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.65} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.85} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.06} />
      </mesh>
    </group>
  )
}

/* ───────── BRAIN / NEURAL NETWORK ───────── */
function BrainNode() {
  const ref = useRef()

  const { points, edges } = useMemo(() => {
    const n = 28
    const r = 1.6
    const pts = []
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      pts.push(
        new THREE.Vector3(
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi),
        ),
      )
    }
    const eds = []
    for (let i = 0; i < pts.length; i++) {
      const ds = pts
        .map((p, j) => ({ j, d: pts[i].distanceTo(p) }))
        .filter((d) => d.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
      ds.forEach((d) => eds.push([pts[i], pts[d.j]]))
    }
    return { points: pts, edges: eds }
  }, [])

  useFrame((state, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.18
    ref.current.rotation.x += dt * 0.04
  })

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.05} />
      </mesh>

      {edges.map(([a, b], i) => (
        <Edge key={i} from={a} to={b} />
      ))}

      {points.map((p, i) => (
        <NodeDot key={i} pos={p} accent={i % 3 === 0} seed={i} />
      ))}
    </group>
  )
}

function Edge({ from, to }) {
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints([from, to]), [from, to])
  return (
    <line geometry={geom}>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.4} />
    </line>
  )
}

function NodeDot({ pos, accent, seed }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + seed * 0.7
    ref.current.material.opacity = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.6))
  })
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color={accent ? '#a855f7' : '#38bdf8'} transparent opacity={0.8} />
    </mesh>
  )
}

/* ───────── TORUS KNOT ───────── */
function TorusKnot() {
  const ref = useRef()
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.x += dt * 0.35
    ref.current.rotation.y += dt * 0.45
    ref.current.rotation.z += dt * 0.12
  })
  return (
    <group ref={ref}>
      <mesh>
        <torusKnotGeometry args={[0.95, 0.28, 220, 28, 2, 3]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#a855f7"
          emissiveIntensity={0.6}
          metalness={0.65}
          roughness={0.18}
          wireframe={false}
        />
      </mesh>
      <mesh>
        <torusKnotGeometry args={[0.95, 0.29, 110, 14, 2, 3]} />
        <meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

/* ───────── INTERACTIVE GROUP ───────── */
function InteractiveGroup({ variant, mouse }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (!ref.current) return
    const tx = mouse.current.y * -0.25
    const ty = mouse.current.x * 0.32
    ref.current.rotation.x += (tx - ref.current.rotation.x) * 0.08
    ref.current.rotation.y += (ty - ref.current.rotation.y) * 0.08
    ref.current.position.y = Math.sin(performance.now() / 1400) * 0.12
  })
  return (
    <group ref={ref}>
      {variant === 'sphere' && <WireSphere />}
      {variant === 'brain' && <BrainNode />}
      {variant === 'torus' && <TorusKnot />}
    </group>
  )
}

/* ───────── ORBITING PARTICLES (CSS, like the design) ───────── */
function Particles({ size }) {
  const items = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        r: size * (0.3 + Math.random() * 0.28),
        delay: Math.random() * -20,
        dur: 14 + Math.random() * 14,
        s: 2 + Math.random() * 3,
        color: i % 3 === 0 ? '#a855f7' : '#38bdf8',
      })),
    [size],
  )
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {items.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.s,
            height: p.s,
            background: p.color,
            boxShadow: `0 0 ${p.s * 3}px ${p.color}`,
            '--r': `${p.r}px`,
            animation: `orbit ${p.dur}s linear infinite`,
            animationDelay: `${p.delay}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  )
}

/* ───────── PUBLIC ORB ───────── */
export default function Orb({ variant = 'sphere', size = 480, intensity = 1, mouse }) {
  return (
    <div
      className="relative orb-wrap"
      style={{ width: size, height: size }}
    >
      {/* Soft glow halos behind the canvas — match the design's CSS halos */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, rgba(56,189,248,0.55) 0%, rgba(56,189,248,0) 55%)',
          filter: 'blur(40px)',
          opacity: 0.9 * intensity,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 65% 70%, rgba(168,85,247,0.55) 0%, rgba(168,85,247,0) 60%)',
          filter: 'blur(50px)',
          opacity: 0.9 * intensity,
        }}
      />

      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[5, 5, 5]} color="#38bdf8" intensity={1.2 * intensity} />
        <pointLight position={[-5, -5, 5]} color="#a855f7" intensity={1.0 * intensity} />
        <Suspense fallback={null}>
          <InteractiveGroup variant={variant} mouse={mouse} />
        </Suspense>
      </Canvas>

      <Particles size={size} />
    </div>
  )
}

import { useRef, useMemo, useState } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { Sphere, Sparkles, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSpaceStore } from '@/store/space-store'
import { SunMaterial } from './planet-shaders'

extend({ SunMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    sunMaterial: JSX.IntrinsicElements['shaderMaterial'] & {
      uColorPrimary?: THREE.Color
      uColorSecondary?: THREE.Color
      uIntensity?: number
      uTime?: number
    }
  }
}

export function Sun3D() {
  const { openHelp, setCursorVariant } = useSpaceStore()
  const sunRef = useRef<THREE.Mesh>(null)
  const sunMatRef = useRef<THREE.ShaderMaterial>(null)
  const [hovered, setHovered] = useState(false)

  const colPrimary = useMemo(() => new THREE.Color('#FFF5D0'), [])
  const colSecondary = useMemo(() => new THREE.Color('#FF4500'), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002
      sunRef.current.rotation.z += 0.001
    }

    if (sunMatRef.current) {
      sunMatRef.current.uniforms.uTime.value = t
    }
  })

  return (
    <group>
      <Sphere args={[6.5, 32, 32]}>
        <meshBasicMaterial
          color="#ff7a1a"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      <mesh
        ref={sunRef}
        onClick={(e) => {
          e.stopPropagation()
          openHelp()
        }}
        onPointerEnter={() => {
          setHovered(true)
          setCursorVariant('planet')
        }}
        onPointerLeave={() => {
          setHovered(false)
          setCursorVariant('default')
        }}
      >
        <sphereGeometry args={[4.5, 128, 128]} />
        <sunMaterial
          ref={sunMatRef}
          uColorPrimary={colPrimary}
          uColorSecondary={colSecondary}
          uIntensity={4.5}
        />
      </mesh>

      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const r = 4.8 + (i % 3) * 0.4
        return (
          <SolarFlare
            key={i}
            basePos={[Math.cos(angle) * r, Math.sin(angle) * r, Math.sin(angle * 0.4) * r * 0.6]}
            delay={i * 0.3}
            size={0.15 + (i % 4) * 0.08}
          />
        )
      })}

      <Sparkles count={320} scale={[14, 14, 14]} size={3.8} speed={0.9} color="#FFF4D6" opacity={0.65} />
      <Sparkles count={180} scale={[9, 9, 9]} size={5.4} speed={0.55} color="#FF7A1A" opacity={0.85} />

      <Html
        position={[0, 11, 0]}
        transform
        sprite
        center
        distanceFactor={14}
        zIndexRange={[20, 0]}
        pointerEvents="none"
      >
        <div
          className={`planet-label planet-label-help ${hovered ? 'planet-label-hovered' : ''}`}
          style={{ '--planet-accent': '#FFD67A' } as React.CSSProperties}
        >
          <div className="planet-label-kicker">Navigation beacon</div>
          <div className="planet-label-name">AJUDA</div>
          <div className="planet-label-subtitle">Centro de orientação</div>
          <div className="planet-label-description">Clique no sol para entender como navegar</div>
        </div>
      </Html>

      <pointLight position={[0, 0, 0]} intensity={22} color="#FFF1D8" distance={520} decay={1.45} />
      <pointLight position={[0, 0, 0]} intensity={8} color="#FF5A1F" distance={110} decay={2.4} />
    </group>
  )
}

interface SolarFlareProps {
  basePos: [number, number, number]
  delay: number
  size: number
}

function SolarFlare({ basePos, delay, size }: SolarFlareProps) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + delay
    if (ref.current) {
      const pulse = 0.6 + Math.abs(Math.sin(t * 1.5)) * 0.8
      ref.current.scale.setScalar(pulse)
      ref.current.position.set(
        basePos[0] + Math.sin(t * 1.2) * 0.8,
        basePos[1] + Math.cos(t * 0.9) * 0.8,
        basePos[2] + Math.sin(t * 1.4) * 0.6
      )
    }
  })

  return (
    <mesh ref={ref} position={basePos}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color="#FFB800" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

export function ShootingStar() {
  const ref = useRef<THREE.Group>(null)
  const trailRef = useRef<THREE.Mesh>(null)

  const { start, dir, delay } = useMemo(() => ({
    start: new THREE.Vector3(
      (Math.random() - 0.5) * 400,
      60 + Math.random() * 100,
      (Math.random() - 0.5) * 300 - 100
    ),
    dir: new THREE.Vector3(
      -0.8 + Math.random() * 0.6,
      -0.3 - Math.random() * 0.5,
      -0.2 + Math.random() * 0.5
    ).normalize(),
    delay: Math.random() * 15,
  }), [])

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() + delay) % 18
    if (ref.current) {
      if (t < 2.5) {
        const progress = t / 2.5
        ref.current.position.copy(start).addScaledVector(dir, progress * 240)
        ref.current.visible = progress > 0.05
        if (trailRef.current) trailRef.current.scale.set(1, 1, 1 + progress * 35)
      } else {
        ref.current.visible = false
      }
    }
  })

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={1.0} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={trailRef} position={[0, 0, 1.0]}>
        <cylinderGeometry args={[0.08, 0.0, 2, 8]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

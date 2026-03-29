import { useRef, useState, useMemo, MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useSpaceStore } from '@/store/space-store'
import type { Planet } from '@/data/portfolio'

interface Planet3DProps {
  planet: Planet
  initialAngle: number
  angleRef: MutableRefObject<Record<string, number>>
}

export function Planet3D({ planet, initialAngle, angleRef }: Planet3DProps) {
  const { activePlanet, setActivePlanet, openPanel, setCursorVariant, activePanel } = useSpaceStore()
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const atmoRef  = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const isActive = activePlanet === planet.id

  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512; c.height = 512
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(180, 160, 40, 256, 256, 260)
    g.addColorStop(0, lighten(planet.color, 50))
    g.addColorStop(0.45, planet.color)
    g.addColorStop(1, darken(planet.color, 70))
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512)

    if (planet.type === 'oceanic') {
      for (let i = 0; i < 8; i++) {
        ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 8
        ctx.arc(Math.random()*512, Math.random()*512, 50+Math.random()*110, 0, Math.PI*(0.5+Math.random())); ctx.stroke()
      }
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.fillStyle = 'rgba(0,180,80,0.55)'
        ctx.ellipse(Math.random()*512, Math.random()*512, 40+Math.random()*60, 30+Math.random()*40, Math.random()*Math.PI, 0, Math.PI*2); ctx.fill()
      }
    } else if (planet.type === 'lava') {
      for (let i = 0; i < 22; i++) {
        ctx.beginPath(); ctx.strokeStyle = `rgba(255,200,0,${0.3+Math.random()*0.5})`; ctx.lineWidth = 2+Math.random()*4
        ctx.moveTo(Math.random()*512, Math.random()*512); ctx.lineTo(Math.random()*512, Math.random()*512); ctx.stroke()
      }
    } else if (planet.type === 'crystal') {
      for (let i = 0; i < 18; i++) {
        const x = Math.random()*512, y = Math.random()*512
        ctx.beginPath(); ctx.fillStyle = 'rgba(0,255,136,0.18)'
        ctx.moveTo(x, y-28); ctx.lineTo(x+18, y); ctx.lineTo(x, y+28); ctx.lineTo(x-18, y); ctx.closePath(); ctx.fill()
        ctx.strokeStyle = 'rgba(0,255,136,0.4)'; ctx.lineWidth = 1; ctx.stroke()
      }
    } else if (planet.type === 'gas') {
      for (let i = 0; i < 14; i++) {
        const y = (i/14)*512
        const bg = ctx.createLinearGradient(0, y, 512, y+32)
        bg.addColorStop(0, `rgba(255,255,255,${Math.random()*0.08})`); bg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = bg; ctx.fillRect(0, y, 512, 34)
      }
    } else if (planet.type === 'ice') {
      for (let i = 0; i < 30; i++) {
        ctx.beginPath(); ctx.strokeStyle = 'rgba(100,200,255,0.25)'; ctx.lineWidth = 1
        ctx.moveTo(Math.random()*512, Math.random()*512)
        for (let j = 0; j < 4; j++) ctx.lineTo(Math.random()*512, Math.random()*512)
        ctx.stroke()
      }
    } else {
      for (let i = 0; i < 14; i++) {
        const x = Math.random()*512, y = Math.random()*512, r = 12+Math.random()*40
        ctx.beginPath(); ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 3; ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke()
        ctx.beginPath(); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.arc(x,y,r*0.65,0,Math.PI*2); ctx.fill()
      }
    }
    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle = Math.random()>0.5 ? `rgba(255,255,255,${Math.random()*0.08})` : `rgba(0,0,0,${Math.random()*0.08})`
      ctx.fillRect(Math.random()*512, Math.random()*512, 2, 2)
    }
    return new THREE.CanvasTexture(c)
  }, [planet.color, planet.type])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current && !activePanel) {
      const angle = angleRef.current[planet.id]
      groupRef.current.position.x = Math.cos(angle) * planet.orbitRadius
      groupRef.current.position.z = Math.sin(angle) * planet.orbitRadius
    }
    if (meshRef.current) meshRef.current.rotation.y += delta * planet.rotationSpeed * 0.3
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 2 + planet.orbitRadius) * 0.08
      glowRef.current.scale.setScalar(isActive ? pulse * 1.35 : hovered ? pulse * 1.15 : pulse)
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = isActive ? 0.55 : hovered ? 0.38 : 0.18
    }
    if (atmoRef.current) atmoRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.018)
  })

  const handleClick = () => {
    if (activePlanet === planet.id) openPanel(planet.id as any)
    else setActivePlanet(planet.id)
  }

  return (
    <>
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <ringGeometry args={[planet.orbitRadius - 0.05, planet.orbitRadius + 0.05, 128]} />
        <meshBasicMaterial color={planet.color} transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      <group ref={groupRef} position={[planet.orbitRadius, 0, 0]}>
        <mesh ref={atmoRef}>
          <sphereGeometry args={[planet.size * 1.18, 32, 32]} />
          <meshBasicMaterial color={planet.atmosphereColor} transparent opacity={0.22} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
        </mesh>

        <mesh ref={glowRef}>
          <sphereGeometry args={[planet.size * 1.5, 16, 16]} />
          <meshBasicMaterial color={planet.glowColor} transparent opacity={0.18} blending={THREE.AdditiveBlending} />
        </mesh>

        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerEnter={() => { setHovered(true); setCursorVariant('planet') }}
          onPointerLeave={() => { setHovered(false); setCursorVariant('default') }}
        >
          <sphereGeometry args={[planet.size, 64, 64]} />
          <meshStandardMaterial
            map={tex}
            roughness={planet.type === 'ice' ? 0.2 : 0.8}
            metalness={planet.type === 'crystal' ? 0.7 : planet.type === 'ice' ? 0.3 : 0.05}
            emissive={planet.type === 'lava' ? new THREE.Color('#FF4400') : new THREE.Color(planet.color)}
            emissiveIntensity={planet.type === 'lava' ? 0.35 : 0.04}
          />
        </mesh>

        {planet.hasRings && (
          <group rotation={[Math.PI/4, 0, 0]}>
            <mesh>
              <ringGeometry args={[planet.size * 1.45, planet.size * 2.25, 64]} />
              <meshBasicMaterial color={planet.ringColor || planet.color} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
              <ringGeometry args={[planet.size * 1.32, planet.size * 1.37, 64]} />
              <meshBasicMaterial color={planet.glowColor} transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        )}

        {planet.size > 3.5 && <SmallMoon size={planet.size} />}

        {(hovered || isActive) && (
          <group position={[0, planet.size + 2.8, 0]}>
            <Text fontSize={0.75} color={planet.glowColor} anchorX="center" anchorY="middle">
              {planet.name}
            </Text>
            <Text position={[0, -1.15, 0]} fontSize={0.42} color="white" anchorX="center" anchorY="middle" fillOpacity={0.65}>
              {planet.subtitle}
            </Text>
          </group>
        )}

        {isActive && <OrbitParticles color={planet.glowColor} size={planet.size} />}
      </group>
    </>
  )
}

function SmallMoon({ size }: { size: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.getElapsedTime() * 0.8 })
  return (
    <group ref={ref}>
      <group position={[size * 1.85, 0, 0]}>
        <mesh>
          <sphereGeometry args={[size * 0.18, 16, 16]} />
          <meshStandardMaterial color="#888899" roughness={1} />
        </mesh>
      </group>
    </group>
  )
}

function OrbitParticles({ color, size }: { color: string; size: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 180, pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = size * 1.6 + Math.random() * size * 1.8
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i*3+2] = r * Math.cos(phi)
    }
    return pos
  }, [size])
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.004 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.07} transparent opacity={0.55} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}

function lighten(hex: string, amt: number) {
  const n = parseInt(hex.replace('#',''), 16)
  return `rgb(${Math.min(255,(n>>16)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`
}
function darken(hex: string, amt: number) {
  const n = parseInt(hex.replace('#',''), 16)
  return `rgb(${Math.max(0,(n>>16)-amt)},${Math.max(0,((n>>8)&0xff)-amt)},${Math.max(0,(n&0xff)-amt)})`
}

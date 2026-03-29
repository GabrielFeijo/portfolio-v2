import { useRef, useState, useMemo, MutableRefObject } from 'react'
import { useFrame, extend, ThreeEvent } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useSpaceStore, PanelType } from '@/store/space-store'
import type { Planet } from '@/data/portfolio'
import { AdvancedAtmosphereMaterial, AAA_PlanetMaterial } from './planet-shaders'

extend({ AdvancedAtmosphereMaterial, AaaPlanetMaterial: AAA_PlanetMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    advancedAtmosphereMaterial: JSX.IntrinsicElements['shaderMaterial'] & {
      uColor?: THREE.Color
      uIntensity?: number
      uTime?: number
    }
    aaaPlanetMaterial: JSX.IntrinsicElements['shaderMaterial'] & {
      uColor?: THREE.Color
      uType?: number
      uTime?: number
      uLightDir?: THREE.Vector3
    }
  }
}

interface Planet3DProps {
  planet: Planet
  initialAngle: number
  angleRef: MutableRefObject<Record<string, number>>
}

function makeRingTexture(color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 64
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, 512, 64)
  for (let x = 0; x < 512; x++) {
    const t = x / 512
    const band1 = Math.sin(t * Math.PI * 18) * 0.5 + 0.5
    const band2 = Math.sin(t * Math.PI * 7 + 1.2) * 0.5 + 0.5
    const alpha = (band1 * 0.6 + band2 * 0.3) * (1 - Math.abs(t - 0.5) * 1.5)
    
    const n = parseInt(color.replace('#', ''), 16)
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    
    ctx.fillStyle = `rgba(${r + 30},${g + 30},${b + 30},${Math.max(0, alpha)})`
    ctx.fillRect(x, 0, 1, 64)
  }
  const tex = new THREE.CanvasTexture(c)
  return tex
}

const TYPE_MAP: Record<string, number> = {
  rocky: 0,
  oceanic: 1,
  lava: 2,
  crystal: 3,
  gas: 4,
  ice: 5
}

export function Planet3D({ planet, initialAngle, angleRef }: Planet3DProps) {
  const { activePlanet, setActivePlanet, openPanel, setCursorVariant, activePanel } = useSpaceStore()
  
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const atmoRef = useRef<THREE.Mesh>(null)
  
  const planetMatRef = useRef<THREE.ShaderMaterial>(null)
  const atmoMatRef = useRef<THREE.ShaderMaterial>(null)
  
  const [hovered, setHovered] = useState(false)
  const isActive = activePlanet === planet.id

  const ringTex = useMemo(() => planet.hasRings ? makeRingTexture(planet.ringColor || planet.color) : null, [planet.hasRings, planet.ringColor, planet.color])
  const planetTypeInt = TYPE_MAP[planet.type] ?? 0

  const uLightDir = useMemo(() => new THREE.Vector3(1, 0.4, 0.8).normalize(), [])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (groupRef.current && !activePanel) {
      const angle = angleRef.current[planet.id]
      groupRef.current.position.x = Math.cos(angle) * planet.orbitRadius
      groupRef.current.position.y = planet.orbitY || 0
      groupRef.current.position.z = Math.sin(angle) * planet.orbitRadius
      
      const pos = groupRef.current.position
      uLightDir.set(-pos.x, 10.0, -pos.z).normalize()
    }

    if (meshRef.current) meshRef.current.rotation.y += delta * planet.rotationSpeed * 0.3

    if (planetMatRef.current) {
      planetMatRef.current.uniforms.uTime.value = t
      planetMatRef.current.uniforms.uLightDir.value.copy(uLightDir)
    }

    if (atmoMatRef.current) {
      atmoMatRef.current.uniforms.uTime.value = t
      atmoMatRef.current.uniforms.uIntensity.value = isActive ? 1.6 : hovered ? 1.2 : 0.85
    }

    if (atmoRef.current) {
      atmoRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.01)
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setActivePlanet(planet.id)
    setTimeout(() => openPanel(planet.id as PanelType), 800)
  }

  const baseColor = useMemo(() => new THREE.Color(planet.color), [planet.color])
  const atmoColor = useMemo(() => new THREE.Color(planet.atmosphereColor), [planet.atmosphereColor])

  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, planet.orbitY || 0, 0]}>
        <ringGeometry args={[planet.orbitRadius - 0.04, planet.orbitRadius + 0.04, 192]} />
        <meshBasicMaterial color={planet.color} transparent opacity={0.02} side={THREE.DoubleSide} />
      </mesh>

      <group ref={groupRef} position={[planet.orbitRadius, planet.orbitY || 0, 0]}>
        
        <mesh ref={atmoRef} scale={[planet.size * 1.35, planet.size * 1.35, planet.size * 1.35]}>
          <sphereGeometry args={[1, 64, 64]} />
          <advancedAtmosphereMaterial
            ref={atmoMatRef}
            uColor={atmoColor}
            uIntensity={0.85}
            transparent
            depthWrite={false}
            side={THREE.BackSide}            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerEnter={() => { setHovered(true); setCursorVariant('planet') }}
          onPointerLeave={() => { setHovered(false); setCursorVariant('default') }}
        >
          <sphereGeometry args={[planet.size, 128, 128]} />
          <aaaPlanetMaterial
            ref={planetMatRef}
            uColor={baseColor}
            uType={planetTypeInt}
            uLightDir={uLightDir}
          />
        </mesh>

        {planet.hasRings && ringTex && (
          <group rotation={[Math.PI / 6, 0.0, 0.15]}>
            <mesh>
              <ringGeometry args={[planet.size * 1.45, planet.size * 2.3, 128]} />
              <meshBasicMaterial
                map={ringTex}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh>
              <ringGeometry args={[planet.size * 1.3, planet.size * 1.35, 128]} />
              <meshBasicMaterial
                color={planet.glowColor}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        )}

        {planet.size > 3.0 && <SmallMoon size={planet.size} color={planet.color} lightDir={uLightDir} />}

        {(hovered || isActive) && (
          <Billboard position={[0, planet.size + 3.5, 0]}>
            <Text
              fontSize={0.68}
              color={planet.glowColor}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor={new THREE.Color(planet.glowColor).multiplyScalar(0.3)}
            >
              {planet.name}
            </Text>
            <Text
              position={[0, -1.0, 0]}
              fontSize={0.35}
              color="white"
              anchorX="center"
              anchorY="middle"
              fillOpacity={0.6}
            >
              {planet.subtitle}
            </Text>
          </Billboard>
        )}

        {isActive && <OrbitParticles color={planet.glowColor} size={planet.size} />}
      </group>
    </>
  )
}

function SmallMoon({ size, color, lightDir }: { size: number; color: string, lightDir: THREE.Vector3 }) {
  const ref = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const inclination = useMemo(() => (Math.random() - 0.5) * 0.8, [])
  const baseCol = useMemo(() => new THREE.Color('#99AAAA'), [])
  
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.getElapsedTime() * 0.8
      ref.current.rotation.z = inclination
    }
    if(matRef.current) {
        matRef.current.uniforms.uTime.value = s.clock.getElapsedTime()
        matRef.current.uniforms.uLightDir.value.copy(lightDir)
    }
  })

  return (
    <group ref={ref}>
      <group position={[size * 2.2, 0, 0]}>
        <mesh>
          <sphereGeometry args={[size * 0.22, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <sphereGeometry args={[size * 0.18, 64, 64]} />
          <aaaPlanetMaterial
            ref={matRef}
            uColor={baseCol}
            uType={0}            uLightDir={lightDir}
          />
        </mesh>
      </group>
    </group>
  )
}

function OrbitParticles({ color, size }: { color: string; size: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 300
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = size * 1.8 + Math.random() * size * 2.0
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [size])

  useFrame((_, delta) => {
    if (ref.current) {
        ref.current.rotation.y += delta * 0.2
        ref.current.rotation.x += delta * 0.1
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.08}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

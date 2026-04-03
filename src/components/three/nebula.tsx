import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function makeNebulaCanvas(
  colors: string[],
  blobCount: number,
  alphaRange: [number, number],
  seed: number
): THREE.CanvasTexture {
  const SIZE = 1024
  const c = document.createElement('canvas')
  c.width = SIZE; c.height = SIZE
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, SIZE, SIZE)

  let s = seed
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }

  for (let i = 0; i < blobCount; i++) {
    const x = rand() * SIZE
    const y = rand() * SIZE
    const r = 60 + rand() * 200
    const colorIdx = Math.floor(rand() * colors.length)
    const alpha = alphaRange[0] + rand() * (alphaRange[1] - alphaRange[0])

    const grd = ctx.createRadialGradient(x, y, 0, x, y, r)
    grd.addColorStop(0, colors[colorIdx].replace(')', `,${alpha})`).replace('rgb(', 'rgba('))
    grd.addColorStop(0.4, colors[colorIdx].replace(')', `,${alpha * 0.4})`).replace('rgb(', 'rgba('))
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(1, 0.5 + rand() * 1.0)
    ctx.rotate(rand() * Math.PI * 2)
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.restore()
    ctx.fill()
  }

  for (let i = 0; i < 800; i++) {
    const x = rand() * SIZE
    const y = rand() * SIZE
    const colorIdx = Math.floor(rand() * colors.length)
    const alpha = 0.03 + rand() * 0.08
    ctx.fillStyle = colors[colorIdx].replace(')', `,${alpha})`).replace('rgb(', 'rgba(')
    ctx.beginPath()
    ctx.arc(x, y, rand() * 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(c)
  return tex
}

function NebulaParticles({
  position,
  color,
  count,
  spread,
}: {
  position: [number, number, number]
  color: string
  count: number
  spread: number
}) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * spread
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.4
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread
    }
    return arr
  }, [count, spread])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.005
    }
  })

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.42}
        transparent
        opacity={0.22}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function NebulaLayer({
  texture,
  position,
  rotation,
  scale,
  speed,
}: {
  texture: THREE.Texture
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number]
  speed: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.008
    if (ref.current) {
      ref.current.rotation.x = rotation[0] + t * speed[0]
      ref.current.rotation.y = rotation[1] + t * speed[1]
      ref.current.rotation.z = rotation[2] + t * speed[2]
    }
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={scale} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function Nebula() {
  const textures = useMemo(() => [
    makeNebulaCanvas(['rgb(107,33,232)', 'rgb(139,68,255)', 'rgb(80,20,180)'], 25, [0.08, 0.18], 42),
    makeNebulaCanvas(['rgb(0,100,255)', 'rgb(30,60,175)', 'rgb(0,180,255)'], 20, [0.06, 0.14], 77),
    makeNebulaCanvas(['rgb(255,20,147)', 'rgb(220,50,130)', 'rgb(180,0,80)'], 18, [0.05, 0.12], 123),
    makeNebulaCanvas(['rgb(0,200,180)', 'rgb(0,150,140)', 'rgb(0,100,100)'], 15, [0.05, 0.1], 55),
    makeNebulaCanvas(['rgb(255,180,0)', 'rgb(200,120,0)', 'rgb(255,220,80)'], 14, [0.04, 0.09], 88),
    makeNebulaCanvas(['rgb(40,10,100)', 'rgb(100,30,180)', 'rgb(15,5,60)'], 30, [0.1, 0.22], 200),
    makeNebulaCanvas(['rgb(200,30,10)', 'rgb(255,80,20)', 'rgb(150,10,5)'], 16, [0.05, 0.11], 33),
    makeNebulaCanvas(['rgb(0,212,255)', 'rgb(0,150,200)', 'rgb(80,230,255)'], 18, [0.05, 0.12], 66),
    makeNebulaCanvas(['rgb(60,20,120)', 'rgb(90,40,160)', 'rgb(40,10,80)'], 35, [0.06, 0.15], 99),
  ], [])

  const layers = useMemo(() => [
    { texIdx: 0, pos: [-120, 36, -250] as [number,number,number],    rot: [0.4, 0.1, 0.2] as [number,number,number],  scale: [460, 360] as [number,number], speed: [0.4, 0.1, 0.3] as [number,number,number] },
    { texIdx: 1, pos: [170, -40, -300] as [number,number,number],    rot: [-0.3, 0.4, 0.1] as [number,number,number], scale: [420, 340] as [number,number], speed: [-0.2, 0.3, 0.1] as [number,number,number] },
    { texIdx: 2, pos: [30, 95, -350] as [number,number,number],      rot: [0.2, 0.2, 0.5] as [number,number,number],  scale: [560, 440] as [number,number], speed: [0.3, -0.2, 0.2] as [number,number,number] },
    { texIdx: 3, pos: [-200, -70, -320] as [number,number,number],   rot: [0.6, -0.2, 0.3] as [number,number,number], scale: [380, 290] as [number,number], speed: [0.2, 0.4, -0.1] as [number,number,number] },
    { texIdx: 4, pos: [235, 105, -390] as [number,number,number],    rot: [-0.2, 0.5, -0.1] as [number,number,number],scale: [520, 380] as [number,number], speed: [-0.3, 0.2, 0.4] as [number,number,number] },
    { texIdx: 5, pos: [0, -96, -210] as [number,number,number],      rot: [0.8, 0.0, 0.0] as [number,number,number],  scale: [700, 520] as [number,number], speed: [0.15, 0.25, -0.2] as [number,number,number] },
    { texIdx: 6, pos: [-250, 60, -360] as [number,number,number],    rot: [0.3, 0.7, 0.2] as [number,number,number],  scale: [410, 300] as [number,number], speed: [0.35, -0.15, 0.3] as [number,number,number] },
    { texIdx: 7, pos: [130, -120, -270] as [number,number,number],   rot: [-0.4, -0.3, 0.6] as [number,number,number],scale: [440, 340] as [number,number], speed: [-0.2, 0.3, 0.15] as [number,number,number] },
    { texIdx: 8, pos: [65, 145, -440] as [number,number,number],     rot: [0.1, 0.3, 0.0] as [number,number,number],  scale: [760, 590] as [number,number], speed: [0.1, 0.1, 0.1] as [number,number,number] },
  ], [])

  return (
    <group>
      {layers.map((layer, i) => (
        <NebulaLayer
          key={i}
          texture={textures[layer.texIdx]}
          position={layer.pos}
          rotation={layer.rot}
          scale={layer.scale}
          speed={layer.speed}
        />
      ))}

      <NebulaParticles position={[-120, 36, -250]} color="#6B21E8" count={340} spread={220} />
      <NebulaParticles position={[170, -40, -300]} color="#00D4FF" count={280} spread={220} />
      <NebulaParticles position={[30, 95, -350]} color="#FF1493" count={240} spread={250} />
      <NebulaParticles position={[40, -70, -210]} color="#FFB800" count={220} spread={180} />
    </group>
  )
}

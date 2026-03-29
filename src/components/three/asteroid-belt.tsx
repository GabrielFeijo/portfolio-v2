import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AsteroidBeltProps {
  innerRadius: number
  outerRadius: number
  count: number
  color: string
}

function makeRockTexture(color: string): THREE.CanvasTexture {
  const SIZE = 64
  const c = document.createElement('canvas')
  c.width = SIZE; c.height = SIZE
  const ctx = c.getContext('2d')!

  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  ctx.fillStyle = color
  ctx.fillRect(0, 0, SIZE, SIZE)

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * SIZE, y = Math.random() * SIZE
    const dr = Math.floor((Math.random() - 0.5) * 40)
    ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, r + dr))},${Math.max(0, Math.min(255, g + dr))},${Math.max(0, Math.min(255, b + dr))})`
    ctx.beginPath(); ctx.arc(x, y, 2 + Math.random() * 8, 0, Math.PI * 2); ctx.fill()
  }

  for (let i = 0; i < 15; i++) {
    ctx.beginPath()
    ctx.strokeStyle = `rgba(0,0,0,${0.2 + Math.random() * 0.4})`
    ctx.lineWidth = 0.5 + Math.random() * 1
    ctx.moveTo(Math.random() * SIZE, Math.random() * SIZE)
    ctx.lineTo(Math.random() * SIZE, Math.random() * SIZE)
    ctx.stroke()
  }

  return new THREE.CanvasTexture(c)
}

const GEOMETRIES = [
  new THREE.DodecahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.IcosahedronGeometry(1, 0),
]

export function AsteroidBelt({ innerRadius, outerRadius, count, color }: AsteroidBeltProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const asteroids = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8,
      radius: innerRadius + Math.random() * (outerRadius - innerRadius),
      height: (Math.random() - 0.5) * 3.5,
      size: 0.06 + Math.random() * 0.28,
      speed: 0.004 + Math.random() * 0.012,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.8,
      geoIdx: Math.floor(Math.random() * GEOMETRIES.length),
    }))
  }, [count, innerRadius, outerRadius])

  const rockTexture = useMemo(() => makeRockTexture(color), [color])

  useMemo(() => {
    if (!meshRef.current) return
    asteroids.forEach((a, i) => {
      dummy.position.set(
        Math.cos(a.angle) * a.radius,
        a.height,
        Math.sin(a.angle) * a.radius
      )
      dummy.scale.setScalar(a.size)
      dummy.rotation.set(a.rotX, a.rotY, 0)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [asteroids, dummy])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    asteroids.forEach((a, i) => {
      a.angle += delta * a.speed
      a.rotX += delta * a.rotSpeed * 0.7
      a.rotY += delta * a.rotSpeed

      dummy.position.set(
        Math.cos(a.angle) * a.radius,
        a.height + Math.sin(a.angle * 3) * 0.15,
        Math.sin(a.angle) * a.radius
      )
      dummy.scale.setScalar(a.size)
      dummy.rotation.set(a.rotX, a.rotY, 0)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[GEOMETRIES[0], undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        map={rockTexture}
        roughness={0.95}
        metalness={0.05}
        color={color}
      />
    </instancedMesh>
  )
}

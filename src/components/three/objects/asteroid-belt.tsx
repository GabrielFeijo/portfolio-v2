import { makeRockTexture } from '@/utils/textures'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

interface AsteroidBeltProps {
  innerRadius: number
  outerRadius: number
  count: number
  color: string
}

const GEOMETRIES = [
  new THREE.DodecahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.IcosahedronGeometry(1, 0),
]

export function AsteroidBelt({ innerRadius, outerRadius, count, color }: AsteroidBeltProps) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null)
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
    }))
  }, [count, innerRadius, outerRadius])

  const rockTexture = useMemo(() => makeRockTexture(color), [color])

  useEffect(() => {
    return () => {
      rockTexture.dispose()
    }
  }, [rockTexture])

  useEffect(() => {
    if (!meshRef.current) return
    asteroids.forEach((a, i) => {
      dummy.position.set(Math.cos(a.angle) * a.radius, a.height, Math.sin(a.angle) * a.radius)
      dummy.scale.setScalar(a.size)
      dummy.rotation.set(a.rotX, a.rotY, 0)
      dummy.updateMatrix()
      meshRef.current?.setMatrixAt?.(i, dummy.matrix)
    })
    if (meshRef.current.instanceMatrix) {
      meshRef.current.instanceMatrix.needsUpdate = true
    }
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
      meshRef.current?.setMatrixAt?.(i, dummy.matrix)
    })
    if (meshRef.current.instanceMatrix) {
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[GEOMETRIES[0], undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial map={rockTexture} roughness={0.95} metalness={0.05} color={color} />
    </instancedMesh>
  )
}

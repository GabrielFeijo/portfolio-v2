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

const MATRIX_UPDATE_INTERVAL = 1 / 30

export function AsteroidBelt({ innerRadius, outerRadius, count, color }: AsteroidBeltProps) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null)
  const frameDeltaRef = useMemo(() => ({ current: 0 }), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(1, 0), [])

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
      geometry.dispose()
    }
  }, [geometry, rockTexture])

  useEffect(() => {
    if (!meshRef.current || typeof meshRef.current.setMatrixAt !== 'function') return

    asteroids.forEach((a, i) => {
      dummy.position.set(Math.cos(a.angle) * a.radius, a.height, Math.sin(a.angle) * a.radius)
      dummy.scale.setScalar(a.size)
      dummy.rotation.set(a.rotX, a.rotY, 0)
      dummy.updateMatrix()
      meshRef.current?.setMatrixAt?.(i, dummy.matrix)
    })

    Object.assign(meshRef.current.instanceMatrix ?? {}, { needsUpdate: true })
  }, [asteroids, dummy])

  useFrame((_, delta) => {
    if (!meshRef.current || typeof meshRef.current.setMatrixAt !== 'function') return

    frameDeltaRef.current += delta
    if (frameDeltaRef.current < MATRIX_UPDATE_INTERVAL) return

    const elapsedDelta = frameDeltaRef.current
    frameDeltaRef.current = 0

    asteroids.forEach((a, i) => {
      a.angle += elapsedDelta * a.speed
      a.rotX += elapsedDelta * a.rotSpeed * 0.7
      a.rotY += elapsedDelta * a.rotSpeed

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

    Object.assign(meshRef.current.instanceMatrix ?? {}, { needsUpdate: true })
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
      <meshStandardMaterial map={rockTexture} roughness={0.95} metalness={0.05} color={color} />
    </instancedMesh>
  )
}

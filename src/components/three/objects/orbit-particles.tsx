import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbitParticlesProps {
  color: string
  density: number
  size: number
}

export function OrbitParticles({ color, density, size }: OrbitParticlesProps) {
  const ref = useRef<THREE.Points | null>(null)
  const positions = useMemo(() => {
    const count = Math.max(60, Math.round(300 * density))
    const values = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = size * 1.8 + Math.random() * size * 2

      values[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      values[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      values[i * 3 + 2] = radius * Math.cos(phi)
    }

    return values
  }, [density, size])

  useFrame((_, delta) => {
    const points = ref.current
    if (!points) return

    points.rotation.y += delta * 0.2
    points.rotation.x += delta * 0.1
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

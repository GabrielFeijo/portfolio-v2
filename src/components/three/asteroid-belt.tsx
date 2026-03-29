import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AsteroidBeltProps {
  innerRadius: number
  outerRadius: number
  count: number
  color: string
}

export function AsteroidBelt({ innerRadius, outerRadius, count, color }: AsteroidBeltProps) {
  const ref = useRef<THREE.Group>(null)

  const asteroids = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
      const height = (Math.random() - 0.5) * 2
      const size = 0.05 + Math.random() * 0.25
      const speed = 0.005 + Math.random() * 0.01
      return { angle, radius, height, size, speed }
    })
  }, [count, innerRadius, outerRadius])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        if (asteroids[i]) {
          asteroids[i].angle += delta * asteroids[i].speed
          child.position.x = Math.cos(asteroids[i].angle) * asteroids[i].radius
          child.position.z = Math.sin(asteroids[i].angle) * asteroids[i].radius
          child.rotation.x += delta * 0.5
          child.rotation.y += delta * 0.3
        }
      })
    }
  })

  return (
    <group ref={ref}>
      {asteroids.map((asteroid, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(asteroid.angle) * asteroid.radius,
            asteroid.height,
            Math.sin(asteroid.angle) * asteroid.radius,
          ]}
        >
          <dodecahedronGeometry args={[asteroid.size, 0]} />
          <meshStandardMaterial
            color={color}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

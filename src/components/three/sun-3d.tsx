import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function Sun3D() {
  const sunRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.003
      sunRef.current.rotation.z += 0.001
    }

    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.002
      coronaRef.current.rotation.x += 0.001
      const scale = 1 + Math.sin(t * 2) * 0.02
      coronaRef.current.scale.setScalar(scale)
    }

    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.05
      glowRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      <Sphere ref={glowRef} args={[7, 32, 32]}>
        <meshBasicMaterial
          color="#FFF5E0"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>

      <Sphere ref={coronaRef} args={[5.5, 32, 32]}>
        <meshBasicMaterial
          color="#FF8800"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      <Sphere ref={sunRef} args={[4.5, 64, 64]}>
        <MeshDistortMaterial
          color="#FFA500"
          emissive="#FF6600"
          emissiveIntensity={2}
          distort={0.3}
          speed={2}
          roughness={0.8}
        />
      </Sphere>

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const r = 5 + Math.random() * 2
        return (
          <SolarFlare
            key={i}
            position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}
            delay={i * 0.3}
          />
        )
      })}

      <pointLight
        position={[0, 0, 0]}
        intensity={6}
        color="#FFF5E0"
        distance={300}
        decay={1.5}
      />
    </group>
  )
}

function SolarFlare({ position, delay }: { position: [number, number, number], delay: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + delay
    if (ref.current) {
      ref.current.scale.setScalar(0.5 + Math.sin(t * 2) * 0.3)
      ref.current.position.x = position[0] + Math.sin(t) * 0.5
      ref.current.position.y = position[1] + Math.cos(t * 0.8) * 0.5
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshBasicMaterial
        color="#FFAA00"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

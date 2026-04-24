import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SmallMoonProps {
  color: string
  lightDir: THREE.Vector3
  size: number
}

export function SmallMoon({ color, lightDir, size }: SmallMoonProps) {
  const ref = useRef<THREE.Group | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const inclination = useMemo(() => (Math.random() - 0.5) * 0.8, [])
  const baseColor = useMemo(() => new THREE.Color('#99AAAA'), [])

  useFrame((state) => {
    const group = ref.current
    const material = materialRef.current
    const time = state.clock.getElapsedTime()

    if (group) {
      group.rotation.y = time * 0.8
      group.rotation.z = inclination
    }

    if (material) {
      material.uniforms.uTime.value = time
      material.uniforms.uLightDir.value.copy(lightDir)
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
          <aaaPlanetMaterial ref={materialRef} uColor={baseColor} uType={0} uLightDir={lightDir} />
        </mesh>
      </group>
    </group>
  )
}

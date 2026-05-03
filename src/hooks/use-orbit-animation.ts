import { getPlanetPosition } from '@/components/three/orbit-utils'
import type { Planet } from '@/types/portfolio'
import type { PlanetAnglesRef } from '@/types/three'
import { useFrame } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { useMemo } from 'react'
import * as THREE from 'three'

interface UseOrbitAnimationOptions {
  activePanel: string | null
  angleRef: PlanetAnglesRef
  atmosphereMaterialRef: MutableRefObject<THREE.ShaderMaterial | null>
  atmosphereMeshRef: MutableRefObject<THREE.Mesh | null>
  groupRef: MutableRefObject<THREE.Group | null>
  hovered: boolean
  isActive: boolean
  meshRef: MutableRefObject<THREE.Mesh | null>
  planet: Planet
  planetMaterialRef: MutableRefObject<THREE.ShaderMaterial | null>
  planetRotation: boolean
}

export function useOrbitAnimation({
  activePanel,
  angleRef,
  atmosphereMaterialRef,
  atmosphereMeshRef,
  groupRef,
  hovered,
  isActive,
  meshRef,
  planet,
  planetMaterialRef,
  planetRotation,
}: UseOrbitAnimationOptions) {
  const lightDirection = useMemo(() => new THREE.Vector3(1, 0.4, 0.8).normalize(), [])

  useFrame((state, delta) => {
    const group = groupRef.current
    const mesh = meshRef.current
    const planetMaterial = planetMaterialRef.current
    const atmosphereMaterial = atmosphereMaterialRef.current
    const atmosphereMesh = atmosphereMeshRef.current
    const time = state.clock.getElapsedTime()

    if (group && !activePanel) {
      const position = getPlanetPosition(planet, angleRef.current[planet.id])
      group.position.copy(position)
      lightDirection.set(-position.x, 10, -position.z).normalize()
    }

    if (mesh && planetRotation) {
      mesh.rotation.y += delta * planet.rotationSpeed * 0.3
    }

    if (planetMaterial) {
      planetMaterial.uniforms.uTime.value = time
      planetMaterial.uniforms.uLightDir.value.copy(lightDirection)
    }

    if (atmosphereMaterial) {
      atmosphereMaterial.uniforms.uTime.value = time
      atmosphereMaterial.uniforms.uIntensity.value = isActive ? 1.6 : hovered ? 1.2 : 0.85
    }

    if (atmosphereMesh) {
      atmosphereMesh.scale.setScalar(1 + Math.sin(time * 1.5) * 0.01)
    }
  })

  return lightDirection
}

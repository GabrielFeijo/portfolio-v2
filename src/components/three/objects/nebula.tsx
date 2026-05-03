import type { Vec3Tuple } from '@/types/three'
import { createStarColors, createStarPositions } from '@/utils/geometry'
import { createCloudTexture, createGlowTexture, createRandom } from '@/utils/textures'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

type Vec3 = Vec3Tuple

function StarShell({
  count,
  radius,
  spread,
  size,
  opacity,
  seed,
}: {
  count: number
  radius: number
  spread: number
  size: number
  opacity: number
  seed: number
}) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(
    () => createStarPositions(count, radius, spread, seed),
    [count, radius, seed, spread]
  )
  const colors = useMemo(
    () => createStarColors(count, ['#c1dbff', '#f9fbff', '#8fdcff', '#ffe6b8'], seed + 7),
    [count, seed]
  )

  useFrame((state) => {
    if (!ref.current) return

    const time = state.clock.getElapsedTime()
    ref.current.rotation.y = time * 0.0025 + seed * 0.0001
    ref.current.rotation.x = Math.sin(time * 0.03 + seed) * 0.03
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function NebulaCluster({
  density,
  position,
  scale,
  texture,
  glowTexture,
  glowColor,
  seed,
  rotationSpeed,
}: {
  density: number
  position: Vec3
  scale: Vec3
  texture: THREE.Texture
  glowTexture: THREE.Texture
  glowColor: string
  seed: number
  rotationSpeed: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const cloudLayers = useMemo(() => {
    const rand = createRandom(seed)

    return Array.from({ length: Math.max(2, Math.round(9 * density)) }, (_, index) => ({
      key: `cloud-${index}`,
      offset: [
        (rand() - 0.5) * scale[0] * 0.45,
        (rand() - 0.5) * scale[1] * 0.32,
        (rand() - 0.5) * scale[2] * 0.18,
      ] as Vec3,
      spriteScale: 90 + rand() * 120,
      opacity: 0.12 + rand() * 0.08,
      color: new THREE.Color().setHSL(0.56 + rand() * 0.08, 0.7, 0.58 + rand() * 0.15),
    }))
  }, [density, scale, seed])

  const glowLayers = useMemo(() => {
    const rand = createRandom(seed + 99)

    return Array.from({ length: Math.max(1, Math.round(3 * density)) }, (_, index) => ({
      key: `glow-${index}`,
      offset: [
        (rand() - 0.5) * scale[0] * 0.18,
        (rand() - 0.5) * scale[1] * 0.12,
        -8 + rand() * 16,
      ] as Vec3,
      spriteScale: 42 + rand() * 34,
      opacity: 0.12 + rand() * 0.08,
    }))
  }, [density, scale, seed])

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(time * rotationSpeed) * 0.18
    groupRef.current.rotation.z = Math.cos(time * rotationSpeed * 0.7) * 0.08
  })

  return (
    <group ref={groupRef} position={position}>
      {cloudLayers.map((layer) => (
        <sprite
          key={layer.key}
          position={layer.offset}
          scale={[layer.spriteScale, layer.spriteScale * 0.65, 1]}
        >
          <spriteMaterial
            map={texture}
            color={layer.color}
            transparent
            opacity={layer.opacity}
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}

      {glowLayers.map((layer) => (
        <sprite
          key={layer.key}
          position={layer.offset}
          scale={[layer.spriteScale, layer.spriteScale, 1]}
        >
          <spriteMaterial
            map={glowTexture}
            color={glowColor}
            transparent
            opacity={layer.opacity}
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}

interface NebulaProps {
  density: number
}

export function Nebula({ density }: NebulaProps) {
  const textures = useMemo(
    () => ({
      cyanCloud: createCloudTexture(11, '#4fdfff'),
      blueCloud: createCloudTexture(17, '#3f67ff'),
      amberCloud: createCloudTexture(23, '#ffb96b'),
      violetCloud: createCloudTexture(29, '#7b6dff'),
      cyanGlow: createGlowTexture(37, '#7ce7ff'),
      blueGlow: createGlowTexture(41, '#7195ff'),
      amberGlow: createGlowTexture(43, '#ffbf7a'),
    }),
    []
  )

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((texture) => texture.dispose())
    }
  }, [textures])

  return (
    <group>
      <StarShell
        count={Math.max(180, Math.round(1800 * density))}
        radius={520}
        spread={180}
        size={1.5}
        opacity={0.45}
        seed={101}
      />
      <StarShell
        count={Math.max(90, Math.round(900 * density))}
        radius={340}
        spread={120}
        size={1.1}
        opacity={0.32}
        seed={151}
      />

      <NebulaCluster
        density={density}
        position={[-220, 90, -520]}
        scale={[260, 170, 90]}
        texture={textures.cyanCloud}
        glowTexture={textures.cyanGlow}
        glowColor="#67dfff"
        seed={61}
        rotationSpeed={0.035}
      />
      <NebulaCluster
        density={density}
        position={[250, -70, -610]}
        scale={[320, 210, 110]}
        texture={textures.blueCloud}
        glowTexture={textures.blueGlow}
        glowColor="#87a8ff"
        seed={73}
        rotationSpeed={0.028}
      />
      <NebulaCluster
        density={density}
        position={[70, 150, -760]}
        scale={[410, 240, 140]}
        texture={textures.violetCloud}
        glowTexture={textures.blueGlow}
        glowColor="#9fa8ff"
        seed={87}
        rotationSpeed={0.018}
      />
      <NebulaCluster
        density={density}
        position={[40, -180, -470]}
        scale={[220, 140, 80]}
        texture={textures.amberCloud}
        glowTexture={textures.amberGlow}
        glowColor="#ffbc73"
        seed={97}
        rotationSpeed={0.041}
      />
    </group>
  )
}

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useSpaceStore } from '@/store/space-store'
import { Planet3D } from './planet-3d'
import { Sun3D, ShootingStar } from './sun-3d'
import { AsteroidBelt } from './asteroid-belt'
import { Nebula } from './nebula'
import { PLANETS } from '@/data/portfolio'
import { CameraController } from './camera-controller'

export function SpaceScene() {
  const { setIsLoaded } = useSpaceStore()
  const angleOffsets = useMemo(
    () => Object.fromEntries(PLANETS.map((planet) => [planet.id, planet.orbitPhase ?? 0])),
    [],
  )
  const planetAngles = useRef<Record<string, number>>(
    Object.fromEntries(PLANETS.map((planet) => [planet.id, angleOffsets[planet.id]]))
  )

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 2500)
    return () => clearTimeout(t)
  }, [setIsLoaded])

  useFrame((state, delta) => {
    PLANETS.forEach(p => { planetAngles.current[p.id] += delta * p.orbitSpeed * 0.1 })
  })

  return (
    <>
      <color attach="background" args={['#02030a']} />

      <ambientLight intensity={0.12} color="#0b1020" />
      <hemisphereLight intensity={0.24} color="#7dd3fc" groundColor="#050814" />

      <pointLight position={[110, 70, 90]} intensity={0.8} color="#6ee7ff" distance={320} decay={1.7} />
      <pointLight position={[-120, -50, -70]} intensity={0.45} color="#7c3aed" distance={280} decay={1.8} />
      <pointLight position={[35, -110, 50]} intensity={0.28} color="#fb7185" distance={220} decay={2.1} />
      <pointLight position={[-70, 95, 150]} intensity={0.24} color="#67e8f9" distance={260} decay={2.2} />
      <spotLight
        position={[0, 90, 120]}
        angle={0.45}
        penumbra={0.8}
        intensity={0.55}
        distance={360}
        color="#dbeafe"
      />

      <Stars radius={780} depth={220} count={12000} factor={4.8} saturation={0.05} fade speed={0.16} />
      <Stars radius={360} depth={120} count={5200} factor={2.6} saturation={0.3} fade speed={0.08} />

      <Nebula />
      <Sun3D />

      {Array.from({ length: 5 }).map((_, i) => <ShootingStar key={i} />)}

      {PLANETS.map(planet => (
        <Planet3D
          key={planet.id}
          planet={planet}
          angleRef={planetAngles}
        />
      ))}

      <AsteroidBelt innerRadius={58} outerRadius={64} count={260} color="#6b7280" />
      <AsteroidBelt innerRadius={126} outerRadius={132} count={110} color="#475569" />

      <fog attach="fog" args={['#02030a', 150, 760]} />

      <CameraController planetAngles={planetAngles} />

    </>
  )
}

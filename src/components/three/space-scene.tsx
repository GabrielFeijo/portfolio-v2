import { useRef, useEffect, useMemo } from 'react'
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

  return (
    <>
      <color attach="background" args={['#01020a']} />

      <ambientLight intensity={0.14} color="#09111f" />
      <hemisphereLight intensity={0.22} color="#8ad8ff" groundColor="#03050d" />

      <pointLight position={[110, 70, 90]} intensity={0.7} color="#6ee7ff" distance={320} decay={1.8} />
      <pointLight position={[-120, -50, -70]} intensity={0.28} color="#6d6fff" distance={320} decay={1.9} />
      <pointLight position={[35, -110, 50]} intensity={0.2} color="#ff9f6b" distance={240} decay={2.1} />
      <pointLight position={[-70, 95, 150]} intensity={0.2} color="#67e8f9" distance={280} decay={2.2} />
      <spotLight
        position={[0, 90, 120]}
        angle={0.45}
        penumbra={0.8}
        intensity={0.4}
        distance={360}
        color="#dbeafe"
      />

      <Stars radius={900} depth={260} count={9000} factor={4.2} saturation={0.02} fade speed={0.12} />
      <Stars radius={520} depth={140} count={2600} factor={2.4} saturation={0.18} fade speed={0.04} />
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

      <AsteroidBelt innerRadius={48} outerRadius={54} count={260} color="#6b7280" />
      <AsteroidBelt innerRadius={98} outerRadius={104} count={110} color="#475569" />

      <fog attach="fog" args={['#01020a', 180, 980]} />

      <CameraController planetAngles={planetAngles} />

    </>
  )
}

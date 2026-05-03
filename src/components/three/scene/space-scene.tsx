import { ANIMATION_SETTINGS } from '@/constants/animation'
import { SCENE_SETTINGS } from '@/constants/scene'
import { PLANETS } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Stars } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { AsteroidBelt } from '../objects/asteroid-belt'
import { Nebula } from '../objects/nebula'
import { Planet3D } from '../objects/planet-3d'
import { ShootingStar, Sun3D } from '../objects/sun-3d'
import { CameraController } from './camera-controller'

export function SpaceScene() {
  const { settings, setIsLoaded } = useSpaceStore(useShallow((state) => ({
    settings: state.experienceSettings,
    setIsLoaded: state.setIsLoaded,
  })))
  const angleOffsets = useMemo(
    () => Object.fromEntries(PLANETS.map((planet) => [planet.id, planet.orbitPhase ?? 0])),
    [],
  )
  const planetAngles = useRef<Record<string, number>>(
    Object.fromEntries(PLANETS.map((planet) => [planet.id, angleOffsets[planet.id]]))
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoaded(true), ANIMATION_SETTINGS.loadingDelayMs)
    return () => window.clearTimeout(timeout)
  }, [setIsLoaded])

  const primaryStarCount = Math.max(300, Math.round(SCENE_SETTINGS.primaryStars.count * settings.starDensity))
  const secondaryStarCount = Math.max(120, Math.round(SCENE_SETTINGS.secondaryStars.count * settings.starDensity))
  const shootingStarCount = settings.shootingStars ? Math.max(1, Math.round(5 * settings.starDensity)) : 0
  const innerAsteroidCount = Math.round(260 * settings.asteroidDensity)
  const outerAsteroidCount = Math.round(110 * settings.asteroidDensity)

  return (
    <>
      <color attach="background" args={[SCENE_SETTINGS.background]} />

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

      <Stars {...SCENE_SETTINGS.primaryStars} count={primaryStarCount} fade />
      <Stars {...SCENE_SETTINGS.secondaryStars} count={secondaryStarCount} fade />
      {settings.nebula && <Nebula density={settings.starDensity} />}

      <Sun3D />

      {Array.from({ length: shootingStarCount }).map((_, i) => <ShootingStar key={i} />)}

      {PLANETS.map(planet => (
        <Planet3D
          key={planet.id}
          planet={planet}
          angleRef={planetAngles}
        />
      ))}

      {innerAsteroidCount > 0 && <AsteroidBelt innerRadius={48} outerRadius={54} count={innerAsteroidCount} color="#6b7280" />}
      {outerAsteroidCount > 0 && <AsteroidBelt innerRadius={98} outerRadius={104} count={outerAsteroidCount} color="#475569" />}

      <fog attach="fog" args={[SCENE_SETTINGS.background, SCENE_SETTINGS.fogNear, SCENE_SETTINGS.fogFar]} />

      <CameraController planetAngles={planetAngles} />

    </>
  )
}

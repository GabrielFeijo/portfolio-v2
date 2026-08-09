import { ANIMATION_SETTINGS } from '@/constants/animation';
import { SCENE_COLORS, SCENE_SETTINGS } from '@/constants/scene';
import { PLANETS } from '@/data/portfolio';
import { useSpaceStore } from '@/store/space-store';
import { Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { AsteroidBelt } from '../objects/asteroid-belt';
import { Nebula } from '../objects/nebula';
import { Planet3D } from '../objects/planet-3d';
import { ShootingStar, Sun3D } from '../objects/sun-3d';
import { CameraController } from './camera-controller';
import { FrameScheduler } from './frame-scheduler';

export function SpaceScene() {
  const { asteroidDensity, nebula, setIsLoaded, shootingStars, starDensity } = useSpaceStore(
    useShallow((state) => ({
      asteroidDensity: state.experienceSettings.asteroidDensity,
      nebula: state.experienceSettings.nebula,
      setIsLoaded: state.setIsLoaded,
      shootingStars: state.experienceSettings.shootingStars,
      starDensity: state.experienceSettings.starDensity,
    }))
  );
  const angleOffsets = useMemo(
    () => Object.fromEntries(PLANETS.map((planet) => [planet.id, planet.orbitPhase ?? 0])),
    []
  );
  const planetAngles = useRef<Record<string, number>>(
    Object.fromEntries(PLANETS.map((planet) => [planet.id, angleOffsets[planet.id]]))
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoaded(true), ANIMATION_SETTINGS.loadingDelayMs);
    return () => window.clearTimeout(timeout);
  }, [setIsLoaded]);

  const primaryStarCount = Math.max(
    300,
    Math.round(SCENE_SETTINGS.primaryStars.count * starDensity)
  );
  const secondaryStarCount = Math.max(
    120,
    Math.round(SCENE_SETTINGS.secondaryStars.count * starDensity)
  );
  const shootingStarCount = shootingStars ? Math.max(1, Math.round(4 * starDensity)) : 0;
  const innerAsteroidCount = Math.round(120 * asteroidDensity);
  const outerAsteroidCount = Math.round(48 * asteroidDensity);

  const backgroundColor = useMemo(() => new THREE.Color(SCENE_SETTINGS.background), []);

  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <FrameScheduler />

      <ambientLight intensity={0.14} color={SCENE_COLORS.lighting.ambient} />
      <hemisphereLight
        intensity={0.22}
        color={SCENE_COLORS.lighting.hemisphere}
        groundColor={SCENE_COLORS.lighting.ground}
      />

      <pointLight
        position={[110, 70, 90]}
        intensity={0.7}
        color={SCENE_COLORS.lighting.key}
        distance={320}
        decay={1.8}
      />
      <pointLight
        position={[-120, -50, -70]}
        intensity={0.28}
        color={SCENE_COLORS.lighting.fill}
        distance={320}
        decay={1.9}
      />

      <Stars {...SCENE_SETTINGS.primaryStars} count={primaryStarCount} fade />
      <Stars {...SCENE_SETTINGS.secondaryStars} count={secondaryStarCount} fade />
      {nebula && <Nebula density={starDensity} />}

      <Sun3D />

      {Array.from({ length: shootingStarCount }).map((_, i) => (
        <ShootingStar key={i} />
      ))}

      {PLANETS.map((planet) => (
        <Planet3D key={planet.id} planet={planet} angleRef={planetAngles} />
      ))}

      {innerAsteroidCount > 0 && (
        <AsteroidBelt
          innerRadius={48}
          outerRadius={54}
          count={innerAsteroidCount}
          color={SCENE_COLORS.asteroids.inner}
        />
      )}
      {outerAsteroidCount > 0 && (
        <AsteroidBelt
          innerRadius={98}
          outerRadius={104}
          count={outerAsteroidCount}
          color={SCENE_COLORS.asteroids.outer}
        />
      )}

      <fog attach="fog" args={[backgroundColor, SCENE_SETTINGS.fogNear, SCENE_SETTINGS.fogFar]} />

      <CameraController planetAngles={planetAngles} />
    </>
  );
}

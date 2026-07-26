import { PLANET_TYPE_MAP } from '@/constants/scene'
import { useOrbitAnimation } from '@/hooks/use-orbit-animation'
import { usePlanetInteraction } from '@/hooks/use-planet-interaction'
import { useSpaceStore } from '@/store/space-store'
import type { Planet } from '@/types/portfolio'
import type { GroupRef, MeshRef, PlanetAnglesRef, ShaderMaterialRef } from '@/types/three'
import { getPlanetOrbitCenterY, getPlanetOrbitRotation, getPlanetPosition } from '@/utils/orbit-utils'
import { makeRingTexture } from '@/utils/textures'
import { Html } from '@react-three/drei'
import type { CSSProperties } from 'react'
import { memo, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import * as THREE from 'three'
import { useShallow } from 'zustand/react/shallow'
import { OrbitParticles } from './orbit-particles'
import { SmallMoon } from './small-moon'

interface Planet3DProps {
  angleRef: PlanetAnglesRef
  planet: Planet
}

interface PlanetLabelStyle extends CSSProperties {
  '--planet-accent': string
}

export const Planet3D = memo(function Planet3D({ angleRef, planet }: Planet3DProps) {
  const { t } = useTranslation()
  const {
    activePanel,
    activePlanet,
    handlePlanetClick,
    orbitalParticles,
    planetRotation,
    setCursorVariant,
    starDensity,
  } = useSpaceStore(
    useShallow((state) => ({
      activePanel: state.activePanel,
      activePlanet: state.activePlanet,
      handlePlanetClick: state.handlePlanetClick,
      orbitalParticles: state.experienceSettings.orbitalParticles,
      planetRotation: state.experienceSettings.planetRotation,
      setCursorVariant: state.setCursorVariant,
      starDensity: state.experienceSettings.starDensity,
    }))
  )

  const groupPositionScratch = useRef(new THREE.Vector3())
  const meshRef = useRef<MeshRef['current']>(null)
  const groupRef = useRef<GroupRef['current']>(null)
  const atmosphereRef = useRef<MeshRef['current']>(null)
  const planetMaterialRef = useRef<ShaderMaterialRef['current']>(null)
  const atmosphereMaterialRef = useRef<ShaderMaterialRef['current']>(null)
  const isActive = activePlanet === planet.id
  const interaction = usePlanetInteraction({
    handlePlanetClick,
    planetId: planet.id,
    setCursorVariant,
  })
  const lightDirection = useOrbitAnimation({
    activePanel,
    angleRef,
    atmosphereMaterialRef,
    atmosphereMeshRef: atmosphereRef,
    groupRef,
    hovered: interaction.hovered,
    isActive,
    meshRef,
    planet,
    planetMaterialRef,
    planetRotation,
  })
  const ringTexture = useMemo(
    () => (planet.hasRings ? makeRingTexture(planet.ringColor ?? planet.color) : null),
    [planet.color, planet.hasRings, planet.ringColor]
  )
  const planetType = PLANET_TYPE_MAP[planet.type] ?? 0
  const orbitRotation = useMemo(() => getPlanetOrbitRotation(planet), [planet])
  const orbitCenterY = useMemo(() => getPlanetOrbitCenterY(planet), [planet])
  const baseColor = useMemo(() => new THREE.Color(planet.color), [planet.color])
  const atmosphereColor = useMemo(
    () => new THREE.Color(planet.atmosphereColor),
    [planet.atmosphereColor]
  )
  const labelStyle = useMemo<PlanetLabelStyle>(
    () => ({
      '--planet-accent': planet.glowColor,
    }),
    [planet.glowColor]
  )

  useEffect(() => {
    return () => {
      ringTexture?.dispose()
    }
  }, [ringTexture])

  return (
    <>
      <mesh rotation={orbitRotation} position={[0, orbitCenterY, 0]}>
        <ringGeometry args={[planet.orbitRadius - 0.04, planet.orbitRadius + 0.04, 128]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.035}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={groupRef} position={getPlanetPosition(planet, angleRef.current[planet.id], groupPositionScratch.current)}>
        <mesh
          ref={atmosphereRef}
          scale={[planet.size * 1.35, planet.size * 1.35, planet.size * 1.35]}
        >
          <sphereGeometry args={[1, 48, 48]} />
          <advancedAtmosphereMaterial
            ref={atmosphereMaterialRef}
            uColor={atmosphereColor}
            uIntensity={0.85}
            transparent
            depthWrite={false}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh
          ref={meshRef}
          onClick={interaction.handleClick}
          onPointerEnter={interaction.handlePointerEnter}
          onPointerLeave={interaction.handlePointerLeave}
        >
          <sphereGeometry args={[planet.size, 96, 96]} />
          <aaaPlanetMaterial
            ref={planetMaterialRef}
            uColor={baseColor}
            uType={planetType}
            uLightDir={lightDirection}
          />
        </mesh>

        {planet.hasRings && ringTexture && (
          <group rotation={[Math.PI / 6, 0, 0.15]}>
            <mesh>
              <ringGeometry args={[planet.size * 1.45, planet.size * 2.3, 96]} />
              <meshBasicMaterial
                map={ringTexture}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh>
              <ringGeometry args={[planet.size * 1.3, planet.size * 1.35, 96]} />
              <meshBasicMaterial
                color={planet.glowColor}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        )}

        {planet.size > 3 && (
          <SmallMoon size={planet.size} color={planet.color} lightDir={lightDirection} />
        )}

        {!activePanel && (
          <Html
            position={[0, planet.size + 5.2, 0]}
            transform
            sprite
            center
            distanceFactor={14}
            zIndexRange={[20, 0]}
            pointerEvents="none"
          >
            <div
              className={`planet-label ${isActive ? 'planet-label-active' : interaction.hovered ? 'planet-label-hovered' : ''}`}
              style={labelStyle}
            >
              <div className="planet-label-kicker">{t('common.orbital_dossier')}</div>
              <div className="planet-label-name">{t(`planets.${planet.id}.name`)}</div>
              <div className="planet-label-subtitle">{t(`planets.${planet.id}.subtitle`)}</div>
              <div className="planet-label-description">
                {t(`planets.${planet.id}.description`)}
              </div>
            </div>
          </Html>
        )}

        {isActive && orbitalParticles && (
          <OrbitParticles
            color={planet.glowColor}
            density={starDensity}
            size={planet.size}
          />
        )}
      </group>
    </>
  )
})

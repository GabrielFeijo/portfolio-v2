import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useSpaceStore } from '@/store/space-store'
import { Planet3D } from './planet-3d'
import { Sun3D, ShootingStar } from './sun-3d'
import { AsteroidBelt } from './asteroid-belt'
import { Nebula } from './nebula'
import { PLANETS } from '@/data/portfolio'

export function SpaceScene() {
  const { camera } = useThree()
  const { activePlanet, activePanel, setIsLoaded } = useSpaceStore()
  const camTarget = useRef(new THREE.Vector3(0, 22, 64))
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0))
  const planetAngles = useRef<Record<string, number>>(
    Object.fromEntries(PLANETS.map((p, i) => [p.id, (i * Math.PI * 2) / PLANETS.length + 0.3]))
  )

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 2200)
    return () => clearTimeout(t)
  }, [setIsLoaded])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    PLANETS.forEach(p => { planetAngles.current[p.id] += delta * p.orbitSpeed * 0.1 })

    if (!activePanel) {
      if (activePlanet) {
        const planet = PLANETS.find(p => p.id === activePlanet)
        if (planet) {
          const angle = planetAngles.current[planet.id]
          const px = Math.cos(angle) * planet.orbitRadius
          const pz = Math.sin(angle) * planet.orbitRadius
          camTarget.current.set(px, planet.size + 7, pz + planet.size * 2.8 + 10)
          lookTarget.current.set(px, 0, pz)
        }
      } else {
        camTarget.current.set(
          Math.sin(t * 0.04) * 4,
          24 + Math.sin(t * 0.07) * 2.5,
          62 + Math.cos(t * 0.05) * 3
        )
        lookTarget.current.set(Math.sin(t * 0.02) * 2, 0, 0)
      }
      camera.position.lerp(camTarget.current, delta * 1.6)
      camera.lookAt(lookTarget.current)
    }
  })

  return (
    <>
      <ambientLight intensity={0.06} color="#050520" />

      <pointLight position={[90, 50, 50]} intensity={0.5} color="#00D4FF" distance={250} decay={1.5} />
      <pointLight position={[-90, -40, -40]} intensity={0.3} color="#6B21E8" distance={220} decay={1.5} />
      <pointLight position={[0, -90, 0]} intensity={0.2} color="#FF1493" distance={180} decay={2} />
      <pointLight position={[-40, 60, 80]} intensity={0.15} color="#00FF88" distance={200} decay={2} />

      <Stars radius={600} depth={150} count={10000} factor={4} saturation={0.1} fade speed={0.2} />
      <Stars radius={250} depth={80} count={4000} factor={2} saturation={0.4} fade speed={0.1} />

      <Nebula />
      <Sun3D />

      {Array.from({ length: 5 }).map((_, i) => <ShootingStar key={i} />)}

      {PLANETS.map(planet => (
        <Planet3D
          key={planet.id}
          planet={planet}
          initialAngle={planetAngles.current[planet.id]}
          angleRef={planetAngles}
        />
      ))}

      <AsteroidBelt innerRadius={37} outerRadius={41} count={320} color="#886644" />
      <AsteroidBelt innerRadius={73} outerRadius={79} count={150} color="#445566" />

      <fog attach="fog" args={['#000008', 130, 650]} />
    </>
  )
}

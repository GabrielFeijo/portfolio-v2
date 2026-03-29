import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useSpaceStore } from '@/store/space-store'
import { Planet3D } from './planet-3d'
import { Sun3D } from './sun-3d'
import { AsteroidBelt } from './asteroid-belt'
import { Nebula } from './nebula'
import { PLANETS } from '@/data/portfolio'

export function SpaceScene() {
  const { camera } = useThree()
  const { activePlanet, activePanel, setIsLoaded } = useSpaceStore()
  const camTarget = useRef(new THREE.Vector3(0, 20, 62))
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0))
  const planetAngles = useRef<Record<string, number>>(
    Object.fromEntries(PLANETS.map((p, i) => [p.id, (i * Math.PI * 2) / PLANETS.length + 0.3]))
  )

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 2000)
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
          camTarget.current.set(px, planet.size + 6, pz + planet.size * 2.5 + 10)
          lookTarget.current.set(px, 0, pz)
        }
      } else {
        camTarget.current.set(Math.sin(t * 0.05) * 3, 25 + Math.sin(t * 0.08) * 2, 62)
        lookTarget.current.set(0, 0, 0)
      }
      camera.position.lerp(camTarget.current, delta * 1.8)
      camera.lookAt(lookTarget.current)
    }
  })

  return (
    <>
      <ambientLight intensity={0.08} color="#0A0A2E" />
      <pointLight position={[0, 0, 0]} intensity={5} color="#FFF5E0" distance={250} decay={1.2} />
      <pointLight position={[80, 40, 40]} intensity={0.4} color="#00D4FF" distance={200} />
      <pointLight position={[-80, -40, -40]} intensity={0.25} color="#6B21E8" distance={200} />
      <pointLight position={[0, -80, 0]} intensity={0.15} color="#FF1493" distance={150} />

      <Stars radius={500} depth={120} count={8000} factor={4} saturation={0} fade speed={0.3} />
      <Stars radius={200} depth={60} count={3000} factor={2} saturation={0.3} fade speed={0.15} />

      <Nebula />
      <Sun3D />

      {PLANETS.map((planet) => (
        <Planet3D
          key={planet.id}
          planet={planet}
          initialAngle={planetAngles.current[planet.id]}
          angleRef={planetAngles}
        />
      ))}

      <AsteroidBelt innerRadius={37} outerRadius={40} count={280} color="#886644" />
      <AsteroidBelt innerRadius={72} outerRadius={78} count={130} color="#445566" />
      <fog attach="fog" args={['#000008', 120, 600]} />
    </>
  )
}

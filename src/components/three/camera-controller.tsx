import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import * as THREE from 'three'
import { useSpaceStore } from '@/store/space-store'
import { PLANETS } from '@/data/portfolio'
import { getPlanetPosition } from './orbit-utils'

export function CameraController({ planetAngles }: { planetAngles: React.MutableRefObject<Record<string, number>> }) {
  const controlsRef = useRef<CameraControls>(null)
  const { camera } = useThree()
  const { activePlanet, activePanel, warpActive, setWarpActive } = useSpaceStore()

  const idleCameraPos = useRef(new THREE.Vector3(-14, 24, 68))
  const idleLookAt = useRef(new THREE.Vector3(5, -1, -8))

  useEffect(() => {
    if (!controlsRef.current) return
    const controls = controlsRef.current

    controls.minPolarAngle = Math.PI / 4
    controls.maxPolarAngle = Math.PI / 1.2
    
    controls.mouseButtons.right = 0 
    controls.mouseButtons.wheel = 16
    controls.minDistance = 25
    controls.maxDistance = 260

    setWarpActive(true)
    setTimeout(() => setWarpActive(false), 800)
  }, [activePlanet, setWarpActive])

  useEffect(() => {
    if (!controlsRef.current) return
    const controls = controlsRef.current
    if (activePanel && activePlanet) {
      const planet = PLANETS.find(p => p.id === activePlanet)
      if (planet) {
        const offsetDist = planet.size * 3.2 + 12
        const angle = planetAngles.current[planet.id]
        const position = getPlanetPosition(planet, angle)
        const px = position.x
        const py = position.y
        const pz = position.z

        const xOffset = 7.5
        controls.setLookAt(px + xOffset, py + planet.size + 5, pz + offsetDist, px + xOffset * 0.45, py, pz, true)
      }
    } else {
      controls.setLookAt(
        idleCameraPos.current.x,
        idleCameraPos.current.y,
        idleCameraPos.current.z,
        idleLookAt.current.x,
        idleLookAt.current.y,
        idleLookAt.current.z,
        true
      )
    }
  }, [activePanel, activePlanet, planetAngles])

  useFrame((state, delta) => {
    if (!controlsRef.current) return
    const controls = controlsRef.current

    if (!activePanel) {
      controls.azimuthAngle -= delta * 0.022
    }
    
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    if (warpActive) {
      perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 95, delta * 5)
    } else if (activePanel) {
      perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 48, delta * 3)
    } else {
      perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 54, delta * 2)
    }
    camera.updateProjectionMatrix()
  })

  return (
    <CameraControls 
      ref={controlsRef} 
      makeDefault 
      smoothTime={0.8}
    />
  )
}

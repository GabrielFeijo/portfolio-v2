import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import * as THREE from 'three'
import { useSpaceStore } from '@/store/space-store'
import { PLANETS } from '@/data/portfolio'

export function CameraController({ planetAngles }: { planetAngles: React.MutableRefObject<Record<string, number>> }) {
  const controlsRef = useRef<CameraControls>(null)
  const { camera, pointer } = useThree()
  const { activePlanet, activePanel, warpActive, setWarpActive } = useSpaceStore()

  const idleCameraPos = useRef(new THREE.Vector3(0, 24, 62))
  const idleLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    if (!controlsRef.current) return
    const controls = controlsRef.current

    controls.minPolarAngle = Math.PI / 4
    controls.maxPolarAngle = Math.PI / 1.2
    
    controls.mouseButtons.right = 0 
    controls.mouseButtons.wheel = 16
    controls.minDistance = 25
    controls.maxDistance = 140

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
        const px = Math.cos(angle) * planet.orbitRadius
        const pz = Math.sin(angle) * planet.orbitRadius
        controls.setLookAt(px, planet.size + 4, pz + offsetDist, px, 0, pz, true)
      }
    } else {
      controls.setLookAt(0, 24, 62, 0, 0, 0, true)
    }
  }, [activePanel, activePlanet, planetAngles])

  useFrame((state, delta) => {
    if (!controlsRef.current) return
    const controls = controlsRef.current

    if (!activePanel) {
      controls.azimuthAngle -= delta * 0.03
    }
    
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    if (warpActive) {
      perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 95, delta * 5)
    } else if (activePanel) {
      perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 50, delta * 3)
    } else {
      perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 58, delta * 2)
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

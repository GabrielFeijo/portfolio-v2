import { CAMERA_SETTINGS } from '@/constants/camera'
import { useCameraTransition } from '@/hooks/use-camera-transition'
import { useSpaceStore } from '@/store/space-store'
import type { PlanetAnglesRef } from '@/types/three'
import { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useShallow } from 'zustand/react/shallow'

interface CameraControllerProps {
  planetAngles: PlanetAnglesRef
}

export function CameraController({ planetAngles }: CameraControllerProps) {
  const controlsRef = useRef<CameraControls | null>(null)
  const { camera, size } = useThree()
  const { activePanel, activePlanet, settings, warpActive } = useSpaceStore(
    useShallow((state) => ({
      activePanel: state.activePanel,
      activePlanet: state.activePlanet,
      settings: state.experienceSettings,
      warpActive: state.warpActive,
    }))
  )

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    controls.minPolarAngle = CAMERA_SETTINGS.minPolarAngle
    controls.maxPolarAngle = CAMERA_SETTINGS.maxPolarAngle
    controls.mouseButtons.right = 0
    controls.mouseButtons.wheel = 16
    controls.minDistance = CAMERA_SETTINGS.minDistance
    controls.maxDistance = CAMERA_SETTINGS.maxDistance
  }, [])

  useCameraTransition({
    activePanel,
    activePlanet,
    camera,
    controlsRef,
    planetAngles,
    smooth: settings.transitionAnimations,
    viewportWidth: size.width,
  })

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls || !(camera instanceof THREE.PerspectiveCamera)) return

    if (!activePanel && settings.autoRotate) {
      controls.azimuthAngle -= delta * CAMERA_SETTINGS.idleAzimuthSpeed
    }

    if (warpActive && settings.warpEffects) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, CAMERA_SETTINGS.warpFov, delta * 5)
    } else if (activePanel) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, CAMERA_SETTINGS.panelFov, delta * 3)
    } else {
      camera.fov = THREE.MathUtils.lerp(camera.fov, CAMERA_SETTINGS.idleFov, delta * 2)
    }

    camera.updateProjectionMatrix()
  })

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={settings.transitionAnimations ? CAMERA_SETTINGS.smoothTime : 0.05}
    />
  )
}

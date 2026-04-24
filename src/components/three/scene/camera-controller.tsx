import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import * as THREE from 'three'
import { ANIMATION_SETTINGS } from '@/constants/animation'
import { CAMERA_SETTINGS } from '@/constants/camera'
import { useCameraTransition } from '@/hooks/use-camera-transition'
import { useSpaceStore } from '@/store/space-store'
import type { PlanetAnglesRef } from '@/types/three'

interface CameraControllerProps {
  planetAngles: PlanetAnglesRef
}

export function CameraController({ planetAngles }: CameraControllerProps) {
  const controlsRef = useRef<CameraControls | null>(null)
  const { camera, size } = useThree()
  const { activePlanet, activePanel, warpActive, setWarpActive } = useSpaceStore()
  const previousPanelRef = useRef(activePanel)

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

  useEffect(() => {
    const previousPanel = previousPanelRef.current
    previousPanelRef.current = activePanel
    if (!previousPanel || activePanel) return

    setWarpActive(true)
    const timeout = window.setTimeout(() => setWarpActive(false), ANIMATION_SETTINGS.warpDurationMs)
    return () => window.clearTimeout(timeout)
  }, [activePanel, setWarpActive])

  useCameraTransition({
    activePanel,
    activePlanet,
    camera,
    controlsRef,
    planetAngles,
    viewportWidth: size.width,
  })

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls || !(camera instanceof THREE.PerspectiveCamera)) return

    if (!activePanel) {
      controls.azimuthAngle -= delta * CAMERA_SETTINGS.idleAzimuthSpeed
    }

    if (warpActive) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, CAMERA_SETTINGS.warpFov, delta * 5)
    } else if (activePanel) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, CAMERA_SETTINGS.panelFov, delta * 3)
    } else {
      camera.fov = THREE.MathUtils.lerp(camera.fov, CAMERA_SETTINGS.idleFov, delta * 2)
    }

    camera.updateProjectionMatrix()
  })

  return <CameraControls ref={controlsRef} makeDefault smoothTime={CAMERA_SETTINGS.smoothTime} />
}

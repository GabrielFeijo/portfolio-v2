import { useEffect } from 'react'
import type { MutableRefObject } from 'react'
import type { CameraControls } from '@react-three/drei'
import * as THREE from 'three'
import { CAMERA_SETTINGS, IDLE_CAMERA_POSITION, IDLE_LOOK_AT } from '@/constants/camera'
import { PLANETS } from '@/data/portfolio'
import { getPlanetPosition } from '@/components/three/orbit-utils'
import { getPanelCameraLookAt } from '@/utils/camera'
import type { PanelId } from '@/types/portfolio'
import type { PlanetAnglesRef } from '@/types/three'

interface UseCameraTransitionOptions {
  activePanel: PanelId | null
  activePlanet: string | null
  camera: THREE.Camera
  controlsRef: MutableRefObject<CameraControls | null>
  planetAngles: PlanetAnglesRef
  smooth: boolean
  viewportWidth: number
}

export function useCameraTransition({
  activePanel,
  activePlanet,
  camera,
  controlsRef,
  planetAngles,
  smooth,
  viewportWidth,
}: UseCameraTransitionOptions) {
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    if (activePanel && activePlanet && camera instanceof THREE.PerspectiveCamera) {
      const planet = PLANETS.find((item) => item.id === activePlanet)
      if (!planet) return

      const position = getPlanetPosition(planet, planetAngles.current[planet.id])
      const lookAt = getPanelCameraLookAt({
        camera,
        planet,
        planetPosition: position,
        viewportWidth,
      })

      controls.setLookAt(
        lookAt.cameraPosition.x,
        lookAt.cameraPosition.y,
        lookAt.cameraPosition.z,
        lookAt.targetPosition.x,
        lookAt.targetPosition.y,
        lookAt.targetPosition.z,
        smooth,
      )
      return
    }

    controls.setLookAt(
      IDLE_CAMERA_POSITION.x,
      IDLE_CAMERA_POSITION.y,
      IDLE_CAMERA_POSITION.z,
      IDLE_LOOK_AT.x,
      IDLE_LOOK_AT.y,
      IDLE_LOOK_AT.z,
      smooth,
    )
  }, [activePanel, activePlanet, camera, controlsRef, planetAngles, smooth, viewportWidth])
}

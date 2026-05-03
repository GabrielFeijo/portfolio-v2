import { CAMERA_SETTINGS } from '@/constants/camera'
import type { Planet } from '@/types/portfolio'
import * as THREE from 'three'

interface PanelCameraOffsetInput {
  camera: THREE.PerspectiveCamera
  planet: Planet
  planetPosition: THREE.Vector3
  viewportWidth: number
}

export function getPanelCameraLookAt({
  camera,
  planet,
  planetPosition,
  viewportWidth,
}: PanelCameraOffsetInput) {
  const offsetDistance = planet.size * 3.2 + 12
  const panelWidthPx = viewportWidth >= CAMERA_SETTINGS.panelBreakpoint ? Math.min(CAMERA_SETTINGS.panelMaxWidth, viewportWidth) : 0
  const halfPanelPx = panelWidthPx * 0.5

  const cameraPosition = new THREE.Vector3(
    planetPosition.x,
    planetPosition.y + planet.size + 5,
    planetPosition.z + offsetDistance,
  )
  const targetPosition = new THREE.Vector3(planetPosition.x, planetPosition.y, planetPosition.z)
  const focusDistance = cameraPosition.distanceTo(targetPosition)
  const verticalFovRad = THREE.MathUtils.degToRad(camera.fov)
  const horizontalFovRad = 2 * Math.atan(Math.tan(verticalFovRad * 0.5) * camera.aspect)
  const visibleWidthAtTarget = 2 * focusDistance * Math.tan(horizontalFovRad * 0.5)
  const worldUnitsPerPixel = visibleWidthAtTarget / Math.max(viewportWidth, 1)
  const xOffset = halfPanelPx * worldUnitsPerPixel

  return {
    cameraPosition: new THREE.Vector3(cameraPosition.x + xOffset, cameraPosition.y, cameraPosition.z),
    targetPosition: new THREE.Vector3(planetPosition.x + xOffset * 0.45, planetPosition.y, planetPosition.z),
  }
}

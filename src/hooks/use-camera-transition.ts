import { getPlanetPosition } from '@/utils/orbit-utils';
import {
  CAMERA_SETTINGS,
  IDLE_CAMERA_POSITION,
  IDLE_LOOK_AT,
  MOBILE_IDLE_CAMERA_POSITION,
  MOBILE_IDLE_LOOK_AT,
} from '@/constants/camera';
import { PLANETS } from '@/data/portfolio';
import type { PanelId } from '@/types/portfolio';
import type { PlanetAnglesRef } from '@/types/three';
import { getPanelCameraLookAt } from '@/utils/camera';
import type { CameraControls } from '@react-three/drei';
import type { MutableRefObject } from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface UseCameraTransitionOptions {
  activePanel: PanelId | null;
  activePlanet: PanelId | null;
  camera: THREE.Camera;
  controlsRef: MutableRefObject<CameraControls | null>;
  planetAngles: PlanetAnglesRef;
  smooth: boolean;
  viewportWidth: number;
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
  const positionScratch = useRef(new THREE.Vector3());

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (activePanel && activePlanet && camera instanceof THREE.PerspectiveCamera) {
      const planet = PLANETS.find((item) => item.id === activePlanet);
      if (!planet) return;

      const position = getPlanetPosition(
        planet,
        planetAngles.current[planet.id],
        positionScratch.current
      );
      const lookAt = getPanelCameraLookAt({
        camera,
        planet,
        planetPosition: position,
        viewportWidth,
      });

      controls.setLookAt(
        lookAt.cameraPosition.x,
        lookAt.cameraPosition.y,
        lookAt.cameraPosition.z,
        lookAt.targetPosition.x,
        lookAt.targetPosition.y,
        lookAt.targetPosition.z,
        smooth
      );
      return;
    }

    const mobile = viewportWidth < CAMERA_SETTINGS.panelBreakpoint;
    const idlePosition = mobile ? MOBILE_IDLE_CAMERA_POSITION : IDLE_CAMERA_POSITION;
    const idleTarget = mobile ? MOBILE_IDLE_LOOK_AT : IDLE_LOOK_AT;

    controls.setLookAt(
      idlePosition.x,
      idlePosition.y,
      idlePosition.z,
      idleTarget.x,
      idleTarget.y,
      idleTarget.z,
      smooth
    );
  }, [activePanel, activePlanet, camera, controlsRef, planetAngles, smooth, viewportWidth]);
}

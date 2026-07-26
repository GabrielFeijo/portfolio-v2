import { CAMERA_SETTINGS } from '@/constants/camera';
import { useCameraTransition } from '@/hooks/use-camera-transition';
import { useSpaceStore } from '@/store/space-store';
import type { PlanetAnglesRef } from '@/types/three';
import { CameraControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';

interface CameraControllerProps {
  planetAngles: PlanetAnglesRef;
}

export function CameraController({ planetAngles }: CameraControllerProps) {
  const controlsRef = useRef<CameraControls | null>(null);
  const { camera, size } = useThree();
  const { activePanel, activePlanet, autoRotate, transitionAnimations, warpActive, warpEffects } =
    useSpaceStore(
      useShallow((state) => ({
        activePanel: state.activePanel,
        activePlanet: state.activePlanet,
        autoRotate: state.experienceSettings.autoRotate,
        transitionAnimations: state.experienceSettings.transitionAnimations,
        warpActive: state.warpActive,
        warpEffects: state.experienceSettings.warpEffects,
      }))
    );

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    controls.minPolarAngle = CAMERA_SETTINGS.minPolarAngle;
    controls.maxPolarAngle = CAMERA_SETTINGS.maxPolarAngle;
    controls.mouseButtons.right = 0;
    controls.mouseButtons.wheel = 16;
    controls.minDistance = CAMERA_SETTINGS.minDistance;
    controls.maxDistance = CAMERA_SETTINGS.maxDistance;
  }, []);

  useCameraTransition({
    activePanel,
    activePlanet,
    camera,
    controlsRef,
    planetAngles,
    smooth: transitionAnimations,
    viewportWidth: size.width,
  });

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || !(camera instanceof THREE.PerspectiveCamera)) return;

    if (!activePanel && autoRotate) {
      controls.azimuthAngle -= delta * CAMERA_SETTINGS.idleAzimuthSpeed;
    }

    const targetFov =
      warpActive && warpEffects
        ? CAMERA_SETTINGS.warpFov
        : activePanel
          ? CAMERA_SETTINGS.panelFov
          : CAMERA_SETTINGS.idleFov;
    const lerpSpeed = warpActive && warpEffects ? 5 : activePanel ? 3 : 2;

    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * lerpSpeed);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={transitionAnimations ? CAMERA_SETTINGS.smoothTime : 0.05}
    />
  );
}

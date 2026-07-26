import * as THREE from 'three';

export const CAMERA_SETTINGS = {
  minPolarAngle: Math.PI / 4,
  maxPolarAngle: Math.PI / 1.2,
  minDistance: 25,
  maxDistance: 260,
  smoothTime: 0.8,
  idleAzimuthSpeed: 0.022,
  warpFov: 95,
  panelFov: 48,
  idleFov: 54,
  panelMaxWidth: 620,
  panelBreakpoint: 640,
} as const;

export const IDLE_CAMERA_POSITION = new THREE.Vector3(-14, 24, 68);
export const IDLE_LOOK_AT = new THREE.Vector3(5, -1, -8);

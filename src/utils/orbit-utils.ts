import type { Planet } from '@/types/portfolio';
import * as THREE from 'three';

export function getPlanetOrbitCenterY(planet: Planet) {
  return (planet.orbitY ?? 0) * 0.45;
}

export function getPlanetOrbitTilt(planet: Planet) {
  const orbitY = planet.orbitY ?? 0;

  return {
    x: THREE.MathUtils.clamp(orbitY * 0.012, -0.24, 0.24),
    z: THREE.MathUtils.clamp(orbitY * 0.007, -0.14, 0.14),
  };
}

export function getPlanetOrbitRotation(planet: Planet): [number, number, number] {
  const tilt = getPlanetOrbitTilt(planet);
  return [Math.PI / 2 + tilt.x, 0, tilt.z];
}

const _euler = new THREE.Euler();
const _defaultTarget = new THREE.Vector3();

export function getPlanetPosition(planet: Planet, angle: number, target = _defaultTarget) {
  const tilt = getPlanetOrbitTilt(planet);

  target.set(Math.cos(angle) * planet.orbitRadius, 0, Math.sin(angle) * planet.orbitRadius);

  _euler.set(tilt.x, 0, tilt.z);
  target.applyEuler(_euler);
  target.y += getPlanetOrbitCenterY(planet);

  return target;
}

export function getPlanetPositionTo(planet: Planet, angle: number, out: THREE.Vector3) {
  const tilt = getPlanetOrbitTilt(planet);

  out.set(Math.cos(angle) * planet.orbitRadius, 0, Math.sin(angle) * planet.orbitRadius);

  _euler.set(tilt.x, 0, tilt.z);
  out.applyEuler(_euler);
  out.y += getPlanetOrbitCenterY(planet);

  return out;
}

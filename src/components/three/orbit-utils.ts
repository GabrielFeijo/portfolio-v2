import type { Planet } from '@/data/portfolio'
import * as THREE from 'three'

export function getPlanetOrbitCenterY(planet: Planet) {
  return (planet.orbitY ?? 0) * 0.45
}

export function getPlanetOrbitTilt(planet: Planet) {
  const orbitY = planet.orbitY ?? 0

  return {
    x: THREE.MathUtils.clamp(orbitY * 0.012, -0.24, 0.24),
    z: THREE.MathUtils.clamp(orbitY * 0.007, -0.14, 0.14),
  }
}

export function getPlanetOrbitRotation(planet: Planet): [number, number, number] {
  const tilt = getPlanetOrbitTilt(planet)
  return [Math.PI / 2 + tilt.x, 0, tilt.z]
}

export function getPlanetPosition(planet: Planet, angle: number) {
  const tilt = getPlanetOrbitTilt(planet)
  const position = new THREE.Vector3(
    Math.cos(angle) * planet.orbitRadius,
    0,
    Math.sin(angle) * planet.orbitRadius,
  )

  position.applyEuler(new THREE.Euler(tilt.x, 0, tilt.z))
  position.y += getPlanetOrbitCenterY(planet)

  return position
}

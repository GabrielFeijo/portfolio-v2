import { createRandom } from '@/utils/textures'
import * as THREE from 'three'

export function createStarPositions(count: number, radius: number, spread: number, seed: number) {
  const rand = createRandom(seed)
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i += 1) {
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    const localRadius = radius + (rand() - 0.5) * spread
    const sinPhi = Math.sin(phi)

    positions[i * 3] = Math.cos(theta) * sinPhi * localRadius
    positions[i * 3 + 1] = Math.cos(phi) * localRadius * 0.7
    positions[i * 3 + 2] = Math.sin(theta) * sinPhi * localRadius - radius * 0.35
  }

  return positions
}

export function createStarColors(count: number, palette: string[], seed: number) {
  const rand = createRandom(seed)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i += 1) {
    const color = new THREE.Color(palette[Math.floor(rand() * palette.length)])
    const intensity = 0.72 + rand() * 0.45
    colors[i * 3] = Math.min(1, color.r * intensity)
    colors[i * 3 + 1] = Math.min(1, color.g * intensity)
    colors[i * 3 + 2] = Math.min(1, color.b * intensity)
  }

  return colors
}

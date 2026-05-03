import type { ThreeElements as FiberThreeElements } from '@react-three/fiber'
import type { MutableRefObject, RefAttributes } from 'react'
import * as THREE from 'three'

export type PlanetAnglesRef = MutableRefObject<Record<string, number>>
export type Vec3Tuple = [number, number, number]

type ShaderMaterialElement = FiberThreeElements['shaderMaterial'] &
  RefAttributes<THREE.ShaderMaterial>

declare module '@react-three/fiber' {
  interface ThreeElements {
    advancedAtmosphereMaterial: ShaderMaterialElement & {
      uColor?: THREE.Color
      uIntensity?: number
      uTime?: number
    }
    aaaPlanetMaterial: ShaderMaterialElement & {
      uColor?: THREE.Color
      uType?: number
      uTime?: number
      uLightDir?: THREE.Vector3
    }
    sunMaterial: ShaderMaterialElement & {
      uColorPrimary?: THREE.Color
      uColorSecondary?: THREE.Color
      uIntensity?: number
      uTime?: number
    }
  }
}

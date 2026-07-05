import type { ThreeElements as FiberThreeElements } from '@react-three/fiber'
import type { MutableRefObject, RefAttributes } from 'react'
import * as THREE from 'three'

export type PlanetAnglesRef = MutableRefObject<Record<string, number>>
export type Vec3Tuple = [number, number, number]

export type GroupRef = MutableRefObject<THREE.Group | null>
export type MeshRef = MutableRefObject<THREE.Mesh | null>
export type PointsRef = MutableRefObject<THREE.Points | null>
export type MaterialRef = MutableRefObject<THREE.Material | null>
export type ShaderMaterialRef = MutableRefObject<THREE.ShaderMaterial | null>
export type InstancedMeshRef = MutableRefObject<THREE.InstancedMesh | null>

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

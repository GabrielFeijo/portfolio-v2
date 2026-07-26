import { PLANETS } from '@/data/portfolio';
import { renderHook } from '@testing-library/react';
import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';

const useFrameMock = vi.fn();
vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: (state: { clock: { getElapsedTime: () => number } }, delta: number) => void) =>
    useFrameMock(cb),
}));

import { useOrbitAnimation } from '@/hooks/use-orbit-animation';

describe('useOrbitAnimation', () => {
  it('updates refs inside frame callback', () => {
    let frameCb:
      | ((state: { clock: { getElapsedTime: () => number } }, delta: number) => void)
      | undefined;
    useFrameMock.mockImplementation((cb) => {
      frameCb = cb;
    });

    const group = new THREE.Group();
    const mesh = new THREE.Mesh();
    const planetMaterial = {
      uniforms: { uTime: { value: 0 }, uLightDir: { value: new THREE.Vector3(0, 0, 0) } },
    } as any;
    const atmosphereMaterial = {
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 0 } },
    } as any;
    const atmosphereMesh = { scale: { setScalar: vi.fn() } } as any;

    renderHook(() =>
      useOrbitAnimation({
        activePanel: null,
        angleRef: { current: Object.fromEntries(PLANETS.map((p: { id: string }) => [p.id, 0])) },
        atmosphereMaterialRef: { current: atmosphereMaterial },
        atmosphereMeshRef: { current: atmosphereMesh },
        groupRef: { current: group },
        hovered: true,
        isActive: false,
        meshRef: { current: mesh },
        planet: PLANETS[0],
        planetMaterialRef: { current: planetMaterial },
        planetRotation: true,
      })
    );

    frameCb?.({ clock: { getElapsedTime: () => 2 } }, 0.16);

    expect(planetMaterial.uniforms.uTime.value).toBe(2);
    expect(planetMaterial.uniforms.uLightDir.value.length()).toBeGreaterThan(0);
    expect(atmosphereMesh.scale.setScalar).toHaveBeenCalled();
    expect(atmosphereMaterial.uniforms.uIntensity.value).toBe(1.2);
  });

  it('handles null refs and disabled states gracefully', () => {
    let frameCb:
      | ((state: { clock: { getElapsedTime: () => number } }, delta: number) => void)
      | undefined;
    useFrameMock.mockImplementation((cb) => {
      frameCb = cb;
    });

    renderHook(() =>
      useOrbitAnimation({
        activePanel: 'about',
        angleRef: { current: Object.fromEntries(PLANETS.map((p: { id: string }) => [p.id, 0])) },
        atmosphereMaterialRef: { current: null },
        atmosphereMeshRef: { current: null },
        groupRef: { current: null },
        hovered: false,
        isActive: true,
        meshRef: { current: null },
        planet: PLANETS[0],
        planetMaterialRef: { current: null },
        planetRotation: false,
      })
    );

    frameCb?.({ clock: { getElapsedTime: () => 2 } }, 0.16);

    expect(frameCb).toBeDefined();
  });

  it('updates intensity correctly when active or not hovered', () => {
    let frameCb:
      | ((state: { clock: { getElapsedTime: () => number } }, delta: number) => void)
      | undefined;
    useFrameMock.mockImplementation((cb) => {
      frameCb = cb;
    });

    const atmosphereMaterial = {
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 0 } },
    } as any;

    renderHook(() =>
      useOrbitAnimation({
        activePanel: null,
        angleRef: { current: Object.fromEntries(PLANETS.map((p: { id: string }) => [p.id, 0])) },
        atmosphereMaterialRef: { current: atmosphereMaterial },
        atmosphereMeshRef: { current: null },
        groupRef: { current: null },
        hovered: false,
        isActive: true,
        meshRef: { current: null },
        planet: PLANETS[0],
        planetMaterialRef: { current: null },
        planetRotation: true,
      })
    );

    frameCb?.({ clock: { getElapsedTime: () => 2 } }, 0.16);
    expect((atmosphereMaterial as any).uniforms.uIntensity.value).toBe(1.6);

    let frameCb2:
      | ((state: { clock: { getElapsedTime: () => number } }, delta: number) => void)
      | undefined;
    useFrameMock.mockImplementation((cb) => {
      frameCb2 = cb;
    });
    const atmosphereMaterial2 = {
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 0 } },
    } as any;

    renderHook(() =>
      useOrbitAnimation({
        activePanel: null,
        angleRef: { current: Object.fromEntries(PLANETS.map((p: { id: string }) => [p.id, 0])) },
        atmosphereMaterialRef: { current: atmosphereMaterial2 },
        atmosphereMeshRef: { current: null },
        groupRef: { current: null },
        hovered: false,
        isActive: false,
        meshRef: { current: null },
        planet: PLANETS[0],
        planetMaterialRef: { current: null },
        planetRotation: true,
      })
    );

    frameCb2?.({ clock: { getElapsedTime: () => 2 } }, 0.16);
    expect((atmosphereMaterial2 as any).uniforms.uIntensity.value).toBe(0.85);
  });
});

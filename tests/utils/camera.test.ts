import { PLANETS } from '@/data/portfolio';
import { getPanelCameraLookAt } from '@/utils/camera';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';

describe('camera utils', () => {
  it('returns camera and target offsets for wide viewport', () => {
    const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.1, 2000);
    const planet = PLANETS[0];
    const planetPosition = new THREE.Vector3(10, 4, -5);

    const result = getPanelCameraLookAt({
      camera,
      planet,
      planetPosition,
      viewportWidth: 1440,
    });

    expect(result.cameraPosition.x).toBeGreaterThan(planetPosition.x);
    expect(result.targetPosition.x).toBeGreaterThan(planetPosition.x);
  });

  it('returns no panel shift for small viewport', () => {
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 2000);
    const planet = PLANETS[0];
    const planetPosition = new THREE.Vector3(0, 0, 0);

    const result = getPanelCameraLookAt({
      camera,
      planet,
      planetPosition,
      viewportWidth: 480,
    });

    expect(result.targetPosition.x).toBe(0);
  });
});

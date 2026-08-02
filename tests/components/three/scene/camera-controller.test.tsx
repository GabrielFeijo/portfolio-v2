import { act, render } from '@testing-library/react';
import * as THREE from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CameraController } from '@/components/three/scene/camera-controller';

const mockSetWarpActive = vi.fn();
let mockState: any = {
  activePanel: null,
  activePlanet: null,
  experienceSettings: { transitionAnimations: true, warpEffects: true, autoRotate: true },
  setWarpActive: mockSetWarpActive,
  warpActive: false,
};

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: any) => {
    return selector ? selector(mockState) : mockState;
  },
}));

const mockFrameCallbacks: any[] = [];
let mockCamera: THREE.Camera = new THREE.PerspectiveCamera();
let attachControlsRef = true;
let controlsInstance: any = null;

vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: any) => {
    mockFrameCallbacks.push(cb);
  },
  useThree: () => ({
    camera: mockCamera,
    size: { width: 1000, height: 800 },
  }),
}));

vi.mock('@/hooks/use-camera-transition', () => ({
  useCameraTransition: vi.fn(),
}));

vi.mock('@react-three/drei', async () => {
  const React = await vi.importActual<typeof import('react')>('react');
  return {
    CameraControls: React.forwardRef((props: any, ref) => {
      const controls = {
        minPolarAngle: 0,
        maxPolarAngle: 0,
        mouseButtons: { right: 0, wheel: 0 },
        minDistance: 0,
        maxDistance: 0,
        azimuthAngle: 0,
      };
      controlsInstance = controls;
      React.useImperativeHandle(ref, () => (attachControlsRef ? controls : null), [controls]);
      return React.createElement(
        'div',
        { 'data-testid': 'camera-controls', ...props },
        props.children
      );
    }),
  };
});

describe('CameraController', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockFrameCallbacks.length = 0;
    mockCamera = new THREE.PerspectiveCamera();
    attachControlsRef = true;
    controlsInstance = null;
    mockState = {
      activePanel: null,
      activePlanet: null,
      experienceSettings: { transitionAnimations: true, warpEffects: true, autoRotate: true },
      setWarpActive: mockSetWarpActive,
      warpActive: false,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders and runs frame loop with different states', () => {
    const planetAngles = { current: {} };
    const { rerender } = render(<CameraController planetAngles={planetAngles as any} />);

    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 0.016));
    });

    mockState.activePanel = 'about';
    rerender(<CameraController planetAngles={planetAngles as any} />);
    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 0.016));
    });

    mockState.warpActive = true;
    rerender(<CameraController planetAngles={planetAngles as any} />);
    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 0.016));
    });
  });

  it('handles settings changes and branches', () => {
    const planetAngles = { current: {} };
    mockState.experienceSettings.transitionAnimations = false;
    mockState.experienceSettings.warpEffects = false;
    mockState.experienceSettings.autoRotate = false;

    const { rerender } = render(<CameraController planetAngles={planetAngles as any} />);

    mockState.activePanel = 'about';
    rerender(<CameraController planetAngles={planetAngles as any} />);
    mockState.activePanel = null;
    rerender(<CameraController planetAngles={planetAngles as any} />);
    expect(mockSetWarpActive).not.toHaveBeenCalled();

    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 0.016));
    });
  });

  it('skips setup and frame updates when controls are not ready', () => {
    attachControlsRef = false;
    render(<CameraController planetAngles={{ current: {} } as any} />);

    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 0.016));
    });

    expect(mockSetWarpActive).not.toHaveBeenCalled();
  });

  it('skips frame updates for non-perspective cameras', () => {
    mockCamera = new THREE.OrthographicCamera();
    render(<CameraController planetAngles={{ current: {} } as any} />);

    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 0.016));
    });

    expect(mockSetWarpActive).not.toHaveBeenCalled();
  });

  it('does not auto-rotate while returning from a focused planet after closing the panel', () => {
    mockState.activePlanet = 'about';
    render(<CameraController planetAngles={{ current: {} } as any} />);

    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 1));
    });

    expect(controlsInstance.azimuthAngle).toBe(0);
  });

  it('keeps idle auto-rotate when no panel or focused planet is active', () => {
    render(<CameraController planetAngles={{ current: {} } as any} />);

    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 1));
    });

    expect(controlsInstance.azimuthAngle).toBe(-0.022);
  });
});

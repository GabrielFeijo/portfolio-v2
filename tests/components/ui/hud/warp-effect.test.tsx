import { WarpEffect } from '@/components/ui/hud/warp-effect';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let mockWarpActive = true;
let mockWarpSetting = true;
let mockRefNull = false;

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: any) =>
    selector({
      warpActive: mockWarpActive,
      experienceSettings: { warpEffects: mockWarpSetting },
    }),
}));

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: (initial: any) => {
      if (initial === null && mockRefNull) {
        return {
          get current() {
            return null;
          },
          set current(_) {},
        };
      }
      return (actual as any).useRef(initial);
    },
  };
});

describe('WarpEffect', () => {
  beforeEach(() => {
    mockWarpActive = true;
    mockWarpSetting = true;
    mockRefNull = false;
  });

  it('renders canvas when active and setting enabled', () => {
    const { container } = render(<WarpEffect />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('does not render when warp is inactive', () => {
    mockWarpActive = false;
    const { container } = render(<WarpEffect />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeInTheDocument();
  });

  it('does not render when setting is disabled', () => {
    mockWarpSetting = false;
    const { container } = render(<WarpEffect />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeInTheDocument();
  });

  it('handles canvas getContext returning null', () => {
    const getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const { container } = render(<WarpEffect />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    getContextSpy.mockRestore();
  });

  it('handles null canvas ref', () => {
    mockRefNull = true;
    const { container } = render(<WarpEffect />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});

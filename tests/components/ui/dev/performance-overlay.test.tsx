import { PerformanceOverlay } from '@/components/ui/dev/performance-overlay';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let mockState: any;

vi.mock('zustand/react/shallow', () => ({ useShallow: (selector: unknown) => selector }));
vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

describe('PerformanceOverlay', () => {
  let frameCallback: ((time: number) => void) | undefined;
  let cancelAnimationFrameSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    frameCallback = undefined;
    mockState = {
      activePanel: null,
      activePlanet: null,
      graphicsMode: null,
      helpOpen: false,
      isLoaded: false,
      settingsOpen: false,
      warpActive: false,
      experienceSettings: undefined,
    };
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frameCallback = callback;
      return 17;
    });
    cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not render or sample frames when disabled', () => {
    render(<PerformanceOverlay enabled={false} />);

    expect(screen.queryByTestId('performance-overlay')).not.toBeInTheDocument();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('samples performance, renders fallback values, and cleans up animation frames', () => {
    const { unmount } = render(<PerformanceOverlay enabled />);

    expect(screen.getByTestId('performance-overlay')).toBeInTheDocument();
    expect(screen.getAllByText('unknown').length).toBeGreaterThan(0);
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);

    act(() => frameCallback?.(100));
    act(() => frameCallback?.(700));

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('600ms')).toBeInTheDocument();

    unmount();
    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(17);
  });

  it('renders active state values and toggles the details', () => {
    mockState = {
      activePanel: 'projects',
      activePlanet: 'projects',
      graphicsMode: 'webgl',
      helpOpen: true,
      isLoaded: true,
      settingsOpen: true,
      warpActive: true,
      experienceSettings: {
        antialias: true,
        asteroidDensity: 0.5,
        customCursor: true,
        dpr: 1.5,
        liteEffects: true,
        nebula: true,
        shadows: true,
        starDensity: 0.7,
      },
    };
    render(<PerformanceOverlay enabled />);

    expect(screen.getByText('WEBGL')).toBeInTheDocument();
    expect(screen.getAllByText('open')).toHaveLength(2);
    expect(screen.getAllByText('on')).toHaveLength(6);

    const collapse = screen.getByRole('button', { name: 'Collapse development stats' });
    fireEvent.click(collapse);
    expect(screen.queryByText('loaded')).not.toBeInTheDocument();

    const expand = screen.getByRole('button', { name: 'Expand development stats' });
    fireEvent.click(expand);
    expect(screen.getByText('loaded')).toBeInTheDocument();
  });
});

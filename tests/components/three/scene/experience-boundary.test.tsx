import { ExperienceBoundary } from '@/components/three/scene/experience-boundary';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const setIsLoaded = vi.fn();
const setGraphicsMode = vi.fn();
const setCursorVariant = vi.fn();
const setExperienceSetting = vi.fn();

vi.mock('@/store/space-store', () => ({
  useSpaceStore: {
    getState: () => ({ setCursorVariant, setExperienceSetting, setGraphicsMode, setIsLoaded }),
  },
}));
vi.mock('@/components/ui/overlays/webgl-error', () => ({
  WebGLError: ({ onContinue }: { onContinue: () => void }) => (
    <button type="button" onClick={onContinue}>
      compatibility-fallback
    </button>
  ),
}));

function BrokenExperience(): never {
  throw new Error('WebGL boot failure');
}

describe('ExperienceBoundary', () => {
  afterEach(() => vi.restoreAllMocks());

  it('catches initialization failures and switches to the 2D scene', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { container } = render(
      <ExperienceBoundary>
        <BrokenExperience />
      </ExperienceBoundary>
    );

    expect(screen.getByText('compatibility-fallback')).toBeInTheDocument();
    expect(setIsLoaded).toHaveBeenCalledWith(true);
    expect(setGraphicsMode).toHaveBeenCalledWith('2d');
    expect(setCursorVariant).toHaveBeenCalledWith('default');
    expect(setExperienceSetting).toHaveBeenCalledWith('customCursor', false);

    fireEvent.click(screen.getByText('compatibility-fallback'));
    expect(container.querySelector('[data-testid="scene-2d-fallback"]')).toBeInTheDocument();
  });
});

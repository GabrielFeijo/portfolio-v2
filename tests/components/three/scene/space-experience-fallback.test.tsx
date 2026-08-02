import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const setIsLoaded = vi.fn();
const setGraphicsMode = vi.fn();
const setCursorVariant = vi.fn();
const setExperienceSetting = vi.fn();

vi.mock('@/utils/webgl-check', () => ({ isWebGLAvailable: () => false }));
vi.mock('@/components/three/register-materials', () => ({}));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('zustand/react/shallow', () => ({ useShallow: (selector: unknown) => selector }));
vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: (state: any) => unknown) =>
    selector({
      experienceSettings: { antialias: false, dpr: 1, shadows: false },
      isLoaded: false,
      setCursorVariant,
      setExperienceSetting,
      setGraphicsMode,
      setIsLoaded,
    }),
}));

import SpaceExperience from '@/components/three/scene/space-experience';

describe('SpaceExperience compatibility mode', () => {
  it('releases loading and allows continuing without WebGL', async () => {
    const { container } = render(<SpaceExperience />);

    expect(screen.getByText('webgl.unavailable.title')).toBeInTheDocument();
    await waitFor(() => expect(setIsLoaded).toHaveBeenCalledWith(true));
    expect(setGraphicsMode).toHaveBeenCalledWith('2d');
    expect(setCursorVariant).toHaveBeenCalledWith('default');
    expect(setExperienceSetting).toHaveBeenCalledWith('customCursor', false);

    fireEvent.click(screen.getByText('webgl.actions.continue_without_3d'));
    expect(container.querySelector('[data-testid="scene-2d-fallback"]')).toBeInTheDocument();
  });
});

import { SettingsOverlay } from '@/components/ui/overlays/settings-overlay';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const applyExperiencePreset = vi.fn();
const closeSettings = vi.fn();
const setExperienceSetting = vi.fn();
const setCursorVariant = vi.fn();
let graphicsMode: 'webgl' | '2d' = 'webgl';

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: any) =>
    selector({
      applyExperiencePreset,
      closeSettings,
      graphicsMode,
      resetExperienceSettings: vi.fn(),
      setCursorVariant,
      setExperienceSetting,
      experienceSettings: {
        transitionAnimations: true,
        warpEffects: true,
        autoRotate: true,
        planetRotation: true,
        customCursor: true,
        nebula: true,
        shootingStars: true,
        orbitalParticles: true,
        shadows: true,
        musicEnabled: true,
        musicVolume: 0.5,
        starDensity: 0.5,
        asteroidDensity: 0.5,
        antialias: true,
        dpr: 1.5,
      },
    }),
}));

vi.mock('zustand/react/shallow', () => ({
  useShallow: (fn: any) => fn,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/hooks/use-focus-trap', () => ({
  useFocusTrap: vi.fn(),
}));

describe('SettingsOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    graphicsMode = 'webgl';
  });

  it('disables the custom cursor control in 2D mode', () => {
    graphicsMode = '2d';
    render(<SettingsOverlay />);

    const customCursor = screen.getByLabelText('settings.controls.custom_cursor');
    expect(customCursor).toBeDisabled();
    expect(customCursor).not.toBeChecked();
  });

  it('calls applyExperiencePreset when a preset is clicked', () => {
    render(<SettingsOverlay />);
    const balancedPreset = screen.getByText('settings.presets.balanced.title');
    fireEvent.click(balancedPreset);
    expect(applyExperiencePreset).toHaveBeenCalledWith('balanced');
  });

  it('updates all settings when controls are interacted with', () => {
    render(<SettingsOverlay />);

    const toggles = [
      'settings.controls.transitions',
      'settings.controls.warp',
      'settings.controls.auto_rotate',
      'settings.controls.planet_rotation',
      'settings.controls.custom_cursor',
      'settings.controls.nebula',
      'settings.controls.shooting_stars',
      'settings.controls.particles',
      'settings.controls.shadows',
      'settings.controls.music',
      'settings.controls.antialias',
      'settings.controls.lite_effects',
    ];

    toggles.forEach((labelTxt) => {
      const input = screen.getByLabelText(labelTxt);
      fireEvent.click(input);
    });
    expect(setExperienceSetting).toHaveBeenCalledTimes(toggles.length);

    const ranges = [
      'settings.controls.volume',
      'settings.controls.stars',
      'settings.controls.asteroids',
      'settings.controls.dpr',
    ];
    ranges.forEach((labelTxt) => {
      const input = screen.getByLabelText(new RegExp(labelTxt));
      fireEvent.change(input, { target: { value: '0.9' } });
    });
    expect(setExperienceSetting).toHaveBeenCalledTimes(toggles.length + ranges.length);
  });

  it('closes when close button or backdrop is clicked', () => {
    render(<SettingsOverlay />);

    const closeBtn = screen.getByLabelText('common.close');
    fireEvent.click(closeBtn);
    expect(closeSettings).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByRole('dialog').querySelector('.absolute.inset-0')!;
    fireEvent.click(backdrop);
    expect(closeSettings).toHaveBeenCalledTimes(2);

    fireEvent.mouseEnter(backdrop);
    expect(setCursorVariant).toHaveBeenCalledWith('default');
  });

  it('stops propagation on dialog click', () => {
    render(<SettingsOverlay />);
    const dialog =
      screen.getByRole('dialog').querySelector('.UISurface') ||
      screen.getByRole('dialog').children[1];
    fireEvent.click(dialog);
    expect(closeSettings).toHaveBeenCalledTimes(0);
  });
});

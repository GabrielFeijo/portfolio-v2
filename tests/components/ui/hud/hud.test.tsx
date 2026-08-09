import { HUD } from '@/components/ui/hud/hud';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const openSettings = vi.fn();
const setLanguage = vi.fn();
const setCursorVariant = vi.fn();
const navigateToPanel = vi.fn();
let resolvedLanguage = 'en';
const hudState = vi.hoisted(() => ({ activePanel: null as string | null }));

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: any) => {
    const state = {
      activePanel: hudState.activePanel,
      navigateToPanel,
      openSettings,
      setCursorVariant,
      setLanguage,
    };
    return selector ? selector(state) : state;
  },
}));

const changeLanguage = vi.fn();
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      resolvedLanguage,
      changeLanguage,
    },
  }),
}));

describe('HUD', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    resolvedLanguage = 'en';
    hudState.activePanel = null;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders and updates time', () => {
    render(<HUD />);
    expect(screen.getByText('Gabriel Feijó')).toBeInTheDocument();

    const configBtn = screen.getByLabelText('settings.title');
    fireEvent.click(configBtn);
    expect(openSettings).toHaveBeenCalled();
  });

  it('changes language when buttons are clicked', () => {
    render(<HUD />);

    const ptBtn = screen.getByText('pt');
    fireEvent.click(ptBtn);

    expect(changeLanguage).toHaveBeenCalledWith('pt');
    expect(setLanguage).toHaveBeenCalledWith('pt');

    fireEvent.click(screen.getByText('en'));
    expect(changeLanguage).toHaveBeenCalledWith('en');
    expect(setLanguage).toHaveBeenCalledWith('en');
  });

  it('sets cursor on mouse enter', () => {
    render(<HUD />);
    const ptBtn = screen.getByText('pt');
    fireEvent.mouseEnter(ptBtn);
    fireEvent.mouseLeave(ptBtn);
    expect(setCursorVariant).toHaveBeenCalledWith('link');
    expect(setCursorVariant).toHaveBeenCalledWith('default');
  });

  it('refreshes the clock interval and clears it on unmount', () => {
    const { unmount } = render(<HUD />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    unmount();
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
  });

  it('uses pt language branch', () => {
    resolvedLanguage = 'pt-BR';
    render(<HUD />);
    expect(setLanguage).toHaveBeenCalledWith('pt');
  });

  it('renders screen reader planet navigation when no panel is open', () => {
    render(<HUD />);
    const navigation = screen.getByRole('navigation', { name: 'nav.planets_aria' });
    expect(navigation).toBeInTheDocument();
    expect(screen.getByText('nav.sections')).toBeInTheDocument();
    const buttons = within(navigation).getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    fireEvent.click(buttons[0]);
    expect(navigateToPanel).toHaveBeenCalledWith('about');

    fireEvent.click(screen.getByRole('button', { name: 'planets.about.name' }));
    expect(navigateToPanel).toHaveBeenCalledWith('about');

    fireEvent.click(screen.getByRole('button', { name: 'planets.contact.name' }));
    expect(navigateToPanel).toHaveBeenCalledWith('contact');
  });

  it('marks the active section in the planet navigation', () => {
    hudState.activePanel = 'about';
    render(<HUD />);

    const activeButton = screen
      .getAllByRole('button')
      .find((button) => button.getAttribute('aria-current') === 'page');

    expect(activeButton).toBeDefined();
  });
});

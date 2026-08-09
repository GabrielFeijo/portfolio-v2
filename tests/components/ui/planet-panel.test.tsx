import { PlanetPanel } from '@/components/ui/planet-panel';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let mockStore = {
  activePanel: null as string | null,
  closePanel: vi.fn(),
  navigateToPanel: vi.fn(),
  setCursorVariant: vi.fn(),
  graphicsMode: 'webgl' as 'webgl' | '2d',
  experienceSettings: { transitionAnimations: true },
};

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: any) => {
    const state = {
      ...mockStore,
      settings: mockStore.experienceSettings,
    };
    return selector ? selector(state) : state;
  },
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

vi.mock('@/components/ui/panels/about-panel', () => ({
  AboutPanel: () => <div data-testid="about-panel">About</div>,
}));
vi.mock('@/components/ui/panels/skills-panel', () => ({
  SkillsPanel: () => <div data-testid="skills-panel">Skills</div>,
}));
vi.mock('@/components/ui/panels/projects-panel', () => ({
  ProjectsPanel: () => <div data-testid="projects-panel">Projects</div>,
}));
vi.mock('@/components/ui/panels/experience-panel', () => ({
  ExperiencePanel: () => <div data-testid="experience-panel">Experience</div>,
}));
vi.mock('@/components/ui/panels/accomplishments-panel', () => ({
  AccomplishmentsPanel: () => <div data-testid="accomplishments-panel">Accomplishments</div>,
}));
vi.mock('@/components/ui/panels/contact-panel', () => ({
  ContactPanel: () => <div data-testid="contact-panel">Contact</div>,
}));

describe('PlanetPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.activePanel = null;
    mockStore.graphicsMode = 'webgl';
    mockStore.experienceSettings = { transitionAnimations: true };
  });

  it('renders nothing when no panel is active', () => {
    const { container } = render(<PlanetPanel />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the active panel and its content', async () => {
    mockStore.activePanel = 'about';
    render(<PlanetPanel />);

    expect(await screen.findByTestId('about-panel')).toBeDefined();
    expect(screen.getByText('planets.about.name')).toBeDefined();
  });

  it.each([
    ['skills', 'skills-panel'],
    ['projects', 'projects-panel'],
    ['experience', 'experience-panel'],
    ['accomplishments', 'accomplishments-panel'],
    ['contact', 'contact-panel'],
  ])('resolves the lazy %s panel module', async (panelId, testId) => {
    mockStore.activePanel = panelId;
    render(<PlanetPanel />);

    expect(await screen.findByTestId(testId)).toBeInTheDocument();
  });

  it('calls closePanel when clicking backdrop', () => {
    mockStore.activePanel = 'about';
    const { container } = render(<PlanetPanel />);

    const backdrop = (container.firstChild as HTMLElement).childNodes[0] as HTMLElement;
    fireEvent.click(backdrop);
    expect(mockStore.closePanel).toHaveBeenCalled();
  });

  it('calls closePanel when clicking close button', () => {
    mockStore.activePanel = 'about';
    render(<PlanetPanel />);

    const closeBtn = screen.getByLabelText('planet_panel.close_aria');
    fireEvent.click(closeBtn);
    expect(mockStore.closePanel).toHaveBeenCalled();
  });

  it('navigates to next panel', () => {
    mockStore.activePanel = 'about';
    render(<PlanetPanel />);

    const nextBtn = screen.getByText('planets.skills.name').closest('button')!;
    fireEvent.click(nextBtn);
    expect(mockStore.navigateToPanel).toHaveBeenCalledWith('skills');
  });

  it('navigates to previous panel', () => {
    mockStore.activePanel = 'skills';
    render(<PlanetPanel />);

    const prevBtn = screen.getByText('planets.about.name').closest('button')!;
    fireEvent.click(prevBtn);
    expect(mockStore.navigateToPanel).toHaveBeenCalledWith('about');
  });

  it('renders correctly for the last panel (no next button)', () => {
    mockStore.activePanel = 'contact';
    render(<PlanetPanel />);

    expect(screen.queryByLabelText(/planet_panel.next_aria/)).toBeNull();
  });

  it('renders correctly for the first panel with no previous button', () => {
    mockStore.activePanel = 'about';
    render(<PlanetPanel />);

    expect(screen.queryByLabelText(/planet_panel.previous_aria/)).toBeNull();
  });

  it('stops click propagation inside the drawer', () => {
    mockStore.activePanel = 'about';
    const { container } = render(<PlanetPanel />);

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);

    const backdrop = (container.firstChild as HTMLElement).childNodes[0] as HTMLElement;
    fireEvent.click(backdrop);

    expect(mockStore.closePanel).toHaveBeenCalledTimes(1);
  });

  it('updates cursor variant through nav hover handlers', () => {
    mockStore.activePanel = 'skills';
    render(<PlanetPanel />);

    const prevBtn = screen.getByText('planets.about.name').closest('button')!;
    fireEvent.mouseEnter(prevBtn);
    fireEvent.mouseLeave(prevBtn);

    expect(mockStore.setCursorVariant).toHaveBeenCalledWith('link');
    expect(mockStore.setCursorVariant).toHaveBeenCalledWith('default');
  });

  it('updates cursor variant on mouse enter backdrop', () => {
    mockStore.activePanel = 'about';
    const { container } = render(<PlanetPanel />);

    const backdrop = (container.firstChild as HTMLElement).childNodes[0] as HTMLElement;
    fireEvent.mouseEnter(backdrop);
    expect(mockStore.setCursorVariant).toHaveBeenCalledWith('default');
  });

  it('renders with transitions disabled', async () => {
    mockStore.activePanel = 'skills';
    mockStore.experienceSettings = { transitionAnimations: false };
    render(<PlanetPanel />);
    expect(await screen.findByTestId('skills-panel')).toBeInTheDocument();
  });

  it('uses the optimized composition profile only in 2D mode', async () => {
    mockStore.activePanel = 'projects';
    mockStore.graphicsMode = '2d';
    const { container } = render(<PlanetPanel />);

    const dialog = await screen.findByRole('dialog');
    const overlay = container.firstChild as HTMLElement;
    const backdrop = overlay.childNodes[0] as HTMLElement;
    expect(overlay).toHaveClass('panel-overlay-2d');
    expect(dialog).toHaveClass('panel-mode-2d');
    expect(dialog).toHaveAttribute('data-graphics-mode', '2d');
    expect(backdrop).toHaveClass('panel-backdrop');
  });

  it('preserves the standard composition profile in WebGL mode', async () => {
    mockStore.activePanel = 'projects';
    render(<PlanetPanel />);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).not.toHaveClass('panel-mode-2d');
    expect(dialog).toHaveAttribute('data-graphics-mode', 'webgl');
  });
});
